import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Send, ArrowLeft, Swords, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";

const AVATARS_MAP: Record<string, string> = {
  avatar_cyber_skull: "💀", avatar_neon_cat: "🐱", avatar_glitch_bot: "🤖",
  avatar_plasma_fox: "🦊", avatar_quantum_owl: "🦉", avatar_void_wolf: "🐺",
  avatar_pixel_dragon: "🐉", avatar_star_panda: "🐼",
};

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: string;
  battle_invite_id: string | null;
  created_at: string;
}

export default function Chat() {
  const { friendId } = useParams<{ friendId: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [friendProfile, setFriendProfile] = useState<{ username: string | null; avatar_url: string | null } | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  const fetchMessages = useCallback(async () => {
    if (!user || !friendId) return;
    const { data } = await supabase
      .from("messages" as any)
      .select("*")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${user.id})`)
      .order("created_at", { ascending: true })
      .limit(200);
    setMessages((data as any) ?? []);
  }, [user, friendId]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }

    const load = async () => {
      const { data: profile } = await supabase
        .from("profiles_public" as any)
        .select("username, avatar_url")
        .eq("user_id", friendId)
        .single();
      setFriendProfile(profile as any);
      await fetchMessages();
      setLoading(false);
    };
    load();
  }, [user, authLoading, friendId, navigate, fetchMessages]);

  // Realtime messages
  useEffect(() => {
    if (!user || !friendId) return;
    const channel = supabase
      .channel(`chat-${friendId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
      }, (payload) => {
        const msg = payload.new as Message;
        if (
          (msg.sender_id === user.id && msg.receiver_id === friendId) ||
          (msg.sender_id === friendId && msg.receiver_id === user.id)
        ) {
          setMessages(prev => [...prev, msg]);
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, friendId]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !friendId || sending) return;
    setSending(true);
    await supabase.from("messages" as any).insert({
      sender_id: user.id,
      receiver_id: friendId,
      content: newMessage.trim(),
      message_type: "text",
    });
    setNewMessage("");
    setSending(false);
  };

  const sendBattleInvite = async () => {
    if (!user || !friendId) return;
    // Create a battle and send as message
    const { data: battle, error } = await supabase.from("battles" as any).insert({
      creator_id: user.id,
      opponent_id: friendId,
      status: "pending",
    }).select("id").single();

    if (error || !battle) return;

    await supabase.from("messages" as any).insert({
      sender_id: user.id,
      receiver_id: friendId,
      content: "⚔️ Battle invitation! Click to configure and accept.",
      message_type: "battle_invite",
      battle_invite_id: (battle as any).id,
    });
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

  const friendEmoji = friendProfile?.avatar_url && AVATARS_MAP[friendProfile.avatar_url]
    ? AVATARS_MAP[friendProfile.avatar_url]
    : "👤";

  return (
    <div className="min-h-screen bg-background grid-pattern flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col pt-16 max-w-2xl mx-auto w-full px-4">
        {/* Header */}
        <div className="glass rounded-b-xl border border-border/50 p-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/friends")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="text-2xl">{friendEmoji}</span>
          <span className="font-display font-bold text-foreground">{friendProfile?.username ?? "User"}</span>
          <div className="ml-auto">
            <Button size="sm" variant="neon-outline" onClick={sendBattleInvite}>
              <Swords className="w-3.5 h-3.5" /> Battle
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 min-h-0" style={{ maxHeight: "calc(100vh - 220px)" }}>
          {messages.length === 0 && (
            <p className="text-center font-body text-muted-foreground text-sm py-8">No messages yet. Say hello!</p>
          )}
          {messages.map(msg => {
            const isMe = msg.sender_id === user?.id;
            const isBattle = msg.message_type === "battle_invite";
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    isBattle
                      ? "bg-primary/20 border border-primary/40 cursor-pointer hover:bg-primary/30 transition-colors"
                      : isMe
                        ? "bg-primary text-primary-foreground"
                        : "glass border border-border/50 text-foreground"
                  }`}
                  onClick={isBattle && msg.battle_invite_id ? () => navigate(`/battle/${msg.battle_invite_id}`) : undefined}
                >
                  <p className="font-body text-sm">{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${isMe && !isBattle ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </motion.div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="glass border-t border-border/50 p-4">
          <form onSubmit={handleSend} className="flex gap-3">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-secondary/50 border-border/50 font-body"
            />
            <Button type="submit" variant="neon" disabled={!newMessage.trim() || sending}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
