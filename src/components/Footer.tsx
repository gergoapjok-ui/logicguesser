import { useState } from "react";
import { Bug } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function Footer() {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (!feedback.trim()) return;
    toast.success("Thank you! Your report has been submitted.");
    setFeedback("");
    setOpen(false);
  };

  const linkCol = "flex flex-col gap-2 font-body text-sm";
  const linkCls = "text-muted-foreground hover:text-primary transition-colors";

  return (
    <footer className="border-t border-border/50 mt-16">
      <div className="container mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="font-display text-lg font-bold text-foreground mb-2">
            LOGIC<span className="text-primary text-glow">GUESSER</span>
          </div>
          <p className="font-body text-sm text-muted-foreground">
            Train your brain with a fresh logic puzzle every day. Built for curious
            minds.
          </p>
        </div>

        <div>
          <div className="font-display text-sm font-semibold text-foreground mb-3">Play</div>
          <nav className={linkCol}>
            <Link to="/daily" className={linkCls}>Daily Challenge</Link>
            <Link to="/practice" className={linkCls}>Practice</Link>
            <Link to="/leaderboard" className={linkCls}>Leaderboard</Link>
            <Link to="/news" className={linkCls}>Tech Pulse</Link>
          </nav>
        </div>

        <div>
          <div className="font-display text-sm font-semibold text-foreground mb-3">Company</div>
          <nav className={linkCol}>
            <Link to="/about" className={linkCls}>About</Link>
            <Link to="/guides" className={linkCls}>Guides</Link>
            <Link to="/faq" className={linkCls}>FAQ</Link>
            <Link to="/contact" className={linkCls}>Contact</Link>
            <Link to="/pro" className={linkCls}>Go Pro</Link>
          </nav>
        </div>

        <div>
          <div className="font-display text-sm font-semibold text-foreground mb-3">Legal</div>
          <nav className={linkCol}>
            <Link to="/privacy" className={linkCls}>Privacy Policy</Link>
            <Link to="/terms" className={linkCls}>Terms of Service</Link>
          </nav>
        </div>
      </div>

      <div className="border-t border-border/30 py-6">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-muted-foreground">
            © 2026 LOGICGUESSER. All rights reserved.
          </p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                <Bug className="w-4 h-4" />
                System Report
              </Button>
            </DialogTrigger>
            <DialogContent className="glass border-border/50">
              <DialogHeader>
                <DialogTitle className="font-display text-foreground">System Report</DialogTitle>
                <DialogDescription className="font-body text-muted-foreground">
                  Found a bug or have feedback? Let us know.
                </DialogDescription>
              </DialogHeader>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Describe the issue or share your feedback..."
                className="min-h-[120px] bg-secondary/50 border-border/50 font-body"
              />
              <DialogFooter>
                <Button variant="neon" onClick={handleSubmit} disabled={!feedback.trim()}>
                  Submit Report
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </footer>
  );
}
