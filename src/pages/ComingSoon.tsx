import { motion } from "framer-motion";
import { Construction, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <div className="glass rounded-2xl border border-border/50 p-8">
            <Construction className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              COMING <span className="text-primary text-glow">SOON</span>
            </h1>
            <p className="font-body text-muted-foreground text-sm mb-6">
              Sign in with Google and Apple is coming soon! For now, please use email & password to create your account.
            </p>
            <Button variant="neon" size="lg" className="w-full" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4" />
              Return to Home
            </Button>
            <div className="mt-4">
              <Button variant="neon-outline" size="lg" className="w-full" onClick={() => navigate("/signup")}>
                Sign up with Email
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
