import type { User } from '../types/auth';

const MOCK_USER: User = {
  id: 'usr_98129',
  name: 'Sarah Jenkins',
  email: 'sarah.j@acmeglobal.com',
  role: 'admin',
  organizationId: 'org_81723',
  organizationName: 'Acme Global Ltd',
  createdAt: '2025-01-15T10:00:00Z',
};

export const authService = {
  async login(email: string, _pass: string): Promise<{ user: User; token: string }> {
    await new Promise((res) => setTimeout(res, 500));
    const token = 'jwt_mock_token_' + Math.random().toString(36).substring(2);
    localStorage.setItem('chatflow_token', token);
    const user = { ...MOCK_USER, email };
    localStorage.setItem('chatflow_user', JSON.stringify(user));
    return { user, token };
  },

  async register(name: string, email: string, _pass: string): Promise<{ user: User; token: string }> {
    await new Promise((res) => setTimeout(res, 500));
    const token = 'jwt_mock_token_' + Math.random().toString(36).substring(2);
    localStorage.setItem('chatflow_token', token);
    const user = { ...MOCK_USER, name, email };
    localStorage.setItem('chatflow_user', JSON.stringify(user));
    return { user, token };
  },

  async getCurrentUser(): Promise<User | null> {
    const raw = localStorage.getItem('chatflow_user');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return MOCK_USER;
      }
    }
    return MOCK_USER;
  },

  logout(): void {
    localStorage.removeItem('chatflow_token');
    localStorage.removeItem('chatflow_user');
  },
};
