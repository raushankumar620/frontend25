import React from 'react';
import { Send, CheckCircle, Bot, AlertCircle } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import type { ActivityEvent } from '../types';

const mockActivities: ActivityEvent[] = [
  {
    id: 'act_1',
    type: 'campaign_completed',
    title: 'Spring Flash Sale Broadcast',
    description: 'Broadcast delivered to 14,280 contacts (99.1% delivered)',
    timestamp: '12m ago',
    badgeVariant: 'success',
  },
  {
    id: 'act_2',
    type: 'template_approved',
    title: 'Template Approved by Meta',
    description: '"order_tracking_v3" was approved for utility category',
    timestamp: '45m ago',
    badgeVariant: 'primary',
  },
  {
    id: 'act_3',
    type: 'bot_handoff',
    title: 'AI Agent Handed Off Conversation',
    description: 'Lead "David Miller" requested human sales representative',
    timestamp: '1h ago',
    badgeVariant: 'warning',
  },
  {
    id: 'act_4',
    type: 'new_lead',
    title: 'New High-Value WhatsApp Lead',
    description: 'Inbound message from +44 7700 900123 via website QR',
    timestamp: '2h ago',
    badgeVariant: 'info',
  },
];

export const RecentActivity: React.FC = () => {
  const getIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'campaign_completed':
        return <Send className="w-4 h-4 text-emerald-500" />;
      case 'template_approved':
        return <CheckCircle className="w-4 h-4 text-teal-500" />;
      case 'bot_handoff':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'new_lead':
        return <Bot className="w-4 h-4 text-indigo-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Live Activity Feed</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time webhook and system notifications
          </p>
        </div>
        <Badge variant="primary" size="sm" dot>Live</Badge>
      </div>

      <div className="space-y-4">
        {mockActivities.map((act) => (
          <div key={act.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
              {getIcon(act.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {act.title}
                </span>
                <span className="text-[10px] text-slate-400 shrink-0">{act.timestamp}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{act.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
