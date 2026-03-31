/**
 * Warning page data — Quotex
 * Source: FCA, CFTC, BrokerChooser, WikiFX, TrustPilot
 */
export default {
  slug: "quotex",
  name: "Quotex",
  domain: "quotex.io",
  category: "B", // A=Scam, B=Binary Options, C=Bad Reputation, D=Bankrupt
  status: "not-recommended", // not-recommended | closed | bankrupt | license-revoked
  founded: 2019,
  country: "Seychelles",
  regulation: "None",
  tier: null,
  trustpilot: 1.4,
  trustpilotCount: 2800,

  verdict: "not-recommended", // not-recommended | high-risk
  verdictText:
    "Quotex is not regulated by any recognized financial authority. Binary options trading is banned for retail investors in the EU, UK, and Australia. We strongly recommend avoiding this broker and choosing a properly regulated alternative.",

  redFlags: [
    {
      text: "No regulation from any Tier-1 or Tier-2 financial authority",
      severity: "critical",
    },
    {
      text: "Binary options are banned for retail investors in the EU, UK, and Australia",
      severity: "critical",
    },
    {
      text: "Registered in Seychelles — an offshore jurisdiction with minimal regulatory oversight",
      severity: "critical",
    },
    {
      text: "Numerous user complaints about frozen accounts and refused withdrawals",
      severity: "warning",
    },
    {
      text: "Multiple European regulators (CNMV, CONSOB) have issued formal warnings",
      severity: "warning",
    },
  ],

  regulatoryWarnings: [
    {
      regulator: "EU ESMA",
      status: "banned",
      date: "2018",
      action: "Binary options permanently banned for retail investors across the EU",
      url: "https://www.esma.europa.eu/press-news/esma-news/esma-agrees-prohibit-binary-options",
    },
    {
      regulator: "FCA (UK)",
      status: "banned",
      date: "2019",
      action: "Binary options banned for retail consumers in the United Kingdom",
      url: "https://www.fca.org.uk/news/statements/binary-options",
    },
    {
      regulator: "ASIC (Australia)",
      status: "banned",
      date: "2021",
      action: "Binary options banned for retail clients",
      url: "https://www.asic.gov.au",
    },
    {
      regulator: "CFTC (USA)",
      status: "warning",
      date: "2023",
      action: "Binary options fraud advisory — most platforms operating illegally",
      url: "https://www.cftc.gov/BinaryOptionsFraud/index.htm",
    },
  ],

  complaints: [
    {
      text: "Deposited $500, won several trades, but when I tried to withdraw, my account was frozen for 'verification' that never completed.",
      source: "TrustPilot",
      date: "February 2026",
    },
    {
      text: "They cancelled my winning trades retroactively claiming 'technical error'. Lost $1,200 overnight.",
      source: "ForexPeaceArmy",
      date: "January 2026",
    },
    {
      text: "Binary options is basically gambling. The platform controls the outcome. You cannot win long-term.",
      source: "Reddit r/Forex",
      date: "March 2026",
    },
  ],

  keyFacts: {
    founded: "2019",
    headquarters: "Seychelles (offshore)",
    regulation: "None",
    investorProtection: "None",
    segregatedFunds: "Unknown",
    minDeposit: "$10",
    productType: "Binary Options",
  },

  alternatives: ["ic-markets", "pepperstone", "etoro"],

  faq: [
    {
      q: "Is Quotex regulated?",
      a: "No. Quotex is not regulated by any recognized financial authority such as the FCA, ASIC, or CySEC. The company is registered in Seychelles, an offshore jurisdiction with minimal regulatory oversight and no investor protection scheme.",
    },
    {
      q: "Is Quotex a scam?",
      a: "While we cannot confirm Quotex is a deliberate scam, the platform operates without any legitimate regulatory license. Binary options — the core product — are banned in the EU, UK, and Australia due to the high risk of consumer harm. Multiple users report withdrawal difficulties and frozen accounts.",
    },
    {
      q: "Can I withdraw money from Quotex?",
      a: "Some users report successful withdrawals, but many others report their accounts being frozen during the withdrawal process, especially after profitable trading. Without proper regulation, there is no recourse if the broker refuses to process your withdrawal.",
    },
    {
      q: "What are safe alternatives to Quotex?",
      a: "We recommend IC Markets (regulated by ASIC and CySEC), Pepperstone (FCA and ASIC), and eToro (FCA, ASIC, CySEC) as safe alternatives for online trading. All three offer investor protection schemes and properly segregated client funds.",
    },
    {
      q: "What should I do if I lost money with Quotex?",
      a: "Document all your transactions and communications. Contact your bank or payment provider about a potential chargeback. Report the platform to your local financial regulator. Avoid 'recovery' services that ask for upfront fees — these are often secondary scams.",
    },
  ],

  author: {
    name: "Daniel Chen",
    id: "daniel-chen",
    role: "Financial Regulation Analyst",
    exp: "8+ years in financial compliance",
  },
  factChecker: {
    name: "Sarah Mitchell",
    id: "sarah-mitchell",
    role: "Senior Editor",
  },
  updated: "2026-03-31",
};
