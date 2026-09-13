import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Zap, Sparkles, MessageSquare, PhoneCall } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, APP_NAME } from '../../../utils/constants';

export const CTASection: React.FC = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-8 sm:py-12 bg-[#F6FAF8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Banner Card - Slimmer & Streamlined */}
        <div className="relative rounded-3xl bg-linear-to-br from-[#013B23] via-[#006736] to-[#012817] border border-[#1CD72C]/25 shadow-[0_20px_50px_rgba(1,59,35,0.22)] overflow-hidden text-white">
          
          {/* Ambient Lighting & Glows */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#1CD72C]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#07CF74]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#1CD72C_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center p-5 sm:p-7 lg:py-7 lg:px-10">
            
            {/* Left Mascot Graphic Column - Slide-in on Scroll */}
            <div className={`lg:col-span-5 flex justify-center items-center relative order-2 lg:order-1 transition-all duration-1000 ease-out transform ${
              isVisible 
                ? 'translate-x-0 opacity-100 scale-100 rotate-0' 
                : '-translate-x-24 opacity-0 scale-90 -rotate-6'
            }`}>
              
              {/* Glowing Aura behind Mascot */}
              <div className="absolute w-64 h-64 bg-radial from-[#1CD72C]/35 via-[#07CF74]/15 to-transparent rounded-full blur-2xl pointer-events-none" />

              {/* Interactive Character Container */}
              <div className="relative group max-w-[250px] sm:max-w-[300px] lg:max-w-[330px] transition-transform duration-300 hover:scale-105">
                <img
                  src="/chatingchater.png"
                  alt="WhatsAppMsg AI Mascot"
                  className="w-full h-auto object-contain drop-shadow-[0_18px_35px_rgba(0,0,0,0.42)]"
                  loading="lazy"
                />

                {/* Micro-badge overlay */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-2 bg-[#013B23]/95 backdrop-blur-md border border-[#1CD72C]/50 text-[#E9F9EE] text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1CD72C] animate-ping" />
                  <span>24/7 AI Support Active</span>
                </div>
              </div>

            </div>

            {/* Right Content Column */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-3.5 text-center lg:text-left order-1 lg:order-2">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#E9F9EE] text-[11px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs">
                <Sparkles className="w-3 h-3 text-[#1CD72C]" />
                <span>Start Scaling in Minutes</span>
              </div>

              {/* Heading */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight text-white">
                Ready to automate your WhatsApp communication?
              </h2>

              {/* Subtext with Read More Toggle strictly on first line */}
              <p className="text-xs sm:text-sm text-[#E9F9EE]/90 max-w-xl mx-auto lg:mx-0 leading-relaxed transition-all">
                {!isExpanded ? (
                  <span>
                    Join <span className="text-white font-bold">4,500+</span> high-growth brands on <span className="text-white font-bold">{APP_NAME}</span>...{' '}
                    <button
                      type="button"
                      onClick={() => setIsExpanded(true)}
                      className="text-[#1CD72C] hover:text-white font-bold underline underline-offset-4 cursor-pointer text-xs inline-flex items-center transition-colors"
                    >
                      Read more
                    </button>
                  </span>
                ) : (
                  <span>
                    Join <span className="text-white font-bold">4,500+</span> high-growth brands transforming customer sales & support on <span className="text-white font-bold">{APP_NAME}</span>. Start your 14-day full access trial today with instant setup and zero broker markup.{' '}
                    <button
                      type="button"
                      onClick={() => setIsExpanded(false)}
                      className="text-[#1CD72C] hover:text-white font-bold underline underline-offset-4 cursor-pointer text-xs inline-flex items-center transition-colors"
                    >
                      Read less
                    </button>
                  </span>
                )}
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-1">
                
                {/* Enhanced Start 14-Day Free Trial Button */}
                <button
                  onClick={() => navigate(ROUTES.REGISTER)}
                  className="relative group overflow-hidden rounded-xl bg-white hover:bg-[#F0FAF3] text-[#006736] font-extrabold text-xs sm:text-sm px-6 py-3 shadow-[0_10px_25px_rgba(0,0,0,0.3),0_0_20px_rgba(28,215,44,0.3)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.4),0_0_28px_rgba(28,215,44,0.45)] border-2 border-white transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <div className="absolute inset-0 w-1/2 h-full bg-linear-to-r from-transparent via-white/40 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />
                  
                  <span className="tracking-tight">Start 14-Day Free Trial</span>
                  
                  <div className="w-5 h-5 rounded-lg bg-[#E9F9EE] group-hover:bg-[#006736] group-hover:text-white flex items-center justify-center transition-colors text-[#006736] shadow-xs">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>

                {/* Talk to Enterprise Sales Button */}
                <button
                  onClick={() => navigate(ROUTES.PUBLIC_CONTACT)}
                  className="rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3 backdrop-blur-md transition-all flex items-center justify-center gap-2 hover:border-white/50 cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#1CD72C]" />
                  <span>Talk to Enterprise Sales</span>
                </button>

              </div>

              {/* Trust Indicators / Checklist */}
              <div className="pt-2.5 border-t border-white/15 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3.5 text-[11px] text-[#E9F9EE] font-medium">
                <span className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1CD72C]" />
                  No credit card required
                </span>
                <span className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                  <Zap className="w-3.5 h-3.5 text-[#6AEB31]" />
                  1-Click Meta Cloud Setup
                </span>
                <span className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                  <MessageSquare className="w-3.5 h-3.5 text-[#1CD72C]" />
                  Zero Broker Markup
                </span>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
