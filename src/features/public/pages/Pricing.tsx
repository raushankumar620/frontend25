import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Building2, 
  CreditCard,
  PhoneCall
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { PricingSection } from '../components/PricingSection';
import { CTASection } from '../components/CTASection';
import { SEO } from '../../../seo';

export const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const comparisonFeatures = [
    { name: 'Monthly Price / Effective Rate', starter: '₹1,599 / mo', growth: '₹2,599 (₹866/mo)', enterprise: '₹15,999 (₹1,333/mo)' },
    { name: 'WhatsApp Business Numbers', starter: '1 Number', growth: '2 Numbers', enterprise: 'Up to 5 Numbers' },
    { name: 'Monthly Messages Included', starter: '10,000 / mo', growth: '35,000 / mo', enterprise: '150,000+ / mo' },
    { name: 'CRM Contacts Limit', starter: '5,000 Contacts', growth: '25,000 Contacts', enterprise: '100,000+ Contacts' },
    { name: 'Team Members / Agent Seats', starter: '5 Seats', growth: '15 Seats', enterprise: '50 Seats' },
    { name: 'Meta Cloud API Direct (Zero Markup)', starter: 'Included', growth: 'Included', enterprise: 'Included (High TPS)' },
    { name: 'AI Autonomous Agent & Knowledge Base', starter: 'Standard Auto-responder', growth: 'AI Agent + Knowledge Base', enterprise: 'Dedicated Custom RAG + Tools' },
    { name: 'Visual Workflow Automations', starter: 'Included', growth: 'Unlimited Flows', enterprise: 'Unlimited Flows + Custom Webhooks' },
    { name: 'Broadcast Campaigns & Templates', starter: 'Included', growth: 'Advanced + Smart Throttle', enterprise: 'Dedicated High-Throughput Queue' },
    { name: 'Developer APIs & Webhooks', starter: 'Standard API', growth: 'High Rate Limits', enterprise: 'Dedicated Developer Pods' },
    { name: 'Role-Based Access Control (RBAC)', starter: 'Standard', growth: 'Granular Permissions', enterprise: 'Custom Roles & Audit Logs' },
    { name: 'Green Tick Verification Support', starter: 'Documentation Guide', growth: 'Assisted Submission', enterprise: 'Priority Fast-Track Guarantee' },
    { name: 'Support SLA & Dedicated CSM', starter: 'Email & Chat Support', growth: 'Priority 24/7 Support', enterprise: 'Dedicated Manager & 24/7 SLA' },
  ];

  const faqs = [
    {
      q: 'How does WhatsApp Cloud API billing work with Meta?',
      a: 'WhatsAppMSG connects directly to your Meta Business Manager. Meta charges for conversation sessions (Marketing, Utility, Authentication, Service) directly to your credit card at Meta standard rates with zero markup or hidden broker fees.',
    },
    {
      q: 'Can I keep my existing WhatsApp Business number?',
      a: 'Yes! You can migrate your existing phone number or register a brand new landline or virtual number. We guide you step-by-step through Meta WhatsApp Cloud API migration without losing your business identity.',
    },
    {
      q: 'What happens if I exceed my monthly active contact limit?',
      a: 'We never pause or drop your customer messages. If you exceed your tier limit, you will simply be billed at a predictable nominal overage fee per 1,000 active contacts, or you can seamlessly upgrade with one click.',
    },
    {
      q: 'Can multiple agents respond from the same WhatsApp number?',
      a: 'Absolutely. WhatsAppMSG provides a shared multi-agent inbox with collision detection, round-robin chat assignment, and internal private notes so your whole support or sales team can collaborate efficiently.',
    },
    {
      q: 'Is there a free trial and do you require a credit card?',
      a: 'We offer a 14-day full-access trial for all plans. No credit card is required to sign up and connect your WhatsApp sandbox number.',
    },
    {
      q: 'Do you provide enterprise SLA and custom contracts?',
      a: 'Yes, for large-scale brands sending over 500,000 messages per month, we provide custom MSAs, BAA for HIPAA compliance, SOC 2 reports, and dedicated technical account managers.',
    },
    {
      q: 'Looking for WhatsAppMSG? (Official Brand Clarification)',
      a: 'Looking for WhatsAppMSG? You may also see our brand written incorrectly as WhatsapMSG, WhatsAppMS, or WhatsAppMG when searching. The official product name is WhatsAppMSG.',
    },
  ];

  return (
    <div className="bg-white text-[#1F2A26] pb-16 sm:pb-24">
      <SEO page="pricing" faqItems={faqs.map((f) => ({ question: f.q, answer: f.a }))} />
      
      {/* Top Header Hero */}
      <section className="relative overflow-hidden w-full border-b border-[#C4EBD0]/70 py-16 sm:py-20 lg:py-24 bg-[#EBF7EE] mb-12 sm:mb-16">
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <img 
            src="/images/commonheader_bg.png" 
            alt="WhatsAppMSG Pricing Header" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#C4EBD0] bg-white/80 backdrop-blur-xs text-[#006736] text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <CreditCard className="w-3.5 h-3.5 text-[#05A222]" />
            Transparent & Scalable Pricing
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#14201C] tracking-tight mb-4">
            Predictable plans designed to scale with your growth
          </h1>
          <p className="text-sm sm:text-base text-[#5F7069] leading-relaxed">
            Direct Meta Cloud API access with 0% message markup. Cancel or change your subscription at any time.
          </p>
        </div>
      </section>

      {/* Main Pricing Cards */}
      <PricingSection />

      {/* Deep Feature Comparison Table */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14201C] mb-3">Compare Plan Specifications</h2>
          <p className="text-xs sm:text-sm text-[#5F7069]">Detailed breakdown of quotas, limits, and enterprise capabilities.</p>
        </div>

        <div className="border border-[#E2EAE6] rounded-3xl overflow-hidden bg-white shadow-[0_8px_30px_rgba(1,59,35,0.04)] overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-[#E2EAE6] bg-[#F6FAF8]">
                <th className="p-4 sm:p-5 font-bold text-[#14201C] w-2/5">Capability</th>
                <th className="p-4 sm:p-5 font-bold text-[#5F7069] text-center w-1/5">Starter</th>
                <th className="p-4 sm:p-5 font-bold text-[#006736] text-center w-1/5 bg-[#E9F9EE]">Growth (Popular)</th>
                <th className="p-4 sm:p-5 font-bold text-[#14201C] text-center w-1/5">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EAE6]">
              {comparisonFeatures.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#F6FAF8] transition-colors">
                  <td className="p-4 sm:p-5 text-[#1F2A26] font-medium">{row.name}</td>
                  <td className="p-4 sm:p-5 text-[#5F7069] text-center">{row.starter}</td>
                  <td className="p-4 sm:p-5 text-[#006736] text-center font-bold bg-[#E9F9EE]/50">{row.growth}</td>
                  <td className="p-4 sm:p-5 text-[#14201C] text-center font-semibold">{row.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enterprise Custom Banner */}
      <div className="w-full px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-linear-to-r from-[#E9F9EE] via-[#F6FAF8] to-[#E9F9EE] border border-[#C4EBD0] rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9F9EE] text-[#006736] text-xs font-bold border border-[#C4EBD0]">
              <Building2 className="w-4 h-4 text-[#05A222]" />
              High-Volume Brand or Agency?
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#14201C]">Need a Custom Dedicated Plan?</h3>
            <p className="text-xs sm:text-sm text-[#5F7069] max-w-xl leading-relaxed">
              We offer volume discounts for 1M+ monthly conversations, dedicated infrastructure pods, multi-brand agency sub-accounts, and direct engineering escalation.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(ROUTES.PUBLIC_CONTACT)}
              leftIcon={<PhoneCall className="w-4 h-4" />}
              className="bg-[#05A222] hover:bg-[#006736] text-white font-bold"
            >
              Talk to Enterprise Sales
            </Button>
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9F9EE] text-[#006736] text-xs font-semibold mb-3 border border-[#C4EBD0]">
            <HelpCircle className="w-3.5 h-3.5 text-[#05A222]" />
            Frequently Asked Questions
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14201C]">Everything you need to know</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                className={`border rounded-2xl transition-all ${
                  isOpen ? 'bg-white border-[#05A222] shadow-[0_8px_30px_rgba(1,59,35,0.06)] ring-1 ring-[#05A222]/30' : 'bg-[#F6FAF8] border-[#E2EAE6] hover:border-[#05A222]/40'
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-bold text-sm sm:text-base text-[#14201C]">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#05A222] shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#8A9993] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-[#5F7069] leading-relaxed border-t border-[#E2EAE6] pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <CTASection />
    </div>
  );
};
