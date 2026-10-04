import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BotanicalBackdrop from '../../components/common/BotanicalBackdrop.jsx';
import BrandHeader from '../../components/common/BrandHeader.jsx';
import { usePresence } from '../../context/PresenceContext.jsx';

export default function PresencePersonality() {
  const navigate = useNavigate();
  const { presence, updateProfile, showToast } = usePresence();

  const [personality, setPersonality] = useState(
    presence.personality || 'warm, attentive, and calming'
  );
  const [selectedPreset, setSelectedPreset] = useState('Gentle & Calming');

  const presets = [
    {
      label: 'Gentle & Calming',
      prompt: 'A calming presence who helps you pause, breathe, and slow down with zero judgment.',
      icon: '🌿',
    },
    {
      label: 'Witty & Playful',
      prompt: 'Loves cheerful banter, laughter, and sharing lighthearted moments with you.',
      icon: '✨',
    },
    {
      label: 'Empathetic Listener',
      prompt: 'Deeply patient and compassionate, giving you the space to unpack whatever you feel.',
      icon: '🤍',
    },
    {
      label: 'Thoughtful Mentor',
      prompt: 'Reflective, grounded, and encouraging, helping you think things through clearly.',
      icon: '📖',
    },
    {
      label: 'Uplifting Cheerleader',
      prompt: 'Warm, enthusiastic, and always celebrating your small daily victories.',
      icon: '☀️',
    },
  ];

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset.label);
    setPersonality(preset.prompt);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      personality: personality.trim(),
    });
    localStorage.setItem('presencePersonalizationComplete', 'true');
    showToast(`Personalization saved for ${presence.displayName}!`);
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f1e9] via-[#efe5d5] to-[#e8d8c8] text-[#263632] flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      <BotanicalBackdrop variant="default" />

      <main className="relative z-10 w-full max-w-2xl bg-[#fffaf3]/95 border border-[#705142]/15 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 my-6 text-center">
        <div className="mb-6">
          <BrandHeader theme="light" />
        </div>

        <div className="space-y-2 mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#173a34] text-balance">
            Personalize your Presence
          </h1>
          <p className="text-sm sm:text-base text-[#5d6761] leading-relaxed text-balance">
            Help us understand the kind of companionship and energy you’d enjoy from {presence.displayName}.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          {/* Quick Preset Cards */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#173a34]">
              Choose a vibe or energy:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {presets.map((p) => {
                const isSelected = selectedPreset === p.label;
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'border-[#173a34] bg-white shadow-sm ring-1 ring-[#173a34]/30'
                        : 'border-[#705142]/15 bg-white/50 hover:bg-white hover:border-[#705142]/30'
                    }`}
                  >
                    <span className="text-xl shrink-0">{p.icon}</span>
                    <div className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-[#173a34]">
                        {p.label}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="text-[#173a34] font-bold text-xs shrink-0">
                        Selected
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed personality & interests */}
          <div>
            <label
              htmlFor="personalityText"
              className="block text-xs font-semibold uppercase tracking-wider text-[#173a34] mb-2"
            >
              Personality, energy, and shared interests:
            </label>
            <textarea
              id="personalityText"
              rows={4}
              maxLength={500}
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="e.g. warm, curious, loves to talk about books, coffee, and evening thoughts..."
              className="w-full p-4 rounded-xl bg-white border border-[#705142]/20 text-[#263632] placeholder-[#5d6761]/50 focus:outline-none focus:ring-2 focus:ring-[#173a34]/30 focus:border-[#173a34] transition-all text-sm resize-none shadow-inner"
            />
            <div className="flex justify-between items-center text-xs text-[#5d6761] mt-1.5">
              <span>Your companion will adapt to this tone</span>
              <span>{personality.length} / 500</span>
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
              Save & Enter Presence →
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
