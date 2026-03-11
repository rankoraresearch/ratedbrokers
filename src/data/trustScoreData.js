// ============================
// TRUST SCORE PAGE DATA
// ============================

export const FAQ_TRUST_SCORE = [
  {
    q: "What is the RatedBrokers Trust Score?",
    a: "The RatedBrokers Trust Score is a composite rating from 0 to 10 that measures the overall quality and trustworthiness of a forex broker. It is calculated from 6 weighted categories: Regulation & Safety (30%), Trading Costs (20%), User Reputation (15%), Broker Transparency (15%), Platforms & Tools (15%), and Execution Model (5%).",
  },
  {
    q: "How is the Trust Score calculated?",
    a: "Each broker is scored across 6 categories. Category scores are multiplied by their weights and summed to produce a final composite score. Formula: (Regulation × 0.30) + (Costs × 0.20) + (Reputation × 0.15) + (Transparency × 0.15) + (Platforms × 0.15) + (Execution × 0.05) = Overall Score. Our full formula is publicly available on our Methodology page.",
  },
  {
    q: "What is a good Trust Score for a forex broker?",
    a: "A score of 9.0–10.0 is Excellent — these are top-tier brokers recommended for all traders. 8.0–8.9 is Very Good, suitable for most traders. 7.0–7.9 is Good but with some gaps. Below 7.0, we advise caution, and below 6.0 we do not recommend opening an account.",
  },
  {
    q: "How often are Trust Scores updated?",
    a: "All Trust Scores are re-evaluated quarterly with fresh data. We re-collect spread data, check regulatory status, update user review aggregations, and reassess broker transparency. Off-cycle updates happen immediately if a broker experiences a significant event (regulatory change, security breach, ownership change).",
  },
  {
    q: "Can brokers pay for a higher Trust Score?",
    a: "No. Our editorial team scores brokers independently using our published methodology. Analysts have no visibility into which brokers are affiliate partners. The business team manages partnerships separately. A broker cannot pay for a higher score or better placement.",
  },
  {
    q: "How does the RatedBrokers score compare to other rating systems?",
    a: "Our entire scoring formula is publicly available with exact weights. We use a 0–10 scale with a research-based approach — collecting data from regulatory databases, broker websites, independent sources, and aggregated user reviews. We also publish our regulator tier classifications and knockout criteria, giving full transparency into how scores are determined.",
  },
  {
    q: "What happens if a broker's Trust Score drops?",
    a: "If a broker's score drops below 7.0, we add a warning notice to their review. Below 6.0, they move to a 'Not Recommended' list. Below 5.0, we remove them entirely. We notify the broker and give them 30 days to address issues before publishing changes.",
  },
  {
    q: "Why do some brokers have similar overall scores but different category scores?",
    a: "Two brokers can achieve the same overall score through different strengths. For example, one broker might excel in regulation (9.8) but have higher costs (7.5), while another has lower regulation quality (8.5) but ultra-low costs (9.5). This is why we recommend checking individual category scores, not just the overall number.",
  },
  {
    q: "How many brokers has RatedBrokers scored?",
    a: "We currently have 1 fully reviewed and scored broker on our platform. We are actively expanding our coverage and prioritize brokers with Tier-1 regulatory licenses and significant market presence.",
  },
  {
    q: "Can I suggest a broker for scoring?",
    a: "Yes. Email us at reviews@ratedbrokers.com with the broker name, website, and your experience. We prioritize brokers that multiple users request. However, the broker must hold at least one Tier-1 regulatory license to be considered for scoring (our knockout criterion).",
  },
];

export const COMPETITOR_SYSTEMS = [
  {
    name: "ForexBrokers.com",
    scale: "0–5 Stars",
    variables: "130+",
    formula: "Published with weights",
    testing: "Research-Based",
    highlight: false,
  },
  {
    name: "Investopedia",
    scale: "0–5 Stars",
    variables: "3,000+",
    formula: "Published with weights",
    testing: "Research-Based",
    highlight: false,
  },
  {
    name: "BrokerChooser",
    scale: "Numeric",
    variables: "1,200+",
    formula: "Partial (~50% disclosed)",
    testing: "Research-Based",
    highlight: false,
  },
  {
    name: "RatedBrokers",
    scale: "0–10",
    variables: "50+",
    formula: "Fully Published",
    testing: "Research-Based",
    highlight: true,
  },
];

export const HOW_TO_READ_STEPS = [
  {
    step: 1,
    title: "Check the Overall Score",
    desc: "Start with the composite score (0–10). This single number summarizes the broker's quality across all 6 categories. Example: IC Markets scores 9.6/10 — placing it in the Excellent tier.",
    example: "IC Markets: 9.6 / 10",
  },
  {
    step: 2,
    title: "Identify the Tier",
    desc: "Every score maps to a tier: Excellent (9.0+), Very Good (8.0–8.9), Good (7.0–7.9), Fair (6.0–6.9), or Not Recommended (below 6.0). The tier gives you an instant quality benchmark.",
    example: "9.6 → Excellent (top-tier, strongly recommended)",
  },
  {
    step: 3,
    title: "Examine the Criteria Breakdown",
    desc: "Look at the 6 individual category scores. This reveals strengths and weaknesses behind the overall number. A broker might score 9.8 in Regulation but 7.5 in Costs — understanding this helps you match the broker to your needs.",
    example: "IC Markets: Regulation 9.6 · Costs 8.8 · Reputation 9.9 · Transparency 9.5 · Platforms 10.0 · Execution 9.8",
  },
  {
    step: 4,
    title: "Read the Full Review",
    desc: "The score is your starting point — the review is your deep dive. Each review contains detailed analysis covering account types, spreads, regulation details, platform features, and our expert verdict.",
    example: "Read our full IC Markets review for the complete analysis →",
  },
];
