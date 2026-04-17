import { useEffect } from "react";
import { useMedia } from "../hooks/useMedia";
import { useSEO } from "../hooks/useSEO";
import Breadcrumb, { breadcrumbSchema } from "../components/Breadcrumb";
import HeroBand from "../components/HeroBand";

export default function PrivacyPage() {
  const { mob } = useMedia();

  useSEO({
    title: "Privacy Policy | RatedBrokers",
    description: "RatedBrokers privacy policy — how we collect, use, and protect your data.",
    path: "/privacy",
  });

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const cn = { maxWidth: 800, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const h2 = { fontFamily: "Outfit", fontSize: mob ? 20 : 24, fontWeight: 800, color: "#0f172a", marginTop: 32, marginBottom: 12 };
  const p = { fontSize: 15, color: "#374151", lineHeight: 1.8, marginBottom: 14 };

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb" }}>
      <div style={{ ...cn, padding: mob ? "10px 16px" : "14px 24px" }}>
        <Breadcrumb items={[{ label: "RatedBrokers", path: "/" }, { label: "Privacy Policy" }]} />
      </div>

      <HeroBand mob={mob}>
        <h1 style={{ fontFamily: "Outfit", fontSize: mob ? 24 : 32, fontWeight: 800, color: "#fff", textAlign: "center" }}>Privacy Policy</h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", textAlign: "center", marginTop: 8 }}>Last updated: April 2026</p>
      </HeroBand>

      <div style={{ ...cn, padding: mob ? "24px 16px" : "40px 24px" }}>
        <p style={p}><em>Draft — pending legal review. This document outlines our data practices in good faith. Professional legal counsel should be consulted before relying on this text.</em></p>

        <h2 style={h2}>1. Who We Are</h2>
        <p style={p}>RatedBrokers.com ("we", "us", "our") is an independent online broker comparison platform. Our website is hosted on Cloudflare Pages, and our backend API runs on Cloudflare Workers.</p>

        <h2 style={h2}>2. What Data We Collect</h2>
        <p style={p}><strong>Contact form submissions:</strong> When you use our contact form, we collect your name, email address, and message. This data is stored in our Cloudflare D1 database.</p>
        <p style={p}><strong>Click tracking:</strong> When you click an affiliate link ("Visit Broker" buttons), we record the broker slug, referring page, country (via Cloudflare headers), and user agent. No personally identifiable information is stored in click logs.</p>
        <p style={p}><strong>Cloudflare analytics:</strong> We use Cloudflare's built-in analytics which collect anonymized page view data. We do not use Google Analytics or any third-party tracking scripts.</p>
        <p style={p}><strong>Turnstile CAPTCHA:</strong> Our contact form uses Cloudflare Turnstile to prevent spam. Turnstile may process browser signals to verify you are human. See Cloudflare's privacy policy for details.</p>

        <h2 style={h2}>3. How We Use Your Data</h2>
        <p style={p}>Contact form data is used solely to respond to your inquiries. Click tracking data is used to analyze which brokers are most popular and to report clicks to our affiliate partners. We do not sell, rent, or share your personal data with third parties except as required by law.</p>

        <h2 style={h2}>4. Cookies</h2>
        <p style={p}>RatedBrokers.com does not set first-party cookies for tracking purposes. Cloudflare may set essential cookies for security and performance (e.g., __cf_bm for bot management). These are strictly necessary and do not track you across sites.</p>

        <h2 style={h2}>5. Third-Party Links</h2>
        <p style={p}>Our site contains affiliate links to broker websites. When you click these links, you leave our site and are subject to the broker's own privacy policy. We are not responsible for the privacy practices of external sites.</p>

        <h2 style={h2}>6. Data Retention</h2>
        <p style={p}>Contact form submissions are retained for 12 months, then deleted. Click tracking data is retained for 24 months for analytics purposes. You may request deletion of your data by contacting us.</p>

        <h2 style={h2}>7. Your Rights (GDPR)</h2>
        <p style={p}>If you are located in the European Economic Area, you have the right to access, correct, or delete your personal data. You may also object to processing or request data portability. To exercise these rights, please contact us at the email address on our contact page.</p>

        <h2 style={h2}>8. Children</h2>
        <p style={p}>Our services are not directed to individuals under 18. We do not knowingly collect data from minors. If you believe we have inadvertently collected such data, please contact us for removal.</p>

        <h2 style={h2}>9. Changes to This Policy</h2>
        <p style={p}>We may update this policy from time to time. Changes will be posted on this page with an updated "Last updated" date. Continued use of the site after changes constitutes acceptance.</p>

        <h2 style={h2}>10. Contact</h2>
        <p style={p}>For privacy-related inquiries, please use our <a href="/contact" className="rb-link-inline">contact form</a>.</p>
      </div>
    </div>
  );
}
