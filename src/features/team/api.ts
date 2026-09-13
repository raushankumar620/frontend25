import type { TeamMember, RolePermission } from './types';

export const MOCK_TEAM: TeamMember[] = [
  {
    id: 'tm_1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@acmeglobal.com',
    role: 'admin',
    status: 'active',
    assignedChatsCount: 14,
    lastActive: 'Just now',
  },
  {
    id: 'tm_2',
    name: 'Alex Rivera',
    email: 'alex.r@acmeglobal.com',
    role: 'agent',
    status: 'active',
    assignedChatsCount: 22,
    lastActive: '15m ago',
  },
  {
    id: 'tm_3',
    name: 'Emily Zhao',
    email: 'emily.zhao@acmeglobal.com',
    role: 'manager',
    status: 'active',
    assignedChatsCount: 8,
    lastActive: '1h ago',
  },
];

export const MOCK_ROLES: RolePermission[] = [
  {
    role: 'Admin',
    description: 'Full workspace access including billing, API keys, and team invites.',
    permissions: ['Manage Billing', 'Manage Numbers', 'Broadcast Campaigns', 'API Access', 'Delete Contacts'],
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
  getTeam: async (): Promise<TeamMember[]> => MOCK_TEAM,
  getRoles: async (): Promise<RolePermission[]> => MOCK_ROLES,
};
