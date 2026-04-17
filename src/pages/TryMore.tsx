import { motion } from "framer-motion";
import { ExternalLink, Gamepad2, Youtube, Link as LinkIcon, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

interface Item {
  title: string;
  subtitle: string;
  description: string;
  url: string;
  icon: typeof Gamepad2;
  accent: string;
  cta: string;
}

const ITEMS: Item[] = [
  {
    title: "Royale Rush: Pixel Arena",
    subtitle: "Mobile Game · Google Play",
    description:
      "A fast-paced pixel-art battle royale where every second counts. Drop in, loot up, and outlast everyone in the arena.",
    url: "https://play.google.com/store/apps/details?id=com.corebitstudios.royalerush",
    icon: Gamepad2,
    accent: "from-neon to-neon-purple",
    cta: "Get on Google Play",
  },
  {
    title: "Corebit Studios on itch.io",
    subtitle: "Indie Games · itch.io",
    description:
      "Browse our full catalog of indie experiments, prototypes, and full releases — all crafted by Corebit Studios.",
    url: "https://corebitstudios.itch.io",
    icon: Sparkles,
    accent: "from-neon-amber to-neon",
    cta: "Visit itch.io page",
  },
  {
    title: "Corebit Studios — Linktree",
    subtitle: "All Our Links · One Place",
    description:
      "Every project, every social, every release. Find everything Corebit Studios is working on in one tidy hub.",
    url: "https://linktr.ee/corebitstudios",
    icon: LinkIcon,
    accent: "from-neon-purple to-neon",
    cta: "Open Linktree",
  },
  {
    title: "Fortnite Ördögök",
    subtitle: "YouTube Channel",
    description:
      "Hungarian Fortnite content — highlights, gameplay, and laughs. Subscribe to keep up with the squad.",
    url: "https://www.youtube.com/@fortniteordogok",
    icon: Youtube,
    accent: "from-destructive to-neon-amber",
    cta: "Watch on YouTube",
  },
];

export default function TryMore() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-10 sm:py-16 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10 sm:mb-14"
        >
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-neon via-neon-purple to-neon-amber bg-clip-text text-transparent">
            Try More of Us
          </h1>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
            Discover other games, channels, and projects from the team behind LogicGuesser.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:gap-6 sm:grid-cols-2">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.a
                key={item.title}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-border/50 glass p-6 hover:border-neon/60 transition-colors"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-0 group-hover:opacity-10 transition-opacity`}
                  aria-hidden
                />
                <div className="relative flex flex-col h-full gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.accent} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-6 h-6 text-background" />
                    </div>
                    <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-neon transition-colors" />
                  </div>

                  <div>
                    <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      {item.subtitle}
                    </p>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground group-hover:text-neon transition-colors">
                      {item.title}
                    </h2>
                  </div>

                  <p className="font-body text-sm text-muted-foreground flex-1">
                    {item.description}
                  </p>

                  <Button variant="neon" size="sm" className="w-full sm:w-auto self-start">
                    {item.cta}
                  </Button>
                </div>
              </motion.a>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center font-body text-sm text-muted-foreground mt-12"
        >
          Got a project we should feature? Send it through the System Report below.
        </motion.p>
      </main>

      <Footer />
    </div>
  );
}
