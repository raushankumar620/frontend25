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
      <div className="h-16 px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Avatar name={conversation.contactName} size="md" status="online" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {conversation.contactName}
              </h3>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.2 rounded-full font-medium border border-emerald-200 dark:border-emerald-800">
                {conversation.channel}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">{conversation.contactPhone}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              showNotes
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <StickyNote className="w-4 h-4" />
            <span className="hidden sm:inline">Notes ({notes.length})</span>
          </button>

          <button
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Mark as Resolved"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </button>

          <Dropdown
            trigger={
              <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                <MoreVertical className="w-4 h-4" />
              </button>
            }
            items={[
              { label: 'Assign to Team Member', icon: <UserCheck className="w-3.5 h-3.5" /> },
              { label: 'Block & Report Spam', danger: true },
            ]}
          />
        </div>
      </div>

      {/* Internal Notes collapsible bar */}
      {showNotes && <InternalNote notes={notes} onAddNote={onAddNote} />}

      {/* Meta API 24h Window Notice */}
      <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-1.5 flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Meta 24h Customer Care Window: <strong>Open (Free Form Allowed)</strong></span>
        </div>
        <span className="text-[10px] text-slate-400">Expires in 23h 48m</span>
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
