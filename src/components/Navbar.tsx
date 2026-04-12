import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Trophy, Dumbbell, ShoppingBag, User, Menu, X, Sun, Moon, LogIn, Flame, Coins, Users, Crown, Swords, Settings, Lightbulb, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import NotificationBell from "@/components/NotificationBell";

const AVATARS_MAP: Record<string, string> = {
  avatar_cyber_skull: "💀",
  avatar_neon_cat: "🐱",
  avatar_glitch_bot: "🤖",
  avatar_plasma_fox: "🦊",
  avatar_quantum_owl: "🦉",
  avatar_void_wolf: "🐺",
  avatar_pixel_dragon: "🐉",
  avatar_star_panda: "🐼",
};

const navItems = [
  { label: "Home", path: "/", icon: Home },
  { label: "Leaderboard", path: "/leaderboard", icon: Trophy },
  { label: "Practice", path: "/practice", icon: Dumbbell },
  { label: "Shop", path: "/shop", icon: ShoppingBag },
  { label: "Friends", path: "/friends", icon: Users },
  { label: "Lobbies", path: "/lobbies", icon: Swords },
  { label: "Community", path: "/community", icon: Globe },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("logicguesser-theme");
    if (saved) return saved === "dark";
    return document.documentElement.classList.contains("dark");
  });
  const { user, profile } = useAuth();

  const toggleDark = () => {
    const newDark = !dark;
    setDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("logicguesser-theme", newDark ? "dark" : "light");
  };

  const avatarEmoji = profile?.avatar_url ? AVATARS_MAP[profile.avatar_url] : null;

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-14 sm:h-16 px-4">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary flex items-center justify-center box-glow">
            <span className="font-display text-primary-foreground text-xs sm:text-sm font-bold">L</span>
          </div>
          <span className="font-display text-base sm:text-lg font-bold tracking-wider text-foreground">
            LOGIC<span className="text-primary">GUESSER</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("relative gap-2 font-body", active && "text-primary")}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </Button>
              </Link>
            );
          })}

          <Link to={user ? "/profile" : "/login"}>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "relative gap-2 font-body",
                (location.pathname === "/profile" || location.pathname === "/login") && "text-primary"
              )}
            >
              {user ? (
                avatarEmoji ? (
                  <span className="text-base">{avatarEmoji}</span>
                ) : (
                  <User className="w-4 h-4" />
                )
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {user ? "Profile" : "Login"}
            </Button>
          </Link>
        </div>

        {/* Right side icons — scrollable on small screens */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto flex-shrink-0 max-w-[50vw] sm:max-w-none scrollbar-hide">
          {user && profile?.is_pro && (
            <div className="flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-full bg-neon-amber/10 border border-neon-amber/30 flex-shrink-0">
              <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neon-amber" />
              <span className="font-display text-[10px] sm:text-xs font-bold text-neon-amber">PRO</span>
            </div>
          )}

          {user && profile && profile.current_streak > 0 && (
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/10 border border-destructive/20 flex-shrink-0">
              <Flame className="w-3.5 h-3.5 text-destructive" />
              <span className="font-display text-xs font-bold text-destructive">{profile.current_streak}</span>
            </div>
          )}

          {user && profile && (
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 border border-primary/20 flex-shrink-0">
              <Coins className="w-3.5 h-3.5 text-primary text-glow" />
              <span className="font-display text-xs font-bold text-foreground">{profile.credits}</span>
            </div>
          )}

          {user && <NotificationBell />}

          {user && (
            <Link to="/settings" className="flex-shrink-0">
              <Button variant="ghost" size="icon" className="w-8 h-8 sm:w-9 sm:h-9"><Settings className="w-4 h-4" /></Button>
            </Link>
          )}

          <Button variant="ghost" size="icon" onClick={toggleDark} className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden glass border-b border-border/50 px-4 pb-4 max-h-[70vh] overflow-y-auto"
          >
            {/* Mobile streak + credits */}
            {user && profile && (
              <div className="flex items-center gap-3 mb-2 pt-2 flex-wrap">
                {profile.current_streak > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/10 border border-destructive/20">
                    <Flame className="w-3.5 h-3.5 text-destructive" />
                    <span className="font-display text-xs font-bold text-destructive">{profile.current_streak}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <Coins className="w-3.5 h-3.5 text-primary" />
                  <span className="font-display text-xs font-bold text-foreground">{profile.credits}</span>
                </div>
              </div>
            )}

            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                  <Button
                    variant="ghost"
                    className={cn("w-full justify-start gap-3 my-1", active && "text-primary bg-primary/10")}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            <Link to={user ? "/profile" : "/login"} onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="w-full justify-start gap-3 my-1">
                {user ? <User className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                {user ? "Profile" : "Login"}
              </Button>
            </Link>
            {user && (
              <Link to="/settings" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-3 my-1">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
