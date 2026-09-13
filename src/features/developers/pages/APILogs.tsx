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
            className={`px-2 py-0.5 rounded-md font-bold text-[10px] border ${
              l.method === 'POST'
                ? 'bg-[#E9F9EE] text-[#006736] border-[#C4EBD0]'
                : 'bg-[#F6FAF8] text-[#5F7069] border-[#E2EAE6]'
            }`}
          >
            {l.method}
          </span>
          <span className="text-[#14201C] font-semibold">{l.endpoint}</span>
        </div>
      ),
    },
    {
      header: 'Status Code',
      render: (l) => (
        <Badge variant={l.statusCode === 200 ? 'success' : 'danger'} size="sm" dot>
          {l.statusCode} OK
        </Badge>
      ),
    },
    {
      header: 'Latency',
      render: (l) => <span className="font-mono text-[#5F7069] text-xs">{l.latencyMs} ms</span>,
    },
    {
      header: 'Timestamp',
      render: (l) => <span className="font-mono text-[#8A9993] text-xs">{l.timestamp}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-[#14201C]">API Request Logs</h3>
          <p className="text-xs text-[#5F7069] mt-0.5">
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
