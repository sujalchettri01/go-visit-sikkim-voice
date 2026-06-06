import { Link } from "react-router-dom";
import packages from "../../../data/package";

const Destinations = () => {
  return (
    <section 
      className="py-16 px-8" 
      id="destinations"
      style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)' }}
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-[800px] mx-auto mb-16">
          <span 
            className="inline-block px-6 py-1 text-white rounded-full text-sm font-semibold tracking-wide mb-6"
            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)' }}
          >
            🏔️ TOP DESTINATIONS
          </span>
          <h2 className="text-[clamp(2rem,5vw,3rem)] font-extrabold text-gray-800 mb-4 leading-tight">
            Majestic <span style={{ color: '#7451A8' }}>Mountains</span>
            <br />
            Await Your Discovery
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Explore breathtaking destinations that showcase the natural beauty
            and cultural richness of Sikkim's pristine Himalayan landscapes
          </p>
        </div>

        {/* Destinations Grid — show only 2 on home */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {packages.slice(0, 2).map((destination: any) => (
            <div 
              key={destination.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-200 border border-gray-200 hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
            >
              {/* Destination Image */}
              <div className="relative h-[250px] overflow-hidden">
                <img 
                  src={destination.image} 
                  alt={destination.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-6 right-6 px-4 py-1 bg-white/95 backdrop-blur-md rounded-full text-sm font-semibold text-blue-600 shadow-sm">
                  {destination.difficulty}
                </div>
              </div>

              {/* Destination Content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {destination.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {destination.shortDescription}
                </p>

                {/* Meta Information */}
                <div className="flex gap-6 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <span className="text-lg">⏱️</span>
                    <span>{destination.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <span className="text-lg">👥</span>
                    <span>{destination.minimum_guests} - {destination.maximum_guests}</span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-1 mb-6">
                  {destination.summary.map((highlight: any, index: any) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-[0.8125rem] font-medium"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                {/* Link */}
                <Link to={`/destinations/${destination.id}`}
                  className="group inline-flex items-center gap-2 text-blue-600 font-semibold no-underline transition-all duration-200 hover:gap-4"
                >
                  Explore {destination.name}
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Section Footer */}
        <div className="text-center">
          <Link to="/destinations" 
            className="group/btn relative w-full px-6 py-2 rounded-xl text-sm font-semibold tracking-wide text-white border-2 border-transparent shadow-sm transition-all duration-200 inline-flex items-center justify-center overflow-hidden hover:-translate-y-1 hover:shadow-xl active:-translate-y-0.5 active:shadow-lg sm:w-1/4 focus-visible:outline-4 focus-visible:outline-blue-200 focus-visible:outline-offset-2"
            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)' }}
          >
            <span className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            <span className="relative">View All Destinations</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Destinations;