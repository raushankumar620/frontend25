import React, { useState } from 'react';
import { useChatStore } from '../../../store/chatStore';
import { ConversationList } from '../components/ConversationList';
import { ChatWindow } from '../components/ChatWindow';
import { CustomerPanel } from '../components/CustomerPanel';
import { MessagesSquare, ShieldCheck } from 'lucide-react';

export const Inbox: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    activeConversation,
    activeMessages,
    activeNotes,
    setActiveConversation,
    sendMessage,
    addNote,
  } = useChatStore();

  const [showCustomerPanel, setShowCustomerPanel] = useState(false);

  return (
    <div className="h-full w-full flex overflow-hidden bg-white">
      {/* Left Conversations List Sidebar */}
      <div className="w-full sm:w-80 lg:w-92 shrink-0 h-full">
        <ConversationList
          conversations={conversations}
          activeId={activeConversationId}
          onSelect={setActiveConversation}
        />
      </div>

      {/* Middle Active Chat Window */}
      <div className="flex-1 h-full min-w-0 flex flex-col">
        {activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            messages={activeMessages}
            notes={activeNotes}
            onSendMessage={(txt) => sendMessage(activeConversation.id, txt)}
            onAddNote={(txt) => addNote(activeConversation.id, txt)}
            onToggleCustomerPanel={() => setShowCustomerPanel(!showCustomerPanel)}
            isCustomerPanelOpen={showCustomerPanel}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#F0F2F5]/40 select-none">
            <div className="w-16 h-16 rounded-3xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#006736] mb-4 shadow-sm">
              <MessagesSquare className="w-8 h-8 text-[#006736]" />
            </div>
            <h3 className="text-lg font-black text-[#14201C] tracking-tight">
              WhatsApp Live Inbox
            </h3>
            <p className="text-xs sm:text-sm text-[#5F7069] mt-1.5 max-w-sm font-medium leading-relaxed">
              Select a conversation from the left to read customer messages, send live replies, or manage AI handoffs.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-[#006736] bg-[#E9F9EE] px-3 py-1 rounded-full border border-[#C4EBD0]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#05A222]" />
              Meta Cloud API Connected
            </div>
          </div>
        )}
      </div>

      {/* Right CRM Details Panel */}
      {activeConversation && showCustomerPanel && (
        <div className="hidden xl:block w-76 shrink-0 h-full">
          <CustomerPanel conversation={activeConversation} />
        </div>
      )}
    </div>
  );
};

