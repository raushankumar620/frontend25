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
  fullWidth = true,
}) => {
  return (
    <div
      className={clsx(
        'w-full px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 animate-in fade-in duration-200',
        fullWidth ? 'max-w-none' : 'max-w-7xl mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
};
