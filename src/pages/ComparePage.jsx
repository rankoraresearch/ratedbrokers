import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "../i18n/LanguageContext";
import { useLocalePath } from "../i18n/useLocalePath";
import { useMedia } from "../hooks/useMedia";
import { getAllBrokersWithData, getBrokerData } from "../data/brokers";
import {
  canonicalPair,
  FEATURED_PAIRS,
  POPULAR_PAIRS_BY_VERTICAL,
  POPULAR_PAIRS_ALL,
  VERTICALS,
} from "../data/comparisons";
import { AUTHORS } from "../data/authors";
import BrokerLogo from "../components/BrokerLogo";
import Breadcrumb from "../components/Breadcrumb";
import HeroBand from "../components/HeroBand";
import AuthorCredits from "../components/AuthorCredits";
import Icon, { ArrowRight } from "../components/Icon";
import { ChevronDown, ChevronUp } from "lucide-react";

const VERT_LABELS = {
  forex: "Forex",
  stocks: "Stocks",
  options: "Options",
  futures: "Futures",
  "copy-trading": "Copy",
  crypto: "Crypto",
  "spread-betting": "Spread Bet",
};

/* Muted dots for variant "dot" */
const VERT_DOT = {
  forex: "#6ee7b7",
  stocks: "#93c5fd",
  options: "#c4b5fd",
  futures: "#fcd34d",
  "copy-trading": "#67e8f9",
  crypto: "#fde68a",
  "spread-betting": "#fca5a5",
};


export default function ComparePage() {
  const { t } = useTranslation();
  const lp = useLocalePath();
  const { mob, tab } = useMedia();
  const navigate = useNavigate();

  const allBrokersData = useMemo(() => getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score), []);
  const [pickA, setPickA] = useState("");
  const [pickB, setPickB] = useState("");
  const [activeVertical, setActiveVertical] = useState("all");
  const [expandedBroker, setExpandedBroker] = useState(null);
  const pillsRef = useRef(null);

  const totalBrokers = allBrokersData.length;

  useEffect(() => {
    document.title = `Compare Online Brokers Side-by-Side 2026 | ${totalBrokers} Brokers | RatedBrokers`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = `Compare ${totalBrokers} online brokers side-by-side. Forex, stocks, options, futures, crypto — independently analyzed across 130+ data points. Find your best broker.`;
  }, [totalBrokers]);

  // Filter brokers for picker based on active vertical
  const filteredBrokers = useMemo(() => {
    if (activeVertical === "all") return allBrokersData;
    return allBrokersData.filter(b =>
      (b.B.verticals || []).some(v => {
        if (activeVertical === "forex") return v === "forex" || v === "cfd";
        return v === activeVertical;
      })
    );
  }, [activeVertical, allBrokersData]);

  // Get popular pairs for active vertical
  const currentPairs = useMemo(() => {
    if (activeVertical === "all") return POPULAR_PAIRS_ALL;
    return (POPULAR_PAIRS_BY_VERTICAL[activeVertical] || []).map(p => ({
      ...p,
      vertical: activeVertical,
    }));
  }, [activeVertical]);

  // Group all comparisons by anchor broker
  const groupedComparisons = useMemo(() => {
    const pairs = activeVertical === "all"
      ? FEATURED_PAIRS
      : (POPULAR_PAIRS_BY_VERTICAL[activeVertical] || []);

    const groups = {};
    pairs.forEach(({ slugA, slugB }) => {
      // Add to both brokers' groups
      [slugA, slugB].forEach(anchor => {
        const other = anchor === slugA ? slugB : slugA;
        if (!groups[anchor]) groups[anchor] = { slug: anchor, others: new Set() };
        groups[anchor].others.add(other);
      });
    });

    return Object.values(groups)
      .map(g => ({ slug: g.slug, others: [...g.others] }))
      .sort((a, b) => b.others.length - a.others.length);
  }, [activeVertical]);

  const handleCompare = () => {
    if (pickA && pickB && pickA !== pickB) {
      navigate(lp(`/compare/${canonicalPair(pickA, pickB)}`));
    }
  };

  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const ready = pickA && pickB && pickA !== pickB;
  const author = AUTHORS["marcus-chen"];
  const editor = AUTHORS["sarah-williams"];

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", color: "#111827", minHeight: "100vh" }}>

      {/* Breadcrumbs */}
      <div style={{ ...cn, padding: mob ? "10px 16px" : "14px 24px" }}>
        <Breadcrumb items={[
          { label: "RatedBrokers", path: "/" },
          { label: "Compare Brokers" },
        ]} />
      </div>

      {/* ── HERO BAND ── */}
      <HeroBand mob={mob} tab={tab}>
        <div style={{ textAlign: "center" }}>
          {/* Icon */}
          <div style={{
            width: mob ? 48 : 56, height: mob ? 48 : 56, borderRadius: 14,
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            marginBottom: 16,
          }}>
            <Icon name="bar-chart-3" size={mob ? 24 : 28} color="#34d399" />
          </div>

          <h1 style={{
            fontFamily: "Outfit", fontWeight: 800,
            fontSize: mob ? 28 : tab ? 36 : 44,
            lineHeight: 1.1, color: "#fff", margin: "0 0 12px",
          }}>
            Online Broker Comparison Tool
          </h1>
          <p style={{
            fontSize: mob ? 15 : 18, color: "rgba(255,255,255,0.75)",
            maxWidth: 600, margin: "0 auto 20px",
          }}>
            Select any two from {totalBrokers} brokers to see how they stack up across 130+ independently verified data points.
          </p>

          {/* Trust stats */}
          <div style={{
            display: "flex", justifyContent: "center", gap: mob ? 16 : 32,
            flexWrap: "wrap", marginBottom: 24,
          }}>
            {[
              { val: totalBrokers, label: "Brokers" },
              { val: "8", label: "Categories" },
              { val: "130+", label: "Data Points" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: mob ? 20 : 24, color: "#34d399" }}>{s.val}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── Picker Card (white on dark) ── */}
          <div style={{
            background: "#ffffff",
            borderRadius: 20,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)",
            padding: mob ? "24px 20px" : "32px 36px",
            maxWidth: 760, margin: "0 auto",
          }}>
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr auto 1fr", gap: 12, alignItems: "end" }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                  Broker A
                </label>
                <select
                  value={pickA}
                  onChange={e => setPickA(e.target.value)}
                  style={{
                    width: "100%", padding: "14px 16px", borderRadius: 12,
                    border: "2px solid #e2e8f0",
                    fontSize: 16, fontFamily: "'DM Sans',system-ui,sans-serif",
                    background: "#f8f9fb", color: pickA ? "#0f172a" : "#94a3b8",
                    cursor: "pointer",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => { e.target.style.borderColor = "#059669"; }}
                  onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }}
                >
                  <option value="">Select broker...</option>
                  {filteredBrokers.map(b => (
                    <option key={b.slug} value={b.slug} disabled={b.slug === pickB}>
                      {b.B.name} ({b.B.score})
                    </option>
                  ))}
                </select>
              </div>

              {!mob && (
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "Outfit", fontWeight: 900, fontSize: 16, color: "#0f172a",
                  boxShadow: "0 4px 16px rgba(245,158,11,0.3)",
                }}>VS</div>
              )}

              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                  Broker B
                </label>
                <select
                  value={pickB}
                  onChange={e => setPickB(e.target.value)}
                  style={{
                    width: "100%", padding: "14px 16px", borderRadius: 12,
                    border: "2px solid #e2e8f0",
                    fontSize: 16, fontFamily: "'DM Sans',system-ui,sans-serif",
                    background: "#f8f9fb", color: pickB ? "#0f172a" : "#94a3b8",
                    cursor: "pointer",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => { e.target.style.borderColor = "#059669"; }}
                  onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }}
                >
                  <option value="">Select broker...</option>
                  {filteredBrokers.map(b => (
                    <option key={b.slug} value={b.slug} disabled={b.slug === pickA}>
                      {b.B.name} ({b.B.score})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleCompare}
              disabled={!ready}
              className={ready ? "cta-orange" : ""}
              style={{
                display: "block", width: "100%", marginTop: 16, padding: "14px 32px", borderRadius: 12,
                background: ready ? "linear-gradient(135deg,#f59e0b,#fbbf24)" : "#e2e8f0",
                color: ready ? "#0f172a" : "#94a3b8",
                fontWeight: 800, fontSize: 16, border: "none",
                cursor: ready ? "pointer" : "not-allowed",
                fontFamily: "'DM Sans',system-ui,sans-serif",
                boxShadow: ready ? "0 4px 20px rgba(245,158,11,0.35)" : "none",
                transition: "all 0.2s",
              }}
            >
              Compare Brokers
            </button>
            <div style={{ marginTop: 10, fontSize: 13, color: "#94a3b8", textAlign: "center" }}>
              Free tool · No account required · Updated April 2026
            </div>
          </div>

          {/* Author credits */}
          <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
            <AuthorCredits
              author={author}
              editor={editor}
              updatedDate="April 2026"
              onDark
              compact={mob}
            />
          </div>
        </div>
      </HeroBand>

      {/* ── POPULAR COMPARISONS ── */}
      <section style={{ ...cn, marginTop: 48, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, marginBottom: 6, textAlign: "center" }}>
          Popular Comparisons
        </h2>
        <p style={{ fontSize: 15, color: "#6b7280", textAlign: "center", marginBottom: 24 }}>
          The most searched broker matchups — based on real trader interest
          {activeVertical !== "all" && ` in ${VERTICALS.find(v => v.key === activeVertical)?.label}`}.
        </p>

        {/* Vertical pills (mirrors hero selection) */}
        <div style={{
          display: "flex", gap: 6, marginBottom: 24,
          overflowX: "auto", WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none", msOverflowStyle: "none",
          justifyContent: mob ? "flex-start" : "center",
          paddingBottom: 4,
        }}>
          {VERTICALS.map(v => {
            const active = activeVertical === v.key;
            return (
              <button key={v.key} onClick={() => { setActiveVertical(v.key); setPickA(""); setPickB(""); }} style={{
                padding: "8px 16px", borderRadius: 100, border: "none",
                background: active ? "#059669" : "#f1f5f9",
                color: active ? "#fff" : "#475569",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                whiteSpace: "nowrap", fontFamily: "'DM Sans',system-ui,sans-serif",
                transition: "all 0.2s",
                flexShrink: 0,
              }}>
                {v.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
          {currentPairs.map((fp, i) => {
            const dA = getBrokerData(fp.slugA);
            const dB = getBrokerData(fp.slugB);
            if (!dA || !dB) return null;
            const cp = canonicalPair(fp.slugA, fp.slugB);
            const vert = fp.vertical || activeVertical;
            return (
              <Link key={`${cp}-${i}`} to={lp(`/compare/${cp}`)} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "14px 16px", borderRadius: 12,
                background: "#fff", border: "1px solid #e2e8f0",
                textDecoration: "none", color: "#111827",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#059669"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                  <BrokerLogo slug={fp.slugA} name={dA.B.name} fallback={dA.B.logo} size={36} shape="icon" variant="gray" />
                  <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 12, color: "#94a3b8" }}>vs</span>
                  <BrokerLogo slug={fp.slugB} name={dB.B.name} fallback={dB.B.logo} size={36} shape="icon" variant="gray" />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {dA.B.name} vs {dB.B.name}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                      <span style={{ fontSize: 13, color: "#111" }}>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: "#059669" }}>{dA.B.score}</span>
                        {" vs "}
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: "#2563eb" }}>{dB.B.score}</span>
                      </span>
                      {activeVertical === "all" && vert && vert !== "all" && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: VERT_DOT[vert] || "#94a3b8", flexShrink: 0 }} />
                          <span style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.04em" }}>{VERT_LABELS[vert] || vert}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ArrowRight size={16} color="#cbd5e1" style={{ flexShrink: 0 }} />
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── ALL COMPARISONS (Accordion by broker) ── */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, marginBottom: 6, textAlign: "center" }}>
          {activeVertical === "all" ? "All Broker Comparisons" : `${VERTICALS.find(v => v.key === activeVertical)?.label || ""} Comparisons`}
        </h2>
        <p style={{ fontSize: 15, color: "#6b7280", textAlign: "center", marginBottom: 24 }}>
          {activeVertical === "all"
            ? "Browse all available side-by-side comparisons, grouped by broker."
            : `Popular ${VERTICALS.find(v => v.key === activeVertical)?.label || ""} comparisons, grouped by broker.`}
        </p>

        <div style={{ display: "grid", gap: 8, maxWidth: 900, margin: "0 auto" }}>
          {groupedComparisons.map(group => {
            const bd = getBrokerData(group.slug);
            if (!bd) return null;
            const isOpen = expandedBroker === group.slug;
            return (
              <div key={group.slug} style={{
                background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0",
                overflow: "hidden",
              }}>
                <button
                  onClick={() => setExpandedBroker(isOpen ? null : group.slug)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    width: "100%", padding: mob ? "12px 14px" : "14px 18px",
                    background: "none", border: "none", cursor: "pointer",
                    fontFamily: "'DM Sans',system-ui,sans-serif", textAlign: "left",
                  }}
                >
                  <BrokerLogo slug={group.slug} name={bd.B.name} fallback={bd.B.logo} size={32} shape="icon" variant="gray" />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 15, color: "#111827" }}>
                      {bd.B.name}
                    </span>
                    <span style={{ fontSize: 13, color: "#6b7280", marginLeft: 8 }}>
                      {group.others.length} comparison{group.others.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <span style={{
                    fontFamily: "'JetBrains Mono',monospace", fontWeight: 700,
                    fontSize: 14, color: "#059669", marginRight: 8,
                  }}>
                    {bd.B.score}
                  </span>
                  {isOpen ? <ChevronUp size={18} color="#94a3b8" /> : <ChevronDown size={18} color="#94a3b8" />}
                </button>

                {isOpen && (
                  <div style={{
                    padding: mob ? "0 14px 14px" : "0 18px 18px",
                    display: "flex", flexWrap: "wrap", gap: 8,
                  }}>
                    {group.others.map(otherSlug => {
                      const od = getBrokerData(otherSlug);
                      if (!od) return null;
                      const cp = canonicalPair(group.slug, otherSlug);
                      return (
                        <Link key={cp} to={lp(`/compare/${cp}`)} style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          padding: "8px 14px", borderRadius: 8,
                          background: "#f8f9fb", border: "1px solid #e2e8f0",
                          textDecoration: "none", color: "#111827",
                          fontSize: 14, fontWeight: 600,
                          transition: "all 0.2s",
                        }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "#059669"; e.currentTarget.style.background = "#f0fdf4"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8f9fb"; }}
                        >
                          <span style={{ color: "#6b7280", fontSize: 12 }}>vs</span>
                          {od.B.name}
                          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#2563eb", fontWeight: 700 }}>
                            {od.B.score}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── WHY COMPARE ── */}
      <section style={{ ...cn, marginBottom: 60 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, marginBottom: 20, textAlign: "center" }}>
          Why Compare Brokers?
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
          {[
            {
              icon: "shield", title: "Trustworthy Regulation",
              desc: "Compare licensing, safety measures, and regulatory coverage. Not all regulators offer the same level of protection — see which broker has stronger oversight.",
            },
            {
              icon: "dollar-sign", title: "Trading Costs & Fees",
              desc: "Spreads, commissions, and hidden fees add up fast. Our side-by-side comparison shows the real cost per trade so you can pick the most cost-effective broker.",
            },
            {
              icon: "monitor", title: "Platforms & Tools",
              desc: "MT4, MT5, cTrader, thinkorswim, Power E*TRADE — not every broker supports every platform. Compare tools to find the setup that fits your trading style.",
            },
          ].map((card, i) => (
            <div key={i} style={{
              background: "linear-gradient(135deg, #0f172a, #1e293b)",
              borderRadius: 14, padding: "24px", textAlign: "center",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, margin: "0 auto 14px",
                background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name={card.icon} size={24} color="#34d399" />
              </div>
              <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 17, marginBottom: 8, marginTop: 0, color: "#fff" }}>
                {card.title}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.65)", margin: 0 }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW WE COMPARE (SEO) ── */}
      <section style={{ ...cn, marginBottom: 60 }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, marginBottom: 16, textAlign: "center" }}>
            How We Compare Online Brokers
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "#374151", marginBottom: 12 }}>
            Our broker comparisons are built on independent research, not marketing claims. For every broker on RatedBrokers, our analyst team collects data from regulatory databases, broker websites, independent sources, and aggregated user reviews. This data powers every comparison on this page.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "#374151", marginBottom: 12 }}>
            Each broker is scored across six weighted categories: Regulation &amp; Safety (30%), Trading Costs (20%), User Reputation (15%), Broker Transparency (15%), Platforms &amp; Tools (15%), and Execution Model (5%). When you compare two brokers, you see exactly where each one wins, loses, or ties — backed by data, not opinion.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "#374151", marginBottom: 12 }}>
            Our comparison engine covers all major broker types — from forex and CFD brokers to stock brokers, options platforms, futures brokers, and crypto exchanges. Each broker type is scored using category-specific criteria, ensuring fair and relevant comparisons within and across verticals.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "#374151", margin: 0 }}>
            All comparisons are updated quarterly to reflect the latest spreads, regulatory changes, and platform updates. Whether you're choosing between ECN brokers for scalping, stock brokers for long-term investing, or options platforms for active trading — our side-by-side tool helps you make an informed decision based on independently verified data. See our full <Link to={lp("/best-forex-brokers")} style={{ color: "#059669", fontWeight: 600 }}>best brokers</Link> ranking for 2026.
          </p>
        </div>
      </section>
    </div>
  );
}
