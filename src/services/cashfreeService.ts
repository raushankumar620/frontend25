import { apiClient } from './apiClient';

declare global {
  interface Window {
    Cashfree?: any;
  }
}

let cashfreeInstance: any = null;

export const loadCashfreeSdk = async (isProduction = false): Promise<any> => {
  if (cashfreeInstance) return cashfreeInstance;

  return new Promise((resolve, reject) => {
    if (window.Cashfree) {
      cashfreeInstance = window.Cashfree({
        mode: isProduction ? 'production' : 'sandbox',
      });
      return resolve(cashfreeInstance);
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => {
      if (window.Cashfree) {
        cashfreeInstance = window.Cashfree({
          mode: isProduction ? 'production' : 'sandbox',
        });
        resolve(cashfreeInstance);
      } else {
        reject(new Error('Cashfree SDK failed to initialize'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Cashfree script'));
    document.body.appendChild(script);
  });
};

export const cashfreeService = {
  /**
   * Create Cashfree payment order on backend
   */
  async createOrder(planCode: string, returnUrl?: string): Promise<{
    orderId: string;
    paymentSessionId: string;
    orderAmount: number;
    currency: string;
    planCode: string;
    planName: string;
  }> {
    const res = await apiClient.post<any>('/billing/create-order', {
      planCode,
      returnUrl,
    });
    if (!res.success || !res.data) {
      throw new Error(res.message || 'Failed to create payment order');
    }
    return res.data;
  },

  /**
   * Verify Cashfree payment with backend after checkout completion
   */
  async verifyPayment(orderId: string, planCode?: string): Promise<any> {
    const res = await apiClient.post<any>('/billing/verify-payment', {
      orderId,
      planCode,
    });
    if (!res.success) {
      throw new Error(res.message || 'Payment verification failed');
    }
    return res.data;
  },

  /**
   * Trigger Cashfree Modal / Seamless Checkout
   */
  async checkout(paymentSessionId: string, isProduction = false): Promise<void> {
    const cashfree = await loadCashfreeSdk(isProduction);
    return cashfree.checkout({
      paymentSessionId,
      redirectTarget: '_modal', // Opens sleek modal on the same screen
    });
  },
};
