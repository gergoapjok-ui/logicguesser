import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Send, CheckCircle2, RotateCcw, Brain, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { isAnswerCorrect } from "@/lib/fuzzyMatch";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import AdPlaceholder, { AD_SLOTS } from "@/components/AdPlaceholder";
import { PixVerseSidebarCard } from "@/components/PixVersePromo";
import UpgradeProCTA from "@/components/UpgradeProCTA";
import { useGuest } from "@/contexts/GuestContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { generatePuzzle, type PuzzleCategory, type Puzzle } from "@/lib/puzzleGenerator";
import { useLanguage } from "@/contexts/LanguageContext";
import type { PuzzleLang } from "@/lib/puzzleTranslations";
import { usePageMeta } from "@/lib/seo";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function Practice() {
  const { user, profile, refreshProfile } = useAuth();
  const { guest, awardGuest } = useGuest();
  const { t, language } = useLanguage();
  const puzzleLang = language as PuzzleLang;
  const isPro = profile?.is_pro ?? false;

  usePageMeta({
    title: "Practice Logic Puzzles — LogicGuesser",
    description: "Practice unlimited logic, word, math, visual, and code puzzles with instant feedback and answer checking.",
    path: "/practice",
  });

  const [category, setCategory] = useState<PuzzleCategory | undefined>(undefined);
  const [puzzle, setPuzzle] = useState<Puzzle>(() => generatePuzzle(undefined, puzzleLang));
  const [answer, setAnswer] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);
  const [solved, setSolved] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showCredit, setShowCredit] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const handleCategoryChange = (val: string) => {
    const cat = (val || undefined) as PuzzleCategory | undefined;
    setCategory(cat);
    setPuzzle(generatePuzzle(cat, puzzleLang));
    setAnswer(""); setElapsed(0); setSolved(false); setRunning(true);
  };

  const submitAnswer = useCallback(async (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    if (isAnswerCorrect(trimmed, puzzle.answer)) {
      setRunning(false); setSolved(true); setStreak(s => s + 1);
      import("@/lib/confetti").then(m => m.celebrate({ particles: 90, duration: 1400 }));
      if (user) {
        await supabase.functions.invoke("practice-reward");
        refreshProfile();
        setShowCredit(true);
        setTimeout(() => setShowCredit(false), 1500);
      } else if (guest) {
        await awardGuest({ addXp: 10, addCredits: 5 });
        setShowCredit(true);
        setTimeout(() => setShowCredit(false), 1500);
      }
      toast.success(`${t("practice.correct")} ${t("practice.solvedIn")} ${formatTime(elapsed)}`);
    } else {
      toast.error(t("practice.wrongTryAgain"));
    }
  }, [puzzle, elapsed, user, guest, awardGuest, refreshProfile, t]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    submitAnswer(answer);
  }, [answer, submitAnswer]);

  const handleNext = () => {
    setPuzzle(generatePuzzle(category, puzzleLang));
    setAnswer(""); setElapsed(0); setSolved(false); setRunning(true);
  };

  const creditAmount = isPro ? 10 : 5;

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4 max-w-4xl">
        <div className="flex gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 max-w-lg mx-auto">
            {!isPro && user && (
              <div className="mb-4">
                <UpgradeProCTA variant="banner" />
              </div>
            )}
            <div className="glass rounded-2xl border border-border/50 p-8 relative">
              <AnimatePresence>
                {showCredit && (
                  <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -60 }} exit={{ opacity: 0 }}
                    transition={{ duration: 1.2 }} className="absolute top-4 right-4 flex items-center gap-1 pointer-events-none z-10">
                    <Coins className="w-4 h-4 text-primary" />
                    <span className="font-display text-sm font-bold text-primary text-glow">+{creditAmount} {t("daily.credits")}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="text-center mb-4">
                <h1 className="font-display text-3xl font-bold text-foreground mb-1">
                  {t("practice.title")} <span className="text-neon-purple text-glow-purple">{t("practice.title2")}</span>
                </h1>
                <p className="font-body text-muted-foreground text-sm">
                  {t("practice.streak")} <span className="text-primary font-semibold">{streak}</span> · +{creditAmount} {t("practice.perSolve")}
                  {isPro && <span className="text-neon-amber ml-1">({t("general.2xPro")})</span>}
                </p>
              </div>

              <div className="flex justify-center mb-6">
                <ToggleGroup type="single" value={category ?? ""} onValueChange={handleCategoryChange}
                  className="bg-secondary/50 rounded-lg p-1 border border-border/30 flex-wrap">
                  {(["", "math", "logic", "patterns", "visual", "word", "cipher", "spatial", "trivia", "code"] as const).map(v => (
                    <ToggleGroupItem key={v} value={v}
                      className="font-body text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground rounded-md px-3">
                      {v === "" ? t("practice.all") : v.charAt(0).toUpperCase() + v.slice(1)}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              <div className="flex items-center justify-center gap-2 mb-6">
                <Timer className="w-5 h-5 text-neon-purple" />
                <span className="font-display text-4xl font-bold text-foreground tabular-nums">{formatTime(elapsed)}</span>
              </div>

              {solved ? (
                <div className="text-center">
                  <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
                  <p className="font-display text-xl font-bold text-foreground mb-1">{t("practice.correct")}</p>
                  <p className="font-body text-muted-foreground mb-6">{t("practice.solvedIn")} <span className="text-primary font-semibold">{formatTime(elapsed)}</span></p>
                  <Button variant="neon" size="lg" onClick={handleNext}><RotateCcw className="w-4 h-4" /> {t("practice.next")}</Button>
                </div>
              ) : (
                <>
                  {puzzle.visual && (
                    <div className="mb-4 flex justify-center">
                      <div className="rounded-xl overflow-hidden border border-border/30 max-w-[300px] w-full" dangerouslySetInnerHTML={{ __html: puzzle.visual }} />
                    </div>
                  )}
                  <div className="bg-secondary/50 rounded-xl p-6 mb-6 border border-border/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-5 h-5 text-neon-purple" />
                      <span className="text-xs font-body text-muted-foreground uppercase tracking-wider">{puzzle.category}</span>
                    </div>
                    <p className="font-body text-foreground text-lg leading-relaxed">{puzzle.question}</p>
                  </div>
                  {puzzle.choices ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {puzzle.choices.map((c) => (
                        <Button
                          key={c}
                          type="button"
                          variant="outline"
                          className="font-body text-base h-auto py-3 px-4 whitespace-normal text-left justify-start border-border/60 hover:border-primary hover:bg-primary/10 hover:text-primary transition"
                          onClick={() => { setAnswer(c); submitAnswer(c); }}
                        >
                          {c}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex gap-3">
                      <Input value={answer} onChange={e => setAnswer(e.target.value)} placeholder={t("practice.yourAnswer")}
                        className="flex-1 bg-secondary/50 border-border/50 font-body" autoFocus />
                      <Button type="submit" variant="neon" disabled={!answer.trim()}><Send className="w-4 h-4" /></Button>
                    </form>
                  )}
                  <div className="text-center mt-4">
                    <Button variant="ghost" size="sm" onClick={handleNext} className="text-muted-foreground">
                      <RotateCcw className="w-3 h-3" /> {t("practice.skip")}
                    </Button>
                  </div>
                </>
              )}
            </div>
            {!isPro && (
              <div className="mt-6 lg:hidden">
                <AdPlaceholder slot={AD_SLOTS.inContent} />
              </div>
            )}
          </motion.div>
          {!isPro && (
            <aside className="hidden lg:block w-64 flex-shrink-0 pt-4 space-y-4">
              <UpgradeProCTA variant="card" message="Unlimited practice, no cooldowns, double credits." />
              <PixVerseSidebarCard />
              <AdPlaceholder slot={AD_SLOTS.sidebar} />
              <UpgradeProCTA variant="compact" className="block text-center" />
              <AdPlaceholder slot={AD_SLOTS.sidebar} />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
