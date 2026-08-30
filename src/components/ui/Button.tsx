import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
  type?: 'submit' | 'reset' | 'button';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  [key: string]: any;
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none",
        {
          'bg-[var(--color-primary)] text-white hover:bg-[#c94f33] shadow-sm hover:shadow active:scale-[0.99]': variant === 'primary',
          'bg-[var(--color-secondary)] text-white hover:bg-[#231f49] shadow-sm hover:shadow active:scale-[0.99]': variant === 'secondary',
          'border border-[#D9D4CB] bg-white text-[var(--color-secondary)] hover:bg-[var(--color-soft-bg)] hover:border-[#C4BEB3] shadow-sm': variant === 'outline',
          'text-[var(--color-secondary)] hover:bg-[var(--color-soft-bg)]': variant === 'ghost',
          'bg-[var(--color-status-error)] text-white hover:bg-[#991b1b] shadow-sm': variant === 'danger',
          'h-9 px-3.5 text-xs font-semibold': size === 'sm',
          'h-11 px-5 text-sm font-semibold': size === 'md',
          'h-12 px-7 text-base font-bold': size === 'lg',
        },
        className
      )}
      {...props}
    />
  );
}
