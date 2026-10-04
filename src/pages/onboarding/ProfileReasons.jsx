import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BotanicalBackdrop from '../../components/common/BotanicalBackdrop.jsx';
import BrandHeader from '../../components/common/BrandHeader.jsx';
import ProgressStepper from '../../components/common/ProgressStepper.jsx';
import { usePresence } from '../../context/PresenceContext.jsx';

export default function ProfileReasons() {
  const navigate = useNavigate();
  const { profile, updateProfile } = usePresence();

  const [selectedReasons, setSelectedReasons] = useState(
    profile.reasons || ['I want someone to talk to', 'I want someone to listen']
  );
  const [selectedLookingFor, setSelectedLookingFor] = useState(
    profile.lookingFor || ['A friend', 'Someone to talk things through with']
  );

  const reasonsList = [
    'I want someone to talk to',
    'I spend a lot of time alone',
    'I work from home',
    'I miss someone',
    'I want a friend',
    'I want someone to listen',
    'I want encouragement',
    'I want someone to laugh and gist with',
    'Something else',
  ];

  const lookingForList = [
    'A friend',
    'Someone to listen',
    'Someone to talk things through with',
    'Someone to make me laugh',
    'Someone to encourage me',
    'Someone to check in on me',
    'A little bit of everything',
  ];

  const toggleReason = (reason) => {
    setSelectedReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    );
  };

  const toggleLookingFor = (item) => {
    setSelectedLookingFor((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleNext = () => {
    updateProfile({
      reasons: selectedReasons,
      lookingFor: selectedLookingFor,
    });
    navigate('/profile/about');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2d1f1b] via-[#4d382f] to-[#6d4f43] text-[#f7f0e7] flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      <BotanicalBackdrop variant="earth" />

      <div className="relative z-10 w-full max-w-3xl bg-[#3f2e27]/85 border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 my-6">
        <div className="flex flex-col items-center gap-2 mb-6">
          <BrandHeader theme="dark" />
          <ProgressStepper currentStep={2} totalSteps={3} />
        </div>

        <div className="text-center space-y-2 mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#f7f0e7] text-balance">
            What brings you here?
          </h1>
          <p className="text-sm sm:text-base text-[#f7f0e7]/80 leading-relaxed text-balance">
            Choose whatever feels right. There are no wrong answers.
          </p>
        </div>

        <div className="space-y-8">
          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-serif font-medium text-[#d8b784]">
              What brings you to Presence?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {reasonsList.map((reason) => {
                const isSelected = selectedReasons.includes(reason);
                return (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => toggleReason(reason)}
                    className={`p-3.5 rounded-xl border text-left text-sm font-medium flex items-center gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#d8b784] bg-[#d8b784]/20 text-[#f7f0e7] shadow-sm ring-1 ring-[#d8b784]/40'
                        : 'border-white/10 bg-white/5 text-[#f7f0e7]/80 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        isSelected ? 'border-[#d8b784] bg-[#d8b784] text-[#2d1f1b]' : 'border-white/30'
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                        </svg>
                      )}
                    </span>
                    <span className="flex-1">{reason}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-serif font-medium text-[#d8b784]">
              What kind of presence are you looking for?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {lookingForList.map((item) => {
                const isSelected = selectedLookingFor.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleLookingFor(item)}
                    className={`p-3.5 rounded-xl border text-left text-sm font-medium flex items-center gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#d8b784] bg-[#d8b784]/20 text-[#f7f0e7] shadow-sm ring-1 ring-[#d8b784]/40'
                        : 'border-white/10 bg-white/5 text-[#f7f0e7]/80 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        isSelected ? 'border-[#d8b784] bg-[#d8b784] text-[#2d1f1b]' : 'border-white/30'
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                        </svg>
                      )}
                    </span>
                    <span className="flex-1">{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              type="button"
              onClick={handleNext}
              className="w-full sm:w-auto min-w-[240px] py-4 px-8 rounded-full bg-gradient-to-r from-[#f7f0e7] to-[#ecdfd2] text-[#2d1f1b] font-bold text-base shadow-xl shadow-black/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Next</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
