import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import {
  Key,
  Webhook,
  Terminal,
  BookOpen,
  Code2,
  Copy,
  Check,
  Zap,
  Activity,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { developerService } from '../../../services/developerService';
import type { ApiMetrics } from '../types';

export const DeveloperDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<ApiMetrics | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    developerService.getApiMetrics().then(setMetrics).catch(() => {});
  }, []);

  const curlExample = `curl -X POST https://whatsappmsg.com/api/v1/messages \\
  -H "x-api-key: wmsg_live_your_secret_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+15551234567",
    "type": "text",
    "text": "Hello! Your appointment is confirmed for 3:00 PM."
  }'`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(curlExample);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Docs CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#14201C] tracking-tight">
            Developer Engine & API Hub
          </h3>
          <p className="text-sm text-[#5F7069] mt-1.5 font-medium">
            Integrate WhatsApp messaging into your backend, CRM, ERP, and automated customer journeys with sub-second latency.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate(ROUTES.DEVELOPERS_API_KEYS)}
            leftIcon={<Key className="w-4 h-4 text-[#05A222]" />}
            className="text-xs font-bold"
          >
            Manage Keys
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(ROUTES.DEVELOPERS_DOCS)}
            rightIcon={<BookOpen className="w-4 h-4" />}
            className="bg-[#05A222] hover:bg-[#006736] text-white text-xs font-bold px-4.5 py-2.5 rounded-xl shadow-xs"
          >
            Explore API Docs
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)]">
          <div className="flex items-center justify-between text-[#5F7069] mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider">Active API Keys</span>
            <div className="w-8 h-8 rounded-lg bg-[#E9F9EE] text-[#05A222] flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#14201C]">
            {metrics?.activeKeys ?? 0}
          </div>
          <div className="text-[11px] text-[#006736] mt-1 font-bold">
            {metrics?.totalKeys ?? 0} total provisioned
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)]">
          <div className="flex items-center justify-between text-[#5F7069] mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider">24h API Volume</span>
            <div className="w-8 h-8 rounded-lg bg-[#E9F9EE] text-[#006736] flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#14201C]">
            {(metrics?.totalRequests24h ?? 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-[#5F7069] mt-1 font-medium">Inbound API requests</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)]">
          <div className="flex items-center justify-between text-[#5F7069] mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Response Time</span>
            <div className="w-8 h-8 rounded-lg bg-[#E9F9EE] text-[#07CF74] flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#14201C]">
            {metrics?.avgLatencyMs ?? 42} ms
          </div>
          <div className="text-[11px] text-[#05A222] mt-1 font-bold">Ultra-fast API response</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)]">
          <div className="flex items-center justify-between text-[#5F7069] mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider">Success Rate</span>
            <div className="w-8 h-8 rounded-lg bg-[#E9F9EE] text-[#05A222] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#14201C]">
            {metrics ? `${(100 - metrics.errorRatePercent).toFixed(1)}%` : '99.9%'}
          </div>
          <div className="text-[11px] text-[#006736] mt-1 font-bold">High availability SLA</div>
        </div>
      </div>

      {/* Navigation Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          onClick={() => navigate(ROUTES.DEVELOPERS_API_KEYS)}
          className="group bg-white border border-[#E2EAE6] p-6 rounded-2xl shadow-[0_8px_30px_rgba(1,59,35,0.04)] hover:shadow-[0_12px_36px_rgba(1,59,35,0.08)] hover:border-[#05A222] cursor-pointer transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#05A222] mb-3.5 group-hover:scale-105 transition-transform">
            <Key className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-[#14201C] flex items-center justify-between">
            <span>API Keys</span>
            <ArrowRight className="w-4 h-4 text-[#5F7069] group-hover:text-[#05A222] group-hover:translate-x-0.5 transition-all" />
          </h4>
          <p className="text-xs text-[#5F7069] mt-1 font-medium leading-relaxed">
            Manage live and test API tokens, scope permissions, and IP whitelists.
          </p>
        </div>

        <div
          onClick={() => navigate(ROUTES.DEVELOPERS_API_LOGS)}
          className="group bg-white border border-[#E2EAE6] p-6 rounded-2xl shadow-[0_8px_30px_rgba(1,59,35,0.04)] hover:shadow-[0_12px_36px_rgba(1,59,35,0.08)] hover:border-[#05A222] cursor-pointer transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#006736] mb-3.5 group-hover:scale-105 transition-transform">
            <Terminal className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-[#14201C] flex items-center justify-between">
            <span>Request Logs</span>
            <ArrowRight className="w-4 h-4 text-[#5F7069] group-hover:text-[#05A222] group-hover:translate-x-0.5 transition-all" />
          </h4>
          <p className="text-xs text-[#5F7069] mt-1 font-medium leading-relaxed">
            Inspect real-time HTTP response statuses, payload errors, and latencies.
          </p>
        </div>

        <div
          onClick={() => navigate(ROUTES.DEVELOPERS_WEBHOOKS)}
          className="group bg-white border border-[#E2EAE6] p-6 rounded-2xl shadow-[0_8px_30px_rgba(1,59,35,0.04)] hover:shadow-[0_12px_36px_rgba(1,59,35,0.08)] hover:border-[#05A222] cursor-pointer transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#039B56] mb-3.5 group-hover:scale-105 transition-transform">
            <Webhook className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-[#14201C] flex items-center justify-between">
            <span>Webhooks</span>
            <ArrowRight className="w-4 h-4 text-[#5F7069] group-hover:text-[#05A222] group-hover:translate-x-0.5 transition-all" />
          </h4>
          <p className="text-xs text-[#5F7069] mt-1 font-medium leading-relaxed">
            Subscribe your endpoint to live message delivery and incoming reply events.
          </p>
        </div>

        <div
          onClick={() => navigate(ROUTES.DEVELOPERS_DOCS)}
          className="group bg-white border border-[#E2EAE6] p-6 rounded-2xl shadow-[0_8px_30px_rgba(1,59,35,0.04)] hover:shadow-[0_12px_36px_rgba(1,59,35,0.08)] hover:border-[#05A222] cursor-pointer transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#07CF74] mb-3.5 group-hover:scale-105 transition-transform">
            <Code2 className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-[#14201C] flex items-center justify-between">
            <span>Code Snippets</span>
            <ArrowRight className="w-4 h-4 text-[#5F7069] group-hover:text-[#05A222] group-hover:translate-x-0.5 transition-all" />
          </h4>
          <p className="text-xs text-[#5F7069] mt-1 font-medium leading-relaxed">
            Copy plug-and-play cURL, Node.js, Python, and PHP integration examples.
          </p>
        </div>
      </div>

      {/* Quickstart Code Preview Card */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#E9F9EE] text-[#05A222] flex items-center justify-center font-bold text-xs">
              &gt;_
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#14201C]">Quickstart cURL Example</h4>
              <p className="text-[11px] text-[#5F7069]">Send your first outbound WhatsApp message in 1 line</p>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyCode}
            leftIcon={copiedCode ? <Check className="w-3.5 h-3.5 text-[#05A222]" /> : <Copy className="w-3.5 h-3.5" />}
            className="text-xs font-bold border-[#E2EAE6] text-[#006736] hover:bg-[#E9F9EE]"
          >
            {copiedCode ? 'Copied to Clipboard!' : 'Copy cURL'}
          </Button>
        </div>

        <div className="rounded-xl overflow-hidden border border-[#E2EAE6] bg-[#F8FAFC] shadow-2xs">
          <div className="flex items-center justify-between px-4 py-2 bg-[#F1F5F9] border-b border-[#E2EAE6] text-xs font-mono text-[#475569]">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#05A222]"></span>
              <span className="font-semibold">Terminal cURL Request</span>
            </span>
            <span className="text-[11px] text-[#64748B]">POST /api/v1/messages</span>
          </div>
          <pre className="p-4 bg-white text-[#0F172A] text-xs font-mono overflow-x-auto leading-relaxed">
            {curlExample}
          </pre>
        </div>
      </div>
    </div>
  );
};
