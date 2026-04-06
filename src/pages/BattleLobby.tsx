import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Swords, Clock, Target, Zap, Shield, Loader2, CheckCircle2, XCircle,
  Send, Timer, Crown, Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const AVATARS_MAP: Record<string, string> = {
  avatar_cyber_skull: "💀", avatar_neon_cat: "🐱", avatar_glitch_bot: "🤖",
  avatar_plasma_fox: "🦊", avatar_quantum_owl: "🦉", avatar_void_wolf: "🐺",
  avatar_pixel_dragon: "🐉", avatar_star_panda: "🐼",
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

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
  battle_puzzles: any[];
  creator_score: any;
  opponent_score: any;
  creator_answers: any[];
  opponent_answers: any[];
}

export default function BattleLobby() {
  const { battleId } = useParams<{ battleId: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [battle, setBattle] = useState<Battle | null>(null);
  const [creatorProfile, setCreatorProfile] = useState<any>(null);
  const [opponentProfile, setOpponentProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Gameplay state
  const [puzzles, setPuzzles] = useState<{ round: number; question: string }[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [answer, setAnswer] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [playerDone, setPlayerDone] = useState(false);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [myScore, setMyScore] = useState({ correct: 0, penalties: 0, total_time: 0 });
  const [starting, setStarting] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }

    const load = async () => {
      const { data } = await supabase.from("battles" as any).select("*").eq("id", battleId).single();
      if (!data) { setLoading(false); return; }
      setBattle(data as any);

      const ids = [(data as any).creator_id, (data as any).opponent_id].filter(Boolean);
      const { data: profiles } = await supabase
        .from("profiles_public" as any).select("user_id, username, avatar_url, is_pro").in("user_id", ids);
      if (profiles) {
        const map = new Map((profiles as any[]).map(p => [p.user_id, p]));
        setCreatorProfile(map.get((data as any).creator_id) ?? null);
        if ((data as any).opponent_id) setOpponentProfile(map.get((data as any).opponent_id) ?? null);
      }

      // If battle is playing and we have puzzles, resume
      if ((data as any).status === "playing" && (data as any).battle_puzzles?.length > 0) {
        const bp = (data as any).battle_puzzles;
        setPuzzles(bp.map((p: any, i: number) => ({ round: i + 1, question: p.question })));
        const isCreator = user.id === (data as any).creator_id;
        const myAnswers = isCreator ? (data as any).creator_answers : (data as any).opponent_answers;
        if (myAnswers?.length > 0) {
          if (myAnswers.length >= bp.length) {
            setPlayerDone(true);
            setMyScore(isCreator ? (data as any).creator_score : (data as any).opponent_score);
          } else {
            setCurrentRound(myAnswers.length + 1);
            setMyScore(isCreator ? (data as any).creator_score : (data as any).opponent_score);
          }
        }
        if (!playerDone && myAnswers?.length < bp.length) {
          setRunning(true);
        }
      }

      setLoading(false);
    };
    load();
  }, [user, authLoading, battleId, navigate]);

  // Timer
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  // Realtime
  useEffect(() => {
    if (!battleId) return;
    const channel = supabase
      .channel(`battle-${battleId}`)
      .on("postgres_changes", {
        event: "UPDATE", schema: "public", table: "battles", filter: `id=eq.${battleId}`,
      }, (payload) => {
        setBattle(payload.new as Battle);
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [battleId]);

  const acceptBattle = async () => {
    if (!battle || !user) return;
    await supabase.from("battles" as any).update({ status: "accepted", opponent_id: user.id }).eq("id", battle.id);
    toast.success("Battle accepted!");
  };

  const declineBattle = async () => {
    if (!battle || !user) return;
    await supabase.from("battles" as any).update({ status: "declined" }).eq("id", battle.id);
    navigate("/friends");
  };

  const startBattle = async () => {
    if (!battle || !user) return;
    setStarting(true);
    const { data, error } = await supabase.functions.invoke("battle-start", {
      body: { battle_id: battle.id },
    });
    if (error || !data?.success) {
      toast.error(data?.error || "Failed to start battle");
      setStarting(false);
      return;
    }
    setPuzzles(data.puzzles);
    setCurrentRound(1);
    setElapsed(0);
    setRunning(true);
    setStarting(false);
  };

  const handleSubmitAnswer = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!battle || !user || submitting || !answer.trim()) return;
    setSubmitting(true);

    const { data, error } = await supabase.functions.invoke("battle-answer", {
      body: { battle_id: battle.id, round: currentRound, answer: answer.trim(), elapsed },
    });
    setSubmitting(false);

    if (error) { toast.error("Submit failed"); return; }
    if (!data.correct) {
      setWrongFlash(true);
      setTimeout(() => setWrongFlash(false), 600);
      toast.error(`Wrong! +${data.penalty}s penalty`);
      setAnswer("");
      return;
    }

    setMyScore(data.score);
    setAnswer("");

    if (data.player_done) {
      setRunning(false);
      setPlayerDone(true);
      if (data.battle_finished) {
        toast.success("Battle finished!");
      } else {
        toast.success("You're done! Waiting for opponent...");
      }
    } else {
      toast.success(`Round ${currentRound} correct!`);
      setCurrentRound(r => r + 1);
      setElapsed(0);
    }
  }, [battle, user, submitting, answer, currentRound, elapsed]);

  if (authLoading || loading) {
    return <div className="min-h-screen bg-background"><Navbar /><div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div></div>;
  }

  if (!battle) {
    return <div className="min-h-screen bg-background"><Navbar /><div className="flex items-center justify-center min-h-screen"><p className="font-body text-muted-foreground">Battle not found.</p></div></div>;
  }

  const isCreator = user?.id === battle.creator_id;
  const isOpponent = user?.id === battle.opponent_id;
  const modeIcon = battle.game_mode === "survival" ? Shield : battle.game_mode === "blitz" ? Clock : Zap;
  const currentPuzzle = puzzles[currentRound - 1] ?? null;

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4 max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-6">
            <Swords className="w-12 h-12 text-primary mx-auto mb-3" />
            <h1 className="font-display text-3xl font-bold text-foreground">
              BATTLE <span className="text-primary text-glow">
                {battle.status === "playing" ? "ARENA" : battle.status === "finished" ? "RESULTS" : "LOBBY"}
              </span>
            </h1>
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/30">
              <span className={`w-2 h-2 rounded-full ${
                battle.status === "pending" ? "bg-neon-amber animate-pulse" :
                battle.status === "accepted" ? "bg-primary" :
                battle.status === "playing" ? "bg-green-500 animate-pulse" :
                battle.status === "finished" ? "bg-neon-amber" : "bg-destructive"
              }`} />
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
                {battle.creator_score && (
                  <p className="font-display text-xs text-muted-foreground mt-1">
                    {battle.creator_score.correct}/{battle.rounds} · {formatTime(battle.creator_score.total_time || 0)}
                  </p>
                )}
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
                {battle.opponent_score && (
                  <p className="font-display text-xs text-muted-foreground mt-1">
                    {battle.opponent_score.correct}/{battle.rounds} · {formatTime(battle.opponent_score.total_time || 0)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Battle settings (shown when not playing) */}
          {battle.status !== "playing" && (
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
                  <Target className="w-4 h-4 text-primary inline mr-1" />
                  <span className="font-body text-xs text-muted-foreground">Rounds: </span>
                  <span className="font-display font-bold text-foreground text-sm">{battle.rounds}</span>
                </div>
                <div className="bg-secondary/30 rounded-xl p-3 border border-border/20">
                  <Clock className="w-4 h-4 text-primary inline mr-1" />
                  <span className="font-body text-xs text-muted-foreground">Max: </span>
                  <span className="font-display font-bold text-foreground text-sm">{formatTime(battle.max_time_seconds)}</span>
                </div>
                <div className="bg-secondary/30 rounded-xl p-3 border border-border/20">
                  <Zap className="w-4 h-4 text-primary inline mr-1" />
                  <span className="font-body text-xs text-muted-foreground">Points: </span>
                  <span className="font-display font-bold text-foreground text-sm capitalize">{battle.point_system}</span>
                </div>
              </div>
            </div>
          )}

          {/* PENDING — opponent actions */}
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
              <p className="font-body text-muted-foreground text-sm">Waiting for opponent...</p>
            </div>
          )}

          {/* ACCEPTED — start button */}
          {battle.status === "accepted" && (isCreator || isOpponent) && (
            <div className="text-center">
              <p className="font-display text-xl font-bold text-primary text-glow mb-4">Battle Accepted!</p>
              <Button variant="neon" size="xl" className="w-full" onClick={startBattle} disabled={starting}>
                {starting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Swords className="w-5 h-5" />}
                Start Battle
              </Button>
            </div>
          )}

          {/* PLAYING — game area */}
          {battle.status === "playing" && !playerDone && currentPuzzle && (
            <div className="glass rounded-2xl border border-border/50 p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="font-body text-xs text-muted-foreground">Round {currentRound}/{puzzles.length}</span>
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-primary" />
                  <span className="font-display text-2xl font-bold tabular-nums text-foreground">{formatTime(elapsed)}</span>
                </div>
              </div>

              <div className="h-2 bg-secondary/50 rounded-full overflow-hidden mb-4">
                <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${((currentRound - 1) / puzzles.length) * 100}%` }} />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentRound}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className={`rounded-xl p-5 mb-4 border transition-colors ${
                    wrongFlash ? "bg-destructive/20 border-destructive/50" : "bg-secondary/50 border-border/30"
                  }`}
                >
                  <p className="font-body text-foreground text-lg">{currentPuzzle.question}</p>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-2 mb-4 text-xs font-body text-muted-foreground">
                <span>Score: {myScore.correct} correct</span>
                {myScore.penalties > 0 && <span className="text-destructive">+{myScore.penalties}s penalties</span>}
              </div>

              <form onSubmit={handleSubmitAnswer} className="flex gap-3">
                <Input value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Your answer..."
                  className="flex-1 bg-secondary/50 border-border/50 font-body" autoFocus />
                <Button type="submit" variant="neon" disabled={!answer.trim() || submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </form>
            </div>
          )}

          {/* PLAYING — player done, waiting */}
          {battle.status === "playing" && playerDone && (
            <div className="glass rounded-2xl border border-primary/30 p-6 text-center">
              <CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-2" />
              <p className="font-display text-xl font-bold text-foreground mb-1">You're Done!</p>
              <p className="font-body text-sm text-muted-foreground mb-2">
                {myScore.correct}/{puzzles.length} correct · {formatTime(myScore.total_time)}
              </p>
              <Loader2 className="w-5 h-5 text-primary animate-spin mx-auto" />
              <p className="font-body text-xs text-muted-foreground mt-2">Waiting for opponent to finish...</p>
            </div>
          )}

          {/* FINISHED */}
          {battle.status === "finished" && (
            <div className="glass rounded-2xl border border-neon-amber/30 p-6 text-center">
              <Trophy className="w-12 h-12 text-neon-amber mx-auto mb-3" />
              <p className="font-display text-2xl font-bold text-foreground mb-2">Battle Over!</p>
              {battle.winner_id === user?.id ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/40 mb-4">
                  <Crown className="w-5 h-5 text-primary" />
                  <span className="font-display font-bold text-primary">YOU WIN!</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/20 border border-destructive/40 mb-4">
                  <XCircle className="w-5 h-5 text-destructive" />
                  <span className="font-display font-bold text-destructive">You Lost</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-secondary/30 rounded-xl p-3 border border-border/20">
                  <p className="font-body text-xs text-muted-foreground mb-1">{creatorProfile?.username ?? "Creator"}</p>
                  <p className="font-display font-bold text-foreground">{battle.creator_score?.correct ?? 0}/{battle.rounds}</p>
                  <p className="font-body text-xs text-muted-foreground">{formatTime(battle.creator_score?.total_time ?? 0)}</p>
                </div>
                <div className="bg-secondary/30 rounded-xl p-3 border border-border/20">
                  <p className="font-body text-xs text-muted-foreground mb-1">{opponentProfile?.username ?? "Opponent"}</p>
                  <p className="font-display font-bold text-foreground">{battle.opponent_score?.correct ?? 0}/{battle.rounds}</p>
                  <p className="font-body text-xs text-muted-foreground">{formatTime(battle.opponent_score?.total_time ?? 0)}</p>
                </div>
              </div>
              <Button variant="neon-outline" className="mt-6" onClick={() => navigate("/friends")}>
                Back to Friends
              </Button>
            </div>
          )}

          {battle.status === "declined" && (
            <div className="text-center">
              <XCircle className="w-10 h-10 text-destructive mx-auto mb-2" />
              <p className="font-display text-xl font-bold text-foreground">Battle Declined</p>
              <Button variant="neon-outline" className="mt-4" onClick={() => navigate("/friends")}>Back to Friends</Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
