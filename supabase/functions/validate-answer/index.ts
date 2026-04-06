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
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user: authUser }, error: authError } = await anonClient.auth.getUser();
    if (authError || !authUser) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = authUser.id;
    const body = await req.json();
    const { puzzle_id, answer, task_number, total_elapsed, total_penalties } = body;

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
    if (typeof task_number !== "number" || task_number < 1 || task_number > 5) {
      return new Response(JSON.stringify({ error: "Invalid task_number" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get puzzle with answer
    const { data: puzzle, error: puzzleError } = await adminClient
      .from("puzzles")
      .select("id, answer, puzzle_date, task_number")
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

    // Check if this task was already completed
    const { data: existingProgress } = await adminClient
      .from("challenge_progress")
      .select("id")
      .eq("user_id", userId)
      .eq("puzzle_date", today)
      .eq("task_number", task_number)
      .maybeSingle();

    if (existingProgress) {
      return new Response(JSON.stringify({ correct: true, already_completed: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check answer
    const correct = answer.trim().toLowerCase() === puzzle.answer.trim().toLowerCase();

    if (!correct) {
      return new Response(JSON.stringify({ correct: false, penalty: 5 }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Record progress for this task
    const penalties = typeof total_penalties === "number" ? total_penalties : 0;
    await adminClient.from("challenge_progress").insert({
      user_id: userId,
      puzzle_date: today,
      task_number: task_number,
      puzzle_id: puzzle_id,
      penalties: penalties,
    });

    // Check how many tasks are done for today
    const { data: allProgress } = await adminClient
      .from("challenge_progress")
      .select("task_number")
      .eq("user_id", userId)
      .eq("puzzle_date", today);

    // Count total tasks for today
    const { count: totalTasks } = await adminClient
      .from("puzzles")
      .select("id", { count: "exact", head: true })
      .eq("puzzle_date", today);

    const completedTasks = allProgress?.length ?? 0;
    const isAllDone = completedTasks >= (totalTasks ?? 1);

    if (!isAllDone) {
      return new Response(
        JSON.stringify({
          correct: true,
          already_completed: false,
          all_done: false,
          tasks_completed: completedTasks,
          total_tasks: totalTasks ?? 1,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // All tasks done — create leaderboard entry
    const elapsed = typeof total_elapsed === "number" ? total_elapsed : 0;
    const finalTime = Math.max(1, elapsed + penalties);

    // Check if leaderboard entry already exists for today
    const { data: existingEntry } = await adminClient
      .from("leaderboard")
      .select("id")
      .eq("user_id", userId)
      .eq("completed_date", today)
      .maybeSingle();

    if (!existingEntry) {
      // Get first puzzle of the day for the FK
      const { data: firstPuzzle } = await adminClient
        .from("puzzles")
        .select("id")
        .eq("puzzle_date", today)
        .eq("task_number", 1)
        .single();

      await adminClient.from("leaderboard").insert({
        user_id: userId,
        puzzle_id: firstPuzzle?.id ?? puzzle_id,
        time_taken: finalTime,
        completed_date: today,
      });
    }

    // Streak + credits + XP
    const { data: prof } = await adminClient
      .from("profiles")
      .select("credits, xp, current_streak, last_completed_date, is_pro, daily_retries_used")
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
      // Pro users get 2x credits
      if (prof.is_pro) creditReward *= 2;
      const xpReward = 50;

      await adminClient
        .from("profiles")
        .update({
          credits: prof.credits + creditReward,
          xp: prof.xp + xpReward,
          current_streak: newStreak,
          last_completed_date: today,
          daily_retries_used: 0, // reset retries on new day
        })
        .eq("user_id", userId);
    }

    return new Response(
      JSON.stringify({
        correct: true,
        already_completed: false,
        all_done: true,
        credit_reward: creditReward,
        streak: newStreak,
        time_taken: finalTime,
        tasks_completed: completedTasks,
        total_tasks: totalTasks ?? 1,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("validate-answer error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
