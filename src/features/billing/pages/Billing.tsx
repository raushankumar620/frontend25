import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Button } from '../../../components/ui/Button';
import {
  Gift,
  Calendar,
  Building2,
  Check,
  Rocket,
  CreditCard,
  ShieldCheck,
  Receipt,
  Loader2,
  CheckCircle2,
  Wallet,
  Plus,
  Crown,
  Zap,
  Users,
  Smartphone,
  Sparkles,
  Download,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { billingService } from '../../../services/billingService';
import { useAuthStore } from '../../../store/authStore';
import { cashfreeService } from '../../../services/cashfreeService';
import { InvoiceModal } from '../components/InvoiceModal';
import { AutoPayModal } from '../components/AutoPayModal';
import type { UsageAndLimits, Subscription, PricingPlan, Invoice } from '../types';

export interface BillingProps {
  embedded?: boolean;
}

export const Billing: React.FC<BillingProps> = ({ embedded = false }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { organization, refreshProfile } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [usageData, setUsageData] = useState<UsageAndLimits | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plan, setPlan] = useState<PricingPlan | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showUpgradePlans, setShowUpgradePlans] = useState(false);

  // Checkout states
  const [selectedPlanCode, setSelectedPlanCode] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [activatedPlanName, setActivatedPlanName] = useState('');

  // Topup modal state
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isTopupLoading, setIsTopupLoading] = useState(false);

  // Invoice Receipt Modal State
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // AutoPay Modal State
  const [isAutoPayModalOpen, setIsAutoPayModalOpen] = useState(false);

  const handleOpenInvoice = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setIsInvoiceModalOpen(true);
  };

  const handleAutoPayUpdated = (updatedSub: Subscription) => {
    setSubscription(updatedSub);
  };

  // Real-time Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const loadBillingData = async () => {
    try {
      setLoading(true);
      const [subData, uData, invData] = await Promise.allSettled([
        billingService.getSubscription(),
        billingService.getUsage(),
        billingService.getInvoices(),
      ]);

      if (subData.status === 'fulfilled' && subData.value) {
        setSubscription(subData.value.subscription);
        setPlan(subData.value.plan);
      }
      if (uData.status === 'fulfilled' && uData.value) {
        setUsageData(uData.value);
      }
      if (invData.status === 'fulfilled' && Array.isArray(invData.value)) {
        setInvoices(invData.value);
      }
    } catch (error) {
      console.error('Failed to load billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBillingData();
  }, [organization?.id]);

  // Auto-verify if user returns from Cashfree redirect with order_id in URL
  const orderIdParam = searchParams.get('order_id');
  const planCodeParam = searchParams.get('plan_code');

  useEffect(() => {
    if (orderIdParam) {
      cashfreeService
        .verifyPayment(orderIdParam, planCodeParam || undefined)
        .then(async (res) => {
          if (res.success) {
            await refreshProfile();
            await loadBillingData();
            setActivatedPlanName(res.organization?.plan || 'Subscription Plan');
            setPaymentSuccess(true);
            searchParams.delete('order_id');
            searchParams.delete('plan_code');
            setSearchParams(searchParams, { replace: true });
          }
        })
        .catch((err) => {
          console.warn('Auto order verification result:', err.message);
        });
    }
  }, [orderIdParam]);

  // Dynamic Calculation based on user state
  const isPaidPlan = Boolean(
    (organization?.planStartsAt &&
      organization?.planEndsAt &&
      new Date(organization.planEndsAt) > new Date() &&
      organization?.plan !== 'FREE' &&
      organization?.plan !== 'TRIAL') ||
    (subscription?.status === 'ACTIVE' &&
      subscription?.planCode &&
      subscription?.planCode !== 'FREE' &&
      subscription?.planCode !== 'TRIAL')
  );

  const isTrialActive = Boolean(
    !isPaidPlan &&
    organization?.isTrialUsed &&
    organization?.trialEndsAt &&
    new Date(organization.trialEndsAt) > new Date()
  );

  const currentPlanCode = plan?.code || subscription?.planCode || organization?.plan || 'STARTER_1M';

  // Active Plan Dates (starts on exact payment date)
  const planStartDate = organization?.planStartsAt
    ? new Date(organization.planStartsAt)
    : subscription?.currentPeriodStart
    ? new Date(subscription.currentPeriodStart)
    : new Date();

  const planDurationDays =
    currentPlanCode === 'GROWTH_3M'
      ? 90
      : currentPlanCode === 'ENTERPRISE_1Y'
      ? 365
      : 30;

  const planEndDate = (() => {
    if (organization?.planEndsAt) {
      const dbEnd = new Date(organization.planEndsAt);
      // Auto-correct if DB had legacy 30-day value for a 3-month or 1-year plan
      if (currentPlanCode === 'GROWTH_3M' && (dbEnd.getTime() - planStartDate.getTime()) < 60 * 24 * 3600 * 1000) {
        return new Date(planStartDate.getTime() + 90 * 24 * 3600 * 1000);
      }
      if (currentPlanCode === 'ENTERPRISE_1Y' && (dbEnd.getTime() - planStartDate.getTime()) < 300 * 24 * 3600 * 1000) {
        return new Date(planStartDate.getTime() + 365 * 24 * 3600 * 1000);
      }
      return dbEnd;
    }
    return new Date(planStartDate.getTime() + planDurationDays * 24 * 60 * 60 * 1000);
  })();

  // Trial Dates
  const trialStartDate = organization?.trialStartsAt
    ? new Date(organization.trialStartsAt)
    : new Date();

  const trialEndDate = organization?.trialEndsAt
    ? new Date(organization.trialEndsAt)
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Real-time Countdown timer calculation
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      let targetTime = 0;

      if (isPaidPlan) {
        targetTime = planEndDate.getTime();
      } else if (isTrialActive) {
        targetTime = trialEndDate.getTime();
      } else {
        // Not started yet -> set static 7 days
        setTimeLeft({ days: 7, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const diff = targetTime - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [isPaidPlan, isTrialActive, organization?.planEndsAt, organization?.trialEndsAt]);

  const handleSelectPlan = async (planCode: string, planTitle: string) => {
    try {
      setSelectedPlanCode(planCode);
      setIsProcessingPayment(true);

      const orderData = await cashfreeService.createOrder(planCode);

      if (!orderData || !orderData.paymentSessionId) {
        throw new Error('Failed to initiate Cashfree payment session');
      }

      await cashfreeService.checkout(orderData.paymentSessionId);

      // Verify payment after checkout modal closes / confirms
      try {
        const verifyRes = await cashfreeService.verifyPayment(orderData.orderId, planCode);
        if (verifyRes.success) {
          await refreshProfile();
          await loadBillingData();
          setActivatedPlanName(planTitle);
          setPaymentSuccess(true);
        }
      } catch (verErr: any) {
        console.warn('Immediate verification result:', verErr?.message);
        await refreshProfile();
        await loadBillingData();
      }
    } catch (err: any) {
      console.error('Plan checkout error:', err);
      if (err?.message && !err.message.includes('closed')) {
        alert(err.message || 'Unable to open checkout gateway. Please try again.');
      }
    } finally {
      setIsProcessingPayment(false);
      setSelectedPlanCode(null);
    }
  };

  const handleTopup = async () => {
    const finalAmount = customAmount ? parseFloat(customAmount) : topupAmount;
    if (!finalAmount || finalAmount <= 0) {
      alert('Please enter a valid amount in INR (₹)');
      return;
    }

    try {
      setIsTopupLoading(true);
      await billingService.topupCredits(finalAmount);
      await loadBillingData();
      setIsTopupModalOpen(false);
      setCustomAmount('');
      alert(`₹${finalAmount.toLocaleString('en-IN')} added to your Meta Credits Wallet successfully!`);
    } catch (error: any) {
      console.error('Topup failed:', error);
      alert(error.message || 'Failed to top-up credits. Please try again.');
    } finally {
      setIsTopupLoading(false);
    }
  };

  if (loading) {
    const loadingView = (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#006736]" />
        <p className="text-xs font-semibold text-[#5F7069]">Loading Billing & Subscription details...</p>
      </div>
    );
    return embedded ? loadingView : <PageContainer>{loadingView}</PageContainer>;
  }

  const planDisplayName =
    currentPlanCode === 'GROWTH_3M'
      ? '3 Months Plan (Growth Business)'
      : currentPlanCode === 'ENTERPRISE_1Y'
      ? 'Enterprise Annual Plan (12 Months)'
      : currentPlanCode === 'STARTER_1M'
      ? 'Monthly Plan (Starter Pro)'
      : isPaidPlan
      ? (plan?.name || 'Active Subscription')
      : isTrialActive
      ? '7-Day Free Trial'
      : 'Free Plan';

  const planDisplayPrice =
    currentPlanCode === 'GROWTH_3M'
      ? '₹2,599 / 3 months'
      : currentPlanCode === 'ENTERPRISE_1Y'
      ? '₹15,999 / 12 months'
      : '₹1,599 / month';

  const isCurrentActive = (code: string) => {
    return currentPlanCode === code;
  };

  const mainContent = (
    <div className="w-full space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Action Bar (Wallet & Payment History) */}
      <div className="flex items-center justify-end gap-3">
        <Button
          variant="outline"
          size="md"
          onClick={() => setIsTopupModalOpen(true)}
          leftIcon={<Wallet className="w-4 h-4 text-[#006736]" />}
          className="text-xs font-bold border-[#E2EAE6] text-[#14201C] hover:bg-[#F6FAF8] rounded-xl px-4 py-2.5 cursor-pointer shadow-2xs"
        >
          Wallet: ₹{(usageData?.creditsBalance || (usageData?.metrics as any)?.metaBalance?.balance || 0).toLocaleString('en-IN')}
        </Button>

        <Button
          variant="outline"
          size="md"
          onClick={() => navigate(ROUTES.BILLING_INVOICES || '/billing/invoices')}
          leftIcon={<Receipt className="w-4 h-4 text-[#006736]" />}
          className="text-xs font-bold border-[#E2EAE6] text-[#14201C] hover:bg-[#F6FAF8] rounded-xl px-4 py-2.5 cursor-pointer shadow-2xs"
        >
          View Payment History
        </Button>
      </div>

      {/* 2. Top Banner Card (Active Paid Plan vs Trial vs Pending Connection) */}
      <div className="bg-[#E9F9EE] border border-[#C4EBD0] rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xs">
        {/* Left Side: Icon + Description */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#05A222] text-white flex items-center justify-center shrink-0 shadow-sm">
            {isPaidPlan ? <Crown className="w-6 h-6 text-white" /> : <Gift className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-bold text-[#14201C]">
                {isPaidPlan
                  ? `Active Subscription: ${planDisplayName}`
                  : isTrialActive
                  ? "You're on a 7-day Free Trial"
                  : 'Start Your 7-Day Free Trial'}
              </h3>
              {isPaidPlan ? (
                <span className="text-[10px] bg-[#006736] text-white font-bold px-2.5 py-0.5 rounded-full">
                  PAID ACTIVE
                </span>
              ) : isTrialActive ? (
                <span className="text-[10px] bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0] font-bold px-2.5 py-0.5 rounded-full">
                  TRIAL ACTIVE
                </span>
              ) : null}
            </div>

            <p className="text-xs sm:text-sm text-[#5F7069] mt-0.5 max-w-2xl leading-relaxed">
              {isPaidPlan ? (
                <>
                  Your subscription started on <strong>{formatDate(planStartDate)}</strong> and is valid until <strong>{formatDate(planEndDate)}</strong>.
                  <br className="hidden sm:inline" />
                  All premium WhatsApp messaging, broadcast templates, and AI workflows are fully active.
                </>
              ) : isTrialActive ? (
                <>
                  Your free trial started on <strong>{formatDate(trialStartDate)}</strong> and will end on <strong>{formatDate(trialEndDate)}</strong>.
                  <br className="hidden sm:inline" />
                  Connect your WhatsApp number and explore all features. No charges during trial.
                </>
              ) : (
                <>
                  Connect your WhatsApp Business Account (WABA ID & Phone Number) to automatically begin your 7-day free trial.
                  <br className="hidden sm:inline" />
                  No payment required now. Or choose a plan below to activate immediately.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Right Side: 4 Countdown Number Boxes */}
        <div className="flex flex-col items-start md:items-end shrink-0">
          <span className="text-[11px] font-bold text-[#006736] uppercase tracking-wider mb-1.5">
            {isPaidPlan
              ? 'Subscription renews in'
              : isTrialActive
              ? 'Trial ends in'
              : 'Trial starts on WhatsApp connect'}
          </span>
          <div className="flex items-center gap-2">
            {/* Days */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#C4EBD0] shadow-2xs flex items-center justify-center text-lg sm:text-xl font-black text-[#14201C] font-mono">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <span className="text-[10px] text-[#5F7069] font-semibold mt-1">Days</span>
            </div>

            {/* Hours */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#C4EBD0] shadow-2xs flex items-center justify-center text-lg sm:text-xl font-black text-[#14201C] font-mono">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <span className="text-[10px] text-[#5F7069] font-semibold mt-1">Hours</span>
            </div>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#C4EBD0] shadow-2xs flex items-center justify-center text-lg sm:text-xl font-black text-[#14201C] font-mono">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <span className="text-[10px] text-[#5F7069] font-semibold mt-1">Minues</span>
            </div>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#C4EBD0] shadow-2xs flex items-center justify-center text-lg sm:text-xl font-black text-[#14201C] font-mono">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <span className="text-[10px] text-[#5F7069] font-semibold mt-1">Seconds</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PAID USERS: Show Active Plan Summary & Resource Metering */}
      {isPaidPlan && (
        <div className="space-y-6">
          {/* Active Plan & AutoPay Controls Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Active Plan Summary */}
            <div className="lg:col-span-7 bg-white border border-[#E2EAE6] rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#5F7069] uppercase tracking-wider">
                    Current Plan
                  </span>
                  <span className="text-xs bg-[#E9F9EE] text-[#006736] font-black px-2.5 py-0.5 rounded-full border border-[#C4EBD0]">
                    Active & Verified
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#14201C]">
                  {planDisplayName}
                </h3>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-2xl font-black text-[#006736] font-mono">
                    {planDisplayPrice}
                  </span>
                  <span className="text-xs text-[#5F7069] font-medium">
                    • Renews on {formatDate(planEndDate)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant={showUpgradePlans ? 'primary' : 'outline'}
                  size="md"
                  onClick={() => setShowUpgradePlans(!showUpgradePlans)}
                  rightIcon={showUpgradePlans ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  className="text-xs font-bold rounded-xl px-5 py-2.5 cursor-pointer shadow-2xs"
                >
                  {showUpgradePlans ? 'Hide Upgrade Options' : 'Upgrade / Change Plan'}
                </Button>
              </div>
            </div>

            {/* Right: AutoPay Mandate & Recurring Billing Card */}
            <div className="lg:col-span-5 bg-[#F6FAF8] border border-[#E2EAE6] rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${subscription?.autoPay?.enabled !== false ? 'bg-[#006736] text-white' : 'bg-amber-600 text-white'}`}>
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black text-[#14201C] uppercase tracking-wider">
                      AutoPay Renewal
                    </span>
                  </div>

                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${subscription?.autoPay?.enabled !== false ? 'bg-[#E9F9EE] text-[#006736] border-[#C4EBD0]' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    {subscription?.autoPay?.enabled !== false ? '⚡ Active & Protected' : '⚠️ Paused'}
                  </span>
                </div>

                <p className="text-xs text-[#5F7069] leading-relaxed">
                  {subscription?.autoPay?.enabled !== false
                    ? `Automatic renewal scheduled on ${formatDate(planEndDate)} via UPI/Card e-Mandate.`
                    : 'AutoPay is currently paused. Service will stop unless renewed manually.'}
                </p>

                <div className="mt-3 p-3 bg-white border border-[#E2EAE6] rounded-xl flex items-center justify-between text-xs font-mono">
                  <span className="text-[#5F7069] text-[11px]">Mandate ID:</span>
                  <span className="font-bold text-[#14201C]">
                    {subscription?.autoPay?.mandateId || 'CF-MND-' + (subscription?.id || '982341').slice(-6)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E2EAE6]">
                <span className="text-[11px] text-[#5F7069] font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#05A222]" /> RBI e-Mandate
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAutoPayModalOpen(true)}
                  className="text-xs font-bold rounded-xl bg-white border-[#E2EAE6] text-[#006736] hover:bg-[#E9F9EE] cursor-pointer"
                >
                  Manage AutoPay
                </Button>
              </div>
            </div>

          </div>

          {/* Monthly Resource Quotas & Usage Metering */}
          <div className="bg-white rounded-3xl border border-[#E2EAE6] p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2EAE6] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E9F9EE] text-[#006736] flex items-center justify-center border border-[#C4EBD0]">
                  <Zap className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#14201C] tracking-tight">Monthly Resource Quotas & Metering</h4>
                  <p className="text-xs text-[#5F7069]">
                    Current usage billing period: <strong className="text-[#14201C]">{usageData?.month || new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</strong>
                  </p>
                </div>
              </div>
              <span className="text-xs text-[#5F7069]">
                Resets automatically every billing cycle.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Meter 1: Messages Quota */}
              <div className="p-4 bg-[#F6FAF8] border border-[#E2EAE6] rounded-2xl space-y-2.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-[#14201C]">
                    <Zap className="w-3.5 h-3.5 text-[#05A222]" /> Messages
                  </span>
                  <span className="text-[#006736] font-mono">
                    {usageData?.metrics?.messages?.percent || 0}%
                  </span>
                </div>
                <div className="w-full h-2 bg-[#E2EAE6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#05A222] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(usageData?.metrics?.messages?.percent || 0, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-[#5F7069]">
                  <span>Used: <strong className="text-[#14201C] font-mono">{(usageData?.metrics?.messages?.current || 0).toLocaleString()}</strong></span>
                  <span>Limit: <strong className="text-[#14201C] font-mono">{(usageData?.metrics?.messages?.limit || 50000).toLocaleString()}</strong></span>
                </div>
              </div>

              {/* Meter 2: Contacts Quota */}
              <div className="p-4 bg-[#F6FAF8] border border-[#E2EAE6] rounded-2xl space-y-2.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-[#14201C]">
                    <Users className="w-3.5 h-3.5 text-blue-600" /> CRM Contacts
                  </span>
                  <span className="text-blue-700 font-mono">
                    {usageData?.metrics?.contacts?.percent || 0}%
                  </span>
                </div>
                <div className="w-full h-2 bg-[#E2EAE6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(usageData?.metrics?.contacts?.percent || 0, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-[#5F7069]">
                  <span>Stored: <strong className="text-[#14201C] font-mono">{(usageData?.metrics?.contacts?.current || 0).toLocaleString()}</strong></span>
                  <span>Limit: <strong className="text-[#14201C] font-mono">{(usageData?.metrics?.contacts?.limit || 25000).toLocaleString()}</strong></span>
                </div>
              </div>

              {/* Meter 3: Connected WhatsApp Numbers */}
              <div className="p-4 bg-[#F6FAF8] border border-[#E2EAE6] rounded-2xl space-y-2.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-[#14201C]">
                    <Smartphone className="w-3.5 h-3.5 text-purple-600" /> WhatsApp Numbers
                  </span>
                  <span className="text-purple-700 font-mono">1 / {organization?.limits?.maxNumbers || 5}</span>
                </div>
                <div className="w-full h-2 bg-[#E2EAE6] rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full w-1/5" />
                </div>
                <div className="flex justify-between text-[11px] text-[#5F7069]">
                  <span>Active: <strong className="text-[#14201C]">1 Number</strong></span>
                  <span>Max: <strong className="text-[#14201C]">{organization?.limits?.maxNumbers || 5} Numbers</strong></span>
                </div>
              </div>

              {/* Meter 4: AI Containment Tokens */}
              <div className="p-4 bg-[#F6FAF8] border border-[#E2EAE6] rounded-2xl space-y-2.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-[#14201C]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> AI Agent Tokens
                  </span>
                  <span className="text-amber-700 font-mono">
                    {usageData?.metrics?.aiTokens?.percent || 0}%
                  </span>
                </div>
                <div className="w-full h-2 bg-[#E2EAE6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(usageData?.metrics?.aiTokens?.percent || 0, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-[#5F7069]">
                  <span>Used: <strong className="text-[#14201C] font-mono">{(usageData?.metrics?.aiTokens?.current || 0).toLocaleString()}</strong></span>
                  <span>Limit: <strong className="text-[#14201C] font-mono">{(usageData?.metrics?.aiTokens?.limit || 500000).toLocaleString()}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Invoices & Tax Receipts */}
          <div className="bg-white rounded-3xl border border-[#E2EAE6] p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#E2EAE6] pb-4">
              <div>
                <h4 className="text-base font-bold text-[#14201C] tracking-tight">Recent Invoices & GST Receipts</h4>
                <p className="text-xs text-[#5F7069]">Official tax invoices for subscription renewals and payments</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(ROUTES.BILLING_INVOICES || '/billing/invoices')}
                className="text-xs font-semibold rounded-xl"
              >
                View All Invoices
              </Button>
            </div>

            {invoices.length === 0 ? (
              <div className="p-8 text-center bg-[#F6FAF8] rounded-2xl border border-[#E2EAE6] space-y-2">
                <FileText className="w-8 h-8 text-[#5F7069] mx-auto" />
                <p className="text-xs font-bold text-[#14201C]">No invoices generated yet</p>
                <p className="text-[11px] text-[#5F7069]">Invoices will appear here automatically upon plan renewal or credit recharge.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E2EAE6] text-[#5F7069] font-bold uppercase tracking-wider text-[11px] bg-[#F6FAF8]">
                      <th className="py-3 px-4">Invoice Number</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Amount (INR)</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2EAE6]/60">
                    {invoices.slice(0, 5).map((inv) => {
                      const cleanDescription = (inv.description || inv.billingReason || '').replace(/\s*\(\s*undefined\s+Month\(s\)\s*\)/gi, '').trim();
                      return (
                        <tr
                          key={inv.id || inv.invoiceNumber}
                          onClick={() => handleOpenInvoice(inv)}
                          className="hover:bg-[#F6FAF8] transition-colors cursor-pointer"
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-[#14201C]">
                            <div className="flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-[#05A222]" />
                              <span>{inv.invoiceNumber}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-[#5F7069]">{new Date(inv.paidAt || inv.createdAt).toLocaleDateString('en-IN')}</td>
                          <td className="py-3.5 px-4 text-[#14201C] font-medium">{cleanDescription}</td>
                          <td className="py-3.5 px-4 font-mono font-bold text-[#14201C]">
                            ₹{(inv.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]">
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleOpenInvoice(inv)}
                              className="inline-flex items-center gap-1 text-xs text-[#006736] hover:text-[#05A222] font-bold bg-[#E9F9EE] hover:bg-[#d8f5e1] border border-[#C4EBD0] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" /> PDF / Print
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Choose Your Plan Section (Shown when NOT paid OR when user clicks "Upgrade / Change Plan") */}
      {(!isPaidPlan || showUpgradePlans) && (
        <div className="space-y-4 pt-4 border-t border-[#E2EAE6] animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#14201C] tracking-tight">
                {isPaidPlan ? 'Upgrade to a Higher Plan' : 'Choose Your Plan'}
              </h3>
              <p className="text-xs sm:text-sm text-[#5F7069] mt-0.5">
                Select the plan that fits your business scale. Instant activation via Cashfree PG.
              </p>
            </div>

            {/* Monthly / Yearly Toggle */}
            <div className="flex items-center gap-2 p-1 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-[#006736] text-white shadow-2xs'
                    : 'text-[#5F7069] hover:text-[#14201C]'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === 'yearly'
                    ? 'bg-[#006736] text-white shadow-2xs'
                    : 'text-[#5F7069] hover:text-[#14201C]'
                }`}
              >
                <span>Yearly</span>
                <span className="text-[10px] bg-[#E9F9EE] text-[#006736] font-bold px-1.5 py-0.2 rounded-full border border-[#C4EBD0]">
                  Save up to 20%
                </span>
              </button>
            </div>
          </div>

          {/* 3 Pricing Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
            {/* Plan 1: Monthly Plan */}
            <div className="bg-white border border-[#E2EAE6] rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_8px_30px_rgba(1,59,35,0.03)] hover:border-[#006736]/40 transition-all">
              <div className="space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-[#14201C]">Monthly Plan</h4>
                    <p className="text-xs text-[#5F7069] mt-0.5">Perfect for small businesses</p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-[#E9F9EE] text-[#006736] flex items-center justify-center border border-[#C4EBD0]">
                    <Calendar className="w-5 h-5 text-[#05A222]" />
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-[#14201C] font-mono">
                      ₹1,599
                    </span>
                    <span className="text-xs text-[#5F7069] font-medium">/ month</span>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#E2EAE6] text-xs text-[#14201C]">
                  {[
                    'All core messaging features',
                    'Upto 10,000 messages/month',
                    '1 WhatsApp number',
                    'Basic automation',
                    'Standard support',
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-[#05A222] text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="font-medium text-[#14201C]">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E2EAE6]">
                <button
                  type="button"
                  onClick={() => handleSelectPlan('STARTER_1M', 'Monthly Plan')}
                  disabled={isProcessingPayment || isCurrentActive('STARTER_1M')}
                  className={`w-full py-3 px-4 rounded-xl border-2 font-bold text-xs sm:text-sm transition-all cursor-pointer text-center shadow-2xs ${
                    isCurrentActive('STARTER_1M')
                      ? 'border-[#05A222] bg-[#E9F9EE] text-[#006736] cursor-default'
                      : 'border-[#E2EAE6] hover:border-[#006736] text-[#14201C] hover:text-[#006736] hover:bg-[#F6FAF8]'
                  }`}
                >
                  {selectedPlanCode === 'STARTER_1M' ? 'Opening Gateway...' : isCurrentActive('STARTER_1M') ? 'Current Active Plan' : 'Choose Plan'}
                </button>
              </div>
            </div>

            {/* Plan 2: 3 Months Plan (Most Popular Highlighted Card) */}
            <div className="relative bg-white border-2 border-[#006736] rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_12px_40px_rgba(0,103,54,0.08)]">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#006736] text-white text-[11px] font-black px-4 py-1 rounded-full shadow-sm tracking-wide">
                Most Popular
              </div>

              <div className="space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-[#14201C]">3 Months Plan</h4>
                    <p className="text-xs text-[#5F7069] mt-0.5">Great value for growing businesses</p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-[#E9F9EE] text-[#006736] flex items-center justify-center border border-[#C4EBD0]">
                    <Calendar className="w-5 h-5 text-[#05A222]" />
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-[#14201C] font-mono">
                      ₹2,599
                    </span>
                    <span className="text-xs text-[#5F7069] font-medium">/ 3 months</span>
                  </div>
                  <div className="text-xs text-[#5F7069] font-medium mt-0.5">
                    ₹866 per month <strong className="text-[#05A222] font-bold">(Save 46%)</strong>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#E2EAE6] text-xs text-[#14201C]">
                  {[
                    'All core messaging features',
                    'Upto 50,000 messages/month',
                    'Multiple WhatsApp numbers',
                    'Advanced automation',
                    'Priority support',
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-[#05A222] text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="font-medium text-[#14201C]">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E2EAE6]">
                <button
                  type="button"
                  onClick={() => handleSelectPlan('GROWTH_3M', '3 Months Plan')}
                  disabled={isProcessingPayment || isCurrentActive('GROWTH_3M')}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md text-center ${
                    isCurrentActive('GROWTH_3M')
                      ? 'bg-[#E9F9EE] border-2 border-[#006736] text-[#006736] cursor-default'
                      : 'bg-[#006736] hover:bg-[#05A222] text-white cursor-pointer'
                  }`}
                >
                  {selectedPlanCode === 'GROWTH_3M' ? 'Opening Gateway...' : isCurrentActive('GROWTH_3M') ? 'Current Active Plan' : 'Choose Plan'}
                </button>
              </div>
            </div>

            {/* Plan 3: Enterprise Plan */}
            <div className="bg-white border border-[#E2EAE6] rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_8px_30px_rgba(1,59,35,0.03)] hover:border-[#006736]/40 transition-all">
              <div className="space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-[#14201C]">Enterprise Plan</h4>
                    <p className="text-xs text-[#5F7069] mt-0.5">For large teams & custom needs</p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-[#E9F9EE] text-[#006736] flex items-center justify-center border border-[#C4EBD0]">
                    <Building2 className="w-5 h-5 text-[#05A222]" />
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-[#14201C] font-mono">
                      ₹15,999
                    </span>
                    <span className="text-xs text-[#5F7069] font-medium">/ 12 months</span>
                  </div>
                  <div className="text-xs text-[#5F7069] font-medium mt-0.5">
                    ₹1,333 per month <strong className="text-[#05A222] font-bold">(Save 17%)</strong>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#E2EAE6] text-xs text-[#14201C]">
                  {[
                    'Unlimited messages*',
                    'Multiple WhatsApp numbers',
                    'Advanced automation & AI',
                    'Team members & role management',
                    'Dedicated account manager',
                    'Priority support',
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-[#05A222] text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="font-medium text-[#14201C]">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E2EAE6]">
                <button
                  type="button"
                  onClick={() => handleSelectPlan('ENTERPRISE_1Y', 'Enterprise Plan')}
                  disabled={isProcessingPayment || isCurrentActive('ENTERPRISE_1Y')}
                  className={`w-full py-3 px-4 rounded-xl border-2 font-bold text-xs sm:text-sm transition-all cursor-pointer text-center shadow-2xs ${
                    isCurrentActive('ENTERPRISE_1Y')
                      ? 'border-[#05A222] bg-[#E9F9EE] text-[#006736] cursor-default'
                      : 'border-[#E2EAE6] hover:border-[#006736] text-[#14201C] hover:text-[#006736] hover:bg-[#F6FAF8]'
                  }`}
                >
                  {selectedPlanCode === 'ENTERPRISE_1Y' ? 'Opening Gateway...' : isCurrentActive('ENTERPRISE_1Y') ? 'Current Active Plan' : 'Choose Plan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Bottom 3 Value Props */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#05A222] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#14201C]">Start with 7 Days Free Trial</h4>
            <p className="text-xs text-[#5F7069] mt-0.5 leading-relaxed">
              Once you connect your WhatsApp number, your 7-day free trial will automatically begin. No payment required now.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#05A222] text-white flex items-center justify-center shrink-0 shadow-sm">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#14201C]">Simple & Secure Payment</h4>
            <p className="text-xs text-[#5F7069] mt-0.5 leading-relaxed">
              Pay securely using Cashfree. Supports UPI, Cards, Net Banking and more.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#05A222] text-white flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#14201C]">No Hidden Charges</h4>
            <p className="text-xs text-[#5F7069] mt-0.5 leading-relaxed">
              Transparent pricing. You only pay for what you use.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Success Modal */}
      {paymentSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14201C]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#E2EAE6] rounded-3xl w-full max-w-md p-8 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#E9F9EE] text-[#05A222] flex items-center justify-center mx-auto border-4 border-[#C4EBD0]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs bg-[#E9F9EE] text-[#006736] font-black px-3 py-1 rounded-full border border-[#C4EBD0]">
                Payment Verified
              </span>
              <h3 className="text-2xl font-black text-[#14201C] mt-3">Subscription Activated!</h3>
              <p className="text-xs text-[#5F7069] mt-1">
                Your organization has successfully upgraded to <strong>{activatedPlanName}</strong>. All features & quotas are unlocked.
              </p>
            </div>

            <div className="p-4 bg-[#F6FAF8] border border-[#E2EAE6] rounded-2xl text-xs space-y-1 text-left">
              <div className="flex justify-between">
                <span className="text-[#5F7069]">Invoice Generated:</span>
                <strong className="text-[#05A222]">GST Receipt Ready</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F7069]">Gateway:</span>
                <strong className="text-[#14201C]">Cashfree PG (Instant)</strong>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => setPaymentSuccess(false)}
              className="w-full text-xs font-bold rounded-xl"
            >
              Continue to Dashboard
            </Button>
          </div>
        </div>
      )}

      {/* 7. Meta Wallet Recharge Modal */}
      {isTopupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14201C]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#E2EAE6] rounded-3xl w-full max-w-lg p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EAE6]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E9F9EE] text-[#006736] flex items-center justify-center border border-[#C4EBD0]">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#14201C]">Recharge Meta Credits (₹ INR)</h3>
                  <p className="text-xs text-[#5F7069]">Instant conversation recharge for WhatsApp marketing & broadcasts</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTopupModalOpen(false)}
                className="text-[#5F7069] hover:text-[#14201C] p-1.5 rounded-lg hover:bg-[#F6FAF8] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick selectors */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#14201C]">Select Amount</label>
              <div className="grid grid-cols-3 gap-2.5">
                {[500, 1000, 2500, 5000, 10000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setTopupAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm border cursor-pointer transition-all ${
                      topupAmount === amt && !customAmount
                        ? 'border-[#006736] bg-[#E9F9EE] text-[#006736] shadow-2xs font-mono'
                        : 'border-[#E2EAE6] text-[#14201C] hover:border-[#006736]/40 font-mono'
                    }`}
                  >
                    +₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#14201C]">Or Enter Custom Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#5F7069]">₹</span>
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-[#E2EAE6] text-xs sm:text-sm font-mono font-bold text-[#14201C] focus:outline-none focus:ring-2 focus:ring-[#05A222]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2EAE6]">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsTopupModalOpen(false)}
                className="text-xs font-semibold rounded-xl"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleTopup}
                disabled={isTopupLoading}
                className="text-xs font-bold rounded-xl shadow-xs"
                leftIcon={isTopupLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              >
                {isTopupLoading ? 'Adding Credits...' : `Pay & Add ₹${(customAmount ? parseFloat(customAmount) || 0 : topupAmount).toLocaleString('en-IN')}`}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Branded Official Invoice Modal (Screen Popup + Instant A4 Print) */}
      <InvoiceModal
        invoice={selectedInvoice}
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
      />

      {/* AutoPay & Recurring Mandate Management Modal */}
      <AutoPayModal
        isOpen={isAutoPayModalOpen}
        onClose={() => setIsAutoPayModalOpen(false)}
        subscription={subscription}
        onAutoPayUpdated={handleAutoPayUpdated}
      />
    </div>
  );

  return embedded ? mainContent : <PageContainer>{mainContent}</PageContainer>;
};
