import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  ShieldCheck, 
  Zap, 
  ArrowRight
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { useAuthStore } from '../../../store/authStore';

export const WhatsAppAPISection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [copied, setCopied] = useState(false);

  const sampleCode = `// Send WhatsApp Template Message with WhatsAppMsg SDK
import { WhatsAppMsgClient } from '@whatsappmsg/sdk';

const client = new WhatsAppMsgClient({
  apiKey: process.env.WHATSAPPMSG_API_KEY,
  phoneNumberId: 'phone_982183921'
});

const result = await client.messages.sendTemplate({
  to: '+91 98765 43210',
  templateName: 'order_shipped_v1',
  language: 'en_US',
  components: [
    { type: 'body', parameters: [{ type: 'text', text: 'Alex' }, { type: 'text', text: '#TRK-98210' }] }
  ]
});

console.log('Message delivered via Meta Cloud API:', result.messageId);`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sampleCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 bg-white border-b border-[#E2EAE6]">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9F9EE] border border-[#C4EBD0] text-[#006736] text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-[#05A222]" />
              Direct Meta Cloud Integration
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-[#14201C] tracking-tight leading-tight">
              Connect directly to Meta Cloud API. Zero broker latency.
            </h2>

            <p className="text-sm sm:text-base text-[#5F7069] leading-relaxed">
              Eliminate third-party broker outages and hidden per-message markup fees. WhatsAppMSG connects your business directly to Meta's global data centers for maximum delivery speed and reliability.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#05A222] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-[#1F2A26]">Official Green Tick verification guidance and assistance</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#05A222] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-[#1F2A26]">Tier 3 messaging limits (100,000+ conversations/day capability)</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#05A222] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-[#1F2A26]">Interactive List, CTA Buttons, Carousel & Flow messages</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#05A222] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-[#1F2A26]">Meta pass-through pricing with 0% extra margin added</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate(ROUTES.LOGIN);
                  } else {
                    navigate(ROUTES.CONNECT_WHATSAPP);
                  }
                }}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="bg-[#05A222] hover:bg-[#006736] text-white font-bold"
              >
                Connect WhatsApp Business
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate(ROUTES.LOGIN);
                  } else {
                    navigate(ROUTES.DEVELOPERS_DOCS);
                  }
                }}
                className="border-[#E2EAE6] text-[#14201C] font-semibold hover:bg-[#F6FAF8]"
              >
                Explore API Docs
              </Button>
            </div>
          </div>

          {/* Right Code Block */}
          <div className="lg:col-span-6">
            <div className="bg-[#14201C] rounded-2xl border border-[#2B3A34] shadow-xl overflow-hidden font-mono text-xs">
              <div className="bg-[#013B23] px-4 py-3 flex items-center justify-between border-b border-[#2B3A34] text-[#E2EAE6]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#D64545]" />
                  <div className="w-3 h-3 rounded-full bg-[#D99A00]" />
                  <div className="w-3 h-3 rounded-full bg-[#05A222]" />
                  <span className="ml-2 text-white text-[11px] font-medium">whatsappmsg-send.ts</span>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 text-xs text-white hover:bg-white/20 bg-white/10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#1CD72C]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-4 sm:p-5 overflow-x-auto text-[#1CD72C]">
                <pre className="text-white/90 whitespace-pre-wrap leading-relaxed">
                  <code>{sampleCode}</code>
                </pre>
              </div>

              <div className="bg-[#013B23]/90 px-4 py-2.5 border-t border-[#2B3A34] flex items-center justify-between text-[11px] text-[#E2EAE6]">
                <span className="flex items-center gap-1.5 text-[#1CD72C] font-sans font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  Meta Verified Direct API Endpoint
                </span>
                <span className="font-mono text-[#E2EAE6]">200 OK • 18ms</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
