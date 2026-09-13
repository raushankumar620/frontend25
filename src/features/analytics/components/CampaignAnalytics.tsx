import React from 'react';
import { Send } from 'lucide-react';

export const CampaignAnalytics: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <Send className="w-4 h-4 text-teal-500" />
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Broadcast Campaign Performance</h4>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-slate-400">Delivery Success (98.9%)</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">127,076 msgs</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-teal-500 w-[98.9%]" />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-slate-400">Open & Read Rate (84.1%)</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">106,870 msgs</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[84.1%]" />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-slate-400">CTA Button Click Rate (28.4%)</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">36,090 clicks</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 w-[28.4%]" />
          </div>
        </div>
      </div>
    </div>
  );
};
