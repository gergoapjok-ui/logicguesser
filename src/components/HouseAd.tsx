// House ads — in-house promotional slots (no third-party networks).
// Rotates between curated destinations. Hidden for Pro users.
import { useMemo } from "react";
import { ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type Campaign = {
  id: string;
  title: string;
  tagline: string;
  cta: string;
  url: string;
  accent: "primary" | "purple";
};

const CAMPAIGNS: Campaign[] = [
  {
    id: "royale-rush",
    title: "Royale Rush: Pixel Arena",
    tagline: "Fast-paced pixel battle royale — free on Google Play.",
    cta: "Play on Google Play",
    url: "https://play.google.com/store/apps/details?id=com.royalerush.pixelarena",
    accent: "primary",
  },
  {
    id: "kisvarosnezok",
    title: "Kisvárosnézők",
    tagline: "Fedezd fel Magyarország rejtett kisvárosait.",
    cta: "Visit kisvarosnezok.hu",
    url: "https://kisvarosnezok.hu",
    accent: "purple",
  },
];

interface HouseAdProps {
  className?: string;
  slot?: string;
  /** Force a specific campaign id; otherwise deterministic by slot. */
  campaignId?: string;
}

export default function HouseAd({ className = "", slot = "default", campaignId }: HouseAdProps) {
  const { profile } = useAuth();

  const campaign = useMemo(() => {
    if (campaignId) return CAMPAIGNS.find((c) => c.id === campaignId) ?? CAMPAIGNS[0];
    // Deterministic rotation per slot + day so users see variety without flicker.
    const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const seed = [...`${slot}-${day}`].reduce((a, c) => a + c.charCodeAt(0), 0);
    return CAMPAIGNS[seed % CAMPAIGNS.length];
  }, [slot, campaignId]);

  if (profile?.is_pro) return null;

  const accentBorder = campaign.accent === "primary" ? "border-primary/30" : "border-neon-purple/30";
  const accentGlow = campaign.accent === "primary" ? "bg-primary/5" : "bg-neon-purple/5";
  const accentText = campaign.accent === "primary" ? "text-primary" : "text-neon-purple";
  const accentBtn =
    campaign.accent === "primary"
      ? "bg-primary/10 hover:bg-primary/20 text-primary"
      : "bg-neon-purple/10 hover:bg-neon-purple/20 text-neon-purple";

  return (
    <aside
      aria-label="Sponsored"
      data-ad-slot={slot}
      className={`glass rounded-xl border ${accentBorder} ${accentGlow} p-4 my-4 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className={`font-body text-[10px] uppercase tracking-wider ${accentText} mb-1`}>
            Sponsored
          </div>
          <div className="font-display text-sm font-semibold text-foreground truncate">
            {campaign.title}
          </div>
          <div className="font-body text-xs text-muted-foreground truncate">
            {campaign.tagline}
          </div>
        </div>
        <a
          href={campaign.url}
          target="_blank"
          rel="nofollow sponsored noopener"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-body transition-colors whitespace-nowrap ${accentBtn}`}
        >
          {campaign.cta}
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </aside>
  );
}
