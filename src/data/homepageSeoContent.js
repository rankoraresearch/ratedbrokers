/**
 * SEO content for the homepage of RatedBrokers.com
 * Structured for i18n-readiness — each section is a keyed object.
 * Internal links are represented as {text, path} pairs, rendered inline by Home.jsx.
 *
 * Note: Site is currently English-only (i18n was removed in M2.5).
 * When multi-language support is added, wrap this in a locale-keyed map:
 *   { en: HOMEPAGE_SEO, de: HOMEPAGE_SEO_DE, ... }
 *
 * Target keyword: "best online brokers"
 * Total word count: ~1,300-1,500 words across 4 blocks (sandwich pattern)
 */

const YEAR = "2026";

const HOMEPAGE_SEO = {
  // ─── H1 + meta ────────────────────────────────────────
  h1: `Best Online Brokers ${YEAR} — Expert Ratings & Reviews`,
  metaTitle: `Best Online Brokers ${YEAR}: Compared & Rated | RatedBrokers`,
  metaDescription: `Compare 51+ online brokers across forex, stocks, crypto, options, and futures. Independent expert reviews, side-by-side comparisons, and rankings updated quarterly.`,

  // ─── INTRO (80-100 words, between hero and Top Rated) ─
  intro: {
    text: `RatedBrokers is an independent broker comparison platform. We evaluate online brokers across forex, stocks, crypto, options, and futures — scoring each one on regulation, costs, reputation, transparency, platforms, and execution. Every broker on our site holds at least one Tier-1 regulatory license. Our rankings are based on data, not payments: brokers cannot pay for placement or influence their scores. Below you will find our highest-rated brokers for ${YEAR}, updated quarterly.`,
    links: [
      { text: "Our full methodology", path: "/methodology" },
      { text: "how we make money", path: "/how-we-make-money" },
    ],
  },

  // ─── HOW WE RATE (250-300 words, after Top Rated Brokers) ─
  howWeRate: {
    heading: "How We Rate Brokers",
    intro: `Every broker on RatedBrokers is evaluated using a transparent, weighted scoring formula. We collect data from official regulatory databases, broker websites, independent sources, and aggregated user reviews. No broker can pay to improve their score or ranking position.`,
    categories: [
      {
        name: "Regulation & Safety",
        weight: "30%",
        desc: "We verify every license number directly on the regulator's public database. Brokers must hold at least one Tier-1 license (FCA, ASIC, NFA/CFTC, FINMA, MAS, BaFin, or CySEC) to be listed. This is a knockout criterion — no exceptions.",
      },
      {
        name: "Trading Costs",
        weight: "20%",
        desc: "We calculate total cost per lot including spreads, commissions, swaps, and hidden fees. Pricing transparency matters — brokers that bury fees in legal documents score lower.",
      },
      {
        name: "User Reputation",
        weight: "15%",
        desc: "We aggregate Trustpilot scores, review volume, recency, and how brokers respond to complaints. A broker with 10,000+ recent reviews carries more weight than one with 200.",
      },
      {
        name: "Broker Transparency",
        weight: "15%",
        desc: "We evaluate fee disclosure quality, withdrawal conditions, KYC documentation, ownership structure, and risk warning compliance.",
      },
      {
        name: "Platforms & Tools",
        weight: "15%",
        desc: "We assess the range of platforms (MT4, MT5, cTrader, TradingView), mobile app quality, charting tools, and API/algo trading support.",
      },
      {
        name: "Execution Model",
        weight: "5%",
        desc: "We review whether brokers operate as ECN/STP or market makers, their declared liquidity providers, and whether they publish execution statistics.",
      },
    ],
    closing: `We re-evaluate every listed broker quarterly. When conditions change — new fees, regulatory actions, platform updates — scores are adjusted and rankings updated.`,
    links: [
      { text: "Read our full methodology", path: "/methodology" },
      { text: "See all rankings", path: "/best-forex-brokers" },
      { text: "Trust & transparency", path: "/trust-score" },
    ],
  },

  // ─── HOW TO CHOOSE (350-400 words, after Comparisons) ─
  howToChoose: {
    heading: "How to Choose an Online Broker",
    intro: `Choosing the right broker depends on what you trade, where you live, and what matters most to you. There is no single "best broker" — the right choice is the one that fits your specific needs. Here is what to consider.`,
    sections: [
      {
        subheading: "Start with regulation",
        text: `Your broker should be licensed by a reputable financial authority. Tier-1 regulators like the FCA (UK), ASIC (Australia), SEC/NFA (US), and CySEC (EU) enforce fund segregation, negative balance protection, and investor compensation schemes. A broker with only an offshore license offers fewer protections if something goes wrong.`,
        link: { text: "Regulated brokers by country", path: "/best-forex-brokers-by-country" },
      },
      {
        subheading: "Compare total trading costs",
        text: `Spreads are only part of the picture. Factor in commissions per lot, swap rates for overnight positions, deposit/withdrawal fees, and inactivity charges. ECN brokers often offer raw spreads from 0.0 pips but charge a commission, while standard accounts markup the spread with no separate commission. Calculate total cost based on your typical trade size and frequency.`,
        link: { text: "Lowest spread brokers", path: "/lowest-spread-forex-brokers" },
      },
      {
        subheading: "Match the platform to your strategy",
        text: `If you trade forex manually, MetaTrader 4 or 5 covers most needs. Algorithmic traders may prefer cTrader or a broker with robust API access. For stock and ETF investing, look for platforms with fractional shares, real-time data, and portfolio analytics. Mobile app quality matters too — test the demo before committing.`,
        link: { text: "Best trading platforms", path: "/best-forex-trading-apps" },
      },
      {
        subheading: "Check account conditions",
        text: `Minimum deposits range from $0 to $10,000+ depending on the broker and account type. Look at available leverage (varies by regulation and instrument), supported currencies for your base account, and whether the broker offers a free demo. Some brokers restrict certain instruments or features in specific countries.`,
        link: { text: "Best brokers for beginners", path: "/best-forex-brokers-for-beginners" },
      },
      {
        subheading: "Use comparison tools",
        text: `Reading individual reviews helps, but comparing two brokers side by side reveals differences that single reviews miss. Our comparison tool lets you match any two brokers across scores, fees, platforms, and regulation in one view.`,
        link: { text: "Compare brokers", path: "/compare" },
      },
    ],
  },

  // ─── FAQ (6 questions, ~500-600 words) ─────────────────
  faq: [
    {
      q: "What is an online broker?",
      a: `An online broker is a financial intermediary that lets you buy and sell assets — stocks, forex, CFDs, crypto, options, or futures — through a digital platform. Unlike traditional brokers who took phone orders, online brokers provide direct market access through web, desktop, and mobile apps. Most charge through spreads (the difference between buy and sell prices) or commissions per trade. The best online brokers are regulated by government financial authorities that protect your funds.`,
    },
    {
      q: `How does RatedBrokers rate brokers?`,
      a: `We use a weighted scoring formula across 6 categories: Regulation & Safety (30%), Trading Costs (20%), User Reputation (15%), Broker Transparency (15%), Platforms & Tools (15%), and Execution Model (5%). Every broker must hold at least one Tier-1 regulatory license to be listed — this is a non-negotiable knockout criterion. We verify licenses directly on regulator databases, collect spread and fee data from multiple sources, and aggregate user reviews from Trustpilot and other platforms. Scores are updated quarterly.`,
    },
    {
      q: "Are the brokers on RatedBrokers regulated?",
      a: `Yes. Every broker listed on RatedBrokers holds at least one Tier-1 regulatory license from authorities like the FCA (UK), ASIC (Australia), NFA/CFTC (US), FINMA (Switzerland), MAS (Singapore), BaFin (Germany), or CySEC (EU/MiFID). Brokers with only Tier-2 or Tier-3 offshore licenses are not eligible for listing, regardless of their other qualities. We verify each license number directly on the regulator's public database.`,
    },
    {
      q: `What is the best online broker for beginners in ${YEAR}?`,
      a: `For beginners, we recommend brokers that combine strong regulation, low minimum deposits, educational resources, and user-friendly platforms. The best choice depends on what you want to trade and where you are located — regulation varies by country, and some brokers restrict features in certain regions. See our dedicated ranking of the best brokers for beginners, updated quarterly based on our scoring methodology.`,
    },
    {
      q: "How much money do I need to start trading?",
      a: `Minimum deposits vary widely by broker — from $0 at some brokers (for certain account types) to $200-$500 at most forex brokers, up to $10,000+ for premium accounts. Realistically, starting with $500-$1,000 gives you enough margin for proper risk management without overexposing your capital on any single trade. Many brokers offer free demo accounts so you can practice without risking real money. Check individual broker reviews for exact deposit requirements.`,
    },
    {
      q: "Does RatedBrokers receive compensation from brokers?",
      a: `Yes — we earn a commission when you open an account through our affiliate links. This is standard in the broker comparison industry and is how we fund our research. However, compensation never influences our rankings, scores, or reviews. Brokers cannot pay for higher placement or better ratings. Our scoring formula is published publicly, and every score is reproducible from the underlying data. We disclose this relationship on every page.`,
    },
  ],
};

export default HOMEPAGE_SEO;
