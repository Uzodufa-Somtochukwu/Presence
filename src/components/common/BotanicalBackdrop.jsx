export default function BotanicalBackdrop({ variant = 'default' }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Gentle floating ambient blur orbs */}
      <div
        className={`absolute rounded-full filter blur-3xl transition-opacity duration-1000 ${
          variant === 'teal'
            ? 'w-[520px] h-[520px] -left-28 -bottom-28 bg-[#a8b698]/15 dark:bg-[#a8b698]/5'
            : 'w-[560px] h-[560px] -left-20 -bottom-20 bg-[#a8b698]/20 dark:bg-[#a8b698]/10'
        } animate-pulse-subtle`}
      />
      <div
        className={`absolute rounded-full filter blur-3xl transition-opacity duration-1000 ${
          variant === 'earth'
            ? 'w-[600px] h-[600px] -right-24 -top-24 bg-[#d8b784]/20 dark:bg-[#d8b784]/10'
            : 'w-[580px] h-[580px] -right-24 -top-24 bg-[#d9b5b1]/15 dark:bg-[#d9b5b1]/10'
        } animate-pulse-subtle`}
        style={{ animationDelay: '3s' }}
      />

      {/* Decorative botanical leaf motifs */}
      <svg
        className="absolute bottom-6 left-4 w-32 h-44 text-[#a8b698]/25 dark:text-[#a8b698]/10 animate-gentle-drift"
        viewBox="0 0 100 140"
        fill="currentColor"
      >
        <path d="M50 140 Q 48 80, 20 50 Q 50 40, 50 0 Q 50 40, 80 50 Q 52 80, 50 140 Z" />
      </svg>

      <svg
        className="absolute top-12 right-6 w-28 h-36 text-[#d8b784]/20 dark:text-[#d8b784]/10 animate-gentle-drift"
        viewBox="0 0 100 140"
        fill="currentColor"
        style={{ animationDelay: '5s' }}
      >
        <path d="M50 140 Q 48 80, 25 55 Q 50 45, 50 0 Q 50 45, 75 55 Q 52 80, 50 140 Z" />
      </svg>
    </div>
  );
}
