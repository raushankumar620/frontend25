export type ApiScope =
  | '*'
  | 'messages:write'
  | 'messages:read'
  | 'contacts:write'
  | 'contacts:read'
  | 'templates:read'
  | 'campaigns:write'
  | 'campaigns:read'
  | 'automations:read'
  | 'automations:write'
  | 'webhooks:manage';

export interface ApiKeyItem {
  id?: string;
  _id: string;
  name: string;
  keyPrefix: string;
  last4: string;
  secretMasked: string;
  scopes: ApiScope[];
  rateLimit: number;
  ipWhitelist?: string[];
  expiresAt?: string | null;
  isActive: boolean;
  usageCount: number;
  lastUsedAt?: string | null;
  lastUsedIp?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateApiKeyPayload {
  name: string;
  environment?: 'live' | 'test';
  scopes?: ApiScope[];
  rateLimit?: number;
  ipWhitelist?: string[];
  expiresAt?: string;
}

export interface CreateApiKeyResponse {
  apiKey: ApiKeyItem;
  rawSecret: string;
}

export interface RollApiKeyResponse {
  apiKey: ApiKeyItem;
  rawSecret: string;
}

export type WebhookEvent =
  | '*'
  | 'messages.inbound'
  | 'messages.status'
  | 'contacts.created'
  | 'contacts.updated'
  | 'templates.status_update'
  | 'automations.executed'
  | 'campaigns.completed'
  | 'webhook.test_ping';

export interface WebhookEndpoint {
  id?: string;
  _id: string;
  url: string;
  description?: string;
  secret?: string;
  secretMasked?: string;
  events: WebhookEvent[];
  isActive: boolean;
  status: 'ACTIVE' | 'PAUSED' | 'DISABLED_FAILURES';
  consecutiveFailures: number;
  lastSuccessAt?: string | null;
  lastFailureAt?: string | null;
  lastFailureReason?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateWebhookPayload {
  url: string;
  description?: string;
  secret?: string;
  events?: WebhookEvent[];
  isActive?: boolean;
}

export interface WebhookDeliveryLog {
  id?: string;
  _id: string;
  webhookId: string;
  event: string;
  targetUrl: string;
  requestHeaders?: Record<string, string>;
  requestPayload?: any;
  responseStatusCode: number;
  responseBody?: string;
  latencyMs: number;
  attemptCount: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING_RETRY';
  errorMessage?: string | null;
  createdAt: string;
}

export interface TestPingResponse {
  success: boolean;
  statusCode: number;
  latencyMs: number;
  responseBody?: string;
  errorMessage?: string;
  deliveryId: string;
  signature: string;
}

export interface ApiLog {
  id?: string;
  _id: string;
  apiKeyId?: string | null;
  keyName?: string;
  method: string;
  endpoint: string;
  statusCode: number;
  latencyMs: number;
  ipAddress?: string;
  userAgent?: string;
  errorMessage?: string | null;
  createdAt: string;
}

export interface ApiMetrics {
  totalKeys: number;
  activeKeys: number;
  totalRequests24h: number;
  successfulRequests24h: number;
  errorRequests24h: number;
  avgLatencyMs: number;
  errorRatePercent: number;
}
