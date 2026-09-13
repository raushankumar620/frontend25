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
        return <Send className="w-4 h-4 text-[#05A222]" />;
      case 'template_approved':
        return <CheckCircle className="w-4 h-4 text-[#039B56]" />;
      case 'bot_handoff':
        return <AlertCircle className="w-4 h-4 text-[#D99A00]" />;
      case 'new_lead':
        return <Bot className="w-4 h-4 text-[#07CF74]" />;
      default:
        return <CheckCircle className="w-4 h-4 text-[#8A9993]" />;
    }
  };

  return (
    <div className="bg-white border border-[#E2EAE6] rounded-2xl p-6 shadow-[0_8px_30px_rgba(1,59,35,0.04)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-[#14201C]">Live Activity Feed</h4>
          <p className="text-xs text-[#5F7069] mt-0.5">
            Real-time webhook and system notifications
          </p>
        </div>
        <Badge variant="primary" size="sm" dot>Live</Badge>
      </div>

      <div className="space-y-2">
        {mockActivities.map((act) => (
          <div key={act.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F6FAF8] transition-colors">
            <div className="p-2 rounded-xl bg-[#F6FAF8] border border-[#E2EAE6] shrink-0">
              {getIcon(act.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#1F2A26] truncate">
                  {act.title}
                </span>
                <span className="text-[10px] text-[#8A9993] shrink-0">{act.timestamp}</span>
              </div>
              <p className="text-xs text-[#5F7069] mt-0.5 truncate">{act.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
