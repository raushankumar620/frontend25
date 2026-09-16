import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Button } from '../../../components/ui/Button';
import {
  Check,
  ArrowLeft,
  Sparkles,
  Zap,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import type { PricingPlan, Subscription } from '../types';
import { billingService } from '../../../services/billingService';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const Plans: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successModalPlan, setSuccessModalPlan] = useState<PricingPlan | null>(null);

  const loadPlansAndSub = async () => {
    try {
      setLoading(true);
      const [plansData, subData] = await Promise.all([
        billingService.getPlans(),
        billingService.getSubscription(),
      ]);
      setPlans(plansData);
      setSubscription(subData.subscription);
      if (subData.subscription?.billingCycle) {
        setBillingCycle(subData.subscription.billingCycle);
      }
    } catch (error) {
      console.error('Failed to load plans:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlansAndSub();
  }, []);

  const handleSelectPlan = async (plan: PricingPlan) => {
    if (subscription?.planCode === plan.code && subscription?.billingCycle === billingCycle) {
      return;
    }

    try {
      setActionLoading(plan.code);
      await billingService.changePlan(plan.code, billingCycle);
      setSuccessModalPlan(plan);
      await loadPlansAndSub();
    } catch (error) {
      console.error('Failed to switch plan:', error);
      alert('Failed to switch plan. Please try again.');
    } finally {
      setActionLoading(null);
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

  return (
    <PageContainer>
      {/* Back Button */}
      <button
        onClick={() => navigate(ROUTES.BILLING)}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#5F7069] hover:text-[#14201C] mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Billing Overview</span>
      </button>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9F9EE] text-[#006736] text-xs font-bold mb-3 border border-[#C4EBD0]">
          <Sparkles className="w-3.5 h-3.5 text-[#05A222]" />
          <span>Flexible Multi-Tier WhatsApp & AI Plans</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#14201C] tracking-tight">
          Transparent Pricing for Every Scale
        </h2>
        <p className="text-sm sm:text-base text-[#5F7069] mt-2 font-medium">
          Choose the right plan to superpower your customer engagement, AI deflection, and broadcast campaigns.
        </p>

        {/* Billing Cycle Switcher */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <div className="flex items-center gap-1 bg-[#F6FAF8] border border-[#E2EAE6] p-1.5 rounded-2xl">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white text-[#006736] shadow-xs border border-[#E2EAE6]'
                  : 'text-[#5F7069] hover:text-[#14201C]'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'yearly'
                  ? 'bg-white text-[#006736] shadow-xs border border-[#E2EAE6]'
                  : 'text-[#5F7069] hover:text-[#14201C]'
              }`}
            >
              <span>Yearly Billing</span>
              <span className="bg-[#E9F9EE] text-[#05A222] text-[10px] font-black px-2 py-0.5 rounded-md border border-[#C4EBD0]">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {plans.map((p) => {
          const isCurrent = subscription?.planCode === p.code;
          const isPopular = p.isPopular;
          const getINRPrice = (p: PricingPlan, cycle: 'monthly' | 'yearly') => {
            if (p.priceMonthly === 0) return 0;
            if (p.code === 'STARTER') return cycle === 'yearly' ? 19990 : 1999;
            if (p.code === 'GROWTH') return cycle === 'yearly' ? 49990 : 4999;
            if (p.code === 'ENTERPRISE') return cycle === 'yearly' ? 149990 : 14999;
            const base = cycle === 'yearly' ? (p.priceYearly || p.priceMonthly * 10) : p.priceMonthly;
            return base * 80;
          };
          const price = getINRPrice(p, billingCycle);
          const isActionLoading = actionLoading === p.code;

          return (
            <div
              key={p.code}
              className={`bg-white rounded-2xl p-6 border flex flex-col justify-between relative transition-all duration-200 ${
                isCurrent
                  ? 'border-emerald-600 ring-2 ring-emerald-600/20 shadow-lg'
                  : isPopular
                  ? 'border-emerald-700 shadow-md'
                  : 'border-slate-200 hover:border-emerald-600/40 shadow-xs'
              }`}
            >
              {isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-700 text-white text-[10px] font-black px-3.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Most Popular
                </span>
              )}

              {isCurrent && !isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                  Active Plan
                </span>
              )}

              <div>
                <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 min-h-[32px]">{p.description}</p>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono">
                    ₹{price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    / {billingCycle === 'yearly' ? 'year' : 'month'}
                  </span>
                </div>

                <div className="mt-6 pt-5 border-t border-[#E2EAE6] space-y-2.5">
                  <div className="text-xs font-bold text-[#14201C] mb-2 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-[#05A222]" /> Key Quotas:
                  </div>
                  <div className="text-xs text-[#5F7069] flex justify-between font-medium">
                    <span>Messages / mo:</span>
                    <strong className="text-[#14201C]">{p.limits.messagesPerMonth.toLocaleString()}</strong>
                  </div>
                  <div className="text-xs text-[#5F7069] flex justify-between font-medium">
                    <span>AI Tokens / mo:</span>
                    <strong className="text-[#14201C]">{p.limits.aiTokensPerMonth.toLocaleString()}</strong>
                  </div>
                  <div className="text-xs text-[#5F7069] flex justify-between font-medium">
                    <span>CRM Contacts:</span>
                    <strong className="text-[#14201C]">{p.limits.contactsLimit.toLocaleString()}</strong>
                  </div>
                  <div className="text-xs text-[#5F7069] flex justify-between font-medium">
                    <span>Team Seats:</span>
                    <strong className="text-[#14201C]">{p.limits.teamMembersLimit}</strong>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#E2EAE6] space-y-2">
                  <div className="text-xs font-bold text-[#14201C] mb-1">Included Features:</div>
                  {p.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#5F7069] font-medium">
                      <Check className="w-3.5 h-3.5 text-[#05A222] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <Button
                  className="w-full text-xs sm:text-sm font-bold rounded-xl"
                  variant={isCurrent ? 'outline' : isPopular ? 'primary' : 'outline'}
                  disabled={isCurrent || isActionLoading}
                  onClick={() => handleSelectPlan(p)}
                  leftIcon={isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
                >
                  {isCurrent ? 'Current Active Plan' : isActionLoading ? 'Activating...' : `Upgrade to ${p.name}`}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Success Confirmation Modal */}
      {successModalPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14201C]/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#E2EAE6] rounded-2xl w-full max-w-md p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#E9F9EE] text-[#05A222] flex items-center justify-center mx-auto border border-[#C4EBD0]">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-[#14201C]">Plan Switched Successfully!</h3>
            <p className="text-sm text-[#5F7069]">
              Your organization has been upgraded to <strong>{successModalPlan.name}</strong> on{' '}
              <strong>{billingCycle}</strong> billing. All higher quotas and features are active immediately.
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                className="w-full font-bold rounded-xl"
                onClick={() => setSuccessModalPlan(null)}
              >
                Continue to Dashboard
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
