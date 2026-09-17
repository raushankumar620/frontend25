import React from 'react';
import { Send, ArrowDownLeft, CheckCheck, Eye, AlertCircle, BarChart2 } from 'lucide-react';
import type { MessageStats } from '../types';

interface MessageAnalyticsProps {
  stats: MessageStats | null;
  loading: boolean;
}

export const MessageAnalytics: React.FC<MessageAnalyticsProps> = ({ stats, loading }) => {
  if (loading || !stats) {
    return (
      <div className="bg-white border border-[#E2EAE6] rounded-2xl p-6 h-64 animate-pulse bg-[#F6FAF8]" />
    );
  }

  const outbound = stats.outbound || 1;
  const deliveredPct = Math.round(((stats.delivered || 0) / outbound) * 100);
  const readPct = Math.round(((stats.read || 0) / (stats.delivered || 1)) * 100);
  const failedPct = Math.round(((stats.failed || 0) / outbound) * 100);

  return (
    <div className="bg-white border border-[#E2EAE6] rounded-2xl p-6 shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E9F9EE] text-[#05A222] flex items-center justify-center">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-base font-bold text-[#14201C]">Message Throughput & Deliverability Breakdown</h4>
            <p className="text-xs text-[#5F7069]">Detailed breakdown of inbound customer inquiries vs outbound broadcast traffic</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#05A222] bg-[#E9F9EE] px-3 py-1 rounded-lg border border-[#C4EBD0]">
            Total Volume: {(stats.total || (stats.outbound + stats.inbound)).toLocaleString()} msgs
          </span>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Outbound Sent */}
        <div className="p-4 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5F7069] font-semibold">Total Outbound</span>
            <Send className="w-4 h-4 text-[#006736]" />
          </div>
          <div className="text-2xl font-black text-[#14201C] mt-2">
            {stats.outbound.toLocaleString()}
          </div>
          <div className="text-xs text-[#05A222] font-semibold mt-1">
            Sent: {stats.sent.toLocaleString()}
          </div>
        </div>

        {/* Delivered to Device */}
        <div className="p-4 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5F7069] font-semibold">Delivered Success</span>
            <CheckCheck className="w-4 h-4 text-[#05A222]" />
          </div>
          <div className="text-2xl font-black text-[#14201C] mt-2">
            {stats.delivered.toLocaleString()}
          </div>
          <div className="text-xs text-[#05A222] font-semibold mt-1">
            Rate: {stats.deliveryRate} ({deliveredPct}%)
          </div>
        </div>

        {/* Read by Customer */}
        <div className="p-4 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5F7069] font-semibold">Read by Customer</span>
            <Eye className="w-4 h-4 text-[#07CF74]" />
          </div>
          <div className="text-2xl font-black text-[#14201C] mt-2">
            {stats.read.toLocaleString()}
          </div>
          <div className="text-xs text-[#07CF74] font-semibold mt-1">
            Read Rate: {stats.readRate} ({readPct}%)
          </div>
        </div>

        {/* Inbound Replies */}
        <div className="p-4 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5F7069] font-semibold">Inbound Replies</span>
            <ArrowDownLeft className="w-4 h-4 text-[#039B56]" />
          </div>
          <div className="text-2xl font-black text-[#14201C] mt-2">
            {stats.inbound.toLocaleString()}
          </div>
          <div className="text-xs text-[#5F7069] font-semibold mt-1">
            {stats.failed > 0 ? (
              <span className="text-[#E53E3E] font-bold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Failed: {stats.failed} ({failedPct}%)
              </span>
            ) : (
              <span className="text-[#05A222]">0 Failures</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
