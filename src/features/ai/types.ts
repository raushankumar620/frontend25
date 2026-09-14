export interface AIAgent {
  _id: string;
  organizationId: string;
  name: string;
  role: string;
  systemPrompt: string;
  modelProvider: 'openai' | 'gemini' | 'anthropic' | 'custom';
  modelName: string;
  temperature: number;
  maxTokens: number;
  handoffKeywords: string[];
  isDefault: boolean;
  isActive: boolean;
  totalInferences: number;
  lastActiveAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AIMetrics {
  totalAgents: number;
  activeAgents: number;
  totalSessions: number;
  handedOffSessions: number;
  totalInferences: number;
  containmentRate: number;
  agents: Partial<AIAgent>[];
}

export interface AISimulateRequest {
  userMessage: string;
  messages?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
}

export interface AISimulateResponse {
  reply: string;
  handedOff: boolean;
  handoffReason?: string;
  agentId?: string;
  modelName?: string;
  timestamp: string;
}

export interface KnowledgeChunk {
  _id?: string;
  chunkIndex: number;
  text: string;
  tokenCount?: number;
}

export interface KnowledgeDocument {
  _id: string;
  organizationId: string;
  title: string;
  type: 'document' | 'faq' | 'text' | 'url' | 'csv';
  sourceUrl?: string | null;
  content: string;
  chunks?: KnowledgeChunk[];
  totalChunks: number;
  status: 'INDEXED' | 'INDEXING' | 'FAILED';
  tags?: string[];
  fileSize?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RAGSearchResult {
  documentId: string;
  documentTitle: string;
  documentType: string;
  chunkIndex: number;
  text: string;
  similarityScore: number;
}

// AI Tool Calling Types
export interface AIToolWebhookConfig {
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH';
  headers?: Record<string, string>;
  authType?: 'NONE' | 'BEARER' | 'API_KEY' | 'BASIC';
  secretToken?: string;
  timeoutMs?: number;
}

export interface AITool {
  _id?: string;
  name: string;
  displayName: string;
  description: string;
  type: 'BUILT_IN' | 'CUSTOM_WEBHOOK';
  parameters?: Record<string, any>;
  webhookConfig?: AIToolWebhookConfig;
  isActive?: boolean;
  totalExecutions?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AIToolsResponse {
  builtInTools: AITool[];
  customTools: AITool[];
}

export interface AIToolLog {
  _id: string;
  organizationId: string;
  toolId?: string;
  toolName: string;
  conversationId?: string;
  contactId?: string;
  inputParameters: Record<string, any>;
  outputResult: any;
  executionStatus: 'SUCCESS' | 'FAILED' | 'TIMEOUT';
  latencyMs: number;
  errorMessage?: string;
  createdAt: string;
}

export interface AIToolLogsResponse {
  logs: AIToolLog[];
  total: number;
  page: number;
  totalPages: number;
}

// AI Human Handoff Types
export interface AIHandoffItem {
  _id: string;
  id?: string;
  organizationId: string;
  conversationId: {
    _id: string;
    id?: string;
    lastMessage?: {
      content: string;
      timestamp: string;
      sender: string;
    };
    lastMessageAt?: string;
    unreadCount?: number;
    priority?: string;
    status?: string;
  } | string;
  contactId: {
    _id: string;
    id?: string;
    name: string;
    phoneNumber: string;
    email?: string;
    avatar?: string;
  };
  assignedAgentId?: {
    _id: string;
    id?: string;
    name: string;
    email: string;
    role?: string;
    avatar?: string;
  } | null;
  status: 'PENDING' | 'CLAIMED' | 'RESOLVED' | 'RESUMED_AI';
  triggerType: 'KEYWORD' | 'LOW_CONFIDENCE' | 'TOOL_FAILURE' | 'MANUAL' | 'NEGATIVE_SENTIMENT';
  reason: string;
  triggerDetails?: {
    keyword?: string;
    confidence?: number;
    toolName?: string;
    error?: string;
  };
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  requestedAt: string;
  claimedAt?: string | null;
  resolvedAt?: string | null;
  resolutionNotes?: string | null;
}

export interface AIHandoffQueueResponse {
  handoffs: AIHandoffItem[];
  total: number;
  page: number;
  pages: number;
}

export interface AIHandoffStats {
  pendingQueue: number;
  activeClaimed: number;
  totalResolved: number;
  totalHandoffs: number;
  avgWaitMinutes: number;
  claimRate: number;
}

export interface AIHandoffSettings {
  keywords: string[];
  confidenceThreshold: number;
  autoHandoffOnToolError: boolean;
  assignmentPolicy: 'CLAIM_QUEUE' | 'ROUND_ROBIN';
  fallbackMessage: string;
}

