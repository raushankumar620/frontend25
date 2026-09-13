export type NodeType = 'trigger' | 'condition' | 'action' | 'ai_agent' | 'delay';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  title: string;
  subtitle?: string;
  config: Record<string, any>;
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  triggersCount: number;
  executionsCount: number;
  updatedAt: string;
  nodes: WorkflowNode[];
}
