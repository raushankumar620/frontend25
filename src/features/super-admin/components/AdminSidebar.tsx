import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  Smartphone,
  MessageSquare,
  Webhook,
  Cpu,
  FileSpreadsheet,
  Settings,
  PanelLeftClose,
  ArrowLeft,
} from 'lucide-react';
import clsx from 'clsx';
import { APP_NAME } from '../../../utils/constants';
import { useAuthStore } from '../../../store/authStore';

export interface AdminSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onCloseMobile?: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  badge?: string;
  end?: boolean;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  collapsed = false,
  onToggleCollapse,
  onCloseMobile,
}) => {
  const { user } = useAuthStore();

  const mainNavItems: NavItem[] = [
    { label: 'Control Overview', path: '/super-admin', icon: LayoutDashboard, end: true, color: '#2563EB', bgColor: '#EFF6FF' },
    { label: 'Tenant Directory', path: '/super-admin/tenants', icon: Building2, badge: 'Tenants', color: '#059669', bgColor: '#ECFDF5' },
    { label: 'Global Users', path: '/super-admin/users', icon: Users, badge: 'Users', color: '#4F46E5', bgColor: '#EEF2FF' },
    { label: 'WhatsApp Gateway', path: '/super-admin/whatsapp', icon: Smartphone, badge: 'Meta API', color: '#25D366', bgColor: '#E9F9EE' },
    { label: 'Messages & Trace', path: '/super-admin/messages', icon: MessageSquare, badge: 'Live', color: '#0284C7', bgColor: '#F0F9FF' },
    { label: 'Webhooks & Events', path: '/super-admin/webhooks', icon: Webhook, color: '#EA580C', bgColor: '#FFF7ED' },
  ];

  const systemNavItems: NavItem[] = [
    { label: 'Queue Telemetry', path: '/super-admin/queues', icon: Cpu, badge: 'Workers', color: '#9333EA', bgColor: '#FAF5FF' },
    { label: 'Platform Audit Logs', path: '/super-admin/audit-logs', icon: FileSpreadsheet, color: '#D97706', bgColor: '#FFFBEB' },
    { label: 'System Config', path: '/super-admin/settings', icon: Settings, color: '#64748B', bgColor: '#F8FAFC' },
  ];

  const adminName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || 'Super Admin';
  const adminInitials = adminName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || 'SA';

  const handleNavClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside
      className={clsx(
        'h-screen bg-white text-[#1F2A26] flex flex-col shrink-0 border-r border-[#E2EAE6] transition-all duration-300 select-none z-30 shadow-[4px_0_24px_rgba(1,59,35,0.02)]',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div
        className={clsx(
          'h-[72px] sm:h-20 flex items-center border-b border-[#E2EAE6]',
          collapsed ? 'justify-center px-2' : 'justify-between px-5'
        )}
      >
        {collapsed ? (
          <button
            onClick={onToggleCollapse}
            title="Expand sidebar"
            className="p-2 rounded-xl hover:bg-[#F6FAF8] transition-all cursor-pointer group flex items-center justify-center"
          >
            <img
              src="/images/whatsapplogoshort.png"
              alt={APP_NAME}
              className="h-9 w-9 object-contain transition-transform group-hover:scale-110"
            />
          </button>
        ) : (
          <>
            <div className="flex items-center min-w-0">
              <img
                src="/images/logo.png"
                alt={APP_NAME}
                className="h-9 w-auto max-w-[165px] object-contain shrink-0"
              />
            </div>
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                title="Collapse sidebar"
                className="p-2 rounded-xl text-[#5F7069] hover:text-[#14201C] hover:bg-[#F6FAF8] transition-colors cursor-pointer shrink-0"
              >
                <PanelLeftClose className="w-5 h-5" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Nav list */}
      <div className="flex-1 overflow-y-auto px-3 py-5 space-y-7">
        {/* Main Section */}
        <div>
          {!collapsed && (
            <p className="px-3.5 text-xs font-extrabold text-[#8A9993] uppercase tracking-wider mb-3">
              Platform & Tenants
            </p>
          )}
          <nav className="space-y-1.5">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={handleNavClick}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center rounded-xl font-semibold transition-all group relative cursor-pointer',
                    collapsed ? 'justify-center py-2 px-1' : 'gap-3 px-3 py-2 text-sm sm:text-[15px]',
                    isActive
                      ? 'bg-[#E9F9EE] text-[#006736] font-bold shadow-xs'
                      : 'text-[#5F7069] hover:text-[#14201C] hover:bg-[#F6FAF8]'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={clsx(
                        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200',
                        isActive ? 'shadow-xs ring-1 ring-black/5' : 'group-hover:scale-105'
                      )}
                      style={{
                        backgroundColor: item.bgColor,
                        color: item.color,
                      }}
                    >
                      <item.icon
                        className="w-4.5 h-4.5 shrink-0 transition-transform"
                        fill={item.color}
                        fillOpacity={0.2}
                        strokeWidth={2.2}
                      />
                    </div>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className="ml-auto px-2.5 py-0.5 rounded-full text-xs bg-[#E9F9EE] text-[#006736] font-bold border border-[#C4EBD0]">
                        {item.badge}
                      </span>
                    )}
                    {collapsed && item.badge && (
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#05A222] ring-2 ring-white" />
                    )}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-[#05A222] rounded-r-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* System & Ops Section */}
        <div>
          {!collapsed && (
            <p className="px-3.5 text-xs font-extrabold text-[#8A9993] uppercase tracking-wider mb-3">
              Infrastructure & Ops
            </p>
          )}
          <nav className="space-y-1.5">
            {systemNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center rounded-xl font-semibold transition-all group relative cursor-pointer',
                    collapsed ? 'justify-center py-2 px-1' : 'gap-3 px-3 py-2 text-sm sm:text-[15px]',
                    isActive
                      ? 'bg-[#E9F9EE] text-[#006736] font-bold shadow-xs'
                      : 'text-[#5F7069] hover:text-[#14201C] hover:bg-[#F6FAF8]'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={clsx(
                        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200',
                        isActive ? 'shadow-xs ring-1 ring-black/5' : 'group-hover:scale-105'
                      )}
                      style={{
                        backgroundColor: item.bgColor,
                        color: item.color,
                      }}
                    >
                      <item.icon
                        className="w-4.5 h-4.5 shrink-0 transition-transform"
                        fill={item.color}
                        fillOpacity={0.2}
                        strokeWidth={2.2}
                      />
                    </div>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className="ml-auto px-2.5 py-0.5 rounded-full text-xs bg-[#E9F9EE] text-[#006736] font-bold border border-[#C4EBD0]">
                        {item.badge}
                      </span>
                    )}
                    {collapsed && item.badge && (
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#05A222] ring-2 ring-white" />
                    )}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-[#05A222] rounded-r-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}

            {/* Back to Workspace link */}
            <NavLink
              to="/app"
              onClick={handleNavClick}
              title={collapsed ? 'Tenant App' : undefined}
              className={clsx(
                'flex items-center rounded-xl font-semibold transition-all group relative cursor-pointer text-[#5F7069] hover:text-[#006736] hover:bg-[#E9F9EE]',
                collapsed ? 'justify-center py-2 px-1' : 'gap-3 px-3 py-2 text-sm sm:text-[15px]'
              )}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#F6FAF8] text-[#5F7069] group-hover:bg-[#E9F9EE] group-hover:text-[#006736] transition-all">
                <ArrowLeft className="w-4.5 h-4.5 shrink-0" strokeWidth={2.2} />
              </div>
              {!collapsed && <span className="truncate font-medium">Tenant Workspace</span>}
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Account / Quick Status */}
      <div className="p-3.5 border-t border-[#E2EAE6]">
        {collapsed ? (
          <div
            title={`${adminName} (SUPER ADMIN)`}
            className="w-11 h-11 mx-auto rounded-xl bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0] flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer hover:bg-[#D9F3E2] transition-colors"
          >
            {adminInitials}
          </div>
        ) : (
          <div className="bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0] flex items-center justify-center font-bold text-xs shrink-0">
              {adminInitials}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-sm font-bold text-[#14201C] truncate">{adminName}</span>
              <span className="text-[11px] text-[#05A222] font-semibold uppercase">SUPER ADMIN</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
