import { Megaphone } from "lucide-react";

interface AdPlaceholderProps {
  className?: string;
}

export default function AdPlaceholder({ className = "" }: AdPlaceholderProps) {
  return (
    <div
      className={`rounded-xl border border-primary/20 bg-secondary/30 p-6 text-center ${className}`}
      style={{
        boxShadow: "inset 0 0 30px hsl(var(--neon) / 0.05), 0 0 15px hsl(var(--neon) / 0.05)",
      }}
    >
      <Megaphone className="w-5 h-5 text-primary/40 mx-auto mb-2" />
      <p className="font-display text-xs tracking-widest text-muted-foreground/60 uppercase">
        Sponsored
      </p>
      <div className="mt-3 h-20 rounded-lg border border-dashed border-primary/10 flex items-center justify-center">
        <span className="font-body text-xs text-muted-foreground/40">Ad space available</span>
      </div>
    </div>
  );
}
