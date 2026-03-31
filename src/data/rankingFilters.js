/**
 * Ranking Filter Engine for RatedBrokers.com
 * Maps each ranking ID to a filter function that determines which brokers appear.
 * Sort: always by B.score descending.
 * Fallback: if filter returns <5 brokers, pad with top-scored brokers.
 */
import { getAllBrokersWithData } from "./brokers/index";

// ── Filter primitives ──────────────────────────────────

const isECN = (b) => /ecn/i.test(b.B.type);
const isSTP = (b) => /stp/i.test(b.B.type);
const isMM = (b) => /market\s*maker|^mm/i.test(b.B.type);
const isDMA = (b) => /dma/i.test(b.B.type);
const isNDD = (b) => isECN(b) || isSTP(b) || isDMA(b);

const hasPlatform = (name) => (b) =>
  b.B.platforms.some((p) => p.toLowerCase().includes(name.toLowerCase()));

const hasReg = (name) => (b) =>
  b.B.regs.some((r) => r.name === name);

const hasTier1 = (b) => b.B.regs.some((r) => r.tier === 1);
const hasTier = (tier) => (b) => b.B.regs.some((r) => r.tier === tier);

const minDepUnder = (max) => (b) => b.B.minDep <= max;
const minDepExact = (val) => (b) => b.B.minDep === val;
const minDepZero = (b) => b.B.minDep === 0;

const spreadUnder = (max) => (b) => parseFloat(b.B.spread) <= max;
const spreadZero = (b) => parseFloat(b.B.spread) === 0;

const leverageNum = (b) => {
  const m = b.B.leverage.match(/1:(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
};
const leverageAtLeast = (min) => (b) => leverageNum(b) >= min;
const leverageExact = (val) => (b) => leverageNum(b) === val;

const scoreAbove = (min) => (b) => b.B.score >= min;

const hasTextInType = (text) => (b) =>
  b.B.type.toLowerCase().includes(text.toLowerCase());

const hasSocialTrading = (b) =>
  /social|copy/i.test(b.B.type) || /etoro|naga|zulutrade/i.test(b.B.name);

const hasCopyTrading = (b) =>
  /copy|social/i.test(b.B.type) || /etoro|naga/i.test(b.B.name);

// All brokers pass (used for generic rankings where we just want top-scored)
const all = () => true;

// Combine filters with AND logic
const and = (...fns) => (b) => fns.every((fn) => fn(b));
const or = (...fns) => (b) => fns.some((fn) => fn(b));

// ── Ranking filter map ─────────────────────────────────

const FILTERS = {
  // A. FOREX — BY TRADING STYLE (18)
  "forex-overall": all,
  "forex-beginners": (b) => b.B.score >= 8.0,
  "forex-professionals": (b) => isECN(b) || isDMA(b) || b.B.score >= 9.0,
  "forex-scalping": (b) => isECN(b) || isSTP(b) || spreadZero(b),
  "forex-day-trading": (b) => spreadUnder(0.5)(b) || isECN(b),
  "forex-swing-trading": all,
  "forex-position-trading": all,
  "forex-hedging": (b) => isECN(b) || isSTP(b) || leverageAtLeast(100)(b),
  "forex-news-trading": (b) => isECN(b) || isSTP(b),
  "forex-automated": (b) => hasPlatform("MetaTrader 4")(b) || hasPlatform("MetaTrader 5")(b),
  "forex-algo": (b) => hasPlatform("MetaTrader")(b) || hasPlatform("cTrader")(b),
  "forex-hft": (b) => isECN(b) && (hasPlatform("cTrader")(b) || hasPlatform("MetaTrader")(b)),
  "forex-copy-trading": hasCopyTrading,
  "forex-social-trading": hasSocialTrading,
  "forex-signals": all,
  "forex-ea": (b) => hasPlatform("MetaTrader 4")(b) || hasPlatform("MetaTrader 5")(b),
  "forex-grid": (b) => hasPlatform("MetaTrader")(b) && (isECN(b) || isSTP(b)),
  "forex-carry": all,

  // B. BY SPREADS & COSTS (12)
  "low-spread": (b) => spreadUnder(0.5)(b) || isECN(b),
  "zero-spread": spreadZero,
  "low-commission": (b) => isECN(b) || isSTP(b),
  "low-cost": (b) => spreadUnder(0.5)(b) || isECN(b),
  "no-hidden-fees": all,
  "no-inactivity-fee": all,
  "free-deposits": all,
  "free-withdrawals": all,
  "instant-withdrawal": all,
  "cashback": all,
  "no-requotes": (b) => isECN(b) || isSTP(b),
  "low-slippage": (b) => isECN(b) || isSTP(b),

  // C. BY EXECUTION (7)
  "ecn": isECN,
  "stp": isSTP,
  "ndd": isNDD,
  "market-maker": isMM,
  "dma": isDMA,
  "a-book": (b) => isECN(b) || isSTP(b),
  "fast-execution": (b) => isECN(b) || isSTP(b) || isDMA(b),

  // D. BY ACCOUNT TYPE (10)
  "micro-accounts": (b) => minDepUnder(100)(b) || b.B.score >= 8.0,
  "cent-accounts": (b) => minDepUnder(10)(b) || b.B.score >= 8.0,
  "standard-accounts": all,
  "demo-accounts": all,
  "pamm-accounts": all,
  "mam-accounts": all,
  "managed-accounts": all,
  "large-accounts": (b) => b.B.score >= 8.5,
  "small-accounts": minDepUnder(100),
  "islamic-accounts": all,

  // E. BY MINIMUM DEPOSIT (7)
  "no-min-deposit": minDepZero,
  "1-dollar-deposit": minDepUnder(1),
  "5-dollar-deposit": minDepUnder(5),
  "10-dollar-deposit": minDepUnder(10),
  "50-dollar-deposit": minDepUnder(50),
  "100-dollar-deposit": minDepUnder(100),
  "500-dollar-deposit": minDepUnder(500),

  // F. BY LEVERAGE (7)
  "high-leverage": leverageAtLeast(200),
  "leverage-30": leverageAtLeast(30),
  "leverage-100": leverageAtLeast(100),
  "leverage-200": leverageAtLeast(200),
  "leverage-500": leverageAtLeast(500),
  "leverage-1000": leverageAtLeast(1000),
  "unlimited-leverage": (b) => leverageNum(b) >= 1000 || /unlimited/i.test(b.B.leverage),

  // G. BY BONUS (5)
  "bonus": all,
  "no-deposit-bonus": all,
  "deposit-bonus": all,
  "welcome-bonus": all,
  "loyalty-program": all,

  // H. BY PLATFORM (10)
  "mt4": hasPlatform("MetaTrader 4"),
  "mt5": hasPlatform("MetaTrader 5"),
  "ctrader": hasPlatform("cTrader"),
  "tradingview": hasPlatform("TradingView"),
  "ninjatrader": hasPlatform("NinjaTrader"),
  "zulutrade": hasPlatform("ZuluTrade"),
  "prorealtime": hasPlatform("ProRealTime"),
  "proprietary": (b) => b.B.platforms.some((p) =>
    !/metatrader|ctrader|tradingview|ninjatrader|zulutrade|prorealtime/i.test(p)
  ),
  "trading-api": all,
  "free-vps": all,

  // I. MOBILE APPS (5)
  "trading-apps": all,
  "apps-iphone": all,
  "apps-android": all,
  "crypto-apps": all,
  "stock-apps": all,

  // J. TRUST (5)
  "safest": (b) => hasTier1(b) && b.B.score >= 8.5,
  "regulated": hasTier1,
  "negative-balance": all,
  "guaranteed-stop-loss": all,
  "segregated-accounts": hasTier1,

  // K. TOOLS (7)
  "education": all,
  "research": all,
  "trading-central": all,
  "autochartist": all,
  "economic-calendar": all,
  "charting": all,
  "24-7-support": all,

  // L. CRYPTO (12)
  "crypto-overall": all,
  "crypto-bitcoin": all,
  "crypto-ethereum": all,
  "crypto-xrp": all,
  "crypto-solana": all,
  "crypto-doge": all,
  "crypto-altcoins": all,
  "crypto-staking": all,
  "crypto-copy": hasCopyTrading,
  "crypto-high-lev": leverageAtLeast(100),
  "crypto-low-spread": (b) => spreadUnder(0.5)(b) || isECN(b),
  "crypto-vs-cfd": all,

  // M. ASSETS (12)
  "cfd": all,
  "stocks": all,
  "gold": all,
  "silver": all,
  "oil": all,
  "commodities": all,
  "indices": all,
  "options": all,
  "futures": all,
  "etf": all,
  "spread-betting": (b) => hasReg("FCA")(b) || /spread.*bet/i.test(b.B.type),
  "bonds": all,

  // N. PAIRS (10)
  "eurusd": all,
  "gbpusd": all,
  "usdjpy": all,
  "audusd": all,
  "usdcad": all,
  "eurgbp": all,
  "usdchf": all,
  "nzdusd": all,
  "exotic": all,
  "minor": all,

  // O. INDEX (6)
  "sp500": all,
  "nasdaq": all,
  "dow": all,
  "ftse": all,
  "dax": all,
  "nikkei": all,

  // P. PAYMENT (14)
  "pay-paypal": all,
  "pay-skrill": all,
  "pay-neteller": all,
  "pay-bitcoin": all,
  "pay-crypto": all,
  "pay-credit-card": all,
  "pay-visa": all,
  "pay-bank-transfer": all,
  "pay-apple-pay": all,
  "pay-google-pay": all,
  "pay-perfect-money": all,
  "pay-webmoney": all,
  "pay-upi": all,
  "pay-pix": all,

  // Q. REGULATOR (10)
  "reg-fca": hasReg("FCA"),
  "reg-asic": hasReg("ASIC"),
  "reg-cysec": hasReg("CySEC"),
  "reg-nfa": (b) => hasReg("NFA")(b) || hasReg("CFTC")(b),
  "reg-bafin": hasReg("BaFin"),
  "reg-mas": hasReg("MAS"),
  "reg-dfsa": hasReg("DFSA"),
  "reg-fsca": hasReg("FSCA"),
  "reg-scb": hasReg("SCB"),
  "reg-offshore": (b) => b.B.regs.some((r) => r.tier === 3),

  // R. COUNTRY (40) — mostly all brokers, sorted by score
  "geo-uk": (b) => hasReg("FCA")(b) || hasTier1(b),
  "geo-australia": (b) => hasReg("ASIC")(b) || hasTier1(b),
  "geo-usa": (b) => hasReg("NFA")(b) || hasReg("CFTC")(b) || hasTier1(b),
  "geo-germany": (b) => hasReg("BaFin")(b) || hasReg("CySEC")(b) || hasReg("FCA")(b),
  "geo-canada": hasTier1,
  "geo-switzerland": (b) => hasReg("FINMA")(b) || hasTier1(b),
  "geo-singapore": (b) => hasReg("MAS")(b) || hasTier1(b),
  "geo-uae": (b) => hasReg("DFSA")(b) || hasTier1(b),
  "geo-japan": hasTier1,
  "geo-hongkong": hasTier1,
  "geo-europe": (b) => hasReg("CySEC")(b) || hasReg("FCA")(b) || hasReg("BaFin")(b),
  "geo-south-africa": (b) => hasReg("FSCA")(b) || hasTier1(b),
  "geo-india": all,
  "geo-malaysia": all,
  "geo-new-zealand": (b) => hasReg("ASIC")(b) || hasTier1(b),
  "geo-france": (b) => hasReg("CySEC")(b) || hasReg("FCA")(b),
  "geo-spain": (b) => hasReg("CySEC")(b) || hasReg("FCA")(b),
  "geo-italy": (b) => hasReg("CySEC")(b) || hasReg("FCA")(b),
  "geo-netherlands": (b) => hasReg("CySEC")(b) || hasReg("FCA")(b),
  "geo-sweden": (b) => hasReg("CySEC")(b) || hasReg("FCA")(b),
  "geo-saudi": all,
  "geo-kuwait": all,
  "geo-qatar": all,
  "geo-nigeria": all,
  "geo-philippines": all,
  "geo-indonesia": all,
  "geo-turkey": all,
  "geo-brazil": all,
  "geo-mexico": all,
  "geo-pakistan": all,
  "geo-kenya": all,
  "geo-ghana": all,
  "geo-thailand": all,
  "geo-vietnam": all,
  "geo-bangladesh": all,
  "geo-colombia": all,
  "geo-egypt": all,
  "geo-poland": (b) => hasReg("CySEC")(b) || hasReg("FCA")(b),
  "geo-romania": (b) => hasReg("CySEC")(b) || hasReg("FCA")(b),
  "geo-south-korea": hasTier1,

  // S. ALTERNATIVES (10)
  "alt-etoro": (b) => b.B.name !== "eToro",
  "alt-ic-markets": (b) => b.B.name !== "IC Markets",
  "alt-pepperstone": (b) => b.B.name !== "Pepperstone",
  "alt-xm": (b) => b.B.name !== "XM",
  "alt-exness": (b) => b.B.name !== "Exness",
  "alt-ig": (b) => b.B.name !== "IG",
  "alt-plus500": (b) => b.B.name !== "Plus500",
  "alt-oanda": (b) => b.B.name !== "OANDA",
  "alt-avatrade": (b) => b.B.name !== "AvaTrade",
  "alt-robinhood": all,
};

// ── Main API ───────────────────────────────────────────

let _cachedBrokers = null;
function loadBrokers() {
  if (!_cachedBrokers) _cachedBrokers = getAllBrokersWithData();
  return _cachedBrokers;
}

export function getBrokersForRanking(rankingId) {
  const brokers = loadBrokers();
  const filterFn = FILTERS[rankingId] || all;

  let filtered = brokers.filter(filterFn);
  filtered.sort((a, b) => b.B.score - a.B.score);

  // Fallback: if <5 brokers matched, pad with top-scored
  if (filtered.length < 5) {
    const allSorted = [...brokers].sort((a, b) => b.B.score - a.B.score);
    const slugSet = new Set(filtered.map((b) => b.slug));
    for (const b of allSorted) {
      if (filtered.length >= 10) break;
      if (!slugSet.has(b.slug)) {
        filtered.push(b);
        slugSet.add(b.slug);
      }
    }
  }

  return filtered;
}

export function getBrokerCountForRanking(rankingId) {
  return getBrokersForRanking(rankingId).length;
}

// ── Admin override integration ─────────────────────────

export async function fetchRankingOverrides(rankingId) {
  const apiBase = import.meta.env.VITE_API_URL || '';
  if (!apiBase) return null;
  try {
    const res = await fetch(`${apiBase}/api/rankings/${rankingId}/order`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.brokers || null;
  } catch {
    return null;
  }
}

export function applyOverrides(brokers, overrides) {
  if (!overrides || !overrides.length) return brokers;

  const overrideMap = {};
  for (const o of overrides) overrideMap[o.slug] = o;

  // Remove hidden brokers
  let result = brokers.filter((b) => !overrideMap[b.slug]?.hidden);

  // Attach featured_label + override position
  result = result.map((b) => {
    const o = overrideMap[b.slug];
    if (!o) return b;
    const copy = { ...b, _featuredLabel: o.featured_label || null };
    if (o.position > 0) copy._overridePos = o.position;
    return copy;
  });

  // Sort: overridden positions first (by position), then rest by score
  result.sort((a, b) => {
    const pa = a._overridePos || Infinity;
    const pb = b._overridePos || Infinity;
    if (pa !== pb) return pa - pb;
    return b.B.score - a.B.score;
  });

  return result;
}
