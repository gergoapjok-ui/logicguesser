import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, MailX } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<"loading" | "ready" | "done" | "already" | "invalid" | "submitting">("loading");

  useEffect(() => {
    if (!token) { setState("invalid"); return; }
    (async () => {
      try {
        const r = await fetch(`${FN_URL}?token=${encodeURIComponent(token)}`, { headers: { apikey: ANON } });
        const j = await r.json();
        if (!r.ok) { setState("invalid"); return; }
        if (j.valid === false && j.reason === "already_unsubscribed") { setState("already"); return; }
        if (j.valid) { setState("ready"); return; }
        setState("invalid");
      } catch { setState("invalid"); }
    })();
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setState("submitting");
    try {
      const r = await fetch(FN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: ANON },
        body: JSON.stringify({ token }),
      });
      const j = await r.json();
      if (j.success) setState("done");
      else if (j.reason === "already_unsubscribed") setState("already");
      else setState("invalid");
    } catch { setState("invalid"); }
  };

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4 max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl border border-border/50 p-8 text-center">
          <MailX className="w-10 h-10 text-primary mx-auto mb-3" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Email preferences</h1>

          {state === "loading" && <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto mt-6" />}

          {state === "ready" && (
            <>
              <p className="font-body text-sm text-muted-foreground mb-6">Click below to stop receiving email notifications from LogicGuesser. You'll still get critical account emails (password reset, etc.).</p>
              <Button variant="neon" size="lg" className="w-full" onClick={confirm}>Confirm Unsubscribe</Button>
            </>
          )}

          {state === "submitting" && <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto mt-6" />}

          {state === "done" && (
            <>
              <CheckCircle2 className="w-12 h-12 text-primary mx-auto mt-4 mb-3" />
              <p className="font-body text-sm text-foreground mb-6">You've been unsubscribed from LogicGuesser email notifications.</p>
              <Link to="/"><Button variant="neon-outline" size="lg" className="w-full">Back to LogicGuesser</Button></Link>
            </>
          )}

          {state === "already" && (
            <>
              <CheckCircle2 className="w-10 h-10 text-muted-foreground mx-auto mt-4 mb-3" />
              <p className="font-body text-sm text-muted-foreground mb-6">This email is already unsubscribed.</p>
              <Link to="/"><Button variant="neon-outline" size="lg" className="w-full">Back to LogicGuesser</Button></Link>
            </>
          )}

          {state === "invalid" && (
            <>
              <XCircle className="w-10 h-10 text-destructive mx-auto mt-4 mb-3" />
              <p className="font-body text-sm text-muted-foreground mb-6">This unsubscribe link is invalid or expired.</p>
              <Link to="/"><Button variant="neon-outline" size="lg" className="w-full">Back to LogicGuesser</Button></Link>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
