import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BANNED = ["nigger","nigga","faggot","retard","cunt","fuck","shit","bitch","cock","dick","pussy","asshole","bastard","whore","slut","wanker","twat","prick","motherfucker"];

function badName(n: string) {
  const low = n.toLowerCase().replace(/[^a-z]/g, "");
  return BANNED.some(w => low.includes(w));
}

async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function genCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  const arr = new Uint8Array(12);
  crypto.getRandomValues(arr);
  for (let i = 0; i < 12; i++) out += chars[arr[i] % chars.length];
  return `${out.slice(0,4)}-${out.slice(4,8)}-${out.slice(8,12)}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { displayName } = await req.json();
    const name = String(displayName || "").trim();
    if (name.length < 2 || name.length > 20) {
      return new Response(JSON.stringify({ error: "Display name must be 2-20 characters" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!/^[a-zA-Z0-9_\- ]+$/.test(name) || badName(name)) {
      return new Response(JSON.stringify({ error: "Display name not allowed" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: existing } = await admin.from("guest_accounts").select("id").ilike("display_name", name).maybeSingle();
    if (existing) {
      return new Response(JSON.stringify({ error: "Name taken" }), { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: profExists } = await admin.from("profiles").select("user_id").ilike("username", name).maybeSingle();
    if (profExists) {
      return new Response(JSON.stringify({ error: "Name taken" }), { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const code = genCode();
    const hash = await sha256(code);

    const { data, error } = await admin.from("guest_accounts").insert({
      display_name: name, claim_code_hash: hash,
    }).select("id, display_name").single();

    if (error) throw error;

    return new Response(JSON.stringify({ guest: data, claimCode: code }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error).message) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
