import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star, MapPin, Users, Clock, Car, Hotel, UtensilsCrossed,
  FileCheck, CheckCircle2, Heart, Images, ShieldCheck, Bike, PartyPopper,
} from "lucide-react";
import packagesData from "../data/package";
import bikesData from "../data/bikes";
import accommodationsData from "../data/hotel";
import cabsData, { getStartingPrice } from "../data/cabs";
import activitiesData from "../data/activity";

// ─── Static styling — mirrors the purple/cream theme already used across
// the app (see chatStyles.ts: #6d28d9 primary, #7c3aed accent, #f6f5f2 /
// #ede9fe surfaces) so this panel doesn't look like a bolted-on component.
const PURPLE = "#6d28d9";
const PURPLE_LIGHT = "#f1ecfd";
const BORDER = "#ede9fe";

const ROTATE_MS = 4000; // slower than the old Explore cards — there's a lot more to read here
const PACKAGE_SLIDE_LIMIT = 2; // only this many packages join the rotation now
const BIKE_SLIDE_LIMIT = 6; // showcase all bikes in the fleet
const DEFAULT_GROUP_SIZE = 2;

type Tab = "overview" | "itinerary" | "inclusions" | "permits";
const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "itinerary", label: "Itinerary" },
  { id: "inclusions", label: "Inclusions" },
  { id: "permits", label: "Permits" },
];

// Same permit-by-location logic as chatPrompt.cjs's PERMITS section, kept in
// sync manually since aidata.ts/chatPrompt.cjs and src/data/*.ts are
// intentionally separate data sources.
const ILP_KEYWORDS = ["lachen", "lachung", "yumthang", "gurudongmar", "zero point", "dzongu", "mangan", "thangu"];
const PAP_KEYWORDS = ["tsomgo", "baba mandir", "changu"];
const RAP_KEYWORDS = ["nathula"];

function getPermitsForPackage(pkg: any): { name: string; note: string }[] {
  const text = `${(pkg.locations ?? []).map((l: any) => l.name).join(" ")} ${pkg.title ?? ""}`.toLowerCase();
  const permits: { name: string; note: string }[] = [];
  if (ILP_KEYWORDS.some(k => text.includes(k))) {
    permits.push({ name: "Inner Line Permit (ILP)", note: "Required for North Sikkim destinations on this route" });
  }
  if (PAP_KEYWORDS.some(k => text.includes(k))) {
    permits.push({ name: "Protected Area Permit (PAP)", note: "Required for the Tsomgo Lake / Baba Mandir area" });
  }
  if (RAP_KEYWORDS.some(k => text.includes(k))) {
    permits.push({ name: "Restricted Area Permit (RAP)", note: "Required for Nathula Pass — Indian nationals only" });
  }
  return permits;
}

// Short bold category label for the two-line inclusion badge format (e.g.
// "Private Cab" as the bold label, the actual inclusion string as the
// smaller description underneath) — matches the reference design's pattern.
// Real inclusion strings are freeform sentences, not pre-split into
// label+description, so the label is derived from the same category
// detection as the icon/color rather than parsed out of the text itself.
function inclusionLabel(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("cab") || t.includes("suv") || t.includes("vehicle")) return "Private Cab";
  if (t.includes("transport")) return "Transport";
  if (t.includes("accommodation") || t.includes("hotel") || t.includes("stay")) return "Hotels";
  if (t.includes("meal") || t.includes("breakfast") || t.includes("lunch") || t.includes("dinner")) return "Meals";
  if (t.includes("permit")) return "Permits";
  return "Included";
}

function inclusionIcon(text: string) {
  const t = text.toLowerCase();
  if (t.includes("cab") || t.includes("transport") || t.includes("suv") || t.includes("vehicle")) return Car;
  if (t.includes("accommodation") || t.includes("hotel") || t.includes("stay")) return Hotel;
  if (t.includes("meal") || t.includes("breakfast") || t.includes("lunch") || t.includes("dinner")) return UtensilsCrossed;
  if (t.includes("permit")) return FileCheck;
  return CheckCircle2;
}

// Distinct color per inclusion category, matching the varied icon-badge
// colors in the reference design (green transport, blue stays, amber meals,
// pink permits) instead of every icon being the same flat purple.
function inclusionColor(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("cab") || t.includes("transport") || t.includes("suv") || t.includes("vehicle")) return "#16a34a";
  if (t.includes("accommodation") || t.includes("hotel") || t.includes("stay")) return "#2563eb";
  if (t.includes("meal") || t.includes("breakfast") || t.includes("lunch") || t.includes("dinner")) return "#d97706";
  if (t.includes("permit")) return "#db2777";
  return PURPLE;
}

function getPriceForGroup(pkg: any, size: number): number | null {
  const table = pkg.pricingByPeople;
  if (!table || typeof table !== "object") return null;
  return table[size] ?? table[String(size)] ?? null;
}

interface PackageShowcaseProps {
  onClose: () => void; // closes the full-screen chat overlay before navigating away, since it'd otherwise stay open on top of the destination page
}

export default function PackageShowcase({ onClose }: PackageShowcaseProps) {
  const navigate = useNavigate();
  const packages = packagesData as any[];
  const [index, setIndex] = useState(0);
  const [tab, setTab] = useState<Tab>("overview");
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [saved, setSaved] = useState<Set<string | number>>(new Set());

  // ─── Non-package slides — simpler cards (no itinerary/permits, since those
  // don't apply). Field access is defensive (multiple ?? fallbacks) since
  // this component doesn't have visibility into the exact shape of
  // bikes.ts/hotel.ts/cabs.ts/activity.ts — same pattern chatLogic.tsx
  // already uses for the same reason. If a field shows up blank, that's a
  // field-name mismatch worth fixing with the real data file in hand.
  // Built directly from your real bikes.ts field names (bike_name, city
  // ONE combined slide showing all 3 bikes together (not 3 separate rotating
  // slides) — the hero image/title use the first bike, and the other two
  // render as a compact list inside the same card (see the "bike" branch in
  // the simple-slide JSX below).
  const bikeSlide = useMemo(() => {
    const list = (bikesData as any[]).slice(0, BIKE_SLIDE_LIMIT);
    if (list.length === 0) return null;
    const bikes = list.map((b, i) => ({
      id: b.id ?? `bike-${i}`,
      title: b.bike_name ?? "Bike Rental",
      subtitle: `${b.company ?? ""}${b.engineCC ? ` · ${b.engineCC}cc` : ""}`.trim(),
      image: b.image ?? "",
      price: typeof b.pricePerDay === "number" ? `₹${b.pricePerDay.toLocaleString()}/day` : null,
      routeUrl: `/bikes/book/${b.id}`,
    }));
    const prices = bikes.map(b => b.price ? parseInt(b.price.replace(/[^\d]/g, ""), 10) : null).filter((p): p is number => p != null);
    const minPrice = prices.length ? Math.min(...prices) : null;
    return {
      kind: "bike" as const,
      id: "bike-group",
      title: bikes[0].title,
      subtitle: Array.isArray(list[0].city) ? list[0].city.join(", ") : "Sikkim",
      image: bikes[0].image,
      price: minPrice != null ? `From ₹${minPrice.toLocaleString()}/day` : null,
      badge: "Bike Rental",
      bikes, // full list rendered together in the content area
      routeUrl: "/bikes",
    };
  }, []);

  const hotelSlide = useMemo(() => {
    const h = (accommodationsData as any[])[0];
    if (!h) return null;
    return {
      kind: "hotel" as const,
      id: h.id,
      title: h.name,
      subtitle: `${h.type ?? "Hotel"} · ${h.location ?? "Sikkim"}`,
      image: h.image,
      price: typeof h.pricePerNight === "number" && h.pricePerNight > 0 ? `₹${h.pricePerNight.toLocaleString()}/night` : null,
      badge: "Hotel Booking",
      description: h.description ?? h.shortDescription ?? "Comfortable, well-reviewed stays across Sikkim's most popular destinations.",
      routeUrl: `/accommodations/${h.id}`,
    };
  }, []);

  const cabSlide = useMemo(() => {
    const c = (cabsData as any[])[0];
    if (!c) return null;
    const startingPrice = getStartingPrice ? getStartingPrice(c, "Gangtok") : null;
    return {
      kind: "cab" as const,
      id: c.id,
      title: `Book a ${c.cab_name ?? "Cab"}`,
      subtitle: `${c.capacity ?? ""}-seater · ${c.category ?? "Private Cab"}`,
      image: c.image,
      price: typeof startingPrice === "number" && startingPrice > 0 ? `From ₹${startingPrice.toLocaleString()} (Gangtok)` : null,
      badge: "Cab Booking",
      description: "Reliable private cabs for airport transfers, sightseeing, and North Sikkim routes.",
      routeUrl: `/cabs/book/${c.id}`,
    };
  }, []);

  const eventSlide = useMemo(() => {
    const list = activitiesData as any[];
    const e = list.find(a => a.category === "Upcoming Events") ?? list[0];
    if (!e) return null;
    const price = e.price ?? e.startingPrice ?? e.pricePerPerson ?? e.cost;
    return {
      kind: "event" as const,
      id: e.id,
      title: e.title ?? e.name ?? "Upcoming Event",
      subtitle: e.duration ?? e.durationLabel ?? e.date ?? "Sikkim",
      image: e.image ?? e.img ?? e.thumbnail ?? e.photo ?? "",
      price: typeof price === "number" ? `From ₹${price.toLocaleString()}` : null,
      badge: "Upcoming Event",
      description: e.description ?? e.shortDescription ?? "Don't miss this seasonal Sikkim event.",
      routeUrl: `/activities/${e.id}`,
    };
  }, []);

  // Only PACKAGE_SLIDE_LIMIT packages join the rotation now (rich view),
  // plus one representative slide per other category (simple view).
  const rotationItems = useMemo(() => {
    const items: { kind: string; data: any }[] = packages.slice(0, PACKAGE_SLIDE_LIMIT).map(p => ({ kind: "package", data: p }));
    [bikeSlide, hotelSlide, cabSlide, eventSlide].forEach(s => { if (s) items.push({ kind: s.kind, data: s }); });
    return items;
  }, [packages, bikeSlide, hotelSlide, cabSlide, eventSlide]);

  const current = rotationItems[index % rotationItems.length];
  const isPackage = current.kind === "package";
  const pkg = isPackage ? current.data : null;

  const permits = useMemo(() => (pkg ? getPermitsForPackage(pkg) : []), [pkg]);
  const gallery: string[] = useMemo(() => {
    if (!pkg) return [];
    const imgs = Array.isArray(pkg.images) && pkg.images.length ? pkg.images : [pkg.image].filter(Boolean);
    return Array.from(new Set(imgs)); // dedupe — several entries repeat the same photo many times
  }, [pkg]);

  // Auto-rotate through the combined catalog, resetting tab/gallery state
  // each time so a stale "Itinerary" tab or mid-gallery photo doesn't carry over.
  useEffect(() => {
    const t = setInterval(() => {
      setIndex(i => (i + 1) % rotationItems.length);
      setTab("overview");
      setGalleryIdx(0);
    }, ROTATE_MS);
    return () => clearInterval(t);
  }, [rotationItems.length]);

  const toggleSaved = () => {
    const id = isPackage ? pkg.id : current.data.id;
    setSaved(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const price = pkg ? getPriceForGroup(pkg, DEFAULT_GROUP_SIZE) : null;
  const isSaved = saved.has(isPackage ? pkg.id : current.data.id);

  // Reusable two-line inclusion badge grid — used both as a condensed
  // preview on the Overview tab and as the full list on the Inclusions tab.
  // limit caps how many show (Overview only needs a handful; the dedicated
  // tab shows everything).
  const renderInclusionsGrid = (limit?: number) => {
    const items: string[] = pkg.inclusions ?? [];
    const shown = limit ? items.slice(0, limit) : items;
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {shown.map((inc, i) => {
          const Icon = inclusionIcon(inc);
          const color = inclusionColor(inc);
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <span
                style={{
                  width: "26px", height: "26px", borderRadius: "8px", flexShrink: 0,
                  background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Icon size={14} color={color} aria-hidden="true" />
              </span>
              <div>
                <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, color: "#1e1b4b" }}>{inclusionLabel(inc)}</p>
                <p style={{ margin: "1px 0 0", fontSize: "11px", lineHeight: 1.35, color: "#78716c" }}>{inc}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <aside
      style={{
        width: "400px", flexShrink: 0, order: 3, minHeight: 0,
        background: "#fff", borderLeft: `1px solid ${BORDER}`,
        display: "flex", flexDirection: "column", height: "100%", overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ padding: "16px 16px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
          <span style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "0.6px", color: PURPLE }}>
            FEATURED
          </span>
          <div style={{ display: "flex", gap: "4px" }}>
            {rotationItems.map((_, i) => (
              <span
                key={i}
                style={{
                  width: "5px", height: "5px", borderRadius: "50%",
                  background: i === index % rotationItems.length ? PURPLE : "#ddd6fe",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Wraps everything below the header/dots in one animated block — keyed
          by index so React remounts it (and replays .slide-card-in) every
          time the featured package rotates, instead of the content just
          instantly swapping in place. */}
      {isPackage ? (
      <div key={index} className="slide-card-in" style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>

      {/* Image gallery — big shot left, two stacked thumbnails right, last one
          shows a "+N Photos" overlay. Clicking any thumbnail just cycles the
          main image forward through the gallery array (kept simple — no
          full-screen lightbox, since that's a fair bit more UI for a panel
          this size). */}
      <div style={{ padding: "0 16px", flexShrink: 0 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: "6px",
            height: "160px",
          }}
        >
          <div style={{ gridRow: "1 / 3", position: "relative", borderRadius: "12px", overflow: "hidden", cursor: "pointer" }} onClick={() => setGalleryIdx(g => (g + 1) % gallery.length)}>
            <img
              src={gallery[galleryIdx % gallery.length]}
              alt={pkg.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            {pkg.locations?.[0]?.name && (
              <div
                style={{
                  position: "absolute", left: 0, right: 0, bottom: 0,
                  padding: "20px 10px 8px",
                  background: "linear-gradient(180deg, rgba(30,27,75,0) 0%, rgba(30,27,75,0.7) 100%)",
                  color: "#fff", fontSize: "12px", fontWeight: 700,
                }}
              >
                {pkg.locations[0].name}
                {pkg.locations[0].altitude ? `, Sikkim` : ""}
              </div>
            )}
          </div>
          <img
            src={gallery[(galleryIdx + 1) % gallery.length]}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px", cursor: "pointer" }}
            onClick={() => setGalleryIdx(g => (g + 1) % gallery.length)}
          />
          <div
            style={{ position: "relative", width: "100%", height: "100%", borderRadius: "12px", overflow: "hidden", cursor: "pointer" }}
            onClick={() => setGalleryIdx(g => (g + 2) % gallery.length)}
          >
            <img
              src={gallery[(galleryIdx + 2) % gallery.length]}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {gallery.length > 3 && (
              <div
                style={{
                  position: "absolute", inset: 0, background: "rgba(30,27,75,0.55)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  color: "#fff", gap: "2px",
                }}
              >
                <Images size={16} aria-hidden="true" />
                <span style={{ fontSize: "11px", fontWeight: 700 }}>+{gallery.length - 3} Photos</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "6px", padding: "12px 16px 0", flexShrink: 0, overflowX: "auto" }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flexShrink: 0, border: "none", cursor: "pointer",
              padding: "6px 13px", borderRadius: "16px",
              fontSize: "11.5px", fontWeight: 700,
              background: tab === t.id ? PURPLE : PURPLE_LIGHT,
              color: tab === t.id ? "#fff" : PURPLE,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content — scrollable, fills remaining space above the price footer */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "14px 16px" }}>
        {tab === "overview" && (
          <div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: "#1e1b4b", lineHeight: 1.3 }}>
                {pkg.title}
              </h3>
              {typeof pkg.rating === "number" && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", flexShrink: 0, marginTop: "2px" }}>
                  <Star size={13} fill={PURPLE} color={PURPLE} aria-hidden="true" />
                  <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#1e1b4b" }}>{pkg.rating}</span>
                </div>
              )}
            </div>
            {pkg.locations?.length > 0 && (
              <p style={{ margin: "4px 0 0", fontSize: "12.5px", color: "#78716c", fontWeight: 500 }}>
                {pkg.locations.map((l: any) => l.name).join(" – ")}
              </p>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", margin: "8px 0 6px", fontSize: "12px", color: "#78716c" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                <Clock size={13} aria-hidden="true" /> {pkg.duration}
              </span>
              {(pkg.maxGuests ?? pkg.Guests) && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                  <Users size={13} aria-hidden="true" /> Up to {pkg.maxGuests ?? pkg.Guests}
                </span>
              )}
              {pkg.locations?.[0] && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                  <MapPin size={13} aria-hidden="true" /> Sikkim, India
                </span>
              )}
            </div>
            {typeof pkg.rating === "number" && (
              <p style={{ margin: "0 0 10px", fontSize: "12px", color: "#a394d8" }}>({pkg.reviewCount ?? 0} reviews)</p>
            )}
            <p style={{ margin: 0, fontSize: "13.5px", lineHeight: 1.65, color: "#44403c" }}>
              {pkg.shortDescription ?? pkg.description}
            </p>

            {/* Condensed previews — same content as the dedicated Permits/
                Inclusions tabs, shown here too so Overview gives the full
                at-a-glance picture like the reference design does. */}
            <div style={{ background: PURPLE_LIGHT, border: "1px solid #ddd6fe", borderRadius: "12px", padding: "14px", marginTop: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <ShieldCheck size={15} color={PURPLE} aria-hidden="true" />
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#1e1b4b" }}>Permits You Need</span>
                </div>
                <button
                  onClick={() => setTab("permits")}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 700, color: PURPLE, display: "flex", alignItems: "center", gap: "2px" }}
                >
                  Learn more →
                </button>
              </div>
              {permits.length === 0 ? (
                <p style={{ margin: 0, fontSize: "12.5px", color: "#78716c" }}>No special permits required for this route.</p>
              ) : (
                permits.map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: i < permits.length - 1 ? "10px" : 0 }}>
                    <CheckCircle2 size={15} color="#16a34a" style={{ flexShrink: 0, marginTop: "1px" }} aria-hidden="true" />
                    <div>
                      <p style={{ margin: 0, fontSize: "12.5px", fontWeight: 700, color: "#1e1b4b" }}>{p.name}</p>
                      <p style={{ margin: "2px 0 0", fontSize: "11.5px", color: "#78716c" }}>{p.note}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "14px", marginTop: "12px" }}>
              <p style={{ margin: "0 0 10px", fontSize: "13px", fontWeight: 700, color: "#1e1b4b" }}>Inclusions</p>
              {renderInclusionsGrid(4)}
            </div>
          </div>
        )}

        {tab === "itinerary" && (
          <div>
            {(pkg.itinerary ?? []).map((day: any, i: number) => (
              <div key={i} style={{ marginBottom: "14px", paddingBottom: "12px", borderBottom: i < pkg.itinerary.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                <p style={{ margin: "0 0 6px", fontSize: "13.5px", fontWeight: 700, color: PURPLE }}>
                  Day {day.day}: {day.title}
                </p>
                {(day.activities ?? []).map((a: string, j: number) => (
                  <p key={j} style={{ margin: "0 0 3px", fontSize: "12.5px", lineHeight: 1.55, color: "#44403c" }}>
                    • {a}
                  </p>
                ))}
              </div>
            ))}
          </div>
        )}

        {tab === "inclusions" && (
          <div>
            <div
              style={{
                background: PURPLE_LIGHT, border: `1px solid #ddd6fe`, borderRadius: "12px",
                padding: "14px", marginBottom: "14px",
              }}
            >
              <p style={{ margin: "0 0 12px", fontSize: "11px", fontWeight: 700, color: "#78716c", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                What's Included
              </p>
              {renderInclusionsGrid()}
            </div>
            {pkg.exclusions?.length > 0 && (
              <>
                <p style={{ margin: "0 0 8px", fontSize: "11px", fontWeight: 700, color: "#78716c", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Not Included
                </p>
                {pkg.exclusions.map((exc: string, i: number) => (
                  <p key={i} style={{ margin: "0 0 4px", fontSize: "12px", color: "#a8a29e" }}>• {exc}</p>
                ))}
              </>
            )}
          </div>
        )}

        {tab === "permits" && (
          <div>
            <div
              style={{
                background: PURPLE_LIGHT, border: `1px solid #ddd6fe`, borderRadius: "12px",
                padding: "14px", marginBottom: "14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <ShieldCheck size={15} color={PURPLE} aria-hidden="true" />
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#1e1b4b" }}>Permits You Need</span>
                </div>
              </div>
              {permits.length === 0 ? (
                <p style={{ fontSize: "12.5px", color: "#78716c", margin: 0 }}>No special permits required for this route.</p>
              ) : (
                permits.map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: i < permits.length - 1 ? "12px" : 0 }}>
                    <CheckCircle2 size={15} color="#16a34a" style={{ flexShrink: 0, marginTop: "1px" }} aria-hidden="true" />
                    <div>
                      <p style={{ margin: 0, fontSize: "12.5px", fontWeight: 700, color: "#1e1b4b" }}>{p.name}</p>
                      <p style={{ margin: "2px 0 0", fontSize: "11.5px", color: "#78716c" }}>{p.note}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {pkg.requirements?.length > 0 && (
              <>
                <p style={{ margin: "0 0 8px", fontSize: "11px", fontWeight: 700, color: "#78716c", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Documents to Carry
                </p>
                {pkg.requirements.map((r: string, i: number) => (
                  <p key={i} style={{ margin: "0 0 4px", fontSize: "12px", color: "#44403c" }}>• {r}</p>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Price + actions footer */}
      <div style={{ flexShrink: 0, padding: "12px 16px", borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
        <div>
          {price != null ? (
            <>
              <p style={{ margin: 0, fontSize: "10.5px", color: "#a394d8", fontWeight: 600 }}>
                Price for {DEFAULT_GROUP_SIZE} People
              </p>
              <p style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#1e1b4b" }}>
                ₹{price.toLocaleString()}
              </p>
              <p style={{ margin: "1px 0 0", fontSize: "10.5px", color: "#a8a29e" }}>Total Package</p>
            </>
          ) : (
            <p style={{ margin: 0, fontSize: "12px", color: "#78716c" }}>Contact us for pricing</p>
          )}
        </div>
        <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
          <button
            onClick={toggleSaved}
            aria-label={isSaved ? "Remove from saved" : "Save this package"}
            style={{
              width: "38px", height: "38px", borderRadius: "50%", flexShrink: 0,
              border: `1px solid ${isSaved ? PURPLE : BORDER}`,
              background: isSaved ? PURPLE_LIGHT : "#fff",
              color: isSaved ? PURPLE : "#a8a29e",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Heart size={16} fill={isSaved ? PURPLE : "none"} aria-hidden="true" />
          </button>
          <button
            onClick={() => {
              onClose();
              navigate(`/destinations/${pkg.id}`);
            }}
            style={{
              background: PURPLE, color: "#fff", border: "none", borderRadius: "20px",
              padding: "0 16px", height: "38px", fontSize: "12.5px", fontWeight: 700,
              cursor: "pointer", whiteSpace: "nowrap",
              boxShadow: "0 2px 10px rgba(109,40,217,0.3)",
            }}
          >
            View Full Itinerary
          </button>
        </div>
      </div>
      </div>
      ) : (
        <div key={index} className="slide-card-in" style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          {/* Simple slide — bike/hotel/cab/event. No itinerary/permits tabs
              since those don't apply to these categories. */}
          <div style={{ padding: "0 16px", flexShrink: 0 }}>
            <div style={{ position: "relative", height: "180px", borderRadius: "14px", overflow: "hidden" }}>
              <img
                src={current.data.image}
                alt={current.data.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <span
                style={{
                  position: "absolute", top: "10px", left: "10px",
                  display: "inline-flex", alignItems: "center", gap: "5px",
                  background: "rgba(255,255,255,0.95)", color: PURPLE,
                  fontSize: "11px", fontWeight: 700, padding: "5px 11px", borderRadius: "20px",
                }}
              >
                {current.data.kind === "bike" && <Bike size={12} aria-hidden="true" />}
                {current.data.kind === "hotel" && <Hotel size={12} aria-hidden="true" />}
                {current.data.kind === "cab" && <Car size={12} aria-hidden="true" />}
                {current.data.kind === "event" && <PartyPopper size={12} aria-hidden="true" />}
                {current.data.badge}
              </span>
              <div
                style={{
                  position: "absolute", left: 0, right: 0, bottom: 0,
                  padding: "24px 12px 10px",
                  background: "linear-gradient(180deg, rgba(30,27,75,0) 0%, rgba(30,27,75,0.75) 100%)",
                }}
              >
                <p style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#fff", lineHeight: 1.3 }}>
                  {current.data.title}
                </p>
                <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#e0dcfa" }}>{current.data.subtitle}</p>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "16px" }}>
            {current.data.kind === "bike" && Array.isArray(current.data.bikes) ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <p style={{ margin: "0 0 2px", fontSize: "11px", fontWeight: 700, color: "#78716c", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Available Bikes
                </p>
                {current.data.bikes.map((b: any) => (
                  <div
                    key={b.id}
                    onClick={() => { onClose(); navigate(b.routeUrl); }}
                    style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "8px",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={b.image}
                      alt={b.title}
                      style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "8px", flexShrink: 0, background: "#f6f5f2" }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#1e1b4b" }}>{b.title}</p>
                      <p style={{ margin: "1px 0 0", fontSize: "11px", color: "#78716c" }}>{b.subtitle}</p>
                    </div>
                    {b.price && (
                      <p style={{ margin: 0, fontSize: "12.5px", fontWeight: 700, color: PURPLE, flexShrink: 0 }}>{b.price}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: "13.5px", lineHeight: 1.65, color: "#44403c" }}>
                {current.data.description}
              </p>
            )}
          </div>

          <div style={{ flexShrink: 0, padding: "12px 16px", borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
            <div>
              {current.data.price ? (
                <p style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#1e1b4b" }}>{current.data.price}</p>
              ) : (
                <p style={{ margin: 0, fontSize: "12px", color: "#78716c" }}>Contact us for pricing</p>
              )}
            </div>
            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              <button
                onClick={toggleSaved}
                aria-label={isSaved ? "Remove from saved" : "Save this"}
                style={{
                  width: "38px", height: "38px", borderRadius: "50%", flexShrink: 0,
                  border: `1px solid ${isSaved ? PURPLE : BORDER}`,
                  background: isSaved ? PURPLE_LIGHT : "#fff",
                  color: isSaved ? PURPLE : "#a8a29e",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Heart size={16} fill={isSaved ? PURPLE : "none"} aria-hidden="true" />
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigate(current.data.routeUrl);
                }}
                style={{
                  background: PURPLE, color: "#fff", border: "none", borderRadius: "20px",
                  padding: "0 16px", height: "38px", fontSize: "12.5px", fontWeight: 700,
                  cursor: "pointer", whiteSpace: "nowrap",
                  boxShadow: "0 2px 10px rgba(109,40,217,0.3)",
                }}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}