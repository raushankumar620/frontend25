import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  ShieldAlert,
  UserCheck,
  UserX,
  RefreshCw,
  Building2,
  LogOut,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { superAdminService } from '../services/superAdminService';
import { PageContainer } from '../../../components/layout/PageContainer';
import type { AdminUserItem, AdminUsersResponse } from '../types/admin.types';

export const SuperAdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [summary, setSummary] = useState<AdminUsersResponse['summary'] | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await superAdminService.getUsers({
        page: pagination.page,
        limit: pagination.limit,
        search,
        role: roleFilter,
        isActive: statusFilter === 'ACTIVE' ? true : statusFilter === 'INACTIVE' ? false : 'ALL',
      });
      setUsers(data.users || []);
      setSummary(data.summary);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Failed to load users:', err);
      showToast('Failed to load global users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, roleFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((p) => ({ ...p, page: 1 }));
    fetchUsers();
  };

  const showToast = (text: string, type: 'success' | 'error') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleStatus = async (user: AdminUserItem) => {
    setActionLoading(user._id || user.id);
    try {
      const updated = await superAdminService.updateUserStatus(user._id || user.id, !user.isActive);
      setUsers((prev) =>
        prev.map((u) => ((u._id || u.id) === (user._id || user.id) ? { ...u, isActive: updated.isActive } : u))
      );
      showToast(`User account ${updated.isActive ? 'activated' : 'deactivated'} successfully`, 'success');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to update user status', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevokeSessions = async (userId: string) => {
    if (!window.confirm('Are you sure you want to force sign-out this user from all active devices?')) return;
    setActionLoading(userId);
    try {
      await superAdminService.revokeUserSessions(userId);
      showToast('All active sessions revoked for user', 'success');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to revoke sessions', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <PageContainer className="space-y-6 text-[#1F2A26]">
      {/* Toast */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 p-4 rounded-xl shadow-xl flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-top-5 duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-[#006736] text-white'
              : 'bg-rose-600 text-white'
          }`}
        >
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toastMessage.text}
        </div>
      )}

      {/* Summary KPI Cards */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E2EAE6] shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#05A222] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Registered</p>
              <h3 className="text-xl font-bold text-slate-900">{summary.totalUsers}</h3>
            </div>
          </div>

          <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E2EAE6] shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Active Users</p>
              <h3 className="text-xl font-bold text-emerald-700">{summary.activeUsers}</h3>
            </div>
          </div>

          <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E2EAE6] shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <UserX className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Suspended</p>
              <h3 className="text-xl font-bold text-rose-600">{summary.inactiveUsers}</h3>
            </div>
          </div>

          <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E2EAE6] shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Super Admins</p>
              <h3 className="text-xl font-bold text-amber-700">{summary.superAdmins}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E2EAE6] shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full pl-9 pr-4 py-2 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#05A222]"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className="px-3 py-2 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMIN">Tenant Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="AGENT">Agent</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className="px-3 py-2 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2EAE6] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-[#F6FAF8] border-b border-[#E2EAE6] text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Tenant / Organization</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Login</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EAE6]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#05A222] mb-2" />
                    Loading global user directory...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No users matching the filters found.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const uid = u._id || u.id;
                  const isActioning = actionLoading === uid;

                  return (
                    <tr key={uid} className="hover:bg-slate-50/70 transition">
                      {/* Name & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#006736] flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {u.firstName?.[0] || u.email[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">
                              {u.firstName} {u.lastName}
                            </p>
                            <p className="text-slate-400 text-[11px] font-mono">{u.email}</p>
                            {u.phone && <p className="text-slate-400 text-[10px]">{u.phone}</p>}
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            u.role === 'SUPER_ADMIN'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : u.role === 'ADMIN'
                              ? 'bg-blue-100 text-blue-900'
                              : u.role === 'MANAGER'
                              ? 'bg-purple-100 text-purple-900'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      {/* Organization */}
                      <td className="py-3.5 px-4">
                        {u.organizationId ? (
                          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                            <Building2 className="w-3.5 h-3.5 text-[#05A222]" />
                            <span>{u.organizationId.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({u.organizationId.slug})</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Platform Level</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            u.isActive
                              ? 'bg-[#E9F9EE] text-[#006736]'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {u.isActive ? 'ACTIVE' : 'SUSPENDED'}
                        </span>
                      </td>

                      {/* Last Login */}
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleStatus(u)}
                            disabled={isActioning}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                              u.isActive
                                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                            title={u.isActive ? 'Suspend User' : 'Activate User'}
                          >
                            {u.isActive ? 'Suspend' : 'Activate'}
                          </button>

                          <button
                            onClick={() => handleRevokeSessions(uid)}
                            disabled={isActioning}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                            title="Force Sign-Out All Sessions"
                          >
                            <LogOut className="w-3.5 h-3.5 text-slate-600" />
                          </button>
                        </div>
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
              Showing Page {pagination.page} of {pagination.totalPages} ({pagination.total} Total Users)
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
