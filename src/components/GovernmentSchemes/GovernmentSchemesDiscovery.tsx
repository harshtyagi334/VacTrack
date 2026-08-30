import React, { useState } from 'react';
import { 
  Building2, ShieldCheck, HeartPulse, Search, Sparkles, 
  ArrowRight, Phone, CheckCircle2, FileText, Hospital, 
  ExternalLink, Users, AlertCircle, HelpCircle, ChevronRight,
  Landmark, Info, Check, Filter
} from 'lucide-react';
import { Button } from '../ui/Button';
import { 
  GOVERNMENT_SCHEMES_DATA, 
  GovernmentScheme, 
  REQUIRED_DOCUMENTS_GUIDE 
} from '../../data/governmentSchemesData';
import { SchemeDidYouKnowCarousel } from './SchemeDidYouKnowCarousel';
import { SchemeDetailModal } from './SchemeDetailModal';
import { EmpanelledHospitalsModal } from './EmpanelledHospitalsModal';

interface GovernmentSchemesDiscoveryProps {
  onOpenEligibilityWizard: () => void;
}

export function GovernmentSchemesDiscovery({ onOpenEligibilityWizard }: GovernmentSchemesDiscoveryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSchemeForModal, setSelectedSchemeForModal] = useState<GovernmentScheme | null>(null);
  const [isHospitalModalOpen, setIsHospitalModalOpen] = useState(false);

  // Filter schemes
  const filteredSchemes = GOVERNMENT_SCHEMES_DATA.filter(scheme => {
    const matchesCategory = 
      selectedCategory === 'all' ||
      (selectedCategory === 'cashless_5l' && (scheme.id === 'ab-pmjay' || scheme.id === 'mjpjay-maharashtra')) ||
      (selectedCategory === 'seniors' && scheme.category === 'seniors') ||
      (selectedCategory === 'emergency_pep' && scheme.category === 'emergency_vaccine') ||
      (selectedCategory === 'mother_child' && scheme.category === 'mother_child') ||
      (selectedCategory === 'critical' && scheme.category === 'critical_grant') ||
      (selectedCategory === 'pharmacy' && scheme.category === 'pharmacy');

    const matchesSearch = 
      scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.coverageAmount.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleSelectSchemeFromCarousel = (schemeId: string) => {
    const target = GOVERNMENT_SCHEMES_DATA.find(s => s.id === schemeId);
    if (target) {
      setSelectedSchemeForModal(target);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. PUBLIC BENEFIT HERO SECTION */}
      <section className="bg-gradient-to-br from-[#2E2A5E] via-[#24204D] to-[#1E1B4B] text-white rounded-3xl p-6 sm:p-10 border border-[#1E1B4B] shadow-md relative overflow-hidden">
        {/* Ambient Decorative Light Orbs */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#E05D3F]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-[#F2A93B]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#E05D3F] text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs inline-flex items-center gap-1.5">
              <Landmark size={13} /> Official Public Health Missions
            </span>
            <span className="bg-white/10 text-[#F6F4F1] text-[11px] font-medium px-3 py-1 rounded-full backdrop-blur-xs">
              100% Free • No Intermediaries • Citizen Rights
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-black text-white tracking-tight leading-tight">
            Government Health Schemes & <span className="text-[#F2A93B]">Public Healthcare Support</span>
          </h1>

          <p className="text-sm sm:text-base text-[#D9D4CB] leading-relaxed">
            Quality healthcare is a fundamental citizen right. Discover up to <strong>₹5,00,000</strong> in free cashless hospitalization, 100% free rabies post-exposure vaccines, zero-cost childbirth, and heavily subsidized generic medications guaranteed by National and Maharashtra state programs.
          </p>

          {/* Quick Value Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/15">
              <span className="text-[10px] font-extrabold uppercase text-[#F2A93B] block">Cashless Cover</span>
              <span className="text-lg font-black text-white">₹5 Lakh</span>
              <span className="text-[10px] text-[#D9D4CB] block mt-0.5">Under PM-JAY & MJPJAY</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/15">
              <span className="text-[10px] font-extrabold uppercase text-[#86EFAC] block">Rabies PEP</span>
              <span className="text-lg font-black text-white">100% Free</span>
              <span className="text-[10px] text-[#D9D4CB] block mt-0.5">All 5 doses at Civil units</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/15">
              <span className="text-[10px] font-extrabold uppercase text-[#F2A93B] block">Seniors 70+</span>
              <span className="text-lg font-black text-white">Universal</span>
              <span className="text-[10px] text-[#D9D4CB] block mt-0.5">Zero income restrictions</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/15">
              <span className="text-[10px] font-extrabold uppercase text-[#86EFAC] block">Hospital Network</span>
              <span className="text-lg font-black text-white">28,000+</span>
              <span className="text-[10px] text-[#D9D4CB] block mt-0.5">120+ in Pune & PCMC</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Button
              onClick={onOpenEligibilityWizard}
              className="bg-[#E05D3F] hover:bg-[#c94f33] text-white text-xs sm:text-sm font-extrabold px-6 py-3 rounded-2xl shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Sparkles size={16} className="text-[#F2A93B]" />
              <span>Check What You Qualify For</span>
              <ArrowRight size={15} />
            </Button>

            <Button
              onClick={() => setIsHospitalModalOpen(true)}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl flex items-center gap-2 cursor-pointer"
            >
              <Hospital size={16} className="text-[#F2A93B]" />
              <span>Find Pune Empanelled Hospitals</span>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. AUTOMATIC "DID YOU KNOW?" CAROUSEL */}
      <section className="space-y-2">
        <SchemeDidYouKnowCarousel onSelectScheme={handleSelectSchemeFromCarousel} />
      </section>

      {/* 3. SEARCH & CATEGORY FILTER BAR */}
      <section className="bg-white rounded-3xl border-2 border-[#EAE7E1] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-heading font-extrabold text-[#2E2A5E]">
              Explore Available Government Schemes
            </h3>
            <p className="text-xs text-[#6B6560]">
              Browse verified public health programs and emergency patient welfare initiatives
            </p>
          </div>

          {/* Search bar */}
          <div className="relative md:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A847F]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schemes, benefits, ₹ amount..."
              className="w-full pl-10 pr-4 py-2 bg-[#F6F4F1] border border-[#EAE7E1] rounded-2xl text-xs text-[#2E2A5E] focus:outline-none focus:border-[#E05D3F] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: `All Schemes (${GOVERNMENT_SCHEMES_DATA.length})` },
            { id: 'cashless_5l', label: '₹5 Lakh Cashless Cover' },
            { id: 'seniors', label: 'Senior Citizens (70+)' },
            { id: 'emergency_pep', label: 'Free Rabies PEP & Vaccines' },
            { id: 'mother_child', label: 'Mother & Child Care' },
            { id: 'critical', label: 'Critical Surgery Grants' },
            { id: 'pharmacy', label: 'Discounted Generic Medicines' },
          ].map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer text-xs ${
                selectedCategory === cat.id
                  ? 'bg-[#2E2A5E] text-white shadow-2xs'
                  : 'bg-[#F6F4F1] text-[#6B6560] hover:bg-[#EAE7E1] hover:text-[#2E2A5E]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* 4. SCHEME CARDS GRID */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#2E2A5E]">
            Verified Government Health Programs ({filteredSchemes.length})
          </span>
          <button
            type="button"
            onClick={onOpenEligibilityWizard}
            className="text-xs font-bold text-[#E05D3F] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Need guidance? Take the 1-minute checker</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSchemes.map(scheme => (
            <div 
              key={scheme.id}
              className="bg-white rounded-3xl border-2 border-[#EAE7E1] hover:border-[#E05D3F] p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 group"
            >
              {/* Header & Badges */}
              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                    scheme.badgeType === 'flagship'
                      ? 'bg-[#FEF3F2] text-[#E05D3F] border border-[#FECDCA]'
                      : scheme.badgeType === 'state'
                      ? 'bg-[#FEF7EC] text-[#D97706] border border-[#FDE68A]'
                      : scheme.badgeType === 'senior'
                      ? 'bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE]'
                      : scheme.badgeType === 'free'
                      ? 'bg-[#EBF7EE] text-[#1B7A3D] border border-[#C8E6C9]'
                      : scheme.badgeType === 'maternity'
                      ? 'bg-[#FDF2F8] text-[#DB2777] border border-[#FBCFE8]'
                      : 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]'
                  }`}>
                    {scheme.badge}
                  </span>

                  <span className="text-[10px] font-extrabold text-[#8A847F] uppercase tracking-wider">
                    {scheme.categoryLabel}
                  </span>
                </div>

                <div>
                  <h4 className="text-xl font-heading font-black text-[#2E2A5E] group-hover:text-[#E05D3F] transition-colors leading-snug">
                    {scheme.name}
                  </h4>
                  <p className="text-xs text-[#8A847F] font-semibold mt-0.5">
                    {scheme.fullName}
                  </p>
                </div>

                {/* Primary Benefit Display */}
                <div className="bg-[#F6F4F1] p-4 rounded-2xl border border-[#EAE7E1] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-[#8A847F] block">
                      Total Coverage Benefit
                    </span>
                    <span className="text-2xl font-black text-[#E05D3F]">
                      {scheme.coverageAmount}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-[#6B6560] block max-w-[150px] leading-tight">
                      {scheme.coverageSubtext}
                    </span>
                  </div>
                </div>

                {/* Tagline */}
                <p className="text-xs sm:text-sm text-[#55504D] leading-relaxed">
                  {scheme.tagline}
                </p>

                {/* Highlights */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A847F] block">
                    Key Entitlements:
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#55504D]">
                    {scheme.highlights.slice(0, 3).map((hl, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-[#1B7A3D] shrink-0 mt-0.5" />
                        <span className="leading-snug">{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hospital Preview */}
                <div className="p-3 bg-white rounded-xl border border-[#EAE7E1] text-[11px] text-[#6B6560] flex items-center gap-2">
                  <Hospital size={14} className="text-[#E05D3F] shrink-0" />
                  <span className="truncate">
                    <strong>Pune network:</strong> {scheme.puneHospitals[0]} & more
                  </span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-[#EAE7E1] flex items-center justify-between gap-3">
                <Button
                  onClick={() => setSelectedSchemeForModal(scheme)}
                  className="bg-[#2E2A5E] hover:bg-[#201C45] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText size={13} className="text-[#F2A93B]" />
                  <span>How to Claim & Details</span>
                </Button>

                <a
                  href={scheme.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#6B6560] hover:text-[#E05D3F] flex items-center gap-1 transition-colors"
                >
                  <span>Govt Portal</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. STEP-BY-STEP HOSPITAL TREATMENT GUIDE */}
      <section className="bg-white rounded-3xl border-2 border-[#EAE7E1] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-[#EAE7E1] pb-4">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E05D3F] bg-[#FEF3F2] px-2.5 py-0.5 rounded-full border border-[#FECDCA]">
            Citizen Hospital Process
          </span>
          <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[#2E2A5E] mt-1.5">
            How to Avail 100% Cashless Treatment at Empanelled Hospitals
          </h3>
          <p className="text-xs sm:text-sm text-[#55504D] mt-0.5">
            You do not need to pay any upfront deposit or cash advances for covered procedures.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1] space-y-2">
            <span className="w-7 h-7 rounded-xl bg-[#2E2A5E] text-white font-extrabold text-xs flex items-center justify-center">
              1
            </span>
            <h4 className="font-extrabold text-sm text-[#2E2A5E]">
              Visit Hospital Desk
            </h4>
            <p className="text-xs text-[#55504D] leading-relaxed">
              Walk into any empanelled public, municipal, or private hospital and ask for the dedicated <strong>Ayushman Mitra</strong> or <strong>Arogyamitra</strong> kiosk.
            </p>
          </div>

          <div className="p-5 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1] space-y-2">
            <span className="w-7 h-7 rounded-xl bg-[#2E2A5E] text-white font-extrabold text-xs flex items-center justify-center">
              2
            </span>
            <h4 className="font-extrabold text-sm text-[#2E2A5E]">
              Present Identity
            </h4>
            <p className="text-xs text-[#55504D] leading-relaxed">
              Show your <strong>Aadhaar Card</strong> or <strong>Maharashtra Ration Card</strong>. For emergency animal bites, treatment starts immediately before formalities.
            </p>
          </div>

          <div className="p-5 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1] space-y-2">
            <span className="w-7 h-7 rounded-xl bg-[#2E2A5E] text-white font-extrabold text-xs flex items-center justify-center">
              3
            </span>
            <h4 className="font-extrabold text-sm text-[#2E2A5E]">
              Electronic Pre-Auth
            </h4>
            <p className="text-xs text-[#55504D] leading-relaxed">
              The Ayushman Mitra validates your card online and triggers instant electronic authorization from the National or State Health Authority.
            </p>
          </div>

          <div className="p-5 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1] space-y-2">
            <span className="w-7 h-7 rounded-xl bg-[#1B7A3D] text-white font-extrabold text-xs flex items-center justify-center">
              4
            </span>
            <h4 className="font-extrabold text-sm text-[#2E2A5E]">
              Cashless Care
            </h4>
            <p className="text-xs text-[#55504D] leading-relaxed">
              Receive full consultation, surgery, medications, nursing care, and meals. Post-discharge medications are also provided free.
            </p>
          </div>
        </div>
      </section>

      {/* 6. REQUIRED DOCUMENTS CHECKLIST */}
      <section className="bg-[#F6F4F1] rounded-3xl border border-[#EAE7E1] p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-heading font-extrabold text-[#2E2A5E]">
              Document Checklist for Hospital Admissions
            </h3>
            <p className="text-xs text-[#6B6560]">
              Keep digital copies or physical prints ready in your family emergency file
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="text-xs font-bold text-[#2E2A5E] bg-white hover:bg-[#EAE7E1] px-4 py-2 rounded-xl border border-[#EAE7E1] flex items-center gap-1.5 shadow-2xs self-start cursor-pointer"
          >
            <FileText size={13} className="text-[#E05D3F]" />
            <span>Print Checklist</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {REQUIRED_DOCUMENTS_GUIDE.map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-[#EAE7E1] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-[#2E2A5E]">
                  {item.document}
                </span>
                <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                  item.importance.includes('Mandatory')
                    ? 'bg-[#FEF3F2] text-[#E05D3F] border border-[#FECDCA]'
                    : 'bg-[#F6F4F1] text-[#6B6560]'
                }`}>
                  {item.importance}
                </span>
              </div>
              <p className="text-xs text-[#55504D]">
                {item.purpose}
              </p>
              <p className="text-[10px] text-[#8A847F] italic pt-1 border-t border-[#EAE7E1]">
                Where to get: {item.howToGet}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. 24x7 EMERGENCY SUPPORT & OFFICIAL HELPLINES */}
      <section className="bg-gradient-to-r from-[#2E2A5E] to-[#1E1B4B] text-white rounded-3xl p-6 sm:p-8 border border-[#1E1B4B] shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="bg-[#1B7A3D]/40 text-[#86EFAC] border border-[#86EFAC]/30 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md">
              24/7 Citizen Emergency Support
            </span>
            <h3 className="text-xl font-heading font-extrabold text-white">
              Official Government Healthcare Helplines
            </h3>
            <p className="text-xs text-[#D9D4CB]">
              Call directly for free guidance on empanelled beds, application status, or urgent medical transport
            </p>
          </div>

          <Button
            onClick={() => setIsHospitalModalOpen(true)}
            className="bg-[#E05D3F] hover:bg-[#c94f33] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-xs shrink-0 cursor-pointer"
          >
            Open Pune Hospital Finder →
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <a
            href="tel:14555"
            className="bg-white/10 hover:bg-white/15 p-3.5 rounded-2xl border border-white/10 transition-colors block text-left"
          >
            <span className="text-[10px] font-extrabold uppercase text-[#F2A93B] block">National Ayushman</span>
            <span className="text-xl font-black text-white">14555</span>
            <span className="text-[10px] text-[#D9D4CB] block mt-0.5">PM-JAY Scheme Toll-Free</span>
          </a>

          <a
            href="tel:108"
            className="bg-white/10 hover:bg-white/15 p-3.5 rounded-2xl border border-white/10 transition-colors block text-left"
          >
            <span className="text-[10px] font-extrabold uppercase text-[#EF4444] block">Emergency Ambulance</span>
            <span className="text-xl font-black text-white">108</span>
            <span className="text-[10px] text-[#D9D4CB] block mt-0.5">Urgent ICU dispatch</span>
          </a>

          <a
            href="tel:104"
            className="bg-white/10 hover:bg-white/15 p-3.5 rounded-2xl border border-white/10 transition-colors block text-left"
          >
            <span className="text-[10px] font-extrabold uppercase text-[#86EFAC] block">Maharashtra Health</span>
            <span className="text-xl font-black text-white">104</span>
            <span className="text-[10px] text-[#D9D4CB] block mt-0.5">Free Medical Advice</span>
          </a>

          <a
            href="tel:02025508500"
            className="bg-white/10 hover:bg-white/15 p-3.5 rounded-2xl border border-white/10 transition-colors block text-left"
          >
            <span className="text-[10px] font-extrabold uppercase text-[#F2A93B] block">Pune PMC Health</span>
            <span className="text-xl font-black text-white">020-2550</span>
            <span className="text-[10px] text-[#D9D4CB] block mt-0.5">City Health Dept Desk</span>
          </a>
        </div>
      </section>

      {/* Modals */}
      <SchemeDetailModal
        scheme={selectedSchemeForModal}
        onClose={() => setSelectedSchemeForModal(null)}
        onOpenHospitalDirectory={() => setIsHospitalModalOpen(true)}
      />

      <EmpanelledHospitalsModal
        isOpen={isHospitalModalOpen}
        onClose={() => setIsHospitalModalOpen(false)}
      />
    </div>
  );
}
