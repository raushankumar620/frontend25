export type UserRole = 'SUPER_ADMIN' | 'ORG_ADMIN' | 'TEAM_LEAD' | 'AGENT' | 'DEVELOPER' | 'admin' | 'manager' | 'agent' | 'developer';

export interface OrganizationBranding {
  logoUrl?: string;
  primaryColor?: string;
  website?: string;
  description?: string;
  address?: string;
  supportEmail?: string;
  industry?: string;
}

export interface OrganizationSettings {
  timezone?: string;
  defaultLanguage?: string;
  autoAssignment?: boolean;
}

export interface OrganizationLimits {
  maxNumbers: number;
  maxTeamMembers: number;
  monthlyMessages: number;
}

export interface Organization {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  plan: string;
  planStatus?: 'ACTIVE' | 'TRIAL' | 'EXPIRED' | 'SUSPENDED' | 'CANCELLED' | string;
  trialStartsAt?: string;
  trialEndsAt?: string;
  isTrialActive?: boolean;
  isTrialUsed?: boolean;
  planStartsAt?: string;
  planEndsAt?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';
  branding?: OrganizationBranding;
  settings?: OrganizationSettings;
  limits?: OrganizationLimits;
  ownerId?: string | {
    id?: string;
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  _id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: UserRole;
  permissions?: string[];
  avatarUrl?: string;
  avatar?: string;
  organizationId: string | Organization;
  organizationName?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

export interface AuthState {
  user: User | null;
  organization: Organization | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface TeamMemberItem {
  id: string;
  _id?: string;
  userId?: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  permissions?: string[];
  phone?: string;
  avatarUrl?: string;
  isActive?: boolean;
  status: 'ACTIVE' | 'PENDING' | 'REVOKED' | 'EXPIRED' | 'active';
  inviteToken?: string;
  expiresAt?: string;
  invitedBy?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  createdAt?: string;
  lastLoginAt?: string;
}
