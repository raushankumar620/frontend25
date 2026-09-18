import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User as UserIcon, Mail, Lock, Building, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { ROUTES } from '../../../utils/constants';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const parts = name.trim().split(' ');
      const firstName = parts[0] || 'Admin';
      const lastName = parts.slice(1).join(' ') || '';

      await register({
        email,
        password,
        firstName,
        lastName,
        name,
        organizationName: company || `${firstName}'s Organization`,
      });

      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Card Logo */}
      <div className="flex flex-col items-center justify-center space-y-2">
        <img
          src="/images/logo.png"
          alt="WhatsAppMsg"
          className="h-10 sm:h-12 w-auto object-contain drop-shadow-sm"
        />
        <div className="text-center pt-1">
          <h2 className="text-2xl sm:text-[28px] font-black tracking-tight bg-gradient-to-r from-[#102319] via-[#05A222] to-[#008744] bg-clip-text text-transparent font-display">
            Create Business Account
          </h2>
          <p className="text-xs sm:text-sm text-[#527063] mt-1 font-medium">
            Get started with Meta Cloud API &amp; WhatsApp automation in minutes.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-[#FDF2F2] border border-[#F8B4B4] rounded-2xl text-xs text-[#D64545] font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#D64545]" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-[#2563EB] pointer-events-none flex items-center">
            <UserIcon className="w-4.5 h-4.5 text-[#2563EB]" />
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name (e.g. Rahul Sharma)"
            required
            className="w-full rounded-2xl border border-[#d6e5dd] bg-[#fafcfb] focus:bg-white text-[#14201C] text-sm pl-11 pr-4 py-3.5 transition-all placeholder:text-[#8ea49a] focus:outline-none focus:border-[#05A222] focus:ring-4 focus:ring-[#05A222]/15 shadow-2xs font-medium"
          />
        </div>

        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-[#0284C7] pointer-events-none flex items-center">
            <Mail className="w-4.5 h-4.5 text-[#0284C7]" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Work Email (e.g. owner@mybusiness.com)"
            required
            className="w-full rounded-2xl border border-[#d6e5dd] bg-[#fafcfb] focus:bg-white text-[#14201C] text-sm pl-11 pr-4 py-3.5 transition-all placeholder:text-[#8ea49a] focus:outline-none focus:border-[#05A222] focus:ring-4 focus:ring-[#05A222]/15 shadow-2xs font-medium"
          />
        </div>

        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-[#7C3AED] pointer-events-none flex items-center">
            <Building className="w-4.5 h-4.5 text-[#7C3AED]" />
          </div>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Organization / Company Name"
            className="w-full rounded-2xl border border-[#d6e5dd] bg-[#fafcfb] focus:bg-white text-[#14201C] text-sm pl-11 pr-4 py-3.5 transition-all placeholder:text-[#8ea49a] focus:outline-none focus:border-[#05A222] focus:ring-4 focus:ring-[#05A222]/15 shadow-2xs font-medium"
          />
        </div>

        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-[#05A222] pointer-events-none flex items-center">
            <Lock className="w-4.5 h-4.5 text-[#05A222]" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (minimum 6 characters)"
            required
            className="w-full rounded-2xl border border-[#d6e5dd] bg-[#fafcfb] focus:bg-white text-[#14201C] text-sm pl-11 pr-11 py-3.5 transition-all placeholder:text-[#8ea49a] focus:outline-none focus:border-[#05A222] focus:ring-4 focus:ring-[#05A222]/15 shadow-2xs font-medium"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-[#739284] hover:text-[#14201C] transition-colors p-1 cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 bg-gradient-to-r from-[#00a859] via-[#05b84c] to-[#00b050] hover:from-[#00964e] hover:to-[#04a042] text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-[#05A222]/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Start Free Trial</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-[#527063]">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-[#05A222] font-bold hover:underline ml-1">
          Log In
        </Link>
      </div>
    </div>
  );
};
