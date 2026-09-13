import React, { useState } from 'react';
import { Copy, Check, Terminal, Shield } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const Documentation: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const nodeCode = `import axios from 'axios';

const response = await axios.post(
  'https://api.whatsappmsg.com/v1/messages/send-template',
  {
    to: '+919876543210',
    templateName: 'order_status_update_v2',
    variables: ['David', '98231', 'FedEx Express', 'Tomorrow']
  },
  {
    headers: {
      Authorization: 'Bearer cf_live_your_api_key_here',
      'Content-Type': 'application/json'
    }
  }
);

console.log('WhatsApp message dispatched:', response.data);`;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h3 className="text-lg font-bold text-[#14201C]">API Reference & SDK Integration</h3>
        <p className="text-xs text-[#5F7069] mt-0.5">
          Everything you need to integrate WhatsApp messaging into your CRM, website, or backend services.
        </p>
      </div>

      {/* Authentication Guide */}
      <div className="bg-white border border-[#E2EAE6] p-6 rounded-2xl shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#05A222] shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <h4 className="text-base font-bold text-[#14201C]">1. Authentication</h4>
        </div>
        <p className="text-xs text-[#5F7069]">
          All API requests must include your secret API bearer key in the <code className="text-[#006736] font-mono bg-[#E9F9EE] px-1.5 py-0.5 rounded border border-[#C4EBD0]">Authorization</code> HTTP header:
        </p>
        <div className="p-3.5 bg-[#14201C] rounded-xl font-mono text-xs text-[#1CD72C] border border-[#2B3A34] shadow-inner">
          Authorization: Bearer cf_live_••••••••••••••••••••••••
        </div>
      </div>

      {/* Node.js SDK Example */}
      <div className="bg-white border border-[#E2EAE6] p-6 rounded-2xl shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#05A222] shrink-0">
              <Terminal className="w-4 h-4" />
            </div>
            <h4 className="text-base font-bold text-[#14201C]">2. Send Template Message (Node.js)</h4>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleCopy('node', nodeCode)}
            leftIcon={copiedSection === 'node' ? <Check className="w-3.5 h-3.5 text-[#05A222]" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copiedSection === 'node' ? 'Copied' : 'Copy Snippet'}
          </Button>
        </div>

        <pre className="p-4 bg-[#14201C] rounded-xl font-mono text-xs text-[#1CD72C] overflow-x-auto border border-[#2B3A34] shadow-inner">
          {nodeCode}
        </pre>
      </div>
    </div>
  );
};
