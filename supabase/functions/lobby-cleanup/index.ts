import { createClient } from "https://esm.sh/@supabase/supabase-js@2.101.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Deletes any lobby older than 24 hours regardless of status.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Find expired lobbies
    const { data: expired, error: findErr } = await adminClient
      .from("lobbies")
      .select("id")
      .lt("created_at", cutoff);

    if (findErr) throw findErr;

    const ids = (expired || []).map((l: { id: string }) => l.id);
    let deletedParticipants = 0;
    let deletedLobbies = 0;

    if (ids.length > 0) {
      const { count: pCount } = await adminClient
        .from("lobby_participants")
        .delete({ count: "exact" })
        .in("lobby_id", ids);
      deletedParticipants = pCount || 0;

      const { count: lCount } = await adminClient
        .from("lobbies")
        .delete({ count: "exact" })
        .in("id", ids);
      deletedLobbies = lCount || 0;
    }

    return new Response(
      JSON.stringify({
        success: true,
        cutoff,
        deleted_lobbies: deletedLobbies,
        deleted_participants: deletedParticipants,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("lobby-cleanup error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
