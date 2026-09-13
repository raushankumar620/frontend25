export type CampaignStatus = 'draft' | 'scheduled' | 'running' | 'completed' | 'paused';

export interface Campaign {
  id: string;
  name: string;
  templateId: string;
  templateName: string;
  targetAudience: string;
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  repliedCount: number;
  status: CampaignStatus;
  scheduledAt?: string;
  completedAt?: string;
  createdAt: string;
}
