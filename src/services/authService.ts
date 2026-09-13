import type { User } from '../types/auth';

export const authService = {
  async login(email: string, _pass: string): Promise<{ user: User; token: string }> {
    await new Promise((res) => setTimeout(res, 400));
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

  async register(name: string, email: string, _pass: string): Promise<{ user: User; token: string }> {
    await new Promise((res) => setTimeout(res, 400));
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
    localStorage.removeItem('chatflow_user');
  },
};
