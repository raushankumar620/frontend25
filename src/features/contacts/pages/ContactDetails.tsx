import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../components/layout/PageContainer';
import { contactsApi } from '../api';
import { Avatar } from '../../../components/ui/Avatar';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Tabs } from '../../../components/ui/Tabs';
import {
  ArrowLeft,
  MessageSquare,
  Phone,
  Mail,
  ShoppingCart,
  Tag,
  Clock,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { ROUTES } from '../../../utils/constants';
import { useChatStore } from '../../../store/chatStore';

export const ContactDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contact, setContact] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isUpdatingOpt, setIsUpdatingOpt] = useState(false);
  const { setActiveConversation } = useChatStore();

  const loadContact = () => {
    if (id) {
      contactsApi.getContactById(id).then((data) => {
        if (data) setContact(data);
      });
    }
  };

  useEffect(() => {
    loadContact();
  }, [id]);

  const handleToggleOptStatus = async () => {
    if (!contact || !id) return;
    setIsUpdatingOpt(true);
    const newStatus = contact.status === 'active' ? 'OPTED_OUT' : 'OPTED_IN';
    try {
      await contactsApi.toggleOptStatus(id, newStatus);
      loadContact();
    } catch (err) {
      console.error('Failed to toggle opt status:', err);
    } finally {
      setIsUpdatingOpt(false);
    }
  };

  const handleDeleteContact = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this contact?')) return;
    try {
      await contactsApi.deleteContact(id);
      navigate(ROUTES.CONTACTS);
    } catch (err) {
      console.error('Failed to delete contact:', err);
    }
  };

  const handleOpenChat = () => {
    if (contact?.conversation?.id || contact?.conversation?._id) {
      setActiveConversation(contact.conversation.id || contact.conversation._id);
    }
    navigate(ROUTES.INBOX);
  };

  if (!contact) {
    return (
      <PageContainer>
        <div className="p-8 text-center text-slate-400">Loading contact profile...</div>
      </PageContainer>
    );
  }

  const isOptedIn = contact.status === 'active' || contact.optInStatus === 'OPTED_IN';

  return (
    <PageContainer>
      <div className="mb-6">
        <button
          onClick={() => navigate(ROUTES.CONTACTS)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Contacts</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-4">
            <Avatar name={contact.name} size="xl" status={isOptedIn ? 'online' : 'offline'} />
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {contact.name || 'Unnamed Contact'}
                </h2>
                <Badge variant={isOptedIn ? 'success' : 'danger'} size="sm">
                  {isOptedIn ? 'Active WhatsApp Opt-in' : 'Opted Out'}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1.5 font-medium">
                <span className="flex items-center gap-1 font-mono text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {contact.phone}
                </span>
                {contact.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {contact.email}
                  </span>
                )}
                <span className="text-slate-400">Source: {contact.source || 'Inbound WhatsApp'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleOptStatus}
              disabled={isUpdatingOpt}
              leftIcon={
                isUpdatingOpt ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : isOptedIn ? (
                  <XCircle className="w-3.5 h-3.5 text-red-500" />
                ) : (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                )
              }
              className="text-xs font-semibold"
            >
              {isOptedIn ? 'Revoke Opt-In' : 'Grant Opt-In'}
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenChat}
              leftIcon={<MessageSquare className="w-4 h-4" />}
            >
              Open in Live Chat
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteContact}
              className="text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <Tabs
          tabs={[
            { id: 'overview', label: 'Overview & Custom Attributes' },
            { id: 'orders', label: 'Commerce & Order History' },
            { id: 'activity', label: 'WhatsApp Interaction History' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Audience Tags</h4>
            <div className="flex flex-wrap gap-2">
              {contact.tags && contact.tags.length > 0 ? (
                contact.tags.map((t: string, idx: number) => (
                  <Badge key={idx} variant="primary" size="md">
                    <Tag className="w-3 h-3 mr-1" />
                    {t}
                  </Badge>
                ))
              ) : (
                <p className="text-xs text-slate-400">No tags assigned</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Custom Attributes</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              {contact.customAttributes && Object.keys(contact.customAttributes).length > 0 ? (
                Object.entries(contact.customAttributes).map(([k, v]) => (
                  <div key={k} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                    <span className="text-slate-400 capitalize block mb-1">{k}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{String(v)}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 col-span-full">No custom fields defined</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center py-12">
          <ShoppingCart className="w-10 h-10 mx-auto text-emerald-500 mb-3" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Commercial History</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Total {contact.totalOrders || 0} orders completed with lifetime gross merchandise value of $
            {(contact.totalSpent || 0).toLocaleString()}.
          </p>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center py-12">
          <Clock className="w-10 h-10 mx-auto text-teal-500 mb-3" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">WhatsApp Interaction Timeline</h4>
          <p className="text-xs text-slate-500 mt-1">
            Total WhatsApp Messages Logged: <strong>{contact.totalMessagesCount || 0}</strong>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Last active: {new Date(contact.lastActive || contact.createdAt).toLocaleString()}
          </p>
        </div>
      )}
    </PageContainer>
  );
};
