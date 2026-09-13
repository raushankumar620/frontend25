import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Table, type Column } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Plus, GitBranch, Play, CheckCircle2 } from 'lucide-react';
import type { AutomationWorkflow } from '../types';
import { automationsApi } from '../api';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const Automations: React.FC = () => {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    automationsApi.getAutomations().then((data) => {
      setWorkflows(data);
      setIsLoading(false);
    });
  }, []);

  const columns: Column<AutomationWorkflow>[] = [
    {
      header: 'Automation Workflow',
      render: (w) => (
        <div>
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GitBranch className="w-3.5 h-3.5 text-emerald-500" />
            <span>{w.name}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">{w.description}</div>
        </div>
      ),
    },
    {
      header: 'Steps Count',
      render: (w) => (
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {w.nodes.length} nodes
        </span>
      ),
    },
    {
      header: 'Total Executions',
      render: (w) => (
        <div>
          <div className="font-bold text-emerald-500">{w.executionsCount.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400">{w.triggersCount} triggers</div>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (w) => (
        <Badge variant={w.isActive ? 'success' : 'neutral'} size="sm">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          {w.isActive ? 'ACTIVE' : 'PAUSED'}
        </Badge>
      ),
    },
    {
      header: 'Action',
      render: () => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(ROUTES.CREATE_AUTOMATION)}
          leftIcon={<Play className="w-3 h-3" />}
        >
          Edit Workflow
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            WhatsApp Bot Automations
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Visual trigger-action builder for auto-replies, keyword bots, and generative AI agents.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate(ROUTES.CREATE_AUTOMATION)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Create Automation
        </Button>
      </div>

      <Table columns={columns} data={workflows} isLoading={isLoading} />
    </PageContainer>
  );
};
