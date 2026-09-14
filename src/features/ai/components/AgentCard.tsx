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
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#05A222]/40 transition-all">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E9F9EE] dark:bg-[#006736]/20 text-[#006736] dark:text-[#05A222] flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{agent.name}</h4>
                {agent.isDefault && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold bg-[#E9F9EE] text-[#006736] px-1.5 py-0.5 rounded-md">
                    <Star className="w-3 h-3 fill-[#006736]" /> Default
                  </span>
                )}
              </div>
              <span className="text-[11px] font-mono text-[#006736] dark:text-[#05A222]">
                {agent.modelName || 'gpt-4o-mini'} ({agent.modelProvider || 'openai'})
              </span>
            </div>
          </div>
          <Badge variant={agent.isActive ? 'success' : 'neutral'} size="sm" dot>
            {agent.isActive ? 'Active' : 'Offline'}
          </Badge>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {agent.role || agent.systemPrompt}
        </p>

        <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="text-[10px] text-slate-400 font-medium">Total Inferences</div>
            <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              {(agent.totalInferences || 0).toLocaleString()}
            </div>
          </div>
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="text-[10px] text-slate-400 font-medium">Handoff Triggers</div>
            <div className="font-bold text-[#006736] dark:text-[#05A222] mt-0.5">
              {agent.handoffKeywords?.length || 0} keywords
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        <Button
          variant="outline"
          size="sm"
          onClick={onTestChat}
          className="flex-1 text-xs font-semibold text-[#006736] border-[#C4EBD0] hover:bg-[#E9F9EE]"
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
          className={agent.isActive ? 'text-amber-500 hover:text-amber-600' : 'text-slate-400 hover:text-[#05A222]'}
        >
          <Power className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          title="Configure Agent Persona"
        >
          <Settings2 className="w-4 h-4 text-slate-400 hover:text-slate-700 dark:hover:text-white" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          title="Delete Agent"
          className="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
