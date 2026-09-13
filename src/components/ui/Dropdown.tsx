import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

export interface DropdownItem {
  label: string;
  value?: string;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'right',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={clsx('relative inline-block text-left', className)} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={clsx(
            'absolute z-50 mt-2 w-52 rounded-xl bg-white shadow-[0_16px_50px_rgba(1,59,35,0.12)] border border-[#E2EAE6] py-1.5 focus:outline-none animate-in fade-in zoom-in-95 duration-100',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {items.map((item, index) => (
            <button
              key={index}
              disabled={item.disabled}
              onClick={() => {
                if (item.onClick) item.onClick();
                setIsOpen(false);
              }}
              className={clsx(
                'w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-left transition-colors cursor-pointer',
                item.disabled && 'opacity-40 cursor-not-allowed',
                !item.disabled && item.danger
                  ? 'text-[#D64545] hover:bg-[#FDF2F2]'
                  : !item.disabled && 'text-[#1F2A26] hover:bg-[#F6FAF8]'
              )}
            >
              {item.icon && <span className="w-4 h-4 shrink-0 text-[#8A9993]">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
