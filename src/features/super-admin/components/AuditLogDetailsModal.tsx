import React from 'react';
import { X, FileCode, Clock, User, Building } from 'lucide-react';
import type { AuditLogItem } from '../types/admin.types';

interface AuditLogDetailsModalProps {
  log: AuditLogItem | null;
  onClose: () => void;
}

export const AuditLogDetailsModal: React.FC<AuditLogDetailsModalProps> = ({ log, onClose }) => {
  if (!log) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-[#E2EAE6] rounded-3xl w-full max-w-2xl p-6 sm:p-7 shadow-2xl text-[#1F2A26] space-y-5 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2EAE6] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#006736]">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-mono text-[#006736]">{log.action}</h3>
              <p className="text-xs text-[#5F7069] flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(log.createdAt).toLocaleString()}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#5F7069] hover:text-[#14201C] hover:bg-[#F6FAF8] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Actor and Target Org chips */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-[#F6FAF8] rounded-2xl border border-[#E2EAE6] space-y-1">
            <div className="text-[#5F7069] flex items-center gap-1.5 font-bold">
              <User className="w-3.5 h-3.5 text-[#05A222]" /> Actor User
            </div>
            <div className="font-bold text-[#14201C]">
              {log.userId?.firstName} {log.userId?.lastName}
            </div>
            <div className="text-[#8A9993] font-mono text-[11px]">{log.userId?.email || 'N/A'}</div>
          </div>

          <div className="p-3.5 bg-[#F6FAF8] rounded-2xl border border-[#E2EAE6] space-y-1">
            <div className="text-[#5F7069] flex items-center gap-1.5 font-bold">
              <Building className="w-3.5 h-3.5 text-[#006736]" /> Target Tenant
            </div>
            <div className="font-bold text-[#14201C]">
              {log.organizationId?.name || 'Platform Scope'}
            </div>
            <div className="text-[#8A9993] font-mono text-[11px]">
              Plan: {log.organizationId?.plan || 'N/A'}
            </div>
          </div>
        </div>

        {/* JSON Payload Inspector */}
        <div className="space-y-1.5 flex-1 overflow-hidden flex flex-col">
          <label className="text-xs font-bold text-[#5F7069]">Payload & Metadata Details</label>
          <div className="flex-1 bg-[#14201C] border border-[#1E302A] rounded-2xl p-4 overflow-y-auto font-mono text-xs text-[#1CD72C] leading-relaxed select-text">
            <pre>{JSON.stringify(log.details || {}, null, 2)}</pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#E2EAE6] text-xs">
          <span className="text-[#8A9993] font-mono">IP: {log.ipAddress || 'internal'}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#F6FAF8] hover:bg-[#E9F9EE] rounded-xl text-[#006736] font-bold transition border border-[#C4EBD0] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
