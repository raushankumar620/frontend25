import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Sparkles, MessageSquare } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES, APP_NAME } from '../../../utils/constants';

export const CTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-r from-[#013B23] via-[#006736] to-[#013B23] rounded-3xl p-8 sm:p-14 shadow-[0_20px_60px_rgba(1,59,35,0.25)] text-white relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#1CD72C]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#1CD72C]" />
              Start Scaling in Minutes
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready to automate your WhatsApp communication?
            </h2>

            <p className="text-sm sm:text-lg text-[#E9F9EE] max-w-xl mx-auto leading-relaxed">
              Join 4,500+ high-growth brands transforming customer sales and support on {APP_NAME}. Start your 14-day full access trial today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate(ROUTES.REGISTER)}
                rightIcon={<ArrowRight className="w-4 h-4 text-[#006736]" />}
                className="w-full sm:w-auto bg-white hover:bg-[#E9F9EE] text-[#006736] font-extrabold shadow-lg px-8 py-3.5 text-sm"
              >
                Start 14-Day Free Trial
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate(ROUTES.PUBLIC_CONTACT)}
                className="w-full sm:w-auto border-white/40 hover:bg-white/10 text-white font-semibold"
              >
                Talk to Enterprise Sales
              </Button>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-[#E9F9EE] font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#1CD72C]" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#6AEB31]" />
                1-Click Meta Cloud Setup
              </span>
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#1CD72C]" />
                Zero Broker Markup
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
