import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Hospital, MapPin, Phone, Navigation, ShieldCheck, Clock, 
  AlertCircle, CheckCircle2, Search, Filter, ExternalLink, HeartPulse, ShieldAlert,
  Star, Stethoscope, Truck, Calendar, X, MessageSquare, ChevronRight, Sparkles, Plus
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAppStore } from '../store';
import { translations } from '../utils/translations';
import { Link } from 'react-router-dom';
import { HospitalReviewsSection } from '../components/HospitalOperations/HospitalReviewsSection';

const USER_LOCATION: { name: string; lat: number; lng: number } = {
  name: 'Shivajinagar, Pune, Maharashtra',
  lat: 18.5314,
  lng: 73.8446
};

// Custom DivIcons
const createHospitalIcon = (isSelected: boolean, rating: number) => {
  return L.divIcon({
    className: 'custom-hospital-marker',
    html: `
      <div style="
        background-color: ${isSelected ? '#E05D3F' : '#2E2A5E'};
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
        transition: all 0.2s ease;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 6v12M6 12h12"/>
        </svg>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

const userIcon = L.divIcon({
  className: 'custom-user-marker',
  html: `
    <div style="
      background-color: #E05D3F;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 3.5px solid white;
      box-shadow: 0 0 0 7px rgba(224, 93, 63, 0.3);
    "></div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11]
});

function RecenterMap({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 13.5, { animate: true });
  }, [coords, map]);
  return null;
}

export function PatientNearbyHospitals() {
  const language = useAppStore(state => state.language);
  const t = translations[language] || translations.en;
  const { hospitalOperations, hospitalReviews } = useAppStore();

  const hospitalsList = Object.values(hospitalOperations);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(hospitalsList[0]?.id || 'hosp_1');
  const [filterService, setFilterService] = useState<'all' | 'rabies' | 'antivenom' | 'top_rated'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingHospitalModal, setInspectingHospitalModal] = useState<string | null>(null);

  const selectedHospital = hospitalOperations[selectedHospitalId] || hospitalsList[0];

  const filteredHospitals = hospitalsList.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          h.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          h.address.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterService === 'rabies') return h.rabiesPepAvailable;
    if (filterService === 'antivenom') return h.antivenomAvailable;
    if (filterService === 'top_rated') return (h.rating || 0) >= 4.5;
    return true;
  });

  const inspectedHospital = inspectingHospitalModal ? hospitalOperations[inspectingHospitalModal] : null;

  return (
    <div className="bg-[#F6F4F1] min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Page Header */}
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#EAE7E1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#F6F4F1] text-[#E05D3F] mb-2 border border-[#EAE7E1]">
              <MapPin size={13} className="text-[#2E2A5E]" /> {t.mapView}
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#2E2A5E]">
              Nearby Hospitals & Emergency Facilities
            </h1>
            <p className="text-xs sm:text-sm text-[#6B6560] mt-1 max-w-2xl">
              Locate 24/7 emergency medical facilities equipped with Rabies PEP vaccines, antivenom serums, doctor rosters, and patient ratings around Shivajinagar, Pune.
            </p>
          </div>

          <div className="bg-[#FEF3F2] border border-[#FECDCA] p-3.5 rounded-2xl flex items-center gap-3 shrink-0">
            <ShieldAlert size={22} className="text-[#E05D3F] shrink-0" />
            <div className="text-xs">
              <span className="font-extrabold text-[#2E2A5E] block">24/7 Emergency Helpline</span>
              <a href="tel:+912025532000" className="text-[#B91C1C] font-extrabold hover:underline">
                +91 20 2553 2000 / 108
              </a>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border-2 border-[#EAE7E1] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-3 text-[#8A847F]" />
            <input 
              type="text"
              placeholder="Search hospital or locality (e.g. Shivajinagar)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-xs font-semibold text-[#2E2A5E] outline-none focus:ring-2 focus:ring-[#E05D3F]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-extrabold text-[#6B6560] mr-1 hidden sm:inline">Filter Facilities:</span>
            <button
              onClick={() => setFilterService('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                filterService === 'all' 
                  ? 'bg-[#2E2A5E] text-white border-[#2E2A5E]' 
                  : 'bg-[#F6F4F1] text-[#6B6560] border-[#EAE7E1] hover:bg-[#EAE7E1]'
              }`}
            >
              All Facilities ({hospitalsList.length})
            </button>
            <button
              onClick={() => setFilterService('rabies')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                filterService === 'rabies' 
                  ? 'bg-[#E05D3F] text-white border-[#E05D3F]' 
                  : 'bg-[#F6F4F1] text-[#6B6560] border-[#EAE7E1] hover:bg-[#EAE7E1]'
              }`}
            >
              Rabies PEP Ready
            </button>
            <button
              onClick={() => setFilterService('antivenom')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                filterService === 'antivenom' 
                  ? 'bg-[#1B7A3D] text-white border-[#1B7A3D]' 
                  : 'bg-[#F6F4F1] text-[#6B6560] border-[#EAE7E1] hover:bg-[#EAE7E1]'
              }`}
            >
              Antivenom Available
            </button>
            <button
              onClick={() => setFilterService('top_rated')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                filterService === 'top_rated' 
                  ? 'bg-[#F2A93B] text-[#231F20] border-[#F2A93B]' 
                  : 'bg-[#F6F4F1] text-[#6B6560] border-[#EAE7E1] hover:bg-[#EAE7E1]'
              }`}
            >
              ⭐ Top Rated (4.5+)
            </button>
          </div>
        </div>
      </div>

      {/* Main Map + Hospital List Split View */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive Map (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="bg-white border-2 border-[#EAE7E1] rounded-3xl overflow-hidden shadow-xs">
            <CardHeader className="bg-[#F6F4F1]/70 border-b border-[#EAE7E1] py-3.5 px-5 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-[#E05D3F]" />
                <CardTitle className="text-sm font-extrabold text-[#2E2A5E]">
                  Pune Emergency Hospital Map
                </CardTitle>
              </div>
              <span className="text-[11px] font-extrabold text-[#1B7A3D] bg-[#EBF7EE] px-2.5 py-0.5 rounded-full border border-[#C8E6C9]">
                📍 User: Shivajinagar, Pune
              </span>
            </CardHeader>

            <CardContent className="p-0 relative">
              <div className="h-[320px] sm:h-[440px] md:h-[500px] w-full relative z-0">
                <MapContainer 
                  center={[selectedHospital?.lat || 18.5308, selectedHospital?.lng || 73.8475]} 
                  zoom={13} 
                  scrollWheelZoom={false}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <RecenterMap coords={[selectedHospital?.lat || 18.5308, selectedHospital?.lng || 73.8475]} />

                  {/* User Location Marker */}
                  <Marker position={[USER_LOCATION.lat, USER_LOCATION.lng]} icon={userIcon}>
                    <Popup>
                      <div className="text-xs p-1">
                        <strong className="text-[#E05D3F]">Your Current Location</strong>
                        <p className="text-[11px] text-gray-600 mt-0.5">{USER_LOCATION.name}</p>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Hospital Markers */}
                  {filteredHospitals.map(hosp => {
                    const isSelected = selectedHospitalId === hosp.id;
                    const docActive = hosp.doctors?.filter(d => d.availability === 'available').length || 0;

                    return (
                      <Marker 
                        key={hosp.id} 
                        position={[hosp.lat, hosp.lng]} 
                        icon={createHospitalIcon(isSelected, hosp.rating || 4.7)}
                        eventHandlers={{
                          click: () => setSelectedHospitalId(hosp.id)
                        }}
                      >
                        <Popup>
                          <div className="text-xs space-y-1.5 p-1 max-w-[220px]">
                            <div className="flex items-center justify-between">
                              <span className="bg-[#2E2A5E] text-white text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">
                                {hosp.distanceKm} km away
                              </span>
                              <span className="text-[#B45309] font-extrabold flex items-center gap-0.5">
                                <Star size={11} className="fill-[#F2A93B] text-[#F2A93B]" /> {hosp.rating || 4.7}
                              </span>
                            </div>
                            <h4 className="font-extrabold text-[#2E2A5E] text-sm leading-snug">{hosp.name}</h4>
                            <p className="text-[11px] text-gray-500">{hosp.area}</p>
                            <div className="text-[10px] text-[#1B7A3D] font-bold">
                              ● {docActive} Doctors on Floor Available
                            </div>
                            <div className="pt-1.5 flex gap-2">
                              <button
                                onClick={() => setInspectingHospitalModal(hosp.id)}
                                className="text-[10px] font-extrabold text-[#2E2A5E] bg-[#F6F4F1] px-2 py-1 rounded border border-[#EAE7E1] hover:bg-[#EAE7E1] cursor-pointer"
                              >
                                View Details & Reviews
                              </button>
                              <a 
                                href={`https://www.google.com/maps/dir/?api=1&destination=${hosp.lat},${hosp.lng}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] font-extrabold text-[#E05D3F] hover:underline flex items-center"
                              >
                                Route →
                              </a>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Hospital Cards List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-extrabold text-[#2E2A5E] uppercase tracking-wider">
              Facilities Near Shivajinagar ({filteredHospitals.length})
            </h3>
            <span className="text-xs text-[#8A847F] font-bold">Demo Data</span>
          </div>

          <div className="space-y-3.5 max-h-[540px] overflow-y-auto pr-1">
            {filteredHospitals.map(hosp => {
              const isSelected = selectedHospitalId === hosp.id;
              const docActive = hosp.doctors?.filter(d => d.availability === 'available').length || 0;
              const ambAvail = hosp.ambulances?.filter(a => a.status === 'available').length || 0;

              return (
                <div 
                  key={hosp.id}
                  onClick={() => setSelectedHospitalId(hosp.id)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    isSelected 
                      ? 'bg-white border-[#E05D3F] shadow-md ring-1 ring-[#E05D3F]/30' 
                      : 'bg-white border-[#EAE7E1] hover:border-[#2E2A5E]/40'
                  }`}
                >
                  {/* Top Bar: Name & Distance */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        <span className="bg-[#2E2A5E] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                          {hosp.distanceKm} km
                        </span>
                        <span className="bg-[#EBF7EE] text-[#1B7A3D] text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-[#C8E6C9]">
                          24/7 Emergency
                        </span>
                        <span className="bg-[#FFFBEB] text-[#B45309] text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-[#FDE68A] flex items-center gap-1">
                          <Star size={10} className="fill-[#F2A93B] text-[#F2A93B]" /> {hosp.rating || 4.7} ({hosp.totalReviews || 128})
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-[#2E2A5E] leading-snug">
                        {hosp.name}
                      </h4>
                      <p className="text-xs text-[#6B6560] mt-1 leading-relaxed">
                        {hosp.address}
                      </p>
                    </div>
                  </div>

                  {/* Operational availability counters */}
                  <div className="mt-3 grid grid-cols-2 gap-2 bg-[#F6F4F1] p-2.5 rounded-xl border border-[#EAE7E1] text-[11px] font-bold">
                    <div className="flex items-center gap-1.5 text-[#1B7A3D]">
                      <Stethoscope size={13} />
                      <span>{docActive} Doctors on Floor</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#2E2A5E]">
                      <Truck size={13} />
                      <span>{ambAvail} Ambulances Ready</span>
                    </div>
                  </div>

                  {/* Services Tags */}
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {hosp.services?.map((srv, idx) => (
                      <span key={idx} className="bg-white text-[#2E2A5E] border border-[#EAE7E1] text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {srv}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-1 border-t border-[#EAE7E1]">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectingHospitalModal(hosp.id);
                      }}
                      className="flex-1 text-xs font-extrabold border-[#2E2A5E] text-[#2E2A5E] hover:bg-[#2E2A5E] hover:text-white rounded-xl py-2 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <MessageSquare size={13} /> Details & Reviews
                    </Button>

                    <Link 
                      to="/patient/appointments"
                      onClick={e => e.stopPropagation()}
                      className="flex-1"
                    >
                      <Button 
                        size="sm" 
                        className="w-full text-xs font-extrabold bg-[#E05D3F] hover:bg-[#c94d31] text-white rounded-xl py-2 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Calendar size={13} /> Book Slot
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Hospital Details & Reviews Modal / Drawer */}
      {inspectedHospital && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 border-2 border-[#EAE7E1] shadow-2xl space-y-6 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#EAE7E1] pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="bg-[#2E2A5E] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full font-mono">
                    ID: {inspectedHospital.id.toUpperCase()}
                  </span>
                  <span className="bg-[#EBF7EE] text-[#1B7A3D] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#C8E6C9]">
                    ✓ Verified Facility
                  </span>
                  <span className="bg-[#FFFBEB] text-[#B45309] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#FDE68A] flex items-center gap-1">
                    <Star size={11} className="fill-[#F2A93B] text-[#F2A93B]" /> {inspectedHospital.rating || 4.7} Rating
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-[#2E2A5E]">
                  {inspectedHospital.name}
                </h2>
                <p className="text-xs text-[#6B6560] mt-1">
                  {inspectedHospital.address}
                </p>
              </div>

              <button 
                onClick={() => setInspectingHospitalModal(null)}
                className="text-[#8A847F] hover:text-[#231F20] text-base font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Contact & Directions Bar */}
            <div className="flex flex-wrap gap-3">
              <a href={`tel:${inspectedHospital.phone}`} className="flex-1 min-w-[140px]">
                <Button className="w-full bg-[#1B7A3D] hover:bg-[#156030] text-white font-extrabold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer">
                  <Phone size={14} /> Call Helpline: {inspectedHospital.phone}
                </Button>
              </a>

              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${inspectedHospital.lat},${inspectedHospital.lng}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 min-w-[140px]"
              >
                <Button variant="outline" className="w-full border-[#E05D3F] text-[#E05D3F] hover:bg-[#E05D3F] hover:text-white font-extrabold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer">
                  <Navigation size={14} /> Navigate on Maps ({inspectedHospital.distanceKm} km)
                </Button>
              </a>
            </div>

            {/* Emergency Readiness Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1] text-center">
                <span className="text-[10px] text-[#6B6560] font-extrabold uppercase tracking-wider block">ICU Beds</span>
                <span className="text-xl font-extrabold text-[#2E2A5E]">{inspectedHospital.bedsAvailableDemo || 14}</span>
              </div>
              <div className="p-3 bg-[#EBF7EE] rounded-2xl border border-[#C8E6C9] text-center">
                <span className="text-[10px] text-[#1B7A3D] font-extrabold uppercase tracking-wider block">Rabies PEP</span>
                <span className="text-xs font-extrabold text-[#1B7A3D]">✓ In Stock</span>
              </div>
              <div className="p-3 bg-[#EBF7EE] rounded-2xl border border-[#C8E6C9] text-center">
                <span className="text-[10px] text-[#1B7A3D] font-extrabold uppercase tracking-wider block">Antivenom</span>
                <span className="text-xs font-extrabold text-[#1B7A3D]">
                  {inspectedHospital.antivenomAvailable ? '✓ In Stock' : '✗ Referral Only'}
                </span>
              </div>
              <div className="p-3 bg-[#FEF3C7] rounded-2xl border border-[#FDE68A] text-center">
                <span className="text-[10px] text-[#D97706] font-extrabold uppercase tracking-wider block">Emergency Room</span>
                <span className="text-xs font-extrabold text-[#D97706]">● 24/7 Active</span>
              </div>
            </div>

            {/* Doctors Roster Preview */}
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-[#2E2A5E] uppercase tracking-wider flex items-center gap-1.5">
                <Stethoscope size={15} className="text-[#1B7A3D]" /> Active Medical Staff On Floor
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {inspectedHospital.doctors?.slice(0, 4).map(doc => (
                  <div key={doc.id} className="p-3 bg-[#F6F4F1] rounded-xl border border-[#EAE7E1] flex items-center justify-between">
                    <div>
                      <strong className="text-[#2E2A5E] block">{doc.name}</strong>
                      <span className="text-[10px] text-[#6B6560]">{doc.speciality} • Room {doc.roomNumber}</span>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      doc.availability === 'available' ? 'bg-[#EBF7EE] text-[#1B7A3D]' : 'bg-[#FEF3C7] text-[#D97706]'
                    }`}>
                      {doc.availability === 'available' ? '● Available' : '● In Consult'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section inside modal */}
            <div className="pt-2">
              <HospitalReviewsSection hospitalId={inspectedHospital.id} allowWriteReview={true} />
            </div>

            <div className="pt-4 border-t border-[#EAE7E1] flex justify-end">
              <Button
                onClick={() => setInspectingHospitalModal(null)}
                className="bg-[#2E2A5E] hover:bg-[#231f47] text-white font-extrabold text-xs px-6 py-2.5 rounded-xl cursor-pointer"
              >
                Close Hospital Inspector
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
