import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface BattleInvite {
  id: string;
  battleId: string;
  senderName: string;
  senderAvatar: string | null;
  gameMode: string;
  rounds: number;
  realtimeMode: boolean;
}

const AVATARS_MAP: Record<string, string> = {
  avatar_cyber_skull: "💀", avatar_neon_cat: "🐱", avatar_glitch_bot: "🤖",
  avatar_plasma_fox: "🦊", avatar_quantum_owl: "🦉", avatar_void_wolf: "🐺",
  avatar_pixel_dragon: "🐉", avatar_star_panda: "🐼",
  avatar_diamond_phoenix: "🔥", avatar_golden_unicorn: "🦄",
  avatar_crystal_lion: "🦁", avatar_royal_eagle: "🦅",
};

export default function BattleInvitePopup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [invites, setInvites] = useState<BattleInvite[]>([]);
  const [responding, setResponding] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // Listen for new battle_invite messages
    const channel = supabase
      .channel("battle-invites-popup")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${user.id}`,
        },
        async (payload) => {
          const msg = payload.new as any;
          if (msg.message_type !== "battle_invite" || !msg.battle_invite_id) return;

          // Fetch battle details
          const { data: battle } = await supabase
            .from("battles")
            .select("id, game_mode, rounds, realtime_mode, status")
            .eq("id", msg.battle_invite_id)
            .single();

          if (!battle || battle.status !== "pending") return;

          // Fetch sender profile
          const { data: profile } = await supabase
            .from("profiles_public")
            .select("username, avatar_url")
            .eq("user_id", msg.sender_id)
            .single();

          setInvites((prev) => [
            ...prev.filter((i) => i.battleId !== battle.id),
            {
              id: msg.id,
              battleId: battle.id,
              senderName: profile?.username ?? "Someone",
              senderAvatar: profile?.avatar_url ?? null,
              gameMode: battle.game_mode,
              rounds: battle.rounds,
              realtimeMode: battle.realtime_mode,
            },
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const handleAccept = async (invite: BattleInvite) => {
    setResponding(invite.battleId);
    navigate(`/battle/${invite.battleId}`);
    setInvites((prev) => prev.filter((i) => i.battleId !== invite.battleId));
    setResponding(null);
  };

  const handleDecline = async (invite: BattleInvite) => {
    setResponding(invite.battleId);
    // Update battle status to declined
    await supabase
      .from("battles")
      .update({ status: "declined" } as any)
      .eq("id", invite.battleId);
    setInvites((prev) => prev.filter((i) => i.battleId !== invite.battleId));
    setResponding(null);
  };

  if (!user || invites.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-3 max-w-sm w-full sm:w-auto pointer-events-none">
      <AnimatePresence>
        {invites.map((invite) => (
          <motion.div
            key={invite.battleId}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="pointer-events-auto glass rounded-xl border border-primary/50 p-4 shadow-2xl mx-2 sm:mx-0"
            style={{ boxShadow: "0 0 30px hsl(var(--primary) / 0.2)" }}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Swords className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-display text-sm font-bold text-foreground">Battle Invite!</p>
                  <button
                    onClick={() => setInvites((prev) => prev.filter((i) => i.battleId !== invite.battleId))}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="font-body text-xs text-muted-foreground mt-0.5">
                  <span className="text-foreground font-semibold">
                    {invite.senderAvatar && AVATARS_MAP[invite.senderAvatar]
                      ? `${AVATARS_MAP[invite.senderAvatar]} `
                      : ""}
                    {invite.senderName}
                  </span>{" "}
                  challenges you!
                </p>
                <p className="font-body text-[10px] text-muted-foreground/70 mt-0.5">
                  {invite.gameMode} · {invite.rounds} rounds
                  {invite.realtimeMode ? " · ⚡ Real-time" : ""}
                </p>
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="neon"
                    size="sm"
                    className="flex-1"
                    disabled={responding === invite.battleId}
                    onClick={() => handleAccept(invite)}
                  >
                    {responding === invite.battleId ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <>
                        <Swords className="w-3 h-3" /> Accept
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    disabled={responding === invite.battleId}
                    onClick={() => handleDecline(invite)}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
