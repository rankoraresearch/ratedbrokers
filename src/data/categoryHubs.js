/**
 * Category Hub Configuration — M4 Online Brokers Umbrella
 * Each hub = one landing page for a broker vertical.
 */
import RANKINGS from "./rankings";

const HUBS = [
  {
    slug: "forex",
    path: "/forex-brokers",
    name: "Forex Brokers",
    title: "Forex Brokers",
    subtitle: "Compare forex brokers across spreads, execution, platforms, and regulation.",
    icon: "trending-up",
    color: "#059669",
    category: "forex",       // matches rankings.js category
    verticalKey: "forex",    // matches B.verticals[]
    featuredIds: ["forex-overall", "forex-beginners", "forex-scalping", "low-spread", "ecn"],
  },
  {
    slug: "cfd",
    path: "/cfd-trading",
    name: "CFD Brokers",
    title: "CFD Brokers",
    subtitle: "Find the best CFD trading platforms for stocks, indices, commodities, and more.",
    icon: "bar-chart-3",
    color: "#2563eb",
    category: "cfd",
    verticalKey: "cfd",
    featuredIds: ["cfd", "cfd-beginners", "cfd-low-spread", "cfd-uk", "cfd-australia"],
  },
  {
    slug: "copy-trading",
    path: "/copy-trading",
    name: "Copy Trading",
    title: "Copy Trading Platforms",
    subtitle: "Follow and replicate expert traders automatically. Compare the best copy trading platforms.",
    icon: "handshake",
    color: "#7c3aed",
    category: "copy-trading",
    verticalKey: "copy-trading",
    featuredIds: ["forex-copy-trading", "ct-beginners", "ct-apps", "forex-social-trading", "ct-forex"],
  },
  {
    slug: "spread-betting",
    path: "/spread-betting",
    name: "Spread Betting",
    title: "Spread Betting Platforms",
    subtitle: "Tax-free trading for UK and Ireland. Compare the best spread betting brokers.",
    icon: "target",
    color: "#dc2626",
    category: "spread-betting",
    verticalKey: "spread-betting",
    featuredIds: ["spread-betting", "sb-beginners", "sb-apps", "sb-uk", "sb-forex"],
  },
  {
    slug: "crypto",
    path: "/crypto-trading",
    name: "Crypto Brokers",
    title: "Crypto Brokers",
    subtitle: "Trade Bitcoin, Ethereum, and altcoins through regulated brokers and exchanges.",
    icon: "bitcoin",
    color: "#f59e0b",
    category: "crypto",
    verticalKey: "crypto",
    featuredIds: ["crypto-overall", "crypto-beginners", "crypto-btc-etf", "crypto-regulated", "crypto-uk"],
  },
];

/**
 * Get hub config by slug
 */
export function getHubBySlug(slug) {
  return HUBS.find(h => h.slug === slug) || null;
}

/**
 * Get all rankings belonging to a hub's category
 */
export function getRankingsForHub(hub) {
  // Hub rankings = rankings with matching category OR matching vertical field
  return RANKINGS.filter(r =>
    r.category === hub.category || r.vertical === hub.verticalKey
  );
}

/**
 * Get featured rankings for a hub (ordered)
 */
export function getFeaturedRankings(hub) {
  return hub.featuredIds
    .map(id => RANKINGS.find(r => r.id === id))
    .filter(Boolean);
}

// Phase 2 hubs
HUBS.push(
  {
    slug: "stocks",
    path: "/stock-trading",
    name: "Stock Brokers",
    title: "Stock Brokers",
    subtitle: "Compare stock brokers for commission-free investing, fractional shares, and retirement accounts.",
    icon: "building-2",
    color: "#0ea5e9",
    category: "stocks",
    verticalKey: "stocks",
    featuredIds: ["stocks-overall", "stocks-beginners", "stocks-commission-free", "stocks-fractional", "stocks-usa"],
  },
  {
    slug: "options",
    path: "/options-trading",
    name: "Options Brokers",
    title: "Options Brokers",
    subtitle: "Find the best options trading platforms with advanced chains, Greeks, and multi-leg support.",
    icon: "layers",
    color: "#8b5cf6",
    category: "options",
    verticalKey: "options",
    featuredIds: ["options", "options-beginners", "options-platforms", "options-zero-fee", "options-usa"],
  },
  {
    slug: "futures",
    path: "/futures-trading",
    name: "Futures Brokers",
    title: "Futures Brokers",
    subtitle: "Compare futures brokers for micro contracts, low margins, and professional DOM tools.",
    icon: "clock",
    color: "#ea580c",
    category: "futures",
    verticalKey: "futures",
    featuredIds: ["futures", "futures-beginners", "futures-micro", "futures-low-fee", "futures-usa"],
  }
);

export default HUBS;
