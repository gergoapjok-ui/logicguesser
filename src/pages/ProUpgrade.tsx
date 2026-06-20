import { motion } from "framer-motion";
import { Crown, Check, Zap, Shield, RotateCcw, Coins, Star, Loader2, CreditCard, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/lib/seo";

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
  const [searchParams] = useSearchParams();
  const [activating, setActivating] = useState(false);
  const [managingPortal, setManagingPortal] = useState(false);

  usePageMeta({
    title: "LogicGuesser Pro — Ad-free puzzles",
    description: "Upgrade to LogicGuesser Pro for ad-free play, daily retries, doubled credit rewards, exclusive avatars, and a Pro badge.",
    path: "/pro",
  });

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("🎉 Welcome to LOGICGUESSER Pro!");
      // Check subscription to sync is_pro
      supabase.functions.invoke("check-subscription").then(() => refreshProfile());
    }
  }, [searchParams]);

  // Periodically check subscription status
  useEffect(() => {
    if (!user) return;
    supabase.functions.invoke("check-subscription").then(() => refreshProfile());
  }, [user]);

  const handleCheckout = async () => {
    if (!user) { navigate("/login"); return; }
    setActivating(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { type: "pro" },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch {
      toast.error("Failed to start checkout");
    }
    setActivating(false);
  };

  const handleManage = async () => {
    setManagingPortal(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch {
      toast.error("Failed to open subscription management");
    }
    setManagingPortal(false);
  };

  const isPro = profile?.is_pro ?? false;

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <main className="pt-24 pb-16 container mx-auto px-4 max-w-xl">
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
            <div className="text-center space-y-4">
              <div className="glass rounded-2xl border border-primary/30 p-6">
                <Check className="w-10 h-10 text-primary mx-auto mb-2" />
                <p className="font-display text-xl font-bold text-foreground mb-1">You're a Pro!</p>
                <p className="font-body text-sm text-muted-foreground">Enjoy all premium features.</p>
              </div>
              <Button variant="neon-outline" size="lg" className="w-full" onClick={handleManage} disabled={managingPortal}>
                {managingPortal ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ExternalLink className="w-4 h-4" /> Manage Subscription</>}
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <div className="glass rounded-2xl border border-neon-amber/30 p-6 mb-4">
                <p className="font-body text-sm text-muted-foreground mb-1">Monthly subscription</p>
                <p className="font-display text-3xl font-bold text-neon-amber mb-1">$2.49<span className="text-base font-body text-muted-foreground">/mo</span></p>
                <p className="font-body text-xs text-muted-foreground">Cancel anytime</p>
              </div>
              <Button
                variant="neon"
                size="xl"
                className="w-full bg-neon-amber hover:bg-neon-amber/90 text-background"
                onClick={handleCheckout}
                disabled={activating}
              >
                {activating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CreditCard className="w-5 h-5" /> Subscribe with Stripe</>}
              </Button>
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
