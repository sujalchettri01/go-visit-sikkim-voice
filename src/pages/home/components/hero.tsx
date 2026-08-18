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
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5"/>
      </svg>
    ),
  },
  {
    label: "Hotels",
    href: "/accommodations",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    label: "Cabs",
    href: "/cabs",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
      </svg>
    ),
  },
  {
    label: "Bikes",
    href: "/bikes",
    icon: <Bike size={15} strokeWidth={2} />,
  },
  {
    label: "Trekking",
    href: "/activities",
    icon: <Footprints size={15} strokeWidth={2} />,
  },
];

const GRADIENT = "linear-gradient(135deg, #7B5CE5 0%, #5B3FC4 100%)";
const BG_IMAGE = "https://res.cloudinary.com/djsguxriw/image/upload/v1776186749/utkarsh-tiwari-cYBy1cPciGc-unsplash_hmmx1y.jpg";

const HomeHero = () => {
  const handleSearch = () => {
    const input = document.getElementById("hero-search");
    const val = input?.value.trim();
    if (val) window.location.href = `/destinations?q=${encodeURIComponent(val)}`;
  };

  return (

<section className="relative min-h-[calc(100vh-80px)] w-full flex items-center justify-center overflow-hidden py-10 -mt-[72px] pt-[92px]">


      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${BG_IMAGE}')` }}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50" />
      {/* Bottom gradient fade */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[680px] px-6 sm:px-10 animate-[fadeInUp_0.8s_ease-out]">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-white/30 text-white/80 text-[11px] font-medium uppercase tracking-widest px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm bg-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          Sikkim's trusted travel platform
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.08] tracking-tight text-white mb-5">
          AI based<br />
          <span style={{ color: "#C4B5FD" }}>Sikkim's,</span><br />
          Tourism Ecosystem
        </h1>

        {/* Subheading */}
        <p className="text-[16px] text-white/75 font-normal leading-relaxed max-w-lg mb-8">
          Explore breathtaking destinations, book hotels, rent bikes, hire cabs and plan treks — all in one place.
        </p>

        {/* Search bar */}
        <div className="flex gap-2 max-w-[500px] mb-8">
          <input
            id="hero-search"
            type="text"
            placeholder="Where do you want to go?"
            className="flex-1 h-11 rounded-full border border-white/30 bg-white/15 backdrop-blur-sm px-5 text-sm text-white placeholder-white/50 outline-none focus:border-white/60 transition-colors"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button
            onClick={handleSearch}
            className="h-11 px-6 rounded-full text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
            style={{ background: GRADIENT }}
          >
            Search →
          </button>
        </div>

        {/* Pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {PILLS.map((pill) => (
            <a
              key={pill.label}
              href={pill.href}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/25 text-[13px] font-medium text-white/80 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/50 transition-all"
            >
              <span className="flex-shrink-0">{pill.icon}</span>
              {pill.label}
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/15 mb-8" />

        {/* Stats */}
        <div className="grid grid-cols-4 rounded-2xl overflow-hidden border border-white/15">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`bg-white/10 backdrop-blur-sm py-5 px-3 text-center ${i < STATS.length - 1 ? "border-r border-white/15" : ""}`}
            >
              <div className="text-2xl font-extrabold mb-1 text-white">
                {stat.value}
              </div>
              <div className="text-[11px] text-white/60 font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default HomeHero;