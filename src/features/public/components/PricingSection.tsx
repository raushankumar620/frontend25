import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { useAuthStore } from '../../../store/authStore';

export const PricingSection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: 'Starter',
      price: annual ? 39 : 49,
      period: '/ month',
      description: 'Ideal for small businesses launching their first automated WhatsApp channel.',
      badge: 'Starter',
      features: [
        '1 WhatsApp Business Phone Number',
        '2,500 Monthly Active Contacts',
        '2 Team Member / Agent Seats',
        'Direct Meta Cloud API (0% markup)',
        'Basic AI Auto-responder (100 chats/mo)',
        '5 Visual Automation Flows',
        'Standard Email Support',
      ],
      cta: 'Start 14-Day Free Trial',
      popular: false,
    },
    {
      name: 'Growth',
      price: annual ? 99 : 129,
      period: '/ month',
      description: 'Built for high-growth brands scaling broadcasts, CRM nurtures & team sales.',
      badge: 'Most Popular',
      features: [
        '3 WhatsApp Business Phone Numbers',
        '25,000 Monthly Active Contacts',
        '10 Team Member / Agent Seats',
        'Direct Meta Cloud API (0% markup)',
        'Domain AI Agent with RAG (2,500 chats/mo)',
        'Unlimited Visual Automation Flows',
        'A/B Campaign Broadcast Testing',
        'Shopify, WooCommerce & CRM Webhooks',
        'Priority 2-Hour Chat Support',
      ],
      cta: 'Start 14-Day Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: annual ? 299 : 399,
      period: '/ month',
      description: 'For large enterprises requiring high throughput, dedicated IPs & SLAs.',
      badge: 'Dedicated Scale',
      features: [
        'Unlimited WhatsApp Phone Numbers',
        '1,000,000+ Active Contacts Capability',
        'Unlimited Collaborative Agent Seats',
        'Tier 3 Dedicated Meta Cloud Cluster',
        'Custom RAG AI Bot (Unlimited chats)',
        'Granular Role-Based Access Control (RBAC)',
        'Custom Webhooks & 10,000 req/min API rate',
        '99.99% Uptime SLA & Dedicated Slack Room',
        'Green Tick Verification Fast-Track',
      ],
      cta: 'Contact Enterprise Sales',
      popular: false,
    },
  ];

  return (
    <section className="py-20 bg-[#F6FAF8] border-b border-[#E2EAE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9F9EE] border border-[#C4EBD0] text-[#006736] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#05A222]" />
            Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#14201C] tracking-tight mb-4">
            Simple, transparent plans with zero hidden fees
          </h2>
          <p className="text-sm sm:text-base text-[#5F7069] mb-8">
            Connect directly to Meta Cloud API. No markup on WhatsApp conversation sessions.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 bg-white p-1.5 rounded-full border border-[#E2EAE6] shadow-xs">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                !annual ? 'bg-[#14201C] text-white shadow-xs' : 'text-[#5F7069] hover:text-[#14201C]'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                annual ? 'bg-[#05A222] text-white shadow-xs' : 'text-[#5F7069] hover:text-[#14201C]'
              }`}
            >
              <span>Annual Billing</span>
              <span className="bg-[#E9F9EE] text-[#006736] text-[10px] font-extrabold px-1.5 py-0.2 rounded-full border border-[#C4EBD0]">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all relative ${
                plan.popular
                  ? 'border-2 border-[#05A222] shadow-[0_16px_50px_rgba(1,59,35,0.12)] ring-4 ring-[#05A222]/10'
                  : 'border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)] hover:border-[#05A222]/40'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#05A222] text-white text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                  Most Popular Choice
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#14201C]">{plan.name}</h3>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]">
                    {plan.badge}
                  </span>
                </div>

                <p className="text-xs text-[#5F7069] mb-6 min-h-[36px] leading-relaxed">{plan.description}</p>

                <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-[#E2EAE6]">
                  <span className="text-4xl sm:text-5xl font-black text-[#14201C]">${plan.price}</span>
                  <span className="text-xs text-[#5F7069] font-medium">{plan.period}</span>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="text-xs font-bold text-[#14201C] uppercase tracking-wider">What's included:</div>
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-[#1F2A26]">
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
                  onClick={() => {
                    if (plan.name === 'Enterprise') {
                      navigate(ROUTES.PUBLIC_CONTACT);
                    } else if (!isAuthenticated) {
                      navigate(ROUTES.LOGIN);
                    } else {
                      navigate(ROUTES.BILLING_PLANS);
                    }
                  }}
                  className={`w-full font-bold ${
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

      </div>
    </section>
  );
};
