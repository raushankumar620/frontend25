import type { ApiKeyItem, WebhookEndpoint, ApiLog } from './types';

export const MOCK_KEYS: ApiKeyItem[] = [
  {
    id: 'key_1',
    name: 'Production Server Backend Key',
    keyPrefix: 'cf_live_',
    secretMasked: 'cf_live_98a7s6d••••••••••••••',
    lastUsedAt: '2m ago',
    createdAt: '2025-01-10T12:00:00Z',
  },
  {
    id: 'key_2',
    name: 'Staging & QA Key',
    keyPrefix: 'cf_test_',
    secretMasked: 'cf_test_12o98u3••••••••••••••',
    lastUsedAt: '4d ago',
    createdAt: '2025-01-15T09:00:00Z',
  },
];

export const MOCK_WEBHOOKS: WebhookEndpoint[] = [
  {
    id: 'wh_1',
    url: 'https://backend.acmeglobal.com/webhooks/whatsapp-events',
    events: ['messages.upsert', 'messages.status', 'template.status_update'],
    status: 'active',
    lastPingAt: 'Just now (200 OK)',
  },
];

export const MOCK_LOGS: ApiLog[] = [
  { id: 'log_1', method: 'POST', endpoint: '/v1/messages/send-template', statusCode: 200, latencyMs: 142, timestamp: '12:14:02' },
  { id: 'log_2', method: 'POST', endpoint: '/v1/messages/send-template', statusCode: 200, latencyMs: 128, timestamp: '12:13:58' },
  { id: 'log_3', method: 'GET', endpoint: '/v1/contacts/+15552345678', statusCode: 200, latencyMs: 45, timestamp: '12:12:10' },
  { id: 'log_4', method: 'POST', endpoint: '/v1/messages/send-text', statusCode: 200, latencyMs: 89, timestamp: '12:10:44' },
];

export const developersApi = {
  getApiKeys: async (): Promise<ApiKeyItem[]> => MOCK_KEYS,
  getWebhooks: async (): Promise<WebhookEndpoint[]> => MOCK_WEBHOOKS,
  getLogs: async (): Promise<ApiLog[]> => MOCK_LOGS,
};
