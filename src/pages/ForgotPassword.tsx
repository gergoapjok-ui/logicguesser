import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
      toast.success("Check your email for a reset link!");
    }
  };

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass rounded-2xl border border-border/50 p-8">
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                FORGOT <span className="text-primary text-glow">PASSWORD</span>
              </h1>
              <p className="font-body text-muted-foreground text-sm">
                Enter your email and we'll send you a reset link.
              </p>
            </div>

            {sent ? (
              <div className="text-center space-y-4">
                <div className="bg-primary/10 rounded-xl p-6 border border-primary/20">
                  <Mail className="w-10 h-10 text-primary mx-auto mb-3" />
                  <p className="font-body text-foreground font-semibold mb-1">Email sent!</p>
                  <p className="font-body text-muted-foreground text-sm">
                    Check your inbox for a password reset link. It may take a minute to arrive.
                  </p>
                </div>
                <Link to="/login" className="inline-flex items-center gap-1 text-primary hover:underline font-body text-sm">
                  <ArrowLeft className="w-3 h-3" /> Back to login
                </Link>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-secondary/50 border-border/50 font-body"
                      required
                    />
                  </div>
                  <Button type="submit" variant="neon" size="lg" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
                <p className="text-center mt-6 font-body text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <Link to="/login" className="text-primary hover:underline">Log in</Link>
                </p>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
