import React from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Button } from '../../../components/ui/Button';
import { CreditCard, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const Billing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Billing & Meta Conversation Credits
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your subscription plan, payment methods, and Meta Cloud API credit balance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.BILLING_INVOICES)}
          >
            Invoice History
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(ROUTES.BILLING_PLANS)}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Upgrade Plan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Current Plan Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Plan</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">Enterprise Plus</div>
          <p className="text-xs text-slate-400">$299.00 / month • Renews on March 1, 2025</p>
          <Button variant="outline" size="sm" className="w-full" onClick={() => navigate(ROUTES.BILLING_PLANS)}>
            Change Plan
          </Button>
        </div>

        {/* Meta Wallet Balance */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Meta API Balance</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">$840.50</div>
          <p className="text-xs text-slate-400">~140,000 Meta Utility/Marketing Conversation credits remaining</p>
          <Button variant="primary" size="sm" className="w-full">
            Add Funds (+ $100)
          </Button>
        </div>

        {/* Payment Method */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Method</span>
            <CreditCard className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Visa ending in 4242</span>
            <span className="text-xs text-slate-400 font-normal">(Exp 12/28)</span>
          </div>
          <p className="text-xs text-slate-400">Auto-recharge enabled when balance falls below $50</p>
          <Button variant="outline" size="sm" className="w-full">
            Update Card
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};
