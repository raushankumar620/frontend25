import React, { useState } from 'react';
import { useChatStore } from '../../../store/chatStore';
import { ConversationList } from '../components/ConversationList';
import { ChatWindow } from '../components/ChatWindow';
import { CustomerPanel } from '../components/CustomerPanel';
import { EmptyState } from '../../../components/common/EmptyState';
import { MessageSquare } from 'lucide-react';

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

  const [showCustomerPanel] = useState(true);

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden">
      {/* Left Conversations List */}
      <div className="w-full sm:w-80 lg:w-88 shrink-0 h-full">
        <ConversationList
          conversations={conversations}
          activeId={activeConversationId}
          onSelect={setActiveConversation}
        />
      </div>

      {/* Middle Chat Window */}
      <div className="flex-1 h-full min-w-0 flex flex-col">
        {activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            messages={activeMessages}
            notes={activeNotes}
            onSendMessage={(txt) => sendMessage(activeConversation.id, txt)}
            onAddNote={(txt) => addNote(activeConversation.id, txt)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
            <EmptyState
              title="Select a conversation"
              description="Choose a contact from the list on the left to start live WhatsApp messaging."
              icon={<MessageSquare className="w-10 h-10 text-slate-300" />}
            />
          </div>
        )}
      </div>

      {/* Right CRM Details Panel */}
      {activeConversation && showCustomerPanel && (
        <div className="hidden xl:block w-72 shrink-0 h-full">
          <CustomerPanel conversation={activeConversation} />
        </div>
      )}
    </div>
  );
};
