export interface AIAgentConfig {
  id: string;
  name: string;
  role: string;
  model: 'gpt-4o' | 'claude-3-5-sonnet' | 'gemini-1-5-pro';
  systemPrompt: string;
  temperature: number;
  isActive: boolean;
  totalConversationsHandled: number;
  resolutionRate: number;
  knowledgeBaseCount: number;
}

export interface KnowledgeDocument {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'faq' | 'url';
  size: string;
  chunksCount: number;
  status: 'indexed' | 'indexing' | 'failed';
  updatedAt: string;
}
