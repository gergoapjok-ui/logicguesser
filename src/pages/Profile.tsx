import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";

interface Profile {
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
}

export default function Profile() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("username, avatar_url, bio")
        .eq("user_id", user.id)
        .single();
      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass rounded-2xl border border-border/50 p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto mb-6 box-glow">
              <User className="w-10 h-10 text-primary" />
            </div>

            <h1 className="font-display text-2xl font-bold text-foreground mb-1">
              {profile?.username || "Anonymous"}
            </h1>
            <p className="font-body text-sm text-muted-foreground mb-2">
              {user?.email}
            </p>
            {profile?.bio && (
              <p className="font-body text-sm text-muted-foreground mb-6">
                {profile.bio}
              </p>
            )}

            <div className="grid grid-cols-3 gap-4 my-8">
              {[
                { label: "Streak", value: "0" },
                { label: "Solved", value: "0" },
                { label: "Rank", value: "—" },
              ].map((stat) => (
                <div key={stat.label} className="bg-secondary/50 rounded-lg p-3">
                  <div className="font-display text-xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="font-body text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="neon-outline"
              size="lg"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
