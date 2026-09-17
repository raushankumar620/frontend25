import React, { useState } from 'react';
import {
  Copy,
  Check,
  Server,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

type LanguageTab = 'curl' | 'node' | 'python' | 'php';
type SectionFilter = 'all' | 'auth' | 'text' | 'template' | 'contact' | 'errors';

/**
 * Postman-style JSON Syntax Highlighter
 * Keys: Crimson Red (#A31515)
 * Strings: Emerald Green (#006736)
 * Numbers: Royal Blue (#005CC5)
 * Booleans: Purple (#7C3AED)
 * Null: Slate Gray (#64748B)
 * Punctuation: Dark Slate (#475569)
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
      // JSON keys inside curl body
      .replace(
        /"([a-zA-Z0-9_]+)"\s*:/g,
        '<span class="text-[#A31515] font-bold">"$1"</span><span class="text-[#64748B]">:</span>'
      )
      // Strings in quotes
      .replace(/(["'])(?:(?=(\\?))\2[\s\S])*?\1/g, (match) => {
        if (match.includes('http://') || match.includes('https://')) {
          return `<span class="text-[#005CC5] font-semibold underline decoration-[#005CC5]/30">${match}</span>`;
        }
        if (match.includes('x-api-key') || match.includes('Content-Type')) {
          return `<span class="text-[#006736] font-bold">${match}</span>`;
        }
        return `<span class="text-[#006736] font-medium">${match}</span>`;
      })
      // Command & Verbs
      .replace(/\b(curl)\b/g, '<span class="text-[#7C3AED] font-bold">$1</span>')
      .replace(/\b(POST|GET|PATCH|DELETE)\b/g, '<span class="text-[#05A222] font-black">$1</span>')
      .replace(/(-X|-H|-d)\b/g, '<span class="text-[#D97706] font-bold">$1</span>');
  }

  // Node, Python, PHP
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
 * Interactive Postman Response Viewer Component
 */
interface PostmanResponseViewerProps {
  statusCode: number;
  statusText: string;
  timeMs: number;
  sizeBytes: number;
  jsonBody: string;
}

const PostmanResponseViewer: React.FC<PostmanResponseViewerProps> = ({
  statusCode,
  statusText,
  timeMs,
  sizeBytes,
  jsonBody,
}) => {
  const [activeMode, setActiveMode] = useState<'pretty' | 'raw'>('pretty');
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
      <div className="flex flex-wrap items-center justify-between px-3.5 py-2.5 bg-[#F8FAFC] border-b border-[#E2EAE6] gap-2 text-xs">
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
          {/* Pretty / Raw Mode Switch */}
          <div className="flex items-center bg-white border border-[#E2EAE6] rounded-lg p-0.5 text-[11px]">
            <button
              type="button"
              onClick={() => setActiveMode('pretty')}
              className={`px-2 py-0.5 rounded cursor-pointer font-bold transition-all ${
                activeMode === 'pretty'
                  ? 'bg-[#006736] text-white shadow-2xs'
                  : 'text-[#5F7069] hover:text-[#14201C]'
              }`}
            >
              Pretty
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('raw')}
              className={`px-2 py-0.5 rounded cursor-pointer font-bold transition-all ${
                activeMode === 'raw'
                  ? 'bg-[#006736] text-white shadow-2xs'
                  : 'text-[#5F7069] hover:text-[#14201C]'
              }`}
            >
              Raw
            </button>
          </div>

          <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-[#E9F9EE] border border-[#C4EBD0] rounded text-[#006736]">
            JSON
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
        {activeMode === 'pretty' ? (
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
  const [selectedSection, setSelectedSection] = useState<SectionFilter>('all');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const getSnippets = (type: 'send_text' | 'send_template' | 'create_contact') => {
    if (type === 'send_text') {
      return {
        curl: `curl -X POST https://api.whatsappmsg.com/api/v1/messages \\
  -H "x-api-key: wmsg_live_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+15551234567",
    "type": "text",
    "text": "Hello Alex! Your appointment has been booked for tomorrow at 3:00 PM."
  }'`,
        node: `import axios from 'axios';

const { data } = await axios.post(
  'https://api.whatsappmsg.com/api/v1/messages',
  {
    to: '+15551234567',
    type: 'text',
    text: 'Hello Alex! Your appointment has been booked for tomorrow at 3:00 PM.'
  },
  {
    headers: {
      'x-api-key': 'wmsg_live_your_api_key_here',
      'Content-Type': 'application/json'
    }
  }
);

console.log('Message ID:', data.data.messageId);`,
        python: `import requests

url = "https://api.whatsappmsg.com/api/v1/messages"
headers = {
    "x-api-key": "wmsg_live_your_api_key_here",
    "Content-Type": "application/json"
}
payload = {
    "to": "+15551234567",
    "type": "text",
    "text": "Hello Alex! Your appointment has been booked for tomorrow at 3:00 PM."
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
        php: `<?php
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.whatsappmsg.com/api/v1/messages",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_POSTFIELDS => json_encode([
    "to" => "+15551234567",
    "type" => "text",
    "text": "Hello Alex! Your appointment has been booked for tomorrow at 3:00 PM."
  ]),
  CURLOPT_HTTPHEADER => [
    "x-api-key: wmsg_live_your_api_key_here",
    "Content-Type": "application/json"
  ],
]);

$response = curl_exec($curl);
curl_close($curl);
echo $response;`,
      };
    }

    if (type === 'create_contact') {
      return {
        curl: `curl -X POST https://api.whatsappmsg.com/api/v1/contacts \\
  -H "x-api-key: wmsg_live_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Sarah Jenkins",
    "phoneNumber": "+15559876543",
    "email": "sarah@acme.com",
    "tags": ["VIP-Customer", "Product-Qualified"]
  }'`,
        node: `import axios from 'axios';

const { data } = await axios.post(
  'https://api.whatsappmsg.com/api/v1/contacts',
  {
    name: 'Sarah Jenkins',
    phoneNumber: '+15559876543',
    email: 'sarah@acme.com',
    tags: ['VIP-Customer', 'Product-Qualified']
  },
  {
    headers: {
      'x-api-key': 'wmsg_live_your_api_key_here',
      'Content-Type': 'application/json'
    }
  }
);`,
        python: `import requests

res = requests.post(
    "https://api.whatsappmsg.com/api/v1/contacts",
    json={
        "name": "Sarah Jenkins",
        "phoneNumber": "+15559876543",
        "email": "sarah@acme.com",
        "tags": ["VIP-Customer", "Product-Qualified"]
    },
    headers={
        "x-api-key": "wmsg_live_your_api_key_here",
        "Content-Type": "application/json"
    }
)
print(res.json())`,
        php: `<?php
$ch = curl_init("https://api.whatsappmsg.com/api/v1/contacts");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
  "name" => "Sarah Jenkins",
  "phoneNumber" => "+15559876543",
  "email" => "sarah@acme.com",
  "tags" => ["VIP-Customer", "Product-Qualified"]
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  "x-api-key: wmsg_live_your_api_key_here",
  "Content-Type": "application/json"
]);
$out = curl_exec($ch);
curl_close($ch);`,
      };
    }

    // Default template
    return {
      curl: `curl -X POST https://api.whatsappmsg.com/api/v1/messages \\
  -H "x-api-key: wmsg_live_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+15551234567",
    "type": "template",
    "template": {
      "name": "order_confirmation_v1",
      "language": { "code": "en_US" },
      "components": [
        {
          "type": "body",
          "parameters": [
            { "type": "text", "text": "David" },
            { "type": "text", "text": "ORD-98231" }
          ]
        }
      ]
    }
  }'`,
      node: `import axios from 'axios';

const { data } = await axios.post(
  'https://api.whatsappmsg.com/api/v1/messages',
  {
    to: '+15551234567',
    type: 'template',
    template: {
      name: 'order_confirmation_v1',
      language: { code: 'en_US' },
      components: [
        {
          type: 'body',
          parameters: [{ type: 'text', text: 'David' }, { type: 'text', text: 'ORD-98231' }]
        }
      ]
    }
  },
  {
    headers: {
      'x-api-key': 'wmsg_live_your_api_key_here',
      'Content-Type': 'application/json'
    }
  }
);`,
      python: `import requests

payload = {
    "to": "+15551234567",
    "type": "template",
    "template": {
        "name": "order_confirmation_v1",
        "language": {"code": "en_US"},
        "components": [
            {"type": "body", "parameters": [{"type": "text", "text": "David"}, {"type": "text", "text": "ORD-98231"}]}
        ]
    }
}

res = requests.post(
    "https://api.whatsappmsg.com/api/v1/messages",
    json=payload,
    headers={"x-api-key": "wmsg_live_your_api_key_here"}
)
print(res.json())`,
      php: `<?php
$ch = curl_init("https://api.whatsappmsg.com/api/v1/messages");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
  "to" => "+15551234567",
  "type" => "template",
  "template" => [
    "name" => "order_confirmation_v1",
    "language" => ["code" => "en_US"]
  ]
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ["x-api-key: wmsg_live_your_api_key_here", "Content-Type: application/json"]);
$out = curl_exec($ch);
curl_close($ch);`,
    };
  };

  const textSnippets = getSnippets('send_text');
  const templateSnippets = getSnippets('send_template');
  const contactSnippets = getSnippets('create_contact');

  // Realistic Postman Sample Responses
  const sampleAuthErrorResponse = `{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key in request header"
  }
}`;

  const sampleTextSuccessResponse = `{
  "success": true,
  "message": "Message queued for delivery",
  "data": {
    "messageId": "wmsg_msg_98a7s6d5f4g3",
    "to": "+15551234567",
    "type": "text",
    "status": "queued",
    "cost": 1,
    "createdAt": "2026-09-17T10:15:30.000Z"
  }
}`;

  const sampleTemplateSuccessResponse = `{
  "success": true,
  "message": "Template message dispatched successfully",
  "data": {
    "messageId": "wmsg_msg_tpl_4891bca78e",
    "to": "+15551234567",
    "templateName": "order_confirmation_v1",
    "status": "sent",
    "wamid": "wamid.HBgLMTU1NTEyMzQ1NjcVAgARGBI5...",
    "createdAt": "2026-09-17T10:18:45.000Z"
  }
}`;

  const sampleContactSuccessResponse = `{
  "success": true,
  "message": "Contact created successfully",
  "data": {
    "contactId": "cnt_99a88b77cc",
    "name": "Sarah Jenkins",
    "phoneNumber": "+15559876543",
    "email": "sarah@acme.com",
    "tags": [
      "VIP-Customer",
      "Product-Qualified"
    ],
    "createdAt": "2026-09-17T10:20:00.000Z"
  }
}`;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Compact Top Header & Filter Box */}
      <div className="bg-white border border-[#E2EAE6] p-3.5 sm:p-4 rounded-2xl shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#14201C] tracking-tight">
              WhatsApp Business REST API Reference
            </h3>
            <p className="text-xs text-[#5F7069] mt-0.5">
              Comprehensive guides, Postman response previews, and copy-paste code snippets for integrating WhatsApp messaging.
            </p>
          </div>

          <Link to={ROUTES.DEVELOPERS_BACKEND_SETUP} className="shrink-0">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Server className="w-3.5 h-3.5 text-[#05A222]" />}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="text-xs font-semibold text-[#006736] border-[#E2EAE6] hover:bg-[#E9F9EE] px-3 py-1.5 h-8"
            >
              Backend (.env) Setup
            </Button>
          </Link>
        </div>

        {/* Section Filter Tabs */}
        <div className="pt-2 border-t border-[#E2EAE6]/70 flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Endpoints' },
            { id: 'auth', label: '1. Authentication' },
            { id: 'text', label: '2. Send Text Message' },
            { id: 'template', label: '3. Send Template' },
            { id: 'contact', label: '4. Create Contact' },
            { id: 'errors', label: 'HTTP Status Codes' },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSection(sec.id as SectionFilter)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedSection === sec.id
                  ? 'bg-[#006736] text-white shadow-2xs font-bold'
                  : 'text-[#5F7069] hover:text-[#14201C] bg-[#F8FAFC] border border-[#E2EAE6] hover:bg-white'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* Language Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2EAE6] pb-3">
        <div className="flex items-center gap-1.5 bg-[#F6FAF8] p-1 rounded-xl border border-[#E2EAE6]">
          {[
            { id: 'curl', label: 'cURL' },
            { id: 'node', label: 'Node.js / Axios' },
            { id: 'python', label: 'Python (Requests)' },
            { id: 'php', label: 'PHP' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveLang(tab.id as LanguageTab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeLang === tab.id
                  ? 'bg-[#05A222] text-white shadow-2xs'
                  : 'text-[#5F7069] hover:text-[#14201C]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-[#5F7069] font-medium hidden sm:block">
          Base URL: <code className="text-[#006736] font-mono bg-[#E9F9EE] px-1.5 py-0.5 rounded font-bold">https://api.whatsappmsg.com/api/v1</code>
        </div>
      </div>

      {/* Section 1: Authentication */}
      {(selectedSection === 'all' || selectedSection === 'auth') && (
        <div className="bg-white border border-[#E2EAE6] hover:border-[#C4EBD0] transition-all p-5 sm:p-6 rounded-2xl shadow-[0_4px_20px_rgba(1,59,35,0.03)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#006736] font-extrabold text-xs">
                01
              </span>
              <div>
                <h4 className="text-base font-bold text-[#14201C]">API Authentication</h4>
                <p className="text-xs text-[#5F7069]">Pass your secret API key in request headers</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]">
              Required for all requests
            </span>
          </div>

          <p className="text-xs text-[#5F7069] leading-relaxed">
            Every HTTP request must include your secret API key either via the <code className="text-[#006736] font-mono bg-[#E9F9EE] px-1.5 py-0.5 rounded font-bold">x-api-key</code> header or standard <code className="text-[#006736] font-mono bg-[#E9F9EE] px-1.5 py-0.5 rounded font-bold">Authorization: Bearer &lt;token&gt;</code> header.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-white rounded-xl font-mono text-xs text-[#0F172A] border border-[#E2EAE6] shadow-2xs flex items-center justify-between">
              <span className="text-[#A31515] font-bold">x-api-key: <span className="text-[#006736] font-medium">wmsg_live_98a7s6d••••••••••••••</span></span>
              <span className="text-[10px] text-[#64748B] font-sans font-semibold bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2EAE6]">Header</span>
            </div>
            <div className="p-3.5 bg-white rounded-xl font-mono text-xs text-[#0F172A] border border-[#E2EAE6] shadow-2xs flex items-center justify-between">
              <span className="text-[#A31515] font-bold">Authorization: <span className="text-[#006736] font-medium">Bearer wmsg_live_98a7s6d••••••••••</span></span>
              <span className="text-[10px] text-[#64748B] font-sans font-semibold bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2EAE6]">Bearer</span>
            </div>
          </div>

          {/* Sample 401 Unauthorized Postman Response */}
          <div className="space-y-1.5 pt-2">
            <span className="text-xs font-bold text-[#5F7069] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#006736]" />
              Response on Missing / Invalid Key (Postman Preview)
            </span>
            <PostmanResponseViewer
              statusCode={401}
              statusText="Unauthorized"
              timeMs={48}
              sizeBytes={168}
              jsonBody={sampleAuthErrorResponse}
            />
          </div>
        </div>
      )}

      {/* Section 2: Send WhatsApp Text Message */}
      {(selectedSection === 'all' || selectedSection === 'text') && (
        <div className="bg-white border border-[#E2EAE6] hover:border-[#C4EBD0] transition-all p-5 sm:p-6 rounded-2xl shadow-[0_4px_20px_rgba(1,59,35,0.03)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2EAE6]">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#006736] font-extrabold text-xs">
                02
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md font-mono font-black text-[10px] bg-[#05A222] text-white shadow-2xs">
                    POST
                  </span>
                  <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/messages</code>
                  <span className="text-xs text-[#5F7069] font-medium hidden md:inline">(Text Message)</span>
                </div>
                <p className="text-xs text-[#5F7069] mt-0.5">Send a real-time conversational text message</p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCopy('text', textSnippets[activeLang])}
              leftIcon={copiedSection === 'text' ? <Check className="w-3.5 h-3.5 text-[#05A222]" /> : <Copy className="w-3.5 h-3.5" />}
              className="text-xs font-bold text-[#006736] border-[#E2EAE6] hover:bg-[#E9F9EE] h-8 px-3"
            >
              {copiedSection === 'text' ? 'Copied Code' : 'Copy Code'}
            </Button>
          </div>

          {/* Request Payload */}
          <div className="rounded-xl overflow-hidden border border-[#E2EAE6] bg-[#F8FAFC] shadow-2xs">
            <div className="flex items-center justify-between px-4 py-2 bg-[#F1F5F9] border-b border-[#E2EAE6] text-xs font-mono text-[#475569]">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#05A222]"></span>
                <span className="font-semibold">Request Payload ({activeLang.toUpperCase()})</span>
              </span>
              <span className="text-[11px] text-[#64748B]">Content-Type: application/json</span>
            </div>
            <div className="p-4 bg-white overflow-x-auto">
              <pre
                dangerouslySetInnerHTML={{ __html: highlightPostmanCode(textSnippets[activeLang], activeLang) }}
                className="font-mono text-xs leading-relaxed text-[#0F172A]"
              />
            </div>
          </div>

          {/* Postman Response 200 OK */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-bold text-[#5F7069] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#006736]" />
              Response (200 OK - Postman Output)
            </span>
            <PostmanResponseViewer
              statusCode={200}
              statusText="OK"
              timeMs={128}
              sizeBytes={284}
              jsonBody={sampleTextSuccessResponse}
            />
          </div>
        </div>
      )}

      {/* Section 3: Send Template Message */}
      {(selectedSection === 'all' || selectedSection === 'template') && (
        <div className="bg-white border border-[#E2EAE6] hover:border-[#C4EBD0] transition-all p-5 sm:p-6 rounded-2xl shadow-[0_4px_20px_rgba(1,59,35,0.03)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2EAE6]">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#006736] font-extrabold text-xs">
                03
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md font-mono font-black text-[10px] bg-[#05A222] text-white shadow-2xs">
                    POST
                  </span>
                  <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/messages</code>
                  <span className="text-xs text-[#5F7069] font-medium hidden md:inline">(Approved HSM Template)</span>
                </div>
                <p className="text-xs text-[#5F7069] mt-0.5">Dispatches pre-approved Meta WhatsApp templates outside 24h window</p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCopy('template', templateSnippets[activeLang])}
              leftIcon={copiedSection === 'template' ? <Check className="w-3.5 h-3.5 text-[#05A222]" /> : <Copy className="w-3.5 h-3.5" />}
              className="text-xs font-bold text-[#006736] border-[#E2EAE6] hover:bg-[#E9F9EE] h-8 px-3"
            >
              {copiedSection === 'template' ? 'Copied Code' : 'Copy Code'}
            </Button>
          </div>

          {/* Request Payload */}
          <div className="rounded-xl overflow-hidden border border-[#E2EAE6] bg-[#F8FAFC] shadow-2xs">
            <div className="flex items-center justify-between px-4 py-2 bg-[#F1F5F9] border-b border-[#E2EAE6] text-xs font-mono text-[#475569]">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#05A222]"></span>
                <span className="font-semibold">HSM Template Request ({activeLang.toUpperCase()})</span>
              </span>
              <span className="text-[11px] text-[#64748B]">Meta Cloud Verified</span>
            </div>
            <div className="p-4 bg-white overflow-x-auto">
              <pre
                dangerouslySetInnerHTML={{ __html: highlightPostmanCode(templateSnippets[activeLang], activeLang) }}
                className="font-mono text-xs leading-relaxed text-[#0F172A]"
              />
            </div>
          </div>

          {/* Postman Response 200 OK */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-bold text-[#5F7069] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#006736]" />
              Response (200 OK - Postman Output)
            </span>
            <PostmanResponseViewer
              statusCode={200}
              statusText="OK"
              timeMs={164}
              sizeBytes={342}
              jsonBody={sampleTemplateSuccessResponse}
            />
          </div>
        </div>
      )}

      {/* Section 4: Create Customer Contact */}
      {(selectedSection === 'all' || selectedSection === 'contact') && (
        <div className="bg-white border border-[#E2EAE6] hover:border-[#C4EBD0] transition-all p-5 sm:p-6 rounded-2xl shadow-[0_4px_20px_rgba(1,59,35,0.03)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2EAE6]">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#006736] font-extrabold text-xs">
                04
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md font-mono font-black text-[10px] bg-[#05A222] text-white shadow-2xs">
                    POST
                  </span>
                  <code className="text-sm font-bold text-[#14201C] font-mono">/api/v1/contacts</code>
                  <span className="text-xs text-[#5F7069] font-medium hidden md:inline">(Create / Upsert Contact)</span>
                </div>
                <p className="text-xs text-[#5F7069] mt-0.5">Sync customer lead information, tags, and CRM custom fields</p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCopy('contact', contactSnippets[activeLang])}
              leftIcon={copiedSection === 'contact' ? <Check className="w-3.5 h-3.5 text-[#05A222]" /> : <Copy className="w-3.5 h-3.5" />}
              className="text-xs font-bold text-[#006736] border-[#E2EAE6] hover:bg-[#E9F9EE] h-8 px-3"
            >
              {copiedSection === 'contact' ? 'Copied Code' : 'Copy Code'}
            </Button>
          </div>

          {/* Request Payload */}
          <div className="rounded-xl overflow-hidden border border-[#E2EAE6] bg-[#F8FAFC] shadow-2xs">
            <div className="flex items-center justify-between px-4 py-2 bg-[#F1F5F9] border-b border-[#E2EAE6] text-xs font-mono text-[#475569]">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#05A222]"></span>
                <span className="font-semibold">Contact Request ({activeLang.toUpperCase()})</span>
              </span>
              <span className="text-[11px] text-[#64748B]">CRM Sync API</span>
            </div>
            <div className="p-4 bg-white overflow-x-auto">
              <pre
                dangerouslySetInnerHTML={{ __html: highlightPostmanCode(contactSnippets[activeLang], activeLang) }}
                className="font-mono text-xs leading-relaxed text-[#0F172A]"
              />
            </div>
          </div>

          {/* Postman Response 201 Created */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-bold text-[#5F7069] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#006736]" />
              Response (201 Created - Postman Output)
            </span>
            <PostmanResponseViewer
              statusCode={201}
              statusText="Created"
              timeMs={112}
              sizeBytes={318}
              jsonBody={sampleContactSuccessResponse}
            />
          </div>
        </div>
      )}

      {/* HTTP Status & Error Codes Reference Table */}
      {(selectedSection === 'all' || selectedSection === 'errors') && (
        <div className="bg-white border border-[#E2EAE6] p-5 sm:p-6 rounded-2xl shadow-[0_4px_20px_rgba(1,59,35,0.03)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-[#14201C]">HTTP Status & Error Codes</h4>
              <p className="text-xs text-[#5F7069] mt-0.5">Standard HTTP response status codes returned by WhatsAppMSG API</p>
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
                  <td className="px-4 py-3 font-sans text-[#5F7069]">Request completed successfully and message or resource was created.</td>
                </tr>
                <tr className="hover:bg-[#F8FAFC]/60 transition-colors">
                  <td className="px-4 py-3 font-extrabold text-amber-600">
                    <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200">400</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-[#14201C] font-sans">Bad Request</td>
                  <td className="px-4 py-3 font-sans text-[#5F7069]">Missing required parameters or malformed JSON payload.</td>
                </tr>
                <tr className="hover:bg-[#F8FAFC]/60 transition-colors">
                  <td className="px-4 py-3 font-extrabold text-rose-600">
                    <span className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200">401</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-[#14201C] font-sans">Unauthorized</td>
                  <td className="px-4 py-3 font-sans text-[#5F7069]">API Key is invalid, inactive, revoked, or expired.</td>
                </tr>
                <tr className="hover:bg-[#F8FAFC]/60 transition-colors">
                  <td className="px-4 py-3 font-extrabold text-rose-600">
                    <span className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200">403</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-[#14201C] font-sans">Forbidden</td>
                  <td className="px-4 py-3 font-sans text-[#5F7069]">Key lacks required permissions scope or client IP is not whitelisted.</td>
                </tr>
                <tr className="hover:bg-[#F8FAFC]/60 transition-colors">
                  <td className="px-4 py-3 font-extrabold text-amber-600">
                    <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200">429</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-[#14201C] font-sans">Rate Limited</td>
                  <td className="px-4 py-3 font-sans text-[#5F7069]">Exceeded requests per minute quota. Implement exponential backoff and retry.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

