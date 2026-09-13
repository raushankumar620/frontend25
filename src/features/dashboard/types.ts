export interface DashboardStats {
  totalMessagesSent: number;
  deliveryRate: number;
  readRate: number;
  activeConversations: number;
  connectedNumbers: number;
  marketingRoi: number;
}

export interface ActivityEvent {
  id: string;
  type: 'message_sent' | 'campaign_completed' | 'template_approved' | 'new_lead' | 'bot_handoff';
  title: string;
  description: string;
  timestamp: string;
  badgeVariant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}
