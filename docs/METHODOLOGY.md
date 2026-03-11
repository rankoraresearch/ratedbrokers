# RatedBrokers Scoring Methodology v2

> Source of truth for all scoring calculations, criteria definitions, and regulator classifications.

## Overview

RatedBrokers evaluates forex and CFD brokers using a **research-based methodology**. We collect data from official regulatory databases, broker websites, independent sources, and aggregated user reviews. Every score is transparent, reproducible, and publicly documented.

## Formula

```
Overall Score = (Regulation × 0.30) + (Costs × 0.20) + (Reputation × 0.15)
              + (Transparency × 0.15) + (Platform × 0.15) + (Execution × 0.05)
```

| # | Category              | Weight | Key                |
|---|-----------------------|--------|--------------------|
| 1 | Regulation & Safety   | 30%    | `regulation`       |
| 2 | Trading Costs         | 20%    | `costs`            |
| 3 | User Reputation       | 15%    | `reputation`       |
| 4 | Broker Transparency   | 15%    | `transparency`     |
| 5 | Platforms & Tools     | 15%    | `platform`         |
| 6 | Execution Model       | 5%     | `execution`        |

**Total: 100%**

## Knockout Criterion

A broker **must** hold at least one Tier-1 regulatory license to be listed on RatedBrokers. Brokers with only Tier-2 or Tier-3 licenses are not eligible for review, regardless of other qualities.

## Regulator Tiers

### Tier 1 — Strict Oversight
Regulators with the highest standards: robust capital requirements, mandatory fund segregation, investor compensation schemes, and active enforcement.

| Regulator | Country/Region |
|-----------|---------------|
| FCA       | United Kingdom |
| ASIC      | Australia      |
| NFA/CFTC  | United States  |
| FINMA     | Switzerland    |
| MAS       | Singapore      |
| BaFin     | Germany        |
| CySEC     | Cyprus (EU/MiFID) |

**Note:** CySEC is classified as Tier 1 because it operates under the EU's MiFID II framework, which mandates investor compensation (up to €20,000), strict capital adequacy requirements, and cross-border passporting. This aligns with industry standards (ForexBrokers.com, Investopedia).

### Tier 2 — Moderate Oversight
Established regulators with reasonable standards but less comprehensive investor protection.

| Regulator | Country/Region |
|-----------|---------------|
| DFSA      | Dubai (DIFC)   |
| FMA       | New Zealand    |
| FSCA      | South Africa   |
| CMA       | Kenya          |
| JFSA      | Japan          |

### Tier 3 — Light Oversight
Offshore regulators with minimal requirements. Brokers operating solely under Tier-3 licenses are **not listed** on RatedBrokers.

| Regulator | Country/Region |
|-----------|---------------|
| FSA       | Seychelles     |
| VFSC      | Vanuatu        |
| IFSC      | Belize         |
| FSC       | Mauritius      |
| SVG FSA   | St. Vincent    |

---

## Criteria Details

### 1. Regulation & Safety (30%)

We verify every license number directly on the regulator's public database. No exceptions.

**Sub-criteria:**
| Sub-criterion                       | Weight |
|-------------------------------------|--------|
| Primary regulatory license(s)       | 10%    |
| License verification status         | 5%     |
| Investor compensation scheme        | 4%     |
| Fund segregation policy             | 4%     |
| Negative balance protection         | 3%     |
| Regulatory history & sanctions      | 2%     |
| Corporate transparency              | 2%     |

**Scoring guide:**
- **9.0–10.0**: Multiple Tier-1 licenses. Segregated funds, investor compensation, negative balance protection.
- **7.0–8.9**: At least one Tier-1 + Tier-2 licenses. Segregated funds confirmed.
- **5.0–6.9**: Single Tier-1 with offshore entities, or Tier-2 only.
- **Below 5.0**: Not eligible — knockout criterion applies.

### 2. Trading Costs (20%)

We collect spread data from broker websites, independent comparison tools, and publicly available sources. We calculate total cost per lot (spread + commission + fees).

**Sub-criteria:**
| Sub-criterion                       | Weight |
|-------------------------------------|--------|
| Average spread (EUR/USD)            | 6%     |
| Commission per lot                  | 4%     |
| Total cost per lot                  | 4%     |
| Swap/overnight rates                | 2%     |
| Hidden fees (inactivity, withdrawal)| 2%     |
| Pricing transparency                | 2%     |

**Scoring guide:**
- **9.0–10.0**: Total cost under $7/lot EUR/USD. Raw spreads with transparent commission. No hidden fees.
- **7.5–8.9**: Total cost $7–10/lot. Competitive pricing. Minimal hidden fees.
- **5.5–7.4**: Total cost $10–15/lot. Spread markup present. Some hidden fees.
- **Below 5.5**: Total cost above $15/lot. Heavy markup. Multiple hidden fees.

### 3. User Reputation (15%)

We aggregate publicly available user reviews from Trustpilot and other review platforms. We analyze overall rating, review volume, recency of reviews, and how the broker responds to complaints.

**Sub-criteria:**
| Sub-criterion                       | Weight |
|-------------------------------------|--------|
| Overall rating (Trustpilot + others)| 5%     |
| Review volume (total count)         | 3%     |
| Review recency (last 12 months)     | 3%     |
| Broker response to complaints       | 2%     |
| Sentiment consistency               | 2%     |

**Scoring guide:**
- **9.0–10.0**: 4.5+/5 with 10,000+ reviews. Broker actively responds to complaints.
- **7.0–8.9**: 4.0–4.4/5 with 5,000+ reviews. Generally positive sentiment.
- **5.0–6.9**: 3.5–3.9/5 or fewer than 2,000 reviews. Mixed sentiment.
- **Below 5.0**: Below 3.5/5 or significant complaint patterns.

### 4. Broker Transparency (15%)

We evaluate how clearly a broker communicates its fees, conditions, and corporate structure. Transparency is a strong signal of trustworthiness.

**Sub-criteria:**
| Sub-criterion                       | Weight |
|-------------------------------------|--------|
| Fee disclosure quality              | 4%     |
| Withdrawal conditions clarity       | 3%     |
| KYC requirements documentation      | 3%     |
| Company ownership transparency      | 3%     |
| Risk warning compliance             | 2%     |

**Scoring guide:**
- **9.0–10.0**: All fees clearly published on website. No hidden conditions. Full ownership disclosure. Prominent risk warnings.
- **7.0–8.9**: Most fees disclosed. Minor gaps in withdrawal terms. Ownership partially disclosed.
- **5.0–6.9**: Important fees buried in legal documents. Unclear withdrawal conditions. Opaque corporate structure.
- **Below 5.0**: Deceptive fee presentation. Hidden withdrawal restrictions. Anonymous ownership.

### 5. Platforms & Tools (15%)

We evaluate the range and quality of trading platforms, mobile apps, charting tools, and algorithmic trading support.

**Sub-criteria:**
| Sub-criterion                       | Weight |
|-------------------------------------|--------|
| Number of platforms offered         | 3%     |
| Mobile app quality                  | 3%     |
| Charting & analysis tools           | 3%     |
| Algo trading / API support          | 3%     |
| Demo account quality                | 3%     |

**Scoring guide:**
- **9.0–10.0**: 3+ platforms (MT4/MT5/cTrader/TradingView). Excellent mobile apps. API access. Full-featured demo.
- **7.0–8.9**: 2+ platforms with good mobile apps. Some API/algo support.
- **5.0–6.9**: Single platform or outdated software. Basic mobile experience.
- **Below 5.0**: Proprietary-only with limited features. Poor/no mobile app.

### 6. Execution Model (5%)

We assess the broker's declared execution model, liquidity sourcing, and order handling policy based on publicly available information.

**Sub-criteria:**
| Sub-criterion                       | Weight |
|-------------------------------------|--------|
| Execution model (ECN/STP vs MM)     | 2%     |
| Declared liquidity providers        | 1%     |
| Order execution policy (NDD?)       | 1%     |
| Execution statistics disclosure     | 1%     |

**Scoring guide:**
- **9.0–10.0**: Verified ECN/STP with disclosed liquidity providers. NDD execution. Published execution statistics.
- **7.0–8.9**: Hybrid model with partial STP. Some disclosure.
- **5.0–6.9**: Market maker with limited disclosure.
- **Below 5.0**: Undisclosed execution model. No dealing desk claims without evidence.

---

## Research Process

1. **Research & Shortlist** — Identify candidates through market research and user requests. Must have at least one Tier-1 license (knockout criterion).
2. **License Verification** — Verify every license number on the regulator's public database. Check authorization scope and disciplinary history.
3. **Data Collection** — Collect spread data, fee schedules, platform features, and account conditions from broker websites and independent sources.
4. **User Review Aggregation** — Aggregate Trustpilot scores, review volume, recency, and broker response patterns.
5. **Cross-Verification** — Cross-check data points across multiple sources. Flag discrepancies for manual review.
6. **Scoring & Review Writing** — Apply the scoring formula. Write the review. Fact-check with a second analyst.
7. **Quarterly Update** — Re-evaluate all published brokers every quarter. Update scores, data, and rankings.

---

## Score Tiers

| Score Range | Tier             | Meaning |
|-------------|------------------|---------|
| 9.0–10.0    | Excellent        | Top-tier broker. Strongly recommended. |
| 8.0–8.9     | Very Good        | High-quality with minor weaknesses. |
| 7.0–7.9     | Good             | Solid broker with some notable gaps. |
| 6.0–6.9     | Fair             | Below-average. Proceed with caution. |
| 0–5.9       | Not Recommended  | Serious issues. Do not recommend. |

---

## Changelog Format

Each score change is logged with: date, broker, old score → new score, reason.

Example:
```
Mar 2026 | IC Markets | 9.7 → 9.6 | Methodology v2 applied — new formula weights, CySEC moved to Tier 1.
```

---

*Last updated: March 2026*
*Version: 2.0*
