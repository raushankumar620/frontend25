import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  MessageSquare,
  Users,
  TrendingUp,
  AlertCircle,
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const filtered = useMemo(() => {
    return campaigns.filter((c) => {
      const matchesQuery =
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.templateName.toLowerCase().includes(query.toLowerCase());
      const matchesStatus =
        selectedStatus === 'ALL' || c.status.toUpperCase() === selectedStatus.toUpperCase();
      return matchesQuery && matchesStatus;
    });
  }, [campaigns, query, selectedStatus]);

  // Compute 5 Key Metrics for Stats Row
  const stats = useMemo(() => {
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(
      (c) => c.status.toUpperCase() === 'RUNNING' || c.status.toUpperCase() === 'SCHEDULED'
    ).length;

    const totalRecipients = campaigns.reduce((acc, c) => acc + (c.totalRecipients || 0), 0);
    const totalSent = campaigns.reduce((acc, c) => acc + (c.sentCount || 0), 0);
    const totalDelivered = campaigns.reduce((acc, c) => acc + (c.deliveredCount || 0), 0);
    const totalRead = campaigns.reduce((acc, c) => acc + (c.readCount || 0), 0);
    const totalFailed = campaigns.reduce((acc, c) => acc + (c.failedCount || 0), 0);

    const deliveryRate = totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 0;
    const readRate = totalDelivered > 0 ? Math.round((totalRead / totalDelivered) * 100) : 0;
    const failedRate = totalSent > 0 ? Math.round((totalFailed / totalSent) * 100) : 0;

    return {
      totalCampaigns,
      activeCampaigns,
      totalRecipients,
      totalSent,
      deliveryRate,
      totalDelivered,
      readRate,
      totalRead,
      totalFailed,
      failedRate,
    };
  }, [campaigns]);

  // Paginated Data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return (
          <Badge variant="success" size="sm">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#039B56]" />
            Completed
          </Badge>
        );
      case 'RUNNING':
        return (
          <Badge variant="primary" size="sm">
            <Radio className="w-3.5 h-3.5 mr-1 animate-pulse text-[#05A222]" />
            Running
          </Badge>
        );
      case 'SCHEDULED':
        return (
          <Badge variant="warning" size="sm">
            <Clock className="w-3.5 h-3.5 mr-1 text-[#D99A00]" />
            Scheduled
          </Badge>
        );
      case 'PAUSED':
        return (
          <Badge variant="neutral" size="sm">
            <Pause className="w-3.5 h-3.5 mr-1 text-amber-600" />
            Paused
          </Badge>
        );
      case 'CANCELLED':
      case 'FAILED':
        return (
          <Badge variant="danger" size="sm">
            <XCircle className="w-3.5 h-3.5 mr-1 text-[#D64545]" />
            Failed
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
      header: 'Campaign Name',
      render: (c) => (
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#E9F9EE] text-[#006736] flex items-center justify-center shrink-0 mt-0.5 border border-[#C4EBD0]">
            <Send className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div
              className="font-bold text-[#0F172A] text-sm truncate hover:text-[#05A222] transition-colors cursor-pointer"
              onClick={() => navigate(`/campaigns/${c.id}`)}
            >
              {c.name}
            </div>
            <div className="text-xs text-[#64748B] truncate font-normal mt-0.5">
              Target: {c.targetAudience || 'All Subscribers'}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Template',
      render: (c) => (
        <span className="font-mono text-xs text-[#0F172A] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
          {c.templateName}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (c) => getStatusBadge(c.status),
    },
    {
      header: 'Recipients',
      render: (c) => (
        <span className="font-semibold text-xs text-[#0F172A]">
          {c.totalRecipients.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Sent / Failed',
      render: (c) => (
        <div className="text-xs">
          <span className="font-semibold text-[#0F172A]">{c.sentCount.toLocaleString()}</span>
          {c.failedCount !== undefined && c.failedCount > 0 && (
            <span className="text-rose-600 font-medium ml-1">({c.failedCount} failed)</span>
          )}
        </div>
      ),
    },
    {
      header: 'Delivered',
      render: (c) => {
        const rate = c.sentCount > 0 ? Math.round((c.deliveredCount / c.sentCount) * 100) : 0;
        return (
          <div className="text-xs">
            <span className="font-semibold text-[#0F172A]">{c.deliveredCount.toLocaleString()}</span>
            <span className="text-[#64748B] text-[11px] ml-1">({rate}%)</span>
          </div>
        );
      },
    },
    {
      header: 'Read',
      render: (c) => {
        const rate = c.deliveredCount > 0 ? Math.round((c.readCount / c.deliveredCount) * 100) : 0;
        return (
          <div className="text-xs">
            <span className="font-semibold text-[#0F172A]">{c.readCount.toLocaleString()}</span>
            <span className="text-[#64748B] text-[11px] ml-1">({rate}%)</span>
          </div>
        );
      },
    },
    {
      header: 'Delivery Rate',
      render: (c) => {
        const rate = c.sentCount > 0 ? Math.round((c.deliveredCount / c.sentCount) * 100) : 0;
        return (
          <div className="flex items-center gap-2">
            <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#05A222] rounded-full"
                style={{ width: `${rate}%` }}
              />
            </div>
            <span className="font-bold text-xs text-[#0F172A]">{rate}%</span>
          </div>
        );
      },
    },
    {
      header: 'Created Date',
      render: (c) => (
        <span className="text-xs text-[#64748B] whitespace-nowrap">
          {c.createdAt
            ? new Date(c.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : '—'}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (c) => (
        <div className="flex items-center justify-end gap-1.5">
          {c.status.toUpperCase() === 'DRAFT' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStart(c.id)}
              isLoading={actionLoadingId === c.id}
              leftIcon={<Play className="w-3.5 h-3.5 text-[#05A222]" />}
              className="text-xs font-semibold px-2 py-1 border-[#C4EBD0] text-[#006736] hover:bg-[#E9F9EE]"
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
              leftIcon={<Pause className="w-3.5 h-3.5 text-amber-600" />}
              className="text-xs font-semibold px-2 py-1"
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
              leftIcon={<Play className="w-3.5 h-3.5 text-[#05A222]" />}
              className="text-xs font-semibold px-2 py-1 border-[#C4EBD0] text-[#006736] hover:bg-[#E9F9EE]"
            >
              Resume
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(`/campaigns/${c.id}`)}
            leftIcon={<BarChart3 className="w-3.5 h-3.5 text-[#64748B]" />}
            className="text-xs font-semibold text-[#006736] hover:bg-[#F8FAFC] px-2 py-1"
          >
            Analytics
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      {/* 5-Card Spacious KPI Stat Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5 mb-6">
        {/* Card 1: Total Campaigns */}
        <div className="bg-white p-3 sm:p-4.5 rounded-2xl border border-[#E2EAE6] shadow-xs flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-semibold text-[#64748B] truncate">Total Campaigns</div>
            <div className="text-xl sm:text-2xl font-black text-[#0F172A] mt-0.5 sm:mt-1 tracking-tight">{stats.totalCampaigns}</div>
            <div className="text-[10px] sm:text-[11px] text-[#64748B] mt-0.5 truncate">{stats.activeCampaigns} Active</div>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Card 2: Total Recipients */}
        <div className="bg-white p-3 sm:p-4.5 rounded-2xl border border-[#E2EAE6] shadow-xs flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-semibold text-[#64748B] truncate">Total Recipients</div>
            <div className="text-xl sm:text-2xl font-black text-[#0F172A] mt-0.5 sm:mt-1 tracking-tight">{stats.totalRecipients.toLocaleString()}</div>
            <div className="text-[10px] sm:text-[11px] text-[#64748B] mt-0.5 truncate">{stats.totalSent.toLocaleString()} Sent</div>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Card 3: Delivery Rate */}
        <div className="bg-white p-3 sm:p-4.5 rounded-2xl border border-[#E2EAE6] shadow-xs flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-semibold text-[#64748B] truncate">Delivery Rate</div>
            <div className="text-xl sm:text-2xl font-black text-[#006736] mt-0.5 sm:mt-1 tracking-tight">{stats.deliveryRate}%</div>
            <div className="text-[10px] sm:text-[11px] text-[#64748B] mt-0.5 truncate">{stats.totalDelivered.toLocaleString()} Delivered</div>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#05A222] shrink-0">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Card 4: Read Rate */}
        <div className="bg-white p-3 sm:p-4.5 rounded-2xl border border-[#E2EAE6] shadow-xs flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-semibold text-[#64748B] truncate">Read Rate</div>
            <div className="text-xl sm:text-2xl font-black text-[#0F172A] mt-0.5 sm:mt-1 tracking-tight">{stats.readRate}%</div>
            <div className="text-[10px] sm:text-[11px] text-[#64748B] mt-0.5 truncate">{stats.totalRead.toLocaleString()} Read</div>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-indigo-600 shrink-0">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Card 5: Failed Messages */}
        <div className="col-span-2 sm:col-span-1 bg-white p-3 sm:p-4.5 rounded-2xl border border-[#E2EAE6] shadow-xs flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-semibold text-[#64748B] truncate">Failed Messages</div>
            <div className="text-xl sm:text-2xl font-black text-rose-600 mt-0.5 sm:mt-1 tracking-tight">{stats.totalFailed}</div>
            <div className="text-[10px] sm:text-[11px] text-rose-600/80 mt-0.5 truncate">{stats.failedRate}% Failed Rate</div>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>

      {/* Main SaaS Card wrapping Filter Toolbar & Table */}
      <div className="bg-white rounded-2xl border border-[#E2EAE6] shadow-xs p-3.5 sm:p-5 mb-6 space-y-4">
        {/* Card Header & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#E2EAE6]">
          <div>
            <h2 className="text-base font-bold text-[#0F172A] tracking-tight">All Campaigns</h2>
            <p className="text-xs text-[#64748B] mt-0.5">Manage, monitor, and optimize your WhatsApp broadcasts.</p>
          </div>

          {/* Search, Filter Pills & Create CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="w-full sm:w-64">
              <SearchBar value={query} onChange={setQuery} placeholder="Search campaigns..." />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { key: 'ALL', label: 'All' },
                { key: 'RUNNING', label: 'Running' },
                { key: 'SCHEDULED', label: 'Scheduled' },
                { key: 'COMPLETED', label: 'Completed' },
                { key: 'PAUSED', label: 'Paused' },
                { key: 'DRAFT', label: 'Draft' },
              ].map((st) => (
                <button
                  key={st.key}
                  onClick={() => {
                    setSelectedStatus(st.key);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    selectedStatus === st.key
                      ? 'bg-[#05A222] text-white shadow-2xs'
                      : 'bg-white text-[#64748B] border border-[#E2EAE6] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(ROUTES.CREATE_CAMPAIGN)}
              leftIcon={<Plus className="w-4 h-4" />}
              className="text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs bg-[#05A222] hover:bg-[#006736] text-white shrink-0 whitespace-nowrap cursor-pointer"
            >
              Create Campaign
            </Button>
          </div>
        </div>

        {/* Data Table with Built-in Pagination */}
        <Table
          columns={columns}
          data={paginatedData}
          isLoading={isLoading}
          pagination={{
            currentPage,
            totalPages,
            totalItems: filtered.length,
            pageSize,
            onPageChange: setCurrentPage,
            onPageSizeChange: (newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            },
          }}
        />
      </div>
    </PageContainer>
  );
};
