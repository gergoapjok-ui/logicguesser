import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, Loader2, Calendar, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface NewsPost {
  id: string;
  post_date: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
}
interface RecentPost {
  id: string;
  post_date: string;
  title: string;
  summary: string;
  tags: string[];
}

export default function TechNews() {
  const [post, setPost] = useState<NewsPost | null>(null);
  const [recent, setRecent] = useState<RecentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase.functions.invoke("tech-news-today");
        if (cancelled) return;
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        setPost(data.post);
        setRecent((data.recent ?? []).filter((p: RecentPost) => p.id !== data.post?.id));
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load news");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <main className="pt-24 pb-16 container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <Newspaper className="w-10 h-10 text-primary mx-auto mb-3 text-glow" />
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Daily <span className="text-primary text-glow">Tech Pulse</span>
          </h1>
          <p className="font-body text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            One AI-curated post every day on what's moving in tech.
          </p>
        </motion.div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-primary" />
            <p className="font-body text-sm">Brewing today's headlines…</p>
          </div>
        )}

        {error && !loading && (
          <Card className="p-6 border-destructive/40">
            <p className="font-body text-sm text-destructive">{error}</p>
          </Card>
        )}

        {post && !loading && (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 sm:p-8 glass border border-primary/20">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-body mb-3">
                <Calendar className="w-3.5 h-3.5" />
                <time dateTime={post.post_date}>
                  {new Date(post.post_date).toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span className="ml-auto inline-flex items-center gap-1 text-primary">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI generated
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3 leading-tight">
                {post.title}
              </h2>
              <p className="font-body text-base text-muted-foreground mb-5">{post.summary}</p>
              {post.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="font-body text-xs">
                      #{t}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none font-body prose-headings:font-display prose-strong:text-foreground prose-a:text-primary">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
              </div>
            </Card>
          </motion.article>
        )}

        {recent.length > 0 && (
          <section className="mt-12">
            <h3 className="font-display text-lg font-bold text-foreground mb-4">Earlier this week</h3>
            <div className="grid gap-3">
              {recent.map((p) => (
                <Card key={p.id} className="p-4 hover:border-primary/40 transition-colors">
                  <div className="text-xs text-muted-foreground font-body mb-1">
                    {new Date(p.post_date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <h4 className="font-display text-base font-semibold text-foreground mb-1">
                    {p.title}
                  </h4>
                  <p className="font-body text-sm text-muted-foreground line-clamp-2">{p.summary}</p>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
