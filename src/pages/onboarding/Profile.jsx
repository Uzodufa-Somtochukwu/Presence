import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BotanicalBackdrop from '../../components/common/BotanicalBackdrop.jsx';
import BrandHeader from '../../components/common/BrandHeader.jsx';
import ProgressStepper from '../../components/common/ProgressStepper.jsx';
import { usePresence } from '../../context/PresenceContext.jsx';

export default function Profile() {
  const navigate = useNavigate();
  const { profile, updateProfile } = usePresence();

  const [userName, setUserName] = useState(profile.userName || profile.fullName || 'Somto');
  const [ageGroup, setAgeGroup] = useState(profile.ageGroup || '25–34');
  const [pronouns, setPronouns] = useState(profile.pronouns || 'They / Them');

  const ageOptions = ['18–24', '25–34', '35–44', '45–54', '55–64', '65+'];
  const pronounOptions = ['She / Her', 'He / Him', 'They / Them', 'Prefer not to say', 'Other'];

  const handleNext = () => {
    updateProfile({
      userName: userName.trim() || 'Friend',
      ageGroup,
      pronouns,
    });
    navigate('/profile/reasons');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#102d2a] via-[#173a34] to-[#243f39] text-[#f5eee4] flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      <BotanicalBackdrop variant="teal" />

      <div className="relative z-10 w-full max-w-2xl bg-[#11221f]/85 border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95">
        <div className="flex flex-col items-center gap-2 mb-6">
          <BrandHeader theme="dark" />
          <ProgressStepper currentStep={1} totalSteps={3} />
        </div>

        <div className="text-center space-y-2 mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#f5eee4] text-balance">
            Let's get to know you
          </h1>
          <p className="text-sm sm:text-base text-[#f5eee4]/80 leading-relaxed text-balance">
            Just a few things to help Presence feel a little more like home.
          </p>
        </div>

        <div className="space-y-7">
          {/* Question 1: Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold tracking-wide text-[#f5eee4]">
              What should we call you?
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name or nickname"
              className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/15 text-[#f5eee4] placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/40 transition-all text-base"
            />
          </div>

          {/* Question 2: Age group */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold tracking-wide text-[#f5eee4]">
              What age group are you in?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {ageOptions.map((opt) => {
                const isSelected = ageGroup === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAgeGroup(opt)}
                    className={`py-3 px-4 rounded-xl border text-sm font-medium flex items-center gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#e4c887] bg-[#e4c887]/15 text-[#f5eee4] shadow-sm ring-1 ring-[#e4c887]/40'
                        : 'border-white/10 bg-white/5 text-[#f5eee4]/80 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                        isSelected ? 'border-[#e4c887] bg-[#e4c887]' : 'border-white/30'
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#102d2a]" />}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 3: Pronouns */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold tracking-wide text-[#f5eee4]">
              How should Presence refer to you?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {pronounOptions.map((opt) => {
                const isSelected = pronouns === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setPronouns(opt)}
                    className={`py-3 px-4 rounded-xl border text-sm font-medium flex items-center gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#e4c887] bg-[#e4c887]/15 text-[#f5eee4] shadow-sm ring-1 ring-[#e4c887]/40'
                        : 'border-white/10 bg-white/5 text-[#f5eee4]/80 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                        isSelected ? 'border-[#e4c887] bg-[#e4c887]' : 'border-white/30'
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#102d2a]" />}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              type="button"
              onClick={handleNext}
              className="w-full sm:w-auto min-w-[240px] py-4 px-8 rounded-full bg-gradient-to-r from-[#f5eee4] to-[#efe4d2] text-[#102d2a] font-bold text-base shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
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
