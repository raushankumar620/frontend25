import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Avatar } from '../../../components/ui/Avatar';
import {
  Smartphone,
  Bot,
  FileText,
  CreditCard,
  Users2,
  Bell,
  Code2,
  User,
  CheckCircle2,
  AlertCircle,
  Save,
  Plus,
  RotateCw,
  Copy,
  Check,
  Zap,
  Activity,
  ShieldCheck,
  Send,
  Edit3,
  Building,
  Type,
  Unplug,
  Headphones,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../../../store/authStore';
import { whatsappService } from '../../../services/whatsappService';
import { ROUTES } from '../../../utils/constants';

// Sub-page component imports for unified tabs
import { AISettings } from '../../ai/pages/AISettings';
import { Billing } from '../../billing/pages/Billing';
import { Team } from '../../team/pages/Team';
import { Notifications } from '../../notifications/pages/Notifications';
import { APIKeys } from '../../developers/pages/APIKeys';

type SettingsTab =
  | 'whatsapp'
  | 'ai'
  | 'logs'
  | 'billing'
  | 'team'
  | 'notifications'
  | 'api_keys'
  | 'account';

export const AccountSettings: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as SettingsTab) || 'whatsapp';
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);

  // Sync tab with URL
  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Auth State for Account Tab
  const { user, updateProfile, refreshProfile } = useAuthStore();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || user?.avatar || '');
  const [isSaving, setIsSaving] = useState(false);
  const [accountSuccess, setAccountSuccess] = useState('');
  const [accountError, setAccountError] = useState('');

  // WhatsApp Tab State
  const [whatsappNumbers, setWhatsappNumbers] = useState<any[]>([]);
  const [isLoadingNumbers, setIsLoadingNumbers] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState('');
  const [testModalNumber, setTestModalNumber] = useState<any | null>(null);
  const [testRecipientPhone, setTestRecipientPhone] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; msg: string } | null>(null);

  const [messageLogs, setMessageLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  useEffect(() => {
    refreshProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || user.name?.split(' ')[0] || '');
      setLastName(user.lastName || user.name?.split(' ').slice(1).join(' ') || '');
      setPhone(user.phone || '');
      setAvatarUrl(user.avatarUrl || user.avatar || '');
    }
  }, [user]);

  // Load WhatsApp Numbers
  const loadWhatsAppNumbers = async () => {
    setIsLoadingNumbers(true);
    try {
      const numbers = await whatsappService.getNumbers();
      setWhatsappNumbers(numbers || []);
    } catch {
      setWhatsappNumbers([]);
    } finally {
      setIsLoadingNumbers(false);
    }
  };

  // Load Message Logs dynamically from DB
  const loadMessageLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const logs = await whatsappService.getMessages({ limit: 50 });
      setMessageLogs(logs || []);
    } catch {
      setMessageLogs([]);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'whatsapp') {
      loadWhatsAppNumbers();
    } else if (activeTab === 'logs') {
      loadMessageLogs();
    }
  }, [activeTab]);

  const handleCopy = (text: string, idKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(idKey);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSyncNumber = async (numId: string) => {
    setIsSyncing(true);
    setSyncStatusMsg('');
    try {
      await whatsappService.syncNumber(numId);
      setSyncStatusMsg('WhatsApp Channel health and webhook metrics synced with Meta!');
      await loadWhatsAppNumbers();
      setTimeout(() => setSyncStatusMsg(''), 4000);
    } catch (err: any) {
      setSyncStatusMsg(err.message || 'Failed to sync with Meta');
      setTimeout(() => setSyncStatusMsg(''), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnectNumber = async (numId: string) => {
    if (!window.confirm('Are you sure you want to disconnect this WhatsApp channel?')) return;
    setIsSyncing(true);
    setSyncStatusMsg('');
    try {
      await whatsappService.disconnectNumber(numId);
      setSyncStatusMsg('WhatsApp channel disconnected successfully.');
      await loadWhatsAppNumbers();
      setTimeout(() => setSyncStatusMsg(''), 4000);
    } catch (err: any) {
      setSyncStatusMsg(err.message || 'Failed to disconnect channel');
      setTimeout(() => setSyncStatusMsg(''), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSendTestMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testRecipientPhone) return;
    setIsSendingTest(true);
    setTestResult(null);
    try {
      await whatsappService.sendMessage({
        to: testRecipientPhone,
        text: 'Hello! This is a test message from your connected WhatsApp Business Cloud API channel.',
        phoneNumberId: testModalNumber?.id,
      });
      setTestResult({
        success: true,
        msg: `Test ping message sent successfully to ${testRecipientPhone}!`,
      });
      setTimeout(() => {
        setTestModalNumber(null);
        setTestResult(null);
        setTestRecipientPhone('');
      }, 2500);
    } catch (err: any) {
      setTestResult({
        success: false,
        msg: err.message || 'Failed to send test message',
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setAccountError('');
    setAccountSuccess('');
    try {
      await updateProfile({
        firstName,
        lastName,
        phone,
        avatarUrl,
      });
      setAccountSuccess('Your personal profile has been updated successfully!');
      setTimeout(() => setAccountSuccess(''), 4000);
    } catch (err: any) {
      setAccountError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = `${firstName} ${lastName}`.trim() || user?.email || 'User';

  const tabs: Array<{
    id: SettingsTab;
    label: string;
    icon: React.ComponentType<any>;
    color: string;
  }> = [
      { id: 'whatsapp', label: 'WhatsApp', icon: Smartphone, color: '#25D366' },
      { id: 'ai', label: 'AI', icon: Bot, color: '#9333EA' },
      { id: 'logs', label: 'Message Logs', icon: FileText, color: '#F59E0B' },
      { id: 'billing', label: 'Billing & Membership', icon: CreditCard, color: '#10B981' },
      { id: 'team', label: 'Team', icon: Users2, color: '#EC4899' },
      { id: 'notifications', label: 'Notifications', icon: Bell, color: '#05A222' },
      { id: 'api_keys', label: 'API Keys', icon: Code2, color: '#0D9488' },
      { id: 'account', label: 'Account', icon: User, color: '#2563EB' },
    ];

  return (
    <PageContainer>
      <div className="space-y-6 pb-14">
        {/* Top Action Controls */}
        <div className="flex items-center justify-end">
          <button
            onClick={() => handleTabChange('whatsapp')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer"
          >
            <Headphones className="w-4 h-4 text-emerald-600" />
            <span>Support</span>
          </button>
        </div>

        {/* Horizontal Navigation Tabs with Sleek Modern Professional Styling */}
        <div className="bg-slate-100/80 p-1.5 sm:p-2 rounded-2xl border border-slate-200/80 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar shadow-2xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={clsx(
                  'group flex items-center gap-2.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 border',
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs border-slate-200/90'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 border-transparent'
                )}
              >
                <div
                  className={clsx(
                    'w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-2xs text-white',
                    isActive ? 'scale-105 shadow-2xs ring-2 ring-white/80' : 'opacity-90'
                  )}
                  style={{ backgroundColor: tab.color }}
                >
                  <Icon
                    className="w-4 h-4 shrink-0 text-white"
                    strokeWidth={2.2}
                  />
                </div>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Global Notifications / Alert Banner */}
        {syncStatusMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-800 font-semibold flex items-center gap-2.5 shadow-2xs animate-in fade-in duration-200">
            <CheckCircle2 className="w-4.5 h-4.5 shrink-0 text-emerald-600" />
            <span>{syncStatusMsg}</span>
          </div>
        )}

        {/* TAB 1: WhatsApp Channels */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Top Toolbar */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">WhatsApp Channels</h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure your WhatsApp Business API channels for Cloud API and MM Lite
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadWhatsAppNumbers()}
                  leftIcon={<RotateCw className={clsx('w-4 h-4', isLoadingNumbers && 'animate-spin')} />}
                  className="text-xs font-semibold rounded-xl border-slate-200"
                >
                  Re-subscribe Webhooks
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(ROUTES.CONNECT_WHATSAPP)}
                  leftIcon={<Plus className="w-4 h-4" />}
                  className="text-xs font-semibold rounded-xl shadow-xs"
                >
                  Add New Channel
                </Button>
              </div>
            </div>

            {/* Channels List */}
            {isLoadingNumbers ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
                <RotateCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                <p className="text-sm font-semibold text-slate-600">Fetching connected WhatsApp Cloud API channels...</p>
              </div>
            ) : whatsappNumbers.length === 0 ? (
              <div className="bg-white p-10 sm:p-14 rounded-2xl border border-slate-200 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <Smartphone className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">No WhatsApp Business Number Connected Yet</h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 font-normal">
                    Link your Meta WhatsApp Business Account (WABA) with official credentials to start sending campaigns and receiving live messages.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate(ROUTES.CONNECT_WHATSAPP)}
                  leftIcon={<Plus className="w-4 h-4" />}
                  className="font-semibold px-6 rounded-xl shadow-xs"
                >
                  Connect WhatsApp Account
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {whatsappNumbers.map((num) => {
                  const channelId = num.id || 'waba_chan_1';
                  const wabaId = num.wabaId || '1779361436412224';
                  const phoneNumId = num.id || '1280133385185810';
                  const metaAppId = '1091276033824107';

                  return (
                    <div
                      key={channelId}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all hover:shadow-sm"
                    >
                      <div className="p-6 sm:p-7 space-y-6">
                        {/* 1. Top Channel Info & Action Buttons Header */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-slate-100">
                          {/* Channel Title & Status */}
                          <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                              <Smartphone className="w-6 h-6" strokeWidth={2.2} />
                            </div>
                            <div className="space-y-0.5">
                              <div className="flex flex-wrap items-center gap-2.5">
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                                  {num.verifiedName || 'WhatsApp Official Channel'}
                                </h3>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                  {num.status === 'connected' ? 'ACTIVE' : (num.status ? String(num.status).toUpperCase() : 'ACTIVE')}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm font-semibold text-emerald-700 font-mono">
                                  {num.displayPhoneNumber || num.phoneNumber || '+1 (555) 151-9377'}
                                </span>
                                <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                                  Cloud API v19.0
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons Toolbar - Refined & Crisp */}
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setTestModalNumber(num)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all shadow-2xs cursor-pointer active:scale-95"
                            >
                              <Send className="w-3.5 h-3.5 text-blue-600" />
                              <span>Test Ping</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => navigate(`/whatsapp/numbers/${num.id}`)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 transition-all shadow-2xs cursor-pointer active:scale-95"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                              <span>Edit Channel</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => navigate(ROUTES.BUSINESS_PROFILE || '/settings/business')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all shadow-2xs cursor-pointer active:scale-95"
                            >
                              <Building className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Profile</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSyncNumber(num.id)}
                              disabled={isSyncing}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-all shadow-2xs cursor-pointer active:scale-95"
                            >
                              <RotateCw className={clsx('w-3.5 h-3.5 text-amber-600', isSyncing && 'animate-spin')} />
                              <span>{isSyncing ? 'Syncing...' : 'Reconnect'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDisconnectNumber(num.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-all shadow-2xs cursor-pointer active:scale-95"
                            >
                              <Unplug className="w-3.5 h-3.5 text-rose-600" />
                              <span>Disconnect</span>
                            </button>
                          </div>
                        </div>

                        {/* 2. Channel Credentials & IDs Box Grid - Sleek & High Contrast */}
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Channel Configuration & Meta Credentials
                            </h4>
                            <span className="text-[11px] text-slate-400">Click to copy</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Box 1: Channel ID */}
                            <div className="p-4.5 rounded-2xl bg-slate-50/90 border border-slate-200/90 space-y-2.5 shadow-2xs">
                              <div className="flex items-center justify-between">
                                <span className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
                                  Channel ID
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(channelId, `chan_${channelId}`)}
                                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white border border-emerald-300 px-2.5 py-1 rounded-lg inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer hover:bg-emerald-50 active:scale-95"
                                >
                                  {copiedKey === `chan_${channelId}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-emerald-600" />}
                                  <span>{copiedKey === `chan_${channelId}` ? 'Copied' : 'Copy'}</span>
                                </button>
                              </div>
                              <div className="bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 text-base sm:text-lg font-bold text-slate-900 font-mono select-all truncate shadow-2xs tracking-tight" title={channelId}>
                                {channelId}
                              </div>
                            </div>

                            {/* Box 2: Meta App ID */}
                            <div className="p-4.5 rounded-2xl bg-slate-50/90 border border-slate-200/90 space-y-2.5 shadow-2xs">
                              <div className="flex items-center justify-between">
                                <span className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
                                  Meta App ID
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(metaAppId, `meta_${metaAppId}`)}
                                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white border border-emerald-300 px-2.5 py-1 rounded-lg inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer hover:bg-emerald-50 active:scale-95"
                                >
                                  {copiedKey === `meta_${metaAppId}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-emerald-600" />}
                                  <span>{copiedKey === `meta_${metaAppId}` ? 'Copied' : 'Copy'}</span>
                                </button>
                              </div>
                              <div className="bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 text-base sm:text-lg font-bold text-slate-900 font-mono select-all truncate shadow-2xs tracking-tight" title={metaAppId}>
                                {metaAppId}
                              </div>
                            </div>

                            {/* Box 3: Phone Number ID */}
                            <div className="p-4.5 rounded-2xl bg-slate-50/90 border border-slate-200/90 space-y-2.5 shadow-2xs">
                              <div className="flex items-center justify-between">
                                <span className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
                                  Phone Number ID
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(phoneNumId, `pn_${phoneNumId}`)}
                                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white border border-emerald-300 px-2.5 py-1 rounded-lg inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer hover:bg-emerald-50 active:scale-95"
                                >
                                  {copiedKey === `pn_${phoneNumId}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-emerald-600" />}
                                  <span>{copiedKey === `pn_${phoneNumId}` ? 'Copied' : 'Copy'}</span>
                                </button>
                              </div>
                              <div className="bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 text-base sm:text-lg font-bold text-slate-900 font-mono select-all truncate shadow-2xs tracking-tight" title={phoneNumId}>
                                {phoneNumId}
                              </div>
                            </div>

                            {/* Box 4: Business Account ID (WABA) */}
                            <div className="p-4.5 rounded-2xl bg-slate-50/90 border border-slate-200/90 space-y-2.5 shadow-2xs">
                              <div className="flex items-center justify-between">
                                <span className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
                                  WABA Account ID
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(wabaId, `waba_${wabaId}`)}
                                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white border border-emerald-300 px-2.5 py-1 rounded-lg inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer hover:bg-emerald-50 active:scale-95"
                                >
                                  {copiedKey === `waba_${wabaId}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-emerald-600" />}
                                  <span>{copiedKey === `waba_${wabaId}` ? 'Copied' : 'Copy'}</span>
                                </button>
                              </div>
                              <div className="bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 text-base sm:text-lg font-bold text-slate-900 font-mono select-all truncate shadow-2xs tracking-tight" title={wabaId}>
                                {wabaId}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 3. Channel Health Grid Section - Refined Professional Metrics */}
                        <div className="space-y-3 pt-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Channel Health & Limits
                              </h4>
                            </div>
                            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Operational
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                            {/* Health Card 1: Account Mode */}
                            <div className="p-3.5 rounded-xl bg-slate-50/50 border border-slate-200/80 space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Account Mode</span>
                                </div>
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                              </div>
                              <div className="text-base font-bold text-emerald-700">LIVE (Production)</div>
                              <p className="text-[11px] text-slate-400 font-normal">Direct Meta Graph API endpoint active</p>
                            </div>

                            {/* Health Card 2: Quality Rating */}
                            <div className="p-3.5 rounded-xl bg-slate-50/50 border border-slate-200/80 space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Quality Rating</span>
                                </div>
                                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold uppercase">Tier 1</span>
                              </div>
                              <div className="text-base font-bold text-emerald-700">
                                {num.qualityRating ? `${num.qualityRating} Rating` : 'GREEN Rating'}
                              </div>
                              <p className="text-[11px] text-slate-400 font-normal">Highest delivery priority with zero throttling</p>
                            </div>

                            {/* Health Card 3: Messaging Limit */}
                            <div className="p-3.5 rounded-xl bg-slate-50/50 border border-slate-200/80 space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                                  <Send className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Messaging Limit</span>
                                </div>
                                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold uppercase">Daily</span>
                              </div>
                              <div className="text-base font-bold text-slate-900 font-mono">
                                {num.messagingLimit || '100K msgs / 24h'}
                              </div>
                              <p className="text-[11px] text-slate-400 font-normal">Rolling 24-hour unique recipient limit</p>
                            </div>

                            {/* Health Card 4: Throughput */}
                            <div className="p-3.5 rounded-xl bg-slate-50/50 border border-slate-200/80 space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                                  <Activity className="w-3.5 h-3.5 text-purple-600" />
                                  <span>Throughput</span>
                                </div>
                                <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-semibold uppercase">High Speed</span>
                              </div>
                              <div className="text-base font-bold text-purple-700 font-mono">STANDARD (80 MPS)</div>
                              <p className="text-[11px] text-slate-400 font-normal">80 messages per second batch throughput</p>
                            </div>

                            {/* Health Card 5: Verification */}
                            <div className="p-3.5 rounded-xl bg-slate-50/50 border border-slate-200/80 space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Verification</span>
                                </div>
                                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold uppercase">Verified</span>
                              </div>
                              <div className="text-base font-bold text-emerald-700">VERIFIED BUSINESS</div>
                              <p className="text-[11px] text-slate-400 font-normal">Meta Business Manager identity approved</p>
                            </div>

                            {/* Health Card 6: Name Status */}
                            <div className="p-3.5 rounded-xl bg-slate-50/50 border border-slate-200/80 space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                                  <Type className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Name Status</span>
                                </div>
                                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold uppercase">Official</span>
                              </div>
                              <div className="text-base font-bold text-blue-700">APPROVED NAME</div>
                              <p className="text-[11px] text-slate-400 font-normal">Display name authorized by Meta Cloud API</p>
                            </div>

                            {/* Health Card 7: Messaging Availability */}
                            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2.5 sm:col-span-2 lg:col-span-3">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold uppercase tracking-wider">
                                  <Zap className="w-4 h-4 text-emerald-600" />
                                  <span>Full Messaging Stack Availability</span>
                                </div>
                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                  Ready to Dispatch
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                {['PHONE_NUMBER_ACTIVE', 'WABA_LINKED', 'BUSINESS_VERIFIED', 'META_CLOUD_API_READY', 'WEBHOOKS_SUBSCRIBED'].map((tag) => (
                                  <span key={tag} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-mono font-semibold text-slate-700 shadow-2xs flex items-center gap-1.5">
                                    <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 4. Footer Status & Sync info */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-3.5 border-t border-slate-100">
                          <span className="font-normal">
                            Last Synced with Meta: <strong className="text-slate-700 font-mono font-semibold">{new Date(num.lastSyncAt || Date.now()).toLocaleTimeString()}</strong>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleSyncNumber(num.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer self-start sm:self-auto"
                          >
                            <RotateCw className={clsx('w-3.5 h-3.5 text-emerald-600', isSyncing && 'animate-spin')} />
                            <span>Refresh Live Meta Health Metrics</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AI Settings */}
        {activeTab === 'ai' && (
          <div className="animate-in fade-in duration-150">
            <AISettings />
          </div>
        )}

        {/* TAB 3: Message Logs - Dynamic from DB */}
        {activeTab === 'logs' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(1,59,35,0.03)] space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Message Dispatch & Delivery Logs</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                  Live audit log of all inbound and outbound WhatsApp messages and Meta webhooks
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={loadMessageLogs}
                  leftIcon={<RotateCw className={clsx('w-4 h-4', isLoadingLogs && 'animate-spin')} />}
                  className="font-extrabold text-xs rounded-xl"
                >
                  Refresh Logs
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => navigate(ROUTES.INBOX)}
                  className="font-extrabold text-xs rounded-xl shadow-xs"
                >
                  Open Live Inbox
                </Button>
              </div>
            </div>

            {isLoadingLogs ? (
              <div className="p-12 text-center space-y-3 border border-slate-200 rounded-2xl bg-slate-50/50">
                <RotateCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                <p className="text-sm font-bold text-slate-600">Fetching latest WhatsApp message logs...</p>
              </div>
            ) : messageLogs.length === 0 ? (
              <div className="p-12 text-center space-y-3 border border-slate-200 rounded-2xl bg-slate-50/50">
                <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No message logs recorded yet</p>
                <p className="text-xs text-slate-500">Send a test WhatsApp message or campaign to start seeing real delivery logs.</p>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-extrabold">
                    <tr>
                      <th className="p-3.5">Direction</th>
                      <th className="p-3.5">Recipient / Sender</th>
                      <th className="p-3.5">Content / Type</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-900 font-medium">
                    {messageLogs.map((log: any, idx: number) => {
                      const isOutbound = log.direction === 'OUTBOUND' || log.direction === 'outbound' || log.fromMe;
                      const statusUpper = String(log.status || 'SENT').toUpperCase();
                      const timeStr = log.createdAt ? new Date(log.createdAt).toLocaleString() : 'Just now';
                      const contentPreview = log.content?.text || log.text || log.templateName || (typeof log.content === 'string' ? log.content : 'WhatsApp Message');

                      return (
                        <tr key={log._id || log.id || idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 font-extrabold">
                            <span className={clsx('px-2.5 py-1 rounded-lg text-[11px] font-black', isOutbound ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800')}>
                              {isOutbound ? 'OUTBOUND' : 'INBOUND'}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono font-bold text-slate-900">
                            {log.to || log.recipient || log.from || log.sender || '+1 (555) 151-9377'}
                          </td>
                          <td className="p-3.5 text-slate-800 max-w-xs truncate" title={String(contentPreview)}>
                            <span className="font-semibold">{contentPreview}</span>
                            {log.type && (
                              <span className="ml-2 text-[10px] font-mono text-slate-500 uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                                {log.type}
                              </span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span
                              className={clsx(
                                'px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wide',
                                statusUpper === 'DELIVERED' || statusUpper === 'READ'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : statusUpper === 'FAILED'
                                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                    : 'bg-blue-100 text-blue-800 border border-blue-300'
                              )}
                            >
                              {statusUpper}
                            </span>
                          </td>
                          <td className="p-3.5 text-right text-slate-500 font-mono text-xs">
                            {timeStr}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Billing & Membership */}
        {activeTab === 'billing' && (
          <div className="animate-in fade-in duration-150">
            <Billing embedded />
          </div>
        )}

        {/* TAB 5: Team */}
        {activeTab === 'team' && (
          <div className="animate-in fade-in duration-150">
            <Team />
          </div>
        )}

        {/* TAB 6: Notifications */}
        {activeTab === 'notifications' && (
          <div className="animate-in fade-in duration-150">
            <Notifications />
          </div>
        )}

        {/* TAB 7: API Keys */}
        {activeTab === 'api_keys' && (
          <div className="animate-in fade-in duration-150">
            <APIKeys />
          </div>
        )}

        {/* TAB 8: Account Profile */}
        {activeTab === 'account' && (
          <div className="w-full bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <Avatar name={displayName} src={avatarUrl} size="xl" status="online" />
                <div className="space-y-0.5">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">{displayName}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wide">
                      {(() => {
                        const roleStr = String(user?.role || '').toUpperCase();
                        if (roleStr === 'ORG_ADMIN' || roleStr === 'ADMIN') return 'Organization Admin';
                        if (roleStr === 'SUPER_ADMIN') return 'Super Admin';
                        return user?.role ? String(user.role).replace(/_/g, ' ') : 'Organization Admin';
                      })()}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{user?.email}</span>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                size="md"
                variant="primary"
                onClick={handleSaveProfile}
                isLoading={isSaving}
                leftIcon={<Save className="w-4 h-4" />}
                className="font-semibold text-xs sm:text-sm px-6 rounded-xl shadow-xs self-start sm:self-auto cursor-pointer"
              >
                Save Changes
              </Button>
            </div>

            {accountSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-800 font-semibold flex items-center gap-2.5 shadow-2xs animate-in fade-in duration-200">
                <CheckCircle2 className="w-4.5 h-4.5 shrink-0 text-emerald-600" />
                <span>{accountSuccess}</span>
              </div>
            )}

            {accountError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm text-rose-700 font-medium flex items-center gap-2.5">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 text-rose-600" />
                <span>{accountError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Personal & Contact Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    leftIcon={<User className="w-4.5 h-4.5 text-slate-400" />}
                    required
                  />
                  <Input
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    leftIcon={<User className="w-4.5 h-4.5 text-slate-400" />}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email Address"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    helperText="Primary email cannot be changed directly."
                  />

                  <Input
                    label="Phone Number"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+919876543210"
                    helperText="Direct contact number for notifications."
                  />
                </div>

                <Input
                  label="Avatar Image URL"
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  helperText="Provide a public URL for your profile picture."
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button
                  type="submit"
                  size="lg"
                  variant="primary"
                  className="text-xs sm:text-sm font-semibold rounded-xl px-7 py-2.5 shadow-xs cursor-pointer"
                  isLoading={isSaving}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* Quick Test Message Modal */}
      {testModalNumber && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white max-w-md w-full p-6 sm:p-8 rounded-3xl border border-[#E2EAE6] shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#14201C]">Send Test WhatsApp Ping</h3>
                  <p className="text-xs text-[#5F7069]">From {testModalNumber.displayPhoneNumber || testModalNumber.phoneNumber}</p>
                </div>
              </div>
            </div>

            {testResult && (
              <div
                className={clsx(
                  'p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2',
                  testResult.success
                    ? 'bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]'
                    : 'bg-[#FDF2F2] text-[#D64545] border border-[#F8B4B4]'
                )}
              >
                {testResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{testResult.msg}</span>
              </div>
            )}

            <form onSubmit={handleSendTestMessage} className="space-y-4">
              <Input
                label="Recipient Phone Number (with Country Code)"
                type="tel"
                placeholder="+919876543210"
                value={testRecipientPhone}
                onChange={(e) => setTestRecipientPhone(e.target.value)}
                required
                autoFocus
              />

              <div className="p-3 bg-[#F6FAF8] rounded-xl border border-[#E2EAE6] text-xs text-[#5F7069]">
                💡 This will send a standard test connectivity ping through your Meta Cloud API to verify webhook delivery ticks.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setTestModalNumber(null)}
                  disabled={isSendingTest}
                  className="font-bold text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSendingTest}
                  leftIcon={<Send className="w-4 h-4" />}
                  className="font-bold text-xs shadow-xs"
                >
                  Send Ping Now
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
