import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store';
import { 
  ShieldCheck, LogOut, Menu, X, ChevronRight, Globe, User, HeartPulse, 
  Home, Activity, Calendar, QrCode, Shield, Hospital, Bell, Settings,
  Users, PackageCheck, AlertCircle, Building2, CheckCircle2
} from 'lucide-react';
import { Button } from './ui/Button';
import { Logo } from './ui/Logo';
import { cn } from '../utils/cn';
import { translations } from '../utils/translations';

export function Navbar() {
  const { currentUser, logout, clinics, language, setLanguage } = useAppStore();
  const t = translations[language] || translations.en;
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navItems = [
    { to: '/', label: t.home },
    { to: '/about', label: t.about },
    { to: '/how-it-works', label: t.howItWorks },
    { to: '/features', label: t.features },
    { to: '/for-patients', label: t.forPatients },
    { to: '/for-hospitals', label: t.forHospitals },
    { to: '/contact', label: t.contact },
  ];

  const NavLink = ({ to, label }: { to: string, label: string, key?: React.Key }) => {
    const isActive = location.pathname === to || (to === '/for-hospitals' && location.pathname === '/for-clinics');
    return (
      <Link 
        to={to} 
        className={cn(
          "relative px-3 py-1.5 text-xs lg:text-sm font-semibold transition-all duration-150 rounded-lg",
          isActive 
            ? "text-[#E05D3F] font-bold" 
            : "text-white/80 hover:text-white hover:bg-white/5"
        )}
        onClick={() => setMobileMenuOpen(false)}
      >
        {label}
        {isActive && (
          <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#E05D3F] rounded-full" />
        )}
      </Link>
    );
  };

  const isPortalActive = location.pathname.startsWith('/patient') || location.pathname.startsWith('/clinic');

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-200 border-b border-white/10 bg-[#2E2A5E] h-16 sm:h-18 flex items-center",
        scrolled && "bg-[#2E2A5E]/95 backdrop-blur-md shadow-sm"
      )}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 h-12 flex justify-between items-center">
        
        {/* VacTrack Logo & Portal Context */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/" className="flex items-center" title="VacTrack Home">
            <Logo theme="dark" />
          </Link>

          {/* If user is logged in, show clear public website vs portal breadcrumb pill */}
          {currentUser && (
            <div className="hidden sm:flex items-center gap-1.5 bg-white/10 rounded-full px-2.5 py-1 border border-white/10 text-xs">
              <Link 
                to="/" 
                className={cn(
                  "flex items-center gap-1 px-2 py-0.5 rounded-full transition-colors font-bold",
                  location.pathname === '/' 
                    ? "bg-[#E05D3F] text-white shadow-2xs" 
                    : "text-white/70 hover:text-white"
                )}
                title="Go to VacTrack Main Public Website"
              >
                <Home size={12} />
                <span>Home</span>
              </Link>
              <span className="text-white/30 text-[10px]">/</span>
              <Link 
                to={currentUser.role === 'patient' ? '/patient/dashboard' : '/clinic/dashboard'} 
                className={cn(
                  "flex items-center gap-1 px-2 py-0.5 rounded-full transition-colors font-bold",
                  isPortalActive 
                    ? "bg-[#E05D3F] text-white shadow-2xs" 
                    : "text-white/70 hover:text-white"
                )}
                title="Go to Portal Dashboard"
              >
                <ShieldCheck size={12} />
                <span>{currentUser.role === 'clinic_staff' ? 'Hospital Portal' : 'Patient Portal'}</span>
              </Link>
            </div>
          )}
        </div>
        
        {/* Main Desktop Navigation (when not in portal or logged out) */}
        {!currentUser && (
           <nav className="hidden xl:flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
             {navItems.map(item => (
               <NavLink key={item.to} to={item.to} label={item.label} />
             ))}
           </nav>
        )}

        {/* Large screen navigation when slightly smaller than xl */}
        {!currentUser && (
           <nav className="hidden lg:flex xl:hidden items-center gap-0.5 bg-white/5 px-2 py-1 rounded-full border border-white/10 text-xs">
             {navItems.map(item => (
               <Link 
                 key={item.to} 
                 to={item.to}
                 className={cn(
                   "px-2.5 py-1 rounded-md font-semibold transition-colors",
                   location.pathname === item.to ? "text-[#E05D3F] font-bold" : "text-white/75 hover:text-white"
                 )}
               >
                 {item.label}
               </Link>
             ))}
           </nav>
        )}

        {/* Right side: Language Toggle + Auth / Profile */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {/* English | Hindi Toggle */}
          <div className="flex items-center bg-white/10 rounded-full p-0.5 border border-white/10 text-xs font-semibold">
            <button
              onClick={() => setLanguage('en')}
              className={cn(
                "px-2.5 py-1 rounded-full transition-colors text-xs cursor-pointer",
                language === 'en' 
                  ? "bg-[#E05D3F] text-white font-bold shadow-xs" 
                  : "text-white/70 hover:text-white"
              )}
            >
              English
            </button>
            <span className="text-white/30 px-0.5">|</span>
            <button
              onClick={() => setLanguage('hi')}
              className={cn(
                "px-2.5 py-1 rounded-full transition-colors text-xs cursor-pointer",
                language === 'hi' 
                  ? "bg-[#E05D3F] text-white font-bold shadow-xs" 
                  : "text-white/70 hover:text-white"
              )}
            >
              हिंदी
            </button>
          </div>

          {!currentUser ? (
            <div className="flex items-center gap-2">
              <Link 
                to="/login" 
                className="text-xs lg:text-sm font-bold text-white/80 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                {t.login}
              </Link>
              <Link to="/signup">
                <Button size="sm" className="bg-[#E05D3F] hover:bg-[#c94f33] text-white font-bold border-none rounded-xl px-4 py-2 text-xs shadow-xs transition-colors">
                  {t.signUp} <ChevronRight size={14} className="ml-0.5 inline" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              {/* User Profile Badge */}
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full pl-3.5 pr-1 py-1">
                <div className="text-right flex flex-col">
                  <span className="text-xs font-bold text-white leading-tight">{currentUser.name}</span>
                  <span className="text-[10px] text-[#F2A93B] font-bold tracking-wider uppercase">
                    {currentUser.role === 'clinic_staff' ? clinics[currentUser.clinicId!]?.name || 'Clinic' : 'Patient Portal'}
                  </span>
                </div>
                <button 
                  onClick={handleLogout} 
                  title="Logout"
                  className="w-7 h-7 rounded-full bg-[#2E2A5E] border border-white/10 hover:bg-[#B91C1C] hover:border-transparent text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <LogOut size={13} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile menu trigger & mini language toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <div className="flex items-center bg-white/10 rounded-full p-0.5 text-[11px] font-semibold border border-white/10">
            <button
              onClick={() => setLanguage('en')}
              className={cn("px-2 py-0.5 rounded-full cursor-pointer", language === 'en' ? "bg-[#E05D3F] text-white font-bold" : "text-white/60")}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={cn("px-2 py-0.5 rounded-full cursor-pointer", language === 'hi' ? "bg-[#E05D3F] text-white font-bold" : "text-white/60")}
            >
              हिं
            </button>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            aria-label="Toggle Menu"
            className="text-white p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10 cursor-pointer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#2E2A5E] border-b border-white/10 px-5 py-5 absolute w-full left-0 top-full shadow-md min-h-[calc(100vh-50px)] flex flex-col justify-between overflow-y-auto">
          {!currentUser ? (
            <div className="flex flex-col space-y-2">
              <div className="text-[11px] uppercase tracking-widest text-white/40 font-bold px-3 pt-1">Navigation</div>
              {navItems.map(item => {
                const isActive = location.pathname === item.to;
                return (
                  <Link 
                    key={item.to}
                    to={item.to} 
                    className={cn(
                      "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors",
                      isActive 
                        ? "bg-[#E05D3F] text-white shadow-xs" 
                        : "text-white/90 hover:bg-white/5"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{item.label}</span>
                    <ChevronRight size={16} className={isActive ? "text-white" : "text-white/30"} />
                  </Link>
                );
              })}
              
              <Link 
                to="/faq" 
                className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-white/70 hover:bg-white/5"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Frequently Asked Questions (FAQ)</span>
                <ChevronRight size={14} className="text-white/30" />
              </Link>
              
              <div className="h-px bg-white/10 my-3 w-full"></div>
              
              <div className="flex flex-col gap-2.5 pb-6">
                 <Link 
                   to="/login" 
                   className="text-center font-bold text-white py-2.5 border border-white/20 rounded-xl hover:bg-white/5 text-sm" 
                   onClick={() => setMobileMenuOpen(false)}
                 >
                   Login to Account
                 </Link>
                 <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                   <Button className="w-full justify-center py-3 text-sm rounded-xl bg-[#E05D3F] font-bold border-none shadow-sm">
                     Sign Up for Free
                   </Button>
                 </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-2.5">
               <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                 <p className="font-bold text-lg text-white">{currentUser.name}</p>
                 <p className="text-xs text-[#F2A93B] font-bold uppercase tracking-wider mt-0.5">
                   {currentUser.role === 'clinic_staff' ? clinics[currentUser.clinicId!]?.name : 'Patient Portal'}
                 </p>
               </div>
               
               {/* 1. Main Website Home Link at top of mobile menu */}
               <Link 
                 to="/" 
                 className={cn(
                   "text-sm font-extrabold flex items-center justify-between p-3 rounded-xl transition-colors border",
                   location.pathname === '/' 
                     ? "bg-[#E05D3F] text-white border-transparent shadow-xs" 
                     : "bg-white/10 text-white hover:bg-white/15 border-white/10"
                 )}
                 onClick={() => setMobileMenuOpen(false)}
               >
                 <div className="flex items-center gap-2.5">
                   <Home size={18} className="text-[#E05D3F] bg-white p-0.5 rounded" />
                   <span>⌂ Main VacTrack Home</span>
                 </div>
                 <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/20">Public</span>
               </Link>

               {/* 2. Portal Dashboard */}
               <Link 
                 to={currentUser.role === 'patient' ? '/patient/dashboard' : '/clinic/dashboard'} 
                 className={cn(
                   "text-sm font-bold flex items-center justify-between p-3 rounded-xl transition-colors",
                   (location.pathname === '/patient/dashboard' || location.pathname === '/clinic/dashboard')
                     ? "bg-[#E05D3F] text-white shadow-xs" 
                     : "bg-white/5 text-white hover:text-[#E05D3F] hover:bg-white/10"
                 )}
                 onClick={() => setMobileMenuOpen(false)}
               >
                 <div className="flex items-center gap-2.5">
                   <ShieldCheck size={18} className="text-[#F2A93B]" />
                   <span>Portal Dashboard</span>
                 </div>
                 <ChevronRight size={16} />
               </Link>

               {/* 3. Patient Specific Navigation Links */}
               {currentUser.role === 'patient' && (
                 <div className="space-y-1 pt-1">
                   <Link 
                     to="/patient/vaccinations" 
                     className="text-xs font-semibold text-white/90 hover:text-[#E05D3F] flex items-center justify-between p-2.5 hover:bg-white/5 rounded-lg" 
                     onClick={() => setMobileMenuOpen(false)}
                   >
                     <div className="flex items-center gap-2">
                       <CheckCircle2 size={15} className="text-white/60" />
                       <span>My Vaccination</span>
                     </div>
                     <ChevronRight size={14} className="text-white/40" />
                   </Link>
                   <Link 
                     to="/patient/record" 
                     className="text-xs font-semibold text-white/90 hover:text-[#E05D3F] flex items-center justify-between p-2.5 hover:bg-white/5 rounded-lg" 
                     onClick={() => setMobileMenuOpen(false)}
                   >
                     <div className="flex items-center gap-2">
                       <Activity size={15} className="text-white/60" />
                       <span>My Health Record</span>
                     </div>
                     <ChevronRight size={14} className="text-white/40" />
                   </Link>
                   <Link 
                     to="/patient/appointments" 
                     className="text-xs font-semibold text-white/90 hover:text-[#E05D3F] flex items-center justify-between p-2.5 hover:bg-white/5 rounded-lg" 
                     onClick={() => setMobileMenuOpen(false)}
                   >
                     <div className="flex items-center gap-2">
                       <Calendar size={15} className="text-white/60" />
                       <span>Appointments</span>
                     </div>
                     <ChevronRight size={14} className="text-white/40" />
                   </Link>
                   <Link 
                     to="/patient/qr" 
                     className="text-xs font-semibold text-white/90 hover:text-[#E05D3F] flex items-center justify-between p-2.5 hover:bg-white/5 rounded-lg" 
                     onClick={() => setMobileMenuOpen(false)}
                   >
                     <div className="flex items-center gap-2">
                       <QrCode size={15} className="text-white/60" />
                       <span>QR Record</span>
                     </div>
                     <ChevronRight size={14} className="text-white/40" />
                   </Link>
                   <Link 
                     to="/patient/insurance" 
                     className="text-xs font-semibold text-white/90 hover:text-[#E05D3F] flex items-center justify-between p-2.5 hover:bg-white/5 rounded-lg" 
                     onClick={() => setMobileMenuOpen(false)}
                   >
                     <div className="flex items-center gap-2">
                       <Shield size={15} className="text-[#F2A93B]" />
                       <span>Insurance & Protection</span>
                     </div>
                     <ChevronRight size={14} className="text-white/40" />
                   </Link>
                   <Link 
                     to="/patient/emergency" 
                     className="text-xs font-semibold text-white/90 hover:text-[#E05D3F] flex items-center justify-between p-2.5 hover:bg-white/5 rounded-lg" 
                     onClick={() => setMobileMenuOpen(false)}
                   >
                     <div className="flex items-center gap-2">
                       <HeartPulse size={15} className="text-[#B91C1C]" />
                       <span>Emergency Care</span>
                     </div>
                     <ChevronRight size={14} className="text-white/40" />
                   </Link>
                   <Link 
                     to="/patient/hospitals" 
                     className="text-xs font-semibold text-white/90 hover:text-[#E05D3F] flex items-center justify-between p-2.5 hover:bg-white/5 rounded-lg" 
                     onClick={() => setMobileMenuOpen(false)}
                   >
                     <div className="flex items-center gap-2">
                       <Hospital size={15} className="text-white/60" />
                       <span>Nearby Hospitals</span>
                     </div>
                     <ChevronRight size={14} className="text-white/40" />
                   </Link>
                   <Link 
                     to="/patient/notifications" 
                     className="text-xs font-semibold text-white/90 hover:text-[#E05D3F] flex items-center justify-between p-2.5 hover:bg-white/5 rounded-lg" 
                     onClick={() => setMobileMenuOpen(false)}
                   >
                     <div className="flex items-center gap-2">
                       <Bell size={15} className="text-white/60" />
                       <span>Notifications</span>
                     </div>
                     <ChevronRight size={14} className="text-white/40" />
                   </Link>
                   <Link 
                     to="/patient/profile" 
                     className="text-xs font-semibold text-white/90 hover:text-[#E05D3F] flex items-center justify-between p-2.5 hover:bg-white/5 rounded-lg" 
                     onClick={() => setMobileMenuOpen(false)}
                   >
                     <div className="flex items-center gap-2">
                       <User size={15} className="text-white/60" />
                       <span>Profile</span>
                     </div>
                     <ChevronRight size={14} className="text-white/40" />
                   </Link>
                   <Link 
                     to="/patient/settings" 
                     className="text-xs font-semibold text-white/90 hover:text-[#E05D3F] flex items-center justify-between p-2.5 hover:bg-white/5 rounded-lg" 
                     onClick={() => setMobileMenuOpen(false)}
                   >
                     <div className="flex items-center gap-2">
                       <Settings size={15} className="text-white/60" />
                       <span>Settings</span>
                     </div>
                     <ChevronRight size={14} className="text-white/40" />
                   </Link>
                 </div>
               )}

               {/* 4. Clinic Specific Navigation Links */}
               {currentUser.role === 'clinic_staff' && (
                 <div className="space-y-1 pt-1">
                   <Link 
                     to="/clinic/patients" 
                     className="text-xs font-semibold text-white/90 hover:text-[#E05D3F] flex items-center justify-between p-2.5 hover:bg-white/5 rounded-lg" 
                     onClick={() => setMobileMenuOpen(false)}
                   >
                     <div className="flex items-center gap-2">
                       <Users size={15} className="text-white/60" />
                       <span>Patients</span>
                     </div>
                     <ChevronRight size={14} className="text-white/40" />
                   </Link>
                   <Link 
                     to="/clinic/record-dose" 
                     className="text-xs font-semibold text-white/90 hover:text-[#E05D3F] flex items-center justify-between p-2.5 hover:bg-white/5 rounded-lg" 
                     onClick={() => setMobileMenuOpen(false)}
                   >
                     <div className="flex items-center gap-2">
                       <Activity size={15} className="text-white/60" />
                       <span>Record Dose</span>
                     </div>
                     <ChevronRight size={14} className="text-white/40" />
                   </Link>
                   <Link 
                     to="/clinic/batch-verify" 
                     className="text-xs font-semibold text-white/90 hover:text-[#E05D3F] flex items-center justify-between p-2.5 hover:bg-white/5 rounded-lg" 
                     onClick={() => setMobileMenuOpen(false)}
                   >
                     <div className="flex items-center gap-2">
                       <PackageCheck size={15} className="text-white/60" />
                       <span>Batch Verification</span>
                     </div>
                     <ChevronRight size={14} className="text-white/40" />
                   </Link>
                   <Link 
                     to="/clinic/alerts" 
                     className="text-xs font-semibold text-white/90 hover:text-[#E05D3F] flex items-center justify-between p-2.5 hover:bg-white/5 rounded-lg" 
                     onClick={() => setMobileMenuOpen(false)}
                   >
                     <div className="flex items-center gap-2">
                       <AlertCircle size={15} className="text-white/60" />
                       <span>Alerts</span>
                     </div>
                     <ChevronRight size={14} className="text-white/40" />
                   </Link>
                   <Link 
                     to="/clinic/appointments" 
                     className="text-xs font-semibold text-white/90 hover:text-[#E05D3F] flex items-center justify-between p-2.5 hover:bg-white/5 rounded-lg" 
                     onClick={() => setMobileMenuOpen(false)}
                   >
                     <div className="flex items-center gap-2">
                       <Calendar size={15} className="text-white/60" />
                       <span>Appointments</span>
                     </div>
                     <ChevronRight size={14} className="text-white/40" />
                   </Link>
                   <Link 
                     to="/clinic/profile" 
                     className="text-xs font-semibold text-white/90 hover:text-[#E05D3F] flex items-center justify-between p-2.5 hover:bg-white/5 rounded-lg" 
                     onClick={() => setMobileMenuOpen(false)}
                   >
                     <div className="flex items-center gap-2">
                       <Building2 size={15} className="text-white/60" />
                       <span>Hospital Profile</span>
                     </div>
                     <ChevronRight size={14} className="text-white/40" />
                   </Link>
                   <Link 
                     to="/clinic/settings" 
                     className="text-xs font-semibold text-white/90 hover:text-[#E05D3F] flex items-center justify-between p-2.5 hover:bg-white/5 rounded-lg" 
                     onClick={() => setMobileMenuOpen(false)}
                   >
                     <div className="flex items-center gap-2">
                       <Settings size={15} className="text-white/60" />
                       <span>Settings</span>
                     </div>
                     <ChevronRight size={14} className="text-white/40" />
                   </Link>
                 </div>
               )}

               <button 
                 onClick={handleLogout} 
                 className="mt-4 text-xs font-bold text-[#FE8C8C] flex items-center gap-2 p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-pointer"
               >
                 <LogOut size={15} /> Logout Account
               </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

