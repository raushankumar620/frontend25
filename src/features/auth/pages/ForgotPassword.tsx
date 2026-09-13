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
        <h2 className="text-2xl font-extrabold text-[#14201C] tracking-tight">Reset password</h2>
        <p className="text-xs text-[#5F7069] mt-1">
          Enter your registered email address to receive secure reset instructions.
        </p>
      </div>

      {submitted ? (
        <div className="p-6 bg-[#E9F9EE] border border-[#C4EBD0] rounded-2xl space-y-3 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-white border border-[#C4EBD0] flex items-center justify-center mx-auto text-[#05A222]">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-[#14201C]">Check your email</h4>
          <p className="text-xs text-[#5F7069] max-w-xs mx-auto">
            We sent a password reset link to <span className="font-semibold text-[#14201C]">{email}</span>.
          </p>
          <div className="pt-2">
            <Link to={ROUTES.LOGIN} className="text-xs text-[#05A222] font-semibold hover:underline">
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

          <div className="text-center pt-2">
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center gap-1.5 text-xs text-[#5F7069] hover:text-[#14201C] transition-colors font-medium"
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
