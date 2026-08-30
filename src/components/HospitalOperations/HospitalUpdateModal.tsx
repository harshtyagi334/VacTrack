import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { 
  Building2, Phone, ShieldCheck, CheckCircle2, 
  MapPin, Clock, Edit3, HeartPulse
} from 'lucide-react';
import { Button } from '../ui/Button';

interface HospitalUpdateModalProps {
  hospitalId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function HospitalUpdateModal({ hospitalId, isOpen, onClose }: HospitalUpdateModalProps) {
  const { hospitalOperations, updateHospitalOperations, clinics } = useAppStore();
  const hospital = hospitalOperations[hospitalId] || hospitalOperations['hosp_1'];

  const [phone, setPhone] = useState(hospital?.phone || '+91 90000 10001');
  const [emergencyDept, setEmergencyDept] = useState(hospital?.emergencyDept ?? true);
  const [antivenomAvailable, setAntivenomAvailable] = useState(hospital?.antivenomAvailable ?? true);
  const [rabiesPepAvailable, setRabiesPepAvailable] = useState(hospital?.rabiesPepAvailable ?? true);
  const [bedsAvailable, setBedsAvailable] = useState(hospital?.bedsAvailableDemo ?? 14);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateHospitalOperations(hospitalId, {
      phone,
      emergencyDept,
      antivenomAvailable,
      rabiesPepAvailable,
      bedsAvailableDemo: Number(bedsAvailable)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border-2 border-[#EAE7E1] shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
        
        <div className="flex items-center justify-between border-b border-[#EAE7E1] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#2E2A5E]/10 text-[#2E2A5E] rounded-xl">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="text-lg font-heading font-extrabold text-[#2E2A5E]">
                Update Hospital Operations
              </h3>
              <p className="text-[11px] text-[#6B6560]">
                {hospital?.name || 'Shivajinagar Emergency Medical Centre'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-[#8A847F] hover:text-[#231F20] text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
          
          <div>
            <label className="block text-[#6B6560] uppercase tracking-wider mb-1">
              Emergency Contact Helpline Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full p-3 bg-[#F6F4F1] border-2 border-[#EAE7E1] rounded-xl text-xs font-extrabold text-[#2E2A5E] outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[#6B6560] uppercase tracking-wider mb-1">
              Available ICU & Emergency Trauma Beds
            </label>
            <input
              type="number"
              min="0"
              value={bedsAvailable}
              onChange={e => setBedsAvailable(Number(e.target.value))}
              className="w-full p-3 bg-[#F6F4F1] border-2 border-[#EAE7E1] rounded-xl text-xs font-extrabold text-[#2E2A5E] outline-none"
              required
            />
          </div>

          <div className="space-y-2 pt-1">
            <label className="block text-[#6B6560] uppercase tracking-wider">
              Emergency Capabilities & Readiness
            </label>

            <div className="p-3 bg-[#F6F4F1] rounded-xl border border-[#EAE7E1] space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[#2E2A5E]">24/7 Emergency Trauma Department Active</span>
                <input
                  type="checkbox"
                  checked={emergencyDept}
                  onChange={e => setEmergencyDept(e.target.checked)}
                  className="w-4 h-4 text-[#E05D3F] rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[#2E2A5E]">Rabies Post-Exposure Prophylaxis (PEP) Available</span>
                <input
                  type="checkbox"
                  checked={rabiesPepAvailable}
                  onChange={e => setRabiesPepAvailable(e.target.checked)}
                  className="w-4 h-4 text-[#E05D3F] rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[#2E2A5E]">Polyvalent Antivenom Serum in Cold Chain</span>
                <input
                  type="checkbox"
                  checked={antivenomAvailable}
                  onChange={e => setAntivenomAvailable(e.target.checked)}
                  className="w-4 h-4 text-[#E05D3F] rounded"
                />
              </label>
            </div>
          </div>

          {/* Tamper-evident sync message */}
          <div className="p-3 bg-[#EBF7EE] rounded-xl border border-[#C8E6C9] flex items-center gap-2 text-[10px] text-[#1B7A3D]">
            <ShieldCheck size={14} className="shrink-0" />
            <span>Updates are synced live with the public VacTrack patient map & emergency helpline registry.</span>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-[#EAE7E1] text-[#2E2A5E] rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#2E2A5E] hover:bg-[#231f47] text-white rounded-xl font-extrabold"
            >
              Save Operational Data
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}
