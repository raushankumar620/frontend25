import React, { useState } from 'react';
import { Send, Paperclip, Smile, Sparkles, FileText } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export interface MessageInputProps {
  onSendMessage: (text: string) => void;
  onSendTemplate?: () => void;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onSendTemplate,
  disabled = false,
}) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSendMessage(text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickResponses = [
    'Thanks for reaching out! Let me check this for you.',
    'Here is our documentation link: docs.chatflow.io',
    'Would you like to schedule a 15-min live demo call?',
  ];

  return (
    <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2">
      {/* Quick Snippets */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
        <span className="text-slate-400 flex items-center gap-1 shrink-0 font-medium">
          <Sparkles className="w-3 h-3 text-emerald-500" />
          Quick reply:
        </span>
        {quickResponses.map((qr, idx) => (
          <button
            key={idx}
            onClick={() => setText(qr)}
            className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 transition-colors shrink-0 truncate max-w-xs"
          >
            {qr}
          </button>
        ))}
      </div>

      {/* Input controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Attach media or document"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        {onSendTemplate && (
          <button
            type="button"
            onClick={onSendTemplate}
            className="p-2 text-slate-400 hover:text-emerald-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Send WhatsApp Template"
          >
            <FileText className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Insert emoji"
        >
          <Smile className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Type a message or type '/' for templates..."
          className="flex-1 bg-slate-100 dark:bg-slate-800 border-0 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500"
        />

        <Button
          size="sm"
          variant="primary"
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          className="rounded-xl aspect-square p-2.5"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
