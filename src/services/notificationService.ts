import { apiClient } from './apiClient';
import type { ApiResponse } from '../types/api';

export type NotificationType =
  | 'NEW_MESSAGE'
  | 'ASSIGNED_CONVERSATION'
  | 'CAMPAIGN_COMPLETED'
  | 'CAMPAIGN_FAILED'
  | 'CAMPAIGN_STARTED'
  | 'WHATSAPP_DISCONNECTED'
  | 'WHATSAPP_CONNECTED'
  | 'AI_HANDOFF'
  | 'WEBHOOK_FAILURE'
  | 'USAGE_LIMIT'
  | 'BILLING_EVENT'
  | 'SYSTEM_ALERT'
  | 'SECURITY_ALERT'
  | 'TEAM_INVITE';

export type NotificationCategory =
  | 'messages'
  | 'campaigns'
  | 'whatsapp'
  | 'ai'
  | 'billing'
  | 'system'
  | 'security';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface NotificationItem {
  id: string;
  _id?: string;
  organizationId: string;
  userId?: string | null;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;
  actionUrl?: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
  unreadCount: number;
}

export interface NotificationListResponse {
  notifications: NotificationItem[];
  pagination: NotificationPagination;
  unreadByCategory?: Record<string, number>;
}

export interface NotificationPreferences {
  id?: string;
  organizationId?: string;
  userId?: string;
  emailNotifications: boolean;
  inAppNotifications: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
  categories: {
    messages: boolean;
    campaigns: boolean;
    whatsapp: boolean;
    ai: boolean;
    billing: boolean;
    system: boolean;
    security: boolean;
  };
}

class NotificationService {
  /**
   * Fetch paginated and filtered notifications
   */
  async getNotifications(params: {
    page?: number;
    limit?: number;
    isRead?: boolean | string;
    category?: string;
    type?: string;
    priority?: string;
    search?: string;
  } = {}): Promise<ApiResponse<NotificationItem[]>> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.isRead !== undefined && params.isRead !== '') query.append('isRead', params.isRead.toString());
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.type) query.append('type', params.type);
    if (params.priority && params.priority !== 'all') query.append('priority', params.priority);
    if (params.search) query.append('search', params.search);

    const queryString = query.toString();
    const endpoint = queryString ? `/notifications?${queryString}` : '/notifications';
    return apiClient.get<NotificationItem[]>(endpoint);
  }

  /**
   * Get total unread count
   */
  async getUnreadCount(): Promise<ApiResponse<{ unreadCount: number }>> {
    return apiClient.get<{ unreadCount: number }>('/notifications/unread-count');
  }

  /**
   * Mark a single notification as read
   */
  async markAsRead(id: string): Promise<ApiResponse<NotificationItem>> {
    return apiClient.patch<NotificationItem>(`/notifications/${id}/read`);
  }

  /**
   * Mark all notifications (or within a category) as read
   */
  async markAllAsRead(category?: string): Promise<ApiResponse<{ success: boolean; modifiedCount: number }>> {
    return apiClient.patch<{ success: boolean; modifiedCount: number }>('/notifications/read-all', {
      category: category && category !== 'all' ? category : undefined,
    });
  }

  /**
   * Delete a notification
   */
  async deleteNotification(id: string): Promise<ApiResponse<{ success: boolean; id: string }>> {
    return apiClient.delete<{ success: boolean; id: string }>(`/notifications/${id}`);
  }

  /**
   * Clear all notifications or all read notifications
   */
  async clearAllNotifications(onlyRead = false): Promise<ApiResponse<{ success: boolean; deletedCount: number }>> {
    return apiClient.delete<{ success: boolean; deletedCount: number }>(`/notifications/clear-all?onlyRead=${onlyRead}`);
  }

  /**
   * Get user notification preferences
   */
  async getPreferences(): Promise<ApiResponse<NotificationPreferences>> {
    return apiClient.get<NotificationPreferences>('/notifications/preferences');
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<ApiResponse<NotificationPreferences>> {
    return apiClient.put<NotificationPreferences>('/notifications/preferences', preferences);
  }

  /**
   * Register FCM device push token
   */
  async registerFcmToken(token: string, deviceType = 'web'): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post<{ success: boolean }>('/notifications/fcm-token', { token, deviceType });
  }

  /**
   * Send test notification
   */
  async sendTestNotification(data: {
    title?: string;
    message?: string;
    type?: NotificationType;
    category?: NotificationCategory;
    priority?: NotificationPriority;
    actionUrl?: string;
    metadata?: Record<string, any>;
  } = {}): Promise<ApiResponse<NotificationItem>> {
    return apiClient.post<NotificationItem>('/notifications/test', data);
  }
}

export const notificationService = new NotificationService();
