import { motion } from "framer-motion";
import { Heart, Coffee, Crown, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/lib/seo";

// Update these with your real donation handles when ready.
const DONATION_LINKS = {
  koFi: "https://ko-fi.com/logicguesser",
  buyMeACoffee: "https://buymeacoffee.com/logicguesser",
  paypal: "https://www.paypal.com/donate?business=support@logicguesser.com",
};

const TIERS = [
  { icon: Coffee, label: "Buy us a coffee", amount: "$3", desc: "Keeps a puzzle server warm for a day." },
  { icon: Heart, label: "Fuel a week", amount: "$10", desc: "Covers hosting for a full week of daily puzzles." },
  { icon: Crown, label: "Become a patron", amount: "$25+", desc: "Sponsors new puzzle categories and guides." },
];

export default function Support() {
  usePageMeta({
    title: "Support LogicGuesser — Donate & keep it ad-light",
    description: "LogicGuesser is independent and reader-funded. Support the site with a one-off tip or become a Pro member.",
    path: "/support",
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-body mb-6">
            <Heart className="w-4 h-4" />
            Reader-funded
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
            Support <span className="text-primary text-glow">LogicGuesser</span>
          </h1>
          <p className="font-body text-muted-foreground text-lg max-w-xl mx-auto">
            LogicGuesser is built by a small team and stays intentionally ad-light. If the daily puzzles brighten your morning, chip in what you can.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3 mb-12">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="glass rounded-xl border border-border/50 p-6 text-center hover:border-primary/40 transition-colors"
            >
              <tier.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="font-display text-2xl font-bold text-foreground mb-1">{tier.amount}</div>
              <div className="font-display text-sm text-foreground mb-2">{tier.label}</div>
              <div className="font-body text-xs text-muted-foreground">{tier.desc}</div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col gap-3 mb-12">
          <a href={DONATION_LINKS.koFi} target="_blank" rel="noopener noreferrer">
            <Button variant="neon" size="lg" className="w-full">
              <Coffee className="w-5 h-5" />
              Donate on Ko-fi
              <ExternalLink className="w-4 h-4 opacity-70" />
            </Button>
          </a>
          <a href={DONATION_LINKS.buyMeACoffee} target="_blank" rel="noopener noreferrer">
            <Button variant="neon-outline" size="lg" className="w-full">
              <Heart className="w-5 h-5" />
              Buy Me a Coffee
              <ExternalLink className="w-4 h-4 opacity-70" />
            </Button>
          </a>
          <a href={DONATION_LINKS.paypal} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="lg" className="w-full">
              Donate via PayPal
              <ExternalLink className="w-4 h-4 opacity-70" />
            </Button>
          </a>
        </div>

        <div className="glass rounded-xl border border-primary/30 p-6 text-center">
          <Crown className="w-8 h-8 text-primary mx-auto mb-3" />
          <div className="font-display text-lg font-bold text-foreground mb-2">
            Prefer perks with your support?
          </div>
          <p className="font-body text-sm text-muted-foreground mb-4">
            Go Pro for $2.49/mo — ad-free, retries, 2× credits, exclusive avatars.
          </p>
          <Link to="/pro">
            <Button variant="neon">
              <Crown className="w-4 h-4" />
              See Pro perks
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
