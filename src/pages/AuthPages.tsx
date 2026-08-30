import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { Button } from '../components/ui/Button';
import { ShieldCheck, User, Building2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { translations } from '../utils/translations';

// ==========================================
// 1. LOGIN PAGE
// ==========================================
const DEMO_PATIENT_EMAIL = import.meta.env.VITE_DEMO_PATIENT_EMAIL || 'patient.demo@example.com';
const DEMO_HOSPITAL_EMAIL = import.meta.env.VITE_DEMO_HOSPITAL_EMAIL || 'hospital.demo@example.com';
const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD || 'demo-password';

export function Login() {
  const language = useAppStore(state => state.language);
  const t = translations[language] || translations.en;
  const [role, setRole] = useState<'patient' | 'hospital'>('patient');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAppStore(state => state.login);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Quick demo bypasses
    if (emailOrPhone.toLowerCase() === 'patient' || emailOrPhone === '9876543210') {
      login(DEMO_PATIENT_EMAIL, DEMO_PASSWORD);
      navigate('/patient/dashboard');
      return;
    }
    if (emailOrPhone.toLowerCase() === 'hospital' || emailOrPhone === 'clinic' || emailOrPhone === '9000010001') {
      login(DEMO_HOSPITAL_EMAIL, DEMO_PASSWORD);
      navigate('/clinic/dashboard');
      return;
    }

    const result = login(emailOrPhone, password);
    if (result.success) {
      if (result.account?.role === 'patient') {
        navigate('/patient/dashboard');
      } else {
        navigate('/clinic/dashboard');
      }
    } else {
      setError('Invalid credentials. Please verify your registered email/phone and password.');
    }
  };

  const fillDemoCredentials = (targetRole: 'patient' | 'hospital') => {
    setRole(targetRole);
    if (targetRole === 'patient') {
      setEmailOrPhone(DEMO_PATIENT_EMAIL);
      setPassword(DEMO_PASSWORD);
    } else {
      setEmailOrPhone(DEMO_HOSPITAL_EMAIL);
      setPassword(DEMO_PASSWORD);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F4F1] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-3xl shadow-sm border-2 border-[#EAE7E1] space-y-6">
        
        {/* Logo & Header */}
        <div className="text-center flex flex-col items-center">
          <Logo theme="light" showText={false} className="mb-3 transform scale-110" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#F6F4F1] text-[#E05D3F] border border-[#EAE7E1] mb-2">
            <ShieldCheck size={13} className="text-[#1B7A3D]" /> Verified Network Portal
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#2E2A5E]">{t.loginTitle}</h2>
          <p className="text-[#6B6560] text-xs mt-1">{t.loginSubtitle}</p>
        </div>

        {/* Role Switcher */}
        <div className="flex p-1.5 bg-[#F6F4F1] border border-[#EAE7E1] rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('patient')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              role === 'patient' 
                ? 'bg-white shadow-xs text-[#2E2A5E] border border-[#EAE7E1]' 
                : 'text-[#6B6560] hover:text-[#2E2A5E]'
            }`}
          >
            <User size={15} className={role === 'patient' ? 'text-[#E05D3F]' : ''} /> {t.loginAsPatient}
          </button>
          <button
            type="button"
            onClick={() => setRole('hospital')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              role === 'hospital' 
                ? 'bg-white shadow-xs text-[#2E2A5E] border border-[#EAE7E1]' 
                : 'text-[#6B6560] hover:text-[#2E2A5E]'
            }`}
          >
            <Building2 size={15} className={role === 'hospital' ? 'text-[#2E2A5E]' : ''} /> {t.loginAsHospital}
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA] rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-[#B91C1C]" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] mb-1.5">
              {role === 'patient' ? 'Registered Email or Mobile' : 'Hospital Email or ID'}
            </label>
            <input 
              required 
              type="text" 
              className="w-full p-3 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-xs font-semibold outline-none focus:border-[#E05D3F] focus:bg-white text-[#231F20] transition-colors" 
              value={emailOrPhone} 
              onChange={e => setEmailOrPhone(e.target.value)} 
              placeholder={role === 'patient' ? 'e.g. 9876543210 or email' : 'e.g. hospital.demo@example.com'}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E]">
                Password
              </label>
              <Link to="/forgot-password" className="text-[11px] font-bold text-[#E05D3F] hover:underline">
                Forgot Password?
              </Link>
            </div>
            <input 
              required 
              type="password" 
              className="w-full p-3 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-xs font-semibold outline-none focus:border-[#E05D3F] focus:bg-white text-[#231F20] transition-colors" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full py-3.5 rounded-xl font-bold text-sm shadow-xs flex items-center justify-center gap-2">
            Sign In to {role === 'patient' ? 'Patient Portal' : 'Hospital Portal'} <ArrowRight size={16} />
          </Button>
        </form>

        {/* Sign Up Redirect */}
        <div className="text-center text-xs text-[#55504D] pt-2 border-t border-[#EAE7E1]">
          <span>Don&apos;t have a verified account yet? </span>
          <Link to="/signup" className="font-extrabold text-[#E05D3F] hover:underline">
            Sign Up Here
          </Link>
        </div>

        {/* Demo Quick Access */}
        <div className="pt-3 border-t border-[#EAE7E1] text-center space-y-2">
          <span className="text-[10px] text-[#8A847F] font-extrabold uppercase tracking-widest block">
            Instant Demo Quick-Access
          </span>
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={() => fillDemoCredentials('patient')} 
              className="flex-1 py-2 bg-[#F6F4F1] hover:bg-[#EAE7E1] text-[#2E2A5E] text-xs font-bold rounded-xl border border-[#EAE7E1] transition-colors cursor-pointer"
            >
              👤 Patient Demo
            </button>
            <button 
              type="button"
              onClick={() => fillDemoCredentials('hospital')} 
              className="flex-1 py-2 bg-[#F6F4F1] hover:bg-[#EAE7E1] text-[#2E2A5E] text-xs font-bold rounded-xl border border-[#EAE7E1] transition-colors cursor-pointer"
            >
              🏥 Hospital Demo
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 2. SIGN UP PAGE
// ==========================================
export function Signup() {
  const language = useAppStore(state => state.language);
  const t = translations[language] || translations.en;
  const [role, setRole] = useState<'patient' | 'hospital'>('patient');
  const signup = useAppStore(state => state.signup);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  // Patient State
  const [patientForm, setPatientForm] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    bloodGroup: 'O+',
    city: '',
    state: 'Maharashtra',
    pinCode: '',
    password: '',
    confirmPassword: ''
  });

  // Hospital State
  const [hospitalForm, setHospitalForm] = useState({
    hospitalName: '',
    hospitalId: '',
    licenseNumber: '',
    hospitalPhone: '',
    hospitalEmail: '',
    hospitalAddress: '',
    city: '',
    state: 'Maharashtra',
    pinCode: '',
    hospitalType: 'Government Hospital',
    hasEmergencyDept: true,
    is24x7: true,
    password: '',
    confirmPassword: ''
  });

  const HOSPITAL_TYPES = [
    'Government Hospital',
    'Private Hospital',
    'Community Health Centre',
    'Primary Health Centre',
    'Specialty Hospital',
    'Emergency Care Centre'
  ];

  const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (role === 'patient') {
      if (!patientForm.city.trim()) {
        setError('City is a mandatory field for patient registration.');
        return;
      }
      if (patientForm.password !== patientForm.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      signup(
        {
          name: patientForm.name,
          email: patientForm.email,
          phone: patientForm.phone,
          passwordHash: patientForm.password,
          role: 'patient',
          city: patientForm.city
        },
        {
          dob: patientForm.dob,
          city: patientForm.city,
          state: patientForm.state,
          pinCode: patientForm.pinCode,
          bloodGroup: patientForm.bloodGroup
        }
      );
    } else {
      if (!hospitalForm.city.trim()) {
        setError('City is a mandatory field for hospital onboarding.');
        return;
      }
      if (hospitalForm.password !== hospitalForm.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      signup(
        {
          name: hospitalForm.hospitalName,
          email: hospitalForm.hospitalEmail,
          phone: hospitalForm.hospitalPhone,
          passwordHash: hospitalForm.password,
          role: 'clinic_staff',
          city: hospitalForm.city
        },
        undefined,
        {
          name: hospitalForm.hospitalName,
          licenseNumber: hospitalForm.licenseNumber || hospitalForm.hospitalId,
          phone: hospitalForm.hospitalPhone,
          email: hospitalForm.hospitalEmail,
          address: hospitalForm.hospitalAddress,
          city: hospitalForm.city,
          state: hospitalForm.state,
          pinCode: hospitalForm.pinCode,
          hospitalType: hospitalForm.hospitalType,
          is24x7: hospitalForm.is24x7,
          hasEmergencyDept: hospitalForm.hasEmergencyDept
        }
      );
    }

    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F4F1] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white p-6 sm:p-10 rounded-3xl shadow-sm border-2 border-[#EAE7E1] space-y-6">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center">
          <Logo theme="light" showText={false} className="mb-3 transform scale-110" />
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#2E2A5E]">{t.signupTitle}</h2>
          <p className="text-[#6B6560] text-xs mt-1">{t.signupSubtitle}</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex p-1.5 bg-[#F6F4F1] border border-[#EAE7E1] rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('patient')}
            className={`flex-1 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              role === 'patient' 
                ? 'bg-white shadow-xs text-[#2E2A5E] border border-[#EAE7E1]' 
                : 'text-[#6B6560] hover:text-[#2E2A5E]'
            }`}
          >
            <User size={16} className={role === 'patient' ? 'text-[#E05D3F]' : ''} /> {t.patientRole}
          </button>
          <button
            type="button"
            onClick={() => setRole('hospital')}
            className={`flex-1 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              role === 'hospital' 
                ? 'bg-white shadow-xs text-[#2E2A5E] border border-[#EAE7E1]' 
                : 'text-[#6B6560] hover:text-[#2E2A5E]'
            }`}
          >
            <Building2 size={16} className={role === 'hospital' ? 'text-[#2E2A5E]' : ''} /> {t.hospitalRole}
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA] rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-[#B91C1C]" />
            <span>{error}</span>
          </div>
        )}

        {/* Dynamic Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {/* PATIENT SIGN UP FORM */}
          {role === 'patient' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] mb-1">
                    Full Name <span className="text-[#E05D3F]">*</span>
                  </label>
                  <input 
                    required 
                    type="text" 
                    value={patientForm.name} 
                    onChange={e => setPatientForm({...patientForm, name: e.target.value})} 
                    placeholder="e.g. Aarav Sharma" 
                    className="w-full p-2.5 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-xs font-semibold outline-none focus:border-[#E05D3F] focus:bg-white text-[#231F20]" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] mb-1">
                    Email Address <span className="text-[#E05D3F]">*</span>
                  </label>
                  <input 
                    required 
                    type="email" 
                    value={patientForm.email} 
                    onChange={e => setPatientForm({...patientForm, email: e.target.value})} 
                    placeholder="aarav@example.com" 
                    className="w-full p-2.5 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-xs font-semibold outline-none focus:border-[#E05D3F] focus:bg-white text-[#231F20]" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] mb-1">
                    Phone Number <span className="text-[#E05D3F]">*</span>
                  </label>
                  <input 
                    required 
                    type="tel" 
                    value={patientForm.phone} 
                    onChange={e => setPatientForm({...patientForm, phone: e.target.value})} 
                    placeholder="9876543210" 
                    className="w-full p-2.5 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-xs font-semibold outline-none focus:border-[#E05D3F] focus:bg-white text-[#231F20]" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] mb-1">
                    Date of Birth <span className="text-[#E05D3F]">*</span>
                  </label>
                  <input 
                    required 
                    type="date" 
                    value={patientForm.dob} 
                    onChange={e => setPatientForm({...patientForm, dob: e.target.value})} 
                    className="w-full p-2.5 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-xs font-semibold outline-none focus:border-[#E05D3F] focus:bg-white text-[#231F20]" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] mb-1">
                    Blood Group <span className="text-[#E05D3F]">*</span>
                  </label>
                  <select 
                    required 
                    value={patientForm.bloodGroup} 
                    onChange={e => setPatientForm({...patientForm, bloodGroup: e.target.value})} 
                    className="w-full p-2.5 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-xs font-semibold outline-none focus:border-[#E05D3F] focus:bg-white text-[#231F20]"
                  >
                    {BLOOD_GROUPS.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] mb-1">
                    City <span className="text-[#E05D3F]">* (Mandatory)</span>
                  </label>
                  <input 
                    required 
                    type="text" 
                    value={patientForm.city} 
                    onChange={e => setPatientForm({...patientForm, city: e.target.value})} 
                    placeholder="e.g. Pune" 
                    className="w-full p-2.5 bg-[#F6F4F1] border-2 border-[#E05D3F]/40 rounded-xl text-xs font-semibold outline-none focus:border-[#E05D3F] focus:bg-white text-[#231F20]" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] mb-1">
                    State <span className="text-[#E05D3F]">*</span>
                  </label>
                  <input 
                    required 
                    type="text" 
                    value={patientForm.state} 
                    onChange={e => setPatientForm({...patientForm, state: e.target.value})} 
                    placeholder="Maharashtra" 
                    className="w-full p-2.5 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-xs font-semibold outline-none focus:border-[#E05D3F] focus:bg-white text-[#231F20]" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] mb-1">
                    PIN Code <span className="text-[#E05D3F]">*</span>
                  </label>
                  <input 
                    required 
                    type="text" 
                    value={patientForm.pinCode} 
                    onChange={e => setPatientForm({...patientForm, pinCode: e.target.value})} 
                    placeholder="411005" 
                    className="w-full p-2.5 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-xs font-semibold outline-none focus:border-[#E05D3F] focus:bg-white text-[#231F20]" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] mb-1">
                    Password <span className="text-[#E05D3F]">*</span>
                  </label>
                  <input 
                    required 
                    type="password" 
                    value={patientForm.password} 
                    onChange={e => setPatientForm({...patientForm, password: e.target.value})} 
                    placeholder="••••••••" 
                    className="w-full p-2.5 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-xs font-semibold outline-none focus:border-[#E05D3F] focus:bg-white text-[#231F20]" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] mb-1">
                    Confirm Password <span className="text-[#E05D3F]">*</span>
                  </label>
                  <input 
                    required 
                    type="password" 
                    value={patientForm.confirmPassword} 
                    onChange={e => setPatientForm({...patientForm, confirmPassword: e.target.value})} 
                    placeholder="••••••••" 
                    className="w-full p-2.5 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-xs font-semibold outline-none focus:border-[#E05D3F] focus:bg-white text-[#231F20]" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* HOSPITAL SIGN UP FORM */}
          {role === 'hospital' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] mb-1">
                    Hospital Name <span className="text-[#E05D3F]">*</span>
                  </label>
                  <input 
                    required 
                    type="text" 
                    value={hospitalForm.hospitalName} 
                    onChange={e => setHospitalForm({...hospitalForm, hospitalName: e.target.value})} 
                    placeholder="e.g. Shivajinagar Emergency Centre" 
                    className="w-full p-2.5 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-xs font-semibold outline-none focus:border-[#E05D3F] focus:bg-white text-[#231F20]" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] mb-1">
                    Hospital ID <span className="text-[#E05D3F]">*</span>
                  </label>
                  <input 
                    required 
                    type="text" 
                    value={hospitalForm.hospitalId} 
                    onChange={e => setHospitalForm({...hospitalForm, hospitalId: e.target.value})} 
                    placeholder="HOSP-DEMO-001" 
                    className="w-full p-2.5 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-xs font-semibold outline-none focus:border-[#E05D3F] focus:bg-white text-[#231F20]" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] mb-1">
                    Reg. / License No. <span className="text-[#E05D3F]">*</span>
                  </label>
                  <input 
                    required 
                    type="text" 
                    value={hospitalForm.licenseNumber} 
                    onChange={e => setHospitalForm({...hospitalForm, licenseNumber: e.target.value})} 
                    placeholder="MH-MC-88201" 
                    className="w-full p-2.5 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-xs font-semibold outline-none focus:border-[#E05D3F] focus:bg-white text-[#231F20]" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] mb-1">
                    Hospital Phone <span className="text-[#E05D3F]">*</span>
                  </label>
                  <input 
                    required 
                    type="tel" 
                    value={hospitalForm.hospitalPhone} 
                    onChange={e => setHospitalForm({...hospitalForm, hospitalPhone: e.target.value})} 
                    placeholder="+91 90000 10001" 
                    className="w-full p-2.5 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-xs font-semibold outline-none focus:border-[#E05D3F] focus:bg-white text-[#231F20]" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] mb-1">
                    Hospital Email <span className="text-[#E05D3F]">*</span>
                  </label>
                  <input 
                    required 
                    type="email" 
                    value={hospitalForm.hospitalEmail} 
                    onChange={e => setHospitalForm({...hospitalForm, hospitalEmail: e.target.value})} 
                    placeholder="admin@hospital.org" 
                    className="w-full p-2.5 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-xs font-semibold outline-none focus:border-[#E05D3F] focus:bg-white text-[#231F20]" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] mb-1">
                  Hospital Address <span className="text-[#E05D3F]">*</span>
                </label>
                <input 
                  required 
                  type="text" 
                  value={hospitalForm.hospitalAddress} 
                  onChange={e => setHospitalForm({...hospitalForm, hospitalAddress: e.target.value})} 
                  placeholder="Street / Area Address" 
                  className="w-full p-2.5 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-xs font-semibold outline-none focus:border-[#E05D3F] focus:bg-white text-[#231F20]" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] mb-1">
                    City <span className="text-[#E05D3F]">*</span>
                  </label>
                  <input 
                    required 
                    type="text" 
                    value={hospitalForm.city} 
                    onChange={e => setHospitalForm({...hospitalForm, city: e.target.value})} 
                    placeholder="e.g. Pune" 
                    className="w-full p-2.5 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-xs font-semibold outline-none focus:border-[#E05D3F] focus:bg-white text-[#231F20]" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] mb-1">
                    State <span className="text-[#E05D3F]">*</span>
                  </label>
                  <input 
                    required 
                    type="text" 
                    value={hospitalForm.state} 
                    onChange={e => setHospitalForm({...hospitalForm, state: e.target.value})} 
                    placeholder="Maharashtra" 
                    className="w-full p-2.5 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-xs font-semibold outline-none focus:border-[#E05D3F] focus:bg-white text-[#231F20]" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] mb-1">
                    PIN Code <span className="text-[#E05D3F]">*</span>
                  </label>
                  <input 
                    required 
                    type="text" 
                    value={hospitalForm.pinCode} 
                    onChange={e => setHospitalForm({...hospitalForm, pinCode: e.target.value})} 
                    placeholder="411005" 
                    className="w-full p-2.5 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-xs font-semibold outline-none focus:border-[#E05D3F] focus:bg-white text-[#231F20]" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] mb-1">
                  Hospital Type <span className="text-[#E05D3F]">*</span>
                </label>
                <select 
                  required 
                  value={hospitalForm.hospitalType} 
                  onChange={e => setHospitalForm({...hospitalForm, hospitalType: e.target.value})} 
                  className="w-full p-2.5 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-xs font-semibold outline-none focus:border-[#E05D3F] focus:bg-white text-[#231F20]"
                >
                  {HOSPITAL_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#F6F4F1] rounded-xl border border-[#EAE7E1]">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#2E2A5E]">
                  <input 
                    type="checkbox" 
                    checked={hospitalForm.hasEmergencyDept} 
                    onChange={e => setHospitalForm({...hospitalForm, hasEmergencyDept: e.target.checked})} 
                    className="w-4 h-4 accent-[#E05D3F] rounded" 
                  />
                  Emergency Department Available
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#2E2A5E]">
                  <input 
                    type="checkbox" 
                    checked={hospitalForm.is24x7} 
                    onChange={e => setHospitalForm({...hospitalForm, is24x7: e.target.checked})} 
                    className="w-4 h-4 accent-[#E05D3F] rounded" 
                  />
                  24/7 Emergency Service Active
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] mb-1">
                    Password <span className="text-[#E05D3F]">*</span>
                  </label>
                  <input 
                    required 
                    type="password" 
                    value={hospitalForm.password} 
                    onChange={e => setHospitalForm({...hospitalForm, password: e.target.value})} 
                    placeholder="••••••••" 
                    className="w-full p-2.5 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-xs font-semibold outline-none focus:border-[#E05D3F] focus:bg-white text-[#231F20]" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#2E2A5E] mb-1">
                    Confirm Password <span className="text-[#E05D3F]">*</span>
                  </label>
                  <input 
                    required 
                    type="password" 
                    value={hospitalForm.confirmPassword} 
                    onChange={e => setHospitalForm({...hospitalForm, confirmPassword: e.target.value})} 
                    placeholder="••••••••" 
                    className="w-full p-2.5 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-xs font-semibold outline-none focus:border-[#E05D3F] focus:bg-white text-[#231F20]" 
                  />
                </div>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full py-3.5 rounded-xl font-bold text-sm shadow-xs mt-4">
            Complete {role === 'patient' ? 'Patient Registration' : 'Hospital Onboarding'}
          </Button>
        </form>

        <div className="text-center text-xs text-[#55504D] pt-2 border-t border-[#EAE7E1]">
          <span>Already have a verified account? </span>
          <Link to="/login" className="font-extrabold text-[#E05D3F] hover:underline">
            Log in here
          </Link>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 3. FORGOT PASSWORD PAGE
// ==========================================
export function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
  const [inputVal, setInputVal] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F4F1] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-3xl shadow-sm border-2 border-[#EAE7E1] text-center flex flex-col items-center space-y-4">
        <Logo theme="light" showText={false} className="transform scale-110" />
        <h2 className="text-2xl font-heading font-extrabold text-[#2E2A5E]">Reset Password</h2>
        <p className="text-[#6B6560] text-xs leading-relaxed">
          Enter your registered mobile or email to receive an instant verification link.
        </p>

        {submitted ? (
          <div className="p-4 bg-[#EBF7EE] text-[#1B7A3D] rounded-xl border border-[#C8E6C9] text-xs font-semibold w-full flex items-center gap-2">
            <CheckCircle size={16} className="shrink-0" />
            <span>Reset link sent to <strong>{inputVal}</strong>. Please check your messages.</span>
          </div>
        ) : (
          <form 
            className="w-full space-y-4" 
            onSubmit={e => {
              e.preventDefault();
              if (inputVal) setSubmitted(true);
            }}
          >
            <input 
              required
              type="text" 
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              className="w-full p-3 bg-[#F6F4F1] border border-[#EAE7E1] rounded-xl text-xs font-semibold outline-none focus:border-[#E05D3F] text-[#231F20]" 
              placeholder="Registered Email or 10-digit Phone" 
            />
            <Button type="submit" className="w-full py-3 rounded-xl font-bold text-xs">
              Send Reset Instructions
            </Button>
          </form>
        )}

        <Link to="/login" className="text-xs font-extrabold text-[#E05D3F] hover:underline pt-2">
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}
