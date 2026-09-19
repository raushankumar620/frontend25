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
  CheckCheck,
  ChevronLeft,
  Phone,
  Video,
  Layers,
  Wifi,
  CornerUpLeft,
  PhoneCall,
  ExternalLink,
  Copy,
  ShieldAlert,
  Headphones,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { templatesApi } from '../api';

export const CreateTemplate: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('draftId') || searchParams.get('id');

  const [name, setName] = useState('');
  const [category, setCategory] = useState<'MARKETING' | 'UTILITY' | 'AUTHENTICATION'>('MARKETING');
  const [language, setLanguage] = useState('en_US');
  const [headerType, setHeaderType] = useState<'NONE' | 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT'>('NONE');
  const [headerText, setHeaderText] = useState('');
  const [body, setBody] = useState('Hello {{1}}, your order #{{2}} has been confirmed and is scheduled for delivery on {{3}}!');
  const [footer, setFooter] = useState('Reply STOP to unsubscribe from automated notifications.');
  type ButtonType = 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER' | 'COPY_CODE' | 'OPT_OUT' | 'SUPPORT';
  interface ActionButton {
    type: ButtonType;
    text: string;
    url?: string;
    phoneNumber?: string;
    code?: string;
  }

  const [buttons, setButtons] = useState<ActionButton[]>([
    { type: 'QUICK_REPLY', text: 'Track Order' },
  ]);
  const [sampleVars, setSampleVars] = useState<{ [key: string]: string }>({
    '1': 'Alex Johnson',
    '2': 'ORD-98231',
    '3': 'Friday afternoon',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftSavedSuccess, setDraftSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load existing draft if draftId is present
  React.useEffect(() => {
    if (draftId) {
      templatesApi.getTemplateById(draftId).then((data) => {
        if (data) {
          setName(data.name || '');
          setCategory(data.category || 'MARKETING');
          setLanguage(data.language || 'en_US');
          if (data.header) {
            setHeaderType((data.header.type as any) || 'NONE');
            setHeaderText(data.header.text || '');
          }
          if (data.body) setBody(data.body);
          if (data.footer) setFooter(data.footer);
          if (data.buttons && data.buttons.length > 0) {
            setButtons(
              data.buttons.map((b: any) => ({
                type: b.type,
                text: b.text || 'Button',
                url: b.url,
                phoneNumber: b.phoneNumber || b.phone_number,
                code: b.code || (b.example && b.example[0]),
              }))
            );
          }
        }
      }).catch((err) => {
        console.error('Failed to load draft:', err);
      });
    }
  }, [draftId]);

  const handleAddButton = (type: ButtonType = 'QUICK_REPLY') => {
    if (buttons.length < 3) {
      let defaultText = 'Quick Reply';
      let defaultUrl: string | undefined = undefined;
      let defaultPhone: string | undefined = undefined;
      let defaultCode: string | undefined = undefined;

      switch (type) {
        case 'QUICK_REPLY':
          defaultText = 'Track Order';
          break;
        case 'URL':
          defaultText = 'Visit Website';
          defaultUrl = 'https://example.com/track';
          break;
        case 'PHONE_NUMBER':
          defaultText = 'Call Support';
          defaultPhone = '+15551234567';
          break;
        case 'COPY_CODE':
          defaultText = 'Copy Offer Code';
          defaultCode = 'SAVE20';
          break;
        case 'OPT_OUT':
          defaultText = 'Stop Promotions';
          break;
        case 'SUPPORT':
          defaultText = 'Talk to Agent';
          break;
      }

      setButtons([
        ...buttons,
        {
          type,
          text: defaultText,
          url: defaultUrl,
          phoneNumber: defaultPhone,
          code: defaultCode,
        },
      ]);
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

  const handleSaveDraft = async () => {
    setErrorMessage(null);
    setDraftSavedSuccess(false);
    setIsSavingDraft(true);

    try {
      const sanitizedName = name.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_') || `draft_template_${Date.now().toString().slice(-5)}`;

      await templatesApi.createTemplate({
        name: sanitizedName,
        category,
        language,
        header: headerType === 'TEXT' && headerText.trim() ? { type: 'TEXT', text: headerText.trim() } : undefined,
        body: body.trim() || 'Draft template message body',
        footer: footer.trim() || undefined,
        buttons: buttons.length > 0 ? buttons.map(b => ({
          type: (b.type === 'OPT_OUT' || b.type === 'SUPPORT') ? 'QUICK_REPLY' : (b.type as any),
          text: b.text.trim() || 'Button',
          url: b.type === 'URL' ? b.url?.trim() : undefined,
          phoneNumber: b.type === 'PHONE_NUMBER' ? b.phoneNumber?.trim() : undefined,
          code: b.type === 'COPY_CODE' ? b.code?.trim() : undefined,
          example: b.type === 'COPY_CODE' && b.code ? [b.code.trim()] : undefined,
        })) : undefined,
        isDraft: true,
        status: 'DRAFT',
      });

      setName(sanitizedName);
      setDraftSavedSuccess(true);
      setTimeout(() => setDraftSavedSuccess(false), 6000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save template as draft.');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setDraftSavedSuccess(false);
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
        buttons: buttons.length > 0 ? buttons.map(b => ({
          type: (b.type === 'OPT_OUT' || b.type === 'SUPPORT') ? 'QUICK_REPLY' : (b.type as any),
          text: b.text.trim(),
          url: b.type === 'URL' ? b.url?.trim() : undefined,
          phoneNumber: b.type === 'PHONE_NUMBER' ? b.phoneNumber?.trim() : undefined,
          code: b.type === 'COPY_CODE' ? b.code?.trim() : undefined,
          example: b.type === 'COPY_CODE' && b.code ? [b.code.trim()] : undefined,
        })) : undefined,
        isDraft: false,
        status: 'PENDING',
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

      {draftSavedSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] text-[#006736] text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#05A222] shrink-0" />
            <span>Template draft saved successfully! You can find it under the Drafts filter on the Templates page.</span>
          </div>
          <button
            onClick={() => navigate(ROUTES.TEMPLATES)}
            className="text-xs font-bold underline hover:text-[#05A222] ml-4 shrink-0"
          >
            View Drafts →
          </button>
        </div>
      )}

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
              <label className="block text-xs sm:text-[13px] font-bold text-[#14201C] mb-1.5">
                Template Name <span className="text-[#5F7069] font-normal">(Internal Identifier)</span>
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                placeholder="e.g. order_shipment_notification_v1"
                className="text-sm font-medium"
                required
              />
              <p className="text-xs text-[#5F7069] mt-1.5 font-medium flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-[#05A222] shrink-0" /> Meta requires lowercase alphanumeric and underscore characters only.
              </p>
            </div>

            {/* Category, Language & Header Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-[#14201C] mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as 'MARKETING' | 'UTILITY' | 'AUTHENTICATION')}
                  className="w-full rounded-xl border border-[#E2EAE6] bg-white text-[#14201C] text-sm p-2.5 font-semibold focus:border-[#05A222] focus:outline-none"
                >
                  <option value="MARKETING">Marketing</option>
                  <option value="UTILITY">Utility</option>
                  <option value="AUTHENTICATION">Authentication</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-[#14201C] mb-1.5">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-xl border border-[#E2EAE6] bg-white text-[#14201C] text-sm p-2.5 font-semibold focus:border-[#05A222] focus:outline-none"
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

              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-[#14201C] mb-1.5">
                  Header Type <span className="text-[#5F7069] font-normal">(Optional)</span>
                </label>
                <select
                  value={headerType}
                  onChange={(e) => setHeaderType(e.target.value as 'NONE' | 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT')}
                  className="w-full rounded-xl border border-[#E2EAE6] bg-white text-[#14201C] text-sm p-2.5 font-semibold focus:border-[#05A222] focus:outline-none"
                >
                  <option value="NONE">None</option>
                  <option value="TEXT">Text</option>
                </select>
              </div>
            </div>

            {/* Header Text (when TEXT is selected) */}
            {headerType === 'TEXT' && (
              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-[#14201C] mb-1.5">
                  Header Text
                </label>
                <Input
                  value={headerText}
                  onChange={(e) => setHeaderText(e.target.value)}
                  placeholder="e.g. Order Confirmation"
                  className="text-sm font-medium"
                  maxLength={60}
                />
              </div>
            )}

            {/* Message Body */}
            <div className="border-t border-[#E2EAE6] pt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs sm:text-[13px] font-bold text-[#14201C]">
                  Message Body
                </label>
                <button
                  type="button"
                  onClick={insertVariable}
                  className="text-xs font-bold text-[#006736] hover:text-[#05A222] flex items-center gap-1.5 bg-[#E9F9EE] border border-[#C4EBD0] px-3 py-1 rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#05A222]" /> + Add Variable
                </button>
              </div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                className="w-full rounded-xl border border-[#E2EAE6] bg-white text-[#14201C] text-sm p-3.5 focus:border-[#05A222] focus:outline-none leading-relaxed shadow-xs font-medium"
                required
              />
              <p className="text-xs text-[#5F7069] mt-1.5 font-medium">
                Insert dynamic variables like <code className="text-[#006736] bg-[#E9F9EE] px-1.5 py-0.5 rounded-md font-mono font-bold text-xs">&#123;&#123;1&#125;&#125;</code>, <code className="text-[#006736] bg-[#E9F9EE] px-1.5 py-0.5 rounded-md font-mono font-bold text-xs">&#123;&#123;2&#125;&#125;</code> for personalization.
              </p>
            </div>

            {/* Footer */}
            <div className="border-t border-[#E2EAE6] pt-4">
              <label className="block text-xs sm:text-[13px] font-bold text-[#14201C] mb-1.5">
                Footer Note <span className="text-[#5F7069] font-normal">(Optional)</span>
              </label>
              <Input
                value={footer}
                onChange={(e) => setFooter(e.target.value)}
                placeholder="e.g. Reply STOP to opt out"
                className="text-sm font-medium"
                maxLength={60}
              />
            </div>

            {/* Interactive Buttons Config */}
            <div className="border-t border-[#E2EAE6] pt-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs sm:text-[13px] font-bold text-[#14201C]">
                      Interactive Action Buttons
                    </label>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]">
                      {buttons.length}/3
                    </span>
                  </div>
                  <p className="text-xs text-[#5F7069] mt-0.5">
                    Add quick replies, website URLs, phone calls, offer codes, or opt-out buttons (max 3).
                  </p>
                </div>

                {buttons.length < 3 && (
                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleAddButton('QUICK_REPLY')}
                      className="text-xs font-bold text-[#006736] hover:text-[#05A222] bg-[#E9F9EE] hover:bg-[#d8f5e0] border border-[#C4EBD0] px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#05A222]" /> Add Button
                    </button>
                  </div>
                )}
              </div>

              {buttons.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-[#C4EBD0] bg-[#F6FAF8] text-center space-y-2.5">
                  <p className="text-xs font-semibold text-[#5F7069]">
                    No action buttons added yet. Choose an option to add:
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddButton('QUICK_REPLY')}
                      className="px-3 py-1.5 rounded-xl bg-white border border-[#E2EAE6] hover:border-[#05A222] text-xs font-bold text-[#14201C] hover:text-[#006736] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <CornerUpLeft className="w-3.5 h-3.5 text-[#05A222]" /> + Quick Reply
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddButton('URL')}
                      className="px-3 py-1.5 rounded-xl bg-white border border-[#E2EAE6] hover:border-[#05A222] text-xs font-bold text-[#14201C] hover:text-[#006736] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#05A222]" /> + Visit Website
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddButton('PHONE_NUMBER')}
                      className="px-3 py-1.5 rounded-xl bg-white border border-[#E2EAE6] hover:border-[#05A222] text-xs font-bold text-[#14201C] hover:text-[#006736] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-[#05A222]" /> + Call Phone
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddButton('COPY_CODE')}
                      className="px-3 py-1.5 rounded-xl bg-white border border-[#E2EAE6] hover:border-[#05A222] text-xs font-bold text-[#14201C] hover:text-[#006736] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#05A222]" /> + Copy Promo Code
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddButton('OPT_OUT')}
                      className="px-3 py-1.5 rounded-xl bg-white border border-[#E2EAE6] hover:border-rose-400 text-xs font-bold text-[#14201C] hover:text-rose-600 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-500" /> + Stop Promotions
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {buttons.map((btn, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E2EAE6] shadow-2xs hover:border-[#C4EBD0] transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-[#F0F4F2] pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#E9F9EE] text-[#006736] font-black text-[11px] flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-[#14201C]">
                            {btn.type === 'QUICK_REPLY' && '⚡ Quick Reply'}
                            {btn.type === 'URL' && '🌐 Visit Website (URL)'}
                            {btn.type === 'PHONE_NUMBER' && '📞 Call Phone Number'}
                            {btn.type === 'COPY_CODE' && '🎟️ Copy Offer Code'}
                            {btn.type === 'OPT_OUT' && '🛑 Opt-Out / Stop'}
                            {btn.type === 'SUPPORT' && '💬 Live Agent Support'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveButton(idx)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                          title="Remove Button"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#14201C] mb-1.5">
                            Button Type
                          </label>
                          <select
                            value={btn.type}
                            onChange={(e) => {
                              const next = [...buttons];
                              const newType = e.target.value as ButtonType;
                              next[idx].type = newType;
                              if (newType === 'URL' && !next[idx].url) next[idx].url = 'https://';
                              if (newType === 'PHONE_NUMBER' && !next[idx].phoneNumber) next[idx].phoneNumber = '+';
                              if (newType === 'COPY_CODE') {
                                if (!next[idx].code) next[idx].code = 'OFFER50';
                                if (!next[idx].text || next[idx].text === 'Quick Reply') next[idx].text = 'Copy Offer Code';
                              }
                              if (newType === 'OPT_OUT') next[idx].text = 'Stop Promotions';
                              if (newType === 'SUPPORT') next[idx].text = 'Talk to Agent';
                              setButtons(next);
                            }}
                            className="w-full rounded-xl border border-[#E2EAE6] bg-[#F6FAF8] text-[#14201C] text-sm p-2.5 font-semibold focus:border-[#05A222] focus:bg-white focus:outline-none"
                          >
                            <option value="QUICK_REPLY">⚡ Quick Reply (Custom Text)</option>
                            <option value="URL">🌐 Visit Website (URL / CTA)</option>
                            <option value="PHONE_NUMBER">📞 Call Phone Number (Dialer)</option>
                            <option value="COPY_CODE">🎟️ Copy Offer / Coupon Code (1-Tap)</option>
                            <option value="OPT_OUT">🛑 Opt-Out / Stop (Marketing Compliance)</option>
                            <option value="SUPPORT">💬 Live Agent / Human Support</option>
                          </select>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-bold text-[#14201C]">
                              Button Label
                            </label>
                            <span className="text-[11px] text-[#8A9993] font-semibold">
                              {btn.text.length}/25
                            </span>
                          </div>
                          <input
                            type="text"
                            value={btn.text}
                            maxLength={25}
                            onChange={(e) => {
                              const next = [...buttons];
                              next[idx].text = e.target.value;
                              setButtons(next);
                            }}
                            placeholder={
                              btn.type === 'QUICK_REPLY'
                                ? 'e.g. Track Order'
                                : btn.type === 'URL'
                                ? 'e.g. Visit Website'
                                : btn.type === 'PHONE_NUMBER'
                                ? 'e.g. Call Support'
                                : btn.type === 'COPY_CODE'
                                ? 'e.g. Copy Offer Code'
                                : btn.type === 'OPT_OUT'
                                ? 'e.g. Stop Promotions'
                                : 'e.g. Talk to Agent'
                            }
                            className="w-full rounded-xl border border-[#E2EAE6] bg-[#F6FAF8] text-[#14201C] text-sm p-2.5 font-medium focus:border-[#05A222] focus:bg-white focus:outline-none"
                            required
                          />
                        </div>
                      </div>

                      {btn.type === 'URL' && (
                        <div>
                          <label className="block text-xs font-bold text-[#14201C] mb-1.5">
                            Website Target URL
                          </label>
                          <input
                            type="url"
                            value={btn.url || ''}
                            onChange={(e) => {
                              const next = [...buttons];
                              next[idx].url = e.target.value;
                              setButtons(next);
                            }}
                            placeholder="https://example.com/order-tracking"
                            className="w-full rounded-xl border border-[#E2EAE6] bg-[#F6FAF8] text-[#14201C] text-sm p-2.5 font-medium focus:border-[#05A222] focus:bg-white focus:outline-none"
                            required
                          />
                          <p className="text-xs text-[#5F7069] mt-1.5 flex items-center gap-1">
                            <Info className="w-3.5 h-3.5 text-[#05A222] shrink-0" /> Full URL starting with https://. Supports static URLs or dynamic parameters.
                          </p>
                        </div>
                      )}

                      {btn.type === 'PHONE_NUMBER' && (
                        <div>
                          <label className="block text-xs font-bold text-[#14201C] mb-1.5">
                            Phone Number <span className="text-[#5F7069] font-normal">(with Country Code)</span>
                          </label>
                          <input
                            type="tel"
                            value={btn.phoneNumber || ''}
                            onChange={(e) => {
                              const next = [...buttons];
                              next[idx].phoneNumber = e.target.value;
                              setButtons(next);
                            }}
                            placeholder="+15551234567 or +919876543210"
                            className="w-full rounded-xl border border-[#E2EAE6] bg-[#F6FAF8] text-[#14201C] text-sm p-2.5 font-medium focus:border-[#05A222] focus:bg-white focus:outline-none"
                            required
                          />
                          <p className="text-xs text-[#5F7069] mt-1.5 flex items-center gap-1">
                            <Info className="w-3.5 h-3.5 text-[#05A222] shrink-0" /> Meta requires international format starting with + (e.g. +919876543210).
                          </p>
                        </div>
                      )}

                      {btn.type === 'COPY_CODE' && (
                        <div>
                          <label className="block text-xs font-bold text-[#14201C] mb-1.5">
                            Offer / Promo Code to Copy
                          </label>
                          <input
                            type="text"
                            value={btn.code || ''}
                            onChange={(e) => {
                              const next = [...buttons];
                              next[idx].code = e.target.value.toUpperCase().replace(/\s+/g, '');
                              setButtons(next);
                            }}
                            placeholder="e.g. SAVE20 or DIWALI50"
                            className="w-full rounded-xl border border-[#E2EAE6] bg-[#F6FAF8] text-[#14201C] text-sm p-2.5 font-mono font-bold focus:border-[#05A222] focus:bg-white focus:outline-none uppercase"
                            required
                          />
                          <p className="text-xs text-[#5F7069] mt-1.5 flex items-center gap-1">
                            <Info className="w-3.5 h-3.5 text-[#05A222] shrink-0" /> Tapping this button in WhatsApp automatically copies this coupon code to the user's clipboard.
                          </p>
                        </div>
                      )}

                      {btn.type === 'OPT_OUT' && (
                        <p className="text-xs text-[#5F7069] bg-[#F6FAF8] p-2.5 rounded-xl border border-[#E2EAE6] flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                          <span>Recommended for Marketing campaigns to ensure compliance with Meta WhatsApp opt-out policies.</span>
                        </p>
                      )}

                      {btn.type === 'SUPPORT' && (
                        <p className="text-xs text-[#5F7069] bg-[#F6FAF8] p-2.5 rounded-xl border border-[#E2EAE6] flex items-center gap-2">
                          <Headphones className="w-4 h-4 text-[#05A222] shrink-0" />
                          <span>Sends an instant request trigger for your team or AI bot to initiate human-agent support.</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 pt-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleSaveDraft}
                isLoading={isSavingDraft}
                leftIcon={<Bookmark className="w-4 h-4 text-[#006736]" />}
                className="w-full sm:w-1/2 border-[#C4EBD0] text-[#006736] hover:bg-[#E9F9EE] font-bold py-3.5 rounded-xl shadow-2xs cursor-pointer"
              >
                Save as Draft
              </Button>

              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-1/2 bg-[#05A222] hover:bg-[#006736] text-white font-bold py-3.5 rounded-xl shadow-xs cursor-pointer"
                isLoading={isSubmitting}
                leftIcon={<Send className="w-4 h-4" />}
              >
                Submit to Meta
              </Button>
            </div>
          </form>
        </div>

        {/* Right Ultra-Realistic Modern iPhone Mockup */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-6">
          <div className="text-xs font-bold text-[#5F7069] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#05A222]" />
            <span>Live WhatsApp Rendering Preview</span>
          </div>

          {/* iPhone Chassis (Refined Slim Bezel) */}
          <div className="w-full max-w-[330px] bg-[#1C1C1E] rounded-[48px] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.08)] ring-1 ring-black/40">
            {/* Screen Inner Glass */}
            <div className="bg-[#EFEAE2] rounded-[38px] min-h-[540px] flex flex-col justify-between overflow-hidden relative shadow-inner">
              {/* iOS Top Status Bar & Dynamic Island */}
              <div className="bg-[#008069] text-white pt-2.5 pb-1 px-5">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span>9:41</span>
                  {/* Dynamic Island */}
                  <div className="w-20 h-4 bg-black rounded-full flex items-center justify-end px-1.5 gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#111] ring-1 ring-slate-800" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <Wifi className="w-3 h-3" />
                    <div className="w-4 h-2 border border-white rounded-[3px] p-[1px] flex items-center">
                      <div className="h-full w-full bg-white rounded-[1px]" />
                    </div>
                  </div>
                </div>

                {/* WhatsApp Chat Navigation Bar */}
                <div className="flex items-center justify-between gap-2 mt-2 pt-1 pb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <ChevronLeft className="w-5 h-5 -ml-1 text-white shrink-0" />
                    <div className="w-7 h-7 rounded-full bg-[#05A222] text-white flex items-center justify-center font-bold text-[11px] shrink-0 shadow-xs ring-1 ring-white/30">
                      W
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate flex items-center gap-1 text-white">
                        <span>Acme Official</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-[#6AEB31] shrink-0" />
                      </div>
                      <div className="text-[9px] text-[#C4EBD0] leading-none">Official Business Account</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 text-white/90">
                    <Video className="w-4 h-4" />
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Chat Canvas Body */}
              <div className="p-3 my-auto space-y-2">
                {/* Date Pill */}
                <div className="flex justify-center my-1">
                  <span className="bg-white/80 backdrop-blur-xs text-[#5F7069] text-[9px] font-bold px-2.5 py-0.5 rounded-md shadow-2xs uppercase tracking-wider">
                    Today
                  </span>
                </div>

                {/* WhatsApp Incoming Chat Bubble */}
                <div className="bg-white rounded-2xl rounded-tl-xs p-3 shadow-xs space-y-1.5 text-xs text-[#14201C]">
                  {headerType === 'TEXT' && headerText && (
                    <div className="font-bold text-[#008069] text-[11px] border-b border-[#F0F2F5] pb-1">
                      {headerText}
                    </div>
                  )}
                  <div className="text-[#1F2A26] whitespace-pre-wrap leading-relaxed font-sans text-xs">
                    {previewBody}
                  </div>
                  {footer && (
                    <div className="text-[10px] text-[#8A9993] pt-0.5">
                      {footer}
                    </div>
                  )}
                  <div className="text-[9px] text-right text-[#8A9993] font-medium flex items-center justify-end gap-1">
                    <span>12:45 PM</span>
                    <CheckCheck className="w-3.5 h-3.5 text-[#53BDEB]" />
                  </div>
                </div>

                {/* Action Buttons */}
                {buttons.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {buttons.map((btn, idx) => (
                      <div
                        key={idx}
                        className="bg-white hover:bg-[#F6FAF8] py-2 px-3 text-center text-xs font-bold text-[#00A884] rounded-xl shadow-2xs border border-[#E2EAE6] flex items-center justify-center gap-1.5 transition-colors"
                      >
                        {btn.type === 'QUICK_REPLY' && <CornerUpLeft className="w-3.5 h-3.5 text-[#00A884] shrink-0" />}
                        {btn.type === 'URL' && <ExternalLink className="w-3.5 h-3.5 text-[#00A884] shrink-0" />}
                        {btn.type === 'PHONE_NUMBER' && <PhoneCall className="w-3.5 h-3.5 text-[#00A884] shrink-0" />}
                        {btn.type === 'COPY_CODE' && <Copy className="w-3.5 h-3.5 text-[#00A884] shrink-0" />}
                        {btn.type === 'OPT_OUT' && <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                        {btn.type === 'SUPPORT' && <Headphones className="w-3.5 h-3.5 text-[#00A884] shrink-0" />}
                        
                        <span className={btn.type === 'OPT_OUT' ? 'text-rose-600' : ''}>
                          {btn.text || 'Action Button'}
                        </span>

                        {btn.type === 'COPY_CODE' && btn.code && (
                          <span className="text-[9px] bg-[#E9F9EE] text-[#006736] font-mono px-1.5 py-0.2 rounded border border-[#C4EBD0] ml-1">
                            {btn.code}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Variable Test Editor inside Mockup */}
              <div className="p-2.5 bg-white/95 backdrop-blur-xs border-t border-[#E2EAE6] space-y-1.5">
                {foundVars.length > 0 ? (
                  <>
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
                          className="text-[10px] p-1.5 rounded-lg border border-[#E2EAE6] bg-[#F6FAF8] text-[#14201C] font-semibold focus:border-[#05A222] focus:bg-white focus:outline-none"
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-[10px] text-center text-[#5F7069] font-medium py-1">
                    WhatsApp HSM Template Preview
                  </div>
                )}
                {/* iOS Home Indicator Bar */}
                <div className="w-28 h-1 bg-black/20 rounded-full mx-auto mt-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
