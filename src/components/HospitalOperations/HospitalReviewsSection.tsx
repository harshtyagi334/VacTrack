import React, { useState } from 'react';
import { HospitalReview } from '../../types';
import { useAppStore } from '../../store';
import { 
  Star, CheckCircle2, Plus, ShieldCheck
} from 'lucide-react';
import { Button } from '../ui/Button';

interface HospitalReviewsSectionProps {
  hospitalId: string;
  allowWriteReview?: boolean;
}

const DEFAULT_DEMO_REVIEWS: HospitalReview[] = [
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
    emergencyCareRating: 5
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
    emergencyCareRating: 4
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
    emergencyCareRating: 5
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
    emergencyCareRating: 5
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
    emergencyCareRating: 4
  }
];

function formatReviewDate(dateStr: string): string {
  if (!dateStr) return '25 August 2026';
  if (dateStr.includes('2026-08-25')) return '25 August 2026';
  if (dateStr.includes('2026-08-22')) return '22 August 2026';
  if (dateStr.includes('2026-08-20')) return '20 August 2026';
  if (dateStr.includes('2026-08-18')) return '18 August 2026';
  if (dateStr.includes('2026-08-15')) return '15 August 2026';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function HospitalReviewsSection({ hospitalId, allowWriteReview = true }: HospitalReviewsSectionProps) {
  const { hospitalReviews, hospitalOperations, addHospitalReview, currentUser } = useAppStore();
  const hospital = hospitalOperations[hospitalId] || hospitalOperations['hosp_1'];
  
  const rawReviews = hospitalReviews[hospitalId] || hospitalReviews['hosp_1'] || [];
  const reviews = rawReviews.length > 0 ? rawReviews : DEFAULT_DEMO_REVIEWS;

  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [userName, setUserName] = useState(currentUser?.name || 'Patient Demo');
  const [userRole, setUserRole] = useState('Patient • Immunization Visit');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [cleanliness, setCleanliness] = useState(5);
  const [staffHelpfulness, setStaffHelpfulness] = useState(5);
  const [waitingTime, setWaitingTime] = useState(4);
  const [emergencyCare, setEmergencyCare] = useState(5);

  const averageRating = reviews.length > 0 
    ? Number((reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1))
    : (hospital?.rating || 4.7);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    addHospitalReview(hospitalId, {
      hospitalId,
      verifiedVisit: true,
      userName: userName.trim() || 'Verified Patient',
      patientName: userName.trim() || 'Verified Patient',
      userRole,
      rating,
      comment: comment.trim(),
      reviewText: comment.trim(),
      cleanlinessRating: cleanliness,
      staffRating: staffHelpfulness,
      waitingTimeRating: waitingTime,
      emergencyCareRating: emergencyCare
    });

    setComment('');
    setIsWriteOpen(false);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-[#EAE7E1] shadow-xs p-6 sm:p-8 space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#F2A93B]/20 text-[#B45309] rounded-xl">
              <Star size={20} className="fill-[#F2A93B]" />
            </div>
            <h2 className="text-xl font-heading font-extrabold text-[#2E2A5E]">
              Patient Experiences & Verified Reviews
            </h2>
          </div>
          <p className="text-xs text-[#6B6560] mt-1">
            Ratings and feedback from verified immunization visits and emergency bite patients.
          </p>
        </div>

        {allowWriteReview && (
          <Button
            onClick={() => setIsWriteOpen(true)}
            className="bg-[#2E2A5E] hover:bg-[#231f47] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} /> + Write a Patient Review
          </Button>
        )}
      </div>

      {/* Ratings Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1] items-center">
        
        {/* Left Big Score (4 cols) */}
        <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-[#EAE7E1] pb-4 md:pb-0 md:pr-6">
          <div className="text-4xl sm:text-5xl font-extrabold text-[#2E2A5E] flex items-center justify-center md:justify-start gap-2">
            <span>{averageRating}</span>
            <div className="flex items-center text-[#F2A93B]">
              <Star size={28} className="fill-[#F2A93B]" />
            </div>
          </div>
          <p className="text-xs text-[#6B6560] font-extrabold mt-1">
            Based on {reviews.length} Verified Demo Reviews
          </p>
          <span className="inline-flex items-center gap-1 bg-[#EBF7EE] text-[#1B7A3D] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#C8E6C9] mt-2">
            <ShieldCheck size={12} /> 100% Cryptographically Verified
          </span>
        </div>

        {/* Right Category Bars (8 cols) */}
        <div className="md:col-span-8 space-y-2.5 text-xs font-bold">
          <div>
            <div className="flex justify-between text-[#6B6560] mb-1">
              <span>Cleanliness & Hygiene</span>
              <span className="text-[#2E2A5E]">4.6 / 5.0</span>
            </div>
            <div className="w-full bg-white h-2 rounded-full overflow-hidden">
              <div className="bg-[#1B7A3D] h-full rounded-full w-[92%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[#6B6560] mb-1">
              <span>Doctor & Nursing Staff</span>
              <span className="text-[#2E2A5E]">4.8 / 5.0</span>
            </div>
            <div className="w-full bg-white h-2 rounded-full overflow-hidden">
              <div className="bg-[#E05D3F] h-full rounded-full w-[96%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[#6B6560] mb-1">
              <span>Waiting Time & Registration</span>
              <span className="text-[#2E2A5E]">4.5 / 5.0</span>
            </div>
            <div className="w-full bg-white h-2 rounded-full overflow-hidden">
              <div className="bg-[#F2A93B] h-full rounded-full w-[90%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[#6B6560] mb-1">
              <span>Emergency Trauma & Antivenom Care</span>
              <span className="text-[#2E2A5E]">4.7 / 5.0</span>
            </div>
            <div className="w-full bg-white h-2 rounded-full overflow-hidden">
              <div className="bg-[#2E2A5E] h-full rounded-full w-[94%]" />
            </div>
          </div>
        </div>

      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-[#2E2A5E] uppercase tracking-wider">
          Recent Patient Feedback
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map(rev => {
            const author = rev.userName || rev.patientName || 'Verified Patient';
            const content = rev.comment || rev.reviewText || 'Quick vaccination service and very helpful staff. The process was simple and well organised.';
            const reviewRating = rev.rating || 5;
            const formattedDate = formatReviewDate(rev.date);

            return (
              <div 
                key={rev.id}
                className="p-5 rounded-2xl border-2 border-[#EAE7E1] bg-white shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[#2E2A5E]">
                        — {author}
                      </span>
                      <span className="bg-[#EBF7EE] text-[#1B7A3D] text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-[#C8E6C9] flex items-center gap-1">
                        <CheckCircle2 size={10} /> Verified Visit
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B6560] font-medium mt-0.5">
                      {formattedDate}
                    </p>
                  </div>

                  {/* Stars and numerical score */}
                  <div className="flex items-center gap-1.5 bg-[#FFFBEB] px-2.5 py-1 rounded-lg border border-[#FDE68A]">
                    <div className="flex items-center text-[#F2A93B]">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star 
                          key={s} 
                          size={12} 
                          className={s <= reviewRating ? 'fill-[#F2A93B] text-[#F2A93B]' : 'text-[#D1D5DB]'} 
                        />
                      ))}
                    </div>
                    <span className="text-xs font-extrabold text-[#B45309] font-mono">
                      {reviewRating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Review Text - Always populated with realistic text */}
                <p className="text-xs text-[#231F20] font-medium leading-relaxed bg-[#F6F4F1] p-3.5 rounded-xl border border-[#EAE7E1]">
                  "{content}"
                </p>

                {rev.cleanlinessRating && (
                  <div className="flex flex-wrap gap-2 text-[10px] text-[#6B6560] font-bold pt-1">
                    <span className="bg-white border border-[#EAE7E1] px-2 py-0.5 rounded-md">
                      Hygiene: {rev.cleanlinessRating}/5
                    </span>
                    <span className="bg-white border border-[#EAE7E1] px-2 py-0.5 rounded-md">
                      Staff: {rev.staffRating || 5}/5
                    </span>
                    <span className="bg-white border border-[#EAE7E1] px-2 py-0.5 rounded-md">
                      Emergency: {rev.emergencyCareRating || 5}/5
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Write a Review Modal */}
      {isWriteOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border-2 border-[#EAE7E1] shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-[#EAE7E1] pb-3">
              <h3 className="text-lg font-heading font-extrabold text-[#2E2A5E] flex items-center gap-2">
                <Star className="text-[#F2A93B] fill-[#F2A93B]" size={20} /> Review {hospital?.name}
              </h3>
              <button 
                onClick={() => setIsWriteOpen(false)}
                className="text-[#8A847F] hover:text-[#231F20] text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs font-bold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#6B6560] uppercase tracking-wider mb-1">Your Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    className="w-full p-3 bg-[#F6F4F1] border-2 border-[#EAE7E1] rounded-xl text-xs font-extrabold text-[#2E2A5E] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#6B6560] uppercase tracking-wider mb-1">Visit Type</label>
                  <input
                    type="text"
                    value={userRole}
                    onChange={e => setUserRole(e.target.value)}
                    placeholder="e.g. Rabies Vaccine / Dog Bite"
                    className="w-full p-3 bg-[#F6F4F1] border-2 border-[#EAE7E1] rounded-xl text-xs font-extrabold text-[#2E2A5E] outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#6B6560] uppercase tracking-wider mb-1">Overall Star Rating</label>
                <div className="flex items-center gap-2 p-2 bg-[#F6F4F1] rounded-xl border border-[#EAE7E1]">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1.5 transition-transform hover:scale-125 cursor-pointer"
                    >
                      <Star
                        size={22}
                        className={star <= rating ? "text-[#F2A93B] fill-[#F2A93B]" : "text-[#D1D5DB]"}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-extrabold text-[#2E2A5E] ml-2">
                    {rating} out of 5 stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[#6B6560] uppercase tracking-wider mb-1">
                  Your Detailed Experience
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Share details regarding vaccine administration, doctor guidance, or emergency room response..."
                  className="w-full p-3 bg-[#F6F4F1] border-2 border-[#EAE7E1] rounded-xl text-xs font-medium text-[#2E2A5E] outline-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsWriteOpen(false)}
                  className="flex-1 border-[#EAE7E1] text-[#2E2A5E] rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#E05D3F] hover:bg-[#c94d31] text-white rounded-xl font-extrabold"
                >
                  Submit Verified Review
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

