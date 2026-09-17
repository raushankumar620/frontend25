import React, { useState, useEffect, useMemo, useRef } from 'react';
import { analyticsService } from '../../../services/analyticsService';
import type { MessageTimeseriesPoint, OverviewKPIs } from '../../analytics/types';
import {
  TrendingUp,
  Calendar,
  CheckCircle2,
  Send,
  Eye,
  MessageSquare,
  Sparkles,
  Layers,
} from 'lucide-react';

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
  const [selectedRange, setSelectedRange] = useState<RangeOption>('7 Days');
  const [timeseriesData, setTimeseriesData] = useState<MessageTimeseriesPoint[]>(initialTimeseries);
  const [loading, setLoading] = useState<boolean>(initialLoading);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [visibleSeries, setVisibleSeries] = useState({
    sent: true,
    delivered: true,
    read: true,
    replied: true,
  });
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

  // Construct continuous timeline points
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
      const cur = new Date(startObj);
      while (cur <= endObj) {
        const yyyy = cur.getFullYear();
        const mm = String(cur.getMonth() + 1).padStart(2, '0');
        const dd = String(cur.getDate()).padStart(2, '0');
        const rawKey = `${yyyy}-${mm}-${dd}`;
        const fullDate = `${dd}/${mm}/${yyyy}`;
        const match = dataMap.get(rawKey);

        points.push({
          date: fullDate,
          rawKey: fullDate,
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

  // Total aggregates for period summary
  const totals = useMemo(() => {
    const sent = chartPoints.reduce((acc, p) => acc + p.sent, 0);
    const delivered = chartPoints.reduce((acc, p) => acc + p.delivered, 0);
    const read = chartPoints.reduce((acc, p) => acc + p.read, 0);
    const replied = chartPoints.reduce((acc, p) => acc + p.replied, 0);
    const deliveryRate = sent > 0 ? Math.round((delivered / sent) * 100) : 100;
    const readRate = delivered > 0 ? Math.round((read / delivered) * 100) : 0;
    return { sent, delivered, read, replied, deliveryRate, readRate };
  }, [chartPoints]);

  // Dynamic Y-axis scale calculation
  const maxDataVal = useMemo(() => {
    let max = 0;
    chartPoints.forEach((p) => {
      if (visibleSeries.sent) max = Math.max(max, p.sent);
      if (visibleSeries.delivered) max = Math.max(max, p.delivered);
      if (visibleSeries.read) max = Math.max(max, p.read);
      if (visibleSeries.replied) max = Math.max(max, p.replied);
    });
    return max;
  }, [chartPoints, visibleSeries]);

  const yAxisTicks = useMemo(() => {
    const targetMax = maxDataVal > 0 ? maxDataVal * 1.25 : 10;
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

  // SVG Chart Dimensions (Spacious & Clean)
  const width = 1000;
  const height = 240;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 15;
  const padBottom = 46;

  const innerWidth = width - padLeft - padRight;
  const innerHeight = height - padTop - padBottom;

  const getX = (index: number) => {
    if (chartPoints.length <= 1) return padLeft + innerWidth / 2;
    return padLeft + (index / (chartPoints.length - 1)) * innerWidth;
  };

  const getY = (val: number) => {
    return padTop + innerHeight - (val / yMax) * innerHeight;
  };

  // Smooth spline curve generator
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

  // Generate Area Fill Path
  const generateAreaPath = (accessor: (p: ChartPoint) => number) => {
    if (chartPoints.length === 0) return '';
    const linePath = generatePath(accessor);
    const startX = getX(0);
    const endX = getX(chartPoints.length - 1);
    const bottomY = padTop + innerHeight;
    return `${linePath} L ${endX},${bottomY} L ${startX},${bottomY} Z`;
  };

  const sentPath = useMemo(() => generatePath((p) => p.sent), [chartPoints, yMax]);
  const deliveredPath = useMemo(() => generatePath((p) => p.delivered), [chartPoints, yMax]);
  const readPath = useMemo(() => generatePath((p) => p.read), [chartPoints, yMax]);
  const repliedPath = useMemo(() => generatePath((p) => p.replied), [chartPoints, yMax]);

  const sentAreaPath = useMemo(() => generateAreaPath((p) => p.sent), [chartPoints, yMax]);
  const deliveredAreaPath = useMemo(() => generateAreaPath((p) => p.delivered), [chartPoints, yMax]);

  // Mouse hover tracking
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

  // Adaptive Label interval to strictly prevent text overlapping
  const labelInterval = useMemo(() => {
    if (selectedRange === 'Today') return 3; // every 3 hours
    if (selectedRange === '7 Days') return 1; // everyday
    if (selectedRange === '30 Days') return 3; // every 3 days
    return 7; // every week for 3 months
  }, [selectedRange]);

  const toggleSeries = (key: keyof typeof visibleSeries) => {
    setVisibleSeries((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white border border-[#E2EAE6] rounded-2xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(1,59,35,0.04)] space-y-4">
      {/* Header Row: Clean Title on Left & Range Buttons on Right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0F5F2]">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-[#14201C] tracking-tight">
            Message Analytics
          </h3>
          <p className="text-xs text-[#5F7069] mt-0.5 font-medium">
            Real-time delivery, read rates, and response metrics
          </p>
        </div>

        {/* Range Selector Filter Tabs */}
        <div className="flex items-center bg-[#F6FAF8] p-1 rounded-xl border border-[#E2EAE6] self-start sm:self-auto">
          {(['Today', '7 Days', '30 Days', '3 Months'] as RangeOption[]).map((range) => {
            const isSelected = selectedRange === range;
            return (
              <button
                key={range}
                onClick={() => {
                  setSelectedRange(range);
                  setHoverIndex(null);
                }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#05A222] text-white shadow-xs'
                    : 'text-[#5F7069] hover:text-[#14201C] hover:bg-white/60'
                }`}
              >
                {range}
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="px-3 py-1 rounded-lg bg-[#F6FAF8] border border-[#E2EAE6] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
          <span className="text-[11px] text-[#5F7069] font-medium">Total Sent:</span>
          <strong className="text-xs font-bold text-[#14201C]">{totals.sent.toLocaleString()}</strong>
        </div>

        <div className="px-3 py-1 rounded-lg bg-[#E9F9EE] border border-[#C4EBD0] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#05A222]" />
          <span className="text-[11px] text-[#006736] font-medium">Delivered:</span>
          <strong className="text-xs font-bold text-[#006736]">{totals.delivered.toLocaleString()} ({totals.deliveryRate}%)</strong>
        </div>

        <div className="px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
          <span className="text-[11px] text-amber-800 font-medium">Read Rate:</span>
          <strong className="text-xs font-bold text-amber-800">{totals.readRate}%</strong>
        </div>

        <div className="px-3 py-1 rounded-lg bg-purple-50 border border-purple-200 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
          <span className="text-[11px] text-purple-800 font-medium">Inbound Replies:</span>
          <strong className="text-xs font-bold text-purple-800">{totals.replied.toLocaleString()}</strong>
        </div>
      </div>

      {/* Interactive Chart Canvas */}
      <div className="relative w-full overflow-x-auto select-none pt-2">
        {loading && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-xl">
            <div className="text-xs font-bold text-[#05A222] flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#C4EBD0] shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#05A222] animate-ping" />
              Syncing analytics...
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
          <defs>
            {/* Delivered Area Gradient */}
            <linearGradient id="deliveredGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#05A222" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#05A222" stopOpacity="0.0" />
            </linearGradient>

            {/* Sent Area Gradient */}
            <linearGradient id="sentGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
            </linearGradient>
          </defs>

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
                  stroke="#EBF2EE"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={padLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="10"
                  fontFamily="sans-serif"
                  fill="#8A9993"
                  fontWeight="600"
                >
                  {tickVal.toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* Base Zero Line */}
          <line
            x1={padLeft}
            y1={padTop + innerHeight}
            x2={width - padRight}
            y2={padTop + innerHeight}
            stroke="#DDE7E2"
            strokeWidth="1.5"
          />

          {/* 1. Sent Area & Line (Blue) */}
          {visibleSeries.sent && (
            <>
              <path d={sentAreaPath} fill="url(#sentGrad)" />
              <path
                d={sentPath}
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
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
            </>
          )}

          {/* 2. Delivered Area & Line (Emerald) */}
          {visibleSeries.delivered && (
            <>
              <path d={deliveredAreaPath} fill="url(#deliveredGrad)" />
              <path
                d={deliveredPath}
                fill="none"
                stroke="#05A222"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {chartPoints.map((p, idx) => (
                <circle
                  key={`deliv-pt-${idx}`}
                  cx={getX(idx)}
                  cy={getY(p.delivered)}
                  r="4"
                  fill="#FFFFFF"
                  stroke="#05A222"
                  strokeWidth="2.5"
                />
              ))}
            </>
          )}

          {/* 3. Read Line (Amber) */}
          {visibleSeries.read && (
            <>
              <path
                d={readPath}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2.5"
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
                  stroke="#F59E0B"
                  strokeWidth="2"
                />
              ))}
            </>
          )}

          {/* 4. Replied Line (Violet) */}
          {visibleSeries.replied && (
            <>
              <path
                d={repliedPath}
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="2.5"
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
                  stroke="#8B5CF6"
                  strokeWidth="2"
                />
              ))}
            </>
          )}

          {/* X-Axis Slanted Date Labels - Show Every Date */}
          {chartPoints.map((p, idx) => {
            const x = getX(idx);
            const y = padTop + innerHeight + 12;
            return (
              <text
                key={`lbl-${idx}`}
                x={x}
                y={y}
                transform={`rotate(-45, ${x}, ${y})`}
                textAnchor="end"
                fontSize="8"
                fontFamily="sans-serif"
                fill="#6B7280"
                fontWeight="500"
              >
                {p.rawKey}
              </text>
            );
          })}

          {/* Active Hover Crosshair Line */}
          {hoverIndex !== null && activeX !== null && activePoint && (
            <g>
              <line
                x1={activeX}
                y1={padTop}
                x2={activeX}
                y2={padTop + innerHeight}
                stroke="#14201C"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.6"
              />
              {visibleSeries.sent && (
                <circle cx={activeX} cy={getY(activePoint.sent)} r="5.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2.5" />
              )}
              {visibleSeries.delivered && (
                <circle cx={activeX} cy={getY(activePoint.delivered)} r="6.5" fill="#05A222" stroke="#FFFFFF" strokeWidth="3" />
              )}
              {visibleSeries.read && (
                <circle cx={activeX} cy={getY(activePoint.read)} r="5.5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2.5" />
              )}
              {visibleSeries.replied && (
                <circle cx={activeX} cy={getY(activePoint.replied)} r="5.5" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="2.5" />
              )}
            </g>
          )}
        </svg>

        {/* Premium Dark Glass Floating Tooltip */}
        {hoverIndex !== null && activePoint && activeX !== null && (
          <div
            style={{
              left: `${Math.min(Math.max((activeX / width) * 100, 14), 86)}%`,
              top: '10px',
            }}
            className="absolute transform -translate-x-1/2 pointer-events-none z-30 bg-[#14201C]/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl border border-white/10 text-xs w-56 transition-all duration-75"
          >
            <div className="font-black border-b border-white/10 pb-1.5 mb-2 text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#05A222]" />
                {activePoint.date}
              </span>
              <span className="text-[10px] uppercase font-bold text-[#05A222] bg-[#05A222]/20 px-1.5 py-0.5 rounded">
                Live
              </span>
            </div>

            <div className="space-y-1.5 font-medium">
              <div className="flex items-center justify-between text-blue-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" /> Sent:
                </span>
                <strong className="text-white font-bold">{activePoint.sent.toLocaleString()}</strong>
              </div>

              <div className="flex items-center justify-between text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#05A222]" /> Delivered:
                </span>
                <strong className="text-white font-bold">{activePoint.delivered.toLocaleString()}</strong>
              </div>

              <div className="flex items-center justify-between text-amber-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> Read:
                </span>
                <strong className="text-white font-bold">{activePoint.read.toLocaleString()}</strong>
              </div>

              <div className="flex items-center justify-between text-purple-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" /> Replied:
                </span>
                <strong className="text-white font-bold">{activePoint.replied.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Clickable Legend Bar */}
      <div className="pt-3 border-t border-[#F0F5F2] flex flex-wrap items-center justify-center sm:justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#5F7069] uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5 text-[#05A222]" />
          <span>Filter Lines:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => toggleSeries('sent')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              visibleSeries.sent
                ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-2xs'
                : 'bg-white text-gray-400 border-gray-200 line-through opacity-60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
            <span>Sent</span>
          </button>

          <button
            onClick={() => toggleSeries('delivered')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              visibleSeries.delivered
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-2xs'
                : 'bg-white text-gray-400 border-gray-200 line-through opacity-60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#05A222]" />
            <span>Delivered</span>
          </button>

          <button
            onClick={() => toggleSeries('read')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              visibleSeries.read
                ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-2xs'
                : 'bg-white text-gray-400 border-gray-200 line-through opacity-60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <span>Read</span>
          </button>

          <button
            onClick={() => toggleSeries('replied')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              visibleSeries.replied
                ? 'bg-purple-50 text-purple-800 border-purple-200 shadow-2xs'
                : 'bg-white text-gray-400 border-gray-200 line-through opacity-60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
            <span>Replied</span>
          </button>
        </div>
      </div>
    </div>
  );
};
