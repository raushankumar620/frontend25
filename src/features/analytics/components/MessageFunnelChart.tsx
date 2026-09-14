import React from 'react';
import { Send, CheckCheck, Eye, ArrowDownLeft, AlertCircle, BarChart3 } from 'lucide-react';
import type { MessageStats, MessageTimeseriesPoint } from '../types';

interface MessageFunnelChartProps {
  stats: MessageStats | null;
  timeseries: MessageTimeseriesPoint[];
  loading: boolean;
}

export const MessageFunnelChart: React.FC<MessageFunnelChartProps> = ({ stats, timeseries, loading }) => {
  if (loading || !stats) {
    return (
      <div className="bg-white border border-[#E2EAE6] rounded-2xl p-6 h-80 animate-pulse bg-[#F6FAF8]" />
    );
  }

  const outbound = stats.outbound || 1;
  const deliveredPct = Math.round(((stats.delivered || 0) / outbound) * 100);
  const readPct = Math.round(((stats.read || 0) / (stats.delivered || 1)) * 100);
  const failedPct = Math.round(((stats.failed || 0) / outbound) * 100);

  const maxVolume = Math.max(...timeseries.map((t) => Math.max(t.sent, t.inbound, 1)), 10);

  return (
    <div className="bg-white border border-[#E2EAE6] rounded-2xl p-6 shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E9F9EE] text-[#05A222] flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-base font-bold text-[#14201C]">Message Delivery & Conversion Funnel</h4>
            <p className="text-xs text-[#5F7069]">End-to-end delivery lifecycle across all channels</p>
          </div>
        </div>
        <span className="text-xs font-bold text-[#05A222] bg-[#E9F9EE] px-2.5 py-1 rounded-lg">
          {stats.deliveryRate} Delivery Rate
        </span>
      </div>

      {/* Visual Funnel */}
      <div className="space-y-3.5">
        {/* Step 1: Outbound Sent */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
            <span className="flex items-center gap-1.5 text-[#14201C] font-bold">
              <Send className="w-3.5 h-3.5 text-[#006736]" /> Outbound Sent
            </span>
            <span className="font-bold text-[#14201C]">{stats.sent.toLocaleString()} msgs (100%)</span>
          </div>
          <div className="w-full h-3 bg-[#F6FAF8] border border-[#E2EAE6] rounded-full overflow-hidden">
            <div className="h-full bg-[#006736] rounded-full transition-all duration-500" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Step 2: Delivered */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
            <span className="flex items-center gap-1.5 text-[#14201C] font-bold">
              <CheckCheck className="w-3.5 h-3.5 text-[#05A222]" /> Delivered to Device
            </span>
            <span className="font-bold text-[#05A222]">{stats.delivered.toLocaleString()} msgs ({deliveredPct}%)</span>
          </div>
          <div className="w-full h-3 bg-[#F6FAF8] border border-[#E2EAE6] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#05A222] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(deliveredPct, 100)}%` }}
            />
          </div>
        </div>

        {/* Step 3: Read */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
            <span className="flex items-center gap-1.5 text-[#14201C] font-bold">
              <Eye className="w-3.5 h-3.5 text-[#07CF74]" /> Read by Recipient
            </span>
            <span className="font-bold text-[#07CF74]">{stats.read.toLocaleString()} msgs ({readPct}% of delivered)</span>
          </div>
          <div className="w-full h-3 bg-[#F6FAF8] border border-[#E2EAE6] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#07CF74] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(readPct, 100)}%` }}
            />
          </div>
        </div>

        {/* Step 4: Inbound Responses */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
            <span className="flex items-center gap-1.5 text-[#14201C] font-bold">
              <ArrowDownLeft className="w-3.5 h-3.5 text-[#039B56]" /> Customer Replies (Inbound)
            </span>
            <span className="font-bold text-[#039B56]">{stats.inbound.toLocaleString()} incoming</span>
          </div>
          <div className="w-full h-3 bg-[#F6FAF8] border border-[#E2EAE6] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#039B56] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(outbound > 0 ? (stats.inbound / outbound) * 100 : 30, 100)}%` }}
            />
          </div>
        </div>

        {/* Step 5: Failed */}
        {stats.failed > 0 && (
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
              <span className="flex items-center gap-1.5 text-[#E53E3E] font-bold">
                <AlertCircle className="w-3.5 h-3.5 text-[#E53E3E]" /> Delivery Failed
              </span>
              <span className="font-bold text-[#E53E3E]">{stats.failed.toLocaleString()} msgs ({failedPct}%)</span>
            </div>
            <div className="w-full h-2 bg-[#F6FAF8] border border-[#E2EAE6] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E53E3E] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(failedPct, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Daily Volume Bars */}
      {timeseries.length > 0 && (
        <div className="pt-4 border-t border-[#E2EAE6]/60">
          <div className="flex items-center justify-between text-xs font-bold text-[#5F7069] mb-3">
            <span>Daily Activity Breakdown</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#05A222]" /> Sent</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#039B56]" /> Inbound</span>
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-28 pt-2">
            {timeseries.map((day, idx) => {
              const sentHeight = Math.max(Math.round((day.sent / maxVolume) * 100), 8);
              const inHeight = Math.max(Math.round((day.inbound / maxVolume) * 100), 4);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-0.5">
                    <div
                      style={{ height: `${sentHeight}%` }}
                      className="w-1/2 bg-[#05A222] rounded-t-sm transition-all group-hover:bg-[#006736]"
                    />
                    <div
                      style={{ height: `${inHeight}%` }}
                      className="w-1/2 bg-[#039B56] opacity-60 rounded-t-sm transition-all group-hover:opacity-100"
                    />
                  </div>
                  <span className="text-[10px] text-[#5F7069] truncate w-full text-center">
                    {day.date.split('-').slice(1).join('/')}
                  </span>

                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col bg-[#14201C] text-white text-[10px] p-2 rounded-lg shadow-xl z-20 whitespace-nowrap">
                    <span className="font-bold">{day.date}</span>
                    <span>Outbound: {day.sent}</span>
                    <span>Delivered: {day.delivered}</span>
                    <span>Inbound: {day.inbound}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
