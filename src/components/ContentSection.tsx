import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Brain, Lightbulb, TrendingUp, Shield, BookOpen, ArrowRight, Archive, ClipboardCheck } from "lucide-react";

export default function ContentSection() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6 text-center">
            Why daily puzzles <span className="text-primary text-glow">actually work</span>
          </h2>

          <div className="prose prose-invert max-w-none font-body text-muted-foreground space-y-5 mb-12">
            <p className="text-lg leading-relaxed">
              Most "brain training" apps lean on a handful of pattern-matching games
              and call it a workout. The science says otherwise. Cognitive research
              consistently points to <strong>variety</strong>, <strong>novelty</strong>, and
              <strong> consistent short sessions</strong> as the three things that actually
              move the needle on working memory, processing speed, and verbal
              reasoning.
            </p>
            <p className="leading-relaxed">
              That is exactly how LogicGuesser is built. Every day brings a fresh
              Daily Challenge with five puzzles drawn from completely different
              categories — pure logic, word play, advanced math, visual SVG riddles,
              and code reasoning — so your brain never falls into a comfortable
              groove. Pair that with our Practice mode, where you can drill any
              category for as long as you like, and you have a complete cognitive gym
              that fits in a coffee break.
            </p>
            <p className="leading-relaxed">
              We also believe in <em>showing the work</em>. Every puzzle ships with a
              clean solution explanation once you have submitted your answer, so a
              wrong guess turns into a teaching moment instead of a dead end.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                icon: Brain,
                title: "Five puzzle styles, one feed",
                body:
                  "Logic grids, word riddles, math problems, visual SVG puzzles, and code-reasoning challenges rotate daily so no two sessions feel the same.",
              },
              {
                icon: Lightbulb,
                title: "Hints that teach, not cheat",
                body:
                  "Stuck? Spend a credit on a graduated hint — first a nudge, then a structural clue, finally the worked solution. You learn while you play.",
              },
              {
                icon: TrendingUp,
                title: "Streaks that compound",
                body:
                  "Daily streaks, XP-driven leveling, and seasonal leaderboards turn a five-minute habit into long-term cognitive growth you can measure.",
              },
              {
                icon: Shield,
                title: "Fair, ad-light, privacy-first",
                body:
                  "We use ads only on free accounts, never sell personal data, and apply row-level security on every table. Pro removes ads entirely.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="glass rounded-xl border border-border/50 p-6 hover:border-primary/30 transition-colors"
              >
                <c.icon className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {c.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {c.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              to="/guides"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg glass border border-primary/30 hover:border-primary text-primary font-display text-sm transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Read our long-form guides
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/puzzle-archive"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg glass border border-border/50 hover:border-primary text-foreground font-display text-sm transition-colors"
            >
              <Archive className="w-4 h-4" />
              Explore puzzle examples
            </Link>
            <Link
              to="/editorial-standards"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg glass border border-border/50 hover:border-primary text-foreground font-display text-sm transition-colors"
            >
              <ClipboardCheck className="w-4 h-4" />
              Review our standards
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
