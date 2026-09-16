import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from '../features/super-admin/components/AdminSidebar';
import { AdminHeader } from '../features/super-admin/components/AdminHeader';

export const SuperAdminLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const getPageInfo = () => {
    switch (location.pathname) {
      case '/super-admin':
        return {
          title: 'Infrastructure Overview',
          subtitle: 'Platform analytics, cluster health & real-time telemetry',
          section: 'Overview',
        };
      case '/super-admin/tenants':
        return {
          title: 'Tenant Directory',
          subtitle: 'Manage organizations, quotas, plan tiers & support sessions',
          section: 'Tenants & Access',
        };
      case '/super-admin/users':
        return {
          title: 'Global Users Directory',
          subtitle: 'Cross-organization user management, roles & authentication status',
          section: 'Tenants & Access',
        };
      case '/super-admin/whatsapp':
        return {
          title: 'WhatsApp Gateway Manager',
          subtitle: 'Meta Cloud API phone numbers, WABA health & verification status',
          section: 'Messaging Engine',
        };
      case '/super-admin/messages':
        return {
          title: 'Global Messages & Trace',
          subtitle: 'Real-time message logs, delivery receipts & payload debugger',
          section: 'Messaging Engine',
        };
      case '/super-admin/webhooks':
        return {
          title: 'Webhooks & Events Stream',
          subtitle: 'Meta inbound webhooks, retry telemetry & delivery failure logs',
          section: 'Messaging Engine',
        };
      case '/super-admin/queues':
        return {
          title: 'Queue & Worker Telemetry',
          subtitle: 'BullMQ workers, job distribution & real-time dispatch controls',
          section: 'Infrastructure & Ops',
        };
      case '/super-admin/audit-logs':
        return {
          title: 'Platform Audit Trail',
          subtitle: 'Immutable logs of administrative actions, plan overrides & security events',
          section: 'Infrastructure & Ops',
        };
      case '/super-admin/settings':
        return {
          title: 'System Flags & Config',
          subtitle: 'Global platform switches, maintenance mode & AI gateway routing',
          section: 'Infrastructure & Ops',
        };
      default:
        return {
          title: 'Super Admin Control Center',
          subtitle: 'Master enterprise management console',
          section: 'Console',
        };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div className="flex h-screen bg-[#F6FAF8] text-[#1F2A26] font-sans antialiased overflow-hidden">
      {/* Desktop Super Admin Sidebar */}
      <div className="hidden lg:block shrink-0">
        <AdminSidebar
          collapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative z-10 w-72 bg-white h-full shadow-2xl border-r border-[#E2EAE6]">
            <AdminSidebar onCloseMobile={() => setIsMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F6FAF8]">
        <AdminHeader
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          onToggleSidebar={() => setIsMobileOpen(!isMobileOpen)}
        />
        <main className="flex-1 overflow-y-auto bg-[#F6FAF8] relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
