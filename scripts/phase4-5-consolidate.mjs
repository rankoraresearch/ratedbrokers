#!/usr/bin/env node
/**
 * Phase 4+5 — Dedup cross-outlet authors + E-E-A-T scoring.
 * Reads scripts/harvest-phase3-consolidated.json
 * Outputs src/data/authorsHarvested.js with 500+ enriched authors, ready for UI merge.
 */

import { readFileSync, writeFileSync } from "node:fs";

const ROOT = "/Users/yegorbarakovskiy/Desktop/ratedbrokers";
const INPUT = `${ROOT}/scripts/harvest-phase3-consolidated.json`;
const OUTLETS_META = `${ROOT}/src/data/outletsMetadata.js`;
const OUTPUT = `${ROOT}/src/data/authorsHarvested.js`;

const SITES_RAW = readFileSync(OUTLETS_META, "utf8");
// Crude parse of OUTLETS_METADATA
const sitesMatch = SITES_RAW.match(/export const OUTLETS_METADATA = ({[\s\S]*?});/);
const OUTLETS = JSON.parse(sitesMatch[1]);

const data = JSON.parse(readFileSync(INPUT, "utf8"));
const rawAuthors = data.authors;
console.log(`Loaded ${rawAuthors.length} authors`);

// ========== Phase 4 — Dedup cross-outlet ==========
const normName = (n) => (n || "").toLowerCase().trim().replace(/\s+/g, " ");
const normLinkedin = (u) => {
  if (!u) return null;
  return u.replace(/https?:\/\/(www\.)?(uk\.|hu\.|de\.|fr\.|ca\.|in\.|sg\.)?linkedin\.com\/in\//, "").replace(/\/$/, "").toLowerCase();
};

const byKey = new Map();
const duplicates = [];
for (const a of rawAuthors) {
  const linkedinHandle = normLinkedin(a.linkedin);
  // Primary key: linkedin handle. Fallback: name.
  const key = linkedinHandle || normName(a.name);
  if (byKey.has(key)) {
    // Merge cross-outlet
    const existing = byKey.get(key);
    const newOutlets = new Set([...(existing.writesFor || []), ...(a.writesFor || [])]);
    if (a.site && !newOutlets.has(a.site)) newOutlets.add(a.site);
    existing.writesFor = [...newOutlets];
    // Keep better fields
    for (const field of ["bio", "email", "twitter", "muckrack", "personalSite", "yearsInIndustry", "location"]) {
      if (!existing[field] && a[field]) existing[field] = a[field];
    }
    // Merge arrays
    for (const field of ["certifications", "education", "employmentHistory"]) {
      if (!existing[field]) existing[field] = [];
      if (a[field]) existing[field] = [...existing[field], ...a[field]];
    }
    // Merge mediaSignals
    if (a.mediaSignals) {
      existing.mediaSignals = existing.mediaSignals || {};
      for (const key of ["quotedInTier1", "tvAppearances", "authoredBooks", "awards"]) {
        const merged = new Set([...(existing.mediaSignals[key] || []), ...(a.mediaSignals[key] || [])]);
        if (merged.size > 0) existing.mediaSignals[key] = [...merged];
      }
    }
    duplicates.push({ key, name: a.name, merged_into: existing.name });
  } else {
    byKey.set(key, { ...a });
  }
}
console.log(`Deduped: ${duplicates.length} merges, ${byKey.size} unique authors`);

// ========== Phase 5 — E-E-A-T scoring ==========
const SENIORITY_BONUS = {
  chief: 18, editor: 15, senior: 12, staff: 8,
  contributor: 5, guest: 3, junior: 4, former: -15,
};

function calcAuthorScore(a) {
  const outlet = OUTLETS[a.site] || { dr: 40 };
  let score = 0;
  score += (outlet.dr || 0) * 0.35;
  score += a.badge === "A" ? 20 : a.badge === "B" ? 10 : 15; // default A-like
  score += SENIORITY_BONUS[a.seniority] ?? 0;
  if (a.linkedin) score += 10;
  if (a.muckrack) score += 5;
  if (a.twitter) score += 3;
  if (a.email) score += 5;
  const certs = a.certifications?.length || 0;
  score += certs * 4;
  if ((a.writesFor?.length || 1) > 1) score += 8;
  if (outlet.competitorBacklinks?.refdomains >= 3) score += 5;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function calcAuthoritativeness(a) {
  let auth = 0;
  const certs = a.certifications?.length || 0;
  auth += certs * 8;
  const years = a.yearsInIndustry || 0;
  auth += years >= 15 ? 10 : Math.floor(years / 1.5);
  const t1 = a.mediaSignals?.quotedInTier1?.length || 0;
  auth += t1 * 3;
  const tv = a.mediaSignals?.tvAppearances?.length || 0;
  auth += Math.min(tv * 2, 6);
  const books = a.mediaSignals?.authoredBooks?.length || 0;
  auth += books >= 1 ? 5 : 0;
  if (a.muckrack) auth += 3;
  if (a.trustSignals?.ownedDomain || a.personalSite) auth += 3;
  const outlets = a.writesFor?.length || 1;
  auth += outlets > 1 ? (outlets - 1) * 3 : 0;
  const outlet = OUTLETS[a.site] || {};
  if (outlet.competitorBacklinks?.refdomains >= 3) auth += 3;
  if (a.trustSignals?.finraBrokerCheckStatus === "clean") auth += 5;
  if (a.status === "former") auth -= 5;
  return Math.max(0, Math.min(50, Math.round(auth)));
}

const deriveEEATTier = (auth) => {
  if (auth >= 40) return "S";
  if (auth >= 25) return "A";
  if (auth >= 12) return "B";
  return "C";
};

// Apply scoring
const finalAuthors = [];
for (const a of byKey.values()) {
  const score = calcAuthorScore(a);
  const authoritativeness = calcAuthoritativeness(a);
  const finalScore = Math.round(score * (1 + authoritativeness / 100));
  const eeatTier = deriveEEATTier(authoritativeness);
  // Dedupe arrays
  const dedupeArr = (arr, key) => {
    if (!arr || !Array.isArray(arr)) return arr;
    const seen = new Set();
    return arr.filter((x) => {
      const k = typeof x === "string" ? x : JSON.stringify(x);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  };
  finalAuthors.push({
    ...a,
    certifications: dedupeArr(a.certifications || []),
    education: dedupeArr(a.education || []),
    employmentHistory: dedupeArr(a.employmentHistory || []),
    writesFor: [...new Set(a.writesFor || [a.site])],
  });
}

// Stats
const byTier = { S: 0, A: 0, B: 0, C: 0 };
for (const a of finalAuthors) {
  const auth = calcAuthoritativeness(a);
  byTier[deriveEEATTier(auth)]++;
}
console.log(`\n=== E-E-A-T Tier Distribution ===`);
for (const [t, c] of Object.entries(byTier)) console.log(`  ${t}: ${c}`);

// Write output as module with new SITES (if needed) + AUTHORS
const output = `// Auto-generated by scripts/phase4-5-consolidate.mjs on ${new Date().toISOString().slice(0, 10)}
// Harvested ${finalAuthors.length} authors from 96 outlets.
// Phase 4 dedup + Phase 5 E-E-A-T scoring applied.

export const HARVESTED_AUTHORS = ${JSON.stringify(finalAuthors, null, 2)};
`;

writeFileSync(OUTPUT, output);
console.log(`\n✓ Written ${OUTPUT}`);
console.log(`✓ ${finalAuthors.length} unique authors, ${duplicates.length} dedupes`);
