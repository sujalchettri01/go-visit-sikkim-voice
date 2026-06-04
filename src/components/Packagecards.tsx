import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export interface Package {
  id: number;
  title: string;
  image: string;
  shortDescription: string;
  summary: string[];
  price: number;
  duration: string;
  type: string;
  rating: number;
  reviewCount: number;
  Guests: number;
  bestTime: string;
  pricingByPeople: Record<string, number>;
}

interface PackageCardsProps {
  packages: Package[];
  onClose?: () => void;
}

export default function PackageCards({ packages, onClose}: PackageCardsProps) {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  if (!packages || packages.length === 0) return null;

  const scrollTo = (idx: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ left: idx * 210, behavior: "smooth" });
    setCurrent(idx);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    setCurrent(Math.round(scrollRef.current.scrollLeft / 210));
  };

  const getStartingPrice = (pkg: Package) => {
    const prices = Object.values(pkg.pricingByPeople).filter((p) => p > 0);
    return prices.length > 0 ? Math.min(...prices) : null;
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>🗺️</div>
          <div>
            <div style={styles.headerTitle}>Tour Packages</div>
            <div style={styles.headerDate}>{dateStr}</div>
          </div>
        </div>
        <button style={styles.viewAllBtn} onClick={() => { onClose?.(); navigate("/destinations"); }}>
          View All
          <span style={styles.viewAllArrow}>›</span>
        </button>
      </div>

      {/* Horizontal scroll */}
      <div ref={scrollRef} style={styles.scrollTrack} onScroll={handleScroll}>
        {packages.map((pkg, idx) => {
          const startingPrice = getStartingPrice(pkg);
          return (
            <div
              key={pkg.id}
              style={styles.card}
              onClick={() => { onClose?.(); navigate(`/destinations/${pkg.id}`); }}
            >
              {/* Image */}
              <div style={styles.imageWrap}>
                <img src={pkg.image} alt={pkg.title} style={styles.image} />
                <span style={styles.durationBadge}>{pkg.duration}</span>
              </div>

              {/* Info */}
              <div style={styles.cardInfo}>
                <div style={styles.cardName}>{pkg.title}</div>

                {/* Summary highlights */}
                <div style={styles.highlights}>
                  {pkg.summary.slice(0, 2).map((s, i) => (
                    <span key={i} style={styles.highlight}>✓ {s}</span>
                  ))}
                </div>

                {/* Type + Rating */}
                <div style={styles.metaRow}>
                  <span style={styles.type}>{pkg.type}</span>
                  <span style={styles.rating}>⭐ {pkg.rating}</span>
                </div>

                {/* Best time */}
                <div style={styles.bestTime}>🗓 {pkg.bestTime.split("&")[0].trim()}</div>

                {/* Price + button */}
                <div style={styles.priceRow}>
                  <div>
                    {startingPrice ? (
                      <>
                        <span style={styles.priceLabel}>From </span>
                        <span style={styles.price}>₹{startingPrice.toLocaleString()}</span>
                      </>
                    ) : (
                      <span style={styles.price}>On Request</span>
                    )}
                  </div>
                </div>

                <button
                  style={styles.bookBtn}
                  onClick={(e) => { e.stopPropagation(); onClose?.(); navigate(`/destinations/${pkg.id}`); }}
                >
                  View Package →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dots + arrows */}
      <div style={styles.dotsRow}>
        <button
          style={{ ...styles.arrowBtn, opacity: current === 0 ? 0.3 : 1 }}
          onClick={() => scrollTo(Math.max(0, current - 1))}
          disabled={current === 0}
        >‹</button>
        <div style={styles.dots}>
          {packages.map((_, i) => (
            <span
              key={i}
              style={{ ...styles.dot, ...(i === current ? styles.dotActive : {}) }}
              onClick={() => scrollTo(i)}
            />
          ))}
        </div>
        <button
          style={{ ...styles.arrowBtn, opacity: current === packages.length - 1 ? 0.3 : 1 }}
          onClick={() => scrollTo(Math.min(packages.length - 1, current + 1))}
          disabled={current === packages.length - 1}
        >›</button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    background: "#fff", borderRadius: "20px", padding: "14px 14px 10px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.12)", maxWidth: "300px",
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
  imageWrap: { position: "relative", height: "120px", overflow: "hidden" },
  image: { width: "100%", height: "100%", objectFit: "cover" },
  durationBadge: {
    position: "absolute", bottom: "6px", left: "6px",
    background: "rgba(0,0,0,0.65)", color: "#fff",
    fontSize: "9px", fontWeight: 700, padding: "2px 7px", borderRadius: "20px",
  },
  cardInfo: { padding: "8px 10px" },
  cardName: {
    fontWeight: 700, fontSize: "11px", color: "#111",
    marginBottom: "5px", lineHeight: "1.3",
    display: "-webkit-box", WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical", overflow: "hidden",
  },
  highlights: { display: "flex", flexDirection: "column", gap: "1px", marginBottom: "5px" },
  highlight: { fontSize: "9px", color: "#4F46E5", fontWeight: 600 },
  metaRow: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "3px",
  },
  type: {
    fontSize: "9px", background: "#EEF2FF", color: "#4F46E5",
    padding: "2px 6px", borderRadius: "20px", fontWeight: 600,
  },
  rating: { fontSize: "11px", color: "#444", fontWeight: 600 },
  bestTime: { fontSize: "9px", color: "#888", marginBottom: "6px" },
  priceRow: { marginBottom: "6px" },
  priceLabel: { fontSize: "9px", color: "#888" },
  price: { color: "#4F46E5", fontWeight: 700, fontSize: "13px" },
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