import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, User, Loader2, Star, Flame, Coins, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getLevelProgress } from "@/lib/leveling";
import Navbar from "@/components/Navbar";

const AVATARS_MAP: Record<string, string> = {
  avatar_cyber_skull: "💀", avatar_neon_cat: "🐱", avatar_glitch_bot: "🤖",
  avatar_plasma_fox: "🦊", avatar_quantum_owl: "🦉", avatar_void_wolf: "🐺",
  avatar_pixel_dragon: "🐉", avatar_star_panda: "🐼",
  avatar_diamond_phoenix: "🔥", avatar_golden_unicorn: "🦄",
  avatar_crystal_lion: "🦁", avatar_royal_eagle: "🦅",
};

export default function Profile() {
  const { user, loading: authLoading, profile, signOut, refreshProfile } = useAuth();
  const [solvedCount, setSolvedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }

    const fetchStats = async () => {
      const { count } = await supabase
        .from("leaderboard")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);
      setSolvedCount(count ?? 0);
      setLoading(false);
    };
    fetchStats();
    refreshProfile();
  }, [user, authLoading, navigate, refreshProfile]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || loading || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  const lvl = getLevelProgress(profile.xp);
  const avatarEmoji = profile.avatar_url ? AVATARS_MAP[profile.avatar_url] : null;

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass rounded-2xl border border-border/50 p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto mb-4 box-glow">
              {avatarEmoji ? (
                <span className="text-4xl">{avatarEmoji}</span>
              ) : (
                <User className="w-10 h-10 text-primary" />
              )}
            </div>

            <h1 className="font-display text-2xl font-bold text-foreground mb-0.5">
              {profile.username || "Anonymous"}
            </h1>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Star className="w-4 h-4 text-neon-amber" />
              <span className="font-display text-sm font-bold text-foreground">Level {lvl.level}</span>
              {profile.is_pro && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-neon-amber/20 border border-neon-amber/40 ml-1">
                  <Crown className="w-3 h-3 text-neon-amber" />
                  <span className="font-display text-[10px] font-bold text-neon-amber">PRO</span>
                </span>
              )}
            </div>
            <p className="font-body text-xs text-muted-foreground mb-1">{user?.email}</p>
            {profile.bio && (
              <p className="font-body text-sm text-muted-foreground mb-4">{profile.bio}</p>
            )}

            {/* XP bar */}
            <div className="mt-4 mb-6 px-4">
              <div className="flex justify-between text-xs font-body text-muted-foreground mb-1">
                <span>{profile.xp} XP</span>
                <span>{lvl.current}/{lvl.needed} to Lv. {lvl.level + 1}</span>
              </div>
              <Progress value={lvl.percent} className="h-2" />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="font-display text-xl font-bold text-foreground flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4 text-destructive" /> {profile.current_streak}
                </div>
                <div className="font-body text-xs text-muted-foreground">Streak</div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="font-display text-xl font-bold text-foreground">{solvedCount}</div>
                <div className="font-body text-xs text-muted-foreground">Solved</div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="font-display text-xl font-bold text-foreground flex items-center justify-center gap-1">
                  <Coins className="w-4 h-4 text-primary" /> {profile.credits}
                </div>
                <div className="font-body text-xs text-muted-foreground">Credits</div>
              </div>
            </div>

            {!profile.is_pro && (
              <Button variant="neon" size="lg" className="w-full mb-3 bg-neon-amber hover:bg-neon-amber/90 text-background" onClick={() => navigate("/pro")}>
                <Crown className="w-4 h-4" /> Upgrade to Pro
              </Button>
            )}

            <Button variant="neon-outline" size="lg" className="w-full" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Log Out
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
