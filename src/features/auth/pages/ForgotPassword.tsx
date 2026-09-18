import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, ArrowRight, AlertCircle, Lock, Eye, EyeOff, RotateCw, ShieldCheck } from 'lucide-react';
import { authService } from '../../../services/authService';
import { ROUTES } from '../../../utils/constants';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  
  // Steps: 'EMAIL' -> 'OTP_AND_RESET' -> 'SUCCESS'
  const [step, setStep] = useState<'EMAIL' | 'OTP_AND_RESET' | 'SUCCESS'>('EMAIL');
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Step 1: Send OTP to Email
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid registered email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.forgotPassword(email);
      setStep('OTP_AND_RESET');
      setResendCooldown(60);
      // Auto-focus the first OTP input
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 150);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    setError('');

    try {
      await authService.forgotPassword(email);
      setResendCooldown(60);
      setOtp(['', '', '', '', '', '']);
      otpInputsRef.current[0]?.focus();
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP code.');
    } finally {
      setResending(false);
    }
  };

  // Handle OTP individual box change
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    // Handle paste of 6 digits
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasted[i] || '';
      }
      setOtp(newOtp);
      const nextIndex = Math.min(pasted.length, 5);
      otpInputsRef.current[nextIndex]?.focus();
      return;
    }

    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto move to next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Step 2: Submit OTP & Set New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('').trim();

    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit OTP code sent to your email');
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

    setIsLoading(true);
    setError('');

    try {
      await authService.resetPassword({
        email: email.trim(),
        otp: otpCode,
        password,
      });
      setStep('SUCCESS');
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP code. Please try again or request a new OTP.');
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
            {step === 'SUCCESS'
              ? 'Password Reset Complete'
              : step === 'OTP_AND_RESET'
              ? 'Enter OTP & Reset Password'
              : 'Forgot Password?'}
          </h2>
          <p className="text-xs text-[#527063] mt-1">
            {step === 'SUCCESS'
              ? 'You can now log in securely with your new password.'
              : step === 'OTP_AND_RESET'
              ? `We sent a 6-digit code to ${email}`
              : 'Enter your registered email to receive a password reset OTP.'}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-[#FDF2F2] border border-[#F8B4B4] rounded-2xl text-xs text-[#D64545] font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#D64545]" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Enter Email */}
      {step === 'EMAIL' && (
        <form onSubmit={handleSendOtp} className="space-y-4">
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#00a859] via-[#05b84c] to-[#00b050] hover:from-[#00964e] hover:to-[#04a042] text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-[#05A222]/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Send Verification OTP</span>
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
              <span>Back to login</span>
            </Link>
          </div>
        </form>
      )}

      {/* STEP 2: OTP + New Password */}
      {step === 'OTP_AND_RESET' && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          {/* Email badge with edit option */}
          <div className="flex items-center justify-between p-2.5 bg-[#f0f7f3] border border-[#d2e8dc] rounded-xl text-xs text-[#14201C]">
            <span className="truncate font-semibold text-[#006736]">{email}</span>
            <button
              type="button"
              onClick={() => {
                setStep('EMAIL');
                setError('');
              }}
              className="text-[#05A222] hover:text-[#006736] font-bold text-[11px] underline ml-2 shrink-0 cursor-pointer"
            >
              Change Email
            </button>
          </div>

          {/* 6-Digit OTP Code Inputs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#14201C] uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#05A222]" />
                <span>Enter 6-Digit OTP</span>
              </label>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || resending}
                className="text-[11px] font-semibold text-[#05A222] hover:text-[#006736] disabled:text-[#8ea49a] transition-colors cursor-pointer flex items-center gap-1"
              >
                {resending && <RotateCw className="w-3 h-3 animate-spin" />}
                <span>
                  {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend OTP'}
                </span>
              </button>
            </div>

            <div className="flex justify-between gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { otpInputsRef.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-11 h-12 sm:w-12 sm:h-13 text-center text-xl font-bold font-mono text-[#14201C] rounded-xl border border-[#d6e5dd] bg-[#fafcfb] focus:bg-white focus:outline-none focus:border-[#05A222] focus:ring-3 focus:ring-[#05A222]/20 transition-all shadow-2xs"
                />
              ))}
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
                placeholder="At least 6 characters"
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
                placeholder="Re-enter new password"
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
                <span>Reset & Set New Password</span>
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

      {/* STEP 3: SUCCESS */}
      {step === 'SUCCESS' && (
        <div className="p-6 bg-[#E9F9EE] border border-[#C4EBD0] rounded-2xl space-y-4 text-center shadow-xs">
          <div className="w-14 h-14 rounded-full bg-white border border-[#C4EBD0] flex items-center justify-center mx-auto text-[#05A222] shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-[#14201C]">Password Changed Successfully!</h4>
            <p className="text-xs text-[#5F7069] max-w-xs mx-auto mt-1.5">
              Your account password has been updated. You can now log in with your new credentials.
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
      )}
    </div>
  );
};
