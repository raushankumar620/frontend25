import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Table, type Column } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { SearchBar } from '../../../components/common/SearchBar';
import { Plus, Eye, Send, CheckCircle2 } from 'lucide-react';
import type { Campaign } from '../types';
import { campaignsApi } from '../api';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const Campaigns: React.FC = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    campaignsApi.getCampaigns().then((data) => {
      setCampaigns(data);
      setIsLoading(false);
    });
  }, []);

  const filtered = campaigns.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.templateName.toLowerCase().includes(query.toLowerCase())
  );

  const columns: Column<Campaign>[] = [
    {
      header: 'Campaign',
      render: (c) => (
        <div>
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Send className="w-3.5 h-3.5 text-emerald-500" />
            <span>{c.name}</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-0.5">Template: {c.templateName}</div>
        </div>
      ),
    },
    {
      header: 'Audience & Reach',
      render: (c) => (
        <div>
          <div className="font-semibold text-slate-800 dark:text-slate-200">
            {c.totalRecipients.toLocaleString()} leads
          </div>
          <div className="text-[10px] text-slate-400">{c.targetAudience}</div>
        </div>
      ),
    },
    {
      header: 'Delivery / Read Rate',
      render: (c) => {
        const delRate = Math.round((c.deliveredCount / (c.sentCount || 1)) * 100);
        const readRate = Math.round((c.readCount / (c.deliveredCount || 1)) * 100);
        return (
          <div className="text-xs">
            <div className="text-emerald-500 font-semibold">{delRate}% delivered</div>
            <div className="text-teal-400 text-[10px]">{readRate}% read & opened</div>
          </div>
        );
      },
    },
    {
      header: 'Status',
      render: (c) => (
        <Badge
          variant={c.status === 'completed' ? 'success' : c.status === 'running' ? 'primary' : 'warning'}
          size="sm"
        >
          <CheckCircle2 className="w-3 h-3 mr-1" />
          {c.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Action',
      render: (c) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => navigate(`/campaigns/${c.id}`)}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
        >
          Analytics
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#14201C] tracking-tight">
            WhatsApp Broadcast Campaigns
          </h2>
          <p className="text-sm sm:text-base text-[#5F7069] mt-1.5 font-medium">
            Broadcast bulk personalized HSM template messages with high deliverability.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate(ROUTES.CREATE_CAMPAIGN)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="text-sm font-bold px-4.5 py-2.5 rounded-xl shadow-sm"
        >
          New Broadcast Campaign
        </Button>
      </div>

      <div className="mb-6 max-w-md">
        <SearchBar value={query} onChange={setQuery} placeholder="Search campaigns by name or template..." />
      </div>

      <Table columns={columns} data={filtered} isLoading={isLoading} />
    </PageContainer>
  );
};
