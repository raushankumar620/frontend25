import React from 'react';
import { Users } from 'lucide-react';

export const CustomerAnalytics: React.FC = () => {
  return (
    <div className="bg-white border border-[#E2EAE6] rounded-2xl p-6 shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-5">
      <div className="flex items-center gap-2.5">
        <Users className="w-5 h-5 text-[#07CF74]" />
        <h4 className="text-base sm:text-lg font-bold text-[#14201C]">Audience Growth & Retention</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="p-4 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl">
          <div className="text-xs text-[#5F7069] font-medium">Total Opted-In Leads</div>
          <div className="text-2xl font-black text-[#14201C] mt-1.5">45,210</div>
          <div className="text-xs text-[#05A222] font-bold mt-1">+1,420 this month</div>
        </div>
        <div className="p-4 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl">
          <div className="text-xs text-[#5F7069] font-medium">Opt-out / Unsubscribe Rate</div>
          <div className="text-2xl font-black text-[#14201C] mt-1.5">0.14%</div>
          <div className="text-xs text-[#006736] font-bold mt-1">Well below Meta 1% threshold</div>
        </div>
      </div>
    </div>
  );
};
