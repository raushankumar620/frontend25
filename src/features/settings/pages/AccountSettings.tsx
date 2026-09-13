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
      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-7">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#14201C] tracking-tight">Account Settings</h2>
          <p className="text-sm sm:text-base text-[#5F7069] mt-1.5 font-medium">Manage your personal profile and email preferences.</p>
        </div>

        <div className="flex items-center gap-5 pb-5 border-b border-[#E2EAE6]">
          <Avatar name={name} size="xl" status="online" />
          <div>
            <Button variant="outline" size="md" className="text-sm font-semibold rounded-xl">Change Avatar Photo</Button>
            <p className="text-xs text-[#8A9993] mt-1.5 font-medium">JPG, PNG or GIF. Max size 2MB.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<User className="w-4.5 h-4.5" />}
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4.5 h-4.5" />}
            required
          />

          <Button
            type="submit"
            size="lg"
            className="w-full mt-6 text-base font-bold rounded-xl py-3 shadow-sm"
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
