import { apiClient } from './apiClient';
import type { Contact } from '../types/contact';

export interface ContactsFilter {
  search?: string;
  tag?: string;
  optInStatus?: string;
  isSubscribed?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateContactPayload {
  phoneNumber: string;
  name?: string;
  email?: string;
  tags?: string[];
  customAttributes?: Record<string, any>;
  optInStatus?: 'OPTED_IN' | 'OPTED_OUT' | 'UNKNOWN';
}

export const contactService = {
  async listContacts(query: ContactsFilter = {}): Promise<{
    contacts: Contact[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const params = new URLSearchParams();
    if (query.search) params.append('search', query.search);
    if (query.tag) params.append('tag', query.tag);
    if (query.optInStatus) params.append('optInStatus', query.optInStatus);
    if (query.isSubscribed !== undefined) params.append('isSubscribed', String(query.isSubscribed));
    if (query.page) params.append('page', String(query.page));
    if (query.limit) params.append('limit', String(query.limit));

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await apiClient.get<any>(`/contacts${queryString}`);

    if (res.success && res.data) {
      const rawList = res.data.contacts || [];
      const transformed: Contact[] = rawList.map((c: any) => ({
        id: c._id || c.id,
        name: c.name || 'Unnamed Contact',
        phone: c.phoneNumber,
        email: c.email || '',
        tags: c.tags || [],
        status: c.isSubscribed ? 'active' : 'opted_out',
        source: c.source || 'Inbound WhatsApp',
        totalOrders: c.totalOrders || 0,
        totalSpent: c.totalSpent || 0,
        customAttributes: c.customAttributes || {},
        lastActive: c.lastActive || c.updatedAt || new Date().toISOString(),
        createdAt: c.createdAt || new Date().toISOString(),
      }));

      return {
        contacts: transformed,
        pagination: res.data.pagination || {
          total: transformed.length,
          page: 1,
          limit: 30,
          totalPages: 1,
        },
      };
    }

    return {
      contacts: [],
      pagination: { total: 0, page: 1, limit: 30, totalPages: 0 },
    };
  },

  async getContactById(id: string): Promise<Contact & { conversation?: any; totalMessagesCount?: number }> {
    const res = await apiClient.get<any>(`/contacts/${id}`);
    if (res.success && res.data) {
      const c = res.data;
      return {
        id: c._id || c.id,
        name: c.name || 'Unnamed Contact',
        phone: c.phoneNumber,
        email: c.email || '',
        tags: c.tags || [],
        status: c.isSubscribed ? 'active' : 'opted_out',
        source: c.source || 'Inbound WhatsApp',
        totalOrders: c.totalOrders || 0,
        totalSpent: c.totalSpent || 0,
        customAttributes: c.customAttributes || {},
        lastActive: c.lastActive || c.updatedAt || new Date().toISOString(),
        createdAt: c.createdAt || new Date().toISOString(),
        conversation: c.conversation,
        totalMessagesCount: c.totalMessagesCount || 0,
      };
    }
    throw new Error(res.message || 'Failed to fetch contact details');
  },

  async createContact(payload: CreateContactPayload): Promise<Contact> {
    const res = await apiClient.post<any>('/contacts', payload);
    if (res.success && res.data) {
      const c = res.data;
      return {
        id: c._id || c.id,
        name: c.name || '',
        phone: c.phoneNumber,
        email: c.email || '',
        tags: c.tags || [],
        status: c.isSubscribed ? 'active' : 'opted_out',
        source: c.source || 'Manual',
        totalOrders: c.totalOrders || 0,
        totalSpent: c.totalSpent || 0,
        customAttributes: c.customAttributes || {},
        lastActive: c.lastActive || new Date().toISOString(),
        createdAt: c.createdAt || new Date().toISOString(),
      };
    }
    throw new Error(res.message || 'Failed to create contact');
  },

  async updateContact(id: string, payload: Partial<CreateContactPayload>): Promise<Contact> {
    const res = await apiClient.patch<any>(`/contacts/${id}`, payload);
    if (res.success && res.data) {
      const c = res.data;
      return {
        id: c._id || c.id,
        name: c.name || '',
        phone: c.phoneNumber,
        email: c.email || '',
        tags: c.tags || [],
        status: c.isSubscribed ? 'active' : 'opted_out',
        source: c.source || 'Manual',
        totalOrders: c.totalOrders || 0,
        totalSpent: c.totalSpent || 0,
        customAttributes: c.customAttributes || {},
        lastActive: c.lastActive || new Date().toISOString(),
        createdAt: c.createdAt || new Date().toISOString(),
      };
    }
    throw new Error(res.message || 'Failed to update contact');
  },

  async deleteContact(id: string): Promise<void> {
    const res = await apiClient.delete(`/contacts/${id}`);
    if (!res.success) {
      throw new Error(res.message || 'Failed to delete contact');
    }
  },

  async bulkImport(contacts: any[], duplicateStrategy = 'update', defaultTags: string[] = []): Promise<any> {
    const res = await apiClient.post<any>('/contacts/bulk-import', {
      contacts,
      duplicateStrategy,
      defaultTags,
    });
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Bulk import failed');
  },

  async exportContacts(): Promise<any[]> {
    const res = await apiClient.get<any[]>('/contacts/export');
    if (res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  },

  async toggleOptStatus(id: string, optInStatus: 'OPTED_IN' | 'OPTED_OUT'): Promise<void> {
    const res = await apiClient.post(`/contacts/${id}/opt-status`, { optInStatus });
    if (!res.success) {
      throw new Error(res.message || 'Failed to update opt-in status');
    }
  },

  async getTagsSummary(): Promise<{ tag: string; count: number }[]> {
    const res = await apiClient.get<any[]>('/contacts/tags/summary');
    if (res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  },
};
