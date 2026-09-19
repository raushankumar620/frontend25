import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Landmark, 
  Stethoscope, 
  Home as HomeIcon, 
  GraduationCap, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { CTASection } from '../components/CTASection';
import { SEO } from '../../../seo';

export const Solutions: React.FC = () => {
  const navigate = useNavigate();
  const [selectedIndustry, setSelectedIndustry] = useState<string>('ecommerce');

  const industries = [
    {
      id: 'ecommerce',
      name: 'E-Commerce & Retail',
      icon: ShoppingBag,
      headline: 'Recover 35%+ Abandoned Carts & Double Repeat Purchases',
      badge: 'D2C & Retail Excellence',
      description: 'Transform WhatsApp into your most lucrative direct revenue channel. Send interactive rich catalogs, automated tracking updates, and hyper-personalized discount broadcasts.',
      benefits: [
        'Automated abandoned checkout reminders with 1-click buy buttons',
        'Real-time order confirmation, tracking, and delivery OTP alerts',
        'Interactive WhatsApp Product Catalog browsing without leaving chat',
        'Post-purchase feedback, review collection, and automated re-orders',
      ],
      metrics: [
        { value: '38%', label: 'Cart Recovery Rate' },
        { value: '98%', label: 'Open Rate' },
        { value: '4.8x', label: 'ROI on Broadcasts' },
      ],
    },
    {
      id: 'fintech',
      name: 'FinTech & Banking',
      icon: Landmark,
      headline: 'Instant 2FA OTPs, Fraud Alerts & Secure Banking Services',
      badge: 'Bank-Grade Compliance',
      description: 'Deliver ultra-fast authentication tokens and transactional account alerts with 99.999% SLA delivery. Backed by bank-grade encryption and Meta Cloud API security.',
      benefits: [
        'Sub-second OTP authentication delivery with zero SMS fallback delay',
        'Instant credit card transaction receipts and immediate fraud query buttons',
        'Automated loan eligibility calculator and document collection bot',
        'End-to-end encrypted statement downloads and balance inquiries',
      ],
      metrics: [
        { value: '< 2s', label: 'Avg OTP Delivery' },
        { value: '99.99%', label: 'Uptime Reliability' },
        { value: '60%', label: 'Lower Cost vs SMS' },
      ],
    },
    {
      id: 'healthcare',
      name: 'Healthcare & Clinics',
      icon: Stethoscope,
      headline: 'Patient Appointment Booking, Reminders & Telehealth Sync',
      badge: 'HIPAA & GDPR Ready',
      description: 'Cut patient no-shows by 70%. Automate doctor appointment scheduling, lab test ready notifications, prescription refills, and post-visit follow-ups.',
      benefits: [
        'Automated interactive appointment booking with reschedule buttons',
        'Secure lab report and diagnostic PDF delivery direct to patient WhatsApp',
        'Medication reminder schedules and automated prescription refills',
        'Pre-consultation intake questionnaire collection with zero paperwork',
      ],
      metrics: [
        { value: '-72%', label: 'No-Show Rate' },
        { value: '85%', label: 'Patient Adoption' },
        { value: '4.9/5', label: 'Patient Satisfaction' },
      ],
    },
    {
      id: 'realestate',
      name: 'Real Estate & Properties',
      icon: HomeIcon,
      headline: 'Instant Lead Qualification & Automated Site Tour Bookings',
      badge: 'High-Ticket Lead Gen',
      description: 'Respond to property inquiry ads in less than 5 seconds. Automatically qualify budgets, share brochure PDFs, and schedule in-person site visits with verified buyers.',
      benefits: [
        'Instant welcome message triggered from Facebook & Instagram Click-to-WhatsApp Ads',
        'Interactive floor plans, video walk-throughs, and price sheet delivery',
        'Automated buyer qualification filter (budget, preferred location, timeline)',
        'Direct calendar assignment to available field sales property agents',
      ],
      metrics: [
        { value: '5s', label: 'Lead Response Time' },
        { value: '3.2x', label: 'Site Visit Conversions' },
        { value: '+45%', label: 'Agent Productivity' },
      ],
    },
    {
      id: 'education',
      name: 'Education & EdTech',
      icon: GraduationCap,
      headline: 'Admissions Automation & Interactive Student Engagement',
      badge: 'Higher Ed & Online Learning',
      description: 'Streamline admissions funnels, share course curriculum brochures, send batch reminders, and provide 24/7 student doubt resolution via AI.',
      benefits: [
        'Instant course syllabus & fee structure distribution on inquiry',
        'Automated webinar, entrance test, and demo class reminders',
        'AI doubt-clearing bot answering curriculum and admission criteria FAQs',
        'Parent updates on fee deadlines, attendance, and exam scores',
      ],
      metrics: [
        { value: '65%', label: 'Application Completion' },
        { value: '80%', label: 'Query Automation' },
        { value: '4.5x', label: 'Webinar Attendance' },
      ],
    },
    {
      id: 'saas',
      name: 'B2B & SaaS Services',
      icon: Briefcase,
      headline: 'High-Touch VIP Account Management & Trial Activation',
      badge: 'B2B Growth Engine',
      description: 'Engage high-intent enterprise buyers on WhatsApp. Accelerate deal cycles, send renewal reminders, and connect VIP customers directly with account reps.',
      benefits: [
        'Automated onboarding milestone tips based on product usage telemetry',
        'Real-time SLA alerting and high-priority ticket escalation channels',
        'Contract renewal and invoice payment reminder sequences',
        'Direct connection between enterprise buyers and designated Account Executives',
      ],
      metrics: [
        { value: '+28%', label: 'Trial-to-Paid Rate' },
        { value: '92%', label: 'CSAT Score' },
        { value: '15m', label: 'Enterprise SLA' },
      ],
    },
  ];

  const active = industries.find((i) => i.id === selectedIndustry) || industries[0];

  return (
    <div className="bg-white text-[#1F2A26]">
      <SEO page="solutions" />
      
      {/* Top Header Hero */}
      <section className="relative overflow-hidden w-full border-b border-[#C4EBD0]/70 py-16 sm:py-20 lg:py-24 bg-[#EBF7EE]">
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <img 
            src="/images/commonheader_bg.png" 
            alt="WhatsAppMSG Solutions Header" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#C4EBD0] bg-white/80 backdrop-blur-xs text-[#006736] text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#05A222]" />
            Tailored Industry Solutions
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#14201C] tracking-tight mb-4 leading-tight">
            Built to solve unique challenges across every industry
          </h1>
          <p className="text-sm sm:text-base text-[#5F7069] leading-relaxed">
            See how leading brands in your sector use WhatsAppMSG to automate sales, elevate customer retention, and streamline operations.
          </p>
        </div>
      </section>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

        {/* Industry Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
          {industries.map((ind) => {
            const Icon = ind.icon;
            const isSelected = selectedIndustry === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => setSelectedIndustry(ind.id)}
                className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#05A222] text-white font-bold border-[#05A222] shadow-md shadow-[#05A222]/20 scale-105'
                    : 'bg-[#F6FAF8] text-[#5F7069] border-[#E2EAE6] hover:bg-white hover:text-[#14201C]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-[#05A222]'}`} />
                <span className="text-xs font-semibold">{ind.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Industry Showcase */}
        <div className="bg-[#F6FAF8] border border-[#E2EAE6] rounded-3xl p-6 sm:p-10 lg:p-12 mb-20 relative overflow-hidden shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9F9EE] text-[#006736] text-xs font-bold border border-[#C4EBD0]">
                {active.badge}
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#14201C] leading-tight">
                {active.headline}
              </h2>

              <p className="text-[#5F7069] text-sm sm:text-base leading-relaxed">
                {active.description}
              </p>

              <div className="space-y-3 pt-2">
                {active.benefits.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#05A222] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-[#1F2A26]">{b}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate(ROUTES.REGISTER)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="bg-[#05A222] hover:bg-[#006736] text-white font-bold"
                >
                  Deploy {active.name} Solution
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => navigate(ROUTES.PUBLIC_CONTACT)}
                  className="border-[#E2EAE6] text-[#14201C] hover:bg-white font-semibold"
                >
                  Schedule Industry Demo
                </Button>
              </div>
            </div>

            {/* Metrics & Preview Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white border border-[#E2EAE6] p-6 rounded-2xl space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#E2EAE6] pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#05A222]" />
                    <span className="text-xs font-bold text-[#14201C] uppercase tracking-wider">Proven Impact</span>
                  </div>
                  <span className="text-[10px] text-[#006736] font-mono bg-[#E9F9EE] px-2 py-0.5 rounded border border-[#C4EBD0] font-bold">Verified Case Study</span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  {active.metrics.map((m, idx) => (
                    <div key={idx} className="bg-[#F6FAF8] p-3 rounded-xl border border-[#E2EAE6]">
                      <div className="text-lg sm:text-2xl font-black text-[#05A222]">{m.value}</div>
                      <div className="text-[10px] text-[#5F7069] mt-1 font-medium">{m.label}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#E9F9EE] border border-[#C4EBD0] p-4 rounded-xl text-xs text-[#006736] flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#05A222] shrink-0 mt-0.5" />
                  <span>Includes Meta Business Manager onboarding and green tick verification assistance.</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      <CTASection />
    </div>
  );
};
