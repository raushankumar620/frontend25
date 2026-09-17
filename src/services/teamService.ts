import type { TeamMemberItem, UserRole } from '../types/auth';
import { apiClient } from './apiClient';

export interface TeamListResponse {
  members: TeamMemberItem[];
  invitations: TeamMemberItem[];
  totalCount: number;
}

export interface InvitePayload {
  email: string;
  name?: string;
  phone?: string;
  password?: string;
  role: UserRole;
  permissions?: string[];
}

export const teamService = {
  async getTeamMembers(): Promise<TeamListResponse> {
    const res = await apiClient.get<TeamListResponse>('/team');
    if (res.success && res.data) {
      return res.data;
    }
    return {
      members: [],
      invitations: [],
      totalCount: 0,
    };
  },

  async inviteMember(payload: InvitePayload): Promise<any> {
    const res = await apiClient.post<any>('/team/invite', payload);
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to create / invite team member');
  },

  async updateMemberRole(
    memberId: string,
    payload: { role?: UserRole; permissions?: string[]; name?: string; phone?: string; password?: string } | UserRole
  ): Promise<TeamMemberItem> {
    const body = typeof payload === 'string' ? { role: payload } : payload;
    const res = await apiClient.patch<TeamMemberItem>(`/team/${memberId}/role`, body);
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to update member');
  },

  async removeMember(memberId: string): Promise<{ message: string }> {
    const res = await apiClient.delete<{ message: string }>(`/team/${memberId}`);
    if (res.success) {
      return res.data || { message: 'Member removed successfully' };
    }
    throw new Error(res.message || 'Failed to remove member');
  },
};
