import Navbar from "@/components/Navbar";

const Practice = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 container mx-auto px-4 text-center">
      <h1 className="font-display text-4xl font-bold text-foreground mb-4">
        PRACTICE <span className="text-primary text-glow">MODE</span>
      </h1>
      <p className="font-body text-muted-foreground">Sharpen your skills — coming soon!</p>
    </div>
  </div>
);

export default Practice;
