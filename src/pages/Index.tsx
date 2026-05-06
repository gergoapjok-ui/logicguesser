import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ContentSection from "@/components/ContentSection";
import Footer from "@/components/Footer";
import AdPlaceholder, { AD_SLOTS } from "@/components/AdPlaceholder";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Index = () => {
  const { profile } = useAuth();
  const isPro = profile?.is_pro ?? false;

  useEffect(() => {
    document.title = "LogicGuesser — Daily logic puzzles, brain games, and tech pulse";
    // JSON-LD WebSite + Organization for SEO
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          name: "LogicGuesser",
          url: "https://logicguesser.com",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://logicguesser.com/practice?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        },
        {
          "@type": "Organization",
          name: "LogicGuesser",
          url: "https://logicguesser.com",
          sameAs: [],
        },
      ],
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <ContentSection />
      {!isPro && (
        <div className="container mx-auto px-4 max-w-3xl py-4">
          <AdPlaceholder slot={AD_SLOTS.inContent} />
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Index;
