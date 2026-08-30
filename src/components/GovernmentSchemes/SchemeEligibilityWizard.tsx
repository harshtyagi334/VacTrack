import React, { useState } from 'react';
import { 
  CheckCircle2, ArrowRight, RotateCcw, Sparkles, ShieldCheck, 
  HelpCircle, User, Users, HeartPulse, MapPin, AlertCircle, Phone
} from 'lucide-react';
import { Button } from '../ui/Button';
import { GOVERNMENT_SCHEMES_DATA, GovernmentScheme } from '../../data/governmentSchemesData';

interface SchemeEligibilityWizardProps {
  isOpen?: boolean;
  onClose?: () => void;
  onViewSchemeDetails?: (scheme: GovernmentScheme) => void;
  onJumpToHospitalDirectory?: () => void;
}

export function SchemeEligibilityWizard({ 
  isOpen,
  onClose,
  onViewSchemeDetails,
  onJumpToHospitalDirectory 
}: SchemeEligibilityWizardProps) {
  if (isOpen === false) return null;
  // Wizard state
  const [beneficiary, setBeneficiary] = useState<'myself' | 'senior' | 'child' | 'family'>('myself');
  const [ageGroup, setAgeGroup] = useState<'child' | 'adult' | 'senior60' | 'senior70'>('adult');
  const [rationCard, setRationCard] = useState<'yellow_bpl' | 'orange_apl' | 'white' | 'none'>('orange_apl');
  const [healthNeed, setHealthNeed] = useState<'emergency_bite' | 'surgery_hospital' | 'vaccine_routine' | 'maternity' | 'generic_meds'>('emergency_bite');
  const [residence, setResidence] = useState<'maharashtra' | 'other'>('maharashtra');

  const [hasCalculated, setHasCalculated] = useState(false);

  // Compute matched schemes based on inputs
  const getMatchedSchemes = (): { scheme: GovernmentScheme; matchReason: string; matchStrength: 'high' | 'guaranteed' | 'moderate' }[] => {
    const results: { scheme: GovernmentScheme; matchReason: string; matchStrength: 'high' | 'guaranteed' | 'moderate' }[] = [];

    // 1. Senior 70+ Universal Scheme
    if (ageGroup === 'senior70' || beneficiary === 'senior') {
      const scheme = GOVERNMENT_SCHEMES_DATA.find(s => s.id === 'ayushman-vay-vandana');
      if (scheme) {
        results.push({
          scheme,
          matchReason: 'Guaranteed 100% eligibility for all seniors aged 70+ regardless of family income or existing private cover.',
          matchStrength: 'guaranteed'
        });
      }
    }

    // 2. Animal bite, Rabies PEP, or Vaccines
    if (healthNeed === 'emergency_bite' || healthNeed === 'vaccine_routine') {
      const scheme = GOVERNMENT_SCHEMES_DATA.find(s => s.id === 'nhm-free-vaccines-pep');
      if (scheme) {
        results.push({
          scheme,
          matchReason: 'Rabies PEP 5-dose regimens, Tetanus boosters, and Snake Antivenom are 100% free for everyone at all civil & PMC hospitals.',
          matchStrength: 'guaranteed'
        });
      }
    }

    // 3. Maternity & Child
    if (healthNeed === 'maternity') {
      const scheme = GOVERNMENT_SCHEMES_DATA.find(s => s.id === 'jssk-mother-child');
      if (scheme) {
        results.push({
          scheme,
          matchReason: 'Completely cashless deliveries, C-sections, blood units, food, and free 108 ambulance transport for mother and infant.',
          matchStrength: 'guaranteed'
        });
      }
    }

    // 4. Child RBSK
    if (beneficiary === 'child' || ageGroup === 'child') {
      const scheme = GOVERNMENT_SCHEMES_DATA.find(s => s.id === 'rbsk-child-health');
      if (scheme) {
        results.push({
          scheme,
          matchReason: 'Free screening, pediatric cardiology, cleft surgeries, and disability correction for children from 0 to 18 years.',
          matchStrength: 'high'
        });
      }
    }

    // 5. Maharashtra MJPJAY Scheme
    if (residence === 'maharashtra' && (rationCard === 'yellow_bpl' || rationCard === 'orange_apl' || rationCard === 'white')) {
      const scheme = GOVERNMENT_SCHEMES_DATA.find(s => s.id === 'mjpjay-maharashtra');
      if (scheme && !results.some(r => r.scheme.id === scheme.id)) {
        results.push({
          scheme,
          matchReason: `Eligible via your Maharashtra ${rationCard === 'yellow_bpl' ? 'Yellow (BPL)' : rationCard === 'orange_apl' ? 'Orange (APL)' : 'White'} Ration Card for 996 major surgical procedures.`,
          matchStrength: 'high'
        });
      }
    }

    // 6. National AB PM-JAY
    if (rationCard === 'yellow_bpl' || rationCard === 'orange_apl') {
      const scheme = GOVERNMENT_SCHEMES_DATA.find(s => s.id === 'ab-pmjay');
      if (scheme && !results.some(r => r.scheme.id === scheme.id)) {
        results.push({
          scheme,
          matchReason: 'High likelihood of PM-JAY inclusion under SECC/NFSA databases for ₹5 Lakh nationwide cashless hospitalization.',
          matchStrength: 'high'
        });
      }
    }

    // 7. Generic Medicines (PMBJP)
    if (healthNeed === 'generic_meds') {
      const scheme = GOVERNMENT_SCHEMES_DATA.find(s => s.id === 'pm-janaushadhi-pharmacy');
      if (scheme && !results.some(r => r.scheme.id === scheme.id)) {
        results.push({
          scheme,
          matchReason: 'Instant walk-in access with prescription. Save 50% to 90% on chronic BP, diabetes, cardiac, and asthma medications.',
          matchStrength: 'guaranteed'
        });
      }
    }

    // 8. Critical Grant PMNRF if need is surgery and low income
    if (healthNeed === 'surgery_hospital' && (rationCard === 'yellow_bpl' || rationCard === 'orange_apl')) {
      const scheme = GOVERNMENT_SCHEMES_DATA.find(s => s.id === 'pm-national-relief-grant');
      if (scheme && !results.some(r => r.scheme.id === scheme.id)) {
        results.push({
          scheme,
          matchReason: 'Discretionary direct grant for major heart bypass, renal transplants, and cancer therapies at government/trust hospitals.',
          matchStrength: 'moderate'
        });
      }
    }

    // Fallback: if list is empty, include National Health Mission and Jan Aushadhi
    if (results.length === 0) {
      const nhm = GOVERNMENT_SCHEMES_DATA.find(s => s.id === 'nhm-free-vaccines-pep');
      const pmjay = GOVERNMENT_SCHEMES_DATA.find(s => s.id === 'ab-pmjay');
      if (nhm) results.push({ scheme: nhm, matchReason: 'Universal access to free vaccines and bite management for all citizens.', matchStrength: 'guaranteed' });
      if (pmjay) results.push({ scheme: pmjay, matchReason: 'Check your family name against PM-JAY portal using your Aadhaar or Ration Card number.', matchStrength: 'moderate' });
    }

    return results;
  };

  const matchedResults = getMatchedSchemes();

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setHasCalculated(true);
  };

  const handleReset = () => {
    setBeneficiary('myself');
    setAgeGroup('adult');
    setRationCard('orange_apl');
    setHealthNeed('emergency_bite');
    setResidence('maharashtra');
    setHasCalculated(false);
  };

  const innerContent = (
    <div className={`bg-white rounded-3xl border-2 border-[#EAE7E1] p-6 sm:p-8 shadow-xs space-y-6 ${isOpen ? 'max-w-4xl w-full max-h-[90vh] overflow-y-auto' : ''}`}>
      {/* Header */}
      <div className="border-b border-[#EAE7E1] pb-5 flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#F6F4F1] text-[#E05D3F] border border-[#EAE7E1] mb-2">
            <Sparkles size={13} className="text-[#F2A93B]" /> Free Public Eligibility Checker
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-extrabold text-[#2E2A5E]">
            Find What Government Health Support You May Qualify For
          </h2>
          <p className="text-xs sm:text-sm text-[#55504D] mt-1 max-w-2xl leading-relaxed">
            Answer 5 simple questions to instantly discover free hospitalization, surgery covers, free rabies/tetanus vaccines, or subsidized medications available to you.
          </p>
        </div>
        {isOpen && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-[#F6F4F1] hover:bg-[#EAE7E1] text-[#2E2A5E] font-bold flex items-center justify-center shrink-0 cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Questionnaire Form */}
      <form onSubmit={handleCalculate} className="space-y-6">
        {/* Question 1: Beneficiary */}
        <div className="space-y-2">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E]">
            1. Who are you checking this healthcare support for?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'myself', label: 'Myself (Adult)', icon: User },
              { id: 'senior', label: 'Elderly Parent (70+)', icon: ShieldCheck },
              { id: 'child', label: 'Child / Infant (<18)', icon: HeartPulse },
              { id: 'family', label: 'Whole Family', icon: Users }
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setBeneficiary(item.id as any);
                  if (item.id === 'senior') setAgeGroup('senior70');
                  if (item.id === 'child') setAgeGroup('child');
                }}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center ${
                  beneficiary === item.id 
                    ? 'bg-[#2E2A5E] text-white border-[#2E2A5E] shadow-xs' 
                    : 'bg-[#F6F4F1] text-[#55504D] border-[#EAE7E1] hover:bg-white hover:border-[#E05D3F]/50'
                }`}
              >
                <item.icon size={18} className={beneficiary === item.id ? 'text-[#F2A93B]' : 'text-[#8A847F]'} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Question 2: Age Group */}
        <div className="space-y-2">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E]">
            2. Age of the Person Seeking Care
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'child', label: 'Under 18 Years', sub: 'Eligible for RBSK child care' },
              { id: 'adult', label: '18 to 59 Years', sub: 'Adult & family programs' },
              { id: 'senior60', label: '60 to 69 Years', sub: 'Senior citizen benefits' },
              { id: 'senior70', label: '70 Years or Older', sub: '★ Universal ₹5 Lakh Card' }
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setAgeGroup(item.id as any)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  ageGroup === item.id 
                    ? 'bg-[#E05D3F] text-white border-[#E05D3F] shadow-xs' 
                    : 'bg-[#F6F4F1] text-[#55504D] border-[#EAE7E1] hover:bg-white hover:border-[#E05D3F]/50'
                }`}
              >
                <div className="font-extrabold text-xs">{item.label}</div>
                <div className={`text-[10px] mt-0.5 ${ageGroup === item.id ? 'text-white/90 font-medium' : 'text-[#8A847F]'}`}>
                  {item.sub}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Question 3: Ration Card & Income Tier */}
        <div className="space-y-2">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E]">
            3. Household Ration Card Status in Maharashtra
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {[
              { id: 'yellow_bpl', title: 'Yellow Card (BPL)', note: 'BPL / Antyodaya priority families' },
              { id: 'orange_apl', title: 'Orange Card (APL)', note: 'Annual family income < ₹1.5 Lakh' },
              { id: 'white', title: 'White Card', note: 'General residents in Maharashtra' },
              { id: 'none', title: 'No Card / Other State', note: 'Aadhaar only / Universal schemes' }
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setRationCard(item.id as any)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  rationCard === item.id 
                    ? 'bg-[#2E2A5E] text-white border-[#2E2A5E] shadow-xs' 
                    : 'bg-[#F6F4F1] text-[#55504D] border-[#EAE7E1] hover:bg-white hover:border-[#E05D3F]/50'
                }`}
              >
                <div className="font-extrabold text-xs">{item.title}</div>
                <div className={`text-[10px] mt-0.5 ${rationCard === item.id ? 'text-[#F2A93B]' : 'text-[#8A847F]'}`}>
                  {item.note}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Question 4: Primary Healthcare Need */}
        <div className="space-y-2">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E]">
            4. What is your current healthcare requirement?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {[
              { id: 'emergency_bite', title: 'Animal Bite, Rabies PEP, or Trauma', desc: 'Need urgent post-exposure vaccine or antivenom' },
              { id: 'surgery_hospital', title: 'Planned Surgery / Hospitalization', desc: 'Cardiac, oncology, ortho, or ICU admission' },
              { id: 'vaccine_routine', title: 'Routine Childhood or Adult Vaccines', desc: 'Polio, TT, Hepatitis B, or booster shots' },
              { id: 'maternity', title: 'Pregnancy, Delivery, or Newborn Care', desc: 'Hospital delivery, C-section, or infant ICU' },
              { id: 'generic_meds', title: 'Monthly Prescription Medications', desc: 'Long-term BP, diabetes, or asthma medicines' }
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setHealthNeed(item.id as any)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  healthNeed === item.id 
                    ? 'bg-[#FEF7EC] text-[#92400E] border-[#FDE68A] shadow-xs ring-1 ring-[#D97706]' 
                    : 'bg-[#F6F4F1] text-[#55504D] border-[#EAE7E1] hover:bg-white'
                }`}
              >
                <div className="font-extrabold text-xs text-[#2E2A5E]">{item.title}</div>
                <div className="text-[11px] text-[#6B6560] mt-0.5">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Question 5: State / Residence */}
        <div className="space-y-2">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E]">
            5. Current State of Residence
          </label>
          <div className="grid grid-cols-2 gap-3 max-w-md">
            {[
              { id: 'maharashtra', label: 'Maharashtra (Pune & districts)' },
              { id: 'other', label: 'Other State / Union Territory' }
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setResidence(item.id as any)}
                className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all cursor-pointer ${
                  residence === item.id 
                    ? 'bg-[#2E2A5E] text-white border-[#2E2A5E] shadow-xs' 
                    : 'bg-[#F6F4F1] text-[#55504D] border-[#EAE7E1] hover:bg-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-[#E05D3F] hover:bg-[#c94f33] text-white text-xs font-extrabold rounded-2xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles size={15} className="text-[#F2A93B]" />
            <span>Discover Matching Schemes Now</span>
            <ArrowRight size={15} />
          </Button>

          {hasCalculated && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-bold text-[#8A847F] hover:text-[#2E2A5E] flex items-center gap-1.5 px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </form>

      {/* RESULTS DISPLAY */}
      {hasCalculated && (
        <div className="pt-6 border-t-2 border-[#EAE7E1] space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Result Banner */}
          <div className="bg-gradient-to-r from-[#2E2A5E] to-[#1F1C42] text-white p-6 sm:p-7 rounded-3xl shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-48 h-48 bg-[#E05D3F]/20 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div>
                <span className="bg-[#1B7A3D]/40 text-[#86EFAC] border border-[#86EFAC]/30 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <CheckCircle2 size={12} /> Calculation Complete
                </span>
                <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-white mt-1.5">
                  You Have {matchedResults.length} Matched Government Health Schemes
                </h3>
                <p className="text-xs sm:text-sm text-[#D9D4CB] max-w-xl mt-1 leading-relaxed">
                  Based on your profile, you are eligible for up to <strong>₹5,00,000</strong> in free annual cashless treatment, zero-cost emergency vaccines, and major surgical covers.
                </p>
              </div>

              <button
                type="button"
                onClick={onJumpToHospitalDirectory}
                className="bg-[#E05D3F] hover:bg-[#c94f33] text-white text-xs font-extrabold px-5 py-3 rounded-2xl shrink-0 transition-colors shadow-xs cursor-pointer"
              >
                View Empanelled Pune Hospitals →
              </button>
            </div>

            {/* Helpline quick tip */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-[#F2A93B]">
              <span className="flex items-center gap-1 font-bold">
                <Phone size={13} /> Official National Ayushman Helpline: 14555 (Toll-Free 24x7)
              </span>
              <span className="text-[11px] text-[#D9D4CB]">
                Zero registration fees • No middlemen required
              </span>
            </div>
          </div>

          {/* Matched Scheme Cards */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#2E2A5E]">
              Recommended Schemes for Your Household
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {matchedResults.map(({ scheme, matchReason, matchStrength }) => (
                <div
                  key={scheme.id}
                  className="bg-white rounded-3xl border-2 border-[#EAE7E1] hover:border-[#E05D3F] p-6 shadow-xs flex flex-col justify-between space-y-4 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                        matchStrength === 'guaranteed'
                          ? 'bg-[#EBF7EE] text-[#1B7A3D] border border-[#C8E6C9]'
                          : 'bg-[#FEF7EC] text-[#D97706] border border-[#FDE68A]'
                      }`}>
                        {matchStrength === 'guaranteed' ? '★ Guaranteed 100% Match' : '✓ Strong Profile Match'}
                      </span>

                      <span className="text-[10px] font-extrabold text-[#8A847F] uppercase">
                        {scheme.categoryLabel}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-heading font-extrabold text-[#2E2A5E]">
                        {scheme.name}
                      </h4>
                      <p className="text-xs text-[#8A847F] mt-0.5">
                        {scheme.fullName}
                      </p>
                    </div>

                    {/* Coverage Amount Callout */}
                    <div className="bg-[#F6F4F1] p-3.5 rounded-2xl border border-[#EAE7E1] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-[#8A847F] block">
                          Coverage Benefit
                        </span>
                        <span className="text-xl font-black text-[#E05D3F]">
                          {scheme.coverageAmount}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#2E2A5E] bg-white px-2.5 py-1 rounded-xl border border-[#EAE7E1]">
                        {scheme.badge}
                      </span>
                    </div>

                    {/* Match Reason Box */}
                    <div className="p-3 bg-[#FEF3F2] rounded-xl border border-[#FECDCA] text-xs text-[#991B1B] leading-relaxed flex items-start gap-2">
                      <CheckCircle2 size={15} className="text-[#E05D3F] shrink-0 mt-0.5" />
                      <span><strong>Why you qualify:</strong> {matchReason}</span>
                    </div>

                    {/* Quick highlights */}
                    <ul className="space-y-1 text-xs text-[#55504D]">
                      {scheme.highlights.slice(0, 2).map((hl, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E05D3F] shrink-0" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-[#EAE7E1] flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onViewSchemeDetails && onViewSchemeDetails(scheme)}
                      className="text-xs font-extrabold text-[#E05D3F] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Read How to Claim</span>
                      <ArrowRight size={13} />
                    </button>

                    <a
                      href={scheme.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#6B6560] hover:text-[#2E2A5E] flex items-center gap-1"
                    >
                      <span>Official Portal</span>
                      <ArrowRight size={12} className="-rotate-45" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isOpen) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        {innerContent}
      </div>
    );
  }

  return innerContent;
}
