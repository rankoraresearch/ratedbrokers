/**
 * Combinatorial Rankings Engine for RatedBrokers.com
 * Generates Type × Country ranking pages programmatically.
 * 16 types × 15 countries = 240 pages.
 *
 * URL pattern: /best-{type}-forex-brokers-in-{country}
 * Each page uses the existing RankingPage.jsx 8-block template.
 */

// ═══════════════════════════════════════════════════════════════
// TYPE DEFINITIONS (16)
// ═══════════════════════════════════════════════════════════════

const COMBI_TYPES = [
  { id: "ecn",           label: "ECN",            slug: "ecn",            icon: "activity" },
  { id: "low-spread",    label: "Low Spread",     slug: "low-spread",     icon: "trending-down" },
  { id: "beginners",     label: "Beginners",      slug: "beginners",      icon: "graduation-cap" },
  { id: "scalping",      label: "Scalping",       slug: "scalping",       icon: "crosshair" },
  { id: "mt4",           label: "MT4",            slug: "mt4",            icon: "chart-candlestick" },
  { id: "mt5",           label: "MT5",            slug: "mt5",            icon: "chart-line" },
  { id: "high-leverage", label: "High Leverage",  slug: "high-leverage",  icon: "trending-up" },
  { id: "copy-trading",  label: "Copy Trading",   slug: "copy-trading",   icon: "copy" },
  { id: "islamic",       label: "Islamic",        slug: "islamic",        icon: "moon" },
  { id: "cfd",           label: "CFD",            slug: "cfd",            icon: "chart-candlestick" },
  { id: "regulated",     label: "Regulated",      slug: "regulated",      icon: "shield-check" },
  { id: "zero-spread",   label: "Zero Spread",    slug: "zero-spread",    icon: "circle-off" },
  { id: "demo",          label: "Demo Account",   slug: "demo",           icon: "gamepad-2" },
  { id: "day-trading",   label: "Day Trading",    slug: "day-trading",    icon: "sun" },
  { id: "tradingview",   label: "TradingView",    slug: "tradingview",    icon: "chart-no-axes-combined" },
  { id: "trading-apps",  label: "Trading Apps",   slug: "trading-apps",   icon: "smartphone" },
];

// ═══════════════════════════════════════════════════════════════
// COUNTRY DEFINITIONS (15)
// ═══════════════════════════════════════════════════════════════

const COMBI_COUNTRIES = [
  { id: "uk",           name: "UK",             slug: "uk",             regulator: "FCA",      currency: "GBP" },
  { id: "australia",    name: "Australia",       slug: "australia",      regulator: "ASIC",     currency: "AUD" },
  { id: "usa",          name: "USA",             slug: "usa",            regulator: "NFA/CFTC", currency: "USD" },
  { id: "germany",      name: "Germany",         slug: "germany",        regulator: "BaFin",    currency: "EUR" },
  { id: "singapore",    name: "Singapore",       slug: "singapore",      regulator: "MAS",      currency: "SGD" },
  { id: "uae",          name: "UAE",             slug: "uae",            regulator: "DFSA",     currency: "AED" },
  { id: "canada",       name: "Canada",          slug: "canada",         regulator: "IIROC",    currency: "CAD" },
  { id: "south-africa", name: "South Africa",    slug: "south-africa",   regulator: "FSCA",     currency: "ZAR" },
  { id: "india",        name: "India",           slug: "india",          regulator: "SEBI",     currency: "INR" },
  { id: "malaysia",     name: "Malaysia",        slug: "malaysia",       regulator: "SCM",      currency: "MYR" },
  { id: "nigeria",      name: "Nigeria",         slug: "nigeria",        regulator: "SEC",      currency: "NGN" },
  { id: "new-zealand",  name: "New Zealand",     slug: "new-zealand",    regulator: "FMA",      currency: "NZD" },
  { id: "philippines",  name: "Philippines",     slug: "philippines",    regulator: "SEC",      currency: "PHP" },
  { id: "indonesia",    name: "Indonesia",       slug: "indonesia",      regulator: "BAPPEBTI", currency: "IDR" },
  { id: "kenya",        name: "Kenya",           slug: "kenya",          regulator: "CMA",      currency: "KES" },
];

// ═══════════════════════════════════════════════════════════════
// GENERATE 240 COMBINATORIAL RANKINGS
// ═══════════════════════════════════════════════════════════════

function generateCombinatorialRankings() {
  const rankings = [];

  for (const type of COMBI_TYPES) {
    for (const country of COMBI_COUNTRIES) {
      const combiId = `combi-${type.id}-${country.id}`;
      const slug = `/best-${type.slug}-forex-brokers-in-${country.slug}`;
      const title = `Best ${type.label} Forex Brokers in ${country.name}`;

      rankings.push({
        id: combiId,
        slug,
        title,
        category: "combinatorial",
        sub: type.id,
        priority: 3,
        icon: type.icon,
        // Combinatorial-specific metadata
        _typeId: type.id,
        _typeLabel: type.label,
        _geoId: country.id,
        _countryName: country.name,
        _regulator: country.regulator,
        _currency: country.currency,
      });
    }
  }

  return rankings;
}

export const COMBINATORIAL_RANKINGS = generateCombinatorialRankings();

// ── Lookup helpers ──

const _combiBySlug = new Map();
const _combiById = new Map();
for (const r of COMBINATORIAL_RANKINGS) {
  _combiBySlug.set(r.slug, r);
  _combiById.set(r.id, r);
}

export function getCombiRankingBySlug(slug) {
  return _combiBySlug.get(slug) || null;
}

export function getCombiRankingById(id) {
  return _combiById.get(id) || null;
}

export function getAllCombiSlugs() {
  return COMBINATORIAL_RANKINGS.map((r) => r.slug);
}

// ── Exports for other modules ──

export { COMBI_TYPES, COMBI_COUNTRIES };
