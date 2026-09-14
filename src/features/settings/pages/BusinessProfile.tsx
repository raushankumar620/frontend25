import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Building, Save, Globe, Palette, CheckCircle2, AlertCircle, Clock, ShieldCheck } from 'lucide-react';
import { organizationService } from '../../../services/organizationService';
import type { Organization } from '../../../types/auth';

export const BusinessProfile: React.FC = () => {
  const [org, setOrg] = useState<Organization | null>(null);
  const [name, setName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#25D366');
  const [website, setWebsite] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [defaultLanguage, setDefaultLanguage] = useState('en');
  const [autoAssignment, setAutoAssignment] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const loadOrgData = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await organizationService.getCurrentOrganization();
      setOrg(data);
      setName(data.name || '');
      setPrimaryColor(data.branding?.primaryColor || '#25D366');
      setWebsite(data.branding?.website || '');
      setLogoUrl(data.branding?.logoUrl || '');
      setTimezone(data.settings?.timezone || 'Asia/Kolkata');
      setDefaultLanguage(data.settings?.defaultLanguage || 'en');
      setAutoAssignment(!!data.settings?.autoAssignment);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch organization data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrgData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const updated = await organizationService.updateOrganization({
        name,
        branding: {
          primaryColor,
          website,
          logoUrl,
        },
        settings: {
          timezone,
          defaultLanguage,
          autoAssignment,
        },
      });
      setOrg(updated);
      setSuccessMessage('Organization details and branding updated successfully!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to update organization');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E9F9EE] text-[#05A222] flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#14201C] tracking-tight">Organization Profile</h2>
              <p className="text-xs sm:text-sm text-[#5F7069] mt-0.5">Multi-tenant workspace configuration and branding.</p>
            </div>
          </div>

          {org && (
            <Badge variant="success" size="md">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              {org.plan}
            </Badge>
          )}
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

        {isLoading ? (
          <div className="py-12 flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-[#05A222]/30 border-t-[#05A222] rounded-full animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            <Input
              label="Organization / Company Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div className="p-4 rounded-xl border border-[#E2EAE6] bg-[#F6FAF8] flex items-center justify-between text-xs">
              <span className="text-[#5F7069] font-medium">Tenant Unique Slug:</span>
              <span className="font-mono font-bold text-[#006736] bg-white px-2.5 py-1 rounded border border-[#C4EBD0]">
                {org?.slug || 'loading-slug'}
              </span>
            </div>

            <div className="border-t border-[#E2EAE6] pt-5 space-y-4">
              <h3 className="text-sm font-bold text-[#14201C] flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#05A222]" />
                Branding & Custom Colors
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#14201C] mb-1.5">Brand Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded-xl border border-[#E2EAE6] cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 rounded-xl border border-[#E2EAE6] bg-[#fafcfb] text-xs font-mono px-3 py-2.5 font-bold text-[#14201C]"
                    />
                  </div>
                </div>

                <Input
                  label="Official Website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://mybusiness.com"
                  leftIcon={<Globe className="w-4 h-4" />}
                />
              </div>

              <Input
                label="Brand Logo URL"
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://mybusiness.com/logo.png"
              />
            </div>

            <div className="border-t border-[#E2EAE6] pt-5 space-y-4">
              <h3 className="text-sm font-bold text-[#14201C] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#05A222]" />
                Timezone & Message Settings
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#14201C] mb-1.5">Organization Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full rounded-xl border border-[#E2EAE6] bg-[#fafcfb] text-xs font-bold px-3 py-2.5 text-[#14201C] focus:outline-none focus:border-[#05A222] cursor-pointer"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                    <option value="UTC">UTC (+0:00)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GST +4:00)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#14201C] mb-1.5">Default Language</label>
                  <select
                    value={defaultLanguage}
                    onChange={(e) => setDefaultLanguage(e.target.value)}
                    className="w-full rounded-xl border border-[#E2EAE6] bg-[#fafcfb] text-xs font-bold px-3 py-2.5 text-[#14201C] focus:outline-none focus:border-[#05A222] cursor-pointer"
                  >
                    <option value="en">English (en)</option>
                    <option value="hi">Hindi (hi)</option>
                    <option value="es">Spanish (es)</option>
                    <option value="ar">Arabic (ar)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoAssignment}
                    onChange={(e) => setAutoAssignment(e.target.checked)}
                    className="w-4 h-4 rounded text-[#05A222] focus:ring-[#05A222] cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#14201C]">
                    Enable Automatic Agent Assignment for incoming WhatsApp messages
                  </span>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-6 text-base font-bold rounded-xl py-3.5 shadow-sm cursor-pointer"
              isLoading={isSaving}
              leftIcon={<Save className="w-5 h-5" />}
            >
              Update Organization Settings
            </Button>
          </form>
        )}
      </div>
    </PageContainer>
  );
};
