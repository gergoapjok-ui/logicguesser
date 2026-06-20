import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { GuestProvider } from "@/contexts/GuestContext";
import UpgradeProCTA from "@/components/UpgradeProCTA";
import { UIPrefsProvider } from "@/contexts/UIPrefsContext";
import Index from "./pages/Index";
import DailyChallenge from "./pages/DailyChallenge";
import Leaderboard from "./pages/Leaderboard";
import Practice from "./pages/Practice";
import Shop from "./pages/Shop";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Friends from "./pages/Friends";
import Chat from "./pages/Chat";
import BattleCreate from "./pages/BattleCreate";
import BattleLobby from "./pages/BattleLobby";
import Lobbies from "./pages/Lobbies";
import ProUpgrade from "./pages/ProUpgrade";
import SettingsPage from "./pages/Settings";
import BattleInvitePopup from "./components/BattleInvitePopup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SubmitPuzzle from "./pages/SubmitPuzzle";
import CommunityPuzzles from "./pages/CommunityPuzzles";
import AdminPuzzles from "./pages/AdminPuzzles";
import ComingSoon from "./pages/ComingSoon";
import TryMore from "./pages/TryMore";
import MasterAI from "./pages/MasterAI";
import FloatingMasterAI from "./components/FloatingMasterAI";
import Unsubscribe from "./pages/Unsubscribe";
import ClaimGuest from "./pages/ClaimGuest";
import TechNews from "./pages/TechNews";
import Hub from "./pages/Hub";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import Faq from "./pages/Faq";
import Guides from "./pages/Guides";
import GuideArticle from "./pages/GuideArticle";
import EditorialStandards from "./pages/EditorialStandards";
import PuzzleArchive from "./pages/PuzzleArchive";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { useEffect } from "react";

const queryClient = new QueryClient();

const NOINDEX_PREFIXES = [
  "/admin",
  "/hub",
  "/shop",
  "/profile",
  "/friends",
  "/chat",
  "/settings",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/unsubscribe",
  "/claim",
  "/coming-soon",
  "/try-more",
  "/battle",
  "/lobbies",
];

function RouteRobots() {
  const { pathname } = useLocation();

  useEffect(() => {
    const shouldNoindex = NOINDEX_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
    let meta = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", shouldNoindex ? "noindex,follow" : "index,follow,max-image-preview:large");
  }, [pathname]);

  return null;
}

const AnimatedRoutes = () => {
  const location = useLocation();
  const fade = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  };
  const wrap = (el: JSX.Element) => <motion.div {...fade}>{el}</motion.div>;
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={wrap(<Index />)} />
        <Route path="/hub" element={wrap(<Hub />)} />
        <Route path="/daily" element={wrap(<DailyChallenge />)} />
        <Route path="/leaderboard" element={wrap(<Leaderboard />)} />
        <Route path="/practice" element={wrap(<Practice />)} />
        <Route path="/shop" element={wrap(<Shop />)} />
        <Route path="/profile" element={wrap(<Profile />)} />
        <Route path="/friends" element={wrap(<Friends />)} />
        <Route path="/chat/:friendId" element={wrap(<Chat />)} />
        <Route path="/battle/create" element={wrap(<BattleCreate />)} />
        <Route path="/battle/:battleId" element={wrap(<BattleLobby />)} />
        <Route path="/lobbies" element={wrap(<Lobbies />)} />
        <Route path="/pro" element={wrap(<ProUpgrade />)} />
        <Route path="/settings" element={wrap(<SettingsPage />)} />
        <Route path="/login" element={wrap(<Login />)} />
        <Route path="/signup" element={wrap(<Signup />)} />
        <Route path="/forgot-password" element={wrap(<ForgotPassword />)} />
        <Route path="/reset-password" element={wrap(<ResetPassword />)} />
        <Route path="/submit-puzzle" element={wrap(<SubmitPuzzle />)} />
        <Route path="/community" element={wrap(<CommunityPuzzles />)} />
        <Route path="/admin/puzzles" element={wrap(<AdminPuzzles />)} />
        <Route path="/coming-soon" element={wrap(<ComingSoon />)} />
        <Route path="/try-more" element={wrap(<TryMore />)} />
        <Route path="/ai" element={wrap(<MasterAI />)} />
        <Route path="/unsubscribe" element={wrap(<Unsubscribe />)} />
        <Route path="/claim" element={wrap(<ClaimGuest />)} />
        <Route path="/news" element={wrap(<TechNews />)} />
        <Route path="/about" element={wrap(<About />)} />
        <Route path="/privacy" element={wrap(<Privacy />)} />
        <Route path="/terms" element={wrap(<Terms />)} />
        <Route path="/contact" element={wrap(<Contact />)} />
        <Route path="/faq" element={wrap(<Faq />)} />
        <Route path="/editorial-standards" element={wrap(<EditorialStandards />)} />
        <Route path="/puzzle-archive" element={wrap(<PuzzleArchive />)} />
        <Route path="/guides" element={wrap(<Guides />)} />
        <Route path="/guides/:slug" element={wrap(<GuideArticle />)} />
        <Route path="*" element={wrap(<NotFound />)} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
          <LanguageProvider>
          <GuestProvider>
          <UIPrefsProvider>
          <BattleInvitePopup />
          <RouteRobots />
          <AnimatedRoutes />
          <FloatingMasterAI />
          <UpgradeProCTA variant="floating" />

          <SpeedInsights />
          <Analytics />
          </UIPrefsProvider>
          </GuestProvider>
          </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
