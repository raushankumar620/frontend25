import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useAuthStore } from '../../../store/authStore';
import { ROUTES } from '../../../utils/constants';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('sarah.j@acmeglobal.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      setIsLoading(true);
      setError('');
      await login(email, password);
      navigate(ROUTES.DASHBOARD);
    } catch {
      setError('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-[#14201C] tracking-tight">Welcome back</h2>
        <p className="text-xs text-[#5F7069] mt-1">
          Sign in to your WhatsApp Cloud API dashboard, automation rules, and inbox.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-[#FDF2F2] border border-[#F8B4B4] rounded-xl text-xs text-[#D64545] font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Work Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          leftIcon={<Mail className="w-4 h-4" />}
          required
        />

        <div>
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />
          <div className="flex justify-end mt-1.5">
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-xs text-[#05A222] hover:text-[#006736] font-semibold"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Sign In to Workspace
        </Button>
      </form>

      <div className="text-center text-xs text-[#5F7069]">
        Don&apos;t have an account?{' '}
        <Link to={ROUTES.REGISTER} className="text-[#05A222] font-semibold hover:underline">
          Create free account
        </Link>
      </div>
    </div>
  );
};
