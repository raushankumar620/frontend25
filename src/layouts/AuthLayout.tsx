import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { MessageSquare, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { APP_NAME } from '../utils/constants';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 z-10 bg-slate-900/60 backdrop-blur-xl border-r border-slate-800/80">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <MessageSquare className="w-5 h-5 fill-current" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">{APP_NAME}</span>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto my-8">
          <Outlet />
        </div>

        <div className="text-xs text-slate-500 text-center sm:text-left flex flex-wrap gap-4 items-center justify-between">
          <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Right Hero / Showcase Section */}
      <div className="hidden lg:flex w-1/2 relative bg-linear-to-br from-slate-950 via-emerald-950/40 to-slate-900 flex-col justify-between p-12 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex justify-end">
          <div className="flex items-center gap-2 bg-emerald-900/40 text-emerald-300 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-700/50 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>AI Automated WhatsApp Workflows</span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            Scale Customer Conversations with WhatsApp Meta Cloud API
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Broadcast personalized campaigns to millions, automate support with custom AI agents, and collaborate on shared team inboxes seamlessly.
          </p>

          <div className="space-y-3 pt-2">
            {[
              'Official Meta Business Solution Provider API Tier 3',
              'Smart AI agents trained on your product knowledge docs',
              '98% message open rate & real-time webhook analytics',
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-white">SOC-2 & GDPR Compliant Infrastructure</p>
            <p className="text-slate-400">End-to-end encryption with 99.99% uptime guarantee.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
