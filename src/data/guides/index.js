// Getting Started
import whatIsForexTrading from "./what-is-forex-trading";
import howToStartForexTrading from "./how-to-start-forex-trading";
import howToChooseAForexBroker from "./how-to-choose-a-forex-broker";
import whatIsAPip from "./what-is-a-pip";
import whatIsLeverage from "./what-is-leverage";
import forexDemoAccountGuide from "./forex-demo-account-guide";

// Concepts
import understandingSpreadsAndFees from "./understanding-spreads-and-fees";
import ecnVsMarketMaker from "./ecn-vs-market-maker";
import forexRegulationGuide from "./forex-regulation-guide";
import forexMarketHours from "./forex-market-hours";
import whatIsCfdTrading from "./what-is-cfd-trading";
import forexVsStocks from "./forex-vs-stocks";
import technicalAnalysisGuide from "./technical-analysis-guide";
import fundamentalAnalysisGuide from "./fundamental-analysis-guide";
import howToReadForexCharts from "./how-to-read-forex-charts";

// Strategies
import forexTradingStrategies from "./forex-trading-strategies";
import scalpingStrategyGuide from "./scalping-strategy-guide";
import dayTradingGuide from "./day-trading-guide";
import swingTradingGuide from "./swing-trading-guide";
import trendTradingGuide from "./trend-trading-guide";
import copyTradingGuide from "./copy-trading-guide";
import hedgingInForex from "./hedging-in-forex";

// Advanced
import riskManagementGuide from "./risk-management-guide";
import tradingPsychologyGuide from "./trading-psychology-guide";
import mt4VsMt5 from "./mt4-vs-mt5";

const GUIDES = [
  whatIsForexTrading,
  howToStartForexTrading,
  howToChooseAForexBroker,
  whatIsAPip,
  whatIsLeverage,
  forexDemoAccountGuide,
  understandingSpreadsAndFees,
  ecnVsMarketMaker,
  forexRegulationGuide,
  forexMarketHours,
  whatIsCfdTrading,
  forexVsStocks,
  technicalAnalysisGuide,
  fundamentalAnalysisGuide,
  howToReadForexCharts,
  forexTradingStrategies,
  scalpingStrategyGuide,
  dayTradingGuide,
  swingTradingGuide,
  trendTradingGuide,
  copyTradingGuide,
  hedgingInForex,
  riskManagementGuide,
  tradingPsychologyGuide,
  mt4VsMt5,
];

const GUIDE_MAP = {};
GUIDES.forEach((g) => {
  GUIDE_MAP[g.slug] = g;
});

export function getGuideBySlug(slug) {
  return GUIDE_MAP[slug] || null;
}

export function getAllGuides() {
  return GUIDES;
}

export function getGuidesByCategory(category) {
  return GUIDES.filter((g) => g.category === category);
}

export default GUIDES;
