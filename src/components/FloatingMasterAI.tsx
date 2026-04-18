import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Sparkles, X } from "lucide-react";
import MasterAIChat from "./MasterAIChat";

const HIDE_ON = ["/login", "/signup", "/forgot-password", "/reset-password", "/ai"];

export default function FloatingMasterAI() {
  const [open, setOpen] = useState(false);
  const [pulsed, setPulsed] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    // Pulse once after 4s on first visit to hint at the AI
    const seen = localStorage.getItem("master_ai_seen");
    if (!seen) {
      const t = setTimeout(() => {
        setPulsed(true);
        localStorage.setItem("master_ai_seen", "1");
      }, 4000);
      return () => clearTimeout(t);
    }
  }, []);

  if (HIDE_ON.some(p => pathname.startsWith(p))) return null;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-3 sm:right-6 z-[60] w-[min(22rem,calc(100vw-1.5rem))]"
          >
            <MasterAIChat compact storageKey="master_ai_floating" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => { setOpen(o => !o); setPulsed(false); }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-4 right-3 sm:right-6 z-[60] w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center box-glow"
        aria-label="Open LogicGuesser Master AI"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-5 h-5" />
            </motion.span>
          ) : (
            <motion.span key="s" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Sparkles className="w-5 h-5" />
            </motion.span>
          )}
        </AnimatePresence>
        {pulsed && !open && (
          <span className="absolute inset-0 rounded-full border-2 border-primary animate-ping" />
        )}
      </motion.button>
    </>
  );
}
