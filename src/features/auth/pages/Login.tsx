import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Check } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { ROUTES } from '../../../utils/constants';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('sarah.j@acmeglobal.com');
  const [password, setPassword] = useState('password123');
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
    } catch {
      setError('Invalid email or password. Please try again.');
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
      </div>

      {error && (
        <div className="p-3.5 bg-[#FDF2F2] border border-[#F8B4B4] rounded-2xl text-xs sm:text-sm text-[#D64545] font-medium text-center">
          {error}
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Email Field */}
        <div className="relative flex items-center">
          <div className="absolute left-4 text-[#739284] pointer-events-none flex items-center">
            <Mail className="w-5 h-5" />
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
          <div className="absolute left-4 text-[#739284] pointer-events-none flex items-center">
            <Lock className="w-5 h-5" />
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
            className="absolute right-4 text-[#739284] hover:text-[#14201C] transition-colors p-1"
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
    </div>
  );
};
