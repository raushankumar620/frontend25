import React from 'react';
import { MessageSquare } from 'lucide-react';

export const MessageAnalytics: React.FC = () => {
  return (
    <div className="bg-white border border-[#E2EAE6] rounded-2xl p-6 shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-5">
      <div className="flex items-center gap-2.5">
        <MessageSquare className="w-5 h-5 text-[#05A222]" />
        <h4 className="text-base sm:text-lg font-bold text-[#14201C]">Message Throughput Breakdown</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl">
          <div className="text-xs text-[#5F7069] font-medium">Total Inbound</div>
          <div className="text-2xl font-black text-[#14201C] mt-1.5">42,190</div>
          <div className="text-xs text-[#05A222] font-bold mt-1">+14.2% vs last month</div>
        </div>
        <div className="p-4 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl">
          <div className="text-xs text-[#5F7069] font-medium">Total Outbound</div>
          <div className="text-2xl font-black text-[#14201C] mt-1.5">128,490</div>
          <div className="text-xs text-[#05A222] font-bold mt-1">+24.2% vs last month</div>
        </div>
        <div className="p-4 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl">
          <div className="text-xs text-[#5F7069] font-medium">Avg First Response Time</div>
          <div className="text-2xl font-black text-[#14201C] mt-1.5">1.2 mins</div>
          <div className="text-xs text-[#05A222] font-bold mt-1">-40s faster with AI</div>
        </div>
      </div>
    </div>
  );
};
