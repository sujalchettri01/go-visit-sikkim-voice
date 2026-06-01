import { useState } from "react";
import cultureItems from "../../data/culture";
import { Link } from "react-router-dom";

const CATEGORIES = [
  { key: "Places in Depth", label: "Places in Depth", icon: "📍", color: "#0891B2", count: "Sacred Lakes & Sites", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" },
  { key: "Festivals", label: "Festivals", icon: "🎭", color: "#BE185D", count: "Celebrations & Rituals", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80" },
  { key: "Local Villages", label: "Local Villages", icon: "🏘️", color: "#92400E", count: "Heritage Homestays", image: "https://res.cloudinary.com/djsguxriw/image/upload/v1776790844/Lepcha_Village_Experience14-014db39f_ykashe.jpg" },
  { key: "Tradition & Culture", label: "Tradition & Culture", icon: "🎨", color: "#7C3AED", count: "Art, Craft & Cuisine", image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80" },
];

// Map culture.ts categories to our new keys
// Categories match directly now — no mapping needed

function CategoryCard({ cat, onClick }: { cat: typeof CATEGORIES[0]; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-end justify-end rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl text-left w-full h-full"
      style={{ border: "none" }}
    >
      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-110"
        style={{ backgroundImage: `url('${cat.image}')` }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)" }} />
      <div className="absolute top-3 left-3 text-2xl">{cat.icon}</div>
      <div className="relative z-10 p-4 w-full">
        <div className="font-extrabold text-white text-base leading-tight">{cat.label}</div>
        <div className="flex items-center justify-between mt-1">
          <div className="text-xs text-white/70">{cat.count}</div>
          <div className="text-xs font-bold text-white bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">Explore →</div>
        </div>
      </div>
    </button>
  );
}

const CulturePage = () => {
  const [activeTab, setActiveTab] = useState("");

  const filteredItems = activeTab
    ? cultureItems.filter((item) => item.category === activeTab)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

      {/* ── Category Landing Grid ── */}
      {!activeTab && (
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-extrabold text-gray-800">Culture & Heritage</h2>
            <p className="text-gray-400 text-sm mt-1">Choose a category to explore Sikkim's rich culture</p>
          </div>

          {/* Row 1 — 2 large cards */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {CATEGORIES.slice(0, 2).map((cat) => (
              <div key={cat.key} style={{ minHeight: "240px", height: "240px" }}>
                <CategoryCard cat={cat} onClick={() => setActiveTab(cat.key)} />
              </div>
            ))}
          </div>

          {/* Row 2 — 2 large cards */}
          <div className="grid grid-cols-2 gap-4">
            {CATEGORIES.slice(2, 4).map((cat) => (
              <div key={cat.key} style={{ minHeight: "240px", height: "240px" }}>
                <CategoryCard cat={cat} onClick={() => setActiveTab(cat.key)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Back button ── */}
      {activeTab && (
        <div className="max-w-7xl mx-auto px-4 pt-6 pb-2">
          <button
            onClick={() => setActiveTab("")}
            className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            ← Back to Categories
          </button>
        </div>
      )}

      {/* ── Section Header ── */}
      {activeTab && (
        <div className="max-w-7xl mx-auto px-4 pb-4">
          <h2 className="text-2xl font-extrabold text-gray-800">{activeTab}</h2>
          <p className="text-gray-400 text-sm mt-1">
            {filteredItems.length} experience{filteredItems.length !== 1 ? "s" : ""} available
          </p>
        </div>
      )}

      {/* ── Culture Items Grid ── */}
      {activeTab && (
        <div className="max-w-7xl mx-auto px-4 pb-16">
          {filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-4xl mb-4">🏛️</p>
              <p className="text-gray-600 font-semibold text-lg">No experiences yet in {activeTab}</p>
              <p className="text-gray-400 text-sm mt-1 mb-5">Check back soon</p>
              <button
                onClick={() => setActiveTab("")}
                className="px-6 py-2 rounded-full text-sm font-semibold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition"
              >
                Back to categories
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item: any, index: number) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 border border-gray-200 hover:-translate-y-2 hover:shadow-2xl group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4">
                      <span className="text-3xl" style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))" }}>{item.icon}</span>
                    </div>
                    <div className="absolute top-4 right-4 px-3 py-1 bg-purple-600/90 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                      {item.category}
                    </div>
                    <div className="absolute top-4 left-4 px-4 py-1 bg-white/95 backdrop-blur-sm rounded-full text-sm font-semibold text-blue-600 shadow-md">
                      {item.experiences} Experiences
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-4 min-h-[3em]">{item.shortDescription}</p>





                    <Link to={'/cultures/' + item.id}>
                      <button
                        className="group/btn relative w-full px-6 py-3 rounded-xl text-sm font-semibold tracking-wide text-white border-2 border-transparent shadow-sm transition-all duration-200 inline-flex items-center justify-center overflow-hidden hover:-translate-y-1 hover:shadow-xl"
                        style={{ background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)' }}
                      >
                        <span className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-200 group-hover/btn:opacity-100" />
                        <span className="relative">Explore Culture</span>
                        <span className="relative inline-block ml-2 transition-transform duration-200 group-hover/btn:translate-x-1">→</span>
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CTA Section */}
      <section className="relative py-24 px-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 [text-shadow:_0_4px_20px_rgba(0,0,0,0.3)]">
            Begin Your
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Cultural Journey
            </span>
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Connect with ancient traditions and create meaningful memories in the heart of the Himalayas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <button className="group px-10 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:bg-gray-50 hover:-translate-y-1 transition-all duration-200 shadow-xl inline-flex items-center justify-center">
                <span>Book Cultural Tour</span>
                <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
              </button>
            </Link>
            <Link to="/contact">
              <button className="px-10 py-4 bg-transparent text-white border-2 border-white rounded-xl font-semibold text-lg hover:bg-white/10 hover:-translate-y-1 transition-all duration-200 backdrop-blur-sm">
                Contact Guide
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CulturePage;