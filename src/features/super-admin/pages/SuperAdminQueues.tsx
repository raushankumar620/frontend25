import React, { useState, useEffect } from 'react';
import { Cpu, RefreshCw } from 'lucide-react';
import { superAdminService } from '../services/superAdminService';
import { QueueMetricsCard } from '../components/QueueMetricsCard';
import { PageContainer } from '../../../components/layout/PageContainer';
import type { QueuesResponse } from '../types/admin.types';

export const SuperAdminQueues: React.FC = () => {
  const [data, setData] = useState<QueuesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchQueues = async () => {
    try {
      const res = await superAdminService.getQueues();
      setData(res);
    } catch (err) {
      console.error('Failed to fetch queues telemetry', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueues();
    if (!autoRefresh) return;
    const interval = setInterval(fetchQueues, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleQueueAction = async (
    queueName: string,
    action: 'pause' | 'resume' | 'retry-failed' | 'clean'
  ) => {
    try {
      await superAdminService.executeQueueAction(queueName, action);
      await fetchQueues();
    } catch (err) {
      console.error(`Failed to execute ${action} on ${queueName}`, err);
    }
  };

  const summary = data?.summary;

  return (
    <PageContainer className="space-y-6 text-[#1F2A26]">
      {/* Actions Toolbar */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
            autoRefresh
              ? 'bg-[#E9F9EE] border-[#C4EBD0] text-[#006736]'
              : 'bg-white border-[#E2EAE6] text-[#5F7069]'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`} />
          <span>{autoRefresh ? 'Live Sync Active (5s)' : 'Live Sync Paused'}</span>
        </button>

        <button
          onClick={fetchQueues}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E2EAE6] text-[#14201C] hover:bg-[#F2F7F5] rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#5F7069]" />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E2EAE6] shadow-xs">
          <div className="text-xs text-[#5F7069] font-medium">Active Queues</div>
          <div className="text-xl font-bold text-[#05A222] mt-1">
            {summary?.activeQueues || 0} / {summary?.totalQueues || 0}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E2EAE6] shadow-xs">
          <div className="text-xs text-[#5F7069] font-medium">Jobs In Flight (Active)</div>
          <div className="text-xl font-bold text-[#14201C] mt-1">{summary?.totalActive || 0}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E2EAE6] shadow-xs">
          <div className="text-xs text-[#5F7069] font-medium">Total Processed Jobs</div>
          <div className="text-xl font-bold text-[#14201C] mt-1">
            {(summary?.totalCompleted || 0).toLocaleString()}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E2EAE6] shadow-xs">
          <div className="text-xs text-[#5F7069] font-medium">Failed Dead-Letters</div>
          <div
            className={`text-xl font-bold mt-1 ${
              (summary?.totalFailed || 0) > 0 ? 'text-rose-600 font-extrabold' : 'text-[#8A9993]'
            }`}
          >
            {summary?.totalFailed || 0}
          </div>
        </div>
      </div>

      {/* Queue Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {(data?.queues || []).map((q) => (
          <QueueMetricsCard key={q.name} queue={q} onAction={handleQueueAction} />
        ))}
      </div>
    </PageContainer>
  );
};
