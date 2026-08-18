import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import HotelCards from "./HotelCards";
import BikeCards from "./Bikecards";
import PackageCards from "./Packagecards";
import ActivityCards from "./Activitycards";
import CabCards from "./CabCards";
import { S } from "./chatStyles";
import {
  type Message,
  getTime,
  handleMessage,
  splitIntoDayBlocks,
  buildExploreSlides,
  useVoice,
  GOOGLE_MAPS_API_KEY,
  ELEVENLABS_API_KEY,
  PLANNER_TYPES,
  PLANNER_MONTHS,
  PLANNER_NATIONALITIES,
  SUGGEST_FILTERS,
  // NAV_ITEMS and CONTACT_PHONE are exported from chatLogic.ts but currently
  // unused here — the sidebar was replaced with the Smart Travel Planner form.
  // Bring them back in if you want nav links or a Contact Us button again.
} from "./chatLogic";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [isWide, setIsWide] = useState(typeof window !== "undefined" ? window.innerWidth >= 1024 : true);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Namaste! I'm Guide AI, your Sikkim travel expert! Ask me anything — hotels, treks, permits, food, cabs, or the best places to visit!", time: getTime() },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestFilter, setSuggestFilter] = useState<"all" | "package" | "activity">("all");
  const [freeMessagesUsed, setFreeMessagesUsed] = useState(0);
  const [plannerMonth, setPlannerMonth] = useState("");
  const [plannerNationality, setPlannerNationality] = useState("");
  const [plannerDays, setPlannerDays] = useState("");
  const [plannerType, setPlannerType] = useState("");
  // Mobile-only: the planner form lives in the left sidebar, which is hidden on
  // narrow screens (isWide === false). This drives a bottom sheet so the form
  // is still reachable on mobile instead of just disappearing.
  const [showPlannerMobile, setShowPlannerMobile] = useState(false);
  // Full-screen "Voice Mode" (ChatGPT-style): tap to enter, speak continuously,
  // AI replies in voice, loops automatically until closed. No typing in this mode.
  const [voiceModeOpen, setVoiceModeOpen] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // All mic/speech state and logic lives in this one hook — see chatLogic.ts.
  const voice = useVoice();

  useEffect(() => {
    const onResize = () => setIsWide(window.innerWidth >= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (loading) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (messages.length > 1) {
      const lastMsg = document.querySelectorAll(".msg-animate");
      const last = lastMsg[lastMsg.length - 1] as HTMLElement;
      last?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [messages, loading]);

  // Voice Mode auto-loop: once a spoken reply finishes playing, automatically
  // start listening again — this is what makes it a continuous conversation
  // instead of a single question/answer. Also fires once when Voice Mode first
  // opens, to kick off the very first listen without a manual tap.
  useEffect(() => {
    if (!voiceModeOpen) return;
    if (voice.isSpeaking || voice.isListening || loading) return;
    const t = setTimeout(() => voice.startListening(transcript => send(transcript, true)), 500);
    return () => clearTimeout(t);
  }, [voiceModeOpen, voice.isSpeaking, voice.isListening, loading]);

  const exitVoiceMode = () => {
    voice.cleanup(); // stops mic/speech and discards any half-caught sentence
    setVoiceModeOpen(false);
  };

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
    if (!open) { voice.cleanup(); setVoiceModeOpen(false); } // stop any active mic/speech and exit Voice Mode
  }, [open]);

  const send = async (text?: string, viaVoice = false) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setMessages(prev => [...prev, { role: "user", text: msg, time: getTime() }]);
    setFreeMessagesUsed(prev => prev + 1);
    setInput("");
    setLoading(true);
    try {
      const reply = await handleMessage(msg, messages);
      setMessages(prev => [...prev, { role: "assistant", ...reply }]);
      if (viaVoice && reply.text) voice.speakText(reply.text);
    } catch (err) {
      const failText = "Sorry, I had trouble connecting. Please try again!";
      setMessages(prev => [...prev, { role: "assistant", text: failText, time: getTime() }]);
      if (viaVoice) voice.speakText(failText);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  // Builds a natural-language prompt from the planner form and sends it through
  // the normal chat pipeline — same AI call, same card-detection logic (this
  // will typically match isPackageQuery and come back with PackageCards, since
  // the message includes "package").
  const handleGenerateItinerary = () => {
    if (!plannerDays.trim() || loading) return;
    let msg = `Customize a package for Sikkim: ${plannerDays.trim()} days`;
    if (plannerMonth) msg += `, traveling in ${plannerMonth}`;
    if (plannerType) msg += `, ${plannerType.toLowerCase()} style`;
    msg += ".";
    if (plannerNationality) {
      msg += ` I'm a ${plannerNationality === "Indian" ? "domestic Indian" : "foreign"} traveler`;
      msg += plannerNationality === "Indian"
        ? " — let me know which permits (like Inner Line Permit) I'll need."
        : " — let me know which areas need a Protected Area Permit and which are off-limits to foreign nationals (e.g. Nathula Pass).";
    }
    msg += " Include hotel, transport and day-wise plan in the package.";
    setShowPlannerMobile(false); // close the sheet on mobile so the reply is visible immediately
    send(msg);
  };

  // ─── Explore panel: two independent 3-section rotations ─────────────────
  // Top card cycles: Package → River Rafting → Cab Booking, every 3s.
  // Bottom card cycles: Hotel → Trekking → Upcoming Event, every 5s.
  //
  // NOTE: the filter pills (All/Tours/Activities) above the cards no longer
  // affect these two — the whole point of this mode is a fixed section
  // rotation per card. Say the word if you want the pills wired back in.
  const { top: TOP_SLIDES, bottom: BOTTOM_SLIDES } = useMemo(() => buildExploreSlides(), []);
  const SLIDE_SETS = [TOP_SLIDES, BOTTOM_SLIDES];
  const CARD_ROTATE_MS = [3000, 5000];
  const [slideIndexes, setSlideIndexes] = useState<number[]>([0, 0]);
  useEffect(() => {
    const timers = SLIDE_SETS.map((slides, i) =>
      window.setInterval(() => {
        setSlideIndexes(prev => {
          const next = [...prev];
          next[i] = (next[i] + 1) % slides.length;
          return next;
        });
      }, CARD_ROTATE_MS[i] ?? 4000)
    );
    return () => timers.forEach(t => clearInterval(t));
  }, [TOP_SLIDES, BOTTOM_SLIDES]);

  const suggestions = slideIndexes.map((idx, i) => SLIDE_SETS[i][idx]);

  // Shared form fields — used both in the desktop sidebar and the mobile bottom
  // sheet, so the two never drift out of sync with each other.
  const plannerFormNode = (
    <div style={S.plannerCard}>
      <p style={S.plannerTitle}>Customize Your Package</p>
      <p style={S.plannerSubtitle}>
        Tell us your travel month, nationality, trip length and style — we'll customize a Sikkim package for you.
      </p>

      <label style={S.plannerLabel}>Travel Month</label>
      <select
        style={S.plannerInput}
        value={plannerMonth}
        onChange={e => setPlannerMonth(e.target.value)}
      >
        <option value="">Select a month</option>
        {PLANNER_MONTHS.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <label style={S.plannerLabel}>Nationality</label>
      <select
        style={S.plannerInput}
        value={plannerNationality}
        onChange={e => setPlannerNationality(e.target.value)}
      >
        <option value="">Select nationality</option>
        {PLANNER_NATIONALITIES.map(n => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>

      <label style={S.plannerLabel}>Days</label>
      <input
        style={S.plannerInput}
        placeholder="e.g. 5"
        inputMode="numeric"
        value={plannerDays}
        onChange={e => setPlannerDays(e.target.value.replace(/[^0-9]/g, ""))}
      />

      <label style={S.plannerLabel}>Destination Type</label>
      <select
        style={S.plannerInput}
        value={plannerType}
        onChange={e => setPlannerType(e.target.value)}
      >
        <option value="">Select a type</option>
        {PLANNER_TYPES.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <button
        style={{ ...S.plannerBtn, opacity: plannerDays.trim() && !loading ? 1 : 0.6 }}
        onClick={handleGenerateItinerary}
        disabled={!plannerDays.trim() || loading}
      >
        Customize My Package
      </button>
    </div>
  );

  return (
    <>
      {/* FAB — fixed bottom right, never moves */}
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

      {/* Chat Panel — full screen, 3-column layout */}
      {open && (
        <div style={S.panel} className="chat-panel-in">

          {/* Top strip — the reference design has no in-page header (that's browser
              chrome). We still need a way to close this full-screen panel, so keep a
              minimal, unobtrusive close button instead of a branded bar. Plain text ×
              instead of an icon-font glyph — icon fonts weren't reliably rendering here. */}
          <button style={S.floatingCloseBtn} onClick={() => setOpen(false)} aria-label="Close chat">
            <span style={{ fontSize: "22px", lineHeight: 1, fontWeight: 400 }} aria-hidden="true">×</span>
          </button>

          {/* Body: sidebar | chat | suggestions */}
          <div style={S.body}>

            {/* LEFT: Sidebar — replaced with the Smart Travel Planner form.
                NOTE: this removes the nav links (Home/Hotels/Bikes/Cabs/Packages/
                Activities), the tip cards, and the Contact Us button that used to
                live here — there's currently no other way to reach those pages
                from inside the open chat panel. NAV_ITEMS and CONTACT_PHONE are
                still exported from chatLogic.ts if you want them back. */}
            {isWide && (
              <aside style={S.sidebar}>
                <div style={S.sidebarLogo}>
                  <span style={S.sidebarWordmark}>GoVisit Sikkim</span>
                </div>

                {plannerFormNode}
              </aside>
            )}

            {/* CENTER: Chat */}
            <div style={S.centerCol}>
              <div style={{ ...S.topBar, paddingRight: isWide ? "24px" : "56px" }}>
                <div style={S.centerLogo}>
                  <img src="/red-panda.png" alt="" style={{ ...S.centerLogoImg, ...(isWide ? {} : S.centerLogoImgMobile) }} />
                  <span style={S.centerLogoText}>Guide AI</span>
                </div>
                {!isWide && (
                  <button
                    style={S.mobilePlannerBtn}
                    onClick={() => setShowPlannerMobile(true)}
                    aria-label="Customize your package"
                  >
                    <i className="ti ti-suitcase" style={{ fontSize: "13px" }} aria-hidden="true" />
                    Customize
                  </button>
                )}
              </div>

              <div style={S.messages} className="chat-scroll">
                <div style={S.messagesInner}>
                  {messages.map((msg, i) => {
                    const dayParsed = msg.role === "assistant" ? splitIntoDayBlocks(msg.text) : null;
                    const isBeingSpoken = voice.isSpeaking && msg.role === "assistant" && i === messages.length - 1;
                    return (
                      <div
                        key={i}
                        className="msg-animate"
                        style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}
                      >
                        {msg.role === "assistant" && (
                          <div style={S.aiLabel}>
                            Guide AI ✦
                            {isBeingSpoken && (
                              <span style={S.speakingBadge}>
                                <span className="speaking-dot" style={S.speakingDot} />
                                <span className="speaking-dot" style={S.speakingDot} />
                                <span className="speaking-dot" style={S.speakingDot} />
                                Speaking
                              </span>
                            )}
                          </div>
                        )}
                        <div style={msg.role === "user" ? S.userBubble : S.aiBubble}>
                          {dayParsed ? (
                            <>
                              {dayParsed.intro.map((line, j) => (
                                <p key={j} style={S.introLine}>{line}</p>
                              ))}
                              {dayParsed.days.map((d, di) => {
                                const mapSrc = d.mapQuery
                                  ? (GOOGLE_MAPS_API_KEY
                                      ? `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(d.mapQuery)}`
                                      : `https://www.google.com/maps?q=${encodeURIComponent(d.mapQuery)}&output=embed`)
                                  : null;
                                return (
                                  <div key={di} style={S.dayBlock}>
                                    <p style={S.dayBlockHeader}>{d.header}</p>
                                    {d.lines.map((line, li) => (
                                      <p key={li} style={S.dayBlockLine}>{line}</p>
                                    ))}
                                    {d.images.length > 0 && (
                                      <div style={S.dayBlockPhotoGrid}>
                                        {d.images.map((src, ii) => (
                                          <img
                                            key={ii}
                                            src={src}
                                            alt=""
                                            style={S.dayBlockPhoto}
                                            onClick={() => window.open(src, "_blank", "noopener,noreferrer")}
                                          />
                                        ))}
                                      </div>
                                    )}
                                    {/* Uses the official Maps Embed API when GOOGLE_MAPS_API_KEY is
                                        set; otherwise falls back to the unofficial no-key trick. */}
                                    {mapSrc && (
                                      <div style={S.dayBlockMapWrap}>
                                        <iframe
                                          title={`Map — ${d.header}`}
                                          style={S.dayBlockMapFrame}
                                          loading="lazy"
                                          src={mapSrc}
                                        />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </>
                          ) : (
                            msg.text.split("\n").map((line, j, arr) => (
                              <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
                            ))
                          )}
                        </div>
                        {msg.time && (
                          <div style={{ fontSize: "10px", color: "#a394d8", marginTop: "4px", marginLeft: msg.role === "assistant" ? "4px" : "0", marginRight: msg.role === "user" ? "4px" : "0" }}>
                            {msg.time}
                          </div>
                        )}

                        {msg.role === "assistant" && msg.hotels && msg.hotels.length > 0 && (
                          <div style={S.cardsWrapper}>
                            <HotelCards hotels={msg.hotels} city={msg.city} onClose={() => setOpen(false)} />
                          </div>
                        )}
                        {msg.role === "assistant" && msg.bikes && msg.bikes.length > 0 && (
                          <div style={S.cardsWrapper}>
                            <BikeCards bikes={msg.bikes} city={msg.city} />
                          </div>
                        )}
                        {msg.role === "assistant" && msg.packages && msg.packages.length > 0 && (
                          <div style={S.cardsWrapper}>
                            <PackageCards packages={msg.packages} onClose={() => setOpen(false)} />
                          </div>
                        )}
                        {msg.role === "assistant" && msg.activities && msg.activities.length > 0 && (
                          <div style={S.cardsWrapper}>
                            <ActivityCards activities={msg.activities} onClose={() => setOpen(false)} />
                          </div>
                        )}
                        {msg.role === "assistant" && msg.cabs && msg.cabs.length > 0 && (
                          <div style={S.cardsWrapper}>
                            <CabCards cabs={msg.cabs} from={msg.cabFrom} to={msg.cabTo} routePrices={msg.routePrices} onClose={() => setOpen(false)} />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Typing indicator */}
                  {loading && (
                    <div className="msg-animate" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                      <div style={S.aiLabel}>Guide AI ✦</div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px", padding: "4px 8px" }}>
                        <div style={{ background: "linear-gradient(135deg, #ede9fe, #ddd6fe)", borderRadius: "16px 16px 16px 4px", padding: "8px 14px", border: "1px solid #c4b5fd", display: "flex", gap: "5px", alignItems: "center" }}>
                          <span className="chat-dot" style={{ width: "8px", height: "8px", background: "#7c3aed" }} />
                          <span className="chat-dot" style={{ width: "8px", height: "8px", background: "#a78bfa" }} />
                          <span className="chat-dot" style={{ width: "8px", height: "8px", background: "#c4b5fd" }} />
                        </div>
                        <img src="/head.png" alt="Guide AI" className="panda-think" style={{ width: "72px", height: "72px", objectFit: "contain" }} />
                      </div>
                    </div>
                  )}

                  <div ref={bottomRef} />
                </div>
              </div>

              {/* Input row */}
              <div style={S.inputRow}>
                {voice.voiceError && (
                  <p style={S.voiceErrorText}>
                    <i className="ti ti-alert-circle" style={{ fontSize: "13px" }} aria-hidden="true" /> {voice.voiceError}
                  </p>
                )}
                <div style={S.inputInner}>
                  {!ELEVENLABS_API_KEY && voice.availableVoices.length > 0 && (
                    <select
                      style={S.voiceSelect}
                      value={voice.selectedVoiceURI}
                      onChange={e => voice.setSelectedVoiceURI(e.target.value)}
                      title="Voice used for spoken replies"
                      aria-label="Voice used for spoken replies"
                    >
                      {voice.availableVoices.map(v => (
                        <option key={v.voiceURI} value={v.voiceURI}>
                          {v.name} ({v.lang})
                        </option>
                      ))}
                    </select>
                  )}
                  {voice.recognitionSupported && (
                    <button
                      style={{
                        ...S.micBtn,
                        ...(voice.isListening ? S.micBtnActive : {}),
                      }}
                      className={voice.isListening ? "mic-pulse" : ""}
                      onClick={() => voice.startListening(transcript => send(transcript, true))}
                      disabled={loading || voice.isListening}
                      aria-label={voice.isListening ? "Listening..." : "Speak your question"}
                      title={voice.isListening ? "Listening..." : "Speak your question"}
                    >
                      <i className="ti ti-microphone" style={{ fontSize: "17px" }} aria-hidden="true" />
                    </button>
                  )}
                  {voice.recognitionSupported && (
                    <button
                      style={S.voiceModeBtn}
                      onClick={() => setVoiceModeOpen(true)}
                      disabled={loading}
                      aria-label="Open Voice Mode — hands-free conversation"
                      title="Voice Mode"
                    >
                      <i className="ti ti-wave-sine" style={{ fontSize: "18px" }} aria-hidden="true" />
                    </button>
                  )}
                  <input
                    ref={inputRef}
                    style={S.input}
                    className="chat-input"
                    placeholder={voice.isListening ? "Listening..." : "Ask me anything"}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    disabled={loading}
                    maxLength={500}
                  />
                  {voice.isSpeaking && (
                    <button
                      style={S.stopSpeakingBtn}
                      onClick={voice.stopSpeaking}
                      aria-label="Stop speaking"
                      title="Stop speaking"
                    >
                      <i className="ti ti-player-stop-filled" style={{ fontSize: "13px" }} aria-hidden="true" />
                    </button>
                  )}
                  <button
                    style={{ ...S.askBtn, opacity: input.trim() && !loading ? 1 : 0.6 }}
                    className="send-btn"
                    onClick={() => send()}
                    disabled={loading || !input.trim()}
                  >
                    {loading ? (
                      <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    ) : (
                      "Search"
                    )}
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div style={{ textAlign: "center", fontSize: "10px", color: "#a78bfa", padding: "4px 0 8px", background: "#fff", flexShrink: 0 }}>
                <span style={{ color: "#6d28d9", fontWeight: 800 }}>Made in Sikkim</span>
              </div>
            </div>

            {/* RIGHT: Suggestions panel */}
            {isWide && (
              <aside style={S.suggestPanel}>
                <div style={S.suggestTopSection}>
                  <div style={S.suggestHeaderRow}>
                    <span style={S.suggestHeader}>EXPLORE SIKKIM</span>
                    {/* NOTE: wire this to whatever "expand panel" behavior you want (modal, full-width view, etc.) */}
                    <button style={S.suggestExpandBtn} aria-label="Expand explore panel">
                      <i className="ti ti-arrows-maximize" style={{ fontSize: "14px" }} aria-hidden="true" />
                    </button>
                  </div>
                  <div style={S.filterPillsRow}>
                    {SUGGEST_FILTERS.map(f => (
                      <div
                        key={f.value}
                        style={suggestFilter === f.value ? S.filterPillActive : S.filterPill}
                        onClick={() => setSuggestFilter(f.value)}
                      >
                        {f.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={S.suggestCardsFill}>
                  {suggestions.map((s, i) => (
                    <Link
                      key={i}
                      to={s.url}
                      onClick={() => setOpen(false)}
                      className="suggest-card"
                      style={{ ...S.suggestCard, display: "block", textDecoration: "none" }}
                    >
                      <div
                        key={slideIndexes[i]}
                        className="slide-card-in"
                        style={{ ...S.suggestImage, backgroundImage: s.image ? `url(${s.image})` : "linear-gradient(135deg,#c4b5fd,#7c3aed)" }}
                      >
                        <span style={S.suggestBadge}>
                          <i className="ti ti-sparkles" style={{ fontSize: "11px" }} aria-hidden="true" /> {s.badge}
                        </span>
                        {s.promo && (
                          <span style={S.suggestPromoBadge}>{s.promo}</span>
                        )}
                        <div style={S.suggestScrim}>
                          <p style={S.suggestTitle}>{s.title}</p>
                          <p style={S.suggestSubtitle}>{s.subtitle}{s.price ? ` — ${s.price}` : ""}</p>
                        </div>
                        {/* Section progress — which of the 3 rotating slides this card is on */}
                        <div style={S.suggestDots}>
                          {SLIDE_SETS[i].map((_, dotI) => (
                            <span key={dotI} style={dotI === slideIndexes[i] ? S.dotActive : S.dot} />
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </aside>
            )}
          </div>

          {/* Mobile bottom sheet — same plannerFormNode as the desktop sidebar,
              slid up over the chat instead of living in a side column. */}
          {!isWide && showPlannerMobile && (
            <div
              style={S.sheetOverlay}
              className="sheet-fade-in"
              onClick={() => setShowPlannerMobile(false)}
            >
              <div
                style={S.sheet}
                className="sheet-slide-up"
                onClick={e => e.stopPropagation()}
              >
                <div style={S.sheetHandle} />
                <button
                  style={S.sheetCloseBtn}
                  onClick={() => setShowPlannerMobile(false)}
                  aria-label="Close"
                >
                  <span style={{ fontSize: "18px", lineHeight: 1 }} aria-hidden="true">×</span>
                </button>
                {plannerFormNode}
              </div>
            </div>
          )}

          {/* ─── Voice Mode — full-screen, hands-free conversation ───────────
              Opened via the wave icon next to the mic. No typing here at all:
              speak, hear the reply, it auto-listens again — loops until you
              tap the × to exit. The orb's animation reflects state (idle /
              listening / thinking / speaking) via CSS classes in chatStyles.ts. */}
          {voiceModeOpen && (
            <div style={S.voiceModeOverlay} className="sheet-fade-in">
              <button
                style={S.voiceModeCloseBtn}
                onClick={exitVoiceMode}
                aria-label="Exit Voice Mode"
              >
                <span style={{ fontSize: "20px", lineHeight: 1 }} aria-hidden="true">×</span>
              </button>

              <div
                style={S.voiceOrb}
                className={
                  voice.isSpeaking ? "voice-orb-speaking"
                    : voice.isListening ? "voice-orb-listening"
                    : loading ? "voice-orb-thinking"
                    : "voice-orb-idle"
                }
              />

              <p style={S.voiceModeStatus}>
                {voice.isSpeaking ? "Speaking..." : voice.isListening ? "Listening..." : loading ? "Thinking..." : "Tap the mic to talk"}
              </p>

              {/* Live captions — your own words while listening, the AI's while it's talking. */}
              {voice.isListening && voice.interimTranscript && (
                <p style={S.voiceModeCaption}>{voice.interimTranscript}</p>
              )}
              {voice.isSpeaking && messages[messages.length - 1]?.role === "assistant" && (
                <p style={S.voiceModeCaption}>{messages[messages.length - 1].text}</p>
              )}

              {voice.voiceError && <p style={S.voiceErrorText}>{voice.voiceError}</p>}

              {/* Manual fallback — the auto-loop should normally handle this, but
                  gives a way to retry if e.g. no speech was detected. */}
              {!voice.isListening && !voice.isSpeaking && !loading && (
                <button
                  style={S.voiceModeMicBtn}
                  onClick={() => voice.startListening(transcript => send(transcript, true))}
                  aria-label="Speak"
                >
                  <i className="ti ti-microphone" style={{ fontSize: "26px" }} aria-hidden="true" />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}