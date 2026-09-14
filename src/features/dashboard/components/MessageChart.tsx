import React, { useState } from 'react';
import { BarChart3, Inbox } from 'lucide-react';
import type { MessageTimeseriesPoint, OverviewKPIs } from '../../analytics/types';

interface MessageChartProps {
  timeseries?: MessageTimeseriesPoint[];
  overview?: OverviewKPIs | null;
  loading?: boolean;
}

export const MessageChart: React.FC<MessageChartProps> = ({ timeseries = [], overview, loading = false }) => {
  const [metric, setMetric] = useState<'sent' | 'read'>('sent');

  // Prepare points: if empty, display 7 days with 0 counts
  const displayPoints = timeseries.length > 0
    ? timeseries.slice(-7)
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({
        date: day,
        sent: 0,
        delivered: 0,
        read: 0,
        failed: 0,
      }));

  const maxVal = Math.max(...displayPoints.map((p) => (metric === 'sent' ? p.sent : p.read)), 10);

  const deliveryRate = overview?.messages?.deliveryRate !== undefined ? `${overview.messages.deliveryRate}%` : '0%';
  const readRate = overview?.messages?.readRate !== undefined ? `${overview.messages.readRate}%` : '0%';

  const formatDay = (dateStr: string) => {
    if (['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].includes(dateStr)) return dateStr;
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString([], { weekday: 'short' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white border border-[#E2EAE6] rounded-2xl p-6 shadow-[0_8px_30px_rgba(1,59,35,0.04)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <BarChart3 className="w-5 h-5 text-[#05A222]" />
            <h4 className="text-base sm:text-lg font-bold text-[#14201C]">Message Volume & Engagement</h4>
          </div>
          <p className="text-sm text-[#5F7069] mt-1">
            Real-time throughput across all connected WhatsApp Business numbers
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
      {loading ? (
        <div className="h-56 flex items-center justify-center text-xs text-[#5F7069]">
          Loading chart data...
        </div>
      ) : displayPoints.every((p) => p.sent === 0 && p.read === 0) ? (
        <div className="h-56 flex flex-col items-center justify-center text-center p-4 bg-[#F6FAF8] rounded-xl border border-dashed border-[#E2EAE6]">
          <Inbox className="w-8 h-8 text-[#8A9993] mb-2" />
          <span className="text-xs font-bold text-[#14201C]">No message throughput in this timeframe</span>
          <span className="text-[11px] text-[#5F7069] mt-0.5">Send a WhatsApp template or broadcast to see live charts</span>
        </div>
      ) : (
        <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2 border-b border-[#E2EAE6]">
          {displayPoints.map((item, idx) => {
            const val = metric === 'sent' ? item.sent : item.read;
            const heightPercent = Math.max(Math.round((val / maxVal) * 100), 4);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2.5 h-full justify-end group relative">
                <div className="text-xs bg-[#14201C] text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 font-bold pointer-events-none shadow-xs z-10">
                  {val.toLocaleString()}
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
                <span className="text-xs sm:text-sm font-semibold text-[#5F7069]">{formatDay(item.date)}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-[#5F7069] pt-2">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#05A222]" />
            <span className="font-semibold text-[#1F2A26]">{deliveryRate} Meta API Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#07CF74]" />
            <span className="font-semibold text-[#1F2A26]">{readRate} Read Rate</span>
          </div>
        </div>
        <span className="text-[#05A222] font-extrabold text-sm sm:text-base">Meta WhatsApp Cloud API</span>
      </div>
    </div>
  );
};
