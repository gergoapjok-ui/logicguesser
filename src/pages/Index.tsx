import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import AdPlaceholder, { AD_SLOTS } from "@/components/AdPlaceholder";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { profile } = useAuth();
  const isPro = profile?.is_pro ?? false;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      {!isPro && (
        <div className="container mx-auto px-4 max-w-3xl py-4">
          <AdPlaceholder slot={AD_SLOTS.inContent} />
        </div>
      )}
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
