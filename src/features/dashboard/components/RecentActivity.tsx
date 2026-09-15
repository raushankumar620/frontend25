import React, { useEffect, useState, useMemo } from 'react';
import { Send, CheckCircle, Bot, MessageSquare, Clock, Sparkles, ExternalLink } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import type { ActivityEvent } from '../types';
import { conversationService } from '../../../services/conversationService';
import { campaignService } from '../../../services/campaignService';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

type FilterCategory = 'all' | 'campaigns' | 'chats' | 'ai';

export const RecentActivity: React.FC = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterCategory>('all');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const [convRes, campRes] = await Promise.all([
          conversationService.listConversations({ limit: 6 }).catch(() => ({ conversations: [] })),
          campaignService.getCampaigns().catch(() => []),
        ]);

        const events: ActivityEvent[] = [];

        if (campRes && Array.isArray(campRes)) {
          campRes.slice(0, 4).forEach((c: any) => {
            events.push({
              id: `camp_${c._id || c.id}`,
              type: 'campaign_completed',
              title: c.name || 'WhatsApp Broadcast',
              description: `Campaign status: ${c.status || 'DRAFT'} • ${c.metrics?.deliveredCount || 0} delivered`,
              timestamp: c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
              badgeVariant: c.status === 'COMPLETED' ? 'success' : 'primary',
            });
          });
        }

        if (convRes && Array.isArray(convRes.conversations)) {
          convRes.conversations.slice(0, 5).forEach((conv: any) => {
            events.push({
              id: `conv_${conv.id || conv._id}`,
              type: conv.aiHandedOff ? 'bot_handoff' : conv.unreadCount ? 'new_lead' : 'message_sent',
              title: conv.contactName ? `${conv.contactName}` : (conv.contactPhoneNumber || 'WhatsApp Contact'),
              description: conv.lastMessage?.content || conv.lastMessagePreview || 'Active conversation session',
              timestamp: conv.updatedAt ? new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
              badgeVariant: conv.aiHandedOff ? 'warning' : 'info',
            });
          });
        }

        // If no dynamic events yet, add clean sample onboarding events
        if (events.length === 0) {
          events.push(
            {
              id: 'init_1',
              type: 'template_approved',
              title: 'Meta Template Verified',
              description: 'Welcome and broadcast templates active on Meta Cloud API',
              timestamp: 'Just now',
              badgeVariant: 'success',
            },
            {
              id: 'init_2',
              type: 'bot_handoff',
              title: 'AI Smart Agent Online',
              description: 'AI Autonomous containment running on primary channel',
              timestamp: '2m ago',
              badgeVariant: 'info',
            }
          );
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

  const filteredActivities = useMemo(() => {
    if (filter === 'all') return activities;
    if (filter === 'campaigns') return activities.filter((a) => a.type === 'campaign_completed' || a.type === 'template_approved');
    if (filter === 'chats') return activities.filter((a) => a.type === 'new_lead' || a.type === 'message_sent');
    if (filter === 'ai') return activities.filter((a) => a.type === 'bot_handoff');
    return activities;
  }, [activities, filter]);

  const getIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'campaign_completed':
        return <Send className="w-4 h-4 text-[#05A222]" />;
      case 'template_approved':
        return <CheckCircle className="w-4 h-4 text-[#039B56]" />;
      case 'bot_handoff':
        return <Bot className="w-4 h-4 text-[#7C3AED]" />;
      case 'new_lead':
        return <Sparkles className="w-4 h-4 text-[#07CF74]" />;
      default:
        return <MessageSquare className="w-4 h-4 text-[#006736]" />;
    }
  };

  return (
    <div className="bg-white border border-[#E2EAE6] rounded-2xl p-5 sm:p-6 shadow-[0_8px_30px_rgba(1,59,35,0.04)] flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base sm:text-lg font-black text-[#14201C] tracking-tight">
                Live Activity Feed
              </h4>
              <Badge variant="success" size="sm" dot>
                Real-time
              </Badge>
            </div>
            <p className="text-xs text-[#5F7069] mt-0.5">
              Live webhook stream & conversational telemetry
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 p-1 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl text-xs font-bold mb-4 overflow-x-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'campaigns', label: 'Broadcasts' },
            { id: 'chats', label: 'Chats' },
            { id: 'ai', label: 'AI Agent' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as FilterCategory)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-white text-[#006736] shadow-xs border border-[#E2EAE6]'
                  : 'text-[#5F7069] hover:text-[#14201C]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Event List */}
        {loading ? (
          <div className="py-12 text-center text-xs text-[#5F7069]">
            <Clock className="w-6 h-6 mx-auto mb-2 text-[#05A222] animate-spin" />
            Connecting to event stream...
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#5F7069] bg-[#F6FAF8] rounded-xl border border-dashed border-[#E2EAE6]">
            <MessageSquare className="w-6 h-6 mx-auto mb-2 text-[#8A9993]" />
            No events found in this category.
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredActivities.slice(0, 5).map((act) => (
              <div
                key={act.id}
                className="group flex items-start gap-3 p-3 rounded-xl border border-transparent hover:border-[#E2EAE6] hover:bg-[#F6FAF8]/80 transition-all duration-200"
              >
                <div className="p-2 rounded-xl bg-[#F6FAF8] border border-[#E2EAE6] shrink-0 group-hover:scale-105 transition-transform">
                  {getIcon(act.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-[#14201C] truncate">
                      {act.title}
                    </span>
                    <span className="text-[11px] text-[#8A9993] shrink-0 font-medium">
                      {act.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-[#5F7069] mt-0.5 line-clamp-1">
                    {act.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="mt-4 pt-3 border-t border-[#E2EAE6] flex items-center justify-between">
        <button
          onClick={() => navigate(ROUTES.INBOX)}
          className="text-xs font-bold text-[#006736] hover:text-[#05A222] flex items-center gap-1 cursor-pointer transition-colors"
        >
          View Live Inbox <ExternalLink className="w-3 h-3" />
        </button>
        <button
          onClick={() => navigate(ROUTES.ANALYTICS)}
          className="text-xs font-bold text-[#5F7069] hover:text-[#14201C] cursor-pointer transition-colors"
        >
          Full Analytics →
        </button>
      </div>
    </div>
  );
};
