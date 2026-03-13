import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getRegulatorBySlug, REGULATORS } from "../data/regulators";
import { getAllBrokersWithData } from "../data/brokers/index";
import { useTranslation } from "../i18n/LanguageContext";
import { useLocalePath } from "../i18n/useLocalePath";
import BrokerLogo from "../components/BrokerLogo";
import Breadcrumb, { breadcrumbSchema } from "../components/Breadcrumb";
import Icon, { ArrowRight, Check, ExternalLink } from "../components/Icon";
import { Shield, AlertTriangle, CircleX } from "lucide-react";
import CountryFlag from "../components/CountryFlag";
import RegulatorLogo from "../components/RegulatorLogo";
import HeroWave, { DotGrid } from "../components/HeroWave";

function useMedia() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => { const fn = () => setW(window.innerWidth); window.addEventListener("resize", fn); return () => window.removeEventListener("resize", fn); }, []);
  return { mob: w < 640, tab: w >= 640 && w < 1024, desk: w >= 1024 };
}

function TierBadge({ tier }) {
  const color = tier === 1 ? "#059669" : tier === 2 ? "#d97706" : "#dc2626";
  const bg = tier === 1 ? "#ecfdf5" : tier === 2 ? "#fffbeb" : "#fef2f2";
  const border = tier === 1 ? "#a7f3d0" : tier === 2 ? "#fde68a" : "#fecaca";
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 6,
      fontSize: 13, fontWeight: 700, background: bg, color, border: `1px solid ${border}`,
    }}>Tier {tier}</span>
  );
}

function Card({ children, style = {} }) {
  return <div style={{ background: "#fff", border: "1px solid #e8ecf1", borderRadius: 12, padding: "22px", marginBottom: 16, ...style }}>{children}</div>;
}

export default function RegulatorPage() {
  const { slug } = useParams();
  const reg = getRegulatorBySlug(slug);
  const { mob, tab } = useMedia();
  const { t } = useTranslation();
  const lp = useLocalePath();
  const [openFaq, setOpenFaq] = useState(null);
  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  // JSON-LD
  useEffect(() => {
    if (!reg) return;
    const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "GovernmentOrganization",
        name: reg.fullName,
        alternateName: reg.name,
        url: reg.website,
        foundingDate: String(reg.established),
        areaServed: reg.country,
        description: reg.overview[0],
      },
      breadcrumbSchema([
        { label: "RatedBrokers", path: "/" },
        { label: reg.fullName, path: `/regulator/${slug}` },
      ]),
    ];
    let el = document.querySelector('script[data-jsonld="regulator"]');
    if (!el) { el = document.createElement("script"); el.type = "application/ld+json"; el.setAttribute("data-jsonld", "regulator"); document.head.appendChild(el); }
    el.textContent = JSON.stringify(jsonLd);
    return () => { const el = document.querySelector('script[data-jsonld="regulator"]'); if (el) el.remove(); };
  }, [slug, reg]);

  if (!reg) return (
    <div style={{ textAlign: "center", padding: "120px 24px", fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      <h1 style={{ fontFamily: "Outfit", fontSize: 32, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>Regulator Not Found</h1>
      <p style={{ color: "#64748b", marginBottom: 24 }}>The regulator you're looking for doesn't exist in our database.</p>
      <Link to={lp("/")} style={{ color: "#059669", fontWeight: 600, textDecoration: "none" }}>Back to Home</Link>
    </div>
  );

  // Get brokers regulated by this regulator
  const allBrokers = getAllBrokersWithData();
  const regulatedBrokers = allBrokers.filter(b =>
    b.B.regs.some(r => r.name.toLowerCase() === reg.name.toLowerCase())
  );

  const tierColor = reg.tier === 1 ? "#059669" : reg.tier === 2 ? "#d97706" : "#dc2626";
  const tierBg = reg.tier === 1 ? "#ecfdf5" : reg.tier === 2 ? "#fffbeb" : "#fef2f2";
  const tierBorder = reg.tier === 1 ? "#a7f3d0" : reg.tier === 2 ? "#fde68a" : "#fecaca";

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", color: "#1e293b", minHeight: "100vh" }}>
      {/* Breadcrumbs */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8ecf1", padding: "10px 0" }}>
        <div style={cn}>
          <Breadcrumb items={[
            { label: "RatedBrokers", path: "/" },
            { label: reg.fullName },
          ]} />
        </div>
      </div>

      {/* Hero */}
      <div style={{ position: "relative", overflow: "hidden", background: "linear-gradient(180deg, #f0f9ff 0%, #f5faff 50%, #f8f9fb 100%)", borderTop: "4px solid #0ea5e9" }}>
        <DotGrid size={28} color="rgba(14,165,233,0.04)" dotSize={1} />
        <section style={{ position: "relative", padding: mob ? "24px 0 0" : "36px 0 0" }}>
          <div style={{ ...cn, display: "flex", flexDirection: mob ? "column" : "row", justifyContent: "space-between", gap: mob ? 20 : 32 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <RegulatorLogo slug={reg.slug} name={reg.name} size={mob ? 44 : 56} shape="icon" tier={reg.tier} />
                <CountryFlag code={reg.code} size={mob ? 24 : 30} />
                <div>
                  <h1 style={{ fontFamily: "Outfit", fontSize: mob ? 24 : 34, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", margin: 0 }}>
                    {reg.fullName} ({reg.name})
                  </h1>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                    <TierBadge tier={reg.tier} />
                    <span style={{ fontSize: 15, color: "#64748b" }}>{reg.country}</span>
                    <span style={{ fontSize: 15, color: "#94a3b8" }}>Est. {reg.established}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
                <a href={reg.website} target="_blank" rel="noopener noreferrer" style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", borderRadius: 8, fontSize: 14, fontWeight: 600,
                  background: "#eff6ff", color: "#2563eb", textDecoration: "none", border: "1px solid #bfdbfe",
                }}>Official Website <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
                <a href={reg.licenseCheck} target="_blank" rel="noopener noreferrer" style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", borderRadius: 8, fontSize: 14, fontWeight: 600,
                  background: "#f0fdf4", color: "#059669", textDecoration: "none", border: "1px solid #a7f3d0",
                }}>Check License Register <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
              </div>
            </div>
          </div>
        </section>
        <HeroWave color="#f8f9fb" height={mob ? 24 : 36} />
      </div>

      {/* Main Layout */}
      <div style={{ ...cn, display: mob ? "flex" : "grid", flexDirection: "column", gridTemplateColumns: mob ? "1fr" : "1fr 300px", gap: mob ? 16 : 28, paddingTop: mob ? 20 : 28, paddingBottom: mob ? 40 : 64 }}>
        {/* Main content */}
        <main>
          {/* Overview */}
          <h2 style={{ fontFamily: "Outfit", fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 14, marginTop: 0 }}>
            Overview
          </h2>
          {reg.overview.map((p, i) => (
            <p key={i} style={{ fontSize: 16, color: "#475569", lineHeight: 1.8, marginBottom: 14 }}>{p}</p>
          ))}

          {/* Key Requirements */}
          <h2 style={{ fontFamily: "Outfit", fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 14, marginTop: 32 }}>
            Key Requirements
          </h2>
          <Card>
            {reg.requirements.map((req, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: i < reg.requirements.length - 1 ? "1px solid #f0f4f8" : "none" }}>
                <span style={{ color: "#059669", flexShrink: 0 }}><Check size={16} /></span>
                <span style={{ fontSize: 16, color: "#334155", lineHeight: 1.6 }}>{req}</span>
              </div>
            ))}
          </Card>

          {/* Investor Protection Callout */}
          <h2 style={{ fontFamily: "Outfit", fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 14, marginTop: 32 }}>
            Investor Protection
          </h2>
          <div style={{
            padding: "20px 24px", borderRadius: 12,
            background: tierBg, border: `2px solid ${tierBorder}`,
            marginBottom: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              {reg.tier === 1 ? <Shield size={24} color={tierColor} /> : reg.tier === 2 ? <AlertTriangle size={24} color={tierColor} /> : <CircleX size={24} color={tierColor} />}
              <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 18, color: tierColor }}>
                {reg.tier === 1 ? "Strong Protection" : reg.tier === 2 ? "Moderate Protection" : "Limited Protection"}
              </span>
            </div>
            <div style={{ fontSize: 16, color: "#334155", lineHeight: 1.7 }}>
              <strong>Compensation:</strong> {reg.investorProtection}
            </div>
            {reg.leverageLimit && (
              <div style={{ fontSize: 16, color: "#334155", lineHeight: 1.7, marginTop: 4 }}>
                <strong>Leverage Limit:</strong> {reg.leverageLimit}
              </div>
            )}
          </div>

          {/* History */}
          <h2 style={{ fontFamily: "Outfit", fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 14, marginTop: 32 }}>
            History
          </h2>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.8, marginBottom: 14 }}>{reg.history}</p>

          {/* Brokers Regulated */}
          <h2 style={{ fontFamily: "Outfit", fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 14, marginTop: 32 }}>
            Brokers Regulated by {reg.name}
          </h2>
          {regulatedBrokers.length === 0 ? (
            <p style={{ fontSize: 16, color: "#64748b" }}>No brokers in our database are currently regulated by {reg.name}.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {regulatedBrokers.map((b, i) => (
                <Card key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <a href={b.B.url} target="_blank" rel="noopener noreferrer nofollow" style={{ display: "flex", flexShrink: 0 }}><BrokerLogo slug={b.slug} name={b.B.name} fallback={b.B.logo} size={44} shape="wide" variant="gray" /></a>
                    <div>
                      <Link to={lp(`/review/${b.slug}`)} style={{ fontWeight: 700, fontSize: 16, color: "#0f172a", textDecoration: "none", display: "block" }}
                        onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                        onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                      >{b.B.name}</Link>
                      <div style={{ fontSize: 14, color: "#64748b" }}>{b.B.type} {"\u00b7"} Min. ${b.B.minDep}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      background: "#ecfdf5", border: "2px solid #059669", borderRadius: 8,
                      padding: "4px 10px", fontFamily: "'JetBrains Mono',monospace",
                      fontSize: 16, fontWeight: 800, color: "#059669",
                    }}>{b.B.score}</div>
                    <Link to={lp(`/review/${b.slug}`)} style={{
                      fontSize: 13, color: "#1e3a5f", fontWeight: 600, textDecoration: "none",
                      padding: "6px 14px", border: "1px solid #cbd5e1", borderRadius: 6,
                    }}><span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>Read Review <ArrowRight size={12} /></span></Link>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* FAQ */}
          <h2 style={{ fontFamily: "Outfit", fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 14, marginTop: 32 }}>
            FAQ
          </h2>
          {reg.faq.map((f, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #e8ecf1", borderRadius: 10, marginBottom: 6, overflow: "hidden" }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                width: "100%", textAlign: "left", background: "none", border: "none",
                padding: "14px 18px", cursor: "pointer", fontFamily: "DM Sans",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ fontWeight: 600, fontSize: 16, color: "#1e293b", flex: 1, paddingRight: 12 }}>{f.q}</span>
                <span style={{ color: "#94a3b8", fontSize: 18, transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 18px 14px", fontSize: 16, color: "#64748b", lineHeight: 1.7 }}>{f.a}</div>
              )}
            </div>
          ))}
        </main>

        {/* Sidebar - Key Facts */}
        {!mob && (
          <aside>
            <div style={{ position: "sticky", top: 70, display: "flex", flexDirection: "column", gap: 14 }}>
              <Card style={{ padding: "20px" }}>
                <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 15, marginBottom: 14, color: "#0f172a" }}>Key Facts</div>
                {[
                  { l: "Established", v: reg.established },
                  { l: "Jurisdiction", v: reg.country },
                  { l: "Tier", v: `Tier ${reg.tier}` },
                  { l: "Supervised Firms", v: reg.supervisedFirms },
                  { l: "Investor Protection", v: reg.investorProtection },
                  { l: "Leverage Limit", v: reg.leverageLimit },
                ].map((x, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < 5 ? "1px solid #f0f4f8" : "none" }}>
                    <span style={{ fontSize: 14, color: "#94a3b8" }}>{x.l}</span>
                    <span style={{ fontSize: 14, color: "#1e293b", fontWeight: 600, textAlign: "right", maxWidth: "60%" }}>{x.v}</span>
                  </div>
                ))}
                <a href={reg.licenseCheck} target="_blank" rel="noopener noreferrer" style={{
                  display: "block", textAlign: "center", marginTop: 14,
                  padding: "10px", borderRadius: 8, fontSize: 14, fontWeight: 600,
                  background: "#f0fdf4", color: "#059669", textDecoration: "none",
                  border: "1px solid #a7f3d0",
                }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Verify License <ExternalLink size={13} /></span></a>
              </Card>

              {/* Other regulators */}
              <Card style={{ padding: "16px" }}>
                <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Other Regulators</div>
                {REGULATORS.filter(r => r.slug !== reg.slug).slice(0, 6).map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < 5 ? "1px solid #f0f4f8" : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <RegulatorLogo slug={r.slug} name={r.name} size={22} shape="icon" tier={r.tier} />
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</span>
                    </div>
                    <Link to={lp(`/regulator/${r.slug}`)} style={{ fontSize: 12, color: "#1e3a5f", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 3 }}>View <ArrowRight size={11} /></Link>
                  </div>
                ))}
              </Card>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
