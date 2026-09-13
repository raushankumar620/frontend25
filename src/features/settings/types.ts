export interface BusinessProfileData {
  businessName: string;
  description: string;
  address: string;
  email: string;
  vertical: string;
  website: string;
}

export interface SecuritySettingsData {
  twoFactorEnabled: boolean;
  sessionTimeoutMins: number;
}
