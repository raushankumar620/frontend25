import React, { useState, useEffect } from 'react';
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
  Crown,
  Check,
  LogOut,
  ArrowUpRight,
  Sparkles,
  X,
  UserPlus,
} from 'lucide-react';
import clsx from 'clsx';
import { ROUTES, APP_NAME } from '../../utils/constants';
import { useAuthStore } from '../../store/authStore';
import { billingService } from '../../services/billingService';
import { whatsappService } from '../../services/whatsappService';

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
  const [usageData, setUsageData] = useState<any>(null);
  const [channelsCount, setChannelsCount] = useState<number>(1);
  const [isPlanCardDismissed, setIsPlanCardDismissed] = useState<boolean>(() => {
    return localStorage.getItem('sidebar_plan_card_dismissed') === 'true';
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usageRes, numbersRes] = await Promise.allSettled([
          billingService.getUsage(),
          whatsappService.getNumbers(),
        ]);

        if (usageRes.status === 'fulfilled' && usageRes.value) {
          setUsageData(usageRes.value);
        }
        if (numbersRes.status === 'fulfilled' && Array.isArray(numbersRes.value)) {
          setChannelsCount(numbersRes.value.length || 1);
        }
      } catch {
        // Silently handle
      }
    };

    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [organization?.id]);

  const allNavItems: NavItem[] = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard, color: '#2563EB', bgColor: '#EFF6FF', permissionKey: 'dashboard' },
    { label: 'Inbox', path: ROUTES.INBOX, icon: MessageSquare, color: '#059669', bgColor: '#ECFDF5', permissionKey: 'inbox' },
    { label: 'Contacts', path: ROUTES.CONTACTS, icon: Users, color: '#7C3AED', bgColor: '#F5F3FF', permissionKey: 'contacts' },
    { label: 'Templates', path: ROUTES.TEMPLATES, icon: FileText, color: '#D97706', bgColor: '#FFFBEB', permissionKey: 'templates' },
    { label: 'Campaigns', path: ROUTES.CAMPAIGNS, icon: Send, color: '#E11D48', bgColor: '#FFF1F2', permissionKey: 'campaigns' },
    { label: 'Automations', path: ROUTES.AUTOMATIONS, icon: GitBranch, color: '#0891B2', bgColor: '#ECFEFF', permissionKey: 'automations' },
    { label: 'AI Agents', path: ROUTES.AI_DASHBOARD, icon: Bot, highlight: true, color: '#9333EA', bgColor: '#FAF5FF', permissionKey: 'ai_agents' },
    { label: 'Analytics', path: ROUTES.ANALYTICS, icon: BarChart3, color: '#4F46E5', bgColor: '#EEF2FF', permissionKey: 'analytics' },
    { label: 'Developers API', path: ROUTES.DEVELOPERS_DASHBOARD, icon: Code2, color: '#0D9488', bgColor: '#F0FDFA', permissionKey: 'developers' },
    { label: 'Team', path: ROUTES.TEAM, icon: UserPlus, color: '#05A222', bgColor: '#E9F9EE', permissionKey: 'team' },
    { label: 'Settings', path: ROUTES.ACCOUNT_SETTINGS, icon: Settings, color: '#64748B', bgColor: '#F8FAFC', permissionKey: 'settings' },
  ];

  // Admins see everything. For members, filter by their granted permissions.
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ORG_ADMIN' || user?.role === 'admin';
  const navItems = isAdmin
    ? allNavItems
    : allNavItems.filter((item) => {
        if (!item.permissionKey) return true;
        if (!user?.permissions || user.permissions.length === 0) {
          // Default fallback for legacy members without explicit permissions array
          return ['dashboard', 'inbox', 'contacts', 'templates'].includes(item.permissionKey);
        }
        return user.permissions.includes(item.permissionKey);
      });

  const orgDisplayName = organization?.name || user?.organizationName || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Workspace');
  const userInitial = (orgDisplayName?.[0] || user?.firstName?.[0] || 'A').toUpperCase();
  const userRole = user?.role === 'ORG_ADMIN' || user?.role === 'admin' ? 'Admin' : (user?.role === 'SUPER_ADMIN' ? 'Super Admin' : (user?.role ? String(user.role) : 'Admin'));
  const planName = usageData?.plan?.name || (organization?.plan ? organization.plan.replace(/_/g, ' ') : 'PRO');
  const rawStatus = usageData?.plan?.status ? usageData.plan.status.toUpperCase() : '';
  const planBadge = rawStatus && !rawStatus.includes('TRAIL') && !rawStatus.includes('TRIAL') ? rawStatus : 'ACTIVE';

  // Dynamic limits from live usage / org limits
  const maxChannels = organization?.limits?.maxNumbers || Math.max(channelsCount, 1);
  const channelsText = `${channelsCount} / ${maxChannels} Channel${maxChannels > 1 ? 's' : ''}`;
  const messagesLimit = usageData?.metrics?.messages?.limit || organization?.limits?.monthlyMessages;
  const campaignsText = messagesLimit ? `${messagesLimit.toLocaleString()} Messages/mo` : 'Unlimited Campaign';
  const contactsLimit = usageData?.metrics?.contacts?.limit || 10000;
  const contactsText = `${contactsLimit.toLocaleString()} Contacts`;

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
                    <span className="ml-auto px-2 py-0.5 rounded-full text-[11px] bg-[#E9F9EE] text-[#006736] font-bold border border-[#C4EBD0]">
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

        {/* Embedded Plan & Resource Usage Box directly inside Sidebar */}
        {!collapsed ? (
          !isPlanCardDismissed ? (
            <div className="relative overflow-hidden rounded-2xl p-3.5 bg-gradient-to-br from-[#013B23] via-[#006736] to-[#012818] text-white shadow-md border border-[#05A222]/30 space-y-3 transition-all">
              {/* Background decorative glow */}
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#1CD72C]/15 rounded-full blur-xl pointer-events-none" />
              <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-[#07CF74]/15 rounded-full blur-lg pointer-events-none" />

              {/* Header: Crown + Plan Name + Status + Close Button */}
              <div className="relative flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xs shrink-0">
                    <Crown className="w-4.5 h-4.5 text-[#6AEB31]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-extrabold text-white capitalize tracking-tight truncate">
                        {planName} Plan
                      </span>
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-[#1CD72C]/20 text-[#6AEB31] border border-[#1CD72C]/40 px-1.5 py-0.2 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1CD72C] animate-pulse" />
                        {planBadge}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPlanCardDismissed(true);
                    localStorage.setItem('sidebar_plan_card_dismissed', 'true');
                  }}
                  title="Close Subscription Box"
                  className="w-5 h-5 rounded-md flex items-center justify-center text-white/60 hover:text-white hover:bg-white/15 transition-colors cursor-pointer shrink-0 -mr-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Checklist items with Live Backend Data */}
              <div className="relative space-y-1.5 pt-2 border-t border-white/10 text-[11px] text-white/90 font-medium">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#C4EBD0] flex items-center gap-1.5 truncate">
                    <Check className="w-3.5 h-3.5 text-[#6AEB31] shrink-0" />
                    <span>Channels</span>
                  </span>
                  <span className="font-semibold text-white font-mono text-[11px] shrink-0">
                    {channelsText}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#C4EBD0] flex items-center gap-1.5 truncate">
                    <Check className="w-3.5 h-3.5 text-[#6AEB31] shrink-0" />
                    <span>Messages</span>
                  </span>
                  <span className="font-semibold text-white font-mono text-[11px] shrink-0">
                    {campaignsText}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#C4EBD0] flex items-center gap-1.5 truncate">
                    <Check className="w-3.5 h-3.5 text-[#6AEB31] shrink-0" />
                    <span>Contacts</span>
                  </span>
                  <span className="font-semibold text-white font-mono text-[11px] shrink-0">
                    {contactsText}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(ROUTES.BILLING)}
                className="relative w-full py-2 px-3 bg-white/10 hover:bg-white/20 active:bg-white/25 text-white border border-white/20 rounded-xl text-xs font-bold transition-all text-center cursor-pointer shadow-xs flex items-center justify-center gap-1.5 group"
              >
                <span>Manage Subscription</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#6AEB31] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-[#013B23] via-[#006736] to-[#012818] border border-[#05A222]/30 text-white shadow-xs">
              <button
                type="button"
                onClick={() => navigate(ROUTES.BILLING)}
                className="flex items-center gap-2.5 text-left hover:opacity-90 transition-opacity cursor-pointer group flex-1 min-w-0"
              >
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-[#6AEB31] shrink-0 border border-white/15">
                  <Crown className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white capitalize truncate leading-tight">
                      {planName}
                    </span>
                    <span className="text-[9px] font-bold bg-[#1CD72C]/25 text-[#6AEB31] px-1 py-0.2 rounded leading-tight">
                      {planBadge}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#C4EBD0] font-medium block leading-tight mt-0.5 truncate">
                    Manage Subscription &rarr;
                  </span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPlanCardDismissed(false);
                  localStorage.setItem('sidebar_plan_card_dismissed', 'false');
                }}
                title="Show Subscription Details"
                className="w-6 h-6 rounded-lg flex items-center justify-center text-[#C4EBD0] hover:text-white hover:bg-white/15 transition-colors cursor-pointer shrink-0 ml-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#6AEB31]" />
              </button>
            </div>
          )
        ) : (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => navigate(ROUTES.BILLING)}
              title={`Subscription: ${planName} (${planBadge}) - Click to Manage`}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#013B23] to-[#006736] text-[#6AEB31] flex items-center justify-center shadow-xs border border-[#05A222]/30 hover:scale-105 transition-transform cursor-pointer"
            >
              <Crown className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Account / User Footer Directly in Sidebar */}
      <div className="p-3 border-t border-slate-200 bg-white">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(ROUTES.ACCOUNT_SETTINGS)}
              title={`${orgDisplayName} (${userRole}) - Click for Settings`}
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
              onClick={() => navigate(ROUTES.ACCOUNT_SETTINGS)}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer hover:opacity-80 transition-opacity flex-1"
              title="Click to view Account Profile"
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
              <button
                type="button"
                onClick={() => navigate(ROUTES.ACCOUNT_SETTINGS)}
                title="Settings Hub"
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white transition-all cursor-pointer shadow-2xs border border-transparent hover:border-slate-200"
              >
                <Settings className="w-4 h-4" />
              </button>

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
