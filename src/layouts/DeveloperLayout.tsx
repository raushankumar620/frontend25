import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Code2, Key, Webhook, Terminal, BookOpen, ShieldCheck, Server } from 'lucide-react';
import { ROUTES } from '../utils/constants';
import { PageContainer } from '../components/layout/PageContainer';

export const DeveloperLayout: React.FC = () => {
  const devNavItems = [
    {
      label: 'Overview',
      path: ROUTES.DEVELOPERS_DASHBOARD,
      icon: Code2,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-100/80',
      activeBg: 'bg-emerald-600',
      activeTabClass: 'border-[#05A222] text-[#006736] font-bold bg-[#E9F9EE]/70',
    },
    {
      label: 'API Keys',
      path: ROUTES.DEVELOPERS_API_KEYS,
      icon: Key,
      color: 'text-amber-700',
      bgColor: 'bg-amber-100/80',
      activeBg: 'bg-amber-600',
      activeTabClass: 'border-amber-500 text-amber-900 font-bold bg-amber-50/70',
    },
    {
      label: 'Webhooks',
      path: ROUTES.DEVELOPERS_WEBHOOKS,
      icon: Webhook,
      color: 'text-orange-700',
      bgColor: 'bg-orange-100/80',
      activeBg: 'bg-orange-600',
      activeTabClass: 'border-orange-500 text-orange-900 font-bold bg-orange-50/70',
    },
    {
      label: 'API Logs',
      path: ROUTES.DEVELOPERS_API_LOGS,
      icon: Terminal,
      color: 'text-sky-700',
      bgColor: 'bg-sky-100/80',
      activeBg: 'bg-sky-600',
      activeTabClass: 'border-sky-500 text-sky-900 font-bold bg-sky-50/70',
    },
    {
      label: 'Backend Setup',
      path: ROUTES.DEVELOPERS_BACKEND_SETUP,
      icon: Server,
      color: 'text-indigo-700',
      bgColor: 'bg-indigo-100/80',
      activeBg: 'bg-indigo-600',
      activeTabClass: 'border-indigo-500 text-indigo-900 font-bold bg-indigo-50/70',
      badge: 'New',
    },
    {
      label: 'Documentation',
      path: ROUTES.DEVELOPERS_DOCS,
      icon: BookOpen,
      color: 'text-purple-700',
      bgColor: 'bg-purple-100/80',
      activeBg: 'bg-purple-600',
      activeTabClass: 'border-purple-500 text-purple-900 font-bold bg-purple-50/70',
    },
  ];

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Developer Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-[#14201C] tracking-tight">
                Developer API & Integrations
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 bg-[#E9F9EE] text-[#006736] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#C4EBD0]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#05A222]" />
                API v1.4 Live
              </span>
            </div>
            <p className="text-xs text-[#5F7069] mt-1">
              Programmatic WhatsApp Cloud API credentials, webhook endpoints, and real-time request telemetry.
            </p>
          </div>
        </div>

        {/* Developer Sub-navigation Tabs */}
        <div className="border-b border-[#E2EAE6] flex items-center gap-1.5 overflow-x-auto pb-px">
          {devNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === ROUTES.DEVELOPERS_DASHBOARD}
              className={({ isActive }) =>
                `group flex items-center gap-2 px-3.5 py-2 border-b-2 text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer rounded-t-xl ${
                  isActive
                    ? `${item.activeTabClass} shadow-2xs`
                    : 'border-transparent text-[#5F7069] hover:text-[#14201C] hover:bg-[#F8FAFC]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                      isActive ? `${item.activeBg} text-white shadow-2xs` : `${item.bgColor} ${item.color}`
                    }`}
                  >
                    <item.icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : item.color}`} />
                  </div>
                  <span className={isActive ? 'font-bold' : 'font-medium'}>{item.label}</span>
                  {item.badge && (
                    <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-bold rounded-md bg-[#006736] text-white">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Developer Page Content */}
        <div className="pt-2">
          <Outlet />
        </div>
      </div>
    </PageContainer>
  );
};
