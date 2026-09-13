import React from 'react';
import { Button } from '../../../components/ui/Button';
import { Key, Webhook, Terminal, BookOpen, Code2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const DeveloperDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#14201C] tracking-tight">Developer Quick Navigation</h3>
          <p className="text-sm sm:text-base text-[#5F7069] mt-1.5 font-medium">
            Build custom WhatsApp CRM integrations, automated bots, and sync webhooks with your backend.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate(ROUTES.DEVELOPERS_DOCS)}
          rightIcon={<BookOpen className="w-4 h-4" />}
          className="text-sm font-bold px-4.5 py-2.5 rounded-xl shadow-sm"
        >
          View API Docs
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          onClick={() => navigate(ROUTES.DEVELOPERS_API_KEYS)}
          className="bg-white border border-[#E2EAE6] p-6 rounded-2xl shadow-[0_8px_30px_rgba(1,59,35,0.04)] hover:shadow-[0_12px_36px_rgba(1,59,35,0.08)] hover:border-[#05A222]/50 cursor-pointer transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#05A222] mb-3.5">
            <Key className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-[#14201C]">API Keys</h4>
          <p className="text-xs sm:text-sm text-[#5F7069] mt-1 font-medium">Manage bearer tokens for backend requests</p>
        </div>

        <div
          onClick={() => navigate(ROUTES.DEVELOPERS_WEBHOOKS)}
          className="bg-white border border-[#E2EAE6] p-5 rounded-2xl shadow-[0_8px_30px_rgba(1,59,35,0.04)] hover:shadow-[0_12px_36px_rgba(1,59,35,0.08)] hover:border-[#05A222]/50 cursor-pointer transition-all duration-200"
        >
          <div className="w-10 h-10 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#039B56] mb-3">
            <Webhook className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#14201C]">Webhooks</h4>
          <p className="text-xs text-[#5F7069] mt-1">Subscribe to incoming WhatsApp message events</p>
        </div>

        <div
          onClick={() => navigate(ROUTES.DEVELOPERS_API_LOGS)}
          className="bg-white border border-[#E2EAE6] p-5 rounded-2xl shadow-[0_8px_30px_rgba(1,59,35,0.04)] hover:shadow-[0_12px_36px_rgba(1,59,35,0.08)] hover:border-[#05A222]/50 cursor-pointer transition-all duration-200"
        >
          <div className="w-10 h-10 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#07CF74] mb-3">
            <Terminal className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#14201C]">Request Logs</h4>
          <p className="text-xs text-[#5F7069] mt-1">Inspect live HTTP response codes and latencies</p>
        </div>

        <div
          onClick={() => navigate(ROUTES.DEVELOPERS_DOCS)}
          className="bg-white border border-[#E2EAE6] p-5 rounded-2xl shadow-[0_8px_30px_rgba(1,59,35,0.04)] hover:shadow-[0_12px_36px_rgba(1,59,35,0.08)] hover:border-[#05A222]/50 cursor-pointer transition-all duration-200"
        >
          <div className="w-10 h-10 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#006736] mb-3">
            <Code2 className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#14201C]">Code Snippets</h4>
          <p className="text-xs text-[#5F7069] mt-1">Ready-to-use cURL, Node.js, and Python examples</p>
        </div>
      </div>

      {/* Outbound Message Example Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#14201C]">Quick Outbound Message Example (cURL)</h4>
          <span className="text-xs font-semibold text-[#006736] bg-[#E9F9EE] px-2.5 py-1 rounded-md border border-[#C4EBD0]">
            POST /v1/messages/send-template
          </span>
        </div>
        <pre className="p-4 bg-[#14201C] rounded-xl text-[#1CD72C] text-xs font-mono overflow-x-auto border border-[#2B3A34] shadow-inner">
{`curl -X POST https://api.whatsappmsg.com/v1/messages/send-template \\
  -H "Authorization: Bearer cf_live_98a7s6d••••••••••••••" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+919876543210",
    "templateName": "order_status_update_v2",
    "variables": ["Alex", "98231", "FedEx", "Tomorrow"]
  }'`}
        </pre>
      </div>
    </div>
  );
};
