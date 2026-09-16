import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { ArrowLeft, Shield, Check } from 'lucide-react';
import type { RolePermission } from '../types';
import { teamApi } from '../api';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const RolesPermissions: React.FC = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<RolePermission[]>([]);

  useEffect(() => {
    teamApi.getRoles().then(setRoles);
  }, []);

  return (
    <PageContainer>
      <button
        onClick={() => navigate(ROUTES.TEAM)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Team</span>
      </button>

      <div className="mb-6">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Roles & Permissions (RBAC)</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Define access control levels for organization heads, team leads, and agents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((r, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-500 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{r.role}</h3>
            </div>

            <p className="text-xs text-slate-500 min-h-[32px]">{r.description}</p>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Granted Capabilities
              </span>
              {r.permissions.map((p, pIdx) => (
                <div key={pIdx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
};
