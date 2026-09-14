import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Search,
  Menu,
  Zap,
  ShieldCheck,
  User as UserIcon,
  Building,
  Key,
  Users2,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { useAuthStore } from '../../store/authStore';

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
  const { user, organization, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setIsDropdownOpen(false);
    logout();
    navigate(ROUTES.LOGIN);
  };

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();
  const displayName = fullName || user?.name || (user?.email ? user.email.split('@')[0] : 'User');
  const displayEmail = user?.email || '';
  const displayRole = user?.role ? user.role.replace(/_/g, ' ') : 'ORG ADMIN';
  const orgName = organization?.name || user?.organizationName || 'WhatsApp Workspace';
  const orgPlan = organization?.plan ? organization.plan.replace(/_/g, ' ') : 'FREE TRIAL';

  return (
    <header className="h-[72px] sm:h-20 bg-white border-b border-[#E2EAE6] px-5 sm:px-8 flex items-center justify-between z-20 shrink-0 shadow-xs">
      {/* Left: Mobile trigger & Page Title */}
      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2.5 rounded-xl text-[#5F7069] hover:bg-[#F6FAF8] hover:text-[#14201C] transition-colors cursor-pointer"
            aria-label="Toggle sidebar menu"
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
              className="w-80 lg:w-96 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1F2A26] placeholder-[#8A9993] focus:outline-none focus:ring-2 focus:ring-[#05A222]/20 focus:border-[#05A222] transition-colors font-medium"
            />
          </div>
        )}
      </div>

      {/* Right: Status badge, Notification, User menu */}
      <div className="flex items-center gap-3.5">
        <div className="hidden sm:flex items-center gap-2 bg-[#E9F9EE] text-[#006736] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#C4EBD0]">
          <ShieldCheck className="w-4 h-4 text-[#05A222]" />
          <span>{orgPlan}</span>
        </div>

        <button
          onClick={() => navigate(ROUTES.CAMPAIGNS)}
          className="hidden md:flex items-center gap-2 bg-[#05A222] hover:bg-[#006736] text-white text-sm font-bold px-4 py-2 rounded-xl shadow-sm transition-all active:scale-[0.98] cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          <span>Quick Broadcast</span>
        </button>

        <button
          className="relative p-2.5 rounded-xl text-[#5F7069] hover:bg-[#F6FAF8] hover:text-[#14201C] transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#05A222] rounded-full ring-2 ring-white" />
        </button>

        <div className="h-8 w-px bg-[#E2EAE6] mx-1" />

        {/* Dynamic User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#F6FAF8] transition-colors cursor-pointer text-left focus:outline-none"
            aria-expanded={isDropdownOpen}
          >
            <Avatar
              name={displayName}
              src={user?.avatarUrl || user?.avatar}
              size="md"
              status="online"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-bold text-[#14201C] truncate max-w-[150px]">
                {displayName}
              </span>
              <span className="text-[11px] text-[#05A222] font-semibold uppercase tracking-wide">
                {displayRole}
              </span>
            </div>
            <ChevronDown className="hidden md:block w-4 h-4 text-[#8A9993]" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-[0_16px_50px_rgba(1,59,35,0.12)] border border-[#E2EAE6] py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              {/* User Header Info */}
              <div className="px-4 py-3 border-b border-[#E2EAE6] bg-[#F6FAF8]/60">
                <p className="text-sm font-bold text-[#14201C] truncate">{displayName}</p>
                {displayEmail && (
                  <p className="text-xs text-[#5F7069] truncate mt-0.5">{displayEmail}</p>
                )}
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] bg-[#E9F9EE] text-[#006736] font-bold px-2 py-0.5 rounded-md border border-[#C4EBD0] uppercase">
                    {displayRole}
                  </span>
                  <span className="text-[10px] text-[#8A9993] truncate max-w-[110px]">
                    {orgName}
                  </span>
                </div>
              </div>

              {/* Menu Links */}
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate(ROUTES.ACCOUNT_SETTINGS);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-[#1F2A26] hover:bg-[#F6FAF8] hover:text-[#05A222] transition-colors cursor-pointer"
                >
                  <UserIcon className="w-4 h-4 text-[#8A9993]" />
                  <span>Profile & Account</span>
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate(ROUTES.BUSINESS_PROFILE);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-[#1F2A26] hover:bg-[#F6FAF8] hover:text-[#05A222] transition-colors cursor-pointer"
                >
                  <Building className="w-4 h-4 text-[#8A9993]" />
                  <span>Organization Profile</span>
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate(ROUTES.TEAM);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-[#1F2A26] hover:bg-[#F6FAF8] hover:text-[#05A222] transition-colors cursor-pointer"
                >
                  <Users2 className="w-4 h-4 text-[#8A9993]" />
                  <span>Team Members</span>
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate(ROUTES.DEVELOPERS_API_KEYS);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-[#1F2A26] hover:bg-[#F6FAF8] hover:text-[#05A222] transition-colors cursor-pointer"
                >
                  <Key className="w-4 h-4 text-[#8A9993]" />
                  <span>Developer API Keys</span>
                </button>
              </div>

              {/* Sign Out */}
              <div className="pt-1 border-t border-[#E2EAE6]">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-[#D64545] hover:bg-[#FDF2F2] transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-[#D64545]" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
