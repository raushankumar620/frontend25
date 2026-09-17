import React, { useState, useRef } from 'react';
import { Send, Paperclip, Smile, Sparkles, FileText, Zap, BookOpen, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export interface MessageInputProps {
  onSendMessage: (text: string) => void;
  onSendTemplate?: () => void;
  disabled?: boolean;
}

interface QuickReplyPreset {
  id: string;
  label: string;
  icon: React.ReactNode;
  text: string;
  badgeClass: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onSendTemplate,
  disabled = false,
}) => {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSendMessage(text.trim());
    setText('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleApplyQuickReply = (replyText: string) => {
    setText(replyText);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const quickReplies: QuickReplyPreset[] = [
    {
      id: 'greet',
      label: 'Greeting',
      icon: <Sparkles className="w-3.5 h-3.5 text-emerald-600" />,
      text: 'Hello! Thank you for reaching out to WhatsAppMSG. How can I assist you today?',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300',
    },
    {
      id: 'checking',
      label: 'In Review',
      icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
      text: 'Thank you for the details. Let me check this for you right away.',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 hover:border-amber-300',
    },
    {
      id: 'docs',
      label: 'Docs & API',
      icon: <BookOpen className="w-3.5 h-3.5 text-blue-600" />,
      text: 'Here is our official documentation & API guide: https://whatsappmsg.com/docs',
      badgeClass: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100 hover:border-blue-300',
    },
    {
      id: 'demo',
      label: 'Live Demo',
      icon: <Calendar className="w-3.5 h-3.5 text-purple-600" />,
      text: 'Would you like to schedule a 15-minute live platform walkthrough call with our team?',
      badgeClass: 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100 hover:border-purple-300',
    },
    {
      id: 'resolved',
      label: 'Resolved',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />,
      text: 'Glad we could assist! Feel free to message us anytime if you need more help.',
      badgeClass: 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100 hover:border-teal-300',
    },
  ];

  return (
    <div className="p-3 bg-white border-t border-[#E2EAE6] space-y-2.5 shrink-0 select-none">
      {/* Professional Colorful Quick Reply Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 text-xs">
        <div className="flex items-center gap-1 text-[#5F7069] shrink-0 font-semibold px-1">
          <Zap className="w-3.5 h-3.5 text-[#006736] fill-[#006736]" />
          <span className="text-[11px] uppercase tracking-wider text-[#8A9993] font-bold">Quick:</span>
        </div>

        {quickReplies.map((qr) => (
          <button
            key={qr.id}
            type="button"
            onClick={() => handleApplyQuickReply(qr.text)}
            title={qr.text}
            className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all shrink-0 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 ${qr.badgeClass}`}
          >
            <span className="shrink-0 group-hover:scale-110 transition-transform">{qr.icon}</span>
            <span className="font-semibold text-[11px] tracking-tight">{qr.label}</span>
          </button>
        ))}
      </div>

      {/* Input controls bar with distinct colorful action icons */}
      <div className="flex items-center gap-1.5 bg-[#F6FAF8] p-1.5 rounded-2xl border border-[#E2EAE6] focus-within:border-[#006736] focus-within:bg-white focus-within:shadow-[0_2px_14px_rgba(0,103,54,0.08)] transition-all">
        {/* Attachment - Sky Blue */}
        <button
          type="button"
          className="p-2 text-sky-600 hover:text-sky-700 rounded-xl hover:bg-sky-50 transition-colors cursor-pointer"
          title="Attach media or document"
        >
          <Paperclip className="w-4.5 h-4.5" />
        </button>

        {/* WhatsApp Template - Purple */}
        {onSendTemplate && (
          <button
            type="button"
            onClick={onSendTemplate}
            className="p-2 text-purple-600 hover:text-purple-700 rounded-xl hover:bg-purple-50 transition-colors cursor-pointer"
            title="Send WhatsApp Template"
          >
            <FileText className="w-4.5 h-4.5" />
          </button>
        )}

        {/* Emoji - Amber / Yellow */}
        <button
          type="button"
          className="p-2 text-amber-500 hover:text-amber-600 rounded-xl hover:bg-amber-50 transition-colors cursor-pointer"
          title="Insert emoji"
        >
          <Smile className="w-4.5 h-4.5" />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Type a message (Press Enter to send)..."
          className="flex-1 bg-transparent border-0 px-2 py-1 text-xs sm:text-sm text-[#14201C] placeholder:text-[#8A9993] focus:outline-none"
        />

        {/* Send Button - WhatsApp Green */}
        <Button
          size="sm"
          variant="primary"
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          className="rounded-xl px-4 py-2 shrink-0 cursor-pointer shadow-sm disabled:opacity-50 font-medium bg-[#006736] hover:bg-[#00522a] text-white"
        >
          <Send className="w-3.5 h-3.5 mr-1" />
          <span>Send</span>
        </Button>
      </div>
    </div>
  );
};

