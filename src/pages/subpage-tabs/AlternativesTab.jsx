import { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, ArrowRight, Trophy, ChevronDown, Shield, TrendingUp, Zap, Star, Check } from "lucide-react";
import { QuickAnswerBox, FaqSection, VerdictBox, H2, P, Card } from "../../components/subpage";
import { getVisitUrl } from "../../utils/visitUrl";
import { getBrokerData, getAllBrokerSlugs } from "../../data/brokers/index";
import BrokerLogo from "../../components/BrokerLogo";
import RegBadge from "../../components/RegBadge";

const NAVY = "#0f172a";
const GREEN = "#059669";
const GREEN_LIGHT = "#ecfdf5";
const GREEN_BORDER = "#a7f3d0";
const ORANGE = "#f59e0b";
const GRAY_TEXT = "#374151";
const GRAY_MUTED = "#64748b";
const BORDER = "#e8ecf1";

/* Grid templates per breakpoint — uniform column alignment (header + rows) */
const GRID_DESK = "1fr 56px 68px 62px 88px";   /* desktop: 5 cols with comfortable CTA */
const GRID_TAB  = "1fr 50px 64px 56px 82px";    /* tablet: slightly tighter */
const GRID_GAP = 12;

/* ─── helpers ─── */
function getAllAlternatives(currentSlug) {
  return getAllBrokerSlugs()
    .filter(s => s !== currentSlug)
    .map(s => {
      const d = getBrokerData(s);
      if (!d) return null;
      return {
        slug: s,
        name: d.B.name,
        score: d.B.score,
        spread: d.B.spread,
        type: d.B.type,
        minDep: d.B.minDep,
        commission: d.B.commission,
        leverage: d.B.leverage,
        instruments: d.B.instruments,
        promo: d.B.promo,
        badge: d.B.badge,
        regs: d.B.regs || [],
        platforms: d.B.platforms || [],
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);
}

function ScoreCompare({ altScore, currentScore, mob }) {
  const diff = (altScore - currentScore).toFixed(1);
  const isHigher = altScore > currentScore;
  const isSame = Math.abs(altScore - currentScore) < 0.05;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: mob ? 20 : 24, fontWeight: 800, color: GREEN, lineHeight: 1 }}>{altScore}</span>
      {!isSame && (
        <span style={{ fontSize: 11, fontWeight: 700, color: isHigher ? GREEN : ORANGE, background: isHigher ? GREEN_LIGHT : "#fffbeb", padding: "2px 6px", borderRadius: 4 }}>
          {isHigher ? "+" : ""}{diff}
        </span>
      )}
    </div>
  );
}

/* ─── Featured Card (Top 3) ─── */
function FeaturedCard({ alt, rank, currentScore, mob, why }) {
  const visitUrl = getVisitUrl(alt.slug);
  const tier1 = alt.regs.filter(r => r.tier === 1);
  const isWinner = rank === 1;
  return (
    <div style={{
      background: isWinner ? "linear-gradient(135deg, #0f172a, #1e293b)" : "#fff",
      border: isWinner ? "2px solid #34d399" : `1px solid ${BORDER}`,
      borderRadius: 14, padding: mob ? 18 : 24, position: "relative",
      boxShadow: isWinner ? "0 8px 32px rgba(52,211,153,0.15)" : "0 2px 8px rgba(0,0,0,0.04)",
    }}>
      {/* Rank badge */}
      <div style={{
        position: "absolute", top: mob ? -10 : -12, left: mob ? 16 : 20,
        background: isWinner ? "linear-gradient(135deg, #059669, #34d399)" : rank === 2 ? NAVY : GRAY_MUTED,
        color: "#fff", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 6,
        display: "flex", alignItems: "center", gap: 4, textTransform: "uppercase", letterSpacing: "0.06em",
      }}>
        {isWinner && <Trophy size={12} />}
        #{rank} Alternative
      </div>

      <div style={{ display: "flex", flexDirection: mob ? "column" : "row", gap: mob ? 16 : 20, marginTop: 8 }}>
        {/* Left: logo + info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <BrokerLogo slug={alt.slug} name={alt.name} fallback={alt.name.slice(0, 2)} size={mob ? 44 : 52} shape="icon" borderRadius={12} />
            <div>
              <div style={{ fontFamily: "Outfit", fontSize: mob ? 18 : 22, fontWeight: 800, color: isWinner ? "#fff" : NAVY }}>{alt.name}</div>
              <div style={{ fontSize: 12, color: isWinner ? "rgba(255,255,255,0.65)" : GRAY_MUTED }}>{alt.type}</div>
            </div>
          </div>

          {/* Why this alternative */}
          {why && <p style={{ fontSize: 14, color: isWinner ? "rgba(255,255,255,0.8)" : GRAY_TEXT, lineHeight: 1.7, marginBottom: 12 }}>{why}</p>}

          {/* Key stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 14 }}>
            {[
              { l: "Spread", v: `${alt.spread} pips` },
              { l: "Min Deposit", v: `$${alt.minDep}` },
              { l: "Commission", v: alt.commission },
            ].map((s, i) => (
              <div key={i} style={{
                background: isWinner ? "rgba(255,255,255,0.08)" : "#f8f9fb",
                borderRadius: 8, padding: "8px 10px", textAlign: "center",
              }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: isWinner ? "rgba(255,255,255,0.6)" : GRAY_MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.l}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: isWinner ? "#fff" : NAVY, fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>{s.v}</div>
              </div>
            ))}
          </div>

          {/* Regulation badges */}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: mob ? 12 : 0 }}>
            {tier1.slice(0, 4).map((r, i) => <RegBadge key={i} reg={r.name} onDark={isWinner} />)}
          </div>
        </div>

        {/* Right: score + CTA */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          minWidth: mob ? "auto" : 160, gap: 10,
          ...(mob ? {} : { borderLeft: `1px solid ${isWinner ? "rgba(255,255,255,0.1)" : BORDER}`, paddingLeft: 20 }),
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: isWinner ? "rgba(255,255,255,0.6)" : GRAY_MUTED, textTransform: "uppercase" }}>Score</div>
          <ScoreCompare altScore={alt.score} currentScore={currentScore} mob={mob} />
          {alt.badge && (
            <div style={{ fontSize: 10, fontWeight: 600, color: isWinner ? "#34d399" : GREEN, background: isWinner ? "rgba(52,211,153,0.15)" : GREEN_LIGHT, padding: "3px 8px", borderRadius: 4, textAlign: "center", display: "flex", alignItems: "center", gap: 3 }}>
              <Star size={10} /> {alt.badge}
            </div>
          )}
          {alt.promo && (
            <div style={{ fontSize: 11, color: ORANGE, display: "flex", alignItems: "center", gap: 3, fontWeight: 600 }}>
              <Zap size={11} /> {alt.promo.length > 40 ? alt.promo.slice(0, 40) + "..." : alt.promo}
            </div>
          )}
          <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%",
            background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: NAVY,
            fontSize: 14, fontWeight: 700, textDecoration: "none",
            padding: "12px 20px", borderRadius: 10,
            boxShadow: "0 4px 12px rgba(245,158,11,0.3)",
          }}>
            Visit {alt.name} <ExternalLink size={13} />
          </a>
          <Link to={`/review/${alt.slug}`} style={{
            fontSize: 12, color: isWinner ? "rgba(255,255,255,0.65)" : GRAY_MUTED, textDecoration: "none", fontWeight: 600,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            Read Full Review <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Compact Row (CSS Grid aligned, no regs for clean scan) ─── */
function CompactRow({ alt, i, mob, tab }) {
  const visitUrl = getVisitUrl(alt.slug);
  const gridCols = tab ? GRID_TAB : GRID_DESK;

  if (mob) {
    return (
      <div style={{ padding: "14px 0", borderBottom: `1px solid ${BORDER}` }}>
        {/* Row 1: rank + logo + name ... score */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: GRAY_MUTED, width: 22, textAlign: "center", flexShrink: 0 }}>{i + 4}</span>
          <BrokerLogo slug={alt.slug} name={alt.name} fallback={alt.name.slice(0, 2)} size={32} shape="icon" borderRadius={8} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, fontFamily: "Outfit" }}>{alt.name}</div>
            <div style={{ fontSize: 11, color: GRAY_MUTED }}>{alt.spread} pips · ${alt.minDep} min</div>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, fontWeight: 700, color: GREEN, flexShrink: 0 }}>{alt.score}</span>
        </div>
        {/* Row 2: CTA */}
        <div style={{ paddingLeft: 40, marginTop: 10 }}>
          <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{
            background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: NAVY,
            fontSize: 13, fontWeight: 700, textDecoration: "none",
            padding: "10px 16px", borderRadius: 8, height: 40, boxSizing: "border-box",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5,
          }}>
            Visit {alt.name} <ExternalLink size={12} />
          </a>
        </div>
      </div>
    );
  }

  /* Desktop/Tablet: CSS Grid row — 5 columns, no regs */
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: gridCols,
      columnGap: GRID_GAP,
      alignItems: "center",
      padding: "11px 0",
      borderBottom: `1px solid ${BORDER}`,
    }}>
      {/* Broker */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, overflow: "hidden" }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: GRAY_MUTED, width: 22, textAlign: "center", flexShrink: 0 }}>{i + 4}</span>
        <BrokerLogo slug={alt.slug} name={alt.name} fallback={alt.name.slice(0, 2)} size={30} shape="icon" borderRadius={8} />
        <div style={{ minWidth: 0, overflow: "hidden" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, fontFamily: "Outfit", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{alt.name}</div>
          <div style={{ fontSize: 11, color: GRAY_MUTED, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{alt.type}</div>
        </div>
      </div>
      {/* Score */}
      <div style={{ textAlign: "center" }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700, color: GREEN }}>{alt.score}</span>
      </div>
      {/* Spread */}
      <div style={{ textAlign: "center" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: NAVY }}>{alt.spread}</span>
      </div>
      {/* Deposit */}
      <div style={{ textAlign: "center" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: NAVY }}>${alt.minDep}</span>
      </div>
      {/* CTA — fixed grid cell, button fills it */}
      <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{
        background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: NAVY,
        fontSize: 11, fontWeight: 700, textDecoration: "none",
        borderRadius: 7, height: 32, boxSizing: "border-box",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 3,
        whiteSpace: "nowrap",
      }}>
        Visit <ExternalLink size={10} />
      </a>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
export default function AlternativesTab({ data, slug, mob, tab }) {
  const { B, SIMILAR, FAQ, SUBPAGES } = data;
  const sp = SUBPAGES?.alternatives || {};
  const [showAll, setShowAll] = useState(false);

  // Get all 37 alternatives sorted by score
  const allAlts = getAllAlternatives(slug);

  // Top 3: use SIMILAR if available (curated), otherwise top 3 by score
  const featured = SIMILAR.length >= 3
    ? SIMILAR.slice(0, 3).map(s => allAlts.find(a => a.slug === s.slug) || { ...s, regs: [], platforms: [], minDep: 0, commission: "$0", leverage: "—", instruments: "—", promo: null, badge: null })
    : allAlts.slice(0, 3);

  // Remaining (exclude featured)
  const featuredSlugs = new Set(featured.map(f => f.slug));
  const remaining = allAlts.filter(a => !featuredSlugs.has(a.slug));
  const visibleRemaining = showAll ? remaining : remaining.slice(0, 7);

  const topAlt = featured[0];
  const quickAnswer = sp.quick_answer || `The best ${B.name} alternative is ${topAlt?.name} (score ${topAlt?.score}/10). Other top alternatives include ${featured[1]?.name} and ${featured[2]?.name}. All are regulated, offer competitive spreads, and accept new accounts.`;

  return (
    <>
      {/* ─── Quick Answer ─── */}
      <QuickAnswerBox text={quickAnswer} />

      {/* ─── Top 3 Featured Alternatives ─── */}
      <H2>Top 3 Best {B.name} Alternatives</H2>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 28 }}>
        {featured.map((alt, i) => (
          <FeaturedCard
            key={alt.slug}
            alt={alt}
            rank={i + 1}
            currentScore={B.score}
            mob={mob}
            why={SIMILAR[i]?.why}
          />
        ))}
      </div>

      {/* ─── Mid-page CTA banner ─── */}
      <div style={{
        background: NAVY, borderRadius: 12, padding: mob ? "16px" : "18px 24px",
        display: "flex", alignItems: mob ? "stretch" : "center",
        flexDirection: mob ? "column" : "row", justifyContent: "space-between",
        gap: mob ? 12 : 16, margin: "0 0 28px",
        border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Our Top Pick: {topAlt?.name}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>Rated {topAlt?.score}/10 — the #1 {B.name} alternative</div>
        </div>
        <a href={getVisitUrl(topAlt?.slug || slug)} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{
          background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: NAVY,
          fontSize: 14, fontWeight: 700, textDecoration: "none",
          padding: "12px 28px", borderRadius: 8, display: "inline-flex",
          alignItems: "center", gap: 6, whiteSpace: "nowrap", flexShrink: 0,
          justifyContent: "center", boxShadow: "0 2px 8px rgba(245,158,11,0.3)",
        }}>
          Visit {topAlt?.name} <ExternalLink size={14} />
        </a>
      </div>

      {/* ─── Quick Comparison Table ─── */}
      <H2>{B.name} vs Top Alternatives</H2>
      <div style={{ overflowX: "auto", marginBottom: 24, WebkitOverflowScrolling: "touch" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: mob ? 480 : "auto", fontSize: 13, tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "auto" }} />
            <col style={{ width: 56 }} />
            <col style={{ width: 72 }} />
            <col style={{ width: 72 }} />
            <col style={{ width: 100 }} />
            <col style={{ width: 80 }} />
          </colgroup>
          <thead>
            <tr style={{ borderBottom: `2px solid ${BORDER}` }}>
              <th style={{ padding: "10px 8px", textAlign: "left", fontSize: 11, fontWeight: 700, color: GRAY_MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>Broker</th>
              <th style={{ padding: "10px 6px", textAlign: "center", fontSize: 11, fontWeight: 700, color: GRAY_MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>Score</th>
              <th style={{ padding: "10px 6px", textAlign: "center", fontSize: 11, fontWeight: 700, color: GRAY_MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>Spread</th>
              <th style={{ padding: "10px 6px", textAlign: "center", fontSize: 11, fontWeight: 700, color: GRAY_MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>Deposit</th>
              <th style={{ padding: "10px 6px", textAlign: "left", fontSize: 11, fontWeight: 700, color: GRAY_MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>Regulation</th>
              <th style={{ padding: "10px 6px", textAlign: "center", fontSize: 11, fontWeight: 700, color: GRAY_MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}></th>
            </tr>
          </thead>
          <tbody>
            {/* Current broker row */}
            <tr style={{ background: "#f0f4f8", borderBottom: `1px solid ${BORDER}` }}>
              <td style={{ padding: "10px 8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <BrokerLogo slug={slug} name={B.name} fallback={B.name.slice(0, 2)} size={28} shape="icon" borderRadius={6} />
                  <span style={{ fontWeight: 700, color: NAVY }}>{B.name}</span>
                  <span style={{ fontSize: 10, color: GRAY_MUTED, fontWeight: 600, background: "#e2e8f0", padding: "1px 6px", borderRadius: 3 }}>Current</span>
                </div>
              </td>
              <td style={{ padding: "10px 6px", textAlign: "center", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: NAVY }}>{B.score}</td>
              <td style={{ padding: "10px 6px", textAlign: "center" }}>{B.spread} pips</td>
              <td style={{ padding: "10px 6px", textAlign: "center" }}>${B.minDep}</td>
              <td style={{ padding: "10px 6px" }}>
                <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>{(B.regs || []).filter(r => r.tier === 1).slice(0, 2).map((r, i) => <RegBadge key={i} reg={r.name} />)}</div>
              </td>
              <td style={{ padding: "10px 6px" }} />
            </tr>
            {/* Alternatives rows */}
            {featured.map((alt, i) => (
              <tr key={alt.slug} style={{ borderBottom: `1px solid ${BORDER}` }}>
                <td style={{ padding: "10px 8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <BrokerLogo slug={alt.slug} name={alt.name} fallback={alt.name.slice(0, 2)} size={28} shape="icon" borderRadius={6} />
                    <span style={{ fontWeight: 700, color: NAVY }}>{alt.name}</span>
                    {i === 0 && <span style={{ fontSize: 10, color: "#fff", fontWeight: 700, background: GREEN, padding: "1px 6px", borderRadius: 3, display: "inline-flex", alignItems: "center", gap: 2 }}><Trophy size={9} /> #1</span>}
                  </div>
                </td>
                <td style={{ padding: "10px 6px", textAlign: "center", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: GREEN }}>{alt.score}</td>
                <td style={{ padding: "10px 6px", textAlign: "center" }}>{alt.spread} pips</td>
                <td style={{ padding: "10px 6px", textAlign: "center" }}>${alt.minDep}</td>
                <td style={{ padding: "10px 6px" }}>
                  <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>{alt.regs.filter(r => r.tier === 1).slice(0, 2).map((r, j) => <RegBadge key={j} reg={r.name} />)}</div>
                </td>
                <td style={{ padding: "10px 6px", textAlign: "center" }}>
                  <a href={getVisitUrl(alt.slug)} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{
                    background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: NAVY,
                    fontSize: 11, fontWeight: 700, textDecoration: "none",
                    padding: "6px 0", borderRadius: 6, display: "flex",
                    alignItems: "center", justifyContent: "center", gap: 4,
                    whiteSpace: "nowrap", width: "100%", height: 30, boxSizing: "border-box",
                  }}>
                    Visit <ExternalLink size={10} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── Why Look for Alternatives ─── */}
      <H2>Why Look for {B.name} Alternatives?</H2>
      <P>{B.name} scores {B.score}/10 in our review — {B.score >= 9 ? "an excellent" : B.score >= 8 ? "a very good" : "a good"} rating. However, no single broker is perfect for every trader. Common reasons to explore alternatives include:</P>
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 24 }}>
        {[
          { icon: TrendingUp, title: "Lower Trading Costs", desc: `Find brokers with tighter spreads or lower commissions than ${B.name}'s ${B.spread} pips.` },
          { icon: Shield, title: "Different Regulation", desc: "Prefer a broker regulated in your specific country or jurisdiction." },
          { icon: Zap, title: "Different Platform", desc: `${B.name} offers ${B.platforms?.slice(0, 2).join(", ") || "its platform"}. Other brokers may suit your platform preferences.` },
          { icon: Star, title: "Specific Features", desc: "Some alternatives offer better education, copy trading, or research tools." },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 10, padding: 14, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10 }}>
            <item.icon size={18} color={GREEN} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 2 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: GRAY_TEXT, lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── All Alternatives ─── */}
      <H2>All {B.name} Alternatives ({remaining.length + featured.length} Brokers)</H2>

      <Card style={{ padding: mob ? "8px 14px" : "8px 18px" }}>
        {/* Grid header inside Card for pixel-perfect alignment */}
        {!mob && (
          <div style={{
            display: "grid",
            gridTemplateColumns: tab ? GRID_TAB : GRID_DESK,
            columnGap: GRID_GAP,
            alignItems: "center",
            padding: "8px 0",
            borderBottom: `2px solid ${BORDER}`,
            marginBottom: 4,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: GRAY_MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>Broker</div>
            <div style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: GRAY_MUTED, textTransform: "uppercase" }}>Score</div>
            <div style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: GRAY_MUTED, textTransform: "uppercase" }}>Spread</div>
            <div style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: GRAY_MUTED, textTransform: "uppercase" }}>Deposit</div>
            <div />
          </div>
        )}

        {visibleRemaining.map((alt, i) => (
          <CompactRow key={alt.slug} alt={alt} i={i} mob={mob} tab={tab} />
        ))}

        {!showAll && remaining.length > 7 && (
          <button onClick={() => setShowAll(true)} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            width: "100%", padding: "12px", marginTop: 8,
            background: GREEN_LIGHT, border: `1px solid ${GREEN_BORDER}`, borderRadius: 8,
            color: GREEN, fontSize: 13, fontWeight: 700, cursor: "pointer",
            fontFamily: "DM Sans",
          }}>
            Show All {remaining.length} Alternatives <ChevronDown size={14} />
          </button>
        )}
      </Card>

      {/* ─── Bottom CTA ─── */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a, #1e293b)", borderRadius: 14,
        padding: mob ? 20 : 28, margin: "28px 0 24px", textAlign: "center",
        border: "1px solid rgba(52,211,153,0.2)",
      }}>
        <div style={{ fontSize: mob ? 18 : 22, fontWeight: 800, color: "#fff", fontFamily: "Outfit", marginBottom: 6 }}>Ready to Switch from {B.name}?</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>Open an account with our #1 recommended alternative</div>
        <div style={{ display: "flex", flexDirection: mob ? "column" : "row", gap: 10, justifyContent: "center", alignItems: "center" }}>
          <a href={getVisitUrl(topAlt?.slug || slug)} target="_blank" rel="noopener nofollow sponsored" className="cta-orange" style={{
            background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: NAVY,
            fontSize: 16, fontWeight: 700, textDecoration: "none",
            padding: "14px 32px", borderRadius: 10, display: "inline-flex",
            alignItems: "center", gap: 8, boxShadow: "0 4px 16px rgba(245,158,11,0.3)",
          }}>
            Visit {topAlt?.name} <ExternalLink size={15} />
          </a>
          {featured[1] && (
            <a href={getVisitUrl(featured[1].slug)} target="_blank" rel="noopener nofollow sponsored" className="cta-secondary" style={{
              background: "transparent", color: "#34d399", border: "2px solid #34d399",
              fontSize: 14, fontWeight: 700, textDecoration: "none",
              padding: "12px 24px", borderRadius: 10, display: "inline-flex",
              alignItems: "center", gap: 6,
            }}>
              Visit {featured[1].name} <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>

      {/* ─── FAQ ─── */}
      {(sp.faq || FAQ.filter(f => f.q.toLowerCase().includes("alternative") || f.q.toLowerCase().includes("better") || f.q.toLowerCase().includes("vs") || f.q.toLowerCase().includes("compare") || f.q.toLowerCase().includes("switch")).slice(0, 5)).length > 0 && (
        <FaqSection faqs={sp.faq || FAQ.filter(f => f.q.toLowerCase().includes("alternative") || f.q.toLowerCase().includes("better") || f.q.toLowerCase().includes("vs") || f.q.toLowerCase().includes("compare") || f.q.toLowerCase().includes("switch")).slice(0, 5)} mob={mob} />
      )}

      {/* ─── Verdict: about the #1 alternative, not the current broker ─── */}
      <VerdictBox
        slug={topAlt?.slug || slug}
        name={topAlt?.name || B.name}
        score={topAlt?.score || B.score}
        title={sp.verdict_title || `Best ${B.name} Alternative — Our #1 Pick`}
        text={sp.verdict_text || `After comparing all ${allAlts.length} brokers, ${topAlt?.name} (${topAlt?.score}/10) is our top ${B.name} alternative. It offers ${topAlt?.spread || "competitive"} pips spreads with ${topAlt?.regs?.filter(r => r.tier === 1).map(r => r.name).join(" + ") || "strong"} regulation. ${featured[1]?.name} and ${featured[2]?.name} are also excellent choices depending on your trading priorities.`}
        bestFor={sp.best_for}
        notFor={sp.not_for}
        mob={mob}
      />
    </>
  );
}
