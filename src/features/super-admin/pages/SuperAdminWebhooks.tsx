import React, { useEffect, useState } from 'react';
import {
  Webhook,
  RefreshCw,
  Zap,
  Clock,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { superAdminService } from '../services/superAdminService';
import { PageContainer } from '../../../components/layout/PageContainer';
import type {
  WebhooksSummaryReport,
  CustomerWebhookItem,
  WebhookDeliveryLogItem,
} from '../types/admin.types';

export const SuperAdminWebhooks: React.FC = () => {
  const [summary, setSummary] = useState<WebhooksSummaryReport | null>(null);
  const [activeTab, setActiveTab] = useState<'deliveries' | 'endpoints'>('deliveries');
  const [deliveries, setDeliveries] = useState<WebhookDeliveryLogItem[]>([]);
  const [endpoints, setEndpoints] = useState<CustomerWebhookItem[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const fetchSummary = async () => {
    try {
      const data = await superAdminService.getWebhooksSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load webhook summary:', err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'deliveries') {
        const data = await superAdminService.getWebhookDeliveries({
          page: pagination.page,
          limit: pagination.limit,
          status: statusFilter,
        });
        setDeliveries(data.deliveries || []);
        setPagination(data.pagination);
      } else {
        const data = await superAdminService.getCustomerWebhooks({
          page: pagination.page,
          limit: pagination.limit,
        });
        setEndpoints(data.webhooks || []);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error('Failed to load webhook data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeTab, pagination.page, statusFilter]);

  const toggleExpandLog = (id: string) => {
    setExpandedLogId((prev) => (prev === id ? null : id));
  };

  return (
    <PageContainer className="space-y-6 text-[#1F2A26]">
      {/* Inbound & Outbound Telemetry Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Inbound Meta Webhook Card */}
          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2EAE6] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-700">
                <Zap className="w-4 h-4 text-[#05A222]" /> Meta Inbound Webhook Receiver
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E9F9EE] text-[#006736]">
                {summary.metaWebhook?.status || (summary as any).metaInbound?.status || 'OPERATIONAL'}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Public Callback Endpoint</span>
                <span className="font-mono text-slate-800 text-[11px]">
                  {summary.metaWebhook?.endpoint || (summary as any).metaInbound?.endpoint || '/api/v1/webhooks/whatsapp'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Verify Token Configured</span>
                <span className="font-semibold text-emerald-700">
                  {summary.metaWebhook?.verifyTokenConfigured ?? (summary as any).metaInbound?.verifyTokenConfigured ? 'YES (Secure)' : 'NO'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Ping Latency</span>
                <span className="font-mono font-bold text-slate-800">
                  {summary.metaWebhook?.pingTimeMs ?? 14}ms
                </span>
              </div>
            </div>
          </div>

          {/* Outbound Customer Webhooks Card */}
          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E2EAE6] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-700">
                <Webhook className="w-4 h-4 text-[#05A222]" /> Customer Outbound Deliveries
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800">
                {summary.customerWebhooks?.activeEndpoints ?? (summary as any).customerOutbound?.activeEndpoints ?? 0} Active Endpoints
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">24h Deliveries Dispatched</span>
                <span className="font-bold text-slate-800">
                  {summary.recentDeliveries?.total24h ?? (summary as any).customerOutbound?.deliveriesToday ?? 0} events
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Successful Deliveries</span>
                <span className="font-semibold text-emerald-700">
                  {summary.recentDeliveries?.success24h ?? Math.max(0, ((summary as any).customerOutbound?.deliveriesToday || 0) - ((summary as any).customerOutbound?.failedToday || 0))}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Success Rate</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                  {summary.recentDeliveries?.successRate ?? (summary as any).customerOutbound?.successRate ?? 100}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs & Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E2EAE6] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('deliveries');
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'deliveries'
                ? 'bg-[#006736] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-[#E2EAE6] hover:bg-slate-50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Outbound Delivery Logs
          </button>

          <button
            onClick={() => {
              setActiveTab('endpoints');
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'endpoints'
                ? 'bg-[#006736] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-[#E2EAE6] hover:bg-slate-50'
            }`}
          >
            <Webhook className="w-3.5 h-3.5" />
            Registered Customer Endpoints
          </button>
        </div>

        {/* Status Filter for Deliveries */}
        {activeTab === 'deliveries' && (
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className="px-3 py-1.5 bg-white border border-[#E2EAE6] rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Delivery Status</option>
            <option value="SUCCESS">Success (2xx)</option>
            <option value="FAILED">Failed</option>
            <option value="RETRYING">Retrying</option>
          </select>
        )}
      </div>

      {/* Content Tables */}
      {activeTab === 'deliveries' ? (
        /* Deliveries Table */
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2EAE6] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-[#F6FAF8] border-b border-[#E2EAE6] text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Event Type</th>
                  <th className="py-3.5 px-4">Destination Webhook URL</th>
                  <th className="py-3.5 px-4">Tenant</th>
                  <th className="py-3.5 px-4">HTTP Status</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EAE6]">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#05A222] mb-2" />
                      Loading delivery logs...
                    </td>
                  </tr>
                ) : deliveries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No webhook deliveries found.
                    </td>
                  </tr>
                ) : (
                  deliveries.map((del) => {
                    const did = del._id || del.id;
                    const isExpanded = expandedLogId === did;

                    return (
                      <React.Fragment key={did}>
                        <tr className="hover:bg-slate-50/70 transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-800 text-[11px]">{del.event}</td>
                          <td className="py-3.5 px-4">
                            <span className="font-mono text-slate-600 text-[11px] truncate max-w-[220px] block" title={del.url}>
                              {del.url}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-800">
                            {del.organizationId?.name || 'Platform'}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                                del.status === 'SUCCESS'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : del.status === 'RETRYING'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {del.responseStatus || (del.status === 'SUCCESS' ? 200 : 500)} ({del.status})
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">{del.durationMs}ms</td>
                          <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                            {new Date(del.createdAt).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => toggleExpandLog(did)}
                              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 transition"
                            >
                              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="bg-slate-50/80">
                            <td colSpan={7} className="p-4 border-b border-slate-200 space-y-2">
                              {del.error && (
                                <p className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                                  <strong>Delivery Error:</strong> {del.error}
                                </p>
                              )}
                              {del.responseBody && (
                                <div className="text-[11px] font-mono bg-slate-900 text-slate-200 p-3 rounded-lg overflow-x-auto">
                                  <pre>{del.responseBody}</pre>
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Endpoints Table */
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2EAE6] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-[#F6FAF8] border-b border-[#E2EAE6] text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Target URL</th>
                  <th className="py-3.5 px-4">Tenant / Organization</th>
                  <th className="py-3.5 px-4">Subscribed Events</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EAE6]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#05A222] mb-2" />
                      Loading webhook endpoints...
                    </td>
                  </tr>
                ) : endpoints.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      No customer webhook endpoints registered.
                    </td>
                  </tr>
                ) : (
                  endpoints.map((ep) => {
                    const eid = ep._id || ep.id;
                    return (
                      <tr key={eid} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 text-[11px]">{ep.url}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {ep.organizationId?.name || 'Platform'}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {ep.events?.map((ev, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono">
                                {ev}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              ep.isActive ? 'bg-[#E9F9EE] text-[#006736]' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {ep.isActive ? 'ACTIVE' : 'DISABLED'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                          {new Date(ep.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Footer */}
      {pagination.totalPages > 1 && (
        <div className="p-4 bg-[#FFFFFF] rounded-2xl border border-[#E2EAE6] flex items-center justify-between text-xs text-slate-500 shadow-sm">
          <span>
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} Records)
          </span>
          <div className="flex gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
              className="px-3 py-1 bg-[#F6FAF8] border border-[#E2EAE6] rounded-lg disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
              className="px-3 py-1 bg-[#F6FAF8] border border-[#E2EAE6] rounded-lg disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
