import React, { useState } from 'react';
import { useTranslation } from '../utils/useTranslation';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { HeartPulse, AlertTriangle, MapPin, Phone, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAppStore } from '../store';
import { Link } from 'react-router-dom';

// Fix for default Leaflet markers in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

type EmergencyType = 'snake_bite' | 'animal_bite' | 'allergic_reaction' | 'injury' | 'other' | null;

export function PatientEmergencyCare() {
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyType>(null);
  const { hospitalOperations } = useAppStore();

  const facilities = Object.values(hospitalOperations);
  const centerPosition: [number, number] = [18.5308, 73.8475]; // Pune center

  return (
    <div className="bg-[#F6F4F1] min-h-screen py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <header className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-white text-[#E05D3F] mb-2 border border-[#EAE7E1]">
            <HeartPulse size={13} className="text-[#E05D3F]" /> 24/7 Emergency Medical Network
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-[#2E2A5E] flex items-center gap-3">
            Emergency Care & Triage Finder
          </h1>
          <p className="text-[#6B6560] mt-1 text-sm">
            Locate nearest healthcare facilities with 24/7 emergency response, Rabies PEP, antivenom serums, and trauma care around Pune.
          </p>
        </header>

        {/* 24/7 Emergency Helpline Banner */}
        <div className="bg-[#B91C1C] text-white p-5 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-white/20 rounded-xl">
              <Phone size={24} className="text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wide">24/7 Emergency Care Helpline</h3>
              <p className="text-xs text-white/90">Immediate assistance for Rabies PEP, Snakebite Antivenom & Trauma Triage in Pune</p>
            </div>
          </div>
          <a 
            href="tel:+912025532000" 
            className="bg-white text-[#B91C1C] px-5 py-2.5 rounded-xl text-sm font-extrabold hover:bg-red-50 transition-all shrink-0 flex items-center gap-2 border border-white/20 shadow-xs"
          >
            <Phone size={16} /> +91 20 2553 2000 / 108
          </a>
        </div>

        {!selectedEmergency ? (
          <div className="space-y-4">
             <h3 className="font-extrabold text-xl text-[#2E2A5E] mb-4">Select Emergency Situation</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               {[
                 { id: 'animal_bite', label: 'Dog / Animal Bite (Rabies Risk)', desc: 'Immediate wound wash and Post-Exposure Prophylaxis (PEP)' },
                 { id: 'snake_bite', label: 'Snake Bite (Antivenom Required)', desc: 'Polyvalent snake antivenom and respiratory support' },
                 { id: 'allergic_reaction', label: 'Severe Allergic Reaction / Anaphylaxis', desc: 'Epinephrine and emergency airway stabilization' },
                 { id: 'injury', label: 'Serious Trauma / Injury / Deep Wound', desc: 'Surgical debridement and Tetanus Toxoid booster' },
                 { id: 'other', label: 'Other Medical Emergency', desc: '24/7 emergency physician consultation' },
               ].map(type => (
                 <button 
                   key={type.id}
                   onClick={() => setSelectedEmergency(type.id as EmergencyType)}
                   className="bg-white p-5 rounded-2xl border-2 border-[#EAE7E1] shadow-2xs hover:shadow-md hover:border-[#E05D3F] transition-all flex flex-col justify-between text-left group cursor-pointer gap-2"
                 >
                   <div>
                     <span className="font-extrabold text-base text-[#2E2A5E] group-hover:text-[#E05D3F] transition-colors">
                       {type.label}
                     </span>
                     <p className="text-xs text-[#6B6560] mt-1">{type.desc}</p>
                   </div>
                   <span className="text-xs font-extrabold text-[#E05D3F] flex items-center gap-1 pt-2">
                     Find Facilities →
                   </span>
                 </button>
               ))}
             </div>
          </div>
        ) : (
          <div className="space-y-6">
            <button 
              onClick={() => setSelectedEmergency(null)}
              className="text-xs font-extrabold text-[#6B6560] hover:text-[#E05D3F] transition-colors cursor-pointer"
            >
              ← Back to categories
            </button>
            
            {/* Contextual Warning */}
            <div className="bg-[#FEF2F2] border-l-4 border-[#B91C1C] p-5 rounded-r-2xl shadow-2xs space-y-1">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-[#B91C1C] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-extrabold text-[#991B1B]">
                    {selectedEmergency === 'snake_bite' && "Snake bites are life-threatening medical emergencies. Seek emergency antivenom care immediately."}
                    {selectedEmergency === 'animal_bite' && "Animal bites require immediate thorough washing with soap and water for 15 mins and prompt Rabies PEP assessment."}
                    {['allergic_reaction', 'injury', 'other'].includes(selectedEmergency) && "This may be a life-threatening emergency. Proceed to the nearest trauma room or call emergency services."}
                  </h3>
                  <p className="text-xs text-[#B91C1C] font-medium mt-1">
                    Please proceed to the nearest emergency department or dial 108 / +91 20 2553 2000.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Facility List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-lg text-[#2E2A5E]">
                    Equipped Emergency Facilities ({facilities.length})
                  </h3>
                  <Link to="/patient/nearby-hospitals" className="text-xs font-extrabold text-[#E05D3F] hover:underline">
                    View Full Map →
                  </Link>
                </div>

                {facilities.map(facility => (
                  <Card key={facility.id} className="bg-white border-2 border-[#EAE7E1] rounded-2xl shadow-2xs overflow-hidden">
                    <CardContent className="p-5 space-y-3">
                       <div className="flex justify-between items-start">
                         <div>
                           <div className="flex items-center gap-1.5 mb-1">
                             <span className="bg-[#2E2A5E] text-white text-[10px] font-extrabold px-2 py-0.5 rounded">
                               {facility.distanceKm} km
                             </span>
                             <span className="bg-[#EBF7EE] text-[#1B7A3D] text-[10px] font-extrabold px-2 py-0.5 rounded border border-[#C8E6C9]">
                               Open 24/7
                             </span>
                           </div>
                           <h4 className="font-extrabold text-base text-[#2E2A5E]">{facility.name}</h4>
                           <p className="text-xs text-[#6B6560] flex items-center gap-1 mt-0.5">
                             <MapPin size={13} className="text-[#E05D3F]" /> {facility.address}
                           </p>
                         </div>
                       </div>

                       <div className="bg-[#F6F4F1] p-3 rounded-xl space-y-1.5 text-xs font-bold border border-[#EAE7E1]">
                         <div className="flex justify-between">
                           <span className="text-[#6B6560]">Rabies PEP Vaccine:</span>
                           <span className="text-[#1B7A3D] font-extrabold">✓ In Stock (Cold Chain Verified)</span>
                         </div>
                         <div className="flex justify-between">
                           <span className="text-[#6B6560]">Polyvalent Antivenom:</span>
                           <span className={facility.antivenomAvailable ? "text-[#1B7A3D] font-extrabold" : "text-[#D97706] font-extrabold"}>
                             {facility.antivenomAvailable ? "✓ Available in Cold Storage" : "Call to Confirm / Referral"}
                           </span>
                         </div>
                         <div className="flex justify-between">
                           <span className="text-[#6B6560]">Emergency Doctors:</span>
                           <span className="text-[#2E2A5E]">
                             {facility.doctors?.filter(d => d.availability === 'available').length || 4} Active on Floor
                           </span>
                         </div>
                       </div>

                       <div className="flex gap-2 pt-1">
                          <a 
                            href={`https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1"
                          >
                            <Button className="w-full bg-[#E05D3F] hover:bg-[#c94d31] text-white font-extrabold text-xs py-2 rounded-xl">
                              Get Directions
                            </Button>
                          </a>
                          <a href={`tel:${facility.phone}`} className="flex-1">
                            <Button variant="outline" className="w-full border-[#2E2A5E] text-[#2E2A5E] font-extrabold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5">
                              <Phone size={14} /> Call Helpline
                            </Button>
                          </a>
                       </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Map */}
              <div className="h-[520px] bg-white rounded-3xl overflow-hidden shadow-2xs border-2 border-[#EAE7E1] relative z-0">
                <MapContainer center={centerPosition} zoom={12.5} scrollWheelZoom={false} className="w-full h-full">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {facilities.map(fac => (
                    <Marker key={fac.id} position={[fac.lat, fac.lng]}>
                      <Popup>
                        <div className="font-sans text-xs space-y-1 p-1">
                          <h4 className="font-extrabold text-[#2E2A5E] text-sm">{fac.name}</h4>
                          <p className="text-[11px] text-gray-600">{fac.phone}</p>
                          <span className="text-[10px] text-[#1B7A3D] font-extrabold block">● 24/7 Emergency Active</span>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>
        )}

        <footer className="pt-8 border-t border-[#EAE7E1]">
           <p className="text-xs text-[#8A847F] leading-relaxed text-justify max-w-4xl">
             <strong>Emergency medical information disclaimer (Demo Data):</strong> VacTrack is an immunization schedule and healthcare facilitation tool. In a life-threatening emergency, seek immediate professional medical attention at the nearest emergency department or contact local ambulance services (108). All facility statuses shown are fictional prototype demonstration data.
           </p>
        </footer>

      </div>
    </div>
  );
}
