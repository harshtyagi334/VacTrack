import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Home, Compass } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
  onClick?: () => void;
}

interface PortalBreadcrumbHeaderProps {
  portalType?: 'patient' | 'clinic';
  customCrumbs?: BreadcrumbItem[];
  backFallbackUrl?: string;
  onBack?: () => void;
  title?: string;
  subtitle?: string;
}

const ROUTE_LABELS: Record<string, string> = {
  // Patient routes
  '/patient': 'Patient Portal',
  '/patient/dashboard': 'Dashboard',
  '/patient/vaccinations': 'My Vaccination',
  '/patient/record': 'My Health Record',
  '/patient/appointments': 'Appointments',
  '/patient/qr': 'QR Record',
  '/patient/verification': 'Medicine & Vaccine Verification',
  '/patient/insurance': 'Insurance & Protection',
  '/patient/emergency': 'Emergency Care',
  '/patient/hospitals': 'Nearby Hospitals',
  '/patient/notifications': 'Notifications',
  '/patient/profile': 'Profile',
  '/patient/settings': 'Settings',

  // Clinic routes
  '/clinic': 'Hospital Portal',
  '/clinic/dashboard': 'Dashboard',
  '/clinic/patients': 'Patients',
  '/clinic/record-dose': 'Record Dose',
  '/clinic/batch-verify': 'Batch Verification',
  '/clinic/alerts': 'Alerts',
  '/clinic/appointments': 'Appointments',
  '/clinic/profile': 'Hospital Profile',
  '/clinic/settings': 'Settings'
};

export function PortalBreadcrumbHeader({
  portalType = 'patient',
  customCrumbs,
  backFallbackUrl,
  onBack,
  title,
  subtitle
}: PortalBreadcrumbHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(backFallbackUrl || (portalType === 'patient' ? '/patient/dashboard' : '/clinic/dashboard'));
    }
  };

  // Build default breadcrumbs if custom ones aren't supplied
  const crumbs: BreadcrumbItem[] = [{ label: 'Home', to: '/' }];

  if (portalType === 'patient') {
    crumbs.push({ label: 'Patient Portal', to: '/patient/dashboard' });
  } else {
    crumbs.push({ label: 'Hospital Portal', to: '/clinic/dashboard' });
  }

  if (customCrumbs && customCrumbs.length > 0) {
    crumbs.push(...customCrumbs);
  } else {
    // Determine from path
    const currentPath = location.pathname;
    const isDashboard = currentPath === '/patient/dashboard' || currentPath === '/clinic/dashboard';

    if (!isDashboard) {
      if (currentPath.startsWith('/clinic/patient/')) {
        crumbs.push({ label: 'Patients', to: '/clinic/patients' });
        crumbs.push({ label: 'Patient Record' });
      } else {
        const matchingLabel = ROUTE_LABELS[currentPath];
        if (matchingLabel) {
          crumbs.push({ label: matchingLabel });
        } else {
          // Fallback parsing
          const segments = currentPath.split('/').filter(Boolean);
          const lastSegment = segments[segments.length - 1];
          if (lastSegment) {
            const formatted = lastSegment
              .split('-')
              .map(w => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ');
            crumbs.push({ label: formatted });
          }
        }
      }
    }
  }

  const isAtPortalRoot = location.pathname === '/patient/dashboard' || location.pathname === '/clinic/dashboard';

  return (
    <div className="bg-white border-b border-[#EAE7E1] px-4 sm:px-6 py-3 shrink-0 shadow-2xs">
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Left Side: Back button + Breadcrumb Chain */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3 text-xs">
          
          {/* Back Button (shown whenever user can go back) */}
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold bg-[#F6F4F1] hover:bg-[#EAE7E1] text-[#2E2A5E] hover:text-[#E05D3F] border border-[#EAE7E1] transition-all cursor-pointer shadow-2xs group"
            title="Go to previous page"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform text-[#E05D3F]" />
            <span>Back</span>
          </button>

          <div className="h-4 w-px bg-[#EAE7E1] hidden sm:block" />

          {/* Breadcrumb Hierarchy */}
          <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-xs">
            {crumbs.map((crumb, idx) => {
              const isLast = idx === crumbs.length - 1;
              return (
                <React.Fragment key={idx}>
                  {idx > 0 && <ChevronRight size={13} className="text-[#8A847F] shrink-0" />}
                  {isLast ? (
                    <span className="font-extrabold text-[#2E2A5E] bg-[#F6F4F1] px-2 py-0.5 rounded-md border border-[#EAE7E1]/80">
                      {crumb.label}
                    </span>
                  ) : crumb.onClick ? (
                    <button
                      type="button"
                      onClick={crumb.onClick}
                      className="font-bold text-[#6B6560] hover:text-[#E05D3F] transition-colors cursor-pointer hover:underline"
                    >
                      {idx === 0 && <span className="inline mr-1">⌂</span>}
                      {crumb.label}
                    </button>
                  ) : crumb.to ? (
                    <Link
                      to={crumb.to}
                      className="font-bold text-[#6B6560] hover:text-[#E05D3F] transition-colors hover:underline flex items-center gap-1"
                    >
                      {idx === 0 && <Home size={12} className="inline text-[#E05D3F]" />}
                      <span>{crumb.label}</span>
                    </Link>
                  ) : (
                    <span className="font-medium text-[#6B6560]">{crumb.label}</span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
