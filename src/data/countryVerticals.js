/**
 * Country × Vertical matrix — single source of truth for the
 * /brokers-by-country umbrella hub and the Menu Countries dropdown.
 *
 * Каждая запись страны перечисляет ТОЛЬКО те вертикали, для которых
 * ranking-страница реально существует в src/data/rankings.js.
 *
 * Ребрендинг: основной forex-by-country хаб (/best-forex-brokers-by-country)
 * остаётся для SEO. Новый multi-asset хаб — /brokers-by-country.
 *
 * Fields:
 *   code            — ISO-2 (для <CountryFlag />)
 *   slug            — url-slug страны (совпадает с src/data/countries/<slug>.js)
 *   name            — отображаемое имя
 *   regulator       — основной регулятор (с колонкой reg)
 *   region          — для группировки (Featured / Europe / Asia-Pacific / MEA / Americas)
 *   featured        — показывать в hero-гриде
 *   verticals[]     — массив { key, label, path }, только существующие
 *
 * Vertical keys: forex, cfd, crypto, stocks, options, futures, copyTrading, spreadBetting
 */

export const VERTICAL_META = {
  forex:         { label: "Forex",         word: "Brokers",   color: "#059669" },
  cfd:           { label: "CFD",           word: "Brokers",   color: "#2563eb" },
  stocks:        { label: "Stocks",        word: "Brokers",   color: "#0ea5e9" },
  options:       { label: "Options",       word: "Brokers",   color: "#7c3aed" },
  futures:       { label: "Futures",       word: "Brokers",   color: "#ea580c" },
  crypto:        { label: "Crypto",        word: "Brokers",   color: "#d97706" },
  copyTrading:   { label: "Copy Trading",  word: "Platforms", color: "#7c3aed" },
  spreadBetting: { label: "Spread Betting", word: "Platforms", color: "#dc2626" },
};

export const COUNTRY_VERTICALS = [
  // ── Featured (full multi-asset) ──
  {
    code: "GB", slug: "uk", name: "United Kingdom", regulator: "FCA", region: "Europe", featured: true,
    verticals: [
      { key: "forex",         path: "/best-forex-brokers-uk" },
      { key: "cfd",           path: "/best-cfd-brokers-uk" },
      { key: "stocks",        path: "/best-stock-brokers-uk" },
      { key: "crypto",        path: "/best-crypto-brokers-uk" },
      { key: "spreadBetting", path: "/best-spread-betting-uk" },
      { key: "copyTrading",   path: "/best-copy-trading-uk" },
    ],
  },
  {
    code: "US", slug: "usa", name: "United States", regulator: "SEC / NFA", region: "Americas", featured: true,
    verticals: [
      { key: "stocks",      path: "/best-stock-brokers-usa" },
      { key: "options",     path: "/best-options-brokers-usa" },
      { key: "futures",     path: "/best-futures-brokers-usa" },
      { key: "forex",       path: "/best-forex-brokers-usa" },
      { key: "crypto",      path: "/best-crypto-brokers-usa" },
      { key: "copyTrading", path: "/best-copy-trading-usa" },
    ],
  },
  {
    code: "AU", slug: "australia", name: "Australia", regulator: "ASIC", region: "Asia-Pacific", featured: true,
    verticals: [
      { key: "forex",  path: "/best-forex-brokers-australia" },
      { key: "cfd",    path: "/best-cfd-brokers-australia" },
      { key: "crypto", path: "/best-crypto-brokers-australia" },
    ],
  },
  {
    code: "DE", slug: "germany", name: "Germany", regulator: "BaFin", region: "Europe", featured: true,
    verticals: [
      { key: "forex",  path: "/best-forex-brokers-germany" },
      { key: "crypto", path: "/best-crypto-brokers-germany" },
    ],
  },
  {
    code: "AE", slug: "uae", name: "UAE", regulator: "DFSA / VARA", region: "Middle East & Africa", featured: true,
    verticals: [
      { key: "forex",  path: "/best-forex-brokers-uae" },
      { key: "crypto", path: "/best-crypto-brokers-uae" },
    ],
  },
  {
    code: "SG", slug: "singapore", name: "Singapore", regulator: "MAS", region: "Asia-Pacific", featured: true,
    verticals: [
      { key: "forex",  path: "/best-forex-brokers-singapore" },
      { key: "crypto", path: "/best-crypto-brokers-singapore" },
    ],
  },
  {
    code: "CA", slug: "canada", name: "Canada", regulator: "CIRO / CSA", region: "Americas", featured: true,
    verticals: [
      { key: "forex",  path: "/best-forex-brokers-canada" },
      { key: "crypto", path: "/best-crypto-brokers-canada" },
    ],
  },
  {
    code: "ZA", slug: "south-africa", name: "South Africa", regulator: "FSCA", region: "Middle East & Africa", featured: true,
    verticals: [
      { key: "forex",  path: "/best-forex-brokers-south-africa" },
      { key: "crypto", path: "/best-crypto-brokers-south-africa" },
    ],
  },

  // ── Additional multi-asset (crypto + forex) ──
  {
    code: "IN", slug: "india", name: "India", regulator: "SEBI / RBI", region: "Asia-Pacific",
    verticals: [
      { key: "forex",  path: "/best-forex-brokers-india" },
      { key: "crypto", path: "/best-crypto-brokers-india" },
    ],
  },
  {
    code: "NZ", slug: "new-zealand", name: "New Zealand", regulator: "FMA", region: "Asia-Pacific",
    verticals: [
      { key: "forex",  path: "/best-forex-brokers-new-zealand" },
      { key: "crypto", path: "/best-crypto-brokers-new-zealand" },
    ],
  },

  // ── Forex-only (rich Europe & Asia-Pacific) ──
  { code: "FR", slug: "france",         name: "France",         regulator: "AMF",    region: "Europe",          verticals: [{ key: "forex", path: "/best-forex-brokers-france" }] },
  { code: "NL", slug: "netherlands",    name: "Netherlands",    regulator: "AFM",    region: "Europe",          verticals: [{ key: "forex", path: "/best-forex-brokers-netherlands" }] },
  { code: "IT", slug: "italy",          name: "Italy",          regulator: "CONSOB", region: "Europe",          verticals: [{ key: "forex", path: "/best-forex-brokers-italy" }] },
  { code: "ES", slug: "spain",          name: "Spain",          regulator: "CNMV",   region: "Europe",          verticals: [{ key: "forex", path: "/best-forex-brokers-spain" }] },
  { code: "CH", slug: "switzerland",    name: "Switzerland",    regulator: "FINMA",  region: "Europe",          verticals: [{ key: "forex", path: "/best-forex-brokers-switzerland" }] },
  { code: "SE", slug: "sweden",         name: "Sweden",         regulator: "FI",     region: "Europe",          verticals: [{ key: "forex", path: "/best-forex-brokers-sweden" }] },
  { code: "PL", slug: "poland",         name: "Poland",         regulator: "KNF",    region: "Europe",          verticals: [{ key: "forex", path: "/best-forex-brokers-poland" }] },
  { code: "CY", slug: "cyprus",         name: "Cyprus",         regulator: "CySEC",  region: "Europe",          verticals: [{ key: "forex", path: "/best-forex-brokers-cyprus" }] },
  { code: "IE", slug: "ireland",        name: "Ireland",        regulator: "CBI",    region: "Europe",          verticals: [{ key: "forex", path: "/best-forex-brokers-ireland" }] },
  { code: "AT", slug: "austria",        name: "Austria",        regulator: "FMA-AT", region: "Europe",          verticals: [{ key: "forex", path: "/best-forex-brokers-austria" }] },
  { code: "GR", slug: "greece",         name: "Greece",         regulator: "HCMC",   region: "Europe",          verticals: [{ key: "forex", path: "/best-forex-brokers-greece" }] },
  { code: "RO", slug: "romania",        name: "Romania",        regulator: "ASF",    region: "Europe",          verticals: [{ key: "forex", path: "/best-forex-brokers-romania" }] },
  { code: "CZ", slug: "czech-republic", name: "Czech Republic", regulator: "CNB",    region: "Europe",          verticals: [{ key: "forex", path: "/best-forex-brokers-czech-republic" }] },

  { code: "JP", slug: "japan",       name: "Japan",       regulator: "FSA",      region: "Asia-Pacific", verticals: [{ key: "forex", path: "/best-forex-brokers-japan" }] },
  { code: "HK", slug: "hong-kong",   name: "Hong Kong",   regulator: "SFC",      region: "Asia-Pacific", verticals: [{ key: "forex", path: "/best-forex-brokers-hong-kong" }] },
  { code: "ID", slug: "indonesia",   name: "Indonesia",   regulator: "Bappebti", region: "Asia-Pacific", verticals: [{ key: "forex", path: "/best-forex-brokers-indonesia" }] },
  { code: "MY", slug: "malaysia",    name: "Malaysia",    regulator: "SC",       region: "Asia-Pacific", verticals: [{ key: "forex", path: "/best-forex-brokers-malaysia" }] },
  { code: "TH", slug: "thailand",    name: "Thailand",    regulator: "SEC-TH",   region: "Asia-Pacific", verticals: [{ key: "forex", path: "/best-forex-brokers-thailand" }] },
  { code: "PH", slug: "philippines", name: "Philippines", regulator: "BSP",      region: "Asia-Pacific", verticals: [{ key: "forex", path: "/best-forex-brokers-philippines" }] },

  { code: "SA", slug: "saudi-arabia", name: "Saudi Arabia", regulator: "CMA",  region: "Middle East & Africa", verticals: [{ key: "forex", path: "/best-forex-brokers-saudi-arabia" }] },
  { code: "BH", slug: "bahrain",      name: "Bahrain",      regulator: "CBB",  region: "Middle East & Africa", verticals: [{ key: "forex", path: "/best-forex-brokers-bahrain" }] },
  { code: "IL", slug: "israel",       name: "Israel",       regulator: "ISA",  region: "Middle East & Africa", verticals: [{ key: "forex", path: "/best-forex-brokers-israel" }] },
  { code: "KE", slug: "kenya",        name: "Kenya",        regulator: "CMA",  region: "Middle East & Africa", verticals: [{ key: "forex", path: "/best-forex-brokers-kenya" }] },
  { code: "NG", slug: "nigeria",      name: "Nigeria",      regulator: "SEC",  region: "Middle East & Africa", verticals: [{ key: "forex", path: "/best-forex-brokers-nigeria" }] },
  { code: "GH", slug: "ghana",        name: "Ghana",        regulator: "SEC",  region: "Middle East & Africa", verticals: [{ key: "forex", path: "/best-forex-brokers-ghana" }] },

  { code: "BR", slug: "brazil",    name: "Brazil",    regulator: "CVM",     region: "Americas", verticals: [{ key: "forex", path: "/best-forex-brokers-brazil" }] },
  { code: "MX", slug: "mexico",    name: "Mexico",    regulator: "CNBV",    region: "Americas", verticals: [{ key: "forex", path: "/best-forex-brokers-mexico" }] },
  { code: "AR", slug: "argentina", name: "Argentina", regulator: "CNV",     region: "Americas", verticals: [{ key: "forex", path: "/best-forex-brokers-argentina" }] },
  { code: "CO", slug: "colombia",  name: "Colombia",  regulator: "SFC",     region: "Americas", verticals: [{ key: "forex", path: "/best-forex-brokers-colombia" }] },
  { code: "CL", slug: "chile",     name: "Chile",     regulator: "CMF",     region: "Americas", verticals: [{ key: "forex", path: "/best-forex-brokers-chile" }] },

  { code: "TR", slug: "turkey",  name: "Turkey",  regulator: "CMB", region: "Eastern Europe", verticals: [{ key: "forex", path: "/best-forex-brokers-turkey" }] },
  { code: "RU", slug: "russia",  name: "Russia",  regulator: "CBR", region: "Eastern Europe", verticals: [{ key: "forex", path: "/best-forex-brokers-russia" }] },
  { code: "UA", slug: "ukraine", name: "Ukraine", regulator: "NSSMC", region: "Eastern Europe", verticals: [{ key: "forex", path: "/best-forex-brokers-ukraine" }] },
];

/** Возвращает вертикали для страны по slug (или пустой массив). */
export function getVerticalsByCountry(slug) {
  const entry = COUNTRY_VERTICALS.find((c) => c.slug === slug);
  return entry ? entry.verticals : [];
}

/** Список стран определённого региона (сохраняет исходный порядок). */
export function getCountriesByRegion(region) {
  return COUNTRY_VERTICALS.filter((c) => c.region === region);
}

/** Featured страны для hero-грида. */
export function getFeaturedCountries() {
  return COUNTRY_VERTICALS.filter((c) => c.featured);
}

/** Уникальные регионы в порядке первого появления. */
export function getAllRegions() {
  const seen = new Set();
  const out = [];
  for (const c of COUNTRY_VERTICALS) {
    if (!seen.has(c.region)) {
      seen.add(c.region);
      out.push(c.region);
    }
  }
  return out;
}
