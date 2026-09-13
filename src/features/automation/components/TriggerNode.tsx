import React from 'react';
import { Zap, Settings2 } from 'lucide-react';
import type { WorkflowNode } from '../types';

export interface TriggerNodeProps {
  node: WorkflowNode;
  onEdit?: () => void;
}

export const TriggerNode: React.FC<TriggerNodeProps> = ({ node, onEdit }) => {
  return (
    <div className="w-64 bg-white dark:bg-slate-900 border-2 border-emerald-500 rounded-2xl p-4 shadow-md relative">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-500">Trigger</span>
        </div>
        {onEdit && (
          <button onClick={onEdit} className="text-slate-400 hover:text-slate-200">
            <Settings2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{node.title}</h4>
      <p className="text-[10px] text-slate-400 mt-0.5">When event is received from Meta Webhook</p>
    </div>
  );
};
