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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5"/>
      </svg>
    ),
  },
  {
    label: "Hotels",
    href: "/accommodations",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    label: "Cabs",
    href: "/cabs",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#fbbf24">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
      </svg>
    ),
  },
  {
    label: "Bikes",
    href: "/bikes",
    icon: <Bike size={20} color="#fbbf24" strokeWidth={2} />,
  },
  {
    label: "Trekking",
    href: "/activities",
    icon: <Footprints size={20} color="#fbbf24" strokeWidth={2} />,
  },
];

const HomeHero = () => {
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden py-6">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/djsguxriw/image/upload/v1773216362/anshika-7vHDicrPYOI-unsplash_v0toqz.jpg')`,
        }}
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(102,126,234,0.55) 0%, rgba(118,75,162,0.55) 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.35) 100%)' }} />

      {/* Content */}
      <div className="relative z-[2] text-center w-full max-w-[1200px] px-5 sm:px-8 animate-[fadeInUp_1s_ease-out] mt-0">

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-5 sm:mb-6 leading-[1.1] [text-shadow:_0_4px_20px_rgba(0,0,0,0.3)]">
          <span className="block bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
            Fullfill your bucket list
          </span>
        </h1>

        {/* Search bar */}
        <div
          className="flex items-center mx-auto mb-5 sm:mb-10 overflow-hidden"
          style={{
            maxWidth: '620px',
            background: 'rgba(255,255,255,0.97)',
            borderRadius: '50px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            padding: '6px 6px 6px 20px',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mr-3">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            id="hero-search"
            type="text"
            placeholder="Enter your dream destination "
            className="flex-1 bg-transparent outline-none border-none text-gray-700 text-sm sm:text-base placeholder-gray-400"
            style={{ fontFamily: "'Inter', sans-serif" }}
            onKeyDown={e => {
              if (e.key === "Enter") {
                const val = (e.currentTarget as HTMLInputElement).value.trim();
                if (val) window.location.href = `/destinations?q=${encodeURIComponent(val)}`;
              }
            }}
          />
          <button
            className="flex-shrink-0 px-6 py-3 rounded-full text-white font-semibold text-sm sm:text-base transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', boxShadow: '0 4px 14px rgba(79,70,229,0.5)' }}
            onClick={() => {
              const input = document.getElementById('hero-search') as HTMLInputElement;
              const val = input?.value.trim();
              if (val) window.location.href = `/destinations?q=${encodeURIComponent(val)}`;
            }}
          >
            Search
          </button>
        </div>

        {/* Subtitle */}
    

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center mb-6 sm:mb-12 px-0">

          {/* Start Your Adventure */}
          <button
            className="group relative w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 rounded-xl text-sm sm:text-lg font-semibold tracking-wide text-white border-2 border-transparent shadow-sm transition-all duration-200 inline-flex items-center justify-center overflow-hidden hover:-translate-y-1 hover:shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)')}
          >
            <a href="#destinations" className="flex items-center gap-2">
              <span>Start Your Adventure</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          </button>

          {/* Watch us on YouTube — white glass style */}
          <a
            href="https://www.youtube.com/@GoVisitSikkim"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 rounded-xl text-sm sm:text-lg font-semibold tracking-wide text-white border-2 transition-all duration-200 inline-flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-2xl"
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(12px)',
              borderColor: 'rgba(255,255,255,0.3)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
            }}
          >
            {/* YouTube icon in red to keep brand recognition */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#FF0000" className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>Watch us on YouTube</span>
          </a>
        </div>

        {/* Connected Bar — Option A */}
        <div
          className="flex rounded-2xl overflow-hidden mx-auto mb-5 sm:mb-12 max-w-3xl"
          style={{ background: 'rgba(14,16,35,0.72)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          {PILLS.map((pill, i) => (
            <a
              key={pill.label}
              href={pill.href}
              className="flex-1 flex flex-col items-center justify-center gap-2 py-3.5 sm:py-4 px-1 sm:px-2 transition-all duration-200 hover:bg-white/10 group"
              style={{ borderRight: i < PILLS.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}
            >
              <span className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110">
                {pill.icon}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white/80 group-hover:text-white transition-colors duration-200 whitespace-nowrap">
                {pill.label}
              </span>
            </a>
          ))}
        </div>

        {/* Stats Bar */}
        <div
          className="flex flex-wrap justify-center gap-0 rounded-2xl overflow-hidden mx-auto max-w-2xl"
          style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="flex-1 min-w-[60px] flex flex-col items-center justify-center py-3.5 sm:py-4 px-2 sm:px-3"
              style={{ borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}
            >
              <span
                className="text-xl sm:text-3xl font-extrabold"
                style={{ background: 'linear-gradient(90deg, #fbbf24, #fde68a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                {stat.value}
              </span>
              <span className="text-white/70 text-xs sm:text-sm font-medium mt-0.5 tracking-wide">{stat.label}</span>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default HomeHero;