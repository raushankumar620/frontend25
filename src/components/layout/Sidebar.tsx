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
  PanelLeftClose,
} from 'lucide-react';
import clsx from 'clsx';
import { ROUTES, APP_NAME } from '../../utils/constants';

export interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  onToggleCollapse,
}) => {
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
        'h-screen bg-white text-[#1F2A26] flex flex-col shrink-0 border-r border-[#E2EAE6] transition-all duration-300 select-none z-30 shadow-[4px_0_24px_rgba(1,59,35,0.02)]',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className={clsx(
        'h-16 flex items-center border-b border-[#E2EAE6]',
        collapsed ? 'justify-center px-2' : 'justify-between px-4'
      )}>
        {collapsed ? (
          <button
            onClick={onToggleCollapse}
            title="Expand sidebar"
            className="p-1.5 rounded-xl hover:bg-[#F6FAF8] transition-all cursor-pointer group flex items-center justify-center"
          >
            <img
              src="/images/svgicon.png"
              alt={APP_NAME}
              className="h-8 w-8 object-contain transition-transform group-hover:scale-110"
            />
          </button>
        ) : (
          <>
            <div className="flex items-center min-w-0">
              <img
                src="/images/logo.png"
                alt={APP_NAME}
                className="h-8 w-auto max-w-[155px] object-contain shrink-0"
              />
            </div>
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                title="Collapse sidebar"
                className="p-1.5 rounded-lg text-[#5F7069] hover:text-[#14201C] hover:bg-[#F6FAF8] transition-colors cursor-pointer shrink-0"
              >
                <PanelLeftClose className="w-5 h-5" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Nav list */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          {!collapsed && (
            <p className="px-3 text-xs font-bold text-[#8A9993] uppercase tracking-wider mb-2.5">
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
                    'flex items-center rounded-xl font-medium transition-all group relative cursor-pointer',
                    collapsed ? 'justify-center py-2.5 px-2' : 'gap-3 px-3.5 py-2.5 text-sm',
                    isActive
                      ? 'bg-[#E9F9EE] text-[#006736] font-semibold shadow-xs'
                      : 'text-[#5F7069] hover:text-[#14201C] hover:bg-[#F6FAF8]'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={clsx(
                        'w-[18px] h-[18px] shrink-0 transition-transform group-hover:scale-110',
                        isActive ? 'text-[#05A222]' : 'text-[#8A9993] group-hover:text-[#14201C]'
                      )}
                    />
                    {!collapsed && <span className="truncate text-sm">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className="ml-auto px-2 py-0.5 rounded-full text-xs bg-[#E9F9EE] text-[#006736] font-bold border border-[#C4EBD0]">
                        {item.badge}
                      </span>
                    )}
                    {!collapsed && item.highlight && (
                      <span className="ml-auto flex items-center gap-1 text-xs bg-[#E9F9EE] text-[#006736] font-semibold px-2 py-0.5 rounded-full border border-[#C4EBD0]">
                        <Sparkles className="w-3 h-3 text-[#05A222]" />
                        AI
                      </span>
                    )}
                    {collapsed && item.badge && (
                      <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-[#05A222]" />
                    )}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#05A222] rounded-r-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div>
          {!collapsed && (
            <p className="px-3 text-xs font-bold text-[#8A9993] uppercase tracking-wider mb-2.5">
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
                    'flex items-center rounded-xl font-medium transition-all group relative cursor-pointer',
                    collapsed ? 'justify-center py-2.5 px-2' : 'gap-3 px-3.5 py-2.5 text-sm',
                    isActive
                      ? 'bg-[#E9F9EE] text-[#006736] font-semibold shadow-xs'
                      : 'text-[#5F7069] hover:text-[#14201C] hover:bg-[#F6FAF8]'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={clsx(
                        'w-[18px] h-[18px] shrink-0 transition-transform group-hover:scale-110',
                        isActive ? 'text-[#05A222]' : 'text-[#8A9993] group-hover:text-[#14201C]'
                      )}
                    />
                    {!collapsed && <span className="truncate text-sm">{item.label}</span>}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#05A222] rounded-r-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Account / Quick Status */}
      <div className="p-3 border-t border-[#E2EAE6]">
        {collapsed ? (
          <div
            title="Acme Global Ltd (Enterprise Tier)"
            className="w-10 h-10 mx-auto rounded-xl bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0] flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer hover:bg-[#D9F3E2] transition-colors"
          >
            WM
          </div>
        ) : (
          <div className="bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0] flex items-center justify-center font-bold text-xs shrink-0">
              WM
            </div>
            <div className="flex flex-col truncate">
              <span className="text-sm font-semibold text-[#14201C] truncate">Acme Global Ltd</span>
              <span className="text-xs text-[#05A222] font-medium">Enterprise Tier</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
