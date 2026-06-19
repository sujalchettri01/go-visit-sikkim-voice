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

      {/* ── Hero Bar ── */}
      <div style={{ background: "linear-gradient(135deg, #1a1035 0%, #4c1d95 40%, #4338ca 100%)", position: "relative", overflow: "hidden" }}>

        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(124,58,237,0.2)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-60px", right: "120px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(79,70,229,0.15)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "20px", left: "40%", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />

        <div className="max-w-7xl mx-auto px-6 py-8" style={{ position: "relative", zIndex: 1 }}>

          {/* Tags */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            <span style={{ background: "#7C3AED", color: "#fff", fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px" }}>Bikes</span>
            <span style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)", fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px" }}>Sikkim</span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: "6px" }}>
            Rent a Bike in Sikkim
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginBottom: "20px" }}>
            Explore the Himalayas on two wheels
          </p>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[220px] max-w-xs">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontWeight: 600, fontSize: "14px", padding: "10px 36px 10px 16px", borderRadius: "12px", appearance: "none", cursor: "pointer", outline: "none" }}
              >
                <option value="" className="text-slate-800 bg-white">Choose a city...</option>
                {CITIES.map((c) => (
                  <option key={c} value={c} className="text-slate-800 bg-white">{c}</option>
                ))}
              </select>
              <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.6)", pointerEvents: "none", fontSize: "12px" }}>▾</span>
            </div>

            <button
              onClick={() => setApplied(selectedCity)}
              style={{ background: "linear-gradient(135deg, #fff 0%, #f0eaff 100%)", color: "#6d28d9", border: "none", padding: "10px 24px", borderRadius: "12px", fontSize: "14px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 4px 14px rgba(0,0,0,0.2)" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              Show Bikes →
            </button>

            {applied && (
              <button
                onClick={() => { setSelectedCity(""); setApplied(""); }}
                style={{ color: "rgba(255,255,255,0.6)", background: "none", border: "none", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}
              >
                ✕ Clear
              </button>
            )}
          </div>

          {applied && (
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", marginTop: "10px" }}>
              Showing bikes in <span style={{ color: "#fff", fontWeight: 700 }}>{applied}</span>
            </p>
          )}

          {/* Stats row */}
          <div style={{ display: "flex", gap: "24px", marginTop: "20px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            {[["6+", "Bike Models"], ["4", "Cities"], ["₹1,000", "Starting/day"]].map(([val, lbl]) => (
              <div key={lbl}>
                <div style={{ color: "#fff", fontSize: "16px", fontWeight: 800 }}>{val}</div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "11px", marginTop: "2px" }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BIKES GRID ── */}
      <div className="max-w-7xl mx-auto px-4 py-12">

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
                    {/* {bike.helmetIncluded && (
                      <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600">Helmet included</span>
                    )} */}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {bike.features && bike.features.map((f) => (
                      <span key={f} className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">{f}</span>
                    ))}
                  </div>

                  <p className="text-xs text-gray-400 mb-4">
                    {/* {bike.kmLimit} km/day · ₹{bike.extraKmCharge}/extra km */}
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
                        style={{ background: "linear-gradient(135deg, #4c1d95 0%, #4338ca 100%)" }}
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

        {/* ── CTA Banner ── */}
        <div className="mt-12 rounded-2xl overflow-hidden shadow-xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative"
          style={{ background: "linear-gradient(135deg, #2e1065 0%, #6d28d9 45%, #4338ca 100%)" }}>
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-40px", left: "40%", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

          <div className="relative z-10 text-white">
            <p className="text-xl font-bold">Ready to ride the Himalayas?</p>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>Book a bike and explore Sikkim at your own pace</p>
          </div>
          <div className="flex gap-3 shrink-0 flex-wrap justify-center relative z-10">
            <Link to="/destinations">
              <button className="px-6 py-2.5 font-semibold rounded-xl text-sm transition-all hover:-translate-y-0.5 shadow-lg"
                style={{ background: "linear-gradient(135deg, #fff 0%, #f0eaff 100%)", color: "#6d28d9" }}>
                Explore Destinations →
              </button>
            </Link>
            <Link to="/contact">
              <button className="px-6 py-2.5 font-semibold rounded-xl text-sm hover:-translate-y-0.5 transition-all text-white"
                style={{ border: "1.5px solid rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.1)" }}>
                Contact Us
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}