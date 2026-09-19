import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Trash2,
  ExternalLink,
  MessageSquare,
  Send,
  Smartphone,
  Bot,
  AlertTriangle,
  CreditCard,
  ShieldAlert,
  Volume2,
  VolumeX,
  Settings,
  Sparkles,
  Loader2,
} from 'lucide-react';
import clsx from 'clsx';
import {
  notificationService,
  type NotificationItem,
  type NotificationCategory,
} from '../../services/notificationService';
import { playNotificationSound, showBrowserNotification } from '../../utils/notificationSound';
import { ROUTES } from '../../utils/constants';

interface NotificationDropdownProps {
  onNotificationCountChange?: (count: number) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  onNotificationCountChange,
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'messages' | 'campaigns' | 'system'>('all');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('whatsappmsg_sound_enabled') !== 'false';
  });
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef<number>(0);

  // Fetch unread count & initial list
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await notificationService.getNotifications({
        limit: 15,
        category: activeTab === 'all' || activeTab === 'unread' ? undefined : activeTab,
        isRead: activeTab === 'unread' ? false : undefined,
      });

      if (res.success && res.data) {
        const items = Array.isArray(res.data) ? res.data : [];
        setNotifications(items);

        // Get unread count
        const countRes = await notificationService.getUnreadCount();
        const count = countRes.data?.unreadCount || 0;
        setUnreadCount(count);
        onNotificationCountChange?.(count);

        // If count increased and sound enabled, play chime
        if (count > prevCountRef.current && prevCountRef.current !== 0) {
          if (soundEnabled) {
            playNotificationSound();
          }
          const latest = items.find((n) => !n.isRead);
          if (latest) {
            showBrowserNotification(latest.title, { body: latest.message });
          }
        }
        prevCountRef.current = count;
      }
    } catch {
      // Fallback silently if offline or token missing
    } finally {
      setLoading(false);
    }
  }, [activeTab, soundEnabled, onNotificationCountChange]);

  // Periodic polling every 15s
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      fetchNotifications();
    }
  };

  const handleMarkAsRead = async (e: React.MouseEvent, item: NotificationItem) => {
    e.stopPropagation();
    if (item.isRead) return;

    try {
      await notificationService.markAsRead(item.id || item._id!);
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      onNotificationCountChange?.(Math.max(0, unreadCount - 1));
    } catch {
      // Ignore
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setIsMarkingAll(true);
      await notificationService.markAllAsRead(activeTab === 'all' || activeTab === 'unread' ? undefined : activeTab);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() })));
      setUnreadCount(0);
      onNotificationCountChange?.(0);
    } catch {
      // Ignore
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id && n._id !== id));
      const countRes = await notificationService.getUnreadCount();
      const count = countRes.data?.unreadCount || 0;
      setUnreadCount(count);
      onNotificationCountChange?.(count);
    } catch {
      // Ignore
    }
  };

  const handleItemClick = (item: NotificationItem) => {
    if (!item.isRead) {
      notificationService.markAsRead(item.id || item._id!).catch(() => {});
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
    setIsOpen(false);

    if (item.actionUrl) {
      navigate(item.actionUrl);
    } else {
      navigate(ROUTES.NOTIFICATIONS || '/notifications');
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem('whatsappmsg_sound_enabled', String(next));
    if (next) {
      playNotificationSound();
    }
  };

  const handleSendQuickTest = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await notificationService.sendTestNotification();
      if (res.success && res.data) {
        setNotifications((prev) => [res.data, ...prev]);
        setUnreadCount((prev) => prev + 1);
        if (soundEnabled) playNotificationSound();
      }
    } catch {
      // Ignore
    }
  };

  const getCategoryIcon = (category: NotificationCategory, priority?: string) => {
    switch (category) {
      case 'messages':
        return <MessageSquare className="w-4 h-4 text-[#05A222]" />;
      case 'campaigns':
        return <Send className="w-4 h-4 text-[#E11D48]" />;
      case 'whatsapp':
        return <Smartphone className="w-4 h-4 text-[#0891B2]" />;
      case 'ai':
        return <Bot className="w-4 h-4 text-[#9333EA]" />;
      case 'billing':
        return <CreditCard className="w-4 h-4 text-[#D97706]" />;
      case 'security':
        return <ShieldAlert className="w-4 h-4 text-[#DC2626]" />;
      default:
        return priority === 'urgent' ? (
          <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
        ) : (
          <Sparkles className="w-4 h-4 text-[#05A222]" />
        );
    }
  };

  const getCategoryBg = (category: NotificationCategory) => {
    switch (category) {
      case 'messages':
        return 'bg-[#E9F9EE] border-[#C4EBD0]';
      case 'campaigns':
        return 'bg-[#FFF1F2] border-[#FFE4E6]';
      case 'whatsapp':
        return 'bg-[#ECFEFF] border-[#CFFAFE]';
      case 'ai':
        return 'bg-[#FAF5FF] border-[#F3E8FF]';
      case 'billing':
        return 'bg-[#FFFBEB] border-[#FEF3C7]';
      case 'security':
        return 'bg-[#FEF2F2] border-[#FEE2E2]';
      default:
        return 'bg-[#F6FAF8] border-[#E2EAE6]';
    }
  };

  const formatRelativeTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const diffSecs = Math.floor((Date.now() - date.getTime()) / 1000);
      if (diffSecs < 60) return 'Just now';
      const diffMins = Math.floor(diffSecs / 60);
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return 'Yesterday';
      return `${diffDays}d ago`;
    } catch {
      return '';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Bell Button */}
      <button
        onClick={handleToggleDropdown}
        className={clsx(
          'relative p-2.5 rounded-xl transition-all cursor-pointer select-none focus:outline-none',
          isOpen
            ? 'bg-[#E9F9EE] text-[#006736]'
            : 'text-[#5F7069] hover:bg-[#F6FAF8] hover:text-[#14201C]'
        )}
        aria-label="Notifications"
        title="Notifications"
      >
        <Bell className="w-5 h-5 transition-transform group-hover:rotate-12" />

        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-4.5 h-4.5 px-1 bg-[#05A222] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white shadow-xs animate-in zoom-in-50">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Interactive Dropdown Panel */}
      {isOpen && (
        <div className="fixed inset-x-2.5 top-[68px] sm:absolute sm:inset-auto sm:right-0 sm:top-auto sm:mt-2.5 w-auto sm:w-[420px] max-w-[calc(100vw-20px)] sm:max-w-[420px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(1,59,35,0.18)] border border-[#E2EAE6] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3 sm:p-4 border-b border-[#E2EAE6] bg-[#F6FAF8]/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#14201C]">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-[#E9F9EE] text-[#006736] text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-full border border-[#C4EBD0]">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                onClick={toggleSound}
                title={soundEnabled ? 'Mute notification sound' : 'Unmute notification sound'}
                className="p-1.5 rounded-lg text-[#5F7069] hover:text-[#14201C] hover:bg-white transition-colors cursor-pointer"
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-[#05A222]" />
                ) : (
                  <VolumeX className="w-4 h-4 text-[#8A9993]" />
                )}
              </button>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={isMarkingAll}
                  title="Mark all as read"
                  className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#05A222] hover:text-[#006736] hover:bg-[#E9F9EE] px-2 py-1 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isMarkingAll ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCheck className="w-3.5 h-3.5" />
                  )}
                  <span>Read all</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/notifications');
                }}
                title="Notification Settings"
                className="p-1.5 rounded-lg text-[#5F7069] hover:text-[#14201C] hover:bg-white transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center px-2.5 sm:px-3 pt-2 pb-1 border-b border-[#E2EAE6] gap-1 overflow-x-auto bg-white">
            {[
              { id: 'all', label: 'All' },
              { id: 'unread', label: 'Unread' },
              { id: 'messages', label: 'Messages' },
              { id: 'campaigns', label: 'Campaigns' },
              { id: 'system', label: 'System' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={clsx(
                  'px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all cursor-pointer',
                  activeTab === tab.id
                    ? 'bg-[#05A222] text-white shadow-xs'
                    : 'text-[#5F7069] hover:bg-[#F6FAF8] hover:text-[#14201C]'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className="max-h-[55vh] sm:max-h-[360px] overflow-y-auto divide-y divide-[#E2EAE6]/60">
            {loading && notifications.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-[#8A9993] gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#05A222]" />
                <span className="text-xs font-medium">Loading notifications...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#E9F9EE] text-[#05A222] flex items-center justify-center mb-3 border border-[#C4EBD0]">
                  <Bell className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-[#14201C]">No notifications yet</h4>
                <p className="text-xs text-[#8A9993] mt-1 max-w-[240px]">
                  {activeTab === 'unread'
                    ? "You're all caught up! No unread alerts."
                    : 'You will receive updates here when activities occur.'}
                </p>
                <button
                  onClick={handleSendQuickTest}
                  className="mt-3 text-xs font-bold text-[#05A222] bg-[#E9F9EE] hover:bg-[#D9F3E2] px-3 py-1.5 rounded-xl border border-[#C4EBD0] transition-colors cursor-pointer"
                >
                  Send Sample Alert
                </button>
              </div>
            ) : (
              notifications.map((item) => {
                const id = item.id || item._id!;
                return (
                  <div
                    key={id}
                    onClick={() => handleItemClick(item)}
                    className={clsx(
                      'p-3 sm:p-3.5 flex items-start gap-2.5 sm:gap-3 hover:bg-[#F6FAF8] transition-colors cursor-pointer group relative',
                      !item.isRead ? 'bg-[#F9FCFA]' : 'bg-white'
                    )}
                  >
                    {/* Category Icon Badge */}
                    <div
                      className={clsx(
                        'w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 border mt-0.5 transition-transform group-hover:scale-105',
                        getCategoryBg(item.category)
                      )}
                    >
                      {getCategoryIcon(item.category, item.priority)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-2 sm:pr-4">
                      <div className="flex items-center gap-1.5 justify-between">
                        <h5
                          className={clsx(
                            'text-xs truncate',
                            !item.isRead ? 'font-bold text-[#14201C]' : 'font-medium text-[#5F7069]'
                          )}
                        >
                          {item.title}
                        </h5>
                        <span className="text-[10px] text-[#8A9993] shrink-0 font-medium">
                          {formatRelativeTime(item.createdAt)}
                        </span>
                      </div>

                      <p className="text-xs text-[#5F7069] line-clamp-2 mt-0.5 leading-relaxed">
                        {item.message}
                      </p>

                      <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5">
                        <span className="text-[9px] sm:text-[10px] font-bold text-[#8A9993] uppercase tracking-wider bg-[#F6FAF8] px-1.5 py-0.5 rounded border border-[#E2EAE6]">
                          {item.category}
                        </span>

                        {item.priority === 'urgent' && (
                          <span className="text-[9px] sm:text-[10px] font-bold text-[#DC2626] bg-[#FEF2F2] px-1.5 py-0.5 rounded border border-[#FEE2E2]">
                            URGENT
                          </span>
                        )}

                        {item.actionUrl && (
                          <span className="text-[10px] font-bold text-[#05A222] flex items-center gap-0.5 hover:underline ml-auto">
                            <span>Open</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Unread dot or Action controls */}
                    <div className="flex items-center gap-1 shrink-0">
                      {!item.isRead && (
                        <button
                          onClick={(e) => handleMarkAsRead(e, item)}
                          title="Mark as read"
                          className="w-2.5 h-2.5 bg-[#05A222] rounded-full ring-2 ring-white hover:scale-125 transition-transform cursor-pointer"
                        />
                      )}
                      <button
                        onClick={(e) => handleDelete(e, id)}
                        title="Delete notification"
                        className="opacity-70 sm:opacity-0 sm:group-hover:opacity-100 p-1 text-[#8A9993] hover:text-[#DC2626] rounded-md transition-opacity cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 sm:p-3 bg-[#F6FAF8] border-t border-[#E2EAE6] flex items-center justify-between text-xs">
            <button
              onClick={handleSendQuickTest}
              className="text-[#5F7069] hover:text-[#05A222] font-semibold flex items-center gap-1 transition-colors cursor-pointer text-[11px] sm:text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#05A222]" />
              <span>Test Alert</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/notifications');
              }}
              className="font-bold text-[#05A222] hover:text-[#006736] flex items-center gap-1 transition-colors cursor-pointer text-[11px] sm:text-xs"
            >
              <span>View All Notifications</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
