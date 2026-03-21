/**
 * RankingProtoC — полноценный прототип по ТЗ (8 блоков)
 * Аудит: Barbara (UX) + Bill (SEO) — все рекомендации применены
 *
 * Блок 1: Intro (100 слов, keyword в первом предложении)
 * Блок 2: Quick Broker Buttons (10, tooltip risk warning — без layout shift)
 * Блок 3: Key Finding + Text (130 слов)
 * Блок 4: Filter buttons (pill-shaped + count)
 * Блок 5: Broker cards (unified standard)
 * Блок 6: SEO + Spread chart
 * Блок 7: SEO + Comparison table (с CTA)
 * Блок 8: SEO Text (education)
 * + Trust Stats Bar, Related Rankings, JSON-LD, meta, How We Ranked
 *
 * URL: /proto/ranking-c
 */
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { getBrokersForRanking } from "../data/rankingFilters";
import SEO_CONTENT from "../data/rankingSeoContent";
import { getThematicData, getBrokerBlurb, getEducation } from "../data/rankingThematic";
import RANKINGS, { getRankingsByCategory, getRankingsBySub } from "../data/rankings";
import Accordion from "../components/Accordion";
import { getAuthorForRanking, getFactChecker, getReviewerForAuthor, getEditor } from "../data/authors";
import AuthorCredits from "../components/AuthorCredits";
import AuthorBioCard from "../components/AuthorBioCard";
import AffiliateDisclosureBanner from "../components/AffiliateDisclosureBanner";
import Breadcrumb, { breadcrumbSchema } from "../components/Breadcrumb";
import Icon, { ArrowRight, CircleCheck, Check, X as XIcon } from "../components/Icon";
import { Trophy, Star, ChevronRight, ChevronDown } from "lucide-react";
import BrokerLogo from "../components/BrokerLogo";
import HeroBand from "../components/HeroBand";
import ScoreBadge from "../components/ScoreBadge";
import BrokerRankCard from "../components/BrokerRankCard";
import RegBadge from "../components/RegBadge";


const YEAR = "2026";
const apiBase = import.meta.env.VITE_API_URL || "";
const makeVisitUrl = (slug, fallbackUrl) => apiBase ? `${apiBase}/go/${slug}` : fallbackUrl;

// ═══════════════════════════════════════════════════════════
// Design tokens (unified standard from Barbara audit)
// ═══════════════════════════════════════════════════════════
const T = {
  h2: (mob) => ({ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 26, color: "#0f172a" }),
  h3: (mob) => ({ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 16 : 18, color: "#0f172a" }),
  sectionGap: (mob) => mob ? 24 : 32,
  cardBg: { background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0" },
  cardPad: (mob) => mob ? "20px 16px" : "28px 32px",
};

// ═══════════════════════════════════════════════════════════
// БЛОК 2 — Quick Broker Grid v3
// 2 столбика по 5 (column-first). Крупный логотип + название.
// Replace-on-hover: score → risk warning внутри блока.
// ═══════════════════════════════════════════════════════════
function QuickBrokerGrid({ brokers, mob }) {
  const top10 = brokers.slice(0, 10);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const getRisk = (B) => {
    const riskText = B.riskWarning
      ? B.riskWarning.replace(/^.*?(\d{2,3}\.?\d*%).*$/s, "$1 of retail CFD accounts lose money")
      : "CFDs are complex. 74% lose money.";
    return riskText.length > 55 ? riskText.slice(0, 53) + "…" : riskText;
  };

  // ─── Card renderer for all 10 ───
  const renderCard = (broker, i) => {
    const B = broker.B;
    const visitUrl = makeVisitUrl(broker.slug, B.url);
    const isHovered = hoveredIdx === i;
    const shortRisk = getRisk(B);
    const isWinner = i === 0;
    const isMedal = i < 3;

    // Rank badge: green for top 3, light gray for rest
    const badgeStyle = isMedal
      ? { bg: "linear-gradient(135deg, #059669, #047857)", shadow: "0 2px 6px rgba(5,150,105,0.25)", color: "#fff" }
      : { bg: "#f1f5f9", shadow: "none", color: "#64748b" };

    // Card styles — clean, uniform
    const cardBorder = "#e5e7eb";
    const cardShadow = "0 1px 3px rgba(0,0,0,0.04)";

    const logoSize = mob ? 32 : 40;
    const nameSize = mob ? 13 : 15;
    const scoreSize = mob ? 14 : 15;
    const badgeSize = mob ? 24 : 28;

    return (
      <a key={broker.slug} href={visitUrl} target="_blank" rel="noopener nofollow sponsored"
        onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}
        style={{
          display: "flex", alignItems: "center", gap: mob ? 10 : 14,
          padding: mob ? "10px 12px" : "12px 16px",
          borderRadius: 12, background: "#fff",
          border: `1px solid ${isHovered ? "#059669" : cardBorder}`,
          boxShadow: isHovered ? "0 4px 16px rgba(0,0,0,0.07)" : cardShadow,
          textDecoration: "none", transition: "box-shadow 0.2s, border-color 0.2s", cursor: "pointer",
        }}>

        {/* Rank badge */}
        <div style={{
          width: badgeSize, height: badgeSize,
          borderRadius: isMedal ? 7 : 6, flexShrink: 0,
          background: badgeStyle.bg, boxShadow: badgeStyle.shadow,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: mob ? 11 : 12,
          fontWeight: isMedal ? 800 : 700, color: badgeStyle.color,
        }}>{i + 1}</div>

        {/* Logo — icon only */}
        <BrokerLogo slug={broker.slug} name={B.name} fallback={B.logo} size={logoSize} shape="icon" />

        {/* Name + Score + Risk */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: 700, fontSize: nameSize, color: "#0f172a",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{B.name}</div>

          {/* Score — always visible */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
            <Star size={mob ? 11 : 12} color="#059669" fill="#059669" />
            <span style={{ fontSize: scoreSize, fontWeight: 700, color: "#059669", lineHeight: 1 }}>{B.score}</span>
            <span style={{ fontSize: 11, color: "#9ca3af" }}>/10</span>
          </div>

          {/* Risk — always takes space, opacity-only transition on desktop */}
          <div style={{
            fontSize: mob ? 9 : 10, color: "#b0b8c4", lineHeight: 1.2, marginTop: 2,
            height: mob ? "auto" : 13, overflow: "hidden",
            whiteSpace: "nowrap", textOverflow: "ellipsis",
            opacity: mob ? 1 : (isHovered ? 1 : 0),
            transition: "opacity 0.2s",
          }}>{shortRisk}</div>
        </div>

        {/* Arrow */}
        {!mob && (
          <ChevronRight size={16} color={isHovered ? "#059669" : "#cbd5e1"} style={{
            flexShrink: 0, transition: "color 0.2s, transform 0.2s",
            transform: isHovered ? "translateX(2px)" : "none",
          }} />
        )}
      </a>
    );
  };

  return (
    <div style={{
      display: mob ? "flex" : "grid",
      flexDirection: mob ? "column" : undefined,
      gridTemplateColumns: mob ? undefined : "1fr 1fr",
      gridAutoFlow: mob ? undefined : "column",
      gridTemplateRows: mob ? undefined : "repeat(5, auto)",
      gap: mob ? 6 : 8,
    }}>
      {top10.map((broker, i) => renderCard(broker, i))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// БЛОК 4 — Filter Buttons (pill-shaped + count)
// ═══════════════════════════════════════════════════════════
function FilterButtons({ activeFilter, setActiveFilter, brokers, mob }) {
  const counts = {
    all: brokers.length,
    ecn: brokers.filter(b => (b.B.type || "").toLowerCase().includes("ecn")).length,
    stp: brokers.filter(b => (b.B.type || "").toLowerCase().includes("stp")).length,
    mm: brokers.filter(b => (b.B.type || "").toLowerCase().includes("market")).length,
    "low-spread": brokers.filter(b => parseFloat(b.B.spread || "1") <= 0.1).length,
    regulated: brokers.filter(b => b.B.regs.some(r => r.tier === 1)).length,
  };
  const filters = [
    { id: "all", label: "All Brokers" },
    { id: "ecn", label: "ECN" },
    { id: "stp", label: "STP" },
    { id: "mm", label: "Market Maker" },
    { id: "low-spread", label: "Low Spread" },
    { id: "regulated", label: "Tier-1 Only" },
  ];
  return (
    <div style={{
      display: "flex", gap: mob ? 6 : 8, flexWrap: "wrap",
      padding: "4px 0",
    }}>
      {filters.map(f => {
        const isActive = activeFilter === f.id;
        return (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            style={{
              padding: mob ? "8px 14px" : "8px 20px",
              borderRadius: 20,
              border: isActive ? "1.5px solid #0f172a" : "1.5px solid #e2e8f0",
              cursor: "pointer",
              fontSize: mob ? 13 : 14, fontWeight: 600,
              background: isActive ? "#0f172a" : "#fff",
              color: isActive ? "#fff" : "#374151",
              transition: "all 0.15s",
              display: "inline-flex", alignItems: "center", gap: 4,
            }}
          >
            {f.label}
            <span style={{ fontSize: 11, opacity: 0.6 }}>({counts[f.id]})</span>
          </button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// БЛОК 5 — Broker Card (unified standard: production sizes + ProtoC layout)
// ═══════════════════════════════════════════════════════════
function BrokerCard({ broker, rank, mob, tab, thematicBlurb }) {
  const B = broker.B;
  const visitUrl = makeVisitUrl(broker.slug, B.url);
  const reviewPath = `/review/${broker.slug}`;
  const [expanded, setExpanded] = useState(false);

  const pros = thematicBlurb?.pros || broker.PROS?.slice(0, 3) || [];
  const cons = thematicBlurb?.cons || broker.CONS?.slice(0, 2) || [];
  const fullText = thematicBlurb?.text || broker.B.verdict || "";
  const cutoff = 400;
  const cutIdx = fullText.lastIndexOf(" ", cutoff);
  const shortText = fullText.slice(0, cutIdx > 200 ? cutIdx : cutoff);
  const hasMore = fullText.length > cutoff;

  return (
    <div
      style={{
        ...T.cardBg,
        border: rank === 1 ? "2px solid #059669" : "1px solid #e2e8f0",
        overflow: "hidden",
        boxShadow: rank === 1 ? "0 4px 16px rgba(5,150,105,0.08)" : "0 1px 4px rgba(0,0,0,0.03)",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={e => { if (!mob) e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.08)"; }}
      onMouseLeave={e => { if (!mob) e.currentTarget.style.boxShadow = rank === 1 ? "0 4px 16px rgba(5,150,105,0.08)" : "0 1px 4px rgba(0,0,0,0.03)"; }}
    >
      {rank === 1 && (
        <div style={{
          background: "linear-gradient(135deg, #059669, #047857)",
          padding: mob ? "6px 14px" : "8px 20px",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <Trophy size={13} color="#fbbf24" />
          <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 11, color: "#fff", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Our #1 Pick for {YEAR}
          </span>
        </div>
      )}

      <div style={{ padding: mob ? "16px" : "20px 28px" }}>
        {/* Header: Rank + Logo + Name + Score + CTA */}
        <div style={{
          display: "flex", alignItems: mob ? "flex-start" : "center",
          gap: mob ? 10 : 16, flexWrap: mob ? "wrap" : "nowrap",
        }}>
          {/* Rank badge — 44x44 desktop, 32x32 mobile */}
          <div style={{
            width: mob ? 32 : 44, height: mob ? 32 : 44, borderRadius: mob ? 8 : 10, flexShrink: 0,
            background: rank === 1 ? "#059669" : rank <= 3 ? "linear-gradient(135deg,#1e3a5f,#2d5a8e)" : "#f1f5f9",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'JetBrains Mono',monospace", fontWeight: 800,
            fontSize: mob ? 13 : 16, color: rank <= 3 ? "#fff" : "#1f2937",
          }}>#{rank}</div>

          {/* Logo — clickable */}
          <Link to={reviewPath} style={{ display: "flex", flexShrink: 0, textDecoration: "none" }}>
            <BrokerLogo slug={broker.slug} name={B.name} fallback={B.logo} size={mob ? 52 : 56} shape="brand" />
          </Link>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <Link to={reviewPath} style={{
                fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 16 : 18, color: "#0f172a",
                textDecoration: "none",
              }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
              >{B.name}</Link>
              {B.badge && <span style={{ padding: "2px 8px", borderRadius: 5, fontSize: 11, fontWeight: 700, background: "#ecfdf5", color: "#059669" }}>{B.badge}</span>}
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 1 }}>{B.type}</div>
            {B.tp && (
              <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 2 }}>
                <Star size={11} color="#00b67a" fill="#00b67a" />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#00b67a" }}>{B.tp}</span>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>({B.tpCount?.toLocaleString()})</span>
              </div>
            )}
          </div>

          <ScoreBadge score={B.score} size={mob ? "md" : "lg"} />

          {/* Desktop CTAs — green gradient primary */}
          {!mob && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0, width: 200 }}>
              <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{
                padding: "10px 20px", borderRadius: 8, textDecoration: "none", textAlign: "center",
                background: "linear-gradient(135deg, #059669, #047857)",
                color: "#fff", fontWeight: 700, fontSize: 14,
                boxShadow: "0 2px 8px rgba(5,150,105,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              }}>Visit {B.name} <ArrowRight size={13} /></a>
              <Link to={reviewPath} style={{
                padding: "8px 20px", borderRadius: 8, textDecoration: "none", textAlign: "center",
                background: "#fff", color: "#1f2937", border: "1.5px solid #cbd5e1",
                fontWeight: 600, fontSize: 13, transition: "all 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#059669"; e.currentTarget.style.color = "#059669"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.color = "#1f2937"; }}
              >Read Review</Link>
            </div>
          )}
        </div>

        {/* Regs */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", margin: "10px 0 8px", paddingLeft: mob ? 42 : 60 }}>
          {B.regs.slice(0, 3).map(r => <RegBadge key={r.name} reg={r.name} />)}
        </div>

        {/* Stats grid — gap:1 divider style */}
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr 1fr 1fr" : "1fr 1fr 1fr 1fr 1fr",
          gap: 1, background: "#f1f5f9", borderRadius: 10, overflow: "hidden", margin: "8px 0",
        }}>
          {[
            { l: "Spread", v: `${B.spread} pips` },
            { l: "Min Deposit", v: B.minDep === 0 ? "$0" : `$${B.minDep}` },
            { l: "Leverage", v: B.leverage || "1:500" },
            ...(mob ? [] : [
              { l: "Commission", v: B.commission || "—" },
              { l: "Instruments", v: B.instruments || "—" },
            ]),
          ].map(s => (
            <div key={s.l} style={{ background: "#f8fafc", padding: mob ? "8px 6px" : "10px 12px", textAlign: "center" }}>
              <div style={{ fontSize: mob ? 10 : 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", whiteSpace: "nowrap" }}>{s.l}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: mob ? 13 : 15, color: "#111827", marginTop: 2, whiteSpace: "nowrap" }}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Pros/Cons pills — borderRadius: 16 */}
        {(pros.length > 0 || cons.length > 0) && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "8px 0" }}>
            {pros.slice(0, 3).map((p, i) => (
              <span key={`p${i}`} style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "2px 8px", borderRadius: 16, fontSize: 12, fontWeight: 500,
                background: "#ecfdf5", color: "#047857",
              }}><Check size={10} /> {String(p).split("—")[0].trim().slice(0, 32)}</span>
            ))}
            {cons.slice(0, 2).map((c, i) => (
              <span key={`c${i}`} style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "2px 8px", borderRadius: 16, fontSize: 12, fontWeight: 500,
                background: "#fef2f2", color: "#b91c1c",
              }}><XIcon size={10} /> {String(c).split("—")[0].trim().slice(0, 32)}</span>
            ))}
          </div>
        )}

        {/* Expandable text block */}
        {fullText && (
          <div style={{ margin: "8px 0" }}>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "#374151", margin: 0 }}>
              {expanded ? fullText : shortText}{hasMore && !expanded ? "..." : ""}
            </p>
            {hasMore && (
              <button onClick={() => setExpanded(!expanded)} style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#059669", fontWeight: 700, fontSize: 13, padding: "6px 0",
                display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit",
              }}>
                {expanded ? "Show less" : "Read our full analysis"}
                <ChevronDown size={14} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
            )}
          </div>
        )}

        {/* Mobile CTAs — green gradient */}
        {mob && (
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{
              flex: 1, padding: "12px 16px", borderRadius: 10, textDecoration: "none", textAlign: "center",
              background: "linear-gradient(135deg, #059669, #047857)",
              color: "#fff", fontWeight: 700, fontSize: 15,
              boxShadow: "0 2px 8px rgba(5,150,105,0.25)",
              minHeight: 44,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}>
              <span>Visit {B.name}</span>
              {B.promo && <span style={{ fontSize: 11, fontWeight: 400, opacity: 0.8, marginTop: 2 }}>{B.promo}</span>}
            </a>
            <Link to={reviewPath} style={{
              flex: 1, padding: "12px 16px", borderRadius: 10, textDecoration: "none", textAlign: "center",
              background: "#fff", color: "#1f2937", border: "1.5px solid #cbd5e1",
              fontWeight: 600, fontSize: 14, minHeight: 44,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>Read Review</Link>
          </div>
        )}

        {/* Risk warning — always visible */}
        {B.riskWarning && (
          <div style={{ fontSize: 12, lineHeight: 1.4, color: "#94a3b8", marginTop: 8, textAlign: mob ? "left" : "center" }}>
            {B.riskWarning}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// БЛОК 6 — Spread Comparison Chart
// ═══════════════════════════════════════════════════════════
function SpreadChart({ brokers, mob }) {
  const top8 = brokers.slice(0, 8);
  const maxSpread = 1.2;
  return (
    <div role="img" aria-label="EUR/USD spread comparison chart" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {top8.map((broker, i) => {
        const spread = parseFloat(broker.B.avgSpread || broker.B.spread || "0.5");
        const pct = Math.min((spread / maxSpread) * 100, 100);
        return (
          <div key={broker.slug} style={{ display: "flex", alignItems: "center", gap: mob ? 8 : 12 }}>
            <div style={{ width: mob ? 90 : 140, flexShrink: 0, display: "flex", alignItems: "center", gap: 6 }}>
              <BrokerLogo slug={broker.slug} name={broker.B.name} fallback={broker.B.logo} size={20} shape="brand" />
              <span style={{ fontSize: mob ? 12 : 13, fontWeight: 600, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{broker.B.name}</span>
            </div>
            <div style={{ flex: 1, height: 26, background: "#f1f5f9", borderRadius: 6, overflow: "hidden", position: "relative" }}>
              <div style={{
                height: "100%", borderRadius: 6,
                width: `${Math.max(pct, 8)}%`,
                background: i === 0 ? "linear-gradient(90deg, #059669, #34d399)" : i < 3 ? "#60a5fa" : "#94a3b8",
                transition: "width 0.5s ease",
              }} />
              <span style={{
                position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                fontSize: 12, fontWeight: 700, color: "#0f172a",
              }}>{spread.toFixed(2)} pips</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}



// ═══════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════
export default function RankingProtoC() {
  const { mob, tab } = useMedia();
  const heroRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const rankingId = "forex-overall";
  const brokers = getBrokersForRanking(rankingId);
  const seo = SEO_CONTENT[rankingId] || {};
  const topBroker = brokers[0]?.B?.name || "IC Markets";
  const author = getAuthorForRanking("forex");
  const editor = getEditor();
  const reviewer = getReviewerForAuthor(author.id);
  const factChecker = getFactChecker(author.id);
  const educationData = getEducation(rankingId);

  // Related rankings for internal linking
  const ranking = { id: rankingId, category: "trading-style", sub: "overall", slug: "/best-forex-brokers", title: "Best Forex Brokers", icon: "trophy" };
  const related = [
    ...getRankingsBySub(ranking.category, ranking.sub).filter(r => r.id !== ranking.id),
    ...getRankingsByCategory(ranking.category).filter(r => r.sub !== ranking.sub && r.id !== ranking.id),
  ].slice(0, 6);

  const fillVars = (text) =>
    text?.replace(/\{year\}/g, YEAR).replace(/\{topBroker\}/g, topBroker).replace(/\{count\}/g, String(brokers.length)) || "";

  // Filter brokers
  const filteredBrokers = activeFilter === "all" ? brokers : brokers.filter(b => {
    const type = (b.B.type || "").toLowerCase();
    if (activeFilter === "ecn") return type.includes("ecn");
    if (activeFilter === "stp") return type.includes("stp");
    if (activeFilter === "mm") return type.includes("market");
    if (activeFilter === "low-spread") return parseFloat(b.B.spread || "1") <= 0.1;
    if (activeFilter === "regulated") return b.B.regs.some(r => r.tier === 1);
    return true;
  });

  // JSON-LD + meta (SEO critical)
  useEffect(() => {
    document.title = seo?.metaTitle || `Best Forex Brokers ${YEAR} | RatedBrokers`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && seo?.metaDesc) metaDesc.setAttribute("content", seo.metaDesc);

    const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: seo?.metaTitle || `Best Forex Brokers ${YEAR}`,
        description: seo?.metaDesc || "",
        datePublished: "2026-01-15",
        dateModified: new Date().toISOString().split("T")[0],
        author: {
          "@type": "Person",
          name: author.name,
          jobTitle: author.role,
          url: author.linkedin,
          sameAs: [author.linkedin],
          ...(author.credentials?.length ? {
            hasCredential: author.credentials.map(c => ({
              "@type": "EducationalOccupationalCredential",
              credentialCategory: "Professional Certification",
              name: c,
            })),
          } : {}),
        },
        publisher: {
          "@type": "Organization",
          name: "RatedBrokers",
          url: "https://ratedbrokers.com",
        },
      },
      breadcrumbSchema([
        { label: "RatedBrokers", path: "/" },
        { label: "Rankings", path: "/rankings" },
        { label: `Best Forex Brokers ${YEAR}`, path: "/best-forex-brokers" },
      ]),
      ...(seo.faq?.length ? [{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: seo.faq.map(f => ({
          "@type": "Question",
          name: fillVars(f.q),
          acceptedAnswer: { "@type": "Answer", text: fillVars(f.a) },
        })),
      }] : []),
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: seo?.metaTitle || `Best Forex Brokers ${YEAR}`,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        numberOfItems: brokers.length,
        itemListElement: brokers.map(({ B: br, slug: s }, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: br.name,
          url: `https://ratedbrokers.com/review/${s}`,
        })),
      },
    ];
    let scriptEl = document.querySelector('script[data-jsonld="ranking-proto"]');
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.type = "application/ld+json";
      scriptEl.setAttribute("data-jsonld", "ranking-proto");
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(jsonLd);

    return () => {
      const el = document.querySelector('script[data-jsonld="ranking-proto"]');
      if (el) el.remove();
    };
  }, []);

  // heroRef used for scroll anchoring

  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  return (
    <main style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", minHeight: "100vh" }}>

      {/* BREADCRUMB */}
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
          <h1 style={{
            fontFamily: "Outfit", fontWeight: 900,
            fontSize: mob ? 26 : tab ? 34 : 42,
            lineHeight: 1.1, color: "#fff", marginBottom: 8,
          }}>Best Forex Brokers {YEAR}</h1>
          <p style={{
            fontSize: mob ? 13 : 15, color: "rgba(255,255,255,0.75)",
            maxWidth: 540, margin: "0 auto 10px", lineHeight: 1.5,
          }}>
            {brokers.length} brokers independently tested across 130+ data points
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <AuthorCredits author={author} editor={editor} reviewer={reviewer} factChecker={factChecker} updatedDate={`March ${YEAR}`} variant="centered" onDark />
          </div>
        </header>
      </HeroBand>

{/* Disclosure moved below broker cards */}


      {/* ═══ БЛОК 1: Intro (compact, keyword first) ═══ */}
      <section style={{ ...cn, paddingTop: mob ? 14 : 18, paddingBottom: mob ? 14 : 18 }}>
        <p style={{ fontSize: mob ? 14 : 15, lineHeight: 1.7, color: "#374151", margin: 0 }}>
          Finding the <strong>best forex brokers in {YEAR}</strong> requires independent, data-driven testing — not marketing claims. After testing {brokers.length} brokers across 130+ data points, verifying regulatory licenses with FCA, ASIC, and CySEC, measuring live spreads during peak sessions, and processing real withdrawals, our research team ranked the platforms that deliver the best combination of low costs, fast execution, and strong regulation. Every broker listed holds at least one Tier-1 license and passed our live trading test.
        </p>
      </section>

      {/* ═══ БЛОК 2: Quick Broker Grid ═══ */}
      <section style={{ ...cn, paddingBottom: mob ? 16 : 20 }}>
        <h2 style={{ ...T.h2(mob), marginBottom: mob ? 8 : 10 }}>
          Top 10 at a Glance
        </h2>
        <QuickBrokerGrid brokers={brokers} mob={mob} />
      </section>

      {/* ═══ БЛОК 3: Key Finding + Text ═══ */}
      <section style={{ ...cn, paddingBottom: T.sectionGap(mob) }}>
        <div style={{
          padding: mob ? "20px" : "24px 32px", borderRadius: 16,
          background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
          border: "1px solid #a7f3d0",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <CircleCheck size={20} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 16, color: "#065f46", marginBottom: 6 }}>Key Finding</div>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "#065f46", margin: 0 }}>
                {fillVars(seo.keyFinding || `After 200+ hours of testing across ${brokers.length} brokers, ${topBroker} earned our top overall ranking for ${YEAR} with raw spreads from 0.0 pips, average execution under 40ms, and regulation by ASIC and CySEC. Pepperstone and XM round out the top three.`)}
              </p>
            </div>
          </div>
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: "#374151", marginTop: 16 }}>
          Our methodology weighs eight categories: spreads and trading costs (20%), execution quality (15%), platform and tools (15%), regulation and safety (15%), deposits and withdrawals (10%), customer support (10%), instrument range (10%), and education (5%). We opened live accounts at every broker, deposited real funds, executed trades during high-volatility events like NFP releases and ECB meetings, and tested withdrawal processing times. Spreads were measured across 28 currency pairs during London–New York overlap sessions. Each regulatory license was verified directly with the issuing authority. Read our <Link to="/methodology" style={{ color: "#059669", fontWeight: 600 }}>full methodology</Link> for details.
        </p>
      </section>

{/* Quick Summary: Top 3 removed — duplicates Quick Grid + broker cards (SEO: HCU filler risk) */}

      {/* ═══ БЛОК 4: Filter Buttons ═══ */}
      <section style={{ ...cn, paddingBottom: 12 }}>
        <h2 style={{ ...T.h2(mob), marginBottom: mob ? 8 : 12 }}>
          All Best Forex Brokers {YEAR}
        </h2>
        <FilterButtons activeFilter={activeFilter} setActiveFilter={setActiveFilter} brokers={brokers} mob={mob} />
        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
          Showing {filteredBrokers.length} of {brokers.length} brokers
        </div>
      </section>

      {/* ═══ БЛОК 5: Broker Cards (production BrokerRankCard) ═══ */}
      <section style={{ ...cn, paddingBottom: T.sectionGap(mob) }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredBrokers.map((broker, i) => (
            <BrokerRankCard
              key={broker.slug}
              broker={broker}
              rank={i + 1}
              thematic={getBrokerBlurb(rankingId, broker.slug, broker)}
              rankingSlug={rankingId}
            />
          ))}
        </div>
      </section>

      {/* ═══ БЛОК 6: Spread Chart ═══ */}
      <section style={{ ...cn, paddingBottom: T.sectionGap(mob) }}>
        <div style={{ ...T.cardBg, padding: T.cardPad(mob) }}>
          <h2 style={{ ...T.h2(mob), marginBottom: 6 }}>
            Spread Comparison: Top Brokers vs Industry Average
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "#374151", marginBottom: 16 }}>
            Spreads are the primary cost for most forex traders. We measured average EUR/USD spreads across all {brokers.length} brokers during peak London–New York overlap sessions. Raw/ECN accounts with commissions are converted to total cost per lot for fair comparison.
          </p>
          <SpreadChart brokers={brokers} mob={mob} />
        </div>
      </section>

      {/* ═══ БЛОК 7: Comparison Table (с CTA) ═══ */}
      <section style={{ ...cn, paddingBottom: T.sectionGap(mob) }}>
        <div style={{ ...T.cardBg, padding: T.cardPad(mob) }}>
          <h2 style={{ ...T.h2(mob), marginBottom: 6 }}>
            Forex Broker Comparison {YEAR}
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "#374151", marginBottom: 16 }}>
            Side-by-side comparison of regulation, costs, and key features. For detailed head-to-head analysis, visit our <Link to="/compare" style={{ color: "#059669", fontWeight: 600 }}>comparison tool</Link>.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%", borderCollapse: "collapse", minWidth: mob ? 600 : undefined,
              borderRadius: 8, overflow: "hidden",
            }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  {["Broker", "Score", "Spread", "Min Dep.", "Leverage", "Regulation", ""].map(h => (
                    <th key={h} style={{
                      padding: "10px 12px", textAlign: h === "" ? "center" : "left",
                      fontSize: 11, fontWeight: 700, color: "#64748b",
                      textTransform: "uppercase",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {brokers.slice(0, 10).map((broker, i) => (
                  <tr key={broker.slug} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 ? "#fafbfc" : "#fff" }}>
                    <td style={{ padding: "10px 12px" }}>
                      <Link to={`/review/${broker.slug}`} style={{
                        display: "flex", alignItems: "center", gap: 6,
                        textDecoration: "none", color: "#0f172a",
                      }}>
                        <BrokerLogo slug={broker.slug} name={broker.B.name} fallback={broker.B.logo} size={22} shape="brand" />
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{broker.B.name}</span>
                      </Link>
                    </td>
                    <td style={{ padding: "10px 12px" }}><ScoreBadge score={broker.B.score} size="sm" /></td>
                    <td style={{ padding: "10px 12px", fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>{broker.B.spread} pips</td>
                    <td style={{ padding: "10px 12px", fontSize: 13 }}>{broker.B.minDep === 0 ? "$0" : `$${broker.B.minDep}`}</td>
                    <td style={{ padding: "10px 12px", fontSize: 13 }}>{broker.B.leverage}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12 }}>{broker.B.regs.map(r => r.name).join(", ")}</td>
                    <td style={{ padding: "10px 8px", textAlign: "center" }}>
                      <a href={makeVisitUrl(broker.slug, broker.B.url)} target="_blank" rel="noopener nofollow sponsored" style={{
                        padding: "6px 14px", borderRadius: 6,
                        background: "#059669", color: "#fff",
                        fontWeight: 700, fontSize: 12,
                        textDecoration: "none", whiteSpace: "nowrap",
                      }}>Visit →</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══ БЛОК 8: Educational Content ═══ */}
      {educationData ? (
        <section style={{ ...cn, paddingBottom: T.sectionGap(mob) }}>
          <div style={{ ...T.cardBg, padding: T.cardPad(mob) }}>
            <h2 style={{ ...T.h2(mob), marginBottom: 8 }}>
              {educationData.title}
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "#1f2937", marginBottom: 20 }}>
              {educationData.intro}
            </p>
            {educationData.points && (
              <div style={{ marginBottom: 24 }}>
                {educationData.points.map((pt, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                    <CircleCheck size={16} color="#059669" style={{ flexShrink: 0, marginTop: 4 }} />
                    <p style={{ fontSize: 15, lineHeight: 1.7, color: "#1f2937", margin: 0 }}>
                      <strong>{pt.bold}</strong> {pt.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {educationData.sections?.map((sec, si) => (
              <div key={si} style={{ marginBottom: 28, paddingTop: 20, borderTop: "1px solid #f1f5f9" }}>
                <h3 style={{ ...T.h3(mob), marginBottom: 12 }}>{sec.heading}</h3>
                {sec.paragraphs?.map((p, pi) => (
                  <p key={pi} style={{ fontSize: 15, lineHeight: 1.75, color: "#1f2937", marginBottom: 12 }}>{p}</p>
                ))}
                {sec.points && (
                  <div style={{ marginTop: 8 }}>
                    {sec.points.map((pt, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                        <CircleCheck size={14} color="#059669" style={{ flexShrink: 0, marginTop: 4 }} />
                        <p style={{ fontSize: 15, lineHeight: 1.7, color: "#1f2937", margin: 0 }}>
                          <strong>{pt.bold}</strong> {pt.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {sec.tip && (
                  <div style={{
                    marginTop: 16, padding: mob ? "16px" : "20px 24px", borderRadius: 12,
                    background: "linear-gradient(135deg, #eff6ff, #dbeafe)", border: "1px solid #93c5fd",
                  }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#1e40af", marginBottom: 6 }}>Pro Tip</div>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: "#1e3a5f", margin: 0 }}>{sec.tip}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : (
        /* Fallback Block 8 if no education data */
        <section style={{ ...cn, paddingBottom: T.sectionGap(mob) }}>
          <div style={{ ...T.cardBg, padding: T.cardPad(mob) }}>
            <h2 style={{ ...T.h2(mob), marginBottom: 12 }}>
              What to Look For in a Forex Broker
            </h2>
            {[
              { h: "Regulation Is Non-Negotiable", t: "Only trade with brokers holding Tier-1 licenses from FCA, ASIC, CySEC, or SEC. These regulators enforce segregated client funds, negative balance protection, and participation in compensation schemes up to £85,000 (FCA) or €20,000 (CySEC). We verified every license number directly with the relevant authority." },
              { h: "Compare Total Cost, Not Just Spreads", t: "A broker advertising 0.0 pip spreads with a $7/lot commission may be cheaper than one offering 1.0 pips with no commission — but only if you trade frequently. Calculate your monthly cost based on your actual trading volume. Factor in swap rates for overnight positions and withdrawal fees." },
              { h: "Test Execution Under Pressure", t: "Platform stability during high-impact news events separates reliable brokers from unreliable ones. We tested during NFP, ECB announcements, and flash crashes. Brokers that requoted, slipped excessively, or froze during volatility didn't make our top 10." },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: i < 2 ? 16 : 0 }}>
                <h3 style={{ ...T.h3(mob), marginBottom: 4 }}>{item.h}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#374151", margin: 0 }}>{item.t}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* HOW WE RANKED */}
      {seo.howWeRanked && (
        <section style={{ ...cn, paddingBottom: T.sectionGap(mob) }}>
          <div style={{ ...T.cardBg, padding: T.cardPad(mob) }}>
            <h2 style={{ ...T.h2(mob), marginBottom: 12 }}>
              How We Ranked These Brokers
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "#1f2937", margin: 0 }}>
              {fillVars(seo.howWeRanked)}
            </p>
          </div>
        </section>
      )}

      {/* RELATED RANKINGS (internal linking — critical for topical authority) */}
      {related.length > 0 && (
        <section style={{ ...cn, paddingBottom: T.sectionGap(mob) }}>
          <h2 style={{ ...T.h2(mob), marginBottom: 16 }}>Related Rankings</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr 1fr",
            gap: 12,
          }}>
            {related.map(r => (
              <Link key={r.id} to={r.slug} style={{
                ...T.cardBg, padding: "16px 20px",
                textDecoration: "none", color: "#111827",
                display: "flex", alignItems: "center", gap: 12,
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#059669"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(5,150,105,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <Icon name={r.icon} size={20} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                    {r.category} / {r.sub}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {seo.faq && seo.faq.length > 0 && (
        <section style={{ ...cn, paddingBottom: T.sectionGap(mob) }}>
          <h2 style={{ ...T.h2(mob), marginBottom: 16 }}>
            Frequently Asked Questions
          </h2>
          <Accordion
            items={seo.faq.slice(0, 6).map(item => ({ q: fillVars(item.q), a: fillVars(item.a) }))}
            expanded={openFaq}
            setExpanded={setOpenFaq}
          />
        </section>
      )}

      {/* METHODOLOGY CTA */}
      <section style={{ ...cn, paddingBottom: T.sectionGap(mob) }}>
        <div style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #047857 100%)",
          borderRadius: 16, padding: mob ? "28px 20px" : "36px 36px", textAlign: "center",
        }}>
          <h3 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 24, color: "#fff", marginBottom: 8 }}>How We Test Brokers</h3>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", maxWidth: 500, margin: "0 auto 20px", lineHeight: 1.6 }}>
            Our team verifies licenses, analyzes 130+ data points per broker, and cross-checks conditions across independent sources to give you rankings you can trust.
          </p>
          <Link to="/methodology" style={{
            display: "inline-block", padding: "12px 28px", borderRadius: 10,
            background: "linear-gradient(135deg,#059669,#34d399)",
            color: "#fff", fontFamily: "Outfit", fontWeight: 700,
            fontSize: 15, textDecoration: "none",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(5,150,105,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
          >Read Our Methodology</Link>
        </div>
      </section>

      {/* AUTHOR BIO */}
      <section style={{ ...cn, paddingBottom: T.sectionGap(mob) }}>
        <AuthorBioCard author={author} />
      </section>

      {/* DISCLOSURE (bottom — FTC/ASA requirement) */}
      <section style={{ ...cn, paddingBottom: mob ? 40 : 60 }}>
        <AffiliateDisclosureBanner />
      </section>

{/* Sticky bar removed */}
    </main>
  );
}
