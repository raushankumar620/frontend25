import type { WhatsAppPhoneNumber, WhatsAppTemplate } from '../types/whatsapp';
import type { Conversation } from '../types/message';
import type { Contact } from '../types/contact';
import { apiClient } from './apiClient';

export const MOCK_NUMBERS: WhatsAppPhoneNumber[] = [
  {
    id: 'num_1',
    phoneNumber: '+15550192834',
    verifiedName: 'Acme Support & Sales',
    displayPhoneNumber: '+1 (555) 019-2834',
    qualityRating: 'GREEN',
    messagingLimit: '100,000 / 24h (Tier 3)',
    status: 'connected',
    wabaId: 'waba_99210928301',
    webhookUrl: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/webhooks/whatsapp`,
    lastSyncAt: new Date().toISOString(),
  },
  {
    id: 'num_2',
    phoneNumber: '+442079460912',
    verifiedName: 'Acme Europe Direct',
    displayPhoneNumber: '+44 20 7946 0912',
    qualityRating: 'GREEN',
    messagingLimit: '10,000 / 24h (Tier 2)',
    status: 'connected',
    wabaId: 'waba_99210928301',
    webhookUrl: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/webhooks/whatsapp-eu`,
    lastSyncAt: new Date().toISOString(),
  },
];

export const MOCK_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'tpl_1',
    name: 'order_status_update_v2',
    category: 'UTILITY',
    language: 'en_US',
    status: 'APPROVED',
    header: {
      type: 'TEXT',
      text: 'Order Update #{{1}}',
    },
    body: 'Hi {{2}}, your order #{{1}} has been shipped via {{3}}! Estimated delivery date is {{4}}. Click below to track.',
    footer: 'Acme Global Logistics',
    buttons: [
      { type: 'URL', text: 'Track Order', url: 'https://tracking.acme.com/{{1}}' },
      { type: 'QUICK_REPLY', text: 'Contact Support' },
    ],
    createdAt: '2025-02-10T11:00:00Z',
    updatedAt: '2025-02-10T12:30:00Z',
  },
  {
    id: 'tpl_2',
    name: 'black_friday_vip_early_access',
    category: 'MARKETING',
    language: 'en_US',
    status: 'APPROVED',
    header: {
      type: 'IMAGE',
      mediaUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600',
    },
    body: 'Hello {{1}}! 🎁 As an exclusive VIP Member, get early 40% OFF with code {{2}}. Offer valid for next 24 hours only.',
    footer: 'Reply STOP to opt out',
    buttons: [
      { type: 'URL', text: 'Shop VIP Collection', url: 'https://acme.com/vip' },
      { type: 'QUICK_REPLY', text: 'Claim Discount' },
    ],
    createdAt: '2025-02-12T09:00:00Z',
    updatedAt: '2025-02-12T09:15:00Z',
  },
  {
    id: 'tpl_3',
    name: 'auth_security_otp',
    category: 'AUTHENTICATION',
    language: 'en_US',
    status: 'APPROVED',
    body: '{{1}} is your one-time verification code. Do not share this OTP with anyone for your security.',
    footer: 'Expires in 10 minutes',
    buttons: [{ type: 'URL', text: 'Copy OTP', url: 'https://auth.acme.com/otp?code={{1}}' }],
    createdAt: '2025-01-20T14:00:00Z',
    updatedAt: '2025-01-20T14:00:00Z',
  },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    contactId: 'cnt_101',
    contactName: 'David Miller',
    contactPhone: '+1 (555) 234-5678',
    unreadCount: 2,
    status: 'open',
    channel: 'WhatsApp (+1 555-019-2834)',
    tags: ['VIP', 'Enterprise', 'Lead'],
    assignedTo: { id: 'usr_1', name: 'Sarah J.', avatar: '' },
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    lastMessage: {
      id: 'msg_1',
      conversationId: 'conv_1',
      senderId: 'cnt_101',
      senderType: 'contact',
      content: 'Could you tell me if you support custom SSO integrations for our team of 500?',
      type: 'text',
      status: 'delivered',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
  },
  {
    id: 'conv_2',
    contactId: 'cnt_102',
    contactName: 'Elena Rostova',
    contactPhone: '+44 7700 900123',
    unreadCount: 0,
    status: 'assigned',
    channel: 'WhatsApp Europe',
    tags: ['Support', 'Urgent'],
    assignedTo: { id: 'usr_2', name: 'Alex Rivera' },
    updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    lastMessage: {
      id: 'msg_2',
      conversationId: 'conv_2',
      senderId: 'usr_2',
      senderType: 'user',
      content: 'I have updated your webhook secret key, please test sending a ping now!',
      type: 'text',
      status: 'read',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
  },
  {
    id: 'conv_3',
    contactId: 'cnt_103',
    contactName: 'Marcus Chen',
    contactPhone: '+1 (415) 892-3312',
    unreadCount: 0,
    status: 'resolved',
    channel: 'WhatsApp (+1 555-019-2834)',
    tags: ['Billing'],
    updatedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    lastMessage: {
      id: 'msg_3',
      conversationId: 'conv_3',
      senderId: 'bot',
      senderType: 'bot',
      content: 'Invoice #INV-2025-081 was marked as paid. Thank you!',
      type: 'text',
      status: 'read',
      timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    },
  },
];

export const MOCK_CONTACTS: Contact[] = [
  {
    id: 'cnt_101',
    name: 'David Miller',
    phone: '+15552345678',
    email: 'david.miller@apextech.io',
    tags: ['VIP', 'Enterprise', 'Lead'],
    status: 'active',
    source: 'Inbound WhatsApp',
    totalOrders: 14,
    totalSpent: 4890,
    customAttributes: { company: 'ApexTech Solutions', seats: 250, plan: 'Enterprise' },
    lastActive: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    createdAt: '2024-11-10T09:00:00Z',
  },
  {
    id: 'cnt_102',
    name: 'Elena Rostova',
    phone: '+447700900123',
    email: 'elena@novacrest.co.uk',
    tags: ['Support', 'Urgent'],
    status: 'active',
    source: 'Website Widget',
    totalOrders: 5,
    totalSpent: 1200,
    customAttributes: { company: 'NovaCrest Media', seats: 45, plan: 'Growth' },
    lastActive: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    createdAt: '2024-12-05T14:30:00Z',
  },
  {
    id: 'cnt_103',
    name: 'Marcus Chen',
    phone: '+14158923312',
    email: 'marcus@cloudscale.net',
    tags: ['Billing'],
    status: 'active',
    source: 'API Integration',
    totalOrders: 32,
    totalSpent: 18450,
    customAttributes: { company: 'CloudScale Networks', seats: 1200, plan: 'Enterprise Plus' },
    lastActive: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    createdAt: '2024-08-14T10:15:00Z',
  },
];

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
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
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
    } catch {
      // Fall back to mock numbers if offline
    }
    return MOCK_NUMBERS;
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
      const res = await apiClient.get<WhatsAppTemplate[]>('/templates');
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // Fall back
    }
    return MOCK_TEMPLATES;
  },

  async getConversations(): Promise<Conversation[]> {
    try {
      const res = await apiClient.get<Conversation[]>('/conversations');
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // Fall back
    }
    return MOCK_CONVERSATIONS;
  },

  async getContacts(): Promise<Contact[]> {
    try {
      const res = await apiClient.get<Contact[]>('/contacts');
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // Fall back
    }
    return MOCK_CONTACTS;
  },
};

