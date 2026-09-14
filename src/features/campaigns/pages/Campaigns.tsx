import React, { useState, useEffect, useCallback } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Table, type Column } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { SearchBar } from '../../../components/common/SearchBar';
import {
  Plus,
  Send,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  XCircle,
  Radio,
  BarChart3,
} from 'lucide-react';
import type { Campaign } from '../types';
import { campaignsApi } from '../api';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const Campaigns: React.FC = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [query, setQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await campaignsApi.getCampaigns({
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
        search: query.trim() || undefined,
      });
      setCampaigns(data);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus, query]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleStart = async (id: string) => {
    setActionLoadingId(id);
    try {
      await campaignsApi.startCampaign(id);
      await fetchCampaigns();
    } catch (err) {
      console.error('Failed to start campaign:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePause = async (id: string) => {
    setActionLoadingId(id);
    try {
      await campaignsApi.pauseCampaign(id);
      await fetchCampaigns();
    } catch (err) {
      console.error('Failed to pause campaign:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleResume = async (id: string) => {
    setActionLoadingId(id);
    try {
      await campaignsApi.resumeCampaign(id);
      await fetchCampaigns();
    } catch (err) {
      console.error('Failed to resume campaign:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filtered = campaigns.filter((c) => {
    const matchesQuery =
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.templateName.toLowerCase().includes(query.toLowerCase());
    const matchesStatus =
      selectedStatus === 'ALL' || c.status.toUpperCase() === selectedStatus.toUpperCase();
    return matchesQuery && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return (
          <Badge variant="success" size="sm">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Completed
          </Badge>
        );
      case 'RUNNING':
        return (
          <Badge variant="primary" size="sm">
            <Radio className="w-3.5 h-3.5 mr-1 animate-pulse text-emerald-500" />
            Running
          </Badge>
        );
      case 'SCHEDULED':
        return (
          <Badge variant="warning" size="sm">
            <Clock className="w-3.5 h-3.5 mr-1" />
            Scheduled
          </Badge>
        );
      case 'PAUSED':
        return (
          <Badge variant="neutral" size="sm">
            <Pause className="w-3.5 h-3.5 mr-1 text-amber-500" />
            Paused
          </Badge>
        );
      case 'CANCELLED':
        return (
          <Badge variant="danger" size="sm">
            <XCircle className="w-3.5 h-3.5 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="neutral" size="sm">
            {status}
          </Badge>
        );
    }
  };

  const columns: Column<Campaign>[] = [
    {
      header: 'Campaign & Template',
      render: (c) => (
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <Send className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{c.name}</span>
            </div>
            <div className="text-xs font-mono text-slate-400 mt-0.5">
              Template: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{c.templateName}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Audience',
      render: (c) => (
        <div>
          <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">
            {c.totalRecipients.toLocaleString()} Recipients
          </div>
          <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
            {c.targetAudience}
          </div>
        </div>
      ),
    },
    {
      header: 'Delivery Progress',
      render: (c) => {
        const sentPercent = c.totalRecipients > 0 ? Math.round((c.sentCount / c.totalRecipients) * 100) : 0;
        const delPercent = c.sentCount > 0 ? Math.round((c.deliveredCount / c.sentCount) * 100) : 0;
        const readPercent = c.deliveredCount > 0 ? Math.round((c.readCount / c.deliveredCount) * 100) : 0;

        return (
          <div className="w-44 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <span className="text-slate-600 dark:text-slate-300">{sentPercent}% Sent</span>
              <span className="text-emerald-600 dark:text-emerald-400">{c.sentCount}/{c.totalRecipients}</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${sentPercent}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span>{delPercent}% Deliv.</span>
              <span>•</span>
              <span>{readPercent}% Read</span>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Status',
      render: (c) => getStatusBadge(c.status),
    },
    {
      header: 'Actions',
      render: (c) => (
        <div className="flex items-center gap-1.5">
          {c.status.toUpperCase() === 'DRAFT' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStart(c.id)}
              isLoading={actionLoadingId === c.id}
              leftIcon={<Play className="w-3.5 h-3.5 text-emerald-500" />}
              className="text-xs font-semibold px-2.5 py-1"
            >
              Start
            </Button>
          )}

          {c.status.toUpperCase() === 'RUNNING' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePause(c.id)}
              isLoading={actionLoadingId === c.id}
              leftIcon={<Pause className="w-3.5 h-3.5 text-amber-500" />}
              className="text-xs font-semibold px-2.5 py-1"
            >
              Pause
            </Button>
          )}

          {c.status.toUpperCase() === 'PAUSED' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleResume(c.id)}
              isLoading={actionLoadingId === c.id}
              leftIcon={<Play className="w-3.5 h-3.5 text-emerald-500" />}
              className="text-xs font-semibold px-2.5 py-1"
            >
              Resume
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(`/campaigns/${c.id}`)}
            leftIcon={<BarChart3 className="w-3.5 h-3.5 text-slate-500" />}
            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-2.5 py-1"
          >
            Analytics
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#14201C] dark:text-white tracking-tight flex items-center gap-2.5">
            <Send className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            WhatsApp Broadcast Campaigns
          </h2>
          <p className="text-sm sm:text-base text-[#5F7069] dark:text-slate-400 mt-1 font-medium">
            Schedule and launch bulk personalized HSM template messages with high deliverability and analytics.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate(ROUTES.CREATE_CAMPAIGN)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="text-sm font-bold px-4.5 py-2.5 rounded-xl shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          New Broadcast Campaign
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="max-w-md w-full">
          <SearchBar value={query} onChange={setQuery} placeholder="Search campaigns by name or template..." />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'RUNNING', 'SCHEDULED', 'COMPLETED', 'PAUSED', 'DRAFT'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedStatus === st
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <Table columns={columns} data={filtered} isLoading={isLoading} />
    </PageContainer>
  );
};
