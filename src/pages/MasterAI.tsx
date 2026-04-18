import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import MasterAIChat from "@/components/MasterAIChat";
import { useLanguage } from "@/contexts/LanguageContext";

export default function MasterAI() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <div className="pt-24 pb-10 container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-6">
            <Sparkles className="w-10 h-10 text-primary mx-auto mb-3 text-glow" />
            <h1 className="font-display text-3xl font-bold text-foreground">
              <span className="text-primary text-glow">{t("ai.title")}</span>
            </h1>
            <p className="font-body text-sm text-muted-foreground mt-2 max-w-md mx-auto">{t("ai.subtitle")}</p>
          </div>
          <MasterAIChat />
        </motion.div>
      </div>
    </div>
  );
}
