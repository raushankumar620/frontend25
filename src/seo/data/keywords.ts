/**
 * WhatsAppMSG Semantic Keyword Clustering & Categorization
 * Grouped logically for page-specific semantic mapping without keyword stuffing.
 */

export const keywordClusters = {
  primaryBrand: [
    'WhatsAppMSG',
    'whatsappmsg',
    'WhatsApp MSG',
    'whatsapp msg',
    'whatsappmsg.com',
    'WhatsAppMSG platform',
    'WhatsAppMSG Official',
    'WhatsAppMSG API',
    'WhatsAppMSG CRM',
  ],
  brandVariants: [
    'WhatsAppMSG',
    'whatsappmsg',
    'WhatsapMSG',
    'WhatsAppMS',
    'WhatsAppMG',
    'WhatsAppMsg',
    'WhatsApp MSG',
  ],
  corePlatform: [
    'WhatsApp API',
    'WhatsApp Business API',
    'WhatsApp API platform',
    'WhatsApp messaging API',
    'WhatsApp Business messaging platform',
    'WhatsApp messaging platform',
  ],
  automationAndAI: [
    'WhatsApp automation platform',
    'WhatsApp automation software',
    'WhatsApp AI',
    'WhatsApp AI agent',
    'WhatsApp chatbot',
    'WhatsApp customer support',
  ],
  inboxAndCampaigns: [
    'WhatsApp shared inbox',
    'WhatsApp bulk messaging',
    'WhatsApp campaigns',
    'WhatsApp marketing API',
    'WhatsApp CRM',
  ],
  developers: [
    'WhatsApp API for business',
    'WhatsApp API for developers',
    'WhatsApp developer API',
    'WhatsApp API integration',
    'Meta Cloud API direct',
    'WhatsApp webhooks',
  ],
  pricing: [
    'WhatsApp API pricing',
    'WhatsApp Business API pricing',
    'Meta Cloud API pricing',
    'WhatsApp messaging costs',
  ],
} as const;

export const allPrimaryKeywords: string[] = [
  ...keywordClusters.primaryBrand,
  ...keywordClusters.corePlatform,
  ...keywordClusters.automationAndAI,
  ...keywordClusters.inboxAndCampaigns,
  ...keywordClusters.developers,
];
