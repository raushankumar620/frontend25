import React from 'react';
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
} from 'lucide-react';
import clsx from 'clsx';
import { ROUTES, APP_NAME } from '../../utils/constants';

export interface SidebarProps {
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const mainNavItems = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: 'Inbox', path: ROUTES.INBOX, icon: MessageSquare, badge: '5' },
    { label: 'Contacts', path: ROUTES.CONTACTS, icon: Users },
    { label: 'WhatsApp', path: ROUTES.WHATSAPP_NUMBERS, icon: Smartphone },
    { label: 'Templates', path: ROUTES.TEMPLATES, icon: FileText },
    { label: 'Campaigns', path: ROUTES.CAMPAIGNS, icon: Send },
    { label: 'Automations', path: ROUTES.AUTOMATIONS, icon: GitBranch },
    { label: 'AI Agents', path: ROUTES.AI_DASHBOARD, icon: Bot, highlight: true },
    { label: 'Analytics', path: ROUTES.ANALYTICS, icon: BarChart3 },
  ];

  const adminNavItems = [
    { label: 'Developers API', path: ROUTES.DEVELOPERS_DASHBOARD, icon: Code2 },
    { label: 'Team', path: ROUTES.TEAM, icon: Users2 },
    { label: 'Billing', path: ROUTES.BILLING, icon: CreditCard },
    { label: 'Settings', path: ROUTES.ACCOUNT_SETTINGS, icon: Settings },
  ];

  return (
    <aside
      className={clsx(
        'h-screen bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 transition-all duration-300 select-none z-30',
        collapsed ? 'w-18' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 gap-3 border-b border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 shrink-0">
          <MessageSquare className="w-5 h-5 fill-current" />
        </div>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="font-bold text-sm tracking-tight text-white truncate">{APP_NAME}</span>
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Meta Cloud API v20
            </span>
          </div>
        )}
      </div>

      {/* Nav list */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          {!collapsed && (
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Communication & CRM
            </p>
          )}
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative',
                    isActive
                      ? 'bg-emerald-600/15 text-emerald-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={clsx(
                        'w-4 h-4 shrink-0 transition-transform group-hover:scale-110',
                        isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                      )}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">
                        {item.badge}
                      </span>
                    )}
                    {!collapsed && item.highlight && (
                      <span className="ml-auto flex items-center gap-1 text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded-full">
                        <Sparkles className="w-2.5 h-2.5" />
                        AI
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-500 rounded-r-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div>
          {!collapsed && (
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Platform & System
            </p>
          )}
          <nav className="space-y-1">
            {adminNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative',
                    isActive
                      ? 'bg-emerald-600/15 text-emerald-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={clsx(
                        'w-4 h-4 shrink-0 transition-transform group-hover:scale-110',
                        isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                      )}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-500 rounded-r-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Account / Quick Status */}
      <div className="p-3 border-t border-slate-800">
        <div className="bg-slate-800/60 rounded-xl p-2.5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
            CF
          </div>
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-white truncate">Acme Global Ltd</span>
              <span className="text-[10px] text-emerald-400">Enterprise Tier</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
