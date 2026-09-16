import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  Phone,
  Save,
  MessageSquare,
  Users,
} from 'lucide-react';
import { superAdminService } from '../services/superAdminService';
import type { TenantDetails } from '../types/admin.types';

interface TenantDetailsModalProps {
  tenantId: string | null;
  onClose: () => void;
  onUpdated: () => void;
}

export const TenantDetailsModal: React.FC<TenantDetailsModalProps> = ({
  tenantId,
  onClose,
  onUpdated,
}) => {
  const [details, setDetails] = useState<TenantDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'plan' | 'users' | 'numbers'>('overview');

  // Form states for Plan & Limits
  const [plan, setPlan] = useState<string>('FREE_TRIAL');
  const [maxNumbers, setMaxNumbers] = useState<number>(2);
  const [maxTeamMembers, setMaxTeamMembers] = useState<number>(5);
  const [monthlyMessages, setMonthlyMessages] = useState<number>(1000);

  // Status adjustment
  const [status, setStatus] = useState<'ACTIVE' | 'SUSPENDED' | 'CANCELLED'>('ACTIVE');

  useEffect(() => {
    if (!tenantId) return;
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const data = await superAdminService.getTenantById(tenantId);
        setDetails(data);
        setPlan(data.organization.plan);
        setMaxNumbers(data.organization.limits?.maxNumbers || 2);
        setMaxTeamMembers(data.organization.limits?.maxTeamMembers || 5);
        setMonthlyMessages(data.organization.limits?.monthlyMessages || 1000);
        setStatus(data.organization.status);
      } catch (err) {
        console.error('Failed to load tenant details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [tenantId]);

  if (!tenantId) return null;

  const handleSavePlan = async () => {
    if (!tenantId) return;
    setSaving(true);
    try {
      await superAdminService.updateTenantPlan(tenantId, {
        plan,
        limits: {
          maxNumbers,
          maxTeamMembers,
          monthlyMessages,
        },
      });
      onUpdated();
      onClose();
    } catch (err) {
      console.error('Failed to update plan', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveStatus = async (newStatus: 'ACTIVE' | 'SUSPENDED') => {
    if (!tenantId) return;
    setSaving(true);
    try {
      await superAdminService.updateTenantStatus(
        tenantId,
        newStatus,
        newStatus === 'SUSPENDED' ? 'Administrative suspension' : 'Reactivated by Super Admin'
      );
      setStatus(newStatus);
      onUpdated();
      onClose();
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-[#E2EAE6] rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-[#1F2A26]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2EAE6] flex items-center justify-between bg-[#F6FAF8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#006736]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#14201C] flex items-center gap-2">
                <span>{details?.organization.name || 'Loading Tenant...'}</span>
                {details?.organization.status === 'ACTIVE' ? (
                  <span className="text-[10px] bg-[#E9F9EE] text-[#006736] px-2 py-0.5 rounded-full font-bold border border-[#C4EBD0]">
                    ACTIVE
                  </span>
                ) : (
                  <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-bold border border-rose-200">
                    {details?.organization.status}
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#8A9993] font-mono">ID: {tenantId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#5F7069] hover:text-[#14201C] hover:bg-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E2EAE6] px-6 bg-white gap-6 text-xs font-bold">
          {(['overview', 'plan', 'users', 'numbers'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3.5 border-b-2 capitalize transition-all cursor-pointer ${
                activeTab === tab
                  ? 'border-[#05A222] text-[#006736]'
                  : 'border-transparent text-[#5F7069] hover:text-[#14201C]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="py-12 text-center text-sm text-[#8A9993]">Loading tenant details...</div>
          ) : details ? (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-[#F6FAF8] border border-[#E2EAE6]">
                      <div className="text-xs text-[#5F7069] flex items-center gap-1.5 font-semibold">
                        <Users className="w-3.5 h-3.5 text-[#05A222]" /> Team Users
                      </div>
                      <div className="text-xl font-black text-[#14201C] mt-1">{details.users.length}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#F6FAF8] border border-[#E2EAE6]">
                      <div className="text-xs text-[#5F7069] flex items-center gap-1.5 font-semibold">
                        <Phone className="w-3.5 h-3.5 text-[#07CF74]" /> WhatsApp Numbers
                      </div>
                      <div className="text-xl font-black text-[#14201C] mt-1">{details.numbers.length}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#F6FAF8] border border-[#E2EAE6]">
                      <div className="text-xs text-[#5F7069] flex items-center gap-1.5 font-semibold">
                        <MessageSquare className="w-3.5 h-3.5 text-[#05A222]" /> Month Messages
                      </div>
                      <div className="text-xl font-black text-[#14201C] mt-1">
                        {details.usage?.messagesSent?.toLocaleString() || 0}
                      </div>
                    </div>
                  </div>

                  {/* Owner Profile */}
                  <div className="p-4 rounded-2xl bg-[#F6FAF8] border border-[#E2EAE6] space-y-3">
                    <div className="text-xs font-bold text-[#5F7069] uppercase tracking-wider">
                      Account Owner
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center font-bold text-[#006736]">
                          {details.organization.ownerId?.firstName?.[0] || 'O'}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#14201C]">
                            {details.organization.ownerId?.firstName} {details.organization.ownerId?.lastName}
                          </div>
                          <div className="text-xs text-[#5F7069]">{details.organization.ownerId?.email}</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-[#8A9993]">
                        Joined {new Date(details.organization.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Status & Danger Controls */}
                  <div className="p-4 rounded-2xl bg-[#F6FAF8] border border-[#E2EAE6] space-y-3">
                    <div className="text-xs font-bold text-[#5F7069] uppercase tracking-wider">
                      Tenant Status Controls
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-[#14201C]">
                          Current Status: <span className="text-[#006736]">{status}</span>
                        </div>
                        <p className="text-xs text-[#5F7069] mt-0.5">
                          Suspending an account will immediately prevent login and pause campaigns.
                        </p>
                      </div>
                      {status === 'ACTIVE' ? (
                        <button
                          onClick={() => handleSaveStatus('SUSPENDED')}
                          disabled={saving}
                          className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition cursor-pointer"
                        >
                          Suspend Organization
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSaveStatus('ACTIVE')}
                          disabled={saving}
                          className="px-4 py-2 rounded-xl bg-[#E9F9EE] hover:bg-[#D9F3E2] text-[#006736] border border-[#C4EBD0] text-xs font-bold transition cursor-pointer"
                        >
                          Reactivate Organization
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'plan' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#5F7069] font-bold block mb-1.5">
                        Subscription Plan Tier
                      </label>
                      <select
                        value={plan}
                        onChange={(e) => setPlan(e.target.value)}
                        className="w-full bg-[#fafcfb] border border-[#E2EAE6] rounded-xl px-3 py-2.5 text-sm font-semibold text-[#14201C] focus:outline-none focus:border-[#05A222] cursor-pointer"
                      >
                        <option value="FREE_TRIAL">FREE_TRIAL (14 Days)</option>
                        <option value="FREE">FREE</option>
                        <option value="STARTER">STARTER ($29/mo)</option>
                        <option value="GROWTH">GROWTH ($79/mo)</option>
                        <option value="ENTERPRISE">ENTERPRISE ($249/mo)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-[#5F7069] font-bold block mb-1.5">
                        Max WhatsApp Numbers
                      </label>
                      <input
                        type="number"
                        value={maxNumbers}
                        onChange={(e) => setMaxNumbers(Number(e.target.value))}
                        className="w-full bg-[#fafcfb] border border-[#E2EAE6] rounded-xl px-3 py-2.5 text-sm text-[#14201C] font-mono font-bold focus:outline-none focus:border-[#05A222]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#5F7069] font-bold block mb-1.5">
                        Max Team Member Seats
                      </label>
                      <input
                        type="number"
                        value={maxTeamMembers}
                        onChange={(e) => setMaxTeamMembers(Number(e.target.value))}
                        className="w-full bg-[#fafcfb] border border-[#E2EAE6] rounded-xl px-3 py-2.5 text-sm text-[#14201C] font-mono font-bold focus:outline-none focus:border-[#05A222]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#5F7069] font-bold block mb-1.5">
                        Monthly Messages Limit
                      </label>
                      <input
                        type="number"
                        value={monthlyMessages}
                        onChange={(e) => setMonthlyMessages(Number(e.target.value))}
                        className="w-full bg-[#fafcfb] border border-[#E2EAE6] rounded-xl px-3 py-2.5 text-sm text-[#14201C] font-mono font-bold focus:outline-none focus:border-[#05A222]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handleSavePlan}
                      disabled={saving}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#05A222] hover:bg-[#006736] text-white rounded-xl text-xs font-bold transition shadow-lg shadow-[#05A222]/20 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saving ? 'Saving...' : 'Save Plan & Quotas'}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="space-y-3">
                  <div className="text-xs text-[#5F7069] font-medium">Registered users in this organization:</div>
                  <div className="divide-y divide-[#E2EAE6] rounded-2xl bg-[#F6FAF8] border border-[#E2EAE6] overflow-hidden">
                    {details.users.map((u) => (
                      <div key={u._id} className="p-3.5 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-[#14201C]">
                            {u.firstName} {u.lastName}
                          </div>
                          <div className="text-[#8A9993]">{u.email}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-white text-[#006736] font-mono font-bold border border-[#E2EAE6]">
                            {u.role}
                          </span>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              u.isActive ? 'bg-[#05A222]' : 'bg-gray-400'
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'numbers' && (
                <div className="space-y-3">
                  <div className="text-xs text-[#5F7069] font-medium">Connected WhatsApp phone numbers:</div>
                  {details.numbers.length === 0 ? (
                    <div className="p-8 text-center text-xs text-[#8A9993] bg-[#F6FAF8] rounded-2xl border border-[#E2EAE6]">
                      No WhatsApp numbers registered for this tenant.
                    </div>
                  ) : (
                    <div className="divide-y divide-[#E2EAE6] rounded-2xl bg-[#F6FAF8] border border-[#E2EAE6] overflow-hidden">
                      {details.numbers.map((num) => (
                        <div key={num._id} className="p-3.5 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-[#14201C]">{num.displayPhoneNumber}</div>
                            <div className="text-[#8A9993]">
                              {num.verifiedName || 'Unverified Name'} • {num.messagingTier}
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-[#E9F9EE] text-[#006736] font-bold border border-[#C4EBD0]">
                            {num.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
