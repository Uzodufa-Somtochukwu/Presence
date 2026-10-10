import { useEffect, useRef, useState } from 'react';
import { readMoodEntries, writeMoodEntries } from '../../utils/storage.js';
import { usePresence } from '../../context/PresenceContext.jsx';
import { useConnection } from 'wagmi';
import { addPointsHistory, getPresencePoints } from '../../utils/points.js';
import { BASE_URL } from '../../config/index.jsx';

const CHECK_IN_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours
const LAST_CHECK_IN_KEY = 'presenceLastCheckIn';
const POINTS_AWARD_URL = `${BASE_URL}/api/points/award`;
const CHECK_IN_REWARD = 5;

export default function CheckInModal({ isOpen, onClose }) {
  const { settings, updateSettings, showToast } = usePresence();
  const { address } = useConnection();
  const checkInInProgress = useRef(false);

  const [selectedMood, setSelectedMood] = useState('Peaceful');
  const [reflection, setReflection] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);

  const isOnCooldown = timeRemaining > 0;

  useEffect(() => {
    const updateCooldown = () => {
      const lastCheckIn = Number(
        localStorage.getItem(LAST_CHECK_IN_KEY) || 0
      );

      if (!lastCheckIn) {
        setTimeRemaining(0);
        return;
      }

      const remaining = Math.max(
        0,
        CHECK_IN_COOLDOWN - (Date.now() - lastCheckIn)
      );

      setTimeRemaining(remaining);

      if (remaining === 0) {
        localStorage.removeItem(LAST_CHECK_IN_KEY);
      }
    };

    updateCooldown();

    const interval = setInterval(updateCooldown, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  const moods = [
    {
      label: 'Peaceful',
      icon: '🌿',
      color:
        'border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200',
    },
    {
      label: 'Grateful',
      icon: '🌸',
      color:
        'border-rose-300 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200',
    },
    {
      label: 'Tired',
      icon: '☁️',
      color:
        'border-slate-300 bg-slate-50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200',
    },
    {
      label: 'Anxious',
      icon: '⚡',
      color:
        'border-amber-300 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200',
    },
    {
      label: 'Hopeful',
      icon: '☀️',
      color:
        'border-yellow-300 bg-yellow-50 dark:bg-yellow-950/40 text-yellow-800 dark:text-yellow-200',
    },
  ];

  const formatTimeRemaining = (milliseconds) => {
    const totalSeconds = Math.ceil(milliseconds / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
      String(hours).padStart(2, '0'),
      String(minutes).padStart(2, '0'),
      String(seconds).padStart(2, '0'),
    ].join(':');
  };

  const handleSave = async () => {
    if (checkInInProgress.current) return;

    const lastCheckIn = Number(localStorage.getItem(LAST_CHECK_IN_KEY) || 0);
    const persistedCooldown = lastCheckIn
      ? Math.max(0, CHECK_IN_COOLDOWN - (Date.now() - lastCheckIn))
      : 0;

    if (isOnCooldown || persistedCooldown > 0) {
      const remaining = persistedCooldown || timeRemaining;
      setTimeRemaining(remaining);
      showToast(
        `Your next check-in is available in ${formatTimeRemaining(remaining)}.`
      );
      return;
    }

    checkInInProgress.current = true;

    const entries = readMoodEntries();

    const newEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      note: reflection.trim() || 'Daily check-in completed.',
      date: new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
    };

    writeMoodEntries([newEntry, ...entries]);

    updateSettings({
      points: getPresencePoints(settings) + CHECK_IN_REWARD,
      pointsHistory: addPointsHistory(
        settings,
        'Daily check-in',
        CHECK_IN_REWARD
      ),
      streak: (settings.streak || 7) + 1,
    });

    // Start the 24-hour cooldown
    localStorage.setItem(LAST_CHECK_IN_KEY, Date.now().toString());

    setTimeRemaining(CHECK_IN_COOLDOWN);

    onClose();

    if (!address) {
      showToast(`Check-in logged! +${CHECK_IN_REWARD} Presence Points earned.`);
      checkInInProgress.current = false;
      return;
    }

    showToast('Check-in saved. Recording your Base reward…');

    try {
      const response = await fetch(POINTS_AWARD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress: address, amount: CHECK_IN_REWARD }),
      });
      const result = await response.json();

      if (!response.ok || result?.success !== true) {
        throw new Error('On-chain reward was not confirmed.');
      }

      showToast(`Check-in logged! +${CHECK_IN_REWARD} Presence Points earned on Base.`);
    } catch {
      showToast('Check-in saved, but the on-chain reward could not be completed.');
    } finally {
      checkInInProgress.current = false;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs"
      />

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

          {isOnCooldown && (
            <div className="rounded-2xl border border-[#173a34]/10 dark:border-white/10 bg-[#173a34]/5 dark:bg-white/5 p-4 text-center">
              <p className="text-sm font-semibold text-[#173a34] dark:text-white">
                🌿 You’ve already checked in today
              </p>

              <p className="text-xs text-[#5d6761] dark:text-[#a3b2ab] mt-1">
                Your next check-in will be available in
              </p>

              <p className="text-xl font-semibold tracking-wider text-[#173a34] dark:text-[#e4c887] mt-2">
                {formatTimeRemaining(timeRemaining)}
              </p>
            </div>
          )}

          <div className="grid grid-cols-5 gap-2">
            {moods.map((m) => {
              const isSelected = selectedMood === m.label;

              return (
                <button
                  key={m.label}
                  type="button"
                  disabled={isOnCooldown}
                  onClick={() => setSelectedMood(m.label)}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                    isOnCooldown
                      ? 'cursor-not-allowed opacity-50'
                      : 'cursor-pointer'
                  } ${
                    isSelected
                      ? `${m.color} ring-2 ring-[#173a34] dark:ring-white scale-105 shadow-sm font-bold`
                      : 'border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 opacity-70 hover:opacity-100'
                  }`}
                >
                  <span className="text-2xl">{m.icon}</span>

                  <span className="text-xs truncate w-full text-center">
                    {m.label}
                  </span>
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
              disabled={isOnCooldown}
              placeholder="What made you pause or smile today?"
              className="w-full p-3.5 rounded-xl bg-white dark:bg-[#152320] border border-[#705142]/20 dark:border-white/15 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#173a34]/30 disabled:opacity-50 disabled:cursor-not-allowed"
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
            disabled={isOnCooldown}
            className={`py-2.5 px-6 rounded-full font-semibold text-xs shadow-md transition-all ${
              isOnCooldown
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-[#173a34] dark:bg-[#e4c887] text-white dark:text-[#102d2a] hover:scale-102 active:scale-98 cursor-pointer'
            }`}
          >
            {isOnCooldown
              ? `Available in ${formatTimeRemaining(timeRemaining)}`
              : `Complete Check-in (+${CHECK_IN_REWARD} Points)`}
          </button>
        </div>
      </div>
    </div>
  );
}
