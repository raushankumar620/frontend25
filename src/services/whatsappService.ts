import type { WhatsAppPhoneNumber, WhatsAppTemplate } from '../types/whatsapp';
import type { Conversation } from '../types/message';
import type { Contact } from '../types/contact';
import { apiClient } from './apiClient';

export interface ConnectManualPayload {
  wabaId: string;
  name: string;
  accessToken: string;
  phoneNumberId?: string;
  displayPhoneNumber?: string;
  verifiedName?: string;
  metaAppId?: string;
}

export const whatsappService = {
  async getNumbers(): Promise<WhatsAppPhoneNumber[]> {
    try {
      const res = await apiClient.get<any[]>('/whatsapp/numbers');
      if (res.success && Array.isArray(res.data)) {
        return res.data.map((num) => ({
          id: num._id || num.id,
          phoneNumber: num.displayPhoneNumber,
          displayPhoneNumber: num.displayPhoneNumber,
          verifiedName: num.verifiedName || 'Verified WhatsApp Number',
          qualityRating: num.qualityRating || 'GREEN',
          messagingLimit: `${num.messagingTier?.replace('TIER_', '') || '1K'} msgs / 24h`,
          status: num.status === 'CONNECTED' ? 'connected' : 'disconnected',
          wabaId: num.accountId?.wabaId || 'waba_active',
          webhookUrl: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/webhooks/whatsapp`,
          lastSyncAt: num.lastSyncedAt || new Date().toISOString(),
          isDefault: !!num.isDefault,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch WhatsApp numbers from backend:', error);
    }
    return [];
  },

  async connectManual(payload: ConnectManualPayload): Promise<any> {
    const res = await apiClient.post('/whatsapp/accounts/manual', payload);
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to connect WhatsApp account');
  },

  async syncNumber(numberId: string): Promise<any> {
    const res = await apiClient.post(`/whatsapp/numbers/${numberId}/sync`);
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to sync WhatsApp status');
  },

  async disconnectNumber(numberId: string): Promise<any> {
    const res = await apiClient.delete(`/whatsapp/numbers/${numberId}`);
    if (res.success) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to disconnect WhatsApp number');
  },

  async getTemplates(): Promise<WhatsAppTemplate[]> {
    try {
      const res = await apiClient.get<any>('/templates');
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
      if (res.success && res.data && Array.isArray(res.data.templates)) {
        return res.data.templates;
      }
    } catch (error) {
      console.error('Failed to fetch templates from backend:', error);
    }
    return [];
  },

  async getConversations(): Promise<Conversation[]> {
    try {
      const res = await apiClient.get<any>('/conversations');
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
      if (res.success && res.data && Array.isArray(res.data.conversations)) {
        return res.data.conversations;
      }
    } catch (error) {
      console.error('Failed to fetch conversations from backend:', error);
    }
    return [];
  },

  async getContacts(): Promise<Contact[]> {
    try {
      const res = await apiClient.get<any>('/contacts');
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
      if (res.success && res.data && Array.isArray(res.data.contacts)) {
        return res.data.contacts;
      }
    } catch (error) {
      console.error('Failed to fetch contacts from backend:', error);
    }
    return [];
  },

  async sendMessage(payload: {
    to: string;
    type?: string;
    content?: any;
    text?: string;
    phoneNumberId?: string;
  }): Promise<any> {
    const body: any = {
      to: payload.to,
      type: payload.type || 'text',
      content: payload.content || { text: payload.text || 'Test message' },
    };
    if (payload.phoneNumberId) {
      body.phoneNumberId = payload.phoneNumberId;
    }
    const res = await apiClient.post('/messages', body);
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to send WhatsApp message');
  },

  async getMessages(params?: { limit?: number; page?: number }): Promise<any[]> {
    try {
      const query = new URLSearchParams();
      if (params?.limit) query.append('limit', String(params.limit));
      if (params?.page) query.append('page', String(params.page));
      const res = await apiClient.get<any>(`/messages?${query.toString()}`);
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
      if (res.success && res.data && Array.isArray(res.data.messages)) {
        return res.data.messages;
      }
    } catch (error) {
      console.error('Failed to fetch message logs from backend:', error);
    }
    return [];
  },

  async updateNumber(id: string, data: any): Promise<any> {
    const res = await apiClient.patch(`/whatsapp/numbers/${id}`, data);
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to update WhatsApp number');
  },
};
