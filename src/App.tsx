import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/daily" element={<DailyChallenge />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/chat/:friendId" element={<Chat />} />
            <Route path="/battle/create" element={<BattleCreate />} />
            <Route path="/battle/:battleId" element={<BattleLobby />} />
            <Route path="/lobbies" element={<Lobbies />} />
            <Route path="/pro" element={<ProUpgrade />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
