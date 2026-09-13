import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';

const chartData = [
  { day: 'Mon', sent: 14200, delivered: 13900, read: 11200 },
  { day: 'Tue', sent: 18500, delivered: 18100, read: 15400 },
  { day: 'Wed', sent: 24000, delivered: 23600, read: 20100 },
  { day: 'Thu', sent: 21100, delivered: 20700, read: 17800 },
  { day: 'Fri', sent: 29800, delivered: 29200, read: 25600 },
  { day: 'Sat', sent: 16400, delivered: 16100, read: 13200 },
  { day: 'Sun', sent: 12100, delivered: 11900, read: 9800 },
];

export const MessageChart: React.FC = () => {
  const [metric, setMetric] = useState<'sent' | 'read'>('sent');
  const maxVal = 32000;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Message Volume & Engagement</h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Hourly and daily throughput across all connected Meta numbers
          </p>
        </div>

        {/* Metric Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs self-start sm:self-auto">
          <button
            onClick={() => setMetric('sent')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              metric === 'sent'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Outbound Sent
          </button>
          <button
            onClick={() => setMetric('read')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              metric === 'read'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Read & Engaged
          </button>
        </div>
      </div>

      {/* Visual Bar Chart */}
      <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-100 dark:border-slate-800/80">
        {chartData.map((item) => {
          const val = metric === 'sent' ? item.sent : item.read;
          const heightPercent = Math.round((val / maxVal) * 100);
          return (
            <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
              <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5 font-medium">
                {(val / 1000).toFixed(1)}k
              </div>
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full max-w-[36px] rounded-t-lg transition-all duration-300 ${
                  metric === 'sent'
                    ? 'bg-linear-to-t from-emerald-600 to-teal-400 group-hover:brightness-110'
                    : 'bg-linear-to-t from-teal-600 to-emerald-300 group-hover:brightness-110'
                }`}
              />
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{item.day}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>98.8% Meta API Delivery</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
            <span>78.4% Read Rate</span>
          </div>
        </div>
        <span className="text-emerald-500 font-semibold">+18.4% vs last week</span>
      </div>
    </div>
  );
};
