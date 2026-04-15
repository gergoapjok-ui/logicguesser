import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Bell, Volume2, VolumeX, Swords, Coins, Users, Loader2, Save, Mail, Lock, Eye, EyeOff, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { useLanguage, LANGUAGE_LABELS, LANGUAGE_FLAGS, Language } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

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
  const { t, language, setLanguage } = useLanguage();
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
    toast.success(t("general.success"));
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
    { key: "notifications_enabled", label: t("settings.notifications"), description: t("settings.notificationsDesc"), icon: Bell },
    { key: "notify_battle_invites", label: t("settings.battleInvites"), description: t("settings.battleInvitesDesc"), icon: Swords, disabled: !settings.notifications_enabled },
    { key: "notify_credits", label: t("settings.creditRewards"), description: t("settings.creditRewardsDesc"), icon: Coins, disabled: !settings.notifications_enabled },
    { key: "notify_friend_requests", label: t("settings.friendRequests"), description: t("settings.friendRequestsDesc"), icon: Users, disabled: !settings.notifications_enabled },
    { key: "sound_enabled", label: t("settings.sound"), description: t("settings.soundDesc"), icon: settings.sound_enabled ? Volume2 : VolumeX },
    { key: "email_notifications_enabled", label: t("settings.email"), description: t("settings.emailDesc"), icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4 max-w-xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <SettingsIcon className="w-10 h-10 text-primary mx-auto mb-3" />
            <h1 className="font-display text-3xl font-bold text-foreground">
              <span className="text-primary text-glow">{t("settings.title")}</span>
            </h1>
          </div>

          {/* Language Selector */}
          <div className="glass rounded-2xl border border-border/50 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center">
                <Languages className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-display text-sm font-bold text-foreground">{t("settings.language")}</p>
                <p className="font-body text-xs text-muted-foreground">{t("settings.languageDesc")}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-body transition-all",
                    language === lang
                      ? "bg-primary/20 border-primary/50 text-primary font-bold shadow-sm"
                      : "bg-secondary/30 border-border/50 text-foreground hover:bg-primary/10 hover:border-primary/30"
                  )}
                >
                  <span className="text-lg">{LANGUAGE_FLAGS[lang]}</span>
                  <span>{LANGUAGE_LABELS[lang]}</span>
                </button>
              ))}
            </div>
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
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> {t("settings.save")}</>}
          </Button>

          {/* Change Password Section */}
          <div className="glass rounded-2xl border border-border/50 p-6 mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center">
                <Lock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-display text-sm font-bold text-foreground">{t("settings.changePassword")}</p>
                <p className="font-body text-xs text-muted-foreground">{t("settings.changePasswordDesc")}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={t("settings.newPassword")}
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
                  placeholder={t("settings.confirmPassword")}
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
                {changingPassword ? t("settings.updating") : t("settings.updatePassword")}
              </Button>
            </div>
          </div>

          {/* Account Info */}
          <div className="glass rounded-2xl border border-border/50 p-6 mt-8">
            <p className="font-body text-xs text-muted-foreground">
              {t("settings.loggedInAs")} <span className="text-foreground font-semibold">{user?.email}</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
