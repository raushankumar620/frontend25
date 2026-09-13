import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Button } from '../../../components/ui/Button';
import { Check, ArrowLeft } from 'lucide-react';
import type { PricingPlan } from '../types';
import { billingApi } from '../api';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const Plans: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PricingPlan[]>([]);

  useEffect(() => {
    billingApi.getPlans().then(setPlans);
  }, []);

  return (
    <PageContainer>
      <button
        onClick={() => navigate(ROUTES.BILLING)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Billing</span>
      </button>

      <div className="text-center max-w-xl mx-auto mb-10">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Choose Your Plan</h2>
        <p className="text-xs text-slate-500 mt-1">
          Scale effortlessly from early startup to high-volume enterprise broadcast operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border flex flex-col justify-between relative ${
              plan.isCurrent
                ? 'border-emerald-500 shadow-xl'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            {plan.isPopular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Most Popular
              </span>
            )}

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">${plan.price}</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>

              <div className="mt-6 space-y-3">
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              className="w-full mt-8"
              variant={plan.isCurrent ? 'outline' : 'primary'}
              disabled={plan.isCurrent}
            >
              {plan.isCurrent ? 'Current Active Plan' : 'Select Plan'}
            </Button>
          </div>
        ))}
      </div>
    </PageContainer>
  );
};
