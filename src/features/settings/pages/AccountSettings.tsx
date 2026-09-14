import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Avatar } from '../../../components/ui/Avatar';
import { Save, User, Mail, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

export const AccountSettings: React.FC = () => {
  const { user, updateProfile, refreshProfile } = useAuthStore();
  
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || user?.avatar || '');
  
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    refreshProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || user.name?.split(' ')[0] || '');
      setLastName(user.lastName || user.name?.split(' ').slice(1).join(' ') || '');
      setPhone(user.phone || '');
      setAvatarUrl(user.avatarUrl || user.avatar || '');
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      await updateProfile({
        firstName,
        lastName,
        phone,
        avatarUrl,
      });
      setSuccessMessage('Your personal profile has been updated successfully!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = `${firstName} ${lastName}`.trim() || user?.email || 'User';

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-7">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#14201C] tracking-tight">Account Settings</h2>
          <p className="text-sm sm:text-base text-[#5F7069] mt-1.5 font-medium">
            Manage your personal profile, contact information, and preferences.
          </p>
        </div>

        {successMessage && (
          <div className="p-4 bg-[#E9F9EE] border border-[#C4EBD0] rounded-2xl text-sm text-[#006736] font-bold flex items-center gap-2.5 shadow-xs">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-[#05A222]" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-[#FDF2F2] border border-[#F8B4B4] rounded-2xl text-sm text-[#D64545] font-medium flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#D64545]" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center gap-5 pb-5 border-b border-[#E2EAE6]">
          <Avatar name={displayName} src={avatarUrl} size="xl" status="online" />
          <div className="space-y-1">
            <div className="font-bold text-[#14201C] text-lg">{displayName}</div>
            <div className="text-xs font-semibold text-[#05A222] uppercase tracking-wide">
              {user?.role || 'ORG_ADMIN'}
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              leftIcon={<User className="w-4.5 h-4.5" />}
              required
            />
            <Input
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              leftIcon={<User className="w-4.5 h-4.5" />}
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            value={user?.email || ''}
            disabled
            leftIcon={<Mail className="w-4.5 h-4.5" />}
            helperText="Email address cannot be changed directly."
          />

          <Input
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leftIcon={<Phone className="w-4.5 h-4.5" />}
            placeholder="+919876543210"
          />

          <Input
            label="Avatar Image URL"
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
          />

          <Button
            type="submit"
            size="lg"
            className="w-full mt-6 text-base font-bold rounded-xl py-3.5 shadow-sm cursor-pointer"
            isLoading={isSaving}
            leftIcon={<Save className="w-5 h-5" />}
          >
            Save Profile Changes
          </Button>
        </form>
      </div>
    </PageContainer>
  );
};
