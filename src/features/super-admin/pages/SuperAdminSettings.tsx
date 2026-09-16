import React, { useState } from 'react';
import {
  ShieldAlert,
  Save,
  Globe,
  Cpu,
  CheckCircle2,
} from 'lucide-react';

import { PageContainer } from '../../../components/layout/PageContainer';

export const SuperAdminSettings: React.FC = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowPublicSignup, setAllowPublicSignup] = useState(true);
  const [defaultTrialDays, setDefaultTrialDays] = useState(14);
  const [globalRateLimit, setGlobalRateLimit] = useState(120);
  const [metaApiVersion, setMetaApiVersion] = useState('v20.0');
  const [primaryAiProvider, setPrimaryAiProvider] = useState('gemini');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <PageContainer className="space-y-6 text-[#1F2A26]">
      {/* Actions Toolbar */}
      <div className="flex items-center justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#05A222] hover:bg-[#006736] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] text-[#006736] text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#05A222]" />
          <span>Platform configuration updated successfully.</span>
        </div>
      )}

      {/* Maintenance Mode & Safety */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2EAE6] space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-[#14201C] flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-500" /> Platform Maintenance & Access
        </h3>

        <div className="divide-y divide-[#E2EAE6] text-xs">
          <div className="py-3.5 flex items-center justify-between">
            <div>
              <div className="font-bold text-[#14201C]">Platform Maintenance Mode</div>
              <p className="text-[#5F7069] mt-0.5">
                Temporarily pause tenant login and display a scheduled maintenance banner.
              </p>
            </div>
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="w-5 h-5 accent-[#05A222] cursor-pointer"
            />
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <div>
              <div className="font-bold text-[#14201C]">Public Organization Signups</div>
              <p className="text-[#5F7069] mt-0.5">
                Allow new business customers to register self-service from marketing landing page.
              </p>
            </div>
            <input
              type="checkbox"
              checked={allowPublicSignup}
              onChange={(e) => setAllowPublicSignup(e.target.checked)}
              className="w-5 h-5 accent-[#05A222] cursor-pointer"
            />
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <div>
              <div className="font-bold text-[#14201C]">Default Free Trial Duration (Days)</div>
              <p className="text-[#5F7069] mt-0.5">Duration assigned to newly registered tenants.</p>
            </div>
            <input
              type="number"
              value={defaultTrialDays}
              onChange={(e) => setDefaultTrialDays(Number(e.target.value))}
              className="w-24 bg-[#fafcfb] border border-[#E2EAE6] rounded-xl px-3 py-1.5 text-[#14201C] text-xs font-mono font-bold text-center focus:outline-none focus:border-[#05A222]"
            />
          </div>
        </div>
      </div>

      {/* Meta WhatsApp & AI Providers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Meta Cloud API */}
        <div className="p-6 rounded-2xl bg-white border border-[#E2EAE6] space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-[#14201C] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#05A222]" /> Meta WhatsApp Cloud API
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[#5F7069] font-bold block mb-1">Graph API Version</label>
              <select
                value={metaApiVersion}
                onChange={(e) => setMetaApiVersion(e.target.value)}
                className="w-full bg-[#fafcfb] border border-[#E2EAE6] rounded-xl px-3 py-2 text-[#14201C] font-semibold focus:outline-none focus:border-[#05A222] cursor-pointer"
              >
                <option value="v20.0">v20.0 (Current Stable)</option>
                <option value="v21.0">v21.0 (Preview)</option>
              </select>
            </div>
            <div>
              <label className="text-[#5F7069] font-bold block mb-1">
                Webhook Verify Token
              </label>
              <input
                type="text"
                readOnly
                value="wmsg_custom_webhook_verify_token_prod_2026"
                className="w-full bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl px-3 py-2 text-[#5F7069] font-mono select-all font-medium"
              />
            </div>
          </div>
        </div>

        {/* AI Inference Provider */}
        <div className="p-6 rounded-2xl bg-white border border-[#E2EAE6] space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-[#14201C] flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#006736]" /> AI LLM Gateway
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[#5F7069] font-bold block mb-1">
                Primary LLM Provider
              </label>
              <select
                value={primaryAiProvider}
                onChange={(e) => setPrimaryAiProvider(e.target.value)}
                className="w-full bg-[#fafcfb] border border-[#E2EAE6] rounded-xl px-3 py-2 text-[#14201C] font-semibold focus:outline-none focus:border-[#05A222] cursor-pointer"
              >
                <option value="gemini">Google Gemini 1.5 Pro / Flash</option>
                <option value="openai">OpenAI GPT-4o / GPT-4o-mini</option>
                <option value="anthropic">Anthropic Claude 3.5 Sonnet</option>
              </select>
            </div>
            <div>
              <label className="text-[#5F7069] font-bold block mb-1">
                Global API Rate Limit (req/min)
              </label>
              <input
                type="number"
                value={globalRateLimit}
                onChange={(e) => setGlobalRateLimit(Number(e.target.value))}
                className="w-full bg-[#fafcfb] border border-[#E2EAE6] rounded-xl px-3 py-2 text-[#14201C] font-mono font-bold focus:outline-none focus:border-[#05A222]"
              />
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
