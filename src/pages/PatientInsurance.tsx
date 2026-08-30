import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { InsurancePolicy, InsuranceInquiry } from '../types';
import { 
  Shield, ShieldCheck, HeartHandshake, CheckCircle2, 
  HelpCircle, ArrowRight, X, Phone, Mail, MessageSquare, 
  Clock, Lock, FileText, Sparkles, User, MapPin, 
  Calendar, Check, AlertCircle, Info, Trash2, ExternalLink,
  Landmark, Hospital
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { format, parseISO } from 'date-fns';
import { GovernmentSchemesDiscovery } from '../components/GovernmentSchemes/GovernmentSchemesDiscovery';
import { SchemeEligibilityWizard } from '../components/GovernmentSchemes/SchemeEligibilityWizard';
import { SchemeDetailModal } from '../components/GovernmentSchemes/SchemeDetailModal';
import { EmpanelledHospitalsModal } from '../components/GovernmentSchemes/EmpanelledHospitalsModal';
import { GovernmentScheme } from '../data/governmentSchemesData';

const DEMO_POLICIES: InsurancePolicy[] = [
  {
    id: 'sec_life_50l',
    provider: 'SecureLife Insurance — DEMO',
    name: 'SecureLife Family Protection',
    planType: 'Life Cover',
    coverAmount: '₹50 Lakh',
    startingFrom: '₹599 / month*',
    badge: 'Popular Family Choice',
    highlights: [
      'Family financial protection',
      'Flexible coverage options',
      'Multiple policy terms'
    ],
    keyBenefits: [
      'High life cover with affordable monthly contributions',
      'Terminal illness benefit included at no extra cost (Demo)',
      'Tax benefits under applicable Indian income tax provisions (Demo)',
      'Flexible payout options (Lump sum or monthly income to nominees)',
      '30-day free-look period with zero penalty'
    ],
    policyTerm: '10 to 40 Years (Customizable)',
    eligibility: 'Entry age: 18 to 65 years. Resident of India or NRI.',
    importantNotes: '*Illustrative information only. Actual eligibility, premiums, benefits and terms depend on the insurer.'
  },
  {
    id: 'future_shield_1cr',
    provider: 'FutureShield Life — DEMO',
    name: 'FutureShield Life Plan',
    planType: 'Life Cover',
    coverAmount: '₹1 Crore',
    badge: 'High Cover Value',
    startingFrom: '₹899 / month*',
    highlights: [
      'Long-term protection',
      'Flexible policy duration',
      'Family-oriented coverage'
    ],
    keyBenefits: [
      'Comprehensive ₹1 Crore life insurance umbrella for key earners',
      'Accidental disability & critical illness rider option available',
      'Return of premium option at policy maturity (Optional rider)',
      'Quick paperless inquiry and online digital consultation',
      'Special discounted rates for non-tobacco users'
    ],
    policyTerm: '15 to 45 Years',
    eligibility: 'Entry age: 18 to 60 years. Salaried & self-employed individuals.',
    importantNotes: '*Illustrative information only. Actual eligibility, premiums, benefits and terms depend on the insurer.'
  },
  {
    id: 'family_guard_25l',
    provider: 'FamilyGuard Protection — DEMO',
    name: 'FamilyGuard Protection Plan',
    planType: 'Life Cover',
    coverAmount: '₹25 Lakh',
    badge: 'Affordable Starter',
    startingFrom: '₹349 / month*',
    highlights: [
      'Family protection',
      'Multiple coverage options',
      'Simple inquiry process'
    ],
    keyBenefits: [
      'Essential starter life cover for young earners and growing families',
      'Guaranteed renewal with simplified health declaration process',
      'Immediate emergency payout support for nominees during claims',
      'No complex paperwork — fast digital verification',
      'Nominee assistance service included'
    ],
    policyTerm: '5 to 30 Years',
    eligibility: 'Entry age: 18 to 65 years. Open to all Indian citizens.',
    importantNotes: '*Illustrative information only. Actual eligibility, premiums, benefits and terms depend on the insurer.'
  },
  {
    id: 'careplus_75l',
    provider: 'CarePlus Assurance — DEMO',
    name: 'CarePlus Life & Health Shield',
    planType: 'Life & Critical Health Cover',
    coverAmount: '₹75 Lakh',
    badge: 'Health & Life Combo',
    startingFrom: '₹749 / month*',
    highlights: [
      'Dual life & critical health safety net',
      'Cashless hospital network guidance',
      'Family floater compatibility'
    ],
    keyBenefits: [
      'Combined term life cover + 36 critical illnesses protection rider',
      'Cashless consultation network support across 4,000+ facilities (Demo)',
      'Premium waiver in case of accidental permanent disability',
      'Double life cover payout in case of accidental demise',
      'Annual preventive health checkup voucher included (Demo)'
    ],
    policyTerm: '10 to 35 Years',
    eligibility: 'Entry age: 18 to 62 years.',
    importantNotes: '*Illustrative information only. Actual eligibility, premiums, benefits and terms depend on the insurer.'
  }
];

export function PatientInsurance() {
  const navigate = useNavigate();
  const { currentPatientId, patients, currentUser, insuranceInquiries, submitInsuranceInquiry, cancelInsuranceInquiry } = useAppStore();

  const patient = (currentPatientId && patients[currentPatientId]) ? patients[currentPatientId] : {
    id: 'p_demo_1',
    name: currentUser?.name || 'Harsh Tyagi',
    email: currentUser?.email || 'patient.demo@example.com',
    phone: currentUser?.phone || '07387513560',
    city: currentUser?.city || 'Pune',
    dob: '2004-04-02'
  };

  const [activeTab, setActiveTab] = useState<'plans' | 'inquiries' | 'faqs' | 'schemes'>('plans');
  const [isEligibilityWizardOpen, setIsEligibilityWizardOpen] = useState(false);
  const [selectedPolicyForDetails, setSelectedPolicyForDetails] = useState<InsurancePolicy | null>(null);
  const [selectedPolicyForInquiry, setSelectedPolicyForInquiry] = useState<InsurancePolicy | null>(null);
  const [submittedInquiryData, setSubmittedInquiryData] = useState<InsuranceInquiry | null>(null);

  // Inquiry Form State
  const [formData, setFormData] = useState({
    fullName: patient.name || 'Harsh Tyagi',
    email: patient.email || 'patient.demo@example.com',
    phone: patient.phone || '07387513560',
    city: patient.city || 'Pune',
    dob: patient.dob || '2004-04-02',
    preferredContact: 'WhatsApp' as 'Phone Call' | 'Email' | 'WhatsApp',
    interestedCoverage: '₹50 Lakh',
    bestTimeToContact: '12:00 PM – 03:00 PM',
    agreedToTerms: false
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleOpenInquiry = (policy: InsurancePolicy) => {
    setSelectedPolicyForDetails(null);
    setSelectedPolicyForInquiry(policy);
    setSubmittedInquiryData(null);
    setFormData(prev => ({
      ...prev,
      fullName: prev.fullName || patient.name || 'Harsh Tyagi',
      email: prev.email || patient.email || 'patient.demo@example.com',
      phone: prev.phone || patient.phone || '07387513560',
      city: prev.city || patient.city || 'Pune',
      dob: prev.dob || patient.dob || '2004-04-02',
      interestedCoverage: policy.coverAmount || '₹50 Lakh',
      agreedToTerms: false
    }));
    setFormErrors({});
  };

  const handleCloseDrawer = () => {
    setSelectedPolicyForInquiry(null);
    setSubmittedInquiryData(null);
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = 'Valid Email is required';
    if (!formData.phone.trim() || formData.phone.length < 8) errors.phone = 'Valid Phone Number is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.agreedToTerms) errors.agreedToTerms = 'You must agree to be contacted regarding this inquiry';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (!selectedPolicyForInquiry) return;

    const newId = `INS-DEMO-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInquiry: InsuranceInquiry = {
      id: newId,
      patientId: patient.id,
      policyId: selectedPolicyForInquiry.id,
      policyName: selectedPolicyForInquiry.name,
      providerName: selectedPolicyForInquiry.provider,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      dob: formData.dob,
      preferredContact: formData.preferredContact,
      interestedCoverage: formData.interestedCoverage,
      bestTimeToContact: formData.bestTimeToContact,
      status: 'Inquiry Submitted',
      submittedAt: new Date().toISOString()
    };

    submitInsuranceInquiry(newInquiry);
    setSubmittedInquiryData(newInquiry);
  };

  const userInquiries = (insuranceInquiries || []).filter(
    item => !item.patientId || item.patientId === patient.id || item.patientId === 'p_demo_1'
  );

  return (
    <div className="bg-[#F6F4F1] min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">

        {/* SECTION HEADER */}
        <header className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#EAE7E1] shadow-xs space-y-4 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-[#E05D3F]/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#F6F4F1] text-[#E05D3F] border border-[#EAE7E1]">
                <Shield size={13} className="text-[#E05D3F]" /> Optional • Independent Insurance Offers
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-[#2E2A5E]">
                Protect What Matters
              </h1>
              <p className="text-[#55504D] text-sm sm:text-base max-w-2xl leading-relaxed">
                Explore life insurance and financial protection options that may help you and your family prepare for the future.
              </p>
            </div>

            {/* Navigation tabs */}
            <div className="flex items-center bg-[#F6F4F1] p-1.5 rounded-2xl border border-[#EAE7E1] shrink-0 self-start sm:self-center">
              <button
                onClick={() => setActiveTab('plans')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === 'plans' 
                    ? 'bg-white text-[#2E2A5E] shadow-xs' 
                    : 'text-[#6B6560] hover:text-[#2E2A5E]'
                }`}
              >
                Available Plans
              </button>
              <button
                onClick={() => setActiveTab('inquiries')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'inquiries' 
                    ? 'bg-white text-[#2E2A5E] shadow-xs' 
                    : 'text-[#6B6560] hover:text-[#2E2A5E]'
                }`}
              >
                <span>My Inquiries</span>
                {userInquiries.length > 0 && (
                  <span className="bg-[#E05D3F] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {userInquiries.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('faqs')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === 'faqs' 
                    ? 'bg-white text-[#2E2A5E] shadow-xs' 
                    : 'text-[#6B6560] hover:text-[#2E2A5E]'
                }`}
              >
                FAQ & Privacy
              </button>
              <button
                onClick={() => setActiveTab('schemes')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'schemes' 
                    ? 'bg-white text-[#2E2A5E] shadow-xs' 
                    : 'text-[#6B6560] hover:text-[#2E2A5E]'
                }`}
              >
                <Landmark size={14} className="text-[#E05D3F]" />
                <span>Govt Schemes</span>
              </button>
            </div>
          </div>

          {/* Privacy & Discretion Reassurance Box */}
          <div className="p-3.5 bg-[#FFFBEB] rounded-2xl border border-[#FDE68A] flex items-start gap-3 text-xs text-[#92400E]">
            <Lock size={16} className="text-[#D97706] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold">Strict Privacy Policy:</span> Your medical records, vaccination dates, and hospital history are kept completely private and are <strong>NEVER automatically shared</strong> with any insurance provider. Submitting an inquiry is 100% optional.
            </div>
          </div>
        </header>

        {/* TAB 4: GOVT SCHEMES */}
        {activeTab === 'schemes' && (
          <GovernmentSchemesDiscovery 
            onOpenEligibilityWizard={() => setIsEligibilityWizardOpen(true)} 
          />
        )}

        {/* TAB 1: AVAILABLE PLANS */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
              <div>
                <h2 className="text-lg font-heading font-extrabold text-[#2E2A5E]">
                  Featured Independent Protection Plans
                </h2>
                <p className="text-xs text-[#6B6560]">
                  Select any policy below to inspect terms or request a callback from an authorized representative.
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#8A847F] bg-white px-3 py-1 rounded-full border border-[#EAE7E1] self-start sm:self-auto">
                Showing {DEMO_POLICIES.length} Demo Products
              </span>
            </div>

            {/* POLICY CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DEMO_POLICIES.map((policy) => (
                <div 
                  key={policy.id}
                  className="bg-white rounded-3xl border-2 border-[#EAE7E1] hover:border-[#E05D3F]/60 transition-all p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-6 group hover:shadow-md relative"
                >
                  <div className="space-y-4">
                    {/* Provider & Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A847F] block">
                          {policy.provider}
                        </span>
                        <h3 className="text-xl font-heading font-extrabold text-[#2E2A5E] group-hover:text-[#E05D3F] transition-colors">
                          {policy.name}
                        </h3>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="bg-[#FEF3F2] text-[#E05D3F] border border-[#FECDCA] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                          Demo Policy
                        </span>
                        {policy.badge && (
                          <span className="bg-[#F6F4F1] text-[#2E2A5E] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#EAE7E1]">
                            {policy.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Coverage & Price Highlights */}
                    <div className="bg-[#F6F4F1] p-4 rounded-2xl border border-[#EAE7E1] grid grid-cols-2 gap-3 items-center">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#6B6560] block">
                          {policy.planType}
                        </span>
                        <span className="text-2xl font-black text-[#2E2A5E]">
                          {policy.coverAmount}
                        </span>
                      </div>
                      <div className="text-right border-l border-[#EAE7E1] pl-3">
                        <span className="text-[10px] uppercase font-bold text-[#6B6560] block">
                          Starting from:
                        </span>
                        <span className="text-sm font-extrabold text-[#E05D3F]">
                          {policy.startingFrom}
                        </span>
                      </div>
                    </div>

                    {/* Highlights List */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-[#2E2A5E] block">
                        Highlights:
                      </span>
                      <ul className="space-y-1.5 text-xs text-[#55504D]">
                        {policy.highlights.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-[#EBF7EE] text-[#1B7A3D] flex items-center justify-center shrink-0">
                              <Check size={11} />
                            </div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions & Disclaimer */}
                  <div className="space-y-3 pt-2 border-t border-[#EAE7E1]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setSelectedPolicyForDetails(policy)}
                        className="w-full py-2.5 text-xs font-bold rounded-xl border-[#EAE7E1] hover:bg-[#F6F4F1] text-[#2E2A5E]"
                      >
                        View Details
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleOpenInquiry(policy)}
                        className="w-full py-2.5 text-xs font-bold rounded-xl bg-[#E05D3F] hover:bg-[#c94f33] text-white shadow-xs"
                      >
                        I'm Interested
                      </Button>
                    </div>

                    <p className="text-[10px] text-[#8A847F] leading-tight italic text-center">
                      *Illustrative information only. Actual eligibility, premiums, benefits and terms depend on the insurer.
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* BOTTOM EDUCATIONAL BANNER */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#EAE7E1] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#2E2A5E]">
                  <HeartHandshake size={16} className="text-[#E05D3F]" /> Holistic Family Safety
                </div>
                <h3 className="text-xl font-heading font-extrabold text-[#2E2A5E]">
                  Vaccines Safeguard Your Health. Insurance Safeguards Your Future.
                </h3>
                <p className="text-xs sm:text-sm text-[#6B6560] max-w-2xl leading-relaxed">
                  While VacTrack guarantees your medical and vaccination records are always available during emergencies, life protection plans ensure your dependents are supported through unforeseen financial contingencies.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('inquiries')}
                className="bg-[#2E2A5E] hover:bg-[#1f1c42] text-white text-xs font-extrabold px-6 py-3.5 rounded-2xl shrink-0 transition-colors shadow-xs cursor-pointer"
              >
                Track My Inquiries ({userInquiries.length})
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: MY INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
              <div>
                <h2 className="text-lg font-heading font-extrabold text-[#2E2A5E]">
                  Insurance Inquiries
                </h2>
                <p className="text-xs text-[#6B6560]">
                  Track the status of your requested demo policy consultations.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('plans')}
                className="text-xs font-bold self-start sm:self-auto rounded-xl"
              >
                + Explore More Plans
              </Button>
            </div>

            {userInquiries.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border-2 border-[#EAE7E1] text-center space-y-4">
                <div className="w-14 h-14 bg-[#F6F4F1] rounded-2xl flex items-center justify-center mx-auto text-[#8A847F]">
                  <FileText size={28} />
                </div>
                <div className="space-y-1 max-w-sm mx-auto">
                  <h3 className="text-lg font-bold text-[#2E2A5E]">No Inquiries Submitted Yet</h3>
                  <p className="text-xs text-[#6B6560]">
                    You haven't requested information for any insurance products. Browse available protection plans whenever you're ready.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => setActiveTab('plans')}
                  className="px-6 py-2.5 text-xs font-bold rounded-xl"
                >
                  Browse Protection Plans
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {userInquiries.map((inquiry) => (
                  <div 
                    key={inquiry.id}
                    className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-[#EAE7E1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#E05D3F]/40 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-[#EBF7EE] text-[#1B7A3D] border border-[#C8E6C9] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase flex items-center gap-1">
                          <CheckCircle2 size={12} /> {inquiry.status || 'Inquiry Submitted'}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#8A847F] bg-[#F6F4F1] px-2.5 py-0.5 rounded-md">
                          Inquiry ID: {inquiry.id}
                        </span>
                        <span className="text-xs text-[#8A847F]">
                          • Submitted on {inquiry.submittedAt ? format(parseISO(inquiry.submittedAt), 'dd MMMM yyyy') : '27 August 2026'}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-heading font-extrabold text-[#2E2A5E]">
                          {inquiry.policyName}
                        </h3>
                        <p className="text-xs font-bold text-[#8A847F] mt-0.5">
                          {inquiry.providerName}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-[#F6F4F1] p-3.5 rounded-xl border border-[#EAE7E1] max-w-xl">
                        <div>
                          <span className="text-[#8A847F] font-bold text-[10px] uppercase block">Interested Coverage:</span>
                          <span className="font-extrabold text-[#2E2A5E]">{inquiry.interestedCoverage || '₹50 Lakh'}</span>
                        </div>
                        <div>
                          <span className="text-[#8A847F] font-bold text-[10px] uppercase block">Preferred Channel:</span>
                          <span className="font-extrabold text-[#2E2A5E]">{inquiry.preferredContact}</span>
                        </div>
                        <div>
                          <span className="text-[#8A847F] font-bold text-[10px] uppercase block">Best Time:</span>
                          <span className="font-extrabold text-[#2E2A5E]">{inquiry.bestTimeToContact || '12 PM – 3 PM'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-[#EAE7E1]">
                      <span className="text-[11px] text-[#6B6560] italic">
                        Demo Consultation
                      </span>
                      <button
                        type="button"
                        onClick={() => cancelInsuranceInquiry(inquiry.id)}
                        className="text-xs font-bold text-[#991B1B] hover:text-[#DC2626] flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <Trash2 size={13} /> Withdraw Inquiry
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FAQ & PRIVACY */}
        {activeTab === 'faqs' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#EAE7E1] shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-heading font-extrabold text-[#2E2A5E]">
                Insurance & Data Privacy Guidelines
              </h2>
              <p className="text-xs text-[#6B6560] mt-1">
                Everything you need to know about optional life protection on VacTrack.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1] space-y-1">
                <h4 className="font-bold text-sm text-[#2E2A5E] flex items-center gap-2">
                  <Lock size={15} className="text-[#E05D3F]" /> Does VacTrack share my medical history with insurers?
                </h4>
                <p className="text-xs text-[#55504D] leading-relaxed pl-6">
                  <strong>No.</strong> Your immunization records, dose batches, blood group, and allergy data remain strictly isolated within your private health ledger. Submitting an insurance inquiry only provides your contact preference so an advisor can discuss independent policy terms.
                </p>
              </div>

              <div className="p-4 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1] space-y-1">
                <h4 className="font-bold text-sm text-[#2E2A5E] flex items-center gap-2">
                  <HelpCircle size={15} className="text-[#E05D3F]" /> Are these policies mandatory to use VacTrack?
                </h4>
                <p className="text-xs text-[#55504D] leading-relaxed pl-6">
                  <strong>Not at all.</strong> This section is 100% optional. You can ignore it, close it, and continue tracking your vaccines, booking rabies PEP appointments, or using emergency locators with full functionality.
                </p>
              </div>

              <div className="p-4 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1] space-y-1">
                <h4 className="font-bold text-sm text-[#2E2A5E] flex items-center gap-2">
                  <Info size={15} className="text-[#E05D3F]" /> What does "Demo Policy" mean?
                </h4>
                <p className="text-xs text-[#55504D] leading-relaxed pl-6">
                  All insurance products showcased in this prototype are illustrative simulations. In a production deployment, inquiries would route to certified independent insurance partners compliant with IRDAI regulations.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* 1. VIEW DETAILS MODAL */}
      {/* ======================================================== */}
      {selectedPolicyForDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <button 
              type="button"
              onClick={() => setSelectedPolicyForDetails(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="space-y-1.5 pr-8">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A847F]">
                {selectedPolicyForDetails.provider}
              </span>
              <h3 className="text-2xl font-heading font-extrabold text-[#2E2A5E]">
                {selectedPolicyForDetails.name}
              </h3>
              <div className="flex items-center gap-2 pt-1">
                <span className="bg-[#FEF3F2] text-[#E05D3F] text-xs font-extrabold px-3 py-0.5 rounded-full border border-[#FECDCA]">
                  Demo Policy
                </span>
                <span className="text-xs font-bold text-[#6B6560]">
                  {selectedPolicyForDetails.planType} • {selectedPolicyForDetails.coverAmount}
                </span>
              </div>
            </div>

            {/* Coverage Details Card */}
            <div className="bg-[#F6F4F1] p-4 rounded-2xl border border-[#EAE7E1] grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#6B6560] block">Life Cover Amount</span>
                <span className="text-2xl font-black text-[#2E2A5E]">{selectedPolicyForDetails.coverAmount}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#6B6560] block">Estimated Premium</span>
                <span className="text-lg font-black text-[#E05D3F]">{selectedPolicyForDetails.startingFrom}</span>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-[#2E2A5E] uppercase tracking-wider">
                Key Benefits
              </h4>
              <ul className="space-y-2 text-xs text-[#55504D]">
                {selectedPolicyForDetails.keyBenefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#1B7A3D] shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Policy Term & Eligibility */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-white rounded-xl border border-[#EAE7E1]">
                <span className="text-[#8A847F] font-bold block text-[10px] uppercase">Policy Term</span>
                <span className="font-extrabold text-[#2E2A5E] mt-0.5 block">{selectedPolicyForDetails.policyTerm}</span>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-[#EAE7E1]">
                <span className="text-[#8A847F] font-bold block text-[10px] uppercase">Eligibility</span>
                <span className="font-extrabold text-[#2E2A5E] mt-0.5 block">{selectedPolicyForDetails.eligibility}</span>
              </div>
            </div>

            {/* Important Notes */}
            <div className="p-3 bg-[#FFFBEB] rounded-xl border border-[#FDE68A] text-[11px] text-[#92400E] leading-relaxed">
              <span className="font-bold block mb-0.5">Important Notes:</span>
              {selectedPolicyForDetails.importantNotes}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EAE7E1]">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedPolicyForDetails(null)}
                className="px-5 py-2.5 text-xs font-bold rounded-xl"
              >
                Close
              </Button>
              <Button
                type="button"
                onClick={() => handleOpenInquiry(selectedPolicyForDetails)}
                className="px-6 py-2.5 text-xs font-bold rounded-xl bg-[#E05D3F] hover:bg-[#c94f33] text-white shadow-xs"
              >
                I'm Interested →
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. "I'M INTERESTED" SLIDER DRAWER & INQUIRY FORM */}
      {/* ======================================================== */}
      {selectedPolicyForInquiry && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-end">
          <div className="bg-white w-full max-w-lg h-full p-6 sm:p-8 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            
            {/* Drawer Body */}
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-[#EAE7E1] pb-4">
                <div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#FEF3F2] text-[#E05D3F] mb-1">
                    Demo Insurance Inquiry
                  </div>
                  <h3 className="text-2xl font-heading font-extrabold text-[#2E2A5E]">
                    Request More Information
                  </h3>
                  <p className="text-xs text-[#6B6560] mt-1">
                    Submit your details and an insurance representative can contact you with more information.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCloseDrawer}
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Selected Policy Banner */}
              <div className="p-4 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#8A847F] uppercase block">Selected Product</span>
                  <h4 className="font-extrabold text-sm text-[#2E2A5E]">{selectedPolicyForInquiry.name}</h4>
                  <span className="text-xs text-[#E05D3F] font-bold">{selectedPolicyForInquiry.coverAmount} Life Cover</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#8A847F] bg-white px-2 py-1 rounded-md border border-[#EAE7E1]">
                  {selectedPolicyForInquiry.startingFrom}
                </span>
              </div>

              {/* SUCCESS VIEW OR FORM */}
              {submittedInquiryData ? (
                <div className="py-6 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 bg-[#EBF7EE] text-[#1B7A3D] rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 size={36} />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-2xl font-heading font-extrabold text-[#2E2A5E]">
                      ✓ Inquiry Submitted
                    </h4>
                    <p className="text-sm font-semibold text-[#1B7A3D]">
                      Thank you. Your request has been recorded successfully.
                    </p>
                    <p className="text-xs text-[#6B6560] max-w-sm mx-auto leading-relaxed">
                      An insurance representative may contact you using the details provided.
                    </p>
                  </div>

                  {/* Inquiry ID Card */}
                  <div className="bg-[#F6F4F1] p-5 rounded-2xl border border-[#EAE7E1] text-left space-y-2.5 text-xs">
                    <div className="flex justify-between items-center border-b border-[#EAE7E1] pb-2">
                      <span className="text-[#8A847F] font-bold">Inquiry ID:</span>
                      <span className="font-mono font-extrabold text-[#2E2A5E] bg-white px-2.5 py-0.5 rounded border border-[#EAE7E1]">
                        {submittedInquiryData.id}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#EAE7E1] pb-2">
                      <span className="text-[#8A847F] font-bold">Contact Channel:</span>
                      <span className="font-extrabold text-[#2E2A5E]">{submittedInquiryData.preferredContact}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8A847F] font-bold">Preferred Time:</span>
                      <span className="font-extrabold text-[#2E2A5E]">{submittedInquiryData.bestTimeToContact}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2.5 pt-4">
                    <Button
                      type="button"
                      onClick={() => {
                        handleCloseDrawer();
                        setActiveTab('plans');
                      }}
                      className="w-full py-3 text-xs font-bold rounded-xl"
                    >
                      Back to Insurance Offers
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        handleCloseDrawer();
                        setActiveTab('inquiries');
                      }}
                      className="w-full py-3 text-xs font-bold rounded-xl"
                    >
                      View in My Inquiries
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        handleCloseDrawer();
                        navigate('/patient/dashboard');
                      }}
                      className="w-full py-2.5 text-xs font-bold text-[#8A847F] hover:text-[#2E2A5E]"
                    >
                      Go to Patient Dashboard
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitInquiry} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#2E2A5E] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Raj Patel"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#EAE7E1] focus:outline-none focus:border-[#E05D3F] bg-white font-medium"
                    />
                    {formErrors.fullName && <p className="text-[11px] text-[#DC2626] mt-1">{formErrors.fullName}</p>}
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#2E2A5E] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="raj@example.com"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#EAE7E1] focus:outline-none focus:border-[#E05D3F] bg-white font-medium"
                      />
                      {formErrors.email && <p className="text-[11px] text-[#DC2626] mt-1">{formErrors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#2E2A5E] mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#EAE7E1] focus:outline-none focus:border-[#E05D3F] bg-white font-medium"
                      />
                      {formErrors.phone && <p className="text-[11px] text-[#DC2626] mt-1">{formErrors.phone}</p>}
                    </div>
                  </div>

                  {/* City & DOB Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#2E2A5E] mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g. Pune"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#EAE7E1] focus:outline-none focus:border-[#E05D3F] bg-white font-medium"
                      />
                      {formErrors.city && <p className="text-[11px] text-[#DC2626] mt-1">{formErrors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#2E2A5E] mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#EAE7E1] focus:outline-none focus:border-[#E05D3F] bg-white font-medium"
                      />
                    </div>
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label className="block text-xs font-bold text-[#2E2A5E] mb-1.5">
                      Preferred Contact Method *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Phone Call', icon: Phone },
                        { label: 'Email', icon: Mail },
                        { label: 'WhatsApp', icon: MessageSquare }
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => setFormData({ ...formData, preferredContact: item.label as any })}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            formData.preferredContact === item.label
                              ? 'bg-[#E05D3F] text-white border-[#E05D3F] shadow-xs'
                              : 'bg-white text-[#55504D] border-[#EAE7E1] hover:bg-[#F6F4F1]'
                          }`}
                        >
                          <item.icon size={13} />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optional: Interested Coverage */}
                  <div>
                    <label className="block text-xs font-bold text-[#2E2A5E] mb-1.5">
                      Interested Coverage <span className="text-[#8A847F] font-normal">(Optional)</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['₹25 Lakh', '₹50 Lakh', '₹1 Crore', 'Not Sure'].map((cov) => (
                        <button
                          key={cov}
                          type="button"
                          onClick={() => setFormData({ ...formData, interestedCoverage: cov })}
                          className={`py-1.5 px-2 rounded-lg border text-xs font-bold transition-all cursor-pointer text-center ${
                            formData.interestedCoverage === cov
                              ? 'bg-[#2E2A5E] text-white border-[#2E2A5E]'
                              : 'bg-white text-[#55504D] border-[#EAE7E1] hover:bg-[#F6F4F1]'
                          }`}
                        >
                          {cov}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optional: Best Time to Contact */}
                  <div>
                    <label className="block text-xs font-bold text-[#2E2A5E] mb-1.5">
                      Best Time to Contact <span className="text-[#8A847F] font-normal">(Optional)</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        '09:00 AM – 12:00 PM',
                        '12:00 PM – 03:00 PM',
                        '03:00 PM – 06:00 PM',
                        '06:00 PM – 09:00 PM'
                      ].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setFormData({ ...formData, bestTimeToContact: slot })}
                          className={`py-1.5 px-2.5 rounded-lg border text-[11px] font-bold transition-all cursor-pointer text-left flex items-center gap-1.5 ${
                            formData.bestTimeToContact === slot
                              ? 'bg-[#2E2A5E] text-white border-[#2E2A5E]'
                              : 'bg-white text-[#55504D] border-[#EAE7E1] hover:bg-[#F6F4F1]'
                          }`}
                        >
                          <Clock size={12} />
                          <span>{slot}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Consent Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#55504D]">
                      <input
                        type="checkbox"
                        checked={formData.agreedToTerms}
                        onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                        className="mt-0.5 h-4 w-4 rounded text-[#E05D3F] border-[#EAE7E1] focus:ring-[#E05D3F]"
                      />
                      <span>
                        I agree to be contacted regarding the selected insurance information.
                      </span>
                    </label>
                    {formErrors.agreedToTerms && (
                      <p className="text-[11px] text-[#DC2626] mt-1">{formErrors.agreedToTerms}</p>
                    )}
                  </div>

                  {/* Privacy Notice */}
                  <div className="p-3 bg-[#F6F4F1] rounded-xl border border-[#EAE7E1] text-[11px] text-[#6B6560] leading-relaxed flex items-start gap-2">
                    <Lock size={14} className="text-[#8A847F] shrink-0 mt-0.5" />
                    <span>
                      <strong>Privacy Notice:</strong> Your information will only be used to respond to your insurance inquiry. VacTrack does not share medical records.
                    </span>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full py-3 text-xs font-bold rounded-xl bg-[#E05D3F] hover:bg-[#c94f33] text-white shadow-xs"
                    >
                      Submit Inquiry →
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Bottom Note */}
            {!submittedInquiryData && (
              <div className="pt-4 border-t border-[#EAE7E1] text-center">
                <p className="text-[10px] text-[#8A847F]">
                  Fictional demo demonstration. No real financial contracts are initiated.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Eligibility Wizard Modal */}
      <SchemeEligibilityWizard
        isOpen={isEligibilityWizardOpen}
        onClose={() => setIsEligibilityWizardOpen(false)}
      />

    </div>
  );
}
