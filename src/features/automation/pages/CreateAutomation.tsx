import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import type {
  TriggerType,
  ActionType,
  ActionItem,
  CreateAutomationPayload,
  WorkflowNode,
  NodeType,
} from '../types';
import { automationsApi } from '../api';
import { teamService } from '../../../services/teamService';
import { AutomationCanvas } from '../components/AutomationCanvas';
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
  Play,
  Layers,
  GitBranch,
  Sliders,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const CreateAutomation: React.FC = () => {
  const navigate = useNavigate();

  // Mode View Switcher: 'CANVAS' (Visual Node Flow) or 'FORM' (Classic Form)
  const [viewMode, setViewMode] = useState<'CANVAS' | 'FORM'>('CANVAS');

  // Basic Details
  const [name, setName] = useState('New WhatsApp Automation');
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

  // Visual Canvas Nodes State
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: 'node-trigger',
      type: 'trigger',
      title: 'Inbound Message Trigger',
      subtitle: 'Matches: "pricing", "rates", "cost"',
      data: { triggerType: 'KEYWORD', keywords: ['pricing', 'rates', 'cost'], matchType: 'CONTAINS' },
    },
    {
      id: 'node-1',
      type: 'send_message',
      title: 'Send Pricing Catalog',
      subtitle: 'WhatsApp Text Auto-reply',
      data: {
        text: 'Hello {{name}}! 👋 Thanks for reaching out. Here is our official pricing: Starter ($29/mo), Pro ($79/mo). Reply DEMO to book a walkthrough call.',
      },
    },
    {
      id: 'node-2',
      type: 'add_tag',
      title: 'Tag Contact: Pricing-Lead',
      subtitle: 'Apply CRM Tag',
      data: { tag: 'Pricing-Lead' },
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
    teamService
      .getTeamMembers()
      .then((res) => {
        if (res && res.members && res.members.length > 0) {
          setTeamMembers(
            res.members.map((m) => ({
              id: m.id || m._id || '',
              name: m.name || `${m.firstName || ''} ${m.lastName || ''}`.trim() || m.email,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  // Sync Nodes -> Actions & Trigger
  const syncNodesToPayload = (updatedNodes: WorkflowNode[]) => {
    setNodes(updatedNodes);

    const triggerNode = updatedNodes.find((n) => n.type === 'trigger');
    if (triggerNode && triggerNode.data) {
      if (triggerNode.data.triggerType) setTriggerType(triggerNode.data.triggerType);
      if (triggerNode.data.keywords) setKeywords(triggerNode.data.keywords);
    }

    const actionNodes = updatedNodes.filter((n) => n.type !== 'trigger');
    const newActions: ActionItem[] = actionNodes.map((n) => {
      switch (n.type) {
        case 'send_message':
        case 'action':
          return { type: 'SEND_TEXT', payload: { text: n.data?.text || 'Hello!' } };
        case 'add_tag':
          return { type: 'ADD_TAG', payload: { tag: n.data?.tag || 'Lead' } };
        case 'assign_agent':
          return { type: 'ASSIGN_AGENT', payload: { agentId: n.data?.agentId || '' } };
        case 'delay':
          return { type: 'INTERNAL_NOTE', payload: { note: `Delayed for ${n.data?.delayMinutes || 5} min` } };
        case 'webhook':
          return { type: 'TRIGGER_WEBHOOK', payload: { webhookUrl: n.data?.url || '' } };
        case 'ai_agent':
          return {
            type: 'SEND_TEXT',
            payload: { text: n.data?.prompt ? `[AI Router]: ${n.data.prompt}` : 'Automated AI Response' },
          };
        default:
          return { type: 'SEND_TEXT', payload: { text: n.data?.text || '' } };
      }
    });

    setActions(newActions);
  };

  const handleAddNodeToCanvas = (type: NodeType, insertIndex?: number) => {
    const newId = `node-${Date.now()}`;
    let newNode: WorkflowNode;

    switch (type) {
      case 'send_message':
        newNode = {
          id: newId,
          type: 'send_message',
          title: 'WhatsApp Reply',
          subtitle: 'Send text reply',
          data: { text: 'Hello {{name}}, thank you for contacting us!' },
        };
        break;
      case 'ai_agent':
        newNode = {
          id: newId,
          type: 'ai_agent',
          title: 'AI Smart Agent Response',
          subtitle: 'Autonomous GPT-4o-mini',
          data: { prompt: 'You are an intelligent support assistant. Answer customer questions politely.' },
        };
        break;
      case 'add_tag':
        newNode = {
          id: newId,
          type: 'add_tag',
          title: 'Apply Tag',
          subtitle: 'Add CRM tag',
          data: { tag: 'Qualified-Lead' },
        };
        break;
      case 'assign_agent':
        newNode = {
          id: newId,
          type: 'assign_agent',
          title: 'Route to Agent',
          subtitle: 'Assign to operator',
          data: { agentId: teamMembers[0]?.id || '' },
        };
        break;
      case 'delay':
        newNode = {
          id: newId,
          type: 'delay',
          title: 'Delay Timer',
          subtitle: 'Wait 5 minutes',
          data: { delayMinutes: 5 },
        };
        break;
      case 'webhook':
        newNode = {
          id: newId,
          type: 'webhook',
          title: 'HTTP Webhook',
          subtitle: 'Call external endpoint',
          data: { url: 'https://api.yourdomain.com/webhook' },
        };
        break;
      default:
        newNode = {
          id: newId,
          type: 'send_message',
          title: 'WhatsApp Action',
          data: { text: 'Hello!' },
        };
    }

    let updated: WorkflowNode[];
    if (insertIndex !== undefined && insertIndex > 0) {
      updated = [...nodes];
      updated.splice(insertIndex, 0, newNode);
    } else {
      updated = [...nodes, newNode];
    }

    syncNodesToPayload(updated);
  };

  const handleDeleteNodeFromCanvas = (id: string) => {
    if (id === 'node-trigger') return; // Cannot delete trigger node
    const updated = nodes.filter((n) => n.id !== id);
    syncNodesToPayload(updated);
  };

  const handleUpdateNodeOnCanvas = (id: string, updatedData: any) => {
    const updated = nodes.map((n) => (n.id === id ? { ...n, data: updatedData } : n));
    syncNodesToPayload(updated);
  };

  const handleAddKeyword = () => {
    const trimmed = keywordInput.trim().toLowerCase();
    if (trimmed && !keywords.includes(trimmed)) {
      const nextKw = [...keywords, trimmed];
      setKeywords(nextKw);
      setKeywordInput('');

      // Update trigger node
      const updated = nodes.map((n) =>
        n.type === 'trigger' ? { ...n, data: { ...n.data, keywords: nextKw } } : n
      );
      setNodes(updated);
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    const nextKw = keywords.filter((k) => k !== kw);
    setKeywords(nextKw);
    const updated = nodes.map((n) =>
      n.type === 'trigger' ? { ...n, data: { ...n.data, keywords: nextKw } } : n
    );
    setNodes(updated);
  };

  const handleAddAction = (type: ActionType) => {
    let payload: any = {};
    if (type === 'SEND_TEXT') {
      payload = { text: 'Hello {{name}}, thank you for contacting us!' };
      handleAddNodeToCanvas('send_message');
    } else if (type === 'ADD_TAG') {
      payload = { tag: 'Lead' };
      handleAddNodeToCanvas('add_tag');
    } else if (type === 'ASSIGN_AGENT') {
      payload = { agentId: teamMembers[0]?.id || '' };
      handleAddNodeToCanvas('assign_agent');
    } else if (type === 'UPDATE_STATUS') {
      payload = { status: 'OPEN' };
      handleAddNodeToCanvas('send_message');
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
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black text-[#14201C] tracking-tight">
              {name || 'New Automation Flow'}
            </h2>
            <span className="text-xs bg-[#E9F9EE] text-[#006736] px-2.5 py-0.5 rounded-full font-bold border border-[#C4EBD0]">
              Visual Node Builder
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <div className="bg-[#F6FAF8] p-1 rounded-xl border border-[#E2EAE6] flex items-center gap-1">
            <button
              onClick={() => setViewMode('CANVAS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'CANVAS'
                  ? 'bg-white text-[#006736] shadow-2xs border border-[#C4EBD0]'
                  : 'text-[#5F7069] hover:text-[#14201C]'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 text-[#05A222]" />
              <span>Flow Canvas</span>
            </button>
            <button
              onClick={() => setViewMode('FORM')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'FORM'
                  ? 'bg-white text-[#006736] shadow-2xs border border-[#C4EBD0]'
                  : 'text-[#5F7069] hover:text-[#14201C]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Form View</span>
            </button>
          </div>

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
            className="bg-[#05A222] hover:bg-[#006736] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs cursor-pointer"
          >
            Save & Activate
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
        {/* Left Side: Visual Node Canvas OR Form View */}
        <div className="lg:col-span-7 space-y-6">
          {viewMode === 'CANVAS' ? (
            <div className="space-y-4">
              {/* Quick Details Bar */}
              <div className="bg-white p-4 rounded-2xl border border-[#E2EAE6] flex items-center justify-between gap-4 shadow-xs">
                <div className="flex-1">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rule Name (e.g. Lead Qualification Bot)"
                    className="w-full text-sm font-bold text-[#14201C] bg-transparent border-none focus:outline-none placeholder-slate-400"
                  />
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add an optional description..."
                    className="w-full text-xs text-[#5F7069] bg-transparent border-none focus:outline-none placeholder-slate-400 mt-0.5"
                  />
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 text-[#05A222] rounded-md focus:ring-[#05A222] accent-[#05A222]"
                    />
                    <span className="text-xs font-bold text-[#14201C]">Active</span>
                  </label>
                </div>
              </div>

              {/* Visual Node Flow Canvas */}
              <AutomationCanvas
                nodes={nodes}
                onAddNode={handleAddNodeToCanvas}
                onDeleteNode={handleDeleteNodeFromCanvas}
                onUpdateNode={handleUpdateNodeOnCanvas}
                onRunTest={handleSimulate}
                isTesting={isSimulating}
              />
            </div>
          ) : (
            /* Classic Form View */
            <div className="space-y-6">
              {/* Section 1: Basic Information */}
              <div className="bg-white p-6 rounded-2xl border border-[#E2EAE6] shadow-xs space-y-4">
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
                          className="w-4 h-4 text-[#05A222] rounded-md focus:ring-[#05A222] accent-[#05A222]"
                        />
                        <span className="text-xs font-bold text-[#14201C]">Active immediately upon save</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Trigger Selection */}
              <div className="bg-white p-6 rounded-2xl border border-[#E2EAE6] shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#14201C] border-b border-[#E2EAE6] pb-3">
                  <Zap className="w-4 h-4 text-[#05A222]" />
                  <span>2. Trigger Condition</span>
                </div>

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
                          <option value="CONTAINS">Contains Keyword</option>
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
                            className="w-4 h-4 text-[#05A222] rounded-md accent-[#05A222]"
                          />
                          <span className="text-xs font-semibold text-[#14201C]">Case Sensitive Match</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

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
                  </div>
                )}
              </div>

              {/* Section 3: Actions Chain Builder */}
              <div className="bg-white p-6 rounded-2xl border border-[#E2EAE6] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#14201C]">
                    <Play className="w-4 h-4 text-[#05A222]" />
                    <span>3. Executed Actions ({actions.length})</span>
                  </div>

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

                      {act.type === 'SEND_TEXT' && (
                        <div className="space-y-1.5">
                          <textarea
                            rows={3}
                            value={act.payload.text || ''}
                            onChange={(e) => handleUpdateAction(idx, { text: e.target.value })}
                            placeholder="Type WhatsApp reply message..."
                            className="w-full text-xs p-3 rounded-xl border border-[#E2EAE6] bg-white text-[#14201C] font-sans leading-relaxed focus:border-[#05A222] focus:outline-none shadow-2xs"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Ultra-Realistic Modern iPhone Simulator */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-6">
          <div className="text-xs font-bold text-[#5F7069] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#05A222]" />
            <span>Interactive iPhone Simulator</span>
          </div>

          {/* iPhone Chassis */}
          <div className="w-full max-w-[330px] bg-[#1C1C1E] rounded-[48px] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.08)] ring-1 ring-black/40">
            {/* Screen Inner Glass */}
            <div className="bg-[#EFEAE2] rounded-[38px] min-h-[540px] flex flex-col justify-between overflow-hidden relative shadow-inner">
              {/* iOS Top Status Bar & Dynamic Island */}
              <div className="bg-[#008069] text-white pt-2.5 pb-1 px-5">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span>9:41</span>
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
                  <div className="flex items-center gap-2">
                    <ChevronLeft className="w-5 h-5 cursor-pointer" />
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                      B
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-none">Business Support</div>
                      <div className="text-[9px] text-emerald-100 flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                        <span>Automation Bot Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <Video className="w-4 h-4 cursor-pointer" />
                    <Phone className="w-3.5 h-3.5 cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* WhatsApp Chat Bubble Stream */}
              <div
                className="flex-1 p-3.5 space-y-3 overflow-y-auto"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.02' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
              >
                {/* Date Header Pill */}
                <div className="flex justify-center">
                  <span className="text-[10px] bg-white/80 backdrop-blur-xs text-[#5F7069] px-2.5 py-0.5 rounded-full shadow-2xs font-semibold">
                    TODAY
                  </span>
                </div>

                {/* Simulated Inbound Customer Message */}
                <div className="flex flex-col items-end">
                  <div className="bg-[#E7FFDB] text-[#111B21] px-3 py-2 rounded-xl rounded-tr-xs text-[11px] max-w-[82%] shadow-2xs leading-relaxed relative">
                    <span>{testMessage}</span>
                    <div className="flex items-center justify-end gap-1 text-[8px] text-[#667781] mt-0.5">
                      <span>9:41 AM</span>
                      <CheckCheck className="w-3 h-3 text-[#53BDEB]" />
                    </div>
                  </div>
                </div>

                {/* Simulated Automated Response from Action Chain */}
                {isSimulating ? (
                  <div className="flex flex-col items-start">
                    <div className="bg-white text-[#111B21] px-3 py-2 rounded-xl rounded-tl-xs text-[11px] shadow-2xs flex items-center gap-1.5 text-[#5F7069]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#05A222] animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#05A222] animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#05A222] animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                ) : simulatedReply ? (
                  <div className="flex flex-col items-start animate-fade-in">
                    <div className="bg-white text-[#111B21] px-3 py-2 rounded-xl rounded-tl-xs text-[11px] max-w-[85%] shadow-2xs leading-relaxed">
                      <span>{simulatedReply}</span>
                      <div className="flex items-center justify-end text-[8px] text-[#667781] mt-0.5">
                        <span>9:41 AM</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center my-4">
                    <span className="text-[10px] text-[#5F7069] bg-white/70 px-2 py-1 rounded-md text-center">
                      Type test message below and click <strong>Test</strong> to simulate flow execution.
                    </span>
                  </div>
                )}
              </div>

              {/* iPhone Interactive Message Input Bar */}
              <div className="bg-[#F0F2F5] p-2.5 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSimulate()}
                    placeholder="Type test message..."
                    className="flex-1 bg-white text-[#111B21] text-[11px] px-3 py-1.5 rounded-full border border-slate-300 focus:outline-none focus:border-[#008069]"
                  />
                  <button
                    type="button"
                    onClick={handleSimulate}
                    disabled={isSimulating}
                    className="bg-[#008069] text-white p-1.5 rounded-full shadow-xs hover:bg-[#006736] transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default CreateAutomation;
