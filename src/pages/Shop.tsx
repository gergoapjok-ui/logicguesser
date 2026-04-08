import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Coins, Check, Loader2, Crown, Lock, CreditCard, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme, APP_THEMES } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const CREDIT_PACKS = [
  { id: "credits_5000", name: "5,000 Credits", credits: 5000, price: "$0.99", emoji: "💰" },
  { id: "credits_25000", name: "25,000 Credits", credits: 25000, price: "$2.99", emoji: "💎" },
];

const AVATARS = [
  { id: "avatar_cyber_skull", name: "Cyber Skull", emoji: "💀", price: 500, proOnly: false },
  { id: "avatar_neon_cat", name: "Neon Cat", emoji: "🐱", price: 300, proOnly: false },
  { id: "avatar_glitch_bot", name: "Glitch Bot", emoji: "🤖", price: 750, proOnly: false },
  { id: "avatar_plasma_fox", name: "Plasma Fox", emoji: "🦊", price: 400, proOnly: false },
  { id: "avatar_quantum_owl", name: "Quantum Owl", emoji: "🦉", price: 600, proOnly: false },
  { id: "avatar_void_wolf", name: "Void Wolf", emoji: "🐺", price: 1000, proOnly: false },
  { id: "avatar_pixel_dragon", name: "Pixel Dragon", emoji: "🐉", price: 1200, proOnly: false },
  { id: "avatar_star_panda", name: "Star Panda", emoji: "🐼", price: 350, proOnly: false },
  // Pro-exclusive avatars
  { id: "avatar_diamond_phoenix", name: "Diamond Phoenix", emoji: "🔥", price: 200, proOnly: true },
  { id: "avatar_golden_unicorn", name: "Golden Unicorn", emoji: "🦄", price: 200, proOnly: true },
  { id: "avatar_crystal_lion", name: "Crystal Lion", emoji: "🦁", price: 200, proOnly: true },
  { id: "avatar_royal_eagle", name: "Royal Eagle", emoji: "🦅", price: 200, proOnly: true },
];

export default function Shop() {
  const { user, loading: authLoading, profile, refreshProfile } = useAuth();
  const { currentTheme, setTheme, ownedThemes, refreshOwned } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [credits, setCredits] = useState(0);
  const [owned, setOwned] = useState<Set<string>>(new Set());
  const [equipped, setEquipped] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [buyingCredits, setBuyingCredits] = useState<string | null>(null);
  const isPro = profile?.is_pro ?? false;

  // Handle credit purchase return
  useEffect(() => {
    const purchased = searchParams.get("credits_purchased");
    if (purchased) {
      toast.success(`${purchased} credits added to your account!`);
      refreshProfile();
    }
  }, [searchParams]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }

    const load = async () => {
      const [{ data: prof }, { data: inventory }] = await Promise.all([
        supabase.from("profiles").select("credits, avatar_url").eq("user_id", user.id).single(),
        supabase.from("user_inventory").select("item_id").eq("user_id", user.id),
      ]);
      setCredits(prof?.credits ?? 0);
      setEquipped(prof?.avatar_url ?? null);
      setOwned(new Set(inventory?.map(i => i.item_id) ?? []));
      setLoading(false);
    };
    load();
  }, [user, authLoading, navigate]);

  const handleBuy = async (avatar: typeof AVATARS[0]) => {
    if (!user || busy) return;
    if (avatar.proOnly && !isPro) {
      toast.error("This avatar is Pro-exclusive!");
      return;
    }
    if (credits < avatar.price) {
      toast.error("Not enough credits!");
      return;
    }
    setBusy(avatar.id);
    const { data, error } = await supabase.functions.invoke("purchase-avatar", {
      body: { avatar_id: avatar.id },
    });
    if (error || !data?.success) {
      toast.error(data?.error || "Purchase failed.");
      setBusy(null);
      return;
    }
    setCredits(data.new_credits);
    setOwned(prev => new Set(prev).add(avatar.id));
    toast.success(`Purchased ${avatar.name}!`);
    refreshProfile();
    setBusy(null);
  };

  const handleEquip = async (avatarId: string) => {
    if (!user || busy) return;
    setBusy(avatarId);
    const { error } = await supabase.rpc("update_profile_safe" as any, { _avatar_url: avatarId });
    if (error) toast.error("Failed to equip.");
    else { setEquipped(avatarId); toast.success("Avatar equipped!"); refreshProfile(); }
    setBusy(null);
  };

  if (authLoading || loading) {
    return <div className="min-h-screen bg-background"><Navbar /><div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div></div>;
  }

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-10">
            <ShoppingBag className="w-10 h-10 text-primary mx-auto mb-3" />
            <h1 className="font-display text-4xl font-bold text-foreground mb-2">
              <span className="text-primary text-glow">SHOP</span>
            </h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50">
              <Coins className="w-4 h-4 text-neon-amber" />
              <span className="font-display text-lg font-bold text-foreground">{credits}</span>
              <span className="font-body text-sm text-muted-foreground">Credits</span>
              {isPro && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-neon-amber/20 border border-neon-amber/40 text-neon-amber text-[10px] font-display font-bold">2× EARN</span>
              )}
            </div>
          </div>

          {/* Regular avatars */}
          <h2 className="font-display text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Avatars</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {AVATARS.filter(a => !a.proOnly).map((avatar, i) => {
              const isOwned = owned.has(avatar.id);
              const isEquipped = equipped === avatar.id;
              return (
                <motion.div key={avatar.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className={`glass rounded-xl border p-4 text-center ${isEquipped ? "border-primary/60 box-glow" : "border-border/50"}`}>
                  <div className="text-5xl mb-3">{avatar.emoji}</div>
                  <p className="font-display text-sm font-bold text-foreground mb-1">{avatar.name}</p>
                  {isEquipped ? (
                    <span className="inline-flex items-center gap-1 text-xs font-body text-primary"><Check className="w-3 h-3" /> Equipped</span>
                  ) : isOwned ? (
                    <Button variant="neon-outline" size="sm" className="w-full mt-2" onClick={() => handleEquip(avatar.id)} disabled={busy === avatar.id}>Equip</Button>
                  ) : (
                    <>
                      <p className="flex items-center justify-center gap-1 text-xs font-body text-neon-amber mb-2"><Coins className="w-3 h-3" /> {avatar.price}</p>
                      <Button variant="neon" size="sm" className="w-full" onClick={() => handleBuy(avatar)} disabled={busy === avatar.id}>
                        {busy === avatar.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Buy"}
                      </Button>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Pro-exclusive avatars */}
          <div className="flex items-center gap-2 mb-3">
            <Crown className="w-4 h-4 text-neon-amber" />
            <h2 className="font-display text-sm font-bold text-neon-amber uppercase tracking-wider">Pro Exclusive</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {AVATARS.filter(a => a.proOnly).map((avatar, i) => {
              const isOwned = owned.has(avatar.id);
              const isEquipped = equipped === avatar.id;
              const locked = !isPro && !isOwned;
              return (
                <motion.div key={avatar.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className={`glass rounded-xl border p-4 text-center relative ${
                    isEquipped ? "border-neon-amber/60 box-glow" : locked ? "border-border/30 opacity-70" : "border-neon-amber/30"
                  }`}>
                  {locked && (
                    <div className="absolute inset-0 rounded-xl bg-background/50 flex items-center justify-center z-10">
                      <div className="text-center">
                        <Lock className="w-6 h-6 text-neon-amber mx-auto mb-1" />
                        <Button variant="link" className="text-neon-amber text-xs p-0 h-auto" onClick={() => navigate("/pro")}>Get Pro</Button>
                      </div>
                    </div>
                  )}
                  <div className="text-5xl mb-3">{avatar.emoji}</div>
                  <p className="font-display text-sm font-bold text-foreground mb-1">{avatar.name}</p>
                  {isEquipped ? (
                    <span className="inline-flex items-center gap-1 text-xs font-body text-neon-amber"><Check className="w-3 h-3" /> Equipped</span>
                  ) : isOwned ? (
                    <Button variant="neon-outline" size="sm" className="w-full mt-2" onClick={() => handleEquip(avatar.id)} disabled={busy === avatar.id}>Equip</Button>
                  ) : !locked ? (
                    <>
                      <p className="flex items-center justify-center gap-1 text-xs font-body text-neon-amber mb-2"><Coins className="w-3 h-3" /> {avatar.price}</p>
                      <Button variant="neon" size="sm" className="w-full" onClick={() => handleBuy(avatar)} disabled={busy === avatar.id}>
                        {busy === avatar.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Buy"}
                      </Button>
                    </>
                  ) : null}
                </motion.div>
              );
            })}
          </div>

          {/* Credit Packs */}
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-4 h-4 text-primary" />
            <h2 className="font-display text-sm font-bold text-primary uppercase tracking-wider">Buy Credits</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {CREDIT_PACKS.map((pack) => (
              <motion.div key={pack.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl border border-primary/30 p-5 text-center">
                <div className="text-4xl mb-2">{pack.emoji}</div>
                <p className="font-display text-lg font-bold text-foreground">{pack.name}</p>
                <p className="font-display text-xl font-bold text-primary mt-1">{pack.price}</p>
                <Button
                  variant="neon"
                  size="sm"
                  className="w-full mt-3"
                  disabled={buyingCredits === pack.id}
                  onClick={async () => {
                    if (!user) { navigate("/login"); return; }
                    setBuyingCredits(pack.id);
                    try {
                      const { data, error } = await supabase.functions.invoke("create-checkout", {
                        body: { type: "credits", pack_id: pack.id },
                      });
                      if (error) throw error;
                      if (data?.url) window.open(data.url, "_blank");
                    } catch {
                      toast.error("Failed to start checkout");
                    }
                    setBuyingCredits(null);
                  }}
                >
                  {buyingCredits === pack.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><CreditCard className="w-4 h-4" /> Purchase</>}
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="text-center space-y-2">
            <p className="font-body text-sm text-muted-foreground">
              Earn <span className="text-primary font-semibold">100 credits</span> for every Daily Challenge
              {isPro && <span className="text-neon-amber font-semibold"> (2× with Pro!)</span>}
            </p>
            {!isPro && (
              <Button variant="link" className="text-neon-amber" onClick={() => navigate("/pro")}>
                <Crown className="w-4 h-4 mr-1" /> Upgrade to Pro for exclusive avatars & 2× credits
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
