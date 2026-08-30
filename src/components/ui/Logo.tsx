import React from 'react';
import { cn } from '../../utils/cn';

interface LogoProps {
  className?: string;
  theme?: 'dark' | 'light';
  showText?: boolean;
}

export function Logo({ className, theme = 'dark', showText = true }: LogoProps) {
  const isDark = theme === 'dark';

  return (
    <div className={cn("flex items-center gap-3 group", className)}>
      {/* Icon Wrapper */}
      <div className="relative flex items-center justify-center w-11 h-11 shrink-0">
        {/* Animated Glow Behind */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[#F2A93B] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700 rounded-xl"></div>
        
        {/* Premium Glass Container */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[#F2A93B] rounded-[14px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_10px_rgba(224,93,63,0.4)] group-hover:scale-[1.03] transition-transform duration-500 overflow-hidden border border-white/20">
           {/* Angled highlight sheen */}
           <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(135deg,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0)_50%)]"></div>
        </div>

        {/* Custom SVG Mark: A "V" that doubles as a Checkmark with a tracking dot */}
        <svg 
          viewBox="0 0 100 100" 
          className="relative z-10 w-6 h-6 transform group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left Arm of V */}
          <path d="M25 35 L48 75" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          {/* Right Arm of V extending into Checkmark */}
          <path d="M48 75 L80 25" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          {/* Tracking Dot (Mustard Gold highlight) */}
          <circle cx="80" cy="25" r="8" fill="#FFD166" className="animate-pulse" />
        </svg>
      </div>

      {/* Text Mark */}
      {showText && (
        <span className={cn(
          "font-heading font-extrabold text-[26px] tracking-tight flex items-baseline relative",
          isDark ? "text-white" : "text-[var(--color-secondary)]"
        )}>
          VacTrack
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] ml-1 shadow-[0_0_12px_rgba(224,93,63,0.7)] relative">
            <span className="absolute inset-0 rounded-full bg-[var(--color-primary)] animate-ping opacity-50"></span>
          </span>
        </span>
      )}
    </div>
  );
}
