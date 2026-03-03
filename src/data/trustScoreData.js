// ============================
// TRUST SCORE PAGE DATA
// ============================

export const FAQ_TRUST_SCORE = [
  {
    q: "What is the RatedBrokers Trust Score?",
    a: "The RatedBrokers Trust Score is a composite rating from 0 to 10 that measures the overall quality and trustworthiness of a forex broker. It is calculated from 130+ data points across 6 weighted categories: Regulation & Safety (25%), Trading Costs (20%), Expert Hands-On Test (20%), User Reviews (15%), Platforms & Tools (10%), and Execution Quality (10%).",
  },
  {
    q: "How is the Trust Score calculated?",
    a: "Each broker is scored across 6 categories using 130+ individual data points. Category scores are multiplied by their weights and summed to produce a final composite score. For example: (Regulation × 0.25) + (Costs × 0.20) + (Expert Test × 0.20) + (User Reviews × 0.15) + (Platforms × 0.10) + (Execution × 0.10) = Overall Score. Our full formula is publicly available on our Methodology page.",
  },
  {
    q: "What is a good Trust Score for a forex broker?",
    a: "A score of 9.0–10.0 is Excellent — these are top-tier brokers recommended for all traders. 8.0–8.9 is Very Good, suitable for most traders. 7.0–7.9 is Good but with some gaps. Below 7.0, we advise caution, and below 6.0 we do not recommend opening an account.",
  },
  {
    q: "How often are Trust Scores updated?",
    a: "All Trust Scores are re-evaluated quarterly with fresh data. We re-test spreads, check regulatory status, update Trustpilot reviews, and re-run our hands-on tests. Off-cycle updates happen immediately if a broker experiences a significant event (regulatory change, security breach, ownership change).",
  },
  {
    q: "Can brokers pay for a higher Trust Score?",
    a: "No. Our editorial team scores brokers independently using our published methodology. Analysts have no visibility into which brokers are affiliate partners. The business team manages partnerships separately. A broker cannot pay for a higher score or better placement.",
  },
  {
    q: "How does the RatedBrokers score compare to other rating systems?",
    a: "Unlike competitors who use proprietary formulas (ForexBrokers.com) or partially disclosed criteria (Investopedia, BrokerChooser), our entire scoring formula is publicly available. We use a 0–10 scale with 130+ data points, and every score is verified through real-money testing. No other major comparison site publishes their complete formula.",
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
    a: "We have currently scored and published reviews for 36 forex and CFD brokers. Each broker has been tested with real money over a 30-day period. We are continuously expanding our coverage and prioritize brokers with verifiable regulation and significant market presence.",
  },
  {
    q: "Can I suggest a broker for scoring?",
    a: "Yes. Email us at reviews@ratedbrokers.com with the broker name, website, and your experience. We prioritize brokers that multiple users request. However, the broker must have at least one verifiable regulatory license to be considered for scoring.",
  },
];

export const COMPETITOR_SYSTEMS = [
  {
    name: "ForexBrokers.com",
    scale: "1–99",
    variables: "130+",
    formula: "Proprietary",
    testing: "Unknown",
    highlight: false,
  },
  {
    name: "Investopedia",
    scale: "0–5",
    variables: "105",
    formula: "Partial",
    testing: "Unknown",
    highlight: false,
  },
  {
    name: "BrokerChooser",
    scale: "1–5",
    variables: "600+",
    formula: "Partial",
    testing: "Unknown",
    highlight: false,
  },
  {
    name: "RatedBrokers",
    scale: "0–10",
    variables: "130+",
    formula: "Fully Published",
    testing: "Real Money",
    highlight: true,
  },
];

export const HOW_TO_READ_STEPS = [
  {
    step: 1,
    title: "Check the Overall Score",
    desc: "Start with the composite score (0–10). This single number summarizes the broker's quality across all 6 categories. Example: IC Markets scores 9.7/10 — placing it in the Excellent tier.",
    example: "IC Markets: 9.7 / 10",
  },
  {
    step: 2,
    title: "Identify the Tier",
    desc: "Every score maps to a tier: Excellent (9.0+), Very Good (8.0–8.9), Good (7.0–7.9), Fair (6.0–6.9), or Not Recommended (below 6.0). The tier gives you an instant quality benchmark.",
    example: "9.7 → Excellent (top-tier, strongly recommended)",
  },
  {
    step: 3,
    title: "Examine the Criteria Breakdown",
    desc: "Look at the 6 individual category scores. This reveals strengths and weaknesses behind the overall number. A broker might score 9.8 in Regulation but 7.5 in Costs — understanding this helps you match the broker to your needs.",
    example: "IC Markets: Regulation 9.8 · Costs 9.5 · Expert Test 9.8 · Reviews 9.7 · Platforms 9.6 · Execution 9.8",
  },
  {
    step: 4,
    title: "Read the Full Review",
    desc: "The score is your starting point — the review is your deep dive. Each review contains 3,000+ words of analysis covering account types, spreads, regulation details, platform testing, and our expert verdict.",
    example: "Read our full IC Markets review for the complete analysis →",
  },
];
