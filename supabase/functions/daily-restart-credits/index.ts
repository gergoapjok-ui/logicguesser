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

    const { data: profile } = await adminClient
      .from("profiles")
      .select("credits, daily_retries_used")
      .eq("user_id", user.id)
      .single();

    if (!profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Determine cost: every 4th day = 1000 credits, other days = 10000 credits
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const isDiscountDay = dayOfYear % 4 === 0;
    const cost = isDiscountDay ? 1000 : 10000;

    if (profile.credits < cost) {
      return new Response(JSON.stringify({ error: `Not enough credits. Need ${cost}`, cost }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const todayStr = today.toISOString().split("T")[0];

    // Delete today's progress and leaderboard entry
    await adminClient.from("challenge_progress").delete().eq("user_id", user.id).eq("puzzle_date", todayStr);
    await adminClient.from("leaderboard").delete().eq("user_id", user.id).eq("completed_date", todayStr);

    // Deduct credits and increment retries
    await adminClient.from("profiles").update({
      credits: profile.credits - cost,
      daily_retries_used: profile.daily_retries_used + 1,
    }).eq("user_id", user.id);

    return new Response(JSON.stringify({
      success: true,
      cost,
      new_credits: profile.credits - cost,
      is_discount_day: isDiscountDay,
    }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("daily-restart-credits error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
