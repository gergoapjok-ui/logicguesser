import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
  data?: Record<string, any> | null;
}

export default function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    fetchNotifications();

    const channel = supabase
      .channel("my-notifications")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, (payload) => {
        const n = payload.new as Notification;
        setNotifications(prev => [n, ...prev].slice(0, 20));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handler);
    }, 10);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handler);
    };
  }, [open]);

  const fetchNotifications = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setNotifications(data as any);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = async () => {
    if (!user || unreadCount === 0) return;
    await supabase
      .from("notifications")
      .update({ read: true } as any)
      .eq("user_id", user.id)
      .eq("read", false);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = async () => {
    if (!user || notifications.length === 0) return;
    const ids = notifications.map(n => n.id);
    await supabase.from("notifications").delete().in("id", ids);
    setNotifications([]);
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!user) return;

    if (!notification.read) {
      await supabase.from("notifications").update({ read: true } as any).eq("id", notification.id);
      setNotifications((prev) => prev.map((item) => item.id === notification.id ? { ...item, read: true } : item));
    }

    setOpen(false);

    const battleId = notification.data?.battle_id || notification.data?.battle_invite_id;
    if (battleId) return navigate(`/battle/${battleId}`);
    if (notification.type === "friend_request" || notification.type === "friend_accept") return navigate("/friends");
    if (notification.type === "credit_reward") return navigate("/profile");
  };

  if (!user) return null;

  return (
    <div className="relative flex-shrink-0" ref={containerRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative w-8 h-8 sm:w-9 sm:h-9"
        aria-label={open ? "Close notifications" : "Open notifications"}
        aria-expanded={open}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) markAllRead();
        }}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="fixed left-2 right-2 top-[4rem] z-50 
              sm:absolute sm:left-auto sm:right-0 sm:top-10 sm:w-80 
              landscape:sm:w-96 landscape:max-h-[50vh]
              max-h-[60vh] overflow-y-auto glass rounded-xl border border-border/50 shadow-xl"
          >
            <div className="p-3 border-b border-border/30 flex items-center justify-between sticky top-0 glass z-10">
              <p className="font-display text-xs font-bold text-foreground uppercase tracking-wider">Notifications</p>
              {notifications.length > 0 && (
                <button onClick={clearAll} className="font-body text-[10px] text-muted-foreground hover:text-destructive transition-colors">
                  Clear all
                </button>
              )}
            </div>
            {notifications.length === 0 ? (
              <div className="p-4 text-center">
                <p className="font-body text-xs text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-border/20">
                {notifications.map(n => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => handleNotificationClick(n)}
                    className={`block w-full p-3 text-left transition-colors hover:bg-secondary/40 cursor-pointer ${!n.read ? "bg-primary/5" : ""}`}
                  >
                    <p className="font-display text-xs font-bold text-foreground">{n.title}</p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
                    <p className="font-body text-[10px] text-muted-foreground/60 mt-1">
                      {new Date(n.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
