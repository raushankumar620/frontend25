import React, { useState } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { ArrowLeft, Smartphone, Plus, Trash2, Send, AlertCircle, Info, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { templatesApi } from '../api';

export const CreateTemplate: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'MARKETING' | 'UTILITY' | 'AUTHENTICATION'>('MARKETING');
  const [language, setLanguage] = useState('en_US');
  const [headerType, setHeaderType] = useState<'NONE' | 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT'>('NONE');
  const [headerText, setHeaderText] = useState('');
  const [body, setBody] = useState('Hello {{1}}, your order #{{2}} has been confirmed and is scheduled for delivery on {{3}}!');
  const [footer, setFooter] = useState('Reply STOP to unsubscribe from automated notifications.');
  const [buttons, setButtons] = useState<Array<{ type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER'; text: string; url?: string; phoneNumber?: string }>>([
    { type: 'QUICK_REPLY', text: 'Track Order' },
  ]);
  const [sampleVars, setSampleVars] = useState<{ [key: string]: string }>({
    '1': 'Alex',
    '2': 'ORD-98231',
    '3': 'Friday afternoon',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddButton = () => {
    if (buttons.length < 3) {
      setButtons([...buttons, { type: 'QUICK_REPLY', text: 'Action Button' }]);
    }
  };

  const handleRemoveButton = (index: number) => {
    setButtons(buttons.filter((_, i) => i !== index));
  };

  const insertVariable = () => {
    // Detect next variable index
    const matches: string[] = body.match(/\{\{(\d+)\}\}/g) || [];
    const maxIdx = matches.reduce<number>((max, m) => {
      const num = parseInt(m.replace(/[{}]/g, ''), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    const nextIdx = maxIdx + 1;
    setBody((prev) => `${prev} {{${nextIdx}}}`);
    setSampleVars((prev) => ({ ...prev, [String(nextIdx)]: `Sample ${nextIdx}` }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const sanitizedName = name.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
      if (!sanitizedName) {
        throw new Error('Template name is required and must contain alphanumeric characters.');
      }

      await templatesApi.createTemplate({
        name: sanitizedName,
        category,
        language,
        header: headerType === 'TEXT' && headerText.trim() ? { type: 'TEXT', text: headerText.trim() } : undefined,
        body: body.trim(),
        footer: footer.trim() || undefined,
        buttons: buttons.length > 0 ? buttons : undefined,
      });

      navigate(ROUTES.TEMPLATES);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit template to Meta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render preview body with dynamic sample variable replacements
  const previewBody = body.replace(/\{\{(\d+)\}\}/g, (_, num) => {
    return sampleVars[num] || `[Variable {{${num}}}]`;
  });

  // Extract all present variable numbers from body
  const foundVars = Array.from(new Set(Array.from(body.matchAll(/\{\{(\d+)\}\}/g), (m) => m[1])));

  return (
    <PageContainer>
      <button
        onClick={() => navigate(ROUTES.TEMPLATES)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Templates</span>
      </button>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Builder Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Create WhatsApp Template</h2>
            <p className="text-xs text-slate-500 mt-1">
              Submit your HSM template to Meta WhatsApp Cloud API for automated compliance checks and instant approval.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Input
                label="Template Name"
                value={name}
                onChange={(e) => setName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                placeholder="e.g. order_shipment_notification_v1"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <Info className="w-3 h-3" /> Meta requires lowercase alphanumeric and underscore characters only.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['MARKETING', 'UTILITY', 'AUTHENTICATION'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all ${
                        category === cat
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-300 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {cat.slice(0, 4)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs p-2.5 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="en_US">English (US) - en_US</option>
                  <option value="en_GB">English (UK) - en_GB</option>
                  <option value="hi_IN">Hindi (India) - hi_IN</option>
                  <option value="es_ES">Spanish - es_ES</option>
                  <option value="pt_BR">Portuguese (BR) - pt_BR</option>
                  <option value="fr_FR">French - fr_FR</option>
                  <option value="de_DE">German - de_DE</option>
                  <option value="ar">Arabic - ar</option>
                </select>
              </div>
            </div>

            {/* Header Configuration */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase">
                Header Type (Optional)
              </label>
              <div className="flex gap-2 mb-3">
                {(['NONE', 'TEXT'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setHeaderType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      headerType === type
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {headerType === 'TEXT' && (
                <Input
                  value={headerText}
                  onChange={(e) => setHeaderText(e.target.value)}
                  placeholder="e.g. Order Confirmation"
                  maxLength={60}
                />
              )}
            </div>

            {/* Body */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  Message Body
                </label>
                <button
                  type="button"
                  onClick={insertVariable}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 rounded-lg"
                >
                  <Sparkles className="w-3.5 h-3.5" /> + Add Variable
                </button>
              </div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs p-3.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-sans leading-relaxed"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Insert variables like <code className="text-emerald-600 dark:text-emerald-400 font-mono">&#123;&#123;1&#125;&#125;</code>, <code className="text-emerald-600 dark:text-emerald-400 font-mono">&#123;&#123;2&#125;&#125;</code> for personalization.
              </p>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <Input
                label="Footer Note (Optional)"
                value={footer}
                onChange={(e) => setFooter(e.target.value)}
                placeholder="e.g. Reply STOP to opt out"
                maxLength={60}
              />
            </div>

            {/* Interactive Buttons Config */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  Interactive Buttons ({buttons.length}/3)
                </label>
                {buttons.length < 3 && (
                  <button
                    type="button"
                    onClick={handleAddButton}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Button
                  </button>
                )}
              </div>

              {buttons.map((btn, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-2">
                    <select
                      value={btn.type}
                      onChange={(e) => {
                        const next = [...buttons];
                        next[idx].type = e.target.value as any;
                        setButtons(next);
                      }}
                      className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs p-2 font-semibold"
                    >
                      <option value="QUICK_REPLY">Quick Reply</option>
                      <option value="URL">Visit Website</option>
                      <option value="PHONE_NUMBER">Call Phone Number</option>
                    </select>

                    <input
                      type="text"
                      value={btn.text}
                      onChange={(e) => {
                        const next = [...buttons];
                        next[idx].text = e.target.value;
                        setButtons(next);
                      }}
                      placeholder="Button Label"
                      className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs p-2"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveButton(idx)}
                      className="p-2 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {btn.type === 'URL' && (
                    <input
                      type="url"
                      value={btn.url || ''}
                      onChange={(e) => {
                        const next = [...buttons];
                        next[idx].url = e.target.value;
                        setButtons(next);
                      }}
                      placeholder="https://example.com/track"
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs p-2"
                      required
                    />
                  )}

                  {btn.type === 'PHONE_NUMBER' && (
                    <input
                      type="tel"
                      value={btn.phoneNumber || ''}
                      onChange={(e) => {
                        const next = [...buttons];
                        next[idx].phoneNumber = e.target.value;
                        setButtons(next);
                      }}
                      placeholder="+15551234567"
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs p-2"
                      required
                    />
                  )}
                </div>
              ))}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Submit Template to Meta
            </Button>
          </form>
        </div>

        {/* Right Live WhatsApp Smartphone Preview */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-6">
          <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-emerald-500" />
            Live WhatsApp Message Preview
          </div>

          <div className="w-full max-w-[340px] bg-slate-900 rounded-[38px] p-3 shadow-2xl border-4 border-slate-700">
            {/* Phone Screen */}
            <div className="bg-[#e5ddd5] dark:bg-[#0b141a] rounded-[30px] p-4 min-h-[480px] flex flex-col justify-between text-slate-900 dark:text-slate-100">
              {/* Top Chat Bar */}
              <div className="bg-white/80 dark:bg-[#202c33]/90 backdrop-blur-xs py-2 px-3 rounded-xl flex items-center gap-2 mb-3 shadow-xs">
                <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                  W
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">WhatsApp Business</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Official Business Account</div>
                </div>
              </div>

              {/* Message bubble & buttons */}
              <div>
                <div className="bg-white dark:bg-[#202c33] rounded-2xl rounded-tl-xs p-3.5 shadow-md space-y-2 text-xs">
                  {headerType === 'TEXT' && headerText && (
                    <div className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-1.5">
                      {headerText}
                    </div>
                  )}
                  <div className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {previewBody}
                  </div>
                  {footer && (
                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-50 dark:border-slate-800/60">
                      {footer}
                    </div>
                  )}
                  <div className="text-[9px] text-right text-slate-400 font-medium">12:30 PM</div>
                </div>

                {/* Interactive Action Buttons Preview */}
                {buttons.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {buttons.map((btn, idx) => (
                      <div
                        key={idx}
                        className="bg-white dark:bg-[#202c33] py-2 text-center text-xs font-bold text-[#00a884] rounded-xl shadow-xs border border-emerald-50 dark:border-emerald-950"
                      >
                        {btn.text || 'Button Action'}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Variable test controls below preview */}
              {foundVars.length > 0 && (
                <div className="mt-4 p-2.5 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xs rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">
                    Test Variable Values:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {foundVars.map((v) => (
                      <input
                        key={v}
                        type="text"
                        placeholder={`{{${v}}}`}
                        value={sampleVars[v] || ''}
                        onChange={(e) => setSampleVars({ ...sampleVars, [v]: e.target.value })}
                        className="text-[11px] p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
