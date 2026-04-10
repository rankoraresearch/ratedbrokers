import { useEffect } from "react";
import { useMedia } from "../hooks/useMedia";
import { useSEO } from "../hooks/useSEO";
import Breadcrumb from "../components/Breadcrumb";
import HeroBand from "../components/HeroBand";

export default function TermsPage() {
  const { mob } = useMedia();

  useSEO({
    title: "Terms of Service | RatedBrokers",
    description: "RatedBrokers terms of service — usage terms, disclaimers, and affiliate disclosure.",
    path: "/terms",
  });

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const cn = { maxWidth: 800, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const h2 = { fontFamily: "Outfit", fontSize: mob ? 20 : 24, fontWeight: 800, color: "#0f172a", marginTop: 32, marginBottom: 12 };
  const p = { fontSize: 15, color: "#374151", lineHeight: 1.8, marginBottom: 14 };

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb" }}>
      <div style={{ ...cn, padding: mob ? "10px 16px" : "14px 24px" }}>
        <Breadcrumb items={[{ label: "RatedBrokers", path: "/" }, { label: "Terms of Service" }]} />
      </div>

      <HeroBand mob={mob}>
        <h1 style={{ fontFamily: "Outfit", fontSize: mob ? 24 : 32, fontWeight: 800, color: "#fff", textAlign: "center" }}>Terms of Service</h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", textAlign: "center", marginTop: 8 }}>Last updated: April 2026</p>
      </HeroBand>

      <div style={{ ...cn, padding: mob ? "24px 16px" : "40px 24px" }}>
        <p style={p}><em>Draft — pending legal review. This document is provided in good faith. Professional legal counsel should be consulted before relying on this text.</em></p>

        <h2 style={h2}>1. Acceptance of Terms</h2>
        <p style={p}>By accessing and using RatedBrokers.com ("the Site"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Site.</p>

        <h2 style={h2}>2. No Investment Advice</h2>
        <p style={p}><strong>The content on this Site is for informational purposes only and does not constitute investment advice, financial advice, trading advice, or any other sort of advice.</strong> You should not treat any of the Site's content as such. RatedBrokers does not recommend that any financial instrument should be bought, sold, or held by you. Nothing on this Site should be taken as an offer or solicitation to buy or sell any financial product.</p>
        <p style={p}>Trading forex, CFDs, options, futures, and other derivatives involves substantial risk of loss and is not suitable for every investor. You should carefully consider whether trading is suitable for you in light of your circumstances, knowledge, and financial resources.</p>

        <h2 style={h2}>3. Affiliate Relationship Disclosure</h2>
        <p style={p}>RatedBrokers earns revenue through affiliate partnerships with the brokers listed on this Site. When you click a "Visit Broker" link and subsequently open an account, we may receive a commission from the broker. This compensation does not influence our scores, rankings, or editorial content. Our scoring methodology is publicly available on our methodology page.</p>
        <p style={p}>All affiliate links are clearly marked with <code>rel="nofollow sponsored"</code> attributes and route through our tracking system (/go/ URLs) for transparency.</p>

        <h2 style={h2}>4. Accuracy of Information</h2>
        <p style={p}>We strive to keep all broker data accurate and up to date. However, broker fees, features, regulations, and conditions change frequently. We cannot guarantee that all information on the Site is current at any given time. Always verify details directly with the broker before making decisions.</p>

        <h2 style={h2}>5. Risk Warning</h2>
        <p style={p}>CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. Between 62% and 82% of retail investor accounts lose money when trading CFDs. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.</p>

        <h2 style={h2}>6. Intellectual Property</h2>
        <p style={p}>All content on the Site — including text, graphics, logos, images, scores, and rankings — is the property of RatedBrokers or its content suppliers and is protected by copyright and trademark laws. You may not reproduce, distribute, or create derivative works without our written permission.</p>

        <h2 style={h2}>7. Limitation of Liability</h2>
        <p style={p}>To the fullest extent permitted by law, RatedBrokers shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of the Site, reliance on any information provided, or any trading decisions you make.</p>

        <h2 style={h2}>8. User Conduct</h2>
        <p style={p}>You agree not to use the Site for any unlawful purpose, to attempt to gain unauthorized access to our systems, or to interfere with the proper functioning of the Site.</p>

        <h2 style={h2}>9. External Links</h2>
        <p style={p}>The Site contains links to third-party websites. We are not responsible for the content, accuracy, or practices of external sites. Inclusion of a link does not imply endorsement beyond our published review.</p>

        <h2 style={h2}>10. Changes to Terms</h2>
        <p style={p}>We reserve the right to modify these Terms at any time. Changes take effect upon posting. Your continued use of the Site after changes constitutes acceptance of the new Terms.</p>

        <h2 style={h2}>11. Governing Law</h2>
        <p style={p}>These Terms shall be governed by and construed in accordance with the laws of England and Wales, without regard to its conflict of law provisions.</p>

        <h2 style={h2}>12. Contact</h2>
        <p style={p}>For questions about these Terms, please use our <a href="/contact" style={{ color: "#059669", fontWeight: 600, textDecoration: "none" }}>contact form</a>.</p>
      </div>
    </div>
  );
}
