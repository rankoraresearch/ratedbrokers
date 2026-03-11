// ============================
// METHODOLOGY V2 DATA
// ============================

export const TRUST_SCORE_TIERS = [
  { min: 9.0, max: 10, label: "Excellent", color: "#059669", desc: "Top-tier broker with outstanding performance across all categories. Strongly recommended for all trader levels." },
  { min: 8.0, max: 8.9, label: "Very Good", color: "#2563eb", desc: "High-quality broker with minor weaknesses. Recommended for most traders." },
  { min: 7.0, max: 7.9, label: "Good", color: "#f59e0b", desc: "Solid broker with some notable gaps. Suitable for specific use cases." },
  { min: 6.0, max: 6.9, label: "Fair", color: "#f97316", desc: "Below-average broker with significant concerns. Proceed with caution." },
  { min: 0, max: 5.9, label: "Not Recommended", color: "#ef4444", desc: "Serious issues detected. We do not recommend opening an account." },
];

export const CRITERIA_V2 = [
  {
    key: "regulation", weight: 30, color: "#059669", icon: "shield",
    name: "Regulation & Safety",
    summary: "We verify every license number directly with the regulator's public database. No exceptions.",
    details: "A broker's regulatory status is the single most important factor in our evaluation. We don't just check if a broker claims to be regulated — we verify every license number directly on the regulator's website. We classify regulators into three tiers based on the strictness of their oversight, capital requirements, and investor protection schemes. A broker must hold at least one Tier-1 license to be listed on RatedBrokers (knockout criterion).",
    subCriteria: [
      { name: "Primary regulatory license(s)", weight: 10 },
      { name: "License verification status", weight: 5 },
      { name: "Investor compensation scheme", weight: 4 },
      { name: "Fund segregation policy", weight: 4 },
      { name: "Negative balance protection", weight: 3 },
      { name: "Regulatory history & sanctions", weight: 2 },
      { name: "Corporate transparency", weight: 2 },
    ],
    scoring: [
      { range: "9.0 – 10.0", desc: "Multiple Tier-1 licenses (FCA, ASIC, CySEC, FINMA, MAS). Segregated funds, investor compensation, negative balance protection." },
      { range: "7.0 – 8.9", desc: "At least one Tier-1 + Tier-2 licenses (DFSA, FMA, FSCA). Segregated funds confirmed." },
      { range: "5.0 – 6.9", desc: "Single Tier-1 license with offshore entities, or Tier-2 regulation only." },
      { range: "Below 5.0", desc: "Does not meet knockout criterion — not listed on RatedBrokers." },
    ],
    tiers: [
      { tier: "Tier 1", regs: ["FCA (UK)", "ASIC (Australia)", "NFA/CFTC (USA)", "FINMA (Switzerland)", "MAS (Singapore)", "BaFin (Germany)", "CySEC (Cyprus/EU)"], color: "#059669" },
      { tier: "Tier 2", regs: ["DFSA (Dubai)", "FMA (New Zealand)", "FSCA (South Africa)", "CMA (Kenya)", "JFSA (Japan)"], color: "#d97706" },
      { tier: "Tier 3", regs: ["FSA (Seychelles)", "VFSC (Vanuatu)", "IFSC (Belize)", "FSC (Mauritius)"], color: "#dc2626" },
    ],
  },
  {
    key: "costs", weight: 20, color: "#2563eb", icon: "dollar-sign",
    name: "Trading Costs",
    summary: "We collect spread data from broker websites and independent sources to calculate total trading costs.",
    details: "Advertised spreads rarely tell the full story. We collect average spread data from broker websites, independent comparison tools, and publicly available sources. We calculate total cost per lot including spread + commission + any additional fees. We also check for hidden costs like inactivity fees, withdrawal charges, and overnight swap markups.",
    subCriteria: [
      { name: "Average spread (EUR/USD)", weight: 6 },
      { name: "Commission per lot", weight: 4 },
      { name: "Total cost per lot (spread + commission)", weight: 4 },
      { name: "Swap/overnight rates", weight: 2 },
      { name: "Hidden fees (inactivity, withdrawal)", weight: 2 },
      { name: "Pricing transparency", weight: 2 },
    ],
    scoring: [
      { range: "9.0 – 10.0", desc: "Total cost under $7/lot on EUR/USD. Raw spreads with transparent commission. No hidden fees." },
      { range: "7.5 – 8.9", desc: "Total cost $7-10/lot. Competitive pricing for most retail traders. Minimal hidden fees." },
      { range: "5.5 – 7.4", desc: "Total cost $10-15/lot. Spread markup present. Some hidden fees (inactivity, withdrawal)." },
      { range: "Below 5.5", desc: "Total cost above $15/lot. Heavy spread markup. Multiple hidden fees. Deceptive pricing." },
    ],
  },
  {
    key: "reputation", weight: 15, color: "#00B67A", icon: "star",
    name: "User Reputation",
    summary: "We aggregate user reviews from Trustpilot and other public sources to assess real trader sentiment.",
    details: "User reviews provide valuable real-world feedback from actual traders. We aggregate ratings from Trustpilot and other publicly available review platforms. We consider overall rating, total review volume, recency of reviews (last 12 months weighted more heavily), and how the broker responds to negative feedback. Higher review counts provide more statistical confidence in the rating.",
    subCriteria: [
      { name: "Overall rating (Trustpilot + others)", weight: 5 },
      { name: "Review volume (total count)", weight: 3 },
      { name: "Review recency (last 12 months)", weight: 3 },
      { name: "Broker response to complaints", weight: 2 },
      { name: "Sentiment consistency", weight: 2 },
    ],
    scoring: [
      { range: "9.0 – 10.0", desc: "Trustpilot 4.5+/5 with 10,000+ reviews. Broker actively responds to complaints. Consistent sentiment." },
      { range: "7.0 – 8.9", desc: "Trustpilot 4.0-4.4/5 with 5,000+ reviews. Generally positive sentiment." },
      { range: "5.0 – 6.9", desc: "Trustpilot 3.5-3.9/5 or fewer than 2,000 reviews. Mixed sentiment." },
      { range: "Below 5.0", desc: "Trustpilot below 3.5/5 or significant complaint patterns detected." },
    ],
  },
  {
    key: "transparency", weight: 15, color: "#7c3aed", icon: "eye",
    name: "Broker Transparency",
    summary: "We evaluate how clearly a broker communicates fees, conditions, and corporate structure.",
    details: "Transparency is a strong signal of trustworthiness. We assess how clearly a broker publishes its fee schedule, withdrawal conditions, KYC requirements, and corporate ownership structure. We check whether risk warnings comply with regulatory requirements and whether important terms are prominently displayed or buried in legal documents.",
    subCriteria: [
      { name: "Fee disclosure quality", weight: 4 },
      { name: "Withdrawal conditions clarity", weight: 3 },
      { name: "KYC requirements documentation", weight: 3 },
      { name: "Company ownership transparency", weight: 3 },
      { name: "Risk warning compliance", weight: 2 },
    ],
    scoring: [
      { range: "9.0 – 10.0", desc: "All fees clearly published. No hidden conditions. Full ownership disclosure. Prominent risk warnings." },
      { range: "7.0 – 8.9", desc: "Most fees disclosed. Minor gaps in withdrawal terms. Ownership partially disclosed." },
      { range: "5.0 – 6.9", desc: "Important fees buried in legal documents. Unclear withdrawal conditions. Opaque corporate structure." },
      { range: "Below 5.0", desc: "Deceptive fee presentation. Hidden withdrawal restrictions. Anonymous ownership." },
    ],
  },
  {
    key: "platform", weight: 15, color: "#0ea5e9", icon: "monitor",
    name: "Platforms & Tools",
    summary: "We evaluate platform variety, mobile apps, charting tools, API access, and demo accounts.",
    details: "We assess every platform a broker offers: MT4, MT5, cTrader, TradingView, proprietary platforms, and mobile apps. We evaluate the number of available platforms, charting capabilities, indicator availability, algo trading support (EA/cBot), API access, demo account quality, and overall user experience across desktop, web, and mobile.",
    subCriteria: [
      { name: "Number of platforms offered", weight: 3 },
      { name: "Mobile app quality", weight: 3 },
      { name: "Charting & analysis tools", weight: 3 },
      { name: "Algo trading / API support", weight: 3 },
      { name: "Demo account quality", weight: 3 },
    ],
    scoring: [
      { range: "9.0 – 10.0", desc: "3+ platforms (MT4/MT5/cTrader/TradingView). Excellent mobile apps. API access. Full-featured demo account." },
      { range: "7.0 – 8.9", desc: "2+ platforms with good mobile apps. Some API or algo support. Functional demo." },
      { range: "5.0 – 6.9", desc: "Single platform or outdated software. Basic mobile experience. Limited demo." },
      { range: "Below 5.0", desc: "Proprietary-only platform with limited features. Poor mobile app or no mobile. No demo." },
    ],
  },
  {
    key: "execution", weight: 5, color: "#f59e0b", icon: "zap",
    name: "Execution Model",
    summary: "We assess the broker's declared execution model, liquidity sourcing, and order handling policy.",
    details: "We evaluate whether a broker operates an ECN/STP, hybrid, or market maker model based on publicly available information. We check for declared liquidity providers, order execution policies, and whether the broker publishes execution statistics. Brokers that clearly disclose their execution model and demonstrate no dealing desk intervention score highest.",
    subCriteria: [
      { name: "Execution model (ECN/STP vs Market Maker)", weight: 2 },
      { name: "Declared liquidity providers", weight: 1 },
      { name: "Order execution policy (NDD?)", weight: 1 },
      { name: "Execution statistics disclosure", weight: 1 },
    ],
    scoring: [
      { range: "9.0 – 10.0", desc: "Verified ECN/STP with disclosed liquidity providers. NDD execution. Published execution statistics." },
      { range: "7.0 – 8.9", desc: "Hybrid model with partial STP. Some disclosure of execution practices." },
      { range: "5.0 – 6.9", desc: "Market maker with limited execution disclosure." },
      { range: "Below 5.0", desc: "Undisclosed execution model. No dealing desk claims without supporting evidence." },
    ],
  },
];

export const CHANGELOG = [
  { date: "Mar 2026", broker: "IC Markets", change: "9.6 → 9.6", reason: "Methodology v2 applied — new formula weights, CySEC moved to Tier 1, Broker Transparency replaces Expert Hands-On Test. Score unchanged." },
];

export const FAQ_METHODOLOGY = [
  { q: "How often are broker scores updated?", a: "Every quarter. We re-collect spread data, re-check regulatory status, update user review scores, and reassess transparency. If a broker undergoes a significant change (new regulation, ownership change, security breach), we update immediately." },
  { q: "Do brokers pay to be listed?", a: "No. Our rankings are based entirely on our independent research methodology. Some brokers on our site are affiliate partners, meaning we may earn a commission if you open an account through our links. This never affects our scores or rankings. Many of our top-ranked brokers have no affiliate relationship with us." },
  { q: "What happens if a broker's score drops?", a: "If a broker's score drops below 7.0, we add a warning notice to their review. Below 6.0, we move them to a 'Not Recommended' list. Below 5.0, we remove them entirely. We always notify the broker and give them 30 days to address issues before making changes." },
  { q: "Can I suggest a broker for review?", a: "Yes. Email us at reviews@ratedbrokers.com with the broker name and your experience. We prioritize brokers that multiple users request. However, the broker must hold at least one Tier-1 regulatory license to be considered (our knockout criterion)." },
  { q: "Why don't you include [specific broker]?", a: "We only list brokers that hold at least one Tier-1 regulatory license (FCA, ASIC, CySEC, FINMA, MAS, BaFin, or NFA/CFTC). Brokers that are too new (under 2 years) or lack verifiable Tier-1 regulation are not eligible. We're constantly expanding our coverage." },
  { q: "How do you handle conflicts of interest?", a: "Full transparency: some brokers listed on our site are affiliate partners. However, our scoring is done by analysts who have no visibility into affiliate relationships. The editorial team and business team are completely separate. Our methodology is public — anyone can verify our scores." },
  { q: "What is the RatedBrokers Score?", a: "The RatedBrokers Score is our composite rating calculated from 6 weighted categories: Regulation & Safety (30%), Trading Costs (20%), User Reputation (15%), Broker Transparency (15%), Platforms & Tools (15%), and Execution Model (5%). Scores range from 0 to 10." },
  { q: "What is the knockout criterion?", a: "Every broker listed on RatedBrokers must hold at least one Tier-1 regulatory license (FCA, ASIC, CySEC, FINMA, MAS, BaFin, or NFA/CFTC). Brokers with only offshore or Tier-2 regulation are not eligible, regardless of other qualities. This ensures a baseline level of trader protection." },
  { q: "What triggers an off-cycle score update?", a: "Regulatory changes (new license, sanctions, fines), ownership changes, security breaches, major platform outages, significant spread increases, or multiple verified user complaints about withdrawal issues. We monitor industry news daily." },
  { q: "Can brokers dispute their score?", a: "Yes. Brokers can contact us with evidence that they believe warrants a score change. However, we only adjust scores based on verifiable data — not marketing claims. Any changes go through the same research process as initial evaluations." },
];

export const FAQ_HWMM = [
  { q: "Does RatedBrokers receive money from brokers?", a: "Yes — we earn affiliate commissions when you open a brokerage account through our links. This is how we fund our independent research. You pay exactly the same fees as if you went directly to the broker. Our commissions come from the broker's marketing budget, not from your trading costs." },
  { q: "Does affiliate income affect your rankings?", a: "No. Our editorial team scores brokers independently using our published methodology. Analysts have no visibility into which brokers are affiliate partners. The business team manages partnerships separately. A broker cannot pay for a higher score." },
  { q: "Are all brokers on your site affiliate partners?", a: "Currently we have 1 broker fully reviewed on RatedBrokers. As we expand coverage, some listed brokers will be affiliate partners and some won't. Our scores range reflects merit, not revenue." },
  { q: "Do I pay more if I use your links?", a: "No. You pay exactly the same spreads, commissions, and fees as if you signed up directly on the broker's website. Affiliate commissions are paid from the broker's existing marketing budget and do not add any cost to your trading." },
  { q: "How can I verify your independence?", a: "Three ways: (1) Our methodology is fully published — you can verify how we calculate every score. (2) Every reviewer has a public LinkedIn profile with verifiable credentials. (3) Our scoring formula is transparent and reproducible — anyone can check our math." },
  { q: "What if I don't want to use your affiliate link?", a: "That's completely fine. You can go directly to any broker's website and sign up without using our links. Our reviews and rankings are free to read regardless. We just ask that if you find our content helpful, consider using our links — it's how we keep the lights on." },
];
