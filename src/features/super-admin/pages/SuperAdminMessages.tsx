import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  Search,
  RefreshCw,
  Zap,
  Building2,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  Check,
} from 'lucide-react';
import { superAdminService } from '../services/superAdminService';
import { MessageTraceModal } from '../components/MessageTraceModal';
import { PageContainer } from '../../../components/layout/PageContainer';
import type { AdminMessageItem, AdminMessagesResponse } from '../types/admin.types';

export const SuperAdminMessages: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'failed'>('all');
  const [messages, setMessages] = useState<AdminMessageItem[]>([]);
  const [summary, setSummary] = useState<AdminMessagesResponse['summary'] | null>(null);
  const [errorBreakdown, setErrorBreakdown] = useState<Array<{ _id: string; count: number }>>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [directionFilter, setDirectionFilter] = useState('ALL');
  const [traceMessageId, setTraceMessageId] = useState<string | null>(null);
  const [copiedWamid, setCopiedWamid] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      if (activeTab === 'all') {
        const data = await superAdminService.getMessages({
          page: pagination.page,
          limit: pagination.limit,
          search,
          status: statusFilter,
          direction: directionFilter,
        });
        setMessages(data.messages || []);
        setSummary(data.summary);
        setPagination(data.pagination);
      } else {
        const data = await superAdminService.getFailedMessages({
          page: pagination.page,
          limit: pagination.limit,
        });
        setMessages(data.failedMessages || []);
        setErrorBreakdown(data.errorBreakdown || []);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [activeTab, pagination.page, statusFilter, directionFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((p) => ({ ...p, page: 1 }));
    fetchMessages();
  };

  const copyWamid = (wamid: string) => {
    navigator.clipboard.writeText(wamid);
    setCopiedWamid(wamid);
    setTimeout(() => setCopiedWamid(null), 2000);
  };

  return (
    <PageContainer className="space-y-6 text-[#1F2A26]">
      {/* Message Trace Debugger Modal */}
      <MessageTraceModal messageId={traceMessageId} onClose={() => setTraceMessageId(null)} />

      {/* Summary KPI Cards (When on 'all' tab) */}
      {summary && activeTab === 'all' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E2EAE6] shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#05A222] flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Volume</p>
              <h3 className="text-xl font-bold text-slate-900">{summary.totalMessages}</h3>
            </div>
          </div>

          <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E2EAE6] shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Delivered / Read</p>
              <h3 className="text-xl font-bold text-blue-700">{summary.delivered + summary.read}</h3>
            </div>
          </div>

          <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E2EAE6] shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#006736] flex items-center justify-center font-bold">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">In Flight / Sent</p>
              <h3 className="text-xl font-bold text-[#006736]">{summary.sent}</h3>
            </div>
          </div>

          <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E2EAE6] shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Failed Dispatches</p>
              <h3 className="text-xl font-bold text-rose-600">{summary.failed}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Error Breakdown Pills (When on 'failed' tab) */}
      {activeTab === 'failed' && errorBreakdown.length > 0 && (
        <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E2EAE6] shadow-sm space-y-2">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Top Failure Reasons & Meta Codes</p>
          <div className="flex flex-wrap gap-2">
            {errorBreakdown.map((err, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono font-semibold flex items-center gap-2"
              >
                <span>Code: {err._id || 'UNKNOWN'}</span>
                <span className="bg-rose-200 text-rose-900 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                  {err.count}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tabs & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E2EAE6] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('all');
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'all'
                ? 'bg-[#006736] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-[#E2EAE6] hover:bg-slate-50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            All Live Messages
          </button>

          <button
            onClick={() => {
              setActiveTab('failed');
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'failed'
                ? 'bg-[#006736] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-[#E2EAE6] hover:bg-slate-50'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            Failed Messages & DLQ
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {activeTab === 'all' && (
            <>
              <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="WAMID, phone, text..."
                  className="w-full pl-8 pr-4 py-1.5 bg-white border border-[#E2EAE6] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#05A222]"
                />
              </form>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                className="px-3 py-1.5 bg-white border border-[#E2EAE6] rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="DELIVERED">Delivered</option>
                <option value="READ">Read</option>
                <option value="SENT">Sent</option>
                <option value="FAILED">Failed</option>
                <option value="QUEUED">Queued</option>
              </select>

              <select
                value={directionFilter}
                onChange={(e) => {
                  setDirectionFilter(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                className="px-3 py-1.5 bg-white border border-[#E2EAE6] rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Directions</option>
                <option value="OUTBOUND">Outbound</option>
                <option value="INBOUND">Inbound</option>
              </select>
            </>
          )}
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2EAE6] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-[#F6FAF8] border-b border-[#E2EAE6] text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Direction & WAMID</th>
                <th className="py-3.5 px-4">From → To</th>
                <th className="py-3.5 px-4">Tenant / Organization</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4 text-right">Lifecycle Trace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EAE6]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#05A222] mb-2" />
                    Streaming global messages...
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No messages matching criteria found.
                  </td>
                </tr>
              ) : (
                messages.map((msg) => {
                  const mid = msg._id || msg.id;

                  return (
                    <tr key={mid} className="hover:bg-slate-50/70 transition">
                      {/* Direction & WAMID */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                              msg.direction === 'OUTBOUND'
                                ? 'bg-emerald-100 text-[#006736]'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {msg.direction === 'OUTBOUND' ? (
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            ) : (
                              <ArrowDownLeft className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 text-[11px] block">{msg.type}</span>
                            {msg.wamid ? (
                              <div className="flex items-center gap-1">
                                <span className="font-mono text-[10px] text-slate-400 truncate max-w-[130px]">
                                  {msg.wamid}
                                </span>
                                <button
                                  onClick={() => copyWamid(msg.wamid!)}
                                  className="text-slate-400 hover:text-slate-600"
                                >
                                  {copiedWamid === msg.wamid ? (
                                    <Check className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400">No WAMID yet</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* From → To */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 text-[11px] font-mono">
                            <span className="text-slate-400">From:</span>
                            <span className="font-bold text-slate-800">{msg.from}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] font-mono">
                            <span className="text-slate-400">To:</span>
                            <span className="font-bold text-slate-800">{msg.to}</span>
                          </div>
                        </div>
                      </td>

                      {/* Tenant */}
                      <td className="py-3.5 px-4">
                        {msg.organizationId ? (
                          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                            <Building2 className="w-3.5 h-3.5 text-[#05A222]" />
                            <span>{msg.organizationId.name}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">System Direct</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              msg.status === 'DELIVERED' || msg.status === 'READ'
                                ? 'bg-[#E9F9EE] text-[#006736]'
                                : msg.status === 'FAILED'
                                ? 'bg-rose-100 text-rose-800'
                                : msg.status === 'SENT'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {msg.status}
                          </span>
                          {msg.errorMessage && (
                            <p className="text-[10px] text-rose-600 mt-1 max-w-[180px] truncate" title={msg.errorMessage}>
                              {msg.errorMessage}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Created At */}
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {new Date(msg.createdAt).toLocaleString()}
                      </td>

                      {/* 1-Click Trace Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setTraceMessageId(mid)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#006736] to-[#05A222] text-white text-[11px] font-bold hover:opacity-95 transition flex items-center gap-1.5 ml-auto shadow-sm"
                        >
                          <Zap className="w-3 h-3 text-emerald-200" />
                          Trace Lifecycle
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="p-4 bg-[#F6FAF8] border-t border-[#E2EAE6] flex items-center justify-between text-xs text-slate-500">
            <span>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} Total Messages)
            </span>
            <div className="flex gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                className="px-3 py-1 bg-white border border-[#E2EAE6] rounded-lg disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                className="px-3 py-1 bg-white border border-[#E2EAE6] rounded-lg disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
