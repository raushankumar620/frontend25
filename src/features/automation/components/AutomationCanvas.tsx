import React from 'react';
import type { WorkflowNode } from '../types';
import { TriggerNode } from './TriggerNode';
import { ActionNode } from './ActionNode';
import { ArrowDown, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export interface AutomationCanvasProps {
  nodes: WorkflowNode[];
  onAddNode: (type: WorkflowNode['type']) => void;
  onDeleteNode: (id: string) => void;
}

export const AutomationCanvas: React.FC<AutomationCanvasProps> = ({
  nodes,
  onAddNode,
  onDeleteNode,
}) => {
  return (
    <div className="w-full bg-slate-900/50 border border-slate-800 rounded-3xl p-8 min-h-[500px] flex flex-col items-center justify-start overflow-x-auto relative">
      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none rounded-3xl"
        style={{
          backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center space-y-4">
        {nodes.map((node, index) => (
          <React.Fragment key={node.id}>
            {node.type === 'trigger' ? (
              <TriggerNode node={node} />
            ) : (
              <ActionNode node={node} onDelete={() => onDeleteNode(node.id)} />
            )}

            {index < nodes.length - 1 && (
              <div className="flex flex-col items-center my-1 text-slate-500">
                <div className="w-0.5 h-6 bg-slate-700" />
                <ArrowDown className="w-4 h-4 text-emerald-500 -my-1" />
              </div>
            )}
          </React.Fragment>
        ))}

        {/* Add Node Controls */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAddNode('ai_agent')}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            + AI Agent Step
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAddNode('action')}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            + WhatsApp Message
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAddNode('delay')}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            + Delay Timer
          </Button>
        </div>
      </div>
    </div>
  );
};
