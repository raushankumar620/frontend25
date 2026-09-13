import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Globe, Share2, Sparkles } from 'lucide-react';
import { ROUTES, APP_NAME } from '../../../utils/constants';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-[#F6FAF8] border-t border-[#E2EAE6] text-[#5F7069] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column - Clean Logo */}
          <div className="col-span-2 space-y-4">
            <Link to={ROUTES.HOME} className="flex items-center">
              <img
                src="/images/logo.png"
                alt={APP_NAME}
                className="h-10 sm:h-11 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-[#5F7069] max-w-sm leading-relaxed">
              The premier WhatsApp Business Cloud API & Generative AI platform for scaling customer marketing, automated support, and enterprise sales.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#006736] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#05A222]" />
              <span>Official Meta Business Solution Partner</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#14201C] text-xs uppercase tracking-wider">Product</h4>
            <ul className="space-y-2">
              <li><Link to={ROUTES.PUBLIC_FEATURES} className="hover:text-[#006736] transition-colors">Features</Link></li>
              <li><Link to={ROUTES.PUBLIC_SOLUTIONS} className="hover:text-[#006736] transition-colors">Solutions</Link></li>
              <li><Link to={ROUTES.PUBLIC_PRICING} className="hover:text-[#006736] transition-colors">Pricing Plans</Link></li>
              <li><Link to={ROUTES.TEMPLATES} className="hover:text-[#006736] transition-colors">Template Library</Link></li>
              <li><Link to={ROUTES.AI_DASHBOARD} className="hover:text-[#006736] transition-colors">AI Agents</Link></li>
            </ul>
          </div>

          {/* Developers Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#14201C] text-xs uppercase tracking-wider">Developers</h4>
            <ul className="space-y-2">
              <li><Link to={ROUTES.DEVELOPERS_DOCS} className="hover:text-[#006736] transition-colors">Documentation</Link></li>
              <li><Link to={ROUTES.DEVELOPERS_API_KEYS} className="hover:text-[#006736] transition-colors">API Keys</Link></li>
              <li><Link to={ROUTES.DEVELOPERS_WEBHOOKS} className="hover:text-[#006736] transition-colors">Webhooks</Link></li>
              <li><a href="#" className="hover:text-[#006736] transition-colors">Status (99.99%)</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#14201C] text-xs uppercase tracking-wider">Company</h4>
            <ul className="space-y-2">
              <li><Link to={ROUTES.PUBLIC_ABOUT} className="hover:text-[#006736] transition-colors">About Us</Link></li>
              <li><Link to={ROUTES.PUBLIC_CONTACT} className="hover:text-[#006736] transition-colors">Contact Sales</Link></li>
              <li><a href="#" className="hover:text-[#006736] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#006736] transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#E2EAE6] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[#8A9993]">
            © {new Date().getFullYear()} {APP_NAME}. Direct Meta Cloud API Integration. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-[#8A9993]">
            <a href="#" aria-label="Global" className="hover:text-[#006736] transition-colors"><Globe className="w-4 h-4" /></a>
            <a href="#" aria-label="Network" className="hover:text-[#006736] transition-colors"><Share2 className="w-4 h-4" /></a>
            <a href="#" aria-label="Innovations" className="hover:text-[#006736] transition-colors"><Sparkles className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};
