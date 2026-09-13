export type MessageType = 'text' | 'image' | 'video' | 'document' | 'audio' | 'template' | 'interactive';
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed' | 'pending';
export type ConversationStatus = 'open' | 'assigned' | 'resolved' | 'snoozed';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'user' | 'contact' | 'bot' | 'system';
  content: string;
  type: MessageType;
  mediaUrl?: string;
  mediaFileName?: string;
  status: MessageStatus;
  timestamp: string;
  templateName?: string;
}

export interface Conversation {
  id: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  contactAvatar?: string;
  unreadCount: number;
  lastMessage: Message;
  status: ConversationStatus;
  assignedTo?: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
  channel: string;
  updatedAt: string;
  customFields?: Record<string, string>;
}

export interface InternalNote {
  id: string;
  conversationId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}
