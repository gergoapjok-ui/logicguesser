import { Megaphone, Crown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdPlaceholderProps {
  className?: string;
  slot?: string;
}

export default function AdPlaceholder({ className = "", slot }: AdPlaceholderProps) {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!slot || pushed.current || profile?.is_pro) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded
    }
  }, [slot, profile?.is_pro]);

  // Don't show ads to Pro users
  if (profile?.is_pro) return null;

  // If we have a real AdSense slot, render it
  if (slot) {
    return (
      <div className={className}>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        <div className="text-center mt-2">
          <Button variant="link" size="sm" className="text-neon-amber text-xs p-0 h-auto" onClick={() => navigate("/pro")}>
            <Crown className="w-3 h-3 mr-1" /> Remove ads with Pro
          </Button>
        </div>
      </div>
    );
  }

  // Fallback placeholder until AdSense publisher ID is set
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
      <Button variant="link" size="sm" className="text-neon-amber text-xs mt-2 p-0 h-auto" onClick={() => navigate("/pro")}>
        <Crown className="w-3 h-3 mr-1" /> Remove ads with Pro
      </Button>
    </div>
  );
}
