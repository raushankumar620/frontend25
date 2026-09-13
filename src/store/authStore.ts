import { useState, useEffect } from 'react';
import type { User } from '../types/auth';
import { authService } from '../services/authService';

let currentUser: User | null = {
  id: 'usr_98129',
  name: 'Sarah Jenkins',
  email: 'sarah.j@acmeglobal.com',
  role: 'admin',
  organizationId: 'org_81723',
  organizationName: 'Acme Global Ltd',
  createdAt: '2025-01-15T10:00:00Z',
};

const listeners = new Set<(user: User | null) => void>();

function notify() {
  listeners.forEach((listener) => listener(currentUser));
}

export const authStore = {
  getUser(): User | null {
    return currentUser;
  },
  setUser(user: User | null) {
    currentUser = user;
    notify();
  },
  subscribe(listener: (user: User | null) => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  async login(email: string, pass: string) {
    const { user } = await authService.login(email, pass);
    this.setUser(user);
    return user;
  },
  logout() {
    authService.logout();
    this.setUser(null);
  },
};

export function useAuthStore() {
  const [user, setUser] = useState<User | null>(authStore.getUser());

  useEffect(() => {
    return authStore.subscribe((updatedUser) => {
      setUser(updatedUser);
    });
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    login: authStore.login.bind(authStore),
    logout: authStore.logout.bind(authStore),
  };
}
