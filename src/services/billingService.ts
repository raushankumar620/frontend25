import { apiClient } from './apiClient';
import type { PricingPlan, Subscription, UsageAndLimits, Invoice } from '../features/billing/types';

export const billingService = {
  /**
   * Fetch all available pricing plans
   */
  async getPlans(): Promise<PricingPlan[]> {
    const res = await apiClient.get<PricingPlan[]>('/billing/plans');
    return res.data;
  },

  /**
   * Fetch current organization subscription
   */
  async getSubscription(): Promise<{ subscription: Subscription; plan: PricingPlan }> {
    const res = await apiClient.get<{ subscription: Subscription; plan: PricingPlan }>('/billing/subscription');
    return res.data;
  },

  /**
   * Change or upgrade subscription plan
   */
  async changePlan(planCode: string, billingCycle: 'monthly' | 'yearly' = 'monthly'): Promise<{ subscription: Subscription; plan: PricingPlan }> {
    const res = await apiClient.post<{ subscription: Subscription; plan: PricingPlan }>('/billing/subscription/change-plan', {
      planCode,
      billingCycle,
    });
    return res.data;
  },

  /**
   * Cancel subscription
   */
  async cancelSubscription(immediately = false): Promise<Subscription> {
    const res = await apiClient.post<Subscription>('/billing/subscription/cancel', { immediately });
    return res.data;
  },

  /**
   * Resume cancelled subscription
   */
  async resumeSubscription(): Promise<Subscription> {
    const res = await apiClient.post<Subscription>('/billing/subscription/resume');
    return res.data;
  },

  /**
   * Fetch real-time monthly usage and quota meters
   */
  async getUsage(): Promise<UsageAndLimits> {
    const res = await apiClient.get<UsageAndLimits>('/billing/usage');
    return res.data;
  },

  /**
   * Top-up Meta conversation credit wallet
   */
  async topupCredits(amount: number): Promise<{ creditsBalance: number; amountAdded: number }> {
    const res = await apiClient.post<{ creditsBalance: number; amountAdded: number }>('/billing/credits/topup', {
      amount,
    });
    return res.data;
  },

  /**
   * Create Checkout Session URL
   */
  async createCheckout(planCode: string, billingCycle: 'monthly' | 'yearly' = 'monthly'): Promise<{ sessionId: string; checkoutUrl: string }> {
    const res = await apiClient.post<{ sessionId: string; checkoutUrl: string }>('/billing/checkout', {
      planCode,
      billingCycle,
    });
    return res.data;
  },

  /**
   * Fetch organization invoice history
   */
  async getInvoices(): Promise<Invoice[]> {
    const res = await apiClient.get<Invoice[]>('/billing/invoices');
    return res.data;
  },
};
