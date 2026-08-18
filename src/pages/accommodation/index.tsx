import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import accommodations from "../../data/hotel";

const LOCATIONS = ["All","Gangtok","Pelling","Lachung","Namchi","Yuksom","Ravangla","Rinchenpong"];
const TYPES = ["All","Luxury Resort","Heritage Hotel","Heritage Property","Boutique Hotel","Homestay","Business Hotel","Eco Resort","Budget Hotel","Wellness Resort"];
const SORT_OPTIONS = ["Recommended","Price: Low to High","Price: High to Low","Rating"];
const PRICE_OPTIONS = ["Any Price","Under ₹2,000","₹2,000–₹5,000","₹5,000–₹10,000","Above ₹10,000"];

const AMENITY_ICONS: Record<string, string> = {
  Spa:"",WiFi:"",Pool:"",Restaurant:"",Parking:"","Mountain View":"",
  Gym:"",Bar:"",Garden:"",Yoga:"",Bonfire:"",Casino:"",Library:"",
  Heater:"",Breakfast:"",Fitness:"",Conference:"",Eco:"",Organic:"",Meditation:"",
};

function getAmenityIcon(amenity: string) {
  for (const key of Object.keys(AMENITY_ICONS)) {
    if (amenity.toLowerCase().includes(key.toLowerCase())) return AMENITY_ICONS[key];
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
  if (type.includes("Boutique") || type.includes("Heritage Property") || type.includes("Wellness")) return 4;
  return 3;
}

const AccommodationsPage = () => {
  const [locationFilter, setLocationFilter] = useState("All");
  const [locationDraft, setLocationDraft] = useState("All");
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
    setWishlist((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const toggleAmenity = (a: string) =>
    setSelectedAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);

  const activeFilterCount =
    selectedAmenities.length + (typeFilter !== "All" ? 1 : 0) + (minRating > 0 ? 1 : 0) + (maxPrice < 20000 ? 1 : 0);

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
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6, fontWeight: 600 }}>MAX PRICE / NIGHT</div>
        <input type="range" min={1000} max={20000} step={500} value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          style={{ width: "100%", marginBottom: 4, accentColor: "#1d4ed8" }} />
        <div style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>Up to ₹{maxPrice.toLocaleString("en-IN")}</div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8, fontWeight: 600 }}>GUEST RATING</div>
        {[4.5, 4.0, 3.5, 0].map((r) => (
          <label key={r} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, cursor: "pointer", fontSize: 13 }}>
            <input type="radio" name="rating" checked={minRating === r} onChange={() => setMinRating(r)} style={{ accentColor: "#1d4ed8" }} />
            <span style={{ color: "#374151" }}>{r > 0 ? `${r}+ ★` : "All ratings"}</span>
          </label>
        ))}
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8, fontWeight: 600 }}>HOTEL TYPE</div>
        {TYPES.slice(1).map((t) => (
          <label key={t} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, cursor: "pointer", fontSize: 12 }}>
            <input type="checkbox" checked={typeFilter === t} onChange={() => setTypeFilter(typeFilter === t ? "All" : t)} style={{ accentColor: "#1d4ed8" }} />
            <span style={{ color: "#374151" }}>{t}</span>
          </label>
        ))}
      </div>
      <div>
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8, fontWeight: 600 }}>AMENITIES</div>
        {["WiFi","Parking","Restaurant","Mountain View","Breakfast","Pool","Spa","Gym"].map((a) => (
          <label key={a} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, cursor: "pointer", fontSize: 12 }}>
            <input type="checkbox" checked={selectedAmenities.includes(a)} onChange={() => toggleAmenity(a)} style={{ accentColor: "#1d4ed8" }} />
            <span style={{ color: "#374151" }}>{a}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const filtered = useMemo(() => {
    let list = [...accommodations];
    if (locationFilter !== "All") list = list.filter((a: any) => a.location.toLowerCase().includes(locationFilter.toLowerCase()));
    if (typeFilter !== "All") list = list.filter((a: any) => a.type === typeFilter);
    list = list.filter((a: any) => a.pricePerNight <= maxPrice);
    list = list.filter((a: any) => a.rating >= minRating);
    if (selectedAmenities.length > 0)
      list = list.filter((a: any) => selectedAmenities.every((sa) => a.amenities.some((am: string) => am.toLowerCase().includes(sa.toLowerCase()))));
    if (sortBy === "Price: Low to High") list.sort((a: any, b: any) => a.pricePerNight - b.pricePerNight);
    else if (sortBy === "Price: High to Low") list.sort((a: any, b: any) => b.pricePerNight - a.pricePerNight);
    else if (sortBy === "Rating") list.sort((a: any, b: any) => b.rating - a.rating);
    return list;
  }, [locationFilter, typeFilter, sortBy, maxPrice, minRating, selectedAmenities]);

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ── DARK HERO BAR ── */}
      <div style={{ background: "linear-gradient(135deg, #1a1035 0%, #4c1d95 40%, #4338ca 100%)", position: "relative", overflow: "hidden" }}>

        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "260px", height: "260px", borderRadius: "50%", background: "rgba(124,58,237,0.2)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-60px", right: "160px", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(79,70,229,0.15)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30px", left: "38%", width: "90px", height: "90px", borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 20px 0", position: "relative", zIndex: 1 }}>

          {/* Tags */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "14px", justifyContent: "center" }}>
            <span style={{ background: "#7C3AED", color: "#fff", fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px" }}>Hotels</span>
            <span style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)", fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px" }}>Sikkim</span>
          </div>

          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: "6px" }}>
            <h2 style={{ color: "#fff", fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 800, margin: 0, letterSpacing: 0.3 }}>
              Find Hotels in <span style={{ color: "#a78bfa" }}>Sikkim</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, marginTop: 6, marginBottom: 0 }}>Handpicked stays across the Himalayas</p>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: "32px", justifyContent: "center", marginTop: "20px", marginBottom: "28px" }}>
            {[["10+", "Properties"], ["7", "Locations"], ["₹2,000", "Starting/night"]].map(([val, lbl]) => (
              <div key={lbl} style={{ textAlign: "center" }}>
                <div style={{ color: "#fff", fontSize: "18px", fontWeight: 800 }}>{val}</div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "11px", marginTop: "2px" }}>{lbl}</div>
              </div>
            ))}
          </div>

          {/* Search card */}
          <div style={{ background: "white", borderRadius: "16px 16px 0 0", padding: "12px", overflow: "hidden", boxShadow: "0 -4px 20px rgba(0,0,0,0.2)" }}>
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 14px", marginBottom: 8 }}>
              <div style={{ fontSize: 9, color: "#7C3AED", fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>City, Area or Property</div>
              <input list="location-options"
                value={locationDraft === "All" ? "" : locationDraft}
                onChange={(e) => { const value = e.target.value.replace(", Sikkim", ""); setLocationDraft(value.trim() === "" ? "All" : value); }}
                onKeyDown={(e) => { if (e.key === "Enter") setLocationFilter(locationDraft); }}
                placeholder="Where do you want to stay?"
                style={{ width: "100%", border: "none", outline: "none", background: "transparent", fontSize: 14, fontWeight: 700, color: "#1a1a2e", padding: 0 }} />
              <datalist id="location-options">
                {LOCATIONS.map((l) => (<option key={l} value={l === "All" ? "All Locations, Sikkim" : `${l}, Sikkim`} />))}
              </datalist>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <div style={{ flex: 1, border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 14px" }}>
                <div style={{ fontSize: 9, color: "#7C3AED", fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>Check-In</div>
                <input type="date" style={{ width: "100%", border: "none", outline: "none", background: "transparent", fontSize: 13, fontWeight: 700, color: "#1a1a2e", padding: 0 }} />
              </div>
              <div style={{ flex: 1, border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 14px" }}>
                <div style={{ fontSize: 9, color: "#7C3AED", fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>Check-Out</div>
                <input type="date" style={{ width: "100%", border: "none", outline: "none", background: "transparent", fontSize: 13, fontWeight: 700, color: "#1a1a2e", padding: 0 }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1, border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 14px" }}>
                <div style={{ fontSize: 9, color: "#7C3AED", fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>Rooms & Guests</div>
                <select style={{ width: "100%", border: "none", outline: "none", background: "transparent", fontSize: 13, fontWeight: 700, color: "#1a1a2e", cursor: "pointer", appearance: "none", WebkitAppearance: "none", padding: 0 }}>
                  <option>1 Room, 1 Adult</option>
                  <option>1 Room, 2 Adults</option>
                  <option>2 Rooms, 2 Adults</option>
                  <option>2 Rooms, 4 Adults</option>
                  <option>3 Rooms, 6 Adults</option>
                </select>
              </div>
              <button onClick={() => setLocationFilter(locationDraft)}
                style={{ background: "linear-gradient(135deg, #2563eb 0%, #9333ea 100%)", color: "#fff", border: "none", borderRadius: 10, padding: "0 24px", fontSize: 14, fontWeight: 800, cursor: "pointer", flexShrink: 0, minWidth: 90, boxShadow: "0 4px 14px rgba(124,58,237,0.35)" }}>
                SEARCH
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter pills row ── */}
      <div style={{ background: "#f0f2f5" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 6, overflowX: "auto", padding: "10px 20px 12px" }}>
          <span style={{ fontSize: 12, color: "#6b7280", whiteSpace: "nowrap", fontWeight: 500, flexShrink: 0 }}>{filtered.length} properties</span>
          <div style={{ width: 1, height: 16, background: "#e5e7eb", flexShrink: 0 }} />
          <div style={{ position: "relative", flexShrink: 0 }}>
            <button onClick={() => { setShowSortDropdown((p) => !p); setShowPriceDropdown(false); setShowLocationDropdown(false); }}
              style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 999, border: sortBy !== "Recommended" ? "1.5px solid #1d4ed8" : "1px solid #d1d5db", background: sortBy !== "Recommended" ? "#eff6ff" : "#fafafa", color: sortBy !== "Recommended" ? "#1d4ed8" : "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
              ↕ Sort {sortBy !== "Recommended" ? `· ${sortBy.split(":")[0].trim()}` : ""}
            </button>
            {showSortDropdown && (
              <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, background: "white", border: "1px solid #e5e7eb", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 200, minWidth: 210, padding: 6 }}>
                {SORT_OPTIONS.map((s) => (
                  <div key={s} onClick={() => { setSortBy(s); setShowSortDropdown(false); }}
                    style={{ padding: "8px 12px", fontSize: 13, cursor: "pointer", borderRadius: 6, background: sortBy === s ? "#eff6ff" : "transparent", color: sortBy === s ? "#1d4ed8" : "#374151", fontWeight: sortBy === s ? 600 : 400 }}>
                    {sortBy === s ? "✓ " : ""}{s}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => { setShowAllFiltersDrawer(true); setShowSortDropdown(false); setShowPriceDropdown(false); setShowLocationDropdown(false); }}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 999, border: activeFilterCount > 0 ? "1.5px solid #1d4ed8" : "1px solid #d1d5db", background: activeFilterCount > 0 ? "#eff6ff" : "#fafafa", color: activeFilterCount > 0 ? "#1d4ed8" : "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
            ≡ Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
          </button>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <button onClick={() => { setShowPriceDropdown((p) => !p); setShowSortDropdown(false); setShowLocationDropdown(false); }}
              style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 999, border: priceLabel !== "Any Price" ? "1.5px solid #1d4ed8" : "1px solid #d1d5db", background: priceLabel !== "Any Price" ? "#eff6ff" : "#fafafa", color: priceLabel !== "Any Price" ? "#1d4ed8" : "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
              Price {priceLabel !== "Any Price" ? `· ${priceLabel}` : ""} ▾
            </button>
            {showPriceDropdown && (
              <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, background: "white", border: "1px solid #e5e7eb", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 200, minWidth: 200, padding: 6 }}>
                {PRICE_OPTIONS.map((p) => (
                  <div key={p} onClick={() => handlePriceSelect(p)}
                    style={{ padding: "8px 12px", fontSize: 13, cursor: "pointer", borderRadius: 6, background: priceLabel === p ? "#eff6ff" : "transparent", color: priceLabel === p ? "#1d4ed8" : "#374151", fontWeight: priceLabel === p ? 600 : 400 }}>
                    {priceLabel === p ? "✓ " : ""}{p}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ width: 1, height: 16, background: "#e5e7eb", flexShrink: 0 }} />
          {LOCATIONS.slice(1).map((loc) => (
            <button key={loc} onClick={() => { const next = locationFilter === loc ? "All" : loc; setLocationFilter(next); setLocationDraft(next); }}
              style={{ padding: "5px 12px", borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, background: locationFilter === loc ? "#1d4ed8" : "#fafafa", color: locationFilter === loc ? "white" : "#374151", border: locationFilter === loc ? "1.5px solid #1d4ed8" : "1px solid #d1d5db", transition: "all 0.15s" }}>
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* ── HOTEL CARDS ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
        {filtered.map((hotel: any) => {
          const discount = getDiscount(hotel.pricePerNight);
          const originalPrice = discount > 0 ? Math.round(hotel.pricePerNight / (1 - discount / 100)) : null;
          const taxes = Math.round(hotel.pricePerNight * 0.12);
          const ratingColor = getRatingColor(hotel.rating);
          const ratingLabel = getRatingLabel(hotel.rating);
          const stars = getStars(hotel.type);
          const reviewCount = Math.floor(hotel.rating * 14 + 10);
          const isWishlisted = wishlist.includes(hotel.id);

          return (
            <div key={hotel.id} className="hotel-card">
              <div className="hotel-card-image">
                <img src={hotel.image} alt={hotel.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <button onClick={() => toggleWishlist(hotel.id)}
                  style={{ position: "absolute", top: 10, right: 10, background: "rgba(255,255,255,0.92)", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 15, boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }}>
                  {isWishlisted ? "❤️" : "🤍"}
                </button>
                {discount > 0 && (
                  <div style={{ position: "absolute", top: 10, left: 10, background: "#16a34a", color: "white", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 5 }}>
                    {discount}% OFF
                  </div>
                )}
              </div>
              <div className="hotel-card-body">
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                      <span style={{ fontSize: 10, color: "#1d4ed8", fontWeight: 700, background: "#eff6ff", border: "1px solid #c7d7fb", borderRadius: 3, padding: "1px 6px", letterSpacing: 0.3 }}>
                        {hotel.type.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>{hotel.name}</div>
                    <div style={{ fontSize: 12, color: "#f59e0b", marginTop: 1 }}>{"★".repeat(stars)}{"☆".repeat(5 - stars)}</div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                      <span style={{ color: "#1d4ed8", fontWeight: 600 }}>{hotel.location}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <div style={{ background: ratingColor, color: "white", fontSize: 14, fontWeight: 800, padding: "4px 9px", borderRadius: 7, marginBottom: 2 }}>{hotel.rating}</div>
                    <div style={{ fontSize: 10, color: ratingColor, fontWeight: 600 }}>{ratingLabel}</div>
                    <div style={{ fontSize: 10, color: "#9ca3af" }}>{reviewCount} reviews</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 8 }}>
                  {hotel.amenities.slice(0, 4).map((a: string, i: number) => (
                    <span key={i} style={{ background: "#f9fafb", color: "#374151", fontSize: 10, padding: "2px 7px", borderRadius: 4, border: "1px solid #e5e7eb" }}>
                      {getAmenityIcon(a)} {a}
                    </span>
                  ))}
                  {hotel.amenities.length > 4 && <span style={{ fontSize: 10, color: "#6b7280" }}>+{hotel.amenities.length - 4} more</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6, fontSize: 12, color: "#16a34a", fontWeight: 500 }}>
                  <span>✓</span><span>Free Cancellation</span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: "1px solid #f3f4f6" }}>
                  <div>
                    {originalPrice && (
                      <div style={{ fontSize: 12, color: "#9ca3af", textDecoration: "line-through" }}>₹{originalPrice.toLocaleString("en-IN")}</div>
                    )}
                    <div style={{ fontSize: 22, fontWeight: 900, color: "#111827", lineHeight: 1 }}>
                      ₹{hotel.pricePerNight.toLocaleString("en-IN")}
                    </div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>+₹{taxes.toLocaleString("en-IN")} taxes · per night</div>
                  </div>
                  <Link to={`/accommodations/${hotel.id}`}>
                    <button style={{ background: "linear-gradient(135deg,#1d4ed8,#7c3aed)", color: "white", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                      View Rooms →
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 12 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}></div>
            <p style={{ fontSize: 16, color: "#6b7280", marginBottom: 16 }}>No accommodations match your filters.</p>
            <button onClick={() => { setLocationFilter("All"); setLocationDraft("All"); setTypeFilter("All"); setMaxPrice(20000); setMinRating(0); setSelectedAmenities([]); setPriceLabel("Any Price"); }}
              style={{ background: "#1d4ed8", color: "white", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 600, cursor: "pointer" }}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* All Filters Drawer */}
      {showAllFiltersDrawer && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.5)" }} onClick={() => setShowAllFiltersDrawer(false)}>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "white", borderRadius: "20px 20px 0 0", padding: 20, maxHeight: "85vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>All Filters</span>
              <button onClick={() => setShowAllFiltersDrawer(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#374151" }}>×</button>
            </div>
            <AllFiltersContent />
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => { setTypeFilter("All"); setMaxPrice(20000); setMinRating(0); setSelectedAmenities([]); setPriceLabel("Any Price"); }}
                style={{ flex: 1, background: "white", color: "#374151", border: "1px solid #d1d5db", borderRadius: 10, padding: "12px 0", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                Clear All
              </button>
              <button onClick={() => setShowAllFiltersDrawer(false)}
                style={{ flex: 2, background: "linear-gradient(135deg,#1d4ed8,#7c3aed)", color: "white", border: "none", borderRadius: 10, padding: "12px 0", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {(showSortDropdown || showPriceDropdown || showLocationDropdown) && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99 }} onClick={() => { setShowSortDropdown(false); setShowPriceDropdown(false); setShowLocationDropdown(false); }} />
      )}

      {/* ── CTA — rich gradient matching cabs page ── */}
      <section style={{ position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #2e1065 0%, #6d28d9 45%, #4338ca 100%)", padding: "60px 20px", textAlign: "center", marginTop: 40 }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-50px", left: "30%", width: "150px", height: "150px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, color: "white", marginBottom: 12 }}>
            Ready to Book Your<br />
            <span style={{ background: "linear-gradient(90deg,#fbbf24,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Himalayan Retreat?
            </span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16, marginBottom: 28 }}>Secure the best rates with exceptional Himalayan hospitality</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/contact">
              <button style={{ background: "linear-gradient(135deg, #fff 0%, #f0eaff 100%)", color: "#6d28d9", border: "none", borderRadius: 10, padding: "12px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.2)" }}>
                Book Your Stay →
              </button>
            </Link>
            <Link to="/contact">
              <button style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1.5px solid rgba(255,255,255,0.4)", borderRadius: 10, padding: "12px 32px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                Contact Support
              </button>
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .hotel-card {
          background: white;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid #e2e5ea;
          box-shadow: 0 1px 6px rgba(0,0,0,0.06);
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.2s;
        }
        .hotel-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.12); }
        .hotel-card-image {
          position: relative;
          width: 100%;
          height: 200px;
          flex-shrink: 0;
          overflow: hidden;
        }
        .hotel-card-body {
          padding: 14px 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 768px) {
          .hotel-card { flex-direction: row; }
          .hotel-card-image { width: 260px; height: auto; min-height: 220px; }
          .hotel-card-body { padding: 18px 20px; }
        }
        div[style*="overflowX: auto"]::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default AccommodationsPage;