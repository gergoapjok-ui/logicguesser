import { motion } from "framer-motion";
import { Brain, Swords, ShoppingBag, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Daily Challenges",
    description: "A new logic puzzle every day. Solve it before the clock runs out.",
    color: "text-primary",
  },
  {
    icon: Swords,
    title: "Compete Globally",
    description: "Race against players worldwide and climb the global leaderboard.",
    color: "text-neon-purple",
  },
  {
    icon: BarChart3,
    title: "Track Progress",
    description: "Detailed stats, streaks, and performance analytics.",
    color: "text-neon-amber",
  },
  {
    icon: ShoppingBag,
    title: "Unlock Rewards",
    description: "Earn coins, buy themes, avatars, and power-ups in the shop.",
    color: "text-primary",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            HOW IT <span className="text-primary text-glow">WORKS</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-lg mx-auto">
            Simple to start, impossible to put down.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl border border-border/50 p-6 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className={`${feature.color} mb-4`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
