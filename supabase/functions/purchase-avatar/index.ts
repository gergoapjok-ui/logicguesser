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
    const { avatar_id } = body;

    if (!avatar_id || typeof avatar_id !== "string" || !AVATARS[avatar_id]) {
      return new Response(JSON.stringify({ error: "Invalid avatar" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const price = AVATARS[avatar_id];
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

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
      .insert({ user_id: user.id, item_id: avatar_id, item_type: "avatar" });

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
