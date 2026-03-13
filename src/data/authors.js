export const AUTHORS = {
  "marcus-chen": {
    id: "marcus-chen",
    name: "Marcus Chen",
    role: "Senior Forex Analyst",
    initials: "MC",
    exp: "14 years",
    linkedin: "https://linkedin.com/in/marcus-chen-forex",
    twitter: "https://x.com/marcuschen_fx",
    image: "/authors/marcus-chen.webp",
    credentials: ["CMT"],
    verified: true,
    bio: "Marcus has analyzed over 80 forex brokers since 2012. Formerly a prop trader at a London desk, he now leads RatedBrokers' forex research methodology, evaluating 130+ data points per broker review.",
    shortBio: "Lead analyst with 14 years in forex. Has independently analyzed 80+ brokers across 130+ data points.",
    specialty: "ECN/STP Execution, Spread Analysis",
    reviews: 87,
  },
  "sarah-williams": {
    id: "sarah-williams",
    name: "Sarah Williams",
    role: "Senior Editor",
    initials: "SW",
    exp: "9 years",
    linkedin: "https://linkedin.com/in/sarah-williams-crypto",
    twitter: "https://x.com/sarahwilliams_ed",
    image: "/authors/sarah-williams.webp",
    credentials: ["CAIA"],
    verified: true,
    bio: "Sarah is the Senior Editor at RatedBrokers, responsible for editorial quality and accuracy across all published content. With 9 years in financial media and hands-on trading experience, she ensures every review meets rigorous editorial standards.",
    shortBio: "Senior Editor with 9 years in financial media. Oversees editorial quality and accuracy for all broker reviews.",
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
    twitter: "https://x.com/epetrova_quant",
    image: "/authors/elena-petrova.webp",
    credentials: ["CQF"],
    verified: true,
    bio: "Elena brings 11 years of quantitative trading experience to RatedBrokers. She evaluates broker platforms for algo trading capabilities, API access, and execution infrastructure, running automated strategies on every broker she reviews.",
    shortBio: "Quant analyst with 11 years of experience. Evaluates platforms for algo trading, API access, and execution quality.",
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
    twitter: "https://x.com/dkowalski_risk",
    image: "/authors/david-kowalski.webp",
    credentials: ["CAMS"],
    verified: true,
    bio: "David is a former compliance officer with 18 years in financial regulation. He verifies every data point in published reviews by cross-referencing directly with broker websites, regulatory databases, and verified account information.",
    shortBio: "Former compliance officer with 18 years in regulation. Verifies every data point against regulatory databases.",
    specialty: "Broker Licensing, Regulatory Compliance",
    reviews: 45,
  },
};

// Фиксированная команда для всего контента
export const TEAM = {
  writer: AUTHORS["marcus-chen"],
  editor: AUTHORS["sarah-williams"],
  factChecker: AUTHORS["david-kowalski"],
  reviewer: AUTHORS["elena-petrova"],
};

// Маппинг категории рейтинга → автор (все пишет Marcus)
export const RANKING_CATEGORY_AUTHORS = {
  forex: "marcus-chen",
  crypto: "marcus-chen",
  assets: "marcus-chen",
  stocks: "marcus-chen",
  country: "marcus-chen",
  alternatives: "marcus-chen",
};

// Факт-чекер — всегда David
export function getFactChecker() {
  return AUTHORS["david-kowalski"];
}

// Получить автора по ranking category
export function getAuthorForRanking() {
  return AUTHORS["marcus-chen"];
}

// Reviewer — всегда Elena
export function getReviewerForAuthor() {
  return AUTHORS["elena-petrova"];
}

// Редактор — всегда Sarah
export function getEditor() {
  return AUTHORS["sarah-williams"];
}

// Получить автора для broker review по AUTHOR.name из broker data
export function getAuthorByName() {
  return AUTHORS["marcus-chen"];
}

// Получить полную команду
export function getEditorialTeam() {
  return TEAM;
}
