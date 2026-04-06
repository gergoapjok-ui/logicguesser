import { motion } from "framer-motion";
import { Crown, Check, Zap, Shield, RotateCcw, Coins, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/Navbar";

const PRO_PERKS = [
  { icon: RotateCcw, label: "Daily Challenge Retries", desc: "Retry the daily challenge up to 3 times" },
  { icon: Shield, label: "No Advertisements", desc: "Remove all ad placeholders for a clean experience" },
  { icon: Coins, label: "2× Credit Multiplier", desc: "Earn double credits on all rewards" },
  { icon: Star, label: "Exclusive Avatars", desc: "Access Pro-only premium avatars in the Shop" },
  { icon: Crown, label: "Pro Badge", desc: "Show a glowing Pro badge on leaderboards and profiles" },
  { icon: Zap, label: "Unlimited Practice", desc: "No cooldowns in Practice Mode" },
];

export default function ProUpgrade() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [activating, setActivating] = useState(false);

  const handleActivate = async () => {
    if (!user) { navigate("/login"); return; }
    setActivating(true);

    const { error } = await supabase.functions.invoke("toggle-pro", {
      body: { activate: true },
    });

    if (error) {
      toast.error("Failed to activate Pro");
    } else {
      toast.success("🎉 Welcome to LOGICGUESSER Pro!");
      await refreshProfile();
    }
    setActivating(false);
  };

  const isPro = profile?.is_pro ?? false;

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4 max-w-xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-neon-amber/20 border-2 border-neon-amber flex items-center justify-center mx-auto mb-4 box-glow">
              <Crown className="w-8 h-8 text-neon-amber" />
            </div>
            <h1 className="font-display text-4xl font-bold text-foreground mb-2">
              LOGIC<span className="text-neon-amber">GUESSER</span> PRO
            </h1>
            <p className="font-body text-muted-foreground">Unlock the ultimate puzzle experience</p>
          </div>

          <div className="glass rounded-2xl border border-neon-amber/30 p-6 mb-6">
            <div className="space-y-4">
              {PRO_PERKS.map((perk, i) => (
                <motion.div
                  key={perk.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-neon-amber/10 border border-neon-amber/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <perk.icon className="w-4 h-4 text-neon-amber" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold text-foreground">{perk.label}</p>
                    <p className="font-body text-xs text-muted-foreground">{perk.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {isPro ? (
            <div className="text-center glass rounded-2xl border border-primary/30 p-6">
              <Check className="w-10 h-10 text-primary mx-auto mb-2" />
              <p className="font-display text-xl font-bold text-foreground mb-1">You're a Pro!</p>
              <p className="font-body text-sm text-muted-foreground">Enjoy all premium features.</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="glass rounded-2xl border border-neon-amber/30 p-6 mb-4">
                <p className="font-body text-sm text-muted-foreground mb-1">Limited-time offer</p>
                <p className="font-display text-3xl font-bold text-neon-amber mb-1">FREE</p>
                <p className="font-body text-xs text-muted-foreground">Mock activation — no payment required</p>
              </div>
              <Button
                variant="neon"
                size="xl"
                className="w-full bg-neon-amber hover:bg-neon-amber/90 text-background"
                onClick={handleActivate}
                disabled={activating}
              >
                {activating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Crown className="w-5 h-5" />}
                Activate Pro
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
