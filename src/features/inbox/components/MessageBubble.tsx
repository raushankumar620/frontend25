import React from 'react';
import type { Message } from '../../../types/message';
import { formatTime } from '../../../utils/formatDate';
import { Check, CheckCheck, Bot } from 'lucide-react';
import clsx from 'clsx';

export interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isOutbound = message.senderType === 'user' || message.senderType === 'bot';
  const isBot = message.senderType === 'bot';

  return (
    <div
      className={clsx(
        'flex flex-col max-w-[85%] sm:max-w-[70%]',
        isOutbound ? 'ml-auto items-end' : 'mr-auto items-start'
      )}
    >
      {isBot && (
        <span className="flex items-center gap-1 text-[10px] text-[#006736] font-bold mb-1 mr-1.5 bg-[#E9F9EE] px-2 py-0.5 rounded-full border border-[#C4EBD0]">
          <Bot className="w-3 h-3" />
          AI Auto-Reply
        </span>
      )}

      <div
        className={clsx(
          'px-4 py-2.5 text-sm sm:text-[14.5px] leading-relaxed break-words relative shadow-2xs transition-all',
          isOutbound
            ? 'bg-[#006736] text-white rounded-2xl rounded-tr-xs'
            : 'bg-white text-[#14201C] border border-[#E2EAE6] rounded-2xl rounded-tl-xs shadow-[0_2px_8px_rgba(0,0,0,0.02)]'
        )}
      >
        {message.mediaUrl && (
          <img
            src={message.mediaUrl}
            alt="media attachment"
            className="rounded-xl mb-2 max-h-60 object-cover w-full shadow-xs"
          />
        )}
        <p className="whitespace-pre-wrap font-normal selection:bg-emerald-200 selection:text-emerald-900">
          {message.content}
        </p>

        {/* Timestamp & Delivery status footer */}
        <div
          className={clsx(
            'flex items-center justify-end gap-1 mt-1 text-[11px] font-medium select-none',
            isOutbound ? 'text-emerald-100/90' : 'text-[#8A9993]'
          )}
        >
          <span>{formatTime(message.timestamp)}</span>
          {isOutbound && (
            <span className="inline-flex items-center">
              {message.status === 'read' ? (
                <CheckCheck className="w-3.5 h-3.5 text-[#34B7F1]" />
              ) : (
                <Check className="w-3.5 h-3.5 text-emerald-100/80" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

