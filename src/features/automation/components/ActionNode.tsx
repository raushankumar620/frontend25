import React from 'react';
import { Bot, Send, Clock, GitBranch, Settings2, Trash2 } from 'lucide-react';
import type { WorkflowNode } from '../types';

export interface ActionNodeProps {
  node: WorkflowNode;
  onDelete?: () => void;
  onEdit?: () => void;
}

export const ActionNode: React.FC<ActionNodeProps> = ({ node, onDelete, onEdit }) => {
  const getIcon = () => {
    switch (node.type) {
      case 'ai_agent':
        return <Bot className="w-4 h-4 text-indigo-400" />;
      case 'action':
        return <Send className="w-4 h-4 text-teal-400" />;
      case 'delay':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'condition':
        return <GitBranch className="w-4 h-4 text-sky-400" />;
      default:
        return <Send className="w-4 h-4 text-slate-400" />;
    }
  };

  const getBorderColor = () => {
    switch (node.type) {
      case 'ai_agent':
        return 'border-indigo-500/60';
      case 'condition':
        return 'border-sky-500/60';
      case 'delay':
        return 'border-amber-500/60';
      default:
        return 'border-teal-500/60';
    }
  };

  return (
    <div className={`w-64 bg-white dark:bg-slate-900 border-2 ${getBorderColor()} rounded-2xl p-4 shadow-md relative`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            {getIcon()}
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-400">{node.type.replace('_', ' ')}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {onEdit && (
            <button onClick={onEdit} className="text-slate-400 hover:text-slate-200">
              <Settings2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} className="text-slate-400 hover:text-rose-400">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{node.title}</h4>
      <p className="text-[10px] text-slate-400 mt-0.5">Automated workflow execution step</p>
    </div>
  );
};
