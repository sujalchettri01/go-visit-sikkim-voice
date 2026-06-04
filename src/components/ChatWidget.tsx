import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HotelCards, { type Hotel } from "./HotelCards";
import accommodationsData from "../data/hotel";
import BikeCards, { type Bike } from "./Bikecards";
import bikesData from "../data/bikes";
import PackageCards, { type Package } from "./Packagecards";
import packagesData from "../data/package";
import ActivityCards, { type Activity } from "./Activitycards";
import activitiesData from "../data/activity";
import CabCards, { type Cab } from "./CabCards";
import cabsData, { ROUTE_PRICES } from "../data/cabs";

if (!document.getElementById("chat-styles")) {
  const s = document.createElement("style");
  s.id = "chat-styles";
  s.textContent = `
    @keyframes chatDotWave {
      0%,60%,100% { transform: translateY(0); }
      30% { transform: translateY(-7px); }
    }
    .chat-dot {
      display: inline-block; width: 7px; height: 7px; border-radius: 50%;
      background: #7c3aed; animation: chatDotWave 1.2s infinite ease-in-out;
    }
    .chat-dot:nth-child(1) { animation-delay: 0s; }
    .chat-dot:nth-child(2) { animation-delay: 0.15s; }
    .chat-dot:nth-child(3) { animation-delay: 0.3s; }
    @keyframes floatUp {
      0% { transform: translateY(0); opacity: 1; }
      100% { transform: translateY(-20px); opacity: 0; }
    }
    @keyframes fadeInOutDot {
      0%, 100% { opacity: 0.2; }
      50% { opacity: 1; }
    }
    @keyframes ripple {
      0% { transform: scale(1); opacity: 0.6; }
      100% { transform: scale(2.2); opacity: 0; }
    }
    @keyframes pandaThink {
      0%,100% { transform: translateY(0px) rotate(-3deg); }
      50% { transform: translateY(-5px) rotate(3deg); }
    }
    .panda-think { display: inline-block; font-size: 22px; animation: pandaThink 1.5s ease-in-out infinite; }

    @keyframes pandaWave {
      0%   { transform: rotate(0deg); }
      6%   { transform: rotate(-10deg); }
      12%  { transform: rotate(10deg); }
      18%  { transform: rotate(-7deg); }
      24%  { transform: rotate(7deg); }
      30%  { transform: rotate(-4deg); }
      36%, 100% { transform: rotate(0deg); }
    }
    .panda-fab {
      animation: pandaWave 6.5s ease-in-out infinite;
      transform-origin: bottom center;
      cursor: pointer;
      filter: drop-shadow(0 3px 8px rgba(109,40,217,0.35));
    }
    .panda-fab:hover { animation: none; transform: scale(1.08); }

    @keyframes fabBounce {
      0%, 100% { transform: translateY(0px) rotate(-2deg); }
      50% { transform: translateY(-8px) rotate(2deg); }
    }
    @keyframes fabGlow {
      0%, 100% { box-shadow: 0 4px 16px rgba(109,40,217,0.4); }
      50% { box-shadow: 0 8px 24px rgba(109,40,217,0.7); }
    }

    @keyframes msgSlideIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .msg-animate { animation: msgSlideIn 0.25s ease-out forwards; }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    .online-dot { animation: pulse 2s ease-in-out infinite; }

    @keyframes panelIn {
      from { opacity: 0; transform: translateY(20px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    .chat-panel-in { animation: panelIn 0.25s ease-out forwards; }

    .chat-fab, .chat-fab:hover, .chat-fab:focus, .chat-fab:active, .chat-fab:focus-visible {
      background: none !important; border: none !important; outline: none !important;
      box-shadow: none !important; -webkit-appearance: none !important;
    }
    .chat-input:focus { border-color: #7C3AED !important; background: #fff !important; }
    .quick-chip:hover { background: #6d28d9 !important; color: #fff !important; }
    .send-btn:hover { transform: scale(1.08); }
    .send-btn:active { transform: scale(0.96); }
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
  time?: string;
}

const PROJECT_ID = "061634c9-83fc-41c9-8a3d-a90abe1c960a";
const FLOW_ID    = "562f10a8-747e-4966-ad82-5ea38db6d3ea";
const API_URL    = "https://sikkimchatbotsorganization635-sikkimchatbotsproject277.lamatic.dev";
const API_KEY    = import.meta.env.VITE_LAMATIC_API_KEY as string;

const SIKKIM_CITIES = ["Gangtok","Pelling","Lachung","Namchi","Ravangla","Yuksom","Singtam","Mangan","Jorethang","Rangpo"];

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

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
  const cabCities = ["Gangtok","Siliguri","Namchi","Ravangla","Jorethang","Singtam","Rangpo","Mangan"];
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
  const short = /^(yes|no|ok|okay|sure|tell me more|more|please|go on|continue|thanks|thank you|great|cool|nice|awesome|sounds good|i see|got it|hmm|hm|what else|anything else|more details|yep|nope|yup|show me|go ahead|and\??|then\??)[\s!?.]*$/i;
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
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F1FF}\u{1F200}-\u{1F2FF}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{3030}\u{2B50}\u{2B55}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{3297}\u{3299}\u{303D}\u{00A9}\u{00AE}\u{2122}\u{23F3}\u{24C2}\u{23E9}-\u{23F3}\u{25AA}-\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{00A9}\u{00AE}]/gu, "")
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

async function handleMessage(userMessage: string, history: Message[]): Promise<Omit<Message, "role">> {
  if (isShortReply(userMessage)) {
    const ctx = history.slice(-4).map(m => `${m.role === "user" ? "User" : "Guide"}: ${m.text.substring(0, 150)}`).join("\n");
    const raw = await callAPI(`Context:\n${ctx}\n\nUser: ${userMessage}`);
    return { text: cleanText(raw) || "Could you tell me more?", time: getTime() };
  }

  if (isHotelQuery(userMessage) && !isBikeQuery(userMessage)) {
    const city = extractCity(userMessage);
    const hotels = getHotelsForCity(city).map(mapHotel);
    let text = `Here are some great hotels in ${city}! Click any card to view details.`;
    try {
      const raw = await callAPI(userMessage);
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
      const raw = await callAPI(userMessage);
      const intro = extractIntro(raw);
      if (intro && intro.length > 10) text = intro;
    } catch { /* use default */ }
    return { text, bikes, city, time: getTime() };
  }

  if (isActivityQuery(userMessage)) {
    let text = "Here are some exciting activities in Sikkim!";
    try {
      const raw = await callAPI(userMessage);
      const intro = extractIntro(raw);
      if (intro && intro.length > 10) text = intro;
    } catch { /* use default */ }
    return { text, activities: activitiesData.slice(0, 6) as Activity[], time: getTime() };
  }

  if (isPackageQuery(userMessage)) {
    let text = "Here are some amazing tour packages for Sikkim!";
    try {
      const raw = await callAPI(userMessage);
      const intro = extractIntro(raw);
      if (intro && intro.length > 10) text = intro;
    } catch { /* use default */ }
    return { text, packages: (packagesData as any[]).slice(0, 6) as Package[], time: getTime() };
  }

  if (isCabQuery(userMessage)) {
    const { from, to } = extractRoute(userMessage);
    const routePrices = ROUTE_PRICES[from] ?? {};
    let text = to ? `Here are cabs from ${from} to ${to}!` : `Here are cabs from ${from}!`;
    try {
      const raw = await callAPI(userMessage);
      const intro = extractIntro(raw);
      if (intro && intro.length > 10) text = intro;
    } catch { /* use default */ }
    return { text, cabs: cabsData as Cab[], cabFrom: from, cabTo: to, routePrices, time: getTime() };
  }

  const raw = await callAPI(userMessage);
  return { text: cleanText(raw) || "I'm here to help! Ask me about hotels, activities, packages, bikes or cabs in Sikkim.", time: getTime() };
}

export default function ChatWidget() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Namaste! I'm Guide AI, your Sikkim travel expert! Ask me anything — hotels, treks, permits, food, cabs, or the best places to visit!", time: getTime() },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (loading) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (messages.length > 1) {
      const lastMsg = document.querySelectorAll('.msg-animate');
      const last = lastMsg[lastMsg.length - 1] as HTMLElement;
      last?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setMessages(prev => [...prev, { role: "user", text: msg, time: getTime() }]);
    setInput("");
    setLoading(true);
    try {
      const reply = await handleMessage(msg, messages);
      setMessages(prev => [...prev, { role: "assistant", ...reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", text: `Sorry, I had trouble connecting. Please try again!`, time: getTime() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      {/* FAB */}
      {!open && (
        <div style={S.fabWrapper}>
          <button style={S.fabLabel} onClick={() => setOpen(true)}>
            Ask me anything!
          </button>
          <img
            src="/red-panda.png"
            className="panda-fab chat-fab"
            style={S.fabImg}
            alt="Guide AI"
            onClick={() => setOpen(true)}
          />
        </div>
      )}

      {open && (
        <button onClick={() => setOpen(false)} style={S.closeFloat} className="send-btn">✕</button>
      )}

      {/* Chat Panel */}
      {open && (
        <div style={S.panel} className="chat-panel-in">

          {/* Header */}
          <div style={S.header}>
            <div style={S.headerAvatar}><img src="/red-panda.png" alt="Guide AI" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
            <div style={S.headerCenter}>
              <div style={S.headerName}>Guide AI</div>
              <div style={S.headerSub}>
                <span className="online-dot" style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#4ade80", marginRight: 5 }} />
                 Your Sikkim's AI Guide Bot
              </div>
            </div>
            <button style={S.headerCloseBtn} onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div style={S.messages}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className="msg-animate"
                style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}
              >
                {msg.role === "assistant" && (
                  <div style={S.aiLabel}>Guide AI ✦</div>
                )}
                <div style={msg.role === "user" ? S.userBubble : S.aiBubble}>
                  {msg.text.split("\n").map((line, j, arr) => (
                    <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
                  ))}
                </div>
                {msg.time && (
                  <div style={{ fontSize: "10px", color: "#c4b5fd", marginTop: "3px", marginLeft: msg.role === "assistant" ? "4px" : "0", marginRight: msg.role === "user" ? "4px" : "0" }}>
                    {msg.time}
                  </div>
                )}

                {/* Cards */}
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

            {/* Typing indicator */}
            {loading && (
              <div className="msg-animate" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <div style={S.aiLabel}>Guide AI ✦</div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px", padding: "4px 8px" }}>
                    {/* Thought bubble */}
                    <div style={{ background: "linear-gradient(135deg, #ede9fe, #ddd6fe)", borderRadius: "16px 16px 16px 4px", padding: "8px 14px", border: "1px solid #c4b5fd", display: "flex", gap: "5px", alignItems: "center" }}>
                      <span className="chat-dot" style={{ width: "8px", height: "8px", background: "#7c3aed" }} />
                      <span className="chat-dot" style={{ width: "8px", height: "8px", background: "#a78bfa" }} />
                      <span className="chat-dot" style={{ width: "8px", height: "8px", background: "#c4b5fd" }} />
                    </div>

                    {/* Panda */}
                    <img src="/head.png" alt="Guide AI" className="panda-think" style={{ width: "72px", height: "72px", objectFit: "contain" }} />
                  </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input row */}
          <div style={S.inputRow}>
            <input
              ref={inputRef}
              style={S.input}
              className="chat-input"
              placeholder="Ask about Sikkim..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
              maxLength={500}
            />
            <button
              style={{ ...S.sendBtn, opacity: input.trim() && !loading ? 1 : 0.5 }}
              className="send-btn"
              onClick={() => send()}
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>

          {/* Footer branding */}
          <div style={{ textAlign: "center", fontSize: "10px", color: "#a78bfa", padding: "4px 0 8px", background: "#faf8ff" }}>
             <span style={{ color: "#6d28d9", fontWeight: 800 }}>Made in Sikkim</span>
          </div>
        </div>
      )}
    </>
  );
}

const S: Record<string, React.CSSProperties> = {
  fabWrapper: {
    position: "fixed", bottom: "0px", right: "16px", zIndex: 9999,
    display: "flex", flexDirection: "column", alignItems: "flex-end",
    background: "none", pointerEvents: "none",
  },
  fabImg: {
    width: "110px", height: "110px", objectFit: "contain",
    cursor: "pointer", pointerEvents: "auto", display: "block",
    background: "transparent",
  },
  fabLabel: {
    background: "linear-gradient(135deg, #4c1d95, #6d28d9)",
    border: "none",
    borderRadius: "20px",
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: 800,
    color: "#fff",
    cursor: "pointer",
    pointerEvents: "auto" as const,
    whiteSpace: "nowrap" as const,
    marginBottom: "4px",
    marginRight: "12px",
    letterSpacing: "0.3px",
    fontFamily: "'Inter', sans-serif",
    animation: "fabBounce 1.4s ease-in-out infinite, fabGlow 1.4s ease-in-out infinite",
    display: "inline-block",
  },
  closeFloat: {
    position: "fixed", bottom: "20px", right: "16px", zIndex: 9999,
    width: "44px", height: "44px", borderRadius: "50%",
    background: "linear-gradient(135deg, #4c1d95, #6d28d9)",
    color: "#fff", border: "none", cursor: "pointer",
    fontSize: "16px", fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 16px rgba(109,40,217,0.4)",
    transition: "transform 0.15s ease",
  },
  panel: {
    position: "fixed", bottom: "80px", right: "12px", zIndex: 9998,
    width: "calc(100vw - 24px)", maxWidth: "370px", height: "600px",
    background: "#faf8ff", borderRadius: "24px",
    boxShadow: "0 24px 64px rgba(109,40,217,0.15)",
    display: "flex", flexDirection: "column", overflow: "hidden",
    border: "1px solid #ddd6fe",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  header: {
    display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px",
    background: "linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #4338ca 100%)", color: "#fff",
    flexShrink: 0, minHeight: "64px",
  },
  headerAvatar: {
    width: "52px", height: "52px",
    flexShrink: 0,
    background: "transparent",
  },
  headerCenter: { flex: 1 },
  headerName: { fontWeight: 700, fontSize: "15px" },
  headerSub: { fontSize: "11px", opacity: 0.9, marginTop: "2px", display: "flex", alignItems: "center" },
  headerCloseBtn: {
    background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%",
    width: "30px", height: "30px", color: "#fff", fontSize: "14px",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, transition: "background 0.15s",
  },
  chips: {
    display: "flex", gap: "6px", padding: "10px 12px",
    overflowX: "auto", scrollbarWidth: "none",
    borderBottom: "1px solid #ede9fe", background: "#f5f3ff", flexShrink: 0,
  },
  chip: {
    flexShrink: 0, padding: "6px 12px", borderRadius: "20px",
    border: "1.5px solid #ddd6fe", background: "#ede9fe",
    color: "#6d28d9", fontSize: "11px", fontWeight: 600,
    cursor: "pointer", whiteSpace: "nowrap" as const,
    transition: "all 0.15s ease",
  },
  messages: {
    flex: 1, overflowY: "auto", padding: "14px 12px",
    display: "flex", flexDirection: "column", gap: "10px",
    background: "#f5f3ff",
  },
  aiLabel: {
    fontSize: "11px", fontWeight: 700, color: "#7c3aed",
    marginBottom: "3px", letterSpacing: "0.3px",
  },
  userBubble: {
    background: "linear-gradient(135deg, #6d28d9, #4338ca)", color: "#fff",
    padding: "10px 15px", borderRadius: "20px 20px 4px 20px",
    maxWidth: "82%", fontSize: "14px", lineHeight: "1.6",
    boxShadow: "0 2px 8px rgba(109,40,217,0.25)", fontWeight: 400,
    wordBreak: "break-word" as const,
  },
  aiBubble: {
    background: "#fff", color: "#1e1b4b", padding: "12px 15px",
    borderRadius: "4px 20px 20px 20px", maxWidth: "90%",
    fontSize: "14px", lineHeight: "1.75",
    boxShadow: "0 2px 10px rgba(109,40,217,0.08)",
    border: "1px solid #ddd6fe", fontWeight: 400,
    wordBreak: "break-word" as const,
  },
  inputRow: {
    display: "flex", gap: "8px", padding: "10px 12px",
    borderTop: "1px solid #ede9fe", background: "#fff", alignItems: "center",
    flexShrink: 0,
  },
  input: {
    flex: 1, padding: "10px 16px", borderRadius: "24px",
    border: "1.5px solid #ddd6fe", fontSize: "14px",
    outline: "none", fontFamily: "'Inter', sans-serif",
    background: "#faf8ff", color: "#1e1b4b",
    transition: "border-color 0.2s, background 0.2s",
  },
  sendBtn: {
    width: "40px", height: "40px", borderRadius: "50%",
    background: "linear-gradient(135deg, #6d28d9, #4338ca)",
    color: "#fff", border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, boxShadow: "0 2px 8px rgba(109,40,217,0.4)",
    transition: "transform 0.15s ease, opacity 0.2s",
  },
};