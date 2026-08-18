// ─── aidata.ts ──────────────────────────────────────────────────────────
// THE data file for the AI. Add/edit everything here — packages, cab
// prices, hotel info, and any other exact facts you want the AI to fetch
// and answer with. This is intentionally SEPARATE from src/data/*.ts (which
// power the visual cards, and have lots of extra fields you don't need
// here like images/galleries) — this file is just for the AI: simple, flat,
// easy for you to maintain directly.
//
// How it's used: aiTools.ts reads these arrays and lets the AI search them
// via function calling — the AI never invents a price or package, it always
// looks it up here first.

// ═══════════════════════════════════════════════════════════════════════
// CAB ROUTES & PRICES
// ═══════════════════════════════════════════════════════════════════════
export interface CabRoute {
  from: string;
  to: string;
  price: number;
  seaterType: string; // e.g. "4-seater", "7-seater SUV", "9-seater", "Sharing (per seat)"
}

// Vehicle models per seater type, for reference (not part of CabRoute since
// it's the same list of vehicles across every route of that type):
// - 4-seater: Maruti Suzuki Alto 800, WagonR, Swift, Dzire
// - 7-seater SUV: Mahindra Scorpio N, Toyota Innova, Mahindra Xylo, Mahindra Bolero Neo
// - 9-seater: Mahindra Bolero
export const CAB_ROUTES: CabRoute[] = [
  // ── 7-seater SUV (Scorpio N / Innova / Xylo / Bolero Neo) ──
  { from: "Siliguri", to: "Gangtok", price: 4000, seaterType: "7-seater SUV" },
  { from: "Siliguri", to: "Rangpo", price: 3000, seaterType: "7-seater SUV" },
  { from: "Siliguri", to: "Jorethang", price: 4000, seaterType: "7-seater SUV" },
  { from: "Siliguri", to: "Namchi", price: 4000, seaterType: "7-seater SUV" },
  { from: "Siliguri", to: "Singtam", price: 3500, seaterType: "7-seater SUV" },
  { from: "Siliguri", to: "Mangan", price: 4500, seaterType: "7-seater SUV" },
  { from: "Gangtok", to: "Siliguri", price: 4000, seaterType: "7-seater SUV" },
  { from: "Gangtok", to: "Namchi", price: 2500, seaterType: "7-seater SUV" },
  { from: "Gangtok", to: "Singtam", price: 1500, seaterType: "7-seater SUV" },
  { from: "Gangtok", to: "Mangan", price: 2500, seaterType: "7-seater SUV" },
  { from: "Gangtok", to: "Rangpo", price: 2000, seaterType: "7-seater SUV" },
  { from: "Namchi", to: "Siliguri", price: 4000, seaterType: "7-seater SUV" },
  { from: "Namchi", to: "Gangtok", price: 2500, seaterType: "7-seater SUV" },
  { from: "Namchi", to: "Singtam", price: 2000, seaterType: "7-seater SUV" },
  { from: "Namchi", to: "Mangan", price: 3000, seaterType: "7-seater SUV" },
  { from: "Namchi", to: "Rangpo", price: 1800, seaterType: "7-seater SUV" },
  { from: "Singtam", to: "Siliguri", price: 3500, seaterType: "7-seater SUV" },
  { from: "Singtam", to: "Gangtok", price: 1500, seaterType: "7-seater SUV" },
  { from: "Singtam", to: "Namchi", price: 2000, seaterType: "7-seater SUV" },
  { from: "Singtam", to: "Mangan", price: 2000, seaterType: "7-seater SUV" },
  { from: "Singtam", to: "Rangpo", price: 1500, seaterType: "7-seater SUV" },
  { from: "Mangan", to: "Siliguri", price: 4500, seaterType: "7-seater SUV" },
  { from: "Mangan", to: "Gangtok", price: 2500, seaterType: "7-seater SUV" },
  { from: "Mangan", to: "Namchi", price: 3000, seaterType: "7-seater SUV" },
  { from: "Mangan", to: "Singtam", price: 2000, seaterType: "7-seater SUV" },
  { from: "Mangan", to: "Rangpo", price: 3000, seaterType: "7-seater SUV" },
  { from: "Rangpo", to: "Siliguri", price: 3000, seaterType: "7-seater SUV" },
  { from: "Rangpo", to: "Gangtok", price: 2500, seaterType: "7-seater SUV" },
  { from: "Rangpo", to: "Namchi", price: 1800, seaterType: "7-seater SUV" },
  { from: "Rangpo", to: "Singtam", price: 1500, seaterType: "7-seater SUV" },
  { from: "Rangpo", to: "Mangan", price: 3000, seaterType: "7-seater SUV" },
  { from: "Jorethang", to: "Siliguri", price: 4000, seaterType: "7-seater SUV" },

  // ── 9-seater (Mahindra Bolero) ──
  { from: "Siliguri", to: "Gangtok", price: 3500, seaterType: "9-seater" },
  { from: "Siliguri", to: "Rangpo", price: 2500, seaterType: "9-seater" },
  { from: "Siliguri", to: "Jorethang", price: 3500, seaterType: "9-seater" },
  { from: "Siliguri", to: "Namchi", price: 3500, seaterType: "9-seater" },
  { from: "Siliguri", to: "Singtam", price: 3000, seaterType: "9-seater" },
  { from: "Siliguri", to: "Mangan", price: 4000, seaterType: "9-seater" },
  { from: "Gangtok", to: "Siliguri", price: 3500, seaterType: "9-seater" },
  { from: "Gangtok", to: "Namchi", price: 2000, seaterType: "9-seater" },
  { from: "Gangtok", to: "Singtam", price: 1000, seaterType: "9-seater" },
  { from: "Gangtok", to: "Mangan", price: 2000, seaterType: "9-seater" },
  { from: "Gangtok", to: "Rangpo", price: 1500, seaterType: "9-seater" },
  { from: "Namchi", to: "Siliguri", price: 3500, seaterType: "9-seater" },
  { from: "Namchi", to: "Gangtok", price: 2000, seaterType: "9-seater" },
  { from: "Namchi", to: "Singtam", price: 1800, seaterType: "9-seater" },
  { from: "Namchi", to: "Mangan", price: 2500, seaterType: "9-seater" },
  { from: "Namchi", to: "Rangpo", price: 1700, seaterType: "9-seater" },
  { from: "Singtam", to: "Siliguri", price: 3000, seaterType: "9-seater" },
  { from: "Singtam", to: "Gangtok", price: 1000, seaterType: "9-seater" },
  { from: "Singtam", to: "Namchi", price: 1800, seaterType: "9-seater" },
  { from: "Singtam", to: "Mangan", price: 1800, seaterType: "9-seater" },
  { from: "Singtam", to: "Rangpo", price: 1000, seaterType: "9-seater" },
  { from: "Mangan", to: "Siliguri", price: 4000, seaterType: "9-seater" },
  { from: "Mangan", to: "Gangtok", price: 2000, seaterType: "9-seater" },
  { from: "Mangan", to: "Namchi", price: 2500, seaterType: "9-seater" },
  { from: "Mangan", to: "Singtam", price: 1800, seaterType: "9-seater" },
  { from: "Mangan", to: "Rangpo", price: 2500, seaterType: "9-seater" },
  { from: "Rangpo", to: "Siliguri", price: 2500, seaterType: "9-seater" },
  { from: "Rangpo", to: "Gangtok", price: 1500, seaterType: "9-seater" },
  { from: "Rangpo", to: "Namchi", price: 1700, seaterType: "9-seater" },
  { from: "Rangpo", to: "Singtam", price: 1000, seaterType: "9-seater" },
  { from: "Rangpo", to: "Mangan", price: 2500, seaterType: "9-seater" },
  { from: "Jorethang", to: "Siliguri", price: 3500, seaterType: "9-seater" },

  // ── 4-seater (Alto 800 / WagonR / Swift / Dzire) ──
  { from: "Siliguri", to: "Gangtok", price: 2500, seaterType: "4-seater" },
  { from: "Siliguri", to: "Rangpo", price: 2000, seaterType: "4-seater" },
  { from: "Siliguri", to: "Jorethang", price: 2500, seaterType: "4-seater" },
  { from: "Siliguri", to: "Namchi", price: 2500, seaterType: "4-seater" },
  { from: "Siliguri", to: "Singtam", price: 2500, seaterType: "4-seater" },
  { from: "Siliguri", to: "Mangan", price: 3000, seaterType: "4-seater" },
  { from: "Gangtok", to: "Siliguri", price: 2500, seaterType: "4-seater" },
  { from: "Gangtok", to: "Namchi", price: 1500, seaterType: "4-seater" },
  { from: "Gangtok", to: "Singtam", price: 800, seaterType: "4-seater" },
  { from: "Gangtok", to: "Mangan", price: 1500, seaterType: "4-seater" },
  { from: "Gangtok", to: "Rangpo", price: 1300, seaterType: "4-seater" },
  { from: "Namchi", to: "Siliguri", price: 2500, seaterType: "4-seater" },
  { from: "Namchi", to: "Gangtok", price: 1500, seaterType: "4-seater" },
  { from: "Namchi", to: "Singtam", price: 1500, seaterType: "4-seater" },
  { from: "Namchi", to: "Mangan", price: 2000, seaterType: "4-seater" },
  { from: "Namchi", to: "Rangpo", price: 1500, seaterType: "4-seater" },
  { from: "Singtam", to: "Siliguri", price: 2500, seaterType: "4-seater" },
  { from: "Singtam", to: "Gangtok", price: 800, seaterType: "4-seater" },
  { from: "Singtam", to: "Namchi", price: 1500, seaterType: "4-seater" },
  { from: "Singtam", to: "Mangan", price: 1500, seaterType: "4-seater" },
  { from: "Singtam", to: "Rangpo", price: 800, seaterType: "4-seater" },
  { from: "Mangan", to: "Siliguri", price: 3000, seaterType: "4-seater" },
  { from: "Mangan", to: "Gangtok", price: 1500, seaterType: "4-seater" },
  { from: "Mangan", to: "Namchi", price: 2000, seaterType: "4-seater" },
  { from: "Mangan", to: "Singtam", price: 1500, seaterType: "4-seater" },
  { from: "Mangan", to: "Rangpo", price: 2000, seaterType: "4-seater" },
  { from: "Rangpo", to: "Siliguri", price: 2000, seaterType: "4-seater" },
  { from: "Rangpo", to: "Gangtok", price: 1300, seaterType: "4-seater" },
  { from: "Rangpo", to: "Namchi", price: 1500, seaterType: "4-seater" },
  { from: "Rangpo", to: "Singtam", price: 800, seaterType: "4-seater" },
  { from: "Rangpo", to: "Mangan", price: 2000, seaterType: "4-seater" },
  { from: "Jorethang", to: "Siliguri", price: 2500, seaterType: "4-seater" },
];

// ═══════════════════════════════════════════════════════════════════════
// TOUR PACKAGES
// ═══════════════════════════════════════════════════════════════════════
export interface AIPackage {
  name: string;
  days: number;
  nights: number;
  type: string; // Adventure, Nature, Religious, Honeymoon, Family, or Mixed — matches the trip types in your system prompt
  tourType: string; // "Private Tour" | "Sharing Tour"
  maxGuests: number;
  bestTime: string;
  // Exact TOTAL price for the whole package at a given group size — e.g.
  // { "2": 15000, "3": 17000 } means ₹15,000 total for 2 people, ₹17,000
  // total for 3 people (NOT a per-person rate) — so the AI can answer "how
  // much for 4 people?" with your real total price, not a guess.
  pricingBypackage: Record<string, number>;
  inclusions: string[];
  exclusions: string[];
  requirements: string[];
  locationsCovered: string[];
  itinerary: string[]; // one string per day, e.g. itinerary[0] = "Day 1: ..."
  faqs: { question: string; answer: string }[];
  description: string; // general overview text
}

export const PACKAGES: AIPackage[] = [
  {
    name: "Lachung & Yumthang Valley Tour Shared Budget",
    days: 2,
    nights: 1,
    type: "Nature",
    tourType: "Private Tour",
    maxGuests: 6,
    bestTime: "March to June & October to December",
    pricingBypackage: { "2": 6000, "3": 8000, "4": 10000, "5": 12000, "6": 14000 },
    inclusions: ["Accommodation in Lachung", "SUV Cab (Innova / Xylo / Scorpio)", "Driver Charges", "All Required Permits"],
    exclusions: ["Meals", "Personal Expenses", "Zero Point Visit Cost", "Anything Not Mentioned in Inclusions"],
    requirements: ["Aadhaar Card", "Voter ID", "Driving License", "Passport Size Photos", "Warm Clothes", "Valid ID Proof"],
    locationsCovered: ["Lachung (8600 ft)", "Yumthang Valley (11800 ft)", "Zero Point (15300 ft)"],
    itinerary: [
      "Day 1: Pickup from Gangtok, Drive to Lachung (8–9 hrs), Visit Singhik Viewpoint, Visit Chungthang Confluence, Check-in at hotel in Lachung, Overnight stay at Lachung.",
      "Day 2: Visit Yumthang Valley (Valley of Flowers), Optional visit to Zero Point (extra cost), Return to Lachung, Drive back to Gangtok, Drop at hotel and tour ends.",
    ],
    faqs: [
      { question: "Is Zero Point included?", answer: "No, Zero Point visit is optional and costs extra." },
      { question: "Is permit included?", answer: "Yes, all required permits are included in the package." },
    ],
    description: "Explore the beauty of Lachung and Yumthang Valley, also known as the Valley of Flowers, in this 2 Days / 1 Night scenic North Sikkim tour. Highlights include Yumthang Valley Visit, Lachung Stay, Zero Point Optional and Scenic Mountain Drive. Difficulty: Easy. Languages: English, Hindi and Nepali.",
  },
  {
    name: "Yumthang Lachung & Gangtok",
    days: 3,
    nights: 2,
    type: "Nature",
    tourType: "Private Tour",
    maxGuests: 6,
    bestTime: "March to June & October to December",
    pricingBypackage: { "2": 17000, "3": 19000, "4": 21000, "5": 23000, "6": 25000 },
    inclusions: ["Accommodation (Lachung & Gangtok)", "SUV Cab (Innova / Xylo / Scorpio)", "Driver Charges", "All Required Permits"],
    exclusions: ["Personal Expenses", "Zero Point Visit Cost", "Anything Not Mentioned in Inclusions"],
    requirements: ["Aadhaar Card", "Voter ID", "Driving License", "Passport Size Photos", "Warm Clothes", "Valid ID Proof"],
    locationsCovered: ["Lachung (8600 ft)", "Yumthang Valley (11800 ft)", "Gangtok (5500 ft)"],
    itinerary: [
      "Day 1: Pickup from NJP / Bagdogra Airport, Drive to Lachung (8–9 hrs), Seven Sisters Waterfall, Singhik Viewpoint, Chungthang Confluence, Night Stay at Lachung.",
      "Day 2: Visit Yumthang Valley (Valley of Flowers), Optional visit to Zero Point (extra cost), Lachung to Yumthang to Gangtok drive, Hotel check-in at Gangtok, Night Stay at Gangtok.",
      "Day 3: Gangtok Sightseeing including MG Marg, Banjhakri Waterfalls, Tashi Viewpoint and Flower Exhibition Centre, followed by Drop to NJP / Bagdogra.",
    ],
    faqs: [
      { question: "Is Zero Point included?", answer: "No, Zero Point visit is optional and costs extra." },
      { question: "Is permit included?", answer: "Yes, all required permits are included in the package." },
    ],
    description: "Discover the Valley of Flowers at Yumthang, scenic Lachung and Gangtok sightseeing in this 3 Days / 2 Nights North Sikkim tour from NJP. Highlights include Yumthang Valley Visit, Lachung Stay, Zero Point Optional and Gangtok Sightseeing.",
  },
  {
    name: "Gangtok, Pelling & Darjeeling Tour",
    days: 5,
    nights: 4,
    type: "Mixed",
    tourType: "Private Tour",
    maxGuests: 6,
    bestTime: "March to June & October to December",
    pricingBypackage: { "2": 19000, "3": 21000, "4": 23000, "5": 25000, "6": 27000 },
    inclusions: ["Accommodation (Hotel Stay)", "Breakfast & Dinner", "Private Cab for Entire Trip", "All Permits", "Parking Charges"],
    exclusions: ["Lunch", "Personal Expenses", "Airfare / Train Tickets", "Entry Fees", "Guide Charges"],
    requirements: ["Aadhaar Card", "Voter ID", "Passport", "Passport Size Photos", "Warm Clothes", "Valid ID Proof"],
    locationsCovered: ["Gangtok (5500 ft)", "Pelling (7200 ft)", "Darjeeling (6700 ft)"],
    itinerary: [
      "Day 1: Pickup from NJP Railway Station or Bagdogra Airport, Drive to Gangtok, Scenic Teesta River views, Hotel check-in, Evening visit to MG Marg, Overnight stay at Gangtok.",
      "Day 2: Gangtok sightseeing including Tashi Viewpoint, Ganesh Tok, Plant Conservatory, Handloom & Handicraft Center, Institute of Tibetology and Dro-Dul Chorten Monastery, Overnight stay at Gangtok.",
      "Day 3: Drive to Pelling, Visit Ravangla Buddha Park en route, Explore Pelling attractions, Overnight stay at Pelling.",
      "Day 4: Visit Pelling Sky Walk, Pemayangtse Monastery, Rabdentse Ruins and Khecheopalri Lake, Drive to Darjeeling, Check-in and overnight stay at Darjeeling.",
      "Day 5: Early morning visit to Tiger Hill for sunrise, Visit Batasia Loop & War Memorial, Ghoom Monastery, Japanese Temple & Peace Pagoda, Drop to NJP Railway Station or Bagdogra Airport.",
    ],
    faqs: [
      { question: "Is Nathula Pass included?", answer: "It is optional and depends on permit availability and weather conditions." },
      { question: "Are meals included?", answer: "[INCOMPLETE — was cut off as: \"Breakfast and dinner are i...\"]" },
    ],
    description: "Explore the best of Sikkim and Darjeeling with Gangtok sightseeing, Pelling attractions and Darjeeling sunrise views in this 5 Days / 4 Nights tour. Highlights include Gangtok Local Sightseeing, Pelling Sky Walk, Kanchenjunga Views, Tiger Hill Sunrise and Darjeeling Heritage Attractions.",
  },
  {
    name: "Gangtok & Changu Lake",
    days: 4,
    nights: 3,
    type: "Nature",
    tourType: "Private Tour",
    maxGuests: 6,
    bestTime: "March to June & October to December",
    pricingBypackage: { "2": 18000, "3": 20000, "4": 12000, "5": 24000, "6": 26000 },
    inclusions: ["Accommodation in Gangtok", "Private Cab for Full Tour", "Driver Charges", "All Required Permits"],
    exclusions: ["Meals Not Mentioned", "Nathula Pass Charges", "Personal Expenses", "Anything Not Mentioned in Inclusions"],
    requirements: ["Valid ID Proof", "Passport Size Photos", "Warm Clothes for Changu Lake", "Permit Documents"],
    locationsCovered: ["Gangtok (5500 ft)", "Changu Lake (12400 ft)", "Baba Mandir (13000 ft)"],
    itinerary: [
      "Day 1: Pickup from NJP Railway Station, Drive to Gangtok (4–5 hrs), Scenic Teesta River views, Hotel check-in, Evening visit to MG Marg, Night Stay at Gangtok.",
      "Day 2: Breakfast at hotel, Visit Tashi View Point, Ganesh Tok, Hanuman Tok and Banjhakri Falls, Night Stay at Gangtok.",
      "Day 3: Early morning start, Visit Changu Lake (12,400 ft), Baba Harbhajan Singh Mandir, Optional Nathula Pass (extra cost), Return to Gangtok, Night Stay at Gangtok.",
      "Day 4: Breakfast, Hotel checkout, Drive to NJP (4–5 hrs), Drop at NJP Railway Station.",
    ],
    faqs: [
      { question: "Is Nathula Pass included?", answer: "Nathula Pass is optional and depends on permit availability." },
      { question: "Is Changu Lake permit included?", answer: "Yes, all required permits are included in the package." },
    ],
    description: "Explore Gangtok local sightseeing with Changu Lake and Baba Mandir in this 4 Days / 3 Nights Sikkim tour with NJP pickup and drop. Highlights include Gangtok Local Sightseeing, Changu Lake Visit, Baba Mandir Excursion and MG Marg Evening.",
  },
  {
    name: "Nathula Pass & Tsomgo Lake Tour",
    days: 1,
    nights: 0,
    type: "Adventure",
    tourType: "Sharing Tour",
    maxGuests: 10,
    bestTime: "October to May",
    pricingBypackage: { "2": 2000, "3": 3000, "4": 4000, "5": 5000, "6": 6000 },
    inclusions: ["Shared Vehicle (Permit Included)", "Driver Assistance", "All Required Permits for Nathula Pass"],
    exclusions: ["Meals", "Personal Expenses", "Entry Fees (if applicable)", "Anything Not Mentioned in Inclusions"],
    requirements: ["Original ID Proof (Mandatory)", "Warm Clothes", "Sunglasses", "Sunscreen", "Water", "Snacks"],
    locationsCovered: ["Tsomgo Lake (12400 ft)", "Baba Mandir (13500 ft)", "Nathula Pass (14140 ft)"],
    itinerary: [
      "Day 1: Morning Departure at 8:00 AM from Vajra Stand, Gangtok in a shared vehicle, Visit Tsomgo Lake (Changu Lake), Visit Baba Harbhajan Singh Mandir, Reach Nathula Pass (Indo-China Border) and enjoy Himalayan views, Evening Return between 4:00 PM and 5:00 PM back to Gangtok.",
    ],
    faqs: [
      { question: "Is Nathula Pass permit included?", answer: "Yes, permit is included in the package." },
      { question: "Is this a private tour?", answer: "No, this is a shared vehicle tour." },
    ],
    description: "Visit Nathula Pass, Tsomgo Lake and Baba Mandir in this 1-day scenic high-altitude tour from Gangtok. Highlights include Nathula Pass Visit, Tsomgo Lake, Baba Mandir and Shared Vehicle Tour. Minimum Age: 3 Years. Languages: English, Hindi and Nepali.",
  },
  {
    name: "Gurudongmar Lachen & Gangtok",
    days: 3,
    nights: 2,
    type: "Adventure",
    tourType: "Private Tour",
    maxGuests: 6,
    bestTime: "April to June & October to December",
    pricingBypackage: { "2": 15000, "3": 17000, "4": 19000, "5": 21000, "6": 23000, "7": 25000 },
    inclusions: ["Accommodation in Premium Hotel", "SUV Cab (Innova / Xylo / Scorpio)", "Breakfast, Lunch and Dinner", "Driver Charges", "All Required Permits"],
    exclusions: ["Personal Expenses", "Kalapathar Visit Cost", "Any Other Sightseeing Not Included"],
    requirements: ["Aadhaar Card", "Voter ID", "Driving License", "Passport Size Photos", "Warm Clothes", "Valid ID Proof"],
    locationsCovered: ["Lachen (9000 ft)", "Gurudongmar Lake (17800 ft)", "Gangtok (5500 ft)"],
    itinerary: [
      "Day 1: Pickup from NJP / Bagdogra Airport, Drive to Lachen (8–9 hrs), Seven Sisters Waterfall, Singhik Viewpoint, Chungthang Confluence, Night Stay at Lachen.",
      "Day 2: Early morning visit to Gurudongmar Lake, Optional visit to Kalapathar (extra cost), Stop at Thangu Valley, Drive Lachen to Gangtok, Hotel check-in at Gangtok, Night Stay at Gangtok.",
      "Day 3: Gangtok Sightseeing including MG Marg, Banjhakri Waterfalls, Tashi Viewpoint and Flower Exhibition Centre, followed by Drop to NJP / Bagdogra.",
    ],
    faqs: [
      { question: "Which cab is provided?", answer: "SUV cab like Innova, Xylo or Scorpio." },
      { question: "Is Gurudongmar permit included?", answer: "Yes, all required permits are included." },
    ],
    description: "Explore North Sikkim with Gurudongmar Lake, Lachen and Gangtok in this 3 Days / 2 Nights premium SUV tour from NJP. Highlights include Gurudongmar Lake Visit, Lachen & Gangtok Stay, Seven Sisters Waterfall and Thangu Valley.",
  },
  {
    name: "Gangtok & Darjeeling Tour",
    days: 4,
    nights: 3,
    type: "Mixed",
    tourType: "Private Tour",
    maxGuests: 6,
    bestTime: "March to June & October to December",
    pricingBypackage: { "2": 19000, "3": 21000, "4": 23000, "5": 25000, "6": 27000 },
    inclusions: ["Accommodation (Hotel Stay)", "Breakfast & Dinner", "Private Cab for Entire Trip", "All Permits", "Parking Charges"],
    exclusions: ["Lunch", "Personal Expenses", "Airfare / Train Tickets", "Entry Fees", "Guide Charges"],
    requirements: ["Aadhaar Card / Voter ID / Passport", "Passport Size Photos", "Warm Clothes", "Valid ID Proof"],
    locationsCovered: ["Gangtok (5500 ft)", "Tsomgo Lake (12400 ft)", "Darjeeling (6700 ft)"],
    itinerary: [
      "Day 1: Pickup from NJP Railway Station / Bagdogra Airport, Drive to Gangtok via Teesta River, Hotel Check-in, Evening visit to MG Marg, Overnight stay at Gangtok.",
      "Day 2: Early morning drive to Tsomgo Lake, Enjoy snow activities and yak ride, Visit Baba Harbhajan Singh Mandir, Optional Nathula Pass visit (closed Monday), Visit Hangu Lake if permitted, Overnight stay at Gangtok.",
      "Day 3: Visit Tashi Viewpoint, Ganesh Tok, Plant Conservatory, Handloom & Handicraft Center, Institute of Tibetology and Dro-Dul Chorten Monastery, Drive to Darjeeling, Check-in and overnight stay at Darjeeling.",
      "Day 4: Early morning visit to Tiger Hill for sunrise, Visit Batasia Loop & War Memorial, Visit Ghoom Monastery, Japanese Temple & Peace Pagoda, Drop to NJP / Bagdogra Airport.",
    ],
    faqs: [
      { question: "Is Nathula Pass included?", answer: "It is optional and depends on permit availability and weather conditions." },
      { question: "Are meals included?", answer: "[INCOMPLETE — was cut off as: \"Breakfas...\"]" },
    ],
    description: "Discover the beauty of Gangtok and Darjeeling with lakes, monasteries and sunrise views in this 4 Days / 3 Nights tour. Highlights include MG Marg Exploration, Tsomgo Lake Visit, Tiger Hill Sunrise and Darjeeling Sightseeing.",
  },
  {
    name: "South & West Sikkim Tour (Namchi, Ravangla & Pelling)",
    days: 4,
    nights: 3,
    type: "Religious",
    tourType: "Private Tour",
    maxGuests: 6,
    bestTime: "March to June & October to December",
    pricingBypackage: { "2": 18000, "3": 20000, "4": 22000, "5": 24000, "6": 26000 },
    inclusions: ["Accommodation in Namchi & Pelling", "Private Cab for Full Tour", "Driver Charges", "All Sightseeing as per Itinerary"],
    exclusions: ["Meals Not Mentioned", "Entry Tickets", "Personal Expenses", "Anything Not Mentioned in Inclusions"],
    requirements: ["Aadhaar Card / Voter ID / Driving License", "Passport Size Photos", "Valid ID Proof", "For Children: Birth Certificate or School ID"],
    locationsCovered: ["Namchi (5500 ft)", "Ravangla (7000 ft)", "Pelling (7200 ft)"],
    itinerary: [
      "Day 1: Pickup from NJP Railway Station, Drive to Namchi (5–6 hrs), Hotel check-in, Explore Namchi town, Overnight stay at Namchi.",
      "Day 2: Breakfast, Drive to Pelling, Visit Siddhesvara Dham (Char Dham), Visit Ravangla Buddha Park, Reach Pelling, Hotel check-in, Overnight stay at Pelling.",
      "Day 3: Full day Pelling sightseeing including Sky Walk Pelling, Pemayangtse Monastery, Rabdentse Ruins, Khecheopalri Lake, Rimbi Waterfalls and Sunset View of Kanchenjunga, Overnight stay at Pelling.",
      "Day 4: Breakfast, Hotel checkout, Drive back to NJP (6–7 hrs), Drop at NJP Railway Station.",
    ],
    faqs: [
      { question: "Is Kanchenjunga view guaranteed?", answer: "Clear views depend on weather conditions." },
      { question: "Is Ravangla Buddha Park included?", answer: "Yes, Ravangla Buddha Park is included in the itinerary." },
    ],
    description: "Discover the beauty of South and West Sikkim covering Namchi, Ravangla and Pelling. This 4 Days / 3 Nights tour includes NJP pickup and drop, scenic mountain drives and Kanchenjunga views. Highlights include Namchi Hill Town, Ravangla Buddha Park, Pelling Sky Walk and Khecheopalri Lake.",
  },
  {
    name: "North Sikkim Tour (Lachen, Lachung & Gangtok)",
    days: 4,
    nights: 3,
    type: "Adventure",
    tourType: "Private Tour",
    maxGuests: 6,
    bestTime: "April to June & October to December",
    pricingBypackage: { "2": 22000, "3": 24000, "4": 26000, "5": 28000, "6": 30000 },
    inclusions: ["Accommodation", "SUV Cab (Innova / Xylo / Scorpio)", "Breakfast, Lunch and Dinner", "Driver Charges", "All Required Permits"],
    exclusions: ["Personal Expenses", "Zero Point Visit Cost", "Entry Fees", "Anything Not Mentioned in Inclusions"],
    requirements: ["Aadhaar Card", "Voter ID", "Driving License", "Passport Size Photos", "Warm Clothes", "Valid ID Proof"],
    locationsCovered: ["Lachen (9000 ft)", "Gurudongmar Lake (17800 ft)", "Lachung (8600 ft)", "Yumthang Valley (11800 ft)", "Gangtok (5500 ft)"],
    itinerary: [
      "Day 1: Pickup from NJP / Bagdogra Airport, Drive to Lachen, Visit Seven Sisters Waterfall, Singhik Viewpoint and Chungthang Confluence, Overnight Stay at Lachen.",
      "Day 2: Early morning visit to Gurudongmar Lake, Return to Lachen, Transfer to Lachung, Overnight Stay at Lachung.",
      "Day 3: Visit Yumthang Valley, Optional visit to Zero Point (extra cost), Drive to Gangtok, Hotel Check-in, Overnight Stay at Gangtok.",
      "Day 4: Gangtok Sightseeing including MG Marg, Banjhakri Waterfalls, Tashi Viewpoint and Flower Exhibition Centre, followed by Drop to NJP / Bagdogra.",
    ],
    faqs: [
      { question: "Is Gurudongmar permit included?", answer: "Yes, all required permits are included." },
      { question: "Is Zero Point included?", answer: "No, Zero Point visit is optional and costs extra." },
    ],
    description: "Explore the best of North Sikkim including Gurudongmar Lake, Yumthang Valley, Lachen, Lachung and Gangtok in this 4 Days / 3 Nights adventure tour. Experience the breathtaking landscapes of North Sikkim with snow-capped mountains, alpine lakes and scenic valleys.",
  },
];

// ═══════════════════════════════════════════════════════════════════════
// HOTELS
// ═══════════════════════════════════════════════════════════════════════
export interface AIHotel {
  name: string;
  city: string;
  pricePerNight: number;
  rating: number;
}

export const HOTELS: AIHotel[] = [
  // Example — replace with your real hotels.
  // { name: "Royal Gangtok", city: "Gangtok", pricePerNight: 10000, rating: 4.8 },
];

// ═══════════════════════════════════════════════════════════════════════
// OTHER EXACT FACTS
// ═══════════════════════════════════════════════════════════════════════
// Checked BEFORE the AI is ever called for general questions (see
// findLocalAnswer in chatLogic.tsx) — but more importantly, ALSO reachable
// via the searchFacts tool (aiTools.ts) mid-conversation, so the AI can
// pull an exact fact even in the middle of a longer answer instead of only
// on the very first message. Every answer below is copied verbatim from
// Sikkim Tourism's real Protected Area Permit (PAP) requirements — the AI
// is instructed to retrieve these rather than paraphrase permit rules from
// memory, since a paraphrased permit rule is exactly the kind of thing that
// could mislead a traveler.
export const FACTS: string[] = [
  "Protected Area Permit (PAP) overview: Required for domestic and foreign tourists visiting Sikkim's protected areas, issued by the Tourism & Civil Aviation Department, Police Check Posts, and authorised offices through registered Travel Agencies. Domestic tourists and locals can get PAPs for protected areas across Sikkim. Foreign tourists are only permitted for Tsomgo Lake (East Sikkim) and the Lachen–Lachung–Yumthang–Thangu Valley area (North Sikkim) — foreigners are not permitted at Nathula Pass, Gurudongmar Lake, or Zuluk. Motorbikes must have an engine capacity of 150cc or higher to enter PAP areas.",

  "Nathula Pass permit: For Indian nationals only — foreigners are NOT allowed. Permit is issued by the Tourism Department, and the vehicle permit by the Police Check Post, applied through a registered Travel Agency. Documents required for Indians: Voter ID or Driving License, plus 2 passport-size photographs. Kids below 18 need their birth certificate or father's Voter ID/passport — Aadhaar card is NOT accepted as ID for this permit.",

  "Gurudongmar Lake permit: For Indian nationals, permit is issued by the Police Check Post. Documents required: Voter ID or Driving License, plus 2 passport-size photographs (kids below 18 need birth certificate or father's Voter ID/passport — Aadhaar is NOT accepted). Foreigners are NOT allowed to Gurudongmar Lake itself, but foreigners MAY visit Lachen and Yumthang — for that, foreigners need a photocopy of a valid passport, Indian visa, 2 passport-size photos, original documents, and an Inner Line Permit (ILP).",

  "Zuluk permit: For Indian nationals only — foreigners are NOT allowed. Documents required: Voter ID or Driving License, plus 2 passport-size photographs. Kids below 18 need birth certificate or father's Voter ID/passport — Aadhaar is NOT accepted as ID for this permit.",

  "Tsomgo Lake and Baba Mandir permit: Issued by the Police Check Post for domestic tourists. Foreign tourists ARE allowed here (unlike Nathula or Gurudongmar) — the permit for foreigners is issued by the Tourism & Civil Aviation Department, with the vehicle permit from the Police Check Post, applied through a registered Travel Agency.",

  "Yumthang Valley permit: Issued by the Police Check Post for domestic tourists. For foreign tourists, the permit is issued by the Tourism Department and the vehicle permit from the Police Check Post.",

  "Yumesamdong (Zero Point) permit: Issued by the Police Check Post for domestic tourists. For foreign tourists, the permit is issued by the Tourism Department and the vehicle pass from the Police Check Post.",

  "Thangu–Chopta Valley permit: Issued by the Police Check Post for domestic tourists. For foreign tourists, the permit is issued by the Tourism Department and the vehicle permit by the Police Check Post — foreigners must apply through a Sikkim Tourism registered Travel Agent, and must travel in groups of two or more.",

  "Dzongri Trek permit: Issued by TIC (Tourist Information Centre) Pelling and TIC Gangtok.",

  "Singalila Trek permit: Issued by TIC Pelling, after clearance from the Home Department, Forest Department, and Army — applied through a registered Travel Agency.",

  "Maenam Trekking permit: Issued from TIC Pelling and TIC Gangtok through a registered Travel Agency, after clearance from Home Department, Army, Forest Department, and Police.",

  "Green Lake Trek permit: Issued by the Adventure Cell of the Tourism Department, after clearance from the Forest Department, Home Department, and Army — applied through a registered Travel Agency.",

  "Alpine Mountaineering Expedition permit: Issued by the Tourism Department after clearance from the Home Department, Forest Department, Army, and Police, for notified peaks only (per Home Department Notification No. 25/Home/2006 dated 20/03/2006). Notified peaks: Tinchen Khang (5,603m, West Sikkim), Jopuno (5,935m, West Sikkim), Frey's Peak (5,830m, West Sikkim), Lama Angden (5,868m, North Sikkim), Brum Khangse (5,433m, North Sikkim).",

  "National Park and Wildlife Sanctuary entry permit: Entry permits for Sikkim's national parks and wildlife sanctuaries are issued by the Forest Department at Gangtok.",

  "Two-wheeler / motorbike permit for PAP areas: Engine capacity must be 150cc or higher to enter Protected Area Permit (PAP) areas. Documents required: registration certificate of the bike, driving license, pollution certificate, insurance certificate, 2 passport-size photographs, and identity proof of both rider and co-rider.",

  // ─── Restricted Area Permit (RAP) — for foreign tourists ───────────────
  "Restricted Area Permit (RAP) overview: Every foreigner (excluding people of Bhutanese origin) who wishes to enter and stay in a Protected or Restricted Area of Sikkim must obtain a Restricted Area Permit (RAP), issued FREE OF COST by authorised offices of the Government of India and the Tourism Department. Citizens of Nepal or Bangladesh may produce a valid identity card reflecting their origin instead. All foreigners must register within 24 hours of arrival in Sikkim.",

  "RAP prior clearance — Pakistan/Afghanistan/China (PRC category): Nationals, OCIs, or citizens of Pakistan, Afghanistan, or China (including Hong Kong and Macau) — classified under the Prior Reference Category (PRC) — must obtain prior approval from the Ministry of Home Affairs, Government of India, New Delhi, before applying for a Restricted Area Permit (RAP). This also applies to individuals of Pakistani, Afghan, or Chinese origin by birth.",

  "RAP prior clearance — Myanmar/Nigeria: Individuals born in, or who are nationals, OCIs, or citizens of Myanmar or Nigeria need prior clearance from either the Ministry of Home Affairs or the Home Department of Sikkim before entering the state on a Restricted Area Permit (RAP).",

  "Restricted areas open to foreigners under RAP, by district: East District (8 places) — Gangtok, Rumtek, Pakyong, Barapathing, Rongli, Rhenock, Aritar, Rorathang. West District (6 places) — Gyalshing, Soreng, Pemayangtse, Khecheopalri, Tashiding, Yuksom. South District (2 places) — Namchi, Ravangla. North District (3 places) — Phodong, Mangan, Singhik (up to Toong). Note: visiting Tsomgo Lake (East) or the Lachen–Lachung–Yumthang–Thangu Valley (North) needs a SEPARATE Protected Area Permit (PAP), not covered by the RAP alone — Tsomgo Lake is a day excursion, and North Sikkim valleys are issued for a minimum of 3 days/2 nights up to a maximum of 5 days/4 nights, supervised by a registered guide.",

  "RAP validity and extension: Foreigners are allowed to stay up to 30 days on issue of a Restricted Area Permit (RAP). Any extension must be applied for at least 2 days before expiry. Extensions beyond 30 days are granted by the Foreigners Registration Office (FRO) Gangtok, and the Superintendent of Police at Namchi, Mangan, and Gyalshing — total stay must not exceed 60 days.",

  "Where to obtain a RAP: Ministry of Home Affairs (Lok Nayak Bhawan, New Delhi); all Indian Missions/embassies abroad; Airport Immigration Offices at Pakyong and Bagdogra; Tourist Information Centre, Siliguri (SNT Complex, Tourism Department); Assistant Director, Tourism Department offices in Kolkata (4/1 Middleton Street), Melli (South Sikkim, near Melli Police Check Post), and Rangpo (East Sikkim); Sikkim House, New Delhi; Deputy Commissioner, Darjeeling; Home Department, Government of West Bengal, Kolkata; and Tourist Information Centres at Bagdogra, Pakyong, Rambam, and Reshi. The RAP is issued free of cost from all these offices. ILP issuing time at the Melli office is 8 AM to 8 PM every day; other Tourist Information Centres generally operate 9:30 AM to 5:00 PM.",

  "How to apply for a RAP (step by step): 1) Fill the application form with name, nationality, passport number and validity date, entry date and exit date, and submit at the permit office. 2) Submit a copy of your valid passport, visa, and a passport-size photo — the office verifies these details, and invalid documents make the application invalid. 3) On successful verification, the permit is issued with a unique reference number, valid for 30 days. 4) A copy of the application/permit is submitted to the Foreigners Registration Office (FRO) for record and database entry. 5) The foreigner may stay for 30 days unless prior permission for an extension is obtained. 6) On exiting Sikkim, the foreigner must present themselves at the FRO office to record their exit details.",

  "RAP special conditions: A Protected Area Permit (PAP) for a group of two or more foreign tourists can be obtained through a Sikkim Tourism registered Travel Agent (per the Sikkim Registration of Tourist Trade Rules, 2008). Trekking permits in protected areas are issued free of cost by the Assistant Director, Sikkim Tourism Office, Gangtok — trekkers must also provide a valid physical fitness certificate from a competent central/state government medical officer. If a foreigner intends to visit a Protected/Restricted Area for non-tourism purposes (business, employment, studies) on a non-tourist visa, prior permission from the Ministry of Home Affairs is required, and the permit is endorsed on the passport for that specific purpose. A foreigner holding a non-tourist visa but visiting only for tourism may instead be granted a Special Permit for places open to tourism.",

  // ─── Responsible Tourism / Do's & Don'ts ────────────────────────────────
  "Sikkim responsible tourism — environment & waste: Use designated dustbins; carry reusable water bottles and shopping bags; protect forests, alpine meadows, rivers, waterfalls and lakes; stay only on designated trekking trails and tourist routes; report forest fires, landslides or environmental hazards to local authorities; carry your waste back if bins are unavailable; never throw garbage into rivers, lakes or valleys, or burn plastic or other waste. Sikkim enforces strict environmental protection policies with penalties for littering.",

  "Sikkim wildlife protection rules: Do not feed wild animals or birds; never disturb wildlife or their habitats; do not collect plants, flowers, medicinal herbs or rare species; avoid loud music inside forests and protected areas; never purchase products made from endangered wildlife.",

  "Sikkim single-use plastic ban: Sikkim has one of India's strongest environmental protection policies — many single-use plastic items are prohibited, with regular enforcement drives and penalties for violations. Avoid carrying: plastic carry bags, plastic cups and plates, plastic straws, disposable cutlery, thermocol items, plastic flags, and certain PET bottles and other banned plastic products. Choose reusable, eco-friendly alternatives instead.",

  "Sikkim high-altitude safety: Many destinations in Sikkim are above 3,000–5,000 metres. Stay hydrated, avoid excessive alcohol, ascend gradually whenever possible, rest if you experience altitude sickness symptoms, follow medical advice immediately if symptoms worsen, and carry any prescribed medicines you may need.",

  "Sikkim road travel safety: Hire only registered travel agencies and licensed taxi operators; follow speed limits on mountain roads; wear seat belts at all times; wear helmets while riding motorcycles; avoid driving during heavy rainfall, snowfall or landslides unless advised it is safe; follow police and traffic advisories.",

  "Sikkim monastery and religious site etiquette: Dress modestly; remove footwear where required; maintain silence inside monasteries; ask permission before photographing monks, ceremonies or local residents; respect prayer flags, prayer wheels and sacred monuments; walk clockwise around stupas and religious structures where customary; make donations only through authorised donation boxes.",

  "Sikkim photography etiquette: Ask permission before photographing individuals; respect photography restrictions in religious and military areas; never fly drones in restricted or protected zones without official approval; avoid disturbing wildlife for photographs.",

  "Sikkim adventure tourism safety: Before trekking, mountain biking, rafting or other adventure activities — choose only authorised operators, wear certified safety equipment, follow guide instructions, inform someone about your itinerary, and check weather conditions before departure.",

  "Sikkim smoking and alcohol rules: Avoid smoking near monasteries, temples and sacred places; avoid consuming alcohol in religious or culturally sensitive locations; do not litter cigarette butts; never drink and drive under any circumstances.",

  "Sikkim emergency guidance: During emergencies, follow directions issued by Police, Tourism Officials, Forest Officials and Disaster Management Authorities. Cooperate during landslides, road closures or weather-related restrictions. Do not cross road barricades or enter restricted areas.",

  "Sikkim responsible community tourism: Buy authentic local handicrafts, stay in registered hotels and homestays, respect local traditions and festivals, support local guides and businesses, and avoid bargaining that may unfairly impact small vendors.",
];