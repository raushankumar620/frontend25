import type { AutomationWorkflow } from './types';

export const MOCK_AUTOMATIONS: AutomationWorkflow[] = [
  {
    id: 'wf_1',
    name: 'Welcome New Lead & AI Qualification',
    description: 'When new WhatsApp contact messages, send greeting and qualify interest with AI Agent',
    isActive: true,
    triggersCount: 1420,
    executionsCount: 1390,
    updatedAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    nodes: [
      { id: 'n1', type: 'trigger', title: 'Inbound Message Received', config: { event: 'messages.incoming' } },
      { id: 'n2', type: 'condition', title: 'Contact is New Lead?', config: { condition: 'orders == 0' } },
      { id: 'n3', type: 'ai_agent', title: 'Sales AI Qualifier', config: { agentId: 'ag_1' } },
      { id: 'n4', type: 'action', title: 'Apply Tag "Lead - Qualified"', config: { tag: 'Lead' } },
    ],
  },
  {
    id: 'wf_2',
    name: 'Abandoned Cart WhatsApp Recovery',
    description: 'Trigger 1 hour after cart abandonment with 10% discount code',
    isActive: true,
    triggersCount: 890,
    executionsCount: 880,
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    nodes: [
      { id: 'n1', type: 'trigger', title: 'Shopify / Custom Webhook "Cart Abandoned"', config: {} },
      { id: 'n2', type: 'delay', title: 'Delay 45 Minutes', config: { duration: 45 } },
      { id: 'n3', type: 'action', title: 'Send HSM Template "cart_recovery_promo"', config: {} },
    ],
  },
];

export const automationsApi = {
  getAutomations: async (): Promise<AutomationWorkflow[]> => {
    return MOCK_AUTOMATIONS;
  },
  createAutomation: async (data: Partial<AutomationWorkflow>): Promise<AutomationWorkflow> => {
    await new Promise((res) => setTimeout(res, 600));
    return {
      id: 'wf_' + Date.now(),
      name: data.name || 'New Flow',
      description: data.description || '',
      isActive: true,
      triggersCount: 0,
      executionsCount: 0,
      updatedAt: new Date().toISOString(),
      nodes: data.nodes || [],
    };
  },
};
