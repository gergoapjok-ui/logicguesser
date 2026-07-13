// AdPlaceholder now renders in-house HouseAd campaigns.
// All third-party ad networks (AdSense, Monetag) have been removed.
import HouseAd from "./HouseAd";

export const AD_SLOTS = {
  sidebar: "sidebar",
  inContent: "in-content",
  footer: "footer",
  header: "header",
} as const;

interface AdPlaceholderProps {
  className?: string;
  slot?: string;
}

export default function AdPlaceholder({ className, slot }: AdPlaceholderProps) {
  return <HouseAd className={className} slot={slot} />;
}
