import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

export interface GuestSession {
  id: string;
  displayName: string;
  claimCode: string;
  xp: number;
  credits: number;
  currentStreak: number;
  lastCompletedDate: string | null;
}

interface Ctx {
  guest: GuestSession | null;
  loading: boolean;
  createGuest: (name: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  signOutGuest: () => void;
  awardGuest: (opts: { addXp?: number; addCredits?: number; completedToday?: boolean; leaderboard?: { puzzleId: string; timeTaken: number } }) => Promise<void>;
}

const GuestContext = createContext<Ctx>({
  guest: null, loading: true,
  createGuest: async () => ({ ok: false, error: "" }),
  signOutGuest: () => {},
  awardGuest: async () => {},
});

export const useGuest = () => useContext(GuestContext);

const KEY = "lg_guest_session_v1";

export function GuestProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [guest, setGuest] = useState<GuestSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setGuest(JSON.parse(raw));
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  // If real user logs in, hide guest session (don't delete - kept for claim flow)
  useEffect(() => {
    if (user) setGuest(null);
  }, [user]);

  const persist = (g: GuestSession | null) => {
    if (g) localStorage.setItem(KEY, JSON.stringify(g));
    else localStorage.removeItem(KEY);
    setGuest(g);
  };

  const createGuest = useCallback(async (name: string) => {
    const { data, error } = await supabase.functions.invoke("guest-create", {
      body: { displayName: name },
    });
    if (error || !data?.guest) return { ok: false as const, error: data?.error || error?.message || "Failed" };
    const g: GuestSession = {
      id: data.guest.id,
      displayName: data.guest.display_name,
      claimCode: data.claimCode,
      xp: 0, credits: 0, currentStreak: 0, lastCompletedDate: null,
    };
    persist(g);
    return { ok: true as const };
  }, []);

  const signOutGuest = useCallback(() => persist(null), []);

  const awardGuest = useCallback(async (opts: Parameters<Ctx["awardGuest"]>[0]) => {
    if (!guest) return;
    const { data } = await supabase.functions.invoke("guest-update", {
      body: { guestId: guest.id, ...opts },
    });
    if (data?.guest) {
      persist({
        ...guest,
        xp: data.guest.xp,
        credits: data.guest.credits,
        currentStreak: data.guest.current_streak,
        lastCompletedDate: data.guest.last_completed_date,
      });
    }
  }, [guest]);

  return (
    <GuestContext.Provider value={{ guest, loading, createGuest, signOutGuest, awardGuest }}>
      {children}
    </GuestContext.Provider>
  );
}
