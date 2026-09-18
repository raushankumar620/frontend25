import { apiClient } from './apiClient';
import type {
  OverviewKPIs,
  MessageStats,
  MessageTimeseriesPoint,
  ConversationStats,
  AgentPerformance,
  CampaignMetricsResponse,
  AiStats,
} from '../features/analytics/types';

export const analyticsService = {
  /**
   * Fetch Unified Dashboard Overview KPIs
   */
  async getOverview(startDate?: string, endDate?: string): Promise<OverviewKPIs> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';

    const res = await apiClient.get<OverviewKPIs>(`/analytics/overview${query}`);
    return res.data;
  },

  /**
   * Fetch Message Volume & Delivery Funnel Analytics
   */
  async getMessageAnalytics(startDate?: string, endDate?: string, timezone?: string): Promise<{ stats: MessageStats; timeseries: MessageTimeseriesPoint[] }> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
    params.append('timezone', tz);
    const query = params.toString() ? `?${params.toString()}` : '';

    const res = await apiClient.get<{ stats: MessageStats; timeseries: MessageTimeseriesPoint[] }>(`/analytics/messages${query}`);
    return res.data;
  },

  /**
   * Fetch Conversation SLAs & Status Metrics
   */
  async getConversationAnalytics(startDate?: string, endDate?: string): Promise<ConversationStats> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';

    const res = await apiClient.get<ConversationStats>(`/analytics/conversations${query}`);
    return res.data;
  },

  /**
   * Fetch Agent Performance Leaderboard
   */
  async getAgentPerformance(startDate?: string, endDate?: string): Promise<AgentPerformance[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';

    const res = await apiClient.get<AgentPerformance[]>(`/analytics/agents${query}`);
    return res.data;
  },

  /**
   * Fetch Campaign ROI & Delivery Breakdown
   */
  async getCampaignAnalytics(startDate?: string, endDate?: string): Promise<CampaignMetricsResponse> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';

    const res = await apiClient.get<CampaignMetricsResponse>(`/analytics/campaigns${query}`);
    return res.data;
  },

  /**
   * Fetch AI Deflection & Containment Metrics
   */
  async getAiAnalytics(startDate?: string, endDate?: string): Promise<AiStats> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';

    const res = await apiClient.get<AiStats>(`/analytics/ai${query}`);
    return res.data;
  },

  /**
   * Download CSV Export Report
   */
  async exportCsv(type: 'overview' | 'messages' | 'timeseries' | 'agents' | 'campaigns' | 'ai' = 'overview', startDate?: string, endDate?: string): Promise<void> {
    const params = new URLSearchParams();
    params.append('type', type);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const token = localStorage.getItem('whatsappmsg_token') || localStorage.getItem('chatflow_token');
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

    const response = await fetch(`${baseUrl}/analytics/export?${params.toString()}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download CSV export');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `whatsappmsg_${type}_analytics_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};
