import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { guestId, addXp = 0, addCredits = 0, completedToday = false, leaderboard } = await req.json();
    if (!guestId) return new Response(JSON.stringify({ error: "guestId required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: g, error: gErr } = await admin.from("guest_accounts").select("*").eq("id", guestId).single();
    if (gErr || !g) return new Response(JSON.stringify({ error: "Guest not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const today = new Date().toISOString().slice(0, 10);
    let newStreak = g.current_streak;
    let newLast = g.last_completed_date;
    if (completedToday && g.last_completed_date !== today) {
      const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      newStreak = g.last_completed_date === y ? g.current_streak + 1 : 1;
      newLast = today;
    }

    const safeXp = Math.max(0, Math.min(500, Number(addXp) || 0));
    const safeCr = Math.max(0, Math.min(500, Number(addCredits) || 0));

    const { data: updated } = await admin.from("guest_accounts").update({
      xp: g.xp + safeXp,
      credits: g.credits + safeCr,
      current_streak: newStreak,
      last_completed_date: newLast,
      last_seen_at: new Date().toISOString(),
    }).eq("id", guestId).select().single();

    if (leaderboard?.puzzleId && typeof leaderboard.timeTaken === "number") {
      await admin.from("guest_leaderboard_entries").insert({
        guest_id: guestId,
        display_name: g.display_name,
        puzzle_id: leaderboard.puzzleId,
        time_taken: leaderboard.timeTaken,
      });
    }

    return new Response(JSON.stringify({ guest: updated }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error).message) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
