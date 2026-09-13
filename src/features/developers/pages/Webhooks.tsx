import React, { useState, useEffect } from 'react';
import { Table, type Column } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Plus, Webhook, Play } from 'lucide-react';
import type { WebhookEndpoint } from '../types';
import { developersApi } from '../api';

export const Webhooks: React.FC = () => {
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);

  useEffect(() => {
    developersApi.getWebhooks().then(setWebhooks);
  }, []);

  const columns: Column<WebhookEndpoint>[] = [
    {
      header: 'Endpoint URL',
      render: (w) => (
        <div className="flex items-center gap-2 font-mono text-xs text-white">
          <Webhook className="w-4 h-4 text-teal-400 shrink-0" />
          <span className="truncate max-w-md">{w.url}</span>
        </div>
      ),
    },
    {
      header: 'Subscribed Events',
      render: (w) => (
        <div className="flex flex-wrap gap-1">
          {w.events.map((e, idx) => (
            <span key={idx} className="bg-slate-800 text-slate-300 font-mono text-[10px] px-1.5 py-0.5 rounded">
              {e}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: 'Health / Ping',
      render: (w) => <span className="text-emerald-400 font-sans text-xs">{w.lastPingAt}</span>,
    },
    {
      header: 'Action',
      render: () => (
        <Button size="sm" variant="outline" leftIcon={<Play className="w-3 h-3" />}>
          Send Test Ping
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-sans">Webhook Endpoints</h2>
          <p className="text-xs text-slate-400 mt-1">
            Receive real-time HTTP POST notifications when WhatsApp messages or delivery statuses occur.
          </p>
        </div>

        <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
          Add Webhook Endpoint
        </Button>
      </div>

      <Table columns={columns} data={webhooks} />
    </div>
  );
};
