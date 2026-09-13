import React, { forwardRef } from 'react';
import clsx from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-bold text-[#14201C] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-[#8A9993] pointer-events-none flex items-center">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          className={clsx(
            'w-full rounded-xl border bg-white text-[#1F2A26] text-sm sm:text-base px-4 py-2.5 transition-colors placeholder:text-[#8A9993] focus:outline-none focus:ring-2',
            leftIcon ? 'pl-10' : 'pl-4',
            rightIcon ? 'pr-10' : 'pr-4',
            error
              ? 'border-[#D64545] focus:border-[#D64545] focus:ring-[#D64545]/20'
              : 'border-[#E2EAE6] focus:border-[#05A222] focus:ring-[#05A222]/20',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 text-[#8A9993] flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs sm:text-sm font-medium text-[#D64545]">{error}</p>}
      {helperText && !error && <p className="mt-1.5 text-xs sm:text-sm text-[#5F7069]">{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';
