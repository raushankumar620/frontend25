import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { APP_NAME } from '../utils/constants';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-white text-[#1F2A26] font-sans">
      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 z-10 bg-white border-r border-[#E2EAE6]">
        <div>
          <Link to="/" className="inline-flex items-center">
            <img
              src="/images/logo.png"
              alt={APP_NAME}
              className="h-9 w-auto object-contain"
            />
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto my-8">
          <Outlet />
        </div>

        <div className="text-xs text-[#8A9993] text-center sm:text-left flex flex-wrap gap-4 items-center justify-between border-t border-[#E2EAE6] pt-4">
          <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#14201C] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#14201C] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Right Hero / Showcase Section */}
      <div className="hidden lg:flex w-1/2 relative bg-linear-to-br from-[#013B23] via-[#006736] to-[#013B23] flex-col justify-between p-12 overflow-hidden text-white">
        {/* Subtle Decorative Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#1CD72C]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#07CF74]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex justify-end">
          <div className="flex items-center gap-2 bg-white/10 text-[#E9F9EE] px-3.5 py-1.5 rounded-full text-xs font-semibold border border-white/20 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#1CD72C]" />
            <span>AI Automated WhatsApp Workflows</span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            Scale Customer Conversations with WhatsApp Meta Cloud API
          </h2>
          <p className="text-[#E2EAE6] text-sm leading-relaxed">
            Broadcast personalized campaigns to millions, automate customer support with custom AI agents, and collaborate on shared team inboxes seamlessly.
          </p>

          <div className="space-y-3 pt-2">
            {[
              'Official Meta Business Solution Provider API Tier 3',
              'Smart AI agents trained on your product knowledge docs',
              '98% message open rate & real-time webhook analytics',
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs text-white/90">
                <CheckCircle2 className="w-4 h-4 text-[#1CD72C] shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 bg-white/10 border border-white/20 p-4.5 rounded-2xl flex items-center gap-4 backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-white/15 text-[#1CD72C] border border-white/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-white">SOC-2 & GDPR Compliant Infrastructure</p>
            <p className="text-[#E2EAE6] mt-0.5">End-to-end encryption with 99.99% uptime guarantee.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
