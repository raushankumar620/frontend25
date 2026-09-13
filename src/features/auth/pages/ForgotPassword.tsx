import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { ROUTES } from '../../../utils/constants';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Reset password</h2>
        <p className="text-xs text-slate-400 mt-1">
          Enter your registered email address to receive reset instructions.
        </p>
      </div>

      {submitted ? (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800 rounded-xl space-y-3 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <h4 className="text-sm font-semibold text-white">Check your email</h4>
          <p className="text-xs text-slate-300">
            We sent a password reset link to <span className="font-semibold text-white">{email}</span>.
          </p>
          <div className="pt-2">
            <Link to={ROUTES.LOGIN} className="text-xs text-emerald-400 font-semibold hover:underline">
              Return to login
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Account Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="sarah@acme.com"
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
            Send Reset Instructions
          </Button>

          <div className="text-center">
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
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
