import { apiClient } from './apiClient';
import type { AutomationRule, AutomationLog, CreateAutomationPayload } from '../features/automation/types';

export interface AutomationsListResponse {
  automations: AutomationRule[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface AutomationLogsResponse {
  logs: AutomationLog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export const automationService = {
  getAutomations: async (params?: {
    search?: string;
    triggerType?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<AutomationsListResponse> => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.triggerType && params.triggerType !== 'ALL') query.append('triggerType', params.triggerType);
    if (params?.isActive !== undefined) query.append('isActive', String(params.isActive));
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const res = await apiClient.get<AutomationsListResponse>(`/automations?${query.toString()}`);
    return res.data;
  },

  getAutomationById: async (id: string): Promise<AutomationRule> => {
    const res = await apiClient.get<AutomationRule>(`/automations/${id}`);
    return res.data;
  },

  createAutomation: async (payload: CreateAutomationPayload): Promise<AutomationRule> => {
    const res = await apiClient.post<AutomationRule>('/automations', payload);
    return res.data;
  },

  updateAutomation: async (id: string, payload: Partial<CreateAutomationPayload>): Promise<AutomationRule> => {
    const res = await apiClient.put<AutomationRule>(`/automations/${id}`, payload);
    return res.data;
  },

  toggleAutomationStatus: async (id: string): Promise<AutomationRule> => {
    const res = await apiClient.patch<AutomationRule>(`/automations/${id}/toggle`, {});
    return res.data;
  },

  deleteAutomation: async (id: string): Promise<boolean> => {
    await apiClient.delete(`/automations/${id}`);
    return true;
  },

  testAutomation: async (id: string, samplePayload: {
    messageText?: string;
    messageType?: string;
    contact?: { name?: string; phoneNumber?: string; tags?: string[] };
    isNewConversation?: boolean;
  }): Promise<{
    willTrigger: boolean;
    triggerResult: { matched: boolean; matchedTrigger?: string };
    conditionsPassed: boolean;
    predictedActions: Array<{ action: string; renderedText?: string; payload?: any }>;
  }> => {
    const res = await apiClient.post<any>(`/automations/${id}/test`, samplePayload);
    return res.data;
  },

  getAutomationLogs: async (params?: {
    page?: number;
    limit?: number;
    automationId?: string;
    status?: string;
  }): Promise<AutomationLogsResponse> => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.automationId) query.append('automationId', params.automationId);
    if (params?.status && params.status !== 'ALL') query.append('status', params.status);

    const res = await apiClient.get<AutomationLogsResponse>(`/automations/logs?${query.toString()}`);
    return res.data;
  },
};
