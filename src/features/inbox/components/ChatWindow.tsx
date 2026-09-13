import React, { useState } from 'react';
import type { Conversation, Message, InternalNote as InternalNoteType } from '../../../types/message';
import { Avatar } from '../../../components/ui/Avatar';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { InternalNote } from './InternalNote';
import { MoreVertical, CheckCircle2, UserCheck, ShieldCheck, StickyNote } from 'lucide-react';
import { Dropdown } from '../../../components/ui/Dropdown';

export interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  notes: InternalNoteType[];
  onSendMessage: (text: string) => void;
  onAddNote: (content: string) => void;
  onToggleCustomerPanel?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  notes,
  onSendMessage,
  onAddNote,
}) => {
  const [showNotes, setShowNotes] = useState(false);

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Chat Header */}
      <div className="h-[72px] sm:h-20 px-5 bg-white border-b border-[#E2EAE6] flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3.5">
          <Avatar name={conversation.contactName} size="md" status="online" />
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-sm sm:text-base font-bold text-[#14201C]">
                {conversation.contactName}
              </h3>
              <span className="text-xs text-[#006736] bg-[#E9F9EE] px-2.5 py-0.5 rounded-full font-bold border border-[#C4EBD0]">
                {conversation.channel}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#5F7069] mt-0.5 font-medium">{conversation.contactPhone}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`p-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              showNotes
                ? 'bg-[#FFF8E6] text-[#9A6B00] border border-[#FFE299]'
                : 'text-[#5F7069] hover:bg-[#F6FAF8] hover:text-[#14201C]'
            }`}
          >
            <StickyNote className="w-4.5 h-4.5" />
            <span className="hidden sm:inline">Notes ({notes.length})</span>
          </button>

          <button
            className="p-2.5 rounded-xl text-[#5F7069] hover:bg-[#F6FAF8] hover:text-[#05A222] transition-colors cursor-pointer"
            title="Mark as Resolved"
          >
            <CheckCircle2 className="w-5 h-5 text-[#05A222]" />
          </button>

          <Dropdown
            trigger={
              <button className="p-2.5 rounded-xl text-[#5F7069] hover:bg-[#F6FAF8] hover:text-[#14201C] transition-colors cursor-pointer">
                <MoreVertical className="w-5 h-5" />
              </button>
            }
            items={[
              { label: 'Assign to Team Member', icon: <UserCheck className="w-4 h-4" /> },
              { label: 'Block & Report Spam', danger: true },
            ]}
          />
        </div>
      </div>

      {/* Internal Notes collapsible bar */}
      {showNotes && <InternalNote notes={notes} onAddNote={onAddNote} />}

      {/* Meta API 24h Window Notice */}
      <div className="bg-[#E9F9EE] border-b border-[#C4EBD0] px-5 py-2 flex items-center justify-between text-xs sm:text-sm text-[#006736] font-medium">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#05A222]" />
          <span>Meta 24h Customer Care Window: <strong>Open (Free Form Allowed)</strong></span>
        </div>
        <span className="text-xs text-[#5F7069]">Expires in 23h 48m</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      {/* Input Form */}
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};
