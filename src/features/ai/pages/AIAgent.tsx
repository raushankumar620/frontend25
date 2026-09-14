import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { ArrowLeft, Bot, Save, Plus, X, Sparkles, Wand2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { aiService } from '../../../services/aiService';
import { AIChat } from '../components/AIChat';
import type { AIAgent as AIAgentType } from '../types';

const PRESET_PROMPTS = [
  {
    title: 'Customer Support Lead',
    role: '24/7 technical customer support, FAQ answers, order tracking',
    prompt: 'You are an empathetic, concise, and highly knowledgeable customer support assistant for WhatsApp. Help customers answer FAQs, check order details, and troubleshoot issues. When in doubt or if customer asks for a human, route to support.',
  },
  {
    title: 'Sales & Lead Qualifier',
    role: 'Greet incoming leads, ask qualifying questions, recommend plans',
    prompt: 'You are the primary WhatsApp sales specialist. Be polite, energetic, and concise. Greet prospective customers, ask about their business needs, recommend our best-suited plans, and offer to schedule a demo.',
  },
  {
    title: 'Appointment & Booking Concierge',
    role: 'Schedule appointments, check availability, confirm bookings',
    prompt: 'You are a friendly booking concierge on WhatsApp. Assist users in finding convenient dates and times for appointments, collect their contact information, and send confirmation summaries.',
  },
];

export const AIAgent: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const agentId = searchParams.get('id');

  const [name, setName] = useState('WhatsApp Support Lead');
  const [role, setRole] = useState('Greet incoming leads and assist customers with product inquiries.');
  const [modelProvider, setModelProvider] = useState<'openai' | 'gemini' | 'anthropic'>('openai');
  const [modelName, setModelName] = useState('gpt-4o-mini');
  const [systemPrompt, setSystemPrompt] = useState(
    'You are the official WhatsApp AI assistant for our company. Always remain professional, concise, and helpful. Format your responses with bullet points and emojis when appropriate.'
  );
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(500);
  const [handoffKeywords, setHandoffKeywords] = useState<string[]>([
    'human',
    'agent',
    'support',
    'executive',
    'representative',
  ]);
  const [newKeyword, setNewKeyword] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (agentId) {
      setLoading(true);
      aiService
        .getAgentById(agentId)
        .then((agent) => {
          if (agent) {
            setName(agent.name);
            setRole(agent.role || '');
            setModelProvider((agent.modelProvider as any) || 'openai');
            setModelName(agent.modelName || 'gpt-4o-mini');
            setSystemPrompt(agent.systemPrompt || '');
            setTemperature(agent.temperature ?? 0.7);
            setMaxTokens(agent.maxTokens || 500);
            setHandoffKeywords(agent.handoffKeywords || []);
            setIsDefault(agent.isDefault || false);
            setIsActive(agent.isActive !== false);
          }
        })
        .catch((err) => console.error('Failed to load agent:', err))
        .finally(() => setLoading(false));
    }
  }, [agentId]);

  const handleAddKeyword = () => {
    const trimmed = newKeyword.trim().toLowerCase();
    if (trimmed && !handoffKeywords.includes(trimmed)) {
      setHandoffKeywords([...handoffKeywords, trimmed]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setHandoffKeywords(handoffKeywords.filter((k) => k !== kw));
  };

  const handleApplyPreset = (preset: (typeof PRESET_PROMPTS)[0]) => {
    setName(preset.title);
    setRole(preset.role);
    setSystemPrompt(preset.prompt);
  };

  const handleSave = async () => {
    if (!name.trim() || !systemPrompt.trim()) {
      alert('Please fill in Agent Name and System Instruction Prompt');
      return;
    }

    try {
      setIsSaving(true);
      const payload: Partial<AIAgentType> = {
        name,
        role,
        modelProvider,
        modelName,
        systemPrompt,
        temperature,
        maxTokens,
        handoffKeywords,
        isDefault,
        isActive,
      };

      if (agentId) {
        await aiService.updateAgent(agentId, payload);
      } else {
        await aiService.createAgent(payload);
      }
      navigate(ROUTES.AI_DASHBOARD);
    } catch (err: any) {
      alert(`Failed to save AI Agent: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const previewAgent: Partial<AIAgentType> = {
    _id: agentId || 'preview',
    name,
    role,
    modelName,
    systemPrompt,
    handoffKeywords,
  };

  return (
    <PageContainer>
      <button
        onClick={() => navigate(ROUTES.AI_DASHBOARD)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-5"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to AI Hub</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Builder */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E9F9EE] dark:bg-[#006736]/20 text-[#006736] dark:text-[#05A222] flex items-center justify-center font-bold">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {agentId ? 'Edit AI Agent Persona' : 'Create Autonomous AI Agent'}
                </h2>
                <p className="text-xs text-slate-500">
                  Configure behavior, underlying LLM, and human handoff protocols.
                </p>
              </div>
            </div>
            {agentId && (
              <span className="text-[10px] font-mono text-[#006736] bg-[#E9F9EE] px-2 py-0.5 rounded">
                Editing
              </span>
            )}
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading persona data...</div>
          ) : (
            <div className="space-y-5">
              {/* Presets Bar */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-[#05A222]" />
                  Quick Persona Presets
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {PRESET_PROMPTS.map((p) => (
                    <button
                      key={p.title}
                      type="button"
                      onClick={() => handleApplyPreset(p)}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-left hover:border-[#05A222] hover:bg-[#E9F9EE]/40 dark:hover:bg-slate-800 transition-all text-xs"
                    >
                      <div className="font-bold text-slate-800 dark:text-slate-200">{p.title}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{p.role}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Agent Persona Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sales Concierge Bot"
                  required
                />
                <Input
                  label="Agent Role Description"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Inbound sales & qualifier"
                  required
                />
              </div>

              {/* Model Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Underlying LLM Engine
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'gpt-4o-mini', label: 'GPT-4o Mini', provider: 'openai' },
                    { id: 'gpt-4o', label: 'GPT-4o (Omni)', provider: 'openai' },
                    { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', provider: 'gemini' },
                    { id: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet', provider: 'anthropic' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setModelName(m.id);
                        setModelProvider(m.provider as any);
                      }}
                      className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                        modelName === m.id
                          ? 'border-[#05A222] bg-[#E9F9EE] dark:bg-[#006736]/20 text-[#006736] dark:text-[#05A222] shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <div>{m.label}</div>
                      <div className="text-[10px] font-normal opacity-70 mt-0.5 capitalize">{m.provider}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* System Prompt */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  System Instruction Prompt & Business Knowledge
                </label>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={6}
                  placeholder="Define your agent's persona, tone of voice, boundaries, and knowledge..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs p-3 focus:outline-none focus:ring-2 focus:ring-[#05A222]"
                />
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Temperature (Creativity)</span>
                    <span className="font-mono text-[#006736] dark:text-[#05A222]">{temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-[#05A222]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>Precise (0.0)</span>
                    <span>Creative (1.0)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Max Tokens</span>
                    <span className="font-mono text-[#006736] dark:text-[#05A222]">{maxTokens}</span>
                  </div>
                  <input
                    type="number"
                    min="50"
                    max="2048"
                    step="50"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value) || 500)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs p-2 focus:outline-none focus:ring-2 focus:ring-[#05A222]"
                  />
                </div>
              </div>

              {/* Human Handoff Keywords */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Human Handoff Trigger Keywords
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  When a customer sends any of these words, the AI agent will stop answering and route the chat to your human agents.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {handoffKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center gap-1.5 bg-[#E9F9EE] dark:bg-[#006736]/30 text-[#006736] dark:text-[#05A222] text-xs font-semibold px-2.5 py-1 rounded-lg border border-[#C4EBD0] dark:border-[#006736]"
                    >
                      {kw}
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(kw)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                    placeholder="Add keyword (e.g. manager, live support)..."
                    className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#05A222]"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddKeyword}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Flags */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="rounded accent-[#05A222]"
                  />
                  <span>Set as Default Agent for Inbound WhatsApp Chats</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded accent-[#05A222]"
                  />
                  <span>Agent is Active</span>
                </label>
              </div>

              <Button
                size="lg"
                className="w-full mt-4 bg-[#05A222] hover:bg-[#006736] text-[#14201C] hover:text-white font-bold"
                onClick={handleSave}
                isLoading={isSaving}
                leftIcon={<Save className="w-4 h-4" />}
              >
                {agentId ? 'Update AI Agent' : 'Create & Deploy AI Agent'}
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Live Testing Sandbox */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Sparkles className="w-4 h-4 text-[#05A222]" />
            <span>Interactive Persona Testing Sandbox</span>
          </div>
          <AIChat selectedAgent={previewAgent as AIAgentType} />
        </div>
      </div>
    </PageContainer>
  );
};
