import type { Campaign } from './types';

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp_1',
    name: 'Spring VIP Exclusive 40% OFF',
    templateId: 'tpl_2',
    templateName: 'black_friday_vip_early_access',
    targetAudience: 'VIP Tagged Contacts (14,280)',
    totalRecipients: 14280,
    sentCount: 14280,
    deliveredCount: 14120,
    readCount: 11890,
    repliedCount: 2310,
    status: 'completed',
    completedAt: '2025-02-12T18:00:00Z',
    createdAt: '2025-02-12T08:00:00Z',
  },
  {
    id: 'cmp_2',
    name: 'Product Update & Feature Announcement',
    templateId: 'tpl_1',
    templateName: 'order_status_update_v2',
    targetAudience: 'All Active Users (30,500)',
    totalRecipients: 30500,
    sentCount: 18200,
    deliveredCount: 17990,
    readCount: 13400,
    repliedCount: 940,
    status: 'running',
    createdAt: '2025-02-14T10:00:00Z',
  },
];

export const campaignsApi = {
  getCampaigns: async (): Promise<Campaign[]> => {
    return MOCK_CAMPAIGNS;
  },
  getCampaignById: async (id: string): Promise<Campaign | undefined> => {
    return MOCK_CAMPAIGNS.find((c) => c.id === id);
  },
  createCampaign: async (data: Partial<Campaign>): Promise<Campaign> => {
    await new Promise((res) => setTimeout(res, 600));
    return {
      id: 'cmp_' + Date.now(),
      name: data.name || 'New Campaign',
      templateId: data.templateId || 'tpl_1',
      templateName: data.templateName || 'Template',
      targetAudience: data.targetAudience || 'Selected Segment',
      totalRecipients: data.totalRecipients || 1000,
      sentCount: 0,
      deliveredCount: 0,
      readCount: 0,
      repliedCount: 0,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };
  },
};
