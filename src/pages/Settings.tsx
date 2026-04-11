import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Bell, Volume2, VolumeX, Swords, Coins, Users, Loader2, Save, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

interface UserSettings {
  notifications_enabled: boolean;
  notify_battle_invites: boolean;
  notify_credits: boolean;
  notify_friend_requests: boolean;
  sound_enabled: boolean;
  email_notifications_enabled: boolean;
}

const defaultSettings: UserSettings = {
  notifications_enabled: true,
  notify_battle_invites: true,
  notify_credits: true,
  notify_friend_requests: true,
  sound_enabled: true,
  email_notifications_enabled: false,
};

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Password change
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }
    fetchSettings();
  }, [user, authLoading]);

  const fetchSettings = async () => {
    const { data } = await supabase.from("user_settings").select("*").eq("user_id", user!.id).maybeSingle();
    if (data) {
      setSettings({
        notifications_enabled: (data as any).notifications_enabled,
        notify_battle_invites: (data as any).notify_battle_invites,
        notify_credits: (data as any).notify_credits,
        notify_friend_requests: (data as any).notify_friend_requests,
        sound_enabled: (data as any).sound_enabled,
        email_notifications_enabled: (data as any).email_notifications_enabled ?? false,
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("user_settings").upsert({
      user_id: user.id,
      ...settings,
      updated_at: new Date().toISOString(),
    } as any, { onConflict: "user_id" });
    setSaving(false);
    if (error) { toast.error("Failed to save settings"); return; }
    toast.success("Settings saved!");
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in both password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setChangingPassword(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const toggle = (key: keyof UserSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (authLoading || loading) {
    return <div className="min-h-screen bg-background"><Navbar /><div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div></div>;
  }

  const settingRows: { key: keyof UserSettings; label: string; description: string; icon: any; disabled?: boolean }[] = [
    { key: "notifications_enabled", label: "Notifications", description: "Enable in-app notifications", icon: Bell },
    { key: "notify_battle_invites", label: "Battle Invites", description: "Get notified when someone invites you to battle", icon: Swords, disabled: !settings.notifications_enabled },
    { key: "notify_credits", label: "Credit Rewards", description: "Get notified when you earn credits", icon: Coins, disabled: !settings.notifications_enabled },
    { key: "notify_friend_requests", label: "Friend Requests", description: "Get notified about new friend requests", icon: Users, disabled: !settings.notifications_enabled },
    { key: "sound_enabled", label: "Sound Effects", description: "Play sounds for game events", icon: settings.sound_enabled ? Volume2 : VolumeX },
    { key: "email_notifications_enabled", label: "Email Notifications", description: "Receive email alerts for important events", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4 max-w-xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <SettingsIcon className="w-10 h-10 text-primary mx-auto mb-3" />
            <h1 className="font-display text-3xl font-bold text-foreground">
              <span className="text-primary text-glow">SETTINGS</span>
            </h1>
          </div>

          {/* Notification Settings */}
          <div className="glass rounded-2xl border border-border/50 p-6 space-y-1">
            {settingRows.map(({ key, label, description, icon: Icon, disabled }) => (
              <div key={key} className={`flex items-center justify-between py-4 ${disabled ? "opacity-50" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold text-foreground">{label}</p>
                    <p className="font-body text-xs text-muted-foreground">{description}</p>
                  </div>
                </div>
                <Switch checked={settings[key]} onCheckedChange={() => toggle(key)} disabled={disabled} />
              </div>
            ))}
          </div>

          <Button variant="neon" size="xl" className="w-full mt-6" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Settings</>}
          </Button>

          {/* Change Password Section */}
          <div className="glass rounded-2xl border border-border/50 p-6 mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center">
                <Lock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-display text-sm font-bold text-foreground">Change Password</p>
                <p className="font-body text-xs text-muted-foreground">Update your account password</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password (min 6 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 pr-10 bg-secondary/50 border-border/50 font-body"
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border/50 font-body"
                  minLength={6}
                />
              </div>
              <Button
                variant="neon-outline"
                size="lg"
                className="w-full"
                onClick={handleChangePassword}
                disabled={changingPassword || !newPassword || !confirmPassword}
              >
                {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                {changingPassword ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </div>

          {/* Account Info */}
          <div className="glass rounded-2xl border border-border/50 p-6 mt-8">
            <p className="font-body text-xs text-muted-foreground">
              Logged in as: <span className="text-foreground font-semibold">{user?.email}</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
