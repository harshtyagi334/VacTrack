import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './ui/Logo';

export function Footer() {
  return (
    <footer className="bg-[#2E2A5E] text-white border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
           <Link to="/" className="inline-block mb-4">
             <Logo theme="dark" />
           </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              Never Miss a Dose. Verify Every Vaccine. A secure, connected, tamper-evident immunization network.
            </p>
        </div>
        <div>
          <h4 className="font-heading font-bold text-sm text-[#F2A93B] mb-3 uppercase tracking-wider">Platform</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link to="/features" className="hover:text-[#E05D3F] transition-colors">Features</Link></li>
            <li><Link to="/how-it-works" className="hover:text-[#E05D3F] transition-colors">How It Works</Link></li>
            <li><Link to="/for-patients" className="hover:text-[#E05D3F] transition-colors">For Patients</Link></li>
            <li><Link to="/for-hospitals" className="hover:text-[#E05D3F] transition-colors">For Hospitals & Clinics</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading font-bold text-sm text-[#F2A93B] mb-3 uppercase tracking-wider">Information</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link to="/about" className="hover:text-[#E05D3F] transition-colors">About Mission</Link></li>
            <li><Link to="/contact" className="hover:text-[#E05D3F] transition-colors">Contact Support</Link></li>
            <li><Link to="/faq" className="hover:text-[#E05D3F] transition-colors">Frequently Asked Questions</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading font-bold text-sm text-[#F2A93B] mb-3 uppercase tracking-wider">Compliance & Standards</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link to="/privacy" className="hover:text-[#E05D3F] transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-[#E05D3F] transition-colors">Terms of Service</Link></li>
            <li className="text-xs text-white/50 pt-2">Aligned with DISHA & ABDM Digital Health guidelines for tamper-evident data continuity.</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/10 text-xs text-white/50 flex flex-col md:flex-row justify-between items-center gap-2">
        <p>&copy; {new Date().getFullYear()} VacTrack Prototype • Pune Healthcare Corridor</p>
        <p>SHA-256 Verified • Distributed Hospital Node Architecture</p>
      </div>
    </footer>
  );
}
