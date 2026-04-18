import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Tiny presence-based "live players" widget. Each visitor joins a shared
// realtime channel; we count distinct presences. No DB writes.
export default function LivePlayersWidget() {
  const { user } = useAuth();
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const id = user?.id ?? `guest-${crypto.randomUUID()}`;
    const channel = supabase.channel("global-presence", { config: { presence: { key: id } } });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  if (count <= 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30"
      aria-label="Live players online"
    >
      <span className="relative flex w-2 h-2">
        <span className="absolute inline-flex w-full h-full rounded-full bg-primary opacity-75 animate-ping" />
        <span className="relative inline-flex w-2 h-2 rounded-full bg-primary" />
      </span>
      <Activity className="w-3.5 h-3.5 text-primary" />
      <span className="font-display text-xs font-bold text-foreground">{count} online</span>
    </motion.div>
  );
}
