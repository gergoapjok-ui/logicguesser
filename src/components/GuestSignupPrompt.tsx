import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircle2, Copy, Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGuest } from "@/contexts/GuestContext";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function GuestSignupPrompt({ open, onClose, onCreated }: Props) {
  const { createGuest, guest } = useGuest();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  if (!open) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await createGuest(name.trim());
    setLoading(false);
    if (!res.ok) { toast.error(("error" in res && res.error) || "Failed"); return; }
    setShowCode(true);
    onCreated?.();
  };

  const copy = () => {
    if (!guest) return;
    navigator.clipboard.writeText(guest.claimCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
          className="glass rounded-2xl border border-border/50 w-full max-w-md p-6 relative"
        >
          <button onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>

          {!showCode ? (
            <>
              <div className="text-center mb-5">
                <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary mx-auto flex items-center justify-center mb-3">
                  <UserCircle2 className="w-7 h-7 text-primary" />
                </div>
                <h2 className="font-display text-2xl font-bold">Play as <span className="text-primary text-glow">Guest</span></h2>
                <p className="text-sm text-muted-foreground mt-2">Pick a display name. No email needed. You can claim your stats later when you sign up.</p>
              </div>
              <form onSubmit={handleCreate} className="space-y-3">
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Display name (2–20 chars)" maxLength={20} required minLength={2} />
                <Button type="submit" variant="neon" size="lg" className="w-full" disabled={loading}>
                  <Sparkles className="w-4 h-4" />
                  {loading ? "Creating…" : "Start playing"}
                </Button>
              </form>
              <p className="text-center text-xs text-muted-foreground mt-4">
                Want full features? <Link to="/signup" className="text-primary hover:underline" onClick={onClose}>Create an account</Link>
              </p>
            </>
          ) : (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary mx-auto flex items-center justify-center mb-3">
                <Check className="w-7 h-7 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold">Save your <span className="text-primary text-glow">claim code</span></h2>
              <p className="text-sm text-muted-foreground mt-2 mb-4">
                Write this down. You'll need it to transfer your stats to a real account later.
              </p>
              <div className="bg-secondary/60 border border-primary/40 rounded-lg p-4 font-mono text-lg text-primary tracking-wider mb-3 select-all">
                {guest?.claimCode}
              </div>
              <Button onClick={copy} variant="outline" className="w-full mb-3">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy code"}
              </Button>
              <Button onClick={() => { setShowCode(false); onClose(); }} variant="neon" size="lg" className="w-full">
                I've saved it — let me play
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
