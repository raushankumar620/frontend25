import React from 'react';
import clsx from 'clsx';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: 'underline' | 'pills';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'underline',
}) => {
  if (variant === 'pills') {
    return (
      <div className={clsx('flex items-center gap-2 p-1.5 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl', className)}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={clsx(
                'flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer',
                isActive
                  ? 'bg-white text-[#006736] font-bold shadow-xs border border-[#E2EAE6]'
                  : 'text-[#5F7069] hover:text-[#14201C]'
              )}
            >
              {tab.icon && <span className="w-4 h-4 shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={clsx(
                    'px-2 py-0.5 rounded-full text-xs font-bold',
                    isActive
                      ? 'bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]'
                      : 'bg-white text-[#5F7069] border border-[#E2EAE6]'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={clsx('flex border-b border-[#E2EAE6] gap-8', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'flex items-center gap-2.5 pb-3.5 text-sm sm:text-base font-semibold border-b-2 transition-all relative cursor-pointer',
              isActive
                ? 'border-[#05A222] text-[#006736] font-bold'
                : 'border-transparent text-[#5F7069] hover:text-[#14201C]'
            )}
          >
            {tab.icon && <span className="w-4.5 h-4.5 shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span className="px-2 py-0.5 bg-[#E9F9EE] text-[#006736] font-bold rounded-full text-xs border border-[#C4EBD0]">
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
