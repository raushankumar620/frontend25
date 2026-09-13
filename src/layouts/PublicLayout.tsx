import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicNavbar } from '../features/public/components/PublicNavbar';
import { PublicFooter } from '../features/public/components/PublicFooter';
import { FloatingChatBot } from '../features/public/components/FloatingChatBot';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-emerald-500 selection:text-white relative">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
      <FloatingChatBot />
    </div>
  );
};
