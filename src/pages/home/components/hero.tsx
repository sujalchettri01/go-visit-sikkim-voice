import { Bike, Footprints } from "lucide-react";

const STATS = [
  { value: "50+", label: "Destinations" },
  { value: "100+", label: "Hotels" },
  { value: "10+", label: "Trek Routes" },
  { value: "10K+", label: "Happy Travelers" },
];

const PILLS = [
  {
    label: "Destinations",
    href: "#destinations",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5"/>
      </svg>
    ),
  },
  {
    label: "Hotels",
    href: "/accommodations",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    label: "Cabs",
    href: "/cabs",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
      </svg>
    ),
  },
  {
    label: "Bikes",
    href: "/bikes",
    icon: <Bike size={20} strokeWidth={2} />,
  },
  {
    label: "Trekking",
    href: "/activities",
    icon: <Footprints size={20} strokeWidth={2} />,
  },
];

const GRADIENT = 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)';

const HomeHero = () => {
  return (
    <section className="relative min-h-[calc(100vh-80px)] w-full flex items-center justify-center overflow-hidden py-6">

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/djsguxriw/image/upload/v1773216663/rajat-sarki-983mvuvw8wE-unsplash_drjm42.jpg')`,
        }}
      />
      <div className="absolute inset-0 bg-[#f7f5f0]/40" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, transparent 20%, rgba(0,0,0,0.8) 100%)' }} />

      {/* Decorative rings — hidden on mobile to prevent overflow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden hidden sm:block">
        <div className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full border border-indigo-200/50" />
        <div className="absolute -top-10 -right-10 w-[340px] h-[340px] rounded-full border border-indigo-100/40" />
        <div className="absolute bottom-0 -left-20 w-[320px] h-[320px] rounded-full border border-amber-200/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center w-full max-w-[1200px] px-4 sm:px-8 animate-[fadeInUp_1s_ease-out]">

        {/* Kicker badge */}
        <div className="inline-flex items-center gap-2 bg-white/80 border border-indigo-200 text-indigo-600 text-[11px] font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-7 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          AI-Powered Tourism Ecosystem
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-3 leading-[1.1] tracking-tight" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.7), 0 1px 4px rgba(0,0,0,0.9)' }}>
          Your AI-based Sikkim's Tourism
          <br />Ecosystem
        </h1>

        {/* Subheading */}
        <p className="text-[22px] sm:text-[26px] font-semibold text-amber-400 mb-4 tracking-tight [text-shadow:_0_1px_8px_rgba(0,0,0,0.2)]">
          Fulfill your bucket list ✦
        </p>

        {/* Body copy */}
        <p className="text-white/90 text-[14px] max-w-md mx-auto leading-relaxed mb-8 [text-shadow:_0_1px_6px_rgba(0,0,0,0.3)]">
          Explore destinations, book hotels, rent bikes, hire cabs and plan treks — all in one place, powered by AI.
        </p>

        {/* Search bar */}
        <div
          className="flex items-center mx-auto mb-5 sm:mb-10 bg-white border border-gray-200 rounded-2xl px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 transition-all"
          style={{ maxWidth: '620px' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mr-3">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            id="hero-search"
            type="text"
            placeholder="Enter your dream destination…"
            className="flex-1 bg-transparent outline-none border-none text-gray-700 text-sm sm:text-base placeholder-gray-400 min-w-0"
            onKeyDown={e => {
              if (e.key === "Enter") {
                const val = e.currentTarget.value.trim();
                if (val) window.location.href = `/destinations?q=${encodeURIComponent(val)}`;
              }
            }}
          />
          <button
            className="flex-shrink-0 px-5 py-2 rounded-xl text-white font-semibold text-sm sm:text-base active:scale-95 transition-all hover:opacity-90"
            style={{ background: GRADIENT }}
            onClick={() => {
              const input = document.getElementById('hero-search') as HTMLInputElement;
              const val = input?.value.trim();
              if (val) window.location.href = `/destinations?q=${encodeURIComponent(val)}`;
            }}
          >
            Search
          </button>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-10">
          <a
            href="#destinations"
            className="group w-full sm:w-auto px-7 py-3 rounded-xl text-white font-semibold text-sm sm:text-base tracking-wide active:scale-95 transition-all inline-flex items-center justify-center gap-2 hover:opacity-90"
            style={{ background: GRADIENT, boxShadow: '0 4px 18px rgba(99,102,241,0.35)' }}
          >
            Start Your Adventure
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>

          <a
            href="https://www.youtube.com/@GoVisitSikkim"
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full sm:w-auto px-7 py-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-95 text-gray-700 font-semibold text-sm sm:text-base tracking-wide transition-all inline-flex items-center justify-center gap-2.5"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF0000" className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Watch us on YouTube
          </a>
        </div>

        {/* Tab pill switcher — scrollable on mobile */}
        <div className="w-full overflow-x-auto pb-2 mb-6 sm:mb-10 no-scrollbar">
          <div className="flex gap-1.5 bg-gray-100 rounded-2xl p-1.5 mx-auto w-fit min-w-full sm:min-w-0 tab-glow">
            {PILLS.map((pill) => (
              <a
                key={pill.label}
                href={pill.href}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-[12px] sm:text-[13px] font-medium transition-all bg-white text-gray-900 shadow-sm border border-gray-100 hover:border-indigo-200 hover:shadow-indigo-100 whitespace-nowrap flex-shrink-0"
              >
                {pill.icon}
                {pill.label}
              </a>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 mx-auto w-full max-w-2xl">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-gray-100 rounded-2xl py-3 sm:py-4 px-1 sm:px-3 text-center shadow-sm"
            >
              <div
                className="text-lg sm:text-2xl font-bold bg-clip-text text-transparent"
                style={{ backgroundImage: GRADIENT }}
              >
                {stat.value}
              </div>
              <div className="text-[9px] sm:text-[11px] text-gray-400 mt-0.5 uppercase tracking-wide font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes tabGlow {
          0%, 100% {
            border: 1.5px solid rgba(99,102,241,0.35);
            box-shadow: 0 0 8px rgba(99,102,241,0.2), 0 0 20px rgba(124,58,237,0.1);
          }
          50% {
            border: 1.5px solid rgba(124,58,237,0.75);
            box-shadow: 0 0 16px rgba(99,102,241,0.45), 0 0 36px rgba(124,58,237,0.25);
          }
        }
        .tab-glow {
          animation: tabGlow 2.5s ease-in-out infinite;
          border: 1.5px solid rgba(99,102,241,0.35);
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default HomeHero;