import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export interface Cab {
  id: string;
  cab_name: string;
  company: string;
  capacity: number;
  category: string;
  priceOffset: number;
  image: string;
  rating: number;
  features: string[];
  destinations: string[];
}

interface CabCardsProps {
  cabs: Cab[];
  from?: string;
  to?: string;
  routePrices?: Record<string, number>;
  onClose?: () => void;
}

// Mirror the 3 price tables from cabs.ts
const PRICES_4SEATER: Record<string, Record<string, number>> = {
  Siliguri: { Gangtok: 2500, Rangpo: 2000, Jorethang: 2500, Namchi: 2500, Singtam: 2500, Mangan: 3000 },
  Gangtok:  { Siliguri: 2500, Namchi: 1500, Singtam: 800, Mangan: 1500, Rangpo: 1300 },
  Namchi:   { Siliguri: 2500, Gangtok: 1500, Singtam: 1500, Mangan: 2000, Rangpo: 1500 },
  Singtam:  { Siliguri: 2500, Gangtok: 800, Namchi: 1500, Mangan: 1500, Rangpo: 800 },
  Mangan:   { Siliguri: 3000, Gangtok: 1500, Namchi: 2000, Singtam: 1500, Rangpo: 2000 },
  Rangpo:   { Siliguri: 2000, Gangtok: 1300, Namchi: 1500, Singtam: 800, Mangan: 2000 },
  Jorethang:{ Siliguri: 2500 },
};

const PRICES_7SEATER: Record<string, Record<string, number>> = {
  Siliguri: { Gangtok: 4000, Rangpo: 3000, Jorethang: 4000, Namchi: 4000, Singtam: 3500, Mangan: 4500 },
  Gangtok:  { Siliguri: 4000, Namchi: 2500, Singtam: 1500, Mangan: 2500, Rangpo: 2000 },
  Namchi:   { Siliguri: 4000, Gangtok: 2500, Singtam: 2000, Mangan: 3000, Rangpo: 1800 },
  Singtam:  { Siliguri: 3500, Gangtok: 1500, Namchi: 2000, Mangan: 2000, Rangpo: 1500 },
  Mangan:   { Siliguri: 4500, Gangtok: 2500, Namchi: 3000, Singtam: 2000, Rangpo: 3000 },
  Rangpo:   { Siliguri: 3000, Gangtok: 2500, Namchi: 1800, Singtam: 1500, Mangan: 3000 },
  Jorethang:{ Siliguri: 4000 },
};

const PRICES_9SEATER: Record<string, Record<string, number>> = {
  Siliguri: { Gangtok: 3500, Rangpo: 2500, Jorethang: 3500, Namchi: 3500, Singtam: 3000, Mangan: 4000 },
  Gangtok:  { Siliguri: 3500, Namchi: 2000, Singtam: 1000, Mangan: 2000, Rangpo: 1500 },
  Namchi:   { Siliguri: 3500, Gangtok: 2000, Singtam: 1800, Mangan: 2500, Rangpo: 1700 },
  Singtam:  { Siliguri: 3000, Gangtok: 1000, Namchi: 1800, Mangan: 1800, Rangpo: 1000 },
  Mangan:   { Siliguri: 4000, Gangtok: 2000, Namchi: 2500, Singtam: 1800, Rangpo: 2500 },
  Rangpo:   { Siliguri: 2500, Gangtok: 1500, Namchi: 1700, Singtam: 1000, Mangan: 2500 },
  Jorethang:{ Siliguri: 3500 },
};

function getRoutePrice(from: string, to: string, category: string): number | null {
  const table = category === "7seater" ? PRICES_7SEATER : category === "9seater" ? PRICES_9SEATER : PRICES_4SEATER;
  return table[from]?.[to] ?? null;
}

export default function CabCards({ cabs, from = "Gangtok", to = "", onClose }: CabCardsProps) {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  if (!cabs || cabs.length === 0) return null;

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
            <div style={styles.headerTitle}>
              {to ? `${from} → ${to}` : `Cabs from ${from}`}
            </div>
            <div style={styles.headerDate}>{dateStr}</div>
          </div>
        </div>
        <button style={styles.viewAllBtn} onClick={() => { onClose?.(); navigate("/cabs"); }}>
          View All
          <span style={styles.viewAllArrow}>›</span>
        </button>
      </div>

      {/* Horizontal scroll */}
      <div ref={scrollRef} style={styles.scrollTrack} onScroll={handleScroll}>
        {cabs.map((cab) => {
          const price = to
            ? getRoutePrice(from, to, cab.category ?? "4seater")
            : (() => {
                // Show cheapest route price as "starting from"
                const table = (cab.category ?? "4seater") === "7seater" ? PRICES_7SEATER : (cab.category ?? "4seater") === "9seater" ? PRICES_9SEATER : PRICES_4SEATER;
                const routes = table[from];
                if (!routes) return null;
                const prices = Object.values(routes).filter(p => p != null) as number[];
                return prices.length ? Math.min(...prices) : null;
              })();
          const isStartingFrom = !to && price !== null;
          return (
            <div
              key={cab.id}
              style={styles.card}
              onClick={() => { onClose?.(); navigate("/cabs"); }}
            >
              <div style={styles.imageWrap}>
                <img src={cab.image} alt={cab.cab_name} style={styles.image} />
                <span style={styles.capacityBadge}> {cab.capacity} seats</span>
              </div>

              <div style={styles.cardInfo}>
                <div style={styles.cardName}>{cab.cab_name}</div>
                <div style={styles.company}>{cab.company}</div>

                {to && (
                  <div style={styles.route}> {from} → {to}</div>
                )}

                <div style={styles.chips}>
                  <span style={styles.chip}> Private Cab</span>
                  <span style={styles.chip}> Luggage OK</span>
                </div>

                <div style={styles.ratingRow}>
                  <span style={styles.rating}>⭐ {cab.rating}</span>
                  <span style={styles.ac}> AC</span>
                </div>

                <div style={styles.priceRow}>
                  {price !== null ? (
                    <>
                      {isStartingFrom && <div style={{ fontSize: "9px", color: "#888", marginBottom: "1px" }}>Starting from</div>}
                      <span style={styles.price}>₹{price.toLocaleString()}</span>
                      <span style={styles.perTrip}>/trip</span>
                    </>
                  ) : (
                    <span style={{ ...styles.price, color: "#888", fontSize: "12px" }}>Select route for price</span>
                  )}
                </div>

                <button
                  style={styles.bookBtn}
                  onClick={(e) => { e.stopPropagation(); onClose?.(); navigate("/cabs"); }}
                >
                  Book Now →
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
          {cabs.map((_, i) => (
            <span
              key={i}
              style={{ ...styles.dot, ...(i === current ? styles.dotActive : {}) }}
              onClick={() => scrollTo(i)}
            />
          ))}
        </div>
        <button
          style={{ ...styles.arrowBtn, opacity: current === cabs.length - 1 ? 0.3 : 1 }}
          onClick={() => scrollTo(Math.min(cabs.length - 1, current + 1))}
          disabled={current === cabs.length - 1}
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
  headerTitle: { fontWeight: 700, fontSize: "12px", color: "#111", maxWidth: "140px", lineHeight: "1.2" },
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
  imageWrap: { position: "relative", height: "120px", overflow: "hidden", background: "#EEF2FF" },
  image: { width: "100%", height: "100%", objectFit: "contain", padding: "8px" },
  capacityBadge: {
    position: "absolute", top: "6px", right: "6px",
    background: "rgba(79,70,229,0.9)", color: "#fff",
    fontSize: "9px", fontWeight: 700, padding: "2px 7px", borderRadius: "20px",
  },
  cardInfo: { padding: "8px 10px" },
  cardName: {
    fontWeight: 700, fontSize: "12px", color: "#111",
    marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
  },
  company: { fontSize: "10px", color: "#888", marginBottom: "4px" },
  route: { fontSize: "10px", color: "#4F46E5", fontWeight: 600, marginBottom: "5px" },
  chips: { display: "flex", gap: "3px", flexWrap: "wrap", marginBottom: "5px" },
  chip: {
    background: "#EEF2FF", color: "#4F46E5",
    fontSize: "9px", fontWeight: 600, padding: "2px 6px", borderRadius: "20px",
  },
  ratingRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" },
  rating: { fontSize: "11px", color: "#444", fontWeight: 600 },
  ac: { fontSize: "10px", color: "#4F46E5", fontWeight: 600 },
  priceRow: { marginBottom: "6px" },
  price: { color: "#4F46E5", fontWeight: 700, fontSize: "14px" },
  perTrip: { fontSize: "9px", color: "#888", fontWeight: 400 },
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