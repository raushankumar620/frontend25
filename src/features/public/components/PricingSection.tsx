import React from 'react';
import { Check, Sparkles, Zap, Crown, ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { useAuthStore } from '../../../store/authStore';

export const PricingSection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const plans = [
    {
      code: 'STARTER_1M',
      name: 'Starter Pro',
      price: 1599,
      duration: 'for 1 Month',
      effective: null,
      description: 'Perfect for fast-growing businesses launching WhatsApp marketing campaigns.',
      badge: 'Starter Pack',
      limits: {
        messages: '10,000 / mo',
        numbers: '1 Number',
        contacts: '5,000 Contacts',
        seats: '5 Seats',
      },
      features: [
        '10,000 WhatsApp Messages / mo',
        '1 Connected WhatsApp Number',
        '5,000 CRM Contacts',
        '5 Shared Inbox Team Seats',
        'Direct Meta Cloud API (0% markup)',
        'Broadcast Campaigns & Templates',
        'Visual Flow Automations',
        'Standard Email & Chat Support',
      ],
      cta: 'Choose Starter Plan',
      popular: false,
      enterprise: false,
    },
    {
      code: 'GROWTH_3M',
      name: 'Growth Business',
      price: 2599,
      duration: 'total for 3 Months',
      effective: '₹866 / month',
      description: 'Advanced conversational AI, high-volume broadcasting, and SLA queues. Save 45%!',
      badge: 'Most Popular • 45% OFF',
      limits: {
        messages: '35,000 / mo',
        numbers: '2 Numbers',
        contacts: '25,000 Contacts',
        seats: '15 Seats',
      },
      features: [
        '35,000 WhatsApp Messages / mo',
        '2 Connected WhatsApp Numbers',
        '25,000 CRM Contacts',
        '15 Shared Inbox Team Seats',
        'Autonomous AI Agent + Knowledge Base',
        'Custom Webhook Automations',
        'Human Handoff SLA Queue',
        'Priority 24/7 Support',
      ],
      cta: 'Get Growth Pack',
      popular: true,
      enterprise: false,
    },
    {
      code: 'ENTERPRISE_1Y',
      name: 'Annual Enterprise',
      price: 15999,
      duration: 'total for 1 Year',
      effective: '₹1,333 / month',
      description: 'Unlimited throughput, custom TPS limits, 5 numbers, and dedicated SLA management.',
      badge: 'Best Value • Full Scale',
      limits: {
        messages: '150,000+ / mo',
        numbers: '5 Numbers',
        contacts: '100,000+ Contacts',
        seats: '50 Seats',
      },
      features: [
        '150,000+ WhatsApp Messages / mo',
        'Up to 5 Connected WhatsApp Numbers',
        '100,000+ CRM Contacts',
        '50 Team Seats & Role Permissions',
        'High TPS Dedicated Meta Cloud API',
        'Custom Developers API & Webhooks',
        'Dedicated Account Manager & 24/7 SLA',
        'Raw Data CSV Exports & Logs',
      ],
      cta: 'Get Enterprise Pack',
      popular: false,
      enterprise: true,
    },
  ];

  const handlePlanSelect = (code: string) => {
    if (!isAuthenticated) {
      navigate(`${ROUTES.REGISTER}?plan=${encodeURIComponent(code)}`);
    } else {
      navigate(ROUTES.BILLING_PLANS);
    }
  };

  return (
    <section className="py-20 bg-[#F6FAF8] border-b border-[#E2EAE6]">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9F9EE] border border-[#C4EBD0] text-[#006736] text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#05A222]" />
            Official Pricing &amp; Plans
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#14201C] tracking-tight mb-4">
            Transparent WhatsApp Business Cloud Plans
          </h2>
          <p className="text-sm sm:text-base text-[#5F7069] max-w-2xl mx-auto">
            Direct Meta Cloud API connection with 0% message markup. Instant activation via Cashfree PG (UPI, Cards &amp; Netbanking).
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-7xl mx-auto">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all relative ${
                plan.popular
                  ? 'border-2 border-[#05A222] shadow-[0_16px_50px_rgba(5,162,34,0.14)] ring-4 ring-[#05A222]/10'
                  : plan.enterprise
                  ? 'border border-slate-800 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'
                  : 'border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)] hover:border-[#05A222]/40'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#013B23] to-[#006736] text-[#6AEB31] text-[10px] font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-[#05A222]/30">
                  <Sparkles className="w-3.5 h-3.5" /> {plan.badge}
                </div>
              )}

              {plan.enterprise && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-md flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-400" /> {plan.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-[#14201C]">{plan.name}</h3>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]">
                    {plan.badge}
                  </span>
                </div>

                <p className="text-xs text-[#5F7069] mb-5 min-h-[36px] leading-relaxed font-medium">
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl sm:text-4xl font-black text-[#14201C] font-mono">
                    ₹{plan.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-[#5F7069] font-semibold">
                    {plan.duration}
                  </span>
                </div>

                {plan.effective && (
                  <div className="mb-6">
                    <span className="inline-flex items-center text-[11px] font-bold text-[#05A222] bg-[#E9F9EE] px-2.5 py-0.5 rounded-md border border-[#C4EBD0]">
                      Effective: {plan.effective}
                    </span>
                  </div>
                )}
                {!plan.effective && <div className="mb-6 h-[22px]" />}

                {/* Quotas Box */}
                <div className="pt-4 border-t border-[#E2EAE6] space-y-2 mb-6">
                  <div className="text-xs font-bold text-[#14201C] mb-2 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#05A222]" /> Included Quotas:
                  </div>
                  <div className="text-xs text-[#5F7069] flex justify-between font-medium">
                    <span>Messages:</span>
                    <strong className="text-[#14201C]">{plan.limits.messages}</strong>
                  </div>
                  <div className="text-xs text-[#5F7069] flex justify-between font-medium">
                    <span>WhatsApp Numbers:</span>
                    <strong className="text-[#14201C]">{plan.limits.numbers}</strong>
                  </div>
                  <div className="text-xs text-[#5F7069] flex justify-between font-medium">
                    <span>CRM Contacts:</span>
                    <strong className="text-[#14201C]">{plan.limits.contacts}</strong>
                  </div>
                  <div className="text-xs text-[#5F7069] flex justify-between font-medium">
                    <span>Agent Seats:</span>
                    <strong className="text-[#14201C]">{plan.limits.seats}</strong>
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-2.5 mb-8 pt-4 border-t border-[#E2EAE6]">
                  <div className="text-xs font-bold text-[#14201C] uppercase tracking-wider mb-2">Key Features:</div>
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-[#1F2A26] font-medium">
                      <Check className="w-4 h-4 text-[#05A222] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  size="lg"
                  onClick={() => handlePlanSelect(plan.code)}
                  className={`w-full font-bold cursor-pointer rounded-2xl py-3.5 shadow-xs ${
                    plan.popular
                      ? 'bg-[#05A222] hover:bg-[#006736] text-white shadow-md'
                      : 'border-[#E2EAE6] text-[#14201C] hover:bg-[#F6FAF8]'
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Cashfree PG Guarantee Banner */}
        <div className="max-w-4xl mx-auto mt-12 p-4 bg-white border border-[#E2EAE6] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5F7069] shadow-2xs">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#05A222] shrink-0" />
            <span>
              <strong>100% Secure Instant Activation:</strong> Powered by Cashfree Payments. Supports UPI (Google Pay, PhonePe, Paytm), Netbanking, Credit/Debit Cards, and Wallets.
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
