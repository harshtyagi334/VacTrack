import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { 
  BarChart3, TrendingUp, Activity, Plus, CheckCircle2
} from 'lucide-react';
import { Button } from '../ui/Button';

interface UsageAnalyticsChartProps {
  hospitalId: string;
}

export function UsageAnalyticsChart({ hospitalId }: UsageAnalyticsChartProps) {
  const { hospitalOperations, updateHospitalOperations } = useAppStore();
  const hospital = hospitalOperations[hospitalId] || hospitalOperations['hosp_1'];

  const stats = hospital?.stats || {
    totalVaccinesAvailable: 533,
    totalDosesUsed: 140,
    dosesAdministeredToday: 28,
    dosesThisMonth: 612
  };

  // Base 7-day usage demo data as requested
  const fallbackWeeklyData = [
    { day: '21 Aug', doses: 18, date: '2026-08-21', fullDay: 'Thursday, 21 Aug 2026' },
    { day: '22 Aug', doses: 24, date: '2026-08-22', fullDay: 'Friday, 22 Aug 2026' },
    { day: '23 Aug', doses: 21, date: '2026-08-23', fullDay: 'Saturday, 23 Aug 2026' },
    { day: '24 Aug', doses: 31, date: '2026-08-24', fullDay: 'Sunday, 24 Aug 2026' },
    { day: '25 Aug', doses: 26, date: '2026-08-25', fullDay: 'Monday, 25 Aug 2026' },
    { day: '26 Aug', doses: 22, date: '2026-08-26', fullDay: 'Tuesday, 26 Aug 2026' },
    { day: '27 Aug', doses: 28, date: '2026-08-27', fullDay: 'Wednesday, 27 Aug 2026 (Today)' }
  ];

  const weeklyData = hospital?.usage7Days && hospital.usage7Days.length === 7
    ? hospital.usage7Days.map((item, idx) => ({
        day: item.day || fallbackWeeklyData[idx]?.day || 'Day',
        doses: typeof item.doses === 'number' ? item.doses : fallbackWeeklyData[idx]?.doses || 20,
        date: item.date || fallbackWeeklyData[idx]?.date || '',
        fullDay: fallbackWeeklyData[idx]?.fullDay || `${item.day} 2026`
      }))
    : fallbackWeeklyData;

  // Calculate dynamic average doses/day automatically
  const totalDoses7Days = weeklyData.reduce((sum, item) => sum + item.doses, 0);
  const avgDosesPerDay = (totalDoses7Days / weeklyData.length).toFixed(1);

  // Y-axis scale calculation
  const maxDoseValue = Math.max(...weeklyData.map(d => d.doses), 35);
  const yAxisMax = Math.ceil(maxDoseValue / 10) * 10; // e.g. 40
  const yTicks = [yAxisMax, Math.round(yAxisMax * 0.75), Math.round(yAxisMax * 0.5), Math.round(yAxisMax * 0.25), 0];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [quickAddedToast, setQuickAddedToast] = useState(false);

  // Action to dynamically add a vaccination dose to today (27 Aug)
  const handleQuickAddDose = () => {
    if (!hospital || !hospital.usage7Days) return;
    const targetHospId = hospital.id || hospitalId || 'hosp_1';
    const updatedUsage = hospital.usage7Days.map((item, idx) => {
      if (idx === hospital.usage7Days.length - 1) {
        return { ...item, doses: item.doses + 1 };
      }
      return item;
    });

    const currentStats = hospital.stats || {
      patientsToday: 42,
      totalVaccinesAvailable: 533,
      totalDosesUsed: 140,
      dosesAdministeredToday: 28,
      dosesThisMonth: 612,
      emergencyCases: 8
    };

    const updatedStats = {
      ...currentStats,
      totalDosesUsed: currentStats.totalDosesUsed + 1,
      dosesAdministeredToday: currentStats.dosesAdministeredToday + 1,
      dosesThisMonth: currentStats.dosesThisMonth + 1,
      totalVaccinesAvailable: Math.max(0, currentStats.totalVaccinesAvailable - 1)
    };

    updateHospitalOperations(targetHospId, {
      usage7Days: updatedUsage,
      stats: updatedStats
    });

    setQuickAddedToast(true);
    setTimeout(() => setQuickAddedToast(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-[#EAE7E1] shadow-xs p-5 sm:p-7 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#F2A93B]/20 text-[#B45309] rounded-xl">
              <BarChart3 size={20} />
            </div>
            <h2 className="text-xl font-heading font-extrabold text-[#2E2A5E]">
              Vaccine Consumption & Immunization Analytics
            </h2>
          </div>
          <p className="text-xs text-[#6B6560] mt-1">
            Historical batch throughput, daily immunization velocity, and replenishment forecast.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B7A3D] bg-[#EBF7EE] px-3 py-1.5 rounded-full border border-[#C8E6C9]">
            <TrendingUp size={14} /> +14.2% demand vs previous week
          </div>

          <button
            onClick={handleQuickAddDose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-[#E05D3F] hover:bg-[#c94f33] text-white shadow-xs transition-colors cursor-pointer"
            title="Simulate recording 1 additional dose today"
          >
            <Plus size={14} />
            <span>Record +1 Dose Today</span>
          </button>
        </div>
      </div>

      {quickAddedToast && (
        <div className="p-3 bg-[#EBF7EE] border border-[#C8E6C9] rounded-xl text-xs font-bold text-[#1B7A3D] flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>Vaccine dose recorded! Chart dynamically updated to reflect new consumption data.</span>
        </div>
      )}

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1] space-y-1">
          <span className="text-[10px] text-[#6B6560] font-extrabold uppercase tracking-wider block">
            Total Available Stock
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-[#2E2A5E]">
            {stats.totalVaccinesAvailable.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#1B7A3D] font-bold block">✓ Safe Reserve Level</span>
        </div>

        <div className="p-4 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1] space-y-1">
          <span className="text-[10px] text-[#6B6560] font-extrabold uppercase tracking-wider block">
            Total Doses Used
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-[#2E2A5E]">
            {stats.totalDosesUsed.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#6B6560] font-bold block">All-time recorded</span>
        </div>

        <div className="p-4 bg-[#EBF7EE] rounded-2xl border border-[#C8E6C9] space-y-1">
          <span className="text-[10px] text-[#1B7A3D] font-extrabold uppercase tracking-wider block">
            Administered Today
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-[#1B7A3D]">
            {stats.dosesAdministeredToday}
          </div>
          <span className="text-[10px] text-[#1B7A3D] font-bold block">SHA-256 Ledger Verified</span>
        </div>

        <div className="p-4 bg-[#FEF3C7] rounded-2xl border border-[#FDE68A] space-y-1">
          <span className="text-[10px] text-[#D97706] font-extrabold uppercase tracking-wider block">
            Doses This Month
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-[#D97706]">
            {stats.dosesThisMonth}
          </div>
          <span className="text-[10px] text-[#D97706] font-bold block">August 2026 Total</span>
        </div>
      </div>

      {/* Interactive 7-Day Chart */}
      <div className="p-4 sm:p-6 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-xs font-extrabold text-[#2E2A5E] uppercase tracking-wider flex items-center gap-1.5">
            <Activity size={14} className="text-[#E05D3F]" /> Vaccine Usage — Last 7 Days (Doses)
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-extrabold text-[#2E2A5E] bg-white px-2.5 py-1 rounded-lg border border-[#EAE7E1]">
              Avg: {avgDosesPerDay} doses/day
            </span>
            <span className="text-[10px] text-[#6B6560] font-bold">
              (Total: {totalDoses7Days} doses)
            </span>
          </div>
        </div>

        {/* Chart Area */}
        <div className="pt-4 pb-2">
          <div className="flex items-end gap-2 sm:gap-4">
            
            {/* Simple Y-Axis Scale */}
            <div className="w-6 sm:w-8 h-44 flex flex-col justify-between items-end pb-7 pr-1 text-[10px] sm:text-[11px] font-mono font-bold text-[#8A847F] select-none shrink-0">
              {yTicks.map((tick, i) => (
                <span key={i} className="leading-none">{tick}</span>
              ))}
            </div>

            {/* Plot area with 7 bars */}
            <div className="flex-1 relative">
              {/* Horizontal Background Gridlines */}
              <div className="absolute inset-x-0 top-0 h-36 flex flex-col justify-between pointer-events-none z-0">
                {yTicks.map((_, i) => (
                  <div key={i} className="w-full border-b border-[#EAE7E1] h-0" />
                ))}
              </div>

              {/* 7 Columns: Dose Number + Bar + Date */}
              <div className="relative z-10 grid grid-cols-7 gap-1 sm:gap-3">
                {weeklyData.map((item, idx) => {
                  const isLatest = idx === weeklyData.length - 1; // 27 Aug
                  const isHovered = hoveredIndex === idx;
                  const heightPercent = Math.max(10, Math.min(100, (item.doses / yAxisMax) * 100));

                  return (
                    <div 
                      key={item.day}
                      className="flex flex-col items-center group cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {/* Dose Number Above Each Bar */}
                      <div className={`h-6 flex items-center justify-center text-[11px] sm:text-xs font-mono font-black transition-transform ${
                        isLatest 
                          ? 'text-[#E05D3F] scale-110' 
                          : isHovered 
                          ? 'text-[#2E2A5E] scale-110' 
                          : 'text-[#2E2A5E]'
                      }`}>
                        {item.doses}
                      </div>

                      {/* Bar Container - fixed 144px height (h-36) */}
                      <div className="w-full h-36 flex items-end justify-center px-0.5 sm:px-1">
                        <div 
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full max-w-[42px] rounded-t-lg transition-all duration-300 shadow-xs relative flex flex-col justify-between ${
                            isLatest
                              ? 'bg-[#E05D3F] ring-2 ring-[#E05D3F]/40 shadow-sm'
                              : isHovered
                              ? 'bg-[#2E2A5E] brightness-125'
                              : 'bg-[#2E2A5E] hover:bg-[#3E3875]'
                          }`}
                        >
                          {/* Top highlight cap */}
                          <div className={`w-full h-1 rounded-t-lg ${
                            isLatest ? 'bg-[#FF8A70]' : 'bg-[#4C458A]'
                          }`} />
                        </div>
                      </div>

                      {/* X-Axis Date Label directly below bar */}
                      <div className="mt-2 text-center w-full">
                        <span className={`text-[10px] sm:text-xs font-bold block truncate transition-colors ${
                          isLatest 
                            ? 'text-[#E05D3F] font-black underline underline-offset-2' 
                            : 'text-[#6B6560] group-hover:text-[#2E2A5E]'
                        }`}>
                          {item.day}
                        </span>
                        {isLatest && (
                          <span className="hidden sm:block text-[9px] font-extrabold text-[#E05D3F] uppercase tracking-tighter">
                            Latest
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </div>

        {/* Interactive Hover Tooltip */}
        {hoveredIndex !== null && weeklyData[hoveredIndex] && (
          <div className="p-3 bg-white rounded-xl border-2 border-[#EAE7E1] text-xs font-bold text-[#2E2A5E] flex items-center justify-between shadow-xs">
            <span className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${hoveredIndex === 6 ? 'bg-[#E05D3F]' : 'bg-[#2E2A5E]'}`} />
              <span>{weeklyData[hoveredIndex].fullDay}</span>
            </span>
            <span className="text-[#E05D3F] font-extrabold font-mono text-sm">
              {weeklyData[hoveredIndex].doses} doses administered
            </span>
          </div>
        )}
      </div>

    </div>
  );
}
