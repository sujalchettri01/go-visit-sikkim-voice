// ─── /api/chat.ts ─────────────────────────────────────────────────────────
// Replaces Lamatic AI, now with real function/tool calling: the AI can call
// getCabPrice / searchHotels / searchPackages to fetch your ACTUAL data
// instead of relying only on facts stuffed into the prompt. See aiTools.ts
// for the tool definitions and execution logic.
//
// Deploy at api/chat.ts in your project ROOT (sibling of src/, NOT inside it).
//
// Required env var (Vercel dashboard → Settings → Environment Variables):
// OPENAI_API_KEY — no VITE_ prefix, must stay server-side only.

/// <reference types="node" />
// @ts-ignore — chatPrompt.cjs is plain CommonJS with no type declarations;
// this is fine, require()/import still works correctly at runtime.
import { buildSystemPrompt } from "../chatPrompt.cjs";
import { TOOLS, executeTool, detectPlaceInMessage } from "../aiTools.js";

export const config = {
  runtime: "nodejs",
};

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

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, history } = req.body ?? {};
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Missing 'message' in request body" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY is not set in the server environment.");
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

    // Tool-calling loop: if the model wants to call a function, run it against
    // real data, feed the result back, and ask again — repeat until the model
    // is done calling tools and gives a final text answer. Capped at 4 rounds
    // so a misbehaving loop can't run away with your OpenAI bill.
    let rounds = 0;
    while (choice?.finish_reason === "tool_calls" && rounds < 4) {
      rounds++;
      messages.push(choice.message);

      for (const toolCall of choice.message.tool_calls ?? []) {
        let args = {};
        try {
          args = JSON.parse(toolCall.function.arguments || "{}");
        } catch {
          // malformed arguments from the model — treat as empty, executeTool
          // will return a "not found" style result rather than crashing
        }
        const result = executeTool(toolCall.function.name, args);
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
}