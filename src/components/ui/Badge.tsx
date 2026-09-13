import React from 'react';
import clsx from 'clsx';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className,
}) => {
  const variantStyles = {
    primary: 'bg-[#E9F9EE] text-[#006736] border-[#C4EBD0]',
    success: 'bg-[#E9F9EE] text-[#039B56] border-[#C4EBD0]',
    warning: 'bg-[#FFF8E6] text-[#9A6B00] border-[#FFE299]',
    danger: 'bg-[#FDF2F2] text-[#D64545] border-[#F8B4B4]',
    info: 'bg-[#F0FDF4] text-[#07CF74] border-[#B9F5D5]',
    neutral: 'bg-[#F6FAF8] text-[#5F7069] border-[#E2EAE6]',
  };

  const dotColors = {
    primary: 'bg-[#05A222]',
    success: 'bg-[#039B56]',
    warning: 'bg-[#D99A00]',
    danger: 'bg-[#D64545]',
    info: 'bg-[#07CF74]',
    neutral: 'bg-[#8A9993]',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 gap-1.5 font-bold',
    md: 'text-sm px-3 py-1 gap-2 font-semibold',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border shrink-0',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {children}
    </span>
  );
};
