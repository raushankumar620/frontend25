import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { superAdminService } from '../services/superAdminService';
import { AuditLogDetailsModal } from '../components/AuditLogDetailsModal';
import { PageContainer } from '../../../components/layout/PageContainer';
import type { AuditLogItem } from '../types/admin.types';

export const SuperAdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await superAdminService.getAuditLogs({
        page,
        limit: 15,
        action: actionFilter,
        search,
      });
      setLogs(data.logs);
      setTotalPages(data.pagination.totalPages);
      setTotalCount(data.pagination.total);
    } catch (err) {
      console.error('Failed to fetch audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, actionFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  return (
    <PageContainer className="space-y-6 text-[#1F2A26]">
      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E2EAE6] flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#8A9993] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search action keyword, email, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#fafcfb] focus:bg-white border border-[#E2EAE6] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#14201C] placeholder-[#8A9993] focus:outline-none focus:border-[#05A222] focus:ring-2 focus:ring-[#05A222]/15 transition font-medium"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#fafcfb] border border-[#E2EAE6] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#14201C] focus:outline-none focus:border-[#05A222] cursor-pointer"
          >
            <option value="">All Actions</option>
            <option value="SUPER_ADMIN_">Super Admin Actions</option>
            <option value="IMPERSONATION">Impersonation Sessions</option>
            <option value="PLAN_OVERRIDE">Plan Overrides</option>
            <option value="QUEUE">Queue Worker Controls</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white border border-[#E2EAE6] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F6FAF8] text-[#5F7069] uppercase text-[11px] font-bold border-b border-[#E2EAE6]">
              <tr>
                <th className="py-3.5 px-6">Timestamp</th>
                <th className="py-3.5 px-4">Action Event</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Target Organization</th>
                <th className="py-3.5 px-4">Source IP</th>
                <th className="py-3.5 px-6 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EAE6]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8A9993]">
                    Loading audit trail logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8A9993]">
                    No audit records match your filters.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id || log.id} className="hover:bg-[#F6FAF8]/70 transition">
                    <td className="py-4 px-6 text-[#5F7069] font-mono whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-[#006736]">
                      {log.action}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-[#14201C]">
                        {log.userId?.firstName} {log.userId?.lastName}
                      </div>
                      <div className="text-[11px] text-[#8A9993]">{log.userId?.email || 'System'}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-[#14201C]">
                        {log.organizationId?.name || 'Platform HQ'}
                      </div>
                      <div className="text-[11px] text-[#8A9993] font-mono">
                        {log.organizationId?.slug || 'global'}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-[#5F7069]">
                      {log.ipAddress || 'internal'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#E9F9EE] hover:bg-[#D9F3E2] text-[#006736] text-xs font-bold border border-[#C4EBD0] transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[#E2EAE6] flex items-center justify-between text-xs bg-[#F6FAF8]">
          <span className="text-[#5F7069]">
            Page <strong className="text-[#14201C]">{page}</strong> of{' '}
            <strong className="text-[#14201C]">{totalPages}</strong>{' '}
            <span className="text-[#8A9993]">({totalCount} total entries)</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-xl bg-white border border-[#E2EAE6] text-[#5F7069] hover:text-[#14201C] disabled:opacity-30 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-xl bg-white border border-[#E2EAE6] text-[#5F7069] hover:text-[#14201C] disabled:opacity-30 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedLog && (
        <AuditLogDetailsModal log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}
    </PageContainer>
  );
};
