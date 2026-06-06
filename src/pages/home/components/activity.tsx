import { Link } from "react-router-dom";
import activities from "../../../data/activity";

const Activities = () => {
  return (
    <section 
      className="py-16 px-8" 
      id="activities"
      style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)' }}
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-[800px] mx-auto mb-16">
          <span 
            className="inline-block px-6 py-1 rounded-full text-sm font-semibold tracking-wide mb-6"
            style={{ color: '#7451A8' }}
          >
            🎯 Adventures Await
          </span>
          <h2 className="text-[clamp(2rem,5vw,3rem)] font-extrabold text-gray-800 mb-4 leading-tight">
            Thrilling<span style={{ color: '#7451A8', marginLeft: '10px' }}>Activities</span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            From adrenaline-pumping adventures to peaceful cultural experiences,
            Sikkim offers something for every traveler
          </p>
        </div>

        {/* Activities Grid — show only 2 on home */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {activities.slice(0, 2).map((activity, index) => (
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
                  {activity.features.map((feature, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <Link to={'/activities/' + activity.id}>
                  <button 
                    className="group/btn relative w-full px-6 py-3 rounded-xl text-sm font-semibold tracking-wide text-white border-2 border-transparent shadow-sm transition-all duration-200 inline-flex items-center justify-center overflow-hidden hover:-translate-y-1 hover:shadow-xl active:-translate-y-0.5 active:shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)' }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-200 group-hover/btn:opacity-100" />
                    <span className="relative">{activity.actionLabel}</span>
                    <span className="relative inline-block ml-2 transition-transform duration-200 group-hover/btn:translate-x-1">→</span>
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Link to="/activities" 
          className="group/btn relative w-full px-6 py-2 rounded-xl text-sm font-semibold tracking-wide text-white border-2 border-transparent shadow-sm transition-all duration-200 inline-flex items-center justify-center overflow-hidden hover:-translate-y-1 hover:shadow-xl active:-translate-y-0.5 active:shadow-lg sm:w-1/4"
          style={{ background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)' }}
        >
          <span className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          <span className="relative">View All Activities</span>
        </Link>
      </div>
    </section>
  );
};

export default Activities;