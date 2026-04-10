import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Send, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const DIFFICULTIES = ["easy", "medium", "hard"];
const CATEGORIES = ["math", "logic", "word", "cipher", "trivia", "patterns", "spatial", "code"];

export default function SubmitPuzzle() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [category, setCategory] = useState("logic");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please log in first"); navigate("/login"); return; }
    setLoading(true);
    const { error } = await supabase.from("puzzle_submissions" as any).insert({
      question, answer, difficulty, category, submitted_by: user.id,
    });
    setLoading(false);
    if (error) { toast.error("Failed to submit"); return; }
    toast.success("Puzzle submitted for review!");
    setQuestion(""); setAnswer("");
  };

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4 max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <Lightbulb className="w-10 h-10 text-neon-amber mx-auto mb-3" />
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              SUBMIT A <span className="text-primary text-glow">PUZZLE</span>
            </h1>
            <p className="font-body text-muted-foreground text-sm">
              Create a puzzle for the official pool. It will be reviewed before being added.
            </p>
          </div>

          <div className="glass rounded-2xl border border-border/50 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-body text-sm text-muted-foreground mb-1 block">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-border/50 bg-secondary/50 px-3 py-2 font-body text-foreground text-sm">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="font-body text-sm text-muted-foreground mb-1 block">Difficulty</label>
                <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
                  className="w-full rounded-lg border border-border/50 bg-secondary/50 px-3 py-2 font-body text-foreground text-sm">
                  {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="font-body text-sm text-muted-foreground mb-1 block">Question</label>
                <Textarea value={question} onChange={e => setQuestion(e.target.value)}
                  placeholder="Write your puzzle question..." className="bg-secondary/50 border-border/50 font-body" required rows={4} />
              </div>
              <div>
                <label className="font-body text-sm text-muted-foreground mb-1 block">Answer</label>
                <Input value={answer} onChange={e => setAnswer(e.target.value)}
                  placeholder="The correct answer" className="bg-secondary/50 border-border/50 font-body" required />
              </div>
              <Button type="submit" variant="neon" size="lg" className="w-full" disabled={loading || !question.trim() || !answer.trim()}>
                <Send className="w-4 h-4" /> {loading ? "Submitting..." : "Submit for Review"}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}