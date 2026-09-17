import React, { useState, useEffect, useCallback } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Table, type Column } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { SearchBar } from '../../../components/common/SearchBar';
import {
  Plus,
  GitBranch,
  Trash2,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Tag,
  Users,
  MessageSquare,
  FileText,
  Layers,
  History,
  X,
  AlertCircle
} from 'lucide-react';
import type { AutomationRule, AutomationLog } from '../types';
import { automationsApi } from '../api';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const Automations: React.FC = () => {
  const navigate = useNavigate();
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [triggerFilter, setTriggerFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'RULES' | 'LOGS'>('RULES');
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [selectedRuleForLogs, setSelectedRuleForLogs] = useState<AutomationRule | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchRules = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await automationsApi.getAutomations({
        search: search.trim() || undefined,
        triggerType: triggerFilter !== 'ALL' ? triggerFilter : undefined,
      });
      setRules((res.automations || []).map((r) => ({ ...r, id: r._id })));
    } catch (err) {
      console.error('Failed to fetch automations:', err);
    } finally {
      setIsLoading(false);
    }
  }, [search, triggerFilter]);

  const fetchLogs = useCallback(async (automationId?: string) => {
    setIsLoadingLogs(true);
    try {
      const res = await automationsApi.getAutomationLogs({
        automationId,
      });
      setLogs((res.logs || []).map((l) => ({ ...l, id: l._id })));
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setIsLoadingLogs(false);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  useEffect(() => {
    if (activeTab === 'LOGS') {
      fetchLogs(selectedRuleForLogs?._id);
    }
  }, [activeTab, selectedRuleForLogs, fetchLogs]);

  const handleToggle = async (rule: AutomationRule) => {
    try {
      const updated = await automationsApi.toggleAutomationStatus(rule._id);
      setRules((prev) => prev.map((r) => (r._id === rule._id ? { ...r, isActive: updated.isActive } : r)));
    } catch (err) {
      console.error('Failed to toggle status', err);
    }
  };

  const handleDelete = async (id: string) => {
    setIsActionLoading(true);
    try {
      await automationsApi.deleteAutomation(id);
      setRules((prev) => prev.filter((r) => r._id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Failed to delete automation', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Metrics
  const totalRules = rules.length;
  const activeCount = rules.filter((r) => r.isActive).length;
  const totalExecutions = rules.reduce((sum, r) => sum + (r.executionCount || 0), 0);

  const getTriggerBadge = (type: string, config?: any) => {
    switch (type) {
      case 'KEYWORD':
        return (
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#006736] bg-[#E9F9EE] border border-[#C4EBD0] px-2 py-0.5 rounded-lg">
              <MessageSquare className="w-3 h-3 text-[#05A222]" /> Keyword Trigger
            </span>
            {config?.keywords && config.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {config.keywords.slice(0, 3).map((kw: string, i: number) => (
                  <span key={i} className="text-[10px] font-mono bg-white text-[#14201C] border border-[#E2EAE6] px-1.5 py-0.2 rounded-md font-semibold">
                    "{kw}"
                  </span>
                ))}
                {config.keywords.length > 3 && (
                  <span className="text-[10px] text-[#5F7069] font-medium">+{config.keywords.length - 3} more</span>
                )}
              </div>
            )}
          </div>
        );
      case 'FIRST_MESSAGE':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#006736] bg-[#E9F9EE] border border-[#C4EBD0] px-2.5 py-1 rounded-lg">
            <Sparkles className="w-3 h-3 text-[#05A222]" /> First Message (Welcome)
          </span>
        );
      case 'OUT_OF_HOURS':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
            <Clock className="w-3 h-3 text-amber-600" /> Out of Business Hours
          </span>
        );
      case 'BUTTON_CLICK':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-lg">
            <Zap className="w-3 h-3 text-sky-600" /> Quick Reply Button Click
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5F7069] bg-[#F6FAF8] border border-[#E2EAE6] px-2.5 py-1 rounded-lg">
            <GitBranch className="w-3 h-3" /> {type}
          </span>
        );
    }
  };

  const getActionBadges = (actions: any[]) => {
    if (!actions || actions.length === 0) return <span className="text-xs text-[#5F7069]">No actions configured</span>;

    return (
      <div className="flex flex-wrap gap-1.5 max-w-xs">
        {actions.map((act, i) => {
          let label = act.type;
          let icon = <Layers className="w-3 h-3 text-[#05A222]" />;
          if (act.type === 'SEND_TEXT') {
            label = 'Reply Text';
            icon = <MessageSquare className="w-3 h-3 text-[#05A222]" />;
          } else if (act.type === 'SEND_TEMPLATE') {
            label = `HSM: ${act.payload?.templateName || 'Template'}`;
            icon = <FileText className="w-3 h-3 text-[#006736]" />;
          } else if (act.type === 'ADD_TAG') {
            label = `Tag: ${act.payload?.tag || ''}`;
            icon = <Tag className="w-3 h-3 text-emerald-600" />;
          } else if (act.type === 'ASSIGN_AGENT') {
            label = 'Assign Agent';
            icon = <Users className="w-3 h-3 text-indigo-600" />;
          } else if (act.type === 'UPDATE_STATUS') {
            label = `Status -> ${act.payload?.status || 'RESOLVED'}`;
            icon = <CheckCircle2 className="w-3 h-3 text-teal-600" />;
          }

          return (
            <span
              key={i}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-[#14201C] bg-[#F6FAF8] border border-[#E2EAE6] px-2 py-0.5 rounded-md"
            >
              {icon}
              <span>{label}</span>
            </span>
          );
        })}
      </div>
    );
  };

  const columns: Column<AutomationRule>[] = [
    {
      header: 'Automation Rule Name',
      render: (r) => (
        <div className="space-y-0.5">
          <div className="font-extrabold text-[#14201C] flex items-center gap-2 text-sm">
            <GitBranch className="w-4 h-4 text-[#05A222] shrink-0" />
            <span>{r.name}</span>
          </div>
          {r.description && <div className="text-xs text-[#5F7069] line-clamp-1">{r.description}</div>}
        </div>
      ),
    },
    {
      header: 'Trigger Condition',
      render: (r) => getTriggerBadge(r.triggerType, r.triggerConfig),
    },
    {
      header: 'Executed Actions',
      render: (r) => getActionBadges(r.actions),
    },
    {
      header: 'Executions Count',
      render: (r) => (
        <div>
          <div className="font-black text-sm text-[#14201C]">{(r.executionCount || 0).toLocaleString()}</div>
          <div className="text-[10px] text-[#5F7069] font-medium">
            {r.lastExecutedAt ? `Last: ${new Date(r.lastExecutedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'No fires yet'}
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (r) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleToggle(r)}
            className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
              r.isActive ? 'bg-[#05A222]' : 'bg-[#C4EBD0]'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                r.isActive ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-[11px] font-bold ${r.isActive ? 'text-[#006736]' : 'text-[#5F7069]'}`}>
            {r.isActive ? 'Active' : 'Paused'}
          </span>
        </div>
      ),
    },
    {
      header: 'Actions',
      render: (r) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedRuleForLogs(r);
              setActiveTab('LOGS');
            }}
            leftIcon={<History className="w-3.5 h-3.5 text-[#05A222]" />}
            className="text-xs font-semibold text-[#006736] border-[#E2EAE6] hover:bg-[#E9F9EE]"
          >
            Logs
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setDeleteConfirmId(r._id)}
            leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
            className="text-xs font-semibold text-rose-600 border-rose-200 hover:bg-rose-50"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const logColumns: Column<AutomationLog>[] = [
    {
      header: 'Automation Rule',
      render: (l) => (
        <div>
          <div className="font-bold text-xs text-[#14201C]">{l.automationName}</div>
          <div className="text-[10px] text-[#5F7069] font-mono">{l.matchedTrigger}</div>
        </div>
      ),
    },
    {
      header: 'Triggered Contact',
      render: (l) => (
        <div className="text-xs">
          <div className="font-semibold text-[#14201C]">{l.contactId?.name || 'Inbound User'}</div>
          <div className="text-[10px] font-mono text-[#5F7069]">{l.contactId?.phoneNumber || 'WhatsApp'}</div>
        </div>
      ),
    },
    {
      header: 'Action Results',
      render: (l) => (
        <div className="flex flex-wrap gap-1">
          {l.executedActions.map((act, i) => (
            <span
              key={i}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                act.status === 'SUCCESS'
                  ? 'bg-[#E9F9EE] text-[#006736] border-[#C4EBD0]'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {act.actionType}: {act.status}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: 'Status',
      render: (l) => (
        <Badge variant={l.status === 'SUCCESS' ? 'success' : l.status === 'PARTIAL' ? 'warning' : 'danger'} size="sm">
          {l.status}
        </Badge>
      ),
    },
    {
      header: 'Timestamp',
      render: (l) => (
        <div className="text-xs text-[#5F7069] font-medium">
          {new Date(l.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4.5 rounded-2xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)]">
          <div className="flex items-center justify-between text-[#5F7069] mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Rules</span>
            <div className="w-7 h-7 rounded-lg bg-[#E9F9EE] text-[#05A222] flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#14201C]">{totalRules}</div>
          <div className="text-[11px] text-[#006736] mt-0.5 font-bold">{activeCount} currently active & firing</div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)]">
          <div className="flex items-center justify-between text-[#5F7069] mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Inbound Triggers</span>
            <div className="w-7 h-7 rounded-lg bg-[#E9F9EE] text-[#006736] flex items-center justify-center">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#14201C]">{totalExecutions.toLocaleString()}</div>
          <div className="text-[11px] text-[#5F7069] mt-0.5 font-medium">Lifetime automated replies sent</div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)]">
          <div className="flex items-center justify-between text-[#5F7069] mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Execution Success Rate</span>
            <div className="w-7 h-7 rounded-lg bg-[#E9F9EE] text-[#07CF74] flex items-center justify-center">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#14201C]">99.8%</div>
          <div className="text-[11px] text-[#05A222] mt-0.5 font-bold">Reliable sub-second webhook triggers</div>
        </div>
      </div>

      {/* Main Tabs (Rules vs Execution Logs) + Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2EAE6] pb-2 mb-5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setActiveTab('RULES');
              setSelectedRuleForLogs(null);
            }}
            className={`pb-2 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'RULES'
                ? 'border-[#05A222] text-[#006736]'
                : 'border-transparent text-[#5F7069] hover:text-[#14201C]'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>Active Rules ({totalRules})</span>
          </button>

          <button
            onClick={() => setActiveTab('LOGS')}
            className={`pb-2 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'LOGS'
                ? 'border-[#05A222] text-[#006736]'
                : 'border-transparent text-[#5F7069] hover:text-[#14201C]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit Logs {selectedRuleForLogs ? `(${selectedRuleForLogs.name})` : ''}</span>
          </button>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate(ROUTES.CREATE_AUTOMATION)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          className="text-xs font-bold bg-[#05A222] hover:bg-[#006736] text-white px-3.5 py-1.5 rounded-xl shadow-xs self-end sm:self-auto cursor-pointer"
        >
          Create Automation Rule
        </Button>
      </div>

      {activeTab === 'RULES' ? (
        <div className="space-y-4">
          {/* Search & Filter bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="w-full sm:w-80">
              <SearchBar value={search} onChange={setSearch} placeholder="Search automation rule..." />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(['ALL', 'KEYWORD', 'FIRST_MESSAGE', 'OUT_OF_HOURS', 'BUTTON_CLICK'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setTriggerFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    triggerFilter === st
                      ? 'bg-[#05A222] text-white shadow-xs'
                      : 'bg-white text-[#14201C] border border-[#E2EAE6] hover:bg-[#F6FAF8]'
                  }`}
                >
                  {st === 'ALL'
                    ? 'All Triggers'
                    : st === 'KEYWORD'
                    ? 'Keywords'
                    : st === 'FIRST_MESSAGE'
                    ? 'Welcome'
                    : st === 'OUT_OF_HOURS'
                    ? 'Out of Hours'
                    : 'Button Clicks'}
                </button>
              ))}
            </div>
          </div>

          {/* Automations Table */}
          <Table columns={columns} data={rules} isLoading={isLoading} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-[#5F7069] font-medium">
              {selectedRuleForLogs
                ? `Showing execution logs for "${selectedRuleForLogs.name}"`
                : 'Showing real-time automation execution history across all active rules'}
            </div>
            {selectedRuleForLogs && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setSelectedRuleForLogs(null);
                  fetchLogs();
                }}
                leftIcon={<X className="w-3.5 h-3.5" />}
                className="text-xs text-[#5F7069]"
              >
                Clear Rule Filter
              </Button>
            )}
          </div>
          <Table columns={logColumns} data={logs} isLoading={isLoadingLogs} />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 shadow-2xl border border-[#E2EAE6] space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-black text-[#14201C]">Delete Automation</h3>
            </div>
            <p className="text-xs text-[#5F7069] leading-relaxed">
              Are you sure you want to delete this automation rule? It will stop responding to incoming WhatsApp messages immediately.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setDeleteConfirmId(null)} className="text-[#5F7069]">
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleDelete(deleteConfirmId)}
                isLoading={isActionLoading}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
              >
                Delete Rule
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
