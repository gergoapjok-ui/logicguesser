import { useState } from "react";
import { Bug } from "lucide-react";
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

  return (
    <footer className="border-t border-border/50 py-8">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-body text-sm text-muted-foreground">
          © 2026 LOGICGUESSER. Challenge your mind daily.
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
    </footer>
  );
}
