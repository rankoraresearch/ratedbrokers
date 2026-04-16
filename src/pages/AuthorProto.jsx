import { useState } from "react";
import {
  Linkedin, Twitter, Target, ArrowRight, ArrowUpRight,
  ExternalLink, Quote, CheckCircle2, Award, BookOpen, Newspaper,
  Calendar, Radio, MapPin, Building2, Mail, Sparkles,
} from "lucide-react";
import { useMedia } from "../hooks/useMedia";
import { AUTHORS } from "../data/authors";
import AuthorAvatar from "../components/AuthorAvatar";

/**
 * AuthorProto — 3 концепта страницы автора (Barbara brief, 2026-04-16).
 * A — Editorial Authority (WSJ): dark hero + navy trust ribbon + white body.
 * B — Analyst Terminal (Bloomberg): full-dark page, mono typography, citations log.
 * C — Magazine Profile (FT Weekend): asymmetric dark hero + cream band + pullquote.
 *
 * Переключатель варианта + переключатель автора (Marcus = analyst, Yegor = founder).
 */

const VARIANTS = [
  {
    key: "A",
    label: "A · Editorial Authority",
    desc: "WSJ-style: Premium Dark hero → navy trust ribbon → white body → Featured In cards → tabs",
  },
  {
    key: "B",
    label: "B · Analyst Terminal",
    desc: "Bloomberg Terminal: full-dark page, mono grid metrics, citations log. Нарушает dark-rhythm.",
  },
  {
    key: "C",
    label: "C · Magazine Profile ⭐",
    desc: "FT Weekend: asymmetric hero + cream About + pullquote. Barbara рекомендует.",
  },
];

const AUTHORS_LIST = [
  { key: "marcus-chen", label: "Marcus (analyst)" },
  { key: "yegor-barakovskiy", label: "Yegor (founder)" },
];

// ─── MOCK DATA ────────────────────────────────────────────────────────────

const MEDIA_MENTIONS = {
  "marcus-chen": [
    {
      outlet: "Bloomberg",
      title: "Forex brokers consolidate amid EU regulation wave",
      date: "Apr 2026",
      quote: "\"Spread-markup models are being squeezed from both ends — regulators and traders alike,\" Chen said.",
      url: "https://www.bloomberg.com/",
    },
    {
      outlet: "FINANCIAL TIMES",
      title: "Retail CFDs: who actually wins in 2026",
      date: "Mar 2026",
      quote: "\"The 0.0-pip marketing is back — but the commission footnote is where the real cost lives,\" said Chen of RatedBrokers.",
      url: "https://www.ft.com/",
    },
    {
      outlet: "REUTERS",
      title: "MT5 vs cTrader: execution quality in 2026",
      date: "Feb 2026",
      quote: "\"Execution-speed numbers on broker marketing pages should be treated as best-case, not median,\" — Chen.",
      url: "https://www.reuters.com/",
    },
  ],
  "yegor-barakovskiy": [], // Founder, нет упоминаний на старте
};

/**
 * EDITORIAL ACTIVITY FEED — unified per-author event log.
 * Each row = ONE editorial action (write / review / fact-check) by THIS author on a page.
 * Sorted by acted_at DESC. Role determines badge + how the date is interpreted.
 *
 * Production source (per EDITORIAL-ACTIVITY-LOG.md):
 *   D1 table `editorial_actions` → API `/api/authors/:id/activity?limit=10`
 *   MD frontmatter holds canonical author bindings; D1 holds the timeline.
 *
 * Mock here demonstrates the schema 1:1 — same fields as the planned API response.
 */
const ACTIVITY_FEED = {
  "marcus-chen": [
    { date: "Apr 13", isoDate: "2026-04-13", role: "writer", title: "IC Markets Review 2026", type: "Review", slug: "/reviews/ic-markets" },
    { date: "Apr 12", isoDate: "2026-04-12", role: "fact-checker", title: "Best Forex Brokers UK 2026", type: "Ranking", slug: "/best-forex-brokers-uk" },
    { date: "Apr 10", isoDate: "2026-04-10", role: "reviewer", title: "IG Review", type: "Review", slug: "/reviews/ig" },
    { date: "Apr 8", isoDate: "2026-04-08", role: "writer", title: "Best ECN Brokers 2026", type: "Ranking", slug: "/best-ecn-brokers" },
    { date: "Apr 7", isoDate: "2026-04-07", role: "fact-checker", title: "Admirals Review", type: "Review", slug: "/reviews/admirals" },
    { date: "Apr 5", isoDate: "2026-04-05", role: "writer", title: "Pepperstone Review", type: "Review", slug: "/reviews/pepperstone" },
    { date: "Apr 3", isoDate: "2026-04-03", role: "reviewer", title: "Best CFD Brokers 2026", type: "Ranking", slug: "/best-cfd-brokers" },
    { date: "Mar 30", isoDate: "2026-03-30", role: "reviewer", title: "Saxo Bank Review", type: "Review", slug: "/reviews/saxo-bank" },
    { date: "Mar 28", isoDate: "2026-03-28", role: "writer", title: "Best MT5 Brokers 2026", type: "Ranking", slug: "/best-mt5-brokers" },
    { date: "Mar 22", isoDate: "2026-03-22", role: "writer", title: "eToro Review — Updated", type: "Review", slug: "/reviews/etoro" },
  ],
  "yegor-barakovskiy": [],
};

const ROLE_LABEL = {
  writer: "Wrote",
  reviewer: "Reviewed",
  "fact-checker": "Fact-checked",
};

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function monthLabel(isoMonth) {
  const [y, m] = isoMonth.split("-");
  return `${MONTH_NAMES[parseInt(m, 10) - 1]} ${y}`;
}
function pageTypeLabel(type) {
  return type === "Review" ? "Broker review" : "Ranking";
}

const MILESTONES = {
  "yegor-barakovskiy": [
    { date: "Jan 2024", title: "Founded RatedBrokers", desc: "Domain registered, editorial methodology drafted." },
    { date: "Oct 2024", title: "First 20 broker reviews", desc: "Pilot coverage of Tier-1 forex/CFD brokers." },
    { date: "Feb 2026", title: "38 reviews, 207 rankings live", desc: "Multi-vertical rollout: forex, crypto, stocks, alternatives." },
    { date: "Mar 2026", title: "Admin Panel + Backend API live", desc: "Cloudflare Workers + D1, click tracking, Ranking Manager." },
    { date: "Apr 2026", title: "52 brokers, 293 rankings, 5-person team", desc: "M4 umbrella complete, editorial expansion." },
  ],
};

/**
 * OUTLET_STYLES — typography-based wordmarks, one monochrome standard.
 * Each publication gets a per-brand typography hint; rendered inline inside quote cards.
 * Color comes from the card context (default: slate #475569).
 */
const OUTLET_STYLES = {
  "Bloomberg":        { fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 900, fontSize: 22, letterSpacing: "-0.02em", fontStyle: "italic" },
  "REUTERS":          { fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: "0.02em" },
  "The Wall Street Journal": { fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 14, letterSpacing: "0.01em", textTransform: "uppercase" },
  "FINANCIAL TIMES":  { fontFamily: "Georgia, serif", fontWeight: 600, fontSize: 15, letterSpacing: "0.12em" },
  "CNBC":             { fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 900, fontSize: 22, letterSpacing: "-0.03em" },
  "CNN":              { fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 900, fontSize: 24, letterSpacing: "-0.05em", fontStyle: "italic" },
  "Forbes":           { fontFamily: "'Times New Roman', Georgia, serif", fontWeight: 900, fontSize: 23, letterSpacing: "-0.02em" },
  "MarketWatch":      { fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 800, fontSize: 19, letterSpacing: "-0.01em" },
  "BUSINESS INSIDER": { fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 900, fontSize: 15, letterSpacing: "0.04em" },
  "The Economist":    { fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 19, fontStyle: "italic", letterSpacing: "-0.01em" },
};

function OutletWordmark({ name, color = "#475569" }) {
  const style = OUTLET_STYLES[name] || { fontFamily: "Outfit", fontWeight: 800, fontSize: 17 };
  return (
    <span style={{ ...style, color, lineHeight: 1, whiteSpace: "nowrap", userSelect: "none" }}>
      {name}
    </span>
  );
}

const EXPERTISE_DEEP = {
  "marcus-chen": [
    {
      title: "ECN / STP Execution",
      points: [
        "Open live $500 accounts on every broker — never demo data.",
        "Measure slippage on 300+ trades per broker during NFP / CPI events.",
        "Verify STP claims by cross-checking Level 2 depth with broker's liquidity providers.",
      ],
    },
    {
      title: "Spread Analysis",
      points: [
        "Record 24-hour spread samples across London / NY / Asian sessions.",
        "Compare typical vs advertised — brokers often publish best-case numbers.",
        "Factor commission into all-in cost, not headline spread.",
      ],
    },
  ],
  "yegor-barakovskiy": [],
};

// ─── SHARED ATOMS ─────────────────────────────────────────────────────────

function bucketFeed(feed) {
  return {
    written: feed.filter(f => f.role === "writer"),
    reviewed: feed.filter(f => f.role === "reviewer"),
    factChecked: feed.filter(f => f.role === "fact-checker"),
  };
}

function lastActivityLabel(feed) {
  if (!feed?.length) return "—";
  return feed[0].date.toUpperCase();
}

function getTrustNumbers(author, feed = []) {
  if (author.isFounder) {
    return [
      { num: "10+", label: "YEARS TRADING" },
      { num: "2024", label: "FOUNDED" },
      { num: "293", label: "RANKINGS PUBLISHED" },
      { num: "APR 16", label: "UPDATED" },
    ];
  }
  const counts = bucketFeed(feed);
  return [
    { num: parseInt(author.exp) || 14, label: "YEARS COVERING FX" },
    { num: counts.written.length || author.reviews || 87, label: "REVIEWS WRITTEN" },
    { num: counts.reviewed.length + counts.factChecked.length, label: "REVIEW / FACT-CHECK PASSES" },
    { num: lastActivityLabel(feed), label: "LAST UPDATE" },
  ];
}

function getManifesto(author) {
  if (author.isFounder) {
    return "We built RatedBrokers because advertising corrupts broker reviews.";
  }
  return "14 years testing brokers with real money — never theory.";
}

// ─── VARIANT A — Editorial Authority ──────────────────────────────────────

function VariantA({ author, mob }) {
  const mentions = MEDIA_MENTIONS[author.id] || [];
  const feed = ACTIVITY_FEED[author.id] || [];
  const milestones = MILESTONES[author.id] || [];
  const trust = getTrustNumbers(author, feed);
  const manifesto = getManifesto(author);

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#fff" }}>

      {/* HERO — Premium Dark */}
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
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", display: "flex", gap: mob ? 20 : 40, flexDirection: mob ? "column" : "row", alignItems: mob ? "center" : "flex-start" }}>
          <AuthorAvatar author={author} size={mob ? 120 : 160} />
          <div style={{ flex: 1, textAlign: mob ? "center" : "left" }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600, color: "#f59e0b", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>
              {author.role}
            </div>
            <h1 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 32 : 44, color: "#fff", margin: "0 0 14px", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
              {author.name}
            </h1>
            <p style={{ fontSize: mob ? 16 : 19, color: "rgba(255,255,255,0.82)", lineHeight: 1.55, margin: "0 0 20px", maxWidth: 640, fontWeight: 300 }}>
              "{manifesto}"
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", justifyContent: mob ? "center" : "flex-start" }}>
              {(author.credentials || []).map((c) => (
                <span key={c} style={{
                  padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 700, letterSpacing: "0.05em",
                  background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)",
                }}>{c}</span>
              ))}
              {author.linkedin && (
                <a href={author.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn" style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 32, height: 32, borderRadius: 6, background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.2)", color: "#fff",
                }}>
                  <Linkedin size={15} />
                </a>
              )}
              {author.twitter && (
                <a href={author.twitter} target="_blank" rel="noopener" aria-label="Twitter" style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 32, height: 32, borderRadius: 6, background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.2)", color: "#fff",
                }}>
                  <Twitter size={15} />
                </a>
              )}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.6)", marginLeft: 6 }}>
                <MapPin size={13} /> {author.isFounder ? "Global" : "London, UK"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST RIBBON */}
      <section style={{ background: "#0f172a", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "16px" : "18px 24px" }}>
          <div style={{
            display: "flex", gap: mob ? 12 : 32, flexWrap: "wrap",
            justifyContent: "space-between", alignItems: "center",
          }}>
            {trust.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: mob ? 15 : 18, fontWeight: 700, color: "#fff" }}>{t.num}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section style={{ maxWidth: 880, margin: "0 auto", padding: mob ? "40px 16px 32px" : "64px 24px 40px" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 24, color: "#0f172a", margin: "0 0 20px" }}>
          About {author.name.split(" ")[0]}
        </h2>
        <p style={{ fontSize: 17, lineHeight: 1.8, color: "#1f2937", margin: "0 0 16px" }}>
          {author.bio}
        </p>
        {author.specialty && (
          <div style={{ fontSize: 14, color: "#475569", paddingTop: 16, borderTop: "1px solid #e2e8f0", marginTop: 24 }}>
            <span style={{ fontWeight: 700, color: "#0f172a" }}>Areas: </span>
            {author.specialty}
          </div>
        )}
      </section>

      {/* MEDIA COVERAGE — quote cards with inline outlet wordmarks */}
      {mentions.length > 0 && (
        <section style={{ background: "#f8fafc", padding: mob ? "40px 16px" : "56px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, color: "#f59e0b", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>
              As Featured In
            </div>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 26 : 30, color: "#0f172a", margin: "0 0 28px", letterSpacing: "-0.02em" }}>
              Media Coverage
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 14 }}>
              {mentions.map((m, i) => (
                <a key={i} href={m.url} target="_blank" rel="noopener" style={{
                  display: "block", padding: mob ? "24px 22px" : "28px 26px",
                  background: "#fff", borderRadius: 14,
                  border: "1px solid #e2e8f0", textDecoration: "none", color: "inherit",
                  transition: "box-shadow 0.2s, transform 0.2s, border-color 0.2s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
                >
                  {/* Outlet wordmark — takes its own baseline */}
                  <div style={{
                    height: 36, display: "flex", alignItems: "center",
                    paddingBottom: 18, marginBottom: 18,
                    borderBottom: "1px solid #f1f5f9",
                  }}>
                    <OutletWordmark name={m.outlet} color="#0f172a" />
                  </div>

                  <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                    {m.date}
                  </div>
                  <div style={{ fontFamily: "Outfit", fontWeight: 600, fontSize: 16, color: "#0f172a", lineHeight: 1.35, marginBottom: 12, letterSpacing: "-0.01em" }}>
                    {m.title}
                  </div>
                  <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
                    {m.quote}
                  </p>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "#059669", fontWeight: 600, marginTop: 16 }}>
                    Read the article <ExternalLink size={11} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {!mentions.length && author.isFounder && (
        <section style={{ maxWidth: 880, margin: "0 auto", padding: mob ? "0 16px 32px" : "0 24px 40px" }}>
          <div style={{ padding: "18px 22px", background: "#fff8e1", borderRadius: 12, border: "1px solid #fde68a", fontSize: 14, color: "#78350f", lineHeight: 1.5 }}>
            <Sparkles size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 6, color: "#f59e0b" }} />
            {author.name.split(" ")[0]} works exclusively for RatedBrokers. External citations will appear here as they are earned.
          </div>
        </section>
      )}

      {/* LATEST WORK / MILESTONES */}
      {author.isFounder ? (
        <LatestSection title="Platform Milestones" mob={mob}>
          <div style={{ background: "#fff", borderRadius: 14, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.05)", overflow: "hidden" }}>
            {milestones.map((m, i) => (
              <div key={i} style={{
                display: "flex", gap: 16, padding: mob ? "14px 16px" : "18px 22px",
                borderBottom: i === milestones.length - 1 ? "none" : "1px solid rgba(0,0,0,0.05)",
                alignItems: "flex-start",
              }}>
                <div style={{ flexShrink: 0, width: mob ? 72 : 88, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600, color: "#059669", letterSpacing: "0.05em", paddingTop: 2 }}>{m.date}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", marginBottom: 2 }}>{m.title}</div>
                  <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </LatestSection>
      ) : (
        <ActivityFeedSection feed={feed} authorName={author.name} mob={mob} />
      )}

      {/* CTA */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "8px 16px 48px" : "16px 24px 72px" }}>
        <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #064e3b 100%)", borderRadius: 16, padding: mob ? "24px 20px" : "32px 40px", display: "flex", flexDirection: mob ? "column" : "row", alignItems: mob ? "flex-start" : "center", justifyContent: "space-between", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, color: "#fbbf24", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>Get in touch</div>
            <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 22, color: "#fff", margin: 0 }}>Have a question for {author.name.split(" ")[0]}?</h3>
          </div>
          <a href="/contact" className="cta-orange" style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 22px",
            background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
            borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none",
          }}>
            <Mail size={16} /> Ask the team
          </a>
        </div>
      </section>
    </div>
  );
}

// ─── ActivityFeedSection — editorial timeline (Variant A) ──────────────

function ActivityFeedSection({ feed, authorName, mob }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? feed : feed.filter(f => f.role === filter);

  // Group by month
  const months = [];
  filtered.forEach(item => {
    const monthKey = item.isoDate.slice(0, 7);
    let group = months.find(g => g.key === monthKey);
    if (!group) {
      group = { key: monthKey, label: monthLabel(monthKey), items: [] };
      months.push(group);
    }
    group.items.push(item);
  });

  const filters = [
    { key: "all", label: "All", count: feed.length },
    { key: "writer", label: "Wrote", count: feed.filter(f => f.role === "writer").length },
    { key: "reviewer", label: "Reviewed", count: feed.filter(f => f.role === "reviewer").length },
    { key: "fact-checker", label: "Fact-checked", count: feed.filter(f => f.role === "fact-checker").length },
  ];
  const firstName = authorName.split(" ")[0];

  return (
    <section style={{ maxWidth: 920, margin: "0 auto", padding: mob ? "40px 16px 24px" : "64px 24px 32px" }}>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, color: "#f59e0b", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>
        Recent Activity
      </div>
      <h2 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 26 : 30, color: "#0f172a", margin: "0 0 28px", letterSpacing: "-0.02em" }}>
        Editorial work by {firstName}
      </h2>

      {/* Underline filter tabs */}
      <div style={{ display: "flex", gap: mob ? 18 : 28, borderBottom: "1px solid #e2e8f0", marginBottom: 8, overflowX: "auto", paddingBottom: 0 }}>
        {filters.map(f => {
          const active = filter === f.key;
          return (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: "12px 0", marginBottom: -1,
              borderTop: "none", borderLeft: "none", borderRight: "none",
              borderBottom: active ? "2px solid #f59e0b" : "2px solid transparent",
              background: "transparent",
              color: active ? "#0f172a" : "#64748b",
              fontWeight: active ? 700 : 500,
              fontSize: 14, cursor: "pointer", fontFamily: "inherit",
              whiteSpace: "nowrap", transition: "color 0.15s",
            }}>
              {f.label}
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: active ? "#94a3b8" : "#cbd5e1", marginLeft: 6, fontWeight: 500 }}>
                {f.count}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8", fontSize: 14, borderBottom: "1px solid #f1f5f9" }}>
          No editorial actions in this category yet.
        </div>
      ) : (
        months.map(month => (
          <div key={month.key} style={{ marginTop: 28 }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "baseline",
              marginBottom: 6, paddingBottom: 6,
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600,
                color: "#475569", letterSpacing: "0.18em", textTransform: "uppercase",
              }}>
                {month.label}
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono',monospace", fontSize: 10,
                color: "#cbd5e1", letterSpacing: "0.1em", textTransform: "uppercase",
              }}>
                {month.items.length} {month.items.length === 1 ? "action" : "actions"}
              </div>
            </div>

            {month.items.map((item, i) => (
              <a key={`${month.key}-${i}`} href={item.slug} className="d2k-row" style={{
                display: "grid",
                gridTemplateColumns: mob ? "60px 1fr 14px" : "76px 1fr 132px 14px",
                gap: mob ? 14 : 20, alignItems: "center",
                padding: mob ? "16px 0" : "18px 0",
                borderTop: "1px solid #f1f5f9",
                borderBottom: i === month.items.length - 1 ? "1px solid #f1f5f9" : "none",
                textDecoration: "none", color: "inherit", background: "transparent",
              }}>
                <span style={{
                  fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 500,
                  color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase",
                }}>
                  {item.date}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div className="activity-title" style={{
                    fontFamily: "Outfit", fontWeight: 600, fontSize: mob ? 16 : 17,
                    color: "#0f172a", lineHeight: 1.3, marginBottom: 3, letterSpacing: "-0.01em",
                  }}>
                    {item.title}
                  </div>
                  <div style={{
                    fontSize: 12, color: "#94a3b8",
                    display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap",
                  }}>
                    <span>{pageTypeLabel(item.type)}</span>
                    {mob && (
                      <>
                        <span style={{ color: "#e2e8f0" }}>·</span>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 500, color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                          {ROLE_LABEL[item.role]}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {!mob && (
                  <span style={{
                    fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600,
                    color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase",
                    textAlign: "right",
                  }}>
                    {ROLE_LABEL[item.role]}
                  </span>
                )}
                <ArrowRight className="d2k-arrow" size={14} color="#cbd5e1" />
              </a>
            ))}
          </div>
        ))
      )}
    </section>
  );
}

// ─── VARIANT B — Analyst Terminal ─────────────────────────────────────────

function VariantB({ author, mob }) {
  const mentions = MEDIA_MENTIONS[author.id] || [];
  const feed = ACTIVITY_FEED[author.id] || [];
  const work = bucketFeed(feed);
  const milestones = MILESTONES[author.id] || [];
  const trust = getTrustNumbers(author, feed);
  const manifesto = getManifesto(author);
  const expertise = EXPERTISE_DEEP[author.id] || [];

  const allWork = [...work.written.map(w => ({...w, role: "WRITTEN"})), ...work.reviewed.map(w => ({...w, role: "REVIEWED"})), ...work.factChecked.map(w => ({...w, role: "FACT-CHECKED"}))].slice(0, 10);

  return (
    <div style={{
      fontFamily: "'DM Sans',system-ui,sans-serif",
      background: "#0b1120",
      color: "#e2e8f0",
      minHeight: "100vh",
      backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)",
      backgroundSize: "48px 48px",
    }}>

      {/* HERO */}
      <section style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "32px 16px" : "48px 24px" }}>
          <div style={{ display: "flex", gap: mob ? 20 : 40, flexDirection: mob ? "column" : "row", alignItems: mob ? "center" : "flex-start" }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ border: "2px solid #f59e0b", padding: 4, borderRadius: 2 }}>
                <AuthorAvatar author={author} size={mob ? 140 : 200} />
              </div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#94a3b8", marginTop: 8, letterSpacing: "0.1em", textAlign: "center" }}>
                ID.{author.id.slice(0, 8).toUpperCase()}
              </div>
            </div>
            <div style={{ flex: 1, width: "100%" }}>
              <h1 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 30 : 42, color: "#fff", margin: "0 0 6px", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
                {author.name}
              </h1>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600, color: "#f59e0b", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 20 }}>
                {author.role}
              </div>

              {/* Metric grid 3×2 */}
              <div style={{
                display: "grid",
                gridTemplateColumns: mob ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
                border: "1px solid rgba(255,255,255,0.12)",
                marginBottom: 16,
              }}>
                {[
                  ...trust,
                  { num: manifesto.split(" ").length > 10 ? "24H" : "24H", label: "RESPONSE SLA" },
                  { num: mentions.length || "—", label: "CITATIONS" },
                ].slice(0, 6).map((t, i) => (
                  <div key={i} style={{
                    padding: mob ? "12px 12px" : "16px 18px",
                    borderRight: (i + 1) % (mob ? 2 : 3) === 0 ? "none" : "1px solid rgba(255,255,255,0.08)",
                    borderBottom: i < (mob ? 4 : 3) ? "1px solid rgba(255,255,255,0.08)" : "none",
                  }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#94a3b8", letterSpacing: "0.1em", marginBottom: 4 }}>{t.label}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: mob ? 16 : 20, fontWeight: 700, color: "#fff" }}>{t.num}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#94a3b8", letterSpacing: "0.05em" }}>
                {(author.credentials || []).map((c) => (
                  <span key={c} style={{ color: "#f59e0b" }}>[{c}]</span>
                ))}
                {author.linkedin && <a href={author.linkedin} target="_blank" rel="noopener" style={{ color: "#94a3b8", textDecoration: "none" }}>LINKEDIN</a>}
                {author.twitter && <a href={author.twitter} target="_blank" rel="noopener" style={{ color: "#94a3b8", textDecoration: "none" }}>X/TWITTER</a>}
                <span>·</span>
                <span>{author.isFounder ? "GLOBAL" : "LONDON.UK"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BIOGRAPHY */}
      <section style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "32px 16px" : "48px 24px" }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#f59e0b", letterSpacing: "0.15em", marginBottom: 12 }}>// BIOGRAPHY</div>
          <div style={{ maxWidth: 720 }}>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: "#cbd5e1", margin: "0 0 24px" }}>{author.bio}</p>
            <div style={{ borderLeft: "3px solid #f59e0b", paddingLeft: 20, margin: "28px 0" }}>
              <Quote size={18} color="#f59e0b" style={{ marginBottom: 8 }} />
              <p style={{ fontFamily: "Outfit", fontWeight: 500, fontSize: 20, lineHeight: 1.4, color: "#fff", margin: 0, letterSpacing: "-0.01em" }}>
                "{manifesto}"
              </p>
            </div>
            {author.specialty && (
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#94a3b8", letterSpacing: "0.08em" }}>
                EXPERTISE: {author.specialty.toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CITATIONS LOG */}
      {mentions.length > 0 && (
        <section style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "32px 16px" : "48px 24px" }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#f59e0b", letterSpacing: "0.15em", marginBottom: 20 }}>// CITATIONS &amp; COVERAGE</div>
            <div style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
              {mentions.map((m, i) => (
                <a key={i} href={m.url} target="_blank" rel="noopener" style={{
                  display: "grid",
                  gridTemplateColumns: mob ? "80px 1fr" : "90px 140px 1fr 24px",
                  gap: 16, padding: mob ? "12px 14px" : "14px 20px",
                  borderBottom: i === mentions.length - 1 ? "none" : "1px solid rgba(255,255,255,0.05)",
                  fontFamily: "'JetBrains Mono',monospace", fontSize: 12, textDecoration: "none", color: "#cbd5e1",
                  alignItems: "center",
                  transition: "background 0.15s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(245,158,11,0.05)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ color: "#f59e0b" }}>{m.date.toUpperCase()}</span>
                  {!mob && <span style={{ color: "#fff", fontWeight: 700 }}>{m.outlet.toUpperCase()}</span>}
                  <span style={{ color: mob ? "#cbd5e1" : "#cbd5e1", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
                    {mob && <span style={{ color: "#fff", fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, marginRight: 8 }}>{m.outlet.toUpperCase()}</span>}
                    "{m.title}"
                  </span>
                  {!mob && <ArrowUpRight size={14} color="#94a3b8" />}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LATEST OUTPUT */}
      <section style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "32px 16px" : "48px 24px" }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#f59e0b", letterSpacing: "0.15em", marginBottom: 20 }}>
            {author.isFounder ? "// PLATFORM TIMELINE" : "// LATEST OUTPUT"}
          </div>

          {author.isFounder ? (
            <div style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
              {milestones.map((m, i) => (
                <div key={i} style={{
                  display: "grid",
                  gridTemplateColumns: mob ? "90px 1fr" : "110px 1fr",
                  gap: 16, padding: mob ? "12px 14px" : "14px 20px",
                  borderBottom: i === milestones.length - 1 ? "none" : "1px solid rgba(255,255,255,0.05)",
                  fontFamily: "'JetBrains Mono',monospace", fontSize: 12,
                }}>
                  <span style={{ color: "#f59e0b", letterSpacing: "0.05em" }}>{m.date.toUpperCase()}</span>
                  <span>
                    <span style={{ color: "#fff", fontWeight: 700, display: "block", marginBottom: 4 }}>{m.title.toUpperCase()}</span>
                    <span style={{ color: "#94a3b8", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>{m.desc}</span>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
              {allWork.map((w, i) => (
                <div key={i} style={{
                  display: "grid",
                  gridTemplateColumns: mob ? "60px 70px 1fr" : "70px 90px 110px 1fr 24px",
                  gap: 12, padding: mob ? "10px 12px" : "12px 20px",
                  borderBottom: i === allWork.length - 1 ? "none" : "1px solid rgba(255,255,255,0.05)",
                  fontFamily: "'JetBrains Mono',monospace", fontSize: 12, alignItems: "center",
                }}>
                  <span style={{ color: "#64748b" }}>#{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ color: "#f59e0b" }}>{w.date.toUpperCase()}</span>
                  {!mob && <span style={{ color: "#34d399", fontSize: 10, letterSpacing: "0.1em" }}>{w.role}</span>}
                  <span style={{ color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500 }}>{w.title}</span>
                  {!mob && <ArrowUpRight size={14} color="#94a3b8" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}

// ─── VARIANT C — Magazine Profile (recommended) ───────────────────────────

function VariantC({ author, mob }) {
  const mentions = MEDIA_MENTIONS[author.id] || [];
  const feed = ACTIVITY_FEED[author.id] || [];
  const work = bucketFeed(feed);
  const milestones = MILESTONES[author.id] || [];
  const trust = getTrustNumbers(author, feed);
  const manifesto = getManifesto(author);
  const expertise = EXPERTISE_DEEP[author.id] || [];

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#fff" }}>

      {/* HERO — asymmetric Premium Dark */}
      <section style={{
        background: "linear-gradient(135deg, #0f172a 0%, #064e3b 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(135deg, transparent 0, transparent 11px, rgba(255,255,255,0.02) 11px, rgba(255,255,255,0.02) 12px)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "32px 16px 40px" : "72px 24px 80px", position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "minmax(220px, 280px) 1fr", gap: mob ? 24 : 56, alignItems: "center" }}>
            <div style={{ display: "flex", justifyContent: mob ? "center" : "flex-start" }}>
              <div style={{ position: "relative" }}>
                <AuthorAvatar author={author} size={mob ? 160 : 240} />
                <div style={{
                  position: "absolute", inset: -6, borderRadius: "50%",
                  border: "1px solid rgba(245,158,11,0.35)", pointerEvents: "none",
                }} />
              </div>
            </div>
            <div style={{ textAlign: mob ? "center" : "left" }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600, color: "#fbbf24", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14 }}>
                {author.role}
              </div>
              <h1 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 34 : 54, color: "#fff", margin: "0 0 18px", letterSpacing: "-0.03em", lineHeight: 1 }}>
                {author.name}
              </h1>
              <p style={{ fontSize: mob ? 17 : 22, color: "rgba(255,255,255,0.82)", lineHeight: 1.45, margin: "0 0 24px", maxWidth: 620, fontWeight: 300, letterSpacing: "-0.005em" }}>
                "{manifesto}"
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", justifyContent: mob ? "center" : "flex-start" }}>
                {(author.credentials || []).map((c) => (
                  <span key={c} style={{
                    padding: "5px 13px", borderRadius: 6, fontSize: 12, fontWeight: 700, letterSpacing: "0.05em",
                    background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)",
                  }}>{c}</span>
                ))}
                {author.linkedin && (
                  <a href={author.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn" style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 32, height: 32, borderRadius: 6, background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.2)", color: "#fff",
                  }}>
                    <Linkedin size={15} />
                  </a>
                )}
                {author.twitter && (
                  <a href={author.twitter} target="_blank" rel="noopener" aria-label="Twitter" style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 32, height: 32, borderRadius: 6, background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.2)", color: "#fff",
                  }}>
                    <Twitter size={15} />
                  </a>
                )}
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.55)", marginLeft: 6 }}>
                  <MapPin size={13} /> {author.isFounder ? "Global" : "London, UK"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.4) 50%, transparent 100%)" }} />
      </section>

      {/* TRUST RIBBON */}
      <section style={{ background: "#0f172a", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "16px" : "20px 24px" }}>
          <div style={{
            display: "flex", gap: mob ? 16 : 40, flexWrap: "wrap",
            justifyContent: mob ? "space-between" : "center", alignItems: "center",
            fontFamily: "'JetBrains Mono',monospace",
          }}>
            {trust.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: mob ? 15 : 18, fontWeight: 700, color: "#fff" }}>{t.num}</span>
                <span style={{ fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.5)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT — CREAM band */}
      <section style={{ background: "#fbf8f1", padding: mob ? "48px 16px" : "72px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, color: "#92400e", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>
            About
          </div>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 28 : 34, color: "#0f172a", margin: "0 0 28px", letterSpacing: "-0.02em" }}>
            About {author.name.split(" ")[0]}
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: "#1f2937", margin: "0 0 16px" }}>
            {author.bio}
          </p>
          {author.specialty && (
            <div style={{ fontSize: 14, color: "#475569", paddingTop: 20, marginTop: 28, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: 11, marginRight: 10 }}>Areas</span>
              {author.specialty}
            </div>
          )}
        </div>
      </section>

      {/* PULLQUOTE — cream with orange bookends */}
      <section style={{ background: "#fbf8f1", padding: mob ? "0 16px 48px" : "0 24px 72px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: -8, left: mob ? 0 : 40, fontSize: 80, color: "#f59e0b", fontFamily: "Georgia,serif", lineHeight: 1, opacity: 0.3 }}>"</div>
          <p style={{
            fontFamily: "Outfit", fontWeight: 500, fontSize: mob ? 22 : 32, lineHeight: 1.35,
            color: "#0f172a", margin: 0, letterSpacing: "-0.02em", position: "relative", zIndex: 1,
            padding: mob ? "0 20px" : "0 60px",
          }}>
            {author.isFounder
              ? "Advertising corrupts broker reviews. So we built a platform where advertisers never see the rankings before they're published."
              : "I don't trust a broker's spreads until I've opened a live $500 account and measured them myself, in London and New York sessions, for thirty days."}
          </p>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#64748b", letterSpacing: "0.15em", marginTop: 20, textTransform: "uppercase" }}>
            — {author.name.split(" ")[0]}, on {author.isFounder ? "independence" : "methodology"}
          </div>
        </div>
      </section>

      {/* FEATURED IN — white cards */}
      {mentions.length > 0 && (
        <section style={{ background: "#fff", padding: mob ? "48px 16px" : "72px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, color: "#64748b", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>
              As Featured In
            </div>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 24 : 28, color: "#0f172a", margin: "0 0 32px", letterSpacing: "-0.02em" }}>
              Where {author.name.split(" ")[0]} has been quoted
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 14 }}>
              {mentions.map((m, i) => (
                <a key={i} href={m.url} target="_blank" rel="noopener" style={{
                  display: "block", padding: "22px 24px", background: "#fff", borderRadius: 14,
                  border: "1px solid #e2e8f0", textDecoration: "none", color: "inherit",
                  transition: "box-shadow 0.2s, transform 0.2s, border-color 0.2s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 16, color: "#0f172a", letterSpacing: "-0.01em" }}>{m.outlet}</span>
                    <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: "#94a3b8", letterSpacing: "0.05em" }}>{m.date}</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", lineHeight: 1.4, marginBottom: 12 }}>{m.title}</div>
                  <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>{m.quote}</p>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "#059669", fontWeight: 600, marginTop: 14 }}>
                    Read <ExternalLink size={11} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {!mentions.length && author.isFounder && (
        <section style={{ background: "#fff", padding: mob ? "32px 16px" : "48px 24px" }}>
          <div style={{ maxWidth: 780, margin: "0 auto", padding: "20px 24px", background: "#fff8e1", borderRadius: 12, border: "1px solid #fde68a", fontSize: 14, color: "#78350f", lineHeight: 1.6 }}>
            <Sparkles size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 6, color: "#f59e0b" }} />
            <strong>{author.name.split(" ")[0]}</strong> works exclusively for RatedBrokers and has not yet been quoted in third-party publications. External citations will appear here as they're earned.
          </div>
        </section>
      )}


      {/* LATEST WORK / MILESTONES */}
      <section style={{ background: "#f8fafc", padding: mob ? "48px 16px" : "72px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, color: "#64748b", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>
            Portfolio
          </div>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 24 : 28, color: "#0f172a", margin: "0 0 28px", letterSpacing: "-0.02em" }}>
            {author.isFounder ? "Platform Milestones" : `Latest work by ${author.name.split(" ")[0]}`}
          </h2>
          {author.isFounder ? (
            <div style={{ background: "#fff", borderRadius: 14, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.05)", overflow: "hidden" }}>
              {milestones.map((m, i) => (
                <div key={i} style={{
                  display: "flex", gap: 20, padding: mob ? "16px" : "20px 24px",
                  borderBottom: i === milestones.length - 1 ? "none" : "1px solid rgba(0,0,0,0.05)",
                  alignItems: "flex-start",
                }}>
                  <div style={{ flexShrink: 0, width: mob ? 80 : 100, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600, color: "#059669", letterSpacing: "0.05em", paddingTop: 3 }}>{m.date}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 4 }}>{m.title}</div>
                    <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.55 }}>{m.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <LatestWorkTabs work={work} mob={mob} tint="green" />
          )}
        </div>
      </section>

      {/* EXPERTISE DEEP (analyst only) */}
      {!author.isFounder && expertise.length > 0 && (
        <section style={{ background: "#fff", padding: mob ? "48px 16px" : "72px 24px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, color: "#64748b", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>
              Methodology
            </div>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 24 : 28, color: "#0f172a", margin: "0 0 28px", letterSpacing: "-0.02em" }}>
              How {author.name.split(" ")[0]} reviews brokers
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 20 }}>
              {expertise.map((e, i) => (
                <div key={i} style={{ padding: "24px 26px", background: "#fbf8f1", borderRadius: 14, border: "1px solid rgba(245,158,11,0.2)" }}>
                  <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 18, color: "#0f172a", margin: "0 0 14px" }}>{e.title}</h3>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {e.points.map((p, j) => (
                      <li key={j} style={{ fontSize: 14, color: "#1f2937", lineHeight: 1.65, marginBottom: 10, paddingLeft: 18, position: "relative" }}>
                        <span style={{ position: "absolute", left: 0, top: 7, width: 6, height: 6, borderRadius: "50%", background: "#f59e0b" }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA — cream footer */}
      <section style={{ background: "#fbf8f1", padding: mob ? "40px 16px" : "56px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, color: "#92400e", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>
            Get in touch
          </div>
          <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 22 : 28, color: "#0f172a", margin: "0 0 20px", letterSpacing: "-0.02em" }}>
            Have a question for {author.name.split(" ")[0]}?
          </h3>
          <a href="/contact" style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 26px",
            background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
            borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none",
            boxShadow: "0 4px 14px rgba(245,158,11,0.3)",
          }}>
            <Mail size={16} /> Ask the team
          </a>
        </div>
      </section>
    </div>
  );
}

// ─── Shared: LatestSection wrapper ────────────────────────────────────────

function LatestSection({ title, children, mob }) {
  return (
    <section style={{ maxWidth: 1000, margin: "0 auto", padding: mob ? "32px 16px" : "48px 24px" }}>
      <h2 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 24, color: "#0f172a", margin: "0 0 20px" }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

// ─── Shared: Latest Work tabs (used by A and C) ───────────────────────────

function LatestWorkTabs({ work, mob, tint = "green" }) {
  const [tab, setTab] = useState("written");
  const tabs = [
    { key: "written", label: `Written (${work.written.length})`, items: work.written },
    { key: "reviewed", label: `Reviewed (${work.reviewed.length})`, items: work.reviewed },
    { key: "factChecked", label: `Fact-checked (${work.factChecked.length})`, items: work.factChecked },
  ];
  const items = tabs.find(t => t.key === tab)?.items || [];

  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: "7px 14px", borderRadius: 999, border: "1px solid",
            borderColor: tab === t.key ? "#0f172a" : "#e2e8f0",
            background: tab === t.key ? "#0f172a" : "#fff",
            color: tab === t.key ? "#fff" : "#475569",
            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            transition: "all 0.15s",
          }}>{t.label}</button>
        ))}
      </div>
      {items.length === 0 ? (
        <div style={{ padding: "32px 24px", background: "#fff", borderRadius: 14, border: "1px dashed #cbd5e1", textAlign: "center", color: "#64748b", fontSize: 14 }}>
          No {tab === "written" ? "written" : tab === "reviewed" ? "reviewed" : "fact-checked"} articles yet.
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 14, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          {items.map((item, i) => (
            <a key={i} href={item.slug} className="d2k-row" style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: mob ? "14px 16px" : "16px 20px",
              borderBottom: i === items.length - 1 ? "none" : "1px solid rgba(0,0,0,0.04)",
              background: "transparent", textDecoration: "none", color: "inherit",
            }}>
              <div style={{
                flexShrink: 0, width: 36, height: 36, borderRadius: 8,
                background: item.type === "Review" ? "#e6f5ef" : "#fff7ed",
                color: item.type === "Review" ? "#059669" : "#c2410c",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {item.type === "Review" ? <BookOpen size={17} /> : <Award size={17} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: mob ? 15 : 15, fontWeight: 600, color: "#0f172a", lineHeight: 1.3, marginBottom: 3 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: "#64748b", display: "flex", gap: 8, alignItems: "center" }}>
                  <span>{item.type}</span>
                  <span style={{ color: "#cbd5e1" }}>·</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace" }}>{item.date}</span>
                </div>
              </div>
              <ArrowRight className="d2k-arrow" size={16} color="#94a3b8" />
            </a>
          ))}
        </div>
      )}
    </>
  );
}

// ─── Main Proto Shell ─────────────────────────────────────────────────────

export default function AuthorProto() {
  const { mob } = useMedia();
  const [variant, setVariant] = useState("A");
  const [authorKey, setAuthorKey] = useState("marcus-chen");

  const author = AUTHORS[authorKey];
  const currentVariant = VARIANTS.find(v => v.key === variant);

  return (
    <div style={{ background: variant === "B" ? "#0b1120" : "#fff", minHeight: "100vh" }}>

      {/* Sticky variant switcher */}
      <div style={{
        position: "sticky", top: 64, zIndex: 100,
        background: "#fff", borderBottom: "1px solid #e2e8f0",
        padding: mob ? "12px 16px" : "14px 24px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
            Author Page — Concept (Barbara, 2026-04-16)
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {VARIANTS.map(v => (
                <button key={v.key} onClick={() => setVariant(v.key)} style={{
                  padding: "7px 14px", borderRadius: 8, border: "none",
                  background: variant === v.key ? "#0f172a" : "#f1f5f9",
                  color: variant === v.key ? "#fff" : "#475569",
                  fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                }}>{v.label}</button>
              ))}
            </div>
            <div style={{ width: 1, height: 24, background: "#e2e8f0" }} />
            <div style={{ display: "flex", gap: 6 }}>
              {AUTHORS_LIST.map(a => (
                <button key={a.key} onClick={() => setAuthorKey(a.key)} style={{
                  padding: "7px 14px", borderRadius: 8, border: "1px solid",
                  borderColor: authorKey === a.key ? "#059669" : "#e2e8f0",
                  background: authorKey === a.key ? "#ecfdf5" : "#fff",
                  color: authorKey === a.key ? "#059669" : "#64748b",
                  fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                }}>{a.label}</button>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}>
            {currentVariant.desc}
          </div>
        </div>
      </div>

      {variant === "A" && <VariantA author={author} mob={mob} />}
      {variant === "B" && <VariantB author={author} mob={mob} />}
      {variant === "C" && <VariantC author={author} mob={mob} />}
    </div>
  );
}
