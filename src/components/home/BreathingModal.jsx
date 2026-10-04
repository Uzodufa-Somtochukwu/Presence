import { useState, useEffect } from 'react';

export default function BreathingModal({ isOpen, onClose, companionName = 'Lumi' }) {
  const [phase, setPhase] = useState('Inhale');
  const [seconds, setSeconds] = useState(4);
  const [cycleCount, setCycleCount] = useState(1);

  useEffect(() => {
    if (!isOpen) return;

    const phases = [
      { name: 'Inhale gently', duration: 4, next: 'Hold gently' },
      { name: 'Hold gently', duration: 4, next: 'Exhale slowly' },
      { name: 'Exhale slowly', duration: 4, next: 'Rest' },
      { name: 'Rest in quiet', duration: 3, next: 'Inhale gently' },
    ];

    let currentIdx = 0;
    setPhase(phases[0].name);
    setSeconds(phases[0].duration);

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          currentIdx = (currentIdx + 1) % phases.length;
          if (currentIdx === 0) {
            setCycleCount((c) => c + 1);
          }
          setPhase(phases[currentIdx].name);
          return phases[currentIdx].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const isInhale = phase.includes('Inhale');
  const isExhale = phase.includes('Exhale');
  const isHold = phase.includes('Hold');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dimmed backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#0e1c1a]/70 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="relative z-10 w-full max-w-md bg-[#122d29] text-[#f5eee4] border border-white/20 rounded-3xl p-8 sm:p-10 shadow-2xl text-center flex flex-col items-center animate-in fade-in zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors text-lg"
          aria-label="Close calm space"
        >
          ✕
        </button>

        <span className="text-xs uppercase tracking-widest text-[#d8b784] font-medium mb-1">
          {companionName} is right beside you
        </span>
        <h3 className="font-serif text-2xl font-normal text-white mb-6">
          Take all the time you need
        </h3>

        {/* Breathing Orb */}
        <div className="relative w-56 h-56 flex items-center justify-center my-6">
          {/* Outer ripples */}
          <div
            className={`absolute inset-0 rounded-full bg-[#a8b698]/10 transition-transform duration-1000 ${
              isInhale ? 'scale-125' : isExhale ? 'scale-90' : 'scale-110'
            }`}
          />
          <div
            className={`absolute inset-4 rounded-full bg-[#d8b784]/15 transition-transform duration-1000 ${
              isInhale ? 'scale-115' : isExhale ? 'scale-95' : 'scale-105'
            }`}
          />

          {/* Central orb */}
          <div
            className={`w-36 h-36 rounded-full bg-gradient-to-br from-[#a8b698] to-[#173a34] flex flex-col items-center justify-center shadow-xl transition-all duration-1000 ${
              isInhale ? 'scale-110 shadow-[#a8b698]/30' : isExhale ? 'scale-90' : 'scale-100'
            }`}
          >
            <span className="text-lg font-serif font-medium text-white tracking-wide">
              {phase}
            </span>
            <span className="text-2xl font-bold text-[#e4c887] tabular-nums mt-1">
              {seconds}s
            </span>
          </div>
        </div>

        <p className="text-xs text-white/70 italic mt-2">
          Cycle {cycleCount} · Release any tension in your jaw and shoulders
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-8 py-3 px-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-sm font-semibold text-white transition-all cursor-pointer"
        >
          I feel grounded now
        </button>
      </div>
    </div>
  );
}
