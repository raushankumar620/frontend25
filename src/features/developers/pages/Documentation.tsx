import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
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
  'https://api.chatflow.io/v1/messages/send-template',
  {
    to: '+15552345678',
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
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-white font-sans">API Reference & SDKs</h2>
        <p className="text-xs text-slate-400 mt-1">
          Everything you need to integrate WhatsApp messaging into your CRM, website, or backend.
        </p>
      </div>

      {/* Authentication Guide */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3 font-sans">
        <h3 className="text-base font-bold text-white">1. Authentication</h3>
        <p className="text-xs text-slate-300">
          All API requests must include your secret API key in the <code className="text-emerald-400 font-mono">Authorization</code> HTTP header:
        </p>
        <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-slate-300 border border-slate-800">
          Authorization: Bearer cf_live_••••••••••••••••••••••••
        </div>
      </div>

      {/* Node.js SDK Example */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3 font-sans">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">2. Send Template Message (Node.js)</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleCopy('node', nodeCode)}
            leftIcon={copiedSection === 'node' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copiedSection === 'node' ? 'Copied' : 'Copy Snippet'}
          </Button>
        </div>

        <pre className="p-4 bg-slate-950 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto border border-slate-800">
          {nodeCode}
        </pre>
      </div>
    </div>
  );
};
