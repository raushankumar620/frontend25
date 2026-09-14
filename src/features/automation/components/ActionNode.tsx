import {
  Bot,
  Send,
  Clock,
  GitBranch,
  Settings2,
  Trash2,
  Tag,
  UserCheck,
  Globe,
} from 'lucide-react';
import type { WorkflowNode } from '../types';

export interface ActionNodeProps {
  node: WorkflowNode;
  onDelete?: () => void;
  onEdit?: () => void;
  selected?: boolean;
}

export const ActionNode: React.FC<ActionNodeProps> = ({ node, onDelete, onEdit, selected }) => {
  const getNodeConfig = () => {
    switch (node.type) {
      case 'ai_agent':
        return {
          icon: <Bot className="w-4 h-4 text-emerald-600" />,
          badge: 'AI Smart Agent',
          badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          borderColor: 'border-emerald-300 hover:border-emerald-500',
          accentColor: '#05A222',
        };
      case 'send_message':
      case 'action':
        return {
          icon: <Send className="w-4 h-4 text-[#006736]" />,
          badge: 'WhatsApp Reply',
          badgeBg: 'bg-[#E9F9EE] text-[#006736] border-[#C4EBD0]',
          borderColor: 'border-[#C4EBD0] hover:border-[#05A222]',
          accentColor: '#05A222',
        };
      case 'condition':
        return {
          icon: <GitBranch className="w-4 h-4 text-sky-600" />,
          badge: 'Branch Condition',
          badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
          borderColor: 'border-sky-300 hover:border-sky-500',
          accentColor: '#0284C7',
        };
      case 'add_tag':
        return {
          icon: <Tag className="w-4 h-4 text-purple-600" />,
          badge: 'Apply Tag',
          badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
          borderColor: 'border-purple-300 hover:border-purple-500',
          accentColor: '#9333EA',
        };
      case 'assign_agent':
        return {
          icon: <UserCheck className="w-4 h-4 text-blue-600" />,
          badge: 'Assign Agent',
          badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
          borderColor: 'border-blue-300 hover:border-blue-500',
          accentColor: '#2563EB',
        };
      case 'delay':
        return {
          icon: <Clock className="w-4 h-4 text-amber-600" />,
          badge: 'Delay Timer',
          badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
          borderColor: 'border-amber-300 hover:border-amber-500',
          accentColor: '#D97706',
        };
      case 'webhook':
        return {
          icon: <Globe className="w-4 h-4 text-teal-600" />,
          badge: 'HTTP Webhook',
          badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
          borderColor: 'border-teal-300 hover:border-teal-500',
          accentColor: '#0D9488',
        };
      default:
        return {
          icon: <Send className="w-4 h-4 text-[#006736]" />,
          badge: 'Action',
          badgeBg: 'bg-[#E9F9EE] text-[#006736] border-[#C4EBD0]',
          borderColor: 'border-[#C4EBD0] hover:border-[#05A222]',
          accentColor: '#05A222',
        };
    }
  };

  const config = getNodeConfig();

  const getPayloadPreview = () => {
    if (node.type === 'send_message' || node.type === 'action') {
      return node.data?.text ? `"${node.data.text}"` : 'Send configured WhatsApp text reply';
    }
    if (node.type === 'ai_agent') {
      return `Autonomous prompt routing (${node.data?.modelName || 'GPT-4o-mini'}) with RAG context`;
    }
    if (node.type === 'add_tag') {
      return `Add Tag: "${node.data?.tag || 'New-Lead'}"`;
    }
    if (node.type === 'assign_agent') {
      return `Routing conversation to support team`;
    }
    if (node.type === 'delay') {
      return `Wait ${node.data?.delayMinutes || 5} minutes before executing next node`;
    }
    if (node.type === 'webhook') {
      return node.data?.url ? `POST ${node.data.url}` : 'Trigger external API webhook';
    }
    return node.subtitle || 'Configured action';
  };

  return (
    <div
      onClick={onEdit}
      className={`w-72 bg-white rounded-2xl border-2 transition-all p-4 shadow-sm relative group cursor-pointer ${config.borderColor} ${
        selected ? 'ring-4 ring-[#E9F9EE] shadow-md !border-[#05A222]' : 'hover:shadow-md'
      }`}
    >
      {/* Top Input Connection Port */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform"
        style={{ borderColor: config.accentColor }}
      >
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.accentColor }} />
      </div>

      {/* Node Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#F6FAF8] border border-[#E2EAE6] flex items-center justify-center shadow-2xs">
            {config.icon}
          </div>
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${config.badgeBg}`}>
            {config.badge}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="text-[#5F7069] hover:text-[#14201C] p-1 rounded-lg hover:bg-[#F6FAF8] transition-colors"
            >
              <Settings2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-[#5F7069] hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Title & Preview Content */}
      <h4 className="text-xs font-bold text-[#14201C] truncate">{node.title}</h4>
      <p className="text-[11px] text-[#5F7069] mt-1 line-clamp-2 leading-relaxed bg-[#F6FAF8] p-2 rounded-xl border border-[#E2EAE6]/60">
        {getPayloadPreview()}
      </p>

      {/* Bottom Output Connection Port (or Dual Ports for Condition) */}
      {node.type === 'condition' ? (
        <div className="flex items-center justify-between px-6 pt-2 -mb-2">
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-bold text-emerald-600 mb-1">TRUE</span>
            <div className="w-5 h-5 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center shadow-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-bold text-rose-500 mb-1">FALSE</span>
            <div className="w-5 h-5 rounded-full bg-white border-2 border-rose-400 flex items-center justify-center shadow-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            </div>
          </div>
        </div>
      ) : (
        <div
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform"
          style={{ borderColor: config.accentColor }}
        >
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.accentColor }} />
        </div>
      )}
    </div>
  );
};
