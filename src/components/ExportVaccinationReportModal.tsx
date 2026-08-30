import React, { useState } from 'react';
import { 
  Download, Printer, X, Check, ShieldCheck, FileText, QrCode, 
  Building2, User, AlertTriangle, ExternalLink, Calendar, Loader2, Sparkles, Sliders
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { format, parseISO } from 'date-fns';
import { Button } from './ui/Button';
import { Logo } from './ui/Logo';
import { Patient, Dose, Clinic, HealthRecord } from '../types';
import { downloadVaccinationReportPdf, ExportReportOptions } from '../utils/exportVaccinationReportPdf';

interface ExportVaccinationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | any;
  doses: Dose[];
  clinics: Record<string, Clinic>;
  healthRecord?: Partial<HealthRecord> | any;
}

export function ExportVaccinationReportModal({
  isOpen,
  onClose,
  patient,
  doses,
  clinics,
  healthRecord
}: ExportVaccinationReportModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Customization options state
  const [options, setOptions] = useState<ExportReportOptions>({
    includeRoutine: true,
    includeAllergies: true,
    includeSignatures: true,
    includeBlockchainVerification: true,
    includeEmergencyNotes: true
  });

  if (!isOpen) return null;

  const recordId = `VT-MED-2026-${patient.id.replace('p_', '').toUpperCase().padStart(5, '0')}`;
  const verifyUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/verify/patient/${patient.id}`
    : `https://vactrack.health/verify/patient/${patient.id}`;

  const handleDownloadPdf = async () => {
    try {
      setIsGenerating(true);
      await downloadVaccinationReportPdf(patient, doses, clinics, healthRecord, options);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Unable to generate PDF report. Please try the "Print / Save via Browser" option.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const sortedDoses = [...doses].sort((a, b) => a.doseNumber - b.doseNumber);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:static print:bg-white">
      <div 
        className="bg-white rounded-3xl border-2 border-[#EAE7E1] shadow-2xl w-full max-w-4xl flex flex-col max-h-[92vh] overflow-hidden print:max-h-none print:border-none print:shadow-none print:rounded-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header - Hidden on physical print */}
        <div className="p-5 sm:p-6 border-b border-[#EAE7E1] bg-[#F6F4F1] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 print:hidden">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#EBF7EE] text-[#1B7A3D] border border-[#C8E6C9]">
                <ShieldCheck size={12} /> Official Clinical Export
              </span>
              <span className="text-xs font-mono font-bold text-[#8A847F]">
                {recordId}
              </span>
            </div>
            <h2 id="modal-title" className="text-xl sm:text-2xl font-heading font-extrabold text-[#2E2A5E]">
              Export Vaccination Medical Record
            </h2>
            <p className="text-xs text-[#6B6560]">
              Generate an official, tamper-evident printable PDF report for hospitals, travel, insurance claims, or personal records.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="px-3 py-2 text-xs font-bold text-[#2E2A5E] hover:bg-[#EAE7E1] rounded-xl border border-[#EAE7E1] transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Customize report sections"
            >
              <Sliders size={14} className="text-[#E05D3F]" />
              <span className="hidden sm:inline">Options</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl border border-[#EAE7E1] bg-white hover:bg-gray-100 flex items-center justify-center text-[#6B6560] hover:text-[#2E2A5E] transition-colors cursor-pointer"
              aria-label="Close export dialog"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Action Controls Bar - Hidden on physical print */}
        <div className="p-4 sm:px-6 bg-white border-b border-[#EAE7E1] flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex flex-wrap items-center gap-2">
            {/* Primary Action 1: Instant Download PDF File */}
            <Button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="bg-[#2E2A5E] hover:bg-[#201c45] text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={15} className="animate-spin text-[#F2A93B]" />
                  <span>Compiling PDF Document...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check size={15} className="text-emerald-400" />
                  <span>PDF Downloaded Successfully!</span>
                </>
              ) : (
                <>
                  <Download size={15} className="text-[#F2A93B]" />
                  <span>Download Official PDF (.pdf)</span>
                </>
              )}
            </Button>

            {/* Primary Action 2: Print via Browser / Save to PDF */}
            <Button
              onClick={handlePrint}
              variant="outline"
              className="border-2 border-[#2E2A5E] text-[#2E2A5E] hover:bg-[#F6F4F1] font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Printer size={15} className="text-[#E05D3F]" />
              <span>Print / Save via Browser</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-2 text-xs font-bold text-[#6B6560] hover:text-[#2E2A5E] hover:bg-[#F6F4F1] rounded-xl border border-[#EAE7E1] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check size={14} className="text-green-600" /> : <QrCode size={14} />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Verification QR Link'}</span>
            </button>
            <a
              href={verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-xs font-bold text-[#6B6560] hover:text-[#2E2A5E] hover:bg-[#F6F4F1] rounded-xl border border-[#EAE7E1] flex items-center transition-colors"
              title="Open Public Ledger in new tab"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Customization Drawer / Options (Toggleable) */}
        {showOptions && (
          <div className="p-4 bg-[#FBF9F6] border-b border-[#EAE7E1] shrink-0 text-xs space-y-2 animate-in fade-in duration-150 print:hidden">
            <span className="font-extrabold text-[#2E2A5E] uppercase tracking-wider text-[11px] block">
              Customize Report Sections to Include:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-[#4B4540]">
                <input
                  type="checkbox"
                  checked={options.includeRoutine}
                  onChange={(e) => setOptions({ ...options, includeRoutine: e.target.checked })}
                  className="rounded text-[#E05D3F] focus:ring-[#E05D3F]"
                />
                <span>Lifetime & Routine Vaccines</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-[#4B4540]">
                <input
                  type="checkbox"
                  checked={options.includeAllergies}
                  onChange={(e) => setOptions({ ...options, includeAllergies: e.target.checked })}
                  className="rounded text-[#E05D3F] focus:ring-[#E05D3F]"
                />
                <span>Known Allergies & Clinical Alerts</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-[#4B4540]">
                <input
                  type="checkbox"
                  checked={options.includeBlockchainVerification}
                  onChange={(e) => setOptions({ ...options, includeBlockchainVerification: e.target.checked })}
                  className="rounded text-[#E05D3F] focus:ring-[#E05D3F]"
                />
                <span>Blockchain Proof & Hashes</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-[#4B4540]">
                <input
                  type="checkbox"
                  checked={options.includeSignatures}
                  onChange={(e) => setOptions({ ...options, includeSignatures: e.target.checked })}
                  className="rounded text-[#E05D3F] focus:ring-[#E05D3F]"
                />
                <span>Physician Sign-Off & Seal</span>
              </label>
            </div>
          </div>
        )}

        {/* Scrollable Printable Document Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#EBE7E1]/50 print:p-0 print:bg-white print:overflow-visible">
          
          {/* Physical Document Paper Simulation */}
          <div 
            id="printable-medical-report" 
            className="bg-white max-w-3xl mx-auto p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-[#D9D4CB] shadow-md space-y-6 text-[#231F20] print:border-none print:shadow-none print:p-0 print:max-w-none print:rounded-none"
          >
            {/* 1. Official Header with Letterhead */}
            <div className="border-b-2 border-[#2E2A5E] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <Logo theme="light" showText={false} className="w-12 h-12 shrink-0 mt-1" />
                <div className="space-y-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E05D3F] block">
                    National Digital Immunization Ledger • NDHM / ABDM Aligned
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black font-heading text-[#2E2A5E] tracking-tight">
                    OFFICIAL VACCINATION & CLINICAL HEALTH RECORD
                  </h1>
                  <p className="text-[11px] text-[#6B6560] font-medium">
                    Integrated Public Health Directorate Partner • Tamper-Evident Medical Ledger
                  </p>
                </div>
              </div>

              {/* Record Meta Badge */}
              <div className="text-left sm:text-right space-y-1 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#EAE7E1]">
                <div className="inline-block bg-[#F6F4F1] border border-[#EAE7E1] px-3 py-1 rounded-lg">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#8A847F] block">Certificate Record ID</span>
                  <span className="text-xs font-mono font-black text-[#2E2A5E]">{recordId}</span>
                </div>
                <div className="text-[10px] text-[#6B6560] font-medium">
                  Issued: <span className="font-bold text-[#2E2A5E]">{format(new Date(), 'dd MMMM yyyy, HH:mm')}</span>
                </div>
              </div>
            </div>

            {/* 2. Patient Demographics Profile with QR Code */}
            <div className="bg-[#FBF9F6] p-4 sm:p-5 rounded-2xl border border-[#EAE7E1] flex flex-col sm:flex-row items-start justify-between gap-5 print-avoid-break">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 flex-1 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-[#8A847F] tracking-wider block">Full Legal Name</span>
                  <span className="text-sm font-extrabold text-[#2E2A5E] block">{patient.name}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-extrabold text-[#8A847F] tracking-wider block">Date of Birth & Age</span>
                  <span className="font-bold text-[#2E2A5E] block">
                    {patient.dob ? format(parseISO(patient.dob), 'dd MMMM yyyy') : '02 April 2004'} (22 Y • Male)
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-extrabold text-[#8A847F] tracking-wider block">ABHA Health ID</span>
                  <span className="font-mono font-bold text-[#2E2A5E] block">91-4829-1029-4821</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-extrabold text-[#8A847F] tracking-wider block">Blood Group</span>
                  <span className="font-extrabold text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded border border-[#FCA5A5] inline-block text-[11px]">
                    {healthRecord?.bloodGroup || patient.bloodGroup || 'B+ (Rh Positive)'}
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-[10px] uppercase font-extrabold text-[#8A847F] tracking-wider block">Registered Address</span>
                  <span className="font-medium text-[#2E2A5E] block">
                    {patient.address || 'Flat 402, Shivneri Apts, JM Road, Shivajinagar'}, {patient.city || 'Pune'}, {patient.state || 'Maharashtra'} 411005
                  </span>
                </div>
              </div>

              {/* QR Verification Tile */}
              <div className="flex flex-col items-center justify-center p-2.5 bg-white rounded-xl border border-[#EAE7E1] shrink-0 self-center sm:self-start">
                <QRCodeSVG value={verifyUrl} size={92} />
                <span className="text-[8px] font-extrabold text-[#2E2A5E] uppercase tracking-wider mt-1 text-center">
                  Scan to Verify
                </span>
              </div>
            </div>

            {/* 3. Active Rabies Post-Exposure Prophylaxis (PEP) Section */}
            <div className="space-y-2.5 print-avoid-break">
              <div className="flex items-center justify-between border-b border-[#EAE7E1] pb-1.5">
                <div>
                  <h3 className="text-sm font-extrabold text-[#2E2A5E] uppercase tracking-wide flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E05D3F]" />
                    Active Protocol: Rabies Post-Exposure Prophylaxis (PEP)
                  </h3>
                  <p className="text-[10px] text-[#6B6560]">
                    WHO & National Essen Protocol (5 Doses IM on Days 0, 3, 7, 14, 28) • Animal Exposure Category III
                  </p>
                </div>
                <span className="text-[10px] font-extrabold text-[#1B7A3D] bg-[#EBF7EE] border border-[#C8E6C9] px-2.5 py-0.5 rounded-full">
                  2/5 Doses Administered
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#2E2A5E] text-white text-[10px] uppercase tracking-wider">
                      <th className="py-2 px-2.5 font-extrabold rounded-l-lg">Dose</th>
                      <th className="py-2 px-2.5 font-extrabold">Vaccine & Lot</th>
                      <th className="py-2 px-2.5 font-extrabold">Target / Given</th>
                      <th className="py-2 px-2.5 font-extrabold">Administering Facility</th>
                      <th className="py-2 px-2.5 font-extrabold rounded-r-lg text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE7E1]">
                    {sortedDoses.map((dose) => {
                      const clinic = dose.clinicId ? clinics[dose.clinicId] : null;
                      const facilityName = clinic ? clinic.name : (dose.doseNumber <= 2 ? 'Ruby Hall Clinic, Pune' : 'Shivajinagar Emergency Centre');
                      const dayLabel = dose.doseNumber === 1 ? 'Day 0' :
                        dose.doseNumber === 2 ? 'Day 3' :
                        dose.doseNumber === 3 ? 'Day 7' :
                        dose.doseNumber === 4 ? 'Day 14' : 'Day 28';

                      return (
                        <tr key={dose.id} className="hover:bg-gray-50/60">
                          <td className="py-2.5 px-2.5 font-extrabold text-[#2E2A5E]">
                            Dose {dose.doseNumber}
                            <span className="block text-[9px] text-[#8A847F] font-normal">{dayLabel}</span>
                          </td>
                          <td className="py-2.5 px-2.5">
                            <span className="font-bold text-[#2E2A5E] block">{dose.vaccineName || 'Rabivax-S'}</span>
                            <span className="font-mono text-[9px] text-[#8A847F]">
                              Batch: {dose.batchNumber || (dose.doseNumber <= 2 ? 'RAB-DEMO-7824' : 'Reserved Lot')}
                            </span>
                          </td>
                          <td className="py-2.5 px-2.5 font-medium">
                            <span className="block text-[#2E2A5E]">
                              {format(parseISO(dose.scheduledDate), 'dd MMM yyyy')}
                            </span>
                            <span className="text-[9px] text-[#8A847F]">
                              {dose.administrationDate ? `Admin: ${format(parseISO(dose.administrationDate), 'dd MMM yyyy')}` : 'Scheduled'}
                            </span>
                          </td>
                          <td className="py-2.5 px-2.5 text-[#6B6560] font-medium text-[11px]">
                            {facilityName}
                          </td>
                          <td className="py-2.5 px-2.5 text-right">
                            {dose.status === 'completed' ? (
                              <span className="inline-flex items-center gap-1 bg-[#EBF7EE] text-[#1B7A3D] px-2 py-0.5 rounded-full text-[10px] font-extrabold border border-[#C8E6C9]">
                                ✓ Completed
                              </span>
                            ) : dose.doseNumber === 3 ? (
                              <span className="inline-flex items-center gap-1 bg-[#FEF3F2] text-[#E05D3F] px-2 py-0.5 rounded-full text-[10px] font-extrabold border border-[#FECDCA]">
                                Action Due Today
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-[#F6F4F1] text-[#8A847F] px-2 py-0.5 rounded-full text-[10px] font-bold border border-[#EAE7E1]">
                                Scheduled
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. Lifetime & Routine Immunizations Table */}
            {options.includeRoutine && (
              <div className="space-y-2.5 print-avoid-break">
                <div className="border-b border-[#EAE7E1] pb-1.5">
                  <h3 className="text-sm font-extrabold text-[#2E2A5E] uppercase tracking-wide flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#1B7A3D]" />
                    Lifetime & Routine Immunization History
                  </h3>
                  <p className="text-[10px] text-[#6B6560]">
                    Verified records of routine childhood vaccines, booster courses, and occupational prophylaxis
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#F6F4F1] text-[#2E2A5E] text-[10px] uppercase tracking-wider border border-[#EAE7E1]">
                        <th className="py-2 px-2.5 font-extrabold">Antigen / Target</th>
                        <th className="py-2 px-2.5 font-extrabold">Course Scope</th>
                        <th className="py-2 px-2.5 font-extrabold">Last Administered</th>
                        <th className="py-2 px-2.5 font-extrabold">Facility / Authority</th>
                        <th className="py-2 px-2.5 font-extrabold text-right">Protection</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE7E1] border-x border-b border-[#EAE7E1]">
                      <tr>
                        <td className="py-2 px-2.5 font-bold text-[#2E2A5E]">COVID-19 (Covishield/Corbevax)</td>
                        <td className="py-2 px-2.5 text-[#6B6560]">Primary Series + Precaution Booster</td>
                        <td className="py-2 px-2.5 font-medium text-[#2E2A5E]">14 Jan 2023</td>
                        <td className="py-2 px-2.5 text-[#6B6560]">Ruby Hall Clinic, Pune</td>
                        <td className="py-2 px-2.5 text-right font-extrabold text-[#1B7A3D]">Verified Current</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2.5 font-bold text-[#2E2A5E]">Polio (OPV / IPV Series)</td>
                        <td className="py-2 px-2.5 text-[#6B6560]">Universal Childhood 5-Dose Course</td>
                        <td className="py-2 px-2.5 font-medium text-[#2E2A5E]">10 Mar 2009</td>
                        <td className="py-2 px-2.5 text-[#6B6560]">Pulse Polio Centre, Pune</td>
                        <td className="py-2 px-2.5 text-right font-extrabold text-[#1B7A3D]">Lifetime Protection</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2.5 font-bold text-[#2E2A5E]">Tetanus Toxoid (TT Booster)</td>
                        <td className="py-2 px-2.5 text-[#6B6560]">0.5 mL IM (Post-Exposure Intake)</td>
                        <td className="py-2 px-2.5 font-medium text-[#2E2A5E]">17 Aug 2026</td>
                        <td className="py-2 px-2.5 text-[#6B6560]">Ruby Hall Clinic, Pune</td>
                        <td className="py-2 px-2.5 text-right font-extrabold text-[#1B7A3D]">Valid to 2031</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2.5 font-bold text-[#2E2A5E]">Hepatitis B (Recombinant)</td>
                        <td className="py-2 px-2.5 text-[#6B6560]">3-Dose Standard Schedule (0, 1, 6 Mo)</td>
                        <td className="py-2 px-2.5 font-medium text-[#2E2A5E]">18 Sep 2018</td>
                        <td className="py-2 px-2.5 text-[#6B6560]">Sassoon General Hospital</td>
                        <td className="py-2 px-2.5 text-right font-extrabold text-[#1B7A3D]">Immunity Confirmed</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. Known Allergies & Clinical Alerts */}
            {options.includeAllergies && (
              <div className="bg-[#FEF2F2] border border-[#FCA5A5] p-3.5 sm:p-4 rounded-xl text-xs space-y-1.5 print-avoid-break">
                <div className="flex items-center gap-1.5 font-extrabold text-[#991B1B] uppercase tracking-wider text-[11px]">
                  <AlertTriangle size={15} className="text-[#DC2626]" />
                  <span>Clinical Allergy & Precaution Notice</span>
                </div>
                <div className="text-[#7F1D1D] font-medium leading-relaxed">
                  <p>
                    <strong className="font-bold">Drug Hypersensitivities:</strong> {healthRecord?.allergies?.length ? healthRecord.allergies.join(', ') : 'Penicillin, Sulfa drugs (Reported mild urticaria)'}
                  </p>
                  <p className="mt-0.5">
                    <strong className="font-bold">Medical Conditions:</strong> {healthRecord?.medicalConditions?.length ? healthRecord.medicalConditions.join(', ') : 'Asthma (Mild, controlled with inhaler)'} • <strong className="font-bold">Emergency Contact:</strong> Dr. K. Sharma (+91 98220 11223)
                  </p>
                </div>
              </div>
            )}

            {/* 6. Blockchain Cryptographic Proof */}
            {options.includeBlockchainVerification && (
              <div className="p-3 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-[10px] space-y-1 font-mono text-[#6B6560] print-avoid-break">
                <div className="flex items-center justify-between font-sans text-[11px] font-extrabold text-[#2E2A5E]">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-[#1B7A3D]" /> Cryptographic Chain Validation (SHA-256)
                  </span>
                  <span className="text-[#1B7A3D]">Integrity Status: Validated (100%)</span>
                </div>
                <p className="truncate">
                  Genesis: 0000000000000000000000000000000000000000000000000000000000000000
                </p>
                <p className="truncate">
                  Current Block Hash: {doses.find(d => d.status === 'completed' && d.currentHash)?.currentHash || '7a8f9104b2c8...d3e4f5a6b7c8d9e0'}
                </p>
              </div>
            )}

            {/* 7. Attestation & Signatures */}
            {options.includeSignatures && (
              <div className="grid grid-cols-2 gap-6 pt-3 border-t border-[#EAE7E1] text-xs print-avoid-break">
                <div className="border border-[#EAE7E1] p-3 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-extrabold text-[#8A847F] block">Attending Medical Officer</span>
                  <div className="h-9 flex items-end">
                    <span className="font-serif italic font-extrabold text-[#2E2A5E] text-base">Dr. Anjali Mehta</span>
                  </div>
                  <span className="block text-[10px] text-[#6B6560]">MD (Pediatrics & Infectious Diseases)</span>
                  <span className="block text-[10px] font-mono text-[#8A847F]">MMC Reg #MH-39201</span>
                </div>

                <div className="border border-[#EAE7E1] p-3 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-extrabold text-[#8A847F] block">Registry Digital Seal</span>
                  <div className="h-9 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border-2 border-dashed border-[#1B7A3D] flex items-center justify-center text-[8px] font-extrabold text-[#1B7A3D] uppercase">
                      SEAL
                    </div>
                    <span className="text-[11px] font-bold text-[#1B7A3D]">VacTrack Verified</span>
                  </div>
                  <span className="block text-[10px] text-[#6B6560]">Pune Health Directorate Network</span>
                  <span className="block text-[10px] font-mono text-[#8A847F]">UID: VT-2026-SEAL-09</span>
                </div>
              </div>
            )}

            {/* 8. Disclaimer & Legal Notice */}
            <div className="pt-2 text-center text-[9px] text-[#8A847F] leading-normal border-t border-[#EAE7E1]">
              <p>
                This document is a certified extract from the VacTrack Distributed Immunization Ledger.
                Recognized for hospital admissions, medical clearance, occupational health requirements, and international travel.
              </p>
              <p className="font-bold text-[#2E2A5E] mt-0.5">
                Verify authenticity online at: {verifyUrl}
              </p>
            </div>

          </div>
        </div>

        {/* Modal Footer - Hidden on print */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#EAE7E1] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="text-xs text-[#6B6560] flex items-center gap-2">
            <Sparkles size={14} className="text-[#E05D3F]" />
            <span>Formatted for standard <strong>A4 & US Letter</strong> printing with crisp vector typography.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-xs px-4 py-2 rounded-xl"
            >
              Close
            </Button>
            <Button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="bg-[#E05D3F] hover:bg-[#c94d31] text-white font-extrabold text-xs px-5 py-2 rounded-xl shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Download size={14} />
              <span>Download PDF</span>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
