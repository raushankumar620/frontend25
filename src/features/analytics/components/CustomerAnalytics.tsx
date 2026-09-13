import React from 'react';
import { Users } from 'lucide-react';

export const CustomerAnalytics: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-indigo-500" />
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Audience Growth & Retention</h4>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
          <div className="text-[10px] text-slate-400">Total Opted-In Leads</div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">45,210</div>
          <div className="text-[10px] text-emerald-500 font-semibold">+1,420 this month</div>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
          <div className="text-[10px] text-slate-400">Opt-out / Unsubscribe Rate</div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">0.14%</div>
          <div className="text-[10px] text-teal-400 font-semibold">Well below Meta 1% threshold</div>
        </div>
      </div>
    </div>
  );
};
