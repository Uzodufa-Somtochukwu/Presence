export default function CompanionAvatarView({
  avatar = 'garden',
  customPhoto = null,
  size = 'md',
  animate = true,
  className = '',
}) {
  const sizeClasses = {
    sm: 'w-14 h-14 text-sm',
    md: 'w-36 h-36 sm:w-44 sm:h-44 text-base',
    lg: 'w-48 h-48 sm:w-56 sm:h-56 text-lg',
  }[size] || 'w-36 h-36 text-base';

  if (customPhoto) {
    return (
      <div
        className={`relative rounded-full overflow-hidden border-2 border-white/60 dark:border-white/20 shadow-lg ${sizeClasses} ${className}`}
      >
        <img src={customPhoto} alt="Companion Avatar" className="w-full h-full object-cover" />
      </div>
    );
  }

  // Pre-configured rich artistic themes
  const gradients = {
    garden: 'from-[#b7c5ac] via-[#d8c0aa] to-[#dfaaa0]',
    sunrise: 'from-[#e4b279] via-[#e8cbb1] to-[#d98d82]',
    ocean: 'from-[#8db6b0] via-[#c4d1c4] to-[#7398a2]',
  };

  const currentGradient = gradients[avatar] || gradients.garden;

  return (
    <div
      className={`relative rounded-full p-2.5 bg-gradient-to-br ${currentGradient} shadow-xl shadow-[#705142]/15 border-2 border-white/70 dark:border-white/20 flex items-center justify-center select-none overflow-hidden ${sizeClasses} ${
        animate ? 'transition-transform duration-700 hover:scale-105' : ''
      } ${className}`}
    >
      {/* Inner subtle glow ring */}
      <div className="absolute inset-1.5 rounded-full border border-white/40 dark:border-white/10 pointer-events-none" />

      {/* Soothing animated sparkles */}
      {animate && (
        <>
          <span className="absolute top-4 left-6 text-white/90 text-sm font-serif animate-pulse">
            ✧
          </span>
          <span
            className="absolute bottom-6 right-6 text-white/80 text-xs font-serif animate-pulse"
            style={{ animationDelay: '1.5s' }}
          >
            ✦
          </span>
        </>
      )}

      {/* Illustrated botanical silhouette */}
      <svg
        viewBox="0 0 120 120"
        className="w-3/4 h-3/4 text-[#263632]/80 dark:text-[#fffaf2]/90 drop-shadow-sm"
        fill="currentColor"
      >
        {/* Soft head and hair silhouette */}
        <circle cx="60" cy="48" r="22" fill="currentColor" opacity="0.88" />
        <ellipse cx="60" cy="94" rx="36" ry="24" fill="currentColor" opacity="0.8" />
        {/* Serene botanical crown/leaves */}
        <path
          d="M44 32 C38 20, 52 14, 58 24 C64 14, 78 20, 72 32 Z"
          fill="#173a34"
          className="dark:fill-[#a8b698]"
        />
        {/* Gentle leaf accent */}
        <path
          d="M60 22 C64 12, 74 16, 70 24 Z"
          fill="#e4c887"
        />
      </svg>

      {/* Floating leaf motif on the edge */}
      <div className="absolute bottom-1 right-3 w-5 h-2.5 rounded-full bg-[#173a34]/30 dark:bg-white/20 rotate-45 pointer-events-none" />
    </div>
  );
}
