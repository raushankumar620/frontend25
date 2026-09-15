import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Trash2,
  Search,
  Settings2,
  Sparkles,
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
  RefreshCw,
  Sliders,
  CheckCircle2,
  Clock,
  X,
  Zap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import clsx from 'clsx';
import {
  notificationService,
  type NotificationItem,
  type NotificationCategory,
  type NotificationPriority,
  type NotificationPreferences,
  type NotificationType,
} from '../../../services/notificationService';
import {
  playNotificationSound,
  requestNotificationPermission,
  showBrowserNotification,
} from '../../../utils/notificationSound';

export const Notifications: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [filterRead, setFilterRead] = useState<string>('all'); // 'all', 'unread', 'read'
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Panels
  const [showPreferencesModal, setShowPreferencesModal] = useState<boolean>(false);
  const [showTestModal, setShowTestModal] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailNotifications: true,
    inAppNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    categories: {
      messages: true,
      campaigns: true,
      whatsapp: true,
      ai: true,
      billing: true,
      system: true,
      security: true,
    },
  });
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Test Notification Form State
  const [testForm, setTestForm] = useState<{
    title: string;
    message: string;
    type: NotificationType;
    category: NotificationCategory;
    priority: NotificationPriority;
    actionUrl: string;
  }>({
    title: 'Incoming Customer Lead Reply',
    message: 'Sarah Jenkins: "Hello, I am interested in the WhatsApp Enterprise automation plan."',
    type: 'NEW_MESSAGE',
    category: 'messages',
    priority: 'high',
    actionUrl: '/inbox',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch notifications
  const fetchNotifications = useCallback(
    async (isManualRefresh = false) => {
      try {
        if (isManualRefresh) setRefreshing(true);
        else setLoading(true);

        const isReadParam =
          filterRead === 'unread' ? false : filterRead === 'read' ? true : undefined;

        const res = await notificationService.getNotifications({
          page,
          limit: 20,
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          priority: selectedPriority === 'all' ? undefined : selectedPriority,
          isRead: isReadParam,
          search: searchQuery.trim() || undefined,
        });

        if (res.success && res.data) {
          const items = Array.isArray(res.data) ? res.data : [];
          setNotifications(items);

          const meta = res.meta as any;
          if (meta?.pagination) {
            setTotalPages(meta.pagination.pages || 1);
            setTotalCount(meta.pagination.total || items.length);
            setUnreadCount(meta.pagination.unreadCount || 0);
          } else {
            setTotalPages(1);
            setTotalCount(items.length);
          }

          if (meta?.unreadByCategory) {
            setCategoryStats(meta.unreadByCategory);
          }
        }
      } catch {
        showToast('Failed to load notifications. Please check your connection.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, selectedCategory, selectedPriority, filterRead, searchQuery]
  );

  // Load preferences
  const fetchPreferences = async () => {
    try {
      const res = await notificationService.getPreferences();
      if (res.success && res.data) {
        setPreferences(res.data);
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchPreferences();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (item: NotificationItem) => {
    if (item.isRead) return;
    try {
      await notificationService.markAsRead(item.id || item._id!);
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      showToast('Notification marked as read');
    } catch {
      showToast('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(selectedCategory === 'all' ? undefined : selectedCategory);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() })));
      setUnreadCount(0);
      showToast('All notifications marked as read');
    } catch {
      showToast('Failed to mark all as read');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id && n._id !== id));
      setTotalCount((prev) => Math.max(0, prev - 1));
      showToast('Notification deleted');
    } catch {
      showToast('Failed to delete notification');
    }
  };

  const handleClearAllRead = async () => {
    try {
      await notificationService.clearAllNotifications(true);
      setNotifications((prev) => prev.filter((n) => !n.isRead));
      showToast('Cleared read notification history');
    } catch {
      showToast('Failed to clear read history');
    }
  };

  const handleRequestPushPermission = async () => {
    const perm = await requestNotificationPermission();
    setBrowserPermission(perm);
    if (perm === 'granted') {
      showBrowserNotification('Push Notifications Enabled', {
        body: 'You will receive desktop alerts for WhatsApp messages and critical events.',
      });
      showToast('Browser push notifications enabled!');
    } else {
      showToast('Browser notification permission was not granted');
    }
  };

  const handleSavePreferences = async () => {
    try {
      await notificationService.updatePreferences(preferences);
      setShowPreferencesModal(false);
      localStorage.setItem('whatsappmsg_sound_enabled', String(preferences.soundEnabled));
      showToast('Notification preferences saved successfully');
    } catch {
      showToast('Failed to save preferences');
    }
  };

  const handleSendTestNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await notificationService.sendTestNotification(testForm);
      if (res.success && res.data) {
        setNotifications((prev) => [res.data, ...prev]);
        setUnreadCount((prev) => prev + 1);
        setTotalCount((prev) => prev + 1);
        setShowTestModal(false);

        if (preferences.soundEnabled) {
          playNotificationSound();
        }
        if (preferences.pushNotifications) {
          showBrowserNotification(res.data.title, { body: res.data.message });
        }
        showToast('Sample notification triggered successfully!');
      }
    } catch {
      showToast('Failed to dispatch test notification');
    }
  };

  const getCategoryIcon = (category: NotificationCategory, priority?: string) => {
    switch (category) {
      case 'messages':
        return <MessageSquare className="w-5 h-5 text-[#05A222]" />;
      case 'campaigns':
        return <Send className="w-5 h-5 text-[#E11D48]" />;
      case 'whatsapp':
        return <Smartphone className="w-5 h-5 text-[#0891B2]" />;
      case 'ai':
        return <Bot className="w-5 h-5 text-[#9333EA]" />;
      case 'billing':
        return <CreditCard className="w-5 h-5 text-[#D97706]" />;
      case 'security':
        return <ShieldAlert className="w-5 h-5 text-[#DC2626]" />;
      default:
        return priority === 'urgent' ? (
          <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
        ) : (
          <Sparkles className="w-5 h-5 text-[#05A222]" />
        );
    }
  };

  const getCategoryBadgeColor = (category: NotificationCategory) => {
    switch (category) {
      case 'messages':
        return 'bg-[#E9F9EE] text-[#006736] border-[#C4EBD0]';
      case 'campaigns':
        return 'bg-[#FFF1F2] text-[#BE123C] border-[#FFE4E6]';
      case 'whatsapp':
        return 'bg-[#ECFEFF] text-[#0E7490] border-[#CFFAFE]';
      case 'ai':
        return 'bg-[#FAF5FF] text-[#7E22CE] border-[#F3E8FF]';
      case 'billing':
        return 'bg-[#FFFBEB] text-[#B45309] border-[#FEF3C7]';
      case 'security':
        return 'bg-[#FEF2F2] text-[#B91C1C] border-[#FEE2E2]';
      default:
        return 'bg-[#F6FAF8] text-[#5F7069] border-[#E2EAE6]';
    }
  };

  const getPriorityBadge = (priority: NotificationPriority) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2] text-[11px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse" />
            URGENT
          </span>
        );
      case 'high':
        return (
          <span className="bg-[#FFFBEB] text-[#D97706] border border-[#FEF3C7] text-[11px] font-bold px-2 py-0.5 rounded-md">
            HIGH
          </span>
        );
      case 'low':
        return (
          <span className="bg-[#F6FAF8] text-[#8A9993] border border-[#E2EAE6] text-[11px] font-semibold px-2 py-0.5 rounded-md">
            LOW
          </span>
        );
      default:
        return (
          <span className="bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] text-[11px] font-semibold px-2 py-0.5 rounded-md">
            MEDIUM
          </span>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#14201C] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-[#05A222]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2EAE6] shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#E9F9EE] text-[#006736] flex items-center justify-center border border-[#C4EBD0]">
              <Bell className="w-5 h-5 text-[#05A222]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-[#14201C]">Notification Center</h1>
                {unreadCount > 0 && (
                  <span className="bg-[#E9F9EE] text-[#006736] text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-[#C4EBD0]">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5F7069] mt-0.5">
                Real-time alert inbox for incoming messages, broadcasts, AI handoffs, and system events.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => fetchNotifications(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#5F7069] bg-[#F6FAF8] hover:bg-[#E2EAE6] transition-colors cursor-pointer border border-[#E2EAE6]"
          >
            <RefreshCw className={clsx('w-3.5 h-3.5', refreshing && 'animate-spin')} />
            <span>Refresh</span>
          </button>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#006736] bg-[#E9F9EE] hover:bg-[#D9F3E2] transition-colors cursor-pointer border border-[#C4EBD0]"
            >
              <CheckCheck className="w-4 h-4 text-[#05A222]" />
              <span>Mark All Read</span>
            </button>
          )}

          <button
            onClick={() => setShowTestModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#05A222] hover:bg-[#006736] transition-colors cursor-pointer shadow-xs active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Send Test Alert</span>
          </button>

          <button
            onClick={() => setShowPreferencesModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#14201C] bg-white hover:bg-[#F6FAF8] transition-colors cursor-pointer border border-[#E2EAE6]"
          >
            <Settings2 className="w-4 h-4 text-[#5F7069]" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Unread',
            value: unreadCount,
            icon: Bell,
            color: '#05A222',
            bg: '#E9F9EE',
          },
          {
            label: 'Messages & WhatsApp',
            value: (categoryStats['messages'] || 0) + (categoryStats['whatsapp'] || 0),
            icon: MessageSquare,
            color: '#0891B2',
            bg: '#ECFEFF',
          },
          {
            label: 'Campaign Updates',
            value: categoryStats['campaigns'] || 0,
            icon: Send,
            color: '#E11D48',
            bg: '#FFF1F2',
          },
          {
            label: 'AI Handoffs & Alerts',
            value: (categoryStats['ai'] || 0) + (categoryStats['system'] || 0),
            icon: Bot,
            color: '#9333EA',
            bg: '#FAF5FF',
          },
        ].map((m, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-2xl border border-[#E2EAE6] flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-medium text-[#8A9993]">{m.label}</p>
              <h3 className="text-xl font-black text-[#14201C] mt-1">{m.value}</h3>
            </div>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: m.bg }}
            >
              <m.icon className="w-5 h-5" style={{ color: m.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2EAE6] space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'messages', label: 'Messages', count: categoryStats['messages'] },
            { id: 'campaigns', label: 'Campaigns', count: categoryStats['campaigns'] },
            { id: 'whatsapp', label: 'WhatsApp', count: categoryStats['whatsapp'] },
            { id: 'ai', label: 'AI Agents', count: categoryStats['ai'] },
            { id: 'billing', label: 'Billing', count: categoryStats['billing'] },
            { id: 'system', label: 'System', count: categoryStats['system'] },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setPage(1);
              }}
              className={clsx(
                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
                selectedCategory === cat.id
                  ? 'bg-[#05A222] text-white shadow-xs'
                  : 'bg-[#F6FAF8] text-[#5F7069] hover:bg-[#E2EAE6] hover:text-[#14201C] border border-[#E2EAE6]'
              )}
            >
              <span>{cat.label}</span>
              {cat.count !== undefined && cat.count > 0 && (
                <span
                  className={clsx(
                    'text-[10px] px-1.5 py-0.2 rounded-full font-extrabold',
                    selectedCategory === cat.id
                      ? 'bg-white/20 text-white'
                      : 'bg-[#E9F9EE] text-[#006736]'
                  )}
                >
                  {cat.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Secondary Filter Row: Read Status, Priority, Search, Clear Read */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-[#E2EAE6]">
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Read Filter */}
            <div className="flex items-center bg-[#F6FAF8] p-1 rounded-xl border border-[#E2EAE6] text-xs">
              {[
                { id: 'all', label: 'All' },
                { id: 'unread', label: 'Unread' },
                { id: 'read', label: 'Read' },
              ].map((rf) => (
                <button
                  key={rf.id}
                  onClick={() => {
                    setFilterRead(rf.id);
                    setPage(1);
                  }}
                  className={clsx(
                    'px-3 py-1 rounded-lg font-bold transition-all cursor-pointer',
                    filterRead === rf.id
                      ? 'bg-white text-[#14201C] shadow-xs'
                      : 'text-[#5F7069] hover:text-[#14201C]'
                  )}
                >
                  {rf.label}
                </button>
              ))}
            </div>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => {
                setSelectedPriority(e.target.value);
                setPage(1);
              }}
              className="bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl px-3 py-1.5 text-xs font-bold text-[#14201C] focus:outline-none focus:border-[#05A222] cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A9993]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search alerts..."
                className="w-full bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#14201C] placeholder-[#8A9993] focus:outline-none focus:border-[#05A222]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A9993] hover:text-[#14201C]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              onClick={handleClearAllRead}
              title="Clear read history"
              className="p-2 rounded-xl text-[#8A9993] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors border border-transparent hover:border-[#FEE2E2] cursor-pointer shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Notification Cards List */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-2xl border border-[#E2EAE6] p-12 text-center flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#05A222]" />
            <p className="text-sm font-semibold text-[#5F7069]">Loading notification stream...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2EAE6] p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-3xl bg-[#E9F9EE] text-[#05A222] flex items-center justify-center mb-4 border border-[#C4EBD0]">
              <Bell className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-[#14201C]">No notifications found</h3>
            <p className="text-xs text-[#8A9993] max-w-sm mt-1">
              There are no notifications matching your current filter criteria. New real-time alerts will appear automatically.
            </p>
            <button
              onClick={() => setShowTestModal(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#05A222] text-white text-xs font-bold rounded-xl hover:bg-[#006736] transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Sample Alert</span>
            </button>
          </div>
        ) : (
          notifications.map((item) => {
            const id = item.id || item._id!;
            return (
              <div
                key={id}
                className={clsx(
                  'bg-white rounded-2xl border transition-all hover:shadow-xs p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group',
                  !item.isRead
                    ? 'border-[#C4EBD0] bg-gradient-to-r from-[#F9FCFA] to-white shadow-[0_2px_12px_rgba(5,162,34,0.04)]'
                    : 'border-[#E2EAE6] opacity-90'
                )}
              >
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  {/* Category Badge Icon */}
                  <div
                    className={clsx(
                      'w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border mt-0.5',
                      getCategoryBadgeColor(item.category)
                    )}
                  >
                    {getCategoryIcon(item.category, item.priority)}
                  </div>

                  {/* Body Details */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={clsx(
                          'text-sm',
                          !item.isRead ? 'font-black text-[#14201C]' : 'font-bold text-[#5F7069]'
                        )}
                      >
                        {item.title}
                      </h4>

                      <span
                        className={clsx(
                          'text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border',
                          getCategoryBadgeColor(item.category)
                        )}
                      >
                        {item.category}
                      </span>

                      {getPriorityBadge(item.priority)}

                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#05A222] ring-2 ring-[#C4EBD0]" />
                      )}
                    </div>

                    <p className="text-xs text-[#5F7069] leading-relaxed break-words">
                      {item.message}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-[#8A9993] pt-1">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        {formatDate(item.createdAt)}
                      </span>

                      {item.isRead && item.readAt && (
                        <span className="flex items-center gap-1 text-[#05A222] font-semibold">
                          <CheckCheck className="w-3.5 h-3.5" />
                          Read
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E2EAE6]">
                  {item.actionUrl && (
                    <button
                      onClick={() => navigate(item.actionUrl!)}
                      className="flex items-center gap-1 text-xs font-bold text-[#05A222] bg-[#E9F9EE] hover:bg-[#D9F3E2] px-3.5 py-2 rounded-xl transition-colors cursor-pointer border border-[#C4EBD0]"
                    >
                      <span>Open Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {!item.isRead ? (
                    <button
                      onClick={() => handleMarkAsRead(item)}
                      title="Mark as read"
                      className="p-2 rounded-xl text-[#5F7069] hover:text-[#05A222] hover:bg-[#E9F9EE] transition-colors cursor-pointer"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  ) : null}

                  <button
                    onClick={() => handleDelete(id)}
                    title="Delete notification"
                    className="p-2 rounded-xl text-[#8A9993] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="bg-white p-4 rounded-2xl border border-[#E2EAE6] flex items-center justify-between text-xs font-semibold text-[#5F7069]">
          <div>
            Showing <span className="text-[#14201C] font-bold">{notifications.length}</span> of{' '}
            <span className="text-[#14201C] font-bold">{totalCount}</span> notifications
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-[#E2EAE6] hover:bg-[#F6FAF8] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>
              Page <span className="text-[#14201C] font-bold">{page}</span> of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-[#E2EAE6] hover:bg-[#F6FAF8] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showPreferencesModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E2EAE6] animate-in zoom-in-95 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2EAE6]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E9F9EE] text-[#05A222] flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#14201C]">Notification Settings</h3>
                  <p className="text-xs text-[#8A9993]">Configure alert delivery channels and sound</p>
                </div>
              </div>
              <button
                onClick={() => setShowPreferencesModal(false)}
                className="p-1.5 text-[#8A9993] hover:text-[#14201C] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Channels */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-[#8A9993] uppercase tracking-wider">
                Delivery Channels
              </h4>

              <div className="space-y-2">
                {/* In App */}
                <label className="flex items-center justify-between p-3 rounded-xl bg-[#F6FAF8] border border-[#E2EAE6] cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-[#14201C] block">In-App Live Alerts</span>
                    <span className="text-[11px] text-[#5F7069]">Show badge and real-time popups inside workspace</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.inAppNotifications}
                    onChange={(e) =>
                      setPreferences((p) => ({ ...p, inAppNotifications: e.target.checked }))
                    }
                    className="w-4 h-4 accent-[#05A222] rounded cursor-pointer"
                  />
                </label>

                {/* Sound Chime */}
                <label className="flex items-center justify-between p-3 rounded-xl bg-[#F6FAF8] border border-[#E2EAE6] cursor-pointer">
                  <div className="flex items-center gap-2">
                    {preferences.soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-[#05A222]" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-[#8A9993]" />
                    )}
                    <div>
                      <span className="text-xs font-bold text-[#14201C] block">Audio Chime Sound</span>
                      <span className="text-[11px] text-[#5F7069]">Play crystal chime when new alert arrives</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        playNotificationSound();
                      }}
                      className="text-[10px] font-bold text-[#05A222] bg-[#E9F9EE] px-2 py-1 rounded-md border border-[#C4EBD0] hover:bg-[#D9F3E2]"
                    >
                      Test Chime
                    </button>
                    <input
                      type="checkbox"
                      checked={preferences.soundEnabled}
                      onChange={(e) =>
                        setPreferences((p) => ({ ...p, soundEnabled: e.target.checked }))
                      }
                      className="w-4 h-4 accent-[#05A222] rounded cursor-pointer"
                    />
                  </div>
                </label>

                {/* Browser Push */}
                <div className="p-3 rounded-xl bg-[#F6FAF8] border border-[#E2EAE6] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#14201C] block">Browser Desktop Push</span>
                    <span className="text-[11px] text-[#5F7069]">
                      Permission:{' '}
                      <span
                        className={clsx(
                          'font-bold uppercase',
                          browserPermission === 'granted' ? 'text-[#05A222]' : 'text-[#D97706]'
                        )}
                      >
                        {browserPermission}
                      </span>
                    </span>
                  </div>
                  {browserPermission !== 'granted' ? (
                    <button
                      type="button"
                      onClick={handleRequestPushPermission}
                      className="text-xs font-bold text-white bg-[#05A222] hover:bg-[#006736] px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                    >
                      Enable Push
                    </button>
                  ) : (
                    <input
                      type="checkbox"
                      checked={preferences.pushNotifications}
                      onChange={(e) =>
                        setPreferences((p) => ({ ...p, pushNotifications: e.target.checked }))
                      }
                      className="w-4 h-4 accent-[#05A222] rounded cursor-pointer"
                    />
                  )}
                </div>

                {/* Email */}
                <label className="flex items-center justify-between p-3 rounded-xl bg-[#F6FAF8] border border-[#E2EAE6] cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-[#14201C] block">Email Digests & Critical Alerts</span>
                    <span className="text-[11px] text-[#5F7069]">Send urgent alerts to account email address</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={(e) =>
                      setPreferences((p) => ({ ...p, emailNotifications: e.target.checked }))
                    }
                    className="w-4 h-4 accent-[#05A222] rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Category Toggles */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-[#8A9993] uppercase tracking-wider">
                Category Subscriptions
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'messages', label: 'Incoming Messages' },
                  { key: 'campaigns', label: 'Campaign Status' },
                  { key: 'whatsapp', label: 'WhatsApp Health' },
                  { key: 'ai', label: 'AI Handoffs' },
                  { key: 'billing', label: 'Billing & Quota' },
                  { key: 'security', label: 'Security Alerts' },
                ].map((cat) => (
                  <label
                    key={cat.key}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F6FAF8] border border-[#E2EAE6] text-xs font-bold text-[#14201C] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={preferences.categories[cat.key as keyof typeof preferences.categories]}
                      onChange={(e) =>
                        setPreferences((p) => ({
                          ...p,
                          categories: { ...p.categories, [cat.key]: e.target.checked },
                        }))
                      }
                      className="w-3.5 h-3.5 accent-[#05A222] rounded"
                    />
                    <span>{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E2EAE6]">
              <button
                type="button"
                onClick={() => setShowPreferencesModal(false)}
                className="px-4 py-2 text-xs font-bold text-[#5F7069] hover:bg-[#F6FAF8] rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePreferences}
                className="px-5 py-2 text-xs font-bold text-white bg-[#05A222] hover:bg-[#006736] rounded-xl shadow-xs"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Test Alert Modal */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E2EAE6] animate-in zoom-in-95 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2EAE6]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FAF5FF] text-[#9333EA] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#14201C]">Dispatch Test Notification</h3>
                  <p className="text-xs text-[#8A9993]">Test live audio chime, socket broadcast, and banner</p>
                </div>
              </div>
              <button
                onClick={() => setShowTestModal(false)}
                className="p-1.5 text-[#8A9993] hover:text-[#14201C] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendTestNotification} className="space-y-4">
              {/* Preset Selector */}
              <div>
                <label className="text-xs font-bold text-[#14201C] block mb-1.5">Quick Presets</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      label: 'Customer Message',
                      type: 'NEW_MESSAGE',
                      category: 'messages',
                      priority: 'high',
                      title: 'Incoming Customer Lead Reply',
                      message: 'Sarah: "Hi! I want to confirm our appointment for tomorrow."',
                      actionUrl: '/inbox',
                    },
                    {
                      label: 'Campaign Success',
                      type: 'CAMPAIGN_COMPLETED',
                      category: 'campaigns',
                      priority: 'medium',
                      title: 'Flash Sale Broadcast Completed',
                      message: '1,450 WhatsApp messages sent with 99.1% delivery rate.',
                      actionUrl: '/campaigns',
                    },
                    {
                      label: 'AI Handoff',
                      type: 'AI_HANDOFF',
                      category: 'ai',
                      priority: 'urgent',
                      title: 'AI Human Takeover Request',
                      message: 'Customer requested human assistance regarding custom invoice.',
                      actionUrl: '/ai/handoff',
                    },
                    {
                      label: 'WhatsApp Status',
                      type: 'WHATSAPP_CONNECTED',
                      category: 'whatsapp',
                      priority: 'low',
                      title: 'WhatsApp Channel Reconnected',
                      message: 'Number +1 (555) 019-2831 is now online and receiving webhooks.',
                      actionUrl: '/whatsapp/numbers',
                    },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setTestForm({
                          title: preset.title,
                          message: preset.message,
                          type: preset.type as any,
                          category: preset.category as any,
                          priority: preset.priority as any,
                          actionUrl: preset.actionUrl,
                        })
                      }
                      className="p-2.5 rounded-xl border border-[#E2EAE6] text-left hover:bg-[#F6FAF8] hover:border-[#05A222] transition-colors cursor-pointer"
                    >
                      <span className="text-xs font-bold text-[#14201C] block">{preset.label}</span>
                      <span className="text-[10px] text-[#8A9993] uppercase font-semibold">{preset.category}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-bold text-[#14201C] block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={testForm.title}
                  onChange={(e) => setTestForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl px-3.5 py-2 text-xs text-[#14201C] focus:outline-none focus:border-[#05A222]"
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-bold text-[#14201C] block mb-1">Message Body</label>
                <textarea
                  required
                  rows={2}
                  value={testForm.message}
                  onChange={(e) => setTestForm((f) => ({ ...f, message: e.target.value }))}
                  className="w-full bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl px-3.5 py-2 text-xs text-[#14201C] focus:outline-none focus:border-[#05A222]"
                />
              </div>

              {/* Category & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#14201C] block mb-1">Category</label>
                  <select
                    value={testForm.category}
                    onChange={(e) => setTestForm((f) => ({ ...f, category: e.target.value as any }))}
                    className="w-full bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl px-3 py-2 text-xs text-[#14201C] focus:outline-none focus:border-[#05A222]"
                  >
                    <option value="messages">Messages</option>
                    <option value="campaigns">Campaigns</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="ai">AI Agents</option>
                    <option value="billing">Billing</option>
                    <option value="system">System</option>
                    <option value="security">Security</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#14201C] block mb-1">Priority</label>
                  <select
                    value={testForm.priority}
                    onChange={(e) => setTestForm((f) => ({ ...f, priority: e.target.value as any }))}
                    className="w-full bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl px-3 py-2 text-xs text-[#14201C] focus:outline-none focus:border-[#05A222]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {/* Action URL */}
              <div>
                <label className="text-xs font-bold text-[#14201C] block mb-1">Action Link URL</label>
                <input
                  type="text"
                  value={testForm.actionUrl}
                  onChange={(e) => setTestForm((f) => ({ ...f, actionUrl: e.target.value }))}
                  placeholder="/inbox or /campaigns"
                  className="w-full bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl px-3.5 py-2 text-xs text-[#14201C] focus:outline-none focus:border-[#05A222]"
                />
              </div>

              {/* Submit */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2EAE6]">
                <button
                  type="button"
                  onClick={() => setShowTestModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#5F7069] hover:bg-[#F6FAF8] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#05A222] hover:bg-[#006736] rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Zap className="w-4 h-4" />
                  <span>Dispatch Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
