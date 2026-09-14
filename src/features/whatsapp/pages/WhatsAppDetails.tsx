import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../components/layout/PageContainer';
import { whatsappApi } from '../api';
import { whatsappService } from '../../../services/whatsappService';
import type { WhatsAppPhoneNumber } from '../types';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { ArrowLeft, Smartphone, ShieldCheck, Copy, Check, RefreshCw, Trash2, CheckCircle2, AlertCircle, Key } from 'lucide-react';
import { ROUTES } from '../../../utils/constants';

export const WhatsAppDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [numberData, setNumberData] = useState<WhatsAppPhoneNumber | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const webhookVerifyToken = 'whatsappmsg_verify_token_secure';

  const loadNumber = () => {
    if (id) {
      whatsappApi.getNumberById(id).then((data) => {
        if (data) setNumberData(data);
      });
    }
  };

  useEffect(() => {
    loadNumber();
  }, [id]);

  const handleSync = async () => {
    if (!id) return;
    setIsSyncing(true);
    setError('');
    setSuccessMessage('');
    try {
      await whatsappService.syncNumber(id);
      setSuccessMessage('Meta Quality Rating & Tier Limit synced successfully!');
      loadNumber();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to sync with Meta Cloud API');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to disconnect this WhatsApp number?')) return;
    setIsDeleting(true);
    try {
      await whatsappService.disconnectNumber(id);
      navigate(ROUTES.WHATSAPP_NUMBERS);
    } catch (err: any) {
      setError(err.message || 'Failed to disconnect number');
      setIsDeleting(false);
    }
  };

  const handleCopy = (text: string, type: 'url' | 'token') => {
    navigator.clipboard.writeText(text);
    if (type === 'url') {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } else {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  if (!numberData) {
    return (
      <PageContainer>
        <div className="p-12 text-center text-[#5F7069] flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-[#05A222]/30 border-t-[#05A222] rounded-full animate-spin" />
          <span>Loading number configuration...</span>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <button
        onClick={() => navigate(ROUTES.WHATSAPP_NUMBERS)}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#5F7069] hover:text-[#14201C] mb-4 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Numbers</span>
      </button>

      {successMessage && (
        <div className="p-4 bg-[#E9F9EE] border border-[#C4EBD0] rounded-2xl text-sm text-[#006736] font-bold flex items-center gap-2.5 mb-6 shadow-xs">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-[#05A222]" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-[#FDF2F2] border border-[#F8B4B4] rounded-2xl text-sm text-[#D64545] font-semibold flex items-center gap-2.5 mb-6">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#D64545]" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2EAE6] shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0] flex items-center justify-center shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#14201C]">{numberData.verifiedName}</h2>
                <Badge variant="success" size="sm">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  CONNECTED
                </Badge>
              </div>
              <p className="text-sm font-mono text-[#5F7069] mt-0.5">{numberData.displayPhoneNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSync}
              isLoading={isSyncing}
              leftIcon={<RefreshCw className="w-4 h-4 text-[#05A222]" />}
              className="text-xs font-bold border-[#C4EBD0] text-[#006736] hover:bg-[#F6FAF8] rounded-xl"
            >
              Sync Quality Status
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              isLoading={isDeleting}
              leftIcon={<Trash2 className="w-4 h-4 text-[#D64545]" />}
              className="text-xs font-bold border-[#F8B4B4] text-[#D64545] hover:bg-[#FDF2F2] rounded-xl"
            >
              Disconnect Number
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meta Account Details */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2EAE6] shadow-xs space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#8A9993] flex items-center gap-2">
            <ShieldCheck className="w-4.5 h-4.5 text-[#05A222]" />
            Meta Cloud Health & Tier
          </h4>
          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between py-2 border-b border-[#E2EAE6]">
              <span className="text-[#5F7069] font-medium">Quality Rating</span>
              <span className="font-bold text-[#05A222] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#05A222]" />
                {numberData.qualityRating} (High)
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E2EAE6]">
              <span className="text-[#5F7069] font-medium">24h Messaging Limit</span>
              <span className="font-bold text-[#14201C]">{numberData.messagingLimit}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E2EAE6]">
              <span className="text-[#5F7069] font-medium">WABA Account ID</span>
              <span className="font-mono font-bold text-[#14201C]">{numberData.wabaId}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E2EAE6]">
              <span className="text-[#5F7069] font-medium">Last Synced At</span>
              <span className="text-xs text-[#8A9993]">{new Date(numberData.lastSyncAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Webhook Configuration */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2EAE6] shadow-xs space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#8A9993]">
            Meta Developer Webhook Setup
          </h4>
          <p className="text-xs text-[#5F7069] leading-relaxed">
            Add these exact Webhook callback parameters to your Meta App Dashboard under <strong>WhatsApp → Configuration → Webhook</strong>.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#14201C] mb-1">Callback URL</label>
              <div className="flex items-center gap-2">
                <Input
                  value={numberData.webhookUrl || `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/webhooks/whatsapp`}
                  readOnly
                  className="font-mono text-xs"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(numberData.webhookUrl || '', 'url')}
                  leftIcon={copiedUrl ? <Check className="w-3.5 h-3.5 text-[#05A222]" /> : <Copy className="w-3.5 h-3.5" />}
                  className="rounded-xl shrink-0"
                >
                  {copiedUrl ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#14201C] mb-1">Verification Token</label>
              <div className="flex items-center gap-2">
                <Input
                  value={webhookVerifyToken}
                  readOnly
                  className="font-mono text-xs"
                  leftIcon={<Key className="w-4 h-4 text-[#8A9993]" />}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(webhookVerifyToken, 'token')}
                  leftIcon={copiedToken ? <Check className="w-3.5 h-3.5 text-[#05A222]" /> : <Copy className="w-3.5 h-3.5" />}
                  className="rounded-xl shrink-0"
                >
                  {copiedToken ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
