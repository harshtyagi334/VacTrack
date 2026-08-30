import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ExportVaccinationReportModal } from '../components/ExportVaccinationReportModal';
import { PatientVaccinationSearchBar } from '../components/PatientVaccinationSearchBar';
import { 
  CheckCircle2, Circle, Clock, ShieldCheck, 
  MapPin, HeartPulse, Activity, QrCode, Calendar, Hospital, ArrowRight, X, User, Shield,
  Bell, AlertTriangle, FileText, Download, Printer, Search, Landmark, ExternalLink, ScanBarcode
} from 'lucide-react';

export function PatientDashboard() {
  const { currentUser, currentPatientId, patients, doses, clinics, getProfileReminders } = useAppStore();
  const [showQrModal, setShowQrModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!currentPatientId && !currentUser) return null;

  const activePatientId = currentPatientId || currentUser?.patientId || 'p_demo_1';

  const patient = patients[activePatientId] || {
    id: activePatientId,
    name: currentUser?.name || 'Harsh Tyagi',
    phone: currentUser?.phone || '07387513560',
    email: currentUser?.email || 'patient.demo@example.com',
    dob: '2004-04-02',
    city: 'Pune',
    state: 'Maharashtra',
    pinCode: '411005',
    address: 'Shivajinagar, Pune, Maharashtra',
    exposureDate: '2026-08-17',
    exposureCategory: 'III' as const,
    healthRecord: {
      bloodGroup: 'B+',
      allergies: ['Penicillin'],
      medicalConditions: ['Asthma (Mild)'],
      medications: ['Salbutamol Inhaler (As needed)'],
      previousVaccinations: [
        { name: 'COVID-19 Booster', date: '2023-01-14' },
        { name: 'Polio (OPV)', date: '2009-03-10' }
      ],
      privacySettings: {
        shareBloodGroup: true,
        shareAllergies: true,
        shareVaccinationHistory: true,
        shareMedicalConditions: false,
        shareMedications: false
      }
    }
  };

  const patientDoses = doses[activePatientId] || [];
  const completedCount = patientDoses.filter(d => d.status === 'completed').length || 2;
  const totalDoses = 5;
  const healthRecord = patient.healthRecord;

  // Retrieve smart profile reminders
  const reminders = getProfileReminders(activePatientId);
  const urgentReminder = reminders.find(r => r.urgency === 'critical') || reminders[0];

  // Active name & dynamic time greeting
  const fullName = currentUser?.name || patient.name || 'Harsh Tyagi';
  const firstName = fullName.split(' ')[0] || 'Harsh';

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const greeting = getGreeting();

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6 sm:space-y-8">
        
      {/* Header with Greeting & Location */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 lg:p-8 rounded-3xl border-2 border-[#EAE7E1] shadow-xs hover:border-[#2E2A5E]/20 transition-all duration-200 min-w-0">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#F6F4F1] text-[#E05D3F] border border-[#EAE7E1]">
              <ShieldCheck size={13} className="text-[#1B7A3D]" /> VacTrack Patient Portal
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#EEF2FF] text-[#2E2A5E] border border-[#C7D2FE]">
              <Clock size={12} className="text-[#E05D3F]" /> {format(currentTime, 'dd MMM yyyy • hh:mm:ss a')}
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#2E2A5E] tracking-tight truncate">
            {greeting}, {firstName}
          </h1>
          <p className="text-[#6B6560] text-xs sm:text-sm mt-1 font-medium leading-relaxed">
            Your immunization records are active, verified, and synchronized.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            onClick={() => setShowExportModal(true)}
            className="bg-[#2E2A5E] hover:bg-[#201c45] active:scale-95 text-white px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <FileText size={15} className="text-[#F2A93B]" />
            <span>Export Medical PDF</span>
          </Button>
        </div>
      </header>

      {/* TOP HEALTH SUMMARY & EMERGENCY ACCESS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 min-w-0">
        {/* Health Summary Card */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-[#EAE7E1] shadow-xs hover:border-[#1B7A3D]/30 transition-all duration-200 space-y-4 flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE7E1] gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 bg-[#EEF2FF] text-[#2E2A5E] rounded-xl shrink-0">
                <Activity size={18} />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#2E2A5E] truncate">Health & Immunization Summary</h3>
            </div>
            <span className="text-[10px] text-[#E05D3F] font-bold uppercase tracking-wider bg-[#FEF3F2] px-2.5 py-1 rounded-full border border-[#FECDCA] shrink-0">Verified Record</span>
          </div>
          
          <div className="space-y-4 min-w-0">
            <div className="bg-[#F6F4F1] p-3.5 rounded-2xl border border-[#EAE7E1] min-w-0">
              <p className="text-[10px] uppercase font-extrabold tracking-wider text-[#8A847F]">Next Scheduled Dose</p>
              <p className="font-bold text-sm sm:text-base text-[#2E2A5E] mt-0.5 truncate">Rabies PEP — Dose 3</p>
              <div className="flex justify-between items-center mt-1.5 gap-2">
                <p className="text-xs font-semibold text-[#6B6560]">Due: 30 Aug 2026</p>
                <span className="bg-[#FFFBEB] text-[#D97706] text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border border-[#FDE68A] shrink-0">Upcoming</span>
              </div>
            </div>
            
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="bg-[#EBF7EE] p-3.5 rounded-2xl border border-[#C8E6C9] min-w-0">
                <p className="text-[10px] uppercase font-extrabold tracking-wider text-[#1B7A3D]">Vaccinations Completed</p>
                <p className="font-black text-2xl text-[#1B7A3D] mt-0.5">{completedCount} <span className="text-xs font-bold text-[#1B7A3D]/70">/ {totalDoses}</span></p>
              </div>
              <div className="bg-[#EEF2FF] p-3.5 rounded-2xl border border-[#C7D2FE] min-w-0">
                <p className="text-[10px] uppercase font-extrabold tracking-wider text-[#2E2A5E]">Medical Records</p>
                <p className="font-black text-2xl text-[#2E2A5E] mt-0.5">12</p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Assistance Card */}
        <div className="bg-[#2E2A5E] p-5 sm:p-6 rounded-3xl border-2 border-[#1E1B4B] text-white shadow-md hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4 relative overflow-hidden min-w-0">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-[#E05D3F]/20 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-3 relative z-10 min-w-0">
            <h3 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
              <AlertTriangle size={18} className="text-[#F2A93B] shrink-0" /> Emergency Triage & Facilities
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-[#EAE7E1] bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 w-fit max-w-full">
              <MapPin size={14} className="shrink-0 text-[#E05D3F]" />
              <p className="font-bold truncate">Pune, Maharashtra Triage Network</p>
            </div>
            <p className="text-xs text-[#D9D4CB] leading-relaxed">
              Locate 24/7 rabies post-exposure prophylaxis (PEP) clinics, anti-venom centers, and emergency trauma ICUs near you.
            </p>
          </div>
          <Link to="/patient/hospitals" className="block w-full pt-2 relative z-10">
            <Button className="w-full bg-[#E05D3F] hover:bg-[#c94f33] active:scale-98 text-white font-extrabold text-xs py-3 rounded-2xl shadow-sm border-none cursor-pointer flex items-center justify-center gap-2 transition-all">
              <span>Find Nearby Emergency Facilities</span>
              <ArrowRight size={15} />
            </Button>
          </Link>
        </div>
      </div>

      {/* Medicine & Vaccine Verification Card */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-[#EAE7E1] shadow-xs hover:border-[#2E2A5E]/20 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-[#EEF2FF] text-[#2E2A5E] flex items-center justify-center shrink-0 border border-[#C7D2FE]">
            <ScanBarcode size={22} className="text-[#E05D3F]" />
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#2E2A5E]">
                Medicine & Vaccine Verification
              </h3>
              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 bg-[#F6F4F1] text-[#6B6560] rounded-md border border-[#EAE7E1] hidden sm:inline-block">
                Demo Traceability
              </span>
            </div>
            <p className="text-xs text-[#6B6560] leading-relaxed">
              Check medicine or vaccine traceability information.
            </p>
          </div>
        </div>

        <div className="shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EAE7E1]/80">
          <Link to="/patient/verification" className="block sm:inline-block">
            <Button className="w-full sm:w-auto bg-[#2E2A5E] hover:bg-[#201c45] active:scale-95 text-white text-xs font-extrabold px-5 py-3 rounded-2xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all">
              <span>Verify Product</span>
              <ArrowRight size={14} className="text-[#F2A93B]" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile-Based Vaccination Reminder Banner */}
      {urgentReminder && (
        <div className={`p-5 rounded-3xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs transition-all duration-200 ${
          urgentReminder.urgency === 'critical' ? 'bg-[#FEF2F2] border-[#FCA5A5]' :
          urgentReminder.status === 'due_today' ? 'bg-[#FFFBEB] border-[#FCD34D]' :
          'bg-white border-[#EAE7E1]'
        }`}>
          <div className="flex items-start gap-3.5">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              urgentReminder.urgency === 'critical' ? 'bg-[#B91C1C] text-white shadow-2xs' :
              urgentReminder.status === 'due_today' ? 'bg-[#D97706] text-white shadow-2xs' :
              'bg-[#2E2A5E] text-white shadow-2xs'
            }`}>
              {urgentReminder.urgency === 'critical' ? <AlertTriangle size={20} /> : <Bell size={20} />}
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md ${
                  urgentReminder.urgency === 'critical' ? 'bg-[#B91C1C] text-white' :
                  urgentReminder.status === 'due_today' ? 'bg-[#D97706] text-white' :
                  'bg-[#2E2A5E] text-white'
                }`}>
                  {urgentReminder.status === 'overdue' ? 'Overdue Action Required' :
                   urgentReminder.status === 'due_today' ? 'Due Today' : 'Upcoming Dose'}
                </span>
                <span className="text-xs font-bold text-[#8A847F]">
                  Scheduled: {urgentReminder.dueDateFormatted}
                </span>
              </div>
              <h4 className="font-bold text-sm sm:text-base text-[#2E2A5E]">
                {urgentReminder.title}
              </h4>
              <p className="text-xs text-[#6B6560] line-clamp-2 leading-relaxed">
                {urgentReminder.message}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EAE7E1]/80">
            <Link to="/patient/notifications">
              <Button size="sm" className="bg-[#E05D3F] hover:bg-[#c94f33] active:scale-95 text-white text-xs font-bold rounded-xl px-4 py-2.5 shadow-xs whitespace-normal sm:whitespace-nowrap text-center cursor-pointer transition-all">
                View Reminders & Dispatches →
              </Button>
            </Link>
            <span className="text-[10px] text-[#8A847F] font-semibold hidden sm:inline">
              ✓ SMS & WhatsApp Active
            </span>
          </div>
        </div>
      )}

      {/* Interactive Dose Timeline & Progress */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#EAE7E1] shadow-xs hover:border-[#2E2A5E]/20 transition-all duration-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[#EBF7EE] text-[#1B7A3D] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-[#C8E6C9]">
              <ShieldCheck size={14} /> Active Schedule • Rabies Post-Exposure
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-[#2E2A5E] tracking-tight">
              Post-Exposure Prophylaxis (PEP) Progress
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6560] leading-relaxed">
              Strict 5-dose protocol (Day 0, 3, 7, 14, 28) following WHO Guidelines.
            </p>
          </div>

          <div className="bg-[#FFFBEB] p-5 sm:p-6 rounded-2xl border-2 border-[#FDE68A] xl:w-80 shrink-0 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#92400E] uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={14} className="text-[#D97706]" /> Next Scheduled Dose
              </span>
              <span className="bg-[#D97706] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase">
                Dose 3
              </span>
            </div>

            <div className="text-xl sm:text-2xl font-extrabold text-[#2E2A5E]">
              30 August 2026
            </div>

            <div className="text-sm font-bold text-[#D97706] flex items-center gap-1.5">
              <span>⏰ 10:30 AM</span>
              <span className="text-xs text-[#8A847F] font-normal">• Shivajinagar Centre</span>
            </div>

            <Link to="/patient/appointments" className="block pt-1">
              <Button size="sm" className="w-full py-2.5 text-xs font-bold rounded-xl shadow-2xs bg-white text-[#2E2A5E] hover:bg-[#F6F4F1] border border-[#FDE68A] cursor-pointer transition-all">
                View Appointment Details →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Modals */}
      <ExportVaccinationReportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        patient={patient}
        doses={patientDoses}
        clinics={clinics}
        healthRecord={healthRecord}
      />

    </div>
  );
}
