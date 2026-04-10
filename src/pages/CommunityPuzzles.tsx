import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Send, CheckCircle2, RotateCcw, Brain, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { isAnswerCorrect } from "@/lib/fuzzyMatch";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const DIFFICULTIES = ["easy", "medium", "hard"];
const CATEGORIES = ["math", "logic", "word", "cipher", "trivia", "patterns", "spatial", "code"];

interface CommunityPuzzle {
  id: string;
  question: string;
  answer: string;
  difficulty: string;
  category: string;
  created_by: string;
  created_at: string;
  creator_name?: string;
}

export default function CommunityPuzzles() {
  const { user } = useAuth();
  const [puzzles, setPuzzles] = useState<CommunityPuzzle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [category, setCategory] = useState("logic");
  const [submitting, setSubmitting] = useState(false);

  // Playing state
  const [currentPuzzle, setCurrentPuzzle] = useState<CommunityPuzzle | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [solved, setSolved] = useState(false);

  const loadPuzzles = async () => {
    const { data } = await supabase.from("community_puzzles" as any)
      .select("*").order("created_at", { ascending: false }).limit(50);
    if (data) {
      const userIds = [...new Set((data as any[]).map(p => p.created_by))];
      const { data: profiles } = await supabase.from("profiles_public")
        .select("user_id, username").in("user_id", userIds);
      const nameMap = new Map(profiles?.map(p => [p.user_id, p.username]) ?? []);
      setPuzzles((data as any[]).map(p => ({ ...p, creator_name: nameMap.get(p.created_by) || "Anonymous" })));
    }
    setLoading(false);
  };

  useEffect(() => { loadPuzzles(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please log in"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("community_puzzles" as any).insert({
      question, answer, difficulty, category, created_by: user.id,
    });
    setSubmitting(false);
    if (error) { toast.error("Failed to create"); return; }
    toast.success("Community puzzle created!");
    setQuestion(""); setAnswer(""); setShowCreate(false);
    loadPuzzles();
  };

  const handlePlay = (puzzle: CommunityPuzzle) => {
    setCurrentPuzzle(puzzle);
    setUserAnswer("");
    setSolved(false);
  };

  const handleAnswer = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPuzzle) return;
    if (isAnswerCorrect(userAnswer.trim(), currentPuzzle.answer)) {
      setSolved(true);
      toast.success("Correct!");
    } else {
      toast.error("Wrong! Try again.");
    }
  }, [userAnswer, currentPuzzle]);

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <Users className="w-10 h-10 text-neon-purple mx-auto mb-3" />
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              COMMUNITY <span className="text-neon-purple text-glow-purple">PUZZLES</span>
            </h1>
            <p className="font-body text-muted-foreground text-sm">
              Player-created puzzles. Create your own or solve others!
            </p>
          </div>

          {user && (
            <div className="mb-6 text-center">
              <Button variant="neon" onClick={() => setShowCreate(!showCreate)}>
                <Plus className="w-4 h-4" /> {showCreate ? "Cancel" : "Create Puzzle"}
              </Button>
            </div>
          )}

          <AnimatePresence>
            {showCreate && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="glass rounded-2xl border border-border/50 p-6 mb-6 overflow-hidden">
                <form onSubmit={handleCreate} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-body text-xs text-muted-foreground mb-1 block">Category</label>
                      <select value={category} onChange={e => setCategory(e.target.value)}
                        className="w-full rounded-lg border border-border/50 bg-secondary/50 px-3 py-2 font-body text-foreground text-sm">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="font-body text-xs text-muted-foreground mb-1 block">Difficulty</label>
                      <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
                        className="w-full rounded-lg border border-border/50 bg-secondary/50 px-3 py-2 font-body text-foreground text-sm">
                        {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                      </select>
                    </div>
                  </div>
                  <Textarea value={question} onChange={e => setQuestion(e.target.value)}
                    placeholder="Write your puzzle question..." className="bg-secondary/50 border-border/50 font-body" required rows={3} />
                  <Input value={answer} onChange={e => setAnswer(e.target.value)}
                    placeholder="The correct answer" className="bg-secondary/50 border-border/50 font-body" required />
                  <Button type="submit" variant="neon" className="w-full" disabled={submitting || !question.trim() || !answer.trim()}>
                    <Send className="w-4 h-4" /> {submitting ? "Creating..." : "Publish Puzzle"}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Playing modal */}
          <AnimatePresence>
            {currentPuzzle && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="glass rounded-2xl border border-primary/30 p-6 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-5 h-5 text-neon-purple" />
                  <span className="text-xs font-body text-muted-foreground uppercase tracking-wider">{currentPuzzle.category}</span>
                  <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-body bg-primary/10 text-primary border border-primary/30 capitalize">{currentPuzzle.difficulty}</span>
                </div>
                <p className="font-body text-foreground text-lg leading-relaxed mb-4">{currentPuzzle.question}</p>
                {solved ? (
                  <div className="text-center">
                    <CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-2" />
                    <p className="font-display text-lg font-bold text-foreground mb-3">Correct!</p>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentPuzzle(null)}>
                      <RotateCcw className="w-3 h-3" /> Back to list
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleAnswer} className="flex gap-3">
                    <Input value={userAnswer} onChange={e => setUserAnswer(e.target.value)}
                      placeholder="Your answer..." className="flex-1 bg-secondary/50 border-border/50 font-body" autoFocus />
                    <Button type="submit" variant="neon" disabled={!userAnswer.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => setCurrentPuzzle(null)}>✕</Button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
          ) : puzzles.length === 0 ? (
            <div className="glass rounded-xl border border-border/50 p-8 text-center">
              <p className="font-body text-muted-foreground">No community puzzles yet. Be the first to create one!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {puzzles.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                  className="glass rounded-xl border border-border/50 p-4 cursor-pointer hover:border-primary/30 transition-colors"
                  onClick={() => handlePlay(p)}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full text-xs font-body bg-neon-purple/10 text-neon-purple border border-neon-purple/30 capitalize">{p.category}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-body bg-primary/10 text-primary border border-primary/30 capitalize">{p.difficulty}</span>
                    <span className="ml-auto text-xs font-body text-muted-foreground">by {p.creator_name}</span>
                  </div>
                  <p className="font-body text-foreground truncate">{p.question}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}