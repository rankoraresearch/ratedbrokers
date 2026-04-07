export function canonicalPair(slugA, slugB) {
  return [slugA, slugB].sort().join("-vs-");
}

export function parsePair(pairParam) {
  const idx = pairParam.indexOf("-vs-");
  if (idx === -1) return null;
  return [pairParam.slice(0, idx), pairParam.slice(idx + 4)];
}

/* ── Verticals ─────────────────────────────────────── */

export const VERTICALS = [
  { key: "all", label: "All Brokers", icon: "layers" },
  { key: "forex", label: "Forex & CFD", icon: "trending-up" },
  { key: "stocks", label: "Stocks & ETF", icon: "bar-chart-3" },
  { key: "options", label: "Options", icon: "target" },
  { key: "futures", label: "Futures", icon: "activity" },
  { key: "copy-trading", label: "Copy Trading", icon: "users" },
  { key: "crypto", label: "Crypto", icon: "bitcoin" },
  { key: "spread-betting", label: "Spread Betting", icon: "zap" },
];

/* ── Popular Pairs by Vertical ─────────────────────── */

export const POPULAR_PAIRS_BY_VERTICAL = {
  forex: [
    { slugA: "ic-markets", slugB: "pepperstone" },
    { slugA: "etoro", slugB: "xtb" },
    { slugA: "ic-markets", slugB: "xm" },
    { slugA: "pepperstone", slugB: "xm" },
    { slugA: "ig", slugB: "pepperstone" },
    { slugA: "exness", slugB: "ic-markets" },
    { slugA: "etoro", slugB: "ig" },
    { slugA: "ic-markets", slugB: "oanda" },
    { slugA: "etoro", slugB: "pepperstone" },
    { slugA: "exness", slugB: "xm" },
    { slugA: "ic-markets", slugB: "ig" },
    { slugA: "fp-markets", slugB: "ic-markets" },
    { slugA: "etoro", slugB: "plus500" },
    { slugA: "ig", slugB: "saxo-bank" },
    { slugA: "avatrade", slugB: "pepperstone" },
    { slugA: "fusion-markets", slugB: "ic-markets" },
  ],
  stocks: [
    { slugA: "charles-schwab", slugB: "fidelity" },
    { slugA: "robinhood", slugB: "webull" },
    { slugA: "fidelity", slugB: "robinhood" },
    { slugA: "etrade", slugB: "charles-schwab" },
    { slugA: "degiro", slugB: "interactive-brokers" },
    { slugA: "interactive-brokers", slugB: "charles-schwab" },
    { slugA: "trading-212", slugB: "degiro" },
    { slugA: "robinhood", slugB: "moomoo" },
    { slugA: "etoro", slugB: "trading-212" },
    { slugA: "webull", slugB: "moomoo" },
    { slugA: "trade-republic", slugB: "degiro" },
    { slugA: "saxo-bank", slugB: "interactive-brokers" },
  ],
  options: [
    { slugA: "tastytrade", slugB: "robinhood" },
    { slugA: "tastytrade", slugB: "interactive-brokers" },
    { slugA: "charles-schwab", slugB: "fidelity" },
    { slugA: "etrade", slugB: "tastytrade" },
    { slugA: "robinhood", slugB: "webull" },
    { slugA: "interactive-brokers", slugB: "charles-schwab" },
    { slugA: "moomoo", slugB: "webull" },
    { slugA: "tastytrade", slugB: "tradestation" },
  ],
  futures: [
    { slugA: "ninjatrader", slugB: "tradestation" },
    { slugA: "amp-futures", slugB: "ninjatrader" },
    { slugA: "optimus-futures", slugB: "amp-futures" },
    { slugA: "interactive-brokers", slugB: "ninjatrader" },
    { slugA: "charles-schwab", slugB: "tradestation" },
    { slugA: "tastytrade", slugB: "ninjatrader" },
    { slugA: "ninjatrader", slugB: "optimus-futures" },
    { slugA: "tradestation", slugB: "interactive-brokers" },
  ],
  "copy-trading": [
    { slugA: "etoro", slugB: "ic-markets" },
    { slugA: "etoro", slugB: "pepperstone" },
    { slugA: "etoro", slugB: "avatrade" },
    { slugA: "ic-markets", slugB: "pepperstone" },
    { slugA: "fp-markets", slugB: "ic-markets" },
    { slugA: "exness", slugB: "ic-markets" },
    { slugA: "axi", slugB: "pepperstone" },
    { slugA: "etoro", slugB: "naga" },
  ],
  crypto: [
    { slugA: "etoro", slugB: "robinhood" },
    { slugA: "interactive-brokers", slugB: "etoro" },
    { slugA: "webull", slugB: "robinhood" },
    { slugA: "etoro", slugB: "trading-212" },
    { slugA: "capital-com", slugB: "etoro" },
    { slugA: "pepperstone", slugB: "ic-markets" },
    { slugA: "saxo-bank", slugB: "interactive-brokers" },
    { slugA: "xtb", slugB: "etoro" },
  ],
  "spread-betting": [
    { slugA: "ig", slugB: "pepperstone" },
    { slugA: "ig", slugB: "cmc-markets" },
    { slugA: "spreadex", slugB: "ig" },
    { slugA: "ig", slugB: "saxo-bank" },
    { slugA: "cmc-markets", slugB: "pepperstone" },
    { slugA: "capital-com", slugB: "ig" },
  ],
};

/* ── Mixed "All" popular pairs (top from each vertical) ── */

export const POPULAR_PAIRS_ALL = [
  { slugA: "ic-markets", slugB: "pepperstone", vertical: "forex" },
  { slugA: "etoro", slugB: "xtb", vertical: "forex" },
  { slugA: "ic-markets", slugB: "xm", vertical: "forex" },
  { slugA: "charles-schwab", slugB: "fidelity", vertical: "stocks" },
  { slugA: "robinhood", slugB: "webull", vertical: "stocks" },
  { slugA: "fidelity", slugB: "robinhood", vertical: "stocks" },
  { slugA: "tastytrade", slugB: "interactive-brokers", vertical: "options" },
  { slugA: "ninjatrader", slugB: "tradestation", vertical: "futures" },
  { slugA: "etoro", slugB: "ic-markets", vertical: "copy-trading" },
  { slugA: "etoro", slugB: "robinhood", vertical: "crypto" },
  { slugA: "ig", slugB: "pepperstone", vertical: "spread-betting" },
  { slugA: "exness", slugB: "ic-markets", vertical: "forex" },
];

/* ── Legacy exports (backward compatibility) ── */

export const POPULAR_PAIRS = POPULAR_PAIRS_BY_VERTICAL.forex;

/* ── ALL_PAIRS: deduplicated union of every vertical ── */

const allVerticalPairs = Object.values(POPULAR_PAIRS_BY_VERTICAL).flat();

const TOP_10 = [
  "capital-com", "etoro", "exness", "fp-markets", "ic-markets",
  "ig", "oanda", "pepperstone", "xm", "xtb",
];

const topPairsAll = [];
for (let i = 0; i < TOP_10.length; i++) {
  for (let j = i + 1; j < TOP_10.length; j++) {
    topPairsAll.push({ slugA: TOP_10[i], slugB: TOP_10[j] });
  }
}

const CROSS_TIER = [
  { slugA: "fusion-markets", slugB: "ic-markets" },
  { slugA: "avatrade", slugB: "pepperstone" },
  { slugA: "fp-markets", slugB: "vantage" },
  { slugA: "ic-markets", slugB: "tickmill" },
  { slugA: "exness", slugB: "fxpro" },
  { slugA: "hfm", slugB: "xm" },
  { slugA: "ig", slugB: "saxo-bank" },
  { slugA: "etoro", slugB: "plus500" },
  { slugA: "cmc-markets", slugB: "oanda" },
  { slugA: "admirals", slugB: "xtb" },
];

// Deduplicate: all vertical pairs + forex top-10 combos + cross-tier
const seenKeys = new Set();
const deduped = [];
[...allVerticalPairs, ...topPairsAll, ...CROSS_TIER].forEach(p => {
  const key = canonicalPair(p.slugA, p.slugB);
  if (!seenKeys.has(key)) {
    seenKeys.add(key);
    deduped.push(p);
  }
});

export const FEATURED_PAIRS = deduped;
