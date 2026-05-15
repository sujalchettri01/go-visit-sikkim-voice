import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import accommodations from "../../data/hotel";

const LOCATIONS = [
  "All",
  "Gangtok",
  "Pelling",
  "Lachung",
  "Namchi",
  "Yuksom",
  "Ravangla",
  "Rinchenpong",
];
const TYPES = [
  "All",
  "Luxury Resort",
  "Heritage Hotel",
  "Heritage Property",
  "Boutique Hotel",
  "Homestay",
  "Business Hotel",
  "Eco Resort",
  "Budget Hotel",
  "Wellness Resort",
];
const SORT_OPTIONS = [
  "Recommended",
  "Price: Low to High",
  "Price: High to Low",
  "Rating",
];
const PRICE_OPTIONS = [
  "Any Price",
  "Under ₹2,000",
  "₹2,000–₹5,000",
  "₹5,000–₹10,000",
  "Above ₹10,000",
];

const AMENITY_ICONS: Record<string, string> = {
  Spa: "🧖",
  WiFi: "📶",
  Pool: "🏊",
  Restaurant: "🍽️",
  Parking: "🅿️",
  "Mountain View": "⛰️",
  Gym: "💪",
  Bar: "🍸",
  Garden: "🌿",
  Yoga: "🧘",
  Bonfire: "🔥",
  Casino: "🎰",
  Library: "📚",
  Heater: "🔆",
  Breakfast: "🥐",
  Fitness: "💪",
  Conference: "🏢",
  Eco: "♻️",
  Organic: "🌱",
  Meditation: "🧘",
};

function getAmenityIcon(amenity: string) {
  for (const key of Object.keys(AMENITY_ICONS)) {
    if (amenity.toLowerCase().includes(key.toLowerCase()))
      return AMENITY_ICONS[key];
  }
  return "✓";
}

function getDiscount(price: number) {
  if (price >= 10000) return 25;
  if (price >= 7000) return 20;
  if (price >= 4000) return 15;
  if (price >= 2000) return 10;
  return 0;
}

function getRatingLabel(rating: number) {
  if (rating >= 4.5) return "Excellent";
  if (rating >= 4.0) return "Very Good";
  if (rating >= 3.5) return "Good";
  return "Average";
}

function getRatingColor(rating: number) {
  if (rating >= 4.5) return "#1a7a4a";
  if (rating >= 4.0) return "#2a7fc1";
  if (rating >= 3.5) return "#e07b2a";
  return "#888";
}

function getStars(type: string) {
  if (type.includes("Luxury") || type.includes("Heritage Hotel")) return 5;
  if (
    type.includes("Boutique") ||
    type.includes("Heritage Property") ||
    type.includes("Wellness")
  )
    return 4;
  if (type.includes("Business") || type.includes("Eco")) return 3;
  return 3;
}

const AccommodationsPage = () => {
  const [locationFilter, setLocationFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Recommended");
  const [maxPrice, setMaxPrice] = useState(20000);
  const [minRating, setMinRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showAllFiltersDrawer, setShowAllFiltersDrawer] = useState(false);
  const [priceLabel, setPriceLabel] = useState("Any Price");
  const [wishlist, setWishlist] = useState<number[]>([]);

  const toggleWishlist = (id: number) =>
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const toggleAmenity = (a: string) =>
    setSelectedAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );

  const activeFilterCount =
    selectedAmenities.length +
    (typeFilter !== "All" ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (maxPrice < 20000 ? 1 : 0);

  const handlePriceSelect = (label: string) => {
    setPriceLabel(label);
    setShowPriceDropdown(false);
    if (label === "Any Price") setMaxPrice(20000);
    else if (label === "Under ₹2,000") setMaxPrice(2000);
    else if (label === "₹2,000–₹5,000") setMaxPrice(5000);
    else if (label === "₹5,000–₹10,000") setMaxPrice(10000);
    else if (label === "Above ₹10,000") setMaxPrice(20000);
  };

  const AllFiltersContent = () => (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: 12,
            color: "#6b7280",
            marginBottom: 6,
            fontWeight: 600,
          }}
        >
          MAX PRICE / NIGHT
        </div>
        <input
          type="range"
          min={1000}
          max={20000}
          step={500}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          style={{ width: "100%", marginBottom: 4, accentColor: "#1d4ed8" }}
        />
        <div style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>
          Up to ₹{maxPrice.toLocaleString("en-IN")}
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: 12,
            color: "#6b7280",
            marginBottom: 8,
            fontWeight: 600,
          }}
        >
          GUEST RATING
        </div>
        {[4.5, 4.0, 3.5, 0].map((r) => (
          <label
            key={r}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 6,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            <input
              type="radio"
              name="rating"
              checked={minRating === r}
              onChange={() => setMinRating(r)}
              style={{ accentColor: "#1d4ed8" }}
            />
            <span style={{ color: "#374151" }}>
              {r > 0 ? `${r}+ ★` : "All ratings"}
            </span>
          </label>
        ))}
      </div>
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: 12,
            color: "#6b7280",
            marginBottom: 8,
            fontWeight: 600,
          }}
        >
          HOTEL TYPE
        </div>
        {TYPES.slice(1).map((t) => (
          <label
            key={t}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 6,
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            <input
              type="checkbox"
              checked={typeFilter === t}
              onChange={() => setTypeFilter(typeFilter === t ? "All" : t)}
              style={{ accentColor: "#1d4ed8" }}
            />
            <span style={{ color: "#374151" }}>{t}</span>
          </label>
        ))}
      </div>
      <div>
        <div
          style={{
            fontSize: 12,
            color: "#6b7280",
            marginBottom: 8,
            fontWeight: 600,
          }}
        >
          AMENITIES
        </div>
        {[
          "WiFi",
          "Parking",
          "Restaurant",
          "Mountain View",
          "Breakfast",
          "Pool",
          "Spa",
          "Gym",
        ].map((a) => (
          <label
            key={a}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 6,
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            <input
              type="checkbox"
              checked={selectedAmenities.includes(a)}
              onChange={() => toggleAmenity(a)}
              style={{ accentColor: "#1d4ed8" }}
            />
            <span style={{ color: "#374151" }}>{a}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const filtered = useMemo(() => {
    let list = [...accommodations];
    if (locationFilter !== "All") {
      list = list.filter((a: any) =>
        a.location.toLowerCase().includes(locationFilter.toLowerCase()),
      );
    }
    if (typeFilter !== "All")
      list = list.filter((a: any) => a.type === typeFilter);
    list = list.filter((a: any) => a.pricePerNight <= maxPrice);
    list = list.filter((a: any) => a.rating >= minRating);
    if (selectedAmenities.length > 0)
      list = list.filter((a: any) =>
        selectedAmenities.every((sa) =>
          a.amenities.some((am: string) =>
            am.toLowerCase().includes(sa.toLowerCase()),
          ),
        ),
      );
    if (sortBy === "Price: Low to High")
      list.sort((a: any, b: any) => a.pricePerNight - b.pricePerNight);
    else if (sortBy === "Price: High to Low")
      list.sort((a: any, b: any) => b.pricePerNight - a.pricePerNight);
    else if (sortBy === "Rating")
      list.sort((a: any, b: any) => b.rating - a.rating);
    return list;
  }, [
    locationFilter,
    typeFilter,
    sortBy,
    maxPrice,
    minRating,
    selectedAmenities,
  ]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f2f5",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* Hero */}
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

      {/* ── SINGLE STICKY BAR ── */}
      <div
        style={{
          
          background: "white",
          borderBottom: "1px solid #e5e7eb",
          boxShadow: "0 2px 10px rgba(0,0,0,0.10)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "10px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {/* Search inputs row */}
          <div
            style={{
              display: "flex",
              gap: 0,
              alignItems: "stretch",
              border: "1.5px solid #d1d5db",
              borderRadius: 10,
              overflow: "visible",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              background: "white",
            }}
          >
            {/* City */}
            <div
              style={{
                flex: 2,
                minWidth: 0,
                borderRight: "1px solid #e5e7eb",
                padding: "7px 14px",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: "#9ca3af",
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  marginBottom: 1,
                }}
              >
                CITY / AREA / PROPERTY
              </div>
              <div style={{ position: "relative" }}>
                <input
                  list="location-options"
                  value={locationFilter === "All" ? "" : locationFilter}
                  onChange={(e) => {
                    const value = e.target.value.replace(", Sikkim", "");

                    if (value.trim() === "") {
                      setLocationFilter("All");
                    } else {
                      setLocationFilter(value);
                    }
                  }}
                  placeholder="Type city, area or property"
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#111827",
                  }}
                />

                <datalist id="location-options">
                  {LOCATIONS.map((l) => (
                    <option
                      key={l}
                      value={
                        l === "All" ? "All Locations, Sikkim" : `${l}, Sikkim`
                      }
                    />
                  ))}
                </datalist>
              </div>
            </div>
            {/* Check-in */}
            <div
              style={{
                flex: 1.2,
                minWidth: 0,
                borderRight: "1px solid #e5e7eb",
                padding: "7px 14px",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: "#9ca3af",
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  marginBottom: 1,
                }}
              >
                CHECK-IN
              </div>
              <input
                type="date"
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#111827",
                  cursor: "pointer",
                }}
              />
            </div>
            {/* Check-out */}
            <div
              style={{
                flex: 1.2,
                minWidth: 0,
                borderRight: "1px solid #e5e7eb",
                padding: "7px 14px",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: "#9ca3af",
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  marginBottom: 1,
                }}
              >
                CHECK-OUT
              </div>
              <input
                type="date"
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#111827",
                  cursor: "pointer",
                }}
              />
            </div>
            {/* Rooms & Guests */}
            <div
              style={{
                flex: 1.3,
                minWidth: 0,
                borderRight: "1px solid #e5e7eb",
                padding: "7px 14px",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: "#9ca3af",
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  marginBottom: 1,
                }}
              >
                ROOMS & GUESTS
              </div>
              <div style={{ position: "relative" }}>
                <select
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#111827",
                    cursor: "pointer",
                    appearance: "none",
                    WebkitAppearance: "none",
                  }}
                >
                  <option>1 Room, 1 Adult</option>
                  <option>1 Room, 2 Adults</option>
                  <option>2 Rooms, 2 Adults</option>
                  <option>2 Rooms, 4 Adults</option>
                  <option>3 Rooms, 6 Adults</option>
                </select>
                <span
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    pointerEvents: "none",
                    fontSize: 11,
                  }}
                >
                  ▾
                </span>
              </div>
            </div>
            {/* SEARCH */}
            <button
              style={{
                background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                color: "white",
                border: "none",
                padding: "0 24px",
                fontSize: 14,
                fontWeight: 800,
                cursor: "pointer",
                letterSpacing: 0.5,
                flexShrink: 0,
                borderRadius: "0 8px 8px 0",
              }}
            >
              SEARCH
            </button>
          </div>

          {/* Filter pills row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              overflowX: "auto",
              paddingBottom: 2,
            }}
          >
            {/* Result count */}
            <span
              style={{
                fontSize: 12,
                color: "#6b7280",
                whiteSpace: "nowrap",
                fontWeight: 500,
                flexShrink: 0,
              }}
            >
              {filtered.length} properties
            </span>
            <div
              style={{
                width: 1,
                height: 16,
                background: "#e5e7eb",
                flexShrink: 0,
              }}
            />

            {/* Sort By */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <button
                onClick={() => {
                  setShowSortDropdown((p) => !p);
                  setShowPriceDropdown(false);
                  setShowLocationDropdown(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "5px 12px",
                  borderRadius: 999,
                  border:
                    sortBy !== "Recommended"
                      ? "1.5px solid #1d4ed8"
                      : "1px solid #d1d5db",
                  background: sortBy !== "Recommended" ? "#eff6ff" : "#fafafa",
                  color: sortBy !== "Recommended" ? "#1d4ed8" : "#374151",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                ↕ Sort{" "}
                {sortBy !== "Recommended"
                  ? `· ${sortBy.split(":")[0].trim()}`
                  : ""}
              </button>
              {showSortDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 6px)",
                    left: 0,
                    background: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    zIndex: 200,
                    minWidth: 210,
                    padding: 6,
                  }}
                >
                  {SORT_OPTIONS.map((s) => (
                    <div
                      key={s}
                      onClick={() => {
                        setSortBy(s);
                        setShowSortDropdown(false);
                      }}
                      style={{
                        padding: "8px 12px",
                        fontSize: 13,
                        cursor: "pointer",
                        borderRadius: 6,
                        background: sortBy === s ? "#eff6ff" : "transparent",
                        color: sortBy === s ? "#1d4ed8" : "#374151",
                        fontWeight: sortBy === s ? 600 : 400,
                      }}
                    >
                      {sortBy === s ? "✓ " : ""}
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* All Filters */}
            <button
              onClick={() => {
                setShowAllFiltersDrawer(true);
                setShowSortDropdown(false);
                setShowPriceDropdown(false);
                setShowLocationDropdown(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "5px 12px",
                borderRadius: 999,
                border:
                  activeFilterCount > 0
                    ? "1.5px solid #1d4ed8"
                    : "1px solid #d1d5db",
                background: activeFilterCount > 0 ? "#eff6ff" : "#fafafa",
                color: activeFilterCount > 0 ? "#1d4ed8" : "#374151",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              ≡ Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
            </button>

            {/* Price */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <button
                onClick={() => {
                  setShowPriceDropdown((p) => !p);
                  setShowSortDropdown(false);
                  setShowLocationDropdown(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "5px 12px",
                  borderRadius: 999,
                  border:
                    priceLabel !== "Any Price"
                      ? "1.5px solid #1d4ed8"
                      : "1px solid #d1d5db",
                  background:
                    priceLabel !== "Any Price" ? "#eff6ff" : "#fafafa",
                  color: priceLabel !== "Any Price" ? "#1d4ed8" : "#374151",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Price {priceLabel !== "Any Price" ? `· ${priceLabel}` : ""} ▾
              </button>
              {showPriceDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 6px)",
                    left: 0,
                    background: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    zIndex: 200,
                    minWidth: 200,
                    padding: 6,
                  }}
                >
                  {PRICE_OPTIONS.map((p) => (
                    <div
                      key={p}
                      onClick={() => handlePriceSelect(p)}
                      style={{
                        padding: "8px 12px",
                        fontSize: 13,
                        cursor: "pointer",
                        borderRadius: 6,
                        background:
                          priceLabel === p ? "#eff6ff" : "transparent",
                        color: priceLabel === p ? "#1d4ed8" : "#374151",
                        fontWeight: priceLabel === p ? 600 : 400,
                      }}
                    >
                      {priceLabel === p ? "✓ " : ""}
                      {p}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              style={{
                width: 1,
                height: 16,
                background: "#e5e7eb",
                flexShrink: 0,
              }}
            />

            {/* Location quick pills */}
            {LOCATIONS.slice(1).map((loc) => (
              <button
                key={loc}
                onClick={() =>
                  setLocationFilter(locationFilter === loc ? "All" : loc)
                }
                style={{
                  padding: "5px 12px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  background: locationFilter === loc ? "#1d4ed8" : "#fafafa",
                  color: locationFilter === loc ? "white" : "#374151",
                  border:
                    locationFilter === loc
                      ? "1.5px solid #1d4ed8"
                      : "1px solid #d1d5db",
                  transition: "all 0.15s",
                }}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOTEL CARDS ── */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {filtered.map((hotel: any) => {
          const discount = getDiscount(hotel.pricePerNight);
          const originalPrice =
            discount > 0
              ? Math.round(hotel.pricePerNight / (1 - discount / 100))
              : null;
          const taxes = Math.round(hotel.pricePerNight * 0.12);
          const ratingColor = getRatingColor(hotel.rating);
          const ratingLabel = getRatingLabel(hotel.rating);
          const stars = getStars(hotel.type);
          const reviewCount = Math.floor(hotel.rating * 14 + 10);
          const isWishlisted = wishlist.includes(hotel.id);
          const photoCount = hotel.amenities.length * 8 + hotel.rooms;
          const distanceKm = (Math.random() * 8 + 0.5).toFixed(1);

          return (
            <div
              key={hotel.id}
              style={{
                background: "white",
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid #e2e5ea",
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "row",
                transition: "box-shadow 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 4px 20px rgba(0,0,0,0.12)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 1px 6px rgba(0,0,0,0.06)")
              }
            >
              {/* LEFT: Image */}
              <div
                style={{
                  position: "relative",
                  width: 260,
                  minWidth: 260,
                  flexShrink: 0,
                }}
              >
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: 220,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                {/* Wishlist button */}
                <button
                  onClick={() => toggleWishlist(hotel.id)}
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: "rgba(255,255,255,0.9)",
                    border: "none",
                    borderRadius: "50%",
                    width: 34,
                    height: 34,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: 16,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                  }}
                >
                  {isWishlisted ? "❤️" : "🤍"}
                </button>
                {/* Photos count */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 10,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      background: "rgba(0,0,0,0.65)",
                      color: "white",
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "5px 12px",
                      borderRadius: 999,
                      backdropFilter: "blur(2px)",
                    }}
                  >
                    📷 {photoCount} Photos & Videos →
                  </div>
                </div>
              </div>

              {/* MIDDLE: Details */}
              <div
                style={{
                  flex: 1,
                  padding: "16px 18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  minWidth: 0,
                }}
              >
                {/* Type badge */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      background: "#f0f4ff",
                      color: "#1d4ed8",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "2px 10px",
                      borderRadius: 4,
                      border: "1px solid #c7d7fb",
                      letterSpacing: 0.3,
                    }}
                  >
                    {hotel.type.toUpperCase()}
                  </span>
                </div>

                {/* Hotel name + stars */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 19,
                        fontWeight: 800,
                        color: "#111827",
                      }}
                    >
                      {hotel.name}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        color: "#f59e0b",
                        letterSpacing: 1,
                      }}
                    >
                      {"★".repeat(stars)}
                      {"☆".repeat(5 - stars)}
                    </span>
                  </div>
                  {/* Location */}
                  <div style={{ fontSize: 13, marginTop: 3 }}>
                    <span style={{ color: "#1d4ed8", fontWeight: 600 }}>
                      {hotel.location}
                    </span>
                    <span style={{ color: "#9ca3af" }}>
                      {" "}
                      | {distanceKm} km from city centre
                    </span>
                  </div>
                </div>

                {/* Tags row */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <span
                    style={{
                      border: "1px solid #d1d5db",
                      color: "#374151",
                      fontSize: 12,
                      padding: "3px 10px",
                      borderRadius: 4,
                      fontWeight: 500,
                    }}
                  >
                    Couple Friendly
                  </span>
                  {hotel.roomTypes?.slice(0, 1).map((r: string) => (
                    <span
                      key={r}
                      style={{
                        border: "1px solid #d1d5db",
                        color: "#374151",
                        fontSize: 12,
                        padding: "3px 10px",
                        borderRadius: 4,
                        fontWeight: 500,
                      }}
                    >
                      {r}
                    </span>
                  ))}
                </div>

                {/* Highlights */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 4 }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 13,
                      color: "#16a34a",
                    }}
                  >
                    <span>✓</span>{" "}
                    <span style={{ fontWeight: 500 }}>Free Cancellation</span>
                  </div>
                  {discount > 0 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 13,
                        color: "#1d4ed8",
                      }}
                    >
                      <span>🏷</span>{" "}
                      <span style={{ fontWeight: 500 }}>
                        {discount}% off on total booking amount
                      </span>
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 13,
                      color: "#374151",
                    }}
                  >
                    <span style={{ color: "#7c3aed" }}>✦</span>
                    <span style={{ color: "#555" }}>
                      {hotel.shortDescription}
                    </span>
                  </div>
                </div>

                {/* Amenities */}
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                    marginTop: 2,
                  }}
                >
                  {hotel.amenities.slice(0, 5).map((a: string, i: number) => (
                    <span
                      key={i}
                      style={{
                        background: "#f9fafb",
                        color: "#374151",
                        fontSize: 11,
                        padding: "3px 8px",
                        borderRadius: 5,
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      {getAmenityIcon(a)} {a}
                    </span>
                  ))}
                  {hotel.amenities.length > 5 && (
                    <span
                      style={{
                        fontSize: 11,
                        color: "#6b7280",
                        padding: "3px 0",
                      }}
                    >
                      +{hotel.amenities.length - 5} more
                    </span>
                  )}
                </div>

                {/* Nearby */}
                {hotel.nearbyAttractions?.[0] && (
                  <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                    📍 Near: {hotel.nearbyAttractions[0]}
                  </div>
                )}
              </div>

              {/* RIGHT: Price + actions */}
              <div
                style={{
                  width: 200,
                  minWidth: 180,
                  flexShrink: 0,
                  padding: "16px 18px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  borderLeft: "1px solid #f0f0f0",
                }}
              >
                <div style={{ textAlign: "right" }}>
                  {/* Rating */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      justifyContent: "flex-end",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        color: ratingColor,
                        fontWeight: 700,
                      }}
                    >
                      {ratingLabel}
                    </span>
                    <div
                      style={{
                        background: ratingColor,
                        color: "white",
                        fontSize: 13,
                        fontWeight: 800,
                        padding: "3px 8px",
                        borderRadius: 6,
                      }}
                    >
                      {hotel.rating}
                    </div>
                  </div>
                  <div
                    style={{ fontSize: 12, color: "#9ca3af", marginBottom: 14 }}
                  >
                    ({reviewCount} Ratings)
                  </div>

                  {/* Price */}
                  {originalPrice && (
                    <div
                      style={{
                        fontSize: 14,
                        color: "#9ca3af",
                        textDecoration: "line-through",
                      }}
                    >
                      ₹ {originalPrice.toLocaleString("en-IN")}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 900,
                      color: "#111827",
                      lineHeight: 1.1,
                    }}
                  >
                    ₹ {hotel.pricePerNight.toLocaleString("en-IN")}
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                    + ₹ {taxes.toLocaleString("en-IN")} taxes & fees
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>
                    Per Night
                  </div>
                </div>

                {/* Buttons */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    width: "100%",
                    marginTop: 12,
                  }}
                >
                  <Link
                    to={`/accommodations/${hotel.id}`}
                    style={{ width: "100%" }}
                  >
                    <button
                      style={{
                        width: "100%",
                        background: "linear-gradient(135deg,#1d4ed8,#7c3aed)",
                        color: "white",
                        border: "none",
                        borderRadius: 8,
                        padding: "10px 0",
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      View Rooms →
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "white",
              borderRadius: 12,
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏨</div>
            <p style={{ fontSize: 16, color: "#6b7280", marginBottom: 16 }}>
              No accommodations match your filters.
            </p>
            <button
              onClick={() => {
                setLocationFilter("All");
                setTypeFilter("All");
                setMaxPrice(20000);
                setMinRating(0);
                setSelectedAmenities([]);
                setPriceLabel("Any Price");
              }}
              style={{
                background: "#1d4ed8",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "10px 24px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* All Filters Drawer */}
      {showAllFiltersDrawer && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            background: "rgba(0,0,0,0.5)",
          }}
          onClick={() => setShowAllFiltersDrawer(false)}
        >
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "white",
              borderRadius: "20px 20px 0 0",
              padding: 20,
              maxHeight: "85vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>
                All Filters
              </span>
              <button
                onClick={() => setShowAllFiltersDrawer(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 24,
                  cursor: "pointer",
                  color: "#374151",
                }}
              >
                ×
              </button>
            </div>
            <AllFiltersContent />
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button
                onClick={() => {
                  setTypeFilter("All");
                  setMaxPrice(20000);
                  setMinRating(0);
                  setSelectedAmenities([]);
                  setPriceLabel("Any Price");
                }}
                style={{
                  flex: 1,
                  background: "white",
                  color: "#374151",
                  border: "1px solid #d1d5db",
                  borderRadius: 10,
                  padding: "12px 0",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Clear All
              </button>
              <button
                onClick={() => setShowAllFiltersDrawer(false)}
                style={{
                  flex: 2,
                  background: "linear-gradient(135deg,#1d4ed8,#7c3aed)",
                  color: "white",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 0",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {(showSortDropdown || showPriceDropdown || showLocationDropdown) && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 99 }}
          onClick={() => {
            setShowSortDropdown(false);
            setShowPriceDropdown(false);
            setShowLocationDropdown(false);
          }}
        />
      )}

      {/* CTA */}
      <section
        style={{
          background: "linear-gradient(135deg,#667eea,#764ba2)",
          padding: "60px 20px",
          textAlign: "center",
          marginTop: 40,
        }}
      >
        <h2
          style={{
            fontSize: "clamp(1.8rem,4vw,2.8rem)",
            fontWeight: 800,
            color: "white",
            marginBottom: 12,
          }}
        >
          Ready to Book Your
          <br />
          <span
            style={{
              background: "linear-gradient(90deg,#fbbf24,#f97316)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Himalayan Retreat?
          </span>
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: 16,
            marginBottom: 28,
          }}
        >
          Secure the best rates with exceptional Himalayan hospitality
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link to="/contact">
            <button
              style={{
                background: "white",
                color: "#7c3aed",
                border: "none",
                borderRadius: 10,
                padding: "12px 32px",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Book Your Stay →
            </button>
          </Link>
          <Link to="/contact">
            <button
              style={{
                background: "transparent",
                color: "white",
                border: "2px solid white",
                borderRadius: 10,
                padding: "12px 32px",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Contact Support
            </button>
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 700px) {
          div[style*="flexDirection: row"] {
            flex-direction: column !important;
          }
          div[style*="width: 260px"] {
            width: 100% !important;
            min-width: unset !important;
          }
          div[style*="width: 200px"] {
            width: 100% !important;
            min-width: unset !important;
            border-left: none !important;
            border-top: 1px solid #f0f0f0 !important;
            align-items: flex-start !important;
          }
        }
        div[style*="overflowX: auto"]::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default AccommodationsPage;
