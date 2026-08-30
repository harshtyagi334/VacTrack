import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addDays, isBefore, isSameDay, startOfDay, isAfter, parseISO, format } from 'date-fns';
import { Patient, Dose, Clinic, Appointment, Alert, UserRole, DoseStatus, Account, Campaign, InsuranceInquiry, VaccineInventoryItem, Ambulance, Doctor, HospitalReview, HospitalOperationsData, VaccinationReminder, NotificationPreferences, DispatchedMessageLog } from '../types';
import { generateHash, GENESIS_HASH } from '../utils/hash';
import { generateProfileVaccinationReminders, DEFAULT_NOTIFICATION_PREFERENCES, buildSimulatedDispatches } from '../utils/reminderEngine';

const DEMO_PATIENT_EMAIL = import.meta.env.VITE_DEMO_PATIENT_EMAIL || 'patient.demo@example.com';
const DEMO_HOSPITAL_EMAIL = import.meta.env.VITE_DEMO_HOSPITAL_EMAIL || 'hospital.demo@example.com';
const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD || 'demo-password';

let uniqueIdCounter = 0;
export const generateUniqueId = (prefix: string = 'id'): string => {
  uniqueIdCounter = (uniqueIdCounter + 1) % 1000000;
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${uniqueIdCounter}`;
};

interface AppState {
  // Global State
  currentDate: string; // ISO string representing "today" in the simulation
  language: 'en' | 'hi';
  
  // Auth State
  currentUser: Account | null;
  role: UserRole;
  currentClinicId: string | null;
  currentPatientId: string | null; // For patient login

  // Data Collections
  accounts: Record<string, Account>;
  patients: Record<string, Patient>;
  doses: Record<string, Dose[]>; // mapped by patientId
  clinics: Record<string, Clinic>;
  appointments: Appointment[];
  alerts: Alert[];
  campaigns: Campaign[];
  insuranceInquiries: InsuranceInquiry[];
  hospitalOperations: Record<string, HospitalOperationsData>;
  hospitalReviews: Record<string, HospitalReview[]>;
  notificationPreferences: NotificationPreferences;
  dispatchedLogs: DispatchedMessageLog[];
  dismissedReminderIds: string[];
  snoozedReminderMap: Record<string, string>;

  // Actions
  setLanguage: (lang: 'en' | 'hi') => void;
  fastForwardTime: (days: number) => void;
  
  // Auth Actions
  login: (emailOrPhone: string, passwordHash: string) => { success: boolean; error?: string; account?: Account };
  signup: (data: Omit<Account, 'id'>, patientData?: Partial<Patient>, hospitalData?: Partial<Clinic>) => { success: boolean; error?: string };
  logout: () => void;
  setRole: (role: UserRole, clinicId?: string, patientId?: string) => void;

  // Data Actions
  registerPatient: (patient: Omit<Patient, 'id'>) => string;
  updateHealthRecord: (patientId: string, updates: Partial<Patient['healthRecord']>) => void;
  recordDose: (patientId: string, doseNumber: number, data: Partial<Dose>) => { success: boolean; error?: string };
  simulateTampering: (patientId: string, doseNumber: number) => void;
  restoreTampering: (patientId: string, doseNumber: number) => void;
  bookAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'createdAt' | 'read'>) => void;
  markAlertRead: (id: string) => void;
  submitInsuranceInquiry: (inquiry: Omit<InsuranceInquiry, 'id' | 'submittedAt' | 'status'> & Partial<Pick<InsuranceInquiry, 'id' | 'status'>>) => string;
  cancelInsuranceInquiry: (id: string) => void;

  // Hospital Operations & Reviews Actions
  updateHospitalOperations: (hospitalId: string, updates: Partial<HospitalOperationsData>) => void;
  addVaccineStock: (hospitalId: string, item: Omit<VaccineInventoryItem, 'id'>) => void;
  updateVaccineItem: (hospitalId: string, itemId: string, updates: Partial<VaccineInventoryItem>) => void;
  updateAmbulanceStatus: (hospitalId: string, ambulanceId: string, status: Ambulance['status'], route?: string) => void;
  updateDoctorStatus: (hospitalId: string, doctorId: string, availability: Doctor['availability']) => void;
  addHospitalReview: (hospitalId: string, review: Omit<HospitalReview, 'id' | 'date'>) => void;

  // Profile-Driven Vaccination Reminder Actions
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => void;
  getProfileReminders: (patientId?: string) => VaccinationReminder[];
  dispatchTestNotification: (reminderId: string, channel: 'sms' | 'whatsapp' | 'email') => DispatchedMessageLog | null;
  snoozeReminder: (reminderId: string, days: number) => void;
  dismissReminder: (reminderId: string) => void;
  restoreReminder: (reminderId: string) => void;
  clearDispatchedLogs: () => void;

  // Selectors/Computed
  getPatientDoses: (patientId: string) => Dose[];
  updateDoseStatuses: () => void;
  verifyChain: (patientId: string) => { valid: boolean; failedAtDose?: number; expectedHash?: string; actualHash?: string };
  resetDemo: () => void;
}

const INITIAL_HOSPITAL_OPERATIONS: Record<string, HospitalOperationsData> = {
  'hosp_1': {
    id: 'hosp_1',
    hospitalId: 'hosp_1',
    name: 'Sunrise Multispeciality Hospital',
    hospitalName: 'Sunrise Multispeciality Hospital',
    hospitalLicense: 'VT-HOS-1024',
    location: 'Shivajinagar, Pune, Maharashtra',
    address: 'Near Shivajinagar Railway Station, Pune, Maharashtra 411005',
    area: 'Shivajinagar',
    city: 'Pune',
    lat: 18.5308,
    lng: 73.8475,
    distanceKm: 1.8,
    phone: '+91 90000 10001',
    is24x7: true,
    emergencyAvailable: true,
    emergencyDept: true,
    antivenomAvailable: true,
    rabiesPepAvailable: true,
    bedsAvailableDemo: 16,
    services: ['Rabies PEP', 'Antivenom Serum', 'Trauma ICU', 'Pediatric Vaccination', '24/7 Ambulance'],
    patientsToday: 84,
    vaccinationsToday: 28,
    emergencyCasesToday: 7,
    stats: {
      patientsToday: 84,
      totalVaccinesAvailable: 533,
      totalDosesUsed: 140,
      dosesAdministeredToday: 28,
      dosesThisMonth: 612,
      emergencyCases: 7
    },
    lastUpdated: '2026-08-27T10:45:00.000Z',
    rating: 4.7,
    totalReviews: 128,
    ratingBreakdown: {
      cleanliness: 4.6,
      staff: 4.8,
      waitingTime: 4.5,
      emergencyCare: 4.7
    },
    inventory: [
      {
        id: 'vac_1',
        vaccineName: 'Rabies Vaccine (Rabivax-S)',
        availableDoses: 126,
        currentlyUsed: 34,
        lowStockThreshold: 30,
        isLowStock: false,
        expiryDate: '2027-01-15',
        batchNumber: 'RAB-DEMO-7824',
        manufacturer: 'Serum Institute of India Ltd.',
        status: 'valid'
      },
      {
        id: 'vac_2',
        vaccineName: 'Tetanus Vaccine (TT Booster)',
        availableDoses: 84,
        currentlyUsed: 18,
        lowStockThreshold: 20,
        isLowStock: false,
        expiryDate: '2026-11-10',
        batchNumber: 'TT-DEMO-4512',
        manufacturer: 'Biological E. Limited',
        status: 'expiring_soon'
      },
      {
        id: 'vac_3',
        vaccineName: 'COVID-19 Vaccine (Covishield Demo)',
        availableDoses: 210,
        currentlyUsed: 52,
        lowStockThreshold: 40,
        isLowStock: false,
        expiryDate: '2026-12-22',
        batchNumber: 'CVX-DEMO-2614',
        manufacturer: 'Serum Institute of India Ltd.',
        status: 'valid'
      },
      {
        id: 'vac_4',
        vaccineName: 'Polio Vaccine (bOPV Demo)',
        availableDoses: 95,
        currentlyUsed: 21,
        lowStockThreshold: 25,
        isLowStock: false,
        expiryDate: '2026-10-18',
        batchNumber: 'POL-DEMO-8391',
        manufacturer: 'Sanofi Pasteur',
        status: 'valid'
      },
      {
        id: 'vac_5',
        vaccineName: 'Hepatitis B Adult Booster',
        availableDoses: 18,
        currentlyUsed: 12,
        lowStockThreshold: 20,
        isLowStock: true,
        expiryDate: '2027-04-12',
        batchNumber: 'HEP-DEMO-3109',
        manufacturer: 'Serum Institute of India Ltd.',
        status: 'low_stock'
      },
      {
        id: 'vac_6',
        vaccineName: 'Expired Rabies Vaccine Batch',
        availableDoses: 0,
        currentlyUsed: 0,
        lowStockThreshold: 10,
        isLowStock: false,
        expiryDate: '2024-06-10',
        batchNumber: 'DEMO-EXPIRED-001',
        manufacturer: 'Demo Pharma Ltd.',
        status: 'expired'
      }
    ],
    ambulances: [
      {
        id: 'AMB-001',
        vehicleNumber: 'MH-12-EM-1001',
        status: 'available',
        driverName: 'Ramesh Kadam',
        contactPhone: '+91 98220 10001'
      },
      {
        id: 'AMB-002',
        vehicleNumber: 'MH-12-EM-1002',
        status: 'on_emergency_call',
        currentRoute: 'Shivajinagar → Sunrise Hospital',
        driverName: 'Suresh Patil',
        contactPhone: '+91 98220 10002'
      },
      {
        id: 'AMB-003',
        vehicleNumber: 'MH-12-EM-1003',
        status: 'available',
        driverName: 'Vikas Shinde',
        contactPhone: '+91 98220 10003'
      },
      {
        id: 'AMB-004',
        vehicleNumber: 'MH-12-EM-1004',
        status: 'on_emergency_call',
        currentRoute: 'Deccan → Sunrise Hospital',
        driverName: 'Santosh More',
        contactPhone: '+91 98220 10004'
      },
      {
        id: 'AMB-005',
        vehicleNumber: 'MH-12-EM-1005',
        status: 'maintenance',
        driverName: 'Fleet Service Hub',
        contactPhone: '+91 98220 10005'
      }
    ],
    doctors: [
      {
        id: 'doc_1',
        name: 'Dr. Rohan Mehta',
        specialization: 'General Physician',
        availability: 'available',
        department: 'General Medicine',
        roomNumber: 'Room 102'
      },
      {
        id: 'doc_2',
        name: 'Dr. Ananya Kulkarni',
        specialization: 'Emergency Medicine',
        availability: 'available',
        department: 'Emergency Trauma Care',
        roomNumber: 'ER-1'
      },
      {
        id: 'doc_3',
        name: 'Dr. Vivek Deshmukh',
        specialization: 'Orthopedic Specialist',
        availability: 'in_consultation',
        department: 'Orthopedics & Trauma',
        roomNumber: 'Room 204'
      },
      {
        id: 'doc_4',
        name: 'Dr. Priya Nair',
        specialization: 'Pediatrician',
        availability: 'available',
        department: 'Pediatrics & Immunization',
        roomNumber: 'Room 108'
      },
      {
        id: 'doc_5',
        name: 'Dr. Arjun Shah',
        specialization: 'General Physician',
        availability: 'on_leave',
        department: 'Internal Medicine',
        roomNumber: 'Room 105'
      }
    ],
    usage7Days: [
      { day: '21 Aug', doses: 18, date: '2026-08-21' },
      { day: '22 Aug', doses: 24, date: '2026-08-22' },
      { day: '23 Aug', doses: 21, date: '2026-08-23' },
      { day: '24 Aug', doses: 31, date: '2026-08-24' },
      { day: '25 Aug', doses: 26, date: '2026-08-25' },
      { day: '26 Aug', doses: 22, date: '2026-08-26' },
      { day: '27 Aug', doses: 28, date: '2026-08-27' }
    ]
  },
  'hosp_2': {
    id: 'hosp_2',
    hospitalId: 'hosp_2',
    name: 'CityCare Medical Center',
    hospitalName: 'CityCare Medical Center',
    hospitalLicense: 'VT-HOS-1025',
    location: 'Deccan, Pune, Maharashtra',
    address: 'Deccan Gymkhana, Pune, Maharashtra 411004',
    area: 'Deccan Gymkhana',
    city: 'Pune',
    lat: 18.5204,
    lng: 73.8567,
    distanceKm: 3.2,
    phone: '+91 90000 10002',
    is24x7: true,
    emergencyAvailable: true,
    emergencyDept: true,
    antivenomAvailable: true,
    rabiesPepAvailable: true,
    bedsAvailableDemo: 12,
    services: ['Rabies PEP', 'Tetanus Prophylaxis', 'OPD Consultations', 'Diagnostic Lab'],
    patientsToday: 62,
    vaccinationsToday: 21,
    emergencyCasesToday: 4,
    stats: {
      patientsToday: 62,
      totalVaccinesAvailable: 310,
      totalDosesUsed: 98,
      dosesAdministeredToday: 21,
      dosesThisMonth: 440,
      emergencyCases: 4
    },
    lastUpdated: '2026-08-27T09:30:00.000Z',
    rating: 4.5,
    totalReviews: 94,
    ratingBreakdown: {
      cleanliness: 4.5,
      staff: 4.6,
      waitingTime: 4.3,
      emergencyCare: 4.6
    },
    inventory: [
      {
        id: 'vac_c1',
        vaccineName: 'Rabies Vaccine (Rabivax-S)',
        availableDoses: 90,
        currentlyUsed: 22,
        lowStockThreshold: 20,
        isLowStock: false,
        expiryDate: '2027-02-10',
        batchNumber: 'RAB-DEMO-9912',
        manufacturer: 'Serum Institute of India Ltd.',
        status: 'valid'
      },
      {
        id: 'vac_c2',
        vaccineName: 'Tetanus Toxoid Booster',
        availableDoses: 65,
        currentlyUsed: 14,
        lowStockThreshold: 15,
        isLowStock: false,
        expiryDate: '2026-12-30',
        batchNumber: 'TT-DEMO-6610',
        manufacturer: 'Biological E. Limited',
        status: 'valid'
      }
    ],
    ambulances: [
      {
        id: 'AMB-201',
        vehicleNumber: 'MH-12-CC-2001',
        status: 'available',
        driverName: 'Deepak Sawant',
        contactPhone: '+91 98220 20001'
      }
    ],
    doctors: [
      {
        id: 'doc_201',
        name: 'Dr. Sameer Joshi',
        specialization: 'General Physician',
        speciality: 'General Medicine',
        availability: 'available',
        department: 'Internal Medicine',
        roomNumber: 'Room 101',
        timing: '09:00 AM – 05:00 PM'
      },
      {
        id: 'doc_202',
        name: 'Dr. Radhika Sen',
        specialization: 'Emergency Medicine',
        speciality: 'Casualty & Trauma',
        availability: 'available',
        department: 'Casualty',
        roomNumber: 'ER-2',
        timing: '08:00 AM – 08:00 PM'
      }
    ],
    usage7Days: [
      { day: '21 Aug', doses: 18, date: '2026-08-21' },
      { day: '22 Aug', doses: 22, date: '2026-08-22' },
      { day: '23 Aug', doses: 15, date: '2026-08-23' },
      { day: '24 Aug', doses: 25, date: '2026-08-24' },
      { day: '25 Aug', doses: 19, date: '2026-08-25' },
      { day: '26 Aug', doses: 24, date: '2026-08-26' },
      { day: '27 Aug', doses: 21, date: '2026-08-27' }
    ]
  },
  'hosp_3': {
    id: 'hosp_3',
    hospitalId: 'hosp_3',
    name: 'Lifeline Emergency Hospital',
    hospitalName: 'Lifeline Emergency Hospital',
    hospitalLicense: 'VT-HOS-1026',
    location: 'Kothrud, Pune, Maharashtra',
    address: 'Paud Road, Kothrud, Pune, Maharashtra 411038',
    area: 'Kothrud',
    city: 'Pune',
    lat: 18.5089,
    lng: 73.8259,
    distanceKm: 5.1,
    phone: '+91 90000 10003',
    is24x7: true,
    emergencyAvailable: true,
    emergencyDept: true,
    antivenomAvailable: true,
    rabiesPepAvailable: true,
    bedsAvailableDemo: 18,
    services: ['Rabies PEP', 'Antivenom Serum', 'Trauma Resuscitation', '24/7 ICU'],
    patientsToday: 78,
    vaccinationsToday: 16,
    emergencyCasesToday: 9,
    stats: {
      patientsToday: 78,
      totalVaccinesAvailable: 280,
      totalDosesUsed: 72,
      dosesAdministeredToday: 16,
      dosesThisMonth: 390,
      emergencyCases: 9
    },
    lastUpdated: '2026-08-27T08:15:00.000Z',
    rating: 4.6,
    totalReviews: 112,
    ratingBreakdown: {
      cleanliness: 4.7,
      staff: 4.7,
      waitingTime: 4.4,
      emergencyCare: 4.8
    },
    inventory: [
      {
        id: 'vac_l1',
        vaccineName: 'Rabies Vaccine (Rabivax-S)',
        availableDoses: 110,
        currentlyUsed: 28,
        lowStockThreshold: 25,
        isLowStock: false,
        expiryDate: '2027-03-20',
        batchNumber: 'RAB-DEMO-8821',
        manufacturer: 'Serum Institute of India Ltd.',
        status: 'valid'
      }
    ],
    ambulances: [
      {
        id: 'AMB-301',
        vehicleNumber: 'MH-12-LL-3001',
        status: 'available',
        driverName: 'Sachin Gaikwad',
        contactPhone: '+91 98220 30001'
      },
      {
        id: 'AMB-302',
        vehicleNumber: 'MH-12-LL-3002',
        status: 'on_emergency_call',
        currentRoute: 'Kothrud → Lifeline Hospital',
        driverName: 'Nitin Mane',
        contactPhone: '+91 98220 30002'
      }
    ],
    doctors: [
      {
        id: 'doc_301',
        name: 'Dr. Madhav Rao',
        specialization: 'Emergency Trauma Specialist',
        speciality: 'Trauma & Critical Care',
        availability: 'available',
        department: 'Trauma & ICU',
        roomNumber: 'ICU-1',
        timing: '24 Hours On-Call'
      }
    ],
    usage7Days: [
      { day: '21 Aug', doses: 14, date: '2026-08-21' },
      { day: '22 Aug', doses: 17, date: '2026-08-22' },
      { day: '23 Aug', doses: 12, date: '2026-08-23' },
      { day: '24 Aug', doses: 20, date: '2026-08-24' },
      { day: '25 Aug', doses: 15, date: '2026-08-25' },
      { day: '26 Aug', doses: 18, date: '2026-08-26' },
      { day: '27 Aug', doses: 16, date: '2026-08-27' }
    ]
  },
  'hosp_4': {
    id: 'hosp_4',
    hospitalId: 'hosp_4',
    name: 'Pune Trauma & Emergency Centre',
    hospitalName: 'Pune Trauma & Emergency Centre',
    hospitalLicense: 'VT-HOS-1027',
    location: 'Aundh / Baner, Pune, Maharashtra',
    address: 'DP Road, Aundh, Pune, Maharashtra 411007',
    area: 'Aundh',
    city: 'Pune',
    lat: 18.5590,
    lng: 73.7868,
    distanceKm: 6.2,
    phone: '+91 90000 10004',
    is24x7: true,
    emergencyAvailable: true,
    emergencyDept: true,
    antivenomAvailable: true,
    rabiesPepAvailable: true,
    bedsAvailableDemo: 24,
    services: ['Level-1 Trauma Care', 'Snakebite Antivenom', 'Rabies PEP Clinic', 'Surgical Emergency'],
    patientsToday: 95,
    vaccinationsToday: 32,
    emergencyCasesToday: 11,
    stats: {
      patientsToday: 95,
      totalVaccinesAvailable: 490,
      totalDosesUsed: 165,
      dosesAdministeredToday: 32,
      dosesThisMonth: 780,
      emergencyCases: 11
    },
    lastUpdated: '2026-08-27T10:00:00.000Z',
    rating: 4.8,
    totalReviews: 145,
    ratingBreakdown: {
      cleanliness: 4.8,
      staff: 4.9,
      waitingTime: 4.6,
      emergencyCare: 4.9
    },
    inventory: [
      {
        id: 'vac_t1',
        vaccineName: 'Rabies Vaccine (Rabivax-S)',
        availableDoses: 140,
        currentlyUsed: 42,
        lowStockThreshold: 30,
        isLowStock: false,
        expiryDate: '2027-05-18',
        batchNumber: 'RAB-DEMO-4401',
        manufacturer: 'Serum Institute of India Ltd.',
        status: 'valid'
      }
    ],
    ambulances: [
      {
        id: 'AMB-401',
        vehicleNumber: 'MH-12-TR-4001',
        status: 'available',
        driverName: 'Ashok Jadhav',
        contactPhone: '+91 98220 40001'
      }
    ],
    doctors: [
      {
        id: 'doc_401',
        name: 'Dr. Tanvi Deshpande',
        specialization: 'Emergency Medicine',
        speciality: 'Emergency Medicine & Toxicology',
        availability: 'available',
        department: 'Level 1 Trauma',
        roomNumber: 'ER-A',
        timing: '07:00 AM – 03:00 PM'
      }
    ],
    usage7Days: [
      { day: '21 Aug', doses: 28, date: '2026-08-21' },
      { day: '22 Aug', doses: 34, date: '2026-08-22' },
      { day: '23 Aug', doses: 22, date: '2026-08-23' },
      { day: '24 Aug', doses: 40, date: '2026-08-24' },
      { day: '25 Aug', doses: 30, date: '2026-08-25' },
      { day: '26 Aug', doses: 35, date: '2026-08-26' },
      { day: '27 Aug', doses: 32, date: '2026-08-27' }
    ]
  },
  'hosp_5': {
    id: 'hosp_5',
    hospitalId: 'hosp_5',
    name: 'HopeCare Hospital',
    hospitalName: 'HopeCare Hospital',
    hospitalLicense: 'VT-HOS-1028',
    location: 'Viman Nagar, Pune, Maharashtra',
    address: 'Viman Nagar Main Road, Pune, Maharashtra 411014',
    area: 'Viman Nagar',
    city: 'Pune',
    lat: 18.5679,
    lng: 73.9143,
    distanceKm: 7.4,
    phone: '+91 90000 10005',
    is24x7: false,
    emergencyAvailable: false,
    emergencyDept: false,
    antivenomAvailable: false,
    rabiesPepAvailable: true,
    bedsAvailableDemo: 8,
    services: ['Pediatric Immunization', 'Vaccination Record Verification', 'General OPD'],
    patientsToday: 45,
    vaccinationsToday: 18,
    emergencyCasesToday: 1,
    stats: {
      patientsToday: 45,
      totalVaccinesAvailable: 210,
      totalDosesUsed: 54,
      dosesAdministeredToday: 18,
      dosesThisMonth: 320,
      emergencyCases: 1
    },
    lastUpdated: '2026-08-27T07:45:00.000Z',
    rating: 4.4,
    totalReviews: 76,
    ratingBreakdown: {
      cleanliness: 4.5,
      staff: 4.5,
      waitingTime: 4.2,
      emergencyCare: 4.3
    },
    inventory: [
      {
        id: 'vac_h1',
        vaccineName: 'Rabies Vaccine (Rabivax-S)',
        availableDoses: 75,
        currentlyUsed: 18,
        lowStockThreshold: 20,
        isLowStock: false,
        expiryDate: '2027-01-20',
        batchNumber: 'RAB-DEMO-5512',
        manufacturer: 'Serum Institute of India Ltd.',
        status: 'valid'
      }
    ],
    ambulances: [
      {
        id: 'AMB-501',
        vehicleNumber: 'MH-12-HC-5001',
        status: 'available',
        driverName: 'Pravin Kale',
        contactPhone: '+91 98220 50001'
      }
    ],
    doctors: [
      {
        id: 'doc_501',
        name: 'Dr. Meera Iyer',
        specialization: 'Pediatrician',
        availability: 'available',
        department: 'Immunization OPD',
        roomNumber: 'OPD-3'
      }
    ],
    usage7Days: [
      { day: '21 Aug', doses: 15, date: '2026-08-21' },
      { day: '22 Aug', doses: 19, date: '2026-08-22' },
      { day: '23 Aug', doses: 11, date: '2026-08-23' },
      { day: '24 Aug', doses: 22, date: '2026-08-24' },
      { day: '25 Aug', doses: 16, date: '2026-08-25' },
      { day: '26 Aug', doses: 20, date: '2026-08-26' },
      { day: '27 Aug', doses: 18, date: '2026-08-27' }
    ]
  }
};

const INITIAL_HOSPITAL_REVIEWS: Record<string, HospitalReview[]> = {
  'hosp_1': [
    {
      id: 'rev_1',
      hospitalId: 'hosp_1',
      patientName: 'Neha',
      userName: 'Neha',
      userRole: 'Verified Patient',
      rating: 5,
      comment: 'Quick vaccination service and very helpful staff. The process was simple and well organised.',
      reviewText: 'Quick vaccination service and very helpful staff. The process was simple and well organised.',
      date: '2026-08-25T14:20:00.000Z',
      verifiedVisit: true,
      cleanlinessRating: 5,
      staffRating: 5,
      waitingTimeRating: 5,
      emergencyCareRating: 5,
      categories: { cleanliness: 5, staff: 5, waitingTime: 5, emergencyCare: 5 }
    },
    {
      id: 'rev_2',
      hospitalId: 'hosp_1',
      patientName: 'Rahul',
      userName: 'Rahul',
      userRole: 'Verified Patient',
      rating: 4,
      comment: 'The hospital was clean and the appointment process was smooth. Waiting time could be improved.',
      reviewText: 'The hospital was clean and the appointment process was smooth. Waiting time could be improved.',
      date: '2026-08-22T11:10:00.000Z',
      verifiedVisit: true,
      cleanlinessRating: 5,
      staffRating: 4,
      waitingTimeRating: 4,
      emergencyCareRating: 4,
      categories: { cleanliness: 5, staff: 4, waitingTime: 4, emergencyCare: 4 }
    },
    {
      id: 'rev_3',
      hospitalId: 'hosp_1',
      patientName: 'Priya',
      userName: 'Priya',
      userRole: 'Verified Patient',
      rating: 5,
      comment: 'Very helpful emergency team. I was able to find the right department quickly.',
      reviewText: 'Very helpful emergency team. I was able to find the right department quickly.',
      date: '2026-08-20T09:45:00.000Z',
      verifiedVisit: true,
      cleanlinessRating: 5,
      staffRating: 5,
      waitingTimeRating: 5,
      emergencyCareRating: 5,
      categories: { cleanliness: 5, staff: 5, waitingTime: 5, emergencyCare: 5 }
    },
    {
      id: 'rev_4',
      hospitalId: 'hosp_1',
      patientName: 'Anonymous Patient',
      userName: 'Anonymous Patient',
      userRole: 'Verified Patient',
      rating: 5,
      comment: 'The vaccination staff explained everything clearly and guided me through the next dose.',
      reviewText: 'The vaccination staff explained everything clearly and guided me through the next dose.',
      date: '2026-08-18T16:30:00.000Z',
      verifiedVisit: true,
      cleanlinessRating: 5,
      staffRating: 5,
      waitingTimeRating: 5,
      emergencyCareRating: 5,
      categories: { cleanliness: 5, staff: 5, waitingTime: 5, emergencyCare: 5 }
    },
    {
      id: 'rev_5',
      hospitalId: 'hosp_1',
      patientName: 'Amit',
      userName: 'Amit',
      userRole: 'Verified Patient',
      rating: 4,
      comment: 'Good experience overall. The staff was supportive and the hospital was easy to locate.',
      reviewText: 'Good experience overall. The staff was supportive and the hospital was easy to locate.',
      date: '2026-08-15T10:15:00.000Z',
      verifiedVisit: true,
      cleanlinessRating: 4,
      staffRating: 5,
      waitingTimeRating: 4,
      emergencyCareRating: 4,
      categories: { cleanliness: 4, staff: 5, waitingTime: 4, emergencyCare: 4 }
    }
  ],
  'hosp_2': [
    {
      id: 'rev_201',
      hospitalId: 'hosp_2',
      patientName: 'Sanjay Deshmukh',
      rating: 5,
      reviewText: 'Very well maintained emergency clinic in Deccan. Doctors are prompt.',
      date: '2026-08-24T12:00:00.000Z',
      verifiedVisit: true
    },
    {
      id: 'rev_202',
      hospitalId: 'hosp_2',
      patientName: 'Pooja Agarwal',
      rating: 4,
      reviewText: 'Vaccine batch was verified right before administration.',
      date: '2026-08-21T15:30:00.000Z',
      verifiedVisit: true
    }
  ],
  'hosp_3': [
    {
      id: 'rev_301',
      hospitalId: 'hosp_3',
      patientName: 'Vikram Shinde',
      rating: 5,
      reviewText: '24x7 emergency department was very alert and antivenom was readily available.',
      date: '2026-08-26T02:15:00.000Z',
      verifiedVisit: true
    }
  ],
  'hosp_4': [
    {
      id: 'rev_401',
      hospitalId: 'hosp_4',
      patientName: 'Anil Jadhav',
      rating: 5,
      reviewText: 'Best emergency trauma facility in Pune with state-of-the-art ICUs.',
      date: '2026-08-23T18:40:00.000Z',
      verifiedVisit: true
    }
  ],
  'hosp_5': [
    {
      id: 'rev_501',
      hospitalId: 'hosp_5',
      patientName: 'Kavita Nair',
      rating: 4,
      reviewText: 'Good child vaccination clinic with caring staff.',
      date: '2026-08-19T11:20:00.000Z',
      verifiedVisit: true
    }
  ]
};

const INITIAL_CLINICS: Record<string, Clinic> = {
  'hosp_1': { 
    id: 'hosp_1', 
    name: 'Sunrise Multispeciality Hospital', 
    location: 'Shivajinagar, Pune',
    city: 'Pune',
    phone: '+91 90000 10001',
    licenseNumber: 'VT-HOS-1024',
    hospitalType: 'Multispeciality Emergency Hospital',
    is24x7: true,
    address: 'Near Shivajinagar Railway Station, Pune, Maharashtra 411005'
  },
  'hosp_2': { 
    id: 'hosp_2', 
    name: 'CityCare Medical Center', 
    location: 'Deccan, Pune',
    city: 'Pune',
    phone: '+91 90000 10002',
    licenseNumber: 'VT-HOS-1025',
    hospitalType: 'General Medical Center',
    is24x7: true,
    address: 'Deccan Gymkhana, Pune, Maharashtra 411004'
  },
  'hosp_3': { 
    id: 'hosp_3', 
    name: 'Lifeline Emergency Hospital', 
    location: 'Kothrud, Pune',
    city: 'Pune',
    phone: '+91 90000 10003',
    licenseNumber: 'VT-HOS-1026',
    hospitalType: '24/7 Emergency Hospital',
    is24x7: true,
    address: 'Paud Road, Kothrud, Pune, Maharashtra 411038'
  },
  'hosp_4': { 
    id: 'hosp_4', 
    name: 'Pune Trauma & Emergency Centre', 
    location: 'Aundh, Pune',
    city: 'Pune',
    phone: '+91 90000 10004',
    licenseNumber: 'VT-HOS-1027',
    hospitalType: 'Specialty Trauma Hospital',
    is24x7: true,
    address: 'DP Road, Aundh, Pune, Maharashtra 411007'
  },
  'hosp_5': { 
    id: 'hosp_5', 
    name: 'HopeCare Hospital', 
    location: 'Viman Nagar, Pune',
    city: 'Pune',
    phone: '+91 90000 10005',
    licenseNumber: 'VT-HOS-1028',
    hospitalType: 'Community Hospital',
    is24x7: false,
    address: 'Viman Nagar Main Road, Pune, Maharashtra 411014'
  },
};

const DEMO_PATIENT_ID = 'p_demo_1';
const DEMO_START_DATE = '2026-08-17T00:00:00.000Z'; // August 17, 2026

const buildDemoDoses = (patientId: string): Dose[] => {
  const rec1Str = JSON.stringify({
    patientId,
    doseNumber: 1,
    vaccineName: 'Rabies Vaccine (Rabivax-S)',
    batchNumber: 'RAB-DEMO-7824',
    administrationDate: '2026-08-17T10:00:00.000Z',
    clinicId: 'hosp_1'
  });
  const hash1 = generateHash(GENESIS_HASH + rec1Str);

  const rec2Str = JSON.stringify({
    patientId,
    doseNumber: 2,
    vaccineName: 'Rabies Vaccine (Rabivax-S)',
    batchNumber: 'RAB-DEMO-7824',
    administrationDate: '2026-08-20T10:30:00.000Z',
    clinicId: 'hosp_1'
  });
  const hash2 = generateHash(hash1 + rec2Str);

  return [
    {
      id: `d_${patientId}_1`,
      patientId,
      doseNumber: 1,
      scheduledDate: '2026-08-17T10:00:00.000Z',
      administrationDate: '2026-08-17T10:00:00.000Z',
      vaccineName: 'Rabies Vaccine (Rabivax-S)',
      batchNumber: 'RAB-DEMO-7824',
      expiryDate: '2027-01-15',
      clinicId: 'hosp_1',
      status: 'completed',
      previousHash: GENESIS_HASH,
      currentHash: hash1,
      _originalRecordDataString: rec1Str
    } as any,
    {
      id: `d_${patientId}_2`,
      patientId,
      doseNumber: 2,
      scheduledDate: '2026-08-20T10:30:00.000Z',
      administrationDate: '2026-08-20T10:30:00.000Z',
      vaccineName: 'Rabies Vaccine (Rabivax-S)',
      batchNumber: 'RAB-DEMO-7824',
      expiryDate: '2027-01-15',
      clinicId: 'hosp_1',
      status: 'completed',
      previousHash: hash1,
      currentHash: hash2,
      _originalRecordDataString: rec2Str
    } as any,
    {
      id: `d_${patientId}_3`,
      patientId,
      doseNumber: 3,
      scheduledDate: '2026-08-24T10:30:00.000Z',
      status: 'upcoming',
      previousHash: '',
      currentHash: '',
    },
    {
      id: `d_${patientId}_4`,
      patientId,
      doseNumber: 4,
      scheduledDate: '2026-08-31T10:30:00.000Z',
      status: 'upcoming',
      previousHash: '',
      currentHash: '',
    },
    {
      id: `d_${patientId}_5`,
      patientId,
      doseNumber: 5,
      scheduledDate: '2026-09-14T10:30:00.000Z',
      status: 'upcoming',
      previousHash: '',
      currentHash: '',
    }
  ];
};

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp_1',
    name: 'Free Community Vaccination Camp',
    category: 'vaccination',
    location: 'Shivajinagar Community Hall, Pune',
    city: 'Pune',
    date: '2026-08-24',
    time: '09:00 AM – 02:00 PM',
    distance: '1.2 km away',
    isFree: true,
    description: 'Free routine immunizations, Tetanus toxoid booster, and preventive health screenings.',
    isDemo: true
  },
  {
    id: 'camp_2',
    name: 'Community Blood Donation Drive',
    category: 'blood_donation',
    location: 'Deccan Gymkhana Pavilion, Pune',
    city: 'Pune',
    date: '2026-08-30',
    time: '10:00 AM – 04:00 PM',
    distance: '3.1 km away',
    isFree: true,
    description: 'Annual voluntary blood donation drive organized with Pune Central Blood Bank.',
    isDemo: true
  },
  {
    id: 'camp_3',
    name: 'Free Community Health Check-up',
    category: 'health_checkup',
    location: 'Aundh Civic Centre, Pune',
    city: 'Pune',
    date: '2026-09-05',
    time: '09:00 AM – 01:00 PM',
    distance: '5.4 km away',
    isFree: true,
    description: 'Comprehensive health check-up, vitals monitoring, diabetes screening, and doctor consultation.',
    isDemo: true
  }
];

const INITIAL_ALERTS: Alert[] = [
  {
    id: 'alt_1',
    type: 'upcoming',
    title: 'Upcoming Vaccination',
    message: 'Your Rabies PEP Dose 3 is due on 24 August 2026 at 10:30 AM.',
    date: '2026-08-24',
    time: '10:30 AM',
    location: 'Shivajinagar Emergency Medical Centre',
    patientId: DEMO_PATIENT_ID,
    createdAt: '2026-08-19T08:00:00.000Z',
    read: false
  },
  {
    id: 'alt_2',
    type: 'campaign',
    title: 'Free Health Camp',
    message: 'A free community health camp is available near Shivajinagar, Pune on 24 August 2026 (09:00 AM – 02:00 PM).',
    date: '2026-08-24',
    time: '09:00 AM – 02:00 PM',
    location: 'Shivajinagar, Pune',
    patientId: DEMO_PATIENT_ID,
    createdAt: '2026-08-19T07:30:00.000Z',
    read: false
  },
  {
    id: 'alt_3',
    type: 'campaign',
    title: 'Blood Donation Drive',
    message: 'Community blood donation drive near Deccan, Pune on 30 August 2026 (10:00 AM – 04:00 PM).',
    date: '2026-08-30',
    time: '10:00 AM – 04:00 PM',
    location: 'Deccan, Pune',
    patientId: DEMO_PATIENT_ID,
    createdAt: '2026-08-18T12:00:00.000Z',
    read: false
  },
  {
    id: 'alt_4',
    type: 'verified',
    title: 'Vaccination Record Verified',
    message: 'Your COVID-19 vaccination record (Batch CVX-DEMO-2601) has been successfully verified.',
    patientId: DEMO_PATIENT_ID,
    createdAt: '2026-08-18T09:15:00.000Z',
    read: true
  },
  {
    id: 'alt_5',
    type: 'info',
    title: 'Nearby Hospital',
    message: 'A participating hospital offering vaccination services is available near you in Shivajinagar, Pune.',
    location: 'Shivajinagar Emergency Medical Centre',
    patientId: DEMO_PATIENT_ID,
    createdAt: '2026-08-17T14:20:00.000Z',
    read: true
  }
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt_1',
    patientId: DEMO_PATIENT_ID,
    clinicId: 'hosp_1',
    doseNumber: 3,
    serviceName: 'Rabies Vaccination — Dose 3',
    date: '2026-08-24',
    time: '10:30 AM',
    status: 'scheduled'
  },
  {
    id: 'apt_2',
    patientId: DEMO_PATIENT_ID,
    clinicId: 'hosp_2',
    doseNumber: 0,
    serviceName: 'Vaccination Record Verification',
    date: '2026-08-28',
    time: '02:00 PM',
    status: 'scheduled'
  }
];

const INITIAL_INSURANCE_INQUIRIES: InsuranceInquiry[] = [
  {
    id: 'INS-DEMO-2048',
    patientId: DEMO_PATIENT_ID,
    policyId: 'sec_life_50l',
    policyName: 'SecureLife Family Protection',
    providerName: 'SecureLife Insurance — DEMO',
    fullName: 'Demo Patient',
    email: DEMO_PATIENT_EMAIL,
    phone: '+91 07387 51356',
    city: 'Pune',
    dob: '2004-04-02',
    preferredContact: 'WhatsApp',
    interestedCoverage: '₹50 Lakh',
    bestTimeToContact: '12:00 PM – 03:00 PM',
    status: 'Inquiry Submitted',
    submittedAt: '2026-08-27T09:30:00.000Z'
  }
];

const INITIAL_DISPATCHED_LOGS: DispatchedMessageLog[] = [
  {
    id: 'disp_init_1',
    patientId: DEMO_PATIENT_ID,
    reminderId: 'rem_pep_upcoming_3',
    channel: 'sms',
    recipient: '+91 07387 51356',
    sender: 'VM-VACTRK (Govt of India / MH-Health)',
    sentAt: '2026-08-19T08:00:00.000Z',
    title: 'Rabies PEP Dose 3 Advance Reminder',
    body: '[VacTrack SMS] Dear Harsh Tyagi, your Rabies PEP Dose 3 is scheduled for 24 August 2026 at 10:30 AM at Shivajinagar Emergency Medical Centre. Stock verified. Carry your QR record.',
    status: 'delivered'
  },
  {
    id: 'disp_init_2',
    patientId: DEMO_PATIENT_ID,
    reminderId: 'rem_pep_upcoming_3',
    channel: 'whatsapp',
    recipient: '+91 07387 51356',
    sender: 'VacTrack Official Health Alert ✓',
    sentAt: '2026-08-19T08:05:00.000Z',
    title: 'Rabies PEP Dose 3 Notification',
    body: '*VacTrack Vaccination Reminder*\n\nHello *Harsh Tyagi*,\n\n*Vaccine:* Rabies Vaccine (Rabivax-S) (Dose 3)\n*Due Date:* 24 August 2026 (10:30 AM)\n*Center:* Shivajinagar Emergency Medical Centre\n\n_Reminder: You have an appointment booked for Dose 3 on 24 August 2026._\n\n*Profile Reason:* Calculated from animal bite exposure date (17 Aug 2026) and Essen 5-dose protocol.\n\nReply:\n[1] Confirm Attendance\n[2] Reschedule Slot\n[3] Emergency Route Directions',
    status: 'read'
  },
  {
    id: 'disp_init_3',
    patientId: DEMO_PATIENT_ID,
    reminderId: 'rem_rig_cat3',
    channel: 'email',
    recipient: DEMO_PATIENT_EMAIL,
    sender: 'notifications@vactrack.health',
    sentAt: '2026-08-18T10:00:00.000Z',
    title: 'Important: Category III Bite Protocol Verification',
    body: 'Dear Harsh Tyagi,\n\nThis is an automated clinical notification regarding your Category III animal exposure on 17 August 2026.\n\nPlease ensure that your attending physician at Shivajinagar Emergency Medical Centre has administered Rabies Immunoglobulin (RIG) infiltration at the wound site alongside your vaccine doses.\n\nWarm regards,\nVacTrack Immunization Operations Network',
    status: 'delivered'
  }
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentDate: '2026-08-19T08:00:00.000Z',
      language: 'en',
      insuranceInquiries: INITIAL_INSURANCE_INQUIRIES,
      notificationPreferences: DEFAULT_NOTIFICATION_PREFERENCES,
      dispatchedLogs: INITIAL_DISPATCHED_LOGS,
      dismissedReminderIds: [],
      snoozedReminderMap: {},
      
      currentUser: {
        id: 'acc_demo_patient',
        email: DEMO_PATIENT_EMAIL,
        phone: '07387513560',
        name: 'Demo Patient',
        passwordHash: DEMO_PASSWORD,
        role: 'patient',
        patientId: DEMO_PATIENT_ID,
        city: 'Pune',
        preferredLanguage: 'en'
      },
      role: 'patient',
      currentClinicId: null,
      currentPatientId: DEMO_PATIENT_ID,

      accounts: {
        'acc_demo_patient': {
          id: 'acc_demo_patient',
          email: DEMO_PATIENT_EMAIL,
          phone: '07387513560',
          name: 'Demo Patient',
          passwordHash: DEMO_PASSWORD,
          role: 'patient',
          patientId: DEMO_PATIENT_ID,
          city: 'Pune'
        },
        'acc_demo_patient_alt': {
          id: 'acc_demo_patient_alt',
          email: DEMO_PATIENT_EMAIL,
          phone: '07387513560',
          name: 'Demo Patient',
          passwordHash: DEMO_PASSWORD,
          role: 'patient',
          patientId: DEMO_PATIENT_ID,
          city: 'Pune'
        },
        'acc_demo_clinic': {
          id: 'acc_demo_clinic',
          email: DEMO_HOSPITAL_EMAIL,
          phone: '9000010001',
          name: 'Shivajinagar Emergency Medical Centre',
          passwordHash: DEMO_PASSWORD,
          role: 'clinic_staff',
          clinicId: 'hosp_1'
        },
        'acc_demo_clinic_legacy': {
          id: 'acc_demo_clinic_legacy',
          email: 'staff@citycare.com',
          phone: '1111111111',
          name: 'Dr. Demo',
          passwordHash: 'password',
          role: 'clinic_staff',
          clinicId: 'hosp_1'
        }
      },
      patients: {
        [DEMO_PATIENT_ID]: {
          id: DEMO_PATIENT_ID,
          name: 'Demo Patient',
          phone: '07387513560',
          email: DEMO_PATIENT_EMAIL,
          dob: '2004-04-02',
          city: 'Pune',
          state: 'Maharashtra',
          pinCode: '411005',
          address: 'Shivajinagar, Pune, Maharashtra',
          exposureDate: DEMO_START_DATE,
          exposureCategory: 'III',
          healthRecord: {
            bloodGroup: 'B+',
            allergies: ['Penicillin'],
            medicalConditions: [],
            medications: [],
            previousVaccinations: [
              { name: 'COVID-19', date: '2021-08-20' },
              { name: 'Polio', date: '2008-03-15' },
              { name: 'Tetanus', date: '2026-06-12' }
            ],
            emergencyNotes: '',
            privacySettings: {
              shareBloodGroup: true,
              shareAllergies: true,
              shareVaccinationHistory: true,
              shareMedicalConditions: false,
              shareMedications: false
            }
          }
        }
      },
      doses: {
        [DEMO_PATIENT_ID]: buildDemoDoses(DEMO_PATIENT_ID)
      },
      clinics: INITIAL_CLINICS,
      appointments: INITIAL_APPOINTMENTS,
      alerts: INITIAL_ALERTS,
      campaigns: INITIAL_CAMPAIGNS,
      hospitalOperations: INITIAL_HOSPITAL_OPERATIONS,
      hospitalReviews: INITIAL_HOSPITAL_REVIEWS,

      setLanguage: (lang) => set({ language: lang }),
      
      login: (emailOrPhone, passwordHash) => {
        const { accounts } = get();
        const cleanInput = emailOrPhone.trim().toLowerCase();
        
        const account = Object.values(accounts).find(
          acc => (acc.email.toLowerCase() === cleanInput || acc.phone === emailOrPhone.trim()) && acc.passwordHash === passwordHash
        );
        
        if (account) {
          set({
            currentUser: account,
            role: account.role,
            currentPatientId: account.patientId || null,
            currentClinicId: account.clinicId || null
          });
          return { success: true, account };
        }
        return { success: false, error: 'Invalid credentials' };
      },

      signup: (data, patientData, hospitalData) => {
        const { accounts, clinics, registerPatient } = get();
        const id = generateUniqueId('acc');
        
        let newPatientId = undefined;
        let newClinicId = undefined;

        if (data.role === 'patient') {
           newPatientId = registerPatient({
             name: data.name,
             phone: data.phone,
             email: data.email,
             dob: patientData?.dob || '2004-04-02',
             city: data.city || 'Pune',
             state: patientData?.state || 'Maharashtra',
             pinCode: patientData?.pinCode || '411005',
             address: patientData?.address || `${data.city || 'Pune'}, Maharashtra`,
             exposureDate: patientData?.exposureDate || new Date().toISOString(),
             exposureCategory: patientData?.exposureCategory || 'III',
             healthRecord: {
               bloodGroup: (patientData as any)?.bloodGroup || 'O+',
               allergies: [],
               medicalConditions: [],
               medications: [],
               previousVaccinations: [],
               privacySettings: {
                 shareBloodGroup: true,
                 shareAllergies: true,
                 shareVaccinationHistory: true,
                 shareMedicalConditions: false,
                 shareMedications: false
               }
             }
           });
        } else if (data.role === 'clinic_staff') {
           newClinicId = generateUniqueId('hosp');
           const newClinicObj: Clinic = {
             id: newClinicId,
             name: hospitalData?.name || data.name,
             location: hospitalData?.address || `${hospitalData?.city || 'Pune'}, Maharashtra`,
             city: hospitalData?.city || 'Pune',
             phone: hospitalData?.phone || data.phone,
             licenseNumber: (hospitalData as any)?.licenseNumber || 'HOSP-REG-1001',
             hospitalType: (hospitalData as any)?.hospitalType || 'Government Hospital',
             is24x7: (hospitalData as any)?.is24x7 ?? true,
             address: hospitalData?.address || `${hospitalData?.city || 'Pune'}, Maharashtra`
           };

           set(state => ({
             clinics: { ...state.clinics, [newClinicId!]: newClinicObj }
           }));
        }

        const newAccount: Account = {
          ...data,
          id,
          patientId: newPatientId,
          clinicId: newClinicId || (data.role === 'clinic_staff' ? 'hosp_1' : undefined)
        };

        set(state => ({
          accounts: { ...state.accounts, [id]: newAccount }
        }));

        return { success: true };
      },

      logout: () => set({ currentUser: null, role: null, currentClinicId: null, currentPatientId: null }),

      setRole: (role, clinicId, patientId) => set({ role, currentClinicId: clinicId || null, currentPatientId: patientId || null }),
      
      fastForwardTime: (days) => {
        set((state) => {
          const newDate = addDays(new Date(state.currentDate), days).toISOString();
          return { currentDate: newDate };
        });
        get().updateDoseStatuses();
      },

      registerPatient: (patientData) => {
        const id = generateUniqueId('p');
        const newPatient: Patient = { 
          ...patientData, 
          id,
          healthRecord: {
            bloodGroup: 'B+',
            allergies: [],
            medicalConditions: [],
            medications: [],
            previousVaccinations: [
              { name: 'COVID-19', date: '2021-08-20' },
              { name: 'Polio', date: '2008-03-15' },
              { name: 'Tetanus', date: '2026-06-12' }
            ],
            emergencyNotes: '',
            privacySettings: {
              shareBloodGroup: true,
              shareAllergies: true,
              shareVaccinationHistory: true,
              shareMedicalConditions: false,
              shareMedications: false
            }
          }
        };
        
        // Generate blank initial doses
        const scheduleOffsets = [0, 3, 7, 14, 28];
        const expDate = new Date(newPatient.exposureDate);
        const initialDoses: Dose[] = scheduleOffsets.map((offset, index) => ({
          id: `d_${id}_${index + 1}`,
          patientId: id,
          doseNumber: index + 1,
          scheduledDate: addDays(expDate, offset).toISOString(),
          status: 'upcoming',
          previousHash: '',
          currentHash: ''
        }));
        
        set((state) => ({
          patients: { ...state.patients, [id]: newPatient },
          doses: { ...state.doses, [id]: initialDoses }
        }));
        
        get().updateDoseStatuses();
        return id;
      },

      updateHealthRecord: (patientId, updates) => {
        set((state) => {
          const patient = state.patients[patientId];
          if (!patient) return state;
          
          return {
            patients: {
              ...state.patients,
              [patientId]: {
                ...patient,
                healthRecord: {
                  ...patient.healthRecord,
                  ...updates,
                  privacySettings: {
                    ...(patient.healthRecord?.privacySettings || {
                      shareBloodGroup: false,
                      shareAllergies: false,
                      shareVaccinationHistory: false,
                      shareMedicalConditions: false,
                      shareMedications: false
                    }),
                    ...(updates.privacySettings || {})
                  }
                } as any
              }
            }
          };
        });
      },

      recordDose: (patientId, doseNumber, data) => {
        const { doses, verifyChain, addAlert } = get();
        const patientDoses = [...(doses[patientId] || [])];
        const doseIndex = doseNumber - 1;
        const dose = patientDoses[doseIndex];

        if (!dose) return { success: false, error: 'Dose not found' };

        if (doseNumber > 1) {
          const prevDose = patientDoses[doseIndex - 1];
          if (prevDose.status !== 'completed') {
            return { success: false, error: `Must complete Dose ${doseNumber - 1} first.` };
          }
        }

        // Check if expired batch
        if (data.expiryDate && isBefore(new Date(data.expiryDate), new Date(get().currentDate))) {
           addAlert({
             type: 'expired_batch',
             title: 'Dose Blocked — Expired Batch',
             message: `An attempted dose for patient ${patientId} was blocked because the vaccine batch (${data.batchNumber}) was expired.`,
             patientId
           });
           return { success: false, error: 'Vaccine Batch Expired. This vaccine batch has expired and cannot be recorded.' };
        }

        const previousHash = doseNumber === 1 ? GENESIS_HASH : patientDoses[doseIndex - 1].currentHash;
        const recordDataString = JSON.stringify({
          patientId,
          doseNumber,
          vaccineName: data.vaccineName,
          batchNumber: data.batchNumber,
          administrationDate: data.administrationDate,
          clinicId: data.clinicId
        });
        const currentHash = generateHash(previousHash + recordDataString);

        patientDoses[doseIndex] = {
          ...dose,
          ...data,
          status: 'completed',
          previousHash,
          currentHash,
          _originalRecordDataString: recordDataString
        } as Dose & { _originalRecordDataString: string };

        const targetClinicId = data.clinicId || 'hosp_1';
        set((state) => {
          const updatedHospOps = { ...state.hospitalOperations };
          const hosp = updatedHospOps[targetClinicId] || updatedHospOps['hosp_1'];
          if (hosp && hosp.usage7Days && hosp.usage7Days.length > 0) {
            const updatedUsage = hosp.usage7Days.map((u, idx) => {
              if (idx === hosp.usage7Days.length - 1) {
                return { ...u, doses: u.doses + 1 };
              }
              return u;
            });
            const currentStats = hosp.stats || {
              patientsToday: 42,
              totalVaccinesAvailable: 533,
              totalDosesUsed: 140,
              dosesAdministeredToday: 28,
              dosesThisMonth: 612,
              emergencyCases: 8
            };
            const updatedStats = {
              ...currentStats,
              totalDosesUsed: currentStats.totalDosesUsed + 1,
              dosesAdministeredToday: currentStats.dosesAdministeredToday + 1,
              dosesThisMonth: currentStats.dosesThisMonth + 1,
              totalVaccinesAvailable: Math.max(0, currentStats.totalVaccinesAvailable - 1)
            };
            updatedHospOps[hosp.id] = {
              ...hosp,
              usage7Days: updatedUsage,
              stats: updatedStats
            };
          }
          return {
            doses: { ...state.doses, [patientId]: patientDoses },
            hospitalOperations: updatedHospOps
          };
        });
        
        get().updateDoseStatuses();
        return { success: true };
      },

      simulateTampering: (patientId, doseNumber) => {
        set((state) => {
          const patientDoses = [...(state.doses[patientId] || [])];
          const doseIndex = doseNumber - 1;
          if (patientDoses[doseIndex] && patientDoses[doseIndex].status === 'completed') {
             patientDoses[doseIndex] = {
               ...patientDoses[doseIndex],
               batchNumber: 'TAMPERED-BATCH-001',
               vaccineName: 'Fake Vaccine'
             };
          }
          return { doses: { ...state.doses, [patientId]: patientDoses } };
        });
      },

      restoreTampering: (patientId, doseNumber) => {
        set((state) => {
           const patientDoses = [...(state.doses[patientId] || [])];
           const doseIndex = doseNumber - 1;
           const dose = patientDoses[doseIndex] as any;
           if (dose && dose._originalRecordDataString) {
              const originalData = JSON.parse(dose._originalRecordDataString);
              patientDoses[doseIndex] = {
                ...dose,
                batchNumber: originalData.batchNumber,
                vaccineName: originalData.vaccineName
              };
           }
           return { doses: { ...state.doses, [patientId]: patientDoses } };
        });
      },

      verifyChain: (patientId) => {
        const patientDoses = get().doses[patientId] || [];
        for (let i = 0; i < patientDoses.length; i++) {
          const dose = patientDoses[i];
          if (dose.status !== 'completed') break; 

          const expectedPrevHash = i === 0 ? GENESIS_HASH : patientDoses[i - 1].currentHash;
          if (dose.previousHash !== expectedPrevHash) {
             return { valid: false, failedAtDose: dose.doseNumber, expectedHash: expectedPrevHash, actualHash: dose.previousHash };
          }

          const recordDataString = JSON.stringify({
            patientId: dose.patientId,
            doseNumber: dose.doseNumber,
            vaccineName: dose.vaccineName,
            batchNumber: dose.batchNumber,
            administrationDate: dose.administrationDate,
            clinicId: dose.clinicId
          });
          const calculatedCurrentHash = generateHash(dose.previousHash + recordDataString);
          if (calculatedCurrentHash !== dose.currentHash) {
             return { valid: false, failedAtDose: dose.doseNumber, expectedHash: dose.currentHash, actualHash: calculatedCurrentHash };
          }
        }
        return { valid: true };
      },

      bookAppointment: (appointmentData) => {
         const id = generateUniqueId('apt');
         set((state) => ({ 
           appointments: [
             ...state.appointments, 
             { 
               ...appointmentData, 
               id, 
               status: 'scheduled',
               serviceName: appointmentData.serviceName || (appointmentData.doseNumber ? `Rabies Vaccination — Dose ${appointmentData.doseNumber}` : 'Vaccination Appointment')
             }
           ] 
         }));
      },

      addAlert: (alertData) => {
         const id = generateUniqueId('alt');
         set((state) => {
           // Avoid duplicating identical notification alerts for the same patient
           const isDuplicate = state.alerts.some(
             a => a.patientId === alertData.patientId && a.type === alertData.type && a.message === alertData.message
           );
           if (isDuplicate) return state;
           return { alerts: [{ ...alertData, id, read: false, createdAt: new Date().toISOString() }, ...state.alerts] };
         });
      },

      markAlertRead: (id) => {
         set((state) => ({
           alerts: state.alerts.map(a => a.id === id ? { ...a, read: true } : a)
         }));
      },

      submitInsuranceInquiry: (inquiryData) => {
        const id = inquiryData.id || `INS-DEMO-${Math.floor(1000 + Math.random() * 9000)}`;
        const newInquiry: InsuranceInquiry = {
          ...inquiryData,
          id,
          status: inquiryData.status || 'Inquiry Submitted',
          submittedAt: new Date().toISOString()
        };

        set((state) => ({
          insuranceInquiries: [newInquiry, ...(state.insuranceInquiries || [])]
        }));

        // Also add an informative alert in the notification center for convenience
        get().addAlert({
          type: 'info',
          title: 'Insurance Inquiry Received',
          message: `Your inquiry for ${inquiryData.policyName} (ID: ${id}) has been recorded. An authorized representative will contact you via ${inquiryData.preferredContact}.`,
          patientId: inquiryData.patientId
        });

        return id;
      },

      cancelInsuranceInquiry: (id) => {
        set((state) => ({
          insuranceInquiries: (state.insuranceInquiries || []).filter(item => item.id !== id)
        }));
      },

      updateHospitalOperations: (hospitalId, updates) => {
        set(state => {
          const current = state.hospitalOperations[hospitalId] || INITIAL_HOSPITAL_OPERATIONS[hospitalId];
          if (!current) return state;
          return {
            hospitalOperations: {
              ...state.hospitalOperations,
              [hospitalId]: {
                ...current,
                ...updates,
                lastUpdated: new Date().toISOString()
              }
            }
          };
        });
      },

      addVaccineStock: (hospitalId, item) => {
        const newId = generateUniqueId('vac');
        set(state => {
          const current = state.hospitalOperations[hospitalId] || INITIAL_HOSPITAL_OPERATIONS[hospitalId];
          if (!current) return state;
          const isExp = item.expiryDate ? isBefore(new Date(item.expiryDate), new Date(state.currentDate)) : false;
          const isLow = item.availableDoses <= item.lowStockThreshold;
          const newItem: VaccineInventoryItem = {
            ...item,
            id: newId,
            isLowStock: isLow,
            status: isExp ? 'expired' : (isLow ? 'low_stock' : 'valid')
          };
          return {
            hospitalOperations: {
              ...state.hospitalOperations,
              [hospitalId]: {
                ...current,
                inventory: [newItem, ...current.inventory],
                lastUpdated: new Date().toISOString()
              }
            }
          };
        });
      },

      updateVaccineItem: (hospitalId, itemId, updates) => {
        set(state => {
          const current = state.hospitalOperations[hospitalId] || INITIAL_HOSPITAL_OPERATIONS[hospitalId];
          if (!current) return state;
          const updatedInventory = current.inventory.map(item => {
            if (item.id === itemId) {
              const merged = { ...item, ...updates };
              let status = merged.status;
              if (merged.expiryDate && isBefore(new Date(merged.expiryDate), new Date(state.currentDate))) {
                status = 'expired';
              } else if (merged.availableDoses <= merged.lowStockThreshold) {
                status = 'low_stock';
                merged.isLowStock = true;
              } else {
                merged.isLowStock = false;
                status = 'valid';
              }
              return { ...merged, status };
            }
            return item;
          });
          return {
            hospitalOperations: {
              ...state.hospitalOperations,
              [hospitalId]: {
                ...current,
                inventory: updatedInventory,
                lastUpdated: new Date().toISOString()
              }
            }
          };
        });
      },

      updateAmbulanceStatus: (hospitalId, ambulanceId, status, route) => {
        set(state => {
          const current = state.hospitalOperations[hospitalId] || INITIAL_HOSPITAL_OPERATIONS[hospitalId];
          if (!current) return state;
          const updatedAmbulances = current.ambulances.map(amb => {
            if (amb.id === ambulanceId) {
              return {
                ...amb,
                status,
                currentRoute: route !== undefined ? route : amb.currentRoute,
                lastUpdated: new Date().toISOString()
              };
            }
            return amb;
          });
          return {
            hospitalOperations: {
              ...state.hospitalOperations,
              [hospitalId]: {
                ...current,
                ambulances: updatedAmbulances,
                lastUpdated: new Date().toISOString()
              }
            }
          };
        });
      },

      updateDoctorStatus: (hospitalId, doctorId, availability) => {
        set(state => {
          const current = state.hospitalOperations[hospitalId] || INITIAL_HOSPITAL_OPERATIONS[hospitalId];
          if (!current) return state;
          const updatedDoctors = current.doctors.map(doc => {
            if (doc.id === doctorId) {
              return { ...doc, availability };
            }
            return doc;
          });
          return {
            hospitalOperations: {
              ...state.hospitalOperations,
              [hospitalId]: {
                ...current,
                doctors: updatedDoctors,
                lastUpdated: new Date().toISOString()
              }
            }
          };
        });
      },

      addHospitalReview: (hospitalId, review) => {
        const newReviewId = generateUniqueId('rev');
        const newReview: HospitalReview = {
          ...review,
          id: newReviewId,
          hospitalId,
          date: new Date().toISOString(),
          verifiedVisit: true
        };
        set(state => {
          const currentReviews = state.hospitalReviews[hospitalId] || INITIAL_HOSPITAL_REVIEWS[hospitalId] || [];
          const updatedReviews = [newReview, ...currentReviews];
          const avgRating = Number((updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length).toFixed(1));
          const currentHosp = state.hospitalOperations[hospitalId] || INITIAL_HOSPITAL_OPERATIONS[hospitalId];
          
          return {
            hospitalReviews: {
              ...state.hospitalReviews,
              [hospitalId]: updatedReviews
            },
            hospitalOperations: currentHosp ? {
              ...state.hospitalOperations,
              [hospitalId]: {
                ...currentHosp,
                rating: avgRating,
                totalReviews: updatedReviews.length,
                lastUpdated: new Date().toISOString()
              }
            } : state.hospitalOperations
          };
        });
      },

      getPatientDoses: (patientId) => {
        return get().doses[patientId] || [];
      },

      updateNotificationPreferences: (prefs) => {
        set((state) => ({
          notificationPreferences: {
            ...state.notificationPreferences,
            ...prefs
          }
        }));
      },

      getProfileReminders: (patientId) => {
        const state = get();
        const targetId = patientId || state.currentPatientId || DEMO_PATIENT_ID;
        const patient = state.patients[targetId];
        if (!patient) return [];

        const doses = state.doses[targetId] || [];
        const rawReminders = generateProfileVaccinationReminders(
          patient,
          doses,
          state.appointments,
          state.clinics,
          state.currentDate,
          state.notificationPreferences
        );

        const now = new Date(state.currentDate);

        // Filter out dismissed reminders and active snoozed reminders
        return rawReminders.filter(rem => {
          if (state.dismissedReminderIds.includes(rem.id)) return false;
          const snoozedUntil = state.snoozedReminderMap[rem.id];
          if (snoozedUntil && isBefore(now, new Date(snoozedUntil))) return false;
          return true;
        });
      },

      dispatchTestNotification: (reminderId, channel) => {
        const state = get();
        const patientId = state.currentPatientId || DEMO_PATIENT_ID;
        const patient = state.patients[patientId];
        if (!patient) return null;

        const reminders = state.getProfileReminders(patientId);
        const reminder = reminders.find(r => r.id === reminderId) || reminders[0];
        if (!reminder) return null;

        const newLog = buildSimulatedDispatches(reminder, patient, channel);
        set(s => ({
          dispatchedLogs: [newLog, ...(s.dispatchedLogs || [])]
        }));
        return newLog;
      },

      snoozeReminder: (reminderId, days) => {
        set(state => {
          const snoozedDate = addDays(new Date(state.currentDate), days).toISOString();
          return {
            snoozedReminderMap: {
              ...state.snoozedReminderMap,
              [reminderId]: snoozedDate
            }
          };
        });
      },

      dismissReminder: (reminderId) => {
        set(state => ({
          dismissedReminderIds: [...state.dismissedReminderIds, reminderId]
        }));
      },

      restoreReminder: (reminderId) => {
        set(state => ({
          dismissedReminderIds: state.dismissedReminderIds.filter(id => id !== reminderId),
          snoozedReminderMap: {
            ...state.snoozedReminderMap,
            [reminderId]: undefined as any
          }
        }));
      },

      clearDispatchedLogs: () => {
        set({ dispatchedLogs: [] });
      },

      updateDoseStatuses: () => {
        const { doses, currentDate, addAlert, patients, appointments, clinics, notificationPreferences } = get();
        const simToday = startOfDay(new Date(currentDate));
        let updated = false;
        
        const newDoses = { ...doses };

        Object.keys(newDoses).forEach(patientId => {
          const patientDoses = [...newDoses[patientId]];
          let patientUpdated = false;

          patientDoses.forEach((dose, i) => {
            if (dose.status === 'completed') return;

            const scheduledDate = startOfDay(new Date(dose.scheduledDate));
            let newStatus: DoseStatus = 'upcoming';

            if (isSameDay(scheduledDate, simToday)) {
              newStatus = 'due_today';
            } else if (isBefore(scheduledDate, simToday)) {
              newStatus = 'overdue';
            }

            if (dose.status !== newStatus) {
               patientDoses[i] = { ...dose, status: newStatus };
               patientUpdated = true;
               
               if (newStatus === 'overdue') {
                 addAlert({
                   type: 'overdue',
                   title: `Urgent: Rabies PEP Dose ${dose.doseNumber} Overdue`,
                   message: `Patient ${patientId}: Scheduled Dose ${dose.doseNumber} was missed. Immediate administration required to maintain antibodies.`,
                   patientId
                 });

                 // Auto log SMS/WhatsApp dispatch
                 const patient = patients[patientId];
                 if (patient && notificationPreferences.smsEnabled) {
                   const formattedDate = format(simToday, 'dd MMMM yyyy');
                   set(st => ({
                     dispatchedLogs: [
                       {
                         id: generateUniqueId('disp_overdue_sms'),
                         patientId,
                         reminderId: `rem_pep_overdue_${dose.doseNumber}`,
                         channel: 'sms',
                         recipient: patient.phone || '+91 98765 43210',
                         sender: 'VM-VACTRK (Emergency Dispatch)',
                         sentAt: new Date().toISOString(),
                         title: `🚨 Urgent: Dose ${dose.doseNumber} Overdue`,
                         body: `[VacTrack Alert] URGENT! ${patient.name}, your Rabies PEP Dose ${dose.doseNumber} is OVERDUE as of ${formattedDate}. Please visit Shivajinagar Emergency Medical Centre immediately.`,
                         status: 'delivered'
                       },
                       ...(st.dispatchedLogs || [])
                     ]
                   }));
                 }
               } else if (newStatus === 'due_today') {
                 addAlert({
                   type: 'upcoming',
                   title: `Vaccination Action: Dose ${dose.doseNumber} Due Today`,
                   message: `Dose ${dose.doseNumber} of Rabies Vaccine is due today for ${patients[patientId]?.name || patientId}.`,
                   patientId
                 });

                 const patient = patients[patientId];
                 if (patient && notificationPreferences.whatsappEnabled) {
                   set(st => ({
                     dispatchedLogs: [
                       {
                         id: generateUniqueId('disp_due_wa'),
                         patientId,
                         reminderId: `rem_pep_today_${dose.doseNumber}`,
                         channel: 'whatsapp',
                         recipient: patient.phone || '+91 98765 43210',
                         sender: 'VacTrack Official Health Alert ✓',
                         sentAt: new Date().toISOString(),
                         title: `Dose ${dose.doseNumber} Due Today`,
                         body: `*VacTrack Vaccination Reminder*\n\nHello *${patient.name}*,\n\n*Vaccine:* Rabies Vaccine (Rabivax-S) (Dose ${dose.doseNumber})\n*Status:* DUE TODAY\n*Center:* Shivajinagar Emergency Medical Centre\n\n_Please report to the vaccination counter today._ Carry your VacTrack QR health record.`,
                         status: 'read'
                       },
                       ...(st.dispatchedLogs || [])
                     ]
                   }));
                 }
               }
            }
          });

          if (patientUpdated) {
            newDoses[patientId] = patientDoses;
            updated = true;
          }
        });

        if (updated) {
          set({ doses: newDoses });
        }
      },

      resetDemo: () => {
         set({
           currentDate: '2026-08-19T08:00:00.000Z',
           patients: {
            [DEMO_PATIENT_ID]: {
              id: DEMO_PATIENT_ID,
              name: 'Harsh Tyagi',
              phone: '07387513560',
              email: DEMO_PATIENT_EMAIL,
              dob: '2004-04-02',
              city: 'Pune',
              state: 'Maharashtra',
              pinCode: '411005',
              address: 'Shivajinagar, Pune, Maharashtra',
              exposureDate: DEMO_START_DATE,
              exposureCategory: 'III',
              healthRecord: {
                bloodGroup: 'B+',
                allergies: ['Penicillin'],
                medicalConditions: [],
                medications: [],
                previousVaccinations: [
                  { name: 'COVID-19', date: '2021-08-20' },
                  { name: 'Polio', date: '2008-03-15' },
                  { name: 'Tetanus', date: '2026-06-12' }
                ],
                emergencyNotes: '',
                privacySettings: {
                  shareBloodGroup: true,
                  shareAllergies: true,
                  shareVaccinationHistory: true,
                  shareMedicalConditions: false,
                  shareMedications: false
                }
              }
            }
           },
           doses: {
             [DEMO_PATIENT_ID]: buildDemoDoses(DEMO_PATIENT_ID)
           },
           appointments: INITIAL_APPOINTMENTS,
           alerts: INITIAL_ALERTS,
           campaigns: INITIAL_CAMPAIGNS,
           clinics: INITIAL_CLINICS,
           insuranceInquiries: INITIAL_INSURANCE_INQUIRIES,
           hospitalOperations: INITIAL_HOSPITAL_OPERATIONS,
           hospitalReviews: INITIAL_HOSPITAL_REVIEWS,
           currentUser: {
             id: 'acc_demo_patient',
             email: DEMO_PATIENT_EMAIL,
             phone: '07387513560',
             name: 'Demo Patient',
             passwordHash: DEMO_PASSWORD,
             role: 'patient',
             patientId: DEMO_PATIENT_ID,
             city: 'Pune'
           },
           role: 'patient',
           currentClinicId: null,
           currentPatientId: DEMO_PATIENT_ID,
           notificationPreferences: DEFAULT_NOTIFICATION_PREFERENCES,
           dispatchedLogs: INITIAL_DISPATCHED_LOGS,
           dismissedReminderIds: [],
           snoozedReminderMap: {}
         });
         get().updateDoseStatuses();
      }
    }),
    {
      name: 'vactrack-storage',
    }
  )
);
