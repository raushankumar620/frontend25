import { billingService } from '../../services/billingService';
import type { Invoice, PricingPlan } from './types';

export const billingApi = {
  getInvoices: async (): Promise<Invoice[]> => billingService.getInvoices(),
  getPlans: async (): Promise<PricingPlan[]> => billingService.getPlans(),
};
