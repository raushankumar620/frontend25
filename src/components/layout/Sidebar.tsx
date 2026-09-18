import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  FileText,
  Send,
  GitBranch,
  Bot,
  BarChart3,
  Code2,
  Settings,
  PanelLeftClose,
  LogOut,
  ArrowUpRight,
  Sparkles,
  UserPlus,
  CreditCard,
  Headphones,
} from 'lucide-react';
import clsx from 'clsx';
import { ROUTES, APP_NAME } from '../../utils/constants';
import { useAuthStore } from '../../store/authStore';

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
  permissionKey?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  onToggleCollapse,
}) => {
  const navigate = useNavigate();
  const { user, organization, logout } = useAuthStore();

  const allNavItems: NavItem[] = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard, color: '#05A222', bgColor: '#E9F9EE', permissionKey: 'dashboard' },
    { label: 'Inbox', path: ROUTES.INBOX, icon: MessageSquare, color: '#05A222', bgColor: '#E9F9EE', badge: '12', permissionKey: 'inbox' },
    { label: 'Contacts', path: ROUTES.CONTACTS, icon: Users, color: '#05A222', bgColor: '#E9F9EE', permissionKey: 'contacts' },
    { label: 'Templates', path: ROUTES.TEMPLATES, icon: FileText, color: '#05A222', bgColor: '#E9F9EE', permissionKey: 'templates' },
    { label: 'Campaigns', path: ROUTES.CAMPAIGNS, icon: Send, color: '#05A222', bgColor: '#E9F9EE', permissionKey: 'campaigns' },
    { label: 'Automations', path: ROUTES.AUTOMATIONS, icon: GitBranch, color: '#05A222', bgColor: '#E9F9EE', permissionKey: 'automations' },
    { label: 'AI Agents', path: ROUTES.AI_DASHBOARD, icon: Bot, highlight: true, color: '#05A222', bgColor: '#E9F9EE', permissionKey: 'ai_agents' },
    { label: 'Analytics', path: ROUTES.ANALYTICS, icon: BarChart3, color: '#05A222', bgColor: '#E9F9EE', permissionKey: 'analytics' },
    { label: 'Billing & Subscription', path: ROUTES.BILLING, icon: CreditCard, color: '#05A222', bgColor: '#E9F9EE', permissionKey: 'billing' },
    { label: 'Developers API', path: ROUTES.DEVELOPERS_DASHBOARD, icon: Code2, color: '#05A222', bgColor: '#E9F9EE', permissionKey: 'developers' },
    { label: 'Team', path: ROUTES.TEAM, icon: UserPlus, color: '#05A222', bgColor: '#E9F9EE', permissionKey: 'team' },
    { label: 'Settings', path: ROUTES.ACCOUNT_SETTINGS, icon: Settings, color: '#05A222', bgColor: '#E9F9EE', permissionKey: 'settings' },
  ];

  // Check permissions strictly: Org Admins see everything; members ONLY see ticked modules.
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ORG_ADMIN' || user?.role === 'admin';
  const userPermissions = Array.isArray(user?.permissions) ? user.permissions : [];
  const hasSettingsAccess = isAdmin || userPermissions.includes('settings');

  const navItems = isAdmin
    ? allNavItems
    : allNavItems.filter((item) => {
        return item.permissionKey && userPermissions.includes(item.permissionKey);
      });

  const orgDisplayName = organization?.name || user?.organizationName || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Workspace');
  const userInitial = (orgDisplayName?.[0] || user?.firstName?.[0] || 'A').toUpperCase();
  const userRole = user?.role === 'ORG_ADMIN' || user?.role === 'admin' ? 'Admin' : (user?.role === 'SUPER_ADMIN' ? 'Super Admin' : (user?.role ? String(user.role) : 'Admin'));

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
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 no-scrollbar">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                clsx(
                  'flex items-center rounded-xl font-semibold transition-all group relative cursor-pointer',
                  collapsed ? 'justify-center py-2 px-1' : 'gap-3 px-3 py-2 text-sm sm:text-[14px]',
                  isActive
                    ? 'bg-[#E9F9EE] text-[#006736] font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={clsx(
                      'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200',
                      isActive ? 'shadow-2xs ring-1 ring-black/5' : 'group-hover:scale-105'
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
                    <span className={clsx(
                      "ml-auto px-2 py-0.5 rounded-full text-[11px] font-bold",
                      item.label === 'Inbox' ? "bg-[#EF4444] text-white shadow-2xs" : "bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]"
                    )}>
                      {item.badge}
                    </span>
                  )}
                  {!collapsed && item.highlight && (
                    <span className="ml-auto flex items-center gap-1 text-[11px] bg-[#E9F9EE] text-[#006736] font-bold px-2 py-0.5 rounded-full border border-[#C4EBD0]">
                      <Sparkles className="w-3 h-3 text-[#05A222]" />
                      AI
                    </span>
                  )}
                  {collapsed && item.badge && (
                    <span className={clsx(
                      "absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full ring-2 ring-white",
                      item.label === 'Inbox' ? "bg-[#EF4444]" : "bg-[#05A222]"
                    )} />
                  )}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-[#05A222] rounded-r-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Promo Mascot Banner */}
        {!collapsed && (
          <div className="relative overflow-hidden rounded-2xl group hover:shadow-md transition-all cursor-pointer">
            <img
              src="/sidebarimg/sidebar image.png"
              alt="Same Conversations Bigger Opportunities!"
              className="w-full h-auto object-contain rounded-2xl group-hover:scale-[1.02] transition-transform"
            />
          </div>
        )}

        {/* Support Help Link */}
        {!collapsed && (
          <button
            type="button"
            onClick={() => navigate(ROUTES.ACCOUNT_SETTINGS)}
            className="w-full p-2.5 bg-[#F6FAF8] hover:bg-[#E9F9EE] border border-[#E2EAE6] hover:border-[#C4EBD0] rounded-xl flex items-center justify-between text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-white text-[#006736] flex items-center justify-center border border-[#E2EAE6] shrink-0 shadow-2xs">
                <Headphones className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-[#14201C] group-hover:text-[#006736] truncate">Need Help?</div>
                <div className="text-[10px] text-[#5F7069] truncate">We're here for you</div>
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8A9993] group-hover:text-[#05A222] transition-colors shrink-0" />
          </button>
        )}
      </div>

      {/* Account / User Footer Directly in Sidebar */}
      <div className="p-3 border-t border-slate-200 bg-white">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => hasSettingsAccess && navigate(ROUTES.ACCOUNT_SETTINGS)}
              title={`${orgDisplayName} (${userRole})`}
              className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 cursor-pointer hover:opacity-95 shadow-2xs transition-all"
            >
              {userInitial}
            </button>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate(ROUTES.LOGIN);
              }}
              title="Logout"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-2.5 flex items-center justify-between gap-2 transition-all">
            <div
              onClick={() => hasSettingsAccess && navigate(ROUTES.ACCOUNT_SETTINGS)}
              className={clsx(
                "flex items-center gap-2.5 min-w-0 flex-1",
                hasSettingsAccess && "cursor-pointer hover:opacity-80 transition-opacity"
              )}
              title={hasSettingsAccess ? "Click to view Account Settings" : orgDisplayName}
            >
              <div className="w-8.5 h-8.5 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                {userInitial}
              </div>
              <div className="flex flex-col min-w-0 truncate">
                <span className="text-xs font-bold text-slate-900 truncate">{orgDisplayName}</span>
                <span className="text-[10px] text-slate-500 font-medium">{userRole}</span>
              </div>
            </div>

            {/* Direct Inline Action Buttons */}
            <div className="flex items-center gap-1 shrink-0">
              {hasSettingsAccess && (
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.ACCOUNT_SETTINGS)}
                  title="Settings Hub"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white transition-all cursor-pointer shadow-2xs border border-transparent hover:border-slate-200"
                >
                  <Settings className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate(ROUTES.LOGIN);
                }}
                title="Logout"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer shadow-2xs border border-transparent hover:border-rose-100"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
