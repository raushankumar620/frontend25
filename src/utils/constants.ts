export const APP_NAME = 'WhatsAppMSG';

export const ROUTES = {
  // Public Marketing Website
  HOME: '/',
  PUBLIC_FEATURES: '/features',
  PUBLIC_PRICING: '/pricing',
  PUBLIC_SOLUTIONS: '/solutions',
  PUBLIC_ABOUT: '/about',
  PUBLIC_CONTACT: '/contact',
  PUBLIC_PRIVACY: '/privacy',
  PUBLIC_TERMS: '/terms',
  PUBLIC_SECURITY: '/security',

  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  ACCEPT_INVITE: '/accept-invite',

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
  AI_TOOLS: '/ai/tools',
  AI_HANDOFF: '/ai/handoff',
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
  DEVELOPERS_BACKEND_SETUP: '/developers/backend-setup',
  DEVELOPERS_DOCS: '/developers/docs',
  
  // Team & Settings
  TEAM: '/team',
  ROLES_PERMISSIONS: '/team/roles',
  NOTIFICATIONS: '/notifications',
  ACCOUNT_SETTINGS: '/settings/account',
  BUSINESS_PROFILE: '/settings/business',
  SECURITY_SETTINGS: '/settings/security',

  // Super Admin Infrastructure
  SUPER_ADMIN_LOGIN: '/super-admin/login',
  SUPER_ADMIN_DASHBOARD: '/super-admin',
  SUPER_ADMIN_TENANTS: '/super-admin/tenants',
  SUPER_ADMIN_USERS: '/super-admin/users',
  SUPER_ADMIN_WHATSAPP: '/super-admin/whatsapp',
  SUPER_ADMIN_MESSAGES: '/super-admin/messages',
  SUPER_ADMIN_WEBHOOKS: '/super-admin/webhooks',
  SUPER_ADMIN_QUEUES: '/super-admin/queues',
  SUPER_ADMIN_AUDIT_LOGS: '/super-admin/audit-logs',
  SUPER_ADMIN_SETTINGS: '/super-admin/settings',
};

export const MESSAGE_STATUS_COLORS: Record<string, string> = {
  sent: 'text-gray-400',
  delivered: 'text-gray-500',
  read: 'text-emerald-500',
  failed: 'text-rose-500',
  pending: 'text-amber-500',
};
