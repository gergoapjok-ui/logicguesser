import { createClient } from "https://esm.sh/@supabase/supabase-js@2.101.1";
import { generateServerPuzzle } from "../_shared/puzzleGenerator.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Real-time battle mode: both players see same question, fastest correct answer wins the round
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

    const { battle_id } = await req.json();
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: battle } = await adminClient.from("battles").select("*").eq("id", battle_id).single();
    if (!battle || battle.status !== "accepted") {
      return new Response(JSON.stringify({ error: "Battle not ready" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (user.id !== battle.creator_id && user.id !== battle.opponent_id) {
      return new Response(JSON.stringify({ error: "Not a participant" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rounds = battle.rounds || 5;
    const puzzles = Array.from({ length: rounds }, () => generateServerPuzzle());

    await adminClient.from("battles").update({
      status: "playing",
      realtime_mode: true,
      started_at: new Date().toISOString(),
      battle_puzzles: puzzles.map(p => ({ question: p.question, answer: p.answer })),
      current_round: 1,
      creator_answers: [],
      opponent_answers: [],
      creator_time: 0,
      opponent_time: 0,
      creator_score: { correct: 0, penalties: 0, total_time: 0 },
      opponent_score: { correct: 0, penalties: 0, total_time: 0 },
    }).eq("id", battle_id);

    const clientPuzzles = puzzles.map((p, i) => ({ round: i + 1, question: p.question }));

    return new Response(JSON.stringify({ success: true, puzzles: clientPuzzles, rounds, realtime: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("battle-start-realtime error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
