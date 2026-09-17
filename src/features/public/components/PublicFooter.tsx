import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Mail, 
  X, 
  Lock, 
  FileText, 
  Check
} from 'lucide-react';
import { ROUTES, APP_NAME } from '../../../utils/constants';

// --- Accurate Official Social Media SVG Icons ---
const LinkedInIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.07v8.37h2.78z" />
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const YouTubeIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

// --- The 4 Official Social Media Channels with Distinct Vibrant Brand Colors ---
const SOCIAL_LINKS = [
  {
    name: 'LinkedIn',
    handle: 'WhatsAppMSG Official',
    url: 'https://www.linkedin.com/company/whatsapmsg/',
    icon: LinkedInIcon,
    buttonClass: 'bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/30 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] hover:shadow-[0_4px_16px_rgba(10,102,194,0.4)]',
  },
  {
    name: 'Instagram',
    handle: '@whatsapmsg',
    url: 'https://www.instagram.com/whatsapmsg/',
    icon: InstagramIcon,
    buttonClass: 'bg-[#E1306C]/10 text-[#E1306C] border-[#E1306C]/30 hover:bg-linear-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white hover:border-transparent hover:shadow-[0_4px_16px_rgba(225,48,108,0.4)]',
  },
  {
    name: 'YouTube',
    handle: '@whatsapmsg',
    url: 'https://www.youtube.com/@whatsapmsg',
    icon: YouTubeIcon,
    buttonClass: 'bg-[#FF0000]/10 text-[#FF0000] border-[#FF0000]/30 hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] hover:shadow-[0_4px_16px_rgba(255,0,0,0.4)]',
  },
  {
    name: 'Facebook',
    handle: 'WhatsAppMSG Official',
    url: 'https://www.facebook.com/whatsapmsg',
    icon: FacebookIcon,
    buttonClass: 'bg-[#1877F2]/10 text-[#1877F2] border-[#1877F2]/30 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] hover:shadow-[0_4px_16px_rgba(24,119,242,0.4)]',
  },
];

export const PublicFooter: React.FC = () => {
  // Interactive Legal Modal State
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'privacy' | 'terms' | 'security'>('privacy');

  const openLegalModal = (tab: 'privacy' | 'terms' | 'security') => {
    setLegalModalTab(tab);
    setLegalModalOpen(true);
  };

  return (
    <footer className="bg-[#F8FAF9] border-t border-[#E2EAE6] text-[#4A5D54]">
      
      {/* MAIN CLEAN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Column (Col Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to={ROUTES.HOME} className="inline-flex items-center">
              <img
                src="/images/logo.png"
                alt={APP_NAME}
                className="h-10 sm:h-11 w-auto object-contain transition-transform hover:scale-102"
              />
            </Link>

            <p className="text-sm text-[#5F7069] leading-relaxed max-w-sm">
              The modern WhatsApp Business Cloud API & AI platform for customer support automation, marketing broadcasts, and enterprise sales.
            </p>

            <div className="inline-flex items-center gap-2 text-xs text-[#006736] font-semibold bg-[#E9F9EE] px-3 py-1.5 rounded-full border border-[#C4EBD0]">
              <ShieldCheck className="w-4 h-4 text-[#05A222] shrink-0" />
              <span>Official Meta Business Solution Partner</span>
            </div>

            <div className="pt-1">
              <a
                href="mailto:whatsappmsgofficial@gmail.com"
                className="inline-flex items-center gap-2 text-sm text-[#14201C] hover:text-[#006736] transition-colors font-medium"
              >
                <Mail className="w-4 h-4 text-[#006736]" />
                <span>whatsappmsgofficial@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Column 1: Product */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#14201C] text-sm uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link to={ROUTES.PUBLIC_FEATURES} className="text-[#5F7069] hover:text-[#006736] transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PUBLIC_SOLUTIONS} className="text-[#5F7069] hover:text-[#006736] transition-colors">
                  Solutions
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PUBLIC_PRICING} className="text-[#5F7069] hover:text-[#006736] transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link to={ROUTES.TEMPLATES} className="text-[#5F7069] hover:text-[#006736] transition-colors">
                  Template Library
                </Link>
              </li>
              <li>
                <Link to={ROUTES.AI_DASHBOARD} className="text-[#5F7069] hover:text-[#006736] transition-colors">
                  AI Agents
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Developers */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#14201C] text-sm uppercase tracking-wider">
              Developers
            </h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link to={ROUTES.DEVELOPERS_DOCS} className="text-[#5F7069] hover:text-[#006736] transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to={ROUTES.DEVELOPERS_API_KEYS} className="text-[#5F7069] hover:text-[#006736] transition-colors">
                  API Keys
                </Link>
              </li>
              <li>
                <Link to={ROUTES.DEVELOPERS_WEBHOOKS} className="text-[#5F7069] hover:text-[#006736] transition-colors">
                  Webhooks
                </Link>
              </li>
              <li>
                <Link to={ROUTES.DEVELOPERS_BACKEND_SETUP} className="text-[#5F7069] hover:text-[#006736] transition-colors">
                  Backend Setup
                </Link>
              </li>
              <li>
                <a 
                  href="#status" 
                  onClick={(e) => { e.preventDefault(); openLegalModal('security'); }} 
                  className="text-[#5F7069] hover:text-[#006736] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-[#05A222]"></span>
                  Status (99.99%)
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#14201C] text-sm uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link to={ROUTES.PUBLIC_ABOUT} className="text-[#5F7069] hover:text-[#006736] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PUBLIC_CONTACT} className="text-[#5F7069] hover:text-[#006736] transition-colors">
                  Contact Sales
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openLegalModal('privacy')}
                  className="text-[#5F7069] hover:text-[#006736] transition-colors cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openLegalModal('terms')}
                  className="text-[#5F7069] hover:text-[#006736] transition-colors cursor-pointer text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openLegalModal('security')}
                  className="text-[#5F7069] hover:text-[#006736] transition-colors cursor-pointer text-left flex items-center gap-1"
                >
                  <Lock className="w-3.5 h-3.5 text-[#05A222]" />
                  <span>Security</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM LINE: COPYRIGHT, VIBRANT SOCIAL MEDIA ICONS, AND LEGAL LINKS */}
        <div className="mt-10 pt-6 border-t border-[#E2EAE6] flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Left: Copyright */}
          <p className="text-xs text-[#8A9993] text-center sm:text-left">
            © {new Date().getFullYear()} <strong className="text-[#14201C] font-semibold">{APP_NAME}</strong>. Direct Meta Cloud API Integration. All rights reserved.
          </p>

          {/* Center: Vibrant Brand Colored Social Media Icons */}
          <div className="flex items-center gap-2.5">
            {SOCIAL_LINKS.map((item) => (
              <a
                key={`footer-bottom-${item.name}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`${item.name} (${item.handle})`}
                aria-label={`Follow WhatsAppMSG on ${item.name}`}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-xs cursor-pointer ${item.buttonClass}`}
              >
                <item.icon className="w-4.5 h-4.5" />
              </a>
            ))}
          </div>

          {/* Right: Quick Legal Links */}
          <div className="flex items-center gap-3 text-xs font-semibold text-[#5F7069]">
            <button
              type="button"
              onClick={() => openLegalModal('privacy')}
              className="hover:text-[#006736] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-[#BAC7C0]">•</span>
            <button
              type="button"
              onClick={() => openLegalModal('terms')}
              className="hover:text-[#006736] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span className="text-[#BAC7C0]">•</span>
            <button
              type="button"
              onClick={() => openLegalModal('security')}
              className="hover:text-[#006736] transition-colors cursor-pointer"
            >
              Security
            </button>
          </div>

        </div>
      </div>

      {/* INTERACTIVE LEGAL MODAL */}
      {legalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-[#D6E4DC] flex flex-col animate-scaleUp">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-[#E2EAE6] flex items-center justify-between bg-[#F8FBFA]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E9F9EE] text-[#006736] flex items-center justify-center">
                  {legalModalTab === 'privacy' && <FileText className="w-4 h-4" />}
                  {legalModalTab === 'terms' && <Check className="w-4 h-4" />}
                  {legalModalTab === 'security' && <Lock className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#14201C]">
                    {legalModalTab === 'privacy' && 'WhatsAppMSG Privacy Policy'}
                    {legalModalTab === 'terms' && 'Terms of Service'}
                    {legalModalTab === 'security' && 'Enterprise Security & Compliance'}
                  </h3>
                  <p className="text-xs text-[#5F7069]">Official compliance for WhatsApp Cloud API</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLegalModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-[#E2EAE6]/50 hover:bg-[#E2EAE6] text-[#5F7069] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-[#E2EAE6] px-6 bg-white gap-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLegalModalTab('privacy')}
                className={`py-3 border-b-2 transition-colors cursor-pointer ${
                  legalModalTab === 'privacy'
                    ? 'border-[#006736] text-[#006736]'
                    : 'border-transparent text-[#5F7069] hover:text-[#14201C]'
                }`}
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => setLegalModalTab('terms')}
                className={`py-3 border-b-2 transition-colors cursor-pointer ${
                  legalModalTab === 'terms'
                    ? 'border-[#006736] text-[#006736]'
                    : 'border-transparent text-[#5F7069] hover:text-[#14201C]'
                }`}
              >
                Terms of Service
              </button>
              <button
                type="button"
                onClick={() => setLegalModalTab('security')}
                className={`py-3 border-b-2 transition-colors cursor-pointer ${
                  legalModalTab === 'security'
                    ? 'border-[#006736] text-[#006736]'
                    : 'border-transparent text-[#5F7069] hover:text-[#14201C]'
                }`}
              >
                Security
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-sm text-[#4A5D54] leading-relaxed">
              {legalModalTab === 'privacy' && (
                <>
                  <p>
                    <strong>1. Commitment to Privacy:</strong> WhatsAppMSG operates with strict adherence to WhatsApp Business Cloud API guidelines and international data privacy regulations including GDPR and CCPA.
                  </p>
                  <p>
                    <strong>2. Data Encryption:</strong> All message payloads and credentials transmitted through WhatsAppMSG are encrypted in transit using TLS 1.3 encryption and stored securely.
                  </p>
                  <p>
                    <strong>3. Zero Data Resale:</strong> We never sell, rent, or monetize your contact lists, message content, or customer conversation logs.
                  </p>
                </>
              )}

              {legalModalTab === 'terms' && (
                <>
                  <p>
                    <strong>1. Acceptable Messaging Policy:</strong> Users of WhatsAppMSG must comply with Meta's official WhatsApp Business Messaging Policies. Unsolicited spam is strictly prohibited.
                  </p>
                  <p>
                    <strong>2. Customer Opt-In:</strong> Businesses using WhatsAppMSG must obtain affirmative opt-in consent from end users before delivering notifications.
                  </p>
                </>
              )}

              {legalModalTab === 'security' && (
                <>
                  <div className="p-3.5 rounded-2xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center gap-3 text-xs text-[#006736]">
                    <ShieldCheck className="w-5 h-5 text-[#05A222] shrink-0" />
                    <span><strong>Tier 3 Official Cloud Partner:</strong> Engineered for high-frequency transactional messaging with 99.99% uptime.</span>
                  </div>
                  <p>
                    <strong>1. Continuous Reliability:</strong> Redundant webhook delivery pipelines guarantee real-time delivery and status telemetry.
                  </p>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#E2EAE6] bg-[#F8FBFA] flex items-center justify-between">
              <span className="text-xs text-[#8A9993]">
                Last revised: {new Date().getFullYear()}
              </span>
              <button
                type="button"
                onClick={() => setLegalModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#006736] hover:bg-[#05A222] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </footer>
  );
};
