import React from 'react';
import { Award, Shield, CheckCircle2 } from 'lucide-react';
import type { AgentPerformance } from '../types';

interface AgentLeaderboardProps {
  agents: AgentPerformance[];
  loading: boolean;
}

export const AgentLeaderboard: React.FC<AgentLeaderboardProps> = ({ agents, loading }) => {
  if (loading) {
    return (
      <div className="bg-white border border-[#E2EAE6] rounded-2xl p-6 h-80 animate-pulse bg-[#F6FAF8]" />
    );
  }

  return (
    <div className="bg-white border border-[#E2EAE6] rounded-2xl p-6 shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E9F9EE] text-[#006736] flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-base font-bold text-[#14201C]">Agent Performance & SLA Leaderboard</h4>
            <p className="text-xs text-[#5F7069]">Customer resolution speed & ticket closure rates</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-[#5F7069]">
          {agents.length} Active Agents
        </span>
      </div>

      {agents.length === 0 ? (
        <div className="p-8 text-center text-sm text-[#5F7069] bg-[#F6FAF8] rounded-xl border border-[#E2EAE6]">
          No assigned conversations recorded in this date range.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#E2EAE6] text-xs font-bold text-[#5F7069] uppercase tracking-wider">
                <th className="pb-3 pl-2">Rank</th>
                <th className="pb-3">Agent</th>
                <th className="pb-3">Role</th>
                <th className="pb-3 text-center">Assigned</th>
                <th className="pb-3 text-center">Resolved</th>
                <th className="pb-3 text-right pr-2">Resolution Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EAE6]/60">
              {agents.map((agent, index) => {
                const isTop1 = index === 0;
                const isTop2 = index === 1;
                const isTop3 = index === 2;

                return (
                  <tr key={agent.agentId} className="hover:bg-[#F6FAF8] transition-colors">
                    <td className="py-3 pl-2 font-black text-sm">
                      {isTop1 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#FFD700]/20 text-[#B45309] font-black text-xs">
                          🥇
                        </span>
                      ) : isTop2 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#C0C0C0]/20 text-[#4B5563] font-black text-xs">
                          🥈
                        </span>
                      ) : isTop3 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#CD7F32]/20 text-[#92400E] font-black text-xs">
                          🥉
                        </span>
                      ) : (
                        <span className="text-[#5F7069] text-xs font-bold pl-2">#{index + 1}</span>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#E9F9EE] text-[#05A222] font-black text-xs flex items-center justify-center border border-[#C4EBD0]">
                          {agent.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-[#14201C] text-xs sm:text-sm">{agent.name}</div>
                          <div className="text-[11px] text-[#5F7069]">{agent.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#006736] bg-[#E9F9EE] px-2 py-0.5 rounded-md">
                        <Shield className="w-3 h-3" /> {agent.role.replace('ORG_', '')}
                      </span>
                    </td>
                    <td className="py-3 text-center font-semibold text-[#14201C]">
                      {agent.assignedCount}
                    </td>
                    <td className="py-3 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-[#05A222]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {agent.resolvedCount}
                      </span>
                    </td>
                    <td className="py-3 text-right pr-2">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 bg-[#F6FAF8] border border-[#E2EAE6] rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="h-full bg-[#05A222] rounded-full"
                            style={{ width: agent.resolutionRate }}
                          />
                        </div>
                        <span className="font-black text-xs text-[#14201C]">{agent.resolutionRate}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
