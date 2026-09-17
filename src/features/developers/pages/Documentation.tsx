import React, { useState } from 'react';
import {
  Copy,
  Check,
  Server,
  ArrowRight,
  ListTree,
  ShieldCheck,
  MessageSquare,
  Users,
  LayoutTemplate,
  Send,
  UserCheck,
  Webhook as WebhookIcon,
  Activity,
  AlertTriangle,
  Smartphone,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

type LanguageTab = 'curl' | 'node' | 'python' | 'php';
type CategoryFilter =
  | 'all'
  | 'auth'
  | 'rate_limits'
  | 'messaging'
  | 'contacts'
  | 'templates'
  | 'campaigns'
  | 'developer'
  | 'webhooks'
  | 'whatsapp'
  | 'errors';

/**
 * Postman-style JSON Syntax Highlighter
 */
const highlightPostmanJson = (jsonString: string): string => {
  const escaped = jsonString
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|[{}[\],])/g,
    (match) => {
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          const keyName = match.slice(0, -1);
          return `<span class="text-[#A31515] font-bold">${keyName}</span><span class="text-[#64748B]">:</span>`;
        } else {
          return `<span class="text-[#006736] font-medium">${match}</span>`;
        }
      } else if (/true|false/.test(match)) {
        return `<span class="text-[#7C3AED] font-bold">${match}</span>`;
      } else if (/null/.test(match)) {
        return `<span class="text-[#64748B] font-bold italic">${match}</span>`;
      } else if (/[0-9]+/.test(match)) {
        return `<span class="text-[#005CC5] font-bold">${match}</span>`;
      } else if (/[{}[\],]/.test(match)) {
        return `<span class="text-[#475569] font-medium">${match}</span>`;
      }
      return match;
    }
  );
};

/**
 * Postman-style Request Code Highlighter
 */
const highlightPostmanCode = (code: string, lang: LanguageTab): string => {
  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  if (lang === 'curl') {
    return escaped
      .replace(
        /"([a-zA-Z0-9_]+)"\s*:/g,
        '<span class="text-[#A31515] font-bold">"$1"</span><span class="text-[#64748B]">:</span>'
      )
      .replace(/(["'])(?:(?=(\\?))\2[\s\S])*?\1/g, (match) => {
        if (match.includes('http://') || match.includes('https://')) {
          return `<span class="text-[#005CC5] font-semibold underline decoration-[#005CC5]/30">${match}</span>`;
        }
        if (match.includes('x-api-key') || match.includes('X-Tenant') || match.includes('Content-Type')) {
          return `<span class="text-[#006736] font-bold">${match}</span>`;
        }
        return `<span class="text-[#006736] font-medium">${match}</span>`;
      })
      .replace(/\b(curl)\b/g, '<span class="text-[#7C3AED] font-bold">$1</span>')
      .replace(/\b(POST|GET|PATCH|DELETE|PUT)\b/g, '<span class="text-[#05A222] font-black">$1</span>')
      .replace(/(-X|-H|-d)\b/g, '<span class="text-[#D97706] font-bold">$1</span>');
  }

  return escaped
    .replace(/(#.*|\/\/.*)/g, '<span class="text-[#94A3B8] italic">$1</span>')
    .replace(
      /\b(import|from|const|let|var|await|async|function|return|def|echo|curl_init|curl_setopt_array|curl_setopt|curl_exec|curl_close|json_encode)\b/g,
      '<span class="text-[#7C3AED] font-bold">$1</span>'
    )
    .replace(
      /"([a-zA-Z0-9_]+)"\s*:/g,
      '<span class="text-[#A31515] font-bold">"$1"</span><span class="text-[#64748B]">:</span>'
    )
    .replace(/(["'])(?:(?=(\\?))\2[\s\S])*?\1/g, (match) => {
      if (match.includes('http://') || match.includes('https://')) {
        return `<span class="text-[#005CC5] font-semibold underline decoration-[#005CC5]/30">${match}</span>`;
      }
      return `<span class="text-[#006736] font-medium">${match}</span>`;
    })
    .replace(/\b(true|false)\b/g, '<span class="text-[#7C3AED] font-bold">$1</span>')
    .replace(/\b(null)\b/g, '<span class="text-[#64748B] font-bold italic">$1</span>')
    .replace(/\b(axios|requests|CURLOPT_[A-Z_]+)\b/g, '<span class="text-[#005CC5] font-bold">$1</span>');
};

/**
 * Dynamic Code Snippet Generator for cURL, Node.js (Axios), Python (Requests), and PHP
 */
const generateCodeSnippet = (
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT',
  path: string,
  body: any | null,
  lang: LanguageTab,
  baseUrl: string = 'https://api.whatsappmsg.com/api/v1'
): string => {
  const fullUrl = `${baseUrl}${path}`;
  const bodyString = body ? JSON.stringify(body, null, 2) : '';

  if (lang === 'curl') {
    if (!body || method === 'GET') {
      return `curl -X ${method} "${fullUrl}" \\\n  -H "x-api-key: wmsg_live_your_api_key_here"`;
    }
    return `curl -X ${method} "${fullUrl}" \\\n  -H "x-api-key: wmsg_live_your_api_key_here" \\\n  -H "Content-Type: application/json" \\\n  -d '${bodyString}'`;
  }

  if (lang === 'node') {
    const fn = method.toLowerCase();
    if (!body || method === 'GET' || method === 'DELETE') {
      return `const axios = require('axios');\n\nconst response = await axios.${fn}('${fullUrl}', {\n  headers: {\n    'x-api-key': 'wmsg_live_your_api_key_here'\n  }\n});\n\nconsole.log(response.data);`;
    }
    return `const axios = require('axios');\n\nconst response = await axios.${fn}('${fullUrl}', ${bodyString}, {\n  headers: {\n    'x-api-key': 'wmsg_live_your_api_key_here',\n    'Content-Type': 'application/json'\n  }\n});\n\nconsole.log(response.data);`;
  }

  if (lang === 'python') {
    const fn = method.toLowerCase();
    if (!body || method === 'GET' || method === 'DELETE') {
      return `import requests\n\nurl = "${fullUrl}"\nheaders = {\n    "x-api-key": "wmsg_live_your_api_key_here"\n}\n\nresponse = requests.${fn}(url, headers=headers)\nprint(response.json())`;
    }
    return `import requests\n\nurl = "${fullUrl}"\nheaders = {\n    "x-api-key": "wmsg_live_your_api_key_here",\n    "Content-Type": "application/json"\n}\npayload = ${bodyString}\n\nresponse = requests.${fn}(url, json=payload, headers=headers)\nprint(response.json())`;
  }

  if (lang === 'php') {
    if (!body || method === 'GET' || method === 'DELETE') {
      return `<?php\n$curl = curl_init();\n\ncurl_setopt_array($curl, [\n  CURLOPT_URL => "${fullUrl}",\n  CURLOPT_RETURNTRANSFER => true,\n  CURLOPT_CUSTOMREQUEST => "${method}",\n  CURLOPT_HTTPHEADER => [\n    "x-api-key: wmsg_live_your_api_key_here"\n  ],\n]);\n\n$response = curl_exec($curl);\ncurl_close($curl);\necho $response;`;
    }
    return `<?php\n$curl = curl_init();\n\ncurl_setopt_array($curl, [\n  CURLOPT_URL => "${fullUrl}",\n  CURLOPT_RETURNTRANSFER => true,\n  CURLOPT_CUSTOMREQUEST => "${method}",\n  CURLOPT_POSTFIELDS => json_encode(${bodyString}),\n  CURLOPT_HTTPHEADER => [\n    "x-api-key: wmsg_live_your_api_key_here",\n    "Content-Type: application/json"\n  ],\n]);\n\n$response = curl_exec($curl);\ncurl_close($curl);\necho $response;`;
  }

  return '';
};

/**
 * Method Badge Helper
 */
const MethodBadge: React.FC<{ method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' }> = ({ method }) => {
  const colors = {
    GET: 'bg-blue-50 text-blue-700 border-blue-200',
    POST: 'bg-[#E9F9EE] text-[#006736] border-[#C4EBD0]',
    PATCH: 'bg-purple-50 text-purple-700 border-purple-200',
    PUT: 'bg-amber-50 text-amber-700 border-amber-200',
    DELETE: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <span className={`px-2 py-0.5 rounded-md font-mono font-black text-[10px] border shadow-2xs ${colors[method]}`}>
      {method}
    </span>
  );
};

/**
 * Interactive Postman Response Viewer Component
 */
interface PostmanResponseViewerProps {
  statusCode: number;
  statusText: string;
  timeMs: number;
  sizeBytes: number;
  jsonBody: string;
  responseMode?: 'pretty' | 'raw';
}

const PostmanResponseViewer: React.FC<PostmanResponseViewerProps> = ({
  statusCode,
  statusText,
  timeMs,
  sizeBytes,
  jsonBody,
  responseMode = 'raw',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSuccess = statusCode >= 200 && statusCode < 300;

  return (
    <div className="rounded-xl overflow-hidden border border-[#E2EAE6] bg-white shadow-2xs">
      {/* Postman Style Response Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-3.5 py-2 bg-[#F8FAFC] border-b border-[#E2EAE6] gap-2 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-[#5F7069] uppercase tracking-wider font-mono">Response:</span>
            <span
              className={`px-2 py-0.5 rounded-md font-mono font-bold text-[11px] flex items-center gap-1 ${
                isSuccess
                  ? 'bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isSuccess ? 'bg-[#05A222]' : 'bg-rose-600'}`}></span>
              {statusCode} {statusText}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#5F7069] font-mono">
            <span>
              Time: <strong className="text-[#006736]">{timeMs} ms</strong>
            </span>
            <span>•</span>
            <span>
              Size: <strong className="text-[#14201C]">{sizeBytes} B</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#E9F9EE] border border-[#C4EBD0] rounded text-[#006736] uppercase">
            JSON ({responseMode})
          </span>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded bg-white hover:bg-[#E9F9EE] text-[#006736] border border-[#E2EAE6] text-[11px] font-bold transition-colors cursor-pointer"
            title="Copy Response JSON"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#05A222]" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Postman Style JSON Response Body */}
      <div className="bg-white p-4 overflow-x-auto font-mono text-xs leading-relaxed text-[#0F172A]">
        {responseMode === 'pretty' ? (
          <pre
            dangerouslySetInnerHTML={{ __html: highlightPostmanJson(jsonBody) }}
            className="font-mono text-xs leading-relaxed"
          />
        ) : (
          <pre className="font-mono text-xs text-[#0F172A] leading-relaxed">{jsonBody}</pre>
        )}
      </div>
    </div>
  );
};

export const Documentation: React.FC = () => {
  const [activeLang, setActiveLang] = useState<LanguageTab>('curl');
  const [responseMode, setResponseMode] = useState<'raw' | 'pretty'>('raw');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const tocCategories: {
    id: CategoryFilter;
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
      label: 'All Endpoints',
      icon: ListTree,
      count: '16',
      activeClasses: 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold shadow-2xs',
      badgeActive: 'bg-emerald-600 text-white shadow-2xs',
      badgeInactive: 'bg-emerald-100/70 text-emerald-800 border border-emerald-200/70',
      iconColor: 'text-emerald-700',
      iconBg: 'bg-emerald-100/80',
    },
    {
      id: 'auth',
      label: 'Authentication',
      icon: ShieldCheck,
      count: 'x-api-key',
      activeClasses: 'bg-indigo-50 text-indigo-900 border-indigo-300 font-bold shadow-2xs',
      badgeActive: 'bg-indigo-600 text-white shadow-2xs',
      badgeInactive: 'bg-indigo-100/70 text-indigo-800 border border-indigo-200/70',
      iconColor: 'text-indigo-700',
      iconBg: 'bg-indigo-100/80',
    },
    {
      id: 'rate_limits',
      label: 'Rate Limiting',
      icon: Activity,
      count: '429',
      activeClasses: 'bg-amber-50 text-amber-900 border-amber-300 font-bold shadow-2xs',
      badgeActive: 'bg-amber-600 text-white shadow-2xs',
      badgeInactive: 'bg-amber-100/70 text-amber-800 border border-amber-200/70',
      iconColor: 'text-amber-700',
      iconBg: 'bg-amber-100/80',
    },
    {
      id: 'messaging',
      label: 'Messaging',
      icon: MessageSquare,
      count: '5',
      activeClasses: 'bg-sky-50 text-sky-900 border-sky-300 font-bold shadow-2xs',
      badgeActive: 'bg-sky-600 text-white shadow-2xs',
      badgeInactive: 'bg-sky-100/70 text-sky-800 border border-sky-200/70',
      iconColor: 'text-sky-700',
      iconBg: 'bg-sky-100/80',
    },
    {
      id: 'contacts',
      label: 'Contacts & Audience',
      icon: Users,
      count: '5',
      activeClasses: 'bg-teal-50 text-teal-900 border-teal-300 font-bold shadow-2xs',
      badgeActive: 'bg-teal-600 text-white shadow-2xs',
      badgeInactive: 'bg-teal-100/70 text-teal-800 border border-teal-200/70',
      iconColor: 'text-teal-700',
      iconBg: 'bg-teal-100/80',
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: LayoutTemplate,
      count: '3',
      activeClasses: 'bg-purple-50 text-purple-900 border-purple-300 font-bold shadow-2xs',
      badgeActive: 'bg-purple-600 text-white shadow-2xs',
      badgeInactive: 'bg-purple-100/70 text-purple-800 border border-purple-200/70',
      iconColor: 'text-purple-700',
      iconBg: 'bg-purple-100/80',
    },
    {
      id: 'campaigns',
      label: 'Campaigns',
      icon: Send,
      count: '4',
      activeClasses: 'bg-rose-50 text-rose-900 border-rose-300 font-bold shadow-2xs',
      badgeActive: 'bg-rose-600 text-white shadow-2xs',
      badgeInactive: 'bg-rose-100/70 text-rose-800 border border-rose-200/70',
      iconColor: 'text-rose-700',
      iconBg: 'bg-rose-100/80',
    },
    {
      id: 'developer',
      label: 'Developer & Analytics',
      icon: UserCheck,
      count: '3',
      activeClasses: 'bg-blue-50 text-blue-900 border-blue-300 font-bold shadow-2xs',
      badgeActive: 'bg-blue-600 text-white shadow-2xs',
      badgeInactive: 'bg-blue-100/70 text-blue-800 border border-blue-200/70',
      iconColor: 'text-blue-700',
      iconBg: 'bg-blue-100/80',
    },
    {
      id: 'webhooks',
      label: 'Webhooks',
      icon: WebhookIcon,
      count: '4',
      activeClasses: 'bg-orange-50 text-orange-900 border-orange-300 font-bold shadow-2xs',
      badgeActive: 'bg-orange-600 text-white shadow-2xs',
      badgeInactive: 'bg-orange-100/70 text-orange-800 border border-orange-200/70',
      iconColor: 'text-orange-700',
      iconBg: 'bg-orange-100/80',
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp Accounts',
      icon: Smartphone,
      count: '2',
      activeClasses: 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold shadow-2xs',
      badgeActive: 'bg-emerald-600 text-white shadow-2xs',
      badgeInactive: 'bg-emerald-100/70 text-emerald-800 border border-emerald-200/70',
      iconColor: 'text-emerald-700',
      iconBg: 'bg-emerald-100/80',
    },
    {
      id: 'errors',
      label: 'HTTP Error Codes',
      icon: AlertTriangle,
      count: '9',
      activeClasses: 'bg-red-50 text-red-900 border-red-300 font-bold shadow-2xs',
      badgeActive: 'bg-red-600 text-white shadow-2xs',
      badgeInactive: 'bg-red-100/70 text-red-800 border border-red-200/70',
      iconColor: 'text-red-700',
      iconBg: 'bg-red-100/80',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Slim Top Header Box */}
      <div className="bg-white border border-[#E2EAE6] p-4 sm:p-5 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-[#14201C] tracking-tight">
            WhatsApp Business REST API Reference
          </h3>
          <p className="text-xs text-[#5F7069] mt-0.5">
            Production-ready REST API for WhatsApp messaging, contacts 360°, broadcast campaigns, templates & webhooks.
          </p>
        </div>

        <Link to={ROUTES.DEVELOPERS_BACKEND_SETUP} className="shrink-0">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Server className="w-3.5 h-3.5 text-[#05A222]" />}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="text-xs font-semibold text-[#006736] border-[#E2EAE6] hover:bg-[#E9F9EE] px-3.5 py-1.5 h-8.5"
          >
            Backend (.env) Setup
          </Button>
        </Link>
      </div>

      {/* Main 2-Column Documentation Grid (Left Content + Right Table of Contents) */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left / Center: API Endpoints & Reference Content */}
        <div className="flex-1 min-w-0 space-y-6 w-full">
          {/* Global Language Selector, Response Format (Raw/Pretty), & Base URL Bar */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-[#E2EAE6] shadow-2xs">
            <div className="flex flex-wrap items-center gap-2">
              {/* Language Tabs */}
              <div className="flex items-center gap-1 bg-[#F6FAF8] p-1 rounded-xl border border-[#E2EAE6]">
                {[
                  {
                    id: 'curl' as LanguageTab,
                    label: 'cURL',
                    dotColor: 'bg-amber-400',
                    activeClass: 'bg-slate-900 text-white shadow-2xs border border-slate-800',
                    inactiveClass: 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80',
                  },
                  {
                    id: 'node' as LanguageTab,
                    label: 'Node.js',
                    dotColor: 'bg-emerald-400',
                    activeClass: 'bg-emerald-600 text-white shadow-2xs border border-emerald-500',
                    inactiveClass: 'text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50/80',
                  },
                  {
                    id: 'python' as LanguageTab,
                    label: 'Python',
                    dotColor: 'bg-sky-400',
                    activeClass: 'bg-sky-600 text-white shadow-2xs border border-sky-500',
                    inactiveClass: 'text-sky-700 hover:text-sky-900 hover:bg-sky-50/80',
                  },
                  {
                    id: 'php' as LanguageTab,
                    label: 'PHP',
                    dotColor: 'bg-purple-400',
                    activeClass: 'bg-purple-600 text-white shadow-2xs border border-purple-500',
                    inactiveClass: 'text-purple-700 hover:text-purple-900 hover:bg-purple-50/80',
                  },
                ].map((tab) => {
                  const isActive = activeLang === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveLang(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isActive ? tab.activeClass : tab.inactiveClass
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full transition-all ${
                          isActive ? tab.dotColor : 'bg-slate-300'
                        }`}
                      />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Global Response Mode Filter: RAW (default) / PRETTY */}
              <div className="flex items-center gap-1 bg-[#F6FAF8] p-1 rounded-xl border border-[#E2EAE6]">
                <span className="text-[11px] font-bold text-[#5F7069] px-2 font-mono uppercase tracking-wider">
                  Response:
                </span>
                {(['raw', 'pretty'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setResponseMode(mode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                      responseMode === mode
                        ? 'bg-[#006736] text-white shadow-2xs'
                        : 'text-[#5F7069] hover:text-[#14201C]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-[#5F7069] font-medium px-2 flex items-center gap-1.5 shrink-0">
              <span>Base URL:</span>
              <code className="text-[#006736] font-mono bg-[#E9F9EE] px-2 py-0.5 rounded-lg font-bold border border-[#C4EBD0]">
                https://api.whatsappmsg.com/api/v1
              </code>
            </div>
          </div>

          {/* SECTION: AUTHENTICATION */}
          {(selectedCategory === 'all' || selectedCategory === 'auth') && (
            <div id="auth" className="bg-white border border-[#E2EAE6] hover:border-[#C4EBD0] transition-all p-5 sm:p-6 rounded-2xl shadow-[0_4px_20px_rgba(1,59,35,0.03)] space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2EAE6] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#006736]">
                    <ShieldCheck className="w-4 h-4 text-[#05A222]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#14201C]">Authentication & Security</h4>
                    <p className="text-xs text-[#5F7069]">Authenticate API requests via secret API Key or JWT token</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]">
                  x-api-key Header
                </span>
              </div>

              <p className="text-xs text-[#5F7069] leading-relaxed">
                Pass your API key in the <code className="font-mono text-[#006736] bg-[#F8FAFC] px-1.5 py-0.5 rounded border border-[#E2EAE6]">x-api-key</code> header or as a Bearer token <code className="font-mono text-[#006736] bg-[#F8FAFC] px-1.5 py-0.5 rounded border border-[#E2EAE6]">Authorization: Bearer wmsg_live_...</code>.
                Our backend automatically resolves your tenant organization, developer permissions, and rate limits.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3.5 bg-white rounded-xl font-mono text-xs border border-[#E2EAE6] shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-[#64748B]">Primary Header</div>
                  <div className="text-[#A31515] font-bold mt-1">x-api-key: <span className="text-[#006736]">wmsg_live_your_api_key_here</span></div>
                </div>
                <div className="p-3.5 bg-white rounded-xl font-mono text-xs border border-[#E2EAE6] shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-[#64748B]">Alternative Bearer Header</div>
                  <div className="text-[#A31515] font-bold mt-1">Authorization: <span className="text-[#006736]">Bearer wmsg_live_your_api_key_here</span></div>
                </div>
              </div>

              {/* Standard Response Envelope Description */}
              <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2EAE6] text-xs text-[#5F7069] space-y-1.5">
                <div className="font-bold text-[#14201C]">Standard API Response Envelope:</div>
                <div>All backend responses follow the structured format: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#E2EAE6] text-[#006736] font-bold">&#123; success: boolean, message: string, data?: any, meta?: any &#125;</code></div>
              </div>

              {/* Example Authenticated Request */}
              <div className="rounded-xl overflow-hidden border border-[#E2EAE6] bg-[#F8FAFC] shadow-2xs">
                <div className="flex items-center justify-between px-4 py-2 bg-[#F1F5F9] border-b border-[#E2EAE6] text-xs font-mono text-[#475569]">
                  <span className="font-bold">Example Authenticated Ping (GET /api/v1/developer/metrics)</span>
                  <button
                    onClick={() => handleCopy('auth_snippet', generateCodeSnippet('GET', '/developer/metrics', null, activeLang))}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#006736] hover:underline cursor-pointer"
                  >
                    {copiedId === 'auth_snippet' ? <Check className="w-3.5 h-3.5 text-[#05A222]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'auth_snippet' ? 'Copied' : `Copy ${activeLang.toUpperCase()}`}</span>
                  </button>
                </div>
                <div className="p-4 bg-white overflow-x-auto">
                  <pre
                    dangerouslySetInnerHTML={{
                      __html: highlightPostmanCode(
                        generateCodeSnippet('GET', '/developer/metrics', null, activeLang),
                        activeLang
                      ),
                    }}
                    className="font-mono text-xs leading-relaxed text-[#0F172A]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION: RATE LIMITING */}
          {(selectedCategory === 'all' || selectedCategory === 'rate_limits') && (
            <div id="rate_limits" className="bg-white border border-[#E2EAE6] hover:border-[#C4EBD0] transition-all p-5 sm:p-6 rounded-2xl shadow-[0_4px_20px_rgba(1,59,35,0.03)] space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2EAE6] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                    <Activity className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#14201C]">Rate Limiting & Headers</h4>
                    <p className="text-xs text-[#5F7069]">Automatic per-minute rate protection and response headers</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  HTTP 429 Protection
                </span>
              </div>

              <p className="text-xs text-[#5F7069] leading-relaxed">
                Every API response includes rate limit headers allowing client applications to track capacity in real-time.
                Default rate limit is <strong>120 requests/minute</strong> per API key.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2EAE6]">
                  <div className="text-[10px] uppercase font-bold text-[#64748B]">X-RateLimit-Limit</div>
                  <div className="text-[#006736] font-bold mt-1">120 <span className="font-normal text-[11px] text-[#64748B]">(req / min)</span></div>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2EAE6]">
                  <div className="text-[10px] uppercase font-bold text-[#64748B]">X-RateLimit-Remaining</div>
                  <div className="text-[#006736] font-bold mt-1">119 <span className="font-normal text-[11px] text-[#64748B]">(remaining)</span></div>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2EAE6]">
                  <div className="text-[10px] uppercase font-bold text-[#64748B]">X-RateLimit-Reset</div>
                  <div className="text-[#006736] font-bold mt-1">1726570000 <span className="font-normal text-[11px] text-[#64748B]">(unix)</span></div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-bold text-[#5F7069]">Response when rate limit is exceeded (HTTP 429):</span>
                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={429}
                  statusText="Too Many Requests"
                  timeMs={24}
                  sizeBytes={118}
                  jsonBody={`{\n  "success": false,\n  "message": "Rate limit exceeded. Please try again after 60 seconds.",\n  "errorCode": "RATE_LIMIT_EXCEEDED",\n  "errors": null\n}`}
                />
              </div>
            </div>
          )}

          {/* SECTION: MESSAGING */}
          {(selectedCategory === 'all' || selectedCategory === 'messaging') && (
            <div id="messaging" className="space-y-6">
              <div className="flex items-center gap-2 border-b border-[#E2EAE6] pb-2">
                <MessageSquare className="w-5 h-5 text-[#05A222]" />
                <h3 className="text-base font-extrabold text-[#14201C]">Messaging Endpoints</h3>
              </div>

              {/* Endpoint 1: POST /api/v1/messages (Text Message) */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="POST" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/messages</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Send real-time conversational text message</span>
                </div>

                <div className="rounded-xl overflow-hidden border border-[#E2EAE6] bg-[#F8FAFC]">
                  <div className="flex items-center justify-between px-4 py-2 bg-[#F1F5F9] border-b border-[#E2EAE6] text-xs font-mono">
                    <span className="font-bold text-[#475569]">Request Payload (Text Message)</span>
                    <button
                      onClick={() => handleCopy('msg_text', generateCodeSnippet('POST', '/messages', { to: '+919876543210', type: 'text', text: 'Hello Alex! Your appointment has been booked for tomorrow at 3:00 PM.' }, activeLang))}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#006736] hover:underline cursor-pointer"
                    >
                      {copiedId === 'msg_text' ? <Check className="w-3.5 h-3.5 text-[#05A222]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'msg_text' ? 'Copied' : `Copy ${activeLang.toUpperCase()}`}</span>
                    </button>
                  </div>
                  <div className="p-4 bg-white overflow-x-auto">
                    <pre
                      dangerouslySetInnerHTML={{
                        __html: highlightPostmanCode(
                          generateCodeSnippet('POST', '/messages', { to: '+919876543210', type: 'text', text: 'Hello Alex! Your appointment has been booked for tomorrow at 3:00 PM.' }, activeLang),
                          activeLang
                        ),
                      }}
                      className="font-mono text-xs leading-relaxed text-[#0F172A]"
                    />
                  </div>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={201}
                  statusText="Created"
                  timeMs={142}
                  sizeBytes={285}
                  jsonBody={`{\n  "success": true,\n  "message": "Message dispatched successfully",\n  "data": {\n    "_id": "664f1a2b8e4b2a001c9a1234",\n    "organizationId": "664f1a2b8e4b2a001c9a1111",\n    "wamid": "wamid.HBgLMjA0ODk4M...",\n    "to": "919876543210",\n    "from": "15550001234",\n    "type": "text",\n    "direction": "OUTBOUND",\n    "status": "SENT",\n    "sentAt": "2026-09-17T10:30:00.000Z",\n    "createdAt": "2026-09-17T10:30:00.000Z"\n  }\n}`}
                />
              </div>

              {/* Endpoint 2: POST /api/v1/messages (Approved Template) */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="POST" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/messages</code>
                    <span className="text-[11px] font-bold text-[#006736] bg-[#E9F9EE] px-2 py-0.5 rounded border border-[#C4EBD0]">type: template</span>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Dispatches pre-approved Meta WhatsApp templates outside 24h window</span>
                </div>

                <div className="rounded-xl overflow-hidden border border-[#E2EAE6] bg-[#F8FAFC]">
                  <div className="flex items-center justify-between px-4 py-2 bg-[#F1F5F9] border-b border-[#E2EAE6] text-xs font-mono">
                    <span className="font-bold text-[#475569]">Request Payload (Meta Template)</span>
                    <button
                      onClick={() => handleCopy('msg_tpl', generateCodeSnippet('POST', '/messages', { to: '+919876543210', type: 'template', templateName: 'order_confirmation', languageCode: 'en_US', components: [{ type: 'body', parameters: [{ type: 'text', text: 'Alex Johnson' }, { type: 'text', text: '#ORD-9982' }] }] }, activeLang))}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#006736] hover:underline cursor-pointer"
                    >
                      {copiedId === 'msg_tpl' ? <Check className="w-3.5 h-3.5 text-[#05A222]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'msg_tpl' ? 'Copied' : `Copy ${activeLang.toUpperCase()}`}</span>
                    </button>
                  </div>
                  <div className="p-4 bg-white overflow-x-auto">
                    <pre
                      dangerouslySetInnerHTML={{
                        __html: highlightPostmanCode(
                          generateCodeSnippet('POST', '/messages', { to: '+919876543210', type: 'template', templateName: 'order_confirmation', languageCode: 'en_US', components: [{ type: 'body', parameters: [{ type: 'text', text: 'Alex Johnson' }, { type: 'text', text: '#ORD-9982' }] }] }, activeLang),
                          activeLang
                        ),
                      }}
                      className="font-mono text-xs leading-relaxed text-[#0F172A]"
                    />
                  </div>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={201}
                  statusText="Created"
                  timeMs={168}
                  sizeBytes={295}
                  jsonBody={`{\n  "success": true,\n  "message": "Message dispatched successfully",\n  "data": {\n    "_id": "664f1a2b8e4b2a001c9a1235",\n    "wamid": "wamid.HBgLMjA0ODk4M...",\n    "to": "919876543210",\n    "type": "template",\n    "direction": "OUTBOUND",\n    "status": "SENT",\n    "sentAt": "2026-09-17T10:31:00.000Z"\n  }\n}`}
                />
              </div>

              {/* Endpoint 3: POST /api/v1/messages (Media: Image / Document / Video) */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="POST" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/messages</code>
                    <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">type: image | document | video</span>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Send media attachment with optional caption</span>
                </div>

                <div className="rounded-xl overflow-hidden border border-[#E2EAE6] bg-[#F8FAFC]">
                  <div className="flex items-center justify-between px-4 py-2 bg-[#F1F5F9] border-b border-[#E2EAE6] text-xs font-mono">
                    <span className="font-bold text-[#475569]">Request Payload (Media Message)</span>
                    <button
                      onClick={() => handleCopy('msg_media', generateCodeSnippet('POST', '/messages', { to: '+919876543210', type: 'image', mediaUrl: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7', caption: 'Your monthly invoice statement' }, activeLang))}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#006736] hover:underline cursor-pointer"
                    >
                      {copiedId === 'msg_media' ? <Check className="w-3.5 h-3.5 text-[#05A222]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'msg_media' ? 'Copied' : `Copy ${activeLang.toUpperCase()}`}</span>
                    </button>
                  </div>
                  <div className="p-4 bg-white overflow-x-auto">
                    <pre
                      dangerouslySetInnerHTML={{
                        __html: highlightPostmanCode(
                          generateCodeSnippet('POST', '/messages', { to: '+919876543210', type: 'image', mediaUrl: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7', caption: 'Your monthly invoice statement' }, activeLang),
                          activeLang
                        ),
                      }}
                      className="font-mono text-xs leading-relaxed text-[#0F172A]"
                    />
                  </div>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={201}
                  statusText="Created"
                  timeMs={182}
                  sizeBytes={310}
                  jsonBody={`{\n  "success": true,\n  "message": "Message dispatched successfully",\n  "data": {\n    "_id": "664f1a2b8e4b2a001c9a1236",\n    "wamid": "wamid.HBgLMjA0ODk4M...",\n    "to": "919876543210",\n    "type": "image",\n    "status": "SENT",\n    "content": {\n      "url": "https://images.unsplash.com/photo-1579208575657-c595a05383b7",\n      "caption": "Your monthly invoice statement"\n    }\n  }\n}`}
                />
              </div>

              {/* Endpoint 4: GET /api/v1/messages */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="GET" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/messages</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">List messages with pagination & filters (?page=1&limit=20&status=SENT&to=919876543210)</span>
                </div>

                <div className="rounded-xl overflow-hidden border border-[#E2EAE6] bg-[#F8FAFC]">
                  <div className="flex items-center justify-between px-4 py-2 bg-[#F1F5F9] border-b border-[#E2EAE6] text-xs font-mono">
                    <span className="font-bold text-[#475569]">Request URL</span>
                    <button
                      onClick={() => handleCopy('msg_list', generateCodeSnippet('GET', '/messages?page=1&limit=20&status=SENT', null, activeLang))}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#006736] hover:underline cursor-pointer"
                    >
                      {copiedId === 'msg_list' ? <Check className="w-3.5 h-3.5 text-[#05A222]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'msg_list' ? 'Copied' : `Copy ${activeLang.toUpperCase()}`}</span>
                    </button>
                  </div>
                  <div className="p-4 bg-white overflow-x-auto">
                    <pre
                      dangerouslySetInnerHTML={{
                        __html: highlightPostmanCode(
                          generateCodeSnippet('GET', '/messages?page=1&limit=20&status=SENT', null, activeLang),
                          activeLang
                        ),
                      }}
                      className="font-mono text-xs leading-relaxed text-[#0F172A]"
                    />
                  </div>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={78}
                  sizeBytes={380}
                  jsonBody={`{\n  "success": true,\n  "message": "Messages retrieved successfully",\n  "data": {\n    "messages": [\n      {\n        "_id": "664f1a2b8e4b2a001c9a1234",\n        "to": "919876543210",\n        "type": "text",\n        "direction": "OUTBOUND",\n        "status": "DELIVERED",\n        "content": { "body": "Hello Alex!" },\n        "sentAt": "2026-09-17T10:30:00.000Z",\n        "deliveredAt": "2026-09-17T10:30:02.000Z"\n      }\n    ],\n    "pagination": {\n      "total": 450,\n      "page": 1,\n      "limit": 20,\n      "pages": 23\n    }\n  }\n}`}
                />
              </div>

              {/* Endpoint 5: GET /api/v1/messages/:id */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="GET" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/messages/:id</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Get delivery receipts and read status for a single message</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={62}
                  sizeBytes={295}
                  jsonBody={`{\n  "success": true,\n  "message": "Message details retrieved successfully",\n  "data": {\n    "_id": "664f1a2b8e4b2a001c9a1234",\n    "wamid": "wamid.HBgLMjA0ODk4M...",\n    "to": "919876543210",\n    "from": "15550001234",\n    "direction": "OUTBOUND",\n    "status": "READ",\n    "type": "text",\n    "content": { "body": "Hello Alex!" },\n    "sentAt": "2026-09-17T10:30:00.000Z",\n    "deliveredAt": "2026-09-17T10:30:02.000Z",\n    "readAt": "2026-09-17T10:30:15.000Z"\n  }\n}`}
                />
              </div>
            </div>
          )}

          {/* SECTION: CONTACTS & AUDIENCE */}
          {(selectedCategory === 'all' || selectedCategory === 'contacts') && (
            <div id="contacts" className="space-y-6">
              <div className="flex items-center gap-2 border-b border-[#E2EAE6] pb-2">
                <Users className="w-5 h-5 text-[#05A222]" />
                <h3 className="text-base font-extrabold text-[#14201C]">Contacts & Audience Endpoints</h3>
              </div>

              {/* 1. GET /api/v1/contacts */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="GET" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/contacts</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">List all contacts with filters (?page=1&limit=20&search=Alex&tag=VIP)</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={75}
                  sizeBytes={340}
                  jsonBody={`{\n  "success": true,\n  "message": "Contacts retrieved successfully",\n  "data": {\n    "contacts": [\n      {\n        "_id": "664f2b1a8e4b2a001c9a5678",\n        "phoneNumber": "+919876543210",\n        "name": "Alex Johnson",\n        "email": "alex@example.com",\n        "tags": ["VIP", "Customer"],\n        "optInStatus": "OPTED_IN",\n        "isSubscribed": true,\n        "createdAt": "2026-09-17T09:00:00.000Z"\n      }\n    ],\n    "pagination": {\n      "total": 1280,\n      "page": 1,\n      "limit": 20,\n      "pages": 64\n    }\n  }\n}`}
                />
              </div>

              {/* 2. POST /api/v1/contacts */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="POST" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/contacts</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Create a new contact (Returns 409 Conflict if phoneNumber exists)</span>
                </div>

                <div className="rounded-xl overflow-hidden border border-[#E2EAE6] bg-[#F8FAFC]">
                  <div className="flex items-center justify-between px-4 py-2 bg-[#F1F5F9] border-b border-[#E2EAE6] text-xs font-mono">
                    <span className="font-bold text-[#475569]">Request Payload (Create Contact)</span>
                    <button
                      onClick={() => handleCopy('cnt_create', generateCodeSnippet('POST', '/contacts', { phoneNumber: '+919876543210', name: 'Alex Johnson', email: 'alex@example.com', tags: ['VIP', 'Lead'], customAttributes: { company: 'Acme Corp', city: 'Mumbai' } }, activeLang))}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#006736] hover:underline cursor-pointer"
                    >
                      {copiedId === 'cnt_create' ? <Check className="w-3.5 h-3.5 text-[#05A222]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'cnt_create' ? 'Copied' : `Copy ${activeLang.toUpperCase()}`}</span>
                    </button>
                  </div>
                  <div className="p-4 bg-white overflow-x-auto">
                    <pre
                      dangerouslySetInnerHTML={{
                        __html: highlightPostmanCode(
                          generateCodeSnippet('POST', '/contacts', { phoneNumber: '+919876543210', name: 'Alex Johnson', email: 'alex@example.com', tags: ['VIP', 'Lead'], customAttributes: { company: 'Acme Corp', city: 'Mumbai' } }, activeLang),
                          activeLang
                        ),
                      }}
                      className="font-mono text-xs leading-relaxed text-[#0F172A]"
                    />
                  </div>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={201}
                  statusText="Created"
                  timeMs={124}
                  sizeBytes={260}
                  jsonBody={`{\n  "success": true,\n  "message": "Contact created successfully",\n  "data": {\n    "_id": "664f2b1a8e4b2a001c9a5678",\n    "phoneNumber": "+919876543210",\n    "name": "Alex Johnson",\n    "email": "alex@example.com",\n    "tags": ["VIP", "Lead"],\n    "optInStatus": "OPTED_IN",\n    "isSubscribed": true\n  }\n}`}
                />
              </div>

              {/* 3. PATCH /api/v1/contacts/:id */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="PATCH" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/contacts/:id</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Update contact profile, tags, or custom attributes</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={98}
                  sizeBytes={240}
                  jsonBody={`{\n  "success": true,\n  "message": "Contact updated successfully",\n  "data": {\n    "_id": "664f2b1a8e4b2a001c9a5678",\n    "name": "Alex J. Updated",\n    "tags": ["VIP", "High-Value"]\n  }\n}`}
                />
              </div>

              {/* 4. DELETE /api/v1/contacts/:id */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="DELETE" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/contacts/:id</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Delete contact permanently</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={78}
                  sizeBytes={120}
                  jsonBody={`{\n  "success": true,\n  "message": "Contact deleted successfully",\n  "data": null\n}`}
                />
              </div>

              {/* 5. POST /api/v1/contacts/bulk-import */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="POST" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/contacts/bulk-import</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Bulk import contacts with duplicate handling</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={245}
                  sizeBytes={180}
                  jsonBody={`{\n  "success": true,\n  "message": "Bulk import completed",\n  "data": {\n    "imported": 250,\n    "updated": 12,\n    "failed": 0\n  }\n}`}
                />
              </div>
            </div>
          )}

          {/* SECTION: TEMPLATES */}
          {(selectedCategory === 'all' || selectedCategory === 'templates') && (
            <div id="templates" className="space-y-6">
              <div className="flex items-center gap-2 border-b border-[#E2EAE6] pb-2">
                <LayoutTemplate className="w-5 h-5 text-[#05A222]" />
                <h3 className="text-base font-extrabold text-[#14201C]">Templates Endpoints</h3>
              </div>

              {/* GET /api/v1/templates */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="GET" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/templates</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">List all WhatsApp templates (?status=APPROVED&category=MARKETING)</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={105}
                  sizeBytes={340}
                  jsonBody={`{\n  "success": true,\n  "message": "Templates retrieved successfully",\n  "data": [\n    {\n      "_id": "664f3c2a8e4b2a001c9a9999",\n      "name": "order_confirmation",\n      "language": "en_US",\n      "category": "UTILITY",\n      "status": "APPROVED",\n      "components": [\n        {\n          "type": "BODY",\n          "text": "Hi {{1}}, your order #{{2}} is confirmed!"\n        }\n      ]\n    }\n  ]\n}`}
                />
              </div>

              {/* POST /api/v1/templates */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="POST" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/templates</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Create and submit template to Meta for review</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={201}
                  statusText="Created"
                  timeMs={220}
                  sizeBytes={260}
                  jsonBody={`{\n  "success": true,\n  "message": "Template created and submitted to Meta",\n  "data": {\n    "_id": "664f3c2a8e4b2a001c9a9998",\n    "name": "seasonal_promo_v1",\n    "category": "MARKETING",\n    "status": "PENDING"\n  }\n}`}
                />
              </div>

              {/* POST /api/v1/templates/sync */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="POST" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/templates/sync</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Synchronize template statuses from Meta Cloud API</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={410}
                  sizeBytes={160}
                  jsonBody={`{\n  "success": true,\n  "message": "Templates synchronized with Meta",\n  "data": {\n    "synced": 8,\n    "updated": 2\n  }\n}`}
                />
              </div>
            </div>
          )}

          {/* SECTION: CAMPAIGNS */}
          {(selectedCategory === 'all' || selectedCategory === 'campaigns') && (
            <div id="campaigns" className="space-y-6">
              <div className="flex items-center gap-2 border-b border-[#E2EAE6] pb-2">
                <Send className="w-5 h-5 text-[#05A222]" />
                <h3 className="text-base font-extrabold text-[#14201C]">Campaigns Endpoints</h3>
              </div>

              {/* GET /api/v1/campaigns */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="GET" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/campaigns</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">List all campaigns (?page=1&limit=10&status=COMPLETED)</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={114}
                  sizeBytes={320}
                  jsonBody={`{\n  "success": true,\n  "message": "Campaigns retrieved successfully",\n  "data": {\n    "campaigns": [\n      {\n        "_id": "664f4d3a8e4b2a001c9a7777",\n        "name": "Diwali Special Offer 2026",\n        "status": "COMPLETED",\n        "totalRecipients": 1500,\n        "sentCount": 1500,\n        "deliveredCount": 1482,\n        "readCount": 1120\n      }\n    ],\n    "pagination": {\n      "total": 12,\n      "page": 1,\n      "limit": 10\n    }\n  }\n}`}
                />
              </div>

              {/* POST /api/v1/campaigns */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="POST" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/campaigns</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Create a new broadcast campaign</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={201}
                  statusText="Created"
                  timeMs={156}
                  sizeBytes={270}
                  jsonBody={`{\n  "success": true,\n  "message": "Campaign created successfully",\n  "data": {\n    "_id": "664f4d3a8e4b2a001c9a7778",\n    "name": "Flash Sale Friday",\n    "status": "DRAFT",\n    "totalRecipients": 420,\n    "createdAt": "2026-09-17T11:00:00.000Z"\n  }\n}`}
                />
              </div>

              {/* POST /api/v1/campaigns/:id/start */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="POST" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/campaigns/:id/start</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Start campaign broadcast queue execution</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={95}
                  sizeBytes={175}
                  jsonBody={`{\n  "success": true,\n  "message": "Campaign queued and started successfully",\n  "data": {\n    "campaignId": "664f4d3a8e4b2a001c9a7778",\n    "status": "RUNNING"\n  }\n}`}
                />
              </div>

              {/* GET /api/v1/campaigns/:id/recipients */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="GET" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/campaigns/:id/recipients</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Inspect recipient dispatch logs and delivery status</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={82}
                  sizeBytes={290}
                  jsonBody={`{\n  "success": true,\n  "message": "Campaign recipients retrieved",\n  "data": {\n    "recipients": [\n      {\n        "phoneNumber": "+919876543210",\n        "status": "DELIVERED",\n        "deliveredAt": "2026-09-17T11:05:00.000Z"\n      }\n    ],\n    "total": 420\n  }\n}`}
                />
              </div>
            </div>
          )}

          {/* SECTION: DEVELOPER & API ANALYTICS */}
          {(selectedCategory === 'all' || selectedCategory === 'developer') && (
            <div id="developer" className="space-y-6">
              <div className="flex items-center gap-2 border-b border-[#E2EAE6] pb-2">
                <UserCheck className="w-5 h-5 text-[#05A222]" />
                <h3 className="text-base font-extrabold text-[#14201C]">Developer & API Analytics Endpoints</h3>
              </div>

              {/* GET /api/v1/developer/metrics */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="GET" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/developer/metrics</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Get API success rate, latency benchmarks, and status distribution</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={68}
                  sizeBytes={320}
                  jsonBody={`{\n  "success": true,\n  "message": "Developer metrics retrieved successfully",\n  "data": {\n    "totalRequests": 12850,\n    "successRate": 99.4,\n    "avgLatencyMs": 85,\n    "last24hCount": 620,\n    "statusDistribution": {\n      "200": 11500,\n      "201": 1280,\n      "400": 45,\n      "429": 12,\n      "500": 13\n    }\n  }\n}`}
                />
              </div>

              {/* GET /api/v1/developer/logs */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="GET" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/developer/logs</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Detailed API request audit logs (?page=1&limit=20&statusCode=200)</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={88}
                  sizeBytes={390}
                  jsonBody={`{\n  "success": true,\n  "message": "API logs retrieved successfully",\n  "data": {\n    "logs": [\n      {\n        "_id": "664f5e4a8e4b2a001c9a3333",\n        "endpoint": "/api/v1/messages",\n        "method": "POST",\n        "statusCode": 201,\n        "latencyMs": 142,\n        "ipAddress": "103.21.244.2",\n        "createdAt": "2026-09-17T10:30:00.000Z"\n      }\n    ],\n    "pagination": {\n      "total": 12850,\n      "page": 1,\n      "limit": 20\n    }\n  }\n}`}
                />
              </div>

              {/* GET /api/v1/developer/keys */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="GET" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/developer/keys</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">List all active API keys with key prefix and rate limit tier</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={65}
                  sizeBytes={270}
                  jsonBody={`{\n  "success": true,\n  "message": "API keys retrieved successfully",\n  "data": [\n    {\n      "_id": "664f5e4a8e4b2a001c9a2222",\n      "name": "Production Server Key",\n      "keyPrefix": "wmsg_live_98a7",\n      "rateLimit": 120,\n      "status": "ACTIVE",\n      "createdAt": "2026-09-01T00:00:00.000Z"\n    }\n  ]\n}`}
                />
              </div>
            </div>
          )}

          {/* SECTION: WEBHOOKS */}
          {(selectedCategory === 'all' || selectedCategory === 'webhooks') && (
            <div id="webhooks" className="space-y-6">
              <div className="flex items-center gap-2 border-b border-[#E2EAE6] pb-2">
                <WebhookIcon className="w-5 h-5 text-[#05A222]" />
                <h3 className="text-base font-extrabold text-[#14201C]">Webhooks Endpoints</h3>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#E2EAE6] shadow-2xs space-y-2">
                <h5 className="text-xs font-bold text-[#14201C]">Real-Time Webhook Event Payloads:</h5>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#5F7069]">
                  <li>• <code className="font-mono text-[#006736] font-bold">message.sent</code> — Outbound message dispatched to Meta</li>
                  <li>• <code className="font-mono text-[#006736] font-bold">message.delivered</code> — Recipient received WhatsApp message</li>
                  <li>• <code className="font-mono text-[#006736] font-bold">message.read</code> — Recipient read the WhatsApp message</li>
                  <li>• <code className="font-mono text-rose-600 font-bold">message.failed</code> — Delivery error or window expired</li>
                  <li>• <code className="font-mono text-[#006736] font-bold">conversation.new</code> — New 24-hour customer conversation</li>
                  <li>• <code className="font-mono text-[#006736] font-bold">contact.new</code> — New inbound contact registered</li>
                </ul>
              </div>

              {/* GET /api/v1/webhooks/subscriptions */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="GET" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/webhooks/subscriptions</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">List all registered outbound webhook subscriptions</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={65}
                  sizeBytes={290}
                  jsonBody={`{\n  "success": true,\n  "message": "Webhooks retrieved successfully",\n  "data": [\n    {\n      "_id": "664f6f5a8e4b2a001c9a2222",\n      "url": "https://yourserver.com/api/webhooks/whatsapp",\n      "events": [\n        "message.sent",\n        "message.delivered",\n        "message.read",\n        "message.failed"\n      ],\n      "isActive": true,\n      "createdAt": "2026-09-17T00:00:00.000Z"\n    }\n  ]\n}`}
                />
              </div>

              {/* POST /api/v1/webhooks/subscriptions */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="POST" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/webhooks/subscriptions</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Register a new webhook URL with signing secret</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={201}
                  statusText="Created"
                  timeMs={135}
                  sizeBytes={320}
                  jsonBody={`{\n  "success": true,\n  "message": "Webhook subscription registered successfully",\n  "data": {\n    "_id": "664f6f5a8e4b2a001c9a2222",\n    "url": "https://yourserver.com/api/webhooks/whatsapp",\n    "secret": "whsec_your_custom_signing_secret",\n    "events": [\n      "message.sent",\n      "message.delivered",\n      "message.read",\n      "message.failed"\n    ],\n    "isActive": true\n  }\n}`}
                />
              </div>

              {/* POST /api/v1/webhooks/subscriptions/:id/test */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="POST" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/webhooks/subscriptions/:id/test</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Send ping test payload to verify endpoint connectivity</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={210}
                  sizeBytes={160}
                  jsonBody={`{\n  "success": true,\n  "message": "Webhook test ping delivered successfully",\n  "data": {\n    "statusCode": 200,\n    "latencyMs": 145\n  }\n}`}
                />
              </div>

              {/* DELETE /api/v1/webhooks/subscriptions/:id */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="DELETE" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/webhooks/subscriptions/:id</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Delete a webhook subscription permanently</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={68}
                  sizeBytes={115}
                  jsonBody={`{\n  "success": true,\n  "message": "Webhook subscription deleted successfully",\n  "data": null\n}`}
                />
              </div>
            </div>
          )}

          {/* SECTION: WHATSAPP CONNECTED ACCOUNTS */}
          {(selectedCategory === 'all' || selectedCategory === 'whatsapp') && (
            <div id="whatsapp" className="space-y-6">
              <div className="flex items-center gap-2 border-b border-[#E2EAE6] pb-2">
                <Smartphone className="w-5 h-5 text-[#05A222]" />
                <h3 className="text-base font-extrabold text-[#14201C]">WhatsApp Connected Accounts Endpoints</h3>
              </div>

              {/* GET /api/v1/whatsapp/numbers */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="GET" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/whatsapp/numbers</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">List all connected WhatsApp phone numbers and quality health</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={85}
                  sizeBytes={340}
                  jsonBody={`{\n  "success": true,\n  "message": "WhatsApp phone numbers retrieved",\n  "data": [\n    {\n      "_id": "664f7a6b8e4b2a001c9a1111",\n      "phoneNumber": "+15550001234",\n      "displayPhoneNumber": "+1 (555) 000-1234",\n      "verifiedName": "Acme Customer Care",\n      "qualityRating": "GREEN",\n      "status": "CONNECTED",\n      "isDefault": true\n    }\n  ]\n}`}
                />
              </div>

              {/* GET /api/v1/whatsapp/accounts */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="GET" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/whatsapp/accounts</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">List connected Meta WhatsApp Business Accounts (WABAs)</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={78}
                  sizeBytes={290}
                  jsonBody={`{\n  "success": true,\n  "message": "WhatsApp accounts retrieved",\n  "data": [\n    {\n      "_id": "664f7a6b8e4b2a001c9a2222",\n      "wabaId": "1048958291039",\n      "name": "Acme Business Global",\n      "status": "ACTIVE"\n    }\n  ]\n}`}
                />
              </div>
            </div>
          )}

          {/* SECTION: HTTP ERROR CODES */}
          {(selectedCategory === 'all' || selectedCategory === 'errors') && (
            <div id="errors" className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-[0_4px_20px_rgba(1,59,35,0.03)] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-[#14201C]">HTTP Status & Error Codes</h4>
                  <p className="text-xs text-[#5F7069] mt-0.5">Standard HTTP response status codes returned by WhatsApp Business REST API</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#F8FAFC] text-[#5F7069] border border-[#E2EAE6]">
                  RFC 7231
                </span>
              </div>

              <div className="overflow-x-auto border border-[#E2EAE6] rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2EAE6] text-[#5F7069] uppercase text-[11px] font-bold">
                      <th className="px-4 py-3">Code</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Error Code</th>
                      <th className="px-4 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2EAE6] font-mono text-xs">
                    <tr className="hover:bg-[#F8FAFC]/60 transition-colors">
                      <td className="px-4 py-3 font-extrabold text-[#006736]">
                        <span className="px-2 py-0.5 rounded bg-[#E9F9EE] border border-[#C4EBD0]">200 / 201</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#14201C] font-sans">Success / Created</td>
                      <td className="px-4 py-3 text-[#006736]">-</td>
                      <td className="px-4 py-3 font-sans text-[#5F7069]">Request completed successfully and resource was created or returned.</td>
                    </tr>
                    <tr className="hover:bg-[#F8FAFC]/60 transition-colors">
                      <td className="px-4 py-3 font-extrabold text-amber-600">
                        <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200">400</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#14201C] font-sans">Bad Request</td>
                      <td className="px-4 py-3 text-amber-700">BAD_REQUEST / RECIPIENT_REQUIRED</td>
                      <td className="px-4 py-3 font-sans text-[#5F7069]">Invalid payload, missing required parameters, or malformed phone number.</td>
                    </tr>
                    <tr className="hover:bg-[#F8FAFC]/60 transition-colors">
                      <td className="px-4 py-3 font-extrabold text-rose-600">
                        <span className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200">401</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#14201C] font-sans">Unauthorized</td>
                      <td className="px-4 py-3 text-rose-700">UNAUTHORIZED / TOKEN_EXPIRED</td>
                      <td className="px-4 py-3 font-sans text-[#5F7069]">Missing or invalid API key in <code className="text-[#006736]">x-api-key</code> header.</td>
                    </tr>
                    <tr className="hover:bg-[#F8FAFC]/60 transition-colors">
                      <td className="px-4 py-3 font-extrabold text-rose-600">
                        <span className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200">403</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#14201C] font-sans">Forbidden</td>
                      <td className="px-4 py-3 text-rose-700">FORBIDDEN</td>
                      <td className="px-4 py-3 font-sans text-[#5F7069]">Insufficient scope permissions or inactive account tier.</td>
                    </tr>
                    <tr className="hover:bg-[#F8FAFC]/60 transition-colors">
                      <td className="px-4 py-3 font-extrabold text-slate-600">
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300">404</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#14201C] font-sans">Not Found</td>
                      <td className="px-4 py-3 text-slate-700">NOT_FOUND / ACCOUNT_NOT_FOUND</td>
                      <td className="px-4 py-3 font-sans text-[#5F7069]">The requested message, contact, template or webhook does not exist.</td>
                    </tr>
                    <tr className="hover:bg-[#F8FAFC]/60 transition-colors">
                      <td className="px-4 py-3 font-extrabold text-amber-700">
                        <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-300">409</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#14201C] font-sans">Conflict</td>
                      <td className="px-4 py-3 text-amber-800">CONFLICT</td>
                      <td className="px-4 py-3 font-sans text-[#5F7069]">Duplicate contact phone number or resource collision.</td>
                    </tr>
                    <tr className="hover:bg-[#F8FAFC]/60 transition-colors">
                      <td className="px-4 py-3 font-extrabold text-amber-600">
                        <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200">429</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#14201C] font-sans">Rate Limited</td>
                      <td className="px-4 py-3 text-amber-800">RATE_LIMIT_EXCEEDED</td>
                      <td className="px-4 py-3 font-sans text-[#5F7069]">Exceeded 120 requests/minute tier limit. Slow down or upgrade plan.</td>
                    </tr>
                    <tr className="hover:bg-[#F8FAFC]/60 transition-colors">
                      <td className="px-4 py-3 font-extrabold text-rose-700">
                        <span className="px-2 py-0.5 rounded bg-rose-100 border border-rose-300">500</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#14201C] font-sans">Internal Server Error</td>
                      <td className="px-4 py-3 text-rose-800">INTERNAL_ERROR</td>
                      <td className="px-4 py-3 font-sans text-[#5F7069]">Unexpected server error. Check API logs or contact platform support.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Categorized Table of Contents & Quick Nav */}
        <div className="w-full lg:w-64 xl:w-72 shrink-0 lg:sticky lg:top-6 space-y-4">
          {/* Table of Contents Box */}
          <div className="bg-white border border-[#E2EAE6] p-4 rounded-2xl shadow-[0_4px_20px_rgba(1,59,35,0.03)] space-y-3">
            <div className="flex items-center justify-between border-b border-[#E2EAE6] pb-2.5">
              <div className="flex items-center gap-2">
                <ListTree className="w-4 h-4 text-[#006736]" />
                <h4 className="text-xs font-black uppercase tracking-wider text-[#14201C]">
                  Table of Contents
                </h4>
              </div>
              <span className="text-[10px] font-bold text-[#5F7069] bg-[#F8FAFC] px-1.5 py-0.5 rounded border border-[#E2EAE6]">
                Quick Nav
              </span>
            </div>

            {/* Navigation List Items */}
            <nav className="space-y-1.5">
              {tocCategories.map((item) => {
                const IconComponent = item.icon;
                const isActive = selectedCategory === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedCategory(item.id)}
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

          {/* Quick Link to Backend Setup Card */}
          <div className="bg-[#F8FAFC] border border-[#E2EAE6] p-4 rounded-2xl shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-[#006736]" />
              <span className="text-xs font-bold text-[#14201C]">Backend Configuration</span>
            </div>
            <p className="text-[11px] text-[#5F7069] leading-relaxed">
              Configure your backend environment with <code className="font-mono bg-white px-1 py-0.5 rounded border border-[#E2EAE6] text-[#006736]">.env</code> credentials and Axios client.
            </p>
            <Link to={ROUTES.DEVELOPERS_BACKEND_SETUP} className="block pt-1">
              <Button
                size="sm"
                variant="outline"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="w-full text-xs font-bold text-[#006736] bg-white border-[#E2EAE6] hover:bg-[#E9F9EE] justify-between h-8 px-3"
              >
                <span>Open .env Guide</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
