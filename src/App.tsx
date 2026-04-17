import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
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
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
          <LanguageProvider>
          <BattleInvitePopup />
          <AnimatedRoutes />

          <SpeedInsights />
          <Analytics />
          </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
