import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { 
  Bell, CheckCircle2, Clock, AlertTriangle, ShieldCheck, 
  MessageSquare, Smartphone, Mail, Settings, RefreshCw,
  MapPin, Calendar, HeartPulse, ShieldAlert, ArrowRight,
  ExternalLink, Eye, Check, X, Sliders, ChevronRight, User
} from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Card, CardContent } from './ui/Card';
import { format, parseISO } from 'date-fns';
import { VaccinationReminder, ReminderUrgency } from '../types';

export function PatientNotificationCenter() {
  const { 
    currentUser, 
    patients, 
    currentDate, 
    getProfileReminders, 
    notificationPreferences, 
    updateNotificationPreferences,
    dispatchedLogs,
    dispatchTestNotification,
    snoozeReminder,
    dismissReminder,
    clearDispatchedLogs,
    fastForwardTime
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'reminders' | 'logs' | 'preferences' | 'campaigns'>('reminders');
  const [filterUrgency, setFilterUrgency] = useState<'all' | 'critical' | 'upcoming' | 'boosters'>('all');
  const [logChannelFilter, setLogChannelFilter] = useState<'all' | 'whatsapp' | 'sms' | 'email'>('all');
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const patientId = currentUser?.patientId || 'p_demo_1';
  const patient = patients[patientId] || {
    id: patientId,
    name: currentUser?.name || 'Harsh Tyagi',
    phone: currentUser?.phone || '07387513560',
    email: currentUser?.email || 'patient.demo@example.com',
    dob: '2004-04-02',
    exposureCategory: 'III',
    exposureDate: '2026-08-17T00:00:00.000Z',
    city: 'Pune',
    state: 'Maharashtra',
    healthRecord: {
      bloodGroup: 'B+',
      allergies: ['Penicillin'],
      previousVaccinations: [
        { name: 'COVID-19', date: '2021-08-20' },
        { name: 'Tetanus', date: '2026-06-12' }
      ]
    }
  };

  const reminders = getProfileReminders(patientId);

  const triggerScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setSuccessToast('Profile-driven immunization scan complete. All schedules up to date.');
      setTimeout(() => setSuccessToast(null), 3500);
    }, 600);
  };

  const handleTestDispatch = (reminder: VaccinationReminder, channel: 'sms' | 'whatsapp' | 'email') => {
    const log = dispatchTestNotification(reminder.id, channel);
    if (log) {
      setSuccessToast(`Dispatched simulated ${channel.toUpperCase()} reminder to ${log.recipient}!`);
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  const filteredReminders = reminders.filter(rem => {
    if (filterUrgency === 'critical') return rem.urgency === 'critical';
    if (filterUrgency === 'upcoming') return rem.status === 'upcoming' || rem.status === 'due_today';
    if (filterUrgency === 'boosters') return rem.status === 'recommended_booster';
    return true;
  });

  const criticalCount = reminders.filter(r => r.urgency === 'critical').length;
  const upcomingCount = reminders.filter(r => r.status === 'upcoming' || r.status === 'due_today').length;
  const boosterCount = reminders.filter(r => r.status === 'recommended_booster').length;

  const filteredLogs = (dispatchedLogs || []).filter(log => {
    if (logChannelFilter === 'all') return true;
    return log.channel === logChannelFilter;
  });

  const getUrgencyBadge = (urgency: ReminderUrgency, status: string) => {
    if (status === 'overdue') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#FEF2F2] text-[#B91C1C] border border-[#FCA5A5] animate-pulse">
          <AlertTriangle size={13} /> OVERDUE
        </span>
      );
    }
    if (status === 'due_today') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#FFFBEB] text-[#B45309] border border-[#FCD34D]">
          <Clock size={13} /> DUE TODAY
        </span>
      );
    }
    if (urgency === 'high') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5]">
          <Clock size={13} /> High Priority
        </span>
      );
    }
    if (status === 'recommended_booster') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
          <HeartPulse size={13} /> Preventive Booster
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
        <CheckCircle2 size={13} /> Routine Status
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      
      {/* Toast notification */}
      {successToast && (
        <div className="fixed top-20 right-4 z-50 bg-[#2E2A5E] text-white px-5 py-3 rounded-2xl shadow-xl border border-white/20 text-sm font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={18} className="text-[#10B981]" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#EAE7E1] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#F6F4F1] text-[#E05D3F] mb-2 border border-[#EAE7E1]">
              <Bell size={13} className="text-[#E05D3F]" /> Smart Profile-Driven Immunization Reminders
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#2E2A5E]">
              Vaccination Reminders & Alerts
            </h1>
            <p className="text-[#6B6560] text-xs sm:text-sm mt-1">
              Personalized alerts dynamically generated from your age, animal exposure history, health record allergies, and routine booster intervals.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button 
              onClick={triggerScan} 
              variant="outline" 
              className="flex items-center gap-2 rounded-xl text-xs font-extrabold border-[#EAE7E1] hover:bg-[#F6F4F1]"
              disabled={isScanning}
            >
              <RefreshCw size={14} className={isScanning ? "animate-spin text-[#E05D3F]" : "text-[#2E2A5E]"} />
              <span>{isScanning ? 'Evaluating Profile...' : 'Scan Profile Reminders'}</span>
            </Button>
          </div>
        </div>

        {/* Patient Profile Evaluation Factor Strip */}
        <div className="pt-4 border-t border-[#EAE7E1] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-[#F6F4F1] p-3 rounded-xl border border-[#EAE7E1]">
            <span className="text-[#8A847F] text-[10px] font-bold uppercase tracking-wider block">Age & Demographic</span>
            <span className="font-extrabold text-[#2E2A5E] text-xs block mt-0.5">22 Years (02 Apr 2004)</span>
            <span className="text-[10px] text-[#1B7A3D] font-medium">Adult Schedule Active</span>
          </div>

          <div className="bg-[#F6F4F1] p-3 rounded-xl border border-[#EAE7E1]">
            <span className="text-[#8A847F] text-[10px] font-bold uppercase tracking-wider block">Active Exposure</span>
            <span className="font-extrabold text-[#E05D3F] text-xs block mt-0.5">Category III Animal Bite</span>
            <span className="text-[10px] text-[#6B6560] font-medium">17 Aug 2026 • Essen Protocol</span>
          </div>

          <div className="bg-[#F6F4F1] p-3 rounded-xl border border-[#EAE7E1]">
            <span className="text-[#8A847F] text-[10px] font-bold uppercase tracking-wider block">Allergy Caution</span>
            <span className="font-extrabold text-[#D97706] text-xs block mt-0.5">Penicillin Recorded</span>
            <span className="text-[10px] text-[#6B6560] font-medium">Flagged on clinic slips</span>
          </div>

          <div className="bg-[#F6F4F1] p-3 rounded-xl border border-[#EAE7E1]">
            <span className="text-[#8A847F] text-[10px] font-bold uppercase tracking-wider block">Assigned Center</span>
            <span className="font-extrabold text-[#2E2A5E] text-xs block mt-0.5">Shivajinagar Emergency</span>
            <span className="text-[10px] text-[#1B7A3D] font-medium">24x7 Antivenom & PEP</span>
          </div>
        </div>
      </div>

      {/* Quick Status Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => { setActiveTab('reminders'); setFilterUrgency('all'); }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'reminders' && filterUrgency === 'all'
              ? 'bg-white border-[#2E2A5E] shadow-sm'
              : 'bg-white border-[#EAE7E1] hover:border-[#2E2A5E]'
          }`}
        >
          <span className="text-xs text-[#8A847F] font-bold uppercase tracking-wider block">Total Reminders</span>
          <span className="text-2xl font-extrabold text-[#2E2A5E] mt-1 block">{reminders.length}</span>
          <span className="text-[10px] text-[#6B6560] font-medium">Across active & routine</span>
        </button>

        <button
          onClick={() => { setActiveTab('reminders'); setFilterUrgency('critical'); }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'reminders' && filterUrgency === 'critical'
              ? 'bg-[#FEF2F2] border-[#B91C1C] shadow-sm'
              : 'bg-white border-[#EAE7E1] hover:border-[#B91C1C]'
          }`}
        >
          <span className="text-xs text-[#B91C1C] font-bold uppercase tracking-wider block">Critical / Due Today</span>
          <span className="text-2xl font-extrabold text-[#B91C1C] mt-1 block">{criticalCount}</span>
          <span className="text-[10px] text-[#B91C1C] font-medium">Immediate action needed</span>
        </button>

        <button
          onClick={() => { setActiveTab('reminders'); setFilterUrgency('upcoming'); }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'reminders' && filterUrgency === 'upcoming'
              ? 'bg-[#FFFBEB] border-[#D97706] shadow-sm'
              : 'bg-white border-[#EAE7E1] hover:border-[#D97706]'
          }`}
        >
          <span className="text-xs text-[#B45309] font-bold uppercase tracking-wider block">Upcoming Doses</span>
          <span className="text-2xl font-extrabold text-[#B45309] mt-1 block">{upcomingCount}</span>
          <span className="text-[10px] text-[#6B6560] font-medium">Next 14 days schedule</span>
        </button>

        <button
          onClick={() => { setActiveTab('logs'); }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-[#F0FDF4] border-[#15803D] shadow-sm'
              : 'bg-white border-[#EAE7E1] hover:border-[#15803D]'
          }`}
        >
          <span className="text-xs text-[#15803D] font-bold uppercase tracking-wider block">Dispatched Logs</span>
          <span className="text-2xl font-extrabold text-[#15803D] mt-1 block">{(dispatchedLogs || []).length}</span>
          <span className="text-[10px] text-[#6B6560] font-medium">SMS, WhatsApp & Email</span>
        </button>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EAE7E1] pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('reminders')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'reminders'
                ? 'bg-[#E05D3F] text-white shadow-xs'
                : 'bg-white text-[#6B6560] hover:bg-[#F6F4F1] border border-[#EAE7E1]'
            }`}
          >
            <Clock size={15} />
            <span>Profile Reminders ({reminders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'logs'
                ? 'bg-[#E05D3F] text-white shadow-xs'
                : 'bg-white text-[#6B6560] hover:bg-[#F6F4F1] border border-[#EAE7E1]'
            }`}
          >
            <Smartphone size={15} />
            <span>Dispatched Alerts ({dispatchedLogs?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'preferences'
                ? 'bg-[#E05D3F] text-white shadow-xs'
                : 'bg-white text-[#6B6560] hover:bg-[#F6F4F1] border border-[#EAE7E1]'
            }`}
          >
            <Sliders size={15} />
            <span>Delivery Preferences</span>
          </button>
        </div>

        {activeTab === 'reminders' && (
          <div className="flex items-center gap-1 text-xs">
            <span className="text-[#8A847F] text-[11px] font-bold mr-1">Filter:</span>
            {(['all', 'critical', 'upcoming', 'boosters'] as const).map(flt => (
              <button
                key={flt}
                onClick={() => setFilterUrgency(flt)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                  filterUrgency === flt
                    ? 'bg-[#2E2A5E] text-white'
                    : 'bg-white text-[#6B6560] border border-[#EAE7E1] hover:bg-[#F6F4F1]'
                }`}
              >
                {flt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB 1: PROFILE-BASED REMINDERS */}
      {activeTab === 'reminders' && (
        <div className="space-y-4">
          {filteredReminders.map((rem) => {
            const isDueToday = rem.status === 'due_today';
            const isOverdue = rem.status === 'overdue';

            return (
              <div 
                key={rem.id}
                className={`bg-white rounded-2xl border-2 p-5 sm:p-6 transition-all shadow-2xs relative ${
                  isOverdue ? 'border-[#FCA5A5] bg-[#FEF2F2]/30' :
                  isDueToday ? 'border-[#FCD34D] bg-[#FFFBEB]/30' :
                  'border-[#EAE7E1] hover:border-[#2E2A5E]'
                }`}
              >
                {/* Top Badge & Time Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    {getUrgencyBadge(rem.urgency, rem.status)}
                    <span className="text-xs font-bold text-[#8A847F] bg-[#F6F4F1] px-2.5 py-0.5 rounded-md border border-[#EAE7E1]">
                      {rem.badgeText || rem.vaccineName}
                    </span>
                  </div>

                  <div className="text-xs font-extrabold text-[#2E2A5E] flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#E05D3F]" />
                    <span>Scheduled: {rem.dueDateFormatted}</span>
                  </div>
                </div>

                {/* Title & Message */}
                <h3 className="text-lg font-bold text-[#2E2A5E] font-heading">
                  {rem.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6B6560] mt-1 leading-relaxed">
                  {rem.message}
                </p>

                {/* Explicit Profile Data Basis Callout */}
                <div className="mt-3 bg-[#F6F4F1] p-3 rounded-xl border border-[#EAE7E1] flex items-start gap-2.5 text-xs">
                  <User size={15} className="text-[#E05D3F] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-[#2E2A5E] block text-[11px] uppercase tracking-wider">
                      Triggered By Patient Profile Data:
                    </span>
                    <p className="text-[#4B5563] text-xs font-medium mt-0.5">
                      {rem.profileReason}
                    </p>
                  </div>
                </div>

                {/* Facility & Location Info */}
                <div className="mt-3 pt-3 border-t border-[#EAE7E1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-[#6B6560]">
                    <MapPin size={14} className="text-[#E05D3F] shrink-0" />
                    <span className="font-bold text-[#2E2A5E]">{rem.recommendedFacilityName}</span>
                    <span className="hidden sm:inline text-[#8A847F]">• {rem.recommendedFacilityPhone}</span>
                  </div>

                  {rem.appointmentId && (
                    <span className="text-[#1B7A3D] font-extrabold flex items-center gap-1 bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
                      <CheckCircle2 size={12} /> Appointment Confirmed
                    </span>
                  )}
                </div>

                {/* Interactive Actions & Simulation Triggers */}
                <div className="mt-4 pt-3 border-t border-[#EAE7E1] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {rem.suggestedAction === 'visit_er' ? (
                      <Link to="/patient/emergency">
                        <Button size="sm" className="bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-extrabold rounded-xl px-4 py-2 shadow-xs">
                          Emergency ER Instructions →
                        </Button>
                      </Link>
                    ) : rem.suggestedAction === 'book_appointment' ? (
                      <Link to="/patient/appointments">
                        <Button size="sm" className="bg-[#E05D3F] hover:bg-[#c94f33] text-white text-xs font-extrabold rounded-xl px-4 py-2 shadow-xs">
                          Book Clinic Slot →
                        </Button>
                      </Link>
                    ) : (
                      <Link to="/patient/qr">
                        <Button size="sm" variant="outline" className="text-xs font-extrabold rounded-xl border-[#2E2A5E] text-[#2E2A5E] hover:bg-[#F6F4F1]">
                          View Verified QR Record
                        </Button>
                      </Link>
                    )}

                    {/* Snooze button */}
                    <button
                      onClick={() => {
                        snoozeReminder(rem.id, 2);
                        setSuccessToast('Reminder snoozed for 2 days.');
                        setTimeout(() => setSuccessToast(null), 3000);
                      }}
                      className="px-2.5 py-1.5 rounded-xl border border-[#EAE7E1] hover:bg-[#F6F4F1] text-[11px] font-bold text-[#6B6560] cursor-pointer"
                      title="Snooze reminder for 2 days"
                    >
                      Snooze 2d
                    </button>

                    <button
                      onClick={() => dismissReminder(rem.id)}
                      className="px-2.5 py-1.5 rounded-xl border border-[#EAE7E1] hover:bg-[#F6F4F1] text-[11px] font-bold text-[#8A847F] cursor-pointer"
                      title="Dismiss this reminder"
                    >
                      Dismiss
                    </button>
                  </div>

                  {/* Channel Test Dispatch Buttons */}
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-[#8A847F] font-bold hidden sm:inline">Simulate Alert:</span>
                    <button
                      onClick={() => handleTestDispatch(rem, 'whatsapp')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#25D366]/10 text-[#075E54] hover:bg-[#25D366]/20 font-extrabold border border-[#25D366]/30 transition-colors cursor-pointer"
                      title="Simulate WhatsApp Message Dispatch"
                    >
                      <MessageSquare size={12} /> WhatsApp
                    </button>

                    <button
                      onClick={() => handleTestDispatch(rem, 'sms')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#2E2A5E]/5 text-[#2E2A5E] hover:bg-[#2E2A5E]/15 font-extrabold border border-[#2E2A5E]/20 transition-colors cursor-pointer"
                      title="Simulate Mobile SMS Dispatch"
                    >
                      <Smartphone size={12} /> SMS
                    </button>

                    <button
                      onClick={() => handleTestDispatch(rem, 'email')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-extrabold border border-blue-200 transition-colors cursor-pointer"
                      title="Simulate Email Notification"
                    >
                      <Mail size={12} /> Email
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredReminders.length === 0 && (
            <div className="bg-white p-8 rounded-3xl border-2 border-[#EAE7E1] text-center space-y-3">
              <CheckCircle2 size={36} className="text-[#1B7A3D] mx-auto" />
              <h3 className="text-lg font-bold text-[#2E2A5E]">No Reminders In This Category</h3>
              <p className="text-xs text-[#6B6560] max-w-md mx-auto">
                All profile-evaluated vaccination requirements for this filter are currently up to date.
              </p>
              <Button onClick={() => setFilterUrgency('all')} variant="outline" size="sm" className="rounded-xl text-xs font-bold mt-2">
                View All Reminders
              </Button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DISPATCHED MESSAGES LOG */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#EAE7E1]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#8A847F]">Filter Log Channel:</span>
              {(['all', 'whatsapp', 'sms', 'email'] as const).map(ch => (
                <button
                  key={ch}
                  onClick={() => setLogChannelFilter(ch)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                    logChannelFilter === ch 
                      ? 'bg-[#2E2A5E] text-white' 
                      : 'bg-[#F6F4F1] text-[#6B6560] hover:bg-[#EAE7E1]'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>

            <button
              onClick={clearDispatchedLogs}
              className="text-xs font-bold text-[#B91C1C] hover:underline cursor-pointer"
            >
              Clear Log History
            </button>
          </div>

          <div className="space-y-3">
            {filteredLogs.map((log) => {
              if (log.channel === 'whatsapp') {
                return (
                  <div key={log.id} className="bg-white rounded-2xl border-2 border-[#EAE7E1] overflow-hidden shadow-2xs">
                    {/* WhatsApp Header Bar */}
                    <div className="bg-[#075E54] text-white px-4 py-2.5 flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                          <MessageSquare size={13} className="text-white" />
                        </div>
                        <div>
                          <span>VacTrack Official Health Alert ✓</span>
                          <span className="text-[10px] text-white/80 font-normal block">To: {log.recipient}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-white/80">
                        {log.sentAt ? format(parseISO(log.sentAt), 'hh:mm a') : 'Now'}
                      </span>
                    </div>

                    {/* WhatsApp Chat Bubble Body */}
                    <div className="p-4 bg-[#E5DDD5]/30 space-y-2">
                      <div className="bg-white p-3.5 rounded-2xl rounded-tl-none border border-black/5 shadow-2xs max-w-lg space-y-2 text-xs">
                        <p className="font-bold text-[#075E54] text-sm">{log.title}</p>
                        <div className="text-[#374151] whitespace-pre-line leading-relaxed font-sans">
                          {log.body}
                        </div>
                        <div className="text-[10px] text-[#8A847F] text-right font-medium">
                          Delivered • End-to-end encrypted
                        </div>
                      </div>

                      {/* Interactive Simulated Buttons */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        <span className="px-3 py-1 bg-white text-[#075E54] rounded-xl text-xs font-bold border border-[#075E54]/20 shadow-2xs">
                          [1] Confirm Attendance
                        </span>
                        <span className="px-3 py-1 bg-white text-[#075E54] rounded-xl text-xs font-bold border border-[#075E54]/20 shadow-2xs">
                          [2] Reschedule Slot
                        </span>
                        <span className="px-3 py-1 bg-white text-[#075E54] rounded-xl text-xs font-bold border border-[#075E54]/20 shadow-2xs">
                          [3] Clinic Directions
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }

              if (log.channel === 'sms') {
                return (
                  <div key={log.id} className="bg-white rounded-2xl border-2 border-[#EAE7E1] p-4 sm:p-5 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-xs border-b border-[#EAE7E1] pb-2">
                      <div className="flex items-center gap-2">
                        <Smartphone size={15} className="text-[#2E2A5E]" />
                        <span className="font-extrabold text-[#2E2A5E]">{log.sender}</span>
                        <span className="bg-[#F6F4F1] text-[#6B6560] text-[10px] px-2 py-0.5 rounded font-mono">
                          SMS to {log.recipient}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#8A847F]">
                        {log.sentAt ? format(parseISO(log.sentAt), 'dd MMM, hh:mm a') : 'Recent'}
                      </span>
                    </div>

                    <div className="bg-[#F6F4F1] p-3.5 rounded-xl border border-[#EAE7E1] text-xs font-mono text-[#374151] leading-relaxed">
                      {log.body}
                    </div>
                    <div className="flex justify-end">
                      <span className="text-[10px] text-[#1B7A3D] font-bold">✓ Delivered via National SMS Gateway</span>
                    </div>
                  </div>
                );
              }

              return (
                <div key={log.id} className="bg-white rounded-2xl border-2 border-[#EAE7E1] p-4 sm:p-5 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs border-b border-[#EAE7E1] pb-2">
                    <div className="flex items-center gap-2">
                      <Mail size={15} className="text-blue-600" />
                      <span className="font-extrabold text-[#2E2A5E]">{log.sender}</span>
                      <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded font-mono">
                        Email to {log.recipient}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#8A847F]">
                      {log.sentAt ? format(parseISO(log.sentAt), 'dd MMM, hh:mm a') : 'Recent'}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-[#2E2A5E]">{log.title}</div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-[#374151] whitespace-pre-line leading-relaxed">
                    {log.body}
                  </div>
                  <div className="flex justify-end">
                    <span className="text-[10px] text-[#1B7A3D] font-bold">✓ Signed with VacTrack DKIM / TLS</span>
                  </div>
                </div>
              );
            })}

            {filteredLogs.length === 0 && (
              <div className="bg-white p-8 rounded-3xl border-2 border-[#EAE7E1] text-center space-y-3">
                <Smartphone size={32} className="text-[#8A847F] mx-auto" />
                <h3 className="text-lg font-bold text-[#2E2A5E]">No Dispatched Messages Logged Yet</h3>
                <p className="text-xs text-[#6B6560]">
                  Click "Test WhatsApp", "Test SMS", or "Test Email" on any reminder card to simulate incoming alerts.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: NOTIFICATION PREFERENCES */}
      {activeTab === 'preferences' && (
        <div className="bg-white rounded-3xl border-2 border-[#EAE7E1] p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold font-heading text-[#2E2A5E]">
              Patient Delivery & Frequency Preferences
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6560] mt-1">
              Choose which communication channels VacTrack uses to notify you of critical post-exposure doses and routine health boosters.
            </p>
          </div>

          {/* Channels Toggle Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-[#EAE7E1] bg-[#F6F4F1] flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-[#25D366]" />
                  <span className="font-extrabold text-sm text-[#2E2A5E]">WhatsApp Notifications</span>
                </div>
                <p className="text-xs text-[#6B6560]">Receive interactive reminders with 1-click slot confirmation.</p>
                <span className="text-[10px] font-mono text-[#8A847F] block">Phone: +91 {patient.phone || '9876543210'}</span>
              </div>
              <input
                type="checkbox"
                checked={notificationPreferences.whatsappEnabled}
                onChange={(e) => updateNotificationPreferences({ whatsappEnabled: e.target.checked })}
                className="w-5 h-5 accent-[#E05D3F] rounded cursor-pointer mt-1"
              />
            </div>

            <div className="p-4 rounded-2xl border border-[#EAE7E1] bg-[#F6F4F1] flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Smartphone size={16} className="text-[#2E2A5E]" />
                  <span className="font-extrabold text-sm text-[#2E2A5E]">SMS Text Messages</span>
                </div>
                <p className="text-xs text-[#6B6560]">Direct cellular SMS sent via national telecom health gateway.</p>
                <span className="text-[10px] font-mono text-[#8A847F] block">Sender: VM-VACTRK</span>
              </div>
              <input
                type="checkbox"
                checked={notificationPreferences.smsEnabled}
                onChange={(e) => updateNotificationPreferences({ smsEnabled: e.target.checked })}
                className="w-5 h-5 accent-[#E05D3F] rounded cursor-pointer mt-1"
              />
            </div>

            <div className="p-4 rounded-2xl border border-[#EAE7E1] bg-[#F6F4F1] flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-blue-600" />
                  <span className="font-extrabold text-sm text-[#2E2A5E]">Email Summaries</span>
                </div>
                <p className="text-xs text-[#6B6560]">Calendar invites and comprehensive clinic instructions.</p>
                <span className="text-[10px] font-mono text-[#8A847F] block">Email: {patient.email || 'raj.patel@vactrack.example'}</span>
              </div>
              <input
                type="checkbox"
                checked={notificationPreferences.emailEnabled}
                onChange={(e) => updateNotificationPreferences({ emailEnabled: e.target.checked })}
                className="w-5 h-5 accent-[#E05D3F] rounded cursor-pointer mt-1"
              />
            </div>

            <div className="p-4 rounded-2xl border border-[#EAE7E1] bg-[#F6F4F1] flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Bell size={16} className="text-[#E05D3F]" />
                  <span className="font-extrabold text-sm text-[#2E2A5E]">In-App Alerts & Badges</span>
                </div>
                <p className="text-xs text-[#6B6560]">Top navbar counter and prominent dashboard notices.</p>
                <span className="text-[10px] font-mono text-[#8A847F] block">Real-time sync</span>
              </div>
              <input
                type="checkbox"
                checked={notificationPreferences.inAppEnabled}
                onChange={(e) => updateNotificationPreferences({ inAppEnabled: e.target.checked })}
                className="w-5 h-5 accent-[#E05D3F] rounded cursor-pointer mt-1"
              />
            </div>
          </div>

          {/* Advance Timing Intervals */}
          <div className="pt-4 border-t border-[#EAE7E1] space-y-3">
            <h3 className="text-sm font-bold text-[#2E2A5E] uppercase tracking-wider">
              Advance Reminder Schedule
            </h3>
            <p className="text-xs text-[#6B6560]">Select how many days prior to scheduled doses you wish to receive notifications:</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { days: 7, label: '7 Days Before' },
                { days: 3, label: '3 Days Before' },
                { days: 1, label: '1 Day Before' },
                { days: 0, label: 'Day of Dose (08:00 AM)' }
              ].map(({ days, label }) => {
                const isSelected = notificationPreferences.remindDaysBefore?.includes(days);
                return (
                  <button
                    key={days}
                    type="button"
                    onClick={() => {
                      const current = notificationPreferences.remindDaysBefore || [7, 3, 1, 0];
                      const updated = isSelected 
                        ? current.filter(d => d !== days) 
                        : [...current, days];
                      updateNotificationPreferences({ remindDaysBefore: updated });
                    }}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left flex items-center justify-between ${
                      isSelected 
                        ? 'bg-[#2E2A5E] text-white border-[#2E2A5E]' 
                        : 'bg-white text-[#6B6560] border-[#EAE7E1] hover:bg-[#F6F4F1]'
                    }`}
                  >
                    <span>{label}</span>
                    <Check size={14} className={isSelected ? 'text-[#F2A93B]' : 'opacity-0'} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clinical Profile Evaluation Settings */}
          <div className="pt-4 border-t border-[#EAE7E1] space-y-3">
            <h3 className="text-sm font-bold text-[#2E2A5E] uppercase tracking-wider">
              Profile-Driven Clinical Rules
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3.5 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1] cursor-pointer">
                <div>
                  <span className="text-xs font-extrabold text-[#2E2A5E] block">Allergy Caution Integration</span>
                  <span className="text-[11px] text-[#6B6560]">Automatically flags Penicillin and drug sensitivities on reminder slips</span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPreferences.allergyWarningsEnabled}
                  onChange={(e) => updateNotificationPreferences({ allergyWarningsEnabled: e.target.checked })}
                  className="w-4 h-4 accent-[#E05D3F]"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1] cursor-pointer">
                <div>
                  <span className="text-xs font-extrabold text-[#2E2A5E] block">Age & Health Record Booster Recommendations</span>
                  <span className="text-[11px] text-[#6B6560]">Recommends annual influenza and COVID-19 boosters based on DOB</span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPreferences.ageBoosterAlertsEnabled}
                  onChange={(e) => updateNotificationPreferences({ ageBoosterAlertsEnabled: e.target.checked })}
                  className="w-4 h-4 accent-[#E05D3F]"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1] cursor-pointer">
                <div>
                  <span className="text-xs font-extrabold text-[#2E2A5E] block">High-Priority PEP Protocol Override</span>
                  <span className="text-[11px] text-[#6B6560]">Allows Category III rabies overdue alerts to bypass quiet hours</span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPreferences.emergencyHighPriority}
                  onChange={(e) => updateNotificationPreferences({ emergencyHighPriority: e.target.checked })}
                  className="w-4 h-4 accent-[#E05D3F]"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
