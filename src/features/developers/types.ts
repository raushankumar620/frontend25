export interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  secretMasked: string;
  lastUsedAt: string;
  createdAt: string;
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  lastPingAt: string;
}

export interface ApiLog {
  id: string;
  method: 'POST' | 'GET' | 'DELETE';
  endpoint: string;
  statusCode: number;
  latencyMs: number;
  timestamp: string;
}
