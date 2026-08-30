import React, { useState } from 'react';
import { Ambulance } from '../../types';
import { useAppStore } from '../../store';
import { 
  Truck, Radio, Phone, Navigation, AlertCircle, 
  CheckCircle2, Clock, Wrench, RefreshCw, ChevronRight
} from 'lucide-react';
import { Button } from '../ui/Button';

interface AmbulanceMonitoringProps {
  hospitalId: string;
}

export function AmbulanceMonitoring({ hospitalId }: AmbulanceMonitoringProps) {
  const { hospitalOperations, updateAmbulanceStatus } = useAppStore();
  const hospital = hospitalOperations[hospitalId] || hospitalOperations['hosp_1'];
  
  const [selectedAmbulance, setSelectedAmbulance] = useState<Ambulance | null>(null);
  const [newStatus, setNewStatus] = useState<Ambulance['status']>('available');
  const [newRoute, setNewRoute] = useState('');

  const ambulances = hospital?.ambulances || [];

  const totalCount = ambulances.length;
  const availableCount = ambulances.filter(a => a.status === 'available').length;
  const onCallCount = ambulances.filter(a => a.status === 'on_emergency_call').length;
  const maintenanceCount = ambulances.filter(a => a.status === 'maintenance').length;

  const handleOpenEdit = (amb: Ambulance) => {
    setSelectedAmbulance(amb);
    setNewStatus(amb.status);
    setNewRoute(amb.currentRoute || '');
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAmbulance) return;
    updateAmbulanceStatus(hospitalId, selectedAmbulance.id, newStatus, newRoute);
    setSelectedAmbulance(null);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-[#EAE7E1] shadow-xs p-6 sm:p-8 space-y-6">
      
      {/* Header & Live Badges */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#2E2A5E]/10 text-[#2E2A5E] rounded-xl">
              <Truck size={20} />
            </div>
            <h2 className="text-xl font-heading font-extrabold text-[#2E2A5E]">
              Ambulance Fleet & Emergency Dispatch
            </h2>
          </div>
          <p className="text-xs text-[#6B6560] mt-1">
            Real-time ambulance telemetry, active emergency transit, driver contact, and dispatch allocation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 bg-[#FEF3F2] text-[#B91C1C] text-[11px] font-extrabold px-3 py-1 rounded-full border border-[#FECDCA] animate-pulse">
            <Radio size={13} /> DEMO LIVE STATUS
          </span>
        </div>
      </div>

      {/* Overview Stat Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#F6F4F1] p-3.5 rounded-2xl border border-[#EAE7E1]">
          <span className="text-[10px] text-[#6B6560] font-extrabold uppercase tracking-wider block">Total Fleet</span>
          <span className="text-2xl font-extrabold text-[#2E2A5E]">{totalCount}</span>
        </div>
        <div className="bg-[#EBF7EE] p-3.5 rounded-2xl border border-[#C8E6C9]">
          <span className="text-[10px] text-[#1B7A3D] font-extrabold uppercase tracking-wider block">Available Now</span>
          <span className="text-2xl font-extrabold text-[#1B7A3D]">{availableCount}</span>
        </div>
        <div className="bg-[#FEF3F2] p-3.5 rounded-2xl border border-[#FECDCA]">
          <span className="text-[10px] text-[#B91C1C] font-extrabold uppercase tracking-wider block">On Emergency Call</span>
          <span className="text-2xl font-extrabold text-[#B91C1C]">{onCallCount}</span>
        </div>
        <div className="bg-[#FEF3C7] p-3.5 rounded-2xl border border-[#FDE68A]">
          <span className="text-[10px] text-[#D97706] font-extrabold uppercase tracking-wider block">Under Maintenance</span>
          <span className="text-2xl font-extrabold text-[#D97706]">{maintenanceCount}</span>
        </div>
      </div>

      {/* Ambulances List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ambulances.map(amb => {
          const isAvailable = amb.status === 'available';
          const isOnCall = amb.status === 'on_emergency_call';
          const isMaint = amb.status === 'maintenance';

          return (
            <div 
              key={amb.id}
              className="p-5 rounded-2xl border-2 border-[#EAE7E1] bg-white shadow-2xs hover:border-[#2E2A5E]/40 transition-all flex flex-col justify-between gap-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold font-mono text-[#2E2A5E] bg-[#F6F4F1] px-2.5 py-0.5 rounded-lg border border-[#EAE7E1]">
                      {amb.id}
                    </span>
                    <span className="text-xs text-[#6B6560] font-bold">
                      {amb.vehicleNumber}
                    </span>
                  </div>

                  {isAvailable && (
                    <span className="inline-flex items-center gap-1 bg-[#EBF7EE] text-[#1B7A3D] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#C8E6C9]">
                      <CheckCircle2 size={11} /> ● Available
                    </span>
                  )}
                  {isOnCall && (
                    <span className="inline-flex items-center gap-1 bg-[#FEF3F2] text-[#B91C1C] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#FECDCA] animate-pulse">
                      <Radio size={11} /> ● On Emergency Call
                    </span>
                  )}
                  {isMaint && (
                    <span className="inline-flex items-center gap-1 bg-[#FEF3C7] text-[#D97706] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#FDE68A]">
                      <Wrench size={11} /> ● Maintenance
                    </span>
                  )}
                </div>

                {isOnCall && (
                  <div className="p-2.5 bg-[#FEF3F2] rounded-xl border border-[#FECDCA] text-xs font-bold text-[#B91C1C] flex items-center gap-2">
                    <Navigation size={14} className="shrink-0" />
                    <span>{amb.currentRoute || 'En Route to Incident Location'}</span>
                  </div>
                )}

                <div className="text-xs text-[#6B6560] flex items-center justify-between pt-1">
                  <span>Driver: <strong className="text-[#2E2A5E]">{amb.driverName || 'Designated Driver'}</strong></span>
                  <span>{amb.contactPhone || '+91 98220 10001'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#EAE7E1] flex items-center justify-between gap-2">
                <a 
                  href={`tel:${amb.contactPhone || '+919822010001'}`} 
                  className="text-xs text-[#2E2A5E] font-extrabold hover:text-[#E05D3F] flex items-center gap-1"
                >
                  <Phone size={12} /> Contact Crew
                </a>
                
                <button
                  onClick={() => handleOpenEdit(amb)}
                  className="px-3 py-1 bg-[#F6F4F1] hover:bg-[#2E2A5E] hover:text-white text-[#2E2A5E] text-xs font-extrabold rounded-lg border border-[#EAE7E1] transition-all cursor-pointer"
                >
                  Update Status →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Update Ambulance Status Modal */}
      {selectedAmbulance && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border-2 border-[#EAE7E1] shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-[#EAE7E1] pb-3">
              <h3 className="text-lg font-heading font-extrabold text-[#2E2A5E] flex items-center gap-2">
                <Truck className="text-[#2E2A5E]" size={20} /> Update {selectedAmbulance.id}
              </h3>
              <button 
                onClick={() => setSelectedAmbulance(null)}
                className="text-[#8A847F] hover:text-[#231F20] text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-[#6B6560] uppercase tracking-wider mb-1">Ambulance Dispatch Status</label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as Ambulance['status'])}
                  className="w-full p-3 bg-[#F6F4F1] border-2 border-[#EAE7E1] rounded-xl text-xs font-extrabold text-[#2E2A5E] outline-none"
                >
                  <option value="available">● Available (Ready for Dispatch)</option>
                  <option value="on_emergency_call">● On Emergency Call (In Transit)</option>
                  <option value="maintenance">● Maintenance (In Workshop)</option>
                </select>
              </div>

              {newStatus === 'on_emergency_call' && (
                <div>
                  <label className="block text-[#6B6560] uppercase tracking-wider mb-1">Active Transit Route</label>
                  <input
                    type="text"
                    value={newRoute}
                    onChange={e => setNewRoute(e.target.value)}
                    placeholder="e.g. En Route Shivajinagar → Sunrise Hospital"
                    className="w-full p-3 bg-[#F6F4F1] border-2 border-[#EAE7E1] rounded-xl text-xs font-extrabold text-[#2E2A5E] outline-none"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedAmbulance(null)}
                  className="flex-1 border-[#EAE7E1] text-[#2E2A5E] rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#2E2A5E] hover:bg-[#231f47] text-white rounded-xl font-extrabold"
                >
                  Save Dispatch Status
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
