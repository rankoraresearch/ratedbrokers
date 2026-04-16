/**
 * Author activity data — static module. Wired into every /author/:slug page.
 *
 * When the D1 `editorial_actions` table ships (see EDITORIAL-ACTIVITY-LOG.md),
 * ACTIVITY_FEED + MEDIA_MENTIONS shift to API fetch via `/api/authors/:id/activity`.
 * Until then: static mock preserves the exact API shape so the swap is 1:1.
 */

// ─── Outlet wordmark styles (typography-based, one monochrome standard) ──
export const OUTLET_STYLES = {
  "Bloomberg":               { fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 900, fontSize: 22, letterSpacing: "-0.02em", fontStyle: "italic" },
  "REUTERS":                 { fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: "0.02em" },
  "The Wall Street Journal": { fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 14, letterSpacing: "0.01em", textTransform: "uppercase" },
  "FINANCIAL TIMES":         { fontFamily: "Georgia, serif", fontWeight: 600, fontSize: 15, letterSpacing: "0.12em" },
  "CNBC":                    { fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 900, fontSize: 22, letterSpacing: "-0.03em" },
  "CNN":                     { fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 900, fontSize: 24, letterSpacing: "-0.05em", fontStyle: "italic" },
  "Forbes":                  { fontFamily: "'Times New Roman', Georgia, serif", fontWeight: 900, fontSize: 23, letterSpacing: "-0.02em" },
  "MarketWatch":             { fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 800, fontSize: 19, letterSpacing: "-0.01em" },
  "BUSINESS INSIDER":        { fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 900, fontSize: 15, letterSpacing: "0.04em" },
  "The Economist":           { fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 19, fontStyle: "italic", letterSpacing: "-0.01em" },
};

export const ROLE_LABEL = {
  writer: "Wrote",
  reviewer: "Reviewed",
  "fact-checker": "Fact-checked",
};

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export function monthLabel(isoMonth) {
  const [y, m] = isoMonth.split("-");
  return `${MONTH_NAMES[parseInt(m, 10) - 1]} ${y}`;
}
export function pageTypeLabel(type) {
  return type === "Review" ? "Broker review" : "Ranking";
}

// ─── Media mentions (cards on author page) ──
export const MEDIA_MENTIONS = {
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
  "sarah-williams": [
    {
      outlet: "CNBC",
      title: "Crypto CFDs: why regulators are circling",
      date: "Apr 2026",
      quote: "\"Leverage limits on crypto derivatives are the first domino — expect margin rules next,\" said Sarah Williams, Senior Editor at RatedBrokers.",
      url: "https://www.cnbc.com/",
    },
    {
      outlet: "The Economist",
      title: "Multi-asset platforms: the all-in-one bet",
      date: "Feb 2026",
      quote: "\"Retail traders want one login, one tax report, one platform — brokers who solve that will own the decade,\" — Williams.",
      url: "https://www.economist.com/",
    },
  ],
  "elena-petrova": [],
  "david-kowalski": [
    {
      outlet: "Forbes",
      title: "How I check whether a 'regulated broker' is actually regulated",
      date: "Mar 2026",
      quote: "\"Passport-style disclosures are what catches 80% of rogue setups — everyone else's audit is downstream,\" said David Kowalski.",
      url: "https://www.forbes.com/",
    },
  ],
  "yegor-barakovskiy": [],
};

// ─── Activity feed (unified timeline per author, sorted DESC by acted_at) ──
// Shape matches /api/authors/:id/activity (see EDITORIAL-ACTIVITY-LOG.md §5.1).
export const ACTIVITY_FEED = {
  "marcus-chen": [
    { date: "Apr 13", isoDate: "2026-04-13", role: "writer",       title: "IC Markets Review 2026",      type: "Review",  slug: "/reviews/ic-markets" },
    { date: "Apr 12", isoDate: "2026-04-12", role: "fact-checker", title: "Best Forex Brokers UK 2026",  type: "Ranking", slug: "/best-forex-brokers-uk" },
    { date: "Apr 10", isoDate: "2026-04-10", role: "reviewer",     title: "IG Review",                   type: "Review",  slug: "/reviews/ig" },
    { date: "Apr 8",  isoDate: "2026-04-08", role: "writer",       title: "Best ECN Brokers 2026",       type: "Ranking", slug: "/best-ecn-brokers" },
    { date: "Apr 7",  isoDate: "2026-04-07", role: "fact-checker", title: "Admirals Review",             type: "Review",  slug: "/reviews/admirals" },
    { date: "Apr 5",  isoDate: "2026-04-05", role: "writer",       title: "Pepperstone Review",          type: "Review",  slug: "/reviews/pepperstone" },
    { date: "Apr 3",  isoDate: "2026-04-03", role: "reviewer",     title: "Best CFD Brokers 2026",       type: "Ranking", slug: "/best-cfd-brokers" },
    { date: "Mar 30", isoDate: "2026-03-30", role: "reviewer",     title: "Saxo Bank Review",            type: "Review",  slug: "/reviews/saxo-bank" },
    { date: "Mar 28", isoDate: "2026-03-28", role: "writer",       title: "Best MT5 Brokers 2026",       type: "Ranking", slug: "/best-mt5-brokers" },
    { date: "Mar 22", isoDate: "2026-03-22", role: "writer",       title: "eToro Review — Updated",      type: "Review",  slug: "/reviews/etoro" },
  ],
  "sarah-williams": [
    { date: "Apr 14", isoDate: "2026-04-14", role: "reviewer",     title: "Binance Review",              type: "Review",  slug: "/reviews/binance" },
    { date: "Apr 11", isoDate: "2026-04-11", role: "writer",       title: "Best Crypto CFD Brokers 2026", type: "Ranking", slug: "/best-crypto-cfd-brokers" },
    { date: "Apr 9",  isoDate: "2026-04-09", role: "reviewer",     title: "Plus500 Review",              type: "Review",  slug: "/reviews/plus500" },
    { date: "Apr 4",  isoDate: "2026-04-04", role: "writer",       title: "Best Multi-Asset Brokers 2026", type: "Ranking", slug: "/best-multi-asset-brokers" },
    { date: "Mar 29", isoDate: "2026-03-29", role: "reviewer",     title: "Interactive Brokers Review",  type: "Review",  slug: "/reviews/interactive-brokers" },
    { date: "Mar 25", isoDate: "2026-03-25", role: "writer",       title: "Best Copy Trading Platforms 2026", type: "Ranking", slug: "/best-copy-trading-platforms" },
    { date: "Mar 20", isoDate: "2026-03-20", role: "reviewer",     title: "XTB Review",                  type: "Review",  slug: "/reviews/xtb" },
  ],
  "elena-petrova": [
    { date: "Apr 13", isoDate: "2026-04-13", role: "reviewer",     title: "IC Markets Review 2026",      type: "Review",  slug: "/reviews/ic-markets" },
    { date: "Apr 12", isoDate: "2026-04-12", role: "reviewer",     title: "Best ECN Brokers 2026",       type: "Ranking", slug: "/best-ecn-brokers" },
    { date: "Apr 8",  isoDate: "2026-04-08", role: "writer",       title: "Best Algo Trading Brokers 2026", type: "Ranking", slug: "/best-algo-trading-brokers" },
    { date: "Apr 4",  isoDate: "2026-04-04", role: "reviewer",     title: "Saxo Bank Review",            type: "Review",  slug: "/reviews/saxo-bank" },
    { date: "Mar 28", isoDate: "2026-03-28", role: "writer",       title: "Best MT5 Brokers for API Access 2026", type: "Ranking", slug: "/best-mt5-api-brokers" },
    { date: "Mar 18", isoDate: "2026-03-18", role: "reviewer",     title: "Pepperstone Review",          type: "Review",  slug: "/reviews/pepperstone" },
  ],
  "david-kowalski": [
    { date: "Apr 15", isoDate: "2026-04-15", role: "fact-checker", title: "IC Markets Review 2026",      type: "Review",  slug: "/reviews/ic-markets" },
    { date: "Apr 11", isoDate: "2026-04-11", role: "fact-checker", title: "Best Regulated Forex Brokers 2026", type: "Ranking", slug: "/best-regulated-forex-brokers" },
    { date: "Apr 7",  isoDate: "2026-04-07", role: "fact-checker", title: "Admirals Review",             type: "Review",  slug: "/reviews/admirals" },
    { date: "Apr 2",  isoDate: "2026-04-02", role: "fact-checker", title: "Best FCA-Regulated Brokers 2026", type: "Ranking", slug: "/best-fca-regulated-brokers" },
    { date: "Mar 27", isoDate: "2026-03-27", role: "fact-checker", title: "Pepperstone Review",          type: "Review",  slug: "/reviews/pepperstone" },
    { date: "Mar 24", isoDate: "2026-03-24", role: "fact-checker", title: "Best CySEC-Regulated Brokers 2026", type: "Ranking", slug: "/best-cysec-regulated-brokers" },
  ],
  "yegor-barakovskiy": [],
};

// ─── Platform milestones (founder only) ──
export const MILESTONES = {
  "yegor-barakovskiy": [
    { date: "Jan 2024", title: "Founded RatedBrokers", desc: "Domain registered, editorial methodology drafted." },
    { date: "Oct 2024", title: "First 20 broker reviews", desc: "Pilot coverage of Tier-1 forex/CFD brokers." },
    { date: "Feb 2026", title: "38 reviews, 207 rankings live", desc: "Multi-vertical rollout: forex, crypto, stocks, alternatives." },
    { date: "Mar 2026", title: "Admin Panel + Backend API live", desc: "Cloudflare Workers + D1, click tracking, Ranking Manager." },
    { date: "Apr 2026", title: "52 brokers, 293 rankings, 5-person team", desc: "M4 umbrella complete, editorial expansion." },
  ],
};

// ─── Helpers ──
export function bucketFeed(feed) {
  return {
    written:     feed.filter(f => f.role === "writer"),
    reviewed:    feed.filter(f => f.role === "reviewer"),
    factChecked: feed.filter(f => f.role === "fact-checker"),
  };
}

export function lastActivityLabel(feed) {
  if (!feed?.length) return "—";
  return feed[0].date.toUpperCase();
}

export function getTrustNumbers(author, feed = []) {
  if (author.isFounder) {
    return [
      { num: "10+",  label: "YEARS TRADING" },
      { num: "2024", label: "FOUNDED" },
      { num: "293",  label: "RANKINGS PUBLISHED" },
      { num: "APR 16", label: "UPDATED" },
    ];
  }
  const counts = bucketFeed(feed);
  return [
    { num: parseInt(author.exp) || 14,                                label: "YEARS EXPERIENCE" },
    { num: counts.written.length || author.reviews || 0,              label: "REVIEWS WRITTEN" },
    { num: counts.reviewed.length + counts.factChecked.length,        label: "REVIEW / FACT-CHECK PASSES" },
    { num: lastActivityLabel(feed),                                    label: "LAST UPDATE" },
  ];
}

export function getManifesto(author) {
  if (author.isFounder) {
    return "We built RatedBrokers because advertising corrupts broker reviews.";
  }
  return author.shortBio || "Independent broker analyst at RatedBrokers.";
}
