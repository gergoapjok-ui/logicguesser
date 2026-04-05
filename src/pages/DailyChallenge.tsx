import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Timer, Send, CheckCircle2, Clock, Loader2, AlertTriangle, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import AdPlaceholder from "@/components/AdPlaceholder";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function getStreakMultiplier(streak: number): number {
  return Math.min(1.5, 1 + (streak * 0.1));
}

export default function DailyChallenge() {
  const { user, loading: authLoading, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [puzzle, setPuzzle] = useState<{ id: string; question: string; difficulty: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [completedTime, setCompletedTime] = useState<number | null>(null);

  const [answer, setAnswer] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [solved, setSolved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);
  const [earnedCredits, setEarnedCredits] = useState<number | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }

    const load = async () => {
      const today = new Date().toISOString().split("T")[0];
      // Query puzzles_public view (no answer column exposed)
      const { data: puzzleData } = await supabase
        .from("puzzles_public" as any)
        .select("id, question, difficulty")
        .eq("puzzle_date", today)
        .single();

      if (!puzzleData) { setPuzzle(null); setLoading(false); return; }
      setPuzzle(puzzleData as any);

      const { data: existing } = await supabase
        .from("leaderboard")
        .select("time_taken")
        .eq("user_id", user.id)
        .eq("puzzle_id", (puzzleData as any).id)
        .maybeSingle();

      if (existing) {
        setAlreadyCompleted(true);
        setCompletedTime(existing.time_taken);
      }
      setLoading(false);
    };
    load();
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const handleStart = () => { setStarted(true); setRunning(true); setElapsed(0); };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!puzzle || !user || submitting) return;

    const trimmed = answer.trim();
    if (!trimmed) return;

    setSubmitting(true);

    // Call the secure edge function instead of checking client-side
    const { data, error } = await supabase.functions.invoke("validate-answer", {
      body: {
        puzzle_id: puzzle.id,
        answer: trimmed,
        time_taken: elapsed,
      },
    });

    setSubmitting(false);

    if (error) {
      toast.error("Failed to submit answer. Please try again.");
      return;
    }

    if (!data.correct) {
      toast.error("Wrong answer! Try again.");
      return;
    }

    if (data.already_completed) {
      toast.info("You already completed today's challenge!");
      setAlreadyCompleted(true);
      setRunning(false);
      return;
    }

    // Correct and recorded!
    setRunning(false);
    setSolved(true);
    setEarnedCredits(data.credit_reward);
    refreshProfile();
    toast.success(`Correct! Solved in ${formatTime(data.time_taken)} — +${data.credit_reward} Credits! +50 XP`);
  }, [answer, puzzle, user, elapsed, submitting, refreshProfile]);

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
      <div className="flex items-center justify-center min-h-screen pt-16 px-4">
        <div className="flex gap-8 w-full max-w-4xl justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg"
          >
            {alreadyCompleted && (
              <div className="glass rounded-2xl border border-border/50 p-8 text-center">
                <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
                <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                  CHALLENGE <span className="text-primary text-glow">COMPLETE</span>
                </h1>
                {profile && profile.current_streak > 0 && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 mb-3">
                    <Flame className="w-4 h-4 text-destructive" />
                    <span className="font-display text-sm font-bold text-destructive">{profile.current_streak} day streak</span>
                  </div>
                )}
                <p className="font-body text-muted-foreground mb-4">
                  You solved today's puzzle in <span className="text-primary font-semibold">{formatTime(completedTime!)}</span>
                </p>
                <p className="font-body text-muted-foreground text-sm">Come back tomorrow for a new challenge!</p>
                <Button variant="neon-outline" size="lg" className="mt-6" onClick={() => navigate("/leaderboard")}>
                  View Leaderboard
                </Button>
              </div>
            )}

            {!alreadyCompleted && !puzzle && (
              <div className="glass rounded-2xl border border-border/50 p-8 text-center">
                <AlertTriangle className="w-12 h-12 text-neon-amber mx-auto mb-4" />
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">No Puzzle Today</h2>
                <p className="font-body text-muted-foreground">Check back tomorrow!</p>
              </div>
            )}

            {!alreadyCompleted && puzzle && (
              <div className="glass rounded-2xl border border-border/50 p-8">
                <div className="text-center mb-6">
                  <h1 className="font-display text-3xl font-bold text-foreground mb-1">
                    DAILY <span className="text-primary text-glow">CHALLENGE</span>
                  </h1>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-body bg-primary/10 text-primary border border-primary/30 capitalize">
                    {puzzle.difficulty}
                  </span>
                  {profile && profile.current_streak > 0 && (
                    <div className="mt-2 inline-flex items-center gap-1 text-sm font-body text-muted-foreground">
                      <Flame className="w-3.5 h-3.5 text-destructive" />
                      {profile.current_streak} day streak — {Math.round(getStreakMultiplier(profile.current_streak) * 100)}% credit bonus!
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2 mb-6">
                  <Timer className="w-5 h-5 text-primary" />
                  <span className="font-display text-4xl font-bold text-foreground tabular-nums">
                    {formatTime(elapsed)}
                  </span>
                </div>

                {!started ? (
                  <div className="text-center">
                    <p className="font-body text-muted-foreground text-sm mb-6">
                      The timer starts when you press the button. You get one attempt per day.
                    </p>
                    <Button variant="neon" size="xl" onClick={handleStart}>
                      <Clock className="w-5 h-5" />
                      Start Challenge
                    </Button>
                  </div>
                ) : solved ? (
                  <div className="text-center">
                    <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
                    <p className="font-display text-xl font-bold text-foreground mb-1">Correct!</p>
                    <p className="font-body text-muted-foreground mb-2">
                      Time: <span className="text-primary font-semibold">{formatTime(elapsed)}</span>
                    </p>
                    {earnedCredits && (
                      <p className="font-body text-primary text-sm font-semibold mb-4">
                        +{earnedCredits} Credits · +50 XP
                      </p>
                    )}
                    <Button variant="neon-outline" size="lg" onClick={() => navigate("/leaderboard")}>
                      View Leaderboard
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="bg-secondary/50 rounded-xl p-6 mb-6 border border-border/30">
                      <p className="font-body text-foreground text-lg leading-relaxed">
                        {puzzle.question}
                      </p>
                    </div>
                    <form onSubmit={handleSubmit} className="flex gap-3">
                      <Input
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Your answer..."
                        className="flex-1 bg-secondary/50 border-border/50 font-body"
                        autoFocus
                      />
                      <Button type="submit" variant="neon" disabled={!answer.trim() || submitting}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </>
                )}
              </div>
            )}
          </motion.div>

          <aside className="hidden lg:block w-64 flex-shrink-0 self-start pt-4">
            <AdPlaceholder />
          </aside>
        </div>
      </div>
    </div>
  );
}
