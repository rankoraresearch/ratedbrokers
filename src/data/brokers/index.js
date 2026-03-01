import icMarkets from "./ic-markets";
import pepperstone from "./pepperstone";
import fpMarkets from "./fp-markets";
import xm from "./xm";
import exness from "./exness";
import tickmill from "./tickmill";
import vantage from "./vantage";
import ig from "./ig";
import oanda from "./oanda";
import etoro from "./etoro";
import plus500 from "./plus500";
import saxoBank from "./saxo-bank";
import cmcMarkets from "./cmc-markets";
import xtb from "./xtb";
import fxpro from "./fxpro";
import admirals from "./admirals";
import swissquote from "./swissquote";
import dukascopy from "./dukascopy";
import libertex from "./libertex";
import avatrade from "./avatrade";
import fxcm from "./fxcm";
import hfm from "./hfm";
import thinkmarkets from "./thinkmarkets";
import fxtm from "./fxtm";
import capitalcom from "./capital-com";
import roboforex from "./roboforex";
import blackbull from "./blackbull";
import axi from "./axi";
import fusionMarkets from "./fusion-markets";
import goMarkets from "./go-markets";
import naga from "./naga";
import forexcom from "./forex-com";
import interactiveBrokers from "./interactive-brokers";
import trading212 from "./trading-212";
import eightcap from "./eightcap";
import activtrades from "./activtrades";

const BROKERS = {
  "ic-markets": icMarkets,
  "pepperstone": pepperstone,
  "fp-markets": fpMarkets,
  "xm": xm,
  "exness": exness,
  "tickmill": tickmill,
  "vantage": vantage,
  "ig": ig,
  "oanda": oanda,
  "etoro": etoro,
  "plus500": plus500,
  "saxo-bank": saxoBank,
  "cmc-markets": cmcMarkets,
  "xtb": xtb,
  "fxpro": fxpro,
  "admirals": admirals,
  "swissquote": swissquote,
  "dukascopy": dukascopy,
  "libertex": libertex,
  "avatrade": avatrade,
  "fxcm": fxcm,
  "hfm": hfm,
  "thinkmarkets": thinkmarkets,
  "fxtm": fxtm,
  "capital-com": capitalcom,
  "roboforex": roboforex,
  "blackbull": blackbull,
  "axi": axi,
  "fusion-markets": fusionMarkets,
  "go-markets": goMarkets,
  "naga": naga,
  "forex-com": forexcom,
  "interactive-brokers": interactiveBrokers,
  "trading-212": trading212,
  "eightcap": eightcap,
  "activtrades": activtrades,
};

export function getBrokerData(slug) {
  return BROKERS[slug] || null;
}

export function getAllBrokerSlugs() {
  return Object.keys(BROKERS);
}

export function getAllBrokers() {
  return Object.entries(BROKERS).map(([slug, data]) => ({
    slug,
    name: data.B.name,
    score: data.B.score,
    type: data.B.type,
    spread: data.B.spread,
    badge: data.B.badge,
  }));
}

export function getAllBrokersWithData() {
  return Object.entries(BROKERS).map(([slug, data]) => ({ slug, ...data }));
}
