import React, { useEffect, useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  RefreshCw,
  Phone,
  Building2,
  ShieldCheck,
  Activity,
  Zap,
} from 'lucide-react';
import { superAdminService } from '../services/superAdminService';
import type { WhatsAppDebuggerReport } from '../types/admin.types';

interface WhatsAppDebuggerModalProps {
  numberId: string | null;
  onClose: () => void;
}

export const WhatsAppDebuggerModal: React.FC<WhatsAppDebuggerModalProps> = ({ numberId, onClose }) => {
  const [report, setReport] = useState<WhatsAppDebuggerReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDiagnostics = async () => {
    if (!numberId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await superAdminService.debugWhatsAppNumber(numberId);
      setReport(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to run WhatsApp diagnostics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (numberId) {
      fetchDiagnostics();
    }
  }, [numberId]);

  if (!numberId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#FFFFFF] border border-[#E2EAE6] rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#006736] to-[#05A222] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-md">
              <Zap className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">WhatsApp Connection Debugger</h2>
                <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-white/20 text-white tracking-wider">
                  Live Probe
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                Deep diagnostic inspection of Meta Cloud API, tokens, and webhook handshake
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchDiagnostics}
              disabled={loading}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition disabled:opacity-50"
              title="Re-run diagnostics"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 bg-[#F6FAF8] max-h-[75vh] overflow-y-auto space-y-6">
          {loading && !report ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-3">
              <RefreshCw className="w-8 h-8 animate-spin text-[#05A222]" />
              <p className="text-sm font-medium">Running real-time diagnostic checks across Meta Cloud API...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <p className="font-semibold">Diagnostic Failed</p>
                <p className="text-xs text-rose-600 mt-0.5">{error}</p>
              </div>
            </div>
          ) : report ? (
            <>
              {/* Overall Health Banner */}
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  report.overallHealth === 'HEALTHY'
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                    : report.overallHealth === 'WARNING'
                    ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                    : 'bg-rose-50/80 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  {report.overallHealth === 'HEALTHY' ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  ) : report.overallHealth === 'WARNING' ? (
                    <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                  )}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider">
                      Overall Health: {report.overallHealth}
                    </h3>
                    <p className="text-xs opacity-80 mt-0.5">
                      Meta Cloud API Latency: <strong>{report.metaHealth.latencyMs}ms</strong> • Status:{' '}
                      <strong>{report.metaHealth.status}</strong>
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                    report.overallHealth === 'HEALTHY'
                      ? 'bg-emerald-200/60 text-emerald-800'
                      : report.overallHealth === 'WARNING'
                      ? 'bg-amber-200/60 text-amber-800'
                      : 'bg-rose-200/60 text-rose-800'
                  }`}
                >
                  {report.overallHealth}
                </span>
              </div>

              {/* Number & Account Overview Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone Card */}
                <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E2EAE6] shadow-sm space-y-2.5">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs uppercase tracking-wider">
                    <Phone className="w-4 h-4 text-[#05A222]" /> Phone Number Details
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Display Phone</span>
                      <span className="font-semibold text-slate-800">{report.phoneNumber.displayPhoneNumber}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Verified Name</span>
                      <span className="font-semibold text-slate-800">{report.phoneNumber.verifiedName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Quality Rating</span>
                      <span
                        className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                          report.phoneNumber.qualityRating === 'GREEN'
                            ? 'bg-emerald-100 text-emerald-800'
                            : report.phoneNumber.qualityRating === 'YELLOW'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {report.phoneNumber.qualityRating}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Messaging Tier</span>
                      <span className="font-semibold text-slate-800">{report.phoneNumber.messagingTier || 'TIER_50'}</span>
                    </div>
                  </div>
                </div>

                {/* Organization & Account Card */}
                <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E2EAE6] shadow-sm space-y-2.5">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs uppercase tracking-wider">
                    <Building2 className="w-4 h-4 text-[#05A222]" /> WABA & Organization
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">WABA Name</span>
                      <span className="font-semibold text-slate-800">{report.wabaAccount.name || 'Default WABA'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">WABA ID</span>
                      <span className="font-mono text-slate-700 text-[11px]">{report.wabaAccount.wabaId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Tenant</span>
                      <span className="font-semibold text-slate-800">{report.organization.name || 'Platform'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Token Status</span>
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                        {report.wabaAccount.tokenStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Diagnostic Checklist */}
              <div className="bg-[#FFFFFF] rounded-xl border border-[#E2EAE6] p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                    <Activity className="w-4 h-4 text-[#05A222]" /> Diagnostic Check Suite
                  </div>
                  <span className="text-xs text-slate-500">
                    {report.diagnostics.filter((d) => d.status === 'PASS').length} of {report.diagnostics.length} Passed
                  </span>
                </div>

                <div className="space-y-3">
                  {report.diagnostics.map((diag, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${
                        diag.status === 'PASS'
                          ? 'bg-emerald-50/40 border-emerald-100'
                          : diag.status === 'FAIL'
                          ? 'bg-rose-50/50 border-rose-200'
                          : diag.status === 'WARN'
                          ? 'bg-amber-50/50 border-amber-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 shrink-0">
                          {diag.status === 'PASS' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : diag.status === 'FAIL' ? (
                            <XCircle className="w-5 h-5 text-rose-600" />
                          ) : diag.status === 'WARN' ? (
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                          ) : (
                            <Info className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-800">{diag.label}</h4>
                            <span className="font-mono text-[10px] text-slate-400">({diag.check})</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">{diag.message}</p>
                          {diag.details && Object.keys(diag.details).length > 0 && (
                            <div className="mt-2 text-[11px] font-mono bg-white/80 p-2 rounded border border-slate-200/60 text-slate-700">
                              {JSON.stringify(diag.details, null, 2)}
                            </div>
                          )}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                          diag.status === 'PASS'
                            ? 'bg-emerald-100 text-emerald-800'
                            : diag.status === 'FAIL'
                            ? 'bg-rose-100 text-rose-800'
                            : diag.status === 'WARN'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {diag.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 24h Activity Footer */}
              <div className="p-3.5 bg-slate-100/70 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#006736]" />
                  <span>24h Throughput: <strong>{report.recentActivity.messageCount24h} messages</strong></span>
                </div>
                <div>
                  Last Active:{' '}
                  <strong>
                    {report.recentActivity.lastMessageAt
                      ? new Date(report.recentActivity.lastMessageAt).toLocaleString()
                      : 'No recent activity'}
                  </strong>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#E2EAE6] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-[#E2EAE6] text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            Close Debugger
          </button>
          <button
            onClick={fetchDiagnostics}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#006736] to-[#05A222] text-white text-xs font-semibold shadow-md hover:opacity-95 transition flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Re-Test Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
