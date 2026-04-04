import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Coins, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const AVATARS = [
  { id: "avatar_cyber_skull", name: "Cyber Skull", emoji: "💀", price: 500 },
  { id: "avatar_neon_cat", name: "Neon Cat", emoji: "🐱", price: 300 },
  { id: "avatar_glitch_bot", name: "Glitch Bot", emoji: "🤖", price: 750 },
  { id: "avatar_plasma_fox", name: "Plasma Fox", emoji: "🦊", price: 400 },
  { id: "avatar_quantum_owl", name: "Quantum Owl", emoji: "🦉", price: 600 },
  { id: "avatar_void_wolf", name: "Void Wolf", emoji: "🐺", price: 1000 },
  { id: "avatar_pixel_dragon", name: "Pixel Dragon", emoji: "🐉", price: 1200 },
  { id: "avatar_star_panda", name: "Star Panda", emoji: "🐼", price: 350 },
];

export default function Shop() {
  const { user, loading: authLoading, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [credits, setCredits] = useState(0);
  const [owned, setOwned] = useState<Set<string>>(new Set());
  const [equipped, setEquipped] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

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
      setOwned(new Set(inventory?.map((i) => i.item_id) ?? []));
      setLoading(false);
    };
    load();
  }, [user, authLoading, navigate]);

  const handleBuy = async (avatar: typeof AVATARS[0]) => {
    if (!user || busy) return;
    if (credits < avatar.price) {
      toast.error("Not enough credits!");
      return;
    }
    setBusy(avatar.id);

    const newCredits = credits - avatar.price;
    const { error: creditErr } = await supabase
      .from("profiles")
      .update({ credits: newCredits })
      .eq("user_id", user.id);

    if (creditErr) { toast.error("Purchase failed."); setBusy(null); return; }

    const { error: invErr } = await supabase
      .from("user_inventory")
      .insert({ user_id: user.id, item_id: avatar.id, item_type: "avatar" });

    if (invErr) {
      // rollback credits
      await supabase.from("profiles").update({ credits }).eq("user_id", user.id);
      toast.error("Purchase failed.");
      setBusy(null);
      return;
    }

    setCredits(newCredits);
    setOwned((prev) => new Set(prev).add(avatar.id));
    toast.success(`Purchased ${avatar.name}!`);
    refreshProfile();
    setBusy(null);
  };

  const handleEquip = async (avatarId: string) => {
    if (!user || busy) return;
    setBusy(avatarId);
    const { error } = await supabase
      .from("profiles")
      .update({ avatar_url: avatarId })
      .eq("user_id", user.id);

    if (error) { toast.error("Failed to equip."); }
    else { setEquipped(avatarId); toast.success("Avatar equipped!"); refreshProfile(); }
    setBusy(null);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
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
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {AVATARS.map((avatar, i) => {
              const isOwned = owned.has(avatar.id);
              const isEquipped = equipped === avatar.id;
              return (
                <motion.div
                  key={avatar.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass rounded-xl border p-4 text-center ${
                    isEquipped ? "border-primary/60 box-glow" : "border-border/50"
                  }`}
                >
                  <div className="text-5xl mb-3">{avatar.emoji}</div>
                  <p className="font-display text-sm font-bold text-foreground mb-1">{avatar.name}</p>

                  {isEquipped ? (
                    <span className="inline-flex items-center gap-1 text-xs font-body text-primary">
                      <Check className="w-3 h-3" /> Equipped
                    </span>
                  ) : isOwned ? (
                    <Button
                      variant="neon-outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => handleEquip(avatar.id)}
                      disabled={busy === avatar.id}
                    >
                      Equip
                    </Button>
                  ) : (
                    <>
                      <p className="flex items-center justify-center gap-1 text-xs font-body text-neon-amber mb-2">
                        <Coins className="w-3 h-3" /> {avatar.price}
                      </p>
                      <Button
                        variant="neon"
                        size="sm"
                        className="w-full"
                        onClick={() => handleBuy(avatar)}
                        disabled={busy === avatar.id}
                      >
                        {busy === avatar.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Buy"}
                      </Button>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>

          <p className="text-center font-body text-sm text-muted-foreground mt-8">
            Earn <span className="text-primary font-semibold">100 credits</span> for every Daily Challenge you complete!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
