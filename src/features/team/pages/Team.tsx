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
        <div className="flex items-center gap-3.5">
          <Avatar name={m.name} size="md" status={m.status === 'active' ? 'online' : 'offline'} />
          <div>
            <div className="font-bold text-[#14201C] text-sm sm:text-base">{m.name}</div>
            <div className="text-xs text-[#5F7069] mt-0.5">{m.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Assigned Role',
      render: (m) => (
        <span className="capitalize font-bold text-[#1F2A26] text-xs sm:text-sm">
          {m.role}
        </span>
      ),
    },
    {
      header: 'Active Chats Assigned',
      render: (m) => (
        <span className="font-extrabold text-[#05A222] text-sm">{m.assignedChatsCount} chats</span>
      ),
    },
    {
      header: 'Status',
      render: () => (
        <Badge variant="success" size="sm">
          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#14201C] tracking-tight">Team & Live Agents</h2>
          <p className="text-sm sm:text-base text-[#5F7069] mt-1.5 font-medium">
            Invite agents and assign incoming WhatsApp conversations across teams.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate(ROUTES.ROLES_PERMISSIONS)}
            leftIcon={<Shield className="w-4 h-4" />}
            className="text-sm font-semibold border-[#C4EBD0] text-[#006736] hover:bg-[#F6FAF8] rounded-xl"
          >
            Roles & Permissions
          </Button>
          <Button variant="primary" size="md" leftIcon={<UserPlus className="w-4 h-4" />} className="text-sm font-bold px-4.5 py-2.5 rounded-xl shadow-sm">
            Invite Member
          </Button>
        </div>
      </div>

      <Table columns={columns} data={members} />
    </PageContainer>
  );
};
