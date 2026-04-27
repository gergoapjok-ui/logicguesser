import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Video, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

// Replace with the real affiliate URL once provided
export const PIXVERSE_URL = "https://pixverse.ai/";

const DISMISS_KEY = "lg_pixverse_dismissed_until";
const VISIT_KEY = "lg_pixverse_visit_count";
const POPUP_EVERY = 4; // show every 4th visit

function shouldShowPopup() {
  try {
    const until = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (Date.now() < until) return false;
    const c = Number(localStorage.getItem(VISIT_KEY) || 0) + 1;
    localStorage.setItem(VISIT_KEY, String(c));
    return c % POPUP_EVERY === 0;
  } catch { return false; }
}

export function PixVerseBanner({ className = "" }: { className?: string }) {
  const { profile } = useAuth();
  const [hidden, setHidden] = useState(false);
  if (profile?.is_pro || hidden) return null;
  return (
    <div className={`relative glass border border-primary/30 rounded-xl px-4 py-3 flex items-center gap-3 ${className}`}>
      <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
        <Video className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display text-sm font-semibold">Turn your ideas into <span className="text-primary">AI videos</span> with PixVerse</p>
        <p className="text-xs text-muted-foreground truncate">Free trial — generate cinematic clips from text or images.</p>
      </div>
      <a href={PIXVERSE_URL} target="_blank" rel="noopener noreferrer sponsored">
        <Button size="sm" variant="neon"><Sparkles className="w-3.5 h-3.5" /> Try it</Button>
      </a>
      <button onClick={() => setHidden(true)} className="text-muted-foreground hover:text-foreground" aria-label="Dismiss">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function PixVerseSidebarCard() {
  const { profile } = useAuth();
  if (profile?.is_pro) return null;
  return (
    <a href={PIXVERSE_URL} target="_blank" rel="noopener noreferrer sponsored"
      className="block glass border border-primary/30 rounded-xl p-4 hover:border-primary/60 transition-colors group">
      <div className="flex items-center gap-2 mb-2">
        <Video className="w-4 h-4 text-primary" />
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Sponsored</span>
      </div>
      <p className="font-display text-sm font-bold mb-1 group-hover:text-primary transition-colors">PixVerse AI Video</p>
      <p className="text-xs text-muted-foreground mb-3">Create cinematic AI videos from text & images. Free to try.</p>
      <span className="inline-flex items-center gap-1 text-xs text-primary font-semibold">
        Try PixVerse <Sparkles className="w-3 h-3" />
      </span>
    </a>
  );
}

export function PixVersePopup() {
  const { profile } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (profile?.is_pro) return;
    const t = setTimeout(() => { if (shouldShowPopup()) setOpen(true); }, 8000);
    return () => clearTimeout(t);
  }, [profile?.is_pro]);

  const close = () => {
    setOpen(false);
    try { localStorage.setItem(DISMISS_KEY, String(Date.now() + 1000 * 60 * 60 * 24 * 3)); } catch { /* ignore */ }
  };

  if (profile?.is_pro) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed bottom-4 right-4 z-[90] max-w-xs"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
        >
          <div className="glass border border-primary/40 rounded-2xl p-4 relative shadow-xl">
            <button onClick={close} className="absolute top-2 right-2 text-muted-foreground hover:text-foreground" aria-label="Close">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                <Video className="w-4 h-4 text-primary" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Sponsored</span>
            </div>
            <p className="font-display text-base font-bold mb-1">Make AI videos with <span className="text-primary">PixVerse</span></p>
            <p className="text-xs text-muted-foreground mb-3">Generate stunning cinematic clips from a single prompt. Free trial.</p>
            <a href={PIXVERSE_URL} target="_blank" rel="noopener noreferrer sponsored" onClick={close}>
              <Button size="sm" variant="neon" className="w-full"><Sparkles className="w-3.5 h-3.5" /> Try PixVerse</Button>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
