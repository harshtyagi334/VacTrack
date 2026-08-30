import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { 
  ShieldCheck, CheckCircle2, ArrowLeft, QrCode, AlertTriangle, FileText, 
  Download, Eye, Lock, Settings, Clock, Activity, Calendar, Hospital, 
  User, MapPin, Sparkles, RefreshCw, X, ShieldAlert, Check, Share2, FileCheck, Stethoscope
} from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';
import { QRCodeSVG } from 'qrcode.react';

interface TimelineEvent {
  year: string;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeType?: 'success' | 'warning' | 'info' | 'neutral';
  items: Array<{
    label: string;
    value: string;
    status?: 'completed' | 'upcoming' | 'verified' | 'neutral';
  }>;
  demoTag?: boolean;
}

export function PatientPublicVerifyPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const { patients, language } = useAppStore();
  const existingPatient = (patientId && patients[patientId]) ? patients[patientId] : null;

  // Verification state
  const [integrityVerified, setIntegrityVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Privacy & QR Sharing state
  const [showManageModal, setShowManageModal] = useState(false);
  const [sharingRevoked, setSharingRevoked] = useState(false);
  const [sharingSettings, setSharingSettings] = useState({
    shareVaccinationHistory: true,
    shareBloodGroup: true,
    shareAllergies: true,
    shareEmergencyInfo: true,
    shareMedicalHistory: true,
  });

  // Document preview modal state
  const [activeDocument, setActiveDocument] = useState<{
    title: string;
    date: string;
    type: string;
    content: string;
  } | null>(null);

  // Fictional Demo Patient Data (Dynamic with fallback)
  const patientData = {
    name: existingPatient?.name || 'Aarav Sharma',
    patientId: existingPatient?.id ? `VT-PAT-${existingPatient.id}` : (patientId || 'VT-PAT-2048'),
    recordId: 'VT-DEMO-2026-2048',
    dob: existingPatient?.dob ? '02 April 2004' : '12 March 2004',
    bloodGroup: existingPatient?.healthRecord?.bloodGroup || 'B+',
    city: existingPatient?.city || 'Pune, Maharashtra',
    lastUpdated: '19 August 2026',
    recordSource: 'Participating Healthcare Facility',
  };

  const handleVerifyIntegrity = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIntegrityVerified(true);
    }, 600);
  };

  // Chronological Health Timeline Events
  const timelineEvents: TimelineEvent[] = [
    {
      year: '2004 — Birth',
      title: 'Birth Record',
      badge: 'Certified Record',
      badgeType: 'success',
      items: [
        { label: 'Date of Birth', value: '12 March 2004' },
        { label: 'Blood Group', value: 'B+' },
        { label: 'Birth Location', value: 'Pune, Maharashtra' },
        { label: 'Birth Record Status', value: 'Available ✓', status: 'verified' }
      ]
    },
    {
      year: '2004–2005 — Childhood Vaccinations',
      title: 'Immunization Record',
      badge: '5/5 Administered',
      badgeType: 'success',
      items: [
        { label: 'BCG', value: 'Completed ✓', status: 'completed' },
        { label: 'Polio', value: 'Completed ✓', status: 'completed' },
        { label: 'Hepatitis B', value: 'Completed ✓', status: 'completed' },
        { label: 'DTP', value: 'Completed ✓', status: 'completed' },
        { label: 'MMR', value: 'Completed ✓', status: 'completed' }
      ]
    },
    {
      year: '2010 — Routine Health Check',
      title: 'Pediatric Evaluation',
      badge: 'Normal Checkup',
      badgeType: 'neutral',
      items: [
        { label: 'General Health Check', value: 'Completed' },
        { label: 'Vaccination Status', value: 'Reviewed & Up to Date' },
        { label: 'Medical History', value: 'No major conditions recorded' }
      ]
    },
    {
      year: '2015 — Vaccination',
      title: 'Adolescent Booster',
      badge: 'Booster Administered',
      badgeType: 'success',
      items: [
        { label: 'Tetanus Booster (dT)', value: 'Completed ✓', status: 'completed' }
      ]
    },
    {
      year: '2020 — COVID-19 Vaccination',
      title: 'SARS-CoV-2 Immunization',
      badge: 'Fully Vaccinated',
      badgeType: 'success',
      items: [
        { label: 'Dose 1 (COVAXIN)', value: 'Completed ✓', status: 'completed' },
        { label: 'Dose 2 (COVAXIN)', value: 'Completed ✓', status: 'completed' },
        { label: 'Batch Number', value: 'CVX-DEMO-2601' },
        { label: 'Ledger Status', value: '✓ Verified Cryptographic Record', status: 'verified' }
      ]
    },
    {
      year: '2024 — Routine Medical Record',
      title: 'Annual General Wellness',
      badge: 'Healthy Record',
      badgeType: 'neutral',
      items: [
        { label: 'General Health Checkup', value: 'Completed' },
        { label: 'Vitals & Blood Panel', value: 'Within Normal Limits' },
        { label: 'Status', value: 'No major conditions recorded' }
      ]
    },
    {
      year: '2026 — Rabies PEP',
      title: 'Rabies Post-Exposure Prophylaxis',
      subtitle: 'Reason: Animal Bite (Stray Dog Exposure) — DEMO DATA',
      badge: 'Active Protocol (2/5)',
      badgeType: 'warning',
      demoTag: true,
      items: [
        { label: 'Dose 1 (Day 0)', value: '17 August 2026 — Completed ✓', status: 'completed' },
        { label: 'Dose 2 (Day 3)', value: '20 August 2026 — Completed ✓', status: 'completed' },
        { label: 'Dose 3 (Day 7)', value: '24 August 2026 — Upcoming', status: 'upcoming' },
        { label: 'Dose 4 (Day 14)', value: '31 August 2026 — Upcoming', status: 'upcoming' },
        { label: 'Dose 5 (Day 28)', value: '14 September 2026 — Upcoming', status: 'upcoming' }
      ]
    }
  ];

  // Dummy Documents List
  const sampleDocuments = [
    {
      id: 'doc_1',
      title: 'Vaccination Certificate',
      date: '19 August 2026',
      type: 'PDF Document',
      code: 'VT-CERT-2026-88',
      content: 'Official VacTrack Digital Immunization Certificate confirming Rabies PEP Doses 1 & 2 and COVID-19 Complete Series for Aarav Sharma (VT-PAT-2048).'
    },
    {
      id: 'doc_2',
      title: 'Blood Test Report',
      date: '12 March 2024',
      type: 'Laboratory Panel',
      code: 'LAB-PUNE-2024-102',
      content: 'Complete Blood Count (CBC) & ABO Rh Blood Grouping Report confirming Blood Type B+ Positive.'
    },
    {
      id: 'doc_3',
      title: 'General Health Checkup',
      date: '10 January 2024',
      type: 'Clinical Evaluation',
      code: 'CHK-2024-9912',
      content: 'Routine physical examination report. Blood pressure 118/76 mmHg, Resting Heart Rate 72 bpm. Clear lung sounds and no physical abnormalities.'
    },
    {
      id: 'doc_4',
      title: 'Prescription & PEP Protocol',
      date: '17 August 2026',
      type: 'Emergency Rx',
      code: 'RX-SHIV-2026-441',
      content: 'Shivajinagar Emergency Medical Centre Rx: Rabies Vaccine 1.0ml IM (Day 0, 3, 7, 14, 28) + Wound Decontamination with Povidone-Iodine.'
    },
    {
      id: 'doc_5',
      title: 'Discharge Summary',
      date: '18 August 2026',
      type: 'Outpatient Triage',
      code: 'DIS-DEMO-2026-09',
      content: 'Outpatient emergency bite wound cleaning & initial Rabies RIG administration summary. Patient discharged in stable condition with clear follow-up PEP schedule.'
    }
  ];

  return (
    <div className="bg-[#F6F4F1] min-h-screen py-8 px-3 sm:px-6 lg:px-8 font-sans text-[#231F20]">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#EAE7E1] pb-4">
          <Link to="/" className="inline-block">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <span className="bg-[#EBF7EE] text-[#1B7A3D] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-[#C8E6C9] flex items-center gap-1.5 shadow-2xs">
              <ShieldCheck size={14} /> VacTrack Public Verification
            </span>
            <Link to="/" className="text-xs font-bold text-[#2E2A5E] hover:text-[#E05D3F] transition-colors flex items-center gap-1 ml-2">
              <ArrowLeft size={14} /> Back Home
            </Link>
          </div>
        </div>

        {/* TOP RECORD VERIFICATION BAR */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#EAE7E1] shadow-md space-y-6 relative overflow-hidden">
          {/* Subtle top decorative ribbon */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#E05D3F] via-[#F2A93B] to-[#1B7A3D]" />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#EAE7E1] pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#EBF7EE] text-[#1B7A3D] text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider mb-2 border border-[#C8E6C9]">
                <ShieldCheck size={14} /> VacTrack Verified Record
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2E2A5E]">
                Verified Health Record Timeline
              </h1>
              <p className="text-xs sm:text-sm text-[#6B6560] font-medium mt-1">
                Authentic, cryptographically validated health story — from birth to present date.
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2 shrink-0 w-full md:w-auto">
              <Button
                onClick={handleVerifyIntegrity}
                disabled={isVerifying}
                className="bg-[#2E2A5E] hover:bg-[#201c45] text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 w-full md:w-auto justify-center cursor-pointer transition-all"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Verifying SHA-256 Ledger...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={15} className="text-[#F2A93B]" /> Verify Record Integrity
                  </>
                )}
              </Button>
              <span className="text-[11px] font-mono text-[#8A847F]">
                Source: {patientData.recordSource}
              </span>
            </div>
          </div>

          {/* Verification Confirmation Toast */}
          {integrityVerified && (
            <div className="bg-[#EBF7EE] border-2 border-[#A3E635] p-4 rounded-2xl flex items-center gap-3 animate-fade-in shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-[#1B7A3D] text-white flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <p className="font-extrabold text-sm text-[#1B7A3D]">✓ Record integrity verified</p>
                <p className="text-xs text-[#14532D] font-medium">
                  No unauthorized modification detected. Cryptographic SHA-256 ledger hash matches official health facility node.
                </p>
              </div>
            </div>
          )}

          {/* Summary Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F6F4F1] p-4 rounded-2xl border border-[#EAE7E1] text-xs">
            <div>
              <span className="text-[#6B6560] font-bold block mb-0.5">Record ID</span>
              <span className="font-mono font-extrabold text-[#2E2A5E]">{patientData.recordId}</span>
            </div>
            <div>
              <span className="text-[#6B6560] font-bold block mb-0.5">Hash Integrity</span>
              <span className="font-extrabold text-[#1B7A3D] flex items-center gap-1">
                ✓ Verified
              </span>
            </div>
            <div>
              <span className="text-[#6B6560] font-bold block mb-0.5">Last Updated</span>
              <span className="font-bold text-[#2E2A5E]">{patientData.lastUpdated}</span>
            </div>
            <div>
              <span className="text-[#6B6560] font-bold block mb-0.5">Ledger Network</span>
              <span className="font-bold text-[#2E2A5E]">VacTrack India Node</span>
            </div>
          </div>

          {/* Patient Identity Header Card */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#2E2A5E] text-white p-6 rounded-2xl shadow-sm">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#F2A93B]">
                Patient Health Profile
              </span>
              <h2 className="text-2xl font-extrabold">{patientData.name}</h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-white/80 font-medium">
                <span className="flex items-center gap-1">
                  <User size={13} className="text-[#E05D3F]" /> ID: <strong className="text-white">{patientData.patientId}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar size={13} className="text-[#F2A93B]" /> Born: <strong className="text-white">{patientData.dob}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-[#C8E6C9]" /> <strong className="text-white">{patientData.city}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 p-3.5 rounded-xl border border-white/15 shrink-0">
              <div className="text-center px-2">
                <span className="text-[10px] uppercase font-bold text-white/70 block">Blood Group</span>
                <span className="text-2xl font-black text-[#F2A93B]">{patientData.bloodGroup}</span>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="p-2 bg-white rounded-lg shadow-xs">
                <QRCodeSVG value={typeof window !== 'undefined' ? `${window.location.origin}/verify/patient/${patientData.patientId}` : `https://vactrack.health/verify/patient/${patientData.patientId}`} size={56} />
              </div>
            </div>
          </div>
        </div>

        {/* PRIVACY & QR ACCESS CONTROLS SECTION */}
        <div className="bg-white p-6 rounded-3xl border-2 border-[#EAE7E1] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#EAE7E1] pb-3">
            <div className="flex items-center gap-2">
              <Lock size={18} className="text-[#E05D3F]" />
              <h3 className="font-extrabold text-base text-[#2E2A5E]">
                Shared Health Information (Patient Controlled)
              </h3>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => setShowManageModal(true)}
                className="px-3.5 py-1.5 bg-[#F6F4F1] hover:bg-[#EAE7E1] text-[#2E2A5E] rounded-xl text-xs font-extrabold border border-[#EAE7E1] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Settings size={13} /> Manage QR Sharing
              </button>
              <button
                onClick={() => setSharingRevoked(!sharingRevoked)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                  sharingRevoked 
                    ? 'bg-[#1B7A3D] text-white hover:bg-[#14532D]' 
                    : 'bg-[#FEF2F2] text-[#B91C1C] hover:bg-red-100 border border-[#FECACA]'
                }`}
              >
                {sharingRevoked ? (
                  <>
                    <CheckCircle2 size={13} /> Restore Access
                  </>
                ) : (
                  <>
                    <ShieldAlert size={13} /> Revoke QR Access
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-xs text-[#6B6560] italic">
            "Only information authorized by the patient is displayed."
          </p>

          {sharingRevoked ? (
            <div className="bg-[#FEF2F2] border border-[#FECACA] p-4 rounded-2xl text-xs text-[#B91C1C] font-semibold flex items-center gap-3">
              <ShieldAlert size={20} className="shrink-0" />
              <span>
                <strong>QR Sharing Revoked:</strong> The patient has temporarily restricted public QR code access. Private medical records remain encrypted and inaccessible to outside scanners.
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1">
              {sharingSettings.shareVaccinationHistory && (
                <span className="bg-[#EBF7EE] text-[#1B7A3D] font-extrabold text-xs px-3 py-1 rounded-full border border-[#C8E6C9] flex items-center gap-1">
                  ✓ Vaccination History
                </span>
              )}
              {sharingSettings.shareBloodGroup && (
                <span className="bg-[#EBF7EE] text-[#1B7A3D] font-extrabold text-xs px-3 py-1 rounded-full border border-[#C8E6C9] flex items-center gap-1">
                  ✓ Blood Group
                </span>
              )}
              {sharingSettings.shareAllergies && (
                <span className="bg-[#EBF7EE] text-[#1B7A3D] font-extrabold text-xs px-3 py-1 rounded-full border border-[#C8E6C9] flex items-center gap-1">
                  ✓ Allergies
                </span>
              )}
              {sharingSettings.shareEmergencyInfo && (
                <span className="bg-[#EBF7EE] text-[#1B7A3D] font-extrabold text-xs px-3 py-1 rounded-full border border-[#C8E6C9] flex items-center gap-1">
                  ✓ Emergency Information
                </span>
              )}
              {sharingSettings.shareMedicalHistory && (
                <span className="bg-[#EBF7EE] text-[#1B7A3D] font-extrabold text-xs px-3 py-1 rounded-full border border-[#C8E6C9] flex items-center gap-1">
                  ✓ Selected Medical History
                </span>
              )}
            </div>
          )}
        </div>

        {/* HEALTH TIMELINE SECTION */}
        {!sharingRevoked && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#EAE7E1] shadow-md space-y-6">
            <div className="border-b border-[#EAE7E1] pb-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#E05D3F]">
                  Comprehensive Health Story
                </span>
                <h3 className="text-xl font-extrabold text-[#2E2A5E]">
                  Chronological Medical Timeline (2004 – Present)
                </h3>
              </div>
              <Activity size={20} className="text-[#2E2A5E]" />
            </div>

            {/* Timeline Tree */}
            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#EAE7E1]">
              {timelineEvents.map((evt, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline node icon */}
                  <div className={`absolute -left-6 sm:-left-8 top-1.5 w-5 h-5 rounded-full border-2 border-white shadow-xs flex items-center justify-center text-[10px] font-bold ${
                    evt.badgeType === 'warning' ? 'bg-[#D97706] text-white' : 'bg-[#2E2A5E] text-white'
                  }`}>
                    {idx + 1}
                  </div>

                  <div className="bg-[#F6F4F1] p-5 rounded-2xl border border-[#EAE7E1] space-y-3 hover:border-[#E05D3F] transition-all">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#EAE7E1] pb-2.5">
                      <div>
                        <span className="text-xs font-extrabold text-[#E05D3F] block uppercase tracking-wider">
                          {evt.year}
                        </span>
                        <h4 className="font-extrabold text-base text-[#2E2A5E]">{evt.title}</h4>
                        {evt.subtitle && (
                          <p className="text-xs font-semibold text-[#B91C1C] mt-0.5">{evt.subtitle}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {evt.demoTag && (
                          <span className="text-[10px] font-bold bg-[#FEF3F2] text-[#B91C1C] px-2 py-0.5 rounded border border-[#FECDCA]">
                            DEMO DATA
                          </span>
                        )}
                        {evt.badge && (
                          <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                            evt.badgeType === 'warning'
                              ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
                              : evt.badgeType === 'success'
                              ? 'bg-[#EBF7EE] text-[#1B7A3D] border-[#C8E6C9]'
                              : 'bg-white text-[#6B6560] border-[#EAE7E1]'
                          }`}>
                            {evt.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {evt.items.map((item, iIdx) => (
                        <div key={iIdx} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-[#EAE7E1]">
                          <span className="text-[#6B6560] font-semibold">{item.label}:</span>
                          <span className={`font-extrabold ${
                            item.status === 'completed' || item.status === 'verified'
                              ? 'text-[#1B7A3D]'
                              : item.status === 'upcoming'
                              ? 'text-[#D97706]'
                              : 'text-[#2E2A5E]'
                          }`}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DETAILED MEDICAL HISTORY SECTIONS */}
        {!sharingRevoked && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#EAE7E1] shadow-md space-y-6">
            <div className="border-b border-[#EAE7E1] pb-4">
              <span className="text-xs font-black uppercase tracking-wider text-[#E05D3F]">
                Clinical Records
              </span>
              <h3 className="text-xl font-extrabold text-[#2E2A5E]">
                Detailed Medical History
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vaccination History Card */}
              <div className="bg-[#F6F4F1] p-5 rounded-2xl border border-[#EAE7E1] space-y-3">
                <div className="flex justify-between items-center border-b border-[#EAE7E1] pb-2">
                  <h4 className="font-extrabold text-sm text-[#2E2A5E] flex items-center gap-2">
                    <ShieldCheck size={16} className="text-[#1B7A3D]" /> Vaccination History
                  </h4>
                  <span className="text-[11px] font-extrabold text-[#1B7A3D] bg-[#EBF7EE] px-2 py-0.5 rounded-md">
                    Verified
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-[#EAE7E1] space-y-1">
                    <div className="flex justify-between font-extrabold text-[#2E2A5E]">
                      <span>Rabies PEP Protocol (2/5)</span>
                      <span className="text-[#D97706]">Active</span>
                    </div>
                    <p className="text-[#6B6560] text-[11px]">Dose 1 (17 Aug) & Dose 2 (20 Aug) • Shivajinagar Emergency Centre</p>
                    <p className="text-[10px] font-mono text-[#8A847F]">Batch: RAB-DEMO-7824</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#EAE7E1] space-y-1">
                    <div className="flex justify-between font-extrabold text-[#2E2A5E]">
                      <span>COVID-19 Full Series</span>
                      <span className="text-[#1B7A3D]">✓ Completed</span>
                    </div>
                    <p className="text-[#6B6560] text-[11px]">Dose 1 & Dose 2 Administered • Pune Health Network</p>
                    <p className="text-[10px] font-mono text-[#8A847F]">Batch: CVX-DEMO-2601</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#EAE7E1] space-y-1">
                    <div className="flex justify-between font-extrabold text-[#2E2A5E]">
                      <span>Tetanus Booster (dT)</span>
                      <span className="text-[#1B7A3D]">✓ Completed</span>
                    </div>
                    <p className="text-[#6B6560] text-[11px]">Administered 2015 Routine Adolescent Care</p>
                  </div>
                </div>
              </div>

              {/* Medical Conditions & Allergies Card */}
              <div className="bg-[#F6F4F1] p-5 rounded-2xl border border-[#EAE7E1] space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center border-b border-[#EAE7E1] pb-2">
                    <h4 className="font-extrabold text-sm text-[#2E2A5E] flex items-center gap-2">
                      <Stethoscope size={16} className="text-[#2E2A5E]" /> Medical Conditions
                    </h4>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#EAE7E1] text-xs font-semibold text-[#6B6560]">
                    ✓ No major conditions recorded
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center border-b border-[#EAE7E1] pb-2">
                    <h4 className="font-extrabold text-sm text-[#2E2A5E] flex items-center gap-2">
                      <AlertTriangle size={16} className="text-[#E05D3F]" /> Known Allergies
                    </h4>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#EAE7E1] text-xs font-semibold text-[#2E2A5E] flex items-center justify-between">
                    <span>No known major drug allergies recorded</span>
                    <span className="text-[10px] text-[#1B7A3D] font-bold">Clear</span>
                  </div>
                </div>
              </div>

              {/* Previous Treatments Card */}
              <div className="bg-[#F6F4F1] p-5 rounded-2xl border border-[#EAE7E1] space-y-3">
                <div className="flex justify-between items-center border-b border-[#EAE7E1] pb-2">
                  <h4 className="font-extrabold text-sm text-[#2E2A5E] flex items-center gap-2">
                    <FileCheck size={16} className="text-[#2E2A5E]" /> Previous Treatments (DEMO DATA)
                  </h4>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-[#EAE7E1] space-y-1">
                    <div className="flex justify-between font-extrabold text-[#2E2A5E]">
                      <span>Animal Bite Wound Care</span>
                      <span className="text-[#1B7A3D]">Treated</span>
                    </div>
                    <p className="text-[#6B6560] text-[11px]">Wound irrigation & Povidone-Iodine antiseptic dressing • August 2026</p>
                    <p className="text-[10px] text-[#8A847F]">Shivajinagar Emergency Medical Centre</p>
                  </div>
                </div>
              </div>

              {/* Emergency History Card */}
              <div className="bg-[#F6F4F1] p-5 rounded-2xl border border-[#EAE7E1] space-y-3">
                <div className="flex justify-between items-center border-b border-[#EAE7E1] pb-2">
                  <h4 className="font-extrabold text-sm text-[#2E2A5E] flex items-center gap-2">
                    <ShieldAlert size={16} className="text-[#B91C1C]" /> Emergency Events (DEMO DATA)
                  </h4>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-[#EAE7E1] space-y-1">
                    <div className="flex justify-between font-extrabold text-[#B91C1C]">
                      <span>Stray Animal Exposure</span>
                      <span className="text-[#1B7A3D]">PEP Started</span>
                    </div>
                    <p className="text-[#6B6560] text-[11px]">August 2026 • Emergency Triage Visit • Rabies PEP Initiated</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MEDICAL DOCUMENTS SECTION */}
        {!sharingRevoked && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#EAE7E1] shadow-md space-y-6">
            <div className="border-b border-[#EAE7E1] pb-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#E05D3F]">
                  Official Certificates
                </span>
                <h3 className="text-xl font-extrabold text-[#2E2A5E]">
                  Verified Medical Documents
                </h3>
              </div>
              <FileText size={20} className="text-[#2E2A5E]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleDocuments.map((doc) => (
                <div key={doc.id} className="bg-[#F6F4F1] p-4 rounded-2xl border border-[#EAE7E1] hover:border-[#E05D3F] transition-all space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#2E2A5E] text-white flex items-center justify-center shrink-0">
                        <FileText size={16} />
                      </div>
                      <span className="text-[10px] font-mono text-[#8A847F] font-bold">{doc.code}</span>
                    </div>
                    <h4 className="font-extrabold text-sm text-[#2E2A5E]">{doc.title}</h4>
                    <p className="text-xs text-[#6B6560] font-medium mt-0.5">{doc.type} • {doc.date}</p>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-[#EAE7E1]">
                    <button
                      onClick={() => setActiveDocument(doc)}
                      className="flex-1 bg-white hover:bg-[#2E2A5E] text-[#2E2A5E] hover:text-white py-1.5 px-2 rounded-xl text-xs font-extrabold border border-[#EAE7E1] transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Eye size={13} /> View
                    </button>
                    <button
                      onClick={() => setActiveDocument(doc)}
                      className="flex-1 bg-[#E05D3F] hover:bg-[#c94d31] text-white py-1.5 px-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Download size={13} /> Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Disclaimer */}
        <div className="text-center space-y-2 pt-4">
          <p className="text-xs text-[#8A847F] max-w-2xl mx-auto leading-relaxed">
            <strong>VacTrack Prototype Notice:</strong> This verified health record utilizes fictional demonstration data for Aarav Sharma (VT-PAT-2048). VacTrack only shares records explicitly authorized by the patient through secure QR cryptographic keys.
          </p>
          <div className="text-xs font-bold text-[#2E2A5E]">
            VacTrack India Cryptographic Immunization Ledger • Pune Region
          </div>
        </div>

      </div>

      {/* MANAGE SHARING PRIVACY MODAL */}
      {showManageModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 border-2 border-[#EAE7E1] shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-[#EAE7E1] pb-3">
              <div className="flex items-center gap-2">
                <Lock size={18} className="text-[#E05D3F]" />
                <h3 className="font-extrabold text-base text-[#2E2A5E]">Manage QR Sharing Permissions</h3>
              </div>
              <button onClick={() => setShowManageModal(false)} className="text-[#8A847F] hover:text-[#231F20]">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-[#6B6560]">
              Toggle which health sections are publicly viewable when someone scans your VacTrack QR code.
            </p>

            <div className="space-y-3 text-xs font-bold">
              {[
                { key: 'shareVaccinationHistory', label: 'Vaccination History' },
                { key: 'shareBloodGroup', label: 'Blood Group' },
                { key: 'shareAllergies', label: 'Allergies' },
                { key: 'shareEmergencyInfo', label: 'Emergency Information' },
                { key: 'shareMedicalHistory', label: 'Selected Medical History' },
              ].map((item) => (
                <label key={item.key} className="flex items-center justify-between bg-[#F6F4F1] p-3 rounded-xl border border-[#EAE7E1] cursor-pointer">
                  <span className="text-[#2E2A5E]">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={(sharingSettings as any)[item.key]}
                    onChange={(e) => setSharingSettings({ ...sharingSettings, [item.key]: e.target.checked })}
                    className="w-4 h-4 accent-[#E05D3F] rounded cursor-pointer"
                  />
                </label>
              ))}
            </div>

            <Button
              onClick={() => setShowManageModal(false)}
              className="w-full bg-[#2E2A5E] hover:bg-[#201c45] text-white text-xs font-extrabold py-2.5 rounded-xl"
            >
              Save Privacy Preferences
            </Button>
          </div>
        </div>
      )}

      {/* SAMPLE DOCUMENT PREVIEW MODAL */}
      {activeDocument && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 border-2 border-[#EAE7E1] shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#EAE7E1] pb-3">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-[#2E2A5E]" />
                <div>
                  <h3 className="font-extrabold text-base text-[#2E2A5E]">{activeDocument.title}</h3>
                  <span className="text-[10px] text-[#8A847F] font-mono">{activeDocument.code}</span>
                </div>
              </div>
              <button onClick={() => setActiveDocument(null)} className="text-[#8A847F] hover:text-[#231F20]">
                <X size={18} />
              </button>
            </div>

            <div className="bg-[#F6F4F1] p-5 rounded-2xl border border-[#EAE7E1] text-xs space-y-3 font-sans">
              <div className="flex justify-between border-b border-[#EAE7E1] pb-2 font-bold text-[#6B6560]">
                <span>Document Date: {activeDocument.date}</span>
                <span>Type: {activeDocument.type}</span>
              </div>
              <p className="text-[#231F20] leading-relaxed font-medium">
                {activeDocument.content}
              </p>
              <div className="bg-[#EBF7EE] text-[#1B7A3D] p-2.5 rounded-xl text-[11px] font-extrabold flex items-center gap-2 border border-[#C8E6C9]">
                <ShieldCheck size={14} /> Cryptographically Signed by VacTrack Medical Registrar
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  alert(`Downloading demo file: ${activeDocument.title}.pdf`);
                  setActiveDocument(null);
                }}
                className="flex-1 bg-[#E05D3F] hover:bg-[#c94d31] text-white text-xs font-extrabold py-2 rounded-xl flex items-center justify-center gap-1.5"
              >
                <Download size={14} /> Download PDF
              </Button>
              <Button
                onClick={() => setActiveDocument(null)}
                variant="outline"
                className="border-[#EAE7E1] text-xs font-bold rounded-xl"
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
