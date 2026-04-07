import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Swords, Clock, Target, Zap, Shield, ChevronDown, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const GAME_MODES = [
  { id: "standard", label: "Standard", desc: "Answer puzzles as fast as you can", icon: Zap },
  { id: "survival", label: "Survival", desc: "Wrong answer = instant lose", icon: Shield },
  { id: "blitz", label: "Blitz", desc: "Ultra-fast round timer", icon: Clock },
];

const POINT_SYSTEMS = [
  { id: "speed", label: "Speed", desc: "Fastest total time wins" },
  { id: "accuracy", label: "Accuracy", desc: "Most correct answers wins" },
  { id: "combined", label: "Combined", desc: "Points for speed + accuracy" },
];

export default function BattleCreate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const opponentId = searchParams.get("opponent");

  const [gameMode, setGameMode] = useState("standard");
  const [maxTime, setMaxTime] = useState(300);
  const [rounds, setRounds] = useState(5);
  const [pointSystem, setPointSystem] = useState("speed");
  const [allowPenalties, setAllowPenalties] = useState(true);
  const [penaltySeconds, setPenaltySeconds] = useState(5);
  const [realtimeMode, setRealtimeMode] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!user || !opponentId) return;
    setCreating(true);

    const { data: battle, error } = await supabase.from("battles" as any).insert({
      creator_id: user.id,
      opponent_id: opponentId,
      game_mode: gameMode,
      max_time_seconds: maxTime,
      rounds,
      point_system: pointSystem,
      allow_penalties: allowPenalties,
      penalty_seconds: penaltySeconds,
      realtime_mode: realtimeMode,
      status: "pending",
    }).select("id").single();

    if (error || !battle) {
      toast.error("Failed to create battle");
      setCreating(false);
      return;
    }

    // Send battle invite message
    await supabase.from("messages" as any).insert({
      sender_id: user.id,
      receiver_id: opponentId,
      content: `⚔️ Battle challenge! Mode: ${gameMode}, ${rounds} rounds, ${maxTime}s max time.`,
      message_type: "battle_invite",
      battle_invite_id: (battle as any).id,
    });

    toast.success("Battle invite sent!");
    navigate(`/battle/${(battle as any).id}`);
  };

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4 max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <Swords className="w-10 h-10 text-primary mx-auto mb-3" />
            <h1 className="font-display text-3xl font-bold text-foreground">
              CREATE <span className="text-primary text-glow">BATTLE</span>
            </h1>
            <p className="font-body text-muted-foreground text-sm mt-1">Configure your challenge settings</p>
          </div>

          <div className="glass rounded-2xl border border-border/50 p-6 space-y-6">
            {/* Game Mode */}
            <div>
              <label className="font-display text-sm font-bold text-foreground uppercase tracking-wider mb-3 block">Game Mode</label>
              <div className="grid gap-2">
                {GAME_MODES.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setGameMode(mode.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                      gameMode === mode.id
                        ? "border-primary bg-primary/10 box-glow"
                        : "border-border/50 bg-secondary/30 hover:border-border"
                    }`}
                  >
                    <mode.icon className={`w-5 h-5 ${gameMode === mode.id ? "text-primary" : "text-muted-foreground"}`} />
                    <div>
                      <p className="font-body font-semibold text-foreground text-sm">{mode.label}</p>
                      <p className="font-body text-xs text-muted-foreground">{mode.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Rounds */}
            <div>
              <label className="font-display text-sm font-bold text-foreground uppercase tracking-wider mb-2 block">
                Rounds
              </label>
              <div className="flex gap-2">
                {[3, 5, 7, 10].map(n => (
                  <button
                    key={n}
                    onClick={() => setRounds(n)}
                    className={`flex-1 py-2 rounded-lg font-display font-bold text-sm border transition-all ${
                      rounds === n
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/50 bg-secondary/30 text-muted-foreground hover:border-border"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Time */}
            <div>
              <label className="font-display text-sm font-bold text-foreground uppercase tracking-wider mb-2 block">
                Max Time (seconds)
              </label>
              <div className="flex gap-2">
                {[120, 180, 300, 600].map(t => (
                  <button
                    key={t}
                    onClick={() => setMaxTime(t)}
                    className={`flex-1 py-2 rounded-lg font-display font-bold text-sm border transition-all ${
                      maxTime === t
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/50 bg-secondary/30 text-muted-foreground hover:border-border"
                    }`}
                  >
                    {Math.floor(t / 60)}m
                  </button>
                ))}
              </div>
            </div>

            {/* Point System */}
            <div>
              <label className="font-display text-sm font-bold text-foreground uppercase tracking-wider mb-3 block">Point System</label>
              <div className="grid gap-2">
                {POINT_SYSTEMS.map(ps => (
                  <button
                    key={ps.id}
                    onClick={() => setPointSystem(ps.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                      pointSystem === ps.id
                        ? "border-primary bg-primary/10"
                        : "border-border/50 bg-secondary/30 hover:border-border"
                    }`}
                  >
                    <Target className={`w-4 h-4 ${pointSystem === ps.id ? "text-primary" : "text-muted-foreground"}`} />
                    <div>
                      <p className="font-body font-semibold text-foreground text-sm">{ps.label}</p>
                      <p className="font-body text-xs text-muted-foreground">{ps.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Penalties */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-sm font-bold text-foreground uppercase tracking-wider">Wrong Answer Penalty</p>
                <p className="font-body text-xs text-muted-foreground">Add time for wrong answers</p>
              </div>
              <button
                onClick={() => setAllowPenalties(!allowPenalties)}
                className={`w-12 h-6 rounded-full transition-colors ${allowPenalties ? "bg-primary" : "bg-secondary"}`}
              >
                <div className={`w-5 h-5 rounded-full bg-background transition-transform ${allowPenalties ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>
            {allowPenalties && (
              <div>
                <label className="font-body text-xs text-muted-foreground mb-1 block">Penalty per wrong answer (seconds)</label>
                <Input
                  type="number"
                  value={penaltySeconds}
                  onChange={(e) => setPenaltySeconds(Math.max(1, parseInt(e.target.value) || 5))}
                  className="w-24 bg-secondary/50 border-border/50 font-body"
                  min={1}
                  max={30}
                />
              </div>
            )}

            <Button variant="neon" size="xl" className="w-full" onClick={handleCreate} disabled={creating || !opponentId}>
              {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Send Battle Invite</>}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
