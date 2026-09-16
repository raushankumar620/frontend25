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
  Sparkles,
  PanelLeftClose,
  Crown,
  Check,
  LogOut,
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
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  onToggleCollapse,
}) => {
  const navigate = useNavigate();
  const { user, organization, logout } = useAuthStore();
  const [usageData, setUsageData] = useState<any>(null);
  const [channelsCount, setChannelsCount] = useState<number>(1);

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

  const navItems: NavItem[] = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard, color: '#2563EB', bgColor: '#EFF6FF' },
    { label: 'Inbox', path: ROUTES.INBOX, icon: MessageSquare, color: '#059669', bgColor: '#ECFDF5' },
    { label: 'Contacts', path: ROUTES.CONTACTS, icon: Users, color: '#7C3AED', bgColor: '#F5F3FF' },
    { label: 'Templates', path: ROUTES.TEMPLATES, icon: FileText, color: '#D97706', bgColor: '#FFFBEB' },
    { label: 'Campaigns', path: ROUTES.CAMPAIGNS, icon: Send, color: '#E11D48', bgColor: '#FFF1F2' },
    { label: 'Automations', path: ROUTES.AUTOMATIONS, icon: GitBranch, color: '#0891B2', bgColor: '#ECFEFF' },
    { label: 'AI Agents', path: ROUTES.AI_DASHBOARD, icon: Bot, highlight: true, color: '#9333EA', bgColor: '#FAF5FF' },
    { label: 'Analytics', path: ROUTES.ANALYTICS, icon: BarChart3, color: '#4F46E5', bgColor: '#EEF2FF' },
    { label: 'Developers API', path: ROUTES.DEVELOPERS_DASHBOARD, icon: Code2, color: '#0D9488', bgColor: '#F0FDFA' },
    { label: 'Settings', path: ROUTES.ACCOUNT_SETTINGS, icon: Settings, color: '#64748B', bgColor: '#F8FAFC' },
  ];

  const orgDisplayName = organization?.name || user?.organizationName || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Workspace');
  const userInitial = (orgDisplayName?.[0] || user?.firstName?.[0] || 'A').toUpperCase();
  const userRole = user?.role === 'ORG_ADMIN' || user?.role === 'admin' ? 'Admin' : (user?.role === 'SUPER_ADMIN' ? 'Super Admin' : (user?.role ? String(user.role) : 'Admin'));
  const planName = usageData?.plan?.name || (organization?.plan ? organization.plan.replace(/_/g, ' ') : 'PRO');
  const planBadge = usageData?.plan?.status ? usageData.plan.status.toUpperCase() : 'PRO';

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
        {!collapsed && (
          <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-3.5 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6.5 h-6.5 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center border border-amber-200 shadow-2xs">
                  <Crown className="w-3.5 h-3.5 fill-amber-600/20 stroke-[2.2]" />
                </div>
                <span className="text-xs font-bold text-slate-900 capitalize truncate">{planName}</span>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase border border-emerald-200">
                {planBadge}
              </span>
            </div>

            {/* Checklist items with Live Backend Data */}
            <div className="space-y-1.5 pt-0.5 border-t border-slate-200/60">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 stroke-[2.5]" />
                <span className="truncate">{channelsText}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 stroke-[2.5]" />
                <span className="truncate">{campaignsText}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                <span className="truncate">{contactsText}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/settings?tab=billing')}
              className="w-full mt-1 py-1.5 px-2 bg-white hover:bg-slate-100/90 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl text-[11px] font-bold transition-all text-center cursor-pointer shadow-2xs"
            >
              Manage Subscription
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
              onClick={() => navigate('/settings?tab=account')}
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
