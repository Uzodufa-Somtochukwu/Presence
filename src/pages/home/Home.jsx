import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePresence } from '../../context/PresenceContext.jsx';
import CompanionAvatarView from '../../components/common/CompanionAvatarView.jsx';
import ChatDrawer from '../../components/home/ChatDrawer.jsx';
import BreathingModal from '../../components/home/BreathingModal.jsx';
import CheckInModal from '../../components/home/CheckInModal.jsx';
import PresencePointsModal from '../../components/home/PresencePointsModal.jsx';
import VoiceTalkModal from '../../components/home/VoiceTalkModal.jsx';
import WalletConnection from '../../components/wallet/WalletConnection.jsx';
import { readAppSettings } from '../../utils/storage.js';
import {
  addPointsHistory,
  getLocalDateKey,
  getPresencePoints,
} from '../../utils/points.js';

export default function Home() {
  const navigate = useNavigate();
  const {
    presence,
    settings,
    updateSettings,
    toggleTheme,
    toggleLargeText,
    showToast,
  } = usePresence();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [breathingOpen, setBreathingOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [pointsOpen, setPointsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Time-aware greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: '⌂' },
    { id: 'chat', label: 'Chat', icon: '▱', action: () => setChatOpen(true) },
    { id: 'talk', label: 'Talk', icon: '🎙️', action: () => setVoiceOpen(true) },
    { id: 'memories', label: 'Memories', icon: '✿', action: () => showToast('Your memories are softly organized here.') },
    { id: 'people', label: 'People in my life', icon: '♧', action: () => showToast('Your loved ones and personal circle notes.') },
    { id: 'activities', label: 'Activities', icon: '✧', action: () => setBreathingOpen(true) },
    { id: 'stories', label: 'My Stories', icon: '▤', action: () => showToast('Saved journal stories & daily thoughts.') },
    { id: 'check-ins', label: 'Check-ins', icon: '♡', action: () => setCheckInOpen(true) },
    { id: 'points', label: 'Presence Points', icon: '◈', action: () => setPointsOpen(true) },
    { id: 'settings', label: 'Settings', icon: '⚙', action: () => navigate('/presence/personalize') },
  ];

  const handleStarterClick = (prompt) => {
    setChatOpen(true);
    showToast(`Starting chat: "${prompt}"`);
  };

  const handleBreathingComplete = () => {
    const currentSettings = readAppSettings();
    const today = getLocalDateKey();

    if (currentSettings.dailyActivityDate === today) {
      showToast('You’ve earned today’s activity points. Come back tomorrow.');
      return;
    }

    updateSettings({
      points: getPresencePoints(currentSettings) + 5,
      pointsHistory: addPointsHistory(currentSettings, 'Breathing pause', 5),
      dailyActivityDate: today,
    });
    showToast('You completed a breathing pause. +5 Presence Points.');
  };

  // TODO: use a reliable daily streak ledger before awarding 7-day bonuses.

  return (
    <div className="min-h-screen bg-[#f6eee3] dark:bg-[#14221f] text-[#263632] dark:text-[#f4eee5] flex flex-col md:flex-row transition-colors duration-300">
      {/* Mobile Backdrop overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-[#173a34] dark:bg-[#0e221f] text-[#f5eee4] flex flex-col justify-between p-6 shadow-2xl transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Brand Mark */}
          <Link
            to="/home"
            className="flex items-center gap-3 group focus:outline-none"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 rounded-full bg-white/10 p-2 flex items-center justify-center border border-white/15 group-hover:scale-105 transition-transform">
              <img
                src="/assets/presence-logo-cream.png"
                alt="Presence"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-serif text-xl font-medium tracking-wide block">
                Presence
              </span>
              <span className="text-[11px] text-[#f5eee4]/60 font-light block -mt-0.5">
                A friend for life’s moments
              </span>
            </div>
          </Link>

          {/* Nav List */}
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                    if (item.action) item.action();
                  }}
                  className={`w-full py-2.5 px-3.5 rounded-xl flex items-center gap-3 text-sm font-medium transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-white/15 text-white font-semibold shadow-xs'
                      : 'text-[#f5eee4]/75 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-base w-5 text-center">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Utility / Footer in sidebar */}
        <div className="pt-4 border-t border-white/15 space-y-2 text-xs">
          <WalletConnection />

          <button
            type="button"
            onClick={toggleTheme}
            className="w-full py-2 px-3 rounded-lg text-left text-[#f5eee4]/80 hover:bg-white/10 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <span>{settings.theme === 'dark' ? '☀️' : '🌙'}</span>
            <span>{settings.theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button
            type="button"
            onClick={toggleLargeText}
            className="w-full py-2 px-3 rounded-lg text-left text-[#f5eee4]/80 hover:bg-white/10 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <span>🔤</span>
            <span>{settings.largeText ? 'Standard Text' : 'Larger Text'}</span>
          </button>

          <Link
            to="/"
            className="block py-2 px-3 rounded-lg text-[#f5eee4]/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            Sign out
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-12 relative overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Topbar */}
          <header className="flex items-center justify-between gap-4 pb-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden w-11 h-11 rounded-2xl bg-white/70 dark:bg-white/10 border border-black/10 dark:border-white/15 flex items-center justify-center text-lg cursor-pointer"
              aria-label="Open menu"
            >
              ☰
            </button>

            <div className="flex items-center gap-2.5 ml-auto">
              {/* Streak Badge */}
              <button
                type="button"
                onClick={() => showToast(`🔥 ${settings.streak || 7} day reflection streak! You're doing wonderful.`)}
                className="py-1.5 px-3.5 rounded-full border border-black/10 dark:border-white/15 bg-white/80 dark:bg-white/10 text-xs font-semibold flex items-center gap-1.5 hover:bg-white transition-all cursor-pointer shadow-xs"
              >
                <span>🔥</span>
                <span className="tabular-nums">{settings.streak || 7}</span>
              </button>

              {/* Points Badge */}
              <button
                type="button"
                onClick={() => setPointsOpen(true)}
                aria-label="View Unlocks and your Presence Points"
                className="py-1.5 px-3.5 rounded-full border border-black/10 dark:border-white/15 bg-white/80 dark:bg-white/10 text-xs font-semibold flex items-center gap-1.5 hover:bg-white transition-all cursor-pointer shadow-xs"
              >
                <span>🪙</span>
                <span className="tabular-nums">{getPresencePoints(settings).toLocaleString()}</span>
              </button>

              {/* Notification Popover */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="w-10 h-10 rounded-full border border-black/10 dark:border-white/15 bg-white/80 dark:bg-white/10 flex items-center justify-center text-sm hover:bg-white transition-all cursor-pointer relative"
                  aria-label="Notifications"
                >
                  <span>🔔</span>
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#b96851]" />
                </button>

                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-72 p-4 bg-white dark:bg-[#1f332e] border border-black/10 dark:border-white/15 rounded-2xl shadow-xl z-30 animate-in fade-in zoom-in-95">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#173a34] dark:text-[#a8b698] mb-2">
                      Quiet Moments
                    </h4>
                    <p className="text-xs text-[#5d6761] dark:text-[#a3b2ab] leading-relaxed">
                      {presence.displayName} is ready whenever you feel like sharing your thoughts or taking a breathing pause.
                    </p>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#705142] to-[#b96851] text-white font-serif font-bold text-xs flex items-center justify-center shadow-xs">
                    {(presence.userName || 'S')[0]}
                  </div>
                  <span className="text-xs font-semibold hidden sm:inline text-[#173a34] dark:text-white">
                    {presence.userName || 'Somto'}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 p-2 bg-white dark:bg-[#1f332e] border border-black/10 dark:border-white/15 rounded-2xl shadow-xl z-30 animate-in fade-in zoom-in-95">
                    <Link
                      to="/presence/personalize"
                      className="block px-3 py-2 rounded-xl text-xs font-medium text-[#263632] dark:text-[#f4eee5] hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      Personalize Companion
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-3 py-2 rounded-xl text-xs font-medium text-[#263632] dark:text-[#f4eee5] hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      Edit Profile
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate('/');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#b96851] hover:bg-[#b96851]/10"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Welcome Title */}
          <section className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#705142] dark:text-[#d8b784]">
              A softer place to land
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#173a34] dark:text-white text-balance">
              {greeting},<br />
              {presence.userName || 'Somto'}. <span className="inline-block animate-gentle-drift">🌿</span>
            </h1>
            <p className="text-base text-[#5d6761] dark:text-[#a3b2ab] pt-1">
              I’m here. What would you like to do?
            </p>
          </section>

          {/* Companion Spotlight Card (Hero) */}
          <section className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#fbf4eb] via-[#fffaf3] to-[#eee2d2] dark:from-[#1b2f2a] dark:via-[#1f3530] dark:to-[#172b26] border border-[#705142]/15 dark:border-white/10 shadow-xl flex flex-col md:flex-row items-center gap-8">
            <div className="flex flex-col items-center shrink-0">
              <CompanionAvatarView
                avatar={presence.avatar}
                customPhoto={presence.customPhoto}
                size="md"
                animate={true}
              />
              <span className="text-[11px] font-medium text-[#705142] dark:text-[#d8b784] px-3 py-1 rounded-full bg-white/70 dark:bg-black/30 border border-[#705142]/10 mt-3 shadow-2xs">
                your companion, always growing
              </span>
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
              <span className="text-xs font-semibold tracking-wider text-[#705142] dark:text-[#d8b784]">
                A familiar face, whenever you need one
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#173a34] dark:text-white flex items-center justify-center md:justify-start gap-2">
                <span>{presence.displayName}</span>
                <span className="text-emerald-700 dark:text-emerald-400 text-lg">🌿</span>
              </h2>
              <span className="text-xs text-[#5d6761] dark:text-[#a3b2ab] block">
                Your Presence Companion
              </span>
              <p className="text-sm sm:text-base text-[#263632]/90 dark:text-[#f4eee5]/90 leading-relaxed pt-2 max-w-xl">
                Hi {presence.userName || 'Somto'} ✿<br />
                I’m {presence.displayName}. I’m right here whenever you need a chat, a listening ear, or just peaceful company.
                {presence.personality ? ` You've guided me to be ${presence.personality}.` : ''}
              </p>

              <div className="pt-3 flex flex-wrap justify-center md:justify-start gap-3">
                <button
                  type="button"
                  onClick={() => setChatOpen(true)}
                  className="py-2.5 px-6 rounded-full bg-[#173a34] dark:bg-[#e4c887] text-[#fffaf2] dark:text-[#102d2a] font-semibold text-xs shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer"
                >
                  Start Conversation →
                </button>
                <Link
                  to="/presence/personalize"
                  className="py-2.5 px-5 rounded-full border border-[#705142]/20 dark:border-white/20 text-xs font-semibold text-[#705142] dark:text-[#e4c887] hover:bg-white/60 dark:hover:bg-white/5 transition-all"
                >
                  Personalize Appearance
                </Link>
              </div>
            </div>
          </section>

          {/* Primary Action Buttons */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Chat Action */}
            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="p-6 rounded-2xl bg-gradient-to-br from-[#214c43] to-[#173a34] text-[#fffaf2] border border-white/20 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-left flex items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                  💬
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium">Chat</h3>
                  <p className="text-xs text-white/80">Let’s talk about whatever is on your mind.</p>
                </div>
              </div>
              <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
            </button>

            {/* Talk Action */}
            <button
              type="button"
              onClick={() => setVoiceOpen(true)}
              className="p-6 rounded-2xl bg-gradient-to-br from-[#c47b60] to-[#a75f4c] text-[#fffaf2] border border-white/20 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-left flex items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                  🎙️
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium">Talk</h3>
                  <p className="text-xs text-white/80">Just use your voice. I’ll listen.</p>
                </div>
              </div>
              <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </section>

          {/* Calming "I just want someone here" Button */}
          <button
            type="button"
            onClick={() => setBreathingOpen(true)}
            className="w-full py-4 px-6 rounded-2xl border border-[#b96851]/30 bg-gradient-to-r from-[#f1dfd9] via-[#f7eae0] to-[#f3e5d3] dark:from-[#352520] dark:via-[#3d2c26] dark:to-[#2e211d] text-[#754c41] dark:text-[#f4c8b0] font-serif text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <span>❤️</span>
            <span className="font-semibold">I just want someone here. (Calm Space)</span>
          </button>

          {/* Continue Past Conversation Card */}
          <div
            onClick={() => setChatOpen(true)}
            className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#e2e9d7] via-[#faf7eb] to-[#ede0d0] dark:from-[#21352f] dark:via-[#283e37] dark:to-[#213129] border border-[#a8b698]/30 dark:border-white/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-white/80 dark:bg-white/10 border border-[#a8b698]/20 flex items-center justify-center text-xl shrink-0">
                🌿
              </div>
              <div className="min-w-0">
                <h3 className="font-serif text-base sm:text-lg font-semibold text-[#173a34] dark:text-white">
                  Continue our conversation
                </h3>
                <p className="text-xs sm:text-sm text-[#5d6761] dark:text-[#a3b2ab] truncate">
                  Yesterday you were telling me about your exam and how nervous you feel. Would you like to continue?
                </p>
              </div>
            </div>
            <span className="text-lg text-[#173a34] dark:text-white shrink-0">→</span>
          </div>

          {/* Starter Prompts */}
          <section className="space-y-4 pt-2">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#173a34] dark:text-white">
                  A little something to start with
                </h3>
                <p className="text-xs sm:text-sm text-[#5d6761] dark:text-[#a3b2ab]">
                  No pressure. Just a place to begin.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => handleStarterClick('How has your day really been?')}
                className="p-5 rounded-2xl bg-[#f0deda] dark:bg-[#3d2c2c] text-[#35443c] dark:text-[#f4eee5] border border-black/5 dark:border-white/5 font-serif text-sm sm:text-base text-left hover:-translate-y-1 transition-all shadow-xs cursor-pointer flex flex-col justify-between min-h-[110px]"
              >
                <span>How has your day really been?</span>
                <span className="text-xs text-[#b96851] font-sans font-semibold mt-2">Start chat →</span>
              </button>

              <button
                type="button"
                onClick={() => handleStarterClick('Want to gist? I have time.')}
                className="p-5 rounded-2xl bg-[#e8e0ec] dark:bg-[#34283c] text-[#35443c] dark:text-[#f4eee5] border border-black/5 dark:border-white/5 font-serif text-sm sm:text-base text-left hover:-translate-y-1 transition-all shadow-xs cursor-pointer flex flex-col justify-between min-h-[110px]"
              >
                <span>Want to gist?<br />I have time.</span>
                <span className="text-xs text-[#83515b] font-sans font-semibold mt-2">Start chat →</span>
              </button>

              <button
                type="button"
                onClick={() => handleStarterClick('What’s making you smile today?')}
                className="p-5 rounded-2xl bg-[#f3e8c9] dark:bg-[#3c3624] text-[#35443c] dark:text-[#f4eee5] border border-black/5 dark:border-white/5 font-serif text-sm sm:text-base text-left hover:-translate-y-1 transition-all shadow-xs cursor-pointer flex flex-col justify-between min-h-[110px]"
              >
                <span>What’s making you smile today?</span>
                <span className="text-xs text-[#705142] font-sans font-semibold mt-2">Start chat →</span>
              </button>

              <button
                type="button"
                onClick={() => handleStarterClick('Do you feel like talking, laughing, or just having some company?')}
                className="p-5 rounded-2xl bg-[#e1e8d9] dark:bg-[#25362a] text-[#35443c] dark:text-[#f4eee5] border border-black/5 dark:border-white/5 font-serif text-sm sm:text-base text-left hover:-translate-y-1 transition-all shadow-xs cursor-pointer flex flex-col justify-between min-h-[110px]"
              >
                <span>Do you feel like talking, laughing, or just having company?</span>
                <span className="text-xs text-[#245248] font-sans font-semibold mt-2">Start chat →</span>
              </button>
            </div>
          </section>

          {/* Closing Warmth */}
          <footer className="py-8 text-center text-sm font-serif text-[#705142] dark:text-[#d8b784]">
            You’re not alone here. <span className="text-[#b96851]">♡</span>
          </footer>
        </div>
      </main>

      {/* Interactive Modals */}
      <ChatDrawer
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        companion={presence}
        userName={presence.userName || 'Somto'}
      />

      <VoiceTalkModal
        isOpen={voiceOpen}
        onClose={() => setVoiceOpen(false)}
        companion={presence}
        userName={presence.userName || 'Somto'}
      />

      <BreathingModal
        isOpen={breathingOpen}
        onClose={() => setBreathingOpen(false)}
        onComplete={handleBreathingComplete}
        companionName={presence.displayName}
      />

      <CheckInModal
        isOpen={checkInOpen}
        onClose={() => setCheckInOpen(false)}
      />

      <PresencePointsModal
        isOpen={pointsOpen}
        onClose={() => setPointsOpen(false)}
        onTryIt={() => {
          setPointsOpen(false);
          setVoiceOpen(true);
        }}
      />
    </div>
  );
}
