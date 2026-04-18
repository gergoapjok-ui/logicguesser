import { createClient } from "https://esm.sh/@supabase/supabase-js@2.101.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AVATARS: Record<string, { price: number; proOnly: boolean }> = {
  avatar_cyber_skull: { price: 500, proOnly: false },
  avatar_neon_cat: { price: 300, proOnly: false },
  avatar_glitch_bot: { price: 750, proOnly: false },
  avatar_plasma_fox: { price: 400, proOnly: false },
  avatar_quantum_owl: { price: 600, proOnly: false },
  avatar_void_wolf: { price: 1000, proOnly: false },
  avatar_pixel_dragon: { price: 1200, proOnly: false },
  avatar_star_panda: { price: 350, proOnly: false },
  avatar_diamond_phoenix: { price: 200, proOnly: true },
  avatar_golden_unicorn: { price: 200, proOnly: true },
  avatar_crystal_lion: { price: 200, proOnly: true },
  avatar_royal_eagle: { price: 200, proOnly: true },
};

const THEMES: Record<string, { price: number; proOnly: boolean }> = {
  theme_mint: { price: 500, proOnly: false },
  theme_lavender: { price: 500, proOnly: false },
  theme_coral: { price: 500, proOnly: false },
  theme_slate: { price: 500, proOnly: false },
  theme_cyberpunk: { price: 5000, proOnly: false },
  theme_ocean: { price: 5000, proOnly: false },
  theme_sunset: { price: 8000, proOnly: false },
  theme_arctic: { price: 8000, proOnly: false },
  theme_sakura: { price: 12000, proOnly: false },
  theme_royal: { price: 15000, proOnly: true },
  theme_blood_moon: { price: 15000, proOnly: true },
  theme_toxic: { price: 18000, proOnly: true },
  theme_hacker: { price: 20000, proOnly: false },
  theme_golden_hour: { price: 20000, proOnly: true },
  theme_galaxy: { price: 25000, proOnly: true },
};

const BADGES: Record<string, { price: number; proOnly: boolean }> = {
  badge_puzzle_master: { price: 800, proOnly: false },
  badge_speed_demon: { price: 600, proOnly: false },
  badge_brain_surgeon: { price: 1000, proOnly: false },
  badge_night_owl: { price: 500, proOnly: false },
  badge_fire_starter: { price: 400, proOnly: false },
  badge_legend: { price: 2000, proOnly: true },
  badge_shadow: { price: 1500, proOnly: true },
  badge_diamond: { price: 1800, proOnly: true },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await anonClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { avatar_id, item_type } = body;
    const isTheme = item_type === "theme";
    const isBadge = item_type === "badge";
    const catalog = isTheme ? THEMES : isBadge ? BADGES : AVATARS;

    if (!avatar_id || typeof avatar_id !== "string" || !catalog[avatar_id]) {
      return new Response(JSON.stringify({ error: isTheme ? "Invalid theme" : "Invalid avatar" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const itemInfo = catalog[avatar_id];
    const price = itemInfo.price;
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check pro requirement
    if (itemInfo.proOnly) {
      const { data: profCheck } = await adminClient.from("profiles").select("is_pro").eq("user_id", user.id).single();
      if (!profCheck?.is_pro) {
        return new Response(JSON.stringify({ error: "Pro membership required" }), {
          status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Check if already owned
    const { data: existing } = await adminClient
      .from("user_inventory")
      .select("id")
      .eq("user_id", user.id)
      .eq("item_id", avatar_id)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ error: "Already owned" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get current credits
    const { data: prof } = await adminClient
      .from("profiles")
      .select("credits")
      .eq("user_id", user.id)
      .single();

    if (!prof || prof.credits < price) {
      return new Response(JSON.stringify({ error: "Not enough credits" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Deduct credits
    await adminClient
      .from("profiles")
      .update({ credits: prof.credits - price })
      .eq("user_id", user.id);

    // Add to inventory
    const { error: invErr } = await adminClient
      .from("user_inventory")
      .insert({ user_id: user.id, item_id: avatar_id, item_type: isTheme ? "theme" : isBadge ? "badge" : "avatar" });

    if (invErr) {
      // Rollback
      await adminClient.from("profiles").update({ credits: prof.credits }).eq("user_id", user.id);
      return new Response(JSON.stringify({ error: "Purchase failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ success: true, new_credits: prof.credits - price }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("purchase-avatar error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
