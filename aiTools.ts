// ─── aiTools.ts ───────────────────────────────────────────────────────────
// Real function/tool calling: instead of stuffing facts into the prompt, the
// AI decides "I need real cab pricing" and calls getCabPrice() directly —
// reading from your real data files, which you maintain. The number the AI
// says to the user is your real data, verbatim; the AI only phrases it into
// a sentence, it never invents or alters the figure itself.
//
// Data sources — split across two files by risk tier:
// - aidata1.ts — Tier 1 business data (cab routes, packages, hotels).
//   Wrong data here costs a bad quote, recoverable.
// - aidata2.ts — Tier 2 sensitive data (permit rules, Do's & Don'ts).
//   Wrong data here could cost someone their trip or their safety, so it's
//   kept in its own file and never edited alongside pricing changes.
// Edit those two files to add your real data; this file doesn't need to
// change when you do (except the searchFacts matching logic below, which
// is worth understanding — see its comment).

import { CAB_ROUTES, PACKAGES, HOTELS } from "./aidata1";
import { FACTS } from "./aidata2";

// ─── Tool definitions — sent to OpenAI so it knows what it can call ───────
export const TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "getCabPrice",
      description: "Get exact real cab/taxi prices between two Sikkim locations. Always use this instead of guessing a price.",
      parameters: {
        type: "object",
        properties: {
          from: { type: "string", description: "Starting city, e.g. Gangtok, Siliguri" },
          to: { type: "string", description: "Destination city, e.g. Pelling. Optional — omit to see all routes from 'from'." },
        },
        required: ["from"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "searchHotels",
      description: "Search real, currently-listed hotels in a Sikkim city, with actual prices and ratings. Always use this instead of guessing hotel names or prices.",
      parameters: {
        type: "object",
        properties: {
          city: { type: "string", description: "City to search, e.g. Gangtok, Pelling" },
        },
        required: ["city"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "searchPackages",
      description: "Search real, currently-listed tour packages, optionally filtered by trip length in days, trip type, number of travelers (to get the exact price for that group size), and/or a specific place/region the user asked about. ALWAYS pass 'location' when the user names a specific place (e.g. 'Gurudongmar', 'North Sikkim', 'Pelling') — without it, results aren't filtered by place at all and you may get back packages that don't cover what was actually asked for. Always use this instead of inventing a package or price.",
      parameters: {
        type: "object",
        properties: {
          days: { type: "number", description: "Desired trip length in days, if the user mentioned one" },
          type: { type: "string", description: "Trip type if mentioned: Adventure, Nature, Religious, Honeymoon, Family, or Mixed" },
          people: { type: "number", description: "Number of travelers, if mentioned — returns the exact price for that group size" },
          location: { type: "string", description: "A specific place or region the user named, e.g. 'Gurudongmar', 'North Sikkim', 'Pelling'. Matched against each package's real locationsCovered — only packages that actually cover this place are returned." },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "searchFacts",
      description: "Search exact, verified facts about permits (ILP/PAP/RAP), required documents, and responsible-tourism rules. ALWAYS use this for ANY permit-related question — general permit mechanics (validity, fees, process) or a specific place — never answer permit questions from memory alone.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Keyword or short phrase to search for, e.g. 'inner line permit', 'Nathula documents', 'RAP validity', 'Rumtek permit'. Prefer a SHORT phrase (1-3 words) over a long sentence — matching is more reliable with fewer words." },
        },
        required: ["query"],
      },
    },
  },
];

// ─── Tool execution — actually runs the lookup against your data files ───
function getCabPrice(args: { from: string; to?: string }) {
  const fromLower = args.from.toLowerCase();
  const matches = CAB_ROUTES.filter(r =>
    r.from.toLowerCase() === fromLower &&
    (!args.to || r.to.toLowerCase() === args.to!.toLowerCase())
  );
  if (matches.length === 0) {
    return { found: false, message: `No cab price found for ${args.from}${args.to ? ` to ${args.to}` : ""} in the current data.` };
  }
  return { found: true, routes: matches };
}

function searchHotels(args: { city: string }) {
  const key = args.city.toLowerCase();
  const matches = HOTELS.filter(h => h.city.toLowerCase().includes(key));
  if (matches.length === 0) {
    return { found: false, message: `No hotels found in ${args.city} in the current listings.` };
  }
  return { found: true, hotels: matches.slice(0, 5) };
}

// Safely pulls the price for a specific group size out of a package's
// pricingBypackage field. Defensive on purpose: aidata1.ts is hand-edited, and
// a malformed entry (e.g. a plain string instead of the expected
// { "2": 15000, "3": 17000, ... } object) should never crash the whole
// request — it should just come back as "price not available" so the AI can
// say so honestly instead of the server throwing a 500.
function getPriceForGroupSize(pkg: any, people?: number): number | null | undefined {
  if (typeof people !== "number") return undefined;
  const pricing = pkg.pricingBypackage;
  if (!pricing || typeof pricing !== "object") return null; // malformed entry — no crash, just "not available"
  return pricing[String(people)] ?? null;
}

function searchPackages(args: { days?: number; type?: string; people?: number; location?: string }) {
  let list = [...PACKAGES];

  if (args.type) {
    const typeLower = args.type.toLowerCase();
    list = list.filter(p => p.type.toLowerCase() === typeLower);
  }

  // Location filtering — matches against each package's REAL locationsCovered
  // field (falling back to name/description) instead of blindly returning
  // whatever happens to be first in the array. If a location was asked for
  // and nothing actually covers it, this returns found:false explicitly —
  // it does NOT fall back to an unrelated package, since that's exactly the
  // failure mode that let the AI previously recommend a Darjeeling package
  // for a Gurudongmar request and falsely claim it covered Gurudongmar.
  if (args.location) {
    const locQuery = args.location.toLowerCase();
    const locationMatches = list.filter(p => {
      const locations = (p.locationsCovered ?? []).map((l: string) => l.toLowerCase());
      return locations.some((l: string) => l.includes(locQuery) || locQuery.includes(l.replace(/\s*\(.*\)/, "").trim()))
        || p.name.toLowerCase().includes(locQuery)
        || p.description.toLowerCase().includes(locQuery);
    });
    if (locationMatches.length === 0) {
      return { found: false, message: `No packages found covering "${args.location}" in the current listings.` };
    }
    list = locationMatches;
  }

  if (typeof args.days === "number") {
    list.sort((a, b) => Math.abs(a.days - args.days!) - Math.abs(b.days - args.days!));
  }
  if (list.length === 0) {
    return { found: false, message: "No matching packages found in the current listings." };
  }
  const top = list.slice(0, 5).map(p => ({
    ...p,
    // Exact price for the requested group size, if given and available —
    // saves the AI from having to parse the whole pricingBypackage table itself.
    priceForRequestedGroupSize: getPriceForGroupSize(p, args.people),
  }));
  return { found: true, packages: top };
}

// Matches by SCORING how many significant query words appear in each fact
// (any order, any position), then taking the best match(es) — instead of
// requiring literal substring order OR every single word to be present.
//
// Why this matters: even after fixing the exact-substring bug (see below),
// requiring ALL words to match was still too brittle for natural phrasing.
// "how long is a Restricted Area Permit valid for" includes filler words
// like "long" and "many" that never literally appear in the fact text even
// though the fact is clearly the right one — real permit questions get
// asked in dozens of phrasings, and this tool needs to find the right fact
// regardless of exact wording, not just when the AI happens to phrase its
// search query in a way that lines up with the fact's own wording.
//
// Scoring: a fact needs at least half its query's significant words present
// to count as a strong match. If nothing clears that bar, the single best
// partial match is still returned as long as it's a reasonable match
// (30%+) — better to surface a possibly-relevant fact than to silently
// return found:false and push the AI back to guessing on a permit question.
// A genuinely unrelated query (no meaningful overlap with any fact) still
// correctly returns found:false.
//
// Short common words (the, a, is, for, how, ...) are filtered out first so
// they don't dilute scoring — matching should hinge on meaningful words
// (place names, "permit", "validity", "documents"), not connector words.
const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "for", "to", "of", "in", "on", "at",
  "and", "or", "do", "does", "i", "need", "my", "me", "what", "how",
  "can", "will", "be", "it", "this", "that", "with",
]);

function searchFacts(args: { query: string }) {
  const words = args.query
    .toLowerCase()
    .split(/\s+/)
    .map(w => w.replace(/[^\w]/g, "")) // strip punctuation
    .filter(w => w.length > 0 && !STOPWORDS.has(w));

  if (words.length === 0) {
    return { found: false, message: `No exact fact found for "${args.query}".` };
  }

  const scored = FACTS
    .map(f => {
      const lower = f.toLowerCase();
      const matchCount = words.filter(w => lower.includes(w)).length;
      return { fact: f, score: matchCount / words.length };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score);

  let matches = scored.filter(s => s.score >= 0.5).map(s => s.fact);
  if (matches.length === 0 && scored.length > 0 && scored[0].score >= 0.3) {
    matches = [scored[0].fact]; // best partial match, still worth surfacing over a flat "not found"
  }

  if (matches.length === 0) {
    return { found: false, message: `No exact fact found for "${args.query}".` };
  }
  return { found: true, facts: matches.slice(0, 3) }; // cap at top 3 so the AI isn't flooded with tangential facts
}

// Dispatches a tool call by name — used in the tool-calling loop in api/chat.ts
// ─── Deterministic place detection — a code-level backstop ────────────────
// Relying on the system prompt alone to make the AI pass `location` to
// searchPackages proved unreliable in practice: even with an explicit rule
// AND a worked example, gpt-4o-mini repeatedly ignored it and called
// searchPackages with guessed days/type instead, across multiple different
// phrasings of the same request. The prompt likely got too long (~23K
// characters with many "CRITICAL" sections) for one buried rule to reliably
// win attention. Since this is plain string matching, it's 100% deterministic
// regardless of how the AI is or isn't following prompt instructions — used
// by local-server.ts/api/chat.ts to inject a short, freshly-positioned
// reminder right before the AI's turn instead of leaving it to compete with
// everything else in the system prompt.
//
// Sorted longest-first so more specific names (e.g. "Zero Point") are
// checked before shorter ones that might be substrings of something else.
export const KNOWN_PLACES: string[] = [
  "Gurudongmar Lake", "Gurudongmar", "Lachung", "Lachen", "Yumthang Valley", "Yumthang",
  "Zero Point", "Dzongu", "Mangan", "Phodong", "Thangu", "Chopta Valley",
  "Gangtok", "Tsomgo Lake", "Tsomgo", "Changu Lake", "Changu", "Nathula Pass", "Nathula",
  "Zuluk", "Baba Mandir", "Rongli", "Rhenock", "Rumtek",
  "Pelling", "Yuksom", "Rinchenpong", "Khecheopalri Lake", "Khecheopalri",
  "Rabdentse", "Pemayangtse", "Dzongri", "Singalila", "Gyalshing", "Soreng", "Tashiding",
  "Namchi", "Ravangla", "Temi Tea Garden", "Temi", "Jorethang", "Samdruptse", "Maenam",
  "Darjeeling", "North Sikkim", "South Sikkim", "East Sikkim", "West Sikkim",
].sort((a, b) => b.length - a.length);

// Returns the first (most specific) known place name found in a message, or
// null if none matched. Case-insensitive substring match — deliberately
// simple and forgiving rather than requiring exact phrasing.
export function detectPlaceInMessage(message: string): string | null {
  const lower = message.toLowerCase();
  for (const place of KNOWN_PLACES) {
    if (lower.includes(place.toLowerCase())) return place;
  }
  return null;
}

export function executeTool(name: string, args: any): any {
  switch (name) {
    case "getCabPrice":
      return getCabPrice(args);
    case "searchHotels":
      return searchHotels(args);
    case "searchPackages":
      return searchPackages(args);
    case "searchFacts":
      return searchFacts(args);
    default:
      return { error: `Unknown tool: ${name}` };
  }
}