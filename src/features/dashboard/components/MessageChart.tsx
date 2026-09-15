import React, { useState, useEffect, useMemo, useRef } from 'react';
import { analyticsService } from '../../../services/analyticsService';
import type { MessageTimeseriesPoint, OverviewKPIs } from '../../analytics/types';

interface MessageChartProps {
  timeseries?: MessageTimeseriesPoint[];
  overview?: OverviewKPIs | null;
  loading?: boolean;
}

type RangeOption = 'Today' | '7 Days' | '30 Days' | '3 Months';

interface ChartPoint {
  date: string;
  rawKey: string;
  sent: number;
  delivered: number;
  read: number;
  replied: number;
}

export const MessageChart: React.FC<MessageChartProps> = ({
  timeseries: initialTimeseries = [],
  loading: initialLoading = false,
}) => {
  const [selectedRange, setSelectedRange] = useState<RangeOption>('30 Days');
  const [timeseriesData, setTimeseriesData] = useState<MessageTimeseriesPoint[]>(initialTimeseries);
  const [loading, setLoading] = useState<boolean>(initialLoading);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Helper to calculate exact start and end timestamps
  const getDateRange = (range: RangeOption) => {
    const end = new Date();
    const start = new Date();

    if (range === 'Today') {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        isHourly: true,
        startObj: start,
        endObj: end,
      };
    }

    if (range === '7 Days') {
      start.setDate(end.getDate() - 6);
      start.setHours(0, 0, 0, 0);
    } else if (range === '30 Days') {
      start.setDate(end.getDate() - 29);
      start.setHours(0, 0, 0, 0);
    } else if (range === '3 Months') {
      start.setDate(end.getDate() - 89);
      start.setHours(0, 0, 0, 0);
    }

    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      isHourly: false,
      startObj: start,
      endObj: end,
    };
  };

  // Fetch real analytics data when range filter changes
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const { startDate, endDate } = getDateRange(selectedRange);
        const res = await analyticsService.getMessageAnalytics(startDate, endDate);
        if (isMounted && res?.timeseries) {
          setTimeseriesData(res.timeseries);
        }
      } catch (err) {
        console.error('Failed to load message analytics:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [selectedRange]);

  // Construct continuous timeline points (Hourly for 'Today', Daily for 7d/30d/3m)
  const chartPoints: ChartPoint[] = useMemo(() => {
    const { isHourly, startObj, endObj } = getDateRange(selectedRange);
    const dataMap = new Map<string, MessageTimeseriesPoint>();

    (timeseriesData || []).forEach((item) => {
      if (item.date) {
        dataMap.set(item.date, item);
      }
    });

    const points: ChartPoint[] = [];

    if (isHourly) {
      // 24 hourly buckets for Today
      const current = new Date(startObj);
      const yyyy = current.getFullYear();
      const mm = String(current.getMonth() + 1).padStart(2, '0');
      const dd = String(current.getDate()).padStart(2, '0');

      for (let h = 0; h < 24; h++) {
        const hourStr = String(h).padStart(2, '0');
        const rawKey = `${yyyy}-${mm}-${dd} ${hourStr}:00`;
        const displayLabel = `${hourStr}:00`;
        const match = dataMap.get(rawKey);

        points.push({
          date: `${dd}/${mm}/${yyyy} ${displayLabel}`,
          rawKey: displayLabel,
          sent: match?.sent || 0,
          delivered: match?.delivered || 0,
          read: match?.read || 0,
          replied: match?.inbound || 0,
        });
      }
    } else {
      // Daily points from startObj to endObj
      const cur = new Date(startObj);
      while (cur <= endObj) {
        const yyyy = cur.getFullYear();
        const mm = String(cur.getMonth() + 1).padStart(2, '0');
        const dd = String(cur.getDate()).padStart(2, '0');
        const rawKey = `${yyyy}-${mm}-${dd}`;
        const displayLabel = `${dd}/${mm}/${yyyy}`;
        const match = dataMap.get(rawKey);

        points.push({
          date: displayLabel,
          rawKey: displayLabel,
          sent: match?.sent || 0,
          delivered: match?.delivered || 0,
          read: match?.read || 0,
          replied: match?.inbound || 0,
        });

        cur.setDate(cur.getDate() + 1);
      }
    }

    return points;
  }, [selectedRange, timeseriesData]);

  // Dynamic Y-axis scale calculation
  const maxDataVal = useMemo(() => {
    let max = 0;
    chartPoints.forEach((p) => {
      max = Math.max(max, p.sent, p.delivered, p.read, p.replied);
    });
    return max;
  }, [chartPoints]);

  const yAxisTicks = useMemo(() => {
    const targetMax = maxDataVal > 0 ? maxDataVal * 1.15 : 10;
    const numTicks = 4;
    const rawStep = targetMax / numTicks;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep || 1)));
    const step = Math.ceil(rawStep / magnitude) * magnitude || 1;
    const ticks: number[] = [];
    for (let i = 0; i <= numTicks; i++) {
      ticks.push(i * step);
    }
    return ticks;
  }, [maxDataVal]);

  const yMax = yAxisTicks[yAxisTicks.length - 1] || 10;

  // SVG Chart Dimensions (Compact & Optimized)
  const width = 1000;
  const height = 210;
  const padLeft = 55;
  const padRight = 25;
  const padTop = 15;
  const padBottom = 42;

  const innerWidth = width - padLeft - padRight;
  const innerHeight = height - padTop - padBottom;

  const getX = (index: number) => {
    if (chartPoints.length <= 1) return padLeft + innerWidth / 2;
    return padLeft + (index / (chartPoints.length - 1)) * innerWidth;
  };

  const getY = (val: number) => {
    return padTop + innerHeight - (val / yMax) * innerHeight;
  };

  // Smooth spline path generator
  const generatePath = (accessor: (p: ChartPoint) => number) => {
    if (chartPoints.length === 0) return '';
    const coords = chartPoints.map((p, idx) => ({
      x: getX(idx),
      y: getY(accessor(p)),
    }));

    if (coords.length === 1) return `M ${coords[0].x},${coords[0].y}`;

    let path = `M ${coords[0].x},${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const cx = (p0.x + p1.x) / 2;
      path += ` C ${cx},${p0.y} ${cx},${p1.y} ${p1.x},${p1.y}`;
    }
    return path;
  };

  const sentPath = useMemo(() => generatePath((p) => p.sent), [chartPoints, yMax]);
  const deliveredPath = useMemo(() => generatePath((p) => p.delivered), [chartPoints, yMax]);
  const readPath = useMemo(() => generatePath((p) => p.read), [chartPoints, yMax]);
  const repliedPath = useMemo(() => generatePath((p) => p.replied), [chartPoints, yMax]);

  // Robust mouse hover tracking
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || chartPoints.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;

    let closestIdx = 0;
    let minDistance = Infinity;

    chartPoints.forEach((_, idx) => {
      const x = getX(idx);
      const dist = Math.abs(x - mouseX);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = idx;
      }
    });

    setHoverIndex(closestIdx);
  };

  const activePoint = hoverIndex !== null ? chartPoints[hoverIndex] : null;
  const activeX = hoverIndex !== null ? getX(hoverIndex) : null;

  // Label interval according to density
  const labelInterval = useMemo(() => {
    if (selectedRange === 'Today') return 2; // Every 2 hours
    if (selectedRange === '7 Days') return 1; // Every day
    if (selectedRange === '30 Days') return 1; // Every day
    return 4; // Every 4 days for 3 months
  }, [selectedRange]);

  return (
    <div className="bg-white border border-[#E2EAE6] rounded-2xl p-4.5 sm:p-5 shadow-xs">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <h3 className="text-xl font-bold text-[#14201C] tracking-tight">
          Message Analytics
        </h3>

        {/* Range Selector Buttons */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {(['Today', '7 Days', '30 Days', '3 Months'] as RangeOption[]).map((range) => {
            const isSelected = selectedRange === range;
            return (
              <button
                key={range}
                onClick={() => {
                  setSelectedRange(range);
                  setHoverIndex(null);
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
                  isSelected
                    ? 'bg-[#16A34A] text-white border-[#16A34A] shadow-xs'
                    : 'bg-white text-[#5F7069] border-[#E2EAE6] hover:bg-[#F6FAF8] hover:text-[#14201C]'
                }`}
              >
                {range}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Chart Canvas */}
      <div className="relative w-full overflow-x-auto select-none">
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-20 flex items-center justify-center">
            <div className="text-xs font-semibold text-[#16A34A] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping" />
              Updating analytics...
            </div>
          </div>
        )}

        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[700px] overflow-visible cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIndex(null)}
        >
          {/* Horizontal Dotted Grid Lines */}
          {yAxisTicks.map((tickVal, i) => {
            const y = getY(tickVal);
            return (
              <g key={`y-${i}`}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <text
                  x={padLeft - 10}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="10"
                  fontFamily="sans-serif"
                  fill="#6B7280"
                  fontWeight="500"
                >
                  {tickVal.toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* Vertical Dotted Grid Lines */}
          {chartPoints.map((_, idx) => {
            if (idx % labelInterval !== 0 && idx !== chartPoints.length - 1) return null;
            const x = getX(idx);
            return (
              <line
                key={`vg-${idx}`}
                x1={x}
                y1={padTop}
                x2={x}
                y2={padTop + innerHeight}
                stroke="#F3F4F6"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            );
          })}

          {/* Baseline Border */}
          <line
            x1={padLeft}
            y1={padTop + innerHeight}
            x2={width - padRight}
            y2={padTop + innerHeight}
            stroke="#E5E7EB"
            strokeWidth="1"
          />

          {/* 1. Sent Line (Blue) */}
          <path
            d={sentPath}
            fill="none"
            stroke="#2563EB"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {chartPoints.map((p, idx) => (
            <circle
              key={`sent-pt-${idx}`}
              cx={getX(idx)}
              cy={getY(p.sent)}
              r="3.5"
              fill="#FFFFFF"
              stroke="#2563EB"
              strokeWidth="2"
            />
          ))}

          {/* 2. Delivered Line (Green) */}
          <path
            d={deliveredPath}
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {chartPoints.map((p, idx) => (
            <circle
              key={`deliv-pt-${idx}`}
              cx={getX(idx)}
              cy={getY(p.delivered)}
              r="3.5"
              fill="#FFFFFF"
              stroke="#10B981"
              strokeWidth="2"
            />
          ))}

          {/* 3. Read Line (Orange) */}
          <path
            d={readPath}
            fill="none"
            stroke="#F97316"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {chartPoints.map((p, idx) => (
            <circle
              key={`read-pt-${idx}`}
              cx={getX(idx)}
              cy={getY(p.read)}
              r="3.5"
              fill="#FFFFFF"
              stroke="#F97316"
              strokeWidth="2"
            />
          ))}

          {/* 4. Replied Line (Purple) */}
          <path
            d={repliedPath}
            fill="none"
            stroke="#A855F7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {chartPoints.map((p, idx) => (
            <circle
              key={`replied-pt-${idx}`}
              cx={getX(idx)}
              cy={getY(p.replied)}
              r="3.5"
              fill="#FFFFFF"
              stroke="#A855F7"
              strokeWidth="2"
            />
          ))}

          {/* X-Axis Slanted Labels */}
          {chartPoints.map((p, idx) => {
            if (idx % labelInterval !== 0 && idx !== chartPoints.length - 1) return null;
            const x = getX(idx);
            const y = padTop + innerHeight + 12;
            return (
              <text
                key={`lbl-${idx}`}
                x={x}
                y={y}
                transform={`rotate(-45, ${x}, ${y})`}
                textAnchor="end"
                fontSize="8.5"
                fontFamily="sans-serif"
                fill="#6B7280"
                fontWeight="500"
              >
                {p.rawKey}
              </text>
            );
          })}

          {/* Hover Guides & Point Markers */}
          {hoverIndex !== null && activeX !== null && activePoint && (
            <g>
              <line
                x1={activeX}
                y1={padTop}
                x2={activeX}
                y2={padTop + innerHeight}
                stroke="#6B7280"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              <circle cx={activeX} cy={getY(activePoint.sent)} r="5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx={activeX} cy={getY(activePoint.delivered)} r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx={activeX} cy={getY(activePoint.read)} r="5" fill="#F97316" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx={activeX} cy={getY(activePoint.replied)} r="5" fill="#A855F7" stroke="#FFFFFF" strokeWidth="1.5" />
            </g>
          )}
        </svg>

        {/* Hover Info Box (Clamped neatly within container) */}
        {hoverIndex !== null && activePoint && activeX !== null && (
          <div
            style={{
              left: `${Math.min(Math.max((activeX / width) * 100, 12), 88)}%`,
              top: '12px',
            }}
            className="absolute transform -translate-x-1/2 pointer-events-none z-30 bg-[#1F2937]/95 backdrop-blur-md text-white px-3.5 py-2.5 rounded-xl shadow-2xl border border-gray-700 text-xs w-52 transition-all duration-75"
          >
            <div className="font-bold border-b border-gray-700 pb-1 mb-1.5 text-gray-200 flex items-center justify-between">
              <span>{activePoint.date}</span>
              <span className="text-[10px] text-gray-400">Live</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-blue-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" /> Sent:
                </span>
                <strong className="text-white font-bold">{activePoint.sent.toLocaleString()}</strong>
              </div>

              <div className="flex items-center justify-between text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> Delivered:
                </span>
                <strong className="text-white font-bold">{activePoint.delivered.toLocaleString()}</strong>
              </div>

              <div className="flex items-center justify-between text-orange-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" /> Read:
                </span>
                <strong className="text-white font-bold">{activePoint.read.toLocaleString()}</strong>
              </div>

              <div className="flex items-center justify-between text-purple-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7]" /> Replied:
                </span>
                <strong className="text-white font-bold">{activePoint.replied.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Centered Legend */}
      <div className="mt-4 pt-2 border-t border-[#F0F5F2] flex items-center justify-center gap-6 text-xs font-semibold text-[#374151]">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#2563EB]" />
          <span>Sent</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#10B981]" />
          <span>Delivered</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#F97316]" />
          <span>Read</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#A855F7]" />
          <span>Replied</span>
        </div>
      </div>
    </div>
  );
};
