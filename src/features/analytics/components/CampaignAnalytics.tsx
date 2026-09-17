import React from 'react';
import { Send, Eye, CheckCheck, AlertCircle } from 'lucide-react';
import type { CampaignMetricsResponse } from '../types';

interface CampaignAnalyticsProps {
  data: CampaignMetricsResponse | null;
  loading: boolean;
}

export const CampaignAnalytics: React.FC<CampaignAnalyticsProps> = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className="bg-white border border-[#E2EAE6] rounded-2xl p-6 h-64 animate-pulse bg-[#F6FAF8]" />
    );
  }

  const { recentCampaigns, totalCampaigns, activeCampaigns, completedCampaigns } = data;

  // Aggregate totals across campaigns
  const totalSent = recentCampaigns.reduce((acc, c) => acc + (c.sentCount || 0), 0);
  const totalDelivered = recentCampaigns.reduce((acc, c) => acc + (c.deliveredCount || 0), 0);
  const totalRead = recentCampaigns.reduce((acc, c) => acc + (c.readCount || 0), 0);
  const totalFailed = recentCampaigns.reduce((acc, c) => acc + (c.failedCount || 0), 0);

  const deliveryRate = totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 100;
  const readRate = totalDelivered > 0 ? Math.round((totalRead / totalDelivered) * 100) : 0;
  const failureRate = totalSent > 0 ? Math.round((totalFailed / totalSent) * 100) : 0;

  return (
    <div className="bg-white border border-[#E2EAE6] rounded-2xl p-6 shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E9F9EE] text-[#05A222] flex items-center justify-center">
            <Send className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-base font-bold text-[#14201C]">Broadcast Campaign Aggregate Performance</h4>
            <p className="text-xs text-[#5F7069]">Overall delivery, read rate, and status breakdown across all campaigns</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="bg-[#E9F9EE] text-[#05A222] px-2.5 py-1 rounded-lg">
            {activeCampaigns} Active
          </span>
          <span className="bg-[#F6FAF8] border border-[#E2EAE6] text-[#5F7069] px-2.5 py-1 rounded-lg">
            {completedCampaigns} Completed
          </span>
          <span className="text-[#14201C] font-bold">
            Total: {totalCampaigns}
          </span>
        </div>
      </div>

      <div className="space-y-4 text-sm">
        {/* Delivery Success Bar */}
        <div>
          <div className="flex justify-between mb-1.5 font-medium text-xs">
            <span className="text-[#5F7069] flex items-center gap-1.5">
              <CheckCheck className="w-3.5 h-3.5 text-[#05A222]" /> Delivery Success ({deliveryRate}%)
            </span>
            <span className="font-bold text-[#14201C]">{totalDelivered.toLocaleString()} / {totalSent.toLocaleString()} msgs</span>
          </div>
          <div className="w-full h-2.5 bg-[#F6FAF8] border border-[#E2EAE6] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#05A222] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(deliveryRate, 100)}%` }}
            />
          </div>
        </div>

        {/* Read Rate Bar */}
        <div>
          <div className="flex justify-between mb-1.5 font-medium text-xs">
            <span className="text-[#5F7069] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#07CF74]" /> Open & Read Rate ({readRate}%)
            </span>
            <span className="font-bold text-[#14201C]">{totalRead.toLocaleString()} msgs read</span>
          </div>
          <div className="w-full h-2.5 bg-[#F6FAF8] border border-[#E2EAE6] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#07CF74] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(readRate, 100)}%` }}
            />
          </div>
        </div>

        {/* Failure Rate Bar */}
        {totalFailed > 0 && (
          <div>
            <div className="flex justify-between mb-1.5 font-medium text-xs">
              <span className="text-[#E53E3E] flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#E53E3E]" /> Delivery Failed ({failureRate}%)
              </span>
              <span className="font-bold text-[#E53E3E]">{totalFailed.toLocaleString()} msgs failed</span>
            </div>
            <div className="w-full h-2.5 bg-[#F6FAF8] border border-[#E2EAE6] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E53E3E] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(failureRate, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
