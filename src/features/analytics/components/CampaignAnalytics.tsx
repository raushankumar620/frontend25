import React from 'react';
import { Send } from 'lucide-react';

export const CampaignAnalytics: React.FC = () => {
  return (
    <div className="bg-white border border-[#E2EAE6] rounded-2xl p-6 shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-5">
      <div className="flex items-center gap-2.5">
        <Send className="w-5 h-5 text-[#039B56]" />
        <h4 className="text-base sm:text-lg font-bold text-[#14201C]">Broadcast Campaign Performance</h4>
      </div>

      <div className="space-y-4 text-sm">
        <div>
          <div className="flex justify-between mb-1.5 font-medium">
            <span className="text-[#5F7069]">Delivery Success (98.9%)</span>
            <span className="font-bold text-[#14201C]">127,076 msgs</span>
          </div>
          <div className="w-full h-2.5 bg-[#F6FAF8] border border-[#E2EAE6] rounded-full overflow-hidden">
            <div className="h-full bg-[#05A222] w-[98.9%]" />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1.5 font-medium">
            <span className="text-[#5F7069]">Open & Read Rate (84.1%)</span>
            <span className="font-bold text-[#14201C]">106,870 msgs</span>
          </div>
          <div className="w-full h-2.5 bg-[#F6FAF8] border border-[#E2EAE6] rounded-full overflow-hidden">
            <div className="h-full bg-[#07CF74] w-[84.1%]" />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1.5 font-medium">
            <span className="text-[#5F7069]">CTA Button Click Rate (28.4%)</span>
            <span className="font-bold text-[#14201C]">36,090 clicks</span>
          </div>
          <div className="w-full h-2.5 bg-[#F6FAF8] border border-[#E2EAE6] rounded-full overflow-hidden">
            <div className="h-full bg-[#006736] w-[28.4%]" />
          </div>
        </div>
      </div>
    </div>
  );
};
