import React from 'react';
import { 
  Send, 
  Bot, 
  Share2, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Send,
      title: 'Meta Cloud API Direct',
      description: 'Send high-throughput marketing broadcasts, OTPs, and alerts directly via Meta Cloud API with 0% middleman latency.',
      badge: 'Official API',
      badgeColor: 'bg-[#E9F9EE] text-[#006736] border-[#C4EBD0]',
    },
    {
      icon: Bot,
      title: 'Domain AI Agents',
      description: 'Train autonomous LLM bots on your documents, catalogs, and FAQs to resolve 80%+ customer inquiries 24/7.',
      badge: 'GPT-4o RAG',
      badgeColor: 'bg-[#E9F9EE] text-[#006736] border-[#C4EBD0]',
    },
    {
      icon: Share2,
      title: 'Visual Flow Automation',
      description: 'Build multi-step conditional conversational journeys, CRM webhooks, and automated drip sequences with no code.',
      badge: 'Drag & Drop',
      badgeColor: 'bg-[#E9F9EE] text-[#006736] border-[#C4EBD0]',
    },
    {
      icon: Users,
      title: 'Multi-Agent Shared Inbox',
      description: 'Collaborate seamlessly with your entire support & sales team with round-robin routing, private internal notes, and tags.',
      badge: 'Team Sync',
      badgeColor: 'bg-[#E9F9EE] text-[#006736] border-[#C4EBD0]',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Telemetry & BI',
      description: 'Granular visibility into delivery rates, read receipts, button clicks, cost attribution, and agent response times.',
      badge: 'Live Analytics',
      badgeColor: 'bg-[#E9F9EE] text-[#006736] border-[#C4EBD0]',
    },
    {
      icon: ShieldCheck,
      title: 'Bank-Grade Security & RBAC',
      description: 'Enterprise role-based permissions, audit logs, GDPR compliance, and end-to-end encryption for mission-critical operations.',
      badge: 'SOC 2 Ready',
      badgeColor: 'bg-[#E9F9EE] text-[#006736] border-[#C4EBD0]',
    },
  ];

  return (
    <section className="py-20 bg-[#F6FAF8] border-b border-[#E2EAE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9F9EE] border border-[#C4EBD0] text-[#006736] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#05A222]" />
            Core Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#14201C] tracking-tight mb-4">
            Everything your business needs to master WhatsApp communication
          </h2>
          <p className="text-sm sm:text-base text-[#5F7069]">
            A comprehensive, all-in-one suite built for revenue teams, support leaders, and developers.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-[#E2EAE6] rounded-2xl p-6 sm:p-7 shadow-[0_8px_30px_rgba(1,59,35,0.04)] hover:shadow-[0_12px_36px_rgba(1,59,35,0.08)] hover:border-[#05A222]/50 transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#05A222] group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#14201C] mb-2 group-hover:text-[#006736] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5F7069] leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E2EAE6]">
                  <Link
                    to={ROUTES.PUBLIC_FEATURES}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#05A222] hover:text-[#006736]"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
