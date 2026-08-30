import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useParams } from 'react-router-dom';
import { useAppStore } from '../store';
import { ClinicDashboard } from './ClinicDashboard';
import { PatientRecord } from './Clinic/PatientRecord';
import { PortalBreadcrumbHeader } from '../components/PortalBreadcrumbHeader';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Calendar, Users, Settings, Plus, Search, Building2, 
  MapPin, Phone, Shield, Activity, PackageCheck, AlertCircle, LogOut,
  CheckCircle2, Clock, Check, AlertTriangle, FileText, Home, ArrowLeft,
  Menu, X
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from '../components/ui/Button';

function PatientRecordWrapper() {
  const { id } = useParams<{ id: string }>();
  if (!id) return <div className="p-8 text-center text-gray-500">No patient ID provided</div>;
  return <PatientRecord patientId={id} />;
}

export function ClinicLayout() {
  const { currentUser, clinics, logout } = useAppStore();
  const location = useLocation();

  if (!currentUser || (currentUser.role !== 'clinic_staff' && currentUser.role !== 'patient')) {
    return <div className="p-8 text-center text-gray-500">Unauthorized. Please log in as Hospital Admin or Staff.</div>;
  }

  const clinic = (currentUser.clinicId && clinics[currentUser.clinicId]) ? clinics[currentUser.clinicId] : {
    id: 'hosp_1',
    name: 'Shivajinagar Emergency Medical Centre',
    licenseNumber: 'HOSP-DEMO-001',
    phone: '+91 90000 10001',
    city: 'Pune',
    location: 'Shivajinagar, Pune'
  };

  // Hospital Navigation Links
  const links = [
    { path: '/', label: 'Home', icon: <Home size={18} />, isHome: true },
    { path: '/clinic/dashboard', label: 'Dashboard', icon: <ShieldCheck size={18} /> },
    { path: '/clinic/patients', label: 'Patients', icon: <Users size={18} /> },
    { path: '/clinic/record-dose', label: 'Record Dose', icon: <Activity size={18} /> },
    { path: '/clinic/batch-verify', label: 'Batch Verification', icon: <PackageCheck size={18} /> },
    { path: '/clinic/alerts', label: 'Alerts', icon: <AlertCircle size={18} /> },
    { path: '/clinic/appointments', label: 'Appointments', icon: <Calendar size={18} /> },
    { path: '/clinic/profile', label: 'Hospital Profile', icon: <Building2 size={18} /> },
    { path: '/clinic/settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeLink = links.find(l => !l.isHome && (
    l.path === '/clinic/patients' 
      ? (location.pathname.startsWith('/clinic/patients') || location.pathname.startsWith('/clinic/patient/'))
      : location.pathname.startsWith(l.path)
  ));

  return (
    <div className="flex flex-col md:flex-row flex-1 min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)]">
      {/* Mobile Top Bar (< md) with Hamburger */}
      <div className="md:hidden bg-white border-b border-[#EAE7E1] px-4 py-3 flex items-center justify-between shadow-2xs sticky top-[64px] sm:top-[72px] z-30">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#1B7A3D]/10 text-[#1B7A3D] font-black flex items-center justify-center border border-[#1B7A3D]/20 text-xs shrink-0">
            <Building2 size={16} />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-extrabold uppercase text-[#1B7A3D] tracking-wider leading-none">Hospital Portal</div>
            <div className="text-xs font-heading font-extrabold text-[#2E2A5E] truncate mt-0.5">
              {activeLink ? activeLink.label : clinic.name}
            </div>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#F6F4F1] hover:bg-[#EAE7E1] text-[#2E2A5E] rounded-xl text-xs font-extrabold border border-[#EAE7E1] transition-colors min-h-[44px] min-w-[44px] cursor-pointer"
          aria-label="Toggle Hospital Portal Navigation"
        >
          {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          <span>{mobileMenuOpen ? 'Close' : 'Menu'}</span>
        </button>
      </div>

      {/* Mobile Menu Drawer (< md) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b-2 border-[#EAE7E1] px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150 z-20">
          <nav className="flex flex-col gap-1">
            {links.map(link => {
              const isActive = !link.isHome && (
                link.path === '/clinic/patients' 
                  ? (location.pathname.startsWith('/clinic/patients') || location.pathname.startsWith('/clinic/patient/'))
                  : location.pathname.startsWith(link.path)
              );

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
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-extrabold transition-all min-h-[44px] ${
                        isActive 
                          ? 'bg-[#2E2A5E] text-white shadow-xs' 
                          : 'text-[#6B6560] hover:bg-[#F6F4F1] hover:text-[#2E2A5E]'
                      }`}
                    >
                      {link.icon}
                      <span>{link.label}</span>
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
              <span>Logout Hospital Account</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sticky Sidebar (md:flex) */}
      <aside className="hidden md:flex md:w-64 lg:w-[280px] bg-gradient-to-b from-[#FBFBFA] to-white border-r border-[#EAE7E1] flex-col shrink-0 z-30">
        <div className="sticky top-[64px] sm:top-[72px] h-[calc(100vh-64px)] sm:h-[calc(100vh-72px)] flex flex-col justify-between p-5 sm:p-6 space-y-4 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#EAE7E1] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#8A847F]">
          <div>
            <div className="mb-5 hidden md:block border-b border-[#EAE7E1] pb-4">
              <div className="inline-flex items-center gap-1.5 bg-[#EBF7EE] text-[#1B7A3D] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase mb-2 border border-[#C8E6C9]">
                <ShieldCheck size={12} /> Verified Hospital
              </div>
              <h3 className="font-extrabold text-[#2E2A5E] text-sm leading-snug">{clinic.name}</h3>
              <p className="text-xs text-[#6B6560] font-medium mt-0.5">ID: {clinic.licenseNumber || 'HOSP-DEMO-001'} • {clinic.city || 'Pune'}</p>
            </div>

            <nav className="flex flex-col gap-1.5">
              {links.map(link => {
                const isActive = !link.isHome && (
                  link.path === '/clinic/patients' 
                    ? (location.pathname.startsWith('/clinic/patients') || location.pathname.startsWith('/clinic/patient/'))
                    : location.pathname.startsWith(link.path)
                );

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
                            ? 'bg-[#2E2A5E] text-white shadow-md translate-x-1 scale-[1.01]' 
                            : 'text-[#6B6560] hover:bg-white hover:text-[#2E2A5E] hover:shadow-2xs hover:translate-x-1'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                            {link.icon}
                          </div>
                          <span>{link.label}</span>
                        </div>
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

      {/* Main Workspace */}
      <main className="flex-1 bg-[#F6F4F1] min-w-0 flex flex-col relative">
        {/* Universal Portal Breadcrumbs & Back Navigation Header */}
        <PortalBreadcrumbHeader portalType="clinic" />

        <motion.div 
          key={location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full flex-1 flex flex-col p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 pb-28 min-w-0"
        >
              <Routes location={location}>
                <Route path="/dashboard" element={<ClinicDashboard />} />
                <Route path="/patients" element={<HospitalPatients />} />
                <Route path="/record-dose" element={<HospitalRecordDosePage />} />
                <Route path="/batch-verify" element={<HospitalBatchVerifyPage />} />
                <Route path="/alerts" element={<HospitalAlertsPage />} />
                <Route path="/appointments" element={<HospitalAppointments />} />
                <Route path="/profile" element={<HospitalProfilePage />} />
                <Route path="/settings" element={<HospitalSettingsPage />} />
                <Route path="/patient/:id" element={<PatientRecordWrapper />} />
              </Routes>
        </motion.div>
      </main>
    </div>
  );
}

// 1. Hospital Patients List & Search View
function HospitalPatients() {
  const { patients } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('9876543210'); // Pre-fill with requested demo query
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>('p_demo_1');

  const filteredPatients = Object.values(patients).filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.phone.includes(searchTerm) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-[#2E2A5E]">Hospital Patient Registry</h1>
          <p className="text-xs text-[#6B6560] mt-1">Search patient immunization history across Pune hospitals.</p>
        </div>

        {/* Demo Quick Chip */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-[#6B6560]">Quick Search Demo:</span>
          <button 
            onClick={() => {
              setSearchTerm('9876543210');
              setSelectedPatientId('p_demo_1');
            }}
            className="px-3 py-1 bg-[#E05D3F] text-white rounded-xl text-xs font-extrabold shadow-2xs hover:bg-[#c94d31] transition-all cursor-pointer"
          >
            9876543210 (Raj Patel)
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border-2 border-[#EAE7E1] shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-3.5 top-3 text-[#8A847F]" />
          <input 
            type="text" 
            placeholder="Search by Phone Number (+91), Patient ID (e.g. p_demo_1), or Name (e.g. Raj Patel)..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              const found = Object.values(patients).find(p => 
                p.phone.includes(e.target.value) || 
                p.id.toLowerCase().includes(e.target.value.toLowerCase()) || 
                p.name.toLowerCase().includes(e.target.value.toLowerCase())
              );
              if (found) setSelectedPatientId(found.id);
            }}
            className="w-full pl-10 pr-4 py-2 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-xs font-bold text-[#2E2A5E] outline-none focus:ring-2 focus:ring-[#E05D3F]"
          />
        </div>
        
        {selectedPatientId && (
          <Button 
            onClick={() => setSelectedPatientId(null)} 
            variant="outline" 
            className="text-xs font-extrabold border-[#EAE7E1] text-[#2E2A5E] rounded-xl"
          >
            Show All Patient List
          </Button>
        )}
      </div>

      {/* Selected Patient Record View */}
      {selectedPatientId ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-extrabold text-[#2E2A5E] uppercase tracking-wider">
              Viewing Patient Record: {patients[selectedPatientId]?.name || 'Raj Patel'}
            </span>
            <button 
              onClick={() => setSelectedPatientId(null)}
              className="text-xs text-[#E05D3F] font-extrabold hover:underline cursor-pointer"
            >
              ← Back to All Patients List
            </button>
          </div>
          <PatientRecord patientId={selectedPatientId} />
        </div>
      ) : (
        /* Patient Table List View */
        <div className="bg-white rounded-3xl border-2 border-[#EAE7E1] shadow-xs overflow-hidden">
          <div className="overflow-x-auto -mx-1 sm:mx-0">
            <table className="w-full min-w-[640px] text-left border-collapse">
              <thead>
                 <tr className="bg-[#F6F4F1] border-b border-[#EAE7E1] text-[11px] font-extrabold text-[#6B6560] uppercase tracking-wider">
                    <th className="p-4">Patient ID</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Rabies PEP Progress</th>
                    <th className="p-4">Next Dose</th>
                    <th className="p-4 text-right">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE7E1] text-xs font-bold">
                {filteredPatients.map(patient => (
                  <tr key={patient.id} className="hover:bg-[#F6F4F1]/60 transition-colors">
                    <td className="p-4 font-mono text-[#8A847F]">{patient.id}</td>
                    <td className="p-4">
                      <div className="text-[#2E2A5E] font-extrabold">{patient.name}</div>
                      <div className="text-[10px] text-[#6B6560]">DOB: {patient.dob || '02 April 2004'}</div>
                    </td>
                    <td className="p-4 text-[#6B6560]">{patient.phone}</td>
                    <td className="p-4 text-[#2E2A5E] font-extrabold">2 / 5 doses</td>
                    <td className="p-4">
                      <span className="bg-[#FEF3C7] text-[#D97706] text-[10px] font-extrabold px-2.5 py-1 rounded-md border border-[#FDE68A]">
                        24 Aug 2026 — Upcoming
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setSelectedPatientId(patient.id)} 
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#E05D3F] text-white hover:bg-[#c94d31] rounded-xl text-xs font-extrabold transition-all cursor-pointer"
                      >
                        Open Record →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

// 2. Hospital Record Dose Page
function HospitalRecordDosePage() {
  const { patients, recordDose } = useAppStore();
  const [selectedPatientId, setSelectedPatientId] = useState('p_demo_1');
  const [doseNumber, setDoseNumber] = useState(3);
  const [batchNumber, setBatchNumber] = useState('RAB-DEMO-7824');
  const [administeredBy, setAdministeredBy] = useState('Dr. S. Kulkarni (Shivajinagar EMC)');
  const [successMsg, setSuccessMsg] = useState('');

  const patient = patients[selectedPatientId] || patients['p_demo_1'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordDose(selectedPatientId, doseNumber, {
      batchNumber,
      healthcareWorker: administeredBy,
      administrationDate: new Date().toISOString()
    });
    setSuccessMsg(`✓ Dose ${doseNumber} successfully recorded into SHA-256 ledger for ${patient.name}!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-extrabold text-[#2E2A5E]">Record Vaccine Dose</h1>
        <p className="text-xs text-[#6B6560] mt-1">
          Digitally sign and append vaccination record into VacTrack SHA-256 cryptographically immutable ledger.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-[#EBF7EE] border border-[#C8E6C9] text-[#1B7A3D] font-extrabold text-xs rounded-2xl flex items-center gap-2">
          <CheckCircle2 size={18} /> {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#EAE7E1] shadow-xs space-y-5 text-xs font-bold">
        <div>
          <label className="block text-[#6B6560] uppercase tracking-wider mb-1.5">Select Patient</label>
          <select 
            value={selectedPatientId} 
            onChange={e => setSelectedPatientId(e.target.value)}
            className="w-full p-3 bg-[#F6F4F1] border-2 border-[#EAE7E1] rounded-xl text-xs font-extrabold text-[#2E2A5E] outline-none"
          >
            {Object.values(patients).map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.phone}) — ID: {p.id}</option>
            ))}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#6B6560] uppercase tracking-wider mb-1.5">Dose Protocol Number</label>
            <select 
              value={doseNumber} 
              onChange={e => setDoseNumber(Number(e.target.value))}
              className="w-full p-3 bg-[#F6F4F1] border-2 border-[#EAE7E1] rounded-xl text-xs font-extrabold text-[#2E2A5E] outline-none"
            >
              <option value={1}>Dose 1 (Day 0)</option>
              <option value={2}>Dose 2 (Day 3)</option>
              <option value={3}>Dose 3 (Day 7)</option>
              <option value={4}>Dose 4 (Day 14)</option>
              <option value={5}>Dose 5 (Day 28)</option>
            </select>
          </div>

          <div>
            <label className="block text-[#6B6560] uppercase tracking-wider mb-1.5">Vaccine Batch Number</label>
            <input 
              type="text" 
              value={batchNumber}
              onChange={e => setBatchNumber(e.target.value)}
              className="w-full p-3 bg-[#F6F4F1] border-2 border-[#EAE7E1] rounded-xl text-xs font-extrabold text-[#2E2A5E] outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-[#6B6560] uppercase tracking-wider mb-1.5">Administering Healthcare Professional</label>
          <input 
            type="text" 
            value={administeredBy}
            onChange={e => setAdministeredBy(e.target.value)}
            className="w-full p-3 bg-[#F6F4F1] border-2 border-[#EAE7E1] rounded-xl text-xs font-extrabold text-[#2E2A5E] outline-none"
            required
          />
        </div>

        <div className="p-4 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1] flex items-center justify-between">
          <div>
            <span className="text-[#2E2A5E] font-extrabold block">Hospital Facility</span>
            <span className="text-[#6B6560]">Shivajinagar Emergency Medical Centre (HOSP-DEMO-001)</span>
          </div>
          <span className="text-[#1B7A3D] font-extrabold bg-[#EBF7EE] px-2.5 py-1 rounded-full text-[10px] border border-[#C8E6C9]">
            ✓ SHA-256 Ledger Connected
          </span>
        </div>

        <Button type="submit" className="w-full py-3.5 bg-[#E05D3F] hover:bg-[#c94d31] text-white font-extrabold rounded-xl text-sm shadow-xs">
          Append Dose Record to SHA-256 Ledger
        </Button>
      </form>
    </div>
  );
}

// 3. Hospital Batch Verification Page
function HospitalBatchVerifyPage() {
  const [inputBatch, setInputBatch] = useState('RAB-DEMO-7824');
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    batchNumber: string;
    manufacturer: string;
    expiryDate: string;
    statusText: string;
  } | null>({
    valid: true,
    batchNumber: 'RAB-DEMO-7824',
    manufacturer: 'Serum Institute of India Ltd.',
    expiryDate: '15 January 2027',
    statusText: '✓ Verified Genuine Batch'
  });

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputBatch.toUpperCase().includes('EXP')) {
      setVerificationResult({
        valid: false,
        batchNumber: inputBatch,
        manufacturer: 'Unknown Manufacturer',
        expiryDate: '10 June 2024 (EXPIRED)',
        statusText: '❌ Expired Batch — Administration Blocked'
      });
    } else {
      setVerificationResult({
        valid: true,
        batchNumber: inputBatch,
        manufacturer: 'Serum Institute of India Ltd.',
        expiryDate: '15 January 2027',
        statusText: '✓ Verified Genuine Batch'
      });
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-extrabold text-[#2E2A5E]">Batch Verification Portal</h1>
        <p className="text-xs text-[#6B6560] mt-1">
          Verify authenticity and expiration status of Rabies vaccine vials prior to administration.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border-2 border-[#EAE7E1] shadow-2xs">
          <span className="text-[10px] text-[#6B6560] font-extrabold uppercase tracking-wider block mb-1">Verified Batches Logged</span>
          <span className="text-3xl font-extrabold text-[#1B7A3D]">21</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border-2 border-[#EAE7E1] shadow-2xs">
          <span className="text-[10px] text-[#6B6560] font-extrabold uppercase tracking-wider block mb-1">Expired Batch Attempts Blocked</span>
          <span className="text-3xl font-extrabold text-[#B91C1C]">2</span>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#EAE7E1] shadow-xs space-y-6">
        <form onSubmit={handleVerify} className="space-y-4">
          <label className="block text-xs font-extrabold text-[#2E2A5E] uppercase tracking-wider">
            Enter Vaccine Batch Code
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              value={inputBatch}
              onChange={e => setInputBatch(e.target.value)}
              className="flex-1 p-3 bg-[#F6F4F1] border-2 border-[#EAE7E1] rounded-xl text-xs font-extrabold text-[#2E2A5E] outline-none"
              placeholder="e.g. RAB-DEMO-7824 or RAB-EXPIRED-99"
              required
            />
            <Button type="submit" className="bg-[#2E2A5E] hover:bg-[#231f47] text-white font-extrabold text-xs px-6 py-3 rounded-xl">
              Verify Batch
            </Button>
          </div>
        </form>

        {verificationResult && (
          <div className={`p-6 rounded-2xl border-2 space-y-3 text-xs ${
            verificationResult.valid ? 'bg-[#EBF7EE] border-[#C8E6C9]' : 'bg-[#FEF2F2] border-[#FCA5A5]'
          }`}>
            <div className="flex justify-between items-center border-b pb-2 border-black/10">
              <span className="font-extrabold text-sm">{verificationResult.statusText}</span>
              <span className="font-mono font-bold">{verificationResult.batchNumber}</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-2 text-xs font-bold">
              <div>
                <span className="text-[#6B6560] block">Manufacturer:</span>
                <span>{verificationResult.manufacturer}</span>
              </div>
              <div>
                <span className="text-[#6B6560] block">Expiry Date:</span>
                <span className={verificationResult.valid ? 'text-[#1B7A3D]' : 'text-[#B91C1C]'}>{verificationResult.expiryDate}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 4. Hospital Alerts Page
function HospitalAlertsPage() {
  const { alerts, markAlertRead } = useAppStore();

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-extrabold text-[#2E2A5E]">Hospital System Alerts</h1>
        <p className="text-xs text-[#6B6560] mt-1">Real-time notifications for patient missed doses and inventory alerts.</p>
      </div>

      <div className="space-y-3">
        {alerts.map((a, idx) => (
          <div key={`${a.id || 'alt'}_${idx}`} className="bg-white p-5 rounded-2xl border-2 border-[#EAE7E1] shadow-2xs flex justify-between items-center gap-4">
            <div>
              <span className="bg-[#FEF2F2] text-[#B91C1C] text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider mb-1 inline-block">
                {a.type}
              </span>
              <h4 className="font-extrabold text-sm text-[#2E2A5E]">{a.title || 'Overdue Dose Alert'}</h4>
              <p className="text-xs text-[#6B6560] font-medium mt-1">{a.message}</p>
            </div>
            {!a.read && (
              <Button onClick={() => markAlertRead(a.id)} variant="outline" size="sm" className="text-xs font-bold rounded-xl border-[#EAE7E1]">
                Mark Read
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. Hospital Appointments Page
function HospitalAppointments() {
  const { appointments, currentUser, patients } = useAppStore();

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-extrabold text-[#2E2A5E]">Hospital Appointments</h1>
        <p className="text-xs text-[#6B6560] mt-1">Scheduled patient visits at Shivajinagar Emergency Medical Centre.</p>
      </div>

      <div className="space-y-4">
        {appointments.map(apt => (
          <div key={apt.id} className="bg-white p-6 rounded-2xl border-2 border-[#EAE7E1] shadow-2xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <Link to={`/clinic/patient/${apt.patientId}`} className="font-extrabold text-base text-[#2E2A5E] hover:text-[#E05D3F] transition-colors">
                {patients[apt.patientId]?.name || 'Raj Patel'}
              </Link>
              <p className="text-xs text-[#6B6560] mt-1 font-medium">
                {apt.serviceName || 'Rabies PEP Vaccination Dose'} • {apt.date ? format(parseISO(apt.date), 'dd MMMM yyyy') : '24 August 2026'} • {apt.time || '10:30 AM'}
              </p>
              <p className="text-[11px] text-[#8A847F] font-mono mt-0.5">Patient ID: {apt.patientId}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] text-xs font-extrabold rounded-full uppercase">
                {apt.status || 'Confirmed'}
              </span>
              <Link 
                to={`/clinic/patient/${apt.patientId}`}
                className="px-3.5 py-1.5 bg-[#2E2A5E] text-white hover:bg-[#231f47] rounded-xl text-xs font-extrabold transition-all"
              >
                Open Record
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. Hospital Profile Page
function HospitalProfilePage() {
  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-heading font-extrabold text-[#2E2A5E]">Hospital Profile</h1>

      <div className="bg-white p-8 rounded-3xl border-2 border-[#EAE7E1] shadow-2xs space-y-6">
        <div className="flex items-center gap-4 border-b border-[#EAE7E1] pb-6">
          <div className="w-16 h-16 bg-[#2E2A5E] text-white rounded-2xl flex items-center justify-center font-bold shrink-0">
            <Building2 size={32} />
          </div>
          <div>
            <span className="bg-[#EBF7EE] text-[#1B7A3D] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border border-[#C8E6C9] inline-block mb-1">
              Verified Demo Hospital
            </span>
            <h2 className="text-2xl font-extrabold text-[#2E2A5E]">Shivajinagar Emergency Medical Centre</h2>
            <p className="text-xs text-[#6B6560] font-medium">Hospital ID: HOSP-DEMO-001 • Government Registered</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 text-xs sm:text-sm font-bold">
          <div>
            <span className="text-[#6B6560] uppercase tracking-wider block mb-1">Hospital Name</span>
            <p className="text-[#2E2A5E]">Shivajinagar Emergency Medical Centre</p>
          </div>
          <div>
            <span className="text-[#6B6560] uppercase tracking-wider block mb-1">Hospital ID</span>
            <p className="text-[#2E2A5E] font-mono">HOSP-DEMO-001</p>
          </div>
          <div>
            <span className="text-[#6B6560] uppercase tracking-wider block mb-1">Emergency Phone</span>
            <p className="text-[#2E2A5E]">+91 90000 10001</p>
          </div>
          <div>
            <span className="text-[#6B6560] uppercase tracking-wider block mb-1">City / Region</span>
            <p className="text-[#2E2A5E]">Shivajinagar, Pune, Maharashtra</p>
          </div>
          <div>
            <span className="text-[#6B6560] uppercase tracking-wider block mb-1">Status</span>
            <p className="text-[#1B7A3D]">✓ Verified Demo Hospital</p>
          </div>
          <div>
            <span className="text-[#6B6560] uppercase tracking-wider block mb-1">24/7 Service</span>
            <p className="text-[#2E2A5E]">Yes — Emergency Department Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 7. Hospital Settings Page
function HospitalSettingsPage() {
  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-heading font-extrabold text-[#2E2A5E]">Hospital System Settings</h1>

      <div className="bg-white p-8 rounded-3xl border-2 border-[#EAE7E1] shadow-2xs space-y-6 text-xs font-bold">
        <div>
          <h3 className="font-extrabold text-base text-[#2E2A5E] mb-2">Facility API & Ledger Node Status</h3>
          <p className="text-[#6B6560] font-medium">Node: SHA-256 Pune District Health Network Node #04</p>
          <span className="inline-block mt-2 bg-[#EBF7EE] text-[#1B7A3D] px-3 py-1 rounded-full border border-[#C8E6C9]">
            ✓ Cryptographic Node Operational
          </span>
        </div>
      </div>
    </div>
  );
}
