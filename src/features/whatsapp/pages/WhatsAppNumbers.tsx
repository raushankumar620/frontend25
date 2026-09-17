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
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0] flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-[#14201C] text-sm sm:text-base">{n.verifiedName}</div>
            <div className="text-[#5F7069] font-mono text-xs sm:text-sm mt-0.5">{n.displayPhoneNumber}</div>
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
          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
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
          className="text-sm font-semibold border-[#C4EBD0] text-[#006736] hover:bg-[#F6FAF8] rounded-xl"
        >
          Manage & Webhooks
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <div className="flex items-center justify-end gap-3 mb-6">
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate(ROUTES.CONNECT_WHATSAPP)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="text-sm font-bold px-4.5 py-2.5 rounded-xl shadow-sm"
        >
          Connect New Number
        </Button>
      </div>

      <div className="bg-[#E9F9EE] border border-[#C4EBD0] p-5 rounded-2xl mb-8 flex items-center gap-3.5">
        <ShieldCheck className="w-7 h-7 text-[#05A222] shrink-0" />
        <div className="text-sm text-[#1F2A26] font-medium leading-relaxed">
          <strong className="text-[#006736] font-bold">Meta Business Account Status: Verified (Tier 3).</strong> Outbound messaging limit is 100,000 unique recipients per rolling 24-hour window.
        </div>
      </div>

      <Table columns={columns} data={numbers} isLoading={isLoading} />
    </PageContainer>
  );
};
