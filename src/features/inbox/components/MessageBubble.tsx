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
          'rounded-2xl px-4 py-2.5 text-xs shadow-xs relative leading-relaxed break-words',
          isOutbound
            ? 'bg-emerald-600 text-white rounded-br-xs'
            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/60 rounded-bl-xs'
        )}
      >
        {message.mediaUrl && (
          <img
            src={message.mediaUrl}
            alt="media attachment"
            className="rounded-lg mb-2 max-h-48 object-cover w-full"
          />
        )}
        <p className="whitespace-pre-wrap">{message.content}</p>

        <div
          className={clsx(
            'flex items-center justify-end gap-1 mt-1 text-[10px]',
            isOutbound ? 'text-emerald-200' : 'text-slate-400'
          )}
        >
          <span>{formatTime(message.timestamp)}</span>
          {isOutbound && (
            <span>
              {message.status === 'read' ? (
                <CheckCheck className="w-3.5 h-3.5 text-white" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
