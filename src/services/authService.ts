import type { User } from '../types/auth';
import { apiClient } from './apiClient';

export const authService = {
  async login(email: string, pass: string): Promise<{ user: User; token: string }> {
    const res = await apiClient.post<{
      user: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
        role?: string;
        organizationId?: string;
        organizationName?: string;
      };
      accessToken: string;
      refreshToken?: string;
    }>('/auth/login', { email, password: pass });

    if (res.success && res.data && res.data.accessToken) {
      const u = res.data.user;
      const token = res.data.accessToken;
      const user: User = {
        id: u.id,
        name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || email.split('@')[0],
        email: u.email,
        role: (u.role?.toLowerCase() as any) || 'admin',
        organizationId: u.organizationId || 'org_default',
        organizationName: u.organizationName || 'Enterprise Org',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('chatflow_token', token);
      if (res.data.refreshToken) {
        localStorage.setItem('chatflow_refresh_token', res.data.refreshToken);
      }
      localStorage.setItem('chatflow_user', JSON.stringify(user));
      return { user, token };
    }

    if (res.message && !res.message.includes('Network error') && !res.message.includes('mock fallback')) {
      throw new Error(res.message);
    }

    // Fallback for offline/standalone demo mode
    const token = 'jwt_mock_token_' + Math.random().toString(36).substring(2);
    localStorage.setItem('chatflow_token', token);
    const user: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 8),
      name: email.split('@')[0] || 'Business Admin',
      email,
      role: 'admin',
      organizationId: 'org_81723',
      organizationName: 'Enterprise Org',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('chatflow_user', JSON.stringify(user));
    return { user, token };
  },

  async register(name: string, email: string, pass: string): Promise<{ user: User; token: string }> {
    const parts = name.trim().split(' ');
    const firstName = parts[0] || 'Admin';
    const lastName = parts.slice(1).join(' ') || '';

    const res = await apiClient.post<{
      user: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
        role?: string;
        organizationId?: string;
        organizationName?: string;
      };
      accessToken: string;
      refreshToken?: string;
    }>('/auth/register', {
      email,
      password: pass,
      firstName,
      lastName,
      name,
      organizationName: `${firstName}'s Team`,
    });

    if (res.success && res.data && res.data.accessToken) {
      const u = res.data.user;
      const token = res.data.accessToken;
      const user: User = {
        id: u.id,
        name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || name || email.split('@')[0],
        email: u.email,
        role: (u.role?.toLowerCase() as any) || 'admin',
        organizationId: u.organizationId || 'org_default',
        organizationName: u.organizationName || `${firstName}'s Team`,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('chatflow_token', token);
      if (res.data.refreshToken) {
        localStorage.setItem('chatflow_refresh_token', res.data.refreshToken);
      }
      localStorage.setItem('chatflow_user', JSON.stringify(user));
      return { user, token };
    }

    if (res.message && !res.message.includes('Network error') && !res.message.includes('mock fallback')) {
      throw new Error(res.message);
    }

    const token = 'jwt_mock_token_' + Math.random().toString(36).substring(2);
    localStorage.setItem('chatflow_token', token);
    const user: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 8),
      name: name || email.split('@')[0] || 'Business Admin',
      email,
      role: 'admin',
      organizationId: 'org_81723',
      organizationName: 'Enterprise Org',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('chatflow_user', JSON.stringify(user));
    return { user, token };
  },

  async getCurrentUser(): Promise<User | null> {
    const raw = localStorage.getItem('chatflow_user');
    const token = localStorage.getItem('chatflow_token');
    if (raw && token) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
    return null;
  },

  logout(): void {
    localStorage.removeItem('chatflow_token');
    localStorage.removeItem('chatflow_refresh_token');
    localStorage.removeItem('chatflow_user');
  },
};

