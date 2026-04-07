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

    const { lobby_id } = await req.json();
    if (!lobby_id) {
      return new Response(JSON.stringify({ error: "lobby_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check daily join limit
    const { data: profile } = await adminClient.from("profiles").select("is_pro").eq("user_id", user.id).single();
    const isPro = profile?.is_pro ?? false;
    const dailyLimit = isPro ? 10 : 3;

    const today = new Date().toISOString().split("T")[0];
    const { data: usage } = await adminClient.from("lobby_daily_usage")
      .select("*").eq("user_id", user.id).eq("usage_date", today).maybeSingle();

    if (usage && usage.lobbies_joined >= dailyLimit) {
      return new Response(JSON.stringify({ error: `Daily join limit reached (${dailyLimit}/day)` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check lobby
    const { data: lobby } = await adminClient.from("lobbies").select("*").eq("id", lobby_id).single();
    if (!lobby || lobby.status !== "waiting") {
      return new Response(JSON.stringify({ error: "Lobby not available" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check current participants
    const { data: participants } = await adminClient.from("lobby_participants").select("user_id").eq("lobby_id", lobby_id);
    if (participants && participants.length >= lobby.max_players) {
      return new Response(JSON.stringify({ error: "Lobby is full" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (participants?.some(p => p.user_id === user.id)) {
      return new Response(JSON.stringify({ error: "Already in lobby" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Join
    await adminClient.from("lobby_participants").insert({ lobby_id, user_id: user.id });

    // Update daily usage
    if (usage) {
      await adminClient.from("lobby_daily_usage").update({ lobbies_joined: usage.lobbies_joined + 1 }).eq("id", usage.id);
    } else {
      await adminClient.from("lobby_daily_usage").insert({ user_id: user.id, usage_date: today, lobbies_created: 0, lobbies_joined: 1 });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("lobby-join error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
