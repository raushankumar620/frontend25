import React from 'react';
import { Bot, Sparkles, Settings2 } from 'lucide-react';
import type { AIAgentConfig } from '../types';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

export interface AgentCardProps {
  agent: AIAgentConfig;
  onEdit?: () => void;
  onTestChat?: () => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onEdit, onTestChat }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{agent.name}</h4>
              <span className="text-[10px] font-mono text-indigo-400">{agent.model}</span>
            </div>
          </div>
          <Badge variant={agent.isActive ? 'success' : 'neutral'} size="sm" dot>
            {agent.isActive ? 'Active' : 'Offline'}
          </Badge>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{agent.role}</p>

        <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <div className="text-[10px] text-slate-400">Total Chats</div>
            <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              {agent.totalConversationsHandled.toLocaleString()}
            </div>
          </div>
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <div className="text-[10px] text-slate-400">Resolution Rate</div>
            <div className="font-bold text-emerald-500 mt-0.5">{agent.resolutionRate}%</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <Button
          variant="outline"
          size="sm"
          onClick={onTestChat}
          className="flex-1"
          leftIcon={<Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
        >
          Test Simulator
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          title="Configure Agent"
        >
          <Settings2 className="w-4 h-4 text-slate-400" />
        </Button>
      </div>
    </div>
  );
};
