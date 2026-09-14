import { Zap, Settings2, Sparkles, MessageSquare, Clock, Globe } from 'lucide-react';
import type { WorkflowNode } from '../types';

export interface TriggerNodeProps {
  node: WorkflowNode;
  onEdit?: () => void;
  selected?: boolean;
}

export const TriggerNode: React.FC<TriggerNodeProps> = ({ node, onEdit, selected }) => {
  const getTriggerIcon = () => {
    switch (node.data?.triggerType) {
      case 'KEYWORD':
        return <MessageSquare className="w-4 h-4 text-[#05A222]" />;
      case 'FIRST_MESSAGE':
        return <Sparkles className="w-4 h-4 text-[#05A222]" />;
      case 'OUT_OF_HOURS':
        return <Clock className="w-4 h-4 text-[#05A222]" />;
      case 'CUSTOM_WEBHOOK':
        return <Globe className="w-4 h-4 text-[#05A222]" />;
      default:
        return <Zap className="w-4 h-4 text-[#05A222]" />;
    }
  };

  const getDetails = () => {
    if (node.data?.keywords && node.data.keywords.length > 0) {
      return `Matches: "${node.data.keywords.slice(0, 3).join(', ')}${node.data.keywords.length > 3 ? '...' : ''}"`;
    }
    if (node.data?.triggerType === 'FIRST_MESSAGE') {
      return 'When new customer starts a chat';
    }
    if (node.data?.triggerType === 'OUT_OF_HOURS') {
      return 'When message received outside work hours';
    }
    return node.subtitle || 'Meta WhatsApp Webhook Inbound Message';
  };

  return (
    <div
      onClick={onEdit}
      className={`w-72 bg-white rounded-2xl border-2 transition-all p-4 shadow-sm relative group cursor-pointer ${
        selected
          ? 'border-[#05A222] ring-4 ring-[#E9F9EE] shadow-md'
          : 'border-[#C4EBD0] hover:border-[#05A222] hover:shadow-md'
      }`}
    >
      {/* Node Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#05A222] shadow-2xs">
            {getTriggerIcon()}
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#006736] tracking-wider bg-[#E9F9EE] px-1.5 py-0.5 rounded-md">
              Start Trigger
            </span>
          </div>
        </div>

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
      </div>

      {/* Node Title & Description */}
      <h4 className="text-xs font-bold text-[#14201C] leading-snug">{node.title}</h4>
      <p className="text-[11px] text-[#5F7069] mt-1 line-clamp-2">{getDetails()}</p>

      {/* Output Port Anchor */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-[#05A222] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
        <div className="w-2 h-2 rounded-full bg-[#05A222]" />
      </div>
    </div>
  );
};
