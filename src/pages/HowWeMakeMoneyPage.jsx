import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../i18n/LanguageContext";
import { useLocalePath } from "../i18n/useLocalePath";
import { useMedia } from "../hooks/useMedia";
import { getAllBrokers } from "../data/brokers/index";
import { FAQ_HWMM } from "../data/methodologyData";
import Icon from "../components/Icon";
import Breadcrumb from "../components/Breadcrumb";
import { ChevronDown } from "lucide-react";

export default function HowWeMakeMoneyPage() {
  const { t } = useTranslation();
  const lp = useLocalePath();
  const { mob, tab } = useMedia();
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const allBrokers = getAllBrokers().sort((a, b) => b.score - a.score);

  useEffect(() => {
    document.title = "How RatedBrokers Makes Money | Full Transparency";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "We earn affiliate commissions when you open a broker account through our links. You pay nothing extra. It never affects our scores. Full transparency on how we fund independent testing.");

    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          headline: "How RatedBrokers Makes Money",
          description: "Full transparency on how RatedBrokers earns revenue through affiliate partnerships while maintaining editorial independence.",
          author: { "@type": "Organization", name: "RatedBrokers" },
          publisher: { "@type": "Organization", name: "RatedBrokers", url: "https://ratedbrokers.com" },
          datePublished: "2025-06-01",
          dateModified: "2026-03-01",
        },
        {
          "@type": "FAQPage",
          mainEntity: FAQ_HWMM.map(item => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "RatedBrokers", item: "https://ratedbrokers.com/" },
            { "@type": "ListItem", position: 2, name: "How We Make Money", item: "https://ratedbrokers.com/how-we-make-money" },
          ],
        },
      ],
    };
    let el = document.getElementById("hwmm-schema");
    if (!el) {
      el = document.createElement("script");
      el.id = "hwmm-schema";
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(schema);
    return () => { if (el.parentNode) el.parentNode.removeChild(el); };
  }, []);

  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  const protectionCards = [
    { icon: "eye-off", title: t("hwmm.protectBlind"), desc: t("hwmm.protectBlindDesc"), color: "#7c3aed" },
    { icon: "users", title: t("hwmm.protectTeams"), desc: t("hwmm.protectTeamsDesc"), color: "#2563eb" },
    { icon: "book-open", title: t("hwmm.protectPublished"), desc: t("hwmm.protectPublishedDesc"), color: "#059669" },
    { icon: "calendar", title: t("hwmm.protectAudits"), desc: t("hwmm.protectAuditsDesc"), color: "#f59e0b" },
  ];

  const dontDoList = [
    t("hwmm.dont1"),
    t("hwmm.dont2"),
    t("hwmm.dont3"),
    t("hwmm.dont4"),
    t("hwmm.dont5"),
  ];

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", color: "#1e293b", minHeight: "100vh" }}>

      {/* BREADCRUMBS */}
      <div style={{ ...cn, padding: "16px 24px" }}>
        <Breadcrumb items={[
          { label: "RatedBrokers", path: "/" },
          { label: t("hwmm.breadcrumb") },
        ]} />
      </div>

      {/* =================== HERO =================== */}
      <section style={{ ...cn, marginBottom: 40 }}>
        <div style={{ maxWidth: 780 }}>
          <div style={{
            display: "inline-block", padding: "4px 12px", borderRadius: 6,
            background: "#ecfdf5", color: "#059669",
            fontSize: 12, fontWeight: 800, letterSpacing: 1, marginBottom: 14,
            textTransform: "uppercase",
          }}>{t("hwmm.badge")}</div>
          <h1 style={{ fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 26 : 42, lineHeight: 1.15, color: "#0f172a", margin: "0 0 14px" }}>
            {t("hwmm.title")}
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.65, color: "#475569", margin: 0 }}>
            {t("hwmm.subtitle")}
          </p>
        </div>
      </section>

      {/* =================== THE SHORT VERSION =================== */}
      <section style={{ ...cn, marginBottom: 40 }}>
        <div style={{
          padding: "24px 28px", borderRadius: 14,
          background: "linear-gradient(135deg,#0f172a,#1e3a5f)",
          borderLeft: "4px solid #34d399",
        }}>
          <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 20, color: "#34d399", marginBottom: 10 }}>
            {t("hwmm.shortTitle")}
          </div>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "#e2e8f0", margin: 0 }}>
            {t("hwmm.shortText")}
          </p>
        </div>
      </section>

      {/* =================== HOW AFFILIATE PROGRAMS WORK =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 6 }}>
          {t("hwmm.howTitle")}
        </h2>
        <p style={{ fontSize: 16, color: "#64748b", marginBottom: 24, maxWidth: 700 }}>
          {t("hwmm.howDesc")}
        </p>

        {/* 3-step visual */}
        <div style={{
          display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: 16,
        }}>
          {[
            { step: "1", icon: "mouse-pointer", title: t("hwmm.step1Title"), desc: t("hwmm.step1Desc"), color: "#2563eb" },
            { step: "2", icon: "user-plus", title: t("hwmm.step2Title"), desc: t("hwmm.step2Desc"), color: "#7c3aed" },
            { step: "3", icon: "dollar-sign", title: t("hwmm.step3Title"), desc: t("hwmm.step3Desc"), color: "#059669" },
          ].map((s, i) => (
            <div key={i} style={{
              padding: "24px 20px", borderRadius: 14,
              background: "#fff", border: "1px solid #e2e8f0",
              textAlign: "center", position: "relative",
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                background: s.color + "14", display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 12px",
              }}>
                <Icon name={s.icon} size={24} color={s.color} />
              </div>
              <div style={{
                position: "absolute", top: 12, left: 16,
                fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 24,
                color: s.color + "20",
              }}>{s.step}</div>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* =================== WHAT YOU PAY VS WHAT WE EARN =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <div style={{
          padding: "24px 28px", borderRadius: 14,
          background: "#ecfdf5", border: "1px solid #a7f3d0",
        }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 24, color: "#065f46", margin: "0 0 10px" }}>
            {t("hwmm.payTitle")}
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "#064e3b", margin: "0 0 8px" }}>
            {t("hwmm.payText1")}
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "#064e3b", margin: 0 }}>
            {t("hwmm.payText2")}
          </p>
        </div>
      </section>

      {/* =================== OUR AFFILIATE PARTNERS =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 6 }}>
          {t("hwmm.partnersTitle")}
        </h2>
        <p style={{ fontSize: 16, color: "#64748b", marginBottom: 20, maxWidth: 700 }}>
          {t("hwmm.partnersDesc")}
        </p>

        {/* Partners table */}
        <div style={{ borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", background: "#fff" }}>
          {/* Header */}
          <div style={{
            display: "grid", gridTemplateColumns: mob ? "1fr 80px" : "1fr 120px 160px",
            padding: "12px 20px", background: "#f8f9fb",
            fontWeight: 700, fontSize: 13, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5,
          }}>
            <div>{t("hwmm.colBroker")}</div>
            <div style={{ textAlign: "center" }}>{t("hwmm.colScore")}</div>
            {!mob && <div style={{ textAlign: "center" }}>{t("hwmm.colType")}</div>}
          </div>
          {allBrokers.map((b, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: mob ? "1fr 80px" : "1fr 120px 160px",
              padding: "10px 20px", borderTop: "1px solid #f1f5f9",
              background: i % 2 === 0 ? "#fff" : "#fafbfc",
              alignItems: "center",
            }}>
              <Link to={lp(`/review/${b.slug}`)} style={{
                color: "#1e293b", textDecoration: "none", fontWeight: 500, fontSize: 15,
              }}>{b.name}</Link>
              <div style={{
                textAlign: "center", fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 15,
                color: b.score >= 9 ? "#059669" : b.score >= 8 ? "#2563eb" : "#f59e0b",
              }}>{b.score}</div>
              {!mob && <div style={{ textAlign: "center", fontSize: 13, color: "#64748b" }}>{b.type}</div>}
            </div>
          ))}
        </div>

        {/* Score variance note */}
        <div style={{
          marginTop: 16, padding: "14px 20px", borderRadius: 10,
          background: "#fffbeb", border: "1px solid #fde68a",
        }}>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "#92400e", margin: 0 }}>
            <strong>{t("hwmm.varianceNote")}</strong>{" "}
            {t("hwmm.varianceText")}
          </p>
        </div>
      </section>

      {/* =================== HOW WE PROTECT INDEPENDENCE =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 20 }}>
          {t("hwmm.protectTitle")}
        </h2>
        <div style={{
          display: "grid", gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(4, 1fr)", gap: 16,
        }}>
          {protectionCards.map((card, i) => (
            <div key={i} style={{
              padding: "24px 20px", borderRadius: 14,
              background: "#fff", border: "1px solid #e2e8f0",
              borderTop: `3px solid ${card.color}`,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: card.color + "14", display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 12,
              }}>
                <Icon name={card.icon} size={22} color={card.color} />
              </div>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{card.title}</div>
              <div style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7 }}>{card.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Link to={lp("/methodology")} style={{
            color: "#059669", fontWeight: 600, textDecoration: "none", fontSize: 15,
          }}>{t("hwmm.readMethodology")}</Link>
          <Link to={lp("/trust-score")} style={{
            color: "#059669", fontWeight: 600, textDecoration: "none", fontSize: 15,
          }}>Understand our Trust Score →</Link>
        </div>
      </section>

      {/* =================== WHAT WE DON'T DO =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 20 }}>
          {t("hwmm.dontTitle")}
        </h2>
        <div style={{
          padding: "24px 28px", borderRadius: 14,
          background: "#fff", border: "1px solid #e2e8f0",
        }}>
          {dontDoList.map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 0",
              borderBottom: i < dontDoList.length - 1 ? "1px solid #f1f5f9" : "none",
            }}>
              <span style={{
                width: 24, height: 24, borderRadius: "50%",
                background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, fontSize: 14,
              }}>✗</span>
              <span style={{ fontSize: 16, color: "#334155" }}>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* =================== FAQ =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 20 }}>
          {t("meth.faqTitle")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {FAQ_HWMM.map((item, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <div onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)} style={{
                padding: "16px 20px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ fontWeight: 600, fontSize: 16 }}>{item.q}</span>
                <span style={{ color: "#64748b", transform: expandedFAQ === i ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-flex" }}><ChevronDown size={18} /></span>
              </div>
              {expandedFAQ === i && (
                <div style={{ padding: "0 20px 18px", fontSize: 15, lineHeight: 1.8, color: "#334155", borderTop: "1px solid #f1f5f9" }}>
                  <p style={{ marginTop: 12 }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =================== CTA =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <div style={{
          padding: mob ? "32px 24px" : "40px", borderRadius: 16,
          background: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)",
          textAlign: "center",
        }}>
          <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, color: "#fff", marginBottom: 8 }}>
            {t("hwmm.ctaTitle")}
          </div>
          <div style={{ fontSize: 16, color: "#94a3b8", marginBottom: 24, maxWidth: 500, margin: "0 auto 24px" }}>
            {t("hwmm.ctaDesc")}
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to={lp("/methodology")} style={{
              padding: "14px 32px", borderRadius: 10,
              background: "linear-gradient(135deg,#059669,#34d399)",
              color: "#fff", fontWeight: 800, fontSize: 16, textDecoration: "none",
            }}>{t("hwmm.ctaMethodology")}</Link>
            <Link to={lp("/")} style={{
              padding: "14px 32px", borderRadius: 10,
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff", fontWeight: 600, fontSize: 16, textDecoration: "none",
            }}>{t("hwmm.ctaRankings")}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
