import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Table, type Column } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Avatar } from '../../../components/ui/Avatar';
import { UserPlus, Shield, CheckCircle2, Clock, Trash2, Mail, X, AlertCircle } from 'lucide-react';
import type { TeamMemberItem, UserRole } from '../../../types/auth';
import { teamService } from '../../../services/teamService';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const Team: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<TeamMemberItem[]>([]);
  const [invitations, setInvitations] = useState<TeamMemberItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Invite Modal state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('AGENT');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteError, setInviteError] = useState('');

  const loadTeamData = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await teamService.getTeamMembers();
      setMembers(data.members || []);
      setInvitations(data.invitations || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load team data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeamData();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    try {
      setIsSubmitting(true);
      setInviteError('');
      await teamService.inviteMember({
        email: inviteEmail,
        name: inviteName,
        role: inviteRole,
      });
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteName('');
      setSuccessMessage(`Invitation sent to ${inviteEmail}!`);
      setTimeout(() => setSuccessMessage(''), 4000);
      await loadTeamData();
    } catch (err: any) {
      setInviteError(err.message || 'Failed to send invitation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: UserRole) => {
    try {
      await teamService.updateMemberRole(memberId, newRole);
      setSuccessMessage('Member role updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      await loadTeamData();
    } catch (err: any) {
      setError(err.message || 'Failed to update role');
    }
  };

  const handleRemoveMember = async (memberId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove ${name || 'this member'} from your organization?`)) {
      return;
    }
    try {
      await teamService.removeMember(memberId);
      setSuccessMessage('Member removed successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      await loadTeamData();
    } catch (err: any) {
      setError(err.message || 'Failed to remove member');
    }
  };

  const memberColumns: Column<TeamMemberItem>[] = [
    {
      header: 'Member',
      render: (m) => (
        <div className="flex items-center gap-3.5">
          <Avatar name={`${m.firstName || ''} ${m.lastName || ''}`.trim() || m.name || m.email} size="md" status={m.isActive ? 'online' : 'offline'} />
          <div>
            <div className="font-bold text-[#14201C] text-sm sm:text-base">
              {`${m.firstName || ''} ${m.lastName || ''}`.trim() || m.name || m.email.split('@')[0]}
            </div>
            <div className="text-xs text-[#5F7069] mt-0.5">{m.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      render: (m) => (
        <select
          value={m.role}
          onChange={(e) => handleRoleChange(m.id || m._id || '', e.target.value as UserRole)}
          className="bg-[#F6FAF8] border border-[#E2EAE6] text-xs font-bold text-[#14201C] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#05A222] cursor-pointer"
        >
          <option value="ORG_ADMIN">ORG_ADMIN</option>
          <option value="TEAM_LEAD">TEAM_LEAD</option>
          <option value="AGENT">AGENT</option>
          <option value="DEVELOPER">DEVELOPER</option>
        </select>
      ),
    },
    {
      header: 'Status',
      render: (m) => (
        <Badge variant={m.isActive ? 'success' : 'neutral'} size="sm">
          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
          {m.isActive ? 'ACTIVE' : 'INACTIVE'}
        </Badge>
      ),
    },
    {
      header: 'Last Login',
      render: (m) => (
        <span className="text-xs text-[#5F7069] font-medium">
          {m.lastLoginAt ? new Date(m.lastLoginAt).toLocaleDateString() : 'Never'}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (m) => (
        <button
          onClick={() => handleRemoveMember(m.id || m._id || '', `${m.firstName || ''} ${m.lastName || ''}`.trim() || m.name || m.email)}
          className="text-[#8A9993] hover:text-[#D64545] p-1.5 rounded-lg hover:bg-[#FDF2F2] transition-colors cursor-pointer"
          title="Remove Member"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <PageContainer>
      {/* Header */}
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
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowInviteModal(true)}
            leftIcon={<UserPlus className="w-4 h-4" />}
            className="text-sm font-bold px-4.5 py-2.5 rounded-xl shadow-sm cursor-pointer"
          >
            Invite Member
          </Button>
        </div>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div className="mb-6 p-4 bg-[#E9F9EE] border border-[#C4EBD0] rounded-2xl text-sm text-[#006736] font-bold flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-[#05A222]" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-[#FDF2F2] border border-[#F8B4B4] rounded-2xl text-sm text-[#D64545] font-medium flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 text-[#D64545]" />
          <span>{error}</span>
        </div>
      )}

      {/* Active Members Table */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E2EAE6] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#14201C]">Active Organization Members ({members.length})</h3>
          </div>
          {isLoading ? (
            <div className="py-12 flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-[#05A222]/30 border-t-[#05A222] rounded-full animate-spin" />
            </div>
          ) : (
            <Table columns={memberColumns} data={members} />
          )}
        </div>

        {/* Pending Invitations Section */}
        {invitations.length > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-[#E2EAE6] shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#E3A008]" />
              <h3 className="text-lg font-bold text-[#14201C]">Pending Invitations ({invitations.length})</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {invitations.map((inv) => (
                <div key={inv.id || inv._id} className="p-4 rounded-xl border border-[#E2EAE6] bg-[#F6FAF8] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#14201C] text-sm">{inv.name || inv.email}</div>
                    <div className="text-xs text-[#5F7069] mt-0.5">{inv.email}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="warning" size="sm">PENDING</Badge>
                      <span className="text-[11px] font-semibold text-[#8A9993]">Role: {inv.role}</span>
                    </div>
                  </div>
                  {inv.inviteToken && (
                    <div className="text-right">
                      <span className="text-[10px] font-mono bg-white px-2 py-1 rounded border border-[#E2EAE6] text-[#5F7069]">
                        Token: {inv.inviteToken.substring(0, 8)}...
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#E2EAE6] shadow-2xl max-w-md w-full p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EAE6]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E9F9EE] text-[#05A222] flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#14201C]">Invite New Member</h3>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-[#8A9993] hover:text-[#14201C] p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {inviteError && (
              <div className="p-3 bg-[#FDF2F2] border border-[#F8B4B4] rounded-xl text-xs text-[#D64545] font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#D64545]" />
                <span>{inviteError}</span>
              </div>
            )}

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#14201C] mb-1.5">Member Email *</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 absolute left-3 text-[#8A9993]" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="agent@company.com"
                    required
                    className="w-full rounded-xl border border-[#E2EAE6] bg-[#F6FAF8] text-[#14201C] text-sm pl-9 pr-3 py-2.5 focus:bg-white focus:outline-none focus:border-[#05A222] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14201C] mb-1.5">Full Name (optional)</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full rounded-xl border border-[#E2EAE6] bg-[#F6FAF8] text-[#14201C] text-sm px-3 py-2.5 focus:bg-white focus:outline-none focus:border-[#05A222] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14201C] mb-1.5">Assign Role *</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className="w-full rounded-xl border border-[#E2EAE6] bg-[#F6FAF8] text-[#14201C] text-sm px-3 py-2.5 focus:bg-white focus:outline-none focus:border-[#05A222] font-bold cursor-pointer"
                >
                  <option value="AGENT">AGENT (Shared Inbox & Customer Chats)</option>
                  <option value="TEAM_LEAD">TEAM_LEAD (Lead Agent & Assignments)</option>
                  <option value="DEVELOPER">DEVELOPER (API Keys & Webhooks)</option>
                  <option value="ORG_ADMIN">ORG_ADMIN (Full Workspace Management)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setShowInviteModal(false)}
                  className="text-xs font-bold rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  className="text-xs font-bold px-5 rounded-xl shadow-xs"
                >
                  Send Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
