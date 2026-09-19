import React, { useState } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import {
  Save,
  Shield,
  Key,
  Bot,
  Sparkles,
  Zap,
  CheckCircle2,
  Cpu,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const AISettings: React.FC = () => {
  const navigate = useNavigate();
  const [openAiKey, setOpenAiKey] = useState('sk-proj-••••••••••••••••••••••••');
  const [geminiKey, setGeminiKey] = useState('AIzaSy••••••••••••••••••••••••');
  const [anthropicKey, setAnthropicKey] = useState('sk-ant-••••••••••••••••••••••••');
  const [autoHandoff, setAutoHandoff] = useState(true);
  const [maxTokens, setMaxTokens] = useState('350');
  const [defaultModel, setDefaultModel] = useState('gpt-4o-mini');
  const [temperature, setTemperature] = useState('0.7');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setSavedSuccess(false);
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    }, 600);
  };

  return (
    <PageContainer>
      <button
        onClick={() => navigate(ROUTES.AI_DASHBOARD)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#5F7069] hover:text-[#14201C] mb-5 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to AI Hub</span>
      </button>

      <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-[#E2EAE6] p-5 sm:p-8 shadow-xs space-y-7">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2EAE6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0] flex items-center justify-center font-bold shrink-0">
              <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-[#05A222]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#14201C] tracking-tight">
                AI Engine & Routing Policies
              </h2>
              <p className="text-xs sm:text-sm text-[#5F7069] mt-0.5 font-medium">
                Manage LLM vendor API keys, token limits, and autonomous human escalation rules.
              </p>
            </div>
          </div>

          <Button
            size="md"
            variant="primary"
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
            className="font-bold text-xs sm:text-sm px-6 rounded-xl shadow-xs self-stretch sm:self-auto bg-[#05A222] hover:bg-[#006736] text-white"
          >
            Save Engine Policies
          </Button>
        </div>

        {savedSuccess && (
          <div className="p-4 bg-[#E9F9EE] border border-[#C4EBD0] rounded-2xl text-xs sm:text-sm text-[#006736] font-bold flex items-center gap-2.5 shadow-xs animate-in fade-in duration-200">
            <CheckCircle2 className="w-4.5 h-4.5 shrink-0 text-[#05A222]" />
            <span>AI Engine routing policies and API keys have been saved successfully!</span>
          </div>
        )}

        {/* Info Banner */}
        <div className="p-4 bg-[#E9F9EE]/60 border border-[#C4EBD0] rounded-2xl text-xs sm:text-sm text-[#006736] flex items-center gap-3 font-medium shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-white text-[#05A222] flex items-center justify-center shrink-0 border border-[#C4EBD0]">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold">Bring Your Own Key (BYOK) Mode:</span> You can use your direct vendor accounts
            for dedicated rate limits and cost optimization.
          </div>
        </div>

        {/* Vendor API Keys Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#5F7069]">
            1. LLM Vendor API Credentials
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#F6FAF8] border border-[#E2EAE6] space-y-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#05A222]" />
                <span className="text-xs font-bold text-[#14201C]">OpenAI Platform</span>
              </div>
              <Input
                label="API Key (GPT-4o / GPT-4o-mini)"
                type="password"
                value={openAiKey}
                onChange={(e) => setOpenAiKey(e.target.value)}
                placeholder="sk-proj-..."
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#F6FAF8] border border-[#E2EAE6] space-y-2.5">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#2563EB]" />
                <span className="text-xs font-bold text-[#14201C]">Google Gemini</span>
              </div>
              <Input
                label="API Key (Gemini 1.5 Flash/Pro)"
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#F6FAF8] border border-[#E2EAE6] space-y-2.5">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#7C3AED]" />
                <span className="text-xs font-bold text-[#14201C]">Anthropic Claude</span>
              </div>
              <Input
                label="API Key (Claude 3.5 Sonnet)"
                type="password"
                value={anthropicKey}
                onChange={(e) => setAnthropicKey(e.target.value)}
                placeholder="sk-ant-..."
              />
            </div>
          </div>
        </div>

        {/* Token & Model Policies Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#5F7069]">
            2. Inference Engine & Token Limits
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#14201C]">Default Inference Model</label>
              <select
                value={defaultModel}
                onChange={(e) => setDefaultModel(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E2EAE6] bg-[#F6FAF8] text-xs font-bold text-[#14201C] focus:outline-none focus:border-[#05A222] focus:bg-white transition-colors"
              >
                <option value="gpt-4o-mini">OpenAI GPT-4o-mini (Recommended - Fast)</option>
                <option value="gpt-4o">OpenAI GPT-4o (High Precision)</option>
                <option value="gemini-1.5-flash">Google Gemini 1.5 Flash</option>
                <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet</option>
              </select>
            </div>

            <Input
              label="Max Output Tokens (Optimal: 200-500)"
              type="number"
              value={maxTokens}
              onChange={(e) => setMaxTokens(e.target.value)}
            />

            <Input
              label="Temperature (0.0 = Deterministic, 1.0 = Creative)"
              type="number"
              step="0.1"
              min="0"
              max="1"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
            />
          </div>
        </div>

        {/* Escalation & Auto-Handoff Policy Box */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#5F7069]">
            3. Autonomous Escalation Rules
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#F6FAF8] rounded-2xl border border-[#E2EAE6]">
            <div className="space-y-1">
              <div className="text-xs sm:text-sm font-bold text-[#14201C] flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#05A222]" />
                <span>Automatic Human Escalation & Agent Pausing</span>
              </div>
              <p className="text-xs text-[#5F7069] max-w-xl font-medium leading-relaxed">
                Automatically pauses AI auto-responses when a conversation is assigned to a human agent or when handoff keywords are detected.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={autoHandoff}
                onChange={(e) => setAutoHandoff(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#E2EAE6] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#E2EAE6] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#05A222]"></div>
            </label>
          </div>
        </div>

        {/* Save Button Bar */}
        <div className="pt-4 border-t border-[#E2EAE6] flex justify-end">
          <Button
            size="lg"
            variant="primary"
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
            className="w-full sm:w-auto font-bold text-sm px-8 rounded-xl shadow-xs bg-[#05A222] hover:bg-[#006736] text-white cursor-pointer"
          >
            Save Global AI Policies
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};
