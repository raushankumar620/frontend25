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
  AlertCircle
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
      const matches = (selectedTemplate.body && selectedTemplate.body.match(/\{\{(\d+)\}\}/g)) || [];
      const newMappings: typeof variableMappings = {};
      matches.forEach((m) => {
        const num = m.replace(/[{}]/g, '');
        newMappings[num] = {
          sourceType: 'contact_field',
          sourceField: num === '1' ? 'name' : 'phoneNumber',
        };
      });
      setVariableMappings(newMappings);
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

  return (
    <PageContainer>
      <button
        onClick={() => navigate(ROUTES.CAMPAIGNS)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Campaigns</span>
      </button>

      {errorMessage && (
        <div className="mb-6 max-w-4xl mx-auto p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Stepper Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
          <div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Step {step} of 3
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {step === 1 && '1. Campaign Name & Audience'}
              {step === 2 && '2. WhatsApp Template & Variable Personalization'}
              {step === 3 && '3. Schedule & Launch Broadcast'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : step > s
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Campaign Details & Audience Filter */}
        {step === 1 && (
          <div className="space-y-6">
            <Input
              label="Campaign Title"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. VIP Summer Mega Discount 2026"
              required
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase">
                Target Audience Selection
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div
                  onClick={() => {
                    setTargetAll(true);
                    setSelectedTags([]);
                  }}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    targetAll
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-emerald-500" />
                    <div>
                      <div className="text-xs font-bold">All Opted-In Contacts</div>
                      <div className="text-[11px] text-slate-400">Broadcast to entire subscriber base</div>
                    </div>
                  </div>
                  {targetAll && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                </div>

                <div
                  onClick={() => setTargetAll(false)}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    !targetAll
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-indigo-500" />
                    <div>
                      <div className="text-xs font-bold">Filter by Audience Tags</div>
                      <div className="text-[11px] text-slate-400">Target specific customer segments</div>
                    </div>
                  </div>
                  {!targetAll && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                </div>
              </div>

              {!targetAll && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Select Tags to include:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <button
                        key={tag.name}
                        type="button"
                        onClick={() => toggleTag(tag.name)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          selectedTags.includes(tag.name)
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <span>{tag.name}</span>
                        <span className="text-[10px] opacity-75">({tag.count})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button
              className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              size="lg"
              disabled={!name.trim() || (!targetAll && selectedTags.length === 0)}
              onClick={() => setStep(2)}
            >
              Next: Select Template & Variables
            </Button>
          </div>
        )}

        {/* Step 2: Template Selection & Variable Mapping */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase">
                Choose WhatsApp HSM Template
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                {templates.map((tpl) => (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl)}
                    className={`p-3.5 rounded-xl border flex items-start justify-between cursor-pointer transition-all ${
                      selectedTemplate?.id === tpl.id
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs font-mono text-slate-900 dark:text-white flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{tpl.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {tpl.body}
                      </div>
                    </div>
                    {selectedTemplate?.id === tpl.id && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Variable Mappings */}
            {selectedTemplate && foundVars.length > 0 && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">
                  Personalize Variables for Recipients
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {foundVars.map((v) => (
                    <div key={v} className="space-y-1">
                      <label className="block text-[11px] font-bold font-mono text-slate-600 dark:text-slate-300">
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
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold"
                      >
                        <option value="name">Contact Full Name (e.g. Alice)</option>
                        <option value="phoneNumber">Contact Phone Number</option>
                        <option value="email">Contact Email</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <Button variant="ghost" size="lg" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                size="lg"
                disabled={!selectedTemplate}
                onClick={() => setStep(3)}
              >
                Next: Review & Launch
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Schedule & Launch Review */}
        {step === 3 && selectedTemplate && (
          <div className="space-y-6">
            {/* Review Summary */}
            <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400">Broadcast Summary</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Campaign Name:</span>
                  <strong className="text-slate-900 dark:text-white">{name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">HSM Template:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{selectedTemplate.name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Audience Targeting:</span>
                  <strong className="text-slate-900 dark:text-white">
                    {targetAll ? 'All Opted-In Contacts' : `Tags: ${selectedTags.join(', ')}`}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Template Category:</span>
                  <strong className="text-slate-900 dark:text-white uppercase">{selectedTemplate.category}</strong>
                </div>
              </div>
            </div>

            {/* Launch Timing */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                Broadcast Timing
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => {
                    setAutoLaunch(true);
                    setScheduleDate('');
                  }}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    autoLaunch && !scheduleDate
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-emerald-500" />
                    <div>
                      <div className="text-xs font-bold">Launch Immediately</div>
                      <div className="text-[11px] text-slate-400">Start sending right after creation</div>
                    </div>
                  </div>
                  {autoLaunch && !scheduleDate && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                </div>

                <div
                  onClick={() => setAutoLaunch(false)}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    !autoLaunch || scheduleDate
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="text-xs font-bold">Schedule for Later</div>
                      <div className="text-[11px] text-slate-400">Send at a designated future time</div>
                    </div>
                  </div>
                  {(!autoLaunch || scheduleDate) && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
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
              <Button variant="ghost" size="lg" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                size="lg"
                isLoading={isSubmitting}
                leftIcon={<Send className="w-4 h-4" />}
                onClick={handleLaunch}
              >
                {scheduleDate ? 'Schedule Broadcast Campaign' : 'Launch Campaign Now'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
