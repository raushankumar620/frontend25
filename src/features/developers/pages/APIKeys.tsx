import React, { useState, useEffect } from 'react';
import { Table, type Column } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Plus, Key, Copy, Check } from 'lucide-react';
import type { ApiKeyItem } from '../types';
import { developersApi } from '../api';

export const APIKeys: React.FC = () => {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    developersApi.getApiKeys().then(setKeys);
  }, []);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const columns: Column<ApiKeyItem>[] = [
    {
      header: 'Key Name & Environment',
      render: (k) => (
        <div className="flex items-center gap-2 font-sans font-semibold text-white">
          <Key className="w-4 h-4 text-emerald-400" />
          <span>{k.name}</span>
        </div>
      ),
    },
    {
      header: 'API Secret Token',
      render: (k) => (
        <span className="font-mono text-xs text-slate-300 bg-slate-950 px-2 py-1 rounded border border-slate-800">
          {k.secretMasked}
        </span>
      ),
    },
    {
      header: 'Last Used',
      render: (k) => <span className="text-slate-400 font-sans">{k.lastUsedAt}</span>,
    },
    {
      header: 'Action',
      render: (k) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleCopy(k.id, k.secretMasked)}
          leftIcon={copiedId === k.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        >
          {copiedId === k.id ? 'Copied' : 'Copy Key'}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-sans">API Access Keys</h2>
          <p className="text-xs text-slate-400 mt-1">
            Use these tokens in the <code className="text-emerald-400 font-mono">Authorization: Bearer</code> header.
          </p>
        </div>

        <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
          Generate New API Key
        </Button>
      </div>

      <Table columns={columns} data={keys} />
    </div>
  );
};
