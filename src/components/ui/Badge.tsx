import React from 'react';
import { cn } from '../../utils/cn';
import { DoseStatus } from '../../types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  key?: React.Key;
  status?: DoseStatus | 'verified' | 'tampered' | string;
  variant?: 'solid' | 'outline';
  className?: string;
  children?: React.ReactNode;
}

export function Badge({ className, status, variant = 'solid', ...props }: BadgeProps) {
  const isCompleted = status === 'completed' || status === 'verified';
  const isWarning = status === 'due_today' || status === 'upcoming' || status === 'scheduled';
  const isDanger = status === 'overdue' || status === 'tampered' || status === 'expired' || status === 'recalled';

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors",
        variant === 'solid' ? {
          'bg-[#1B7A3D] text-white shadow-xs': isCompleted,
          'bg-[#D97706] text-white shadow-xs': isWarning,
          'bg-[#B91C1C] text-white shadow-xs': isDanger,
          'bg-[#2E2A5E] text-white': !isCompleted && !isWarning && !isDanger,
        } : {
          'bg-[#EBF7EE] text-[#1B7A3D] border border-[#C8E6C9]': isCompleted,
          'bg-[#FEF7EC] text-[#B45309] border border-[#FDE68A]': isWarning,
          'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]': isDanger,
          'bg-[#F6F4F1] text-[#2E2A5E] border border-[#EAE7E1]': !isCompleted && !isWarning && !isDanger,
        },
        className
      )}
      {...props}
    />
  );
}
