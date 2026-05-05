import { useEffect, useState } from "react";
import { getCookie } from "../utils/cookie";
import apiFetch from "../wrapper/apiCall";

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

const fmtCurrency = (val: string | number) =>
  "₹" + Number(val).toLocaleString("en-IN");

// ─── Status Badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  const s = status.toLowerCase();
  const map: Record<string, { dot: string; pill: string }> = {
    pending: {
      dot: "bg-amber-400",
      pill: "bg-amber-50 text-amber-700 border-amber-200",
    },
    confirmed: {
      dot: "bg-emerald-400",
      pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    cancelled: {
      dot: "bg-red-400",
      pill: "bg-red-50 text-red-700 border-red-200",
    },
    completed: {
      dot: "bg-sky-400",
      pill: "bg-sky-50 text-sky-700 border-sky-200",
    },
  };
  const style = map[s] ?? {
    dot: "bg-slate-400",
    pill: "bg-slate-50 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${style.pill}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
};

const PaymentBadge = ({ payment }: { payment: Payment | null }) => {
  if (!payment) return <span className="text-slate-300 text-xs">—</span>;

  const map: Record<string, { dot: string; pill: string; label: string }> = {
    PAID: {
      dot: "bg-emerald-400",
      pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
      label: "Paid",
    },
    CREATED: {
      dot: "bg-amber-400",
      pill: "bg-amber-50 text-amber-700 border-amber-200",
      label: "Pending",
    },
    FAILED: {
      dot: "bg-red-400",
      pill: "bg-red-50 text-red-700 border-red-200",
      label: "Failed",
    },
    REFUNDED: {
      dot: "bg-sky-400",
      pill: "bg-sky-50 text-sky-700 border-sky-200",
      label: "Refunded",
    },
  };

  const style = map[payment.status] ?? map.CREATED;

  return (
    <div className="flex flex-col gap-1">
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${style.pill}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
        {style.label}
      </span>
      {payment.razorpay_payment_id && (
        <span className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]">
          {payment.razorpay_payment_id}
        </span>
      )}
    </div>
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
      <div
        key={i}
        className="h-12 bg-slate-100 rounded-xl animate-pulse"
        style={{ opacity: 1 - i * 0.25 }}
      />
    ))}
  </div>
);

// ─── Summary Card ─────────────────────────────────────────────────────────────

const SummaryCard = ({
  icon,
  label,
  value,
  sub,
  from,
  to,
  delay,
}: {
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
  from: string;
  to: string;
  delay: number;
}) => (
  <div
    className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg"
    style={{
      background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
      animation: `fadeSlideIn 0.5s ease-out ${delay}ms both`,
    }}
  >
    <div className="absolute -right-3 -top-3 text-7xl opacity-[0.08] select-none pointer-events-none leading-none">
      {icon}
    </div>
    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/60 mb-2">
      {label}
    </p>
    <p className="text-[2rem] font-black leading-none">{value}</p>
    {sub && <p className="text-xs text-white/50 mt-1.5 font-medium">{sub}</p>}
  </div>
);

// ─── Section Card ─────────────────────────────────────────────────────────────

const SectionCard = ({
  icon,
  title,
  count,
  accentClass,
  loading,
  empty,
  children,
}: {
  icon: string;
  title: string;
  count: number;
  accentClass: string;
  loading: boolean;
  empty: boolean;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <div
      className={`px-5 py-4 flex items-center justify-between ${accentClass}`}
    >
      <div className="flex items-center gap-2.5">
        <span className="text-lg">{icon}</span>
        <h2 className="text-sm font-bold text-slate-800 tracking-tight">
          {title}
        </h2>
      </div>
      <span className="text-[11px] font-semibold bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-slate-500 border border-white/60 shadow-sm">
        {count} {count === 1 ? "booking" : "bookings"}
      </span>
    </div>

    {loading ? (
      <Skeleton />
    ) : empty ? (
      <EmptyState icon={icon} label={title.toLowerCase()} />
    ) : (
      <div className="overflow-x-auto">{children}</div>
    )}
  </div>
);

// ─── Table Primitives ─────────────────────────────────────────────────────────

const Table = ({ children }: { children: React.ReactNode }) => (
  <table className="w-full min-w-[640px]">{children}</table>
);

const THead = ({ children }: { children: React.ReactNode }) => (
  <thead>
    <tr className="border-b border-slate-100 bg-slate-50/60">{children}</tr>
  </thead>
);

const TH = ({ children }: { children: React.ReactNode }) => (
  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 whitespace-nowrap">
    {children}
  </th>
);

const TR = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <tr
    className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors duration-100 group"
    style={{ animation: `fadeSlideIn 0.35s ease-out ${delay}ms both` }}
  >
    {children}
  </tr>
);

const TD = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <td
    className={`px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap ${className}`}
  >
    {children}
  </td>
);

// ─── Tab Button ───────────────────────────────────────────────────────────────

const TabBtn = ({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  count: number;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
      active
        ? "bg-slate-800 text-white shadow-md scale-[1.02]"
        : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
    }`}
  >
    <span>{icon}</span>
    <span>{label}</span>
    <span
      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
        active ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
      }`}
    >
      {count}
    </span>
  </button>
);

// ─── Main Component ───────────────────────────────────────────────────────────

type Tab = "all" | "packages" | "cabs" | "bikes" | "hotels";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const [packages, setPackages] = useState<PackageBooking[]>([]);
  const [cabs, setCabs] = useState<VehicleBooking[]>([]);
  const [bikes, setBikes] = useState<BikeBooking[]>([]);
  const [hotels, setHotels] = useState<HotelBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getCookie("token");
    if (token) setUser(decodeToken(token));

    const fetchAll = async () => {
      try {
        const url = import.meta.env.VITE_BASE_URL;
        const [pkgRes, cabRes, bikeRes, hotelRes] = await Promise.all([
          apiFetch(`${url}/package-bookings`),
          apiFetch(`${url}/vehicle-bookings`),
          apiFetch(`${url}/bike-bookings`),
          apiFetch(`${url}/accommodation-bookings`),
        ]);

        // apiFetch returns undefined on 401 (redirects to login), guard here
        if (pkgRes) {
          const d = await pkgRes.json();
          if (d.success) setPackages(d.data);
        }
        if (cabRes) {
          const d = await cabRes.json();
          if (d.success) setCabs(d.data);
        }
        if (bikeRes) {
          const d = await bikeRes.json();
          if (d.success) setBikes(d.data);
        }
        if (hotelRes) {
          const d = await hotelRes.json();
          if (d.success) setHotels(d.data);
        }
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const totalBookings =
    packages.length + cabs.length + bikes.length + hotels.length;

  const totalSpend =
    packages.reduce((s, b) => s + Number(b.total_price), 0) +
    cabs.reduce((s, b) => s + Number(b.totalCost), 0) +
    bikes.reduce((s, b) => s + Number(b.totalCost), 0) +
    hotels.reduce((s, b) => s + Number(b.totalCost), 0);

  const show = (tab: Tab) => activeTab === "all" || activeTab === tab;

  return (
    <>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="min-h-screen bg-[#f5f5f7] px-4 py-8 md:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* ── Welcome ── */}
          <div
            className="rounded-2xl overflow-hidden shadow-sm"
            style={{
              background:
                "linear-gradient(120deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)",
              animation: "fadeSlideIn 0.5s ease-out both",
            }}
          >
            <div className="px-7 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">
                  My Bookings Dashboard
                </p>
                <h1
                  className="text-2xl font-black text-white leading-tight"
                  style={{ fontFamily: "Syne, sans-serif" }}
                >
                  {user?.email
                    ? `Hello, ${user.email.split("@")[0]} 👋`
                    : "Welcome back 👋"}
                </h1>
                <p className="text-xs text-slate-400 mt-1 capitalize">
                  Role:{" "}
                  <span className="text-slate-300 font-semibold">
                    {user?.role ?? "—"}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {user?.email?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div>
                  <p className="text-xs text-slate-300 font-medium">
                    {user?.email ?? "—"}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    ID #{user?.userId ?? "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Summary Cards ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <SummaryCard
              icon="📋"
              label="Total Bookings"
              value={totalBookings}
              sub="across all categories"
              from="#6366f1"
              to="#8b5cf6"
              delay={0}
            />
            <SummaryCard
              icon="💰"
              label="Total Spent"
              value={fmtCurrency(totalSpend)}
              sub="combined spend"
              from="#0ea5e9"
              to="#06b6d4"
              delay={80}
            />
            <SummaryCard
              icon="🏨"
              label="Hotel Stays"
              value={hotels.length}
              sub="accommodation bookings"
              from="#f59e0b"
              to="#f97316"
              delay={160}
            />
            <SummaryCard
              icon="🧳"
              label="Packages"
              value={packages.length}
              sub="tour packages booked"
              from="#10b981"
              to="#059669"
              delay={240}
            />
          </div>

          {/* ── Tabs ── */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {(
              [
                { id: "all", icon: "🗂️", label: "All", count: totalBookings },
                {
                  id: "packages",
                  icon: "🧳",
                  label: "Packages",
                  count: packages.length,
                },
                { id: "cabs", icon: "🚖", label: "Cabs", count: cabs.length },
                {
                  id: "bikes",
                  icon: "🏍️",
                  label: "Bikes",
                  count: bikes.length,
                },
                {
                  id: "hotels",
                  icon: "🏨",
                  label: "Hotels",
                  count: hotels.length,
                },
              ] as const
            ).map((t) => (
              <TabBtn
                key={t.id}
                active={activeTab === t.id}
                onClick={() => setActiveTab(t.id)}
                icon={t.icon}
                label={t.label}
                count={t.count}
              />
            ))}
          </div>

          {/* ── Package Bookings ── */}
          {show("packages") && (
            <SectionCard
              icon="🧳"
              title="Package Bookings"
              count={packages.length}
              accentClass="bg-violet-50 border-b border-violet-100"
              loading={loading}
              empty={packages.length === 0}
            >
              <Table>
                <THead>
                  <TH>Ref</TH>
                  <TH>Package</TH>
                  <TH>Guest</TH>
                  <TH>Pickup</TH>
                  <TH>Date</TH>
                  <TH>People</TH>
                  <TH>Total</TH>
                  <TH>Status</TH>
                </THead>
                <tbody>
                  {packages.map((b, i) => (
                    <TR key={b.id} delay={i * 60}>
                      <TD>
                        <span className="font-mono text-[11px] bg-violet-50 text-violet-700 px-2 py-0.5 rounded-lg border border-violet-100">
                          {b.booking_ref}
                        </span>
                      </TD>
                      <TD className="font-medium text-slate-800 max-w-[200px] truncate">
                        {b.package_name}
                      </TD>
                      <TD>
                        <div className="font-medium text-slate-700">
                          {b.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {b.email}
                        </div>
                      </TD>
                      <TD>{b.pickup_location}</TD>
                      <TD>{fmtDate(b.datetime)}</TD>
                      <TD>{b.number_of_people}</TD>
                      <TD className="font-semibold text-slate-800">
                        {b.total_price > 0 ? fmtCurrency(b.total_price) : "—"}
                      </TD>
                      <TD>
                        <StatusBadge status={b.status} />
                      </TD>
                    </TR>
                  ))}
                </tbody>
              </Table>
            </SectionCard>
          )}

          {/* ── Cab Bookings ── */}
          {show("cabs") && (
            <SectionCard
              icon="🚖"
              title="Cab Bookings"
              count={cabs.length}
              accentClass="bg-sky-50 border-b border-sky-100"
              loading={loading}
              empty={cabs.length === 0}
            >
              <Table>
                <THead>
                  <TH>Vehicle</TH>
                  <TH>Trip Type</TH>
                  <TH>Guest</TH>
                  <TH>From → To</TH>
                  <TH>Pickup</TH>
                  <TH>People</TH>
                  <TH>Cost</TH>
                  <TH>Status</TH>
                </THead>
                <tbody>
                  {cabs.map((b, i) => (
                    <TR key={b.id} delay={i * 60}>
                      <TD className="font-semibold text-slate-800">
                        {b.cab_name}
                      </TD>
                      <TD>
                        <span className="text-[10px] font-bold bg-sky-100 text-sky-700 px-2 py-0.5 rounded-md uppercase tracking-wide">
                          {b.tripType.replace("_", " ")}
                        </span>
                      </TD>
                      <TD>
                        <div className="font-medium text-slate-700">
                          {b.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {b.email}
                        </div>
                      </TD>
                      <TD>
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-slate-700 font-medium">
                            {b.pickUpLocation}
                          </span>
                          <span className="text-slate-300">→</span>
                          <span className="text-slate-700 font-medium">
                            {b.dropLocation}
                          </span>
                        </div>
                      </TD>
                      <TD>
                        <div>{fmtDate(b.pickUpDate)}</div>
                        <div className="text-[11px] text-slate-400">
                          {b.pickUpTime}
                        </div>
                      </TD>
                      <TD>{b.numberOfPeople}</TD>
                      <TD className="font-semibold text-slate-800">
                        {fmtCurrency(b.totalCost)}
                      </TD>
                      <TD>
                        <PaymentBadge payment={b.payment} />
                      </TD>{" "}
                      {/* ← new */}
                      <TD>
                        <StatusBadge status={b.status} />
                      </TD>
                    </TR>
                  ))}
                </tbody>
              </Table>
            </SectionCard>
          )}

          {/* ── Bike Bookings ── */}
          {show("bikes") && (
            <SectionCard
              icon="🏍️"
              title="Bike Bookings"
              count={bikes.length}
              accentClass="bg-orange-50 border-b border-orange-100"
              loading={loading}
              empty={bikes.length === 0}
            >
              <Table>
                <THead>
                  <TH>Bike</TH>
                  <TH>Guest</TH>
                  <TH>Date</TH>
                  <TH>Time</TH>
                  <TH>People</TH>
                  <TH>Cost</TH>
                  <TH>Status</TH>
                </THead>
                <tbody>
                  {bikes.map((b, i) => (
                    <TR key={b.id} delay={i * 60}>
                      <TD className="font-semibold text-slate-800">
                        {b.bike_name}
                      </TD>
                      <TD>
                        <div className="font-medium text-slate-700">
                          {b.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {b.email}
                        </div>
                      </TD>
                      <TD>{fmtDate(b.bookingDate)}</TD>
                      <TD>{b.bookingTime}</TD>
                      <TD>{b.numberOfPeople}</TD>
                      <TD className="font-semibold text-slate-800">
                        {fmtCurrency(b.totalCost)}
                      </TD>
                      <TD>
                        <StatusBadge status={b.status} />
                      </TD>
                    </TR>
                  ))}
                </tbody>
              </Table>
            </SectionCard>
          )}

          {/* ── Hotel Bookings ── */}
          {show("hotels") && (
            <SectionCard
              icon="🏨"
              title="Hotel Bookings"
              count={hotels.length}
              accentClass="bg-amber-50 border-b border-amber-100"
              loading={loading}
              empty={hotels.length === 0}
            >
              <Table>
                <THead>
                  <TH>Hotel</TH>
                  <TH>Room Type</TH>
                  <TH>Guest</TH>
                  <TH>Check-in</TH>
                  <TH>Check-out</TH>
                  <TH>Guests / Rooms</TH>
                  <TH>Total</TH>
                  <TH>Status</TH>
                </THead>
                <tbody>
                  {hotels.map((b, i) => (
                    <TR key={b.id} delay={i * 60}>
                      <TD className="font-semibold text-slate-800">
                        {b.hotel_name}
                      </TD>
                      <TD>
                        <span className="text-[11px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-medium">
                          {b.roomType}
                        </span>
                      </TD>
                      <TD>
                        <div className="font-medium text-slate-700">
                          {b.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {b.email}
                        </div>
                      </TD>
                      <TD>{fmtDate(b.checkInDate)}</TD>
                      <TD>{fmtDate(b.checkOutDate)}</TD>
                      <TD>
                        <span className="text-slate-700">
                          {b.numberOfGuests}G / {b.numberOfRooms}R
                        </span>
                      </TD>
                      <TD className="font-semibold text-slate-800">
                        {fmtCurrency(b.totalCost)}
                      </TD>
                      <TD>
                        <StatusBadge status={b.status} />
                      </TD>
                    </TR>
                  ))}
                </tbody>
              </Table>
            </SectionCard>
          )}
        </div>
      </div>
    </>
  );
}
