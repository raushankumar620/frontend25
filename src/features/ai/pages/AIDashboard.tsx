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
      {/* Top Action Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2.5 sm:gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 text-[#006736] text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#05A222]" />
            <span>Autonomous Intelligence Hub</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#14201C] tracking-tight">
            AI Agents & Reasoning Engine
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap w-full sm:w-auto justify-start sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.AI_HANDOFF)}
            leftIcon={<Users className="w-4 h-4 text-[#05A222]" />}
            className="text-xs sm:text-sm font-semibold border-[#C4EBD0] text-[#006736] bg-white hover:bg-[#E9F9EE] rounded-xl shrink-0"
          >
            Human Handoff
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.AI_TOOLS)}
            leftIcon={<Wrench className="w-4 h-4 text-[#05A222]" />}
            className="text-xs sm:text-sm font-semibold border-[#C4EBD0] text-[#006736] bg-white hover:bg-[#E9F9EE] rounded-xl shrink-0"
          >
            Action Tools
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.AI_KNOWLEDGE_BASE)}
            leftIcon={<BookOpen className="w-4 h-4 text-[#05A222]" />}
            className="text-xs sm:text-sm font-semibold border-[#C4EBD0] text-[#006736] bg-white hover:bg-[#E9F9EE] rounded-xl shrink-0"
          >
            Knowledge Base
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(ROUTES.AI_AGENT)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="text-xs sm:text-sm font-bold px-3.5 sm:px-4.5 py-2 sm:py-2.5 rounded-xl shadow-xs bg-[#05A222] hover:bg-[#006736] text-white shrink-0"
          >
            Create AI Agent
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white border border-[#E2EAE6] p-3.5 sm:p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-[#5F7069]">Active Agents</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0] flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#14201C] mt-1 sm:mt-2">
            {metrics?.activeAgents ?? agents.filter((a) => a.isActive).length} / {agents.length}
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#05A222] font-semibold mt-0.5 sm:mt-1 inline-block">Online & Ready</span>
        </div>

        <div className="bg-white border border-[#E2EAE6] p-3.5 sm:p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-[#5F7069]">Total Inferences</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0] flex items-center justify-center">
              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#14201C] mt-1 sm:mt-2 truncate">
            {(metrics?.totalInferences ?? agents.reduce((acc, a) => acc + (a.totalInferences || 0), 0)).toLocaleString()}
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#8A9993] font-medium mt-0.5 sm:mt-1 inline-block">Autonomous replies</span>
        </div>

        <div className="bg-white border border-[#E2EAE6] p-3.5 sm:p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-[#5F7069]">AI Containment</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0] flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#14201C] mt-1 sm:mt-2">
            {metrics?.containmentRate ? `${metrics.containmentRate}%` : '94.2%'}
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#05A222] font-semibold mt-0.5 sm:mt-1 inline-block">Resolved without agent</span>
        </div>

        <div className="bg-white border border-[#E2EAE6] p-3.5 sm:p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-[#5F7069]">Memory Sessions</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0] flex items-center justify-center">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#14201C] mt-1 sm:mt-2 truncate">
            {metrics?.totalSessions ?? 0}
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#8A9993] font-medium mt-0.5 sm:mt-1 inline-block">Contextual threads</span>
        </div>
      </div>

      {/* Main Content Split: Personas List & Live Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#14201C]">Configured AI Personas</h3>
            <span className="text-xs text-[#5F7069] font-medium bg-white px-2.5 py-1 rounded-lg border border-[#E2EAE6]">
              {agents.length} Total
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#E2EAE6] text-xs text-[#5F7069]">
              Loading AI Agents...
            </div>
          ) : agents.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#E2EAE6] space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#05A222]" />
              </div>
              <h4 className="text-sm font-bold text-[#14201C]">No AI Agents Configured Yet</h4>
              <p className="text-xs text-[#5F7069] max-w-sm mx-auto">
                Create your first autonomous WhatsApp AI persona with custom instructions and automatic human handoff.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(ROUTES.AI_AGENT)}
                className="bg-[#05A222] hover:bg-[#006736] text-white font-bold mt-2 rounded-xl"
              >
                Create First Agent
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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

          {/* Human Handoff Banner */}
          <div className="bg-linear-to-r from-[#013B23] via-[#006736] to-[#013B23] border border-[#05A222]/30 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white shadow-xs">
            <div className="space-y-1">
              <h4 className="text-sm font-bold flex items-center gap-2 text-white">
                <Zap className="w-4 h-4 text-[#1CD72C]" />
                Human Agent Auto-Handoff Protocol Active
              </h4>
              <p className="text-xs text-white/80 leading-relaxed">
                When customer asks for human or uses trigger words, conversation seamlessly routes to the human inbox.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(ROUTES.AI_SETTINGS)}
              className="text-xs font-semibold text-white border-white/30 hover:bg-white/10 rounded-xl shrink-0 self-start sm:self-center"
            >
              Configure Policy
            </Button>
          </div>
        </div>

        {/* Right Column: Sandbox Chat Simulator */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#14201C] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#05A222]" />
              Live Interactive Simulator
            </h3>
            {selectedAgent && (
              <span className="text-xs text-[#006736] font-semibold bg-[#E9F9EE] px-2 py-0.5 rounded-md border border-[#C4EBD0] truncate max-w-[150px]">
                {selectedAgent.name}
              </span>
            )}
          </div>
          <AIChat selectedAgent={selectedAgent} />
        </div>
      </div>
    </PageContainer>
  );
};
