import { Link, useNavigate } from 'react-router-dom';
import BotanicalBackdrop from '../../components/common/BotanicalBackdrop.jsx';
import BrandHeader from '../../components/common/BrandHeader.jsx';
import CompanionAvatarView from '../../components/common/CompanionAvatarView.jsx';
import { usePresence } from '../../context/PresenceContext.jsx';

export default function PresencePersonalize() {
  const navigate = useNavigate();
  const { presence, showToast } = usePresence();

  const handleFinish = () => {
    localStorage.setItem('presencePersonalizationComplete', 'true');
    showToast(`Your companion ${presence.displayName} is waiting for you!`);
    navigate('/home');
  };

  const handleSkip = () => {
    localStorage.setItem('presencePersonalizationComplete', 'true');
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f1e9] via-[#efe5d5] to-[#e8d8c8] text-[#263632] flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      <BotanicalBackdrop variant="default" />

      <main className="relative z-10 w-full max-w-3xl bg-[#fffaf3]/90 border border-[#705142]/15 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 my-6">
        <div className="text-center mb-6">
          <BrandHeader theme="light" />
        </div>

        <div className="text-center space-y-2 mb-8 max-w-xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#173a34] text-balance">
            What would you like to do next?
          </h1>
          <p className="text-sm sm:text-base text-[#5d6761] leading-relaxed text-balance">
            Personalize your Presence now, or head straight into your space and come back to these anytime.
          </p>
        </div>

        {/* 3 Personalization Cards */}
        <div className="space-y-4">
          {/* Card 1: Name */}
          <Link
            to="/presence/name"
            className="group p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#f9e9df] to-[#fff8ef] border border-[#705142]/15 hover:border-[#705142]/35 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-white/80 border border-[#705142]/10 flex items-center justify-center text-2xl shadow-inner shrink-0">
                💬
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-serif font-semibold text-[#173a34]">
                    Give your Presence a name
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#173a34]/10 text-[#173a34] font-medium shrink-0">
                    {presence.displayName}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#5d6761] mt-0.5 truncate">
                  Pick a name that feels warm, familiar, or simply makes you smile.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#8d5544] text-white text-xs font-semibold shrink-0 group-hover:bg-[#784637] transition-colors">
              Choose name →
            </span>
          </Link>

          {/* Card 2: Avatar */}
          <Link
            to="/presence/avatar"
            className="group p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#e9eee2] to-[#fbf7ed] border border-[#705142]/15 hover:border-[#705142]/35 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-white/80 border border-[#705142]/10 flex items-center justify-center shadow-inner shrink-0 overflow-hidden">
                <CompanionAvatarView avatar={presence.avatar} size="sm" animate={false} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-serif font-semibold text-[#173a34]">
                    Create your Presence’s avatar
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#245248]/10 text-[#245248] font-medium capitalize shrink-0">
                    {presence.avatar} Theme
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#5d6761] mt-0.5 truncate">
                  Give your Presence a visual look and artistic energy that feels right for you.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#3e6956] text-white text-xs font-semibold shrink-0 group-hover:bg-[#325646] transition-colors">
              Build avatar →
            </span>
          </Link>

          {/* Card 3: Personality */}
          <Link
            to="/presence/personality"
            className="group p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#f2e6e9] to-[#fff7ee] border border-[#705142]/15 hover:border-[#705142]/35 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-white/80 border border-[#705142]/10 flex items-center justify-center text-2xl shadow-inner shrink-0">
                💛
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-serif font-semibold text-[#173a34]">
                    Tell us about the Presence you want
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-[#5d6761] mt-0.5 truncate">
                  {presence.personality || 'Attentive, thoughtful, and encouraging'}
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#83515b] text-white text-xs font-semibold shrink-0 group-hover:bg-[#6e424b] transition-colors">
              Personalize →
            </span>
          </Link>
        </div>

        {/* Footer CTAs */}
        <div className="mt-8 pt-6 border-t border-[#705142]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="text-xs text-[#5d6761]">
              Your Presence will get to know you naturally over time.
            </p>
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs font-semibold text-[#705142] hover:text-[#173a34] underline underline-offset-4 mt-1 cursor-pointer"
            >
              Skip for now
            </button>
          </div>

          <button
            type="button"
            onClick={handleFinish}
            className="w-full sm:w-auto py-3.5 px-8 rounded-full bg-[#173a34] text-[#fffaf2] font-semibold text-sm shadow-lg shadow-[#173a34]/20 hover:bg-[#245248] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            Take me to my Presence →
          </button>
        </div>
      </main>
    </div>
  );
}
