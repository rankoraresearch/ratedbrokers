import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../i18n/LanguageContext";
import { useLocalePath } from "../i18n/useLocalePath";
import { AUTHORS } from "../data/authors";
import Icon, { IconBox } from "../components/Icon";
import Breadcrumb from "../components/Breadcrumb";

// ============================
// DATA
// ============================
const STATS = [
  { val: "54", key: "about.statBrokers" },
  { val: "500+", key: "about.statTrades" },
  { val: "207", key: "about.statRankings" },
  { val: "4", key: "about.statAnalysts" },
  { val: "2024", key: "about.statEst" },
];

const FOUNDER = {
  name: "Yegor Barakovskiy",
  initials: "YB",
  linkedin: "https://linkedin.com/in/yegor-barakovskiy",
};

const TEAM = [
  { ...AUTHORS["marcus-chen"], specialty: "ECN/STP Execution" },
  { ...AUTHORS["sarah-williams"], specialty: "Crypto Derivatives" },
  { ...AUTHORS["elena-petrova"], specialty: "Algo Trading" },
  { ...AUTHORS["david-kowalski"], specialty: "Broker Licensing" },
];

const PILLARS = [
  { icon: "microscope", color: "#7c3aed", titleKey: "about.diff1Title", descKey: "about.diff1Desc" },
  { icon: "shield", color: "#059669", titleKey: "about.diff2Title", descKey: "about.diff2Desc" },
  { icon: "users", color: "#2563eb", titleKey: "about.diff3Title", descKey: "about.diff3Desc" },
  { icon: "refresh-cw", color: "#f59e0b", titleKey: "about.diff4Title", descKey: "about.diff4Desc" },
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
// MAIN
// ============================
export default function AboutPage() {
  const { t } = useTranslation();
  const lp = useLocalePath();
  const { mob, tab } = useMedia();

  useEffect(() => {
    document.title = "About Us — RatedBrokers | Independent Broker Reviews";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Meet the team behind RatedBrokers. We independently research forex, crypto, and CFD brokers across 130+ data points. Learn about our mission, methodology, and commitment to transparency.");
  }, []);

  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", color: "#111827", minHeight: "100vh" }}>

      {/* =================== BREADCRUMBS =================== */}
      <div style={{ paddingTop: 0 }}>
        <div style={{ ...cn, padding: "16px 24px" }}>
          <Breadcrumb items={[
            { label: "RatedBrokers", path: "/" },
            { label: t("about.breadAbout") },
          ]} />
        </div>
      </div>

      {/* =================== HERO =================== */}
      <section style={{ ...cn, marginBottom: 40 }}>
        <div style={{ maxWidth: 780 }}>
          <span style={{
            display: "inline-block", padding: "5px 14px", borderRadius: 6,
            background: "#ecfdf5", color: "#059669",
            fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 13,
            letterSpacing: 1, marginBottom: 14,
          }}>{t("about.badge")}</span>
          <h1 style={{
            fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 26 : 42,
            lineHeight: 1.15, color: "#0f172a", margin: "0 0 14px",
          }}>
            {t("about.title")}
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.65, color: "#1f2937", margin: "0 0 24px" }}>
            {t("about.subtitle")}
          </p>
        </div>
      </section>

      {/* =================== STATS BAR =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              padding: "12px 20px", borderRadius: 10, background: "#fff",
              border: "1px solid #e2e8f0", textAlign: "center",
              flex: mob ? "1 1 calc(50% - 8px)" : "0 0 auto",
            }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 22, color: "#059669" }}>{s.val}</div>
              <div style={{ fontSize: 13, color: "#1f2937", fontWeight: 500 }}>{t(s.key)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* =================== OUR MISSION =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 16 }}>
          {t("about.missionTitle")}
        </h2>
        <div style={{
          padding: "28px 32px", borderRadius: 14, background: "#fff",
          border: "1px solid #e2e8f0", maxWidth: 800,
        }}>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "#1f2937", margin: "0 0 16px" }}>
            {t("about.missionP1")}
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "#1f2937", margin: "0 0 16px" }}>
            {t("about.missionP2")}
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "#1f2937", margin: 0 }}>
            {t("about.missionP3")}
          </p>
        </div>
      </section>

      {/* =================== MEET THE FOUNDER =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 16 }}>
          {t("about.founderTitle")}
        </h2>
        <div style={{
          borderRadius: 16, overflow: "hidden", background: "#fff",
          border: "1px solid #e2e8f0", maxWidth: 800,
        }}>
          {/* Green gradient header */}
          <div style={{
            padding: "20px 28px",
            background: "linear-gradient(135deg, #059669, #34d399)",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "rgba(255,255,255,0.2)", border: "3px solid rgba(255,255,255,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 800, fontSize: 24, fontFamily: "Outfit",
              flexShrink: 0,
            }}>{FOUNDER.initials}</div>
            <div>
              <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 22, color: "#fff" }}>
                {t("about.founderName")}
              </div>
              <div style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
                {t("about.founderRole")}
              </div>
            </div>
          </div>
          {/* Bio content */}
          <div style={{ padding: "24px 28px" }}>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "#1f2937", margin: "0 0 16px" }}>
              {t("about.founderBio")}
            </p>
            <a href={FOUNDER.linkedin} target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 20px", borderRadius: 8,
              background: "#eff6ff", color: "#2563eb", fontSize: 14, fontWeight: 700,
              textDecoration: "none", border: "1px solid #bfdbfe",
            }}>
              <Icon name="linkedin" size={16} color="#2563eb" />
              {t("about.founderLinkedin")}
            </a>
          </div>
        </div>
      </section>

      {/* =================== EXPERT TEAM =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 6 }}>
          {t("about.teamTitle")}
        </h2>
        <p style={{ fontSize: 16, color: "#1f2937", marginBottom: 20 }}>
          {t("about.teamDesc")}
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr 1fr" : tab ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: 16,
        }}>
          {TEAM.map((member, i) => (
            <div key={i} style={{
              padding: "24px 20px", borderRadius: 14,
              background: "#fff", border: "1px solid #e2e8f0",
              textAlign: "center",
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%", background: "#1e3a5f",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 800, fontSize: 22, fontFamily: "Outfit",
                margin: "0 auto 12px",
              }}>{member.initials}</div>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 17 }}>{member.name}</div>
              <div style={{ fontSize: 13, color: "#1f2937", marginBottom: 10 }}>{member.role}</div>
              {member.credentials && (
                <div style={{ marginBottom: 10 }}>
                  {member.credentials.map((c, ci) => (
                    <span key={ci} style={{
                      display: "inline-block", padding: "2px 8px", borderRadius: 4,
                      background: "#ecfdf5", color: "#059669",
                      fontSize: 12, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace",
                    }}>{c}</span>
                  ))}
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 6, marginBottom: 12 }}>
                <div style={{ padding: "6px", borderRadius: 6, background: "#f8f9fb" }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 16, color: "#059669" }}>{member.reviews}</div>
                  <div style={{ fontSize: 11, color: "#1f2937" }}>{t("about.teamReviews")}</div>
                </div>
                <div style={{ padding: "6px", borderRadius: 6, background: "#f8f9fb" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{member.exp}</div>
                  <div style={{ fontSize: 11, color: "#1f2937" }}>{t("about.teamExp")}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: "#1f2937", marginBottom: 10 }}>{t("about.teamSpecialty")}: {member.specialty}</div>
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" style={{
                display: "block", padding: "8px", borderRadius: 6,
                background: "#eff6ff", color: "#2563eb", fontSize: 13, fontWeight: 600,
                textDecoration: "none", border: "1px solid #bfdbfe",
              }}>{t("about.teamLinkedin")}</a>
            </div>
          ))}
        </div>
      </section>

      {/* =================== HOW WE'RE DIFFERENT =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, marginBottom: 20 }}>
          {t("about.diffTitle")}
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: 16,
        }}>
          {PILLARS.map((p, i) => (
            <div key={i} style={{
              padding: "28px 24px", borderRadius: 14,
              background: "#fff", border: "1px solid #e2e8f0",
            }}>
              <div style={{ marginBottom: 16 }}>
                <IconBox name={p.icon} color={p.color} size={44} iconSize={22} />
              </div>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 17, marginBottom: 8 }}>
                {t(p.titleKey)}
              </div>
              <div style={{ fontSize: 15, color: "#1f2937", lineHeight: 1.7 }}>
                {t(p.descKey)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =================== EDITORIAL INDEPENDENCE =================== */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <div style={{
          padding: "24px 28px", borderRadius: 14,
          background: "#fffbeb", border: "1px solid #fde68a", borderLeft: "4px solid #d97706",
        }}>
          <h3 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 20, color: "#92400e", margin: "0 0 10px" }}>
            {t("about.affTitle")}
          </h3>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "#78350f", margin: "0 0 12px" }}>
            {t("about.affDesc")}
          </p>
          <Link to={lp("/how-we-make-money")} style={{
            color: "#92400e", fontWeight: 700, textDecoration: "none", fontSize: 15,
          }}>{t("meth.affLink")} →</Link>
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
            {t("about.ctaTitle")}
          </div>
          <div style={{ fontSize: 16, color: "#64748b", marginBottom: 24, maxWidth: 500, margin: "0 auto 24px" }}>
            {t("about.ctaDesc")}
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to={lp("/rankings")} style={{
              padding: "14px 32px", borderRadius: 10,
              background: "linear-gradient(135deg,#059669,#34d399)",
              color: "#fff", fontWeight: 800, fontSize: 16, textDecoration: "none",
            }}>{t("about.ctaButton")}</Link>
            <Link to={lp("/methodology")} style={{
              padding: "14px 32px", borderRadius: 10,
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff", fontWeight: 600, fontSize: 16, textDecoration: "none",
            }}>{t("about.ctaMethod")}</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
