import React, { useState } from 'react';
import { Doctor } from '../../types';
import { useAppStore } from '../../store';
import { 
  UserCheck, UserX, Clock, Stethoscope, Building2, 
  CheckCircle2, AlertCircle, Edit3
} from 'lucide-react';
import { Button } from '../ui/Button';

interface DoctorAvailabilityProps {
  hospitalId: string;
}

export function DoctorAvailability({ hospitalId }: DoctorAvailabilityProps) {
  const { hospitalOperations, updateDoctorStatus } = useAppStore();
  const hospital = hospitalOperations[hospitalId] || hospitalOperations['hosp_1'];

  const doctors = hospital?.doctors || [];

  const availableCount = doctors.filter(d => d.availability === 'available').length;
  const inConsultationCount = doctors.filter(d => d.availability === 'in_consultation').length;
  const onLeaveCount = doctors.filter(d => d.availability === 'on_leave').length;

  const handleToggleStatus = (doctorId: string, current: Doctor['availability']) => {
    const next: Doctor['availability'] = 
      current === 'available' ? 'in_consultation' : 
      current === 'in_consultation' ? 'on_leave' : 'available';
    updateDoctorStatus(hospitalId, doctorId, next);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-[#EAE7E1] shadow-xs p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#1B7A3D]/10 text-[#1B7A3D] rounded-xl">
              <Stethoscope size={20} />
            </div>
            <h2 className="text-xl font-heading font-extrabold text-[#2E2A5E]">
              Duty Doctors & Clinical Specialist Roster
            </h2>
          </div>
          <p className="text-xs text-[#6B6560] mt-1">
            Real-time OPD availability, specialist departments, emergency response coverage, and shift statuses.
          </p>
        </div>

        {/* Quick summary badges */}
        <div className="flex items-center gap-2">
          <span className="bg-[#EBF7EE] text-[#1B7A3D] text-xs font-extrabold px-3 py-1 rounded-full border border-[#C8E6C9]">
            {availableCount} Active on Floor
          </span>
        </div>
      </div>

      {/* Overview Stat Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#EBF7EE] p-3.5 rounded-2xl border border-[#C8E6C9] text-center">
          <span className="text-[10px] text-[#1B7A3D] font-extrabold uppercase tracking-wider block">Available Now</span>
          <span className="text-2xl font-extrabold text-[#1B7A3D]">{availableCount}</span>
        </div>
        <div className="bg-[#FEF3C7] p-3.5 rounded-2xl border border-[#FDE68A] text-center">
          <span className="text-[10px] text-[#D97706] font-extrabold uppercase tracking-wider block">In Consultation</span>
          <span className="text-2xl font-extrabold text-[#D97706]">{inConsultationCount}</span>
        </div>
        <div className="bg-[#F6F4F1] p-3.5 rounded-2xl border border-[#EAE7E1] text-center">
          <span className="text-[10px] text-[#6B6560] font-extrabold uppercase tracking-wider block">On Leave</span>
          <span className="text-2xl font-extrabold text-[#6B6560]">{onLeaveCount}</span>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map(doc => {
          const isAvailable = doc.availability === 'available';
          const isInConsult = doc.availability === 'in_consultation';
          const isOnLeave = doc.availability === 'on_leave';

          return (
            <div 
              key={doc.id}
              className="p-5 rounded-2xl border-2 border-[#EAE7E1] bg-white shadow-2xs hover:border-[#2E2A5E]/40 transition-all flex flex-col justify-between gap-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-extrabold text-[#2E2A5E]">{doc.name}</h3>
                    <p className="text-xs text-[#E05D3F] font-extrabold mt-0.5">{doc.speciality}</p>
                  </div>

                  {isAvailable && (
                    <span className="inline-flex items-center gap-1 bg-[#EBF7EE] text-[#1B7A3D] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#C8E6C9] shrink-0">
                      <CheckCircle2 size={11} /> ● Available
                    </span>
                  )}
                  {isInConsult && (
                    <span className="inline-flex items-center gap-1 bg-[#FEF3C7] text-[#D97706] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#FDE68A] shrink-0">
                      <Clock size={11} /> ● In Consultation
                    </span>
                  )}
                  {isOnLeave && (
                    <span className="inline-flex items-center gap-1 bg-[#F6F4F1] text-[#6B6560] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#EAE7E1] shrink-0">
                      <UserX size={11} /> ● On Leave
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-[#6B6560] space-y-1 pt-1">
                  <div className="flex items-center justify-between">
                    <span>Department:</span>
                    <strong className="text-[#2E2A5E]">{doc.department}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Room Number:</span>
                    <span className="font-mono font-bold text-[#2E2A5E]">{doc.roomNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Duty Shift:</span>
                    <span className="text-[#6B6560]">{doc.timing}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#EAE7E1] flex items-center justify-between">
                <span className="text-[10px] text-[#8A847F] font-bold">Quick Toggle:</span>
                <button
                  onClick={() => handleToggleStatus(doc.id, doc.availability)}
                  className="px-3 py-1 bg-[#F6F4F1] hover:bg-[#2E2A5E] hover:text-white text-[#2E2A5E] text-xs font-extrabold rounded-lg border border-[#EAE7E1] transition-all cursor-pointer flex items-center gap-1"
                >
                  <Edit3 size={11} /> Change Status
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
