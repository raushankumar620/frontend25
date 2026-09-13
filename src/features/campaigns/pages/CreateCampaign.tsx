import React, { useState } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { ArrowLeft, Users, FileText, Send, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { campaignsApi } from '../api';

export const CreateCampaign: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [audience, setAudience] = useState('VIP Customers (14,280)');
  const [template, setTemplate] = useState('black_friday_vip_early_access');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLaunch = async () => {
    setIsSubmitting(true);
    try {
      await campaignsApi.createCampaign({
        name,
        targetAudience: audience,
        templateName: template,
        totalRecipients: 14280,
      });
      navigate(ROUTES.CAMPAIGNS);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <button
        onClick={() => navigate(ROUTES.CAMPAIGNS)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Campaigns</span>
      </button>

      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 mb-1">
            <span>Step {step} of 3</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Broadcast Campaign</h2>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <Input
              label="Campaign Title"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. End of Season Flash Sale"
              required
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Audience Segment
              </label>
              <div className="space-y-2">
                {[
                  'VIP Customers (14,280 contacts)',
                  'Active Leads - Last 30 Days (8,400 contacts)',
                  'All Opted-In Users (45,210 contacts)',
                ].map((aud) => (
                  <div
                    key={aud}
                    onClick={() => setAudience(aud)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      audience === aud
                        ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200">
                      <Users className="w-4 h-4 text-emerald-500" />
                      <span>{aud}</span>
                    </div>
                    {audience === aud && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>
                ))}
              </div>
            </div>

            <Button
              className="w-full mt-4"
              size="lg"
              disabled={!name}
              onClick={() => setStep(2)}
            >
              Next: Select WhatsApp Template
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Approved WhatsApp Template
              </label>
              <div className="space-y-2">
                {[
                  { name: 'black_friday_vip_early_access', cat: 'MARKETING' },
                  { name: 'order_status_update_v2', cat: 'UTILITY' },
                ].map((tpl) => (
                  <div
                    key={tpl.name}
                    onClick={() => setTemplate(tpl.name)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      template === tpl.name
                        ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200">
                      <FileText className="w-4 h-4 text-emerald-500" />
                      <span className="font-mono">{tpl.name}</span>
                    </div>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-semibold text-slate-500">
                      {tpl.cat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button onClick={() => setStep(3)} className="flex-1">
                Next: Review & Schedule
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Campaign Name:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Audience:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{audience}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Template:</span>
                <span className="font-mono font-semibold text-emerald-500">{template}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Delivery Speed:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Tier 3 (~5,000 msgs/min)
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleLaunch}
                isLoading={isSubmitting}
                leftIcon={<Send className="w-4 h-4" />}
                className="flex-1"
              >
                Launch Broadcast Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
