import React from 'react';
import { MessageSquare } from 'lucide-react';

export const MessageAnalytics: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-emerald-500" />
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Message Throughput Breakdown</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
          <div className="text-[10px] text-slate-400">Total Inbound</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">42,190</div>
          <div className="text-[10px] text-emerald-500 font-semibold">+14.2% vs last month</div>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
          <div className="text-[10px] text-slate-400">Total Outbound</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">128,490</div>
          <div className="text-[10px] text-emerald-500 font-semibold">+24.2% vs last month</div>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
          <div className="text-[10px] text-slate-400">Avg First Response Time</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">1.2 mins</div>
          <div className="text-[10px] text-emerald-500 font-semibold">-40s faster with AI</div>
        </div>
      </div>
    </div>
  );
};
