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
    <header className="h-16 bg-white border-b border-[#E2EAE6] px-4 sm:px-6 flex items-center justify-between z-20 shrink-0">
      {/* Left: Mobile trigger & Page Title */}
      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-[#5F7069] hover:bg-[#F6FAF8] hover:text-[#14201C] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        {title ? (
          <div>
            <h1 className="text-base font-bold text-[#14201C]">{title}</h1>
            {subtitle && <p className="text-xs text-[#5F7069]">{subtitle}</p>}
          </div>
        ) : (
          <div className="relative hidden md:flex items-center">
            <Search className="w-4 h-4 text-[#8A9993] absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search contacts, messages, templates (Ctrl + K)..."
              className="w-72 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#1F2A26] placeholder-[#8A9993] focus:outline-none focus:ring-2 focus:ring-[#05A222]/20 focus:border-[#05A222] transition-colors"
            />
          </div>
        )}
      </div>

      {/* Right: Status badge, Notification, User menu */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 bg-[#E9F9EE] text-[#006736] px-2.5 py-1 rounded-full text-xs font-medium border border-[#C4EBD0]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#05A222]" />
          <span>Meta Tier 3 Active</span>
        </div>

        <button
          onClick={() => navigate(ROUTES.CAMPAIGNS)}
          className="hidden md:flex items-center gap-1.5 bg-[#05A222] hover:bg-[#006736] text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-sm transition-all active:scale-[0.98] cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Quick Broadcast</span>
        </button>

        <button className="relative p-2 rounded-lg text-[#5F7069] hover:bg-[#F6FAF8] hover:text-[#14201C] transition-colors cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#05A222] rounded-full ring-2 ring-white" />
        </button>

        <div className="h-6 w-px bg-[#E2EAE6] mx-1" />

        <Dropdown
          trigger={
            <div className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-[#F6FAF8] transition-colors cursor-pointer">
              <Avatar name="Sarah Jenkins" size="sm" status="online" />
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-[#14201C]">Sarah Jenkins</span>
                <span className="text-[10px] text-[#5F7069]">Owner</span>
              </div>
            </div>
          }
          items={userDropdownItems}
        />
      </div>
    </header>
  );
};
