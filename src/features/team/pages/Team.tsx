import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Table, type Column } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Avatar } from '../../../components/ui/Avatar';
import {
  UserPlus,
  Shield,
  Trash2,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  X,
  AlertCircle,
  LayoutDashboard,
  MessageSquare,
  Users,
  FileText,
  Send,
  GitBranch,
  Bot,
  BarChart3,
  Code2,
  Settings,
  Check
} from 'lucide-react';
import type { TeamMemberItem, UserRole } from '../../../types/auth';
import { teamService } from '../../../services/teamService';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

interface ModulePermission {
  key: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

const AVAILABLE_MODULES: ModulePermission[] = [
  { key: 'dashboard', label: 'Dashboard', description: 'Overview & system KPIs', icon: LayoutDashboard, color: '#2563EB' },
  { key: 'inbox', label: 'Shared Inbox', description: 'Live WhatsApp customer chats', icon: MessageSquare, color: '#059669' },
  { key: 'contacts', label: 'Contacts', description: 'Customer & audience directory', icon: Users, color: '#7C3AED' },
  { key: 'templates', label: 'Templates', description: 'Meta HSM message templates', icon: FileText, color: '#D97706' },
  { key: 'campaigns', label: 'Campaigns', description: 'Broadcast messaging & campaigns', icon: Send, color: '#E11D48' },
  { key: 'automations', label: 'Automations', description: 'Flows, triggers & auto-replies', icon: GitBranch, color: '#0891B2' },
  { key: 'ai_agents', label: 'AI Agents', description: 'Autonomous bots & AI assistants', icon: Bot, color: '#9333EA' },
  { key: 'analytics', label: 'Analytics', description: 'Delivery, ROI & message reports', icon: BarChart3, color: '#4F46E5' },
  { key: 'developers', label: 'Developers API', description: 'API keys, webhooks & endpoints', icon: Code2, color: '#0D9488' },
  { key: 'settings', label: 'Settings', description: 'Workspace & account settings', icon: Settings, color: '#64748B' },
];

const ROLE_DEFAULT_PERMISSIONS: Record<string, string[]> = {
  ORG_ADMIN: AVAILABLE_MODULES.map((m) => m.key),
  TEAM_LEAD: ['dashboard', 'inbox', 'contacts', 'templates', 'campaigns', 'automations', 'ai_agents', 'analytics'],
  AGENT: ['dashboard', 'inbox', 'contacts', 'templates'],
  DEVELOPER: ['dashboard', 'developers', 'templates', 'automations', 'analytics'],
};

export const Team: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<TeamMemberItem[]>([]);
  const [invitations, setInvitations] = useState<TeamMemberItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Add Member Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [invitePassword, setInvitePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [inviteRole, setInviteRole] = useState<UserRole>('AGENT');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    ROLE_DEFAULT_PERMISSIONS.AGENT
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteError, setInviteError] = useState('');

  // Edit Permissions Modal State
  const [editingMember, setEditingMember] = useState<TeamMemberItem | null>(null);
  const [editPermissions, setEditPermissions] = useState<string[]>([]);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

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

  const handleRoleChangeInModal = (role: UserRole) => {
    setInviteRole(role);
    const defaults = ROLE_DEFAULT_PERMISSIONS[role] || ROLE_DEFAULT_PERMISSIONS.AGENT;
    setSelectedPermissions(defaults);
  };

  const togglePermission = (key: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let pass = 'Wp@';
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setInvitePassword(pass);
    setShowPassword(true);
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    try {
      setIsSubmitting(true);
      setInviteError('');
      await teamService.inviteMember({
        email: inviteEmail,
        name: inviteName,
        phone: invitePhone,
        password: invitePassword,
        role: inviteRole,
        permissions: selectedPermissions,
      });

      setShowInviteModal(false);
      setInviteEmail('');
      setInviteName('');
      setInvitePhone('');
      setInvitePassword('');
      setSelectedPermissions(ROLE_DEFAULT_PERMISSIONS.AGENT);
      setSuccessMessage(
        invitePassword
          ? `Team member "${inviteEmail}" created successfully with direct login access!`
          : `Invitation sent to ${inviteEmail}!`
      );
      setTimeout(() => setSuccessMessage(''), 5000);
      await loadTeamData();
    } catch (err: any) {
      setInviteError(err.message || 'Failed to create team member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: UserRole) => {
    try {
      const defaultPerms = ROLE_DEFAULT_PERMISSIONS[newRole] || ROLE_DEFAULT_PERMISSIONS.AGENT;
      await teamService.updateMemberRole(memberId, { role: newRole, permissions: defaultPerms });
      setSuccessMessage('Member role and permissions updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      await loadTeamData();
    } catch (err: any) {
      setError(err.message || 'Failed to update role');
    }
  };

  const handleOpenEditPermissions = (member: TeamMemberItem) => {
    setEditingMember(member);
    const initialPerms = member.permissions && member.permissions.length > 0
      ? member.permissions
      : (ROLE_DEFAULT_PERMISSIONS[member.role] || ROLE_DEFAULT_PERMISSIONS.AGENT);
    setEditPermissions(initialPerms);
  };

  const handleSaveEditPermissions = async () => {
    if (!editingMember) return;
    try {
      setIsSavingEdit(true);
      await teamService.updateMemberRole(editingMember.id || editingMember._id || '', {
        permissions: editPermissions,
      });
      setSuccessMessage(`Permissions updated for ${editingMember.firstName || editingMember.name || editingMember.email}`);
      setTimeout(() => setSuccessMessage(''), 3000);
      setEditingMember(null);
      await loadTeamData();
    } catch (err: any) {
      setError(err.message || 'Failed to update permissions');
    } finally {
      setIsSavingEdit(false);
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
      header: 'Member Profile',
      render: (m) => (
        <div className="flex items-center gap-3.5">
          <Avatar
            name={`${m.firstName || ''} ${m.lastName || ''}`.trim() || m.name || m.email}
            size="md"
            status={m.isActive ? 'online' : 'offline'}
          />
          <div>
            <div className="font-bold text-[#14201C] text-sm sm:text-base">
              {`${m.firstName || ''} ${m.lastName || ''}`.trim() || m.name || m.email.split('@')[0]}
            </div>
            <div className="text-xs text-[#5F7069] flex items-center gap-2 mt-0.5">
              <span>{m.email}</span>
              {m.phone && (
                <>
                  <span>•</span>
                  <span className="font-mono">{m.phone}</span>
                </>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Assigned Role',
      render: (m) => (
        <select
          value={m.role}
          onChange={(e) => handleRoleChange(m.id || m._id || '', e.target.value as UserRole)}
          className="bg-[#F6FAF8] border border-[#E2EAE6] text-xs font-bold text-[#14201C] rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#05A222] cursor-pointer"
        >
          <option value="ORG_ADMIN">Organization Head</option>
          <option value="TEAM_LEAD">Team Lead</option>
          <option value="AGENT">Support Agent</option>
          <option value="DEVELOPER">Developer</option>
        </select>
      ),
    },
    {
      header: 'Permitted Modules',
      render: (m) => {
        const isAdminRole = m.role === 'ORG_ADMIN' || m.role === 'SUPER_ADMIN';
        if (isAdminRole) {
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]">
              <Shield className="w-3.5 h-3.5 text-[#05A222]" />
              Full System Access (All Modules)
            </span>
          );
        }

        const perms = m.permissions && m.permissions.length > 0
          ? m.permissions
          : (ROLE_DEFAULT_PERMISSIONS[m.role] || ['dashboard', 'inbox', 'contacts', 'templates']);

        return (
          <div className="flex items-center gap-1.5 flex-wrap max-w-sm">
            {perms.slice(0, 3).map((p) => {
              const mod = AVAILABLE_MODULES.find((item) => item.key === p);
              return (
                <span
                  key={p}
                  className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-700 border border-slate-200 capitalize"
                >
                  {mod ? mod.label : p}
                </span>
              );
            })}
            {perms.length > 3 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-slate-200 text-slate-700">
                +{perms.length - 3} more
              </span>
            )}
            <button
              type="button"
              onClick={() => handleOpenEditPermissions(m)}
              className="text-[11px] font-bold text-[#05A222] hover:underline ml-1 cursor-pointer"
            >
              Edit
            </button>
          </div>
        );
      },
    },
    {
      header: 'Status',
      render: (m) => (
        <Badge variant={m.isActive ? 'success' : 'neutral'} size="sm">
          {m.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      render: (m) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              handleRemoveMember(
                m.id || m._id || '',
                `${m.firstName || ''} ${m.lastName || ''}`.trim() || m.email
              )
            }
            className="p-1.5 rounded-lg text-[#8A9993] hover:text-[#D64545] hover:bg-[#FDF2F2] transition-colors cursor-pointer"
            title="Remove Member"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#14201C] tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-[#05A222]" />
            Team & Role Permissions
          </h2>
          <p className="text-sm text-[#5F7069] mt-1 font-medium">
            Manage your organization members, assign roles, and grant access to specific dashboard modules.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => {
            setInviteError('');
            setShowInviteModal(true);
          }}
          leftIcon={<UserPlus className="w-4 h-4" />}
          className="text-xs sm:text-sm font-bold px-4.5 py-2.5 rounded-xl shadow-xs bg-[#05A222] hover:bg-[#006736] text-white cursor-pointer"
        >
          Add Team Member
        </Button>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] text-[#006736] text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage('')} className="text-[#05A222] hover:underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-[#FDF2F2] border border-[#F8B4B4] text-[#D64545] text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-[#D64545] hover:underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Active Members Table */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#14201C]">Active Team Members ({members.length})</h3>
        </div>
        <Table columns={memberColumns} data={members} isLoading={isLoading} />
      </div>

      {/* Add Team Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#E2EAE6] shadow-2xl max-w-xl w-full p-6 sm:p-7 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EAE6]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#E9F9EE] text-[#05A222] flex items-center justify-center shadow-xs">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#14201C]">Add New Team Member</h3>
                  <p className="text-xs text-[#5F7069] font-medium">Create direct login credentials and configure module permissions</p>
                </div>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-[#8A9993] hover:text-[#14201C] p-1.5 rounded-lg cursor-pointer hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {inviteError && (
              <div className="p-3.5 bg-[#FDF2F2] border border-[#F8B4B4] rounded-xl text-xs text-[#D64545] font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#D64545]" />
                <span>{inviteError}</span>
              </div>
            )}

            <form onSubmit={handleCreateMember} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-[#14201C] mb-1.5">
                    Member Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 absolute left-3 text-[#8A9993]" />
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="agent@company.com"
                      required
                      className="w-full rounded-xl border border-[#E2EAE6] bg-[#F6FAF8] text-[#14201C] text-xs sm:text-sm pl-9 pr-3 py-2.5 focus:bg-white focus:outline-none focus:border-[#05A222] font-medium"
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-[#14201C] mb-1.5">
                    Full Name <span className="text-[#8A9993] font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full rounded-xl border border-[#E2EAE6] bg-[#F6FAF8] text-[#14201C] text-xs sm:text-sm px-3 py-2.5 focus:bg-white focus:outline-none focus:border-[#05A222] font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mobile / Phone */}
                <div>
                  <label className="block text-xs font-bold text-[#14201C] mb-1.5">
                    Phone / Mobile <span className="text-[#8A9993] font-normal">(Optional)</span>
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 absolute left-3 text-[#8A9993]" />
                    <input
                      type="text"
                      value={invitePhone}
                      onChange={(e) => setInvitePhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-[#E2EAE6] bg-[#F6FAF8] text-[#14201C] text-xs sm:text-sm pl-9 pr-3 py-2.5 focus:bg-white focus:outline-none focus:border-[#05A222] font-medium"
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-xs font-bold text-[#14201C] mb-1.5">
                    Assign Role <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => handleRoleChangeInModal(e.target.value as UserRole)}
                    className="w-full rounded-xl border border-[#E2EAE6] bg-[#F6FAF8] text-[#14201C] text-xs sm:text-sm px-3 py-2.5 focus:bg-white focus:outline-none focus:border-[#05A222] font-bold cursor-pointer"
                  >
                    <option value="AGENT">Support Agent (Inbox & Contacts)</option>
                    <option value="TEAM_LEAD">Team Lead (Lead Agent & Campaigns)</option>
                    <option value="DEVELOPER">Developer (API Keys & Automations)</option>
                    <option value="ORG_ADMIN">Organization Head (Full Control)</option>
                  </select>
                </div>
              </div>

              {/* Direct Password Field */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#14201C] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#05A222]" />
                    Set Direct Login Password
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[11px] font-bold text-[#05A222] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    Auto Generate
                  </button>
                </div>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={invitePassword}
                    onChange={(e) => setInvitePassword(e.target.value)}
                    placeholder="Enter password (min 6 characters) for instant login"
                    className="w-full rounded-xl border border-[#E2EAE6] bg-white text-[#14201C] text-xs sm:text-sm px-3 py-2 pr-10 focus:outline-none focus:border-[#05A222] font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-[#5F7069] leading-tight">
                  Member is password se direct login page par login kar payega bina kisi email confirmation ke.
                </p>
              </div>

              {/* Modular Sidebar Permissions Checkboxes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-[#14201C] flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-[#05A222]" />
                    Sidebar Module Permissions ({selectedPermissions.length}/{AVAILABLE_MODULES.length})
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPermissions(AVAILABLE_MODULES.map((m) => m.key))}
                      className="text-[10px] font-bold text-[#05A222] hover:underline cursor-pointer"
                    >
                      Select All
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => setSelectedPermissions([])}
                      className="text-[10px] font-bold text-slate-500 hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                  {AVAILABLE_MODULES.map((mod) => {
                    const isChecked = selectedPermissions.includes(mod.key);
                    return (
                      <div
                        key={mod.key}
                        onClick={() => togglePermission(mod.key)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${isChecked
                            ? 'bg-[#E9F9EE]/70 border-[#C4EBD0] text-[#006736]'
                            : 'bg-white border-[#E2EAE6] text-slate-600 hover:bg-slate-50'
                          }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <mod.icon className="w-4 h-4 shrink-0" style={{ color: mod.color }} />
                          <div className="truncate">
                            <span className="text-xs font-bold block truncate leading-tight">{mod.label}</span>
                            <span className="text-[10px] text-slate-400 block truncate leading-tight">{mod.description}</span>
                          </div>
                        </div>
                        <div
                          className={`w-4.5 h-4.5 rounded-md flex items-center justify-center border transition-all shrink-0 ml-2 ${isChecked
                              ? 'bg-[#05A222] border-[#05A222] text-white'
                              : 'border-slate-300 bg-white'
                            }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2EAE6]">
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
                  className="text-xs font-bold px-5 rounded-xl shadow-xs bg-[#05A222] hover:bg-[#006736] text-white cursor-pointer"
                >
                  Create & Add Member
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Permissions Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#E2EAE6] shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EAE6]">
              <div>
                <h3 className="text-lg font-black text-[#14201C]">
                  Edit Permissions: {editingMember.firstName || editingMember.name || editingMember.email}
                </h3>
                <p className="text-xs text-[#5F7069]">Select which sidebar modules this team member can access</p>
              </div>
              <button
                onClick={() => setEditingMember(null)}
                className="text-[#8A9993] hover:text-[#14201C] p-1.5 rounded-lg cursor-pointer hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1">
              {AVAILABLE_MODULES.map((mod) => {
                const isChecked = editPermissions.includes(mod.key);
                return (
                  <div
                    key={mod.key}
                    onClick={() =>
                      setEditPermissions((prev) =>
                        prev.includes(mod.key) ? prev.filter((p) => p !== mod.key) : [...prev, mod.key]
                      )
                    }
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${isChecked
                        ? 'bg-[#E9F9EE]/70 border-[#C4EBD0] text-[#006736]'
                        : 'bg-white border-[#E2EAE6] text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <mod.icon className="w-4 h-4 shrink-0" style={{ color: mod.color }} />
                      <div className="truncate">
                        <span className="text-xs font-bold block truncate leading-tight">{mod.label}</span>
                        <span className="text-[10px] text-slate-400 block truncate leading-tight">{mod.description}</span>
                      </div>
                    </div>
                    <div
                      className={`w-4.5 h-4.5 rounded-md flex items-center justify-center border transition-all shrink-0 ml-2 ${isChecked
                          ? 'bg-[#05A222] border-[#05A222] text-white'
                          : 'border-slate-300 bg-white'
                        }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2EAE6]">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setEditingMember(null)}
                className="text-xs font-bold rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleSaveEditPermissions}
                isLoading={isSavingEdit}
                className="text-xs font-bold px-5 rounded-xl shadow-xs bg-[#05A222] hover:bg-[#006736] text-white cursor-pointer"
              >
                Save Permissions
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
