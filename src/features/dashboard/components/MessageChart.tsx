import React, { useState, useEffect, useMemo, useRef } from 'react';
import { analyticsService } from '../../../services/analyticsService';
import type { MessageTimeseriesPoint, OverviewKPIs } from '../../analytics/types';
import { ChevronDown, Loader2, Check } from 'lucide-react';

interface MessageChartProps {
  timeseries?: MessageTimeseriesPoint[];
  overview?: OverviewKPIs | null;
  loading?: boolean;
}

type RangeOption = 'Last 7 Days' | 'Today' | 'Last 30 Days' | 'Last 3 Months';

interface DataPoint {
  dateLabel: string;
  showLabel: boolean;
  fullDate: string;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
}

export const MessageChart: React.FC<MessageChartProps> = ({
  timeseries: initialTimeseries = [],
  loading: initialLoading = false,
}) => {
  const [selectedRange, setSelectedRange] = useState<RangeOption>('Last 7 Days');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [timeseriesData, setTimeseriesData] = useState<MessageTimeseriesPoint[]>(initialTimeseries);
  const [loading, setLoading] = useState<boolean>(initialLoading);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync with prop when initialTimeseries changes
  useEffect(() => {
    if (selectedRange === 'Last 7 Days' && initialTimeseries && initialTimeseries.length > 0) {
      setTimeseriesData(initialTimeseries);
    }
  }, [initialTimeseries, selectedRange]);

  // Fetch real analytics data whenever filter range changes
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const now = new Date();
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

        if (selectedRange === 'Today') {
          // start of today to end of today
        } else if (selectedRange === 'Last 7 Days') {
          start.setDate(now.getDate() - 6);
        } else if (selectedRange === 'Last 30 Days') {
          start.setDate(now.getDate() - 29);
        } else {
          start.setDate(now.getDate() - 89);
        }

        const res = await analyticsService
          .getMessageAnalytics(start.toISOString(), end.toISOString())
          .catch(() => null);

        if (isMounted) {
          setTimeseriesData(res?.timeseries || []);
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

  // Construct chart points directly from real-time backend data
  const points: DataPoint[] = useMemo(() => {
    const now = new Date();
    const result: DataPoint[] = [];

    // Map backend data by date string and date+hour
    const dataMap = new Map<string, { sent: number; delivered: number; read: number; failed: number; inbound: number }>();

    (timeseriesData || []).forEach((item) => {
      if (!item.date) return;
      // item.date can be "2026-09-18" or "2026-09-18 14:00" or ISO
      const exactKey = item.date.trim();
      const dateOnlyKey = item.date.replace(' ', 'T').split('T')[0];

      // Exact key entry
      dataMap.set(exactKey, {
        sent: item.sent || 0,
        delivered: item.delivered || 0,
        read: item.read || 0,
        failed: item.failed || 0,
        inbound: item.inbound || 0,
      });

      // Accumulate into date-only entry
      if (!dataMap.has(dateOnlyKey)) {
        dataMap.set(dateOnlyKey, {
          sent: item.sent || 0,
          delivered: item.delivered || 0,
          read: item.read || 0,
          failed: item.failed || 0,
          inbound: item.inbound || 0,
        });
      } else {
        const existing = dataMap.get(dateOnlyKey)!;
        existing.sent += item.sent || 0;
        existing.delivered += item.delivered || 0;
        existing.read += item.read || 0;
        existing.failed += item.failed || 0;
        existing.inbound += item.inbound || 0;
      }
    });

    if (selectedRange === 'Today') {
      // 12 points: 00:00, 02:00, 04:00, ..., 22:00
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      for (let h = 0; h < 24; h += 2) {
        const hourStr = `${String(h).padStart(2, '0')}:00`;
        const nextH = h + 2;
        const showLabel = h % 4 === 0;

        let sent = 0;
        let delivered = 0;
        let read = 0;
        let failed = 0;

        (timeseriesData || []).forEach((item) => {
          if (!item.date) return;
          if (item.date.startsWith(todayStr)) {
            let itemHour = -1;
            if (item.date.includes(':')) {
              const timePart = item.date.split(' ')[1] || item.date.split('T')[1] || item.date;
              const parsedH = parseInt(timePart.split(':')[0], 10);
              if (!isNaN(parsedH)) itemHour = parsedH;
            }
            if (itemHour >= h && itemHour < nextH) {
              sent += item.sent || 0;
              delivered += item.delivered || 0;
              read += item.read || 0;
              failed += item.failed || 0;
            }
          }
        });

        // 12-hour format for tooltip
        const period = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 === 0 ? 12 : h % 12;

        result.push({
          dateLabel: hourStr,
          showLabel,
          fullDate: `Today, ${displayH}:00 ${period}`,
          sent,
          delivered,
          read,
          failed,
        });
      }
    } else if (selectedRange === 'Last 7 Days') {
      // Exactly 7 daily points (e.g. 6 days ago -> today)
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const isoKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
        const fullDate = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

        const item = dataMap.get(isoKey);

        result.push({
          dateLabel,
          showLabel: true,
          fullDate,
          sent: item?.sent || 0,
          delivered: item?.delivered || 0,
          read: item?.read || 0,
          failed: item?.failed || 0,
        });
      }
    } else if (selectedRange === 'Last 30 Days') {
      // 30 daily points
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const isoKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
        const fullDate = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        // Show label every 5 days and on last day
        const showLabel = i % 5 === 0 || i === 0;

        const item = dataMap.get(isoKey);

        result.push({
          dateLabel,
          showLabel,
          fullDate,
          sent: item?.sent || 0,
          delivered: item?.delivered || 0,
          read: item?.read || 0,
          failed: item?.failed || 0,
        });
      }
    } else {
      // Last 3 Months: 13 weekly points
      for (let i = 12; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i * 7);
        const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
        const fullDate = `Week of ${d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}`;
        const showLabel = i % 2 === 0 || i === 0;

        let sent = 0;
        let delivered = 0;
        let read = 0;
        let failed = 0;

        (timeseriesData || []).forEach((item) => {
          if (!item.date) return;
          const itemKey = item.date.split('T')[0].split(' ')[0];
          const itemDate = new Date(itemKey);
          const diffDays = (d.getTime() - itemDate.getTime()) / (1000 * 3600 * 24);
          if (diffDays >= 0 && diffDays < 7) {
            sent += item.sent || 0;
            delivered += item.delivered || 0;
            read += item.read || 0;
            failed += item.failed || 0;
          }
        });

        result.push({
          dateLabel,
          showLabel,
          fullDate,
          sent,
          delivered,
          read,
          failed,
        });
      }
    }

    return result;
  }, [timeseriesData, selectedRange]);

  // Geometry calculations for SVG
  const width = 800;
  const height = 260;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 35;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  // Dynamic max scale calculation
  const maxVal = useMemo(() => {
    let max = 0;
    points.forEach((p) => {
      max = Math.max(max, p.sent, p.delivered, p.read, p.failed);
    });

    if (max === 0) return 10;
    if (max <= 10) return 10;
    if (max <= 25) return 25;
    if (max <= 50) return 50;
    if (max <= 100) return 100;
    if (max <= 250) return 250;
    if (max <= 500) return 500;
    if (max <= 1000) return 1000;
    if (max <= 5000) return Math.ceil(max / 500) * 500;
    return Math.ceil(max / 1000) * 1000;
  }, [points]);

  const getX = (idx: number) => {
    if (points.length <= 1) return padLeft + chartW / 2;
    return padLeft + (idx / (points.length - 1)) * chartW;
  };

  const getY = (val: number) => {
    const ratio = Math.min(Math.max(val / maxVal, 0), 1);
    return padTop + chartH - ratio * chartH;
  };

  const generateSmoothPath = (values: number[]) => {
    if (values.length === 0) return '';
    const pts = values.map((v, i) => ({ x: getX(i), y: getY(v) }));
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const midX = (p0.x + p1.x) / 2;
      d += ` C ${midX},${p0.y} ${midX},${p1.y} ${p1.x},${p1.y}`;
    }
    return d;
  };

  const generateAreaPath = (values: number[]) => {
    const linePath = generateSmoothPath(values);
    if (!linePath) return '';
    const lastX = getX(values.length - 1);
    const firstX = getX(0);
    const bottomY = padTop + chartH;
    return `${linePath} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
  };

  const sentPath = generateSmoothPath(points.map((p) => p.sent));
  const deliveredPath = generateSmoothPath(points.map((p) => p.delivered));
  const readPath = generateSmoothPath(points.map((p) => p.read));
  const failedPath = generateSmoothPath(points.map((p) => p.failed));

  const sentArea = generateAreaPath(points.map((p) => p.sent));
  const deliveredArea = generateAreaPath(points.map((p) => p.delivered));
  const readArea = generateAreaPath(points.map((p) => p.read));

  // Y-axis 5 ticks
  const yTicks = useMemo(() => {
    return [0, maxVal * 0.25, maxVal * 0.5, maxVal * 0.75, maxVal];
  }, [maxVal]);

  const activePoint = hoverIndex !== null && points[hoverIndex] ? points[hoverIndex] : null;
  const activeX = hoverIndex !== null ? getX(hoverIndex) : null;

  return (
    <div className="bg-white border border-[#E2EAE6] rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Header with Title & Dropdown Filter (Matching Mockup exactly) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#14201C] tracking-tight">Message Analytics</h2>
            {loading && <Loader2 className="w-3.5 h-3.5 text-[#006736] animate-spin" />}
          </div>
          <p className="text-xs text-[#5F7069] mt-0.5">
            Track your message delivery, read rates, and engagement over time.
          </p>
        </div>

        {/* Dropdown Filter */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-[#F6FAF8] hover:bg-[#E9F9EE] border border-[#E2EAE6] hover:border-[#C4EBD0] text-xs font-semibold text-[#14201C] px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <span>{selectedRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#5F7069]" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-44 bg-white border border-[#E2EAE6] rounded-xl shadow-lg py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
              {(['Last 7 Days', 'Today', 'Last 30 Days', 'Last 3 Months'] as RangeOption[]).map(
                (opt) => {
                  const isSelected = selectedRange === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => {
                        setSelectedRange(opt);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#E9F9EE] text-[#006736] font-bold'
                          : 'text-[#1F2A26] hover:bg-[#F6FAF8]'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#006736]" />}
                    </button>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>

      {/* SVG Interactive Chart Canvas */}
      <div
        ref={containerRef}
        className={`relative w-full overflow-hidden select-none transition-opacity duration-200 ${
          loading ? 'opacity-60' : 'opacity-100'
        }`}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
          style={{ minHeight: '220px' }}
        >
          <defs>
            {/* Gradients for smooth area fills */}
            <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="deliveredGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="readGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid Horizontal Lines & Y-Axis Labels */}
          {yTicks.map((val, idx) => {
            const y = getY(val);
            const label = val >= 1000 ? `${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}K` : `${Math.round(val)}`;
            return (
              <g key={idx}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#E2EAE6"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="10"
                  fontWeight="600"
                  fill="#8A9993"
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* X-Axis Date Labels */}
          {points.map((p, idx) => {
            if (!p.showLabel) return null;
            const x = getX(idx);
            return (
              <text
                key={idx}
                x={x}
                y={height - 10}
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                fill="#8A9993"
              >
                {p.dateLabel}
              </text>
            );
          })}

          {/* Area Fills */}
          <path d={sentArea} fill="url(#sentGrad)" />
          <path d={deliveredArea} fill="url(#deliveredGrad)" />
          <path d={readArea} fill="url(#readGrad)" />

          {/* Lines */}
          <path
            d={sentPath}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={deliveredPath}
            fill="none"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={readPath}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={failedPath}
            fill="none"
            stroke="#EF4444"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points along the curves */}
          {points.map((p, idx) => {
            const x = getX(idx);
            const isHovered = hoverIndex === idx;
            return (
              <g key={idx}>
                {/* Sent point */}
                <circle
                  cx={x}
                  cy={getY(p.sent)}
                  r={isHovered ? '4.5' : '3'}
                  fill="#3B82F6"
                  stroke="#fff"
                  strokeWidth={isHovered ? '2' : '1.5'}
                />
                {/* Delivered point */}
                <circle
                  cx={x}
                  cy={getY(p.delivered)}
                  r={isHovered ? '4.5' : '3'}
                  fill="#10B981"
                  stroke="#fff"
                  strokeWidth={isHovered ? '2' : '1.5'}
                />
                {/* Read point */}
                <circle
                  cx={x}
                  cy={getY(p.read)}
                  r={isHovered ? '4.5' : '3'}
                  fill="#F59E0B"
                  stroke="#fff"
                  strokeWidth={isHovered ? '2' : '1.5'}
                />
                {/* Failed point */}
                <circle
                  cx={x}
                  cy={getY(p.failed)}
                  r={isHovered ? '4' : '2.5'}
                  fill="#EF4444"
                  stroke="#fff"
                  strokeWidth="1.5"
                />
              </g>
            );
          })}

          {/* Active Hover Guideline & Hitboxes */}
          {activeX !== null && (
            <line
              x1={activeX}
              y1={padTop}
              x2={activeX}
              y2={padTop + chartH}
              stroke="#8A9993"
              strokeDasharray="2 2"
              strokeWidth="1.2"
            />
          )}

          {/* Interactive Invisible Columns for hovering */}
          {points.map((_, idx) => {
            const x = getX(idx);
            const colW = chartW / Math.max(points.length, 1);
            return (
              <rect
                key={idx}
                x={x - colW / 2}
                y={padTop}
                width={colW}
                height={chartH}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoverIndex(idx)}
              />
            );
          })}
        </svg>

        {/* Floating Tooltip Card (Matching mockup styling exactly) */}
        {activePoint && activeX !== null && (
          <div
            className="absolute z-20 bg-white/95 backdrop-blur-xs border border-[#E2EAE6] rounded-xl p-3 shadow-lg pointer-events-none text-xs transition-all duration-150"
            style={{
              left: `${Math.min(Math.max((activeX / width) * 100, 15), 85)}%`,
              top: '15%',
              transform: 'translate(-50%, 0)',
              minWidth: '130px',
            }}
          >
            <div className="text-[11px] font-bold text-[#14201C] pb-1.5 mb-1.5 border-b border-[#E2EAE6]">
              {activePoint.fullDate}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-3 text-[11px]">
                <div className="flex items-center gap-1.5 text-[#5F7069]">
                  <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                  <span>Sent</span>
                </div>
                <span className="font-bold text-[#14201C]">{activePoint.sent.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-[11px]">
                <div className="flex items-center gap-1.5 text-[#5F7069]">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>Delivered</span>
                </div>
                <span className="font-bold text-[#14201C]">
                  {activePoint.delivered.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 text-[11px]">
                <div className="flex items-center gap-1.5 text-[#5F7069]">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                  <span>Read</span>
                </div>
                <span className="font-bold text-[#14201C]">{activePoint.read.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-[11px]">
                <div className="flex items-center gap-1.5 text-[#5F7069]">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                  <span>Failed</span>
                </div>
                <span className="font-bold text-[#EF4444]">{activePoint.failed.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Chart Legend */}
      <div className="flex items-center justify-center gap-6 mt-2 pt-3 border-t border-[#F6FAF8] flex-wrap">
        <div className="flex items-center gap-2 text-xs font-bold text-[#14201C]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
          <span>Sent</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#14201C]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
          <span>Delivered</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#14201C]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
          <span>Read</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#14201C]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
          <span>Failed</span>
        </div>
      </div>
    </div>
  );
};
