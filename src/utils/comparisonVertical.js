const VERTICAL_PRIORITY = ['stocks', 'options', 'futures', 'forex', 'cfd', 'crypto', 'copy-trading', 'spread-betting'];

export function getComparisonVertical(brokerA, brokerB) {
  const vA = brokerA.verticals || ['forex'];
  const vB = brokerB.verticals || ['forex'];
  const shared = VERTICAL_PRIORITY.filter(v => vA.includes(v) && vB.includes(v));
  if (shared.length > 0) return shared[0];
  // No shared vertical — return "generic" to avoid guessing
  return "generic";
}

export const isGenericPair = (v) => v === 'generic';

export const isForexPair = (v) => v === 'forex' || v === 'cfd';
export const isStockPair = (v) => v === 'stocks';
export const isOptionsPair = (v) => v === 'options';
export const isFuturesPair = (v) => v === 'futures';
export const isCryptoPair = (v) => v === 'crypto';

export const BREADCRUMB_MAP = {
  forex: { label: "Forex Brokers", path: "/best-forex-brokers" },
  cfd: { label: "CFD Brokers", path: "/best-cfd-brokers" },
  stocks: { label: "Stock Brokers", path: "/best-stock-brokers" },
  options: { label: "Options Brokers", path: "/best-options-brokers" },
  futures: { label: "Futures Brokers", path: "/best-futures-brokers" },
  crypto: { label: "Crypto Exchanges", path: "/best-crypto-brokers" },
  "copy-trading": { label: "Copy Trading", path: "/best-copy-trading-platforms" },
  "spread-betting": { label: "Spread Betting", path: "/best-spread-betting-brokers" },
  generic: { label: "Online Brokers", path: "/best-forex-brokers" },
};

export function getCTAText(name, vertical) {
  if (isStockPair(vertical)) return `Open ${name} Account`;
  if (isOptionsPair(vertical)) return `Trade at ${name}`;
  if (isFuturesPair(vertical)) return `Trade at ${name}`;
  if (isCryptoPair(vertical)) return `Start at ${name}`;
  return `Visit ${name}`;
}

export function getCTATextShort(vertical) {
  if (isStockPair(vertical)) return "Open Account";
  if (isOptionsPair(vertical)) return "Trade";
  if (isFuturesPair(vertical)) return "Trade";
  return "Visit";
}
