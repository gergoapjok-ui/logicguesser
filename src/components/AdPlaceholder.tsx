// AdSense removed — site switched to Monetag (loaded via /sw.js).
// Component kept as a no-op stub to preserve existing imports.
export const AD_SLOTS = {
  sidebar: "sidebar",
  inContent: "in-content",
} as const;

interface AdPlaceholderProps {
  className?: string;
  slot?: string;
}

export default function AdPlaceholder(_: AdPlaceholderProps) {
  return null;
}
