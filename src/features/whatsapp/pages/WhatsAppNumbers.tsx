import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Table, type Column } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Smartphone, Plus, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { WhatsAppPhoneNumber } from '../types';
import { whatsappApi } from '../api';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const WhatsAppNumbers: React.FC = () => {
  const navigate = useNavigate();
  const [numbers, setNumbers] = useState<WhatsAppPhoneNumber[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    whatsappApi.getNumbers().then((data) => {
      setNumbers(data);
      setIsLoading(false);
    });
  }, []);

  const columns: Column<WhatsAppPhoneNumber>[] = [
    {
      header: 'Phone Number & Name',
      render: (n) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white">{n.verifiedName}</div>
            <div className="text-slate-400 font-mono text-[11px]">{n.displayPhoneNumber}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Quality Rating',
      render: (n) => (
        <Badge variant={n.qualityRating === 'GREEN' ? 'success' : 'warning'} size="sm" dot>
          {n.qualityRating} Tier
        </Badge>
      ),
    },
    {
      header: 'Messaging Tier Limit',
      accessorKey: 'messagingLimit',
    },
    {
      header: 'Status',
      render: (n) => (
        <Badge variant="primary" size="sm">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          {n.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      render: (n) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/whatsapp/numbers/${n.id}`)}
        >
          Manage & Webhooks
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Connected WhatsApp Numbers
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Meta Cloud Business API phone numbers connected to your WABA account.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate(ROUTES.CONNECT_WHATSAPP)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Connect New Number
        </Button>
      </div>

      <div className="bg-emerald-950/20 border border-emerald-800/40 p-4 rounded-2xl mb-6 flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
        <div className="text-xs text-slate-300">
          <strong className="text-white">Meta Business Account Status: Verified (Tier 3).</strong> Outbound messaging limit is 100,000 unique recipients per rolling 24-hour window.
        </div>
      </div>

      <Table columns={columns} data={numbers} isLoading={isLoading} />
    </PageContainer>
  );
};
