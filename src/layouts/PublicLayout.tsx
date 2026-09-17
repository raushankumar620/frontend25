import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PublicNavbar } from '../features/public/components/PublicNavbar';
import { PublicFooter } from '../features/public/components/PublicFooter';
import { FloatingChatBot } from '../features/public/components/FloatingChatBot';
import { ScrollLeadModal } from '../features/public/components/ScrollLeadModal';

export const PublicLayout: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-emerald-500 selection:text-white relative">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
      <FloatingChatBot />
      <ScrollLeadModal />
    </div>
  );
};
