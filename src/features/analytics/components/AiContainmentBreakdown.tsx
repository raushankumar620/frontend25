import React from 'react';
import { Bot, Sparkles, UserCheck, ShieldAlert, Zap } from 'lucide-react';
import type { AiStats } from '../types';

interface AiContainmentBreakdownProps {
  data: AiStats | null;
  loading: boolean;
}

export const AiContainmentBreakdown: React.FC<AiContainmentBreakdownProps> = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className="bg-white border border-[#E2EAE6] rounded-2xl p-6 h-80 animate-pulse bg-[#F6FAF8]" />
    );
  }

  const { totalSessions, containedSessions, handedOffSessions, containmentRate, handoffRate, triggerBreakdown } = data;

  return (
    <div className="bg-white border border-[#E2EAE6] rounded-2xl p-6 shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E9F9EE] text-[#05A222] flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-base font-bold text-[#14201C]">AI Deflection & Containment</h4>
            <p className="text-xs text-[#5F7069]">Automated AI resolutions vs Human escalation</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-black text-[#05A222] bg-[#E9F9EE] px-3 py-1 rounded-full border border-[#C4EBD0]">
            <Sparkles className="w-3.5 h-3.5" /> {containmentRate} Deflection
          </span>
        </div>
      </div>

      {/* Containment Split Meter */}
      <div className="p-4 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl space-y-3">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="flex items-center gap-1.5 text-[#05A222]">
            <Zap className="w-3.5 h-3.5" /> AI Resolved: {containedSessions} ({containmentRate})
          </span>
          <span className="flex items-center gap-1.5 text-[#D97706]">
            <UserCheck className="w-3.5 h-3.5" /> Escalated to Human: {handedOffSessions} ({handoffRate})
          </span>
        </div>
        <div className="w-full h-3.5 bg-amber-100 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-[#05A222] transition-all duration-500 rounded-l-full"
            style={{ width: containmentRate }}
          />
          <div
            className="h-full bg-amber-500 transition-all duration-500 rounded-r-full"
            style={{ width: handoffRate }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-[#5F7069]">
          <span>Total Inbound AI Sessions: <strong>{totalSessions}</strong></span>
          <span>Estimated Agent Time Saved: <strong>~{containedSessions * 4} mins</strong></span>
        </div>
      </div>

      {/* Escalation Triggers Breakdown */}
      <div>
        <h5 className="text-xs font-bold text-[#5F7069] uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-[#D97706]" /> Escalation Triggers Breakdown
        </h5>
        {triggerBreakdown.length === 0 ? (
          <div className="text-xs text-[#5F7069] italic py-2">
            No human escalations triggered in this period.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {triggerBreakdown.map((tb, idx) => (
              <div
                key={idx}
                className="p-3 bg-white border border-[#E2EAE6] rounded-xl flex items-center justify-between hover:border-[#05A222]/30 transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#006736]" />
                  <span className="text-xs font-bold text-[#14201C]">{tb.trigger}</span>
                </div>
                <span className="text-xs font-black text-[#05A222] bg-[#E9F9EE] px-2 py-0.5 rounded-md">
                  {tb.count} calls
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
