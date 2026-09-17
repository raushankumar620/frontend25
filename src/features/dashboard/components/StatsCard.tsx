import React from 'react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accentColor?: string;
  subText?: string;
  badge?: string;
  theme?: 'blue' | 'orange' | 'sky' | 'emerald' | 'purple' | 'rose' | 'amber' | 'pink';
}

const themeStyles: Record<
  string,
  {
    topLine: string;
    cardHover: string;
    glowBg: string;
    watermarkColor: string;
    pillBg: string;
    pillBorder: string;
    pillText: string;
    dotColor: string;
    ringColor: string;
  }
> = {
  blue: {
    topLine: 'from-blue-500 via-indigo-500 to-blue-400',
    cardHover: 'hover:border-blue-200/80 hover:shadow-[0_12px_24px_-8px_rgba(37,99,235,0.12)]',
    glowBg: 'bg-blue-500/10',
    watermarkColor: 'text-blue-600',
    pillBg: 'bg-blue-50/90',
    pillBorder: 'border-blue-200/70',
    pillText: 'text-blue-700',
    dotColor: 'bg-blue-500',
    ringColor: 'border-blue-500/10',
  },
  orange: {
    topLine: 'from-orange-500 via-amber-500 to-orange-400',
    cardHover: 'hover:border-orange-200/80 hover:shadow-[0_12px_24px_-8px_rgba(249,115,22,0.12)]',
    glowBg: 'bg-orange-500/10',
    watermarkColor: 'text-orange-600',
    pillBg: 'bg-orange-50/90',
    pillBorder: 'border-orange-200/70',
    pillText: 'text-orange-700',
    dotColor: 'bg-orange-500',
    ringColor: 'border-orange-500/10',
  },
  sky: {
    topLine: 'from-sky-500 via-blue-500 to-sky-400',
    cardHover: 'hover:border-sky-200/80 hover:shadow-[0_12px_24px_-8px_rgba(14,165,233,0.12)]',
    glowBg: 'bg-sky-500/10',
    watermarkColor: 'text-sky-600',
    pillBg: 'bg-sky-50/90',
    pillBorder: 'border-sky-200/70',
    pillText: 'text-sky-700',
    dotColor: 'bg-sky-500',
    ringColor: 'border-sky-500/10',
  },
  emerald: {
    topLine: 'from-emerald-500 via-teal-500 to-emerald-400',
    cardHover: 'hover:border-emerald-200/80 hover:shadow-[0_12px_24px_-8px_rgba(16,185,129,0.12)]',
    glowBg: 'bg-emerald-500/10',
    watermarkColor: 'text-emerald-600',
    pillBg: 'bg-emerald-50/90',
    pillBorder: 'border-emerald-200/70',
    pillText: 'text-emerald-700',
    dotColor: 'bg-emerald-500',
    ringColor: 'border-emerald-500/10',
  },
  purple: {
    topLine: 'from-purple-500 via-violet-500 to-purple-400',
    cardHover: 'hover:border-purple-200/80 hover:shadow-[0_12px_24px_-8px_rgba(139,92,246,0.12)]',
    glowBg: 'bg-purple-500/10',
    watermarkColor: 'text-purple-600',
    pillBg: 'bg-purple-50/90',
    pillBorder: 'border-purple-200/70',
    pillText: 'text-purple-700',
    dotColor: 'bg-purple-500',
    ringColor: 'border-purple-500/10',
  },
  rose: {
    topLine: 'from-rose-500 via-red-500 to-rose-400',
    cardHover: 'hover:border-rose-200/80 hover:shadow-[0_12px_24px_-8px_rgba(244,63,94,0.12)]',
    glowBg: 'bg-rose-500/10',
    watermarkColor: 'text-rose-600',
    pillBg: 'bg-rose-50/90',
    pillBorder: 'border-rose-200/70',
    pillText: 'text-rose-700',
    dotColor: 'bg-rose-500',
    ringColor: 'border-rose-500/10',
  },
  amber: {
    topLine: 'from-amber-500 via-orange-500 to-amber-400',
    cardHover: 'hover:border-amber-200/80 hover:shadow-[0_12px_24px_-8px_rgba(245,158,11,0.12)]',
    glowBg: 'bg-amber-500/10',
    watermarkColor: 'text-amber-600',
    pillBg: 'bg-amber-50/90',
    pillBorder: 'border-amber-200/70',
    pillText: 'text-amber-700',
    dotColor: 'bg-amber-500',
    ringColor: 'border-amber-500/10',
  },
  pink: {
    topLine: 'from-pink-500 via-rose-500 to-pink-400',
    cardHover: 'hover:border-pink-200/80 hover:shadow-[0_12px_24px_-8px_rgba(236,72,153,0.12)]',
    glowBg: 'bg-pink-500/10',
    watermarkColor: 'text-pink-600',
    pillBg: 'bg-pink-50/90',
    pillBorder: 'border-pink-200/70',
    pillText: 'text-pink-700',
    dotColor: 'bg-pink-500',
    ringColor: 'border-pink-500/10',
  },
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  subText,
  badge,
  theme = 'blue',
}) => {
  const t = themeStyles[theme] || themeStyles.blue;

  // Custom stroke/scale for the background watermark icon
  const renderWatermarkIcon = () => {
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
        className: 'w-full h-full stroke-[1.25]',
      });
    }
    return icon;
  };

  return (
    <div
      className={`relative group bg-white border border-[#E4ECE8] ${t.cardHover} rounded-xl p-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col justify-between`}
    >
      {/* Top Gradient Highlight Accent Line */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r ${t.topLine} opacity-80 group-hover:opacity-100 transition-opacity duration-300`}
      />

      {/* Ambient Corner Glow Effect */}
      <div
        className={`absolute -top-8 -right-8 w-24 h-24 ${t.glowBg} rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500`}
      />

      {/* Concentric Orbital Decorative Ring behind Watermark */}
      <div
        className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full border border-dashed ${t.ringColor} pointer-events-none group-hover:scale-110 transition-transform duration-500`}
      />

      {/* Large Translucent Watermark Icon in Background (Right) */}
      <div
        className={`absolute -bottom-1 -right-1 w-16 h-16 sm:w-18 sm:h-18 ${t.watermarkColor} opacity-[0.09] group-hover:opacity-[0.22] group-hover:scale-110 group-hover:-rotate-6 pointer-events-none transition-all duration-400 flex items-center justify-center`}
      >
        <div className="w-full h-full flex items-center justify-center">
          {renderWatermarkIcon()}
        </div>
      </div>

      <div className="relative z-10">
        {/* Header: Title & Optional Mini Badge */}
        <div className="flex items-center justify-between gap-1.5">
          <span className="text-[11px] font-bold text-[#5F7069] uppercase tracking-wider truncate">
            {title}
          </span>
          {badge && (
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${t.pillBg} ${t.pillBorder} ${t.pillText} shadow-2xs shrink-0`}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Big Bold Value */}
        <div className="mt-2">
          <h3 className="text-xl sm:text-2xl font-black text-[#14201C] tracking-tight leading-tight">
            {value}
          </h3>
        </div>
      </div>

      {/* Compact Footer Subtext */}
      {subText && (
        <div className="relative z-10 mt-2.5 pt-2 border-t border-[#F0F5F2] flex items-center justify-between text-[10.5px] text-[#8A9993] font-medium">
          <span className="truncate">{subText}</span>
          <div className="flex items-center gap-1 shrink-0 ml-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${t.dotColor} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${t.dotColor}`} />
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export interface RateCardProps {
  title: string;
  rate: string; // e.g. "35.5%"
  percentage: number; // e.g. 35.5 (0 to 100)
  icon: React.ReactNode;
  gradientFrom: string; // e.g. 'from-emerald-500 to-teal-400'
  accentColor: string;
  details: string; // e.g. "11,278 of 31,734 messages"
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

  // Render cloned icon with custom size for background watermark
  const renderWatermarkIcon = () => {
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
        className: 'w-full h-full stroke-[1.25]',
      });
    }
    return icon;
  };

  return (
    <div className="relative group bg-white border border-[#E4ECE8] hover:border-gray-300 rounded-xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Top Accent Gradient Line */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r ${gradientFrom} opacity-80 group-hover:opacity-100 transition-opacity duration-300`}
      />

      {/* Background Soft Glow */}
      <div
        style={{ backgroundColor: `${accentColor}10` }}
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500"
      />

      {/* Large Translucent Watermark Icon in Background */}
      <div
        style={{ color: accentColor }}
        className="absolute -bottom-2 -right-2 w-20 h-20 opacity-[0.09] group-hover:opacity-[0.22] group-hover:scale-110 group-hover:-rotate-6 pointer-events-none transition-all duration-400 flex items-center justify-center"
      >
        <div className="w-full h-full flex items-center justify-center">
          {renderWatermarkIcon()}
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between gap-1.5 mb-2">
          <div>
            <h4 className="text-xs sm:text-[13px] font-bold text-[#14201C] leading-tight">
              {title}
            </h4>
            <p className="text-[10px] text-[#8A9993] mt-0.5 font-medium">
              {subMetric || 'Real-time telemetry'}
            </p>
          </div>

          {badge && (
            <span
              style={{ color: accentColor }}
              className="text-[10px] font-bold bg-[#F6FAF8] border border-gray-200 px-2 py-0.5 rounded-md shadow-2xs shrink-0"
            >
              {badge}
            </span>
          )}
        </div>

        {/* Rate Value & Ratio */}
        <div className="mt-2 flex items-baseline justify-between gap-2">
          <h3 className="text-2xl font-black text-[#14201C] tracking-tight">
            {rate}
          </h3>
          <span className="text-[11px] font-bold text-[#5F7069]">
            {clampedProgress.toFixed(1)}% Ratio
          </span>
        </div>

        {/* Compact Glowing Progress Bar */}
        <div className="mt-2.5 w-full h-2 bg-gray-100/90 rounded-full p-0.5 overflow-hidden">
          <div
            style={{ width: `${clampedProgress}%` }}
            className={`h-full rounded-full bg-gradient-to-r ${gradientFrom} transition-all duration-700 ease-out shadow-xs`}
          />
        </div>
      </div>

      {/* Subtext info */}
      <div className="relative z-10 mt-3 pt-2 border-t border-[#F0F5F2] flex items-center justify-between text-[11px] text-[#5F7069] font-medium">
        <span className="truncate">{details}</span>
        <span style={{ color: accentColor }} className="font-bold text-[10px] flex items-center gap-1 shrink-0 ml-1">
          <span className="relative flex h-1.5 w-1.5">
            <span
              style={{ backgroundColor: accentColor }}
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            />
            <span
              style={{ backgroundColor: accentColor }}
              className="relative inline-flex rounded-full h-1.5 w-1.5"
            />
          </span>
          Live
        </span>
      </div>
    </div>
  );
};


