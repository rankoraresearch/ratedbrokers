import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeroBand from "../HeroBand";
import Breadcrumb from "../Breadcrumb";
import BrokerLogo from "../BrokerLogo";
import RegBadge from "../RegBadge";
import ScoreBadge from "../ScoreBadge";
import AuthorCredits from "../AuthorCredits";
import AuthorBioCard from "../AuthorBioCard";
import { getAuthorByName, getFactChecker, getReviewerForAuthor, getEditor } from "../../data/authors";
import SubPageTabs, { TABS, TAB_META } from "./SubPageTabs";
import { Card } from "./Typography";
import { ArrowRight, ExternalLink, Zap, Award } from "lucide-react";
import { getVisitUrl } from "../../utils/visitUrl";

const NAVY = "#0f172a";
const GREEN = "#059669";
const GREEN_LIGHT = "#ecfdf5";
const GREEN_BORDER = "#a7f3d0";
const ORANGE = "#f59e0b";
const GRAY_MUTED = "#64748b";
const BORDER = "#e8ecf1";

function useMedia() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => { const fn = () => setW(window.innerWidth); window.addEventListener("resize", fn); return () => window.removeEventListener("resize", fn); }, []);
  return { mob: w < 640, tab: w >= 640 && w < 1024, desk: w >= 1024 };
}

function WideLogo({ slug, name, mob }) {
  const [err, setErr] = useState(false);
  const h = mob ? 64 : 88;
  const w = mob ? 200 : 280;
  if (err) {
    return (
      <div style={{ background: "#fff", borderRadius: 14, padding: 4, display: "inline-flex" }}>
        <BrokerLogo slug={slug} name={name} fallback={name?.slice(0, 2)} size={h} shape="brand" borderRadius={10} />
      </div>
    );
  }
  return (
    <div style={{ borderRadius: 14, overflow: "hidden", display: "inline-flex", alignItems: "center", justifyContent: "center", height: h, width: w, flexShrink: 0, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
      <img
        src={`${import.meta.env.BASE_URL}logos-wide-dark/${slug}.svg`}
        alt={`${name} logo`}
        loading="lazy"
        onError={() => setErr(true)}
        style={{ width: "70%", height: "70%", objectFit: "contain" }}
      />
    </div>
  );
}

export default function SubPageLayout({ data, slug, activeTab, children }) {
  const { mob, tab, desk } = useMedia();
  const [stickyVisible, setStickyVisible] = useState(false);
  const { B, AUTHOR } = data;
  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const visitUrl = getVisitUrl(slug);
  const meta = TAB_META[activeTab] || {};
  const isRegulation = activeTab === "regulation";
  const h1 = isRegulation ? `Is ${B.name} Safe?` : `${B.name} ${meta.h1Suffix || activeTab} 2026`;

  const author = getAuthorByName(AUTHOR.name);
  const authorEditor = getEditor();
  const authorReviewer = getReviewerForAuthor(author?.id);
  const authorFactChecker = getFactChecker(author?.id);

  useEffect(() => {
    const fn = () => setStickyVisible(window.scrollY > 400);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [activeTab]);

  /* SEO: title + meta + JSON-LD */
  useEffect(() => {
    if (isRegulation) {
      document.title = `Is ${B.name} Safe? Regulation & Trust 2026 | RatedBrokers`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", `Is ${B.name} safe and legit in 2026? Expert analysis of ${B.regs?.length || 0} regulatory licenses, investor protection, fund segregation. Score: ${B.score}/10.`);

      /* FAQ Schema for safety questions */
      const tier1 = (B.regs || []).filter(r => r.tier === 1);
      const regList = (B.regs || []).map(r => r.name).join(", ");
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: `Is ${B.name} safe?`, acceptedAnswer: { "@type": "Answer", text: tier1.length > 0 ? `Yes, ${B.name} is safe. It is regulated by ${regList} and holds ${tier1.length} Tier-1 license${tier1.length > 1 ? "s" : ""}.` : `${B.name} is regulated by ${regList}, but does not hold a Tier-1 license. Exercise caution.` } },
          { "@type": "Question", name: `Is ${B.name} regulated?`, acceptedAnswer: { "@type": "Answer", text: `Yes, ${B.name} is regulated by ${B.regs?.length || 0} financial authorit${(B.regs?.length || 0) > 1 ? "ies" : "y"}: ${regList}.` } },
          { "@type": "Question", name: `Is ${B.name} a scam?`, acceptedAnswer: { "@type": "Answer", text: `No, ${B.name} is not a scam. It is a regulated broker established in ${B.year}${B.hq ? ` in ${B.hq}` : ""} with ${regList} oversight.` } },
          { "@type": "Question", name: `Is my money safe with ${B.name}?`, acceptedAnswer: { "@type": "Answer", text: `${B.name} ${tier1.length > 0 ? "is required to hold client funds in segregated accounts under Tier-1 regulation" : "holds client funds according to its regulatory requirements"}. ${tier1.length > 0 ? "Negative balance protection is provided for retail clients." : "Check your specific entity for fund protection details."}` } },
        ],
      };
      let el = document.getElementById("faq-schema-regulation");
      if (!el) { el = document.createElement("script"); el.id = "faq-schema-regulation"; el.type = "application/ld+json"; document.head.appendChild(el); }
      el.textContent = JSON.stringify(faqSchema);
    } else {
      document.title = `${B.name} ${meta.h1Suffix || activeTab} 2026 | RatedBrokers`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", `${B.name} ${meta.breadcrumb || activeTab} — expert analysis, fees, pros & cons. Score: ${B.score}/10.`);
      const el = document.getElementById("faq-schema-regulation");
      if (el) el.remove();
    }
  }, [slug, activeTab]);

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", minHeight: "100vh", color: "#111827" }}>
      {/* Breadcrumbs */}
      <div style={{ ...cn, padding: mob ? "10px 16px" : "14px 24px" }}>
        <Breadcrumb items={[
          { label: "Home", path: "/" },
          { label: "Reviews", path: "/reviews" },
          { label: `${B.name} Review`, path: `/review/${slug}` },
          { label: meta.breadcrumb || activeTab },
        ]} />
      </div>

      {/* Hero Band */}
      <HeroBand mob={mob} tab={tab}>
        <div style={{ display: "flex", flexDirection: mob ? "column" : "row", justifyContent: "space-between", gap: mob ? 20 : 32 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: mob ? 12 : 16, marginBottom: 14 }}>
              <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{ display: "flex", flexShrink: 0, textDecoration: "none" }}>
                <WideLogo slug={slug} name={B.name} mob={mob} />
              </a>
              <div>
                <h1 style={{ fontFamily: "Outfit", fontSize: mob ? 22 : 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{h1}</h1>
                <p style={{ fontSize: mob ? 13 : 15, color: "rgba(255,255,255,0.6)", margin: 0 }}>{B.type} broker · Est. {B.year}{!mob && ` · ${B.hq}`}</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: mob ? 8 : 16, flexWrap: "wrap", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ background: "rgba(52,211,153,0.15)", border: "2px solid #34d399", borderRadius: 8, padding: "4px 10px", fontFamily: "'JetBrains Mono'", fontSize: mob ? 16 : 18, fontWeight: 800, color: "#34d399" }}>{B.score}</div>
                <span style={{ fontSize: mob ? 12 : 14, fontWeight: 600, color: "#34d399" }}>{B.verdict}</span>
              </div>
              {!mob && <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)" }} />}
              <div style={{ display: "flex", gap: 4 }}>{B.regs.filter(r => r.tier === 1).map((r, i) => <RegBadge key={i} reg={r.name} onDark />)}</div>
              {B.badge && <span style={{ background: "rgba(52,211,153,0.15)", color: "#34d399", fontSize: mob ? 10 : 11, fontWeight: 600, padding: "3px 10px", borderRadius: 5, border: "1px solid rgba(110,231,183,0.3)", display: "inline-flex", alignItems: "center", gap: 4 }}><Award size={12} color="#34d399" />{B.badge}</span>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: mob ? "repeat(3,1fr)" : "repeat(5,auto)", gap: mob ? 8 : 20 }}>
              {[{ l: "Spread", v: `${B.spread} pips` }, { l: "Commission", v: B.commission }, { l: "Min Deposit", v: `$${B.minDep}` }, ...(!mob ? [{ l: "Leverage", v: B.leverage }, { l: "Instruments", v: B.instruments }] : [])].map((x, i) => (
                <div key={i} style={mob ? { textAlign: "center", padding: "6px", background: "rgba(255,255,255,0.06)", borderRadius: 6 } : {}}>
                  <div style={{ fontSize: mob ? 10 : 12, color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{x.l}</div>
                  <div style={{ fontSize: mob ? 14 : 15, color: "#fff", fontWeight: 700 }}>{x.v}</div>
                </div>
              ))}
            </div>
            {mob && <a href={visitUrl} target="_blank" rel="nofollow sponsored" className="cta-orange" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: NAVY, fontSize: 15, fontWeight: 700, textDecoration: "none", padding: "12px", borderRadius: 10, marginTop: 14, boxShadow: "0 4px 12px rgba(245,158,11,0.3)" }}>Visit {B.name} <ArrowRight size={14} /></a>}
          </div>
          {!mob && (
            <div style={{ width: tab ? 220 : 280, flexShrink: 0, background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: tab ? "18px" : "22px", textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 600, marginBottom: 4 }}>Our Rating</div>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 40, fontWeight: 800, color: "#34d399", lineHeight: 1 }}>{B.score}</div>
              <div style={{ fontSize: 13, color: "#34d399", fontWeight: 600, marginBottom: 10 }}>{B.verdict}</div>
              {B.promo && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.08)", borderRadius: 6, padding: "5px 8px", marginBottom: 12, display: "flex", alignItems: "center", gap: 4 }}><Zap size={13} color={ORANGE} /> {B.promo}</div>}
              <a href={visitUrl} target="_blank" rel="nofollow sponsored" className="cta-orange" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: NAVY, fontSize: 16, fontWeight: 700, textDecoration: "none", padding: "13px 24px", borderRadius: 10, width: "100%", boxShadow: "0 4px 12px rgba(245,158,11,0.3)" }}>Visit {B.name} <ExternalLink size={14} /></a>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>70.53% of retail investors lose money</div>
            </div>
          )}
        </div>
      </HeroBand>

      {/* Tab Navigation */}
      <SubPageTabs activeTab={activeTab} slug={slug} mob={mob} brokerName={B.name} />

      {/* Main Content */}
      <div style={{ ...cn, display: "flex", flexDirection: mob ? "column" : "row", gap: mob ? 16 : 24, paddingTop: mob ? 20 : 28, paddingBottom: mob ? 40 : 64 }}>
        <main style={{ flex: 1, minWidth: 0 }}>
          <AuthorCredits author={author} editor={authorEditor} reviewer={authorReviewer} factChecker={authorFactChecker} updatedDate={AUTHOR.updated} compact={mob} />
          <div style={{ marginTop: 16 }} />
          {children}
          <AuthorBioCard author={author} style={{ marginTop: 24 }} />
          {/* Risk Disclaimer */}
          <div style={{ fontSize: 12, color: GRAY_MUTED, lineHeight: 1.6, marginTop: 24, padding: "14px 16px", background: "#fef3cd", border: "1px solid #fde68a", borderRadius: 8 }}>
            <strong>Risk Warning:</strong> CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. {B.riskWarning} You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.
          </div>
        </main>

        {/* Desktop Sidebar */}
        {desk && (
          <aside style={{ width: 260, flexShrink: 0 }}>
            <div style={{ position: "sticky", top: 130 }}>
              <Card style={{ textAlign: "center", padding: 20 }}>
                <BrokerLogo slug={slug} name={B.name} fallback={B.name?.slice(0, 2)} size={56} shape="icon" borderRadius={12} />
                <div style={{ fontFamily: "Outfit", fontSize: 18, fontWeight: 800, color: NAVY, marginTop: 8 }}>{B.name}</div>
                <div style={{ display: "flex", justifyContent: "center", marginTop: 8, marginBottom: 12 }}><ScoreBadge score={B.score} size="md" /></div>
                <div style={{ fontSize: 12, color: GRAY_MUTED, marginBottom: 4 }}>{B.type} · Est. {B.year}</div>
                <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 14, flexWrap: "wrap" }}>
                  {B.regs.filter(r => r.tier === 1).map((r, i) => <RegBadge key={i} reg={r.name} />)}
                </div>
                <a href={visitUrl} target="_blank" rel="nofollow sponsored" className="cta-orange" style={{ display: "block", background: `linear-gradient(135deg, ${ORANGE}, #fbbf24)`, color: NAVY, fontSize: 14, fontWeight: 700, textDecoration: "none", padding: "12px 0", borderRadius: 8, textAlign: "center", marginBottom: 8 }}>Visit {B.name}</a>
                <Link to={`/review/${slug}`} style={{ display: "block", fontSize: 13, color: GREEN, fontWeight: 600, textDecoration: "none" }}>Read Full Review →</Link>
              </Card>

              <Card>
                <div style={{ fontSize: 12, fontWeight: 700, color: GRAY_MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Key Facts</div>
                {[
                  { l: "Min Deposit", v: `$${B.minDep}` },
                  { l: "Spread", v: `${B.spread} pips` },
                  { l: "Commission", v: B.commission },
                  { l: "Leverage", v: B.leverage },
                  { l: "Instruments", v: B.instruments },
                  { l: "Platforms", v: String(B.platforms.length) },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < 5 ? `1px solid ${BORDER}` : "none" }}>
                    <span style={{ fontSize: 13, color: GRAY_MUTED }}>{s.l}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: NAVY, fontFamily: "'JetBrains Mono',monospace" }}>{s.v}</span>
                  </div>
                ))}
              </Card>

              <Card style={{ background: GREEN_LIGHT, border: `1px solid ${GREEN_BORDER}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Deep Dive</div>
                {TABS.map((t, i) => {
                  const TabIcon = t.icon;
                  const isActive = t.id === activeTab;
                  return (
                    <Link key={i} to={`/review/${slug}/${t.id}`} style={{
                      display: "flex", alignItems: "center", gap: 8, width: "100%",
                      padding: "7px 8px", borderRadius: 6,
                      background: isActive ? GREEN : "transparent",
                      color: isActive ? "#fff" : NAVY,
                      fontSize: 12, fontWeight: isActive ? 700 : 500, textAlign: "left",
                      marginBottom: 2, textDecoration: "none",
                    }}>
                      <TabIcon size={13} color={isActive ? "#fff" : GREEN} />
                      {TAB_META[t.id]?.breadcrumb || t.label}
                    </Link>
                  );
                })}
              </Card>

              <Link to={`/review/${slug}/alternatives`} style={{
                display: "flex", alignItems: "center", gap: 8, width: "100%",
                padding: "12px 14px", borderRadius: 8,
                background: "#fff", border: `1px solid ${BORDER}`,
                color: GREEN, fontSize: 12, fontWeight: 700, textDecoration: "none",
              }}>
                <ArrowRight size={13} /> Best {B.name} Alternatives
              </Link>

              <div style={{ fontSize: 11, color: GRAY_MUTED, lineHeight: 1.5, padding: "12px 14px", background: "#fff8e1", border: "1px solid #fde68a", borderRadius: 8 }}>
                <strong>Risk Warning:</strong> {B.riskWarning}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Sticky Mobile CTA */}
      {mob && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
          background: NAVY, borderTop: "1px solid rgba(255,255,255,0.1)",
          padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.2)",
          transform: stickyVisible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.3s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BrokerLogo slug={slug} name={B.name} fallback={B.name?.slice(0, 2)} size={28} shape="icon" borderRadius={6} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{B.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Score: {B.score}/10</div>
            </div>
          </div>
          <a href={visitUrl} target="_blank" rel="nofollow sponsored" className="cta-orange" style={{ background: `linear-gradient(135deg, ${ORANGE}, #fbbf24)`, color: NAVY, fontSize: 13, fontWeight: 700, textDecoration: "none", padding: "10px 20px", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 4 }}>Visit Broker <ExternalLink size={12} /></a>
        </div>
      )}
    </div>
  );
}
