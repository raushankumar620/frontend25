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
  Users,
  Smartphone,
  ShieldCheck,
  Radio
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
        <div className="p-12 text-center text-[#5F7069] font-semibold">Loading campaign analytics...</div>
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
          <div className="font-bold text-[#14201C] text-xs">
            {r.name || 'Anonymous Lead'}
          </div>
          <div className="font-mono text-[11px] text-[#5F7069] font-medium">{r.phoneNumber}</div>
        </div>
      ),
    },
    {
      header: 'Personalized Variables',
      render: (r) => (
        <div className="text-xs text-[#1F2A26] font-mono">
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
        <div className="text-[11px] text-[#5F7069] font-medium">
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
      {/* Back button */}
      <button
        onClick={() => navigate(ROUTES.CAMPAIGNS)}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#5F7069] hover:text-[#14201C] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Campaigns</span>
      </button>

      {/* Top Details & Action Header */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2EAE6] mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_8px_30px_rgba(1,59,35,0.04)]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black text-[#14201C] tracking-tight">
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
              {campaign.status === 'running' && <Radio className="w-3.5 h-3.5 mr-1 text-[#05A222] animate-pulse" />}
              {campaign.status.toUpperCase()}
            </Badge>
          </div>
          <p className="text-xs text-[#5F7069] mt-2 font-medium flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#05A222]" /> Reach: <strong className="text-[#14201C]">{campaign.targetAudience}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#006736]" /> Template: <strong className="text-[#14201C] font-mono">{campaign.templateName}</strong>
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
              className="bg-[#05A222] hover:bg-[#006736] text-white font-bold"
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
              className="bg-[#05A222] hover:bg-[#006736] text-white font-bold"
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
              className="text-rose-600 border-rose-200 hover:bg-rose-50"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Grid: Analytics Cards + Live Message Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
        {/* Left Funnel Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Total Sent */}
            <div className="bg-white p-5 rounded-2xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)]">
              <div className="flex items-center justify-between text-[#5F7069] mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Dispatched</span>
                <div className="w-8 h-8 rounded-lg bg-[#E9F9EE] text-[#05A222] flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#14201C]">
                {campaign.sentCount.toLocaleString()} <span className="text-sm font-semibold text-[#8A9993]">/ {campaign.totalRecipients.toLocaleString()}</span>
              </div>
              <div className="w-full bg-[#E2EAE6] h-1.5 rounded-full overflow-hidden mt-3">
                <div className="bg-[#05A222] h-full rounded-full transition-all" style={{ width: `${sentPercent}%` }} />
              </div>
              <div className="text-[11px] text-[#05A222] mt-1.5 font-bold">
                {sentPercent}% outbound batch completed
              </div>
            </div>

            {/* Delivered */}
            <div className="bg-white p-5 rounded-2xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)]">
              <div className="flex items-center justify-between text-[#5F7069] mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Delivered</span>
                <div className="w-8 h-8 rounded-lg bg-[#E9F9EE] text-[#006736] flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#14201C]">
                {campaign.deliveredCount.toLocaleString()}
              </div>
              <div className="w-full bg-[#E2EAE6] h-1.5 rounded-full overflow-hidden mt-3">
                <div className="bg-[#006736] h-full rounded-full transition-all" style={{ width: `${delivPercent}%` }} />
              </div>
              <div className="text-[11px] text-[#006736] mt-1.5 font-bold">
                {delivPercent}% verified deliverability
              </div>
            </div>

            {/* Read & Opened */}
            <div className="bg-white p-5 rounded-2xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)]">
              <div className="flex items-center justify-between text-[#5F7069] mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Read & Opened</span>
                <div className="w-8 h-8 rounded-lg bg-[#E9F9EE] text-[#07CF74] flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#14201C]">
                {campaign.readCount.toLocaleString()}
              </div>
              <div className="w-full bg-[#E2EAE6] h-1.5 rounded-full overflow-hidden mt-3">
                <div className="bg-[#07CF74] h-full rounded-full transition-all" style={{ width: `${readPercent}%` }} />
              </div>
              <div className="text-[11px] text-[#05A222] mt-1.5 font-bold">
                {readPercent}% customer open rate
              </div>
            </div>

            {/* Inbound Replies */}
            <div className="bg-white p-5 rounded-2xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)]">
              <div className="flex items-center justify-between text-[#5F7069] mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Inbound Replies</span>
                <div className="w-8 h-8 rounded-lg bg-[#E9F9EE] text-[#039B56] flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#14201C]">
                {campaign.repliedCount.toLocaleString()}
              </div>
              <div className="text-[11px] text-[#5F7069] mt-3 font-medium">
                Live conversational customer replies
              </div>
            </div>
          </div>
        </div>

        {/* Right WhatsApp Smartphone Preview (4 cols) */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="text-xs font-bold text-[#5F7069] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-[#05A222]" />
            <span>Message Render Preview</span>
          </div>

          <div className="w-full max-w-[310px] bg-[#14201C] rounded-[38px] p-3 shadow-[0_16px_50px_rgba(1,59,35,0.12)] border-3 border-[#1F2A26]">
            {/* Screen */}
            <div className="bg-[#E5DDD5] rounded-[28px] p-3 min-h-[380px] flex flex-col justify-between overflow-hidden">
              {/* WhatsApp App Header */}
              <div className="bg-[#006736] text-white py-1.5 px-2.5 rounded-xl flex items-center gap-2 shadow-xs">
                <div className="w-6 h-6 rounded-full bg-[#05A222] flex items-center justify-center font-bold text-[10px] text-white shrink-0">
                  W
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-black truncate flex items-center gap-1">
                    <span>Acme Official Store</span>
                    <ShieldCheck className="w-3 h-3 text-[#6AEB31] shrink-0" />
                  </div>
                  <div className="text-[9px] text-[#C4EBD0]">Official WhatsApp Account</div>
                </div>
              </div>

              {/* Chat Bubble */}
              <div className="my-auto py-2">
                <div className="bg-white rounded-xl rounded-tl-xs p-3 shadow-xs space-y-1 text-xs text-[#14201C]">
                  <div className="font-bold text-[#006736] text-[11px] border-b border-[#E2EAE6] pb-0.5">
                    {campaign.templateName}
                  </div>
                  <div className="text-[11px] text-[#1F2A26] leading-relaxed">
                    Personalized HSM broadcast dispatched to {campaign.totalRecipients.toLocaleString()} recipients.
                  </div>
                  <div className="text-[8px] text-right text-[#8A9993] flex items-center justify-end gap-1 pt-1">
                    <span>12:45 PM</span>
                    <CheckCircle2 className="w-2.5 h-2.5 text-[#05A222]" />
                  </div>
                </div>
              </div>

              <div className="text-[9px] text-center text-[#5F7069] font-medium bg-white/60 py-1 rounded-lg">
                Verified WhatsApp Broadcast
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recipient Delivery Log Table */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-[#14201C]">Broadcast Recipients & Delivery Logs</h3>
            <p className="text-xs text-[#5F7069] font-medium">Real-time status updates per recipient from WhatsApp Cloud API.</p>
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
                      ? 'bg-[#05A222] text-white shadow-xs'
                      : 'bg-white text-[#14201C] border border-[#E2EAE6] hover:bg-[#F6FAF8]'
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
