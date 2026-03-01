export function canonicalPair(slugA, slugB) {
  return [slugA, slugB].sort().join("-vs-");
}

export function parsePair(pairParam) {
  const idx = pairParam.indexOf("-vs-");
  if (idx === -1) return null;
  return [pairParam.slice(0, idx), pairParam.slice(idx + 4)];
}

/*
 * Manually ordered by estimated search volume.
 * Top pairs first — these get the "Most Popular" badge on /compare.
 */
export const POPULAR_PAIRS = [
  // Tier 1 — highest search volume rivalries
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
  // Tier 1.5 — cross-tier high volume
  { slugA: "etoro", slugB: "plus500" },
  { slugA: "ig", slugB: "saxo-bank" },
  { slugA: "avatrade", slugB: "pepperstone" },
  { slugA: "fusion-markets", slugB: "ic-markets" },
];

const TOP_10 = [
  "capital-com", "etoro", "exness", "fp-markets", "ic-markets",
  "ig", "oanda", "pepperstone", "xm", "xtb",
];

// Generate all C(10,2) = 45 top-10 pairs
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

// Deduplicated full list: POPULAR first, then remaining pairs
const popularKeys = new Set(POPULAR_PAIRS.map(p => canonicalPair(p.slugA, p.slugB)));
const allRaw = [...topPairsAll, ...CROSS_TIER];
const remaining = allRaw.filter(p => !popularKeys.has(canonicalPair(p.slugA, p.slugB)));

export const FEATURED_PAIRS = [...POPULAR_PAIRS, ...remaining];
