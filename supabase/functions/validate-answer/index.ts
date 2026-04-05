import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Authenticate user
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

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await anonClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub as string;

    // Parse and validate input
    const body = await req.json();
    const { puzzle_id, answer, time_taken } = body;

    if (!puzzle_id || typeof puzzle_id !== "string") {
      return new Response(JSON.stringify({ error: "puzzle_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!answer || typeof answer !== "string") {
      return new Response(JSON.stringify({ error: "answer is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (typeof time_taken !== "number" || time_taken < 3) {
      return new Response(JSON.stringify({ error: "Invalid time_taken" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role to access puzzle answer
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get puzzle with answer
    const { data: puzzle, error: puzzleError } = await adminClient
      .from("puzzles")
      .select("id, answer, puzzle_date")
      .eq("id", puzzle_id)
      .single();

    if (puzzleError || !puzzle) {
      return new Response(JSON.stringify({ error: "Puzzle not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify it's today's puzzle
    const today = new Date().toISOString().split("T")[0];
    if (puzzle.puzzle_date !== today) {
      return new Response(JSON.stringify({ error: "This puzzle is not available today" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check answer
    const correct = answer.trim().toLowerCase() === puzzle.answer.trim().toLowerCase();

    if (!correct) {
      return new Response(JSON.stringify({ correct: false }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if already completed
    const { data: existing } = await adminClient
      .from("leaderboard")
      .select("id")
      .eq("user_id", userId)
      .eq("puzzle_id", puzzle_id)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ correct: true, already_completed: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert leaderboard entry server-side
    const { error: insertError } = await adminClient.from("leaderboard").insert({
      user_id: userId,
      puzzle_id: puzzle_id,
      time_taken: time_taken,
    });

    if (insertError) {
      return new Response(JSON.stringify({ error: "Failed to save score" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Streak + credits + XP logic
    const { data: prof } = await adminClient
      .from("profiles")
      .select("credits, xp, current_streak, last_completed_date")
      .eq("user_id", userId)
      .single();

    let creditReward = 100;
    let newStreak = 1;

    if (prof) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      if (prof.last_completed_date === yesterday) {
        newStreak = prof.current_streak + 1;
      }
      const multiplier = Math.min(1.5, 1 + ((newStreak - 1) * 0.1));
      creditReward = Math.round(100 * multiplier);
      const xpReward = 50;

      await adminClient
        .from("profiles")
        .update({
          credits: prof.credits + creditReward,
          xp: prof.xp + xpReward,
          current_streak: newStreak,
          last_completed_date: today,
        })
        .eq("user_id", userId);
    }

    return new Response(
      JSON.stringify({
        correct: true,
        already_completed: false,
        credit_reward: creditReward,
        streak: newStreak,
        time_taken,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
