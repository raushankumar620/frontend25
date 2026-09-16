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
  Download,
  Smartphone,
  Info,
  FileText,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { billingService } from '../../../services/billingService';
import { whatsappService } from '../../../services/whatsappService';
import { useAuthStore } from '../../../store/authStore';
import type { UsageAndLimits, Subscription, PricingPlan, Invoice } from '../types';
import clsx from 'clsx';

export interface BillingProps {
  embedded?: boolean;
}

export const Billing: React.FC<BillingProps> = ({ embedded = false }) => {
  const navigate = useNavigate();
  const { organization } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [usageData, setUsageData] = useState<UsageAndLimits | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plan, setPlan] = useState<PricingPlan | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [channelCount, setChannelCount] = useState<number>(0);

  // Topup modal state (in ₹ INR)
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isTopupLoading, setIsTopupLoading] = useState(false);
  const [topupSuccess, setTopupSuccess] = useState(false);
  const [topupSuccessMsg, setTopupSuccessMsg] = useState('');

  const loadBillingData = async () => {
    try {
      setLoading(true);
      const [subData, uData, invData, numbers] = await Promise.allSettled([
        billingService.getSubscription(),
        billingService.getUsage(),
        billingService.getInvoices(),
        whatsappService.getNumbers(),
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
      if (numbers.status === 'fulfilled' && Array.isArray(numbers.value)) {
        setChannelCount(numbers.value.length);
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

  const handleTopup = async () => {
    const finalAmount = customAmount ? parseFloat(customAmount) : topupAmount;
    if (!finalAmount || finalAmount <= 0) {
      alert('Please enter a valid amount in INR (₹)');
      return;
    }

    try {
      setIsTopupLoading(true);
      await billingService.topupCredits(finalAmount);
      setTopupSuccess(true);
      setTopupSuccessMsg(`₹${finalAmount.toLocaleString('en-IN')} added to your Meta Credits Wallet successfully!`);
      await loadBillingData();
      setTimeout(() => {
        setTopupSuccess(false);
        setIsTopupModalOpen(false);
        setCustomAmount('');
      }, 1500);
    } catch (error: any) {
      console.error('Topup failed:', error);
      alert(error.message || 'Failed to top-up credits. Please try again.');
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
        if (confirm('Are you sure you want to cancel your plan at the end of the current billing cycle?')) {
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

  const getINRPrice = (usdPrice: number | undefined, planCode: string | undefined) => {
    if (!usdPrice || usdPrice === 0) return 0;
    if (planCode === 'STARTER') return 1999;
    if (planCode === 'GROWTH') return 4999;
    if (planCode === 'ENTERPRISE') return 14999;
    return usdPrice * 80;
  };

  if (loading) {
    const loadingView = (
      <div className="flex flex-col items-center justify-center min-h-[350px] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-xs font-semibold text-slate-500">Loading live billing & subscription data...</p>
      </div>
    );
    return embedded ? loadingView : <PageContainer>{loadingView}</PageContainer>;
  }

  const isCancelled = subscription?.cancelAtPeriodEnd;
  const isPaid = (plan?.priceMonthly || 0) > 0;
  const inrMonthlyPrice = getINRPrice(plan?.priceMonthly, plan?.code);
  const inrYearlyPrice = plan?.priceYearly ? plan.priceYearly * 80 : inrMonthlyPrice * 10;
  const currentPrice = subscription?.billingCycle === 'yearly' ? inrYearlyPrice : inrMonthlyPrice;

  // Dynamic Channel Quota
  const maxChannels = organization?.limits?.maxNumbers || 5;
  const channelsPercent = Math.min(Math.round((channelCount / maxChannels) * 100), 100);

  const mainContent = (
    <div className="w-full space-y-7 animate-in fade-in duration-150">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Billing & Meta Conversation Credits
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              ₹ INR (India)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Manage your subscription plan, usage quotas, and Meta Cloud API conversation credits in Indian Rupees.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.BILLING_INVOICES || '/billing/invoices')}
            className="text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl"
            leftIcon={<FileText className="w-3.5 h-3.5 text-slate-500" />}
          >
            GST Invoices
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(ROUTES.BILLING_PLANS || '/billing/plans')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="text-xs font-bold px-4 py-2 rounded-xl shadow-xs"
          >
            Upgrade / Change Plan
          </Button>
        </div>
      </div>

      {/* 2. Top 3 Primary Cards Grid (₹ INR) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Active Subscription Plan */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Current Plan
              </span>
              <span
                className={clsx(
                  'text-xs font-bold px-2.5 py-0.5 rounded-full border',
                  isCancelled
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                )}
              >
                {isCancelled ? 'Cancelling at Period End' : subscription?.status || 'ACTIVE'}
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
              {plan?.name || 'Free Trial'}
            </div>

            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-emerald-700 font-mono">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                / {subscription?.billingCycle || 'month'} + 18% GST
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-1">
              {subscription?.currentPeriodEnd ? (
                <>Next billing date: <strong>{new Date(subscription.currentPeriodEnd).toLocaleDateString('en-IN')}</strong></>
              ) : (
                'Auto-renews every month'
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs font-semibold rounded-xl"
              onClick={() => navigate(ROUTES.BILLING_PLANS || '/billing/plans')}
            >
              Change Plan
            </Button>
            {isPaid && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleCancel}
                className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50 rounded-xl"
              >
                {isCancelled ? 'Resume' : 'Cancel'}
              </Button>
            )}
          </div>
        </div>

        {/* Card 2: Meta Cloud API Credit Wallet (₹ INR) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Meta API Credit Wallet
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <Wallet className="w-4 h-4" />
              </div>
            </div>

            <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-3 font-mono">
              ₹{(usageData?.creditsBalance ? usageData.creditsBalance * 80 : 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>

            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
              Available conversation balance for WhatsApp template marketing broadcasts and 24h Meta Cloud API sessions.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsTopupModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
              className="w-full text-xs font-bold rounded-xl shadow-xs"
            >
              + Add Conversation Credits (₹)
            </Button>
          </div>
        </div>

        {/* Card 3: Indian Payment Gateway & GST Compliance */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Payment Gateway & GST
              </span>
              <CreditCard className="w-5 h-5 text-slate-400" />
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                  UPI / QR (GPay, PhonePe, Paytm)
                </span>
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                  Cards / NetBanking
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium pt-1">
                Official Indian Payment Processing via Razorpay / Stripe India.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200/80">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>GST Input Tax Credit (ITC) 18% Invoices Generated</span>
          </div>
        </div>
      </div>

      {/* 3. Monthly Resource Quotas & Live Metering */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <Zap className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 tracking-tight">Monthly Resource Quotas & Metering</h4>
              <p className="text-xs text-slate-500">
                Current usage billing period: <strong className="text-slate-700">{usageData?.month || new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</strong>
              </p>
            </div>
          </div>

          <span className="text-xs text-slate-400 font-normal">
            Resets automatically on the 1st of each month.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Meter 1: Messages Quota */}
          <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-2.5">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="flex items-center gap-1.5 text-slate-800">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp Messages
              </span>
              <span className="text-emerald-700 font-mono">
                {usageData?.metrics?.messages?.percent || 0}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(usageData?.metrics?.messages?.percent || 0, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Used: <strong className="text-slate-800 font-mono">{(usageData?.metrics?.messages?.current || 0).toLocaleString('en-IN')}</strong></span>
              <span>Limit: <strong className="text-slate-800 font-mono">{(usageData?.metrics?.messages?.limit || 1000).toLocaleString('en-IN')}</strong></span>
            </div>
          </div>

          {/* Meter 2: AI Tokens Quota */}
          <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-2.5">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="flex items-center gap-1.5 text-slate-800">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" /> AI Tokens (LLM)
              </span>
              <span className="text-purple-700 font-mono">
                {usageData?.metrics?.aiTokens?.percent || 0}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(usageData?.metrics?.aiTokens?.percent || 0, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Used: <strong className="text-slate-800 font-mono">{(usageData?.metrics?.aiTokens?.current || 0).toLocaleString('en-IN')}</strong></span>
              <span>Limit: <strong className="text-slate-800 font-mono">{(usageData?.metrics?.aiTokens?.limit || 50000).toLocaleString('en-IN')}</strong></span>
            </div>
          </div>

          {/* Meter 3: Contacts Quota */}
          <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-2.5">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="flex items-center gap-1.5 text-slate-800">
                <Users className="w-3.5 h-3.5 text-blue-600" /> CRM Contacts
              </span>
              <span className="text-blue-700 font-mono">
                {usageData?.metrics?.contacts?.percent || 0}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(usageData?.metrics?.contacts?.percent || 0, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Stored: <strong className="text-slate-800 font-mono">{(usageData?.metrics?.contacts?.current || 0).toLocaleString('en-IN')}</strong></span>
              <span>Limit: <strong className="text-slate-800 font-mono">{(usageData?.metrics?.contacts?.limit || 500).toLocaleString('en-IN')}</strong></span>
            </div>
          </div>

          {/* Meter 4: Official Phone Channels */}
          <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-2.5">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="flex items-center gap-1.5 text-slate-800">
                <Smartphone className="w-3.5 h-3.5 text-amber-600" /> Active Channels
              </span>
              <span className="text-amber-700 font-bold font-mono">
                {channelsPercent}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${channelsPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Connected: <strong className="text-slate-800 font-mono">{channelCount} Active</strong></span>
              <span>Capacity: <strong className="text-slate-800 font-mono">{maxChannels} Numbers</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Meta WhatsApp Cloud API India Conversation Rates (₹ INR Breakdown) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
              <Info className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 tracking-tight">Meta Cloud API India Conversation Charges</h4>
              <p className="text-xs text-slate-500">Official Meta WhatsApp conversation rates per 24-hour session in Indian Rupees (₹)</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            First 1,000 Service Chats/Mo FREE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Rate 1: Marketing */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Marketing</span>
              <span className="text-sm font-black text-slate-900 font-mono">₹0.82 / convo</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Promotions, festive discounts, abandoned carts, and bulk broadcast templates.
            </p>
          </div>

          {/* Rate 2: Utility */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Utility</span>
              <span className="text-sm font-black text-slate-900 font-mono">₹0.12 / convo</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Order confirmations, dispatch alerts, payment receipts, and billing updates.
            </p>
          </div>

          {/* Rate 3: Authentication (OTP) */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Authentication</span>
              <span className="text-sm font-black text-slate-900 font-mono">₹0.12 / convo</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              High-priority instant verification codes, 2FA logins, and account recovery OTPs.
            </p>
          </div>

          {/* Rate 4: Service (Customer Care) */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Service (Inbound)</span>
              <span className="text-sm font-black text-emerald-700 font-mono">₹0.35 / convo</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              User-initiated customer support responses. (1,000 free sessions every month).
            </p>
          </div>
        </div>
      </div>

      {/* 5. Invoices & Transaction History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h4 className="text-base font-bold text-slate-900 tracking-tight">Recent Invoices & GST Receipts</h4>
            <p className="text-xs text-slate-500">Official tax invoices for subscription renewals and wallet top-ups</p>
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
          <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-slate-200 space-y-2">
            <FileText className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-700">No invoices generated yet</p>
            <p className="text-[11px] text-slate-400">Invoices will appear here automatically upon plan renewal or credit recharge.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="pb-3 px-3">Invoice Number</th>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3">Description</th>
                  <th className="pb-3 px-3">Amount (INR)</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.slice(0, 5).map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">{inv.invoiceNumber}</td>
                    <td className="py-3 px-3 text-slate-500">{new Date(inv.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="py-3 px-3 text-slate-700 font-medium">{inv.description}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      ₹{(inv.amount * (inv.currency === 'USD' ? 80 : 1)).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {inv.pdfUrl ? (
                        <a
                          href={inv.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold"
                        >
                          <Download className="w-3.5 h-3.5" /> PDF
                        </a>
                      ) : (
                        <span className="text-slate-400 font-medium">Paid</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. Top-Up Wallet Modal (in ₹ INR with UPI / Cards) */}
      {isTopupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 font-bold">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Recharge Meta Credits (₹ INR)</h3>
                  <p className="text-xs text-slate-500">Instant recharge for WhatsApp Cloud API conversations</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTopupModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>

            {topupSuccess && (
              <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{topupSuccessMsg}</span>
              </div>
            )}

            {/* Top-up Amount Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Select Recharge Amount</label>
              <div className="grid grid-cols-3 gap-2.5">
                {[500, 1000, 2500, 5000, 10000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setTopupAmount(amt);
                      setCustomAmount('');
                    }}
                    className={clsx(
                      'py-2.5 rounded-xl font-bold text-xs sm:text-sm border cursor-pointer transition-all',
                      topupAmount === amt && !customAmount
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-2xs font-mono'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300 font-mono'
                    )}
                  >
                    +₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Or Enter Custom Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">₹</span>
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Payment Method Option */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Payment Gateway</label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100/80 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={clsx(
                    'py-2 text-xs font-bold rounded-lg transition-all text-center cursor-pointer',
                    paymentMethod === 'upi'
                      ? 'bg-white text-emerald-700 shadow-2xs border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  ⚡ UPI / QR
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={clsx(
                    'py-2 text-xs font-bold rounded-lg transition-all text-center cursor-pointer',
                    paymentMethod === 'card'
                      ? 'bg-white text-blue-700 shadow-2xs border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  💳 Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={clsx(
                    'py-2 text-xs font-bold rounded-lg transition-all text-center cursor-pointer',
                    paymentMethod === 'netbanking'
                      ? 'bg-white text-purple-700 shadow-2xs border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  🏦 NetBanking
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex justify-between font-semibold">
                <span>Recharge Amount:</span>
                <span className="font-mono font-bold text-slate-900">
                  ₹{(customAmount ? parseFloat(customAmount) || 0 : topupAmount).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>GST (18% ITC Included):</span>
                <span>Tax Invoice Auto-generated</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
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
                leftIcon={
                  isTopupLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )
                }
              >
                {isTopupLoading
                  ? 'Processing Payment...'
                  : `Pay & Add ₹${(customAmount ? parseFloat(customAmount) || 0 : topupAmount).toLocaleString('en-IN')}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return embedded ? mainContent : <PageContainer>{mainContent}</PageContainer>;
};
