import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Building, Save } from 'lucide-react';
import { settingsApi } from '../api';
import type { BusinessProfileData } from '../types';

export const BusinessProfile: React.FC = () => {
  const [profile, setProfile] = useState<BusinessProfileData>({
    businessName: '',
    description: '',
    address: '',
    email: '',
    vertical: '',
    website: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    settingsApi.getProfile().then(setProfile);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    settingsApi.updateProfile(profile).then(() => {
      setIsSaving(false);
    });
  };

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-500 flex items-center justify-center">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Meta WhatsApp Business Profile</h2>
            <p className="text-xs text-slate-500 mt-0.5">This information is shown to customers on WhatsApp.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Verified Business Display Name"
            value={profile.businessName}
            onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              About / Description
            </label>
            <textarea
              value={profile.description}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <Input
            label="Official Website URL"
            value={profile.website}
            onChange={(e) => setProfile({ ...profile, website: e.target.value })}
          />

          <Input
            label="Physical Address"
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full mt-4"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Update WhatsApp Business Profile
          </Button>
        </form>
      </div>
    </PageContainer>
  );
};
