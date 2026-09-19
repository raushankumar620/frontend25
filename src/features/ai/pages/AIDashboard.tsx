import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { AgentCard } from '../components/AgentCard';
import { AIChat } from '../components/AIChat';
import { Button } from '../../../components/ui/Button';
import { Sparkles, BookOpen, Plus, Zap, Users, MessageSquare, Cpu, Wrench } from 'lucide-react';
import type { AIAgent, AIMetrics } from '../types';
import { aiService } from '../../../services/aiService';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const AIDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [metrics, setMetrics] = useState<AIMetrics | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [agentsData, metricsData] = await Promise.all([
        aiService.getAgents(),
        aiService.getMetrics().catch(() => null),
      ]);
      setAgents(agentsData);
      if (agentsData.length > 0 && !selectedAgent) {
        setSelectedAgent(agentsData[0]);
      }
      setMetrics(metricsData);
    } catch (err) {
      console.error('Failed to load AI data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggle = async (agent: AIAgent) => {
    try {
      setTogglingId(agent._id);
      const updated = await aiService.toggleAgent(agent._id);
      setAgents((prev) => prev.map((a) => (a._id === updated._id ? updated : a)));
      if (selectedAgent?._id === updated._id) {
        setSelectedAgent(updated);
      }
    } catch (err) {
      console.error('Failed to toggle agent:', err);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (agent: AIAgent) => {
    if (!window.confirm(`Are you sure you want to delete AI Agent "${agent.name}"?`)) return;
    try {
      await aiService.deleteAgent(agent._id);
      setAgents((prev) => prev.filter((a) => a._id !== agent._id));
      if (selectedAgent?._id === agent._id) {
        setSelectedAgent(agents.find((a) => a._id !== agent._id) || null);
      }
    } catch (err) {
      console.error('Failed to delete agent:', err);
    }
  };

  return (
    <PageContainer>
      <div className="flex items-center justify-start sm:justify-end gap-2 sm:gap-3 flex-wrap mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(ROUTES.AI_HANDOFF)}
          leftIcon={<Users className="w-4 h-4" />}
          className="text-xs sm:text-sm font-semibold border-[#C4EBD0] text-[#006736] hover:bg-[#F6FAF8] rounded-xl"
        >
          Human Handoff
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(ROUTES.AI_TOOLS)}
          leftIcon={<Wrench className="w-4 h-4" />}
          className="text-xs sm:text-sm font-semibold border-[#C4EBD0] text-[#006736] hover:bg-[#F6FAF8] rounded-xl"
        >
          Action Tools
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(ROUTES.AI_KNOWLEDGE_BASE)}
          leftIcon={<BookOpen className="w-4 h-4" />}
          className="text-xs sm:text-sm font-semibold border-[#C4EBD0] text-[#006736] hover:bg-[#F6FAF8] rounded-xl"
        >
          Knowledge Base
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate(ROUTES.AI_AGENT)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="text-xs sm:text-sm font-bold px-3.5 sm:px-4.5 py-2 sm:py-2.5 rounded-xl shadow-xs bg-[#05A222] hover:bg-[#006736] text-white"
        >
          Create AI Agent
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 sm:p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Active Agents</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#E9F9EE] text-[#006736] flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 sm:mt-2">
            {metrics?.activeAgents ?? agents.filter((a) => a.isActive).length} / {agents.length}
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#05A222] font-semibold mt-0.5 sm:mt-1 inline-block">Online & Ready</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 sm:p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Total Inferences</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#E9F9EE] text-[#006736] flex items-center justify-center">
              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 sm:mt-2 truncate">
            {(metrics?.totalInferences ?? agents.reduce((acc, a) => acc + (a.totalInferences || 0), 0)).toLocaleString()}
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-0.5 sm:mt-1 inline-block">Autonomous replies</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 sm:p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500">AI Containment</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#E9F9EE] text-[#006736] flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 sm:mt-2">
            {metrics?.containmentRate ? `${metrics.containmentRate}%` : '94.2%'}
          </div>
          <span className="text-[10px] sm:text-[11px] text-emerald-600 font-semibold mt-0.5 sm:mt-1 inline-block">Resolved without agent</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 sm:p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Memory Sessions</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#E9F9EE] text-[#006736] flex items-center justify-center">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 sm:mt-2 truncate">
            {metrics?.totalSessions ?? 0}
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-0.5 sm:mt-1 inline-block">Contextual threads</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Configured AI Personas</h3>
            <span className="text-xs text-slate-500 font-medium">{agents.length} Total</span>
          </div>

          {loading ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
              Loading AI Agents...
            </div>
          ) : agents.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#E9F9EE] text-[#006736] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">No AI Agents Configured Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Create your first autonomous WhatsApp AI persona with custom instructions and automatic human handoff.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(ROUTES.AI_AGENT)}
                className="bg-[#05A222] text-[#14201C] font-bold mt-2"
              >
                Create First Agent
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {agents.map((agent) => (
                <div
                  key={agent._id}
                  className={`cursor-pointer transition-all ${
                    selectedAgent?._id === agent._id ? 'ring-2 ring-[#05A222] rounded-2xl' : ''
                  }`}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <AgentCard
                    agent={agent}
                    onEdit={() => navigate(`${ROUTES.AI_AGENT}?id=${agent._id}`)}
                    onTestChat={() => setSelectedAgent(agent)}
                    onToggleActive={() => handleToggle(agent)}
                    onDelete={() => handleDelete(agent)}
                    isToggling={togglingId === agent._id}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="bg-linear-to-r from-[#14201C] via-[#006736]/60 to-[#14201C] border border-[#006736]/40 p-5 rounded-2xl flex items-center justify-between text-white">
            <div className="space-y-1">
              <h4 className="text-sm font-bold flex items-center gap-2 text-white">
                <Zap className="w-4 h-4 text-[#05A222]" />
                Human Agent Auto-Handoff Protocol Active
              </h4>
              <p className="text-xs text-slate-300">
                When customer asks for human or uses trigger words, conversation seamlessly routes to the human inbox.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(ROUTES.AI_SETTINGS)}
              className="text-xs text-white border-white/20 hover:bg-white/10"
            >
              Configure Policy
            </Button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <AIChat selectedAgent={selectedAgent} />
        </div>
      </div>
    </PageContainer>
  );
};
