import { useState, useEffect } from 'react';
import type { User, Organization } from '../types/auth';
import { authService, type RegisterPayload } from '../services/authService';
import { organizationService } from '../services/organizationService';

const getInitialUser = (): User | null => {
  try {
    const raw = localStorage.getItem('whatsappmsg_user') || localStorage.getItem('chatflow_user');
    const token = localStorage.getItem('whatsappmsg_token') || localStorage.getItem('chatflow_token');
    if (raw && token) {
      return JSON.parse(raw);
    }
  } catch {
    return null;
  }
  return null;
};

const getInitialOrg = (): Organization | null => {
  try {
    const raw = localStorage.getItem('whatsappmsg_org');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    return null;
  }
  return null;
};

let currentUser: User | null = getInitialUser();
let currentOrg: Organization | null = getInitialOrg();

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export const authStore = {
  getUser(): User | null {
    return currentUser;
  },
  getOrganization(): Organization | null {
    return currentOrg;
  },
  setUser(user: User | null) {
    currentUser = user;
    if (user) {
      localStorage.setItem('whatsappmsg_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('whatsappmsg_user');
    }
    notify();
  },
  setOrganization(org: Organization | null) {
    currentOrg = org;
    if (org) {
      localStorage.setItem('whatsappmsg_org', JSON.stringify(org));
    } else {
      localStorage.removeItem('whatsappmsg_org');
    }
    notify();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  async login(email: string, pass: string) {
    const { user, organization } = await authService.login(email, pass);
    currentUser = user;
    currentOrg = organization;
    if (user) localStorage.setItem('whatsappmsg_user', JSON.stringify(user));
    if (organization) localStorage.setItem('whatsappmsg_org', JSON.stringify(organization));
    notify();
    return user;
  },
  async adminLogin(identifier: string, pass: string) {
    const { user, organization } = await authService.adminLogin(identifier, pass);
    currentUser = user;
    currentOrg = organization;
    if (user) localStorage.setItem('whatsappmsg_user', JSON.stringify(user));
    if (organization) localStorage.setItem('whatsappmsg_org', JSON.stringify(organization));
    notify();
    return user;
  },
  async register(payload: RegisterPayload | { name: string; email: string; pass: string; company?: string }) {
    const { user, organization } = await authService.register(payload);
    currentUser = user;
    currentOrg = organization;
    if (user) localStorage.setItem('whatsappmsg_user', JSON.stringify(user));
    if (organization) localStorage.setItem('whatsappmsg_org', JSON.stringify(organization));
    notify();
    return user;
  },
  async acceptInvite(payload: { token: string; password: string; firstName?: string; lastName?: string }) {
    const { user, organization } = await authService.acceptInvite(payload);
    currentUser = user;
    currentOrg = organization;
    if (user) localStorage.setItem('whatsappmsg_user', JSON.stringify(user));
    if (organization) localStorage.setItem('whatsappmsg_org', JSON.stringify(organization));
    notify();
    return user;
  },
  async refreshProfile() {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        currentUser = user;
        localStorage.setItem('whatsappmsg_user', JSON.stringify(user));
        notify();
      }
      const org = await organizationService.getCurrentOrganization();
      if (org) {
        currentOrg = org;
        localStorage.setItem('whatsappmsg_org', JSON.stringify(org));
        notify();
      }
    } catch {
      // Ignored
    }
  },
  async updateProfile(data: { firstName?: string; lastName?: string; phone?: string; avatarUrl?: string }) {
    const updated = await authService.updateProfile(data);
    currentUser = updated;
    if (updated) localStorage.setItem('whatsappmsg_user', JSON.stringify(updated));
    notify();
    return updated;
  },
  async updateOrganization(data: { name?: string; branding?: any; settings?: any }) {
    const updated = await organizationService.updateOrganization(data);
    currentOrg = updated;
    if (updated) localStorage.setItem('whatsappmsg_org', JSON.stringify(updated));
    notify();
    return updated;
  },
  logout() {
    authService.logout();
    currentUser = null;
    currentOrg = null;
    notify();
  },
};

export function useAuthStore() {
  const [user, setUser] = useState<User | null>(authStore.getUser());
  const [organization, setOrganization] = useState<Organization | null>(authStore.getOrganization());

  useEffect(() => {
    // Refresh profile in background to get latest permissions
    authStore.refreshProfile();
    return authStore.subscribe(() => {
      setUser(authStore.getUser());
      setOrganization(authStore.getOrganization());
    });
  }, []);

  return {
    user,
    organization,
    isAuthenticated: !!user,
    login: authStore.login.bind(authStore),
    adminLogin: authStore.adminLogin.bind(authStore),
    register: authStore.register.bind(authStore),
    acceptInvite: authStore.acceptInvite.bind(authStore),
    refreshProfile: authStore.refreshProfile.bind(authStore),
    updateProfile: authStore.updateProfile.bind(authStore),
    updateOrganization: authStore.updateOrganization.bind(authStore),
    logout: authStore.logout.bind(authStore),
  };
}
