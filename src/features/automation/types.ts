export type TriggerType =
  | 'KEYWORD'
  | 'FIRST_MESSAGE'
  | 'OUT_OF_HOURS'
  | 'BUTTON_CLICK'
  | 'INACTIVITY'
  | 'TAG_ADDED'
  | 'CUSTOM_WEBHOOK';

export type ActionType =
  | 'SEND_TEXT'
  | 'SEND_TEMPLATE'
  | 'ASSIGN_AGENT'
  | 'ADD_TAG'
  | 'REMOVE_TAG'
  | 'UPDATE_STATUS'
  | 'INTERNAL_NOTE'
  | 'TRIGGER_WEBHOOK';

export interface ActionItem {
  type: ActionType;
  payload: {
    text?: string;
    templateId?: string;
    templateName?: string;
    language?: string;
    variableMapping?: Record<string, string>;
    agentId?: string;
    tag?: string;
    status?: 'OPEN' | 'PENDING' | 'RESOLVED' | 'CLOSED';
    note?: string;
    webhookUrl?: string;
  };
}

export interface ConditionItem {
  field: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'CONTAINS' | 'NOT_CONTAINS' | 'IS_EMPTY' | 'IS_NOT_EMPTY';
  value: any;
}

export interface TriggerConfig {
  keywords?: string[];
  matchType?: 'EXACT' | 'CONTAINS' | 'STARTS_WITH' | 'REGEX';
  caseSensitive?: boolean;
  buttonId?: string;
  businessHours?: {
    timezone: string;
    schedule: Array<{
      day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
      open?: string;
      close?: string;
      closed?: boolean;
    }>;
  };
  inactivityMinutes?: number;
}

export interface AutomationRule {
  id?: string;
  _id: string;
  name: string;
  description?: string;
  triggerType: TriggerType;
  triggerConfig?: TriggerConfig;
  conditions?: ConditionItem[];
  actions: ActionItem[];
  isActive: boolean;
  priority: number;
  executionCount: number;
  lastExecutedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface CreateAutomationPayload {
  name: string;
  description?: string;
  triggerType: TriggerType;
  triggerConfig?: TriggerConfig;
  conditions?: ConditionItem[];
  actions: ActionItem[];
  isActive?: boolean;
  priority?: number;
}

export interface AutomationLog {
  id?: string;
  _id: string;
  automationId: string;
  automationName: string;
  contactId?: {
    _id: string;
    name: string;
    phoneNumber: string;
  };
  conversationId?: string;
  triggerType: TriggerType;
  matchedTrigger?: string;
  executedActions: Array<{
    actionType: string;
    status: 'SUCCESS' | 'FAILED' | 'SKIPPED';
    detail?: any;
    error?: string;
  }>;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  createdAt: string;
}

export type NodeType =
  | 'trigger'
  | 'ai_agent'
  | 'send_message'
  | 'condition'
  | 'add_tag'
  | 'assign_agent'
  | 'delay'
  | 'webhook'
  | 'action';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  title: string;
  subtitle?: string;
  data?: any;
  status?: 'IDLE' | 'EXECUTING' | 'SUCCESS' | 'FAILED';
  x?: number;
  y?: number;
}

export interface WorkflowConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  sourceHandle?: 'default' | 'true' | 'false';
  label?: string;
}


