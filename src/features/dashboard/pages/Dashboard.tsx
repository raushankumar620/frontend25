import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  MessageSquare,
  Send,
  CheckCircle,
  Eye,
  XCircle,
  Calendar,
  Megaphone,
  TrendingUp,
  Plus,
  Zap,
} from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { MetricCard, RateCard } from '../components/StatsCard';
import { MessageChart } from '../components/MessageChart';
import { RecentActivity } from '../components/RecentActivity';
import { ApiConnectionStatus } from '../components/ApiConnectionStatus';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { useAuthStore } from '../../../store/authStore';
import { analyticsService } from '../../../services/analyticsService';
import type { OverviewKPIs, MessageTimeseriesPoint } from '../../analytics/types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { refreshProfile } = useAuthStore();
  const [overview, setOverview] = useState<OverviewKPIs | null>(null);
  const [timeseries, setTimeseries] = useState<MessageTimeseriesPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const [ovData, msgData] = await Promise.all([
        analyticsService.getOverview().catch(() => null),
        analyticsService.getMessageAnalytics().catch(() => ({ stats: null, timeseries: [] })),
      ]);
      if (ovData) setOverview(ovData);
      if (msgData?.timeseries) setTimeseries(msgData.timeseries);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
    loadDashboardData(true);

    // Auto-refresh real-time metrics every 10 seconds
    const interval = setInterval(() => {
      loadDashboardData(false);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Primary Metrics
  const totalContacts = overview?.activeContacts ?? 0;
  const totalMessages = overview?.messages?.total ?? 0;
  const sentCount = overview?.messages?.sent ?? 0;
  const deliveredCount = overview?.messages?.delivered ?? 0;
  const readCount = overview?.messages?.read ?? 0;
  const failedCount = overview?.messages?.failed ?? 0;
  const campaignsCount = overview?.activeCampaigns ?? 0;

  // Calculate today's messages from timeseries or overview
  const todayCount = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayPoint = timeseries.find((t) => t.date && t.date.startsWith(todayStr));
    if (todayPoint) {
      return (todayPoint.sent || 0) + (todayPoint.inbound || 0);
    }
    return 0;
  }, [timeseries]);

  // Rate calculations
  const deliveryPct = totalMessages > 0 ? (deliveredCount / totalMessages) * 100 : 0;
  const deliveryRateStr = overview?.messages?.deliveryRate || `${deliveryPct.toFixed(1)}%`;

  const readPct = totalMessages > 0 ? (readCount / totalMessages) * 100 : 0;
  const readRateStr = overview?.messages?.readRate || `${readPct.toFixed(1)}%`;

  const resolutionRateStr = overview?.conversations?.resolutionRate || '100%';
  const resolutionPct = parseFloat(resolutionRateStr) || 100;
  const resolvedCount = overview?.conversations?.resolved ?? 0;

  return (
    <PageContainer>
      {/* Top Banner / Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#14201C] tracking-tight">
            WhatsApp Business Overview
          </h2>
          <p className="text-sm sm:text-base text-[#5F7069] mt-1 font-medium">
            Real-time delivery lifecycle, customer reach, and campaign analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate(ROUTES.CREATE_TEMPLATE)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="text-sm font-semibold px-4 py-2.5 rounded-xl border-[#C4EBD0] text-[#006736] hover:bg-[#F6FAF8] cursor-pointer"
          >
            New Template
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(ROUTES.CREATE_CAMPAIGN)}
            leftIcon={<Zap className="w-4 h-4" />}
            className="text-sm font-bold px-4.5 py-2.5 rounded-xl shadow-sm cursor-pointer"
          >
            Launch Broadcast
          </Button>
        </div>
      </div>

      {/* 8 Primary KPI Metrics (Top 2 Rows) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {/* Row 1 */}
        <MetricCard
          title="Total Contacts"
          value={loading ? '...' : totalContacts.toLocaleString()}
          icon={<Users className="w-4 h-4" />}
          accentColor="#2563EB"
          theme="blue"
          subText="Opted-in audience"
          badge="CRM"
        />

        <MetricCard
          title="Total Messages"
          value={loading ? '...' : totalMessages.toLocaleString()}
          icon={<MessageSquare className="w-4 h-4" />}
          accentColor="#F97316"
          theme="orange"
          subText="Lifetime throughput"
          badge="Processed"
        />

        <MetricCard
          title="Sent"
          value={loading ? '...' : sentCount.toLocaleString()}
          icon={<Send className="w-4 h-4" />}
          accentColor="#0EA5E9"
          theme="sky"
          subText="Meta Cloud API"
          badge="Outbound"
        />

        <MetricCard
          title="Delivered"
          value={loading ? '...' : deliveredCount.toLocaleString()}
          icon={<CheckCircle className="w-4 h-4" />}
          accentColor="#10B981"
          theme="emerald"
          subText="Handset verified"
          badge="Double Tick"
        />

        {/* Row 2 */}
        <MetricCard
          title="Read"
          value={loading ? '...' : readCount.toLocaleString()}
          icon={<Eye className="w-4 h-4" />}
          accentColor="#8B5CF6"
          theme="purple"
          subText="Customer opened"
          badge="Blue Ticks"
        />

        <MetricCard
          title="Failed"
          value={loading ? '...' : failedCount.toLocaleString()}
          icon={<XCircle className="w-4 h-4" />}
          accentColor="#EF4444"
          theme="rose"
          subText="Delivery bounces"
          badge="Errors"
        />

        <MetricCard
          title="Today"
          value={loading ? '...' : todayCount.toLocaleString()}
          icon={<Calendar className="w-4 h-4" />}
          accentColor="#F59E0B"
          theme="amber"
          subText="Live 24h traffic"
          badge="Real-time"
        />

        <MetricCard
          title="Total Campaigns"
          value={loading ? '...' : campaignsCount.toLocaleString()}
          icon={<Megaphone className="w-4 h-4" />}
          accentColor="#EC4899"
          theme="pink"
          subText="Broadcast workflows"
          badge="Active"
        />
      </div>

      {/* 3 Rate & Performance Cards (Row 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <RateCard
          title="Delivery Success Rate"
          rate={loading ? '...' : deliveryRateStr}
          percentage={deliveryPct}
          icon={<Send className="w-4.5 h-4.5" />}
          accentColor="#10B981"
          gradientFrom="from-emerald-500 to-teal-400"
          details={`${deliveredCount.toLocaleString()} delivered of ${totalMessages.toLocaleString()} messages`}
          subMetric="Meta Webhook SLA"
          badge="Reliability"
        />

        <RateCard
          title="Message Read Rate"
          rate={loading ? '...' : readRateStr}
          percentage={readPct}
          icon={<Eye className="w-4.5 h-4.5" />}
          accentColor="#8B5CF6"
          gradientFrom="from-purple-500 to-indigo-400"
          details={`${readCount.toLocaleString()} read of ${totalMessages.toLocaleString()} messages`}
          subMetric="Customer Engagement"
          badge="Open Rate"
        />

        <RateCard
          title="Resolution SLA"
          rate={loading ? '...' : resolutionRateStr}
          percentage={resolutionPct}
          icon={<TrendingUp className="w-4.5 h-4.5" />}
          accentColor="#F59E0B"
          gradientFrom="from-amber-500 to-orange-400"
          details={`${resolvedCount.toLocaleString()} customer conversations resolved`}
          subMetric="Support Efficiency"
          badge="SLA Target"
        />
      </div>

      {/* Full-Width Message Analytics Graph Section */}
      <div className="w-full mb-8">
        <MessageChart timeseries={timeseries} overview={overview} loading={loading} />
      </div>

      {/* 2-Column Row: API Status & Connection (Left) + Live Activity Feed (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ApiConnectionStatus />
        <RecentActivity />
      </div>
    </PageContainer>
  );
};
