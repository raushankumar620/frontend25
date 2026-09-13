import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { Code2, Key, Webhook, Terminal, BookOpen, ArrowLeft } from 'lucide-react';
import { ROUTES } from '../utils/constants';

export const DeveloperLayout: React.FC = () => {
  const devNavItems = [
    { label: 'Overview', path: ROUTES.DEVELOPERS_DASHBOARD, icon: Code2 },
    { label: 'API Keys', path: ROUTES.DEVELOPERS_API_KEYS, icon: Key },
    { label: 'Webhooks', path: ROUTES.DEVELOPERS_WEBHOOKS, icon: Webhook },
    { label: 'API Logs', path: ROUTES.DEVELOPERS_API_LOGS, icon: Terminal },
    { label: 'Documentation', path: ROUTES.DEVELOPERS_DOCS, icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-mono text-xs">
      {/* Dev Header */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/80 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to={ROUTES.DASHBOARD}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-sans"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2 font-bold font-sans text-sm text-emerald-400">
            <Code2 className="w-4 h-4" />
            <span>Developer Console</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded text-[10px]">
            API v1.4.0
          </span>
          <span className="text-slate-400">Live Environment</span>
        </div>
      </header>

      {/* Dev Sub-navigation */}
      <div className="border-b border-slate-800 bg-slate-900/40 px-6 flex items-center gap-2 font-sans overflow-x-auto">
        {devNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === ROUTES.DEVELOPERS_DASHBOARD}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2.5 border-b-2 text-xs font-medium transition-colors ${
                isActive
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <item.icon className="w-3.5 h-3.5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Dev Body */}
      <div className="flex-1 p-6 max-w-7xl w-full mx-auto font-sans">
        <Outlet />
      </div>
    </div>
  );
};
