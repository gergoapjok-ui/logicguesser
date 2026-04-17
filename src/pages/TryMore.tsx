import { motion } from "framer-motion";
import { ExternalLink, Gamepad2, Youtube, Sparkles, Music, Map, Globe, Swords } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import thumbRoyaleRush from "@/assets/thumb-royalerush.jpg";
import thumbCorebit from "@/assets/thumb-corebit.jpg";
import thumbLogicGuesser from "@/assets/thumb-logicguesser.jpg";
import thumbFdevil from "@/assets/thumb-fdevil.jpg";
import thumbFnOrdogok from "@/assets/thumb-fnordogok.jpg";
import thumbRguProd from "@/assets/thumb-rguprod.jpg";
import thumbKisvarosnezok from "@/assets/thumb-kisvarosnezok.jpg";

interface Item {
  title: string;
  subtitle: string;
  description: string;
  url: string;
  icon: typeof Gamepad2;
  accent: string;
  cta: string;
  thumb: string;
}

const ITEMS: Item[] = [
  {
    title: "Royale Rush",
    subtitle: "Mobile Game · Google Play",
    description:
      "A fast-paced battle royale where every second counts. Drop in, loot up, and outlast everyone in the arena.",
    url: "https://play.google.com/store/apps/details?id=com.royalrush",
    icon: Gamepad2,
    accent: "from-neon to-neon-purple",
    cta: "Get on Google Play",
    thumb: thumbRoyaleRush,
  },
  {
    title: "Corebit Studios on itch.io",
    subtitle: "Indie Games · itch.io",
    description:
      "Browse our full catalog of indie experiments, prototypes, and full releases — all crafted by Corebit Studios.",
    url: "https://corebit-studios.itch.io/",
    icon: Sparkles,
    accent: "from-neon-amber to-neon",
    cta: "Visit itch.io page",
    thumb: thumbCorebit,
  },
  {
    title: "LogicGuesser",
    subtitle: "This Website · logicguesser.com",
    description:
      "The brain-teasing puzzle platform you're already on. Share it with a friend who loves a daily challenge.",
    url: "https://logicguesser.com",
    icon: Globe,
    accent: "from-neon to-neon-amber",
    cta: "Open logicguesser.com",
    thumb: thumbLogicGuesser,
  },
  {
    title: "Fortnite Maps by fdevil",
    subtitle: "Fortnite Creative",
    description:
      "Custom Fortnite islands and creative maps. Jump in, play, and see what we've been building.",
    url: "https://www.fortnite.com/@fdevil",
    icon: Swords,
    accent: "from-neon-purple to-neon",
    cta: "Play the maps",
    thumb: thumbFdevil,
  },
  {
    title: "Fortnite Ördögök",
    subtitle: "YouTube Channel · Hungarian",
    description:
      "Hungarian Fortnite content — highlights, gameplay, and laughs from the old squad days.",
    url: "https://www.youtube.com/@Fortniteordogok",
    icon: Youtube,
    accent: "from-destructive to-neon-amber",
    cta: "Watch on YouTube",
    thumb: thumbFnOrdogok,
  },
  {
    title: "RGU Prod · Music",
    subtitle: "YouTube Channel · Music",
    description:
      "Original tracks and music productions. Press play and let it ride in the background.",
    url: "https://www.youtube.com/@rguprod",
    icon: Music,
    accent: "from-neon-purple to-neon-amber",
    cta: "Listen on YouTube",
    thumb: thumbRguProd,
  },
  {
    title: "Kisvárosnézők",
    subtitle: "Travel · Budapest Guide",
    description:
      "A favourite Budapest travel companion — small-town vibes, hidden spots, and great recommendations.",
    url: "https://www.kisvarosnezok.hu/",
    icon: Map,
    accent: "from-neon-amber to-neon-purple",
    cta: "Explore the guide",
    thumb: thumbKisvarosnezok,
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
            Discover other games, channels, music, and projects from the team behind LogicGuesser.
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
                transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-border/50 glass hover:border-neon/60 transition-colors flex flex-col"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={item.thumb}
                    alt={item.title}
                    width={768}
                    height={512}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div
                    className={`absolute top-3 left-3 w-10 h-10 rounded-xl bg-gradient-to-br ${item.accent} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-5 h-5 text-background" />
                  </div>
                  <ExternalLink className="absolute top-3 right-3 w-5 h-5 text-foreground/80 group-hover:text-neon transition-colors" />
                </div>

                <div className="relative flex flex-col flex-1 gap-3 p-5">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none`}
                    aria-hidden
                  />
                  <div className="relative">
                    <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      {item.subtitle}
                    </p>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground group-hover:text-neon transition-colors">
                      {item.title}
                    </h2>
                  </div>

                  <p className="relative font-body text-sm text-muted-foreground flex-1">
                    {item.description}
                  </p>

                  <Button variant="neon" size="sm" className="relative w-full sm:w-auto self-start">
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
