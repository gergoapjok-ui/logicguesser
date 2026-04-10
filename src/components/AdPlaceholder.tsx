import { Crown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const AD_SLOTS = {
  sidebar: "2149775941",
  inContent: "3149651981",
} as const;

interface AdPlaceholderProps {
  className?: string;
  slot?: string;
}

export default function AdPlaceholder({ className = "", slot = AD_SLOTS.inContent }: AdPlaceholderProps) {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current || profile?.is_pro) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded
    }
  }, [profile?.is_pro]);

  if (profile?.is_pro) return null;

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-2187290520384465"
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
