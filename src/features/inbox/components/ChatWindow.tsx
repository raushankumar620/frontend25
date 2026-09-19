import React, { useState, useEffect, useRef } from 'react';
import type { Conversation, Message, InternalNote as InternalNoteType } from '../../../types/message';
import { Avatar } from '../../../components/ui/Avatar';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { InternalNote } from './InternalNote';
import { MoreVertical, CheckCircle2, UserCheck, StickyNote, Loader2, Bot, AlertTriangle, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Dropdown } from '../../../components/ui/Dropdown';
import { useChatStore } from '../../../store/chatStore';
import { aiService } from '../../../services/aiService';

export interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  notes: InternalNoteType[];
  onSendMessage: (text: string) => void;
  onAddNote: (content: string) => void;
  onToggleCustomerPanel?: () => void;
  isCustomerPanelOpen?: boolean;
  onBack?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  notes,
  onSendMessage,
  onAddNote,
  onToggleCustomerPanel,
  isCustomerPanelOpen = true,
  onBack,
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const [handoffLoading, setHandoffLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { updateStatus, isLoadingMessages } = useChatStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, conversation.id]);

  const handleToggleResolve = () => {
    const newStatus = conversation.status === 'resolved' ? 'open' : 'resolved';
    updateStatus(conversation.id, newStatus);
  };

  const handleClaim = async () => {
    try {
      setHandoffLoading(true);
      await aiService.claimHandoff(conversation.id);
    } catch (err) {
      console.error('Failed to claim:', err);
    } finally {
      setHandoffLoading(false);
    }
  };

  const handleResumeAi = async () => {
    try {
      setHandoffLoading(true);
      await aiService.resumeAi(conversation.id);
    } catch (err) {
      console.error('Failed to resume AI:', err);
    } finally {
      setHandoffLoading(false);
    }
  };

  const handleTriggerHandoff = async () => {
    try {
      setHandoffLoading(true);
      await aiService.triggerHandoff({
        conversationId: conversation.id,
        reason: 'Operator requested human escalation',
        priority: 'HIGH',
      });
    } catch (err) {
      console.error('Failed to trigger handoff:', err);
    } finally {
      setHandoffLoading(false);
    }
  };

  const isHandoffRequested =
    conversation.tags?.includes('human-handoff') ||
    conversation.tags?.includes('ai-escalated');

  const isAssignedToAgent = Boolean(conversation.assignedTo);

  return (
    <div className="w-full h-full flex flex-col bg-[#F0F2F5]/60 relative">
      {/* WhatsApp Chat Top Header */}
      <div className="h-16 px-3 sm:px-5 bg-white border-b border-[#E2EAE6] flex items-center justify-between z-10 shrink-0 shadow-2xs gap-2">
        {/* Left: Contact Info - Single Sleek Row */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className="sm:hidden p-1.5 -ml-1 rounded-xl text-[#5F7069] hover:bg-[#F6FAF8] hover:text-[#14201C] transition-colors cursor-pointer shrink-0"
              title="Back to conversations"
              aria-label="Back to conversations"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <Avatar name={conversation.contactName || conversation.contactPhone} size="md" status="online" />
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-wrap">
            <h3 className="text-sm sm:text-base font-bold text-[#14201C] leading-none truncate max-w-[120px] sm:max-w-none">
              {conversation.contactName || conversation.contactPhone}
            </h3>

            {conversation.contactPhone && (
              <span className="hidden xs:inline-block text-[11px] sm:text-xs text-[#5F7069] font-medium shrink-0 bg-[#F6FAF8] px-1.5 sm:px-2 py-0.5 rounded-md border border-[#E2EAE6]">
                +{conversation.contactPhone.replace(/^\+/, '')}
              </span>
            )}

            <span className="text-[10px] text-[#006736] bg-[#E9F9EE] px-1.5 sm:px-2 py-0.5 rounded-full font-bold border border-[#C4EBD0] flex items-center gap-1 shrink-0">
              <ShieldCheck className="w-3 h-3 text-[#05A222]" />
              <span className="hidden sm:inline">WhatsApp</span>
            </span>

            <span className="hidden md:flex items-center gap-1 text-[#05A222] text-[11px] font-bold shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#05A222] animate-pulse" />
              Online
            </span>

            {conversation.status === 'resolved' && (
              <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md font-bold shrink-0">
                Resolved
              </span>
            )}
            {isHandoffRequested && (
              <span className="text-[10px] text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md font-bold animate-pulse shrink-0">
                Handoff Requested
              </span>
            )}
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Notes Button */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showNotes
                ? 'bg-[#FFF8E6] text-[#9A6B00] border border-[#FFE299]'
                : 'text-[#5F7069] bg-[#F6FAF8] hover:bg-[#E9F9EE] hover:text-[#006736] border border-[#E2EAE6]'
            }`}
          >
            <StickyNote className="w-4 h-4" />
            <span className="hidden sm:inline">Notes</span>
            <span className="text-[10px] opacity-80">({notes.length})</span>
          </button>

          {/* Resolve / Reopen Button */}
          <button
            onClick={handleToggleResolve}
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
              conversation.status === 'resolved'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-[#F6FAF8] text-[#5F7069] hover:bg-[#E9F9EE] hover:text-[#006736] border border-[#E2EAE6]'
            }`}
            title={conversation.status === 'resolved' ? 'Reopen Conversation' : 'Mark as Resolved'}
          >
            <CheckCircle2 className="w-4 h-4 text-[#05A222]" />
            <span className="hidden md:inline">
              {conversation.status === 'resolved' ? 'Resolved' : 'Resolve'}
            </span>
          </button>

          {/* CRM Details Panel Toggle Button */}
          {onToggleCustomerPanel && (
            <button
              onClick={onToggleCustomerPanel}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isCustomerPanelOpen
                  ? 'bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]'
                  : 'text-[#5F7069] bg-[#F6FAF8] hover:bg-[#E9F9EE] hover:text-[#006736] border border-[#E2EAE6]'
              }`}
              title="Toggle Customer Info Panel"
            >
              <UserCheck className="w-4 h-4" />
              <span className="hidden lg:inline">CRM Details</span>
            </button>
          )}

          <Dropdown
            trigger={
              <button className="p-2 rounded-xl text-[#5F7069] hover:bg-[#F6FAF8] hover:text-[#14201C] transition-colors cursor-pointer border border-[#E2EAE6]">
                <MoreVertical className="w-4.5 h-4.5" />
              </button>
            }
            items={[
              { label: 'Trigger Human Handoff', icon: <UserCheck className="w-4 h-4" />, onClick: handleTriggerHandoff },
              { label: 'Resume AI Assistant', icon: <Bot className="w-4 h-4" />, onClick: handleResumeAi },
            ]}
          />
        </div>
      </div>

      {/* Internal Notes collapsible bar */}
      {showNotes && <InternalNote notes={notes} onAddNote={onAddNote} />}

      {/* AI / Human Handoff Control Banner */}
      {isHandoffRequested ? (
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 flex items-center justify-between text-xs sm:text-sm text-amber-900 font-medium shrink-0">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Customer requested human support — AI auto-reply paused.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClaim}
              disabled={handoffLoading}
              className="px-3 py-1 bg-[#006736] hover:bg-[#05A222] text-white rounded-lg text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              Claim Conversation
            </button>
            <button
              onClick={handleResumeAi}
              disabled={handoffLoading}
              className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Resume AI
            </button>
          </div>
        </div>
      ) : isAssignedToAgent ? (
        <div className="bg-blue-50 border-b border-blue-200 px-5 py-2 flex items-center justify-between text-xs text-blue-900 font-medium shrink-0">
          <div className="flex items-center gap-2">
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Conversation assigned to Human Agent. AI is paused.</span>
          </div>
          <button
            onClick={handleResumeAi}
            disabled={handoffLoading}
            className="text-xs font-bold text-blue-700 hover:underline cursor-pointer"
          >
            Return to AI Agent
          </button>
        </div>
      ) : (
        <div className="bg-[#E9F9EE] border-b border-[#C4EBD0] px-5 py-2 flex items-center justify-between text-xs text-[#006736] font-medium shrink-0">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#05A222]" />
            <span>AI Autonomous Bot Active: Handling customer inquiries</span>
          </div>
          <button
            onClick={handleTriggerHandoff}
            disabled={handoffLoading}
            className="text-xs font-bold text-[#006736] hover:text-[#05A222] hover:underline cursor-pointer"
          >
            Escalate to Human
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 custom-scrollbar bg-[#EFEAE2]/30">
        {isLoadingMessages && messages.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-6 h-6 animate-spin text-[#006736]" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-[#8A9993] text-sm">
            <p className="font-bold text-[#14201C]">No messages in this conversation yet.</p>
            <p className="text-xs text-[#8A9993] mt-1">Send a message below to start chatting with the customer.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};

