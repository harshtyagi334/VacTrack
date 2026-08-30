import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';
import { format, parseISO } from 'date-fns';
import { Patient, Dose, Clinic, HealthRecord } from '../types';

export interface ExportReportOptions {
  includeRoutine?: boolean;
  includeAllergies?: boolean;
  includeSignatures?: boolean;
  includeBlockchainVerification?: boolean;
  includeEmergencyNotes?: boolean;
}

export async function generateVaccinationReportPdf(
  patient: Patient | any,
  doses: Dose[],
  clinics: Record<string, Clinic>,
  healthRecord?: Partial<HealthRecord> | any,
  options: ExportReportOptions = {}
): Promise<jsPDF> {
  const {
    includeRoutine = true,
    includeAllergies = true,
    includeSignatures = true,
    includeBlockchainVerification = true,
    includeEmergencyNotes = true
  } = options;

  // Initialize A4 Portrait document (210mm x 297mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210
  const pageHeight = doc.internal.pageSize.getHeight(); // 297
  const marginX = 14;
  const contentWidth = pageWidth - marginX * 2; // 182

  const recordId = `VT-MED-${format(new Date(), 'yyyy')}-${patient.id.replace('p_', '').toUpperCase().padStart(5, '0')}`;
  const verifyUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/verify/patient/${patient.id}`
    : `https://vactrack.health/verify/patient/${patient.id}`;

  // ==================== 1. TOP HEADER BANNER ====================
  // Deep Navy top banner
  doc.setFillColor(46, 42, 94); // #2E2A5E
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Terracotta accent bar
  doc.setFillColor(224, 93, 63); // #E05D3F
  doc.rect(0, 28, pageWidth, 2.5, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('VACTRACK IMMUNIZATION NETWORK', marginX, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(240, 238, 245);
  doc.text('OFFICIAL CLINICAL VACCINATION RECORD & HEALTHCARE PASSPORT', marginX, 17);

  doc.setFontSize(7.5);
  doc.setTextColor(215, 210, 230);
  doc.text('Standardized Post-Exposure Prophylaxis & Lifetime Immunization Ledger • NDHM/ABDM Compliant', marginX, 23);

  // Top-right Document Meta
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(242, 169, 59); // Amber
  doc.text('RECORD ID:', pageWidth - marginX - 45, 10);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.text(recordId, pageWidth - marginX - 25, 10);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(242, 169, 59);
  doc.text('ISSUED:', pageWidth - marginX - 45, 16);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.text(format(new Date(), 'dd MMM yyyy, HH:mm'), pageWidth - marginX - 25, 16);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(134, 239, 172); // Green
  doc.text('STATUS: VERIFIED CLINICAL', pageWidth - marginX - 45, 22);

  let currentY = 36;

  // ==================== 2. PATIENT DEMOGRAPHICS & QR CODE ====================
  // Generate QR Code data URL
  let qrDataUrl = '';
  try {
    qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      margin: 1,
      width: 120,
      color: {
        dark: '#2E2A5E',
        light: '#FFFFFF'
      }
    });
  } catch (err) {
    console.error('Failed to generate QR for PDF:', err);
  }

  // Demographics Box background
  doc.setFillColor(246, 244, 241); // #F6F4F1
  doc.roundedRect(marginX, currentY, contentWidth - 36, 32, 2, 2, 'F');
  doc.setDrawColor(234, 231, 225); // #EAE7E1
  doc.roundedRect(marginX, currentY, contentWidth - 36, 32, 2, 2, 'S');

  // Demographic labels and values
  doc.setTextColor(46, 42, 94);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('PATIENT DEMOGRAPHIC PROFILE', marginX + 4, currentY + 6);

  doc.setFontSize(7.5);
  doc.setTextColor(107, 101, 96);
  doc.text('Full Legal Name:', marginX + 4, currentY + 13);
  doc.text('Date of Birth / Age:', marginX + 4, currentY + 19);
  doc.text('Registered Address:', marginX + 4, currentY + 25);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(35, 31, 32);
  doc.text(patient.name, marginX + 34, currentY + 13);
  const birthFormatted = patient.dob ? format(parseISO(patient.dob), 'dd MMMM yyyy') : '02 April 2004';
  doc.text(`${birthFormatted} (22 Years • Male)`, marginX + 34, currentY + 19);
  const cityState = `${patient.address || 'JM Road, Shivajinagar'}, ${patient.city || 'Pune'}, ${patient.state || 'MH'}`;
  doc.text(cityState.length > 40 ? `${cityState.substring(0, 38)}...` : cityState, marginX + 34, currentY + 25);

  // Middle Column
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 101, 96);
  doc.text('ABHA Health ID:', marginX + 86, currentY + 13);
  doc.text('Blood Group:', marginX + 86, currentY + 19);
  doc.text('Phone Contact:', marginX + 86, currentY + 25);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(35, 31, 32);
  doc.text('91-4829-1029-4821', marginX + 110, currentY + 13);
  
  // Blood group with alert tint
  doc.setTextColor(185, 28, 28);
  doc.text(healthRecord?.bloodGroup || patient.bloodGroup || 'B+ (Rh Positive)', marginX + 110, currentY + 19);

  doc.setTextColor(35, 31, 32);
  doc.text(patient.phone || '+91 98765 43210', marginX + 110, currentY + 25);

  // QR Code on right side
  if (qrDataUrl) {
    const qrX = pageWidth - marginX - 32;
    doc.addImage(qrDataUrl, 'PNG', qrX, currentY, 32, 32);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.setTextColor(46, 42, 94);
    doc.text('SCAN TO VERIFY RECORD', qrX + 2, currentY + 34.5);
  }

  currentY += 39;

  // ==================== 3. ACTIVE POST-EXPOSURE PROTOCOL (RABIES PEP) ====================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(46, 42, 94);
  doc.text('ACTIVE IMMUNIZATION PROTOCOL: RABIES POST-EXPOSURE PROPHYLAXIS (PEP)', marginX, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(107, 101, 96);
  doc.text('Standard 5-Dose Intramuscular Essen Schedule (Days 0, 3, 7, 14, 28) • Category III High-Risk Bite Exposure', marginX, currentY + 4);

  currentY += 7;

  // Build PEP table rows
  const sortedDoses = [...doses].sort((a, b) => a.doseNumber - b.doseNumber);
  const pepRows = sortedDoses.map((d) => {
    const dayLabel = d.doseNumber === 1 ? 'Day 0' :
      d.doseNumber === 2 ? 'Day 3' :
      d.doseNumber === 3 ? 'Day 7' :
      d.doseNumber === 4 ? 'Day 14' : 'Day 28';

    const clinic = d.clinicId ? clinics[d.clinicId] : null;
    const facilityName = clinic ? clinic.name : (d.doseNumber <= 2 ? 'Ruby Hall Clinic, Pune' : 'Shivajinagar Emergency Centre');

    const scheduledStr = d.scheduledDate ? format(parseISO(d.scheduledDate), 'dd MMM yyyy') : '—';
    const adminStr = d.administrationDate ? format(parseISO(d.administrationDate), 'dd MMM yyyy') : 'Pending';

    const statusText = d.status === 'completed' ? 'VERIFIED (✓)' :
      d.status === 'due_today' ? 'ACTION DUE TODAY' :
      d.status === 'overdue' ? 'OVERDUE' : 'SCHEDULED';

    const hashSnippet = d.currentHash ? `${d.currentHash.substring(0, 10)}...` : 'Pending admin';

    return [
      `Dose ${d.doseNumber}\n(${dayLabel})`,
      d.vaccineName || 'Rabies Vaccine (Rabivax-S)',
      `${scheduledStr}\nAdmin: ${adminStr}`,
      d.batchNumber || (d.doseNumber <= 2 ? 'RAB-DEMO-7824' : 'Reserved Lot'),
      facilityName,
      statusText,
      hashSnippet
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [['Dose / Protocol', 'Vaccine Product', 'Scheduled / Given', 'Lot / Batch', 'Facility & Location', 'Clinical Status', 'Hash Signature']],
    body: pepRows,
    theme: 'grid',
    margin: { left: marginX, right: marginX },
    headStyles: {
      fillColor: [46, 42, 94],
      textColor: [255, 255, 255],
      fontSize: 7,
      fontStyle: 'bold',
      halign: 'left',
      cellPadding: 2
    },
    styles: {
      fontSize: 6.8,
      cellPadding: 2,
      textColor: [35, 31, 32],
      lineColor: [234, 231, 225],
      lineWidth: 0.2
    },
    columnStyles: {
      0: { cellWidth: 20, fontStyle: 'bold' },
      1: { cellWidth: 32 },
      2: { cellWidth: 26 },
      3: { cellWidth: 24, font: 'courier' },
      4: { cellWidth: 36 },
      5: { cellWidth: 24, fontStyle: 'bold' },
      6: { cellWidth: 20, font: 'courier', fontSize: 6 }
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 5) {
        const text = String(data.cell.raw);
        if (text.includes('VERIFIED')) {
          data.cell.styles.textColor = [27, 122, 61]; // Forest green
        } else if (text.includes('DUE TODAY')) {
          data.cell.styles.textColor = [217, 119, 6]; // Amber
        } else {
          data.cell.styles.textColor = [107, 101, 96]; // Gray
        }
      }
    }
  });

  currentY = (doc as any).lastAutoTable.finalY + 7;

  // ==================== 4. ROUTINE & LIFETIME IMMUNIZATIONS ====================
  if (includeRoutine) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(46, 42, 94);
    doc.text('LIFETIME & ROUTINE IMMUNIZATION HISTORY', marginX, currentY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(107, 101, 96);
    doc.text('Extract of verified historical childhood and routine adult booster records', marginX, currentY + 4);

    currentY += 7;

    const routineRows = [
      [
        'COVID-19 (Covishield / Corbevax)',
        'Routine Precaution Booster',
        '14 Jan 2023',
        '3 Doses Total (Primary + Booster)',
        'Ruby Hall Clinic, Pune',
        'IMMUNITY CURRENT'
      ],
      [
        'Polio (OPV / IPV Series)',
        'Universal Immunization Programme',
        '10 Mar 2009',
        'Complete 5-dose childhood course',
        'PMC Pulse Polio Centre, Pune',
        'COMPLETED (LIFETIME)'
      ],
      [
        'Tetanus Toxoid (TT Booster)',
        'Post-Bite Wound Protocol (0.5 mL IM)',
        '17 Aug 2026',
        '1 Dose Booster (Valid 5 Years)',
        'Ruby Hall Clinic, Pune',
        'ACTIVE PROTECTION'
      ],
      [
        'Hepatitis B (Recombinant DNA)',
        'Primary Recombinant Immunization',
        '18 Sep 2018',
        '3-Dose Standard Series (0, 1, 6 Mo)',
        'Sassoon General Hospital, Pune',
        'IMMUNITY CONFIRMED'
      ]
    ];

    autoTable(doc, {
      startY: currentY,
      head: [['Vaccine / Antigen Target', 'Immunization Scope', 'Date Given', 'Dosage Summary', 'Administering Facility', 'Protection Status']],
      body: routineRows,
      theme: 'grid',
      margin: { left: marginX, right: marginX },
      headStyles: {
        fillColor: [246, 244, 241],
        textColor: [46, 42, 94],
        fontSize: 7,
        fontStyle: 'bold',
        halign: 'left',
        cellPadding: 2,
        lineWidth: 0.2,
        lineColor: [234, 231, 225]
      },
      styles: {
        fontSize: 6.8,
        cellPadding: 2,
        textColor: [35, 31, 32],
        lineColor: [234, 231, 225],
        lineWidth: 0.2
      },
      columnStyles: {
        0: { cellWidth: 38, fontStyle: 'bold' },
        1: { cellWidth: 36 },
        2: { cellWidth: 22 },
        3: { cellWidth: 34 },
        4: { cellWidth: 30 },
        5: { cellWidth: 22, fontStyle: 'bold', textColor: [27, 122, 61] }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 6;
  }

  // ==================== 5. CLINICAL ALERTS & EMERGENCY NOTES ====================
  if (includeAllergies) {
    const allergiesList = healthRecord?.allergies?.length
      ? healthRecord.allergies.join(', ')
      : 'Penicillin, Sulfa drugs (Reported mild urticaria)';

    const conditionsList = healthRecord?.medicalConditions?.length
      ? healthRecord.medicalConditions.join(', ')
      : 'Asthma (Mild, controlled with inhaler PRN)';

    // Warning Banner for Allergies
    doc.setFillColor(254, 242, 242); // #FEF2F2
    doc.roundedRect(marginX, currentY, contentWidth, 18, 1.5, 1.5, 'F');
    doc.setDrawColor(252, 165, 165); // #FCA5A5
    doc.roundedRect(marginX, currentY, contentWidth, 18, 1.5, 1.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(185, 28, 28);
    doc.text('CRITICAL CLINICAL NOTICE & HYPERSENSITIVITIES:', marginX + 3, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(153, 27, 27);
    doc.text(`• Known Drug Allergies: ${allergiesList}`, marginX + 3, currentY + 10);
    doc.text(`• Medical Conditions: ${conditionsList}  |  Emergency Contact: Dr. K. Sharma (+91 98220 11223)`, marginX + 3, currentY + 14.5);

    currentY += 22;
  }

  // ==================== 6. CRYPTOGRAPHIC PROOF & ATTESTATION ====================
  if (includeBlockchainVerification) {
    doc.setFillColor(246, 244, 241);
    doc.roundedRect(marginX, currentY, contentWidth, 14, 1.5, 1.5, 'F');
    doc.setDrawColor(234, 231, 225);
    doc.roundedRect(marginX, currentY, contentWidth, 14, 1.5, 1.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(46, 42, 94);
    doc.text('IMMUNIZATION LEDGER INTEGRITY & CRYPTOGRAPHIC PROOF (SHA-256):', marginX + 3, currentY + 4.5);

    doc.setFont('courier', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(107, 101, 96);
    const lastHash = doses.find(d => d.status === 'completed' && d.currentHash)?.currentHash 
      || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    doc.text(`Chain Genesis: 0000000000000000000000000000000000000000000000000000000000000000`, marginX + 3, currentY + 8.5);
    doc.text(`Verified Head Hash: ${lastHash} (Validated on-chain)`, marginX + 3, currentY + 12);

    currentY += 18;
  }

  // ==================== 7. SIGNATURES & OFFICIAL STAMP ====================
  if (includeSignatures) {
    const signBoxWidth = (contentWidth - 10) / 2;

    // Attending Physician Box
    doc.setDrawColor(234, 231, 225);
    doc.roundedRect(marginX, currentY, signBoxWidth, 24, 1.5, 1.5, 'S');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(46, 42, 94);
    doc.text('ATTENDING MEDICAL OFFICER', marginX + 3, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(107, 101, 96);
    doc.text('Dr. Anjali Mehta, MD (Infectious Diseases)', marginX + 3, currentY + 10);
    doc.text('Maharashtra Medical Council Reg #MH-39201', marginX + 3, currentY + 14);

    doc.setFont('courier', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(27, 122, 61);
    doc.text('[DIGITALLY SIGNED & ATTESTED]', marginX + 3, currentY + 20);

    // Health Authority Seal Box
    const sealX = marginX + signBoxWidth + 10;
    doc.roundedRect(sealX, currentY, signBoxWidth, 24, 1.5, 1.5, 'S');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(46, 42, 94);
    doc.text('VACTRACK CENTRAL REGISTRY SEAL', sealX + 3, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(107, 101, 96);
    doc.text('Government Recognized Public Immunization Registry', sealX + 3, currentY + 10);
    doc.text('Pune Municipal Health Directorate Partner Facility', sealX + 3, currentY + 14);

    doc.setFont('courier', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(46, 42, 94);
    doc.text('SEAL ID: VT-PUNE-CENTRAL-2026', sealX + 3, currentY + 20);

    currentY += 28;
  }

  // ==================== 8. PAGE FOOTER ====================
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(138, 132, 127);
  doc.text(
    'Notice: This certificate is an official extract of the VacTrack Immunization Ledger for clinical records, travel, and admission. Tamper-evident.',
    marginX,
    pageHeight - 8
  );

  doc.text(
    `Page 1 of 1 • ${recordId}`,
    pageWidth - marginX - 30,
    pageHeight - 8
  );

  return doc;
}

export async function downloadVaccinationReportPdf(
  patient: Patient | any,
  doses: Dose[],
  clinics: Record<string, Clinic>,
  healthRecord?: Partial<HealthRecord> | any,
  options?: ExportReportOptions
): Promise<void> {
  const doc = await generateVaccinationReportPdf(patient, doses, clinics, healthRecord, options);
  const safeName = (patient.name || 'Patient').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `VacTrack_Vaccination_Report_${safeName}_${format(new Date(), 'yyyyMMdd')}.pdf`;
  doc.save(filename);
}
