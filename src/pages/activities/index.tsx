import { useState } from "react";
import activities from "../../data/activity";
import { Link } from "react-router-dom";

const CATEGORIES = [
  { key: "Trekking", label: "Trekking", icon: "", color: "#059669", count: "3 experiences", image: "https://res.cloudinary.com/djsguxriw/image/upload/v1776424398/657852386_1404912934984388_4859059018332100521_n_kgauwv.jpg" },
  { key: "River Rafting", label: "River Rafting", icon: "", color: "#0284C7", count: "2 experiences", image: "https://res.cloudinary.com/djsguxriw/image/upload/v1780257313/1696576475_aasyznp9i1d7ijmx3a3gn9xwsfm2_suminei6amay9qhghmuliz7is4yx_shutterstock_1372981319_min.jpg_cwqpcq.webp" },
  { key: "Cycling", label: "Cycling", icon: "", color: "#D97706", count: "2 experiences", image: "https://res.cloudinary.com/djsguxriw/image/upload/v1780257627/photo-1772770645152-1d382648cc21_bg4sme.jpg" },
  { key: "Upcoming Events", label: "Upcoming Events", icon: "", color: "#7C3AED", count: "2 events", image: "https://res.cloudinary.com/djsguxriw/image/upload/v1780257171/SIFF_wpo6lg.png" },
  { key: "Sports Events", label: "Sports Events", icon: "", color: "#DC2626", count: "2 events", image: "https://res.cloudinary.com/djsguxriw/image/upload/v1780257171/SPL_x7hbbj.png" },
];

function tab(key: string) {
  const map: Record<string, string> = {
    "Trekking": "Trekking Experiences",
    "River Rafting": "River Rafting Adventures",
    "Cycling": "Cycling Tours",
    "Upcoming Events": "Upcoming Events",
    "Sports Events": "Sports Events",
  };
  return map[key] ?? key;
}

const CategoryCard = ({ cat, onClick }: { cat: typeof CATEGORIES[0]; onClick: () => void }) => (
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
      <div className="font-extrabold text-white leading-tight">{cat.label}</div>
      <div className="flex items-center justify-between mt-1">
        <div className="text-xs text-white/70">{cat.count}</div>
        <div className="text-xs font-bold text-white bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">Explore →</div>
      </div>
    </div>
  </button>
);

const ActivitiesPage = () => {
  const [activeTab, setActiveTab] = useState("");

  const filteredActivities = activeTab
    ? (activities as any[]).filter((a) => a.category === activeTab)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

      {/* ── Category Landing Grid ── */}
      {!activeTab && (
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-extrabold text-gray-800">Activities & Adventures</h2>
            <p className="text-gray-400 text-sm mt-1">Choose a category to explore</p>
          </div>

          {/* Top row — 3 cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            {CATEGORIES.slice(0, 3).map((cat) => (
              <div key={cat.key} style={{ minHeight: "220px", height: "220px" }}>
                <CategoryCard cat={cat} onClick={() => setActiveTab(cat.key)} />
              </div>
            ))}
          </div>

          {/* Bottom row — 2 cards */}
          <div className="grid grid-cols-2 gap-4">
            {CATEGORIES.slice(3).map((cat) => (
              <div key={cat.key} style={{ minHeight: "260px", height: "260px" }}>
                <CategoryCard cat={cat} onClick={() => setActiveTab(cat.key)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Back button when category selected ── */}
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
          <h2 className="text-2xl font-extrabold text-gray-800">{tab(activeTab)}</h2>
          <p className="text-gray-400 text-sm mt-1">
            {filteredActivities.length} experience{filteredActivities.length !== 1 ? "s" : ""} available
          </p>
        </div>
      )}

      {/* ── Activities Grid ── */}
      {activeTab && (
        <div className="max-w-7xl mx-auto px-4 pb-16">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-4xl mb-4">🏔️</p>
              <p className="text-gray-600 font-semibold text-lg">No {activeTab} experiences yet</p>
              <p className="text-gray-400 text-sm mt-1 mb-5">Check back soon or explore other categories</p>
              <button
                onClick={() => setActiveTab("")}
                className="px-6 py-2 rounded-full text-sm font-semibold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition"
              >
                View all activities
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredActivities.map((activity: any, index: number) => (
                <div
                  key={activity.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 border border-gray-200 hover:-translate-y-2 hover:shadow-2xl group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={activity.image}
                      alt={activity.name}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 px-4 py-1 bg-white/95 backdrop-blur-sm rounded-full text-sm font-semibold text-blue-600 shadow-md">
                      {activity.difficulty}
                    </div>
                    <div className="absolute top-4 right-4 px-3 py-1 bg-purple-600/90 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                      {activity.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{activity.name}</h3>
                    <p className="text-gray-600 leading-relaxed mb-4 min-h-[3em]">{activity.description}</p>

                    <div className="flex flex-col gap-2 mb-6 pb-6 border-b border-gray-200">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <span className="text-base">⏱️</span>
                        <span>{activity.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <span className="text-base">🌤️</span>
                        <span>{activity.bestSeason}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {Array.isArray(activity.features) && activity.features.map((feature: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                          {feature}
                        </span>
                      ))}
                    </div>

                    <Link to={'/activities/' + activity.id}>
                      <button
                        className="group/btn relative w-full px-6 py-3 rounded-xl text-sm font-semibold tracking-wide text-white border-2 border-transparent shadow-sm transition-all duration-200 inline-flex items-center justify-center overflow-hidden hover:-translate-y-1 hover:shadow-xl"
                        style={{ background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)' }}
                      >
                        <span className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-200 group-hover/btn:opacity-100" />
                        <span className="relative">{activity.actionLabel ?? 'Know More'}</span>
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
      <section className="relative py-12 px-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-4xl font-extrabold text-white mb-6 [text-shadow:_0_4px_20px_rgba(0,0,0,0.3)]">
            Ready for Your Next
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Adventure Experience?
            </span>
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Book your activities now and create memories that will last a lifetime
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <button className="group px-10 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:bg-gray-50 hover:-translate-y-1 transition-all duration-200 shadow-xl inline-flex items-center justify-center">
                <span>Book Activities</span>
                <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
              </button>
            </Link>
            <Link to="/destinations">
              <button className="px-10 py-4 bg-transparent text-white border-2 border-white rounded-xl font-semibold text-lg hover:bg-white/10 hover:-translate-y-1 transition-all duration-200 backdrop-blur-sm">
                Custom Package
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
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ActivitiesPage;