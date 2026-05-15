import { useState } from "react";
import { Link } from "react-router-dom";
import bikesData from "../../data/bikes";

export default function BikesListingPage() {
  const [selectedCity, setSelectedCity] = useState("All");

  const filteredBikes =
    selectedCity === "All"
      ? bikesData
      : bikesData.filter((b) => b.city === selectedCity);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* HERO — your existing hero stays exactly as is */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-bottom bg-no-repeat"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/djsguxriw/image/upload/v1776184323/536253660_18037263602689529_1526035111809747031_n_bb17dr.jpg')`,
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
        <div className="relative z-[2] text-center max-w-[1200px] px-8">
          <div className="inline-block px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold tracking-wider mb-8 border border-white/30 animate-pulse">
            🏍️ RIDE WITH US
          </div>

          <h1 className="text-[clamp(2.5rem,8vw,4rem)] font-extrabold text-white mb-6 leading-[1.05] [text-shadow:_0_4px_20px_rgba(0,0,0,0.3)]">
            Perfect
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Bikes
            </span>
            for Your Adventure
          </h1>

          <p className="text-[clamp(1rem,2vw,1.25rem)] text-white/90 max-w-[700px] mx-auto mb-12 leading-relaxed">
            Rent from a wide range of bikes and scooters to explore Sikkim at
            your pace.
          </p>

          <div className="flex gap-8 justify-center flex-wrap mb-8 max-md:flex-col max-md:gap-4">
            <div className="flex items-center gap-3 text-white font-semibold px-6 py-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <span className="text-3xl">🏍️</span>
              <div className="text-left">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm text-white/80">Bikes Available</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white font-semibold px-6 py-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <span className="text-3xl">⭐</span>
              <div className="text-left">
                <div className="text-2xl font-bold">4.6/5</div>
                <div className="text-sm text-white/80">Avg Rating</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white font-semibold px-6 py-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <span className="text-3xl">🛠️</span>
              <div className="text-left">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-white/80">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CITY FILTER BAR */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-3 overflow-x-auto scrollbar-hide">
          {["All", "Gangtok", "Singtam", "Namchi", "Majhitar"].map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap border transition-all ${
                selectedCity === city
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {city === "All" ? "🗺️ All Cities" : `📍 ${city}`}
            </button>
          ))}
        </div>
      </div>

      {/* BIKES GRID */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {filteredBikes.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-lg">
            No bikes available in {selectedCity}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBikes.map((bike) => (
              <div
                key={bike.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:-translate-y-1 transition-transform duration-200"
              >
                {/* IMAGE */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={bike.image}
                    alt={bike.bike_name}
                    className="w-full h-full object-cover"
                  />
                  {/* Availability badge — top left */}
                  <div
                    className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${
                      bike.availability <= 2
                        ? "bg-orange-100 text-orange-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {bike.availability <= 2
                      ? `⚠ Only ${bike.availability} left`
                      : `✓ ${bike.availability} available`}
                  </div>
                  {/* Rating badge — top right */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-yellow-600 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    ⭐ {bike.rating}
                  </div>
                </div>

                {/* CARD BODY */}
                <div className="p-5">
                  {/* Title + Company */}
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      {bike.bike_name}
                    </h3>
                    <p className="text-sm text-gray-400">{bike.company}</p>
                  </div>

                  {/* Meta badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                      📍 {bike.city}
                    </span>
                    <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                      👥 {bike.capacity} riders
                    </span>
                    <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                      ⚙️ {bike.engineCC}cc
                    </span>
                    <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                      🔧 {bike.transmission}
                    </span>
                    {bike.helmetIncluded && (
                      <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                        🪖 Helmet included
                      </span>
                    )}
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {bike.features.map((f) => (
                      <span
                        key={f}
                        className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100"
                      >
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* KM limit info */}
                  <p className="text-xs text-gray-400 mb-4">
                    🛣️ {bike.kmLimit} km/day · ₹{bike.extraKmCharge}/extra km
                  </p>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{bike.pricePerDay.toLocaleString("en-IN")}
                      </span>
                      <span className="text-sm text-gray-400">/day</span>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/gallery/bikes/${bike.id}`}
                        className="px-3 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 transition"
                      >
                        📷
                      </Link>
                      <Link
                        to={`/bikes/book/${bike.id}`}
                        className="px-4 py-2 rounded-xl text-white text-sm font-semibold"
                        style={{
                          background:
                            "linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)",
                        }}
                      >
                        Book now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
