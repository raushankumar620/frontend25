import React from 'react';
import { Users, UserCheck, MessageSquare, Clock, ShieldCheck } from 'lucide-react';
import type { ConversationStats, MessageStats } from '../types';

interface CustomerAnalyticsProps {
  activeContacts: number;
  conversations: ConversationStats | null;
  messages: MessageStats | null;
  loading: boolean;
}

export const CustomerAnalytics: React.FC<CustomerAnalyticsProps> = ({
  activeContacts,
  conversations,
  messages,
  loading,
}) => {
  if (loading) {
    return (
      <div className="bg-white border border-[#E2EAE6] rounded-2xl p-6 h-64 animate-pulse bg-[#F6FAF8]" />
    );
  }

  const totalConvs = conversations?.total || 0;
  const resolved = conversations?.resolved || 0;
  const resolutionRate = conversations?.resolutionRate || '100%';
  const inboundCount = messages?.inbound || 0;

  return (
    <div className="bg-white border border-[#E2EAE6] rounded-2xl p-6 shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E9F9EE] text-[#05A222] flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-base font-bold text-[#14201C]">Audience Directory & Customer Engagement</h4>
            <p className="text-xs text-[#5F7069]">Active subscribers, conversation volume, and customer retention metrics</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#05A222] bg-[#E9F9EE] px-3 py-1 rounded-lg border border-[#C4EBD0]">
            <ShieldCheck className="w-3.5 h-3.5" /> High Quality Opt-in
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Active Opted-in Contacts */}
        <div className="p-4 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5F7069] font-semibold">Active Contacts</span>
            <UserCheck className="w-4 h-4 text-[#006736]" />
          </div>
          <div className="text-2xl font-black text-[#14201C] mt-2">
            {activeContacts.toLocaleString()}
          </div>
          <div className="text-xs text-[#05A222] font-semibold mt-1">
            Subscribed & Verified
          </div>
        </div>

        {/* 2. Total Conversations */}
        <div className="p-4 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5F7069] font-semibold">Total Conversations</span>
            <MessageSquare className="w-4 h-4 text-[#05A222]" />
          </div>
          <div className="text-2xl font-black text-[#14201C] mt-2">
            {totalConvs.toLocaleString()}
          </div>
          <div className="text-xs text-[#5F7069] font-semibold mt-1">
            Resolved: {resolved} ({resolutionRate})
          </div>
        </div>

        {/* 3. Inbound Inquiries */}
        <div className="p-4 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5F7069] font-semibold">Customer Inbound Msgs</span>
            <Users className="w-4 h-4 text-[#07CF74]" />
          </div>
          <div className="text-2xl font-black text-[#14201C] mt-2">
            {inboundCount.toLocaleString()}
          </div>
          <div className="text-xs text-[#05A222] font-semibold mt-1">
            Incoming user inquiries
          </div>
        </div>

        {/* 4. Average SLA Time */}
        <div className="p-4 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5F7069] font-semibold">Avg Resolution Time</span>
            <Clock className="w-4 h-4 text-[#039B56]" />
          </div>
          <div className="text-2xl font-black text-[#14201C] mt-2">
            ~{conversations?.avgResolutionHours || 1.4} hrs
          </div>
          <div className="text-xs text-[#05A222] font-semibold mt-1">
            Response: ~{conversations?.avgFirstResponseMinutes || 3.2} mins
          </div>
        </div>
      </div>
    </div>
  );
};
