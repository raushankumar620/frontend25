import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCheck,
  Bot,
  AlertCircle,
  Clock,
  CheckCircle2,
  Sliders,
  Search,
  RefreshCw,
  MessageSquare,
  ShieldAlert,
  User,
  Check,
  Plus,
  X,
  Radio,
} from 'lucide-react';
import { aiService } from '../../../services/aiService';
import type { AIHandoffItem, AIHandoffStats, AIHandoffSettings } from '../types';
import { ROUTES } from '../../../utils/constants';

export const AIHandoff: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'queue' | 'settings' | 'history'>('queue');
  const [queue, setQueue] = useState<AIHandoffItem[]>([]);
  const [stats, setStats] = useState<AIHandoffStats>({
    pendingQueue: 0,
    activeClaimed: 0,
    totalResolved: 0,
    totalHandoffs: 0,
    avgWaitMinutes: 0,
    claimRate: 100,
  });
  const [settings, setSettings] = useState<AIHandoffSettings>({
    keywords: ['human', 'agent', 'support', 'executive', 'person', 'representative', 'helpdesk'],
    confidenceThreshold: 0.65,
    autoHandoffOnToolError: true,
    assignmentPolicy: 'CLAIM_QUEUE',
    fallbackMessage: "I'm connecting you with a human representative right now. Please hold on!",
  });

  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [newKeyword, setNewKeyword] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Resolve Modal State
  const [resolvingHandoff, setResolvingHandoff] = useState<AIHandoffItem | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [returnToAi, setReturnToAi] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [queueRes, statsRes, settingsRes] = await Promise.all([
        aiService.getHandoffQueue({ status: activeTab === 'history' ? 'RESOLVED' : 'ALL' }),
        aiService.getHandoffStats(),
        aiService.getHandoffSettings(),
      ]);

      setQueue(queueRes.handoffs || []);
      if (statsRes) setStats(statsRes);
      if (settingsRes) setSettings(settingsRes);
    } catch (err: any) {
      console.error('Failed to load handoff data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      aiService.getHandoffStats().then((res) => {
        if (res) setStats(res);
      }).catch(() => {});
    }, 10000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleClaim = async (handoff: AIHandoffItem) => {
    try {
      setActionLoading(true);
      const idOrConvId = handoff._id || (typeof handoff.conversationId === 'object' ? handoff.conversationId._id : handoff.conversationId);
      await aiService.claimHandoff(idOrConvId);
      showToast('Conversation claimed successfully! Redirecting to inbox...');
      fetchData();
      setTimeout(() => {
        navigate(ROUTES.INBOX);
      }, 1000);
    } catch (err: any) {
      showToast(err.message || 'Failed to claim conversation', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResumeAi = async (handoff: AIHandoffItem) => {
    try {
      setActionLoading(true);
      const convId = typeof handoff.conversationId === 'object' ? handoff.conversationId._id : handoff.conversationId;
      await aiService.resumeAi(convId);
      showToast('AI autonomous agent resumed on conversation');
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Failed to resume AI', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolveSubmit = async () => {
    if (!resolvingHandoff) return;
    try {
      setActionLoading(true);
      const idOrConvId = resolvingHandoff._id || (typeof resolvingHandoff.conversationId === 'object' ? resolvingHandoff.conversationId._id : resolvingHandoff.conversationId);
      await aiService.resolveHandoff(idOrConvId, {
        resolutionNotes,
        returnToAi,
      });
      showToast(returnToAi ? 'Handoff resolved and returned to AI' : 'Handoff marked as resolved');
      setResolvingHandoff(null);
      setResolutionNotes('');
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Failed to resolve handoff', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      await aiService.updateHandoffSettings(settings);
      showToast('Handoff trigger rules saved successfully');
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    const kw = newKeyword.trim().toLowerCase();
    if (!settings.keywords.includes(kw)) {
      setSettings({
        ...settings,
        keywords: [...settings.keywords, kw],
      });
    }
    setNewKeyword('');
  };

  const handleRemoveKeyword = (kwToRemove: string) => {
    setSettings({
      ...settings,
      keywords: settings.keywords.filter((kw) => kw !== kwToRemove),
    });
  };

  const filteredQueue = queue.filter((item) => {
    const contactName = item.contactId?.name || '';
    const contactPhone = item.contactId?.phoneNumber || '';
    const reason = item.reason || '';
    const matchesSearch =
      contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contactPhone.includes(searchQuery) ||
      reason.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = priorityFilter === 'ALL' || item.priority === priorityFilter;

    if (activeTab === 'queue') {
      return matchesSearch && matchesPriority && item.status !== 'RESOLVED';
    }
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {statusMessage && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 text-sm font-semibold border ${
            statusMessage.type === 'success'
              ? 'bg-[#E9F9EE] text-[#006736] border-[#C4EBD0]'
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}
        >
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-[#05A222]" /> : <AlertCircle className="w-5 h-5" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2EAE6] shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#05A222]">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#14201C]">AI Human Handoff Protocol</h1>
              <p className="text-xs text-[#5F7069] mt-0.5">
                Seamlessly transfer conversations between AI bot and live human support agents
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 bg-[#F6FAF8] text-[#5F7069] hover:text-[#14201C] rounded-xl border border-[#E2EAE6] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => navigate(ROUTES.AI_DASHBOARD)}
            className="px-3.5 py-2 bg-white text-[#14201C] hover:bg-[#F6FAF8] rounded-xl border border-[#E2EAE6] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Bot className="w-4 h-4 text-[#05A222]" />
            <span>AI Agents</span>
          </button>
          <button
            onClick={() => navigate(ROUTES.INBOX)}
            className="px-4 py-2 bg-[#05A222] hover:bg-[#006736] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Shared Live Inbox</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E2EAE6] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#5F7069]">Waiting in Queue</p>
            {stats.pendingQueue > 0 ? (
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
            ) : (
              <Clock className="w-4 h-4 text-[#5F7069]" />
            )}
          </div>
          <p className="text-2xl font-bold text-[#14201C] mt-2">{stats.pendingQueue}</p>
          <p className="text-[11px] text-[#5F7069] mt-1">Pending agent assignment</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2EAE6] shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#5F7069]">Active Claimed</p>
            <User className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-[#14201C] mt-2">{stats.activeClaimed}</p>
          <p className="text-[11px] text-[#5F7069] mt-1">In progress with human agents</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2EAE6] shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#5F7069]">Avg Wait Time</p>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-[#14201C] mt-2">{stats.avgWaitMinutes} min</p>
          <p className="text-[11px] text-[#5F7069] mt-1">Before operator pickup</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2EAE6] shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#5F7069]">Total Resolved</p>
            <CheckCircle2 className="w-4 h-4 text-[#05A222]" />
          </div>
          <p className="text-2xl font-bold text-[#14201C] mt-2">{stats.totalResolved}</p>
          <p className="text-[11px] text-[#5F7069] mt-1">{stats.claimRate}% operator pickup rate</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2EAE6] pb-2">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'queue'
              ? 'bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]'
              : 'text-[#5F7069] hover:bg-[#F6FAF8]'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Live Handoff Queue ({stats.pendingQueue + stats.activeClaimed})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]'
              : 'text-[#5F7069] hover:bg-[#F6FAF8]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Trigger Rules & Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]'
              : 'text-[#5F7069] hover:bg-[#F6FAF8]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Resolution History</span>
        </button>
      </div>

      {/* TAB 1: Live Queue */}
      {(activeTab === 'queue' || activeTab === 'history') && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#5F7069] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer, phone, or reason..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#E2EAE6] rounded-xl text-xs text-[#14201C] focus:outline-none focus:border-[#05A222]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              {['ALL', 'URGENT', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                    priorityFilter === p
                      ? 'bg-[#14201C] text-white'
                      : 'bg-white text-[#5F7069] border border-[#E2EAE6] hover:bg-[#F6FAF8]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Queue List */}
          {loading ? (
            <div className="bg-white p-12 rounded-2xl border border-[#E2EAE6] text-center">
              <RefreshCw className="w-8 h-8 text-[#05A222] animate-spin mx-auto mb-3" />
              <p className="text-xs text-[#5F7069] font-medium">Loading live handoff queue...</p>
            </div>
          ) : filteredQueue.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-[#E2EAE6] text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E9F9EE] text-[#05A222] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#14201C]">
                {activeTab === 'queue' ? 'Queue is clear! No waiting customers.' : 'No history found.'}
              </h3>
              <p className="text-xs text-[#5F7069] max-w-sm mx-auto">
                {activeTab === 'queue'
                  ? 'All conversations are currently handled smoothly by your AI autonomous bots or active agents.'
                  : 'Resolved handoff conversations will be listed here.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3.5">
              {filteredQueue.map((item) => {
                const priorityBadge =
                  item.priority === 'URGENT'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : item.priority === 'HIGH'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200';

                const statusBadge =
                  item.status === 'PENDING'
                    ? 'bg-rose-100 text-rose-800'
                    : item.status === 'CLAIMED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-700';

                return (
                  <div
                    key={item._id}
                    className="bg-white p-5 rounded-2xl border border-[#E2EAE6] hover:border-[#05A222]/40 transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-[#E9F9EE] border border-[#C4EBD0] text-[#05A222] font-bold flex items-center justify-center shrink-0">
                        {item.contactId?.name ? item.contactId.name.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-[#14201C]">{item.contactId?.name || 'Customer'}</h4>
                          <span className="text-xs text-[#5F7069]">{item.contactId?.phoneNumber}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityBadge}`}>
                            {item.priority}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadge}`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#14201C] font-medium flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>{item.reason}</span>
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-[#5F7069]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Requested {new Date(item.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </span>
                          <span>•</span>
                          <span>Trigger: <strong>{item.triggerType}</strong></span>
                          {item.assignedAgentId && (
                            <>
                              <span>•</span>
                              <span>Assigned to: <strong>{item.assignedAgentId.name || 'Agent'}</strong></span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      {item.status === 'PENDING' && (
                        <button
                          onClick={() => handleClaim(item)}
                          disabled={actionLoading}
                          className="px-4 py-2 bg-[#05A222] hover:bg-[#006736] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Claim & Answer</span>
                        </button>
                      )}

                      {item.status === 'CLAIMED' && (
                        <>
                          <button
                            onClick={() => navigate(ROUTES.INBOX)}
                            className="px-3.5 py-2 bg-[#E9F9EE] text-[#006736] hover:bg-[#C4EBD0] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Open in Inbox</span>
                          </button>
                          <button
                            onClick={() => setResolvingHandoff(item)}
                            className="px-3 py-2 bg-white text-[#14201C] hover:bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#05A222]" />
                            <span>Resolve</span>
                          </button>
                        </>
                      )}

                      {item.status !== 'RESUMED_AI' && (
                        <button
                          onClick={() => handleResumeAi(item)}
                          disabled={actionLoading}
                          title="Return conversation to AI agent"
                          className="p-2 text-[#5F7069] hover:text-[#05A222] hover:bg-[#E9F9EE] rounded-xl border border-[#E2EAE6] transition-colors cursor-pointer"
                        >
                          <Bot className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Settings & Rules */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-[#E2EAE6] shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#14201C]">Handoff Trigger Rules</h3>
            <p className="text-xs text-[#5F7069] mt-0.5">
              Define the conditions that immediately route customer conversations to live human operators
            </p>
          </div>

          {/* Keywords Manager */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#14201C] block">
              Trigger Keywords (Customer explicit intent)
            </label>
            <p className="text-[11px] text-[#5F7069]">
              If an inbound WhatsApp message contains any of these phrases, AI will pause auto-reply and notify agents.
            </p>

            <div className="flex flex-wrap gap-2 p-3 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl">
              {settings.keywords.map((kw) => (
                <span
                  key={kw}
                  className="px-2.5 py-1 bg-white border border-[#C4EBD0] text-[#006736] rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                >
                  <span>{kw}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(kw)}
                    className="hover:text-rose-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
                placeholder="Type keyword and press Add (e.g., representative, real person, supervisor)..."
                className="flex-1 px-3.5 py-2 bg-white border border-[#E2EAE6] rounded-xl text-xs text-[#14201C] focus:outline-none focus:border-[#05A222]"
              />
              <button
                type="button"
                onClick={handleAddKeyword}
                className="px-4 py-2 bg-white text-[#14201C] hover:bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#05A222]" />
                <span>Add Keyword</span>
              </button>
            </div>
          </div>

          {/* Confidence Threshold */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#14201C]">
                AI Confidence Threshold
              </label>
              <span className="text-xs font-bold text-[#05A222] bg-[#E9F9EE] px-2 py-0.5 rounded-md">
                {Math.round(settings.confidenceThreshold * 100)}%
              </span>
            </div>
            <p className="text-[11px] text-[#5F7069]">
              Trigger human handoff if AI model certainty drops below this threshold.
            </p>
            <input
              type="range"
              min="0.30"
              max="0.95"
              step="0.05"
              value={settings.confidenceThreshold}
              onChange={(e) =>
                setSettings({ ...settings, confidenceThreshold: parseFloat(e.target.value) })
              }
              className="w-full accent-[#05A222] cursor-pointer"
            />
          </div>

          {/* Tool Failure Trigger Toggle */}
          <div className="flex items-center justify-between p-4 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl">
            <div>
              <p className="text-xs font-bold text-[#14201C]">Auto-Handoff on Tool / Webhook Failure</p>
              <p className="text-[11px] text-[#5F7069] mt-0.5">
                Automatically escalate to human support if an automated tool or external CRM webhook returns an error.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoHandoffOnToolError}
                onChange={(e) =>
                  setSettings({ ...settings, autoHandoffOnToolError: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#05A222]"></div>
            </label>
          </div>

          {/* Assignment Policy */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#14201C] block">
              Agent Assignment Policy
            </label>
            <select
              value={settings.assignmentPolicy}
              onChange={(e) =>
                setSettings({ ...settings, assignmentPolicy: e.target.value as any })
              }
              className="w-full px-3.5 py-2.5 bg-white border border-[#E2EAE6] rounded-xl text-xs text-[#14201C] focus:outline-none focus:border-[#05A222]"
            >
              <option value="CLAIM_QUEUE">Claim Queue (Pending queue visible to all active agents)</option>
              <option value="ROUND_ROBIN">Round Robin (Auto-assign evenly across online agents)</option>
            </select>
          </div>

          {/* Fallback Message */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#14201C] block">
              Customer Notification Message on Handoff
            </label>
            <textarea
              rows={2}
              value={settings.fallbackMessage}
              onChange={(e) =>
                setSettings({ ...settings, fallbackMessage: e.target.value })
              }
              className="w-full px-3.5 py-2.5 bg-white border border-[#E2EAE6] rounded-xl text-xs text-[#14201C] focus:outline-none focus:border-[#05A222]"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingSettings}
              className="px-5 py-2.5 bg-[#05A222] hover:bg-[#006736] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              {savingSettings ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>Save Trigger Rules</span>
            </button>
          </div>
        </form>
      )}

      {/* Resolve Modal */}
      {resolvingHandoff && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2EAE6] max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#14201C]">Resolve Handoff</h3>
              <button onClick={() => setResolvingHandoff(null)} className="text-[#5F7069] hover:text-[#14201C]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#5F7069]">
              Resolving conversation with <strong>{resolvingHandoff.contactId?.name || 'Customer'}</strong>.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#14201C]">Resolution Notes</label>
              <textarea
                rows={3}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Describe resolution summary or actions taken..."
                className="w-full px-3.5 py-2.5 bg-white border border-[#E2EAE6] rounded-xl text-xs text-[#14201C] focus:outline-none focus:border-[#05A222]"
              />
            </div>

            <label className="flex items-center gap-2.5 text-xs text-[#14201C] font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={returnToAi}
                onChange={(e) => setReturnToAi(e.target.checked)}
                className="w-4 h-4 accent-[#05A222] rounded"
              />
              <span>Return conversation back to AI Agent for future messages</span>
            </label>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResolvingHandoff(null)}
                className="px-4 py-2 bg-white text-[#5F7069] hover:bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResolveSubmit}
                disabled={actionLoading}
                className="px-4 py-2 bg-[#05A222] hover:bg-[#006736] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Confirm Resolution</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIHandoff;
