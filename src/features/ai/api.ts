import type { AIAgentConfig, KnowledgeDocument } from './types';

export const MOCK_AGENTS: AIAgentConfig[] = [
  {
    id: 'ag_1',
    name: 'Sales Concierge AI',
    role: 'Product discovery, plan recommendation, booking calls',
    model: 'gpt-4o',
    systemPrompt: 'You are the primary WhatsApp sales specialist for Acme Global. Be concise and friendly.',
    temperature: 0.3,
    isActive: true,
    totalConversationsHandled: 4890,
    resolutionRate: 78.5,
    knowledgeBaseCount: 6,
  },
  {
    id: 'ag_2',
    name: '24/7 Support Tier 1 Bot',
    role: 'FAQ answers, order lookups, return requests',
    model: 'claude-3-5-sonnet',
    systemPrompt: 'You are the technical customer support copilot. Check knowledge base docs before answering.',
    temperature: 0.2,
    isActive: true,
    totalConversationsHandled: 11200,
    resolutionRate: 84.1,
    knowledgeBaseCount: 14,
  },
];

export const MOCK_DOCS: KnowledgeDocument[] = [
  {
    id: 'doc_1',
    name: 'Enterprise_Pricing_Matrix_2025.pdf',
    type: 'pdf',
    size: '2.4 MB',
    chunksCount: 84,
    status: 'indexed',
    updatedAt: '2025-02-10T12:00:00Z',
  },
  {
    id: 'doc_2',
    name: 'Product_Shipping_Returns_Policy.docx',
    type: 'docx',
    size: '850 KB',
    chunksCount: 32,
    status: 'indexed',
    updatedAt: '2025-02-12T09:30:00Z',
  },
  {
    id: 'doc_3',
    name: 'https://help.acmeglobal.com/faq',
    type: 'url',
    size: '120 Pages',
    chunksCount: 310,
    status: 'indexed',
    updatedAt: '2025-02-14T15:00:00Z',
  },
];

export const aiApi = {
  getAgents: async (): Promise<AIAgentConfig[]> => MOCK_AGENTS,
  getKnowledgeDocs: async (): Promise<KnowledgeDocument[]> => MOCK_DOCS,
};
