import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Smartphone,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { ROUTES } from '../../../utils/constants';

export const SuperAdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { adminLogin } = useAuthStore();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please enter your admin mobile number or email and password.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const user = await adminLogin(identifier, password);

      if (user.role === 'SUPER_ADMIN') {
        navigate(ROUTES.SUPER_ADMIN_DASHBOARD);
      } else {
        navigate(ROUTES.DASHBOARD);
      }
    } catch (err: any) {
      setError(err.message || 'Access Denied: Invalid Super Admin credentials or insufficient privileges.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6FAF8] text-[#1F2A26] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans selection:bg-[#05A222] selection:text-white">
      {/* Brand Aesthetic Glow Accents */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#05A222]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[#006736]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white border border-[#E2EAE6] shadow-xl shadow-[#013B23]/5 rounded-3xl p-8 sm:p-10 transition-all">
          {/* Header Brand */}
          <div className="flex flex-col items-center text-center mb-7">
            <img
              src="/images/logo.png"
              alt="WhatsAppMSG"
              className="h-10 sm:h-12 w-auto object-contain drop-shadow-sm mb-3"
            />

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9F9EE] border border-[#C4EBD0] text-[#006736] text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#05A222]" /> Master Control Center
            </div>

            <h1 className="text-2xl font-black tracking-tight text-[#14201C]">
              Super Admin Portal
            </h1>
            <p className="text-xs sm:text-sm text-[#5F7069] mt-1">
              Elevated access for platform infrastructure & tenant governance
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3.5 bg-[#FDF2F2] border border-[#F8B4B4] rounded-2xl text-xs sm:text-sm text-[#D64545] font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#D64545] mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Phone or Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#14201C] uppercase tracking-wider pl-1">
                Admin Mobile No or Email
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#739284] pointer-events-none flex items-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter admin mobile or email"
                  required
                  autoComplete="username"
                  className="w-full rounded-2xl border border-[#E2EAE6] bg-[#fafcfb] focus:bg-white text-[#14201C] text-sm sm:text-base pl-12 pr-4 py-3.5 transition-all placeholder:text-[#8ea49a] focus:outline-none focus:border-[#05A222] focus:ring-4 focus:ring-[#05A222]/15 shadow-2xs font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#14201C] uppercase tracking-wider pl-1">
                Admin Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#739284] pointer-events-none flex items-center">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-[#E2EAE6] bg-[#fafcfb] focus:bg-white text-[#14201C] text-sm sm:text-base pl-12 pr-12 py-3.5 transition-all placeholder:text-[#8ea49a] focus:outline-none focus:border-[#05A222] focus:ring-4 focus:ring-[#05A222]/15 shadow-2xs font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-[#739284] hover:text-[#14201C] transition-colors p-1 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-gradient-to-r from-[#00a859] via-[#05A222] to-[#006736] hover:from-[#00964e] hover:to-[#005a2f] text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-[#05A222]/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 text-base cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Authenticate & Enter HQ</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Footer Back link */}
          <div className="mt-8 pt-6 border-t border-[#E2EAE6] flex items-center justify-between text-xs text-[#5F7069]">
            <span>Customer account?</span>
            <Link
              to={ROUTES.LOGIN}
              className="text-[#05A222] font-bold hover:underline flex items-center gap-1 hover:text-[#006736] transition-colors"
            >
              Standard Client Login &rarr;
            </Link>
          </div>
        </div>

        {/* Bottom Sub-text */}
        <p className="text-center text-[11px] text-[#8A9993] mt-4 font-mono">
          WhatsAppMSG Platform Core v2.4 • Zero-Trust Perimeter Active
        </p>
      </div>
    </div>
  );
};
