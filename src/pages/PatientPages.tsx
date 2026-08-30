import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../store';
import { PatientDashboard } from './PatientDashboard';
import { PatientHealthRecord } from './PatientHealthRecord';
import { PatientEmergencyCare } from './PatientEmergencyCare';
import { PatientNearbyHospitals } from './PatientNearbyHospitals';
import { PatientInsurance } from './PatientInsurance';
import { MedicineVerificationPage } from './MedicineVerificationPage';
import { RabiesPEPInteractiveSchedule } from '../components/RabiesPEPInteractiveSchedule';
import { PortalBreadcrumbHeader } from '../components/PortalBreadcrumbHeader';
import { PatientNotificationCenter } from '../components/PatientNotificationCenter';
import { ExportVaccinationReportModal } from '../components/ExportVaccinationReportModal';
import { PatientVaccinationSearchBar } from '../components/PatientVaccinationSearchBar';
import { 
  ShieldCheck, Calendar, Bell, Settings, User, HeartPulse, Activity, 
  QrCode, Hospital, CheckCircle2, Clock, AlertTriangle, Download, 
  Printer, Globe, Sliders, RefreshCw, Eye, EyeOff, MapPin, Check, LogOut, ExternalLink, Shield, Home, ArrowLeft,
  Menu, X, FileText, Landmark, ScanBarcode
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { QRCodeSVG } from 'qrcode.react';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';

export function PatientLayout() {
  const { currentUser, alerts, logout } = useAppStore();
  const location = useLocation();

  if (!currentUser || currentUser.role !== 'patient') {
    return <div className="p-8 text-center">Unauthorized. Please log in as a patient.</div>;
  }

  const unreadAlertsCount = alerts.filter(a => !a.read).length;

  const links = [
    { path: '/', label: 'Home', icon: <Home size={18} />, isHome: true },
    { path: '/patient/dashboard', label: 'Dashboard', icon: <ShieldCheck size={18} /> },
    { path: '/patient/vaccinations', label: 'My Vaccination', icon: <CheckCircle2 size={18} /> },
    { path: '/patient/record', label: 'My Health Record', icon: <Activity size={18} /> },
    { path: '/for-patients', label: 'Government Benefits', icon: <Landmark size={18} /> },
    { path: '/patient/appointments', label: 'Appointments', icon: <Calendar size={18} /> },
    { path: '/patient/qr', label: 'QR Record', icon: <QrCode size={18} /> },
    { path: '/patient/verification', label: 'Medicine Verification', icon: <ScanBarcode size={18} /> },
    { path: '/patient/insurance', label: 'Insurance & Protection', icon: <Shield size={18} /> },
    { path: '/patient/emergency', label: 'Emergency Care', icon: <HeartPulse size={18} /> },
    { path: '/patient/hospitals', label: 'Nearby Hospitals', icon: <Hospital size={18} /> },
    { 
      path: '/patient/notifications', 
      label: 'Notifications', 
      icon: <Bell size={18} />,
      badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined 
    },
    { path: '/patient/profile', label: 'Profile', icon: <User size={18} /> },
    { path: '/patient/settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeLink = links.find(l => !l.isHome && location.pathname === l.path);

  return (
    <div className="flex flex-col md:flex-row flex-1 min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)]">
      {/* Mobile Top Bar (< md) with Hamburger */}
      <div className="md:hidden bg-white border-b border-[#EAE7E1] px-4 py-3 flex items-center justify-between shadow-2xs sticky top-[64px] sm:top-[72px] z-30">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#E05D3F]/10 text-[#E05D3F] font-black flex items-center justify-center border border-[#E05D3F]/20 text-xs shrink-0">
            {currentUser.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-extrabold uppercase text-[#8A847F] tracking-wider leading-none">Patient Portal</div>
            <div className="text-xs font-heading font-extrabold text-[#2E2A5E] truncate mt-0.5">
              {activeLink ? activeLink.label : 'Dashboard'}
            </div>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#F6F4F1] hover:bg-[#EAE7E1] text-[#2E2A5E] rounded-xl text-xs font-extrabold border border-[#EAE7E1] transition-colors min-h-[44px] min-w-[44px] cursor-pointer"
          aria-label="Toggle Portal Navigation"
        >
          {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          <span>{mobileMenuOpen ? 'Close' : 'Menu'}</span>
        </button>
      </div>

      {/* Mobile Menu Drawer (< md) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b-2 border-[#EAE7E1] px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150 z-20">
          <nav className="flex flex-col gap-1">
            {links.map((link) => {
              const isActive = !link.isHome && location.pathname === link.path;
              return (
                <React.Fragment key={link.path}>
                  {link.isHome ? (
                    <Link
                      to="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-3 rounded-xl text-xs font-extrabold text-[#2E2A5E] bg-[#F6F4F1] hover:bg-[#2E2A5E] hover:text-white border border-[#EAE7E1] transition-all mb-1 min-h-[44px]"
                    >
                      <div className="flex items-center gap-2.5">
                        <Home size={16} className="text-[#E05D3F]" />
                        <span>⌂ Main Website (Home)</span>
                      </div>
                      <span className="text-[10px] font-bold bg-white text-[#8A847F] px-1.5 py-0.5 rounded border border-[#EAE7E1]">
                        Public
                      </span>
                    </Link>
                  ) : (
                    <Link
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-extrabold transition-all min-h-[44px] ${
                        isActive
                          ? 'bg-[#E05D3F] text-white shadow-xs'
                          : 'text-[#6B6560] hover:bg-[#F6F4F1] hover:text-[#2E2A5E]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {link.icon}
                        <span>{link.label}</span>
                      </div>
                      {link.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isActive ? 'bg-white text-[#E05D3F]' : 'bg-[#E05D3F] text-white'
                        }`}>
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-[#EAE7E1] flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
                window.location.href = '/login';
              }}
              className="flex items-center gap-2 px-3 py-2.5 text-xs font-extrabold text-[#B91C1C] hover:bg-[#FEF2F2] rounded-xl transition-colors min-h-[44px] cursor-pointer"
            >
              <LogOut size={16} />
              <span>Logout Patient Account</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sticky Sidebar (md:flex) */}
      <aside className="hidden md:flex md:w-64 lg:w-[280px] bg-gradient-to-b from-[#FBFBFA] to-white border-r border-[#EAE7E1] flex-col shrink-0 z-30">
        <div className="sticky top-[64px] sm:top-[72px] h-[calc(100vh-64px)] sm:h-[calc(100vh-72px)] flex flex-col justify-between p-5 sm:p-6 space-y-4 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#EAE7E1] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#8A847F]">
          <div>
            <div className="mb-5 hidden md:block border-b border-[#EAE7E1] pb-4">
               <div className="flex items-center gap-2.5">
                 <div className="w-10 h-10 rounded-2xl bg-[#E05D3F]/10 text-[#E05D3F] font-bold flex items-center justify-center border border-[#E05D3F]/20">
                   {currentUser.name.charAt(0)}
                 </div>
                 <div>
                   <h3 className="font-extrabold text-sm text-[#2E2A5E]">{currentUser.name}</h3>
                   <p className="text-xs text-[#8A847F] font-medium">Patient • Pune</p>
                 </div>
               </div>
            </div>

            <nav className="flex flex-col gap-1.5">
              {links.map((link, idx) => {
                const isActive = !link.isHome && location.pathname === link.path;
                return (
                  <React.Fragment key={link.path}>
                    {link.isHome && (
                      <Link
                        to="/"
                        className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold text-[#2E2A5E] bg-[#F6F4F1] hover:bg-[#2E2A5E] hover:text-white border border-[#EAE7E1] transition-all duration-200 ease-in-out hover:scale-[1.02] hover:-translate-y-0.5 mb-2 shadow-2xs group"
                        title="Return to Main VacTrack Website"
                      >
                        <div className="flex items-center gap-2.5">
                          <Home size={16} className="text-[#E05D3F] group-hover:text-white transition-colors duration-200" />
                          <span>⌂ Main Website (Home)</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white group-hover:bg-white/20 text-[#8A847F] group-hover:text-white px-1.5 py-0.5 rounded border border-[#EAE7E1] group-hover:border-transparent transition-all duration-200">
                          Public
                        </span>
                      </Link>
                    )}
                    {!link.isHome && (
                      <Link 
                        to={link.path} 
                        className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 ease-in-out transform ${
                          isActive 
                            ? 'bg-[#E05D3F] text-white shadow-md translate-x-1 scale-[1.01]' 
                            : 'text-[#6B6560] hover:bg-white hover:text-[#2E2A5E] hover:shadow-2xs hover:translate-x-1'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                            {link.icon}
                          </div>
                          <span>{link.label}</span>
                        </div>
                        {link.badge && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold transition-colors duration-200 ${
                            isActive ? 'bg-white text-[#E05D3F]' : 'bg-[#E05D3F] text-white'
                          }`}>
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          </div>

          {/* Logout Button */}
          <div className="pt-4 border-t border-[#EAE7E1] mt-auto shrink-0">
            <button 
              onClick={() => {
                logout();
                window.location.href = '/login';
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-extrabold text-[#B91C1C] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              <span>Logout Account</span>
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 bg-[#F6F4F1] min-w-0 flex flex-col relative">
        {/* Universal Portal Breadcrumbs & Back Navigation Header */}
        <PortalBreadcrumbHeader portalType="patient" />

        <motion.div 
          key={location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full flex-1 flex flex-col p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 pb-28 min-w-0"
        >
              <Routes location={location}>
                <Route path="/dashboard" element={<PatientDashboard />} />
                <Route path="/vaccinations" element={<PatientVaccinations />} />
                <Route path="/record" element={<PatientHealthRecord />} />
                <Route path="/appointments" element={<PatientAppointments />} />
                <Route path="/qr" element={<PatientQrRecord />} />
                <Route path="/verification" element={<MedicineVerificationPage />} />
                <Route path="/insurance" element={<PatientInsurance />} />
                <Route path="/emergency" element={<PatientEmergencyCare />} />
                <Route path="/hospitals" element={<PatientNearbyHospitals />} />
                <Route path="/notifications" element={<PatientNotifications />} />
                <Route path="/profile" element={<PatientProfile />} />
                <Route path="/settings" element={<PatientSettings />} />
              </Routes>
        </motion.div>
      </main>
    </div>
  );
}

// 1. My Vaccination Page
function PatientVaccinations() {
  const { currentPatientId, currentUser, patients, doses, clinics, verifyChain } = useAppStore();
  const [showExportModal, setShowExportModal] = useState(false);
  
  const activePatientId = currentPatientId || currentUser?.patientId || 'p_demo_1';
  const patient = patients[activePatientId] || {
    id: activePatientId,
    name: currentUser?.name || 'Demo Patient',
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
  const chainVerification = verifyChain(activePatientId);

  return (
    <div className="w-full space-y-6">
      
      {/* Interactive Rabies PEP Schedule & Automated Reminder Fast-Forward Engine */}
      <RabiesPEPInteractiveSchedule />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#EAE7E1] pt-6">
        <div>
          <h1 className="text-3xl font-bold font-heading text-[var(--color-secondary)]">My Vaccination Journey</h1>
          <p className="text-sm text-gray-500 mt-1">Rabies Post-Exposure Prophylaxis (PEP) — 5-Dose Ledger</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => setShowExportModal(true)}
            className="bg-[#2E2A5E] hover:bg-[#201c45] text-white px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <FileText size={14} className="text-[#F2A93B]" />
            <span>Export Medical PDF</span>
          </Button>
          <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold ${
            chainVerification.valid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <ShieldCheck size={16} />
            <span>{chainVerification.valid ? 'Chain Integrity: 100% Cryptographically Verified' : 'Warning: Hash chain mismatch detected'}</span>
          </div>
        </div>
      </div>

      {/* Global Vaccination History Search Bar */}
      <PatientVaccinationSearchBar
        patient={patient}
        doses={patientDoses}
        clinics={clinics}
        onExportPdfClick={() => setShowExportModal(true)}
      />

      <div className="space-y-4">
        {patientDoses.map((dose) => (
          <div key={dose.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                dose.status === 'completed' ? 'bg-green-100 text-green-700' :
                dose.status === 'overdue' ? 'bg-red-100 text-red-700' :
                dose.status === 'due_today' ? 'bg-amber-100 text-amber-800' :
                'bg-gray-100 text-gray-400'
              }`}>
                {dose.status === 'completed' ? '✓' : dose.doseNumber}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-[var(--color-secondary)]">Dose {dose.doseNumber}</h3>
                  <Badge status={dose.status}>
                    {dose.status === 'completed' ? 'Verified & Completed' : dose.status === 'due_today' ? 'Due Today' : dose.status === 'overdue' ? 'Overdue' : 'Upcoming'}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Scheduled: {format(parseISO(dose.scheduledDate), 'dd MMMM yyyy')}
                  {dose.administrationDate && ` • Administered: ${format(parseISO(dose.administrationDate), 'dd MMMM yyyy')}`}
                </p>
                {dose.status === 'completed' && (
                  <div className="mt-2 text-xs text-gray-600 space-y-0.5">
                    <p><span className="font-semibold text-gray-700">Vaccine:</span> {dose.vaccineName || 'Rabies Vaccine (Rabivax-S)'}</p>
                    <p><span className="font-semibold text-gray-700">Batch Number:</span> <span className="font-mono">{dose.batchNumber || 'RAB-DEMO-7824'}</span></p>
                    <p><span className="font-semibold text-gray-700">Administered At:</span> {clinics[dose.clinicId || 'hosp_1']?.name || 'Shivajinagar Emergency Medical Centre'}</p>
                  </div>
                )}
              </div>
            </div>
            {dose.status === 'completed' ? (
              <div className="self-end sm:self-center">
                <span className="text-xs font-mono text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 block sm:inline text-center">
                  SHA-256: {dose.currentHash ? dose.currentHash.substring(0, 10) + '...' : 'Verified'}
                </span>
              </div>
            ) : (
              <Link to="/patient/appointments" className="self-end sm:self-center">
                <Button size="sm" variant="outline" className="text-xs">
                  Schedule Dose →
                </Button>
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Routine History */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm mt-8">
        <h3 className="font-bold text-lg text-[var(--color-secondary)] mb-4">Past Immunization History</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <span className="text-xs text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded uppercase">Verified</span>
            <h4 className="font-bold text-gray-900 mt-2">COVID-19 Booster</h4>
            <p className="text-xs text-gray-500 mt-1">Date: 20 August 2021</p>
            <p className="text-[11px] font-mono text-gray-400 mt-1">Batch: CVX-DEMO-2601</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <span className="text-xs text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded uppercase">Verified</span>
            <h4 className="font-bold text-gray-900 mt-2">Polio (OPV/IPV)</h4>
            <p className="text-xs text-gray-500 mt-1">Date: 15 March 2008</p>
            <p className="text-[11px] font-mono text-gray-400 mt-1">Batch: POL-DEMO-9912</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <span className="text-xs text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded uppercase">Verified</span>
            <h4 className="font-bold text-gray-900 mt-2">Tetanus Toxoid (TT)</h4>
            <p className="text-xs text-gray-500 mt-1">Date: 12 June 2026</p>
            <p className="text-[11px] font-mono text-gray-400 mt-1">Batch: TET-DEMO-3341</p>
          </div>
        </div>
      </div>

      <ExportVaccinationReportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        patient={patient}
        doses={patientDoses}
        clinics={clinics}
        healthRecord={patient.healthRecord}
      />
    </div>
  );
}

// 2. Patient QR Record Page
function PatientQrRecord() {
  const { currentPatientId, currentUser, patients, doses, clinics } = useAppStore();
  const [copied, setCopied] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  
  const activePatientId = currentPatientId || currentUser?.patientId || 'p_demo_1';
  const patient = patients[activePatientId] || {
    id: activePatientId,
    name: currentUser?.name || 'Demo Patient',
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
  const record = patient.healthRecord || {
    bloodGroup: 'B+',
    allergies: ['Penicillin'],
    medicalConditions: ['Asthma (Mild)'],
    medications: ['Salbutamol Inhaler (As needed)'],
    previousVaccinations: [],
    privacySettings: {
      shareBloodGroup: true,
      shareAllergies: true,
      shareVaccinationHistory: true,
      shareMedicalConditions: false,
      shareMedications: false
    }
  };
  const privacySettings = record?.privacySettings || {
    shareBloodGroup: true,
    shareAllergies: true,
    shareVaccinationHistory: true,
    shareMedicalConditions: false,
    shareMedications: false
  };

  const handleCopyLink = () => {
    const link = typeof window !== 'undefined' ? `${window.location.origin}/verify/patient/${patient.id}` : `https://vactrack.health/verify/patient/${patient.id}`;
    navigator.clipboard?.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrVerifyUrl = typeof window !== 'undefined' ? `${window.location.origin}/verify/patient/${patient.id}` : `https://vactrack.health/verify/patient/${patient.id}`;

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading text-[var(--color-secondary)]">My QR Health Record</h1>
        <p className="text-sm text-gray-500 mt-1">Present this QR code to any hospital or paramedic for instant, verified emergency access.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border-2 border-[#EAE7E1] shadow-md text-center space-y-6">
        <div className="inline-block p-4 bg-white border-4 border-[var(--color-primary)]/20 rounded-3xl shadow-inner">
          <QRCodeSVG value={qrVerifyUrl} size={200} />
        </div>

        <div>
          <div className="inline-flex items-center gap-2 bg-[#EBF7EE] text-[#1B7A3D] font-extrabold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider mb-2 border border-[#C8E6C9]">
            <ShieldCheck size={14} /> VacTrack Verified Health Record
          </div>
          <h2 className="text-2xl font-extrabold text-[#2E2A5E]">{currentUser?.name || patient.name || 'Harsh Tyagi'}</h2>
          <p className="text-sm font-semibold text-[#6B6560]">
            Record ID: VT-DEMO-2026-00016 • Born {patient.dob ? format(parseISO(patient.dob), 'dd MMMM yyyy') : '02 April 2004'}
          </p>
        </div>

        <div className="bg-[#F6F4F1] p-5 rounded-2xl text-left text-xs sm:text-sm space-y-3.5 border border-[#EAE7E1] max-w-md mx-auto">
          {/* Patient Name */}
          <div className="flex justify-between items-center border-b border-[#EAE7E1] pb-2">
            <span className="text-[#6B6560] font-bold">Patient:</span>
            <span className="font-extrabold text-[#2E2A5E]">{currentUser?.name || patient.name || 'Harsh Tyagi'}</span>
          </div>

          {/* DOB */}
          <div className="flex justify-between items-center border-b border-[#EAE7E1] pb-2">
            <span className="text-[#6B6560] font-bold">DOB:</span>
            <span className="font-extrabold text-[#2E2A5E]">
              {patient.dob ? format(parseISO(patient.dob), 'dd MMMM yyyy') : '02 April 2004'}
            </span>
          </div>

          {/* Blood Group */}
          <div className="flex justify-between items-center border-b border-[#EAE7E1] pb-2">
            <span className="text-[#6B6560] font-bold">Blood Group:</span>
            {privacySettings.shareBloodGroup ? (
              <span className="font-extrabold text-[#DC2626] bg-[#FEF2F2] px-2.5 py-0.5 rounded-lg border border-[#FCA5A5]">
                {record?.bloodGroup || 'B+'}
              </span>
            ) : (
              <span className="text-[11px] text-[#8A847F] italic font-semibold">Hidden by Patient Privacy Settings</span>
            )}
          </div>

          {/* Vaccinations */}
          <div className="border-b border-[#EAE7E1] pb-2.5 space-y-1.5">
            <span className="text-[#6B6560] font-bold block">Vaccinations:</span>
            {privacySettings.shareVaccinationHistory ? (
              <div className="space-y-1 text-xs font-extrabold pl-1">
                <div className="flex justify-between text-[#1B7A3D]">
                  <span>COVID-19</span>
                  <span>✓ Completed</span>
                </div>
                <div className="flex justify-between text-[#1B7A3D]">
                  <span>Polio</span>
                  <span>✓ Completed</span>
                </div>
                <div className="flex justify-between text-[#1B7A3D]">
                  <span>Tetanus</span>
                  <span>✓ Completed</span>
                </div>
                <div className="flex justify-between text-[#E05D3F]">
                  <span>Rabies PEP</span>
                  <span>2/5</span>
                </div>
              </div>
            ) : (
              <span className="text-[11px] text-[#8A847F] italic font-semibold block">Hidden by Patient Privacy Settings</span>
            )}
          </div>

          {/* Allergies */}
          <div className="flex justify-between items-center border-b border-[#EAE7E1] pb-2">
            <span className="text-[#6B6560] font-bold">Allergies:</span>
            {privacySettings.shareAllergies ? (
              <span className="font-extrabold text-[#991B1B]">
                {record?.allergies?.length ? record.allergies.join(', ') : 'None reported'}
              </span>
            ) : (
              <span className="text-[11px] text-[#8A847F] italic font-semibold">Hidden by Patient Privacy Settings</span>
            )}
          </div>

          {/* Verification Status */}
          <div className="pt-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 text-xs">
            <span className="text-[#1B7A3D] font-extrabold flex items-center gap-1">
              ✓ VacTrack Record Verified
            </span>
            <span className="text-[#8A847F] font-mono font-bold">
              Record ID: VT-DEMO-2026-00016
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link to={`/verify/patient/${patient.id}`} target="_blank" className="inline-flex items-center gap-2 bg-[#2E2A5E] hover:bg-[#201c45] text-white px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-xs">
            <ExternalLink size={16} className="text-[#F2A93B]" /> Open Public Verification Record
          </Link>
          <Button onClick={handleCopyLink} variant="outline" className="flex items-center gap-2 rounded-xl text-xs font-bold">
            {copied ? <Check size={16} className="text-green-600" /> : <QrCode size={16} />}
            {copied ? 'Link Copied!' : 'Copy Verification Link'}
          </Button>
          <Button 
            onClick={() => setShowExportModal(true)} 
            className="bg-[#E05D3F] hover:bg-[#c94d31] text-white flex items-center gap-2 rounded-xl text-xs font-extrabold cursor-pointer"
          >
            <FileText size={16} /> Export Medical PDF Report
          </Button>
        </div>
      </div>

      <ExportVaccinationReportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        patient={patient}
        doses={patientDoses}
        clinics={clinics}
        healthRecord={patient.healthRecord}
      />
    </div>
  );
}

// 3. Appointments Page
const AVAILABLE_TIMES = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
  '02:00 PM', '02:30 PM', '03:00 PM', '04:00 PM'
];

function PatientAppointments() {
  const { appointments, currentUser, clinics, bookAppointment, doses } = useAppStore();
  const [selectedDate, setSelectedDate] = useState('2026-08-24');
  const [selectedClinic, setSelectedClinic] = useState('hosp_1');
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const myAppointments = appointments.filter(a => a.patientId === currentUser?.patientId);
  const patientDoses = currentUser?.patientId ? doses[currentUser.patientId] : [];
  const nextDose = patientDoses?.find(d => d.status !== 'completed');

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !selectedClinic || !currentUser?.patientId) return;

    bookAppointment({
      patientId: currentUser.patientId,
      clinicId: selectedClinic,
      doseNumber: nextDose ? nextDose.doseNumber : 0,
      serviceName: nextDose ? `Rabies Vaccination — Dose ${nextDose.doseNumber}` : 'Vaccination Review',
      date: selectedDate,
      time: selectedTime,
    });
    
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
    }, 4000);
  };

  const isTimeBooked = (time: string) => {
    return appointments.some(a => a.clinicId === selectedClinic && a.date === selectedDate && a.time === time);
  };

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading text-[var(--color-secondary)]">Appointments</h1>
        <p className="text-sm text-gray-500 mt-1">Book and manage clinic visits across participating Pune hospitals.</p>
      </div>
      
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
         <h2 className="text-xl font-bold mb-4 text-[var(--color-secondary)]">Schedule Next Dose / Clinic Visit</h2>
         
         {bookingSuccess && (
           <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl mb-6 font-medium text-sm flex items-center gap-3">
             <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
             <span>Appointment Confirmed! We'll see you on {format(parseISO(selectedDate), 'dd MMMM yyyy')} at {selectedTime}.</span>
           </div>
         )}

         <form onSubmit={handleBook} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
               <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Select Participating Hospital</label>
                  <select 
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm font-medium" 
                    value={selectedClinic} 
                    onChange={e => setSelectedClinic(e.target.value)} 
                    required
                  >
                     {Object.values(clinics).map(c => (
                       <option key={c.id} value={c.id}>{c.name} ({c.location})</option>
                     ))}
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Select Date</label>
                  <input 
                    type="date" 
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm font-medium" 
                    value={selectedDate} 
                    onChange={e => setSelectedDate(e.target.value)} 
                    required
                  />
               </div>
            </div>
            
            <div>
               <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Select Time Slot (12-Hour AM/PM)</label>
               <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                  {AVAILABLE_TIMES.map(time => {
                    const booked = isTimeBooked(time);
                    return (
                      <button
                        key={time}
                        type="button"
                        disabled={booked}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2.5 rounded-xl text-xs font-bold transition-all border ${
                          booked ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed' :
                          selectedTime === time ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm' :
                          'bg-white text-[var(--color-secondary)] border-gray-200 hover:border-[var(--color-primary)]'
                        }`}
                      >
                        {time}
                        {booked && <span className="block text-[9px] font-normal opacity-70 mt-0.5">Booked</span>}
                      </button>
                    );
                  })}
               </div>
            </div>
            
            <Button type="submit" disabled={!selectedTime} className="py-3 px-8 text-base rounded-xl font-bold">
              Confirm Appointment
            </Button>
         </form>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 text-[var(--color-secondary)]">Your Scheduled Appointments</h2>
        <div className="space-y-4">
          {myAppointments.map(apt => (
            <div key={apt.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <p className="font-bold text-lg text-[var(--color-secondary)]">{clinics[apt.clinicId]?.name || 'Pune Medical Centre'}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {apt.serviceName || (apt.doseNumber ? `Rabies Vaccination — Dose ${apt.doseNumber}` : 'Vaccination Appointment')} • {format(parseISO(apt.date), 'dd MMMM yyyy')} • {apt.time}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{clinics[apt.clinicId]?.address || 'Pune, Maharashtra'}</p>
              </div>
              <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full uppercase self-start sm:self-center border border-amber-200">
                {apt.status}
              </span>
            </div>
          ))}
          {myAppointments.length === 0 && (
            <p className="text-gray-500 p-6 bg-white rounded-2xl border border-gray-100 text-center text-sm">No upcoming appointments.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// 4. Notifications Page
function PatientNotifications() {
  return <PatientNotificationCenter />;
}

// 5. Patient Profile Page
function PatientProfile() {
  const { currentUser, patients } = useAppStore();
  const patient = currentUser?.patientId ? patients[currentUser.patientId] : null;

  return (
    <div className="w-full space-y-6">
      <h1 className="text-3xl font-bold font-heading text-[var(--color-secondary)]">Personal Profile</h1>
      
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
         <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
           <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-2xl font-bold flex items-center justify-center">
             {currentUser?.name.charAt(0)}
           </div>
           <div>
             <h2 className="text-2xl font-bold text-[var(--color-secondary)]">{currentUser?.name}</h2>
             <p className="text-sm text-gray-500">Patient ID: VT-DEMO-2026-00016</p>
           </div>
         </div>

         <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
              <p className="font-semibold text-gray-900">{currentUser?.name}</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date of Birth</label>
              <p className="font-semibold text-gray-900">{patient?.dob ? format(parseISO(patient.dob), 'dd MMMM yyyy') : '02 April 2004'}</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
              <p className="font-semibold text-gray-900">{currentUser?.email}</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone Number</label>
              <p className="font-semibold text-gray-900">{currentUser?.phone}</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">City / Region</label>
              <p className="font-semibold text-gray-900">{patient?.city || 'Pune'}, {patient?.state || 'Maharashtra'}</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">PIN Code</label>
              <p className="font-semibold text-gray-900">{patient?.pinCode || '411005'}</p>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Address</label>
              <p className="font-semibold text-gray-900">{patient?.address || 'Shivajinagar, Pune, Maharashtra'}</p>
            </div>
         </div>
      </div>
    </div>
  );
}

// 6. Patient Settings Page
function PatientSettings() {
  const { language, setLanguage, resetDemo } = useAppStore();
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    resetDemo();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2500);
  };

  return (
    <div className="w-full space-y-6">
      <h1 className="text-3xl font-bold font-heading text-[var(--color-secondary)]">Account & App Settings</h1>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div>
          <h3 className="font-bold text-lg text-[var(--color-secondary)] mb-2 flex items-center gap-2">
            <Globe size={18} /> Preferred Language
          </h3>
          <div className="flex gap-3 mt-3">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                language === 'en' ? 'bg-[var(--color-secondary)] text-white border-[var(--color-secondary)]' : 'bg-gray-50 text-gray-700 border-gray-200'
              }`}
            >
              English (Default)
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                language === 'hi' ? 'bg-[var(--color-secondary)] text-white border-[var(--color-secondary)]' : 'bg-gray-50 text-gray-700 border-gray-200'
              }`}
            >
              हिन्दी (Hindi)
            </button>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="font-bold text-lg text-[var(--color-secondary)] mb-2 flex items-center gap-2">
            <Sliders size={18} /> Notification Preferences
          </h3>
          <div className="space-y-3 mt-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
              <span className="text-sm font-medium text-gray-700">SMS & WhatsApp Alerts for Upcoming Doses</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
              <span className="text-sm font-medium text-gray-700">Community Health Camps & Blood Drives in Pune</span>
            </label>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
            <RefreshCw size={18} /> Reset Demo Environment
          </h3>
          <p className="text-xs text-gray-500 mb-4">Reset patient records, appointments, and notification demo state back to default Pune scenario.</p>
          <Button onClick={handleReset} variant="outline" className="text-xs font-bold text-red-600 hover:bg-red-50 border-red-200">
            {resetSuccess ? '✓ Demo Reset Complete' : 'Reset Demo State'}
          </Button>
        </div>
      </div>
    </div>
  );
}

