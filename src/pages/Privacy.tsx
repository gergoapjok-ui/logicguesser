import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePageMeta } from "@/lib/seo";

export default function Privacy() {
  usePageMeta({
    title: "Privacy Policy — LogicGuesser",
    description: "How LogicGuesser collects, uses, protects, and shares data, including cookies, analytics, advertising, and privacy rights.",
    path: "/privacy",
  });

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <main className="pt-24 pb-16 container mx-auto px-4 max-w-3xl">
        <h1 className="font-display text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="font-body text-sm text-muted-foreground mb-8">Last updated: May 6, 2026</p>

        <article className="prose prose-invert max-w-none font-body text-muted-foreground space-y-5">
          <p>
            This Privacy Policy explains how LogicGuesser ("we", "us", "our") collects,
            uses, and protects your information when you use our website, mobile web
            app, and related services (collectively the "Service"). By using the
            Service you agree to this policy.
          </p>

          <h2 className="font-display text-2xl text-foreground">1. Information We Collect</h2>
          <p>
            <strong>Account information.</strong> When you create an account we collect
            your email address, a hashed password, your chosen display name, and any
            optional profile information you add (avatar, bio, language preference).
          </p>
          <p>
            <strong>Guest data.</strong> If you play as a guest, we store only your
            chosen display name, a guest claim code, and your gameplay statistics. No
            email is required until you choose to claim your guest account.
          </p>
          <p>
            <strong>Gameplay data.</strong> We store puzzle answers, scores, streaks,
            credits, XP, achievements, leaderboard standings, and battle history.
          </p>
          <p>
            <strong>Technical data.</strong> We collect IP address, device type,
            browser, operating system, language, referring URL, and pages visited via
            standard web logs and cookies.
          </p>
          <p>
            <strong>Payment data.</strong> Pro subscriptions are processed by Stripe.
            We never see or store your full card number — only the last four digits
            and the subscription metadata Stripe returns to us.
          </p>

          <h2 className="font-display text-2xl text-foreground">2. How We Use Information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Operate, maintain, and improve the Service.</li>
            <li>Authenticate you and protect your account.</li>
            <li>Personalise puzzles, leaderboards, and recommendations.</li>
            <li>Send transactional emails (account confirmation, receipts, password resets).</li>
            <li>Send optional product updates if you opted in.</li>
            <li>Detect, prevent, and respond to fraud and abuse.</li>
            <li>Comply with legal obligations.</li>
          </ul>

          <h2 className="font-display text-2xl text-foreground">3. Cookies & Advertising</h2>
          <p>
            We use first-party cookies for authentication, theme preference, language,
            and basic analytics. Free accounts may see advertising and push
            notifications served by <strong>Monetag</strong> and its advertising
            partners. These partners may set cookies or device identifiers to
            measure and personalise the ads shown to you. Pro subscribers see no
            ads at all.
          </p>
          <p>
            You can manage or revoke push notification permissions at any time in
            your browser settings. Learn more about Monetag's advertising and
            privacy practices at{" "}
            <a href="https://monetag.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-primary">monetag.com/privacy-policy</a>.
          </p>

            <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-primary"> aboutads.info</a>
            for further opt-out controls.
          </p>

          <h2 className="font-display text-2xl text-foreground">4. Data Sharing</h2>
          <p>
            We do not sell personal information. We share limited data only with:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Service providers (hosting, email delivery, payments, analytics) under contract.</li>
            <li>Advertising partners as described in section 3.</li>
            <li>Law enforcement, where required by valid legal process.</li>
            <li>Acquirers in the event of a merger or sale, with notice.</li>
          </ul>

          <h2 className="font-display text-2xl text-foreground">5. Your Rights</h2>
          <p>
            Depending on your location, you may have rights under GDPR, UK GDPR, CCPA,
            and other privacy laws — including the right to access, correct, delete,
            export, or restrict the processing of your personal information, and to
            object to direct marketing. Email us at
            <a href="mailto:privacy@logicguesser.com" className="text-primary"> privacy@logicguesser.com</a>
            to exercise any of these rights. You may also delete your account at any
            time from the Settings page.
          </p>

          <h2 className="font-display text-2xl text-foreground">6. Children</h2>
          <p>
            LogicGuesser is not directed at children under 13 (or under 16 in the EEA
            and UK). We do not knowingly collect personal data from children. If you
            believe a child has provided us with information, contact us and we will
            delete it.
          </p>

          <h2 className="font-display text-2xl text-foreground">7. Security</h2>
          <p>
            We use TLS in transit, encryption at rest, hashed passwords, row-level
            security on our database, and least-privilege access controls. No system
            is perfectly secure, but we work hard to protect your data.
          </p>

          <h2 className="font-display text-2xl text-foreground">8. International Transfers</h2>
          <p>
            Our infrastructure is hosted in the EU and the US. By using the Service
            you consent to the transfer of your information to these jurisdictions.
          </p>

          <h2 className="font-display text-2xl text-foreground">9. Changes</h2>
          <p>
            We may update this policy from time to time. Material changes will be
            announced via in-app notice or email at least 14 days before they take
            effect.
          </p>

          <h2 className="font-display text-2xl text-foreground">10. Contact</h2>
          <p>
            Questions? Email
            <a href="mailto:privacy@logicguesser.com" className="text-primary"> privacy@logicguesser.com</a>
            or use our <a href="/contact" className="text-primary">contact page</a>.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
