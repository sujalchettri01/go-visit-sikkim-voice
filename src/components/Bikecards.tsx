import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export interface Bike {
  id: string;
  bike_name: string;
  company: string;
  city: string;
  pricePerDay: number;
  engineCC: number;
  fuelType: string;
  transmission: string;
  helmetIncluded: boolean;
  kmLimit: number;
  rating: number;
  features: string[];
  image: string;
  availability: number;
}

interface BikeCardsProps {
  bikes: Bike[];
  city?: string;
}

export default function BikeCards({ bikes, city = "Sikkim"  }: BikeCardsProps) {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  if (!bikes || bikes.length === 0) return null;
  
  const scrollTo = (idx: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ left: idx * 210, behavior: "smooth" });
    setCurrent(idx);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    setCurrent(Math.round(scrollRef.current.scrollLeft / 210));
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}></div>
          <div>
            <div style={styles.headerTitle}>Bikes available in {city}</div>
            <div style={styles.headerDate}>{dateStr}</div>
          </div>
        </div>
        <button style={styles.viewAllBtn} onClick={() => navigate("/bikes")}>
          View All
          <span style={styles.viewAllArrow}>›</span>
        </button>
      </div>

      {/* Horizontal scroll */}
      <div ref={scrollRef} style={styles.scrollTrack} onScroll={handleScroll}>
        {bikes.map((bike) => (
          <div
            key={bike.id}
            style={styles.card}
            onClick={() => navigate(`/bikes/book/${bike.id}`)}
          >
            {/* Image */}
            <div style={styles.imageWrap}>
              <img src={bike.image} alt={bike.bike_name} style={styles.image} />
              {/* Availability badge */}
              <span style={{
                ...styles.availBadge,
                background: bike.availability <= 2 ? "#7C3AED" : "#22c55e",
              }}>
                {bike.availability <= 2 ? `⚡ ${bike.availability} left` : "✓ Available"}
              </span>
              {/* Transmission badge */}
              <span style={styles.transBadge}>{bike.transmission}</span>
            </div>

            {/* Info */}
            <div style={styles.cardInfo}>
              <div style={styles.cardName}>{bike.bike_name}</div>
              <div style={styles.company}>{bike.company} · {bike.city}</div>

              {/* Specs */}
              <div style={styles.specsRow}>
                <span style={styles.spec}>⚙️ {bike.engineCC}cc</span>
                <span style={styles.spec}>⛽ {bike.fuelType}</span>
                {bike.helmetIncluded && <span style={styles.spec}>⛑️ Helmet</span>}
              </div>

              {/* Features */}
              <div style={styles.chips}>
                {bike.features.slice(0, 2).map((f, i) => (
                  <span key={i} style={styles.chip}>{f}</span>
                ))}
              </div>

              {/* KM limit */}
              <div style={styles.kmRow}>🛣️ {bike.kmLimit} km/day limit</div>

              {/* Price + rating */}
              <div style={styles.priceRow}>
                <div>
                  {bike.pricePerDay > 1 ? (
                    <>
                      <span style={styles.price}>₹{bike.pricePerDay.toLocaleString()}</span>
                      <span style={styles.perDay}>/day</span>
                    </>
                  ) : (
                    <span style={styles.price}>On Request</span>
                  )}
                </div>
                <span style={styles.rating}>⭐ {bike.rating}</span>
              </div>

              <button
                style={styles.bookBtn}
                onClick={(e) => { e.stopPropagation(); navigate(`/bikes/book/${bike.id}`); }}
              >
                Book Now →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dots + arrows */}
      <div style={styles.dotsRow}>
        <button
          style={{ ...styles.arrowBtn, opacity: current === 0 ? 0.3 : 1 }}
          onClick={() => scrollTo(Math.max(0, current - 1))}
          disabled={current === 0}
        >‹</button>
        <div style={styles.dots}>
          {bikes.map((_, i) => (
            <span
              key={i}
              style={{ ...styles.dot, ...(i === current ? styles.dotActive : {}) }}
              onClick={() => scrollTo(i)}
            />
          ))}
        </div>
        <button
          style={{ ...styles.arrowBtn, opacity: current === bikes.length - 1 ? 0.3 : 1 }}
          onClick={() => scrollTo(Math.min(bikes.length - 1, current + 1))}
          disabled={current === bikes.length - 1}
        >›</button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    background: "#fff", borderRadius: "20px", padding: "14px 14px 10px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
    // Was `maxWidth: "300px"` — same fix as HotelCards.tsx and CabCards.tsx: fills
    // whatever width its parent container (ChatWidget.tsx's S.cardsWrapper) gives
    // it, instead of capping at a fixed pixel value regardless of available space.
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "'Segoe UI', sans-serif", marginTop: "10px", overflow: "hidden",
  },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: "8px" },
  headerIcon: {
    width: "36px", height: "36px", borderRadius: "50%",
    background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px",
  },
  headerTitle: { fontWeight: 700, fontSize: "13px", color: "#111" },
  headerDate: { fontSize: "11px", color: "#888", marginTop: "1px" },
  viewAllBtn: {
    display: "flex", alignItems: "center", gap: "2px",
    background: "none", border: "none", color: "#4F46E5",
    fontWeight: 600, fontSize: "12px", cursor: "pointer",
  },
  viewAllArrow: {
    fontSize: "14px", background: "#4F46E5", color: "#fff",
    borderRadius: "50%", width: "18px", height: "18px",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
  },
  scrollTrack: {
    display: "flex", gap: "10px", overflowX: "auto",
    scrollSnapType: "x mandatory", scrollbarWidth: "none",
    msOverflowStyle: "none", paddingBottom: "4px",
  },
  card: {
    minWidth: "190px", maxWidth: "190px", borderRadius: "16px",
    overflow: "hidden", border: "1px solid #f0f0f0", cursor: "pointer",
    background: "#fff", scrollSnapAlign: "start", flexShrink: 0,
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  imageWrap: { position: "relative", height: "120px", overflow: "hidden", background: "#f8f8f8" },
  image: { width: "100%", height: "100%", objectFit: "contain", padding: "6px" },
  availBadge: {
    position: "absolute", top: "6px", right: "6px",
    color: "#fff", fontSize: "9px", fontWeight: 700,
    padding: "2px 7px", borderRadius: "20px",
  },
  transBadge: {
    position: "absolute", bottom: "6px", left: "6px",
    background: "rgba(0,0,0,0.65)", color: "#fff",
    fontSize: "9px", fontWeight: 700, padding: "2px 7px", borderRadius: "20px",
  },
  cardInfo: { padding: "8px 10px" },
  cardName: {
    fontWeight: 700, fontSize: "12px", color: "#111",
    marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
  },
  company: { fontSize: "10px", color: "#888", marginBottom: "5px" },
  specsRow: { display: "flex", gap: "3px", flexWrap: "wrap", marginBottom: "5px" },
  spec: {
    fontSize: "9px", background: "#EEF2FF", color: "#4F46E5",
    padding: "2px 5px", borderRadius: "4px", fontWeight: 600,
  },
  chips: { display: "flex", gap: "3px", flexWrap: "wrap", marginBottom: "4px" },
  chip: {
    background: "#f3f4f6", color: "#555",
    fontSize: "9px", fontWeight: 500, padding: "2px 6px", borderRadius: "20px",
  },
  kmRow: { fontSize: "9px", color: "#888", marginBottom: "6px" },
  priceRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px",
  },
  price: { color: "#4F46E5", fontWeight: 700, fontSize: "13px" },
  perDay: { fontSize: "9px", color: "#888", fontWeight: 400 },
  rating: { fontSize: "11px", color: "#444", fontWeight: 600 },
  bookBtn: {
    width: "100%", background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
    color: "#fff", border: "none", borderRadius: "8px",
    padding: "5px 0", fontSize: "11px", fontWeight: 600, cursor: "pointer",
  },
  dotsRow: {
    display: "flex", justifyContent: "center", alignItems: "center",
    gap: "8px", marginTop: "10px",
  },
  arrowBtn: {
    background: "#f3f4f6", border: "none", borderRadius: "50%",
    width: "26px", height: "26px", fontSize: "16px",
    cursor: "pointer", color: "#333",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  dots: { display: "flex", gap: "5px", alignItems: "center" },
  dot: {
    width: "6px", height: "6px", borderRadius: "50%",
    background: "#ddd", cursor: "pointer", transition: "all 0.2s",
  },
  dotActive: { background: "#4F46E5", width: "18px", borderRadius: "4px" },
};