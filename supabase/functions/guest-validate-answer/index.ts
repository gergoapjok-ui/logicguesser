import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function normalize(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, " ").replace(/[.,!?;:'"]/g, "");
}
function lev(a: string, b: string) {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  }
  return dp[m][n];
}
function isCorrect(user: string, ans: string) {
  const u = normalize(user), a = normalize(ans);
  if (!u || !a) return false;
  if (u === a) return true;
  if (!isNaN(Number(a))) return u === a;
  const tol = a.length <= 4 ? 1 : a.length <= 8 ? 2 : 3;
  return lev(u, a) <= tol;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { puzzleId, answer } = await req.json();
    if (!puzzleId || typeof answer !== "string") {
      return new Response(JSON.stringify({ error: "Bad input" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data, error } = await admin.from("puzzles").select("answer").eq("id", puzzleId).single();
    if (error || !data) return new Response(JSON.stringify({ error: "Puzzle not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const correct = isCorrect(answer, (data as any).answer);
    return new Response(JSON.stringify({ correct }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error).message) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
