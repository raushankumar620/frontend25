export const APP_NAME = 'WhatsAppMsg';

export const ROUTES = {
  // Public Marketing Website
  HOME: '/',
  PUBLIC_FEATURES: '/features',
  PUBLIC_PRICING: '/pricing',
  PUBLIC_SOLUTIONS: '/solutions',
  PUBLIC_ABOUT: '/about',
  PUBLIC_CONTACT: '/contact',

  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Core App & Dashboard
  DASHBOARD: '/app',
  INBOX: '/inbox',
  CONTACTS: '/contacts',
  CONTACT_DETAILS: '/contacts/:id',
  
  // WhatsApp
  WHATSAPP_NUMBERS: '/whatsapp/numbers',
  CONNECT_WHATSAPP: '/whatsapp/connect',
  WHATSAPP_DETAILS: '/whatsapp/numbers/:id',
  
  // Templates
  TEMPLATES: '/templates',
  CREATE_TEMPLATE: '/templates/create',
  TEMPLATE_DETAILS: '/templates/:id',
  
  // Campaigns
  CAMPAIGNS: '/campaigns',
  CREATE_CAMPAIGN: '/campaigns/create',
  CAMPAIGN_DETAILS: '/campaigns/:id',
  
  // Automation
  AUTOMATIONS: '/automations',
  CREATE_AUTOMATION: '/automations/create',
  
  // AI
  AI_DASHBOARD: '/ai',
  AI_AGENT: '/ai/agent',
  AI_KNOWLEDGE_BASE: '/ai/knowledge-base',
  AI_SETTINGS: '/ai/settings',
  
  // Analytics
  ANALYTICS: '/analytics',
  
  // Billing
  BILLING: '/billing',
  BILLING_PLANS: '/billing/plans',
  BILLING_INVOICES: '/billing/invoices',
  
  // Developers
  DEVELOPERS_DASHBOARD: '/developers',
  DEVELOPERS_API_KEYS: '/developers/api-keys',
  DEVELOPERS_WEBHOOKS: '/developers/webhooks',
  DEVELOPERS_API_LOGS: '/developers/logs',
  DEVELOPERS_DOCS: '/developers/docs',
  
  // Team & Settings
  TEAM: '/team',
  ROLES_PERMISSIONS: '/team/roles',
  ACCOUNT_SETTINGS: '/settings/account',
  BUSINESS_PROFILE: '/settings/business',
  SECURITY_SETTINGS: '/settings/security',
};

export const MESSAGE_STATUS_COLORS: Record<string, string> = {
  sent: 'text-gray-400',
  delivered: 'text-gray-500',
  read: 'text-emerald-500',
  failed: 'text-rose-500',
  pending: 'text-amber-500',
};
