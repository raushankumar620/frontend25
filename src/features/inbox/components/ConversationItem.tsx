import React from 'react';
import type { Conversation } from '../../../types/message';
import { Avatar } from '../../../components/ui/Avatar';
import { formatRelativeTime } from '../../../utils/formatDate';
import clsx from 'clsx';
import { Check, CheckCheck } from 'lucide-react';

export interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  onClick,
}) => {
  const isOutbound = conversation.lastMessage.senderType === 'user' || conversation.lastMessage.senderType === 'bot';

  return (
    <div
      onClick={onClick}
      className={clsx(
        'flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150 relative border',
        isActive
          ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/80 shadow-xs'
          : 'bg-white dark:bg-slate-900 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60'
      )}
    >
      <Avatar name={conversation.contactName} size="md" status="online" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4
            className={clsx(
              'text-sm font-bold truncate',
              isActive ? 'text-[#006736]' : 'text-[#14201C]'
            )}
          >
            {conversation.contactName}
          </h4>
          <span className="text-xs text-[#8A9993] shrink-0 font-medium">
            {formatRelativeTime(conversation.updatedAt)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#5F7069] truncate">
          {isOutbound && (
            <span className="shrink-0 text-[#05A222]">
              {conversation.lastMessage.status === 'read' ? (
                <CheckCheck className="w-4 h-4" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </span>
          )}
          <span className="truncate text-xs sm:text-sm font-medium">{conversation.lastMessage.content}</span>
        </div>

        <div className="flex items-center gap-1.5 mt-2.5">
          {conversation.tags.slice(0, 2).map((tag, idx) => (
            <span
              key={idx}
              className="text-xs font-semibold px-2 py-0.5 bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0] rounded-md"
            >
              {tag}
            </span>
          ))}
          {conversation.unreadCount > 0 && (
            <span className="ml-auto w-5 h-5 rounded-full bg-[#05A222] text-white text-xs font-bold flex items-center justify-center">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
