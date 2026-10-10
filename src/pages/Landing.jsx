// import { Link } from 'react-router-dom';
// import BotanicalBackdrop from '../components/common/BotanicalBackdrop.jsx';

// export default function Landing() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#0e1c1a] via-[#122d29] to-[#173a34] text-[#f5eee4] flex flex-col justify-between relative overflow-hidden">
//       <BotanicalBackdrop variant="teal" />

//       {/* Top Bar with brand & sign-in shortcut */}
//       <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 p-2 flex items-center justify-center backdrop-blur-sm shadow-md">
//             <img
//               src="/assets/presence-logo-cream.png"
//               alt="Presence logo"
//               className="w-full h-full object-contain"
//             />
//           </div>
//           <span className="font-serif text-xl tracking-wider font-medium text-[#f5eee4]">
//             Presence
//           </span>
//         </div>

//         <Link
//           to="/login"
//           className="text-sm font-medium text-[#f5eee4]/80 hover:text-[#f5eee4] transition-colors py-2 px-4 rounded-full border border-white/15 hover:border-white/30 backdrop-blur-sm"
//         >
//           Sign In
//         </Link>
//       </header>

//       {/* Main Hero Card */}
//       <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
//         <div className="w-full max-w-lg mx-auto text-center space-y-8 p-8 sm:p-12 rounded-3xl bg-[#11221f]/75 border border-white/15 shadow-2xl backdrop-blur-md transition-all duration-500 animate-in fade-in zoom-in-95">
//           <div className="inline-block relative">
//             <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-white/10 border border-white/20 p-4 flex items-center justify-center shadow-inner group">
//               <img
//                 src="/assets/presence-logo-cream.png"
//                 alt="Presence"
//                 className="w-full h-full object-contain filter drop-shadow animate-breathe"
//               />
//             </div>
//             <div className="absolute -top-1 -right-1 text-[#e4c887] text-lg font-serif animate-pulse">
//               ✧
//             </div>
//           </div>

//           <div className="space-y-3">
//             <h1 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-[#f5eee4] text-balance">
//               Presence
//             </h1>
//             <p className="text-base sm:text-lg text-[#f5eee4]/80 font-light leading-relaxed max-w-md mx-auto text-balance">
//               A serene space to feel heard, supported, and understood. A gentle companion for life’s moments.
//             </p>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-3 pt-2">
//             <Link
//               to="/signup"
//               className="flex-1 py-4 px-6 rounded-full bg-[#f5eee4] text-[#0e1c1a] font-semibold text-base shadow-lg shadow-black/20 hover:bg-[#fffaf2] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-center"
//             >
//               Get started
//             </Link>
//             <Link
//               to="/login"
//               className="flex-1 py-4 px-6 rounded-full bg-white/5 hover:bg-white/10 text-[#f5eee4] border border-white/20 font-medium text-base hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-center"
//             >
//               I have an account
//             </Link>
//           </div>

//           <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-6 text-xs text-[#f5eee4]/60">
//             <span>Private & confidential</span>
//             <span aria-hidden="true">·</span>
//             <span>Zero judgment</span>
//             <span aria-hidden="true">·</span>
//             <span>Always here</span>
//           </div>
//         </div>
//       </main>

//       {/* Quiet Footer */}
//       <footer className="relative z-10 w-full text-center py-6 text-xs text-[#f5eee4]/50">
//         Presence © {new Date().getFullYear()} · A friend for life’s moments
//       </footer>
//     </div>
//   );
// }


// import { Link } from 'react-router-dom';

// export default function Landing() {
//   return (
//     <div className="relative min-h-screen w-full overflow-hidden bg-[#075d54] text-[#f8f0df]">
//       {/* =========================================================
//           BACKGROUND
//       ========================================================== */}

//       {/* Main soft green/teal background */}
//       <div className="absolute inset-0 bg-gradient-to-br from-[#07574f] via-[#087267] to-[#dfe8c9]" />

//       {/* Large translucent organic shape - top right */}
//       <div
//         className="
//           absolute
//           -top-[18%]
//           right-[-10%]
//           h-[75%]
//           w-[70%]
//           rotate-[8deg]
//           rounded-[35%]
//           bg-[#d9e3c3]/20
//           blur-[1px]
//         "
//       />

//       {/* Soft cream glow - right side */}
//       <div
//         className="
//           absolute
//           right-[-15%]
//           top-[12%]
//           h-[70%]
//           w-[48%]
//           rounded-full
//           bg-[#eef0d7]/35
//           blur-[80px]
//         "
//       />

//       {/* Bottom cream organic shape */}
//       <div
//         className="
//           absolute
//           -bottom-[35%]
//           right-[-5%]
//           h-[70%]
//           w-[75%]
//           rotate-[-15deg]
//           rounded-[50%]
//           bg-[#f0ead6]/75
//           blur-[1px]
//         "
//       />

//       {/* Bottom-left soft glow */}
//       <div
//         className="
//           absolute
//           -bottom-[15%]
//           left-[-20%]
//           h-[45%]
//           w-[55%]
//           rounded-full
//           bg-[#c9d8b7]/30
//           blur-[70px]
//         "
//       />

//       {/* =========================================================
//           DECORATIVE BOTANICAL ELEMENTS
//       ========================================================== */}

//       {/* Left blurred leaf */}
//       <div
//         className="
//           pointer-events-none
//           absolute
//           left-[-2%]
//           top-[42%]
//           h-[180px]
//           w-[75px]
//           rotate-[30deg]
//           rounded-[100%_0_100%_0]
//           bg-[#123f39]/35
//           blur-[8px]
//         "
//       />

//       {/* Second left leaf */}
//       <div
//         className="
//           pointer-events-none
//           absolute
//           left-[3%]
//           bottom-[9%]
//           h-[145px]
//           w-[58px]
//           rotate-[-25deg]
//           rounded-[100%_0_100%_0]
//           bg-[#e0e8ca]/20
//           blur-[7px]
//         "
//       />

//       {/* Right upper leaf */}
//       <div
//         className="
//           pointer-events-none
//           absolute
//           right-[-1%]
//           top-[19%]
//           h-[105px]
//           w-[48px]
//           rotate-[28deg]
//           rounded-[100%_0_100%_0]
//           bg-[#165b52]/30
//           blur-[8px]
//         "
//       />

//       {/* Right middle leaf */}
//       <div
//         className="
//           pointer-events-none
//           absolute
//           right-[7%]
//           top-[31%]
//           h-[125px]
//           w-[55px]
//           rotate-[38deg]
//           rounded-[100%_0_100%_0]
//           bg-[#165b52]/25
//           blur-[10px]
//         "
//       />

//       {/* =========================================================
//           BOTTOM ORGANIC LINE
//       ========================================================== */}

//       <svg
//         className="pointer-events-none absolute bottom-[-5px] left-0 w-[42%] opacity-40"
//         viewBox="0 0 650 300"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <path
//           d="
//             M -20 55
//             C 110 70, 180 95, 235 175
//             C 285 250, 340 290, 430 305
//           "
//           stroke="#d9d3b5"
//           strokeWidth="2"
//         />
//       </svg>

//       {/* =========================================================
//           HEADER
//       ========================================================== */}

//       <header
//         className="
//           relative
//           z-20
//           flex
//           w-full
//           items-center
//           justify-between
//           px-8
//           py-8
//           sm:px-12
//           lg:px-20
//         "
//       >
//         {/* Logo */}
//         <Link
//           to="/"
//           className="flex items-center gap-4"
//         >
//           <div className="flex h-12 w-12 items-center justify-center">
//             <img
//               src="/assets/presence-logo-cream.png"
//               alt="Presence"
//               className="h-full w-full object-contain"
//             />
//           </div>

//           <span
//             className="
//               font-sans
//               text-[30px]
//               font-light
//               tracking-[-0.02em]
//               text-[#f6efdf]
//             "
//           >
//             Presence
//           </span>
//         </Link>

//         {/* Navigation */}
//         <div className="flex items-center gap-7 sm:gap-9">
//           <Link
//             to="/login"
//             className="
//               font-sans
//               text-[17px]
//               font-light
//               text-[#f8f0df]
//               transition-opacity
//               hover:opacity-70
//             "
//           >
//             Log In
//           </Link>

//           <Link
//             to="/signup"
//             className="
//               rounded-full
//               bg-[#f5ecdc]
//               px-8
//               py-4
//               font-sans
//               text-[17px]
//               font-medium
//               text-[#124f49]
//               shadow-sm
//               transition-all
//               hover:scale-[1.02]
//               hover:bg-[#fff8eb]
//             "
//           >
//             Sign Up
//           </Link>
//         </div>
//       </header>

//       {/* =========================================================
//           HERO
//       ========================================================== */}

//       <main
//         className="
//           relative
//           z-10
//           flex
//           min-h-[calc(100vh-120px)]
//           items-center
//           justify-center
//           px-6
//           pb-16
//           pt-4
//         "
//       >
//         <section className="flex w-full max-w-4xl flex-col items-center text-center">
//           {/* Decorative Presence emblem */}
//           <div className="mb-7">
//             <img
//               src="/assets/presence-logo-cream.png"
//               alt=""
//               className="
//                 h-[145px]
//                 w-[145px]
//                 object-contain
//                 opacity-95
//                 drop-shadow-[0_5px_15px_rgba(0,0,0,0.08)]
//               "
//             />
//           </div>

//           {/* Main heading */}
//           <h1
//             className="
//               font-serif
//               text-[58px]
//               font-normal
//               leading-[1.05]
//               tracking-[-0.025em]
//               text-[#f8f0df]
//               sm:text-[72px]
//               lg:text-[82px]
//             "
//           >
//             Welcome to Presence,
//           </h1>

//           {/* Subtitle */}
//           <p
//             className="
//               mt-6
//               font-sans
//               text-[26px]
//               font-light
//               tracking-[-0.01em]
//               text-[#f8f0df]
//               sm:text-[30px]
//             "
//           >
//             a place you feel like home.
//           </p>

//           {/* CTA buttons */}
//           <div className="mt-12 flex items-center gap-5">
//             <Link
//               to="/login"
//               className="
//                 flex
//                 min-w-[225px]
//                 items-center
//                 justify-center
//                 rounded-full
//                 border
//                 border-[#f4ecda]
//                 px-9
//                 py-5
//                 font-sans
//                 text-[19px]
//                 font-medium
//                 text-[#f8f0df]
//                 transition-all
//                 duration-200
//                 hover:bg-white/10
//                 hover:scale-[1.02]
//               "
//             >
//               Log In
//             </Link>

//             <Link
//               to="/signup"
//               className="
//                 flex
//                 min-w-[225px]
//                 items-center
//                 justify-center
//                 rounded-full
//                 bg-[#f7edda]
//                 px-9
//                 py-5
//                 font-sans
//                 text-[19px]
//                 font-medium
//                 text-[#124f49]
//                 shadow-[0_8px_30px_rgba(0,0,0,0.08)]
//                 transition-all
//                 duration-200
//                 hover:scale-[1.02]
//                 hover:bg-[#fff8eb]
//               "
//             >
//               Sign Up
//             </Link>
//           </div>

//           {/* Values */}
//           <div
//             className="
//               mt-14
//               flex
//               items-center
//               gap-5
//               font-sans
//               text-[14px]
//               font-light
//               uppercase
//               tracking-[0.28em]
//               text-[#f5eee1]/90
//             "
//           >
//             <span>Listen</span>
//             <span className="text-[13px]">•</span>
//             <span>Support</span>
//             <span className="text-[13px]">•</span>
//             <span>Belong</span>
//           </div>
//         </section>
//       </main>

//       {/* =========================================================
//           BOTTOM RIGHT MESSAGE
//       ========================================================== */}

//       <div
//         className="
//           absolute
//           bottom-14
//           right-8
//           z-20
//           hidden
//           items-center
//           gap-7
//           sm:flex
//           lg:right-14
//         "
//       >
//         <span className="h-px w-12 bg-[#164f49]" />

//         <span
//           className="
//             font-sans
//             text-[15px]
//             font-light
//             text-[#164f49]
//           "
//         >
//           You’re not alone here.
//         </span>
//       </div>
//     </div>
//   );
// }


import { Link } from 'react-router-dom';

const CREAM = '#f5ead8';
const DEEP = '#0b4a40';

/* Soft, blurred leaf used in the background */
function Leaf({ className = '', style, rotate = 0, scale = 1, fill = '#6fa583', opacity = 0.5 }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 160 80"
      className={`absolute pointer-events-none ${className}`}
      style={{ ...style, transform: `rotate(${rotate}deg) scale(${scale})`, filter: 'blur(3px)', opacity }}
    >
      <path d="M0 40 C35 -5 120 -5 160 40 C120 85 35 85 0 40Z" fill={fill} />
      <path d="M8 40 H150" stroke="#ffffff" strokeOpacity=".25" strokeWidth="1.5" />
    </svg>
  );
}

/* Small "P" brand mark (header) */
function BrandMark({ className = '' }) {
  return (
    <svg viewBox="0 0 48 60" className={className} aria-hidden="true">
      <path
        d="M6 56 V22 C6 8 14 2 26 2 C38 2 46 10 46 21 C46 32 38 40 27 40 H22 V56 C22 60 20 62 14 62 C8 62 6 60 6 56Z"
        fill="#8fb79b"
        transform="translate(0 -3)"
      />
      <circle cx="26" cy="21" r="8" fill="#0b5a4e" />
    </svg>
  );
}

/* Hero emblem: serif P, flowering stem, cupped hands */
function Emblem() {
  return (
    <svg viewBox="0 0 220 300" className="w-[150px] sm:w-[190px] md:w-[210px] h-auto drop-shadow-[0_6px_14px_rgba(0,0,0,0.25)]" role="img" aria-label="Presence emblem">
      <defs>
        <linearGradient id="hand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9e7cf" />
          <stop offset="1" stopColor="#6c9d7f" />
        </linearGradient>
        <linearGradient id="leafg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a9c8a7" />
          <stop offset="1" stopColor="#5f8f72" />
        </linearGradient>
      </defs>

      {/* Serif P */}
      <text x="96" y="205" fontFamily="'Newsreader', 'Times New Roman', serif" fontSize="190" fill={CREAM} fontWeight="500">
        P
      </text>

      {/* Stem */}
      <path d="M92 215 C96 170 84 140 100 108 C108 88 104 70 112 52" fill="none" stroke="#d8e4cc" strokeWidth="2.5" strokeLinecap="round" />

      {/* Leaves */}
      <g fill="url(#leafg)" stroke="#e7efdc" strokeOpacity=".5" strokeWidth=".8">
        <path d="M0 0 C14 -20 40 -22 52 -8 C38 6 14 8 0 0Z" transform="translate(54 40) rotate(-30)" />
        <path d="M0 0 C10 -18 30 -20 40 -8 C30 4 12 6 0 0Z" transform="translate(98 95) rotate(-140)" />
        <path d="M0 0 C12 -20 34 -22 46 -8 C34 6 12 8 0 0Z" transform="translate(96 150) rotate(-160)" />
        <path d="M0 0 C12 -18 32 -20 44 -6 C32 6 12 8 0 0Z" transform="translate(100 200) rotate(-35)" />
        <path d="M0 0 C12 -18 32 -20 44 -6 C32 6 12 8 0 0Z" transform="translate(110 118) rotate(-60)" />
      </g>

      {/* Flowers */}
      {[
        [138, 36],
        [58, 118],
      ].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx} ${cy})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="0" cy="-9" rx="6.5" ry="9" fill="#f6ecd9" stroke="#d9c9a8" strokeWidth=".6" transform={`rotate(${a})`} />
          ))}
          <circle r="5" fill="#d8b98b" />
        </g>
      ))}
      <g transform="translate(60 128)">
        <circle r="0" />
      </g>

      {/* Hands */}
      <path d="M12 236 C10 262 40 282 108 296 C84 270 72 252 76 232 C60 250 40 258 22 250 C28 244 34 238 40 230 C28 234 20 236 12 236Z" fill="url(#hand)" />
      <path d="M208 236 C210 262 180 282 112 296 C136 270 148 252 144 232 C160 250 180 258 198 250 C192 244 186 238 180 230 C192 234 200 236 208 236Z" fill="url(#hand)" />
    </svg>
  );
}

export default function Landing() {
  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex flex-col"
      style={{
        fontFamily: "'Figtree', system-ui, sans-serif",
        color: CREAM,
        background:
          'radial-gradient(ellipse 55% 60% at 18% 22%, #05524a 0%, rgba(5,82,74,0) 70%),' +
          'radial-gradient(ellipse 45% 55% at 62% 52%, #3f9a80 0%, rgba(63,154,128,0) 70%),' +
          'linear-gradient(135deg, #064b43 0%, #1f7761 38%, #8fbb9d 68%, #eadfc8 100%)',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600&family=Newsreader:opsz,wght@6..72,400;6..72,500&display=swap');
        @keyframes presence-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        .presence-rise { animation: presence-rise .9s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .presence-rise { animation: none; } }
      `}</style>

      {/* Background waves */}
      <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1536 1024" preserveAspectRatio="none">
        {/* Light wave sweeping in from top-right */}
        <path d="M880 0 C1000 140 1120 260 1300 310 C1400 338 1480 420 1536 470 V0Z" fill="#cfe0c4" fillOpacity=".38" />
        <path d="M1536 470 C1400 400 1300 330 1180 250 C1060 170 960 60 900 0 H1536Z" fill="#d9e6c3" fillOpacity=".35" />
        {/* Cream wave rising from bottom-right */}
        <path d="M560 1024 C760 1010 960 860 1180 720 C1320 640 1440 640 1536 660 V1024Z" fill="#efe5d0" fillOpacity=".55" />
        <path d="M0 1024 C300 1010 700 1000 1000 860 C1200 770 1400 740 1536 760 V1024Z" fill="#f2e8d3" fillOpacity=".5" />
        {/* Thin gold line, bottom-left */}
        <path d="M0 640 C150 640 260 690 300 790 C340 890 440 990 600 1000" fill="none" stroke="#d9c58f" strokeOpacity=".7" strokeWidth="1.6" />
      </svg>

      {/* Blurred leaves */}
      <Leaf className="left-[-40px] top-[48%] w-[300px]" rotate={-30} fill="#4f8a6d" opacity={0.35} />
      <Leaf className="left-[40px] top-[62%] w-[260px]" rotate={-12} fill="#5a9576" opacity={0.4} />
      <Leaf className="left-[-30px] top-[80%] w-[280px]" rotate={-48} fill="#71a384" opacity={0.45} />
      <Leaf className="left-[8%] top-[88%] w-[220px]" rotate={-70} fill="#79a98a" opacity={0.4} />
      <Leaf className="right-[-60px] top-[18%] w-[280px]" rotate={22} fill="#4f9a82" opacity={0.45} />
      <Leaf className="right-[-70px] top-[32%] w-[300px]" rotate={-18} fill="#6aa68b" opacity={0.4} />
      <Leaf className="right-[-30px] top-[40%] w-[220px]" rotate={40} fill="#7fb095" opacity={0.35} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 sm:px-12 lg:px-20 pt-8 sm:pt-12">
        <Link to="/" className="flex items-center gap-3">
          <BrandMark className="w-9 h-11" />
          <span className="text-[26px] font-normal tracking-wide" style={{ color: CREAM }}>
            Presence
          </span>
        </Link>

        <nav className="flex items-center gap-6 sm:gap-10">
          <Link to="/login" className="text-[19px] font-light text-[#f5ead8]/90 hover:text-white transition-colors">
            Log In
          </Link>
          <Link
            to="/signup"
            className="rounded-full px-8 sm:px-10 py-3.5 text-[19px] font-medium shadow-lg shadow-black/10 hover:brightness-105 transition"
            style={{ background: '#f6ecda', color: DEEP }}
          >
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pb-24 -mt-4">
        <div className="presence-rise flex flex-col items-center">
          <Emblem />

          <h1
            className="mt-2 text-[44px] sm:text-[64px] md:text-[80px] leading-[1.05] font-medium tracking-[-0.01em]"
            style={{ fontFamily: "'Newsreader', Georgia, serif", color: CREAM, textShadow: '0 3px 18px rgba(0,40,30,.35)' }}
          >
            Welcome to Presence,
          </h1>

          <p className="mt-5 text-[22px] sm:text-[30px] font-light" style={{ color: 'rgba(245,234,216,.95)' }}>
            a place you feel like home.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            <Link
              to="/login"
              className="w-[224px] h-[70px] flex items-center justify-center rounded-full text-[21px] font-medium border transition hover:bg-white/10"
              style={{ color: CREAM, borderColor: 'rgba(245,234,216,.45)', background: 'rgba(5,70,62,.55)' }}
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="w-[226px] h-[70px] flex items-center justify-center rounded-full text-[21px] font-medium shadow-xl shadow-black/15 transition hover:brightness-105"
              style={{ background: '#f6ecda', color: DEEP }}
            >
              Sign Up
            </Link>
          </div>

          <p className="mt-12 flex items-center text-shadow-[grey]  text-shadow-2xs gap-6 sm:gap-8 text-[14px] sm:text-[16px] font-bold tracking-[0.28em] text-white/70"
          
          >
            <span>LISTEN</span>
            <span aria-hidden="true" className="text-[10px]">•</span>
            <span>SUPPORT</span>
            <span aria-hidden="true" className="text-[10px]">•</span>
            <span>BELONG</span>
          </p>
        </div>
      </main>

      {/* Bottom-right tagline */}
      <div className="absolute z-10 bottom-8 right-6 sm:right-12 lg:right-[58px] flex items-center gap-4 text-[17px]" style={{ color: DEEP }}>
        <span className="block w-11 h-px" style={{ background: DEEP }} />
        <span>You’re not alone here.</span>
      </div>
    </div>
  );
}