import React, { useState } from 'react';
import { useAppStore, generateUniqueId } from '../store';
import { 
  FastForward, Calendar, Clock, Bell, CheckCircle2, AlertTriangle, 
  RotateCcw, MessageSquare, ShieldCheck, ArrowRight, Smartphone, Sparkles
} from 'lucide-react';
import { Button } from './ui/Button';
import { format, parseISO, isSameDay, isBefore, startOfDay, addDays } from 'date-fns';

export function RabiesPEPInteractiveSchedule() {
  const { currentDate, fastForwardTime, resetDemo, doses, currentPatientId, patients, clinics, currentUser } = useAppStore();
  
  const patientId = currentPatientId || currentUser?.patientId || 'p_demo_1';
  const patient = patients[patientId] || { name: currentUser?.name || 'Harsh Tyagi', phone: currentUser?.phone || '07387513560' };
  const patientDoses = doses[patientId] || [];

  const simDate = startOfDay(new Date(currentDate));

  // Simulated notification log
  const [simulatedMessages, setSimulatedMessages] = useState<Array<{
    id: string;
    type: 'reminder' | 'overdue' | 'completed';
    timestamp: string;
    title: string;
    body: string;
  }>>([
    {
      id: 'msg_1',
      type: 'reminder',
      timestamp: '19 Aug 2026 — 08:00 AM',
      title: 'Upcoming Dose 3 Schedule',
      body: `Dear ${patient.name}, your Rabies PEP Dose 3 is scheduled for 24 August 2026 at Shivajinagar Emergency Medical Centre.`
    }
  ]);

  // Jump to specific dates
  const handleJumpToDate = (targetDateStr: string, actionLabel: string) => {
    const target = startOfDay(new Date(targetDateStr));
    const current = startOfDay(new Date(currentDate));
    const diffDays = Math.round((target.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      fastForwardTime(diffDays);

      // Append simulated notification depending on date
      const formattedDate = format(target, 'dd MMMM yyyy');
      if (targetDateStr.includes('08-24')) {
        setSimulatedMessages(prev => [
          {
            id: generateUniqueId('msg'),
            type: 'reminder',
            timestamp: `${formattedDate} — 08:00 AM`,
            title: '📱 SMS Reminder Sent: Dose 3 Due Today',
            body: `[VacTrack SMS] Dear ${patient.name}, Rabies PEP Dose 3 is DUE TODAY at Shivajinagar Emergency Medical Centre, Pune.`
          },
          ...prev
        ]);
      } else if (targetDateStr.includes('08-25')) {
        setSimulatedMessages(prev => [
          {
            id: generateUniqueId('msg'),
            type: 'overdue',
            timestamp: `${formattedDate} — 09:00 AM`,
            title: '🚨 Urgent SMS Follow-up: Dose 3 Overdue',
            body: `[VacTrack Alert] URGENT! ${patient.name}, your Rabies PEP Dose 3 is OVERDUE. Please visit Shivajinagar Emergency Medical Centre immediately.`
          },
          ...prev
        ]);
      } else if (targetDateStr.includes('08-31')) {
        setSimulatedMessages(prev => [
          {
            id: generateUniqueId('msg'),
            type: 'reminder',
            timestamp: `${formattedDate} — 08:00 AM`,
            title: '📱 SMS Reminder Sent: Dose 4 Due Today',
            body: `[VacTrack SMS] Dear ${patient.name}, Rabies PEP Dose 4 is DUE TODAY at Shivajinagar Emergency Medical Centre.`
          },
          ...prev
        ]);
      } else if (targetDateStr.includes('09-14')) {
        setSimulatedMessages(prev => [
          {
            id: generateUniqueId('msg'),
            type: 'reminder',
            timestamp: `${formattedDate} — 08:00 AM`,
            title: '📱 SMS Reminder Sent: Final Dose 5 Due Today',
            body: `[VacTrack SMS] Final Dose! Dear ${patient.name}, Rabies PEP Dose 5 is DUE TODAY. Complete your protocol today!`
          },
          ...prev
        ]);
      }
    }
  };

  const handleReset = () => {
    resetDemo();
    setSimulatedMessages([
      {
        id: 'msg_reset',
        type: 'reminder',
        timestamp: '19 Aug 2026 — 08:00 AM',
        title: 'Simulation Reset',
        body: `Simulation reset to 19 August 2026. Next dose: Dose 3 due on 24 August 2026.`
      }
    ]);
  };

  // Rabies PEP calculated protocol schedule definitions
  const pepSchedule = [
    { doseNumber: 1, dayLabel: 'Day 0', dateStr: '2026-08-17T10:00:00.000Z', defaultStatus: 'completed' },
    { doseNumber: 2, dayLabel: 'Day 3', dateStr: '2026-08-20T10:30:00.000Z', defaultStatus: 'completed' },
    { doseNumber: 3, dayLabel: 'Day 7', dateStr: '2026-08-24T10:30:00.000Z', defaultStatus: 'calculated' },
    { doseNumber: 4, dayLabel: 'Day 14', dateStr: '2026-08-31T10:30:00.000Z', defaultStatus: 'calculated' },
    { doseNumber: 5, dayLabel: 'Day 28', dateStr: '2026-09-14T10:30:00.000Z', defaultStatus: 'calculated' },
  ];

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#EAE7E1] shadow-xs space-y-8">
      
      {/* Header & Fast Forward Simulator Controls */}
      <div className="bg-[#2E2A5E] text-white p-6 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#E05D3F] text-white mb-2">
              <FastForward size={13} /> Automated Fast-Forward Simulator
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold">
              Vaccination Schedule & Reminder Engine
            </h2>
            <p className="text-xs text-white/70 mt-1">
              Simulate time forward to observe automated status transitions: <span className="text-[#F2A93B] font-bold">Upcoming ➔ Due ➔ Reminder Sent ➔ Overdue ➔ Follow-up Alert</span>
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-center shrink-0">
            <span className="text-[10px] uppercase font-extrabold text-white/70 block">Simulated Current Date</span>
            <span className="text-lg font-extrabold text-[#F2A93B]">
              {format(simDate, 'dd MMMM yyyy')}
            </span>
          </div>
        </div>

        {/* Fast Forward Action Buttons */}
        <div className="space-y-3">
          <span className="text-xs font-extrabold text-white/80 uppercase tracking-wider block">
            Fast Forward Time Simulation:
          </span>

          <div className="flex flex-wrap gap-2.5">
            <Button 
              onClick={() => handleJumpToDate('2026-08-24', 'Jump to Dose 3 Due')}
              className="bg-[#E05D3F] hover:bg-[#c94d31] text-white text-xs font-extrabold rounded-xl py-2 px-3.5"
            >
              ⏩ 24 Aug (Dose 3 Due)
            </Button>

            <Button 
              onClick={() => handleJumpToDate('2026-08-25', 'Jump to Dose 3 Overdue')}
              className="bg-[#B91C1C] hover:bg-[#991b1b] text-white text-xs font-extrabold rounded-xl py-2 px-3.5"
            >
              ⚠️ 25 Aug (Dose 3 Overdue)
            </Button>

            <Button 
              onClick={() => handleJumpToDate('2026-08-31', 'Jump to Dose 4 Due')}
              className="bg-[#F2A93B] hover:bg-[#d99430] text-[#231F20] text-xs font-extrabold rounded-xl py-2 px-3.5"
            >
              ⏩ 31 Aug (Dose 4 Due)
            </Button>

            <Button 
              onClick={() => handleJumpToDate('2026-09-14', 'Jump to Dose 5 Due')}
              className="bg-[#1B7A3D] hover:bg-[#155e2e] text-white text-xs font-extrabold rounded-xl py-2 px-3.5"
            >
              ⏩ 14 Sept (Dose 5 Final)
            </Button>

            <button 
              onClick={() => fastForwardTime(1)}
              type="button"
              className="bg-[#4F46E5] hover:bg-[#4338CA] active:scale-95 text-white text-xs font-extrabold rounded-xl py-2 px-3.5 flex items-center gap-1.5 shadow-xs transition-all cursor-pointer border border-indigo-300/30"
            >
              <FastForward size={14} />
              <span>+24h Fast Forward (+1 Day)</span>
            </button>

            <button 
              onClick={handleReset}
              type="button"
              className="bg-[#475569] hover:bg-[#334155] active:scale-95 text-white text-xs font-extrabold rounded-xl py-2 px-3.5 flex items-center gap-1.5 shadow-xs transition-all cursor-pointer border border-slate-400/30"
            >
              <RotateCcw size={14} />
              <span>Reset Date</span>
            </button>
          </div>
        </div>
      </div>

      {/* Calculated 5-Dose Rabies PEP Schedule */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#EAE7E1] pb-3">
          <h3 className="text-base font-extrabold text-[#2E2A5E] flex items-center gap-2">
            <Calendar size={18} className="text-[#E05D3F]" /> Calculated Rabies PEP Schedule (5-Dose Protocol)
          </h3>
          <span className="text-xs font-extrabold text-[#1B7A3D] bg-[#EBF7EE] px-3 py-1 rounded-full border border-[#C8E6C9]">
            ✓ World Health Organization Standard
          </span>
        </div>

        <div className="space-y-3">
          {pepSchedule.map((item) => {
            const doseObj = patientDoses.find(d => d.doseNumber === item.doseNumber);
            const scheduled = startOfDay(new Date(item.dateStr));

            let statusCategory: 'completed' | 'due_today' | 'overdue' | 'upcoming' = 'upcoming';
            let lifecycleStage = 'Upcoming';

            if (doseObj?.status === 'completed' || item.defaultStatus === 'completed') {
              statusCategory = 'completed';
              lifecycleStage = 'Completed';
            } else if (isSameDay(scheduled, simDate)) {
              statusCategory = 'due_today';
              lifecycleStage = 'Due ➔ Reminder Sent';
            } else if (isBefore(scheduled, simDate)) {
              statusCategory = 'overdue';
              lifecycleStage = 'Overdue ➔ Follow-up Alert';
            } else {
              statusCategory = 'upcoming';
              lifecycleStage = 'Upcoming Schedule';
            }

            return (
              <div 
                key={item.doseNumber}
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  statusCategory === 'completed' ? 'bg-white border-[#EAE7E1]' :
                  statusCategory === 'due_today' ? 'bg-[#FEF3C7] border-[#FDE68A]' :
                  statusCategory === 'overdue' ? 'bg-[#FEF2F2] border-[#FCA5A5]' :
                  'bg-[#F6F4F1] border-[#EAE7E1]'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
                    statusCategory === 'completed' ? 'bg-[#EBF7EE] text-[#1B7A3D] border border-[#C8E6C9]' :
                    statusCategory === 'due_today' ? 'bg-[#D97706] text-white' :
                    statusCategory === 'overdue' ? 'bg-[#B91C1C] text-white' :
                    'bg-[#2E2A5E] text-white'
                  }`}>
                    {statusCategory === 'completed' ? '✓' : item.doseNumber}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="font-extrabold text-sm text-[#2E2A5E]">
                        Dose {item.doseNumber} ({item.dayLabel})
                      </h4>

                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase ${
                        statusCategory === 'completed' ? 'bg-[#EBF7EE] text-[#1B7A3D] border border-[#C8E6C9]' :
                        statusCategory === 'due_today' ? 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]' :
                        statusCategory === 'overdue' ? 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FCA5A5]' :
                        'bg-white text-[#6B6560] border border-[#EAE7E1]'
                      }`}>
                        {statusCategory === 'completed' ? 'Completed' :
                         statusCategory === 'due_today' ? 'Due Today' :
                         statusCategory === 'overdue' ? 'Overdue' : 'Upcoming'}
                      </span>
                    </div>

                    <p className="text-xs text-[#6B6560] font-medium">
                      Calculated Date: <strong>{format(parseISO(item.dateStr), 'dd MMMM yyyy')}</strong>
                    </p>
                  </div>
                </div>

                {/* Lifecycle Pipeline Progress Indicator */}
                <div className="flex flex-col md:items-end">
                  <span className="text-[10px] font-extrabold text-[#6B6560] uppercase tracking-wider block mb-1">
                    Lifecycle Pipeline
                  </span>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold bg-white border border-[#EAE7E1]">
                    <Smartphone size={13} className="text-[#2E2A5E]" />
                    <span className="text-[#2E2A5E]">{lifecycleStage}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulated Reminders & SMS Notifications Panel */}
      <div className="bg-[#F6F4F1] p-6 rounded-3xl border-2 border-[#EAE7E1] space-y-4">
        <div className="flex items-center justify-between border-b border-[#EAE7E1] pb-3">
          <h3 className="text-sm font-extrabold text-[#2E2A5E] flex items-center gap-2">
            <MessageSquare size={16} className="text-[#E05D3F]" /> Simulated Reminders & SMS Dispatch Panel
          </h3>
          <span className="text-[11px] text-[#6B6560] font-bold">No real external SMS required • Simulated in-app</span>
        </div>

        <div className="space-y-3 max-h-60 overflow-y-auto">
          {simulatedMessages.map(msg => (
            <div 
              key={msg.id} 
              className={`p-4 rounded-2xl border-2 text-xs font-bold space-y-1 ${
                msg.type === 'overdue' ? 'bg-[#FEF2F2] border-[#FCA5A5] text-[#B91C1C]' :
                msg.type === 'reminder' ? 'bg-white border-[#EAE7E1] text-[#2E2A5E]' :
                'bg-[#EBF7EE] border-[#C8E6C9] text-[#1B7A3D]'
              }`}
            >
              <div className="flex justify-between items-center text-[10px] text-[#6B6560]">
                <span className="font-extrabold uppercase">{msg.title}</span>
                <span>{msg.timestamp}</span>
              </div>
              <p className="text-xs font-medium leading-relaxed">{msg.body}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
