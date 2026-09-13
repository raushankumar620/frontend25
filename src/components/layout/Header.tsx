import React from 'react';
import { Bell, Search, Menu, Zap, ShieldCheck } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Dropdown } from '../ui/Dropdown';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

export interface HeaderProps {
  onToggleSidebar?: () => void;
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  title,
  subtitle,
}) => {
  const navigate = useNavigate();

  const userDropdownItems = [
    { label: 'Profile & Account', onClick: () => navigate(ROUTES.ACCOUNT_SETTINGS) },
    { label: 'Business Settings', onClick: () => navigate(ROUTES.BUSINESS_PROFILE) },
    { label: 'API Keys', onClick: () => navigate(ROUTES.DEVELOPERS_API_KEYS) },
    { label: 'Sign Out', danger: true, onClick: () => navigate(ROUTES.LOGIN) },
  ];

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between z-20 shrink-0">
      {/* Left: Mobile trigger & Page Title */}
      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        {title ? (
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white">{title}</h1>
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
          </div>
        ) : (
          <div className="relative hidden md:flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search contacts, messages, templates (Ctrl + K)..."
              className="w-72 bg-slate-100 dark:bg-slate-800 border-0 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        )}
      </div>

      {/* Right: Status badge, Notification, User menu */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Meta Tier 3 Active</span>
        </div>

        <button
          onClick={() => navigate(ROUTES.CAMPAIGNS)}
          className="hidden md:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-colors"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Quick Broadcast</span>
        </button>

        <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

        <Dropdown
          trigger={
            <div className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Avatar name="Sarah Jenkins" size="sm" status="online" />
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">Sarah Jenkins</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Owner</span>
              </div>
            </div>
          }
          items={userDropdownItems}
        />
      </div>
    </header>
  );
};
