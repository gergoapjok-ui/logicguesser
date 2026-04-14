import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserPlus, UserCheck, UserX, MessageCircle, Swords, Loader2, Users, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const AVATARS_MAP: Record<string, string> = {
  avatar_cyber_skull: "💀", avatar_neon_cat: "🐱", avatar_glitch_bot: "🤖",
  avatar_plasma_fox: "🦊", avatar_quantum_owl: "🦉", avatar_void_wolf: "🐺",
  avatar_pixel_dragon: "🐉", avatar_star_panda: "🐼",
};

interface FriendshipRow {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: string;
  created_at: string;
}

interface ProfilePublic {
  user_id: string;
  username: string | null;
  avatar_url: string | null;
  xp: number;
  bio: string | null;
}

export default function Friends() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [friends, setFriends] = useState<(FriendshipRow & { profile: ProfilePublic })[]>([]);
  const [pendingIncoming, setPendingIncoming] = useState<(FriendshipRow & { profile: ProfilePublic })[]>([]);
  const [pendingOutgoing, setPendingOutgoing] = useState<(FriendshipRow & { profile: ProfilePublic })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProfilePublic[]>([]);
  const [searching, setSearching] = useState(false);
  const [tab, setTab] = useState<"friends" | "requests">("friends");

  const fetchFriendships = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("friendships" as any)
      .select("*")
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

    if (!data) { setLoading(false); return; }

    const otherIds = (data as any[]).map(f =>
      f.requester_id === user.id ? f.addressee_id : f.requester_id
    );

    let profileMap = new Map<string, ProfilePublic>();
    if (otherIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles_public" as any)
        .select("user_id, username, avatar_url, xp, bio")
        .in("user_id", otherIds);
      if (profiles) {
        (profiles as any[]).forEach(p => profileMap.set(p.user_id, p));
      }
    }

    const enriched = (data as any[]).map(f => ({
      ...f,
      profile: profileMap.get(f.requester_id === user.id ? f.addressee_id : f.requester_id) || {
        user_id: f.requester_id === user.id ? f.addressee_id : f.requester_id,
        username: "Unknown",
        avatar_url: null,
        xp: 0,
      },
    }));

    setFriends(enriched.filter(f => f.status === "accepted"));
    setPendingIncoming(enriched.filter(f => f.status === "pending" && f.addressee_id === user.id));
    setPendingOutgoing(enriched.filter(f => f.status === "pending" && f.requester_id === user.id));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }
    fetchFriendships();
  }, [user, authLoading, navigate, fetchFriendships]);

  // Realtime subscription for friendships
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("friendships-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "friendships" }, () => {
        fetchFriendships();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, fetchFriendships]);

  const handleSearch = async () => {
    if (!searchQuery.trim() || !user) return;
    setSearching(true);
    const { data } = await supabase
      .from("profiles_public" as any)
      .select("user_id, username, avatar_url, xp")
      .ilike("username", `%${searchQuery.trim()}%`)
      .neq("user_id", user.id)
      .limit(10);
    setSearchResults((data as any) ?? []);
    setSearching(false);
  };

  const sendRequest = async (targetId: string) => {
    if (!user) return;
    const { error } = await supabase.from("friendships" as any).insert({
      requester_id: user.id,
      addressee_id: targetId,
    });
    if (error) {
      if (error.code === "23505") toast.info("Request already sent!");
      else toast.error("Failed to send request");
      return;
    }
    toast.success("Friend request sent!");
    fetchFriendships();
  };

  const respondToRequest = async (friendshipId: string, accept: boolean) => {
    const { error } = await supabase
      .from("friendships" as any)
      .update({ status: accept ? "accepted" : "rejected", updated_at: new Date().toISOString() })
      .eq("id", friendshipId);
    if (error) { toast.error("Failed to update request"); return; }
    toast.success(accept ? "Friend added!" : "Request declined");
    fetchFriendships();
  };

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

  const existingIds = new Set([
    ...friends.map(f => f.profile.user_id),
    ...pendingOutgoing.map(f => f.profile.user_id),
    ...pendingIncoming.map(f => f.profile.user_id),
  ]);

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <Users className="w-10 h-10 text-primary mx-auto mb-3" />
            <h1 className="font-display text-4xl font-bold text-foreground">
              FRIEND<span className="text-primary text-glow">S</span>
            </h1>
          </div>

          {/* Search */}
          <div className="glass rounded-xl border border-border/50 p-4 mb-6">
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex gap-3">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by username..."
                className="flex-1 bg-secondary/50 border-border/50 font-body"
              />
              <Button type="submit" variant="neon" disabled={searching}>
                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </form>

            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 space-y-2">
                  {searchResults.map(p => (
                    <div key={p.user_id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/20">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{p.avatar_url && AVATARS_MAP[p.avatar_url] ? AVATARS_MAP[p.avatar_url] : "👤"}</span>
                        <span className="font-body font-semibold text-foreground">{p.username ?? "Anonymous"}</span>
                      </div>
                      {existingIds.has(p.user_id) ? (
                        <span className="text-xs font-body text-muted-foreground">Already connected</span>
                      ) : (
                        <Button size="sm" variant="neon-outline" onClick={() => sendRequest(p.user_id)}>
                          <UserPlus className="w-3 h-3" /> Add
                        </Button>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={tab === "friends" ? "neon" : "neon-outline"}
              size="sm"
              onClick={() => setTab("friends")}
            >
              <Users className="w-3.5 h-3.5" /> Friends ({friends.length})
            </Button>
            <Button
              variant={tab === "requests" ? "neon" : "neon-outline"}
              size="sm"
              onClick={() => setTab("requests")}
              className="relative"
            >
              <Bell className="w-3.5 h-3.5" /> Requests ({pendingIncoming.length})
              {pendingIncoming.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                  {pendingIncoming.length}
                </span>
              )}
            </Button>
          </div>

          {tab === "friends" && (
            <div className="space-y-3">
              {friends.length === 0 ? (
                <div className="glass rounded-xl border border-border/50 p-8 text-center">
                  <p className="font-body text-muted-foreground">No friends yet. Search for players above!</p>
                </div>
              ) : (
                friends.map(f => (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass rounded-xl border border-border/50 p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl flex-shrink-0">{f.profile.avatar_url && AVATARS_MAP[f.profile.avatar_url] ? AVATARS_MAP[f.profile.avatar_url] : "👤"}</span>
                      <div className="min-w-0">
                        <span className="font-body font-semibold text-foreground block">{f.profile.username ?? "Anonymous"}</span>
                        {f.profile.bio && (
                          <span className="font-body text-xs text-muted-foreground block truncate max-w-[200px]">{f.profile.bio}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => navigate(`/chat/${f.profile.user_id}`)}>
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="neon-outline" onClick={() => navigate(`/battle/create?opponent=${f.profile.user_id}`)}>
                        <Swords className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {tab === "requests" && (
            <div className="space-y-4">
              {pendingIncoming.length > 0 && (
                <div>
                  <h3 className="font-display text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">Incoming</h3>
                  <div className="space-y-2">
                    {pendingIncoming.map(f => (
                      <div key={f.id} className="glass rounded-xl border border-primary/30 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{f.profile.avatar_url && AVATARS_MAP[f.profile.avatar_url] ? AVATARS_MAP[f.profile.avatar_url] : "👤"}</span>
                          <span className="font-body font-semibold text-foreground">{f.profile.username ?? "Anonymous"}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="neon" onClick={() => respondToRequest(f.id, true)}>
                            <UserCheck className="w-3 h-3" /> Accept
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => respondToRequest(f.id, false)}>
                            <UserX className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {pendingOutgoing.length > 0 && (
                <div>
                  <h3 className="font-display text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">Sent</h3>
                  <div className="space-y-2">
                    {pendingOutgoing.map(f => (
                      <div key={f.id} className="glass rounded-xl border border-border/50 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{f.profile.avatar_url && AVATARS_MAP[f.profile.avatar_url] ? AVATARS_MAP[f.profile.avatar_url] : "👤"}</span>
                          <span className="font-body font-semibold text-foreground">{f.profile.username ?? "Anonymous"}</span>
                        </div>
                        <span className="text-xs font-body text-muted-foreground">Pending...</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {pendingIncoming.length === 0 && pendingOutgoing.length === 0 && (
                <div className="glass rounded-xl border border-border/50 p-8 text-center">
                  <p className="font-body text-muted-foreground">No pending requests.</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
