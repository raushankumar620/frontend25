import { organizationService } from '../../services/organizationService';
import type { BusinessProfileData } from './types';

export const settingsApi = {
  getProfile: async (): Promise<BusinessProfileData> => {
    try {
      const org = await organizationService.getCurrentOrganization();
      return {
        businessName: org.name || 'Your Organization',
        description: org.branding?.primaryColor || '',
        address: '',
        email: '',
        vertical: 'Software & Technology',
        website: org.branding?.website || 'https://whatsappmsg.com',
      };
    } catch {
      return {
        businessName: 'My Organization',
        description: '',
        address: '',
        email: '',
        vertical: 'General',
        website: 'https://whatsappmsg.com',
      };
    }
  },

  updateProfile: async (data: BusinessProfileData): Promise<BusinessProfileData> => {
    await organizationService.updateOrganization({
      name: data.businessName,
      branding: {
        website: data.website,
      },
    });
    return data;
  },
};
