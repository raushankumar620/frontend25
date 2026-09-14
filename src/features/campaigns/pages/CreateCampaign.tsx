import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import {
  ArrowLeft,
  Users,
  FileText,
  Send,
  CheckCircle2,
  Calendar,
  Zap,
  Tag,
  AlertCircle,
  Smartphone,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { campaignsApi } from '../api';
import { templatesApi } from '../../templates/api';
import { contactService } from '../../../services/contactService';
import type { WhatsAppTemplate } from '../../templates/types';

export const CreateCampaign: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate | null>(null);
  const [availableTags, setAvailableTags] = useState<Array<{ name: string; count: number }>>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [targetAll, setTargetAll] = useState(false);
  const [variableMappings, setVariableMappings] = useState<{ [paramIndex: string]: { sourceType: string; sourceField: string } }>({});
  const [sampleVarValues, setSampleVarValues] = useState<{ [paramIndex: string]: string }>({
    '1': 'Alex Johnson',
    '2': '+1 (555) 234-5678',
    '3': 'VIP-2026',
  });
  const [scheduleDate, setScheduleDate] = useState('');
  const [autoLaunch, setAutoLaunch] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Load approved templates
    templatesApi.getTemplates().then((data) => {
      const approved = data.filter((t) => t.status === 'APPROVED' || t.status === 'PENDING');
      setTemplates(approved.length > 0 ? approved : data);
      if (approved.length > 0) {
        setSelectedTemplate(approved[0]);
      }
    });

    // Load contact tags summary
    contactService.getTagsSummary().then((res) => {
      if (Array.isArray(res)) {
        setAvailableTags(res.map((t) => ({ name: t.tag, count: t.count })));
      }
    }).catch(() => {
      setAvailableTags([
        { name: 'VIP', count: 124 },
        { name: 'Lead', count: 430 },
        { name: 'Customer', count: 890 },
      ]);
    });
  }, []);

  // Set default variable mappings when selectedTemplate changes
  useEffect(() => {
    if (selectedTemplate) {
      const matches: string[] = (selectedTemplate.body && selectedTemplate.body.match(/\{\{(\d+)\}\}/g)) || [];
      const newMappings: typeof variableMappings = {};
      const newSamples: typeof sampleVarValues = { ...sampleVarValues };
      matches.forEach((m) => {
        const num = m.replace(/[{}]/g, '');
        newMappings[num] = {
          sourceType: 'contact_field',
          sourceField: num === '1' ? 'name' : 'phoneNumber',
        };
        if (!newSamples[num]) {
          newSamples[num] = num === '1' ? 'Alex Johnson' : `Value ${num}`;
        }
      });
      setVariableMappings(newMappings);
      setSampleVarValues(newSamples);
    }
  }, [selectedTemplate]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleLaunch = async () => {
    if (!selectedTemplate) return;
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const varArray = Object.keys(variableMappings).map((idx) => ({
        paramIndex: Number(idx),
        sourceType: variableMappings[idx].sourceType as any,
        sourceField: variableMappings[idx].sourceField,
      }));

      await campaignsApi.createCampaign({
        name: name.trim(),
        templateId: selectedTemplate.id,
        templateName: selectedTemplate.name,
        language: selectedTemplate.language || 'en_US',
        audienceFilter: {
          tags: selectedTags,
          allContacts: targetAll,
          onlyOptedIn: true,
        },
        variableMapping: varArray,
        scheduledAt: scheduleDate ? new Date(scheduleDate).toISOString() : null,
        autoStart: autoLaunch && !scheduleDate,
      });

      navigate(ROUTES.CAMPAIGNS);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  const foundVars = Object.keys(variableMappings);

  // Dynamic preview body with sample values
  const previewBody = selectedTemplate
    ? selectedTemplate.body.replace(/\{\{(\d+)\}\}/g, (_, num) => {
        return sampleVarValues[num] || `[Variable {{${num}}}]`;
      })
    : '';

  return (
    <PageContainer>
      {/* Back button */}
      <button
        onClick={() => navigate(ROUTES.CAMPAIGNS)}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#5F7069] hover:text-[#14201C] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Campaigns</span>
      </button>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold flex items-center gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid: Left Builder & Right Smartphone Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form / Stepper Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2EAE6] p-5 sm:p-7 shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-6">
          {/* Stepper Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2EAE6] pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#05A222] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Step {step} of 3</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#14201C] tracking-tight mt-0.5">
                {step === 1 && '1. Campaign Name & Audience'}
                {step === 2 && '2. HSM Template & Variables'}
                {step === 3 && '3. Schedule & Review'}
              </h2>
            </div>

            {/* Stepper Pills */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  onClick={() => s < step && setStep(s)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all cursor-pointer ${
                    step === s
                      ? 'bg-[#05A222] text-white shadow-xs'
                      : step > s
                      ? 'bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]'
                      : 'bg-[#F6FAF8] text-[#8A9993] border border-[#E2EAE6]'
                  }`}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* STEP 1: Campaign Name & Audience Targeting */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-[#14201C] uppercase tracking-wider mb-2">
                  Campaign Title
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. VIP Summer Flash Sale 2026"
                  required
                />
                <p className="text-[11px] text-[#5F7069] mt-1.5 font-medium">
                  Internal campaign name used in your marketing reports & broadcast analytics.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14201C] uppercase tracking-wider mb-2">
                  Target Audience Selection
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div
                    onClick={() => {
                      setTargetAll(true);
                      setSelectedTags([]);
                    }}
                    className={`p-4 rounded-xl border-2 flex items-start justify-between cursor-pointer transition-all ${
                      targetAll
                        ? 'border-[#05A222] bg-[#E9F9EE] text-[#006736]'
                        : 'border-[#E2EAE6] bg-white hover:bg-[#F6FAF8] text-[#14201C]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#05A222]/10 text-[#05A222] flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-[#14201C]">All Opted-In Contacts</div>
                        <div className="text-[11px] text-[#5F7069] font-medium">Broadcast to all subscribers</div>
                      </div>
                    </div>
                    {targetAll && <CheckCircle2 className="w-5 h-5 text-[#05A222] shrink-0" />}
                  </div>

                  <div
                    onClick={() => setTargetAll(false)}
                    className={`p-4 rounded-xl border-2 flex items-start justify-between cursor-pointer transition-all ${
                      !targetAll
                        ? 'border-[#05A222] bg-[#E9F9EE] text-[#006736]'
                        : 'border-[#E2EAE6] bg-white hover:bg-[#F6FAF8] text-[#14201C]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#07CF74]/10 text-[#006736] flex items-center justify-center shrink-0">
                        <Tag className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-[#14201C]">Targeted Audience Tags</div>
                        <div className="text-[11px] text-[#5F7069] font-medium">Filter by specific segments</div>
                      </div>
                    </div>
                    {!targetAll && <CheckCircle2 className="w-5 h-5 text-[#05A222] shrink-0" />}
                  </div>
                </div>

                {!targetAll && (
                  <div className="p-4 bg-[#F6FAF8] rounded-xl border border-[#E2EAE6] space-y-2.5">
                    <div className="text-xs font-bold text-[#14201C]">
                      Select Tags to include in this broadcast:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <button
                          key={tag.name}
                          type="button"
                          onClick={() => toggleTag(tag.name)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            selectedTags.includes(tag.name)
                              ? 'bg-[#05A222] text-white shadow-xs'
                              : 'bg-white text-[#14201C] border border-[#E2EAE6] hover:bg-[#E9F9EE]'
                          }`}
                        >
                          <span>{tag.name}</span>
                          <span className="text-[10px] opacity-75 font-semibold">({tag.count})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button
                className="w-full mt-6 bg-[#05A222] hover:bg-[#006736] text-white font-bold py-3 rounded-xl shadow-xs"
                size="lg"
                disabled={!name.trim() || (!targetAll && selectedTags.length === 0)}
                onClick={() => setStep(2)}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Next: Select Template & Variables
              </Button>
            </div>
          )}

          {/* STEP 2: Template Selection & Variable Mapping */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-[#14201C] uppercase tracking-wider mb-2">
                  Choose Approved WhatsApp HSM Template
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                  {templates.map((tpl) => (
                    <div
                      key={tpl.id}
                      onClick={() => setSelectedTemplate(tpl)}
                      className={`p-3.5 rounded-xl border-2 flex items-start justify-between cursor-pointer transition-all ${
                        selectedTemplate?.id === tpl.id
                          ? 'border-[#05A222] bg-[#E9F9EE]'
                          : 'border-[#E2EAE6] bg-white hover:bg-[#F6FAF8]'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-bold text-xs font-mono text-[#14201C] flex items-center gap-1.5 truncate">
                          <FileText className="w-3.5 h-3.5 text-[#05A222] shrink-0" />
                          <span>{tpl.name}</span>
                        </div>
                        <div className="text-[11px] text-[#5F7069] mt-1 line-clamp-2 font-medium">
                          {tpl.body}
                        </div>
                      </div>
                      {selectedTemplate?.id === tpl.id && (
                        <CheckCircle2 className="w-4 h-4 text-[#05A222] shrink-0 mt-0.5" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Variable Mappings Card */}
              {selectedTemplate && foundVars.length > 0 && (
                <div className="p-4 bg-[#F6FAF8] rounded-xl border border-[#E2EAE6] space-y-3">
                  <div className="text-xs font-bold text-[#14201C] uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#05A222]" />
                    <span>Personalize Variables for Each Recipient</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {foundVars.map((v) => (
                      <div key={v} className="space-y-1">
                        <label className="block text-[11px] font-bold font-mono text-[#14201C]">
                          Variable &#123;&#123;{v}&#125;&#125;
                        </label>
                        <select
                          value={variableMappings[v]?.sourceField || 'name'}
                          onChange={(e) => {
                            setVariableMappings({
                              ...variableMappings,
                              [v]: {
                                sourceType: 'contact_field',
                                sourceField: e.target.value,
                              },
                            });
                          }}
                          className="w-full text-xs p-2.5 rounded-xl border border-[#E2EAE6] bg-white text-[#14201C] font-semibold focus:border-[#05A222] focus:outline-none"
                        >
                          <option value="name">Contact Full Name (e.g. Alex)</option>
                          <option value="phoneNumber">Contact Phone Number</option>
                          <option value="email">Contact Email</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <Button variant="ghost" size="lg" onClick={() => setStep(1)} className="font-semibold text-[#5F7069]">
                  Back
                </Button>
                <Button
                  className="flex-1 bg-[#05A222] hover:bg-[#006736] text-white font-bold py-3 rounded-xl shadow-xs"
                  size="lg"
                  disabled={!selectedTemplate}
                  onClick={() => setStep(3)}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Next: Review & Launch
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Schedule Launch */}
          {step === 3 && selectedTemplate && (
            <div className="space-y-6">
              {/* Review Summary */}
              <div className="p-5 bg-[#F6FAF8] rounded-2xl border border-[#E2EAE6] space-y-3">
                <h4 className="text-xs font-bold uppercase text-[#5F7069] tracking-wider">Broadcast Summary</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <span className="text-[#5F7069] block font-medium">Campaign Title:</span>
                    <strong className="text-[#14201C] text-sm">{name}</strong>
                  </div>
                  <div>
                    <span className="text-[#5F7069] block font-medium">HSM Template:</span>
                    <strong className="text-[#05A222] font-mono">{selectedTemplate.name}</strong>
                  </div>
                  <div>
                    <span className="text-[#5F7069] block font-medium">Audience Reach:</span>
                    <strong className="text-[#14201C]">
                      {targetAll ? 'All Opted-In Subscribers' : `Tags: ${selectedTags.join(', ')}`}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#5F7069] block font-medium">Category:</span>
                    <strong className="text-[#14201C] uppercase">{selectedTemplate.category}</strong>
                  </div>
                </div>
              </div>

              {/* Timing selection */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-[#14201C] uppercase tracking-wider">
                  Broadcast Timing
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => {
                      setAutoLaunch(true);
                      setScheduleDate('');
                    }}
                    className={`p-4 rounded-xl border-2 flex items-start justify-between cursor-pointer transition-all ${
                      autoLaunch && !scheduleDate
                        ? 'border-[#05A222] bg-[#E9F9EE] text-[#006736]'
                        : 'border-[#E2EAE6] bg-white hover:bg-[#F6FAF8] text-[#14201C]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#05A222]/10 text-[#05A222] flex items-center justify-center shrink-0">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-[#14201C]">Launch Immediately</div>
                        <div className="text-[11px] text-[#5F7069] font-medium">Dispatches right upon confirmation</div>
                      </div>
                    </div>
                    {autoLaunch && !scheduleDate && <CheckCircle2 className="w-5 h-5 text-[#05A222] shrink-0" />}
                  </div>

                  <div
                    onClick={() => setAutoLaunch(false)}
                    className={`p-4 rounded-xl border-2 flex items-start justify-between cursor-pointer transition-all ${
                      !autoLaunch || scheduleDate
                        ? 'border-[#05A222] bg-[#E9F9EE] text-[#006736]'
                        : 'border-[#E2EAE6] bg-white hover:bg-[#F6FAF8] text-[#14201C]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#07CF74]/10 text-[#006736] flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-[#14201C]">Schedule for Later</div>
                        <div className="text-[11px] text-[#5F7069] font-medium">Send at a designated time</div>
                      </div>
                    </div>
                    {(!autoLaunch || scheduleDate) && <CheckCircle2 className="w-5 h-5 text-[#05A222] shrink-0" />}
                  </div>
                </div>

                {(!autoLaunch || scheduleDate) && (
                  <div className="pt-2">
                    <Input
                      type="datetime-local"
                      label="Scheduled Date & Time"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button variant="ghost" size="lg" onClick={() => setStep(2)} className="font-semibold text-[#5F7069]">
                  Back
                </Button>
                <Button
                  className="flex-1 bg-[#05A222] hover:bg-[#006736] text-white font-bold py-3 rounded-xl shadow-xs"
                  size="lg"
                  isLoading={isSubmitting}
                  leftIcon={<Send className="w-4 h-4" />}
                  onClick={handleLaunch}
                >
                  {scheduleDate ? 'Schedule Broadcast Campaign' : 'Launch Broadcast Now'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Realistic WhatsApp Smartphone Mockup */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-6">
          <div className="text-xs font-bold text-[#5F7069] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#05A222]" />
            <span>Live WhatsApp Message Preview</span>
          </div>

          {/* Phone Chassis Container */}
          <div className="w-full max-w-[340px] bg-[#14201C] rounded-[44px] p-3.5 shadow-[0_20px_60px_rgba(1,59,35,0.18)] border-4 border-[#1F2A26]">
            {/* Speaker & Notch */}
            <div className="w-24 h-4 bg-[#14201C] mx-auto rounded-b-xl mb-2 flex items-center justify-center">
              <div className="w-10 h-1 bg-[#2D3A35] rounded-full" />
            </div>

            {/* Smartphone Inner Screen */}
            <div className="bg-[#E5DDD5] rounded-[34px] p-3.5 min-h-[460px] flex flex-col justify-between overflow-hidden relative">
              {/* WhatsApp App Header */}
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

              {/* Chat Bubble & Interactive Buttons */}
              <div className="my-auto py-3 space-y-2">
                {selectedTemplate ? (
                  <div>
                    <div className="bg-white rounded-2xl rounded-tl-xs p-3.5 shadow-sm space-y-1.5 text-xs text-[#14201C]">
                      {selectedTemplate.header?.text && (
                        <div className="font-bold text-[#006736] border-b border-[#E2EAE6] pb-1">
                          {selectedTemplate.header.text}
                        </div>
                      )}
                      <div className="whitespace-pre-wrap leading-relaxed font-sans text-xs text-[#1F2A26]">
                        {previewBody}
                      </div>
                      {selectedTemplate.footer && (
                        <div className="text-[10px] text-[#8A9993] pt-1 border-t border-[#F6FAF8]">
                          {selectedTemplate.footer}
                        </div>
                      )}
                      <div className="text-[9px] text-right text-[#8A9993] font-medium flex items-center justify-end gap-1">
                        <span>12:45 PM</span>
                        <CheckCircle2 className="w-3 h-3 text-[#05A222]" />
                      </div>
                    </div>

                    {/* Buttons Preview */}
                    {selectedTemplate.buttons && selectedTemplate.buttons.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {selectedTemplate.buttons.map((btn, idx) => (
                          <div
                            key={idx}
                            className="bg-white py-2 px-3 text-center text-xs font-bold text-[#05A222] rounded-xl shadow-xs border border-[#C4EBD0] flex items-center justify-center gap-1.5"
                          >
                            <span>{btn.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 bg-white/70 backdrop-blur-xs rounded-2xl text-center text-xs text-[#5F7069] font-medium border border-[#E2EAE6]">
                    Select an approved HSM template on the left to see the live WhatsApp preview.
                  </div>
                )}
              </div>

              {/* Variable Value Editor (Quick test inside preview) */}
              {selectedTemplate && foundVars.length > 0 && (
                <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-2.5 border border-[#E2EAE6] space-y-1.5 shadow-xs">
                  <div className="text-[10px] font-bold text-[#5F7069] uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#05A222]" />
                    <span>Test Preview Variables</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {foundVars.map((v) => (
                      <input
                        key={v}
                        type="text"
                        placeholder={`{{${v}}}`}
                        value={sampleVarValues[v] || ''}
                        onChange={(e) => setSampleVarValues({ ...sampleVarValues, [v]: e.target.value })}
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
