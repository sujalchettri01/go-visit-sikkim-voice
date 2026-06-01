import { useState } from "react";
import { Link } from "react-router-dom";
import bikesData from "../../data/bikes";

const CITIES = ["Gangtok", "Majhitar", "Singtam", "Namchi"];

export default function BikesListingPage() {
  const [selectedCity, setSelectedCity] = useState("");
  const [applied, setApplied] = useState("");

  const filteredBikes = applied
    ? bikesData.filter((b) => Array.isArray(b.city) ? b.city.includes(applied) : b.city === applied)
    : bikesData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">

      {/* ── City Picker Bar ── */}
      <div className="bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#6D28D9] shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-white/70 text-xs font-bold tracking-widest uppercase mb-4">
             Bike Rental in Sikkim
          </p>
          <div className="flex flex-wrap items-center gap-4">

            {/* Dropdown */}
            <div className="relative flex-1 min-w-[220px] max-w-xs">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full appearance-none bg-white/15 backdrop-blur-md text-white font-semibold text-sm px-4 py-3 pr-10 rounded-xl border border-white/30 focus:outline-none focus:border-white/60 cursor-pointer"
              >
                <option value="" className="text-slate-800 bg-white">Choose a city...</option>
                {CITIES.map((c) => (
                  <option key={c} value={c} className="text-slate-800 bg-white">{c}</option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none text-sm">▾</span>
            </div>

            {/* Show Bikes button */}
            <button
              onClick={() => setApplied(selectedCity)}
              className="px-8 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ background: "white", color: "#4F46E5", boxShadow: "0 4px 14px rgba(0,0,0,0.15)" }}
            >
              Show Bikes →
            </button>

            {/* Clear */}
            {applied && (
              <button
                onClick={() => { setSelectedCity(""); setApplied(""); }}
                className="text-white/70 hover:text-white text-sm font-medium transition-colors"
              >
                ✕ Clear
              </button>
            )}
          </div>

          {applied && (
            <p className="text-white/60 text-xs mt-3">
              Showing bikes in <span className="text-white font-semibold">{applied}</span>
            </p>
          )}
        </div>
      </div>

      {/* ── BIKES GRID ── */}
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Section heading */}
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-gray-800">
            {applied ? `Bikes in ${applied}` : "All Available Bikes"}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {filteredBikes.length} bike{filteredBikes.length !== 1 ? "s" : ""} found
            {applied ? ` in ${applied}` : " across all cities"}
          </p>
        </div>

        {filteredBikes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-5xl mb-4">🏍️</p>
            <p className="text-gray-600 font-semibold text-lg">No bikes available in {applied}</p>
            <p className="text-gray-400 text-sm mt-1 mb-5">Try a different city</p>
            <button
              onClick={() => { setSelectedCity(""); setApplied(""); }}
              className="px-6 py-2 rounded-full text-sm font-semibold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition"
            >
              View all bikes
            </button>
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
                  <div className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${bike.availability <= 2 ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
                    {bike.availability <= 2 ? `Only ${bike.availability} left` : `${bike.availability} available`}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-yellow-600 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    {bike.rating}
                  </div>
                </div>

                {/* CARD BODY */}
                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900">{bike.bike_name}</h3>
                    <p className="text-sm text-gray-400">{bike.company}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">{bike.capacity} riders</span>
                    <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">{bike.engineCC}cc</span>
                    <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">{bike.transmission}</span>
                    {bike.helmetIncluded && (
                      <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600">Helmet included</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {bike.features.map((f) => (
                      <span key={f} className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">{f}</span>
                    ))}
                  </div>

                  <p className="text-xs text-gray-400 mb-4">
                    {bike.kmLimit} km/day · ₹{bike.extraKmCharge}/extra km
                  </p>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">₹{bike.pricePerDay.toLocaleString("en-IN")}</span>
                      <span className="text-sm text-gray-400">/day</span>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/gallery/bikes/${bike.id}`} className="px-3 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 transition">Photos</Link>
                      <Link
                        to={`/bikes/book/${bike.id}`}
                        className="px-4 py-2 rounded-xl text-white text-sm font-semibold"
                        style={{ background: "linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)" }}
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