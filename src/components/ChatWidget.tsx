import { useState, useRef, useEffect } from "react";
import { Mic, AudioLines, Download } from "lucide-react";
import HotelCards from "./HotelCards";
import BikeCards from "./Bikecards";
import PackageCards from "./Packagecards";
import ActivityCards from "./Activitycards";
import CabCards from "./CabCards";
import PackageShowcase from "./PackageShowcase";
import { S } from "./chatStyles";
import {
  type Message,
  getTime,
  handleMessage,
  splitIntoDayBlocks,
  downloadItineraryPDF,
  useVoice,
  GOOGLE_MAPS_API_KEY,
  PLANNER_TYPES,
  PLANNER_MONTHS,
  PLANNER_NATIONALITIES,
} from "./chatLogic";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [isWide, setIsWide] = useState(typeof window !== "undefined" ? window.innerWidth >= 1024 : true);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Namaste! I'm Guide AI, your Sikkim travel expert! Ask me anything — hotels, treks, permits, food, cabs, or the best places to visit!", time: getTime() },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setFreeMessagesUsed] = useState(0);
  const [plannerMonth, setPlannerMonth] = useState("");
  const [plannerNationality, setPlannerNationality] = useState("");
  const [plannerDays, setPlannerDays] = useState("");
  const [plannerType, setPlannerType] = useState("");
  const [plannerPeople, setPlannerPeople] = useState("");
  const [showPlannerMobile, setShowPlannerMobile] = useState(false);
  const [voiceModeOpen, setVoiceModeOpen] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (!voiceModeOpen) return;
    if (voice.isSpeaking || voice.isListening || loading) return;
    const t = setTimeout(() => voice.startListening(transcript => send(transcript, true)), 500);
    return () => clearTimeout(t);
  }, [voiceModeOpen, voice.isSpeaking, voice.isListening, loading]);

  const exitVoiceMode = () => {
    voice.cleanup();
    setVoiceModeOpen(false);
  };

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
    if (!open) { voice.cleanup(); setVoiceModeOpen(false); }
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

  const handleGenerateItinerary = () => {
    if (!plannerDays.trim() || !plannerPeople.trim() || !plannerType || loading) return;
    let msg = `Customize a package for Sikkim: ${plannerDays.trim()} days`;
    if (plannerMonth) msg += `, traveling in ${plannerMonth}`;
    if (plannerType) msg += `, ${plannerType.toLowerCase()} style`;
    if (plannerPeople.trim()) msg += `, for ${plannerPeople.trim()} ${parseInt(plannerPeople.trim(), 10) === 1 ? "person" : "people"}`;
    msg += ".";
    if (plannerNationality) {
      msg += ` I'm a ${plannerNationality === "Indian" ? "domestic Indian" : "foreign"} traveler`;
      msg += plannerNationality === "Indian"
        ? " — let me know which permits (like Inner Line Permit) I'll need."
        : " — let me know which areas need a Protected Area Permit and which are off-limits to foreign nationals (e.g. Nathula Pass).";
    }
    msg += " Include hotel, transport and day-wise plan in the package.";
    setShowPlannerMobile(false);
    send(msg);
  };

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

      <label style={S.plannerLabel}>Number of Travelers</label>
      <input
        style={S.plannerInput}
        placeholder="e.g. 2"
        inputMode="numeric"
        value={plannerPeople}
        onChange={e => setPlannerPeople(e.target.value.replace(/[^0-9]/g, ""))}
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
        style={{ ...S.plannerBtn, opacity: plannerDays.trim() && plannerPeople.trim() && plannerType && !loading ? 1 : 0.6 }}
        onClick={handleGenerateItinerary}
        disabled={!plannerDays.trim() || !plannerPeople.trim() || !plannerType || loading}
      >
        Customize My Package
      </button>
    </div>
  );

  return (
    <>
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
        <div style={S.panel} className="chat-panel-in">

          <button style={S.floatingCloseBtn} onClick={() => setOpen(false)} aria-label="Close chat">
            <span style={{ fontSize: "22px", lineHeight: 1, fontWeight: 400 }} aria-hidden="true">×</span>
          </button>

          <div style={S.body}>

            {isWide && (
              <aside style={S.sidebar}>
                <div style={S.sidebarLogo}>
                  <span style={S.sidebarWordmark}></span>
                </div>

                {plannerFormNode}
              </aside>
            )}

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

                        {msg.role === "assistant" && dayParsed && (
                          <button
                            onClick={() => downloadItineraryPDF(msg)}
                            aria-label="Download itinerary as PDF"
                            title="Download itinerary as PDF"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              marginTop: "8px",
                              marginLeft: "4px",
                              padding: "6px 14px",
                              borderRadius: "999px",
                              border: "1px solid #c4b5fd",
                              background: "#fff",
                              color: "#6d28d9",
                              fontSize: "12px",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            <Download size={13} aria-hidden="true" /> Download PDF
                          </button>
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

              <div style={S.inputRow}>
                {voice.voiceError && (
                  <p style={S.voiceErrorText}>
                    <i className="ti ti-alert-circle" style={{ fontSize: "13px" }} aria-hidden="true" /> {voice.voiceError}
                  </p>
                )}
                <div style={S.inputInner}>
                  {voice.availableVoices.length > 0 && (
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
                      <Mic size={17} aria-hidden="true" />
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
                      <AudioLines size={18} aria-hidden="true" />
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

              <div style={{ textAlign: "center", fontSize: "10px", color: "#a78bfa", padding: "4px 0 8px", background: "#fff", flexShrink: 0 }}>
                <span style={{ color: "#6d28d9", fontWeight: 800 }}>Made in Sikkim</span>
              </div>
            </div>

            {isWide && <PackageShowcase onClose={() => setOpen(false)} />}
          </div>

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

              {voice.isListening && voice.interimTranscript && (
                <p style={S.voiceModeCaption}>{voice.interimTranscript}</p>
              )}
              {voice.isSpeaking && messages[messages.length - 1]?.role === "assistant" && (
                <p style={S.voiceModeCaption}>{messages[messages.length - 1].text}</p>
              )}

              {voice.voiceError && <p style={S.voiceErrorText}>{voice.voiceError}</p>}

              {!voice.isListening && !voice.isSpeaking && !loading && (
                <button
                  style={S.voiceModeMicBtn}
                  onClick={() => voice.startListening(transcript => send(transcript, true))}
                  aria-label="Speak"
                >
                  <Mic size={26} aria-hidden="true" />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}