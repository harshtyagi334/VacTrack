export type Language = 'en' | 'hi';

export const translations = {
  en: {
    // Nav items
    home: "Home",
    about: "About",
    howItWorks: "How It Works",
    features: "Features",
    forPatients: "For Patients",
    forHospitals: "For Hospitals",
    contact: "Contact",
    login: "Login",
    signUp: "Sign Up",
    logout: "Logout",
    patientPortal: "Patient Portal",
    hospitalPortal: "Hospital Portal",

    // Home Page Hero & Sections
    heroTag: "SHA-256 Ledger Verified Immunization Network",
    heroTitle: "Cryptographically Secure Rabies & PEP Vaccine Tracking",
    heroSubtitle: "Protecting lives across Pune with tamper-proof post-exposure rabies tracking, automatic 5-dose scheduling, and real-time hospital locator.",
    getStarted: "Access Patient Portal",
    hospitalLoginBtn: "Hospital Dashboard Login",
    publicVerifyQr: "Public QR Verification",
    
    // Stats
    punePatients: "Pune Patients Protected",
    verifiedBatches: "Verified Vaccine Batches",
    partnerHospitals: "Partner Emergency Hospitals",
    ledgerUptime: "SHA-256 Ledger Uptime",

    // Features Section
    feature1Title: "Rabies PEP 5-Dose Protocol Engine",
    feature1Desc: "Automated schedule calculation (Day 0, 3, 7, 14, 28) with SMS alerts and fast-forward time simulation.",
    feature2Title: "Tamper-Evident SHA-256 Ledger",
    feature2Desc: "Cryptographic hash block chain linking every dose. Instant alert if records are altered.",
    feature3Title: "Nearby Emergency Hospitals",
    feature3Desc: "Interactive Pune map finding 24/7 hospitals with Rabies PEP and Snakebite antivenom availability.",
    feature4Title: "Privacy-Conscious Health QR",
    feature4Desc: "Publicly shareable QR record exposing only shareable verification status without compromising private medical history.",

    // About Page
    aboutTitle: "About VacTrack India",
    aboutSubtitle: "Building Pune's first decentralized, cryptographically verified immunization ledger for critical rabies & antivenom care.",
    missionTitle: "Our Mission",
    missionDesc: "Rabies post-exposure prophylaxis (PEP) is 100% effective when doses are administered strictly on schedule. VacTrack ensures zero missed doses through automated reminders, batch authentication, and cross-hospital verification.",
    whyVacTrackTitle: "Why VacTrack?",
    whyPoint1: "Zero Missed Doses: Automated smart calculation for Day 0, 3, 7, 14, and 28 PEP schedules.",
    whyPoint2: "Fake Vaccine Prevention: Verification of batch numbers before administration.",
    whyPoint3: "Emergency Locator: Instant map search for Pune emergency hospitals with antivenom stock.",

    // Login Page
    loginTitle: "Welcome Back to VacTrack",
    loginSubtitle: "Sign in to your patient account or hospital portal",
    emailOrPhone: "Email Address or Phone Number",
    password: "Password",
    loginAsPatient: "Patient Account Login",
    loginAsHospital: "Hospital Staff Login",
    demoAccountNotice: "Demo Quick Sign In:",
    patientDemoBtn: "Login as Harsh Tyagi (Patient)",
    hospitalDemoBtn: "Login as Shivajinagar Emergency Centre (Hospital)",
    noAccount: "Don't have an account?",
    registerNow: "Register / Sign Up Now",

    // Signup Page
    signupTitle: "Create Your VacTrack Account",
    signupSubtitle: "Join Pune's cryptographically secure immunization ledger",
    fullName: "Full Name",
    phone: "Phone Number",
    email: "Email Address (Optional)",
    city: "City / District",
    roleSelection: "I am registering as:",
    patientRole: "Patient / General Public",
    hospitalRole: "Hospital / Healthcare Provider",
    exposureDate: "Rabies Exposure Date (If applicable)",
    registerBtn: "Complete Registration & Access Portal",
    alreadyHaveAccount: "Already have an account?",

    // Public QR Verification Page
    publicVerifyTitle: "VacTrack Verified Health Record",
    verifiedRecordBadge: "✓ Cryptographically Verified Record",
    shareableInfoOnly: "🔒 Patient Privacy Active: Displaying Shareable Information Only",
    vaccinationHistory: "Vaccination History",
    allergies: "Allergies",
    bloodGroup: "Blood Group",
    recordId: "Record ID",

    // Emergency Hospitals Page
    nearbyHospitalsTitle: "Nearby Emergency Hospitals in Pune",
    mapView: "Interactive Hospital Locator Map",
    searchHospital: "Search hospital by name, area (e.g. Shivajinagar, Kothrud, Aundh)...",
    emergencyDept: "24/7 Emergency Department",
    rabiesPepAvailable: "Rabies PEP Available",
    antivenomAvailable: "Antivenom Stocked",
    getDirections: "Get Directions",
    callHospital: "Call Hospital",

    // Patient Dashboard & Health Record
    myHealthRecord: "My Health Record",
    personalInformation: "Personal Information",
    medicalHistory: "Medical History",
    medicalTimeline: "Visual Medical Timeline",
    importantAllergy: "Important Allergy Alert",
    myQrHealthRecord: "My QR Health Record"
  },
  hi: {
    // Nav items
    home: "होम (Home)",
    about: "हमारे बारे में (About)",
    howItWorks: "यह कैसे काम करता है",
    features: "विशेषताएं (Features)",
    forPatients: "मरीजों के लिए",
    forHospitals: "अस्पतालों के लिए",
    contact: "संपर्क करें",
    login: "लॉगिन करें (Login)",
    signUp: "साइन अप करें (Sign Up)",
    logout: "लॉगआउट (Logout)",
    patientPortal: "मरीज पोर्टल",
    hospitalPortal: "अस्पताल पोर्टल",

    // Home Page Hero & Sections
    heroTag: "SHA-256 बहीखाता द्वारा सत्यापित टीकाकरण नेटवर्क",
    heroTitle: "रेबीज और पीईपी वैक्सीन ट्रैकिंग का सुरक्षित डिजिटल सिस्टम",
    heroSubtitle: "पुणे में रेबीज के मामलों के लिए 5-खुराक की स्वचालित समय-सारणी, छेड़छाड़-मुक्त डिजिटल रिकॉर्ड और निकटतम आपातकालीन अस्पताल खोजक।",
    getStarted: "मरीज पोर्टल खोलें",
    hospitalLoginBtn: "अस्पताल डैशबोर्ड लॉगिन",
    publicVerifyQr: "सार्वजनिक क्यूआर सत्यापन",

    // Stats
    punePatients: "सुरक्षित मरीज (पुणे)",
    verifiedBatches: "सत्यापित वैक्सीन बैच",
    partnerHospitals: "साझेदार आपातकालीन अस्पताल",
    ledgerUptime: "SHA-256 लेजर उपलब्धता",

    // Features Section
    feature1Title: "रेबीज PEP 5-खुराक प्रोटोकॉल इंजन",
    feature1Desc: "दिवस 0, 3, 7, 14, 28 के लिए स्वचालित समय-सारणी गणना, एसएमएस रिमाइंडर और समय सिमुलेशन।",
    feature2Title: "सुरक्षित SHA-256 ब्लॉकचेन बहीखाता",
    feature2Desc: "प्रत्येक खुराक का डिजिटल ब्लॉकचेन रिकॉर्ड। यदि रिकॉर्ड में छेड़छाड़ होती है तो तुरंत अलर्ट।",
    feature3Title: "निकटतम आपातकालीन अस्पताल खोजक",
    feature3Desc: "पुणे में 24/7 रेबीज पीईपी और सांप के जहर (एंटीवेनम) की उपलब्धता वाले अस्पतालों का इंटरैक्टिव नक्शा।",
    feature4Title: "गोपनीयता-सुरक्षित स्वास्थ्य क्यूआर",
    feature4Desc: "मरीज की निजी मेडिकल हिस्ट्री उजागर किए बिना केवल शेयर योग्य रिकॉर्ड दिखाने वाला सुरक्षित क्यूआर कोड।",

    // About Page
    aboutTitle: "वैक्ट्रैक (VacTrack) इंडिया के बारे में",
    aboutSubtitle: "रेबीज और आपातकालीन चिकित्सा देखभाल के लिए पुणे का पहला सुरक्षित, विकेंद्रीकृत टीकाकरण नेटवर्क।",
    missionTitle: "हमारा उद्देश्य (Our Mission)",
    missionDesc: "रेबीज का इलाज 100% प्रभावी है यदि खुराक समय पर ली जाए। वैक्ट्रैक स्वचालित रिमाइंडरों और अस्पताल सत्यापन के माध्यम से खुराक छूटने से रोकता है।",
    whyVacTrackTitle: "वैक्ट्रैक क्यों चुनें?",
    whyPoint1: "कोई खुराक न छूटे: 0, 3, 7, 14 और 28 दिनों की स्वचालित समय-सारणी गणना।",
    whyPoint2: "नकली टीकों से बचाव: खुराक देने से पहले वैक्सीन बैच नंबर की तुरंत जांच।",
    whyPoint3: "आपातकालीन खोजक: पुणे में एंटीवेनम स्टॉक वाले 24/7 अस्पतालों की तुरंत मैप खोज।",

    // Login Page
    loginTitle: "वैक्ट्रैक में आपका स्वागत है",
    loginSubtitle: "अपने मरीज खाते या अस्पताल पोर्टल में साइन इन करें",
    emailOrPhone: "ईमेल पता या मोबाइल नंबर",
    password: "पासवर्ड",
    loginAsPatient: "मरीज खाता लॉगिन",
    loginAsHospital: "अस्पताल स्टाफ लॉगिन",
    demoAccountNotice: "डेमो तुरंत साइन इन करें:",
    patientDemoBtn: "राज पटेल के रूप में लॉगिन करें (मरीज)",
    hospitalDemoBtn: "शिवाजीनगर इमरजेंसी सेंटर के रूप में लॉगिन करें (अस्पताल)",
    noAccount: "क्या आपका खाता नहीं है?",
    registerNow: "अभी पंजीकरण / साइन अप करें",

    // Signup Page
    signupTitle: "अपना वैक्ट्रैक खाता बनाएं",
    signupSubtitle: "पुणे के सुरक्षित डिजिटल टीकाकरण नेटवर्क से जुड़ें",
    fullName: "पूरा नाम",
    phone: "मोबाइल नंबर",
    email: "ईमेल पता (वैकल्पिक)",
    city: "शहर / जिला",
    roleSelection: "मैं पंजीकृत हो रहा हूँ:",
    patientRole: "मरीज / सामान्य नागरिक",
    hospitalRole: "अस्पताल / स्वास्थ्य सेवा प्रदाता",
    exposureDate: "रेबीज संपर्क/काटने की तारीख (यदि लागू हो)",
    registerBtn: "पंजीकरण पूरा करें और पोर्टल में प्रवेश करें",
    alreadyHaveAccount: "क्या आपके पास पहले से खाता है?",

    // Public QR Verification Page
    publicVerifyTitle: "वैक्ट्रैक द्वारा सत्यापित स्वास्थ्य रिकॉर्ड",
    verifiedRecordBadge: "✓ डिजिटल रूप से सत्यापित रिकॉर्ड",
    shareableInfoOnly: "🔒 मरीज की गोपनीयता लागू: केवल साझा करने योग्य जानकारी दिखाई जा रही है",
    vaccinationHistory: "टीकाकरण इतिहास",
    allergies: "एलर्जी (Allergies)",
    bloodGroup: "ब्लड ग्रुप",
    recordId: "रिकॉर्ड आईडी",

    // Emergency Hospitals Page
    nearbyHospitalsTitle: "पुणे में निकटतम आपातकालीन अस्पताल",
    mapView: "इंटरैक्टिव अस्पताल लोकेटर नक्शा",
    searchHospital: "अस्पताल नाम या क्षेत्र द्वारा खोजें (जैसे शिवाजीनगर, कोथरूड, औंध)...",
    emergencyDept: "24/7 आपातकालीन विभाग",
    rabiesPepAvailable: "रेबीज PEP उपलब्ध है",
    antivenomAvailable: "एंटीवेनम उपलब्ध है",
    getDirections: "रास्ता (Directions) देखें",
    callHospital: "अस्पताल को कॉल करें",

    // Patient Dashboard & Health Record
    myHealthRecord: "मेरा स्वास्थ्य रिकॉर्ड",
    personalInformation: "व्यक्तिगत जानकारी",
    medicalHistory: "चिकित्सा इतिहास",
    medicalTimeline: "डिजिटल मेडिकल टाइमलाइन",
    importantAllergy: "महत्वपूर्ण एलर्जी अलर्ट",
    myQrHealthRecord: "मेरा क्यूआर स्वास्थ्य रिकॉर्ड"
  }
};

export function getTranslation(lang: Language) {
  return translations[lang] || translations.en;
}
