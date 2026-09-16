import { apiClient } from '../../../services/apiClient';
import type {
  AdminOverviewResponse,
  SystemHealth,
  Tenant,
  TenantDetails,
  QueuesResponse,
  QueueItem,
  AuditLogItem,
  AdminUsersResponse,
  AdminUser360,
  AdminUserItem,
  WabaAccountItem,
  WhatsAppNumberItem,
  WhatsAppDebuggerReport,
  AdminMessagesResponse,
  AdminMessageItem,
  MessageTraceReport,
  WebhooksSummaryReport,
  CustomerWebhookItem,
  WebhookDeliveryLogItem,
  OmniSearchResult,
} from '../types/admin.types';

export interface TenantQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  plan?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AuditLogQueryParams {
  page?: number;
  limit?: number;
  action?: string;
  search?: string;
  organizationId?: string;
  startDate?: string;
  endDate?: string;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean | string;
  organizationId?: string;
}

export interface MessageQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  direction?: string;
  organizationId?: string;
  phoneNumberId?: string;
  startDate?: string;
  endDate?: string;
}

export const superAdminService = {
  async getOverview(): Promise<AdminOverviewResponse> {
    const res = await apiClient.get<AdminOverviewResponse>('/admin/overview');
    return res.data;
  },

  async getHealth(): Promise<SystemHealth> {
    const res = await apiClient.get<SystemHealth>('/admin/health');
    return res.data;
  },

  // --- Tenants ---
  async getTenants(params: TenantQueryParams = {}): Promise<{
    tenants: Tenant[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    if (params.plan && params.plan !== 'ALL') query.append('plan', params.plan);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);

    const queryString = query.toString();
    const endpoint = `/admin/tenants${queryString ? `?${queryString}` : ''}`;
    const res = await apiClient.get<{
      tenants: Tenant[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>(endpoint);
    return res.data;
  },

  async getTenantById(id: string): Promise<TenantDetails> {
    const res = await apiClient.get<TenantDetails>(`/admin/tenants/${id}`);
    return res.data;
  },

  async updateTenantStatus(id: string, status: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED', reason?: string): Promise<Tenant> {
    const res = await apiClient.patch<Tenant>(`/admin/tenants/${id}/status`, { status, reason });
    return res.data;
  },

  async updateTenantPlan(
    id: string,
    data: {
      plan: string;
      limits?: { maxNumbers?: number; maxTeamMembers?: number; monthlyMessages?: number };
      customQuota?: { aiTokensLimit?: number; campaignsLimit?: number; contactsLimit?: number };
    }
  ): Promise<Tenant> {
    const res = await apiClient.patch<Tenant>(`/admin/tenants/${id}/plan`, data);
    return res.data;
  },

  // --- Users ---
  async getUsers(params: UserQueryParams = {}): Promise<AdminUsersResponse> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    if (params.search) query.append('search', params.search);
    if (params.role && params.role !== 'ALL') query.append('role', params.role);
    if (params.isActive !== undefined && params.isActive !== 'ALL') query.append('isActive', String(params.isActive));
    if (params.organizationId) query.append('organizationId', params.organizationId);

    const queryString = query.toString();
    const endpoint = `/admin/users${queryString ? `?${queryString}` : ''}`;
    const res = await apiClient.get<AdminUsersResponse>(endpoint);
    return res.data;
  },

  async getUserById(id: string): Promise<AdminUser360> {
    const res = await apiClient.get<AdminUser360>(`/admin/users/${id}`);
    return res.data;
  },

  async updateUserStatus(id: string, isActive: boolean): Promise<AdminUserItem> {
    const res = await apiClient.patch<AdminUserItem>(`/admin/users/${id}/status`, { isActive });
    return res.data;
  },

  async revokeUserSessions(id: string): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.post<{ success: boolean; message: string }>(`/admin/users/${id}/revoke-sessions`);
    return res.data;
  },

  // --- WhatsApp & Debugger ---
  async getWhatsAppAccounts(params: { page?: number; limit?: number; search?: string; status?: string } = {}): Promise<{
    accounts: WabaAccountItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'ALL') query.append('status', params.status);

    const queryString = query.toString();
    const endpoint = `/admin/whatsapp/accounts${queryString ? `?${queryString}` : ''}`;
    const res = await apiClient.get<{
      accounts: WabaAccountItem[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>(endpoint);
    return res.data;
  },

  async getWhatsAppNumbers(params: { page?: number; limit?: number; search?: string; status?: string } = {}): Promise<{
    numbers: WhatsAppNumberItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'ALL') query.append('status', params.status);

    const queryString = query.toString();
    const endpoint = `/admin/whatsapp/numbers${queryString ? `?${queryString}` : ''}`;
    const res = await apiClient.get<{
      numbers: WhatsAppNumberItem[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>(endpoint);
    return res.data;
  },

  async debugWhatsAppNumber(numberId: string): Promise<WhatsAppDebuggerReport> {
    const res = await apiClient.get<WhatsAppDebuggerReport>(`/admin/whatsapp/numbers/${numberId}/debugger`);
    return res.data;
  },

  // --- Messages & Lifecycle Trace ---
  async getMessages(params: MessageQueryParams = {}): Promise<AdminMessagesResponse> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    if (params.direction && params.direction !== 'ALL') query.append('direction', params.direction);
    if (params.organizationId) query.append('organizationId', params.organizationId);
    if (params.phoneNumberId) query.append('phoneNumberId', params.phoneNumberId);
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);

    const queryString = query.toString();
    const endpoint = `/admin/messages${queryString ? `?${queryString}` : ''}`;
    const res = await apiClient.get<AdminMessagesResponse>(endpoint);
    return res.data;
  },

  async getFailedMessages(params: { page?: number; limit?: number; errorCode?: string } = {}): Promise<{
    errorBreakdown: Array<{ _id: string; count: number }>;
    failedMessages: AdminMessageItem[];
    totalFailed: number;
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    if (params.errorCode && params.errorCode !== 'ALL') query.append('errorCode', params.errorCode);

    const queryString = query.toString();
    const endpoint = `/admin/messages/failed${queryString ? `?${queryString}` : ''}`;
    const res = await apiClient.get<{
      errorBreakdown: Array<{ _id: string; count: number }>;
      failedMessages: AdminMessageItem[];
      totalFailed: number;
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>(endpoint);
    return res.data;
  },

  async getMessageTrace(messageId: string): Promise<MessageTraceReport> {
    const res = await apiClient.get<MessageTraceReport>(`/admin/messages/${messageId}/trace`);
    return res.data;
  },

  // --- Webhooks & Deliveries ---
  async getWebhooksSummary(): Promise<WebhooksSummaryReport> {
    const res = await apiClient.get<WebhooksSummaryReport>('/admin/webhooks/summary');
    return res.data;
  },

  async getCustomerWebhooks(params: { page?: number; limit?: number; search?: string } = {}): Promise<{
    webhooks: CustomerWebhookItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    if (params.search) query.append('search', params.search);

    const queryString = query.toString();
    const endpoint = `/admin/webhooks/customer${queryString ? `?${queryString}` : ''}`;
    const res = await apiClient.get<{
      webhooks: CustomerWebhookItem[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>(endpoint);
    return res.data;
  },

  async getWebhookDeliveries(params: { page?: number; limit?: number; status?: string; event?: string } = {}): Promise<{
    deliveries: WebhookDeliveryLogItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    if (params.event && params.event !== 'ALL') query.append('event', params.event);

    const queryString = query.toString();
    const endpoint = `/admin/webhooks/deliveries${queryString ? `?${queryString}` : ''}`;
    const res = await apiClient.get<{
      deliveries: WebhookDeliveryLogItem[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>(endpoint);
    return res.data;
  },

  // --- Omni Search ---
  async omniSearch(q: string): Promise<OmniSearchResult> {
    const res = await apiClient.get<OmniSearchResult>(`/admin/search?q=${encodeURIComponent(q)}`);
    return res.data;
  },

  // --- Queues & Logs ---
  async getQueues(): Promise<QueuesResponse> {
    const res = await apiClient.get<QueuesResponse>('/admin/queues');
    return res.data;
  },

  async executeQueueAction(
    queueName: string,
    action: 'pause' | 'resume' | 'retry-failed' | 'clean'
  ): Promise<QueueItem> {
    const res = await apiClient.post<QueueItem>(`/admin/queues/${queueName}/action`, { action });
    return res.data;
  },

  async getAuditLogs(params: AuditLogQueryParams = {}): Promise<{
    logs: AuditLogItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    if (params.action) query.append('action', params.action);
    if (params.search) query.append('search', params.search);
    if (params.organizationId) query.append('organizationId', params.organizationId);
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);

    const queryString = query.toString();
    const endpoint = `/admin/audit-logs${queryString ? `?${queryString}` : ''}`;
    const res = await apiClient.get<{
      logs: AuditLogItem[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>(endpoint);
    return res.data;
  },

  async impersonateTenant(tenantId: string): Promise<{
    organization: any;
    impersonation: { active: boolean; originalAdminEmail: string; targetOrgName: string; targetOrgId: string };
    accessToken: string;
    refreshToken: string;
  }> {
    const res = await apiClient.post<{
      organization: any;
      impersonation: { active: boolean; originalAdminEmail: string; targetOrgName: string; targetOrgId: string };
      accessToken: string;
      refreshToken: string;
    }>(`/admin/impersonate/${tenantId}`);
    return res.data;
  },
};

