import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { MessageSquare, Users, BarChart3, Zap } from 'lucide-react';
import { APP_NAME } from '../utils/constants';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full relative bg-gradient-to-br from-[#f2fbf6] via-[#e6f8ed] to-[#d4f3e0] flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16 overflow-x-hidden font-sans text-[#14201C]">

      {/* Background Decorative SVG Waves & Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top-Right Organic Green Wave */}
        <svg
          className="absolute -top-28 -right-28 w-[700px] h-[700px] xl:w-[950px] xl:h-[950px] text-[#22c55e]/25 opacity-75"
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M300 0C465.685 0 600 134.315 600 300C450 320 380 200 240 280C120 350 180 500 0 500C0 223.858 134.315 0 300 0Z"
            fill="url(#greenWaveGrad1)"
          />
          <defs>
            <linearGradient id="greenWaveGrad1" x1="0" y1="0" x2="600" y2="600" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4ade80" stopOpacity="0.4" />
              <stop offset="0.5" stopColor="#22c55e" stopOpacity="0.25" />
              <stop offset="1" stopColor="#15803d" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>

        {/* Bottom-Left Organic Green Wave */}
        <svg
          className="absolute -bottom-28 -left-28 w-[650px] h-[650px] xl:w-[850px] xl:h-[850px] text-[#16a34a]/20 opacity-80"
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 600C165.685 600 320 520 380 380C440 240 280 180 320 60C140 100 0 240 0 600Z"
            fill="url(#greenWaveGrad2)"
          />
          <defs>
            <linearGradient id="greenWaveGrad2" x1="0" y1="600" x2="600" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="0.7" stopColor="#22c55e" stopOpacity="0.15" />
              <stop offset="1" stopColor="#86efac" stopOpacity="0.02" />
            </linearGradient>
          </defs>
        </svg>

        {/* Ambient Radial Soft Glows */}
        <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] bg-[#22c55e]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-[#10b981]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Dot Matrix Patterns */}
        <div className="absolute top-10 right-1/4 hidden xl:grid grid-cols-6 gap-3 opacity-30">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#15803d]" />
          ))}
        </div>
      </div>

      {/* Main Full-Width 2-Part Grid Container */}
      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-20 items-center my-auto">

        {/* LEFT PART: Clean Centered Floating Form Card */}
        <div className="lg:col-span-6 xl:col-span-6 flex items-center justify-center relative py-6 order-1">
          <div className="w-full max-w-[440px] sm:max-w-[470px] xl:max-w-[500px] bg-white rounded-[36px] sm:rounded-[42px] p-8 sm:p-10 shadow-[0_30px_70px_-15px_rgba(5,150,105,0.18)] border border-[#e2efe8] mx-auto">
            <Outlet />
          </div>
        </div>

        {/* RIGHT PART: Large Text & Features Showcase Section */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-between space-y-8 lg:space-y-9 max-w-xl lg:max-w-none lg:pl-4 xl:pl-8 order-2">

          {/* Top Logo */}
          <div className="flex items-center">
            <Link to="/" className="inline-flex items-center group">
              <img
                src="/images/logo.png"
                alt={APP_NAME}
                className="h-10 sm:h-12 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-200"
              />
            </Link>
          </div>

          {/* Large Headline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black text-[#0f241a] tracking-tight font-display leading-tight">
              Connect, Convert,{' '}
              <span className="bg-gradient-to-r from-[#00a859] via-[#05b84c] to-[#1cd72c] bg-clip-text text-transparent drop-shadow-xs">
                Grow
              </span>
              , Together
            </h1>
            <p className="text-base sm:text-lg xl:text-xl text-[#486657] font-medium max-w-xl leading-relaxed">
              Powerful WhatsApp Marketing for Modern Businesses
            </p>
          </div>

          {/* Feature Highlight Pills - 1 Card Per Row Vertical Stack */}
          <div className="flex flex-col space-y-3.5 max-w-lg">
            {/* Feature 1 */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#d6ebd9]/80 shadow-xs hover:bg-white hover:shadow-md transition-all group">
              <div className="w-11 h-11 rounded-xl bg-[#dcfce7] text-[#059669] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <MessageSquare className="w-5 h-5 fill-[#059669]/20" />
              </div>
              <div className="min-w-0">
                <h4 className="text-base font-bold text-[#11241a] leading-tight">Send Bulk Messages</h4>
                <p className="text-xs sm:text-sm text-[#557566] truncate mt-0.5">Reach more customers</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#d6ebd9]/80 shadow-xs hover:bg-white hover:shadow-md transition-all group">
              <div className="w-11 h-11 rounded-xl bg-[#dcfce7] text-[#059669] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5 fill-[#059669]/20" />
              </div>
              <div className="min-w-0">
                <h4 className="text-base font-bold text-[#11241a] leading-tight">Manage Contacts</h4>
                <p className="text-xs sm:text-sm text-[#557566] truncate mt-0.5">Organize and segment</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#d6ebd9]/80 shadow-xs hover:bg-white hover:shadow-md transition-all group">
              <div className="w-11 h-11 rounded-xl bg-[#dcfce7] text-[#059669] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-base font-bold text-[#11241a] leading-tight">Track Performance</h4>
                <p className="text-xs sm:text-sm text-[#557566] truncate mt-0.5">Get real insights</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#d6ebd9]/80 shadow-xs hover:bg-white hover:shadow-md transition-all group">
              <div className="w-11 h-11 rounded-xl bg-[#dcfce7] text-[#059669] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 fill-[#059669]/20" />
              </div>
              <div className="min-w-0">
                <h4 className="text-base font-bold text-[#11241a] leading-tight">Automate Workflows</h4>
                <p className="text-xs sm:text-sm text-[#557566] truncate mt-0.5">Save time, grow faster</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Subtle Copyright Footer at Bottom */}
      <div className="relative z-10 text-center text-xs text-[#6a877a] py-2">
        © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </div>
    </div>
  );
};
