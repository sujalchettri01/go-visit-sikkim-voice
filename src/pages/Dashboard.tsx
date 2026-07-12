import { useEffect, useState } from "react";
import { getCookie } from "../utils/cookie";
import apiFetch from "../wrapper/apiCall";
import { useNavigate } from "react-router-dom";
import { MoveLeft } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface User {
  userId: number;
  email: string;
  role: string;
}

interface Payment {
  id: number;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  amount: number;
  currency: string;
  status: "CREATED" | "PAID" | "FAILED" | "REFUNDED";
  paid_at: string | null;
}

interface PackageBooking {
  id: number;
  booking_ref: string;
  name: string;
  email: string;
  primary_phone: string;
  pickup_location: string;
  datetime: string;
  number_of_people: number;
  package_name: string;
  status: string;
  total_price: number;
  createdAt: string;
  payment?: Payment | null;
}

interface ActivityBooking {
  id: number;
  activity_name: string;
  startDate: string;
  pickUpLocation: string;
  email: string;
  primaryPhone: string;
  secondaryPhone: string;
  status: string;
  totalCost: string;
  payment?: Payment | null;
}

interface VehicleBooking {
  id: number;
  cab_name: string;
  tripType: string;
  pickUpLocation: string;
  dropLocation: string;
  pickUpDate: string;
  pickUpTime: string;
  name: string;
  email: string;
  numberOfPeople: number;
  totalCost: string;
  status: string;
  createdAt: string;
  payment: Payment | null;
}

interface BikeBooking {
  id: number;
  bike_name: string;
  bookingDate: string;
  bookingTime: string;
  name: string;
  email: string;
  numberOfPeople: number;
  totalCost: string;
  status: string;
  createdAt: string;
  payment?: Payment | null;
}

interface HotelBooking {
  id: number;
  hotel_name: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfRooms: number;
  roomType: string;
  name: string;
  email: string;
  totalCost: string;
  status: string;
  createdAt: string;
  payment?: Payment | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function decodeToken(token: string): User | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload)) as User;
  } catch {
    return null;
  }
}

const fmtDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const fmtDateTime = (date: string) =>
  new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const fmtCurrency = (val: string | number) =>
  "₹" + Number(val).toLocaleString("en-IN");

const fmtPaise = (val: number) =>
  "₹" + (val / 100).toLocaleString("en-IN");

// ─── Payment Modal ────────────────────────────────────────────────────────────

interface PaymentModalProps {
  payment: Payment | null | undefined;
  bookingLabel: string;
  bookingId: number;
  onClose: () => void;
}

const PaymentModal = ({ payment, bookingLabel, bookingId, onClose }: PaymentModalProps) => {
  const statusConfig = {
    PAID: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-400", label: "Paid" },
    CREATED: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-400", label: "Pending" },
    FAILED: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-400", label: "Failed" },
    REFUNDED: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200", dot: "bg-sky-400", label: "Refunded" },
  };

  const s = payment ? (statusConfig[payment.status] ?? statusConfig.CREATED) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{ animation: "modalIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Payment Details</p>
            <h2 className="text-base font-bold text-slate-800 mt-0.5">{bookingLabel} #{bookingId}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-500 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {!payment ? (
            <div className="py-8 flex flex-col items-center gap-3 text-slate-300">
              <span className="text-5xl">💳</span>
              <p className="text-sm font-medium text-slate-400">No payment record found</p>
              <p className="text-xs text-slate-300">This booking may not have been paid yet.</p>
            </div>
          ) : (
            <>
              {/* Status pill */}
              {s && (
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${s.bg} ${s.border}`}>
                  <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                  <span className={`text-xs font-bold uppercase tracking-wide ${s.text}`}>{s.label}</span>
                </div>
              )}

              {/* Amount */}
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Amount</p>
                <p className="text-3xl font-black text-slate-800">{fmtPaise(payment.amount)}</p>
                <p className="text-xs text-slate-400 mt-1">{payment.currency}</p>
              </div>

              {/* Details grid */}
              <div className="space-y-3">
                {[
                  { label: "Order ID", value: payment.razorpay_order_id, mono: true },
                  { label: "Payment ID", value: payment.razorpay_payment_id ?? "—", mono: true },
                  { label: "Paid At", value: payment.paid_at ? fmtDateTime(payment.paid_at) : "—", mono: false },
                ].map(({ label, value, mono }) => (
                  <div key={label} className="flex justify-between items-start gap-4 py-2.5 border-b border-slate-50">
                    <span className="text-xs font-semibold text-slate-400 shrink-0">{label}</span>
                    <span className={`text-xs text-slate-700 text-right break-all ${mono ? "font-mono" : "font-medium"}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Pagination ───────────────────────────────────────────────────────────────

const ROWS_PER_PAGE = 5;

function usePagination<T>(data: T[]) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);
  const paginated = data.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  // Reset to page 1 when data changes
  useEffect(() => { setPage(1); }, [data.length]);

  return { page, setPage, totalPages, paginated };
}

const Pagination = ({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 px-5 py-3 border-t border-slate-100">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 text-sm font-bold transition-colors flex items-center justify-center"
      >
        ‹
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
            p === page
              ? "bg-slate-800 text-white"
              : "bg-slate-100 hover:bg-slate-200 text-slate-600"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 text-sm font-bold transition-colors flex items-center justify-center"
      >
        ›
      </button>
    </div>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  const s = status.toLowerCase();
  const map: Record<string, { dot: string; pill: string }> = {
    pending: { dot: "bg-amber-400", pill: "bg-amber-50 text-amber-700 border-amber-200" },
    confirmed: { dot: "bg-emerald-400", pill: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    cancelled: { dot: "bg-red-400", pill: "bg-red-50 text-red-700 border-red-200" },
    completed: { dot: "bg-sky-400", pill: "bg-sky-50 text-sky-700 border-sky-200" },
  };
  const style = map[s] ?? { dot: "bg-slate-400", pill: "bg-slate-50 text-slate-600 border-slate-200" };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${style.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
};

// ─── Payment Pill (inline in table) ──────────────────────────────────────────

const PaymentPill = ({ payment }: { payment: Payment | null | undefined }) => {
  if (!payment) return <span className="text-slate-300 text-xs italic">No payment</span>;
  const map = {
    PAID: { dot: "bg-emerald-400", pill: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Paid" },
    CREATED: { dot: "bg-amber-400", pill: "bg-amber-50 text-amber-700 border-amber-200", label: "Pending" },
    FAILED: { dot: "bg-red-400", pill: "bg-red-50 text-red-700 border-red-200", label: "Failed" },
    REFUNDED: { dot: "bg-sky-400", pill: "bg-sky-50 text-sky-700 border-sky-200", label: "Refunded" },
  };
  const s = map[payment.status] ?? map.CREATED;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = ({ icon, label }: { icon: string; label: string }) => (
  <div className="py-14 flex flex-col items-center gap-3 text-slate-300">
    <span className="text-5xl">{icon}</span>
    <p className="text-sm font-medium text-slate-400">No {label} yet</p>
  </div>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const Skeleton = () => (
  <div className="space-y-3 p-6">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" style={{ opacity: 1 - i * 0.25 }} />
    ))}
  </div>
);

// ─── Summary Card ─────────────────────────────────────────────────────────────

const SummaryCard = ({ icon, label, value, sub, from, to, delay }: {
  icon: string; label: string; value: string | number; sub?: string; from: string; to: string; delay: number;
}) => (
  <div
    className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg"
    style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`, animation: `fadeSlideIn 0.5s ease-out ${delay}ms both` }}
  >
    <div className="absolute -right-3 -top-3 text-7xl opacity-[0.08] select-none pointer-events-none leading-none">{icon}</div>
    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/60 mb-2">{label}</p>
    <p className="text-[2rem] font-black leading-none">{value}</p>
    {sub && <p className="text-xs text-white/50 mt-1.5 font-medium">{sub}</p>}
  </div>
);

// ─── Section Card ─────────────────────────────────────────────────────────────

const SectionCard = ({ icon, title, count, accentClass, loading, empty, children }: {
  icon: string; title: string; count: number; accentClass: string;
  loading: boolean; empty: boolean; children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <div className={`px-5 py-4 flex items-center justify-between ${accentClass}`}>
      <div className="flex items-center gap-2.5">
        <span className="text-lg">{icon}</span>
        <h2 className="text-sm font-bold text-slate-800 tracking-tight">{title}</h2>
      </div>
      <span className="text-[11px] font-semibold bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-slate-500 border border-white/60 shadow-sm">
        {count} {count === 1 ? "booking" : "bookings"}
      </span>
    </div>
    {loading ? <Skeleton /> : empty ? <EmptyState icon={icon} label={title.toLowerCase()} /> : <div className="overflow-x-auto">{children}</div>}
  </div>
);

// ─── Table Primitives ─────────────────────────────────────────────────────────

const Table = ({ children }: { children: React.ReactNode }) => (
  <table className="w-full min-w-[640px]">{children}</table>
);
const THead = ({ children }: { children: React.ReactNode }) => (
  <thead><tr className="border-b border-slate-100 bg-slate-50/60">{children}</tr></thead>
);
const TH = ({ children }: { children: React.ReactNode }) => (
  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 whitespace-nowrap">{children}</th>
);
const TR = ({ children, onClick, delay = 0 }: { children: React.ReactNode; onClick?: () => void; delay?: number }) => (
  <tr
    className={`border-b border-slate-50 transition-colors duration-100 group ${onClick ? "cursor-pointer hover:bg-indigo-50/60" : "hover:bg-slate-50/70"}`}
    style={{ animation: `fadeSlideIn 0.35s ease-out ${delay}ms both` }}
    onClick={onClick}
  >
    {children}
  </tr>
);
const TD = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap ${className}`}>{children}</td>
);

// ─── Click hint ───────────────────────────────────────────────────────────────

const ClickHint = () => (
  <p className="text-[10px] text-slate-400 px-5 py-2 border-t border-slate-50 bg-slate-50/50 text-center">
    💳 Click any row to view payment details
  </p>
);

// ─── Tab Button ───────────────────────────────────────────────────────────────

const TabBtn = ({ active, onClick, icon, label, count }: {
  active: boolean; onClick: () => void; icon: string; label: string; count: number;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
      active ? "bg-slate-800 text-white shadow-md scale-[1.02]" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
    }`}
  >
    <span>{icon}</span>
    <span>{label}</span>
    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${active ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"}`}>
      {count}
    </span>
  </button>
);

// ─── Main Component ───────────────────────────────────────────────────────────

type Tab = "all" | "packages" | "cabs" | "bikes" | "hotels" | "activities";

interface ModalState {
  payment: Payment | null | undefined;
  bookingLabel: string;
  bookingId: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [modal, setModal] = useState<ModalState | null>(null);
  const navigate = useNavigate();
  const [packages, setPackages] = useState<PackageBooking[]>([]);
  const [cabs, setCabs] = useState<VehicleBooking[]>([]);
  const [bikes, setBikes] = useState<BikeBooking[]>([]);
  const [hotels, setHotels] = useState<HotelBooking[]>([]);
  const [activities, setActivities] = useState<ActivityBooking[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination hooks per table
  const pkgPag = usePagination(packages);
  const cabPag = usePagination(cabs);
  const bikePag = usePagination(bikes);
  const hotelPag = usePagination(hotels);
  const actPag = usePagination(activities);

  useEffect(() => {
    const token = getCookie("token");
    if (token) setUser(decodeToken(token));

    const fetchAll = async () => {
      try {
        const url = import.meta.env.VITE_BASE_URL;
        const [pkgRes, cabRes, bikeRes, hotelRes, actRes] = await Promise.all([
          apiFetch(`${url}/package-bookings`),
          apiFetch(`${url}/vehicle-bookings`),
          apiFetch(`${url}/bike-bookings`),
          apiFetch(`${url}/accommodation-bookings`),
          apiFetch(`${url}/activity-bookings`),
        ]);
        if (pkgRes)   { const d = await pkgRes.json();   if (d.success) setPackages(d.data); }
        if (cabRes)   { const d = await cabRes.json();   if (d.success) setCabs(d.data); }
        if (bikeRes)  { const d = await bikeRes.json();  if (d.success) setBikes(d.data); }
        if (hotelRes) { const d = await hotelRes.json(); if (d.success) setHotels(d.data); }
        if (actRes)   { const d = await actRes.json();   if (d.success) setActivities(d.data); }
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const openModal = (payment: Payment | null | undefined, bookingLabel: string, bookingId: number) => {
    setModal({ payment, bookingLabel, bookingId });
  };

  const totalBookings = packages.length + cabs.length + bikes.length + hotels.length + activities.length;
  const totalSpend =
    packages.reduce((s, b) => s + Number(b.total_price), 0) +
    cabs.reduce((s, b) => s + Number(b.totalCost), 0) +
    bikes.reduce((s, b) => s + Number(b.totalCost), 0) +
    hotels.reduce((s, b) => s + Number(b.totalCost), 0) +
    activities.reduce((s, b) => s + Number(b.totalCost), 0);

  const show = (tab: Tab) => activeTab === "all" || activeTab === tab;

  return (
    <>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      {/* Payment Modal */}
      {modal && (
        <PaymentModal
          payment={modal.payment}
          bookingLabel={modal.bookingLabel}
          bookingId={modal.bookingId}
          onClose={() => setModal(null)}
        />
      )}

      <div className="min-h-screen bg-[#f5f5f7] px-4 py-8 md:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 cursor-pointer" onClick={() => navigate("/")}>
            <MoveLeft size={16} />
            <span>Go Back to Visit Sikkim</span>
          </div>
           
          {/* ── Welcome ── */}
          <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: "linear-gradient(120deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)", animation: "fadeSlideIn 0.5s ease-out both" }}>
            <div className="px-7 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">My Bookings Dashboard</p>
                <h1 className="text-2xl font-black text-white leading-tight">
                  {user?.email ? `Hello, ${user.email.split("@")[0]} 👋` : "Welcome back 👋"}
                </h1>
                <p className="text-xs text-slate-400 mt-1 capitalize">
                  Role: <span className="text-slate-300 font-semibold">{user?.role ?? "—"}</span>
                </p>
              </div>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {user?.email?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div>
                  <p className="text-xs text-slate-300 font-medium">{user?.email ?? "—"}</p>
                  <p className="text-[10px] text-slate-500">ID #{user?.userId ?? "—"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Summary Cards ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <SummaryCard icon="📋" label="Total Bookings" value={totalBookings} sub="across all categories" from="#6366f1" to="#8b5cf6" delay={0} />
            <SummaryCard icon="💰" label="Total Spent" value={fmtCurrency(totalSpend)} sub="combined spend" from="#0ea5e9" to="#06b6d4" delay={80} />
            <SummaryCard icon="🏨" label="Hotel Stays" value={hotels.length} sub="accommodation bookings" from="#f59e0b" to="#f97316" delay={160} />
            <SummaryCard icon="🧳" label="Packages" value={packages.length} sub="tour packages booked" from="#10b981" to="#059669" delay={240} />
            <SummaryCard icon="🎯" label="Activities" value={activities.length} sub="activity bookings" from="#C78B1C" to="#9ED91E" delay={320} />
          </div>

          {/* ── Tabs ── */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {([
              { id: "all", icon: "🗂️", label: "All", count: totalBookings },
              { id: "packages", icon: "🧳", label: "Packages", count: packages.length },
              { id: "cabs", icon: "🚖", label: "Cabs", count: cabs.length },
              { id: "bikes", icon: "🏍️", label: "Bikes", count: bikes.length },
              { id: "hotels", icon: "🏨", label: "Hotels", count: hotels.length },
              { id: "activities", icon: "🎯", label: "Activities", count: activities.length },
            ] as const).map((t) => (
              <TabBtn key={t.id} active={activeTab === t.id} onClick={() => setActiveTab(t.id)} icon={t.icon} label={t.label} count={t.count} />
            ))}
          </div>

          {/* ── Package Bookings ── */}
          {show("packages") && (
            <SectionCard icon="🧳" title="Package Bookings" count={packages.length} accentClass="bg-violet-50 border-b border-violet-100" loading={loading} empty={packages.length === 0}>
              <Table>
                <THead>
                  <TH>Ref</TH><TH>Package</TH><TH>Guest</TH><TH>Pickup</TH><TH>Date</TH><TH>People</TH><TH>Total</TH><TH>Payment</TH><TH>Status</TH>
                </THead>
                <tbody>
                  {pkgPag.paginated.map((b, i) => (
                    <TR key={b.id} delay={i * 60} onClick={() => openModal(b.payment, "Package Booking", b.id)}>
                      <TD><span className="font-mono text-[11px] bg-violet-50 text-violet-700 px-2 py-0.5 rounded-lg border border-violet-100">{b.booking_ref}</span></TD>
                      <TD className="font-medium text-slate-800 max-w-[200px] truncate">{b.package_name}</TD>
                      <TD>
                        <div className="font-medium text-slate-700">{b.name}</div>
                        <div className="text-[11px] text-slate-400">{b.email}</div>
                      </TD>
                      <TD>{b.pickup_location}</TD>
                      <TD>{fmtDate(b.datetime)}</TD>
                      <TD>{b.number_of_people}</TD>
                      <TD className="font-semibold text-slate-800">{b.total_price > 0 ? fmtCurrency(b.total_price) : "—"}</TD>
                      <TD><PaymentPill payment={b.payment} /></TD>
                      <TD><StatusBadge status={b.status} /></TD>
                    </TR>
                  ))}
                </tbody>
              </Table>
              <ClickHint />
              <Pagination page={pkgPag.page} totalPages={pkgPag.totalPages} onPageChange={pkgPag.setPage} />
            </SectionCard>
          )}

          {/* ── Cab Bookings ── */}
          {show("cabs") && (
            <SectionCard icon="🚖" title="Cab Bookings" count={cabs.length} accentClass="bg-sky-50 border-b border-sky-100" loading={loading} empty={cabs.length === 0}>
              <Table>
                <THead>
                  <TH>Vehicle</TH><TH>Trip</TH><TH>Guest</TH><TH>From → To</TH><TH>Pickup</TH><TH>People</TH><TH>Cost</TH><TH>Payment</TH><TH>Status</TH>
                </THead>
                <tbody>
                  {cabPag.paginated.map((b, i) => (
                    <TR key={b.id} delay={i * 60} onClick={() => openModal(b.payment, "Cab Booking", b.id)}>
                      <TD className="font-semibold text-slate-800">{b.cab_name}</TD>
                      <TD><span className="text-[10px] font-bold bg-sky-100 text-sky-700 px-2 py-0.5 rounded-md uppercase tracking-wide">{b.tripType.replace("_", " ")}</span></TD>
                      <TD>
                        <div className="font-medium text-slate-700">{b.name}</div>
                        <div className="text-[11px] text-slate-400">{b.email}</div>
                      </TD>
                      <TD>
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-slate-700 font-medium">{b.pickUpLocation}</span>
                          <span className="text-slate-300">→</span>
                          <span className="text-slate-700 font-medium">{b.dropLocation}</span>
                        </div>
                      </TD>
                      <TD>
                        <div>{fmtDate(b.pickUpDate)}</div>
                        <div className="text-[11px] text-slate-400">{b.pickUpTime}</div>
                      </TD>
                      <TD>{b.numberOfPeople}</TD>
                      <TD className="font-semibold text-slate-800">{fmtCurrency(b.totalCost)}</TD>
                      <TD><PaymentPill payment={b.payment} /></TD>
                      <TD><StatusBadge status={b.status} /></TD>
                    </TR>
                  ))}
                </tbody>
              </Table>
              <ClickHint />
              <Pagination page={cabPag.page} totalPages={cabPag.totalPages} onPageChange={cabPag.setPage} />
            </SectionCard>
          )}

          {/* ── Bike Bookings ── */}
          {show("bikes") && (
            <SectionCard icon="🏍️" title="Bike Bookings" count={bikes.length} accentClass="bg-orange-50 border-b border-orange-100" loading={loading} empty={bikes.length === 0}>
              <Table>
                <THead>
                  <TH>Bike</TH><TH>Guest</TH><TH>Date</TH><TH>Time</TH><TH>People</TH><TH>Cost</TH><TH>Payment</TH><TH>Status</TH>
                </THead>
                <tbody>
                  {bikePag.paginated.map((b, i) => (
                    <TR key={b.id} delay={i * 60} onClick={() => openModal(b.payment, "Bike Booking", b.id)}>
                      <TD className="font-semibold text-slate-800">{b.bike_name}</TD>
                      <TD>
                        <div className="font-medium text-slate-700">{b.name}</div>
                        <div className="text-[11px] text-slate-400">{b.email}</div>
                      </TD>
                      <TD>{fmtDate(b.bookingDate)}</TD>
                      <TD>{b.bookingTime}</TD>
                      <TD>{b.numberOfPeople}</TD>
                      <TD className="font-semibold text-slate-800">{fmtCurrency(b.totalCost)}</TD>
                      <TD><PaymentPill payment={b.payment} /></TD>
                      <TD><StatusBadge status={b.status} /></TD>
                    </TR>
                  ))}
                </tbody>
              </Table>
              <ClickHint />
              <Pagination page={bikePag.page} totalPages={bikePag.totalPages} onPageChange={bikePag.setPage} />
            </SectionCard>
          )}

          {/* ── Hotel Bookings ── */}
          {show("hotels") && (
            <SectionCard icon="🏨" title="Hotel Bookings" count={hotels.length} accentClass="bg-amber-50 border-b border-amber-100" loading={loading} empty={hotels.length === 0}>
              <Table>
                <THead>
                  <TH>Hotel</TH><TH>Room Type</TH><TH>Guest</TH><TH>Check-in</TH><TH>Check-out</TH><TH>Guests/Rooms</TH><TH>Total</TH><TH>Payment</TH><TH>Status</TH>
                </THead>
                <tbody>
                  {hotelPag.paginated.map((b, i) => (
                    <TR key={b.id} delay={i * 60} onClick={() => openModal(b.payment, "Hotel Booking", b.id)}>
                      <TD className="font-semibold text-slate-800">{b.hotel_name}</TD>
                      <TD><span className="text-[11px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-medium">{b.roomType}</span></TD>
                      <TD>
                        <div className="font-medium text-slate-700">{b.name}</div>
                        <div className="text-[11px] text-slate-400">{b.email}</div>
                      </TD>
                      <TD>{fmtDate(b.checkInDate)}</TD>
                      <TD>{fmtDate(b.checkOutDate)}</TD>
                      <TD><span className="text-slate-700">{b.numberOfGuests}G / {b.numberOfRooms}R</span></TD>
                      <TD className="font-semibold text-slate-800">{fmtCurrency(b.totalCost)}</TD>
                      <TD><PaymentPill payment={b.payment} /></TD>
                      <TD><StatusBadge status={b.status} /></TD>
                    </TR>
                  ))}
                </tbody>
              </Table>
              <ClickHint />
              <Pagination page={hotelPag.page} totalPages={hotelPag.totalPages} onPageChange={hotelPag.setPage} />
            </SectionCard>
          )}

          {/* ── Activity Bookings ── */}
          {show("activities") && (
            <SectionCard icon="🎯" title="Activity Bookings" count={activities.length} accentClass="bg-lime-50 border-b border-lime-100" loading={loading} empty={activities.length === 0}>
              <Table>
                <THead>
                  <TH>Activity</TH><TH>Start Date</TH><TH>Pickup</TH><TH>Email</TH><TH>Phone</TH><TH>Cost</TH><TH>Payment</TH><TH>Status</TH>
                </THead>
                <tbody>
                  {actPag.paginated.map((b, i) => (
                    <TR key={b.id} delay={i * 60} onClick={() => openModal(b.payment, "Activity Booking", b.id)}>
                      <TD className="font-semibold text-slate-800">{b.activity_name}</TD>
                      <TD>{fmtDate(b.startDate)}</TD>
                      <TD>{b.pickUpLocation}</TD>
                      <TD>{b.email}</TD>
                      <TD>{b.primaryPhone}</TD>
                      <TD className="font-semibold text-slate-800">{fmtCurrency(b.totalCost)}</TD>
                      <TD><PaymentPill payment={b.payment} /></TD>
                      <TD><StatusBadge status={b.status} /></TD>
                    </TR>
                  ))}
                </tbody>
              </Table>
              <ClickHint />
              <Pagination page={actPag.page} totalPages={actPag.totalPages} onPageChange={actPag.setPage} />
            </SectionCard>
          )}

        </div>
      </div>
    </>
  );
}