import React from 'react';
import {
  Landmark,
  ShoppingBag,
  HeartPulse,
  Building2,
  GraduationCap,
  Truck,
  Cpu,
  Zap,
  Globe2,
  ShieldCheck,
  Rocket,
  Layers
} from 'lucide-react';

interface BrandItem {
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const LogoCloud: React.FC = () => {
  const brands: BrandItem[] = [
    { name: 'FinTech Global', category: 'Banking & Payments', icon: Landmark },
    { name: 'ShopPulse D2C', category: 'E-Commerce Brands', icon: ShoppingBag },
    { name: 'CarePlus Health', category: 'Healthcare Systems', icon: HeartPulse },
    { name: 'PropTech Realty', category: 'Real Estate & Living', icon: Building2 },
    { name: 'EduStream Academy', category: 'EdTech & Learning', icon: GraduationCap },
    { name: 'LogiTrans Logistics', category: 'Supply Chain & Freight', icon: Truck },
    { name: 'CloudScale AI', category: 'Enterprise SaaS', icon: Cpu },
    { name: 'SwiftPay Direct', category: 'Instant Checkout', icon: Zap },
    { name: 'OmniChannel Pro', category: 'Retail Distribution', icon: Globe2 },
    { name: 'MedVantage Care', category: 'Telemedicine Network', icon: ShieldCheck },
    { name: 'NovaCommerce', category: 'Global Marketplace', icon: Rocket },
    { name: 'Apex Mobility', category: 'Smart Fleet Logistics', icon: Layers },
  ];

  // Duplicate for seamless infinite marquee loop
  const marqueeList = [...brands, ...brands];

  return (
    <section className="py-8 sm:py-10 bg-white border-b border-[#E2EAE6] overflow-hidden relative select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5 sm:mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9F9EE] border border-[#C4EBD0] text-[#006736] text-[11px] font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#05A222] animate-ping" />
          Enterprise Trust
        </div>
        <p className="mt-2 text-xs sm:text-sm font-semibold text-[#5F7069] tracking-normal">
          Powering conversations for <span className="text-[#14201C] font-bold">4,500+ fast-growing enterprises</span> and scale-ups worldwide
        </p>
      </div>

      {/* Marquee Wrapper with Smooth Gradient Masks on Left & Right */}
      <div className="relative w-full overflow-hidden">
        {/* Left gradient fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-linear-to-r from-white via-white/80 to-transparent z-10" />

        {/* Right gradient fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-linear-to-l from-white via-white/80 to-transparent z-10" />

        {/* Continuous Scrolling Marquee Row */}
        <div className="animate-marquee py-2 flex items-center gap-4 sm:gap-6">
          {marqueeList.map((brand, idx) => {
            const Icon = brand.icon;
            return (
              <div
                key={`${brand.name}-${idx}`}
                className="group shrink-0 flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-[#F6FAF8] border border-[#E2EAE6] hover:border-[#05A222]/40 hover:bg-white hover:shadow-md hover:shadow-[#05A222]/5 transition-all duration-300 cursor-default"
              >
                <div className="w-8 h-8 rounded-xl bg-white border border-[#E2EAE6] group-hover:bg-[#E9F9EE] group-hover:border-[#C4EBD0] flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4 text-[#5F7069] group-hover:text-[#05A222] transition-colors" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-xs sm:text-sm text-[#14201C] group-hover:text-[#006736] tracking-tight transition-colors whitespace-nowrap">
                    {brand.name}
                  </div>
                  <div className="text-[10px] text-[#8A9993] font-medium whitespace-nowrap">
                    {brand.category}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
