import React from 'react';
import { Send, Eye } from 'lucide-react';
import type { CampaignMetricsResponse } from '../types';

interface CampaignROIProps {
  data: CampaignMetricsResponse | null;
  loading: boolean;
}

export const CampaignROI: React.FC<CampaignROIProps> = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className="bg-white border border-[#E2EAE6] rounded-2xl p-6 h-80 animate-pulse bg-[#F6FAF8]" />
    );
  }

  const { totalCampaigns, activeCampaigns, completedCampaigns, recentCampaigns } = data;

  return (
    <div className="bg-white border border-[#E2EAE6] rounded-2xl p-6 shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E9F9EE] text-[#05A222] flex items-center justify-center">
            <Send className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-base font-bold text-[#14201C]">Campaign Deliverability & ROI</h4>
            <p className="text-xs text-[#5F7069]">Broadcast campaigns delivery and read response rates</p>
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

      {recentCampaigns.length === 0 ? (
        <div className="p-8 text-center text-sm text-[#5F7069] bg-[#F6FAF8] rounded-xl border border-[#E2EAE6]">
          No campaigns found in this time range.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#E2EAE6] text-xs font-bold text-[#5F7069] uppercase tracking-wider">
                <th className="pb-3 pl-2">Campaign Name</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-center">Recipients</th>
                <th className="pb-3 text-center">Delivered</th>
                <th className="pb-3 text-center">Read Rate</th>
                <th className="pb-3 text-right pr-2">Delivery Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EAE6]/60">
              {recentCampaigns.map((camp) => {
                const isRunning = camp.status === 'RUNNING' || camp.status === 'PROCESSING';
                const isCompleted = camp.status === 'COMPLETED';

                return (
                  <tr key={camp.id} className="hover:bg-[#F6FAF8] transition-colors">
                    <td className="py-3 pl-2">
                      <div className="font-bold text-xs sm:text-sm text-[#14201C]">{camp.name}</div>
                      <div className="text-[11px] text-[#5F7069]">
                        {new Date(camp.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          isRunning
                            ? 'bg-[#E9F9EE] text-[#05A222] animate-pulse'
                            : isCompleted
                            ? 'bg-[#E2EAE6] text-[#006736]'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {camp.status}
                      </span>
                    </td>
                    <td className="py-3 text-center font-semibold text-[#14201C]">
                      {camp.totalRecipients.toLocaleString()}
                    </td>
                    <td className="py-3 text-center">
                      <span className="font-bold text-xs text-[#05A222]">
                        {camp.deliveredCount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#07CF74]">
                        <Eye className="w-3 h-3" /> {camp.readRate}
                      </span>
                    </td>
                    <td className="py-3 text-right pr-2">
                      <span className="text-xs font-black text-[#14201C] bg-[#E9F9EE] px-2 py-1 rounded-md">
                        {camp.deliveryRate}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
