import { apiClient } from './apiClient';
import type { Campaign } from '../features/campaigns/types';

export interface CreateCampaignPayload {
  name: string;
  phoneNumberId?: string;
  templateId: string;
  templateName: string;
  language?: string;
  audienceFilter?: {
    tags?: string[];
    allContacts?: boolean;
    onlyOptedIn?: boolean;
  };
  variableMapping?: Array<{
    paramIndex: number;
    sourceType: 'contact_field' | 'custom_attribute' | 'static_text';
    sourceField: string;
  }>;
  scheduledAt?: string | null;
  autoStart?: boolean;
}

export interface CampaignRecipientItem {
  id: string;
  campaignId: string;
  contactId: string;
  phoneNumber: string;
  name: string;
  variables: Record<string, string>;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  errorMessage?: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  createdAt: string;
}

function normalizeCampaign(raw: any): Campaign {
  if (!raw) return raw;
  return {
    id: raw.id || raw._id,
    name: raw.name,
    templateId: raw.templateId,
    templateName: raw.templateName || 'WhatsApp Template',
    targetAudience: raw.audienceFilter?.tags?.length
      ? `Tags: ${raw.audienceFilter.tags.join(', ')}`
      : raw.audienceFilter?.allContacts
      ? 'All Contacts'
      : 'Targeted Leads',
    totalRecipients: raw.totalRecipients || 0,
    sentCount: raw.sentCount || 0,
    deliveredCount: raw.deliveredCount || 0,
    readCount: raw.readCount || 0,
    repliedCount: raw.repliedCount || 0,
    status: (raw.status || 'draft').toLowerCase() as any,
    scheduledAt: raw.scheduledAt,
    completedAt: raw.completedAt,
    createdAt: raw.createdAt || new Date().toISOString(),
  };
}

export const campaignService = {
  async getCampaigns(params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ campaigns: Campaign[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'ALL') query.set('status', params.status.toUpperCase());
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));

    const qs = query.toString();
    const endpoint = `/campaigns${qs ? `?${qs}` : ''}`;

    const res = await apiClient.get<any>(endpoint);
    if (res.success && res.data) {
      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.campaigns)
        ? res.data.campaigns
        : [];
      const total = res.data.pagination?.total ?? list.length;
      return {
        campaigns: list.map(normalizeCampaign),
        total,
      };
    }
    return { campaigns: [], total: 0 };
  },

  async getCampaignById(id: string): Promise<Campaign | null> {
    const res = await apiClient.get<any>(`/campaigns/${id}`);
    if (res.success && res.data) {
      return normalizeCampaign(res.data);
    }
    return null;
  },

  async createCampaign(payload: CreateCampaignPayload): Promise<Campaign> {
    const res = await apiClient.post<any>('/campaigns', payload);
    if (res.success && res.data) {
      return normalizeCampaign(res.data);
    }
    throw new Error(res.message || 'Failed to create campaign');
  },

  async startCampaign(id: string): Promise<Campaign> {
    const res = await apiClient.post<any>(`/campaigns/${id}/start`);
    if (res.success && res.data) {
      return normalizeCampaign(res.data);
    }
    throw new Error(res.message || 'Failed to start campaign');
  },

  async pauseCampaign(id: string): Promise<Campaign> {
    const res = await apiClient.post<any>(`/campaigns/${id}/pause`);
    if (res.success && res.data) {
      return normalizeCampaign(res.data);
    }
    throw new Error(res.message || 'Failed to pause campaign');
  },

  async resumeCampaign(id: string): Promise<Campaign> {
    const res = await apiClient.post<any>(`/campaigns/${id}/resume`);
    if (res.success && res.data) {
      return normalizeCampaign(res.data);
    }
    throw new Error(res.message || 'Failed to resume campaign');
  },

  async cancelCampaign(id: string): Promise<Campaign> {
    const res = await apiClient.post<any>(`/campaigns/${id}/cancel`);
    if (res.success && res.data) {
      return normalizeCampaign(res.data);
    }
    throw new Error(res.message || 'Failed to cancel campaign');
  },

  async deleteCampaign(id: string): Promise<boolean> {
    const res = await apiClient.delete<any>(`/campaigns/${id}`);
    return !!res.success;
  },

  async getCampaignRecipients(
    id: string,
    params?: { status?: string; search?: string; page?: number; limit?: number }
  ): Promise<{ recipients: CampaignRecipientItem[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'ALL') query.set('status', params.status.toUpperCase());
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));

    const qs = query.toString();
    const endpoint = `/campaigns/${id}/recipients${qs ? `?${qs}` : ''}`;

    const res = await apiClient.get<any>(endpoint);
    if (res.success && res.data) {
      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.recipients)
        ? res.data.recipients
        : [];
      const total = res.data.pagination?.total ?? list.length;
      return {
        recipients: list.map((r: any) => ({
          id: r.id || r._id,
          campaignId: r.campaignId,
          contactId: r.contactId,
          phoneNumber: r.phoneNumber,
          name: r.name,
          variables: r.variables || {},
          status: r.status,
          errorMessage: r.errorMessage,
          sentAt: r.sentAt,
          deliveredAt: r.deliveredAt,
          readAt: r.readAt,
          createdAt: r.createdAt,
        })),
        total,
      };
    }
    return { recipients: [], total: 0 };
  },
};
