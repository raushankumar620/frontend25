import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Code2, Key, Webhook, Terminal, BookOpen, ShieldCheck } from 'lucide-react';
import { ROUTES } from '../utils/constants';
import { PageContainer } from '../components/layout/PageContainer';

export const DeveloperLayout: React.FC = () => {
  const devNavItems = [
    { label: 'Overview', path: ROUTES.DEVELOPERS_DASHBOARD, icon: Code2 },
    { label: 'API Keys', path: ROUTES.DEVELOPERS_API_KEYS, icon: Key },
    { label: 'Webhooks', path: ROUTES.DEVELOPERS_WEBHOOKS, icon: Webhook },
    { label: 'API Logs', path: ROUTES.DEVELOPERS_API_LOGS, icon: Terminal },
    { label: 'Documentation', path: ROUTES.DEVELOPERS_DOCS, icon: BookOpen },
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
        <div className="border-b border-[#E2EAE6] flex items-center gap-2 overflow-x-auto">
          {devNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === ROUTES.DEVELOPERS_DASHBOARD}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2.5 border-b-2 text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#05A222] text-[#006736] font-semibold bg-[#E9F9EE]/60 rounded-t-xl'
                    : 'border-transparent text-[#5F7069] hover:text-[#14201C] hover:bg-white rounded-t-xl'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
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
