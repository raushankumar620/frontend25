import React, { useState } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Avatar } from '../../../components/ui/Avatar';
import { Save, User, Mail } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

export const AccountSettings: React.FC = () => {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || 'Sarah Jenkins');
  const [email, setEmail] = useState(user?.email || 'sarah.j@acmeglobal.com');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 500);
  };

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Account Settings</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage your personal profile and email preferences.</p>
        </div>

        <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <Avatar name={name} size="xl" status="online" />
          <div>
            <Button variant="outline" size="sm">Change Avatar Photo</Button>
            <p className="text-[10px] text-slate-400 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<User className="w-4 h-4" />}
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Button
            type="submit"
            size="lg"
            className="w-full mt-4"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Profile Changes
          </Button>
        </form>
      </div>
    </PageContainer>
  );
};
