// ─── /api/tts.ts ────────────────────────────────────────────────────────
// Server-side proxy for Fish Audio text-to-speech. The browser can't call
// api.fish.audio directly (CORS blocks it — Fish Audio doesn't send back
// Access-Control-Allow-Origin headers). This route runs on Vercel's server,
// so it isn't subject to that browser restriction, and it keeps the Fish
// Audio API key out of client-side code.
//
// Deploy at api/tts.ts in your project ROOT (sibling of chat.ts).
//
// Required env var (Vercel dashboard → Settings → Environment Variables,
// and in your local .env for `vercel dev`):
// FISH_AUDIO_API_KEY — no VITE_ prefix, must stay server-side only.

export const config = {
  runtime: "nodejs",
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, reference_id } = req.body ?? {};
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Missing 'text' in request body" });
  }

  const apiKey = process.env.FISH_AUDIO_API_KEY;
  if (!apiKey) {
    console.error("FISH_AUDIO_API_KEY is not set in the server environment.");
    return res.status(500).json({ error: "Server is not configured with a Fish Audio API key." });
  }

  try {
    const fishRes = await fetch("https://api.fish.audio/v1/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        // Model header per Fish Audio's docs — swap if you're on a paid
        // model instead of the free tier.
        "model": "s2.1-pro-free",
      },
      body: JSON.stringify({
        text,
        // Optional: pass a specific voice's reference_id from the frontend.
        // Falls back to Fish Audio's default voice if omitted.
        ...(reference_id ? { reference_id } : {}),
      }),
    });

    if (!fishRes.ok) {
      const errText = await fishRes.text();
      console.error(`Fish Audio API error ${fishRes.status}: ${errText}`);
      return res.status(fishRes.status).json({ error: "Fish Audio request failed" });
    }

    // Fish Audio returns raw audio bytes on success.
    const audioBuffer = Buffer.from(await fishRes.arrayBuffer());
    res.setHeader("Content-Type", fishRes.headers.get("content-type") || "audio/mpeg");
    return res.status(200).send(audioBuffer);
  } catch (err) {
    console.error("TTS handler error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}