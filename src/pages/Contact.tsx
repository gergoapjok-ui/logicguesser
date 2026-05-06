import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Mail, MessageSquare, Bug, Briefcase } from "lucide-react";
import { useEffect } from "react";

export default function Contact() {
  useEffect(() => {
    document.title = "Contact LogicGuesser";
  }, []);

  const items = [
    {
      icon: Mail,
      title: "General Support",
      desc: "Account issues, billing, anything else.",
      email: "support@logicguesser.com",
    },
    {
      icon: MessageSquare,
      title: "Press & Partnerships",
      desc: "Media, collaborations, integrations.",
      email: "hello@logicguesser.com",
    },
    {
      icon: Bug,
      title: "Bug Reports",
      desc: "Found something broken? Let us know.",
      email: "bugs@logicguesser.com",
    },
    {
      icon: Briefcase,
      title: "Legal & Privacy",
      desc: "DMCA, GDPR requests, data deletion.",
      email: "legal@logicguesser.com",
    },
  ];

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <main className="pt-24 pb-16 container mx-auto px-4 max-w-3xl">
        <header className="mb-10">
          <h1 className="font-display text-4xl font-bold text-foreground mb-3">Contact us</h1>
          <p className="font-body text-muted-foreground text-lg">
            We read every message. Most replies go out within two business days.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((it) => (
            <Card key={it.title} className="p-5 glass">
              <it.icon className="w-6 h-6 text-primary mb-2" />
              <div className="font-display font-semibold text-foreground">{it.title}</div>
              <p className="font-body text-sm text-muted-foreground mb-3">{it.desc}</p>
              <a href={`mailto:${it.email}`} className="font-body text-sm text-primary break-all">
                {it.email}
              </a>
            </Card>
          ))}
        </div>

        <section className="mt-10 prose prose-invert max-w-none font-body text-muted-foreground">
          <h2 className="font-display text-2xl text-foreground">Mailing address</h2>
          <p>
            LogicGuesser<br />
            c/o Operator<br />
            Available on request via the addresses above.
          </p>
          <p>
            Prefer the web? Use the <strong>System Report</strong> button in the footer of any
            page to send feedback without leaving the app.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
