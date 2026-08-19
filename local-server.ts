// ─── local-server.ts ────────────────────────────────────────────────────
// Local stand-in for api/chat.ts and api/tts.ts, used only during development.
// Written in TypeScript (not .cjs) so it can import the SAME real data files
// as production via aiTools.ts — no more duplicated/mirrored data for local
// testing.
//
// Setup (one-time):
//   npm install express cors dotenv
//   npm install -D tsx
//
// Run (separate terminal, alongside `npm run dev`):
//   npx tsx local-server.ts

import express from "express";
import cors from "cors";
import "dotenv/config";
// @ts-ignore — chatPrompt.cjs is plain CommonJS with no type declarations; fine, works at runtime.
import { buildSystemPrompt } from "./chatPrompt.cjs";
import { TOOLS, executeTool, detectPlaceInMessage } from "./aiTools.js";

// NOTE: tsx (which runs this file) strips TypeScript types and runs the code
// directly — it does NOT type-check. So even if VS Code shows red squiggly
// lines here (e.g. about missing @types/express, @types/node if those aren't
// installed), the server will still run fine with `npx tsx local-server.ts`.
// Those are IDE-only warnings, not runtime errors.

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

async function callOpenAI(apiKey: string, messages: any[]) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      tools: TOOLS,
      temperature: 0.7,
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${errText}`);
  }
  return res.json();
}

app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body ?? {};
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Missing 'message' in request body" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY is not set — check your .env file.");
    return res.status(500).json({ error: "Server is not configured with an OpenAI API key." });
  }

  try {
    const messages: any[] = [
      { role: "system", content: buildSystemPrompt() },
      ...(Array.isArray(history) ? history : []),
      { role: "user", content: message },
    ];

    // Deterministic code-level backstop for the searchPackages location bug:
    // the system prompt rule alone proved unreliable (verified — the AI kept
    // ignoring it and guessing days/type instead, across multiple phrasings).
    // If a known Sikkim place name is detected in THIS message, inject a
    // short, freshly-positioned reminder as the LAST message before the AI's
    // turn — much higher attention than a rule buried in a ~23K-character
    // system prompt. Plain string matching, so it works regardless of how
    // well the AI is following prompt instructions.
    const detectedPlace = detectPlaceInMessage(message);
    if (detectedPlace) {
      messages.push({
        role: "system",
        content: `Reminder: this message mentions "${detectedPlace}". If you call searchPackages, you MUST include location: "${detectedPlace}" in the function arguments. Do NOT omit location, and do NOT substitute guessed days/type values instead — that is a hard requirement for this specific message.`,
      });
    }

    let data = await callOpenAI(apiKey, messages);
    let choice = data?.choices?.[0];

    let rounds = 0;
    while (choice?.finish_reason === "tool_calls" && rounds < 4) {
      rounds++;
      messages.push(choice.message);

      for (const toolCall of choice.message.tool_calls ?? []) {
        let args = {};
        try {
          args = JSON.parse(toolCall.function.arguments || "{}");
        } catch { /* malformed args — executeTool handles gracefully */ }
        const result = executeTool(toolCall.function.name, args);
        console.log(`🔧 Tool called: ${toolCall.function.name}(${JSON.stringify(args)}) →`, result);
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }

      data = await callOpenAI(apiKey, messages);
      choice = data?.choices?.[0];
    }

    const reply = choice?.message?.content ?? "";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Chat handler error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ─── /api/tts ──────────────────────────────────────────────────────────
// Local stand-in for api/tts.ts. Proxies Fish Audio server-side so the
// browser never calls api.fish.audio directly (that call gets blocked by
// CORS, since Fish Audio doesn't send back Access-Control-Allow-Origin).
app.post("/api/tts", async (req, res) => {
  const { text, reference_id } = req.body ?? {};
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Missing 'text' in request body" });
  }

  const apiKey = process.env.FISH_AUDIO_API_KEY;
  if (!apiKey) {
    console.error("FISH_AUDIO_API_KEY is not set — check your .env file.");
    return res.status(500).json({ error: "Server is not configured with a Fish Audio API key." });
  }

  try {
    const fishRes = await fetch("https://api.fish.audio/v1/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "model": "s2.1-pro-free", // free through Aug 31, 2026 — switch to "s2.1-pro" after that
      },
      body: JSON.stringify({
        text,
        ...(reference_id ? { reference_id } : {}),
        format: "mp3",
      }),
    });

    if (!fishRes.ok) {
      const errText = await fishRes.text();
      console.error(`Fish Audio API error ${fishRes.status}: ${errText}`);
      return res.status(fishRes.status).json({ error: "Fish Audio request failed" });
    }

    const audioBuffer = Buffer.from(await fishRes.arrayBuffer());
    res.setHeader("Content-Type", fishRes.headers.get("content-type") || "audio/mpeg");
    return res.status(200).send(audioBuffer);
  } catch (err) {
    console.error("TTS handler error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Local chat API running at http://localhost:${PORT}/api/chat`);
  console.log(`✅ Local TTS API running at  http://localhost:${PORT}/api/tts`);
  console.log(`   Keep this running alongside "npm run dev" in a separate terminal.`);
});