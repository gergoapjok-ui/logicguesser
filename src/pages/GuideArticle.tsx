import { useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, Calendar, User, Share2 } from "lucide-react";
import { toast } from "sonner";
import { getGuide, guides } from "@/data/guides";
import AdSense from "@/components/AdSense";
import { usePageMeta } from "@/lib/seo";

export default function GuideArticle() {
  const { slug } = useParams<{ slug: string }>();
  const guide = slug ? getGuide(slug) : undefined;

  const related = useMemo(
    () => guides.filter((g) => g.slug !== slug).slice(0, 3),
    [slug]
  );

  usePageMeta({
    title: guide ? `${guide.title} — LogicGuesser` : "Guides — LogicGuesser",
    description: guide?.description ?? "Original LogicGuesser guides about puzzle solving and brain training.",
    path: guide ? `/guides/${guide.slug}` : "/guides",
    type: "article",
    jsonLd: guide ? {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      datePublished: guide.publishedAt,
      dateModified: guide.updatedAt,
      author: { "@type": "Organization", name: guide.author },
      publisher: {
        "@type": "Organization",
        name: "LogicGuesser",
        url: "https://logicguesser.com",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://logic-guesser.lovable.app/guides/${guide.slug}`,
      },
    } : undefined,
  });

  if (!guide) return <Navigate to="/guides" replace />;

  const share = async () => {
    const url = `https://logicguesser.com/guides/${guide.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: guide.title, text: guide.description, url });
        return;
      } catch {
        /* ignore */
      }
    }
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <main className="pt-24 pb-16 container mx-auto px-4 max-w-3xl">
        <Link
          to="/guides"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 font-body"
        >
          <ArrowLeft className="w-4 h-4" /> All guides
        </Link>

        <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground font-body">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-1">/</span>
          <Link to="/guides" className="hover:text-primary">Guides</Link>
          <span className="mx-1">/</span>
          <span className="text-foreground/70">{guide.category}</span>
        </nav>

        <header className="mb-8">
          <Badge variant="secondary" className="font-body mb-3">{guide.category}</Badge>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            {guide.title}
          </h1>
          <p className="font-body text-lg text-muted-foreground mb-4">
            {guide.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-body">
            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {guide.author}</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(guide.publishedAt).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {guide.readMinutes} min read</span>
            <Button variant="ghost" size="sm" onClick={share} className="gap-1 h-auto py-1 px-2">
              <Share2 className="w-3 h-3" /> Share
            </Button>
          </div>
        </header>

        <article
          className="font-body text-foreground/90 leading-relaxed space-y-4
            [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-bold
            [&_h3]:font-display [&_h3]:text-xl [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-semibold
            [&_p]:text-muted-foreground [&_p]:leading-relaxed
            [&_p.lead]:text-foreground [&_p.lead]:text-lg
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-muted-foreground [&_ul]:space-y-1
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:text-muted-foreground [&_ol]:space-y-1
            [&_strong]:text-foreground [&_em]:text-foreground/80
            [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline"
          dangerouslySetInnerHTML={{ __html: guide.html }}
        />

        <div className="mt-10">
          <AdSense slot="7788990011" />
        </div>

        <section className="mt-12">
          <h2 className="font-display text-xl font-bold text-foreground mb-4">Keep reading</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link key={r.slug} to={`/guides/${r.slug}`}>
                <Card className="p-4 glass border-border/50 hover:border-primary/50 transition-all h-full">
                  <Badge variant="secondary" className="font-body text-xs mb-2">{r.category}</Badge>
                  <div className="font-display text-sm font-semibold text-foreground line-clamp-3">
                    {r.title}
                  </div>
                  <div className="text-xs text-muted-foreground font-body mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {r.readMinutes} min
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
