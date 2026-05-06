import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";

export default function Terms() {
  useEffect(() => {
    document.title = "Terms of Service — LogicGuesser";
  }, []);

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navbar />
      <main className="pt-24 pb-16 container mx-auto px-4 max-w-3xl">
        <h1 className="font-display text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
        <p className="font-body text-sm text-muted-foreground mb-8">Last updated: May 6, 2026</p>

        <article className="prose prose-invert max-w-none font-body text-muted-foreground space-y-5">
          <p>
            These Terms of Service ("Terms") govern your access to and use of
            LogicGuesser. By creating an account or using the Service, you agree to
            these Terms. If you do not agree, do not use the Service.
          </p>

          <h2 className="font-display text-2xl text-foreground">1. Eligibility</h2>
          <p>
            You must be at least 13 years old (16 in the EEA/UK) to use LogicGuesser.
            By using the Service you represent that you meet this requirement and
            have the legal capacity to enter into these Terms.
          </p>

          <h2 className="font-display text-2xl text-foreground">2. Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your password
            and for all activities under your account. Notify us immediately of any
            unauthorised use. Display names must follow our community standards: no
            slurs, no impersonation, no obscenity, no advertising spam.
          </p>

          <h2 className="font-display text-2xl text-foreground">3. Acceptable Use</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>No cheating, automation, scripting, or scraping of puzzles or answers.</li>
            <li>No reverse engineering, security probing, or denial-of-service activity.</li>
            <li>No harassment, hate speech, or sexually explicit content in chat or community puzzles.</li>
            <li>No commercial use without written permission.</li>
          </ul>
          <p>We may suspend or terminate accounts that violate these rules.</p>

          <h2 className="font-display text-2xl text-foreground">4. User Content</h2>
          <p>
            When you submit a puzzle, comment, or message ("User Content") you grant
            LogicGuesser a worldwide, non-exclusive, royalty-free licence to host,
            display, reproduce, and distribute that content as needed to operate and
            promote the Service. You retain ownership of your User Content.
          </p>

          <h2 className="font-display text-2xl text-foreground">5. Pro Subscriptions</h2>
          <p>
            Pro subscriptions are billed monthly via Stripe at the price displayed at
            checkout (currently $2.49 / month). Subscriptions auto-renew until
            cancelled. You may cancel any time from the customer portal; access
            continues until the end of the current billing period. Refunds are at our
            discretion and generally limited to billing errors.
          </p>

          <h2 className="font-display text-2xl text-foreground">6. Virtual Items & Credits</h2>
          <p>
            Credits, XP, avatars, and other in-app items have no cash value, are
            non-transferable, and cannot be redeemed for real money. We may adjust
            balances to correct errors or sanction policy violations.
          </p>

          <h2 className="font-display text-2xl text-foreground">7. Intellectual Property</h2>
          <p>
            The Service, including its design, code, trademarks, and original puzzles,
            is owned by LogicGuesser or its licensors. Except for User Content, all
            rights are reserved.
          </p>

          <h2 className="font-display text-2xl text-foreground">8. Disclaimers</h2>
          <p>
            The Service is provided "as is" and "as available". We make no warranty
            that the Service will be uninterrupted, error-free, or fit for any
            particular purpose. Puzzles and tech-news content are produced for
            education and entertainment, not as professional advice.
          </p>

          <h2 className="font-display text-2xl text-foreground">9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, LogicGuesser will not be liable
            for any indirect, incidental, special, consequential, or punitive damages,
            or any loss of data, profits, or revenue, arising from your use of the
            Service. Our total aggregate liability will not exceed the greater of
            (a) the amounts you paid us in the 12 months before the claim, or (b) USD
            50.
          </p>

          <h2 className="font-display text-2xl text-foreground">10. Termination</h2>
          <p>
            You may delete your account at any time. We may suspend or terminate your
            access for breach of these Terms, suspected fraud, or as required by law.
          </p>

          <h2 className="font-display text-2xl text-foreground">11. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the European Union and, where
            applicable, the country in which the operator is established. Disputes
            will be resolved in the competent courts of that jurisdiction.
          </p>

          <h2 className="font-display text-2xl text-foreground">12. Changes</h2>
          <p>
            We may modify these Terms. Material changes will be announced at least
            14 days before they take effect. Continued use after the effective date
            constitutes acceptance.
          </p>

          <h2 className="font-display text-2xl text-foreground">13. Contact</h2>
          <p>
            Questions about these Terms? Email
            <a href="mailto:legal@logicguesser.com" className="text-primary"> legal@logicguesser.com</a>.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
