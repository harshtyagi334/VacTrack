import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Clock, Share2, Bell, MapPin, User, Calendar, Syringe, 
  Network, CheckCircle, ArrowRight, Activity, HeartPulse, Building2, 
  Search, Lock, CheckCircle2, AlertTriangle, Phone, Mail, HelpCircle, 
  Layers, Check, Sparkles, FileText, ChevronDown, ChevronUp, AlertCircle,
  ExternalLink, QrCode, Shield
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAppStore } from '../store';
import { translations } from '../utils/translations';
import { GovernmentSchemesDiscovery } from '../components/GovernmentSchemes/GovernmentSchemesDiscovery';
import { SchemeEligibilityWizard } from '../components/GovernmentSchemes/SchemeEligibilityWizard';

// ==========================================
// 1. HOW IT WORKS JOURNEY COMPONENT
// ==========================================
export function HowItWorksSection() {
  const [hoveredStep, setHoveredStep] = useState<number>(0);

  const STEPS = [
    { 
      num: "01", 
      title: "Patient Registration", 
      desc: "Create a verified vaccination profile using a mobile number in under 30 seconds.", 
      icon: User,
      detail: "Patients register once with basic identity and emergency contacts. No bulky paperwork required."
    },
    { 
      num: "02", 
      title: "Vaccination Schedule", 
      desc: "Automatically calculate exact upcoming doses based on medical exposure protocols.", 
      icon: Calendar,
      detail: "Enforces strict protocol interval calculations (e.g. Day 0, 3, 7, 14, 28 for Rabies PEP)."
    },
    { 
      num: "03", 
      title: "Dose Recording", 
      desc: "Healthcare providers record administered doses with exact timestamps and facility IDs.", 
      icon: Syringe,
      detail: "12-Hour AM/PM timestamps and administering clinician ID logged directly into the patient record."
    },
    { 
      num: "04", 
      title: "Batch Verification", 
      desc: "Instant cold-chain safety check and CDSCO recall verification before injection.", 
      icon: ShieldCheck,
      detail: "Cross-checks vaccine lot numbers against safety recalls to eliminate expired or fake vials."
    },
    { 
      num: "05", 
      title: "Automatic Reminder", 
      desc: "Automated SMS and WhatsApp alerts dispatched before every critical dose window.", 
      icon: Bell,
      detail: "Multi-channel reminders notify patients 24 hours and 4 hours before scheduled appointment."
    },
    { 
      num: "06", 
      title: "Cross-Hospital Record", 
      desc: "Immunization records synced across all participating clinics for seamless continuity.", 
      icon: Network,
      detail: "Visit any partner hospital or emergency clinic in Pune or across India without losing history."
    },
    { 
      num: "07", 
      title: "Completed Journey", 
      desc: "Full regimen completion certified with a permanent, tamper-evident SHA-256 seal.", 
      icon: CheckCircle,
      detail: "Generates an immutable cryptographic record and offline QR code for lifetime proof."
    }
  ];

  return (
    <section className="py-20 bg-white border-y border-[#EAE7E1] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#F6F4F1] text-[#E05D3F] border border-[#EAE7E1] mb-3 shadow-xs">
            <Sparkles size={14} className="text-[#F2A93B]" /> Connected Immunization Regimen
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-[#2E2A5E] tracking-tight mb-3">
            Interactive Vaccination Journey
          </h2>
          <p className="text-base md:text-lg text-[#55504D] max-w-2xl mx-auto leading-relaxed">
            Hover over any step to explore how VacTrack connects every phase of the immunization journey from registration to completion.
          </p>
        </div>

        {/* DESKTOP INTERACTIVE JOURNEY (Grid & Progress Connector) */}
        <div className="hidden lg:block relative py-8 mb-6">
          
          {/* Background Connecting Line */}
          <div className="absolute top-[80px] left-[6%] right-[6%] h-1 bg-[#EAE7E1] rounded-full z-0 overflow-hidden">
            {/* Animated Active Line Fill based on hovered step */}
            <div 
              className="h-full bg-gradient-to-r from-[#E05D3F] via-[#F2A93B] to-[#2E2A5E] transition-all duration-300"
              style={{ width: `${((hoveredStep + 1) / STEPS.length) * 100}%` }}
            ></div>
          </div>

          {/* 7 Steps Row */}
          <div className="grid grid-cols-7 gap-3 relative z-10">
            {STEPS.map((step, i) => {
              const isHovered = hoveredStep === i;
              const isPast = i <= hoveredStep;
              const StepIcon = step.icon;

              return (
                <div 
                  key={step.num}
                  onMouseEnter={() => setHoveredStep(i)}
                  className={`flex flex-col items-center text-center cursor-pointer transition-all duration-300 transform ${
                    isHovered ? '-translate-y-2 scale-[1.02]' : 'hover:-translate-y-1'
                  }`}
                >
                  {/* Large Step Number */}
                  <span className={`text-xs font-extrabold tracking-widest uppercase mb-2 transition-colors duration-200 ${
                    isHovered ? 'text-[#E05D3F]' : isPast ? 'text-[#2E2A5E]' : 'text-[#6B6560]'
                  }`}>
                    {step.num}
                  </span>

                  {/* Step Node Circle */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 mb-4 relative shadow-sm ${
                    isHovered 
                      ? 'bg-[#E05D3F] text-white border-2 border-[#E05D3F] shadow-lg ring-4 ring-[#E05D3F]/20' 
                      : isPast
                        ? 'bg-white text-[#2E2A5E] border-2 border-[#2E2A5E]'
                        : 'bg-[#F6F4F1] text-[#6B6560] border-2 border-[#EAE7E1]'
                  }`}>
                    <StepIcon size={24} className={isHovered ? 'text-white animate-pulse' : isPast ? 'text-[#2E2A5E]' : 'text-[#6B6560]'} />
                    {isPast && !isHovered && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#1B7A3D] text-white text-[10px] font-bold flex items-center justify-center border border-white">
                        ✓
                      </span>
                    )}
                  </div>

                  {/* Step Title */}
                  <h3 className={`text-xs font-extrabold mb-1 leading-snug transition-colors duration-200 ${
                    isHovered ? 'text-[#E05D3F]' : 'text-[#2E2A5E]'
                  }`}>
                    {step.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-[11px] text-[#6B6560] leading-relaxed line-clamp-2 px-1">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* DESKTOP ACTIVE STEP DETAIL HIGHLIGHT BOX */}
        <div className="hidden lg:block max-w-4xl mx-auto bg-[#F6F4F1] p-6 rounded-2xl border-2 border-[#EAE7E1] shadow-xs relative">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#2E2A5E] text-[#F2A93B] flex items-center justify-center font-extrabold text-lg shrink-0 shadow-xs">
                {STEPS[hoveredStep].num}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-[#2E2A5E]">{STEPS[hoveredStep].title}</h4>
                  <span className="px-2 py-0.5 bg-[#E05D3F] text-white text-[10px] font-bold rounded">
                    Active Inspection
                  </span>
                </div>
                <p className="text-xs text-[#55504D] mt-0.5 leading-relaxed">{STEPS[hoveredStep].detail}</p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2 text-xs font-bold text-[#E05D3F]">
              <span>Step {hoveredStep + 1} of 7</span>
              <div className="w-20 h-1.5 bg-[#EAE7E1] rounded-full overflow-hidden">
                <div className="h-full bg-[#E05D3F]" style={{ width: `${((hoveredStep + 1) / 7) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE VERTICAL TIMELINE */}
        <div className="lg:hidden relative pl-6 space-y-6 before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-1 before:bg-gradient-to-b before:from-[#E05D3F] before:via-[#F2A93B] before:to-[#2E2A5E]">
          {STEPS.map((step, i) => {
            const StepIcon = step.icon;
            return (
              <div 
                key={step.num}
                onClick={() => setHoveredStep(i)}
                className={`relative pl-6 p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  hoveredStep === i 
                    ? 'bg-white border-[#E05D3F] shadow-md -translate-y-0.5' 
                    : 'bg-[#F6F4F1] border-[#EAE7E1]'
                }`}
              >
                {/* Node Dot on Connector */}
                <div className={`absolute -left-[27px] top-4 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ring-white ${
                  hoveredStep === i ? 'bg-[#E05D3F] text-white' : 'bg-[#2E2A5E] text-white'
                }`}>
                  {step.num}
                </div>

                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    hoveredStep === i ? 'bg-[#E05D3F] text-white' : 'bg-white text-[#2E2A5E] border border-[#EAE7E1]'
                  }`}>
                    <StepIcon size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#E05D3F]">{step.num}</span>
                      <h3 className="text-sm font-bold text-[#2E2A5E]">{step.title}</h3>
                    </div>
                    <p className="text-xs text-[#55504D] leading-relaxed mt-1">{step.desc}</p>
                    {hoveredStep === i && (
                      <p className="text-[11px] text-[#1B7A3D] font-semibold mt-2 pt-2 border-t border-[#EAE7E1]">
                        ✓ {step.detail}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

// ==========================================
// 2. PUBLIC PAGE: HOME
// ==========================================
export function Home() {
  const language = useAppStore(state => state.language);
  const t = translations[language] || translations.en;
  const [selectedDay, setSelectedDay] = useState(0);
  const [activeLocationTab, setActiveLocationTab] = useState<'hospitals' | 'camps' | 'emergency'>('hospitals');

  const RABIES_DOSES = [
    { day: 0, title: "Dose 1 (Day 0)", desc: "Immediate administration upon bite exposure. Includes wound assessment & Rabies Immunoglobulin (RIG) evaluation.", status: "Critical Initiation" },
    { day: 3, title: "Dose 2 (Day 3)", desc: "Essential secondary booster ensuring early antibody priming across the vascular system.", status: "Scheduled" },
    { day: 7, title: "Dose 3 (Day 7)", desc: "Critical threshold booster establishing robust neutralizing antibody levels.", status: "Scheduled" },
    { day: 14, title: "Dose 4 (Day 14)", desc: "Extended systemic protection securing long-term immune memory against virus migration.", status: "Scheduled" },
    { day: 28, title: "Dose 5 (Day 28)", desc: "Final protocol dose ensuring complete, lifelong protective immunity.", status: "Completion" }
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#FFFFFF]">
      {/* 1. HERO SECTION */}
      <section className="relative px-4 sm:px-6 lg:px-10 xl:px-12 pt-16 sm:pt-20 pb-12 sm:pb-16 bg-[#F6F4F1] border-b border-[#EAE7E1] overflow-hidden">
        <div className="w-full max-w-[1536px] mx-auto">
          {/* Public Health Live Triage & Stock Announcement Bar */}
          <div className="mb-5 p-3 sm:p-3.5 bg-white border-2 border-[#EAE7E1] rounded-2xl shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1B7A3D] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1B7A3D]"></span>
              </span>
              <span className="font-extrabold bg-[#EBF7EE] text-[#1B7A3D] px-2 py-0.5 rounded border border-[#C8E6C9] uppercase text-[10px] tracking-wider">
                Live Triage Network Active
              </span>
              <span className="font-bold text-[#55504D] hidden sm:inline">
                24/7 Rabies PEP & Anti-Venom Stock Active Across 18 Municipal & District Centers
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[#6B6560] font-semibold text-[11px] hidden md:inline">
                Emergency Helpline: <strong className="text-[#E05D3F]">108 / 1800-11-2011</strong>
              </span>
              <Link to="/patient/hospitals" className="text-[#E05D3F] hover:text-[#c94f33] font-bold inline-flex items-center gap-1 hover:underline">
                <span>Find Facility</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Hero Copy & Actions */}
            <div className="lg:col-span-7 text-left space-y-6">
              {/* VACTrack Brand Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#EAE7E1] text-xs font-semibold text-[#2E2A5E] shadow-xs">
                <span className="font-extrabold tracking-wide text-[#E05D3F]">VACTrack</span>
                <span className="w-1 h-1 rounded-full bg-[#D9D4CB]"></span>
                <span className="text-[#55504D]">{t.heroTag}</span>
              </div>

              {/* Main Hero Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-heading font-extrabold text-[#2E2A5E] tracking-tight leading-[1.15]">
                {t.heroTitle}
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-[#55504D] max-w-2xl font-normal leading-relaxed">
                {t.heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto px-7 py-3.5 text-base font-bold bg-[#E05D3F] hover:bg-[#c94f33] text-white border-none shadow-sm rounded-xl">
                    {t.getStarted} <ArrowRight size={17} className="ml-1 inline" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto px-7 py-3.5 text-base font-bold text-[#2E2A5E] border-[#2E2A5E]/30 hover:bg-white rounded-xl">
                    {t.hospitalLoginBtn}
                  </Button>
                </Link>
              </div>

              {/* Micro Trust Indicators */}
              <div className="pt-4 border-t border-[#EAE7E1]/80 grid grid-cols-3 gap-3 text-xs text-[#6B6560] font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-[#1B7A3D] shrink-0" />
                  <span>SHA-256 Verified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 size={16} className="text-[#2E2A5E] shrink-0" />
                  <span>Cross-Clinic Sync</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bell size={16} className="text-[#D97706] shrink-0" />
                  <span>Timely SMS / WA</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Vaccination Journey Visual */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-[#EAE7E1] shadow-md p-5 sm:p-6 relative overflow-hidden">
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#EAE7E1]">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-[#2E2A5E]">Aarav Sharma</h2>
                      <span className="px-2 py-0.5 bg-[#EBF7EE] text-[#1B7A3D] text-[10px] font-bold rounded-md">
                        Active Regimen
                      </span>
                    </div>
                    <p className="text-xs text-[#6B6560] mt-0.5">Protocol: Rabies PEP 5-Dose • ID: VT-2026-PN016</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-[#F6F4F1] border border-[#EAE7E1] flex items-center justify-center text-[#E05D3F]">
                    <Syringe size={18} />
                  </div>
                </div>

                {/* Connected Journey Visual Steps */}
                <div className="space-y-3 relative before:absolute before:top-3 before:bottom-3 before:left-3.5 before:w-0.5 before:bg-[#EAE7E1]">
                  {/* Dose 1 */}
                  <div className="relative pl-8 flex items-start justify-between gap-2">
                    <span className="absolute left-1.5 top-1 w-4 h-4 rounded-full bg-[#1B7A3D] text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-white">✓</span>
                    <div>
                      <p className="text-xs font-bold text-[#2E2A5E]">Dose 1 (Day 0) — Completed</p>
                      <p className="text-[11px] text-[#6B6560]">Shivajinagar Emergency Centre • Batch #RAB-7824</p>
                    </div>
                    <span className="text-[10px] font-mono text-[#1B7A3D] bg-[#EBF7EE] px-1.5 py-0.5 rounded shrink-0">Verified</span>
                  </div>

                  {/* Dose 2 */}
                  <div className="relative pl-8 flex items-start justify-between gap-2">
                    <span className="absolute left-1.5 top-1 w-4 h-4 rounded-full bg-[#1B7A3D] text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-white">✓</span>
                    <div>
                      <p className="text-xs font-bold text-[#2E2A5E]">Dose 2 (Day 3) — Completed</p>
                      <p className="text-[11px] text-[#6B6560]">KEM Hospital, Rasta Peth • Batch #RAB-7824</p>
                    </div>
                    <span className="text-[10px] font-mono text-[#1B7A3D] bg-[#EBF7EE] px-1.5 py-0.5 rounded shrink-0">Verified</span>
                  </div>

                  {/* Dose 3 */}
                  <div className="relative pl-8 flex items-start justify-between gap-2 bg-[#FEF7EC] -mx-2 p-2 rounded-xl border border-[#FDE68A]">
                    <span className="absolute left-3.5 top-3 w-4 h-4 rounded-full bg-[#D97706] text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-white">3</span>
                    <div className="pl-4">
                      <p className="text-xs font-bold text-[#92400E]">Dose 3 (Day 7) — Due Tomorrow</p>
                      <p className="text-[11px] text-[#B45309]">Window: 09:00 AM – 04:00 PM • SMS Alert Sent</p>
                    </div>
                    <span className="text-[10px] font-bold text-[#D97706] bg-white px-2 py-0.5 rounded shadow-2xs shrink-0">Due Soon</span>
                  </div>

                  {/* Dose 4 */}
                  <div className="relative pl-8 flex items-start justify-between gap-2 opacity-60">
                    <span className="absolute left-1.5 top-1 w-4 h-4 rounded-full bg-[#D9D4CB] text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-white">4</span>
                    <div>
                      <p className="text-xs font-semibold text-[#2E2A5E]">Dose 4 (Day 14) — Scheduled</p>
                      <p className="text-[11px] text-[#6B6560]">Automated reminder scheduled for next week</p>
                    </div>
                    <span className="text-[10px] text-[#6B6560] bg-[#F6F4F1] px-1.5 py-0.5 rounded shrink-0">Upcoming</span>
                  </div>

                  {/* Dose 5 */}
                  <div className="relative pl-8 flex items-start justify-between gap-2 opacity-60">
                    <span className="absolute left-1.5 top-1 w-4 h-4 rounded-full bg-[#D9D4CB] text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-white">5</span>
                    <div>
                      <p className="text-xs font-semibold text-[#2E2A5E]">Dose 5 (Day 28) — Scheduled</p>
                      <p className="text-[11px] text-[#6B6560]">Final protocol completion milestone</p>
                    </div>
                    <span className="text-[10px] text-[#6B6560] bg-[#F6F4F1] px-1.5 py-0.5 rounded shrink-0">Upcoming</span>
                  </div>
                </div>

                {/* Live Chain Status Footer */}
                <div className="mt-4 pt-3 border-t border-[#EAE7E1] flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-[#1B7A3D] font-semibold">
                    <ShieldCheck size={14} />
                    <span>Hash Chain: 100% Tamper-Evident</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#6B6560] bg-[#F6F4F1] px-2 py-0.5 rounded border border-[#EAE7E1]">
                    SHA256: e8f1a...720b
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SECTION: MORE THAN A VACCINE TRACKER */}
      <section className="py-14 sm:py-16 px-4 sm:px-6 lg:px-10 xl:px-12 bg-white border-b border-[#EAE7E1]">
        <div className="w-full max-w-[1536px] mx-auto space-y-12">
          {/* Section Heading & Subtext */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#F6F4F1] text-[#E05D3F] border border-[#EAE7E1] mb-3 shadow-xs">
              <HeartPulse size={14} /> Comprehensive Emergency & Health Hub
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#2E2A5E] tracking-tight mb-3">
              More Than a Vaccine Tracker
            </h2>
            <p className="text-base sm:text-lg text-[#55504D] leading-relaxed">
              Keep important vaccination and emergency health information connected — so the right information can be available when it matters.
            </p>
          </div>

          {/* Three Visually Different Sections */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* 1. HEALTH RECORD (Visual Style 1: Medical File Composition) */}
            <div className="bg-[#F6F4F1] rounded-3xl border border-[#EAE7E1] p-6 flex flex-col justify-between hover:border-[#D9D4CB] transition-all shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#E05D3F]">
                    1. HEALTH RECORD
                  </span>
                  <span className="w-8 h-8 rounded-full bg-white border border-[#EAE7E1] flex items-center justify-center text-[#2E2A5E]">
                    <Activity size={16} />
                  </span>
                </div>
                <h3 className="text-xl font-bold font-heading text-[#2E2A5E] mb-2">
                  Important health information in one place.
                </h3>
                <p className="text-xs text-[#55504D] leading-relaxed mb-5">
                  Consolidate your essential emergency medical history, critical drug allergies, and past immunization milestones with complete patient privacy controls.
                </p>

                {/* Visual Medical Record Preview Card */}
                <div className="bg-white p-4 rounded-2xl border border-[#EAE7E1] space-y-2.5 shadow-xs mb-6">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-[#EAE7E1]">
                    <span className="text-[#6B6560] font-medium">Blood Group</span>
                    <span className="font-bold text-[#B91C1C] bg-[#FEF2F2] px-2 py-0.5 rounded border border-[#FECACA]">B +ve</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-[#EAE7E1]">
                    <span className="text-[#6B6560] font-medium">Drug Allergies</span>
                    <span className="font-bold text-[#B91C1C]">Penicillin (Severe)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6B6560] font-medium">Verified Past Doses</span>
                    <span className="font-bold text-[#1B7A3D]">COVID-19 Booster, TT</span>
                  </div>
                </div>
              </div>

              <Link to="/patient/record" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E05D3F] hover:text-[#c94f33] pt-2 border-t border-[#EAE7E1]">
                <span>Open Health Record</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* 2. EMERGENCY SUPPORT (Visual Style 2: Urgent Dispatch & Locator Composition) */}
            <div className="bg-[#2E2A5E] text-white rounded-3xl border border-[#2E2A5E] p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#F2A93B]">
                    2. EMERGENCY SUPPORT
                  </span>
                  <span className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[#F2A93B]">
                    <HeartPulse size={16} />
                  </span>
                </div>
                <h3 className="text-xl font-bold font-heading text-white mb-2">
                  Find nearby healthcare facilities when urgent care is needed.
                </h3>
                <p className="text-xs text-white/80 leading-relaxed mb-5">
                  Instant guidance for animal bites, snakebite antivenom access, and 24/7 emergency care stations across Pune with direct telephone routing.
                </p>

                {/* Visual Emergency Facilities Preview */}
                <div className="bg-white/10 p-4 rounded-2xl border border-white/15 space-y-2.5 mb-6 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">Shivajinagar Emergency Unit</span>
                    <span className="text-[10px] bg-[#1B7A3D] text-white px-2 py-0.5 rounded font-bold">2.4 km • 24/7</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded bg-white/15 text-[10px] text-white/90">Anti-Rabies PEP</span>
                    <span className="px-2 py-0.5 rounded bg-white/15 text-[10px] text-white/90">Antivenom Stock</span>
                    <span className="px-2 py-0.5 rounded bg-white/15 text-[10px] text-white/90">Trauma Triage</span>
                  </div>
                </div>
              </div>

              <Link to="/patient/emergency" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F2A93B] hover:underline pt-2 border-t border-white/10">
                <span>Find Urgent Care Centers</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* 3. QR ACCESS (Visual Style 3: Digital Credential & Privacy Composition) */}
            <div className="bg-[#FFFFFF] rounded-3xl border-2 border-[#EAE7E1] p-6 flex flex-col justify-between hover:border-[#E05D3F]/40 transition-all shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#1B7A3D]">
                    3. QR ACCESS
                  </span>
                  <span className="w-8 h-8 rounded-full bg-[#EBF7EE] border border-[#C8E6C9] flex items-center justify-center text-[#1B7A3D]">
                    <QrCode size={16} />
                  </span>
                </div>
                <h3 className="text-xl font-bold font-heading text-[#2E2A5E] mb-2">
                  Share selected verified health information securely.
                </h3>
                <p className="text-xs text-[#55504D] leading-relaxed mb-5">
                  Present your tamper-evident QR code to doctors or first responders for instantaneous, offline-capable verification of authorized health records.
                </p>

                {/* Visual QR Code & Verification Tag */}
                <div className="bg-[#F6F4F1] p-4 rounded-2xl border border-[#EAE7E1] flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white p-1.5 rounded-xl border border-[#EAE7E1] flex items-center justify-center shrink-0 shadow-2xs">
                    <QrCode size={46} className="text-[#2E2A5E]" />
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex items-center gap-1 text-[#1B7A3D] font-bold">
                      <ShieldCheck size={13} />
                      <span>Tamper-Evident</span>
                    </div>
                    <p className="text-[11px] text-[#6B6560]">Patient-controlled privacy toggles for blood group and allergies.</p>
                  </div>
                </div>
              </div>

              <Link to="/patient/qr" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E05D3F] hover:text-[#c94f33] pt-2 border-t border-[#EAE7E1]">
                <span>View Verified QR System</span>
                <ArrowRight size={14} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SECTION: HEALTHCARE SUPPORT AROUND YOU (PUNE, MAHARASHTRA) */}
      <section className="py-14 sm:py-16 px-4 sm:px-6 lg:px-10 xl:px-12 bg-[#F6F4F1] border-b border-[#EAE7E1]">
        <div className="w-full max-w-[1536px] mx-auto space-y-8">
          
          {/* Location Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-[#2E2A5E] border border-[#EAE7E1] mb-2 shadow-xs">
                <MapPin size={13} className="text-[#E05D3F]" />
                <span>Pune, Maharashtra</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#2E2A5E]">
                Healthcare support around you
              </h2>
              <p className="text-sm text-[#55504D] mt-1">
                Connected facilities, immunization camps, and emergency stations across the Pune metropolitan area.
              </p>
            </div>

            {/* Category Selector Tabs */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#EAE7E1] shadow-2xs">
              <button
                onClick={() => setActiveLocationTab('hospitals')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeLocationTab === 'hospitals' 
                    ? 'bg-[#2E2A5E] text-white shadow-xs' 
                    : 'text-[#55504D] hover:bg-[#F6F4F1]'
                }`}
              >
                Nearby Hospitals
              </button>
              <button
                onClick={() => setActiveLocationTab('camps')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeLocationTab === 'camps' 
                    ? 'bg-[#2E2A5E] text-white shadow-xs' 
                    : 'text-[#55504D] hover:bg-[#F6F4F1]'
                }`}
              >
                Vaccination Camps
              </button>
              <button
                onClick={() => setActiveLocationTab('emergency')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeLocationTab === 'emergency' 
                    ? 'bg-[#2E2A5E] text-white shadow-xs' 
                    : 'text-[#55504D] hover:bg-[#F6F4F1]'
                }`}
              >
                Emergency Care
              </button>
            </div>
          </div>

          {/* Location Category Content */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeLocationTab === 'hospitals' && (
              <>
                <div className="bg-white p-5 rounded-2xl border border-[#EAE7E1] shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#2E2A5E]">Shivajinagar Emergency Medical Centre</h4>
                      <p className="text-xs text-[#6B6560] mt-0.5">FC Road, Shivajinagar, Pune • 2.4 km</p>
                    </div>
                    <span className="px-2 py-0.5 bg-[#EBF7EE] text-[#1B7A3D] text-[10px] font-bold rounded">Connected</span>
                  </div>
                  <p className="text-xs text-[#55504D]">Full VacTrack dose recording terminal with instant vaccine batch safety validation.</p>
                  <div className="pt-2 border-t border-[#EAE7E1] flex items-center justify-between text-xs">
                    <span className="font-medium text-[#6B6560]">PEP Doses 1–5 Available</span>
                    <Link to="/patient/appointments" className="font-bold text-[#E05D3F] hover:underline">Book Visit →</Link>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#EAE7E1] shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#2E2A5E]">KEM Hospital & Research Centre</h4>
                      <p className="text-xs text-[#6B6560] mt-0.5">Rasta Peth, Pune • 4.1 km</p>
                    </div>
                    <span className="px-2 py-0.5 bg-[#EBF7EE] text-[#1B7A3D] text-[10px] font-bold rounded">Connected</span>
                  </div>
                  <p className="text-xs text-[#55504D]">Tertiary care partner hospital supporting cross-clinic dose verification and emergency RIG.</p>
                  <div className="pt-2 border-t border-[#EAE7E1] flex items-center justify-between text-xs">
                    <span className="font-medium text-[#6B6560]">Rabies Immunoglobulin (RIG)</span>
                    <Link to="/patient/appointments" className="font-bold text-[#E05D3F] hover:underline">Book Visit →</Link>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#EAE7E1] shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#2E2A5E]">Sahyadri Speciality Hospital</h4>
                      <p className="text-xs text-[#6B6560] mt-0.5">Deccan Gymkhana, Pune • 3.8 km</p>
                    </div>
                    <span className="px-2 py-0.5 bg-[#EBF7EE] text-[#1B7A3D] text-[10px] font-bold rounded">Connected</span>
                  </div>
                  <p className="text-xs text-[#55504D]">24/7 pediatric and adult immunization clinic with automated dose schedule reminders.</p>
                  <div className="pt-2 border-t border-[#EAE7E1] flex items-center justify-between text-xs">
                    <span className="font-medium text-[#6B6560]">24/7 Pharmacy Stock</span>
                    <Link to="/patient/appointments" className="font-bold text-[#E05D3F] hover:underline">Book Visit →</Link>
                  </div>
                </div>
              </>
            )}

            {activeLocationTab === 'camps' && (
              <>
                <div className="bg-white p-5 rounded-2xl border border-[#EAE7E1] shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#2E2A5E]">Kothrud Community Rabies & TT Camp</h4>
                      <p className="text-xs text-[#6B6560] mt-0.5">Near MIT Circle, Paud Road, Pune</p>
                    </div>
                    <span className="px-2 py-0.5 bg-[#FEF7EC] text-[#D97706] text-[10px] font-bold rounded">Upcoming Drive</span>
                  </div>
                  <p className="text-xs text-[#55504D]">Free community immunization drive providing Tetanus Toxoid and post-exposure triage.</p>
                  <div className="pt-2 border-t border-[#EAE7E1] flex items-center justify-between text-xs">
                    <span className="font-medium text-[#6B6560]">Sunday, 09:00 AM – 02:00 PM</span>
                    <span className="font-bold text-[#1B7A3D]">Free Registration</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#EAE7E1] shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#2E2A5E]">Hadapsar PMC Public Health Centre</h4>
                      <p className="text-xs text-[#6B6560] mt-0.5">Solapur Road, Hadapsar, Pune</p>
                    </div>
                    <span className="px-2 py-0.5 bg-[#EBF7EE] text-[#1B7A3D] text-[10px] font-bold rounded">Active Daily</span>
                  </div>
                  <p className="text-xs text-[#55504D]">Government-supported universal immunization and animal bite treatment center.</p>
                  <div className="pt-2 border-t border-[#EAE7E1] flex items-center justify-between text-xs">
                    <span className="font-medium text-[#6B6560]">Mon–Sat: 08:30 AM – 01:30 PM</span>
                    <span className="font-bold text-[#1B7A3D]">Walk-in Accepted</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#EAE7E1] shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#2E2A5E]">Aundh Ward Immunization Outreach</h4>
                      <p className="text-xs text-[#6B6560] mt-0.5">Aundh District Hospital Campus, Pune</p>
                    </div>
                    <span className="px-2 py-0.5 bg-[#FEF7EC] text-[#D97706] text-[10px] font-bold rounded">Scheduled Drive</span>
                  </div>
                  <p className="text-xs text-[#55504D]">Mobile immunization unit assisting high-risk workers and domestic pet handlers.</p>
                  <div className="pt-2 border-t border-[#EAE7E1] flex items-center justify-between text-xs">
                    <span className="font-medium text-[#6B6560]">Next Drive: Wednesday</span>
                    <span className="font-bold text-[#1B7A3D]">Free Checkup</span>
                  </div>
                </div>
              </>
            )}

            {activeLocationTab === 'emergency' && (
              <>
                <div className="bg-white p-5 rounded-2xl border border-[#EAE7E1] shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#2E2A5E]">Sassoon General Hospital Trauma Unit</h4>
                      <p className="text-xs text-[#6B6560] mt-0.5">Near Pune Railway Station • 24/7</p>
                    </div>
                    <span className="px-2 py-0.5 bg-[#FEF2F2] text-[#B91C1C] text-[10px] font-bold rounded">Trauma & RIG</span>
                  </div>
                  <p className="text-xs text-[#55504D]">Tertiary emergency center with dedicated Category-III animal bite and antivenom triage.</p>
                  <div className="pt-2 border-t border-[#EAE7E1] flex items-center justify-between text-xs">
                    <span className="font-medium text-[#6B6560]">Emergency Helpline: 108</span>
                    <Link to="/patient/emergency" className="font-bold text-[#E05D3F] hover:underline">Get Directions →</Link>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#EAE7E1] shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#2E2A5E]">Poona Hospital Emergency Department</h4>
                      <p className="text-xs text-[#6B6560] mt-0.5">Sadashiv Peth, Pune • 24/7</p>
                    </div>
                    <span className="px-2 py-0.5 bg-[#FEF2F2] text-[#B91C1C] text-[10px] font-bold rounded">24/7 Casualty</span>
                  </div>
                  <p className="text-xs text-[#55504D]">Immediate wound debridement, anti-rabies serum, and tetanus prophylaxis unit.</p>
                  <div className="pt-2 border-t border-[#EAE7E1] flex items-center justify-between text-xs">
                    <span className="font-medium text-[#6B6560]">Casualty Desk: 020-2433-1707</span>
                    <Link to="/patient/emergency" className="font-bold text-[#E05D3F] hover:underline">Get Directions →</Link>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#EAE7E1] shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#2E2A5E]">Ruby Hall Clinic Emergency Triage</h4>
                      <p className="text-xs text-[#6B6560] mt-0.5">Sassoon Road, Pune • 24/7</p>
                    </div>
                    <span className="px-2 py-0.5 bg-[#FEF2F2] text-[#B91C1C] text-[10px] font-bold rounded">24/7 Casualty</span>
                  </div>
                  <p className="text-xs text-[#55504D]">Comprehensive urgent care with polyvalent antivenom inventory and critical care ICU.</p>
                  <div className="pt-2 border-t border-[#EAE7E1] flex items-center justify-between text-xs">
                    <span className="font-medium text-[#6B6560]">Emergency: 020-6645-5100</span>
                    <Link to="/patient/emergency" className="font-bold text-[#E05D3F] hover:underline">Get Directions →</Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Directory Notice */}
          <div className="text-center">
            <p className="text-xs text-[#6B6560]">
              Facility schedules and emergency service rosters are verified with participating Pune healthcare providers.
            </p>
          </div>

        </div>
      </section>

      {/* 4. INTERACTIVE DOSE SCHEDULE SIMULATOR (Preserved) */}
      <section className="py-14 sm:py-16 px-4 sm:px-6 lg:px-10 xl:px-12 bg-white border-b border-[#EAE7E1]">
        <div className="w-full max-w-[1536px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#E05D3F]">Interactive Demonstration</span>
              <h2 className="text-2xl font-bold font-heading text-[#2E2A5E] mt-1">Rabies PEP 5-Dose Strict Protocol</h2>
            </div>
            <p className="text-sm text-[#6B6560] max-w-md">
              Rabies is 100% preventable if vaccinated on time. Click below to inspect how VacTrack enforces exact day-based intervals.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {RABIES_DOSES.map((d, index) => (
              <button
                key={d.day}
                onClick={() => setSelectedDay(index)}
                className={`p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                  selectedDay === index 
                    ? 'bg-[#2E2A5E] text-white border-[#2E2A5E] shadow-sm' 
                    : 'bg-[#F6F4F1] text-[#231F20] border-[#EAE7E1] hover:border-[#E05D3F]/50 hover:bg-white'
                }`}
              >
                <div className={`text-[11px] font-bold uppercase tracking-wider ${selectedDay === index ? 'text-[#F2A93B]' : 'text-[#6B6560]'}`}>
                  Day {d.day}
                </div>
                <div className="font-bold text-sm mt-0.5">Dose {index + 1}</div>
              </button>
            ))}
          </div>

          <div className="bg-[#F6F4F1] p-6 rounded-2xl border border-[#EAE7E1] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <h3 className="text-lg font-bold text-[#2E2A5E]">{RABIES_DOSES[selectedDay].title}</h3>
                <span className="px-2.5 py-0.5 bg-white text-[#E05D3F] border border-[#EAE7E1] text-xs font-bold rounded-full shadow-xs">
                  {RABIES_DOSES[selectedDay].status}
                </span>
              </div>
              <p className="text-[#55504D] text-sm max-w-2xl leading-relaxed">{RABIES_DOSES[selectedDay].desc}</p>
            </div>
            <Link to="/patient/appointments" className="shrink-0 w-full sm:w-auto">
              <Button size="sm" variant="secondary" className="w-full sm:w-auto text-xs font-bold">
                Book Day {RABIES_DOSES[selectedDay].day} Dose →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS SECTION (Preserved) */}
      <HowItWorksSection />

      {/* 6. PLATFORM CAPABILITIES (Preserved) */}
      <section className="py-14 sm:py-16 px-4 sm:px-6 lg:px-10 xl:px-12 bg-white border-b border-[#EAE7E1]">
        <div className="w-full max-w-[1536px] mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-[#2E2A5E] tracking-tight mb-2">Platform Capabilities</h2>
            <p className="text-[#6B6560] text-sm md:text-base">Designed for patients, trusted by clinical staff across Pune</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={<Share2 />} title="Cross-Clinic Sync" desc="Access patient history across different participating clinics seamlessly without paperwork." />
            <FeatureCard icon={<Clock />} title="12-Hour AM/PM Scheduling" desc="Automatic calculation and tracking of upcoming scheduled doses with exact timestamps." />
            <FeatureCard icon={<Bell />} title="Automatic Reminders" desc="Smart SMS and WhatsApp alerts for upcoming, due, and overdue vaccinations." />
            <FeatureCard icon={<ShieldCheck />} title="Batch Verification" desc="Prevents administration of expired, recalled, or counterfeit vaccine batches." />
            <FeatureCard icon={<Network />} title="Tamper-Evident SHA-256" desc="Cryptographic hash chains protect every immunization record with permanent integrity." />
            <FeatureCard icon={<MapPin />} title="Network Access" desc="Patients can visit any clinic in the network without losing progress or starting over." />
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA (Preserved) */}
      <section className="bg-[#2E2A5E] text-white py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-4 tracking-tight">Start Your VacTrack Journey</h2>
          <p className="text-base md:text-lg text-white/80 mb-8 max-w-xl mx-auto leading-relaxed">
            Join the connected healthcare network today and take control of your immunization and emergency health history.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-[#E05D3F] hover:bg-[#c94f33] text-white px-8 py-3.5 text-base font-bold shadow-md">
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-2xl border border-[#EAE7E1] shadow-xs hover:border-[#D9D4CB] hover:shadow-sm transition-all duration-200">
      <div className="w-11 h-11 bg-[#F6F4F1] text-[#2E2A5E] border border-[#EAE7E1] rounded-xl flex items-center justify-center mb-4">
        {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5 text-[#2E2A5E]' })}
      </div>
      <h3 className="text-base font-bold text-[#2E2A5E] mb-2">{title}</h3>
      <p className="text-[#55504D] text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

// ==========================================
// 3. PUBLIC PAGE: ABOUT
// ==========================================
export function About() {
  const language = useAppStore(state => state.language);
  const t = translations[language] || translations.en;
  const MISSION_POINTS = [
    { text: t.whyPoint1, icon: CheckCircle2, color: "text-[#1B7A3D]" },
    { text: t.whyPoint2, icon: ShieldCheck, color: "text-[#1B7A3D]" },
    { text: t.whyPoint3, icon: MapPin, color: "text-[#B91C1C]" },
    { text: "Connect vaccination records", icon: Network, color: "text-[#2E2A5E]" },
    { text: "Help patients move between participating healthcare facilities", icon: Building2, color: "text-[#E05D3F]" },
    { text: "Provide timely reminders", icon: Bell, color: "text-[#D97706]" },
    { text: "Make important health information easier to access", icon: Activity, color: "text-[#2E2A5E]" }
  ];

  return (
    <div className="pt-20 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
      
      {/* 1. OUR VISION HERO */}
      <div className="text-center max-w-4xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F6F4F1] text-[#E05D3F] border border-[#EAE7E1] shadow-xs">
          <Sparkles size={14} className="text-[#F2A93B]" />
          <span>{t.aboutTitle}</span>
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-[#2E2A5E] leading-relaxed max-w-3xl mx-auto">
          {t.aboutSubtitle}
        </h1>

        <div className="w-16 h-1 bg-[#E05D3F] mx-auto rounded-full"></div>
      </div>

      {/* 2. THREE VISUAL PILLARS */}
      <div className="space-y-4">
        <div className="text-center mb-8">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#E05D3F]">Core Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#2E2A5E] mt-1">
            The Three Pillars of VacTrack
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* CONNECT */}
          <div className="bg-white p-7 rounded-3xl border-2 border-[#EAE7E1] shadow-xs hover:border-[#2E2A5E]/40 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#2E2A5E] text-white flex items-center justify-center font-black text-lg mb-5 shadow-sm">
                <Network size={22} />
              </div>
              <span className="text-xs font-mono font-bold text-[#2E2A5E] uppercase tracking-wider">Pillar 01</span>
              <h3 className="text-xl font-extrabold font-heading text-[#2E2A5E] mt-1 mb-2">CONNECT</h3>
              <p className="text-sm text-[#55504D] leading-relaxed">
                Connect patients and healthcare facilities across urban clinics, municipal hospitals, and emergency trauma centers.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#EAE7E1] flex items-center gap-1.5 text-xs font-bold text-[#2E2A5E]">
              <Building2 size={15} />
              <span>Cross-Clinic Protocol</span>
            </div>
          </div>

          {/* PROTECT */}
          <div className="bg-[#2E2A5E] text-white p-7 rounded-3xl border-2 border-[#2E2A5E] shadow-sm hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#E05D3F] text-white flex items-center justify-center font-black text-lg mb-5 shadow-sm">
                <ShieldCheck size={22} />
              </div>
              <span className="text-xs font-mono font-bold text-[#F2A93B] uppercase tracking-wider">Pillar 02</span>
              <h3 className="text-xl font-extrabold font-heading text-white mt-1 mb-2">PROTECT</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Protect the integrity of vaccination records through cryptographic SHA-256 hash chains and CDSCO batch safety validation.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-1.5 text-xs font-bold text-[#F2A93B]">
              <Lock size={15} />
              <span>Tamper-Evident Ledger</span>
            </div>
          </div>

          {/* INFORM */}
          <div className="bg-[#F6F4F1] p-7 rounded-3xl border-2 border-[#EAE7E1] shadow-xs hover:border-[#F2A93B] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F2A93B] text-[#231F20] flex items-center justify-center font-black text-lg mb-5 shadow-sm">
                <Bell size={22} />
              </div>
              <span className="text-xs font-mono font-bold text-[#E05D3F] uppercase tracking-wider">Pillar 03</span>
              <h3 className="text-xl font-extrabold font-heading text-[#2E2A5E] mt-1 mb-2">INFORM</h3>
              <p className="text-sm text-[#55504D] leading-relaxed">
                Give people useful reminders and location-aware health information during routine boosters or medical emergencies.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#EAE7E1] flex items-center gap-1.5 text-xs font-bold text-[#E05D3F]">
              <MapPin size={15} />
              <span>Location-Aware Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. OUR MISSION */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#EAE7E1] shadow-xs space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#E05D3F]">Strategic Framework</span>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#2E2A5E] mt-1">
            Our Mission
          </h2>
          <p className="text-sm text-[#55504D] mt-1">
            VacTrack is built with a singular focus on actionable, life-saving immunization infrastructure:
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {MISSION_POINTS.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div key={idx} className="flex items-start gap-3 p-4 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1] hover:bg-white transition-colors">
                <div className={`p-2 rounded-xl bg-white border border-[#EAE7E1] ${m.color} shrink-0 mt-0.5 shadow-2xs`}>
                  <Icon size={18} />
                </div>
                <span className="text-sm font-semibold text-[#231F20] leading-snug">
                  {m.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. OUR GOAL STATEMENT */}
      <div className="bg-[#2E2A5E] text-white p-8 sm:p-10 rounded-3xl border border-[#2E2A5E] shadow-md relative overflow-hidden text-center space-y-4">
        <span className="text-xs uppercase font-extrabold tracking-widest text-[#F2A93B]">Guiding Principle</span>
        <h2 className="text-2xl sm:text-3xl font-heading font-bold max-w-2xl mx-auto leading-tight">
          Our Goal
        </h2>
        <p className="text-lg sm:text-xl font-semibold text-[#F2A93B] italic max-w-2xl mx-auto">
          &ldquo;Make healthcare information easier to carry, easier to verify, and easier to act on.&rdquo;
        </p>
      </div>

      {/* 5. INDIA-INSPIRED VISUAL STORYTELLING SECTION */}
      <div className="bg-gradient-to-br from-white via-[#F6F4F1] to-[#FFF9F5] p-8 sm:p-12 rounded-3xl border-2 border-[#EAE7E1] space-y-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#EAE7E1] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-[#E05D3F] border border-[#EAE7E1] mb-2 shadow-2xs">
              <Activity size={14} /> Regional Storytelling
            </div>
            <h3 className="text-2xl font-heading font-extrabold text-[#2E2A5E]">
              Bridging Immunization Continuity Across India
            </h3>
            <p className="text-xs text-[#55504D] mt-1">
              From Pune&apos;s urban medical centers to Tier-2 and Tier-3 healthcare nodes.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-center px-4 py-2 bg-white rounded-2xl border border-[#EAE7E1] shadow-2xs">
              <span className="text-base font-extrabold text-[#E05D3F]">100%</span>
              <p className="text-[10px] text-[#6B6560] font-bold">Tamper Evident</p>
            </div>
            <div className="text-center px-4 py-2 bg-white rounded-2xl border border-[#EAE7E1] shadow-2xs">
              <span className="text-base font-extrabold text-[#2E2A5E]">5 Hubs</span>
              <p className="text-[10px] text-[#6B6560] font-bold">Pune Pilot</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-sm text-[#55504D] leading-relaxed">
            <p>
              In India, animal bite exposures and time-sensitive Rabies Post-Exposure Prophylaxis (PEP) protocols demand strict adherence across 28 days. Yet, thousands of citizens lose paper cards or struggle when transferring between emergency trauma centers and local ward clinics.
            </p>
            <p>
              <strong className="text-[#2E2A5E]">VacTrack bridges this gap.</strong> Built with compassion and modern cryptographic rigor, VacTrack ensures that whether a patient receives Day 0 in Shivajinagar and Day 3 in KEM Hospital, their immunization chain remains unbroken, verified, and always accessible on their mobile phone.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#EAE7E1] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE7E1]">
              <span className="text-xs font-bold text-[#2E2A5E]">Pune Metropolitan Healthcare Pilot</span>
              <span className="text-[10px] font-mono text-[#1B7A3D] bg-[#EBF7EE] px-2 py-0.5 rounded font-bold">Active Deployment</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#6B6560]">Participating Emergency Terminals</span>
                <span className="font-bold text-[#2E2A5E]">5 Major Centers</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B6560]">Supported Reminders</span>
                <span className="font-bold text-[#1B7A3D]">WhatsApp & SMS</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B6560]">Batch Verification Speed</span>
                <span className="font-bold text-[#E05D3F]">&lt; 0.4 seconds</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B6560]">Verification Standard</span>
                <span className="font-mono text-[11px] text-[#2E2A5E]">SHA-256 Chain</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

// ==========================================
// 4. PUBLIC PAGE: HOW IT WORKS
// ==========================================
export function HowItWorks() {
  const [testBatch, setTestBatch] = useState('RAB-DEMO-7824');
  const [batchResult, setBatchResult] = useState<{ status: 'valid' | 'expired' | 'recalled', message: string } | null>(null);

  const handleTestBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const code = testBatch.trim().toUpperCase();
    if (code.includes('REC') || code.includes('HAZ')) {
      setBatchResult({ status: 'recalled', message: 'CRITICAL ALERT: Batch flagged for manufacturer cold-chain breach. DO NOT ADMINISTER.' });
    } else if (code.includes('EXP') || code.includes('2024') || code.includes('2023')) {
      setBatchResult({ status: 'expired', message: 'WARNING: Batch expired. System automatically halts injection recording.' });
    } else {
      setBatchResult({ status: 'valid', message: '✓ VERIFIED: Active batch approved by Central Drugs Standard Control Organisation (CDSCO).' });
    }
  };

  return (
    <div className="pt-20 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-14">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#F6F4F1] text-[#E05D3F] border border-[#EAE7E1] mb-3">
          Step-by-Step Architecture
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-[#2E2A5E] tracking-tight mb-3">
          How VacTrack Operates
        </h1>
        <p className="text-base md:text-lg text-[#55504D] leading-relaxed">
          Designed with medical professionals to ensure zero confusion and 100% data integrity.
        </p>
      </div>

      <HowItWorksSection />

      {/* Interactive Batch Checker Simulator */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EAE7E1] shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#EAE7E1] pb-4">
          <div>
            <h3 className="text-lg font-bold text-[#2E2A5E]">Try the Batch Safety Verification Engine</h3>
            <p className="text-xs text-[#6B6560]">Test real-time batch checks against simulated vaccine inventory rosters.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setTestBatch('RAB-DEMO-7824')} className="px-2.5 py-1 bg-[#F6F4F1] text-[#2E2A5E] border border-[#EAE7E1] text-xs font-semibold rounded-lg hover:bg-white cursor-pointer">Valid Batch</button>
            <button onClick={() => setTestBatch('EXP-2024-9901')} className="px-2.5 py-1 bg-[#FEF7EC] text-[#B45309] border border-[#FDE68A] text-xs font-semibold rounded-lg hover:bg-white cursor-pointer">Expired Batch</button>
            <button onClick={() => setTestBatch('REC-HAZ-4001')} className="px-2.5 py-1 bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA] text-xs font-semibold rounded-lg hover:bg-white cursor-pointer">Recalled Batch</button>
          </div>
        </div>

        <form onSubmit={handleTestBatch} className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            value={testBatch} 
            onChange={e => setTestBatch(e.target.value)}
            placeholder="Enter batch number (e.g. RAB-DEMO-7824)"
            className="flex-1 p-3 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl outline-none focus:border-[#E05D3F] font-mono text-sm uppercase"
            required
          />
          <Button type="submit" className="py-3 px-6 font-bold">
            Verify Batch
          </Button>
        </form>

        {batchResult && (
          <div className={`p-4 rounded-xl border text-sm font-semibold flex items-center gap-3 ${
            batchResult.status === 'valid' ? 'bg-[#EBF7EE] text-[#1B7A3D] border-[#C8E6C9]' :
            batchResult.status === 'expired' ? 'bg-[#FEF7EC] text-[#B45309] border-[#FDE68A]' :
            'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]'
          }`}>
            {batchResult.status === 'valid' ? <CheckCircle2 size={18} className="shrink-0" /> : <AlertTriangle size={18} className="shrink-0" />}
            <span>{batchResult.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 5. PUBLIC PAGE: FEATURES
// ==========================================
export function Features() {
  const [activeTab, setActiveTab] = useState<'all' | 'clinic' | 'patient'>('all');

  return (
    <div className="pt-20 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16">
      
      {/* Product Showcase Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F6F4F1] text-[#E05D3F] border border-[#EAE7E1] shadow-xs">
          <Sparkles size={14} className="text-[#F2A93B]" /> Product Capabilities & Architectural Showcase
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-[#2E2A5E] tracking-tight">
          Built for <span className="text-[#E05D3F]">Zero-Failure</span> Immunization
        </h1>
        <p className="text-base md:text-lg text-[#55504D] leading-relaxed">
          Explore the five core technologies powering cross-hospital continuity, real-time batch safety, and automated patient compliance across India.
        </p>

        {/* Tab Filter */}
        <div className="pt-2 flex justify-center gap-2">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all' ? 'bg-[#2E2A5E] text-white shadow-xs' : 'bg-[#F6F4F1] text-[#6B6560] border border-[#EAE7E1] hover:bg-white'
            }`}
          >
            All 5 Core Technologies
          </button>
          <button 
            onClick={() => setActiveTab('clinic')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'clinic' ? 'bg-[#2E2A5E] text-white shadow-xs' : 'bg-[#F6F4F1] text-[#6B6560] border border-[#EAE7E1] hover:bg-white'
            }`}
          >
            Clinical & Safety
          </button>
          <button 
            onClick={() => setActiveTab('patient')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'patient' ? 'bg-[#2E2A5E] text-white shadow-xs' : 'bg-[#F6F4F1] text-[#6B6560] border border-[#EAE7E1] hover:bg-white'
            }`}
          >
            Patient & Mobile Experience
          </button>
        </div>
      </div>

      {/* FEATURE SHOWCASE 1: SHARED RECORDS */}
      {(activeTab === 'all' || activeTab === 'clinic') && (
        <div className="bg-white rounded-3xl border-2 border-[#EAE7E1] p-6 sm:p-10 shadow-xs hover:border-[#2E2A5E]/40 transition-all space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE7E1] pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F6F4F1] text-[#2E2A5E] border border-[#EAE7E1] mb-2">
                <Network size={14} className="text-[#E05D3F]" /> Feature 01
              </div>
              <h2 className="text-2xl font-heading font-extrabold text-[#2E2A5E]">
                1. Shared Records
              </h2>
              <p className="text-xs text-[#55504D] mt-1">
                Seamless patient record mobility between participating clinics, trauma centers, and emergency wards.
              </p>
            </div>
            <span className="px-3 py-1 bg-[#EBF7EE] text-[#1B7A3D] text-xs font-bold rounded-lg border border-[#C8E6C9] self-start md:self-auto">
              ✓ Instant Encrypted Sync
            </span>
          </div>

          {/* REALISTIC UI MOCKUP: SHARED RECORDS FLOW */}
          <div className="bg-[#F6F4F1] p-6 rounded-2xl border border-[#EAE7E1] space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-[#6B6560] px-2">
              <span>Patient Identifier: VT-88201</span>
              <span className="text-[#2E2A5E] font-mono">Regimen: Rabies PEP (5-Dose Protocol)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Hospital A */}
              <div className="bg-white p-5 rounded-xl border border-[#EAE7E1] shadow-2xs space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-extrabold text-[#E05D3F] tracking-wider">Origin Node</span>
                  <span className="w-2 h-2 rounded-full bg-[#1B7A3D]"></span>
                </div>
                <h4 className="font-bold text-sm text-[#2E2A5E]">Hospital A</h4>
                <p className="text-xs font-semibold text-[#55504D]">Sassoon General Hospital, Pune</p>
                <div className="pt-2 border-t border-[#EAE7E1] text-[11px] text-[#6B6560] flex items-center justify-between">
                  <span>Day 0 Administered</span>
                  <span className="font-mono text-[#1B7A3D] font-bold">10:30 AM</span>
                </div>
              </div>

              {/* Sync Arrow Connector */}
              <div className="flex flex-col items-center justify-center py-2 md:py-0 text-center space-y-1">
                <div className="px-3 py-1 bg-[#2E2A5E] text-white text-[11px] font-bold rounded-full shadow-2xs flex items-center gap-1.5">
                  <Share2 size={13} className="text-[#F2A93B]" /> Shared Record
                </div>
                <div className="w-full h-1 bg-[#2E2A5E]/20 relative overflow-hidden rounded-full max-w-[120px]">
                  <div className="w-1/2 h-full bg-[#E05D3F] rounded-full animate-pulse"></div>
                </div>
                <span className="text-[10px] font-mono text-[#6B6560]">Encrypted Transport</span>
              </div>

              {/* Hospital B */}
              <div className="bg-white p-5 rounded-xl border-2 border-[#1B7A3D] shadow-2xs space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-extrabold text-[#1B7A3D] tracking-wider">Receiving Node</span>
                  <span className="w-2 h-2 rounded-full bg-[#1B7A3D] animate-ping"></span>
                </div>
                <h4 className="font-bold text-sm text-[#2E2A5E]">Hospital B</h4>
                <p className="text-xs font-semibold text-[#55504D]">Shivajinagar Emergency Centre</p>
                <div className="pt-2 border-t border-[#EAE7E1] text-[11px] text-[#1B7A3D] font-bold flex items-center justify-between">
                  <span>Ready for Day 3 Booster</span>
                  <span>✓ Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE SHOWCASE 2: DOSE TRACKING */}
      {(activeTab === 'all' || activeTab === 'patient') && (
        <div className="bg-white rounded-3xl border-2 border-[#EAE7E1] p-6 sm:p-10 shadow-xs hover:border-[#2E2A5E]/40 transition-all space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE7E1] pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F6F4F1] text-[#2E2A5E] border border-[#EAE7E1] mb-2">
                <Activity size={14} className="text-[#D97706]" /> Feature 02
              </div>
              <h2 className="text-2xl font-heading font-extrabold text-[#2E2A5E]">
                2. Dose Tracking
              </h2>
              <p className="text-xs text-[#55504D] mt-1">
                Visual regimen status with exact 12-hour AM/PM schedule management and booster countdowns.
              </p>
            </div>
            <div className="px-4 py-1.5 bg-[#FEF7EC] text-[#D97706] text-xs font-extrabold rounded-xl border border-[#FDE68A] self-start md:self-auto flex items-center gap-2">
              <Clock size={14} /> 2 / 5 Doses Completed
            </div>
          </div>

          {/* REALISTIC UI MOCKUP: DOSE TRACKING DASHBOARD */}
          <div className="bg-[#F6F4F1] p-6 rounded-2xl border border-[#EAE7E1] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#EAE7E1]">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#6B6560]">Active Protocol Regimen</span>
                <h4 className="text-sm font-extrabold text-[#2E2A5E]">Post-Exposure Rabies Prophylaxis (Essen Regimen)</h4>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-extrabold text-[#2E2A5E]">40% Completed</span>
                <div className="w-28 h-2.5 bg-[#EAE7E1] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#1B7A3D] to-[#F2A93B]" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>

            {/* Dose Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-[#C8E6C9] bg-[#EBF7EE]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold text-[#1B7A3D]">Dose 1 (Day 0)</span>
                  <CheckCircle size={14} className="text-[#1B7A3D]" />
                </div>
                <p className="text-xs font-bold text-[#2E2A5E]">Administered</p>
                <p className="text-[10px] text-[#6B6560] mt-1">12 Aug • 10:30 AM</p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#C8E6C9] bg-[#EBF7EE]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold text-[#1B7A3D]">Dose 2 (Day 3)</span>
                  <CheckCircle size={14} className="text-[#1B7A3D]" />
                </div>
                <p className="text-xs font-bold text-[#2E2A5E]">Administered</p>
                <p className="text-[10px] text-[#6B6560] mt-1">15 Aug • 02:15 PM</p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border-2 border-[#E05D3F] shadow-xs relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold text-[#E05D3F]">Dose 3 (Day 7)</span>
                  <AlertTriangle size={14} className="text-[#E05D3F]" />
                </div>
                <p className="text-xs font-extrabold text-[#E05D3F]">Due Tomorrow</p>
                <p className="text-[10px] text-[#2E2A5E] font-semibold mt-1">19 Aug • 11:00 AM</p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#EAE7E1] opacity-75">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-[#6B6560]">Dose 4 (Day 14)</span>
                  <Clock size={14} className="text-[#6B6560]" />
                </div>
                <p className="text-xs font-semibold text-[#6B6560]">Upcoming</p>
                <p className="text-[10px] text-[#6B6560] mt-1">26 Aug 2026</p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#EAE7E1] opacity-75">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-[#6B6560]">Dose 5 (Day 28)</span>
                  <Clock size={14} className="text-[#6B6560]" />
                </div>
                <p className="text-xs font-semibold text-[#6B6560]">Upcoming</p>
                <p className="text-[10px] text-[#6B6560] mt-1">09 Sep 2026</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE SHOWCASE 3: SMART REMINDERS */}
      {(activeTab === 'all' || activeTab === 'patient') && (
        <div className="bg-white rounded-3xl border-2 border-[#EAE7E1] p-6 sm:p-10 shadow-xs hover:border-[#2E2A5E]/40 transition-all space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE7E1] pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F6F4F1] text-[#2E2A5E] border border-[#EAE7E1] mb-2">
                <Bell size={14} className="text-[#F2A93B]" /> Feature 03
              </div>
              <h2 className="text-2xl font-heading font-extrabold text-[#2E2A5E]">
                3. Smart Reminders
              </h2>
              <p className="text-xs text-[#55504D] mt-1">
                Automated multi-channel alerts delivered directly to patients via WhatsApp and SMS before booster windows.
              </p>
            </div>
            <span className="px-3 py-1 bg-[#FEF7EC] text-[#D97706] text-xs font-bold rounded-lg border border-[#FDE68A] self-start md:self-auto">
              WhatsApp & SMS Engine
            </span>
          </div>

          {/* REALISTIC UI MOCKUP: SMART REMINDER NOTIFICATION */}
          <div className="bg-[#2E2A5E] text-white p-6 rounded-2xl shadow-sm space-y-4 max-w-2xl mx-auto border border-[#2E2A5E]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E05D3F] text-white flex items-center justify-center font-bold text-xs">
                  VT
                </div>
                <span className="text-xs font-bold text-white">VacTrack Healthcare Alert</span>
                <span className="text-[10px] bg-[#1B7A3D] text-white px-1.5 py-0.2 rounded font-mono">Verified</span>
              </div>
              <span className="text-[10px] text-white/60 font-mono">Now</span>
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-bold text-[#F2A93B]">
                &ldquo;Your next dose is due tomorrow.&rdquo;
              </h4>
              <p className="text-xs text-white/80 leading-relaxed">
                Rabies PEP Dose 3 (Day 7) is scheduled for <strong>tomorrow at 11:00 AM</strong> at <em>Shivajinagar Emergency Centre</em>. Please ensure you present your patient QR code to the attending nurse.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <button className="px-3 py-1.5 bg-[#E05D3F] text-white rounded-lg text-xs font-bold shadow-2xs hover:bg-[#c94d31] cursor-pointer">
                Confirm Appointment
              </button>
              <button className="px-3 py-1.5 bg-white/10 text-white rounded-lg text-xs font-semibold hover:bg-white/20 cursor-pointer">
                Get Hospital Directions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE SHOWCASE 4: BATCH VERIFICATION */}
      {(activeTab === 'all' || activeTab === 'clinic') && (
        <div className="bg-white rounded-3xl border-2 border-[#EAE7E1] p-6 sm:p-10 shadow-xs hover:border-[#2E2A5E]/40 transition-all space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE7E1] pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F6F4F1] text-[#2E2A5E] border border-[#EAE7E1] mb-2">
                <ShieldCheck size={14} className="text-[#1B7A3D]" /> Feature 04
              </div>
              <h2 className="text-2xl font-heading font-extrabold text-[#2E2A5E]">
                4. Batch Verification
              </h2>
              <p className="text-xs text-[#55504D] mt-1">
                Real-time CDSCO cold-chain safety inspection and automated vaccine lot authentication.
              </p>
            </div>
            <span className="px-3 py-1 bg-[#EBF7EE] text-[#1B7A3D] text-xs font-bold rounded-lg border border-[#C8E6C9] self-start md:self-auto">
              ✓ CDSCO Safety Engine
            </span>
          </div>

          {/* REALISTIC UI MOCKUP: BATCH VERIFICATION CARD */}
          <div className="bg-[#F6F4F1] p-6 rounded-2xl border border-[#EAE7E1] max-w-2xl mx-auto space-y-4">
            <div className="flex items-center justify-between border-b border-[#EAE7E1] pb-3">
              <span className="text-xs font-extrabold uppercase text-[#2E2A5E] tracking-wider">Vaccine Lot Inspection</span>
              <span className="text-[11px] font-mono font-bold text-[#1B7A3D] bg-[#EBF7EE] px-2 py-0.5 rounded border border-[#C8E6C9]">
                ✓ Cold-Chain Intact (+3.8°C)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-[#EAE7E1]">
                <span className="text-[10px] font-bold text-[#6B6560] uppercase">Batch Identifier</span>
                <p className="text-sm font-mono font-extrabold text-[#2E2A5E] mt-0.5">RAB-DEMO-7824</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#C8E6C9] bg-[#EBF7EE]">
                <span className="text-[10px] font-bold text-[#1B7A3D] uppercase">Verification Status</span>
                <p className="text-sm font-extrabold text-[#1B7A3D] mt-0.5 flex items-center gap-1">
                  ✓ Verified
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#EAE7E1]">
                <span className="text-[10px] font-bold text-[#6B6560] uppercase">Expiry Date</span>
                <p className="text-sm font-extrabold text-[#2E2A5E] mt-0.5">15 January 2027</p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#EAE7E1] text-xs flex items-center justify-between text-[#55504D]">
              <span>Manufacturer: <strong>Serum Institute of India Pvt. Ltd.</strong></span>
              <span className="font-mono text-[10px] text-[#6B6560]">Recall Roster Clean</span>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE SHOWCASE 5: TAMPER-EVIDENT RECORDS */}
      {(activeTab === 'all' || activeTab === 'clinic') && (
        <div className="bg-white rounded-3xl border-2 border-[#EAE7E1] p-6 sm:p-10 shadow-xs hover:border-[#2E2A5E]/40 transition-all space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE7E1] pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F6F4F1] text-[#2E2A5E] border border-[#EAE7E1] mb-2">
                <Lock size={14} className="text-[#E05D3F]" /> Feature 05
              </div>
              <h2 className="text-2xl font-heading font-extrabold text-[#2E2A5E]">
                5. Tamper-Evident Records
              </h2>
              <p className="text-xs text-[#55504D] mt-1">
                Cryptographic SHA-256 hash chains linking every dose entry to create an immutable, lifetime audit record.
              </p>
            </div>
            <span className="px-3 py-1 bg-[#EBF7EE] text-[#1B7A3D] text-xs font-bold rounded-lg border border-[#C8E6C9] self-start md:self-auto">
              ✓ Integrity Verified
            </span>
          </div>

          {/* REALISTIC UI MOCKUP: CRYPTOGRAPHIC RECORD CHAIN */}
          <div className="bg-[#F6F4F1] p-6 rounded-2xl border border-[#EAE7E1] space-y-5">
            <div className="flex items-center justify-between text-xs font-bold text-[#2E2A5E]">
              <span>SHA-256 Cryptographic Audit Trail</span>
              <span className="text-[#1B7A3D] bg-[#EBF7EE] px-2.5 py-0.5 rounded-full border border-[#C8E6C9]">
                ✓ Integrity Verified
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Record 01 */}
              <div className="bg-white p-4 rounded-xl border border-[#EAE7E1] shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-[#E05D3F] uppercase">Record 01</span>
                  <span className="text-[10px] font-mono text-[#1B7A3D]">Day 0</span>
                </div>
                <p className="text-xs font-bold text-[#2E2A5E]">Initial Exposure Dose</p>
                <p className="text-[10px] font-mono text-[#6B6560] bg-[#F6F4F1] p-1.5 rounded truncate">
                  Hash: 0x9f3a...d10e
                </p>
              </div>

              {/* Record 02 */}
              <div className="bg-white p-4 rounded-xl border border-[#EAE7E1] shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-[#E05D3F] uppercase">Record 02</span>
                  <span className="text-[10px] font-mono text-[#1B7A3D]">Day 3</span>
                </div>
                <p className="text-xs font-bold text-[#2E2A5E]">Follow-up Booster</p>
                <p className="text-[10px] font-mono text-[#6B6560] bg-[#F6F4F1] p-1.5 rounded truncate">
                  Hash: 0xc4b1...88a2
                </p>
              </div>

              {/* Record 03 */}
              <div className="bg-white p-4 rounded-xl border-2 border-[#1B7A3D] shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-[#1B7A3D] uppercase">Record 03</span>
                  <span className="text-[10px] font-mono text-[#1B7A3D]">Day 7</span>
                </div>
                <p className="text-xs font-bold text-[#2E2A5E]">Current Active Dose</p>
                <p className="text-[10px] font-mono text-[#1B7A3D] bg-[#EBF7EE] p-1.5 rounded truncate font-bold">
                  Hash: 0x2e8f...90b4
                </p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#EAE7E1] text-center text-xs text-[#55504D]">
              <strong className="text-[#2E2A5E]">Status: ✓ Integrity Verified</strong> — Zero broken hashes detected in cryptographic ledger.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ==========================================
// 6. PUBLIC PAGE: FOR PATIENTS
// ==========================================
export function ForPatients() {
  const [isEligibilityWizardOpen, setIsEligibilityWizardOpen] = useState(false);

  return (
    <div className="pt-20 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-14">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#F6F4F1] text-[#E05D3F] border border-[#EAE7E1] mb-3">
          For Individuals & Families
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-[#2E2A5E] tracking-tight mb-3">
          Your Health Record, <span className="text-[#E05D3F]">Always With You</span>
        </h1>
        <p className="text-base md:text-lg text-[#55504D] leading-relaxed">
          Say goodbye to lost paper cards and forgotten booster dates. VacTrack puts verified immunization certificates, allergy safeguards, and emergency locators right on your smartphone.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EAE7E1] shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-11 h-11 rounded-xl bg-[#F6F4F1] text-[#2E2A5E] border border-[#EAE7E1] flex items-center justify-center font-bold mb-4">
              <Calendar size={20} />
            </div>
            <h3 className="text-lg font-bold text-[#2E2A5E] mb-2">Never Miss a Critical Booster</h3>
            <p className="text-[#55504D] text-sm leading-relaxed mb-6">
              Rabies, tetanus, Hepatitis B, and childhood vaccines require precise time intervals. VacTrack calculates exact dates and sends automated alerts so you remain protected.
            </p>
          </div>
          <Link to="/signup" className="text-[#E05D3F] font-bold text-sm hover:underline inline-flex items-center gap-1">
            Register Free Patient Account →
          </Link>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EAE7E1] shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-11 h-11 rounded-xl bg-[#F6F4F1] text-[#B91C1C] border border-[#EAE7E1] flex items-center justify-center font-bold mb-4">
              <HeartPulse size={20} />
            </div>
            <h3 className="text-lg font-bold text-[#2E2A5E] mb-2">Emergency Care & Antivenom in Pune</h3>
            <p className="text-[#55504D] text-sm leading-relaxed mb-6">
              If an emergency or bite occurs late at night, quickly locate hospitals across Pune stocked with 24/7 rabies immunoglobulin, snakebite antivenom, and ICU trauma support.
            </p>
          </div>
          <Link to="/patient/emergency" className="text-[#E05D3F] font-bold text-sm hover:underline inline-flex items-center gap-1">
            Explore Emergency Care Finder →
          </Link>
        </div>
      </div>

      {/* Interactive Government Schemes Section */}
      <div id="schemes" className="pt-2 scroll-mt-28">
        <GovernmentSchemesDiscovery 
          onOpenEligibilityWizard={() => setIsEligibilityWizardOpen(true)} 
        />
      </div>

      {/* Patient Steps */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EAE7E1] shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-[#2E2A5E]">How a Patient Uses VacTrack</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 bg-[#F6F4F1] rounded-xl border border-[#EAE7E1]">
            <span className="text-[11px] font-extrabold text-[#E05D3F] uppercase">Step 1</span>
            <h4 className="font-bold text-[#2E2A5E] text-sm mt-1 mb-1">Get First Dose</h4>
            <p className="text-xs text-[#55504D] leading-relaxed">Visit any clinic; staff records your dose and creates your verified profile linked to your phone number.</p>
          </div>
          <div className="p-4 bg-[#F6F4F1] rounded-xl border border-[#EAE7E1]">
            <span className="text-[11px] font-extrabold text-[#E05D3F] uppercase">Step 2</span>
            <h4 className="font-bold text-[#2E2A5E] text-sm mt-1 mb-1">Receive Smart Reminders</h4>
            <p className="text-xs text-[#55504D] leading-relaxed">Get timely SMS & WhatsApp alerts with exact 12-hour AM/PM timeslots when your next booster is due.</p>
          </div>
          <div className="p-4 bg-[#F6F4F1] rounded-xl border border-[#EAE7E1]">
            <span className="text-[11px] font-extrabold text-[#E05D3F] uppercase">Step 3</span>
            <h4 className="font-bold text-[#2E2A5E] text-sm mt-1 mb-1">Instant QR Proof</h4>
            <p className="text-xs text-[#55504D] leading-relaxed">Present your tamper-evident QR code to doctors or travel authorities for cryptographic verification.</p>
          </div>
        </div>
      </div>

      {/* Optional Financial Protection Section */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EAE7E1] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#8A847F]">
            <Shield size={13} className="text-[#E05D3F]" /> Optional • Independent Insurance Offers
          </div>
          <h3 className="text-xl font-bold text-[#2E2A5E]">
            Protect What Matters
          </h3>
          <p className="text-xs sm:text-sm text-[#55504D] max-w-xl leading-relaxed">
            Explore life insurance and financial protection options that may help you and your family prepare for the future.
          </p>
        </div>
        <Link to="/patient/insurance" className="shrink-0">
          <Button className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold rounded-xl bg-[#E05D3F] hover:bg-[#c94f33] text-white shadow-xs">
            Explore Insurance Plans →
          </Button>
        </Link>
      </div>

      {/* Eligibility Wizard Modal */}
      <SchemeEligibilityWizard
        isOpen={isEligibilityWizardOpen}
        onClose={() => setIsEligibilityWizardOpen(false)}
      />
    </div>
  );
}

// ==========================================
// 7. PUBLIC PAGE: FOR HOSPITALS
// ==========================================
export function ForHospitals() {
  const [partnerSubmitted, setPartnerSubmitted] = useState(false);
  const [activeDemoTab, setActiveDemoTab] = useState<'search' | 'record' | 'batch' | 'alerts' | 'appointments' | 'shared'>('search');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPartnerSubmitted(true);
  };

  const HOSPITAL_SERVICES = [
    "Vaccination",
    "Rabies PEP",
    "Animal Bite Care",
    "Emergency Department",
    "Snakebite Emergency Care",
    "Antivenom Availability",
    "24/7 Emergency — Demo"
  ];

  return (
    <div className="pt-20 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#2E2A5E] text-white shadow-xs">
          <Building2 size={14} className="text-[#F2A93B]" /> Hospital Network Infrastructure
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-[#2E2A5E] tracking-tight">
          Connect Your Hospital to <span className="text-[#E05D3F]">Smarter Vaccination Records</span>
        </h1>
        
        <p className="text-base md:text-lg text-[#55504D] leading-relaxed max-w-2xl mx-auto">
          Empower your medical teams to record doses in seconds, verify batch cold-chain integrity, eliminate paper cards, and access cross-hospital patient histories instantly.
        </p>
      </div>

      {/* 6 Core Hospital Capabilities */}
      <div className="space-y-6">
        <div className="text-center">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#E05D3F]">Core Clinical Suite</span>
          <h2 className="text-2xl font-heading font-extrabold text-[#2E2A5E] mt-1">
            Six Hospital Operations Modules
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. Patient Search */}
          <div className="bg-white p-6 rounded-2xl border-2 border-[#EAE7E1] shadow-xs hover:border-[#2E2A5E]/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#2E2A5E] text-white flex items-center justify-center font-bold">
              <User size={20} />
            </div>
            <h3 className="text-base font-extrabold text-[#2E2A5E]">Patient Search</h3>
            <p className="text-xs text-[#55504D] leading-relaxed">
              Instantly locate patient profiles by verified mobile number or QR scan across participating hospitals.
            </p>
          </div>

          {/* 2. Dose Recording */}
          <div className="bg-white p-6 rounded-2xl border-2 border-[#EAE7E1] shadow-xs hover:border-[#2E2A5E]/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#E05D3F] text-white flex items-center justify-center font-bold">
              <Syringe size={20} />
            </div>
            <h3 className="text-base font-extrabold text-[#2E2A5E]">Dose Recording</h3>
            <p className="text-xs text-[#55504D] leading-relaxed">
              Log administered vaccines with precise 12-hour AM/PM timestamps, lot numbers, and attending doctor ID.
            </p>
          </div>

          {/* 3. Batch Verification */}
          <div className="bg-white p-6 rounded-2xl border-2 border-[#EAE7E1] shadow-xs hover:border-[#2E2A5E]/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1B7A3D] text-white flex items-center justify-center font-bold">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-base font-extrabold text-[#2E2A5E]">Batch Verification</h3>
            <p className="text-xs text-[#55504D] leading-relaxed">
              Automated CDSCO safety checks validate expiry dates and cold-chain recall rosters before injection.
            </p>
          </div>

          {/* 4. Missed Dose Alerts */}
          <div className="bg-white p-6 rounded-2xl border-2 border-[#EAE7E1] shadow-xs hover:border-[#2E2A5E]/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#D97706] text-white flex items-center justify-center font-bold">
              <Bell size={20} />
            </div>
            <h3 className="text-base font-extrabold text-[#2E2A5E]">Missed Dose Alerts</h3>
            <p className="text-xs text-[#55504D] leading-relaxed">
              Flag overdue patients automatically and trigger multi-channel SMS and WhatsApp compliance follow-ups.
            </p>
          </div>

          {/* 5. Appointments */}
          <div className="bg-white p-6 rounded-2xl border-2 border-[#EAE7E1] shadow-xs hover:border-[#2E2A5E]/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#2E2A5E] text-white flex items-center justify-center font-bold">
              <Calendar size={20} />
            </div>
            <h3 className="text-base font-extrabold text-[#2E2A5E]">Appointments</h3>
            <p className="text-xs text-[#55504D] leading-relaxed">
              Allocate daily booster slots and manage OPD emergency bite walk-in queues effortlessly.
            </p>
          </div>

          {/* 6. Shared Records */}
          <div className="bg-white p-6 rounded-2xl border-2 border-[#EAE7E1] shadow-xs hover:border-[#2E2A5E]/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F2A93B] text-[#231F20] flex items-center justify-center font-bold">
              <Network size={20} />
            </div>
            <h3 className="text-base font-extrabold text-[#2E2A5E]">Shared Records</h3>
            <p className="text-xs text-[#55504D] leading-relaxed">
              Synchronize immunization history seamlessly across regional hospital trauma units and ward centers.
            </p>
          </div>
        </div>
      </div>

      {/* PROFESSIONAL HOSPITAL DASHBOARD PREVIEW */}
      <div className="bg-white rounded-3xl border-2 border-[#EAE7E1] shadow-md overflow-hidden">
        
        {/* Hospital Header Bar */}
        <div className="bg-[#2E2A5E] text-white p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-[#E05D3F] text-white text-[10px] font-bold uppercase tracking-wider">
                  DEMO HOSPITAL DASHBOARD
                </span>
                <span className="text-[10px] text-[#F2A93B] font-mono font-bold bg-white/10 px-2 py-0.5 rounded">
                  [DEMO DATA - Fictional Demonstration Record]
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-extrabold mt-1.5 text-white">
                Shivajinagar Emergency Medical Centre
              </h2>
            </div>

            <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-white/70 block">Hospital Node ID</span>
              <span className="text-sm font-mono font-bold text-[#F2A93B]">HOSP-DEMO-001</span>
            </div>
          </div>

          {/* Hospital Services Badges */}
          <div>
            <span className="text-[11px] font-bold uppercase text-white/70 block mb-2">Hospital Services & Emergency Capabilities:</span>
            <div className="flex flex-wrap gap-2">
              {HOSPITAL_SERVICES.map((s, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-white/15 text-white text-xs font-semibold rounded-lg border border-white/10 shadow-2xs">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="bg-[#F6F4F1] p-3 border-b border-[#EAE7E1] flex flex-wrap gap-2 overflow-x-auto">
          <button 
            onClick={() => setActiveDemoTab('search')} 
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeDemoTab === 'search' ? 'bg-[#2E2A5E] text-white shadow-xs' : 'bg-white text-[#55504D] hover:bg-white/80'
            }`}
          >
            🔍 Patient Search
          </button>
          <button 
            onClick={() => setActiveDemoTab('record')} 
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeDemoTab === 'record' ? 'bg-[#2E2A5E] text-white shadow-xs' : 'bg-white text-[#55504D] hover:bg-white/80'
            }`}
          >
            💉 Dose Recording
          </button>
          <button 
            onClick={() => setActiveDemoTab('batch')} 
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeDemoTab === 'batch' ? 'bg-[#2E2A5E] text-white shadow-xs' : 'bg-white text-[#55504D] hover:bg-white/80'
            }`}
          >
            🛡️ Batch Verification
          </button>
          <button 
            onClick={() => setActiveDemoTab('alerts')} 
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeDemoTab === 'alerts' ? 'bg-[#2E2A5E] text-white shadow-xs' : 'bg-white text-[#55504D] hover:bg-white/80'
            }`}
          >
            🔔 Missed Dose Alerts
          </button>
          <button 
            onClick={() => setActiveDemoTab('appointments')} 
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeDemoTab === 'appointments' ? 'bg-[#2E2A5E] text-white shadow-xs' : 'bg-white text-[#55504D] hover:bg-white/80'
            }`}
          >
            📅 Appointments
          </button>
          <button 
            onClick={() => setActiveDemoTab('shared')} 
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeDemoTab === 'shared' ? 'bg-[#2E2A5E] text-white shadow-xs' : 'bg-white text-[#55504D] hover:bg-white/80'
            }`}
          >
            🌐 Shared Records
          </button>
        </div>

        {/* Dashboard Dynamic Interactive Preview Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {activeDemoTab === 'search' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE7E1] pb-3">
                <h3 className="font-bold text-[#2E2A5E] text-sm">Hospital Patient Directory Search</h3>
                <span className="text-[10px] font-mono bg-[#EBF7EE] text-[#1B7A3D] px-2 py-0.5 rounded font-bold">
                  Demo Query: +91 98230 11204
                </span>
              </div>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  readOnly 
                  value="+91 98230 11204 (Aarav Sharma)" 
                  className="flex-1 p-3 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-xs font-semibold text-[#2E2A5E]" 
                />
                <button className="px-4 py-3 bg-[#E05D3F] text-white rounded-xl text-xs font-bold cursor-pointer">
                  Search Record
                </button>
              </div>

              <div className="bg-[#F6F4F1] p-4 rounded-xl border border-[#EAE7E1] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#6B6560] uppercase">Patient Record Match</span>
                    <h4 className="font-extrabold text-sm text-[#2E2A5E]">Aarav Sharma (Male, 34 Yrs)</h4>
                  </div>
                  <span className="px-2.5 py-1 bg-[#FEF7EC] text-[#D97706] text-xs font-bold rounded-lg border border-[#FDE68A]">
                    Dose 3 Due Today
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-[#55504D]">
                  <p>Regimen: <strong>Rabies PEP</strong></p>
                  <p>Blood Group: <strong>O+ Positive</strong></p>
                  <p>Allergies: <strong>Penicillin</strong></p>
                  <p>Emergency: <strong>+91 98220 99001</strong></p>
                </div>
              </div>
            </div>
          )}

          {activeDemoTab === 'record' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE7E1] pb-3">
                <h3 className="font-bold text-[#2E2A5E] text-sm">Record Vaccine Administration</h3>
                <span className="text-[10px] font-mono bg-[#FEF7EC] text-[#D97706] px-2 py-0.5 rounded font-bold">
                  12-Hour AM/PM Timestamping Active
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-[#F6F4F1] rounded-xl border border-[#EAE7E1]">
                  <span className="text-[10px] text-[#6B6560] font-bold block uppercase">Administering Hospital</span>
                  <strong className="text-[#2E2A5E] text-sm">Shivajinagar Emergency (HOSP-DEMO-001)</strong>
                </div>
                <div className="p-3 bg-[#F6F4F1] rounded-xl border border-[#EAE7E1]">
                  <span className="text-[10px] text-[#6B6560] font-bold block uppercase">Attending Doctor</span>
                  <strong className="text-[#2E2A5E] text-sm">Dr. Sneha Kulkarni (MD Emergency)</strong>
                </div>
                <div className="p-3 bg-[#F6F4F1] rounded-xl border border-[#EAE7E1]">
                  <span className="text-[10px] text-[#6B6560] font-bold block uppercase">Vaccine Batch ID</span>
                  <strong className="text-[#2E2A5E] font-mono text-sm">RAB-DEMO-7824 (Verified)</strong>
                </div>
                <div className="p-3 bg-[#EBF7EE] rounded-xl border border-[#C8E6C9]">
                  <span className="text-[10px] text-[#1B7A3D] font-bold block uppercase">Timestamp Logged</span>
                  <strong className="text-[#1B7A3D] text-sm">19 Aug 2026 • 11:00 AM IST</strong>
                </div>
              </div>
            </div>
          )}

          {activeDemoTab === 'batch' && (
            <div className="p-5 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2E2A5E]">CDSCO Real-Time Lot Verification</span>
                <span className="text-xs font-bold text-[#1B7A3D] bg-[#EBF7EE] px-2 py-0.5 rounded border border-[#C8E6C9]">
                  ✓ Verified Batch
                </span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#EAE7E1] space-y-2 text-xs">
                <p>Batch Identifier: <strong className="font-mono text-[#2E2A5E]">RAB-DEMO-7824</strong></p>
                <p>Expiry Date: <strong>15 January 2027</strong></p>
                <p>Manufacturer: <strong>Serum Institute of India Pvt. Ltd.</strong></p>
                <p>Cold-Chain Status: <span className="text-[#1B7A3D] font-bold">Optimal (+3.8°C Monitored)</span></p>
              </div>
            </div>
          )}

          {activeDemoTab === 'alerts' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#2E2A5E] uppercase tracking-wider">Automated Overdue Patient Alerts</h4>
              <div className="p-3 bg-[#FEF2F2] rounded-xl border border-[#FECACA] flex items-center justify-between text-xs text-[#991B1B]">
                <div>
                  <strong>Patient: Rahul Patil (VT-77102)</strong>
                  <p className="text-[11px] text-[#7F1D1D] mt-0.5">Dose 4 Rabies PEP Overdue by 1 Day</p>
                </div>
                <button className="px-3 py-1 bg-[#B91C1C] text-white text-[11px] font-bold rounded-lg cursor-pointer">
                  Dispatch WhatsApp Alert
                </button>
              </div>
            </div>
          )}

          {activeDemoTab === 'appointments' && (
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-[#2E2A5E] uppercase tracking-wider">Today&apos;s OPD Vaccination Appointments</h4>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#F6F4F1] rounded-xl border border-[#EAE7E1]">
                  <span className="text-[10px] font-mono text-[#1B7A3D] font-bold">10:00 AM</span>
                  <p className="font-bold text-[#2E2A5E] mt-1">Priya Nair (Dose 1)</p>
                  <span className="text-[10px] text-[#6B6560]">Completed ✓</span>
                </div>
                <div className="p-3 bg-white rounded-xl border-2 border-[#E05D3F]">
                  <span className="text-[10px] font-mono text-[#E05D3F] font-bold">11:00 AM</span>
                  <p className="font-bold text-[#2E2A5E] mt-1">Aarav Sharma (Dose 3)</p>
                  <span className="text-[10px] text-[#E05D3F] font-bold">In OPD Waiting Room</span>
                </div>
                <div className="p-3 bg-[#F6F4F1] rounded-xl border border-[#EAE7E1]">
                  <span className="text-[10px] font-mono text-[#6B6560] font-bold">02:30 PM</span>
                  <p className="font-bold text-[#2E2A5E] mt-1">Vikram Joshi (Dose 2)</p>
                  <span className="text-[10px] text-[#6B6560]">Scheduled</span>
                </div>
              </div>
            </div>
          )}

          {activeDemoTab === 'shared' && (
            <div className="p-4 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1] space-y-2 text-xs">
              <span className="font-bold text-[#2E2A5E] block">Hospital Network Sync Ledger</span>
              <p className="text-[#55504D]">
                Synchronized with <strong>Sassoon General Hospital</strong> &amp; <strong>KEM Hospital Pune</strong>.
              </p>
              <div className="p-3 bg-white rounded-xl border border-[#EAE7E1] font-mono text-[11px] text-[#1B7A3D]">
                ✓ Patient VT-88201 history synced securely from Sassoon General Hospital (Day 0) to Shivajinagar Emergency Centre (Day 3).
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Hospital Onboarding Form */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#EAE7E1] shadow-xs space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#E05D3F]">Hospital Activation</span>
          <h2 className="text-2xl font-heading font-extrabold text-[#2E2A5E] mt-1">
            Request Hospital Network Onboarding
          </h2>
          <p className="text-xs text-[#6B6560] mt-1">
            Join participating hospitals in Pune including Sassoon General Hospital, Shivajinagar Emergency Medical Centre, and KEM Hospital.
          </p>
        </div>

        {partnerSubmitted ? (
          <div className="p-5 bg-[#EBF7EE] text-[#1B7A3D] rounded-2xl border border-[#C8E6C9] text-sm font-semibold">
            ✓ Application Received! Our healthcare onboarding team will contact your hospital administration within 24 hours to provision your facility&apos;s node.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2E2A5E] uppercase mb-1">Hospital Name</label>
              <input type="text" required placeholder="e.g. Aundh Hospital Centre" className="w-full p-3 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-sm outline-none focus:border-[#E05D3F]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#2E2A5E] uppercase mb-1">City / Region</label>
              <input type="text" required defaultValue="Pune, Maharashtra" className="w-full p-3 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-sm outline-none focus:border-[#E05D3F]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#2E2A5E] uppercase mb-1">Medical Director / Admin Contact</label>
              <input type="text" required placeholder="Dr. Name or Hospital Admin" className="w-full p-3 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-sm outline-none focus:border-[#E05D3F]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#2E2A5E] uppercase mb-1">Official Email / Phone</label>
              <input type="email" required placeholder="contact@hospital.org" className="w-full p-3 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-sm outline-none focus:border-[#E05D3F]" />
            </div>
            <div className="sm:col-span-2 pt-2">
              <Button type="submit" className="w-full py-3.5 rounded-xl font-bold">
                Submit Hospital Onboarding Request
              </Button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
}

export const ForClinics = ForHospitals;

// ==========================================
// 8. PUBLIC PAGE: CONTACT
// ==========================================
export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-20 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-[#2E2A5E] tracking-tight mb-2">
          Get in Touch
        </h1>
        <p className="text-base text-[#55504D]">
          Have questions regarding clinic integration, emergency care protocols, or technical security? We are here to support.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EAE7E1] shadow-xs space-y-5">
          <h3 className="text-lg font-bold text-[#2E2A5E]">Pune Regional Support</h3>
          
          <div className="space-y-4 text-sm text-[#55504D]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F6F4F1] text-[#2E2A5E] border border-[#EAE7E1] flex items-center justify-center shrink-0">
                <MapPin size={16} />
              </div>
              <div>
                <p className="font-bold text-[#2E2A5E]">Regional Coordination Hub</p>
                <p className="text-xs">Shivajinagar Healthcare Corridor, Pune, Maharashtra 411005</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA] flex items-center justify-center shrink-0">
                <Phone size={16} />
              </div>
              <div>
                <p className="font-bold text-[#2E2A5E]">24/7 Rabies & Emergency Care Helpline</p>
                <p className="font-mono text-[#B91C1C] font-bold text-xs">+91 20 2553 2000 / 108</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#EBF7EE] text-[#1B7A3D] border border-[#C8E6C9] flex items-center justify-center shrink-0">
                <Mail size={16} />
              </div>
              <div>
                <p className="font-bold text-[#2E2A5E]">Hospital Onboarding & Integrations</p>
                <p className="font-mono text-xs">support@vactrack.health</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EAE7E1] shadow-xs">
          {submitted ? (
            <div className="p-6 text-center space-y-2">
              <CheckCircle2 size={40} className="text-[#1B7A3D] mx-auto" />
              <h4 className="text-lg font-bold text-[#2E2A5E]">Message Delivered</h4>
              <p className="text-xs text-[#55504D]">Thank you for reaching out. A healthcare representative will respond within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#2E2A5E] uppercase mb-1">Your Name</label>
                <input type="text" required placeholder="Full Name" className="w-full p-2.5 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-sm outline-none focus:border-[#E05D3F]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#2E2A5E] uppercase mb-1">Email / Phone</label>
                <input type="text" required placeholder="name@email.com or +91..." className="w-full p-2.5 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-sm outline-none focus:border-[#E05D3F]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#2E2A5E] uppercase mb-1">Message / Inquiry</label>
                <textarea required rows={3} placeholder="How can we assist you?" className="w-full p-2.5 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-sm outline-none focus:border-[#E05D3F]"></textarea>
              </div>
              <Button type="submit" className="w-full py-3 rounded-xl font-bold">
                Send Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 9. PUBLIC PAGE: FAQ
// ==========================================
export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const FAQS = [
    {
      q: "What is VacTrack and how does it protect patients?",
      a: "VacTrack is a decentralized, tamper-evident digital immunization platform. It connects clinics across Pune to track multi-dose schedules (such as Rabies PEP, Tetanus, and infant vaccines), verify vaccine batch safety, and provide patient-controlled emergency medical records."
    },
    {
      q: "Does VacTrack require blockchain or special hardware?",
      a: "No special hardware is required. VacTrack utilizes cryptographic SHA-256 hash chains that run directly on standard web and mobile browsers. Every dose block mathematically links to previous doses, creating an immutable audit trail without expensive infrastructure."
    },
    {
      q: "Can I receive my rabies dose at Clinic A and the next dose at Clinic B?",
      a: "Yes! That is one of VacTrack's primary capabilities. When you visit any partnered hospital in Pune, clinic staff can pull up your verified dose history using your phone number, record your new dose, and update your tamper-evident hash chain."
    },
    {
      q: "What happens if a clinic tries to administer an expired or recalled vaccine?",
      a: "VacTrack features an automated Batch Safety Guard. When staff inputs the batch number, the system verifies it against active recall and expiration registries. Expired or recalled vials are immediately flagged and blocked from administration."
    },
    {
      q: "How does the Emergency Care Finder work?",
      a: "The Emergency Care Finder maps verified 24/7 hospitals in Pune stocked with Rabies Immunoglobulin (RIG), Snakebite Antivenom, and emergency trauma surgical units with live contact phone numbers and directions."
    },
    {
      q: "How is patient privacy protected?",
      a: "Patient records are encrypted and protected by granular privacy toggles. You choose whether to share allergy alerts, blood group, or past medical history when presenting your emergency QR code."
    }
  ];

  return (
    <div className="pt-20 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-[#2E2A5E] tracking-tight mb-2">
          Frequently Asked Questions
        </h1>
        <p className="text-base text-[#55504D]">
          Everything you need to know about VacTrack's cryptographic integrity, clinic network, and emergency services.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="bg-white rounded-xl border border-[#EAE7E1] shadow-xs overflow-hidden transition-all">
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-5 text-left flex justify-between items-center gap-4 hover:bg-[#F6F4F1]/50 cursor-pointer"
              >
                <span className="font-bold text-sm sm:text-base text-[#2E2A5E]">{faq.q}</span>
                {isOpen ? <ChevronUp size={18} className="text-[#6B6560] shrink-0" /> : <ChevronDown size={18} className="text-[#6B6560] shrink-0" />}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-sm text-[#55504D] leading-relaxed border-t border-[#EAE7E1] pt-3 bg-white">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 10. PUBLIC PAGES: PRIVACY & TERMS
// ==========================================
export function Privacy() {
  return (
    <div className="pt-20 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#2E2A5E] tracking-tight">Privacy Policy</h1>
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EAE7E1] shadow-xs space-y-3 text-[#55504D] text-sm leading-relaxed">
        <p>VacTrack adheres strictly to digital healthcare data protection principles and patient confidentiality standards.</p>
        <p>Personal health records and vaccination histories are encrypted. Information is only accessed by authorized clinical personnel during active consultation or emergency triage with explicit patient authorization.</p>
      </div>
    </div>
  );
}

export function Terms() {
  return (
    <div className="pt-20 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#2E2A5E] tracking-tight">Terms of Service</h1>
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EAE7E1] shadow-xs space-y-3 text-[#55504D] text-sm leading-relaxed">
        <p>By using the VacTrack network, patients and healthcare providers agree to record accurate vaccination details.</p>
        <p>Cryptographic hash verification ensures record permanence and aids in anti-counterfeit vaccine validation across all participating institutions.</p>
      </div>
    </div>
  );
}
