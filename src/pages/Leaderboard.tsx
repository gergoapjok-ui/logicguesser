import Navbar from "@/components/Navbar";

const Leaderboard = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 container mx-auto px-4 text-center">
      <h1 className="font-display text-4xl font-bold text-foreground mb-4">
        LEADER<span className="text-primary text-glow">BOARD</span>
      </h1>
      <p className="font-body text-muted-foreground">Coming soon — compete globally!</p>
    </div>
  </div>
);

export default Leaderboard;
