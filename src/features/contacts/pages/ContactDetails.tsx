import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../components/layout/PageContainer';
import { contactsApi } from '../api';
import type { Contact } from '../types';
import { Avatar } from '../../../components/ui/Avatar';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Tabs } from '../../../components/ui/Tabs';
import { ArrowLeft, MessageSquare, Phone, Mail, ShoppingCart, Tag, Clock } from 'lucide-react';
import { ROUTES } from '../../../utils/constants';

export const ContactDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contact, setContact] = useState<Contact | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      contactsApi.getContactById(id).then((data) => {
        if (data) setContact(data);
      });
    }
  }, [id]);

  if (!contact) {
    return (
      <PageContainer>
        <div className="p-8 text-center text-slate-400">Loading contact profile...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <button
          onClick={() => navigate(ROUTES.CONTACTS)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Contacts</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <Avatar name={contact.name} size="xl" status="online" />
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{contact.name}</h2>
                <Badge variant="success" size="sm">
                  Active WhatsApp Opt-in
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {contact.phone}
                </span>
                {contact.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {contact.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(ROUTES.INBOX)}
              leftIcon={<MessageSquare className="w-4 h-4" />}
            >
              Open in Live Chat
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <Tabs
          tabs={[
            { id: 'overview', label: 'Overview & Custom Attributes' },
            { id: 'orders', label: 'Order History & Commerce' },
            { id: 'activity', label: 'WhatsApp Message Logs' },
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
              {contact.tags.map((t, idx) => (
                <Badge key={idx} variant="primary" size="md">
                  <Tag className="w-3 h-3 mr-1" />
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Custom Attributes</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              {Object.entries(contact.customAttributes).map(([k, v]) => (
                <div key={k} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                  <span className="text-slate-400 capitalize block mb-1">{k}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center py-12">
          <ShoppingCart className="w-10 h-10 mx-auto text-emerald-500 mb-3" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Commercial History Synced</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Total {contact.totalOrders} orders completed with lifetime gross merchandise value of $
            {contact.totalSpent?.toLocaleString()}.
          </p>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center py-12">
          <Clock className="w-10 h-10 mx-auto text-teal-500 mb-3" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Audit Log</h4>
          <p className="text-xs text-slate-500 mt-1">
            Last active on WhatsApp {new Date(contact.lastActive).toLocaleString()}
          </p>
        </div>
      )}
    </PageContainer>
  );
};
