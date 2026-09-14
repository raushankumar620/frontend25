import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Button } from '../../../components/ui/Button';
import {
  CreditCard,
  Zap,
  ArrowRight,
  Wallet,
  Sparkles,
  MessageSquare,
  Users,
  ShieldCheck,
  Plus,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { billingService } from '../../../services/billingService';
import type { UsageAndLimits, Subscription, PricingPlan } from '../types';

export const Billing: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [usageData, setUsageData] = useState<UsageAndLimits | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plan, setPlan] = useState<PricingPlan | null>(null);

  // Topup modal state
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState<number>(50);
  const [isTopupLoading, setIsTopupLoading] = useState(false);
  const [topupSuccess, setTopupSuccess] = useState(false);

  const loadBillingData = async () => {
    try {
      setLoading(true);
      const [subData, uData] = await Promise.all([
        billingService.getSubscription(),
        billingService.getUsage(),
      ]);
      setSubscription(subData.subscription);
      setPlan(subData.plan);
      setUsageData(uData);
    } catch (error) {
      console.error('Failed to load billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBillingData();
  }, []);

  const handleTopup = async () => {
    try {
      setIsTopupLoading(true);
      await billingService.topupCredits(topupAmount);
      setTopupSuccess(true);
      await loadBillingData();
      setTimeout(() => {
        setTopupSuccess(false);
        setIsTopupModalOpen(false);
      }, 1000);
    } catch (error) {
      console.error('Topup failed:', error);
      alert('Failed to top-up credits. Please try again.');
    } finally {
      setIsTopupLoading(false);
    }
  };

  const handleToggleCancel = async () => {
    if (!subscription) return;
    try {
      if (subscription.cancelAtPeriodEnd) {
        await billingService.resumeSubscription();
      } else {
        if (confirm('Are you sure you want to cancel your plan at the end of the billing period?')) {
          await billingService.cancelSubscription(false);
        } else {
          return;
        }
      }
      await loadBillingData();
    } catch (error) {
      console.error('Cancel/Resume failed:', error);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#05A222]" />
        </div>
      </PageContainer>
    );
  }

  const isCancelled = subscription?.cancelAtPeriodEnd;
  const isPaid = (plan?.priceMonthly || 0) > 0;

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#14201C] tracking-tight">
            Billing & Meta Conversation Credits
          </h2>
          <p className="text-sm sm:text-base text-[#5F7069] mt-1.5 font-medium">
            Manage your subscription plan, usage quotas, and Meta Cloud API conversation credits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate(ROUTES.BILLING_INVOICES)}
            className="text-sm font-semibold border-[#C4EBD0] text-[#006736] hover:bg-[#F6FAF8] rounded-xl"
          >
            Invoice History
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(ROUTES.BILLING_PLANS)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="text-sm font-bold px-4.5 py-2.5 rounded-xl shadow-sm"
          >
            Upgrade Plan
          </Button>
        </div>
      </div>

      {/* Top 3 Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* 1. Current Plan Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-[#5F7069] uppercase tracking-wider">
                Current Plan
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  isCancelled
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-[#E9F9EE] text-[#006736] border-[#C4EBD0]'
                }`}
              >
                {isCancelled ? 'Cancelling at Period End' : subscription?.status || 'ACTIVE'}
              </span>
            </div>
            <div className="text-3xl font-black text-[#14201C] mt-3">{plan?.name || 'Free Trial'}</div>
            <p className="text-sm text-[#5F7069] font-medium mt-1">
              ${subscription?.billingCycle === 'yearly' ? plan?.priceYearly : plan?.priceMonthly}.00 /{' '}
              {subscription?.billingCycle || 'month'}
              {subscription?.currentPeriodEnd && (
                <> • Renews {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="outline"
              size="md"
              className="flex-1 text-sm font-semibold rounded-xl"
              onClick={() => navigate(ROUTES.BILLING_PLANS)}
            >
              Change Plan
            </Button>
            {isPaid && (
              <Button
                variant="outline"
                size="md"
                onClick={handleToggleCancel}
                className="text-xs text-[#E53E3E] border-[#E2EAE6] hover:bg-red-50 rounded-xl"
              >
                {isCancelled ? 'Resume' : 'Cancel'}
              </Button>
            )}
          </div>
        </div>

        {/* 2. Meta Wallet Balance Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-[#5F7069] uppercase tracking-wider">
                Meta API Credit Wallet
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#E9F9EE] text-[#05A222] flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-[#05A222] mt-3">
              ${usageData?.creditsBalance?.toFixed(2) || '10.00'}
            </div>
            <p className="text-sm text-[#5F7069] font-medium mt-1">
              Used for Meta 24h conversation charges and template marketing blasts.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsTopupModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="w-full text-sm font-bold rounded-xl"
          >
            Add Conversation Credits
          </Button>
        </div>

        {/* 3. Payment Method Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-[#5F7069] uppercase tracking-wider">
                Payment Method
              </span>
              <CreditCard className="w-5 h-5 text-[#5F7069]" />
            </div>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-10 h-7 bg-[#14201C] rounded-lg flex items-center justify-center text-white text-[11px] font-black tracking-widest">
                VISA
              </div>
              <div>
                <div className="font-bold text-sm text-[#14201C]">•••• •••• •••• 4242</div>
                <div className="text-xs text-[#5F7069]">Expires 12/28 • Default</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#05A222] font-semibold bg-[#E9F9EE] p-2.5 rounded-xl">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Encrypted & Protected via Stripe PCI-DSS</span>
          </div>
        </div>
      </div>

      {/* Monthly Quota & Resource Usage Meters */}
      <div className="bg-white rounded-2xl border border-[#E2EAE6] p-6 shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2EAE6] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E9F9EE] text-[#05A222] flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#14201C]">Monthly Resource Quotas & Metering</h4>
              <p className="text-xs text-[#5F7069]">
                Billing cycle usage period: <strong>{usageData?.month}</strong>
              </p>
            </div>
          </div>

          <span className="text-xs text-[#5F7069]">
            Resets automatically on the 1st of each month.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Messages Quota */}
          <div className="p-4 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl space-y-3">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="flex items-center gap-1.5 text-[#14201C]">
                <MessageSquare className="w-3.5 h-3.5 text-[#05A222]" /> WhatsApp Messages
              </span>
              <span className="text-[#05A222]">
                {usageData?.metrics.messages.percent}% Used
              </span>
            </div>
            <div className="w-full h-3 bg-white border border-[#E2EAE6] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#05A222] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(usageData?.metrics.messages.percent || 0, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-[#5F7069] font-medium">
              <span>Used: <strong>{usageData?.metrics.messages.current.toLocaleString()}</strong></span>
              <span>Limit: <strong>{usageData?.metrics.messages.limit.toLocaleString()}</strong></span>
            </div>
          </div>

          {/* AI Tokens Quota */}
          <div className="p-4 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl space-y-3">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="flex items-center gap-1.5 text-[#14201C]">
                <Sparkles className="w-3.5 h-3.5 text-[#006736]" /> AI Token Processing
              </span>
              <span className="text-[#006736]">
                {usageData?.metrics.aiTokens.percent}% Used
              </span>
            </div>
            <div className="w-full h-3 bg-white border border-[#E2EAE6] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#006736] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(usageData?.metrics.aiTokens.percent || 0, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-[#5F7069] font-medium">
              <span>Used: <strong>{usageData?.metrics.aiTokens.current.toLocaleString()}</strong></span>
              <span>Limit: <strong>{usageData?.metrics.aiTokens.limit.toLocaleString()}</strong></span>
            </div>
          </div>

          {/* Contacts Quota */}
          <div className="p-4 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl space-y-3">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="flex items-center gap-1.5 text-[#14201C]">
                <Users className="w-3.5 h-3.5 text-[#07CF74]" /> CRM Audience Contacts
              </span>
              <span className="text-[#07CF74]">
                {usageData?.metrics.contacts.percent}% Used
              </span>
            </div>
            <div className="w-full h-3 bg-white border border-[#E2EAE6] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#07CF74] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(usageData?.metrics.contacts.percent || 0, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-[#5F7069] font-medium">
              <span>Stored: <strong>{usageData?.metrics.contacts.current.toLocaleString()}</strong></span>
              <span>Limit: <strong>{usageData?.metrics.contacts.limit.toLocaleString()}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Topup Modal */}
      {isTopupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14201C]/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#E2EAE6] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E9F9EE] text-[#05A222] flex items-center justify-center border border-[#C4EBD0]">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#14201C]">Add Meta Credits</h3>
                <p className="text-xs text-[#5F7069]">Instant conversation credits recharge</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[25, 50, 100].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setTopupAmount(amt)}
                  className={`py-3 rounded-xl font-black text-sm border cursor-pointer transition-all ${
                    topupAmount === amt
                      ? 'border-[#05A222] bg-[#E9F9EE] text-[#006736]'
                      : 'border-[#E2EAE6] text-[#14201C] hover:border-[#05A222]/30'
                  }`}
                >
                  +${amt}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2EAE6]">
              <Button variant="outline" size="md" onClick={() => setIsTopupModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleTopup}
                disabled={isTopupLoading}
                leftIcon={
                  isTopupLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : topupSuccess ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )
                }
              >
                {isTopupLoading ? 'Processing...' : topupSuccess ? 'Success!' : `Add $${topupAmount} Credits`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
