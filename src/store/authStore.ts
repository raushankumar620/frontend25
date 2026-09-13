import { useState, useEffect } from 'react';
import type { User } from '../types/auth';
import { authService } from '../services/authService';

const getInitialUser = (): User | null => {
  try {
    const raw = localStorage.getItem('chatflow_user');
    const token = localStorage.getItem('chatflow_token');
    if (raw && token) {
      return JSON.parse(raw);
    }
  } catch {
    return null;
  }
  return null;
};

let currentUser: User | null = getInitialUser();

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
  async register(name: string, email: string, pass: string) {
    const { user } = await authService.register(name, email, pass);
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
    register: authStore.register.bind(authStore),
    logout: authStore.logout.bind(authStore),
  };
}
