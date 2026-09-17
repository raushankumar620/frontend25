import React, { useState } from 'react';
import { X, Zap, ShieldCheck, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import type { Subscription } from '../types';
import { billingService } from '../../../services/billingService';

interface AutoPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription | null;
  onAutoPayUpdated: (updatedSub: Subscription) => void;
}

export const AutoPayModal: React.FC<AutoPayModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onAutoPayUpdated,
}) => {
  if (!isOpen || !subscription) return null;

  const autoPay = subscription.autoPay || {
    enabled: true,
    status: 'ACTIVE',
    mandateId: 'CF-MND-' + (subscription.id || '982341').slice(-6),
    paymentMethod: 'UPI AutoPay (Cashfree e-Mandate)',
    nextDebitDate: subscription.currentPeriodEnd,
    maxAmount: 2599,
  };

  const [isEnabled, setIsEnabled] = useState<boolean>(autoPay.enabled !== false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleToggle = async (newEnabled: boolean) => {
    try {
      setIsUpdating(true);
      setErrorMsg('');
      setSuccessMsg('');

      const res = await billingService.updateAutoPay(newEnabled, {
        status: newEnabled ? 'ACTIVE' : 'PAUSED',
        maxAmount: autoPay.maxAmount,
        paymentMethod: autoPay.paymentMethod,
      });

      setIsEnabled(newEnabled);
      setSuccessMsg(res.message || `AutoPay has been ${newEnabled ? 'activated' : 'paused'} successfully!`);
      if (res.subscription) {
        onAutoPayUpdated(res.subscription);
      }
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || err?.message || 'Failed to update AutoPay settings');
    } finally {
      setIsUpdating(false);
    }
  };

  const formattedDebitDate = autoPay.nextDebitDate
    ? new Date(autoPay.nextDebitDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : new Date(subscription.currentPeriodEnd).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14201C]/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white border border-[#E2EAE6] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl my-8 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 px-6 bg-[#F6FAF8] border-b border-[#E2EAE6] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E9F9EE] text-[#006736] flex items-center justify-center border border-[#C4EBD0]">
              <Zap className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#14201C]">AutoPay & Recurring Billing</h3>
              <p className="text-[11px] text-[#5F7069]">Manage UPI and card automatic renewal mandates</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#5F7069] hover:text-[#14201C] hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Status Banner */}
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
              isEnabled
                ? 'bg-[#E9F9EE]/70 border-[#C4EBD0]'
                : 'bg-amber-50/70 border-amber-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  isEnabled
                    ? 'bg-[#006736] text-white'
                    : 'bg-amber-600 text-white'
                }`}
              >
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-[#14201C]">
                    AutoPay is {isEnabled ? 'Active' : 'Paused'}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isEnabled
                        ? 'bg-[#05A222] text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {isEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <p className="text-xs text-[#5F7069] mt-0.5">
                  {isEnabled
                    ? 'Your subscription will renew automatically on expiry.'
                    : 'Auto-debit is stopped. You will need to renew manually.'}
                </p>
              </div>
            </div>

            {/* Quick Toggle Button */}
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleToggle(!isEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isEnabled ? 'bg-[#006736]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Feedback Messages */}
          {successMsg && (
            <div className="p-3 bg-[#E9F9EE] border border-[#C4EBD0] text-[#006736] rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#05A222] shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Mandate Details Card */}
          <div className="p-4 bg-[#F6FAF8] border border-[#E2EAE6] rounded-2xl space-y-3 text-xs">
            <span className="font-black text-[#5F7069] uppercase tracking-wider text-[10px] block">
              Registered Mandate Specifications
            </span>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-0.5">
                <span className="text-[#5F7069]">Mandate Reference (UMN):</span>
                <p className="font-mono font-bold text-[#14201C]">{autoPay.mandateId || 'CF-MND-892341'}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[#5F7069]">Payment Gateway:</span>
                <p className="font-bold text-[#14201C]">Cashfree Subscriptions</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[#5F7069]">Next Scheduled Debit:</span>
                <p className="font-bold text-[#006736]">{formattedDebitDate}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[#5F7069]">Max Debit Limit:</span>
                <p className="font-bold text-[#14201C]">₹{(autoPay.maxAmount || 2599).toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          {/* RBI e-Mandate Protection Notice */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start gap-2.5 text-xs text-blue-950">
            <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>RBI e-Mandate Protected:</strong> You will receive an SMS and WhatsApp notification 24 hours prior to any automatic debit. You can pause or cancel anytime with zero cancellation fees.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 bg-[#F6FAF8] border-t border-[#E2EAE6] flex items-center justify-between">
          <div className="text-[11px] text-[#5F7069] flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-[#006736]" />
            <span>256-bit Encrypted Banking Mandate</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={onClose}
              className="text-xs font-bold rounded-xl cursor-pointer"
            >
              Done
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
