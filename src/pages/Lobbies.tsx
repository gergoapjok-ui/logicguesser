import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Crown, Loader2, Plus, Swords, Clock, Target, Zap, Shield,
  Send, Timer, CheckCircle2, XCircle, Trophy,
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
  avatar_diamond_phoenix: "🔥", avatar_golden_unicorn: "🦄",
  avatar_crystal_lion: "🦁", avatar_royal_eagle: "🦅",
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

interface Lobby {
  id: string;
  creator_id: string;
  name: string;
  max_players: number;
  game_mode: string;
  rounds: number;
  max_time_seconds: number;
  point_system: string;
  allow_penalties: boolean;
  penalty_seconds: number;
  status: string;
  lobby_puzzles: any[];
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
}

export default function Lobbies() {
  const { user, loading: authLoading, profile } = useAuth();
  const navigate = useNavigate();
  const isPro = profile?.is_pro ?? false;

  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"browse" | "create" | "active">("browse");

  // Create form
  const [name, setName] = useState("Battle Lobby");
  const [maxPlayers, setMaxPlayers] = useState(10);
  const [gameMode, setGameMode] = useState("standard");
  const [rounds, setRounds] = useState(5);
  const [maxTime, setMaxTime] = useState(300);
  const [pointSystem, setPointSystem] = useState("speed");
  const [creating, setCreating] = useState(false);

  // Active lobby state
  const [activeLobby, setActiveLobby] = useState<Lobby | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [puzzles, setPuzzles] = useState<{ round: number; question: string }[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [answer, setAnswer] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [playerDone, setPlayerDone] = useState(false);
  const [myScore, setMyScore] = useState({ correct: 0, penalties: 0, total_time: 0 });
  const [wrongFlash, setWrongFlash] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }
    fetchLobbies();
  }, [user, authLoading]);

  const fetchLobbies = async () => {
    const { data } = await supabase.from("lobbies" as any).select("*").in("status", ["waiting", "playing"]).order("created_at", { ascending: false }).limit(20);
    setLobbies((data as any) ?? []);
    setLoading(false);
  };

  // Realtime for lobbies list
  useEffect(() => {
    const channel = supabase.channel("lobbies-list")
      .on("postgres_changes", { event: "*", schema: "public", table: "lobbies" }, () => fetchLobbies())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Timer
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  // Active lobby realtime
  useEffect(() => {
    if (!activeLobby) return;
    const channel = supabase.channel(`lobby-${activeLobby.id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "lobbies", filter: `id=eq.${activeLobby.id}` }, (payload) => {
        const updated = payload.new as Lobby;
        setActiveLobby(updated);
        if (updated.status === "playing" && updated.lobby_puzzles?.length > 0 && puzzles.length === 0) {
          setPuzzles(updated.lobby_puzzles.map((p: any, i: number) => ({ round: i + 1, question: p.question })));
          setCurrentRound(1);
          setElapsed(0);
          setRunning(true);
        }
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "lobby_participants", filter: `lobby_id=eq.${activeLobby.id}` }, async () => {
        const { data } = await supabase.from("lobby_participants" as any).select("*").eq("lobby_id", activeLobby.id);
        if (data) setParticipants(data as any);
      })
      .subscribe();

    // Fetch participants
    supabase.from("lobby_participants" as any).select("*").eq("lobby_id", activeLobby.id).then(({ data }) => {
      if (data) setParticipants(data as any);
    });

    return () => { supabase.removeChannel(channel); };
  }, [activeLobby?.id, puzzles.length]);

  const handleCreate = async () => {
    setCreating(true);
    const { data, error } = await supabase.functions.invoke("lobby-create", {
      body: { name, max_players: maxPlayers, game_mode: gameMode, rounds, max_time_seconds: maxTime, point_system: pointSystem },
    });
    if (error || !data?.success) {
      toast.error(data?.error || "Failed to create lobby");
      setCreating(false);
      return;
    }
    toast.success("Lobby created!");
    // Enter the lobby
    const { data: lobbyData } = await supabase.from("lobbies" as any).select("*").eq("id", data.lobby_id).single();
    setActiveLobby(lobbyData as any);
    setTab("active");
    setCreating(false);
  };

  const handleJoin = async (lobbyId: string) => {
    setJoiningId(lobbyId);
    const { data, error } = await supabase.functions.invoke("lobby-join", {
      body: { lobby_id: lobbyId },
    });
    if (error || !data?.success) {
      toast.error(data?.error || "Failed to join");
      setJoiningId(null);
      return;
    }
    toast.success("Joined lobby!");
    const { data: lobbyData } = await supabase.from("lobbies" as any).select("*").eq("id", lobbyId).single();
    setActiveLobby(lobbyData as any);
    setTab("active");
    setJoiningId(null);
  };

  const handleStart = async () => {
    if (!activeLobby) return;
    const { data, error } = await supabase.functions.invoke("lobby-start", {
      body: { lobby_id: activeLobby.id },
    });
    if (error || !data?.success) {
      toast.error(data?.error || "Failed to start");
      return;
    }
    setPuzzles(data.puzzles);
    setCurrentRound(1);
    setElapsed(0);
    setRunning(true);
  };

  const handleSubmitAnswer = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLobby || !user || submitting || !answer.trim()) return;
    setSubmitting(true);

    const { data, error } = await supabase.functions.invoke("lobby-answer", {
      body: { lobby_id: activeLobby.id, round: currentRound, answer: answer.trim(), elapsed },
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
      toast.success(data.lobby_finished ? "Lobby finished!" : "You're done! Waiting for others...");
    } else {
      toast.success(`Round ${currentRound} correct!`);
      setCurrentRound(r => r + 1);
      setElapsed(0);
    }
  }, [activeLobby, user, submitting, answer, currentRound, elapsed]);

  const currentPuzzle = puzzles[currentRound - 1] ?? null;

  if (authLoading || loading) {
    return <div className="min-h-screen bg-background"><Navbar /><div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div></div>;
  }

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <Users className="w-10 h-10 text-primary mx-auto mb-3" />
            <h1 className="font-display text-3xl font-bold text-foreground">
              BATTLE <span className="text-primary text-glow">LOBBIES</span>
            </h1>
            <p className="font-body text-muted-foreground text-sm mt-1">
              Join or create multiplayer battle rooms
            </p>
          </div>

          {/* Tabs */}
          {!activeLobby && (
            <div className="flex gap-2 mb-6">
              <Button variant={tab === "browse" ? "neon" : "neon-outline"} size="sm" onClick={() => setTab("browse")}>
                <Swords className="w-3.5 h-3.5" /> Browse
              </Button>
              {isPro && (
                <Button variant={tab === "create" ? "neon" : "neon-outline"} size="sm" onClick={() => setTab("create")}>
                  <Plus className="w-3.5 h-3.5" /> Create
                </Button>
              )}
              {!isPro && (
                <Button variant="ghost" size="sm" onClick={() => navigate("/pro")} className="text-neon-amber">
                  <Crown className="w-3.5 h-3.5" /> Pro to Create
                </Button>
              )}
            </div>
          )}

          {/* Browse lobbies */}
          {tab === "browse" && !activeLobby && (
            <div className="space-y-3">
              {lobbies.length === 0 ? (
                <div className="glass rounded-xl border border-border/50 p-8 text-center">
                  <p className="font-body text-muted-foreground">No active lobbies. {isPro ? "Create one!" : "Check back later!"}</p>
                </div>
              ) : lobbies.filter(l => l.status === "waiting").map(lobby => (
                <div key={lobby.id} className="glass rounded-xl border border-border/50 p-4 flex items-center justify-between">
                  <div>
                    <p className="font-display font-bold text-foreground text-sm">{lobby.name}</p>
                    <div className="flex items-center gap-3 text-xs font-body text-muted-foreground mt-1">
                      <span className="capitalize">{lobby.game_mode}</span>
                      <span>{lobby.rounds} rounds</span>
                      <span>{formatTime(lobby.max_time_seconds)}</span>
                      <span className="capitalize">{lobby.point_system}</span>
                    </div>
                  </div>
                  <Button variant="neon" size="sm" onClick={() => handleJoin(lobby.id)} disabled={joiningId === lobby.id}>
                    {joiningId === lobby.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Join"}
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Create lobby */}
          {tab === "create" && !activeLobby && isPro && (
            <div className="glass rounded-2xl border border-border/50 p-6 space-y-5">
              <div>
                <label className="font-display text-sm font-bold text-foreground uppercase tracking-wider mb-2 block">Lobby Name</label>
                <Input value={name} onChange={e => setName(e.target.value)} className="bg-secondary/50 border-border/50 font-body" maxLength={50} />
              </div>
              <div>
                <label className="font-display text-sm font-bold text-foreground uppercase tracking-wider mb-2 block">Max Players</label>
                <div className="flex gap-2">
                  {[2, 4, 6, 8, 10].map(n => (
                    <button key={n} onClick={() => setMaxPlayers(n)}
                      className={`flex-1 py-2 rounded-lg font-display font-bold text-sm border transition-all ${maxPlayers === n ? "border-primary bg-primary/10 text-primary" : "border-border/50 bg-secondary/30 text-muted-foreground"}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-display text-sm font-bold text-foreground uppercase tracking-wider mb-2 block">Rounds</label>
                <div className="flex gap-2">
                  {[3, 5, 7, 10].map(n => (
                    <button key={n} onClick={() => setRounds(n)}
                      className={`flex-1 py-2 rounded-lg font-display font-bold text-sm border transition-all ${rounds === n ? "border-primary bg-primary/10 text-primary" : "border-border/50 bg-secondary/30 text-muted-foreground"}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <Button variant="neon" size="xl" className="w-full" onClick={handleCreate} disabled={creating}>
                {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5" /> Create Lobby</>}
              </Button>
            </div>
          )}

          {/* Active lobby */}
          {activeLobby && (
            <div className="space-y-4">
              <div className="glass rounded-2xl border border-border/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-lg font-bold text-foreground">{activeLobby.name}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-display font-bold ${
                    activeLobby.status === "waiting" ? "bg-neon-amber/20 text-neon-amber" :
                    activeLobby.status === "playing" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                  }`}>{activeLobby.status.toUpperCase()}</span>
                </div>

                {/* Participants */}
                <div className="space-y-2 mb-4">
                  <p className="font-body text-xs text-muted-foreground">Players ({participants.length}/{activeLobby.max_players})</p>
                  <div className="flex flex-wrap gap-2">
                    {participants.map(p => (
                      <div key={p.id} className={`px-3 py-1.5 rounded-lg border text-xs font-body flex items-center gap-1.5 ${
                        p.finished ? "border-primary/40 bg-primary/10" : "border-border/30 bg-secondary/30"
                      }`}>
                        <span>{p.user_id === user?.id ? "You" : p.user_id.slice(0, 6)}</span>
                        {p.finished && <CheckCircle2 className="w-3 h-3 text-primary" />}
                        {p.score && <span className="text-muted-foreground">{(p.score as any).correct}pts</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Start button (creator only, waiting status) */}
                {activeLobby.status === "waiting" && activeLobby.creator_id === user?.id && participants.length >= 2 && (
                  <Button variant="neon" size="xl" className="w-full" onClick={handleStart}>
                    <Swords className="w-5 h-5" /> Start Battle
                  </Button>
                )}
                {activeLobby.status === "waiting" && activeLobby.creator_id !== user?.id && (
                  <p className="font-body text-sm text-muted-foreground text-center">Waiting for host to start...</p>
                )}
              </div>

              {/* Playing */}
              {activeLobby.status === "playing" && !playerDone && currentPuzzle && (
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
                    <motion.div key={currentRound} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                      className={`rounded-xl p-5 mb-4 border transition-colors ${wrongFlash ? "bg-destructive/20 border-destructive/50" : "bg-secondary/50 border-border/30"}`}>
                      <p className="font-body text-foreground text-lg">{currentPuzzle.question}</p>
                    </motion.div>
                  </AnimatePresence>
                  <div className="flex items-center gap-2 mb-4 text-xs font-body text-muted-foreground">
                    <span>Score: {myScore.correct} correct</span>
                    {myScore.penalties > 0 && <span className="text-destructive">+{myScore.penalties}s penalties</span>}
                  </div>
                  <form onSubmit={handleSubmitAnswer} className="flex gap-3">
                    <Input value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Your answer..." className="flex-1 bg-secondary/50 border-border/50 font-body" autoFocus />
                    <Button type="submit" variant="neon" disabled={!answer.trim() || submitting}>
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                  </form>
                </div>
              )}

              {/* Done waiting */}
              {activeLobby.status === "playing" && playerDone && (
                <div className="glass rounded-2xl border border-primary/30 p-6 text-center">
                  <CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-2" />
                  <p className="font-display text-xl font-bold text-foreground mb-1">You're Done!</p>
                  <p className="font-body text-sm text-muted-foreground">{myScore.correct}/{puzzles.length} correct · {formatTime(myScore.total_time)}</p>
                  <Loader2 className="w-5 h-5 text-primary animate-spin mx-auto mt-3" />
                  <p className="font-body text-xs text-muted-foreground mt-1">Waiting for others...</p>
                </div>
              )}

              {/* Finished */}
              {activeLobby.status === "finished" && (
                <div className="glass rounded-2xl border border-neon-amber/30 p-6 text-center">
                  <Trophy className="w-12 h-12 text-neon-amber mx-auto mb-3" />
                  <p className="font-display text-2xl font-bold text-foreground mb-4">Lobby Complete!</p>
                  <div className="space-y-2">
                    {[...participants]
                      .sort((a, b) => (b.score?.correct ?? 0) - (a.score?.correct ?? 0) || (a.score?.total_time ?? 0) - (b.score?.total_time ?? 0))
                      .map((p, i) => (
                        <div key={p.id} className={`flex items-center justify-between p-3 rounded-lg border ${i === 0 ? "border-neon-amber/40 bg-neon-amber/10" : "border-border/20 bg-secondary/30"}`}>
                          <div className="flex items-center gap-2">
                            <span className="font-display font-bold text-sm text-foreground">{i + 1}.</span>
                            <span className="font-body text-sm text-foreground">{p.user_id === user?.id ? "You" : p.user_id.slice(0, 8)}</span>
                          </div>
                          <span className="font-display text-sm font-bold text-primary">{(p.score as any)?.correct ?? 0} pts · {formatTime((p.score as any)?.total_time ?? 0)}</span>
                        </div>
                      ))}
                  </div>
                  <Button variant="neon-outline" className="mt-4" onClick={() => { setActiveLobby(null); setTab("browse"); setPuzzles([]); setPlayerDone(false); setMyScore({ correct: 0, penalties: 0, total_time: 0 }); }}>
                    Back to Lobbies
                  </Button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
