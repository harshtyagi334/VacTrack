import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ExportVaccinationReportModal } from '../components/ExportVaccinationReportModal';
import { 
  AlertTriangle, User, Activity, Clock, Plus, ShieldCheck, HeartPulse, 
  CheckCircle2, FileText, Pill, Stethoscope, AlertCircle, Edit3, Check, X, Download
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

export function PatientHealthRecord() {
  const { currentUser, currentPatientId, patients, doses, clinics, updateHealthRecord } = useAppStore();
  const [showExportModal, setShowExportModal] = useState(false);
  
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
      seriousReactions: ['Mild localized swelling post-booster (2021)'],
      medicalConditions: ['Asthma (Mild)'],
      medications: ['Salbutamol Inhaler (As needed)'],
      majorTreatments: ['None reported'],
      previousVaccinations: [
        { name: 'COVID-19 Booster', date: '2023-01-14' },
        { name: 'Polio (OPV)', date: '2009-03-10' }
      ],
      emergencyNotes: 'Contact family physician Dr. K. Sharma (Pune) in emergency.',
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
  const completedDosesCount = patientDoses.filter(d => d.status === 'completed').length || 2;
  const healthRecord = patient.healthRecord || {
    bloodGroup: 'B+',
    allergies: ['Penicillin'],
    seriousReactions: [],
    medicalConditions: [],
    medications: [],
    majorTreatments: [],
    previousVaccinations: [],
    emergencyNotes: '',
    privacySettings: {
      shareBloodGroup: true,
      shareAllergies: true,
      shareVaccinationHistory: true,
      shareMedicalConditions: false,
      shareMedications: false
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [newAllergyInput, setNewAllergyInput] = useState('');
  const [newConditionInput, setNewConditionInput] = useState('');
  const [newMedicationInput, setNewMedicationInput] = useState('');
  const [emergencyNotesInput, setEmergencyNotesInput] = useState(healthRecord.emergencyNotes || '');

  const handleSaveNotes = () => {
    updateHealthRecord(patient.id, {
      emergencyNotes: emergencyNotesInput
    });
    setIsEditing(false);
  };

  const handleAddAllergy = () => {
    if (newAllergyInput.trim()) {
      updateHealthRecord(patient.id, {
        allergies: [...(healthRecord.allergies || []), newAllergyInput.trim()]
      });
      setNewAllergyInput('');
    }
  };

  const handleRemoveAllergy = (item: string) => {
    updateHealthRecord(patient.id, {
      allergies: (healthRecord.allergies || []).filter(a => a !== item)
    });
  };

  const togglePrivacy = (key: keyof typeof healthRecord.privacySettings) => {
    updateHealthRecord(patient.id, {
      privacySettings: {
        ...healthRecord.privacySettings,
        [key]: !healthRecord.privacySettings?.[key]
      }
    });
  };

  const hasAllergies = healthRecord.allergies && healthRecord.allergies.length > 0;

  return (
    <div className="bg-[#F6F4F1] min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header Title */}
        <header className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#EAE7E1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#F6F4F1] text-[#E05D3F] mb-2 border border-[#EAE7E1]">
              <FileText size={13} className="text-[#2E2A5E]" /> Health Passport & Medical Log
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#2E2A5E]">
              My Health Record
            </h1>
            <p className="text-[#6B6560] text-xs sm:text-sm mt-1 max-w-xl">
              A comprehensive, easy-to-access record of your personal details, immunization history, medical conditions, and emergency instructions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              onClick={() => setShowExportModal(true)}
              className="bg-[#2E2A5E] hover:bg-[#201c45] text-white px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Download size={14} className="text-[#F2A93B]" />
              <span>Export Medical PDF</span>
            </Button>

            <Button 
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              className="flex items-center gap-2 rounded-xl text-xs font-extrabold border-2 border-[#2E2A5E] text-[#2E2A5E] hover:bg-[#2E2A5E] hover:text-white transition-all shrink-0 cursor-pointer"
            >
              <Edit3 size={15} />
              <span>{isEditing ? 'Close Editing' : 'Update Medical Info'}</span>
            </Button>
          </div>
        </header>

        {/* Functional Alert Banner: Important Allergy (Red only as a functional alert) */}
        {hasAllergies && (
          <div className="bg-[#FEF2F2] border-2 border-[#FCA5A5] p-5 rounded-2xl flex items-start gap-4 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#DC2626] text-white flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle size={22} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-[#DC2626] text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                  Functional Alert
                </span>
                <h3 className="text-base font-extrabold text-[#991B1B]">
                  Important Allergy
                </h3>
              </div>
              <p className="text-xs text-[#7F1D1D] font-medium leading-relaxed">
                Attending medical personnel must review reported hypersensitivities before administering antibiotics or serums:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {healthRecord.allergies.map((allergy, i) => (
                  <span key={i} className="bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5] px-3 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1.5">
                    ⚠️ {allergy}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Personal Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white border-2 border-[#EAE7E1] rounded-3xl shadow-xs overflow-hidden">
              <CardHeader className="bg-[#F6F4F1]/60 border-b border-[#EAE7E1] pb-4">
                <CardTitle className="text-base font-extrabold text-[#2E2A5E] flex items-center gap-2">
                  <User size={18} className="text-[#E05D3F]" /> Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 sm:p-6 space-y-4">
                <div className="border-b border-[#EAE7E1] pb-3">
                  <span className="text-[10px] uppercase font-extrabold text-[#8A847F] tracking-wider block">Full Name</span>
                  <span className="text-base font-extrabold text-[#2E2A5E] block mt-0.5">{patient.name}</span>
                </div>

                <div className="border-b border-[#EAE7E1] pb-3">
                  <span className="text-[10px] uppercase font-extrabold text-[#8A847F] tracking-wider block">Date of Birth</span>
                  <span className="text-sm font-bold text-[#2E2A5E] block mt-0.5">
                    {patient.dob ? format(parseISO(patient.dob), 'dd MMMM yyyy') : '02 April 2004'}
                  </span>
                </div>

                <div className="border-b border-[#EAE7E1] pb-3">
                  <span className="text-[10px] uppercase font-extrabold text-[#8A847F] tracking-wider block">Blood Group</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5] text-lg font-extrabold px-3 py-0.5 rounded-xl">
                      {healthRecord.bloodGroup || 'B+'}
                    </span>
                    <span className="text-xs text-[#8A847F] font-semibold">Universal Receiver Compatible</span>
                  </div>
                </div>

                <div className="border-b border-[#EAE7E1] pb-3">
                  <span className="text-[10px] uppercase font-extrabold text-[#8A847F] tracking-wider block">Phone Number</span>
                  <span className="text-sm font-bold text-[#2E2A5E] block mt-0.5">+91 {patient.phone}</span>
                </div>

                <div className="border-b border-[#EAE7E1] pb-3">
                  <span className="text-[10px] uppercase font-extrabold text-[#8A847F] tracking-wider block">Email Address</span>
                  <span className="text-xs font-bold text-[#2E2A5E] block mt-0.5 break-all">{patient.email}</span>
                </div>

                <div className="border-b border-[#EAE7E1] pb-3">
                  <span className="text-[10px] uppercase font-extrabold text-[#8A847F] tracking-wider block">City</span>
                  <span className="text-sm font-bold text-[#2E2A5E] block mt-0.5">{patient.city || 'Pune'}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-extrabold text-[#8A847F] tracking-wider block">Residential Address</span>
                  <span className="text-xs font-bold text-[#6B6560] block mt-0.5 leading-relaxed">
                    {patient.address || 'Shivajinagar, Pune, Maharashtra'} (PIN: {patient.pinCode || '411005'})
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Info Sharing Controls */}
            <Card className="bg-white border-2 border-[#EAE7E1] rounded-3xl shadow-xs">
              <CardHeader className="bg-[#F6F4F1]/60 border-b border-[#EAE7E1] pb-3">
                <CardTitle className="text-sm font-extrabold text-[#2E2A5E] flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#1B7A3D]" /> Emergency QR Consent
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                <p className="text-[11px] text-[#6B6560] leading-relaxed">
                  Toggle what information attending emergency paramedics can access when scanning your QR code:
                </p>

                {[
                  { key: 'shareBloodGroup', label: 'Share Blood Group' },
                  { key: 'shareAllergies', label: 'Share Known Allergies' },
                  { key: 'shareVaccinationHistory', label: 'Share Immunization History' },
                  { key: 'shareMedicalConditions', label: 'Share Existing Medical Conditions' },
                  { key: 'shareMedications', label: 'Share Active Medications' },
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-3 p-2.5 rounded-xl border border-[#EAE7E1] hover:bg-[#F6F4F1] cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded text-[#E05D3F] focus:ring-[#E05D3F]" 
                      checked={healthRecord.privacySettings?.[item.key as keyof typeof healthRecord.privacySettings] ?? true} 
                      onChange={() => togglePrivacy(item.key as any)} 
                    />
                    <span className="text-xs font-extrabold text-[#2E2A5E]">{item.label}</span>
                  </label>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Vaccination History, Medical History, and Timeline */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Vaccination History */}
            <Card className="bg-white border-2 border-[#EAE7E1] rounded-3xl shadow-xs overflow-hidden">
              <CardHeader className="bg-[#F6F4F1]/60 border-b border-[#EAE7E1] pb-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-extrabold text-[#2E2A5E] flex items-center gap-2">
                    <ShieldCheck size={18} className="text-[#1B7A3D]" /> Vaccination History
                  </CardTitle>
                  <p className="text-xs text-[#6B6560] mt-0.5">Verified immunization records linked to your national health profile</p>
                </div>
              </CardHeader>
              <CardContent className="p-5 sm:p-6 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* COVID-19 */}
                  <div className="p-4 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1] flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-[#2E2A5E]">COVID-19</h4>
                      <p className="text-[10px] text-[#8A847F] mt-0.5">Booster Dose • 20 Aug 2021</p>
                    </div>
                    <span className="bg-[#EBF7EE] text-[#1B7A3D] border border-[#C8E6C9] px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 shrink-0">
                      <CheckCircle2 size={13} /> Completed
                    </span>
                  </div>

                  {/* Polio */}
                  <div className="p-4 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1] flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-[#2E2A5E]">Polio</h4>
                      <p className="text-[10px] text-[#8A847F] mt-0.5">OPV/IPV Immunization • 15 Mar 2008</p>
                    </div>
                    <span className="bg-[#EBF7EE] text-[#1B7A3D] border border-[#C8E6C9] px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 shrink-0">
                      <CheckCircle2 size={13} /> Completed
                    </span>
                  </div>

                  {/* Tetanus */}
                  <div className="p-4 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1] flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-[#2E2A5E]">Tetanus</h4>
                      <p className="text-[10px] text-[#8A847F] mt-0.5">Toxoid Booster • 12 Jun 2026</p>
                    </div>
                    <span className="bg-[#EBF7EE] text-[#1B7A3D] border border-[#C8E6C9] px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 shrink-0">
                      <CheckCircle2 size={13} /> Completed
                    </span>
                  </div>

                  {/* Rabies PEP */}
                  <div className="p-4 bg-[#FEF3F2] rounded-2xl border border-[#FECDCA] flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-[#2E2A5E]">Rabies PEP</h4>
                      <p className="text-[10px] text-[#E05D3F] font-bold mt-0.5">Essen Protocol • Active</p>
                    </div>
                    <span className="bg-[#FEF3F2] text-[#E05D3F] border border-[#FECDCA] px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 shrink-0">
                      2/5 doses
                    </span>
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* 2. Medical History (Allergies, Reactions, Conditions, Medications, Treatments, Notes) */}
            <Card className="bg-white border-2 border-[#EAE7E1] rounded-3xl shadow-xs overflow-hidden">
              <CardHeader className="bg-[#F6F4F1]/60 border-b border-[#EAE7E1] pb-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-extrabold text-[#2E2A5E] flex items-center gap-2">
                    <Activity size={18} className="text-[#E05D3F]" /> Medical History
                  </CardTitle>
                  <p className="text-xs text-[#6B6560] mt-0.5">Personal health details provided for clinical reference</p>
                </div>
              </CardHeader>
              <CardContent className="p-5 sm:p-6 space-y-5">
                
                {/* Known Allergies */}
                <div className="border-b border-[#EAE7E1] pb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] flex items-center gap-1.5">
                      <AlertCircle size={15} className="text-[#DC2626]" /> Known Allergies
                    </span>
                  </div>
                  {hasAllergies ? (
                    <div className="flex flex-wrap gap-2">
                      {healthRecord.allergies.map((a, i) => (
                        <span key={i} className="bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5] px-3 py-1 rounded-xl text-xs font-extrabold flex items-center gap-2">
                          {a}
                          {isEditing && (
                            <button type="button" onClick={() => handleRemoveAllergy(a)} className="text-[#991B1B] hover:text-black font-bold cursor-pointer">×</button>
                          )}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#8A847F] italic">No known drug or food allergies reported.</p>
                  )}

                  {isEditing && (
                    <div className="flex gap-2 pt-2">
                      <input 
                        type="text" 
                        placeholder="Add new allergy (e.g. Sulfa, Peanuts)..." 
                        className="flex-1 px-3 py-2 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-[#E05D3F]"
                        value={newAllergyInput}
                        onChange={e => setNewAllergyInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddAllergy()}
                      />
                      <Button onClick={handleAddAllergy} size="sm" className="text-xs px-4 py-2 font-bold rounded-xl">Add</Button>
                    </div>
                  )}
                </div>

                {/* Previous Serious Reactions */}
                <div className="border-b border-[#EAE7E1] pb-4 space-y-1.5">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] flex items-center gap-1.5">
                    <HeartPulse size={15} className="text-[#D97706]" /> Previous Serious Reactions
                  </span>
                  <p className="text-xs font-semibold text-[#6B6560]">
                    {healthRecord.seriousReactions?.length 
                      ? healthRecord.seriousReactions.join(', ') 
                      : 'Mild localized swelling post-booster (2021). No severe anaphylaxis reported.'}
                  </p>
                </div>

                {/* Existing Medical Conditions */}
                <div className="border-b border-[#EAE7E1] pb-4 space-y-1.5">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] flex items-center gap-1.5">
                    <Stethoscope size={15} className="text-[#2E2A5E]" /> Existing Medical Conditions
                  </span>
                  <p className="text-xs font-semibold text-[#6B6560]">
                    {healthRecord.medicalConditions?.length 
                      ? healthRecord.medicalConditions.join(', ') 
                      : 'Asthma (Mild, controlled). No chronic diabetes or hypertension.'}
                  </p>
                </div>

                {/* Important Medications */}
                <div className="border-b border-[#EAE7E1] pb-4 space-y-1.5">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] flex items-center gap-1.5">
                    <Pill size={15} className="text-[#1B7A3D]" /> Important Medications
                  </span>
                  <p className="text-xs font-semibold text-[#6B6560]">
                    {healthRecord.medications?.length 
                      ? healthRecord.medications.join(', ') 
                      : 'Salbutamol Inhaler (As needed for exertion).'}
                  </p>
                </div>

                {/* Previous Major Treatments */}
                <div className="border-b border-[#EAE7E1] pb-4 space-y-1.5">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] flex items-center gap-1.5">
                    <FileText size={15} className="text-[#8A847F]" /> Previous Major Treatments
                  </span>
                  <p className="text-xs font-semibold text-[#6B6560]">
                    {healthRecord.majorTreatments?.length 
                      ? healthRecord.majorTreatments.join(', ') 
                      : 'Minor knee arthroscopy (2023, fully recovered).'}
                  </p>
                </div>

                {/* Emergency Notes */}
                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] flex items-center gap-1.5">
                    <AlertTriangle size={15} className="text-[#E05D3F]" /> Emergency Notes
                  </span>
                  {!isEditing ? (
                    <div className="p-3.5 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1] text-xs font-medium text-[#2E2A5E]">
                      {healthRecord.emergencyNotes || 'Contact family physician Dr. K. Sharma (Pune) in emergency.'}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <textarea
                        rows={2}
                        className="w-full p-3 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-[#E05D3F]"
                        value={emergencyNotesInput}
                        onChange={e => setEmergencyNotesInput(e.target.value)}
                        placeholder="Add emergency instructions or contact numbers..."
                      />
                      <Button onClick={handleSaveNotes} size="sm" className="text-xs py-2 font-bold rounded-xl">Save Emergency Notes</Button>
                    </div>
                  )}
                </div>

              </CardContent>
            </Card>

            {/* 3. Visual Medical Timeline */}
            <Card className="bg-white border-2 border-[#EAE7E1] rounded-3xl shadow-xs overflow-hidden">
              <CardHeader className="bg-[#F6F4F1]/60 border-b border-[#EAE7E1] pb-4">
                <CardTitle className="text-base font-extrabold text-[#2E2A5E] flex items-center gap-2">
                  <Clock size={18} className="text-[#E05D3F]" /> Visual Medical Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8">
                <div className="relative border-l-2 border-[#E05D3F]/30 ml-4 space-y-8 py-2">
                  
                  {/* Event 1: August 2026 */}
                  <div className="relative pl-6">
                    <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-[#E05D3F] border-4 border-white shadow-xs" />
                    <div className="bg-[#FEF3F2] p-4 rounded-2xl border border-[#FECDCA]">
                      <span className="text-[10px] uppercase font-extrabold text-[#E05D3F] tracking-wider block">August 2026</span>
                      <h4 className="text-sm font-extrabold text-[#2E2A5E] mt-0.5">Rabies Vaccination Started</h4>
                      <p className="text-xs text-[#6B6560] mt-1">Post-Exposure Prophylaxis (PEP) Essen 5-dose protocol initiated. 2 of 5 doses completed.</p>
                    </div>
                  </div>

                  {/* Event 2: June 2026 */}
                  <div className="relative pl-6">
                    <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-[#1B7A3D] border-4 border-white shadow-xs" />
                    <div className="bg-[#F6F4F1] p-4 rounded-2xl border border-[#EAE7E1]">
                      <span className="text-[10px] uppercase font-extrabold text-[#1B7A3D] tracking-wider block">June 2026</span>
                      <h4 className="text-sm font-extrabold text-[#2E2A5E] mt-0.5">Tetanus Vaccination Recorded</h4>
                      <p className="text-xs text-[#6B6560] mt-1">Tetanus Toxoid booster administered and verified at Shivajinagar Centre.</p>
                    </div>
                  </div>

                  {/* Event 3: March 2026 */}
                  <div className="relative pl-6">
                    <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-[#2E2A5E] border-4 border-white shadow-xs" />
                    <div className="bg-[#F6F4F1] p-4 rounded-2xl border border-[#EAE7E1]">
                      <span className="text-[10px] uppercase font-extrabold text-[#2E2A5E] tracking-wider block">March 2026</span>
                      <h4 className="text-sm font-extrabold text-[#2E2A5E] mt-0.5">Health Record Updated</h4>
                      <p className="text-xs text-[#6B6560] mt-1">Updated blood group, asthma status, and emergency contact details on VacTrack.</p>
                    </div>
                  </div>

                  {/* Event 4: August 2021 */}
                  <div className="relative pl-6">
                    <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-[#8A847F] border-4 border-white shadow-xs" />
                    <div className="bg-[#F6F4F1] p-4 rounded-2xl border border-[#EAE7E1]">
                      <span className="text-[10px] uppercase font-extrabold text-[#8A847F] tracking-wider block">August 2021</span>
                      <h4 className="text-sm font-extrabold text-[#2E2A5E] mt-0.5">COVID-19 Booster Completed</h4>
                      <p className="text-xs text-[#6B6560] mt-1">Precautionary COVID booster dose administered and verified.</p>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>

          </div>

        </div>

        {/* Export Vaccination Report Modal */}
        <ExportVaccinationReportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          patient={patient}
          doses={doses[patient.id] || []}
          clinics={clinics}
          healthRecord={patient.healthRecord}
        />

      </div>
    </div>
  );
}
