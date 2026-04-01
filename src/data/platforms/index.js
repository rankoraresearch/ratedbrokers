import metatrader4 from "./metatrader-4";
import metatrader5 from "./metatrader-5";
import ctrader from "./ctrader";
import tradingview from "./tradingview";
import thinkorswim from "./thinkorswim";
import ninjatraderPlatform from "./ninjatrader-platform";
import powerEtrade from "./power-etrade";

const PLATFORMS = {
  "metatrader-4": metatrader4,
  "metatrader-5": metatrader5,
  "ctrader": ctrader,
  "tradingview": tradingview,
  "thinkorswim": thinkorswim,
  "ninjatrader-platform": ninjatraderPlatform,
  "power-etrade": powerEtrade,
};

const NAME_TO_SLUG = {
  "MetaTrader 4": "metatrader-4",
  "MetaTrader 5": "metatrader-5",
  "cTrader": "ctrader",
  "TradingView": "tradingview",
  "thinkorswim": "thinkorswim",
  "thinkorswim Desktop": "thinkorswim",
  "thinkorswim Web": "thinkorswim",
  "thinkorswim Mobile": "thinkorswim",
  "NinjaTrader": "ninjatrader-platform",
  "NinjaTrader Desktop": "ninjatrader-platform",
  "Power E*TRADE": "power-etrade",
};

export function getPlatformBySlug(slug) {
  return PLATFORMS[slug] || null;
}

export function getAllPlatforms() {
  return Object.values(PLATFORMS);
}

export function getPlatformSlugByName(name) {
  return NAME_TO_SLUG[name] || null;
}
