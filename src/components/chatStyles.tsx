import type { CSSProperties } from "react";

// ─── Global CSS + icon font injection ────────────────────────────────────
// Runs once, as a side effect of importing this module (ChatWidget.tsx does
// `import { S } from "./chatStyles"`, which triggers this on first load).

if (!document.getElementById("tabler-icons-font")) {
  const link = document.createElement("link");
  link.id = "tabler-icons-font";
  link.rel = "stylesheet";
  link.href = "https://cdnjs.cloudflare.com/ajax/libs/tabler-icons/2.44.0/iconfont/tabler-icons.min.css";
  document.head.appendChild(link);
}

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
    @keyframes pandaThink {
      0%,100% { transform: translateY(0px) rotate(-3deg); }
      50% { transform: translateY(-5px) rotate(3deg); }
    }
    .panda-think { display: inline-block; animation: pandaThink 1.5s ease-in-out infinite; }

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

    @keyframes slideCardIn {
      from { transform: translateX(100%); }
      to   { transform: translateX(0); }
    }
    .slide-card-in { animation: slideCardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1); }

    @keyframes sheetSlideUp {
      from { transform: translateY(100%); }
      to   { transform: translateY(0); }
    }
    .sheet-slide-up { animation: sheetSlideUp 0.28s cubic-bezier(0.22, 1, 0.36, 1); }

    @keyframes sheetFadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    .sheet-fade-in { animation: sheetFadeIn 0.2s ease-out; }

    @keyframes micPulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.5); }
      50% { box-shadow: 0 0 0 8px rgba(220,38,38,0); }
    }
    .mic-pulse { animation: micPulse 1.2s ease-out infinite; }

    @keyframes orbIdle {
      0%, 100% { transform: scale(1); opacity: 0.9; }
      50% { transform: scale(1.05); opacity: 1; }
    }
    .voice-orb-idle { animation: orbIdle 3.5s ease-in-out infinite; }

    @keyframes orbListening {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.12); }
    }
    .voice-orb-listening { animation: orbListening 0.9s ease-in-out infinite; }

    @keyframes orbThinking {
      0% { transform: rotate(0deg) scale(1); }
      50% { transform: rotate(180deg) scale(0.94); }
      100% { transform: rotate(360deg) scale(1); }
    }
    .voice-orb-thinking { animation: orbThinking 1.6s linear infinite; }

    @keyframes orbSpeaking {
      0%, 100% { transform: scale(1); }
      25% { transform: scale(1.08); }
      50% { transform: scale(0.97); }
      75% { transform: scale(1.1); }
    }
    .voice-orb-speaking { animation: orbSpeaking 0.6s ease-in-out infinite; }

    .speaking-dot { animation: chatDotWave 1.2s infinite ease-in-out; }
    .speaking-dot:nth-child(1) { animation-delay: 0s; }
    .speaking-dot:nth-child(2) { animation-delay: 0.15s; }
    .speaking-dot:nth-child(3) { animation-delay: 0.3s; }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .chat-fab, .chat-fab:hover, .chat-fab:focus, .chat-fab:active, .chat-fab:focus-visible {
      background: none !important; border: none !important; outline: none !important;
      box-shadow: none !important; -webkit-appearance: none !important;
    }
    .chat-input:focus { border-color: #7C3AED !important; background: #fff !important; }
    .send-btn:hover { transform: scale(1.08); }
    .send-btn:active { transform: scale(0.96); }

    .chat-scroll::-webkit-scrollbar { width: 8px; }
    .chat-scroll::-webkit-scrollbar-track { background: transparent; }
    .chat-scroll::-webkit-scrollbar-thumb { background: #ddd6fe; border-radius: 8px; }
    .chat-scroll::-webkit-scrollbar-thumb:hover { background: #c4b5fd; }

    .nav-link-row { transition: background 0.15s, color 0.15s; }
    .nav-link-row:hover { background: #ede9fe !important; color: #6d28d9 !important; }

    .suggest-card { transition: transform 0.15s, box-shadow 0.15s; cursor: pointer; }
    .suggest-card:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(109,40,217,0.15); }
  `;
  document.head.appendChild(s);
}

// Background image shown behind the sidebar (Customize Your Package area)
// only — not the whole page. Swap this URL to change it.
export const APP_BACKGROUND_IMAGE =
  "https://res.cloudinary.com/djsguxriw/image/upload/v1776186727/labun-hang-limboo-5GQXdm557ag-unsplash_syeuxb.jpg";

export const S: Record<string, CSSProperties> = {
  fabWrapper: {
    position: "fixed", bottom: "16px", right: "16px", zIndex: 9999,
    display: "flex", flexDirection: "column", alignItems: "flex-end",
    background: "none", pointerEvents: "none",
  },
  fabImg: {
    width: "100px", height: "100px", objectFit: "contain",
    cursor: "pointer", pointerEvents: "auto", display: "block", background: "transparent",
  },
  fabLabel: {
    background: "linear-gradient(135deg, #4c1d95, #6d28d9)", border: "none",
    borderRadius: "20px", padding: "8px 16px", fontSize: "13px", fontWeight: 800,
    color: "#fff", cursor: "pointer", pointerEvents: "auto" as const,
    whiteSpace: "nowrap" as const, marginBottom: "6px", marginRight: "8px",
    letterSpacing: "0.3px", fontFamily: "'Inter', sans-serif",
    animation: "fabBounce 1.4s ease-in-out infinite, fabGlow 1.4s ease-in-out infinite",
    display: "inline-block",
  },
  panel: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9998,
    width: "100vw", height: "100vh", background: "#fff",
    display: "flex", flexDirection: "column", overflow: "hidden",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  floatingCloseBtn: {
    position: "absolute", top: "16px", right: "16px", zIndex: 20,
    width: "42px", height: "42px", borderRadius: "50%",
    background: "#6d28d9", border: "none", color: "#fff",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 2px 10px rgba(109,40,217,0.35)",
  },
  mobilePlannerBtn: {
    flexShrink: 0, display: "flex", alignItems: "center", gap: "5px",
    background: "#6d28d9", color: "#fff", border: "none",
    borderRadius: "18px", padding: "8px 12px",
    fontSize: "12px", fontWeight: 700, cursor: "pointer",
    boxShadow: "0 2px 10px rgba(109,40,217,0.35)",
  },
  body: { flex: 1, display: "flex", overflow: "hidden" },

  // Left sidebar
  sidebar: {
    width: "320px", flexShrink: 0, order: 1,
    backgroundImage: `linear-gradient(180deg, rgba(246,245,242,0.35), rgba(246,245,242,0.45)), url(${APP_BACKGROUND_IMAGE})`,
    backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
    borderLeft: "none",
    padding: "24px 16px", overflowY: "auto",
    display: "flex", flexDirection: "column", gap: "8px",
  },
  sidebarEyebrow: {
    margin: "0 0 14px 8px", fontSize: "11px", fontWeight: 700,
    letterSpacing: "0.06em", color: "#a394d8", textTransform: "uppercase" as const,
  },
  navList: { display: "flex", flexDirection: "column", gap: "4px" },
  navLink: {
    display: "flex", alignItems: "center", gap: "14px",
    padding: "12px 16px", borderRadius: "12px",
    color: "#78716c", fontSize: "15.5px", fontWeight: 500, textDecoration: "none",
  },
  navLinkActive: {
    display: "flex", alignItems: "center", gap: "14px",
    padding: "12px 16px", borderRadius: "12px",
    color: "#1e1b4b", fontSize: "15.5px", fontWeight: 600, textDecoration: "none",
    background: "#fff", boxShadow: "0 1px 3px rgba(30,27,75,0.1)",
  },
  permitTip: {
    marginTop: "12px", padding: "12px", borderRadius: "12px",
    background: "#fff", border: "0.5px solid #ede9fe",
  },
  permitTipTitle: { margin: "0 0 4px", fontSize: "11px", fontWeight: 700, color: "#6d28d9" },
  permitTipBody: { margin: 0, fontSize: "11.5px", color: "#4c3b99", lineHeight: 1.5, cursor: "pointer" },
  sidebarLogo: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px", padding: "0 4px" },
  sidebarWordmark: {
    fontSize: "26px", fontWeight: 800, letterSpacing: "-0.02em",
    background: "linear-gradient(90deg, #3b6cf6 0%, #7c3aed 100%)",
    WebkitBackgroundClip: "text" as const, backgroundClip: "text" as const,
    WebkitTextFillColor: "transparent" as const, color: "transparent",
  },
  plannerCard: {
    background: "#fff", border: "0.5px solid #ede9fe", borderRadius: "16px",
    padding: "18px", display: "flex", flexDirection: "column", gap: "4px",
  },
  plannerTitle: { margin: 0, fontSize: "15px", fontWeight: 800, color: "#1e1b4b" },
  plannerSubtitle: { margin: "2px 0 12px", fontSize: "11.5px", color: "#8b7bb8", lineHeight: 1.5 },
  plannerLabel: {
    fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.04em",
    textTransform: "uppercase" as const, color: "#6d28d9", marginBottom: "5px", display: "block",
  },
  plannerInput: {
    width: "100%", boxSizing: "border-box" as const,
    padding: "10px 12px", borderRadius: "10px", border: "0.5px solid #ddd6fe",
    fontSize: "13.5px", color: "#1e1b4b", background: "#faf8ff",
    marginBottom: "12px", fontFamily: "'Inter', sans-serif", outline: "none",
  },
  plannerBtn: {
    marginTop: "4px", width: "100%", background: "#6d28d9", color: "#fff",
    border: "none", borderRadius: "12px", padding: "13px 0",
    fontSize: "14px", fontWeight: 700, cursor: "pointer",
    boxShadow: "0 2px 10px rgba(109,40,217,0.3)",
  },
  sidebarLoginBtn: {
    marginTop: "auto", background: "#6d28d9", color: "#fff", border: "none",
    borderRadius: "26px", padding: "16px 12px", fontSize: "14.5px", fontWeight: 700,
    letterSpacing: "0.02em", cursor: "pointer",
    width: "100%", boxSizing: "border-box" as const,
    boxShadow: "0 2px 10px rgba(109,40,217,0.3)",
  },

  // Mobile bottom sheet
  sheetOverlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 30, background: "rgba(30,27,75,0.45)",
    display: "flex", alignItems: "flex-end", justifyContent: "center",
  },
  sheet: {
    width: "100%", maxHeight: "85vh", overflowY: "auto",
    background: "#f6f5f2", borderRadius: "20px 20px 0 0",
    padding: "10px 16px 24px", boxSizing: "border-box" as const, position: "relative",
  },
  sheetHandle: { width: "36px", height: "4px", borderRadius: "2px", background: "#ddd6fe", margin: "4px auto 12px" },
  sheetCloseBtn: {
    position: "absolute", top: "12px", right: "14px",
    width: "30px", height: "30px", borderRadius: "50%",
    background: "#fff", border: "0.5px solid #e7e5df", color: "#57534e",
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  },

  // Center chat column
  centerCol: { flex: 1, minWidth: 0, order: 2, display: "flex", flexDirection: "column", background: "#ffffff" },
  topBar: { padding: "20px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" },
  centerLogo: { display: "flex", alignItems: "center", gap: "8px" },
  centerLogoImg: { width: "70px", height: "70px", objectFit: "contain" },
  centerLogoImgMobile: { width: "36px", height: "36px" },
  centerLogoText: { fontSize: "20px", fontWeight: 800, color: "#1e1b4b", letterSpacing: "-0.01em" },
  scopePill: {
    display: "inline-flex", alignItems: "center", gap: "6px",
    background: "#fff", border: "0.5px solid #e7e5df", borderRadius: "20px",
    padding: "9px 16px", fontSize: "13.5px", fontWeight: 600, color: "#1e1b4b",
    cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },

  messages: { flex: 1, overflowY: "auto", padding: "32px 24px 24px" },
  messagesInner: {
    maxWidth: "720px", width: "100%", margin: "0 auto",
    display: "flex", flexDirection: "column", gap: "22px",
  },
  cardsWrapper: { width: "100%", maxWidth: "min(90%, 900px)" },
  aiLabel: {
    fontSize: "12px", fontWeight: 700, color: "#7c3aed",
    marginBottom: "5px", letterSpacing: "0.3px",
    display: "flex", alignItems: "center", gap: "8px",
  },
  speakingBadge: {
    display: "inline-flex", alignItems: "center", gap: "5px",
    background: "#f1ecfd", color: "#6d28d9",
    fontSize: "10.5px", fontWeight: 700, letterSpacing: "0",
    padding: "3px 9px", borderRadius: "20px",
  },
  speakingDot: { width: "4px", height: "4px", borderRadius: "50%", background: "#6d28d9" },
  userBubble: {
    background: "linear-gradient(135deg, #6d28d9, #4338ca)", color: "#fff",
    padding: "12px 18px", borderRadius: "20px 20px 4px 20px",
    maxWidth: "70%", fontSize: "15px", lineHeight: "1.65",
    boxShadow: "0 2px 8px rgba(109,40,217,0.25)", fontWeight: 400,
    wordBreak: "break-word" as const,
  },
  aiBubble: {
    background: "#fff", color: "#1e1b4b", padding: "14px 18px",
    borderRadius: "4px 20px 20px 20px", width: "100%", maxWidth: "90%",
    boxSizing: "border-box" as const,
    fontSize: "15px", lineHeight: "1.75",
    boxShadow: "0 2px 10px rgba(109,40,217,0.08)",
    border: "1px solid #ddd6fe", fontWeight: 400,
    wordBreak: "break-word" as const,
  },
  introLine: { margin: "0 0 8px" },
  dayBlock: { marginTop: "16px", paddingTop: "14px", borderTop: "1px solid #ede9fe" },
  dayBlockHeader: { margin: "0 0 8px", fontSize: "15px", fontWeight: 700, color: "#6d28d9" },
  dayBlockLine: { margin: "0 0 4px", fontSize: "14.5px", lineHeight: 1.6 },
  dayBlockPhotoGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "8px", marginTop: "10px",
  },
  dayBlockPhoto: { width: "100%", height: "150px", objectFit: "cover", borderRadius: "10px", cursor: "pointer" },
  dayBlockMapWrap: { marginTop: "10px", borderRadius: "12px", overflow: "hidden", border: "1px solid #ede9fe" },
  dayBlockMapFrame: { width: "100%", height: "200px", border: "none", display: "block" },

  // Input row — tightened padding/sizing so everything fits on narrow phone
  // screens (was overflowing below ~360px wide before this pass).
  inputRow: { padding: "12px 12px 16px", borderTop: "1px solid #ede9fe", background: "#fff", flexShrink: 0 },
  voiceErrorText: {
    maxWidth: "720px", width: "100%", margin: "0 auto 10px",
    display: "flex", alignItems: "center", gap: "6px",
    fontSize: "12.5px", color: "#dc2626",
    background: "#fef2f2", border: "0.5px solid #fecaca",
    borderRadius: "10px", padding: "8px 12px",
  },
  inputInner: {
    maxWidth: "720px", width: "100%", margin: "0 auto",
    display: "flex", gap: "8px", alignItems: "center",
  },
  input: {
    // minWidth: 0 is the key fix — flex items refuse to shrink below their
    // natural content width by default, which was silently pushing this
    // input off the edge of the panel on narrow screens.
    flex: 1, minWidth: 0, padding: "12px 14px", borderRadius: "24px",
    border: "0.5px solid #e7e5df", fontSize: "15px",
    outline: "none", fontFamily: "'Inter', sans-serif",
    background: "#fff", color: "#1e1b4b", transition: "border-color 0.2s",
  },
  askBtn: {
    padding: "0 16px", height: "44px", borderRadius: "22px",
    background: "#6d28d9", color: "#fff", border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "13px", fontWeight: 700, flexShrink: 0,
    boxShadow: "0 2px 10px rgba(109,40,217,0.3)",
    transition: "transform 0.15s ease, opacity 0.2s",
  },
  voiceSelect: {
    flexShrink: 0, maxWidth: "110px",
    fontSize: "11px", color: "#6d28d9",
    background: "#f1ecfd", border: "0.5px solid #ddd6fe",
    borderRadius: "14px", padding: "6px 8px",
    cursor: "pointer", outline: "none",
  },
  micBtn: {
    width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
    background: "#f1ecfd", color: "#6d28d9", border: "0.5px solid #ddd6fe",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.15s, color 0.15s",
  },
  micBtnActive: { background: "#dc2626", color: "#fff", border: "none", boxShadow: "0 2px 10px rgba(220,38,38,0.4)" },
  stopSpeakingBtn: {
    width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0,
    background: "#1e1b4b", color: "#fff", border: "none",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
  },

  // Voice Mode — full-screen, hands-free conversation
  voiceModeBtn: {
    width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
    background: "#1e1b4b", color: "#fff", border: "none",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
  },
  voiceModeOverlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 40,
    background: "#fff",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    gap: "18px", padding: "24px",
  },
  voiceModeCloseBtn: {
    position: "absolute", top: "20px", right: "20px",
    width: "38px", height: "38px", borderRadius: "50%",
    background: "#f6f5f2", border: "0.5px solid #e7e5df", color: "#57534e",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
  },
    voiceOrb: {
    width: "160px", height: "160px", borderRadius: "50%",
    background: "linear-gradient(160deg, #6d28d9, #3b6cf6 45%, #a78bfa 80%, #fff)",
    boxShadow: "0 8px 40px rgba(109,40,217,0.35)",
    // Without these, a long spoken caption pushes total content taller than
    // the viewport, and the parent flex column (voiceModeOverlay) shrinks the
    // orb's height to compensate — but not its width, since flex-shrink only
    // acts on the main axis. That squashed a 160px circle into an oval.
    flexShrink: 0,
    aspectRatio: "1 / 1",
  },
  voiceModeStatus: { fontSize: "15px", fontWeight: 600, color: "#1e1b4b", margin: 0 },
   voiceModeCaption: {
    maxWidth: "480px", textAlign: "center" as const,
    fontSize: "14px", color: "#57534e", lineHeight: 1.6, margin: 0,
    // Long AI replies (packages/itineraries) could grow tall enough to force
    // the whole overlay past the viewport, which is what squeezed the orb
    // above. Capping height + letting the caption scroll on its own keeps
    // total content height bounded no matter how long the reply is.
    maxHeight: "30vh",
    overflowY: "auto" as const,
  },
  voiceModeMicBtn: {
    width: "60px", height: "60px", borderRadius: "50%",
    background: "#6d28d9", color: "#fff", border: "none",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 2px 14px rgba(109,40,217,0.4)", marginTop: "8px",
  },

  // Right suggestions panel
  suggestPanel: {
    width: "400px", flexShrink: 0, order: 3,
    background: "#fff", borderLeft: "1px solid #ede9fe",
    padding: "20px 16px", overflow: "hidden",
    display: "flex", flexDirection: "column", height: "100%",
  },
  suggestTopSection: { flexShrink: 0 },
  suggestHeaderRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" },
  suggestHeader: { fontSize: "12px", fontWeight: 800, letterSpacing: "0.6px", color: "#6d28d9" },
  suggestExpandBtn: {
    width: "26px", height: "26px", borderRadius: "50%",
    background: "#fff", border: "0.5px solid #ddd6fe", color: "#6d28d9",
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0,
  },
  filterPillsRow: { display: "flex", gap: "6px", marginBottom: "16px" },
  filterPill: {
    background: "#f1ecfd", color: "#6d28d9", fontSize: "11px", fontWeight: 600,
    padding: "6px 12px", borderRadius: "16px", cursor: "pointer",
  },
  filterPillActive: {
    background: "#6d28d9", color: "#fff", fontSize: "11px", fontWeight: 600,
    padding: "6px 12px", borderRadius: "16px", cursor: "pointer",
  },
  suggestCardsFill: { flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: "16px" },
  suggestCard: {
    flex: 1, minHeight: 0, borderRadius: "16px", overflow: "hidden",
    border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  suggestImage: {
    height: "100%", width: "100%", backgroundSize: "cover", backgroundPosition: "center",
    position: "relative", display: "flex", alignItems: "flex-start", padding: "10px",
  },
  suggestBadge: {
    display: "inline-flex", alignItems: "center", gap: "4px",
    background: "rgba(255,255,255,0.92)", color: "#6d28d9",
    fontSize: "11px", fontWeight: 700, padding: "5px 11px", borderRadius: "20px",
  },
  suggestPromoBadge: {
    position: "absolute", top: "10px", right: "10px",
    width: "76px", height: "76px", borderRadius: "50%",
    background: "#EA580C", color: "#fff",
    fontSize: "9.5px", fontWeight: 700, lineHeight: 1.25,
    display: "flex", alignItems: "center", justifyContent: "center",
    textAlign: "center" as const, padding: "8px",
    transform: "rotate(-6deg)", boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
  },
  suggestScrim: {
    position: "absolute", left: 0, right: 0, bottom: 0,
    padding: "24px 12px 12px",
    background: "linear-gradient(180deg, rgba(30,27,75,0) 0%, rgba(30,27,75,0.75) 100%)",
  },
  suggestTitle: { margin: 0, fontSize: "19px", fontWeight: 700, color: "#fff", lineHeight: 1.3 },
  suggestSubtitle: { margin: "5px 0 0", fontSize: "13.5px", color: "#e0dcfa" },
  suggestDots: { position: "absolute", bottom: "10px", right: "12px", display: "flex", gap: "4px" },
  dot: { width: "5px", height: "5px", borderRadius: "50%", background: "rgba(255,255,255,0.5)" },
  dotActive: { width: "5px", height: "5px", borderRadius: "50%", background: "#fff" },
};