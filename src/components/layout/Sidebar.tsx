import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Smartphone,
  FileText,
  Send,
  GitBranch,
  Bot,
  BarChart3,
  CreditCard,
  Code2,
  Settings,
  Users2,
  Sparkles,
  PanelLeftClose,
  Bell,
} from 'lucide-react';
import clsx from 'clsx';
import { ROUTES, APP_NAME } from '../../utils/constants';
import { useAuthStore } from '../../store/authStore';
import { notificationService } from '../../services/notificationService';

export interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  badge?: string;
  highlight?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  onToggleCollapse,
}) => {
  const { user, organization } = useAuthStore();
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await notificationService.getUnreadCount();
        if (res.success && res.data) {
          setUnreadNotifCount(res.data.unreadCount || 0);
        }
      } catch {
        // Silently catch
      }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 20000);
    return () => clearInterval(interval);
  }, []);

  const mainNavItems: NavItem[] = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard, color: '#2563EB', bgColor: '#EFF6FF' },
    { label: 'Inbox', path: ROUTES.INBOX, icon: MessageSquare, color: '#059669', bgColor: '#ECFDF5' },
    { label: 'Contacts', path: ROUTES.CONTACTS, icon: Users, color: '#7C3AED', bgColor: '#F5F3FF' },
    { label: 'WhatsApp', path: ROUTES.WHATSAPP_NUMBERS, icon: Smartphone, color: '#25D366', bgColor: '#E9F9EE' },
    { label: 'Templates', path: ROUTES.TEMPLATES, icon: FileText, color: '#D97706', bgColor: '#FFFBEB' },
    { label: 'Campaigns', path: ROUTES.CAMPAIGNS, icon: Send, color: '#E11D48', bgColor: '#FFF1F2' },
    { label: 'Automations', path: ROUTES.AUTOMATIONS, icon: GitBranch, color: '#0891B2', bgColor: '#ECFEFF' },
    { label: 'AI Agents', path: ROUTES.AI_DASHBOARD, icon: Bot, highlight: true, color: '#9333EA', bgColor: '#FAF5FF' },
    { label: 'Analytics', path: ROUTES.ANALYTICS, icon: BarChart3, color: '#4F46E5', bgColor: '#EEF2FF' },
  ];

  const adminNavItems: NavItem[] = [
    {
      label: 'Notifications',
      path: ROUTES.NOTIFICATIONS,
      icon: Bell,
      color: '#05A222',
      bgColor: '#E9F9EE',
      badge: unreadNotifCount > 0 ? (unreadNotifCount > 99 ? '99+' : String(unreadNotifCount)) : undefined,
    },
    { label: 'Developers API', path: ROUTES.DEVELOPERS_DASHBOARD, icon: Code2, color: '#0D9488', bgColor: '#F0FDFA' },
    { label: 'Team', path: ROUTES.TEAM, icon: Users2, color: '#DB2777', bgColor: '#FDF2F8' },
    { label: 'Billing', path: ROUTES.BILLING, icon: CreditCard, color: '#16A34A', bgColor: '#F0FDF4' },
    { label: 'Settings', path: ROUTES.ACCOUNT_SETTINGS, icon: Settings, color: '#64748B', bgColor: '#F8FAFC' },
  ];

  const orgName = organization?.name || user?.organizationName || 'WhatsApp Workspace';
  const orgInitials = orgName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || 'WM';
  const orgPlan = organization?.plan ? `${organization.plan.replace('_', ' ')}` : 'FREE TRIAL';

  return (
    <aside
      className={clsx(
        'h-screen bg-white text-[#1F2A26] flex flex-col shrink-0 border-r border-[#E2EAE6] transition-all duration-300 select-none z-30 shadow-[4px_0_24px_rgba(1,59,35,0.02)]',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className={clsx(
        'h-[72px] sm:h-20 flex items-center border-b border-[#E2EAE6]',
        collapsed ? 'justify-center px-2' : 'justify-between px-5'
      )}>
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
        <div>
          {!collapsed && (
            <p className="px-3.5 text-xs font-extrabold text-[#8A9993] uppercase tracking-wider mb-3">
              Communication & CRM
            </p>
          )}
          <nav className="space-y-1.5">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
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
                    {!collapsed && item.highlight && (
                      <span className="ml-auto flex items-center gap-1 text-xs bg-[#E9F9EE] text-[#006736] font-bold px-2.5 py-0.5 rounded-full border border-[#C4EBD0]">
                        <Sparkles className="w-3.5 h-3.5 text-[#05A222]" />
                        AI
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

        <div>
          {!collapsed && (
            <p className="px-3.5 text-xs font-extrabold text-[#8A9993] uppercase tracking-wider mb-3">
              Platform & System
            </p>
          )}
          <nav className="space-y-1.5">
            {adminNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
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
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-[#05A222] rounded-r-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Account / Quick Status */}
      <div className="p-3.5 border-t border-[#E2EAE6]">
        {collapsed ? (
          <div
            title={`${orgName} (${orgPlan})`}
            className="w-11 h-11 mx-auto rounded-xl bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0] flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer hover:bg-[#D9F3E2] transition-colors"
          >
            {orgInitials}
          </div>
        ) : (
          <div className="bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0] flex items-center justify-center font-bold text-xs shrink-0">
              {orgInitials}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-sm font-bold text-[#14201C] truncate">{orgName}</span>
              <span className="text-[11px] text-[#05A222] font-semibold uppercase">{orgPlan}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
