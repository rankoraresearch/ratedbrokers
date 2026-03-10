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
    key: "regulation", weight: 25, color: "#059669", icon: "shield",
    name: "Regulation & Safety",
    summary: "We verify every license number directly with the regulator's public database. No exceptions.",
    details: "A broker's regulatory status is the single most important factor in our evaluation. We don't just check if a broker claims to be regulated — we verify every license number directly on the regulator's website. We classify regulators into three tiers based on the strictness of their oversight, capital requirements, and investor protection schemes.",
    subCriteria: [
      { name: "Primary regulatory license(s)", weight: 8 },
      { name: "License verification status", weight: 4 },
      { name: "Investor compensation scheme", weight: 3 },
      { name: "Fund segregation policy", weight: 3 },
      { name: "Negative balance protection", weight: 3 },
      { name: "Regulatory history & sanctions", weight: 2 },
      { name: "Corporate transparency", weight: 2 },
    ],
    scoring: [
      { range: "9.0 – 10.0", desc: "Multiple Tier-1 licenses (FCA, ASIC, NFA, FINMA, MAS). Segregated funds, investor compensation, negative balance protection." },
      { range: "7.0 – 8.9", desc: "At least one Tier-1 + Tier-2 licenses (CySEC, DFSA, FMA). Segregated funds confirmed." },
      { range: "5.0 – 6.9", desc: "Tier-2 regulation only, or single Tier-1 license with offshore entities." },
      { range: "Below 5.0", desc: "Offshore-only regulation (VFSC, SVG, FSA Seychelles). We flag these brokers with warnings." },
    ],
    tiers: [
      { tier: "Tier 1", regs: ["FCA (UK)", "ASIC (Australia)", "NFA/CFTC (USA)", "FINMA (Switzerland)", "MAS (Singapore)", "BaFin (Germany)"], color: "#059669" },
      { tier: "Tier 2", regs: ["CySEC (Cyprus/EU)", "DFSA (Dubai)", "FMA (New Zealand)", "FSCA (South Africa)", "CMA (Kenya)"], color: "#d97706" },
      { tier: "Tier 3", regs: ["FSA (Seychelles)", "VFSC (Vanuatu)", "IFSC (Belize)", "FSC (Mauritius)"], color: "#dc2626" },
    ],
  },
  {
    key: "costs", weight: 20, color: "#2563eb", icon: "dollar-sign",
    name: "Trading Costs",
    summary: "We measure real spreads over 30 days with live accounts — not the minimums brokers advertise.",
    details: "Advertised spreads are meaningless. A broker may claim '0.0 pip spreads' but their average spread could be 0.5 pips with frequent widening. We open real accounts, deposit real money, and measure actual spreads across 500+ trades over a 30-day period. We calculate total cost per lot including spread + commission + any hidden fees.",
    subCriteria: [
      { name: "Average spread (EUR/USD, 30-day)", weight: 6 },
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
    key: "trustpilot", weight: 15, color: "#00B67A", icon: "star",
    name: "User Reviews (Trustpilot)",
    summary: "We aggregate real user sentiment and use NLP analysis to filter fake reviews.",
    details: "Trustpilot scores provide real-world feedback from actual traders. However, we don't just use the raw score — we analyze review patterns. We filter for fake positive reviews (same language patterns, burst reviews around the same date) and examine the substance of negative reviews (are complaints about execution, withdrawals, or just user error?). We weight recent reviews more heavily than older ones.",
    subCriteria: [
      { name: "Overall Trustpilot rating", weight: 5 },
      { name: "Review volume (total count)", weight: 3 },
      { name: "Fake review detection (NLP)", weight: 3 },
      { name: "Recency-weighted sentiment", weight: 2 },
      { name: "Broker response quality", weight: 2 },
    ],
    scoring: [
      { range: "9.0 – 10.0", desc: "Trustpilot 4.5+/5 with 10,000+ reviews. Minimal fake review patterns. Broker actively responds to complaints." },
      { range: "7.0 – 8.9", desc: "Trustpilot 4.0-4.4/5 with 5,000+ reviews. Some fake patterns but genuine core." },
      { range: "5.0 – 6.9", desc: "Trustpilot 3.5-3.9/5 or fewer than 2,000 reviews. Mixed sentiment." },
      { range: "Below 5.0", desc: "Trustpilot below 3.5/5 or significant fake review patterns detected." },
    ],
  },
  {
    key: "expert", weight: 20, color: "#7c3aed", icon: "microscope",
    name: "Expert Hands-On Test",
    summary: "Our verified traders open real accounts and test execution, slippage, and withdrawals personally.",
    details: "Every broker we rank is tested by at least two members of our team using real money. We open accounts, verify KYC, deposit funds, execute trades, test customer support, and withdraw money. This hands-on testing catches issues that no spreadsheet analysis can find: slow KYC, unresponsive support, hidden withdrawal conditions, platform bugs, and more.",
    subCriteria: [
      { name: "Account opening & KYC experience", weight: 4 },
      { name: "Deposit speed & reliability", weight: 3 },
      { name: "Withdrawal speed & reliability", weight: 4 },
      { name: "Customer support quality", weight: 4 },
      { name: "Platform stability during testing", weight: 3 },
      { name: "Overall user experience", weight: 2 },
    ],
    scoring: [
      { range: "9.0 – 10.0", desc: "Flawless onboarding, fast KYC, responsive support, smooth withdrawals, no issues during 30-day test." },
      { range: "7.0 – 8.9", desc: "Minor issues (slow KYC, occasional support delays) but overall positive experience." },
      { range: "5.0 – 6.9", desc: "Notable friction (withdrawal delays, support gaps, platform issues)." },
      { range: "Below 5.0", desc: "Serious problems (KYC rejection, withdrawal blocking, unresponsive support, suspicious behavior)." },
    ],
  },
  {
    key: "platform", weight: 10, color: "#0ea5e9", icon: "monitor",
    name: "Platforms & Tools",
    summary: "We evaluate platform quality, mobile apps, charting tools, and API access.",
    details: "We test every platform a broker offers: MT4, MT5, cTrader, TradingView, proprietary platforms, and mobile apps. We evaluate charting capabilities, order types, indicator availability, algo trading support (EA/cBot), API access, and overall user experience.",
    subCriteria: [
      { name: "Number of platforms offered", weight: 3 },
      { name: "Mobile app quality", weight: 3 },
      { name: "Charting & analysis tools", weight: 2 },
      { name: "Algo trading / API support", weight: 2 },
    ],
    scoring: [
      { range: "9.0 – 10.0", desc: "3+ platforms (MT4/MT5/cTrader/TradingView). Excellent mobile apps. API access. Algo trading supported." },
      { range: "7.0 – 8.9", desc: "2+ platforms with good mobile apps. Some API or algo support." },
      { range: "5.0 – 6.9", desc: "Single platform or outdated software. Basic mobile experience." },
      { range: "Below 5.0", desc: "Proprietary-only platform with limited features. Poor mobile app or no mobile." },
    ],
  },
  {
    key: "execution", weight: 10, color: "#f59e0b", icon: "zap",
    name: "Execution Quality",
    summary: "We measure fill speed, slippage symmetry, requotes, and server uptime.",
    details: "Execution quality separates good brokers from great ones. We measure average execution speed (in milliseconds), slippage frequency and direction (symmetric vs asymmetric), requote rates, and order rejection rates. A broker with fast execution but asymmetric slippage (always against the trader) scores lower than a slightly slower broker with fair, symmetric slippage.",
    subCriteria: [
      { name: "Average execution speed (ms)", weight: 3 },
      { name: "Slippage frequency & symmetry", weight: 3 },
      { name: "Requote / rejection rate", weight: 2 },
      { name: "Server uptime (99.9%+)", weight: 2 },
    ],
    scoring: [
      { range: "9.0 – 10.0", desc: "Under 50ms average execution. Symmetric slippage. Zero requotes. 99.9%+ server uptime." },
      { range: "7.0 – 8.9", desc: "50-100ms execution. Mostly symmetric slippage. Rare requotes." },
      { range: "5.0 – 6.9", desc: "100-200ms execution. Slightly asymmetric slippage. Occasional requotes." },
      { range: "Below 5.0", desc: "Over 200ms execution. Clear asymmetric slippage. Frequent requotes or rejections." },
    ],
  },
];

export const CHANGELOG = [
  { date: "Feb 2026", broker: "eToro", change: "8.5 → 8.5", reason: "Quarterly re-evaluation — no score change. Spreads and execution stable." },
  { date: "Jan 2026", broker: "XM", change: "8.6 → 8.8", reason: "Improved execution speeds, lower spreads on Ultra Low accounts." },
  { date: "Jan 2026", broker: "Vantage", change: "8.3 → 8.4", reason: "Added TradingView integration, improved mobile app UX." },
  { date: "Dec 2025", broker: "IG", change: "9.4 → 9.5", reason: "New ProRealTime update, best-in-class charting tools." },
  { date: "Nov 2025", broker: "FXCM", change: "7.9 → 7.7", reason: "Increased spreads on major pairs, slower withdrawal processing." },
];

export const FAQ_METHODOLOGY = [
  { q: "How often are broker scores updated?", a: "Every quarter. We re-test all published brokers with live accounts, update spread data, re-check regulatory status, and incorporate new Trustpilot reviews. If a broker undergoes a significant change (new regulation, ownership change, security breach), we update immediately." },
  { q: "Do brokers pay to be listed?", a: "No. Our rankings are based entirely on our independent testing methodology. Some brokers on our site are affiliate partners, meaning we may earn a commission if you open an account through our links. This never affects our scores or rankings. Many of our top-ranked brokers have no affiliate relationship with us." },
  { q: "What happens if a broker's score drops?", a: "If a broker's score drops below 7.0, we add a warning notice to their review. Below 6.0, we move them to a 'Not Recommended' list. Below 5.0, we remove them entirely. We always notify the broker and give them 30 days to address issues before making changes." },
  { q: "Can I suggest a broker for review?", a: "Yes. Email us at reviews@ratedbrokers.com with the broker name and your experience. We prioritize brokers that multiple users request. However, the broker must have at least one verifiable regulatory license to be considered." },
  { q: "Why don't you include [specific broker]?", a: "We only review brokers we can test personally with real money. Some brokers restrict accounts based on geography, making testing impossible. Others are too new (under 2 years) or lack verifiable regulation. We're constantly expanding our coverage." },
  { q: "How do you handle conflicts of interest?", a: "Full transparency: some brokers listed on our site are affiliate partners. However, our scoring is done by analysts who have no visibility into affiliate relationships. The editorial team and business team are completely separate. Our methodology is public — anyone can verify our scores." },
  { q: "What is the RatedBrokers Score?", a: "The RatedBrokers Score is our composite rating calculated from 130+ data points across 6 weighted categories: Regulation & Safety (25%), Trading Costs (20%), User Reviews (15%), Expert Hands-On Test (20%), Platforms & Tools (10%), and Execution Quality (10%). Scores range from 0 to 10." },
  { q: "How many data points do you analyze per broker?", a: "Over 130 individual data points per broker, covering everything from regulatory license verification and real spread measurements to customer support response times and withdrawal processing speeds. Each data point is verified by at least two team members." },
  { q: "What triggers an off-cycle score update?", a: "Regulatory changes (new license, sanctions, fines), ownership changes, security breaches, major platform outages, significant spread increases, or multiple verified user complaints about withdrawal issues. We monitor industry news daily." },
  { q: "Can brokers dispute their score?", a: "Yes. Brokers can contact us with evidence that they believe warrants a score change. However, we only adjust scores based on verifiable data — not marketing claims. Any changes go through the same testing process as initial evaluations." },
];

export const FAQ_HWMM = [
  { q: "Does RatedBrokers receive money from brokers?", a: "Yes — we earn affiliate commissions when you open a brokerage account through our links. This is how we fund our independent testing. You pay exactly the same fees as if you went directly to the broker. Our commissions come from the broker's marketing budget, not from your trading costs." },
  { q: "Does affiliate income affect your rankings?", a: "No. Our editorial team scores brokers independently using our published methodology. Analysts have no visibility into which brokers are affiliate partners. The business team manages partnerships separately. A broker cannot pay for a higher score." },
  { q: "Are all brokers on your site affiliate partners?", a: "All 36 brokers currently listed on RatedBrokers are affiliate partners. However, notice that our scores range from 7.5 to 9.7 — if money influenced rankings, all partners would score 9+. We rank brokers based on merit, not revenue." },
  { q: "Do I pay more if I use your links?", a: "No. You pay exactly the same spreads, commissions, and fees as if you signed up directly on the broker's website. Affiliate commissions are paid from the broker's existing marketing budget and do not add any cost to your trading." },
  { q: "How can I verify your independence?", a: "Three ways: (1) Our methodology is fully published — you can verify how we calculate every score. (2) Every reviewer has a public LinkedIn profile with verifiable credentials. (3) Our score range (7.5-9.7) across all partners proves that money doesn't influence rankings." },
  { q: "What if I don't want to use your affiliate link?", a: "That's completely fine. You can go directly to any broker's website and sign up without using our links. Our reviews and rankings are free to read regardless. We just ask that if you find our content helpful, consider using our links — it's how we keep the lights on." },
];
