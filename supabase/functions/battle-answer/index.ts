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

    const { battle_id, round, answer, elapsed } = await req.json();
    if (!battle_id || typeof round !== "number" || typeof answer !== "string") {
      return new Response(JSON.stringify({ error: "Invalid params" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Re-fetch battle to get latest state (prevents race conditions)
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
    if (round < 1 || round > puzzles.length) {
      return new Response(JSON.stringify({ error: "Invalid round" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const puzzle = puzzles[round - 1];
    const correct = isAnswerCorrect(answer, puzzle.answer);
    const penaltyTime = !correct && battle.allow_penalties ? (battle.penalty_seconds || 5) : 0;

    const answersKey = isCreator ? "creator_answers" : "opponent_answers";
    const scoreKey = isCreator ? "creator_score" : "opponent_score";
    const timeKey = isCreator ? "creator_time" : "opponent_time";

    const currentAnswers = ((battle as any)[answersKey] as any[]) || [];
    const currentScore = (battle as any)[scoreKey] || { correct: 0, penalties: 0, total_time: 0 };

    // Wrong answer: just return penalty, don't record
    if (!correct) {
      // Update penalty in score without recording round answer
      const newScore = {
        correct: currentScore.correct,
        penalties: currentScore.penalties + penaltyTime,
        total_time: currentScore.total_time + penaltyTime,
      };
      await adminClient.from("battles").update({
        [scoreKey]: newScore,
      }).eq("id", battle_id);

      return new Response(JSON.stringify({
        correct: false,
        penalty: penaltyTime,
        player_done: false,
        battle_finished: false,
        score: newScore,
        winner_id: null,
      }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Correct answer: check if already answered this round
    if (currentAnswers.some((a: any) => a.round === round && a.correct)) {
      return new Response(JSON.stringify({ error: "Round already answered", correct: true }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const roundElapsed = typeof elapsed === "number" ? elapsed : 0;
    const updatedAnswers = [...currentAnswers.filter((a: any) => a.round !== round), { round, correct: true, time: roundElapsed, penalty: 0 }];
    const newScore = {
      correct: currentScore.correct + 1,
      penalties: currentScore.penalties,
      total_time: currentScore.total_time + roundElapsed,
    };

    const updateData: any = {
      [answersKey]: updatedAnswers,
      [scoreKey]: newScore,
      [timeKey]: newScore.total_time,
    };

    // Check if both players are done
    const otherAnswersKey = isCreator ? "opponent_answers" : "creator_answers";
    const otherAnswers = ((battle as any)[otherAnswersKey] as any[]) || [];
    const correctAnswers = updatedAnswers.filter((a: any) => a.correct);
    const otherCorrectAnswers = otherAnswers.filter((a: any) => a.correct);
    const playerDone = correctAnswers.length >= puzzles.length;
    const otherDone = otherCorrectAnswers.length >= puzzles.length;

    if (playerDone && otherDone) {
      const creatorFinalScore = isCreator ? newScore : (battle.creator_score as any);
      const opponentFinalScore = isOpponent ? newScore : (battle.opponent_score as any);

      let winnerId = null;
      if (battle.point_system === "speed") {
        winnerId = creatorFinalScore.total_time <= opponentFinalScore.total_time ? battle.creator_id : battle.opponent_id;
      } else if (battle.point_system === "accuracy") {
        winnerId = creatorFinalScore.correct >= opponentFinalScore.correct ? battle.creator_id : battle.opponent_id;
      } else {
        if (creatorFinalScore.correct !== opponentFinalScore.correct) {
          winnerId = creatorFinalScore.correct > opponentFinalScore.correct ? battle.creator_id : battle.opponent_id;
        } else {
          winnerId = creatorFinalScore.total_time <= opponentFinalScore.total_time ? battle.creator_id : battle.opponent_id;
        }
      }

      updateData.status = "finished";
      updateData.finished_at = new Date().toISOString();
      updateData.winner_id = winnerId;
    }

    await adminClient.from("battles").update(updateData).eq("id", battle_id);

    return new Response(JSON.stringify({
      correct: true,
      penalty: 0,
      player_done: playerDone,
      battle_finished: playerDone && otherDone,
      score: newScore,
      winner_id: updateData.winner_id || null,
    }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("battle-answer error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
