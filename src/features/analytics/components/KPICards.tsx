import React from 'react';
import { CheckCheck, Clock, Bot, Users, Sparkles, TrendingUp } from 'lucide-react';
import type { OverviewKPIs } from '../types';

interface KPICardsProps {
  data: OverviewKPIs | null;
  loading: boolean;
}

export const KPICards: React.FC<KPICardsProps> = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-[#F6FAF8] border border-[#E2EAE6] rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  const { messages, conversations, ai, activeContacts } = data;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. Delivery Success */}
      <div className="bg-white border border-[#E2EAE6] rounded-2xl p-5 shadow-[0_4px_20px_rgba(1,59,35,0.03)] hover:border-[#05A222]/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#5F7069] uppercase tracking-wider">Delivery Rate</span>
          <div className="w-8 h-8 rounded-xl bg-[#E9F9EE] text-[#05A222] flex items-center justify-center">
            <CheckCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black text-[#14201C]">{messages.deliveryRate}</span>
          <span className="text-xs font-bold text-[#05A222] flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> Read {messages.readRate}
          </span>
        </div>
        <div className="mt-2 text-xs text-[#5F7069] flex justify-between font-medium">
          <span>Sent: <strong className="text-[#14201C]">{messages.sent.toLocaleString()}</strong></span>
          <span>Read: <strong className="text-[#05A222]">{messages.read.toLocaleString()}</strong></span>
        </div>
      </div>

      {/* 2. SLA & Resolution */}
      <div className="bg-white border border-[#E2EAE6] rounded-2xl p-5 shadow-[0_4px_20px_rgba(1,59,35,0.03)] hover:border-[#006736]/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#5F7069] uppercase tracking-wider">Resolution SLA</span>
          <div className="w-8 h-8 rounded-xl bg-[#E2EAE6] text-[#006736] flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black text-[#14201C]">{conversations.resolutionRate}</span>
          <span className="text-xs font-semibold text-[#5F7069]">~{conversations.avgResolutionHours}h avg</span>
        </div>
        <div className="mt-2 text-xs text-[#5F7069] flex justify-between font-medium">
          <span>Resolved: <strong className="text-[#14201C]">{conversations.resolved}</strong></span>
          <span>Open: <strong className="text-[#E53E3E]">{conversations.open}</strong></span>
        </div>
      </div>

      {/* 3. AI Deflection */}
      <div className="bg-white border border-[#E2EAE6] rounded-2xl p-5 shadow-[0_4px_20px_rgba(1,59,35,0.03)] hover:border-[#05A222]/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#5F7069] uppercase tracking-wider">AI Containment</span>
          <div className="w-8 h-8 rounded-xl bg-[#E9F9EE] text-[#05A222] flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black text-[#14201C]">{ai.containmentRate}</span>
          <span className="text-xs font-bold text-[#05A222] flex items-center gap-0.5">
            <Sparkles className="w-3 h-3" /> Auto Deflected
          </span>
        </div>
        <div className="mt-2 text-xs text-[#5F7069] flex justify-between font-medium">
          <span>Total AI: <strong className="text-[#14201C]">{ai.totalSessions}</strong></span>
          <span>Handoffs: <strong className="text-[#D97706]">{ai.handedOffSessions}</strong></span>
        </div>
      </div>

      {/* 4. Active Audience */}
      <div className="bg-white border border-[#E2EAE6] rounded-2xl p-5 shadow-[0_4px_20px_rgba(1,59,35,0.03)] hover:border-[#07CF74]/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#5F7069] uppercase tracking-wider">Active Contacts</span>
          <div className="w-8 h-8 rounded-xl bg-[#E9F9EE] text-[#07CF74] flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black text-[#14201C]">{activeContacts.toLocaleString()}</span>
          <span className="text-xs font-semibold text-[#05A222]">Opted-in</span>
        </div>
        <div className="mt-2 text-xs text-[#5F7069] flex justify-between font-medium">
          <span>Active Campaigns: <strong className="text-[#14201C]">{data.activeCampaigns}</strong></span>
          <span>Inbound: <strong className="text-[#006736]">{messages.inbound}</strong></span>
        </div>
      </div>
    </div>
  );
};
