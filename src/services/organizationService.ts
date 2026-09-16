import type { Organization } from '../types/auth';
import { apiClient } from './apiClient';

export const organizationService = {
  async getCurrentOrganization(): Promise<Organization> {
    const res = await apiClient.get<Organization>('/organizations/me');
    if (res.success && res.data) {
      localStorage.setItem('whatsappmsg_org', JSON.stringify(res.data));
      return res.data;
    }
    throw new Error(res.message || 'Failed to fetch organization details');
  },

  async updateOrganization(data: {
    name?: string;
    branding?: Partial<import('../types/auth').OrganizationBranding>;
    settings?: Partial<import('../types/auth').OrganizationSettings>;
  }): Promise<Organization> {
    const res = await apiClient.patch<Organization>('/organizations/me', data);
    if (res.success && res.data) {
      localStorage.setItem('whatsappmsg_org', JSON.stringify(res.data));
      return res.data;
    }
    throw new Error(res.message || 'Failed to update organization');
  },
};
