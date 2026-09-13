import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../components/layout/PageContainer';
import { whatsappApi } from '../api';
import type { WhatsAppPhoneNumber } from '../types';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { ArrowLeft, Smartphone, ShieldCheck, Copy, Check } from 'lucide-react';
import { ROUTES } from '../../../utils/constants';

export const WhatsAppDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [numberData, setNumberData] = useState<WhatsAppPhoneNumber | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      whatsappApi.getNumberById(id).then((data) => {
        if (data) setNumberData(data);
      });
    }
  }, [id]);

  if (!numberData) {
    return (
      <PageContainer>
        <div className="p-8 text-center text-slate-400">Loading number configuration...</div>
      </PageContainer>
    );
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageContainer>
      <button
        onClick={() => navigate(ROUTES.WHATSAPP_NUMBERS)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Numbers</span>
      </button>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-500 flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{numberData.verifiedName}</h2>
                <Badge variant="success" size="sm">Connected</Badge>
              </div>
              <p className="text-xs font-mono text-slate-400">{numberData.displayPhoneNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Test Webhook Ping</Button>
            <Button variant="primary" size="sm">Sync Quality Status</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meta Account Details */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Meta Cloud Health
          </h4>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Quality Rating</span>
              <span className="font-semibold text-emerald-500">{numberData.qualityRating} (High)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">24h Limit</span>
              <span className="font-semibold text-slate-800 dark:text-slate-100">{numberData.messagingLimit}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">WABA ID</span>
              <span className="font-mono text-slate-800 dark:text-slate-100">{numberData.wabaId}</span>
            </div>
          </div>
        </div>

        {/* Webhook Configuration */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Webhook URL</h4>
          <p className="text-xs text-slate-500">
            Copy this callback URL and verification token to your Meta Developer App Dashboard.
          </p>
          <div className="flex items-center gap-2">
            <Input
              value={numberData.webhookUrl || 'https://api.chatflow.io/v1/webhooks/whatsapp'}
              readOnly
              className="font-mono text-xs"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(numberData.webhookUrl || '')}
              leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
