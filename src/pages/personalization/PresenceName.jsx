import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BotanicalBackdrop from '../../components/common/BotanicalBackdrop.jsx';
import BrandHeader from '../../components/common/BrandHeader.jsx';
import { usePresence } from '../../context/PresenceContext.jsx';

export default function PresenceName() {
  const navigate = useNavigate();
  const { presence, updateProfile, showToast } = usePresence();

  const [name, setName] = useState(presence.displayName === 'Lumi' ? '' : presence.displayName);
  const maxLength = 1000;

  const suggestions = ['Lumi', 'Rowan', 'Sage', 'Mira', 'Zephyr', 'Oliver', 'Sol', 'Nova'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalName = name.trim() || 'Lumi';
    updateProfile({
      presenceName: finalName,
      name: finalName,
    });
    showToast(`Your companion is now named ${finalName}`);
    navigate('/presence/avatar');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f1e9] via-[#efe5d5] to-[#e8d8c8] text-[#263632] flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      <BotanicalBackdrop variant="default" />

      <main className="relative z-10 w-full max-w-xl bg-[#fffaf3]/95 border border-[#705142]/15 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 my-6 text-center">
        <div className="mb-6">
          <BrandHeader theme="light" />
        </div>

        <div className="space-y-2 mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#173a34] text-balance">
            Give your Presence a name
          </h1>
          <p className="text-sm sm:text-base text-[#5d6761] leading-relaxed text-balance">
            Choose a name for your companion — something warm, familiar, meaningful, or simply a name you like.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label
              htmlFor="companionName"
              className="block text-xs font-semibold uppercase tracking-wider text-[#173a34] mb-2"
            >
              Presence Name
            </label>
            <textarea
              id="companionName"
              rows={3}
              maxLength={maxLength}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type the name you have in mind (e.g., Lumi, Rowan)..."
              className="w-full p-4 rounded-xl bg-white border border-[#705142]/20 text-[#263632] placeholder-[#5d6761]/50 focus:outline-none focus:ring-2 focus:ring-[#173a34]/30 focus:border-[#173a34] transition-all text-base resize-none shadow-inner"
            />
            <div className="flex justify-between items-center text-xs text-[#5d6761] mt-1.5">
              <span>Defaults to "Lumi" if left blank</span>
              <span>
                {name.length.toLocaleString()} / {maxLength.toLocaleString()} characters
              </span>
            </div>
          </div>

          {/* Quick inspiration chips */}
          <div>
            <span className="block text-xs font-medium text-[#705142] mb-2">
              Gentle suggestions:
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => setName(sug)}
                  className={`text-xs py-1.5 px-3 rounded-full border transition-all cursor-pointer ${
                    name === sug
                      ? 'bg-[#173a34] text-white border-[#173a34]'
                      : 'bg-white/70 border-[#705142]/20 text-[#263632] hover:bg-white hover:border-[#173a34]/40'
                  }`}
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Link
              to="/presence/personalize"
              className="text-sm font-semibold text-[#705142] hover:text-[#173a34] order-2 sm:order-1"
            >
              ← Back to choices
            </Link>
            <button
              type="submit"
              className="w-full sm:w-auto py-3.5 px-8 rounded-full bg-[#173a34] text-[#fffaf2] font-semibold text-sm shadow-lg shadow-[#173a34]/20 hover:bg-[#245248] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer order-1 sm:order-2"
            >
              Continue to Avatar →
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
