import { useState, useEffect } from 'react';
import type { Conversation, Message, InternalNote } from '../types/message';
import { conversationService } from '../services/conversationService';

let conversations: Conversation[] = [];
let messagesMap: Record<string, Message[]> = {};
let notesMap: Record<string, InternalNote[]> = {};
let activeConversationId: string | null = null;
let isLoadingConversations = false;
let isLoadingMessages = false;

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
  getIsLoadingConversations() {
    return isLoadingConversations;
  },
  getIsLoadingMessages() {
    return isLoadingMessages;
  },

  async fetchConversations(filter: any = {}) {
    isLoadingConversations = true;
    notify();
    try {
      const res = await conversationService.listConversations(filter);
      if (res && Array.isArray(res.conversations)) {
        conversations = res.conversations;
        if (!activeConversationId && conversations.length > 0) {
          activeConversationId = conversations[0].id;
          chatStore.fetchMessagesAndNotes(conversations[0].id);
        } else if (conversations.length === 0) {
          activeConversationId = null;
        }
      }
    } catch (err) {
      console.warn('[ChatStore] Could not load live conversations, using local state', err);
    } finally {
      isLoadingConversations = false;
      notify();
    }
  },

  async fetchMessagesAndNotes(convId: string) {
    if (!convId) return;
    isLoadingMessages = true;
    notify();
    try {
      const [messages, notes] = await Promise.all([
        conversationService.getMessages(convId).catch(() => []),
        conversationService.getNotes(convId).catch(() => []),
      ]);

      if (messages.length > 0) {
        messagesMap[convId] = messages;
      }
      if (notes.length > 0) {
        notesMap[convId] = notes;
      }
    } catch (err) {
      console.warn('[ChatStore] Error loading messages/notes:', err);
    } finally {
      isLoadingMessages = false;
      notify();
    }
  },

  async setActiveConversation(id: string | null) {
    activeConversationId = id;
    if (id) {
      conversations = conversations.map((c) =>
        c.id === id ? { ...c, unreadCount: 0 } : c
      );
      // Mark read on backend
      conversationService.markAsRead(id).catch(() => {});
      chatStore.fetchMessagesAndNotes(id);
    }
    notify();
  },

  getMessages(convId: string): Message[] {
    return messagesMap[convId] || [];
  },

  getNotes(convId: string): InternalNote[] {
    return notesMap[convId] || [];
  },

  async sendMessage(convId: string, content: string, type: Message['type'] = 'text', mediaUrl?: string) {
    const tempId = 'msg_' + Date.now();
    const optimisticMsg: Message = {
      id: tempId,
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
    messagesMap[convId] = [...cur, optimisticMsg];

    conversations = conversations.map((c) =>
      c.id === convId ? { ...c, lastMessage: optimisticMsg, updatedAt: optimisticMsg.timestamp } : c
    );
    notify();

    try {
      const sent = await conversationService.sendReply(convId, content, type, mediaUrl);
      if (sent) {
        messagesMap[convId] = messagesMap[convId].map((m) =>
          m.id === tempId ? sent : m
        );
        notify();
      }
    } catch (err) {
      console.warn('[ChatStore] Error sending reply to backend:', err);
    }
  },

  async addNote(convId: string, content: string) {
    const tempId = 'nt_' + Date.now();
    const optimisticNote: InternalNote = {
      id: tempId,
      conversationId: convId,
      authorId: 'usr_current',
      authorName: 'You',
      content,
      createdAt: new Date().toISOString(),
    };

    const cur = notesMap[convId] || [];
    notesMap[convId] = [...cur, optimisticNote];
    notify();

    try {
      const realNote = await conversationService.addNote(convId, content);
      if (realNote) {
        notesMap[convId] = notesMap[convId].map((n) =>
          n.id === tempId ? realNote : n
        );
        notify();
      }
    } catch (err) {
      console.warn('[ChatStore] Error saving note to backend:', err);
    }
  },

  async assignAgent(convId: string, agentId: string | null) {
    try {
      await conversationService.assignAgent(convId, agentId);
      chatStore.fetchConversations();
    } catch (err) {
      console.warn('[ChatStore] Error assigning agent:', err);
    }
  },

  async updateStatus(convId: string, status: string, tags?: string[]) {
    try {
      await conversationService.updateConversation(convId, { status, tags });
      conversations = conversations.map((c) =>
        c.id === convId ? { ...c, status: status.toLowerCase() as any, tags: tags || c.tags } : c
      );
      notify();
    } catch (err) {
      console.warn('[ChatStore] Error updating status:', err);
    }
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
    chatStore.fetchConversations();
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
    isLoadingConversations: chatStore.getIsLoadingConversations(),
    isLoadingMessages: chatStore.getIsLoadingMessages(),
    setActiveConversation: chatStore.setActiveConversation.bind(chatStore),
    sendMessage: chatStore.sendMessage.bind(chatStore),
    addNote: chatStore.addNote.bind(chatStore),
    assignAgent: chatStore.assignAgent.bind(chatStore),
    updateStatus: chatStore.updateStatus.bind(chatStore),
    refreshConversations: chatStore.fetchConversations.bind(chatStore),
  };
}
