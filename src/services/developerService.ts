import { apiClient } from './apiClient';
import type {
  ApiKeyItem,
  CreateApiKeyPayload,
  CreateApiKeyResponse,
  RollApiKeyResponse,
  ApiLog,
  ApiMetrics,
  WebhookEndpoint,
  CreateWebhookPayload,
  WebhookDeliveryLog,
  TestPingResponse,
} from '../features/developers/types';

export interface ApiLogsResponse {
  logs: ApiLog[];
  totalCount: number;
  page: number;
  totalPages: number;
}

export interface WebhookDeliveriesResponse {
  deliveries: WebhookDeliveryLog[];
  totalCount: number;
  page: number;
  totalPages: number;
}

export const developerService = {
  // API Keys
  getApiKeys: async (): Promise<ApiKeyItem[]> => {
    const res = await apiClient.get<ApiKeyItem[]>('/developer/keys');
    return res.data || [];
  },

  getApiKeyById: async (id: string): Promise<ApiKeyItem> => {
    const res = await apiClient.get<ApiKeyItem>(`/developer/keys/${id}`);
    return res.data;
  },

  createApiKey: async (payload: CreateApiKeyPayload): Promise<CreateApiKeyResponse> => {
    const res = await apiClient.post<CreateApiKeyResponse>('/developer/keys', payload);
    return res.data;
  },

  updateApiKey: async (id: string, payload: Partial<CreateApiKeyPayload> & { isActive?: boolean }): Promise<ApiKeyItem> => {
    const res = await apiClient.patch<ApiKeyItem>(`/developer/keys/${id}`, payload);
    return res.data;
  },

  revokeApiKey: async (id: string): Promise<{ message: string }> => {
    const res = await apiClient.delete<{ message: string }>(`/developer/keys/${id}`);
    return res.data;
  },

  rollApiKey: async (id: string): Promise<RollApiKeyResponse> => {
    const res = await apiClient.post<RollApiKeyResponse>(`/developer/keys/${id}/roll`, {});
    return res.data;
  },

  getApiLogs: async (params?: { apiKeyId?: string; method?: string; statusCode?: number; page?: number; limit?: number }): Promise<ApiLogsResponse> => {
    const query = new URLSearchParams();
    if (params?.apiKeyId) query.append('apiKeyId', params.apiKeyId);
    if (params?.method) query.append('method', params.method);
    if (params?.statusCode) query.append('statusCode', String(params.statusCode));
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const res = await apiClient.get<ApiLogsResponse>(`/developer/logs?${query.toString()}`);
    return res.data || { logs: [], totalCount: 0, page: 1, totalPages: 1 };
  },

  getApiMetrics: async (): Promise<ApiMetrics> => {
    const res = await apiClient.get<ApiMetrics>('/developer/metrics');
    return res.data || {
      totalKeys: 0,
      activeKeys: 0,
      totalRequests24h: 0,
      successfulRequests24h: 0,
      errorRequests24h: 0,
      avgLatencyMs: 0,
      errorRatePercent: 0,
    };
  },

  // Outbound Webhook Subscriptions (Phase 11)
  getWebhooks: async (): Promise<WebhookEndpoint[]> => {
    const res = await apiClient.get<WebhookEndpoint[]>('/webhooks/subscriptions');
    return res.data || [];
  },

  getWebhookById: async (id: string): Promise<WebhookEndpoint> => {
    const res = await apiClient.get<WebhookEndpoint>(`/webhooks/subscriptions/${id}`);
    return res.data;
  },

  createWebhook: async (payload: CreateWebhookPayload): Promise<WebhookEndpoint> => {
    const res = await apiClient.post<WebhookEndpoint>('/webhooks/subscriptions', payload);
    return res.data;
  },

  updateWebhook: async (id: string, payload: Partial<CreateWebhookPayload> & { isActive?: boolean }): Promise<WebhookEndpoint> => {
    const res = await apiClient.patch<WebhookEndpoint>(`/webhooks/subscriptions/${id}`, payload);
    return res.data;
  },

  deleteWebhook: async (id: string): Promise<{ message: string }> => {
    const res = await apiClient.delete<{ message: string }>(`/webhooks/subscriptions/${id}`);
    return res.data;
  },

  sendTestPing: async (id: string): Promise<TestPingResponse> => {
    const res = await apiClient.post<TestPingResponse>(`/webhooks/subscriptions/${id}/test`, {});
    return res.data;
  },

  getWebhookDeliveries: async (params?: { webhookId?: string; event?: string; status?: string; page?: number; limit?: number }): Promise<WebhookDeliveriesResponse> => {
    const query = new URLSearchParams();
    if (params?.webhookId) query.append('webhookId', params.webhookId);
    if (params?.event) query.append('event', params.event);
    if (params?.status) query.append('status', params.status);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const res = await apiClient.get<WebhookDeliveriesResponse>(`/webhooks/deliveries?${query.toString()}`);
    return res.data || { deliveries: [], totalCount: 0, page: 1, totalPages: 1 };
  },

  replayDelivery: async (deliveryId: string): Promise<TestPingResponse> => {
    const res = await apiClient.post<TestPingResponse>(`/webhooks/deliveries/${deliveryId}/retry`, {});
    return res.data;
  },
};
