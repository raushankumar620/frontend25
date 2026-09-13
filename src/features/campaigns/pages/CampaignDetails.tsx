import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../components/layout/PageContainer';
import { campaignsApi } from '../api';
import type { Campaign } from '../types';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ArrowLeft, Send, CheckCircle2, Eye, MessageCircle } from 'lucide-react';
import { ROUTES } from '../../../utils/constants';

export const CampaignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    if (id) {
      campaignsApi.getCampaignById(id).then((data) => {
        if (data) setCampaign(data);
      });
    }
  }, [id]);

  if (!campaign) {
    return (
      <PageContainer>
        <div className="p-8 text-center text-slate-400">Loading campaign analytics...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <button
        onClick={() => navigate(ROUTES.CAMPAIGNS)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Campaigns</span>
      </button>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{campaign.name}</h2>
            <Badge variant="success" size="sm">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              {campaign.status.toUpperCase()}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Target Audience: {campaign.targetAudience} • Template: {campaign.templateName}
          </p>
        </div>

        <Button variant="outline" size="sm">
          Export Analytics CSV
        </Button>
      </div>

      {/* Funnel Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Sent</span>
            <Send className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {campaign.sentCount.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-500 mt-1">100% Outbound dispatched</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Delivered</span>
            <CheckCircle2 className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {campaign.deliveredCount.toLocaleString()}
          </div>
          <div className="text-[10px] text-teal-500 mt-1">98.9% Delivery rate</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Read & Opened</span>
            <Eye className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {campaign.readCount.toLocaleString()}
          </div>
          <div className="text-[10px] text-indigo-400 mt-1">84.2% Open rate</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Replied / Converted</span>
            <MessageCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {campaign.repliedCount.toLocaleString()}
          </div>
          <div className="text-[10px] text-amber-400 mt-1">16.2% Inbound response rate</div>
        </div>
      </div>
    </PageContainer>
  );
};
