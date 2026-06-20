import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, Brain, Trophy, Target, UserCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LivePlayersWidget from "@/components/LivePlayersWidget";
import GuestSignupPrompt from "@/components/GuestSignupPrompt";
import { useAuth } from "@/contexts/AuthContext";
import { useGuest } from "@/contexts/GuestContext";

export default function HeroSection() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { guest } = useGuest();
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);

  const stats = [
    { icon: Brain, label: t("hero.statPuzzles"), value: "2.4M+" },
    { icon: Trophy, label: t("hero.statPlayers"), value: "85K+" },
    { icon: Target, label: t("hero.statDaily"), value: "365" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden grid-pattern">
      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-body mb-8"
          >
            <Zap className="w-4 h-4" />
            {t("hero.badge")}
          </motion.div>

          <div className="mb-6 flex justify-center"><LivePlayersWidget /></div>

          {/* Title */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
            <span className="text-foreground">{t("hero.title")}</span>
            <span className="text-primary text-glow">{t("hero.title2")}</span>
            <span className="sr-only"> — daily logic puzzles, brain games, and reasoning challenges</span>
          </h1>

          <p className="font-body text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("hero.subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-stretch sm:items-center gap-3 mb-8 max-w-md sm:max-w-none mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Link to="/daily" className="block">
                  <Button variant="neon" size="lg" className="w-full sm:w-auto sm:h-14 sm:px-10 sm:text-lg">
                    <Zap className="w-5 h-5" />
                    {t("hero.daily")}
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Link to="/practice" className="block">
                  <Button variant="neon-outline" size="lg" className="w-full sm:w-auto sm:h-14 sm:px-10 sm:text-lg">
                    {t("hero.practice")}
                  </Button>
                </Link>
              </motion.div>
            </div>
            {!user && !guest && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGuestPrompt(true)}
                  className="w-full sm:w-auto text-muted-foreground hover:text-primary font-body"
                >
                  <UserCircle2 className="w-4 h-4" />
                  Play as guest — no account needed
                </Button>
              </motion.div>
            )}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass rounded-xl border border-border/50 p-6 hover:border-primary/30 transition-colors"
              >
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-3" />
                <div className="font-display text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="font-body text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <GuestSignupPrompt open={showGuestPrompt} onClose={() => setShowGuestPrompt(false)} />
    </section>
  );
}
