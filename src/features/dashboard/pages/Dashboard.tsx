import React from 'react';
import { Send, Users, Smartphone, MessageSquare, Plus, Zap } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { StatsCard } from '../components/StatsCard';
import { MessageChart } from '../components/MessageChart';
import { RecentActivity } from '../components/RecentActivity';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      {/* Top Banner / Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            WhatsApp Business Overview
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Monitor real-time delivery throughput, campaign ROI, and customer conversations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.CREATE_TEMPLATE)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            New Template
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(ROUTES.CREATE_CAMPAIGN)}
            leftIcon={<Zap className="w-3.5 h-3.5" />}
          >
            Launch Broadcast
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Messages (30d)"
          value="128,490"
          change="+24.2%"
          isPositive={true}
          description="vs prior month"
          icon={<Send className="w-4 h-4 text-emerald-500" />}
          badge="Meta Tier 3"
        />
        <StatsCard
          title="Delivery Success Rate"
          value="98.9%"
          change="+0.4%"
          isPositive={true}
          description="Average latency 0.8s"
          icon={<Smartphone className="w-4 h-4 text-teal-500" />}
        />
        <StatsCard
          title="Total Reachable Leads"
          value="45,210"
          change="+1,420"
          isPositive={true}
          description="Opted-in WhatsApp contacts"
          icon={<Users className="w-4 h-4 text-indigo-500" />}
        />
        <StatsCard
          title="Active Live Chats"
          value="34"
          change="-8m"
          isPositive={true}
          description="Avg reply time 1.4 mins"
          icon={<MessageSquare className="w-4 h-4 text-amber-500" />}
        />
      </div>

      {/* Main Charts & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MessageChart />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </PageContainer>
  );
};
