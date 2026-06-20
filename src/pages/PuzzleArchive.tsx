import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Code2, Eye, Hash, Lightbulb } from "lucide-react";
import { usePageMeta } from "@/lib/seo";

const examples = [
  {
    icon: Brain,
    category: "Logic",
    title: "The three switches problem",
    prompt: "Three switches sit outside a closed room. Only one controls the lamp inside. You may enter the room once. How do you identify the switch?",
    answer: "Use heat as extra information: leave one switch on, briefly turn a second on then off, and leave the third untouched.",
  },
  {
    icon: Hash,
    category: "Math",
    title: "The missing unit",
    prompt: "A clock gains 10 minutes every hour. If it is correct at noon, what time does it show when the real time is 6 PM?",
    answer: "It gains 60 minutes over 6 real hours, so it shows 7:00 PM.",
  },
  {
    icon: Eye,
    category: "Visual",
    title: "Pattern rotation",
    prompt: "A shape rotates 90° clockwise each step while its filled corner alternates. Which corner is filled after five steps?",
    answer: "Track rotation and fill separately; the fifth state matches the first rotation with the opposite fill.",
  },
  {
    icon: Code2,
    category: "Code",
    title: "Boolean shortcut",
    prompt: "If A is false, what does A && expensiveCheck() return, and is expensiveCheck called?",
    answer: "It returns false immediately; short-circuit evaluation skips the function call.",
  },
];

const calendar = [
  "Monday: logic-grid and ordering puzzles",
  "Tuesday: wordplay, ciphers, and vocabulary puzzles",
  "Wednesday: math reasoning and estimation",
  "Thursday: visual pattern and SVG-based puzzles",
  "Friday: code, algorithms, and boolean reasoning",
  "Weekend: mixed sets with easier warmups",
];

export default function PuzzleArchive() {
  usePageMeta({
    title: "Puzzle Archive & Examples — LogicGuesser",
    description: "Explore LogicGuesser puzzle categories, sample challenges, answer explanations, and the weekly Daily Challenge rotation.",
    path: "/puzzle-archive",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "LogicGuesser Puzzle Archive",
      url: "https://logicguesser.com/puzzle-archive",
      description: "Sample puzzle categories and explanations from LogicGuesser.",
    },
  });

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <main className="pt-24 pb-16 container mx-auto px-4 max-w-5xl">
        <header className="mb-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-primary mb-3 font-display text-sm uppercase">
            <Lightbulb className="w-5 h-5" /> Puzzle library
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
            Puzzle archive and examples
          </h1>
          <p className="font-body text-muted-foreground text-lg leading-relaxed">
            The live Daily Challenge changes every day, but the reasoning styles stay consistent.
            Use this archive page to understand the categories we publish and the kind of explanations
            players receive after each solve.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-5 mb-12">
          {examples.map((item) => (
            <Card key={item.title} className="p-6 glass border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <Badge variant="secondary" className="font-body text-xs mb-1">{item.category}</Badge>
                  <h2 className="font-display text-lg font-semibold text-foreground">{item.title}</h2>
                </div>
              </div>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">{item.prompt}</p>
              <div className="rounded-lg border border-border/50 bg-secondary/30 p-4">
                <p className="font-body text-xs uppercase text-primary mb-1">Explanation</p>
                <p className="font-body text-sm text-foreground/90 leading-relaxed">{item.answer}</p>
              </div>
            </Card>
          ))}
        </section>

        <section className="grid md:grid-cols-[1fr_0.8fr] gap-8 items-start">
          <article className="prose prose-invert max-w-none font-body text-muted-foreground">
            <h2 className="font-display text-2xl text-foreground">What the archive is for</h2>
            <p>
              LogicGuesser does not expose the full answer bank publicly because that would spoil the Daily
              Challenge. Instead, this page documents the puzzle types, sample formats, and solution standards
              we use. It gives new players enough context to learn without turning the game into a list of
              copied answers.
            </p>
            <p>
              For full-length strategy, read the Guides section. For today's active set, play the Daily Challenge.
              For unlimited category practice, use Practice mode and switch categories until the reasoning style
              feels natural.
            </p>
          </article>

          <Card className="p-6 glass border-primary/20">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">Weekly rotation</h2>
            <ul className="space-y-3 mb-6">
              {calendar.map((line) => (
                <li key={line} className="font-body text-sm text-muted-foreground flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <Link to="/daily">
              <Button variant="neon" className="w-full gap-2">
                Play today <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
}