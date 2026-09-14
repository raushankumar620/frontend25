import React, { useState } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import {
  ArrowLeft,
  Smartphone,
  Plus,
  Trash2,
  Send,
  AlertCircle,
  Info,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Layers
} from 'lucide-react';
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
    '1': 'Alex Johnson',
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
    const matches: string[] = body.match(/\{\{(\d+)\}\}/g) || [];
    const maxIdx = matches.reduce<number>((max, m) => {
      const num = parseInt(m.replace(/[{}]/g, ''), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    const nextIdx = maxIdx + 1;
    setBody((prev) => `${prev} {{${nextIdx}}}`);
    setSampleVars((prev) => ({ ...prev, [String(nextIdx)]: `Value ${nextIdx}` }));
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
      {/* Back button */}
      <button
        onClick={() => navigate(ROUTES.TEMPLATES)}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#5F7069] hover:text-[#14201C] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Templates</span>
      </button>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold flex items-center gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Builder Form Card */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-7 rounded-2xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-6">
          <div className="border-b border-[#E2EAE6] pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#05A222] uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>WhatsApp HSM Builder</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#14201C] tracking-tight">
              Create WhatsApp Template
            </h2>
            <p className="text-xs sm:text-sm text-[#5F7069] mt-1 font-medium">
              Submit your HSM message template to Meta WhatsApp Cloud API for automated compliance checks and instant approval.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Template Name */}
            <div>
              <label className="block text-xs font-bold text-[#14201C] uppercase tracking-wider mb-1.5">
                Template Name (Internal Identifier)
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                placeholder="e.g. order_shipment_notification_v1"
                required
              />
              <p className="text-[11px] text-[#5F7069] mt-1.5 font-medium flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-[#05A222]" /> Meta requires lowercase alphanumeric and underscore characters only.
              </p>
            </div>

            {/* Category & Language Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#14201C] uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['MARKETING', 'UTILITY', 'AUTHENTICATION'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-black border transition-all ${
                        category === cat
                          ? 'border-[#05A222] bg-[#E9F9EE] text-[#006736] shadow-xs'
                          : 'border-[#E2EAE6] bg-white text-[#14201C] hover:bg-[#F6FAF8]'
                      }`}
                    >
                      {cat.slice(0, 4)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14201C] uppercase tracking-wider mb-1.5">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-xl border border-[#E2EAE6] bg-white text-[#14201C] text-xs p-2.5 font-bold focus:border-[#05A222] focus:outline-none"
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
            <div className="border-t border-[#E2EAE6] pt-4">
              <label className="block text-xs font-bold text-[#14201C] uppercase tracking-wider mb-2">
                Header Type (Optional)
              </label>
              <div className="flex gap-2 mb-3">
                {(['NONE', 'TEXT'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setHeaderType(type)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      headerType === type
                        ? 'border-[#05A222] bg-[#E9F9EE] text-[#006736]'
                        : 'border-[#E2EAE6] bg-white text-[#14201C] hover:bg-[#F6FAF8]'
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

            {/* Message Body */}
            <div className="border-t border-[#E2EAE6] pt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-[#14201C] uppercase tracking-wider">
                  Message Body
                </label>
                <button
                  type="button"
                  onClick={insertVariable}
                  className="text-xs font-bold text-[#006736] hover:text-[#05A222] flex items-center gap-1.5 bg-[#E9F9EE] border border-[#C4EBD0] px-2.5 py-1 rounded-xl transition-colors shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#05A222]" /> + Add Variable
                </button>
              </div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                className="w-full rounded-xl border border-[#E2EAE6] bg-white text-[#14201C] text-xs p-3.5 focus:border-[#05A222] focus:outline-none font-sans leading-relaxed shadow-xs"
                required
              />
              <p className="text-[11px] text-[#5F7069] mt-1.5 font-medium">
                Insert dynamic variables like <code className="text-[#006736] bg-[#E9F9EE] px-1 py-0.5 rounded-md font-mono font-bold">&#123;&#123;1&#125;&#125;</code>, <code className="text-[#006736] bg-[#E9F9EE] px-1 py-0.5 rounded-md font-mono font-bold">&#123;&#123;2&#125;&#125;</code> for personalization.
              </p>
            </div>

            {/* Footer */}
            <div className="border-t border-[#E2EAE6] pt-4">
              <label className="block text-xs font-bold text-[#14201C] uppercase tracking-wider mb-1.5">
                Footer Note (Optional)
              </label>
              <Input
                value={footer}
                onChange={(e) => setFooter(e.target.value)}
                placeholder="e.g. Reply STOP to opt out"
                maxLength={60}
              />
            </div>

            {/* Interactive Buttons Config */}
            <div className="border-t border-[#E2EAE6] pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#14201C] uppercase tracking-wider">
                  Interactive Action Buttons ({buttons.length}/3)
                </label>
                {buttons.length < 3 && (
                  <button
                    type="button"
                    onClick={handleAddButton}
                    className="text-xs text-[#006736] hover:text-[#05A222] flex items-center gap-1 font-bold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#05A222]" /> Add Button
                  </button>
                )}
              </div>

              {buttons.map((btn, idx) => (
                <div key={idx} className="p-3.5 bg-[#F6FAF8] rounded-xl border border-[#E2EAE6] space-y-2.5">
                  <div className="flex items-center gap-2">
                    <select
                      value={btn.type}
                      onChange={(e) => {
                        const next = [...buttons];
                        next[idx].type = e.target.value as any;
                        setButtons(next);
                      }}
                      className="rounded-xl border border-[#E2EAE6] bg-white text-[#14201C] text-xs p-2 font-bold focus:border-[#05A222] focus:outline-none"
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
                      className="flex-1 rounded-xl border border-[#E2EAE6] bg-white text-[#14201C] text-xs p-2 font-semibold focus:border-[#05A222] focus:outline-none"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveButton(idx)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
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
                      className="w-full rounded-xl border border-[#E2EAE6] bg-white text-[#14201C] text-xs p-2 focus:border-[#05A222] focus:outline-none"
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
                      className="w-full rounded-xl border border-[#E2EAE6] bg-white text-[#14201C] text-xs p-2 focus:border-[#05A222] focus:outline-none"
                      required
                    />
                  )}
                </div>
              ))}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-6 bg-[#05A222] hover:bg-[#006736] text-white font-bold py-3.5 rounded-xl shadow-xs"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Submit Template to Meta for Instant Approval
            </Button>
          </form>
        </div>

        {/* Right Smartphone Device Mockup */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-6">
          <div className="text-xs font-bold text-[#5F7069] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#05A222]" />
            <span>Live WhatsApp Rendering Preview</span>
          </div>

          {/* Smartphone Chassis */}
          <div className="w-full max-w-[340px] bg-[#14201C] rounded-[44px] p-3.5 shadow-[0_20px_60px_rgba(1,59,35,0.18)] border-4 border-[#1F2A26]">
            {/* Top Speaker & Camera Island */}
            <div className="w-24 h-4 bg-[#14201C] mx-auto rounded-b-xl mb-2 flex items-center justify-center">
              <div className="w-10 h-1 bg-[#2D3A35] rounded-full" />
            </div>

            {/* Smartphone Screen */}
            <div className="bg-[#E5DDD5] rounded-[34px] p-3.5 min-h-[460px] flex flex-col justify-between overflow-hidden relative">
              {/* WhatsApp App Bar */}
              <div className="bg-[#006736] text-white py-2 px-3 rounded-2xl flex items-center gap-2.5 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#05A222] flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-xs">
                  W
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-black truncate flex items-center gap-1">
                    <span>Acme Official Store</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#6AEB31] shrink-0" />
                  </div>
                  <div className="text-[10px] text-[#C4EBD0] font-medium">Verified WhatsApp Business</div>
                </div>
              </div>

              {/* Message Bubble Preview */}
              <div className="my-auto py-3 space-y-2">
                <div className="bg-white rounded-2xl rounded-tl-xs p-3.5 shadow-sm space-y-1.5 text-xs text-[#14201C]">
                  {headerType === 'TEXT' && headerText && (
                    <div className="font-bold text-[#006736] border-b border-[#E2EAE6] pb-1">
                      {headerText}
                    </div>
                  )}
                  <div className="text-[#1F2A26] whitespace-pre-wrap leading-relaxed font-sans text-xs">
                    {previewBody}
                  </div>
                  {footer && (
                    <div className="text-[10px] text-[#8A9993] pt-1 border-t border-[#F6FAF8]">
                      {footer}
                    </div>
                  )}
                  <div className="text-[9px] text-right text-[#8A9993] font-medium flex items-center justify-end gap-1">
                    <span>12:45 PM</span>
                    <CheckCircle2 className="w-3 h-3 text-[#05A222]" />
                  </div>
                </div>

                {/* Interactive Action Buttons Preview */}
                {buttons.length > 0 && (
                  <div className="space-y-1.5">
                    {buttons.map((btn, idx) => (
                      <div
                        key={idx}
                        className="bg-white py-2 px-3 text-center text-xs font-bold text-[#05A222] rounded-xl shadow-xs border border-[#C4EBD0] flex items-center justify-center gap-1.5"
                      >
                        <span>{btn.text || 'Button Action'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Variable test inputs in preview */}
              {foundVars.length > 0 && (
                <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-2.5 border border-[#E2EAE6] space-y-1.5 shadow-xs">
                  <div className="text-[10px] font-bold text-[#5F7069] uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#05A222]" />
                    <span>Test Variable Values</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {foundVars.map((v) => (
                      <input
                        key={v}
                        type="text"
                        placeholder={`{{${v}}}`}
                        value={sampleVars[v] || ''}
                        onChange={(e) => setSampleVars({ ...sampleVars, [v]: e.target.value })}
                        className="text-[10px] p-1.5 rounded-lg border border-[#E2EAE6] bg-white text-[#14201C] font-semibold"
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
