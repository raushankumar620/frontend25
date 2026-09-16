import React, { useState } from 'react';
import { UserCheck, AlertTriangle, X, ArrowRight } from 'lucide-react';
import { superAdminService } from '../services/superAdminService';
import type { Tenant } from '../types/admin.types';

interface ImpersonateModalProps {
  tenant: Tenant | null;
  onClose: () => void;
}

export const ImpersonateModal: React.FC<ImpersonateModalProps> = ({ tenant, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!tenant) return null;

  const handleImpersonate = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Backup existing admin tokens
      const currentToken = localStorage.getItem('whatsappmsg_token');
      const currentRefresh = localStorage.getItem('whatsappmsg_refresh_token');
      const currentUser = localStorage.getItem('whatsappmsg_user');
      const currentOrg = localStorage.getItem('whatsappmsg_org');

      if (currentToken) localStorage.setItem('whatsappmsg_admin_backup_token', currentToken);
      if (currentRefresh) localStorage.setItem('whatsappmsg_admin_backup_refresh', currentRefresh);
      if (currentUser) localStorage.setItem('whatsappmsg_admin_backup_user', currentUser);
      if (currentOrg) localStorage.setItem('whatsappmsg_admin_backup_org', currentOrg);

      // 2. Call impersonate endpoint
      const result = await superAdminService.impersonateTenant(tenant._id || tenant.id);

      // 3. Set new active tenant context
      localStorage.setItem('whatsappmsg_token', result.accessToken);
      localStorage.setItem('whatsappmsg_refresh_token', result.refreshToken);
      localStorage.setItem('whatsappmsg_org', JSON.stringify(result.organization));
      localStorage.setItem('whatsappmsg_is_impersonating', 'true');
      localStorage.setItem('whatsappmsg_impersonated_org_name', tenant.name);

      // 4. Redirect to tenant workspace
      window.location.href = '/app';
    } catch (err: any) {
      setError(err.message || 'Failed to initialize tenant impersonation');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-[#E2EAE6] rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-2xl text-[#1F2A26] space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#14201C]">Impersonate Tenant</h3>
              <p className="text-xs text-[#5F7069]">Customer Support Session</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#5F7069] hover:text-[#14201C] hover:bg-[#F6FAF8] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="p-3.5 rounded-2xl bg-[#F6FAF8] border border-[#E2EAE6] text-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-600 font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>Audit Trail Notice</span>
          </div>
          <p className="text-[#5F7069] leading-relaxed">
            You are about to enter the workspace for{' '}
            <strong className="text-[#14201C]">{tenant.name}</strong> as an authenticated operator. All
            actions taken in this session will be logged to the security audit trail.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#5F7069] hover:text-[#14201C] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleImpersonate}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#05A222] hover:bg-[#006736] text-white text-xs font-bold transition shadow-lg shadow-[#05A222]/20 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Starting Session...' : 'Enter Workspace'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
