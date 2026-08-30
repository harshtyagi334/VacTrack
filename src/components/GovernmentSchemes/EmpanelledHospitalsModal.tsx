import React, { useState } from 'react';
import { 
  X, Hospital, Search, MapPin, Phone, ShieldCheck, 
  HeartPulse, CheckCircle2, AlertCircle, Navigation
} from 'lucide-react';
import { PUNE_EMPANELLED_HOSPITALS, PuneEmpanelledHospital } from '../../data/governmentSchemesData';
import { Button } from '../ui/Button';

interface EmpanelledHospitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmpanelledHospitalsModal({ isOpen, onClose }: EmpanelledHospitalsModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  if (!isOpen) return null;

  const filteredHospitals = PUNE_EMPANELLED_HOSPITALS.filter(hosp => {
    const matchesSearch = 
      hosp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hosp.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hosp.schemesAccepted.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'all' || hosp.type === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 relative border-2 border-[#EAE7E1] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="empanelled-hospitals-title"
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 sm:px-8 py-5 border-b border-[#EAE7E1] flex items-center justify-between z-20">
          <div>
            <span className="bg-[#EBF7EE] text-[#1B7A3D] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#C8E6C9]">
              Verified Network Directory
            </span>
            <h3 id="empanelled-hospitals-title" className="text-xl sm:text-2xl font-heading font-extrabold text-[#2E2A5E] mt-1">
              Pune Empanelled Hospitals & Arogyamitra Desks
            </h3>
            <p className="text-xs text-[#6B6560]">
              Hospitals with active Ayushman Bharat & MJPJAY cashless counters in Pune District
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#8A847F] hover:text-[#2E2A5E] rounded-xl hover:bg-[#F6F4F1] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="px-6 sm:px-8 space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A847F]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by hospital name, area (e.g. Sassoon, Deccan, Rasta Peth) or scheme..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F6F4F1] border border-[#EAE7E1] rounded-2xl text-xs sm:text-sm text-[#2E2A5E] focus:outline-none focus:border-[#E05D3F] focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'All Pune Facilities' },
              { id: 'Government Civil Hospital', label: 'Government Civil' },
              { id: 'Trust / Non-Profit Hospital', label: 'Trust / Charitable' },
              { id: 'Empanelled Private Hospital', label: 'Private Empanelled' },
              { id: 'PMC Municipal Clinic', label: 'PMC Municipal Clinics' },
            ].map(type => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedType(type.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer text-xs ${
                  selectedType === type.id
                    ? 'bg-[#2E2A5E] text-white'
                    : 'bg-[#F6F4F1] text-[#6B6560] hover:bg-[#EAE7E1]'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hospitals List */}
        <div className="px-6 sm:px-8 pb-6 space-y-4">
          <div className="text-xs text-[#8A847F] font-bold">
            Showing {filteredHospitals.length} verified healthcare institutions
          </div>

          <div className="space-y-3.5">
            {filteredHospitals.map(hosp => (
              <div 
                key={hosp.id}
                className="bg-white p-5 rounded-2xl border-2 border-[#EAE7E1] hover:border-[#E05D3F] transition-all shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#F6F4F1] text-[#2E2A5E] border border-[#EAE7E1]">
                        {hosp.type}
                      </span>
                      <span className="text-xs font-semibold text-[#8A847F]">
                        📍 {hosp.distanceEstimate}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-heading font-extrabold text-[#2E2A5E] mt-1">
                      {hosp.name}
                    </h4>

                    <p className="text-xs text-[#6B6560] flex items-center gap-1.5 mt-0.5">
                      <MapPin size={13} className="text-[#E05D3F] shrink-0" />
                      <span>{hosp.address}</span>
                    </p>
                  </div>

                  {/* Highlights badges */}
                  <div className="flex sm:flex-col items-start sm:items-end gap-1 shrink-0 pt-1 sm:pt-0">
                    {hosp.hasAyushmanKendraDesk && (
                      <span className="bg-[#EBF7EE] text-[#1B7A3D] text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-[#C8E6C9] flex items-center gap-1">
                        <CheckCircle2 size={11} /> Ayushman Mitra Desk
                      </span>
                    )}
                    {hosp.pepAntivenomAvailable && (
                      <span className="bg-[#FEF3F2] text-[#E05D3F] text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-[#FECDCA] flex items-center gap-1">
                        <HeartPulse size={11} /> Free Rabies PEP / Antivenom
                      </span>
                    )}
                  </div>
                </div>

                {/* Accepted Schemes Pills */}
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A847F] block">
                    Cashless Schemes Accepted Here:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {hosp.schemesAccepted.map((sch, i) => (
                      <span key={i} className="text-[11px] font-bold px-2 py-0.5 bg-[#FEF7EC] text-[#92400E] border border-[#FDE68A] rounded-md">
                        ✓ {sch}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions & Contacts */}
                <div className="pt-2 border-t border-[#EAE7E1] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4 text-[#55504D]">
                    <a 
                      href={`tel:${hosp.emergencyPhone.split('/')[0].trim()}`}
                      className="font-bold text-[#DC2626] hover:underline flex items-center gap-1"
                    >
                      <Phone size={13} />
                      <span>Emergency: {hosp.emergencyPhone}</span>
                    </a>
                    <span className="hidden sm:inline text-[#8A847F]">Desk: {hosp.phone}</span>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hosp.name + ' ' + hosp.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-[#E05D3F] hover:underline"
                  >
                    <Navigation size={12} />
                    <span>Get Directions</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-6 sm:px-8 py-4 border-t border-[#EAE7E1] flex items-center justify-between z-20">
          <span className="text-xs text-[#8A847F]">
            Need immediate help finding an empanelled bed? Call <strong>14555</strong>
          </span>
          <Button
            onClick={onClose}
            className="px-6 py-2 bg-[#2E2A5E] hover:bg-[#201C45] text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Close Directory
          </Button>
        </div>
      </div>
    </div>
  );
}
