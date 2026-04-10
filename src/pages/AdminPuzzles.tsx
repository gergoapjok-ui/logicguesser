import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Check, X, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

interface Submission {
  id: string;
  question: string;
  answer: string;
  difficulty: string;
  category: string;
  status: string;
  created_at: string;
  submitted_by: string;
  submitter_name?: string;
}

export default function AdminPuzzles() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<string | null>(null);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected">("pending");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }

    const checkAdmin = async () => {
      const { data } = await supabase.functions.invoke("check-admin");
      if (!data?.admin) { navigate("/"); toast.error("Access denied"); return; }
      setIsAdmin(true);
      setChecking(false);
    };
    checkAdmin();
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      setLoading(true);
      const { data } = await supabase.from("puzzle_submissions" as any)
        .select("*").eq("status", filter).order("created_at", { ascending: true });
      if (data) {
        const userIds = [...new Set((data as any[]).map(s => s.submitted_by))];
        const { data: profiles } = await supabase.from("profiles_public")
          .select("user_id, username").in("user_id", userIds);
        const nameMap = new Map(profiles?.map(p => [p.user_id, p.username]) ?? []);
        setSubmissions((data as any[]).map(s => ({ ...s, submitter_name: nameMap.get(s.submitted_by) || "Unknown" })));
      }
      setLoading(false);
    };
    load();
  }, [isAdmin, filter]);

  const handleReview = async (id: string, status: "approved" | "rejected") => {
    setProcessing(id);
    const { error } = await supabase.from("puzzle_submissions" as any)
      .update({ status, reviewer_notes: reviewNotes[id] || null, reviewed_at: new Date().toISOString() })
      .eq("id", id);
    if (error) { toast.error("Failed to update"); setProcessing(null); return; }
    toast.success(`Puzzle ${status}!`);
    setSubmissions(prev => prev.filter(s => s.id !== id));
    setProcessing(null);
  };

  if (authLoading || checking) {
    return <div className="min-h-screen bg-background"><Navbar /><div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div></div>;
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <Shield className="w-10 h-10 text-destructive mx-auto mb-3" />
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              ADMIN <span className="text-destructive">REVIEW</span>
            </h1>
            <p className="font-body text-muted-foreground text-sm">Review and approve puzzle submissions</p>
          </div>

          <div className="flex justify-center gap-2 mb-6">
            {(["pending", "approved", "rejected"] as const).map(f => (
              <Button key={f} variant={filter === f ? "neon" : "ghost"} size="sm" onClick={() => setFilter(f)}
                className="font-body capitalize">{f}</Button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
          ) : submissions.length === 0 ? (
            <div className="glass rounded-xl border border-border/50 p-8 text-center">
              <p className="font-body text-muted-foreground">No {filter} submissions.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map(sub => (
                <motion.div key={sub.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="glass rounded-xl border border-border/50 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full text-xs font-body bg-primary/10 text-primary border border-primary/30 capitalize">{sub.category}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-body bg-neon-amber/10 text-neon-amber border border-neon-amber/30 capitalize">{sub.difficulty}</span>
                    <span className="ml-auto text-xs font-body text-muted-foreground">by {sub.submitter_name}</span>
                  </div>
                  <p className="font-body text-foreground mb-2"><strong>Q:</strong> {sub.question}</p>
                  <p className="font-body text-primary text-sm mb-3"><strong>A:</strong> {sub.answer}</p>

                  {filter === "pending" && (
                    <>
                      <Textarea
                        value={reviewNotes[sub.id] || ""}
                        onChange={e => setReviewNotes(prev => ({ ...prev, [sub.id]: e.target.value }))}
                        placeholder="Optional reviewer notes..."
                        className="bg-secondary/50 border-border/50 font-body text-sm mb-3" rows={2}
                      />
                      <div className="flex gap-2">
                        <Button variant="neon" size="sm" onClick={() => handleReview(sub.id, "approved")}
                          disabled={processing === sub.id}>
                          <Check className="w-4 h-4" /> Approve
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleReview(sub.id, "rejected")}
                          disabled={processing === sub.id}>
                          <X className="w-4 h-4" /> Reject
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}