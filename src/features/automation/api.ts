import { automationService } from '../../services/automationService';
import type { AutomationRule, CreateAutomationPayload, AutomationLog } from './types';

export const automationsApi = {
  getAutomations: async (params?: {
    search?: string;
    triggerType?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ automations: AutomationRule[]; pagination: any }> => {
    try {
      const res = await automationService.getAutomations(params);
      if (res && Array.isArray(res.automations)) {
        return res;
      }
    } catch (error) {
      console.error('Failed to fetch automations from backend:', error);
    }
    return {
      automations: [],
      pagination: { total: 0, page: 1, limit: 20, pages: 1 },
    };
  },

  getAutomationById: async (id: string): Promise<AutomationRule | undefined> => {
    try {
      const res = await automationService.getAutomationById(id);
      return res || undefined;
    } catch (error) {
      console.error('Failed to fetch automation by ID:', error);
      return undefined;
    }
  },

  createAutomation: async (payload: CreateAutomationPayload): Promise<AutomationRule> => {
    return automationService.createAutomation(payload);
  },

  updateAutomation: async (id: string, payload: Partial<CreateAutomationPayload>): Promise<AutomationRule> => {
    return automationService.updateAutomation(id, payload);
  },

  toggleAutomationStatus: async (id: string): Promise<AutomationRule> => {
    return automationService.toggleAutomationStatus(id);
  },

  deleteAutomation: async (id: string): Promise<boolean> => {
    return automationService.deleteAutomation(id);
  },

  testAutomation: async (id: string, payload: any) => {
    return automationService.testAutomation(id, payload);
  },

  getAutomationLogs: async (params?: any): Promise<{ logs: AutomationLog[]; pagination: any }> => {
    try {
      const res = await automationService.getAutomationLogs(params);
      if (res && Array.isArray(res.logs)) {
        return res;
      }
    } catch (error) {
      console.error('Failed to fetch automation logs from backend:', error);
    }
    return {
      logs: [],
      pagination: { total: 0, page: 1, limit: 20, pages: 1 },
    };
  },
};
