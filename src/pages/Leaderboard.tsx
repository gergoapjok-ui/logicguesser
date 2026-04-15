import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Clock, Loader2, Star, Crown, UserPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import AdPlaceholder, { AD_SLOTS } from "@/components/AdPlaceholder";
import { getLevel } from "@/lib/leveling";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface LeaderboardEntry {
  id: string;
  user_id: string;
  time_taken: number;
  username: string | null;
  avatar_url: string | null;
  xp: number;
  is_pro: boolean;
}

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

const rankColors = ["text-neon-amber", "text-muted-foreground", "text-neon-amber/60"];

export default function Leaderboard() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const isPro = profile?.is_pro ?? false;
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [friendIds, setFriendIds] = useState<Set<string>>(new Set());
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [sendingTo, setSendingTo] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase.from("leaderboard").select("id, time_taken, user_id").eq("completed_date", today).order("time_taken", { ascending: true }).limit(10);
      if (!data || data.length === 0) { setEntries([]); setLoading(false); return; }
      const userIds = data.map(e => e.user_id);
      const { data: profiles } = await supabase.from("profiles_public").select("user_id, username, avatar_url, xp, is_pro").in("user_id", userIds);
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) ?? []);
      setEntries(data.map(e => {
        const p = profileMap.get(e.user_id);
        return { id: e.id, user_id: e.user_id, time_taken: e.time_taken, username: p?.username ?? "Anonymous", avatar_url: p?.avatar_url ?? null, xp: p?.xp ?? 0, is_pro: p?.is_pro ?? false };
      }));
      if (user) {
        const { data: friendships } = await supabase.from("friendships" as any).select("requester_id, addressee_id, status").or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);
        const fIds = new Set<string>();
        const pIds = new Set<string>();
        (friendships as any[] ?? []).forEach((f: any) => {
          const otherId = f.requester_id === user.id ? f.addressee_id : f.requester_id;
          if (f.status === "accepted") fIds.add(otherId);
          else if (f.status === "pending") pIds.add(otherId);
        });
        setFriendIds(fIds);
        setPendingIds(pIds);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const sendFriendRequest = async (targetId: string) => {
    if (!user) return;
    setSendingTo(targetId);
    const { error } = await supabase.from("friendships" as any).insert({ requester_id: user.id, addressee_id: targetId });
    if (error) {
      if (error.code === "23505") toast.info(t("friends.alreadySent"));
      else toast.error(t("friends.failed"));
    } else {
      toast.success(t("friends.requestSent"));
      setPendingIds(prev => new Set(prev).add(targetId));
    }
    setSendingTo(null);
  };

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4 max-w-4xl">
        <div className="flex gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 max-w-2xl">
            <div className="text-center mb-10">
              <Trophy className="w-10 h-10 text-neon-amber mx-auto mb-3" />
              <h1 className="font-display text-4xl font-bold text-foreground mb-2">
                {t("leaderboard.title")}<span className="text-primary text-glow">{t("leaderboard.title2")}</span>
              </h1>
              <p className="font-body text-muted-foreground text-sm">{t("leaderboard.subtitle")}</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
            ) : entries.length === 0 ? (
              <div className="glass rounded-xl border border-border/50 p-8 text-center">
                <p className="font-body text-muted-foreground">{t("leaderboard.noOne")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map((entry, i) => {
                  const level = getLevel(entry.xp);
                  const isMe = user?.id === entry.user_id;
                  const isFriend = friendIds.has(entry.user_id);
                  const isPending = pendingIds.has(entry.user_id);
                  return (
                    <motion.div key={entry.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      className={`glass rounded-xl border p-4 flex items-center gap-4 ${i === 0 ? "border-neon-amber/50 box-glow" : "border-border/50"}`}>
                      <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center flex-shrink-0">
                        {i < 3 ? <Medal className={`w-5 h-5 ${rankColors[i]}`} /> : <span className="font-display text-sm font-bold text-muted-foreground">{i + 1}</span>}
                      </div>
                      <div className="flex-1 min-w-0 flex items-center gap-2">
                        {entry.avatar_url && AVATARS_MAP[entry.avatar_url] && <span className="text-lg">{AVATARS_MAP[entry.avatar_url]}</span>}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-body font-semibold text-foreground truncate">{entry.username}</p>
                            {entry.is_pro && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-neon-amber/20 border border-neon-amber/40">
                                <Crown className="w-2.5 h-2.5 text-neon-amber" />
                                <span className="font-display text-[9px] font-bold text-neon-amber">PRO</span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="w-3 h-3 text-neon-amber" />
                            <span className="font-body">Lv. {level}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-primary">
                          <Clock className="w-4 h-4" />
                          <span className="font-display text-lg font-bold tabular-nums">{formatTime(entry.time_taken)}</span>
                        </div>
                        {user && !isMe && (
                          isFriend ? (
                            <span className="text-xs text-primary"><Check className="w-4 h-4" /></span>
                          ) : isPending ? (
                            <span className="text-xs text-muted-foreground font-body">{t("leaderboard.sent")}</span>
                          ) : (
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => sendFriendRequest(entry.user_id)} disabled={sendingTo === entry.user_id}>
                              {sendingTo === entry.user_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4 text-primary" />}
                            </Button>
                          )
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
          {!isPro && (
            <aside className="hidden lg:block w-64 flex-shrink-0 pt-16">
              <AdPlaceholder slot={AD_SLOTS.sidebar} />
              <AdPlaceholder slot={AD_SLOTS.sidebar} className="mt-4" />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
