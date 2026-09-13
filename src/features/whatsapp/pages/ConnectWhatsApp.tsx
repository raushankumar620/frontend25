import React, { useState } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { QrCode, ArrowLeft, Shield, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const ConnectWhatsApp: React.FC = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState<'meta_cloud' | 'qr_code'>('meta_cloud');
  const [wabaId, setWabaId] = useState('waba_99210928301');
  const [accessToken, setAccessToken] = useState('');
  const [phoneId, setPhoneId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsSuccess(true);
    }, 1000);
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

      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Connect WhatsApp Business Account</h2>
          <p className="text-xs text-slate-500 mt-1">
            Choose either Meta Cloud API credentials or Quick Embedded QR Code.
          </p>
        </div>

        {/* Method Switcher */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setMethod('meta_cloud')}
            className={`p-3 rounded-xl border text-left transition-all ${
              method === 'meta_cloud'
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 font-semibold'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="text-xs text-slate-900 dark:text-white">Meta Cloud API (Recommended)</div>
            <div className="text-[10px] text-slate-400 mt-0.5">High-speed, official Tier 3 scalability</div>
          </button>
          <button
            onClick={() => setMethod('qr_code')}
            className={`p-3 rounded-xl border text-left transition-all ${
              method === 'qr_code'
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 font-semibold'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="text-xs text-slate-900 dark:text-white">QR Code Scan (Co-existence)</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Instant test pairing via phone scan</div>
          </button>
        </div>

        {isSuccess ? (
          <div className="text-center p-6 bg-emerald-950/30 border border-emerald-800 rounded-xl space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">WhatsApp Account Linked Successfully!</h4>
            <p className="text-xs text-slate-300">
              Your number has been synced. Webhooks are now listening for incoming messages.
            </p>
            <Button
              className="mt-4"
              size="sm"
              onClick={() => navigate(ROUTES.WHATSAPP_NUMBERS)}
            >
              View Active Numbers
            </Button>
          </div>
        ) : method === 'meta_cloud' ? (
          <form onSubmit={handleConnect} className="space-y-4">
            <Input
              label="WABA Account ID"
              value={wabaId}
              onChange={(e) => setWabaId(e.target.value)}
              placeholder="e.g. 10928391823901"
              required
            />
            <Input
              label="Phone Number ID"
              value={phoneId}
              onChange={(e) => setPhoneId(e.target.value)}
              placeholder="e.g. 10839201928"
              required
            />
            <Input
              label="System User Permanent Access Token"
              type="password"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="EAAG..."
              required
            />

            <Button type="submit" size="lg" className="w-full" isLoading={isConnecting}>
              Verify & Connect Meta API
            </Button>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-48 h-48 bg-white p-3 rounded-2xl mx-auto border border-slate-200 dark:border-slate-700 flex items-center justify-center">
              <QrCode className="w-40 h-40 text-slate-900" />
            </div>
            <p className="text-xs text-slate-500">
              Open WhatsApp on your phone → Linked Devices → Link a device
            </p>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
