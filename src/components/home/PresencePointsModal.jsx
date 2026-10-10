import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Gift, Globe2, Heart, Lock, Palette, X } from 'lucide-react';
import { usePresence } from '../../context/PresenceContext.jsx';
import { presenceUnlocks } from '../../data/presenceUnlocks.js';
import { giftPacks } from '../../data/giftPacks.js';
import { getLocalDateKey, getPresencePoints } from '../../utils/points.js';
import { readAppSettings } from '../../utils/storage.js';
import {
  canAffordUnlock,
  isPresenceItemUnlocked,
  unlockPresenceItem,
} from '../../utils/unlocks.js';

const COMPANION_VOICE_ID = 'new-companion-voice';

export default function PresencePointsModal({ isOpen, onClose, onTryIt }) {
  const { settings, updateSettings } = usePresence();
  const closeButtonRef = useRef(null);
  const purchaseInProgressRef = useRef(false);
  const [confirmationUnlockId, setConfirmationUnlockId] = useState(null);
  const [successUnlockId, setSuccessUnlockId] = useState(null);
  const [purchaseError, setPurchaseError] = useState('');
  const [recipient, setRecipient] = useState('');
  const [selectedGiftId, setSelectedGiftId] = useState(giftPacks[1].id);
  const [giftPreview, setGiftPreview] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    closeButtonRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) return;
    setConfirmationUnlockId(null);
    setSuccessUnlockId(null);
    setPurchaseError('');
    setRecipient('');
    setGiftPreview(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const points = getPresencePoints(settings);
  const companionVoiceOwned = isPresenceItemUnlocked(settings, COMPANION_VOICE_ID);
  const history = Array.isArray(settings.pointsHistory)
    ? settings.pointsHistory.slice(0, 10)
    : [];
  const selectedGift = giftPacks.find((pack) => pack.id === selectedGiftId) || giftPacks[0];

  const handleUnlockRequest = (itemId) => {
    const latestSettings = readAppSettings();
    if (isPresenceItemUnlocked(latestSettings, itemId)) {
      setSuccessUnlockId(itemId);
      return;
    }
    if (!canAffordUnlock(latestSettings, itemId)) return;

    setPurchaseError('');
    setConfirmationUnlockId(itemId);
  };

  const handleUnlockConfirm = () => {
    if (purchaseInProgressRef.current || !confirmationUnlockId) return;
    purchaseInProgressRef.current = true;

    try {
      const latestSettings = readAppSettings();
      const result = unlockPresenceItem(latestSettings, confirmationUnlockId);

      if (!result.success) {
        if (result.reason === 'already-unlocked') {
          setSuccessUnlockId(confirmationUnlockId);
          setConfirmationUnlockId(null);
        } else if (result.reason === 'insufficient-points') {
          setPurchaseError('Your Presence Points have changed. Please review your balance and try again.');
        }
        return;
      }

      updateSettings(result.updates);
      setSuccessUnlockId(confirmationUnlockId);
      setConfirmationUnlockId(null);
      setPurchaseError('');
    } finally {
      purchaseInProgressRef.current = false;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close Unlocks"
        className="fixed inset-0 bg-[#0e1c1a]/65 backdrop-blur-sm"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="presence-unlocks-title"
        aria-describedby="presence-unlocks-description"
        className="relative z-10 max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-[#705142]/15 bg-[#fffaf3] p-5 text-[#263632] shadow-2xl dark:border-white/10 dark:bg-[#1c2e2a] dark:text-[#f4eee5] sm:p-8"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close Unlocks"
          className="absolute right-4 top-4 rounded-full p-2 text-[#5d6761] transition-colors hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b96851] dark:text-[#a3b2ab] dark:hover:bg-white/10 sm:right-6 sm:top-6"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <header className="max-w-3xl pr-9">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#705142] dark:text-[#d8b784]">
            Presence Points · Earned through showing up
          </p>
          <h2 id="presence-unlocks-title" className="mt-2 font-serif text-3xl text-[#173a34] dark:text-white sm:text-4xl">
            Make Presence yours.
          </h2>
          <p id="presence-unlocks-description" className="mt-2 text-sm leading-relaxed text-[#5d6761] dark:text-[#a3b2ab] sm:text-base">
            Use the Presence Points you earn to unlock new ways to experience your companion.
          </p>
          <p className="mt-2 font-serif text-sm text-[#705142] dark:text-[#d8b784]">
            You don’t have to pay to go deeper into Presence. You can earn your way there.
          </p>
        </header>

        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#705142]/10 bg-gradient-to-r from-[#f3e8d8] to-[#e6eee4] p-4 dark:border-white/10 dark:from-[#263a32] dark:to-[#24352f] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-xs font-medium text-[#5d6761] dark:text-[#a3b2ab]">Your Presence Points</p>
            <p className="mt-0.5 text-3xl font-semibold tabular-nums text-[#173a34] dark:text-white">
              {points.toLocaleString()}
            </p>
          </div>
          <p className="text-sm font-medium text-[#38594d] dark:text-[#d5dfcf]">
            Keep showing up. Keep unlocking.
          </p>
        </div>

        <div className="mt-7 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 className="font-serif text-2xl text-[#173a34] dark:text-white">Unlocks</h3>
            <p className="mt-1 text-xs text-[#5d6761] dark:text-[#a3b2ab]">
              {companionVoiceOwned
                ? 'New Companion Voice is yours. Other experiences are still planned.'
                : 'Earn points through check-ins and activities. The voice is ready to unlock; other items are coming soon.'}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {presenceUnlocks.map((unlock) => {
            const Icon = unlock.icon;
            const owned = isPresenceItemUnlocked(settings, unlock.id);
            const canAfford = canAffordUnlock(settings, unlock.id);
            const canPurchaseVoice = unlock.available && canAfford && !owned;
            const isConfirming = confirmationUnlockId === unlock.id;
            const purchaseSucceeded = successUnlockId === unlock.id && owned;

            return (
              <article
                key={unlock.id}
                className="flex min-h-64 flex-col rounded-2xl border border-[#705142]/12 bg-white/75 p-4 shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-white/5 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8eee3] text-[#315b4d] dark:bg-white/10 dark:text-[#d8b784]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#173a34]/5 px-2.5 py-1 text-[10px] font-semibold text-[#5d6761] dark:bg-white/10 dark:text-[#c5d0c8]">
                    {!owned && unlock.available && <Lock className="h-3 w-3" aria-hidden="true" />}
                    {owned ? 'Unlocked' : unlock.available ? 'Permanent' : 'Coming soon'}
                  </span>
                </div>

                <h4 className="mt-4 font-serif text-lg font-semibold text-[#173a34] dark:text-white">
                  {unlock.name}
                </h4>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-[#5d6761] dark:text-[#a3b2ab]">
                  {unlock.description}
                </p>

                <div className="mt-4 flex items-end justify-between gap-3 border-t border-[#705142]/10 pt-3 dark:border-white/10">
                  <div>
                    <p className="text-sm font-semibold text-[#315b4d] dark:text-[#d5dfcf]">
                      {unlock.cost} Presence Points
                    </p>
                    <p className="mt-0.5 text-xs text-[#5d6761] dark:text-[#a3b2ab]">
                      {unlock.duration}
                    </p>
                  </div>
                  <p className="text-right text-[11px] font-semibold leading-snug text-[#5d6761] dark:text-[#c5d0c8]" aria-live="polite">
                    {owned
                      ? 'Permanently yours'
                      : unlock.available
                        ? canAfford
                          ? 'Available to unlock'
                          : `${unlock.cost} Presence Points needed · You have ${points} (${unlock.cost - points} more needed)`
                        : 'Planned'}
                  </p>
                </div>

                {canPurchaseVoice ? (
                  <button
                    type="button"
                    onClick={() => handleUnlockRequest(unlock.id)}
                    className="mt-3 w-full rounded-full bg-[#173a34] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#245248] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b96851]"
                  >
                    Unlock for {unlock.cost} Points
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    aria-label={`${unlock.name}: ${owned ? 'unlocked' : 'coming soon'}`}
                    className="mt-3 w-full cursor-not-allowed rounded-full border border-[#705142]/15 bg-[#f4eee5] px-4 py-2.5 text-xs font-semibold text-[#705142] opacity-80 dark:border-white/10 dark:bg-white/10 dark:text-[#d8b784]"
                  >
                    {owned
                      ? 'Unlocked'
                      : unlock.available && !canAfford
                        ? 'Locked'
                        : 'Coming soon'}
                  </button>
                )}

                {isConfirming && (
                  <div className="mt-3 rounded-xl border border-[#d8b784]/50 bg-[#f8f0e2] p-3 dark:border-[#d8b784]/20 dark:bg-[#d8b784]/10" role="group" aria-labelledby="unlock-confirm-title">
                    <h5 id="unlock-confirm-title" className="text-sm font-semibold text-[#173a34] dark:text-white">
                      Unlock {unlock.name}?
                    </h5>
                    <p className="mt-1 text-xs leading-relaxed text-[#5d6761] dark:text-[#c5d0c8]">
                      Use {unlock.cost} Presence Points to permanently unlock this companion voice.
                    </p>
                    {purchaseError && <p role="alert" className="mt-2 text-xs text-[#a75f4c]">{purchaseError}</p>}
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={handleUnlockConfirm}
                        className="flex-1 rounded-full bg-[#173a34] px-3 py-2 text-xs font-semibold text-white hover:bg-[#245248] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b96851]"
                      >
                        Unlock for {unlock.cost}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmationUnlockId(null);
                          setPurchaseError('');
                        }}
                        className="rounded-full border border-[#705142]/20 px-3 py-2 text-xs font-semibold text-[#705142] hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b96851] dark:border-white/15 dark:text-[#d8b784] dark:hover:bg-white/10"
                      >
                        Not now
                      </button>
                    </div>
                  </div>
                )}

                {purchaseSucceeded && (
                  <div className="mt-3 rounded-xl bg-emerald-900/5 p-3 dark:bg-emerald-200/10" role="status" aria-live="polite">
                    <p className="text-sm font-semibold text-[#173a34] dark:text-white">Unlocked ✨</p>
                    <p className="mt-1 text-xs text-[#5d6761] dark:text-[#c5d0c8]">Your new voice is ready.</p>
                    <button
                      type="button"
                      onClick={onTryIt || onClose}
                      className="mt-2 rounded-full px-3 py-1.5 text-xs font-semibold text-[#315b4d] underline decoration-[#a8b698] underline-offset-2 hover:text-[#173a34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b96851] dark:text-[#d5dfcf]"
                    >
                      Try it
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <section className="mt-8 rounded-3xl border border-[#a8b698]/35 bg-gradient-to-br from-[#f4f1e6] via-[#fffaf3] to-[#e8eee3] p-5 dark:border-white/10 dark:from-[#24372f] dark:via-[#1c2e2a] dark:to-[#24352f] sm:p-7" aria-labelledby="give-presence-title">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-[#315b4d] dark:bg-white/10 dark:text-[#d8b784]"><Gift className="h-5 w-5" aria-hidden="true" /></span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#705142] dark:text-[#d8b784]">For someone you love</p>
              <h3 id="give-presence-title" className="mt-1 font-serif text-2xl text-[#173a34] dark:text-white">Give Presence</h3>
              <p className="mt-1 text-sm text-[#5d6761] dark:text-[#a3b2ab]">Gift someone a little more Presence.</p>
              <p className="mt-1 text-xs text-[#7b7469] dark:text-[#c5d0c8]">Prototype pack prices · payments coming soon</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1.35fr]">
            <label className="text-sm font-medium text-[#315b4d] dark:text-[#d5dfcf]">Who are you sending Presence to?
              <input value={recipient} onChange={(event) => { setRecipient(event.target.value); setGiftPreview(false); }} placeholder="@username or email · e.g. @mum" className="mt-2 w-full rounded-xl border border-[#705142]/20 bg-white/80 px-4 py-3 text-sm text-[#263632] outline-none placeholder:text-[#8a918b] focus:border-[#315b4d] focus:ring-2 focus:ring-[#315b4d]/20 dark:border-white/15 dark:bg-black/10 dark:text-white" />
            </label>
            <div>
              <p className="text-sm font-medium text-[#315b4d] dark:text-[#d5dfcf]">Choose a Presence Pack</p>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {giftPacks.map((pack) => <button key={pack.id} type="button" aria-pressed={selectedGiftId === pack.id} onClick={() => { setSelectedGiftId(pack.id); setGiftPreview(false); }} className={`rounded-xl border p-3 text-left transition ${selectedGiftId === pack.id ? 'border-[#315b4d] ring-2 ring-[#315b4d]/20 dark:border-[#d8b784]' : 'border-[#705142]/15 dark:border-white/10'} ${pack.tone} dark:bg-white/5`}>
                  <span className="block text-lg font-semibold text-[#173a34] dark:text-white">${pack.price}</span><span className="mt-0.5 block text-xs font-semibold text-[#315b4d] dark:text-[#d5dfcf]">{pack.points.toLocaleString()} Points</span><span className="mt-1 block text-xs text-[#5d6761] dark:text-[#a3b2ab]">{pack.name}</span>
                </button>)}
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-white/65 p-4 dark:bg-black/10 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#315b4d] dark:text-[#d5dfcf]">{recipient.trim() ? `You're sending ${selectedGift.points.toLocaleString()} Presence Points to ${recipient.trim().startsWith('@') ? recipient.trim() : recipient.trim()}.` : 'Choose a recipient and pack to preview your gift.'}</p>
            <button type="button" disabled={!recipient.trim()} onClick={() => setGiftPreview(true)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#173a34] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45 dark:bg-[#d8b784] dark:text-[#173a34]">Continue <ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
          </div>
          {giftPreview && <div role="status" className="mt-3 rounded-2xl border border-[#d8b784]/50 bg-[#f8f0e2] p-4 text-sm text-[#5d5145] dark:border-[#d8b784]/20 dark:bg-[#d8b784]/10 dark:text-[#eee0c8]"><p className="font-semibold text-[#173a34] dark:text-white">Payments coming soon</p><p className="mt-1">Family gifting is designed so the person receiving Presence never has to pay. This preview does not charge anyone or create a gift.</p></div>}
        </section>

        <section className="mt-8" aria-labelledby="how-presence-works-title">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#705142] dark:text-[#d8b784]">Built for companionship</p>
          <h3 id="how-presence-works-title" className="mt-1 font-serif text-2xl text-[#173a34] dark:text-white">How Presence Works</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {['Presence is free to use.', 'Show up, talk, check in, and engage to earn Presence Points.', 'Use your points to personalize your companion.', 'People who care about you can send Presence Packs in the future.', 'Creators will eventually be able to build Presence experiences.', 'Brands and organizations can help sponsor experiences.'].map((copy, index) => <p key={copy} className="rounded-2xl border border-[#705142]/10 bg-white/65 p-4 text-sm leading-relaxed text-[#40554d] dark:border-white/10 dark:bg-white/5 dark:text-[#d5dfcf]"><span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#8a755e] dark:text-[#d8b784]">0{index + 1}</span>{copy}</p>)}
          </div>
          <details className="mt-4 rounded-2xl border border-[#705142]/10 bg-white/50 p-4 dark:border-white/10 dark:bg-white/5">
            <summary className="cursor-pointer text-sm font-semibold text-[#173a34] dark:text-white">How Presence sustains itself</summary>
            <p className="mt-3 text-sm leading-relaxed text-[#5d6761] dark:text-[#a3b2ab]">Presence keeps companionship free for the person who needs it. Our long-term model is built around the ecosystem around that person: family gifting, optional supporter subscriptions, creator experiences, sponsored experiences, and institutional partnerships. The person receiving companionship does not have to pay for the core experience.</p>
          </details>
          <div className="mt-4 rounded-2xl border border-[#315b4d]/15 bg-[#e8eee3]/70 p-4 dark:border-white/10 dark:bg-white/5">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#173a34] dark:text-white"><Globe2 className="h-4 w-4" aria-hidden="true" /> Built on Base, where it helps</p>
            <p className="mt-1 text-sm leading-relaxed text-[#5d6761] dark:text-[#a3b2ab]">Base helps Presence make gifting, ownership, and future creator rewards transparent and portable. Points and everyday conversations do not all happen on-chain.</p>
          </div>
        </section>

        <section className="mt-8" aria-labelledby="presence-roadmap-title">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#705142] dark:text-[#d8b784]">A future built around care</p>
          <h3 id="presence-roadmap-title" className="mt-1 font-serif text-2xl text-[#173a34] dark:text-white">What’s Coming</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Family Presence', text: 'Send Presence Packs to someone you love.', icon: Heart },
              { title: 'Presence+', text: 'Support someone’s Presence with recurring gifts and family features.', icon: Gift },
              { title: 'Creator Studio', text: 'Create personalities, voices, environments, and experiences to discover.', icon: Palette },
              { title: 'Sponsored Experiences', text: 'Brands and organizations can help fund meaningful experiences.', icon: Globe2 },
            ].map(({ title, text, icon: Icon }) => <article key={title} className="rounded-2xl border border-[#705142]/10 bg-white/65 p-4 dark:border-white/10 dark:bg-white/5">
              <Icon className="h-5 w-5 text-[#52745d] dark:text-[#d8b784]" aria-hidden="true" /><h4 className="mt-3 font-serif text-lg font-semibold text-[#173a34] dark:text-white">{title}</h4><p className="mt-1 min-h-12 text-sm leading-relaxed text-[#5d6761] dark:text-[#a3b2ab]">{text}</p><span className="mt-3 inline-flex rounded-full bg-[#e8eee3] px-3 py-1 text-xs font-semibold text-[#315b4d] dark:bg-white/10 dark:text-[#d5dfcf]">Coming soon</span>
            </article>)}
          </div>
        </section>

        <p className="mt-5 text-xs leading-relaxed text-[#5d6761] dark:text-[#a3b2ab]">
          App Presence Points are separate from your on-chain Presence Points. No purchase or blockchain action happens here.
        </p>

        {history.length > 0 && (
          <details className="mt-5 rounded-2xl border border-[#705142]/10 bg-white/50 p-4 dark:border-white/10 dark:bg-white/5">
            <summary className="cursor-pointer text-sm font-semibold text-[#173a34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b96851] dark:text-white">
              Points history
            </summary>
            <ul className="mt-2 divide-y divide-[#705142]/10 dark:divide-white/10">
              {history.map((entry) => (
                <li key={entry.id} className="flex items-center justify-between gap-4 py-2 text-sm">
                  <span>{entry.item || entry.label}</span>
                  <span className="shrink-0 text-right text-xs text-[#5d6761] dark:text-[#a3b2ab]">
                    <span className={`font-semibold ${entry.amount < 0 ? 'text-[#a75f4c] dark:text-[#f4c8b0]' : 'text-emerald-700 dark:text-emerald-300'}`}>
                      {entry.amount < 0 ? '−' : '+'}{Math.abs(entry.amount)} Presence Points
                    </span>
                    <span className="ml-2">
                      {getLocalDateKey(entry.timestamp) === getLocalDateKey()
                        ? 'Today'
                        : new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </section>
    </div>
  );
}
