import React from 'react';
import { 
  X, ShieldCheck, CheckCircle2, FileText, Phone, ExternalLink, 
  Hospital, AlertCircle, Info, Sparkles, Building2, MapPin, Share2, Check
} from 'lucide-react';
import { Button } from '../ui/Button';
import { GovernmentScheme } from '../../data/governmentSchemesData';

interface SchemeDetailModalProps {
  scheme: GovernmentScheme | null;
  onClose: () => void;
  onOpenHospitalDirectory?: () => void;
}

export function SchemeDetailModal({ 
  scheme, 
  onClose,
  onOpenHospitalDirectory 
}: SchemeDetailModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!scheme) return null;

  const handleCopySummary = () => {
    const text = `${scheme.name} (${scheme.fullName})\nCover: ${scheme.coverageAmount}\nGoverning Body: ${scheme.governingBody}\nHelpline: ${scheme.helpline}\nOfficial Portal: ${scheme.officialWebsite}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 relative border-2 border-[#EAE7E1] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="scheme-modal-title"
      >
        {/* Sticky Header with Close Button */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 sm:px-8 py-5 border-b border-[#EAE7E1] flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <span className="bg-[#FEF3F2] text-[#E05D3F] border border-[#FECDCA] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              {scheme.badge}
            </span>
            <span className="text-xs text-[#8A847F] font-bold hidden sm:inline">
              {scheme.categoryLabel}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="p-2 text-[#6B6560] hover:text-[#2E2A5E] rounded-xl hover:bg-[#F6F4F1] transition-colors cursor-pointer"
              title="Copy scheme summary"
              aria-label="Copy scheme summary"
            >
              {copied ? <Check size={18} className="text-[#1B7A3D]" /> : <Share2 size={18} />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#8A847F] hover:text-[#2E2A5E] rounded-xl hover:bg-[#F6F4F1] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-6 sm:px-8 space-y-6 pb-6">
          {/* Scheme Title & Authority */}
          <div className="space-y-1">
            <h3 id="scheme-modal-title" className="text-2xl sm:text-3xl font-heading font-black text-[#2E2A5E]">
              {scheme.name}
            </h3>
            <p className="text-sm font-bold text-[#E05D3F]">
              {scheme.fullName}
            </p>
            <p className="text-xs text-[#8A847F] flex items-center gap-1.5 pt-0.5">
              <Building2 size={13} className="text-[#8A847F]" />
              <span>Authority: {scheme.governingBody}</span>
            </p>
          </div>

          {/* Benefit Banner */}
          <div className="bg-gradient-to-r from-[#2E2A5E] to-[#201C45] text-white p-5 sm:p-6 rounded-2xl shadow-xs space-y-2 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-36 h-36 bg-[#E05D3F]/20 rounded-full blur-xl pointer-events-none" />
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#F2A93B]">
              Total Guaranteed Healthcare Value
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white">
              {scheme.coverageAmount}
            </div>
            <p className="text-xs text-[#EAE7E1] leading-relaxed">
              {scheme.coverageSubtext}
            </p>
          </div>

          {/* Description & Purpose */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E]">
              Overview & Public Benefit Purpose
            </h4>
            <p className="text-xs sm:text-sm text-[#55504D] leading-relaxed">
              {scheme.shortDescription}
            </p>
          </div>

          {/* Key Scheme Benefits */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E]">
              Key Protections & Features
            </h4>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {scheme.keyBenefits.map((benefit, idx) => (
                <div 
                  key={idx}
                  className="p-3 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1] flex items-start gap-2.5 text-xs text-[#55504D]"
                >
                  <CheckCircle2 size={15} className="text-[#1B7A3D] shrink-0 mt-0.5" />
                  <span className="leading-snug">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div className="space-y-2.5 bg-[#FEF7EC] p-4 sm:p-5 rounded-2xl border border-[#FDE68A]">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#92400E] flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#D97706]" />
              Who is Eligible?
            </h4>
            <ul className="space-y-2 text-xs text-[#78350F]">
              {scheme.eligibilityCriteria.map((crit, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0 mt-1.5" />
                  <span className="font-medium leading-relaxed">{crit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Step-by-Step "How to Avail" Guide */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E]">
              How to Avail Treatment at Hospital (Cashless Process)
            </h4>
            <div className="space-y-2.5">
              {scheme.howToClaim.map((step, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1] flex items-start gap-3 text-xs"
                >
                  <span className="w-6 h-6 rounded-full bg-[#2E2A5E] text-white flex items-center justify-center font-extrabold text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-[#55504D] leading-relaxed mt-0.5">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Required Documents */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E]">
              Required Documents to Carry
            </h4>
            <div className="grid sm:grid-cols-2 gap-2">
              {scheme.requiredDocuments.map((doc, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-[#EAE7E1] text-xs text-[#55504D]">
                  <FileText size={14} className="text-[#E05D3F] shrink-0" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Empanelled Hospitals in Pune */}
          <div className="space-y-2.5 p-4 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1]">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] flex items-center gap-1.5">
                <Hospital size={14} className="text-[#E05D3F]" />
                Empanelled Facilities in Pune & PCMC
              </h4>
              {onOpenHospitalDirectory && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenHospitalDirectory();
                  }}
                  className="text-[11px] font-extrabold text-[#E05D3F] hover:underline cursor-pointer"
                >
                  View Full Pune Directory →
                </button>
              )}
            </div>
            <ul className="space-y-1 text-xs text-[#55504D]">
              {scheme.puneHospitals.map((hosp, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <MapPin size={12} className="text-[#8A847F] shrink-0" />
                  <span>{hosp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Helplines & Links */}
          <div className="p-4 bg-[#FEF3F2] rounded-2xl border border-[#FECDCA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="font-extrabold text-[#991B1B] flex items-center gap-1.5">
                <Phone size={13} className="text-[#E05D3F]" />
                <span>Official Toll-Free Helpline:</span>
              </div>
              <div className="font-mono font-bold text-[#E05D3F] text-sm">
                {scheme.helpline}
              </div>
            </div>

            <a
              href={scheme.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2E2A5E] hover:bg-[#201C45] text-white text-xs font-bold rounded-xl transition-colors shrink-0"
            >
              <span>Visit Official Portal</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-6 sm:px-8 py-4 border-t border-[#EAE7E1] flex items-center justify-end gap-3 z-20">
          <Button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#2E2A5E] hover:bg-[#201C45] text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Close Details
          </Button>
        </div>
      </div>
    </div>
  );
}
