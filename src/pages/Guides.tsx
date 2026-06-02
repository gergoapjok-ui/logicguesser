import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
import { guides } from "@/data/guides";
import AdSense from "@/components/AdSense";

export default function Guides() {
  useEffect(() => {
    document.title = "Guides & long-form articles — LogicGuesser";
    const meta =
      document.querySelector('meta[name="description"]') ||
      Object.assign(document.createElement("meta"), { name: "description" });
    meta.setAttribute(
      "content",
      "In-depth, original articles on logic puzzles, brain training science, daily-habit design, and the techniques used by the top solvers on LogicGuesser."
    );
    if (!meta.parentNode) document.head.appendChild(meta);
  }, []);

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <main className="pt-24 pb-16 container mx-auto px-4 max-w-5xl">
        <header className="mb-10">
          <div className="flex items-center gap-2 text-primary mb-3">
            <BookOpen className="w-5 h-5" />
            <span className="font-display text-sm uppercase tracking-wider">Library</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
            Guides for curious thinkers
          </h1>
          <p className="font-body text-muted-foreground text-lg max-w-2xl">
            Long-form, original articles on how to solve puzzles faster, what brain training
            actually does, and the editorial standards behind every puzzle we publish.
            Written by the LogicGuesser team — no AI filler, no recycled blog posts.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {guides.map((g) => (
            <Link key={g.slug} to={`/guides/${g.slug}`} className="group">
              <Card className="p-6 glass border-border/50 hover:border-primary/50 transition-all h-full flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="font-body">{g.category}</Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground font-body">
                    <Clock className="w-3 h-3" /> {g.readMinutes} min read
                  </span>
                </div>
                <h2 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {g.title}
                </h2>
                <p className="font-body text-sm text-muted-foreground mb-4 flex-1">
                  {g.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs text-muted-foreground font-body">
                    {new Date(g.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-primary text-sm font-display flex items-center gap-1">
                    Read <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <AdSense slot="3344556677" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
