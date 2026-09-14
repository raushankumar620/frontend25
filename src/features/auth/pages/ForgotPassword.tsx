import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, ArrowRight, AlertCircle, Key } from 'lucide-react';
import { authService } from '../../../services/authService';
import { ROUTES } from '../../../utils/constants';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError('');

    try {
      const res = await authService.forgotPassword(email);
      if (res.resetToken) {
        setResetToken(res.resetToken);
      }
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset instructions');
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
            Forgot Password?
          </h2>
          <p className="text-xs text-[#527063] mt-1">
            Enter your email and we&apos;ll generate recovery instructions.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-[#FDF2F2] border border-[#F8B4B4] rounded-2xl text-xs text-[#D64545] font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#D64545]" />
          <span>{error}</span>
        </div>
      )}

      {submitted ? (
        <div className="p-6 bg-[#E9F9EE] border border-[#C4EBD0] rounded-2xl space-y-4 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-white border border-[#C4EBD0] flex items-center justify-center mx-auto text-[#05A222]">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-base font-bold text-[#14201C]">Password Reset Token Ready</h4>
            <p className="text-xs text-[#5F7069] max-w-xs mx-auto mt-1">
              Instructions generated for <span className="font-semibold text-[#14201C]">{email}</span>.
            </p>
          </div>

          {resetToken && (
            <div className="p-3 bg-white rounded-xl border border-[#C4EBD0] text-left">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#006736] mb-1">
                <Key className="w-3.5 h-3.5" />
                <span>Your Reset Token:</span>
              </div>
              <p className="text-[11px] font-mono text-[#14201C] break-all bg-[#F6FAF8] p-2 rounded-lg border border-[#E2EAE6]">
                {resetToken}
              </p>
            </div>
          )}

          <div className="pt-2 flex flex-col gap-2">
            {resetToken ? (
              <Link
                to={`${ROUTES.RESET_PASSWORD}?token=${resetToken}`}
                className="w-full bg-[#05A222] hover:bg-[#006736] text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Proceed to Set New Password</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to={ROUTES.RESET_PASSWORD}
                className="w-full bg-[#05A222] hover:bg-[#006736] text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Enter Reset Token</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            <Link to={ROUTES.LOGIN} className="text-xs text-[#5F7069] hover:text-[#14201C] font-semibold py-1">
              Return to login
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-[#739284] pointer-events-none flex items-center">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              required
              className="w-full rounded-2xl border border-[#d6e5dd] bg-[#fafcfb] focus:bg-white text-[#14201C] text-sm pl-10 pr-4 py-3.5 transition-all placeholder:text-[#8ea49a] focus:outline-none focus:border-[#05A222] focus:ring-4 focus:ring-[#05A222]/15 shadow-2xs font-medium"
            />
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
                <span>Generate Reset Token</span>
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
    </div>
  );
};
