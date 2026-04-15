import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, UserPlus, CheckCircle, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";

const BANNED_WORDS = [
  "nigger","nigga","faggot","retard","cunt","fuck","shit","bitch","cock","dick",
  "pussy","asshole","bastard","whore","slut","wanker","twat","prick","bollocks",
  "motherfucker","negro","chink","spic","kike","gook","tranny","dyke",
];

function containsBannedWord(name: string): boolean {
  const lower = name.toLowerCase().replace(/[^a-z]/g, "");
  return BANNED_WORDS.some(w => lower.includes(w));
}

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (containsBannedWord(username)) {
      toast.error(t("signup.badUsername"));
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { username }, emailRedirectTo: "https://logicguesser.com" },
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else setSignupSuccess(true);
  };

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-16 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="glass rounded-2xl border border-border/50 p-8">
            <AnimatePresence mode="wait">
            {signupSuccess ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto mb-6 box-glow">
                  <Inbox className="w-10 h-10 text-primary" />
                </div>
                <h2 className="font-display text-3xl font-bold text-foreground mb-3">
                  {t("signup.checkInbox")} <span className="text-primary text-glow">{t("signup.checkInbox2")}</span>
                </h2>
                <p className="font-body text-lg text-muted-foreground mb-2">{t("signup.verifyMsg")}</p>
                <p className="font-display text-lg font-bold text-primary mb-6">{email}</p>
                <p className="font-body text-sm text-muted-foreground mb-6">{t("signup.verifyAction")}</p>
                <Link to="/login">
                  <Button variant="neon" size="lg" className="w-full">
                    <CheckCircle className="w-5 h-5" /> {t("signup.goLogin")}
                  </Button>
                </Link>
              </motion.div>
            ) : (
            <>
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                {t("signup.title")} <span className="text-primary text-glow">{t("signup.title2")}</span>
              </h1>
              <p className="font-body text-muted-foreground text-sm">{t("signup.subtitle")}</p>
            </div>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="text" placeholder={t("signup.username")} value={username} onChange={(e) => setUsername(e.target.value)} className="pl-10 bg-secondary/50 border-border/50 font-body" required />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" placeholder={t("signup.email")} value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 bg-secondary/50 border-border/50 font-body" required />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="password" placeholder={t("signup.password")} value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 bg-secondary/50 border-border/50 font-body" minLength={6} required />
              </div>
              <Button type="submit" variant="neon" size="lg" className="w-full" disabled={loading}>
                <UserPlus className="w-4 h-4" />
                {loading ? t("signup.creating") : t("signup.createAccount")}
              </Button>
            </form>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/50" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-background px-2 text-muted-foreground font-body">{t("signup.or")}</span></div>
            </div>
            <Button variant="outline" size="lg" className="w-full font-body" onClick={() => navigate("/coming-soon")}>
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              {t("signup.google")}
            </Button>
            <Button variant="outline" size="lg" className="w-full font-body mt-2" onClick={() => navigate("/coming-soon")}>
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              {t("signup.apple")}
            </Button>
            <p className="text-center mt-6 font-body text-sm text-muted-foreground">
              {t("signup.haveAccount")}{" "}
              <Link to="/login" className="text-primary hover:underline">{t("signup.signIn")}</Link>
            </p>
            </>
            )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
