import React from 'react';
import { 
  ShieldCheck, 
  Users, 
  Globe2, 
  HeartHandshake, 
  Zap, 
  Award, 
  CheckCircle2, 
  Lock
} from 'lucide-react';
import { APP_NAME } from '../../../utils/constants';
import { CTASection } from '../components/CTASection';
import { SEO } from '../../../seo';

export const About: React.FC = () => {
  const milestones = [
    { number: '120M+', label: 'Monthly Messages Processed' },
    { number: '99.99%', label: 'Infrastructure Uptime SLA' },
    { number: '140+', label: 'Countries Supported' },
    { number: '4,500+', label: 'Enterprise Brands' },
  ];

  const values = [
    {
      icon: Lock,
      title: 'Security & Trust First',
      description: 'We treat customer data with bank-grade seriousness. End-to-end encryption, SOC 2 compliance, and zero data selling are our foundational pillars.',
    },
    {
      icon: Zap,
      title: 'Sub-Second Velocity',
      description: 'Customer conversations happen in real-time. Our direct Meta Cloud API pipeline ensures broadcast delivery and AI responses in milliseconds.',
    },
    {
      icon: HeartHandshake,
      title: 'Transparent Partnerships',
      description: 'No hidden message markups, no deceptive lock-in contracts. You get direct Meta pass-through pricing with zero unexpected fees.',
    },
    {
      icon: Award,
      title: 'Developer Ergonomics',
      description: 'Built by engineers for modern teams. Everything we create is backed by complete SDKs, webhooks, CLI tools, and granular API documentation.',
    },
  ];

  return (
    <div className="bg-white text-[#1F2A26]">
      <SEO page="about" />
      
      {/* Top Header Hero */}
      <section className="relative overflow-hidden w-full border-b border-[#C4EBD0]/70 py-16 sm:py-20 lg:py-24 bg-[#EBF7EE]">
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <img 
            src="/images/commonheader_bg.png" 
            alt="WhatsAppMSG About Us Header" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#C4EBD0] bg-white/80 backdrop-blur-xs text-[#006736] text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <Users className="w-3.5 h-3.5 text-[#05A222]" />
            Our Mission & Story
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#14201C] tracking-tight mb-6 leading-tight">
            Pioneering the future of Conversational Commerce & AI
          </h1>
          <p className="text-sm sm:text-lg text-[#5F7069] leading-relaxed">
            {APP_NAME} was founded to eliminate the friction between enterprises and their customers. We build the high-throughput infrastructure that powers intelligent, automated WhatsApp conversations for the modern global economy.
          </p>
        </div>
      </section>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

        {/* Big Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-24">
          {milestones.map((m, idx) => (
            <div key={idx} className="bg-[#F6FAF8] border border-[#E2EAE6] p-6 sm:p-8 rounded-3xl text-center shadow-[0_8px_30px_rgba(1,59,35,0.04)] hover:border-[#05A222]/50 hover:shadow-[0_12px_36px_rgba(1,59,35,0.08)] transition-all">
              <div className="text-3xl sm:text-5xl font-black text-[#05A222] mb-2">{m.number}</div>
              <div className="text-xs sm:text-sm text-[#5F7069] font-semibold">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Meta Partnership Story */}
        <div className="bg-linear-to-br from-[#E9F9EE] via-[#F6FAF8] to-white border border-[#C4EBD0] rounded-3xl p-8 sm:p-12 mb-24 relative overflow-hidden shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9F9EE] text-[#006736] text-xs font-bold border border-[#C4EBD0]">
                <ShieldCheck className="w-4 h-4 text-[#05A222]" />
                Official Meta Business Solution Provider
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14201C]">
                Direct Cloud API Partnership with Zero Intermediaries
              </h2>
              <p className="text-xs sm:text-sm text-[#5F7069] leading-relaxed">
                Unlike legacy aggregators that route messages through unpredictable intermediary SMS gateways, {APP_NAME} connects your business directly to Meta's Cloud API infrastructure. This guarantees unmatched delivery speeds, automatic green tick verification pathways, and official Meta pricing.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#1F2A26]">
                  <CheckCircle2 className="w-4 h-4 text-[#05A222] shrink-0" />
                  <span>Direct Meta Graph API v20.0</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#1F2A26]">
                  <CheckCircle2 className="w-4 h-4 text-[#05A222] shrink-0" />
                  <span>Tier 3 100k msg/day Tier Status</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#1F2A26]">
                  <CheckCircle2 className="w-4 h-4 text-[#05A222] shrink-0" />
                  <span>Official Green Tick Assistance</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#1F2A26]">
                  <CheckCircle2 className="w-4 h-4 text-[#05A222] shrink-0" />
                  <span>SOC 2 Type II & GDPR Compliant</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="w-44 h-44 rounded-3xl bg-white border border-[#C4EBD0] flex flex-col items-center justify-center p-6 text-center shadow-lg">
                <Globe2 className="w-16 h-16 text-[#05A222] mb-2" />
                <span className="text-xs font-bold text-[#14201C] uppercase tracking-wider">Global Reach</span>
                <span className="text-[10px] text-[#5F7069] mt-1">Multi-Region Cloud</span>
              </div>
            </div>
          </div>
        </div>

        {/* Company Values */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#14201C] mb-2">Our Operating Principles</h3>
            <p className="text-xs sm:text-sm text-[#5F7069]">The core values driving our engineering and customer support.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div key={idx} className="bg-white border border-[#E2EAE6] p-6 sm:p-8 rounded-2xl flex items-start gap-5 hover:border-[#05A222]/50 hover:shadow-[0_12px_36px_rgba(1,59,35,0.08)] transition-all shadow-[0_8px_30px_rgba(1,59,35,0.04)]">
                  <div className="w-12 h-12 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#05A222] shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-[#14201C] mb-1.5">{val.title}</h4>
                    <p className="text-xs sm:text-sm text-[#5F7069] leading-relaxed">{val.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <CTASection />
    </div>
  );
};
