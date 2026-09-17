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
  const isOutbound =
    conversation.lastMessage.senderType === 'user' ||
    conversation.lastMessage.senderType === 'bot';

  return (
    <div
      onClick={onClick}
      className={clsx(
        'group flex items-start gap-3 p-3.5 rounded-2xl cursor-pointer transition-all duration-200 relative border',
        isActive
          ? 'bg-[#E9F9EE]/80 border-[#C4EBD0] shadow-[0_2px_12px_rgba(0,103,54,0.06)]'
          : 'bg-white border-transparent hover:bg-[#F6FAF8] hover:border-[#E2EAE6]'
      )}
    >
      {/* Avatar with live status */}
      <div className="relative shrink-0">
        <Avatar name={conversation.contactName || conversation.contactPhone} size="md" status="online" />
      </div>

      <div className="flex-1 min-w-0">
        {/* Name & Timestamp Header */}
        <div className="flex items-center justify-between gap-1 mb-1">
          <h4
            className={clsx(
              'text-[13.5px] font-bold truncate leading-tight',
              isActive ? 'text-[#006736]' : 'text-[#14201C]'
            )}
          >
            {conversation.contactName || conversation.contactPhone}
          </h4>
          <span
            className={clsx(
              'text-[11px] shrink-0 font-medium',
              conversation.unreadCount > 0 ? 'text-[#05A222] font-bold' : 'text-[#8A9993]'
            )}
          >
            {formatRelativeTime(conversation.updatedAt)}
          </span>
        </div>

        {/* Last Message Snippet */}
        <div className="flex items-center gap-1.5 text-xs text-[#5F7069] truncate">
          {isOutbound && (
            <span className="shrink-0">
              {conversation.lastMessage.status === 'read' ? (
                <CheckCheck className="w-3.5 h-3.5 text-[#34B7F1]" />
              ) : (
                <Check className="w-3.5 h-3.5 text-[#8A9993]" />
              )}
            </span>
          )}
          <span
            className={clsx(
              'truncate font-normal',
              conversation.unreadCount > 0 ? 'font-bold text-[#14201C]' : 'text-[#5F7069]'
            )}
          >
            {conversation.lastMessage.content || 'No messages yet'}
          </span>
        </div>

        {/* Tags & Unread Badge Footer */}
        <div className="flex items-center gap-1.5 mt-2">
          {conversation.tags.slice(0, 2).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-bold px-2 py-0.5 bg-[#F6FAF8] text-[#006736] border border-[#C4EBD0] rounded-md"
            >
              {tag}
            </span>
          ))}

          {conversation.unreadCount > 0 && (
            <span className="ml-auto min-w-[20px] h-5 px-1.5 rounded-full bg-[#05A222] text-white text-[11px] font-black flex items-center justify-center shadow-2xs">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

