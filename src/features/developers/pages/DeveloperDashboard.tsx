import React from 'react';
import { Button } from '../../../components/ui/Button';
import { Key, Webhook, Terminal, BookOpen, Code2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const DeveloperDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-sans">Developer & API Center</h2>
          <p className="text-xs text-slate-400 mt-1">
            Build custom WhatsApp CRM integrations, automated bots, and sync webhooks with your backend.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate(ROUTES.DEVELOPERS_DOCS)}
          rightIcon={<BookOpen className="w-3.5 h-3.5" />}
        >
          View API Docs
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => navigate(ROUTES.DEVELOPERS_API_KEYS)}
          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-emerald-500 cursor-pointer transition-colors"
        >
          <Key className="w-5 h-5 text-emerald-400 mb-2" />
          <h4 className="text-sm font-bold text-white font-sans">API Keys</h4>
          <p className="text-xs text-slate-400 mt-1">Manage bearer tokens for backend requests</p>
        </div>

        <div
          onClick={() => navigate(ROUTES.DEVELOPERS_WEBHOOKS)}
          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-teal-500 cursor-pointer transition-colors"
        >
          <Webhook className="w-5 h-5 text-teal-400 mb-2" />
          <h4 className="text-sm font-bold text-white font-sans">Webhooks</h4>
          <p className="text-xs text-slate-400 mt-1">Subscribe to incoming WhatsApp message events</p>
        </div>

        <div
          onClick={() => navigate(ROUTES.DEVELOPERS_API_LOGS)}
          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-indigo-500 cursor-pointer transition-colors"
        >
          <Terminal className="w-5 h-5 text-indigo-400 mb-2" />
          <h4 className="text-sm font-bold text-white font-sans">Request Logs</h4>
          <p className="text-xs text-slate-400 mt-1">Inspect live HTTP response codes and latencies</p>
        </div>

        <div
          onClick={() => navigate(ROUTES.DEVELOPERS_DOCS)}
          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-purple-500 cursor-pointer transition-colors"
        >
          <Code2 className="w-5 h-5 text-purple-400 mb-2" />
          <h4 className="text-sm font-bold text-white font-sans">Code Snippets</h4>
          <p className="text-xs text-slate-400 mt-1">Ready-to-use cURL, Node.js, and Python examples</p>
        </div>
      </div>

      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
        <h4 className="text-sm font-bold text-white font-sans">Quick Outbound Message Example (cURL)</h4>
        <pre className="p-4 bg-slate-950 rounded-xl text-emerald-400 text-xs overflow-x-auto border border-slate-800">
{`curl -X POST https://api.chatflow.io/v1/messages/send-template \\
  -H "Authorization: Bearer cf_live_98a7s6d••••••••••••••" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+15552345678",
    "templateName": "order_status_update_v2",
    "variables": ["Alex", "98231", "FedEx", "Tomorrow"]
  }'`}
        </pre>
      </div>
    </div>
  );
};
