import React from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl active:scale-[0.98] cursor-pointer';

  const variantStyles = {
    primary: 'bg-[#05A222] hover:bg-[#006736] text-white shadow-xs focus:ring-[#05A222] border border-[#05A222]',
    secondary: 'bg-[#E9F9EE] hover:bg-[#D9F3E2] text-[#006736] font-semibold border border-[#C4EBD0] focus:ring-[#05A222]',
    outline: 'bg-transparent border border-[#05A222] text-[#006736] hover:bg-[#F6FAF8] focus:ring-[#05A222]',
    ghost: 'bg-transparent text-[#006736] hover:bg-[#F6FAF8] focus:ring-[#05A222] border border-transparent',
    danger: 'bg-[#D64545] hover:bg-[#b73333] text-white shadow-xs focus:ring-[#D64545] border border-[#D64545]',
    success: 'bg-[#039B56] hover:bg-[#006736] text-white shadow-xs focus:ring-[#039B56] border border-[#039B56]',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
    icon: 'p-2 aspect-square',
  };

  return (
    <button
      className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
