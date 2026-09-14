import React, { useState } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { ArrowLeft, Save, Sliders, Shield, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const AISettings: React.FC = () => {
  const navigate = useNavigate();
  const [openAiKey, setOpenAiKey] = useState('sk-proj-••••••••••••••••••••••••');
  const [geminiKey, setGeminiKey] = useState('AIzaSy••••••••••••••••••••••••');
  const [anthropicKey, setAnthropicKey] = useState('sk-ant-••••••••••••••••••••••••');
  const [autoHandoff, setAutoHandoff] = useState(true);
  const [maxTokens, setMaxTokens] = useState('350');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      navigate(ROUTES.AI_DASHBOARD);
    }, 500);
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

      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#E9F9EE] dark:bg-[#006736]/20 text-[#006736] dark:text-[#05A222] flex items-center justify-center font-bold">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI Engine & Routing Policies</h2>
            <p className="text-xs text-slate-500">Manage LLM vendor API keys, token limits, and handoff rules.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-3.5 bg-[#E9F9EE] dark:bg-[#006736]/20 border border-[#C4EBD0] dark:border-[#006736]/30 rounded-xl text-xs text-[#006736] dark:text-[#05A222] flex items-center gap-2 font-medium">
            <Key className="w-4 h-4 shrink-0" />
            <span>Bring Your Own Key (BYOK) allows you to use your own LLM rate limits and pricing.</span>
          </div>

          <Input
            label="OpenAI API Key (GPT-4o / GPT-4o-mini)"
            type="password"
            value={openAiKey}
            onChange={(e) => setOpenAiKey(e.target.value)}
          />

          <Input
            label="Google Gemini API Key (Gemini 1.5 Flash / Pro)"
            type="password"
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
          />

          <Input
            label="Anthropic Claude API Key"
            type="password"
            value={anthropicKey}
            onChange={(e) => setAnthropicKey(e.target.value)}
          />

          <Input
            label="Global Max Tokens Per Response (Optimal: 200-500)"
            type="number"
            value={maxTokens}
            onChange={(e) => setMaxTokens(e.target.value)}
          />

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#05A222]" />
                <span>Automatic Human Escalation & Auto-Routing</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Automatically pauses the AI agent when a human agent takes over or when trigger keywords are matched.
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoHandoff}
              onChange={(e) => setAutoHandoff(e.target.checked)}
              className="w-4 h-4 accent-[#05A222] rounded cursor-pointer"
            />
          </div>

          <Button
            size="lg"
            className="w-full mt-4 bg-[#05A222] hover:bg-[#006736] text-[#14201C] hover:text-white font-bold"
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Global Settings
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};
