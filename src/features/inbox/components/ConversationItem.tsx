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
              'text-xs font-semibold truncate',
              isActive ? 'text-emerald-900 dark:text-emerald-200' : 'text-slate-900 dark:text-white'
            )}
          >
            {conversation.contactName}
          </h4>
          <span className="text-[10px] text-slate-400 shrink-0">
            {formatRelativeTime(conversation.updatedAt)}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 truncate">
          {isOutbound && (
            <span className="shrink-0 text-emerald-500">
              {conversation.lastMessage.status === 'read' ? (
                <CheckCheck className="w-3.5 h-3.5" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
            </span>
          )}
          <span className="truncate text-xs">{conversation.lastMessage.content}</span>
        </div>

        <div className="flex items-center gap-1.5 mt-2">
          {conversation.tags.slice(0, 2).map((tag, idx) => (
            <span
              key={idx}
              className="text-[9px] font-medium px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded"
            >
              {tag}
            </span>
          ))}
          {conversation.unreadCount > 0 && (
            <span className="ml-auto w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
