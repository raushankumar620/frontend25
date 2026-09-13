import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Users, Send, Bot } from 'lucide-react';
import { ROUTES } from '../../utils/constants';

export const MobileNav: React.FC = () => {
  const items = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: 'Inbox', path: ROUTES.INBOX, icon: MessageSquare },
    { label: 'Broadcast', path: ROUTES.CAMPAIGNS, icon: Send },
    { label: 'Contacts', path: ROUTES.CONTACTS, icon: Users },
    { label: 'AI', path: ROUTES.AI_DASHBOARD, icon: Bot },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2EAE6] flex items-center justify-around py-2 px-1 z-40 shadow-[0_-4px_16px_rgba(1,59,35,0.03)]">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
              isActive
                ? 'text-[#05A222] font-bold'
                : 'text-[#5F7069] hover:text-[#14201C]'
            }`
          }
        >
          <item.icon className="w-5 h-5" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};
