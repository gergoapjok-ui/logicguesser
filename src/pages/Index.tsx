import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ContentSection from "@/components/ContentSection";
import Footer from "@/components/Footer";
import AdPlaceholder, { AD_SLOTS } from "@/components/AdPlaceholder";
import { useAuth } from "@/contexts/AuthContext";
import { usePageMeta } from "@/lib/seo";

const Index = () => {
  const { profile } = useAuth();
  const isPro = profile?.is_pro ?? false;

  usePageMeta({
    title: "LogicGuesser — Daily logic puzzles",
    description: "Play daily logic puzzles, word riddles, math challenges, and original strategy guides in five focused minutes a day.",
    path: "/",
    jsonLd: {
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
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ContentSection />
        {!isPro && (
          <div className="container mx-auto px-4 max-w-3xl py-4">
            <AdPlaceholder slot={AD_SLOTS.inContent} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
