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
            className="text-sm font-semibold px-4 py-2.5 rounded-xl border-[#C4EBD0] text-[#006736] hover:bg-[#F6FAF8]"
          >
            New Template
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(ROUTES.CREATE_CAMPAIGN)}
            leftIcon={<Zap className="w-4 h-4" />}
            className="text-sm font-bold px-4.5 py-2.5 rounded-xl shadow-sm"
          >
            Launch Broadcast
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5 mb-6">
        <StatsCard
          title="Total Messages (30d)"
          value="128,490"
          change="+24.2%"
          isPositive={true}
          description="vs prior month"
          icon={<Send className="w-4 h-4 text-[#05A222]" />}
          badge="Meta Tier 3"
        />
        <StatsCard
          title="Delivery Success Rate"
          value="98.9%"
          change="+0.4%"
          isPositive={true}
          description="Avg latency 0.8s"
          icon={<Smartphone className="w-4 h-4 text-[#039B56]" />}
        />
        <StatsCard
          title="Total Reachable Leads"
          value="45,210"
          change="+1,420"
          isPositive={true}
          description="Opted-in contacts"
          icon={<Users className="w-4 h-4 text-[#07CF74]" />}
        />
        <StatsCard
          title="Active Live Chats"
          value="34"
          change="-8m"
          isPositive={true}
          description="Avg reply time 1.4m"
          icon={<MessageSquare className="w-4 h-4 text-[#006736]" />}
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
