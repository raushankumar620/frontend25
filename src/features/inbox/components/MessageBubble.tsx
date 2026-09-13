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
        'flex flex-col max-w-[80%] sm:max-w-[70%]',
        isOutbound ? 'ml-auto items-end' : 'mr-auto items-start'
      )}
    >
      {isBot && (
        <span className="flex items-center gap-1 text-[10px] text-indigo-400 font-semibold mb-1 mr-1">
          <Bot className="w-3 h-3" />
          AI Auto-Reply
        </span>
      )}

      <div
        className={clsx(
          'rounded-2xl px-5 py-3 text-sm sm:text-[15px] shadow-xs relative leading-relaxed break-words',
          isOutbound
            ? 'bg-[#05A222] text-white rounded-br-xs'
            : 'bg-white text-[#1F2A26] border border-[#E2EAE6] rounded-bl-xs'
        )}
      >
        {message.mediaUrl && (
          <img
            src={message.mediaUrl}
            alt="media attachment"
            className="rounded-xl mb-2.5 max-h-56 object-cover w-full"
          />
        )}
        <p className="whitespace-pre-wrap font-normal">{message.content}</p>

        <div
          className={clsx(
            'flex items-center justify-end gap-1.5 mt-1.5 text-xs font-medium',
            isOutbound ? 'text-emerald-100' : 'text-[#8A9993]'
          )}
        >
          <span>{formatTime(message.timestamp)}</span>
          {isOutbound && (
            <span>
              {message.status === 'read' ? (
                <CheckCheck className="w-4 h-4 text-white" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
