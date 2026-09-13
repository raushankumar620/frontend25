import React, { useState } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { MessageAnalytics } from '../components/MessageAnalytics';
import { CampaignAnalytics } from '../components/CampaignAnalytics';
import { CustomerAnalytics } from '../components/CustomerAnalytics';
import { Button } from '../../../components/ui/Button';
import { Download } from 'lucide-react';

export const Analytics: React.FC = () => {
  const [range, setRange] = useState('30d');

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#14201C] tracking-tight">
            Comprehensive WhatsApp Analytics
          </h2>
          <p className="text-sm sm:text-base text-[#5F7069] mt-1.5 font-medium">
            Real-time delivery rates, conversation ROI, and agent response metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#F6FAF8] border border-[#E2EAE6] p-1 rounded-xl text-sm font-semibold">
            {['7d', '30d', '90d'].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  range === r
                    ? 'bg-white text-[#006736] shadow-xs border border-[#E2EAE6]'
                    : 'text-[#5F7069] hover:text-[#14201C]'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <Button variant="outline" size="md" leftIcon={<Download className="w-4 h-4" />} className="text-sm font-semibold border-[#C4EBD0] text-[#006736] hover:bg-[#F6FAF8] rounded-xl">
            Export PDF Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MessageAnalytics />
        <CampaignAnalytics />
        <div className="lg:col-span-2">
          <CustomerAnalytics />
        </div>
      </div>
    </PageContainer>
  );
};
