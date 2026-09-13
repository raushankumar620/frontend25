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
          <div className="font-bold text-[#14201C] flex items-center gap-2.5 text-sm sm:text-base">
            <GitBranch className="w-4.5 h-4.5 text-[#05A222]" />
            <span>{w.name}</span>
          </div>
          <div className="text-xs sm:text-sm text-[#5F7069] mt-1">{w.description}</div>
        </div>
      ),
    },
    {
      header: 'Steps Count',
      render: (w) => (
        <span className="font-semibold text-sm text-[#1F2A26]">
          {w.nodes.length} nodes
        </span>
      ),
    },
    {
      header: 'Total Executions',
      render: (w) => (
        <div>
          <div className="font-extrabold text-[#05A222] text-sm sm:text-base">{w.executionsCount.toLocaleString()}</div>
          <div className="text-xs text-[#5F7069] font-medium">{w.triggersCount} triggers</div>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (w) => (
        <Badge variant={w.isActive ? 'success' : 'neutral'} size="sm">
          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
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
          leftIcon={<Play className="w-3.5 h-3.5" />}
          className="text-sm font-semibold border-[#C4EBD0] text-[#006736] hover:bg-[#F6FAF8] rounded-xl"
        >
          Edit Workflow
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#14201C] tracking-tight">
            WhatsApp Bot Automations
          </h2>
          <p className="text-sm sm:text-base text-[#5F7069] mt-1.5 font-medium">
            Visual trigger-action builder for auto-replies, keyword bots, and generative AI agents.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate(ROUTES.CREATE_AUTOMATION)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="text-sm font-bold px-4.5 py-2.5 rounded-xl shadow-sm"
        >
          Create Automation
        </Button>
      </div>

      <Table columns={columns} data={workflows} isLoading={isLoading} />
    </PageContainer>
  );
};
