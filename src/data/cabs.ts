// ─── Pricing Architecture ─────────────────────────────────────────────────────
//
//  3 separate route price tables based on cab category:
//  - PRICES_4SEATER   : Alto 800, WagonR, Swift, Dzire
//  - PRICES_7SEATER   : Scorpio N, Innova, Xylo, Bolero Neo (Luxury)
//  - PRICES_9SEATER   : Bolero
//
//  Each cab has a `category` field: "4seater" | "7seater" | "9seater"
//  getRoutePrice picks the right table based on category.
// ─────────────────────────────────────────────────────────────────────────────

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

// ─── Backward compatibility export ───────────────────────────────────────────
export const ROUTE_PRICES = PRICES_4SEATER;

function getPriceTable(category: string): Record<string, Record<string, number>> {
  if (category === "7seater") return PRICES_7SEATER;
  if (category === "9seater") return PRICES_9SEATER;
  return PRICES_4SEATER;
}

export function getRoutePrice(
  from: string,
  to: string,
  priceOffset: number,
  category: string = "4seater"
): number | null {
  const table = getPriceTable(category);
  const base = table[from]?.[to];
  if (base == null) return null;
  return base;
}

export function getStartingPrice(
  cab: (typeof cabsData)[0],
  from: string
): number {
  const table = getPriceTable(cab.category);
  const routes = table[from];
  if (!routes) return 0;
  const prices = Object.values(routes).filter((p): p is number => p != null);
  return prices.length ? Math.min(...prices) : 0;
}

const cabsData = [
  {
    id: "1",
    cab_name: "Maruti Suzuki Alto 800",
    company: "Alto 800",
    capacity: 4,
    category: "4seater",
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
    category: "7seater",
    priceOffset: 0,
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
    category: "7seater",
    priceOffset: 0,
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
    category: "7seater",
    priceOffset: 0,
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
    category: "4seater",
    priceOffset: 0,
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
    category: "9seater",
    priceOffset: 0,
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
    category: "7seater",
    priceOffset: 0,
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
    category: "4seater",
    priceOffset: 0,
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
    category: "4seater",
    priceOffset: 0,
    image: "https://res.cloudinary.com/djsguxriw/image/upload/v1777143230/ChatGPT_Image_Apr_26_2026_12_20_14_AM_dk7ui8.png",
    rating: 4.5,
    features: [""],
    destinations: [""],
  },
];

export default cabsData;