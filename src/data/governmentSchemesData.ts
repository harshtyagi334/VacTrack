export interface GovernmentScheme {
  id: string;
  name: string;
  fullName: string;
  governingBody: string;
  category: 'universal' | 'state_maharashtra' | 'seniors' | 'emergency_vaccine' | 'mother_child' | 'pharmacy' | 'critical_grant';
  categoryLabel: string;
  coverageAmount: string;
  coverageSubtext: string;
  badge: string;
  badgeType: 'flagship' | 'state' | 'senior' | 'free' | 'maternity' | 'savings';
  tagline: string;
  shortDescription: string;
  highlights: string[];
  keyBenefits: string[];
  eligibilityCriteria: string[];
  coveredProceduresCount: string;
  hospitalNetwork: string;
  puneHospitals: string[];
  requiredDocuments: string[];
  howToClaim: string[];
  helpline: string;
  officialWebsite: string;
  is100PercentFree: boolean;
  priorityScore: number;
}

export interface DidYouKnowFact {
  id: string;
  tag: string;
  title: string;
  description: string;
  statNumber?: string;
  statLabel?: string;
  actionText: string;
  targetSchemeId?: string;
}

export interface PuneEmpanelledHospital {
  id: string;
  name: string;
  area: string;
  address: string;
  type: 'Government Civil Hospital' | 'Trust / Non-Profit Hospital' | 'Empanelled Private Hospital' | 'PMC Municipal Clinic';
  phone: string;
  emergencyPhone: string;
  schemesAccepted: string[];
  hasAyushmanKendraDesk: boolean;
  pepAntivenomAvailable: boolean;
  distanceEstimate: string;
}

export const GOVERNMENT_SCHEMES_DATA: GovernmentScheme[] = [
  {
    id: 'ab-pmjay',
    name: 'Ayushman Bharat (AB PM-JAY)',
    fullName: 'Pradhan Mantri Jan Arogya Yojana',
    governingBody: 'National Health Authority (NHA), Govt. of India',
    category: 'universal',
    categoryLabel: 'National Cashless Cover',
    coverageAmount: '₹5,00,000 / year',
    coverageSubtext: 'Per family per year across 28,000+ public and private hospitals',
    badge: 'National Flagship Health Cover',
    badgeType: 'flagship',
    tagline: 'Completely cashless secondary and tertiary hospitalization for vulnerable families across India.',
    shortDescription: 'The world\'s largest government-financed health assurance program, covering over 12 crore poor and vulnerable families without any pre-existing disease waiting period.',
    highlights: [
      'Cashless & paperless access at all empanelled hospitals',
      'No cap on family size, age, or gender',
      'All pre-existing medical conditions covered from Day 1',
      'Includes 3 days pre-hospitalization and 15 days post-hospitalization medicines'
    ],
    keyBenefits: [
      'Covers 1,949 medical, surgical, and diagnostic packages including oncology, neurosurgery, and cardiac care',
      'Zero out-of-pocket charges for consultations, ICU stays, blood units, medical implants, and diagnostics',
      'Nationwide portability: treatment anywhere in India at any empanelled hospital',
      'Dedicated "Ayushman Mitra" helpdesks stationed at every partner facility for immediate assistance'
    ],
    eligibilityCriteria: [
      'Families identified in Socio-Economic Caste Census (SECC 2011) database',
      'Holders of valid NFSA Antyodaya Anna Yojana (AAY) or Priority Household (PHH) Ration Cards',
      'Active Ayushman Card / Golden Card holders (verifiable via Aadhaar and Mobile OTP)',
      'No income certificate needed if name appears on the PM-JAY beneficiary portal'
    ],
    coveredProceduresCount: '1,949+ Medical & Surgical Packages',
    hospitalNetwork: '28,000+ Empanelled Hospitals Nationwide (120+ in Pune & PCMC)',
    puneHospitals: [
      'Sassoon General Hospital, Pune Railway Station',
      'KEM Hospital & Research Centre, Rasta Peth',
      'Sahyadri Super Speciality Hospital, Deccan',
      'Bharati Vidyapeeth Medical College & Hospital, Dhankawadi',
      'Poona Hospital and Research Centre, Sadashiv Peth'
    ],
    requiredDocuments: [
      'Aadhaar Card (Mandatory for biometric identity)',
      'Ration Card / Family ID document',
      'Active Mobile Number for OTP validation',
      'Existing Ayushman Golden Card (if previously issued)'
    ],
    howToClaim: [
      'Step 1: Visit any PM-JAY empanelled hospital in Pune or anywhere across India.',
      'Step 2: Approach the "Ayushman Mitra" kiosk at the hospital reception or emergency wing.',
      'Step 3: Provide your Aadhaar card or Ration card for electronic verification (takes < 5 minutes).',
      'Step 4: Receive completely cashless treatment, medications, surgery, and discharge documentation.'
    ],
    helpline: '14555 (Toll-Free 24x7) / 1800-111-565',
    officialWebsite: 'https://pmjay.gov.in',
    is100PercentFree: true,
    priorityScore: 100
  },
  {
    id: 'mjpjay-maharashtra',
    name: 'Mahatma Jyotirao Phule Jan Arogya Yojana',
    fullName: 'MJPJAY — Maharashtra State Universal Health Scheme',
    governingBody: 'State Health Assurance Society, Govt. of Maharashtra',
    category: 'state_maharashtra',
    categoryLabel: 'Maharashtra State Universal',
    coverageAmount: '₹5,00,000 / year',
    coverageSubtext: 'Per family per year across 1,000+ empanelled Maharashtra hospitals',
    badge: 'Maharashtra Citizen Benefit',
    badgeType: 'state',
    tagline: 'Comprehensive medical and surgical safety net for all ration card holders residing in Maharashtra.',
    shortDescription: 'Maharashtra\'s pride public health initiative, recently enhanced to cover up to ₹5,00,000 per family for yellow, orange, and white ration card holders with zero premium.',
    highlights: [
      'Expanded to cover Yellow, Orange, and White Ration Card families in Maharashtra',
      'Covers 996 specialized surgical and medical procedures + 121 follow-up packages',
      'Renal transplants covered up to enhanced limits of ₹2.5 Lakh to ₹4 Lakh',
      'Full coverage in leading Pune municipal, government, and premier private trust hospitals'
    ],
    keyBenefits: [
      'End-to-end cashless coverage from admission, surgery, and pathology to postoperative discharge',
      'Includes emergency polytrauma, snakebite with respiratory failure, severe rabies bite wounds, and burns',
      'Free diagnostic checkups, nursing charges, medicines, and surgical implants during hospital stay',
      'Pre-authorized emergency admissions fast-tracked within 2 hours at Pune empanelled units'
    ],
    eligibilityCriteria: [
      'Permanent resident of Maharashtra State',
      'Families holding Yellow Ration Card (BPL) or Orange Ration Card (APL up to ₹1 Lakh income)',
      'White Ration Card holders in Maharashtra (under recent state expansion guidelines)',
      'Farmers from 14 agrarian distress districts of Maharashtra'
    ],
    coveredProceduresCount: '996 Surgeries & 121 Follow-up Therapies',
    hospitalNetwork: '1,000+ Empanelled Hospitals across Maharashtra (85+ in Pune District)',
    puneHospitals: [
      'Sassoon General Hospital, Pune',
      'KEM Hospital, Rasta Peth, Pune',
      'Inamdar Multispeciality Hospital, Fatima Nagar',
      'Sanjeevan Hospital, Erandwane, Pune',
      'Kamdar Municipal Hospital, Pune Municipal Corporation'
    ],
    requiredDocuments: [
      'Valid Maharashtra Ration Card (Yellow, Orange, or White)',
      'Aadhaar Card or Voter ID of the patient',
      'Recent passport-size photograph',
      'Income Certificate (if ration card is newly applied)'
    ],
    howToClaim: [
      'Step 1: Go to the "Arogyamitra" counter at any MJPJAY network hospital in Pune.',
      'Step 2: Show your Maharashtra Ration Card and Aadhaar Card.',
      'Step 3: Arogyamitra assists the attending doctor in submitting online pre-authorization.',
      'Step 4: Treatment commences with zero out-of-pocket payment by patient or family.'
    ],
    helpline: '155388 (Toll-Free Maharashtra) / 1800-233-2200',
    officialWebsite: 'https://www.jeevandayee.gov.in',
    is100PercentFree: true,
    priorityScore: 95
  },
  {
    id: 'ayushman-vay-vandana',
    name: 'Ayushman Vay Vandana (Seniors 70+)',
    fullName: 'AB PM-JAY Universal Senior Citizen Health Assurance',
    governingBody: 'Ministry of Health & Family Welfare, Govt. of India',
    category: 'seniors',
    categoryLabel: 'Senior Citizens (70+ Years)',
    coverageAmount: '₹5,00,000 / year',
    coverageSubtext: 'Dedicated cover for EVERY senior aged 70+, regardless of family income',
    badge: 'Universal Senior Citizen Care',
    badgeType: 'senior',
    tagline: 'Universal, dedicated ₹5 Lakh healthcare protection for every Indian elderly citizen aged 70 and above.',
    shortDescription: 'Every senior citizen aged 70+ in India receives a separate, distinct Ayushman Vay Vandana Card with ₹5 Lakh annual cashless hospitalization, without depleting the family\'s regular cover.',
    highlights: [
      'Zero income or economic criteria: open to all socio-economic backgrounds',
      'Separate ₹5 Lakh allocation specifically for the senior citizen',
      'Seniors already on private health insurance or CGHS can easily opt-in or retain choice',
      'No upper age limit and zero waiting period for chronic age-related conditions'
    ],
    keyBenefits: [
      'Covers geriatric surgeries, joint replacements, cardiovascular interventions, cataract, and oncology',
      'Includes emergency hospitalization, ICU care, specialized diagnostics (MRI, CT scans), and prosthetics',
      'Fast-track paperless enrollment via Aadhaar e-KYC on the Ayushman App or VacTrack Portal',
      'Dignified, cashless admission at premier geriatric specialty wards across Pune'
    ],
    eligibilityCriteria: [
      'Any Indian citizen who has attained 70 years of age or above (as per Aadhaar Card date of birth)',
      'Applicable across all states and Union Territories implementing PM-JAY (including Maharashtra)',
      'Does not matter whether the family is wealthy, middle class, or low income'
    ],
    coveredProceduresCount: 'All 1,949 PM-JAY Packages + Specialized Geriatric Care',
    hospitalNetwork: '28,000+ Hospitals across India (including all top Pune hospitals)',
    puneHospitals: [
      'Deenanath Mangeshkar Hospital, Erandwane (Empanelled Services)',
      'Sahyadri Super Speciality Hospital, Deccan Gymkhana',
      'Sassoon General Hospital (Dedicated Senior Citizen Helpdesk)',
      'Bharati Hospital & Research Centre, Pune-Satara Road'
    ],
    requiredDocuments: [
      'Aadhaar Card (Aadhaar must confirm age is 70+)',
      'Mobile number linked to Aadhaar for OTP verification',
      'Address proof (automatically verified from Aadhaar)'
    ],
    howToClaim: [
      'Step 1: Download or print your Ayushman Vay Vandana Card (enrolled via Aadhaar).',
      'Step 2: Visit any empanelled hospital in Pune showing signs of acute or elective health distress.',
      'Step 3: Senior citizens are given priority triage at the Ayushman Mitra counter.',
      'Step 4: All admission costs, doctor fees, medications, and room charges are billed to the scheme.'
    ],
    helpline: '14555 / 1800-111-565',
    officialWebsite: 'https://beneficiary.nha.gov.in',
    is100PercentFree: true,
    priorityScore: 92
  },
  {
    id: 'nhm-free-vaccines-pep',
    name: 'National Health Mission Free Vaccines & PEP',
    fullName: 'Universal Immunization Programme & Animal Bite Management',
    governingBody: 'Ministry of Health & Family Welfare & PMC Health Dept.',
    category: 'emergency_vaccine',
    categoryLabel: 'Free Vaccines & Rabies PEP',
    coverageAmount: '100% Free (₹0)',
    coverageSubtext: 'Completely free vaccines, rabies PEP regimens, and antivenom',
    badge: '100% Free Public Benefit',
    badgeType: 'free',
    tagline: 'Zero-cost universal immunization, 5-dose rabies PEP regimens, and snakebite antivenom for every citizen.',
    shortDescription: 'India\'s Universal Immunization Programme (UIP) guarantees that all essential vaccines — including childhood regimens, adult tetanus toxoid, and emergency animal bite rabies vaccines — are administered 100% free at public facilities.',
    highlights: [
      'All 5 doses of Rabies Post-Exposure Prophylaxis (PEP) provided 100% free',
      'Rabies Immunoglobulin (RIG) provided free for Category-III bite exposures',
      'Universal childhood immunization covering 12 life-threatening diseases',
      'Polyvalent Snake Antivenom (ASV) available 24x7 at Pune civil hospitals'
    ],
    keyBenefits: [
      'Saves families ₹3,000 to ₹10,000 in private market costs for full cell-culture rabies PEP courses',
      'Cold-chain verified by government drug controllers and batch-tracked in VacTrack',
      'Available at all PMC municipal dispensaries, maternity homes, and Sassoon Hospital Pune',
      'Wound debridement, antiseptic wash, and tetanus booster included during emergency intake'
    ],
    eligibilityCriteria: [
      'Open to ALL individuals, tourists, residents, and children regardless of income, nationality, or caste',
      'Walk-in access at any government civil hospital, PMC health centre, or primary health centre (PHC)',
      'Zero paperwork barrier: emergency bite cases are treated immediately before registration'
    ],
    coveredProceduresCount: 'All UIP Vaccines + Category I, II, III Rabies PEP & Snakebite Triage',
    hospitalNetwork: 'All Government Civil, District, Sub-District, and PMC Civic Hospitals',
    puneHospitals: [
      'Sassoon General Hospital Animal Bite Treatment Unit (24x7 Open)',
      'PMC Shivajinagar Emergency Centre, FC Road',
      'PMC Kamdar Dispensary & Maternity Home, Pune',
      'KEM Hospital Emergency Casualty, Rasta Peth',
      'Hadapsar PMC Public Health Centre, Solapur Road'
    ],
    requiredDocuments: [
      'Any basic government photo ID (Aadhaar, Voter ID, Driving Licence) OR VacTrack Profile ID',
      'In emergencies, no document is strictly demanded prior to urgent medical stabilization'
    ],
    howToClaim: [
      'Step 1: In case of an animal bite or injury, immediately visit the nearest PMC or Government Civil hospital.',
      'Step 2: Wash the wound with running tap water and soap for 15 minutes at the hospital wash station.',
      'Step 3: Doctor administers Dose 1 (Day 0) Rabies vaccine and evaluates need for RIG.',
      'Step 4: Receive your scheduled vaccination card or sync your next appointments in VacTrack.'
    ],
    helpline: '108 (Emergency Ambulance) / 104 (Health Helpline) / 020-2550-8500 (PMC)',
    officialWebsite: 'https://nhm.gov.in',
    is100PercentFree: true,
    priorityScore: 90
  },
  {
    id: 'jssk-mother-child',
    name: 'Janani Shishu Suraksha Karyakram (JSSK)',
    fullName: 'JSSK Universal Maternity & Infant Entitlement Scheme',
    governingBody: 'National Health Mission & Public Health Dept. Maharashtra',
    category: 'mother_child',
    categoryLabel: 'Maternity & Child Health',
    coverageAmount: '100% Cashless + Free Transport',
    coverageSubtext: 'Zero out-of-pocket expenses for delivery, C-section & infant care',
    badge: 'Free Mother & Child Care',
    badgeType: 'maternity',
    tagline: 'Completely cashless deliveries, C-sections, blood, medicines, and ambulance transport for mothers and infants.',
    shortDescription: 'Eliminates out-of-pocket expenditure for pregnant women delivering in public health institutions, including cesarean sections, food during hospital stay, and care for sick neonates up to 1 year.',
    highlights: [
      'Zero fee for normal delivery and complicated Cesarean sections',
      'Free diagnostic tests, blood transfusion, and all prescribed medicines',
      'Free diet during stay (up to 3 days for normal, up to 7 days for C-section)',
      'Free transport from home to hospital, inter-facility transfer, and drop back home'
    ],
    keyBenefits: [
      'Guarantees full financial relief during childbirth for rural and urban women alike',
      'Sick infants up to 1 year of age receive free inpatient treatment and specialized NICU care',
      'Cash incentive under Janani Suraksha Yojana (JSY) deposited directly into mother\'s bank account',
      'Free post-natal checkups and neonatal immunization series'
    ],
    eligibilityCriteria: [
      'All pregnant women delivering in any government public health facility (district hospitals, civil hospitals, PMC hospitals)',
      'All sick neonates and infants up to 1 year seeking treatment at public facilities',
      'No income restriction or caste restriction'
    ],
    coveredProceduresCount: 'Complete Maternal, Delivery, Obstetric, and Neonatal Regimens',
    hospitalNetwork: 'All Government Maternity Homes, District Hospitals & Tertiary Medical Colleges',
    puneHospitals: [
      'Sassoon General Hospital Maternity & Neonatal Wing, Pune',
      'PMC Kamla Nehru General Hospital, Mangalwar Peth, Pune',
      'PMC Rajiv Gandhi Hospital, Yerwada, Pune',
      'PMC Late General Arunkumar Vaidya Hospital, Pune'
    ],
    requiredDocuments: [
      'Mother and Child Protection Card (MCP Card) from ASHA / Anganwadi worker',
      'Aadhaar Card of mother / father',
      'Bank passbook copy of the mother for JSY incentive transfer'
    ],
    howToClaim: [
      'Step 1: Contact your local ASHA worker or call 108 ambulance when labor signs begin.',
      'Step 2: Ambulance transfers mother to the nearest government or PMC maternity hospital for free.',
      'Step 3: Hospital provides free admission, delivery care, and nutritious meals.',
      'Step 4: Hospital arranges free drop-back vehicle to transport mother and baby home safely.'
    ],
    helpline: '108 (Free Maternal Ambulance) / 104 (Health Information)',
    officialWebsite: 'https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=842&lid=309',
    is100PercentFree: true,
    priorityScore: 88
  },
  {
    id: 'pm-national-relief-grant',
    name: 'Prime Minister\'s National Relief Fund (PMNRF)',
    fullName: 'PMNRF Financial Assistance for Critical Surgeries',
    governingBody: 'Prime Minister\'s Office (PMO), Govt. of India',
    category: 'critical_grant',
    categoryLabel: 'Critical Surgeries & Rare Diseases',
    coverageAmount: 'Up to ₹3,00,000 Direct Grant',
    coverageSubtext: 'Ex-gratia financial assistance directly disbursed to hospital for critical procedures',
    badge: 'Critical Illness Grant',
    badgeType: 'flagship',
    tagline: 'Direct ex-gratia financial grant for major heart surgeries, kidney transplants, and cancer treatments.',
    shortDescription: 'Provides immediate financial assistance to patients from economically distressed backgrounds undergoing expensive major surgeries such as heart valve replacements, renal transplants, and cancer treatments at empanelled institutions.',
    highlights: [
      'Disbursed directly to the treating hospital account on behalf of the patient',
      'Aimed at procedures where other existing insurance or schemes are exhausted',
      'Covers children, youth, and breadwinners suffering catastrophic medical conditions',
      'Simple online submission via PMNRF portal or Prime Minister\'s Office'
    ],
    keyBenefits: [
      'Covers life-saving procedures: open heart surgery, kidney transplant, cancer surgery/chemo, and brain tumors',
      'Assistance amount ranges typically between ₹50,000 to ₹3,00,000 depending on procedure severity',
      'Transparent verification directly coordinated with recognized government and trust hospitals',
      'Helps alleviate catastrophic health expenditures that push families into debt'
    ],
    eligibilityCriteria: [
      'Patients requiring specialized critical surgery who cannot afford high private costs',
      'Treatment must be conducted at a recognized government hospital or PMNRF-approved trust institution',
      'Annual family income generally under ₹1.5 Lakh to ₹2 Lakh (attested by local tehsildar/collector)'
    ],
    coveredProceduresCount: 'Heart Surgeries, Organ Transplants, Oncology, Acid Attack & Major Trauma',
    hospitalNetwork: 'Recognized Government Medical Colleges & Charitable Trust Hospitals across India',
    puneHospitals: [
      'Sassoon General Hospital & BJ Medical College, Pune',
      'KEM Hospital, Rasta Peth, Pune',
      'Tata Memorial Hospital Network (for Pune oncology referrals)',
      'AIIMS and PGIMER referral network'
    ],
    requiredDocuments: [
      'Application form signed by patient/guardian with recent photograph',
      'Original medical certificate and cost estimate signed by treating medical specialist',
      'Income Certificate issued by Revenue Authority (Tehsildar / District Collector)',
      'Copy of Aadhaar Card and Ration Card'
    ],
    howToClaim: [
      'Step 1: Obtain a standardized medical expenditure estimate letter from your treating hospital in Pune.',
      'Step 2: Attach your Tehsildar income certificate and Aadhaar copy.',
      'Step 3: Submit application online via pmnrf.gov.in or forward through the hospital medical superintendent.',
      'Step 4: Approved grant amount is electronically credited directly to the hospital billing office.'
    ],
    helpline: '011-2301-2312 (PMNRF Desk) / 1800-11-0001',
    officialWebsite: 'https://pmnrf.gov.in',
    is100PercentFree: false,
    priorityScore: 84
  },
  {
    id: 'pm-janaushadhi-pharmacy',
    name: 'Pradhan Mantri Jan Aushadhi Pariyojana (PMBJP)',
    fullName: 'Affordable Quality Generic Medicines Scheme',
    governingBody: 'Pharmaceuticals & Medical Devices Bureau of India (PMBI)',
    category: 'pharmacy',
    categoryLabel: 'Affordable Generic Medicines',
    coverageAmount: '50% to 90% Price Discount',
    coverageSubtext: 'Quality WHO-GMP certified generic medicines at a fraction of branded MRP',
    badge: 'Affordable Medicines (50-90% Off)',
    badgeType: 'savings',
    tagline: 'High quality generic prescription medicines, surgical consumables, and vaccines at 50% to 90% lower prices.',
    shortDescription: 'Over 10,000+ Jan Aushadhi Kendras operating across India (with 60+ outlets in Pune) providing over 2,040 therapeutic medicines, insulin, inhalers, blood pressure drugs, and vaccines at ultra-affordable rates.',
    highlights: [
      '50% to 90% cheaper than equivalent branded market medicines',
      'Over 2,040 medicines and 300 surgical items available off-the-shelf',
      'Stringent NABL lab testing ensures identical bio-equivalence to costly brands',
      'Jan Aushadhi Suvidha biodegradable sanitary napkins at just ₹1 per pad'
    ],
    keyBenefits: [
      'Huge ongoing savings for patients with chronic diabetes, hypertension, asthma, and cardiovascular conditions',
      'Direct walk-in access: simply bring any doctor\'s prescription containing generic names',
      'Nutritional supplements, pediatric tonics, and basic OTC first-aid items available',
      'Multiple convenient outlets located near Sassoon Hospital, Deccan, Kothrud, and Hadapsar'
    ],
    eligibilityCriteria: [
      'Open to ALL citizens with no registration, income proof, or paperwork required',
      'Simply present your doctor\'s prescription at any authorized Jan Aushadhi Kendra'
    ],
    coveredProceduresCount: '2,040+ Generic Medications & 300+ Surgical Devices',
    hospitalNetwork: '60+ Jan Aushadhi Outlets across Pune and PCMC',
    puneHospitals: [
      'Jan Aushadhi Kendra, Sassoon Hospital Gate, Pune',
      'Jan Aushadhi Kendra, FC Road, Shivajinagar, Pune',
      'Jan Aushadhi Kendra, Rasta Peth, Near KEM Hospital',
      'Jan Aushadhi Kendra, Karve Road, Kothrud, Pune'
    ],
    requiredDocuments: [
      'Valid Doctor\'s Prescription (stating generic or brand medicine names)',
      'No identification or income proof needed'
    ],
    howToClaim: [
      'Step 1: Check your regular monthly prescription for long-term medications (blood pressure, diabetes, asthma).',
      'Step 2: Locate the nearest Jan Aushadhi Kendra in Pune via VacTrack or Google Maps.',
      'Step 3: Present prescription and purchase WHO-GMP certified generics at up to 90% discount.',
      'Step 4: Save ₹2,000 to ₹5,000 every month on household pharmaceutical expenses.'
    ],
    helpline: '1800-180-8080 (Toll-Free PMBJP Helpline)',
    officialWebsite: 'https://janaushadhi.gov.in',
    is100PercentFree: false,
    priorityScore: 80
  },
  {
    id: 'rbsk-child-health',
    name: 'Rashtriya Bal Swasthya Karyakram (RBSK)',
    fullName: 'Child Health Screening & Early Intervention Services',
    governingBody: 'National Health Mission & Ministry of Health',
    category: 'mother_child',
    categoryLabel: 'Child Health (0–18 Years)',
    coverageAmount: '100% Free Child Surgeries',
    coverageSubtext: 'Zero-cost screening & tertiary surgery for congenital birth defects in children',
    badge: '100% Free Child Surgeries',
    badgeType: 'free',
    tagline: 'Comprehensive early screening and free surgeries for children (0–18 years) for 30 critical health conditions.',
    shortDescription: 'A systemic initiative to screen children from birth to 18 years for 4 Ds: Defects at birth, Diseases, Deficiencies, and Development delays including congenital heart defects, cleft lip/palate, clubfoot, and vision/hearing impairments.',
    highlights: [
      'Complete coverage from screening in schools/Anganwadis to tertiary surgeries',
      'Free corrective surgeries for Congenital Heart Disease (CHD) and Cleft Lip',
      'Free hearing aids, spectacles, neuro-rehabilitation, and physiotherapy',
      'Early intervention centres (DEIC) established at Pune district hospitals'
    ],
    keyBenefits: [
      'Children identified with heart defects receive free bypass or stenting at partner cardiac institutions',
      'Zero cost to parents: screening, investigations, travel, and surgeries are fully covered',
      'Prevents lifelong disabilities and improves school attendance and quality of life',
      'Dedicated RBSK mobile health teams regularly visit all Pune municipal schools'
    ],
    eligibilityCriteria: [
      'All children from birth to 6 years registered with Anganwadis',
      'All school-going children from 6 to 18 years enrolled in government & government-aided schools',
      'All neonates born in public healthcare institutions'
    ],
    coveredProceduresCount: '30 Identified Priority Childhood Health Conditions & Surgeries',
    hospitalNetwork: 'District Early Intervention Centres (DEIC) & Empanelled Pediatric Surgical Centres',
    puneHospitals: [
      'Aundh District Hospital DEIC Centre, Pune',
      'Sassoon General Hospital Pediatric Surgery Unit, Pune',
      'Bharati Hospital Pediatric Cardiac Unit, Pune',
      'KEM Hospital Pediatric Ward, Pune'
    ],
    requiredDocuments: [
      'Aadhaar Card of child or parent',
      'School / Anganwadi enrollment number or ID card',
      'RBSK Health Screening Card issued by visiting medical team'
    ],
    howToClaim: [
      'Step 1: Child is screened by visiting RBSK medical team at school or Anganwadi.',
      'Step 2: If a condition (e.g. heart murmur, cleft palate, visual issue) is flagged, referral card is provided.',
      'Step 3: Parent visits the District Early Intervention Centre (DEIC) at Aundh or Sassoon Hospital.',
      'Step 4: Specialized surgery or medical corrective treatment is performed 100% free.'
    ],
    helpline: '104 (Health Helpline) / 1800-11-2030',
    officialWebsite: 'https://rbsk.gov.in',
    is100PercentFree: true,
    priorityScore: 78
  }
];

export const DID_YOU_KNOW_FACTS: DidYouKnowFact[] = [
  {
    id: 'fact-1',
    tag: 'National Health Cover',
    title: '₹5,00,000 Annual Free Cashless Hospitalization',
    description: 'Under Ayushman Bharat (AB-PMJAY), eligible families get up to ₹5 Lakh per year for surgeries, cancer therapy, and ICU care across 28,000+ empanelled hospitals with zero out-of-pocket charges.',
    statNumber: '₹5,00,000',
    statLabel: 'Annual family cover',
    actionText: 'Explore AB PM-JAY',
    targetSchemeId: 'ab-pmjay'
  },
  {
    id: 'fact-2',
    tag: 'Senior Citizens (70+)',
    title: 'Universal Cover for Every Senior 70+ (No Income Limit)',
    description: 'Under the newly introduced Ayushman Vay Vandana, every senior citizen aged 70 and above receives their own separate ₹5 Lakh annual health card, regardless of family income or existing private insurance.',
    statNumber: '100% Universal',
    statLabel: 'For all citizens 70+',
    actionText: 'Check Senior Benefit',
    targetSchemeId: 'ayushman-vay-vandana'
  },
  {
    id: 'fact-3',
    tag: 'Animal Bite & Emergency',
    title: 'Rabies PEP & Antivenom are 100% Free at Civil Hospitals',
    description: 'Under National Public Health Guidelines, all 5 doses of post-exposure rabies vaccines and snakebite antivenom are provided completely free at government civil hospitals in Pune and across Maharashtra.',
    statNumber: '₹0 Cost',
    statLabel: '100% Free at Civil Units',
    actionText: 'See Free Rabies Vaccine',
    targetSchemeId: 'nhm-free-vaccines-pep'
  },
  {
    id: 'fact-4',
    tag: 'Maharashtra Citizens',
    title: 'MJPJAY Covers 996 Surgeries for Ration Card Holders',
    description: 'Maharashtra\'s flagship Mahatma Jyotirao Phule Jan Arogya Yojana covers 996 major surgeries up to ₹5 Lakh for yellow, orange, and white ration card families across 85+ Pune hospitals.',
    statNumber: '996 Surgeries',
    statLabel: 'Cashless in Maharashtra',
    actionText: 'View MJPJAY Scheme',
    targetSchemeId: 'mjpjay-maharashtra'
  },
  {
    id: 'fact-5',
    tag: 'Mothers & Infants',
    title: 'Zero-Cost Delivery & Free Ambulance under JSSK',
    description: 'Under JSSK, pregnant mothers and sick infants up to 1 year receive completely cashless deliveries, C-sections, lab diagnostics, medicines, and free 108 ambulance transport from home to hospital.',
    statNumber: 'Zero Charges',
    statLabel: 'For mother & newborn',
    actionText: 'Learn About JSSK',
    targetSchemeId: 'jssk-mother-child'
  },
  {
    id: 'fact-6',
    tag: 'Generic Pharmacy',
    title: 'Save 50% to 90% on Prescription Medications',
    description: 'Jan Aushadhi Kendras in Pune dispense high quality WHO-GMP certified generic medicines for blood pressure, diabetes, cardiac care, and asthma at up to 90% less than branded prices.',
    statNumber: '50%–90%',
    statLabel: 'Discounts on medicines',
    actionText: 'Find Jan Aushadhi',
    targetSchemeId: 'pm-janaushadhi-pharmacy'
  }
];

export const PUNE_EMPANELLED_HOSPITALS: PuneEmpanelledHospital[] = [
  {
    id: 'hosp-sassoon',
    name: 'Sassoon General Hospital & B.J. Medical College',
    area: 'Pune Railway Station / Agarkar Nagar',
    address: 'Near Pune Railway Station, Sassoon Road, Pune - 411001',
    type: 'Government Civil Hospital',
    phone: '020-2612-8000',
    emergencyPhone: '108 / 020-2612-7096',
    schemesAccepted: ['AB PM-JAY', 'MJPJAY Maharashtra', 'Ayushman Vay Vandana (70+)', 'NHM Free Vaccines & PEP', 'JSSK Maternity', 'PMNRF Critical Grants', 'RBSK Child Surgeries'],
    hasAyushmanKendraDesk: true,
    pepAntivenomAvailable: true,
    distanceEstimate: '2.8 km from City Centre'
  },
  {
    id: 'hosp-kem',
    name: 'KEM Hospital & Research Centre',
    area: 'Rasta Peth, Pune',
    address: '489, Mudaliar Road, Rasta Peth, Pune - 411011',
    type: 'Trust / Non-Profit Hospital',
    phone: '020-2606-1000',
    emergencyPhone: '020-6603-7300',
    schemesAccepted: ['AB PM-JAY', 'MJPJAY Maharashtra', 'Ayushman Vay Vandana (70+)', 'PMNRF Critical Grants', 'RBSK Pediatric Cardiac'],
    hasAyushmanKendraDesk: true,
    pepAntivenomAvailable: true,
    distanceEstimate: '3.4 km from City Centre'
  },
  {
    id: 'hosp-sahyadri',
    name: 'Sahyadri Super Speciality Hospital',
    area: 'Deccan Gymkhana, Pune',
    address: 'Plot No. 30-C, Erandwane, Karve Road, Deccan, Pune - 411004',
    type: 'Empanelled Private Hospital',
    phone: '020-6721-3000',
    emergencyPhone: '020-6721-3333',
    schemesAccepted: ['AB PM-JAY', 'MJPJAY Maharashtra', 'Ayushman Vay Vandana (70+)'],
    hasAyushmanKendraDesk: true,
    pepAntivenomAvailable: false,
    distanceEstimate: '4.1 km from City Centre'
  },
  {
    id: 'hosp-bharati',
    name: 'Bharati Hospital & Research Centre',
    area: 'Dhankawadi, Pune-Satara Road',
    address: 'Pune-Satara Road, Katraj-Dhankawadi, Pune - 411043',
    type: 'Trust / Non-Profit Hospital',
    phone: '020-4055-5555',
    emergencyPhone: '020-4055-5700',
    schemesAccepted: ['AB PM-JAY', 'MJPJAY Maharashtra', 'Ayushman Vay Vandana (70+)', 'JSSK Maternity', 'RBSK Child Surgeries'],
    hasAyushmanKendraDesk: true,
    pepAntivenomAvailable: true,
    distanceEstimate: '7.5 km from City Centre'
  },
  {
    id: 'hosp-poona',
    name: 'Poona Hospital and Research Centre',
    area: 'Sadashiv Peth, Pune',
    address: '27, Ganjwe Square, Sadashiv Peth, Pune - 411030',
    type: 'Trust / Non-Profit Hospital',
    phone: '020-2433-1707',
    emergencyPhone: '020-2433-1707',
    schemesAccepted: ['AB PM-JAY', 'MJPJAY Maharashtra', 'Ayushman Vay Vandana (70+)'],
    hasAyushmanKendraDesk: true,
    pepAntivenomAvailable: true,
    distanceEstimate: '2.5 km from City Centre'
  },
  {
    id: 'hosp-pmc-shivaji',
    name: 'PMC Shivajinagar Emergency Healthcare & Dispensary',
    area: 'FC Road, Shivajinagar, Pune',
    address: 'Near Fergusson College Gate, FC Road, Shivajinagar, Pune - 411005',
    type: 'PMC Municipal Clinic',
    phone: '020-2553-2211',
    emergencyPhone: '108 / 020-2550-8500',
    schemesAccepted: ['NHM Free Vaccines & PEP', 'Universal Immunization', 'Free OPD Diagnostics'],
    hasAyushmanKendraDesk: false,
    pepAntivenomAvailable: true,
    distanceEstimate: '1.2 km from City Centre'
  }
];

export const REQUIRED_DOCUMENTS_GUIDE = [
  {
    document: 'Aadhaar Card',
    importance: 'Mandatory',
    purpose: 'Biometric identity verification and age verification (crucial for Seniors 70+ scheme)',
    howToGet: 'Issued by UIDAI. Can be downloaded instantly online via eaadhaar.uidai.gov.in'
  },
  {
    document: 'Ration Card (Yellow / Orange / White)',
    importance: 'Mandatory for State Schemes (MJPJAY / PM-JAY)',
    purpose: 'Validates family composition and socio-economic category for state cashless benefits',
    howToGet: 'Issued by Food & Civil Supplies Dept. Available at local Tahsildar / MahaOnline Centre'
  },
  {
    document: 'Active Mobile Number',
    importance: 'Mandatory',
    purpose: 'For Aadhaar OTP authentication and receiving automated admission alerts',
    howToGet: 'Must be linked to the patient\'s Aadhaar card'
  },
  {
    document: 'Income Certificate (if applicable)',
    importance: 'Optional / Secondary',
    purpose: 'Required for specific surgical grants (PMNRF) when ration card is unavailable',
    howToGet: 'Issued by Revenue Authority / Tehsildar office or Aaple Sarkar portal'
  },
  {
    document: 'Ayushman Card (ABHA ID / Golden Card)',
    importance: 'Recommended',
    purpose: 'Fast-tracks admission at hospital kiosk without re-verifying eligibility database',
    howToGet: 'Can be generated in 2 minutes using Aadhaar on beneficiary.nha.gov.in or at hospital'
  }
];
