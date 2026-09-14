import { apiClient } from './apiClient';
import type {
  AIAgent,
  AIMetrics,
  AISimulateRequest,
  AISimulateResponse,
  KnowledgeDocument,
  RAGSearchResult,
  AITool,
  AIToolsResponse,
  AIToolLogsResponse,
} from '../features/ai/types';

export const aiService = {
  // Agents CRUD
  getAgents: async (): Promise<AIAgent[]> => {
    const res = await apiClient.get<AIAgent[]>('/ai/agents');
    return res.data || [];
  },

  getAgentById: async (id: string): Promise<AIAgent> => {
    const res = await apiClient.get<AIAgent>(`/ai/agents/${id}`);
    return res.data;
  },

  createAgent: async (data: Partial<AIAgent>): Promise<AIAgent> => {
    const res = await apiClient.post<AIAgent>('/ai/agents', data);
    return res.data;
  },

  updateAgent: async (id: string, data: Partial<AIAgent>): Promise<AIAgent> => {
    const res = await apiClient.put<AIAgent>(`/ai/agents/${id}`, data);
    return res.data;
  },

  deleteAgent: async (id: string): Promise<AIAgent> => {
    const res = await apiClient.delete<AIAgent>(`/ai/agents/${id}`);
    return res.data;
  },

  toggleAgent: async (id: string): Promise<AIAgent> => {
    const res = await apiClient.patch<AIAgent>(`/ai/agents/${id}/toggle`);
    return res.data;
  },

  simulateAgent: async (id: string, payload: AISimulateRequest): Promise<AISimulateResponse> => {
    const res = await apiClient.post<AISimulateResponse>(`/ai/agents/${id}/simulate`, payload);
    return res.data;
  },

  simulateDefault: async (payload: AISimulateRequest): Promise<AISimulateResponse> => {
    const res = await apiClient.post<AISimulateResponse>('/ai/simulate', payload);
    return res.data;
  },

  getMetrics: async (): Promise<AIMetrics> => {
    const res = await apiClient.get<AIMetrics>('/ai/metrics');
    return res.data;
  },

  // Knowledge Base & RAG Engine
  getKnowledgeDocs: async (params?: { type?: string; status?: string }): Promise<KnowledgeDocument[]> => {
    const query = new URLSearchParams();
    if (params?.type) query.append('type', params.type);
    if (params?.status) query.append('status', params.status);
    const queryString = query.toString();
    const endpoint = queryString ? `/ai/knowledge?${queryString}` : '/ai/knowledge';
    const res = await apiClient.get<KnowledgeDocument[]>(endpoint);
    return res.data || [];
  },

  getKnowledgeDocById: async (id: string): Promise<KnowledgeDocument> => {
    const res = await apiClient.get<KnowledgeDocument>(`/ai/knowledge/${id}`);
    return res.data;
  },

  createKnowledgeDoc: async (data: Partial<KnowledgeDocument>): Promise<KnowledgeDocument> => {
    const res = await apiClient.post<KnowledgeDocument>('/ai/knowledge', data);
    return res.data;
  },

  deleteKnowledgeDoc: async (id: string): Promise<KnowledgeDocument> => {
    const res = await apiClient.delete<KnowledgeDocument>(`/ai/knowledge/${id}`);
    return res.data;
  },

  reindexKnowledgeDoc: async (id: string): Promise<KnowledgeDocument> => {
    const res = await apiClient.post<KnowledgeDocument>(`/ai/knowledge/${id}/reindex`);
    return res.data;
  },

  queryKnowledgeBase: async (query: string, topK: number = 4): Promise<RAGSearchResult[]> => {
    const res = await apiClient.post<RAGSearchResult[]>('/ai/knowledge/query', { query, topK });
    return res.data || [];
  },

  // AI Tool Calling & Safe Execution
  getTools: async (): Promise<AIToolsResponse> => {
    const res = await apiClient.get<AIToolsResponse>('/ai/tools');
    return res.data || { builtInTools: [], customTools: [] };
  },

  createTool: async (data: Partial<AITool>): Promise<AITool> => {
    const res = await apiClient.post<AITool>('/ai/tools', data);
    return res.data;
  },

  updateTool: async (id: string, data: Partial<AITool>): Promise<AITool> => {
    const res = await apiClient.put<AITool>(`/ai/tools/${id}`, data);
    return res.data;
  },

  deleteTool: async (id: string): Promise<AITool> => {
    const res = await apiClient.delete<AITool>(`/ai/tools/${id}`);
    return res.data;
  },

  executeTool: async (payload: { toolName?: string; toolId?: string; parameters: Record<string, any> }): Promise<any> => {
    const res = await apiClient.post<any>('/ai/tools/execute', payload);
    return res.data;
  },

  getToolLogs: async (params?: { page?: number; limit?: number; toolName?: string }): Promise<AIToolLogsResponse> => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.toolName) query.append('toolName', params.toolName);
    const queryString = query.toString();
    const endpoint = queryString ? `/ai/tools/logs?${queryString}` : '/ai/tools/logs';
    const res = await apiClient.get<AIToolLogsResponse>(endpoint);
    return res.data || { logs: [], total: 0, page: 1, totalPages: 1 };
  },

  // AI Human Handoff Protocol
  getHandoffQueue: async (params?: { status?: string; priority?: string; page?: number; limit?: number }): Promise<any> => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.priority) query.append('priority', params.priority);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    const queryString = query.toString();
    const endpoint = queryString ? `/ai/handoff/queue?${queryString}` : '/ai/handoff/queue';
    const res = await apiClient.get<any>(endpoint);
    return res.data || { handoffs: [], total: 0, page: 1, pages: 1 };
  },

  getHandoffStats: async (): Promise<any> => {
    const res = await apiClient.get<any>('/ai/handoff/stats');
    return res.data;
  },

  triggerHandoff: async (payload: { conversationId: string; reason?: string; priority?: string; triggerType?: string }): Promise<any> => {
    const res = await apiClient.post<any>('/ai/handoff/trigger', payload);
    return res.data;
  },

  claimHandoff: async (idOrConvId: string): Promise<any> => {
    const res = await apiClient.post<any>(`/ai/handoff/${idOrConvId}/claim`, {});
    return res.data;
  },

  resolveHandoff: async (idOrConvId: string, payload?: { resolutionNotes?: string; returnToAi?: boolean }): Promise<any> => {
    const res = await apiClient.post<any>(`/ai/handoff/${idOrConvId}/resolve`, payload || {});
    return res.data;
  },

  resumeAi: async (idOrConvId: string): Promise<any> => {
    const res = await apiClient.post<any>(`/ai/handoff/${idOrConvId}/resume-ai`, {});
    return res.data;
  },

  getHandoffSettings: async (): Promise<any> => {
    const res = await apiClient.get<any>('/ai/handoff/settings');
    return res.data;
  },

  updateHandoffSettings: async (settings: any): Promise<any> => {
    const res = await apiClient.put<any>('/ai/handoff/settings', settings);
    return res.data;
  },
};

