import React, { useState, useEffect } from 'react';
import { Send, Users, Smartphone, MessageSquare, Plus, Zap, Activity, CheckCircle2, ArrowRight } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { StatsCard } from '../components/StatsCard';
import { MessageChart } from '../components/MessageChart';
import { RecentActivity } from '../components/RecentActivity';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { useAuthStore } from '../../../store/authStore';
import { systemService, type HealthCheckData } from '../../../services/systemService';
import { analyticsService } from '../../../services/analyticsService';
import type { OverviewKPIs, MessageTimeseriesPoint } from '../../analytics/types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, organization, refreshProfile } = useAuthStore();
  const [health, setHealth] = useState<HealthCheckData | null>(null);
  const [overview, setOverview] = useState<OverviewKPIs | null>(null);
  const [timeseries, setTimeseries] = useState<MessageTimeseriesPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshProfile();
    systemService.getHealth().then(setHealth).catch(() => {});

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [ovData, msgData] = await Promise.all([
          analyticsService.getOverview().catch(() => null),
          analyticsService.getMessageAnalytics().catch(() => ({ stats: null, timeseries: [] })),
        ]);
        if (ovData) setOverview(ovData);
        if (msgData?.timeseries) setTimeseries(msgData.timeseries);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const totalMsgFormatted = overview?.messages?.total ? overview.messages.total.toLocaleString() : '0';
  const deliveryRateFormatted = overview?.messages?.deliveryRate !== undefined ? `${overview.messages.deliveryRate}%` : '0%';
  const contactsFormatted = overview?.activeContacts !== undefined 
    ? overview.activeContacts.toLocaleString() 
    : '0';
  const activeChatsFormatted = overview?.conversations?.open !== undefined ? overview.conversations.open.toLocaleString() : '0';

  return (
    <PageContainer>
      {/* Real-time System Connectivity Banner */}
      <div className="mb-6 p-4.5 rounded-2xl bg-gradient-to-r from-[#E9F9EE] via-[#F6FAF8] to-white border border-[#C4EBD0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#C4EBD0] text-[#05A222] flex items-center justify-center shadow-xs">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#14201C] text-sm sm:text-base">
                {organization?.name || user?.organizationName || 'WhatsApp Workspace'}
              </span>
              <Badge variant="success" size="sm">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {health?.status === 'UP' ? 'LIVE & READY' : 'ONLINE'}
              </Badge>
            </div>
            <p className="text-xs text-[#5F7069] mt-0.5">
              Tenant ID: <span className="font-mono font-semibold text-[#14201C]">{String(organization?.id || organization?._id || user?.organizationId || 'org_active').substring(0, 12)}...</span> • Meta API v20.0
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.WHATSAPP_NUMBERS)}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="text-xs font-bold border-[#C4EBD0] text-[#006736] hover:bg-white rounded-xl"
          >
            Connect WhatsApp Number
          </Button>
        </div>
      </div>

      {/* Top Banner / Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-3xl font-black text-[#14201C] tracking-tight">
            WhatsApp Business Overview
          </h2>
          <p className="text-sm sm:text-base text-[#5F7069] mt-1.5 font-medium">
            Monitor real-time delivery throughput, campaign ROI, and customer conversations.
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

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5 mb-6">
        <StatsCard
          title="Total Messages (30d)"
          value={loading ? '...' : totalMsgFormatted}
          change={overview?.messages?.total ? 'Live' : '0'}
          isPositive={true}
          description="Total processed messages"
          icon={<Send className="w-4 h-4 text-[#05A222]" />}
          badge="Meta Cloud API"
        />
        <StatsCard
          title="Delivery Success Rate"
          value={loading ? '...' : deliveryRateFormatted}
          change={overview?.messages?.deliveryRate ? `${overview.messages.deliveryRate}%` : '0%'}
          isPositive={true}
          description="Meta webhook confirmation"
          icon={<Smartphone className="w-4 h-4 text-[#039B56]" />}
        />
        <StatsCard
          title="Total Reachable Leads"
          value={loading ? '...' : contactsFormatted}
          change="Opted-in"
          isPositive={true}
          description="Subscribed CRM contacts"
          icon={<Users className="w-4 h-4 text-[#07CF74]" />}
        />
        <StatsCard
          title="Active Live Chats"
          value={loading ? '...' : activeChatsFormatted}
          change="Open"
          isPositive={true}
          description="Ongoing conversations"
          icon={<MessageSquare className="w-4 h-4 text-[#006736]" />}
        />
      </div>

      {/* Main Charts & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MessageChart timeseries={timeseries} overview={overview} loading={loading} />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </PageContainer>
  );
};
