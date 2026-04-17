import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../i18n/LanguageContext";
import { useLocalePath } from "../i18n/useLocalePath";
import { AUTHORS } from "../data/authors";
import { getManifesto } from "../data/authorActivity";
import { getAllBrokersWithData } from "../data/brokers";
import RANKINGS from "../data/rankings";
import { useMedia } from "../hooks/useMedia";
import Breadcrumb, { breadcrumbSchema } from "../components/Breadcrumb";
import {
  Linkedin, ArrowRight, Mail, Check,
  Microscope, ShieldCheck, Users, RefreshCw,
  PenLine, FileCheck, DollarSign,
} from "lucide-react";

// ============================
// DATA
// ============================
const FOUNDER = AUTHORS["yegor-barakovskiy"];
const TEAM = [
  AUTHORS["marcus-chen"],
  AUTHORS["sarah-williams"],
  AUTHORS["elena-petrova"],
  AUTHORS["david-kowalski"],
];

const PILLARS = [
  { icon: Microscope,  titleKey: "about.diff1Title", descKey: "about.diff1Desc", metric: "130+",  metricLabel: "DATA POINTS" },
  { icon: ShieldCheck, titleKey: "about.diff2Title", descKey: "about.diff2Desc", metric: "6",     metricLabel: "SCORE CATEGORIES" },
  { icon: Users,       titleKey: "about.diff3Title", descKey: "about.diff3Desc", metric: "5",     metricLabel: "EDITORIAL TEAM" },
  { icon: RefreshCw,   titleKey: "about.diff4Title", descKey: "about.diff4Desc", metric: "90d",   metricLabel: "RE-SCORING" },
];

const MISSION_COMMITMENTS = [
  "Public methodology — every score is calculated by a formula we publish",
  "Quarterly re-scoring — all rankings re-tested every 90 days",
  "Real-money testing — we open and fund accounts at every broker we review",
];

const PROCESS = [
  { num: "01", icon: PenLine,     label: "Written",        desc: "One named analyst per broker. Bylined, dated, backed by real-money trade evidence." },
  { num: "02", icon: ShieldCheck, label: "Peer-reviewed",  desc: "A second analyst re-checks scoring against source data. Scores can be challenged before publish." },
  { num: "03", icon: FileCheck,   label: "Fact-checked",   desc: "Compliance lead verifies every license number against regulator databases (FCA, ASIC, SEC, CySEC, BaFin)." },
];

// ============================
// MAIN
// ============================
export default function AboutPage() {
  const { t } = useTranslation();
  const lp = useLocalePath();
  const { mob, tab } = useMedia();

  const brokersCount = getAllBrokersWithData().length;
  const rankingsCount = RANKINGS.length;

  // Trust ribbon — no "team size" or year (weakness signals), swap for verticals + freshness
  const STATS = [
    { val: String(brokersCount),  label: t("about.statBrokers") },
    { val: "500+",                label: t("about.statTrades") },
    { val: String(rankingsCount), label: t("about.statRankings") },
    { val: "8",                   label: "Verticals" },
    { val: "Q2 2026",             label: "Last Update" },
  ];

  useEffect(() => {
    document.title = "About RatedBrokers | Independent Broker Reviews & Editorial Team";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Meet the editorial team behind RatedBrokers. We independently research online brokers across forex, CFD, stocks, crypto, copy trading, spread betting, options, and futures — 130+ data points per broker, peer-reviewed and fact-checked.");

    // NewsMediaOrganization schema with full E-A-T policy graph + entity @id references
    const orgLd = {
      "@context": "https://schema.org",
      "@type": "NewsMediaOrganization",
      "@id": "https://ratedbrokers.com/#organization",
      name: "RatedBrokers",
      url: "https://ratedbrokers.com",
      logo: "https://ratedbrokers.com/logo.svg",
      description: "Independent broker reviews and rankings across forex, CFD, stocks, crypto, copy trading, spread betting, options, futures, and prop firms.",
      foundingDate: "2024",
      dateModified: "2026-04-17",
      founder: {
        "@type": "Person",
        "@id": `https://ratedbrokers.com/author/${FOUNDER.id}#person`,
        name: FOUNDER.name,
        jobTitle: FOUNDER.role,
        url: `https://ratedbrokers.com/author/${FOUNDER.id}`,
        sameAs: [FOUNDER.linkedin].filter(Boolean),
      },
      member: Object.values(AUTHORS).map(a => ({
        "@type": "Person",
        "@id": `https://ratedbrokers.com/author/${a.id}#person`,
        name: a.name,
        jobTitle: a.role,
        url: `https://ratedbrokers.com/author/${a.id}`,
        worksFor: { "@id": "https://ratedbrokers.com/#organization" },
        sameAs: [a.linkedin, a.twitter].filter(Boolean),
        ...(a.credentials?.length ? {
          hasCredential: a.credentials.map(c => ({
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "Professional Certification",
            name: c,
          })),
        } : {}),
        ...(a.image ? { image: `https://ratedbrokers.com${a.image}` } : {}),
      })),
      contactPoint: [{
        "@type": "ContactPoint",
        email: "editorial@ratedbrokers.com",
        contactType: "editorial",
        availableLanguage: ["English"],
      }],
      publishingPrinciples: "https://ratedbrokers.com/methodology",
      ethicsPolicy: "https://ratedbrokers.com/how-we-make-money",
      ownershipFundingInfo: "https://ratedbrokers.com/how-we-make-money",
      knowsAbout: [
        "Forex brokers", "CFD brokers", "Stock brokers", "Crypto exchanges",
        "Copy trading platforms", "Spread betting", "Options trading",
        "Futures brokers", "Prop trading firms", "Trading platforms",
        "Financial regulation", "Broker licensing",
      ],
    };
    let orgEl = document.querySelector('script[data-jsonld="org-team"]');
    if (!orgEl) {
      orgEl = document.createElement("script");
      orgEl.type = "application/ld+json";
      orgEl.setAttribute("data-jsonld", "org-team");
      document.head.appendChild(orgEl);
    }
    orgEl.textContent = JSON.stringify(orgLd);

    const bcSchema = breadcrumbSchema([
      { label: "RatedBrokers", path: "/" },
      { label: "About Us", path: "/about" },
    ]);
    let bcEl = document.getElementById("breadcrumb-schema-about");
    if (!bcEl) {
      bcEl = document.createElement("script");
      bcEl.id = "breadcrumb-schema-about";
      bcEl.type = "application/ld+json";
      document.head.appendChild(bcEl);
    }
    bcEl.textContent = JSON.stringify(bcSchema);

    return () => {
      document.querySelector('script[data-jsonld="org-team"]')?.remove();
      document.getElementById("breadcrumb-schema-about")?.remove();
    };
  }, []);

  // Eyebrow style helpers — green for trust sections (default), orange for action sections (hero/cta)
  const eyebrowGreen = {
    fontFamily: "'JetBrains Mono',monospace",
    fontSize: 11,
    fontWeight: 700,
    color: "#059669",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    marginBottom: 10,
  };
  const eyebrowOrange = { ...eyebrowGreen, color: "#f59e0b", fontWeight: 600 };
  const h2 = {
    fontFamily: "Outfit",
    fontWeight: 800,
    fontSize: mob ? 26 : 30,
    color: "#0f172a",
    margin: "0 0 8px",
    letterSpacing: "-0.02em",
  };
  const greenStrip = {
    position: "absolute", top: 0, left: 0, right: 0,
    height: 3, pointerEvents: "none",
    background: "linear-gradient(90deg, #047857 0%, #10b981 50%, #047857 100%)",
  };

  const founderManifesto = getManifesto(FOUNDER);
  const lastUpdatedLabel = "Last reviewed Q2 2026";

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* =================== BREADCRUMBS =================== */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "10px 16px" : "14px 24px" }}>
        <Breadcrumb items={[
          { label: "RatedBrokers", path: "/" },
          { label: t("about.breadAbout") },
        ]} />
      </div>

      {/* =================== HERO — Premium Dark =================== */}
      <section style={{
        background: "linear-gradient(135deg, #0f172a 0%, #064e3b 100%)",
        padding: mob ? "40px 16px 48px" : "64px 24px 72px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(135deg, transparent 0, transparent 11px, rgba(255,255,255,0.02) 11px, rgba(255,255,255,0.02) 12px)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600, color: "#f59e0b", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>
            {t("about.badge")}
          </div>
          <h1 style={{
            fontFamily: "Outfit", fontWeight: 800,
            fontSize: mob ? 32 : 48, lineHeight: 1.1,
            color: "#fff", margin: "0 0 18px",
            letterSpacing: "-0.02em", maxWidth: 820,
          }}>
            About RatedBrokers
          </h1>
          <p style={{ fontSize: mob ? 16 : 19, lineHeight: 1.6, color: "rgba(255,255,255,0.82)", margin: "0 0 14px", maxWidth: 740, fontWeight: 300 }}>
            {t("about.subtitle")}
          </p>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, color: "#fbbf24", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            — Yegor Barakovskiy, Founder
          </div>
        </div>
      </section>

      {/* =================== TRUST RIBBON =================== */}
      <section style={{ background: "#0f172a", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "16px" : "18px 24px" }}>
          <div style={{ display: "flex", gap: mob ? 12 : 32, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: mob ? 15 : 18, fontWeight: 700, color: "#fff" }}>{s.val}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================== MEET THE FOUNDER (Plate B — green top strip) =================== */}
      <section style={{ background: "#f8fafc", padding: mob ? "40px 16px" : "56px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={eyebrowGreen}>Founder</div>
          <h2 style={h2}>{t("about.founderTitle")}</h2>
          <p style={{ fontSize: mob ? 14 : 15, color: "#64748b", lineHeight: 1.65, margin: "0 0 24px", maxWidth: 680 }}>
            The story behind the platform and the person accountable for every editorial decision.
          </p>

          <div style={{
            position: "relative", overflow: "hidden",
            background: "#fff", borderRadius: 12,
            border: "1px solid #e8ecf1",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
          }}>
            <div style={greenStrip} />
            <div style={{
              display: "flex", gap: mob ? 20 : 32, flexDirection: mob ? "column" : "row",
              alignItems: mob ? "center" : "flex-start",
              padding: mob ? "32px 22px 26px" : "36px 36px 30px",
              textAlign: mob ? "center" : "left",
            }}>
              {/* Avatar with ring + shadow (matches Plate B) */}
              <div style={{
                width: mob ? 100 : 120, height: mob ? 100 : 120,
                borderRadius: "50%", overflow: "hidden",
                background: "linear-gradient(180deg, #f8f9fb, #e8ecf1)",
                flexShrink: 0,
                boxShadow: [
                  "0 0 0 1px #fff",
                  "0 0 0 2px #e8ecf1",
                  "0 8px 16px rgba(15,23,42,0.08)",
                  "0 2px 4px rgba(15,23,42,0.06)",
                ].join(", "),
              }}>
                {FOUNDER.image && (
                  <img src={`${import.meta.env.BASE_URL}${FOUNDER.image.replace(/^\//, "")}`} alt={FOUNDER.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, color: "#059669", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
                  {FOUNDER.role}
                </div>
                <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 26, color: "#0f172a", letterSpacing: "-0.02em", marginBottom: 14 }}>
                  {FOUNDER.name}
                </div>

                {/* Pull-quote — green left rail */}
                <blockquote style={{
                  margin: "0 0 18px",
                  padding: mob ? "4px 0 4px 14px" : "6px 0 6px 18px",
                  borderLeft: "3px solid #059669",
                  fontFamily: "Outfit", fontStyle: "italic",
                  fontWeight: 600, fontSize: mob ? 17 : 19,
                  lineHeight: 1.45, color: "#0f172a",
                }}>
                  “{founderManifesto}”
                </blockquote>

                <p style={{ fontSize: 15, lineHeight: 1.75, color: "#374151", margin: "0 0 20px" }}>
                  {FOUNDER.bio}
                </p>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: mob ? "center" : "flex-start" }}>
                  <Link to={lp(`/author/${FOUNDER.id}`)} style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "10px 18px", borderRadius: 10,
                    border: "2px solid #059669", color: "#059669",
                    fontWeight: 700, fontSize: 14, textDecoration: "none",
                    background: "#fff",
                  }}>
                    View full profile <ArrowRight size={14} />
                  </Link>
                  {FOUNDER.linkedin && (
                    <a href={FOUNDER.linkedin} target="_blank" rel="noopener noreferrer" style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "10px 18px", borderRadius: 10,
                      background: "#f1f5f9", color: "#0f172a",
                      fontWeight: 600, fontSize: 14, textDecoration: "none",
                      border: "1px solid #e2e8f0",
                    }}>
                      <Linkedin size={14} /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================== OUR MISSION =================== */}
      <section style={{ maxWidth: 880, margin: "0 auto", padding: mob ? "48px 16px 32px" : "72px 24px 48px" }}>
        <div style={eyebrowGreen}>Our Mission</div>
        <h2 style={h2}>{t("about.missionTitle")}</h2>
        <p style={{ fontSize: mob ? 14 : 15, color: "#64748b", lineHeight: 1.65, margin: "0 0 24px", maxWidth: 680 }}>
          Why we built RatedBrokers and what we commit to keeping intact as we grow.
        </p>
        <p style={{ fontSize: 17, lineHeight: 1.8, color: "#1f2937", margin: "0 0 18px" }}>{t("about.missionP1")}</p>
        <p style={{ fontSize: 17, lineHeight: 1.8, color: "#1f2937", margin: "0 0 24px" }}>{t("about.missionP2")}</p>

        {/* Commitments — Plate B card (white + green top strip) */}
        <div style={{
          position: "relative", overflow: "hidden",
          padding: mob ? "22px 22px" : "24px 26px", borderRadius: 12,
          background: "#fff", border: "1px solid #e8ecf1",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
        }}>
          <div style={greenStrip} />
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, color: "#047857", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>
            Our Commitments
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {MISSION_COMMITMENTS.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{
                  flexShrink: 0, width: 22, height: 22, borderRadius: "50%",
                  background: "#059669", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginTop: 1,
                }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <div style={{ fontSize: 15, lineHeight: 1.6, color: "#1f2937", fontWeight: 500 }}>{c}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================== EDITORIAL PROCESS (3-step timeline) =================== */}
      <section style={{ background: "#f8fafc", padding: mob ? "48px 16px" : "64px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={eyebrowGreen}>Editorial Process</div>
          <h2 style={{ ...h2, margin: "0 0 8px" }}>Every review goes through three stages</h2>
          <p style={{ fontSize: mob ? 14 : 15, color: "#64748b", lineHeight: 1.65, margin: "0 0 28px", maxWidth: 680 }}>
            Write once, peer-review twice. Scores are only published after compliance has cross-checked licenses against regulator databases.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)",
            gap: mob ? 12 : 14,
            position: "relative",
          }}>
            {PROCESS.map((s, i) => {
              const Ic = s.icon;
              return (
                <div key={s.num} style={{
                  position: "relative", overflow: "hidden",
                  background: "#fff", borderRadius: 12,
                  border: "1px solid #e8ecf1",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
                  padding: mob ? "24px 22px" : "28px 26px",
                }}>
                  <div style={greenStrip} />
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: "#0f172a", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Ic size={20} strokeWidth={2} />
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 24, fontWeight: 700, color: "#e2e8f0", letterSpacing: "-0.02em" }}>
                      {s.num}
                    </div>
                  </div>
                  <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 18, color: "#0f172a", marginBottom: 8 }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.65 }}>
                    {s.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================== EDITORIAL TEAM (Plate B standard, ported from Home — green strip, hover OFF) =================== */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "48px 16px 24px" : "72px 24px 40px" }}>
        <div style={{ maxWidth: 680, marginBottom: mob ? 20 : 28 }}>
          <div style={eyebrowGreen}>Editorial Team</div>
          <h2 style={{ ...h2, margin: "0 0 8px" }}>{t("about.teamTitle")}</h2>
          <p style={{ fontSize: mob ? 14 : 15, color: "#64748b", lineHeight: 1.65, margin: 0, maxWidth: 680 }}>
            {t("about.teamDesc")}
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr 1fr" : tab ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: mob ? 10 : 14,
        }}>
          {TEAM.map((m) => (
            <Link key={m.id} to={lp(`/author/${m.id}`)} style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              textDecoration: "none", color: "#0f172a",
              background: "#fff", borderRadius: 12,
              border: "1px solid #e8ecf1",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
              position: "relative", overflow: "hidden",
              transition: "border-color 0.25s, box-shadow 0.25s",
              minHeight: mob ? 280 : 320,
            }}
              onMouseEnter={e => {
                const v = e.currentTarget.querySelector("[data-view-link]");
                if (v) v.style.color = "#059669";
              }}
              onMouseLeave={e => {
                const v = e.currentTarget.querySelector("[data-view-link]");
                if (v) v.style.color = "#64748b";
              }}
            >
              <div style={greenStrip} />

              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: mob ? "32px 16px 20px" : "36px 20px 24px",
                flex: 1, width: "100%", position: "relative",
              }}>
                <div style={{
                  width: mob ? 76 : 84, height: mob ? 76 : 84,
                  borderRadius: "50%", overflow: "hidden", position: "relative",
                  background: "linear-gradient(180deg, #f8f9fb, #e8ecf1)",
                  flexShrink: 0,
                  boxShadow: [
                    "0 0 0 1px #fff",
                    "0 0 0 2px #e8ecf1",
                    "0 8px 16px rgba(15,23,42,0.08)",
                    "0 2px 4px rgba(15,23,42,0.06)",
                  ].join(", "),
                  marginBottom: 16,
                }}>
                  {m.image ? (
                    <img src={`${import.meta.env.BASE_URL}${m.image.replace(/^\//, "")}`} alt={m.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      onError={e => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <div style={{
                      width: "100%", height: "100%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 28, color: "#059669",
                    }}>{m.initials || m.name?.slice(0, 1)}</div>
                  )}
                </div>

                <div style={{
                  fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: mob ? 15 : 16.5,
                  color: "#0f172a", letterSpacing: "-0.015em", textAlign: "center",
                  lineHeight: 1.25, marginBottom: 4,
                }}>{m.name}</div>

                {m.credentials && m.credentials.length > 0 && (
                  <div style={{
                    fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, fontWeight: 700,
                    color: "#059669", letterSpacing: "0.1em", textAlign: "center",
                    marginBottom: 8,
                  }}>{m.credentials.join(" · ")}</div>
                )}

                <div style={{
                  fontSize: mob ? 12 : 12.5, color: "#64748b", fontWeight: 500,
                  textAlign: "center", lineHeight: 1.4, marginBottom: 2,
                }}>{m.role}</div>
                {m.exp && (
                  <div style={{
                    fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: "#94a3b8", fontWeight: 600,
                    textAlign: "center", letterSpacing: "0.04em",
                  }}>{m.exp.toUpperCase()}</div>
                )}

                <div style={{
                  width: 32, height: 1, background: "#e8ecf1",
                  margin: mob ? "14px 0 12px" : "16px 0 14px",
                }} />

                {m.specialty && (
                  <div style={{
                    fontSize: mob ? 11.5 : 12, color: "#374151", fontWeight: 500,
                    textAlign: "center", lineHeight: 1.5, maxWidth: 200,
                  }}>{m.specialty}</div>
                )}

                <div data-view-link style={{
                  marginTop: "auto", paddingTop: mob ? 16 : 20,
                  fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 700,
                  color: "#64748b", letterSpacing: "-0.01em",
                  display: "inline-flex", alignItems: "center", gap: 4,
                  transition: "color 0.2s",
                }}>
                  View full profile <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =================== HOW WE'RE DIFFERENT (mini-metrics + Funding Transparency banner) =================== */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "40px 16px" : "56px 24px 40px" }}>
        <div style={{ maxWidth: 680, marginBottom: mob ? 20 : 28 }}>
          <div style={eyebrowGreen}>Our Principles</div>
          <h2 style={{ ...h2, margin: "0 0 8px" }}>{t("about.diffTitle")}</h2>
          <p style={{ fontSize: mob ? 14 : 15, color: "#64748b", lineHeight: 1.65, margin: 0, maxWidth: 680 }}>
            Four non-negotiable rules that govern how we score brokers and publish rankings.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: mob ? 10 : 14,
        }}>
          {PILLARS.map((p, i) => {
            const Ic = p.icon;
            return (
              <div key={i} style={{
                position: "relative", overflow: "hidden",
                padding: mob ? "24px 22px" : "28px 24px", borderRadius: 12,
                background: "#fff", border: "1px solid #e8ecf1",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
              }}>
                <div style={greenStrip} />

                {/* Metric top-right */}
                <div style={{
                  position: "absolute", top: 20, right: 18,
                  textAlign: "right", lineHeight: 1,
                }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 22, color: "#0f172a", letterSpacing: "-0.02em" }}>
                    {p.metric}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, fontSize: 9, color: "#94a3b8", letterSpacing: "0.1em", marginTop: 4 }}>
                    {p.metricLabel}
                  </div>
                </div>

                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "#0f172a", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginTop: 6, marginBottom: 16,
                }}>
                  <Ic size={20} strokeWidth={2} />
                </div>
                <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 8 }}>
                  {t(p.titleKey)}
                </div>
                <div style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.6 }}>
                  {t(p.descKey)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Funding Transparency — 5th principle as full-width banner with amber rail */}
        <div style={{
          marginTop: mob ? 12 : 16,
          position: "relative", overflow: "hidden",
          background: "#fff", borderRadius: 12,
          border: "1px solid #e8ecf1",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
          padding: mob ? "22px 22px" : "26px 28px",
          display: "flex", gap: mob ? 16 : 24,
          alignItems: mob ? "flex-start" : "center",
          flexDirection: mob ? "column" : "row",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            height: 3, pointerEvents: "none", background: "#d97706",
          }} />
          <div style={{
            width: 48, height: 48, borderRadius: 10,
            background: "#fffbeb", color: "#d97706",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, border: "1px solid #fde68a",
          }}>
            <DollarSign size={22} strokeWidth={2} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, color: "#92400e", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
              Funding Transparency
            </div>
            <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 17 : 19, color: "#0f172a", marginBottom: 8, letterSpacing: "-0.01em" }}>
              {t("about.affTitle")}
            </div>
            <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "#475569", margin: "0 0 10px" }}>
              {t("about.affDesc")}
            </p>
            <Link to={lp("/how-we-make-money")} style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              color: "#047857", fontWeight: 700, textDecoration: "none", fontSize: 14,
            }}>
              {t("meth.affLink")} <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* =================== CTA =================== */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "8px 16px 48px" : "16px 24px 72px" }}>
        <div style={{
          background: "linear-gradient(135deg, #0f172a 0%, #064e3b 100%)",
          borderRadius: 16, padding: mob ? "28px 20px" : "36px 44px",
          display: "flex", flexDirection: mob ? "column" : "row",
          alignItems: mob ? "flex-start" : "center",
          justifyContent: "space-between", gap: 20,
        }}>
          <div>
            <div style={{ ...eyebrowOrange, color: "#fbbf24", marginBottom: 6 }}>
              Explore Our Work
            </div>
            <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 22 : 26, color: "#fff", margin: 0 }}>
              {t("about.ctaTitle")}
            </h3>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", margin: "8px 0 0", maxWidth: 520 }}>
              {t("about.ctaDesc")}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to={lp("/rankings")} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "12px 22px",
              background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
              color: "#0f172a", borderRadius: 10,
              fontWeight: 700, fontSize: 15, textDecoration: "none",
            }}>
              {t("about.ctaButton")}
            </Link>
            <Link to={lp("/contact")} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "12px 22px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff", borderRadius: 10,
              fontWeight: 600, fontSize: 15, textDecoration: "none",
            }}>
              <Mail size={14} /> Talk to the team
            </Link>
          </div>
        </div>

        {/* Last reviewed stamp — E-A-T freshness signal */}
        <div style={{
          marginTop: mob ? 16 : 20,
          textAlign: "center",
          fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 500,
          color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase",
        }}>
          {lastUpdatedLabel}
        </div>
      </section>

    </div>
  );
}
