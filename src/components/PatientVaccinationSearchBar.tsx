import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, X, Calendar, CheckCircle2, Clock, AlertTriangle, 
  FileText, ShieldCheck, ChevronRight, Filter, Download, 
  ExternalLink, Sparkles, MapPin, Activity, Info, QrCode, Tag
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, parseISO, isValid } from 'date-fns';
import { Patient, Dose, Clinic, HealthRecord } from '../types';
import { Button } from './ui/Button';

export interface UnifiedVaccinationRecord {
  id: string;
  source: 'pep_dose' | 'routine';
  vaccineName: string;
  shortName: string;
  brandName?: string;
  doseLabel: string;
  doseNumber?: number;
  protocol?: string;
  category: 'Post-Exposure Prophylaxis (PEP)' | 'Routine Immunization' | 'Booster & Prophylaxis';
  dateIso: string;
  displayDate: string;
  formattedDate: string;
  monthName: string;
  yearString: string;
  dayString: string;
  status: 'completed' | 'due_today' | 'upcoming' | 'overdue';
  statusText: string;
  batchNumber?: string;
  manufacturer?: string;
  facilityName: string;
  facilityLocation?: string;
  route?: string;
  hash?: string;
  clinicalNotes?: string;
  appointmentTime?: string;
}

interface PatientVaccinationSearchBarProps {
  patient: Patient;
  doses: Dose[];
  clinics: Record<string, Clinic>;
  onExportPdfClick?: () => void;
  className?: string;
}

export function PatientVaccinationSearchBar({
  patient,
  doses,
  clinics,
  onExportPdfClick,
  className = ''
}: PatientVaccinationSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pep' | 'routine' | 'completed' | 'upcoming'>('all');
  const [selectedRecord, setSelectedRecord] = useState<UnifiedVaccinationRecord | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener: '/' or 'Cmd+K' / 'Ctrl+K' focuses the search bar; 'Escape' clears
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) && 
          document.activeElement?.tagName !== 'INPUT' && 
          document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        setSearchQuery('');
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Build unified searchable dataset of all patient vaccination records
  const allRecords = useMemo<UnifiedVaccinationRecord[]>(() => {
    const records: UnifiedVaccinationRecord[] = [];

    // 1. Rabies PEP protocol doses (from doses prop)
    const patientDoses = doses.length > 0 ? doses : [
      {
        id: `d_${patient.id}_1`,
        patientId: patient.id,
        doseNumber: 1,
        scheduledDate: '2026-08-17T10:00:00.000Z',
        administrationDate: '2026-08-17T10:00:00.000Z',
        vaccineName: 'Rabies Vaccine (Rabivax-S)',
        batchNumber: 'RAB-DEMO-7824',
        manufacturer: 'Serum Institute of India Ltd.',
        clinicId: 'hosp_1',
        status: 'completed',
        previousHash: 'GENESIS',
        currentHash: '3a7f8e12c9b4e5d6f7a8b9c0d1e2f3a4'
      } as Dose,
      {
        id: `d_${patient.id}_2`,
        patientId: patient.id,
        doseNumber: 2,
        scheduledDate: '2026-08-20T10:30:00.000Z',
        administrationDate: '2026-08-20T10:30:00.000Z',
        vaccineName: 'Rabies Vaccine (Rabivax-S)',
        batchNumber: 'RAB-DEMO-7824',
        manufacturer: 'Serum Institute of India Ltd.',
        clinicId: 'hosp_1',
        status: 'completed',
        previousHash: '3a7f8e12c9b4e5d6f7a8b9c0d1e2f3a4',
        currentHash: 'b4c7e2d9f1a0e3b5d8c7a6e4f2b1d0c9'
      } as Dose,
      {
        id: `d_${patient.id}_3`,
        patientId: patient.id,
        doseNumber: 3,
        scheduledDate: '2026-08-24T10:30:00.000Z',
        vaccineName: 'Rabies Vaccine (Rabivax-S)',
        batchNumber: 'RAB-DEMO-7824',
        manufacturer: 'Serum Institute of India Ltd.',
        clinicId: 'hosp_1',
        status: 'upcoming',
        previousHash: '',
        currentHash: ''
      } as Dose,
      {
        id: `d_${patient.id}_4`,
        patientId: patient.id,
        doseNumber: 4,
        scheduledDate: '2026-08-31T10:30:00.000Z',
        vaccineName: 'Rabies Vaccine (Rabivax-S)',
        clinicId: 'hosp_1',
        status: 'upcoming',
        previousHash: '',
        currentHash: ''
      } as Dose,
      {
        id: `d_${patient.id}_5`,
        patientId: patient.id,
        doseNumber: 5,
        scheduledDate: '2026-09-14T10:30:00.000Z',
        vaccineName: 'Rabies Vaccine (Rabivax-S)',
        clinicId: 'hosp_1',
        status: 'upcoming',
        previousHash: '',
        currentHash: ''
      } as Dose
    ];

    patientDoses.forEach((d) => {
      const activeDateStr = d.administrationDate || d.scheduledDate;
      let parsedDate: Date | null = null;
      try {
        parsedDate = parseISO(activeDateStr);
        if (!isValid(parsedDate)) parsedDate = null;
      } catch {
        parsedDate = null;
      }

      const formatted = parsedDate ? format(parsedDate, 'dd MMMM yyyy') : activeDateStr;
      const short = parsedDate ? format(parsedDate, 'dd MMM yyyy') : activeDateStr;
      const month = parsedDate ? format(parsedDate, 'MMMM') : '';
      const year = parsedDate ? format(parsedDate, 'yyyy') : '';
      const day = parsedDate ? format(parsedDate, 'dd') : '';

      const dayOffsetMap: Record<number, string> = {
        1: 'Day 0',
        2: 'Day 3',
        3: 'Day 7',
        4: 'Day 14',
        5: 'Day 28'
      };

      const clinicName = d.clinicId && clinics[d.clinicId] 
        ? clinics[d.clinicId].name 
        : 'Sunrise Multispeciality Hospital, Shivajinagar';

      records.push({
        id: d.id,
        source: 'pep_dose',
        vaccineName: d.vaccineName || 'Rabies Vaccine (Rabivax-S)',
        shortName: 'Rabies PEP',
        brandName: 'Rabivax-S (Serum Institute of India)',
        doseLabel: `Dose ${d.doseNumber} (${dayOffsetMap[d.doseNumber] || `Dose ${d.doseNumber}`})`,
        doseNumber: d.doseNumber,
        protocol: 'WHO / NCDC Essen 5-Dose Protocol',
        category: 'Post-Exposure Prophylaxis (PEP)',
        dateIso: activeDateStr,
        displayDate: formatted,
        formattedDate: formatted,
        monthName: month,
        yearString: year,
        dayString: day,
        status: d.status,
        statusText: d.status === 'completed' ? 'Verified & Completed' :
                    d.status === 'due_today' ? 'Due Today' :
                    d.status === 'overdue' ? 'Overdue Action Required' : 'Upcoming Dose',
        batchNumber: d.batchNumber || (d.status === 'completed' ? 'RAB-DEMO-7824' : 'Pending Allocation'),
        manufacturer: d.manufacturer || 'Serum Institute of India Ltd.',
        facilityName: clinicName,
        facilityLocation: 'Shivajinagar, Pune, Maharashtra',
        route: 'Intramuscular (IM) — Deltoid Muscle',
        hash: d.currentHash || (d.status === 'completed' ? '3a7f8e12c9b4e5d6f7a8b9c0d1e2f3a4' : undefined),
        appointmentTime: d.doseNumber === 3 ? '10:30 AM' : undefined,
        clinicalNotes: d.doseNumber === 1 
          ? 'Post-exposure Day 0 administration following Category III exposure. Immunoglobulin (RIG) co-administered.'
          : `Scheduled protocol dose ${d.doseNumber} for rabies antibody titre development.`
      });
    });

    // 2. Routine & Past Lifetime Immunizations (from patient health record)
    const routineDefaults: Array<{
      id: string;
      name: string;
      brand: string;
      category: 'Routine Immunization' | 'Booster & Prophylaxis';
      date: string;
      batch: string;
      facility: string;
      notes: string;
    }> = [
      {
        id: 'rout_covid19',
        name: 'COVID-19 Booster',
        brand: 'Covishield (ChAdOx1-S)',
        category: 'Booster & Prophylaxis',
        date: '2021-08-20',
        batch: 'CVX-DEMO-2601',
        facility: 'Aundh General District Hospital, Pune',
        notes: 'Precautionary dose completed. Verified via ABDM / CoWIN integration.'
      },
      {
        id: 'rout_polio',
        name: 'Polio (OPV / IPV)',
        brand: 'Bivalent Oral Poliomyelitis Vaccine',
        category: 'Routine Immunization',
        date: '2008-03-15',
        batch: 'POL-DEMO-9912',
        facility: 'Pune Municipal Corporation Health Center',
        notes: 'National Immunization Schedule (NIS) primary series completed.'
      },
      {
        id: 'rout_tetanus',
        name: 'Tetanus Toxoid (TT)',
        brand: 'Tetanus Toxoid Vaccine BP',
        category: 'Booster & Prophylaxis',
        date: '2026-06-12',
        batch: 'TET-DEMO-3341',
        facility: 'Sunrise Multispeciality Hospital, Pune',
        notes: 'Adult trauma booster. Provides 5-10 years protective antibodies against Clostridium tetani.'
      }
    ];

    // Check if patient has custom previous vaccinations in health record
    const patientPrevVaccines = patient?.healthRecord?.previousVaccinations;
    if (patientPrevVaccines && patientPrevVaccines.length > 0) {
      patientPrevVaccines.forEach((pv, idx) => {
        // match with routineDefaults or create generic
        const matched = routineDefaults.find(r => r.name.toLowerCase().includes(pv.name.toLowerCase()) || pv.name.toLowerCase().includes(r.name.toLowerCase()));
        const activeDate = pv.date || matched?.date || '2021-01-01';
        
        let parsedDate: Date | null = null;
        try {
          parsedDate = parseISO(activeDate);
          if (!isValid(parsedDate)) parsedDate = null;
        } catch {
          parsedDate = null;
        }

        const formatted = parsedDate ? format(parsedDate, 'dd MMMM yyyy') : activeDate;
        const month = parsedDate ? format(parsedDate, 'MMMM') : '';
        const year = parsedDate ? format(parsedDate, 'yyyy') : '';
        const day = parsedDate ? format(parsedDate, 'dd') : '';

        // Check if not already added
        if (!records.some(r => r.id === `prev_${idx}_${pv.name}`)) {
          records.push({
            id: `prev_${idx}_${pv.name}`,
            source: 'routine',
            vaccineName: pv.name,
            shortName: pv.name,
            brandName: matched?.brand || 'Standard Formulated Vaccine',
            doseLabel: 'Verified Primary / Booster Record',
            category: matched?.category || 'Routine Immunization',
            dateIso: activeDate,
            displayDate: formatted,
            formattedDate: formatted,
            monthName: month,
            yearString: year,
            dayString: day,
            status: 'completed',
            statusText: 'Verified & Completed',
            batchNumber: matched?.batch || `BATCH-${pv.name.substring(0, 3).toUpperCase()}-2026`,
            manufacturer: 'Serum Institute / Bharat Biotech',
            facilityName: matched?.facility || 'Pune District Health Network',
            facilityLocation: 'Pune, Maharashtra',
            route: 'Intramuscular / Oral',
            clinicalNotes: matched?.notes || 'Verified lifetime immunization entry in personal health record.'
          });
        }
      });
    } else {
      // Use routine defaults
      routineDefaults.forEach(rd => {
        const parsedDate = parseISO(rd.date);
        const formatted = isValid(parsedDate) ? format(parsedDate, 'dd MMMM yyyy') : rd.date;
        const month = isValid(parsedDate) ? format(parsedDate, 'MMMM') : '';
        const year = isValid(parsedDate) ? format(parsedDate, 'yyyy') : '';
        const day = isValid(parsedDate) ? format(parsedDate, 'dd') : '';

        records.push({
          id: rd.id,
          source: 'routine',
          vaccineName: rd.name,
          shortName: rd.name.split(' ')[0],
          brandName: rd.brand,
          doseLabel: 'Verified Lifetime Record',
          category: rd.category,
          dateIso: rd.date,
          displayDate: formatted,
          formattedDate: formatted,
          monthName: month,
          yearString: year,
          dayString: day,
          status: 'completed',
          statusText: 'Verified & Completed',
          batchNumber: rd.batch,
          manufacturer: 'Serum Institute / Biological E.',
          facilityName: rd.facility,
          facilityLocation: 'Pune, Maharashtra',
          route: 'Intramuscular / Oral',
          clinicalNotes: rd.notes
        });
      });
    }

    return records;
  }, [doses, clinics, patient]);

  // Filter and search computation
  const filteredRecords = useMemo(() => {
    let list = allRecords;

    // Apply category / status pill filter
    if (activeFilter === 'pep') {
      list = list.filter(r => r.source === 'pep_dose');
    } else if (activeFilter === 'routine') {
      list = list.filter(r => r.source === 'routine');
    } else if (activeFilter === 'completed') {
      list = list.filter(r => r.status === 'completed');
    } else if (activeFilter === 'upcoming') {
      list = list.filter(r => r.status === 'upcoming' || r.status === 'due_today' || r.status === 'overdue');
    }

    // Apply free-text search across vaccine name, date variants, batch, clinic, etc.
    const query = searchQuery.trim().toLowerCase();
    if (!query) return list;

    return list.filter((record) => {
      // 1. Vaccine name, brand, or protocol
      const matchName = record.vaccineName.toLowerCase().includes(query) ||
                        record.shortName.toLowerCase().includes(query) ||
                        (record.brandName && record.brandName.toLowerCase().includes(query)) ||
                        (record.protocol && record.protocol.toLowerCase().includes(query)) ||
                        record.doseLabel.toLowerCase().includes(query);

      // 2. Date queries (e.g. "2026", "2021", "2008", "August", "Aug", "17 Aug", "17", "24", "15 March", "June", "September")
      const matchDate = record.displayDate.toLowerCase().includes(query) ||
                        record.formattedDate.toLowerCase().includes(query) ||
                        record.dateIso.toLowerCase().includes(query) ||
                        record.monthName.toLowerCase().includes(query) ||
                        record.yearString.toLowerCase().includes(query) ||
                        record.dayString.toLowerCase().includes(query);

      // 3. Batch number or clinic name
      const matchBatch = record.batchNumber ? record.batchNumber.toLowerCase().includes(query) : false;
      const matchFacility = record.facilityName.toLowerCase().includes(query);

      // 4. Status (completed, upcoming, scheduled)
      const matchStatus = record.statusText.toLowerCase().includes(query) || record.status.toLowerCase().includes(query);

      return matchName || matchDate || matchBatch || matchFacility || matchStatus;
    });
  }, [allRecords, activeFilter, searchQuery]);

  // Suggested quick search terms
  const quickSuggestions = [
    { label: 'Rabies', query: 'Rabies' },
    { label: 'COVID-19', query: 'COVID' },
    { label: 'Tetanus', query: 'Tetanus' },
    { label: 'Polio', query: 'Polio' },
    { label: 'August 2026', query: 'August 2026' },
    { label: '2021', query: '2021' },
    { label: 'Dose 3', query: 'Dose 3' }
  ];

  const handleSuggestionClick = (term: string) => {
    setSearchQuery(term);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setSearchQuery('');
    setActiveFilter('all');
    inputRef.current?.focus();
  };

  return (
    <div className={`space-y-4 ${className}`} id="global-vaccination-search-section">
      {/* Search Bar Container */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-[#EAE7E1] shadow-xs relative transition-all focus-within:border-[#2E2A5E] focus-within:shadow-md">
        
        {/* Top bar with Label & Results Counter */}
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E05D3F] animate-pulse" />
            <label htmlFor="vaccine-global-search-input" className="text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] flex items-center gap-1.5 cursor-pointer">
              <span>Search Vaccination History</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#8A847F]">
              {searchQuery ? (
                <span className="text-[#2E2A5E]">
                  Found <strong className="text-[#E05D3F]">{filteredRecords.length}</strong> {filteredRecords.length === 1 ? 'record' : 'records'}
                </span>
              ) : (
                <span>{allRecords.length} total immunization records</span>
              )}
            </span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-bold text-[#8A847F] bg-[#F6F4F1] border border-[#EAE7E1] rounded-md">
              /
            </kbd>
          </div>
        </div>

        {/* Search Input Box */}
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-[#6B6560] pointer-events-none flex items-center justify-center">
            <Search size={18} className={isFocused ? 'text-[#2E2A5E]' : 'text-[#8A847F]'} />
          </div>

          <input
            ref={inputRef}
            id="vaccine-global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search by vaccine name (e.g. Rabies, COVID-19, Polio) or date (e.g. Aug 2026, 2021)..."
            className="w-full pl-10 pr-24 py-3 bg-[#F6F4F1] hover:bg-[#F0EDE8] focus:bg-white text-[#2E2A5E] placeholder-[#8A847F] font-medium text-xs sm:text-sm rounded-2xl border border-[#EAE7E1] focus:border-[#2E2A5E] focus:outline-none transition-all shadow-inner"
          />

          <div className="absolute right-2.5 flex items-center gap-1.5">
            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 text-[#8A847F] hover:text-[#2E2A5E] hover:bg-[#EAE7E1] rounded-xl transition-all cursor-pointer"
                title="Clear search query"
              >
                <X size={16} />
              </button>
            )}

            {onExportPdfClick && (
              <button
                type="button"
                onClick={onExportPdfClick}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-extrabold bg-[#2E2A5E] hover:bg-[#201c45] text-white rounded-xl shadow-2xs transition-all cursor-pointer"
                title="Export vaccination history to official PDF"
              >
                <FileText size={12} className="text-[#F2A93B]" />
                <span>PDF</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Filter Pills and Suggestions */}
        <div className="mt-3 pt-3 border-t border-[#EAE7E1] flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Filter Categories */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-[#8A847F] mr-1 hidden sm:inline">Filter:</span>
            {[
              { id: 'all', label: 'All Records' },
              { id: 'pep', label: 'Rabies PEP' },
              { id: 'routine', label: 'Routine History' },
              { id: 'completed', label: 'Completed' },
              { id: 'upcoming', label: 'Upcoming' },
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  activeFilter === f.id 
                    ? 'bg-[#2E2A5E] text-white shadow-xs' 
                    : 'bg-[#F6F4F1] hover:bg-[#EAE7E1] text-[#6B6560]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Quick Search Tag Suggestions */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-extrabold uppercase text-[#8A847F] mr-0.5">Try:</span>
            {quickSuggestions.map(s => (
              <button
                key={s.label}
                type="button"
                onClick={() => handleSuggestionClick(s.query)}
                className={`text-[11px] font-medium px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                  searchQuery.toLowerCase() === s.query.toLowerCase()
                    ? 'bg-[#E05D3F] text-white border-[#E05D3F]'
                    : 'bg-white hover:bg-[#F6F4F1] text-[#6B6560] border-[#EAE7E1]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results Display Area */}
      {searchQuery || activeFilter !== 'all' ? (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-[#EAE7E1] shadow-xs space-y-4 animate-fadeIn">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE7E1]">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#FEF3F2] text-[#E05D3F] text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md border border-[#FECDCA]">
                  Search Results
                </span>
                <h3 className="text-base sm:text-lg font-heading font-extrabold text-[#2E2A5E]">
                  {searchQuery ? `Matches for "${searchQuery}"` : `Filtered: ${activeFilter.toUpperCase()}`}
                </h3>
              </div>
              <p className="text-xs text-[#6B6560] mt-0.5">
                Showing {filteredRecords.length} of {allRecords.length} recorded vaccinations in your health record.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="text-xs font-bold rounded-xl py-1 px-3 border-[#EAE7E1] text-[#6B6560] hover:bg-[#F6F4F1] cursor-pointer"
              >
                Clear Search
              </Button>

              {onExportPdfClick && (
                <Button
                  size="sm"
                  onClick={onExportPdfClick}
                  className="bg-[#2E2A5E] hover:bg-[#201c45] text-white text-xs font-extrabold rounded-xl py-1 px-3 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <FileText size={13} className="text-[#F2A93B]" />
                  <span>Export PDF</span>
                </Button>
              )}
            </div>
          </div>

          {/* Results List */}
          {filteredRecords.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredRecords.map((record) => {
                const isCompleted = record.status === 'completed';
                const isOverdue = record.status === 'overdue';
                const isDueToday = record.status === 'due_today';

                return (
                  <div
                    key={record.id}
                    className="p-4 sm:p-5 rounded-2xl border-2 border-[#EAE7E1] hover:border-[#2E2A5E] bg-[#FAFAF9] hover:bg-white transition-all shadow-2xs hover:shadow-sm space-y-3 flex flex-col justify-between"
                  >
                    {/* Top Row: Vaccine Name & Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#F6F4F1] text-[#2E2A5E] border border-[#EAE7E1]">
                            {record.category}
                          </span>
                          {record.doseNumber && (
                            <span className="text-[10px] font-bold text-[#E05D3F] bg-[#FEF3F2] px-2 py-0.5 rounded-md">
                              Dose {record.doseNumber}
                            </span>
                          )}
                        </div>
                        <h4 className="font-heading font-extrabold text-sm sm:text-base text-[#2E2A5E] leading-tight">
                          {record.vaccineName}
                        </h4>
                        {record.brandName && (
                          <p className="text-xs text-[#6B6560] font-medium">
                            {record.brandName}
                          </p>
                        )}
                      </div>

                      {/* Status Badge */}
                      <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 shrink-0 ${
                        isCompleted ? 'bg-[#EBF7EE] text-[#1B7A3D] border border-[#C8E6C9]' :
                        isDueToday ? 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]' :
                        isOverdue ? 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FCA5A5]' :
                        'bg-[#F6F4F1] text-[#6B6560] border border-[#EAE7E1]'
                      }`}>
                        {isCompleted ? <CheckCircle2 size={13} /> :
                         isOverdue ? <AlertTriangle size={13} /> :
                         <Clock size={13} />}
                        <span>{record.statusText}</span>
                      </span>
                    </div>

                    {/* Metadata Pill Grid (Date, Batch, Facility) */}
                    <div className="bg-white p-3 rounded-xl border border-[#EAE7E1] space-y-1.5 text-xs text-[#6B6560]">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold flex items-center gap-1 text-[#2E2A5E]">
                          <Calendar size={13} className="text-[#E05D3F]" /> Date:
                        </span>
                        <span className="font-extrabold text-[#2E2A5E]">
                          {record.formattedDate}
                        </span>
                      </div>

                      {record.batchNumber && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold flex items-center gap-1 text-[#8A847F]">
                            <Tag size={13} /> Batch / Lot:
                          </span>
                          <span className="font-mono font-bold text-[#2E2A5E]">
                            {record.batchNumber}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold flex items-center gap-1 text-[#8A847F]">
                          <MapPin size={13} /> Facility:
                        </span>
                        <span className="font-medium text-right text-[#2E2A5E] truncate max-w-[180px]">
                          {record.facilityName}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#EAE7E1]">
                      <button
                        type="button"
                        onClick={() => setSelectedRecord(record)}
                        className="text-xs font-bold text-[#2E2A5E] hover:text-[#E05D3F] flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Info size={13} />
                        <span>View Clinical Details</span>
                      </button>

                      {record.status !== 'completed' ? (
                        <Link to="/patient/appointments">
                          <Button size="sm" className="text-[11px] font-bold py-1 px-3 rounded-xl shadow-2xs">
                            Schedule Appointment →
                          </Button>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={onExportPdfClick}
                          className="text-[11px] font-extrabold text-[#1B7A3D] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <ShieldCheck size={13} />
                          <span>Verified Certificate</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-10 px-4 bg-[#F6F4F1] rounded-2xl border border-dashed border-[#EAE7E1] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#8A847F] mx-auto shadow-2xs">
                <Search size={22} />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h4 className="font-heading font-extrabold text-base text-[#2E2A5E]">
                  No vaccination records match &ldquo;{searchQuery}&rdquo;
                </h4>
                <p className="text-xs text-[#6B6560]">
                  Try searching by vaccine name (e.g. <strong>Rabies</strong>, <strong>COVID-19</strong>, <strong>Tetanus</strong>, <strong>Polio</strong>) or by date (e.g. <strong>August 2026</strong>, <strong>2021</strong>, <strong>2008</strong>).
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={handleClear}
                  className="text-xs font-bold rounded-xl px-4 py-2"
                >
                  Clear Search & Show All
                </Button>
                {quickSuggestions.slice(0, 4).map(s => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => handleSuggestionClick(s.query)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-[#EAE7E1] text-[#2E2A5E] hover:border-[#2E2A5E] cursor-pointer"
                  >
                    Search {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedRecord(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="space-y-1 pr-6">
              <div className="flex items-center gap-2">
                <span className="bg-[#FEF3F2] text-[#E05D3F] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border border-[#FECDCA]">
                  {selectedRecord.category}
                </span>
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                  selectedRecord.status === 'completed' ? 'bg-[#EBF7EE] text-[#1B7A3D]' : 'bg-[#FFFBEB] text-[#D97706]'
                }`}>
                  {selectedRecord.statusText}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[#2E2A5E]">
                {selectedRecord.vaccineName}
              </h3>
              {selectedRecord.brandName && (
                <p className="text-xs text-[#6B6560]">
                  Formulation: {selectedRecord.brandName}
                </p>
              )}
            </div>

            {/* Clinical Specifications Table */}
            <div className="bg-[#F6F4F1] p-4 sm:p-5 rounded-2xl space-y-3 text-xs sm:text-sm border border-[#EAE7E1]">
              <div className="flex justify-between items-center border-b border-[#EAE7E1] pb-2">
                <span className="text-[#6B6560] font-bold">Dose / Protocol:</span>
                <span className="font-extrabold text-[#2E2A5E]">{selectedRecord.doseLabel}</span>
              </div>

              <div className="flex justify-between items-center border-b border-[#EAE7E1] pb-2">
                <span className="text-[#6B6560] font-bold">Administered / Due Date:</span>
                <span className="font-extrabold text-[#2E2A5E]">{selectedRecord.formattedDate}</span>
              </div>

              {selectedRecord.batchNumber && (
                <div className="flex justify-between items-center border-b border-[#EAE7E1] pb-2">
                  <span className="text-[#6B6560] font-bold">Batch / Lot Number:</span>
                  <span className="font-mono font-extrabold text-[#2E2A5E]">{selectedRecord.batchNumber}</span>
                </div>
              )}

              {selectedRecord.manufacturer && (
                <div className="flex justify-between items-center border-b border-[#EAE7E1] pb-2">
                  <span className="text-[#6B6560] font-bold">Manufacturer:</span>
                  <span className="font-bold text-[#2E2A5E]">{selectedRecord.manufacturer}</span>
                </div>
              )}

              <div className="flex justify-between items-center border-b border-[#EAE7E1] pb-2">
                <span className="text-[#6B6560] font-bold">Facility:</span>
                <span className="font-bold text-[#2E2A5E] text-right">{selectedRecord.facilityName}</span>
              </div>

              {selectedRecord.route && (
                <div className="flex justify-between items-center border-b border-[#EAE7E1] pb-2">
                  <span className="text-[#6B6560] font-bold">Administration Route:</span>
                  <span className="font-bold text-[#2E2A5E]">{selectedRecord.route}</span>
                </div>
              )}

              {selectedRecord.hash && (
                <div className="border-b border-[#EAE7E1] pb-2 space-y-1">
                  <span className="text-[#6B6560] font-bold block">Cryptographic Hash:</span>
                  <span className="font-mono text-[10px] bg-white p-2 rounded-lg border border-[#EAE7E1] block break-all text-[#2E2A5E]">
                    {selectedRecord.hash}
                  </span>
                </div>
              )}

              {selectedRecord.clinicalNotes && (
                <div className="pt-1 space-y-1">
                  <span className="text-[#6B6560] font-bold block">Clinical Note:</span>
                  <p className="text-xs text-[#2E2A5E] leading-relaxed">
                    {selectedRecord.clinicalNotes}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              {onExportPdfClick && (
                <Button
                  onClick={() => {
                    setSelectedRecord(null);
                    onExportPdfClick();
                  }}
                  className="flex-1 py-2.5 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 bg-[#2E2A5E] hover:bg-[#201c45] text-white cursor-pointer shadow-xs"
                >
                  <FileText size={15} className="text-[#F2A93B]" />
                  <span>Download Medical PDF</span>
                </Button>
              )}

              {selectedRecord.status !== 'completed' && (
                <Link to="/patient/appointments" className="flex-1" onClick={() => setSelectedRecord(null)}>
                  <Button className="w-full py-2.5 font-bold rounded-xl text-xs">
                    Book Appointment →
                  </Button>
                </Link>
              )}

              <Button
                variant="outline"
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2.5 font-bold rounded-xl text-xs border-[#EAE7E1] hover:bg-[#F6F4F1] cursor-pointer"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
