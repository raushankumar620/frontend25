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

const themeStyles: Record<string, { bgGlow: string; iconBg: string; iconColor: string; borderHover: string; pillBg: string; pillText: string }> = {
  blue: {
    bgGlow: 'from-blue-500/10 via-blue-500/4 to-transparent',
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm shadow-blue-500/25',
    iconColor: 'text-white',
    borderHover: 'hover:border-blue-300 hover:shadow-blue-500/5',
    pillBg: 'bg-blue-50',
    pillText: 'text-blue-700',
  },
  orange: {
    bgGlow: 'from-orange-500/10 via-orange-500/4 to-transparent',
    iconBg: 'bg-gradient-to-br from-orange-500 to-amber-600 shadow-sm shadow-orange-500/25',
    iconColor: 'text-white',
    borderHover: 'hover:border-orange-300 hover:shadow-orange-500/5',
    pillBg: 'bg-orange-50',
    pillText: 'text-orange-700',
  },
  sky: {
    bgGlow: 'from-sky-500/10 via-sky-500/4 to-transparent',
    iconBg: 'bg-gradient-to-br from-sky-500 to-blue-600 shadow-sm shadow-sky-500/25',
    iconColor: 'text-white',
    borderHover: 'hover:border-sky-300 hover:shadow-sky-500/5',
    pillBg: 'bg-sky-50',
    pillText: 'text-sky-700',
  },
  emerald: {
    bgGlow: 'from-emerald-500/10 via-emerald-500/4 to-transparent',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm shadow-emerald-500/25',
    iconColor: 'text-white',
    borderHover: 'hover:border-emerald-300 hover:shadow-emerald-500/5',
    pillBg: 'bg-emerald-50',
    pillText: 'text-emerald-700',
  },
  purple: {
    bgGlow: 'from-purple-500/10 via-purple-500/4 to-transparent',
    iconBg: 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-sm shadow-purple-500/25',
    iconColor: 'text-white',
    borderHover: 'hover:border-purple-300 hover:shadow-purple-500/5',
    pillBg: 'bg-purple-50',
    pillText: 'text-purple-700',
  },
  rose: {
    bgGlow: 'from-rose-500/10 via-rose-500/4 to-transparent',
    iconBg: 'bg-gradient-to-br from-rose-500 to-red-600 shadow-sm shadow-rose-500/25',
    iconColor: 'text-white',
    borderHover: 'hover:border-rose-300 hover:shadow-rose-500/5',
    pillBg: 'bg-rose-50',
    pillText: 'text-rose-700',
  },
  amber: {
    bgGlow: 'from-amber-500/10 via-amber-500/4 to-transparent',
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-sm shadow-amber-500/25',
    iconColor: 'text-white',
    borderHover: 'hover:border-amber-300 hover:shadow-amber-500/5',
    pillBg: 'bg-amber-50',
    pillText: 'text-amber-700',
  },
  pink: {
    bgGlow: 'from-pink-500/10 via-pink-500/4 to-transparent',
    iconBg: 'bg-gradient-to-br from-pink-500 to-rose-600 shadow-sm shadow-pink-500/25',
    iconColor: 'text-white',
    borderHover: 'hover:border-pink-300 hover:shadow-pink-500/5',
    pillBg: 'bg-pink-50',
    pillText: 'text-pink-700',
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

  return (
    <div
      className={`relative group bg-white border border-[#E5EAE7] ${t.borderHover} rounded-2xl p-4.5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col justify-between`}
    >
      {/* Top Ambient Glow Gradient */}
      <div
        className={`absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br ${t.bgGlow} rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500`}
      />

      <div>
        {/* Header Row */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-[#5F7069] tracking-tight truncate">
            {title}
          </span>

          <div
            className={`w-8 h-8 rounded-xl ${t.iconBg} ${t.iconColor} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform duration-300`}
          >
            {icon}
          </div>
        </div>

        {/* Big Bold Numerical Value */}
        <div className="mt-3 flex items-baseline justify-between gap-2">
          <h3 className="text-2xl lg:text-[26px] font-black text-[#14201C] tracking-tight leading-none">
            {value}
          </h3>
          {badge && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border border-black/5 ${t.pillBg} ${t.pillText}`}
            >
              {badge}
            </span>
          )}
        </div>
      </div>

      {/* Footer Details */}
      {subText && (
        <div className="mt-3 pt-2.5 border-t border-[#F0F5F2] flex items-center justify-between text-[11px] text-[#8A9993] font-medium">
          <span className="truncate">{subText}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
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

  return (
    <div className="group bg-white border border-[#E5EAE7] hover:border-gray-300 rounded-2xl p-5 shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradientFrom} text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform`}
            >
              {icon}
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#14201C] leading-tight">
                {title}
              </h4>
              <p className="text-[11px] text-[#8A9993] mt-0.5 font-medium">
                {subMetric || 'Real-time telemetry'}
              </p>
            </div>
          </div>

          {badge && (
            <span
              style={{ color: accentColor }}
              className="text-xs font-bold bg-gray-50 border border-gray-200/80 px-2.5 py-1 rounded-lg"
            >
              {badge}
            </span>
          )}
        </div>

        {/* Rate Value & Ratio */}
        <div className="mt-3 flex items-baseline justify-between gap-2">
          <h3 className="text-3xl font-black text-[#14201C] tracking-tight">
            {rate}
          </h3>
          <span className="text-xs font-semibold text-[#5F7069]">
            {clampedProgress.toFixed(1)}% Ratio
          </span>
        </div>

        {/* Dynamic Glowing Progress Bar */}
        <div className="mt-3.5 w-full h-2.5 bg-gray-100 rounded-full p-0.5 overflow-hidden">
          <div
            style={{ width: `${clampedProgress}%` }}
            className={`h-full rounded-full bg-gradient-to-r ${gradientFrom} transition-all duration-700 ease-out shadow-xs`}
          />
        </div>
      </div>

      {/* Subtext info */}
      <div className="mt-3.5 pt-2.5 border-t border-[#F0F5F2] flex items-center justify-between text-xs text-[#5F7069] font-medium">
        <span>{details}</span>
        <span style={{ color: accentColor }} className="font-bold text-[11px]">
          Live Metric
        </span>
      </div>
    </div>
  );
};
