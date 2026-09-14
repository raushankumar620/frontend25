import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../components/layout/PageContainer';
import { campaignsApi } from '../api';
import type { Campaign } from '../types';
import type { CampaignRecipientItem } from '../../../services/campaignService';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Table, type Column } from '../../../components/ui/Table';
import { SearchBar } from '../../../components/common/SearchBar';
import {
  ArrowLeft,
  Send,
  CheckCircle2,
  Eye,
  MessageCircle,
  Play,
  Pause,
  XCircle,
  FileText,
  Users
} from 'lucide-react';
import { ROUTES } from '../../../utils/constants';

export const CampaignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [recipients, setRecipients] = useState<CampaignRecipientItem[]>([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isLoadingRecipients, setIsLoadingRecipients] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchCampaign = useCallback(async () => {
    if (!id) return;
    try {
      const data = await campaignsApi.getCampaignById(id);
      if (data) setCampaign(data);
    } catch (err) {
      console.error('Error fetching campaign:', err);
    }
  }, [id]);

  const fetchRecipients = useCallback(async () => {
    if (!id) return;
    setIsLoadingRecipients(true);
    try {
      const res = await campaignsApi.getCampaignRecipients(id, {
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        search: query.trim() || undefined,
      });
      setRecipients(res.recipients);
    } catch {
      // Fallback
      setRecipients([]);
    } finally {
      setIsLoadingRecipients(false);
    }
  }, [id, statusFilter, query]);

  useEffect(() => {
    fetchCampaign();
    fetchRecipients();
  }, [fetchCampaign, fetchRecipients]);

  const handleAction = async (action: 'start' | 'pause' | 'resume' | 'cancel') => {
    if (!id) return;
    setIsActionLoading(true);
    try {
      if (action === 'start') await campaignsApi.startCampaign(id);
      else if (action === 'pause') await campaignsApi.pauseCampaign(id);
      else if (action === 'resume') await campaignsApi.resumeCampaign(id);
      else if (action === 'cancel') await campaignsApi.cancelCampaign(id);
      await fetchCampaign();
      await fetchRecipients();
    } catch (err) {
      console.error(`Action ${action} failed:`, err);
    } finally {
      setIsActionLoading(false);
    }
  };

  if (!campaign) {
    return (
      <PageContainer>
        <div className="p-12 text-center text-slate-400 font-medium">Loading campaign analytics...</div>
      </PageContainer>
    );
  }

  const sentPercent = campaign.totalRecipients > 0 ? Math.round((campaign.sentCount / campaign.totalRecipients) * 100) : 0;
  const delivPercent = campaign.sentCount > 0 ? Math.round((campaign.deliveredCount / campaign.sentCount) * 100) : 0;
  const readPercent = campaign.deliveredCount > 0 ? Math.round((campaign.readCount / campaign.deliveredCount) * 100) : 0;

  const recipientColumns: Column<CampaignRecipientItem>[] = [
    {
      header: 'Recipient',
      render: (r) => (
        <div>
          <div className="font-bold text-slate-900 dark:text-white text-xs">
            {r.name || 'Anonymous Lead'}
          </div>
          <div className="font-mono text-[11px] text-slate-400">{r.phoneNumber}</div>
        </div>
      ),
    },
    {
      header: 'Personalized Variables',
      render: (r) => (
        <div className="text-xs text-slate-600 dark:text-slate-300 font-mono">
          {Object.keys(r.variables || {}).length > 0
            ? Object.entries(r.variables).map(([k, v]) => `{{${k}}}: ${v}`).join(' • ')
            : '—'}
        </div>
      ),
    },
    {
      header: 'Delivery Status',
      render: (r) => {
        const s = r.status.toUpperCase();
        if (s === 'READ') return <Badge variant="success" size="sm">Read & Opened</Badge>;
        if (s === 'DELIVERED') return <Badge variant="primary" size="sm">Delivered</Badge>;
        if (s === 'SENT') return <Badge variant="neutral" size="sm">Sent</Badge>;
        if (s === 'FAILED') return <Badge variant="danger" size="sm">Failed</Badge>;
        return <Badge variant="neutral" size="sm">Pending</Badge>;
      },
    },
    {
      header: 'Timeline',
      render: (r) => (
        <div className="text-[11px] text-slate-400">
          {r.readAt ? (
            <span>Read {new Date(r.readAt).toLocaleTimeString()}</span>
          ) : r.deliveredAt ? (
            <span>Delivered {new Date(r.deliveredAt).toLocaleTimeString()}</span>
          ) : r.sentAt ? (
            <span>Sent {new Date(r.sentAt).toLocaleTimeString()}</span>
          ) : (
            <span>Queued</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <button
        onClick={() => navigate(ROUTES.CAMPAIGNS)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Campaigns</span>
      </button>

      {/* Top Details & Action Header */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {campaign.name}
            </h2>
            <Badge
              variant={
                campaign.status === 'completed'
                  ? 'success'
                  : campaign.status === 'running'
                  ? 'primary'
                  : campaign.status === 'paused'
                  ? 'neutral'
                  : 'warning'
              }
              size="md"
            >
              {campaign.status.toUpperCase()}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-500" /> Audience: <strong className="text-slate-700 dark:text-slate-200">{campaign.targetAudience}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-500" /> Template: <strong className="text-slate-700 dark:text-slate-200 font-mono">{campaign.templateName}</strong>
            </span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {campaign.status === 'draft' && (
            <Button
              variant="primary"
              size="sm"
              isLoading={isActionLoading}
              onClick={() => handleAction('start')}
              leftIcon={<Play className="w-4 h-4" />}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              Start Broadcast
            </Button>
          )}

          {campaign.status === 'running' && (
            <Button
              variant="outline"
              size="sm"
              isLoading={isActionLoading}
              onClick={() => handleAction('pause')}
              leftIcon={<Pause className="w-4 h-4 text-amber-500" />}
            >
              Pause Broadcast
            </Button>
          )}

          {campaign.status === 'paused' && (
            <Button
              variant="primary"
              size="sm"
              isLoading={isActionLoading}
              onClick={() => handleAction('resume')}
              leftIcon={<Play className="w-4 h-4" />}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              Resume Broadcast
            </Button>
          )}

          {['draft', 'running', 'paused', 'scheduled'].includes(campaign.status) && (
            <Button
              variant="outline"
              size="sm"
              isLoading={isActionLoading}
              onClick={() => handleAction('cancel')}
              leftIcon={<XCircle className="w-4 h-4 text-rose-500" />}
              className="text-rose-600 border-rose-200 dark:border-rose-900"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Funnel Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Total Dispatched</span>
            <Send className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {campaign.sentCount.toLocaleString()} / {campaign.totalRecipients.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
            {sentPercent}% batch completed
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Delivered</span>
            <CheckCircle2 className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {campaign.deliveredCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-teal-600 dark:text-teal-400 mt-1 font-semibold">
            {delivPercent}% Delivery rate
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Read & Opened</span>
            <Eye className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {campaign.readCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-indigo-500 mt-1 font-semibold">
            {readPercent}% Open rate
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Replied</span>
            <MessageCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {campaign.repliedCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-500 mt-1 font-semibold">
            Inbound responses
          </div>
        </div>
      </div>

      {/* Recipient Delivery Log Table */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Broadcast Recipients & Delivery Logs</h3>
            <p className="text-xs text-slate-400">Real-time status updates per recipient from WhatsApp Cloud API.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="w-full sm:w-64">
              <SearchBar value={query} onChange={setQuery} placeholder="Search recipient or phone..." />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(['ALL', 'SENT', 'DELIVERED', 'READ', 'FAILED', 'PENDING'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    statusFilter === st
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Table columns={recipientColumns} data={recipients} isLoading={isLoadingRecipients} />
      </div>
    </PageContainer>
  );
};
