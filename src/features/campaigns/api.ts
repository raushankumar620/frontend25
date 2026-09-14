import { campaignService, type CreateCampaignPayload } from '../../services/campaignService';
import type { Campaign } from './types';

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp_1',
    name: 'Black Friday VIP Early Access Blast',
    templateId: 'tpl_2',
    templateName: 'black_friday_vip_early_access',
    targetAudience: 'VIP & High LTV Customers (1,240)',
    totalRecipients: 1240,
    sentCount: 1240,
    deliveredCount: 1198,
    readCount: 942,
    repliedCount: 312,
    status: 'completed',
    completedAt: '2025-02-12T10:00:00Z',
    createdAt: '2025-02-12T09:00:00Z',
  },
  {
    id: 'cmp_2',
    name: 'Product Update - AI Copilot V2 Announcement',
    templateId: 'tpl_1',
    templateName: 'order_status_update_v2',
    targetAudience: 'Active SaaS Users (850)',
    totalRecipients: 850,
    sentCount: 850,
    deliveredCount: 820,
    readCount: 610,
    repliedCount: 84,
    status: 'completed',
    completedAt: '2025-02-10T14:00:00Z',
    createdAt: '2025-02-10T11:00:00Z',
  },
  {
    id: 'cmp_3',
    name: 'Weekend Flash Promo 20% Off',
    templateId: 'tpl_2',
    templateName: 'black_friday_vip_early_access',
    targetAudience: 'Leads & Inbound Inquiries (2,500)',
    totalRecipients: 2500,
    sentCount: 1450,
    deliveredCount: 1390,
    readCount: 850,
    repliedCount: 120,
    status: 'running',
    createdAt: '2025-02-14T08:30:00Z',
  },
];

export const campaignsApi = {
  getCampaigns: async (params?: { status?: string; search?: string }): Promise<Campaign[]> => {
    try {
      const res = await campaignService.getCampaigns(params);
      if (res.campaigns.length > 0) {
        return res.campaigns;
      }
    } catch {
      // Fallback to mock data if offline
    }
    return MOCK_CAMPAIGNS;
  },

  getCampaignById: async (id: string): Promise<Campaign | undefined> => {
    try {
      const campaign = await campaignService.getCampaignById(id);
      if (campaign) return campaign;
    } catch {
      // Fallback
    }
    return MOCK_CAMPAIGNS.find((c) => c.id === id);
  },

  createCampaign: async (payload: CreateCampaignPayload): Promise<Campaign> => {
    return campaignService.createCampaign(payload);
  },

  startCampaign: async (id: string): Promise<Campaign> => {
    return campaignService.startCampaign(id);
  },

  pauseCampaign: async (id: string): Promise<Campaign> => {
    return campaignService.pauseCampaign(id);
  },

  resumeCampaign: async (id: string): Promise<Campaign> => {
    return campaignService.resumeCampaign(id);
  },

  cancelCampaign: async (id: string): Promise<Campaign> => {
    return campaignService.cancelCampaign(id);
  },

  deleteCampaign: async (id: string): Promise<boolean> => {
    return campaignService.deleteCampaign(id);
  },

  getCampaignRecipients: async (id: string, params?: { status?: string; search?: string; page?: number; limit?: number }) => {
    return campaignService.getCampaignRecipients(id, params);
  },
};
