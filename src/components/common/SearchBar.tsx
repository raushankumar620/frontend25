import React from 'react';
import { Search, X } from 'lucide-react';
import clsx from 'clsx';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onClear?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className,
  onClear,
}) => {
  return (
    <div className={clsx('relative flex items-center w-full', className)}>
      <Search className="w-4.5 h-4.5 text-[#8A9993] absolute left-3.5 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#F6FAF8] border border-[#E2EAE6] text-sm rounded-xl pl-10 pr-9 py-2.5 text-[#1F2A26] placeholder-[#8A9993] focus:outline-none focus:ring-2 focus:ring-[#05A222]/20 focus:border-[#05A222] transition-all"
      />
      {value && (
        <button
          onClick={() => {
            onChange('');
            if (onClear) onClear();
          }}
          className="absolute right-3 p-1 rounded-lg text-[#8A9993] hover:text-[#14201C] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
