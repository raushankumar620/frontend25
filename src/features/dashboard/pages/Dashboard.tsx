import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Send,
  CheckCircle,
  Eye,
  XCircle,
  Calendar,
  Megaphone,
} from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { MetricCard } from '../components/StatsCard';
import { MessageChart } from '../components/MessageChart';
import { QuickActions } from '../components/QuickActions';
import { RecentActivity } from '../components/RecentActivity';
import { TemplatePerformance } from '../components/TemplatePerformance';
import { useAuthStore } from '../../../store/authStore';
import { analyticsService } from '../../../services/analyticsService';
import type { OverviewKPIs, MessageTimeseriesPoint } from '../../analytics/types';

export const Dashboard: React.FC = () => {
  const { user, refreshProfile } = useAuthStore();
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

    // Auto-refresh real-time metrics every 15 seconds
    const interval = setInterval(() => {
      loadDashboardData(false);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Primary real-time dynamic values directly from backend
  const totalContacts = overview?.activeContacts ?? 0;
  const totalMessages = overview?.messages?.total ?? 0;
  const sentCount = overview?.messages?.sent ?? 0;
  const deliveredCount = overview?.messages?.delivered ?? 0;
  const readCount = overview?.messages?.read ?? 0;
  const failedCount = overview?.messages?.failed ?? 0;
  const campaignsCount = overview?.activeCampaigns ?? 0;

  // Calculate today's messages from timeseries
  const todayCount = useMemo(() => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const todayPoint = timeseries.find((t) => t.date && t.date.startsWith(todayStr));
    if (todayPoint) {
      return (todayPoint.sent || 0) + (todayPoint.inbound || 0);
    }
    return 0;
  }, [timeseries]);

  // Real delivery & read rates
  const deliveryRateStr = totalMessages > 0 ? `${((deliveredCount / totalMessages) * 100).toFixed(1)}%` : '0%';
  const readRateStr = totalMessages > 0 ? `${((readCount / totalMessages) * 100).toFixed(1)}%` : '0%';
  const failedRateStr = totalMessages > 0 ? `${((failedCount / totalMessages) * 100).toFixed(1)}%` : '0%';

  // Real-time sparklines from timeseries
  const sentSparkline = useMemo(() => {
    if (timeseries.length >= 2) return timeseries.map((t) => t.sent || 0);
    return [0, 0, 0, 0, 0, 0, 0];
  }, [timeseries]);

  const deliveredSparkline = useMemo(() => {
    if (timeseries.length >= 2) return timeseries.map((t) => t.delivered || 0);
    return [0, 0, 0, 0, 0, 0, 0];
  }, [timeseries]);

  const readSparkline = useMemo(() => {
    if (timeseries.length >= 2) return timeseries.map((t) => t.read || 0);
    return [0, 0, 0, 0, 0, 0, 0];
  }, [timeseries]);

  const failedSparkline = useMemo(() => {
    if (timeseries.length >= 2) return timeseries.map((t) => t.failed || 0);
    return [0, 0, 0, 0, 0, 0, 0];
  }, [timeseries]);

  const totalSparkline = useMemo(() => {
    if (timeseries.length >= 2) return timeseries.map((t) => (t.sent || 0) + (t.inbound || 0));
    return [0, 0, 0, 0, 0, 0, 0];
  }, [timeseries]);

  // Greeting logic
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? 'Good Morning'
      : currentHour < 17
        ? 'Good Afternoon'
        : 'Good Evening';

  const userName = user?.firstName || user?.name || (user?.email ? user.email.split('@')[0] : 'User');

  return (
    <PageContainer>
      <div className="space-y-6 pb-6">
        {/* Top Section: Personalized Greeting & Mascot Side Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#14201C] tracking-tight flex items-center gap-2">
              <span>{greeting}, {userName}!</span>
              <span>👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#5F7069] mt-1 font-medium">
              Here's what's happening with your WhatsApp business today.
            </p>
          </div>

          <div className="shrink-0 hidden sm:block">
            <img
              src="/dashbord_side_banner.png"
              alt="Move Faster. Grow Bigger. Automate. Engage. Convert."
              className="h-14 md:h-16 w-auto object-contain drop-shadow-xs"
            />
          </div>
        </div>

        {/* 8 Primary KPI Metric Cards (4x2 Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Contacts"
            value={loading && !overview ? '...' : totalContacts.toLocaleString()}
            icon={<Users className="w-4 h-4" />}
            change={totalContacts > 0 ? `Active` : '0'}
            subText="Active contacts"
            theme="green"
            sparklineData={totalSparkline}
          />

          <MetricCard
            title="Total Messages"
            value={loading && !overview ? '...' : totalMessages.toLocaleString()}
            icon={<Send className="w-4 h-4" />}
            change={totalMessages > 0 ? `100%` : '0'}
            subText="Lifetime throughput"
            theme="blue"
            sparklineData={totalSparkline}
          />

          <MetricCard
            title="Sent"
            value={loading && !overview ? '...' : sentCount.toLocaleString()}
            icon={<Send className="w-4 h-4" />}
            change={totalMessages > 0 ? `${((sentCount / totalMessages) * 100).toFixed(0)}%` : '0%'}
            subText="Via Meta Cloud API"
            theme="purple"
            sparklineData={sentSparkline}
          />

          <MetricCard
            title="Delivered"
            value={loading && !overview ? '...' : deliveredCount.toLocaleString()}
            icon={<CheckCircle className="w-4 h-4" />}
            change={deliveryRateStr}
            subText="Delivery success rate"
            theme="emerald"
            sparklineData={deliveredSparkline}
          />

          <MetricCard
            title="Read"
            value={loading && !overview ? '...' : readCount.toLocaleString()}
            icon={<Eye className="w-4 h-4" />}
            change={readRateStr}
            subText={totalMessages > 0 ? `${readRateStr} read rate` : 'Read conversion rate'}
            theme="orange"
            sparklineData={readSparkline}
          />

          <MetricCard
            title="Failed"
            value={loading && !overview ? '...' : failedCount.toLocaleString()}
            icon={<XCircle className="w-4 h-4" />}
            change={failedRateStr}
            changeType={failedCount > 0 ? 'negative' : 'neutral'}
            subText="Delivery failure rate"
            theme="rose"
            sparklineData={failedSparkline}
          />

          <MetricCard
            title="Today"
            value={loading && !overview ? '...' : todayCount.toLocaleString()}
            icon={<Calendar className="w-4 h-4" />}
            change={todayCount > 0 ? 'Live' : '0'}
            subText="Messages sent today"
            theme="sky"
            sparklineData={totalSparkline}
          />

          <MetricCard
            title="Active Campaigns"
            value={loading && !overview ? '...' : campaignsCount.toLocaleString()}
            icon={<Megaphone className="w-4 h-4" />}
            change={campaignsCount > 0 ? `${campaignsCount} Active` : '0 Active'}
            subText="Running campaigns"
            theme="violet"
            sparklineData={[0, 0, 0, 0, campaignsCount]}
          />
        </div>

        {/* Middle Section: Message Analytics Chart (approx 62%) + Quick Actions (approx 38%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
            <MessageChart timeseries={timeseries} overview={overview} loading={loading} />
          </div>
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
            <QuickActions />
          </div>
        </div>

        {/* Bottom Section: Recent Activity (Left) + Template Performance (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-5 flex flex-col">
            <RecentActivity />
          </div>
          <div className="lg:col-span-7 flex flex-col">
            <TemplatePerformance />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
