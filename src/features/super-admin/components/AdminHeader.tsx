import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Menu,
  ShieldCheck,
  Building,
  Users2,
  Sliders,
  LogOut,
  ChevronDown,
  RefreshCw,
  Smartphone,
  Cpu,
} from 'lucide-react';
import { Avatar } from '../../../components/ui/Avatar';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { GlobalSearchModal } from './GlobalSearchModal';

export interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onToggleSidebar?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  onRefresh,
  isRefreshing = false,
  onToggleSidebar,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSignOut = () => {
    setIsDropdownOpen(false);
    logout();
    navigate('/super-admin/login');
  };

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();
  const displayName = fullName || user?.name || (user?.email ? user.email.split('@')[0] : 'Super Admin');
  const displayEmail = user?.email || 'admin@whatsappmsg.com';

  return (
    <>
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

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
                placeholder="Search tenants, phone numbers, audit logs (Ctrl + K)..."
                onClick={() => setIsSearchOpen(true)}
                readOnly
                className="w-80 lg:w-96 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1F2A26] placeholder-[#8A9993] focus:outline-none focus:ring-2 focus:ring-[#05A222]/20 focus:border-[#05A222] transition-colors font-medium cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Right: Status badge, Search trigger, Sync, User menu */}
        <div className="flex items-center gap-3.5">
          <div className="hidden sm:flex items-center gap-2 bg-[#E9F9EE] text-[#006736] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#C4EBD0]">
            <ShieldCheck className="w-4 h-4 text-[#05A222]" />
            <span>SUPER ADMIN HQ</span>
          </div>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex items-center gap-2 bg-[#05A222] hover:bg-[#006736] text-white text-sm font-bold px-4 py-2 rounded-xl shadow-sm transition-all active:scale-[0.98] cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Search HQ</span>
          </button>

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#F6FAF8] text-[#14201C] text-xs font-bold rounded-xl border border-[#E2EAE6] transition shadow-xs disabled:opacity-50 cursor-pointer"
              title="Sync Telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#05A222] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>
          )}

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
                  SUPER ADMIN
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
                      SUPER ADMIN
                    </span>
                    <span className="text-[10px] text-[#8A9993] truncate max-w-[110px]">
                      Master Node
                    </span>
                  </div>
                </div>

                {/* Menu Links */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate('/super-admin/tenants');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-[#1F2A26] hover:bg-[#F6FAF8] hover:text-[#05A222] transition-colors cursor-pointer"
                  >
                    <Building className="w-4 h-4 text-[#8A9993]" />
                    <span>Tenant Directory</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate('/super-admin/users');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-[#1F2A26] hover:bg-[#F6FAF8] hover:text-[#05A222] transition-colors cursor-pointer"
                  >
                    <Users2 className="w-4 h-4 text-[#8A9993]" />
                    <span>Global Users</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate('/super-admin/whatsapp');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-[#1F2A26] hover:bg-[#F6FAF8] hover:text-[#05A222] transition-colors cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4 text-[#8A9993]" />
                    <span>WhatsApp Gateway</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate('/super-admin/queues');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-[#1F2A26] hover:bg-[#F6FAF8] hover:text-[#05A222] transition-colors cursor-pointer"
                  >
                    <Cpu className="w-4 h-4 text-[#8A9993]" />
                    <span>Queue Telemetry</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate('/super-admin/settings');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-[#1F2A26] hover:bg-[#F6FAF8] hover:text-[#05A222] transition-colors cursor-pointer"
                  >
                    <Sliders className="w-4 h-4 text-[#8A9993]" />
                    <span>System Config</span>
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
    </>
  );
};
