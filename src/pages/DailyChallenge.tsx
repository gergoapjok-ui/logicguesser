import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Timer, Send, CheckCircle2, Clock, Loader2, AlertTriangle } from "lucide-react";
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

export default function DailyChallenge() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [puzzle, setPuzzle] = useState<{ id: string; question: string; answer: string; difficulty: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [completedTime, setCompletedTime] = useState<number | null>(null);

  const [answer, setAnswer] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [solved, setSolved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch today's puzzle + check if already completed
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }

    const load = async () => {
      const today = new Date().toISOString().split("T")[0];

      const { data: puzzleData } = await supabase
        .from("puzzles")
        .select("id, question, answer, difficulty")
        .eq("puzzle_date", today)
        .single();

      if (!puzzleData) {
        setPuzzle(null);
        setLoading(false);
        return;
      }

      setPuzzle(puzzleData);

      // Check if user already completed today
      const { data: existing } = await supabase
        .from("leaderboard")
        .select("time_taken")
        .eq("user_id", user.id)
        .eq("puzzle_id", puzzleData.id)
        .maybeSingle();

      if (existing) {
        setAlreadyCompleted(true);
        setCompletedTime(existing.time_taken);
      }

      setLoading(false);
    };

    load();
  }, [user, authLoading, navigate]);

  // Timer
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const handleStart = () => {
    setStarted(true);
    setRunning(true);
    setElapsed(0);
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!puzzle || !user || submitting) return;

    const trimmed = answer.trim().toLowerCase();
    const correct = puzzle.answer.trim().toLowerCase();

    if (trimmed !== correct) {
      toast.error("Wrong answer! Try again.");
      return;
    }

    setRunning(false);
    setSolved(true);
    setSubmitting(true);

    const { error } = await supabase.from("leaderboard").insert({
      user_id: user.id,
      puzzle_id: puzzle.id,
      time_taken: elapsed,
    });

    setSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        toast.error("You already submitted a score for today!");
      } else {
        toast.error("Failed to save score.");
      }
    } else {
      // Award 100 credits
      const { data: profile } = await supabase
        .from("profiles")
        .select("credits")
        .eq("user_id", user.id)
        .single();
      if (profile) {
        await supabase
          .from("profiles")
          .update({ credits: profile.credits + 100 })
          .eq("user_id", user.id);
      }
      toast.success(`Correct! Solved in ${formatTime(elapsed)} — +100 Credits!`);
    }
  }, [answer, puzzle, user, elapsed, submitting]);

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          {/* Already completed */}
          {alreadyCompleted && (
            <div className="glass rounded-2xl border border-border/50 p-8 text-center">
              <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                CHALLENGE <span className="text-primary text-glow">COMPLETE</span>
              </h1>
              <p className="font-body text-muted-foreground mb-4">
                You solved today's puzzle in{" "}
                <span className="text-primary font-semibold">{formatTime(completedTime!)}</span>
              </p>
              <p className="font-body text-muted-foreground text-sm">Come back tomorrow for a new challenge!</p>
              <Button variant="neon-outline" size="lg" className="mt-6" onClick={() => navigate("/leaderboard")}>
                View Leaderboard
              </Button>
            </div>
          )}

          {/* No puzzle available */}
          {!alreadyCompleted && !puzzle && (
            <div className="glass rounded-2xl border border-border/50 p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-neon-amber mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">No Puzzle Today</h2>
              <p className="font-body text-muted-foreground">Check back tomorrow!</p>
            </div>
          )}

          {/* Puzzle available */}
          {!alreadyCompleted && puzzle && (
            <div className="glass rounded-2xl border border-border/50 p-8">
              <div className="text-center mb-6">
                <h1 className="font-display text-3xl font-bold text-foreground mb-1">
                  DAILY <span className="text-primary text-glow">CHALLENGE</span>
                </h1>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-body bg-primary/10 text-primary border border-primary/30 capitalize">
                  {puzzle.difficulty}
                </span>
              </div>

              {/* Timer */}
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
                  <p className="font-body text-muted-foreground mb-4">
                    Time: <span className="text-primary font-semibold">{formatTime(elapsed)}</span>
                  </p>
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
      </div>
    </div>
  );
}
