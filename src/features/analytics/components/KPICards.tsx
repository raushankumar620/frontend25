import React from 'react';
import { CheckCheck, Clock, Bot, Users } from 'lucide-react';
import type { OverviewKPIs } from '../types';

interface KPICardsProps {
  data: OverviewKPIs | null;
  loading: boolean;
}

export const KPICards: React.FC<KPICardsProps> = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-white border border-[#E2EAE6] rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  const { messages, conversations, ai, activeContacts } = data;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Delivery Success */}
      <div className="bg-white border border-[#E2EAE6] rounded-2xl p-4.5 shadow-xs flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-[#64748B]">Delivery Rate</div>
          <div className="text-2xl font-black text-[#006736] mt-1 tracking-tight">{messages.deliveryRate}</div>
          <div className="text-[11px] text-[#64748B] mt-0.5">
            Read: <strong className="text-[#05A222] font-semibold">{messages.readRate}</strong> • {messages.sent.toLocaleString()} sent
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#05A222] shrink-0">
          <CheckCheck className="w-5 h-5" />
        </div>
      </div>

      {/* 2. SLA & Resolution */}
      <div className="bg-white border border-[#E2EAE6] rounded-2xl p-4.5 shadow-xs flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-[#64748B]">Resolution SLA</div>
          <div className="text-2xl font-black text-[#0F172A] mt-1 tracking-tight">{conversations.resolutionRate}</div>
          <div className="text-[11px] text-[#64748B] mt-0.5">
            ~{conversations.avgResolutionHours}h avg • <strong className="text-[#0F172A]">{conversations.resolved}</strong> resolved
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      {/* 3. AI Containment */}
      <div className="bg-white border border-[#E2EAE6] rounded-2xl p-4.5 shadow-xs flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-[#64748B]">AI Containment</div>
          <div className="text-2xl font-black text-[#0F172A] mt-1 tracking-tight">{ai.containmentRate}</div>
          <div className="text-[11px] text-[#64748B] mt-0.5">
            {ai.totalSessions} sessions • <strong className="text-[#05A222]">{ai.handedOffSessions}</strong> handoffs
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-purple-600 shrink-0">
          <Bot className="w-5 h-5" />
        </div>
      </div>

      {/* 4. Active Audience */}
      <div className="bg-white border border-[#E2EAE6] rounded-2xl p-4.5 shadow-xs flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-[#64748B]">Active Contacts</div>
          <div className="text-2xl font-black text-[#0F172A] mt-1 tracking-tight">{activeContacts.toLocaleString()}</div>
          <div className="text-[11px] text-[#64748B] mt-0.5">
            {data.activeCampaigns} active campaigns • {messages.inbound} inbound
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-indigo-600 shrink-0">
          <Users className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
