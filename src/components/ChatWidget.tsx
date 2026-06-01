import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HotelCards, { Hotel } from "./HotelCards";
import accommodationsData from "../data/hotel";
import BikeCards, { Bike } from "./BikeCards";
import bikesData from "../data/bikes";
import PackageCards, { Package } from "./PackageCards";
import packagesData from "../data/package";
import ActivityCards, { Activity } from "./ActivityCards";
import activitiesData from "../data/activity";
import CabCards, { Cab } from "./CabCards";
import cabsData, { ROUTE_PRICES } from "../data/cabs";

if (!document.getElementById("chat-styles")) {
  const s = document.createElement("style");
  s.id = "chat-styles";
  s.textContent = `
    @keyframes chatDotBounce {
      0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
      40% { transform: translateY(-6px); opacity: 1; }
    }
    .chat-dot {
      display: inline-block; width: 8px; height: 8px; border-radius: 50%;
      background: #4F46E5; animation: chatDotBounce 1.2s infinite ease-in-out;
    }
    .chat-dot:nth-child(1) { animation-delay: 0s; }
    .chat-dot:nth-child(2) { animation-delay: 0.2s; }
    .chat-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes fabFloat {
      0%, 100% { transform: translateY(0px); filter: drop-shadow(0 3px 8px rgba(79,70,229,0.35)); }
      50% { transform: translateY(-6px); filter: drop-shadow(0 8px 14px rgba(79,70,229,0.25)); }
    }
    .panda-fab { animation: fabFloat 3s ease-in-out infinite; cursor: pointer; }
    .panda-fab:hover { animation: none; transform: scale(1.05); }
    .chat-fab, .chat-fab:hover, .chat-fab:focus, .chat-fab:active, .chat-fab:focus-visible {
      background: none !important; border: none !important; outline: none !important;
      box-shadow: none !important; -webkit-appearance: none !important;
    }
  `;
  document.head.appendChild(s);
}

interface Message {
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
}

const PROJECT_ID = "061634c9-83fc-41c9-8a3d-a90abe1c960a";
const FLOW_ID    = "562f10a8-747e-4966-ad82-5ea38db6d3ea";
const API_URL    = "https://sikkimchatbotsorganization635-sikkimchatbotsproject277.lamatic.dev";
const API_KEY    = import.meta.env.VITE_LAMATIC_API_KEY as string;

const SIKKIM_CITIES = ["Gangtok", "Pelling", "Lachung", "Namchi", "Ravangla", "Yuksom", "Singtam", "Mangan", "Jorethang", "Rangpo"];

function getHotelsForCity(city: string): any[] {
  const key = city.toLowerCase();
  const filtered = (accommodationsData as any[]).filter(h => h.location.toLowerCase().includes(key));
  return filtered.length > 0 ? filtered : (accommodationsData as any[]).slice(0, 6);
}

function getBikesForCity(city: string): Bike[] {
  const key = city.toLowerCase();
  const filtered = (bikesData as any[]).filter(b =>
    b.city && typeof b.city === "string" && b.city.toLowerCase().includes(key)
  );
  return filtered.length > 0 ? filtered : bikesData as Bike[];
}

function extractCity(text: string): string {
  for (const city of SIKKIM_CITIES) {
    if (new RegExp(`\\b${city}\\b`, "i").test(text)) return city;
  }
  return "Gangtok";
}

function extractRoute(text: string): { from: string; to: string } {
  const cabCities = ["Gangtok", "Siliguri", "Namchi", "Ravangla", "Jorethang", "Singtam", "Rangpo", "Mangan"];
  const found = cabCities.filter(c => new RegExp(`\\b${c}\\b`, "i").test(text));
  return { from: found[0] ?? "Gangtok", to: found[1] ?? "" };
}

function mapHotel(h: any): Hotel {
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
  };
}

function isShortReply(text: string): boolean {
  const short = /^(yes|no|ok|okay|sure|tell me more|more|please|go on|continue|thanks|thank you|great|cool|nice|awesome|sounds good|i see|got it|hmm|hm|what else|anything else|more details|yep|nope|yup|show me|go ahead)[\s!?.]*$/i;
  return short.test(text.trim()) || text.trim().split(/\s+/).length <= 2;
}

function isHotelQuery(text: string): boolean {
  if (isShortReply(text)) return false;
  return /\b(hotels?|accommodation|stay|lodge|resort|hostel|where to stay|place to stay|rooms? in|guesthouses?)\b/i.test(text);
}

function isBikeQuery(text: string): boolean {
  if (isShortReply(text)) return false;
  return /\b(bikes?|motorcycle|rent.*bikes?|bikes?.*rent|two.?wheel|scooter|royal enfield|RE himalayan|bike rental)\b/i.test(text);
}

function isActivityQuery(text: string): boolean {
  if (isShortReply(text)) return false;
  return /\b(activit|trekkings?|trekings?|trek|hiking|hike|adventure|rafting|paragliding|camping|things to do|what to do|sightseeing|opt for|outdoor)\b/i.test(text);
}

function isPackageQuery(text: string): boolean {
  if (isShortReply(text)) return false;
  return /\b(packages?|tour packages?|travel packages?|holiday packages?|sikkim packages?|show.*packages?|want.*packages?|itinerary|trip plan)\b/i.test(text);
}

function isCabQuery(text: string): boolean {
  if (isShortReply(text)) return false;
  return /\b(cabs?|taxi|car hire|book.*cabs?|transport|from\s+\w+\s+to\s+\w+|cab booking)\b/i.test(text);
}

function cleanText(text: string): string {
  return text
    .replace(/###\s*(?:\d+\.)?\s*/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^[-•]\s+/gm, "• ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractIntro(raw: string): string {
  const introEnd = raw.search(/\n(?:###\s*)?(?:\d+\.|\•)\s+[A-Z]/);
  const intro = introEnd > 0 ? raw.substring(0, introEnd).trim() : raw.trim();
  return cleanText(intro);
}

const EXECUTE_QUERY = `
  query ExecuteWorkflow($workflowId: String!, $payload: JSON!) {
    executeWorkflow(workflowId: $workflowId, payload: $payload) {
      status
      result
    }
  }
`;

async function callAPI(message: string): Promise<string> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
      "x-project-id": PROJECT_ID,
    },
    body: JSON.stringify({
      query: EXECUTE_QUERY,
      variables: {
        workflowId: FLOW_ID,
        payload: { chatMessage: message },
      },
    }),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  const result = data?.data?.executeWorkflow?.result;
  return result?.content ?? result?.message ?? result?.text ?? result?.output ?? result?.response ?? "";
}

async function handleMessage(
  userMessage: string,
  history: Message[]
): Promise<Omit<Message, "role">> {

  if (isShortReply(userMessage)) {
    const ctx = history.slice(-4).map(m => `${m.role === "user" ? "User" : "Guide"}: ${m.text.substring(0, 150)}`).join("\n");
    const raw = await callAPI(`Context:\n${ctx}\n\nUser: ${userMessage}`);
    return { text: cleanText(raw) || "Could you tell me more? 😊" };
  }

  if (isHotelQuery(userMessage) && !isBikeQuery(userMessage)) {
    const city = extractCity(userMessage);
    const hotels = getHotelsForCity(city).map(mapHotel);
    let text = `Here are some great hotels in ${city}! Click any card to view details.`;
    try {
      const raw = await callAPI(userMessage);
      const intro = extractIntro(raw);
      if (intro && intro.length > 10) text = intro;
    } catch { /* use default text */ }
    return { text, hotels, city };
  }

  if (isBikeQuery(userMessage)) {
    const city = extractCity(userMessage);
    const bikes = getBikesForCity(city);
    let text = `Here are bikes available in ${city}! Click to book.`;
    try {
      const raw = await callAPI(userMessage);
      const intro = extractIntro(raw);
      if (intro && intro.length > 10) text = intro;
    } catch { /* use default text */ }
    return { text, bikes, city };
  }

  if (isActivityQuery(userMessage)) {
    let text = "Here are some exciting activities in Sikkim!";
    try {
      const raw = await callAPI(userMessage);
      const intro = extractIntro(raw);
      if (intro && intro.length > 10) text = intro;
    } catch { /* use default text */ }
    return { text, activities: activitiesData.slice(0, 6) as Activity[] };
  }

  if (isPackageQuery(userMessage)) {
    let text = "Here are some amazing tour packages for Sikkim!";
    try {
      const raw = await callAPI(userMessage);
      const intro = extractIntro(raw);
      if (intro && intro.length > 10) text = intro;
    } catch { /* use default text */ }
    return { text, packages: (packagesData as any[]).slice(0, 6) as Package[] };
  }

  if (isCabQuery(userMessage)) {
    const { from, to } = extractRoute(userMessage);
    const routePrices = ROUTE_PRICES[from] ?? {};
    let text = to ? `Here are cabs from ${from} to ${to}!` : `Here are cabs from ${from}!`;
    try {
      const raw = await callAPI(userMessage);
      const intro = extractIntro(raw);
      if (intro && intro.length > 10) text = intro;
    } catch { /* use default text */ }
    return { text, cabs: cabsData as Cab[], cabFrom: from, cabTo: to, routePrices };
  }

  const raw = await callAPI(userMessage);
  return { text: cleanText(raw) || "I'm here to help! Ask me about hotels, activities, packages, bikes or cabs in Sikkim. 😊" };
}

export default function ChatWidget() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hi! I am Guide Daju 🙏 Ask me anything about Sikkim — hotels, places, food, travel tips!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastMsgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [loading]);

  useEffect(() => {
    if (messages.length > 1) {
      lastMsgRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [messages.length]);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setMessages(prev => [...prev, { role: "user", text: msg }]);
    setInput("");
    setLoading(true);
    try {
      const reply = await handleMessage(msg, messages);
      setMessages(prev => [...prev, { role: "assistant", ...reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", text: `⚠️ Error: ${err instanceof Error ? err.message : "Unknown"}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const QUICK_CHIPS = ["Hotels in Gangtok", "Rent a Bike", "Tour Packages", "Activities", "Cab Booking"];

  return (
    <>
      {!open && (
        <div style={S.fabWrapper}>
          <button style={S.fabLabel} onClick={() => setOpen(true)}>Ask me anything!</button>
          <img src="/red-panda.png" className="panda-fab" style={S.fabImg} alt="Guide Daju" onClick={() => setOpen(true)} />
        </div>
      )}

      {open && <button onClick={() => setOpen(false)} style={S.closeFloat}>✕</button>}

      {open && (
        <div style={S.panel}>
          <div style={S.header}>
            <button style={S.headerBtn} onClick={() => setOpen(false)}>✕</button>
            <div style={S.headerCenter}>
              <div style={S.headerName}>Guide Daju</div>
              <div style={S.headerSub}>• Your Sikkim travel guide</div>
            </div>
            <button style={S.headerBtn}>•••</button>
          </div>

          {messages.length === 1 && (
            <div style={S.chips}>
              {QUICK_CHIPS.map(chip => (
                <button key={chip} style={S.chip} onClick={() => send(chip)}>{chip}</button>
              ))}
            </div>
          )}

          <div style={S.messages}>
            {messages.map((msg, i) => (
              <div
                key={i}
                ref={i === messages.length - 1 && msg.role === "assistant" ? lastMsgRef : null}
                style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}
              >
                {msg.role === "assistant" && <div style={S.aiLabel}>Guide Daju ✦</div>}
                <div style={msg.role === "user" ? S.userBubble : S.aiBubble}>
                  {msg.text.split("\n").map((line, j, arr) => (
                    <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
                  ))}
                </div>
                {msg.role === "assistant" && msg.hotels && msg.hotels.length > 0 && (
                  <HotelCards hotels={msg.hotels} city={msg.city} onClose={() => setOpen(false)} />
                )}
                {msg.role === "assistant" && msg.bikes && msg.bikes.length > 0 && (
                  <BikeCards bikes={msg.bikes} city={msg.city} onClose={() => setOpen(false)} />
                )}
                {msg.role === "assistant" && msg.packages && msg.packages.length > 0 && (
                  <PackageCards packages={msg.packages} onClose={() => setOpen(false)} />
                )}
                {msg.role === "assistant" && msg.activities && msg.activities.length > 0 && (
                  <ActivityCards activities={msg.activities} onClose={() => setOpen(false)} />
                )}
                {msg.role === "assistant" && msg.cabs && msg.cabs.length > 0 && (
                  <CabCards cabs={msg.cabs} from={msg.cabFrom} to={msg.cabTo} routePrices={msg.routePrices} onClose={() => setOpen(false)} />
                )}
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <div style={S.aiLabel}>Guide Daju ✦</div>
                <div style={S.aiBubble}>
                  <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                    <span className="chat-dot" />
                    <span className="chat-dot" />
                    <span className="chat-dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={S.inputRow}>
            <input
              style={S.input}
              placeholder="Ask me anything"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
            />
            <button
              style={{ ...S.sendBtn, opacity: input.trim() ? 1 : 0.5 }}
              onClick={() => send()}
              disabled={loading || !input.trim()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const S: Record<string, React.CSSProperties> = {
  fabWrapper: {
    position: "fixed",
    bottom: "0px",
    right: "16px",           // ← was 20px
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    background: "none",
    pointerEvents: "none",
  },
  fabImg: {
    width: "110px",          // ← was 200px
    height: "110px",         // ← was 200px
    objectFit: "contain",
    cursor: "pointer",
    pointerEvents: "auto",
    display: "block",
    background: "transparent",
    imageRendering: "auto",
  },
  fabLabel: {
    background: "#fff",
    border: "none",
    borderRadius: "20px",    // ← was 24px
    padding: "8px 14px",     // ← was 14px 22px
    fontSize: "13px",        // ← was 15px
    fontWeight: 700,
    color: "#4F46E5",
    cursor: "pointer",
    pointerEvents: "auto",
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
    fontFamily: "'Inter', sans-serif",
    whiteSpace: "nowrap",
    marginBottom: "4px",     // ← was 8px
    marginRight: "12px",     // ← was 20px
  },
  closeFloat: {
    position: "fixed",
    bottom: "20px",          // ← was 24px
    right: "16px",           // ← was 20px
    zIndex: 9999,
    width: "44px",           // ← was 48px
    height: "44px",          // ← was 48px
    borderRadius: "50%",
    background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 16px rgba(79,70,229,0.4)",
  },
  panel: {
    position: "fixed",
    bottom: "80px",          // ← was 90px
    right: "12px",           // ← was 20px
    zIndex: 9998,
    width: "calc(100vw - 24px)", // ← was fixed 360px — now fluid on mobile
    maxWidth: "360px",           // ← caps at 360px on larger screens
    height: "580px",
    background: "#fff",
    borderRadius: "24px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    border: "1px solid rgba(0,0,0,0.06)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  header: {
    display: "flex", alignItems: "center", gap: "8px", padding: "14px 16px",
    background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)", color: "#fff",
  },
  headerBtn: {
    background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%",
    width: "30px", height: "30px", color: "#fff", fontSize: "14px",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  headerCenter: { flex: 1, textAlign: "center" },
  headerName: { fontWeight: 700, fontSize: "15px" },
  headerSub: { fontSize: "11px", opacity: 0.85, marginTop: "1px" },
  chips: {
    display: "flex", gap: "6px", padding: "10px 12px",
    overflowX: "auto", scrollbarWidth: "none",
    borderBottom: "1px solid #f0f0f0", background: "#fff",
  },
  chip: {
    flexShrink: 0, padding: "6px 12px", borderRadius: "20px",
    border: "1.5px solid #4F46E5", background: "#fff",
    color: "#4F46E5", fontSize: "11px", fontWeight: 600,
    cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'Lato', sans-serif",
  },
  messages: {
    flex: 1, overflowY: "auto", padding: "14px 12px",
    display: "flex", flexDirection: "column", gap: "10px",
    background: "#f7f8fc",
  },
  aiLabel: {
    fontSize: "12px", fontWeight: 700, color: "#4F46E5",
    marginBottom: "4px", letterSpacing: "0.3px",
  },
  userBubble: {
    background: "linear-gradient(135deg, #4F46E5, #7C3AED)", color: "#fff",
    padding: "10px 15px", borderRadius: "20px 20px 4px 20px",
    maxWidth: "80%", fontSize: "14px", lineHeight: "1.6",
    boxShadow: "0 2px 8px rgba(79,70,229,0.3)", fontWeight: 400,
  },
  aiBubble: {
    background: "#fff", color: "#1a1a1a", padding: "12px 15px",
    borderRadius: "4px 20px 20px 20px", maxWidth: "88%",
    fontSize: "14px", lineHeight: "1.7",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    border: "1px solid rgba(0,0,0,0.04)", fontWeight: 400,
  },
  inputRow: {
    display: "flex", gap: "8px", padding: "12px 14px",
    borderTop: "1px solid #eee", background: "#fff", alignItems: "center",
  },
  input: {
    flex: 1, padding: "11px 16px", borderRadius: "24px",
    border: "1.5px solid #e8e8e8", fontSize: "14px",
    outline: "none", fontFamily: "'Inter', sans-serif",
    background: "#f7f8fc", color: "#111",
  },
  sendBtn: {
    width: "40px", height: "40px", borderRadius: "50%",
    background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
    color: "#fff", border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, boxShadow: "0 2px 8px rgba(79,70,229,0.4)",
  },
};