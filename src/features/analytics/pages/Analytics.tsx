import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { KPICards } from '../components/KPICards';
import { MessageFunnelChart } from '../components/MessageFunnelChart';
import { MessageAnalytics } from '../components/MessageAnalytics';
import { AgentLeaderboard } from '../components/AgentLeaderboard';
import { CampaignROI } from '../components/CampaignROI';
import { CampaignAnalytics } from '../components/CampaignAnalytics';
import { AiContainmentBreakdown } from '../components/AiContainmentBreakdown';
import { CustomerAnalytics } from '../components/CustomerAnalytics';
import { CSVExportModal } from '../components/CSVExportModal';
import { Button } from '../../../components/ui/Button';
import { analyticsService } from '../../../services/analyticsService';
import {
  Download,
  RefreshCw,
  LayoutDashboard,
  MessageSquare,
  Award,
  Send,
  Bot,
  Users,
} from 'lucide-react';
import type {
  OverviewKPIs,
  MessageStats,
  MessageTimeseriesPoint,
  AgentPerformance,
  CampaignMetricsResponse,
  AiStats,
} from '../types';

export const Analytics: React.FC = () => {
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'messages' | 'agents' | 'campaigns' | 'ai' | 'audience'>('overview');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Analytics state
  const [overview, setOverview] = useState<OverviewKPIs | null>(null);
  const [messageStats, setMessageStats] = useState<MessageStats | null>(null);
  const [timeseries, setTimeseries] = useState<MessageTimeseriesPoint[]>([]);
  const [agents, setAgents] = useState<AgentPerformance[]>([]);
  const [campaignMetrics, setCampaignMetrics] = useState<CampaignMetricsResponse | null>(null);
  const [aiStats, setAiStats] = useState<AiStats | null>(null);

  const calculateDateRange = (r: '7d' | '30d' | '90d') => {
    const days = r === '7d' ? 7 : r === '30d' ? 30 : 90;
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const { startDate, endDate } = calculateDateRange(range);

      const [ovData, msgData, agentData, campData, aiData] = await Promise.all([
        analyticsService.getOverview(startDate, endDate),
        analyticsService.getMessageAnalytics(startDate, endDate),
        analyticsService.getAgentPerformance(startDate, endDate),
        analyticsService.getCampaignAnalytics(startDate, endDate),
        analyticsService.getAiAnalytics(startDate, endDate),
      ]);

      setOverview(ovData);
      setMessageStats(msgData.stats);
      setTimeseries(msgData.timeseries);
      setAgents(agentData);
      setCampaignMetrics(campData);
      setAiStats(aiData);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [range]);

  return (
    <PageContainer>
      {/* Top Action Controls & Date Range Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#E2EAE6]">
        {/* Category Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'overview', label: 'Overview & Funnel', icon: LayoutDashboard },
            { id: 'messages', label: 'Messages', icon: MessageSquare },
            { id: 'campaigns', label: 'Campaign ROI', icon: Send },
            { id: 'agents', label: 'Agent SLAs', icon: Award },
            { id: 'ai', label: 'AI Deflection', icon: Bot },
            { id: 'audience', label: 'Audience', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#006736] text-white shadow-2xs'
                    : 'bg-white text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] border border-[#E2EAE6]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Actions: Range Switcher, Refresh & Export */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {/* Range Switcher */}
          <div className="flex items-center gap-1 bg-slate-100/80 p-0.5 rounded-xl border border-slate-200">
            {[
              { key: '7d', label: '7 Days' },
              { key: '30d', label: '30 Days' },
              { key: '90d', label: '90 Days' },
            ].map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  range === r.key
                    ? 'bg-white text-[#006736] shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={loadData}
            disabled={loading}
            className="p-1.5 rounded-xl border border-[#E2EAE6] bg-white text-[#64748B] hover:text-[#006736] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#05A222]' : ''}`} />
          </button>

          {/* Export CSV Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExportModalOpen(true)}
            leftIcon={<Download className="w-3.5 h-3.5" />}
            className="text-xs font-bold border-[#C4EBD0] text-[#006736] hover:bg-[#E9F9EE] rounded-xl px-3 py-1.5 cursor-pointer"
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="mb-6">
        <KPICards data={overview} loading={loading} />
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MessageFunnelChart stats={messageStats} timeseries={timeseries} loading={loading} />
          <AiContainmentBreakdown data={aiStats} loading={loading} />
          <div className="lg:col-span-2">
            <CustomerAnalytics
              activeContacts={overview?.activeContacts || 0}
              conversations={overview?.conversations || null}
              messages={messageStats}
              loading={loading}
            />
          </div>
          <div className="lg:col-span-2">
            <AgentLeaderboard agents={agents} loading={loading} />
          </div>
          <div className="lg:col-span-2">
            <CampaignROI data={campaignMetrics} loading={loading} />
          </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 gap-6">
          <MessageAnalytics stats={messageStats} loading={loading} />
          <MessageFunnelChart stats={messageStats} timeseries={timeseries} loading={loading} />
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 gap-6">
          <CampaignAnalytics data={campaignMetrics} loading={loading} />
          <CampaignROI data={campaignMetrics} loading={loading} />
        </div>
      )}

      {activeTab === 'agents' && (
        <div className="grid grid-cols-1 gap-6">
          <AgentLeaderboard agents={agents} loading={loading} />
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="grid grid-cols-1 gap-6">
          <AiContainmentBreakdown data={aiStats} loading={loading} />
        </div>
      )}

      {activeTab === 'audience' && (
        <div className="grid grid-cols-1 gap-6">
          <CustomerAnalytics
            activeContacts={overview?.activeContacts || 0}
            conversations={overview?.conversations || null}
            messages={messageStats}
            loading={loading}
          />
        </div>
      )}

      {/* CSV Export Modal */}
      <CSVExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        dateRange={range}
      />
    </PageContainer>
  );
};
