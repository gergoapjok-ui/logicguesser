// AdPlaceholder disabled — Monetag Multitag renders its own creatives site-wide.
// Direct-link CTA removed because Monetag direct-link destinations were inappropriate.
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

export default function AdPlaceholder(_: AdPlaceholderProps) {
  return null;
}

