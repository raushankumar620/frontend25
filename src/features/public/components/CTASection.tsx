import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Zap, Sparkles, MessageSquare, PhoneCall } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, APP_NAME } from '../../../utils/constants';
import { useAuthStore } from '../../../store/authStore';

export const CTASection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
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
      <div className="w-full px-4 sm:px-6 lg:px-8">
        
        {/* Main Banner Card - with commonheader_bg.png */}
        <div className="relative rounded-3xl border border-[#C4EBD0] shadow-[0_16px_40px_rgba(1,59,35,0.08)] overflow-hidden text-[#14201C] bg-[#EBF7EE]">
          
          {/* Background Graphic Layer */}
          <div className="absolute inset-0 z-0 pointer-events-none select-none">
            <img 
              src="/images/commonheader_bg.png" 
              alt="WhatsAppMSG CTA Background" 
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center p-5 sm:p-7 lg:py-8 lg:px-10">
            
            {/* Left Mascot Graphic Column - Slide-in on Scroll */}
            <div className={`lg:col-span-5 flex justify-center items-center relative order-2 lg:order-1 transition-all duration-1000 ease-out transform ${
              isVisible 
                ? 'translate-x-0 opacity-100 scale-100 rotate-0' 
                : '-translate-x-24 opacity-0 scale-90 -rotate-6'
            }`}>
              
              {/* Subtle Glowing Aura behind Mascot */}
              <div className="absolute w-64 h-64 bg-radial from-[#05A222]/15 via-[#07CF74]/5 to-transparent rounded-full blur-2xl pointer-events-none" />

              {/* Interactive Character Container */}
              <div className="relative group max-w-[250px] sm:max-w-[300px] lg:max-w-[330px] transition-transform duration-300 hover:scale-105">
                <img
                  src="/chatingchater.png"
                  alt="WhatsAppMSG AI Assistant"
                  className="w-full h-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.15)]"
                  loading="lazy"
                />

                {/* Micro-badge overlay */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-2 bg-white/95 backdrop-blur-md border border-[#C4EBD0] text-[#006736] text-[10px] font-semibold px-2.5 py-0.5 rounded-lg shadow-xs flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#05A222] animate-ping" />
                  <span>24/7 AI Support Active</span>
                </div>
              </div>

            </div>

            {/* Right Content Column */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-3.5 text-center lg:text-left order-1 lg:order-2">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/90 border border-[#C4EBD0] text-[#006736] text-[11px] font-bold uppercase tracking-wider backdrop-blur-md shadow-2xs">
                <Sparkles className="w-3 h-3 text-[#05A222]" />
                <span>Start Scaling in Minutes</span>
              </div>

              {/* Heading */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight text-[#14201C]">
                Ready to automate your WhatsApp communication?
              </h2>

              {/* Subtext with Read More Toggle strictly on first line */}
              <p className="text-xs sm:text-sm text-[#4A5D54] max-w-xl mx-auto lg:mx-0 leading-relaxed transition-all">
                {!isExpanded ? (
                  <span>
                    Join <span className="text-[#14201C] font-bold">4,500+</span> high-growth brands on <span className="text-[#14201C] font-bold">{APP_NAME}</span>...{' '}
                    <button
                      type="button"
                      onClick={() => setIsExpanded(true)}
                      className="text-[#05A222] hover:text-[#006736] font-bold underline underline-offset-4 cursor-pointer text-xs inline-flex items-center transition-colors"
                    >
                      Read more
                    </button>
                  </span>
                ) : (
                  <span>
                    Join <span className="text-[#14201C] font-bold">4,500+</span> high-growth brands transforming customer sales & support on <span className="text-[#14201C] font-bold">{APP_NAME}</span>. Start your 14-day full access trial today with instant setup and zero broker markup.{' '}
                    <button
                      type="button"
                      onClick={() => setIsExpanded(false)}
                      className="text-[#05A222] hover:text-[#006736] font-bold underline underline-offset-4 cursor-pointer text-xs inline-flex items-center transition-colors"
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
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate(ROUTES.LOGIN);
                    } else {
                      navigate(ROUTES.DASHBOARD);
                    }
                  }}
                  className="relative group overflow-hidden rounded-xl bg-[#05A222] hover:bg-[#006736] text-white font-extrabold text-xs sm:text-sm px-6 py-3 shadow-md shadow-[#05A222]/25 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <div className="absolute inset-0 w-1/2 h-full bg-linear-to-r from-transparent via-white/25 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />
                  
                  <span className="tracking-tight">
                    {isAuthenticated ? 'Go to App Dashboard' : 'Start 14-Day Free Trial'}
                  </span>
                  
                  <div className="w-5 h-5 rounded-lg bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-colors text-white shadow-xs">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>

                {/* Talk to Enterprise Sales Button */}
                <button
                  onClick={() => navigate(ROUTES.PUBLIC_CONTACT)}
                  className="rounded-xl border border-[#C4EBD0] bg-white/90 hover:bg-white text-[#14201C] hover:text-[#006736] font-bold text-xs sm:text-sm px-5 py-3 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#05A222]" />
                  <span>Talk to Enterprise Sales</span>
                </button>

              </div>

              {/* Trust Indicators / Checklist */}
              <div className="pt-2.5 border-t border-[#C4EBD0]/70 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3.5 text-[11px] text-[#4A5D54] font-medium">
                <span className="flex items-center gap-1.5 bg-white/80 px-2 py-0.5 rounded-md border border-[#C4EBD0] shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#05A222]" />
                  No credit card required
                </span>
                <span className="flex items-center gap-1.5 bg-white/80 px-2 py-0.5 rounded-md border border-[#C4EBD0] shadow-2xs">
                  <Zap className="w-3.5 h-3.5 text-[#05A222]" />
                  1-Click Meta Cloud Setup
                </span>
                <span className="flex items-center gap-1.5 bg-white/80 px-2 py-0.5 rounded-md border border-[#C4EBD0] shadow-2xs">
                  <MessageSquare className="w-3.5 h-3.5 text-[#05A222]" />
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
