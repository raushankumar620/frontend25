import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Play,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { ROUTES, APP_NAME } from '../../../utils/constants';
import { useAuthStore } from '../../../store/authStore';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // Typewriter effect state
  const rotatingWords = [
    APP_NAME,
    'AI Agents',
    'Broadcasts',
    'Automations',
    'Meta Cloud API',
  ];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState(APP_NAME);
  const [isDeleting, setIsDeleting] = useState(false);

  React.useEffect(() => {
    const currentFullWord = rotatingWords[currentWordIndex];
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (currentText.length < currentFullWord.length) {
        timer = setTimeout(() => {
          setCurrentText(currentFullWord.slice(0, currentText.length + 1));
        }, 110);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(currentFullWord.slice(0, currentText.length - 1));
        }, 55);
      } else {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex]);

  return (
    <section className="relative overflow-hidden w-full bg-[#EBF7EE] border-b border-[#E2EAE6] min-h-[580px] lg:min-h-[660px] xl:min-h-[720px] flex items-center">
      {/* Desktop Background Banner Image (Mascot & devices on the right, pointing to the content) */}
      <div className="hidden lg:block absolute inset-0 z-0 pointer-events-none select-none">
        <img
          src="/images/hero-banner.png"
          alt="WhatsAppMSG Official Platform"
          className="w-full h-full object-cover object-right xl:object-[center_right] transition-transform duration-700"
        />
        {/* Soft feathering gradient on far left to guarantee crisp text legibility */}
        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#F4FAF6]/90 via-[#F4FAF6]/60 to-transparent" />
      </div>

      {/* Content Container (Aligned precisely inside the left empty wave area) */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-12 sm:py-16 lg:py-20">
        <div className="max-w-xl xl:max-w-2xl text-center lg:text-left space-y-6 mx-auto lg:mx-0">

          {/* Official Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#C4EBD0] bg-transparent text-[#006736] text-xs font-bold tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#05A222] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#05A222]" />
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#05A222]" />
            <span>Official Meta Cloud API • Tier 3 Certified</span>
          </div>

          {/* Main Headline with Typewriter */}
          <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tight text-[#14201C] leading-[1.12]">
            <span className="block">Scale WhatsApp Sales & Support</span>
            <div className="mt-1 sm:mt-2 flex items-center justify-center lg:justify-start flex-nowrap whitespace-nowrap gap-x-2 sm:gap-x-3">
              <span className="text-[#14201C] shrink-0">with</span>
              <span className="relative inline-flex items-center text-left bg-gradient-to-r from-[#05A222] via-[#039B56] to-[#006736] bg-clip-text text-transparent whitespace-nowrap shrink-0">
                <span>{currentText}</span>
                <span className="inline-block w-[3px] sm:w-[4px] h-[0.85em] bg-[#05A222] ml-1.5 rounded-full animate-pulse align-middle" />
              </span>
            </div>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-[#4A5D54] leading-relaxed">
            Automate customer chats with AI Agents, launch high-volume broadcast campaigns, and manage shared multi-agent team inboxes with direct Meta Cloud API speed.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1">
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                if (!isAuthenticated) {
                  navigate(ROUTES.LOGIN);
                } else {
                  navigate(ROUTES.DASHBOARD);
                }
              }}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto bg-[#05A222] hover:bg-[#006736] text-white shadow-lg shadow-[#05A222]/25 px-8 py-3.5 font-bold rounded-xl text-base transition-all hover:scale-102"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Start Free Trial'}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate(ROUTES.PUBLIC_SOLUTIONS)}
              leftIcon={<Play className="w-4 h-4 text-[#05A222]" />}
              className="w-full sm:w-auto border-[#C4EBD0] bg-white/95 backdrop-blur-sm hover:bg-[#F6FAF8] text-[#14201C] font-semibold px-6 py-3.5 rounded-xl shadow-xs text-base"
            >
              Explore Solutions
            </Button>
          </div>

          {/* Trust Highlights */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-xs font-semibold text-[#5F7069] pt-1">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#05A222]" />
              14-Day Free Trial
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#05A222]" />
              No Credit Card Required
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#05A222]" />
              Instant 5-Min Setup
            </span>
          </div>

          {/* Metric Stats Cards */}
          <div className="pt-3 grid grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto lg:mx-0 text-left">
            <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-[#C4EBD0]/80 p-3 sm:p-4 shadow-xs">
              <div className="text-xl sm:text-2xl font-black text-[#14201C]">100k+</div>
              <div className="text-[11px] sm:text-xs text-[#5F7069] font-medium leading-tight mt-0.5">Msgs / Day Tier</div>
            </div>
            <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-[#C4EBD0]/80 p-3 sm:p-4 shadow-xs">
              <div className="text-xl sm:text-2xl font-black text-[#05A222]">99.99%</div>
              <div className="text-[11px] sm:text-xs text-[#5F7069] font-medium leading-tight mt-0.5">Delivery SLA</div>
            </div>
            <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-[#C4EBD0]/80 p-3 sm:p-4 shadow-xs">
              <div className="text-xl sm:text-2xl font-black text-[#14201C]">0%</div>
              <div className="text-[11px] sm:text-xs text-[#5F7069] font-medium leading-tight mt-0.5">Broker Markup</div>
            </div>
          </div>

          {/* Mobile Illustration Showcase (rendered beneath text on small screens) */}
          <div className="lg:hidden mt-6 pt-4 w-full rounded-2xl overflow-hidden shadow-lg border border-[#C4EBD0] bg-white">
            <img
              src="/images/hero-banner.png"
              alt="WhatsAppMSG Platform Illustration"
              className="w-full h-auto object-contain"
            />
          </div>

        </div>
      </div>
    </section>
  );
};
