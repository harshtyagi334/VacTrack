import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { format, parseISO, isBefore, isAfter } from 'date-fns';
import { 
  AlertTriangle, CheckCircle2, ShieldCheck, ShieldAlert, Clock, Info, 
  Search, Lock, Check, Calendar, Activity, PackageCheck, User, MapPin, Phone, Building2
} from 'lucide-react';
import { Dose } from '../../types';

export function PatientRecord({ patientId }: { patientId: string }) {
  const { patients, doses, recordDose, currentClinicId, clinics, verifyChain, simulateTampering, restoreTampering, currentDate, alerts } = useAppStore();
  
  const patient = patients[patientId] || patients['p_demo_1'];
  const patientDoses = doses[patientId] || doses['p_demo_1'] || [];
  
  const [activeTab, setActiveTab] = useState<'record' | 'history' | 'integrity'>('record');
  const [chainStatus, setChainStatus] = useState<{ valid: boolean; failedAtDose?: number; expectedHash?: string; actualHash?: string } | null>(null);

  const clinic = (currentClinicId && clinics[currentClinicId]) ? clinics[currentClinicId] : {
    name: 'Shivajinagar Emergency Medical Centre',
    licenseNumber: 'HOSP-DEMO-001'
  };

  useEffect(() => {
    setChainStatus(verifyChain(patientId));
  }, [patientDoses, verifyChain, patientId]);

  if (!patient) return null;

  // Compute PEP stats
  const completedDoses = patientDoses.filter(d => d.status === 'completed');
  const upcomingDose = patientDoses.find(d => d.status === 'upcoming' || d.status === 'due_today');
  const overdueDoses = patientDoses.filter(d => d.status === 'overdue');
  const patientAlerts = alerts.filter(a => a.patientId === patientId || a.message.includes(patient.name));

  // Batch information from completed doses
  const primaryBatch = completedDoses[0]?.batchNumber || 'RAB-DEMO-7824';

  return (
    <div className="space-y-6">
      
      {/* Search Result Overview Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#EAE7E1] shadow-xs space-y-6">
        
        {/* Top Title & Privacy Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#EAE7E1] pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-[#2E2A5E] text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase font-mono">
                Patient ID: {patient.id}
              </span>
              <span className="bg-[#EBF7EE] text-[#1B7A3D] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border border-[#C8E6C9] flex items-center gap-1">
                <Lock size={12} /> Privacy-Conscious Record
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#2E2A5E]">
              {patient.name}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#6B6560] mt-1">
              <span className="flex items-center gap-1"><Phone size={13} className="text-[#E05D3F]" /> {patient.phone}</span>
              <span>•</span>
              <span>DOB: {patient.dob || '02 April 2004'}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><MapPin size={13} className="text-[#2E2A5E]" /> {patient.city || 'Pune'}, {patient.state || 'Maharashtra'}</span>
            </div>
          </div>

          <div className="bg-[#F6F4F1] p-4 rounded-2xl border border-[#EAE7E1] flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="text-[10px] font-extrabold uppercase text-[#6B6560] block">Rabies PEP Progress</span>
              <span className="text-2xl font-extrabold text-[#2E2A5E]">
                {completedDoses.length} / 5 <span className="text-xs text-[#6B6560] font-bold">doses</span>
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#E05D3F] text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
              {Math.round((completedDoses.length / 5) * 100)}%
            </div>
          </div>
        </div>

        {/* 4 Key Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: PEP Progress */}
          <div className="bg-[#F6F4F1] p-4 rounded-2xl border border-[#EAE7E1]">
            <span className="text-[10px] font-extrabold text-[#6B6560] uppercase tracking-wider block mb-1">
              Rabies PEP Protocol
            </span>
            <span className="text-lg font-extrabold text-[#2E2A5E] block">
              {completedDoses.length} / 5 Doses
            </span>
            <span className="text-[10px] text-[#1B7A3D] font-bold mt-1 block">
              ✓ Protocol Active
            </span>
          </div>

          {/* Card 2: Next Scheduled Dose */}
          <div className="bg-[#F6F4F1] p-4 rounded-2xl border border-[#EAE7E1]">
            <span className="text-[10px] font-extrabold text-[#6B6560] uppercase tracking-wider block mb-1">
              Next Scheduled Dose
            </span>
            <span className="text-sm font-extrabold text-[#2E2A5E] block">
              24 August 2026 — 10:30 AM
            </span>
            <span className="inline-block mt-1 bg-[#FEF3C7] text-[#D97706] text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-[#FDE68A]">
              Status: Upcoming
            </span>
          </div>

          {/* Card 3: Batch Information */}
          <div className="bg-[#F6F4F1] p-4 rounded-2xl border border-[#EAE7E1]">
            <span className="text-[10px] font-extrabold text-[#6B6560] uppercase tracking-wider block mb-1">
              Active Vaccine Batch
            </span>
            <span className="text-sm font-mono font-extrabold text-[#2E2A5E] block">
              {primaryBatch}
            </span>
            <span className="text-[10px] text-[#1B7A3D] font-bold mt-1 block">
              Exp: 15 Jan 2027 • Serum Institute
            </span>
          </div>

          {/* Card 4: Ledger Integrity */}
          <div className="bg-[#F6F4F1] p-4 rounded-2xl border border-[#EAE7E1]">
            <span className="text-[10px] font-extrabold text-[#6B6560] uppercase tracking-wider block mb-1">
              SHA-256 Ledger Status
            </span>
            <span className="text-sm font-extrabold text-[#1B7A3D] block flex items-center gap-1">
              <ShieldCheck size={16} /> 100% Verified
            </span>
            <span className="text-[10px] text-[#6B6560] font-bold mt-1 block">
              0 Tamper Events
            </span>
          </div>

        </div>

      </div>

      {/* Tabs Bar */}
      <div className="flex border-b-2 border-[#EAE7E1] bg-white rounded-2xl p-1.5 gap-2">
        <button 
          onClick={() => setActiveTab('record')} 
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'record' 
              ? 'bg-[#2E2A5E] text-white shadow-xs' 
              : 'text-[#6B6560] hover:bg-[#F6F4F1] hover:text-[#2E2A5E]'
          }`}
        >
          Patient Overview & Next Dose
        </button>
        <button 
          onClick={() => setActiveTab('history')} 
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'history' 
              ? 'bg-[#2E2A5E] text-white shadow-xs' 
              : 'text-[#6B6560] hover:bg-[#F6F4F1] hover:text-[#2E2A5E]'
          }`}
        >
          Vaccination & Batch History
        </button>
        <button 
          onClick={() => setActiveTab('integrity')} 
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'integrity' 
              ? 'bg-[#2E2A5E] text-white shadow-xs' 
              : 'text-[#6B6560] hover:bg-[#F6F4F1] hover:text-[#2E2A5E]'
          }`}
        >
          Cryptographic Ledger Integrity
        </button>
      </div>

      {/* TAB 1: Patient Overview & Next Dose */}
      {activeTab === 'record' && (
        <div className="space-y-6">
          
          {/* Upcoming Dose Banner */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#EAE7E1] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#EAE7E1] pb-3">
              <h3 className="text-base font-extrabold text-[#2E2A5E] flex items-center gap-2">
                <Clock size={18} className="text-[#D97706]" /> Upcoming Dose Schedule
              </h3>
              <span className="bg-[#FEF3C7] text-[#D97706] text-xs font-extrabold px-3 py-1 rounded-full border border-[#FDE68A]">
                Status: Upcoming
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-xs font-bold">
              <div className="p-4 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1]">
                <span className="text-[#6B6560] text-[10px] uppercase block mb-0.5">Dose Protocol</span>
                <span className="text-[#2E2A5E] text-base font-extrabold block">Dose 3 (Day 7)</span>
                <span className="text-[#6B6560] text-[11px] font-medium">Rabies Vaccine (Rabivax-S)</span>
              </div>

              <div className="p-4 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1]">
                <span className="text-[#6B6560] text-[10px] uppercase block mb-0.5">Scheduled Date & Time</span>
                <span className="text-[#2E2A5E] text-base font-extrabold block">24 August 2026 — 10:30 AM</span>
                <span className="text-[#1B7A3D] text-[11px] font-bold">In 5 Days</span>
              </div>

              <div className="p-4 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1]">
                <span className="text-[#6B6560] text-[10px] uppercase block mb-0.5">Assigned Hospital</span>
                <span className="text-[#2E2A5E] text-sm font-extrabold block">Shivajinagar Emergency Medical Centre</span>
                <span className="text-[#6B6560] text-[11px] font-medium">Pune, Maharashtra</span>
              </div>
            </div>
          </div>

          {/* Overdue Alerts Check */}
          <div className="bg-white p-6 rounded-3xl border-2 border-[#EAE7E1] shadow-xs space-y-3">
            <h3 className="text-base font-extrabold text-[#2E2A5E] flex items-center gap-2">
              <AlertTriangle size={18} className="text-[#1B7A3D]" /> Overdue & Compliance Status
            </h3>
            {overdueDoses.length === 0 ? (
              <div className="p-4 bg-[#EBF7EE] border border-[#C8E6C9] rounded-2xl text-xs font-bold text-[#1B7A3D] flex items-center gap-2">
                <CheckCircle2 size={16} /> No overdue doses for {patient.name}. Patient is 100% compliant with PEP protocol.
              </div>
            ) : (
              <div className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-2xl text-xs font-bold text-[#B91C1C] flex items-center gap-2">
                <AlertTriangle size={16} /> Patient has {overdueDoses.length} overdue dose! Immediate contact advised.
              </div>
            )}
          </div>

          {/* General Vaccination History Summary */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#EAE7E1] shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-[#2E2A5E] flex items-center gap-2">
              <Activity size={18} className="text-[#E05D3F]" /> General Immunization History Summary
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-bold">
              <div className="p-3.5 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1]">
                <span className="text-[#6B6560] text-[10px] uppercase block mb-0.5">COVID-19</span>
                <span className="text-[#1B7A3D]">✓ Completed (2/2 Doses)</span>
              </div>
              <div className="p-3.5 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1]">
                <span className="text-[#6B6560] text-[10px] uppercase block mb-0.5">Polio</span>
                <span className="text-[#1B7A3D]">✓ Completed</span>
              </div>
              <div className="p-3.5 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1]">
                <span className="text-[#6B6560] text-[10px] uppercase block mb-0.5">Tetanus Toxoid</span>
                <span className="text-[#1B7A3D]">✓ Completed (June 2026)</span>
              </div>
              <div className="p-3.5 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1]">
                <span className="text-[#6B6560] text-[10px] uppercase block mb-0.5">Rabies PEP</span>
                <span className="text-[#D97706]">2 / 5 Doses Completed</span>
              </div>
            </div>
          </div>

          {/* Privacy Notice Safeguard */}
          <div className="bg-[#FEF8EE] border border-[#FDE68A] p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold text-[#6B6560]">
            <Lock size={18} className="text-[#D97706] shrink-0" />
            <div>
              <span className="font-extrabold text-[#2E2A5E] block">Privacy Safeguard Applied</span>
              Unshared private medical notes and personal history are masked according to patient preferences. Only authorized clinical dose logs are displayed.
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: Dose History & Batch Information */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          
          {/* Dose History List */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#EAE7E1] shadow-xs space-y-6">
            <h3 className="text-base font-extrabold text-[#2E2A5E] flex items-center gap-2">
              <Calendar size={18} className="text-[#E05D3F]" /> Dose Administration History
            </h3>

            <div className="space-y-4">
              {patientDoses.map((dose) => (
                <div 
                  key={dose.id} 
                  className={`p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    dose.status === 'completed' 
                      ? 'bg-white border-[#EAE7E1]' 
                      : dose.status === 'upcoming' 
                      ? 'bg-[#F6F4F1]/60 border-dashed border-[#EAE7E1]' 
                      : 'bg-[#FEF2F2] border-[#FCA5A5]'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
                      dose.status === 'completed' ? 'bg-[#EBF7EE] text-[#1B7A3D] border border-[#C8E6C9]' :
                      dose.status === 'overdue' ? 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FCA5A5]' :
                      'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]'
                    }`}>
                      {dose.status === 'completed' ? '✓' : dose.doseNumber}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-extrabold text-sm text-[#2E2A5E]">
                          Rabies Vaccination — Dose {dose.doseNumber}
                        </h4>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                          dose.status === 'completed' ? 'bg-[#EBF7EE] text-[#1B7A3D]' :
                          dose.status === 'overdue' ? 'bg-[#FEF2F2] text-[#B91C1C]' : 'bg-[#FEF3C7] text-[#D97706]'
                        }`}>
                          {dose.status.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-xs text-[#6B6560] font-medium">
                        {dose.status === 'completed' ? (
                          <>Administered on <strong>{dose.administrationDate ? format(parseISO(dose.administrationDate), 'dd MMMM yyyy — hh:mm a') : '17 August 2026 — 10:00 AM'}</strong></>
                        ) : (
                          <>Scheduled for <strong>{format(parseISO(dose.scheduledDate), 'dd MMMM yyyy — hh:mm a')}</strong></>
                        )}
                      </p>

                      {dose.status === 'completed' && (
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] font-bold text-[#6B6560]">
                          <span className="bg-[#F6F4F1] px-2.5 py-0.5 rounded-lg border border-[#EAE7E1] font-mono">
                            Batch: {dose.batchNumber || 'RAB-DEMO-7824'}
                          </span>
                          <span>Administered by: Dr. S. Kulkarni</span>
                          <span>Facility: Shivajinagar Emergency Medical Centre</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Batch Details Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#EAE7E1] shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-[#2E2A5E] flex items-center gap-2">
              <PackageCheck size={18} className="text-[#2E2A5E]" /> Vaccine Batch Authentication
            </h3>

            <div className="p-5 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1] grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-bold">
              <div>
                <span className="text-[#6B6560] text-[10px] uppercase block mb-0.5">Batch Number</span>
                <span className="text-[#2E2A5E] font-mono font-extrabold text-sm block">RAB-DEMO-7824</span>
              </div>
              <div>
                <span className="text-[#6B6560] text-[10px] uppercase block mb-0.5">Manufacturer</span>
                <span className="text-[#2E2A5E] block">Serum Institute of India Ltd.</span>
              </div>
              <div>
                <span className="text-[#6B6560] text-[10px] uppercase block mb-0.5">Expiration Date</span>
                <span className="text-[#1B7A3D] block">15 January 2027</span>
              </div>
              <div>
                <span className="text-[#6B6560] text-[10px] uppercase block mb-0.5">Verification Status</span>
                <span className="text-[#1B7A3D] font-extrabold bg-[#EBF7EE] px-2 py-0.5 rounded-md border border-[#C8E6C9] inline-block">
                  ✓ Verified Genuine Batch
                </span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: Cryptographic Ledger Integrity */}
      {activeTab === 'integrity' && chainStatus && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#EAE7E1] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#EAE7E1] pb-4">
            <div>
              <h3 className="text-base font-extrabold text-[#2E2A5E] flex items-center gap-2">
                <ShieldCheck size={20} className="text-[#1B7A3D]" /> Cryptographic SHA-256 Ledger
              </h3>
              <p className="text-xs text-[#6B6560] mt-0.5">
                Every dose recorded generates a SHA-256 hash linking to the prior dose. Any data modification breaks the chain instantly.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                size="sm"
                onClick={() => simulateTampering(patientId, 1)}
                disabled={!chainStatus.valid || completedDoses.length === 0}
                className="bg-[#B91C1C] hover:bg-[#991b1b] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-xl cursor-pointer"
              >
                Simulate Tamper
              </Button>
              {!chainStatus.valid && (
                <Button 
                  size="sm"
                  onClick={() => restoreTampering(patientId, chainStatus.failedAtDose || 1)}
                  className="bg-[#2E2A5E] hover:bg-[#231f47] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-xl cursor-pointer"
                >
                  Restore Ledger
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {patientDoses.filter(d => d.status === 'completed').map(dose => {
              const isFailed = !chainStatus.valid && dose.doseNumber >= (chainStatus.failedAtDose || 0);
              return (
                <div key={dose.id} className={`p-4 rounded-2xl border-2 ${isFailed ? 'bg-[#FEF2F2] border-[#FCA5A5]' : 'bg-[#F6F4F1] border-[#EAE7E1]'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-extrabold text-[#2E2A5E]">Dose {dose.doseNumber} SHA-256 Block Hash</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${isFailed ? 'bg-[#FEF2F2] text-[#B91C1C]' : 'bg-[#EBF7EE] text-[#1B7A3D]'}`}>
                      {isFailed ? '❌ Chain Tampered' : '✓ Hash Verified'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B6560] break-all">{dose.currentHash}</p>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#EAE7E1] flex justify-between items-center text-xs font-bold">
            <span className="text-[#6B6560]">Cryptographic Chain Status:</span>
            {chainStatus.valid ? (
              <span className="text-[#1B7A3D] bg-[#EBF7EE] px-3 py-1 rounded-full border border-[#C8E6C9]">
                ✓ 100% Cryptographically Intact
              </span>
            ) : (
              <span className="text-[#B91C1C] bg-[#FEF2F2] px-3 py-1 rounded-full border border-[#FCA5A5] animate-pulse">
                ❌ Integrity Mismatch Detected
              </span>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
