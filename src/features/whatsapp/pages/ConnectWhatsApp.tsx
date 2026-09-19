import React, { useState } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle, Smartphone, Key, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { whatsappService } from '../../../services/whatsappService';

export const ConnectWhatsApp: React.FC = () => {
  const navigate = useNavigate();
  const [wabaId, setWabaId] = useState('');
  const [name, setName] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [displayPhoneNumber, setDisplayPhoneNumber] = useState('');
  const [verifiedName, setVerifiedName] = useState('');
  const [accessToken, setAccessToken] = useState('');

  const [isConnecting, setIsConnecting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wabaId || !accessToken) {
      setError('WABA ID and Permanent Access Token are required');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      await whatsappService.connectManual({
        wabaId: wabaId.trim(),
        name: name.trim() || `WhatsApp Account (${wabaId.substring(0, 6)})`,
        accessToken: accessToken.trim(),
        phoneNumberId: phoneNumberId.trim() || undefined,
        displayPhoneNumber: displayPhoneNumber.trim() || undefined,
        verifiedName: verifiedName.trim() || undefined,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to connect WhatsApp account');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <PageContainer>
      <button
        onClick={() => navigate(ROUTES.WHATSAPP_NUMBERS)}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#5F7069] hover:text-[#14201C] mb-4 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to WhatsApp Numbers</span>
      </button>

      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#E9F9EE] text-[#05A222] flex items-center justify-center mx-auto mb-3 border border-[#C4EBD0]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-[#14201C] tracking-tight">Connect WhatsApp Cloud API</h2>
          <p className="text-xs sm:text-sm text-[#5F7069] mt-1 font-medium">
            Connect your Meta WhatsApp Business Account (WABA) with official System User tokens.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-[#FDF2F2] border border-[#F8B4B4] rounded-2xl text-xs sm:text-sm text-[#D64545] font-semibold flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#D64545]" />
            <span>{error}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="text-center p-8 bg-[#E9F9EE] border border-[#C4EBD0] rounded-2xl space-y-4 shadow-xs animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-white border border-[#C4EBD0] text-[#05A222] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-black text-[#14201C]">WhatsApp Cloud API Linked Successfully!</h4>
              <p className="text-xs text-[#5F7069] max-w-sm mx-auto mt-1 font-medium">
                Your phone number is now connected. Webhooks are registered and ready to receive real-time messages.
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate(ROUTES.WHATSAPP_NUMBERS)}
                className="font-bold px-6"
              >
                View Active Numbers
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleConnect} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Account / Business Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acme Main Support"
                leftIcon={<Building className="w-4 h-4" />}
                required
              />
              <Input
                label="WhatsApp Business Account (WABA) ID *"
                value={wabaId}
                onChange={(e) => setWabaId(e.target.value)}
                placeholder="e.g. 10928391823901"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number ID"
                value={phoneNumberId}
                onChange={(e) => setPhoneNumberId(e.target.value)}
                placeholder="e.g. 10839201928"
                leftIcon={<Smartphone className="w-4 h-4" />}
              />
              <Input
                label="Display Phone Number"
                value={displayPhoneNumber}
                onChange={(e) => setDisplayPhoneNumber(e.target.value)}
                placeholder="+1 555-0199"
              />
            </div>

            <Input
              label="Verified Display Name (as seen on WhatsApp)"
              value={verifiedName}
              onChange={(e) => setVerifiedName(e.target.value)}
              placeholder="e.g. Acme Support & Sales"
            />

            <Input
              label="Meta System User Permanent Access Token *"
              type="password"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="EAAG..."
              leftIcon={<Key className="w-4 h-4" />}
              helperText="Token is encrypted using AES-256-GCM before storage."
              required
            />

            <Button
              type="submit"
              size="lg"
              className="w-full mt-4 font-bold text-base py-3.5 rounded-xl shadow-md shadow-[#05A222]/20 cursor-pointer"
              isLoading={isConnecting}
            >
              Verify & Connect WhatsApp Cloud API
            </Button>
          </form>
        )}
      </div>
    </PageContainer>
  );
};
