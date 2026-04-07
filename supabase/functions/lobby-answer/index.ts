import { createClient } from "https://esm.sh/@supabase/supabase-js@2.101.1";
import { isAnswerCorrect } from "../_shared/fuzzyMatch.ts";

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

    const { lobby_id, round, answer, elapsed } = await req.json();
    if (!lobby_id || typeof round !== "number" || typeof answer !== "string") {
      return new Response(JSON.stringify({ error: "Invalid params" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: lobby } = await adminClient.from("lobbies").select("*").eq("id", lobby_id).single();
    if (!lobby || lobby.status !== "playing") {
      return new Response(JSON.stringify({ error: "Lobby not active" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const puzzles = (lobby.lobby_puzzles as any[]) || [];
    if (round < 1 || round > puzzles.length) {
      return new Response(JSON.stringify({ error: "Invalid round" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: participant } = await adminClient.from("lobby_participants")
      .select("*").eq("lobby_id", lobby_id).eq("user_id", user.id).single();

    if (!participant) {
      return new Response(JSON.stringify({ error: "Not in lobby" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const puzzle = puzzles[round - 1];
    const correct = isAnswerCorrect(answer, puzzle.answer);
    const penaltyTime = !correct && lobby.allow_penalties ? (lobby.penalty_seconds || 5) : 0;

    const currentAnswers = (participant.answers as any[]) || [];
    const currentScore = (participant.score as any) || { correct: 0, penalties: 0, total_time: 0 };

    if (currentAnswers.some((a: any) => a.round === round)) {
      return new Response(JSON.stringify({ error: "Round already answered", correct }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const roundElapsed = typeof elapsed === "number" ? elapsed : 0;
    const updatedAnswers = [...currentAnswers, { round, correct, time: roundElapsed, penalty: penaltyTime }];
    const newScore = {
      correct: currentScore.correct + (correct ? 1 : 0),
      penalties: currentScore.penalties + penaltyTime,
      total_time: currentScore.total_time + roundElapsed + penaltyTime,
    };

    const playerDone = updatedAnswers.length >= puzzles.length;

    await adminClient.from("lobby_participants").update({
      answers: updatedAnswers,
      score: newScore,
      finished: playerDone,
    }).eq("id", participant.id);

    // Check if ALL participants are done
    let lobbyFinished = false;
    if (playerDone) {
      const { data: allParticipants } = await adminClient.from("lobby_participants")
        .select("finished, user_id, score").eq("lobby_id", lobby_id);

      const allDone = allParticipants?.every(p =>
        p.user_id === user.id ? true : p.finished
      );

      if (allDone && allParticipants) {
        lobbyFinished = true;
        await adminClient.from("lobbies").update({
          status: "finished",
          finished_at: new Date().toISOString(),
        }).eq("id", lobby_id);
      }
    }

    return new Response(JSON.stringify({
      correct,
      penalty: penaltyTime,
      player_done: playerDone,
      lobby_finished: lobbyFinished,
      score: newScore,
    }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("lobby-answer error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
