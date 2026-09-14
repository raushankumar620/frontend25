import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import type { TriggerType, ActionType, ActionItem, CreateAutomationPayload } from '../types';
import { automationsApi } from '../api';
import { teamService } from '../../../services/teamService';
import {
  ArrowLeft,
  Save,
  Sparkles,
  MessageSquare,
  Clock,
  Zap,
  Trash2,
  Smartphone,
  CheckCheck,
  Wifi,
  ChevronLeft,
  Video,
  Phone,
  ShieldCheck,
  Play,
  Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const CreateAutomation: React.FC = () => {
  const navigate = useNavigate();

  // Basic Details
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<number>(10);
  const [isActive, setIsActive] = useState(true);

  // Trigger Config
  const [triggerType, setTriggerType] = useState<TriggerType>('KEYWORD');
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>(['pricing', 'rates', 'cost']);
  const [matchType, setMatchType] = useState<'EXACT' | 'CONTAINS' | 'STARTS_WITH' | 'REGEX'>('CONTAINS');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [buttonId] = useState('');
  const [timezone, setTimezone] = useState('Asia/Kolkata');

  // Actions Chain
  const [actions, setActions] = useState<ActionItem[]>([
    {
      type: 'SEND_TEXT',
      payload: {
        text: 'Hello {{name}}! 👋 Thanks for reaching out. Here is our official pricing: Starter ($29/mo), Pro ($79/mo). Reply DEMO to book a walkthrough call.',
      },
    },
    {
      type: 'ADD_TAG',
      payload: { tag: 'Pricing-Lead' },
    },
  ]);

  // Team agents for ASSIGN_AGENT action
  const [teamMembers, setTeamMembers] = useState<Array<{ id: string; name: string }>>([]);

  // Simulation / Interactive Test
  const [testMessage, setTestMessage] = useState('What is the pricing for enterprise?');
  const [simulatedReply, setSimulatedReply] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    teamService.getTeamMembers().then((res) => {
      if (res && res.members && res.members.length > 0) {
        setTeamMembers(
          res.members.map((m) => ({
            id: m.id || m._id || '',
            name: m.name || `${m.firstName || ''} ${m.lastName || ''}`.trim() || m.email,
          }))
        );
      }
    }).catch(() => {});
  }, []);

  const handleAddKeyword = () => {
    const trimmed = keywordInput.trim().toLowerCase();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setKeywords(keywords.filter((k) => k !== kw));
  };

  const handleAddAction = (type: ActionType) => {
    let payload: any = {};
    if (type === 'SEND_TEXT') {
      payload = { text: 'Hello {{name}}, thank you for contacting us!' };
    } else if (type === 'ADD_TAG') {
      payload = { tag: 'Lead' };
    } else if (type === 'ASSIGN_AGENT') {
      payload = { agentId: teamMembers[0]?.id || '' };
    } else if (type === 'UPDATE_STATUS') {
      payload = { status: 'OPEN' };
    }
    setActions([...actions, { type, payload }]);
  };

  const handleUpdateAction = (index: number, payloadUpdates: any) => {
    const next = [...actions];
    next[index].payload = { ...next[index].payload, ...payloadUpdates };
    setActions(next);
  };

  const handleRemoveAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  // Run instant dry-run simulation
  const handleSimulate = () => {
    setIsSimulating(true);
    let matched = false;

    if (triggerType === 'KEYWORD') {
      const targetText = caseSensitive ? testMessage : testMessage.toLowerCase();
      matched = keywords.some((kw) => {
        const queryKw = caseSensitive ? kw : kw.toLowerCase();
        if (matchType === 'EXACT') return targetText.trim() === queryKw;
        if (matchType === 'STARTS_WITH') return targetText.trim().startsWith(queryKw);
        return targetText.includes(queryKw);
      });
    } else if (triggerType === 'FIRST_MESSAGE' || triggerType === 'OUT_OF_HOURS') {
      matched = true;
    }

    if (matched) {
      const replyAction = actions.find((a) => a.type === 'SEND_TEXT');
      if (replyAction?.payload?.text) {
        let rendered = replyAction.payload.text
          .replace(/\{\{name\}\}/gi, 'Alex Johnson')
          .replace(/\{\{first_name\}\}/gi, 'Alex')
          .replace(/\{\{phone\}\}/gi, '+1 (555) 019-2834');
        setSimulatedReply(rendered);
      } else {
        setSimulatedReply('[Executed non-text actions: Tags & Agent assignment]');
      }
    } else {
      setSimulatedReply(null);
    }
    setTimeout(() => setIsSimulating(false), 300);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please enter an automation name');
      return;
    }
    if (actions.length === 0) {
      setErrorMessage('Please configure at least one action');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    const payload: CreateAutomationPayload = {
      name: name.trim(),
      description,
      triggerType,
      triggerConfig: {
        keywords,
        matchType,
        caseSensitive,
        buttonId: triggerType === 'BUTTON_CLICK' ? buttonId : undefined,
        businessHours:
          triggerType === 'OUT_OF_HOURS'
            ? {
                timezone,
                schedule: [
                  { day: 'saturday', closed: true },
                  { day: 'sunday', closed: true },
                  { day: 'monday', open: '09:00', close: '18:00', closed: false },
                ],
              }
            : undefined,
      },
      actions,
      isActive,
      priority,
    };

    try {
      await automationsApi.createAutomation(payload);
      navigate(ROUTES.AUTOMATIONS);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save automation rule');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageContainer>
      {/* Top Back & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <button
            onClick={() => navigate(ROUTES.AUTOMATIONS)}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#5F7069] hover:text-[#14201C] transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Automations</span>
          </button>
          <h2 className="text-xl sm:text-2xl font-black text-[#14201C] tracking-tight">
            Configure WhatsApp Automation Rule
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="md"
            onClick={() => navigate(ROUTES.AUTOMATIONS)}
            className="text-xs font-semibold text-[#5F7069]"
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
            className="bg-[#05A222] hover:bg-[#006736] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs"
          >
            Save & Activate Rule
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
          {errorMessage}
        </div>
      )}

      {/* Main Grid: Builder Canvas on Left (7 cols) + Live iPhone Preview on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Trigger & Action Configuration */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Basic Information */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#14201C] border-b border-[#E2EAE6] pb-3">
              <Layers className="w-4 h-4 text-[#05A222]" />
              <span>1. Automation Information</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#14201C] uppercase tracking-wider mb-1.5">
                  Rule Name *
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pricing Guide & Lead Qualifier Bot"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14201C] uppercase tracking-wider mb-1.5">
                  Description (Optional)
                </label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Automatically responds with price catalog and assigns agent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-[#14201C] uppercase tracking-wider mb-1.5">
                    Execution Priority
                  </label>
                  <Input
                    type="number"
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                    min={0}
                    max={100}
                  />
                  <span className="text-[10px] text-[#5F7069]">Higher priority rules fire first</span>
                </div>

                <div className="flex flex-col justify-center pt-3 sm:pt-0">
                  <label className="block text-xs font-bold text-[#14201C] uppercase tracking-wider mb-1.5">
                    Initial Status
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 text-[#05A222] rounded-md focus:ring-[#05A222]"
                    />
                    <span className="text-xs font-bold text-[#14201C]">Active immediately upon save</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Trigger Selection */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#14201C] border-b border-[#E2EAE6] pb-3">
              <Zap className="w-4 h-4 text-[#05A222]" />
              <span>2. When this happens (Trigger Condition)</span>
            </div>

            {/* Trigger Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'KEYWORD',
                  title: 'Keyword Match',
                  desc: 'Customer sends specific words or phrases',
                  icon: <MessageSquare className="w-4 h-4" />,
                },
                {
                  id: 'FIRST_MESSAGE',
                  title: 'First Message',
                  desc: 'New conversation / customer welcome',
                  icon: <Sparkles className="w-4 h-4" />,
                },
                {
                  id: 'OUT_OF_HOURS',
                  title: 'Out of Hours',
                  desc: 'Message outside business schedule',
                  icon: <Clock className="w-4 h-4" />,
                },
              ].map((t) => (
                <div
                  key={t.id}
                  onClick={() => setTriggerType(t.id as TriggerType)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    triggerType === t.id
                      ? 'border-[#05A222] bg-[#E9F9EE] text-[#006736]'
                      : 'border-[#E2EAE6] bg-white hover:bg-[#F6FAF8] text-[#14201C]'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs mb-1">
                    {t.icon}
                    <span>{t.title}</span>
                  </div>
                  <div className="text-[11px] text-[#5F7069] leading-tight">{t.desc}</div>
                </div>
              ))}
            </div>

            {/* Keyword Config */}
            {triggerType === 'KEYWORD' && (
              <div className="p-4 bg-[#F6FAF8] rounded-xl border border-[#E2EAE6] space-y-3">
                <label className="block text-xs font-bold text-[#14201C] uppercase tracking-wider">
                  Keywords to match
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                    placeholder="Type keyword and press Enter (e.g. price, catalog)"
                    className="flex-1"
                  />
                  <Button size="sm" variant="secondary" onClick={handleAddKeyword} className="text-xs font-bold">
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {keywords.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center gap-1 bg-white text-[#14201C] border border-[#C4EBD0] text-xs font-mono font-semibold px-2.5 py-1 rounded-lg shadow-2xs"
                    >
                      <span>"{kw}"</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(kw)}
                        className="text-rose-500 hover:text-rose-700 ml-1 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#14201C] mb-1">Match Type</label>
                    <select
                      value={matchType}
                      onChange={(e) => setMatchType(e.target.value as any)}
                      className="w-full text-xs p-2 rounded-xl border border-[#E2EAE6] bg-white text-[#14201C] font-semibold"
                    >
                      <option value="CONTAINS">Contains Keyword (Recommended)</option>
                      <option value="EXACT">Exact Match Only</option>
                      <option value="STARTS_WITH">Starts With Keyword</option>
                      <option value="REGEX">Regular Expression</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={caseSensitive}
                        onChange={(e) => setCaseSensitive(e.target.checked)}
                        className="w-4 h-4 text-[#05A222] rounded-md"
                      />
                      <span className="text-xs font-semibold text-[#14201C]">Case Sensitive Match</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Out of Hours Config */}
            {triggerType === 'OUT_OF_HOURS' && (
              <div className="p-4 bg-[#F6FAF8] rounded-xl border border-[#E2EAE6] space-y-3">
                <label className="block text-xs font-bold text-[#14201C] uppercase tracking-wider">
                  Business Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E2EAE6] bg-white text-[#14201C] font-semibold"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST - UTC+5:30)</option>
                  <option value="UTC">UTC (GMT)</option>
                  <option value="America/New_York">America/New_York (EST/EDT)</option>
                  <option value="Europe/London">Europe/London (GMT/BST)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST - UTC+4)</option>
                </select>
                <p className="text-[11px] text-[#5F7069]">
                  Normal working hours are Mon-Fri 09:00 AM - 06:00 PM. Messages received outside these hours or on weekends will automatically trigger this response.
                </p>
              </div>
            )}
          </div>

          {/* Section 3: Actions Chain Builder */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2EAE6] pb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#14201C]">
                <Play className="w-4 h-4 text-[#05A222]" />
                <span>3. Then do these actions in order ({actions.length})</span>
              </div>

              {/* Add Action Dropdown/Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAddAction('SEND_TEXT')}
                  className="text-xs font-bold text-[#006736] hover:text-[#05A222] bg-[#E9F9EE] border border-[#C4EBD0] px-2.5 py-1 rounded-xl transition-colors cursor-pointer"
                >
                  + Reply Text
                </button>
                <button
                  type="button"
                  onClick={() => handleAddAction('ADD_TAG')}
                  className="text-xs font-bold text-[#006736] hover:text-[#05A222] bg-[#E9F9EE] border border-[#C4EBD0] px-2.5 py-1 rounded-xl transition-colors cursor-pointer"
                >
                  + Add Tag
                </button>
                <button
                  type="button"
                  onClick={() => handleAddAction('ASSIGN_AGENT')}
                  className="text-xs font-bold text-[#006736] hover:text-[#05A222] bg-[#E9F9EE] border border-[#C4EBD0] px-2.5 py-1 rounded-xl transition-colors cursor-pointer"
                >
                  + Assign Agent
                </button>
              </div>
            </div>

            {/* Actions List */}
            <div className="space-y-3">
              {actions.map((act, idx) => (
                <div key={idx} className="p-4 bg-[#F6FAF8] rounded-xl border border-[#E2EAE6] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#14201C]">
                      <span className="w-5 h-5 rounded-full bg-[#05A222] text-white flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span>
                        {act.type === 'SEND_TEXT'
                          ? 'Send WhatsApp Auto-Reply Text'
                          : act.type === 'ADD_TAG'
                          ? 'Apply Tag to Contact'
                          : act.type === 'ASSIGN_AGENT'
                          ? 'Assign Conversation to Agent'
                          : act.type}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveAction(idx)}
                      className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* SEND_TEXT Configuration */}
                  {act.type === 'SEND_TEXT' && (
                    <div className="space-y-1.5">
                      <textarea
                        rows={3}
                        value={act.payload.text || ''}
                        onChange={(e) => handleUpdateAction(idx, { text: e.target.value })}
                        placeholder="Type WhatsApp reply message..."
                        className="w-full text-xs p-3 rounded-xl border border-[#E2EAE6] bg-white text-[#14201C] font-sans leading-relaxed focus:border-[#05A222] focus:outline-none shadow-2xs"
                      />
                      <div className="text-[10px] text-[#5F7069] flex items-center gap-2">
                        <span>Personalize with:</span>
                        <code className="text-[#006736] bg-[#E9F9EE] px-1 rounded font-mono font-bold">&#123;&#123;name&#125;&#125;</code>
                        <code className="text-[#006736] bg-[#E9F9EE] px-1 rounded font-mono font-bold">&#123;&#123;first_name&#125;&#125;</code>
                        <code className="text-[#006736] bg-[#E9F9EE] px-1 rounded font-mono font-bold">&#123;&#123;phone&#125;&#125;</code>
                      </div>
                    </div>
                  )}

                  {/* ADD_TAG Configuration */}
                  {act.type === 'ADD_TAG' && (
                    <div>
                      <Input
                        value={act.payload.tag || ''}
                        onChange={(e) => handleUpdateAction(idx, { tag: e.target.value })}
                        placeholder="Tag label (e.g. VIP, Pricing-Lead, Hot-Prospect)"
                      />
                    </div>
                  )}

                  {/* ASSIGN_AGENT Configuration */}
                  {act.type === 'ASSIGN_AGENT' && (
                    <div>
                      <select
                        value={act.payload.agentId || ''}
                        onChange={(e) => handleUpdateAction(idx, { agentId: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-[#E2EAE6] bg-white text-[#14201C] font-semibold focus:border-[#05A222] focus:outline-none"
                      >
                        <option value="">-- Select Team Member --</option>
                        {teamMembers.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Ultra-Realistic Modern iPhone Simulator */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-6">
          <div className="text-xs font-bold text-[#5F7069] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#05A222]" />
            <span>Interactive iPhone Simulator</span>
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
                      <div className="text-[9px] text-[#C4EBD0] leading-none">Official Business Bot</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 text-white/90">
                    <Video className="w-4 h-4" />
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Chat Canvas Body */}
              <div className="p-3 my-auto space-y-2.5">
                {/* Customer Inbound Message */}
                <div className="flex justify-end">
                  <div className="bg-[#D9FDD3] rounded-2xl rounded-tr-xs p-2.5 shadow-2xs max-w-[85%] text-xs text-[#14201C] space-y-1">
                    <div>{testMessage}</div>
                    <div className="text-[9px] text-right text-[#5F7069] flex items-center justify-end gap-1">
                      <span>12:44 PM</span>
                      <CheckCheck className="w-3 h-3 text-[#53BDEB]" />
                    </div>
                  </div>
                </div>

                {/* Bot Automated Reply Message */}
                {simulatedReply ? (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-tl-xs p-3 shadow-xs max-w-[90%] text-xs text-[#14201C] space-y-1.5">
                      <div className="font-bold text-[#008069] text-[10px] flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#05A222]" />
                        <span>Bot Auto-Response</span>
                      </div>
                      <div className="whitespace-pre-wrap leading-relaxed text-xs">{simulatedReply}</div>
                      <div className="text-[9px] text-right text-[#8A9993] flex items-center justify-end gap-1">
                        <span>12:45 PM</span>
                        <CheckCheck className="w-3 h-3 text-[#53BDEB]" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-3 bg-white/70 backdrop-blur-xs rounded-xl text-[11px] text-[#5F7069]">
                    Type a test message below to simulate the trigger.
                  </div>
                )}
              </div>

              {/* Message Simulator Input Box */}
              <div className="p-2.5 bg-white border-t border-[#E2EAE6] space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSimulate())}
                    placeholder="Type test message..."
                    className="flex-1 text-xs p-2 rounded-xl border border-[#E2EAE6] bg-[#F6FAF8] text-[#14201C] font-medium focus:outline-none focus:border-[#05A222]"
                  />
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleSimulate}
                    isLoading={isSimulating}
                    className="bg-[#05A222] hover:bg-[#006736] text-white text-xs font-bold px-3 py-2 rounded-xl"
                  >
                    Test
                  </Button>
                </div>
              </div>

              {/* iPhone Home Indicator */}
              <div className="pb-2 pt-1 flex justify-center bg-white">
                <div className="w-28 h-1 bg-black/20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
