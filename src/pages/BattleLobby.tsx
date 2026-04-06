import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Swords, Clock, Target, Zap, Shield, Loader2, CheckCircle2, XCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const AVATARS_MAP: Record<string, string> = {
  avatar_cyber_skull: "💀", avatar_neon_cat: "🐱", avatar_glitch_bot: "🤖",
  avatar_plasma_fox: "🦊", avatar_quantum_owl: "🦉", avatar_void_wolf: "🐺",
  avatar_pixel_dragon: "🐉", avatar_star_panda: "🐼",
};

interface Battle {
  id: string;
  creator_id: string;
  opponent_id: string | null;
  status: string;
  game_mode: string;
  max_time_seconds: number;
  rounds: number;
  point_system: string;
  allow_penalties: boolean;
  penalty_seconds: number;
  created_at: string;
  winner_id: string | null;
}

export default function BattleLobby() {
  const { battleId } = useParams<{ battleId: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [battle, setBattle] = useState<Battle | null>(null);
  const [creatorProfile, setCreatorProfile] = useState<{ username: string | null; avatar_url: string | null } | null>(null);
  const [opponentProfile, setOpponentProfile] = useState<{ username: string | null; avatar_url: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }

    const load = async () => {
      const { data } = await supabase
        .from("battles" as any)
        .select("*")
        .eq("id", battleId)
        .single();

      if (!data) { setLoading(false); return; }
      setBattle(data as any);

      const ids = [(data as any).creator_id, (data as any).opponent_id].filter(Boolean);
      const { data: profiles } = await supabase
        .from("profiles_public" as any)
        .select("user_id, username, avatar_url")
        .in("user_id", ids);

      if (profiles) {
        const map = new Map((profiles as any[]).map(p => [p.user_id, p]));
        setCreatorProfile(map.get((data as any).creator_id) ?? null);
        if ((data as any).opponent_id) setOpponentProfile(map.get((data as any).opponent_id) ?? null);
      }
      setLoading(false);
    };
    load();
  }, [user, authLoading, battleId, navigate]);

  // Realtime battle updates
  useEffect(() => {
    if (!battleId) return;
    const channel = supabase
      .channel(`battle-${battleId}`)
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "battles",
        filter: `id=eq.${battleId}`,
      }, (payload) => {
        setBattle(payload.new as Battle);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [battleId]);

  const acceptBattle = async () => {
    if (!battle || !user) return;
    const { error } = await supabase
      .from("battles" as any)
      .update({ status: "accepted" })
      .eq("id", battle.id);
    if (error) toast.error("Failed to accept");
    else toast.success("Battle accepted! Get ready...");
  };

  const declineBattle = async () => {
    if (!battle || !user) return;
    await supabase
      .from("battles" as any)
      .update({ status: "declined" })
      .eq("id", battle.id);
    toast.info("Battle declined");
    navigate("/friends");
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

  if (!battle) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <p className="font-body text-muted-foreground">Battle not found.</p>
        </div>
      </div>
    );
  }

  const isCreator = user?.id === battle.creator_id;
  const isOpponent = user?.id === battle.opponent_id;
  const modeIcon = battle.game_mode === "survival" ? Shield : battle.game_mode === "blitz" ? Clock : Zap;

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4 max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <Swords className="w-12 h-12 text-primary mx-auto mb-3" />
            <h1 className="font-display text-3xl font-bold text-foreground">
              BATTLE <span className="text-primary text-glow">LOBBY</span>
            </h1>
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/30">
              <span className={`w-2 h-2 rounded-full ${battle.status === "pending" ? "bg-neon-amber animate-pulse" : battle.status === "accepted" ? "bg-primary" : "bg-destructive"}`} />
              <span className="font-body text-sm text-muted-foreground capitalize">{battle.status}</span>
            </div>
          </div>

          {/* Players */}
          <div className="glass rounded-2xl border border-border/50 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <span className="text-4xl block mb-2">
                  {creatorProfile?.avatar_url && AVATARS_MAP[creatorProfile.avatar_url] ? AVATARS_MAP[creatorProfile.avatar_url] : "👤"}
                </span>
                <p className="font-body font-semibold text-foreground text-sm">{creatorProfile?.username ?? "Creator"}</p>
                {isCreator && <span className="text-[10px] font-body text-primary">You</span>}
              </div>
              <div className="px-4">
                <Swords className="w-8 h-8 text-primary text-glow" />
                <p className="font-display text-xs text-muted-foreground mt-1">VS</p>
              </div>
              <div className="text-center flex-1">
                <span className="text-4xl block mb-2">
                  {opponentProfile?.avatar_url && AVATARS_MAP[opponentProfile.avatar_url] ? AVATARS_MAP[opponentProfile.avatar_url] : "👤"}
                </span>
                <p className="font-body font-semibold text-foreground text-sm">{opponentProfile?.username ?? "Waiting..."}</p>
                {isOpponent && <span className="text-[10px] font-body text-primary">You</span>}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="glass rounded-2xl border border-border/50 p-6 mb-6 space-y-3">
            <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider mb-3">Battle Settings</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary/30 rounded-xl p-3 border border-border/20">
                <div className="flex items-center gap-2 mb-1">
                  {(() => { const Icon = modeIcon; return <Icon className="w-4 h-4 text-primary" />; })()}
                  <span className="font-body text-xs text-muted-foreground">Mode</span>
                </div>
                <p className="font-display font-bold text-foreground text-sm capitalize">{battle.game_mode}</p>
              </div>
              <div className="bg-secondary/30 rounded-xl p-3 border border-border/20">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="font-body text-xs text-muted-foreground">Rounds</span>
                </div>
                <p className="font-display font-bold text-foreground text-sm">{battle.rounds}</p>
              </div>
              <div className="bg-secondary/30 rounded-xl p-3 border border-border/20">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-body text-xs text-muted-foreground">Max Time</span>
                </div>
                <p className="font-display font-bold text-foreground text-sm">{Math.floor(battle.max_time_seconds / 60)}:{String(battle.max_time_seconds % 60).padStart(2, "0")}</p>
              </div>
              <div className="bg-secondary/30 rounded-xl p-3 border border-border/20">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="font-body text-xs text-muted-foreground">Points</span>
                </div>
                <p className="font-display font-bold text-foreground text-sm capitalize">{battle.point_system}</p>
              </div>
            </div>
            {battle.allow_penalties && (
              <div className="bg-destructive/10 rounded-xl p-3 border border-destructive/20 text-center">
                <p className="font-body text-xs text-destructive">
                  Wrong answer penalty: <span className="font-bold">+{battle.penalty_seconds}s</span>
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          {battle.status === "pending" && isOpponent && (
            <div className="flex gap-3">
              <Button variant="neon" size="lg" className="flex-1" onClick={acceptBattle}>
                <CheckCircle2 className="w-5 h-5" /> Accept
              </Button>
              <Button variant="ghost" size="lg" onClick={declineBattle}>
                <XCircle className="w-5 h-5" /> Decline
              </Button>
            </div>
          )}

          {battle.status === "pending" && isCreator && (
            <div className="text-center">
              <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto mb-2" />
              <p className="font-body text-muted-foreground text-sm">Waiting for opponent to accept...</p>
            </div>
          )}

          {battle.status === "accepted" && (
            <div className="text-center">
              <p className="font-display text-xl font-bold text-primary text-glow mb-2">Battle Accepted!</p>
              <p className="font-body text-muted-foreground text-sm">The battle gameplay will be available soon.</p>
            </div>
          )}

          {battle.status === "declined" && (
            <div className="text-center">
              <XCircle className="w-10 h-10 text-destructive mx-auto mb-2" />
              <p className="font-display text-xl font-bold text-foreground">Battle Declined</p>
              <Button variant="neon-outline" className="mt-4" onClick={() => navigate("/friends")}>
                Back to Friends
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
