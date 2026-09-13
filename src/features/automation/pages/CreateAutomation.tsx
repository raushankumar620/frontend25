import React, { useState } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { AutomationCanvas } from '../components/AutomationCanvas';
import type { WorkflowNode } from '../types';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

const defaultNodes: WorkflowNode[] = [
  { id: '1', type: 'trigger', title: 'Inbound Message: Customer says "Pricing"', config: {} },
  { id: '2', type: 'ai_agent', title: 'AI Sales Agent (Pricing & Enterprise FAQs)', config: {} },
  { id: '3', type: 'action', title: 'Send WhatsApp Quick Reply Buttons', config: {} },
];

export const CreateAutomation: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('Pricing & Sales AI Bot');
  const [nodes, setNodes] = useState<WorkflowNode[]>(defaultNodes);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddNode = (type: WorkflowNode['type']) => {
    const newNode: WorkflowNode = {
      id: String(Date.now()),
      type,
      title: type === 'ai_agent' ? 'AI Support Copilot' : type === 'delay' ? 'Wait 30 Minutes' : 'Send WhatsApp Message',
      config: {},
    };
    setNodes([...nodes, newNode]);
  };

  const handleDeleteNode = (id: string) => {
    setNodes(nodes.filter((n) => n.id !== id));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      navigate(ROUTES.AUTOMATIONS);
    }, 600);
  };

  return (
    <PageContainer>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <button
            onClick={() => navigate(ROUTES.AUTOMATIONS)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Automations</span>
          </button>
          <div className="flex items-center gap-3">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-base font-bold text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddNode('ai_agent')}
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
          >
            Add AI Node
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Save & Publish
          </Button>
        </div>
      </div>

      <AutomationCanvas
        nodes={nodes}
        onAddNode={handleAddNode}
        onDeleteNode={handleDeleteNode}
      />
    </PageContainer>
  );
};
