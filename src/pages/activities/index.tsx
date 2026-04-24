import { useState } from "react";
import activities from "../../data/activity";
import { Link } from "react-router-dom";
// Sample activities data


const ActivitiesPage = () => {
  const [filter, setFilter] = useState("All");
  
  const categories = ["All", "Adventure", "Cultural", "Wellness", "Nature"];
  
  const filteredActivities = filter === "All" 
    ? activities 
    : activities.filter(a => a.category === filter);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
     <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
  {/* Background image */}
  <div
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: `url('https://res.cloudinary.com/djsguxriw/image/upload/v1776444213/666865169_1357945173035135_4941638179043577882_n_szqbhe.jpg')`,
    }}
  />

  {/* Purple gradient overlay */}
  <div
    className="absolute inset-0"
    style={{ background: 'linear-gradient(135deg, rgba(102,126,234,0.6) 0%, rgba(118,75,162,0.6) 100%)' }}
  />

  {/* Radial dark overlay */}
  <div
    className="absolute inset-0"
    style={{ background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.35) 100%)' }}
  />

  {/* Hero Content */}
  <div className="relative z-[2] text-center max-w-[1200px] px-8 animate-[fadeInUp_1s_ease-out]">
    {/* Badge */}
    <div className="inline-block px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold tracking-wider mb-8 border border-white/30 animate-pulse">
      🎯 ADVENTURE AWAITS
    </div>

    {/* Title */}
    <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-extrabold text-white mb-6 leading-[1.1] [text-shadow:_0_4px_20px_rgba(0,0,0,0.3)]">
      Thrilling
      <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
        Activities & Adventures
      </span>
    </h1>

    {/* Subtitle */}
    <p className="text-[clamp(1rem,2vw,1.25rem)] text-white/90 max-w-[700px] mx-auto mb-12 leading-relaxed">
      From adrenaline-pumping adventures to peaceful cultural experiences,
      Sikkim offers something for every traveler
    </p>

    {/* Feature Stats */}
    <div className="flex gap-8 justify-center flex-wrap mb-8 max-md:flex-col max-md:gap-4">
      <div className="flex items-center gap-3 text-white font-semibold px-6 py-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 transition-all duration-200 hover:-translate-y-1 hover:bg-white/15 hover:shadow-lg">
        <span className="text-3xl">🏔️</span>
        <div className="text-left">
          <div className="text-2xl font-bold">50+</div>
          <div className="text-sm text-white/80">Activities</div>
        </div>
      </div>
      <div className="flex items-center gap-3 text-white font-semibold px-6 py-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 transition-all duration-200 hover:-translate-y-1 hover:bg-white/15 hover:shadow-lg">
        <span className="text-3xl">⭐</span>
        <div className="text-left">
          <div className="text-2xl font-bold">4.9/5</div>
          <div className="text-sm text-white/80">Rating</div>
        </div>
      </div>
      <div className="flex items-center gap-3 text-white font-semibold px-6 py-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 transition-all duration-200 hover:-translate-y-1 hover:bg-white/15 hover:shadow-lg">
        <span className="text-3xl">👥</span>
        <div className="text-left">
          <div className="text-2xl font-bold">10K+</div>
          <div className="text-sm text-white/80">Happy Travelers</div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Filter Section */}
      <section className="py-12 px-4 bg-gradient-to-b from-slate-50 to-white top-16 z-10 border-b border-gray-200 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                  filter === category
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 hover:scale-105 shadow-sm"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 animate-[fadeInUp_1s_ease-out]">
            <span className="inline-block px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-semibold tracking-wide mb-6 shadow-lg">
              🎯 HANDPICKED EXPERIENCES
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
              Unforgettable <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Adventures</span>
              <br />
              for Every Soul
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Whether you seek adrenaline or tranquility, discover activities that will make your journey unforgettable
            </p>
          </div>

          {/* Activities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredActivities.map((activity, index) => (
              <div 
                key={activity.id} 
                className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 border border-gray-200 hover:-translate-y-2 hover:shadow-2xl group animate-[fadeInUp_0.6s_ease-out]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Activity Image */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={activity.image} 
                    alt={activity.name}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-2"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 px-4 py-1 bg-white/95 backdrop-blur-sm rounded-full text-sm font-semibold text-blue-600 shadow-md">
                    {activity.difficulty}
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1 bg-purple-600/90 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                    {activity.category}
                  </div>
                </div>

                {/* Activity Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {activity.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4 min-h-[3em]">
                    {activity.description}
                  </p>

                  {/* Meta Information */}
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

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {activity.features.map((feature, idx) => (
                      <span 
                        key={idx} 
                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Action Button */}
                  <Link to={'/activities/' + activity.id}>
                   <button 
                    className="group/btn relative w-full px-6 py-3 rounded-xl text-sm font-semibold tracking-wide text-white border-2 border-transparent shadow-sm transition-all duration-200 inline-flex items-center justify-center overflow-hidden hover:-translate-y-1 hover:shadow-xl active:-translate-y-0.5 active:shadow-lg focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-200 focus-visible:outline-offset-2"
                    style={{ background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)' }}
                  >
                    <span 
                      className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-200 group-hover/btn:opacity-100"
                    />
                    <span className="relative">{activity.actionLabel}</span>
                    <span className="relative inline-block ml-2 transition-transform duration-200 group-hover/btn:translate-x-1">
                      →
                    </span>
                  </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredActivities.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">No activities found in this category.</p>
              <button 
                onClick={() => setFilter("All")}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
              >
                View All Activities
              </button>
            </div>
          )}

          {/* Section Footer */}
          
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-24 px-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%201440%20320%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20fill-opacity%3D%221%22%20d%3D%22M0%2C96L48%2C112C96%2C128%2C192%2C160%2C288%2C160C384%2C160%2C480%2C128%2C576%2C122.7C672%2C117%2C768%2C139%2C864%2C144C960%2C149%2C1056%2C139%2C1152%2C128C1248%2C117%2C1344%2C107%2C1392%2C101.3L1440%2C96L1440%2C320L1392%2C320C1344%2C320%2C1248%2C320%2C1152%2C320C1056%2C320%2C960%2C320%2C864%2C320C768%2C320%2C672%2C320%2C576%2C320C480%2C320%2C384%2C320%2C288%2C320C192%2C320%2C96%2C320%2C48%2C320L0%2C320Z%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E')] bg-bottom bg-cover bg-no-repeat"
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 [text-shadow:_0_4px_20px_rgba(0,0,0,0.3)]">
            Ready for Your Next
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Adventure Experience?
            </span>
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Book your activities now and create memories that will last a lifetime
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={'/contact'}>
             <button 
              className="group px-10 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:bg-gray-50 hover:-translate-y-1 transition-all duration-200 shadow-xl inline-flex items-center justify-center"
            >
              <span>Book Activities</span>
              <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
            </button>
            </Link>
            <Link to={'/destinations'}>
             <button className="px-10 py-4 bg-transparent text-white border-2 border-white rounded-xl font-semibold text-lg hover:bg-white/10 hover:-translate-y-1 transition-all duration-200 backdrop-blur-sm">
              Custom Package
            </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scroll {
          0% {
            opacity: 0;
            transform: translate(-50%, 0);
          }
          40% { opacity: 1; }
          80% {
            opacity: 0;
            transform: translate(-50%, 16px);
          }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ActivitiesPage;