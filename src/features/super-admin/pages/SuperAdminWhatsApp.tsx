import React, { useEffect, useState } from 'react';
import {
  Phone,
  Building2,
  Zap,
  Search,
  RefreshCw,
} from 'lucide-react';
import { superAdminService } from '../services/superAdminService';
import { WhatsAppDebuggerModal } from '../components/WhatsAppDebuggerModal';
import { PageContainer } from '../../../components/layout/PageContainer';
import type { WhatsAppNumberItem, WabaAccountItem } from '../types/admin.types';

export const SuperAdminWhatsApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'numbers' | 'waba'>('numbers');
  const [numbers, setNumbers] = useState<WhatsAppNumberItem[]>([]);
  const [wabaAccounts, setWabaAccounts] = useState<WabaAccountItem[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [debugNumberId, setDebugNumberId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'numbers') {
        const data = await superAdminService.getWhatsAppNumbers({
          page: pagination.page,
          limit: pagination.limit,
          search,
          status: statusFilter,
        });
        setNumbers(data.numbers || []);
        setPagination(data.pagination);
      } else {
        const data = await superAdminService.getWhatsAppAccounts({
          page: pagination.page,
          limit: pagination.limit,
          search,
          status: statusFilter,
        });
        setWabaAccounts(data.accounts || []);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error('Failed to load WhatsApp data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, pagination.page, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((p) => ({ ...p, page: 1 }));
    fetchData();
  };

  return (
    <PageContainer className="space-y-6 text-[#1F2A26]">
      {/* WhatsApp Debugger Modal */}
      <WhatsAppDebuggerModal numberId={debugNumberId} onClose={() => setDebugNumberId(null)} />

      {/* Tabs & Controls Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E2EAE6] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('numbers');
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'numbers'
                ? 'bg-[#006736] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-[#E2EAE6] hover:bg-slate-50'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            Phone Numbers Directory
          </button>

          <button
            onClick={() => {
              setActiveTab('waba');
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'waba'
                ? 'bg-[#006736] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-[#E2EAE6] hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            WABA Business Accounts
          </button>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search phone, name, WABA ID..."
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
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="DISCONNECTED">Disconnected</option>
          </select>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'numbers' ? (
        /* Phone Numbers Table */
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2EAE6] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-[#F6FAF8] border-b border-[#E2EAE6] text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Display Number</th>
                  <th className="py-3.5 px-4">Verified Name</th>
                  <th className="py-3.5 px-4">Quality Rating</th>
                  <th className="py-3.5 px-4">Messaging Tier</th>
                  <th className="py-3.5 px-4">Tenant / Organization</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Diagnostic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EAE6]">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#05A222] mb-2" />
                      Loading WhatsApp Phone Numbers...
                    </td>
                  </tr>
                ) : numbers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No WhatsApp numbers found.
                    </td>
                  </tr>
                ) : (
                  numbers.map((num) => {
                    const nid = num._id || num.id;
                    return (
                      <tr key={nid} className="hover:bg-slate-50/70 transition">
                        {/* Display Number & ID */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#05A222] flex items-center justify-center font-bold shrink-0">
                              <Phone className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{num.displayPhoneNumber}</p>
                              <p className="text-slate-400 text-[10px] font-mono">ID: {num.phoneNumberId}</p>
                            </div>
                          </div>
                        </td>

                        {/* Verified Name */}
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {num.verifiedName || <span className="text-slate-400 font-normal">Unverified</span>}
                        </td>

                        {/* Quality Rating */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              num.qualityRating === 'GREEN'
                                ? 'bg-[#E9F9EE] text-[#006736]'
                                : num.qualityRating === 'YELLOW'
                                ? 'bg-amber-100 text-amber-800'
                                : num.qualityRating === 'RED'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {num.qualityRating || 'UNKNOWN'}
                          </span>
                        </td>

                        {/* Messaging Tier */}
                        <td className="py-3.5 px-4">
                          <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold">
                            {num.messagingTier || 'TIER_50'}
                          </span>
                        </td>

                        {/* Tenant */}
                        <td className="py-3.5 px-4">
                          {num.organizationId ? (
                            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                              <Building2 className="w-3.5 h-3.5 text-[#05A222]" />
                              <span>{num.organizationId.name}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400">Platform Global</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              num.status === 'ACTIVE'
                                ? 'bg-[#E9F9EE] text-[#006736]'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {num.status}
                          </span>
                        </td>

                        {/* 1-Click Debugger Action */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setDebugNumberId(nid)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#006736] to-[#05A222] text-white text-[11px] font-bold hover:opacity-95 transition flex items-center gap-1.5 ml-auto shadow-sm"
                          >
                            <Zap className="w-3 h-3 text-emerald-200" />
                            Debug Connection
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* WABA Accounts Table */
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2EAE6] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-[#F6FAF8] border-b border-[#E2EAE6] text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">WABA Name</th>
                  <th className="py-3.5 px-4">WABA ID</th>
                  <th className="py-3.5 px-4">Meta App ID</th>
                  <th className="py-3.5 px-4">Tenant / Organization</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EAE6]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#05A222] mb-2" />
                      Loading WABA Business Accounts...
                    </td>
                  </tr>
                ) : wabaAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No WABA accounts registered.
                    </td>
                  </tr>
                ) : (
                  wabaAccounts.map((waba) => {
                    const wid = waba._id || waba.id;
                    return (
                      <tr key={wid} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{waba.name}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-700 text-[11px]">{waba.wabaId}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">{waba.appId || 'System Default'}</td>
                        <td className="py-3.5 px-4">
                          {waba.organizationId ? (
                            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                              <Building2 className="w-3.5 h-3.5 text-[#05A222]" />
                              <span>{waba.organizationId.name}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400">System Admin</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              waba.status === 'ACTIVE'
                                ? 'bg-[#E9F9EE] text-[#006736]'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {waba.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                          {new Date(waba.createdAt).toLocaleDateString()}
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
