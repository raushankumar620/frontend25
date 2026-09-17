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
  ListTree,
  Layers,
  Network,
  FolderGit2,
  Code2,
  BookOpen,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

type EnvSubFilter = 'all' | 'vars' | 'table' | 'steps' | 'flow' | 'files' | 'security' | 'code' | 'checklist';

const highlightPostmanEnv = (envText: string): string => {
  const escaped = envText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escaped
    .split('\n')
    .map((line) => {
      if (line.startsWith('#')) {
        return `<span class="text-[#94A3B8] italic font-medium">${line}</span>`;
      }
      if (line.includes('=')) {
        const [key, ...vals] = line.split('=');
        const val = vals.join('=');
        return `<span class="text-[#A31515] font-bold">${key}</span><span class="text-[#64748B]">=</span><span class="text-[#006736] font-medium">${val}</span>`;
      }
      return line;
    })
    .join('\n');
};

const highlightPostmanJs = (codeText: string): string => {
  const escaped = codeText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escaped
    .replace(/(#.*|\/\/.*)/g, '<span class="text-[#94A3B8] italic">$1</span>')
    .replace(
      /\b(import|from|const|let|var|await|async|function|return|export|default|process)\b/g,
      '<span class="text-[#7C3AED] font-bold">$1</span>'
    )
    .replace(
      /"([a-zA-Z0-9_]+)"\s*:/g,
      '<span class="text-[#A31515] font-bold">"$1"</span><span class="text-[#64748B]">:</span>'
    )
    .replace(/(["'])(?:(?=(\\?))\2[\s\S])*?\1/g, (match) => {
      return `<span class="text-[#006736] font-medium">${match}</span>`;
    })
    .replace(/\b(axios|whatsappmsg|console)\b/g, '<span class="text-[#005CC5] font-bold">$1</span>');
};

export const BackendSetup: React.FC = () => {
  const [selectedEnvTab, setSelectedEnvTab] = useState<EnvSubFilter>('all');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const envVariablesCode = `# WhatsAppMSG API Configuration
WMSG_API_BASE_URL=https://whatsappmsg.com/api/v1
WMSG_API_KEY=wmsg_live_your_api_key_here

# WhatsApp Business Configuration
WMSG_PHONE_NUMBER_ID=your_phone_number_id
WMSG_WABA_ID=your_waba_id

# Webhook Configuration
WMSG_WEBHOOK_SECRET=your_webhook_secret

# Your Application Configuration
APP_BASE_URL=https://yourdomain.com
PORT=5000`;

  const envExampleCode = `WMSG_API_BASE_URL=https://whatsappmsg.com/api/v1
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
  to: "+919876543210",
  type: "text",
  text: "Hello from my backend application!",
});

console.log(response.data);`;

  const tocSections: {
    id: EnvSubFilter;
    label: string;
    icon: any;
    count: string;
    activeClasses: string;
    badgeActive: string;
    badgeInactive: string;
    iconColor: string;
    iconBg: string;
  }[] = [
    {
      id: 'all',
      label: 'Full Guide',
      icon: ListTree,
      count: 'All',
      activeClasses: 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold shadow-2xs',
      badgeActive: 'bg-emerald-600 text-white shadow-2xs',
      badgeInactive: 'bg-emerald-100/70 text-emerald-800 border border-emerald-200/70',
      iconColor: 'text-emerald-700',
      iconBg: 'bg-emerald-100/80',
    },
    {
      id: 'vars',
      label: '.env Configuration',
      icon: Server,
      count: '.env',
      activeClasses: 'bg-indigo-50 text-indigo-900 border-indigo-300 font-bold shadow-2xs',
      badgeActive: 'bg-indigo-600 text-white shadow-2xs',
      badgeInactive: 'bg-indigo-100/70 text-indigo-800 border border-indigo-200/70',
      iconColor: 'text-indigo-700',
      iconBg: 'bg-indigo-100/80',
    },
    {
      id: 'table',
      label: 'Credentials Mapping',
      icon: KeyRound,
      count: '7 Keys',
      activeClasses: 'bg-amber-50 text-amber-900 border-amber-300 font-bold shadow-2xs',
      badgeActive: 'bg-amber-600 text-white shadow-2xs',
      badgeInactive: 'bg-amber-100/70 text-amber-800 border border-amber-200/70',
      iconColor: 'text-amber-700',
      iconBg: 'bg-amber-100/80',
    },
    {
      id: 'steps',
      label: 'Step-by-Step Setup',
      icon: Layers,
      count: '6 Steps',
      activeClasses: 'bg-sky-50 text-sky-900 border-sky-300 font-bold shadow-2xs',
      badgeActive: 'bg-sky-600 text-white shadow-2xs',
      badgeInactive: 'bg-sky-100/70 text-sky-800 border border-sky-200/70',
      iconColor: 'text-sky-700',
      iconBg: 'bg-sky-100/80',
    },
    {
      id: 'flow',
      label: 'Integration Architecture',
      icon: Network,
      count: 'Flow',
      activeClasses: 'bg-purple-50 text-purple-900 border-purple-300 font-bold shadow-2xs',
      badgeActive: 'bg-purple-600 text-white shadow-2xs',
      badgeInactive: 'bg-purple-100/70 text-purple-800 border border-purple-200/70',
      iconColor: 'text-purple-700',
      iconBg: 'bg-purple-100/80',
    },
    {
      id: 'files',
      label: '.env.example & .gitignore',
      icon: FolderGit2,
      count: '2 Files',
      activeClasses: 'bg-teal-50 text-teal-900 border-teal-300 font-bold shadow-2xs',
      badgeActive: 'bg-teal-600 text-white shadow-2xs',
      badgeInactive: 'bg-teal-100/70 text-teal-800 border border-teal-200/70',
      iconColor: 'text-teal-700',
      iconBg: 'bg-teal-100/80',
    },
    {
      id: 'security',
      label: 'Security Best Practices',
      icon: ShieldAlert,
      count: '5 Rules',
      activeClasses: 'bg-orange-50 text-orange-900 border-orange-300 font-bold shadow-2xs',
      badgeActive: 'bg-orange-600 text-white shadow-2xs',
      badgeInactive: 'bg-orange-100/70 text-orange-800 border border-orange-200/70',
      iconColor: 'text-orange-700',
      iconBg: 'bg-orange-100/80',
    },
    {
      id: 'code',
      label: 'Node.js Axios Setup',
      icon: Code2,
      count: 'Axios',
      activeClasses: 'bg-blue-50 text-blue-900 border-blue-300 font-bold shadow-2xs',
      badgeActive: 'bg-blue-600 text-white shadow-2xs',
      badgeInactive: 'bg-blue-100/70 text-blue-800 border border-blue-200/70',
      iconColor: 'text-blue-700',
      iconBg: 'bg-blue-100/80',
    },
    {
      id: 'checklist',
      label: 'Launch Checklist',
      icon: CheckCircle2,
      count: '10 Items',
      activeClasses: 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold shadow-2xs',
      badgeActive: 'bg-emerald-600 text-white shadow-2xs',
      badgeInactive: 'bg-emerald-100/70 text-emerald-800 border border-emerald-200/70',
      iconColor: 'text-emerald-700',
      iconBg: 'bg-emerald-100/80',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Top Banner / Hero */}
      <div className="bg-white border border-[#E2EAE6] p-4 sm:p-5 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-extrabold text-[#14201C] tracking-tight">
              Backend Environment Setup (.env)
            </h3>
            <span className="px-2 py-0.5 rounded-full font-mono font-bold text-[10px] bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]">
              Production Ready
            </span>
          </div>
          <p className="text-xs text-[#5F7069] mt-0.5 font-medium">
            Configure your backend environment with credentials required to connect your server with WhatsAppMSG API.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link to={ROUTES.DEVELOPERS_API_KEYS}>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<KeyRound className="w-3.5 h-3.5 text-[#05A222]" />}
              className="text-xs font-bold text-[#006736] border-[#E2EAE6] hover:bg-[#E9F9EE] px-3 h-8.5"
            >
              Get API Keys
            </Button>
          </Link>
          <Link to={ROUTES.DEVELOPERS_DOCS}>
            <Button
              size="sm"
              variant="primary"
              leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
              className="text-xs font-bold bg-[#05A222] hover:bg-[#006736] text-white px-3.5 h-8.5"
            >
              API Docs
            </Button>
          </Link>
        </div>
      </div>

      {/* Main 2-Column Grid (Left Content + Right Table of Contents) */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left / Center: Setup Guide Content */}
        <div className="flex-1 min-w-0 space-y-6 w-full">
          {/* 1. Environment Variables */}
          {(selectedEnvTab === 'all' || selectedEnvTab === 'vars') && (
            <div id="vars" className="bg-white border border-[#E2EAE6] hover:border-[#C4EBD0] transition-all p-5 sm:p-6 rounded-2xl shadow-[0_4px_20px_rgba(1,59,35,0.03)] space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2EAE6] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 shrink-0 font-bold">
                    <Server className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#14201C]">1. Environment Variables (.env)</h4>
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

              <div className="rounded-xl overflow-hidden border border-[#E2EAE6] bg-[#F8FAFC] shadow-2xs">
                <div className="flex items-center justify-between px-4 py-2 bg-[#F1F5F9] border-b border-[#E2EAE6] text-xs font-mono text-[#475569]">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#05A222]"></span>
                    <span className="font-semibold">.env Configuration File</span>
                  </span>
                  <span className="text-[11px] text-[#64748B]">UTF-8 Text</span>
                </div>
                <div className="p-4 bg-white overflow-x-auto">
                  <pre
                    dangerouslySetInnerHTML={{ __html: highlightPostmanEnv(envVariablesCode) }}
                    className="font-mono text-xs text-[#0F172A] leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. Portal Credentials vs Developer Configuration Table */}
          {(selectedEnvTab === 'all' || selectedEnvTab === 'table') && (
            <div id="table" className="bg-white border border-[#E2EAE6] hover:border-[#C4EBD0] transition-all p-5 sm:p-6 rounded-2xl shadow-[0_4px_20px_rgba(1,59,35,0.03)] space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2EAE6] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 font-bold">
                    <KeyRound className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#14201C]">2. Credentials Mapping</h4>
                    <p className="text-xs text-[#5F7069]">Where to find each credential in the portal and where to place it in your code.</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  7 Keys
                </span>
              </div>

              <div className="overflow-x-auto border border-[#E2EAE6] rounded-xl bg-white shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2EAE6] text-[#64748B] font-semibold text-[11px] tracking-wide uppercase">
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
            <div id="steps" className="bg-white border border-[#E2EAE6] hover:border-[#C4EBD0] transition-all p-5 sm:p-6 rounded-2xl shadow-[0_4px_20px_rgba(1,59,35,0.03)] space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2EAE6] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0 font-bold">
                    <Layers className="w-4 h-4 text-sky-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#14201C]">3. Step-by-Step Setup Guide</h4>
                    <p className="text-xs text-[#5F7069]">Follow these 6 steps to link your backend server with WhatsAppMSG API.</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                  6 Steps
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2EAE6] space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#05A222] text-white text-[10px] font-bold flex items-center justify-center">1</span>
                    <h6 className="text-xs font-bold text-[#0F172A]">Login to Portal</h6>
                  </div>
                  <p className="text-[11px] text-[#64748B] pl-7">Sign in to your WhatsAppMSG business account.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2EAE6] space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#05A222] text-white text-[10px] font-bold flex items-center justify-center">2</span>
                    <h6 className="text-xs font-bold text-[#0F172A]">Open API Settings</h6>
                  </div>
                  <p className="text-[11px] text-[#64748B] pl-7">Open Developer / API section from your dashboard.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2EAE6] space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#05A222] text-white text-[10px] font-bold flex items-center justify-center">3</span>
                    <h6 className="text-xs font-bold text-[#0F172A]">Generate API Key</h6>
                  </div>
                  <p className="text-[11px] text-[#64748B] pl-7">Create a new live API key for your application.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2EAE6] space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#05A222] text-white text-[10px] font-bold flex items-center justify-center">4</span>
                    <h6 className="text-xs font-bold text-[#0F172A]">Copy Credentials</h6>
                  </div>
                  <p className="text-[11px] text-[#64748B] pl-7">Copy API key & WhatsApp Business IDs.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2EAE6] space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#05A222] text-white text-[10px] font-bold flex items-center justify-center">5</span>
                    <h6 className="text-xs font-bold text-[#0F172A]">Add to .env</h6>
                  </div>
                  <p className="text-[11px] text-[#64748B] pl-7">Paste credentials into your backend environment file.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2EAE6] space-y-1">
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
            <div id="flow" className="bg-white border border-[#E2EAE6] hover:border-[#C4EBD0] transition-all p-5 sm:p-6 rounded-2xl shadow-[0_4px_20px_rgba(1,59,35,0.03)] space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2EAE6] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0 font-bold">
                    <Network className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#14201C]">4. Integration Architecture</h4>
                    <p className="text-xs text-[#5F7069]">High-level request lifecycle from portal to WhatsApp Meta Cloud.</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                  Data Flow
                </span>
              </div>

              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2EAE6]">
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
                    WhatsApp Cloud
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 5 & 6: .env.example & .gitignore */}
          {(selectedEnvTab === 'all' || selectedEnvTab === 'files') && (
            <div id="files" className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* .env.example */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-[0_4px_20px_rgba(1,59,35,0.03)] space-y-3">
                <div className="flex items-center justify-between border-b border-[#E2EAE6] pb-2.5">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-teal-600" />
                    <div>
                      <h5 className="text-xs font-bold text-[#14201C]">.env.example</h5>
                      <p className="text-[10px] text-[#64748B]">Safe template for team collaboration.</p>
                    </div>
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
                <div className="p-3.5 bg-white rounded-xl overflow-x-auto border border-[#E2EAE6] shadow-2xs">
                  <pre
                    dangerouslySetInnerHTML={{ __html: highlightPostmanEnv(envExampleCode) }}
                    className="font-mono text-xs text-[#0F172A] leading-relaxed"
                  />
                </div>
              </div>

              {/* .gitignore */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-[0_4px_20px_rgba(1,59,35,0.03)] space-y-3">
                <div className="flex items-center justify-between border-b border-[#E2EAE6] pb-2.5">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-teal-600" />
                    <div>
                      <h5 className="text-xs font-bold text-[#14201C]">.gitignore</h5>
                      <p className="text-[10px] text-[#64748B]">Keep credentials out of git.</p>
                    </div>
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
                <div className="p-3.5 bg-white rounded-xl overflow-x-auto border border-[#E2EAE6] shadow-2xs">
                  <pre
                    dangerouslySetInnerHTML={{ __html: highlightPostmanEnv(gitignoreCode) }}
                    className="font-mono text-xs text-[#0F172A] leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 7. Security Warning Card */}
          {(selectedEnvTab === 'all' || selectedEnvTab === 'security') && (
            <div id="security" className="p-5 sm:p-6 rounded-2xl bg-[#FFF8E6] border border-[#FFE299] space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#FFE299]/60 pb-2.5">
                <div className="flex items-center gap-2.5 text-[#9A6B00]">
                  <ShieldAlert className="w-5 h-5 shrink-0 text-[#D99A00]" />
                  <h5 className="text-sm font-bold text-[#9A6B00]">Security Best Practices</h5>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-100 text-[#9A6B00] border border-[#FFE299]">
                  5 Rules
                </span>
              </div>
              <p className="text-xs text-[#1F2A26] font-medium leading-relaxed">
                Your <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#FFE299] font-bold text-[#9A6B00]">WMSG_API_KEY</code> is a private server credential. Store it only in your backend environment and never expose it to clients.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#5F7069] font-medium list-disc pl-4">
                <li>Never expose the API key in React/Vite frontend code.</li>
                <li>Never put the API key in browser JavaScript.</li>
                <li>Never store the API key inside a mobile application.</li>
                <li>Never commit <code className="font-mono">.env</code> to GitHub.</li>
                <li>Never return the API key from a public API response.</li>
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
            <div id="code" className="bg-white border border-[#E2EAE6] hover:border-[#C4EBD0] transition-all p-5 sm:p-6 rounded-2xl shadow-[0_4px_20px_rgba(1,59,35,0.03)] space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2EAE6] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 font-bold">
                    <Code2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#14201C]">Node.js Axios Setup</h4>
                    <p className="text-xs text-[#5F7069]">Axios instance client setup and example API request.</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  Axios Client
                </span>
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
                <div className="p-4 bg-white rounded-xl overflow-x-auto border border-[#E2EAE6] shadow-2xs">
                  <pre
                    dangerouslySetInnerHTML={{ __html: highlightPostmanJs(nodeClientCode) }}
                    className="font-mono text-xs text-[#0F172A] leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-semibold text-[#5F7069]">Example Outbound API Request</span>
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
                <div className="p-4 bg-white rounded-xl overflow-x-auto border border-[#E2EAE6] shadow-2xs">
                  <pre
                    dangerouslySetInnerHTML={{ __html: highlightPostmanJs(nodeExampleRequestCode) }}
                    className="font-mono text-xs text-[#0F172A] leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 9. Developer Setup Checklist */}
          {(selectedEnvTab === 'all' || selectedEnvTab === 'checklist') && (
            <div id="checklist" className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E2EAE6] space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#E2EAE6] pb-3">
                <div className="flex items-center gap-2.5 text-[#006736]">
                  <CheckCircle2 className="w-5 h-5 text-[#05A222]" />
                  <h5 className="text-sm font-bold text-[#0F172A]">Pre-Flight Developer Setup Checklist</h5>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  10 Items
                </span>
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
                  <span>Required WhatsApp Business IDs configured</span>
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

        {/* Right Sidebar: Table of Contents & Quick Nav (matching Documentation.tsx style) */}
        <div className="w-full lg:w-64 xl:w-72 shrink-0 lg:sticky lg:top-6 space-y-4">
          {/* Table of Contents Box */}
          <div className="bg-white border border-[#E2EAE6] p-4 rounded-2xl shadow-[0_4px_20px_rgba(1,59,35,0.03)] space-y-3">
            <div className="flex items-center justify-between border-b border-[#E2EAE6] pb-2.5">
              <div className="flex items-center gap-2">
                <ListTree className="w-4 h-4 text-[#006736]" />
                <h4 className="text-xs font-black uppercase tracking-wider text-[#14201C]">
                  Setup Navigation
                </h4>
              </div>
              <span className="text-[10px] font-bold text-[#5F7069] bg-[#F8FAFC] px-1.5 py-0.5 rounded border border-[#E2EAE6]">
                Quick Nav
              </span>
            </div>

            {/* Navigation List Items */}
            <nav className="space-y-1.5">
              {tocSections.map((item) => {
                const IconComponent = item.icon;
                const isActive = selectedEnvTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedEnvTab(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all text-left cursor-pointer border ${
                      isActive
                        ? item.activeClasses
                        : 'border-transparent text-[#475569] hover:text-[#14201C] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate pr-1">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                          isActive ? item.badgeActive : `${item.iconBg} ${item.iconColor}`
                        }`}
                      >
                        <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : item.iconColor}`} />
                      </div>
                      <span className={`truncate text-xs ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                    </div>
                    {item.count && (
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md shrink-0 transition-all ${
                          isActive
                            ? item.badgeActive
                            : item.badgeInactive
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Link to API Documentation Card */}
          <div className="bg-[#F8FAFC] border border-[#E2EAE6] p-4 rounded-2xl shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#006736]" />
              <span className="text-xs font-bold text-[#14201C]">API Reference Docs</span>
            </div>
            <p className="text-[11px] text-[#5F7069] leading-relaxed">
              Explore 16+ interactive WhatsApp messaging, contacts & webhook endpoints.
            </p>
            <Link to={ROUTES.DEVELOPERS_DOCS} className="block pt-1">
              <Button
                size="sm"
                variant="outline"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="w-full text-xs font-bold text-[#006736] bg-white border-[#E2EAE6] hover:bg-[#E9F9EE] justify-between h-8 px-3"
              >
                <span>Open API Docs</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
