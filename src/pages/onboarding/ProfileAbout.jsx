import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BotanicalBackdrop from '../../components/common/BotanicalBackdrop.jsx';
import BrandHeader from '../../components/common/BrandHeader.jsx';
import ProgressStepper from '../../components/common/ProgressStepper.jsx';
import { usePresence } from '../../context/PresenceContext.jsx';

export default function ProfileAbout() {
  const navigate = useNavigate();
  const { profile, updateProfile, showToast } = usePresence();

  const [aboutMe, setAboutMe] = useState(profile.aboutMe || '');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!agreed) {
      setError('Please confirm that you understand and agree before continuing.');
      return;
    }

    updateProfile({
      aboutMe: aboutMe.trim(),
      consentAgreed: true,
    });

    showToast('Your journey with Presence is ready to begin.');
    navigate('/presence/personalize');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1b2f2b] via-[#243f39] to-[#3a524a] text-[#f5eee4] flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      <BotanicalBackdrop variant="teal" />

      <div className="relative z-10 w-full max-w-2xl bg-[#11221f]/85 border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 my-6">
        <div className="flex flex-col items-center gap-2 mb-6">
          <BrandHeader theme="dark" />
          <ProgressStepper currentStep={3} totalSteps={3} />
        </div>

        <div className="text-center space-y-2 mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#f5eee4] text-balance">
            Tell us a little about yourself
          </h1>
          <p className="text-sm sm:text-base text-[#f5eee4]/80 leading-relaxed text-balance">
            Share anything you’d like Presence to know about you. Your interests, your day, things that make you happy — whatever feels comfortable.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <textarea
              rows={4}
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              placeholder="Tell me whatever you'd like me to know..."
              className="w-full p-4 rounded-xl bg-white/5 border border-white/15 text-[#f5eee4] placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/40 transition-all text-base resize-none"
            />
            <p className="text-xs text-[#f5eee4]/60 mt-1.5 italic">
              You can skip this or leave it brief. We’ll get to know each other naturally.
            </p>
          </div>

          {/* Ethical & Care Disclosure Box */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <h2 className="text-sm font-semibold tracking-wide text-[#e4c887]">
              A little note from Presence
            </h2>
            <p className="text-xs sm:text-sm text-[#f5eee4]/80 leading-relaxed">
              Presence is a supportive companion designed to listen, talk, remember what you share, and keep you company. Presence is not a replacement for medical, mental health, or crisis services.
            </p>

            <label className="flex items-start gap-3 pt-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  if (e.target.checked) setError('');
                }}
                className="mt-0.5 w-4 h-4 rounded text-[#173a34] accent-[#e4c887] cursor-pointer"
              />
              <span className="text-xs sm:text-sm font-medium text-[#f5eee4]">
                I understand and agree to continue
              </span>
            </label>

            {error && (
              <p className="text-xs text-[#f4c8b0] pt-1" role="alert">
                {error}
              </p>
            )}
          </div>

          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={handleNext}
              className="w-full sm:w-auto min-w-[240px] py-4 px-8 rounded-full bg-gradient-to-r from-[#f5eee4] to-[#efe4d2] text-[#102d2a] font-bold text-base shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Enter Presence</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
