import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Key, ArrowRight, CheckCircle2, ArrowLeft, AlertCircle, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { authService } from '../../../services/authService';
import { ROUTES } from '../../../utils/constants';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [otpOrToken, setOtpOrToken] = useState(searchParams.get('token') || searchParams.get('otp') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const urlToken = searchParams.get('token');
    const urlOtp = searchParams.get('otp');
    const urlEmail = searchParams.get('email');
    if (urlToken) setOtpOrToken(urlToken);
    else if (urlOtp) setOtpOrToken(urlOtp);
    if (urlEmail) setEmail(urlEmail);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpOrToken.trim()) {
      setError('Please provide the 6-digit OTP code or reset token');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const isSixDigitOtp = /^\d{6}$/.test(otpOrToken.trim());
      if (isSixDigitOtp) {
        if (!email) {
          setError('Please enter your registered email address along with the 6-digit OTP');
          setIsLoading(false);
          return;
        }
        await authService.resetPassword({
          email: email.trim(),
          otp: otpOrToken.trim(),
          password,
        });
      } else {
        await authService.resetPassword(otpOrToken.trim(), password);
      }
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. OTP/Token may be invalid or expired.');
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
          <h2 className="text-2xl sm:text-[26px] font-black text-[#102319] tracking-tight font-display">
            Set New Password
          </h2>
          <p className="text-xs text-[#527063] mt-1">
            Choose a secure new password for your account.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-[#FDF2F2] border border-[#F8B4B4] rounded-2xl text-xs text-[#D64545] font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#D64545]" />
          <span>{error}</span>
        </div>
      )}

      {isSuccess ? (
        <div className="p-6 bg-[#E9F9EE] border border-[#C4EBD0] rounded-2xl space-y-4 text-center shadow-xs">
          <div className="w-14 h-14 rounded-full bg-white border border-[#C4EBD0] flex items-center justify-center mx-auto text-[#05A222] shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-[#14201C]">Password Updated!</h4>
            <p className="text-xs text-[#5F7069] max-w-xs mx-auto mt-1.5">
              Your password has been successfully reset. You can now log in with your new credentials.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="w-full bg-[#05A222] hover:bg-[#006736] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-[#05A222]/25 flex items-center justify-center gap-2 text-sm cursor-pointer transition-colors"
            >
              <span>Go to Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Registered Email (if not passed in URL) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#14201C] uppercase tracking-wider">Registered Email</label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#739284] pointer-events-none flex items-center">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full rounded-2xl border border-[#d6e5dd] bg-[#fafcfb] focus:bg-white text-[#14201C] text-sm pl-10 pr-4 py-3.5 transition-all placeholder:text-[#8ea49a] focus:outline-none focus:border-[#05A222] focus:ring-4 focus:ring-[#05A222]/15 shadow-2xs font-medium"
              />
            </div>
          </div>

          {/* OTP or Token */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#14201C] uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#05A222]" />
              <span>6-Digit OTP or Reset Token</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#739284] pointer-events-none flex items-center">
                <Key className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={otpOrToken}
                onChange={(e) => setOtpOrToken(e.target.value)}
                placeholder="Enter 6-digit OTP code"
                required
                className="w-full rounded-2xl border border-[#d6e5dd] bg-[#fafcfb] focus:bg-white text-[#14201C] text-sm pl-10 pr-4 py-3.5 transition-all placeholder:text-[#8ea49a] focus:outline-none focus:border-[#05A222] focus:ring-4 focus:ring-[#05A222]/15 shadow-2xs font-mono font-medium"
              />
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#14201C] uppercase tracking-wider">New Password</label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#739284] pointer-events-none flex items-center">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password (min. 6 characters)"
                required
                className="w-full rounded-2xl border border-[#d6e5dd] bg-[#fafcfb] focus:bg-white text-[#14201C] text-sm pl-10 pr-11 py-3.5 transition-all placeholder:text-[#8ea49a] focus:outline-none focus:border-[#05A222] focus:ring-4 focus:ring-[#05A222]/15 shadow-2xs font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-[#739284] hover:text-[#14201C] p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#14201C] uppercase tracking-wider">Confirm Password</label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#739284] pointer-events-none flex items-center">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                className="w-full rounded-2xl border border-[#d6e5dd] bg-[#fafcfb] focus:bg-white text-[#14201C] text-sm pl-10 pr-11 py-3.5 transition-all placeholder:text-[#8ea49a] focus:outline-none focus:border-[#05A222] focus:ring-4 focus:ring-[#05A222]/15 shadow-2xs font-medium"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 text-[#739284] hover:text-[#14201C] p-1 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#00a859] via-[#05b84c] to-[#00b050] hover:from-[#00964e] hover:to-[#04a042] text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-[#05A222]/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Update Password</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center gap-1.5 text-xs text-[#527063] hover:text-[#05A222] transition-colors font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Cancel and back to login</span>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};
