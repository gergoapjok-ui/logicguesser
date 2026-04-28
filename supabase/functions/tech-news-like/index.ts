// Toggle a like on a tech news post (anonymous via fingerprint, or authenticated).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    const { post_id, fingerprint, action } = await req.json();
    if (!post_id) {
      return new Response(JSON.stringify({ error: "post_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Try to identify the user from JWT (optional)
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
          global: { headers: { Authorization: authHeader } },
        });
        const { data: u } = await userClient.auth.getUser();
        userId = u.user?.id ?? null;
      } catch {
        userId = null;
      }
    }

    const fp = fingerprint?.toString().slice(0, 64) ?? null;

    if (action === "unlike") {
      if (userId) {
        await supabase.from("tech_news_likes").delete().eq("post_id", post_id).eq("user_id", userId);
      } else if (fp) {
        await supabase
          .from("tech_news_likes")
          .delete()
          .eq("post_id", post_id)
          .is("user_id", null)
          .eq("client_fingerprint", fp);
      }
    } else {
      const row = userId
        ? { post_id, user_id: userId, client_fingerprint: null }
        : { post_id, user_id: null, client_fingerprint: fp };
      const { error } = await supabase.from("tech_news_likes").insert(row);
      if (error && !String(error.message).toLowerCase().includes("duplicate")) {
        console.warn("like insert error", error);
      }
    }

    const { data: post } = await supabase
      .from("tech_news_posts")
      .select("likes")
      .eq("id", post_id)
      .maybeSingle();

    return new Response(JSON.stringify({ likes: post?.likes ?? 0 }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
