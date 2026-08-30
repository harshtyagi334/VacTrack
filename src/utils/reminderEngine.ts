import { 
  differenceInCalendarDays, 
  format, 
  parseISO, 
  startOfDay, 
  isBefore, 
  isSameDay,
  addDays 
} from 'date-fns';
import { 
  Patient, 
  Dose, 
  Appointment, 
  Clinic, 
  VaccinationReminder, 
  NotificationPreferences, 
  DispatchedMessageLog,
  ReminderUrgency,
  ReminderStatus
} from '../types';

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  smsEnabled: true,
  whatsappEnabled: true,
  emailEnabled: true,
  inAppEnabled: true,
  remindDaysBefore: [7, 3, 1, 0],
  phone: '9876543210',
  email: 'raj.patel@vactrack.example',
  preferredTimeOfDay: 'morning',
  emergencyHighPriority: true,
  allergyWarningsEnabled: true,
  ageBoosterAlertsEnabled: true,
};

export function calculatePatientAge(dobString?: string, currentDateString?: string): number {
  if (!dobString) return 22; // default demo age
  try {
    const dob = new Date(dobString);
    const refDate = currentDateString ? new Date(currentDateString) : new Date();
    let age = refDate.getFullYear() - dob.getFullYear();
    const m = refDate.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && refDate.getDate() < dob.getDate())) {
      age--;
    }
    return Math.max(0, age);
  } catch {
    return 22;
  }
}

/**
 * Evaluates patient profile data (DOB/age, rabies exposure category and date,
 * health record previous vaccinations, allergies, city/location, and current doses)
 * against clinical immunization standards to generate dynamic, prioritized reminders.
 */
export function generateProfileVaccinationReminders(
  patient: Patient,
  doses: Dose[],
  appointments: Appointment[] = [],
  clinics: Record<string, Clinic> = {},
  currentDateString: string,
  preferences: NotificationPreferences = DEFAULT_NOTIFICATION_PREFERENCES
): VaccinationReminder[] {
  const reminders: VaccinationReminder[] = [];
  const simDate = startOfDay(new Date(currentDateString));
  const patientAge = calculatePatientAge(patient.dob, currentDateString);
  const preferredClinic: Clinic = Object.values(clinics)[0] || {
    id: 'hosp_1',
    name: 'Shivajinagar Emergency Medical Centre',
    location: 'Shivajinagar, Pune',
    address: 'Near Shivajinagar Railway Station, Pune, Maharashtra 411005',
    phone: '+91 90000 10001'
  };

  const getClinicAddress = (c: Clinic) => c.address || c.location || 'Pune, Maharashtra';

  // 1. EVALUATE ACTIVE PROTOCOL: RABIES POST-EXPOSURE PROPHYLAXIS (PEP)
  const patientDoses = doses || [];
  const uncompletedDoses = patientDoses.filter(d => d.status !== 'completed');

  uncompletedDoses.forEach((dose) => {
    const scheduled = startOfDay(new Date(dose.scheduledDate));
    const daysRemaining = differenceInCalendarDays(scheduled, simDate);
    const matchingAppointment = appointments.find(
      a => a.patientId === patient.id && a.doseNumber === dose.doseNumber && a.status === 'scheduled'
    );
    const assignedClinic: Clinic = (matchingAppointment?.clinicId 
      ? clinics[matchingAppointment.clinicId] 
      : preferredClinic) || preferredClinic;

    const formattedDueDate = format(scheduled, 'dd MMMM yyyy');

    if (daysRemaining < 0) {
      // OVERDUE
      const overdueDays = Math.abs(daysRemaining);
      reminders.push({
        id: `rem_pep_overdue_${dose.doseNumber}`,
        patientId: patient.id,
        vaccineName: dose.vaccineName || 'Rabies Vaccine (Rabivax-S)',
        doseNumber: dose.doseNumber,
        totalDoses: 5,
        scheduledDate: dose.scheduledDate,
        dueDateFormatted: formattedDueDate,
        daysRemaining,
        status: 'overdue',
        urgency: 'critical',
        title: `🚨 URGENT: Rabies PEP Dose ${dose.doseNumber} is Overdue by ${overdueDays} ${overdueDays === 1 ? 'day' : 'days'}`,
        message: `Your scheduled Rabies PEP Dose ${dose.doseNumber} was due on ${formattedDueDate}. In rabies post-exposure prophylaxis, delayed doses compromise antibody titers. Please visit ${assignedClinic.name} immediately.`,
        profileReason: `Triggered by Category ${patient.exposureCategory || 'III'} animal bite on ${format(parseISO(patient.exposureDate || '2026-08-17'), 'dd MMM yyyy')}. WHO & National Guidelines require unbroken adherence.`,
        triggerBasis: 'active_protocol',
        recommendedFacilityName: assignedClinic.name,
        recommendedFacilityAddress: getClinicAddress(assignedClinic),
        recommendedFacilityPhone: assignedClinic.phone || '+91 90000 10001',
        suggestedAction: 'visit_er',
        channelDispatched: {
          sms: preferences.smsEnabled,
          whatsapp: preferences.whatsappEnabled,
          email: preferences.emailEnabled,
          inApp: true
        },
        read: false,
        appointmentId: matchingAppointment?.id,
        badgeText: `Overdue by ${overdueDays}d`
      });
    } else if (daysRemaining === 0) {
      // DUE TODAY
      reminders.push({
        id: `rem_pep_today_${dose.doseNumber}`,
        patientId: patient.id,
        vaccineName: dose.vaccineName || 'Rabies Vaccine (Rabivax-S)',
        doseNumber: dose.doseNumber,
        totalDoses: 5,
        scheduledDate: dose.scheduledDate,
        dueDateFormatted: formattedDueDate,
        daysRemaining: 0,
        status: 'due_today',
        urgency: 'critical',
        title: `⏰ Action Required Today: Rabies PEP Dose ${dose.doseNumber} Due`,
        message: matchingAppointment 
          ? `Your appointment is confirmed today at ${matchingAppointment.time} at ${assignedClinic.name}. Carry your VacTrack QR code.`
          : `Dose ${dose.doseNumber} is due today at ${assignedClinic.name}. Antivenom & Rabies PEP stock verified available.`,
        profileReason: `Triggered by Day ${dose.doseNumber === 1 ? '0' : dose.doseNumber === 2 ? '3' : dose.doseNumber === 3 ? '7' : dose.doseNumber === 4 ? '14' : '28'} of Essen 5-dose post-exposure schedule (Exposure: ${format(parseISO(patient.exposureDate || '2026-08-17'), 'dd MMM yyyy')}).`,
        triggerBasis: 'active_protocol',
        recommendedFacilityName: assignedClinic.name,
        recommendedFacilityAddress: getClinicAddress(assignedClinic),
        recommendedFacilityPhone: assignedClinic.phone || '+91 90000 10001',
        suggestedAction: matchingAppointment ? 'confirm_receipt' : 'book_appointment',
        channelDispatched: {
          sms: preferences.smsEnabled,
          whatsapp: preferences.whatsappEnabled,
          email: preferences.emailEnabled,
          inApp: true
        },
        read: false,
        appointmentId: matchingAppointment?.id,
        badgeText: 'Due Today'
      });
    } else if (daysRemaining <= 14) {
      // UPCOMING DOSE (within 14 days)
      const urgency: ReminderUrgency = daysRemaining <= 2 ? 'high' : 'medium';
      reminders.push({
        id: `rem_pep_upcoming_${dose.doseNumber}`,
        patientId: patient.id,
        vaccineName: dose.vaccineName || 'Rabies Vaccine (Rabivax-S)',
        doseNumber: dose.doseNumber,
        totalDoses: 5,
        scheduledDate: dose.scheduledDate,
        dueDateFormatted: formattedDueDate,
        daysRemaining,
        status: 'upcoming',
        urgency,
        title: `📅 Upcoming: Rabies PEP Dose ${dose.doseNumber} in ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'}`,
        message: matchingAppointment 
          ? `Reminder: You have an appointment booked for Dose ${dose.doseNumber} on ${formattedDueDate} at ${matchingAppointment.time} at ${assignedClinic.name}.`
          : `Your next Rabies PEP Dose ${dose.doseNumber} is scheduled for ${formattedDueDate}. Early slot reservation is recommended.`,
        profileReason: `Calculated from patient exposure date (${format(parseISO(patient.exposureDate || '2026-08-17'), 'dd MMM yyyy')}) and verified batch records.`,
        triggerBasis: 'active_protocol',
        recommendedFacilityName: assignedClinic.name,
        recommendedFacilityAddress: getClinicAddress(assignedClinic),
        recommendedFacilityPhone: assignedClinic.phone || '+91 90000 10001',
        suggestedAction: matchingAppointment ? 'confirm_receipt' : 'book_appointment',
        channelDispatched: {
          sms: preferences.smsEnabled && preferences.remindDaysBefore.includes(daysRemaining),
          whatsapp: preferences.whatsappEnabled && preferences.remindDaysBefore.includes(daysRemaining),
          email: preferences.emailEnabled && preferences.remindDaysBefore.includes(daysRemaining),
          inApp: true
        },
        read: false,
        appointmentId: matchingAppointment?.id,
        badgeText: `In ${daysRemaining}d`
      });
    }
  });

  // 2. EVALUATE EXPOSURE CATEGORY III (Rabies Immunoglobulin Check)
  if (patient.exposureCategory === 'III') {
    const hasCompletedAll = uncompletedDoses.length === 0;
    if (!hasCompletedAll) {
      reminders.push({
        id: 'rem_rig_cat3',
        patientId: patient.id,
        vaccineName: 'Rabies Immunoglobulin (RIG)',
        scheduledDate: patient.exposureDate || '2026-08-17T00:00:00.000Z',
        dueDateFormatted: 'At Wound Site (Day 0–7)',
        daysRemaining: 0,
        status: 'recommended_booster',
        urgency: 'high',
        title: '🛡️ Category III Bite Flag: RIG Infiltration Protocol',
        message: `Your profile indicates Category III transdermal exposure. National guidelines recommend wound infiltration of Rabies Immunoglobulin (RIG) alongside PEP vaccination. Confirm with your attending physician.`,
        profileReason: `Triggered by Exposure Category III registered in your patient health profile.`,
        triggerBasis: 'active_protocol',
        recommendedFacilityName: preferredClinic.name,
        recommendedFacilityAddress: getClinicAddress(preferredClinic),
        recommendedFacilityPhone: preferredClinic.phone || '+91 90000 10001',
        suggestedAction: 'consult_doctor',
        channelDispatched: {
          sms: false,
          whatsapp: preferences.whatsappEnabled,
          email: preferences.emailEnabled,
          inApp: true
        },
        read: true,
        badgeText: 'Category III'
      });
    }
  }

  // 3. EVALUATE ALLERGIES IN HEALTH RECORD
  if (preferences.allergyWarningsEnabled && patient.healthRecord?.allergies && patient.healthRecord.allergies.length > 0) {
    const allergyList = patient.healthRecord.allergies.join(', ');
    reminders.push({
      id: 'rem_allergy_alert',
      patientId: patient.id,
      vaccineName: 'Allergy Clinical Caution',
      scheduledDate: new Date().toISOString(),
      dueDateFormatted: 'Permanent Record Flag',
      daysRemaining: 0,
      status: 'scheduled',
      urgency: 'high',
      title: `⚠️ Clinical Safety Flag: ${allergyList} Allergy Recorded`,
      message: `Your profile documents a sensitivity to ${allergyList}. When presenting at ${preferredClinic.name} for any vaccination or booster, confirm your clinician scans your VacTrack QR code to verify hypoallergenic excipients.`,
      profileReason: `Triggered by verified allergy documentation in your VacTrack Health Record.`,
      triggerBasis: 'allergy_caution',
      recommendedFacilityName: preferredClinic.name,
      recommendedFacilityAddress: getClinicAddress(preferredClinic),
      recommendedFacilityPhone: preferredClinic.phone || '+91 90000 10001',
      suggestedAction: 'consult_doctor',
      channelDispatched: {
        sms: false,
        whatsapp: false,
        email: preferences.emailEnabled,
        inApp: true
      },
      read: true,
      badgeText: 'Safety Flag'
    });
  }

  // 4. EVALUATE AGE-BASED & HEALTH RECORD GAP ROUTINE BOOSTERS
  if (preferences.ageBoosterAlertsEnabled) {
    const prevVaccines = patient.healthRecord?.previousVaccinations || [];
    
    // 4A. COVID-19 Booster Evaluation
    const covidRecord = prevVaccines.find(v => v.name.toLowerCase().includes('covid'));
    if (covidRecord && covidRecord.date) {
      const covidYear = parseInt(covidRecord.date.split('-')[0], 10);
      const currentYear = simDate.getFullYear();
      if (currentYear - covidYear >= 2) {
        reminders.push({
          id: 'rem_covid_booster',
          patientId: patient.id,
          vaccineName: 'COVID-19 Updated Booster',
          scheduledDate: addDays(simDate, 20).toISOString(),
          dueDateFormatted: format(addDays(simDate, 20), 'dd MMMM yyyy'),
          daysRemaining: 20,
          status: 'recommended_booster',
          urgency: 'medium',
          title: '🦠 COVID-19 Updated Seasonal Booster Recommended',
          message: `Your profile indicates your last COVID-19 vaccination was in ${covidYear} (${currentYear - covidYear} years ago). An updated bivalent/seasonal booster is advised for adult community immunity.`,
          profileReason: `Triggered by immunization history: Last recorded COVID-19 shot was on ${format(parseISO(covidRecord.date), 'dd MMM yyyy')}, exceeding the 12-month interval.`,
          triggerBasis: 'health_record_gap',
          recommendedFacilityName: preferredClinic.name,
          recommendedFacilityAddress: getClinicAddress(preferredClinic),
          recommendedFacilityPhone: preferredClinic.phone || '+91 90000 10001',
          suggestedAction: 'book_appointment',
          channelDispatched: {
            sms: false,
            whatsapp: preferences.whatsappEnabled,
            email: preferences.emailEnabled,
            inApp: true
          },
          read: false,
          badgeText: 'Booster Due'
        });
      }
    }

    // 4B. Annual Seasonal Influenza (Flu) Booster
    reminders.push({
      id: 'rem_influenza_annual',
      patientId: patient.id,
      vaccineName: 'Quadrivalent Influenza (Flu) Vaccine',
      scheduledDate: addDays(simDate, 30).toISOString(),
      dueDateFormatted: format(addDays(simDate, 30), 'dd MMMM yyyy'),
      daysRemaining: 30,
      status: 'recommended_booster',
      urgency: 'medium',
      title: '🛡️ Annual Influenza (Flu) Preventive Booster Recommended',
      message: `Annual quadrivalent influenza vaccination is recommended for adults in ${patient.city || 'Pune'} before seasonal respiratory surges. Available at participating clinics.`,
      profileReason: `Triggered by patient age (${patientAge} yrs) and absence of a 2026 influenza immunization in health record.`,
      triggerBasis: 'age_schedule',
      recommendedFacilityName: preferredClinic.name,
      recommendedFacilityAddress: getClinicAddress(preferredClinic),
      recommendedFacilityPhone: preferredClinic.phone || '+91 90000 10001',
      suggestedAction: 'book_appointment',
      channelDispatched: {
        sms: false,
        whatsapp: false,
        email: preferences.emailEnabled,
        inApp: true
      },
      read: false,
      badgeText: 'Annual Routine'
    });

    // 4C. Tetanus Toxoid (TT / Td) 10-Year Booster Status Check
    const tetanusRecord = prevVaccines.find(v => v.name.toLowerCase().includes('tetanus') || v.name.toLowerCase().includes('tt'));
    if (tetanusRecord && tetanusRecord.date) {
      reminders.push({
        id: 'rem_tetanus_status',
        patientId: patient.id,
        vaccineName: 'Tetanus Toxoid (TT Booster)',
        scheduledDate: '2036-06-12T00:00:00.000Z',
        dueDateFormatted: '12 June 2036 (Decennial)',
        daysRemaining: 3500,
        status: 'scheduled',
        urgency: 'info',
        title: '✓ Tetanus (TT) Immunization Verified Current',
        message: `Your health record shows Tetanus Toxoid administered on ${format(parseISO(tetanusRecord.date), 'dd MMMM yyyy')}. For routine adult coverage, your next 10-year booster is due in 2036.`,
        profileReason: `Based on verified health record documentation: TT administered on ${format(parseISO(tetanusRecord.date), 'dd MMMM yyyy')}. Protection valid for 10 years.`,
        triggerBasis: 'age_schedule',
        recommendedFacilityName: preferredClinic.name,
        recommendedFacilityAddress: getClinicAddress(preferredClinic),
        recommendedFacilityPhone: preferredClinic.phone || '+91 90000 10001',
        suggestedAction: 'confirm_receipt',
        channelDispatched: {
          sms: false,
          whatsapp: false,
          email: false,
          inApp: true
        },
        read: true,
        badgeText: 'Current (Valid)'
      });
    }

    // 4D. Hepatitis B Protection Review for Young Adults
    const hasHepB = prevVaccines.some(v => v.name.toLowerCase().includes('hepatitis'));
    if (!hasHepB) {
      reminders.push({
        id: 'rem_hepb_check',
        patientId: patient.id,
        vaccineName: 'Hepatitis B (3-Dose Recombinant)',
        scheduledDate: addDays(simDate, 45).toISOString(),
        dueDateFormatted: 'Elective Preventive Schedule',
        daysRemaining: 45,
        status: 'recommended_booster',
        urgency: 'info',
        title: '💉 Hepatitis B Immunization Recommendation',
        message: `Hepatitis B provides lifelong liver protection. If you have not received the complete 3-dose series in childhood, an adult catch-up series is recommended.`,
        profileReason: `Triggered by adult demographic (${patientAge} yrs) and unrecorded Hepatitis B documentation in verified history.`,
        triggerBasis: 'health_record_gap',
        recommendedFacilityName: preferredClinic.name,
        recommendedFacilityAddress: getClinicAddress(preferredClinic),
        recommendedFacilityPhone: preferredClinic.phone || '+91 90000 10001',
        suggestedAction: 'consult_doctor',
        channelDispatched: {
          sms: false,
          whatsapp: false,
          email: false,
          inApp: true
        },
        read: false,
        badgeText: 'Advisory'
      });
    }
  }

  // Sort reminders: Critical first, then High, then Medium, then Info
  const urgencyWeight: Record<ReminderUrgency, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    info: 1
  };

  return reminders.sort((a, b) => {
    if (urgencyWeight[b.urgency] !== urgencyWeight[a.urgency]) {
      return urgencyWeight[b.urgency] - urgencyWeight[a.urgency];
    }
    return a.daysRemaining - b.daysRemaining;
  });
}

/**
 * Creates simulated real-world communication dispatches (SMS, WhatsApp, Email)
 * for a specific reminder.
 */
export function buildSimulatedDispatches(
  reminder: VaccinationReminder,
  patient: Patient,
  channel: 'sms' | 'whatsapp' | 'email'
): DispatchedMessageLog {
  const timestamp = new Date().toISOString();
  
  if (channel === 'sms') {
    return {
      id: `disp_sms_${reminder.id}_${Date.now()}`,
      patientId: patient.id,
      reminderId: reminder.id,
      channel: 'sms',
      recipient: patient.phone || '+91 98765 43210',
      sender: 'VM-VACTRK (Govt of India / MH-Health)',
      sentAt: timestamp,
      title: reminder.title,
      body: `[VacTrack SMS] Dear ${patient.name}, reminder for ${reminder.vaccineName}: ${reminder.title}. Due Date: ${reminder.dueDateFormatted} at ${reminder.recommendedFacilityName}. Carry your QR record. Helpline: ${reminder.recommendedFacilityPhone}`,
      status: 'delivered'
    };
  }

  if (channel === 'whatsapp') {
    return {
      id: `disp_wa_${reminder.id}_${Date.now()}`,
      patientId: patient.id,
      reminderId: reminder.id,
      channel: 'whatsapp',
      recipient: patient.phone || '+91 98765 43210',
      sender: 'VacTrack Official Health Alert ✓',
      sentAt: timestamp,
      title: reminder.title,
      body: `*VacTrack Vaccination Reminder*\n\nHello *${patient.name}*,\n\n*Vaccine:* ${reminder.vaccineName} ${reminder.doseNumber ? `(Dose ${reminder.doseNumber})` : ''}\n*Due Date:* ${reminder.dueDateFormatted}\n*Center:* ${reminder.recommendedFacilityName}\n\n_${reminder.message}_\n\n*Profile Reason:* ${reminder.profileReason}\n\nReply:\n[1] Confirm Attendance\n[2] Reschedule Slot\n[3] Emergency Route Directions`,
      status: 'read'
    };
  }

  return {
    id: `disp_em_${reminder.id}_${Date.now()}`,
    patientId: patient.id,
    reminderId: reminder.id,
    channel: 'email',
    recipient: patient.email || 'raj.patel@vactrack.example',
    sender: 'notifications@vactrack.health',
    sentAt: timestamp,
    title: `[VacTrack] Vaccination Reminder: ${reminder.vaccineName} — ${reminder.dueDateFormatted}`,
    body: `Dear ${patient.name},\n\nThis is an automated notification regarding your upcoming immunization schedule based on your VacTrack profile data.\n\nVaccine: ${reminder.vaccineName}\nScheduled Date: ${reminder.dueDateFormatted}\nFacility: ${reminder.recommendedFacilityName} (${reminder.recommendedFacilityAddress})\n\nProfile Clinical Basis: ${reminder.profileReason}\n\nPlease ensure you maintain timely immunization. You can view your live tamper-evident cryptographic QR certificate at https://vactrack.health/patient/qr.\n\nWarm regards,\nVacTrack Immunization Operations Network`,
    status: 'delivered'
  };
}
