import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, Pause, Play, ArrowRight, Lightbulb } from 'lucide-react';
import { DID_YOU_KNOW_FACTS, DidYouKnowFact } from '../../data/governmentSchemesData';

interface SchemeDidYouKnowCarouselProps {
  onSelectScheme?: (schemeId: string) => void;
}

export function SchemeDidYouKnowCarousel({ onSelectScheme }: SchemeDidYouKnowCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const factsCount = DID_YOU_KNOW_FACTS.length;

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % factsCount);
      }, 5500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, factsCount]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + factsCount) % factsCount);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % factsCount);
  };

  const currentFact = DID_YOU_KNOW_FACTS[currentIndex];

  return (
    <div 
      className="bg-white rounded-3xl border-2 border-[#EAE7E1] p-5 sm:p-7 shadow-xs relative overflow-hidden transition-all hover:border-[#F2A93B]/60"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Government Health Benefits Quick Discovery"
    >
      {/* Top Background Gradient Aura */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#F2A93B]/10 via-[#E05D3F]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header with Tag & Autoplay Controls */}
      <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-[#EAE7E1]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#FEF7EC] text-[#D97706] border border-[#FDE68A] flex items-center justify-center shrink-0">
            <Lightbulb size={16} />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E]">
            Did You Know? <span className="text-[#E05D3F] font-normal">• Public Healthcare Insights</span>
          </span>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="w-7 h-7 rounded-lg bg-[#F6F4F1] hover:bg-[#EAE7E1] text-[#2E2A5E] flex items-center justify-center text-xs transition-colors cursor-pointer"
            title={isPaused ? 'Resume auto-advance' : 'Pause auto-advance'}
            aria-label={isPaused ? 'Resume auto-advance' : 'Pause auto-advance'}
          >
            {isPaused ? <Play size={12} className="text-[#1B7A3D]" /> : <Pause size={12} className="text-[#6B6560]" />}
          </button>

          <button
            type="button"
            onClick={handlePrev}
            className="w-7 h-7 rounded-lg bg-[#F6F4F1] hover:bg-[#EAE7E1] text-[#2E2A5E] flex items-center justify-center text-xs transition-colors cursor-pointer"
            aria-label="Previous insight"
          >
            <ChevronLeft size={14} />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="w-7 h-7 rounded-lg bg-[#F6F4F1] hover:bg-[#EAE7E1] text-[#2E2A5E] flex items-center justify-center text-xs transition-colors cursor-pointer"
            aria-label="Next insight"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Main Slide Content */}
      <div className="grid md:grid-cols-12 gap-5 items-center">
        {/* Left Stat Callout */}
        {currentFact.statNumber && (
          <div className="md:col-span-4 bg-[#F6F4F1] p-4 sm:p-5 rounded-2xl border border-[#EAE7E1] flex flex-col justify-center text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A847F]">
              {currentFact.statLabel || 'Guaranteed Benefit'}
            </span>
            <div className="text-2xl sm:text-3xl font-heading font-black text-[#E05D3F] mt-0.5">
              {currentFact.statNumber}
            </div>
            <span className="text-[11px] font-bold text-[#2E2A5E] mt-1 flex items-center gap-1">
              <Sparkles size={13} className="text-[#F2A93B]" /> {currentFact.tag}
            </span>
          </div>
        )}

        {/* Right Description & Action */}
        <div className={`${currentFact.statNumber ? 'md:col-span-8' : 'md:col-span-12'} space-y-2.5`}>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FEF3F2] text-[#E05D3F] border border-[#FECDCA]">
            Fact {currentIndex + 1} of {factsCount}
          </div>

          <h4 className="text-base sm:text-lg font-heading font-extrabold text-[#2E2A5E] leading-snug">
            {currentFact.title}
          </h4>

          <p className="text-xs sm:text-sm text-[#55504D] leading-relaxed">
            {currentFact.description}
          </p>

          {currentFact.targetSchemeId && onSelectScheme && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => onSelectScheme(currentFact.targetSchemeId!)}
                className="inline-flex items-center gap-1 text-xs font-extrabold text-[#E05D3F] hover:text-[#c94f33] transition-colors cursor-pointer group"
              >
                <span>{currentFact.actionText}</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress Dots Indicator */}
      <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#EAE7E1] text-[11px] text-[#8A847F]">
        <div className="flex items-center gap-1.5">
          {DID_YOU_KNOW_FACTS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentIndex === idx 
                  ? 'w-6 bg-[#E05D3F]' 
                  : 'w-2 bg-[#EAE7E1] hover:bg-[#D9D4CB]'
              }`}
              aria-label={`Jump to slide ${idx + 1}`}
            />
          ))}
        </div>

        <span className="text-[11px] font-medium hidden sm:inline">
          Auto-rotates every 5 seconds • Hover to pause
        </span>
      </div>
    </div>
  );
}
