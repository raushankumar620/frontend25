import React, { useEffect, useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { conversationService } from '../../../services/conversationService';
import { campaignService } from '../../../services/campaignService';
import { ROUTES } from '../../../utils/constants';

interface ActivityItem {
  id: string;
  type: 'campaign' | 'contact' | 'template' | 'chat' | 'general';
  title: string;
  description: string;
  timestamp: string;
  badge: string;
  badgeType: 'success' | 'import' | 'approved' | 'neutral';
  icon: React.ComponentType<any>;
  iconBg: string;
  iconColor: string;
}

export const RecentActivity: React.FC = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const [campRes, convRes] = await Promise.all([
          campaignService.getCampaigns().catch(() => []),
          conversationService.listConversations({ limit: 4 }).catch(() => ({ conversations: [] })),
        ]);

        const items: ActivityItem[] = [];

        // Real campaigns
        if (Array.isArray(campRes) && campRes.length > 0) {
          campRes.slice(0, 3).forEach((c: any, idx: number) => {
            const timeAgo = c.createdAt
              ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Recent';
            items.push({
              id: `camp_${c.id || c._id || idx}`,
              type: 'campaign',
              title: c.name || 'Broadcast Campaign',
              description: `Campaign ${c.status || 'Active'} • ${(c.metrics?.deliveredCount || c.metrics?.totalRecipients || 0).toLocaleString()} recipients`,
              timestamp: timeAgo,
              badge: c.status === 'COMPLETED' ? 'Success' : 'Campaign',
              badgeType: 'success',
              icon: Send,
              iconBg: 'bg-[#E9F9EE]',
              iconColor: 'text-[#05A222]',
            });
          });
        }

        // Real conversation chats
        if (convRes?.conversations && Array.isArray(convRes.conversations) && convRes.conversations.length > 0) {
          convRes.conversations.slice(0, 3).forEach((conv: any) => {
            const timeAgo = conv.updatedAt
              ? new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Just now';
            items.push({
              id: `conv_${conv.id}`,
              type: 'chat',
              title: conv.contactName || conv.contactPhoneNumber || 'WhatsApp Contact',
              description: conv.lastMessage?.content || conv.lastMessagePreview || 'Active chat interaction',
              timestamp: timeAgo,
              badge: conv.aiHandedOff ? 'AI Agent' : 'Chat',
              badgeType: 'import',
              icon: MessageSquare,
              iconBg: 'bg-[#EFF6FF]',
              iconColor: 'text-[#2563EB]',
            });
          });
        }

        setActivities(items);
      } catch {
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getBadgeClass = (type: ActivityItem['badgeType']) => {
    switch (type) {
      case 'success':
        return 'bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]';
      case 'import':
        return 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]';
      case 'approved':
        return 'bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]';
      default:
        return 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]';
    }
  };

  return (
    <div className="bg-white border border-[#E2EAE6] rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-[#14201C] tracking-tight">Recent Activity</h2>
          <p className="text-xs text-[#5F7069] mt-0.5">
            Latest updates from your WhatsApp business.
          </p>
        </div>
        <button
          onClick={() => navigate(ROUTES.CAMPAIGNS)}
          className="text-xs font-bold text-[#14201C] hover:text-[#05A222] bg-[#F6FAF8] hover:bg-[#E9F9EE] px-3 py-1.5 rounded-xl border border-[#E2EAE6] hover:border-[#C4EBD0] transition-colors cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Activity List */}
      <div className="space-y-3.5 flex-1">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-3 animate-pulse p-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100" />
                <div className="space-y-1.5">
                  <div className="h-3.5 bg-slate-100 rounded w-24" />
                  <div className="h-3 bg-slate-100 rounded w-44" />
                </div>
              </div>
              <div className="h-4 bg-slate-100 rounded w-16" />
            </div>
          ))
        ) : activities.length === 0 ? (
          <div className="py-8 text-center flex flex-col items-center justify-center">
            <p className="text-xs font-bold text-[#14201C]">No recent activity yet</p>
            <p className="text-[11px] text-[#5F7069] mt-0.5">Live broadcasts and customer chats will appear here.</p>
          </div>
        ) : (
          activities.map((act) => {
            const Icon = act.icon;
            return (
              <div
                key={act.id}
                className="flex items-center justify-between gap-3 p-2 hover:bg-[#F6FAF8] rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl ${act.iconBg} ${act.iconColor} flex items-center justify-center shrink-0 shadow-2xs`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-[#14201C] truncate">{act.title}</h3>
                    <p className="text-[11px] text-[#5F7069] truncate mt-0.5">
                      {act.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-[11px] text-[#8A9993] font-medium hidden sm:inline">
                    {act.timestamp}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getBadgeClass(
                      act.badgeType
                    )}`}
                  >
                    {act.badge}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
