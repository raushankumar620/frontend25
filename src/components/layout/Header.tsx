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
    <header className="h-[72px] sm:h-20 bg-white border-b border-[#E2EAE6] px-5 sm:px-8 flex items-center justify-between z-20 shrink-0 shadow-xs">
      {/* Left: Mobile trigger & Page Title */}
      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2.5 rounded-xl text-[#5F7069] hover:bg-[#F6FAF8] hover:text-[#14201C] transition-colors cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        {title ? (
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-[#14201C]">{title}</h1>
            {subtitle && <p className="text-sm text-[#5F7069]">{subtitle}</p>}
          </div>
        ) : (
          <div className="relative hidden md:flex items-center">
            <Search className="w-4.5 h-4.5 text-[#8A9993] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search contacts, messages, templates (Ctrl + K)..."
              className="w-80 lg:w-96 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1F2A26] placeholder-[#8A9993] focus:outline-none focus:ring-2 focus:ring-[#05A222]/20 focus:border-[#05A222] transition-colors"
            />
          </div>
        )}
      </div>

      {/* Right: Status badge, Notification, User menu */}
      <div className="flex items-center gap-3.5">
        <div className="hidden sm:flex items-center gap-2 bg-[#E9F9EE] text-[#006736] px-3.5 py-1.5 rounded-full text-sm font-semibold border border-[#C4EBD0]">
          <ShieldCheck className="w-4 h-4 text-[#05A222]" />
          <span>Meta Tier 3 Active</span>
        </div>

        <button
          onClick={() => navigate(ROUTES.CAMPAIGNS)}
          className="hidden md:flex items-center gap-2 bg-[#05A222] hover:bg-[#006736] text-white text-sm font-bold px-4 py-2 rounded-xl shadow-sm transition-all active:scale-[0.98] cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          <span>Quick Broadcast</span>
        </button>

        <button className="relative p-2.5 rounded-xl text-[#5F7069] hover:bg-[#F6FAF8] hover:text-[#14201C] transition-colors cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#05A222] rounded-full ring-2 ring-white" />
        </button>

        <div className="h-8 w-px bg-[#E2EAE6] mx-1" />

        <Dropdown
          trigger={
            <div className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#F6FAF8] transition-colors cursor-pointer">
              <Avatar name="Sarah Jenkins" size="md" status="online" />
              <div className="hidden md:flex flex-col text-left">
                <span className="text-sm font-bold text-[#14201C]">Sarah Jenkins</span>
                <span className="text-xs text-[#5F7069] font-medium">Owner</span>
              </div>
            </div>
          }
          items={userDropdownItems}
        />
      </div>
    </header>
  );
};
