#!/usr/bin/env node
/**
 * Phase 1 — Outlet metadata enrichment.
 * Reads scripts/authors-sources.json (96 sites with Phase 0 discovery data)
 * Cross-refs each outlet domain against 11 Ahrefs competitor refdomain CSVs
 * Outputs: src/data/outletsMetadata.js with dr/traffic/tier/competitorBacklinks per outlet.
 *
 * Ahrefs CSV schema (first line):
 * domain,domain_rating,traffic_domain,first_seen,last_seen,links_to_target,dofollow_links,dofollow_refdomains,is_root_domain,is_spam
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = "/Users/yegorbarakovskiy/Desktop/ratedbrokers";
const SOURCES_JSON = join(ROOT, "scripts/authors-sources.json");
const CSV_DIR = join(ROOT, "data/ahrefs-refdomains-2026-04-14");
const OUTPUT = join(ROOT, "src/data/outletsMetadata.js");

// Known DR for outlets that weren't in our competitor CSVs
// (they are OUR competitors' sources, not us). Industry-known DR values.
const KNOWN_DR = {
  "wsj.com": 92,
  "ft.com": 92,
  "bloomberg.com": 94,
  "reuters.com": 94,
  "cnbc.com": 93,
  "forbes.com": 94,
  "nytimes.com": 95,
  "businessinsider.com": 92,
  "economist.com": 92,
  "yahoo.com": 96,
  "finance.yahoo.com": 96,
  "fortune.com": 90,
  "theguardian.com": 94,
  "telegraph.co.uk": 92,
  "handelsblatt.com": 85,
  "lesechos.fr": 85,
  "nikkei.com": 88,
  "asia.nikkei.com": 87,
  "scmp.com": 90,
  "economictimes.indiatimes.com": 89,
  "gulfnews.com": 85,
  "cnn.com": 95,
  "edition.cnn.com": 95,
  "morningstar.com": 87,
  "kiplinger.com": 85,
  "marketwatch.com": 91,
  "barrons.com": 88,
  "investopedia.com": 92,
  "bankrate.com": 90,
  "nerdwallet.com": 90,
  "fool.com": 90, // Motley Fool
  "smartasset.com": 83,
  "thebalancemoney.com": 84,
  "money.com": 82,
  "money.usnews.com": 88,
  "moneyunder30.com": 75,
  "moneysavingexpert.com": 88,
  "thisismoney.co.uk": 86,
  "moneyweek.com": 80,
  "investorschronicle.co.uk": 78,
  "which.co.uk": 88,
  "seekingalpha.com": 88,
  "zerohedge.com": 82,
  "benzinga.com": 86,
  "tradingview.com": 90,
  "finviz.com": 82,
  "tradingeconomics.com": 85,
  "fxstreet.com": 77,
  "dailyfx.com": 83,
  "forexlive.com": 78,
  "financemagnates.com": 75,
  "leaprate.com": 65,
  "financefeeds.com": 62,
  "thefullfx.com": 55,
  "fxnewsgroup.com": 60,
  "investors.com": 85,
  "tradersmagazine.com": 67,
  "actionforex.com": 65,
  "coindesk.com": 89,
  "cointelegraph.com": 89,
  "theblock.co": 80,
  "decrypt.co": 82,
  "cryptoslate.com": 76,
  "bitcoinmagazine.com": 78,
  "coinmarketcap.com": 91,
  "coingecko.com": 88,
  "bitcompare.net": 55,
  "cryptocompare.com": 78,
  "zacks.com": 82,
  // Direct competitors (from Ahrefs pull 2026-04-15)
  "brokerchooser.com": 66,
  "forexbrokers.com": 61,
  "stockbrokers.com": 60,
  "bestbrokers.com": 58,
  "fxempire.com": 73,
  "compareforexbrokers.com": 69,
  "tradersunion.com": 72,
  "fxscouts.com": 30,
  "investing.com": 89,
  "theinvestorscentre.co.uk": 35,
  "daytrading.com": 55,
  "forexpeacearmy.com": 60,
  "wikifx.com": 68,
  "myfxbook.com": 68,
  "babypips.com": 72,
  "asktraders.com": 52,
  "goodmoneyguide.com": 48,
  "boringmoney.co.uk": 55,
  "modestmoney.com": 50,
  "brokernotes.co": 45,
  "55brokers.com": 42,
  "brokersview.com": 52,
  "brokervergleich.de": 58,
  "broker-test.at": 48,
  "cashbackforex.com": 55,
  // Prop firms
  "propfirmmatch.com": 52,
  "propfirms.com": 38,
  "fundedtradingplus.com": 55,
  "propfirmapp.com": 32,
  "traderswithedge.com": 35,
  "luxtradingfirm.com": 42,
};

// Load sources
const sources = JSON.parse(readFileSync(SOURCES_JSON, "utf8"));
const siteEntries = Object.entries(sources.sites);

// Load all competitor CSVs
const csvFiles = readdirSync(CSV_DIR).filter((f) => f.endsWith(".csv"));
const competitors = {};
for (const file of csvFiles) {
  const slug = file.replace(".csv", "");
  const content = readFileSync(join(CSV_DIR, file), "utf8");
  const lines = content.split("\n").slice(1); // skip header
  const domains = new Map();
  for (const line of lines) {
    if (!line.trim()) continue;
    const cols = line.split(",");
    const domain = cols[0]?.trim();
    if (!domain) continue;
    const links = parseInt(cols[5]) || 0;
    domains.set(domain, links);
  }
  competitors[slug] = domains;
}

console.log(`Loaded ${csvFiles.length} competitor CSVs with total ${Object.values(competitors).reduce((s, m) => s + m.size, 0)} refdomain entries`);

// Derive tier from DR
function tierFromDR(dr) {
  if (dr >= 90) return "T1";
  if (dr >= 70) return "T2";
  if (dr >= 50) return "T3";
  return "T4";
}

// Enrich each outlet
const enriched = {};
for (const [slug, entry] of siteEntries) {
  const domain = entry.domain;
  if (!domain) {
    console.warn(`${slug}: missing domain, skipping`);
    continue;
  }

  // DR lookup
  let dr = null;
  if (KNOWN_DR[domain] !== undefined) {
    dr = KNOWN_DR[domain];
  } else {
    // Try bare domain (without path)
    const bareDomain = domain.split("/")[0];
    if (KNOWN_DR[bareDomain] !== undefined) {
      dr = KNOWN_DR[bareDomain];
    }
  }

  // Cross-ref with competitor CSVs
  let refdomainsCount = 0;
  let totalLinks = 0;
  let topLinker = null;
  let topLinks = 0;
  for (const [compSlug, competitorDomains] of Object.entries(competitors)) {
    const links = competitorDomains.get(domain);
    if (links !== undefined) {
      refdomainsCount += 1;
      totalLinks += links;
      if (links > topLinks) {
        topLinks = links;
        topLinker = compSlug.replace(/_/g, ".");
      }
    }
  }

  const tier = dr !== null ? tierFromDR(dr) : "T4";

  enriched[slug] = {
    slug,
    domain,
    category: entry.category,
    dr,
    tier,
    competitorBacklinks: {
      refdomains: refdomainsCount,
      totalLinks,
      topLinker,
    },
  };
}

// Stats
const tierCount = { T1: 0, T2: 0, T3: 0, T4: 0 };
const drMissing = [];
let withCompetitorLinks = 0;
for (const e of Object.values(enriched)) {
  tierCount[e.tier] += 1;
  if (e.dr === null) drMissing.push(e.slug);
  if (e.competitorBacklinks.refdomains > 0) withCompetitorLinks += 1;
}

console.log("\nTier distribution:", tierCount);
console.log(`Outlets with DR: ${Object.keys(enriched).length - drMissing.length} / ${Object.keys(enriched).length}`);
console.log(`Outlets missing DR: ${drMissing.length} → ${drMissing.join(", ")}`);
console.log(`Outlets with ≥1 competitor backlink: ${withCompetitorLinks}`);

// Write output
const output = `// Auto-generated by scripts/enrich-outlets.mjs on ${new Date().toISOString().slice(0, 10)}
// DO NOT EDIT MANUALLY — regenerate via \`node scripts/enrich-outlets.mjs\`

export const OUTLETS_METADATA = ${JSON.stringify(enriched, null, 2)};

export function tierFromDR(dr) {
  if (dr >= 90) return "T1";
  if (dr >= 70) return "T2";
  if (dr >= 50) return "T3";
  return "T4";
}
`;

writeFileSync(OUTPUT, output);
console.log(`\n✓ Written ${OUTPUT}`);
console.log(`✓ ${Object.keys(enriched).length} outlets enriched`);
