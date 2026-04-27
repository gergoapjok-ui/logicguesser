import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Send, CheckCircle2, Clock, Loader2, AlertTriangle, Flame, XCircle, RotateCcw, Crown, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useGuest } from "@/contexts/GuestContext";
import { supabase } from "@/integrations/supabase/client";
import { isAnswerCorrect } from "@/lib/fuzzyMatch";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import AdPlaceholder, { AD_SLOTS } from "@/components/AdPlaceholder";
import GuestSignupPrompt from "@/components/GuestSignupPrompt";
import { PixVerseSidebarCard } from "@/components/PixVersePromo";
import { useLanguage } from "@/contexts/LanguageContext";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function getStreakMultiplier(streak: number): number {
  return Math.min(1.5, 1 + (streak * 0.1));
}

interface PuzzleTask {
  id: string;
  question: string;
  difficulty: string;
  task_number: number;
}

export default function DailyChallenge() {
  const { user, loading: authLoading, profile, refreshProfile } = useAuth();
  const { guest, awardGuest } = useGuest();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isPro = profile?.is_pro ?? false;
  const isGuest = !user && !!guest;
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);

  const [tasks, setTasks] = useState<PuzzleTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [completedTime, setCompletedTime] = useState<number | null>(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [penalties, setPenalties] = useState(0);
  const [running, setRunning] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);
  const [earnedCredits, setEarnedCredits] = useState<number | null>(null);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [creditRestarting, setCreditRestarting] = useState(false);

  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const isDiscountDay = dayOfYear % 4 === 0;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restartCost = isDiscountDay ? 1000 : 10000;

  useEffect(() => {
    if (authLoading) return;
    if (!user && !guest) { setLoading(false); return; }
    const load = async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data: puzzleData } = await supabase.from("puzzles_public" as any).select("id, question, difficulty, task_number").eq("puzzle_date", today).order("task_number", { ascending: true });
      if (!puzzleData || puzzleData.length === 0) { setTasks([]); setLoading(false); return; }
      setTasks(puzzleData as any);
      if (user) {
        const { data: existing } = await supabase.from("leaderboard").select("time_taken").eq("user_id", user.id).eq("completed_date", today).maybeSingle();
        if (existing) { setAlreadyCompleted(true); setCompletedTime(existing.time_taken); }
        else {
          const { data: progress } = await supabase.from("challenge_progress" as any).select("task_number").eq("user_id", user.id).eq("puzzle_date", today);
          if (progress && progress.length > 0) {
            const completedNums = new Set((progress as any[]).map(p => p.task_number));
            const nextIncomplete = (puzzleData as any[]).findIndex(t => !completedNums.has(t.task_number));
            if (nextIncomplete >= 0) setCurrentTaskIndex(nextIncomplete);
          }
        }
      } else if (guest && guest.lastCompletedDate === today) {
        setAlreadyCompleted(true); setCompletedTime(0);
      }
      setLoading(false);
    };
    load();
  }, [user, guest, authLoading]);

  useEffect(() => {
    if (running) intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const handleStart = () => { setStarted(true); setRunning(true); setElapsed(0); setPenalties(0); };

  const handleRetry = async () => {
    setRetrying(true);
    const { data, error } = await supabase.functions.invoke("daily-retry");
    if (error || !data?.success) { toast.error(data?.error || "Failed"); setRetrying(false); return; }
    toast.success(`Retry activated! ${data.retries_remaining} retries remaining`);
    setAlreadyCompleted(false); setCompletedTime(null); setCurrentTaskIndex(0); setAllDone(false); setStarted(false); setElapsed(0); setPenalties(0); setEarnedCredits(null);
    await refreshProfile(); setRetrying(false);
  };

  const currentTask = tasks[currentTaskIndex] ?? null;
  const totalTime = elapsed + penalties;

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTask || submitting) return;
    if (!user && !guest) return;
    const trimmed = answer.trim();
    if (!trimmed) return;
    setSubmitting(true);

    if (!user && guest) {
      // Guest path: validate via dedicated endpoint, track locally
      const { data, error } = await supabase.functions.invoke("guest-validate-answer", {
        body: { puzzleId: currentTask.id, answer: trimmed },
      });
      setSubmitting(false);
      if (error || !data) { toast.error("Failed"); return; }
      if (!data.correct) {
        setPenalties(p => p + 5); setWrongFlash(true); setTimeout(() => setWrongFlash(false), 600);
        toast.error(t("daily.wrong5s")); setAnswer(""); return;
      }
      const isLast = currentTaskIndex >= tasks.length - 1;
      if (isLast) {
        const totalT = elapsed + penalties;
        setRunning(false); setAllDone(true); setEarnedCredits(25);
        await awardGuest({ addXp: 50, addCredits: 25, completedToday: true, leaderboard: { puzzleId: currentTask.id, timeTaken: totalT } });
        import("@/lib/confetti").then(m => m.celebrate({ particles: 180, duration: 2200 }));
        toast.success(`${t("daily.allComplete")} ${formatTime(totalT)} — +25 ${t("daily.credits")}! +50 XP`);
      } else {
        toast.success(`${t("daily.task")} ${currentTask.task_number} ${t("daily.correct")}`);
        setAnswer(""); setCurrentTaskIndex(i => i + 1);
      }
      return;
    }

    const { data, error } = await supabase.functions.invoke("validate-answer", {
      body: { puzzle_id: currentTask.id, answer: trimmed, task_number: currentTask.task_number, total_elapsed: elapsed, total_penalties: penalties },
    });
    setSubmitting(false);
    if (error) { toast.error("Failed"); return; }
    if (!data.correct) {
      setPenalties(p => p + 5); setWrongFlash(true); setTimeout(() => setWrongFlash(false), 600);
      toast.error(t("daily.wrong5s")); setAnswer(""); return;
    }
    if (data.already_completed) { setAnswer(""); if (currentTaskIndex < tasks.length - 1) setCurrentTaskIndex(i => i + 1); return; }
    if (data.all_done) {
      setRunning(false); setAllDone(true); setEarnedCredits(data.credit_reward); refreshProfile();
      import("@/lib/confetti").then(m => m.celebrate({ particles: 180, duration: 2200 }));
      toast.success(`${t("daily.allComplete")} ${formatTime(data.time_taken)} — +${data.credit_reward} ${t("daily.credits")}! +50 XP`);
    } else {
      toast.success(`${t("daily.task")} ${currentTask.task_number} ${t("daily.correct")}`);
      setAnswer(""); setCurrentTaskIndex(i => i + 1);
    }
  }, [answer, currentTask, user, guest, awardGuest, elapsed, penalties, submitting, refreshProfile, currentTaskIndex, tasks.length, t]);

  if (authLoading || loading) {
    return <div className="min-h-screen bg-background"><Navbar /><div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div></div>;
  }

  const retriesUsed = profile?.daily_retries_used ?? 0;
  const canRetry = isPro && retriesUsed < 3;
  const canCreditRestart = (profile?.credits ?? 0) >= restartCost;

  const handleCreditRestart = async () => {
    setCreditRestarting(true);
    const { data, error } = await supabase.functions.invoke("daily-restart-credits");
    if (error || !data?.success) { toast.error(data?.error || "Failed"); setCreditRestarting(false); return; }
    toast.success(`${t("daily.restartFor")} ${data.cost} ${t("daily.credits")}!`);
    setAlreadyCompleted(false); setCompletedTime(null); setCurrentTaskIndex(0); setAllDone(false); setStarted(false); setElapsed(0); setPenalties(0); setEarnedCredits(null);
    await refreshProfile(); setCreditRestarting(false);
  };

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-16 px-4">
        <div className="flex gap-8 w-full max-w-4xl justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
            {!user && !guest && (
              <div className="glass rounded-2xl border border-border/50 p-8 text-center">
                <h1 className="font-display text-3xl font-bold mb-2">{t("daily.title")} <span className="text-primary text-glow">{t("daily.title2")}</span></h1>
                <p className="font-body text-muted-foreground mb-6">Play right now — no email needed. Pick a display name and start.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="neon" size="lg" onClick={() => setShowGuestPrompt(true)}>Play as guest</Button>
                  <Button variant="neon-outline" size="lg" onClick={() => navigate("/login")}>Sign in</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4">Already a guest? Your stats will transfer to a real account using your claim code.</p>
              </div>
            )}
            {(user || guest) && alreadyCompleted && (
              <div className="glass rounded-2xl border border-border/50 p-8 text-center">
                <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
                <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                  {t("daily.complete")} <span className="text-primary text-glow">{t("daily.complete2")}</span>
                </h1>
                {profile && profile.current_streak > 0 && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 mb-3">
                    <Flame className="w-4 h-4 text-destructive" />
                    <span className="font-display text-sm font-bold text-destructive">{profile.current_streak} {t("daily.dayStreak")}</span>
                  </div>
                )}
                <p className="font-body text-muted-foreground mb-4">
                  {t("daily.solvedIn")} <span className="text-primary font-semibold">{formatTime(completedTime!)}</span>
                </p>
                {canRetry && (
                  <div className="mb-4">
                    <Button variant="neon-outline" onClick={handleRetry} disabled={retrying} className="gap-2">
                      {retrying ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                      {t("daily.retryChallenge")}
                      <span className="text-xs text-muted-foreground">({3 - retriesUsed} {t("daily.left")})</span>
                    </Button>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Crown className="w-3 h-3 text-neon-amber" />
                      <span className="font-body text-[10px] text-neon-amber">{t("daily.proPerk")}</span>
                    </div>
                  </div>
                )}
                {canCreditRestart && (
                  <div className="mb-4">
                    <Button variant="neon-outline" onClick={handleCreditRestart} disabled={creditRestarting} className="gap-2">
                      {creditRestarting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Coins className="w-4 h-4" />}
                      {t("daily.restartFor")} {restartCost.toLocaleString()} {t("daily.credits")}
                      {isDiscountDay && <span className="text-xs text-primary">({t("daily.discountDay")})</span>}
                    </Button>
                  </div>
                )}
                {!canRetry && !canCreditRestart && (
                  <p className="font-body text-muted-foreground text-sm mb-4">
                    {isPro && retriesUsed >= 3 ? t("daily.retriesUsed") : t("daily.comeBack")}
                    {!isPro && (
                      <Button variant="link" className="text-neon-amber p-0 h-auto ml-1" onClick={() => navigate("/pro")}>
                        <Crown className="w-3 h-3 mr-1" /> {t("daily.getProRetries")}
                      </Button>
                    )}
                  </p>
                )}
                <Button variant="neon-outline" size="lg" onClick={() => navigate("/leaderboard")}>{t("daily.viewLeaderboard")}</Button>
              </div>
            )}

            {!alreadyCompleted && tasks.length === 0 && (
              <div className="glass rounded-2xl border border-border/50 p-8 text-center">
                <AlertTriangle className="w-12 h-12 text-neon-amber mx-auto mb-4" />
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">{t("daily.noPuzzle")}</h2>
                <p className="font-body text-muted-foreground">{t("daily.checkBack")}</p>
              </div>
            )}

            {(user || guest) && !alreadyCompleted && tasks.length > 0 && (
              <div className="glass rounded-2xl border border-border/50 p-8">
                <div className="text-center mb-4">
                  <h1 className="font-display text-3xl font-bold text-foreground mb-1">
                    {t("daily.title")} <span className="text-primary text-glow">{t("daily.title2")}</span>
                  </h1>
                  {profile && profile.current_streak > 0 && (
                    <div className="mt-1 inline-flex items-center gap-1 text-sm font-body text-muted-foreground">
                      <Flame className="w-3.5 h-3.5 text-destructive" />
                      {profile.current_streak} {t("daily.dayStreak")} — {Math.round(getStreakMultiplier(profile.current_streak) * 100)}% {t("daily.creditBonus")}
                      {isPro && <span className="text-neon-amber ml-1">({t("general.2xPro")})</span>}
                    </div>
                  )}
                </div>

                {started && !allDone && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-body text-muted-foreground mb-1">
                      <span>{t("daily.task")} {currentTaskIndex + 1} {t("daily.of")} {tasks.length}</span>
                      {penalties > 0 && <span className="text-destructive font-semibold">+{penalties}s {t("daily.penalties")}</span>}
                    </div>
                    <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${(currentTaskIndex / tasks.length) * 100}%` }} transition={{ duration: 0.3 }} />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 mb-4">
                  <Timer className="w-5 h-5 text-primary" />
                  <span className="font-display text-4xl font-bold text-foreground tabular-nums">{formatTime(totalTime)}</span>
                </div>

                {!started ? (
                  <div className="text-center">
                    <p className="font-body text-muted-foreground text-sm mb-2">
                      {t("daily.tasksToday")} <span className="text-primary font-semibold">{tasks.length} {t("daily.tasks")}</span>.
                    </p>
                    <p className="font-body text-muted-foreground text-xs mb-6">{t("daily.wrongPenalty")}</p>
                    <Button variant="neon" size="xl" onClick={handleStart}>
                      <Clock className="w-5 h-5" /> {t("daily.start")}
                    </Button>
                  </div>
                ) : allDone ? (
                  <div className="text-center">
                    <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
                    <p className="font-display text-xl font-bold text-foreground mb-1">{t("daily.allComplete")}</p>
                    <p className="font-body text-muted-foreground mb-1">
                      {t("daily.totalTime")} <span className="text-primary font-semibold">{formatTime(totalTime)}</span>
                    </p>
                    {penalties > 0 && <p className="font-body text-destructive text-xs mb-2">{t("daily.penaltyIncl")} {penalties}s {t("daily.inPenalties")}</p>}
                    {earnedCredits && <p className="font-body text-primary text-sm font-semibold mb-4">+{earnedCredits} {t("daily.credits")} · +50 XP</p>}
                    <Button variant="neon-outline" size="lg" onClick={() => navigate("/leaderboard")}>{t("daily.viewLeaderboard")}</Button>
                  </div>
                ) : currentTask ? (
                  <>
                    <AnimatePresence mode="wait">
                      <motion.div key={currentTask.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                        className={`rounded-xl p-6 mb-4 border transition-colors ${wrongFlash ? "bg-destructive/20 border-destructive/50" : "bg-secondary/50 border-border/30"}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-body bg-primary/10 text-primary border border-primary/30 capitalize">{currentTask.difficulty}</span>
                          <span className="text-xs font-body text-muted-foreground">{t("daily.task")} {currentTaskIndex + 1}/{tasks.length}</span>
                        </div>
                        <p className="font-body text-foreground text-lg leading-relaxed">{currentTask.question}</p>
                      </motion.div>
                    </AnimatePresence>
                    {wrongFlash && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-2 justify-center mb-3 text-destructive">
                        <XCircle className="w-4 h-4" /><span className="font-display text-sm font-bold">+5 SECONDS</span>
                      </motion.div>
                    )}
                    <form onSubmit={handleSubmit} className="flex gap-3">
                      <Input value={answer} onChange={e => setAnswer(e.target.value)} placeholder={t("daily.yourAnswer")}
                        className="flex-1 bg-secondary/50 border-border/50 font-body" autoFocus />
                      <Button type="submit" variant="neon" disabled={!answer.trim() || submitting}>
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </Button>
                    </form>
                  </>
                ) : null}
              </div>
            )}
          </motion.div>
          {!isPro && (
            <aside className="hidden lg:block w-64 flex-shrink-0 self-start pt-4">
              <AdPlaceholder slot={AD_SLOTS.sidebar} />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
