import { useState } from "react";
import { Link } from "react-router-dom";

// Accommodations data
const accommodations = [
  {
    id: 1,
    name: "Mayfair Spa Resort & Casino",
    type: "Luxury Resort",
    location: "Gangtok",
    description:
      "Experience world-class luxury with stunning mountain views, spa facilities, and premium dining options.",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    rating: 4.8,
    pricePerNight: 12000,
    amenities: [
      "Spa & Wellness",
      "Casino",
      "Mountain View",
      "Fine Dining",
      "Pool",
    ],
    rooms: 85,
  },
  {
    id: 2,
    name: "Orange Village Resort",
    type: "Boutique Hotel",
    location: "Lachung",
    description:
      "A charming boutique property nestled in the mountains, offering personalized service and authentic experiences.",
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    rating: 4.6,
    pricePerNight: 7500,
    amenities: ["Restaurant", "Garden", "Valley View", "Bonfire", "Library"],
    rooms: 28,
  },
  {
    id: 3,
    name: "Norbu Ghang Resort",
    type: "Heritage Property",
    location: "Pelling",
    description:
      "Traditional Sikkimese architecture meets modern comfort with panoramic views of Kanchenjunga.",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
    rating: 4.7,
    pricePerNight: 8500,
    amenities: [
      "Cultural Shows",
      "Organic Garden",
      "Yoga Studio",
      "Restaurant",
      "Kanchenjunga View",
    ],
    rooms: 42,
  },
  {
    id: 4,
    name: "The Elgin Mount Pandim",
    type: "Heritage Hotel",
    location: "Pelling",
    description:
      "Colonial-era charm with modern amenities, set amidst lush forests with spectacular mountain vistas.",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    rating: 4.9,
    pricePerNight: 15000,
    amenities: [
      "Heritage Decor",
      "Fine Dining",
      "Bar",
      "Garden",
      "Mountain Views",
    ],
    rooms: 25,
  },
  {
    id: 5,
    name: "Village Homestay Experience",
    type: "Homestay",
    location: "Yuksom",
    description:
      "Immerse yourself in local culture with warm hospitality, home-cooked meals, and authentic village life.",
    image:
      "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&q=80",
    rating: 4.5,
    pricePerNight: 2500,
    amenities: [
      "Home-Cooked Meals",
      "Cultural Exchange",
      "Farm Tours",
      "Local Guide",
      "Family Atmosphere",
    ],
    rooms: 8,
  },
  {
    id: 6,
    name: "Summit Newa Regency",
    type: "Business Hotel",
    location: "Gangtok",
    description:
      "Modern business hotel in the heart of Gangtok with excellent connectivity and professional services.",
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    rating: 4.4,
    pricePerNight: 5000,
    amenities: [
      "Conference Rooms",
      "WiFi",
      "City Center",
      "Restaurant",
      "Travel Desk",
    ],
    rooms: 65,
  },
  {
    id: 7,
    name: "Bamboo Retreat",
    type: "Eco Resort",
    location: "Rinchenpong",
    description:
      "Sustainable eco-resort built with bamboo and local materials, offering peace and environmental consciousness.",
    image:
      "https://images.unsplash.com/photo-1506059612708-99d6c258160e?w=800&q=80",
    rating: 4.6,
    pricePerNight: 4500,
    amenities: [
      "Eco-Friendly",
      "Organic Food",
      "Nature Walks",
      "Bird Watching",
      "Solar Power",
    ],
    rooms: 15,
  },
  {
    id: 8,
    name: "The Royal Plaza",
    type: "Luxury Hotel",
    location: "Gangtok",
    description:
      "Premium accommodation with state-of-the-art facilities, rooftop dining, and personalized concierge services.",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    rating: 4.7,
    pricePerNight: 10000,
    amenities: ["Rooftop Restaurant", "Spa", "Gym", "Concierge", "City View"],
    rooms: 52,
  },
  {
    id: 9,
    name: "Mountain Lodge",
    type: "Budget Hotel",
    location: "Namchi",
    description:
      "Comfortable and affordable accommodation perfect for budget travelers seeking clean rooms and basic amenities.",
    image:
      "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80",
    rating: 4.2,
    pricePerNight: 1800,
    amenities: [
      "Free WiFi",
      "Hot Water",
      "Restaurant",
      "Travel Assistance",
      "Parking",
    ],
    rooms: 20,
  },
];

const AccommodationsPage = () => {
  const [filter, setFilter] = useState("All");

  const filteredAccommodations =
    filter === "All"
      ? accommodations
      : accommodations.filter((acc) => acc.type === filter);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/djsguxriw/image/upload/v1776186517/tiachen-aier-Yf9WoHnuqqs-unsplash_g5dqjm.jpg')`,
          }}
        />

        {/* Purple gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(102,126,234,0.6) 0%, rgba(118,75,162,0.6) 100%)",
          }}
        />

        {/* Radial dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.35) 100%)",
          }}
        />

        {/* Hero Content */}
        <div className="relative z-[2] text-center max-w-[1200px] px-8 animate-[fadeInUp_1s_ease-out]">
          {/* Badge */}
          <div className="inline-block px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold tracking-wider mb-8 border border-white/30 animate-pulse">
            🏨 STAY IN COMFORT
          </div>

          {/* Title */}
          <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-extrabold text-white mb-6 leading-[1.1] [text-shadow:_0_4px_20px_rgba(0,0,0,0.3)]">
            Perfect
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Accommodations
            </span>
            in Sikkim
          </h1>

          {/* Subtitle */}
          <p className="text-[clamp(1rem,2vw,1.25rem)] text-white/90 max-w-[700px] mx-auto mb-12 leading-relaxed">
            From luxury resorts to cozy homestays, find the perfect place to
            rest after your Himalayan adventures
          </p>

          {/* Feature Stats */}
          <div className="flex gap-8 justify-center flex-wrap mb-8 max-md:flex-col max-md:gap-4">
            <div className="flex items-center gap-3 text-white font-semibold px-6 py-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 transition-all duration-200 hover:-translate-y-1 hover:bg-white/15 hover:shadow-lg">
              <span className="text-3xl">🏨</span>
              <div className="text-left">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-white/80">Properties</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white font-semibold px-6 py-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 transition-all duration-200 hover:-translate-y-1 hover:bg-white/15 hover:shadow-lg">
              <span className="text-3xl">⭐</span>
              <div className="text-left">
                <div className="text-2xl font-bold">4.6/5</div>
                <div className="text-sm text-white/80">Avg Rating</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white font-semibold px-6 py-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 transition-all duration-200 hover:-translate-y-1 hover:bg-white/15 hover:shadow-lg">
              <span className="text-3xl">🛎️</span>
              <div className="text-left">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-white/80">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 px-4 bg-gradient-to-b from-slate-50 to-white top-16 z-10 border-b border-gray-200 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "All",
              "Luxury Resort",
              "Heritage Hotel",
              "Homestay",
              "Business Hotel",
              "Eco Resort",
              "Budget Hotel",
            ].map((category) => (
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

      {/* Accommodations Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 animate-[fadeInUp_1s_ease-out]">
            <span className="inline-block px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-semibold tracking-wide mb-6 shadow-lg">
              🌟 CURATED STAYS
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
              Find Your{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Perfect
              </span>
              <br />
              Mountain Retreat
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Handpicked accommodations offering comfort, stunning views, and
              authentic Himalayan hospitality for every budget
            </p>
          </div>

          {/* Accommodations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredAccommodations.map((accommodation, index) => (
              <div
                key={accommodation.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 border border-gray-200 hover:-translate-y-2 hover:shadow-2xl group animate-[fadeInUp_0.6s_ease-out] flex flex-col"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Accommodation Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={accommodation.image}
                    alt={accommodation.name}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 left-4 px-4 py-1 bg-blue-600/95 backdrop-blur-sm rounded-full text-xs font-semibold text-white shadow-md">
                    {accommodation.type}
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full font-semibold text-gray-800 shadow-md">
                    <span className="text-sm">⭐</span>
                    <span className="text-sm">{accommodation.rating}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white font-semibold text-sm flex items-center gap-1">
                    <span>📍</span>
                    <span>{accommodation.location}</span>
                  </div>
                </div>

                {/* Accommodation Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {accommodation.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4 min-h-[3em]">
                    {accommodation.description}
                  </p>

                  {/* Room Count */}
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-6 pb-6 border-b border-gray-200">
                    <span className="text-base">🛏️</span>
                    <span>{accommodation.rooms} Rooms Available</span>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {accommodation.amenities.slice(0, 4).map((amenity, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                    {accommodation.amenities.length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                        +{accommodation.amenities.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Footer with Price and Button */}
                  <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-auto">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-blue-600">
                        ₹{accommodation.pricePerNight.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-600">/night</span>
                    </div>
                    <Link to={"/accommodations/" + accommodation.id}>
                      <button
                        className="group/btn relative px-6 py-2 rounded-xl text-sm font-semibold tracking-wide text-white border-2 border-transparent shadow-sm transition-all duration-200 inline-flex items-center justify-center overflow-hidden hover:-translate-y-1 hover:shadow-xl active:-translate-y-0.5 active:shadow-lg focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-200 focus-visible:outline-offset-2"
                        style={{
                          background:
                            "linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)",
                        }}
                      >
                        <span className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-200 group-hover/btn:opacity-100" />
                        <span className="relative">Book Now</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredAccommodations.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">
                No accommodations found in this category.
              </p>
              <button
                onClick={() => setFilter("All")}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
              >
                View All Accommodations
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        className="relative py-24 px-4 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%201440%20320%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20fill-opacity%3D%221%22%20d%3D%22M0%2C96L48%2C112C96%2C128%2C192%2C160%2C288%2C160C384%2C160%2C480%2C128%2C576%2C122.7C672%2C117%2C768%2C139%2C864%2C144C960%2C149%2C1056%2C139%2C1152%2C128C1248%2C117%2C1344%2C107%2C1392%2C101.3L1440%2C96L1440%2C320L1392%2C320C1344%2C320%2C1248%2C320%2C1152%2C320C1056%2C320%2C960%2C320%2C864%2C320C768%2C320%2C672%2C320%2C576%2C320C480%2C320%2C384%2C320%2C288%2C320C192%2C320%2C96%2C320%2C48%2C320L0%2C320Z%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E')] bg-bottom bg-cover bg-no-repeat" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 [text-shadow:_0_4px_20px_rgba(0,0,0,0.3)]">
            Ready to Book Your
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Himalayan Retreat?
            </span>
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Secure the best rates and enjoy exceptional hospitality in the heart
            of Sikkim
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={"/contact"}>
              <button className="group px-10 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:bg-gray-50 hover:-translate-y-1 transition-all duration-200 shadow-xl inline-flex items-center justify-center">
                <span>Book Your Stay</span>
                <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </Link>
            <Link to={"/contact"}>
              <button className="px-10 py-4 bg-transparent text-white border-2 border-white rounded-xl font-semibold text-lg hover:bg-white/10 hover:-translate-y-1 transition-all duration-200 backdrop-blur-sm">
                Contact Support
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

export default AccommodationsPage;
