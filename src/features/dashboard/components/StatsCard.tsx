import React from 'react';

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
  sparklineData = [10, 25, 18, 32, 28, 45, 38, 55],
  theme = 'green',
}) => {
  const t = themeStyles[theme] || themeStyles.green;
  const strokeColor = sparklineColor || t.sparklineStroke;

  // Render filled/tinted icon
  const renderFilledIcon = () => {
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon as React.ReactElement<any>, {
        className: 'w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-110',
        fill: 'currentColor',
        fillOpacity: 0.25,
        strokeWidth: 2.2,
      });
    }
    return icon;
  };

  // Generate smooth SVG curve path from sparkline data
  const width = 80;
  const height = 30;
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const range = max - min || 1;

  const points = sparklineData.map((val, idx) => {
    const x = (idx / (sparklineData.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  });

  // Bezier curve smoothing
  let pathD = `M ${points[0]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i].split(',').map(Number);
    const [x1, y1] = points[i + 1].split(',').map(Number);
    const midX = (x0 + x1) / 2;
    pathD += ` C ${midX},${y0} ${midX},${y1} ${x1},${y1}`;
  }

  const badgeClass =
    changeType === 'negative'
      ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]/40'
      : 'bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]';

  return (
    <div className="bg-white border border-[#E2EAE6] hover:border-[#C4EBD0] rounded-2xl p-4 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      {/* Top row: Icon + Title on left, Badge on right */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-9 h-9 rounded-xl ${t.iconBg} ${t.iconColor} border ${t.iconBorder} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-all`}
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

      {/* Bottom row: Large Metric Value & Subtitle on left, Sparkline curve on right */}
      <div className="mt-3.5 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-xl sm:text-2xl font-black text-[#14201C] tracking-tight leading-none">
            {value}
          </h3>
          {subText && (
            <p className="text-[11px] font-medium text-[#5F7069] mt-1.5 truncate">{subText}</p>
          )}
        </div>

        {/* Mini Sparkline Curve */}
        <div className="shrink-0 w-20 h-8 flex items-end justify-end">
          <svg width={width} height={height} className="overflow-visible">
            <path
              d={pathD}
              fill="none"
              stroke={strokeColor}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300 group-hover:stroke-[2.6]"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export interface RateCardProps {
  title: string;
  rate: string;
  percentage: number;
  icon: React.ReactNode;
  gradientFrom: string;
  accentColor: string;
  details: string;
  subMetric?: string;
  badge?: string;
}

export const RateCard: React.FC<RateCardProps> = ({
  title,
  rate,
  percentage,
  icon,
  gradientFrom,
  accentColor,
  details,
  subMetric,
  badge,
}) => {
  const clampedProgress = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="bg-white border border-[#E2EAE6] hover:border-[#C4EBD0] rounded-2xl p-4 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div
            style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
            className="w-8 h-8 rounded-xl flex items-center justify-center border border-black/5"
          >
            {icon}
          </div>
          <span className="text-xs font-bold text-[#14201C]">{title}</span>
        </div>
        {badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]">
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between mb-2">
        <span className="text-2xl font-black text-[#14201C]">{rate}</span>
        {subMetric && <span className="text-xs text-[#5F7069] font-medium">{subMetric}</span>}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-[#F6FAF8] h-2 rounded-full overflow-hidden border border-[#E2EAE6]">
        <div
          className={`h-full bg-gradient-to-r ${gradientFrom} rounded-full transition-all duration-500`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>

      <p className="text-[11px] text-[#5F7069] mt-2 truncate">{details}</p>
    </div>
  );
};


