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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Comprehensive WhatsApp Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time delivery rates, conversation ROI, and agent response metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
            {['7d', '30d', '90d'].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  range === r
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <Button variant="outline" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
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
