import { useState } from 'react';
import { readMoodEntries, writeMoodEntries } from '../../utils/storage.js';
import { usePresence } from '../../context/PresenceContext.jsx';

export default function CheckInModal({ isOpen, onClose }) {
  const { settings, updateSettings, showToast } = usePresence();

  const [selectedMood, setSelectedMood] = useState('Peaceful');
  const [reflection, setReflection] = useState('');

  if (!isOpen) return null;

  const moods = [
    { label: 'Peaceful', icon: '🌿', color: 'border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200' },
    { label: 'Grateful', icon: '🌸', color: 'border-rose-300 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200' },
    { label: 'Tired', icon: '☁️', color: 'border-slate-300 bg-slate-50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200' },
    { label: 'Anxious', icon: '⚡', color: 'border-amber-300 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200' },
    { label: 'Hopeful', icon: '☀️', color: 'border-yellow-300 bg-yellow-50 dark:bg-yellow-950/40 text-yellow-800 dark:text-yellow-200' },
  ];

  const handleSave = () => {
    const entries = readMoodEntries();
    const newEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      note: reflection.trim() || 'Daily check-in completed.',
      date: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    };

    writeMoodEntries([newEntry, ...entries]);
    updateSettings({
      points: (settings.points || 1240) + 20,
      streak: (settings.streak || 7) + 1,
    });

    showToast(`Check-in logged! +20 Presence Points earned.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-xs" />

      <div className="relative z-10 w-full max-w-lg bg-[#fffaf3] dark:bg-[#1c2e2a] text-[#263632] dark:text-[#f4eee5] border border-[#705142]/15 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#173a34] dark:text-white">
              Daily Check-in
            </h3>
            <p className="text-xs sm:text-sm text-[#5d6761] dark:text-[#a3b2ab]">
              How are you feeling in this moment?
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 text-base"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5 my-6">
          <div className="grid grid-cols-5 gap-2">
            {moods.map((m) => {
              const isSelected = selectedMood === m.label;
              return (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => setSelectedMood(m.label)}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? `${m.color} ring-2 ring-[#173a34] dark:ring-white scale-105 shadow-sm font-bold`
                      : 'border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 opacity-70 hover:opacity-100'
                  }`}
                >
                  <span className="text-2xl">{m.icon}</span>
                  <span className="text-xs truncate w-full text-center">{m.label}</span>
                </button>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5d6761] dark:text-[#a3b2ab] mb-1.5">
              Add a note or gratitude (optional)
            </label>
            <textarea
              rows={3}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What made you pause or smile today?"
              className="w-full p-3.5 rounded-xl bg-white dark:bg-[#152320] border border-[#705142]/20 dark:border-white/15 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#173a34]/30"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 rounded-full text-xs font-semibold text-[#5d6761] dark:text-[#a3b2ab] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="py-2.5 px-6 rounded-full bg-[#173a34] dark:bg-[#e4c887] text-white dark:text-[#102d2a] font-semibold text-xs shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer"
          >
            Complete Check-in (+20 Points)
          </button>
        </div>
      </div>
    </div>
  );
}
