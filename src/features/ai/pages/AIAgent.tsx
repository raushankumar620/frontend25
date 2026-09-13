import React, { useState } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { ArrowLeft, Bot, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const AIAgent: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('Sales & Lead Qualifier AI');
  const [role, setRole] = useState('Greet incoming leads, ask qualifying questions, and recommend plans.');
  const [model, setModel] = useState<'gpt-4o' | 'claude-3-5-sonnet' | 'gemini-1-5-pro'>('gpt-4o');
  const [prompt, setPrompt] = useState(
    'You are the official WhatsApp assistant for Acme Global. Always remain professional, concise, and helpful. Use emojis moderately.'
  );
  const [temperature, setTemperature] = useState(0.3);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      navigate(ROUTES.AI_DASHBOARD);
    }, 600);
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
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI Agent Configuration</h2>
            <p className="text-xs text-slate-500">Fine-tune system instructions, models, and temperature.</p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Agent Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Role & Objective Description"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Underlying LLM Engine
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'gpt-4o', label: 'GPT-4o (OpenAI)' },
                { id: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet' },
                { id: 'gemini-1-5-pro', label: 'Gemini 1.5 Pro' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModel(m.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                    model === m.id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              System Instruction & Persona Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <span>Creativity & Temperature</span>
              <span className="font-mono text-indigo-500">{temperature}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <Button
            size="lg"
            className="w-full mt-4"
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save AI Agent Settings
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};
