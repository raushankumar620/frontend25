import React, { useState } from 'react';
import {
  Copy,
  Check,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  Server,
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

type EnvSubFilter = 'all' | 'vars' | 'table' | 'steps' | 'flow' | 'files' | 'security' | 'code' | 'checklist';

export const BackendSetup: React.FC = () => {
  const [selectedEnvTab, setSelectedEnvTab] = useState<EnvSubFilter>('all');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const envVariablesCode = `# WhatsAppMSG API Configuration
WMSG_API_BASE_URL=https://api.whatsappmsg.com/api/v1
WMSG_API_KEY=wmsg_live_your_api_key_here

# WhatsApp Business Configuration
WMSG_PHONE_NUMBER_ID=your_phone_number_id
WMSG_WABA_ID=your_waba_id

# Webhook Configuration
WMSG_WEBHOOK_SECRET=your_webhook_secret

# Your Application Configuration
APP_BASE_URL=https://yourdomain.com
PORT=5000`;

  const envExampleCode = `WMSG_API_BASE_URL=https://api.whatsappmsg.com/api/v1
WMSG_API_KEY=
WMSG_PHONE_NUMBER_ID=
WMSG_WABA_ID=
WMSG_WEBHOOK_SECRET=

APP_BASE_URL=http://localhost:5000
PORT=5000`;

  const gitignoreCode = `.env
.env.*
!.env.example`;

  const nodeClientCode = `import axios from "axios";

const whatsappmsg = axios.create({
  baseURL: process.env.WMSG_API_BASE_URL,
  headers: {
    "x-api-key": process.env.WMSG_API_KEY,
    "Content-Type": "application/json",
  },
});

export default whatsappmsg;`;

  const nodeExampleRequestCode = `const response = await whatsappmsg.post("/messages", {
  to: "+15551234567",
  type: "text",
  text: "Hello from my backend application!",
});

console.log(response.data);`;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Banner / Hero */}
      <div className="bg-white border border-[#E2EAE6] p-6 rounded-3xl shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#006736] shrink-0 font-bold shadow-2xs">
              <Server className="w-6 h-6 text-[#05A222]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-[#14201C] tracking-tight">
                  Backend Environment Setup (.env)
                </h3>
                <span className="px-2 py-0.5 rounded-full font-mono font-bold text-[10px] bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]">
                  Production Ready
                </span>
              </div>
              <p className="text-xs text-[#5F7069] mt-0.5 font-medium">
                Configure your backend environment with the credentials required to connect your server with WhatsAppMSG API.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to={ROUTES.DEVELOPERS_API_KEYS}>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<KeyRound className="w-3.5 h-3.5 text-[#05A222]" />}
                className="text-xs font-bold text-[#006736] border-[#E2EAE6] hover:bg-[#E9F9EE]"
              >
                Get API Keys
              </Button>
            </Link>
            <Link to={ROUTES.DEVELOPERS_DOCS}>
              <Button
                size="sm"
                variant="primary"
                leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
                className="text-xs font-bold bg-[#05A222] hover:bg-[#006736] text-white"
              >
                API Docs
              </Button>
            </Link>
          </div>
        </div>

        {/* Section Filter Pills */}
        <div className="pt-2 border-t border-[#E2EAE6]/60 flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'Full Guide' },
            { id: 'vars', label: '.env Configuration' },
            { id: 'table', label: 'Credentials Mapping' },
            { id: 'steps', label: 'Step-by-Step Setup' },
            { id: 'flow', label: 'Integration Architecture' },
            { id: 'files', label: '.env.example & .gitignore' },
            { id: 'security', label: 'Security Best Practices' },
            { id: 'code', label: 'Node.js Axios Setup' },
            { id: 'checklist', label: 'Launch Checklist' },
          ].map((subTab) => (
            <button
              key={subTab.id}
              onClick={() => setSelectedEnvTab(subTab.id as EnvSubFilter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedEnvTab === subTab.id
                  ? 'bg-[#006736] text-white shadow-xs font-bold'
                  : 'text-[#5F7069] hover:text-[#14201C] bg-[#F8FAFC] border border-[#E2EAE6] hover:bg-white'
              }`}
            >
              {subTab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Environment Variables */}
      {(selectedEnvTab === 'all' || selectedEnvTab === 'vars') && (
        <div className="bg-white border border-[#E2EAE6] p-6 rounded-3xl shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#05A222] shrink-0 font-bold">
                1
              </div>
              <div>
                <h5 className="text-sm font-bold text-[#14201C]">Environment Variables (.env)</h5>
                <p className="text-xs text-[#5F7069]">Add the following configuration to your backend <code className="text-[#006736] font-mono bg-[#E9F9EE] px-1 py-0.2 rounded font-bold">.env</code> file.</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCopy('env_vars', envVariablesCode)}
              leftIcon={copiedSection === 'env_vars' ? <Check className="w-3.5 h-3.5 text-[#05A222]" /> : <Copy className="w-3.5 h-3.5" />}
              className="text-xs font-bold text-[#006736] border-[#E2EAE6] hover:bg-[#E9F9EE]"
            >
              {copiedSection === 'env_vars' ? 'Copied' : 'Copy'}
            </Button>
          </div>

          <pre className="p-4 bg-[#14201C] rounded-2xl font-mono text-xs text-[#6AEB31] overflow-x-auto border border-[#2B3A34] shadow-inner leading-relaxed">
            {envVariablesCode}
          </pre>
        </div>
      )}

      {/* 2. Portal Credentials vs Developer Configuration Table */}
      {(selectedEnvTab === 'all' || selectedEnvTab === 'table') && (
        <div className="bg-white border border-[#E2EAE6] p-6 rounded-3xl shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#05A222] shrink-0 font-bold">
              2
            </div>
            <div>
              <h5 className="text-sm font-bold text-[#14201C]">Portal Credentials vs Developer Configuration</h5>
              <p className="text-xs text-[#5F7069]">Where to find each credential in the portal and where to place it in your code.</p>
            </div>
          </div>

          <div className="overflow-x-auto border border-[#E2EAE6] rounded-2xl bg-white shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F8FAFC] border-b border-[#E2EAE6] text-[#64748B] font-semibold text-[11px] tracking-wide">
                <tr>
                  <th className="px-4 py-3">Variable</th>
                  <th className="px-4 py-3">Provided By</th>
                  <th className="px-4 py-3">Developer Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EAE6] text-[#1E293B]">
                <tr>
                  <td className="px-4 py-3 font-mono font-bold text-[#006736]">WMSG_API_BASE_URL</td>
                  <td className="px-4 py-3 font-medium text-[#64748B]">WhatsAppMSG Portal / Developer Docs</td>
                  <td className="px-4 py-3 font-semibold text-[#0F172A]">Add to <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">.env</code></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono font-bold text-[#006736]">WMSG_API_KEY</td>
                  <td className="px-4 py-3 font-medium text-[#64748B]">WhatsAppMSG Portal → API Keys</td>
                  <td className="px-4 py-3 font-semibold text-[#0F172A]">Copy generated API key</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono font-bold text-[#006736]">WMSG_PHONE_NUMBER_ID</td>
                  <td className="px-4 py-3 font-medium text-[#64748B]">WhatsAppMSG Portal → WhatsApp Account</td>
                  <td className="px-4 py-3 font-semibold text-[#0F172A]">Copy into <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">.env</code> if required</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono font-bold text-[#006736]">WMSG_WABA_ID</td>
                  <td className="px-4 py-3 font-medium text-[#64748B]">WhatsAppMSG Portal → WhatsApp Account</td>
                  <td className="px-4 py-3 font-semibold text-[#0F172A]">Copy into <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">.env</code> if required</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono font-bold text-[#006736]">WMSG_WEBHOOK_SECRET</td>
                  <td className="px-4 py-3 font-medium text-[#64748B]">WhatsAppMSG Portal → Webhook Configuration</td>
                  <td className="px-4 py-3 font-semibold text-[#0F172A]">Copy into <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">.env</code></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono font-bold text-[#006736]">APP_BASE_URL</td>
                  <td className="px-4 py-3 font-medium text-[#64748B]">Developer</td>
                  <td className="px-4 py-3 font-semibold text-[#0F172A]">Configure own application URL</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono font-bold text-[#006736]">PORT</td>
                  <td className="px-4 py-3 font-medium text-[#64748B]">Developer</td>
                  <td className="px-4 py-3 font-semibold text-[#0F172A]">Configure own backend port</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Get Your WhatsAppMSG Credentials (Numbered Steps) */}
      {(selectedEnvTab === 'all' || selectedEnvTab === 'steps') && (
        <div className="bg-white border border-[#E2EAE6] p-6 rounded-3xl shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#05A222] shrink-0 font-bold">
              3
            </div>
            <div>
              <h5 className="text-sm font-bold text-[#14201C]">Step-by-Step Setup Guide</h5>
              <p className="text-xs text-[#5F7069]">Follow these 6 steps to link your backend server with WhatsAppMSG API.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2EAE6] space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#05A222] text-white text-[10px] font-bold flex items-center justify-center">1</span>
                <h6 className="text-xs font-bold text-[#0F172A]">Login to Portal</h6>
              </div>
              <p className="text-[11px] text-[#64748B] pl-7">Sign in to your WhatsAppMSG business account.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2EAE6] space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#05A222] text-white text-[10px] font-bold flex items-center justify-center">2</span>
                <h6 className="text-xs font-bold text-[#0F172A]">Open API Settings</h6>
              </div>
              <p className="text-[11px] text-[#64748B] pl-7">Open Developer / API section from your dashboard.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2EAE6] space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#05A222] text-white text-[10px] font-bold flex items-center justify-center">3</span>
                <h6 className="text-xs font-bold text-[#0F172A]">Generate API Key</h6>
              </div>
              <p className="text-[11px] text-[#64748B] pl-7">Create a new live API key for your application.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2EAE6] space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#05A222] text-white text-[10px] font-bold flex items-center justify-center">4</span>
                <h6 className="text-xs font-bold text-[#0F172A]">Copy Credentials</h6>
              </div>
              <p className="text-[11px] text-[#64748B] pl-7">Copy API key & WhatsApp Business IDs.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2EAE6] space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#05A222] text-white text-[10px] font-bold flex items-center justify-center">5</span>
                <h6 className="text-xs font-bold text-[#0F172A]">Add to .env</h6>
              </div>
              <p className="text-[11px] text-[#64748B] pl-7">Paste credentials into your backend environment file.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2EAE6] space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#05A222] text-white text-[10px] font-bold flex items-center justify-center">6</span>
                <h6 className="text-xs font-bold text-[#0F172A]">Restart Server</h6>
              </div>
              <p className="text-[11px] text-[#64748B] pl-7">Restart your backend server to load new variables.</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Portal → Backend Connection Flow */}
      {(selectedEnvTab === 'all' || selectedEnvTab === 'flow') && (
        <div className="bg-white border border-[#E2EAE6] p-6 rounded-3xl shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#05A222] shrink-0 font-bold">
              4
            </div>
            <div>
              <h5 className="text-sm font-bold text-[#14201C]">Portal → Backend Connection Flow</h5>
              <p className="text-xs text-[#5F7069]">High-level request lifecycle from portal to WhatsApp Meta Cloud.</p>
            </div>
          </div>

          <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2EAE6]">
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold">
              <span className="px-3 py-1.5 rounded-xl bg-white border border-[#E2EAE6] text-[#0F172A] shadow-2xs font-bold">
                WhatsAppMSG Portal
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#05A222]" />
              <span className="px-3 py-1.5 rounded-xl bg-white border border-[#E2EAE6] text-[#64748B]">
                Developer / API Settings
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#05A222]" />
              <span className="px-3 py-1.5 rounded-xl bg-white border border-[#E2EAE6] text-[#64748B]">
                Generate API Key
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#05A222]" />
              <span className="px-3 py-1.5 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] text-[#006736] font-bold">
                Backend .env
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#05A222]" />
              <span className="px-3 py-1.5 rounded-xl bg-white border border-[#E2EAE6] text-[#0F172A] font-bold">
                Developer Backend
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#05A222]" />
              <span className="px-3 py-1.5 rounded-xl bg-[#006736] text-white font-bold shadow-2xs">
                WhatsAppMSG API
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#05A222]" />
              <span className="px-3 py-1.5 rounded-xl bg-[#05A222] text-white font-bold shadow-2xs">
                WhatsApp
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5 & 6: .env.example & .gitignore */}
      {(selectedEnvTab === 'all' || selectedEnvTab === 'files') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 5. .env.example */}
          <div className="bg-white border border-[#E2EAE6] p-6 rounded-3xl shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-[#14201C]">.env.example</h5>
                <p className="text-[11px] text-[#64748B]">Use as a safe template for your project. Never commit real keys.</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopy('env_example', envExampleCode)}
                leftIcon={copiedSection === 'env_example' ? <Check className="w-3 h-3 text-[#05A222]" /> : <Copy className="w-3 h-3" />}
                className="text-[11px] font-bold text-[#006736] border-[#E2EAE6] hover:bg-[#E9F9EE] px-2.5 py-1"
              >
                {copiedSection === 'env_example' ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <pre className="p-3.5 bg-[#14201C] rounded-2xl font-mono text-xs text-[#6AEB31] overflow-x-auto border border-[#2B3A34] shadow-inner leading-relaxed">
              {envExampleCode}
            </pre>
          </div>

          {/* 6. .gitignore */}
          <div className="bg-white border border-[#E2EAE6] p-6 rounded-3xl shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-[#14201C]">.gitignore</h5>
                <p className="text-[11px] text-[#64748B]">Keep your real .env file out of version control.</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopy('gitignore', gitignoreCode)}
                leftIcon={copiedSection === 'gitignore' ? <Check className="w-3 h-3 text-[#05A222]" /> : <Copy className="w-3 h-3" />}
                className="text-[11px] font-bold text-[#006736] border-[#E2EAE6] hover:bg-[#E9F9EE] px-2.5 py-1"
              >
                {copiedSection === 'gitignore' ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <pre className="p-3.5 bg-[#14201C] rounded-2xl font-mono text-xs text-[#6AEB31] overflow-x-auto border border-[#2B3A34] shadow-inner leading-relaxed">
              {gitignoreCode}
            </pre>
          </div>
        </div>
      )}

      {/* 7. Security Warning Card */}
      {(selectedEnvTab === 'all' || selectedEnvTab === 'security') && (
        <div className="p-6 rounded-3xl bg-[#FFF8E6] border border-[#FFE299] space-y-3 shadow-2xs">
          <div className="flex items-center gap-2.5 text-[#9A6B00]">
            <ShieldAlert className="w-5 h-5 shrink-0 text-[#D99A00]" />
            <h5 className="text-sm font-bold text-[#9A6B00]">Keep Your API Key Secret</h5>
          </div>
          <p className="text-xs text-[#1F2A26] font-medium leading-relaxed">
            Your <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#FFE299] font-bold text-[#9A6B00]">WMSG_API_KEY</code> is a private server credential. Store it only in your backend environment and never expose it to clients.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#5F7069] font-medium list-disc pl-4">
            <li>Never expose the API key in React/Vite frontend code.</li>
            <li>Never put the API key in browser JavaScript.</li>
            <li>Never store the API key inside a mobile application.</li>
            <li>Never commit <code className="font-mono">.env</code> to GitHub.</li>
            <li>Never share production API keys publicly.</li>
            <li>Never return the API key from a frontend API response.</li>
          </ul>

          <div className="pt-2 border-t border-[#FFE299]/60">
            <span className="text-[11px] font-bold text-[#9A6B00] uppercase tracking-wider">Recommended Architecture:</span>
            <div className="mt-1.5 flex items-center gap-2 text-xs font-mono font-bold text-[#14201C] flex-wrap">
              <span className="px-2.5 py-1 bg-white rounded-lg border border-[#FFE299]">Frontend</span>
              <span>→</span>
              <span className="px-2.5 py-1 bg-white rounded-lg border border-[#FFE299]">Your Backend</span>
              <span>→</span>
              <span className="px-2.5 py-1 bg-[#E9F9EE] text-[#006736] rounded-lg border border-[#C4EBD0]">WMSG_API_KEY</span>
              <span>→</span>
              <span className="px-2.5 py-1 bg-[#05A222] text-white rounded-lg">WhatsAppMSG API</span>
            </div>
          </div>
        </div>
      )}

      {/* 8. Node.js Backend Configuration */}
      {(selectedEnvTab === 'all' || selectedEnvTab === 'code') && (
        <div className="bg-white border border-[#E2EAE6] p-6 rounded-3xl shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#05A222] shrink-0 font-bold">
              5
            </div>
            <div>
              <h5 className="text-sm font-bold text-[#14201C]">Node.js Backend Configuration</h5>
              <p className="text-xs text-[#5F7069]">Axios instance client setup and example API request.</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#5F7069]">Axios Instance Client Setup</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopy('node_client', nodeClientCode)}
                leftIcon={copiedSection === 'node_client' ? <Check className="w-3.5 h-3.5 text-[#05A222]" /> : <Copy className="w-3.5 h-3.5" />}
                className="text-xs font-bold text-[#006736] border-[#E2EAE6] hover:bg-[#E9F9EE]"
              >
                {copiedSection === 'node_client' ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <pre className="p-4 bg-[#14201C] rounded-2xl font-mono text-xs text-[#6AEB31] overflow-x-auto border border-[#2B3A34] shadow-inner leading-relaxed">
              {nodeClientCode}
            </pre>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-[#5F7069]">Example API Request</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopy('node_req', nodeExampleRequestCode)}
                leftIcon={copiedSection === 'node_req' ? <Check className="w-3.5 h-3.5 text-[#05A222]" /> : <Copy className="w-3.5 h-3.5" />}
                className="text-xs font-bold text-[#006736] border-[#E2EAE6] hover:bg-[#E9F9EE]"
              >
                {copiedSection === 'node_req' ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <pre className="p-4 bg-[#14201C] rounded-2xl font-mono text-xs text-[#6AEB31] overflow-x-auto border border-[#2B3A34] shadow-inner leading-relaxed">
              {nodeExampleRequestCode}
            </pre>
          </div>
        </div>
      )}

      {/* 9. Developer Setup Checklist */}
      {(selectedEnvTab === 'all' || selectedEnvTab === 'checklist') && (
        <div className="p-6 rounded-3xl bg-white border border-[#E2EAE6] space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 text-[#006736]">
            <CheckCircle2 className="w-5 h-5 text-[#05A222]" />
            <h5 className="text-sm font-bold text-[#0F172A]">Pre-Flight Developer Setup Checklist</h5>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-medium text-[#1E293B]">
            <label className="flex items-center gap-2.5 cursor-pointer p-2 rounded-xl hover:bg-[#F8FAFC]">
              <input type="checkbox" defaultChecked className="rounded text-[#05A222] focus:ring-[#05A222]" />
              <span>WhatsAppMSG account is active</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer p-2 rounded-xl hover:bg-[#F8FAFC]">
              <input type="checkbox" defaultChecked className="rounded text-[#05A222] focus:ring-[#05A222]" />
              <span>WhatsApp number is connected</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer p-2 rounded-xl hover:bg-[#F8FAFC]">
              <input type="checkbox" defaultChecked className="rounded text-[#05A222] focus:ring-[#05A222]" />
              <span>API key has been generated</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer p-2 rounded-xl hover:bg-[#F8FAFC]">
              <input type="checkbox" defaultChecked className="rounded text-[#05A222] focus:ring-[#05A222]" />
              <span>API Base URL is configured</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer p-2 rounded-xl hover:bg-[#F8FAFC]">
              <input type="checkbox" defaultChecked className="rounded text-[#05A222] focus:ring-[#05A222]" />
              <span>Required WhatsApp Business IDs are configured</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer p-2 rounded-xl hover:bg-[#F8FAFC]">
              <input type="checkbox" defaultChecked className="rounded text-[#05A222] focus:ring-[#05A222]" />
              <span><code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[11px]">.env</code> file is created</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer p-2 rounded-xl hover:bg-[#F8FAFC]">
              <input type="checkbox" defaultChecked className="rounded text-[#05A222] focus:ring-[#05A222]" />
              <span><code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[11px]">.env</code> is added to <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[11px]">.gitignore</code></span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer p-2 rounded-xl hover:bg-[#F8FAFC]">
              <input type="checkbox" defaultChecked className="rounded text-[#05A222] focus:ring-[#05A222]" />
              <span>API key is stored only on the backend</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer p-2 rounded-xl hover:bg-[#F8FAFC]">
              <input type="checkbox" defaultChecked className="rounded text-[#05A222] focus:ring-[#05A222]" />
              <span>Backend has been restarted</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer p-2 rounded-xl hover:bg-[#F8FAFC]">
              <input type="checkbox" defaultChecked className="rounded text-[#05A222] focus:ring-[#05A222]" />
              <span>Test API request is ready</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
