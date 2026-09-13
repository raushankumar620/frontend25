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
        <h2 className="text-2xl font-extrabold text-[#14201C] tracking-tight">Set new password</h2>
        <p className="text-xs text-[#5F7069] mt-1">
          Must be at least 8 characters with numbers and special symbols.
        </p>
      </div>

      {isSuccess ? (
        <div className="p-6 bg-[#E9F9EE] border border-[#C4EBD0] rounded-2xl space-y-3 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-white border border-[#C4EBD0] flex items-center justify-center mx-auto text-[#05A222]">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-[#14201C]">Password reset complete</h4>
          <p className="text-xs text-[#5F7069] max-w-xs mx-auto">
            Your password has been securely updated. You can now login with your new credentials.
          </p>
          <div className="pt-2">
            <Button
              className="w-full"
              size="md"
              onClick={() => navigate(ROUTES.LOGIN)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Go to Login
            </Button>
          </div>
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

          <div className="text-center pt-2 text-xs">
            <Link to={ROUTES.LOGIN} className="text-[#5F7069] hover:text-[#14201C] transition-colors font-medium">
              Cancel and back to login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};
