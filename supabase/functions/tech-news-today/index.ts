// Daily AI tech news: returns today's post; generates via Lovable AI if missing.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    const date = todayUTC();

    // 1. Try to fetch existing post for today
    const { data: existing } = await supabase
      .from("tech_news_posts")
      .select("*")
      .eq("post_date", date)
      .maybeSingle();

    if (existing) {
      // Also return last 14 days for the archive
      const { data: recent } = await supabase
        .from("tech_news_posts")
        .select("id, post_date, title, summary, tags, image_url, likes")
        .order("post_date", { ascending: false })
        .limit(14);
      return new Response(JSON.stringify({ post: existing, recent: recent ?? [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Generate today's post via Lovable AI (structured output)
    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You are a tech journalist for LogicGuesser, a puzzle/logic gaming site. Write ONE concise daily post about the most notable tech news happening right now (AI, hardware, programming, gaming, web). Be specific, mention real companies/products when possible. Tone: smart, curious, slightly playful. Avoid clickbait.",
          },
          {
            role: "user",
            content: `Today is ${date}. Generate today's tech news post.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "publish_post",
              description: "Publish today's tech news post.",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string", description: "Punchy headline, <80 chars" },
                  summary: { type: "string", description: "1-2 sentence teaser, <200 chars" },
                  content: {
                    type: "string",
                    description:
                      "Full post body in markdown. 3-5 short paragraphs. Use bold for key names. No images.",
                  },
                  tags: {
                    type: "array",
                    items: { type: "string" },
                    description: "2-5 lowercase tags like 'ai', 'gpu', 'web'",
                  },
                },
                required: ["title", "summary", "content", "tags"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "publish_post" } },
      }),
    });

    if (!aiRes.ok) {
      const txt = await aiRes.text();
      console.error("AI error", aiRes.status, txt);
      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, try later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiRes.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiRes.json();
    const toolCall = aiJson.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "No structured output" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const args = JSON.parse(toolCall.function.arguments);

    // 2b. Generate a hero image (best-effort, non-fatal)
    let imageUrl: string | null = null;
    let imageAlt: string | null = null;
    try {
      const imgPrompt = `Editorial hero illustration for a tech news article titled "${args.title}". Theme: ${(args.tags ?? []).join(", ")}. Style: futuristic neon-arcade, glowing cyan and magenta accents, dark background, minimalist, high contrast, no text, cinematic.`;
      const imgRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages: [{ role: "user", content: imgPrompt }],
          modalities: ["image", "text"],
        }),
      });
      if (imgRes.ok) {
        const imgJson = await imgRes.json();
        const b64 = imgJson.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        if (b64) {
          imageUrl = b64; // already a data URL like data:image/png;base64,...
          imageAlt = args.title;
        }
      } else {
        console.warn("image gen failed", imgRes.status, await imgRes.text());
      }
    } catch (err) {
      console.warn("image gen exception", err);
    }

    // 3. Insert (race-safe via unique post_date)
    const { data: inserted, error: insErr } = await supabase
      .from("tech_news_posts")
      .insert({
        post_date: date,
        title: args.title,
        summary: args.summary,
        content: args.content,
        tags: args.tags ?? [],
        image_url: imageUrl,
        image_alt: imageAlt,
      })
      .select()
      .single();

    let post = inserted;
    if (insErr) {
      // Likely a race — fetch the row that won.
      const { data: again } = await supabase
        .from("tech_news_posts")
        .select("*")
        .eq("post_date", date)
        .maybeSingle();
      post = again;
    }

    const { data: recent } = await supabase
      .from("tech_news_posts")
      .select("id, post_date, title, summary, tags, image_url, likes")
      .order("post_date", { ascending: false })
      .limit(14);

    return new Response(JSON.stringify({ post, recent: recent ?? [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("tech-news-today error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
