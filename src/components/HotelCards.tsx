import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export interface Hotel {
  id: number;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  price: string;
  amenities: string[];
  nearby: string;
  url: string;
  image?: string;
}

interface HotelCardsProps {
  hotels: Hotel[];
  city?: string;
  onClose?: () => void;
}

const HOTEL_DATA: Record<string, { image: string; distance: string }> = {
  "mayfair spa resort and casino": {
    image: "https://res.cloudinary.com/djsguxriw/image/upload/v1777476166/caption_cdhajk.jpg",
    distance: "2 km from city centre",
  },
  "mayfair spa resort & casino": {
    image: "https://res.cloudinary.com/djsguxriw/image/upload/v1777476166/caption_cdhajk.jpg",
    distance: "2 km from city centre",
  },
  "summit newa regency": {
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80",
    distance: "0.5 km from city centre",
  },
  "orange village resort": {
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80",
    distance: "Lachung village",
  },
  "norbu ghang resort": {
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80",
    distance: "Hilltop, Pelling",
  },
  "the elgin mount pandim": {
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80",
    distance: "Forest area, Pelling",
  },
  "bamboo retreat": {
    image: "https://images.unsplash.com/photo-1506059612708-99d6c258160e?w=400&q=80",
    distance: "Rinchenpong",
  },
  "the royal plaza": {
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80",
    distance: "1.5 km from city centre",
  },
  "mountain lodge": {
    image: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=400&q=80",
    distance: "Namchi town centre",
  },
  "himalayan zen retreat": {
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80",
    distance: "Ravangla hills",
  },
};

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40c40c3a49?w=400&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80",
];

function getHotelMeta(name: string, idx: number) {
  const key = name.toLowerCase().trim();
  for (const [k, v] of Object.entries(HOTEL_DATA)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return {
    image: FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length],
    distance: "Gangtok",
  };
}

export default function HotelCards({ hotels, city = "Gangtok", onClose}: HotelCardsProps) {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  if (!hotels || hotels.length === 0) return null;

  const handleNavigate = (url: string) => {
    onClose?.();
    if (url.startsWith("/")) navigate(url);
    else window.open(url, "_blank", "noopener,noreferrer");
  };

  const scrollTo = (idx: number) => {
    if (!scrollRef.current) return;
    const cardWidth = 200 + 10; // card width + gap
    scrollRef.current.scrollTo({ left: idx * cardWidth, behavior: "smooth" });
    setCurrent(idx);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const idx = Math.round(scrollRef.current.scrollLeft / 210);
    setCurrent(idx);
  };

  const scrollPrev = () => {
    const newIdx = Math.max(0, current - 1);
    scrollTo(newIdx);
  };

  const scrollNext = () => {
    const newIdx = Math.min(hotels.length - 1, current + 1);
    scrollTo(newIdx);
  };

  // Today's date for display
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>
            <span style={{ fontSize: "18px" }}></span>
          </div>
          <div>
            <div style={styles.headerTitle}>Recommendations in {city}</div>
            <div style={styles.headerDate}>{dateStr}</div>
          </div>
        </div>
        <button
          style={styles.viewAllBtn}
          onClick={() => { onClose?.(); navigate("/accommodations"); }}
        >
          View All
          <span style={styles.viewAllArrow}>›</span>
        </button>
      </div>

      {/* Horizontal scroll cards */}
      <div
        ref={scrollRef}
        style={styles.scrollTrack}
        onScroll={handleScroll}
      >
        {hotels.map((hotel, idx) => {
          const meta = hotel.image
        ? { image: hotel.image, distance: hotel.nearby || hotel.location }
        : getHotelMeta(hotel.name, idx);
          return (
            <div
              key={hotel.id}
              style={styles.card}
              onClick={() => handleNavigate(hotel.url)}
            >
              {/* Hotel image */}
              <div style={styles.imageWrap}>
                <img src={meta.image} alt={hotel.name} style={styles.image} onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80"; }} />
                <button
                  style={styles.bookmark}
                  onClick={(e) => e.stopPropagation()}
                >
                  🔖
                </button>
              </div>

              {/* Hotel info */}
              <div style={styles.cardInfo}>
                <div style={styles.cardName}>{hotel.name}</div>
                <div style={styles.cardDistance}>
                  <span style={{ fontSize: "10px" }}>📍</span> {meta.distance}, {city}
                </div>
                <div style={styles.cardPrice}>
                  Starting at {hotel.price}
                  <span style={styles.perNight}>/night</span>
                </div>
                <div style={styles.cardRating}>
                  ⭐ {hotel.rating}
                  {hotel.reviews > 0 && (
                    <span style={styles.reviews}> ({hotel.reviews})</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination dots + arrows */}
      <div style={styles.dotsRow}>
        <button
          style={{ ...styles.arrowBtn, opacity: current === 0 ? 0.3 : 1 }}
          onClick={scrollPrev}
          disabled={current === 0}
        >‹</button>
        <div style={styles.dots}>
          {hotels.map((_, i) => (
            <span
              key={i}
              style={{ ...styles.dot, ...(i === current ? styles.dotActive : {}) }}
              onClick={() => scrollTo(i)}
            />
          ))}
        </div>
        <button
          style={{ ...styles.arrowBtn, opacity: current === hotels.length - 1 ? 0.3 : 1 }}
          onClick={scrollNext}
          disabled={current === hotels.length - 1}
        >›</button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    background: "#fff",
    borderRadius: "20px",
    padding: "14px 14px 10px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
    // Was `maxWidth: "300px"` — that hardcoded cap is what stopped this short of
    // the AI text bubble's right edge. Now it fills whatever width its parent
    // container gives it (in ChatWidget.tsx, that's `S.cardsWrapper`, already
    // sized to match the message bubbles above).
    width: "100%",
    fontFamily: "'Segoe UI', sans-serif",
    marginTop: "10px",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  headerIcon: {
    width: "36px", height: "36px", borderRadius: "50%",
    background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontWeight: 700, fontSize: "13px", color: "#111" },
  headerDate: { fontSize: "11px", color: "#888", marginTop: "1px" },
  viewAllBtn: {
    display: "flex", alignItems: "center", gap: "2px",
    background: "none", border: "none",
    color: "#1a73e8", fontWeight: 600, fontSize: "12px",
    cursor: "pointer", padding: "4px 8px",
    borderRadius: "20px",
  },
  viewAllArrow: {
    fontSize: "16px",
    background: "#1a73e8",
    color: "#fff",
    borderRadius: "50%",
    width: "18px", height: "18px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
  },
  scrollTrack: {
    display: "flex",
    gap: "10px",
    overflowX: "auto",
    scrollSnapType: "x mandatory",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    paddingBottom: "4px",
  },
  card: {
    minWidth: "190px",
    maxWidth: "190px",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid #f0f0f0",
    cursor: "pointer",
    background: "#fff",
    scrollSnapAlign: "start",
    flexShrink: 0,
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    transition: "box-shadow 0.2s",
  },
  imageWrap: {
    position: "relative",
    height: "130px",
    overflow: "hidden",
  },
  image: {
    width: "100%", height: "100%", objectFit: "cover",
    transition: "transform 0.3s",
  },
  bookmark: {
    position: "absolute", top: "8px", right: "8px",
    background: "rgba(255,255,255,0.9)",
    border: "none", borderRadius: "50%",
    width: "28px", height: "28px",
    cursor: "pointer", fontSize: "12px",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
  },
  cardInfo: { padding: "10px 10px 8px" },
  cardName: {
    fontWeight: 700, fontSize: "12px", color: "#111",
    marginBottom: "3px",
    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
  },
  cardDistance: {
    fontSize: "10px", color: "#666",
    marginBottom: "5px",
    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
  },
  cardPrice: {
    color: "#1a73e8", fontWeight: 700, fontSize: "12px",
    marginBottom: "3px",
  },
  perNight: { fontSize: "10px", color: "#888", fontWeight: 400 },
  cardRating: {
    fontSize: "11px", color: "#444", fontWeight: 600,
  },
  reviews: { color: "#888", fontWeight: 400 },
  dotsRow: {
    display: "flex", justifyContent: "center",
    alignItems: "center", gap: "8px",
    marginTop: "10px",
  },
  arrowBtn: {
    background: "#f3f4f6", border: "none", borderRadius: "50%",
    width: "26px", height: "26px", fontSize: "16px",
    cursor: "pointer", color: "#333",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  dots: { display: "flex", gap: "5px", alignItems: "center" },
  dot: {
    width: "6px", height: "6px", borderRadius: "50%",
    background: "#ddd", cursor: "pointer", transition: "all 0.2s",
  },
  dotActive: {
    background: "#4F46E5", width: "18px", borderRadius: "4px",
  },
};