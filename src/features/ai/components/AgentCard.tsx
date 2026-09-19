import React from 'react';
import { Bot, Sparkles, Settings2, Trash2, Power, Star } from 'lucide-react';
import type { AIAgent } from '../types';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

export interface AgentCardProps {
  agent: AIAgent;
  onEdit?: () => void;
  onTestChat?: () => void;
  onToggleActive?: () => void;
  onDelete?: () => void;
  isToggling?: boolean;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  onEdit,
  onTestChat,
  onToggleActive,
  onDelete,
  isToggling,
}) => {
  return (
    <div className="bg-white border border-[#E2EAE6] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#05A222] transition-all">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0] flex items-center justify-center shrink-0 font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="text-sm font-bold text-[#14201C] truncate">{agent.name}</h4>
                {agent.isDefault && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#E9F9EE] text-[#006736] px-1.5 py-0.5 rounded-md border border-[#C4EBD0]">
                    <Star className="w-3 h-3 fill-[#006736]" /> Default
                  </span>
                )}
              </div>
              <span className="text-[11px] font-mono text-[#006736]">
                {agent.modelName || 'gpt-4o-mini'} ({agent.modelProvider || 'openai'})
              </span>
            </div>
          </div>
          <Badge variant={agent.isActive ? 'success' : 'neutral'} size="sm" dot className="shrink-0">
            {agent.isActive ? 'Active' : 'Offline'}
          </Badge>
        </div>

        <p className="text-xs text-[#5F7069] line-clamp-2 leading-relaxed">
          {agent.role || agent.systemPrompt}
        </p>

        <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
          <div className="p-2.5 bg-[#F6FAF8] rounded-xl border border-[#E2EAE6]">
            <div className="text-[10px] text-[#5F7069] font-medium">Total Inferences</div>
            <div className="font-bold text-[#14201C] mt-0.5">
              {(agent.totalInferences || 0).toLocaleString()}
            </div>
          </div>
          <div className="p-2.5 bg-[#E9F9EE]/60 rounded-xl border border-[#C4EBD0]">
            <div className="text-[10px] text-[#006736] font-medium">Handoff Triggers</div>
            <div className="font-bold text-[#006736] mt-0.5">
              {agent.handoffKeywords?.length || 0} keywords
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 pt-3 border-t border-[#E2EAE6]">
        <Button
          variant="outline"
          size="sm"
          onClick={onTestChat}
          className="flex-1 text-xs font-semibold text-[#006736] border-[#C4EBD0] hover:bg-[#E9F9EE] rounded-xl"
          leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#05A222]" />}
        >
          Test Sandbox
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleActive}
          disabled={isToggling}
          title={agent.isActive ? 'Deactivate Agent' : 'Activate Agent'}
          className={agent.isActive ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl' : 'text-[#8A9993] hover:text-[#05A222] hover:bg-[#E9F9EE] rounded-xl'}
        >
          <Power className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          title="Configure Agent Persona"
          className="text-[#5F7069] hover:text-[#14201C] hover:bg-[#F6FAF8] rounded-xl"
        >
          <Settings2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          title="Delete Agent"
          className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
