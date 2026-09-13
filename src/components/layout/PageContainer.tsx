import React from 'react';
import clsx from 'clsx';

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  fullWidth = false,
}) => {
  return (
    <div
      className={clsx(
        'w-full mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200',
        fullWidth ? 'max-w-none' : 'max-w-7xl',
        className
      )}
    >
      {children}
    </div>
  );
};
