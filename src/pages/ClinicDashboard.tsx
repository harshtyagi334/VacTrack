import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { format } from 'date-fns';
import { 
  Search, Users, Activity, AlertCircle, ShieldAlert, CheckCircle2, 
  ShieldCheck, Phone, MapPin, Building2, PackageCheck, AlertTriangle, 
  ArrowRight, Plus, RefreshCw, Clock, Stethoscope, Truck, BarChart3,
  Calendar, Star, Filter, Edit3, XCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { PatientRecord } from './Clinic/PatientRecord';
import { Link } from 'react-router-dom';

// Modular Hospital Operations Components
import { VaccineInventoryTable } from '../components/HospitalOperations/VaccineInventoryTable';
import { AmbulanceMonitoring } from '../components/HospitalOperations/AmbulanceMonitoring';
import { DoctorAvailability } from '../components/HospitalOperations/DoctorAvailability';
import { UsageAnalyticsChart } from '../components/HospitalOperations/UsageAnalyticsChart';
import { HospitalReviewsSection } from '../components/HospitalOperations/HospitalReviewsSection';
import { HospitalUpdateModal } from '../components/HospitalOperations/HospitalUpdateModal';

export function ClinicDashboard() {
  const { 
    currentClinicId, 
    clinics, 
    patients, 
    doses, 
    alerts, 
    hospitalOperations,
    currentDate 
  } = useAppStore();

  const [activeHospitalId, setActiveHospitalId] = useState<string>(currentClinicId || 'hosp_1');
  const [searchPhone, setSearchPhone] = useState('9876543210'); // Pre-fill for demo
  const [searchedPatientId, setSearchedPatientId] = useState<string | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hospital = hospitalOperations[activeHospitalId] || hospitalOperations['hosp_1'];
  const clinicMeta = clinics[activeHospitalId] || clinics['hosp_1'];

  // Calculate live summary stats from operations store
  const doctorsActive = hospital?.doctors ? hospital.doctors.filter(d => d.availability === 'available').length : 4;
  const doctorsTotal = hospital?.doctors ? hospital.doctors.length : 5;
  
  const ambulancesAvail = hospital?.ambulances ? hospital.ambulances.filter(a => a.status === 'available').length : 2;
  const ambulancesTotal = hospital?.ambulances ? hospital.ambulances.length : 5;

  const lowStockCount = hospital?.inventory ? hospital.inventory.filter(i => i.status === 'low_stock' || i.availableDoses <= i.lowStockThreshold).length : 1;
  const expiredStockCount = hospital?.inventory ? hospital.inventory.filter(i => i.status === 'expired').length : 1;

  const unreadAlerts = alerts.filter(a => !a.read);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = Object.values(patients).find(p => p.phone === searchPhone || p.id === searchPhone);
    if (found) {
      setSearchedPatientId(found.id);
    } else {
      alert(`Patient not found in ${hospital?.name || 'Hospital'} registry.`);
      setSearchedPatientId(null);
    }
  };

  const formattedDate = new Date(currentDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6 sm:space-y-8">
        
        {/* Hospital Details Header */}
        <header className="bg-white p-5 sm:p-6 lg:p-8 rounded-3xl border-2 border-[#EAE7E1] shadow-xs hover:border-[#2E2A5E]/20 transition-all duration-200 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 min-w-0">
          <div className="space-y-3 min-w-0 w-full lg:w-auto">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#EBF7EE] text-[#1B7A3D] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-[#C8E6C9] inline-flex items-center gap-1.5 shadow-2xs">
                <ShieldCheck size={14} /> ✓ Demo Verified Hospital
              </span>
              <span className="bg-[#2E2A5E] text-white text-xs font-extrabold px-3 py-1 rounded-full font-mono shadow-2xs">
                ID: {hospital?.id === 'hosp_1' ? 'VT-HOS-1024' : hospital?.id?.toUpperCase()}
              </span>
              <span className="bg-[#FEF3C7] text-[#B45309] text-xs font-extrabold px-3 py-1 rounded-full border border-[#FDE68A]">
                DEMO DATA — Prototype
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#2E2A5E] tracking-tight truncate">
                {hospital?.name || 'Sunrise Multispeciality Hospital'}
              </h1>

              {/* Hospital Switcher for Demonstration */}
              <select
                value={activeHospitalId}
                onChange={e => setActiveHospitalId(e.target.value)}
                className="bg-[#F6F4F1] hover:bg-[#EAE7E1] border-2 border-[#EAE7E1] text-[#2E2A5E] font-extrabold text-xs px-3.5 py-2 rounded-xl outline-none cursor-pointer transition-colors max-w-full truncate"
                title="Switch Demo Hospital"
              >
                <option value="hosp_1">Sunrise Multispeciality Hospital (Shivajinagar)</option>
                <option value="hosp_2">CityCare Medical Center (Deccan)</option>
                <option value="hosp_3">Lifeline Hospital (Kothrud)</option>
                <option value="hosp_4">Pune Trauma & Emergency Centre (Aundh)</option>
                <option value="hosp_5">HopeCare Emergency Clinic (Hadapsar)</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs font-semibold text-[#6B6560]">
              <span className="flex items-center gap-1.5 bg-[#F6F4F1] px-2.5 py-1 rounded-lg border border-[#EAE7E1] max-w-full truncate">
                <MapPin size={14} className="text-[#E05D3F] shrink-0" /> <span className="truncate">{hospital?.address || 'Shivajinagar, Pune, Maharashtra 411005'}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-[#F6F4F1] px-2.5 py-1 rounded-lg border border-[#EAE7E1]">
                <Phone size={14} className="text-[#2E2A5E] shrink-0" /> {hospital?.phone || '+91 90000 10001'}
              </span>
              <span className="flex items-center gap-1.5 bg-[#EBF7EE] text-[#1B7A3D] font-bold px-2.5 py-1 rounded-lg border border-[#C8E6C9]">
                <Building2 size={14} className="shrink-0" /> 24/7 Emergency Department Active
              </span>
              <span className="flex items-center gap-1.5 bg-[#EEF2FF] text-[#2E2A5E] font-extrabold px-2.5 py-1 rounded-lg border border-[#C7D2FE]">
                <Clock size={14} className="text-[#E05D3F] shrink-0" /> {format(currentTime, 'dd MMMM yyyy • hh:mm:ss a')}
              </span>
            </div>

          </div>

          {/* Top Quick Actions */}
          <div className="flex flex-wrap gap-2.5 shrink-0 w-full sm:w-auto">
            <Button 
              onClick={() => setIsUpdateModalOpen(true)}
              variant="outline" 
              className="border-[#2E2A5E] text-[#2E2A5E] hover:bg-[#2E2A5E] hover:text-white active:scale-95 font-extrabold rounded-xl text-xs py-2.5 px-3.5 flex items-center gap-1.5 cursor-pointer transition-all flex-1 sm:flex-initial justify-center"
            >
              <Edit3 size={15} /> Update Hospital Data
            </Button>
            <Link to="/clinic/record-dose" className="flex-1 sm:flex-initial">
              <Button className="w-full bg-[#E05D3F] hover:bg-[#c94d31] active:scale-95 text-white font-extrabold rounded-xl text-xs py-2.5 px-3.5 shadow-sm flex items-center justify-center gap-1.5 transition-all">
                <Activity size={15} /> Record Dose
              </Button>
            </Link>
            <Link to="/clinic/batch-verify" className="flex-1 sm:flex-initial">
              <Button variant="outline" className="w-full border-[#EAE7E1] text-[#2E2A5E] bg-[#F6F4F1] hover:bg-[#EAE7E1] active:scale-95 font-extrabold rounded-xl text-xs py-2.5 px-3.5 flex items-center justify-center gap-1.5 transition-all">
                <PackageCheck size={15} /> Batch Verify
              </Button>
            </Link>
          </div>
        </header>

        {/* Hospital Overview Summary Row (6-Stat Cards Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4 min-w-0">
          
          {/* 1. Patients Today */}
          <Card className="bg-white border-2 border-[#EAE7E1] hover:border-[#2E2A5E]/30 hover:shadow-sm transition-all duration-200 rounded-2xl p-4 shadow-2xs min-w-0">
            <CardContent className="p-0">
              <p className="text-[10px] text-[#6B6560] font-extrabold uppercase tracking-wider mb-1 truncate">Patients Today</p>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-2xl font-extrabold text-[#2E2A5E]">{hospital?.stats?.patientsToday || 84}</span>
                <span className="text-[9px] font-bold text-[#1B7A3D] bg-[#EBF7EE] px-2 py-0.5 rounded-md border border-[#C8E6C9] shrink-0">OPD + ER</span>
              </div>
            </CardContent>
          </Card>

          {/* 2. Vaccinations Today */}
          <Card className="bg-white border-2 border-[#EAE7E1] hover:border-[#2E2A5E]/30 hover:shadow-sm transition-all duration-200 rounded-2xl p-4 shadow-2xs min-w-0">
            <CardContent className="p-0">
              <p className="text-[10px] text-[#6B6560] font-extrabold uppercase tracking-wider mb-1 truncate">Vaccinations Today</p>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-2xl font-extrabold text-[#2E2A5E]">{hospital?.stats?.dosesAdministeredToday || 28}</span>
                <span className="text-[9px] font-bold text-[#1B7A3D] bg-[#EBF7EE] px-2 py-0.5 rounded-md border border-[#C8E6C9] shrink-0">SHA-256</span>
              </div>
            </CardContent>
          </Card>

          {/* 3. Doctors Active */}
          <Card className="bg-white border-2 border-[#EAE7E1] hover:border-[#1B7A3D]/30 hover:shadow-sm transition-all duration-200 rounded-2xl p-4 shadow-2xs min-w-0">
            <CardContent className="p-0">
              <p className="text-[10px] text-[#6B6560] font-extrabold uppercase tracking-wider mb-1 truncate">Doctors Active</p>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-2xl font-extrabold text-[#1B7A3D]">{doctorsActive} / {doctorsTotal}</span>
                <span className="text-[9px] font-bold text-[#1B7A3D] bg-[#EBF7EE] px-2 py-0.5 rounded-md border border-[#C8E6C9] shrink-0">On Duty</span>
              </div>
            </CardContent>
          </Card>

          {/* 4. Ambulances Available */}
          <Card className="bg-white border-2 border-[#EAE7E1] hover:border-[#2E2A5E]/30 hover:shadow-sm transition-all duration-200 rounded-2xl p-4 shadow-2xs min-w-0">
            <CardContent className="p-0">
              <p className="text-[10px] text-[#6B6560] font-extrabold uppercase tracking-wider mb-1 truncate">Ambulances</p>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-2xl font-extrabold text-[#2E2A5E]">{ambulancesAvail} / {ambulancesTotal}</span>
                <span className="text-[9px] font-bold text-[#2E2A5E] bg-[#F6F4F1] px-2 py-0.5 rounded-md border border-[#EAE7E1] shrink-0">Ready</span>
              </div>
            </CardContent>
          </Card>

          {/* 5. Emergency Cases */}
          <Card className="bg-white border-2 border-[#EAE7E1] hover:border-[#B91C1C]/30 hover:shadow-sm transition-all duration-200 rounded-2xl p-4 shadow-2xs min-w-0">
            <CardContent className="p-0">
              <p className="text-[10px] text-[#6B6560] font-extrabold uppercase tracking-wider mb-1 truncate">Emergency Cases</p>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-2xl font-extrabold text-[#B91C1C]">{hospital?.stats?.emergencyCases || 7}</span>
                <span className="text-[9px] font-bold text-[#B91C1C] bg-[#FEF2F2] px-2 py-0.5 rounded-md border border-[#FCA5A5] shrink-0">Trauma</span>
              </div>
            </CardContent>
          </Card>

          {/* 6. Vaccines Low in Stock */}
          <Card className="bg-white border-2 border-[#EAE7E1] hover:border-[#D97706]/30 hover:shadow-sm transition-all duration-200 rounded-2xl p-4 shadow-2xs min-w-0">
            <CardContent className="p-0">
              <p className="text-[10px] text-[#6B6560] font-extrabold uppercase tracking-wider mb-1 truncate">Low Stock Alerts</p>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-2xl font-extrabold text-[#D97706]">{lowStockCount}</span>
                <span className="text-[9px] font-bold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-md border border-[#FDE68A] shrink-0">Reorder</span>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Expiry Alerts Section (Prominent Warnings) */}
        <div className="bg-white p-6 rounded-3xl border-2 border-[#EAE7E1] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAE7E1] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#FEF2F2] text-[#B91C1C] rounded-xl">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h2 className="text-lg font-heading font-extrabold text-[#2E2A5E]">
                  Cold Chain Expiry & Batch Quarantine Alerts
                </h2>
                <p className="text-xs text-[#6B6560]">
                  Automated regulatory alerts for lot numbers approaching or past their stability shelf-life.
                </p>
              </div>
            </div>
            <span className="text-xs font-extrabold text-[#B91C1C] bg-[#FEF2F2] px-3 py-1 rounded-full border border-[#FCA5A5]">
              {expiredStockCount + 2} Active Warnings
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            
            {/* Warning 1: Rabies Vaccine */}
            <div className="p-4 bg-[#FFFBEB] rounded-2xl border-2 border-[#FDE68A] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#B45309] flex items-center gap-1.5">
                  <AlertTriangle size={14} /> ⚠ Expiring Soon
                </span>
                <span className="text-[10px] font-mono text-[#8A847F] bg-white px-2 py-0.5 rounded">RAB-DEMO-7824</span>
              </div>
              <h3 className="text-sm font-extrabold text-[#2E2A5E]">Rabies Vaccine (Rabivax-S)</h3>
              <p className="text-xs text-[#6B6560]">
                Expiry: <strong>2027-01-15</strong> • <span className="text-[#D97706] font-bold">Expires in ~142 days</span>
              </p>
              <div className="text-[10px] text-[#1B7A3D] font-bold flex items-center gap-1">
                <CheckCircle2 size={12} /> Safe for active administration
              </div>
            </div>

            {/* Warning 2: Tetanus Vaccine */}
            <div className="p-4 bg-[#FFFBEB] rounded-2xl border-2 border-[#FDE68A] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#B45309] flex items-center gap-1.5">
                  <AlertTriangle size={14} /> ⚠ Expiring Soon
                </span>
                <span className="text-[10px] font-mono text-[#8A847F] bg-white px-2 py-0.5 rounded">TT-DEMO-4512</span>
              </div>
              <h3 className="text-sm font-extrabold text-[#2E2A5E]">Tetanus Toxoid (TT Booster)</h3>
              <p className="text-xs text-[#6B6560]">
                Expiry: <strong>2026-11-10</strong> • <span className="text-[#D97706] font-bold">Expires in ~75 days</span>
              </p>
              <div className="text-[10px] text-[#1B7A3D] font-bold flex items-center gap-1">
                <CheckCircle2 size={12} /> Safe for active administration
              </div>
            </div>

            {/* Warning 3: EXPIRED Batch (Prohibited) */}
            <div className="p-4 bg-[#FEF2F2] rounded-2xl border-2 border-[#FCA5A5] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#B91C1C] flex items-center gap-1.5">
                  <XCircle size={14} /> 🔴 DO NOT USE — EXPIRED
                </span>
                <span className="text-[10px] font-mono text-[#B91C1C] bg-white px-2 py-0.5 rounded font-extrabold">
                  DEMO-EXPIRED-001
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-[#B91C1C]">Rabies Vaccine (Expired Batch)</h3>
              <p className="text-xs text-[#6B6560]">
                Expiry: <strong>2026-06-01</strong> • <span className="text-[#B91C1C] font-extrabold">EXPIRED (Quarantined)</span>
              </p>
              <div className="text-[10px] text-[#B91C1C] font-extrabold flex items-center gap-1 bg-white p-1 rounded-md border border-[#FCA5A5]">
                <ShieldAlert size={12} /> System blocks dose recording with this batch ID
              </div>
            </div>

          </div>
        </div>

        {/* 1. Vaccine Inventory Section */}
        <VaccineInventoryTable hospitalId={activeHospitalId} />

        {/* 2. Vaccine Usage Analytics Chart Section */}
        <UsageAnalyticsChart hospitalId={activeHospitalId} />

        {/* 3. Ambulance Operations / Live Monitoring Section */}
        <AmbulanceMonitoring hospitalId={activeHospitalId} />

        {/* 4. Doctors Currently Available Section */}
        <DoctorAvailability hospitalId={activeHospitalId} />

        {/* 5. Hospital Reviews & Feedback Section */}
        <HospitalReviewsSection hospitalId={activeHospitalId} allowWriteReview={true} />

        {/* Quick Patient Lookup & Record Interface */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#EAE7E1] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-heading font-extrabold text-[#2E2A5E] flex items-center gap-2">
                <Search size={20} className="text-[#E05D3F]" /> Cross-Hospital Patient Record Lookup
              </h2>
              <p className="text-xs text-[#6B6560] mt-1">
                Enter patient phone number or Patient ID to access immunization history and record new vaccine doses.
              </p>
            </div>
            <Link to="/clinic/patients" className="text-xs font-extrabold text-[#E05D3F] hover:underline flex items-center gap-1 shrink-0">
              View All Hospital Patients →
            </Link>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-[#8A847F]" />
              <input
                type="text"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#F6F4F1] border-2 border-[#EAE7E1] rounded-xl text-xs font-bold text-[#2E2A5E] focus:outline-none focus:border-[#E05D3F]"
                placeholder="Search by patient phone (e.g. 9876543210) or ID (e.g. p_demo_1)..."
              />
            </div>
            <Button type="submit" className="bg-[#2E2A5E] hover:bg-[#231f47] text-white font-extrabold text-xs px-6 py-3 rounded-xl cursor-pointer">
              Search Patient Record
            </Button>
          </form>

          {searchedPatientId && (
            <div className="pt-4 border-t border-[#EAE7E1]">
              <PatientRecord patientId={searchedPatientId} />
            </div>
          )}
        </div>

        {/* Active Hospital Alerts Section */}
        {unreadAlerts.length > 0 && (
          <div className="bg-white p-6 rounded-3xl border-2 border-[#EAE7E1] space-y-4">
            <div className="flex items-center justify-between border-b border-[#EAE7E1] pb-3">
              <h3 className="text-base font-extrabold text-[#2E2A5E] flex items-center gap-2">
                <AlertCircle size={18} className="text-[#E05D3F]" /> Hospital System Notifications ({unreadAlerts.length})
              </h3>
              <Link to="/clinic/alerts" className="text-xs font-bold text-[#2E2A5E] hover:underline">
                View All Alerts →
              </Link>
            </div>

            <div className="space-y-3">
              {unreadAlerts.slice(0, 3).map((alert, idx) => (
                <div key={`${alert.id || 'alt'}_${idx}`} className="flex items-center justify-between bg-[#F6F4F1] p-4 rounded-2xl border border-[#EAE7E1]">
                  <div>
                    <span className="text-xs font-extrabold text-[#2E2A5E] capitalize flex items-center gap-2 mb-1">
                      {alert.type.replace('_', ' ')}
                      <span className="text-[10px] bg-[#FEF2F2] text-[#B91C1C] px-2 py-0.5 rounded-md font-extrabold">Action Needed</span>
                    </span>
                    <p className="text-xs text-[#6B6560] font-medium">{alert.message}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => useAppStore.getState().markAlertRead(alert.id)}
                    className="text-xs font-bold border-[#EAE7E1] text-[#2E2A5E] rounded-xl"
                  >
                    Dismiss
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Hospital Update Modal */}
      <HospitalUpdateModal
        hospitalId={activeHospitalId}
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
      />

    </div>
  );
}
