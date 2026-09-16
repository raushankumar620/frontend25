import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Trash2, Cpu } from 'lucide-react';
import type { QueueItem } from '../types/admin.types';

interface QueueMetricsCardProps {
  queue: QueueItem;
  onAction: (queueName: string, action: 'pause' | 'resume' | 'retry-failed' | 'clean') => Promise<void>;
}

export const QueueMetricsCard: React.FC<QueueMetricsCardProps> = ({ queue, onAction }) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAction = async (action: 'pause' | 'resume' | 'retry-failed' | 'clean') => {
    setLoadingAction(action);
    try {
      await onAction(queue.name, action);
    } finally {
      setLoadingAction(null);
    }
  };

  const isPaused = queue.status === 'PAUSED';

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E2EAE6] hover:border-[#05A222] transition-all text-[#1F2A26] space-y-4 shadow-2xs hover:shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
              isPaused
                ? 'bg-amber-50 text-amber-600 border-amber-200'
                : 'bg-[#E9F9EE] text-[#05A222] border-[#C4EBD0]'
            }`}
          >
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#14201C] tracking-wide">{queue.title}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-mono text-[#8A9993]">{queue.name}</span>
              <span className="text-[10px] text-[#5F7069]">• Concurrency: {queue.concurrency}x</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 border ${
              isPaused
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-[#E9F9EE] text-[#006736] border-[#C4EBD0]'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isPaused ? 'bg-amber-500' : 'bg-[#05A222] animate-pulse'
              }`}
            />
            {queue.status}
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-2 bg-[#F6FAF8] p-3 rounded-2xl border border-[#E2EAE6] text-center">
        <div>
          <div className="text-[11px] text-[#5F7069] font-medium">Waiting</div>
          <div className="text-base font-bold text-[#14201C] mt-0.5">{queue.waiting}</div>
        </div>
        <div>
          <div className="text-[11px] text-[#5F7069] font-medium">Active</div>
          <div className="text-base font-bold text-[#05A222] mt-0.5">{queue.active}</div>
        </div>
        <div>
          <div className="text-[11px] text-[#5F7069] font-medium">Completed</div>
          <div className="text-base font-bold text-[#14201C] mt-0.5">{queue.completed}</div>
        </div>
        <div>
          <div className="text-[11px] text-[#5F7069] font-medium">Failed</div>
          <div
            className={`text-base font-bold mt-0.5 ${
              queue.failed > 0 ? 'text-rose-600 font-extrabold' : 'text-[#8A9993]'
            }`}
          >
            {queue.failed}
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <div className="text-[#5F7069] font-mono text-[11px]">
          Rate: <span className="text-[#006736] font-bold">{queue.throughputPerSec} jobs/s</span>
        </div>

        <div className="flex items-center gap-2">
          {isPaused ? (
            <button
              onClick={() => handleAction('resume')}
              disabled={!!loadingAction}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E9F9EE] hover:bg-[#D9F3E2] text-[#006736] border border-[#C4EBD0] font-bold transition cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Resume</span>
            </button>
          ) : (
            <button
              onClick={() => handleAction('pause')}
              disabled={!!loadingAction}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold transition cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </button>
          )}

          {queue.failed > 0 && (
            <button
              onClick={() => handleAction('retry-failed')}
              disabled={!!loadingAction}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold transition cursor-pointer"
              title="Retry Dead Letters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          )}

          <button
            onClick={() => handleAction('clean')}
            disabled={!!loadingAction}
            className="p-1.5 rounded-xl text-[#5F7069] hover:text-[#14201C] hover:bg-[#F6FAF8] border border-[#E2EAE6] transition cursor-pointer"
            title="Clean Completed Jobs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
