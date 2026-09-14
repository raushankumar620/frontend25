import React, { useState, useEffect, useCallback } from 'react';
import { Table, type Column } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import {
  Plus,
  Key,
  Copy,
  Check,
  RotateCw,
  Trash2,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import type { ApiKeyItem, CreateApiKeyPayload, ApiScope } from '../types';
import { developerService } from '../../../services/developerService';

const AVAILABLE_SCOPES: Array<{ id: ApiScope; label: string; desc: string }> = [
  { id: '*', label: 'Full Access (*)', desc: 'Access to all current and future endpoints' },
  { id: 'messages:write', label: 'Send Messages', desc: 'POST outbound WhatsApp messages & templates' },
  { id: 'messages:read', label: 'Read Messages', desc: 'GET conversation history and message statuses' },
  { id: 'contacts:write', label: 'Manage Contacts', desc: 'POST & PATCH customer profiles, tags, and custom attributes' },
  { id: 'contacts:read', label: 'Read Contacts', desc: 'GET customer lists and contact details' },
  { id: 'templates:read', label: 'Read HSM Templates', desc: 'GET approved WhatsApp Meta message templates' },
  { id: 'campaigns:write', label: 'Broadcast Campaigns', desc: 'POST broadcast campaigns and trigger bulk dispatch' },
  { id: 'automations:read', label: 'Read Automations', desc: 'GET bot rules, triggers, and execution statuses' },
];

export const APIKeys: React.FC = () => {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [revealedSecret, setRevealedSecret] = useState<{ rawSecret: string; keyName: string } | null>(null);

  // Form State
  const [keyName, setKeyName] = useState('');
  const [environment, setEnvironment] = useState<'live' | 'test'>('live');
  const [selectedScopes, setSelectedScopes] = useState<ApiScope[]>(['messages:write', 'messages:read', 'contacts:read', 'contacts:write']);
  const [rateLimit, setRateLimit] = useState(120);
  const [ipWhitelistInput, setIpWhitelistInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Roll & Delete Modals
  const [rollTargetKey, setRollTargetKey] = useState<ApiKeyItem | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [deleteTargetKey, setDeleteTargetKey] = useState<ApiKeyItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchKeys = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await developerService.getApiKeys();
      setKeys((data || []).map((k) => ({ ...k, id: k._id || k.id })));
    } catch (err) {
      console.error('Failed to load API keys:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleScope = (scope: ApiScope) => {
    if (scope === '*') {
      if (selectedScopes.includes('*')) {
        setSelectedScopes([]);
      } else {
        setSelectedScopes(['*']);
      }
      return;
    }

    const filtered = selectedScopes.filter((s) => s !== '*');
    if (filtered.includes(scope)) {
      setSelectedScopes(filtered.filter((s) => s !== scope));
    } else {
      setSelectedScopes([...filtered, scope]);
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) {
      setFormError('Please enter a descriptive key name');
      return;
    }
    if (selectedScopes.length === 0) {
      setFormError('Please select at least one permission scope');
      return;
    }

    setIsCreating(true);
    setFormError(null);

    try {
      const ips = ipWhitelistInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload: CreateApiKeyPayload = {
        name: keyName.trim(),
        environment,
        scopes: selectedScopes,
        rateLimit,
        ipWhitelist: ips.length > 0 ? ips : undefined,
      };

      const res = await developerService.createApiKey(payload);
      setIsCreateOpen(false);
      setRevealedSecret({ rawSecret: res.rawSecret, keyName: res.apiKey.name });

      // Reset form
      setKeyName('');
      setSelectedScopes(['messages:write', 'messages:read', 'contacts:read', 'contacts:write']);
      setRateLimit(120);
      setIpWhitelistInput('');

      fetchKeys();
    } catch (err: any) {
      setFormError(err.message || 'Failed to create API key');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRollKey = async () => {
    if (!rollTargetKey) return;
    setIsRolling(true);
    try {
      const res = await developerService.rollApiKey(rollTargetKey._id || (rollTargetKey.id as string));
      setRollTargetKey(null);
      setRevealedSecret({ rawSecret: res.rawSecret, keyName: res.apiKey.name });
      fetchKeys();
    } catch (err: any) {
      alert(err.message || 'Failed to roll API key');
    } finally {
      setIsRolling(false);
    }
  };

  const handleDeleteKey = async () => {
    if (!deleteTargetKey) return;
    setIsDeleting(true);
    try {
      await developerService.revokeApiKey(deleteTargetKey._id || (deleteTargetKey.id as string));
      setDeleteTargetKey(null);
      fetchKeys();
    } catch (err: any) {
      alert(err.message || 'Failed to revoke API key');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (key: ApiKeyItem) => {
    try {
      await developerService.updateApiKey(key._id || (key.id as string), { isActive: !key.isActive });
      fetchKeys();
    } catch (err: any) {
      alert(err.message || 'Failed to update key status');
    }
  };

  const columns: Column<ApiKeyItem>[] = [
    {
      header: 'Key Name & Environment',
      render: (k) => {
        const isLive = k.keyPrefix?.includes('live');
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-bold text-[#14201C] text-sm">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isLive
                    ? 'bg-[#E9F9EE] border border-[#C4EBD0] text-[#05A222]'
                    : 'bg-amber-50 border border-amber-200 text-amber-600'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
              </div>
              <span>{k.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                  isLive
                    ? 'bg-[#E9F9EE] text-[#006736] border-[#C4EBD0]'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {isLive ? 'LIVE' : 'TEST'}
              </span>
              <span className="text-[11px] text-[#5F7069] font-medium">
                Created {new Date(k.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Masked Secret Token',
      render: (k) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[#14201C] bg-[#F6FAF8] px-2.5 py-1 rounded-lg border border-[#E2EAE6] select-all">
            {k.secretMasked || `${k.keyPrefix}••••••••••••••••${k.last4}`}
          </span>
          <button
            type="button"
            onClick={() => handleCopy(k._id || (k.id as string), k.secretMasked || `${k.keyPrefix}••••••••••••••••${k.last4}`)}
            className="text-[#5F7069] hover:text-[#05A222] p-1 rounded transition-colors"
            title="Copy masked identifier"
          >
            {copiedId === (k._id || k.id) ? (
              <Check className="w-3.5 h-3.5 text-[#05A222]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      ),
    },
    {
      header: 'Assigned Scopes',
      render: (k) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {(k.scopes || ['*']).map((s) => (
            <span
              key={s}
              className="text-[10px] font-mono font-bold bg-white text-[#006736] border border-[#C4EBD0] px-1.5 py-0.5 rounded shadow-2xs"
            >
              {s}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: 'Usage & Limits',
      render: (k) => (
        <div>
          <div className="font-black text-xs text-[#14201C]">
            {(k.usageCount || 0).toLocaleString()} requests
          </div>
          <div className="text-[10px] text-[#5F7069] font-medium">
            Limit: {k.rateLimit || 120} req/min
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (k) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleToggleStatus(k)}
            className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
              k.isActive ? 'bg-[#05A222]' : 'bg-[#C4EBD0]'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                k.isActive ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-[11px] font-bold ${k.isActive ? 'text-[#006736]' : 'text-[#5F7069]'}`}>
            {k.isActive ? 'Active' : 'Disabled'}
          </span>
        </div>
      ),
    },
    {
      header: 'Actions',
      render: (k) => (
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setRollTargetKey(k)}
            leftIcon={<RotateCw className="w-3.5 h-3.5 text-[#05A222]" />}
            className="text-xs font-semibold text-[#006736] border-[#E2EAE6] hover:bg-[#E9F9EE]"
            title="Roll and generate a new secret"
          >
            Roll Key
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setDeleteTargetKey(k)}
            leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
            className="text-xs font-semibold text-rose-600 border-rose-200 hover:bg-rose-50"
          >
            Revoke
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-[#14201C] tracking-tight">API Access Keys</h3>
          <p className="text-xs text-[#5F7069] mt-1 font-medium">
            Authenticate programmatic requests using <code className="text-[#006736] font-mono bg-[#E9F9EE] px-1.5 py-0.5 rounded border border-[#C4EBD0]">x-api-key: wmsg_live_...</code> or <code className="text-[#006736] font-mono bg-[#E9F9EE] px-1.5 py-0.5 rounded border border-[#C4EBD0]">Authorization: Bearer wmsg_live_...</code>
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsCreateOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="bg-[#05A222] hover:bg-[#006736] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs"
        >
          Generate New API Key
        </Button>
      </div>

      {/* API Keys Table */}
      <Table columns={columns} data={keys} isLoading={isLoading} />

      {/* Modal: Reveal Newly Created Raw Secret */}
      {revealedSecret && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-[#E2EAE6] space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-[#05A222]">
              <div className="w-10 h-10 rounded-2xl bg-[#E9F9EE] flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-[#05A222]" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#14201C]">API Key Generated</h3>
                <p className="text-xs text-[#5F7069]">Key: {revealedSecret.keyName}</p>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Please copy and save this secret key immediately!</strong> For your security, this key is hashed in our database and will never be shown again.
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#14201C]">
                Your Secret API Key
              </label>
              <div className="p-3 bg-[#F6FAF8] rounded-xl border-2 border-[#05A222] flex items-center justify-between gap-3">
                <code className="text-xs font-mono font-bold text-[#14201C] break-all select-all">
                  {revealedSecret.rawSecret}
                </code>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleCopy('revealed', revealedSecret.rawSecret)}
                  leftIcon={copiedId === 'revealed' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  className="bg-[#05A222] hover:bg-[#006736] text-white shrink-0 text-xs font-bold"
                >
                  {copiedId === 'revealed' ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setRevealedSecret(null)}
                className="text-xs font-bold px-5"
              >
                I Have Saved My Secret Key
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Generate New API Key */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-3xl p-6 shadow-2xl border border-[#E2EAE6] space-y-5">
            <div className="flex items-center justify-between border-b border-[#E2EAE6] pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-[#05A222]" />
                <h3 className="text-lg font-black text-[#14201C]">Generate New API Key</h3>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-[#5F7069] hover:text-[#14201C] p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateKey} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#14201C] uppercase tracking-wider mb-1.5">
                  Key Name *
                </label>
                <Input
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="e.g. Production Backend Server, Zapier Connector"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#14201C] uppercase tracking-wider mb-1.5">
                    Environment
                  </label>
                  <select
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#E2EAE6] bg-white text-[#14201C] font-semibold"
                  >
                    <option value="live">Live (wmsg_live_...)</option>
                    <option value="test">Test / Sandbox (wmsg_test_...)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#14201C] uppercase tracking-wider mb-1.5">
                    Rate Limit (Req / Min)
                  </label>
                  <Input
                    type="number"
                    value={rateLimit}
                    onChange={(e) => setRateLimit(Number(e.target.value))}
                    min={10}
                    max={1000}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14201C] uppercase tracking-wider mb-1.5">
                  Permission Scopes *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-[#F6FAF8] rounded-xl border border-[#E2EAE6]">
                  {AVAILABLE_SCOPES.map((sc) => {
                    const checked = selectedScopes.includes(sc.id) || selectedScopes.includes('*');
                    return (
                      <label
                        key={sc.id}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                          checked
                            ? 'bg-[#E9F9EE] border-[#05A222] text-[#006736]'
                            : 'bg-white border-[#E2EAE6] text-[#14201C]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleScope(sc.id)}
                          className="w-4 h-4 text-[#05A222] rounded mt-0.5"
                        />
                        <div className="text-xs">
                          <div className="font-bold">{sc.label}</div>
                          <div className="text-[10px] text-[#5F7069] leading-tight mt-0.5">{sc.desc}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14201C] uppercase tracking-wider mb-1.5">
                  IP Whitelist (Optional)
                </label>
                <Input
                  value={ipWhitelistInput}
                  onChange={(e) => setIpWhitelistInput(e.target.value)}
                  placeholder="e.g. 192.168.1.1, 10.0.0.0/24 (Leave blank to allow all IPs)"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2EAE6]">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCreateOpen(false)}
                  className="text-[#5F7069]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isCreating}
                  className="bg-[#05A222] hover:bg-[#006736] text-white font-bold px-5"
                >
                  Generate Key
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Roll Key Confirmation */}
      {rollTargetKey && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 shadow-2xl border border-[#E2EAE6] space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <RotateCw className="w-6 h-6" />
              <h3 className="text-lg font-black text-[#14201C]">Rotate API Key</h3>
            </div>
            <p className="text-xs text-[#5F7069] leading-relaxed">
              Are you sure you want to rotate secret for <strong>"{rollTargetKey.name}"</strong>? The current secret will immediately stop working and a new raw secret will be generated.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setRollTargetKey(null)} className="text-[#5F7069]">
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleRollKey}
                isLoading={isRolling}
                className="bg-[#05A222] hover:bg-[#006736] text-white font-bold"
              >
                Confirm & Rotate
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Revoke Key Confirmation */}
      {deleteTargetKey && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 shadow-2xl border border-[#E2EAE6] space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-black text-[#14201C]">Revoke API Key</h3>
            </div>
            <p className="text-xs text-[#5F7069] leading-relaxed">
              Are you sure you want to permanently revoke <strong>"{deleteTargetKey.name}"</strong>? Any servers using this key will immediately receive 401 Unauthorized errors.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setDeleteTargetKey(null)} className="text-[#5F7069]">
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDeleteKey}
                isLoading={isDeleting}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
              >
                Revoke Key
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
