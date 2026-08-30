import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DemoControls } from './components/DemoControls';

import { Home, About, HowItWorks, Features, ForPatients, ForHospitals, ForClinics, Contact, FAQ, Privacy, Terms } from './pages/PublicPages';
import { Login, Signup, ForgotPassword } from './pages/AuthPages';
import { PatientLayout } from './pages/PatientPages';
import { ClinicLayout } from './pages/ClinicPages';
import { PatientPublicVerifyPage } from './pages/PatientPublicVerifyPage';
import { useAppStore } from './store';

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode, allowedRole: 'patient' | 'clinic_staff' }) {
  const { currentUser } = useAppStore();
  if (!currentUser || currentUser.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[var(--color-soft-bg)]">
      <Navbar />
      <main className="flex-1 flex flex-col pt-[64px] sm:pt-[72px]">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/features" element={<Features />} />
          <Route path="/for-patients" element={<ForPatients />} />
          <Route path="/for-hospitals" element={<ForHospitals />} />
          <Route path="/for-clinics" element={<ForClinics />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/verify/patient/:patientId" element={<PatientPublicVerifyPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Patient Portal */}
          <Route 
            path="/patient/*" 
            element={
              <ProtectedRoute allowedRole="patient">
                <PatientLayout />
              </ProtectedRoute>
            } 
          />

          {/* Clinic Portal */}
          <Route 
            path="/clinic/*" 
            element={
              <ProtectedRoute allowedRole="clinic_staff">
                <ClinicLayout />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
      <DemoControls />
    </div>
  );
}
