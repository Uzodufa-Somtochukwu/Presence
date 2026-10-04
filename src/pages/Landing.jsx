import { Link } from 'react-router-dom';
import BotanicalBackdrop from '../components/common/BotanicalBackdrop.jsx';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1c1a] via-[#122d29] to-[#173a34] text-[#f5eee4] flex flex-col justify-between relative overflow-hidden">
      <BotanicalBackdrop variant="teal" />

      {/* Top Bar with brand & sign-in shortcut */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 p-2 flex items-center justify-center backdrop-blur-sm shadow-md">
            <img
              src="/assets/presence-logo-cream.png"
              alt="Presence logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-serif text-xl tracking-wider font-medium text-[#f5eee4]">
            Presence
          </span>
        </div>

        <Link
          to="/login"
          className="text-sm font-medium text-[#f5eee4]/80 hover:text-[#f5eee4] transition-colors py-2 px-4 rounded-full border border-white/15 hover:border-white/30 backdrop-blur-sm"
        >
          Sign In
        </Link>
      </header>

      {/* Main Hero Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg mx-auto text-center space-y-8 p-8 sm:p-12 rounded-3xl bg-[#11221f]/75 border border-white/15 shadow-2xl backdrop-blur-md transition-all duration-500 animate-in fade-in zoom-in-95">
          <div className="inline-block relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-white/10 border border-white/20 p-4 flex items-center justify-center shadow-inner group">
              <img
                src="/assets/presence-logo-cream.png"
                alt="Presence"
                className="w-full h-full object-contain filter drop-shadow animate-breathe"
              />
            </div>
            <div className="absolute -top-1 -right-1 text-[#e4c887] text-lg font-serif animate-pulse">
              ✧
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-[#f5eee4] text-balance">
              Presence
            </h1>
            <p className="text-base sm:text-lg text-[#f5eee4]/80 font-light leading-relaxed max-w-md mx-auto text-balance">
              A serene space to feel heard, supported, and understood. A gentle companion for life’s moments.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/signup"
              className="flex-1 py-4 px-6 rounded-full bg-[#f5eee4] text-[#0e1c1a] font-semibold text-base shadow-lg shadow-black/20 hover:bg-[#fffaf2] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-center"
            >
              Get started
            </Link>
            <Link
              to="/login"
              className="flex-1 py-4 px-6 rounded-full bg-white/5 hover:bg-white/10 text-[#f5eee4] border border-white/20 font-medium text-base hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-center"
            >
              I have an account
            </Link>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-6 text-xs text-[#f5eee4]/60">
            <span>Private & confidential</span>
            <span aria-hidden="true">·</span>
            <span>Zero judgment</span>
            <span aria-hidden="true">·</span>
            <span>Always here</span>
          </div>
        </div>
      </main>

      {/* Quiet Footer */}
      <footer className="relative z-10 w-full text-center py-6 text-xs text-[#f5eee4]/50">
        Presence © {new Date().getFullYear()} · A friend for life’s moments
      </footer>
    </div>
  );
}
