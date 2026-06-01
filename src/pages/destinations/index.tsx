import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import packages from "../../data/package";
import { Link } from "react-router-dom";

const DestinationsPage = () => {
  const [filter, setFilter] = useState("All");
  const [searchParams] = useSearchParams();
  const [activeQuery, setActiveQuery] = useState(searchParams.get("q") ?? "");
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setActiveQuery(q);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 400);
    }
  }, [searchParams]);

  const filteredDestinations = packages.filter((d: any) => {
    const matchesDifficulty =
      filter === "All" ||
      String(d.difficulty).trim().toLowerCase() === String(filter).trim().toLowerCase();

    const q = activeQuery.trim().toLowerCase();
    const words = q.split(/\s+/).filter(Boolean);
    const matchesSearch =
      q === "" ||
      words.every(word =>
        d.title?.toLowerCase().includes(word) ||
        d.locations?.some((loc: any) => loc.name?.toLowerCase().includes(word)) ||
        d.summary?.some((tag: string) => tag.toLowerCase().includes(word))
      );

    return matchesDifficulty && matchesSearch;
  });

  const handleClear = () => {
    setActiveQuery("");
  };

  return (
    <div className="min-h-screen">

      {/* Destinations Grid */}
      <section ref={resultsRef} className="py-16 px-4 md:px-8 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">

          {/* Heading */}
          <div className="text-center max-w-3xl mx-auto mb-8 animate-[fadeInUp_1s_ease-out]">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
              Tour <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Packages</span>
              <br />You love to have
            </h2>
          </div>

          {/* Search Bar — same as HomeHero, navigates via URL */}
          <div
            className="flex items-center mx-auto mb-10 overflow-hidden"
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
              id="dest-search"
              type="text"
              placeholder="Enter your dream destination in Sikkim..."
              className="flex-1 bg-transparent outline-none border-none text-gray-700 text-sm sm:text-base placeholder-gray-400"
              style={{ fontFamily: "'Inter', sans-serif" }}
              defaultValue={searchParams.get("q") ?? ""}
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
                const input = document.getElementById('dest-search') as HTMLInputElement;
                const val = input?.value.trim();
                if (val) window.location.href = `/destinations?q=${encodeURIComponent(val)}`;
              }}
            >
              Search
            </button>
          </div>

          {/* Active search indicator */}
          {activeQuery && (
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-200">
                Showing results for: <strong>"{activeQuery}"</strong>
                <button onClick={handleClear} className="text-indigo-400 hover:text-indigo-600 ml-1">✕</button>
              </span>
            </div>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredDestinations.map((destination: any, index: number) => (
              <div
                key={destination.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 border border-gray-200 hover:-translate-y-2 hover:shadow-2xl group animate-[fadeInUp_0.6s_ease-out]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={destination.image} alt={destination.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 right-4 px-4 py-1 bg-white/95 backdrop-blur-sm rounded-full text-sm font-semibold text-blue-600 shadow-md">
                    {destination.difficulty}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{destination.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{destination.shortDescription}</p>
                  <div className="flex gap-6 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <span className="text-lg">⏱️</span>
                      <span>{destination.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <span className="text-lg">👥</span>
                      <span>{destination?.minimum_guests} - {destination?.maximum_guests}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {destination.summary.map((highlight: any, i: any) => (
                      <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">{highlight}</span>
                    ))}
                  </div>
                  <Link to={`/destinations/${destination.id}`} className="group/link inline-flex items-center gap-2 text-blue-600 font-semibold no-underline transition-all duration-200 hover:gap-4">
                    Explore {destination.name}
                    <span className="transition-transform duration-200 group-hover/link:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredDestinations.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600 mb-2">
                No destinations found {activeQuery ? `for "${activeQuery}"` : "for this filter"}.
              </p>
              <div className="flex gap-3 justify-center mt-4">
                {activeQuery && (
                  <button onClick={handleClear} className="px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors">
                    Clear Search
                  </button>
                )}
                <button onClick={() => { setFilter("All"); handleClear(); }} className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors">
                  View All
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 overflow-hidden" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 [text-shadow:_0_4px_20px_rgba(0,0,0,0.3)]">
            Ready to Start Your
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Himalayan Adventure?
            </span>
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Plan your perfect Sikkim journey with our expert guides and local insights
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <button className="group px-10 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:bg-gray-50 hover:-translate-y-1 transition-all duration-200 shadow-xl inline-flex items-center justify-center">
                <span>Plan Your Trip</span>
                <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
              </button>
            </Link>
            <Link to="/contact">
              <button className="px-10 py-4 bg-transparent text-white border-2 border-white rounded-xl font-semibold text-lg hover:bg-white/10 hover:-translate-y-1 transition-all duration-200 backdrop-blur-sm">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default DestinationsPage;