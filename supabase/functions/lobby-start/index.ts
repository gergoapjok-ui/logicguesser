import { createClient } from "https://esm.sh/@supabase/supabase-js@2.101.1";
import { generateServerPuzzle } from "../_shared/puzzleGenerator.ts";

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
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: lobby } = await adminClient.from("lobbies").select("*").eq("id", lobby_id).single();
    if (!lobby) {
      return new Response(JSON.stringify({ error: "Lobby not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (lobby.creator_id !== user.id) {
      return new Response(JSON.stringify({ error: "Only the creator can start" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (lobby.status !== "waiting") {
      return new Response(JSON.stringify({ error: "Lobby already started" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate puzzles
    const rounds = lobby.rounds || 5;
    const puzzles = Array.from({ length: rounds }, () => generateServerPuzzle());

    await adminClient.from("lobbies").update({
      status: "playing",
      started_at: new Date().toISOString(),
      lobby_puzzles: puzzles.map(p => ({ question: p.question, answer: p.answer })),
    }).eq("id", lobby_id);

    const clientPuzzles = puzzles.map((p, i) => ({ round: i + 1, question: p.question }));

    return new Response(JSON.stringify({ success: true, puzzles: clientPuzzles, rounds }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("lobby-start error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
