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
        <div className="flex items-center gap-2.5 font-mono text-xs text-[#14201C]">
          <div className="w-7 h-7 rounded-lg bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#05A222] shrink-0">
            <Webhook className="w-3.5 h-3.5" />
          </div>
          <span className="truncate max-w-md font-medium">{w.url}</span>
        </div>
      ),
    },
    {
      header: 'Subscribed Events',
      render: (w) => (
        <div className="flex flex-wrap gap-1.5">
          {w.events.map((e, idx) => (
            <span key={idx} className="bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0] font-mono text-[10px] font-semibold px-2 py-0.5 rounded-md">
              {e}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: 'Health / Ping',
      render: (w) => (
        <span className="text-[#05A222] font-semibold text-xs flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#05A222] animate-pulse" />
          {w.lastPingAt}
        </span>
      ),
    },
    {
      header: 'Action',
      render: () => (
        <Button size="sm" variant="outline" leftIcon={<Play className="w-3 h-3 text-[#05A222]" />}>
          Send Test Ping
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-[#14201C]">Webhook Endpoints</h3>
          <p className="text-xs text-[#5F7069] mt-0.5">
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
