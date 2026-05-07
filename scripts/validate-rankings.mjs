#!/usr/bin/env node
// Anti-recurrence guard for the d04440b non-broker URL incident (2026-04 → 2026-05).
// Usage: node scripts/validate-rankings.mjs   (also wired as `npm run rankings:validate`)
// Fails CI if a ranking entry has no filter, or its slug doesn't read as a broker page
// without an explicit whitelist exception.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const rankingsSrc = readFileSync(resolve(ROOT, "src/data/rankings.js"), "utf8");
const filtersSrc = readFileSync(resolve(ROOT, "src/data/rankingFilters.js"), "utf8");

// Slugs that legitimately don't contain "broker(s)" but are still about brokers.
// Add here only after explicit confirmation that the slug truly maps to broker pages.
const SLUG_WHITELIST = new Set([
  // Copy / social trading — eToro, NAGA, ZuluTrade are brokers
  "/best-copy-trading-platforms",
  "/best-copy-trading-apps",
  "/best-copy-trading-for-beginners",
  "/best-copy-trading-uk",
  "/best-copy-trading-usa",
  "/best-free-copy-trading-platforms",
  "/best-crypto-copy-trading",
  "/best-stock-copy-trading-platforms",
  "/best-forex-copy-trading-platforms",
  "/best-social-trading-platforms",
  // Demo accounts — provided by brokers
  "/best-forex-demo-accounts",
  "/best-crypto-demo-accounts",
  // Spread betting — UK product, all via brokers
  "/best-forex-spread-betting",
  "/best-shares-spread-betting",
  "/best-index-spread-betting",
  "/best-spread-betting-apps",
  "/best-spread-betting-uk",
  "/best-spread-betting-for-beginners",
  "/best-spread-betting-day-trading",
  "/best-spread-betting-scalping",
  // Trading apps / platforms — broker-provided apps and platforms
  "/best-forex-trading-apps",
  "/best-forex-apps-iphone",
  "/best-forex-apps-android",
  "/best-stock-trading-apps",
  "/best-stock-trading-platforms",
  "/best-options-trading-platforms",
  "/best-futures-trading-platforms",
  "/best-options-paper-trading",
  // UK ISA accounts — held with brokers
  "/best-stocks-and-shares-isa",
]);

// Parse rankings.js → { id, slug }
const rankingRe = /\{\s*id:\s*"([^"]+)",\s*slug:\s*"([^"]+)"/g;
const rankings = [];
for (const m of rankingsSrc.matchAll(rankingRe)) {
  rankings.push({ id: m[1], slug: m[2] });
}

// Parse rankingFilters.js → Sets of IDs.
// Three top-level objects exist: FILTERS (per-ranking), TYPE_FILTERS / GEO_FILTERS
// (helper maps for combinatorial IDs). Runtime lookup is `FILTERS[id] || combi(id) || all`,
// so a ranking ID is "covered" if it appears in EITHER FILTERS or TYPE_FILTERS.
// Orphan-check uses FILTERS only — entries in the helper maps are intentionally
// shared with combi pages and shouldn't be flagged.
function extractObjectKeys(source, declToken) {
  const start = source.indexOf(declToken);
  if (start === -1) return new Set();
  const end = source.indexOf("\n};", start);
  const block = source.slice(start, end === -1 ? undefined : end);
  const keys = new Set();
  const re = /^\s*"([a-z0-9-]+)":/gm;
  for (const m of block.matchAll(re)) keys.add(m[1]);
  return keys;
}

const mainFilterIds = extractObjectKeys(filtersSrc, "const FILTERS = {");
const typeFilterIds = extractObjectKeys(filtersSrc, "const TYPE_FILTERS = {");
if (mainFilterIds.size === 0) {
  console.error("Could not parse `const FILTERS = {` in rankingFilters.js");
  process.exit(1);
}
const filterIds = new Set([...mainFilterIds, ...typeFilterIds]);

const errors = [];
const seenIds = new Set();
const seenSlugs = new Set();

for (const { id, slug } of rankings) {
  // Duplicate IDs
  if (seenIds.has(id)) errors.push(`Duplicate id: "${id}"`);
  seenIds.add(id);
  // Duplicate slugs
  if (seenSlugs.has(slug)) errors.push(`Duplicate slug: "${slug}"`);
  seenSlugs.add(slug);

  // Slug must read as a broker page, OR be whitelisted
  const slugSaysBroker = /-brokers?(?:-|$)/.test(slug);
  if (!slugSaysBroker && !SLUG_WHITELIST.has(slug)) {
    errors.push(
      `Non-broker slug without whitelist: "${slug}" (id="${id}"). ` +
      `Either use a /-broker(s)- slug, or add the slug to SLUG_WHITELIST in scripts/validate-rankings.mjs ` +
      `with a one-line justification why it legitimately maps to broker pages.`
    );
  }

  // Every ranking needs a filter
  if (!filterIds.has(id)) {
    errors.push(`Missing filter for id="${id}" (slug="${slug}") in rankingFilters.js`);
  }
}

// Orphan filter IDs (filter exists but no ranking uses it) — non-fatal warning.
// Only check the main FILTERS object. TYPE_FILTERS / GEO_FILTERS keys are
// intentionally reused by combi pages, so flagging them would be noise.
const rankingIds = new Set(rankings.map((r) => r.id));
const orphans = [];
for (const id of mainFilterIds) {
  if (!rankingIds.has(id) && !id.startsWith("combi-")) orphans.push(id);
}

console.log(`Validated ${rankings.length} rankings, ${filterIds.size} filter rules.`);
if (orphans.length) {
  console.log(`⚠️  ${orphans.length} orphan filter(s) (no ranking uses them): ${orphans.join(", ")}`);
}

if (errors.length) {
  console.error(`\n❌ ${errors.length} error(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log("✅ All rankings have filters and a broker-intent slug (or whitelist exception).");
