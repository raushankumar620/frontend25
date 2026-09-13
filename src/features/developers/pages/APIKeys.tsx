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
        <div className="flex items-center gap-2.5 font-semibold text-[#14201C]">
          <div className="w-7 h-7 rounded-lg bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#05A222] shrink-0">
            <Key className="w-3.5 h-3.5" />
          </div>
          <span>{k.name}</span>
        </div>
      ),
    },
    {
      header: 'API Secret Token',
      render: (k) => (
        <span className="font-mono text-xs text-[#14201C] bg-[#F6FAF8] px-2.5 py-1 rounded-lg border border-[#E2EAE6]">
          {k.secretMasked}
        </span>
      ),
    },
    {
      header: 'Last Used',
      render: (k) => <span className="text-[#5F7069] text-xs">{k.lastUsedAt}</span>,
    },
    {
      header: 'Action',
      render: (k) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleCopy(k.id, k.secretMasked)}
          leftIcon={copiedId === k.id ? <Check className="w-3.5 h-3.5 text-[#05A222]" /> : <Copy className="w-3.5 h-3.5" />}
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
          <h3 className="text-lg font-bold text-[#14201C]">API Access Keys</h3>
          <p className="text-xs text-[#5F7069] mt-0.5">
            Use these bearer tokens in your HTTP request headers: <code className="text-[#006736] font-mono bg-[#E9F9EE] px-1.5 py-0.5 rounded border border-[#C4EBD0]">Authorization: Bearer &lt;token&gt;</code>
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
