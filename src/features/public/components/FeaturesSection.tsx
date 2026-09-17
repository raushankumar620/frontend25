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
      iconBoxColor: 'bg-linear-to-br from-[#05A222] to-[#006736] text-white shadow-md shadow-[#05A222]/30',
      badgeColor: 'bg-[#E9F9EE] text-[#006736] border-[#C4EBD0]',
      hoverBorder: 'hover:border-[#05A222]/50 hover:shadow-emerald-500/10',
      linkColor: 'text-[#05A222] hover:text-[#006736]',
      topAccent: 'bg-[#05A222]',
    },
    {
      icon: Bot,
      title: 'Domain AI Agents',
      description: 'Train autonomous LLM bots on your documents, catalogs, and FAQs to resolve 80%+ customer inquiries 24/7.',
      badge: 'GPT-4o RAG',
      iconBoxColor: 'bg-linear-to-br from-purple-500 to-purple-700 text-white shadow-md shadow-purple-500/30',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      hoverBorder: 'hover:border-purple-400 hover:shadow-purple-500/10',
      linkColor: 'text-purple-600 hover:text-purple-800',
      topAccent: 'bg-purple-500',
    },
    {
      icon: Share2,
      title: 'Visual Flow Automation',
      description: 'Build multi-step conditional conversational journeys, CRM webhooks, and automated drip sequences with no code.',
      badge: 'Drag & Drop',
      iconBoxColor: 'bg-linear-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/30',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      hoverBorder: 'hover:border-amber-400 hover:shadow-amber-500/10',
      linkColor: 'text-amber-600 hover:text-amber-800',
      topAccent: 'bg-amber-500',
    },
    {
      icon: Users,
      title: 'Multi-Agent Shared Inbox',
      description: 'Collaborate seamlessly with your entire support & sales team with round-robin routing, private internal notes, and tags.',
      badge: 'Team Sync',
      iconBoxColor: 'bg-linear-to-br from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/30',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      hoverBorder: 'hover:border-sky-400 hover:shadow-sky-500/10',
      linkColor: 'text-sky-600 hover:text-sky-800',
      topAccent: 'bg-sky-500',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Telemetry & BI',
      description: 'Granular visibility into delivery rates, read receipts, button clicks, cost attribution, and agent response times.',
      badge: 'Live Analytics',
      iconBoxColor: 'bg-linear-to-br from-indigo-500 to-indigo-700 text-white shadow-md shadow-indigo-500/30',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      hoverBorder: 'hover:border-indigo-400 hover:shadow-indigo-500/10',
      linkColor: 'text-indigo-600 hover:text-indigo-800',
      topAccent: 'bg-indigo-500',
    },
    {
      icon: ShieldCheck,
      title: 'Bank-Grade Security & RBAC',
      description: 'Enterprise role-based permissions, audit logs, GDPR compliance, and end-to-end encryption for mission-critical operations.',
      badge: 'SOC 2 Ready',
      iconBoxColor: 'bg-linear-to-br from-rose-500 to-red-700 text-white shadow-md shadow-rose-500/30',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      hoverBorder: 'hover:border-rose-400 hover:shadow-rose-500/10',
      linkColor: 'text-rose-600 hover:text-rose-800',
      topAccent: 'bg-rose-500',
    },
  ];

  return (
    <section className="py-20 bg-[#F6FAF8] border-b border-[#E2EAE6]">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        
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
                className={`bg-white border border-[#E2EAE6] rounded-2xl p-6 sm:p-7 shadow-[0_8px_30px_rgba(1,59,35,0.04)] hover:shadow-[0_16px_40px_rgba(1,59,35,0.08)] ${item.hoverBorder} transition-all duration-300 group flex flex-col justify-between relative overflow-hidden`}
              >
                {/* Subtle colored accent top border on hover */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${item.topAccent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${item.iconBoxColor} group-hover:scale-110 transition-transform duration-200 shadow-2xs`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${item.badgeColor} shadow-2xs`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#14201C] mb-2 group-hover:text-[#14201C] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5F7069] leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E2EAE6]">
                  <Link
                    to={ROUTES.PUBLIC_FEATURES}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold ${item.linkColor} transition-colors`}
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
