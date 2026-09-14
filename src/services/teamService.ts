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
  role: UserRole;
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

  async inviteMember(payload: InvitePayload): Promise<TeamMemberItem> {
    const res = await apiClient.post<TeamMemberItem>('/team/invite', payload);
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to invite team member');
  },

  async updateMemberRole(memberId: string, role: UserRole): Promise<TeamMemberItem> {
    const res = await apiClient.patch<TeamMemberItem>(`/team/${memberId}/role`, { role });
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to update member role');
  },

  async removeMember(memberId: string): Promise<{ message: string }> {
    const res = await apiClient.delete<{ message: string }>(`/team/${memberId}`);
    if (res.success) {
      return res.data || { message: 'Member removed successfully' };
    }
    throw new Error(res.message || 'Failed to remove member');
  },
};
