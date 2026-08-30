export type UserRole = 'patient' | 'clinic_staff' | null;

export interface Account {
  id: string;
  email: string;
  phone: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  patientId?: string;
  clinicId?: string;
  city?: string;
  preferredLanguage?: 'en' | 'hi';
}

export interface HealthRecord {
  bloodGroup?: string;
  allergies: string[];
  seriousReactions?: string[];
  medicalConditions: string[];
  medications: string[];
  majorTreatments?: string[];
  previousVaccinations: { name: string; date?: string }[];
  emergencyNotes?: string;
  privacySettings: {
    shareBloodGroup: boolean;
    shareAllergies: boolean;
    shareVaccinationHistory: boolean;
    shareMedicalConditions: boolean;
    shareMedications: boolean;
  };
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email?: string;
  dob: string;
  city: string;
  state?: string;
  pinCode?: string;
  address?: string;
  bloodGroup?: string;
  exposureDate: string;
  exposureCategory: 'I' | 'II' | 'III';
  healthRecord?: HealthRecord;
}

export interface EmergencyFacility {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distanceKm: number;
  is24x7: boolean;
  services: {
    snakebite: 'Available' | 'Call to Confirm' | 'Unavailable';
    antivenom: 'Available — Demo' | 'Call to Confirm' | 'Unavailable';
    animalBite: 'Available' | 'Unavailable';
    rabiesPEP: 'Available' | 'Unavailable';
    emergencyDept?: 'Available' | 'Unavailable';
    traumaCare?: 'Available' | 'Unavailable';
    bloodBank?: 'Available' | 'Unavailable';
  };
  phone: string;
  address: string;
}

export type DoseStatus = 'completed' | 'upcoming' | 'due_today' | 'overdue';

export interface Dose {
  id: string;
  patientId: string;
  doseNumber: number; // 1 to 5
  vaccineName?: string;
  manufacturer?: string;
  batchNumber?: string;
  expiryDate?: string;
  administrationDate?: string; // actual date given
  scheduledDate: string; // when it should be given
  clinicId?: string;
  healthcareWorker?: string;
  previousHash: string;
  currentHash: string;
  status: DoseStatus;
}

export interface Clinic {
  id: string;
  name: string;
  location: string;
  city?: string;
  state?: string;
  pinCode?: string;
  phone?: string;
  email?: string;
  licenseNumber?: string;
  hospitalType?: string;
  is24x7?: boolean;
  hasEmergencyDept?: boolean;
  address?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  clinicId: string;
  doseNumber: number;
  serviceName?: string;
  date: string; // e.g. "2026-08-24"
  time: string; // e.g. "10:30 AM"
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Alert {
  id: string;
  type: 'upcoming' | 'overdue' | 'expired_batch' | 'campaign' | 'info' | 'verified';
  title?: string;
  message: string;
  date?: string;
  time?: string;
  location?: string;
  patientId?: string;
  createdAt: string;
  read: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  category: 'vaccination' | 'blood_donation' | 'health_checkup' | 'screening';
  location: string;
  city: string;
  date: string;
  time: string;
  distance: string;
  isFree: boolean;
  description: string;
  isDemo: boolean;
}

export interface VaccineInventoryItem {
  id: string;
  vaccineName: string;
  availableDoses: number;
  currentlyUsed: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  expiryDate: string;
  batchNumber: string;
  manufacturer: string;
  status: 'valid' | 'expiring_soon' | 'low_stock' | 'expired';
  lastVerifiedHash?: string;
}

export interface Ambulance {
  id: string;
  vehicleNumber: string;
  status: 'available' | 'on_emergency_call' | 'maintenance';
  currentRoute?: string;
  driverName?: string;
  contactPhone?: string;
  lastUpdated?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  speciality?: string;
  availability: 'available' | 'in_consultation' | 'on_leave';
  department: string;
  roomNumber?: string;
  timing?: string;
}

export interface HospitalReview {
  id: string;
  hospitalId: string;
  patientName?: string;
  userName?: string;
  patientId?: string;
  userRole?: string;
  rating: number; // 1 to 5
  reviewText?: string;
  comment?: string;
  date: string;
  verifiedVisit: boolean;
  cleanlinessRating?: number;
  staffRating?: number;
  waitingTimeRating?: number;
  emergencyCareRating?: number;
  categories?: {
    cleanliness?: number;
    staff?: number;
    waitingTime?: number;
    emergencyCare?: number;
  };
}

export interface HospitalOperationsData {
  id?: string;
  hospitalId: string;
  name?: string;
  hospitalName: string;
  hospitalLicense: string;
  location: string;
  address?: string;
  area?: string;
  city: string;
  lat: number;
  lng: number;
  distanceKm: number;
  phone: string;
  is24x7: boolean;
  emergencyAvailable: boolean;
  emergencyDept?: boolean;
  antivenomAvailable: boolean;
  rabiesPepAvailable: boolean;
  bedsAvailableDemo?: number;
  services?: string[];
  patientsToday: number;
  vaccinationsToday: number;
  emergencyCasesToday: number;
  stats?: {
    patientsToday: number;
    totalVaccinesAvailable: number;
    totalDosesUsed: number;
    dosesAdministeredToday: number;
    dosesThisMonth: number;
    emergencyCases: number;
  };
  lastUpdated: string;
  rating: number;
  totalReviews: number;
  ratingBreakdown: {
    cleanliness: number;
    staff: number;
    waitingTime: number;
    emergencyCare: number;
  };
  inventory: VaccineInventoryItem[];
  ambulances: Ambulance[];
  doctors: Doctor[];
  usage7Days: { day: string; doses: number; date: string }[];
}

export interface InsurancePolicy {
  id: string;
  provider: string; // e.g. "SecureLife Insurance — DEMO"
  name: string; // e.g. "SecureLife Family Protection"
  planType: string; // e.g. "Life Cover"
  coverAmount: string; // e.g. "₹50 Lakh"
  startingFrom: string; // e.g. "₹599 / month*"
  highlights: string[];
  keyBenefits: string[];
  policyTerm: string;
  eligibility: string;
  importantNotes: string;
  badge?: string;
}

export interface InsuranceInquiry {
  id: string; // e.g. "INS-DEMO-2048"
  patientId?: string;
  policyId: string;
  policyName: string;
  providerName: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  dob: string;
  preferredContact: 'Phone Call' | 'Email' | 'WhatsApp';
  interestedCoverage?: string; // '₹25 Lakh' | '₹50 Lakh' | '₹1 Crore' | 'Not Sure'
  bestTimeToContact?: string; // '09:00 AM – 12:00 PM' | '12:00 PM – 03:00 PM' | '03:00 PM – 06:00 PM' | '06:00 PM – 09:00 PM'
  status: 'Inquiry Submitted' | 'Representative Assigned' | 'Under Review';
  submittedAt: string; // ISO date string
}

export type ReminderUrgency = 'critical' | 'high' | 'medium' | 'info';
export type ReminderBasis = 'active_protocol' | 'age_schedule' | 'health_record_gap' | 'allergy_caution' | 'appointment_reminder';
export type ReminderStatus = 'due_today' | 'upcoming' | 'overdue' | 'recommended_booster' | 'scheduled';

export interface NotificationPreferences {
  smsEnabled: boolean;
  whatsappEnabled: boolean;
  emailEnabled: boolean;
  inAppEnabled: boolean;
  remindDaysBefore: number[]; // e.g. [7, 3, 1, 0]
  phone: string;
  email: string;
  preferredTimeOfDay: 'morning' | 'afternoon' | 'evening';
  emergencyHighPriority: boolean;
  allergyWarningsEnabled: boolean;
  ageBoosterAlertsEnabled: boolean;
}

export interface VaccinationReminder {
  id: string;
  patientId: string;
  vaccineName: string;
  doseNumber?: number;
  totalDoses?: number;
  scheduledDate: string; // ISO date string
  dueDateFormatted: string; // e.g. "24 August 2026"
  daysRemaining: number; // positive = days until due, 0 = due today, negative = overdue
  status: ReminderStatus;
  urgency: ReminderUrgency;
  title: string;
  message: string;
  profileReason: string; // Precise explanation of patient profile factor that triggered this
  triggerBasis: ReminderBasis;
  recommendedFacilityName: string;
  recommendedFacilityAddress: string;
  recommendedFacilityPhone: string;
  suggestedAction: 'book_appointment' | 'visit_er' | 'confirm_receipt' | 'consult_doctor';
  channelDispatched: {
    sms: boolean;
    whatsapp: boolean;
    email: boolean;
    inApp: boolean;
  };
  dispatchedAt?: string;
  dismissed?: boolean;
  snoozedUntil?: string;
  read: boolean;
  appointmentId?: string;
  badgeText?: string;
}

export interface DispatchedMessageLog {
  id: string;
  patientId: string;
  reminderId: string;
  channel: 'sms' | 'whatsapp' | 'email';
  recipient: string; // phone or email
  sender: string; // e.g. "VacTrack SMS Gateway" or "VacTrack Official WhatsApp"
  sentAt: string;
  title: string;
  body: string;
  status: 'delivered' | 'sent' | 'read';
}

