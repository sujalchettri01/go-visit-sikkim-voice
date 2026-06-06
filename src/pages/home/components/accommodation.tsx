// import { accommodations } from "../../../data/data";
import { Link } from "react-router-dom";
import accommodations from "../../../data/hotel";

const Accommodations = () => {
  return (
    <section 
      className="py-16 px-8" 
      id="accommodations"
      style={{ background: 'linear-gradient(180deg, #f1f5f9 0%, #ffffff 100%)' }}
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-[800px] mx-auto mb-16">
          <span 
            className="inline-block px-6 py-1 text-gray-800 rounded-full text-sm font-semibold tracking-wide mb-6"
          >
            🏨 Stay in Comfort
          </span>
          <h2 className="text-[clamp(2rem,5vw,3rem)] font-extrabold text-gray-800 mb-4 leading-tight">
            Perfect<span style={{ marginLeft: '16px' }}>Accommodations</span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            From luxury resorts to cozy homestays, find the perfect place to
            rest after your Himalayan adventures
          </p>
        </div>

        {/* Accommodations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {accommodations.slice(0,3).map((accommodation) => (
            <div 
              key={accommodation.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-200 border border-gray-200 flex flex-col hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
            >
              {/* Accommodation Image */}
              <div className="relative h-[200px] overflow-hidden">
                <img 
                  src={accommodation.image} 
                  alt={accommodation.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-4 left-4 px-4 py-1 bg-blue-600/95 backdrop-blur-md text-white rounded-full text-xs font-semibold shadow-sm">
                  {accommodation.type}
                </div>
              </div>

              {/* Accommodation Content */}
              <div className="p-8 flex flex-col flex-grow">
                {/* Header with Name and Rating */}
                <div className="flex justify-between items-start mb-4 gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {accommodation.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      📍 {accommodation.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg font-semibold text-gray-800 flex-shrink-0">
                    <span className="text-sm">⭐</span>
                    <span className="text-sm">{accommodation.rating}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed mb-6">
                  {accommodation.shortDescription}
                </p>

                {/* Amenities Section */}
                <div className="mb-6 p-4 bg-gray-100 rounded-xl">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">
                    Amenities:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {accommodation.amenities.map((amenity, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-white text-gray-600 rounded-lg text-xs font-medium border border-gray-200"
                      >
                        ✓ {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer with Price and Button */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-auto">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{accommodation.pricePerNight.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600">/night</span>
                  </div>
                  <Link to={'/accommodations/' + accommodation.id}>
                   <button 
                    className="group relative px-6 py-2 rounded-xl text-sm font-semibold tracking-wide text-white border-2 border-transparent shadow-sm transition-all duration-200 inline-flex items-center justify-center overflow-hidden hover:-translate-y-1 hover:shadow-2xl active:-translate-y-0.5 active:shadow-lg focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-200 focus-visible:outline-offset-2"
                    style={{ background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)';
                    }}
                  >
                    <span 
                      className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    />
                    <span className="relative">Book Now</span>
                  </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center mt-8">
          <Link to="/accommodations" 
             className="group/btn relative w-full px-6 py-2 rounded-xl text-sm font-semibold tracking-wide text-white border-2 border-transparent shadow-sm transition-all duration-200 inline-flex items-center justify-center overflow-hidden hover:-translate-y-1 hover:shadow-xl active:-translate-y-0.5 active:shadow-lg sm:w-1/4 focus-visible:outline-4 focus-visible:outline-blue-200 focus-visible:outline-offset-2"
                      style={{ background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)' }}
          >
            <span 
              className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            />
            <span className="relative">View All Hotels</span>
          </Link>
        </div>
    </section>
  );
};

export default Accommodations