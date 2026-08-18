import { useState, useMemo } from "react";
import {
  Users,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  MapPin,
  Calendar,
  Clock,
  Search,
  ArrowLeftRight,
} from "lucide-react";
import cabsData, { getRoutePrice, getStartingPrice } from "../../data/cabs";
import { Link, useNavigate } from "react-router-dom";

const SIKKIM_PLACES = [
  "Gangtok",
  "Siliguri",
  "Namchi",
  "Singtam",
  "Mangan",
  "Rangpo",
];

type SortOption = "any" | "price_asc" | "price_desc" | "rating_desc" | "capacity_asc";

const allFeatures = Array.from(new Set(cabsData.flatMap((c) => c.features))).filter(Boolean);
const allCompanies = Array.from(new Set(cabsData.map((c) => c.company))).filter(Boolean);
const capacityGroups = ["Compact (≤4 seats)", "Mid-size (5-6 seats)", "Large (7+ seats)"];

function getCapacityLabel(cap: number) {
  if (cap <= 4) return "Compact (≤4 seats)";
  if (cap <= 6) return "Mid-size (5-6 seats)";
  return "Large (7+ seats)";
}

function formatINR(amount: number) {
  return "₹" + amount.toLocaleString("en-IN");
}

function StarBadge({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded shadow">
      <Star className="w-3 h-3 fill-white" />
      {rating.toFixed(1)}
    </span>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-violet-50 border border-violet-200 text-violet-700 text-xs font-medium px-3 py-1 rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-violet-900 leading-none">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 py-4">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-left">
        <span className="text-xs font-bold text-slate-600 tracking-widest uppercase">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

function CheckItem({ label, count, checked, onChange }: { label: string; count: number; checked: boolean; onChange: () => void; }) {
  return (
    <label className="flex items-center justify-between gap-2 cursor-pointer group">
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={checked} onChange={onChange} className="w-4 h-4 rounded accent-violet-600 cursor-pointer" />
        <span className="text-sm text-slate-600 group-hover:text-violet-600 transition-colors">{label}</span>
      </div>
      <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">{count}</span>
    </label>
  );
}

function CabCard({ cab, onBook, appliedFrom, appliedTo }: { cab: (typeof cabsData)[0]; onBook: () => void; appliedFrom: string; appliedTo: string; }) {
  const routePrice = appliedTo ? getRoutePrice(appliedFrom, appliedTo, cab.category) : null;
  const displayPrice = routePrice ?? getStartingPrice(cab, appliedFrom);
  const isExactRoute = routePrice !== null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col sm:flex-row hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="sm:w-52 shrink-0 relative">
        <img src={cab.image} alt={cab.cab_name} className="w-full h-48 sm:h-full object-cover" />
        <div className="absolute top-3 left-3"><StarBadge rating={cab.rating} /></div>
      </div>
      <div className="flex flex-col flex-1 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-800">{cab.cab_name}</h3>
            <p className="text-sm text-slate-500">{cab.company}</p>
            {appliedTo && (
              <span className="inline-flex items-center gap-1 mt-1 text-xs text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-full">
                <MapPin className="w-3 h-3" /> Available to {appliedTo}
              </span>
            )}
          </div>
          <div className="text-right">
            <p className="text-2xl font-extrabold text-slate-800">{formatINR(displayPrice)}</p>
            <p className="text-xs text-slate-400">{isExactRoute ? `one-way · ${appliedFrom} → ${appliedTo}` : "starting from · one-way"}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {cab.features.filter(Boolean).map((f) => (
            <span key={f} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">{f}</span>
          ))}
        </div>
        <div className="mt-3">
          <p className="text-xs text-slate-400 mb-1.5">Serves destinations:</p>
          <div className="flex flex-wrap gap-1">
            {cab.destinations.filter(Boolean).map((d) => (
              <span key={d} className={`text-xs px-2 py-0.5 rounded-full border font-medium transition-colors ${d === appliedTo ? "bg-violet-600 text-white border-violet-600" : "bg-slate-50 text-slate-500 border-slate-200"}`}>{d}</span>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between mt-auto pt-4 gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Users className="w-4 h-4 text-violet-500" />
            <span className="text-sm">{cab.capacity} Seats</span>
          </div>
          <button onClick={onBook} className="px-7 py-2.5 text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md hover:opacity-90 hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)" }}>
            Select Cab
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CabsListingPage() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("10:00");
  const [appliedFrom, setAppliedFrom] = useState("");
  const [appliedTo, setAppliedTo] = useState("");
  const [selectedCapacity, setSelectedCapacity] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(Infinity);
  const [sort, setSort] = useState<SortOption>("any");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggle = <T,>(arr: T[], val: T) => arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  const swapLocations = () => { const prev = from; setFrom(to || prev); setTo(prev); };

  const handleSearch = () => {
    setAppliedFrom(from);
    setAppliedTo(to);
    setSelectedCapacity([]);
    setSelectedFeatures([]);
    setSelectedCompanies([]);
    setMaxPrice(Infinity);
  };

  const handleFromChange = (val: string) => {
    setFrom(val);
  };

  const handleToChange = (val: string) => {
    setTo(val);
  };

  const clearAll = () => {
    setSelectedCapacity([]);
    setSelectedFeatures([]);
    setSelectedCompanies([]);
    setMaxPrice(Infinity);
    setSort("price_asc");
    setAppliedTo("");
    setTo("");
  };

  const countFor = {
    capacity: (label: string) => cabsData.filter((c) => getCapacityLabel(c.capacity) === label).length,
    feature: (f: string) => cabsData.filter((c) => c.features.includes(f)).length,
    company: (co: string) => cabsData.filter((c) => c.company === co).length,
  };

  const effectivePrice = (cab: (typeof cabsData)[0]): number => {
    if (appliedTo) return getRoutePrice(appliedFrom, appliedTo, cab.category) ?? Infinity;
    return getStartingPrice(cab, appliedFrom);
  };

  const filtered = useMemo(() => {
    const list = cabsData.filter((cab) => {
      if (appliedTo && getRoutePrice(appliedFrom, appliedTo, cab.category) === null) return false;
      const price = effectivePrice(cab);
      if (maxPrice !== Infinity && price > maxPrice) return false;
      if (selectedCapacity.length && !selectedCapacity.includes(getCapacityLabel(cab.capacity))) return false;
      if (selectedCompanies.length && !selectedCompanies.includes(cab.company)) return false;
      if (selectedFeatures.length && !selectedFeatures.every((f) => cab.features.includes(f))) return false;
      return true;
    });
    return [...list].sort((a, b) => {
      if (sort === "any") return 0;
      if (sort === "price_asc") return effectivePrice(a) - effectivePrice(b);
      if (sort === "price_desc") return effectivePrice(b) - effectivePrice(a);
      if (sort === "rating_desc") return b.rating - a.rating;
      if (sort === "capacity_asc") return a.capacity - b.capacity;
      return 0;
    });
  }, [appliedFrom, appliedTo, selectedCapacity, selectedFeatures, selectedCompanies, maxPrice, sort]);

  const activeFilterCount =
    selectedCapacity.length + selectedFeatures.length + selectedCompanies.length +
    (maxPrice !== Infinity ? 1 : 0) + (appliedTo ? 1 : 0);

  const allPrices = cabsData.map((c) => effectivePrice(c)).filter((p) => p < Infinity);
  const sliderMin = allPrices.length ? Math.min(...allPrices) : 0;
  const sliderMax = allPrices.length ? Math.ceil(Math.max(...allPrices) / 500) * 500 : 10000;

  const goToBooking = (cab: (typeof cabsData)[0]) => {
    const price = appliedTo
      ? getRoutePrice(appliedFrom, appliedTo, cab.category) ?? getStartingPrice(cab, appliedFrom)
      : getStartingPrice(cab, appliedFrom);
    navigate(`/cabs/book/${cab.id}?from=${encodeURIComponent(appliedFrom)}&to=${encodeURIComponent(appliedTo)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}&price=${price}`);
  };

  const FilterPanel = () => (
    <div>
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-1">
        <h2 className="font-bold text-slate-800 text-base">Filters</h2>
        {activeFilterCount > 0 && (
          <button onClick={clearAll} className="text-xs text-violet-600 font-semibold hover:underline">Clear All</button>
        )}
      </div>
      <FilterSection title="Max Fare">
        <input type="range" min={sliderMin} max={sliderMax} step={100}
          value={maxPrice === Infinity ? sliderMax : Math.min(maxPrice, sliderMax)}
          onChange={(e) => { const val = Number(e.target.value); setMaxPrice(val >= sliderMax ? Infinity : val); }}
          className="w-full accent-violet-600 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>{formatINR(sliderMin)}</span>
          <span className="font-semibold text-violet-600">{maxPrice === Infinity ? "Any" : formatINR(maxPrice)}</span>
          <span>{formatINR(sliderMax)}</span>
        </div>
        {appliedTo && <p className="text-xs text-slate-400 mt-1">Fares for {appliedFrom} → {appliedTo}</p>}
      </FilterSection>
      <FilterSection title="Capacity" defaultOpen={false}>
        {capacityGroups.map((cap) => (
          <CheckItem key={cap} label={cap} count={countFor.capacity(cap)} checked={selectedCapacity.includes(cap)} onChange={() => setSelectedCapacity(toggle(selectedCapacity, cap))} />
        ))}
      </FilterSection>
      <FilterSection title="Car model" defaultOpen={false}>
        {allCompanies.map((co) => (
          <CheckItem key={co} label={co} count={countFor.company(co)} checked={selectedCompanies.includes(co)} onChange={() => setSelectedCompanies(toggle(selectedCompanies, co))} />
        ))}
      </FilterSection>
      <FilterSection title="Features" defaultOpen={false}>
        {allFeatures.map((f) => (
          <CheckItem key={f} label={f} count={countFor.feature(f)} checked={selectedFeatures.includes(f)} onChange={() => setSelectedFeatures(toggle(selectedFeatures, f))} />
        ))}
      </FilterSection>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Hero booking bar ── */}
      <div style={{ background: "linear-gradient(135deg, #1a1035 0%, #4c1d95 40%, #4f46e5 100%)", position: "relative", overflow: "hidden" }}>

        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(124,58,237,0.2)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "30%", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(79,70,229,0.15)", pointerEvents: "none" }} />

        <div className="max-w-7xl mx-auto px-4 pt-5 pb-1 relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <span style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)", fontSize: "10px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", padding: "3px 12px", borderRadius: "20px" }}>
              Outstation · One-Way
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-5 relative z-10">
          <div className="flex flex-wrap lg:flex-nowrap items-stretch gap-2">
            {/* From */}
            <div className="flex-1 min-w-[130px] rounded-lg px-3 py-2 flex flex-col gap-0.5 border border-white/20 focus-within:border-white/60 transition-colors" style={{ background: "rgba(255,255,255,0.08)" }}>
              <label className="text-[10px] font-bold text-violet-200 tracking-widest uppercase flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" /> From
              </label>
              <select value={from} onChange={(e) => handleFromChange(e.target.value)} className="bg-transparent text-white font-semibold text-sm focus:outline-none cursor-pointer appearance-none">
                <option value="" className="text-slate-400 bg-white">Select origin</option>
                {SIKKIM_PLACES.map((p) => (<option key={p} value={p} className="text-slate-800 bg-white">{p}</option>))}
              </select>
            </div>

            {/* Swap */}
            <button onClick={swapLocations} title="Swap locations" className="self-center rounded-full w-8 h-8 flex items-center justify-center shrink-0 transition-colors shadow-md border border-white/30" style={{ background: "rgba(255,255,255,0.15)" }}>
              <ArrowLeftRight className="w-4 h-4 text-white" />
            </button>

            {/* To */}
            <div className={`flex-1 min-w-[130px] rounded-lg px-3 py-2 flex flex-col gap-0.5 border transition-colors ${to ? "border-white/60" : "border-white/20 focus-within:border-white/60"}`} style={{ background: "rgba(255,255,255,0.08)" }}>
              <label className="text-[10px] font-bold text-violet-200 tracking-widest uppercase flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" /> To
              </label>
              <select value={to} onChange={(e) => handleToChange(e.target.value)} className="bg-transparent text-white font-semibold text-sm focus:outline-none cursor-pointer appearance-none">
                <option value="" className="text-slate-400 bg-white">Select destination</option>
                {SIKKIM_PLACES.filter((p) => p !== from).map((p) => (<option key={p} value={p} className="text-slate-800 bg-white">{p}</option>))}
              </select>
            </div>

            {/* Date */}
            <div className="flex-1 min-w-[140px] rounded-lg px-3 py-2 flex flex-col gap-0.5 border border-white/20 focus-within:border-white/60 transition-colors" style={{ background: "rgba(255,255,255,0.08)" }}>
              <label className="text-[10px] font-bold text-violet-200 tracking-widest uppercase flex items-center gap-1">
                <Calendar className="w-2.5 h-2.5" /> Pick-up Date
              </label>
              <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)} className="bg-transparent text-white font-semibold text-sm focus:outline-none cursor-pointer [color-scheme:dark]" />
            </div>

            {/* Time */}
            <div className="flex-1 min-w-[120px] rounded-lg px-3 py-2 flex flex-col gap-0.5 border border-white/20 focus-within:border-white/60 transition-colors" style={{ background: "rgba(255,255,255,0.08)" }}>
              <label className="text-[10px] font-bold text-violet-200 tracking-widest uppercase flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" /> Pick-up Time
              </label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="bg-transparent text-white font-semibold text-sm focus:outline-none cursor-pointer [color-scheme:dark]" />
            </div>

            {/* Search */}
            <button onClick={handleSearch} className="shrink-0 active:scale-95 font-extrabold text-sm px-8 rounded-lg flex items-center gap-2 shadow-lg transition-all duration-150 min-h-[58px]" style={{ background: "linear-gradient(135deg, #fff 0%, #f0eaff 100%)", color: "#6d28d9" }}>
              <Search className="w-4 h-4" /> SEARCH
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex gap-6 mt-3">
            {[{ icon: "🏅", label: "Trusted Drivers" }, { icon: "✅", label: "Clean Cabs" }, { icon: "⏱️", label: "On-Time Pickup" }].map((b) => (
              <span key={b.label} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>{b.icon} {b.label}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6 items-start">
        {/* Desktop filter sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 bg-white rounded-xl shadow-sm border border-slate-100 p-5 sticky top-[120px]">
          <FilterPanel />
        </aside>

        <main className="flex-1 min-w-0">
          {appliedTo && (
            <div className="mb-4 flex items-center gap-3 text-white px-4 py-3 rounded-xl shadow-sm" style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
              <MapPin className="w-4 h-4 shrink-0" />
              <p className="text-sm font-semibold flex-1">
                Cabs from <span className="font-bold">{appliedFrom}</span> → <span className="font-bold">{appliedTo}</span>
                {date && <span className="font-normal" style={{ color: "rgba(255,255,255,0.7)" }}> · {new Date(date).toDateString()}</span>}
                {time && <span className="font-normal" style={{ color: "rgba(255,255,255,0.7)" }}> · {time}</span>}
              </p>
              <button onClick={() => { setAppliedTo(""); setTo(""); }} className="flex items-center gap-1 text-xs font-semibold shrink-0" style={{ color: "rgba(255,255,255,0.7)" }}>
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <p className="text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-800">{filtered.length}</span> cabs
              {activeFilterCount > 0 && <span className="ml-2 text-violet-600 font-medium">({activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active)</span>}
            </p>
            <div className="flex items-center gap-3">
              <button onClick={() => setDrawerOpen(true)} className="lg:hidden flex items-center gap-2 text-sm font-semibold text-violet-600 border border-violet-200 rounded-lg px-3 py-1.5 bg-white shadow-sm">
                <SlidersHorizontal className="w-4 h-4" /> Filters
                {activeFilterCount > 0 && <span className="bg-violet-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{activeFilterCount}</span>}
              </button>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm">
                <span className="text-xs text-slate-500 font-medium">Sort:</span>
                <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)} className="text-sm font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer">
                  <option value="any">Any</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating_desc">Rating: Best First</option>
                  <option value="capacity_asc">Capacity: Small First</option>
                </select>
              </div>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {appliedTo && <Chip label={`To: ${appliedTo}`} onRemove={() => { setAppliedTo(""); setTo(""); }} />}
              {selectedCapacity.map((c) => <Chip key={c} label={c} onRemove={() => setSelectedCapacity(toggle(selectedCapacity, c))} />)}
              {selectedCompanies.map((c) => <Chip key={c} label={c} onRemove={() => setSelectedCompanies(toggle(selectedCompanies, c))} />)}
              {selectedFeatures.map((f) => <Chip key={f} label={f} onRemove={() => setSelectedFeatures(toggle(selectedFeatures, f))} />)}
              {maxPrice !== Infinity && <Chip label={`Max ${formatINR(maxPrice)}`} onRemove={() => setMaxPrice(Infinity)} />}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-16 text-center">
              <p className="text-5xl mb-4">🚗</p>
              <p className="font-semibold text-slate-700 text-lg">{appliedTo ? `No cabs available from ${appliedFrom} to ${appliedTo}` : "No cabs match your filters"}</p>
              <p className="text-sm text-slate-400 mt-1 mb-5">{appliedTo ? "Try a different route or remove some filters" : "Try adjusting your filters"}</p>
              <button onClick={clearAll} className="text-violet-600 text-sm font-semibold border border-violet-200 rounded-lg px-5 py-2 hover:bg-violet-50 transition-colors">Clear all filters</button>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((cab) => (
                <CabCard key={cab.id} cab={cab} appliedFrom={appliedFrom} appliedTo={appliedTo} onBook={() => goToBooking(cab)} />
              ))}
            </div>
          )}

          {/* ── CTA Banner — rich gradient ── */}
          <div className="mt-10 rounded-2xl overflow-hidden shadow-xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative"
            style={{ background: "linear-gradient(135deg, #2e1065 0%, #6d28d9 45%, #4338ca 100%)" }}>
            {/* Decorative circles inside banner */}
            <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-40px", left: "40%", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

            <div className="text-white relative z-10">
              <p className="text-xl font-bold">Ready for your Himalayan journey?</p>
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>Book a cab and explore Sikkim at your pace</p>
            </div>
            <div className="flex gap-3 shrink-0 flex-wrap justify-center relative z-10">
              <Link to="/destinations">
                <button className="px-6 py-2.5 font-semibold rounded-xl text-sm transition-all hover:-translate-y-0.5 shadow-lg" style={{ background: "linear-gradient(135deg, #fff 0%, #f0eaff 100%)", color: "#6d28d9" }}>
                  Explore Destinations →
                </button>
              </Link>
              <Link to="/contact">
                <button className="px-6 py-2.5 font-semibold rounded-xl text-sm hover:-translate-y-0.5 transition-all text-white" style={{ border: "1.5px solid rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.1)" }}>
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </main>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <div className="relative ml-auto w-80 max-w-full bg-white h-full overflow-y-auto p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-800">Filters</h3>
              <button onClick={() => setDrawerOpen(false)}><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <FilterPanel />
            <button onClick={() => setDrawerOpen(false)} className="mt-6 w-full py-3 text-white font-semibold rounded-xl transition-colors" style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
              Show {filtered.length} Cabs
            </button>
          </div>
        </div>
      )}
    </div>
  );
}