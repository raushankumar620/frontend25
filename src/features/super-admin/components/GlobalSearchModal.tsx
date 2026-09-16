import React, { useEffect, useState, useRef } from 'react';
import {
  Search,
  X,
  Building2,
  Users,
  Phone,
  MessageSquare,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { superAdminService } from '../services/superAdminService';
import type { OmniSearchResult } from '../types/admin.types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMessageTrace?: (id: string) => void;
  onOpenNumberDebugger?: (id: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onOpenMessageTrace,
  onOpenNumberDebugger,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<OmniSearchResult['results'] | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults(null);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await superAdminService.omniSearch(query.trim());
        setResults(res.results);
      } catch (err) {
        console.error('OmniSearch error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 backdrop-blur-sm p-4 pt-20 overflow-y-auto">
      <div className="bg-[#FFFFFF] border border-[#E2EAE6] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E2EAE6] gap-3 bg-[#FFFFFF]">
          <Search className="w-5 h-5 text-[#05A222] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Omni-search by Tenant, User email, Phone, WAMID, Request ID..."
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          {loading ? (
            <Loader2 className="w-4 h-4 text-emerald-600 animate-spin shrink-0" />
          ) : query ? (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-slate-100 rounded border border-slate-200">
              ESC
            </kbd>
          )}
        </div>

        {/* Results Container */}
        <div className="p-4 bg-[#F6FAF8] max-h-[60vh] overflow-y-auto space-y-4">
          {!results && !loading && (
            <div className="py-8 text-center text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-slate-600">Omni-Search Platform Control Room</p>
              <p>Type at least 2 characters to search across all platform entities.</p>
            </div>
          )}

          {results && results.totalCount === 0 && !loading && (
            <div className="py-8 text-center text-xs text-slate-500">
              No platform records matching &ldquo;{query}&rdquo;
            </div>
          )}

          {results && results.totalCount > 0 && (
            <>
              {/* Organizations / Tenants */}
              {results.organizations?.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
                    <Building2 className="w-3.5 h-3.5 text-[#05A222]" /> Tenants ({results.organizations.length})
                  </div>
                  <div className="space-y-1">
                    {results.organizations.map((org: any) => (
                      <div
                        key={org._id || org.id}
                        onClick={() => {
                          onClose();
                          navigate('/super-admin/tenants');
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E2EAE6] hover:border-[#05A222] cursor-pointer transition text-xs group shadow-sm"
                      >
                        <div>
                          <p className="font-bold text-slate-800 group-hover:text-[#006736]">{org.name}</p>
                          <p className="text-slate-400 text-[11px] font-mono">slug: {org.slug} • plan: {org.plan}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#05A222] transition" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Users */}
              {results.users?.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
                    <Users className="w-3.5 h-3.5 text-[#05A222]" /> Users ({results.users.length})
                  </div>
                  <div className="space-y-1">
                    {results.users.map((u: any) => (
                      <div
                        key={u._id || u.id}
                        onClick={() => {
                          onClose();
                          navigate('/super-admin/users');
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E2EAE6] hover:border-[#05A222] cursor-pointer transition text-xs group shadow-sm"
                      >
                        <div>
                          <p className="font-bold text-slate-800 group-hover:text-[#006736]">
                            {u.firstName} {u.lastName}
                          </p>
                          <p className="text-slate-500 text-[11px]">{u.email} • {u.role}</p>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {u.organizationId?.name || 'Platform'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Phone Numbers */}
              {results.phoneNumbers?.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
                    <Phone className="w-3.5 h-3.5 text-[#05A222]" /> WhatsApp Numbers ({results.phoneNumbers.length})
                  </div>
                  <div className="space-y-1">
                    {results.phoneNumbers.map((num: any) => (
                      <div
                        key={num._id || num.id}
                        onClick={() => {
                          onClose();
                          if (onOpenNumberDebugger) {
                            onOpenNumberDebugger(num._id || num.id);
                          } else {
                            navigate('/super-admin/whatsapp');
                          }
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E2EAE6] hover:border-[#05A222] cursor-pointer transition text-xs group shadow-sm"
                      >
                        <div>
                          <p className="font-bold text-slate-800 group-hover:text-[#006736]">
                            {num.displayPhoneNumber} {num.verifiedName ? `(${num.verifiedName})` : ''}
                          </p>
                          <p className="text-slate-400 text-[11px] font-mono">ID: {num.phoneNumberId} • Status: {num.status}</p>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                          Debug Connection
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              {results.messages?.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
                    <MessageSquare className="w-3.5 h-3.5 text-[#05A222]" /> Messages ({results.messages.length})
                  </div>
                  <div className="space-y-1">
                    {results.messages.map((msg: any) => (
                      <div
                        key={msg._id || msg.id}
                        onClick={() => {
                          onClose();
                          if (onOpenMessageTrace) {
                            onOpenMessageTrace(msg._id || msg.id);
                          } else {
                            navigate('/super-admin/messages');
                          }
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E2EAE6] hover:border-[#05A222] cursor-pointer transition text-xs group shadow-sm"
                      >
                        <div className="max-w-[80%]">
                          <p className="font-bold text-slate-800 truncate group-hover:text-[#006736]">
                            {msg.from} → {msg.to}
                          </p>
                          <p className="text-slate-400 text-[11px] font-mono truncate">
                            WAMID: {msg.wamid || 'N/A'} • Status: {msg.status}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded shrink-0">
                          Trace Lifecycle
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-white border-t border-[#E2EAE6] flex justify-between items-center text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-600">Ctrl+K</kbd> to toggle</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-600">ESC</kbd> to close</span>
          </div>
          <span className="font-semibold text-slate-500">WAMSG Global Master Registry</span>
        </div>
      </div>
    </div>
  );
};
