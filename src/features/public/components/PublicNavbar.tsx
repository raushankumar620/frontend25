import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Zap, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { ROUTES, APP_NAME } from '../../../utils/constants';
import { useAuthStore } from '../../../store/authStore';

export const PublicNavbar: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuthStore();

  const navLinks = [
    { label: 'Features', path: ROUTES.PUBLIC_FEATURES },
    { label: 'Solutions', path: ROUTES.PUBLIC_SOLUTIONS },
    { label: 'Pricing', path: ROUTES.PUBLIC_PRICING },
    { label: 'About Us', path: ROUTES.PUBLIC_ABOUT },
    { label: 'Contact', path: ROUTES.PUBLIC_CONTACT },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2EAE6] shadow-xs">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand - Clean Logo Only */}
        <Link to={ROUTES.HOME} className="flex items-center group">
          <img
            src="/images/logo.png"
            alt={APP_NAME}
            className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? 'text-[#05A222] font-bold border-b-2 border-[#05A222] pb-0.5'
                  : 'text-[#5F7069] hover:text-[#006736] transition-colors'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(ROUTES.DASHBOARD)}
                leftIcon={<LayoutDashboard className="w-4 h-4 text-[#05A222]" />}
                className="border-[#C4EBD0] text-[#006736] hover:bg-[#F6FAF8] font-bold"
              >
                Go to Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                leftIcon={<LogOut className="w-3.5 h-3.5" />}
                className="text-[#D64545] hover:bg-[#FDF2F2] font-semibold"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.LOGIN)}
                className="text-[#14201C] hover:text-[#006736] hover:bg-[#F6FAF8] font-semibold"
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(ROUTES.REGISTER)}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="bg-[#05A222] hover:bg-[#006736] text-white shadow-md shadow-[#05A222]/20 font-semibold"
              >
                Start Free Trial
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden p-2 text-[#5F7069] hover:text-[#14201C]"
          aria-label="Toggle Navigation"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="md:hidden bg-white border-b border-[#E2EAE6] p-4 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-xl text-sm font-semibold ${
                    isActive ? 'bg-[#E9F9EE] text-[#006736] font-bold' : 'text-[#5F7069] hover:bg-[#F6FAF8]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="pt-3 border-t border-[#E2EAE6] flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setIsMobileOpen(false);
                    navigate(ROUTES.DASHBOARD);
                  }}
                  leftIcon={<LayoutDashboard className="w-4 h-4" />}
                  className="w-full bg-[#05A222] text-white"
                >
                  Dashboard ({user?.name?.split(' ')[0] || 'User'})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsMobileOpen(false);
                    logout();
                  }}
                  leftIcon={<LogOut className="w-3.5 h-3.5" />}
                  className="w-full text-[#D64545] border-[#F8B4B4]"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsMobileOpen(false);
                    navigate(ROUTES.LOGIN);
                  }}
                  className="w-full"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setIsMobileOpen(false);
                    navigate(ROUTES.REGISTER);
                  }}
                  leftIcon={<Zap className="w-3.5 h-3.5" />}
                  className="w-full bg-[#05A222] hover:bg-[#006736] text-white"
                >
                  Start 14-Day Free Trial
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
