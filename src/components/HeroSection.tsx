import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, Brain, Trophy, Target } from "lucide-react";

const stats = [
  { icon: Brain, label: "Puzzles Solved", value: "2.4M+" },
  { icon: Trophy, label: "Active Players", value: "85K+" },
  { icon: Target, label: "Daily Challenges", value: "365" },
];

export default function HeroSection() {
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
            New Daily Challenge Available
          </motion.div>

          {/* Title */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
            <span className="text-foreground">LOGIC</span>
            <span className="text-primary text-glow">GUESSER</span>
          </h1>

          <p className="font-body text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Challenge your mind with daily logic puzzles. Compete globally,
            climb the leaderboard, and prove you're the sharpest thinker.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button variant="neon" size="xl">
                <Zap className="w-5 h-5" />
                Start Daily Challenge
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button variant="neon-outline" size="lg">
                Practice Mode
              </Button>
            </motion.div>
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
    </section>
  );
}
