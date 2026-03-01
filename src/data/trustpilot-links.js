/**
 * Trustpilot profile URLs for all brokers.
 * Format: slug → Trustpilot review page URL.
 */
const TRUSTPILOT_LINKS = {
  "admirals":       "https://www.trustpilot.com/review/admiralmarkets.com",
  "avatrade":       "https://www.trustpilot.com/review/avatrade.com",
  "axi":            "https://www.trustpilot.com/review/axi.com",
  "blackbull":      "https://www.trustpilot.com/review/blackbull.com",
  "capital-com":    "https://www.trustpilot.com/review/capital.com",
  "cmc-markets":    "https://www.trustpilot.com/review/cmcmarkets.com",
  "dukascopy":      "https://www.trustpilot.com/review/dukascopy.com",
  "etoro":          "https://www.trustpilot.com/review/etoro.com",
  "exness":         "https://www.trustpilot.com/review/exness.com",
  "fp-markets":     "https://www.trustpilot.com/review/fpmarkets.com",
  "fusion-markets": "https://www.trustpilot.com/review/fusionmarkets.com.au",
  "fxcm":           "https://www.trustpilot.com/review/fxcm.com",
  "fxpro":          "https://www.trustpilot.com/review/fxpro.com",
  "fxtm":           "https://www.trustpilot.com/review/forextime.com",
  "go-markets":     "https://www.trustpilot.com/review/gomarkets.com",
  "hfm":            "https://www.trustpilot.com/review/hfm.com",
  "ic-markets":     "https://www.trustpilot.com/review/icmarkets.com",
  "ig":             "https://www.trustpilot.com/review/ig.com",
  "libertex":       "https://www.trustpilot.com/review/libertex.com",
  "naga":           "https://www.trustpilot.com/review/naga.com",
  "oanda":          "https://www.trustpilot.com/review/oanda.com",
  "pepperstone":    "https://www.trustpilot.com/review/pepperstone.com",
  "plus500":        "https://www.trustpilot.com/review/plus500.com",
  "roboforex":      "https://www.trustpilot.com/review/roboforex.com",
  "saxo-bank":      "https://www.trustpilot.com/review/home.saxo",
  "swissquote":     "https://www.trustpilot.com/review/swissquote.com",
  "thinkmarkets":   "https://www.trustpilot.com/review/thinkmarkets.com",
  "tickmill":       "https://www.trustpilot.com/review/tickmill.com",
  "vantage":        "https://www.trustpilot.com/review/vantagemarkets.com",
  "xm":             "https://www.trustpilot.com/review/xm.com",
  "xtb":            "https://www.trustpilot.com/review/xtb.com",
};

export function getTrustpilotUrl(slug) {
  return TRUSTPILOT_LINKS[slug] || null;
}

export default TRUSTPILOT_LINKS;
