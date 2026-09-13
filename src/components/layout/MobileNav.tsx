import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Users, Send, Bot } from 'lucide-react';
import { ROUTES } from '../../utils/constants';

export const MobileNav: React.FC = () => {
  const items = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard, color: '#2563EB', bgColor: '#EFF6FF' },
    { label: 'Inbox', path: ROUTES.INBOX, icon: MessageSquare, color: '#059669', bgColor: '#ECFDF5' },
    { label: 'Broadcast', path: ROUTES.CAMPAIGNS, icon: Send, color: '#E11D48', bgColor: '#FFF1F2' },
    { label: 'Contacts', path: ROUTES.CONTACTS, icon: Users, color: '#7C3AED', bgColor: '#F5F3FF' },
    { label: 'AI', path: ROUTES.AI_DASHBOARD, icon: Bot, color: '#9333EA', bgColor: '#FAF5FF' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2EAE6] flex items-center justify-around py-1.5 px-1 z-40 shadow-[0_-4px_16px_rgba(1,59,35,0.03)]">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-all ${
              isActive
                ? 'text-[#006736] font-bold'
                : 'text-[#5F7069] hover:text-[#14201C]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform"
                style={{
                  backgroundColor: item.bgColor,
                  color: item.color,
                }}
              >
                <item.icon
                  className="w-4 h-4 shrink-0"
                  fill={item.color}
                  fillOpacity={isActive ? 0.35 : 0.18}
                  strokeWidth={2.2}
                />
              </div>
              <span className="leading-tight">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
};
