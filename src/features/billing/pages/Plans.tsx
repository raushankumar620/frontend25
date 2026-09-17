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
  CreditCard,
  Clock,
  ShieldCheck,
  Crown,
} from 'lucide-react';
import type { PricingPlan, Subscription } from '../types';
import { billingService } from '../../../services/billingService';
import { cashfreeService } from '../../../services/cashfreeService';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const Plans: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [orgData, setOrgData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successModalPlan, setSuccessModalPlan] = useState<PricingPlan | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const loadPlansAndSub = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const [plansData, subData] = await Promise.all([
        billingService.getPlans(),
        billingService.getSubscription(),
      ]);
      setPlans(plansData);
      setSubscription(subData.subscription);
      setOrgData((subData as any).organization);
    } catch (error: any) {
      console.error('Failed to load plans:', error);
      setErrorMessage(error.message || 'Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlansAndSub();
  }, []);

  const handleCashfreeCheckout = async (plan: PricingPlan) => {
    try {
      setActionLoading(plan.code);
      setErrorMessage('');

      // 1. Create order on backend via Cashfree API
      const order = await cashfreeService.createOrder(plan.code);

      // 2. Open Cashfree Checkout Modal
      await cashfreeService.checkout(order.paymentSessionId);

      // 3. Verify Payment with backend
      const result = await cashfreeService.verifyPayment(order.orderId, plan.code);

      if (result.success) {
        setSuccessModalPlan(plan);
        await loadPlansAndSub();
      }
    } catch (error: any) {
      console.error('Cashfree Checkout failed:', error);
      // If user closed modal or cancelled, handle gracefully
      if (error.message && !error.message.includes('closed')) {
        setErrorMessage(error.message || 'Payment could not be completed. Please try again.');
      }
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

  const isTrialActive = orgData?.isTrialActive;
  const trialDaysRemaining = orgData?.trialDaysRemaining || 0;

  return (
    <PageContainer>
      {/* Back Button */}
      <button
        onClick={() => navigate(ROUTES.BILLING)}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#5F7069] hover:text-[#14201C] mb-6 cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Billing Overview</span>
      </button>

      {/* Trial Banner */}
      {isTrialActive && (
        <div className="mb-8 p-4 bg-gradient-to-r from-[#E9F9EE] to-[#DCFCE7] border border-[#05A222]/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#05A222] text-white flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#14201C]">
                🎉 7-Day Free Trial Active ({trialDaysRemaining} Day{trialDaysRemaining === 1 ? '' : 's'} Remaining)
              </h4>
              <p className="text-xs text-[#5F7069]">
                All WhatsApp messaging, broadcast, and AI agent features are fully unlocked during your trial.
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-[#006736] bg-white px-3 py-1.5 rounded-xl border border-[#C4EBD0] shadow-2xs">
            Trial Active
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E9F9EE] text-[#006736] text-xs font-bold mb-3 border border-[#C4EBD0]">
          <Sparkles className="w-3.5 h-3.5 text-[#05A222]" />
          <span>Transparent WhatsApp Business Cloud Plans</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#14201C] tracking-tight">
          Choose the Perfect Growth Plan
        </h2>
        <p className="text-sm sm:text-base text-[#5F7069] mt-2 font-medium">
          Instant activation via Cashfree Payment Gateway (UPI, Cards, Netbanking & Wallets). No hidden fees.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {plans.map((p) => {
          const isCurrent = subscription?.planCode === p.code && subscription?.status === 'ACTIVE';
          const isPopular = p.isPopular || p.code === 'GROWTH_3M';
          const isEnterprise = p.code === 'ENTERPRISE_1Y';

          const displayPrice = p.code === 'STARTER_1M'
            ? 1599
            : p.code === 'GROWTH_3M'
            ? 2599
            : 15999;

          const durationText = p.code === 'STARTER_1M'
            ? 'for 1 Month'
            : p.code === 'GROWTH_3M'
            ? 'total for 3 Months'
            : 'total for 1 Year';

          const perMonthBadge = p.code === 'GROWTH_3M'
            ? '₹866 / month'
            : p.code === 'ENTERPRISE_1Y'
            ? '₹1,333 / month'
            : null;

          const isActionLoading = actionLoading === p.code;

          return (
            <div
              key={p.code}
              className={`bg-white rounded-3xl p-6 sm:p-7 border flex flex-col justify-between relative transition-all duration-200 ${
                isPopular
                  ? 'border-[#05A222] shadow-[0_12px_40px_rgba(5,162,34,0.12)] ring-2 ring-[#05A222]/20'
                  : isEnterprise
                  ? 'border-slate-800 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'
                  : 'border-[#E2EAE6] hover:border-[#05A222]/40 shadow-xs'
              }`}
            >
              {isPopular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#013B23] to-[#006736] text-[#6AEB31] text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5 border border-[#05A222]/30">
                  <Sparkles className="w-3.5 h-3.5" /> Most Popular • 45% OFF
                </span>
              )}

              {isEnterprise && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-400" /> Enterprise Best Value
                </span>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[#14201C]">{p.name}</h3>
                </div>
                <p className="text-xs text-[#5F7069] mt-1.5 line-clamp-2 min-h-[32px] font-medium">{p.description}</p>

                <div className="mt-5 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-[#14201C] font-mono">
                    ₹{displayPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-[#5F7069] font-semibold">
                    {durationText}
                  </span>
                </div>

                {perMonthBadge && (
                  <div className="mt-1.5">
                    <span className="inline-flex items-center text-[11px] font-bold text-[#05A222] bg-[#E9F9EE] px-2.5 py-0.5 rounded-md border border-[#C4EBD0]">
                      Effective: {perMonthBadge}
                    </span>
                  </div>
                )}

                {/* Quotas */}
                <div className="mt-6 pt-5 border-t border-[#E2EAE6] space-y-2.5">
                  <div className="text-xs font-bold text-[#14201C] mb-2 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#05A222]" /> Key Quotas & Limits:
                  </div>
                  <div className="text-xs text-[#5F7069] flex justify-between font-medium">
                    <span>WhatsApp Messages:</span>
                    <strong className="text-[#14201C]">{p.limits?.messagesPerMonth?.toLocaleString()} / mo</strong>
                  </div>
                  <div className="text-xs text-[#5F7069] flex justify-between font-medium">
                    <span>Connected Numbers:</span>
                    <strong className="text-[#14201C]">{(p as any).limits?.maxNumbers || 1} Number{(p as any).limits?.maxNumbers > 1 ? 's' : ''}</strong>
                  </div>
                  <div className="text-xs text-[#5F7069] flex justify-between font-medium">
                    <span>CRM Contacts:</span>
                    <strong className="text-[#14201C]">{p.limits?.contactsLimit?.toLocaleString()}</strong>
                  </div>
                  <div className="text-xs text-[#5F7069] flex justify-between font-medium">
                    <span>Team Members:</span>
                    <strong className="text-[#14201C]">{p.limits?.teamMembersLimit} Seats</strong>
                  </div>
                </div>

                {/* Feature checklist */}
                <div className="mt-5 pt-4 border-t border-[#E2EAE6] space-y-2">
                  <div className="text-xs font-bold text-[#14201C] mb-1">Included Features:</div>
                  {p.features?.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#5F7069] font-medium">
                      <Check className="w-3.5 h-3.5 text-[#05A222] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <Button
                  className="w-full text-xs sm:text-sm font-bold rounded-2xl py-3 cursor-pointer shadow-xs"
                  variant={isCurrent ? 'outline' : isPopular ? 'primary' : 'outline'}
                  disabled={isCurrent || isActionLoading}
                  onClick={() => handleCashfreeCheckout(p)}
                  leftIcon={isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                >
                  {isCurrent
                    ? 'Current Active Plan'
                    : isActionLoading
                    ? 'Opening Cashfree...'
                    : `Pay ₹${displayPrice.toLocaleString('en-IN')} with Cashfree`}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security & Guarantee Footer */}
      <div className="p-6 bg-[#F6FAF8] border border-[#E2EAE6] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5F7069] mb-8">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-[#05A222] shrink-0" />
          <span>
            <strong>100% Secure Checkout via Cashfree PG:</strong> All transactions are protected with 256-bit encryption. Supports UPI, Cards, Netbanking, and Wallets.
          </span>
        </div>
      </div>

      {/* Success Confirmation Modal */}
      {successModalPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14201C]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#E2EAE6] rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#E9F9EE] text-[#05A222] flex items-center justify-center mx-auto border border-[#C4EBD0]">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-black text-[#14201C]">Payment Successful!</h3>
            <p className="text-sm text-[#5F7069]">
              Your organization has been upgraded to <strong>{successModalPlan.name}</strong>. All WhatsApp message quotas and features are now fully activated.
            </p>
            <div className="pt-3">
              <Button
                variant="primary"
                size="md"
                className="w-full font-bold rounded-2xl py-3"
                onClick={() => {
                  setSuccessModalPlan(null);
                  navigate(ROUTES.BILLING);
                }}
              >
                Go to Billing Overview
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
