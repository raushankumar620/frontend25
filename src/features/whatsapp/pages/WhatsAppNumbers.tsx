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
      header: 'Phone Number & Verified Name',
      render: (n) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0] flex items-center justify-center shrink-0">
            <Smartphone className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="font-bold text-[#0F172A] text-sm flex items-center gap-1.5">
              <span>{n.verifiedName || 'WhatsApp Channel'}</span>
              <span className="w-2 h-2 rounded-full bg-[#05A222]" title="Connected" />
            </div>
            <div className="text-[#64748B] font-mono text-xs mt-0.5">{n.displayPhoneNumber}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Quality Rating',
      render: (n) => (
        <Badge variant={n.qualityRating === 'GREEN' ? 'success' : 'warning'} size="sm" dot>
          {n.qualityRating || 'GREEN'} Quality
        </Badge>
      ),
    },
    {
      header: 'Messaging Tier Limit',
      render: (n) => (
        <span className="font-semibold text-xs text-[#0F172A]">
          {n.messagingLimit || '100k msgs / 24h'}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (n) => (
        <Badge variant="primary" size="sm">
          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
          {n.status ? n.status.toUpperCase() : 'CONNECTED'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (n) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/whatsapp/numbers/${n.id}`)}
            className="text-xs font-semibold border-[#E2EAE6] text-[#0F172A] hover:bg-[#F8FAFC] rounded-xl"
          >
            Manage & Webhooks
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      {/* Top Meta Account Status Card */}
      <div className="bg-white rounded-2xl border border-[#E2EAE6] shadow-xs p-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#05A222] shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#0F172A]">Meta Cloud Business Account: Verified</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]">
                TIER 3
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Official WhatsApp Cloud API connected. Real-time webhooks active with 100k daily message limit.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(ROUTES.CONNECT_WHATSAPP)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="text-xs font-bold px-4 py-2 rounded-xl shadow-xs bg-[#05A222] hover:bg-[#006736] text-white cursor-pointer"
          >
            Connect New Number
          </Button>
        </div>
      </div>

      {/* Connected Phone Numbers Table */}
      <div className="bg-white rounded-2xl border border-[#E2EAE6] shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E2EAE6]">
          <div>
            <h3 className="text-base font-bold text-[#0F172A] tracking-tight">Connected Phone Numbers</h3>
            <p className="text-xs text-[#64748B] mt-0.5">Active WhatsApp Business API sender identities for your workspace.</p>
          </div>
        </div>

        <Table
          columns={columns}
          data={numbers}
          isLoading={isLoading}
          emptyMessage="No WhatsApp numbers connected yet. Click 'Connect New Number' to link your Meta Business phone."
        />
      </div>
    </PageContainer>
  );
};
