import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Timer, Send, CheckCircle2, RotateCcw, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

interface Puzzle {
  question: string;
  answer: string;
}

function generatePuzzle(): Puzzle {
  const type = Math.floor(Math.random() * 4);

  if (type === 0) {
    // Arithmetic
    const a = Math.floor(Math.random() * 20) + 2;
    const b = Math.floor(Math.random() * 15) + 2;
    const c = Math.floor(Math.random() * 30) + 1;
    const ops = ["+", "-"] as const;
    const op = ops[Math.floor(Math.random() * ops.length)];
    const result = op === "+" ? a * b + c : a * b - c;
    return { question: `What is ${a} × ${b} ${op} ${c}?`, answer: String(result) };
  }

  if (type === 1) {
    // Sequence: arithmetic
    const start = Math.floor(Math.random() * 10) + 1;
    const diff = Math.floor(Math.random() * 8) + 2;
    const seq = Array.from({ length: 4 }, (_, i) => start + diff * i);
    const ans = start + diff * 4;
    return { question: `What comes next: ${seq.join(", ")}, ...?`, answer: String(ans) };
  }

  if (type === 2) {
    // Sequence: geometric
    const base = Math.floor(Math.random() * 4) + 2;
    const seq = Array.from({ length: 4 }, (_, i) => base ** (i + 1));
    const ans = base ** 5;
    return { question: `What comes next: ${seq.join(", ")}, ...?`, answer: String(ans) };
  }

  // Word puzzle / trick question
  const tricks: Puzzle[] = [
    { question: "How many months have 28 days?", answer: "12" },
    { question: "If there are 6 apples and you take away 4, how many do you have?", answer: "4" },
    { question: "A clerk at a butcher shop is 5'10\". What does he weigh?", answer: "meat" },
    { question: "What has a head and a tail but no body? (one word)", answer: "coin" },
    { question: "How many letters are in 'the alphabet'?", answer: "11" },
    { question: "If you divide 30 by half and add 10, what do you get?", answer: "70" },
  ];
  return tricks[Math.floor(Math.random() * tricks.length)];
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function Practice() {
  const [puzzle, setPuzzle] = useState<Puzzle>(generatePuzzle);
  const [answer, setAnswer] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);
  const [solved, setSolved] = useState(false);
  const [streak, setStreak] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = answer.trim().toLowerCase();
    const correct = puzzle.answer.trim().toLowerCase();

    if (trimmed === correct) {
      setRunning(false);
      setSolved(true);
      setStreak((s) => s + 1);
      toast.success(`Correct! Solved in ${formatTime(elapsed)}`);
    } else {
      toast.error("Wrong answer! Try again.");
    }
  }, [answer, puzzle, elapsed]);

  const handleNext = () => {
    setPuzzle(generatePuzzle());
    setAnswer("");
    setElapsed(0);
    setSolved(false);
    setRunning(true);
  };

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <div className="glass rounded-2xl border border-border/50 p-8">
            <div className="text-center mb-6">
              <h1 className="font-display text-3xl font-bold text-foreground mb-1">
                PRACTICE <span className="text-neon-purple text-glow-purple">MODE</span>
              </h1>
              <p className="font-body text-muted-foreground text-sm">
                Streak: <span className="text-primary font-semibold">{streak}</span> · Results are not saved
              </p>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <Timer className="w-5 h-5 text-neon-purple" />
              <span className="font-display text-4xl font-bold text-foreground tabular-nums">
                {formatTime(elapsed)}
              </span>
            </div>

            {solved ? (
              <div className="text-center">
                <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
                <p className="font-display text-xl font-bold text-foreground mb-1">Correct!</p>
                <p className="font-body text-muted-foreground mb-6">
                  Solved in <span className="text-primary font-semibold">{formatTime(elapsed)}</span>
                </p>
                <Button variant="neon" size="lg" onClick={handleNext}>
                  <RotateCcw className="w-4 h-4" />
                  Next Puzzle
                </Button>
              </div>
            ) : (
              <>
                <div className="bg-secondary/50 rounded-xl p-6 mb-6 border border-border/30">
                  <Brain className="w-5 h-5 text-neon-purple mb-2" />
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
                  <Button type="submit" variant="neon" disabled={!answer.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
                <div className="text-center mt-4">
                  <Button variant="ghost" size="sm" onClick={handleNext} className="text-muted-foreground">
                    <RotateCcw className="w-3 h-3" />
                    Skip
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
