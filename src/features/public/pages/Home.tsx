import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { LogoCloud } from '../components/LogoCloud';
import { FeaturesSection } from '../components/FeaturesSection';
import { WhatsAppAPISection } from '../components/WhatsAppAPISection';
import { AISection } from '../components/AISection';
import { AutomationSection } from '../components/AutomationSection';
import { InboxSection } from '../components/InboxSection';
import { AnalyticsSection } from '../components/AnalyticsSection';
import { PricingSection } from '../components/PricingSection';
import { CTASection } from '../components/CTASection';

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col bg-white text-slate-900">
      <HeroSection />
      <LogoCloud />
      <FeaturesSection />
      <WhatsAppAPISection />
      <AISection />
      <AutomationSection />
      <InboxSection />
      <AnalyticsSection />
      <PricingSection />
      <CTASection />
    </div>
  );
};
