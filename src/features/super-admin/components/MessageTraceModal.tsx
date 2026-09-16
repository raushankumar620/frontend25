import React, { useEffect, useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Zap,
  Building2,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Layers,
} from 'lucide-react';
import { superAdminService } from '../services/superAdminService';
import type { MessageTraceReport } from '../types/admin.types';

interface MessageTraceModalProps {
  messageId: string | null;
  onClose: () => void;
}

export const MessageTraceModal: React.FC<MessageTraceModalProps> = ({ messageId, onClose }) => {
  const [report, setReport] = useState<MessageTraceReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({});

  const fetchTrace = async () => {
    if (!messageId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await superAdminService.getMessageTrace(messageId);
      setReport(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to generate message lifecycle trace');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messageId) {
      fetchTrace();
    }
  }, [messageId]);

  const toggleStep = (stepNum: number) => {
    setExpandedSteps((prev) => ({ ...prev, [stepNum]: !prev[stepNum] }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!messageId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#FFFFFF] border border-[#E2EAE6] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#006736] to-[#05A222] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-md">
              <Zap className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">Message Lifecycle Trace Debugger</h2>
                <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-white/20 text-white tracking-wider">
                  11-Step Pipeline
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                End-to-end tracing from ingestion to Meta dispatch, webhooks, and final delivery
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchTrace}
              disabled={loading}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition disabled:opacity-50"
              title="Refresh Trace"
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
              <p className="text-sm font-medium">Reconstructing 11-step message lifecycle trace...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <p className="font-semibold">Trace Generation Failed</p>
                <p className="text-xs text-rose-600 mt-0.5">{error}</p>
              </div>
            </div>
          ) : report ? (
            <>
              {/* Message Summary Card */}
              <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E2EAE6] shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                        report.message.status === 'DELIVERED' || report.message.status === 'READ'
                          ? 'bg-emerald-100 text-emerald-800'
                          : report.message.status === 'FAILED'
                          ? 'bg-rose-100 text-rose-800'
                          : report.message.status === 'SENT'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {report.message.status}
                    </span>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                      {report.message.direction}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Type: <strong>{report.message.type}</strong>
                    </span>
                  </div>

                  {report.message.wamid && (
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700">
                      <span className="font-semibold text-slate-500">WAMID:</span>
                      <span className="font-mono text-[11px] truncate max-w-[200px]">{report.message.wamid}</span>
                      <button
                        onClick={() => copyToClipboard(report.message.wamid!, 'wamid')}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        {copied === 'wamid' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Sender</span>
                    <span className="font-bold text-slate-800">{report.message.from}</span>
                    <span className="text-[10px] text-slate-500 block truncate">{report.senderPhone?.verifiedName || ''}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Recipient</span>
                    <span className="font-bold text-slate-800">{report.message.to}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Tenant / Org</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-[#05A222]" />
                      {report.organization?.name || 'Platform'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Created Timestamp</span>
                    <span className="font-semibold text-slate-700">
                      {new Date(report.message.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Diagnostic Root Cause Banner (If Failed) */}
              {report.diagnostics.hasFailed && (
                <div className="p-4 rounded-xl bg-rose-50/90 border border-rose-200 text-rose-900 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-rose-800">
                    <AlertCircle className="w-5 h-5 text-rose-600" />
                    Failure Detected at Step #{report.diagnostics.failedAtStep}: {report.diagnostics.rootCause}
                  </div>
                  {report.message.errorMessage && (
                    <p className="text-xs font-mono bg-rose-100/70 p-2 rounded border border-rose-200 text-rose-800">
                      Error Code [{report.message.errorCode || 'UNKNOWN'}]: {report.message.errorMessage}
                    </p>
                  )}
                  {report.diagnostics.fixRecommendation && (
                    <div className="flex items-start gap-2 text-xs text-rose-700 bg-white/70 p-2.5 rounded-lg border border-rose-200/80">
                      <HelpCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Recommended Fix:</strong> {report.diagnostics.fixRecommendation}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 11-Step Lifecycle Stepper */}
              <div className="bg-[#FFFFFF] rounded-xl border border-[#E2EAE6] p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                    <Layers className="w-4 h-4 text-[#05A222]" /> 11-Step Lifecycle Execution Flow
                  </div>
                  <span className="text-xs text-slate-500">
                    {report.steps.filter((s) => s.status === 'COMPLETED').length} of {report.steps.length} Steps Completed
                  </span>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-[17px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                  {report.steps.map((step) => {
                    const isExpanded = !!expandedSteps[step.stepNumber];
                    return (
                      <div key={step.stepNumber} className="relative">
                        {/* Status Icon */}
                        <div
                          className={`absolute -left-[27px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white ${
                            step.status === 'COMPLETED'
                              ? 'border-emerald-500 text-emerald-600'
                              : step.status === 'FAILED'
                              ? 'border-rose-500 text-rose-600 bg-rose-50'
                              : step.status === 'SKIPPED'
                              ? 'border-slate-300 text-slate-400'
                              : 'border-slate-300 text-slate-400'
                          }`}
                        >
                          {step.status === 'COMPLETED' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : step.status === 'FAILED' ? (
                            <AlertCircle className="w-4 h-4 text-rose-600" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </div>

                        {/* Step Card */}
                        <div
                          className={`p-3.5 rounded-xl border transition ${
                            step.status === 'COMPLETED'
                              ? 'bg-emerald-50/20 border-slate-200 hover:border-emerald-200'
                              : step.status === 'FAILED'
                              ? 'bg-rose-50/40 border-rose-200'
                              : 'bg-slate-50/50 border-slate-200 opacity-60'
                          }`}
                        >
                          <div
                            onClick={() => toggleStep(step.stepNumber)}
                            className="flex items-center justify-between cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-xs font-bold text-slate-400 font-mono">
                                #{String(step.stepNumber).padStart(2, '0')}
                              </span>
                              <h4 className="text-xs font-bold text-slate-800">{step.name}</h4>
                              <span className="text-[10px] font-mono text-slate-400">({step.stepCode})</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {step.timestamp && (
                                <span className="text-[11px] text-slate-400 font-mono">
                                  {new Date(step.timestamp).toLocaleTimeString()}
                                </span>
                              )}
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                  step.status === 'COMPLETED'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : step.status === 'FAILED'
                                    ? 'bg-rose-100 text-rose-800'
                                    : step.status === 'SKIPPED'
                                    ? 'bg-slate-100 text-slate-500'
                                    : 'bg-slate-200 text-slate-600'
                                }`}
                              >
                                {step.status}
                              </span>
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 mt-1 pl-7">{step.description}</p>

                          {/* Expanded Step Details */}
                          {isExpanded && (
                            <div className="mt-3 pl-7 space-y-2 pt-2 border-t border-slate-100 animate-in fade-in duration-150">
                              {step.isErrorStep && step.rootCause && (
                                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
                                  <strong>Root Cause:</strong> {step.rootCause}
                                  {step.fixRecommendation && (
                                    <div className="mt-1 text-slate-700">
                                      <strong>Recommendation:</strong> {step.fixRecommendation}
                                    </div>
                                  )}
                                </div>
                              )}

                              {step.metadata && Object.keys(step.metadata).length > 0 && (
                                <div className="bg-slate-900 text-slate-200 p-3 rounded-lg text-[11px] font-mono overflow-x-auto">
                                  <pre>{JSON.stringify(step.metadata, null, 2)}</pre>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
            Close Trace
          </button>
        </div>
      </div>
    </div>
  );
};
