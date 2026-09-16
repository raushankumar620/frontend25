import React from 'react';
import { Database, Server, Cpu, Globe, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { SystemHealth } from '../types/admin.types';

interface SystemHealthWidgetProps {
  health: SystemHealth | null;
  loading?: boolean;
}

export const SystemHealthWidget: React.FC<SystemHealthWidgetProps> = ({ health, loading }) => {
  if (loading || !health) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-white rounded-2xl border border-[#E2EAE6]" />
        ))}
      </div>
    );
  }

  const items = [
    {
      title: 'Database (MongoDB)',
      value: health.services.database.status,
      latency: `${health.services.database.pingMs}ms`,
      icon: Database,
      isOk: health.services.database.status === 'CONNECTED',
    },
    {
      title: 'Redis & Queues',
      value: health.services.redis.status,
      latency: `${health.services.redis.pingMs}ms`,
      icon: Server,
      isOk: health.services.redis.status === 'CONNECTED',
    },
    {
      title: 'Meta Cloud API (v20.0)',
      value: health.services.metaApi.status,
      latency: `${health.services.metaApi.latencyMs}ms`,
      icon: Globe,
      isOk: health.services.metaApi.status === 'OPERATIONAL',
    },
    {
      title: 'AI Inference Gateway',
      value: health.services.aiEngine.status,
      latency: `${health.services.aiEngine.latencyMs}ms`,
      icon: Cpu,
      isOk: health.services.aiEngine.status === 'OPERATIONAL',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="p-4 rounded-2xl bg-white border border-[#E2EAE6] hover:border-[#05A222] transition-all flex items-center justify-between shadow-2xs hover:shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${item.isOk ? 'bg-[#E9F9EE] text-[#05A222] border border-[#C4EBD0]' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-[#5F7069] font-medium">{item.title}</div>
              <div className="text-sm font-bold text-[#14201C] flex items-center gap-1.5 mt-0.5">
                <span>{item.value}</span>
                {item.isOk ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#05A222]" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-mono text-[#006736] bg-[#E9F9EE] px-2 py-0.5 rounded-lg border border-[#C4EBD0] font-semibold">
              {item.latency}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
