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
  | 'account'
  | 'webhooks'
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
        if (match.includes('X-API') || match.includes('X-Channel') || match.includes('Content-Type')) {
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
 * Method Badge Helper
 */
const MethodBadge: React.FC<{ method: 'GET' | 'POST' | 'PUT' | 'DELETE' }> = ({ method }) => {
  const colors = {
    GET: 'bg-blue-50 text-blue-700 border-blue-200',
    POST: 'bg-[#E9F9EE] text-[#006736] border-[#C4EBD0]',
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
      count: '14',
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
      count: 'Headers',
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
      count: '4',
      activeClasses: 'bg-sky-50 text-sky-900 border-sky-300 font-bold shadow-2xs',
      badgeActive: 'bg-sky-600 text-white shadow-2xs',
      badgeInactive: 'bg-sky-100/70 text-sky-800 border border-sky-200/70',
      iconColor: 'text-sky-700',
      iconBg: 'bg-sky-100/80',
    },
    {
      id: 'contacts',
      label: 'Contacts & Groups',
      icon: Users,
      count: '7',
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
      count: '1',
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
      count: '1',
      activeClasses: 'bg-rose-50 text-rose-900 border-rose-300 font-bold shadow-2xs',
      badgeActive: 'bg-rose-600 text-white shadow-2xs',
      badgeInactive: 'bg-rose-100/70 text-rose-800 border border-rose-200/70',
      iconColor: 'text-rose-700',
      iconBg: 'bg-rose-100/80',
    },
    {
      id: 'account',
      label: 'Account & Usage',
      icon: UserCheck,
      count: '2',
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
      id: 'errors',
      label: 'HTTP Error Codes',
      icon: AlertTriangle,
      count: '7',
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
            Use the REST API to integrate messaging, contacts, campaigns, and webhooks into your applications.
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
                https://api24.in/api/v1
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
                    <h4 className="text-base font-bold text-[#14201C]">Authentication</h4>
                    <p className="text-xs text-[#5F7069]">Authenticate all API requests via key and secret headers</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]">
                  Required Headers
                </span>
              </div>

              <p className="text-xs text-[#5F7069] leading-relaxed">
                All API requests must include your API key and secret in the request headers. You can generate and manage API keys from the Settings page.
                All responses follow the standard format: <code className="font-mono bg-[#F8FAFC] px-1.5 py-0.5 rounded border border-[#E2EAE6] text-[#006736]">&#123; success: boolean, data?: any, error?: string &#125;</code>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3 bg-white rounded-xl font-mono text-xs border border-[#E2EAE6] shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-[#64748B]">Header 1</div>
                  <div className="text-[#A31515] font-bold mt-1">X-API-Key: <span className="text-[#006736]">YOUR_API_KEY</span></div>
                </div>
                <div className="p-3 bg-white rounded-xl font-mono text-xs border border-[#E2EAE6] shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-[#64748B]">Header 2</div>
                  <div className="text-[#A31515] font-bold mt-1">X-API-Secret: <span className="text-[#006736]">YOUR_API_SECRET</span></div>
                </div>
                <div className="p-3 bg-white rounded-xl font-mono text-xs border border-[#E2EAE6] shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-[#64748B]">Header 3 (Optional / Multi-Channel)</div>
                  <div className="text-[#A31515] font-bold mt-1">X-Channel-Id: <span className="text-[#006736]">YOUR_CHANNEL_ID</span></div>
                </div>
              </div>

              {/* Example Authenticated Request */}
              <div className="rounded-xl overflow-hidden border border-[#E2EAE6] bg-[#F8FAFC] shadow-2xs">
                <div className="flex items-center justify-between px-4 py-2 bg-[#F1F5F9] border-b border-[#E2EAE6] text-xs font-mono text-[#475569]">
                  <span className="font-bold">Example Authenticated Request (GET /api/v1/account)</span>
                  <button
                    onClick={() => handleCopy('auth_curl', `curl -X GET "https://api24.in/api/v1/account" \\\n  -H "X-API-Key: YOUR_API_KEY" \\\n  -H "X-API-Secret: YOUR_API_SECRET" \\\n  -H "X-Channel-Id: YOUR_CHANNEL_ID"`)}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#006736] hover:underline cursor-pointer"
                  >
                    {copiedId === 'auth_curl' ? <Check className="w-3.5 h-3.5 text-[#05A222]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'auth_curl' ? 'Copied' : 'Copy cURL'}</span>
                  </button>
                </div>
                <div className="p-4 bg-white overflow-x-auto">
                  <pre
                    dangerouslySetInnerHTML={{
                      __html: highlightPostmanCode(
                        `curl -X GET "https://api24.in/api/v1/account" \\\n  -H "X-API-Key: YOUR_API_KEY" \\\n  -H "X-API-Secret: YOUR_API_SECRET" \\\n  -H "X-Channel-Id: YOUR_CHANNEL_ID"`,
                        'curl'
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
                    <h4 className="text-base font-bold text-[#14201C]">Rate Limiting</h4>
                    <p className="text-xs text-[#5F7069]">Monthly request quotas and per-minute threshold protection</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  HTTP 429 Protection
                </span>
              </div>

              <p className="text-xs text-[#5F7069] leading-relaxed">
                API usage is rate-limited based on your subscription plan. Exceeding limits will result in a 429 status code response.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2EAE6] space-y-1">
                  <h5 className="text-xs font-bold text-[#14201C]">Monthly Request Limit</h5>
                  <p className="text-[11px] text-[#5F7069]">Total API requests allowed per calendar month, based on your subscription plan.</p>
                </div>
                <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2EAE6] space-y-1">
                  <h5 className="text-xs font-bold text-[#14201C]">Per-Minute Rate Limit</h5>
                  <p className="text-[11px] text-[#5F7069]">Maximum number of requests allowed per minute to prevent abuse and ensure high availability.</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-bold text-[#5F7069]">Response when rate limit is exceeded (HTTP 429):</span>
                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={429}
                  statusText="Too Many Requests"
                  timeMs={32}
                  sizeBytes={96}
                  jsonBody={`{\n  "success": false,\n  "error": "Rate limit exceeded. Please try again later."\n}`}
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

              {/* Endpoint 1: POST /api/v1/messages/template */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="POST" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/messages/template</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Send Meta pre-approved template message</span>
                </div>

                <div className="p-3 bg-[#F8FAFC] rounded-xl text-xs text-[#5F7069] border border-[#E2EAE6] leading-relaxed">
                  <strong>Phone format:</strong> Digits only with country code, no spaces or + sign (e.g. <code className="font-mono text-[#006736] font-bold">919876543210</code> for India, <code className="font-mono text-[#006736] font-bold">14155552671</code> for US).
                </div>

                {/* Request */}
                <div className="rounded-xl overflow-hidden border border-[#E2EAE6] bg-[#F8FAFC]">
                  <div className="flex items-center justify-between px-4 py-2 bg-[#F1F5F9] border-b border-[#E2EAE6] text-xs font-mono">
                    <span className="font-bold text-[#475569]">Request Body (JSON)</span>
                    <button
                      onClick={() => handleCopy('msg_tpl', `curl -X POST "https://api24.in/api/v1/messages/template" \\\n  -H "X-API-Key: YOUR_API_KEY" \\\n  -H "X-API-Secret: YOUR_API_SECRET" \\\n  -H "X-Channel-Id: YOUR_CHANNEL_ID" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n  "to": "919876543210",\n  "templateName": "hello_world",\n  "language": "en_US",\n  "components": [\n    {\n      "type": "body",\n      "parameters": [\n        { "type": "text", "text": "John Doe" },\n        { "type": "text", "text": "ORD-12345" }\n      ]\n    }\n  ]\n}'`)}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#006736] hover:underline cursor-pointer"
                    >
                      {copiedId === 'msg_tpl' ? <Check className="w-3.5 h-3.5 text-[#05A222]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'msg_tpl' ? 'Copied' : 'Copy cURL'}</span>
                    </button>
                  </div>
                  <div className="p-4 bg-white overflow-x-auto">
                    <pre
                      dangerouslySetInnerHTML={{
                        __html: highlightPostmanCode(
                          `curl -X POST "https://api24.in/api/v1/messages/template" \\\n  -H "X-API-Key: YOUR_API_KEY" \\\n  -H "X-API-Secret: YOUR_API_SECRET" \\\n  -H "X-Channel-Id: YOUR_CHANNEL_ID" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n  "to": "919876543210",\n  "templateName": "hello_world",\n  "language": "en_US",\n  "components": [\n    {\n      "type": "body",\n      "parameters": [\n        { "type": "text", "text": "John Doe" },\n        { "type": "text", "text": "ORD-12345" }\n      ]\n    }\n  ]\n}'`,
                          activeLang
                        ),
                      }}
                      className="font-mono text-xs leading-relaxed text-[#0F172A]"
                    />
                  </div>
                </div>

                {/* Response */}
                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={154}
                  sizeBytes={228}
                  jsonBody={`{\n  "success": true,\n  "data": {\n    "messageId": "uuid-xxx",\n    "whatsappMessageId": "wamid.xxx",\n    "contactId": "uuid-xxx",\n    "conversationId": "uuid-xxx",\n    "status": "sent"\n  }\n}`}
                />
              </div>

              {/* Endpoint 2: POST /api/v1/messages/reply */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="POST" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/messages/reply</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Send free-text reply within 24-hr customer service window</span>
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                  <strong>24-Hour Service Window:</strong> This endpoint only works when the contact has sent you an inbound message in the last 24 hours. If the window has expired, use the template message endpoint instead.
                </div>

                <div className="rounded-xl overflow-hidden border border-[#E2EAE6] bg-[#F8FAFC]">
                  <div className="flex items-center justify-between px-4 py-2 bg-[#F1F5F9] border-b border-[#E2EAE6] text-xs font-mono">
                    <span className="font-bold text-[#475569]">Request Payload (24h Reply)</span>
                    <button
                      onClick={() => handleCopy('msg_reply', `curl -X POST "https://api24.in/api/v1/messages/reply" \\\n  -H "X-API-Key: YOUR_API_KEY" \\\n  -H "X-API-Secret: YOUR_API_SECRET" \\\n  -H "X-Channel-Id: YOUR_CHANNEL_ID" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n  "to": "919876543210",\n  "message": "Hello! Your order has been shipped."\n}'`)}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#006736] hover:underline cursor-pointer"
                    >
                      {copiedId === 'msg_reply' ? <Check className="w-3.5 h-3.5 text-[#05A222]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'msg_reply' ? 'Copied' : 'Copy cURL'}</span>
                    </button>
                  </div>
                  <div className="p-4 bg-white overflow-x-auto">
                    <pre
                      dangerouslySetInnerHTML={{
                        __html: highlightPostmanCode(
                          `curl -X POST "https://api24.in/api/v1/messages/reply" \\\n  -H "X-API-Key: YOUR_API_KEY" \\\n  -H "X-API-Secret: YOUR_API_SECRET" \\\n  -H "X-Channel-Id: YOUR_CHANNEL_ID" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n  "to": "919876543210",\n  "message": "Hello! Your order has been shipped."\n}'`,
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
                  timeMs={118}
                  sizeBytes={180}
                  jsonBody={`{\n  "success": true,\n  "data": {\n    "messageId": "uuid-xxx",\n    "whatsappMessageId": "wamid.xxx",\n    "status": "sent"\n  }\n}`}
                />
              </div>

              {/* Endpoint 3: GET /api/v1/messages/:contactPhone */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="GET" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/messages/:contactPhone</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Get message history for a contact (?limit=50&offset=0)</span>
                </div>

                <div className="rounded-xl overflow-hidden border border-[#E2EAE6] bg-[#F8FAFC]">
                  <div className="flex items-center justify-between px-4 py-2 bg-[#F1F5F9] border-b border-[#E2EAE6] text-xs font-mono">
                    <span className="font-bold text-[#475569]">Request URL</span>
                    <button
                      onClick={() => handleCopy('msg_hist', `curl -X GET "https://api24.in/api/v1/messages/919876543210?limit=50&offset=0" \\\n  -H "X-API-Key: YOUR_API_KEY" \\\n  -H "X-API-Secret: YOUR_API_SECRET" \\\n  -H "X-Channel-Id: YOUR_CHANNEL_ID"`)}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#006736] hover:underline cursor-pointer"
                    >
                      {copiedId === 'msg_hist' ? <Check className="w-3.5 h-3.5 text-[#05A222]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'msg_hist' ? 'Copied' : 'Copy cURL'}</span>
                    </button>
                  </div>
                  <div className="p-4 bg-white overflow-x-auto">
                    <pre
                      dangerouslySetInnerHTML={{
                        __html: highlightPostmanCode(
                          `curl -X GET "https://api24.in/api/v1/messages/919876543210?limit=50&offset=0" \\\n  -H "X-API-Key: YOUR_API_KEY" \\\n  -H "X-API-Secret: YOUR_API_SECRET" \\\n  -H "X-Channel-Id: YOUR_CHANNEL_ID"`,
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
                  timeMs={85}
                  sizeBytes={142}
                  jsonBody={`{\n  "success": true,\n  "data": {\n    "messages": [],\n    "total": 0,\n    "limit": 50,\n    "offset": 0\n  }\n}`}
                />
              </div>

              {/* Endpoint 4: GET /api/v1/messages/status/:messageId */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="GET" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/messages/status/:messageId</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Get delivery and read status of a message</span>
                </div>

                <div className="rounded-xl overflow-hidden border border-[#E2EAE6] bg-[#F8FAFC]">
                  <div className="flex items-center justify-between px-4 py-2 bg-[#F1F5F9] border-b border-[#E2EAE6] text-xs font-mono">
                    <span className="font-bold text-[#475569]">Request URL</span>
                    <button
                      onClick={() => handleCopy('msg_stat', `curl -X GET "https://api24.in/api/v1/messages/status/uuid-xxx" \\\n  -H "X-API-Key: YOUR_API_KEY" \\\n  -H "X-API-Secret: YOUR_API_SECRET" \\\n  -H "X-Channel-Id: YOUR_CHANNEL_ID"`)}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#006736] hover:underline cursor-pointer"
                    >
                      {copiedId === 'msg_stat' ? <Check className="w-3.5 h-3.5 text-[#05A222]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'msg_stat' ? 'Copied' : 'Copy cURL'}</span>
                    </button>
                  </div>
                  <div className="p-4 bg-white overflow-x-auto">
                    <pre
                      dangerouslySetInnerHTML={{
                        __html: highlightPostmanCode(
                          `curl -X GET "https://api24.in/api/v1/messages/status/uuid-xxx" \\\n  -H "X-API-Key: YOUR_API_KEY" \\\n  -H "X-API-Secret: YOUR_API_SECRET" \\\n  -H "X-Channel-Id: YOUR_CHANNEL_ID"`,
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
                  timeMs={62}
                  sizeBytes={270}
                  jsonBody={`{\n  "success": true,\n  "data": {\n    "id": "uuid-xxx",\n    "whatsappMessageId": "wamid.xxx",\n    "status": "delivered",\n    "deliveredAt": "2026-09-17T12:00:00Z",\n    "readAt": null,\n    "errorCode": null,\n    "errorMessage": null,\n    "createdAt": "2026-09-17T11:59:00Z"\n  }\n}`}
                />
              </div>
            </div>
          )}

          {/* SECTION: CONTACTS & GROUPS */}
          {(selectedCategory === 'all' || selectedCategory === 'contacts') && (
            <div id="contacts" className="space-y-6">
              <div className="flex items-center gap-2 border-b border-[#E2EAE6] pb-2">
                <Users className="w-5 h-5 text-[#05A222]" />
                <h3 className="text-base font-extrabold text-[#14201C]">Contacts & Groups Endpoints</h3>
              </div>

              {/* 1. GET /api/v1/contacts */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="GET" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/contacts</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">List all contacts with optional filters (?search=&limit=50&offset=0&groupId=)</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={75}
                  sizeBytes={115}
                  jsonBody={`{\n  "success": true,\n  "data": {\n    "contacts": [],\n    "total": 0\n  }\n}`}
                />
              </div>

              {/* 2. POST /api/v1/contacts */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="POST" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/contacts</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Create a new contact (Returns 409 Conflict if phone exists)</span>
                </div>

                <div className="rounded-xl overflow-hidden border border-[#E2EAE6] bg-[#F8FAFC]">
                  <div className="flex items-center justify-between px-4 py-2 bg-[#F1F5F9] border-b border-[#E2EAE6] text-xs font-mono">
                    <span className="font-bold text-[#475569]">Request Payload</span>
                    <button
                      onClick={() => handleCopy('cnt_create', `curl -X POST "https://api24.in/api/v1/contacts" \\\n  -H "X-API-Key: YOUR_API_KEY" \\\n  -H "X-API-Secret: YOUR_API_SECRET" \\\n  -H "X-Channel-Id: YOUR_CHANNEL_ID" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n  "phone": "919876543210",\n  "name": "John Doe",\n  "email": "john@example.com"\n}'`)}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#006736] hover:underline cursor-pointer"
                    >
                      {copiedId === 'cnt_create' ? <Check className="w-3.5 h-3.5 text-[#05A222]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'cnt_create' ? 'Copied' : 'Copy cURL'}</span>
                    </button>
                  </div>
                  <div className="p-4 bg-white overflow-x-auto">
                    <pre
                      dangerouslySetInnerHTML={{
                        __html: highlightPostmanCode(
                          `curl -X POST "https://api24.in/api/v1/contacts" \\\n  -H "X-API-Key: YOUR_API_KEY" \\\n  -H "X-API-Secret: YOUR_API_SECRET" \\\n  -H "X-Channel-Id: YOUR_CHANNEL_ID" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n  "phone": "919876543210",\n  "name": "John Doe",\n  "email": "john@example.com"\n}'`,
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
                  sizeBytes={160}
                  jsonBody={`{\n  "success": true,\n  "data": {\n    "id": "uuid-xxx",\n    "phone": "919876543210",\n    "name": "John Doe"\n  }\n}`}
                />
              </div>

              {/* 3. PUT /api/v1/contacts/:id */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="PUT" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/contacts/:id</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Update an existing contact's name or email</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={98}
                  sizeBytes={172}
                  jsonBody={`{\n  "success": true,\n  "data": {\n    "id": "uuid-xxx",\n    "name": "John Updated"\n  }\n}`}
                />
              </div>

              {/* 4. DELETE /api/v1/contacts/:id */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="DELETE" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/contacts/:id</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Delete a contact permanently</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={78}
                  sizeBytes={110}
                  jsonBody={`{\n  "success": true,\n  "data": {\n    "message": "Contact deleted successfully"\n  }\n}`}
                />
              </div>

              {/* 5. GET /api/v1/contacts/groups */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="GET" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/contacts/groups</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">List all contact groups</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={55}
                  sizeBytes={70}
                  jsonBody={`{\n  "success": true,\n  "data": []\n}`}
                />
              </div>

              {/* 6. POST /api/v1/contacts/groups/:groupId/add */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="POST" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/contacts/groups/:groupId/add</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Add contact to group</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={92}
                  sizeBytes={108}
                  jsonBody={`{\n  "success": true,\n  "data": {\n    "message": "Contact added to group"\n  }\n}`}
                />
              </div>

              {/* 7. POST /api/v1/contacts/groups/:groupId/remove */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="POST" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/contacts/groups/:groupId/remove</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Remove contact from group</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={88}
                  sizeBytes={112}
                  jsonBody={`{\n  "success": true,\n  "data": {\n    "message": "Contact removed from group"\n  }\n}`}
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

              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="GET" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/templates</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">List all message templates (?status=APPROVED)</span>
                </div>

                <p className="text-xs text-[#5F7069] leading-relaxed">
                  Filter by status to get only approved templates ready for sending. Common status values: <code className="font-mono text-[#006736] font-bold">APPROVED</code>, <code className="font-mono text-amber-600 font-bold">PENDING</code>, <code className="font-mono text-rose-600 font-bold">REJECTED</code>.
                </p>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={105}
                  sizeBytes={210}
                  jsonBody={`{\n  "success": true,\n  "data": [\n    {\n      "id": "uuid-xxx",\n      "name": "hello_world",\n      "status": "APPROVED",\n      "language": "en_US",\n      "category": "MARKETING"\n    }\n  ]\n}`}
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

              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="GET" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/campaigns</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">List all broadcast campaigns with optional filters (?status=completed&limit=10&offset=0)</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={114}
                  sizeBytes={148}
                  jsonBody={`{\n  "success": true,\n  "data": {\n    "campaigns": [],\n    "total": 0,\n    "limit": 10,\n    "offset": 0\n  }\n}`}
                />
              </div>
            </div>
          )}

          {/* SECTION: ACCOUNT & USAGE */}
          {(selectedCategory === 'all' || selectedCategory === 'account') && (
            <div id="account" className="space-y-6">
              <div className="flex items-center gap-2 border-b border-[#E2EAE6] pb-2">
                <UserCheck className="w-5 h-5 text-[#05A222]" />
                <h3 className="text-base font-extrabold text-[#14201C]">Account & Usage Endpoints</h3>
              </div>

              {/* GET /api/v1/account */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="GET" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/account</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Get channel information and API key details</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={68}
                  sizeBytes={340}
                  jsonBody={`{\n  "success": true,\n  "data": {\n    "userId": "uuid-xxx",\n    "channel": {\n      "id": "uuid-xxx",\n      "name": "My Channel",\n      "phoneNumber": "+919876543210",\n      "isActive": true,\n      "healthStatus": "healthy"\n    },\n    "usage": {\n      "requestCount": 1250,\n      "monthlyRequestCount": 340,\n      "monthlyResetAt": "2026-10-01T00:00:00Z",\n      "lastUsedAt": "2026-09-17T10:30:00Z"\n    }\n  }\n}`}
                />
              </div>

              {/* GET /api/v1/account/usage */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="GET" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/account/usage</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Get detailed API usage breakdown by time period</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={74}
                  sizeBytes={310}
                  jsonBody={`{\n  "success": true,\n  "data": {\n    "last24Hours": 42,\n    "last7Days": 310,\n    "total": 1250,\n    "recentRequests": [\n      {\n        "endpoint": "/api/v1/messages/template",\n        "method": "POST",\n        "statusCode": 200,\n        "responseTime": 312,\n        "createdAt": "2026-09-17T10:30:00Z"\n      }\n    ]\n  }\n}`}
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
                <h5 className="text-xs font-bold text-[#14201C]">Supported Webhook Events:</h5>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#5F7069]">
                  <li>• <code className="font-mono text-[#006736] font-bold">message.sent</code> — fired when message is dispatched</li>
                  <li>• <code className="font-mono text-[#006736] font-bold">message.delivered</code> — fired on WhatsApp delivery receipt</li>
                  <li>• <code className="font-mono text-[#006736] font-bold">message.read</code> — fired when recipient reads message</li>
                  <li>• <code className="font-mono text-rose-600 font-bold">message.failed</code> — fired when delivery fails</li>
                  <li>• <code className="font-mono text-[#006736] font-bold">conversation.new</code> — fired when new conversation starts</li>
                  <li>• <code className="font-mono text-[#006736] font-bold">contact.new</code> — fired when new contact is created</li>
                </ul>
              </div>

              {/* GET /api/v1/webhooks */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="GET" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/webhooks</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">List all registered webhooks</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={65}
                  sizeBytes={210}
                  jsonBody={`{\n  "success": true,\n  "data": [\n    {\n      "id": "uuid-xxx",\n      "url": "https://yourserver.com/webhooks/whatsapp",\n      "events": [\n        "message.sent",\n        "message.delivered"\n      ],\n      "isActive": true,\n      "createdAt": "2026-09-17T00:00:00Z"\n    }\n  ]\n}`}
                />
              </div>

              {/* POST /api/v1/webhooks */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="POST" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/webhooks</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Register a new webhook URL (returns signing secret)</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={201}
                  statusText="Created"
                  timeMs={135}
                  sizeBytes={310}
                  jsonBody={`{\n  "success": true,\n  "data": {\n    "id": "uuid-xxx",\n    "url": "https://yourserver.com/webhooks/whatsapp",\n    "secret": "whsec_your_webhook_secret_key",\n    "events": [\n      "message.sent",\n      "message.delivered",\n      "message.read",\n      "message.failed"\n    ],\n    "isActive": true,\n    "note": "Store the webhook secret securely for signature verification."\n  }\n}`}
                />
              </div>

              {/* PUT /api/v1/webhooks/:id */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="PUT" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/webhooks/:id</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Update an existing webhook's URL, events, or active status</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={95}
                  sizeBytes={225}
                  jsonBody={`{\n  "success": true,\n  "data": {\n    "id": "uuid-xxx",\n    "url": "https://yourserver.com/webhooks/new-endpoint",\n    "events": [\n      "message.sent",\n      "message.failed"\n    ],\n    "isActive": true,\n    "updatedAt": "2026-09-17T10:30:00Z"\n  }\n}`}
                />
              </div>

              {/* DELETE /api/v1/webhooks/:id */}
              <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MethodBadge method="DELETE" />
                    <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/webhooks/:id</code>
                  </div>
                  <span className="text-xs text-[#5F7069] font-medium">Delete a webhook permanently</span>
                </div>

                <PostmanResponseViewer
                  responseMode={responseMode}
                  statusCode={200}
                  statusText="OK"
                  timeMs={68}
                  sizeBytes={110}
                  jsonBody={`{\n  "success": true,\n  "data": {\n    "message": "Webhook deleted successfully"\n  }\n}`}
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
                      <th className="px-4 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2EAE6] font-mono text-xs">
                    <tr className="hover:bg-[#F8FAFC]/60 transition-colors">
                      <td className="px-4 py-3 font-extrabold text-[#006736]">
                        <span className="px-2 py-0.5 rounded bg-[#E9F9EE] border border-[#C4EBD0]">200 / 201</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#14201C] font-sans">Success</td>
                      <td className="px-4 py-3 font-sans text-[#5F7069]">Request completed successfully and resource was created or returned.</td>
                    </tr>
                    <tr className="hover:bg-[#F8FAFC]/60 transition-colors">
                      <td className="px-4 py-3 font-extrabold text-amber-600">
                        <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200">400</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#14201C] font-sans">Bad Request</td>
                      <td className="px-4 py-3 font-sans text-[#5F7069]">The request body or query parameters are invalid or malformed.</td>
                    </tr>
                    <tr className="hover:bg-[#F8FAFC]/60 transition-colors">
                      <td className="px-4 py-3 font-extrabold text-rose-600">
                        <span className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200">401</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#14201C] font-sans">Unauthorized</td>
                      <td className="px-4 py-3 font-sans text-[#5F7069]">Invalid or missing API key/secret in request headers.</td>
                    </tr>
                    <tr className="hover:bg-[#F8FAFC]/60 transition-colors">
                      <td className="px-4 py-3 font-extrabold text-rose-600">
                        <span className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200">403</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#14201C] font-sans">Forbidden</td>
                      <td className="px-4 py-3 font-sans text-[#5F7069]">Insufficient permissions for this action or 24-hour customer service window expired.</td>
                    </tr>
                    <tr className="hover:bg-[#F8FAFC]/60 transition-colors">
                      <td className="px-4 py-3 font-extrabold text-slate-600">
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300">404</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#14201C] font-sans">Not Found</td>
                      <td className="px-4 py-3 font-sans text-[#5F7069]">The requested resource, contact, message or webhook does not exist.</td>
                    </tr>
                    <tr className="hover:bg-[#F8FAFC]/60 transition-colors">
                      <td className="px-4 py-3 font-extrabold text-amber-700">
                        <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-300">409</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#14201C] font-sans">Conflict</td>
                      <td className="px-4 py-3 font-sans text-[#5F7069]">Resource already exists (e.g. duplicate contact phone number).</td>
                    </tr>
                    <tr className="hover:bg-[#F8FAFC]/60 transition-colors">
                      <td className="px-4 py-3 font-extrabold text-amber-600">
                        <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200">429</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#14201C] font-sans">Rate Limited</td>
                      <td className="px-4 py-3 font-sans text-[#5F7069]">Too many requests — slow down or upgrade your subscription plan.</td>
                    </tr>
                    <tr className="hover:bg-[#F8FAFC]/60 transition-colors">
                      <td className="px-4 py-3 font-extrabold text-rose-700">
                        <span className="px-2 py-0.5 rounded bg-rose-100 border border-rose-300">500</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#14201C] font-sans">Internal Server Error</td>
                      <td className="px-4 py-3 font-sans text-[#5F7069]">Unexpected server error. Check API logs or contact support.</td>
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

