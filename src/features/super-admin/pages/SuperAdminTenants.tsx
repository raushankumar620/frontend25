import React, { useState, useEffect } from 'react';
import {
  Search,
  UserCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Phone,
} from 'lucide-react';
import { superAdminService } from '../services/superAdminService';
import { TenantDetailsModal } from '../components/TenantDetailsModal';
import { ImpersonateModal } from '../components/ImpersonateModal';
import { PageContainer } from '../../../components/layout/PageContainer';
import type { Tenant } from '../types/admin.types';

export const SuperAdminTenants: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [planFilter, setPlanFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals state
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [impersonatingTenant, setImpersonatingTenant] = useState<Tenant | null>(null);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const data = await superAdminService.getTenants({
        page,
        limit: 10,
        search,
        status: statusFilter,
        plan: planFilter,
      });
      setTenants(data.tenants);
      setTotalPages(data.pagination.totalPages);
      setTotalCount(data.pagination.total);
    } catch (err) {
      console.error('Failed to fetch tenants', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, [page, statusFilter, planFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTenants();
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'ENTERPRISE':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'GROWTH':
        return 'bg-[#E9F9EE] text-[#006736] border-[#C4EBD0]';
      case 'STARTER':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <PageContainer className="space-y-6 text-[#1F2A26]">
      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E2EAE6] flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#8A9993] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by company name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#fafcfb] focus:bg-white border border-[#E2EAE6] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#14201C] placeholder-[#8A9993] focus:outline-none focus:border-[#05A222] focus:ring-2 focus:ring-[#05A222]/15 transition font-medium"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#fafcfb] border border-[#E2EAE6] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#14201C] focus:outline-none focus:border-[#05A222] cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="SUSPENDED">SUSPENDED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          <select
            value={planFilter}
            onChange={(e) => {
              setPlanFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#fafcfb] border border-[#E2EAE6] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#14201C] focus:outline-none focus:border-[#05A222] cursor-pointer"
          >
            <option value="ALL">All Plans</option>
            <option value="FREE_TRIAL">FREE_TRIAL</option>
            <option value="STARTER">STARTER</option>
            <option value="GROWTH">GROWTH</option>
            <option value="ENTERPRISE">ENTERPRISE</option>
          </select>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white border border-[#E2EAE6] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F6FAF8] text-[#5F7069] uppercase text-[11px] font-bold border-b border-[#E2EAE6]">
              <tr>
                <th className="py-3.5 px-6">Company / Slug</th>
                <th className="py-3.5 px-4">Owner / Contact</th>
                <th className="py-3.5 px-4">Tier Plan</th>
                <th className="py-3.5 px-4 text-center">Numbers</th>
                <th className="py-3.5 px-4 text-center">Month Usage</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EAE6]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8A9993]">
                    Loading organizations directory...
                  </td>
                </tr>
              ) : tenants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8A9993]">
                    No organizations match your search or filter.
                  </td>
                </tr>
              ) : (
                tenants.map((tenant) => (
                  <tr key={tenant._id || tenant.id} className="hover:bg-[#F6FAF8]/70 transition">
                    {/* Organization Name */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-[#14201C] text-sm">{tenant.name}</div>
                      <div className="text-[11px] font-mono text-[#8A9993]">{tenant.slug}</div>
                    </td>

                    {/* Owner */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-[#14201C]">
                        {tenant.ownerId?.firstName} {tenant.ownerId?.lastName}
                      </div>
                      <div className="text-[#8A9993] text-[11px]">{tenant.ownerId?.email || 'N/A'}</div>
                    </td>

                    {/* Plan */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getPlanBadge(
                          tenant.plan
                        )}`}
                      >
                        {tenant.plan}
                      </span>
                    </td>

                    {/* Numbers */}
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center gap-1 font-bold text-[#05A222]">
                        <Phone className="w-3 h-3" />
                        <span>{tenant.stats?.activeNumbersCount || 0}</span>
                      </div>
                    </td>

                    {/* Monthly Usage */}
                    <td className="py-4 px-4 text-center font-mono font-medium text-[#14201C]">
                      {tenant.stats?.currentMonthMessages?.toLocaleString() || 0}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      {tenant.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#05A222]" />
                          ACTIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          {tenant.status}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Impersonate */}
                        <button
                          onClick={() => setImpersonatingTenant(tenant)}
                          title="Support Impersonation"
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold transition cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Impersonate</span>
                        </button>

                        {/* Inspect / Edit */}
                        <button
                          onClick={() => setSelectedTenantId(tenant._id || tenant.id)}
                          title="View 360 & Edit Plan"
                          className="p-1.5 rounded-xl bg-[#F6FAF8] hover:bg-[#E9F9EE] text-[#5F7069] hover:text-[#006736] border border-[#E2EAE6] hover:border-[#C4EBD0] transition cursor-pointer"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-[#E2EAE6] flex items-center justify-between text-xs bg-[#F6FAF8]">
          <span className="text-[#5F7069]">
            Page <strong className="text-[#14201C]">{page}</strong> of{' '}
            <strong className="text-[#14201C]">{totalPages}</strong>{' '}
            <span className="text-[#8A9993]">({totalCount} total organizations)</span>
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

      {/* Details & Plan Override Modal */}
      {selectedTenantId && (
        <TenantDetailsModal
          tenantId={selectedTenantId}
          onClose={() => setSelectedTenantId(null)}
          onUpdated={fetchTenants}
        />
      )}

      {/* Impersonation Confirmation Dialog */}
      {impersonatingTenant && (
        <ImpersonateModal
          tenant={impersonatingTenant}
          onClose={() => setImpersonatingTenant(null)}
        />
      )}
    </PageContainer>
  );
};
