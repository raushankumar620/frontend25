import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  X,
  ArrowRight,
  ShieldCheck,
  Mail,
  Zap,
  Users,
  TrendingUp,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ROUTES } from '../../../utils/constants';

const STORAGE_KEY = 'whatsappmsg_scroll_lead_popup_shown';

export const ScrollLeadModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid work email.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      handleClose();
      navigate(`${ROUTES.REGISTER}?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/50 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="scroll-modal-title"
    >
      <div
        className="relative w-full max-w-[420px] sm:max-w-xl md:max-w-[820px] lg:max-w-[860px] bg-gradient-to-br from-[#ebf9f1] via-[#f3fbf6] to-[#ddf5e6] rounded-[28px] sm:rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,103,54,0.22)] border border-[#bce8cb] overflow-hidden p-5 sm:p-6 md:p-7 flex flex-col md:flex-row gap-5 md:gap-6 transition-all transform animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Soft Glow Accents */}
        <div className="absolute top-0 right-1/3 w-64 h-64 bg-[#22c55e]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-56 h-56 bg-[#10b981]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          type="button"
          aria-label="Close modal"
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-30 w-8 h-8 rounded-full text-[#4b6057] hover:text-[#14201C] bg-white/90 hover:bg-white transition-all shadow-xs border border-[#cfe2d7] flex items-center justify-center cursor-pointer hover:rotate-90 duration-200"
        >
          <X className="w-4 h-4" />
        </button>

        {/* LEFT COLUMN: Logo, Header, Character & Feature Pills */}
        <div className="relative z-10 flex-1 flex flex-col justify-between">
          
          {/* Header & Badges */}
          <div>
            {/* Logo + Verified Badge */}
            <div className="flex flex-col items-start gap-1.5 mb-2.5 sm:mb-3">
              <img
                src="/images/logo.png"
                alt="WhatsAppMSG"
                className="h-7 sm:h-8 w-auto object-contain drop-shadow-2xs select-none"
              />

              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-[#bce7cb] text-[10px] sm:text-[11px] font-bold text-[#007a3d] shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00a859]" />
                <span>Meta Verified API</span>
              </div>
            </div>

            {/* Title */}
            <h2 id="scroll-modal-title" className="text-xl sm:text-2xl md:text-[26px] font-black text-[#11231a] tracking-tight font-display leading-[1.2]">
              Scale Your Business <br />
              on <span className="text-[#00a859]">WhatsApp</span>
            </h2>

            {/* Subtitle */}
            <p className="text-xs text-[#4e6a5c] mt-1 sm:mt-1.5 leading-relaxed max-w-[340px]">
              Automate campaigns, manage customers and get AI support — all in one place.
            </p>
          </div>

          {/* Body Section: 3D Character on Left + 3 Feature Pills on Right */}
          <div className="mt-2.5 sm:mt-3 grid grid-cols-12 items-end gap-2 sm:gap-3">
            
            {/* Character (Enlarged) */}
            <div className="col-span-5 sm:col-span-5 md:col-span-5 flex flex-col items-center">
              <img
                src="/popchacter.png"
                alt="WhatsApp Mascot"
                className="w-full max-w-[160px] sm:max-w-[195px] md:max-w-[220px] lg:max-w-[235px] h-auto object-contain drop-shadow-[0_14px_24px_rgba(0,103,54,0.22)] select-none pointer-events-none transform hover:scale-105 transition-transform duration-300"
              />
              {/* Handwritten Note */}
              <div className="font-handwriting text-xs sm:text-[15px] font-bold text-[#008746] flex items-center gap-1 mt-0.5 select-none whitespace-nowrap">
                <span>/ Your Growth Partner</span>
                <span className="text-[#008746] text-xs">♡</span>
              </div>
            </div>

            {/* 3 Feature Pills */}
            <div className="col-span-7 sm:col-span-7 md:col-span-7 flex flex-col gap-2 pb-1">
              
              {/* Pill 1 */}
              <div className="bg-white/90 backdrop-blur-xs rounded-xl sm:rounded-2xl p-2 sm:p-2.5 border border-white shadow-[0_4px_12px_rgba(0,80,40,0.04)] flex items-center gap-2.5 transition-transform hover:translate-x-1 duration-200">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#e2f8eb] text-[#00a859] flex items-center justify-center shrink-0">
                  <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#00a859]/20" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-[#14201C] leading-tight">
                    5-Min Easy Setup
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-[#557566] leading-tight">
                    Get started in minutes
                  </p>
                </div>
              </div>

              {/* Pill 2 */}
              <div className="bg-white/90 backdrop-blur-xs rounded-xl sm:rounded-2xl p-2 sm:p-2.5 border border-white shadow-[0_4px_12px_rgba(0,80,40,0.04)] flex items-center gap-2.5 transition-transform hover:translate-x-1 duration-200">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#e2f8eb] text-[#00a859] flex items-center justify-center shrink-0">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-[#14201C] leading-tight">
                    Free 1,000 Contacts
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-[#557566] leading-tight">
                    Start reaching customers
                  </p>
                </div>
              </div>

              {/* Pill 3 */}
              <div className="bg-white/90 backdrop-blur-xs rounded-xl sm:rounded-2xl p-2 sm:p-2.5 border border-white shadow-[0_4px_12px_rgba(0,80,40,0.04)] flex items-center gap-2.5 transition-transform hover:translate-x-1 duration-200">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#e2f8eb] text-[#00a859] flex items-center justify-center shrink-0">
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-[#14201C] leading-tight">
                    300% Average ROI
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-[#557566] leading-tight">
                    Grow faster with automation
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Elevated White Form Card */}
        <div className="relative z-10 w-full md:w-[330px] lg:w-[360px] shrink-0 flex flex-col">
          
          <div className="h-full bg-white rounded-2xl sm:rounded-[28px] p-5 sm:p-6 md:p-7 shadow-[0_12px_32px_rgba(0,80,40,0.06)] border border-slate-100/80 flex flex-col justify-between">
            
            {/* Form Header */}
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#102319] tracking-tight font-display">
                Get Started <span className="text-[#00a859]">Free</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#637d71] mt-1 font-medium">
                No credit card required.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-3 p-2.5 bg-[#FDF2F2] border border-[#F8B4B4] rounded-xl text-xs text-[#D64545] font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#D64545]" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#1F2A26] mb-1.5">
                  Work Email
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-[#79998b] pointer-events-none flex items-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-[#d6e5dd] bg-[#fafcfb] focus:bg-white text-[#14201C] text-xs sm:text-sm pl-10 pr-3.5 py-3 transition-all placeholder:text-[#90a69c] focus:outline-none focus:border-[#00a859] focus:ring-3 focus:ring-[#00a859]/15 shadow-2xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#00a859] to-[#05b84c] hover:from-[#00964e] hover:to-[#04a644] text-white font-bold py-3 sm:py-3.5 px-4 rounded-xl shadow-md shadow-[#00a859]/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Creating...' : 'Create Free Account'}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>

            {/* Terms */}
            <p className="text-[11px] text-[#6A877A] text-center mt-3">
              By signing up, you agree to our{' '}
              <Link
                to={ROUTES.PUBLIC_ABOUT}
                onClick={handleClose}
                className="text-[#00a859] font-bold hover:underline"
              >
                Terms
              </Link>{' '}
              &{' '}
              <Link
                to={ROUTES.PUBLIC_ABOUT}
                onClick={handleClose}
                className="text-[#00a859] font-bold hover:underline"
              >
                Privacy
              </Link>
            </p>

            {/* Trust Badges */}
            <div className="mt-4 pt-3 border-t border-[#edf4f0] grid grid-cols-3 gap-1 text-center text-[10px] sm:text-[11px] font-semibold text-[#527063]">
              <div className="flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00a859] shrink-0" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00a859] shrink-0" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00a859] shrink-0" />
                <span>Secure & Private</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};


