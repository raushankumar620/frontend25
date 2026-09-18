import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Send,
  Crown,
  Search,
  User as UserIcon,
  Building,
  Key,
  Users2,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { useAuthStore } from '../../store/authStore';
import { NotificationDropdown } from '../notifications/NotificationDropdown';

const ROUTE_HEADER_MAP: Array<{
  pattern: RegExp | string;
  title: string;
  subtitle: string;
}> = [
  {
    pattern: '/billing/invoices',
    title: 'Invoices & Tax Receipts',
    subtitle: 'View, print, and download official GST tax invoices.',
  },
  {
    pattern: '/billing/plans',
    title: 'Subscription Plans',
    subtitle: 'Choose and upgrade the perfect plan for your business.',
  },
  {
    pattern: '/billing',
    title: 'Billing & Subscription',
    subtitle: 'Manage your subscription, view invoices and upgrade your plan.',
  },
  {
    pattern: '/app',
    title: 'Overview Dashboard',
    subtitle: 'Real-time WhatsApp engagement metrics, active numbers & quick stats.',
  },
  {
    pattern: '/inbox',
    title: 'Live Team Inbox',
    subtitle: 'Unified WhatsApp conversations, agent routing & customer support.',
  },
  {
    pattern: '/campaigns/create',
    title: 'Create Broadcast Campaign',
    subtitle: 'Configure message templates, audience filters, and schedule broadcasts.',
  },
  {
    pattern: /^\/campaigns\/[a-zA-Z0-9_-]+$/,
    title: 'Campaign Analytics & Delivery',
    subtitle: 'Live dispatch status, message read rates, and subscriber responses.',
  },
  {
    pattern: '/campaigns',
    title: 'Broadcast Campaigns',
    subtitle: 'Send high-delivery bulk WhatsApp broadcasts and track performance.',
  },
  {
    pattern: '/templates/create',
    title: 'Create WhatsApp Template',
    subtitle: 'Design and submit Meta-compliant marketing and utility templates.',
  },
  {
    pattern: /^\/templates\/[a-zA-Z0-9_-]+$/,
    title: 'Template Details',
    subtitle: 'Review template components, variables, and Meta approval status.',
  },
  {
    pattern: '/templates',
    title: 'Message Templates',
    subtitle: 'Sync and manage official Meta approved WhatsApp templates.',
  },
  {
    pattern: /^\/contacts\/[a-zA-Z0-9_-]+$/,
    title: 'Contact Profile & History',
    subtitle: 'Subscriber timeline, tags, custom attributes and message logs.',
  },
  {
    pattern: '/contacts',
    title: 'Contacts & Audience',
    subtitle: 'Organize subscribers, tags, attributes, and custom segments.',
  },
  {
    pattern: '/automations/create',
    title: 'Create Visual Workflow',
    subtitle: 'Design keyword-based bots, triggers, and automated customer journeys.',
  },
  {
    pattern: '/automations',
    title: 'Flow Automations',
    subtitle: 'Build interactive visual workflows and auto-reply sequences.',
  },
  {
    pattern: '/ai/agent',
    title: 'AI Agent Configuration',
    subtitle: 'Define agent persona, tone, instruction prompts, and fallbacks.',
  },
  {
    pattern: '/ai/knowledge-base',
    title: 'AI Knowledge Base',
    subtitle: 'Upload product catalogs, PDFs, and FAQs for smart AI answers.',
  },
  {
    pattern: '/ai/tools',
    title: 'AI Custom Tools & Actions',
    subtitle: 'Connect external webhooks and CRM integrations for AI execution.',
  },
  {
    pattern: '/ai/handoff',
    title: 'Human Agent Handoff',
    subtitle: 'Set up rules for when AI transfers chat conversations to human agents.',
  },
  {
    pattern: '/ai/settings',
    title: 'AI Model & Token Settings',
    subtitle: 'Tune temperature, context window limits, and Gemini AI parameters.',
  },
  {
    pattern: '/ai',
    title: 'AI Agents & Automation',
    subtitle: 'Deploy intelligent AI chatbots powered by Gemini and WhatsApp.',
  },
  {
    pattern: '/whatsapp/connect',
    title: 'Connect WhatsApp Account',
    subtitle: 'Link your Meta Business Account, WABA ID, and Phone Number.',
  },
  {
    pattern: /^\/whatsapp\/numbers\/[a-zA-Z0-9_-]+$/,
    title: 'WhatsApp Number Settings',
    subtitle: 'Quality rating, messaging tier limits, and webhook status.',
  },
  {
    pattern: '/whatsapp/numbers',
    title: 'Connected Phone Numbers',
    subtitle: 'Manage WhatsApp Business API phone numbers and status.',
  },
  {
    pattern: '/analytics',
    title: 'Analytics & Reports',
    subtitle: 'Track delivery rates, read metrics, conversion rates, and ROI.',
  },
  {
    pattern: '/team/roles',
    title: 'Roles & Permissions',
    subtitle: 'Configure granular RBAC permissions for agents, managers and admins.',
  },
  {
    pattern: '/team',
    title: 'Team Members',
    subtitle: 'Manage team seats, agent assignments and access permissions.',
  },
  {
    pattern: '/settings/account',
    title: 'Profile & Account Settings',
    subtitle: 'Manage your profile details, password security, and notifications.',
  },
  {
    pattern: '/settings/business',
    title: 'Organization Profile',
    subtitle: 'Business identity, WhatsApp profile info, address and branding.',
  },
  {
    pattern: '/settings/security',
    title: 'Security & Two-Factor Auth',
    subtitle: 'Manage active sessions, audit activity, and 2FA authentication.',
  },
  {
    pattern: '/developers/api-keys',
    title: 'Developer API Keys',
    subtitle: 'Generate and manage secure REST API keys for programmatic access.',
  },
  {
    pattern: '/developers/webhooks',
    title: 'Inbound Webhooks',
    subtitle: 'Configure HTTP callbacks for real-time delivery and incoming messages.',
  },
  {
    pattern: '/developers/logs',
    title: 'API Request Logs',
    subtitle: 'Inspect real-time API traffic, payloads, response codes, and latency.',
  },
  {
    pattern: '/developers/backend-setup',
    title: 'Backend Environment Setup',
    subtitle: 'Configure your backend environment (.env) and credentials for WhatsAppMSG API.',
  },
  {
    pattern: '/developers/docs',
    title: 'API Documentation',
    subtitle: 'Interactive endpoints reference, SDKs, and code examples.',
  },
  {
    pattern: '/developers',
    title: 'Developer Platform',
    subtitle: 'APIs, webhooks, sandbox testing and developer infrastructure.',
  },
  {
    pattern: '/notifications',
    title: 'Notifications & Alerts',
    subtitle: 'System alerts, broadcast summaries, and team activity logs.',
  },
];

export interface HeaderProps {
  onToggleSidebar?: () => void;
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  title,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
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
  const formatRoleLabel = (role?: string) => {
    if (!role) return 'ORGANIZATION HEAD';
    const upper = role.toUpperCase();
    if (upper === 'ORG_ADMIN' || upper === 'ADMIN') return 'ORGANIZATION HEAD';
    if (upper === 'TEAM_LEAD') return 'TEAM LEAD';
    return upper.replace(/_/g, ' ');
  };
  const displayRole = formatRoleLabel(user?.role);
  const orgName = organization?.name || user?.organizationName || 'WhatsApp Workspace';

  // Determine active header title
  let activeTitle = title;

  if (!activeTitle) {
    const currentPath = location.pathname;
    const match = ROUTE_HEADER_MAP.find((item) => {
      if (typeof item.pattern === 'string') {
        return item.pattern === currentPath;
      }
      return item.pattern.test(currentPath);
    });

    if (match) {
      activeTitle = match.title;
    } else {
      // Default fallback based on path segment
      const segment = currentPath.split('/').filter(Boolean)[0] || 'app';
      activeTitle = segment.charAt(0).toUpperCase() + segment.slice(1);
    }
  }

  return (
    <header className="h-[72px] sm:h-20 bg-white border-b border-[#E2EAE6] px-4 sm:px-6 lg:px-8 flex items-center justify-between z-20 shrink-0 shadow-xs">
      {/* Left: Mobile trigger & Search Input or Page Title */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1 max-w-xl pr-4">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-[#5F7069] hover:bg-[#F6FAF8] hover:text-[#14201C] transition-colors cursor-pointer shrink-0"
            aria-label="Toggle sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Global Search Bar */}
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A9993]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search contacts, messages, templates..."
            className="w-full pl-9 pr-14 py-2 bg-[#F6FAF8] border border-[#E2EAE6] hover:border-[#C4EBD0] focus:border-[#05A222] focus:bg-white text-xs font-medium text-[#14201C] placeholder-[#8A9993] rounded-xl outline-none transition-all"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                navigate(`${ROUTES.CONTACTS}?search=${encodeURIComponent(e.currentTarget.value.trim())}`);
              }
            }}
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-[#8A9993] bg-white border border-[#E2EAE6] rounded-md shadow-2xs">
              Ctrl K
            </kbd>
          </div>
        </div>

        {/* Mobile Page Title fallback when search is hidden on very small devices */}
        <div className="sm:hidden min-w-0">
          <h1 className="text-base font-black text-[#14201C] tracking-tight truncate">
            {activeTitle}
          </h1>
        </div>
      </div>

      {/* Right: Free Trial Badge, Quick Broadcast, Notification, User menu */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Free Trial Crown Badge */}
        <div className="flex items-center gap-1.5 bg-[#E9F9EE] text-[#006736] px-3 py-1.5 rounded-full border border-[#C4EBD0] shadow-2xs">
          <Crown className="w-3.5 h-3.5 text-[#05A222]" />
          <div className="flex flex-col leading-none">
            <span className="text-[10px] font-black tracking-wide uppercase">FREE TRIAL</span>
            <span className="text-[9px] font-bold text-[#05A222]">7 days left</span>
          </div>
        </div>

        {/* Quick Broadcast Button */}
        <button
          onClick={() => navigate(ROUTES.CREATE_CAMPAIGN)}
          className="flex items-center gap-2 bg-[#05A222] hover:bg-[#006736] text-white text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2 rounded-xl shadow-xs transition-all active:scale-[0.98] cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Quick Broadcast</span>
        </button>

        {/* Notification Bell */}
        <NotificationDropdown />

        <div className="h-7 w-px bg-[#E2EAE6]" />

        {/* Dynamic User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[#F6FAF8] transition-colors cursor-pointer text-left focus:outline-none"
            aria-expanded={isDropdownOpen}
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-[#013B23] text-white flex items-center justify-center font-black text-xs shadow-2xs border border-[#006736]">
                {displayName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() || 'RK'}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#05A222] border-2 border-white rounded-full" />
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-black text-[#14201C] truncate max-w-[140px] leading-tight">
                {displayName}
              </span>
              <span className="text-[10px] text-[#5F7069] font-semibold leading-tight">
                {displayRole}
              </span>
            </div>
            <ChevronDown className="hidden md:block w-3.5 h-3.5 text-[#8A9993]" />
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
