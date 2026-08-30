import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { format, parseISO } from 'date-fns';
import { FastForward, Calendar, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from './ui/Button';

export function DemoControls() {
  const { currentDate, fastForwardTime } = useAppStore();
  const [isMinimized, setIsMinimized] = useState(false);

  // On mount, trigger a status update just in case
  useEffect(() => {
    useAppStore.getState().updateDoseStatuses();
  }, []);

  return (
    <div className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-20px)] sm:max-w-max">
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-[#2E2A5E] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-white/20 text-xs font-bold hover:bg-[#231f47] transition-all cursor-pointer"
        >
          <Calendar size={14} className="text-[#E05D3F]" />
          <span>{format(parseISO(currentDate), 'dd MMM yyyy')}</span>
          <ChevronUp size={14} />
        </button>
      ) : (
        <div className="bg-[#2E2A5E] text-white px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-2xl sm:rounded-full shadow-xl border border-white/15 flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-start gap-2.5 sm:gap-3.5">
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-[#F2A93B] font-extrabold leading-tight">Simulated Date</span>
              <span className="font-extrabold text-xs sm:text-sm text-white leading-tight">{format(parseISO(currentDate), 'dd MMM yyyy')}</span>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-white/60 hover:text-white p-1 rounded sm:hidden cursor-pointer"
              title="Minimize"
              aria-label="Minimize demo bar"
            >
              <ChevronDown size={14} />
            </button>
          </div>
          
          <div className="hidden sm:block w-px h-5 bg-white/20" />
          
          <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1 text-xs font-bold text-[#E05D3F] mr-1">
              <FastForward size={14} />
              <span className="text-[11px] hidden md:inline">Advance:</span>
            </div>
            <button 
              onClick={() => fastForwardTime(1)} 
              className="px-2.5 py-1 bg-white/10 hover:bg-white/25 active:scale-95 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[28px] min-w-[32px] flex items-center justify-center"
            >
              +1d
            </button>
            <button 
              onClick={() => fastForwardTime(3)} 
              className="px-2.5 py-1 bg-white/10 hover:bg-white/25 active:scale-95 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[28px] min-w-[32px] flex items-center justify-center"
            >
              +3d
            </button>
            <button 
              onClick={() => fastForwardTime(7)} 
              className="px-2.5 py-1 bg-white/10 hover:bg-white/25 active:scale-95 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[28px] min-w-[32px] flex items-center justify-center"
            >
              +7d
            </button>
            <button 
              onClick={() => fastForwardTime(14)} 
              className="px-2.5 py-1 bg-white/10 hover:bg-white/25 active:scale-95 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[28px] min-w-[32px] flex items-center justify-center"
            >
              +14d
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-white/40 hover:text-white p-1 rounded hidden sm:block ml-1 cursor-pointer"
              title="Minimize"
              aria-label="Minimize demo bar"
            >
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
