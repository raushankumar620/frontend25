import React, { useId } from 'react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accentColor?: string;
  subText?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral' | 'success';
  sparklineColor?: string;
  sparklineData?: number[];
  theme?: 'green' | 'blue' | 'purple' | 'emerald' | 'orange' | 'rose' | 'sky' | 'violet';
}

const themeStyles: Record<
  string,
  {
    iconBg: string;
    iconColor: string;
    iconBorder: string;
    badgeBg: string;
    badgeText: string;
    sparklineStroke: string;
  }
> = {
  green: {
    iconBg: 'bg-[#E9F9EE]',
    iconColor: 'text-[#05A222]',
    iconBorder: 'border-[#C4EBD0]',
    badgeBg: 'bg-[#E9F9EE]',
    badgeText: 'text-[#006736]',
    sparklineStroke: '#05A222',
  },
  blue: {
    iconBg: 'bg-[#EFF6FF]',
    iconColor: 'text-[#2563EB]',
    iconBorder: 'border-[#BFDBFE]',
    badgeBg: 'bg-[#E9F9EE]',
    badgeText: 'text-[#006736]',
    sparklineStroke: '#3B82F6',
  },
  purple: {
    iconBg: 'bg-[#F5F3FF]',
    iconColor: 'text-[#7C3AED]',
    iconBorder: 'border-[#DDD6FE]',
    badgeBg: 'bg-[#E9F9EE]',
    badgeText: 'text-[#006736]',
    sparklineStroke: '#8B5CF6',
  },
  emerald: {
    iconBg: 'bg-[#ECFDF5]',
    iconColor: 'text-[#10B981]',
    iconBorder: 'border-[#A7F3D0]',
    badgeBg: 'bg-[#E9F9EE]',
    badgeText: 'text-[#006736]',
    sparklineStroke: '#10B981',
  },
  orange: {
    iconBg: 'bg-[#FFF7ED]',
    iconColor: 'text-[#EA580C]',
    iconBorder: 'border-[#FED7AA]',
    badgeBg: 'bg-[#E9F9EE]',
    badgeText: 'text-[#006736]',
    sparklineStroke: '#F97316',
  },
  rose: {
    iconBg: 'bg-[#FEF2F2]',
    iconColor: 'text-[#DC2626]',
    iconBorder: 'border-[#FECACA]',
    badgeBg: 'bg-[#FEF2F2]',
    badgeText: 'text-[#DC2626]',
    sparklineStroke: '#EF4444',
  },
  sky: {
    iconBg: 'bg-[#F0F9FF]',
    iconColor: 'text-[#0284C7]',
    iconBorder: 'border-[#BAE6FD]',
    badgeBg: 'bg-[#E9F9EE]',
    badgeText: 'text-[#006736]',
    sparklineStroke: '#0284C7',
  },
  violet: {
    iconBg: 'bg-[#FAF5FF]',
    iconColor: 'text-[#9333EA]',
    iconBorder: 'border-[#E9D5FF]',
    badgeBg: 'bg-[#E9F9EE]',
    badgeText: 'text-[#006736]',
    sparklineStroke: '#A855F7',
  },
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  subText,
  change,
  changeType = 'positive',
  sparklineColor,
  sparklineData = [0, 0, 0, 0, 0, 0, 0],
  theme = 'green',
}) => {
  const t = themeStyles[theme] || themeStyles.green;
  const strokeColor = sparklineColor || t.sparklineStroke;
  const gradientId = useId();

  // Raw data points to plot directly from props
  const rawData = sparklineData && sparklineData.length >= 2 ? sparklineData : [0, 0, 0, 0, 0, 0, 0];

  // SVG Geometry
  const width = 92;
  const height = 34;
  const padTop = 4;
  const padBottom = 4;
  const chartH = height - padTop - padBottom;

  const max = Math.max(...rawData);
  const range = max > 0 ? max : 1;

  const pts = rawData.map((val, idx) => {
    const x = (idx / (rawData.length - 1)) * width;
    // When max is 0, y is flat at the baseline
    const y = max === 0 ? height - padBottom : height - padBottom - (val / range) * chartH;
    return { x, y };
  });

  // Smooth Bezier Curve Path directly connecting real points
  let linePath = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const midX = (p0.x + p1.x) / 2;
    linePath += ` C ${midX.toFixed(1)},${p0.y.toFixed(1)} ${midX.toFixed(1)},${p1.y.toFixed(1)} ${p1.x.toFixed(1)},${p1.y.toFixed(1)}`;
  }

  // Closed Area Path for Gradient Fill
  const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

  const badgeClass =
    changeType === 'negative'
      ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]/40'
      : 'bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]';

  // Render filled/tinted icon
  const renderFilledIcon = () => {
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon as React.ReactElement<any>, {
        className: 'w-4 h-4 shrink-0 transition-transform group-hover:scale-110',
        fill: 'currentColor',
        fillOpacity: 0.25,
        strokeWidth: 2.2,
      });
    }
    return icon;
  };

  return (
    <div className="bg-white border border-[#E2EAE6] hover:border-[#C4EBD0] rounded-2xl p-4 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      {/* Top row: Icon + Title on left, Badge on right */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-8.5 h-8.5 rounded-xl ${t.iconBg} ${t.iconColor} border ${t.iconBorder} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-all`}
          >
            {renderFilledIcon()}
          </div>
          <span className="text-xs font-bold text-[#14201C] truncate">{title}</span>
        </div>

        {change && (
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 shadow-2xs flex items-center gap-1 ${badgeClass}`}
          >
            {change}
          </span>
        )}
      </div>

      {/* Bottom row: Large Metric Value & Subtitle on left, Real Dynamic Sparkline on right */}
      <div className="mt-3.5 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-xl sm:text-2xl font-black text-[#14201C] tracking-tight leading-none">
            {value}
          </h3>
          {subText && (
            <p className="text-[11px] font-medium text-[#5F7069] mt-1.5 truncate">{subText}</p>
          )}
        </div>

        {/* Real Dynamic Sparkline with Gradient Fill */}
        <div className="shrink-0 w-24 h-9 flex items-end justify-end overflow-visible">
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity={max > 0 ? 0.32 : 0.08} />
                <stop offset="85%" stopColor={strokeColor} stopOpacity={max > 0 ? 0.04 : 0.0} />
                <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Gradient Fill Under Real Curve */}
            <path d={areaPath} fill={`url(#${gradientId})`} />

            {/* Real Stroke Curve (Dynamic Rise/Fall) */}
            <path
              d={linePath}
              fill="none"
              stroke={strokeColor}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300 group-hover:stroke-[2.5]"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
