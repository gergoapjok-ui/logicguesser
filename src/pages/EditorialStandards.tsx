import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { BadgeCheck, BookOpen, ClipboardCheck, ShieldCheck } from "lucide-react";
import { usePageMeta } from "@/lib/seo";

const standards = [
  {
    icon: ClipboardCheck,
    title: "Puzzle review",
    body: "Every official puzzle is checked for a unique answer, clear wording, fair difficulty, and a solution path that can be explained without guesswork.",
  },
  {
    icon: BookOpen,
    title: "Original guides",
    body: "Our guides are written as evergreen resources for players: practical solving methods, habit design, puzzle-writing references, and transparent product explanations.",
  },
  {
    icon: ShieldCheck,
    title: "Corrections",
    body: "If a puzzle, guide, or Tech Pulse brief contains an error, we update the page, preserve the learning value, and avoid silently repeating the same mistake.",
  },
  {
    icon: BadgeCheck,
    title: "Advertising separation",
    body: "Advertisements and affiliate promotions are kept separate from editorial claims. Pro subscribers do not see ads, and paid relationships are disclosed where relevant.",
  },
];

export default function EditorialStandards() {
  usePageMeta({
    title: "Editorial Standards — LogicGuesser",
    description: "How LogicGuesser reviews puzzles, writes guides, handles corrections, and separates editorial content from advertising.",
    path: "/editorial-standards",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "LogicGuesser Editorial Standards",
      url: "https://logic-guesser.lovable.app/editorial-standards",
      publisher: { "@type": "Organization", name: "LogicGuesser" },
    },
  });

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <main className="pt-24 pb-16 container mx-auto px-4 max-w-4xl">
        <header className="mb-10 max-w-3xl">
          <h1 className="font-display text-4xl font-bold text-foreground mb-3">
            Editorial standards
          </h1>
          <p className="font-body text-muted-foreground text-lg leading-relaxed">
            LogicGuesser is a puzzle platform first, but it also publishes guides and daily tech briefs.
            This page explains how we keep that content useful, original, and separate from ads.
          </p>
        </header>

        <section className="grid sm:grid-cols-2 gap-4 mb-12">
          {standards.map((item) => (
            <Card key={item.title} className="p-5 glass border-border/50">
              <item.icon className="w-6 h-6 text-primary mb-3" />
              <h2 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.body}</p>
            </Card>
          ))}
        </section>

        <article className="prose prose-invert max-w-none font-body text-muted-foreground space-y-6">
          <section>
            <h2 className="font-display text-2xl text-foreground">How official puzzles are selected</h2>
            <p>
              A puzzle is only useful when the player can trust the contract: the clue must contain enough
              information, the answer must be unique, and the explanation must show a reasonable path from
              clue to solution. Official Daily Challenge puzzles are reviewed against those standards before
              they appear in the main rotation. We reject puzzles that rely on hidden assumptions, ambiguous
              wording, copied trick questions, or brute-force work with no satisfying insight.
            </p>
            <p>
              Community submissions are welcome, but publication in the community pool is not the same as
              selection for the official daily set. The daily set is curated for variety: logic, word, math,
              visual, and code reasoning appear together so players practise different kinds of thinking.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">How guides are written</h2>
            <p>
              Guides are meant to be long-lived learning resources rather than search-engine filler. Each one
              focuses on a concrete player need: solving faster, understanding brain-training claims, building
              a daily habit, writing fair puzzles, or using guest accounts safely. We prefer direct examples,
              plain language, and practical steps over vague motivational copy.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">Tech Pulse policy</h2>
            <p>
              Tech Pulse is a short daily brief for players who like technology, games, AI, and the web. It is
              not financial, legal, medical, or investment advice. When automation helps prepare a brief, the
              final purpose remains editorial: summarise what matters, avoid invented certainty, and keep the
              article useful to a curious reader in a few minutes.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">Corrections and contact</h2>
            <p>
              If you spot an error, unclear clue, broken answer, or outdated guide section, contact us through
              the Contact page or the System Report button in the footer. Useful reports should include the
              page, puzzle date, expected answer, and why the current wording is confusing. We review correction
              reports before adding more content to the affected topic.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}