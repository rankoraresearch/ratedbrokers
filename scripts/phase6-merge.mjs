#!/usr/bin/env node
/**
 * Phase 6 — Merge HARVESTED_AUTHORS into authorsSample.js
 * Extends SITES map with all 96 outlets from OUTLETS_METADATA.
 * Preserves 34 MVP records + adds 546 harvested.
 */

import { readFileSync, writeFileSync } from "node:fs";

const ROOT = "/Users/yegorbarakovskiy/Desktop/ratedbrokers";
const HARVESTED = `${ROOT}/src/data/authorsHarvested.js`;
const OUTLETS_META = `${ROOT}/src/data/outletsMetadata.js`;
const SOURCES_JSON = `${ROOT}/scripts/authors-sources.json`;
const AUTHORS_FILE = `${ROOT}/src/data/authorsSample.js`;

// Load harvested
const harvestedRaw = readFileSync(HARVESTED, "utf8");
const hMatch = harvestedRaw.match(/export const HARVESTED_AUTHORS = ([\s\S]*?);\n*$/);
const HARVESTED_AUTHORS = JSON.parse(hMatch[1]);
console.log(`Harvested: ${HARVESTED_AUTHORS.length}`);

// Load outlets
const outletsRaw = readFileSync(OUTLETS_META, "utf8");
const oMatch = outletsRaw.match(/export const OUTLETS_METADATA = ({[\s\S]*?});/);
const OUTLETS_METADATA = JSON.parse(oMatch[1]);

// Load sources for names/urls
const sources = JSON.parse(readFileSync(SOURCES_JSON, "utf8"));

// Build complete SITES object
const CATEGORY_LABELS = {
  1: "Direct competitor",
  2: "Finance editorial",
  3: "Trading media",
  4: "Tier-1 business press",
  5: "Crypto media",
  6: "Prop firms",
};

const FULL_SITES = {};
for (const [slug, meta] of Object.entries(OUTLETS_METADATA)) {
  const src = sources.sites[slug] || {};
  FULL_SITES[slug] = {
    slug,
    name: src.domain ? src.domain.replace(/\.(com|co|co\.uk|de|at|net|io|fr|fi|fm)$/, "").split(".").map(s => s[0]?.toUpperCase() + s.slice(1)).join(" ") : slug,
    url: `https://${meta.domain}`,
    category: meta.category,
    categoryLabel: CATEGORY_LABELS[meta.category] || "Unknown",
    dr: meta.dr,
    traffic: null,
    tier: meta.tier,
    competitorBacklinks: meta.competitorBacklinks,
  };
}

// Keep MVP custom names
const MVP_NAMES = {
  brokerchooser: "BrokerChooser",
  nerdwallet: "NerdWallet",
  fxstreet: "FXStreet",
  wsj: "The Wall Street Journal",
  cointelegraph: "Cointelegraph",
  forexbrokers: "ForexBrokers.com",
  stockbrokers: "StockBrokers.com",
  bestbrokers: "BestBrokers",
  fxempire: "FXEmpire",
  compareforexbrokers: "CompareForexBrokers",
  tradersunion: "TradersUnion",
  fxscouts: "FXScouts",
  investing: "Investing.com",
  theinvestorscentre: "TheInvestorsCentre",
  daytrading: "DayTrading.com",
  forexpeacearmy: "Forex Peace Army",
  wikifx: "WikiFX",
  myfxbook: "Myfxbook",
  babypips: "BabyPips",
  asktraders: "AskTraders",
  goodmoneyguide: "Good Money Guide",
  boringmoney: "Boring Money",
  modestmoney: "Modest Money",
  brokernotes: "BrokerNotes",
  "55brokers": "55Brokers",
  brokersview: "BrokersView",
  brokervergleich: "Brokervergleich",
  brokertest_at: "Broker-Test.at",
  cashbackforex: "Cashback Forex",
  benzinga: "Benzinga",
  bankrate: "Bankrate",
  investopedia: "Investopedia",
  morningstar: "Morningstar",
  zacks: "Zacks",
  kiplinger: "Kiplinger",
  barrons: "Barron's",
  marketwatch: "MarketWatch",
  usnews_money: "US News — Money",
  thebalancemoney: "The Balance",
  money_com: "Money.com",
  fool: "Motley Fool",
  smartasset: "SmartAsset",
  moneyunder30: "Money Under 30",
  moneysavingexpert: "MoneySavingExpert",
  thisismoney: "This is Money",
  moneyweek: "MoneyWeek",
  investorschronicle: "Investors' Chronicle",
  which: "Which?",
  dailyfx: "DailyFX",
  forexlive: "ForexLive",
  tradingview: "TradingView Blog",
  financemagnates: "Finance Magnates",
  leaprate: "LeapRate",
  financefeeds: "FinanceFeeds",
  thefullfx: "The Full FX",
  fxnewsgroup: "FX-News Group",
  investors_com: "Investors Business Daily",
  seekingalpha: "Seeking Alpha",
  zerohedge: "ZeroHedge",
  tradersmagazine: "Traders Magazine",
  actionforex: "Action Forex",
  finviz: "Finviz",
  tradingeconomics: "Trading Economics",
  ft: "Financial Times",
  bloomberg: "Bloomberg",
  reuters: "Reuters",
  cnbc: "CNBC",
  cnn_business: "CNN Business",
  forbes: "Forbes",
  businessinsider: "Business Insider",
  economist: "The Economist",
  yahoofinance: "Yahoo Finance",
  fortune: "Fortune",
  theguardian_money: "The Guardian — Money",
  telegraph: "The Telegraph — Money",
  handelsblatt: "Handelsblatt",
  lesechos: "Les Echos",
  nikkei_asia: "Nikkei Asia",
  scmp: "South China Morning Post",
  economictimes: "The Economic Times",
  gulfnews: "Gulf News",
  coindesk: "CoinDesk",
  theblock: "The Block",
  decrypt: "Decrypt",
  cryptoslate: "CryptoSlate",
  bitcoinmagazine: "Bitcoin Magazine",
  coinmarketcap: "CoinMarketCap",
  coingecko: "CoinGecko",
  bitcompare: "Bitcompare",
  cryptocompare: "CryptoCompare",
  propfirmmatch: "PropFirmMatch",
  propfirms_com: "PropFirms.com",
  fundedtradingplus: "Funded Trading Plus",
  propfirmapp: "PropFirmApp",
  traderswithedge: "Traders With Edge",
  luxtradingfirm: "Lux Trading Firm",
};
for (const [slug, name] of Object.entries(MVP_NAMES)) {
  if (FULL_SITES[slug]) FULL_SITES[slug].name = name;
}

// Read current authorsSample.js — extract MVP AUTHORS and constants
const sampleRaw = readFileSync(AUTHORS_FILE, "utf8");

// Find the AUTHORS array
const authorsStart = sampleRaw.indexOf("export const AUTHORS = [");
const authorsEnd = sampleRaw.indexOf("\n];", authorsStart);
if (authorsStart < 0 || authorsEnd < 0) throw new Error("AUTHORS array not found in authorsSample.js");

// MVP authors text (we'll keep as-is)
const mvpAuthorsText = sampleRaw.slice(authorsStart, authorsEnd + 3);

// Generate new AUTHORS with MVP + harvested
// Strategy: keep MVP in existing rich form, append HARVESTED as new records
// First, find the ']' that ends AUTHORS
const mvpArrayClose = sampleRaw.lastIndexOf("];", authorsEnd + 3);
const mvpAuthorsContent = sampleRaw.slice(authorsStart + "export const AUTHORS = [".length, mvpArrayClose);

// Build new file
const beforeAuthors = sampleRaw.slice(0, authorsStart);
const afterAuthors = sampleRaw.slice(authorsEnd + 3);

// Expand SITES from authorsSample.js — replace existing SITES block with full 96-site version
const sitesStart = beforeAuthors.indexOf("export const SITES = {");
const sitesEnd = beforeAuthors.indexOf("\n};\n", sitesStart);
const beforeSites = beforeAuthors.slice(0, sitesStart);
const afterSites = beforeAuthors.slice(sitesEnd + 4);

// Serialize FULL_SITES
const sitesCode = `export const SITES = ${JSON.stringify(FULL_SITES, null, 2)};`;

// Build harvested authors literal
const harvestedLiteral = HARVESTED_AUTHORS.map((a) => JSON.stringify(a, null, 2)).join(",\n");

const newAuthorsSection = `export const AUTHORS = [
  // ───────── MVP records (34 authors, manual Phase 1-2) ─────────
${mvpAuthorsContent}
  ,
  // ───────── HARVESTED (${HARVESTED_AUTHORS.length} authors, Phase 3 enrichment) ─────────
${harvestedLiteral}
];`;

const newFile = beforeSites + sitesCode + "\n" + afterSites + newAuthorsSection + afterAuthors;
writeFileSync(AUTHORS_FILE, newFile);

console.log(`✓ Merged ${HARVESTED_AUTHORS.length} harvested + MVP into ${AUTHORS_FILE}`);
console.log(`✓ SITES extended to ${Object.keys(FULL_SITES).length} outlets`);
