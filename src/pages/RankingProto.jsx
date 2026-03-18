/**
 * RankingProto — улучшенный прототип рейтинга
 * Интегрированы рекомендации Билла (SEO), Барбары (UX), Forex-эксперта
 * URL: /proto/ranking
 */
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { getBrokersForRanking } from "../data/rankingFilters";
import SEO_CONTENT from "../data/rankingSeoContent";
import { getThematicData, getBrokerBlurb, getQuickVerdict, getComparisonCols } from "../data/rankingThematic";
import Accordion from "../components/Accordion";
import { getAuthorForRanking, getFactChecker, getReviewerForAuthor, getEditor } from "../data/authors";
import AuthorCredits from "../components/AuthorCredits";
import AuthorBioCard from "../components/AuthorBioCard";
import AffiliateDisclosureBanner from "../components/AffiliateDisclosureBanner";
import Breadcrumb from "../components/Breadcrumb";
import Icon, { ArrowRight, CircleCheck, Check, X as XIcon, ChevronDown } from "../components/Icon";
import { Trophy, Star, Clock, BarChart3, ShieldCheck, ExternalLink } from "lucide-react";
import BrokerLogo from "../components/BrokerLogo";
import HeroBand from "../components/HeroBand";
import ScoreBadge from "../components/ScoreBadge";
import RegBadge from "../components/RegBadge";
import RANKINGS, { getRankingsByCategory } from "../data/rankings";

const YEAR = "2026";
const apiBase = import.meta.env.VITE_API_URL || "";
const makeVisitUrl = (slug, fallbackUrl) => apiBase ? `${apiBase}/go/${slug}` : fallbackUrl;

// ─── Quick Answer List (replaces ToC pills) ───
function QuickAnswerList({ brokers, quickVerdict, mob }) {
  const items = quickVerdict || [
    { label: "Best Overall", icon: "🏆", slug: brokers[0]?.slug, metric: `${brokers[0]?.B?.score}/10` },
    { label: "Runner-Up", icon: "🥈", slug: brokers[1]?.slug, metric: `${brokers[1]?.B?.score}/10` },
    { label: "Best Value", icon: "💰", slug: brokers[2]?.slug, metric: `${brokers[2]?.B?.score}/10` },
  ];
  return (
    <div style={{
      background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0",
      padding: mob ? "16px" : "20px 24px",
    }}>
      <h2 style={{
        fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 16 : 18,
        color: "#0f172a", margin: "0 0 12px",
      }}>Our Top Picks</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item, i) => {
          const broker = brokers.find(b => b.slug === item.slug) || brokers[i];
          if (!broker) return null;
          return (
            <a key={item.slug} href={`#broker-${broker.slug}`} style={{
              display: "flex", alignItems: "center", gap: mob ? 10 : 14,
              padding: mob ? "10px 12px" : "10px 16px", borderRadius: 10,
              background: i === 0 ? "#ecfdf5" : "#f8fafc",
              border: i === 0 ? "1px solid #059669" : "1px solid #f1f5f9",
              textDecoration: "none", transition: "background 0.15s",
            }}>
              <span style={{ fontSize: mob ? 16 : 18 }}>{item.icon}</span>
              <span style={{ fontSize: mob ? 12 : 13, fontWeight: 600, color: "#64748b", minWidth: mob ? 80 : 110 }}>{item.label}</span>
              <BrokerLogo slug={broker.slug} name={broker.B.name} fallback={broker.B.logo} size={mob ? 24 : 28} shape="brand" />
              <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 14 : 15, color: "#0f172a", flex: 1 }}>{broker.B.name}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 13, color: "#059669" }}>{item.metric}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

// ─── Trust Stats Bar ───
function TrustStatsBar({ brokerCount, mob }) {
  const stats = [
    { icon: <BarChart3 size={16} color="#059669" />, label: "Brokers Ranked", value: String(brokerCount) },
    { icon: <Clock size={16} color="#059669" />, label: "Hours Research", value: "200+" },
    { icon: <ShieldCheck size={16} color="#059669" />, label: "Last Updated", value: `Mar ${YEAR}` },
  ];
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1,
      background: "#e2e8f0", borderRadius: 10, overflow: "hidden",
    }}>
      {stats.map(s => (
        <div key={s.label} style={{
          background: "#fff", padding: mob ? "12px 8px" : "14px 16px",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          {!mob && s.icon}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: mob ? 16 : 18, color: "#0f172a" }}>{s.value}</div>
            <div style={{ fontSize: mob ? 10 : 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.3px" }}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Unified Broker Card ───
function BrokerCard({ broker, rank, mob, tab, thematicBlurb, isWinner }) {
  const B = broker.B;
  const visitUrl = makeVisitUrl(broker.slug, B.url);
  const reviewPath = `/review/${broker.slug}`;
  const [expanded, setExpanded] = useState(false);

  const pros = thematicBlurb?.pros || broker.PROS?.slice(0, 3) || [];
  const cons = thematicBlurb?.cons || broker.CONS?.slice(0, 2) || [];

  return (
    <div id={`broker-${broker.slug}`} style={{
      background: "#fff", borderRadius: 16,
      border: isWinner ? "2px solid #059669" : "1px solid #e2e8f0",
      boxShadow: isWinner ? "0 4px 20px rgba(5,150,105,0.08)" : "none",
      overflow: "hidden",
    }}>
      {/* Winner badge */}
      {isWinner && (
        <div style={{
          background: "linear-gradient(135deg, #059669, #047857)",
          padding: mob ? "8px 16px" : "10px 24px",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <Trophy size={14} color="#fbbf24" />
          <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 12, color: "#fff", letterSpacing: "0.5px", textTransform: "uppercase" }}>
            Our #1 Pick for {YEAR}
          </span>
        </div>
      )}

      <div style={{ padding: mob ? "16px" : "20px 24px" }}>
        {/* Row 1: Rank + Logo + Name + Badge + Score + CTAs */}
        <div style={{
          display: "flex", alignItems: mob ? "flex-start" : "center",
          gap: mob ? 10 : 16, flexWrap: mob ? "wrap" : "nowrap",
        }}>
          {/* Rank badge */}
          <div style={{
            width: mob ? 28 : 34, height: mob ? 28 : 34, borderRadius: 8, flexShrink: 0,
            background: rank === 1 ? "#059669" : rank <= 3 ? "linear-gradient(135deg,#1e3a5f,#2d5a8e)" : "#f1f5f9",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'JetBrains Mono',monospace", fontWeight: 800,
            fontSize: mob ? 12 : 14, color: rank <= 3 ? "#fff" : "#1f2937",
          }}>#{rank}</div>

          {/* Logo + Name */}
          <div style={{ display: "flex", alignItems: "center", gap: mob ? 10 : 14, flex: 1, minWidth: 0 }}>
            <BrokerLogo slug={broker.slug} name={B.name} fallback={B.logo} size={mob ? 44 : 52} shape="brand" />
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 16 : 18, color: "#0f172a" }}>{B.name}</span>
                {B.badge && (
                  <span style={{
                    padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700,
                    background: "#ecfdf5", color: "#059669",
                  }}>{B.badge}</span>
                )}
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 1 }}>{B.type}</div>
              {/* Trustpilot */}
              {B.tp && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                  <Star size={12} color="#00b67a" fill="#00b67a" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#00b67a" }}>{B.tp}</span>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>({B.tpCount?.toLocaleString()} reviews)</span>
                </div>
              )}
            </div>
          </div>

          {/* Score */}
          <ScoreBadge score={B.score} size={mob ? "md" : "lg"} />

          {/* Desktop CTAs */}
          {!mob && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
              <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{
                padding: "10px 24px", borderRadius: 8, textDecoration: "none",
                background: "#f59e0b", color: "#0f172a",
                fontWeight: 700, fontSize: 14, textAlign: "center",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                Visit {B.name} <ArrowRight size={14} />
              </a>
              <Link to={reviewPath} style={{
                padding: "8px 24px", borderRadius: 8, textDecoration: "none",
                background: "#f8fafc", color: "#1f2937", border: "1px solid #e2e8f0",
                fontWeight: 600, fontSize: 13, textAlign: "center",
              }}>Read Review</Link>
            </div>
          )}
        </div>

        {/* Regulators */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", margin: "10px 0", paddingLeft: mob ? 38 : 50 }}>
          {B.regs.slice(0, 3).map(r => <RegBadge key={r.name} reg={r.name} />)}
        </div>

        {/* Stats row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr 1fr 1fr" : "1fr 1fr 1fr 1fr 1fr",
          gap: 1, background: "#f1f5f9", borderRadius: 10, overflow: "hidden",
          margin: "10px 0",
        }}>
          {[
            { label: "Spread", value: B.spread || "0.0" },
            { label: "Min Deposit", value: B.minDep ? `$${B.minDep}` : "$0" },
            { label: "Leverage", value: B.leverage || "1:500" },
            ...(mob ? [] : [
              { label: "Commission", value: B.commission || "—" },
              { label: "Instruments", value: B.instruments || "—" },
            ]),
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", padding: mob ? "8px 6px" : "10px 12px", textAlign: "center" }}>
              <div style={{ fontSize: mob ? 9 : 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.3px" }}>{s.label}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: mob ? 12 : 14, color: "#0f172a", marginTop: 2 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Pros / Cons */}
        {(pros.length > 0 || cons.length > 0) && (
          <div style={{ display: "flex", gap: mob ? 6 : 10, flexWrap: "wrap", margin: "8px 0" }}>
            {pros.slice(0, 3).map((p, i) => (
              <span key={`p${i}`} style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                background: "#ecfdf5", color: "#065f46",
              }}>
                <Check size={11} color="#059669" /> {typeof p === "string" ? p.split("—")[0].trim().slice(0, 30) : p}
              </span>
            ))}
            {cons.slice(0, 2).map((c, i) => (
              <span key={`c${i}`} style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                background: "#fef2f2", color: "#991b1b",
              }}>
                <XIcon size={11} color="#dc2626" /> {typeof c === "string" ? c.split("—")[0].trim().slice(0, 30) : c}
              </span>
            ))}
          </div>
        )}

        {/* Why we recommend (thematic) */}
        {thematicBlurb?.text && (
          <div style={{ margin: "8px 0" }}>
            {thematicBlurb.why && (
              <div style={{ fontWeight: 700, fontSize: 13, color: "#059669", marginBottom: 4 }}>{thematicBlurb.why}</div>
            )}
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "#374151", margin: 0 }}>
              {expanded ? thematicBlurb.text : thematicBlurb.text.slice(0, 180) + (thematicBlurb.text.length > 180 ? "..." : "")}
            </p>
            {thematicBlurb.text.length > 180 && (
              <button onClick={() => setExpanded(!expanded)} style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#059669", fontWeight: 600, fontSize: 13, padding: "4px 0",
              }}>{expanded ? "Show less" : "Read full analysis ▸"}</button>
            )}
          </div>
        )}

        {/* Mobile CTAs */}
        {mob && (
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{
              flex: 1, padding: "12px", borderRadius: 8, textDecoration: "none",
              background: "#f59e0b", color: "#0f172a",
              fontWeight: 700, fontSize: 14, textAlign: "center",
            }}>Visit {B.name}</a>
            <Link to={reviewPath} style={{
              flex: 1, padding: "12px", borderRadius: 8, textDecoration: "none",
              background: "#f8fafc", color: "#1f2937", border: "1px solid #e2e8f0",
              fontWeight: 600, fontSize: 13, textAlign: "center",
            }}>Review</Link>
          </div>
        )}

        {/* Risk warning */}
        {B.riskWarning && (
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 8, lineHeight: 1.4 }}>
            {B.riskWarning}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Related Rankings ───
function RelatedRankings({ mob }) {
  const related = getRankingsByCategory("forex").slice(0, 6);
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: mob ? "1fr 1fr" : "1fr 1fr 1fr",
      gap: mob ? 8 : 12,
    }}>
      {related.map(r => (
        <Link key={r.id} to={r.slug} style={{
          padding: mob ? "12px" : "16px", borderRadius: 10,
          background: "#fff", border: "1px solid #e2e8f0",
          textDecoration: "none", fontSize: mob ? 13 : 14,
          fontWeight: 600, color: "#1f2937",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <Icon name={r.icon} size={16} color="#059669" />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</span>
        </Link>
      ))}
    </div>
  );
}

// ─── Main Page ───
export default function RankingProto() {
  const { mob, tab } = useMedia();
  const [showStickyBar, setShowStickyBar] = useState(false);
  const heroRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);

  const rankingId = "forex-overall";
  const brokers = getBrokersForRanking(rankingId);
  const seo = SEO_CONTENT[rankingId] || {};
  const thematic = getThematicData(rankingId);
  const quickVerdict = getQuickVerdict(rankingId, brokers);
  const topBroker = brokers[0]?.B?.name || "IC Markets";
  const author = getAuthorForRanking("forex");
  const editor = getEditor();
  const reviewer = getReviewerForAuthor(author.id);
  const factChecker = getFactChecker(author.id);

  const fillVars = (text) =>
    text?.replace(/\{year\}/g, YEAR).replace(/\{topBroker\}/g, topBroker).replace(/\{count\}/g, String(brokers.length)) || "";

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([e]) => setShowStickyBar(!e.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  return (
    <main style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", minHeight: "100vh" }}>

      {/* BREADCRUMBS */}
      <div style={{ ...cn, padding: mob ? "10px 16px" : "14px 24px" }}>
        <Breadcrumb items={[
          { label: "RatedBrokers", path: "/" },
          { label: "Rankings", path: "/rankings" },
          { label: "Best Forex Brokers" },
        ]} />
      </div>

      {/* HERO */}
      <HeroBand mob={mob} tab={tab}>
        <header ref={heroRef} style={{ textAlign: "center" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: mob ? 44 : 56, height: mob ? 44 : 56,
            borderRadius: 14, background: "rgba(255,255,255,0.1)", marginBottom: 8,
          }}>
            <Trophy size={mob ? 22 : 28} color="#34d399" />
          </span>
          <h1 style={{
            fontFamily: "Outfit", fontWeight: 900,
            fontSize: mob ? 24 : tab ? 32 : 40,
            lineHeight: 1.1, color: "#fff", marginBottom: 6,
          }}>Best Forex Brokers {YEAR}</h1>
          <p style={{
            fontSize: mob ? 13 : 15, color: "rgba(255,255,255,0.75)",
            maxWidth: 560, margin: "0 auto 10px", lineHeight: 1.5,
          }}>
            Independently tested and ranked. {brokers.length} brokers analyzed across 130+ data points.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <AuthorCredits author={author} editor={editor} reviewer={reviewer} factChecker={factChecker} updatedDate={`March ${YEAR}`} variant="centered" onDark />
          </div>
        </header>
      </HeroBand>

      {/* AFFILIATE DISCLOSURE */}
      <section style={{ ...cn, paddingTop: mob ? 12 : 16 }}>
        <AffiliateDisclosureBanner />
      </section>

      {/* TRUST STATS BAR */}
      <section style={{ ...cn, paddingTop: mob ? 12 : 16 }}>
        <TrustStatsBar brokerCount={brokers.length} mob={mob} />
      </section>

      {/* QUICK ANSWER LIST */}
      <section style={{ ...cn, paddingTop: mob ? 12 : 16 }}>
        <QuickAnswerList brokers={brokers} quickVerdict={quickVerdict} mob={mob} />
      </section>

      {/* KEY FINDING */}
      {seo.keyFinding && (
        <section style={{ ...cn, paddingTop: mob ? 12 : 16 }}>
          <div style={{
            background: "#ecfdf5", borderLeft: "4px solid #059669",
            borderRadius: "0 12px 12px 0", padding: mob ? "14px 16px" : "16px 24px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <CircleCheck size={16} color="#059669" />
              <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 14, color: "#059669" }}>Key Finding</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "#065f46", margin: 0 }}>{fillVars(seo.keyFinding)}</p>
          </div>
        </section>
      )}

      {/* ALL BROKER CARDS — unified format */}
      <section style={{ ...cn, paddingTop: mob ? 16 : 24, paddingBottom: mob ? 16 : 24 }}>
        <h2 style={{
          fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 24,
          color: "#0f172a", marginBottom: mob ? 14 : 18,
        }}>Full Rankings</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: mob ? 12 : 14 }}>
          {brokers.map((broker, i) => (
            <BrokerCard
              key={broker.slug}
              broker={broker}
              rank={i + 1}
              mob={mob}
              tab={tab}
              thematicBlurb={getBrokerBlurb(rankingId, broker.slug, broker)}
              isWinner={i === 0}
            />
          ))}
        </div>
      </section>

      {/* HOW WE TESTED */}
      <section style={{ ...cn, paddingBottom: mob ? 16 : 24 }}>
        <div style={{
          background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0",
          padding: mob ? "20px 16px" : "28px 32px",
        }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, color: "#0f172a", marginBottom: 12 }}>
            How We Tested {brokers.length} Forex Brokers
          </h2>
          {(seo.intro || []).map((p, i) => (
            <p key={i} style={{ fontSize: 14, lineHeight: 1.8, color: "#374151", marginBottom: i < (seo.intro?.length || 0) - 1 ? 12 : 0 }}>{fillVars(p)}</p>
          ))}
          {seo.howWeRanked && (
            <p style={{ fontSize: 14, lineHeight: 1.8, color: "#374151", marginTop: 12, fontStyle: "italic" }}>{fillVars(seo.howWeRanked)}</p>
          )}
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section style={{ ...cn, paddingBottom: mob ? 16 : 24 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, color: "#0f172a", marginBottom: mob ? 12 : 16 }}>
          Side-by-Side Comparison
        </h2>
        {mob ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {brokers.slice(0, 10).map((broker, i) => (
              <div key={broker.slug} style={{
                background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0",
                padding: "10px 12px", display: "grid",
                gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: 8,
              }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 13, color: "#64748b" }}>#{i + 1}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>{broker.B.name}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>{broker.B.spread} spread | ${broker.B.minDep || 0} min</div>
                </div>
                <ScoreBadge score={broker.B.score} size="sm" />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%", borderCollapse: "collapse",
              background: "#fff", borderRadius: 12, overflow: "hidden",
              border: "1px solid #e2e8f0",
            }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["#", "Broker", "Score", "Spread", "Commission", "Min Deposit", "Leverage", "Regulation"].map(h => (
                    <th key={h} style={{
                      padding: "10px 14px", textAlign: "left",
                      fontSize: 11, fontWeight: 700, color: "#64748b",
                      textTransform: "uppercase", borderBottom: "1px solid #e2e8f0",
                    }}>{h}</th>
                  ))}
                  <th style={{ padding: "10px 14px", textAlign: "center", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {brokers.slice(0, 10).map((broker, i) => (
                  <tr key={broker.slug} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "10px 14px", fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, color: "#64748b" }}>#{i + 1}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <BrokerLogo slug={broker.slug} name={broker.B.name} fallback={broker.B.logo} size={28} shape="brand" />
                        <span style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>{broker.B.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "10px 14px" }}><ScoreBadge score={broker.B.score} size="sm" /></td>
                    <td style={{ padding: "10px 14px", fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>{broker.B.spread}</td>
                    <td style={{ padding: "10px 14px", fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>{broker.B.commission || "—"}</td>
                    <td style={{ padding: "10px 14px", fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>${broker.B.minDep || 0}</td>
                    <td style={{ padding: "10px 14px", fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>{broker.B.leverage}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                        {broker.B.regs.slice(0, 2).map(r => <RegBadge key={r.name} reg={r.name} />)}
                      </div>
                    </td>
                    <td style={{ padding: "10px 14px", textAlign: "center" }}>
                      <a href={makeVisitUrl(broker.slug, broker.B.url)} target="_blank" rel="noopener nofollow sponsored" style={{
                        padding: "6px 16px", borderRadius: 6, textDecoration: "none",
                        background: "#f59e0b", color: "#0f172a", fontWeight: 700, fontSize: 12,
                      }}>Visit</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* WHAT TO LOOK FOR */}
      <section style={{ ...cn, paddingBottom: mob ? 16 : 24 }}>
        <div style={{
          background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0",
          padding: mob ? "20px 16px" : "28px 32px",
        }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, color: "#0f172a", marginBottom: 12 }}>
            What to Look For in a Forex Broker
          </h2>
          {[
            { h: "Regulation", t: "Only brokers licensed by Tier-1 authorities (FCA, ASIC, CySEC) made our shortlist. We verified every license number directly with the regulator." },
            { h: "Total Trading Costs", t: "Don't just compare spreads — factor in commissions, overnight financing, and withdrawal fees. The cheapest spread means nothing if withdrawal takes two weeks." },
            { h: "Execution Quality", t: "We stress-tested execution during NFP releases and ECB announcements. Brokers that slip or requote under pressure didn't make our top 10." },
            { h: "Platform Stability", t: "A platform that crashes during volatile markets is worse than useless. We tested during high-impact events to verify stability and uptime." },
          ].map((item, i) => (
            <div key={i} style={{ marginBottom: i < 3 ? 14 : 0 }}>
              <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 15, color: "#0f172a", marginBottom: 4 }}>{item.h}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "#374151", margin: 0 }}>{item.t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RELATED RANKINGS */}
      <section style={{ ...cn, paddingBottom: mob ? 16 : 24 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, color: "#0f172a", marginBottom: mob ? 12 : 16 }}>
          Related Rankings
        </h2>
        <RelatedRankings mob={mob} />
      </section>

      {/* FAQ */}
      <section style={{ ...cn, paddingBottom: mob ? 16 : 24 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, color: "#0f172a", marginBottom: mob ? 12 : 16 }}>
          Frequently Asked Questions
        </h2>
        <Accordion
          items={(seo.faq || []).slice(0, 6).map(item => ({ q: fillVars(item.q), a: fillVars(item.a) }))}
          expanded={openFaq}
          setExpanded={setOpenFaq}
        />
      </section>

      {/* METHODOLOGY CTA */}
      <section style={{ ...cn, paddingBottom: mob ? 16 : 24 }}>
        <div style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #047857 100%)",
          borderRadius: 16, padding: mob ? "28px 20px" : "36px 32px", textAlign: "center",
        }}>
          <h3 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 24, color: "#fff", marginBottom: 8 }}>
            How We Test Brokers
          </h3>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", maxWidth: 480, margin: "0 auto 16px", lineHeight: 1.6 }}>
            130+ data points per broker. Licenses verified. Spreads measured live.
          </p>
          <Link to="/methodology" style={{
            display: "inline-block", padding: "12px 28px", borderRadius: 10,
            background: "#059669", color: "#fff",
            fontFamily: "Outfit", fontWeight: 700, fontSize: 15, textDecoration: "none",
          }}>Read Our Methodology</Link>
        </div>
      </section>

      {/* AUTHOR BIO */}
      <section style={{ ...cn, paddingBottom: mob ? 16 : 24 }}>
        <AuthorBioCard author={author} />
      </section>

      {/* STICKY CTA BAR */}
      {brokers[0] && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "#fff", borderTop: "1px solid #e2e8f0",
          boxShadow: "0 -4px 16px rgba(0,0,0,0.06)",
          transform: showStickyBar ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.3s ease", zIndex: 999,
        }}>
          <div style={{
            maxWidth: 1200, margin: "0 auto",
            padding: mob ? "8px 16px" : "10px 24px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: mob ? 8 : 14,
          }}>
            <BrokerLogo slug={brokers[0].slug} name={brokers[0].B.name} fallback={brokers[0].B.logo} size={28} shape="brand" />
            <span style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>#1 {brokers[0].B.name}</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 15, color: "#059669" }}>{brokers[0].B.score}</span>
            <a href={makeVisitUrl(brokers[0].slug, brokers[0].B.url)} target="_blank" rel="noopener nofollow sponsored" style={{
              padding: mob ? "8px 18px" : "8px 24px", borderRadius: 8,
              background: "#f59e0b", color: "#0f172a",
              fontWeight: 700, fontSize: 13, textDecoration: "none",
            }}>Visit {brokers[0].B.name} <ArrowRight size={12} style={{ verticalAlign: "middle" }} /></a>
          </div>
        </div>
      )}
    </main>
  );
}
