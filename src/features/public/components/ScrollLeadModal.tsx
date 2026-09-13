import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X, ArrowRight, Zap, Users, TrendingUp, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';
import { ROUTES, APP_NAME } from '../../../utils/constants';

const STORAGE_KEY = 'whatsappmsg_scroll_lead_popup_shown';

export const ScrollLeadModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if popup was already shown in this browser session
    const hasBeenShown = sessionStorage.getItem(STORAGE_KEY);
    if (hasBeenShown === 'true') {
      return;
    }

    const handleScroll = () => {
      // Trigger when user scrolls down 180px
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;
      if (scrollPosition > 180) {
        setIsOpen(true);
        sessionStorage.setItem(STORAGE_KEY, 'true');
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem(STORAGE_KEY, 'true');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    sessionStorage.setItem(STORAGE_KEY, 'true');
    setIsOpen(false);
    navigate(`${ROUTES.REGISTER}?email=${encodeURIComponent(email)}`);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 transition-opacity duration-300 animate-fadeIn"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="scroll-modal-title"
    >
      <div
        className="relative w-full max-w-sm sm:max-w-lg md:max-w-[600px] min-h-[370px] sm:min-h-[390px] bg-gradient-to-br from-[#f4fbf7] via-[#e8f7ee] to-[#d6f4e1] rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_-12px_rgba(1,59,35,0.28)] border border-[#cbe8d5] overflow-hidden flex flex-col md:flex-row transition-all transform animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Waves & Lighting */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <svg
            className="absolute -top-12 -right-12 w-64 h-64 text-[#22c55e]/20 opacity-70"
            viewBox="0 0 300 300"
            fill="none"
          >
            <path
              d="M150 0C232 0 300 68 300 150C225 160 190 100 120 140C60 175 90 250 0 250C0 112 68 0 150 0Z"
              fill="url(#leadWave1)"
            />
            <defs>
              <linearGradient id="leadWave1" x1="0" y1="0" x2="300" y2="300" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4ade80" stopOpacity="0.4" />
                <stop offset="0.6" stopColor="#22c55e" stopOpacity="0.2" />
                <stop offset="1" stopColor="#15803d" stopOpacity="0.05" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-[#22c55e]/15 rounded-full blur-xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-[#10b981]/15 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          type="button"
          aria-label="Close modal"
          className="absolute top-3.5 right-3.5 z-20 p-1.5 rounded-full text-[#5F7069] hover:text-[#14201C] bg-white/90 hover:bg-white transition-all shadow-2xs border border-[#E2EAE6] cursor-pointer hover:rotate-90 duration-200"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Crisp Value Proposition */}
        <div className="relative z-10 w-full md:w-[46%] p-5 sm:p-6 flex flex-col justify-between">
          <div className="space-y-3.5">
            {/* Logo & Meta Badge */}
            <div className="flex flex-col items-start gap-1.5">
              <img
                src="/images/logo.png"
                alt={APP_NAME}
                className="h-7 sm:h-8 w-auto object-contain drop-shadow-xs"
              />
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 border border-[#C4EBD0] text-[10px] font-semibold text-[#006736]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#05A222]" />
                <span>Meta Verified API</span>
              </div>
            </div>

            {/* Crisp Headline */}
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#102319] tracking-tight font-display leading-snug">
                Scale Sales on{' '}
                <span className="bg-gradient-to-r from-[#00a859] via-[#05b84c] to-[#1cd72c] bg-clip-text text-transparent">
                  WhatsApp
                </span>
              </h3>
              <p className="text-[11px] sm:text-xs text-[#486657] font-medium mt-1 leading-relaxed">
                Automate campaigns & AI support.
              </p>
            </div>

            {/* Short & Crisp Feature Bullets */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/80 border border-[#d2ebdc] shadow-2xs">
                <div className="w-6 h-6 rounded-lg bg-[#dcfce7] text-[#059669] flex items-center justify-center shrink-0">
                  <Zap className="w-3.5 h-3.5 fill-[#059669]/20 stroke-[2.5]" />
                </div>
                <span className="text-xs font-bold text-[#14201C]">
                  5-Min Easy Setup
                </span>
              </div>

              <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/80 border border-[#d2ebdc] shadow-2xs">
                <div className="w-6 h-6 rounded-lg bg-[#dcfce7] text-[#059669] flex items-center justify-center shrink-0">
                  <Users className="w-3.5 h-3.5 fill-[#059669]/20 stroke-[2.5]" />
                </div>
                <span className="text-xs font-bold text-[#14201C]">
                  Free 1,000 Contacts
                </span>
              </div>

              <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/80 border border-[#d2ebdc] shadow-2xs">
                <div className="w-6 h-6 rounded-lg bg-[#dcfce7] text-[#059669] flex items-center justify-center shrink-0">
                  <TrendingUp className="w-3.5 h-3.5 text-[#059669] stroke-[2.5]" />
                </div>
                <span className="text-xs font-bold text-[#14201C]">
                  300% Average ROI
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Sleek Form Card */}
        <div className="relative z-10 w-full md:w-[54%] p-4 sm:p-5 flex flex-col justify-center">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-[#e2efe8] shadow-[0_12px_30px_-8px_rgba(5,150,105,0.12)] flex flex-col justify-between h-full">
            <div>
              <div className="mb-3.5">
                <h2 id="scroll-modal-title" className="text-base sm:text-lg font-black text-[#102319] tracking-tight font-display">
                  Get Started Free
                </h2>
                <p className="text-xs text-[#527063] mt-0.5">
                  No credit card required.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#1F2A26] mb-1.5">
                    Work Email
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-[#739284] pointer-events-none flex items-center">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full rounded-xl border border-[#d6e5dd] bg-[#fafcfb] focus:bg-white text-[#14201C] text-xs sm:text-sm pl-9 pr-3.5 py-2.5 transition-all placeholder:text-[#8ea49a] focus:outline-none focus:border-[#05A222] focus:ring-3 focus:ring-[#05A222]/15 shadow-2xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-1.5 bg-gradient-to-r from-[#00a859] via-[#05b84c] to-[#00b050] hover:from-[#00964e] hover:to-[#04a042] text-white font-bold py-2.5 sm:py-3 px-4 rounded-xl shadow-md shadow-[#05A222]/20 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm cursor-pointer"
                >
                  <span>Create Free Account</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </form>

              <p className="text-[10px] sm:text-[11px] text-[#6A877A] text-center mt-2.5">
                By signing up, you agree to our{' '}
                <Link
                  to={ROUTES.PUBLIC_ABOUT}
                  onClick={handleClose}
                  className="text-[#05A222] font-semibold hover:underline"
                >
                  Terms
                </Link>{' '}
                &{' '}
                <Link
                  to={ROUTES.PUBLIC_ABOUT}
                  onClick={handleClose}
                  className="text-[#05A222] font-semibold hover:underline"
                >
                  Privacy
                </Link>
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E8F0EC]">
              <div className="flex items-center justify-center gap-4 text-[11px] font-semibold text-[#557566]">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#05A222]" />
                  <span>No setup fees</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#05A222]" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
