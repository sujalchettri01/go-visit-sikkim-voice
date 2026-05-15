// ─── Pricing Architecture ─────────────────────────────────────────────────────
//
//  Each route has a fixed base price (₹).
//  Each cab has a `priceOffset` (₹) that adjusts it up or down from the base.
//
//  Final price = ROUTE_PRICES[from][to] + cab.priceOffset
//
//  If no route is searched, cards show the cab's cheapest available fare
//  ("starting from ₹X").
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Full symmetric route price table (₹).
 * Every origin → destination pair is listed.
 */
export const ROUTE_PRICES: Record<string, Record<string, number>> = {
  Gangtok: {
    Siliguri: 2800,
    Namchi: 1800,
    Ravangla: 2200,
    Jorethang: 2000,
    Singtam: 800,
    Rangpo: 1600,
    Mangan: 1400,
  },

  Siliguri: {
    Gangtok: 5,// // ✅ FIXED (same as reverse)
    Namchi: 2000,
    Ravangla: 2400,
    Jorethang: 2200,
    Singtam: 1800,
    Rangpo: 1600,
    Mangan: 3000,
  },

  Namchi: {
    Gangtok: 1800,
    Siliguri: 2000,
    Jorethang: 600,
    Singtam: 1600,
    Mangan: 3200,
    Rangpo: 2000,
  },

  Singtam: {
    Gangtok: 800,
    Siliguri: 1800,
    Jorethang: 600,
    Mangan: 3200,
    Rangpo: 2000,
  },

  Rangpo: {
    Gangtok: 1600,
    Siliguri: 1600,
    Jorethang: 600,
    Singtam: 1600,
    Namchi: 2000,
  },
};

/**
 * Returns the exact fare for a cab on a given route.
 * Returns null if the route doesn't exist in the table.
 */
export function getRoutePrice(
  from: string,
  to: string,
  priceOffset: number
): number | null {
  const base = ROUTE_PRICES[from]?.[to];
  if (base == null) return null;
  return Math.max(0, base + priceOffset);
}

/**
 * Returns the cheapest fare a cab offers from a given origin.
 * Used for "starting from ₹X" when no destination is selected.
 */
export function getStartingPrice(
  cab: (typeof cabsData)[0],
  from: string
): number {
  const routes = ROUTE_PRICES[from];
  if (!routes) return 0;
  const prices = cab.destinations
    .map((d) => {
      const base = routes[d];
      return base != null ? Math.max(0, base + cab.priceOffset) : null;
    })
    .filter((p): p is number => p !== null);
  return prices.length ? Math.min(...prices) : 0;
}

// ─── Cab Data ─────────────────────────────────────────────────────────────────
//
//  `priceOffset` (₹) adjusts this cab's fares relative to the route base.
//   0    = exactly the route base price
//  -300  = ₹300 cheaper than base (budget option)
//  +800  = ₹800 more than base (premium option)
//
// ─────────────────────────────────────────────────────────────────────────────

const cabsData = [
  {
    id: "1",
    cab_name: "Maruti Suzuki Alto 800",
    company: "Alto 800",
    capacity: 4,
    priceOffset: 0,
    image: "https://res.cloudinary.com/djsguxriw/image/upload/v1777143222/ChatGPT_Image_Apr_25_2026_11_35_38_PM_bi7k9m.png",
    rating: 4.5,
    features: [""],
    destinations: [],
  },
 
  {
    id: "3",
    cab_name: "Mahindra Scorpio N",
    company: "Scorpio n",
    capacity: 7,
    priceOffset: -200,
    image: "https://res.cloudinary.com/djsguxriw/image/upload/v1777143214/20250515111753_Mahindra_Scorpio_N_Everest_White_1_vrnmdy.png",
    rating: 4.2,
    features: [""],
    destinations: [],
  },
  {
    id: "4",
    cab_name: "Toyota Innova",
    company: "Toyota innova",
    capacity: 7,
    priceOffset: 500,
    image: "https://res.cloudinary.com/djsguxriw/image/upload/v1777143223/ChatGPT_Image_Apr_25_2026_11_29_06_PM_hfrcoj.png",
    rating: 4.6,
    features: [""],
    destinations: [""],
  },
  {
    id: "5",
    cab_name: "Mahindra Xylo",
    company: "Mahindra Xylo",
    capacity: 7,
    priceOffset: 1200,
    image: "https://res.cloudinary.com/djsguxriw/image/upload/v1777143222/ChatGPT_Image_Apr_25_2026_11_30_10_PM_p1iu6v.png",
    rating: 4.9,
    features: [],
    destinations: [],
  },
  {
    id: "6",
    cab_name: "Maruti Suzuki WagonR",
    company: "Maruti Suzuki Wagnor",
    capacity: 4,
    priceOffset: -150,
    image: "https://res.cloudinary.com/djsguxriw/image/upload/v1777143223/ChatGPT_Image_Apr_25_2026_11_38_53_PM_oysfrb.png",
    rating: 4.4,
    features: [""],
    destinations: [],
  },
  {
    id: "7",
    cab_name: "Mahindra Bolero",
    company: "Mahindra Bolero",
    capacity: 9,
    priceOffset: -400,
    image: "https://res.cloudinary.com/djsguxriw/image/upload/v1777143223/ChatGPT_Image_Apr_25_2026_11_31_33_PM_kqpdwb.png",
    rating: 4.0,
    features: [""],
    destinations: [""],
  },
  {
    id: "8",
    cab_name: "Mahindra Bolero Neo",
    company: "Bolero Neo",
    capacity: 7,
    priceOffset: 900,
    image: "https://res.cloudinary.com/djsguxriw/image/upload/v1777143729/ChatGPT_Image_Apr_26_2026_12_28_37_AM_ss4dmt.png",
    rating: 4.7,
    features: [""],
    destinations: [""],
  },
  {
    id: "9",
    cab_name: "Maruti Suzuki Swift",
    company: "Swift",
    capacity: 4,
    priceOffset: 600,
    image: "https://res.cloudinary.com/djsguxriw/image/upload/v1777143223/ChatGPT_Image_Apr_26_2026_12_19_12_AM_bbsoxb.png",
    rating: 4.9,
    features: [""],
    destinations: [""],
  },
  {
    id: "10",
    cab_name: "Maruti Suzuki Dzire",
    company: "Dzire",
    capacity: 4,
    priceOffset: 1,
    image: "https://res.cloudinary.com/djsguxriw/image/upload/v1777143230/ChatGPT_Image_Apr_26_2026_12_20_14_AM_dk7ui8.png",
    rating: 4.5,
    features: [""],
    destinations: [""],
  },
];

export default cabsData;