import { Link } from 'react-router-dom';

export default function BrandHeader({ theme = 'light', showLink = true }) {
  const content = (
    <div className="flex items-center justify-center gap-2.5 group">
      <div className="w-9 h-9 rounded-full bg-[#173a34] dark:bg-[#e4c887] p-1.5 flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-105">
        <img
          src="/assets/presence-logo-cream.png"
          alt="Presence"
          className="w-full h-full object-contain filter dark:invert"
        />
      </div>
      <span
        className={`font-serif tracking-wider font-semibold text-lg transition-colors ${
          theme === 'dark'
            ? 'text-[#f5eee4]'
            : 'text-[#173a34] dark:text-[#f4eee5]'
        }`}
      >
        Presence
      </span>
    </div>
  );

  if (showLink) {
    return (
      <Link to="/" className="inline-block outline-none focus-visible:ring-2 focus-visible:ring-[#173a34] rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
