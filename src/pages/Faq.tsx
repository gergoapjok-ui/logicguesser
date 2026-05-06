import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect } from "react";

const faqs = [
  {
    q: "Is LogicGuesser free?",
    a: "Yes. The Daily Challenge, Practice mode, leaderboards, friends, lobbies, and Tech Pulse news are all free forever. We offer an optional Pro plan ($2.49 / month) that removes ads, doubles credit rewards, gives you unlimited daily retries, and unlocks higher lobby caps.",
  },
  {
    q: "Do I need an account to play?",
    a: "No. You can play the Daily Challenge and Practice mode as a guest — just pick a display name and you are in. Your stats, streak, and credits travel with you. When you later sign up with the same display name and your guest claim code, everything merges into your new account automatically.",
  },
  {
    q: "How are puzzles created?",
    a: "Our puzzle library mixes hand-written puzzles from the team, community submissions vetted by moderators, and AI-generated puzzles that go through an automated quality and difficulty filter before they ever appear in front of players.",
  },
  {
    q: "How does the streak work?",
    a: "Solve the Daily Challenge any time before midnight UTC and your streak goes up by one. Miss a day and your streak resets to zero, but Pro subscribers get one streak-freeze per month to forgive a missed day.",
  },
  {
    q: "How is the leaderboard scored?",
    a: "Each daily puzzle awards points based on speed, accuracy, and difficulty. Points roll into a global, weekly, and friends-only leaderboard. Cheating and automation are detected and removed.",
  },
  {
    q: "Can I play with friends?",
    a: "Yes. Send a friend request from any profile, then create a private lobby or a 1v1 battle. Battles support both Real-Time mode (everyone races on the same clock) and At Own Pace mode (24-hour async puzzles).",
  },
  {
    q: "How do I cancel Pro?",
    a: "Open Settings, click Manage subscription, and you will be redirected to the Stripe customer portal where you can cancel in one click. Your Pro perks remain active until the end of the current billing period.",
  },
  {
    q: "Can I submit my own puzzles?",
    a: "Absolutely. Use the Submit Puzzle page. Community submissions are auto-published to the Community pool and reviewed for inclusion in the official Daily rotation.",
  },
  {
    q: "Do you support languages other than English?",
    a: "We currently support English, Hungarian, Latin, Greek, and Chinese. Switch languages from Settings.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. We use TLS in transit, encryption at rest, hashed passwords, and row-level security policies on every table. See our Privacy Policy for the full breakdown.",
  },
];

export default function Faq() {
  useEffect(() => {
    document.title = "FAQ — LogicGuesser";

    // JSON-LD FAQ schema for SEO
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <main className="pt-24 pb-16 container mx-auto px-4 max-w-3xl">
        <h1 className="font-display text-4xl font-bold text-foreground mb-3">
          Frequently asked questions
        </h1>
        <p className="font-body text-muted-foreground text-lg mb-8">
          The short answers to the things people ask us most.
        </p>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="glass border border-border/50 rounded-lg px-4"
            >
              <AccordionTrigger className="font-display text-left text-foreground hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="font-body text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
      <Footer />
    </div>
  );
}
