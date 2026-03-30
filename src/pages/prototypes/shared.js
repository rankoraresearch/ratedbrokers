// Shared data and utilities for all prototypes
export const COUNTRIES = [
  { code: "GB", name: "United Kingdom", reg: "FCA", count: 38, path: "/best-forex-brokers-uk" },
  { code: "AU", name: "Australia", reg: "ASIC", count: 24, path: "/best-forex-brokers-australia" },
  { code: "AE", name: "UAE", reg: "DFSA", count: 18, path: "/best-forex-brokers-uae" },
  { code: "DE", name: "Germany", reg: "BaFin", count: 22, path: "/best-forex-brokers-germany" },
  { code: "SG", name: "Singapore", reg: "MAS", count: 15, path: "/best-forex-brokers-singapore" },
  { code: "US", name: "United States", reg: "NFA", count: 12, path: "/best-forex-brokers-usa" },
];

export const RANKINGS = [
  { title: "Best Forex Brokers", path: "/best-forex-brokers", icon: "trophy" },
  { title: "For Beginners", path: "/best-forex-brokers-for-beginners", icon: "circle" },
  { title: "For Scalping", path: "/best-forex-brokers-for-scalping", icon: "crosshair" },
  { title: "Lowest Spreads", path: "/lowest-spread-forex-brokers", icon: "trending-down" },
  { title: "ECN Brokers", path: "/best-ecn-forex-brokers", icon: "zap" },
  { title: "Copy Trading", path: "/best-copy-trading-platforms", icon: "handshake" },
  { title: "MT4 Brokers", path: "/best-metatrader-4-brokers", icon: "bar-chart-3" },
  { title: "MT5 Brokers", path: "/best-metatrader-5-brokers", icon: "bar-chart-3" },
  { title: "Trading Apps", path: "/best-forex-trading-apps", icon: "smartphone" },
  { title: "Crypto Brokers", path: "/best-crypto-brokers", icon: "bitcoin" },
];

export const COMPARISONS = [
  { a: "IC Markets", b: "Pepperstone", path: "/compare/ic-markets-vs-pepperstone" },
  { a: "IG", b: "CMC Markets", path: "/compare/cmc-markets-vs-ig" },
  { a: "eToro", b: "XTB", path: "/compare/etoro-vs-xtb" },
  { a: "Saxo Bank", b: "OANDA", path: "/compare/oanda-vs-saxo-bank" },
];

export { getVisitUrl as visitUrl } from "../../utils/visitUrl";
