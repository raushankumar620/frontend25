import { useState, useEffect } from 'react';
import type { Conversation, Message, InternalNote } from '../types/message';
import { MOCK_CONVERSATIONS } from '../services/whatsappService';

const initialMessages: Record<string, Message[]> = {
  conv_1: [
    {
      id: 'msg_101',
      conversationId: 'conv_1',
      senderId: 'cnt_101',
      senderType: 'contact',
      content: 'Hi there! We are interested in your enterprise WhatsApp plan.',
      type: 'text',
      status: 'read',
      timestamp: new Date(Date.now() - 3600 * 1000).toISOString(),
    },
    {
      id: 'msg_102',
      conversationId: 'conv_1',
      senderId: 'usr_1',
      senderType: 'user',
      content: 'Hello David! Welcome to ChatFlow. We offer custom volume discounts and dedicated account managers.',
      type: 'text',
      status: 'read',
      timestamp: new Date(Date.now() - 3000 * 1000).toISOString(),
    },
    {
      id: 'msg_103',
      conversationId: 'conv_1',
      senderId: 'cnt_101',
      senderType: 'contact',
      content: 'Could you tell me if you support custom SSO integrations for our team of 500?',
      type: 'text',
      status: 'delivered',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
  ],
};

const initialNotes: Record<string, InternalNote[]> = {
  conv_1: [
    {
      id: 'nt_1',
      conversationId: 'conv_1',
      authorId: 'usr_1',
      authorName: 'Sarah Jenkins',
      content: 'Customer is looking to close before end of Q1. High probability lead ($30k ARR).',
      createdAt: new Date(Date.now() - 2500 * 1000).toISOString(),
    },
  ],
};

let conversations: Conversation[] = [...MOCK_CONVERSATIONS];
let messagesMap = { ...initialMessages };
let notesMap = { ...initialNotes };
let activeConversationId: string | null = 'conv_1';

const listeners = new Set<() => void>();
function notify() {
  listeners.forEach((fn) => fn());
}

export const chatStore = {
  getConversations() {
    return conversations;
  },
  getActiveConversationId() {
    return activeConversationId;
  },
  setActiveConversation(id: string | null) {
    activeConversationId = id;
    if (id) {
      conversations = conversations.map((c) =>
        c.id === id ? { ...c, unreadCount: 0 } : c
      );
    }
    notify();
  },
  getMessages(convId: string): Message[] {
    return messagesMap[convId] || [];
  },
  getNotes(convId: string): InternalNote[] {
    return notesMap[convId] || [];
  },
  sendMessage(convId: string, content: string, type: Message['type'] = 'text', mediaUrl?: string) {
    const newMsg: Message = {
      id: 'msg_' + Date.now(),
      conversationId: convId,
      senderId: 'usr_current',
      senderType: 'user',
      content,
      type,
      mediaUrl,
      status: 'sent',
      timestamp: new Date().toISOString(),
    };

    const cur = messagesMap[convId] || [];
    messagesMap[convId] = [...cur, newMsg];

    conversations = conversations.map((c) =>
      c.id === convId ? { ...c, lastMessage: newMsg, updatedAt: newMsg.timestamp } : c
    );

    notify();

    setTimeout(() => {
      newMsg.status = 'delivered';
      notify();
    }, 1200);
  },
  addNote(convId: string, content: string) {
    const newNote: InternalNote = {
      id: 'nt_' + Date.now(),
      conversationId: convId,
      authorId: 'usr_current',
      authorName: 'Sarah Jenkins',
      content,
      createdAt: new Date().toISOString(),
    };
    const cur = notesMap[convId] || [];
    notesMap[convId] = [...cur, newNote];
    notify();
  },
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};

export function useChatStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return chatStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const activeId = chatStore.getActiveConversationId();
  const activeConversation = conversations.find((c) => c.id === activeId) || null;

  return {
    conversations: chatStore.getConversations(),
    activeConversationId: activeId,
    activeConversation,
    activeMessages: activeId ? chatStore.getMessages(activeId) : [],
    activeNotes: activeId ? chatStore.getNotes(activeId) : [],
    setActiveConversation: chatStore.setActiveConversation.bind(chatStore),
    sendMessage: chatStore.sendMessage.bind(chatStore),
    addNote: chatStore.addNote.bind(chatStore),
  };
}
