import type { Invoice, PricingPlan } from './types';

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv_1',
    invoiceNumber: 'INV-2025-001',
    amount: 299,
    currency: 'USD',
    status: 'paid',
    date: '2025-02-01T00:00:00Z',
  },
  {
    id: 'inv_2',
    invoiceNumber: 'INV-2025-002',
    amount: 299,
    currency: 'USD',
    status: 'paid',
    date: '2025-01-01T00:00:00Z',
  },
];

export const MOCK_PLANS: PricingPlan[] = [
  {
    id: 'plan_starter',
    name: 'Starter',
    price: 49,
    billingCycle: 'monthly',
    features: ['1 Connected WhatsApp Number', '5,000 Outbound Messages/mo', '1 AI Agent', 'Email Support'],
  },
  {
    id: 'plan_growth',
    name: 'Growth',
    price: 149,
    billingCycle: 'monthly',
    isPopular: true,
    features: ['3 Connected WhatsApp Numbers', '25,000 Outbound Messages/mo', '5 AI Agents', 'Shared Team Inbox (5 seats)'],
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise Plus',
    price: 299,
    billingCycle: 'monthly',
    isCurrent: true,
    features: ['Unlimited Numbers', '100,000+ Outbound Messages/mo', 'Unlimited RAG Knowledge Docs', 'Dedicated Account Manager'],
  },
];

export const billingApi = {
  getInvoices: async (): Promise<Invoice[]> => MOCK_INVOICES,
  getPlans: async (): Promise<PricingPlan[]> => MOCK_PLANS,
};
