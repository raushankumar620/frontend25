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
    <div className="bg-white border border-[#E2EAE6] rounded-2xl p-6 shadow-[0_8px_30px_rgba(1,59,35,0.04)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <BarChart3 className="w-5 h-5 text-[#05A222]" />
            <h4 className="text-base sm:text-lg font-bold text-[#14201C]">Message Volume & Engagement</h4>
          </div>
          <p className="text-sm text-[#5F7069] mt-1">
            Hourly and daily throughput across all connected Meta numbers
          </p>
        </div>

        {/* Metric Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl text-sm self-start sm:self-auto">
          <button
            onClick={() => setMetric('sent')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              metric === 'sent'
                ? 'bg-white text-[#006736] font-bold shadow-xs border border-[#E2EAE6]'
                : 'text-[#5F7069] hover:text-[#14201C]'
            }`}
          >
            Outbound Sent
          </button>
          <button
            onClick={() => setMetric('read')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              metric === 'read'
                ? 'bg-white text-[#006736] font-bold shadow-xs border border-[#E2EAE6]'
                : 'text-[#5F7069] hover:text-[#14201C]'
            }`}
          >
            Read & Engaged
          </button>
        </div>
      </div>

      {/* Visual Bar Chart */}
      <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2 border-b border-[#E2EAE6]">
        {chartData.map((item) => {
          const val = metric === 'sent' ? item.sent : item.read;
          const heightPercent = Math.round((val / maxVal) * 100);
          return (
            <div key={item.day} className="flex-1 flex flex-col items-center gap-2.5 h-full justify-end group relative">
              <div className="text-xs bg-[#14201C] text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 font-bold pointer-events-none shadow-xs">
                {(val / 1000).toFixed(1)}k
              </div>
              <div
                style={{
                  height: `${heightPercent}%`,
                  background:
                    metric === 'sent'
                      ? 'linear-gradient(180deg, #1CD72C 0%, #05A222 60%, #006736 100%)'
                      : 'linear-gradient(180deg, #07CF74 0%, #039B56 100%)',
                }}
                className="w-full max-w-[40px] rounded-t-lg transition-all duration-300 group-hover:brightness-110 shadow-xs"
              />
              <span className="text-xs sm:text-sm font-semibold text-[#5F7069]">{item.day}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-[#5F7069] pt-2">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#05A222]" />
            <span className="font-semibold text-[#1F2A26]">98.8% Meta API Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#07CF74]" />
            <span className="font-semibold text-[#1F2A26]">78.4% Read Rate</span>
          </div>
        </div>
        <span className="text-[#05A222] font-extrabold text-sm sm:text-base">+18.4% vs last week</span>
      </div>
    </div>
  );
};
