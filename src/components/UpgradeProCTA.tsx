import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Crown, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

type Variant = "banner" | "inline" | "card" | "compact" | "floating";

interface Props {
  variant?: Variant;
  className?: string;
  message?: string;
}

/**
 * Upgrade-to-Pro CTA. Renders ONLY for logged-in free users.
 * (Hidden for Pro users and for logged-out visitors to avoid noise.)
 */
export default function UpgradeProCTA({ variant = "inline", className, message }: Props) {
  const { user, profile } = useAuth();
  if (!user) return null;
  if (profile?.is_pro) return null;

  if (variant === "banner") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-neon-amber/40 bg-gradient-to-r from-neon-amber/15 via-neon-amber/5 to-transparent p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5",
          className
        )}
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-neon-amber/20 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-neon-amber/20 border border-neon-amber/40 flex items-center justify-center flex-shrink-0">
            <Crown className="w-5 h-5 text-neon-amber" />
          </div>
          <div className="min-w-0">
            <p className="font-display text-sm sm:text-base font-bold text-foreground">
              {message ?? "Unlock LOGICGUESSER Pro"}
            </p>
            <p className="font-body text-xs sm:text-sm text-muted-foreground">
              Ad-free • 2× credits • Daily retries • Exclusive avatars — $2.49/mo
            </p>
          </div>
        </div>
        <Link to="/pro" className="w-full sm:w-auto flex-shrink-0">
          <Button variant="neon" className="w-full sm:w-auto bg-neon-amber hover:bg-neon-amber/90 text-background font-display">
            <Sparkles className="w-4 h-4" />
            Upgrade to Pro
          </Button>
        </Link>
      </motion.div>
    );
  }

  if (variant === "card") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "glass rounded-2xl border border-neon-amber/30 p-5 text-center relative overflow-hidden",
          className
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-neon-amber/10 to-transparent pointer-events-none" />
        <Crown className="w-8 h-8 text-neon-amber mx-auto mb-2 relative" />
        <p className="font-display text-base font-bold text-foreground mb-1 relative">Go Pro</p>
        <p className="font-body text-xs text-muted-foreground mb-3 relative">
          {message ?? "Remove ads, double your credits, retry the daily."}
        </p>
        <Link to="/pro" className="relative block">
          <Button variant="neon-outline" size="sm" className="w-full border-neon-amber/50 text-neon-amber hover:bg-neon-amber/10">
            <Zap className="w-4 h-4" /> Upgrade — $2.49/mo
          </Button>
        </Link>
      </motion.div>
    );
  }

  if (variant === "compact") {
    return (
      <Link to="/pro" className={cn("inline-block", className)}>
        <Button variant="neon-outline" size="sm" className="border-neon-amber/50 text-neon-amber hover:bg-neon-amber/10 font-display">
          <Crown className="w-4 h-4" /> Go Pro
        </Button>
      </Link>
    );
  }

  if (variant === "floating") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("fixed bottom-4 right-4 z-40 hidden sm:block", className)}
      >
        <Link to="/pro">
          <Button variant="neon" className="bg-neon-amber hover:bg-neon-amber/90 text-background shadow-lg font-display">
            <Crown className="w-4 h-4" /> Upgrade to Pro
          </Button>
        </Link>
      </motion.div>
    );
  }

  // inline (default)
  return (
    <Link to="/pro" className={cn("block", className)}>
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="flex items-center justify-between gap-3 rounded-xl border border-neon-amber/30 bg-neon-amber/5 px-4 py-3 hover:bg-neon-amber/10 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Crown className="w-4 h-4 text-neon-amber flex-shrink-0" />
          <span className="font-body text-sm text-foreground truncate">
            {message ?? "Want more? Go Pro for ad-free play, 2× credits, and retries."}
          </span>
        </div>
        <span className="font-display text-xs font-bold text-neon-amber flex-shrink-0">UPGRADE →</span>
      </motion.div>
    </Link>
  );
}
