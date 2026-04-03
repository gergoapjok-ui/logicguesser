import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <footer className="border-t border-border/50 py-8 text-center">
        <p className="font-body text-sm text-muted-foreground">
          © 2026 LOGICGUESSER. Challenge your mind daily.
        </p>
      </footer>
    </div>
  );
};

export default Index;
