import type { BusinessProfileData } from './types';

export const MOCK_PROFILE: BusinessProfileData = {
  businessName: 'Acme Global Enterprises Ltd.',
  description: 'Enterprise omnichannel customer support and automated messaging solution.',
  address: '100 Innovation Way, Suite 400, San Francisco, CA',
  email: 'contact@acmeglobal.com',
  vertical: 'Software & Technology',
  website: 'https://acmeglobal.com',
};

export const settingsApi = {
  getProfile: async (): Promise<BusinessProfileData> => MOCK_PROFILE,
  updateProfile: async (data: BusinessProfileData): Promise<BusinessProfileData> => {
    await new Promise((res) => setTimeout(res, 500));
    return data;
  },
};
