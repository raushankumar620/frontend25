export type WhatsAppStatus = 'connected' | 'disconnected' | 'pending' | 'flagged';
export type QualityRating = 'GREEN' | 'YELLOW' | 'RED' | 'UNKNOWN';

export interface WhatsAppPhoneNumber {
  id: string;
  phoneNumber: string;
  verifiedName: string;
  displayPhoneNumber: string;
  qualityRating: QualityRating;
  messagingLimit: string;
  status: WhatsAppStatus;
  wabaId: string;
  certificate?: string;
  webhookUrl?: string;
  lastSyncAt: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  language: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'PAUSED';
  header?: {
    type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
    text?: string;
    mediaUrl?: string;
  };
  body: string;
  footer?: string;
  buttons?: Array<{
    type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
    text: string;
    url?: string;
    phoneNumber?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
