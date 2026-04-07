import { createClient } from "https://esm.sh/@supabase/supabase-js@2.101.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
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
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check pro status
    const { data: profile } = await adminClient.from("profiles").select("is_pro").eq("user_id", user.id).single();
    if (!profile?.is_pro) {
      return new Response(JSON.stringify({ error: "Pro membership required to create lobbies" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check daily creation limit (3/day for pro)
    const today = new Date().toISOString().split("T")[0];
    const { data: usage } = await adminClient.from("lobby_daily_usage")
      .select("*").eq("user_id", user.id).eq("usage_date", today).maybeSingle();

    if (usage && usage.lobbies_created >= 3) {
      return new Response(JSON.stringify({ error: "Daily lobby creation limit reached (3/day)" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { name, max_players, game_mode, rounds, max_time_seconds, point_system, allow_penalties, penalty_seconds } = body;

    // Create lobby
    const { data: lobby, error: lobbyErr } = await adminClient.from("lobbies").insert({
      creator_id: user.id,
      name: (name || "Battle Lobby").slice(0, 50),
      max_players: Math.min(Math.max(2, max_players || 10), 10),
      game_mode: game_mode || "standard",
      rounds: Math.min(Math.max(1, rounds || 5), 20),
      max_time_seconds: Math.min(Math.max(30, max_time_seconds || 300), 600),
      point_system: point_system || "speed",
      allow_penalties: allow_penalties !== false,
      penalty_seconds: Math.min(Math.max(1, penalty_seconds || 5), 30),
    }).select().single();

    if (lobbyErr || !lobby) {
      return new Response(JSON.stringify({ error: "Failed to create lobby" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Add creator as participant
    await adminClient.from("lobby_participants").insert({ lobby_id: lobby.id, user_id: user.id });

    // Update daily usage
    if (usage) {
      await adminClient.from("lobby_daily_usage").update({ lobbies_created: usage.lobbies_created + 1 }).eq("id", usage.id);
    } else {
      await adminClient.from("lobby_daily_usage").insert({ user_id: user.id, usage_date: today, lobbies_created: 1, lobbies_joined: 0 });
    }

    return new Response(JSON.stringify({ success: true, lobby_id: lobby.id }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("lobby-create error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
