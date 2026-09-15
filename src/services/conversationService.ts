import { apiClient } from './apiClient';
import type { Conversation, Message, InternalNote } from '../types/message';

export interface ConversationsFilter {
  status?: string;
  assignedAgentId?: string;
  priority?: string;
  tag?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const conversationService = {
  async listConversations(query: ConversationsFilter = {}): Promise<{
    conversations: Conversation[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const params = new URLSearchParams();
    if (query.status && query.status !== 'all') params.append('status', query.status.toUpperCase());
    if (query.assignedAgentId) params.append('assignedAgentId', query.assignedAgentId);
    if (query.priority) params.append('priority', query.priority);
    if (query.tag) params.append('tag', query.tag);
    if (query.search) params.append('search', query.search);
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await apiClient.get<any>(`/conversations${queryString}`);

    if (res.success && res.data) {
      const rawList = res.data.conversations || [];
      const transformed: Conversation[] = rawList.map((c: any) => ({
        id: c._id || c.id,
        contactId: c.contactId?._id || c.contactId?.id || c.contactId || 'cnt_unknown',
        contactName: c.contactId?.name || c.contactId?.phoneNumber || 'Unknown Contact',
        contactPhone: c.contactId?.phoneNumber || '',
        contactAvatar: c.contactId?.avatar || '',
        unreadCount: c.unreadCount || 0,
        status: (c.status || 'OPEN').toLowerCase() as any,
        channel: `WhatsApp (${c.whatsappNumberId?.displayPhoneNumber || 'Primary'})`,
        tags: c.tags || [],
        assignedTo: c.assignedAgentId
          ? {
              id: c.assignedAgentId._id || c.assignedAgentId.id,
              name: c.assignedAgentId.name || `${c.assignedAgentId.firstName || ''} ${c.assignedAgentId.lastName || ''}`.trim() || c.assignedAgentId.email,
              avatar: c.assignedAgentId.avatar,
            }
          : undefined,
        updatedAt: c.lastMessageAt || c.updatedAt || new Date().toISOString(),
        customFields: c.contactId?.customAttributes || {},
        lastMessage: {
          id: 'last_' + (c._id || c.id),
          conversationId: c._id || c.id,
          senderId: c.lastMessage?.sender === 'user' ? 'usr_current' : 'contact',
          senderType: (c.lastMessage?.sender || 'contact') as any,
          content: c.lastMessage?.content || '',
          type: (c.lastMessage?.type || 'text') as any,
          status: 'read',
          timestamp: c.lastMessage?.timestamp || c.lastMessageAt || new Date().toISOString(),
        },
      }));

      return {
        conversations: transformed,
        pagination: res.data.pagination || {
          total: transformed.length,
          page: 1,
          limit: 30,
          totalPages: 1,
        },
      };
    }

    return {
      conversations: [],
      pagination: { total: 0, page: 1, limit: 30, totalPages: 0 },
    };
  },

  async getConversation(id: string): Promise<Conversation> {
    const res = await apiClient.get<any>(`/conversations/${id}`);
    if (res.success && res.data) {
      const c = res.data;
      return {
        id: c._id || c.id,
        contactId: c.contactId?._id || c.contactId?.id || c.contactId || 'cnt_unknown',
        contactName: c.contactId?.name || c.contactId?.phoneNumber || 'Unknown Contact',
        contactPhone: c.contactId?.phoneNumber || '',
        contactAvatar: c.contactId?.avatar || '',
        unreadCount: c.unreadCount || 0,
        status: (c.status || 'OPEN').toLowerCase() as any,
        channel: `WhatsApp (${c.whatsappNumberId?.displayPhoneNumber || 'Primary'})`,
        tags: c.tags || [],
        assignedTo: c.assignedAgentId
          ? {
              id: c.assignedAgentId._id || c.assignedAgentId.id,
              name: c.assignedAgentId.name || c.assignedAgentId.email,
              avatar: c.assignedAgentId.avatar,
            }
          : undefined,
        updatedAt: c.lastMessageAt || c.updatedAt || new Date().toISOString(),
        customFields: c.contactId?.customAttributes || {},
        lastMessage: {
          id: 'last_' + (c._id || c.id),
          conversationId: c._id || c.id,
          senderId: c.lastMessage?.sender === 'user' ? 'usr_current' : 'contact',
          senderType: (c.lastMessage?.sender || 'contact') as any,
          content: c.lastMessage?.content || '',
          type: (c.lastMessage?.type || 'text') as any,
          status: 'read',
          timestamp: c.lastMessage?.timestamp || c.lastMessageAt || new Date().toISOString(),
        },
      };
    }
    throw new Error(res.message || 'Failed to fetch conversation');
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const res = await apiClient.get<any>(`/conversations/${conversationId}/messages?limit=100`);
    if (res.success && res.data && Array.isArray(res.data.messages)) {
      return res.data.messages.map((m: any) => {
        let msgContent = m.content?.body || m.content?.caption;
        if (!msgContent) {
          if (m.type === 'template') {
            msgContent = `📋 [Template: ${m.content?.name || m.templateName || 'hello_world'}]`;
          } else if (typeof m.content === 'string') {
            msgContent = m.content;
          } else if (m.content && typeof m.content === 'object') {
            msgContent = m.content.text || m.content.name || JSON.stringify(m.content);
          } else {
            msgContent = '';
          }
        }
        return {
          id: m._id || m.id,
          conversationId: m.conversationId,
          senderId: m.direction === 'OUTBOUND' ? 'user' : 'contact',
          senderType: m.direction === 'OUTBOUND' ? 'user' : 'contact',
          content: msgContent,
          type: m.type || 'text',
          mediaUrl: m.content?.url || m.content?.mediaUrl,
          mediaFileName: m.content?.fileName,
          status: (m.status || 'SENT').toLowerCase() as any,
          timestamp: m.sentAt || m.createdAt || new Date().toISOString(),
          templateName: m.content?.name || m.templateName,
        };
      });
    }
    return [];
  },

  async sendReply(
    conversationId: string,
    content: string,
    type: Message['type'] = 'text',
    mediaUrl?: string
  ): Promise<Message> {
    const payload: any = { type };
    if (type === 'text') {
      payload.text = content;
    } else {
      payload.mediaUrl = mediaUrl;
      payload.caption = content;
    }

    const res = await apiClient.post<any>(`/conversations/${conversationId}/messages`, payload);
    if (res.success && res.data) {
      const m = res.data;
      return {
        id: m._id || m.id,
        conversationId: m.conversationId,
        senderId: 'user',
        senderType: 'user',
        content: m.content?.body || m.content?.caption || content,
        type: m.type || type,
        mediaUrl: m.content?.url || mediaUrl,
        status: (m.status || 'SENT').toLowerCase() as any,
        timestamp: m.sentAt || m.createdAt || new Date().toISOString(),
      };
    }
    throw new Error(res.message || 'Failed to send reply');
  },

  async assignAgent(conversationId: string, agentId: string | null): Promise<void> {
    const res = await apiClient.post(`/conversations/${conversationId}/assign`, { agentId });
    if (!res.success) {
      throw new Error(res.message || 'Failed to assign agent');
    }
  },

  async markAsRead(conversationId: string): Promise<void> {
    await apiClient.post(`/conversations/${conversationId}/read`);
  },

  async updateConversation(conversationId: string, data: { status?: string; tags?: string[] }): Promise<void> {
    const res = await apiClient.patch(`/conversations/${conversationId}`, data);
    if (!res.success) {
      throw new Error(res.message || 'Failed to update conversation');
    }
  },

  async getNotes(conversationId: string): Promise<InternalNote[]> {
    const res = await apiClient.get<any[]>(`/conversations/${conversationId}/notes`);
    if (res.success && Array.isArray(res.data)) {
      return res.data.map((n: any) => ({
        id: n._id || n.id,
        conversationId: n.conversationId,
        authorId: n.authorId?._id || n.authorId?.id || n.authorId,
        authorName: n.authorId?.name || `${n.authorId?.firstName || ''} ${n.authorId?.lastName || ''}`.trim() || n.authorId?.email || 'Agent',
        authorAvatar: n.authorId?.avatar,
        content: n.content,
        createdAt: n.createdAt || new Date().toISOString(),
      }));
    }
    return [];
  },

  async addNote(conversationId: string, content: string): Promise<InternalNote> {
    const res = await apiClient.post<any>(`/conversations/${conversationId}/notes`, { content });
    if (res.success && res.data) {
      const n = res.data;
      return {
        id: n._id || n.id,
        conversationId: n.conversationId,
        authorId: n.authorId?._id || n.authorId?.id || n.authorId,
        authorName: n.authorId?.name || `${n.authorId?.firstName || ''} ${n.authorId?.lastName || ''}`.trim() || 'You',
        authorAvatar: n.authorId?.avatar,
        content: n.content,
        createdAt: n.createdAt || new Date().toISOString(),
      };
    }
    throw new Error(res.message || 'Failed to add note');
  },

  async deleteNote(conversationId: string, noteId: string): Promise<void> {
    const res = await apiClient.delete(`/conversations/${conversationId}/notes/${noteId}`);
    if (!res.success) {
      throw new Error(res.message || 'Failed to delete note');
    }
  },
};
