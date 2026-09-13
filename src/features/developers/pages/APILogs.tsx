import React, { useState, useEffect } from 'react';
import { Table, type Column } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { RefreshCw } from 'lucide-react';
import type { ApiLog } from '../types';
import { developersApi } from '../api';

export const APILogs: React.FC = () => {
  const [logs, setLogs] = useState<ApiLog[]>([]);

  useEffect(() => {
    developersApi.getLogs().then(setLogs);
  }, []);

  const columns: Column<ApiLog>[] = [
    {
      header: 'Method & Path',
      render: (l) => (
        <div className="flex items-center gap-2 font-mono text-xs">
          <span
            className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
              l.method === 'POST' ? 'bg-emerald-950 text-emerald-400' : 'bg-sky-950 text-sky-400'
            }`}
          >
            {l.method}
          </span>
          <span className="text-white">{l.endpoint}</span>
        </div>
      ),
    },
    {
      header: 'Status Code',
      render: (l) => (
        <Badge variant={l.statusCode === 200 ? 'success' : 'danger'} size="sm">
          {l.statusCode} OK
        </Badge>
      ),
    },
    {
      header: 'Latency',
      render: (l) => <span className="font-mono text-slate-400">{l.latencyMs} ms</span>,
    },
    {
      header: 'Timestamp',
      render: (l) => <span className="font-mono text-slate-400">{l.timestamp}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-sans">API Request Logs</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry and error tracing for outbound WhatsApp API calls.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => developersApi.getLogs().then(setLogs)}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh Logs
        </Button>
      </div>

      <Table columns={columns} data={logs} />
    </div>
  );
};
