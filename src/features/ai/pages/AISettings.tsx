import React, { useState } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { ArrowLeft, Save, Sliders, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const AISettings: React.FC = () => {
  const navigate = useNavigate();
  const [openAiKey, setOpenAiKey] = useState('sk-proj-••••••••••••••••••••••••');
  const [anthropicKey, setAnthropicKey] = useState('sk-ant-••••••••••••••••••••••••');
  const [autoHandoff, setAutoHandoff] = useState(true);
  const [maxTokens, setMaxTokens] = useState('250');
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
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to AI Hub</span>
      </button>

      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-500 flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI Engine Global Settings</h2>
            <p className="text-xs text-slate-500">Manage LLM vendor API keys, token throttling, and safety policies.</p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="OpenAI API Key (BYOK - Bring Your Own Key)"
            type="password"
            value={openAiKey}
            onChange={(e) => setOpenAiKey(e.target.value)}
          />

          <Input
            label="Anthropic Claude API Key"
            type="password"
            value={anthropicKey}
            onChange={(e) => setAnthropicKey(e.target.value)}
          />

          <Input
            label="Max Tokens Per Message (WhatsApp Optimal: 150-300)"
            type="number"
            value={maxTokens}
            onChange={(e) => setMaxTokens(e.target.value)}
          />

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Automatic Human Escalation</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Automatically unassign bot if user displays frustration or asks for an agent.
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoHandoff}
              onChange={(e) => setAutoHandoff(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

          <Button
            size="lg"
            className="w-full mt-4"
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
