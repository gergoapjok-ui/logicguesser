import { createClient } from "https://esm.sh/@supabase/supabase-js@2.101.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Real-time mode: first correct answer wins the round, both advance together
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

    const { battle_id, round, answer, elapsed } = await req.json();
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: battle } = await adminClient.from("battles").select("*").eq("id", battle_id).single();
    if (!battle || battle.status !== "playing") {
      return new Response(JSON.stringify({ error: "Battle not active" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isCreator = user.id === battle.creator_id;
    const isOpponent = user.id === battle.opponent_id;
    if (!isCreator && !isOpponent) {
      return new Response(JSON.stringify({ error: "Not a participant" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const puzzles = (battle.battle_puzzles as any[]) || [];
    const currentRound = battle.current_round || 1;

    if (round !== currentRound) {
      return new Response(JSON.stringify({ error: "Not the current round", current_round: currentRound }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const puzzle = puzzles[round - 1];
    const correct = answer.trim().toLowerCase() === puzzle.answer.trim().toLowerCase();

    if (!correct) {
      // Wrong answer — penalty but don't advance round
      const penaltyTime = battle.allow_penalties ? (battle.penalty_seconds || 5) : 0;
      const answersKey = isCreator ? "creator_answers" : "opponent_answers";
      const scoreKey = isCreator ? "creator_score" : "opponent_score";
      const currentAnswers = ((battle as any)[answersKey] as any[]) || [];
      const currentScore = (battle as any)[scoreKey] || { correct: 0, penalties: 0, total_time: 0 };

      // Record wrong attempt but don't advance
      const updatedAnswers = [...currentAnswers, { round, correct: false, time: elapsed || 0, penalty: penaltyTime }];
      const newScore = {
        correct: currentScore.correct,
        penalties: currentScore.penalties + penaltyTime,
        total_time: currentScore.total_time + penaltyTime,
      };

      await adminClient.from("battles").update({
        [answersKey]: updatedAnswers,
        [scoreKey]: newScore,
      }).eq("id", battle_id);

      return new Response(JSON.stringify({
        correct: false, penalty: penaltyTime, round_won_by: null, current_round: currentRound, score: newScore,
      }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Correct answer — this player wins the round
    const answersKey = isCreator ? "creator_answers" : "opponent_answers";
    const scoreKey = isCreator ? "creator_score" : "opponent_score";
    const currentAnswers = ((battle as any)[answersKey] as any[]) || [];
    const currentScore = (battle as any)[scoreKey] || { correct: 0, penalties: 0, total_time: 0 };

    const roundElapsed = typeof elapsed === "number" ? elapsed : 0;
    const updatedAnswers = [...currentAnswers, { round, correct: true, time: roundElapsed, penalty: 0, won_round: true }];
    const newScore = {
      correct: currentScore.correct + 1,
      penalties: currentScore.penalties,
      total_time: currentScore.total_time + roundElapsed,
    };

    const updateData: any = {
      [answersKey]: updatedAnswers,
      [scoreKey]: newScore,
    };

    // Advance to next round or finish
    const nextRound = currentRound + 1;
    if (nextRound > puzzles.length) {
      // Battle finished
      const creatorFinalScore = isCreator ? newScore : (battle.creator_score as any);
      const opponentFinalScore = isOpponent ? newScore : (battle.opponent_score as any);

      const winnerId = (creatorFinalScore?.correct ?? 0) >= (opponentFinalScore?.correct ?? 0)
        ? battle.creator_id : battle.opponent_id;

      updateData.status = "finished";
      updateData.finished_at = new Date().toISOString();
      updateData.winner_id = winnerId;
      updateData.current_round = currentRound;
    } else {
      updateData.current_round = nextRound;
    }

    await adminClient.from("battles").update(updateData).eq("id", battle_id);

    return new Response(JSON.stringify({
      correct: true,
      round_won_by: user.id,
      current_round: updateData.current_round || currentRound,
      battle_finished: !!updateData.status && updateData.status === "finished",
      winner_id: updateData.winner_id || null,
      score: newScore,
    }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("battle-answer-realtime error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
