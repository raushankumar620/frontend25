export interface AnalyticsMetric {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export interface MessageStats {
  total: number;
  outbound: number;
  inbound: number;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
  deliveryRate: string;
  readRate: string;
  failureRate: string;
}

export interface MessageTimeseriesPoint {
  date: string;
  sent: number;
  delivered: number;
  read: number;
  inbound: number;
  failed: number;
}

export interface ConversationStats {
  total: number;
  open: number;
  pending: number;
  resolved: number;
  closed: number;
  urgent: number;
  humanHandoffCount: number;
  resolutionRate: string;
  avgResolutionHours: number;
  avgFirstResponseMinutes: number;
}

export interface AiStats {
  totalSessions: number;
  containedSessions: number;
  handedOffSessions: number;
  containmentRate: string;
  handoffRate: string;
  triggerBreakdown: Array<{
    trigger: string;
    count: number;
  }>;
}

export interface OverviewKPIs {
  messages: MessageStats;
  conversations: ConversationStats;
  ai: AiStats;
  activeContacts: number;
  activeCampaigns: number;
}

export interface AgentPerformance {
  agentId: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  assignedCount: number;
  resolvedCount: number;
  resolutionRate: string;
}

export interface CampaignAnalyticsItem {
  id: string;
  name: string;
  status: string;
  type: string;
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
  deliveryRate: string;
  readRate: string;
  createdAt: string;
}

export interface CampaignMetricsResponse {
  totalCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
  recentCampaigns: CampaignAnalyticsItem[];
}
