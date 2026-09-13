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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#14201C] tracking-tight">
            Billing & Meta Conversation Credits
          </h2>
          <p className="text-sm sm:text-base text-[#5F7069] mt-1.5 font-medium">
            Manage your subscription plan, payment methods, and Meta Cloud API credit balance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate(ROUTES.BILLING_INVOICES)}
            className="text-sm font-semibold border-[#C4EBD0] text-[#006736] hover:bg-[#F6FAF8] rounded-xl"
          >
            Invoice History
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(ROUTES.BILLING_PLANS)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="text-sm font-bold px-4.5 py-2.5 rounded-xl shadow-sm"
          >
            Upgrade Plan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Current Plan Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-[#5F7069] uppercase tracking-wider">Current Plan</span>
            <span className="text-xs bg-[#E9F9EE] text-[#006736] font-bold px-2.5 py-0.5 rounded-full border border-[#C4EBD0]">
              Active
            </span>
          </div>
          <div className="text-3xl font-black text-[#14201C]">Enterprise Plus</div>
          <p className="text-sm text-[#5F7069] font-medium">$299.00 / month • Renews on March 1, 2025</p>
          <Button variant="outline" size="md" className="w-full text-sm font-semibold rounded-xl" onClick={() => navigate(ROUTES.BILLING_PLANS)}>
            Change Plan
          </Button>
        </div>

        {/* Meta Wallet Balance */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-[#5F7069] uppercase tracking-wider">Meta API Balance</span>
            <Zap className="w-5 h-5 text-[#D99A00]" />
          </div>
          <div className="text-3xl font-black text-[#14201C]">$840.50</div>
          <p className="text-sm text-[#5F7069] font-medium">~140,000 Meta Utility/Marketing Conversation credits remaining</p>
          <Button variant="primary" size="md" className="w-full text-sm font-bold rounded-xl shadow-sm">
            Add Funds (+ $100)
          </Button>
        </div>

        {/* Payment Method */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-[#5F7069] uppercase tracking-wider">Payment Method</span>
            <CreditCard className="w-5 h-5 text-[#05A222]" />
          </div>
          <div className="text-base font-bold text-[#14201C] flex items-center gap-2">
            <span>Visa ending in 4242</span>
            <span className="text-sm text-[#5F7069] font-normal">(Exp 12/28)</span>
          </div>
          <p className="text-sm text-[#5F7069] font-medium">Auto-recharge enabled when balance falls below $50</p>
          <Button variant="outline" size="md" className="w-full text-sm font-semibold rounded-xl">
            Update Card
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};
