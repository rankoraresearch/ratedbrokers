const data = {
  name: "Germany", slug: "germany", code: "DE", flag: "\u{1F1E9}\u{1F1EA}",
  regulator: "BaFin", regulatorFull: "Bundesanstalt f\u00FCr Finanzdienstleistungsaufsicht",
  regulatorUrl: "https://www.bafin.de", currency: "EUR",
  leverage: "1:30", leverageNote: "Retail (ESMA rules, 1:500 for Professional)",
  compensation: "EdW \u2014 \u20AC20,000 per person (90% of claim)",
  negativeBalance: "Yes \u2014 mandatory under ESMA/BaFin rules",
  taxNote: "Forex profits are subject to Abgeltungsteuer (flat 25% + solidarity surcharge).",
  localPayments: ["Bank Transfer (SEPA)", "Visa/Mastercard", "Sofort\u00FCberweisung", "Giropay", "PayPal"],
  year: "2026", updatedDate: "February 28, 2026",
  brokersTested: 50, localBrokersTotal: 35, hoursResearch: 92,
  author: { name: "Stefan Weber", role: "European Markets Analyst", exp: "16 years", initials: "SW", linkedin: "#" },
  factChecker: "Marcus Chen",
  metaTitle: "9 Best Forex Brokers in Germany for 2026 \u2014 BaFin Regulated",
  metaDescription: "We analyzed 35 BaFin-registered brokers for German traders. These 9 offer the best trading conditions including EdW protection, SEPA transfers, and German-language support.",
  keyFinding: "German traders benefit from both BaFin oversight and ESMA-wide protections. All our top-rated brokers are either directly BaFin-regulated or operate under EU passporting from equally strong regulators like CySEC. The 2021 tax law change limiting loss offset to \u20AC20,000/year makes broker selection especially important.",

  brokers: [
    { rank: 1, slug: "ig", badge: "Best Overall Germany", badgeColor: "#059669", localCurrencyMin: "\u20AC0", verdict: "Most trusted broker for German traders. BaFin-registered with 50+ years of history and a full German-language platform.", localAdvantages: ["BaFin-registered (154814)", "Full German-language platform & support", "EUR base account \u2014 no conversion fees", "17,000+ markets available", "Free ProRealTime charting"], spreadBetting: false, localAccount: true, localRegRef: "154814" },
    { rank: 2, slug: "cmc-markets", badge: "Best Platform", badgeColor: "#2563eb", localCurrencyMin: "\u20AC0", verdict: "Best proprietary platform for German traders. BaFin-registered with 330+ forex pairs and the award-winning Next Generation platform.", localAdvantages: ["BaFin-registered, Frankfurt office", "German-language Next Generation platform", "330+ forex pairs \u2014 industry leading", "No minimum deposit", "SEPA instant transfers"], spreadBetting: false, localAccount: true, localRegRef: "154963" },
    { rank: 3, slug: "xtb", badge: "Best German-Language Experience", badgeColor: "#059669", localCurrencyMin: "\u20AC0", verdict: "Best German-language experience with Frankfurt office. xStation platform fully localised for German traders.", localAdvantages: ["BaFin-registered, Frankfurt office", "xStation 5 fully in German", "0% commission real stocks up to \u20AC100K/mo", "German-speaking phone support", "Free SEPA deposits and withdrawals"], spreadBetting: false, localAccount: true, localRegRef: "152913" },
    { rank: 4, slug: "saxo-bank", badge: "Best for Professionals", badgeColor: "#6d28d9", localCurrencyMin: "\u20AC0", verdict: "Premium multi-asset platform ideal for German professionals. 72,000+ instruments with bank-level security.", localAdvantages: ["BaFin-registered, Danish bank", "72,000+ instruments", "DMA access to Xetra and other exchanges", "EUR base account", "Premium research from Saxo Strats"], spreadBetting: false, localAccount: true, localRegRef: "155900" },
    { rank: 5, slug: "pepperstone", badge: "Best for Active Traders", badgeColor: "#d97706", localCurrencyMin: "\u20AC0", verdict: "Excellent execution and the tightest spreads for active German traders. BaFin-registered via CySEC passporting.", localAdvantages: ["BaFin-registered via EU passport", "0.0 pip raw spreads EUR/USD", "TradingView + cTrader + MT4/5", "German-language support", "EUR account with SEPA transfers"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 6, slug: "ic-markets", badge: "Tightest Spreads", badgeColor: "#d97706", localCurrencyMin: "\u20AC200", verdict: "Tightest raw spreads in our analysis at 0.02 pips average. Strong ECN offering for cost-conscious German traders.", localAdvantages: ["CySEC-regulated, EU passported", "0.02 pip average EUR/USD spread", "EUR base account available", "True ECN with 25+ liquidity providers", "cTrader + TradingView support"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 7, slug: "etoro", badge: "Best Social Trading", badgeColor: "#2563eb", localCurrencyMin: "\u20AC50", verdict: "Best social and copy trading platform for German beginners. Simple interface with full German localisation.", localAdvantages: ["BaFin-registered via CySEC passport", "CopyTrader \u2014 follow top traders", "Full German-language platform", "Fractional shares from \u20AC10", "SEPA deposits accepted"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 8, slug: "fxpro", badge: null, badgeColor: null, localCurrencyMin: "\u20AC100", verdict: "Well-regulated multi-platform broker with strong execution and German-language support.", localAdvantages: ["CySEC-regulated, EU passported", "EUR base account", "cTrader + MT4/5", "German-language support", "Negative balance protection"], spreadBetting: false, localAccount: true, localRegRef: null },
    { rank: 9, slug: "admirals", badge: null, badgeColor: null, localCurrencyMin: "\u20AC100", verdict: "Solid choice for German traders with strong educational content in German and competitive pricing.", localAdvantages: ["BaFin-registered, Berlin office", "Full German-language platform", "MetaTrader Supreme Edition included", "Premium Analytics in German", "Free SEPA deposits"], spreadBetting: false, localAccount: true, localRegRef: "152360" },
  ],

  regulation: {
    title: "How BaFin and ESMA Protect German Traders",
    items: [
      { icon: "\u{1F6E1}\uFE0F", title: "BaFin Registration Required", desc: "Any broker serving German clients must be registered with BaFin, either directly or via EU passporting. Check any broker\u2019s status at the BaFin register (bafin.de) before opening an account." },
      { icon: "\u{1F4B0}", title: "EdW Compensation \u2014 \u20AC20,000", desc: "The Entsch\u00E4digungseinrichtung der Wertpapierhandelsunternehmen (EdW) covers up to 90% of claims, maximum \u20AC20,000 per person, if a BaFin-regulated broker becomes insolvent." },
      { icon: "\u2696\uFE0F", title: "Negative Balance Protection", desc: "Under ESMA rules (implemented by BaFin), retail clients cannot lose more than their deposited funds. This protection is mandatory for all brokers serving German retail traders." },
      { icon: "\u{1F4CA}", title: "ESMA Leverage Limits", desc: "German retail traders are limited to 1:30 for major forex, 1:20 minor/gold, 1:10 commodities, 1:5 equities, 1:2 crypto. BaFin enforces ESMA\u2019s product intervention measures." },
      { icon: "\u{1F6AB}", title: "CFD Loss Offset Limited", desc: "Since 2021, German tax law limits the offset of CFD/derivative losses to \u20AC20,000 per year against derivative gains. This is a significant consideration for active German traders." },
      { icon: "\u{1F4CB}", title: "Risk Warnings Mandatory", desc: "All brokers must display clear risk warnings in German, including the percentage of retail accounts losing money. Marketing of complex financial products to retail clients is strictly regulated." },
    ],
  },

  comparisonTable: {
    title: "BaFin Direct vs EU Passported Brokers",
    subtitle: "German traders can use directly BaFin-regulated brokers or EU-passported brokers \u2014 here\u2019s the difference.",
    headers: ["Feature", "BaFin Direct", "EU Passported"],
    rows: [
      ["Local Office", "\u2705 Usually yes", "\u26A0\uFE0F Varies"],
      ["EdW Compensation", "\u2705 \u20AC20,000", "\u26A0\uFE0F Home country scheme"],
      ["German Support", "\u2705 Required", "\u26A0\uFE0F Varies"],
      ["ESMA Protections", "\u2705 Same", "\u2705 Same"],
      ["Leverage Limits", "\u2705 1:30 retail", "\u2705 1:30 retail"],
      ["Negative Balance", "\u2705 Mandatory", "\u2705 Mandatory"],
      ["Best For", "Maximum safety", "Wider broker choice"],
    ],
  },

  tax: [
    { q: "How Are Forex Profits Taxed in Germany?", a: "Forex profits are subject to Abgeltungsteuer (flat-rate withholding tax) of 25% plus 5.5% solidarity surcharge (Solidarit\u00E4tszuschlag), totalling approximately 26.375%. Church tax (Kirchensteuer) of 8\u20139% may also apply. Your broker may withhold this automatically if it\u2019s a German entity." },
    { q: "What Is the \u20AC20,000 Loss Offset Rule?", a: "Since January 2021, German tax law limits the annual offset of losses from derivatives (including CFDs) to \u20AC20,000 per year against derivative gains. Losses exceeding \u20AC20,000 are carried forward. This controversial rule significantly impacts active traders and is widely criticized by the trading community." },
    { q: "Is There a Tax-Free Allowance?", a: "Yes. Germany\u2019s Sparerpauschbetrag (saver\u2019s lump sum) is \u20AC1,000 per person (\u20AC2,000 for married couples filing jointly) per year. Capital gains including forex profits below this threshold are tax-free. Submit a Freistellungsauftrag to your broker to apply it automatically." },
    { q: "Do German Brokers Withhold Tax Automatically?", a: "German-based brokers (e.g., those with a BaFin licence and German banking licence) typically withhold Abgeltungsteuer automatically. EU-passported brokers based in Cyprus, UK, or elsewhere generally do not \u2014 you must declare profits in your annual Steuererkl\u00E4rung." },
  ],

  payments: [
    { method: "SEPA Bank Transfer", deposit: "Free", withdrawal: "Free", time: "1-2 business days", note: "Best for Germany" },
    { method: "Sofort\u00FCberweisung", deposit: "Free", withdrawal: "N/A", time: "Instant", note: "Most brokers" },
    { method: "Visa/Mastercard", deposit: "Free", withdrawal: "Free", time: "Instant / 1-3d", note: "Debit & credit" },
    { method: "PayPal", deposit: "Free", withdrawal: "Free", time: "Instant / 1d", note: "Selected brokers" },
  ],

  guide: [
    { q: "How to Verify a BaFin-Registered Broker", a: "Visit the BaFin company database at bafin.de and search by broker name or registration number. Confirm the broker\u2019s status is active and check which financial services they\u2019re authorised to provide. EU-passported brokers will also appear in the register." },
    { q: "Should German Traders Choose a Local or EU Broker?", a: "Directly BaFin-regulated brokers offer the strongest protections including EdW compensation and guaranteed German-language support. EU-passported brokers offer the same ESMA protections (leverage, negative balance) but compensation depends on the home country scheme (e.g., ICF in Cyprus at \u20AC20,000)." },
    { q: "How Does the \u20AC20,000 Loss Rule Affect Trading Strategy?", a: "The loss offset cap means active traders should carefully manage risk to avoid large losses that cannot be fully offset. Consider: reducing position sizes, using tighter stops, or trading physical equities (not subject to the cap) alongside derivatives." },
    { q: "Can German Traders Access Higher Leverage?", a: "Under ESMA rules enforced by BaFin, retail leverage is capped at 1:30 for major forex. You can apply for Professional Client status if you meet 2 of 3 criteria: 10+ large trades per quarter, \u20AC500,000+ portfolio, or 1+ year in relevant financial role. Professionals lose some retail protections." },
    { q: "German Tax Reporting for Forex Traders", a: "If your broker does not withhold Abgeltungsteuer, you must report forex profits in your annual Steuererkl\u00E4rung under \u2018Eink\u00FCnfte aus Kapitalverm\u00F6gen\u2019 (Anlage KAP). Keep detailed records of all trades, including opening/closing prices, dates, and fees." },
  ],

  faq: [
    { q: "What is the best forex broker in Germany for 2026?", a: "IG is our top pick for German traders in 2026. It\u2019s directly BaFin-registered (154814), offers a full German-language platform, 17,000+ markets, EUR accounts, and free SEPA transfers." },
    { q: "Are forex profits taxable in Germany?", a: "Yes. Profits are subject to 25% Abgeltungsteuer plus solidarity surcharge (~26.375% total). The first \u20AC1,000/year (\u20AC2,000 for couples) is tax-free under the Sparerpauschbetrag." },
    { q: "Is forex trading legal in Germany?", a: "Yes, forex trading is fully legal and well-regulated in Germany. BaFin oversees all financial services, and ESMA\u2019s EU-wide rules provide additional protections for retail traders." },
    { q: "What is the \u20AC20,000 loss offset rule?", a: "Since 2021, German tax law limits annual derivative loss offsets to \u20AC20,000 against derivative gains. Excess losses carry forward. This applies to CFDs, options, and other derivatives \u2014 not to spot forex or physical equities." },
    { q: "What leverage can German traders use?", a: "German retail traders are limited to 1:30 on major forex pairs under ESMA rules. Professional clients may access up to 1:500 but lose certain retail protections." },
    { q: "Is there deposit protection in Germany?", a: "Yes. The EdW covers up to 90% of claims, maximum \u20AC20,000 per person, for eligible investment firms. Some brokers with banking licences also participate in the Einlagensicherungsfonds with higher coverage." },
    { q: "Do German brokers offer EUR accounts?", a: "Yes, all our top-rated brokers offer EUR base accounts, eliminating currency conversion fees on trades and deposits." },
    { q: "Can I use Sofort\u00FCberweisung for deposits?", a: "Yes, most brokers serving Germany accept Sofort\u00FCberweisung for instant deposits. SEPA bank transfers are also free but take 1\u20132 business days." },
  ],

  related: [
    { name: "Best BaFin-Regulated Brokers", icon: "\u{1F6E1}\uFE0F", count: 12, url: "#" },
    { name: "Best ECN Brokers", icon: "\u26A1", count: 12, url: "#" },
    { name: "Best Low-Spread Brokers", icon: "\u{1F4B0}", count: 10, url: "#" },
    { name: "Brokers in UK", icon: "\u{1F1EC}\u{1F1E7}", count: 10, url: "/best-forex-brokers-uk" },
    { name: "Brokers in UAE", icon: "\u{1F1E6}\u{1F1EA}", count: 8, url: "/best-forex-brokers-uae" },
    { name: "Brokers in Australia", icon: "\u{1F1E6}\u{1F1FA}", count: 10, url: "/best-forex-brokers-australia" },
  ],
};

export default data;
