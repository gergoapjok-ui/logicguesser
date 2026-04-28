import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home, Trophy, Dumbbell, ShoppingBag, Users, Swords, Globe, Sparkles, Bot,
  Newspaper, User, Settings, Crown, Zap, Smartphone, RotateCw,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import UpgradeProCTA from "@/components/UpgradeProCTA";

const TILES = [
  { path: "/daily", label: "Daily Challenge", desc: "Today's puzzles, ranked globally", icon: Zap, color: "text-primary", border: "border-primary/40", glow: "from-primary/20" },
  { path: "/practice", label: "Practice Mode", desc: "Endless puzzles, sharpen your edge", icon: Dumbbell, color: "text-neon-purple", border: "border-neon-purple/40", glow: "from-neon-purple/20" },
  { path: "/leaderboard", label: "Leaderboard", desc: "See who's on top this week", icon: Trophy, color: "text-neon-amber", border: "border-neon-amber/40", glow: "from-neon-amber/20" },
  { path: "/lobbies", label: "Battle Lobbies", desc: "1v1 and group battles in real time", icon: Swords, color: "text-destructive", border: "border-destructive/40", glow: "from-destructive/20" },
  { path: "/friends", label: "Friends", desc: "Chat, invite, compete with friends", icon: Users, color: "text-primary", border: "border-primary/40", glow: "from-primary/20" },
  { path: "/community", label: "Community Puzzles", desc: "Puzzles created by other players", icon: Globe, color: "text-neon-purple", border: "border-neon-purple/40", glow: "from-neon-purple/20" },
  { path: "/shop", label: "Shop", desc: "Avatars, themes, and credit packs", icon: ShoppingBag, color: "text-neon-amber", border: "border-neon-amber/40", glow: "from-neon-amber/20" },
  { path: "/news", label: "Tech News", desc: "Daily AI-curated tech pulse", icon: Newspaper, color: "text-primary", border: "border-primary/40", glow: "from-primary/20" },
  { path: "/ai", label: "Master AI", desc: "Chat with the puzzle master", icon: Bot, color: "text-neon-purple", border: "border-neon-purple/40", glow: "from-neon-purple/20" },
  { path: "/try-more", label: "Try More", desc: "Discover more game modes", icon: Sparkles, color: "text-neon-amber", border: "border-neon-amber/40", glow: "from-neon-amber/20" },
  { path: "/profile", label: "Profile", desc: "Stats, level, achievements", icon: User, color: "text-primary", border: "border-primary/40", glow: "from-primary/20" },
  { path: "/settings", label: "Settings", desc: "Preferences & notifications", icon: Settings, color: "text-muted-foreground", border: "border-border", glow: "from-muted/20" },
];

function useOrientation() {
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(() =>
    typeof window !== "undefined" && window.innerWidth >= window.innerHeight ? "landscape" : "portrait"
  );
  const [isDesktopWidth, setIsDesktopWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    const update = () => {
      setOrientation(window.innerWidth >= window.innerHeight ? "landscape" : "portrait");
      setIsDesktopWidth(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return { orientation, isDesktopWidth };
}

export default function Hub() {
  const { user, profile } = useAuth();
  const { orientation, isDesktopWidth } = useOrientation();
  const isPro = profile?.is_pro ?? false;

  // Hub is intended for desktop / landscape only.
  if (!isDesktopWidth || orientation !== "landscape") {
    return (
      <div className="min-h-screen bg-background grid-pattern">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl border border-primary/30 p-8 text-center"
          >
            <div className="relative w-16 h-16 mx-auto mb-4">
              <Smartphone className="w-16 h-16 text-primary mx-auto" />
              <RotateCw className="w-6 h-6 text-neon-amber absolute -top-1 -right-1 animate-spin-slow" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Desktop <span className="text-primary text-glow">Hub</span>
            </h1>
            <p className="font-body text-sm text-muted-foreground mb-6">
              The Hub is built for desktops and landscape view. Rotate your device or open
              LogicGuesser on a wider screen to use it.
            </p>
            <Link to="/">
              <Button variant="neon" className="w-full">
                <Home className="w-4 h-4" /> Back to Home
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-body mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Desktop Command Hub
          </div>
          <h1 className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-3">
            Welcome{user && profile?.username ? <>, <span className="text-primary text-glow">{profile.username}</span></> : <> to <span className="text-primary text-glow">LogicGuesser</span></>}
          </h1>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Jump into anything in one click. Built for landscape screens.
          </p>
        </motion.div>

        {/* Pro CTA banner (free users only) */}
        {!isPro && user && (
          <div className="mb-8">
            <UpgradeProCTA variant="banner" />
          </div>
        )}

        {/* Tile grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {TILES.map((tile, i) => (
            <motion.div
              key={tile.path}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link to={tile.path} className="block h-full group">
                <div className={`relative h-full overflow-hidden glass rounded-2xl border ${tile.border} p-6 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.4)] transition-all duration-300`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${tile.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-xl bg-background/40 border ${tile.border} flex items-center justify-center mb-4 ${tile.color}`}>
                      <tile.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-1">{tile.label}</h3>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed">{tile.desc}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Pro tile (free only) */}
          {!isPro && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: TILES.length * 0.04 }}
            >
              <Link to="/pro" className="block h-full group">
                <div className="relative h-full overflow-hidden rounded-2xl border border-neon-amber/50 bg-gradient-to-br from-neon-amber/15 via-neon-amber/5 to-transparent p-6 hover:scale-[1.02] transition-all duration-300">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon-amber/30 rounded-full blur-3xl" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-neon-amber/20 border border-neon-amber/50 flex items-center justify-center mb-4 text-neon-amber">
                      <Crown className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-neon-amber mb-1">Go Pro — $2.49/mo</h3>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed">
                      Ad-free, 2× credits, daily retries, exclusive avatars.
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
