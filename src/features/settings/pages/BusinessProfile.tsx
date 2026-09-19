import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  Building,
  Save,
  Globe,
  Palette,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Mail,
  MapPin,
  Layers,
  Sparkles,
} from 'lucide-react';
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

  // Meta WhatsApp Business Profile fields
  const [businessDescription, setBusinessDescription] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessIndustry, setBusinessIndustry] = useState('OTHER');

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
      setBusinessDescription(data.branding?.description || 'WhatsApp Customer Engagement Platform');
      setBusinessAddress(data.branding?.address || 'Tower 4, Tech Park');
      setBusinessEmail(data.branding?.supportEmail || '');
      setBusinessIndustry(data.branding?.industry || 'RETAIL');
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
          description: businessDescription,
          address: businessAddress,
          supportEmail: businessEmail,
          industry: businessIndustry,
        },
        settings: {
          timezone,
          defaultLanguage,
          autoAssignment,
        },
      });
      setOrg(updated);
      setSuccessMessage('Organization details and WhatsApp business profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to update organization');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageContainer>
      <div className="w-full space-y-7 pb-14">
        {/* Full-Width Header Card */}
        <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(1,59,35,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md ring-4 ring-emerald-50">
              <Building className="w-7 h-7" strokeWidth={2.4} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Business & Organization Profile
                </h1>
                {org && (
                  <Badge variant="success" size="md">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    {org.plan} Tier
                  </Badge>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                Manage your enterprise workspace identity, Meta branding, and message routing policies.
              </p>
            </div>
          </div>

          <Button
            type="button"
            size="md"
            variant="primary"
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
            className="font-extrabold text-xs sm:text-sm px-6 rounded-xl shadow-xs self-start sm:self-auto cursor-pointer"
          >
            Save Changes
          </Button>
        </div>

        {/* Global Notifications / Alert Banner */}
        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs sm:text-sm text-emerald-800 font-bold flex items-center gap-2.5 shadow-xs animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-xs sm:text-sm text-rose-700 font-bold flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="w-full bg-white p-14 rounded-3xl border border-slate-200 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-600 rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-600">Loading business profile data...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-7">
            {/* 2-Column Responsive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
              {/* Card 1: Core Organization Identity */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(1,59,35,0.03)] space-y-6">
                <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200">
                  <Layers className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Organization Details</h2>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Organization / Company Legal Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Acme Corporation Ltd."
                    helperText="Visible on enterprise invoices and team invitations."
                  />

                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-700 font-extrabold block">Tenant Unique Workspace Slug</span>
                      <span className="text-slate-500 text-[11px]">Auto-generated system namespace</span>
                    </div>
                    <span className="font-mono font-black text-emerald-800 bg-white px-3 py-1 rounded-xl border border-emerald-300 shadow-2xs">
                      {org?.slug || 'loading-slug'}
                    </span>
                  </div>

                  <Input
                    label="Official Business Website"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                    leftIcon={<Globe className="w-4 h-4 text-slate-500" />}
                    helperText="Include full URL with https://"
                  />
                </div>
              </div>

              {/* Card 2: Branding & Appearance */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(1,59,35,0.03)] space-y-6">
                <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200">
                  <Palette className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Branding & Appearance</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-2">
                      Brand Primary Accent Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-12 h-12 rounded-2xl border-2 border-slate-200 cursor-pointer p-1 bg-white shadow-2xs hover:scale-105 transition-transform"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1 rounded-xl border border-slate-300 bg-slate-50 text-sm font-mono px-3.5 py-2.5 font-black text-slate-900 uppercase focus:bg-white focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <Input
                    label="Brand Logo Image URL"
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    helperText="Direct image URL (PNG, SVG, or JPEG, square 512x512 recommended)."
                  />

                  {logoUrl && (
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                      <img
                        src={logoUrl}
                        alt="Brand Preview"
                        className="w-12 h-12 rounded-xl object-contain bg-white border border-slate-200 p-1"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <span className="text-xs font-bold text-slate-700">Live Logo Preview</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card 3: Meta WhatsApp Official Business Profile */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(1,59,35,0.03)] space-y-6">
                <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">WhatsApp Business Profile</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1.5">
                      Business Industry Vertical
                    </label>
                    <select
                      value={businessIndustry}
                      onChange={(e) => setBusinessIndustry(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 cursor-pointer"
                    >
                      <option value="RETAIL">Retail & eCommerce</option>
                      <option value="FINANCE">Financial Services & Banking</option>
                      <option value="HEALTHCARE">Healthcare & Pharmacy</option>
                      <option value="EDUCATION">Education & EdTech</option>
                      <option value="REAL_ESTATE">Real Estate & Construction</option>
                      <option value="HOSPITALITY">Hospitality & Travel</option>
                      <option value="PROFESSIONAL_SERVICES">Professional & Consulting Services</option>
                      <option value="OTHER">Other / Tech Enterprise</option>
                    </select>
                  </div>

                  <Input
                    label="Official Business Contact Email"
                    type="email"
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    placeholder="support@example.com"
                    leftIcon={<Mail className="w-4 h-4 text-slate-500" />}
                    helperText="Shown on WhatsApp contact card when customers view profile."
                  />

                  <Input
                    label="Business Physical Address"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    placeholder="Suite 500, Enterprise Blvd, Silicon City"
                    leftIcon={<MapPin className="w-4 h-4 text-slate-500" />}
                  />

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1.5">
                      About Business / Description
                    </label>
                    <textarea
                      rows={3}
                      value={businessDescription}
                      onChange={(e) => setBusinessDescription(e.target.value)}
                      placeholder="Brief description of products, support hours, and services provided..."
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-medium p-3 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* Card 4: Localization & Automated Routing Settings */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(1,59,35,0.03)] space-y-6">
                <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Localization & Automation</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1.5">
                      Organization Timezone
                    </label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 cursor-pointer"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                      <option value="UTC">UTC (+0:00)</option>
                      <option value="America/New_York">America/New_York (EST -5:00)</option>
                      <option value="America/Los_Angeles">America/Los_Angeles (PST -8:00)</option>
                      <option value="Europe/London">Europe/London (GMT +0:00)</option>
                      <option value="Asia/Dubai">Asia/Dubai (GST +4:00)</option>
                      <option value="Asia/Singapore">Asia/Singapore (SGT +8:00)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1.5">
                      Default Communication Language
                    </label>
                    <select
                      value={defaultLanguage}
                      onChange={(e) => setDefaultLanguage(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 cursor-pointer"
                    >
                      <option value="en">English (en)</option>
                      <option value="hi">Hindi (hi)</option>
                      <option value="es">Spanish (es)</option>
                      <option value="ar">Arabic (ar)</option>
                      <option value="fr">French (fr)</option>
                      <option value="de">German (de)</option>
                    </select>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 pt-3">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={autoAssignment}
                        onChange={(e) => setAutoAssignment(e.target.checked)}
                        className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer mt-0.5"
                      />
                      <div>
                        <span className="text-xs sm:text-sm font-black text-slate-900 block">
                          Enable Autonomous Agent Dispatch
                        </span>
                        <span className="text-xs text-slate-600 font-medium">
                          Automatically assign incoming customer inquiries to available team members and AI bots.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Save Bar */}
            <div className="w-full bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(1,59,35,0.03)] flex items-center justify-between gap-4">
              <span className="text-xs sm:text-sm font-bold text-slate-600">
                Ensure all Meta compliance guidelines are maintained before updating.
              </span>
              <Button
                type="submit"
                size="lg"
                variant="primary"
                className="text-xs sm:text-sm font-extrabold rounded-xl px-8 py-3 shadow-xs cursor-pointer"
                isLoading={isSaving}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Update Business Profile
              </Button>
            </div>
          </form>
        )}
      </div>
    </PageContainer>
  );
};

