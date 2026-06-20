import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Newspaper,
  Loader2,
  Calendar,
  Sparkles,
  Heart,
  Share2,
  Twitter,
  Facebook,
  Link2,
  Check,
  Clock,
  ArrowUp,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UpgradeProCTA from "@/components/UpgradeProCTA";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SITE_URL, usePageMeta } from "@/lib/seo";

interface NewsPost {
  id: string;
  post_date: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  image_url?: string | null;
  image_alt?: string | null;
  likes?: number;
}
interface RecentPost {
  id: string;
  post_date: string;
  title: string;
  summary: string;
  tags: string[];
  image_url?: string | null;
  likes?: number;
}

const FP_KEY = "lg_tn_fp";
function getFingerprint(): string {
  let fp = localStorage.getItem(FP_KEY);
  if (!fp) {
    fp = crypto.randomUUID();
    localStorage.setItem(FP_KEY, fp);
  }
  return fp;
}

function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export default function TechNews() {
  const [post, setPost] = useState<NewsPost | null>(null);
  const [recent, setRecent] = useState<RecentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeBusy, setLikeBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const articleRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

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
        setLikes(data.post?.likes ?? 0);
        setRecent((data.recent ?? []).filter((p: RecentPost) => p.id !== data.post?.id));
        // Restore liked state from localStorage
        const likedIds: string[] = JSON.parse(localStorage.getItem("lg_tn_liked") ?? "[]");
        if (data.post && likedIds.includes(data.post.id)) setLiked(true);
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

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const minutes = useMemo(() => (post ? readingTime(post.content) : 0), [post]);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = post ? `${post.title} — Daily Tech Pulse on LogicGuesser` : "";

  usePageMeta({
    title: post ? `${post.title} — Tech Pulse` : "Tech Pulse — LogicGuesser",
    description: post?.summary ?? "Daily technology brief for LogicGuesser players, covering AI, programming, gaming, hardware, and the web.",
    path: "/news",
    type: post ? "article" : "website",
    noindex: true,
    image: post?.image_url && post.image_url.startsWith("http") ? post.image_url : undefined,
    jsonLd: post
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.summary,
          datePublished: post.post_date,
          dateModified: post.post_date,
          image: post.image_url && post.image_url.startsWith("http") ? post.image_url : `${SITE_URL}/screenshot-desktop.png`,
          author: { "@type": "Organization", name: "LogicGuesser Editorial" },
          publisher: { "@type": "Organization", name: "LogicGuesser", url: SITE_URL },
          mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/news` },
        }
      : undefined,
  });

  async function toggleLike() {
    if (!post || likeBusy) return;
    setLikeBusy(true);
    const next = !liked;
    setLiked(next);
    setLikes((n) => Math.max(0, n + (next ? 1 : -1)));
    try {
      const { data } = await supabase.functions.invoke("tech-news-like", {
        body: {
          post_id: post.id,
          fingerprint: getFingerprint(),
          action: next ? "like" : "unlike",
        },
      });
      if (typeof data?.likes === "number") setLikes(data.likes);
      const likedIds: string[] = JSON.parse(localStorage.getItem("lg_tn_liked") ?? "[]");
      const updated = next
        ? Array.from(new Set([...likedIds, post.id]))
        : likedIds.filter((id) => id !== post.id);
      localStorage.setItem("lg_tn_liked", JSON.stringify(updated));
    } catch {
      // revert on failure
      setLiked(!next);
      setLikes((n) => Math.max(0, n + (next ? -1 : 1)));
      toast.error("Couldn't save your like");
    } finally {
      setLikeBusy(false);
    }
  }

  async function nativeShare() {
    if (!post) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, text: post.summary, url: shareUrl });
      } catch {
        /* user cancelled */
      }
    } else {
      copyLink();
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div className="min-h-screen bg-background grid-pattern">
      {/* Reading progress bar */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed top-0 left-0 right-0 h-1 origin-left bg-gradient-to-r from-primary via-accent to-primary z-[60]"
      />
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
            One concise editorial brief every day on what's moving in tech.
          </p>
        </motion.div>

        <div className="mb-8">
          <UpgradeProCTA variant="banner" message="Read ad-free with LOGICGUESSER Pro." />
        </div>

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
            ref={articleRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="overflow-hidden glass border border-primary/20">
              {post.image_url && (
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-muted">
                  <img
                    src={post.image_url}
                    alt={post.image_alt ?? post.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent pointer-events-none" />
                </div>
              )}
              <div className="p-6 sm:p-8">
                <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground font-body mb-3">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <time dateTime={post.post_date}>
                      {new Date(post.post_date).toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {minutes} min read
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1 text-primary">
                    <Sparkles className="w-3.5 h-3.5" />
                    Tech Pulse brief
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

                {/* Engagement bar */}
                <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center gap-2">
                  <Button
                    variant={liked ? "default" : "outline"}
                    size="sm"
                    onClick={toggleLike}
                    disabled={likeBusy}
                    className="gap-2"
                    aria-pressed={liked}
                  >
                    <motion.span
                      animate={liked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                    </motion.span>
                    {likes}
                  </Button>

                  <div className="ml-auto flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nativeShare}
                      className="gap-2"
                      title="Share"
                      aria-label="Share this Tech Pulse post"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                      title="Share on X / Twitter"
                      aria-label="Share this Tech Pulse post on X"
                    >
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                      title="Share on Facebook"
                      aria-label="Share this Tech Pulse post on Facebook"
                    >
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Facebook className="w-4 h-4" />
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyLink}
                      title="Copy link"
                      aria-label="Copy this Tech Pulse post link"
                    >
                      {copied ? <Check className="w-4 h-4 text-primary" /> : <Link2 className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.article>
        )}

        {recent.length > 0 && (
          <section className="mt-12">
            <h3 className="font-display text-lg font-bold text-foreground mb-4">Earlier this week</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {recent.map((p) => (
                <Card
                  key={p.id}
                  className="overflow-hidden hover:border-primary/40 transition-colors group"
                >
                  {p.image_url && (
                    <div className="relative w-full aspect-[16/9] overflow-hidden bg-muted">
                      <img
                        src={p.image_url}
                        alt={p.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="text-xs text-muted-foreground font-body mb-1 flex items-center gap-2">
                      <span>
                        {new Date(p.post_date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      {typeof p.likes === "number" && p.likes > 0 && (
                        <span className="inline-flex items-center gap-1 text-primary">
                          <Heart className="w-3 h-3 fill-current" />
                          {p.likes}
                        </span>
                      )}
                    </div>
                    <h4 className="font-display text-base font-semibold text-foreground mb-1">
                      {p.title}
                    </h4>
                    <p className="font-body text-sm text-muted-foreground line-clamp-2">
                      {p.summary}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Back-to-top */}
      {showTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:scale-110 transition-transform"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}

      <Footer />
    </div>
  );
}
