import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { AgentCard } from '../components/AgentCard';
import { AIChat } from '../components/AIChat';
import { Button } from '../../../components/ui/Button';
import { Sparkles, BookOpen, Plus, Zap } from 'lucide-react';
import type { AIAgentConfig } from '../types';
import { aiApi } from '../api';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const AIDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<AIAgentConfig[]>([]);

  useEffect(() => {
    aiApi.getAgents().then(setAgents);
  }, []);

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generative AI Hub</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            WhatsApp AI Agents & Knowledge Base
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Deploy autonomous generative AI agents connected to your product catalogs and customer documentation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.AI_KNOWLEDGE_BASE)}
            leftIcon={<BookOpen className="w-3.5 h-3.5" />}
          >
            Manage Knowledge Base
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(ROUTES.AI_AGENT)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Create AI Agent
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onEdit={() => navigate(ROUTES.AI_AGENT)}
              />
            ))}
          </div>

          <div className="bg-linear-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-900/50 p-5 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                Human Agent Auto-Handoff Protocol
              </h4>
              <p className="text-xs text-slate-400">
                When sentiment drops below 40% or customer asks for human, chat is seamlessly routed to live inbox.
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigate(ROUTES.AI_SETTINGS)}>
              Settings
            </Button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <AIChat />
        </div>
      </div>
    </PageContainer>
  );
};
