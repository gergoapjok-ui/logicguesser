import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import AdPlaceholder from "@/components/AdPlaceholder";

interface LeaderboardEntry {
  id: string;
  time_taken: number;
  username: string | null;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const rankColors = ["text-neon-amber", "text-muted-foreground", "text-neon-amber/60"];

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [puzzleExists, setPuzzleExists] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const today = new Date().toISOString().split("T")[0];

      // Get today's puzzle
      const { data: puzzle } = await supabase
        .from("puzzles")
        .select("id")
        .eq("puzzle_date", today)
        .single();

      if (!puzzle) {
        setPuzzleExists(false);
        setLoading(false);
        return;
      }

      // Get top 10 entries with profile usernames
      const { data } = await supabase
        .from("leaderboard")
        .select("id, time_taken, user_id")
        .eq("puzzle_id", puzzle.id)
        .order("time_taken", { ascending: true })
        .limit(10);

      if (!data || data.length === 0) {
        setEntries([]);
        setLoading(false);
        return;
      }

      // Fetch usernames for all user_ids
      const userIds = data.map((e) => e.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, username")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map((p) => [p.user_id, p.username]) ?? []);

      setEntries(
        data.map((e) => ({
          id: e.id,
          time_taken: e.time_taken,
          username: profileMap.get(e.user_id) ?? "Anonymous",
        }))
      );
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-10">
            <Trophy className="w-10 h-10 text-neon-amber mx-auto mb-3" />
            <h1 className="font-display text-4xl font-bold text-foreground mb-2">
              LEADER<span className="text-primary text-glow">BOARD</span>
            </h1>
            <p className="font-body text-muted-foreground text-sm">
              Today's fastest solvers
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : !puzzleExists ? (
            <div className="glass rounded-xl border border-border/50 p-8 text-center">
              <p className="font-body text-muted-foreground">No puzzle today — no leaderboard yet.</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="glass rounded-xl border border-border/50 p-8 text-center">
              <p className="font-body text-muted-foreground">No one has completed today's challenge yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass rounded-xl border p-4 flex items-center gap-4 ${
                    i === 0 ? "border-neon-amber/50 box-glow" : "border-border/50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center flex-shrink-0">
                    {i < 3 ? (
                      <Medal className={`w-5 h-5 ${rankColors[i]}`} />
                    ) : (
                      <span className="font-display text-sm font-bold text-muted-foreground">
                        {i + 1}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-foreground truncate">
                      {entry.username}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-primary">
                    <Clock className="w-4 h-4" />
                    <span className="font-display text-lg font-bold tabular-nums">
                      {formatTime(entry.time_taken)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
