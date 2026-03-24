import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../i18n/LanguageContext";
import { useLocalePath } from "../i18n/useLocalePath";
import Breadcrumb, { breadcrumbSchema } from "../components/Breadcrumb";
import Icon, { IconBox } from "../components/Icon";

// ============================
// DATA
// ============================
const CONTACT_CARDS = [
  { icon: "mail", color: "#059669", title: "General Inquiries", desc: "Questions about our reviews, methodology, or anything else — we're happy to help.", email: "info@ratedbrokers.com" },
  { icon: "handshake", color: "#2563eb", title: "Partnerships", desc: "Interested in advertising, affiliate programs, or business collaboration? Let's talk.", email: "partners@ratedbrokers.com" },
];

const FAQ_KEYS = [
  { q: "contact.faq1q", a: "contact.faq1a" },
  { q: "contact.faq2q", a: "contact.faq2a" },
  { q: "contact.faq3q", a: "contact.faq3a" },
  { q: "contact.faq4q", a: "contact.faq4a" },
  { q: "contact.faq5q", a: "contact.faq5a" },
];

// ============================
// HOOKS
// ============================
function useMedia() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { mob: w < 640, tab: w >= 640 && w < 1024, desk: w >= 1024 };
}

// ============================
// FAQ ITEM
// ============================
function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderBottom: "1px solid #e2e8f0",
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", padding: "18px 0", border: "none", background: "none",
          cursor: "pointer", textAlign: "left", gap: 12,
        }}
      >
        <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 16, color: "#111827", flex: 1 }}>
          {question}
        </span>
        <Icon name={open ? "chevron-up" : "chevron-down"} size={18} color="#374151" />
      </button>
      {open && (
        <div style={{ padding: "0 0 18px", fontSize: 16, lineHeight: 1.7, color: "#1f2937" }}>
          {answer}
        </div>
      )}
    </div>
  );
}

// ============================
// MAIN
// ============================
export default function ContactPage() {
  const { t } = useTranslation();
  const lp = useLocalePath();
  const { mob, tab } = useMedia();

  useEffect(() => {
    document.title = "Contact Us — RatedBrokers | Independent Broker Reviews";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Get in touch with the RatedBrokers team. Contact us for general inquiries, business partnerships, editorial corrections, or press requests. We respond within 24-48 business hours.");
  }, []);

  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  const breadcrumbItems = [
    { label: "RatedBrokers", path: "/" },
    { label: t("contact.breadContact") },
  ];

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        name: "Contact RatedBrokers",
        description: "Get in touch with the RatedBrokers team for inquiries, partnerships, editorial corrections, or press requests.",
        url: "https://ratedbrokers.com/contact",
        mainEntity: {
          "@type": "Organization",
          name: "RatedBrokers",
          url: "https://ratedbrokers.com",
          foundingDate: "2024",
          description: "Independent forex and CFD broker comparison platform with expert-driven research methodology.",
          contactPoint: [
            { "@type": "ContactPoint", contactType: "customer service", email: "info@ratedbrokers.com" },
            { "@type": "ContactPoint", contactType: "business development", email: "partners@ratedbrokers.com" },
          ],
        },
      },
      breadcrumbSchema(breadcrumbItems),
      {
        "@type": "FAQPage",
        mainEntity: FAQ_KEYS.map(({ q, a }) => ({
          "@type": "Question",
          name: t(q),
          acceptedAnswer: { "@type": "Answer", text: t(a) },
        })),
      },
    ],
  };

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", color: "#111827", minHeight: "100vh" }}>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* =================== BREADCRUMBS =================== */}
      <div style={{ ...cn, padding: mob ? "10px 16px" : "14px 24px" }}>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* =================== HERO =================== */}
      <section style={{ ...cn, marginBottom: 40 }}>
        <div style={{ maxWidth: 780 }}>
          <span style={{
            display: "inline-block", padding: "5px 14px", borderRadius: 6,
            background: "#ecfdf5", color: "#059669",
            fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 13,
            letterSpacing: 1, marginBottom: 14,
          }}>{t("contact.badge")}</span>
          <h1 style={{
            fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 26 : 42,
            lineHeight: 1.15, color: "#0f172a", margin: "0 0 14px",
          }}>
            {t("contact.title")}
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.65, color: "#1f2937", margin: "0 0 24px" }}>
            {t("contact.subtitle")}
          </p>
        </div>
      </section>

      {/* =================== CONTACT CARDS =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr",
          gap: 16,
        }}>
          {CONTACT_CARDS.map((card, i) => (
              <div key={i} style={{
                padding: "28px 24px", borderRadius: 16,
                background: "#fff", border: "1px solid #e2e8f0",
                display: "flex", flexDirection: "column", gap: 12,
              }}>
                <IconBox name={card.icon} color={card.color} size={44} iconSize={22} />
                <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 19, color: "#0f172a" }}>
                  {card.title}
                </div>
                <div style={{ fontSize: 15, color: "#1f2937", lineHeight: 1.7, flex: 1 }}>
                  {card.desc}
                </div>
                <a
                  href={`mailto:${card.email}`}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "10px 18px", borderRadius: 8,
                    background: `${card.color}10`, color: card.color,
                    fontSize: 15, fontWeight: 700,
                    fontFamily: "'JetBrains Mono',monospace",
                    textDecoration: "none", border: `1px solid ${card.color}30`,
                    transition: "background 0.2s",
                  }}
                >
                  <Icon name="mail" size={15} color={card.color} />
                  {card.email}
                </a>
              </div>
            ))}
        </div>
      </section>

      {/* =================== FAQ =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 16 }}>
          {t("contact.faqTitle")}
        </h2>
        <div style={{
          padding: "8px 28px", borderRadius: 14,
          background: "#fff", border: "1px solid #e2e8f0",
        }}>
          {FAQ_KEYS.map((faq, i) => (
            <FaqItem key={i} question={t(faq.q)} answer={t(faq.a)} />
          ))}
        </div>
      </section>

      {/* =================== COMPANY INFO (E-E-A-T) =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <div style={{
          padding: "24px 28px", borderRadius: 14,
          background: "#fff", border: "1px solid #e2e8f0",
          borderLeft: "4px solid #059669",
        }}>
          <h3 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 20, color: "#0f172a", margin: "0 0 10px" }}>
            {t("contact.companyTitle")}
          </h3>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "#1f2937", margin: 0 }}>
            {t("contact.companyDesc")}
          </p>
        </div>
      </section>

      {/* =================== CTA =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <div style={{
          padding: mob ? "32px 24px" : "40px", borderRadius: 16,
          background: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)",
          textAlign: "center",
        }}>
          <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, color: "#fff", marginBottom: 8 }}>
            {t("contact.ctaTitle")}
          </div>
          <div style={{ fontSize: 16, color: "#64748b", marginBottom: 24, maxWidth: 500, margin: "0 auto 24px" }}>
            {t("contact.ctaDesc")}
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to={lp("/methodology")} style={{
              padding: "14px 32px", borderRadius: 10,
              background: "linear-gradient(135deg,#059669,#34d399)",
              color: "#fff", fontWeight: 800, fontSize: 16, textDecoration: "none",
            }}>{t("contact.ctaMethodology")}</Link>
            <Link to={lp("/about")} style={{
              padding: "14px 32px", borderRadius: 10,
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff", fontWeight: 600, fontSize: 16, textDecoration: "none",
            }}>{t("contact.ctaAbout")}</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
