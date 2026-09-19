import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { MobileNav } from '../components/layout/MobileNav';
import { useAuthStore } from '../store/authStore';
import { UserCheck, ArrowRight } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { refreshProfile } = useAuthStore();

  const isImpersonating = localStorage.getItem('whatsappmsg_is_impersonating') === 'true';
  const impersonatedOrgName = localStorage.getItem('whatsappmsg_impersonated_org_name') || 'Tenant Workspace';

  useEffect(() => {
    refreshProfile();
  }, []);

  const handleExitImpersonation = () => {
    // Restore backed-up Super Admin credentials
    const backupToken = localStorage.getItem('whatsappmsg_admin_backup_token');
    const backupRefresh = localStorage.getItem('whatsappmsg_admin_backup_refresh');
    const backupUser = localStorage.getItem('whatsappmsg_admin_backup_user');
    const backupOrg = localStorage.getItem('whatsappmsg_admin_backup_org');

    if (backupToken) localStorage.setItem('whatsappmsg_token', backupToken);
    if (backupRefresh) localStorage.setItem('whatsappmsg_refresh_token', backupRefresh);
    if (backupUser) localStorage.setItem('whatsappmsg_user', backupUser);
    if (backupOrg) localStorage.setItem('whatsappmsg_org', backupOrg);

    localStorage.removeItem('whatsappmsg_is_impersonating');
    localStorage.removeItem('whatsappmsg_impersonated_org_name');
    localStorage.removeItem('whatsappmsg_admin_backup_token');
    localStorage.removeItem('whatsappmsg_admin_backup_refresh');
    localStorage.removeItem('whatsappmsg_admin_backup_user');
    localStorage.removeItem('whatsappmsg_admin_backup_org');

    window.location.href = '/super-admin/tenants';
  };

  return (
    <div className="flex h-screen bg-[#F6FAF8] text-[#1F2A26] overflow-hidden font-sans flex-col">
      {/* Impersonation Warning Banner */}
      {isImpersonating && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-md z-50 shrink-0">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-white animate-pulse" />
            <span>
              Support Session Active: You are currently impersonating{' '}
              <strong className="underline">{impersonatedOrgName}</strong>. All operations are audited.
            </span>
          </div>
          <button
            onClick={handleExitImpersonation}
            className="flex items-center gap-1.5 px-3 py-1 bg-black/30 hover:bg-black/50 text-white rounded-lg transition border border-white/20 font-bold"
          >
            <span>Exit Impersonation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block shrink-0">
          <Sidebar
            collapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          />
        </div>

        {/* Mobile Drawer */}
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex animate-in fade-in duration-200">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setIsMobileOpen(false)}
            />
            <div className="relative z-10 w-72 max-w-[82vw] bg-white h-full shadow-2xl border-r border-[#E2EAE6] flex flex-col">
              <Sidebar onToggleCollapse={() => setIsMobileOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F6FAF8]">
          <Header onToggleSidebar={() => setIsMobileOpen(!isMobileOpen)} />
          <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
            <Outlet />
          </main>
          <MobileNav />
        </div>
      </div>
    </div>
  );
};
