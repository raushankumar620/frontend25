import { campaignService, type CreateCampaignPayload } from '../../services/campaignService';
import type { Campaign } from './types';

export const campaignsApi = {
  getCampaigns: async (params?: { status?: string; search?: string }): Promise<Campaign[]> => {
    try {
      const res = await campaignService.getCampaigns(params);
      return res.campaigns || [];
    } catch (error) {
      console.error('Failed to fetch campaigns from backend:', error);
      return [];
    }
  },

  getCampaignById: async (id: string): Promise<Campaign | undefined> => {
    try {
      const campaign = await campaignService.getCampaignById(id);
      return campaign || undefined;
    } catch (error) {
      console.error('Failed to fetch campaign by ID:', error);
      return undefined;
    }
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
