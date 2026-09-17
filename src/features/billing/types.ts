export interface PlanLimits {
  messagesPerMonth: number;
  aiTokensPerMonth: number;
  contactsLimit: number;
  teamMembersLimit: number;
  customToolsLimit: number;
  ragDocsLimit: number;
}

export interface PricingPlan {
  id?: string;
  name: string;
  code: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  limits: PlanLimits;
  features: string[];
  isPopular?: boolean;
  isActive?: boolean;
}

export interface AutoPayInfo {
  enabled: boolean;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'NOT_CONFIGURED';
  mandateId?: string;
  paymentMethod?: string;
  nextDebitDate?: string;
  maxAmount?: number;
  lastUpdated?: string;
}

export interface Subscription {
  id?: string;
  organizationId: string;
  planCode: string;
  status: 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'INACTIVE';
  billingCycle: 'monthly' | 'yearly' | 'quarterly';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEndsAt?: string;
  autoPay?: AutoPayInfo;
}

export interface UsageMetricItem {
  current: number;
  limit: number;
  percent: number;
}

export interface UsageAndLimits {
  month: string;
  creditsBalance: number;
  plan: {
    name: string;
    code: string;
    billingCycle: string;
    status: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  };
  metrics: {
    messages: UsageMetricItem;
    aiTokens: UsageMetricItem;
    contacts: UsageMetricItem;
    teamMembers: UsageMetricItem;
  };
}

export interface InvoiceItem {
  description: string;
  amount: number;
  quantity: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';
  billingReason: string;
  description: string;
  lineItems?: InvoiceItem[];
  pdfUrl?: string;
  paidAt?: string;
  createdAt: string;
}
