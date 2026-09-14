import { automationService } from '../../services/automationService';
import type { AutomationRule, CreateAutomationPayload, AutomationLog } from './types';

export const MOCK_AUTOMATIONS: AutomationRule[] = [
  {
    _id: 'auto_mock_1',
    name: 'Pricing & Catalog Inquiries Bot',
    description: 'Auto-replies with product pricing guide and applies "Pricing-Lead" tag when keyword is detected.',
    triggerType: 'KEYWORD',
    triggerConfig: {
      keywords: ['pricing', 'price', 'rates', 'catalog', 'cost'],
      matchType: 'CONTAINS',
      caseSensitive: false,
    },
    actions: [
      {
        type: 'SEND_TEXT',
        payload: {
          text: 'Hello {{name}}! 👋 Thanks for your interest. Here is our official product catalog and pricing: Starter ($29/mo), Pro ($79/mo), Enterprise ($199/mo). Reply DEMO for a 1-on-1 walkthrough.',
        },
      },
      {
        type: 'ADD_TAG',
        payload: { tag: 'Pricing-Lead' },
      },
    ],
    isActive: true,
    priority: 10,
    executionCount: 1420,
    lastExecutedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000).toISOString(),
  },
  {
    _id: 'auto_mock_2',
    name: 'Welcome Greeting for First-Time Customers',
    description: 'Instantly greets new customers on their first message and tags them as "New-Customer".',
    triggerType: 'FIRST_MESSAGE',
    actions: [
      {
        type: 'SEND_TEXT',
        payload: {
          text: 'Welcome to Acme Official Store! 🎉 How can our team assist you today, {{first_name}}?',
        },
      },
      {
        type: 'ADD_TAG',
        payload: { tag: 'New-Customer' },
      },
    ],
    isActive: true,
    priority: 5,
    executionCount: 890,
    lastExecutedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    _id: 'auto_mock_3',
    name: 'Out of Office / Weekend Auto-Responder',
    description: 'Notifies customers that our team is currently offline outside business hours and will respond first thing Monday.',
    triggerType: 'OUT_OF_HOURS',
    triggerConfig: {
      businessHours: {
        timezone: 'Asia/Kolkata',
        schedule: [
          { day: 'saturday', closed: true },
          { day: 'sunday', closed: true },
          { day: 'monday', open: '09:00', close: '18:00', closed: false },
        ],
      },
    },
    actions: [
      {
        type: 'SEND_TEXT',
        payload: {
          text: 'Hi {{first_name}}, our office is currently closed. Our normal support hours are Mon-Fri 9:00 AM to 6:00 PM. We will get back to you shortly!',
        },
      },
    ],
    isActive: true,
    priority: 8,
    executionCount: 312,
    lastExecutedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
  },
];

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
      if (res && Array.isArray(res.automations) && res.automations.length > 0) {
        return res;
      }
    } catch {
      // Fallback to mock
    }
    let filtered = [...MOCK_AUTOMATIONS];
    if (params?.triggerType && params.triggerType !== 'ALL') {
      filtered = filtered.filter((a) => a.triggerType === params.triggerType);
    }
    if (params?.search) {
      filtered = filtered.filter((a) => a.name.toLowerCase().includes(params.search!.toLowerCase()));
    }
    return {
      automations: filtered,
      pagination: { total: filtered.length, page: 1, limit: 20, pages: 1 },
    };
  },

  getAutomationById: async (id: string): Promise<AutomationRule | undefined> => {
    try {
      const res = await automationService.getAutomationById(id);
      if (res) return res;
    } catch {
      // Fallback
    }
    return MOCK_AUTOMATIONS.find((a) => a._id === id);
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
    } catch {
      // Fallback mock
    }
    return {
      logs: [
        {
          _id: 'log_mock_1',
          automationId: 'auto_mock_1',
          automationName: 'Pricing & Catalog Inquiries Bot',
          contactId: {
            _id: 'c_1',
            name: 'Alex Johnson',
            phoneNumber: '+15551234567',
          },
          triggerType: 'KEYWORD',
          matchedTrigger: "Keyword 'pricing' matched with [CONTAINS]",
          executedActions: [
            { actionType: 'SEND_TEXT', status: 'SUCCESS', detail: { text: 'Hello Alex Johnson!...' } },
            { actionType: 'ADD_TAG', status: 'SUCCESS', detail: { addedTag: 'Pricing-Lead' } },
          ],
          status: 'SUCCESS',
          createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        },
      ],
      pagination: { total: 1, page: 1, limit: 20, pages: 1 },
    };
  },
};
