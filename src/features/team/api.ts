import { teamService } from '../../services/teamService';
import type { TeamMember, RolePermission } from './types';

export const ROLES_LIST: RolePermission[] = [
  {
    role: 'Organization Head',
    description: 'Full workspace and organization access including billing, numbers, API keys, and team management.',
    permissions: ['Manage Billing', 'Manage Numbers', 'Broadcast Campaigns', 'API Access', 'Delete Contacts', 'Team Access'],
  },
  {
    role: 'Support Agent',
    description: 'Access to shared Live Inbox, contact attributes, and template responses.',
    permissions: ['Read & Send Messages', 'View Contacts', 'Add Internal Notes'],
  },
  {
    role: 'Campaign Manager',
    description: 'Create WhatsApp templates, schedule broadcast campaigns, and view analytics.',
    permissions: ['Create Templates', 'Launch Campaigns', 'View Analytics', 'Export Contacts'],
  },
];

export const teamApi = {
  getTeam: async (): Promise<TeamMember[]> => {
    try {
      const data = await teamService.getTeamMembers();
      return (data.members || []).map((m: any) => ({
        id: m.id || m._id,
        name: m.name || `${m.firstName || ''} ${m.lastName || ''}`.trim() || 'Team Member',
        email: m.email,
        role: (m.role || 'agent').toLowerCase(),
        status: m.status?.toLowerCase() || 'active',
        assignedChatsCount: m.assignedChatsCount || 0,
        lastActive: m.lastActiveAt ? new Date(m.lastActiveAt).toLocaleTimeString() : 'Active',
      }));
    } catch (error) {
      console.error('Failed to fetch team members from backend:', error);
      return [];
    }
  },
  getRoles: async (): Promise<RolePermission[]> => ROLES_LIST,
};
