import React, { useEffect, useState } from 'react';
import { Send, CheckCircle, Bot, AlertCircle, MessageSquare, Clock } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import type { ActivityEvent } from '../types';
import { conversationService } from '../../../services/conversationService';
import { campaignService } from '../../../services/campaignService';

export const RecentActivity: React.FC = () => {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const [convRes, campRes] = await Promise.all([
          conversationService.listConversations({ limit: 5 }).catch(() => ({ conversations: [] })),
          campaignService.getCampaigns().catch(() => []),
        ]);

        const events: ActivityEvent[] = [];

        if (campRes && Array.isArray(campRes)) {
          campRes.slice(0, 3).forEach((c: any) => {
            events.push({
              id: `camp_${c._id || c.id}`,
              type: 'campaign_completed',
              title: c.name || 'WhatsApp Broadcast',
              description: `Campaign status: ${c.status || 'DRAFT'} (${c.metrics?.deliveredCount || 0} delivered)`,
              timestamp: c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
              badgeVariant: c.status === 'COMPLETED' ? 'success' : 'primary',
            });
          });
        }

        if (convRes && Array.isArray(convRes.conversations)) {
          convRes.conversations.slice(0, 4).forEach((conv: any) => {
            events.push({
              id: `conv_${conv.id || conv._id}`,
              type: conv.aiHandedOff ? 'bot_handoff' : 'new_lead',
              title: conv.contactName ? `Chat with ${conv.contactName}` : 'Incoming Conversation',
              description: conv.lastMessage?.content || conv.lastMessagePreview || 'Active WhatsApp conversation',
              timestamp: conv.updatedAt ? new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
              badgeVariant: conv.aiHandedOff ? 'warning' : 'info',
            });
          });
        }

        setActivities(events);
      } catch (err) {
        console.error('Failed to load live activity feed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

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
        return <MessageSquare className="w-4 h-4 text-[#8A9993]" />;
    }
  };

  return (
    <div className="bg-white border border-[#E2EAE6] rounded-2xl p-6 shadow-[0_8px_30px_rgba(1,59,35,0.04)]">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h4 className="text-base sm:text-lg font-bold text-[#14201C]">Live Activity Feed</h4>
          <p className="text-sm text-[#5F7069] mt-0.5">
            Real-time webhook and system notifications
          </p>
        </div>
        <Badge variant="primary" size="md" dot>Live</Badge>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-[#5F7069]">
          <Clock className="w-5 h-5 mx-auto mb-2 text-[#05A222] animate-spin" />
          Loading live activities...
        </div>
      ) : activities.length === 0 ? (
        <div className="py-8 text-center text-xs text-[#5F7069] bg-[#F6FAF8] rounded-xl border border-dashed border-[#E2EAE6]">
          <MessageSquare className="w-6 h-6 mx-auto mb-2 text-[#8A9993]" />
          No recent activity yet. Live events and messages will appear here.
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((act) => (
            <div key={act.id} className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-[#F6FAF8] transition-colors">
              <div className="p-2.5 rounded-xl bg-[#F6FAF8] border border-[#E2EAE6] shrink-0">
                {getIcon(act.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-[#1F2A26] truncate">
                    {act.title}
                  </span>
                  <span className="text-xs text-[#8A9993] shrink-0 font-medium">{act.timestamp}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#5F7069] mt-1 line-clamp-2">{act.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
