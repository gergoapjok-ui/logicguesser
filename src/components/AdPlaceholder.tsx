// Monetag ad slots for free users.
// Multitag/push/onclick/vignette load globally from index.html.
// This component renders a "Sponsored" direct-link CTA in reserved layout slots.
import { ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const AD_SLOTS = {
  sidebar: "sidebar",
  inContent: "in-content",
  footer: "footer",
  header: "header",
} as const;

const DIRECT_LINK = "https://omg10.com/4/11266017";

interface AdPlaceholderProps {
  className?: string;
  slot?: string;
}

export default function AdPlaceholder({ className = "", slot = "in-content" }: AdPlaceholderProps) {
  const { profile } = useAuth();
  if (profile?.is_pro) return null;

  return (
    <aside
      aria-label="Sponsored"
      className={`glass rounded-xl border border-border/40 p-4 my-4 ${className}`}
      data-ad-slot={slot}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="font-body text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            Sponsored
          </div>
          <div className="font-display text-sm text-foreground truncate">
            Support LogicGuesser — check out today's featured offer
          </div>
        </div>
        <a
          href={DIRECT_LINK}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary text-xs font-body transition-colors whitespace-nowrap"
        >
          View <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </aside>
  );
}
