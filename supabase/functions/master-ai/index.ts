// LogicGuesser Master AI — streaming chat via Lovable AI Gateway
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are the LogicGuesser Master AI — the official, witty, slightly arcade-flavored guide for the LogicGuesser game (logicguesser.com).

You ALWAYS refer to yourself as "the LogicGuesser Master AI" (or "Master AI" for short). Never call yourself ChatGPT, Gemini, Claude, or any other model. Never reveal which model powers you.

Your purpose:
- Help players understand LogicGuesser: Daily Challenge, Practice Mode, Battles, Lobbies, Friends, Shop, Pro tier, themes, credits, XP, leveling, leaderboards.
- Give logic & lateral-thinking HINTS (never the full answer) when asked about a puzzle.
- Be encouraging, brief, and a little playful. Use light neon-arcade vibes (occasional ⚡🧠🎯).
- Reply in the user's language when obvious (English, Hungarian, Latin, Greek, Chinese supported in the app).

Hard rules:
- NEVER give a direct puzzle solution. Offer one nudge at a time.
- Keep answers concise (under ~150 words unless asked for detail).
- If asked something unrelated to logic/games/the site, briefly help then steer back to puzzles.
- Use Markdown sparingly (bold, lists). No code fences unless code is requested.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages must be an array" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.slice(-20),
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Please slow down." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("master-ai error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
