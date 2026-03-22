/**
 * RankingPage — production template for all 207 rankings
 * Structure (8 blocks from ProtoC audit):
 *
 * Блок 1: Intro (compact, keyword-first — from seo.intro)
 * Блок 2: Quick Broker Grid (Top 10 at a Glance)
 * Блок 3: Key Finding + methodology text
 * Блок 4: Filter buttons (pill-shaped + count)
 * Блок 5: Broker cards (filtered, BrokerRankCard)
 * Блок 6: Spread Chart (horizontal bar)
 * Блок 7: Comparison table (with CTA)
 * Блок 8: Education (thematic or fallback)
 * + In-Depth Reviews (country only), Related Rankings, FAQ, JSON-LD
 */
import { useState, useEffect, useRef } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { useLocalePath } from "../i18n/useLocalePath";
import RANKINGS, { getRankingBySlug, getRankingsByCategory, getRankingsBySub } from "../data/rankings";
import { getBrokersForRanking } from "../data/rankingFilters";
import SEO_CONTENT from "../data/rankingSeoContent";
import { getThematicData, getBrokerBlurb, getComparisonCols, getEducation } from "../data/rankingThematic";
import BrokerRankCard from "../components/BrokerRankCard";
import ScoreBadge from "../components/ScoreBadge";
import Accordion from "../components/Accordion";
import AffiliateDisclosureBanner from "../components/AffiliateDisclosureBanner";
import { getAuthorForRanking, getFactChecker, getReviewerForAuthor, getEditor } from "../data/authors";
import AuthorCredits from "../components/AuthorCredits";
import AuthorBioCard from "../components/AuthorBioCard";
import Breadcrumb, { breadcrumbSchema } from "../components/Breadcrumb";
import Icon, { ArrowRight, CircleCheck, Check, X as XIcon } from "../components/Icon";
import BrokerLogo from "../components/BrokerLogo";
import RegBadge from "../components/RegBadge";
import HeroBand from "../components/HeroBand";
import { getCountryData } from "../data/countries/index";
import { canonicalPair } from "../data/comparisons";
import { Star, ChevronRight, Trophy, BarChart3, Layers, BookOpen, HelpCircle, Target, ChevronDown, User } from "lucide-react";

const YEAR = "2026";
const apiBase = import.meta.env.VITE_API_URL || "";
const makeVisitUrl = (slug, fallbackUrl) => apiBase ? `${apiBase}/go/${slug}` : fallbackUrl;

// ═══════════════════════════════════════════════════════════
// Design tokens
// ═══════════════════════════════════════════════════════════
const T = {
  h2: (mob) => ({ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 26, color: "#0f172a" }),
  h3: (mob) => ({ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 16 : 18, color: "#0f172a" }),
  sectionGap: (mob) => mob ? 24 : 32,
  cardBg: { background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0" },
  cardPad: (mob) => mob ? "20px 16px" : "28px 32px",
};

// ═══════════════════════════════════════════════════════════
// БЛОК 2 — Quick Broker Grid (Top 10 at a Glance)
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

  const renderCard = (broker, i) => {
    const B = broker.B;
    const visitUrl = makeVisitUrl(broker.slug, B.url);
    const isHovered = hoveredIdx === i;
    const shortRisk = getRisk(B);
    const isMedal = i < 3;
    const badgeStyle = isMedal
      ? { bg: "linear-gradient(135deg, #059669, #047857)", shadow: "0 2px 6px rgba(5,150,105,0.25)", color: "#fff" }
      : { bg: "#f1f5f9", shadow: "none", color: "#64748b" };
    const logoSize = mob ? 40 : 40;
    const nameSize = mob ? 15 : 15;
    const scoreSize = mob ? 14 : 15;
    const badgeSize = mob ? 28 : 28;

    return (
      <a key={broker.slug} href={visitUrl} target="_blank" rel="noopener nofollow sponsored"
        onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}
        onTouchStart={(e) => { e.currentTarget.style.borderColor = "#059669"; e.currentTarget.style.background = "#f0fdf4"; }}
        onTouchEnd={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#fff"; }}
        style={{
          display: "flex", alignItems: "center", gap: mob ? 10 : 14,
          padding: mob ? "12px 14px" : "12px 16px",
          borderRadius: 14, background: "#fff",
          border: `1px solid ${isHovered ? "#059669" : "#e5e7eb"}`,
          boxShadow: isHovered ? "0 4px 16px rgba(0,0,0,0.07)" : "0 1px 3px rgba(0,0,0,0.04)",
          textDecoration: "none", transition: "box-shadow 0.2s, border-color 0.2s, background 0.15s", cursor: "pointer",
        }}>
        <div style={{
          width: badgeSize, height: mob ? 40 : badgeSize, borderRadius: 8, flexShrink: 0,
          background: badgeStyle.bg, boxShadow: badgeStyle.shadow,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: mob ? 12 : 12, fontWeight: isMedal ? 800 : 700, color: badgeStyle.color,
        }}>{i + 1}</div>
        <BrokerLogo slug={broker.slug} name={B.name} fallback={B.logo} size={logoSize} shape="icon" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: 600, fontSize: nameSize, color: "#0f172a",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{B.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
            <Star size={12} color="#059669" fill="#059669" />
            <span style={{ fontSize: scoreSize, fontWeight: 700, color: "#059669", lineHeight: 1 }}>{B.score}</span>
            <span style={{ fontSize: 11, color: "#9ca3af" }}>/10</span>
          </div>
          <div style={{
            fontSize: 10, color: "#b0b8c4", lineHeight: 1.2, marginTop: 2,
            height: mob ? "auto" : 13, overflow: "hidden",
            whiteSpace: "nowrap", textOverflow: "ellipsis",
            opacity: mob ? 1 : (isHovered ? 1 : 0), transition: "opacity 0.2s",
          }}>{shortRisk}</div>
        </div>
        <ChevronRight size={16} color={mob ? "#94a3b8" : (isHovered ? "#059669" : "#cbd5e1")} style={{
          flexShrink: 0, transition: "color 0.2s, transform 0.2s",
          transform: isHovered ? "translateX(2px)" : "none",
        }} />
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
      gap: mob ? 8 : 8,
    }}>
      {top10.map((broker, i) => renderCard(broker, i))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// БЛОК 4 — Filter Buttons
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
    <div style={{ display: "flex", gap: mob ? 6 : 8, flexWrap: "wrap", padding: "4px 0" }}>
      {filters.map(f => {
        const isActive = activeFilter === f.id;
        return (
          <button key={f.id} onClick={() => setActiveFilter(f.id)} style={{
            padding: mob ? "8px 14px" : "8px 20px", borderRadius: 20,
            border: isActive ? "1.5px solid #0f172a" : "1.5px solid #e2e8f0",
            cursor: "pointer", fontSize: mob ? 13 : 14, fontWeight: 600,
            background: isActive ? "#0f172a" : "#fff",
            color: isActive ? "#fff" : "#374151",
            transition: "all 0.15s", display: "inline-flex", alignItems: "center", gap: 4,
            fontFamily: "inherit",
          }}>
            {f.label}
            <span style={{ fontSize: 11, opacity: 0.6 }}>({counts[f.id]})</span>
          </button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// БЛОК 6 — Spread Chart
// ═══════════════════════════════════════════════════════════
function SpreadChart({ brokers, mob }) {
  const top8 = brokers.slice(0, 8);
  const maxSpread = 1.2;
  return (
    <div role="img" aria-label="Spread comparison chart" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {top8.map((broker, i) => {
        const spread = parseFloat(broker.B.avgSpread || broker.B.spread || "0.5");
        const pct = Math.min((spread / maxSpread) * 100, 100);
        return (
          <div key={broker.slug} style={{ display: "flex", alignItems: "center", gap: mob ? 8 : 12 }}>
            <div style={{ width: mob ? 90 : 140, flexShrink: 0, display: "flex", alignItems: "center", gap: 6 }}>
              <BrokerLogo slug={broker.slug} name={broker.B.name} fallback={broker.B.logo} size={20} shape="icon" />
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
// TABLE OF CONTENTS — Dark Navigation Strip
// ═══════════════════════════════════════════════════════════
function TableOfContents({ items, mob }) {
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || mob) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [mob, items]);

  const nudge = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 200, behavior: "smooth" });
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
    if (mob) setOpen(false);
  };

  const iconMap = { Trophy, BarChart3, Layers, BookOpen, HelpCircle, Target, User, ChevronRight };
  const getIcon = (name, size, color) => {
    const C = iconMap[name];
    return C ? <C size={size} color={color} /> : null;
  };

  const stripBg = "linear-gradient(135deg, #0a1225 0%, #0b2019 50%, #035c43 100%)";

  const arrowBtn = (dir) => (
    <button onClick={() => nudge(dir)} aria-label={dir < 0 ? "Scroll left" : "Scroll right"} style={{
      position: "absolute", top: "50%", transform: "translateY(-50%)",
      [dir < 0 ? "left" : "right"]: 0, zIndex: 3,
      width: 32, height: 32, borderRadius: "50%",
      background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", transition: "background 0.15s",
      backdropFilter: "blur(4px)",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(52,211,153,0.2)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
    >
      <ChevronRight size={16} color="rgba(255,255,255,0.8)" style={{
        transform: dir < 0 ? "rotate(180deg)" : "none",
      }} />
    </button>
  );

  // Desktop: horizontal pills on dark strip with scroll arrows
  if (!mob) {
    const visible = items.filter(it => it.type !== "subsection");
    return (
      <div style={{
        background: stripBg,
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative",
        }}>
          {canScrollLeft && arrowBtn(-1)}
          {canScrollRight && arrowBtn(1)}
          {/* Left fade mask */}
          {canScrollLeft && <div style={{
            position: "absolute", left: 24, top: 0, bottom: 0, width: 40, zIndex: 2,
            background: "linear-gradient(90deg, #0a1225 0%, transparent 100%)",
            pointerEvents: "none",
          }} />}
          {/* Right fade mask */}
          {canScrollRight && <div style={{
            position: "absolute", right: 24, top: 0, bottom: 0, width: 40, zIndex: 2,
            background: "linear-gradient(270deg, #035c43 0%, transparent 100%)",
            pointerEvents: "none",
          }} />}
          <nav aria-label="Table of Contents">
            <ol ref={scrollRef} style={{
              listStyle: "none", margin: 0, padding: "14px 0",
              display: "flex", gap: 6, overflowX: "auto", flexWrap: "nowrap",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}>
              {visible.map((it) => (
                <li key={it.id} style={{ flexShrink: 0 }}>
                  <a href={`#${it.id}`} onClick={(e) => { e.preventDefault(); scrollTo(it.id); }}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "7px 14px", borderRadius: 20, whiteSpace: "nowrap",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 600,
                      textDecoration: "none", transition: "all 0.15s", cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#34d399";
                      e.currentTarget.style.color = "#34d399";
                      e.currentTarget.style.background = "rgba(52,211,153,0.10)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    }}
                  >
                    {getIcon(it.icon, 13, "rgba(255,255,255,0.45)")}
                    <span>{it.label}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    );
  }

  // Mobile: collapsible on dark strip
  return (
    <div style={{
      background: stripBg,
      borderTop: "1px solid rgba(255,255,255,0.06)",
    }}>
      <nav aria-label="Table of Contents" style={{
        maxWidth: 1200, margin: "0 auto",
      }}>
        <button onClick={() => setOpen(!open)} style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 16px", background: "none", border: "none", cursor: "pointer",
          fontFamily: "inherit",
        }}>
          <span style={{
            fontFamily: "Outfit", fontWeight: 700, fontSize: 14,
            color: "rgba(255,255,255,0.8)", letterSpacing: "0.01em",
          }}>
            In This Guide
          </span>
          <ChevronDown size={16} color="rgba(255,255,255,0.5)" style={{
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }} />
        </button>
        {open && (
          <ol style={{
            listStyle: "none", margin: 0, padding: "0 12px 14px",
            display: "flex", flexDirection: "column", gap: 1,
          }}>
            {items.map((it) => {
              const isSub = it.type === "subsection";
              return (
                <li key={it.id}>
                  <a href={`#${it.id}`} onClick={(e) => { e.preventDefault(); scrollTo(it.id); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "9px 12px", borderRadius: 8,
                      paddingLeft: isSub ? 32 : 12,
                      color: isSub ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.8)",
                      fontSize: isSub ? 13 : 14,
                      fontWeight: isSub ? 500 : 600,
                      textDecoration: "none", transition: "background 0.15s",
                    }}
                    onTouchStart={(e) => { e.currentTarget.style.background = "rgba(52,211,153,0.10)"; }}
                    onTouchEnd={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    {getIcon(it.icon, isSub ? 12 : 13, isSub ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.45)")}
                    <span>{it.label}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        )}
      </nav>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════
export default function RankingPage() {
  const { slug } = useParams();
  const { mob, tab } = useMedia();
  const lp = useLocalePath();
  const [openFaq, setOpenFaq] = useState(null);
  const [openThematicFaq, setOpenThematicFaq] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const heroRef = useRef(null);

  const fullSlug = "/" + slug;
  const ranking = getRankingBySlug(fullSlug);

  // JSON-LD + meta
  useEffect(() => {
    if (ranking) {
      const seo = SEO_CONTENT[ranking.id];
      document.title = seo?.metaTitle || `${ranking.title} ${YEAR}`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && seo?.metaDesc) metaDesc.setAttribute("content", seo.metaDesc);

      const a = getAuthorForRanking(ranking.category);
      const brokersForSchema = getBrokersForRanking(ranking.id);
      const topName = brokersForSchema[0]?.B?.name || "IC Markets";
      const fv = (t) => t.replace(/\{year\}/g, YEAR).replace(/\{topBroker\}/g, topName).replace(/\{count\}/g, String(brokersForSchema.length));
      const jsonLd = [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: seo?.metaTitle || `${ranking.title} ${YEAR}`,
          description: seo?.metaDesc || "",
          datePublished: "2026-01-15",
          dateModified: new Date().toISOString().split("T")[0],
          author: {
            "@type": "Person",
            name: a.name,
            jobTitle: a.role,
            url: a.linkedin,
            sameAs: [a.linkedin],
            ...(a.credentials?.length ? {
              hasCredential: a.credentials.map(c => ({
                "@type": "EducationalOccupationalCredential",
                credentialCategory: "Professional Certification",
                name: c,
              })),
            } : {}),
            ...(a.specialty ? { knowsAbout: a.specialty.split(", ") } : {}),
            ...(a.image ? { image: `https://ratedbrokers.com${a.image}` } : {}),
          },
          publisher: {
            "@type": "Organization",
            name: "RatedBrokers",
            url: "https://ratedbrokers.com",
          },
        },
        breadcrumbSchema([
          { label: "RatedBrokers", path: "/" },
          { label: "Forex Brokers", path: "/best-forex-brokers" },
          { label: `${ranking.title} ${YEAR}`, path: fullSlug },
        ]),
        ...(seo?.faq?.length ? [{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: seo.faq.map((f) => ({
            "@type": "Question",
            name: fv(f.q),
            acceptedAnswer: { "@type": "Answer", text: fv(f.a) },
          })),
        }] : []),
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: seo?.metaTitle || `${ranking.title} ${YEAR}`,
          itemListOrder: "https://schema.org/ItemListOrderDescending",
          numberOfItems: brokersForSchema.length,
          itemListElement: brokersForSchema.map(({ B: br, slug: s }, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: br.name,
            url: `https://ratedbrokers.com/review/${s}`,
          })),
        },
      ];
      let scriptEl = document.querySelector('script[data-jsonld="ranking"]');
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.type = "application/ld+json";
        scriptEl.setAttribute("data-jsonld", "ranking");
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    }
    window.scrollTo(0, 0);
    setActiveFilter("all");
    return () => {
      const el = document.querySelector('script[data-jsonld="ranking"]');
      if (el) el.remove();
    };
  }, [ranking]);

  if (!ranking) return <Navigate to="/" replace />;

  const brokers = getBrokersForRanking(ranking.id);
  const seo = SEO_CONTENT[ranking.id] || {};
  const topBroker = brokers[0]?.B?.name || "IC Markets";
  const author = getAuthorForRanking(ranking.category);
  const editor = getEditor();
  const reviewer = getReviewerForAuthor(author.id);
  const factChecker = getFactChecker(author.id);

  const fillVars = (text) =>
    text
      ?.replace(/\{year\}/g, YEAR)
      .replace(/\{topBroker\}/g, topBroker)
      .replace(/\{count\}/g, String(brokers.length)) || "";

  // Related rankings
  const related = [
    ...getRankingsBySub(ranking.category, ranking.sub).filter((r) => r.id !== ranking.id),
    ...getRankingsByCategory(ranking.category).filter((r) => r.sub !== ranking.sub && r.id !== ranking.id),
  ].slice(0, 6);

  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  // Country-specific data
  const countrySlug = ranking.category === "country"
    ? ranking.slug.replace("/best-forex-brokers-", "")
    : null;
  const countryData = countrySlug ? getCountryData(countrySlug) : null;
  const countryBrokerMap = {};
  if (countryData?.brokers) {
    countryData.brokers.forEach((cb) => {
      if (cb.countryReview) countryBrokerMap[cb.slug] = cb;
    });
  }

  // Thematic data
  const thematicData = getThematicData(ranking.id);
  const educationData = getEducation(ranking.id);
  const compCols = getComparisonCols(ranking.id);
  const compData = thematicData?.comparisonData || null;

  // TOC items — order matches actual page flow (Block 2→3→5→6→7→8→FAQ)
  const tocItems = [
    { id: "top-brokers", label: `Top ${Math.min(brokers.length, 10)} ${ranking.title}`, icon: "Trophy", type: "section" },
    ...(seo.keyFinding ? [{ id: "key-finding", label: "Key Finding & How We Ranked", icon: "Target", type: "section" }] : []),
    ...brokers.slice(0, 5).map((b, i) => ({
      id: `broker-${b.slug}`, label: `#${i + 1} ${b.B.name}`, icon: "User", type: "broker",
    })),
    { id: "spread-chart", label: "Spread Comparison Chart", icon: "BarChart3", type: "section" },
    { id: "comparison-table", label: "Side-by-Side Comparison", icon: "Layers", type: "section" },
    { id: "education", label: educationData?.title || "What to Look For When Choosing a Broker", icon: "BookOpen", type: "section" },
    ...(educationData?.sections?.map((sec, si) => ({
      id: `education-${si}`, label: sec.heading, icon: "ChevronRight", type: "subsection",
    })) || []),
    ...((educationData?.faq?.length || (seo.faq?.length && !educationData?.faq?.length))
      ? [{ id: "faq", label: "Frequently Asked Questions", icon: "HelpCircle", type: "section" }] : []),
  ];

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

  return (
    <main style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", minHeight: "100vh" }}>

      {/* BREADCRUMBS */}
      <div style={{ ...cn, padding: mob ? "10px 16px" : "14px 24px" }}>
        <Breadcrumb items={[
          { label: "RatedBrokers", path: "/" },
          { label: "Forex Brokers", path: "/best-forex-brokers" },
          { label: ranking.title },
        ]} />
      </div>

      {/* HERO */}
      <HeroBand mob={mob} tab={tab}>
        <header ref={heroRef} style={{ textAlign: "center" }}>
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: mob ? 56 : 72, height: mob ? 56 : 72, borderRadius: 16, background: "rgba(255,255,255,0.1)", marginBottom: 14 }}>
            <Icon name={ranking.icon} size={mob ? 28 : 36} color="#34d399" />
          </span>
          <h1 style={{
            fontFamily: "Outfit", fontWeight: 900,
            fontSize: mob ? 26 : tab ? 34 : 42,
            lineHeight: 1.1, color: "#fff", marginBottom: 8,
          }}>
            {ranking.title} {YEAR}
          </h1>
          <p style={{
            fontSize: mob ? 14 : 15, color: "rgba(255,255,255,0.75)",
            maxWidth: 540, margin: "0 auto 10px", lineHeight: 1.5,
          }}>
            {brokers.length} brokers independently tested across 130+ data points
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <AuthorCredits author={author} editor={editor} reviewer={reviewer} factChecker={factChecker} updatedDate={`March ${YEAR}`} variant="centered" onDark />
          </div>
        </header>
      </HeroBand>

      {/* ═══ TOC: Table of Contents (dark strip, visual continuation of hero) ═══ */}
      <TableOfContents items={tocItems} mob={mob} />

      {/* ═══ БЛОК 1: Intro (compact, from seo.intro) ═══ */}
      {seo.intro && (
        <section style={{ ...cn, paddingTop: mob ? 14 : 18, paddingBottom: mob ? 14 : 18 }}>
          {seo.intro.map((p, i) => (
            <p key={i} style={{
              fontSize: 15, lineHeight: 1.7, color: "#374151",
              marginBottom: i < seo.intro.length - 1 ? 12 : 0,
            }}>
              {fillVars(p)}
            </p>
          ))}
        </section>
      )}

      {/* ═══ БЛОК 2: Quick Broker Grid ═══ */}
      <section id="top-brokers" style={{ ...cn, paddingBottom: mob ? 16 : 20 }}>
        <h2 style={{ ...T.h2(mob), marginBottom: mob ? 8 : 10 }}>
          Top 10 at a Glance
        </h2>
        <QuickBrokerGrid brokers={brokers} mob={mob} />
      </section>

      {/* ═══ БЛОК 3: Key Finding + text ═══ */}
      {seo.keyFinding && (
        <section id="key-finding" style={{ ...cn, paddingBottom: T.sectionGap(mob) }}>
          <div style={{
            display: "flex", borderRadius: 12, overflow: "hidden",
            background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0a2e3d 100%)",
          }}>
            {/* Orange accent bar */}
            <div style={{
              width: mob ? 4 : 5, flexShrink: 0,
              background: "linear-gradient(180deg, #f59e0b, #fbbf24)",
            }} />
            <div style={{ flex: 1, padding: mob ? "20px 16px" : "28px 32px" }}>
              {/* Label */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                marginBottom: 12,
              }}>
                <CircleCheck size={14} color="#f59e0b" />
                <span style={{
                  fontFamily: "Outfit", fontWeight: 700, fontSize: 11,
                  color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.12em",
                }}>Key Finding</span>
              </div>
              {/* Finding text */}
              <p style={{
                fontSize: mob ? 15 : 17, lineHeight: 1.7,
                color: "#fff", margin: 0, fontWeight: 400,
                maxWidth: 900,
              }}>
                {fillVars(seo.keyFinding)}
              </p>
            </div>
          </div>
          {seo.howWeRanked && (
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "#374151", marginTop: 16 }}>
              {fillVars(seo.howWeRanked)}{" "}
              Read our <Link to={lp("/methodology")} style={{ color: "#059669", fontWeight: 600 }}>full methodology</Link> for details.
            </p>
          )}
        </section>
      )}

      {/* ═══ БЛОК 4: Filter Buttons + heading ═══ */}
      <section style={{ ...cn, paddingBottom: 12 }}>
        <h2 style={{ ...T.h2(mob), marginBottom: mob ? 8 : 12 }}>
          All {ranking.title} {YEAR}
        </h2>
        <FilterButtons activeFilter={activeFilter} setActiveFilter={setActiveFilter} brokers={brokers} mob={mob} />
        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
          Showing {filteredBrokers.length} of {brokers.length} brokers
        </div>
      </section>

      {/* ═══ БЛОК 5: Broker Cards (filtered) ═══ */}
      <section style={{ ...cn, paddingBottom: T.sectionGap(mob) }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredBrokers.map((b, i) => (
            <div key={b.slug} id={`broker-${b.slug}`}>
              <BrokerRankCard
                broker={b}
                rank={i + 1}
                thematic={getBrokerBlurb(ranking.id, b.slug, b)}
                rankingSlug={ranking.slug}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ═══ БЛОК 6: Spread Chart ═══ */}
      <section id="spread-chart" style={{ ...cn, paddingBottom: T.sectionGap(mob) }}>
        <div style={{ ...T.cardBg, padding: T.cardPad(mob) }}>
          <h2 style={{ ...T.h2(mob), marginBottom: 6 }}>
            Spread Comparison: Top Brokers
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "#374151", marginBottom: 16 }}>
            Spreads are a primary cost for traders. We measured average spreads across all {brokers.length} brokers during peak trading sessions. Raw/ECN accounts with commissions are converted to total cost per lot for fair comparison.
          </p>
          <SpreadChart brokers={brokers} mob={mob} />
        </div>
      </section>

      {/* ═══ БЛОК 7: Comparison Table (with CTA) ═══ */}
      <section id="comparison-table" style={{ ...cn, paddingBottom: T.sectionGap(mob) }}>
        <div style={{ ...T.cardBg, padding: T.cardPad(mob) }}>
          <h2 style={{ ...T.h2(mob), marginBottom: 6 }}>
            {countryData ? `${countryData.name} Broker` : ranking.title} Comparison {YEAR}
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "#374151", marginBottom: 16 }}>
            Side-by-side comparison of regulation, costs, and key features. For detailed head-to-head analysis, visit our <Link to={lp("/compare")} style={{ color: "#059669", fontWeight: 600 }}>comparison tool</Link>.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%", borderCollapse: "collapse", minWidth: mob ? 600 : undefined,
              borderRadius: 8, overflow: "hidden",
            }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  {["Broker", "Score", ...compCols, ""].map(h => (
                    <th key={h || "cta"} style={{
                      padding: "10px 12px", textAlign: h === "" ? "center" : "left",
                      fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {brokers.slice(0, 10).map((broker, i) => (
                  <tr key={broker.slug} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 ? "#fafbfc" : "#fff" }}>
                    <td style={{ padding: "10px 12px" }}>
                      <Link to={lp(`/review/${broker.slug}`)} style={{
                        display: "flex", alignItems: "center", gap: 6,
                        textDecoration: "none", color: "#0f172a",
                      }}>
                        <BrokerLogo slug={broker.slug} name={broker.B.name} fallback={broker.B.logo} size={22} shape="icon" />
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{broker.B.name}</span>
                      </Link>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{
                        fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 14,
                        color: broker.B.score >= 9.0 ? "#059669" : broker.B.score >= 8.5 ? "#2563eb" : "#d97706",
                      }}>{broker.B.score}</span>
                    </td>
                    {compCols.map((col) => {
                      const lc = col.toLowerCase();
                      const b = broker;
                      const customRow = compData?.[b.slug];
                      const fallback =
                        lc.includes("spread") ? (b.B.avgSpread ? `${b.B.avgSpread} pips` : `${b.B.spread} pips`)
                        : lc.includes("commission") ? (b.B.commission || "—")
                        : lc.includes("execution") ? "—"
                        : lc.includes("min dep") || lc.includes("deposit") ? (b.B.minDep === 0 ? "$0" : `$${b.B.minDep}`)
                        : lc.includes("leverage") ? b.B.leverage
                        : lc.includes("platform") ? (b.B.platforms?.length + " platforms" || "—")
                        : "—";
                      return (
                        <td key={col} style={{ padding: "10px 12px", fontSize: 13, color: "#1f2937" }}>
                          {customRow ? (customRow[col] || fallback) : fallback}
                        </td>
                      );
                    })}
                    <td style={{ padding: "10px 8px", textAlign: "center" }}>
                      <a href={makeVisitUrl(broker.slug, broker.B.url)} target="_blank" rel="noopener nofollow sponsored" style={{
                        padding: "6px 14px", borderRadius: 6,
                        background: "#059669", color: "#fff",
                        fontWeight: 700, fontSize: 12, textDecoration: "none", whiteSpace: "nowrap",
                      }}>Visit →</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══ БЛОК 8: Education (thematic or fallback) ═══ */}
      {educationData ? (
        <section id="education" style={{ ...cn, paddingBottom: T.sectionGap(mob) }}>
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
              <div key={si} id={`education-${si}`} style={{ marginBottom: 28, paddingTop: 20, borderTop: "1px solid #f1f5f9" }}>
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
            {educationData.faq && educationData.faq.length > 0 && (
              <div id="faq" style={{ paddingTop: 20, borderTop: "1px solid #f1f5f9" }}>
                <h3 style={{ ...T.h3(mob), marginBottom: 16, fontSize: mob ? 18 : 22 }}>
                  Frequently Asked Questions
                </h3>
                <Accordion items={educationData.faq} expanded={openThematicFaq} setExpanded={setOpenThematicFaq} />
              </div>
            )}
          </div>
        </section>
      ) : (
        <section id="education" style={{ ...cn, paddingBottom: T.sectionGap(mob) }}>
          <div style={{ ...T.cardBg, padding: T.cardPad(mob) }}>
            <h2 style={{ ...T.h2(mob), marginBottom: 12 }}>
              What to Look For When Choosing a Broker
            </h2>
            {[
              { h: "Regulation Is Non-Negotiable", t: "Only trade with brokers holding Tier-1 licenses from FCA, ASIC, CySEC, or SEC. These regulators enforce segregated client funds, negative balance protection, and participation in compensation schemes. We verified every license number directly with the relevant authority." },
              { h: "Compare Total Cost, Not Just Spreads", t: "A broker advertising 0.0 pip spreads with a $7/lot commission may be cheaper than one offering 1.0 pips with no commission — but only if you trade frequently. Calculate your monthly cost based on your actual trading volume. Factor in swap rates for overnight positions and withdrawal fees." },
              { h: "Test Execution Under Pressure", t: "Platform stability during high-impact news events separates reliable brokers from unreliable ones. We tested during major economic releases and flash crashes. Brokers that requoted, slipped excessively, or froze during volatility didn't make our top 10." },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: i < 2 ? 16 : 0 }}>
                <h3 style={{ ...T.h3(mob), marginBottom: 4 }}>{item.h}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#374151", margin: 0 }}>{item.t}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* IN-DEPTH BROKER REVIEWS (country rankings only) */}
      {countryData && Object.keys(countryBrokerMap).length > 0 && (
        <section style={{ ...cn, paddingBottom: T.sectionGap(mob) }}>
          <div style={{ ...T.cardBg, padding: mob ? "20px" : "36px" }}>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 28, marginBottom: 6 }}>
              {countryData.name} Broker Reviews — In-Depth Analysis
            </h2>
            <p style={{ fontSize: 16, color: "#1f2937", lineHeight: 1.7, marginBottom: 28 }}>
              We analyzed each broker's {countryData.currency || "local"} account conditions, regulatory status, and trading costs. Here's what {countryData.name} traders need to know.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: mob ? 24 : 32 }}>
              {brokers.map((b, i) => {
                const cb = countryBrokerMap[b.slug];
                if (!cb?.countryReview) return null;
                const review = cb.countryReview;
                return (
                  <div key={b.slug} id={`review-${b.slug}`} style={{
                    paddingTop: mob ? 20 : 28, borderTop: "1px solid #e2e8f0",
                  }}>
                    <div style={{ display: "flex", alignItems: mob ? "flex-start" : "center", gap: mob ? 12 : 16, marginBottom: 16, flexWrap: "wrap" }}>
                      <a href={makeVisitUrl(b.slug, b.B.url)} target="_blank" rel="noopener nofollow sponsored" style={{ flexShrink: 0, display: "block", textDecoration: "none" }}>
                        <BrokerLogo slug={b.slug} name={b.B.name} fallback={b.B.logo} size={mob ? 52 : 60} shape="brand" />
                      </a>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, margin: 0, lineHeight: 1.2 }}>
                          #{i + 1}. {b.B.name} for {countryData.name} Traders
                        </h3>
                        {cb.badge && (
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                            <span style={{ padding: "2px 8px", borderRadius: 5, background: (cb.badgeColor || "#059669") + "15", color: cb.badgeColor || "#059669", fontSize: 13, fontWeight: 700 }}>{cb.badge}</span>
                          </div>
                        )}
                      </div>
                      <div style={{
                        width: 52, height: 52, borderRadius: 12,
                        background: b.B.score >= 9.0 ? "#ecfdf5" : b.B.score >= 8.0 ? "#eff6ff" : "#fffbeb",
                        border: `2px solid ${b.B.score >= 9.0 ? "#059669" : b.B.score >= 8.0 ? "#2563eb" : "#d97706"}`,
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      }}>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 18, lineHeight: 1, color: b.B.score >= 9.0 ? "#059669" : b.B.score >= 8.0 ? "#2563eb" : "#d97706" }}>{b.B.score}</span>
                        <span style={{ fontSize: 8, fontWeight: 700, color: "#1f2937", textTransform: "uppercase" }}>{b.B.score >= 9.5 ? "Excellent" : b.B.score >= 9.0 ? "Great" : b.B.score >= 8.5 ? "Very Good" : "Good"}</span>
                      </div>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      {review.paragraphs.map((p, pi) => (
                        <p key={pi} style={{ fontSize: 16, lineHeight: 1.75, color: "#1f2937", margin: pi < review.paragraphs.length - 1 ? "0 0 12px" : 0 }}>{p}</p>
                      ))}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: mob ? 12 : 16, marginBottom: 16 }}>
                      <div style={{ padding: mob ? 14 : 16, borderRadius: 12, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#059669", marginBottom: 8 }}>Pros for {countryData.name} Traders</div>
                        {review.pros.map((pro, pi) => (
                          <div key={pi} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 5 }}>
                            <Check size={14} color="#059669" style={{ flexShrink: 0, marginTop: 3 }} />
                            <span style={{ fontSize: 15, lineHeight: 1.5, color: "#1f2937" }}>{pro}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ padding: mob ? 14 : 16, borderRadius: 12, background: "#fef2f2", border: "1px solid #fecaca" }}>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#dc2626", marginBottom: 8 }}>Cons for {countryData.name} Traders</div>
                        {review.cons.map((con, ci) => (
                          <div key={ci} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 5 }}>
                            <XIcon size={14} color="#dc2626" style={{ flexShrink: 0, marginTop: 3 }} />
                            <span style={{ fontSize: 15, lineHeight: 1.5, color: "#1f2937" }}>{con}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <a href={makeVisitUrl(b.slug, b.B.url)} target="_blank" rel="noopener nofollow sponsored" style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: mob ? "10px 18px" : "10px 22px", borderRadius: 10,
                        background: "linear-gradient(135deg,#059669,#34d399)",
                        color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none",
                      }}>Visit {b.B.name} <ArrowRight size={14} /></a>
                      <Link to={lp(`/review/${b.slug}`)} style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: mob ? "10px 18px" : "10px 22px", borderRadius: 10,
                        background: "#f1f5f9", color: "#1f2937", fontWeight: 600, fontSize: 15, textDecoration: "none",
                      }}>Read Full {b.B.name} Review <ArrowRight size={14} /></Link>
                      {i > 0 && (
                        <Link to={lp(`/compare/${canonicalPair(b.slug, brokers[0].slug)}`)} style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          padding: mob ? "10px 18px" : "10px 22px", borderRadius: 10,
                          background: "#f1f5f9", color: "#1f2937", fontWeight: 600, fontSize: 15, textDecoration: "none",
                        }}>Compare vs {brokers[0].B.name} <ArrowRight size={14} /></Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* RELATED RANKINGS */}
      {related.length > 0 && (
        <section style={{ ...cn, paddingBottom: T.sectionGap(mob) }}>
          <h2 style={{ ...T.h2(mob), marginBottom: 16 }}>Related Rankings</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr 1fr",
            gap: 12,
          }}>
            {related.map((r) => (
              <Link key={r.id} to={lp(r.slug)} style={{
                ...T.cardBg, padding: "16px 20px",
                textDecoration: "none", color: "#111827",
                display: "flex", alignItems: "center", gap: 12, transition: "all 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#059669"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(5,150,105,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <Icon name={r.icon} size={20} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{r.category} / {r.sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {seo.faq && seo.faq.length > 0 && !educationData?.faq?.length && (
        <section id="faq" style={{ ...cn, paddingBottom: T.sectionGap(mob) }}>
          <h2 style={{ ...T.h2(mob), marginBottom: 16 }}>Frequently Asked Questions</h2>
          <Accordion
            items={seo.faq.slice(0, 6).map((f) => ({ q: fillVars(f.q), a: fillVars(f.a) }))}
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
          <h3 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 24, color: "#fff", marginBottom: 8 }}>
            How We Test Brokers
          </h3>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", maxWidth: 500, margin: "0 auto 20px", lineHeight: 1.6 }}>
            Our team verifies licenses, analyzes 130+ data points per broker, and cross-checks conditions across independent sources to give you rankings you can trust.
          </p>
          <Link to={lp("/methodology")} style={{
            display: "inline-block", padding: "12px 28px", borderRadius: 10,
            background: "linear-gradient(135deg,#059669,#34d399)",
            color: "#fff", fontFamily: "Outfit", fontWeight: 700, fontSize: 15, textDecoration: "none",
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

      {/* DISCLOSURE */}
      <section style={{ ...cn, paddingBottom: mob ? 40 : 60 }}>
        <AffiliateDisclosureBanner />
      </section>

    </main>
  );
}
