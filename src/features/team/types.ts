export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'agent' | 'developer';
  status: 'active' | 'invited';
  assignedChatsCount: number;
  lastActive: string;
}

export interface RolePermission {
  role: string;
  description: string;
  permissions: string[];
}
