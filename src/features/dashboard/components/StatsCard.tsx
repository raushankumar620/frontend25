import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import clsx from 'clsx';

export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  description?: string;
  badge?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  description,
  badge,
}) => {
  return (
    <div className="bg-white border border-[#E2EAE6] rounded-2xl p-6 shadow-[0_8px_30px_rgba(1,59,35,0.04)] transition-all duration-200 hover:shadow-[0_12px_36px_rgba(1,59,35,0.08)] hover:border-[#05A222]/40">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-[#5F7069]">{title}</span>
        <div className="w-11 h-11 rounded-xl bg-[#F6FAF8] border border-[#E2EAE6] flex items-center justify-center">
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-2">
        <h3 className="text-3xl lg:text-3xl font-black text-[#14201C] tracking-tight">{value}</h3>
        {badge && (
          <span className="text-xs font-bold bg-[#E9F9EE] text-[#006736] px-2.5 py-1 rounded-md border border-[#C4EBD0]">
            {badge}
          </span>
        )}
      </div>

      {(change || description) && (
        <div className="mt-3 flex items-center gap-2 text-sm">
          {change && (
            <span
              className={clsx(
                'inline-flex items-center font-bold text-sm',
                isPositive ? 'text-[#05A222]' : 'text-[#D64545]'
              )}
            >
              {isPositive ? <ArrowUpRight className="w-4 h-4 mr-0.5" /> : <ArrowDownRight className="w-4 h-4 mr-0.5" />}
              {change}
            </span>
          )}
          {description && <span className="text-[#8A9993] text-xs sm:text-sm font-medium truncate">{description}</span>}
        </div>
      )}
    </div>
  );
};
