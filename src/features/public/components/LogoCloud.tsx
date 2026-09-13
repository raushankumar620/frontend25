import React from 'react';

export const LogoCloud: React.FC = () => {
  const brands = [
    'FinTech Global',
    'ShopPulse D2C',
    'CarePlus Health',
    'PropTech Realty',
    'EduStream Academy',
    'LogiTrans Logistics',
  ];

  return (
    <section className="py-10 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
          Trusted by 4,500+ fast-growing enterprises worldwide
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all">
          {brands.map((brand, idx) => (
            <div
              key={idx}
              className="font-extrabold text-sm sm:text-base text-slate-600 hover:text-emerald-700 tracking-tight transition-colors cursor-default"
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
