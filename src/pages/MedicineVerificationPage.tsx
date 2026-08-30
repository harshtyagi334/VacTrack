import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  ScanBarcode, QrCode, Search, CheckCircle2, AlertTriangle, XCircle, 
  ShieldCheck, AlertCircle, Building2, Calendar, FileText, Pill, 
  Thermometer, RefreshCw, Copy, Check, ExternalLink, Sparkles, 
  Camera, Zap, ArrowRight, Info
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';

export interface DemoProductRecord {
  productId: string;
  name: string;
  brandName: string;
  manufacturer: string;
  batchNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  licenceNumber: string;
  productType: string;
  storageTemp: string;
  dosageForm: string;
  status: 'active' | 'expired';
  description: string;
  notes?: string;
}

export const DEMO_PRODUCT_DATABASE: DemoProductRecord[] = [
  {
    productId: 'VT-VAC-001',
    name: 'Rabies Vaccine Human (PVRV) I.P.',
    brandName: 'Rabivax-Demo™',
    manufacturer: 'Serum Bio-Innovations Ltd. (Demo Lab Pune)',
    batchNumber: 'RB-2026-X89',
    manufacturingDate: '15 Jan 2026',
    expiryDate: '31 Dec 2027',
    licenceNumber: 'DL-MH-PUN-DEMO-01',
    productType: 'Vaccine (Viral / Inactivated)',
    storageTemp: '2°C - 8°C (Cold Chain Monitored)',
    dosageForm: '0.5 ml Single-Dose Vial + Diluent',
    status: 'active',
    description: 'Purified Vero Cell Rabies Vaccine for active immunization against rabies after suspected exposure (PEP) or pre-exposure prophylaxis.'
  },
  {
    productId: 'VT-MED-002',
    name: 'Amoxicillin & Potassium Clavulanate Tablets IP 625mg',
    brandName: 'AmoxiClav-Demo 625',
    manufacturer: 'Bharat LifeSciences Formulations (Demo)',
    batchNumber: 'BL-625-2026',
    manufacturingDate: '10 Mar 2026',
    expiryDate: '28 Feb 2028',
    licenceNumber: 'DL-MH-PUN-DEMO-02',
    productType: 'Prescription Antibiotic',
    storageTemp: 'Store below 25°C in dry place',
    dosageForm: 'Blister Strip of 10 Tablets',
    status: 'active',
    description: 'Broad-spectrum antibacterial formulation indicated for secondary wound prophylaxis and bacterial infections.'
  },
  {
    productId: 'VT-MED-003',
    name: 'Paracetamol Oral Suspension IP 250mg/5ml',
    brandName: 'ParaCure-Demo Junior',
    manufacturer: 'MediCore Healthcare Labs (Demo)',
    batchNumber: 'PC-EXP-2024',
    manufacturingDate: '01 Feb 2024',
    expiryDate: '31 Aug 2025',
    licenceNumber: 'DL-MH-PUN-DEMO-03',
    productType: 'Analgesic & Antipyretic',
    storageTemp: 'Store at room temperature (15°C - 30°C)',
    dosageForm: '60 ml Bottle Suspension',
    status: 'expired',
    description: 'Pediatric paracetamol suspension recorded in demo archives. This product has passed its recorded expiry date.'
  },
  {
    productId: 'VT-VAC-004',
    name: 'Tetanus Toxoid Vaccine Adsorbed IP',
    brandName: 'TetanoShield-Demo',
    manufacturer: 'National Vaccine Bio-Corp (Demo)',
    batchNumber: 'TT-2026-901',
    manufacturingDate: '05 Feb 2026',
    expiryDate: '30 Nov 2028',
    licenceNumber: 'DL-MH-PUN-DEMO-04',
    productType: 'Vaccine (Toxoid)',
    storageTemp: '2°C - 8°C (Do not freeze)',
    dosageForm: '0.5 ml Ampoule',
    status: 'active',
    description: 'Active immunization against tetanus following animal bite, laceration, or wound contamination.'
  },
  {
    productId: 'VT-MED-005',
    name: 'Human Rabies Immunoglobulin (HRIG) 300 IU/ml',
    brandName: 'RabIG-Demo Sterile',
    manufacturer: 'Apex Biopharma Innovations (Demo)',
    batchNumber: 'RIG-8820-26',
    manufacturingDate: '12 Apr 2026',
    expiryDate: '31 Mar 2028',
    licenceNumber: 'DL-MH-PUN-DEMO-05',
    productType: 'Passive Immunizing Agent / Hyperimmune Globulin',
    storageTemp: '2°C - 8°C (Strict Cold Chain Monitored)',
    dosageForm: '2 ml / 300 IU Glass Vial',
    status: 'active',
    description: 'Immediate neutralizing antibody protection infiltrated into and around animal bite wound margins for Category III exposure.'
  }
];

export type VerificationResultType = 
  | 'verified' 
  | 'expired' 
  | 'not_found' 
  | 'mismatch'
  | null;

export interface VerificationResult {
  type: VerificationResultType;
  record?: DemoProductRecord;
  searchedId: string;
  searchedBatch?: string;
  timestamp: string;
}

export function MedicineVerificationPage() {
  const [searchParams] = useSearchParams();
  
  const [productIdInput, setProductIdInput] = useState('');
  const [batchNumberInput, setBatchNumberInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedDemoTab, setSelectedDemoTab] = useState<'all' | 'vaccines' | 'medicines'>('all');
  const [copiedText, setCopiedText] = useState(false);

  // Auto-verify if query param exists
  useEffect(() => {
    const qId = searchParams.get('id');
    const qBatch = searchParams.get('batch');
    if (qId || qBatch) {
      if (qId) setProductIdInput(qId);
      if (qBatch) setBatchNumberInput(qBatch);
      executeVerification(qId || '', qBatch || '');
    }
  }, [searchParams]);

  const executeVerification = (prodId: string, batchNo: string) => {
    setIsVerifying(true);
    setResult(null);

    const cleanId = prodId.trim();
    const cleanBatch = batchNo.trim();

    setTimeout(() => {
      setIsVerifying(false);
      const nowFormatted = new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'medium'
      });

      if (!cleanId && !cleanBatch) {
        return;
      }

      // 1. If Product ID is provided
      if (cleanId) {
        const foundById = DEMO_PRODUCT_DATABASE.find(
          p => p.productId.toLowerCase() === cleanId.toLowerCase()
        );

        if (!foundById) {
          // Check if searched by batch instead
          const foundByBatchOnly = DEMO_PRODUCT_DATABASE.find(
            p => p.batchNumber.toLowerCase() === cleanId.toLowerCase()
          );

          if (foundByBatchOnly) {
            if (foundByBatchOnly.status === 'expired') {
              setResult({
                type: 'expired',
                record: foundByBatchOnly,
                searchedId: cleanId,
                searchedBatch: cleanBatch,
                timestamp: nowFormatted
              });
            } else {
              setResult({
                type: 'verified',
                record: foundByBatchOnly,
                searchedId: cleanId,
                searchedBatch: cleanBatch,
                timestamp: nowFormatted
              });
            }
            return;
          }

          setResult({
            type: 'not_found',
            searchedId: cleanId,
            searchedBatch: cleanBatch,
            timestamp: nowFormatted
          });
          return;
        }

        // Product ID exists in demo records
        // Check if batch number was also provided and if it mismatches
        if (cleanBatch && cleanBatch.toLowerCase() !== foundById.batchNumber.toLowerCase()) {
          setResult({
            type: 'mismatch',
            record: foundById,
            searchedId: cleanId,
            searchedBatch: cleanBatch,
            timestamp: nowFormatted
          });
          return;
        }

        // Check if expired
        if (foundById.status === 'expired') {
          setResult({
            type: 'expired',
            record: foundById,
            searchedId: cleanId,
            searchedBatch: cleanBatch,
            timestamp: nowFormatted
          });
          return;
        }

        // Verified
        setResult({
          type: 'verified',
          record: foundById,
          searchedId: cleanId,
          searchedBatch: cleanBatch,
          timestamp: nowFormatted
        });
        return;
      }

      // 2. If ONLY batch number was provided
      if (cleanBatch) {
        const foundByBatch = DEMO_PRODUCT_DATABASE.find(
          p => p.batchNumber.toLowerCase() === cleanBatch.toLowerCase()
        );

        if (!foundByBatch) {
          setResult({
            type: 'not_found',
            searchedId: '',
            searchedBatch: cleanBatch,
            timestamp: nowFormatted
          });
          return;
        }

        if (foundByBatch.status === 'expired') {
          setResult({
            type: 'expired',
            record: foundByBatch,
            searchedId: foundByBatch.productId,
            searchedBatch: cleanBatch,
            timestamp: nowFormatted
          });
          return;
        }

        setResult({
          type: 'verified',
          record: foundByBatch,
          searchedId: foundByBatch.productId,
          searchedBatch: cleanBatch,
          timestamp: nowFormatted
        });
      }
    }, 450);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeVerification(productIdInput, batchNumberInput);
  };

  const loadDemoCase = (id: string, batch?: string) => {
    setProductIdInput(id);
    setBatchNumberInput(batch || '');
    executeVerification(id, batch || '');
  };

  const handleCopyResult = () => {
    if (!result) return;
    const text = `VacTrack Demo Verification:\nStatus: ${result.type}\nID: ${result.searchedId || result.record?.productId}\nProduct: ${result.record?.name || 'N/A'}\nBatch: ${result.searchedBatch || result.record?.batchNumber || 'N/A'}\nTimestamp: ${result.timestamp}`;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const filteredDemoList = DEMO_PRODUCT_DATABASE.filter(p => {
    if (selectedDemoTab === 'vaccines') return p.productType.toLowerCase().includes('vaccine');
    if (selectedDemoTab === 'medicines') return !p.productType.toLowerCase().includes('vaccine');
    return true;
  });

  return (
    <div className="w-full max-w-full space-y-6 sm:space-y-8 min-w-0">
      
      {/* Top Header Card */}
      <header className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#EAE7E1] shadow-xs hover:border-[#2E2A5E]/20 transition-all duration-200 min-w-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 min-w-0 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#EEF2FF] text-[#2E2A5E] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-[#C7D2FE]">
              <ShieldCheck size={14} className="text-[#E05D3F]" />
              <span>Traceability & Verification Engine</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#2E2A5E] tracking-tight">
              Medicine & Vaccine Verification
            </h1>
            
            <p className="text-xs sm:text-sm text-[#6B6560] font-medium leading-relaxed">
              Check product details and traceability information against VacTrack’s sample database.
            </p>
          </div>

          {/* Quick Scanner Action */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              onClick={() => setScannerOpen(true)}
              className="bg-[#E05D3F] hover:bg-[#c94f33] active:scale-95 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-xs flex items-center gap-2 cursor-pointer transition-all"
            >
              <Camera size={16} />
              <span>Scan QR / Barcode</span>
            </Button>
            
            <Button
              onClick={() => {
                setProductIdInput('');
                setBatchNumberInput('');
                setResult(null);
              }}
              variant="outline"
              className="border-[#EAE7E1] text-[#2E2A5E] bg-[#F6F4F1] hover:bg-[#EAE7E1] active:scale-95 font-extrabold text-xs px-4 py-3 rounded-2xl flex items-center gap-1.5 transition-all"
            >
              <RefreshCw size={14} />
              <span>Reset Form</span>
            </Button>
          </div>
        </div>

        {/* Demo Notice Banner */}
        <div className="mt-5 p-3.5 bg-[#FFFBEB] rounded-2xl border border-[#FDE68A] flex items-start gap-2.5 text-xs text-[#92400E]">
          <Info size={16} className="text-[#D97706] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-bold">Demo Verification:</strong> Results are checked against VacTrack’s sample database and do not confirm the authenticity of a real-world medicine or vaccine.
          </p>
        </div>
      </header>

      {/* TWO PRIMARY VERIFICATION METHODS: SCAN QR / BARCODE & MANUAL ENTRY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
        
        {/* Method 1 & 2 Inputs (Left Column - 7 Cols) */}
        <div className="lg:col-span-7 space-y-6 min-w-0">
          
          {/* Manual Input Card */}
          <Card className="bg-white border-2 border-[#EAE7E1] rounded-3xl shadow-xs overflow-hidden">
            <CardHeader className="p-5 sm:p-6 pb-4 border-b border-[#EAE7E1] bg-[#FDFCFB]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#E05D3F]/10 text-[#E05D3F] rounded-xl">
                    <Search size={18} />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-lg font-extrabold text-[#2E2A5E]">
                      Manual Product Verification
                    </CardTitle>
                    <p className="text-xs text-[#8A847F] mt-0.5">
                      Verify by Product ID, Batch Number, or cross-verify both together.
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 space-y-5">
              <form onSubmit={handleManualSubmit} className="space-y-4">
                {/* Product ID */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-[#2E2A5E] uppercase tracking-wider">
                    Product ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={productIdInput}
                      onChange={(e) => setProductIdInput(e.target.value)}
                      placeholder="e.g. VT-VAC-001 or VT-MED-002"
                      className="w-full bg-[#F6F4F1] focus:bg-white border-2 border-[#EAE7E1] focus:border-[#2E2A5E] text-[#2E2A5E] font-bold text-sm px-4 py-3 rounded-2xl outline-none transition-all placeholder:text-[#8A847F]/60"
                    />
                    {productIdInput && (
                      <button
                        type="button"
                        onClick={() => setProductIdInput('')}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A847F] hover:text-[#2E2A5E] text-xs font-bold bg-[#EAE7E1] px-1.5 py-0.5 rounded-md"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-[#EAE7E1]" />
                  <span className="text-[11px] font-extrabold uppercase text-[#8A847F] bg-[#F6F4F1] px-2.5 py-0.5 rounded-full border border-[#EAE7E1]">
                    OR / AND CROSS-CHECK
                  </span>
                  <div className="flex-1 h-px bg-[#EAE7E1]" />
                </div>

                {/* Batch Number */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-[#2E2A5E] uppercase tracking-wider">
                    Batch Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={batchNumberInput}
                      onChange={(e) => setBatchNumberInput(e.target.value)}
                      placeholder="e.g. RB-2026-X89 or BL-625-2026"
                      className="w-full bg-[#F6F4F1] focus:bg-white border-2 border-[#EAE7E1] focus:border-[#2E2A5E] text-[#2E2A5E] font-bold text-sm px-4 py-3 rounded-2xl outline-none transition-all placeholder:text-[#8A847F]/60"
                    />
                    {batchNumberInput && (
                      <button
                        type="button"
                        onClick={() => setBatchNumberInput('')}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A847F] hover:text-[#2E2A5E] text-xs font-bold bg-[#EAE7E1] px-1.5 py-0.5 rounded-md"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Button
                    type="submit"
                    disabled={(!productIdInput.trim() && !batchNumberInput.trim()) || isVerifying}
                    className="flex-1 bg-[#2E2A5E] hover:bg-[#201c45] active:scale-98 disabled:opacity-50 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-sm cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw size={16} className="animate-spin text-[#F2A93B]" />
                        <span>Checking Demo Registry...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={18} className="text-[#F2A93B]" />
                        <span>VERIFY PRODUCT</span>
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    onClick={() => setScannerOpen(true)}
                    className="bg-[#E05D3F] hover:bg-[#c94f33] active:scale-98 text-white font-extrabold text-sm py-3.5 px-5 rounded-2xl shadow-sm cursor-pointer transition-all flex items-center justify-center gap-2 shrink-0"
                  >
                    <QrCode size={18} />
                    <span>Scan QR</span>
                  </Button>
                </div>
              </form>

              {/* Quick Demo Test Buttons */}
              <div className="pt-4 border-t border-[#EAE7E1] space-y-2.5">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#8A847F] flex items-center gap-1.5">
                  <Zap size={13} className="text-[#E05D3F]" />
                  <span>Try Demo Test Cases (Click to populate & verify):</span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => loadDemoCase('VT-VAC-001', 'RB-2026-X89')}
                    className="text-left p-2.5 bg-[#F6F4F1] hover:bg-[#EBF7EE] border border-[#EAE7E1] hover:border-[#C8E6C9] rounded-xl transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-[#2E2A5E] group-hover:text-[#1B7A3D]">Case 1: Verified Vaccine</span>
                      <span className="text-[10px] font-bold bg-[#EBF7EE] text-[#1B7A3D] px-1.5 py-0.5 rounded">VT-VAC-001</span>
                    </div>
                    <p className="text-[11px] text-[#6B6560] truncate mt-0.5">Rabies Vaccine • Valid Batch</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => loadDemoCase('VT-MED-002', 'BL-625-2026')}
                    className="text-left p-2.5 bg-[#F6F4F1] hover:bg-[#EBF7EE] border border-[#EAE7E1] hover:border-[#C8E6C9] rounded-xl transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-[#2E2A5E] group-hover:text-[#1B7A3D]">Case 2: Verified Medicine</span>
                      <span className="text-[10px] font-bold bg-[#EBF7EE] text-[#1B7A3D] px-1.5 py-0.5 rounded">VT-MED-002</span>
                    </div>
                    <p className="text-[11px] text-[#6B6560] truncate mt-0.5">AmoxiClav 625mg • Valid</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => loadDemoCase('VT-MED-003', 'PC-EXP-2024')}
                    className="text-left p-2.5 bg-[#F6F4F1] hover:bg-[#FEF2F2] border border-[#EAE7E1] hover:border-[#FCA5A5] rounded-xl transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-[#2E2A5E] group-hover:text-[#B91C1C]">Case 3: Expired Product</span>
                      <span className="text-[10px] font-bold bg-[#FEF2F2] text-[#B91C1C] px-1.5 py-0.5 rounded">VT-MED-003</span>
                    </div>
                    <p className="text-[11px] text-[#6B6560] truncate mt-0.5">Paracetamol 250mg • Expired</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => loadDemoCase('VT-VAC-001', 'RB-WRONG-999')}
                    className="text-left p-2.5 bg-[#F6F4F1] hover:bg-[#FEF2F2] border border-[#EAE7E1] hover:border-[#FCA5A5] rounded-xl transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-[#2E2A5E] group-hover:text-[#B91C1C]">Case 5: Batch Mismatch</span>
                      <span className="text-[10px] font-bold bg-[#FEF2F2] text-[#B91C1C] px-1.5 py-0.5 rounded">Mismatch</span>
                    </div>
                    <p className="text-[11px] text-[#6B6560] truncate mt-0.5">Valid ID with wrong batch</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => loadDemoCase('VT-UNKNOWN-999', '')}
                    className="text-left p-2.5 bg-[#F6F4F1] hover:bg-[#FFFBEB] border border-[#EAE7E1] hover:border-[#FDE68A] rounded-xl transition-all group cursor-pointer sm:col-span-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-[#2E2A5E] group-hover:text-[#D97706]">Case 4: Product Not Found</span>
                      <span className="text-[10px] font-bold bg-[#FFFBEB] text-[#D97706] px-1.5 py-0.5 rounded">VT-UNKNOWN-999</span>
                    </div>
                    <p className="text-[11px] text-[#6B6560] truncate mt-0.5">Simulate unlisted product code check</p>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive QR Codes Showcase Card */}
          <Card className="bg-white border-2 border-[#EAE7E1] rounded-3xl shadow-xs overflow-hidden">
            <CardHeader className="p-5 sm:p-6 pb-4 border-b border-[#EAE7E1] bg-[#FDFCFB]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#2E2A5E]/10 text-[#2E2A5E] rounded-xl">
                    <QrCode size={18} />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-lg font-extrabold text-[#2E2A5E]">
                      Interactive Demo QR Codes
                    </CardTitle>
                    <p className="text-xs text-[#8A847F] mt-0.5">
                      Click any QR card to simulate instant scan & validation.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-[#F6F4F1] p-1 rounded-xl border border-[#EAE7E1]">
                  {(['all', 'vaccines', 'medicines'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setSelectedDemoTab(tab)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-extrabold capitalize transition-all cursor-pointer ${
                        selectedDemoTab === tab
                          ? 'bg-[#2E2A5E] text-white shadow-2xs'
                          : 'text-[#6B6560] hover:text-[#2E2A5E]'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
                {filteredDemoList.map((item) => (
                  <div
                    key={item.productId}
                    onClick={() => loadDemoCase(item.productId, item.batchNumber)}
                    className="p-3.5 bg-[#F6F4F1] hover:bg-white border-2 border-[#EAE7E1] hover:border-[#2E2A5E] rounded-2xl transition-all cursor-pointer flex flex-col justify-between group shadow-2xs hover:shadow-xs"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#E05D3F] bg-[#FEF3F2] px-2 py-0.5 rounded-md border border-[#FECDCA]">
                          {item.productId}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                          item.status === 'expired' 
                            ? 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FCA5A5]' 
                            : 'bg-[#EBF7EE] text-[#1B7A3D] border border-[#C8E6C9]'
                        }`}>
                          {item.status === 'expired' ? 'Expired' : 'Verified'}
                        </span>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-[#EAE7E1] flex justify-center items-center">
                        <QRCodeSVG
                          value={JSON.stringify({
                            productId: item.productId,
                            batch: item.batchNumber,
                            name: item.brandName,
                            platform: 'VacTrack-Demo'
                          })}
                          size={90}
                          level="M"
                          className="w-full h-auto max-w-[90px]"
                        />
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-extrabold text-xs text-[#2E2A5E] group-hover:text-[#E05D3F] transition-colors truncate">
                          {item.brandName}
                        </h4>
                        <p className="text-[11px] text-[#6B6560] truncate font-medium">
                          {item.name}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2.5 mt-2.5 border-t border-[#EAE7E1] flex items-center justify-between text-[10px] text-[#8A847F] font-bold">
                      <span>Batch: {item.batchNumber}</span>
                      <span className="text-[#2E2A5E] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        Test QR →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verification Results Panel (Right Column - 5 Cols) */}
        <div className="lg:col-span-5 space-y-6 min-w-0">
          
          <Card className="bg-white border-2 border-[#EAE7E1] rounded-3xl shadow-xs overflow-hidden sticky top-[90px]">
            <CardHeader className="p-5 sm:p-6 pb-4 border-b border-[#EAE7E1] bg-[#FDFCFB]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#1B7A3D]/10 text-[#1B7A3D] rounded-xl">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-lg font-extrabold text-[#2E2A5E]">
                      Verification Outcome
                    </CardTitle>
                    <p className="text-xs text-[#8A847F] mt-0.5">
                      Live status evaluated against VacTrack demo records.
                    </p>
                  </div>
                </div>

                {result && (
                  <button
                    onClick={handleCopyResult}
                    className="p-2 rounded-xl bg-[#F6F4F1] hover:bg-[#EAE7E1] text-[#2E2A5E] border border-[#EAE7E1] text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    title="Copy Result Summary"
                  >
                    {copiedText ? <Check size={14} className="text-[#1B7A3D]" /> : <Copy size={14} />}
                    <span className="hidden sm:inline">{copiedText ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-5 sm:p-6">
              {isVerifying ? (
                <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
                  <RefreshCw size={36} className="text-[#E05D3F] animate-spin" />
                  <div className="space-y-1">
                    <p className="text-sm font-extrabold text-[#2E2A5E]">Querying Sample Database...</p>
                    <p className="text-xs text-[#8A847F]">Checking product ID, batch record, and expiry status</p>
                  </div>
                </div>
              ) : !result ? (
                <div className="py-14 flex flex-col items-center justify-center text-center space-y-3 text-[#8A847F]">
                  <div className="w-16 h-16 rounded-3xl bg-[#F6F4F1] border-2 border-dashed border-[#EAE7E1] flex items-center justify-center text-[#8A847F]">
                    <ScanBarcode size={28} />
                  </div>
                  <div className="space-y-1 max-w-xs">
                    <p className="text-sm font-extrabold text-[#2E2A5E]">No Verification Requested Yet</p>
                    <p className="text-xs leading-relaxed text-[#8A847F]">
                      Enter a Product ID or Batch Number on the left, scan a barcode, or pick any demo test case above.
                    </p>
                  </div>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={result.type + result.searchedId + (result.searchedBatch || '')}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    
                    {/* CASE 1 & CASE 2: VERIFIED */}
                    {result.type === 'verified' && result.record && (
                      <div className="space-y-4">
                        {/* Status Header Badge Card */}
                        <div className="p-4 bg-[#EBF7EE] border-2 border-[#C8E6C9] rounded-2xl space-y-2">
                          <div className="flex items-center gap-2 text-[#1B7A3D]">
                            <CheckCircle2 size={22} className="shrink-0" />
                            <span className="font-extrabold text-sm sm:text-base uppercase tracking-tight">
                              ✓ Verified Against VacTrack Demo Database
                            </span>
                          </div>
                          <p className="text-xs text-[#1B7A3D]/90 font-medium leading-relaxed">
                            Product information matches the VacTrack demo database.
                          </p>
                          <div className="text-[10px] text-[#1B7A3D]/70 font-semibold pt-1 border-t border-[#C8E6C9]">
                            Verified at: {result.timestamp}
                          </div>
                        </div>

                        {/* Product Detailed Metadata */}
                        <div className="bg-[#F6F4F1] p-4 sm:p-5 rounded-2xl border border-[#EAE7E1] space-y-3.5 text-xs">
                          <div className="border-b border-[#EAE7E1] pb-3">
                            <span className="text-[10px] uppercase font-extrabold text-[#8A847F]">Product Name & Brand</span>
                            <h3 className="font-heading font-extrabold text-base text-[#2E2A5E] mt-0.5">
                              {result.record.brandName}
                            </h3>
                            <p className="text-xs text-[#6B6560] font-semibold">{result.record.name}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <span className="text-[10px] uppercase font-extrabold text-[#8A847F]">Product ID</span>
                              <p className="font-mono font-bold text-[#2E2A5E] mt-0.5">{result.record.productId}</p>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase font-extrabold text-[#8A847F]">Batch Number</span>
                              <p className="font-mono font-bold text-[#1B7A3D] mt-0.5">{result.record.batchNumber}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <span className="text-[10px] uppercase font-extrabold text-[#8A847F]">Manufacturing Date</span>
                              <p className="font-bold text-[#2E2A5E] mt-0.5">{result.record.manufacturingDate}</p>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase font-extrabold text-[#8A847F]">Expiry Date</span>
                              <p className="font-bold text-[#1B7A3D] mt-0.5">{result.record.expiryDate}</p>
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] uppercase font-extrabold text-[#8A847F]">Manufacturer</span>
                            <p className="font-bold text-[#2E2A5E] mt-0.5 flex items-center gap-1.5">
                              <Building2 size={13} className="text-[#E05D3F]" />
                              <span>{result.record.manufacturer}</span>
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <span className="text-[10px] uppercase font-extrabold text-[#8A847F]">Licence Number</span>
                              <p className="font-mono font-bold text-[#2E2A5E] mt-0.5">{result.record.licenceNumber}</p>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase font-extrabold text-[#8A847F]">Product Type</span>
                              <p className="font-bold text-[#2E2A5E] mt-0.5">{result.record.productType}</p>
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] uppercase font-extrabold text-[#8A847F]">Storage & Cold Chain Protocol</span>
                            <p className="font-bold text-[#2E2A5E] mt-0.5 flex items-center gap-1.5">
                              <Thermometer size={13} className="text-[#2E2A5E]" />
                              <span>{result.record.storageTemp}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CASE 3: EXPIRED PRODUCT */}
                    {result.type === 'expired' && result.record && (
                      <div className="space-y-4">
                        <div className="p-4 bg-[#FEF2F2] border-2 border-[#FCA5A5] rounded-2xl space-y-2">
                          <div className="flex items-center gap-2 text-[#B91C1C]">
                            <AlertTriangle size={22} className="shrink-0" />
                            <span className="font-extrabold text-sm sm:text-base uppercase tracking-tight">
                              ⚠ Expired Product
                            </span>
                          </div>
                          <p className="text-xs text-[#B91C1C] font-semibold leading-relaxed">
                            This product exists in the demo database, but its recorded expiry date has passed.
                          </p>
                          <div className="text-[10px] text-[#B91C1C]/80 font-bold pt-1 border-t border-[#FCA5A5]">
                            Checked at: {result.timestamp}
                          </div>
                        </div>

                        <div className="bg-[#FFF5F5] p-4 sm:p-5 rounded-2xl border border-[#FCA5A5] space-y-3 text-xs">
                          <div>
                            <span className="text-[10px] uppercase font-extrabold text-[#8A847F]">Product Name</span>
                            <h3 className="font-heading font-extrabold text-base text-[#B91C1C] mt-0.5">
                              {result.record.brandName}
                            </h3>
                            <p className="text-xs text-[#6B6560] font-medium">{result.record.name}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <span className="text-[10px] uppercase font-extrabold text-[#8A847F]">Batch Number</span>
                              <p className="font-mono font-bold text-[#2E2A5E] mt-0.5">{result.record.batchNumber}</p>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase font-extrabold text-[#8A847F]">Expiry Date</span>
                              <p className="font-bold text-[#B91C1C] mt-0.5 bg-[#FEF2F2] px-2 py-0.5 rounded border border-[#FCA5A5] inline-block">
                                {result.record.expiryDate} (Passed)
                              </p>
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] uppercase font-extrabold text-[#8A847F]">Manufacturer</span>
                            <p className="font-bold text-[#2E2A5E] mt-0.5">{result.record.manufacturer}</p>
                          </div>

                          <div className="p-3 bg-white rounded-xl border border-[#FCA5A5] text-[#B91C1C] space-y-1">
                            <p className="font-extrabold text-[11px]">Safety Advisory:</p>
                            <p className="text-[11px] leading-relaxed">
                              Do not administer or consume expired pharmaceutical goods. Expired batches should be segregated for safe clinical disposal.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CASE 4: PRODUCT NOT FOUND */}
                    {result.type === 'not_found' && (
                      <div className="space-y-4">
                        <div className="p-4 bg-[#FFFBEB] border-2 border-[#FDE68A] rounded-2xl space-y-2">
                          <div className="flex items-center gap-2 text-[#D97706]">
                            <AlertCircle size={22} className="shrink-0" />
                            <span className="font-extrabold text-sm sm:text-base uppercase tracking-tight">
                              ✕ Product Not Found
                            </span>
                          </div>
                          <p className="text-xs text-[#92400E] font-medium leading-relaxed">
                            No matching record was found in the VacTrack demo database.
                          </p>
                          <div className="text-[10px] text-[#92400E]/80 font-bold pt-1 border-t border-[#FDE68A]">
                            Queried identifier: {result.searchedId || result.searchedBatch || 'N/A'} • {result.timestamp}
                          </div>
                        </div>

                        <div className="bg-[#F6F4F1] p-4 sm:p-5 rounded-2xl border border-[#EAE7E1] space-y-3 text-xs">
                          <h4 className="font-extrabold text-[#2E2A5E]">What does this mean?</h4>
                          <p className="text-xs text-[#6B6560] leading-relaxed">
                            The entered Product ID or Batch Number is not present in this local frontend demonstration dataset.
                          </p>
                          <div className="p-3 bg-white rounded-xl border border-[#EAE7E1] text-[#6B6560] space-y-1">
                            <p className="font-bold text-[#2E2A5E] text-[11px]">Demo Clarification:</p>
                            <p className="text-[11px] leading-relaxed">
                              This does not mean the product is invalid in the real world. VacTrack’s demo version only holds a curated subset of test records.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CASE 5: BATCH MISMATCH */}
                    {result.type === 'mismatch' && result.record && (
                      <div className="space-y-4">
                        <div className="p-4 bg-[#FEF2F2] border-2 border-[#FCA5A5] rounded-2xl space-y-2">
                          <div className="flex items-center gap-2 text-[#B91C1C]">
                            <XCircle size={22} className="shrink-0" />
                            <span className="font-extrabold text-sm sm:text-base uppercase tracking-tight">
                              ✕ Information Mismatch
                            </span>
                          </div>
                          <p className="text-xs text-[#B91C1C] font-semibold leading-relaxed">
                            The Product ID exists, but the entered batch information does not match the demo record.
                          </p>
                          <div className="text-[10px] text-[#B91C1C]/80 font-bold pt-1 border-t border-[#FCA5A5]">
                            Evaluated at: {result.timestamp}
                          </div>
                        </div>

                        <div className="bg-[#FFF5F5] p-4 sm:p-5 rounded-2xl border border-[#FCA5A5] space-y-3.5 text-xs">
                          <div>
                            <span className="text-[10px] uppercase font-extrabold text-[#8A847F]">Product Identified</span>
                            <h3 className="font-heading font-extrabold text-base text-[#2E2A5E] mt-0.5">
                              {result.record.brandName} ({result.record.productId})
                            </h3>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="p-2.5 bg-white rounded-xl border border-[#C8E6C9]">
                              <span className="text-[10px] uppercase font-extrabold text-[#1B7A3D]">Expected Demo Batch</span>
                              <p className="font-mono font-bold text-sm text-[#1B7A3D] mt-0.5">{result.record.batchNumber}</p>
                            </div>
                            <div className="p-2.5 bg-white rounded-xl border border-[#FCA5A5]">
                              <span className="text-[10px] uppercase font-extrabold text-[#B91C1C]">Entered Batch Input</span>
                              <p className="font-mono font-bold text-sm text-[#B91C1C] mt-0.5">{result.searchedBatch || 'N/A'}</p>
                            </div>
                          </div>

                          <p className="text-[11px] text-[#6B6560] leading-relaxed">
                            Discrepancy detected between the recorded package batch code and the physical product input.
                          </p>
                        </div>
                      </div>
                    )}

                  </motion.div>
                </AnimatePresence>
              )}
            </CardContent>
          </Card>
        </div>

      </div>

      {/* QR SCANNER SIMULATION MODAL */}
      {scannerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white max-w-lg w-full rounded-3xl border-2 border-[#EAE7E1] shadow-2xl overflow-hidden"
          >
            <div className="p-5 sm:p-6 border-b border-[#EAE7E1] flex items-center justify-between bg-[#2E2A5E] text-white">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Camera size={18} className="text-[#F2A93B]" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base">QR / Barcode Scanner</h3>
                  <p className="text-xs text-[#D9D4CB]">Interactive Demo Scanner Simulation</p>
                </div>
              </div>
              <button
                onClick={() => setScannerOpen(false)}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Simulated Camera Viewfinder */}
              <div className="relative w-full aspect-4/3 bg-black rounded-2xl overflow-hidden flex flex-col items-center justify-center text-white border-2 border-white/20">
                {/* Laser animation */}
                <motion.div
                  animate={{ y: [-70, 70, -70] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute w-4/5 h-0.5 bg-[#E05D3F] shadow-[0_0_12px_#E05D3F] z-10"
                />

                {/* Viewfinder Target corners */}
                <div className="w-48 h-48 border-2 border-dashed border-white/60 rounded-2xl flex items-center justify-center relative">
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#F2A93B]" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#F2A93B]" />
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#F2A93B]" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#F2A93B]" />
                  <QrCode size={48} className="text-white/40 animate-pulse" />
                </div>

                <div className="absolute bottom-3 text-center px-4">
                  <span className="text-[11px] font-bold text-white/90 bg-black/70 px-3 py-1 rounded-full border border-white/20">
                    Align QR code within the frame or select a demo sample below
                  </span>
                </div>
              </div>

              {/* Quick Scan Selection for testing */}
              <div className="space-y-2.5">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#8A847F]">
                  Select Demo Barcode to Simulate Scanning:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setScannerOpen(false);
                      loadDemoCase('VT-VAC-001', 'RB-2026-X89');
                    }}
                    className="p-2.5 text-left bg-[#F6F4F1] hover:bg-[#EBF7EE] border border-[#EAE7E1] hover:border-[#C8E6C9] rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <span className="text-[#2E2A5E]">Scan: Rabies Vaccine (VT-VAC-001)</span>
                  </button>

                  <button
                    onClick={() => {
                      setScannerOpen(false);
                      loadDemoCase('VT-MED-002', 'BL-625-2026');
                    }}
                    className="p-2.5 text-left bg-[#F6F4F1] hover:bg-[#EBF7EE] border border-[#EAE7E1] hover:border-[#C8E6C9] rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <span className="text-[#2E2A5E]">Scan: AmoxiClav 625 (VT-MED-002)</span>
                  </button>

                  <button
                    onClick={() => {
                      setScannerOpen(false);
                      loadDemoCase('VT-MED-003', 'PC-EXP-2024');
                    }}
                    className="p-2.5 text-left bg-[#F6F4F1] hover:bg-[#FEF2F2] border border-[#EAE7E1] hover:border-[#FCA5A5] rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <span className="text-[#B91C1C]">Scan: Expired Paracetamol (VT-MED-003)</span>
                  </button>

                  <button
                    onClick={() => {
                      setScannerOpen(false);
                      loadDemoCase('VT-VAC-004', 'TT-2026-901');
                    }}
                    className="p-2.5 text-left bg-[#F6F4F1] hover:bg-[#EBF7EE] border border-[#EAE7E1] hover:border-[#C8E6C9] rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <span className="text-[#2E2A5E]">Scan: Tetanus Vaccine (VT-VAC-004)</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#F6F4F1] border-t border-[#EAE7E1] flex justify-end">
              <Button
                onClick={() => setScannerOpen(false)}
                variant="outline"
                className="border-[#EAE7E1] text-[#2E2A5E] font-extrabold text-xs px-4 py-2 rounded-xl"
              >
                Close Scanner
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* MANDATORY DISCLAIMER SECTION AT BOTTOM */}
      <footer className="p-5 sm:p-6 bg-white rounded-3xl border-2 border-[#EAE7E1] space-y-2 text-xs text-[#6B6560] leading-relaxed shadow-2xs">
        <div className="flex items-center gap-2 font-extrabold text-[#2E2A5E] text-xs sm:text-sm">
          <Info size={16} className="text-[#E05D3F] shrink-0" />
          <span>Demo Verification Disclaimer</span>
        </div>
        <p>
          This feature validates product information against VacTrack’s sample database. It does not confirm the authenticity of a real-world medicine or vaccine. Real-world verification would require integration with an authorized government, manufacturer, or pharmaceutical traceability database.
        </p>
      </footer>

    </div>
  );
}
