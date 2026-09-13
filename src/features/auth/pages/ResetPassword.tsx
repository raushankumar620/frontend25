import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { ROUTES } from '../../../utils/constants';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Set new password</h2>
        <p className="text-xs text-slate-400 mt-1">
          Must be at least 8 characters with numbers and special symbols.
        </p>
      </div>

      {isSuccess ? (
        <div className="p-5 bg-emerald-950/40 border border-emerald-800 rounded-xl space-y-3 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <h4 className="text-sm font-semibold text-white">Password reset complete</h4>
          <p className="text-xs text-slate-300">
            Your password has been securely updated. You can now login with your new credentials.
          </p>
          <Button
            className="w-full mt-3"
            size="md"
            onClick={() => navigate(ROUTES.LOGIN)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Go to Login
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
            Update Password
          </Button>

          <div className="text-center text-xs">
            <Link to={ROUTES.LOGIN} className="text-slate-400 hover:text-white">
              Cancel and back to login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};
