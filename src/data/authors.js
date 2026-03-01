export const AUTHORS = {
  "marcus-chen": {
    id: "marcus-chen",
    name: "Marcus Chen",
    role: "Senior Forex Analyst",
    initials: "MC",
    exp: "14 years",
    linkedin: "https://linkedin.com/in/marcus-chen-forex",
    image: "/authors/marcus-chen.webp",
    credentials: ["CMT"],
    verified: true,
    bio: "Marcus has tested over 80 forex brokers with real money since 2012. Formerly a prop trader at a London desk, he now leads RatedBrokers' forex testing methodology, executing 500+ trades per broker evaluation.",
    specialty: "ECN/STP Execution, Spread Analysis",
    reviews: 87,
  },
  "sarah-williams": {
    id: "sarah-williams",
    name: "Sarah Williams",
    role: "Crypto & CFD Specialist",
    initials: "SW",
    exp: "9 years",
    linkedin: "https://linkedin.com/in/sarah-williams-crypto",
    image: "/authors/sarah-williams.webp",
    credentials: ["CAIA"],
    verified: true,
    bio: "Sarah specializes in cryptocurrency derivatives and CFD markets. With 9 years of hands-on trading experience, she evaluates crypto exchanges and multi-asset brokers for execution quality, fee transparency, and regulatory compliance.",
    specialty: "Crypto Derivatives, Multi-Asset CFDs",
    reviews: 62,
  },
  "elena-petrova": {
    id: "elena-petrova",
    name: "Elena Petrova",
    role: "Quant Strategy Analyst",
    initials: "EP",
    exp: "11 years",
    linkedin: "https://linkedin.com/in/elena-petrova-quant",
    image: "/authors/elena-petrova.webp",
    credentials: ["CQF"],
    verified: true,
    bio: "Elena brings 11 years of quantitative trading experience to RatedBrokers. She evaluates broker platforms for algo trading capabilities, API access, and execution infrastructure, running automated strategies on every broker she reviews.",
    specialty: "Algo Trading, Platform Infrastructure",
    reviews: 73,
  },
  "david-kowalski": {
    id: "david-kowalski",
    name: "David Kowalski",
    role: "Risk & Regulation Expert",
    initials: "DK",
    exp: "18 years",
    linkedin: "https://linkedin.com/in/david-kowalski-risk",
    image: "/authors/david-kowalski.webp",
    credentials: ["CAMS"],
    verified: true,
    bio: "David is a former compliance officer with 18 years in financial regulation. He verifies every broker's licenses directly with regulators, assesses fund safety measures, and serves as RatedBrokers' fact-checker for all published reviews.",
    specialty: "Broker Licensing, Regulatory Compliance",
    reviews: 45,
  },
};

// Маппинг категории рейтинга → автор
export const RANKING_CATEGORY_AUTHORS = {
  forex: "marcus-chen",
  crypto: "sarah-williams",
  assets: "elena-petrova",
  stocks: "elena-petrova",
  country: "david-kowalski",
  alternatives: "marcus-chen",
};

// Факт-чекер — всегда David, кроме его собственных статей → Marcus
export function getFactChecker(authorId) {
  if (authorId === "david-kowalski") return AUTHORS["marcus-chen"];
  return AUTHORS["david-kowalski"];
}

// Получить автора по ranking category
export function getAuthorForRanking(category) {
  const authorId = RANKING_CATEGORY_AUTHORS[category] || "marcus-chen";
  return AUTHORS[authorId];
}

// Получить автора для broker review по AUTHOR.name из broker data
export function getAuthorByName(name) {
  return Object.values(AUTHORS).find((a) => a.name === name) || AUTHORS["marcus-chen"];
}
