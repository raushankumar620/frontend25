import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Key, ArrowRight, CheckCircle2, ArrowLeft, AlertCircle } from 'lucide-react';
import { authService } from '../../../services/authService';
import { ROUTES } from '../../../utils/constants';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Please provide the reset token');
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
      await authService.resetPassword(token, password);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Token may be invalid or expired.');
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
          <div className="w-12 h-12 rounded-full bg-white border border-[#C4EBD0] flex items-center justify-center mx-auto text-[#05A222]">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-base font-bold text-[#14201C]">Password Updated!</h4>
            <p className="text-xs text-[#5F7069] max-w-xs mx-auto mt-1">
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
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-[#739284] pointer-events-none flex items-center">
              <Key className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste Reset Token"
              required
              className="w-full rounded-2xl border border-[#d6e5dd] bg-[#fafcfb] focus:bg-white text-[#14201C] text-sm pl-10 pr-4 py-3.5 transition-all placeholder:text-[#8ea49a] focus:outline-none focus:border-[#05A222] focus:ring-4 focus:ring-[#05A222]/15 shadow-2xs font-mono text-xs font-medium"
            />
          </div>

          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-[#739284] pointer-events-none flex items-center">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password (min. 6 characters)"
              required
              className="w-full rounded-2xl border border-[#d6e5dd] bg-[#fafcfb] focus:bg-white text-[#14201C] text-sm pl-10 pr-4 py-3.5 transition-all placeholder:text-[#8ea49a] focus:outline-none focus:border-[#05A222] focus:ring-4 focus:ring-[#05A222]/15 shadow-2xs font-medium"
            />
          </div>

          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-[#739284] pointer-events-none flex items-center">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
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
