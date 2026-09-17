import React, { useState, useEffect, useCallback } from 'react';
import { Table, type Column } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import {
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Terminal,
  X
} from 'lucide-react';
import type { ApiLog } from '../types';
import { developerService } from '../../../services/developerService';

export const APILogs: React.FC = () => {
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const [selectedLog, setSelectedLog] = useState<ApiLog | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await developerService.getApiLogs({
        method: methodFilter !== 'ALL' ? methodFilter : undefined,
        limit: 50,
      });
      setLogs((res.logs || []).map((l) => ({ ...l, id: l._id || l.id })));
    } catch (err) {
      console.error('Failed to fetch API logs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [methodFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getStatusBadge = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#006736] bg-[#E9F9EE] border border-[#C4EBD0] px-2 py-0.5 rounded-md">
          <CheckCircle2 className="w-3 h-3 text-[#05A222]" /> {statusCode} OK
        </span>
      );
    }
    if (statusCode >= 400 && statusCode < 500) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
          <AlertTriangle className="w-3 h-3 text-amber-500" /> {statusCode}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
        <XCircle className="w-3 h-3 text-rose-500" /> {statusCode}
      </span>
    );
  };

  const getMethodBadge = (method: string) => {
    let colorClasses = 'bg-[#F6FAF8] text-[#5F7069] border-[#E2EAE6]';
    if (method === 'POST') colorClasses = 'bg-[#E9F9EE] text-[#006736] border-[#C4EBD0]';
    if (method === 'GET') colorClasses = 'bg-sky-50 text-sky-700 border-sky-200';
    if (method === 'DELETE') colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
    if (method === 'PATCH' || method === 'PUT') colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200';

    return (
      <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[10px] border ${colorClasses}`}>
        {method}
      </span>
    );
  };

  const columns: Column<ApiLog>[] = [
    {
      header: 'Method & Endpoint',
      render: (l) => (
        <div className="flex items-center gap-2 font-mono text-xs">
          {getMethodBadge(l.method)}
          <span className="text-[#14201C] font-semibold truncate max-w-xs">{l.endpoint}</span>
        </div>
      ),
    },
    {
      header: 'Key / Source',
      render: (l) => (
        <div className="text-xs">
          <div className="font-bold text-[#14201C]">{l.keyName || 'API Key'}</div>
          {l.ipAddress && <div className="text-[10px] font-mono text-[#5F7069]">{l.ipAddress}</div>}
        </div>
      ),
    },
    {
      header: 'Status',
      render: (l) => getStatusBadge(l.statusCode),
    },
    {
      header: 'Latency',
      render: (l) => (
        <span
          className={`font-mono text-xs font-semibold ${
            l.latencyMs < 200 ? 'text-[#006736]' : l.latencyMs < 600 ? 'text-amber-600' : 'text-rose-600'
          }`}
        >
          {l.latencyMs} ms
        </span>
      ),
    },
    {
      header: 'Timestamp',
      render: (l) => (
        <span className="text-[#5F7069] text-xs font-medium">
          {new Date(l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      ),
    },
    {
      header: 'Inspect',
      render: (l) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setSelectedLog(l)}
          leftIcon={<Eye className="w-3.5 h-3.5 text-[#05A222]" />}
          className="text-xs font-semibold text-[#006736] border-[#E2EAE6] hover:bg-[#E9F9EE]"
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-[#14201C] tracking-tight">API Request Telemetry & Logs</h3>
          <p className="text-xs text-[#5F7069] mt-1 font-medium">
            Real-time latency metrics, response codes, and security audit logs for all developer requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Method Filter */}
          <div className="flex items-center gap-1 bg-[#F6FAF8] p-1 rounded-xl border border-[#E2EAE6]">
            {['ALL', 'GET', 'POST', 'PATCH', 'DELETE'].map((m) => (
              <button
                key={m}
                onClick={() => setMethodFilter(m)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  methodFilter === m
                    ? 'bg-[#05A222] text-white shadow-2xs'
                    : 'text-[#5F7069] hover:text-[#14201C]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchLogs}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            className="text-xs font-bold"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Logs Table */}
      <Table columns={columns} data={logs} isLoading={isLoading} />

      {/* Inspect Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-[#E2EAE6] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2EAE6] pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#05A222]" />
                <h3 className="text-lg font-black text-[#14201C]">API Request Trace</h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-[#5F7069] hover:text-[#14201C] p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#F6FAF8] rounded-2xl border border-[#E2EAE6]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#5F7069]">HTTP Method</span>
                  <div className="mt-0.5">{getMethodBadge(selectedLog.method)}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#5F7069]">Status Code</span>
                  <div className="mt-0.5">{getStatusBadge(selectedLog.statusCode)}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#5F7069]">Latency</span>
                  <div className="font-mono font-bold text-[#14201C] mt-0.5">{selectedLog.latencyMs} ms</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#5F7069]">IP Address</span>
                  <div className="font-mono font-medium text-[#14201C] mt-0.5">{selectedLog.ipAddress || '127.0.0.1'}</div>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#5F7069]">Request Path</span>
                <div className="p-2.5 bg-white text-[#0F172A] font-mono font-semibold text-xs rounded-xl mt-1 break-all select-all border border-[#E2EAE6] shadow-2xs">
                  {selectedLog.endpoint}
                </div>
              </div>

              {selectedLog.userAgent && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#5F7069]">User Agent</span>
                  <div className="p-2 bg-[#F6FAF8] text-[#14201C] font-mono text-[11px] rounded-xl border border-[#E2EAE6] mt-1 break-all">
                    {selectedLog.userAgent}
                  </div>
                </div>
              )}

              {selectedLog.errorMessage && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-600">Error Details</span>
                  <div className="p-2.5 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200 mt-1">
                    {selectedLog.errorMessage}
                  </div>
                </div>
              )}

              <div className="text-[10px] text-[#5F7069] flex items-center justify-between pt-2">
                <span>Timestamp: {new Date(selectedLog.createdAt).toISOString()}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="secondary" onClick={() => setSelectedLog(null)} className="text-xs font-bold px-5">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
