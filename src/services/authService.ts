import type { User, Organization } from '../types/auth';
import { apiClient } from './apiClient';

export interface RegisterPayload {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  organizationName?: string;
  companyName?: string;
}

export interface AuthResponseData {
  user: {
    id?: string;
    _id?: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    role?: string;
    avatarUrl?: string;
    organizationId?: string | Organization;
    organizationName?: string;
  };
  organization?: Organization;
  accessToken: string;
  refreshToken?: string;
}

const normalizeUser = (u: any, org?: Organization): User => {
  const firstName = u.firstName || (u.name ? u.name.split(' ')[0] : '');
  const lastName = u.lastName || (u.name && u.name.split(' ').slice(1).join(' ')) || '';
  const fullName = `${firstName} ${lastName}`.trim() || u.name || u.email.split('@')[0];

  return {
    id: u.id || u._id,
    _id: u._id || u.id,
    name: fullName,
    firstName,
    lastName,
    email: u.email,
    phone: u.phone || '',
    role: u.role || 'ORG_ADMIN',
    avatarUrl: u.avatarUrl || u.avatar || '',
    avatar: u.avatarUrl || u.avatar || '',
    organizationId: typeof u.organizationId === 'object' ? (u.organizationId?._id || u.organizationId?.id) : (u.organizationId || org?.id || org?._id || ''),
    organizationName: org?.name || (typeof u.organizationId === 'object' ? u.organizationId?.name : '') || u.organizationName || 'My Organization',
    createdAt: u.createdAt || new Date().toISOString(),
    lastLoginAt: u.lastLoginAt,
  };
};

export const authService = {
  async login(email: string, pass: string): Promise<{ user: User; organization: Organization | null; token: string }> {
    const res = await apiClient.post<AuthResponseData>('/auth/login', { email, password: pass });

    if (res.success && res.data && res.data.accessToken) {
      const token = res.data.accessToken;
      const org = res.data.organization || null;
      const user = normalizeUser(res.data.user, org || undefined);

      localStorage.setItem('whatsappmsg_token', token);
      localStorage.setItem('chatflow_token', token);
      if (res.data.refreshToken) {
        localStorage.setItem('whatsappmsg_refresh_token', res.data.refreshToken);
        localStorage.setItem('chatflow_refresh_token', res.data.refreshToken);
      }
      localStorage.setItem('whatsappmsg_user', JSON.stringify(user));
      localStorage.setItem('chatflow_user', JSON.stringify(user));
      if (org) {
        localStorage.setItem('whatsappmsg_org', JSON.stringify(org));
      }

      return { user, organization: org, token };
    }

    throw new Error(res.message || 'Login failed');
  },

  async register(payload: RegisterPayload | { name: string; email: string; pass: string; company?: string }): Promise<{ user: User; organization: Organization | null; token: string }> {
    let body: any;

    if ('pass' in payload) {
      const parts = (payload.name || '').trim().split(' ');
      const firstName = parts[0] || 'Admin';
      const lastName = parts.slice(1).join(' ') || '';
      body = {
        email: payload.email,
        password: payload.pass,
        firstName,
        lastName,
        organizationName: payload.company || `${firstName}'s Organization`,
      };
    } else {
      const parts = (payload.name || '').trim().split(' ');
      body = {
        email: payload.email,
        password: payload.password,
        firstName: payload.firstName || parts[0] || 'Admin',
        lastName: payload.lastName || parts.slice(1).join(' ') || '',
        phone: payload.phone || '',
        organizationName: payload.organizationName || payload.companyName || 'My Organization',
      };
    }

    const res = await apiClient.post<AuthResponseData>('/auth/register', body);

    if (res.success && res.data && res.data.accessToken) {
      const token = res.data.accessToken;
      const org = res.data.organization || null;
      const user = normalizeUser(res.data.user, org || undefined);

      localStorage.setItem('whatsappmsg_token', token);
      localStorage.setItem('chatflow_token', token);
      if (res.data.refreshToken) {
        localStorage.setItem('whatsappmsg_refresh_token', res.data.refreshToken);
        localStorage.setItem('chatflow_refresh_token', res.data.refreshToken);
      }
      localStorage.setItem('whatsappmsg_user', JSON.stringify(user));
      localStorage.setItem('chatflow_user', JSON.stringify(user));
      if (org) {
        localStorage.setItem('whatsappmsg_org', JSON.stringify(org));
      }

      return { user, organization: org, token };
    }

    throw new Error(res.message || 'Registration failed');
  },

  async forgotPassword(email: string): Promise<{ message: string; resetToken?: string }> {
    const res = await apiClient.post<{ message: string; resetToken?: string }>('/auth/forgot-password', { email });
    return res.data || { message: res.message || 'Reset link sent' };
  },

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const res = await apiClient.post<{ message: string }>('/auth/reset-password', { token, password });
    return res.data || { message: res.message || 'Password reset successful' };
  },

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('whatsappmsg_token') || localStorage.getItem('chatflow_token');
    if (!token) return null;

    try {
      const res = await apiClient.get<any>('/users/me');
      if (res.success && res.data) {
        const org = typeof res.data.organizationId === 'object' ? res.data.organizationId : null;
        const user = normalizeUser(res.data, org);
        localStorage.setItem('whatsappmsg_user', JSON.stringify(user));
        localStorage.setItem('chatflow_user', JSON.stringify(user));
        return user;
      }
    } catch {
      // Fall back to cached user in local storage
      const cached = localStorage.getItem('whatsappmsg_user') || localStorage.getItem('chatflow_user');
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          return null;
        }
      }
    }
    return null;
  },

  async updateProfile(data: { firstName?: string; lastName?: string; phone?: string; avatarUrl?: string }): Promise<User> {
    const res = await apiClient.patch<any>('/users/me', data);
    if (res.success && res.data) {
      const org = typeof res.data.organizationId === 'object' ? res.data.organizationId : null;
      const user = normalizeUser(res.data, org);
      localStorage.setItem('whatsappmsg_user', JSON.stringify(user));
      localStorage.setItem('chatflow_user', JSON.stringify(user));
      return user;
    }
    throw new Error(res.message || 'Failed to update profile');
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Continue cleanup on network error
    } finally {
      localStorage.removeItem('whatsappmsg_token');
      localStorage.removeItem('chatflow_token');
      localStorage.removeItem('whatsappmsg_refresh_token');
      localStorage.removeItem('chatflow_refresh_token');
      localStorage.removeItem('whatsappmsg_user');
      localStorage.removeItem('chatflow_user');
      localStorage.removeItem('whatsappmsg_org');
    }
  },
};
