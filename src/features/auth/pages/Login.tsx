import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { ROUTES } from '../../../utils/constants';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }
    try {
      setIsLoading(true);
      setError('');
      await login(email, password);
      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Card Header Logo */}
      <div className="flex flex-col items-center justify-center pt-1 pb-2">
        <img
          src="/images/logo.png"
          alt="WhatsAppMsg"
          className="h-10 sm:h-12 w-auto object-contain drop-shadow-sm"
        />
        <div className="text-center pt-2">
          <h2 className="text-2xl font-black text-[#14201C] tracking-tight">Welcome Back</h2>
          <p className="text-xs text-[#5F7069] mt-1">Log in to manage your WhatsApp Business automation.</p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-[#FDF2F2] border border-[#F8B4B4] rounded-2xl text-xs sm:text-sm text-[#D64545] font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#D64545]" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Email Field */}
        <div className="relative flex items-center">
          <div className="absolute left-4 text-[#0284C7] pointer-events-none flex items-center">
            <Mail className="w-5 h-5 text-[#0284C7]" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full rounded-2xl border border-[#d6e5dd] bg-[#fafcfb] focus:bg-white text-[#14201C] text-sm sm:text-base pl-12 pr-4 py-4 transition-all placeholder:text-[#8ea49a] focus:outline-none focus:border-[#05A222] focus:ring-4 focus:ring-[#05A222]/15 shadow-2xs font-medium"
          />
        </div>

        {/* Password Field */}
        <div className="relative flex items-center">
          <div className="absolute left-4 text-[#05A222] pointer-events-none flex items-center">
            <Lock className="w-5 h-5 text-[#05A222]" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full rounded-2xl border border-[#d6e5dd] bg-[#fafcfb] focus:bg-white text-[#14201C] text-sm sm:text-base pl-12 pr-12 py-4 transition-all placeholder:text-[#8ea49a] focus:outline-none focus:border-[#05A222] focus:ring-4 focus:ring-[#05A222]/15 shadow-2xs font-medium"
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 bg-gradient-to-r from-[#00a859] via-[#05b84c] to-[#00b050] hover:from-[#00964e] hover:to-[#04a042] text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-[#05A222]/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 text-base sm:text-lg cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Log In</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </>
          )}
        </button>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-1.5 px-1">
          <label
            onClick={() => setRememberMe(!rememberMe)}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                rememberMe
                  ? 'bg-[#05A222] border-[#05A222] text-white shadow-xs'
                  : 'border-[#bcd0c5] bg-white group-hover:border-[#05A222]'
              }`}
            >
              {rememberMe && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <span className="text-xs sm:text-sm text-[#4d6b5c] font-medium group-hover:text-[#102319]">
              Remember me
            </span>
          </label>

          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-xs sm:text-sm text-[#05A222] hover:text-[#006736] font-bold hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </form>

      {/* Footer Sign Up Link */}
      <div className="text-center text-xs sm:text-sm text-[#527063] pt-2">
        Don&apos;t have an account?{' '}
        <Link to={ROUTES.REGISTER} className="text-[#05A222] font-bold hover:underline ml-1">
          Sign up
        </Link>
      </div>

      {/* Security Clarification (Prevents automated phishing flags) */}
      <div className="pt-3 border-t border-[#E8EFEA] text-center">
        <p className="text-[10px] text-[#788E83] leading-relaxed">
          Log in with your WhatsAppMSG SaaS Dashboard account credentials. Not affiliated with WhatsApp LLC or Meta Platforms, Inc.
        </p>
      </div>
    </div>
  );
};
