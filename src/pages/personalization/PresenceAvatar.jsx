import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BotanicalBackdrop from '../../components/common/BotanicalBackdrop.jsx';
import BrandHeader from '../../components/common/BrandHeader.jsx';
import CompanionAvatarView from '../../components/common/CompanionAvatarView.jsx';
import { usePresence } from '../../context/PresenceContext.jsx';

export default function PresenceAvatar() {
  const navigate = useNavigate();
  const { presence, updateProfile, showToast } = usePresence();

  const [presentation, setPresentation] = useState(presence.avatarPresentation || 'Fluid');
  const [selectedPreset, setSelectedPreset] = useState(presence.avatar || 'garden');
  const [photoPreview, setPhotoPreview] = useState(presence.customPhoto || null);
  const [activeTab, setActiveTab] = useState(presence.customPhoto ? 'photo' : 'presets');

  const presets = [
    {
      id: 'garden',
      name: 'Garden Calm',
      description: 'Sage greens, warm flora, and gentle earth harmony.',
      gradient: 'from-[#b7c5ac] to-[#dfaaa0]',
    },
    {
      id: 'sunrise',
      name: 'Sunrise Ember',
      description: 'Warm honey, amber radiance, and soft coral dawn.',
      gradient: 'from-[#e4b279] to-[#d98d82]',
    },
    {
      id: 'ocean',
      name: 'Ocean Mist',
      description: 'Deep teal reflections, seafoam, and twilight stillness.',
      gradient: 'from-[#8db6b0] to-[#7398a2]',
    },
  ];

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target.result);
        setActiveTab('photo');
        showToast('Photo uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      avatarPresentation: presentation,
      avatar: activeTab === 'photo' ? selectedPreset : selectedPreset,
      customPhoto: activeTab === 'photo' ? photoPreview : null,
    });
    showToast('Presence avatar saved');
    navigate('/presence/personality');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f1e9] via-[#efe5d5] to-[#e8d8c8] text-[#263632] flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      <BotanicalBackdrop variant="default" />

      <main className="relative z-10 w-full max-w-4xl bg-[#fffaf3]/95 border border-[#705142]/15 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 my-6">
        <div className="text-center mb-6">
          <BrandHeader theme="light" />
        </div>

        <div className="text-center space-y-2 mb-8 max-w-xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#173a34] text-balance">
            Create your Presence avatar
          </h1>
          <p className="text-sm sm:text-base text-[#5d6761] leading-relaxed text-balance">
            Give {presence.displayName} an appearance and visual energy that feels welcoming and comforting.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Presentation row */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#173a34]">
              Presence Presentation
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['Feminine', 'Masculine', 'Fluid'].map((type) => {
                const isSelected = presentation === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPresentation(type)}
                    className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#173a34] bg-[#173a34] text-[#fffaf2] shadow-sm'
                        : 'border-[#705142]/20 bg-white/70 text-[#263632] hover:bg-white hover:border-[#173a34]/30'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Builder layout: Left is Preview, Right is Style selector */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#f8f1e8]/70 border border-[#705142]/10 rounded-2xl p-6">
            {/* Live Interactive Preview */}
            <div className="md:col-span-5 flex flex-col items-center justify-center space-y-3">
              <CompanionAvatarView
                avatar={selectedPreset}
                customPhoto={activeTab === 'photo' ? photoPreview : null}
                size="md"
                animate={true}
              />
              <span className="text-xs font-medium text-[#705142] px-3 py-1 rounded-full bg-white/80 border border-[#705142]/10 shadow-xs">
                {presence.displayName}’s Appearance
              </span>
            </div>

            {/* Options Tabs */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex border-b border-[#705142]/15 pb-2 gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('presets')}
                  className={`text-sm font-semibold pb-2 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'presets'
                      ? 'border-[#173a34] text-[#173a34]'
                      : 'border-transparent text-[#5d6761] hover:text-[#173a34]'
                  }`}
                >
                  Artistic Themes
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('photo')}
                  className={`text-sm font-semibold pb-2 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'photo'
                      ? 'border-[#173a34] text-[#173a34]'
                      : 'border-transparent text-[#5d6761] hover:text-[#173a34]'
                  }`}
                >
                  Custom Photo
                </button>
              </div>

              {activeTab === 'presets' ? (
                <div className="space-y-3">
                  {presets.map((preset) => {
                    const isSelected = selectedPreset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setSelectedPreset(preset.id)}
                        className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center gap-3.5 cursor-pointer ${
                          isSelected
                            ? 'border-[#173a34] bg-white shadow-sm ring-1 ring-[#173a34]/30'
                            : 'border-[#705142]/15 bg-white/50 hover:bg-white hover:border-[#705142]/30'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full bg-gradient-to-br ${preset.gradient} border border-black/10 shrink-0 shadow-inner`}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-[#173a34]">
                            {preset.name}
                          </h3>
                          <p className="text-xs text-[#5d6761] truncate">
                            {preset.description}
                          </p>
                        </div>
                        {isSelected && (
                          <span className="text-[#173a34] font-bold text-sm shrink-0">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-[#5d6761] leading-relaxed">
                    Upload an avatar image, personal illustration, or comforting photo to represent your companion.
                  </p>
                  <label className="block w-full py-8 border-2 border-dashed border-[#705142]/30 hover:border-[#173a34] rounded-xl text-center bg-white/40 hover:bg-white/80 cursor-pointer transition-colors p-4">
                    <span className="text-2xl block mb-1">📷</span>
                    <span className="text-sm font-semibold text-[#173a34] block">
                      Choose an image file
                    </span>
                    <span className="text-xs text-[#5d6761]">PNG, JPG, or WebP</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  {photoPreview && (
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      className="text-xs text-[#b96851] hover:underline cursor-pointer"
                    >
                      Remove uploaded photo
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
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
              Continue to Personality →
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
