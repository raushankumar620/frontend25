import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Zap, 
  Headphones, 
  Users, 
  Heart,
  CheckCircle2,
  Mail
} from 'lucide-react';
import { ROUTES, APP_NAME } from '../../../utils/constants';

// --- Accurate Social Media SVG Icons ---
const LinkedInIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.07v8.37h2.78z" />
  </svg>
);

const XTwitterIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YouTubeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const PublicFooter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  const socialIcons = [
    { 
      name: 'LinkedIn', 
      icon: LinkedInIcon, 
      url: 'https://www.linkedin.com/company/whatsapmsg/',
      colorClass: 'bg-[#0A66C2]/10 border-[#0A66C2]/25 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] hover:shadow-[0_4px_14px_rgba(10,102,194,0.4)]',
    },
    { 
      name: 'X', 
      icon: XTwitterIcon, 
      url: 'https://twitter.com/whatsapmsg',
      colorClass: 'bg-black/5 border-black/20 text-black hover:bg-black hover:text-white hover:border-black hover:shadow-[0_4px_14px_rgba(0,0,0,0.35)]',
    },
    { 
      name: 'YouTube', 
      icon: YouTubeIcon, 
      url: 'https://www.youtube.com/@whatsapmsg',
      colorClass: 'bg-[#FF0000]/10 border-[#FF0000]/25 text-[#FF0000] hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] hover:shadow-[0_4px_14px_rgba(255,0,0,0.4)]',
    },
    { 
      name: 'Instagram', 
      icon: InstagramIcon, 
      url: 'https://www.instagram.com/whatsapmsg/',
      colorClass: 'bg-[#E1306C]/10 border-[#E1306C]/25 text-[#E1306C] hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white hover:border-transparent hover:shadow-[0_4px_14px_rgba(225,48,108,0.4)]',
    },
    { 
      name: 'Facebook', 
      icon: FacebookIcon, 
      url: 'https://www.facebook.com/whatsapmsg',
      colorClass: 'bg-[#1877F2]/10 border-[#1877F2]/25 text-[#1877F2] hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] hover:shadow-[0_4px_14px_rgba(24,119,242,0.4)]',
    },
  ];

  return (
    <footer className="relative bg-[#FAFDFB] text-[#14201C] overflow-hidden">
      
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <img 
          src="/images/footerbg.png" 
          alt="WhatsAppMSG Footer Background" 
          className="w-full h-full object-cover object-bottom"
        />
      </div>

      {/* Flying Paper Airplane Illustration on Top Right */}
      <div className="hidden xl:block absolute top-6 right-10 pointer-events-none select-none z-10">
        <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
          <path 
            d="M15 125 C 25 85, 65 95, 95 55" 
            stroke="#1CD72C" 
            strokeWidth="1.8" 
            strokeDasharray="5 5" 
            strokeLinecap="round" 
            opacity="0.75"
          />
          <path 
            d="M90 50 L132 20 L108 68 L96 52 Z" 
            fill="#05A222"
          />
          <path 
            d="M108 68 L96 52 L132 20 Z" 
            fill="#039B56"
          />
        </svg>
      </div>

      {/* MAIN TOP SECTION */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 xl:px-14 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">
          
          {/* Col 1: Brand & Logo (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Logo */}
            <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 group">
              <img 
                src="/images/whatsapplogoshort.png" 
                alt="WhatsAppMSG Icon" 
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-xs shrink-0 transition-transform group-hover:scale-105"
              />
              <img 
                src="/images/seo/whatsappmsg-logo.png" 
                alt={APP_NAME} 
                className="h-8 sm:h-9 w-auto object-contain -translate-y-0.5 transition-transform group-hover:scale-102"
              />
            </Link>

            {/* Description */}
            <p className="text-xs sm:text-[13px] font-bold text-black leading-relaxed max-w-xs pt-1">
              The complete WhatsApp Business Platform for modern businesses. Send campaigns, automate support with AI, manage contacts and grow your business — all in one place.
            </p>

            {/* 5 Social Media Round Icons */}
            <div className="flex items-center gap-2.5 pt-1">
              {socialIcons.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow on ${item.name}`}
                  title={item.name}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-110 active:scale-95 cursor-pointer ${item.colorClass}`}
                >
                  <item.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Handwritten script badge on bottom-left */}
            <div className="pt-3">
              <div className="inline-flex items-center gap-1.5 font-serif italic text-base sm:text-lg font-bold text-[#05A222] select-none">
                <span>Let's Grow Together</span>
                <span className="not-italic text-sm">💚</span>
              </div>
              {/* Subtle underline curve */}
              <svg className="w-32 h-2 text-[#05A222]" viewBox="0 0 128 8" fill="none">
                <path d="M2 6 C 40 1, 90 2, 126 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>

          </div>

          {/* Col 2: Product (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-[#14201C] text-sm tracking-tight">
              Product
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] font-medium text-[#4A5D54]">
              <li>
                <Link to={ROUTES.PUBLIC_FEATURES} className="hover:text-[#006736] hover:translate-x-0.5 inline-block transition-transform">
                  Features
                </Link>
              </li>
              <li>
                <Link to={ROUTES.AI_DASHBOARD} className="hover:text-[#006736] hover:translate-x-0.5 inline-block transition-transform">
                  AI Assistant
                </Link>
              </li>
              <li>
                <Link to={ROUTES.CAMPAIGNS} className="hover:text-[#006736] hover:translate-x-0.5 inline-block transition-transform">
                  Campaigns
                </Link>
              </li>
              <li>
                <Link to={ROUTES.AUTOMATIONS} className="hover:text-[#006736] hover:translate-x-0.5 inline-block transition-transform">
                  Automation
                </Link>
              </li>
              <li>
                <Link to={ROUTES.TEMPLATES} className="hover:text-[#006736] hover:translate-x-0.5 inline-block transition-transform">
                  Templates
                </Link>
              </li>
              <li>
                <Link to={ROUTES.ANALYTICS} className="hover:text-[#006736] hover:translate-x-0.5 inline-block transition-transform">
                  Analytics
                </Link>
              </li>
              <li>
                <Link to={ROUTES.DEVELOPERS_WEBHOOKS} className="hover:text-[#006736] hover:translate-x-0.5 inline-block transition-transform">
                  Integrations
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PUBLIC_PRICING} className="hover:text-[#006736] hover:translate-x-0.5 inline-block transition-transform">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-[#14201C] text-sm tracking-tight">
              Company
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] font-medium text-[#4A5D54]">
              <li>
                <Link to={ROUTES.PUBLIC_ABOUT} className="hover:text-[#006736] hover:translate-x-0.5 inline-block transition-transform">
                  About Us
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PUBLIC_CONTACT} className="hover:text-[#006736] hover:translate-x-0.5 inline-block transition-transform">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PUBLIC_ABOUT} className="hover:text-[#006736] hover:translate-x-0.5 inline-block transition-transform">
                  Careers
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PUBLIC_FEATURES} className="hover:text-[#006736] hover:translate-x-0.5 inline-block transition-transform">
                  Blog
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PUBLIC_ABOUT} className="hover:text-[#006736] hover:translate-x-0.5 inline-block transition-transform">
                  Press & Media
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PUBLIC_SECURITY} className="hover:text-[#006736] hover:translate-x-0.5 inline-block transition-transform">
                  Security
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PUBLIC_TERMS} className="hover:text-[#006736] hover:translate-x-0.5 inline-block transition-transform">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PUBLIC_PRIVACY} className="hover:text-[#006736] hover:translate-x-0.5 inline-block transition-transform">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-[#14201C] text-sm tracking-tight">
              Resources
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] font-medium text-[#4A5D54]">
              <li>
                <Link to={ROUTES.DEVELOPERS_DOCS} className="hover:text-[#006736] hover:translate-x-0.5 inline-block transition-transform">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to={ROUTES.DEVELOPERS_DASHBOARD} className="hover:text-[#006736] hover:translate-x-0.5 inline-block transition-transform">
                  API Reference
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PUBLIC_CONTACT} className="hover:text-[#006736] hover:translate-x-0.5 inline-block transition-transform">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PUBLIC_FEATURES} className="hover:text-[#006736] hover:translate-x-0.5 inline-block transition-transform">
                  Video Tutorials
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PUBLIC_SECURITY} className="hover:text-[#006736] hover:translate-x-0.5 inline-block transition-transform">
                  Status
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PUBLIC_CONTACT} className="hover:text-[#006736] hover:translate-x-0.5 inline-block transition-transform">
                  Community
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PUBLIC_CONTACT} className="hover:text-[#006736] hover:translate-x-0.5 inline-block transition-transform">
                  Partner Program
                </Link>
              </li>
              <li>
                <Link to={ROUTES.WHATSAPP_NUMBERS} className="hover:text-[#006736] hover:translate-x-0.5 inline-block transition-transform">
                  WhatsApp Business
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Stay Updated Card (Span 3) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card */}
            <div className="bg-[#EBF7EE]/85 border border-[#C4EBD0] rounded-2xl p-5 sm:p-6 shadow-xs backdrop-blur-xs">
              
              <div className="flex items-center gap-2 text-xs font-bold text-[#006736] mb-2">
                <Mail className="w-4 h-4 text-[#05A222]" />
                <span>Stay Updated</span>
              </div>

              <h4 className="text-sm sm:text-base font-black text-[#14201C] tracking-tight leading-snug mb-3.5">
                Get the latest updates, tips and product news.
              </h4>

              {isSubscribed ? (
                <div className="flex items-center gap-2 bg-white/90 border border-[#C4EBD0] text-[#006736] text-xs font-bold px-3.5 py-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-[#05A222]" />
                  <span>Subscribed! Thank you 💚</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <div className="flex flex-col sm:flex-row items-stretch gap-2">
                    <input 
                      type="email" 
                      required
                      placeholder="Enter your email address" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 min-w-0 bg-white border border-[#C4EBD0] rounded-xl px-3.5 py-2 text-xs text-[#14201C] placeholder:text-[#8A9993] focus:outline-none focus:border-[#05A222] shadow-2xs"
                    />
                    <button 
                      type="submit"
                      className="bg-[#05A222] hover:bg-[#006736] text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center justify-center gap-1 shrink-0 transition-colors shadow-xs cursor-pointer"
                    >
                      <span>Subscribe</span>
                      <span>→</span>
                    </button>
                  </div>
                </form>
              )}

              <p className="text-[11px] text-[#5F7069] mt-2">
                No spam. Unsubscribe anytime.
              </p>

            </div>

            {/* 4 Feature Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 pt-1">
              
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <ShieldCheck className="w-5 h-5 text-[#05A222] mb-1 shrink-0" />
                <span className="text-[11px] font-bold text-[#14201C] leading-tight">Secure</span>
                <span className="text-[10px] text-[#5F7069] leading-tight">& Reliable</span>
              </div>

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <Zap className="w-5 h-5 text-[#05A222] mb-1 shrink-0" />
                <span className="text-[11px] font-bold text-[#14201C] leading-tight">99.9%</span>
                <span className="text-[10px] text-[#5F7069] leading-tight">Uptime</span>
              </div>

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <Headphones className="w-5 h-5 text-[#05A222] mb-1 shrink-0" />
                <span className="text-[11px] font-bold text-[#14201C] leading-tight">24/7</span>
                <span className="text-[10px] text-[#5F7069] leading-tight">Support</span>
              </div>

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <Users className="w-5 h-5 text-[#05A222] mb-1 shrink-0" />
                <span className="text-[11px] font-bold text-[#14201C] leading-tight">Trusted by</span>
                <span className="text-[10px] text-[#5F7069] leading-tight">10,000+ Brands</span>
              </div>

            </div>

            {/* Right Calligraphy script */}
            <div className="flex justify-end pt-1">
              <div className="font-serif italic text-base font-bold text-[#05A222] select-none text-right">
                <div>Business is Better on WhatsApp 💚</div>
              </div>
            </div>

          </div>

        </div>
      </div>


      {/* DARK FOREST GREEN BOTTOM COPYRIGHT BAR */}
      <div className="relative z-10 bg-[#013B23] text-white/85 text-xs py-4 px-4 sm:px-6 lg:px-10 xl:px-14 border-t border-[#006736]">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          
          <div className="flex items-center flex-wrap justify-center gap-2 text-[11px] sm:text-xs text-white/80">
            <span>© 2024 {APP_NAME}. All rights reserved.</span>
            <span className="hidden sm:inline text-white/40">|</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> in India
            </span>
          </div>

          <div className="flex items-center flex-wrap justify-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-white/80 font-medium">
            <Link to={ROUTES.HOME} className="hover:text-white transition-colors">
              Sitemap
            </Link>
            <span className="text-white/30">|</span>
            <Link to={ROUTES.PUBLIC_PRIVACY} className="hover:text-white transition-colors">
              Privacy
            </Link>
            <span className="text-white/30">|</span>
            <Link to={ROUTES.PUBLIC_TERMS} className="hover:text-white transition-colors">
              Terms
            </Link>
            <span className="text-white/30">|</span>
            <Link to={ROUTES.PUBLIC_SECURITY} className="hover:text-white transition-colors">
              Cookies
            </Link>
          </div>

        </div>
      </div>

    </footer>
  );
};
