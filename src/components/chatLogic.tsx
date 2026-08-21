/// <reference types="vite/client" />
import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import type { Hotel } from "./HotelCards";
import type { Bike } from "./Bikecards";
import type { Package } from "./Packagecards";
import type { Activity } from "./Activitycards";
import type { Cab } from "./CabCards";
import accommodationsData from "../data/hotel";
import bikesData from "../data/bikes";
import packagesData from "../data/package";
import activitiesData from "../data/activity";
import cabsData, { ROUTE_PRICES, getStartingPrice } from "../data/cabs";

// ═══════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════

export interface Message {
  role: "user" | "assistant";
  text: string;
  hotels?: Hotel[];
  bikes?: Bike[];
  packages?: Package[];
  activities?: Activity[];
  cabs?: Cab[];
  cabFrom?: string;
  cabTo?: string;
  routePrices?: Record<string, number>;
  city?: string;
  time?: string;
}

// A parsed "Day N: ..." section out of the AI's freeform itinerary text.
export interface DayBlock {
  header: string;
  lines: string[];
  images: string[];
  mapQuery: string | null;
}

// A display-friendly shape for the Explore panel's rotating cards — built
// from packages/activities/hotels/cabs, which all have different native shapes.
export interface SuggestionSlide {
  kind: "package" | "activity" | "hotel" | "cab";
  image: string;
  title: string;
  subtitle: string;
  badge: string;
  price: string | null;
  promo: string | null;
  gallery: string[] | null;
  url: string;
}

// ═══════════════════════════════════════════════════════════════════════
// CONFIG — external service keys, all read from .env
// ═══════════════════════════════════════════════════════════════════════
// Keys prefixed VITE_ ship in the client bundle since this is a frontend-only
// app — fine for a demo, but for a real production launch these calls should
// go through a backend proxy so keys aren't publicly visible in the Network tab.

// Points at your own serverless function (see /api/chat.ts) instead of
// Lamatic AI. Relative path works automatically once deployed on Vercel,
// since the frontend and the /api function are served from the same domain.
// If you're testing locally with `vercel dev`, this also just works — Vercel's
// local dev server proxies /api/* to your functions on the same port.
export const CHAT_API_URL = "/api/chat";

// Optional — with it present, day blocks use the officially-supported Maps
// Embed API instead of the unofficial no-key map trick.
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

// Points at your own serverless function (see /api/tts.ts) instead of
// calling Fish Audio directly from the browser. Fish Audio doesn't send
// CORS headers, so a direct browser call is blocked — this proxy avoids
// that and keeps the Fish Audio API key server-side only.
export const TTS_API_URL = "/api/tts";

// Not secret — just identifies which voice to use. The actual API key lives
// only in the backend (api/tts.ts), read from FISH_AUDIO_API_KEY there.
// Defaults to the "Dynamic Hindi Presenter" voice chosen and previewed
// directly in the Fish Audio dashboard.
export const FISH_AUDIO_VOICE_ID =
  (import.meta.env.VITE_FISH_AUDIO_VOICE_ID as string | undefined) || "c53b564483f348a4bb45b18e13823067";

export const CONTACT_PHONE = "+917001103688";

// ═══════════════════════════════════════════════════════════════════════
// CONSTANTS — static data lists
// ═══════════════════════════════════════════════════════════════════════

export const SIKKIM_CITIES = ["Gangtok","Pelling","Lachung","Namchi","Ravangla","Yuksom","Singtam","Mangan","Jorethang","Rangpo"];

// NOTE: adjust these `to` paths if your actual routes are named differently.
// `icon` is a Tabler outline class (https://tabler.io/icons) — swap freely.
export const NAV_ITEMS = [
  { label: "Home", to: "/", icon: "ti-home" },
  { label: "Hotels", to: "/hotels", icon: "ti-building" },
  { label: "Bikes", to: "/bikes", icon: "ti-motorbike" },
  { label: "Cabs", to: "/cabs", icon: "ti-car" },
  { label: "Packages", to: "/packages", icon: "ti-briefcase" },
  { label: "Activities", to: "/activities", icon: "ti-mountain" },
];

export const PLANNER_TYPES = ["Family", "Honeymoon", "Luxury", "Budget", "Cultural"];
export const PLANNER_MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
export const PLANNER_NATIONALITIES = ["Indian", "Foreign National"];

// NOTE: pills currently only split between "Tours" (packages) and "Activities" —
// add more kinds here once real data feeds are hooked up for them.
export const SUGGEST_FILTERS: { label: string; value: "all" | "package" | "activity" }[] = [
];

// ─── Known Sikkim place names — used for location-aware package card
// filtering below. Mirrors detectPlaceInMessage/KNOWN_PLACES in aiTools.ts
// (the backend equivalent that keeps the AI's own text response accurate) —
// duplicated here rather than shared, since this is frontend code and
// doesn't share a bundle with the backend tools. Sorted longest-first so
// more specific names (e.g. "Zero Point") are checked before shorter ones.
const KNOWN_PLACE_NAMES = [
  "Gurudongmar Lake", "Gurudongmar", "Lachung", "Lachen", "Yumthang Valley", "Yumthang",
  "Zero Point", "Dzongu", "Mangan", "Phodong", "Thangu", "Chopta Valley",
  "Gangtok", "Tsomgo Lake", "Tsomgo", "Changu Lake", "Changu", "Nathula Pass", "Nathula",
  "Zuluk", "Baba Mandir", "Rongli", "Rhenock", "Rumtek",
  "Pelling", "Yuksom", "Rinchenpong", "Khecheopalri Lake", "Khecheopalri",
  "Rabdentse", "Pemayangtse", "Dzongri", "Singalila", "Gyalshing", "Soreng", "Tashiding",
  "Namchi", "Ravangla", "Temi Tea Garden", "Temi", "Jorethang", "Samdruptse", "Maenam",
  "Darjeeling", "North Sikkim", "South Sikkim", "East Sikkim", "West Sikkim",
].sort((a, b) => b.length - a.length);

// ─── Day-wise photos for freeform AI text replies ────────────────────────
// The AI's raw itinerary text is just prose — it isn't tied to any specific
// package, so there's no photos array to read directly. Instead: detect known
// Sikkim place names mentioned in each "Day N: ..." section and attach real
// photos already used elsewhere in this app. NOTE: keyword match against a
// curated list, not real geocoding — places not listed here won't get a gallery.
export const PLACE_IMAGES: Record<string, string[]> = {
  gangtok: [
    "https://res.cloudinary.com/djsguxriw/image/upload/v1776186455/652491543_18060569984416803_2282662252883816845_n_pa876b.jpg",
    "https://res.cloudinary.com/djsguxriw/image/upload/v1776186452/588550355_18090614675297675_7412424156012602620_n_tjbyfc.jpg",
  ],
  "mg marg": [
    "https://res.cloudinary.com/djsguxriw/image/upload/v1776186455/652491543_18060569984416803_2282662252883816845_n_pa876b.jpg",
  ],
  "tashi view": [
    "https://res.cloudinary.com/djsguxriw/image/upload/v1776186517/tiachen-aier-Yf9WoHnuqqs-unsplash_g5dqjm.jpg",
  ],
  lachen: [
    "https://res.cloudinary.com/djsguxriw/image/upload/c_fit,w_1200/v1783018137/WhatsApp_Image_2026-07-03_at_00.04.09_aziljv.jpg",
    "https://res.cloudinary.com/djsguxriw/image/upload/v1783018741/m_Lachen_3_l_633_1000_umplfy.avif",
  ],
  lachung: [
    "https://res.cloudinary.com/djsguxriw/image/upload/v1783019324/WhatsApp_Image_2026-07-03_at_00.22.08_xfjfzt.jpg",
    "https://res.cloudinary.com/djsguxriw/image/upload/v1776187050/539316907_24204919412510340_6747624356021774511_n_givtk4.jpg",
  ],
  yumthang: [
    "https://res.cloudinary.com/djsguxriw/image/upload/v1776187176/bhaskar-agarwal-2LxJQfP40-o-unsplash_wyvp9u.jpg",
    "https://res.cloudinary.com/djsguxriw/image/upload/v1776187074/645249339_26311019021865526_3002698391402773651_n_gmxsaw.jpg",
  ],
  gurudongmar: [
    "https://res.cloudinary.com/djsguxriw/image/upload/v1776186638/huzaifa-ginwala-rDUV-NZWDKw-unsplash_xhl5ri.jpg",
    "https://res.cloudinary.com/djsguxriw/image/upload/v1776186617/Gurudongmar-Lake-Sikkim-photo-2_wxbuqm.avif",
  ],
  tsomgo: [
    "https://res.cloudinary.com/djsguxriw/image/upload/v1776186517/tiachen-aier-Yf9WoHnuqqs-unsplash_g5dqjm.jpg",
    "https://res.cloudinary.com/djsguxriw/image/upload/v1776184324/651258223_17985500441960466_939933064043572943_n_uhtp6g.jpg",
  ],
  changu: [
    "https://res.cloudinary.com/djsguxriw/image/upload/v1776186517/tiachen-aier-Yf9WoHnuqqs-unsplash_g5dqjm.jpg",
  ],
  nathula: [
    "https://res.cloudinary.com/djsguxriw/image/upload/v1776184327/652552505_3882241121912256_2051934602556132284_n_xmyyur.jpg",
  ],
  namchi: [
    "https://res.cloudinary.com/djsguxriw/image/upload/v1776186796/473188417_1167822451591943_5773727650260042798_n_wmcfpr.jpg",
    "https://res.cloudinary.com/djsguxriw/image/upload/v1776186857/IMG_3862_1_k63gt7.jpg",
  ],
  pelling: [
    "https://res.cloudinary.com/djsguxriw/image/upload/v1776186915/neeraj-pramanik-I0wN-oUkHcc-unsplash_hw2ehz.jpg",
    "https://res.cloudinary.com/djsguxriw/image/upload/v1776187001/sagar-dwivedi-qhQg07YHjvU-unsplash_btdkcj.jpg",
  ],
  darjeeling: [
    "https://res.cloudinary.com/djsguxriw/image/upload/v1776522125/photo-1671711847762-b8308b444a42_vaj7l8.jpg",
    "https://res.cloudinary.com/djsguxriw/image/upload/v1776965964/photo-1768922078544-516fc51c7812_mevlrm.jpg",
  ],
};

// ═══════════════════════════════════════════════════════════════════════
// TEXT UTILITIES — query classifiers, cleaning, day-block parsing
// ═══════════════════════════════════════════════════════════════════════

export function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function extractCity(text: string): string {
  for (const city of SIKKIM_CITIES) {
    if (new RegExp(`\\b${city}\\b`, "i").test(text)) return city;
  }
  return "Gangtok";
}

export function extractRoute(text: string): { from: string; to: string } {
  const cabCities = ["Gangtok","Siliguri","Namchi","Ravangla","Jorethang","Singtam","Rangpo","Mangan"];
  const found = cabCities.filter(c => new RegExp(`\\b${c}\\b`, "i").test(text));
  return { from: found[0] ?? "Gangtok", to: found[1] ?? "" };
}

// Pulls "N day(s)" out of a message like "Customize a package for Sikkim: 2 days, ...".
export function extractRequestedDays(text: string): number | null {
  const m = text.match(/(\d+)\s*-?\s*days?\b/i);
  return m ? parseInt(m[1], 10) : null;
}

// Detects a known Sikkim place name mentioned in the message — used to
// filter package cards down to only ones that actually cover that place,
// instead of always showing the same top-6-in-array-order regardless of
// what was asked. Returns the most specific match (longest name that
// appears), or null if no known place is mentioned.
export function extractPackageLocation(text: string): string | null {
  const lower = text.toLowerCase();
  for (const place of KNOWN_PLACE_NAMES) {
    if (lower.includes(place.toLowerCase())) return place;
  }
  return null;
}

// Checks whether a package's real `locations` field covers a given place
// name. Handles both shapes seen in this codebase: an array of
// { name, altitude } objects (src/data/package.ts's real shape) or a plain
// array of strings, just in case.
function packageCoversLocation(pkg: any, place: string): boolean {
  const placeLower = place.toLowerCase();
  const locs: any[] = pkg.locations ?? pkg.locationsCovered ?? [];
  return locs.some((l: any) => {
    const name = typeof l === "string" ? l : (l?.name ?? "");
    const nameLower = name.toLowerCase();
    return nameLower.includes(placeLower) || placeLower.includes(nameLower);
  });
}

// Package duration strings look like "3 Days / 2 Nights" — pull the leading number.
export function getPackageDuration(pkg: any): number {
  const m = String(pkg.duration ?? "").match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

export function getPackageStartingPrice(pkg: any): number | null {
  const prices = Object.values(pkg.pricingByPeople ?? {}).filter((p): p is number => typeof p === "number" && p > 0);
  return prices.length ? Math.min(...prices) : null;
}

export function isShortReply(text: string): boolean {
  const short = /^(yes|no|ok|okay|sure|tell me more|more|please|go on|continue|thanks|thank you|great|cool|nice|awesome|sounds good|i see|got it|hmm|hm|what else|anything else|more details|yep|nope|yup|show me|go ahead|and\??|then\??)[\s!?.]*$/i;
  return short.test(text.trim()) || text.trim().split(/\s+/).length <= 2;
}

// Matches the exact message shape built by ChatWidget's handleGenerateItinerary
// (the "Customize My Package" sidebar/mobile-sheet form) — e.g. "Customize a
// package for Sikkim: 5 days, traveling in March, family style. ...". This is
// checked BEFORE isPackageQuery so a form submission always gets the AI's full
// generated itinerary rendered as day-blocks, instead of being (mis)routed into
// the generic package-card carousel just because the word "package" appears in
// the message (which it always does, twice, given how the form builds its text).
export function isCustomizeFormRequest(text: string): boolean {
  return /^customize a package for sikkim\s*:/i.test(text.trim());
}

// Detects a naturally-typed message that ALREADY specifies enough details to
// generate a full itinerary directly — e.g. "I want a 3 day adventure package
// for 2 people" — even though it doesn't match the form's exact wording. This
// covers the same underlying case as isCustomizeFormRequest (skip the card
// carousel, go straight to a full AI-generated itinerary) but for people
// typing a detailed request directly into chat instead of using the sidebar
// form. Requires ALL THREE of: a day count, a recognizable trip type word,
// and a traveler count — a message with only 1-2 of these should fall through
// to the normal package-browsing path instead (too ambiguous to skip straight
// to generation).
const TRIP_TYPE_WORDS = ["adventure", "nature", "religious", "honeymoon", "family", "mixed", "luxury", "budget", "cultural"];

export function isDetailedPackageRequest(text: string): boolean {
  const hasDays = /\b\d+\s*-?\s*days?\b/i.test(text);
  const hasType = TRIP_TYPE_WORDS.some(t => new RegExp(`\\b${t}\\b`, "i").test(text));
  const hasPeople = /\b(?:for\s+)?\d+\s*(?:people|persons?|travell?ers?|pax|adults?)\b/i.test(text);
  return hasDays && hasType && hasPeople;
}

export function isHotelQuery(text: string): boolean {
  if (isShortReply(text)) return false;
  return /\b(hotels?|accommodation|stay|lodge|resort|hostel|where to stay|place to stay|rooms? in|guesthouses?)\b/i.test(text);
}

export function isBikeQuery(text: string): boolean {
  if (isShortReply(text)) return false;
  return /\b(bikes?|motorcycle|rent.*bikes?|bikes?.*rent|two.?wheel|scooter|royal enfield|RE himalayan|bike rental)\b/i.test(text);
}

export function isActivityQuery(text: string): boolean {
  if (isShortReply(text)) return false;
  return /\b(activit|trekkings?|trekings?|trek|hiking|hike|adventure|rafting|paragliding|camping|things to do|what to do|sightseeing|opt for|outdoor|events?|festivals?|concerts?|happening|whats on|going on)\b/i.test(text);
}

export function isEventQuery(text: string): boolean {
  return /\b(events?|festivals?|concerts?|happening|whats on)\b/i.test(text);
}

export function isPackageQuery(text: string): boolean {
  if (isShortReply(text)) return false;
  return /\b(packages?|tour packages?|travel packages?|holiday packages?|sikkim packages?|show.*packages?|want.*packages?|itinerary|trip plan)\b/i.test(text);
}

export function isCabQuery(text: string): boolean {
  if (isShortReply(text)) return false;
  return /\b(cabs?|taxi|car hire|book.*cabs?|transport|from\s+\w+\s+to\s+\w+|cab booking)\b/i.test(text);
}

export function cleanText(text: string): string {
  return text
    .replace(/###\s*(?:\d+\.)?\s*/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^[-•]\s+/gm, "• ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F1FF}\u{1F200}-\u{1F2FF}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{3030}\u{2B50}\u{2B55}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{3297}\u{3299}\u{303D}\u{00A9}\u{00AE}\u{2122}\u{23F3}\u{24C2}\u{23E9}-\u{23F3}\u{25AA}-\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{00A9}\u{00AE}]/gu, "")
    .trim();
}

export function extractIntro(raw: string): string {
  const introEnd = raw.search(/\n(?:###\s*)?(?:\d+\.|\•)\s+[A-Z]/);
  const intro = introEnd > 0 ? raw.substring(0, introEnd).trim() : raw.trim();
  return cleanText(intro);
}

export function findPlaceMatches(text: string): string[] {
  const lower = text.toLowerCase();
  return Object.keys(PLACE_IMAGES).filter(key => lower.includes(key));
}

// Splits raw AI text into { intro, days } by finding lines that start with
// "Day N" / "Day N:". Returns null if the text doesn't look day-structured at
// all, so callers can fall back to plain line rendering.
export function splitIntoDayBlocks(text: string): { intro: string[]; days: DayBlock[] } | null {
  const lines = text.split("\n");
  const dayLineIdx: number[] = [];
  lines.forEach((l, i) => {
    if (/^\s*day\s*\d+\s*[:\-]/i.test(l.trim())) dayLineIdx.push(i);
  });
  if (dayLineIdx.length === 0) return null;

  const intro = lines.slice(0, dayLineIdx[0]).filter(l => l.trim() !== "");

  const days: DayBlock[] = dayLineIdx.map((startIdx, k) => {
    const endIdx = k + 1 < dayLineIdx.length ? dayLineIdx[k + 1] : lines.length;
    const header = lines[startIdx].trim();
    const bodyLines = lines.slice(startIdx + 1, endIdx).filter(l => l.trim() !== "");
    const matches = findPlaceMatches(`${header} ${bodyLines.join(" ")}`);
    const images = Array.from(new Set(matches.slice(0, 2).flatMap(m => PLACE_IMAGES[m]))).slice(0, 4);
    const headerTitle = header.replace(/^day\s*\d+\s*[:\-]\s*/i, "").trim();
    const mapQuery = headerTitle ? `${headerTitle}, Sikkim` : (matches[0] ? `${matches[0]}, Sikkim` : null);
    return { header, lines: bodyLines, images, mapQuery };
  });

  return { intro, days };
}

// ─── PDF export — lets a customer download a generated itinerary ─────────
// Client-side only (no backend involved) via jsPDF. Reuses splitIntoDayBlocks
// so the PDF's structure matches exactly what's rendered on screen. Falls
// back to dumping the cleaned raw text if the message isn't day-structured
// (e.g. a plain-text answer someone tries to export anyway).
export function downloadItineraryPDF(msg: Message): void {
  const dayParsed = splitIntoDayBlocks(msg.text);
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const maxWidth = pageWidth - margin * 2;
  let y = 50;

  const ensureSpace = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = 50;
    }
  };

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(109, 40, 217); // matches the app's purple brand color
  doc.text("GoVisit Sikkim — Your Custom Itinerary", margin, y);
  y += 28;
  doc.setDrawColor(196, 181, 253);
  doc.line(margin, y, pageWidth - margin, y);
  y += 24;

  if (dayParsed) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    for (const line of dayParsed.intro) {
      const wrapped = doc.splitTextToSize(line, maxWidth);
      ensureSpace(wrapped.length * 14 + 6);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 14 + 6;
    }

    for (const day of dayParsed.days) {
      ensureSpace(30);
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(109, 40, 217);
      const headerWrapped = doc.splitTextToSize(day.header, maxWidth);
      ensureSpace(headerWrapped.length * 16);
      doc.text(headerWrapped, margin, y);
      y += headerWrapped.length * 16 + 4;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(30, 30, 30);
      for (const line of day.lines) {
        const cleaned = line.replace(/^[-•]\s*/, "");
        const wrapped = doc.splitTextToSize(`•  ${cleaned}`, maxWidth - 10);
        ensureSpace(wrapped.length * 14 + 4);
        doc.text(wrapped, margin + 10, y);
        y += wrapped.length * 14 + 4;
      }
    }
  } else {
    // Not a day-structured itinerary — export the cleaned raw text instead.
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    const lines = cleanText(msg.text).split("\n");
    for (const line of lines) {
      const wrapped = doc.splitTextToSize(line, maxWidth);
      ensureSpace(wrapped.length * 14 + 4);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 14 + 4;
    }
  }

  // Footer
  ensureSpace(50);
  y += 16;
  doc.setDrawColor(196, 181, 253);
  doc.line(margin, y, pageWidth - margin, y);
  y += 18;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text("Generated by Guide AI \u2014 govisitsikkim.com \u2014 Contact: 7001103688 \u2014 gmail: admingovisitsikkim@gmail.com  ", margin, y);

  const dateStamp = new Date().toISOString().slice(0, 10);
  doc.save(`Sikkim-Itinerary-${dateStamp}.pdf`);
}

// ═══════════════════════════════════════════════════════════════════════
// DATA UTILITIES — shaping raw data-file records for display
// ═══════════════════════════════════════════════════════════════════════

export function getHotelsForCity(city: string): any[] {
  const key = city.toLowerCase();
  const filtered = (accommodationsData as any[]).filter(h => h.location.toLowerCase().includes(key));
  return filtered.length > 0 ? filtered : (accommodationsData as any[]).slice(0, 6);
}

export function getBikesForCity(city: string): Bike[] {
  const key = city.toLowerCase();
  const filtered = (bikesData as any[]).filter(b =>
    Array.isArray(b.city)
      ? b.city.some((c: string) => c.toLowerCase().includes(key))
      : typeof b.city === "string" && b.city.toLowerCase().includes(key)
  );
  const normalize = (b: any): Bike => ({
    ...b,
    city: Array.isArray(b.city) ? b.city[0] : b.city,
  });
  return (filtered.length > 0 ? filtered : (bikesData as any[])).map(normalize);
}

// Returns Hotel & an optional `promo` field. The extra field is intersected in
// here rather than added to the Hotel type directly, since Hotel is defined
// in HotelCards.tsx. To actually display it there, add `promo?: string` to
// the Hotel interface and render it in the card JSX.
export function mapHotel(h: any): Hotel & { promo?: string } {
  return {
    id: h.id,
    name: h.name,
    location: `${h.location}, Sikkim`,
    rating: h.rating,
    reviews: 0,
    price: h.pricePerNight > 0 ? `₹${h.pricePerNight.toLocaleString()}` : "Price on request",
    amenities: h.amenities.slice(0, 4),
    nearby: h.nearbyAttractions?.[0] ?? "",
    url: `/accommodations/${h.id}`,
    image: h.image,
    promo: typeof h.promo === "string" && h.promo ? h.promo : undefined,
  };
}

// Pulls a display-friendly shape out of package/activity items regardless of
// exact field names — used by the Explore panel's rotating cards.
export function toSuggestion(item: any, kind: "package" | "activity"): SuggestionSlide {
  const price = item.price ?? item.startingPrice ?? item.pricePerPerson ?? item.cost ?? null;
  return {
    kind,
    image: item.image ?? item.img ?? item.thumbnail ?? item.photo ?? "",
    title: item.title ?? item.name ?? item.bike_name ?? "Sikkim Experience",
    subtitle: item.duration ?? item.durationLabel ?? item.category ?? item.tourType ?? (kind === "package" ? "Tour Package" : "Activity"),
    badge: kind === "package" ? "Featured Tour" : "Featured Activity",
    price: typeof price === "number" ? `From ₹${price.toLocaleString()}` : (typeof price === "string" && price ? price : null),
    // Optional circular promo callout — add a `promo` string field to a
    // package/activity entry in your data files to show it.
    promo: typeof item.promo === "string" && item.promo ? item.promo : null,
    // Rotating gallery — reuses the existing `images` array already on each
    // package. Deduped since source data often repeats the same photo many
    // times; null if there's only one unique image or none at all.
    gallery: (() => {
      const unique = Array.isArray(item.images) ? Array.from(new Set(item.images as string[])) : [];
      return unique.length > 1 ? unique.slice(0, 8) : null;
    })(),
    // NOTE: guessed route pattern, matching the /accommodations/:id convention
    // used for hotels. Change this if your real detail routes look different.
    url: kind === "package" ? `/packages/${item.id}` : `/activities/${item.id}`,
  };
}

// Builds the two independent 3-slide rotations for the Explore panel: Package
// → River Rafting → Cab Booking (top), and Hotel → Trekking → Upcoming Event
// (bottom). Called once from ChatWidget via useMemo.
export function buildExploreSlides(): { top: SuggestionSlide[]; bottom: SuggestionSlide[] } {
  const featuredPackage = toSuggestion((packagesData as any[])[0], "package");
  const raftingItem = (activitiesData as any[]).find(a => a.category === "River Rafting") ?? (activitiesData as any[])[3];
  const featuredRafting = toSuggestion(raftingItem, "activity");

  // Cab slide is built manually — cabs don't have a title/price shape like
  // packages/activities do. Swap `featuredCab` below to feature a different vehicle.
  const featuredCab = (cabsData as any[]).find(c => c.id === "4") ?? (cabsData as any[])[0]; // Toyota Innova, 7-seater
  const cabStartingPrice = getStartingPrice(featuredCab, "Gangtok");
  const cabSlide: SuggestionSlide = {
    kind: "cab",
    image: featuredCab.image,
    title: `Book a ${featuredCab.cab_name}`,
    subtitle: `${featuredCab.capacity}-seater · ${featuredCab.category}`,
    badge: "Cab Booking",
    price: cabStartingPrice > 0 ? `From ₹${cabStartingPrice.toLocaleString()} (Gangtok)` : null,
    promo: null,
    gallery: null,
    url: "/cabs", // cabs aren't a single detail page like packages
  };

  // Hotel slide built manually — hotel data has its own shape (pricePerNight,
  // type, location) rather than the package/activity one. Swap `featuredHotel`
  // below to feature a different property.
  const featuredHotel = (accommodationsData as any[])[0]; // Royal Gangtok
  const hotelSlide: SuggestionSlide = {
    kind: "hotel",
    image: featuredHotel.image,
    title: featuredHotel.name,
    subtitle: `${featuredHotel.type} · ${featuredHotel.location}`,
    badge: "Featured Stay",
    price: featuredHotel.pricePerNight > 0 ? `From ₹${featuredHotel.pricePerNight.toLocaleString()}/night` : null,
    promo: typeof featuredHotel.promo === "string" && featuredHotel.promo ? featuredHotel.promo : null,
    gallery: null,
    url: `/accommodations/${featuredHotel.id}`,
  };

  const trekItem = (activitiesData as any[]).find(a => a.category === "Trekking") ?? (activitiesData as any[])[0];
  const featuredTrek = { ...toSuggestion(trekItem, "activity"), badge: "Trekking" };

  const eventItem = (activitiesData as any[]).find(a => a.category === "Upcoming Events") ?? (activitiesData as any[])[7];
  const featuredEvent = { ...toSuggestion(eventItem, "activity"), badge: "Upcoming Event" };

  return {
    top: [featuredPackage, featuredRafting, cabSlide],
    bottom: [hotelSlide, featuredTrek, featuredEvent],
  };
}

// ═══════════════════════════════════════════════════════════════════════
// API / MESSAGE ROUTING — the "brain" that decides what a message needs
// ═══════════════════════════════════════════════════════════════════════

// Sends the current message to the AI, along with recent conversation history
// so it can actually maintain context across turns (e.g. "what about for 6
// people instead?" needs to know what itinerary was just discussed). Capped
// to the last MAX_HISTORY_MESSAGES to keep token usage/cost reasonable —
// full history isn't needed for the AI to stay coherent, just recent context.
const MAX_HISTORY_MESSAGES = 12;

async function callAPI(message: string, history: Message[] = []): Promise<string> {
  const recentHistory = history
    .slice(-MAX_HISTORY_MESSAGES)
    .map(m => ({ role: m.role, content: m.text }));

  const res = await fetch(CHAT_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history: recentHistory }),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  return data?.reply ?? "";
}

// ═══════════════════════════════════════════════════════════════════════
// LOCAL FACTS — hand-written, guaranteed-accurate answers
// ═══════════════════════════════════════════════════════════════════════
// Checked BEFORE the AI is ever called for general questions. If a fact here
// matches, that exact text is returned — no AI involved, no risk of the
// answer being paraphrased/altered. Use this for anything where accuracy
// genuinely matters and you've written the correct answer yourself: permit
// rules, specific policies, exact figures you don't trust the AI to recite
// perfectly. Doesn't cover hotel/package/cab/bike/activity questions — those
// already have their own exact, non-AI card-based path further down.
//
// NOTE: this is intentionally simple keyword matching, not real search — fine
// for tens/low-hundreds of facts. If this list grows into the hundreds and
// matching starts feeling unreliable, that's the point to move to the real
// database + retrieval approach discussed separately.
interface LocalFact {
  keywords: string[]; // ALL must appear in the question (case-insensitive) for this to match
  answer: string;
}

const LOCAL_FACTS: LocalFact[] = [
  // Example — replace with your real hand-written facts. Keep `keywords`
  // specific enough to avoid false-matching unrelated questions.
  // {
  //   keywords: ["inner", "line", "permit"],
  //   answer: "Indian nationals need an Inner Line Permit (ILP) to visit North Sikkim, Nathula, and other restricted areas. It's free and can be arranged through a registered travel agent or at the Tourism office in Gangtok — you'll need a passport-size photo and ID proof.",
  // },
];

// Returns the best-matching fact's answer, or null if nothing matches well
// enough. "Best" = the fact with the most keyword hits, requiring ALL of that
// fact's keywords to be present (so a 2-keyword fact needs both, not just one).
function findLocalAnswer(userMessage: string): string | null {
  const lower = userMessage.toLowerCase();
  let best: LocalFact | null = null;
  let bestScore = 0;

  for (const fact of LOCAL_FACTS) {
    const allKeywordsPresent = fact.keywords.every(k => lower.includes(k.toLowerCase()));
    if (allKeywordsPresent && fact.keywords.length > bestScore) {
      best = fact;
      bestScore = fact.keywords.length; // prefer the more specific (more-keyword) match if several qualify
    }
  }

  return best?.answer ?? null;
}

export async function handleMessage(userMessage: string, history: Message[]): Promise<Omit<Message, "role">> {
  if (isShortReply(userMessage)) {
    const raw = await callAPI(userMessage, history);
    return { text: cleanText(raw) || "Could you tell me more?", time: getTime() };
  }

  // Checked BEFORE isPackageQuery: either a "Customize My Package" form
  // submission OR a naturally-typed message that already specifies days +
  // trip type + traveler count (e.g. "I want a 3 day adventure package for 2
  // people") should get the AI's full generated itinerary rendered as
  // day-blocks, NOT get a generic package-card carousel bolted underneath it.
  // Without this check, isPackageQuery below would match on the word
  // "package" and attach unrelated cards from packagesData regardless of
  // what the AI actually generated.
  if (isCustomizeFormRequest(userMessage) || isDetailedPackageRequest(userMessage)) {
    const raw = await callAPI(userMessage, history);
    const text = cleanText(raw) || "Here's your customized itinerary! If anything looks off, let me know and I can adjust it.";
    return { text, time: getTime() };
  }

  // Checked first: a message that explicitly mentions "package" should win even
  // if it also mentions "hotel" or "transport" as inclusions (e.g. "customize a
  // package... include hotel, transport and day-wise plan") — otherwise the
  // hotel/bike/activity checks below would grab it on the incidental keyword.
  if (isPackageQuery(userMessage)) {
    let text = "Here are some amazing tour packages for Sikkim!";
    try {
      const raw = await callAPI(userMessage, history);
      const intro = extractIntro(raw);
      if (intro && intro.length > 10) text = intro;
    } catch { /* use default */ }

    // Rank by how well each package matches what was actually asked for.
    // NOTE: packagesData only has a `type` field ("Private Tour" / "Shared
    // Tour"), not style tags like "family"/"adventure" — so those specific
    // styles from the planner form can't be matched yet. Budget/luxury
    // (price-based) and day count both can be, and are handled below.
    const requestedDays = extractRequestedDays(userMessage);
    const wantsBudget = /\bbudget\b/i.test(userMessage);
    const wantsLuxury = /\bluxury\b/i.test(userMessage);

    // Location filtering — the fix. Previously this branch ALWAYS showed the
    // same top-6 packages in array order (unless a day count happened to
    // reorder them), completely ignoring any place name the user asked
    // about — e.g. "packages for Gurudongmar" would show the same generic 6
    // cards every time, none of them necessarily related to Gurudongmar at
    // all. Now: detect a known place name in the message, and if any real
    // package actually covers it, narrow the candidate list to ONLY those
    // before day/budget sorting. If nothing matches that place, fall back to
    // the full list rather than showing an empty result (a card carousel has
    // no room to explain "nothing found" the way the AI's text response can).
    const requestedLocation = extractPackageLocation(userMessage);
    let candidates = [...(packagesData as any[])];
    if (requestedLocation) {
      const locationMatches = candidates.filter(p => packageCoversLocation(p, requestedLocation));
      if (locationMatches.length > 0) candidates = locationMatches;
    }

    const ranked = candidates.sort((a, b) => {
      if (requestedDays != null) {
        const da = Math.abs(getPackageDuration(a) - requestedDays);
        const db = Math.abs(getPackageDuration(b) - requestedDays);
        if (da !== db) return da - db;
      }
      if (wantsBudget || wantsLuxury) {
        const pa = getPackageStartingPrice(a) ?? Infinity;
        const pb = getPackageStartingPrice(b) ?? Infinity;
        return wantsBudget ? pa - pb : pb - pa;
      }
      return 0;
    });

    return { text, packages: ranked.slice(0, 6) as Package[], time: getTime() };
  }

  if (isHotelQuery(userMessage) && !isBikeQuery(userMessage)) {
    const city = extractCity(userMessage);
    const hotels = getHotelsForCity(city).map(mapHotel);
    let text = `Here are some great hotels in ${city}! Click any card to view details.`;
    try {
      const raw = await callAPI(userMessage, history);
      const intro = extractIntro(raw);
      if (intro && intro.length > 10) text = intro;
    } catch { /* use default */ }
    return { text, hotels, city, time: getTime() };
  }

  if (isBikeQuery(userMessage)) {
    const city = extractCity(userMessage);
    const bikes = getBikesForCity(city);
    let text = `Here are bikes available in ${city}! Click to book.`;
    try {
      const raw = await callAPI(userMessage, history);
      const intro = extractIntro(raw);
      if (intro && intro.length > 10) text = intro;
    } catch { /* use default */ }
    return { text, bikes, city, time: getTime() };
  }

  if (isActivityQuery(userMessage)) {
    // For "what events are happening" style queries, narrow down to the
    // event-shaped categories instead of showing generic treks/rafting/etc.
    const EVENT_CATEGORIES = ["Upcoming Events", "Sports Events", "Festivals"];
    const eventMatches = (activitiesData as any[]).filter(a => EVENT_CATEGORIES.includes(a.category));
    const isEvent = isEventQuery(userMessage);
    const activities = isEvent && eventMatches.length > 0
      ? eventMatches.slice(0, 6)
      : (activitiesData as any[]).slice(0, 6);

    let text = isEvent
      ? "Here are the upcoming events, festivals and sports events in Sikkim!"
      : "Here are some exciting activities in Sikkim!";
    try {
      const raw = await callAPI(userMessage, history);
      const intro = extractIntro(raw);
      if (intro && intro.length > 10) text = intro;
    } catch { /* use default */ }

    return { text, activities: activities as Activity[], time: getTime() };
  }

  if (isCabQuery(userMessage)) {
    const { from, to } = extractRoute(userMessage);
    const routePrices = ROUTE_PRICES[from] ?? {};
    let text = to ? `Here are cabs from ${from} to ${to}!` : `Here are cabs from ${from}!`;
    try {
      const raw = await callAPI(userMessage, history);
      const intro = extractIntro(raw);
      if (intro && intro.length > 10) text = intro;
    } catch { /* use default */ }
    return { text, cabs: cabsData as Cab[], cabFrom: from, cabTo: to, routePrices, time: getTime() };
  }

  // Checked before the AI: if you've hand-written an exact answer for this,
  // use it directly — no AI involved, so no risk of it paraphrasing a
  // permit rule or figure incorrectly.
  const localAnswer = findLocalAnswer(userMessage);
  if (localAnswer) {
    return { text: localAnswer, time: getTime() };
  }

  const raw = await callAPI(userMessage, history);
  return { text: cleanText(raw) || "I'm here to help! Ask me about hotels, activities, packages, bikes or cabs in Sikkim.", time: getTime() };
}

// ═══════════════════════════════════════════════════════════════════════
// VOICE — mic input (Web Speech API) + spoken replies (browser voice or
// ElevenLabs). All voice state/logic lives in this one hook so ChatWidget
// doesn't have to manage it directly.
// ═══════════════════════════════════════════════════════════════════════
// Converts currency/number formatting that reads badly aloud ("₹1,500",
// "20%", "1500-2000") into natural speakable words before it reaches TTS.
// Order matters: currency must be converted before the leftover dash-range
// replacement, otherwise "₹1,500-₹2,500" would double-process badly.
function normalizeForSpeech(text: string): string {
  return text
    // ₹1,500 or ₹1500.50 -> "1500 rupees" (strip thousands separators first)
    .replace(/₹\s?([\d,]+(?:\.\d+)?)/g, (_m, num) => `${num.replace(/,/g, "")} rupees`)
    // "Rs. 1,500" / "Rs 1500" -> "1500 rupees"
    .replace(/\bRs\.?\s?([\d,]+(?:\.\d+)?)/gi, (_m, num) => `${num.replace(/,/g, "")} rupees`)
    // Any remaining thousands separators in plain numbers, e.g. "3,000 meters"
    .replace(/(\d),(\d{3})/g, "$1$2")
    // "20%" -> "20 percent"
    .replace(/(\d+)\s?%/g, "$1 percent")
    // "1500-2000" / "1500 - 2000" -> "1500 to 2000" (ranges, after currency
    // conversion above already turned currency ranges into "X rupees-Y rupees")
    .replace(/(\d)\s*-\s*(\d)/g, "$1 to $2")
    .replace(/rupees-(\d)/g, "rupees to $1");
}

export function useVoice() {
   const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  // Separate from isSpeaking — true only while waiting on the TTS network
  // request/audio decode, before actual playback starts. Without this,
  // isSpeaking (and the "Speaking..." label) fired the instant the request
  // was sent, so the UI claimed to be speaking for 4-5s of silence while the
  // TTS API call was still in flight.
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>("");
  // Live "what I'm hearing" text — used by Voice Mode's captions while listening.
  const [interimTranscript, setInterimTranscript] = useState("");

  const recognitionRef = useRef<any>(null);
  const suppressVoiceSendRef = useRef(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  // Synchronous lock against double-starts — `isListening` is React state and
  // updates asynchronously, so two near-simultaneous callers (e.g. the
  // auto-restart effect + a manual mic tap right as Voice Mode opens) can both
  // read isListening as false and both start a recognition session, causing
  // the browser to abort one mid-speech. A ref updates instantly, so it closes
  // that race window completely.
  const isStartingRef = useRef(false);

  const recognitionSupported = typeof window !== "undefined" &&
    !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  // Voice list loads asynchronously — often empty until "voiceschanged" fires.
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return;
      setAvailableVoices(voices);
      setSelectedVoiceURI(prev => {
        if (prev) return prev;
        const preferred =
          voices.find(v => v.lang === "en-IN") ??
          voices.find(v => v.default) ??
          voices[0];
        return preferred?.voiceURI ?? "";
      });
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

    const stopSpeaking = () => {
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    setIsSpeaking(false);
    setIsSynthesizing(false);
  };

  const speakWithBrowserVoice = (spoken: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(spoken);
    const chosenVoice = availableVoices.find(v => v.voiceURI === selectedVoiceURI);
    if (chosenVoice) utterance.voice = chosenVoice;
    utterance.rate = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const speakText = async (text: string) => {
    // Speech synthesis reads punctuation literally ("bullet point") and
    // chokes on very long text — strip markdown leftovers and cap length.
        // No hard length cap — long replies (packages, itineraries) were getting
    // cut off mid-sentence at 600 chars. Fish Audio handles long text fine;
    // if you hit an actual API length limit later, chunk-and-concatenate
    // rather than truncate.
        const spoken = normalizeForSpeech(text).replace(/[•#*_]/g, "").replace(/\s+/g, " ").trim();
    if (!spoken) return;
    stopSpeaking();

    setIsSynthesizing(true); // "generating the reply audio" — NOT speaking yet
    try {
      const res = await fetch(TTS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: spoken,
          reference_id: FISH_AUDIO_VOICE_ID,
        }),
      });
      if (!res.ok) throw new Error(`TTS API error ${res.status}`);

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      currentAudioRef.current = audio;
      // Only flip to "Speaking" once playback truly begins.
      audio.onplay = () => { setIsSynthesizing(false); setIsSpeaking(true); };
      audio.onended = () => { setIsSpeaking(false); URL.revokeObjectURL(url); };
      audio.onerror = () => { setIsSynthesizing(false); setIsSpeaking(false); URL.revokeObjectURL(url); };
      await audio.play();
    } catch (err) {
      console.error("TTS request failed, falling back to browser voice:", err);
      setIsSynthesizing(false);
      speakWithBrowserVoice(spoken);
    }
  };
  const startListening = (onTranscript: (text: string) => void) => {
    if (isListening || isStartingRef.current) return;
    isStartingRef.current = true;
    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) { isStartingRef.current = false; return; }

      stopSpeaking();
    // Kill any lingering previous session before starting a new one —
    // starting a new recognition while an old one hasn't fully torn down
    // is the #1 cause of start() throwing on the next auto-restart.
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { /* already stopped */ }
      recognitionRef.current = null;
    }
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-IN"; // best available match for Hindi-English code-switched speech
    // `continuous = true` + our own silence timer, instead of the browser's
    // default cutoff, which fires way too early (sometimes under a second).
    recognition.continuous = true;
    recognition.interimResults = true;

    let finalTranscript = "";
    let silenceTimer: ReturnType<typeof setTimeout> | null = null;
      const INITIAL_GRACE_MS = 6000; // covers mic warm-up + network round-trip before any speech is heard
    const SILENCE_MS = 3800; // pause length that counts as "done talking" once speech has started — long enough to survive normal mid-sentence pauses/breaths

    const setTimer = (ms: number) => {
      if (silenceTimer) clearTimeout(silenceTimer);
      silenceTimer = setTimeout(() => recognition.stop(), ms);
    };
    recognition.onstart = () => { isStartingRef.current = false; setVoiceError(null); setInterimTranscript(""); setTimer(INITIAL_GRACE_MS); };
    recognition.onspeechstart = () => setTimer(SILENCE_MS);
    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript + " ";
        else interim += event.results[i][0].transcript;
      }
      setInterimTranscript(interim);
      setTimer(SILENCE_MS);
    };
       recognition.onerror = (event: any) => {
      isStartingRef.current = false;
      setIsListening(false);
      setInterimTranscript("");
      if (silenceTimer) clearTimeout(silenceTimer);
      const code = event?.error;
      console.error("Speech recognition error:", code);
      const FRIENDLY: Record<string, string> = {
        "not-allowed": "Microphone permission was denied — check your browser's site settings and allow the mic.",
        "permission-denied": "Microphone permission was denied — check your browser's site settings and allow the mic.",
        "no-speech": "No speech was detected — try speaking as soon as you tap the mic.",
        "audio-capture": "No microphone was found on this device.",
        "network": "(Don't  use in brave) Network error reaching the speech recognition service — check your internet connection.",
        "aborted": "Recording was interrupted.",
        "service-not-allowed": "The browser blocked access to the speech recognition service.",
      };
      setVoiceError(FRIENDLY[code] ?? `Voice error: ${code ?? "unknown"}`);
    };
    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript("");
      if (silenceTimer) clearTimeout(silenceTimer);
      const transcript = finalTranscript.trim();
      if (transcript && !suppressVoiceSendRef.current) onTranscript(transcript);
      suppressVoiceSendRef.current = false;
    };

     recognitionRef.current = recognition;
    setIsListening(true);
    try {
      recognition.start();
      } catch (err) {
      // start() can throw synchronously (stale session, no fresh user
      // gesture, etc). Without this catch, isListening stays stuck at
      // `true` forever since onstart/onend never fire — which is why
      // Voice Mode looked like it "closed" after one exchange.
      console.error("recognition.start() failed:", err);
      isStartingRef.current = false;
      if (silenceTimer) clearTimeout(silenceTimer);
      setIsListening(false);
      setInterimTranscript("");
      setVoiceError("Couldn't restart the mic — tap it again.");
    }
  };

  // Call when the chat panel closes — stops any active mic/speech instead of
  // letting it keep running in the background.
    const cleanup = () => {
    suppressVoiceSendRef.current = true;
    recognitionRef.current?.stop();
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    if (currentAudioRef.current) currentAudioRef.current.pause();
    setIsListening(false);
    setIsSpeaking(false);
    setIsSynthesizing(false);
    setInterimTranscript("");
  };

   return {
    isListening,
    isSpeaking,
    isSynthesizing,
    voiceError,
    availableVoices,
    selectedVoiceURI,
    setSelectedVoiceURI,
    recognitionSupported,
    interimTranscript,
    startListening,
    stopSpeaking,
    speakText,
    cleanup,
  };
}