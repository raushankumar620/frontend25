import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Send, Users, GitBranch, ArrowRight } from 'lucide-react';
import { ROUTES } from '../../../utils/constants';

interface ActionItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  path: string;
  iconBg: string;
  iconColor: string;
  arrowBg: string;
  arrowColor: string;
}

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions: ActionItem[] = [
    {
      id: 'template',
      title: 'New Template',
      description: 'Create message template',
      icon: FileText,
      path: ROUTES.CREATE_TEMPLATE,
      iconBg: 'bg-[#E9F9EE]',
      iconColor: 'text-[#05A222]',
      arrowBg: 'group-hover:bg-[#E9F9EE]',
      arrowColor: 'text-[#05A222]',
    },
    {
      id: 'campaign',
      title: 'Launch Campaign',
      description: 'Send to your audience',
      icon: Send,
      path: ROUTES.CREATE_CAMPAIGN,
      iconBg: 'bg-[#EFF6FF]',
      iconColor: 'text-[#2563EB]',
      arrowBg: 'group-hover:bg-[#EFF6FF]',
      arrowColor: 'text-[#2563EB]',
    },
    {
      id: 'contacts',
      title: 'Add Contacts',
      description: 'Import or add manually',
      icon: Users,
      path: ROUTES.CONTACTS,
      iconBg: 'bg-[#F5F3FF]',
      iconColor: 'text-[#7C3AED]',
      arrowBg: 'group-hover:bg-[#F5F3FF]',
      arrowColor: 'text-[#7C3AED]',
    },
    {
      id: 'automation',
      title: 'Create Automation',
      description: 'Set up workflows',
      icon: GitBranch,
      path: ROUTES.CREATE_AUTOMATION,
      iconBg: 'bg-[#FFF7ED]',
      iconColor: 'text-[#F97316]',
      arrowBg: 'group-hover:bg-[#FFF7ED]',
      arrowColor: 'text-[#F97316]',
    },
  ];

  return (
    <div className="bg-white border border-[#E2EAE6] rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-base font-bold text-[#14201C] tracking-tight">Quick Actions</h2>
        <p className="text-xs text-[#5F7069] mt-0.5">Everything you need, one click away.</p>
      </div>

      {/* 2x2 Grid of Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 flex-1">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => navigate(action.path)}
              className="p-3.5 bg-[#F6FAF8] hover:bg-white border border-[#E2EAE6] hover:border-[#C4EBD0] rounded-2xl flex items-center justify-between gap-3 text-left transition-all duration-200 cursor-pointer group shadow-2xs hover:shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl ${action.iconBg} ${action.iconColor} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#14201C] group-hover:text-[#006736] transition-colors truncate">
                    {action.title}
                  </div>
                  <div className="text-[11px] text-[#5F7069] truncate mt-0.5">
                    {action.description}
                  </div>
                </div>
              </div>

              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${action.arrowColor} ${action.arrowBg} transition-colors shrink-0`}
              >
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
