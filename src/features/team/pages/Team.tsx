import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Table, type Column } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Avatar } from '../../../components/ui/Avatar';
import { UserPlus, Shield, CheckCircle2 } from 'lucide-react';
import type { TeamMember } from '../types';
import { teamApi } from '../api';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const Team: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    teamApi.getTeam().then(setMembers);
  }, []);

  const columns: Column<TeamMember>[] = [
    {
      header: 'Member',
      render: (m) => (
        <div className="flex items-center gap-3">
          <Avatar name={m.name} size="sm" status={m.status === 'active' ? 'online' : 'offline'} />
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">{m.name}</div>
            <div className="text-[11px] text-slate-400">{m.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Assigned Role',
      render: (m) => (
        <span className="capitalize font-semibold text-slate-700 dark:text-slate-300 text-xs">
          {m.role}
        </span>
      ),
    },
    {
      header: 'Active Chats Assigned',
      render: (m) => (
        <span className="font-bold text-emerald-500">{m.assignedChatsCount} chats</span>
      ),
    },
    {
      header: 'Status',
      render: () => (
        <Badge variant="success" size="sm">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          ACTIVE
        </Badge>
      ),
    },
    {
      header: 'Last Seen',
      accessorKey: 'lastActive',
    },
  ];

  return (
    <PageContainer>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Team & Live Agents</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Invite agents and assign incoming WhatsApp conversations across teams.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.ROLES_PERMISSIONS)}
            leftIcon={<Shield className="w-3.5 h-3.5" />}
          >
            Roles & Permissions
          </Button>
          <Button variant="primary" size="sm" leftIcon={<UserPlus className="w-3.5 h-3.5" />}>
            Invite Member
          </Button>
        </div>
      </div>

      <Table columns={columns} data={members} />
    </PageContainer>
  );
};
