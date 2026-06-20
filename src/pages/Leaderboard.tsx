import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Clock, Loader2, Star, Crown, UserPlus, Check, CalendarIcon, Calendar as CalendarIconLucide } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import AdPlaceholder, { AD_SLOTS } from "@/components/AdPlaceholder";
import { getLevel } from "@/lib/leveling";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import UpgradeProCTA from "@/components/UpgradeProCTA";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { usePageMeta } from "@/lib/seo";

interface DailyEntry {
  id: string;
  user_id: string;
  time_taken: number;
  username: string | null;
  avatar_url: string | null;
  xp: number;
  is_pro: boolean;
}

interface AggEntry {
  user_id: string;
  username: string | null;
  avatar_url: string | null;
  xp: number;
  is_pro: boolean;
  points: number;
  wins: number;
  podiums: number;
  entries: number;
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

function ymd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Points awarded per daily ranking position (top 10)
const POINTS_TABLE = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

const rankColors = ["text-neon-amber", "text-muted-foreground", "text-neon-amber/60"];

export default function Leaderboard() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const isPro = profile?.is_pro ?? false;

  usePageMeta({
    title: "Puzzle Leaderboard — LogicGuesser",
    description: "See daily, monthly, and yearly LogicGuesser puzzle rankings based on speed, accuracy, XP, and challenge results.",
    path: "/leaderboard",
  });

  const today = useMemo(() => new Date(), []);
  const [tab, setTab] = useState<"daily" | "monthly" | "yearly">("daily");
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
  const [aggEntries, setAggEntries] = useState<AggEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [friendIds, setFriendIds] = useState<Set<string>>(new Set());
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [sendingTo, setSendingTo] = useState<string | null>(null);

  // Load friendships once
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: friendships } = await supabase
        .from("friendships")
        .select("requester_id, addressee_id, status")
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);
      const fIds = new Set<string>();
      const pIds = new Set<string>();
      (friendships ?? []).forEach((f: any) => {
        const otherId = f.requester_id === user.id ? f.addressee_id : f.requester_id;
        if (f.status === "accepted") fIds.add(otherId);
        else if (f.status === "pending") pIds.add(otherId);
      });
      setFriendIds(fIds);
      setPendingIds(pIds);
    })();
  }, [user]);

  // Daily fetch
  useEffect(() => {
    if (tab !== "daily") return;
    const fetchDaily = async () => {
      setLoading(true);
      const date = ymd(selectedDate);
      const { data } = await supabase
        .from("leaderboard")
        .select("id, time_taken, user_id")
        .eq("completed_date", date)
        .order("time_taken", { ascending: true })
        .limit(10);
      if (!data || data.length === 0) { setDailyEntries([]); setLoading(false); return; }
      const userIds = data.map((e) => e.user_id);
      const { data: profiles } = await supabase
        .from("profiles_public")
        .select("user_id, username, avatar_url, xp, is_pro")
        .in("user_id", userIds);
      const map = new Map(profiles?.map((p) => [p.user_id, p]) ?? []);
      setDailyEntries(
        data.map((e) => {
          const p = map.get(e.user_id);
          return {
            id: e.id,
            user_id: e.user_id,
            time_taken: e.time_taken,
            username: p?.username ?? "Anonymous",
            avatar_url: p?.avatar_url ?? null,
            xp: p?.xp ?? 0,
            is_pro: p?.is_pro ?? false,
          };
        }),
      );
      setLoading(false);
    };
    fetchDaily();
  }, [tab, selectedDate]);

  // Monthly / Yearly aggregation
  useEffect(() => {
    if (tab === "daily") return;
    const fetchAgg = async () => {
      setLoading(true);
      const now = new Date();
      let from: string;
      let to: string;
      if (tab === "monthly") {
        from = ymd(new Date(now.getFullYear(), now.getMonth(), 1));
        to = ymd(new Date(now.getFullYear(), now.getMonth() + 1, 0));
      } else {
        from = ymd(new Date(now.getFullYear(), 0, 1));
        to = ymd(new Date(now.getFullYear(), 11, 31));
      }

      const { data } = await supabase
        .from("leaderboard")
        .select("user_id, time_taken, completed_date")
        .gte("completed_date", from)
        .lte("completed_date", to)
        .order("completed_date", { ascending: true })
        .order("time_taken", { ascending: true });

      if (!data || data.length === 0) { setAggEntries([]); setLoading(false); return; }

      // Group by date, then rank
      const byDate = new Map<string, { user_id: string; time_taken: number }[]>();
      for (const row of data) {
        const arr = byDate.get(row.completed_date) ?? [];
        arr.push({ user_id: row.user_id, time_taken: row.time_taken });
        byDate.set(row.completed_date, arr);
      }

      const totals = new Map<string, { points: number; wins: number; podiums: number; entries: number }>();
      for (const [, rows] of byDate) {
        rows.sort((a, b) => a.time_taken - b.time_taken);
        rows.slice(0, 10).forEach((r, idx) => {
          const cur = totals.get(r.user_id) ?? { points: 0, wins: 0, podiums: 0, entries: 0 };
          cur.points += POINTS_TABLE[idx] ?? 0;
          if (idx === 0) cur.wins += 1;
          if (idx < 3) cur.podiums += 1;
          cur.entries += 1;
          totals.set(r.user_id, cur);
        });
      }

      const userIds = Array.from(totals.keys());
      const { data: profiles } = await supabase
        .from("profiles_public")
        .select("user_id, username, avatar_url, xp, is_pro")
        .in("user_id", userIds);
      const profMap = new Map(profiles?.map((p) => [p.user_id, p]) ?? []);

      const merged: AggEntry[] = userIds.map((uid) => {
        const p = profMap.get(uid);
        const t = totals.get(uid)!;
        return {
          user_id: uid,
          username: p?.username ?? "Anonymous",
          avatar_url: p?.avatar_url ?? null,
          xp: p?.xp ?? 0,
          is_pro: p?.is_pro ?? false,
          points: t.points,
          wins: t.wins,
          podiums: t.podiums,
          entries: t.entries,
        };
      });

      merged.sort((a, b) => b.points - a.points || b.wins - a.wins || b.podiums - a.podiums);
      setAggEntries(merged.slice(0, 25));
      setLoading(false);
    };
    fetchAgg();
  }, [tab]);

  const sendFriendRequest = async (targetId: string) => {
    if (!user) return;
    setSendingTo(targetId);
    const { error } = await supabase.from("friendships").insert({ requester_id: user.id, addressee_id: targetId });
    if (error) {
      if ((error as any).code === "23505") toast.info(t("friends.alreadySent"));
      else toast.error(t("friends.failed"));
    } else {
      toast.success(t("friends.requestSent"));
      setPendingIds((prev) => new Set(prev).add(targetId));
    }
    setSendingTo(null);
  };

  const isToday = ymd(selectedDate) === ymd(today);

  const renderFriendButton = (uid: string) => {
    if (!user || user.id === uid) return null;
    if (friendIds.has(uid)) return <span className="text-xs text-primary"><Check className="w-4 h-4" /></span>;
    if (pendingIds.has(uid)) return <span className="text-xs text-muted-foreground font-body">Sent</span>;
    return (
      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => sendFriendRequest(uid)} disabled={sendingTo === uid}>
        {sendingTo === uid ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4 text-primary" />}
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4 max-w-4xl">
        <div className="flex gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 max-w-2xl">
            <div className="text-center mb-8">
              <Trophy className="w-10 h-10 text-neon-amber mx-auto mb-3" />
              <h1 className="font-display text-4xl font-bold text-foreground mb-2">
                {t("leaderboard.title")}<span className="text-primary text-glow">{t("leaderboard.title2")}</span>
              </h1>
              <p className="font-body text-muted-foreground text-sm">{t("leaderboard.subtitle")}</p>
            </div>

            <div className="mb-6">
              <UpgradeProCTA variant="banner" message="Stand out with a glowing Pro badge on the leaderboard." />
            </div>

            <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>

              <TabsContent value="daily">
                <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
                  <div className="font-body text-sm text-muted-foreground">
                    {isToday ? "Today" : format(selectedDate, "PPP")}
                  </div>
                  <div className="flex items-center gap-2">
                    {!isToday && (
                      <Button variant="ghost" size="sm" onClick={() => setSelectedDate(today)}>Back to today</Button>
                    )}
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className={cn(!isToday && "border-primary/50")}>
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          Pick date
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(d) => { if (d) { setSelectedDate(d); setCalendarOpen(false); } }}
                          disabled={(d) => d > today || d < new Date("2024-01-01")}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
                ) : dailyEntries.length === 0 ? (
                  <div className="glass rounded-xl border border-border/50 p-8 text-center">
                    <p className="font-body text-muted-foreground">
                      {isToday ? t("leaderboard.noOne") : "No entries on this day."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dailyEntries.map((entry, i) => {
                      const level = getLevel(entry.xp);
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
                            {renderFriendButton(entry.user_id)}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="monthly">
                <AggList loading={loading} entries={aggEntries} period="month" renderFriendButton={renderFriendButton} />
              </TabsContent>

              <TabsContent value="yearly">
                <AggList loading={loading} entries={aggEntries} period="year" renderFriendButton={renderFriendButton} />
              </TabsContent>
            </Tabs>
          </motion.div>
          {!isPro && (
            <aside className="hidden lg:block w-64 flex-shrink-0 pt-16">
              <AdPlaceholder slot={AD_SLOTS.sidebar} />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

function AggList({
  loading,
  entries,
  period,
  renderFriendButton,
}: {
  loading: boolean;
  entries: AggEntry[];
  period: "month" | "year";
  renderFriendButton: (uid: string) => React.ReactNode;
}) {
  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }
  if (entries.length === 0) {
    return (
      <div className="glass rounded-xl border border-border/50 p-8 text-center">
        <p className="font-body text-muted-foreground">No rankings yet for this {period}.</p>
      </div>
    );
  }
  return (
    <>
      <div className="mb-4 glass rounded-lg border border-border/40 p-3 flex items-start gap-2">
        <CalendarIconLucide className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="font-body text-xs text-muted-foreground">
          Points earned from daily top-10 finishes this {period}. 1st = 25, 2nd = 18, 3rd = 15, then 12/10/8/6/4/2/1.
        </p>
      </div>
      <div className="space-y-3">
        {entries.map((entry, i) => {
          const level = getLevel(entry.xp);
          return (
            <motion.div key={entry.user_id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
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
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-neon-amber" /> Lv. {level}</span>
                    <span>· {entry.wins}🥇 {entry.podiums}🏅</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="font-display text-lg font-bold tabular-nums text-primary">{entry.points}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">pts</span>
                </div>
                {renderFriendButton(entry.user_id)}
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
