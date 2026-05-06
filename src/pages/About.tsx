import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Brain, Target, Users, Sparkles } from "lucide-react";
import { useEffect } from "react";

export default function About() {
  useEffect(() => {
    document.title = "About LogicGuesser — Train Your Brain Daily";
  }, []);

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <main className="pt-24 pb-16 container mx-auto px-4 max-w-3xl">
        <header className="mb-10">
          <h1 className="font-display text-4xl font-bold text-foreground mb-3">
            About <span className="text-primary text-glow">LogicGuesser</span>
          </h1>
          <p className="font-body text-muted-foreground text-lg">
            A daily home for puzzle lovers, lateral thinkers, and curious minds.
          </p>
        </header>

        <article className="prose prose-invert max-w-none font-body text-muted-foreground space-y-6">
          <section>
            <h2 className="font-display text-2xl text-foreground">Our Mission</h2>
            <p>
              LogicGuesser was built on a simple idea: cognitive exercise should be as
              easy and enjoyable as scrolling a feed — but actually leave you sharper.
              Every day we hand-curate and AI-craft new logic puzzles, word riddles,
              math challenges, and lateral-thinking problems designed to stretch the
              way you reason. Whether you have three minutes during a coffee break or
              an hour for a deep dive, there is always something fresh waiting.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">What Makes Us Different</h2>
            <p>
              Most brain-training apps recycle the same matching games and call it
              cognition. We take a different angle. Our daily puzzle pipeline mixes
              five distinct categories — pure logic, word play, advanced math, visual
              SVG puzzles, and code reasoning — so you are never solving the same
              shape of problem twice. Each puzzle is paired with hints, explanations,
              and a community discussion thread, so when you do get stuck, learning
              is one tap away.
            </p>
            <p>
              On top of the daily run, we offer a full Practice mode with category
              filters, a global leaderboard with seasonal resets, real-time 1v1
              battles, friend lobbies, and a daily Tech Pulse column written by an AI
              editor that summarises what is genuinely worth knowing in tech today.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">Why Daily Matters</h2>
            <p>
              Cognitive research is consistent on one point: short, varied, and
              consistent practice beats long marathon sessions. A daily 5-minute habit
              of solving novel problems is associated with improved working memory,
              faster pattern recognition, and better verbal reasoning. LogicGuesser is
              designed around that habit. Streaks, gentle reminders, and a clean,
              ad-light interface keep the focus on thinking — not on the app.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">The Team</h2>
            <p>
              LogicGuesser is an independent project built by a small team of
              engineers and puzzle nerds. We obsess over puzzle quality, fairness, and
              accessibility. Every puzzle is reviewed before it goes live, and our
              community submission pipeline lets players propose their own creations
              for the official pool.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground">Get In Touch</h2>
            <p>
              Got feedback, a puzzle idea, or a press inquiry? Drop us a note via the
              <a href="/contact" className="text-primary"> contact page</a>. We read
              everything, and we reply to most messages within a couple of business
              days.
            </p>
          </section>
        </article>

        <div className="grid sm:grid-cols-2 gap-4 mt-10">
          {[
            { icon: Brain, t: "5 puzzle categories", d: "Logic, word, math, visual, code." },
            { icon: Target, t: "Daily streaks", d: "Build a habit that compounds." },
            { icon: Users, t: "Real-time battles", d: "Challenge friends or strangers." },
            { icon: Sparkles, t: "AI-curated content", d: "Fresh tech news every day." },
          ].map((f) => (
            <Card key={f.t} className="p-5 glass">
              <f.icon className="w-6 h-6 text-primary mb-2" />
              <div className="font-display font-semibold text-foreground">{f.t}</div>
              <div className="font-body text-sm text-muted-foreground">{f.d}</div>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
