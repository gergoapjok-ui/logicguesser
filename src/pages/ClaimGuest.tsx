import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Gift, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

export default function ClaimGuest() {
  const { user, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ xp: number; credits: number; streak: number } | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { data, error } = await (supabase.rpc as any)("claim_guest_account", {
      _name: name.trim(),
      _code: code.trim(),
    });
    setSubmitting(false);
    if (error) { toast.error(error.message || "Could not claim"); return; }
    setDone({
      xp: data?.merged_xp ?? 0,
      credits: data?.merged_credits ?? 0,
      streak: data?.merged_streak ?? 0,
    });
    await refreshProfile();
    try { localStorage.removeItem("lg_guest_session_v1"); } catch { /* ignore */ }
    toast.success("Stats transferred!");
  };

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-16 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="glass rounded-2xl border border-border/50 p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary mx-auto flex items-center justify-center mb-3">
                {done ? <CheckCircle2 className="w-7 h-7 text-primary" /> : <Gift className="w-7 h-7 text-primary" />}
              </div>
              <h1 className="font-display text-2xl font-bold">
                {done ? "Stats transferred!" : <>Claim your <span className="text-primary text-glow">guest stats</span></>}
              </h1>
              {!done && <p className="text-sm text-muted-foreground mt-2">Enter the display name and claim code from your guest session.</p>}
            </div>

            {done ? (
              <div className="text-center space-y-3">
                <p className="text-sm">+{done.xp} XP · +{done.credits} credits · streak {done.streak}</p>
                <Button variant="neon" className="w-full" onClick={() => navigate("/profile")}>Go to profile</Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-3">
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Guest display name" required />
                <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Claim code (e.g. ABCD-EFGH-IJKL)" required className="font-mono tracking-wider" />
                <Button type="submit" variant="neon" size="lg" className="w-full" disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4" />}
                  Claim stats
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
