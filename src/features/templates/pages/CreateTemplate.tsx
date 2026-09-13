import React, { useState } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { ArrowLeft, Smartphone, Plus, Trash2, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { templatesApi } from '../api';

export const CreateTemplate: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'MARKETING' | 'UTILITY' | 'AUTHENTICATION'>('MARKETING');
  const [headerText, setHeaderText] = useState('');
  const [body, setBody] = useState('Hi {{1}}, your order #{{2}} is confirmed! We will notify you when it ships.');
  const [footer, setFooter] = useState('Acme Global Inc • Reply STOP to unsubscribe');
  const [buttons, setButtons] = useState([{ type: 'QUICK_REPLY', text: 'Track Order' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddButton = () => {
    if (buttons.length < 3) {
      setButtons([...buttons, { type: 'QUICK_REPLY', text: 'New Button' }]);
    }
  };

  const handleRemoveButton = (index: number) => {
    setButtons(buttons.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await templatesApi.createTemplate({
        name: name.toLowerCase().replace(/\s+/g, '_'),
        category,
        language: 'en_US',
        header: headerText ? { type: 'TEXT', text: headerText } : undefined,
        body,
        footer,
        buttons: buttons as any,
      });
      navigate(ROUTES.TEMPLATES);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Live preview replacement for {{1}} and {{2}}
  const previewBody = body
    .replace(/\{\{1\}\}/g, 'Alex')
    .replace(/\{\{2\}\}/g, '98231');

  return (
    <PageContainer>
      <button
        onClick={() => navigate(ROUTES.TEMPLATES)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Templates</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Builder Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create WhatsApp Template</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Submit a new template to Meta for instant AI validation and approval.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Template Name (Internal Identifier)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. spring_promo_2025"
              required
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['MARKETING', 'UTILITY', 'AUTHENTICATION'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      category === cat
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Header (Optional)"
              value={headerText}
              onChange={(e) => setHeaderText(e.target.value)}
              placeholder="e.g. Special Announcement"
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Message Body (Supports variables like &#123;&#123;1&#125;&#125;, &#123;&#123;2&#125;&#125;)
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <Input
              label="Footer Disclaimer (Optional)"
              value={footer}
              onChange={(e) => setFooter(e.target.value)}
              placeholder="e.g. Reply STOP to opt out"
            />

            {/* Interactive Buttons Config */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Buttons (Max 3)
                </label>
                {buttons.length < 3 && (
                  <button
                    type="button"
                    onClick={handleAddButton}
                    className="text-xs text-emerald-500 hover:text-emerald-600 flex items-center gap-1 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Button
                  </button>
                )}
              </div>

              {buttons.map((btn, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    value={btn.text}
                    onChange={(e) => {
                      const next = [...buttons];
                      next[idx].text = e.target.value;
                      setButtons(next);
                    }}
                    placeholder={`Button ${idx + 1} text`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveButton(idx)}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-4"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Submit to Meta for Approval
            </Button>
          </form>
        </div>

        {/* Right Live WhatsApp Smartphone Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-emerald-500" />
            Live WhatsApp Message Preview
          </div>

          <div className="w-full max-w-[340px] bg-slate-900 rounded-[36px] p-3 shadow-2xl border-4 border-slate-700">
            {/* Phone Screen */}
            <div className="bg-[#e5ddd5] dark:bg-[#0b141a] rounded-[28px] p-4 min-h-[460px] flex flex-col justify-end text-slate-900 dark:text-slate-100">
              {/* WhatsApp Bubble Preview */}
              <div className="bg-white dark:bg-[#202c33] rounded-2xl rounded-tl-xs p-3.5 shadow-md space-y-2 text-xs">
                {headerText && (
                  <div className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-1">
                    {headerText}
                  </div>
                )}
                <div className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {previewBody}
                </div>
                {footer && (
                  <div className="text-[10px] text-slate-400 pt-1">
                    {footer}
                  </div>
                )}
                <div className="text-[9px] text-right text-slate-400">12:00 PM</div>
              </div>

              {/* Action Buttons Preview */}
              {buttons.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {buttons.map((btn, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-[#202c33] py-2 text-center text-xs font-semibold text-[#00a884] rounded-xl shadow-xs"
                    >
                      {btn.text || 'Button'}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
